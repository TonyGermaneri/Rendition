using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rendition;
using System.Reflection;
using System.IO;
namespace Rendition {
    public class main : Plugin {
        /// <summary>
        /// Reads all the files ending with .js into the JS API Rendition.UI.StartupProcedure 
        /// to use this template, just place your .js files into your project directory
        /// and set the file's property Build Action to "Embedded Resource"
        /// </summary>
        public main(){
            Site.CurrentSite.Initializing += new EventHandler(Site_Initializing);
        }
        /// <summary>
        /// Runs once per site startup.  Loads all the .js files onto the back
        /// of the Rendition.js file using the Rendition.Main.UIScripts.Add() method.
        /// </summary>
        void Site_Initializing(object sender, EventArgs e) {
            // add scripts
            string[] files = { "Aging.js", "InventoryEditor.js", "ProductionAging.js",
                                 "ProductionPicklist.js", "SalesJournal.js","Ui_init.js" };
            foreach(string file in files) {
                Admin.AddUIScript(GetResourceString(file));
            }
            // add localization
            System.Xml.XmlDocument xmlDoc = new System.Xml.XmlDocument();
            xmlDoc.LoadXml(GetResourceString("Localization.xml"));
            FieldTitleLocalization.AddXMLSource(xmlDoc);
        }
    }
}
