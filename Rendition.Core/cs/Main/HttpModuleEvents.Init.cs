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
        #region Application Init Procedrue
        /// <summary>
		/// Site startup.
		/// </summary>
		/// <param name="sender">The sender.</param>
		public void Init( HttpApplication sender ) {
            HttpApplication _app = (HttpApplication)sender;
            /* set defaults for static properties 
             * and subscribe to events
             */
            InitSetMainDefaults(_app);
            /* bind all HTTPModule event handlers
             * this should be done EVERYTIME the httpApplication fires init*/
            _app.BeginRequest += new EventHandler(BeginRequest);
            _app.EndRequest += new EventHandler(OnEndRequest);
            _app.Error += new EventHandler(OnAppError);
			/* if the site hasn't picked a thread to start on yet then THIS is the thread 
			 * this should be done once per httpApplication instance
			 * init is called once per thread
			 */
			if( State == SiteState.NotYetStarted ) {
				/* prevent addtional startups */
				State = SiteState.BeginingStartup;
                try {
                    /* first thing load the site config to get impersonation info */
                    TrustLevel = getCurrentTrustLevel();
                    if(!(TrustLevel == AspNetHostingPermissionLevel.Unrestricted
                    || TrustLevel == AspNetHostingPermissionLevel.High)) {
                        System.Security.SecurityException ex = new System.Security.SecurityException(
                        String.Format("Rendition.dll requires AspNetHostingPermissionLevel High or Full.  The current level is {0}",
                        TrustLevel.ToString()));
                        throw ex;
                    }
                    Site.SiteConfiguration baseConfig = Main.getBaseConfig();
                    LoadConfig(baseConfig);
                    /* start logging */
                    using (Impersonation imp = new Impersonation()) {
                        if (debug == null) {
                            string logPath = Main.PhysicalApplicationPath + "log\\debug.txt";
                            /* try and move the old log file first */
                            if (File.Exists(logPath)) {
                                try {
                                    File.Move(logPath, Path.GetDirectoryName(logPath) + "\\" + DateTime.Now.ToString("MM.dd.yyyy-HH.mm.ss") + ".txt");
                                } catch { }
                            }
                            debug = new Logger(logPath);
                        }
                        IISVersion = getIISVersion();
                        if (!Directory.Exists(Main.PhysicalApplicationPath + "log\\")) {
                            Directory.CreateDirectory(Main.PhysicalApplicationPath + "log\\");
                        }
                    }
                    /* allow for lookup of assemblies embedded into the dll */
                    AppDomain.CurrentDomain.AssemblyResolve += resolveEmbeddedAssembiles;
                    /* start the site if it hasn't started on any thread yet */
                    if(Main.Site == null) {
                        Main.Site = new Site(baseConfig);
                    }
                    /* let all other threads in this process know the site has finished starting up */
                    State = SiteState.Started;
                    ("Waiting for connections...").Debug(8);
                } catch(Exception ex) {
                    ex = getInnermostException(ex);
                    State = SiteState.CannotStart;
                    CannotStartException = ex;
                    ("Cannot Start Site => " + ex.Message).Debug(0);
                    ErrorPage(HttpContext.Current, 500, ex.Message);
                }
			}
		}
        #endregion
	}
}
