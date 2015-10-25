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
using System.Text.RegularExpressions;
using System.Web;
using System.IO;
using System.Diagnostics;
using System.Web.WebPages;
using RazorEngine;
using RazorEngine.Configuration;
using RazorEngine.Templating;
using System.Reflection;
using System.Threading;
namespace Rendition {
	internal partial class Main : IHttpModule {
        /// <summary>
        /// Sets main defaults.
        /// </summary>
        void InitSetMainDefaults(HttpApplication _app) {
            /* initialize all static fields and properties */
            if(App == null) { 
                App = _app;
                UseFormsBasedAuth = true;
                PhysicalApplicationPath = AppDomain.CurrentDomain.BaseDirectory;
                Compression = DEFAULT_COMPRESSION;
                MethodKey = DEFAULT_METHOD_KEY;
                CategoryRewrite = DEFAULT_CATEGORYREWRITE;
                PublicFiles = default_public_files;
                CategoryRewriteReplace = DEFAULT_CATEGORYREWRITEREPLACE;
                ItemRewrite = DEFAULT_ITEMREWRITE;
                ItemRewriteReplace = DEFAULT_ITEMREWRITEREPLACE;
                PublicDirectory = DEFAULT_PUBLICDIRECTORY;
                AdminDirectory = DEFAULT_ADMINDIRECTORY;
                PluginDirectory = DEFAULT_PLUGINDIRECTORY;
                UserDirectory = DEFAULT_USERDIRECTORY;
                ImageDirectory = DEFAULT_IMAGEDIRECTORY;
                TempDirectory = DEFAULT_TEMPDIRECTORY;
                RequestCategory = DEFAULT_REQUESTCATEGORY;
                RequestItem = DEFAULT_REQUESTITEM;
                Responder = DEFAULT_RESPONDER;
                AdminResponder = DEFAULT_ADMINRESPONDER;
                MainJSScript = DEFAULT_MAINJSCRIPT;
                ImageFormat = System.Drawing.Imaging.ImageFormat.Jpeg;
                Rendition.Main.UIScripts = new List<string>();
                Items = new Dictionary<string, object>();
                MainScripts = new List<string>();
                Conversations = new List<Admin.Conversation>();
                SystemMessages = new List<Dictionary<string, object>>();
                Timers = new List<Admin.Timer>();
                Plugins = new List<Plugin>();
                RevokedPlugins = new List<string[]>();
            }
        }
        /// <summary>
        /// Called when [app error].
        /// </summary>
        /// <param name="o">The o.</param>
        /// <param name="ea">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        void OnAppError(object o, EventArgs ea) {
            HttpContext current = HttpContext.Current;
            Thread thread = Thread.CurrentThread;
            Exception ex = (App).Server.GetLastError();
            if(ex != null) {
                ex = Main.getInnermostException(ex);
                string msg = String.Format("Application Error {0} on Page:{1},Message:{2}, Stack Trace: {3}",
                500,
                current.Request.AppRelativeCurrentExecutionFilePath, ex.Message, ex.StackTrace);
                if(!ex.Message.Contains("Thread was being aborted")) {
                    msg.Debug(0);
                }
            }
        }
        /// <summary>
        /// Called when [end request].
        /// </summary>
        /// <param name="o">The o.</param>
        /// <param name="ea">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        void OnEndRequest(object o, EventArgs ea) { }
        /// <summary>
        /// Disposes of the resources (other than memory) used by the module that implements <see cref="T:System.Web.IHttpModule"/>.
        /// </summary>
        public void Dispose() {

        }
        internal static Assembly resolveEmbeddedAssembiles(object _sender, EventArgs _args) {
            ResolveEventArgs args = (ResolveEventArgs)_args;
            string[] names = Assembly.GetExecutingAssembly().GetManifestResourceNames();
            String resourceName = "Rendition.lib." + new AssemblyName(args.Name).Name + ".dll";
            using(var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName)) {
                if(stream != null) {
                    Byte[] assemblyData = new Byte[stream.Length];
                    stream.Read(assemblyData, 0, assemblyData.Length);
                    return Assembly.Load(assemblyData);
                } else {
                    return null;
                }
            }
        }
        /// <summary>
        /// Gets the base config.
        /// </summary>
        /// <returns></returns>
        internal static Site.SiteConfiguration getBaseConfig() {
            /* read the configuration from web.config
				 * when that fails, run the setup program */
            Site.SiteConfiguration baseConfig = null;
            try {
                /* create a base site config */
                baseConfig = readConfiguration();
            } catch { }
            if(baseConfig == null) {
                Exception ex = new Exception("Error reading web.config");
                throw ex;
            }
            return baseConfig;
        }
        /// <summary>
        /// Rewrites the URL by looking for SiteSections that have matching URL fields.
        /// </summary>
        /// <param name="current">The current HttpContext.</param>
        /// <returns>True when the request was handled by a rewriter.</returns>
        public static bool RewriteSiteSection(HttpContext current) {
            if(Main.Site.SiteSections.List != null) {
                foreach(Commerce.SiteSection section in Main.Site.SiteSections.List) {
                    if(section.Url.Length > 0 && !section.isCategory) {
                        if( section.Url == current.Request.RawUrl &&
                            ( ! ( section.Url.Contains(Main.AdminDirectory) || 
                             section.Url.Contains(Main.AdminResponder) ) )
                          ) {
                            /* if this section is not tied to a category */
                            current.Response.Write(section.Value);
                            current.ApplicationInstance.CompleteRequest();
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        /// <summary>
        /// Rewrites the URL by looking for categories that match the category match pattern.
        /// </summary>
        /// <param name="current">The current HttpContext.</param>
        /// <returns>True when the request was handled by a rewriter.</returns>
        public static bool RewriteCategory(HttpContext current) {
            string rawURL = "~" + current.Request.RawUrl;
            if(Main.Site.Categories.List != null) {
                foreach(Commerce.Category category in Main.Site.Categories.List) {
                    if(category.URLMatch.IsMatch(rawURL)) {
                        string target = category.URLMatch.Replace(rawURL, Main.CategoryRewriteReplace);
                        Uri uri = getSiteURI(target);
                        string physicalPath = current.Server.MapPath(uri.LocalPath);
                        if(!File.Exists(physicalPath)) {
                            /* the target file does not exist */
                            ErrorPage(current, 404, String.Format("Cannot find {0}", physicalPath));
                            return true;
                        } else {
                            try {
                                String.Format("Rewriting {0} => {1}", rawURL, target).Debug(9);
                                executeScript(target);
                            } catch(Exception ex) {
                                if(!WasThreadAbortedOrClosed(ex)) {
                                    showHTMLErrorOnRewriteException(getInnermostException(ex), current);
                                }
                            }
                            try {
                                current.Response.Flush();
                                current.ApplicationInstance.CompleteRequest();
                            } catch { }
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        /// <summary>
        /// Rewrites the URL by looking for items that match the item match pattern.
        /// </summary>
        /// <param name="current">The current HttpContext.</param>
        /// <returns>True when the request was handled by a rewriter.</returns>
        public static bool RewriteItem(HttpContext current) {
            return false;
        }
        /// <summary>
        /// Gets the site URI.
        /// </summary>
        /// <param name="target">The target.</param>
        /// <returns></returns>
        private static Uri getSiteURI(string target) {
            var rp = "http://127.0.0.1/"; /* root path */
            Uri uri = null;
            if(target.StartsWith("~/")) {
                uri = new Uri(rp + target.Substring(2));
            } else if(!target.StartsWith("http://")) {
                uri = new Uri(rp + target);
            } else {
                uri = new Uri(target);
            }
            return uri;
        }
        /// <summary>
        /// Shows the HTML error on rewrite exception.
        /// </summary>
        /// <param name="ex">The ex.</param>
        /// <param name="current">The current.</param>
        private static void showHTMLErrorOnRewriteException(Exception ex, HttpContext current) {
            string msg = String.Format( "rewriteURL Application Error {0} on Page:{1},Message:{2}, Stack Trace: {3}",
			500,current.Request.AppRelativeCurrentExecutionFilePath, ex.Message, ex.StackTrace );
			msg.Debug( 0 );
			msg = HtmlExceptionMsg( ex );
			/* and one for the user */
			ErrorPage( current, 500, msg );
        }
		/// <summary>
		/// Rewrites the URL.
		/// </summary>
		/// <param name="current">The current HttpContext.</param>
		/// <returns>True when the request was handled by a rewriter.</returns>
		public static bool RewriteUrl( HttpContext current ) {
			string rawURL = "~" + current.Request.RawUrl;
			foreach( Commerce.Redirector rdr in Main.Site.Redirectors.List ) {
				int statusCode = 0;
				int.TryParse( rdr.ErrorMatch, out statusCode );
				if( rdr.RedirectorType == RedirectorTypes.Rewriter && /* this is a rewriter*/
				rdr.Enabled/* that's enabled */) {
					if( rdr.RegEx.IsMatch( rawURL ) ) {
						string target = rdr.RegEx.Replace( rawURL, rdr.UrlToRedirectTo );
						/* check now if this file exists
						 * if not change the response code */
						/* format the target, extracting the URL */
						Uri uri = getSiteURI( target );
						string physicalPath = current.Server.MapPath( uri.LocalPath );
						if( !File.Exists( physicalPath ) ) {
							/* the target file does not exist */
							ErrorPage( current, 404, String.Format( "Cannot find {0}", physicalPath ) );
							return true;
						} else {
							try {
								/* the target file exists */
								int.TryParse( rdr.ErrorMatch, out statusCode );
								if( statusCode != 200 ) {
									setStatusCode( current, statusCode );
								}
								current.Response.ContentType = rdr.ContentType;
								String.Format( "Rewriting {0} => {1}", rawURL, target ).Debug( 9 );
                                executeScript(target);
                            } catch(Exception ex) {
                                if(!WasThreadAbortedOrClosed(ex)) {
                                    showHTMLErrorOnRewriteException(getInnermostException(ex), current);
                                }
                            }
							try{
								current.Response.Flush();
								current.ApplicationInstance.CompleteRequest();
							}catch{}
							return true;
						}
					}
				}
			}
			return false;
		}
        /// <summary>
        /// Gets the innermost exception.
        /// </summary>
        /// <param name="ex">The ex.</param>
        /// <returns></returns>
		internal static Exception getInnermostException( Exception ex ) {
			while(ex.InnerException!=null)
				ex = ex.InnerException;
			return ex;
		}
        /// <summary>
        /// HTML exception message.
        /// </summary>
        /// <param name="ex">The ex.</param>
        /// <returns></returns>
		internal static string HtmlExceptionMsg(Exception ex){
			Regex regex = new Regex("([^\\n]+)(\\((\\d+)\\):)(.*)");
			string fileName = "";
			int lineNumber = 0;
			string message = ex.Message;
			string source = ex.Source;
			string stackTrace = ex.StackTrace;
			string sourceCode = "";
			if(regex.IsMatch(ex.Message)){
				GroupCollection m = regex.Matches(ex.Message)[0].Groups;
				if(m.Count>0){
					fileName = m[1].Value;
				}
				if( m.Count > 2 ) {
					if(int.TryParse(m[3].Value, out lineNumber) && fileName != "" ){
						/* fetch the file and record the lines around the error */
						if( File.Exists( fileName ) ) {
							int lowOffset = 4, highOffset = 4;
							string selectedStyle = "";
							string[] lines = File.ReadAllLines( fileName );
							int low = lineNumber - lowOffset, high = lineNumber + highOffset;
							StringBuilder sb = new StringBuilder();
							if(low<0){
								low = 0;
							}
							if(high>lines.Length){
								high = lines.Length;
							}
							sb.Append("<table class=\"sourceCode\">");
							for(int x=low;high>x;x++){
								if(x+1==lineNumber){
									selectedStyle = " class=\"errorLine\"";
								}else{
									selectedStyle = "";
								}
								sb.Append( String.Format( @"
								<tr{2}>
									<th>
										{0}
									</th>
									<td>
										{1}
									</td>
								</tr>",
								x + 1, lines[ x ].Replace("\t","     "), selectedStyle ) );
							}
							sb.Append( "</table>" );
							sourceCode = sb.ToString();
						}
					}
					
				}
				if( m.Count > 3 ) {
					message = m[4].Value;
				}

			}
			return String.Format( defaultErrorReport, fileName, message, lineNumber, sourceCode, source, stackTrace );

		}
		/// <summary>
		/// Redirects the URL.
		/// </summary>
		/// <param name="current">The current HttpContext.</param>
		/// <returns>True when the request was handled by a rewriter.</returns>
		private static bool redirectUrl( HttpContext current ) {
			string rawURL = "~" + current.Request.RawUrl;
			foreach(Commerce.Redirector rdr in Main.Site.Redirectors.List){
				if(rdr.RedirectorType == RedirectorTypes.Redirector && rdr.Enabled){
					if( rdr.RegEx.IsMatch( rawURL ) ) {
						/* current URL is a match */
						string target = rdr.RegEx.Replace( rawURL, rdr.UrlToRedirectTo );
						int statusCode = 307;
						int.TryParse(rdr.ErrorMatch, out statusCode);
						setStatusCode( current, statusCode );
						current.Response.Redirect( target );
						return true;
					}
				}
			}
			return false;
		}
        /// <summary>
        /// Parse a razor string and retun the rendered string.
        /// </summary>
        /// <param name="string_to_parse">The string_to_parse.</param>
        /// <param name="object_model">The object model.</param>
        /// <returns></returns>
        public static string RazorParse(string string_to_parse, object object_model) {
            if(string_to_parse == null) { return String.Empty; }
            if(string_to_parse == String.Empty) { return String.Empty; }
            return Razor.Parse(string_to_parse, object_model);
        }
        /// <summary>
        /// Parse a razor string and retun the rendered string.
        /// </summary>
        /// <param name="string_to_parse">The string_to_parse.</param>
        /// <returns></returns>
        public static string RazorParse(string string_to_parse) {
            if(string_to_parse == null) { return String.Empty; }
            if(string_to_parse == String.Empty) { return String.Empty; }
            return Razor.Parse(string_to_parse);
        }
        /// <summary>
        /// Parses a string using the the razor MVC view page tempalte .
        /// </summary>
        /// <param name="string_to_parse">The string_to_parse.</param>
        /// <returns></returns>
        public static string ParseRazorMVCViewPageTempalte(string string_to_parse) {
            if(string_to_parse == null) { return String.Empty; }
            if(string_to_parse == String.Empty) { return String.Empty; }
            var config = new RazorEngine.Configuration.TemplateServiceConfiguration();
            config.Namespaces.Add("Rendition");
            var service = new RazorEngine.Templating.TemplateService(config);
            string rParseResult = ""; 
            try{
                rParseResult = Razor.Parse(string_to_parse);
            }catch(Exception ex){
                if(!WasThreadAbortedOrClosed(ex)) {
                    showHTMLErrorOnRewriteException(getInnermostException(ex), HttpContext.Current);
                }
            }
            return rParseResult;
        }
        /// <summary>
        /// Executes a script.
        /// </summary>
        /// <param name="scriptPath">The script path.</param>
        internal static void executeScript(string scriptPath) {
            HttpContext.Current.Server.Execute(scriptPath, true);
        }
		/// <summary>
		/// Causes a file the not found page to appear.
		/// </summary>
		/// <param name="current">The current.</param>
		/// <param name="errorCode">The error code.</param>
		/// <param name="description">The description.</param>
		/// <returns></returns>
		public static bool ErrorPage( HttpContext current, int errorCode, string description ) {
			setStatusCode( current, errorCode );
			string rawURL = current.Request.RawUrl;
            if (Main.Site != null) {
                if (Main.Site.Redirectors != null) {
                    foreach (Commerce.Redirector rdr in Main.Site.Redirectors.List) {
                        if (rdr.RedirectorType == RedirectorTypes.Error
                        && rdr.Enabled && rdr.ErrorMatch == errorCode.ToString()) {
                            string target = rdr.RegEx.Replace(rawURL, rdr.UrlToRedirectTo);
                            /* try and execute any supplied error page, but don't expect it to work */
                            try {
                                executeScript(target);
                            } catch {
                                goto End;
                            }
                            return true;
                        }
                    }
                }
            }
			End:
			/* no custom error page found, generate a simple error page */
			if(IsResourceFile(rawURL)){
				current.Response.Clear();
				current.ApplicationInstance.CompleteRequest();
			}else{
				string message = String.Format("<!DOCTYPE html><html><head><title>{0}</title></head><body><h1>{0}</h1><p>{1}</p></body></html>",
				current.Response.StatusDescription, description );
				current.Response.Write(message);
				current.Response.Flush();
				current.ApplicationInstance.CompleteRequest();
				return true;
			}
			return false;
		}
		/// <summary>
		/// Sends the never expires headers.
		/// </summary>
		static void sendNeverExpiresHeaders(){
            HttpContext current = HttpContext.Current;
			/* RFC 1123 date format: Thu, 01 Dec 1994 16:00:00 GMT */
			/* RFC 2616 14.21 Content never expires */
			current.Response.AddHeader( "Expires", DateTime.Now.AddYears( 1 ).ToString( "r" ) );
			/* RFC 2616 14.9.1 check cache each time */
			current.Response.AddHeader( "Cache-Control", "public" );
			/* RFC 2616 14.32 Pragma - same as cache control */
			current.Response.AddHeader( "Pragma", "public" );
		}
        /// <summary>
        /// Gets the resource from the resource file.
        /// </summary>
        /// <param name="current">The current.</param>
		static void getResxResource( HttpContext current ) {
			string executionFilePath = current.Request.AppRelativeCurrentExecutionFilePath;
			try {
				current.Response.AddHeader( "Pragma", "public" );
				if( executionFilePath.EndsWith( ".png" ) || executionFilePath.EndsWith( ".jpg" )
				|| executionFilePath.EndsWith( ".gif" ) || executionFilePath.EndsWith( ".ico" ) ) {
                    /* images never expire */
                    sendNeverExpiresHeaders();
                    byte[] buffer = ( byte[] )getAdminResource( executionFilePath );
					if( executionFilePath.EndsWith( ".ico" ) ) {
						current.Response.ContentType = "image/vnd.microsoft.icon";
					} else {
						current.Response.ContentType = "image/" +
							executionFilePath.Substring( executionFilePath.Length - 3 );
					}
					if( buffer != null ) {
						current.Response.BinaryWrite( buffer );
						current.Response.Flush();
						try {
							current.ApplicationInstance.CompleteRequest();
						} finally {
							/* sometimes this crashes without reason */
						}
					} else {
						String.Format( "request for missing res resource:{0}", executionFilePath ).Debug( 2 );
					}
					return;
				} else if( executionFilePath.EndsWith( ".js" ) || executionFilePath.EndsWith( ".html" ) ||
					executionFilePath.EndsWith( ".css" ) || executionFilePath.EndsWith( ".html" )
					|| executionFilePath.EndsWith( Main.AdminDirectory ) || executionFilePath.EndsWith( "/" ) ) {
					/* this: executionFilePath.EndsWith(main.adminDirectory) is for /admin/default.html = /admin/ */
					if( executionFilePath.EndsWith( ".css" ) ) {
						current.Response.ContentType = "text/css";
					} else if( executionFilePath.EndsWith( ".js" ) ) {
						current.Response.ContentType = "text/javascript";
					} else if( executionFilePath.EndsWith( ".html" ) || executionFilePath.EndsWith( Main.AdminDirectory )
					|| executionFilePath.EndsWith( "/" ) ) {
						current.Response.ContentType = "text/html";
					}
                    if(executionFilePath.ToLower().EndsWith("/rendition.js") || executionFilePath.ToLower().EndsWith("/renditionui.js")) {
                        StringBuilder page = new StringBuilder();
                        // #1 append jquery
                        page.Append((string)getAdminResource("admin__jqueryjs"));
                        // #2 append ace
                        page.Append((string)getAdminResource("admin__acejs"));
                        // #3 append localization
                        page.Append(@"if (Rendition === undefined) {
    var Rendition = { Commerce: {}, Merchant: {}, UI: {}, Localization: {} }
}
if (Rendition.Commerce === undefined ) {
    Rendition.Commerce = { }
}
if (Rendition.Merchant === undefined ) {
    Rendition.Merchant = { }
}
if (Rendition.UI === undefined ) {
    Rendition.UI = { }
}
if (Rendition.Localization === undefined ) {
    Rendition.Localization = { }
}
    Rendition.Localization = " + FieldTitleLocalization.FieldTitles.ToJson() + Environment.NewLine);
                        // #4 append rendition js
                        string rscript = (string)getAdminResource(executionFilePath);
                        page.Append(rscript);
                        page.Append(Environment.NewLine);
                        // #5 Start the application after the body is present 
                        page.Append(Environment.NewLine);
                        page.Append(@"window.document.addEventListener('DOMContentLoaded', Rendition.UI.init, false);");
                        // #6 add plugin scripts
                        foreach(string scriptBody in Main.UIScripts) {
                            page.Append(Environment.NewLine);
                            page.Append(scriptBody);
                        }
                        // print it
                        current.Response.Write(page.ToString());
                        current.Response.Flush();
                        current.ApplicationInstance.CompleteRequest();
                        return;
                    } else if(executionFilePath.ToLower() == MainJSScript.ToLower()) {
                        StringBuilder page = new StringBuilder((string)getAdminResource(executionFilePath));
                        foreach(string scriptBody in Main.MainScripts) {
                            page.Append(Environment.NewLine);
                            page.Append(scriptBody);
                        }
                        current.Response.Write(page.ToString());
                        current.Response.Flush();
                        current.ApplicationInstance.CompleteRequest();
                        return;
                    }
                    StringBuilder _page = new StringBuilder((string)getAdminResource(executionFilePath));
					current.Response.Write( _page.ToString() );
					current.Response.Flush();
					current.ApplicationInstance.CompleteRequest();
					return;
				}
			} catch( Exception ex ) {
                if(!WasThreadAbortedOrClosed(ex)) {
					( "EVENT -> BeginRequest -> main.adminResponder Exception: " + ex.Message + " Stack Trace:" + ex.StackTrace ).Debug( 3 );
				}
				return;
			}
		}
        /// <summary>
        /// Was the thread aborted or closed.
        /// </summary>
        /// <param name="ex">The ex.</param>
        /// <returns></returns>
        static bool WasThreadAbortedOrClosed(Exception ex) {
            return ex.Message.Contains( "Thread was being aborted" ) ||
				 ex.Message.Contains( "The remote host closed the connection" );
        }
		/// <summary>
		/// Gets the current trust level.
		/// </summary>
		/// <returns></returns>
		static AspNetHostingPermissionLevel getCurrentTrustLevel(){
			var levels = Enum.GetValues( typeof( AspNetHostingPermissionLevel ) );
			AspNetHostingPermissionLevel lastWorking = AspNetHostingPermissionLevel.None;
			foreach(AspNetHostingPermissionLevel trustLevel in levels){
				try{
					new AspNetHostingPermission(trustLevel).Demand();
					lastWorking = trustLevel;
				}catch{
					return lastWorking;
				}
			}
			return AspNetHostingPermissionLevel.Unrestricted;
		}
		/// <summary>
		/// Gets the IIS version.
		/// </summary>
		/// <returns></returns>
		static int getIISVersion() {
			using (Process process = Process.GetCurrentProcess()){
				using (ProcessModule mainModule = process.MainModule){
					// main module would be w3wp
					return mainModule.FileVersionInfo.FileMajorPart;
				}
			}
		}
		/// <summary>
		/// Checks if the file is a .jpg, .gif, .png, .ico, .js or .css.
		/// </summary>
		/// <param name="filePath">The file path.</param>
		/// <returns>
		///   Returns true if the file is a .jpg, .gif, .png, .ico, .js or .css file.
		/// </returns>
		private static bool IsResourceFile( string filePath ) {
			return filePath.EndsWith( ".jpg" ) || filePath.EndsWith( ".gif" )
			|| filePath.EndsWith( ".png" ) || filePath.EndsWith( ".ico" ) ||
			filePath.EndsWith( ".js" ) || filePath.EndsWith( ".css" );
		}
		/// <summary>
		/// Determines whether [is an Admin path].
		/// </summary>
		/// <returns>
		///   <c>true</c> if [is Admin path]; otherwise, <c>false</c>.
		/// </returns>
		public static bool IsAdminPath( string path ) {
			if( path.Contains( Main.AdminResponder ) &&
			path.Contains( Main.AdminDirectory ) ) {
				return true;
			}
			return false;
		}
		/// <summary>
		/// Determines whether path is a Admin, Admin/responder or responder path.
		/// </summary>
		/// <returns>
		///   <c>true</c> if [is Admin path]; otherwise, <c>false</c>.
		/// </returns>
		public static bool IsVirtualResourcePath( string path ) {
			if( path.Contains( Main.Responder ) ||
            path.Contains( Main.PublicDirectory ) ||
            path.Contains( Main.AdminDirectory ) ||
			path.Contains( Main.AdminResponder ) ) {
				return true;
			}
			return false;
		}
		/// <summary>
		/// Returns true when setup mode is set and a page other than
		/// Admin/setup.html or Admin/responder is requested.
		/// </summary>
		/// <param name="current">The current HttpContext.</param>
		private static void checkIfSetupMode( HttpContext current ) {
			/* if we're in setup mode, you can only goto the setup page or Admin responder.*/
			string executionFilePath = current.Request.AppRelativeCurrentExecutionFilePath;
			if( !IsAdminPath( executionFilePath ) &&
			!executionFilePath.Contains( Main.AdminDirectory + "/setup.html" )
			&& current.Request.Form.Count == 0 ) {
				current.Response.Redirect( Main.AdminDirectory + "/setup.html" );
				current.ApplicationInstance.CompleteRequest();
				return;
			}
		}
	}
}