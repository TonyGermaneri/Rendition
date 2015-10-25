/*
Copyright (c) 2012 Tony Germaneri
Permission is hereby granted,
 free of charge, to any person obtaining a copy of this software 
and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, 
sublicense, and/or sell copies of the Software, and to permit 
persons to whom the Software is furnished to do so, subject to the
 following conditions:
The above copyright notice and this 
permission notice shall be included in all copies or substantial 
portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", 
WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
OTHERWISE, AR
SING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Threading;
using System.IO.Compression;
using System.Text.RegularExpressions;
namespace Rendition {
	internal partial class Main : IHttpModule {
        #region Http Pipeline Begin Request
        /// <summary>
        /// Primary Http Pipline.
		/// Begins the v client request.
		/// </summary>
		/// <param name="sender">The sender.</param>
		/// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
		void BeginRequest( object sender, EventArgs e ) {
            /* start the site, or wait 
            * until it's finished starting */
            waitUntilStartup();
            HttpApplication app = (HttpApplication)sender;
            HttpContext current = HttpContext.Current;
            /* raise beginrequest events */
            BeginRequestEventArgs beginRequestEventArgs = new BeginRequestEventArgs(current, app, e);
            Site.raiseOnBeginRequest(beginRequestEventArgs);
            if(beginRequestEventArgs.AbortDefault) {
                /* if the event handler says stop messin with the pipeline then quit */
                return;
            }
			string executionFilePath = current.Request.AppRelativeCurrentExecutionFilePath;
			bool _isVirtualResourcePath = IsVirtualResourcePath( executionFilePath );
			bool _isResourceFile = IsResourceFile( executionFilePath );
			bool _useRewrite = !_isVirtualResourcePath && !_isResourceFile;
			string encodings = current.Request.Headers.Get( "Accept-Encoding" );
			if(encodings!=null){
				encodings.ToLower();
				/* compress */
				if( encodings != null && _isVirtualResourcePath) {
                    if(executionFilePath.EndsWith(".js") || executionFilePath.EndsWith(".html")) {
                        if(encodings.Contains("gzip")) {
                            current.Response.AppendHeader("Content-Encoding", "gzip");
                            current.Response.Filter = new GZipStream(current.Response.Filter, CompressionMode.Compress);
                        } else if(encodings.Contains("deflate")) {
                            current.Response.AppendHeader("Content-Encoding", "deflate");
                            current.Response.Filter = new DeflateStream(current.Response.Filter, CompressionMode.Compress);
                        }
                    }
				}
			}
			bool _JSONResponse = false;
            /* response filters - but only if there's response filters */
            if(_useRewrite && Main.Site.Redirectors != null) {
                if(Main.Site.Redirectors.List.FindAll(delegate(Commerce.Redirector rdr) {
                    return rdr.RedirectorType == RedirectorTypes.ResponseFilter && rdr.Enabled;
                }).Count > 0) {
                    current.Response.Filter = new RewriteHtml(current.Response.Filter);
                }
            }
			/* AJAX requests */
			try {
				_JSONResponse = processHTTPRequest( app );
			} catch( Exception ex ) {
				/* ignore "Thread was being aborted." messages
				 * caused by Response.End(), Response.Redirect() and Server.Transfer()*/
				if(!ex.Message.Contains("Thread was being aborted")){
					String.Format("BeginRequest Exception =>{0}", ex.Message).Debug(0);
				}
			}
		}
        #endregion
        #region Json mapper
        /// <summary>
        /// Process JSON messages.
        /// Map some messages to methods.
        /// Map some messages to embedded resources.
        /// Secondary HTTP Pipeline.
        /// </summary>
        /// <param name="httpApp">The Http app.</param>
        /// <returns>When true, a AJAX responder was called</returns>
        private static bool processHTTPRequest(HttpApplication httpApp) {
            /* get the current http context */
            bool _JSONResponse = false;
            HttpContext current = HttpContext.Current;
            /* start a Timer */
            DateTime startHTTPRequest = DateTime.Now;
            current.Items.Add("startHTTPRequest", startHTTPRequest);
            /* create a reference to the session object */
            Session session = null;
            string executionFilePath = current.Request.AppRelativeCurrentExecutionFilePath;
            bool _isVirtualResourcePath = IsVirtualResourcePath(executionFilePath);
            /* ***1*** make sure user's don't request an invalid file resource by redirecting */
            if(Main.AdminDirectory == executionFilePath) {
                current.Response.Redirect(Main.AdminDirectory + "/", false);
                current.ApplicationInstance.CompleteRequest();
                goto End;
            }
            /* ***2*** if this is not a request for a /Admin or /responder directory
             * implement the rewriter directives */
            if(!_isVirtualResourcePath) {
                /* try to redirect the URL */
                if(redirectUrl(current)) { goto End; };
                /* try to rewrite the URL */
                if(RewriteUrl(current)) { goto End; };
                /* site section rewrites */
                if(RewriteSiteSection(current)) { goto End; };
                /* check for category rewrites */
                if(RewriteCategory(current)) { goto End; };
                /* check for item rewrites */
                if(RewriteItem(current)) { goto End; };
            }
            /* ***3*** don't try and examine the physical path until _after_ the rewrite */
            string physicalPath = current.Request.PhysicalPath;
            bool _isResourceFile = IsResourceFile(physicalPath);

            /* if this is an image or other non dynamic resource file
             * and not used in a virtual path than don't do any further processing */
            if(_isResourceFile && !_isVirtualResourcePath) {
                sendNeverExpiresHeaders();
                goto End;
            }
            /* if this is a public resource, give up the resource now */
            foreach(string file in Main.PublicFiles) {
                if(executionFilePath == file || executionFilePath.StartsWith(Main.AdminDirectory + "/img")) {
                    sendNeverExpiresHeaders();
                    getResxResource(current);
                    goto End;
                }
            }
            /* no rewrite or redirect so now check if the file exists */
            if(!File.Exists(physicalPath) && !_isVirtualResourcePath) {
                ErrorPage(current, 404, String.Format("Cannot find {0}", physicalPath));
                goto End;
            }
            /* the file or resource exists (probably)
             * create a Session
             * this is resource consuming */
            session = new Session(Site);
            /* place the session object in an object that is only good as long as the http pipeline lasts */
            current.Items.Add("currentSession", session);
            /* raise the after authentication event */
            AfterAuthenticationEventArgs args = new AfterAuthenticationEventArgs(session, current);
            Main.Site.raiseOnAfterAuthentication(args);
            /* execute AJAX responders - if a responder was executed then end. */
            try {
                if(executeResponders(current, session)) {
                    _JSONResponse = true;
                    goto End;
                };
            } catch(Exception ex) {
                String.Format("executeResponders exception =>{0}", ex.Message).Debug(0);
                goto End;
            }
            /* check if this is a request for the Admin directory or Admin responder virtual page */
            if(_isVirtualResourcePath) {
                /* don't do anything for people who arn't logged on as administrators, unless we're in setup mode */
                if(!session.Administrator) {
                    /* 401 forbidden, and ask for a username / password */
                    /* RFC 2617 HTTP Authentication: Basic and Digest Access Authentication */
                    if(current.Request.Headers["Authorization"] != null) {
                        /* user is sending logon attempt via HTTP auth */
                        string _raw_header = current.Request.Headers["Authorization"];
                        string[] _hprams = _raw_header.Split(' ');
                        string method = _hprams[0];
                        string enc_auth = _hprams[1];
                        /* decode base 64 auth string */
                        string _raw_auth = Encoding.ASCII.GetString(Convert.FromBase64String(enc_auth));
                        string[] _auth = _raw_auth.Split(':');
                        string userName = _auth[0];
                        string password = _auth[1];
                        /* try to logon using the provided authentication creditials */
                        if(session.LogOn(userName, password) == 0) {
                            session.Refresh();
                        }
                    }
                    /* check again */
                    if(!session.Administrator) {
                        if(!UseFormsBasedAuth) {
                            current.Response.AddHeader("WWW-Authenticate", String.Format("Basic realm=\"{0}\"", current.Request.Url.DnsSafeHost));
                            ErrorPage(current, 401,
                            String.Format("Only administrators can access the {0} virtual directory.", Main.AdminDirectory));/* 401 unauthorized */
                            current.ApplicationInstance.CompleteRequest();
                            goto End;
                        } else {
                            current.Response.Redirect(Main.PublicDirectory + "/logon.html?rdr=" + executionFilePath.UrlEncode());
                            current.ApplicationInstance.CompleteRequest();
                            goto End;
                        }
                    }
                }
                sendNeverExpiresHeaders();
                /* if this is a request for the Admin directory tree respond with the given Admin resource */
                if(!executionFilePath.Contains(Main.AdminResponder)) {
                    getResxResource(current);
                    goto End;
                }
            }
            End:
            /* fire off events */
            EndRequestEventArgs endRequestargs = new EndRequestEventArgs(session, current);
            Site.raiseOnendrequest(endRequestargs);
            DateTime endHTTPRequest = DateTime.Now;
            current.Items.Add("finish_processHTTPRequest", endHTTPRequest);
            return _JSONResponse;
        }
        #endregion
    }
}