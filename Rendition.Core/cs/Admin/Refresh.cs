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
namespace Rendition {
	public partial class Admin {
		/// <summary>
		/// Refreshes the cache for a single user.
		/// </summary>
		/// <param name="userId">The user id.</param>
		public static void RefreshUserById( string userId ) {
            Main.State = SiteState.Refreshing;
            try {
                Commerce.RefreshUserById(Convert.ToInt32(userId));
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the site data.
		/// </summary>
		public static void RefreshSiteData() {
            Main.State = SiteState.Refreshing;
            try {
			    Site.RefreshSiteData( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the rewrite cache.
		/// </summary>
		public static void RefreshRewriteCache() {
            Main.State = SiteState.Refreshing;
			try {
                Main.Site.Redirectors = new Commerce.Redirectors( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the users cache.
		/// </summary>
		public static void RefreshUsersCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.Users = new Commerce.Users( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the reviews cache.
		/// </summary>
		public static void RefreshReviewsCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.Reviews = new Commerce.Reviews( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the site image placeholders cache.
		/// </summary>
		public static void RefreshSiteImagePlaceholdersCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.SiteImagePlaceholders = new SiteImagePlaceholders( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the replies cache.
		/// </summary>
		public static void RefreshRepliesCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.Replies = new Commerce.Replies( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the redirectors.
		/// </summary>
		public static void RefreshRedirectors() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.Redirectors = new Commerce.Redirectors( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the Properties cache.
		/// </summary>
		public static void RefreshPropertiesCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.Properties = new Commerce.Properties( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the menus cache.
		/// </summary>
        public static void RefreshMenusCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.Menus = new Commerce.Menus( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the Carriers cache.
		/// </summary>
        public static void RefreshCarriersCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.Carriers = new Commerce.Carriers( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the rates cache.
		/// </summary>
        public static void RefreshRatesCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.Rates = new Commerce.Rates( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the zones cache.
		/// </summary>
        public static void RefreshZonesCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.Zones = new Commerce.Zones( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the zip to zones cache.
		/// </summary>
        public static void RefreshZipToZonesCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.ZipToZones = new Commerce.ZipToZones( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the countries cache.
		/// </summary>
        public static void RefreshCountriesCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.Countries = new Commerce.Countries( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the discounts cache.
		/// </summary>
        public static void RefreshDiscountsCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.Discounts = new Commerce.Discounts( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the item images cache.
		/// </summary>
        public static void RefreshItemImagesCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.ItemImages = new Commerce.ItemImages( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the rendered images cache.
		/// </summary>
        public static void RefreshRenderedImagesCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.RenderedImages = new Commerce.RenderedImages( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the bill of materials cache.
		/// </summary>
        public static void RefreshBillOfMaterialsCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.BillOfMaterials = new Commerce.BillOfMaterials( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the items cache.
		/// </summary>
        public static void RefreshItemsCache() {
            Main.State = SiteState.Refreshing;
            try {
                Main.Site.Items = new Commerce.Items(Main.Site);
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the categories cache.
		/// </summary>
        public static void RefreshCategoriesCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.Categories = new Commerce.Categories( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the site sections cache.
		/// </summary>
        public static void RefreshSiteSectionsCache() {
            Main.State = SiteState.Refreshing;
            try {
			    Main.Site.SiteSections = new Commerce.SiteSections( Main.Site );
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the item cache for a single item number.  
        /// This is not for adding new item, only refreshing exsiting items.
        /// Use RefreshItemsCache to refresh the site cache after adding a new item to the database.
		/// </summary>
		/// <param name="itemNumber">The item number.</param>
        public static void RefreshItemCache(string itemNumber) {
            Main.State = SiteState.Refreshing;
            try {
			    if( Main.Site.Items.GetItemByItemNumber( itemNumber ) != null ) {
				    RefreshItemImagesCache();
				    Main.Site.Items = new Commerce.Items( Main.Site );
			    }
            } finally {
                Main.State = SiteState.Started;
            }
		}
		/// <summary>
		/// Refreshes the menus.
		/// </summary>
        public static void RefreshMenus() {
            Main.State = SiteState.Refreshing;
            try {
                Main.Site.Menus = new Commerce.Menus(Main.Site);
            } finally {
                Main.State = SiteState.Started;
            }
		}
	}
}
