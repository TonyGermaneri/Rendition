using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.IO;
using System.Reflection;
using System.Text.RegularExpressions;
using Rendition;
namespace Rendition.example.fileEmbedding {
    public class main : Plugin {
        /// <summary>
        /// This will be the "prefix" used in the URL for the URL matcher later on.  
        /// default: fileEmbedding
        /// Example URL: www.mysite.com/fileEmbedding/myEmbeddedFolder/myEmbeddedFile.jpg
        /// </summary>
        static string URLPrefix = "fileEmbedding";
        /// <summary>
        /// Set info, attach to event
        /// </summary>
        public main() {
            Info.Author = "Tony Germaneri";
            Info.Description = "Sample file embedding / retreival plugin ";
            Info.Name = "Sample File Embedding";
            Info.PublishDate = "4/21/2012";
            Info.Version = "1";
            Rendition.Main.Site.BeginRequest += new EventHandler(beginRequest);
        }
        /// <summary>
        /// Rntercept the request - match the url to embedded files
        /// dish up file and abort defult if one is found.
        /// </summary>
        public void beginRequest(Object sender, EventArgs e) {
            Rendition.BeginRequestEventArgs args = (BeginRequestEventArgs)e;
            /* check if any of the URL's match our plugin name + internal path */
            /* url comes in like /default.aspx */
            HttpContext current = args.CurrentHttpContext;
            string url = current.Request.RawUrl;
            foreach(string name in ResourceNames){
                /* does it match the magic pattern? */
                if(Regex.IsMatch(url, "/" + URLPrefix + name.Replace(this.GetType().Namespace, "").Replace(".", "[./]"))) {
                    using(System.IO.Stream stream = GetResourceStream(name.Replace(this.GetType().Namespace+".",""))){
                        string mimeType = Admin.GetMimeType(name);
                        HttpContext.Current.Response.AddHeader("Content-Length", stream.Length.ToString());
                        current.Response.ContentType = mimeType;
                        byte[] buffer = new byte[stream.Length];
                        stream.Read(buffer, 0, (int)stream.Length);
                        current.Response.BinaryWrite(buffer);
                        current.Response.Flush();
                        args.PreventDefault();
                        stream.Close();
                        current.ApplicationInstance.CompleteRequest();
                    }
                    break;
                }
            }
        }
        /// <summary>
        /// List of all the resources in this plugin. 
        /// </summary>
        public string[] ResourceNames {
            get {
                Assembly asm = Assembly.GetAssembly(this.GetType());
                return asm.GetManifestResourceNames();
            }
        }
        /// <summary>
        /// Returns a resource string.
        /// </summary>
        /// <param name="name">The name of the resource.</param>
        public string GetResourceString(string name) {
            Assembly asm = Assembly.GetAssembly(this.GetType());
            StreamReader sr = new StreamReader(asm.GetManifestResourceStream(this.GetType().Namespace + "." + name.Replace("/", ".")));
            return sr.ReadToEnd();
        }
        /// <summary>
        /// Returns a resource stream.
        /// </summary>
        /// <param name="name">The name of the resource.</param>
        public Stream GetResourceStream(string name) {
            Assembly asm = Assembly.GetAssembly(this.GetType());
            return asm.GetManifestResourceStream(this.GetType().Namespace + "." + name.Replace("/", "."));
        }
    }
}
