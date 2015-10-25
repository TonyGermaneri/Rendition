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
using Microsoft.SqlServer.Server;
namespace Rendition {
	public partial class Commerce {
		/// <summary>
		/// This class represents the user once they have logged on to the site
		/// </summary>
		public class User {
            #region Static Methods
            /// <summary>
            /// Gets the user by email.
            /// </summary>
            /// <param name="email">The email.</param>
            /// <returns>Email Address.</returns>
            public static Commerce.User GetUserByEmail(string email) {
                return Users.GetUserByEmail(email);
            }
            /// <summary>
            /// Gets the user by handle.
            /// </summary>
            /// <param name="handle">The handle.</param>
            /// <returns>Handle</returns>
            public static Commerce.User GetUserByHandle(string handle) {
                return Users.GetUserByHandle(handle);
            }
            /// <summary>
            /// Gets the user by id.
            /// </summary>
            /// <param name="userId">The user id.</param>
            /// <returns>The selected user</returns>
            public static Commerce.User GetUserById(int userId) {
                return Users.GetUserById(userId);
            }
            /// <summary>
            /// Refreshes the user by id.
            /// </summary>
            /// <param name="userId">The user id.</param>
            public static void RefreshUserById(int userId) {
                Users.RefreshUserById(userId);
            }
            #endregion
            #region Private Instance Fields
            private List<Address> _contacts = null;
            /// <summary>
            /// The private field user's level.
            /// </summary>
            private int _UserLevel;
            #endregion
            #region Instance Properties
            /// <summary>
			/// The email Address of this user.
			/// </summary>
            public string Email { get; internal set; }
			/// <summary>
			/// The user's password.
			/// </summary>
            public string Password { get; internal set; }
			/// <summary>
			/// The user's account number/userId
			/// </summary>
            public int UserId { get; internal set; }
			/// <summary>
			/// The user's level.
			/// </summary>
            public int UserLevel {
                get {
                    return _UserLevel;
                }
            }
			/// <summary>
			/// The account's name.
			/// </summary>
            public string Handle { get; internal set; }
			/// <summary>
			/// Does this user get wholesale price lists?
			/// </summary>
            public bool WholesaleDealer { get; internal set; }
			/// <summary>
			/// The last time this user visited the site.
			/// </summary>
            public DateTime LastVisit { get; internal set; }
			/// <summary>
			/// Coments about this user.
			/// </summary>
            public string Comments { get; internal set; }
			/// <summary>
			/// Is this user an administrator?
			/// </summary>
			public bool Administrator {
                get {
                    return Main.Site.administrator_user_level<=this.UserLevel;
                }
            }
			/// <summary>
			/// Does this user want to recieve ads in their email?
			/// </summary>
            public bool WouldLikEmail { get; internal set; }
			/// <summary>
			/// The date this account was created.
			/// </summary>
            public DateTime CreateDate { get; internal set; }
			/// <summary>
			/// The last sessionId this user logged in with.
			/// </summary>
            public Guid SessionId { get; internal set; }
			/// <summary>
			/// The quota this user must meet to place an order (not implemented).
			/// </summary>
            public bool QuotaWholesale { get; internal set; }
			/// <summary>
			/// The quota is complete (not implemented).
			/// </summary>
            public bool QuotaComplete { get; internal set; }
			/// <summary>
			/// The quota that must be met (not implemented).
			/// </summary>
            public int Quota { get; internal set; }
			/// <summary>
			/// How much non monitary credit this user has (not implemented).
			/// </summary>
            public decimal Credit { get; internal set; }
			/// <summary>
			/// Is the user currently logged in (not implemented).
			/// </summary>
            public bool LoggedIn { get; internal set; }
			/// <summary>
			/// The account number used by your vendor.
			/// </summary>
            public string PurchaseAccount { get; internal set; }
			/// <summary>
			/// The credit limit of this account (not implemented).
			/// </summary>
            public decimal CreditLimit { get; internal set; }
			/// <summary>
			/// Contact name for this account.
			/// </summary>
            public string Contact { get; internal set; }
			/// <summary>
			/// Address line 1.
			/// </summary>
            public string Address1 { get; internal set; }
			/// <summary>
			/// Address line 2.
			/// </summary>
            public string Address2 { get; internal set; }
			/// <summary>
			/// Zip code.
			/// </summary>
            public string Zip { get; internal set; }
			/// <summary>
			/// State.
			/// </summary>
            public string State { get; internal set; }
			/// <summary>
			/// Country.
			/// </summary>
            public string Country { get; internal set; }
			/// <summary>
			/// City.
			/// </summary>
			public string City{ get; internal set; }
			/// <summary>
			/// Home phone.
			/// </summary>
            public string HomePhone { get; internal set; }
			/// <summary>
			/// Work phone.
			/// </summary>
            public string WorkPhone { get; internal set; }
			/// <summary>
			/// Company email.
			/// </summary>
            public string CompanyEmail { get; internal set; }
			/// <summary>
			/// Fax.
			/// </summary>
            public string Fax { get; internal set; }
			/// <summary>
			/// Web site.
			/// </summary>
            public string Www { get; internal set; }
			/// <summary>
			/// First name.
			/// </summary>
            public string FirstName { get; internal set; }
			/// <summary>
			/// Last name.
			/// </summary>
            public string LastName { get; internal set; }
			/// <summary>
			/// Term Id this account uses by default.
			/// </summary>
            public int TermId { get; internal set; }
			/// <summary>
			/// This account uses terms (not implemented).
			/// </summary>
            public bool UsesTerms { get; internal set; }
			/// <summary>
			/// Type of account 0 = AR, 1 = AP, 2 = operator.
			/// </summary>
            public int AccountType { get; internal set; }
			/// <summary>
			/// Path to the custom quote PDF.
			/// </summary>
            public string Quote { get; internal set; }
			/// <summary>
			/// Path to the custom invoice PDF.
			/// </summary>
            public string Invoice { get; internal set; }
			/// <summary>
			/// Path to the custom packing slip PDF.
			/// </summary>
            public string PackingSlip { get; internal set; }
			/// <summary>
			/// Is this user exempt from taxation?
			/// </summary>
            public bool NoTax { get; internal set; }
			/// <summary>
			/// Allow placing order on items that have no stock.
			/// </summary>
            public bool AllowPreorders { get; internal set; }
			/// <summary>
			/// Freight on board defalut for this user.
			/// </summary>
            public string Fob { get; internal set; }
			/// <summary>
			/// When this user logs on, redirect to another location.
			/// </summary>
            public string LogonRedirect { get; internal set; }
			/// <summary>
			/// Instead of the default Admin script use another Admin script.
			/// </summary>
            public string AdminScript { get; internal set; }
			/// <summary>
			/// The default rate id for new orders in this account.
			/// </summary>
            public int RateId { get; internal set; }
			/// <summary>
			/// Send shipment updates default for new orders in this account.
			/// </summary>
            public bool SendShipmentUpdates { get; internal set; }
			/// <summary>
			/// Use account defaults on new orders.
			/// </summary>
            public bool AutoFillOrderForm { get; internal set; }
			/// <summary>
			/// Default estimated lead time for new orders in this account.
			/// </summary>
            public int EstLeadTime { get; internal set; }
			/// <summary>
			/// Default estimated time in transit for orders in this account.
			/// </summary>
            public int EstTransitTime { get; internal set; }
			/// <summary>
			/// The asset account for this user.
			/// </summary>
            public int AssetAccount { get; internal set; }
			/// <summary>
			/// The script to run each time the UI inits
			/// </summary>
            public string UIJson { get; internal set; }
			/// <summary>
			/// The default printer path for this user
			/// </summary>
			public string DefaultPrinterPath;
			/// <summary>
			/// Gets the list of contacts for this user using a SQL query.
			/// </summary>
			public List<Address> Contacts {
				get {
					if(_contacts!=null){
						return _contacts;
					}
					RefreshUserContacts();
					return _contacts;
				}
			}
            /// <summary>
            /// The default rate id for new orders in this account.
            /// </summary>
            public Commerce.Rate Rate {
                get {
                    return Main.Site.Rates.List.Find(delegate(Commerce.Rate r) {
                        return r.Id == this.RateId;
                    });
                }
            }
            /// <summary>
            /// Term this account uses by default.
            /// </summary>
            public Commerce.Term Term {
                get {
                    return Main.Site.Terms.List.Find(delegate(Commerce.Term t) {
                        return t.Id == this.TermId;
                    });
                }
            }
            #endregion
            #region Instance Methods
            /// <summary>
			/// Refreshes the user contacts.
			/// </summary>
			public void RefreshUserContacts(){
				_contacts = new List<Address>();
				string sqlCommand = @"select 
contactId,firstName,lastName,address1,address2,
city,state,zip,country,homePhone,workPhone,email,specialInstructions,
comments,sendshipmentupdates,emailads, rate,dateCreated,company
from contacts with (nolock)	where userId = @userId";
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand(sqlCommand, cn)) {
                        cmd.Parameters.Add("@userId", SqlDbType.Int).Value = this.UserId;
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            while(d.Read()) {
                                Address addr = new Address(
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
                                _contacts.Add(addr);
                            }
                        }
                    }
                }
			}
            #endregion
            #region Instance Methods
            /// <summary>
			/// Returns a <see cref="System.String"/> that represents this instance.  Returns handle, contact or userId as a string.
			/// </summary>
			/// <returns>
			/// A <see cref="System.String"/> that represents this instance.
			/// </returns>
			public override string ToString() {
				string output = UserId.ToString();
                if(Handle.Length>0 || Email.Length>0){
                    output += " (";
                    if(Handle.Length > 0) {
                        output += Handle;
                    } else if(Email.Length > 0) {
                        output += Email;
                    }
                    output += ") ";
                }
                return output;
			}
            #endregion
            #region Static Properties
            /// <summary>
            /// Gets all the users in the site.
            /// </summary>
            public static List<Commerce.User> All {
                get {
                    return Main.Site.Users.List;
                }
            }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="User"/> class.
            /// </summary>
            public User() {}
			/// <summary>
			/// Initializes a new instance of the <see cref="User"/> class.
			/// </summary>
			/// <param name="f_email">The f_email.</param>
			/// <param name="f_password">The f_password.</param>
			/// <param name="f_userId">The f_user id.</param>
			/// <param name="f_userLevel">The f_user level.</param>
			/// <param name="f_handle">The f_handle.</param>
			/// <param name="f_wholesaledealer">if set to <c>true</c> [f_wholesaledealer].</param>
			/// <param name="f_lastVisit">The f_last visit.</param>
			/// <param name="f_comments">The f_comments.</param>
			/// <param name="f_administrator">if set to <c>true</c> [f_administrator].</param>
			/// <param name="f_wouldlikemail">if set to <c>true</c> [f_wouldlikemail].</param>
			/// <param name="f_createdate">The f_createdate.</param>
			/// <param name="f_SessionID">The f_ session ID.</param>
			/// <param name="f_quotaWholesale">if set to <c>true</c> [f_quota wholesale].</param>
			/// <param name="f_quotaComplete">if set to <c>true</c> [f_quota complete].</param>
			/// <param name="f_quota">The f_quota.</param>
			/// <param name="f_credit">The f_credit.</param>
			/// <param name="f_loggedIn">if set to <c>true</c> [f_logged in].</param>
			/// <param name="f_purchaseaccount">The f_purchaseaccount.</param>
			/// <param name="f_creditlimit">The f_creditlimit.</param>
			/// <param name="f_purchasecontact">The f_purchasecontact.</param>
			/// <param name="f_purchaseaddress">The f_purchaseaddress.</param>
			/// <param name="f_purchaseaddress2">The f_purchaseaddress2.</param>
			/// <param name="f_purchasezip">The f_purchasezip.</param>
			/// <param name="f_purchasestate">The f_purchasestate.</param>
			/// <param name="f_purchasecountry">The f_purchasecountry.</param>
			/// <param name="f_purchasecity">The f_purchasecity.</param>
			/// <param name="f_purchasephone">The f_purchasephone.</param>
			/// <param name="f_purchaseemail">The f_purchaseemail.</param>
			/// <param name="f_purchasefax">The f_purchasefax.</param>
			/// <param name="f_purchasewww">The f_purchasewww.</param>
			/// <param name="f_purchaseFirstName">First name of the f_purchase.</param>
			/// <param name="f_purchaseLastName">Last name of the f_purchase.</param>
			/// <param name="f_termID">The f_term ID.</param>
			/// <param name="f_usesTerms">if set to <c>true</c> [f_uses terms].</param>
			/// <param name="f_accounttype">The f_accounttype.</param>
			/// <param name="f_packingSlipID">The f_packing slip ID.</param>
			/// <param name="f_notax">if set to <c>true</c> [f_notax].</param>
			/// <param name="f_allowPreorders">if set to <c>true</c> [f_allow preorders].</param>
			/// <param name="f_customQuote">The f_custom quote.</param>
			/// <param name="f_customInvoice">The f_custom invoice.</param>
			/// <param name="f_FOBId">The f_ FOB id.</param>
			/// <param name="f_logon_redirect">The f_logon_redirect.</param>
			/// <param name="f_admin_script">The f_admin_script.</param>
			/// <param name="f_rateId">The f_rate id.</param>
			/// <param name="f_workPhone">The f_work phone.</param>
			/// <param name="f_autoFillOrderform">if set to <c>true</c> [f_auto fill orderform].</param>
			/// <param name="f_sendShipmentUpdates">if set to <c>true</c> [f_send shipment updates].</param>
			/// <param name="f_estLeadTime">The f_est lead time.</param>
			/// <param name="f_estTransitTime">The f_est transit time.</param>
			/// <param name="f_UI_JSON">The script to run each time the UI inits.</param>
			/// <param name="f_assetAccount">The asset account.</param>
			/// <param name="f_defaultPrinterPath">The default printer path.</param>
			public User( string f_email, string f_password, int f_userId, int f_userLevel, string f_handle, bool f_wholesaledealer, DateTime f_lastVisit,
					string f_comments, bool f_administrator, bool f_wouldlikemail, DateTime f_createdate, Guid f_SessionID, bool f_quotaWholesale,
					bool f_quotaComplete, int f_quota, decimal f_credit, bool f_loggedIn, string f_purchaseaccount, decimal f_creditlimit,
					string f_purchasecontact, string f_purchaseaddress, string f_purchaseaddress2, string f_purchasezip, string f_purchasestate,
					string f_purchasecountry, string f_purchasecity, string f_purchasephone, string f_purchaseemail, string f_purchasefax,
					string f_purchasewww, string f_purchaseFirstName, string f_purchaseLastName, int f_termID, bool f_usesTerms, int f_accounttype,
					string f_packingSlipID, bool f_notax, bool f_allowPreorders, string f_customQuote, string f_customInvoice, string f_FOBId,
					string f_logon_redirect, string f_admin_script, int f_rateId, string f_workPhone, bool f_autoFillOrderform, bool f_sendShipmentUpdates,
					int f_estLeadTime, int f_estTransitTime, string f_UI_JSON, int f_assetAccount, string f_defaultPrinterPath ) {
				Email = f_email;
				Password = f_password;
				UserId = f_userId;
				_UserLevel = f_userLevel;
				Handle = f_handle;
				WholesaleDealer = f_wholesaledealer;
				LastVisit = f_lastVisit;
				Comments = f_comments;
				//This field is depricated.  Administrator is calculated by user level now.
                //Administrator = f_administrator;
				WouldLikEmail = f_wouldlikemail;
				CreateDate = f_createdate;
				SessionId = f_SessionID;
				QuotaWholesale = f_quotaWholesale;
				QuotaComplete = f_quotaComplete;
				Quota = f_quota;
				Credit = f_credit;
				LoggedIn = f_loggedIn;
				PurchaseAccount = f_purchaseaccount;
				CreditLimit = f_creditlimit;
				Contact = f_purchasecontact;
				Address1 = f_purchaseaddress;
				Address2 = f_purchaseaddress2;
				Zip = f_purchasezip;
				State = f_purchasestate;
				Country = f_purchasecountry;
				City = f_purchasecity;
				HomePhone = f_purchasephone;
				CompanyEmail = f_purchaseemail;
				Fax = f_purchasefax;
				Www = f_purchasewww;
				FirstName = f_purchaseFirstName;
				LastName = f_purchaseLastName;
				TermId = f_termID;
				UsesTerms = f_usesTerms;
				AccountType = f_accounttype;
				PackingSlip = f_packingSlipID;
				NoTax = f_notax;
				AllowPreorders = f_allowPreorders;
				Quote = f_customQuote;
				Invoice = f_customInvoice;
				Fob = f_FOBId;
				LogonRedirect = f_logon_redirect;
				AdminScript = f_admin_script;
				RateId = f_rateId;
				WorkPhone = f_workPhone;
				SendShipmentUpdates = f_sendShipmentUpdates;
				AutoFillOrderForm = f_autoFillOrderform;
				EstLeadTime = f_estLeadTime;
				EstTransitTime = f_estTransitTime;
				UIJson = f_UI_JSON;
				AssetAccount = f_assetAccount;
				DefaultPrinterPath = f_defaultPrinterPath;
            }
            #endregion
        }
		/// <summary>
		/// This is a list of all the users cached in memory.
		/// </summary>
		internal class Users {
            #region Instance Fields
            /// <summary>
			/// List of all the users cached in memory.
			/// </summary>
			public List<User> List = new List<User>();
            #endregion
            #region Static Methods
            /// <summary>
			/// Gets the user by email.
			/// </summary>
			/// <param name="email">The email.</param>
			/// <returns>Email Address.</returns>
			public static Commerce.User GetUserByEmail( string email ) {
				Commerce.User u = null;
				u = Main.Site.Users.List.Find( delegate( Commerce.User _user ) {
					return _user.Email == email;
				} );
				if( u == null ) {
					return Main.Site.NullUser;
				}
				return u;
			}
			/// <summary>
			/// Gets the user by handle.
			/// </summary>
			/// <param name="handle">The handle.</param>
			/// <returns>Handle</returns>
			public static Commerce.User GetUserByHandle( string handle ) {
				Commerce.User u = null;
				u = Main.Site.Users.List.Find( delegate( Commerce.User _user ) {
					return _user.Handle == handle;
				} );
				if( u == null ) {
					return Main.Site.NullUser;
				}
				return u;
			}
			/// <summary>
			/// Gets the user by id.
			/// </summary>
			/// <param name="userId">The user id.</param>
			/// <returns>The selected user</returns>
			public static Commerce.User GetUserById( int userId ) {
				Commerce.User u = null;
				u = Main.Site.Users.List.Find( delegate( Commerce.User _user ) {
					return _user.UserId == userId;
				} );
				if( u == null ) {
					return Main.Site.NullUser;
				}
				return u;
			}
			/// <summary>
			/// Refreshes the user by id.
			/// </summary>
			/// <param name="userId">The user id.</param>
			public static void RefreshUserById( int userId ) {
				/* try and find the user in the list */
				User i = Main.Site.Users.List.Find( delegate( User usr ) {
					return usr.UserId == userId;
				} );
				User u = null;
				/* now grab the new data from the database */
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getUsers @userId", cn)) {
                        cmd.Parameters.Add("@userId", SqlDbType.Int).Value = userId;
                        using(SqlDataReader user_list = cmd.ExecuteReader()) {
                            user_list.Read();
                            u = GetUserFromDataReader(user_list);
                        }
                    }
                }
				if( i != null ) {
					int index = Main.Site.Users.List.IndexOf( i );
					Main.Site.Users.List[ index ] = u;
				} else {
					Main.Site.Users.List.Add( u );
				}
			}
            #endregion
            #region Private Static Methods
            /// <summary>
			/// Gets the user from data reader.
			/// </summary>
			/// <param name="user_list">The user_list.</param>
			/// <returns>User from database</returns>
			private static User GetUserFromDataReader( SqlDataReader user_list ) {
				return new User(
					user_list.GetString( 0 ),
					user_list.GetString( 1 ),
					user_list.GetInt32( 2 ),
					user_list.GetInt32( 3 ),
					user_list.GetString( 4 ),
					user_list.GetBoolean( 5 ),
					user_list.GetDateTime( 6 ),
					user_list.GetString( 7 ),
					user_list.GetBoolean( 8 ),
					user_list.GetBoolean( 9 ),
					user_list.GetDateTime( 10 ),
					user_list.GetGuid( 11 ),
					user_list.GetBoolean( 12 ),
					user_list.GetBoolean( 13 ),
					user_list.GetInt32( 14 ),
					user_list.GetDecimal( 15 ),
					user_list.GetBoolean( 16 ),
					user_list.GetString( 17 ),
					user_list.GetDecimal( 18 ),
					user_list.GetString( 19 ),
					user_list.GetString( 20 ),
					user_list.GetString( 21 ),
					user_list.GetString( 22 ),
					user_list.GetString( 23 ),
					user_list.GetString( 24 ),
					user_list.GetString( 25 ),
					user_list.GetString( 26 ),
					user_list.GetString( 27 ),
					user_list.GetString( 28 ),
					user_list.GetString( 39 ),
					user_list.GetString( 30 ),
					user_list.GetString( 31 ),
					user_list.GetInt32( 32 ),
					user_list.GetBoolean( 33 ),
					user_list.GetInt32( 34 ),
					user_list.GetString( 35 ),
					user_list.GetBoolean( 36 ),
					user_list.GetBoolean( 37 ),
					user_list.GetString( 38 ),
					user_list.GetString( 39 ),
					user_list.GetString( 40 ),
					user_list.GetString( 41 ),
					user_list.GetString( 42 ),
					user_list.GetInt32( 43 ),
					user_list.GetString( 44 ),
					user_list.GetBoolean( 45 ),
					user_list.GetBoolean( 46 ),
					user_list.GetInt32( 47 ),
					user_list.GetInt32( 48 ),
					user_list.GetString( 49 ),
					user_list.GetInt32( 50 ),
					user_list.GetString( 51 )
				);
			}
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Users"/> class.
			/// </summary>
			/// <param name="site">The site.</param>
			public Users( Site site ) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getUsers @userId", cn)) {
                        cmd.Parameters.Add("@userId", SqlDbType.Int).Value = -1;
                        using(SqlDataReader user_list = cmd.ExecuteReader()) {
                            while(user_list.Read()) {
                                try {
                                    List.Add(GetUserFromDataReader(user_list));
                                } catch(Exception e) {
                                    (e.Message).Debug(4);
                                    int userId;
                                    try {
                                        userId = user_list.GetInt32(2);
                                    } catch(Exception ex) {
                                        (ex.Message).Debug(4);
                                        userId = -1;
                                    }
                                    String.Format("Class users thew an exception on instantiation ==>{0}", userId).Debug(1);
                                }
                            }
                        }
                    }
                }
				return;
            }
            #endregion
        }
	}
}