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
using System.Web;
using System.Data;
using System.Data.SqlClient;
using System.Threading;
using System.ComponentModel;
using System.Net.Mail;
using System.Xml;
namespace Rendition {
    internal partial class Main : IHttpModule {
        /// <summary>
        /// Starts the shipment update queue.
        /// </summary>
        internal static void startShipmentUpdateQueue() {
            shipmentUpdateQueue = new Admin.Timer();
            shipmentUpdateQueue.Interval = 30000;
            shipmentUpdateQueue.Name = "Shipment Update Queue";
            shipmentUpdateQueue.elapsed += new EventHandler(emptyShipmentQueue);
            shipmentUpdateQueue.AutoReset = false;
            shipmentUpdateQueue.Start();
        }
        /// <summary>
        /// Starts database connection checking.
        /// </summary>
        internal static void startConnectionChecking() {
            connectionChecker = new Admin.Timer();
            connectionChecker.Interval = 30000;
            connectionChecker.elapsed += new EventHandler(connectionChecker_elapsed);
            connectionChecker.Start();
            connectionChecker.Name = "Database Connection Checker/Reconnector";
            connectionChecker.AutoReset = false;
        }
        /// <summary>
        /// Starts the email queue.
        /// </summary>
        internal static void startEmailQueue() {
            emailQueue = new Admin.Timer();
            emailQueue.Interval = 30000;
            emailQueue.Name = "Email Queue";
            emailQueue.elapsed += new EventHandler(emptyEmailQueue);
            emailQueue.AutoReset = false;
            emailQueue.Start();
        }
        /// <summary>
        /// Empties the email queue.
        /// </summary>
        /// <param name="sender">The sender.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private static void emptyEmailQueue(object sender, EventArgs e) {
            SqlTransaction trans = null;
            SqlConnection cn = null;
            List<Guid> sentEmails = new List<Guid>();
            try {
                cn = Site.CreateConnection(true, true);
                cn.Open();
                trans = cn.BeginTransaction("email_transaction");
                int newChecksum = -1;
                using(SqlCommand cmd = new SqlCommand(@"/* email queue check */
				select SUM(convert(int,VerCol)) from emails with (nolock) 
				where messageSentOn = '1/1/1900 00:00:00.000' and isNumeric(mailTo) = 0;", cn, trans)) {
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        if(r.HasRows) {
                            while(r.Read()) {
                                try {
                                    /* 
                                     * HACK: this process can fail with:
                                     * "Index was out of range. Must be non-negative and less than the size of the collection."
                                     * and I don't know why.   The query can return a single NULL column, and I'm obviously
                                     * checking for that, and it _always_ returns a single column so reading index 0 should be ok.
                                     * It's not */
                                    if(r.GetValue(0).GetType() != typeof(System.DBNull)) {
                                        newChecksum = r.GetInt32(0);
                                    }
                                } catch { }
                            }
                        }
                    }
                }
                if(newChecksum != emailQueueTableChecksum && newChecksum != -1) {
                    emailQueueTableChecksum = newChecksum;
                    /* check for email to be sent */
                    using(SqlCommand cmd = new SqlCommand(@"/* email queue empty */
					select emailId, textBody, HTMLBody, mailTo, mailFrom, sender, subject, bcc
					from emails with (nolock) where messageSentOn = '1/1/1900 00:00:00.000' and isNumeric(mailTo) = 0;", cn, trans)) {
                        using(SqlDataReader r = cmd.ExecuteReader()) {
                            if(r.HasRows) {
                                while(r.Read()) {
                                    try {
                                        MailAddress from = new MailAddress(r.GetString(4));
                                        MailAddressCollection to = new MailAddressCollection();
                                        to.Add(new MailAddress(r.GetString(3)));
                                        string sbcc = r.GetString(7);
                                        MailAddressCollection bcc = new MailAddressCollection();
                                        if(sbcc.Trim().Length > 0) {
                                            bcc.Add(new MailAddress(sbcc));
                                        }
                                        EmailClient.SendMessage(from, to, null, bcc, r.GetString(5), r.GetString(2), r.GetString(1),
                                        true, emailSentCallback, r.GetGuid(0).ToString());
                                    } catch(Exception ex) {
                                        String.Format("Email queue exception error:{0}", ex.Message).Debug(1);
                                    }
                                    /* even if it doesn't work remove it from the queue */
                                    sentEmails.Add(r.GetGuid(0));
                                }
                            }
                        }
                    }
                    /* compile adhoc command */
                    StringBuilder b = new StringBuilder();
                    foreach(Guid id in sentEmails) {
                        b.Append("update emails set messageSentOn = getDate() where emailId = '" + id.ToString() + "';");
                    }
                    if(b.Length > 0) {
                        using(SqlCommand cmd = new SqlCommand(b.ToString(), cn, trans)) {
                            cmd.ExecuteNonQuery();
                        }
                    }
                }
                trans.Commit();
            } catch(Exception ex) {
                String.Format("emptyEmailQueue threw an exception ==>{0}", ex.Message).Debug(1);
                if(trans != null) {
                    trans.Rollback();
                }
            } finally {
                if(cn != null) {
                    cn.Close();
                }
                emailQueue.Start();
            }
        }
        /// <summary>
        /// Async email send callback.
        /// </summary>
        /// <param name="sender">The sender.</param>
        /// <param name="e">The <see cref="System.ComponentModel.AsyncCompletedEventArgs"/> instance containing the event data.</param>
        private static void emailSentCallback(object sender, AsyncCompletedEventArgs e) {
            String token = (string)e.UserState;/*unique ID for this async callback */
            int errorId = 0;
            string description = "";
            if(e.Cancelled) {
                description = "Email Canceled: " + e.Error.ToString();
                description.Debug(1);
                errorId = -1;
            }
            if(e.Error != null) {
                description = "Email Error occured: " + e.Error.ToString();
                description.Debug(1);
                errorId = -2;
            } else {
                description = "";
            }
            Guid emailId = new Guid(token);
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(@"update emails 
				set messageSentOn = getDate(), errorId = @errorId, errorDesc = @errorDesc where emailId = @emailId", cn)) {
                    cmd.Parameters.Add("@emailId", SqlDbType.UniqueIdentifier).Value = new Guid(emailId.ToString());
                    cmd.Parameters.Add("@errorId", SqlDbType.Int).Value = errorId;
                    cmd.Parameters.Add("@errorDesc", SqlDbType.VarChar).Value = description;
                    cmd.ExecuteReader();
                }
            }
        }
        /// <summary>
        /// Handles the elapsed event of the connectionChecker control.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        private static void connectionChecker_elapsed(object sender, EventArgs e) {
            try {
                if(Site.SqlConnection.State != ConnectionState.Open) {
                    /* if the connection is not open try and reconnect */
                    ("WARNING! Connection to the database was lost, trying to reconnect.  Retrying every 30 seconds").Debug(0);
                    Site.SqlConnection.Open();
                }
            } finally {
                connectionChecker.Start();
            }
        }
        /// <summary>
        /// Event handler for shipmentUpdateQueue
        /// </summary>
        private static void emptyShipmentQueue(object sender, EventArgs e) {
            SqlTransaction trans = null;
            SqlConnection cn = null;
            List<Guid> completeUpdates = new List<Guid>();
            try {
                cn = Site.CreateConnection(true, true);/* mars on */
                cn.Open();
                trans = cn.BeginTransaction(IsolationLevel.ReadUncommitted, "shipment_update_transaction");
                bool hasRows = false;
                using(SqlCommand cmd = new SqlCommand(@"/* shipment queue check */
					f", cn, trans)) {
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        if(r.HasRows) {
                            hasRows = true;
                        }
                    }
                }
                if(hasRows) {
                    /* check for shipment to be raised */
                    using(SqlCommand cmd = new SqlCommand(@"select addressUpdateId, shipmentNumber, tracking, dateShipped, 
					actualWeight, actualService, actualCost, actualBilledWeight, packageLength, packageWidth, 
					packageHeight, thirdPartyAccount, voidStatus, emailSent, addDate, VerCol
					from addressUpdate with (nolock) where emailSent is null and not shipmentNumber is null
                    and LEN(shipmentNumber) > 0;", cn, trans)) {
                        using(SqlDataReader r = cmd.ExecuteReader()) {
                            if(r.HasRows) {
                                while(r.Read()) {
                                    try {
                                        /* HACK: TEMPORARY: THIS IS NOT THE SHIPMENT NUMBER AS IT APPEARS TO BE IN DBO.ADDRESSUPDATE
                                         * This is a TEMPORARY fix for out of sequence shipment numbers
                                         * they are natually out of sequence but a few tools at www.claydesign.com
                                         * were written expecting them to be IN sequence incorrectly
                                         * once they fell out of sequence it was nessessary to create this patch
                                         * further patching will be in the order editor
                                         * */
                                        string orderNumber = r.GetValue(1).ToString();
                                        string trackingNumber = r.GetValue(2).ToString();
                                        Guid addressUpdateId = r.GetGuid(0);
                                        Commerce.Order order = Commerce.Order.GetOrderByOrderNumber(orderNumber, cn, trans);
                                        if(order != null) {
                                            /* THIS IS NOT THE SHIPMENT NUMBER */
                                            ShipmentUpdateArgs args = new ShipmentUpdateArgs(order, addressUpdateId,
                                            order.Shipments[0].ShipmentNumber, trackingNumber, r.GetValue(3).ToString(), r.GetValue(4).ToString(),
                                            r.GetValue(5).ToString(), r.GetValue(6).ToString(), r.GetValue(7).ToString(), r.GetValue(8).ToString(),
                                            r.GetValue(9).ToString(), r.GetValue(10).ToString(), r.GetValue(11).ToString(),
                                            r.GetValue(12).ToString(), r.GetValue(13).ToString());
                                            /* change the status of the order to shipped ? wasn't this done elsewhere? 
                                             * I hate it when I forget things, I should have made a note!
                                             * it appears that it _wasn't_ being done so... */
                                            Admin.AddFlag("11", "order", order.OrderId.ToString(), "Automatically added by shipping.");
                                            Site.raiseOnShipmentUpdate(args);
                                            if(!args.AbortDefaultEmail) {
                                                /* if they are retail or they have order.user.sendShipmentUpdates checked then send an email */
                                                if(order.User.SendShipmentUpdates || order.User.WholesaleDealer == false) {
                                                    Commerce.ShipmentUpdateEmail(order, args);
                                                }
                                            }
                                        } else {
                                            ("ERROR: No order associated with shipment number:" + orderNumber +
                                            ", tracking:" + trackingNumber + ", PK:" + addressUpdateId.ToString()).Debug(1);
                                        }
                                        completeUpdates.Add(addressUpdateId);
                                    } catch(Exception ex) {
                                        ("shipment queue exception error (Rendition.dll):" + ex.Message).Debug(1);
                                    }
                                }
                            }
                            /* compile adhoc command */
                            StringBuilder b = new StringBuilder();
                            foreach(Guid id in completeUpdates) {
                                b.Append("update addressUpdate set emailSent = getDate() where addressUpdateId = '" + id.ToString() + "';");
                            }
                            if(b.Length > 0) {
                                using(SqlCommand innerCmd = new SqlCommand(b.ToString(), cn, trans)) {
                                    innerCmd.ExecuteNonQuery();
                                }
                            }
                        }
                    }
                }
                trans.Commit();
            } catch(Exception ex) {
                String.Format("emptyShipmentQueue Threw an exception ==>{0}", ex.Message).Debug(0);
                if(trans != null) {
                    trans.Rollback();
                }
            } finally {
                if(cn != null) {
                    cn.Close();
                }
                shipmentUpdateQueue.Start();
            }
        }

    }
}
