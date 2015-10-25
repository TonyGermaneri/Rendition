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
using System.Configuration;
using System.Web;
using System.Threading;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Data;
using System.IO;
using System.Text;
using Microsoft.SqlServer.Server;
namespace Rendition {
	/// <summary>
	/// Rendition.Commerce
	/// 
	/// This class contains static methods used indirectly by the JSON responder and adminResponder
	/// and internally by other methods.
	/// 
	/// The classes Rendition.merchant and Rendition.Admin use System.Reflection to expose
	/// Their static methods to the JSON responder and adminResponder and wrap some of the
	/// methods in this class.  Class Rendition.Admin contains all the dangerous CRUD methods
	/// that should only be avaliable to administrators while Rendition.merchant contains only methods
	/// that should be avaliable to anonomyous internet users.  
	/// 
	/// Rendition.Commerce (this class) contains methods that 
	/// both Rendition.Admin and Rendition.merchant wrap to 
    /// make these methods accessable to the reflection methods
    /// used in the JSON response mapper JSONToMethod
	/// </summary>
	public static partial class Commerce {
        #region User
        /// <summary>
        /// Refreshes users data in the site cache.
        /// </summary>
        /// <param name="userId">The userId.</param>
        public static void RefreshUserById(int userId) {
            Users.RefreshUserById(userId);
        }
        #endregion
        #region Site
        /// <summary>
        /// Refreshes the site data using another thread.
        /// </summary>
        public static void RefreshSiteDataThreaded() {
            Thread t = new Thread(new ThreadStart(delegate() {
                Site.RefreshSiteData(Main.Site);
            }));
            t.Name = "refresh_site_cache";
            t.Start();
        }
        /// <summary>
        /// Refreshes the site data.
        /// </summary>
        public static void RefreshSiteData() {
            Site.RefreshSiteData(Main.Site);
        }
        #endregion
        #region Email
        /// <summary>
        /// Emails information about this order using the createemail event handler.
        /// </summary>
        /// <param name="order">The order.</param>
        /// <param name="cn">The cn.</param>
        /// <param name="trans">The trans.</param>
        /// <returns>
        /// {error:0,desc:"error description"}.
        /// </returns>
        public static Dictionary<string, object> PlacedOrderEmail(Commerce.Order order,
        SqlConnection cn, SqlTransaction trans) {
            User user = Main.Site.Users.List.Find(delegate(Commerce.User u) {
                return u.UserId == order.UserId;
            });
            CreateEmailEventArgs emailArgs =
                new CreateEmailEventArgs("orderConfirm", Main.Site.site_operator_email, user.Email,
                Main.Site.site_log_email, user, Main.GetCurrentSession(), order, null, "", null);
            DefaultEmails.OrderConfirm(ref emailArgs);
            Main.Site.raiseOnCreateEmail(emailArgs);
            return SendEmailArgResult(emailArgs, cn, trans);
        }
        /// <summary>
        /// Emails the user a copy of their password using the createemail event handler.
        /// </summary>
        /// <param name="args">Dictionary containg the userId.</param>
        /// <returns>{error:0,desc:"error description"}.</returns>
        public static Dictionary<string, object> LostPasswordEmail(Dictionary<string, object> args) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            if(args.ContainsKey("userId")) {
                j.Add("error", -1);
                j.Add("description", "Missing key userId.  Cannot send lost password email");
                return j;
            }
            int userId = (int)args["userId"];
            User user = Main.Site.Users.List.Find(delegate(Commerce.User u) {
                return u.UserId == userId;
            });
            CreateEmailEventArgs emailArgs =
                new CreateEmailEventArgs("lostPassword", Main.Site.site_operator_email, user.Email,
                Main.Site.site_log_email, user, Main.GetCurrentSession(), null, null, "", null);
            DefaultEmails.LostPassword(ref emailArgs);
            Main.Site.raiseOnCreateEmail(emailArgs);
            Dictionary<string, object> f;
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                f = SendEmailArgResult(emailArgs, cn, null);
            }
            return f;
        }
        /// <summary>
        /// Emails the user a shipment update containing all the information about their shipment.
        /// </summary>
        /// <param name="order">The order.</param>
        /// <param name="args">Dictionary containing the shipmentId.</param>
        /// <returns>{error:0,desc:"error description"}.</returns>
        public static Dictionary<string, object> ShipmentUpdateEmail(Commerce.Order order, ShipmentUpdateArgs args) {
            CreateEmailEventArgs emailArgs =
                new CreateEmailEventArgs("shipmentUpdate", Main.Site.site_operator_email, order.User.Email,
                Main.Site.site_log_email, order.User, null, order, null, "", args);
            DefaultEmails.ShipConfirm(ref emailArgs);
            Main.Site.raiseOnCreateEmail(emailArgs);
            Dictionary<string, object> f;
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                f = SendEmailArgResult(emailArgs, cn, null);
            }
            return f;
        }
        /// <summary>
        /// Used internally by other methods to clear the createemail event.
        /// </summary>
        /// <param name="emailArgs">The <see cref="Rendition.CreateEmailEventArgs"/> instance containing the event data.</param>
        /// <param name="cn">The cn.</param>
        /// <param name="trans">The trans.</param>
        /// <returns>
        /// {error:0,desc:"error description"}.
        /// </returns>
        public static Dictionary<string, object> SendEmailArgResult(CreateEmailEventArgs emailArgs,
        SqlConnection cn, SqlTransaction trans) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            if(!emailArgs.AbortEmail) {
                SendEmail(emailArgs.MessageBody, emailArgs.Subject,
                emailArgs.MailTo, emailArgs.MailFrom, emailArgs.BCC, cn, trans);
                j.Add("error", 0);
                j.Add("description", "");
            } else {
                j.Add("error", -1);
                j.Add("description", "Email aborted by createemail event handler");
            }
            return j;
        }
        /// <summary>
        /// Renders an email using the information provided in args.
        /// </summary>
        /// <param name="pathToEmail">The path to email source code (e.g.: ~/plugins/email/someEmail.cs).</param>
        /// <param name="args">The <see cref="Rendition.CreateEmailEventArgs"/> instance containing the event data.</param>
        /// <returns>{error:0,desc:"error description",message:"extended error info"}.</returns>
        public static Dictionary<string, object> RenderEmail(string pathToEmail, CreateEmailEventArgs args) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            List<object> errors = new List<object>();
            string ext = Path.GetExtension(pathToEmail);
            pathToEmail = Rendition.Utilities.VirtualToPhysicalSitePath(pathToEmail);
            if(!File.Exists(pathToEmail)) {
                j.Add("error", -2);
                j.Add("description", "File does not exist.");
                return j;
            }
            string language = "";
            string sourceCode = File.ReadAllText(pathToEmail);
            if(ext == ".cs") {
                language = "CSharp";
                object email = null;
                try {
                    object[] eventArgs = { args };
                    email = Admin.ExecuteScript(sourceCode, language, "email", "sendMail", ref eventArgs, ref errors);
                } catch(Exception e) {
                    j.Add("error", -5);
                    j.Add("description", e.Message);
                    return j;
                }
                if(errors.Count > 0) {
                    j.Add("error", -3);
                    j.Add("description", "One or more errors occured while compling the email script.");
                    j.Add("errors", errors);
                    return j;
                }
                if(email == null) {
                    j.Add("error", -6);
                    j.Add("description", "An unknown error occured while trying to render your email source code.");
                    return j;
                }
                if(email.GetType() == typeof(Dictionary<string, object>)) {
                    j.Add("error", 0);
                    j.Add("description", "");
                    j.Add("message", ((Dictionary<string, object>)email)["message"].ToString());
                    j.Add("subject", ((Dictionary<string, object>)email)["subject"].ToString());
                    return j;
                } else if(email.GetType() == typeof(string)) {
                    j.Add("error", 0);
                    j.Add("description", "");
                    j.Add("message", email.ToString());
                    return j;
                }
            } else if(ext == ".html" || ext == ".htm") {
                j.Add("error", 0);
                j.Add("description", "");
                j.Add("message", sourceCode);
                return j;
            }
            j.Add("error", -4);
            j.Add("description", "Unable to detect the type of source code for the input file (ext:" + ext +
            ").  Acceptable types are .cs (CSharp), .html or .htm.");
            return j;
        }
        /// <summary>
        /// Queue email.  This method is used by other methods to enter email into the database queue for clearing.
        /// </summary>
        /// <param name="emailMessage">The email message.</param>
        /// <param name="emailSubject">The email subject.</param>
        /// <param name="sendTo">The send to.</param>
        /// <param name="sendFrom">The send from.</param>
        /// <param name="bcc">The BCC.</param>
        public static void SendEmail(string emailMessage, string emailSubject, string sendTo, string sendFrom, string bcc) {
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                SendEmail(emailMessage, emailSubject, sendTo, sendFrom, bcc, cn, null);
            }
        }
        /// <summary>
        /// Base queue email method.  This method is used by other methods to enter email into the database queue for clearing.
        /// </summary>
        /// <param name="emailMessage">The email message.</param>
        /// <param name="emailSubject">The email subject.</param>
        /// <param name="sendTo">The send to.</param>
        /// <param name="sendFrom">The send from.</param>
        /// <param name="bcc">The BCC.</param>
        /// <param name="cn">The SQL connection to use.</param>
        /// <param name="trans">The SQL transaction to use.</param>
        public static void SendEmail(string emailMessage, string emailSubject, string sendTo, string sendFrom, string bcc,
        SqlConnection cn, SqlTransaction trans) {
            using(SqlCommand cmd = new SqlCommand(@"insert into emails 
			select newId() as emailId, '' as textBody, @body as HTMLBody, @mailTo as mailTo, @mailFrom as mailFrom, 
			@mailFrom as sender, @subject as subject, @bcc as bcc,
			'1/1/1900 00:00:00.000' as messageSentOn, getDate() as addedOn,
			'' as errorDesc, 0 as errorId, null as VerCol ", cn, trans)) {
                cmd.Parameters.Add("@body", SqlDbType.VarChar).Value = emailMessage;
                cmd.Parameters.Add("@subject", SqlDbType.VarChar).Value = emailSubject;
                cmd.Parameters.Add("@mailTo", SqlDbType.VarChar).Value = sendTo;
                cmd.Parameters.Add("@mailFrom", SqlDbType.VarChar).Value = sendFrom;
                cmd.Parameters.Add("@bcc", SqlDbType.VarChar).Value = bcc;
                cmd.ExecuteNonQuery();
            }
        }
        #endregion
        #region Flag
        /// <summary>
        /// Adds the flag.  Wrapper for addFlagWithTransaction.
        /// </summary>
        /// <param name="_flagType">Type of the _flag.</param>
        /// <param name="objectType">Type of the object.</param>
        /// <param name="objectId">The object id.</param>
        /// <param name="comments">The comments.</param>
        /// <returns>{error:0,desc:""}</returns>
        public static Dictionary<string, object> AddFlag(string _flagType, string objectType,
        string objectId, string comments) {
            return AddFlagWithTransaction(_flagType, objectType, objectId, comments, null, null);
        }
        /// <summary>
        /// Inserts the flag history.
        /// </summary>
        /// <param name="columnName">Name of the column.</param>
        /// <param name="newId">The new id.</param>
        /// <param name="objectId">The object id.</param>
        /// <param name="flagType">Type of the flag.</param>
        /// <param name="comments">The comments.</param>
        /// <param name="cn">SQL connection.</param>
        /// <param name="flagTransaction">SQL transaction.</param>
        private static void InsertFlagHistoryListItem(string columnName, string newId, string objectId,
        int flagType, string comments, SqlConnection cn, SqlTransaction flagTransaction) {
            ("FUNCTION /w ADHOC insertFlagHistoryListItem").Debug(10);
            int userId = Main.Site.NullUser.UserId;
            if(HttpContext.Current != null) {
                Session session = Main.GetCurrentSession();
                if(session != null) {
                    userId = session.UserId;
                }
            }
            /* add to the flag history list */
            SqlCommand cmd = new SqlCommand(@"insert into objectFlags (flagId," + columnName + @",flagType,comments,userId,addTime,VerCol)
				values (@newId,@objectId,@flagType,@comments,@userId,getDate(),null)", cn, flagTransaction);
            cmd.Parameters.Add("@objectId", SqlDbType.Int).Value = Convert.ToInt32(objectId);
            cmd.Parameters.Add("@userId", SqlDbType.Int).Value = userId;
            cmd.Parameters.Add("@flagType", SqlDbType.Int).Value = Convert.ToInt32(flagType);
            cmd.Parameters.Add("@comments", SqlDbType.VarChar).Value = comments;
            cmd.Parameters.Add("@newId", SqlDbType.UniqueIdentifier).Value = new Guid(newId.ToString());
            cmd.ExecuteNonQuery();
            cmd.Dispose();
            return;
        }
        /// <summary>
        /// Adds a flag with transaction.  This is the only proper way to add a flag (aka change status).
        /// </summary>
        /// <param name="_flagType">Type of the flag.</param>
        /// <param name="objectType">Type of the object: line, shipment, order.</param>
        /// <param name="objectId">The object id.</param>
        /// <param name="comments">The comments.</param>
        /// <param name="fcn">SQL connection.</param>
        /// <param name="flagTransaction">SQL transaction.</param>
        /// <returns>{error:0,desc:""}</returns>
        public static Dictionary<string, object> AddFlagWithTransaction(string _flagType, string objectType,
        string objectId, string comments, SqlConnection fcn, SqlTransaction flagTransaction) {
            ("FUNCTION /w SP,CN,TRANS,ADHOC insertFlagHistoryListItem").Debug(10);
            int tryParseResult = 0;
            Dictionary<string, object> j = new Dictionary<string, object>();
            if(!int.TryParse(objectId, out tryParseResult)) {
                j.Add("description", "objectId is not in the correct format, must be an int.");
                j.Add("error", 2);
                return j;
            }
            int flagType = Convert.ToInt32(_flagType);
            int error = 0;
            string desc = "";
            int previousFlagStatus = 0;
            Guid previousFlagId = Guid.Empty;
            /* make a new connection */
            SqlConnection cn;
            if(fcn == null) {
                cn = Site.CreateConnection(true, true);
                cn.Open();
                flagTransaction = cn.BeginTransaction("Change flag status");
            } else {
                cn = fcn;
            }
            try {
                SqlCommand cmd;
                string columnName = "";
                Guid newId = Guid.NewGuid();
                if(objectType == "line") {
                    columnName = "serialId";
                } else if(objectType == "shipment") {
                    columnName = "shipmentId";
                } else if(objectType == "order") {
                    columnName = "orderId";
                } else {
                    j.Add("description", "arguement object type must be order,shipment,line");
                    j.Add("error", 2);
                    return j;
                }
                if(flagType == 0) {
                    /* this is a comment so just insert it into the history list and don't trigger TR_LINE_DEPLETE_INVENTORY */
                    InsertFlagHistoryListItem(columnName, newId.ToString(), objectId, flagType, comments, cn, flagTransaction);
                    if(fcn == null) {
                        flagTransaction.Commit();
                    }
                    j.Add("description", "");
                    j.Add("error", 0);
                    return j;
                }
                if(objectType == "line") {
                    cmd = new SqlCommand(@"select lastFlagStatus, lastFlagId, lastErrorId
						from serial_line
						where serialId = @serialId;

						update serial_line set 
						lastFlagId = @newId,
						lastFlagStatus = @flagType
						where serialId = @serialId", cn, flagTransaction);
                    cmd.Parameters.Add("@serialId", SqlDbType.Int).Value = Convert.ToInt32(objectId);
                    cmd.Parameters.Add("@flagType", SqlDbType.Int).Value = Convert.ToInt32(flagType);
                    cmd.Parameters.Add("@newId", SqlDbType.UniqueIdentifier).Value = new Guid(newId.ToString());
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        if(d.HasRows) {
                            d.Read();
                            previousFlagStatus = d.GetInt32(0);
                            previousFlagId = d.GetGuid(1);
                        }
                    }
                    cmd.Dispose();
                } else if(objectType == "shipment") {
                    cmd = new SqlCommand(@"select lastFlagStatus, lastFlagId, lastErrorId
						from serial_shipment
						where shipmentId = @shipmentId;

						update serial_line set 
						lastFlagId = @newId,
						lastFlagStatus = @flagType
						where serialId in (
							select serialId
							from cart
							where shipmentId = @shipmentId
						);", cn, flagTransaction);
                    cmd.Parameters.Add("@shipmentId", SqlDbType.Int).Value = Convert.ToInt32(objectId);
                    cmd.Parameters.Add("@flagType", SqlDbType.Int).Value = Convert.ToInt32(flagType);
                    cmd.Parameters.Add("@newId", SqlDbType.UniqueIdentifier).Value = new Guid(newId.ToString());
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        if(d.HasRows) {
                            d.Read();
                            previousFlagStatus = d.GetInt32(0);
                            previousFlagId = d.GetGuid(1);
                        }
                    }
                    cmd.Dispose();
                } else if(objectType == "order") {
                    /* ensure input is an INT*/
                    cmd = new SqlCommand(@"select lastFlagStatus, lastFlagId
						from serial_order
						where orderId = @orderId;

						update serial_line set 
						lastFlagId = @newId,
						lastFlagStatus = @flagType
						where serialId in (
							select serialId
							from cart
							where orderId = @orderId
						);", cn, flagTransaction);
                    cmd.Parameters.Add("@orderId", SqlDbType.Int).Value = Convert.ToInt32(objectId);
                    cmd.Parameters.Add("@flagType", SqlDbType.Int).Value = Convert.ToInt32(flagType);
                    cmd.Parameters.Add("@newId", SqlDbType.UniqueIdentifier).Value = new Guid(newId.ToString());
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        if(d.HasRows) {
                            d.Read();
                            previousFlagStatus = d.GetInt32(0);
                            previousFlagId = d.GetGuid(1);
                        }
                    }
                    cmd.Dispose();
                }
                /*if the row could not be updated then the status was not acceptable to the inventory triggers*/
                cmd = new SqlCommand("select 0 from serial_line where lastFlagId = @newId", cn, flagTransaction);
                cmd.Parameters.Add("@newId", SqlDbType.UniqueIdentifier).Value = new Guid(newId.ToString());
                using(SqlDataReader d = cmd.ExecuteReader()) {
                    if(!d.HasRows) {
                        error = 1;
                        desc = "";
                    }
                }
                cmd.Dispose();
                if(error == 0) {
                    /* update other tables in the serial hierarchy else */
                    if(objectType == "shipment") {
                        cmd = new SqlCommand(@"update serial_shipment set
							lastFlagId = @newId,
							lastFlagStatus = @flagType
							where shipmentId = @shipmentId", cn, flagTransaction);
                        cmd.Parameters.Add("@shipmentId", SqlDbType.Int).Value = Convert.ToInt32(objectId);
                        cmd.Parameters.Add("@flagType", SqlDbType.Int).Value = Convert.ToInt32(flagType);
                        cmd.Parameters.Add("@newId", SqlDbType.UniqueIdentifier).Value = new Guid(newId.ToString());
                        cmd.ExecuteNonQuery();
                        cmd.Dispose();
                    } else if(objectType == "order") {
                        cmd = new SqlCommand(@"update serial_shipment set
							lastFlagId = @newId,
							lastFlagStatus = @flagType
							where shipmentId in (
								select shipmentId
								from cart
								where orderid = @orderId
							);

							update serial_order set
							lastFlagId = @newId,
							lastFlagStatus = @flagType
							where orderId = @orderId;", cn, flagTransaction);
                        cmd.Parameters.Add("@orderId", SqlDbType.Int).Value = Convert.ToInt32(objectId);
                        cmd.Parameters.Add("@flagType", SqlDbType.Int).Value = Convert.ToInt32(flagType);
                        cmd.Parameters.Add("@newId", SqlDbType.UniqueIdentifier).Value = new Guid(newId.ToString());
                        cmd.ExecuteNonQuery();
                        cmd.Dispose();
                    }
                    /* add to the flag history list */
                    InsertFlagHistoryListItem(columnName, newId.ToString(), objectId, flagType, comments, cn, flagTransaction);
                    StatusChangeEventArgs e = new StatusChangeEventArgs(objectType, objectId, previousFlagStatus, flagType, previousFlagId, newId, cn, flagTransaction);
                    Main.Site.raiseOnStatusChange(e);
                    if(Site.AbortDefaultEvent == true) {
                        Site.AbortDefaultEvent = false;
                    } else {
                        if(fcn == null) {
                            flagTransaction.Commit();
                        }
                    }
                } else {
                    using(cmd = new SqlCommand(@"select top 1 lastErrorId
							from serial_line
							where serialId in (select serialId from cart where " + columnName + " = @objectId)", cn, flagTransaction)) {
                        cmd.Parameters.Add("@objectId", SqlDbType.Int).Value = Convert.ToInt32(objectId);
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            if(d.HasRows) {
                                d.Read();
                                error = d.GetInt32(0);
                                desc = "ERROR:" + error.ToString() + " -> UNKNOWN SERIAL_LINE.TR_LINE_DEPLETE_INVENTORY ERROR";
                                switch(error) {
                                    case 1: desc = "One or more of the items in your order is out of stock and cannot be changed to this status"; break;
                                    case 2: desc = "This order has been closed and cannot be modified."; break;
                                    case 3: desc = "This order has already passed though a status that makes it so you cannot change it to the status you selected."; break;
                                    case 4: desc = "This order cannot be changed to the status you selected until it has passed though another status."; break;
                                    case 5: desc = "This order is already in the status you selected."; break;
                                    case 6: desc = "orders are not allowed to change once they are canceled."; break;
                                    case 7: desc = "orders are not allowed to change once they are closed."; break;
                                    case 8: desc = "error during recalculation when canceling an order."; break;
                                }
                                Exception e = new Exception(desc);
                                throw e;
                            } else {
                                Exception e = new Exception("Missing serial_line PK - terminal error.  Possible database corruption.");
                                throw e;
                            }
                        }

                    }

                }
                j.Add("flagId", newId);
                j.Add("flagType", flagType);
                j.Add("description", desc);
                j.Add("error", error);
            } catch(Exception e) {
                if(fcn == null) {
                    flagTransaction.Rollback();
                }
                j.Add("description", e.Message);
                j.Add("error", -1);
            }
            if(fcn == null) {
                /* don't close the foreign connection */
                cn.Dispose();
            }
            return j;
        }
        #endregion
    }
}
