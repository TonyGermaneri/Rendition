using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Xml;
namespace Rendition {
    internal partial class Main : IHttpModule {
        #region Static Methods
        private static void LoadConfig(Rendition.Site.SiteConfiguration baseConfig) {
            Main.TelnetServerPort = baseConfig.TelnetServerPort;
            Main.FileSystemAccess = baseConfig.FileSystemAccess;
            Main.LogVerbosity = baseConfig.LogVerbosity;
            Main.UseFormsBasedAuth = baseConfig.UseFormsBasedAuth;
            Main.CanUseSSL = baseConfig.CanUseSSL;
            if(baseConfig.Compression>0) {
                Main.Compression = baseConfig.Compression;
            }
            if(baseConfig.LocalizationFile != null) { Main.LocalizationFile = baseConfig.LocalizationFile; }
            if(baseConfig.AdminDirectory != null) { Main.AdminDirectory = baseConfig.AdminDirectory; }
            if(baseConfig.PluginDirectory != null) { Main.PluginDirectory = baseConfig.PluginDirectory; }
            if(baseConfig.TempDirectory != null) { Main.TempDirectory = baseConfig.TempDirectory; }
            if(baseConfig.ImageDirectory != null) { Main.ImageDirectory = baseConfig.ImageDirectory; }
            if(baseConfig.UserDirectory != null) { Main.UserDirectory = baseConfig.UserDirectory; }
            if(baseConfig.Responder != null) { Main.Responder = baseConfig.Responder; }
            if(baseConfig.ElevatedSecurityUser != null) { Main.ElevatedSecurityUser = baseConfig.ElevatedSecurityUser; }
            if(baseConfig.ElevatedSecurityPassword != null) { Main.ElevatedSecurityPassword = baseConfig.ElevatedSecurityPassword; }
            if(baseConfig.ElevatedSecurityDomain != null) { Main.ElevatedSecurityDomain = baseConfig.ElevatedSecurityDomain; }
            if(baseConfig.MethodKey != null) { Main.MethodKey = baseConfig.MethodKey; }
            if(baseConfig.CategoryRewrite != null) { Main.CategoryRewrite = baseConfig.CategoryRewrite; }
            if(baseConfig.PublicFiles != null) { Main.PublicFiles = baseConfig.PublicFiles; }
            if(baseConfig.CategoryRewriteReplace != null) { Main.CategoryRewriteReplace = baseConfig.CategoryRewriteReplace; }
            if(baseConfig.ItemRewrite != null) { Main.ItemRewrite = baseConfig.ItemRewrite; }
            if(baseConfig.ItemRewriteReplace != null) { Main.ItemRewriteReplace = baseConfig.ItemRewriteReplace; }
            if(baseConfig.PublicDirectory != null) { Main.PublicDirectory = baseConfig.PublicDirectory; }
            if(baseConfig.RequestCategory != null) { Main.RequestCategory = baseConfig.RequestCategory; }
            if(baseConfig.RequestItem != null) { Main.RequestItem = baseConfig.RequestItem; }
            if(baseConfig.MainJSScript != null) { Main.MainJSScript = baseConfig.MainJSScript; }
            if(baseConfig.ImageFormat != null) { Main.ImageFormat = baseConfig.ImageFormat; }
        }
        /// <summary>
        /// Reads the web config app setting.
        /// </summary>
        /// <param name="keyNames">The key names.</param>
        /// <returns></returns>
        private static Dictionary<string, string> readWebConfigAppSetting(string[] keyNames) {
            Dictionary<string, string> j = new Dictionary<string, string>();
            foreach(string keyName in keyNames) {
                string ele = null;
                try {
                    ele = System.Configuration.ConfigurationManager.AppSettings[keyName];
                } catch(Exception e) {
                    e.Message.Debug(9);
                }
                if(ele != null) {
                    j.Add(keyName, ele);
                }
            }
            return j;
        }
        /// <summary>
        /// Reads the web.config configuration.
        /// </summary>
        internal static Site.SiteConfiguration readConfiguration() {
            Site.SiteConfiguration _siteConfig = new Site.SiteConfiguration();
            string[] configKeys = { 
                "UniqueSiteId",
                "FileSystemAccess",
                "LogVerbosity",
                "TelnetServerPort",
			    "ConnectionName",
                "AdminDirectory",
                "PluginDirectory",
                "ImageDirectory",
                "TempDirectory",
                "UserDirectory",
			    "Responder",
                "AdminResponder",
                "ElevatedSecurityUser",
                "ElevatedSecurityPassword",
			    "ElevatedSecurityDomain",
                "Compression",
                "MethodKey",
                "CategoryRewrite",
                "PublicFiles",
                "CategoryRewriteReplace",
                "ItemRewrite",
                "ItemRewriteReplace",
                "PublicDirectory",
                "RequestCategory",
                "RequestItem",
                "MainJSScript",
                "CanUseSSL",
                "ImageFormat",
                "UseFormsBasedAuth",
                "Localization",
                "AlternateDatabase",
                "AdminUserName",
                "AdminPassword"
            };
            Dictionary<string, string> config = readWebConfigAppSetting(configKeys);
            MissingFieldException ex = new MissingFieldException("One or more required field are missing from web.config");
            bool altDb = false;
            if(config.ContainsKey("AlternateDatabase")) {
                if(!bool.TryParse(config["AlternateDatabase"], out altDb)) {
                    altDb = false;
                }
            }
            if(config.ContainsKey("AdminPassword")) {
                _siteConfig.AdminPassword = config["AdminPassword"];
            }
            if(config.ContainsKey("AdminUserName")) {
                _siteConfig.AdminUserName = config["AdminUserName"];
            }
            if(config.ContainsKey("Localization")) {
                _siteConfig.LocalizationFile = config["Localization"];
            }
            bool fba = true;
            if(config.ContainsKey("UseFormsBasedAuth")) {
                if(!bool.TryParse(config["UseFormsBasedAuth"], out fba)) {
                    fba = true;
                }
            }
            _siteConfig.UseFormsBasedAuth = fba;
            if(config.ContainsKey("ImageFormat")) {
                if(config["ImageFormat"].ToString().ToLower() == "png") {
                    _siteConfig.ImageFormat = System.Drawing.Imaging.ImageFormat.Png;
                }
            }
            if(config.ContainsKey("MainJSScript")) {
                _siteConfig.MainJSScript = config["MainJSScript"];
            }
            if(config.ContainsKey("RequestItem")) {
                _siteConfig.RequestItem = config["RequestItem"];
            }
            if(config.ContainsKey("RequestCategory")) {
                _siteConfig.RequestCategory = config["RequestCategory"];
            }
            if(config.ContainsKey("PublicDirectory")) {
                _siteConfig.PublicDirectory = config["PublicDirectory"];
            }
            if(config.ContainsKey("ItemRewriteReplace")) {
                _siteConfig.ItemRewrite = config["ItemRewriteReplace"];
            }
            if(config.ContainsKey("CategoryRewriteReplace")) {
                _siteConfig.CategoryRewrite = config["CategoryRewriteReplace"];
            }
            if(config.ContainsKey("ItemRewrite")) {
                _siteConfig.ItemRewrite = config["ItemRewrite"];
            }
            if(config.ContainsKey("MethodKey")) {
                _siteConfig.MethodKey = config["MethodKey"];
            }
            if(config.ContainsKey("CategoryRewrite")) {
                _siteConfig.CategoryRewrite = config["CategoryRewrite"];
            }
            if(config.ContainsKey("PublicFiles")) {
                try {
                    _siteConfig.PublicFiles = config["PublicFiles"].ToString().Split(',');
                } catch {
                    _siteConfig.PublicFiles = Main.default_public_files;
                }
            }
            long compl = 75L;
            if(config.ContainsKey("Compression")) {
                if(!long.TryParse(config["Compression"], out compl)) {
                    compl = Main.DEFAULT_COMPRESSION;
                    Debug.WriteLine("Invalid value in web config for Compression.  Must be number between 0 and 100.  Defaulting to 75.");
                }
            } else {
                compl = Main.DEFAULT_COMPRESSION;
            }
            _siteConfig.Compression = compl;
            bool cussl = false;
            if(config.ContainsKey("CanUseSSL")) {
                if(!bool.TryParse(config["CanUseSSL"], out cussl)) {
                    cussl = false;
                }
            }
            _siteConfig.CanUseSSL = cussl;
            if(config.ContainsKey("AdminDirectory")) {
                _siteConfig.AdminDirectory = config["AdminDirectory"];
            }
            if(config.ContainsKey("ConnectionName")) {
                _siteConfig.ConnectionName = config["ConnectionName"];
            }
            if(config.ContainsKey("PluginDirectory")) {
                _siteConfig.PluginDirectory = config["PluginDirectory"];
            }
            if(config.ContainsKey("ImageDirectory")) {
                _siteConfig.ImageDirectory = config["ImageDirectory"];
            }
            if(config.ContainsKey("TempDirectory")) {
                _siteConfig.TempDirectory = config["TempDirectory"];
            }
            if(config.ContainsKey("UserDirectory")) {
                _siteConfig.UserDirectory = config["UserDirectory"];
            }
            if(config.ContainsKey("Responder")) {
                _siteConfig.Responder = config["Responder"];
            }
            if(config.ContainsKey("AdminResponder")) {
                _siteConfig.AdminResponder = config["AdminResponder"];
            }
            if(config.ContainsKey("ElevatedSecurityUser")) {
                _siteConfig.ElevatedSecurityUser = config["ElevatedSecurityUser"];
            }
            if(config.ContainsKey("ElevatedSecurityPassword")) {
                _siteConfig.ElevatedSecurityPassword = config["ElevatedSecurityPassword"];
            }
            if(config.ContainsKey("ElevatedSecurityDomain")) {
                _siteConfig.ElevatedSecurityDomain = config["ElevatedSecurityDomain"];
            }
            if(config.ContainsKey("UniqueSiteId")) {
                _siteConfig.UniqueSiteId = new Guid(config["UniqueSiteId"]);
            } else {
                _siteConfig.UniqueSiteId = Guid.Empty;
            }
            if(config.ContainsKey("FileSystemAccess")) {
                string fsa = config["FileSystemAccess"].ToString().ToLower();
                if(!(fsa == "site" || fsa == "full")) {/*only two valid settings*/
                    _siteConfig.FileSystemAccess = Rendition.FileSystemAccess.Site;
                    Debug.WriteLine(@"Invalid value in web config for FileSystemAccess.  
Must be ""Site"" or ""Full"".  No big deal.  Returning to default site only access.");
                } else if(fsa == "site") {
                    _siteConfig.FileSystemAccess = Rendition.FileSystemAccess.Site;
                } else if(fsa == "full") {
                    _siteConfig.FileSystemAccess = Rendition.FileSystemAccess.System;
                }
            }else{
                 _siteConfig.FileSystemAccess = Rendition.FileSystemAccess.Site;
            }
            int vblvl;
            if(config.ContainsKey("LogVerbosity")) {
                if(!int.TryParse(config["LogVerbosity"], out vblvl)) {
                    vblvl = Main.DEFAULT_LOG_VERBOSITY;
                    Debug.WriteLine("Invalid value in web config for LogVerbosity.  Must be number between 1 and 10.  Defaulting to 10.");
                }
            } else {
                vblvl = Main.DEFAULT_LOG_VERBOSITY;
            }
            int tlsp = -1;
            if(config.ContainsKey("TelnetServerPort")) {
                if(!int.TryParse(config["TelnetServerPort"], out tlsp)) {
                    tlsp = -1;
                }
            }
            if(tlsp == -1){
                System.Random r = new Random();
                tlsp = r.Next(Main.DEFAULT_MIN_TELNET_SERVER_PORT, Main.DEFAULT_MAX_TELNET_SERVER_PORT);
                Debug.WriteLine("Invalid or missing value in web config for TelnetServerPort.  Random port " + tlsp + " selected.");
            }
            _siteConfig.TelnetServerPort = tlsp;
            _siteConfig.LogVerbosity = vblvl;
            return _siteConfig;
        }
        /// <summary>
        /// Updates the Web.Config setting.
        /// </summary>
        /// <param name="key">The key.</param>
        /// <param name="value">The value.</param>
        /// <param name="delete">if set to <c>true</c> [delete].</param>
        private static void updateAppSetting(string key, string value, bool delete) {
            bool nodeWasPresent = false;
            XmlDocument xmlDoc = new XmlDocument();
            XmlNode appSettingsNode = null;
            XmlNode keyNode = null;
            xmlDoc.Load(AppDomain.CurrentDomain.SetupInformation.ConfigurationFile);
            foreach(XmlNode element in xmlDoc.DocumentElement) {
                if(element.Name.Equals("appSettings")) {
                    appSettingsNode = element;
                    foreach(XmlNode node in element.ChildNodes) {
                        if(node.Attributes != null) {
                            if(node.Attributes[0].Value.Equals(key)) {
                                keyNode = node;
                                node.Attributes[1].Value = value;
                                nodeWasPresent = true;
                            }
                        }
                    }
                }
            }
            if(nodeWasPresent == false && appSettingsNode != null) {
                XmlNode node = xmlDoc.CreateNode(XmlNodeType.Element, "add", null);
                XmlAttribute keyAttr = xmlDoc.CreateAttribute("key");
                keyAttr.Value = key;
                XmlAttribute valueAttr = xmlDoc.CreateAttribute("value");
                valueAttr.Value = value;
                node.Attributes.Append(keyAttr);
                node.Attributes.Append(valueAttr);
                keyNode = node;
                appSettingsNode.AppendChild(node);
            }
            if(delete) {
                keyNode.ParentNode.RemoveChild(keyNode);
            }
            xmlDoc.Save(getConfigFilePath());
            System.Configuration.ConfigurationManager.RefreshSection("appSettings");
        }
        #endregion
    }
}
