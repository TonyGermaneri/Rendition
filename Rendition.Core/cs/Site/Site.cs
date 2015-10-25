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
/* -------------------------------------------------------------------------
* site.cs
* object class for the site.
* site contains most methods for caching and refreshing of site data,
* creating sessions and authentication methods wrapped by merchant or Admin.
* read class site description for more information.
* ------------------------------------------------------------------------- */
using System;
using System.Data;
using System.Text.RegularExpressions;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Collections.Generic;
using System.Web;
using System.Reflection;
using System.Threading;
namespace Rendition {
	/// <summary>
	/// Base site cache and the basis for interaction with the SQL connection and database.
	/// Authentication and cryptography methods
	/// Database driven event handling
	/// Methods for rasing events for the ISiteInterface
	/// </summary>
	public partial class Site {
        #region Constants
        /// <summary>
		/// The default log verbosity.
		/// </summary>
		public const int DEFAULT_LOG_VERBOSITY = 10;
		/// <summary>
		/// The default telnet server port.
		/// </summary>
		public const int DEFAULT_TELNET_SERVER_PORT = 4000;
        #endregion
        #region Instance Properties
        /// <summary>
        /// A list of timers.
        /// </summary>
        public List<Admin.Timer> Timers { get; internal set; }
        /// <summary>
        /// The user that gets used in place of a null.  User id 0 in the database.
        /// </summary>
        public Commerce.User NullUser { get; internal set; }
        /// <summary>
        /// The email of the application operator.
        /// </summary>
        public string site_operator_email { get; internal set; }
        /// <summary>
        /// The email of the application log.
        /// </summary>
        public string site_log_email { get; internal set; }
        /// <summary>
        /// Threshold to hide comments automatically.
        /// </summary>
        public int inappropriateHideThreshold { get; internal set; }
        #endregion
        #region Static Properties
        /// <summary>
        /// Gets the Rendition site in the current HttpContext.
        /// </summary>
        public static Site CurrentSite {
            get { //isn't everything a matter of semantics?
                return Main.Site;
            }
        }
        /// <summary>
        /// The main connection to the SQL server.
        /// </summary>
        public static SqlConnection SqlConnection { get; internal set; }
        /// <summary>
        /// The unique site id.
        /// </summary>
        public static string Id { get; internal set; }
        /// <summary>
        /// A list of events comipled from the database.
        /// </summary>
        internal static Dictionary<string, object> CompiledEvents { get; set; }
        /// <summary>
        /// Gets or sets the state of the site.
        /// </summary>
        /// <value>
        /// The state of the site.
        /// </value>
        public static SiteState SiteState {
            get {
                return Main.State;
            }
            set {
                Main.State = value;
            }
        }
        #endregion
        #region Internal Fields
        /// <summary>
		/// The configuration for the site.  Enough to get started
		/// and connect to a database, create base directories ect.
		/// The rest of the configuration is loaded on a per site Id
		/// basis from SQL site_configuration.  Site confuration Id is
		/// defined in this variable and passed to the site during
		/// instantiation.  For a web site (an IHttpModule) the
		/// site configuration is set in the web.config file.  See
		/// the reference site for more info on setting up a web.config
		/// file for Rendition.
		/// </summary>
        internal static SiteConfiguration baseConfig;
        /// <summary>
        /// A place to put your things.  This object will stay in memory between page refreshes.
        /// </summary>
        internal Dictionary<string, object> Cache = new Dictionary<string, object>();
        /// <summary>
		/// List of installed rewrite directives.
		/// </summary>
        internal List<string[]> RewriteDirectives = new List<string[]>();
		/// <summary>
		/// Rendered site sections
		/// </summary>
        internal Commerce.SiteSections SiteSections;
		/// <summary>
		/// Site terms of purchase.
		/// </summary>
        internal Commerce.Terms Terms;
		/// <summary>
		/// Site redirectors.
		/// </summary>
        internal Commerce.Redirectors Redirectors;
		/// <summary>
		/// Site item images.
		/// </summary>
        internal Commerce.ItemImages ItemImages;
		/// <summary>
		/// Rendered site images.
		/// </summary>
        internal Commerce.RenderedImages RenderedImages;
		/// <summary>
		/// Site Properties.
		/// </summary>
        internal Commerce.Properties Properties;
		/// <summary>
		/// Site items.
		/// </summary>
        internal Commerce.Items Items;
		/// <summary>
		/// Site item swatches.
		/// </summary>
		internal Commerce.Swatches Swatches;
		/// <summary>
		/// Site item sizes.
		/// </summary>
        internal Commerce.Sizes Sizes;
		/// <summary>
		/// Site Menus.
		/// </summary>
        internal Commerce.Menus Menus;
		/// <summary>
		/// Site Categories.
		/// </summary>
        internal Commerce.Categories Categories;
		/// <summary>
		/// Site Reviews.
		/// </summary>
        internal Commerce.Reviews Reviews;
		/// <summary>
		/// Site Users.
		/// </summary>
        internal Commerce.Users Users;
		/// <summary>
		/// Site Carriers.
		/// </summary>
        internal Commerce.Carriers Carriers;
		/// <summary>
		/// Site Shipping Rates.
		/// </summary>
        internal Commerce.Rates Rates;
		/// <summary>
		/// Site Shipping Zones.
		/// </summary>
        internal Commerce.Zones Zones;
		/// <summary>
		/// Site Zip To Zone tables.
		/// </summary>
        internal Commerce.ZipToZones ZipToZones;
		/// <summary>
		/// Site country list.
		/// </summary>
        internal Commerce.Countries Countries;
		/// <summary>
		/// Site database discount codes.
		/// </summary>
        internal Commerce.Discounts Discounts;
		/// <summary>
		/// Site default settings.
		/// </summary>
        public Site.SiteDefaults Defaults;
		/// <summary>
		/// Site image placeholders.
		/// </summary>
        internal SiteImagePlaceholders SiteImagePlaceholders;
		/// <summary>
		/// Site bill of materials.
		/// </summary>
        internal Commerce.BillOfMaterials BillOfMaterials;
		/// <summary>
		/// Replies to Blogs and replies on the site.
		/// </summary>
        internal Commerce.Replies Replies;
		/// <summary>
		/// Search Engine Optimization utitlites.
		/// </summary>
        internal Commerce.SeoListMetaUtilities SeoListMetaUtilities;
		/// <summary>
		/// Flag Types.
		/// </summary>
        internal Commerce.FlagTypes FlagTypes;
        internal SqlDataReader vars;
		internal string expires;
		internal string siteAddress;
		internal string friendlySiteName;
		internal int days_until_session_expires;
		internal int days_meta_expires;
		internal string default_meta_keywords;
		internal string default_meta_description;
		internal string default_page_title;
		internal string default_search_text;
		internal string local_country;
		internal decimal per_retail_shipment_handling;
		internal decimal free_ship_threshold;
		internal string default_access_denied_page;
		internal string elevated_security_userId;
		internal string elevated_security_password;
		internal string elevated_security_domain;
		internal bool enable_file_version_tracking;
		internal string default_empty_cart_page;
		internal int default_records_per_page;
		internal int default_rateId;
		internal string default_zip;
		internal string default_intresting_page;
		internal int default_listmode;
		internal int default_orderby;
		internal string cookie_name;
		internal string default_style_path;
		internal string default_form_detail_directory;
		internal string default_form_invoice_directory;
		internal string add_to_cart_redirect;
		internal int serializationbase;
		internal string validation_fails_querystring;
		internal string empty_cart_redirect;
		internal string update_cart_redirect;
		internal int max_retail_cart_quantity;
		internal string default_ship_country;
		internal bool use_ssl;
		internal string checkout_page_redirect;
		internal string default_form_misc_directory;
		internal string place_order_redirect;
		internal string checkout_remember_credit_card;
		internal string checkout_card_billtoaddressid;
		internal string merchant_auth_type;
		internal string merchant_auth_name;
		internal string merchant_auth_password;
		internal string smtp_server;
		internal string smtp_username;
		internal string smtp_password;
		internal string smtp_port;
		internal bool smtp_authenticate;
		internal bool site_send_order_email;
		internal bool site_send_shipment_update_email;
		internal bool site_send_import_export_log_email;
		internal string site_order_email_from;
		internal string site_order_email_bcc;
		internal string logon_redirect;
		internal Guid m_imagingTemplate;
		internal Guid c_imagingTemplate;
		internal Guid f_imagingTemplate;
		internal Guid t_imagingTemplate;
		internal Guid a_imagingTemplate;
		internal Guid x_imagingTemplate;
		internal Guid y_imagingTemplate;
		internal Guid z_imagingTemplate;
		internal Guid b_imagingTemplate;
		internal Guid d_imagingTemplate;
		internal int administrator_user_level;
		internal int new_user_level;
		internal int disabled_user_level;
		internal int banned_user_level;
		internal bool test_mode;
		internal int orders_export_on_flagId;
		internal int orders_closed_on_flagId;
		internal bool site_specific_item_images;
		internal string defaultPackingSlip;
		internal string defaultQuote;
		internal string defaultInvoice;
		internal int admin_site_user_level;
		internal int item_admin_user_level;
		internal int user_admin_user_level;
		internal bool default_new_user_allow_preorder;
		internal bool site_allow_preorder;
		internal string company_name;
		internal string company_co;
		internal string company_address1;
		internal string company_address2;
		internal string company_city;
		internal string company_state;
		internal string company_zip;
		internal string company_country;
		internal string company_phone;
		internal string company_fax;
		internal string company_email;
		internal string site_order_email_url;
		internal string site_order_email_subject;
		internal bool never_keep_creditcard_info;
		internal string scanned_image_path;
		internal string export_to_account_catch_all;
		internal string shipment_email_url;
		internal string shipment_email_subject;
		internal string shipment_email_bcc;
		internal string shipment_email_from;
		internal bool main_site;
		internal int timezone;
		internal string company_HTML_subHeader;
		internal string site_server_500_page;
		internal string site_server_404_page;
		internal string merchant_auth_url;
		internal string merchant_sucsess_match;
		internal string merchant_message_match;
		internal string merchant_message_match_index;
		internal int default_inventoryDepletesOnFlagId;
		internal int default_inventoryRestockOnFlagId;
		internal int default_itemIsConsumedOnFlagId;
		internal int default_revenueAccount;
		internal int default_inventoryOperator;
		internal bool new_item_allowPreorders;
		internal string lost_password_email_URL;
		internal int shippingGLAccount;
		internal int taxGLAccount;
		internal int discountGLAccount;
		internal int accountsReceivableGLAccount;
		internal int checkingGLAccount;
		internal int accountsPayableGLAccount;
		internal int default_expenseAccount;
		internal int default_inventoryAccount;
		internal int default_inventoryCOGSAccount;
		internal int emailQueueRefreshInterval;
        #endregion
        #region Internal Instance Methods
        internal void cn_StateChange(object sender, System.Data.StateChangeEventArgs e) {
            if((e.CurrentState == System.Data.ConnectionState.Broken ||
            e.CurrentState == System.Data.ConnectionState.Closed)) {
                Thread.Sleep(5000);
                /* quit using the previous connection */
                Site.SqlConnection.Dispose();
                /* try and connect again */
                Site.SqlConnection = Site.CreateConnection(true, true);
                Site.SqlConnection.Open();
            }
        }
        #endregion
        #region Instance Methods
        void updateMetaTags() {
            DateTime m_expires = DateTime.Today;
            m_expires.AddDays(days_meta_expires);
            m_expires.AddHours(timezone);
            m_expires = DateTime.Today;
            m_expires.AddDays(days_meta_expires);
            m_expires.AddHours(timezone);
            this.expires = m_expires.ToString("r");
        }
        /// <summary>
        /// Gets the specified column value.
        /// </summary>
        /// <param name="column_name">The column_name.</param>
        /// <param name="r">The SqlDataReader.</param>
        /// <returns>
        /// Returns an empty string rather than a null from the Request[] object.
        /// </returns>
        internal object GetSqlDataReaderColumn(string column_name, SqlDataReader r) {
            return r.GetValue(r.GetOrdinal(column_name));
        }
        /// <summary>
        /// Gets the specified column_name.
        /// </summary>
        /// <param name="column_name">The column_name.</param>
        /// <param name="r">The SqlDataReader.</param>
        /// <returns>column value</returns>
        internal string GetSqlDataReaderColumnName(string column_name, SqlDataReader r) {
            return r.GetString(r.GetOrdinal(column_name));
        }
        /// <summary>
        /// Shows the selected site variable.
        /// </summary>
        /// <param name="site_var_name">The site_var_name.</param>
        /// <returns></returns>
        public object Variable(string site_var_name) {
            return GetSqlDataReaderColumn(site_var_name, vars);
        }
        /// <summary>
        /// Checks if the query has rows.
        /// </summary>
        /// <param name="sql_query">The sql_query.</param>
        /// <returns></returns>
        internal bool Exists(string sql_query) {
            SqlCommand cmd = new SqlCommand(sql_query, SqlConnection);
            SqlDataReader r = cmd.ExecuteReader();
            bool t = r.HasRows;
            r.Close();
            if(t) {
                return true;
            } else {
                return false;
            }
        }
        /// <summary>
        /// Returns a Request[x] object even if the pramater is null
        /// </summary>
        /// <param name="varaible_Request">String of the request name</param>
        /// <param name="context">HttpContext of the current Application</param>
        /// <returns>Returns an empty string rather than a null from the Request[] object.</returns>
        private string cr(string varaible_Request, HttpContext context) {
            string s = context.Request[varaible_Request];
            if(s == null) {
                s = "";
            }
            return s;
        }
        /// <summary>
        /// Disposes this instance.
        /// </summary>
        public void Dispose() {
            DisposeEventArgs e = new DisposeEventArgs(this, HttpContext.Current);
            if(this.Disposing != null) { this.Disposing(this, e); };
        }
        /// <summary>
        /// Gets an item by item_number.
        /// </summary>
        /// <param name="item_number">The item_number.</param>
        /// <returns></returns>
        public Commerce.Item Item(string item_number) {
            for(int x = 0; Items.List.Count > x; x++) {
                Commerce.Item i = (Commerce.Item)Items.List[x];
                if(i.Number == item_number) {
                    return i;
                }
            }
            return null;
        }
        #endregion
        #region Constructors
        /// <summary>
		/// Initializes a new instance of the <see cref="Site"/> class.
		/// </summary>
		public Site( SiteConfiguration _baseConfig ) {
            /* allow for lookup of assemblies */
            AppDomain.CurrentDomain.AssemblyResolve += Main.resolveEmbeddedAssembiles;
			baseConfig = _baseConfig;
			if( baseConfig == null) {
				NullReferenceException ex = new NullReferenceException( "Error reading siteConfiguration." );
				throw ex;
			}
            Site.Id = baseConfig.UniqueSiteId.ToString();
            if(Site.SqlConnection == null) {
                Site.SqlConnection = Site.CreateConnection(true, true);
            }
			Assembly asm = System.Reflection.Assembly.GetExecutingAssembly();
			Version version=asm.GetName().Version;
			object[] c = asm.GetCustomAttributes(typeof(AssemblyCopyrightAttribute),false);
			string copyright = ((AssemblyCopyrightAttribute)c[0]).Copyright;
			Main.Version = version.Major.ToString()+"."+version.Minor.ToString()+" Build "+version.Build.ToString();
			Main.Site = this;
            Main.loadLocalization();
			("Rendition v."+version+" "+copyright+" Log verbosity: "+Main.LogVerbosity+".").Debug(8,true);
			("Starting up...").Debug(8);
			SqlConnection=CreateConnection(true,true);
			try{
				SqlConnection.Open();
                Main.HasDatabaseConnection = true;
			}catch(Exception e){
                Main.HasDatabaseConnection = false;
                e.Message.Debug(0);
				string exMessage = string.Format("Rendition cannot logon to SQL. {0}",e.Message);
				( exMessage ).Debug( 8 );
			}
            if (Main.HasDatabaseConnection) {
                RefreshSiteData(this);
			    ("Compiling and binding event handlers from database sources...").Debug(8);
			    BindEventHandlers();
			    ("Starting internal timers...").Debug(8);
			    StartTaskScheduler();
			    ( "Starting meta tag date update Timer..." ).Debug( 8 );
			    /* every day, update the meta expires date */
            }
			Admin.Timer metaUpdate = new Admin.Timer();
			metaUpdate.Name = "Meta tag update";
			metaUpdate.elapsed += new EventHandler(delegate(object sender, EventArgs e){
				try{
					updateMetaTags();
				}finally{
					metaUpdate.Start();
				}
			});
			/* run it once now */
			updateMetaTags();
			/* and again and again later */
			metaUpdate.AutoReset = false;
			metaUpdate.Interval = 30000;/* 30,000 units of time! */
			metaUpdate.Start();
            /*allow plugins to attach to events before init event */
            Main.getPlugins();
            if (Main.HasDatabaseConnection) {
                /* make sure the site doesn't lose its connection */
                Site.SqlConnection.StateChange += new System.Data.StateChangeEventHandler(cn_StateChange);
                /* start built in timed events */
                /* empty the email queue every 30 seconds */
                Main.startEmailQueue();
                /* send shipment email every 30 seconds */
                Main.startShipmentUpdateQueue();
                /* check the connection every so often */
                Main.startConnectionChecking();
            }
            /* init event */
            InitEventArgs args = new InitEventArgs(this, HttpContext.Current);
            this.raiseOnInit(args);
		}
        #endregion
	}
}