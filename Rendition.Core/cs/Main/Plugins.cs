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
using System.IO;
using System.Reflection;
using System.Xml;
using System.AddIn;
namespace Rendition {
	internal partial class Main : IHttpModule {
        #region Static Methods
        /// <summary>
        /// Revokes the plugin.
        /// </summary>
        /// <param name="pluginId">The plugin id.</param>
        /// <param name="unrevoke">if set to <c>true</c> [unrevoke].</param>
        internal static void revokePlugin(Guid pluginId, bool unrevoke) {
            string DOMpluginId = "revoke_plugin_" + pluginId.ToBase64DomId();
            if(unrevoke) {
                updateAppSetting(DOMpluginId, pluginId.ToString(), true);
            } else {
                updateAppSetting(DOMpluginId, pluginId.ToString(), false);
            }
        }
        /// <summary>
        /// Determines whether the specified plugin is revoked.
        /// </summary>
        /// <param name="pluginId">The plugin id.</param>
        /// <returns>
        ///   <c>true</c> if the specified plugin is revoked; otherwise, <c>false</c>.
        /// </returns>
        internal static bool isPluginRevoked(Guid pluginId) {
            string[] DOMpluginId = {"revoke_plugin_"+pluginId.ToBase64DomId()};
            Dictionary<string, string> config = readWebConfigAppSetting(DOMpluginId);
            if(!config.ContainsKey(DOMpluginId[0])) { return false; }
            Guid id = Guid.Empty;
            Guid.TryParse(config[DOMpluginId[0]], out id);
            if(id == pluginId) {
                return true;
            } else {
                return false;
            }
        }
        /// <summary>
        /// Gets the config file path.
        /// </summary>
        /// <returns></returns>
        private static string getConfigFilePath() {
            return Main.PhysicalApplicationPath + "web.config";
        }
        /// <summary>
        /// Determines whether the specified plugin is loaded.
        /// </summary>
        /// <param name="plugin">The plugin.</param>
        /// <returns>
        ///   <c>true</c> if the specified plugin is loaded; otherwise, <c>false</c>.
        /// </returns>
        public static bool IsPluginLoaded(Type plugin) {
            foreach(Plugin p in Plugins) {
                if(plugin.GUID == p.GetType().GUID) {
                    return true;
                }
            }
            return false;
        }
        /// <summary>
        /// Adds a plugin.
        /// </summary>
        /// <param name="plugin">The plugin.</param>
        /// <param name="pinfo">The pinfo.</param>
        public static void AddPlugin(Type plugin, PluginInfo pinfo) {
            if(plugin.BaseType.FullName == "Rendition.Plugin") {
                /* see if the plugin is revoked */
                if(!isPluginRevoked(plugin.GUID)) {
                    /* this is a plugin
                     * add it to the plugin list
                     */
                    try {
                        Plugin p = Activator.CreateInstance(plugin) as Plugin;
                        p.Info = pinfo;
                        Plugins.Add(p);
                        ("Plugin Loaded:" + p.Info.Name + " v." + p.Info.Version).Debug(5);
                    } catch(ReflectionTypeLoadException e) {
                        String.Format("Plugin threw an exception on Activator.CreateInstance.{0}",
                        e.LoaderExceptions).Debug(1);
                    }
                } else {
                    string[] pluginData = { plugin.FullName, plugin.GUID.ToString() };
                    RevokedPlugins.Add(pluginData);
                }
            }
        }
        /// <summary>
        /// Adds a plugin.
        /// </summary>
        /// <param name="asm">The asm.</param>
        public static void AddPlugin(Assembly asm) {
            try {
                foreach(Type type in asm.GetTypes()) {
                    if(type.IsAbstract) continue;
                    PluginInfo i = new PluginInfo();
                    AssemblyName nameInfo = asm.GetName();
                    i.Name = nameInfo.FullName;
                    i.Version = nameInfo.Version.Major + "." + nameInfo.Version.Minor +
                        " build " + nameInfo.Version.Build;
                        object[] c = asm.GetCustomAttributes(typeof(AssemblyCopyrightAttribute), false);
                        i.Author = ((AssemblyCopyrightAttribute)c[0]).Copyright;
                        c = asm.GetCustomAttributes(typeof(AssemblyDescriptionAttribute), false);
                        i.Description = ((AssemblyDescriptionAttribute)c[0]).Description;
                        c = asm.GetCustomAttributes(typeof(AssemblyProductAttribute), false);
                        string prodcut = ((AssemblyProductAttribute)c[0]).Product;
                        if(prodcut.Length > 0) {
                            i.Name = prodcut;
                        }
                
                    AddPlugin(type, i);
                }
            } catch (Exception ex){
                string asmName = String.Empty;
                try{
                    asmName = asm.GetName().FullName;
                }catch (Exception  _ex){
                    asmName = String.Format("Cannot interogate assembly.: {0}",_ex.Message);
                }
                String.Format(@"A Plugin threw an exception on Assembly.GetTypes(). 
This is probably due to a version mismatch.  Make sure your plugin is compiled using
the version of Rendition this site is running ({2}).  If your plugin is used in .aspx pages make sure
the plugin is added to the Global Assembly Cache.
Source: {0}
Error: {1} ", asmName, getInnermostException(ex).Message, Main.Version).Debug(1);
            }
        }
		/// <summary>
		/// Gets the plugins from the plugin directory.
		/// </summary>
		internal static void getPlugins() {
			( "looking for plugins..." ).Debug( 10 );
			// scan the plugins and bin directories if any for DLLs to hookup
            string pluginDirName = Main.PluginDirectory.Replace("~/", PhysicalApplicationPath);
            string binDirName = PhysicalApplicationPath + "bin";
			List<string> files = new List<string>(Directory.GetFiles(binDirName));
            if(Directory.Exists(pluginDirName)) {
                files.AddRange(Directory.GetFiles(pluginDirName));
            }
            foreach( string file in files ) {
				// load dll files only
				if( Path.GetExtension( file ).ToLower() == ".dll" &&
                    (!file.EndsWith("Rendition.Core.dll")) ) {
					try {
						// open a stream for reading so the file doesn't get locked
                        byte[] asmBytes = System.IO.File.ReadAllBytes(file);
                        Assembly asm = Assembly.Load(asmBytes);
                        AddPlugin(asm);
					} catch( ReflectionTypeLoadException e ) {
						String.Format( "Plugin {0} threw an exception on Activator.CreateInstance.{1}",
						file, e.LoaderExceptions ).Debug( 1 );
					}
				}
			}
        }
        #endregion
    }
	/// <summary>
	/// This class allows other DLLs to attach to event handlers in this DLL.
	/// This is the basis for the plugin system.  All plugins must inherit this class.
	/// </summary>
	public abstract class Plugin : MarshalByRefObject {
        #region Instance Properties
        /// <summary>
		/// Last return message.
		/// </summary>
        public string Message { get; set; }
		/// <summary>
		/// Last return error number.
		/// </summary>
        public int Error { get; set; }
		/// <summary>
		/// Info about this plugin. 
		/// </summary>
        public PluginInfo Info { get; internal set; }
        /// <summary>
        /// List of all the resources in this plugin. 
        /// </summary>
        public string[] ResourceNames {
            get {
                Assembly asm = Assembly.GetAssembly(this.GetType());
                return asm.GetManifestResourceNames();
            }
        }
        #endregion
        #region Instance Methods
        /// <summary>
        /// Returns a resource string stored in the default namespace.
        /// </summary>
        /// <param name="name">The name of the resource.</param>
        public string GetResourceString(string name) {
            Assembly asm = Assembly.GetAssembly(this.GetType());
            StreamReader sr = new StreamReader(asm.GetManifestResourceStream(this.GetType().Namespace + "." + name.Replace("/", ".")));
            return sr.ReadToEnd();
        }
        /// <summary>
        /// Returns a resource stream stored in the default namespace.
        /// </summary>
        /// <param name="name">The name of the resource.</param>
        public Stream GetResourceStream(string name) {
            Assembly asm = Assembly.GetAssembly(this.GetType());
            return asm.GetManifestResourceStream(this.GetType().Namespace + "." + name.Replace("/", "."));
        }
        #endregion
        #region Json Mapper Classes
        /// <summary>
        /// Overrides and addons for Admin JSON Responder
        /// </summary>
        public class Admin : Rendition.Admin { }
        /// <summary>
        /// Overrides and addons for Public JSON Responder
        /// </summary>
        public class Merchant : Rendition.Merchant { }
        #endregion
    }
	/// <summary>
	/// What type of plugins are acceptable in this system.
	/// </summary>
	public enum PluginTypes {
		/// <summary>
		/// An event handler in ISiteInterface
		/// </summary>
		SiteEvent
	}
	/// <summary>
	/// Info about the author of the plugin, publish date etc.  Data is
    /// pulled from the assembly into these files by default but can be overwritten.
	/// </summary>
	public sealed class PluginInfo {
        #region Instance Properties
        /// <summary>
		/// Name of the plugin.  Like "Change status for Jim's Cogs".
		/// </summary>
        public string Name { get; internal set; }
		/// <summary>
		/// What the plugin actually does.
		/// </summary>
        public string Description { get; internal set; }
		/// <summary>
		/// Who is to blame for this plugin.
		/// </summary>
        public string Author { get; internal set; }
		/// <summary>
		/// The version of this plugin.
		/// </summary>
        public string Version { get; internal set; }
        #endregion
    }
}
