using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Reflection;
using System.IO;
using Rendition;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Data;
using Microsoft.SqlServer.Server;
using System.Text.RegularExpressions;
namespace Rendition {
    /* this class is uses the interface on Site.CurrentSite (the instance of the site)
     * to interact with the backend program
     * The interaction is on two levels
     *  -> event : Initializing <- 
     * at this step we make sure the .js and localization files are attached 
     * to the main UI script so the user gets it when they download
     * /admin/Rendition.js
     * 
     *  -> event : afterrefresh <- 
     * Refresh the data in the cache when the
     * user clicks the 'refresh site cache' button
     * or another refresh event occurs
     * 
     */
    public class BlogPlugin: Plugin {
        public static Blogs Blogs;
        public static Galleries Galleries;
        public BlogPlugin() {
            Site.CurrentSite.AfterRefresh += new EventHandler(afterrefresh);
            Site.CurrentSite.UIInitializing += new EventHandler(UIInitializing);
            Site.CurrentSite.Initializing += new EventHandler(initializing);
        }
        private void UIInitializing(object sender, EventArgs e) {
            UIInitArgs args = (UIInitArgs)e;
            args.StartupProcedures.Add(GetResourceString("Ui_init.js"));
        }
        /// <summary>
        /// On site refresh make sure the blog cache is refreshed.  Add the blog to the site's item colleciton.
        /// </summary>
        private void afterrefresh(object sender, EventArgs e) {
            Blogs = new Blogs(Site.CurrentSite);
            Galleries = new Galleries(Site.CurrentSite);
            return;
        }
        /// <summary>
        /// On startup, make sure that the blog script is added to Rendition.js. 
        /// </summary>
        private void initializing(object sender, EventArgs e) {
            Admin.AddUIScript(GetResourceString("BlogEditor.js"));
            Admin.AddUIScript(GetResourceString("GalleryEditor.js"));
            Admin.AddUIScript(GetResourceString("Ui_init.js"));
            Galleries = new Galleries(Site.CurrentSite);
            Blogs = new Blogs(Site.CurrentSite);
            // add localization
            System.Xml.XmlDocument xmlDoc = new System.Xml.XmlDocument();
            xmlDoc.LoadXml(GetResourceString("Localization.xml"));
            FieldTitleLocalization.AddXMLSource(xmlDoc);
        }
        public class Admin : Rendition.Admin {
            /// <summary>
            /// Refreshes the galleries cache.
            /// </summary>
            public static void RefreshGalleriesCache() {
                Site.SiteState = SiteState.Refreshing;
                try {
                    Galleries = new Galleries(Site.CurrentSite);
                } finally {
                    Site.SiteState = SiteState.Started;
                }
            }
            /// <summary>
            /// Refreshes the Blogs cache.
            /// </summary>
            public static void RefreshBlogsCache() {
                Site.SiteState = SiteState.Refreshing;
                try {
                    Blogs = new Blogs(Site.CurrentSite);
                } finally {
                    Site.SiteState = SiteState.Started;
                }
            }
        }
        public class Merchant : Rendition.Merchant {
            /// <summary>
            /// Sets the state of the reply.
            /// </summary>
            /// <param name="args">The args.</param>
            /// <returns></returns>
            public static Dictionary<string, object> SetReplyState(Dictionary<string, object> args) {
                return SetReplyState(args);
            }
            /// <summary>
            /// Gets the gallery.
            /// </summary>
            /// <param name="galleryId">The gallery id.</param>
            /// <returns></returns>
            public static Dictionary<string,object> GetGallery(string galleryId) {
            	return Galleries.GetGallery(galleryId);
            }
        }
    }
}
