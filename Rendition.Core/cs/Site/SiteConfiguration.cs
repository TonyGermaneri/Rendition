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
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Data;
using System.Web;
using System.Diagnostics;
using System.Configuration;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
namespace Rendition {
	public partial class Site {
		/// <summary>
		/// Variables for the site usually drawn from web.config or config.xml.
		/// </summary>
		public class SiteConfiguration {
            /// <summary>
            /// Connection String Name.
            /// </summary>
            /// <value>
            /// The name of the connection.
            /// </value>
            public string ConnectionName { get; set; }
            /// <summary>
            /// Connection String Name.
            /// </summary>
            /// <value>
            /// The localization file.
            /// </value>
            public string LocalizationFile { get; set; }
            /// <summary>
            /// Impersonation user.
            /// </summary>
            /// <value>
            /// The elevated security user.
            /// </value>
            public string ElevatedSecurityUser { get; set; }
            /// <summary>
            /// Impersonation password.
            /// </summary>
            /// <value>
            /// The elevated security password.
            /// </value>
            public string ElevatedSecurityPassword { get; set; }
            /// <summary>
            /// Impersonation domain.
            /// </summary>
            /// <value>
            /// The elevated security domain.
            /// </value>
            public string ElevatedSecurityDomain { get; set; }
            /// <summary>
            /// The unique id of this site.
            /// </summary>
            /// <value>
            /// The unique site id.
            /// </value>
            public Guid UniqueSiteId { get; set; }
            /// <summary>
            /// The Admin file browser will allow access to all or some files by default.
            /// </summary>
            /// <value>
            /// The file system access.
            /// </value>
            public FileSystemAccess FileSystemAccess { get; set; }
            /// <summary>
            /// The directory the Admin program will appear at.
            /// </summary>
            /// <value>
            /// The admin directory.
            /// </value>
            public string AdminDirectory { get; set; }
            /// <summary>
            /// When true, internal URLs and redirectors will try to use the HTTPS protocol.
            /// </summary>
            /// <value>
            /// Can use SSL.
            /// </value>
			public bool CanUseSSL { get; set; }
            /// <summary>
            /// The directory used for temporary file. Compiled site section templates and image renderings.
            /// </summary>
            /// <value>
            /// The temp directory.
            /// </value>
			public string TempDirectory { get; set; }
            /// <summary>
            /// The directory the images will reside in.
            /// </summary>
            /// <value>
            /// The images directory.
            /// </value>
			public string ImageDirectory  { get; set; }
            /// <summary>
            /// The directory user files will be placed by default.
            /// A directory of the user's ID will be made within this directory.
            /// </summary>
            /// <value>
            /// The user directory.
            /// </value>
			public string UserDirectory  { get; set; }
            /// <summary>
            /// The responder URL the site will listen for
            /// </summary>
            /// <value>
            /// The responder.
            /// </value>
			public string Responder  { get; set; }
            /// <summary>
            /// The responder URL the site will listen for for Admin requests.
            /// </summary>
            /// <value>
            /// The admin responder.
            /// </value>
			public string AdminResponder  { get; set; }
            /// <summary>
            /// The port number of the telnet live log viewing server
            /// </summary>
            /// <value>
            /// The telnet server port.
            /// </value>
            public int TelnetServerPort { get; set; }
            /// <summary>
            /// The verboisty of the log.  Higher number yield more information.
            /// </summary>
            /// <value>
            /// The log verbosity.
            /// </value>
			public int LogVerbosity { get; set; }
            /// <summary>
            /// When <c>true</c> uses a logon Html Http Post Ajax JavaScript form.
            /// When <c>false</c> use RFC 2617 HTTP Authentication.
            /// </summary>
            /// <value>
            ///   if <c>true</c> use forms based auth. otherwise, <c>false</c>.
            /// </value>
            public bool UseFormsBasedAuth { get; set; }
            /// <summary>
            /// Gets or sets the compression.
            /// </summary>
            /// <value>
            /// The compression.
            /// </value>
            public long Compression { get; set; }
            /// <summary>
            /// Gets or sets the method title.
            /// </summary>
            /// <value>
            /// The method title.
            /// </value>
            public string MethodKey  { get; set; }
            /// <summary>
            /// Gets or sets the category rewrite pattern.
            /// </summary>
            /// <value>
            /// The category rewrite.
            /// </value>
            public string CategoryRewrite  { get; set; }
            /// <summary>
            /// Gets or sets the public files.
            /// </summary>
            /// <value>
            /// The public files.
            /// </value>
            public string[] PublicFiles { get; set; }
            /// <summary>
            /// Gets or sets the category rewrite replace pattern.
            /// </summary>
            /// <value>
            /// The category rewrite replace.
            /// </value>
            public string CategoryRewriteReplace { get; set; }
            /// <summary>
            /// Gets or sets the item rewrite pattern.
            /// </summary>
            /// <value>
            /// The item rewrite.
            /// </value>
            public string ItemRewrite { get; set; }
            /// <summary>
            /// Gets or sets the item rewrite replace pattern.
            /// </summary>
            /// <value>
            /// The item rewrite replace.
            /// </value>
            public string ItemRewriteReplace  { get; set; }
            /// <summary>
            /// Gets or sets the public directory.
            /// </summary>
            /// <value>
            /// The public directory.
            /// </value>
            public string PublicDirectory { get; set; }
            /// <summary>
            /// The directory that will be searched for plugins.
            /// </summary>
            /// <value>
            /// The plugin directory.
            /// </value>
            public string PluginDirectory  { get; set; }
            /// <summary>
            /// Gets or sets the request category key.
            /// </summary>
            /// <value>
            /// The request category.
            /// </value>
            public string RequestCategory  { get; set; }
            /// <summary>
            /// Gets or sets the request item key.
            /// </summary>
            /// <value>
            /// The request item.
            /// </value>
            public string RequestItem { get; set; }
            /// <summary>
            /// Gets or sets the main JavaScript script.
            /// </summary>
            /// <value>
            /// The main JS script.
            /// </value>
            public string MainJSScript { get; set; }
            /// <summary>
            /// Gets or sets the image format.
            /// </summary>
            /// <value>
            /// The image format.
            /// </value>
            public System.Drawing.Imaging.ImageFormat ImageFormat { get; set; }
            /// <summary>
            /// Gets or sets the name of the super user.
            /// </summary>
            /// <value>
            /// The name of the admin user.
            /// </value>
            internal string AdminUserName { get; set; }
            /// <summary>
            /// Gets or sets the super user password.
            /// </summary>
            /// <value>
            /// The admin password.
            /// </value>
            internal string AdminPassword { get; set; }
		}
		/// <summary>
		/// Creates a new SQL connection.
		/// </summary>
		/// <param name="async">if set to <c>true</c> [async]. (deprecated) </param>
        /// <param name="MARS">if set to <c>true</c> [MARS]. (deprecated) </param>
		/// <returns></returns>
		public static SqlConnection CreateConnection( bool async, bool MARS ) {
            return new SqlConnection(ConfigurationManager.ConnectionStrings[Site.baseConfig.ConnectionName].ConnectionString);
		}
	}
}
