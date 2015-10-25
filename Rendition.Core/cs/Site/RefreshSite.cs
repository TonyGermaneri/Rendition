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
using System.Data.SqlClient;
using System.Data.SqlTypes;
namespace Rendition {
	public partial class Site {
        /// <summary>
        /// Reads the site config from SQL.
        /// </summary>
		internal bool readSiteConfigFromSQL() {
			( "Loading site configuration for siteId:" + Id + "..." ).Debug( 8 );
            SqlCommand cmd = new SqlCommand(@"if exists(select 0 from sysobjects where name = 'getSiteconfiguration' and type = 'P') begin 
    exec getSiteconfiguration @unique_siteID
end", SqlConnection);
			cmd.Parameters.Add( "@unique_siteID", System.Data.SqlDbType.UniqueIdentifier ).Value = new Guid( Id );
			using( vars = cmd.ExecuteReader() ) {
				if( !vars.HasRows ) {
                    // if there is no getSiteconfiguration SP then abort this process
                    return false;
				}
				vars.Read();
				/* begin site_configuration 
				 * The order these variables occur in matters becuase the
				 * counter is dynamic.  The results of dbo.getSiteconfiguration
				 * match the order of the results below
				 */
				int ord = 0;
				siteAddress = vars.GetString( ord++ );
				friendlySiteName = vars.GetString( ord++ );
				days_until_session_expires = vars.GetInt32( ord++ );
				days_meta_expires = vars.GetInt32( ord++ );
				default_meta_keywords = vars.GetString( ord++ );
				default_meta_description = vars.GetString( ord++ );
				default_page_title = vars.GetString( ord++ );
				default_search_text = vars.GetString( ord++ );
				local_country = vars.GetString( ord++ );
				per_retail_shipment_handling = vars.GetDecimal( ord++ );
				free_ship_threshold = vars.GetDecimal( ord++ );
				default_access_denied_page = vars.GetString( ord++ );
				elevated_security_userId = vars.GetString( ord++ );
				elevated_security_password = vars.GetString( ord++ );
				elevated_security_domain = vars.GetString( ord++ );
				enable_file_version_tracking = vars.GetBoolean( ord++ );
				default_empty_cart_page = vars.GetString( ord++ );
				default_records_per_page = vars.GetInt32( ord++ );
				default_rateId = vars.GetInt32( ord++ );
				default_zip = vars.GetString( ord++ );
				default_intresting_page = vars.GetString( ord++ );
				default_listmode = vars.GetInt32( ord++ );
				default_orderby = vars.GetInt32( ord++ );
				cookie_name = vars.GetString( ord++ );
				default_style_path = vars.GetString( ord++ );
				default_form_detail_directory = vars.GetString( ord++ );
				default_form_invoice_directory = vars.GetString( ord++ );
				add_to_cart_redirect = vars.GetString( ord++ );
				serializationbase = vars.GetInt32( ord++ );
				validation_fails_querystring = vars.GetString( ord++ );
				empty_cart_redirect = vars.GetString( ord++ );
				update_cart_redirect = vars.GetString( ord++ );
				max_retail_cart_quantity = vars.GetInt32( ord++ );
				default_ship_country = vars.GetString( ord++ );
				use_ssl = vars.GetBoolean( ord++ );
				checkout_page_redirect = vars.GetString( ord++ );
				default_form_misc_directory = vars.GetString( ord++ );
				place_order_redirect = vars.GetString( ord++ );
				checkout_remember_credit_card = vars.GetString( ord++ );
				checkout_card_billtoaddressid = vars.GetString( ord++ );
				merchant_auth_type = vars.GetString( ord++ );
				merchant_auth_name = vars.GetString( ord++ );
				merchant_auth_password = vars.GetString( ord++ );
				smtp_server = vars.GetString( ord++ );
				smtp_username = vars.GetString( ord++ );
				smtp_password = vars.GetString( ord++ );
				smtp_port = vars.GetString( ord++ );
				smtp_authenticate = vars.GetBoolean( ord++ );
				site_operator_email = vars.GetString( ord++ );
				site_send_order_email = vars.GetBoolean( ord++ );
				site_send_shipment_update_email = vars.GetBoolean( ord++ );
				site_send_import_export_log_email = vars.GetBoolean( ord++ );
				site_log_email = vars.GetString( ord++ );
				site_order_email_from = vars.GetString( ord++ );
				site_order_email_bcc = vars.GetString( ord++ );
				logon_redirect = vars.GetString( ord++ );
				m_imagingTemplate = vars.GetGuid( ord++ );
				c_imagingTemplate = vars.GetGuid( ord++ );
				f_imagingTemplate = vars.GetGuid( ord++ );
				t_imagingTemplate = vars.GetGuid( ord++ );
				a_imagingTemplate = vars.GetGuid( ord++ );
				x_imagingTemplate = vars.GetGuid( ord++ );
				y_imagingTemplate = vars.GetGuid( ord++ );
				z_imagingTemplate = vars.GetGuid( ord++ );
				b_imagingTemplate = vars.GetGuid( ord++ );
				d_imagingTemplate = vars.GetGuid( ord++ );
				administrator_user_level = vars.GetInt32( ord++ );
				new_user_level = vars.GetInt32( ord++ );
				disabled_user_level = vars.GetInt32( ord++ );
				banned_user_level = vars.GetInt32( ord++ );
				test_mode = vars.GetBoolean( ord++ );
				orders_export_on_flagId = vars.GetInt32( ord++ );
				orders_closed_on_flagId = vars.GetInt32( ord++ );
				site_specific_item_images = vars.GetBoolean( ord++ );
				defaultPackingSlip = vars.GetString( ord++ );
				defaultQuote = vars.GetString( ord++ );
				defaultInvoice = vars.GetString( ord++ );
				admin_site_user_level = vars.GetInt32( ord++ );
				item_admin_user_level = vars.GetInt32( ord++ );
				user_admin_user_level = vars.GetInt32( ord++ );
				default_new_user_allow_preorder = vars.GetBoolean( ord++ );
				site_allow_preorder = vars.GetBoolean( ord++ );
				company_name = vars.GetString( ord++ );
				company_co = vars.GetString( ord++ );
				company_address1 = vars.GetString( ord++ );
				company_address2 = vars.GetString( ord++ );
				company_city = vars.GetString( ord++ );
				company_state = vars.GetString( ord++ );
				company_zip = vars.GetString( ord++ );
				company_country = vars.GetString( ord++ );
				company_phone = vars.GetString( ord++ );
				company_fax = vars.GetString( ord++ );
				company_email = vars.GetString( ord++ );
				site_order_email_url = vars.GetString( ord++ );
				site_order_email_subject = vars.GetString( ord++ );
				never_keep_creditcard_info = vars.GetBoolean( ord++ );
				scanned_image_path = vars.GetString( ord++ );
				export_to_account_catch_all = vars.GetString( ord++ );
				shipment_email_url = vars.GetString( ord++ );
				shipment_email_subject = vars.GetString( ord++ );
				shipment_email_bcc = vars.GetString( ord++ );
				shipment_email_from = vars.GetString( ord++ );
				main_site = vars.GetBoolean( ord++ );
				timezone = vars.GetInt32( ord++ );
				company_HTML_subHeader = vars.GetString( ord++ );
				site_server_500_page = vars.GetString( ord++ );
				site_server_404_page = vars.GetString( ord++ );
				merchant_auth_url = vars.GetString( ord++ );
				merchant_sucsess_match = vars.GetString( ord++ );
				merchant_message_match = vars.GetString( ord++ );
				merchant_message_match_index = vars.GetString( ord++ );
				default_inventoryDepletesOnFlagId = vars.GetInt32( ord++ );
				default_inventoryRestockOnFlagId = vars.GetInt32( ord++ );
				default_itemIsConsumedOnFlagId = vars.GetInt32( ord++ );
				default_revenueAccount = vars.GetInt32( ord++ );
				default_inventoryOperator = vars.GetInt32( ord++ );
				new_item_allowPreorders = vars.GetBoolean( ord++ );
				Id = vars.GetGuid( ord++ ).ToString();
				lost_password_email_URL = vars.GetString( ord++ );
				inappropriateHideThreshold = vars.GetInt32( ord++ );
				shippingGLAccount = vars.GetInt32( ord++ );
				taxGLAccount = vars.GetInt32( ord++ );
				discountGLAccount = vars.GetInt32( ord++ );
				accountsReceivableGLAccount = vars.GetInt32( ord++ );
				checkingGLAccount = vars.GetInt32( ord++ );
				accountsPayableGLAccount = vars.GetInt32( ord++ );
				default_expenseAccount = vars.GetInt32( ord++ );
				default_inventoryAccount = vars.GetInt32( ord++ );
				default_inventoryCOGSAccount = vars.GetInt32( ord++ );
				emailQueueRefreshInterval = vars.GetInt32( ord++ );
				vars.Close();
			}
            return true;
		}
		/// <summary>
		/// Refreshes the site cache.
		/// </summary>
		/// <param name="site">The site.</param>
		public static void RefreshSiteData( Site site ) {
			( "Read site_configuration table." ).Debug( 9 );
            // if this instance lacks a database connection to a
            // rendition database, well, that's ok
            if (site.readSiteConfigFromSQL()) {
                ("Loading site Cache.").Debug(9);
                site.Defaults = new Site.SiteDefaults(site);
                ("Loading site image placeholders...").Debug(9, true);
                site.SiteImagePlaceholders = new SiteImagePlaceholders(site);
                ("Loading users...").Debug(9, true);
                site.Users = new Commerce.Users(site);
                site.NullUser = site.Users.List.Find(delegate(Commerce.User u) {
                    return u.UserId == 0;
                });
                //( "Loading galleries..." ).Debug( 9, true );
                //site.Galleries = new Commerce.Galleries( site );
                ("Loading redirectors...").Debug(9, true);
                site.Redirectors = new Commerce.Redirectors(site);
                ("Loading reviews...").Debug(9, true);
                site.Reviews = new Commerce.Reviews(site);
                ("Loading replies...").Debug(9, true);
                site.Replies = new Commerce.Replies(site);
                //( "Loading Blog categories..." ).Debug( 9, true );
                //site.Blogs = new Commerce.Blogs( site );
                ("Loading item properties...").Debug(9, true);
                site.Properties = new Commerce.Properties(site);
                ("Loading menus...").Debug(9, true);
                site.Menus = new Commerce.Menus(site);
                ("Loading Carriers...").Debug(9, true);
                site.Carriers = new Commerce.Carriers(site);
                ("Loading shipping rates...").Debug(9, true);
                site.Rates = new Commerce.Rates(site);
                ("Loading zones...").Debug(9, true);
                site.Zones = new Commerce.Zones(site);
                ("Loading zip to zone...").Debug(9, true);
                site.ZipToZones = new Commerce.ZipToZones(site);
                ("Loading countries...").Debug(9, true);
                site.Countries = new Commerce.Countries(site);
                ("Loading discounts...").Debug(9, true);
                site.Discounts = new Commerce.Discounts(site);
                ("Loading site specific item images...").Debug(9, true);
                site.ItemImages = new Commerce.ItemImages(site);
                ("Loading original item images...").Debug(9, true);
                site.RenderedImages = new Commerce.RenderedImages(site);
                ("Loading bill of materials...").Debug(9, true);
                site.BillOfMaterials = new Commerce.BillOfMaterials(site);
                ("Loading item swatches...").Debug(9, true);
                site.Swatches = new Commerce.Swatches(site);
                ("Loading item sizes...").Debug(9, true);
                site.Sizes = new Commerce.Sizes(site);
                ("Building items...").Debug(9, true);
                site.Items = new Commerce.Items(site);
                ("Building category hierarchies...").Debug(9, true);
                site.Categories = new Commerce.Categories(site);
                ("Loading SEO List Meta Utilities...").Debug(9, true);
                site.SeoListMetaUtilities = new Commerce.SeoListMetaUtilities(site);
                ("Loading Flag Types...").Debug(9, true);
                site.FlagTypes = new Commerce.FlagTypes(site);
                ("Loading Term Types...").Debug(9, true);
                site.Terms = new Commerce.Terms(site);
                ("Loading Site Sections...").Debug(9, true);
                site.SiteSections = new Commerce.SiteSections(site);
            }
            RefreshEventArgs args = new RefreshEventArgs(site , System.Web.HttpContext.Current);
            site.raiseOnAfterRefresh(args);
			( "Cache refresh complete." ).Debug( 8 );
		}
	}
}
