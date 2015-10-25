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
	public partial class Site {
		/// <summary>
		/// The defaults for the site as defined in dbo.siteConfiguration.
		/// </summary>
		public class SiteDefaults {
			/// <summary>
			/// Meta keywords for the site.
			/// </summary>
			public string MetaKeywords;
			/// <summary>
			/// Meta description of the site.
			/// </summary>
			public string MetaDescription;
			/// <summary>
			/// Page title of the site.
			/// </summary>
			public string PageTitle;
			/// <summary>
			/// Default access denied page.
			/// </summary>
			public string AccessDeniedPage;
			/// <summary>
			/// Default empty cart page.
			/// </summary>
			public string EmptyCartPage;
			/// <summary>
			/// Default form directory.
			/// </summary>
			public string FormDirectory;
			/// <summary>
			/// Default page of intrest.
			/// </summary>
			public string IntrestPage;
			/// <summary>
			/// Default list mode.
			/// </summary>
			public int ListMode;
			/// <summary>
			/// Default for new accounts to allow preorders.
			/// </summary>
			public bool AllowPreorders;
			/// <summary>
			/// Default list order by mode.
			/// </summary>
			public int OrderBy;
			/// <summary>
			/// Default shipping rate id.
			/// </summary>
			public int RateId;
			/// <summary>
			/// Default records per page.
			/// </summary>
			public int RecordsPerPage;
			/// <summary>
			/// Default search text in the search field.
			/// </summary>
			public string SearchText;
			/// <summary>
			/// The site URL.
			/// </summary>
			public string SiteUrl;
			/// <summary>
			/// Address line 1.
			/// </summary>
			public string Address1;
			/// <summary>
			/// Address line 2.
			/// </summary>
			public string Address2;
			/// <summary>
			/// City.
			/// </summary>
			public string City;
			/// <summary>
			/// State.
			/// </summary>
			public string State;
			/// <summary>
			/// Zip.
			/// </summary>
			public string Zip;
			/// <summary>
			/// Country.
			/// </summary>
			public string Country;
			/// <summary>
			/// Email.
			/// </summary>
			public string Email;
			/// <summary>
			/// Fax.
			/// </summary>
			public string Fax;
			/// <summary>
			/// Name.
			/// </summary>
			public string Name;
			/// <summary>
			/// Phone.
			/// </summary>
			public string Phone;
			/// <summary>
			/// Days until the page expires in the meta tag.
			/// </summary>
			public int MetaExpires;
			/// <summary>
			/// Friendly site name.
			/// </summary>
			public string SiteName;
			/// <summary>
			/// Local Country.
			/// </summary>
			public string LocalCountry;
			/// <summary>
			/// Path to the scanned image folder.
			/// </summary>
			public string ScannedImagePath;
			/// <summary>
			/// Default error 500 page.
			/// </summary>
			public string Error500page;
			/// <summary>
			/// Default error 404 page.
			/// </summary>
			public string Error404page;
			/// <summary>
			/// Unique Site Id.
			/// </summary>
			public string SiteId;
			/// <summary>
			/// Use SSL.
			/// </summary>
			public bool UseSsl;
			/// <summary>
			/// Care of.
			/// </summary>
			public string CareOf;
			/// <summary>
			/// Test mode.
			/// </summary>
			public bool TestMode;
			/// <summary>
			/// Place order redirect.
			/// </summary>
			public string PlaceOrderRedirect;
			/// <summary>
			/// Initializes a new instance of the <see cref="SiteDefaults"/> class.
			/// </summary>
			/// <param name="site">The site.</param>
			public SiteDefaults( Site site ) {
				( "FUNCTION siteDefaults" ).Debug( 10 );
				MetaKeywords = site.default_meta_keywords;
				MetaDescription = site.default_meta_description;
				PageTitle = site.default_page_title;
				AccessDeniedPage = site.default_access_denied_page;
				EmptyCartPage = site.default_empty_cart_page;
				FormDirectory = site.default_form_detail_directory;
				IntrestPage = site.default_intresting_page;
				ListMode = site.default_listmode;
				OrderBy = site.default_orderby;
				RateId = site.default_rateId;
				RecordsPerPage = site.default_records_per_page;
				AllowPreorders = site.default_new_user_allow_preorder;
				SearchText = site.default_search_text;
				SiteUrl = site.siteAddress;
				Address1 = site.company_address1;
				Address2 = site.company_address2;
				City = site.company_city;
				CareOf = site.company_co;
				Country = site.company_country;
				Email = site.company_email;
				Fax = site.company_fax;
				Name = site.company_name;
				Phone = site.company_phone;
				State = site.company_state;
				Zip = site.company_zip;
				MetaExpires = site.days_meta_expires;
				SiteName = site.friendlySiteName;
				LocalCountry = site.local_country;
				ScannedImagePath = site.scanned_image_path;
				Error404page = site.site_server_404_page;
				Error500page = site.site_server_500_page;
				TestMode = site.test_mode;
				SiteId = Site.Id;
				UseSsl = site.use_ssl;
				PlaceOrderRedirect = site.place_order_redirect;
			}
		}
	}
}
