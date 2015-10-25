using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rendition;
using System.Reflection;
using System.IO;
namespace Rendition {
    public class LiveLogViewer : Plugin {
        public LiveLogViewer() {
            this.Info.Author = "Joe";
            this.Info.Description = "An Example JS Plugin";
            this.Info.Name = "Example JS Plugin";
            Rendition.Main.Site.Initializing += new EventHandler(Site_Initializing);
            Rendition.Main.Site.UIInitializing += new EventHandler(Site_UIInitializing);
        }

        void Site_UIInitializing(object sender, EventArgs e) {
            UIInitArgs args = (UIInitArgs)e;
            args.StartupProcedures.Add(@"
                Rendition.UI.defaultPanelItems.push({
                    text: 'My New Sample Application',
                    message: 'Edit and create blogs.',
                    src: '/admin/img/icons/application_home.png',
                    proc: function () {
                        myNewJSApplication();
                    }
                });
            ");

        }

        void Site_Initializing(object sender, EventArgs e) {
            Assembly asm = Assembly.GetExecutingAssembly();
            Stream file_stream = asm.GetManifestResourceStream("LiveLogViewer.LiveLogViewer.js");
            StreamReader sr = new StreamReader(file_stream);
            string file_string = sr.ReadToEnd();
            Rendition.Main.UIScripts.Add(file_string);
        }

    }
}
