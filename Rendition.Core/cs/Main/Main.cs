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
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Collections;
using System.Diagnostics;
using System.Net.Mail;
using System.ComponentModel;
using System.Text.RegularExpressions;
using System.IO;
using System.Reflection;
using System.Text;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Net;
using System.Net.Security;
using System.DirectoryServices;
using System.Threading;
using System.Xml;
/* -------------------------------------------------------------------------
 * main.cs
 * this file contains low level stuff
 * event signatures
 * IHttpModule event subscriptions
 * Default timed events ( email, email queue, connection checker )
 * static values ( directories, static objects )
 * Resource.res -> url converter
 * URL rewriter
 * ------------------------------------------------------------------------- */
namespace Rendition {
	/// <summary>
	///	<para>
	/// Rendition HttpModule plugs into any .NET 4.0 website via your Web.Config file.
	/// You need an instance of the Rendtion database. 
    /// And to do any sort of file interaction you'll need an account on the server that has
	/// rights to write files into your web directory.
	/// </para>
	/// <para>
	/// Once setup, Rendition subscribes to the iHttpModule events and listens for
	/// certain requests and will replace or agument the data coming back from the
	/// server when specific requests take place.
	/// </para>
	/// <para>
	/// What requests does Rendition listen for?
	/// Requests made to the responder URL in your Web.Config file.
    /// Requests made to the Admin responder URL in your Web.Config file.
    /// Requests made to the adminDirectory URL in your Web.Config file.
	/// </para>
	/// <para>
	/// When a request is made any keys with the name matching 
	/// the pattern method[0-9]+ will be treated as JSON strings
	/// in the following pattern:
	/// </para>
	/// <code language="JavaScript">
	/// {
	///		&lt;<i>Method Name</i>&gt;,
	///		[
	///			&lt;<i>Argument 1</i>&gt;,
	///			&lt;<i>Argument 2</i>&gt;,
	///			<i>...etc.</i>
	///		]
	/// }
	/// </code>
	/// Example (in JSON):
	/// {"init",[]}
	/// <para>
	/// Example (raw URL):
	///		<para>
	///			method1=%7B%22init%22%2C%5B%5D%7D
	///		</para>
	/// </para>
	/// Returns: (in JSON)
	/// <code language="JavaScript">
	/// {
	///		"method1": {
	///			"init": {
	///				"site": {
	///					"metaKeywords": "",
	///					....etc.
	///				}
	///			}
	///		}
	///	}
	///	</code>
	/// 
	/// <para>
	/// All responses will return a JSON string, even errors.
	/// Using the browsers JSON.parse() function you can then see the result
	/// of the JSON string you sent to the server.  JSON string are returned
	/// in the following format:
	/// </para>
	/// <para>
	/// <b>method1%3d;</b>%7B;%22;methodName1%22;%2C;%5B;%5D;%7D;<b>&amp;method2%3d;</b>%7B;%22;methodName2%22;%2C;%5B;%5D;%7D;
	/// </para>
	/// <para>
	/// The return values will have the "method" name you used to call it
	/// so you can reassociate the methods you called after the AJAX callback.
	/// </para>
	/// <para>
	/// The methods are also call synchonously so you can create chains of commands
	/// that rely upon eachother.  The numbers used after the word method are
	/// not considered, only the order you send the key/pair values in matters.
	/// </para>
	/// <para>
	/// Some methods will not return a JSON string.  These methods return somthing
	/// else such as a binary image or a binary file.
	/// </para>
	/// <para>
	/// You can use POST or GET to access these methods.  This is very useful for
	/// the methods that return image data. You can make the SRC attribute
	/// of your image contain your "method" and the server will spit an
	/// image out.
	/// </para>
	/// <para>
	/// <legacyBold>Administative Responder vs. Public Responder</legacyBold>
	/// There are two responder URLs you can send requests to.  The public
	/// responder will only allow you to access static methods in the 
	/// Rendition.Merchant class.   The Admin responder URL will only allow you
	/// to access static methods in the Rendition.Admin class.
	/// </para>
	/// <para>
	/// You can only access the Admin responder URL once you have logged in
	/// as an administrator.
	/// </para>
	/// <para>
	/// The last interaction Rendition makes is the Admin directory URL.
	/// </para>
	/// <para>
	/// Requets for the /Admin directory will bring you to the
	/// administrative JS suite, the core of this program.
	/// </para>
	/// <para>
	/// The Admin directory, and the files inside of it
	/// do not exist.  When a request for the Admin
	/// directory is detected the server will search a resource file inside
	/// of Renditon.Core.dll for a resource matching that name.  When a resource
	/// is found it is delivered to the browser as if it were a file in the
	/// file system.  The entire Admin JS suite works this way.  This way
	/// updates for the JS suite can be packaged with the DLL and there are
	/// fewer files to move around.  You can get access to most of the files
	/// in the resource.res by visiting /admin/debug.html.
	/// </para>
	/// <para>
	/// Due to these three directories being used by the HttpModule
	/// directories you create with the same names will not be
	/// accessable over the web.
	/// </para>
	/// </summary>
	[System.Runtime.CompilerServices.CompilerGenerated]
	class NamespaceDoc {}
	/// <summary>
	/// This class holds all the static information for the site.  All users share in this data so
	/// watch out that you don't modify any fields that shouldn't be modified.
	/// </summary>
	internal partial class Main:IHttpModule {
        #region Module Name Class For Sandcastle
        /// <summary>
		/// Gets the name of the module.
		/// </summary>
		/// <value>The name of the module.</value>
		public String ModuleName { 
			get {
				return "Rendition";
			} 
		}
        #endregion
        #region Constants
        /// <summary>
        /// Default Telnet server min random port range.
        /// </summary>
        internal const int DEFAULT_MIN_TELNET_SERVER_PORT = 1000;
        /// <summary>
        /// Default Telnet server max random port range.
        /// </summary>
        internal const int DEFAULT_MAX_TELNET_SERVER_PORT = 64000;
        /// <summary>
        /// Default Log Verbosity.
        /// </summary>
        internal const int DEFAULT_LOG_VERBOSITY = 1;
        /// <summary>
        /// Secret hash salt for appending to passwords to make the hash more complex.
        /// </summary>
        internal const string DEFAULT_SHA1HASHSALT = "caveatUtilitor!";
        /// <summary>
        /// Default admin JSON mapper path.
        /// </summary>
        internal const string DEFAULT_ADMINRESPONDER = "~/admin/responder";
        /// <summary>
        /// Default public JSON Mapper path.
        /// </summary>
        internal const string DEFAULT_RESPONDER = "~/responder";
        /// <summary>
        /// Default item request key name.
        /// </summary>
        internal const string DEFAULT_REQUESTITEM = "item";
        /// <summary>
        /// Default category request key name.
        /// </summary>
        internal const string DEFAULT_REQUESTCATEGORY = "category";
        /// <summary>
        /// Default compression level for lossy image formats.
        /// </summary>
        internal const long DEFAULT_COMPRESSION = 75L;
        /// <summary>
        /// Default temp directory.
        /// </summary>
        internal const string DEFAULT_TEMPDIRECTORY = "~/temp";
        /// <summary>
        /// Default image directory.
        /// </summary>
        internal const string DEFAULT_IMAGEDIRECTORY = "~/img";
        /// <summary>
        /// Default users directory.
        /// </summary>
        internal const string DEFAULT_USERDIRECTORY = "~/users";
        /// <summary>
        /// Default plugins directory.
        /// </summary>
        internal const string DEFAULT_PLUGINDIRECTORY = "~/plugins";
        /// <summary>
        /// Default admin directory.
        /// </summary>
        internal const string DEFAULT_ADMINDIRECTORY = "~/admin";
        /// <summary>
        /// Default public directory.
        /// </summary>
        internal const string DEFAULT_PUBLICDIRECTORY = "~/pub";
        /// <summary>
        /// Default item URL.
        /// </summary>
        internal const string DEFAULT_ITEMREWRITEREPLACE = "/detail.aspx?item=$1";
        /// <summary>
        /// Default item rewrite pattern.
        /// </summary>
        internal const string DEFAULT_ITEMREWRITE = "~/{0}";
        /// <summary>
        /// Deafult 
        /// </summary>
        internal const string DEFAULT_CATEGORYREWRITEREPLACE = "/list.aspx?category=$1&rewriteVersion=1";
        /// <summary>
        /// Default category rewrite pattern.
        /// </summary>
        internal const string DEFAULT_CATEGORYREWRITE = "~/({2})$";
        /// <summary>
        /// The default name of the JSON method mapping key.  Default is "method"
        /// so values passed as JSON method mappers should look like method1, method2, method3 etc..
        /// </summary>
        internal const string DEFAULT_METHOD_KEY = "method";
        /// <summary>
        /// A sad message for people who want to see the site but cannot.
        /// </summary>
        internal const string SAD_MESSAGE = "An error occured on the main thread, wait a few minutes and refresh this page.";
        /// <summary>
        /// Default value for Main.MainJSScript
        /// </summary>
        internal const string DEFAULT_MAINJSCRIPT = "~/pub/main.js";
        /// <summary>
		/// The event source name of this module.
		/// </summary>
        internal const string EVENT_SOURCE = "Rendition : {0}";
		/// <summary>
		/// Client agent signature for FTP connections.
		/// </summary>
        internal const string FTP_AGENT_SIGNATURE = "Rendition 1.1 FTP CLIENT";
        /// <summary>
        /// The error message that appears when a Razor engine parse error occurs.
        /// </summary>
        internal const string RAZOR_ERROR_STRING = @"<div style=""border:solid 1px #CCC;padding:4px;margin:4px;background:black;color:goldenrod;"">
            <p>Razor Engine Parse Error<b>{0}</b></p>
            <p>{1}</p>
            <pre>{2}</pre>
        </div>";

        #endregion
        #region Static Fields
        /// <summary>
        /// Default public files.
        /// </summary>
        private static string[] default_public_files = { "~/pub/main.js", "~/pub/logon.html",
		"~/admin/css/admin.css", "~/admin/css/admin.css", "~/admin/rendition.js",
        "~/admin/Rendition.js","~/admin/RenditionUI.js","~/admin/renditionui.js",
        "~/admin/favicon.ico" };
        /// <summary>
        /// List of the public files in the lib virtual path.
        /// </summary>
        internal static string[] PublicFiles;
        /// <summary>
        /// The reference JavaScript at /pub/main.js
        /// This main script for customer facing web sites.
        /// Plugins can also piggy back on this script.
        /// </summary>
        internal static string MainJSScript { get; set; }
        /// <summary>
        /// The Regex object for the category rewriter.
        /// </summary>
        internal static Regex ItemRewriteRegex = null;
        /// <summary>
        /// Telnet connections
        /// </summary>
        static ArrayList tConnections = new ArrayList();
        /// <summary>
        /// This Timer checks to see that site.cn is stll connected and if not goes into a retry
        /// state to reconnect to the database.
        /// </summary>
        private static Admin.Timer connectionChecker;
        /// <summary>
        /// This Timer checks the email queue for emails that have not been sent yet, and when it finds them
        /// it sends them.
        /// </summary>
        private static Admin.Timer emailQueue;
        /// <summary>
        /// This Timer checks to see if any shipment rows have been updated with tracking information
        /// </summary>
        private static Admin.Timer shipmentUpdateQueue;
        /// <summary>
        /// The last checksum of the email queue table (no longer used).
        /// </summary>
        private static int emailQueueTableChecksum = -1;
        /// <summary>
        /// A list of upload infos for keeping track of upload progress.
        /// </summary>
        internal static Dictionary<Guid, ProgressInfo> ProgressInfos = new Dictionary<Guid, ProgressInfo>();
        /// <summary>
        /// The default port for the telnet server.
        /// </summary>
        internal static int TelnetServerPort = 4000;
        /// <summary>
        /// SHA1 Salt
        /// </summary>
        internal const string SHA1HASHSALT = DEFAULT_SHA1HASHSALT;
        /// <summary>
        /// user name for access elevation
        /// </summary>
        internal static string ElevatedSecurityUser = String.Empty;
        /// <summary>
        /// password for access elevation
        /// </summary>
        internal static string ElevatedSecurityPassword = String.Empty;
        /// <summary>
        /// domain name for access elevation
        /// </summary>
        internal static string ElevatedSecurityDomain = String.Empty;
        /// <summary>
        /// Logging class
        /// </summary>
        internal static Logger debug;
        /// <summary>
        /// Localization file.
        /// </summary>
        internal static string LocalizationFile = String.Empty;
        #endregion
        #region Static Properties
        /// <summary>
        /// Gets or sets a value indicating whether this instance has a database connection.
        /// </summary>
        /// <value>
        /// 	<c>true</c> if this instance has a database connection; otherwise, <c>false</c>.
        /// </value>
        public static bool HasDatabaseConnection { get; internal set; }
        /// <summary>
        /// File System Access Mode.
        /// </summary>
        public static FileSystemAccess FileSystemAccess { get; internal set; }
        /// <summary>
        /// Log verbosity.
        /// </summary>
        public static int LogVerbosity { get; internal set; }
        /// <summary>
        /// Gets the reason why the site cannot start.
        /// </summary>
        public static Exception CannotStartException { get; internal set; }
        /// <summary>
        /// UI scripts to append to /admin/Rendition.js when it loads.
        /// </summary>
        public static List<string> UIScripts { get; set; }
        /// <summary>
        /// A place to put your things.  This object will stay in memory between page refreshes.
        /// </summary>
        public static Dictionary<string, object> Items { get; set; }
        /// <summary>
        /// Scripts to be added to the /pub/main.js file Main.MainJScript.
        /// </summary>
        public static List<string> MainScripts { get; set; }
		/// <summary>
		/// Uses a logon HTML page instead of RFC 2617 HTTP Authentication
		/// </summary>
        public static bool UseFormsBasedAuth { get; internal set; }
		/// <summary>
		/// The current trust level of the virtual server.
		/// </summary>
        public static AspNetHostingPermissionLevel TrustLevel { get; internal set; }
		/// <summary>
		/// The version of the IIS server the application is running on.
		/// </summary>
        public static int IISVersion { get; internal set; }
		/// <summary>
		/// Indicates if the HTTP virtual server can facilitate SSL connections.
		/// </summary>
        public static bool CanUseSSL { get; internal set; }
		/// <summary>
		/// List of conversations in this application.
		/// </summary>
        public static List<Admin.Conversation> Conversations { get; internal set; }
		/// <summary>
		/// Messages produced by the utilites.debug for consumption in the client-server sync function Admin.systemMessage
		/// </summary>
        public static List<Dictionary<string, object>> SystemMessages { get; internal set; }
		/// <summary>
        /// Repetitious event timers attached from plugins.
		/// </summary>
        public static List<Admin.Timer> Timers { get; internal set; }
		/// <summary>
		/// Version of Rendition.
		/// </summary>
        public static string Version { get; internal set; }
		/// <summary>
		/// Name of the field used to pass JSON method request string in
		/// </summary>
        public static string MethodKey { get; internal set; }
        /// <summary>
        /// Category rewrite directive.  Checks for matches against the list of categories. 
        /// {0} will be replaced with the category name.  
        /// {1} will be replaced with the category Id,
        /// {2} will be replaced with category name with - for spaces.
        /// {3} will be replaced with category name with _ for spaces.
        /// {4} will be replaced with category name with . for spaces.
        /// </summary>
        public static string CategoryRewrite { get; internal set; }
        /// <summary>
        /// Category rewrite replace directive.  Replaces the pattern in Main.CategoryRewrite using RegEx.Replace().
        /// </summary>
        public static string CategoryRewriteReplace { get; internal set; }
        /// <summary>
        /// Category rewrite directive.  Checks for matches against the list of categories. 
        /// {0} will be replaced with item number.  {1} will be replaced with the item description.
        /// </summary>
        public static string ItemRewrite { get; internal set; }
        /// <summary>
        /// Item rewrite replace directive.  Replaces the pattern in Main.ItemRewrite using RegEx.Replace().
        /// </summary>
        public static string ItemRewriteReplace { get; internal set; }
		/// <summary>
		/// The directory that users will type into the URL to get to the public scripts and pages.
		/// </summary>
		public static string PublicDirectory { get; internal set; }
		/// <summary>
		/// The directory that users will type into the URL to get to the Admin program.
		/// </summary>
        public static string AdminDirectory { get; internal set; }
		/// <summary>
		/// The directory that plugins must be installed into.
		/// </summary>
        public static string PluginDirectory { get; internal set; }
		/// <summary>
		/// The directory that users folders and files will appear when created by default.
		/// </summary>
        public static string UserDirectory { get; internal set; }
		/// <summary>
		/// Directory where item and gallery images will render to.
		/// </summary>
        public static string ImageDirectory { get; internal set; }
		/// <summary>
		/// Temporary directory for storing uploads before they are turned into files.
		/// </summary>
        public static string TempDirectory { get; internal set; }
        /// <summary>
        /// Item image output default compression level for lossy images.
        /// </summary>
        public static long Compression { get; internal set; }
        /// <summary>
        /// Item image output default file type.  Default is Jpeg.
        /// </summary>
        public static System.Drawing.Imaging.ImageFormat ImageFormat { get; internal set; }
        /// <summary>
        /// Query string key name used in List.CurrentList.
        /// </summary>
        public static string RequestCategory { get; internal set; }
        /// <summary>
        /// Query string key name used in Item.CurrentItem.
        /// </summary>
        public static string RequestItem { get; internal set; }
		/// <summary>
		/// AJAX responder URL.  Point all the client side AJAX functions to this virtual URL.
		/// </summary>
        public static string Responder { get; internal set; }
		/// <summary>
		/// AJAX Admin responder URL.  Point all the Admin client side AJAX functions to this virtual URL.
		/// This URL must always be secure!  Only people logged on as administrators can access this URL.
		/// This URL executes very unsafe functions (execute arbitrary code, execute arbitrary queries).
		/// </summary>
        public static string AdminResponder { get; internal set; }
		/// <summary>
		/// Physical path to the application on the server.
		/// </summary>
        public static string PhysicalApplicationPath { get; internal set; }
		/// <summary>
		/// The site and all its fields and methods and everything.
		/// </summary>
        public static Site Site { get; internal set; }
		/// <summary>
		/// Startup state of the application.
		/// </summary>
        public static SiteState State { get; set; }
		/// <summary>
		/// The application object.
		/// </summary>
        public static HttpApplication App { get; internal set; }
		/// <summary>
		/// A list of running plugins.
		/// </summary>
        public static List<Plugin> Plugins { get; internal set; }
        /// <summary>
        /// A list of disabled plugins.
        /// </summary>
        public static List<String[]> RevokedPlugins { get; internal set; }
        #endregion
        #region Static Methods
        /// <summary>
		/// Converts a file path into the interal resource string hash.
		/// </summary>
		/// <param name="fileName">Name of the file.</param>
		/// <returns></returns>
		internal static string getRscString(string fileName) {
			return fileName.Replace(".","").Replace(":","").
			Replace("/","__").Replace("-","_").Replace("~__","").ToLower();
		}
		/// <summary>
		/// Gets a file out of the resx.
		/// </summary>
		/// <param name="name">The name.</param>
		/// <returns></returns>
		internal static object getAdminResource(string name) {
			Assembly asm = Assembly.GetExecutingAssembly();
            string defaultAdminPage = "admin__defaulthtml";
			System.Resources.ResourceManager rm =
				new System.Resources.ResourceManager("Rendition.Properties.Admin_Resources",asm);
			string resName = getRscString(name);
            if(resName == "admin__") {
				//admin page
                resName = defaultAdminPage;
			}
			/* check and see if this user has a script path for his/her setup 
			 * this is the JS customization kit.  There is nothing more to it than
			 * these 7 lines of text.  If they would otherwise see the default page,
			 * show them their custom page instead. */
            if(resName == defaultAdminPage) {
				Session session=Main.GetCurrentSession();
                if(session.User != null) {
                    if(session.User.AdminScript.Length > 0) {
                        if(File.Exists(session.User.AdminScript)) {
                            ("using user's custom res script " + session.User.AdminScript).Debug(10);
                            return File.ReadAllText(session.User.AdminScript);
                        }
                    }
                }
			}
			("returning res object:"+resName).Debug(10);
			return rm.GetObject(resName);
		}
		/// <summary>
		/// Gets the current session requesting the HTTP resource.
		/// </summary>
		/// <returns>Session</returns>
		internal static Session GetCurrentSession(){
			HttpContext current = HttpContext.Current;
			if(current==null){return null;}
			Session session = ((Session)current.Items["currentSession"]);
			/* if the value isn't loaded then get it */
			if(session==null){
				session = new Session( Site );
				/* place the session object in an object that is only good as long as the http pipeline lasts */
				if( !current.Items.Contains( "currentSession" ) ) {
					current.Items.Add( "currentSession", session );
				} else {
					current.Items[ "currentSession" ] = session;
				}
			}
			return session;
		}
        /// <summary>
        /// Holds waiting HTTP threads while the site starts up.
        /// </summary>
        static void waitUntilStartup() {
            /* When additional threads try to connect while the
             * site is starting up, place them in a wait state */
            while(State != SiteState.Started) {
                Thread.Sleep(1000);
                if(State == SiteState.CannotLogonToDataBase) {
                    Exception ex = new Exception("Startup failure.  Cannot logon to database.");
                    throw ex;
                }
                if(State == SiteState.CannotStart) {
                    string msg = @"Startup failure.  Cannot start for some reason.  
Make sure that any plugins you've installed are for this version of Rendition {0}
Try removing any new plugins and try again. If your plugin is used in .aspx pages make sure
the plugin is added to the Global Assembly Cache.
Source: {1}  
Error: {2}";
                    Exception ex;
                    if(CannotStartException != null) {
                        ex = new Exception(String.Format(msg, Version, CannotStartException.Source, CannotStartException.Message));
                    } else {
                        ex = new Exception(String.Format(msg, Version, "Rendition", "Startup Failure"));
                    }
                    ex.Message.Debug(0);
                    // something is really fucked up - keep restarting until it works
                    Process.GetCurrentProcess().Kill();
                    // this line will never be reached becuause the previous line ends the process
                    throw ex;
                }
                /* if ever the site decides to start or if the site dies exit this loop. */
                if(State == SiteState.Started) {
                    break;
                }
                ("A thread is wating for the site to finish starting or finish refreshing.").Debug(0);
            }
        }
        #endregion
    }
}