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
using System.Data;
using System.Web;
namespace Rendition {
	/// <summary>
	/// This class represents a session on the site
	/// the sessions cart and if the session logs on the user object.
	/// </summary>
	public partial class Session {
        #region Constants
        private const string shipToAddressesQuery = @"select 
contactId,firstName,lastName,address1,address2,
city,state,zip,country,homePhone,workPhone,email,specialInstructions,
comments,sendshipmentupdates,emailads, rate,dateCreated,company
from contacts with (nolock)	where (sessionId = @sessionId or userId = @userId) and not contactId = sessionId";
        private const string getContactByIdQuery = @"select 
contactId,firstName,lastName,address1,address2,
city,state,zip,country,homePhone,workPhone,email,specialInstructions,
comments,sendshipmentupdates,emailads, rate,dateCreated,company
from contacts with (nolock)	where contactId = @contactId";
        #endregion
        #region Private Instance Fields
        private List<Commerce.Address> _shipToAddresses = null;
        private Commerce.Address _billToAddress = null;
        #endregion
        #region Instance Properties
        /// <summary>
        /// Gets the bill to Address for this session.
        /// The bill to Address is always a contact that matches the sessionId
        /// </summary>
        public Commerce.Address BillToAddress {
            get {
                /* get the contact that matches this sessionId */
                if(_billToAddress != null) {
                    return _billToAddress;
                }
                _billToAddress = GetContactById(this.Id);
                if(_billToAddress == null) {
                    _billToAddress = Commerce.Address.CreateAddress();
                }
                return _billToAddress;
            }
        }
        /// <summary>
		/// Session id.
		/// </summary>
        public Guid Id { get; internal set; }
		/// <summary>
		/// If set true the user should get wholesale pricing.
		/// </summary>
        public int Wholesale { get; internal set; }
		/// <summary>
		/// List view mode for this session.
		/// </summary>
        public int ListView { get; internal set; }
		/// <summary>
		/// List view order for this session.
		/// </summary>
        public int ListOrder { get; internal set; }
		/// <summary>
		/// User level of this session.
		/// </summary>
        public int UserLevel { get; internal set; }
		/// <summary>
		/// List records per page for this session.
		/// </summary>
        public int RecordsPerPage { get; internal set; }
		/// <summary>
		/// Conext page for this session (not implemented).
		/// </summary>
        public string context { get; internal set; }
		/// <summary>
		/// Default shipping rate for this session.
		/// </summary>
        public int ShippingRate { get; internal set; }
		/// <summary>
		/// Zip code for quick shipment calculations.
		/// </summary>
        public string Zip { get; internal set; }
		/// <summary>
		/// Email Address of this session.
		/// </summary>
        public string Email { get; internal set; }
		/// <summary>
		/// Allow this session to place preorders.
		/// </summary>
        public int AllowPreorders { get; internal set; }
		/// <summary>
		/// The Admin script that runs when this session visits the Admin page.
		/// </summary>
        public string AdminScript { get; internal set; }
		/// <summary>
		/// The page to redirect to when this session logs on.
		/// </summary>
        public string LogonRedirect { get; internal set; }
		/// <summary>
		/// The user id of the logged on session (-1 if not logged on).
		/// </summary>
        public int UserId { get; internal set; }
		/// <summary>
		/// Is this session logged on?
		/// </summary>
        public bool LoggedOn { get; internal set; }
		/// <summary>
		/// Is this session an administrator?
		/// </summary>
        public bool Administrator { get; internal set; }
		/// <summary>
		/// This session's URL.
		/// </summary>
        public string Url { get; internal set; }
		/// <summary>
		/// The host name of this session.
		/// </summary>
        public string Host { get; internal set; }
		/// <summary>
		/// The path of this session.
		/// </summary>
        public string Path { get; internal set; }
		/// <summary>
		/// This session's IP Address.
		/// </summary>
        public string Ip { get; internal set; }
		/// <summary>
		/// This session's user agent.
		/// </summary>
        public string UserAgent { get; internal set; }
		/// <summary>
		/// This session's referer.
		/// </summary>
        public string Referer { get; internal set; }
		/// <summary>
		/// UI_JSON to run when this session visits the agmin page.
		/// </summary>
        public string UIJson { get; internal set; }
		/// <summary>
		/// This session's cart.
		/// </summary>
        public Commerce.Cart Cart { get; internal set; }
		/// <summary>
		/// This session's user.
		/// </summary>
        public Commerce.User User { get; internal set; }
		/// <summary>
		/// The defaults for this session's site.
		/// </summary>
        public Site.SiteDefaults SiteDefaults { get; internal set; }
		/// <summary>
		/// This session's site.
		/// </summary>
        public Site Site { get; internal set; }
		/// <summary>
		/// This session's Properties.
		/// </summary>
		public Dictionary<object, object> Properties = new Dictionary<object, object>();
        /// <summary>
        /// Gets the current session.
        /// </summary>
        [Newtonsoft.Json.JsonIgnore]
        public static Session CurrentSession {
            get {
                return Main.GetCurrentSession();
            }
        }
        /// <summary>
		/// Gets the first ship to Address for this session.
		/// </summary>
		/// <value>
		/// The ship to Address.
		/// </value>
		public Commerce.Address ShipToAddress {
			get {
				List<Commerce.Address> _saddresses = ShipToAddresses;
				if( _saddresses.Count == 0 ) {
					return Commerce.Address.CreateAddress();
				}else{
					return _saddresses[ 0 ];
				}
			}
		}
		/// <summary>
		/// Gets the ship to addresses for this session.
		/// </summary>
		public List<Commerce.Address> ShipToAddresses {
			get{
				if(_shipToAddresses!=null){
					return _shipToAddresses;
				}
				_shipToAddresses = new List<Commerce.Address>();
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand(shipToAddressesQuery, cn)) {
                        cmd.Parameters.Add("@sessionId", SqlDbType.UniqueIdentifier).Value = this.Id;
                        cmd.Parameters.Add("@userId", SqlDbType.Int).Value = this.UserId;
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            while(d.Read()) {
                                Commerce.Address addr = new Commerce.Address(
                                d.GetGuid(0),
                                d.GetString(1),
                                d.GetString(2),
                                d.GetString(3),
                                d.GetString(4),
                                d.GetString(5),
                                d.GetString(6),
                                d.GetString(7),
                                d.GetString(8),
                                d.GetString(9),
                                d.GetString(10),
                                d.GetString(11),
                                d.GetString(12),
                                d.GetString(13),
                                d.GetBoolean(14),
                                d.GetBoolean(15),
                                Main.Site.Rates.List.Find(delegate(Commerce.Rate t) {
                                    return t.Id == d.GetInt32(16);
                                }),
                                d.GetDateTime(17),
                                d.GetString(18));
                                _shipToAddresses.Add(addr);
                            }
                        }
                    }
                }
				return _shipToAddresses;
			}
		}
        #endregion
        #region Constructors
        /// <summary>
		/// Initializes a new instance of the <see cref="Session"/> class.
		/// </summary>
		/// <param name="_site">The _site.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trns">The TRNS.</param>
		public Session( Site _site, SqlConnection cn, SqlTransaction trns ) {
			CreateNewSession( false, cn, trns );
		}
		/// <summary>
		/// Initializes a new instance of the <see cref="Session"/> class.
		/// </summary>
		/// <param name="_site">The _site.</param>
		/// <param name="sessionId">The session id.</param>
		public Session( Site _site, Guid sessionId ) {
			getServerStateInfo();
			if( sessionId == Guid.Empty ) {
				/* Ask the DB for a new sessionid*/
				CreateNewSession( false );
			} else {
				Id = sessionId;
				Refresh( false );
				Cart = new Commerce.Cart( this, this.Site );
			}
		}
		/// <summary>
		/// Initializes a new instance of the <see cref="Session"/> class.
		/// </summary>
		/// <param name="_site">The _site.</param>
		/// <param name="sessionId">The session id.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trns">The TRNS.</param>
		public Session( Site _site, Guid sessionId, SqlConnection cn, SqlTransaction trns ) {
			getServerStateInfo();
			if( sessionId == Guid.Empty ) {
				/* Ask the DB for a new sessionid*/
				CreateNewSession( false, cn, trns );
			} else {
				Id = sessionId;
				Refresh( false, cn, trns );
				Cart = new Commerce.Cart( this, Site );
			}
		}
		/// <summary>
		/// Initializes a new instance of the <see cref="Session"/> class.
		/// </summary>
		/// <param name="_site">The _site.</param>
		public Session( Site _site ) {
			getServerStateInfo();
			Site = _site;
			string sessionid = null;
			bool newsession = false;
			string cookieName = "";
			cookieName = Site.cookie_name;
			HttpCookie http_cookie_sessionid = null;
			if(HttpContext.Current!=null){
				try {
					http_cookie_sessionid = HttpContext.Current.Request.Cookies[ cookieName ];
				} catch( Exception e ) {
					Exception ex = new Exception( "Cannot aquire cookie from client:" + e.Message );
					http_cookie_sessionid = null;
					throw ex;
				}
			}
			if( http_cookie_sessionid == null ) {
				newsession = true;
			}
			Dictionary<string, object> j = new Dictionary<string, object>();
			if( newsession ) {
				CreateNewSession( true );
				j.Add( "newSession", true );
			} else {
				if( Utilities.GuidPattern.IsMatch( http_cookie_sessionid.Value.ToString() ) ) {
					sessionid = http_cookie_sessionid.Value.ToString();
					Id = new Guid( http_cookie_sessionid.Value.ToString() );
					j.Add( "newSession", false );
				}
			}
			j.Add( "ip", Ip );
			j.Add( "sessionId", Id.ToString() );
			j.Add( "URL", Url + Path );
			j.Add( "userAgent", UserAgent );
			j.Add( "referer", Referer );
			j.Add( "host", Host );
			( "connection>" + j.ToJson() ).Debug( 10 );
			Refresh();
			return;
		}
        #endregion
        #region Instance Methods
        /// <summary>
        /// Creates the new session.
        /// </summary>
        /// <param name="makeCookie">if set to <c>true</c> [make cookie].</param>
        public void CreateNewSession(bool makeCookie) {
            CreateNewSession(makeCookie, null, null);
            return;
        }
        /// <summary>
        /// Creates the new session.
        /// </summary>
        /// <param name="makeCookie">if set to <c>true</c> [make cookie].</param>
        /// <param name="cn">The cn.</param>
        /// <param name="trns">The TRNS.</param>
        public void CreateNewSession(bool makeCookie, SqlConnection cn, SqlTransaction trns) {
            if(Referer == null) {
                Referer = "";
            } else {
                Referer = Referer.MaxLength(1000, false);
            }
            if(UserAgent == null) {
                UserAgent = "";
            } else {
                UserAgent.MaxLength(1000, false);
            }
            RefreshSessionEventArgs args = new RefreshSessionEventArgs(Main.Site.default_orderby,
                Main.Site.default_listmode, Main.Site.default_records_per_page, Referer, UserAgent, Ip,
                new Guid(Main.Site.Defaults.SiteId.ToString()), cn, trns);
            // raise the on refresh session event and see if the default event should proceed
            Main.Site.raiseOnRefreshSession(args);
            if(args.AbortDefault || (!Main.HasDatabaseConnection)) {
                Id = args.SessionId;
            }else{
                // use the reference database for authentication
                SqlCommand cmd = null;
                string sessionCommand = "dbo.createSession @default_order_by,@default_list_mode,@default_records_per_page,@referer,@userAgent,@ipAddr,@unique_site_id";
                if(cn == null) {
                    cmd = new SqlCommand(sessionCommand, Site.SqlConnection);
                } else {
                    cmd = new SqlCommand(sessionCommand, cn, trns);
                }
                if(HttpContext.Current == null) {
                    Referer = "INTERNAL_SESSION";
                    UserAgent = "INTERNAL_SESSION";
                    Ip = "127.0.0.1";
                }
                cmd.Parameters.Add("@default_order_by", SqlDbType.Int).Value = Main.Site.default_orderby;
                cmd.Parameters.Add("@default_list_mode", SqlDbType.Int).Value = Main.Site.default_listmode;
                cmd.Parameters.Add("@default_records_per_page", SqlDbType.Int).Value = Main.Site.default_records_per_page;
                cmd.Parameters.Add("@referer", SqlDbType.VarChar).Value = Referer;
                cmd.Parameters.Add("@userAgent", SqlDbType.VarChar).Value = UserAgent;
                cmd.Parameters.Add("@ipAddr", SqlDbType.VarChar).Value = Ip.MaxLength(15, false);
                cmd.Parameters.Add("@unique_site_id", SqlDbType.UniqueIdentifier).Value = new Guid(Main.Site.Defaults.SiteId.ToString());
                using(SqlDataReader newSession = cmd.ExecuteReader()) {
                    newSession.Read();
                    Id = new Guid(newSession.GetValue(0).ToString());
                }
                cmd.Dispose();
            }
            if(makeCookie && HttpContext.Current != null) {
                HttpCookie session_cookie = new HttpCookie(Main.Site.cookie_name);
                session_cookie.Value = Id.ToString();
                DateTime dtNow = DateTime.Now;
                TimeSpan expiresDays = new TimeSpan(0, Main.Site.days_until_session_expires, 0, 0);
                session_cookie.Expires = dtNow + expiresDays;
                HttpContext.Current.Response.Cookies.Add(session_cookie);
            }
            return;
        }
        /// <summary>
        /// Removes the database entry for this session.
        /// </summary>
        public void RemoveDatabaseEntry() {
            RemoveDatabaseEntry(null, null);
            return;
        }
        /// <summary>
        /// Removes the database entry for this session using the selected connection and transaction.
        /// </summary>
        /// <param name="cn">SQL connection.</param>
        /// <param name="trns">SQL transaction.</param>
        public void RemoveDatabaseEntry(SqlConnection cn, SqlTransaction trns) {
            SqlCommand cmd;
            string removeCommand = "delete from visitors where sessionId = @sessionId";
            if(cn == null) {
                cmd = new SqlCommand(removeCommand, Site.SqlConnection);
            } else {
                cmd = new SqlCommand(removeCommand, cn, trns);
            }
            cmd.Parameters.Add("@sessionId", SqlDbType.UniqueIdentifier).Value = new Guid(this.Id.ToString());
            cmd.ExecuteNonQuery();
            cmd.Dispose();
            return;
        }
        /// <summary>
        /// Refreshes this session.
        /// </summary>
        public void Refresh() {
            this.Refresh(true);
            return;
        }
        /// <summary>
        /// Updates the _session object from the database
        /// </summary>
        public void Refresh(bool processRequests) {
            Refresh(processRequests, null, null);
        }
        /// <summary>
        /// Returns a <see cref="System.String"/> that represents this instance.
        /// </summary>
        /// <returns>
        /// A <see cref="System.String"/> that represents this instance.
        /// </returns>
        public override string ToString() {
            return "Oda Session:[UserId:" + this.UserId.ToString() + ", SessionId:" + this.Id.ToString() + "]";
        }
        /// <summary>
        /// Updates the _session object from the database
        /// </summary>
        public void Refresh(bool processRequests, SqlConnection cn, SqlTransaction trans) {
            SqlCommand cmd = null;
            try {
                SqlDataReader u;
                string commandText = "dbo.getSession";
                HttpContext current = HttpContext.Current;
                if(cn == null) {
                    cmd = new SqlCommand(commandText, Site.SqlConnection);
                } else {
                    cmd = new SqlCommand(commandText, cn, trans);
                }
                cmd.CommandType = CommandType.StoredProcedure;
                /* this command may stay pending while other commands are executing so a long timeout is requred */
                cmd.CommandTimeout = 0;
                cmd.Parameters.Add("@sessionId", SqlDbType.UniqueIdentifier).Value = new Guid(Id.ToString());
                cmd.Parameters.Add("@url", SqlDbType.VarChar).Value = Host + Url;
                if(current != null) {
                    cmd.Parameters.Add("@querystring", SqlDbType.VarChar).Value = current.Request.QueryString.ToString().MaxLength(7700, true);
                } else {
                    cmd.Parameters.Add("@querystring", SqlDbType.VarChar).Value = "";
                }
                /* allows keeping the noise from these directores and virtual responders quiet */
                cmd.Parameters.Add("@responder", SqlDbType.VarChar).Value = Main.Responder;
                cmd.Parameters.Add("@adminResponder", SqlDbType.VarChar).Value = Main.AdminResponder;
                cmd.Parameters.Add("@adminDirectory", SqlDbType.VarChar).Value = Main.AdminDirectory;
                using(u = cmd.ExecuteReader()) {
                    if(!u.HasRows) {
                        if(current != null) {
                            current.Response.Cookies.Remove(Main.Site.cookie_name);
                        }
                        CreateNewSession(true);
                        Refresh();
                        return;
                    }
                    /* read the session header */
                    if(u.Read()) {
                        UserId = u.GetInt32(0);
                        Zip = u.GetString(1);
                        ShippingRate = u.GetInt32(2);
                        context = u.GetString(3);
                        RecordsPerPage = u.GetInt32(4);
                        ListOrder = u.GetInt32(5);
                        ListView = u.GetInt32(6);
                        Wholesale = u.GetInt32(7);
                        UserLevel = u.GetInt32(8);
                        Email = u.GetString(9);
                        AllowPreorders = u.GetInt32(10);
                        AdminScript = u.GetString(11);
                        LogonRedirect = u.GetString(12);
                        UIJson = u.GetString(13);
                    }
                    /* read the session hash table */
                    u.NextResult();
                    while(u.Read()) {
                        string keyName = u.GetString(0);
                        if(!Properties.ContainsKey(keyName)) {
                            Properties.Add(u.GetString(0), u.GetString(1));
                        }
                    }
                    if(UserId > -1) {
                        User = Main.Site.Users.List.Find(delegate(Commerce.User usr) {
                            if(usr.UserId == UserId) {
                                return true;
                            }
                            return false;
                        });
                        SiteDefaults = Main.Site.Defaults;
                        LoggedOn = true;
                    }
                    if(UserLevel >= Main.Site.administrator_user_level) {
                        Administrator = true;
                    }
                }
            } catch(Exception ex) {
                String.Format("Exception in Session.refresh > {0}", ex.Message);
            } finally {
                cmd.Dispose();
            }
            Cart = new Commerce.Cart(this, this.Site);
            return;
        }
        /// <summary>
        /// Gets the contact by contact id.
        /// </summary>
        /// <param name="contactId">The contact id.</param>
        /// <returns></returns>
        public Commerce.Address GetContactById(Guid contactId) {
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(getContactByIdQuery, cn)) {
                    cmd.Parameters.Add("@contactId", SqlDbType.UniqueIdentifier).Value = new Guid(contactId.ToString());
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        while(d.Read()) {
                            Commerce.Address addr = new Commerce.Address(
                            d.GetGuid(0),
                            d.GetString(1),
                            d.GetString(2),
                            d.GetString(3),
                            d.GetString(4),
                            d.GetString(5),
                            d.GetString(6),
                            d.GetString(7),
                            d.GetString(8),
                            d.GetString(9),
                            d.GetString(10),
                            d.GetString(11),
                            d.GetString(12),
                            d.GetString(13),
                            d.GetBoolean(14),
                            d.GetBoolean(15),
                            Main.Site.Rates.List.Find(delegate(Commerce.Rate t) {
                                return t.Id == d.GetInt32(16);
                            }),
                            d.GetDateTime(17),
                            d.GetString(18));
                            return addr;
                        }
                    }
                }
            }
            return null;
        }
        /// <summary>
		/// Logs off the user to this session.
		/// </summary>
		/// <returns></returns>
		public int LogOff(){
			return Site.LogOff(this);
		}
        /// <summary>
        /// Logs on the specified user to this session.
        /// </summary>
        /// <param name="userId">The user id.</param>
        /// <param name="password">The password.</param>
        /// <returns></returns>
		public int LogOn( int userId, string password ) {
			return Site.LogOn( userId, password, this );
		}
		/// <summary>
		/// Logs on the specified user to this session.
		/// </summary>
		/// <param name="userName">Name of the user.</param>
		/// <param name="password">The password.</param>
		/// <returns></returns>
		public int LogOn( string userName, string password ) {
			return Site.LogOn( userName, password, this );
		}
		/// <summary>
		/// Updates a property.
		/// </summary>
		/// <param name="keyName">Name of the key.</param>
		/// <param name="keyValue">The key value.</param>
		public void UpdateProperty( string keyName, string keyValue ) {
			AddProperty( keyName, keyValue );
		}
		/// <summary>
		/// Gets a property or blank (instead of null).
		/// </summary>
		/// <param name="keyName">Name of the key.</param>
		/// <returns></returns>
		public object GetPropertyOrBlank( string keyName ) {
			object property = GetProperty( keyName );
			if( property == null ) {
				return "";
			} else {
				return property;
			}
		}
		/// <summary>
		/// Gets a property.
		/// </summary>
		/// <param name="keyName">Name of the key.</param>
		/// <returns></returns>
		public object GetProperty( string keyName ) {
			if( Properties.ContainsKey( keyName ) ) {
				return Properties[ keyName ];
			} else {
				return null;
			}
		}
		/// <summary>
		/// Adds a property.
		/// </summary>
		/// <param name="keyName">Name of the key.</param>
		/// <param name="keyValue">The key value.</param>
		public void AddProperty( string keyName, object keyValue ) {
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                AddProperty(keyName, keyValue, Site.SqlConnection, null);
            }
		}
		/// <summary>
		/// Adds a property.
		/// </summary>
		/// <param name="keyName">Name of the key.</param>
		/// <param name="keyValue">The key value.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trans">The trans.</param>
		public void AddProperty( string keyName, object keyValue, SqlConnection cn, SqlTransaction trans ) {
			if( Properties.ContainsKey( keyName ) ) {
				Properties[ keyName ] = keyValue;
			} else {
				Properties.Add( keyName, keyValue );
			}
			/* update this value in the database */
			using( SqlCommand cmd = new SqlCommand( "dbo.insertUpdateSessionHash @userId, @sessionId, @keyName, @keyValue", cn, trans ) ) {
				cmd.Parameters.Add( "@userId", SqlDbType.Int ).Value = this.UserId;
				cmd.Parameters.Add( "@sessionId", SqlDbType.UniqueIdentifier ).Value = new Guid( this.Id.ToString() );
				cmd.Parameters.Add( "@keyName", SqlDbType.VarChar ).Value = keyName;
				cmd.Parameters.Add( "@keyValue", SqlDbType.VarChar ).Value = keyValue;
				cmd.ExecuteNonQuery();
			}
		}
		/// <summary>
		/// Removes a property.
		/// </summary>
		/// <param name="keyName">Name of the key.</param>
		public void RemoveProperty( string keyName ) {
			RemoveProperty( keyName, Site.SqlConnection, null );
		}
		/// <summary>
		/// Removes a property.
		/// </summary>
		/// <param name="keyName">Name of the key.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trans">The trans.</param>
		public void RemoveProperty( string keyName, SqlConnection cn, SqlTransaction trans ) {
			if( Properties.Count > 0 ) {
				Properties.Remove( keyName );/* remove from local cache NOW */
				/* remove this value from the database */
				using( SqlCommand cmd = new SqlCommand( @"delete from sessionHash
				where (userId = @userId or sessionId = @sessionId) and property = @keyName", cn, trans ) ) {
					cmd.Parameters.Add( "@userId", SqlDbType.Int ).Value = this.UserId;
					cmd.Parameters.Add( "@sessionId", SqlDbType.UniqueIdentifier ).Value = new Guid( this.Id.ToString() );
					cmd.Parameters.Add( "@keyName", SqlDbType.VarChar ).Value = keyName;
					cmd.ExecuteNonQuery();
				}
			}
		}
        #endregion
        #region Private Instance Methods
        /// <summary>
		/// Gets the client state info.
		/// </summary>
		private void getServerStateInfo() {
			HttpContext current = HttpContext.Current;
			if( current != null ) {
				Referer = current.Request.ServerVariables[ "HTTP_REFERER" ];
				UserAgent = current.Request.ServerVariables[ "HTTP_USER_AGENT" ];
				Ip = current.Request.ServerVariables[ "REMOTE_ADDR" ];
				Url = current.Request.ServerVariables[ "PATH_INFO" ];
				Host = current.Request.ServerVariables[ "HTTP_HOST" ];
			}
			return;
		}
        #endregion
	}
}
