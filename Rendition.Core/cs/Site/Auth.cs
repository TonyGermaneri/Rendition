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
using System.Security.Cryptography;
namespace Rendition {
	public partial class Site {
		/// <summary>
		/// logs the current session on
		/// </summary>
		/// <param name="args">The arguments.</param>
		/// <returns>{error:0,desc:""}.</returns>
		public static Dictionary<string, object> LogOn( Dictionary<string, object> args ) {
			return LogOn( args, null, null );
		}
		/// <summary>
		/// Turns a string into a hashed string.  A one way encrypted value.
		/// </summary>
		/// <param name="_password">The _password.</param>
		/// <returns></returns>
		public static string GetHash( object _password ) {
			string password = Convert.ToString( _password );
			HashAlgorithm mhash = new SHA1CryptoServiceProvider();
			byte[] passBytes = Encoding.UTF8.GetBytes( password + Main.SHA1HASHSALT );
			byte[] hashBytes = mhash.ComputeHash( passBytes );
			mhash.Clear();
			password = Convert.ToBase64String( hashBytes );
			return password;
		}
        /// <summary>
        /// Logons the specified user.
        /// </summary>
        /// <param name="userName">User Id.</param>
        /// <param name="password">Password.</param>
        /// <param name="sessionId">The session id.</param>
        /// <returns></returns>
		public static int LogOn( string userName, string password, string sessionId ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			j.Add( "sessionId", sessionId );
			j.Add( "email", userName );
			j.Add( "password", password );
			Dictionary<string, object> r = LogOn( j, null, null );
			return ( int )r[ "error" ];
		}
        /// <summary>
        /// Logons the specified user.
        /// </summary>
        /// <param name="userId">The user id.</param>
        /// <param name="password">Password.</param>
        /// <param name="sessionId">The session id.</param>
        /// <returns></returns>
		public static int LogOn( int userId, string password, string sessionId ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			j.Add( "sessionId", sessionId );
			j.Add( "userId", userId );
			j.Add( "password", password );
			Dictionary<string, object> r = LogOn( j, null, null );
			return ( int )r[ "error" ];
		}
        /// <summary>
        /// Logons the specified user.
        /// </summary>
        /// <param name="userId">The user id.</param>
        /// <param name="password">Password.</param>
        /// <param name="session">Session to logon.</param>
        /// <returns></returns>
		public static int LogOn( int userId, string password, Session session ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			j.Add( "sessionId", session.Id.ToString() );
			j.Add( "userId", userId );
			j.Add( "password", password );
			Dictionary<string, object> r = LogOn( j, null, null );
			return ( int )r[ "error" ];
		}
		/// <summary>
		/// Logons the specified user.
		/// </summary>
		/// <param name="userName">User name.</param>
		/// <param name="password">The password.</param>
		/// <param name="session">Session to logon.</param>
		/// <returns></returns>
		public static int LogOn(string userName, string password, Session session ){
			Dictionary<string, object> j = new Dictionary<string, object>();
			j.Add( "sessionId", session.Id.ToString() );
			j.Add( "email", userName );
			j.Add( "password", password );
			Dictionary<string, object> r = LogOn(j,null,null);
			return (int)r["error"];
		}
		/// <summary>
		/// logs the current session on
		/// </summary>
		/// <param name="args">The arguments (sessionid, hostSessionId, userId, email, password).</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trns">The TRNS.</param>
		/// <returns>{error:0,desc:""}.</returns>
		public static Dictionary<string, object> LogOn( Dictionary<string, object> args, SqlConnection cn, SqlTransaction trns ) {
			int userId = -1;
			string login = "";
			string password = "";
			string hostSessionId = "";
			( "REQUEST:Log on try >" ).Debug( 9 );
			Dictionary<string, object> j = new Dictionary<string, object>();
			Session session = null;
			if( args.ContainsKey( "sessionId" ) ) {
				if( cn == null ) {
					session = new Session( Main.Site, new Guid( ( string )args[ "sessionId" ] ) );
				} else {
					session = new Session( Main.Site, new Guid( ( string )args[ "sessionId" ] ), cn, trns );
				}
			} else {
				session = Main.GetCurrentSession();
			}
			if( args.ContainsKey( "hostSessionId" ) ) {
				hostSessionId = args[ "hostSessionId" ].ToString();
			} else {
				hostSessionId = Main.GetCurrentSession().Id.ToString();
			}
			if( args.ContainsKey( "userId" ) ) {
				try {
					userId = Convert.ToInt32( args[ "userId" ] );
				} catch( Exception e ) {
					e.Message.Debug( 5 );
					( "logon failure > userId key is in the incorrect format > ip:" + session.Ip +
					",sessionId:" + session.Id.ToString() ).Debug( 5 );
					/* Logon error -4 incorrect userId format */
					j.Add( "error", -40 );
					j.Add( "description", "userId key is in the incorrect format." );
					return j;
				}
			}
			if( args.ContainsKey( "logon" ) ) {
				if( !int.TryParse( args[ "logon" ].ToString(), out userId ) ) {
					userId = -1;
				}
			}
			if( args.ContainsKey( "email" ) ) {
				login = Convert.ToString( args[ "email" ] );
			}
			if( args.ContainsKey( "password" ) ) {
				password = GetHash( args[ "password" ] );
			}
			/* execute SP logon */
			string commandText = "dbo.logon @email,@password,@sessionid,@createaccount,@unique_siteID,@userId,@referenceSessionId";
			SqlCommand cmd;
			if( cn == null ) {
				cmd = new SqlCommand( commandText, Site.SqlConnection );
			} else {
				cmd = new SqlCommand( commandText, cn, trns );
			}
			cmd.Parameters.Add( "@email", SqlDbType.VarChar ).Value = login;
			cmd.Parameters.Add( "@password", SqlDbType.VarChar ).Value = password;
			cmd.Parameters.Add( "@sessionid", SqlDbType.UniqueIdentifier ).Value = new Guid( session.Id.ToString() );
			cmd.Parameters.Add( "@createaccount", SqlDbType.Bit ).Value = false;
			cmd.Parameters.Add( "@unique_siteID", SqlDbType.UniqueIdentifier ).Value = new Guid( Site.Id.ToString() );
			cmd.Parameters.Add( "@userId", SqlDbType.Int ).Value = userId;
			cmd.Parameters.Add( "@referenceSessionId", SqlDbType.UniqueIdentifier ).Value = new Guid( hostSessionId );
			int logonError = -1;/* there is an error if there is no recordset  returned */
			using( SqlDataReader d = cmd.ExecuteReader() ) {
				d.Read();
				logonError = d.GetInt32( 0 );
			}
			cmd.Dispose();
			if( logonError != -1 ) {
				j.Add( "error", 0 );
				j.Add( "description", "Logon successful" );
				if( cn == null ) {
					session.Refresh( false );
				} else {
					session.Refresh( false, cn, trns );
				}
				string _msg = String.Format( "logon success > user:{0}, ip:{1}, sessionId:{2}.",
				session.UserId, session.Ip, session.Id );
				_msg.Debug( 5 );
				if( args.ContainsKey( "showSessionData" ) ) {
					if( Convert.ToBoolean( args[ "showSessionData" ] ) ) {
						j.Add( "session", session );
					}
				}
				if( args.ContainsKey( "showUserData" ) ) {
					if( Convert.ToBoolean( args[ "showUserData" ] ) ) {
						j.Add( "user", session.User );
					}
				}
			} else {
				string _msg = String.Format( "logon failure > user:{0}, ip:{1}, sessionId:{2}.",
				session.UserId, session.Ip, session.Id );
				_msg.Debug( 5 );
				/* Logon error -2 incorrect password */
				j.Add( "error", -20 );
				j.Add( "description", "incorrect name/password" );
			}

			return j;
		}
		/// <summary>
		/// Logs off the specified session id.
		/// </summary>
		/// <param name="sessionId">The session id.</param>
		/// <returns></returns>
		public int LogOff( string sessionId ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			j.Add( "sessionId", sessionId );
			Dictionary<string, object> r = LogOff( j );
			return ( int )r[ "error" ];
		}
		/// <summary>
		/// Logs off the specified session.
		/// </summary>
		/// <param name="session">The session.</param>
		/// <returns></returns>
		public int LogOff(Session session){
			Dictionary<string, object> j = new Dictionary<string, object>();
			j.Add("sessionId",session.Id.ToString());
			Dictionary<string, object> r = LogOff(j);
			return (int)r["error"];
		}
		/// <summary>
		/// logs the current session off
		/// </summary>
		/// <returns>{error:0,desc:""}.</returns>
		public static Dictionary<string, object> LogOff( Dictionary<string, object> args ) {
			/* user is trying to log off */
			Dictionary<string, object> j = new Dictionary<string, object>();
			Session session = null;
			if( args.ContainsKey( "sessionId" ) ) {
				session = new Session( Main.Site, new Guid( ( string )args[ "sessionId" ] ) );
			} else {
				session = Main.GetCurrentSession();
			}
			( "REQUEST:Log off" ).Debug( 9 );
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand("dbo.logoff @sessionId", cn)) {
                    cmd.Parameters.Add("@sessionId", SqlDbType.UniqueIdentifier).Value = new Guid(session.Id.ToString());
                    cmd.ExecuteNonQuery();
                }
            }
			Main.GetCurrentSession().Refresh( false );
			j.Add( "error", 0 );
			j.Add( "description", "Logoff successful" );
			return j;
		}
		/// <summary>
		/// log a session onto an account without using a password
		/// </summary>
		/// <param name="userId">The user id.</param>
		/// <param name="sessionId">The session id.</param>
		/// <returns></returns>
		public static bool LogOn( int userId, Guid sessionId ) {
			return LogOn( userId, sessionId, null, null );
		}
		/// <summary>
		/// log a session onto an account without using a password
		/// </summary>
		/// <param name="userId">The user id.</param>
		/// <param name="session">The session.</param>
		/// <returns></returns>
		public static bool LogOn( int userId, Session session ) {
			return LogOn( userId, session.Id, null, null );
		}
		/// <summary>
		/// log a session onto an account without using a password
		/// </summary>
		/// <param name="userId">The user id.</param>
		/// <param name="session">The session.</param>
		/// <param name="cn">The sql connection.</param>
		/// <param name="trns">The sql transaction.</param>
		/// <returns></returns>
		public static bool LogOn( int userId, Session session, SqlConnection cn, SqlTransaction trns ) {
			return LogOn( userId, session.Id, cn, trns );
		}
		/// <summary>
		/// log a sessionId (session cookie string) onto an account without using a password
		/// </summary>
		/// <param name="userId">The user id.</param>
		/// <param name="sessionId">The session id.</param>
		/// <param name="cn">The sql connection.</param>
		/// <param name="trns">The sql transaction.</param>
		/// <returns></returns>
		public static bool LogOn( int userId, Guid sessionId, SqlConnection cn, SqlTransaction trns ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			j.Add( "userId", userId.ToString() );
			j.Add( "hostSessionId", Guid.Empty.ToString() );
			j.Add( "sessionId", sessionId.ToString() );
			Dictionary<string, object> f = new Dictionary<string, object>();
			f = LogOn( j, cn, trns );
			if( ( int )f[ "error" ] != 0 ) {
				return false;
			}
			return true;
		}
		/// <summary>
		/// Creates an account and returns the new userId and error state
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns>{success:true,userId:userId}.</returns>
		public static Dictionary<string, object> CreateAccount( Dictionary<string, object> args ) {
			( "FUNCTION /w SP createAccount" ).Debug( 10 );
			/*user is trying to create an account */
			Dictionary<string, object> j = new Dictionary<string, object>();
			Session session = null;
			string password = "";
			int userId = -1;
			if( args.ContainsKey( "sessionId" ) ) {
				session = new Session( Main.Site, new Guid( ( string )args[ "sessionId" ] ) );
			} else {
				session = Main.GetCurrentSession();
			}
			if( args.ContainsKey( "logon" ) ) {
				userId = Convert.ToInt32( args[ "logon" ] );
			}
			if( args.ContainsKey( "password" ) ) {
				password = GetHash( args[ "password" ] );
			}
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand("dbo.logon @email,@password,@sessionid,@createaccount,@unique_siteID,@userId,@referenceSessionId", cn)) {
                    cmd.Parameters.Add("@email", SqlDbType.VarChar).Value = Convert.ToString(args["email"]);
                    cmd.Parameters.Add("@password", SqlDbType.VarChar).Value = password;
                    cmd.Parameters.Add("@sessionid", SqlDbType.UniqueIdentifier).Value = new Guid(session.Id.ToString());
                    cmd.Parameters.Add("@createaccount", SqlDbType.Bit).Value = true;
                    cmd.Parameters.Add("@unique_siteID", SqlDbType.UniqueIdentifier).Value = new Guid(Site.Id);
                    cmd.Parameters.Add("@userId", SqlDbType.Int).Value = userId;
                    if(System.Web.HttpContext.Current != null) {
                        cmd.Parameters.Add("@referenceSessionId", SqlDbType.UniqueIdentifier).Value = new Guid(Main.GetCurrentSession().Id.ToString());
                    } else {
                        cmd.Parameters.Add("@referenceSessionId", SqlDbType.UniqueIdentifier).Value = Guid.Empty;
                    }
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        d.Read();
                        if(d.GetInt32(0) == -1) {
                            /* Logon error -1 account already exists */
                            j.Add("error", -10);
                            j.Add("description", "Account already exists");
                            return j;
                        } else {
                            /* user logged on - new information is avaliable to the session - requery the session */
                            int newUserId = d.GetInt32(0);
                            j.Add("error", 0);
                            j.Add("description", "Create account successful");
                            j.Add("userId", newUserId);
                            /* ... becuase an account was created the local cache must be refreshed */
                            Commerce.RefreshUserById(newUserId);
                            if(System.Web.HttpContext.Current != null) {
                                Main.GetCurrentSession().Refresh(false);/* don't reprocess requests */
                            }
                            if(args.ContainsKey("showSessionData")) {
                                if(Convert.ToBoolean(args["showSessionData"])) {
                                    j.Add("session", session);
                                }
                            }
                            if(args.ContainsKey("showUserData")) {
                                if(Convert.ToBoolean(args["showUserData"])) {
                                    j.Add("user", session.User);
                                }
                            }
                        }
                    }
                }
            }
			return j;
		}
	}
}
