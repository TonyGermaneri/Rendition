using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using Rendition;
using System.IO;
namespace Rendition {
    public class main : Plugin {
        public main() {
            Site.CurrentSite.Initializing += new EventHandler(Site_Initializing);
        }
        void Site_Initializing(object sender, EventArgs e) {
            Assembly asm = Assembly.GetExecutingAssembly();
            Stream file_stream = asm.GetManifestResourceStream("Rendition.jquery-1.7.2.min.js");
            StreamReader sr = new StreamReader(file_stream);
            string file_string = sr.ReadToEnd();
            Admin.AddMainScript(file_string);
        }
    }
}
