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
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Linq;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Data;
using System.Web;
namespace Rendition {
    public partial class Commerce {
        public partial class Order {
            #region Private SQL Interact Static Method
            /// <summary>
            /// Execs the place order.
            /// </summary>
            /// <param name="sessionId">The session id.</param>
            /// <param name="userId">The user id.</param>
            /// <param name="paymentMethodId">The payment method id.</param>
            /// <param name="testMode">if set to <c>true</c> [test mode].</param>
            /// <param name="uniqueSiteId">The unique site id.</param>
            /// <param name="cartSessionId">The cart session id.</param>
            /// <param name="purchaseOrder">The purchase order.</param>
            /// <param name="orderDate">The order date.</param>
            /// <param name="termId">The term id.</param>
            /// <param name="discount">The discount.</param>
            /// <param name="cn">The connection being used.</param>
            /// <param name="trans">The transaction being used.</param>
            /// <returns>{error:0,desc:""}</returns>
            private static Dictionary<string, object> ExecPlaceOrder(Guid sessionId, int userId, Guid paymentMethodId,
                bool testMode, Guid uniqueSiteId, Guid cartSessionId, string purchaseOrder, DateTime orderDate,
                int termId, decimal discount, SqlConnection cn, SqlTransaction trans) {
                Dictionary<string, object> o = new Dictionary<string, object>();
                List<Guid> addressIds = new List<Guid>();
                List<Commerce.Address> addresses = new List<Commerce.Address>();
                Commerce.Address billToAddress;
                Commerce.Address shipToAddress;
                /* place order */
                SqlCommand cmd = new SqlCommand(@"dbo.placeOrder @sessionId,@userId,@paymentMethodId,@testMode,@unique_site_id,
			@cartSessionId,@purchaseOrder,@orderDate,@termId,@discountAmount", cn, trans);
                /* never timeout */
                cmd.CommandTimeout = 0;
                /* start transaction, if the payment method is not valid then rollback the order */
                cmd.Parameters.Add("@sessionId", SqlDbType.UniqueIdentifier).Value = new Guid(sessionId.ToString());
                cmd.Parameters.Add("@userId", SqlDbType.Int).Value = userId;
                cmd.Parameters.Add("@paymentMethodId", SqlDbType.UniqueIdentifier).Value = new Guid(paymentMethodId.ToString());
                cmd.Parameters.Add("@testMode", SqlDbType.Bit).Value = testMode;
                cmd.Parameters.Add("@unique_site_id", SqlDbType.UniqueIdentifier).Value = new Guid(Main.Site.Defaults.SiteId.ToString());
                cmd.Parameters.Add("@cartSessionId", SqlDbType.UniqueIdentifier).Value = new Guid(cartSessionId.ToString());
                cmd.Parameters.Add("@purchaseOrder", SqlDbType.VarChar).Value = purchaseOrder;
                cmd.Parameters.Add("@orderDate", SqlDbType.DateTime).Value = orderDate;
                cmd.Parameters.Add("@termId", SqlDbType.Int).Value = termId;
                cmd.Parameters.Add("@discountAmount", SqlDbType.Money).Value = discount;
                ("Execute SP [dbo].[placeOrder]").Debug(7);
                using(SqlDataReader raw = cmd.ExecuteReader()) {
                    raw.Read();
                    o.Add("error", raw.GetInt32(13));
                    o.Add("description", raw.GetString(14));
                    o.Add("userId", raw.GetInt32(19));
                    o.Add("sessionId", raw.GetGuid(20));
                    /* if an error occurs these values will not be avaliable (Null) (5=test mode)*/
                    if(raw.GetInt32(13) == 0 || raw.GetInt32(13) == 5) {
                        o.Add("billToAddressId", raw.GetGuid(0).ToString());
                        o.Add("paymentMethodId", raw.GetGuid(1).ToString());
                        o.Add("orderNumber", raw.GetString(2).ToString());
                        o.Add("subTotal", (float)raw.GetDecimal(3));
                        o.Add("grandTotal", (float)raw.GetDecimal(4));
                        o.Add("taxTotal", (float)raw.GetDecimal(5));
                        o.Add("estShipTotal", (float)raw.GetDecimal(6));
                        o.Add("discountTotal", (float)raw.GetDecimal(7));
                        o.Add("printState", raw.GetString(8));
                        o.Add("concatSerialNumbers", raw.GetString(9));
                        o.Add("concatShipmentNumbers", raw.GetString(10));
                        o.Add("concatSerialIds", raw.GetString(11));
                        o.Add("concatShipmentIds", raw.GetString(12));
                        o.Add("orderId", raw.GetInt32(15));
                        o.Add("discountPct", raw.GetDouble(16).ToString());
                        o.Add("discountCode", raw.GetString(17));
                        o.Add("termId", raw.GetInt32(18));
                        if(cartSessionId != Guid.Empty) {/* only do this during recalculations */
                            o.Add("previous_grandTotal", (float)raw.GetDecimal(21));
                            o.Add("previous_subTotal", (float)raw.GetDecimal(22));
                            o.Add("previous_taxTotal", (float)raw.GetDecimal(23));
                            o.Add("previous_shipTotal", (float)raw.GetDecimal(24));
                            o.Add("previous_discounted", (float)raw.GetDecimal(25));
                            o.Add("previous_sessionId", raw.GetGuid(26).ToString());
                            o.Add("difference", (float)raw.GetDecimal(4) - (float)raw.GetDecimal(21));
                            if(raw.NextResult()) {
                                /* the addtional records are all the addresses (addressId, shipmentId[-1 in the case of the billToAddressId])associated with the order */
                                while(raw.Read()) {
                                    /* add all the addresses to the in memory collection so we can process the credit card */
                                    addressIds.Add(raw.GetGuid(0));
                                }
                            }
                        }
                    }
                    raw.Close();
                }
                cmd.Dispose();
                if((int)o["error"] == 5 || (int)o["error"] == 0) {
                    if(cartSessionId != Guid.Empty) {/* only do this during recalculations */
                        if(addressIds.Count == 2) {
                            foreach(Guid id in addressIds) {
                                addresses.Add(new Commerce.Address(id, cn, trans));
                            }
                            billToAddress = addresses.First(delegate(Commerce.Address adr) {
                                return adr.Id == new Guid(o["billToAddressId"].ToString());
                            });
                            /* any one will do, all should be valid but we'll just check one at random - or whatever order it is C# checks in */
                            shipToAddress = addresses.First(delegate(Commerce.Address adr) {
                                return adr.Id != new Guid(o["billToAddressId"].ToString());
                            });
                            o.Add("billToAddress", billToAddress);
                            o.Add("shipToAddress", shipToAddress);
                        } else {
                            string msg = @"Calculation caused an internal error. 
						Bill to Address or ship to Address is missing.";
                            o["error"] = 104;
                            o["description"] = msg;
                            Exception ex = new Exception(msg);
                            throw ex;
                        }
                    }
                } else {
                    string msg = o["description"].ToString();
                    Exception ex = new Exception(msg);
                    throw ex;
                }
                return o;
            }
            #endregion
            #region Static Method Place Order Without Transaction
            /// <summary>
            /// Places an order once a cart has been filled with items.
            /// This method uses PlaceOrderWithTransaction with an internal transaction.
            /// </summary>
            /// <param name="args">JSON Object that can contain the following keys:
            /// sessionId
            /// userId
            /// nameOnCard
            /// cardType
            /// cardNumber
            /// expMonth
            /// expYear
            /// secNumber
            /// soldBy
            /// requisitionedBy
            /// parentOrderId
            /// deliverBy
            /// purchaseOrder
            /// manifestNumber
            /// vendorAccountNumber
            /// Fob
            /// scannedImage
            /// comments
            /// billToContactId
            /// billToFirstName
            /// billToLastName
            /// billToAddress1
            /// billToAddress2
            /// billToCity
            /// billToState
            /// billToZip
            /// billToCountry
            /// billToCompany
            /// billToEmail
            /// billToSendShipmentUpdates
            /// billToHomePhone
            /// billToWorkPhone
            /// billToSpecialInstructions
            /// billToEmailAds
            /// billToComments
            /// billToRateId
            /// shipToContactId
            /// shipToFirstName
            /// shipToLastName
            /// shipToAddress1
            /// shipToAddress2
            /// shipToCity
            /// shipToState
            /// shipToZip
            /// shipToCountry
            /// shipToCompany
            /// shipToEmail
            /// shipToSendShipmentUpdates
            /// shipToHomePhone
            /// shipToWorkPhone
            /// shipToSpecialInstructions
            /// shipToComments
            /// shipToEmailAds
            /// shipToRateId
            /// </param>
            /// <returns>{billToAddressId:Guid,paymentMethodId:Guid,orderNumber:string,subTotal:float,grandTotal:float,taxTotal:float,shipTotal:float,
            /// discounted:Guid,printState:string,concatSerialNumbers:string,concatShipmentNumbers:float,concatSerialIds:float,
            /// concatShipmentIds:Guid,error:Guid,errorDescription:string,orderId:float,discountPct:float,
            /// discountCode:Guid,termId:int,userId:int,approvedBy:int,scannedImage:string}.</returns>
            public static Dictionary<string, object> PlaceOrder(Dictionary<string, object> args) {
                return PlaceOrderWithTransaction(args, null, null);
            }
            #endregion
            #region Static Method Place Order With Transaction
            /// <summary>
            /// Places an order once a cart has been filled with items using the specified sessionId within a transaction.
            /// </summary>
            /// <param name="args">JSON Object that can contain the following keys (even if blank)
            /// sessionId
            /// userId
            /// nameOnCard
            /// cardType
            /// cardNumber
            /// expMonth
            /// expYear
            /// secNumber
            /// soldBy
            /// requisitionedBy
            /// parentOrderId
            /// deliverBy
            /// purchaseOrder
            /// manifestNumber
            /// vendorAccountNumber
            /// Fob
            /// scannedImage
            /// comments
            /// billToContactId
            /// billToFirstName
            /// billToLastName
            /// billToAddress1
            /// billToAddress2
            /// billToCity
            /// billToState
            /// billToZip
            /// billToCountry
            /// billToCompany
            /// billToEmail
            /// billToSendShipmentUpdates
            /// billToHomePhone
            /// billToWorkPhone
            /// billToSpecialInstructions
            /// billToEmailAds
            /// billToComments
            /// billToRateId
            /// shipToContactId
            /// shipToFirstName
            /// shipToLastName
            /// shipToAddress1
            /// shipToAddress2
            /// shipToCity
            /// shipToState
            /// shipToZip
            /// shipToCountry
            /// shipToCompany
            /// shipToEmail
            /// shipToSendShipmentUpdates
            /// shipToHomePhone
            /// shipToWorkPhone
            /// shipToSpecialInstructions
            /// shipToComments
            /// shipToEmailAds
            /// shipToRateId</param>
            /// <param name="fcn">The FCN.</param>
            /// <param name="trans">The transaction being used.</param>
            /// <returns>
            /// {billToAddressId:Guid,paymentMethodId:Guid,orderNumber:string,subTotal:float,grandTotal:float,taxTotal:float,shipTotal:float,
            /// discounted:Guid,printState:string,concatSerialNumbers:string,concatShipmentNumbers:float,concatSerialIds:float,
            /// concatShipmentIds:Guid,error:Guid,errorDescription:string,orderId:float,discountPct:float,
            /// discountCode:Guid,termId:int,userId:int,approvedBy:int,scannedImage:string}.
            /// </returns>
            public static Dictionary<string, object> PlaceOrderWithTransaction(Dictionary<string, object> args, SqlConnection fcn, SqlTransaction trans) {
                /* do not put debug statements before the transaction start */
                int requisitionedBy = -1;
                int approvedBy = -1;
                int soldBy = -1;
                int parentOrderId = -1;
                bool backorderMode = false;
                DateTime SQLMin = DateTime.Parse("1/1/1900 00:00:00.000");
                DateTime deliverBy = SQLMin;
                DateTime orderDate = SQLMin;
                string customOrderNumber = "";
                string vtDesc = "";
                Commerce.CreditCard card = null;
                Commerce.Cash cash = null;
                Commerce.Wire wire = null;
                // never used -> Commerce.PayPal PayPal = null;
                Commerce.Check check = null;
                Commerce.PromiseToPay promiseToPay = null;
                Dictionary<string, object> vt = null;
                Dictionary<string, object> o = new Dictionary<string, object>();
                /* last chance to reject before transaction starts */
                SqlConnection cn;
                if(fcn == null) {
                    /* create a seperate connection so we can control the transaction process (MARS will confict) */
                    cn = Site.CreateConnection(false, true);
                    cn.Open();
                } else {
                    cn = fcn;
                }
                string transSessionId = Guid.NewGuid().ToFileName();
                SqlCommand cmd;
                SqlTransaction orderTransaction;
                if(fcn == null) {
                    orderTransaction = cn.BeginTransaction(transSessionId);
                } else {
                    orderTransaction = trans;
                }
                /* debug statements OK after this */
                ("FUNCTION /w SP,CN,TRANS placeOrder").Debug(10);
                bool rollback = false;
                int termId = 0;
                /* check all keys to make sure the keys are present */
                string[] keys = {
			"userId","nameOnCard","cardType","cardNumber","expMonth","expYear","secNumber","soldBy",
			"requisitionedBy","parentOrderId","deliverBy","purchaseOrder","manifestNumber",
			"vendorAccountNumber","FOB","comments","billToContactId",
			"billToFirstName","billToLastName","billToAddress1","billToAddress2",
			"billToCity","billToState","billToZip","billToCountry","billToCompany",
			"billToEmail","billToSendShipmentUpdates","billToHomePhone","billToWorkPhone",
			"billToSpecialInstructions","billToEmailAds","billToComments","billToRateId",
			"shipToContactId","shipToFirstName","shipToLastName","shipToAddress1",
			"shipToAddress2","shipToCity","shipToState","shipToZip","shipToCountry",
			"shipToCompany","shipToEmail","shipToSendShipmentUpdates","shipToHomePhone",
			"shipToWorkPhone","shipToSpecialInstructions","shipToComments","shipToEmailAds",
			"shipToRateId","termId","approvedBy","scannedImage","orderDate",
			"eraseVisitorHistory","backorder"};
                string[] requiredKeys = { };
                Session session = null;
                if(args.ContainsKey("sessionId")) {
                    if(fcn == null) {
                        session = new Session(Main.Site, new Guid((string)args["sessionId"]));
                    } else {
                        session = new Session(Main.Site, new Guid((string)args["sessionId"]), cn, orderTransaction);
                    }
                } else {
                    session = Main.GetCurrentSession();
                }
                foreach(string keyName in requiredKeys) {
                    if(!args.ContainsKey(keyName)) {
                        string errMsg = "The key \"" + keyName + "\" is missing from the argument dictionary.  All required keys must be present.";
                        o.Add("error", -4010);
                        o.Add("description", errMsg);
                        Exception e = new Exception(errMsg);
                        e.Message.Debug(1);
                        throw e;
                    }
                }
                foreach(string keyName in keys) {
                    if(!args.ContainsKey(keyName)) {
                        args.Add(keyName, "");
                    }
                }
                /* gather bill to and ship to data, if any, from the request */
                Dictionary<string, object> btAddr = new Dictionary<string, object>();
                Dictionary<string, object> stAddr = new Dictionary<string, object>();
                foreach(KeyValuePair<string, object> field in args as Dictionary<string, object>) {
                    if(field.Key.StartsWith("shipTo")) {
                        stAddr.Add(field.Key.Replace("shipTo", ""), field.Value);
                    } else if(field.Key.StartsWith("billTo")) {
                        btAddr.Add(field.Key.Replace("billTo", ""), field.Value);
                    }
                }
                if(!(session.User.AccountType == 0 || session.User.AccountType == 1)) {
                    Exception e = new Exception(string.Format("Only users with account type 0 or 1 can place orders.  " +
                    "The account type of userId {0} is {1}.", session.UserId, session.User.AccountType));
                    e.Message.Debug(1);
                    throw e;
                }
                /* if the cart isn't populated, do that now */
                if(session.Cart.Items.Count == 0) {
                    session.Cart.Refresh(cn, orderTransaction);
                }
                if(session.Cart.Items.Count == 0) {
                    string _msg = String.Format("No items found in cart. UserId:{0}, SessionId:{1}", session.UserId, session.Id);
                    o.Add("error", -2016);
                    o.Add("description", "No items found in cart.");
                    rollback = true;
                    Exception e = new Exception(_msg);
                    e.Message.Debug(1);
                    throw e;
                }
                /* update the bill to and ship to addresses in the database 
                 * if the Address does not exist, validate it and insert it.
                 */
                if(stAddr.Count > 0) {
                    stAddr.Remove("ContactId");
                    stAddr.Add("contactId", session.Cart.Items[0].AddressId.ToString());
                    stAddr.Add("sessionId", session.Id.ToString());
                    stAddr.Add("userId", session.UserId.ToString());
                    Address.UpdateContactWithTransaction(stAddr, cn, orderTransaction);
                }
                if(btAddr.Count > 0) {
                    btAddr.Remove("ContactId");
                    btAddr.Add("contactId", session.Id.ToString());
                    btAddr.Add("sessionId", session.Id.ToString());
                    btAddr.Add("userId", session.UserId.ToString());
                    Address.UpdateContactWithTransaction(btAddr, cn, orderTransaction);
                }
                /* refresh again to reflect changes in the addresses */
                session.Cart.Refresh(cn, orderTransaction);
                Commerce.Address billToAddress = session.Cart.Addresses.Find(delegate(Commerce.Address adr) {
                    return adr.Id == session.Id;
                });
                Commerce.Address shipToAddress = session.Cart.Addresses.Find(delegate(Commerce.Address adr) {
                    return adr.Id != session.Id;
                });
                /* if there is no shipToAddress, or billToAddress then reject now */
                if(billToAddress == null) {
                    o.Add("error", -2001);
                    o.Add("description", "No bill to Address found for session.");
                    rollback = true;
                    string _msg = String.Format("No bill to Address found for session. UserId:{0}, SessionId:{1}",
                    session.UserId, session.Id);
                    Exception e = new Exception(_msg);
                    e.Message.Debug(1);
                    throw e;
                }
                if(shipToAddress == null) {
                    o.Add("error", -2002);
                    o.Add("description", "No ship to Address found for session.");
                    rollback = true;
                    string _msg = String.Format("No ship to Address found. UserId:{0}, SessionId:{1}",
                    session.UserId, session.Id);
                    Exception e = new Exception(_msg);
                    e.Message.Debug(1);
                    throw e;
                }
                ("Begin place order transaction >").Debug(7);
                PlaceOrderEventArgs ev = new PlaceOrderEventArgs(session.Cart, cn, orderTransaction, session, HttpContext.Current);
                Main.Site.raiseOnbeforeplaceorder(ev);
                try {
                    bool transactionSucsessStatus = false;
                    int errorId = -1;
                    string errorDescription = "";
                    int orderId = -1;
                    string orderNumber = "";
                    Guid newSessionId = Guid.Empty;
                    if(!DateTime.TryParse(args["orderDate"].ToString(), out orderDate)) {
                        orderDate = DateTime.Now;
                    }
                    /* if the date is today at 12:00, change the date to now.  Some functions
                     * want to pretend there is no such thing as time of day, this is bad behaviour.
                     */
                    if(orderDate == DateTime.Today) {
                        orderDate = DateTime.Now;
                    }
                    /* validate order */
                    if(HttpContext.Current != null) {
                        /* if this is a web user, check that they have permission for these keys */
                        int _term;
                        if(!int.TryParse(args["termId"].ToString(), out _term)) {
                            termId = session.User.TermId;
                        }
                        /* is the person who owns the order an administrator? If not they gota use their account terms. */
                        if(!session.User.Administrator) {
                            termId = session.User.TermId;
                        }
                        /* is the person who is submitting the order an administrator? */
                        Session submitter = Main.GetCurrentSession();
                        if(submitter != null) {
                            if(submitter.User.Administrator) {
                                termId = _term;
                            }
                        }
                    } else {
                        /* if this isn't a web user (EDI) then see if they passed a valid termId, or use the user's default */
                        termId = session.User.TermId;
                        if(!int.TryParse(args["termId"].ToString(), out termId)) {
                            termId = session.User.TermId;
                        }
                    }
                    String.Format("Place Order > Set termId {0} for userId  {1}", termId, session.UserId).Debug(7);
                    /* try to create a paymentMethodId */
                    Guid paymentMethodId = Guid.NewGuid();
                    if(!bool.TryParse(args["backorder"].ToString(), out backorderMode)) {
                        backorderMode = false;
                    }
                    if(termId == 0 && backorderMode == false) {/*this is a prepaid credit card transaction - termId 0 */
                        String.Format("Place Order > Begin CC Transaction for userId {0}", session.UserId).Debug(7);
                        card = new Commerce.CreditCard(
                            args["cardType"].ToString().MaxLength(50, true),
                            args["cardNumber"].ToString().MaxLength(100, true),
                            args["nameOnCard"].ToString().MaxLength(100, true),
                            args["secNumber"].ToString().MaxLength(7, true),
                            args["expMonth"].ToString().MaxLength(4, true),
                            args["expYear"].ToString().MaxLength(4, true)
                        );
                        List<int> orderIds = new List<int>();
                        orderIds.Add(orderId);
                        card.Insert(paymentMethodId, session.Id, session.UserId, session.Id, termId, "",
                        session.Cart.GrandTotal, orderDate, orderIds, "", cn, orderTransaction);
                    } else if(termId == 9 && backorderMode == false /* this is a COD Check transaction - termId 9 */ ) {
                        check = new Commerce.Check(
                            args["checkNumber"].ToString().MaxLength(50, true),
                            args["routingNumber"].ToString().MaxLength(50, true),
                            args["bankAccountNumber"].ToString().MaxLength(50, true),
                            args["checkNotes"].ToString().MaxLength(50, true)
                        );
                        List<int> orderIds = new List<int>();
                        orderIds.Add(orderId);
                        check.Insert(paymentMethodId, session.UserId, session.Id, termId, "", session.Cart.GrandTotal, orderDate, orderIds, "", cn, orderTransaction);
                    } else if(termId == 20 && backorderMode == false /* this is a wire transfer - termId 20 */ ) {
                        wire = new Commerce.Wire(
                            args["swift"].ToString().MaxLength(50, true),
                            args["bankName"].ToString().MaxLength(50, true),
                            args["routingTransitNumber"].ToString().MaxLength(50, true)
                        );
                        List<int> orderIds = new List<int>();
                        orderIds.Add(orderId);
                        wire.Insert(paymentMethodId, session.UserId, session.Id, termId, "", session.Cart.GrandTotal, orderDate, orderIds, "", cn, orderTransaction);
                    } else if(termId == 13 && backorderMode == false /* this order is prepaid in cash */) {
                        List<int> orderIds = new List<int>();
                        orderIds.Add(orderId);
                        cash = new Commerce.Cash(); /*don't you wish it was really that easy?*/
                        cash.Insert(paymentMethodId, session.UserId, session.Id, termId, "", session.Cart.GrandTotal, orderDate, orderIds, "", cn, orderTransaction);
                    } else {
                        /* this order is an accrued order, post a 0 payment as a placeholder */
                        List<int> orderIds = new List<int>();
                        orderIds.Add(orderId);
                        promiseToPay = new Commerce.PromiseToPay();
                        promiseToPay.Insert(paymentMethodId, session.UserId, session.Id, termId, "", session.Cart.GrandTotal, orderDate, orderIds, "", cn, orderTransaction);
                    }
                    /* save forms */
                    for(var x = 0; session.Cart.Items.Count > x; x++) {
                        if(session.Cart.Items[x].Item.Form != null) {
                            cmd = new SqlCommand("dbo.insertOrderLineForm @cartId,@sourceCode,@formName", cn, orderTransaction);
                            cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = new Guid(session.Cart.Items[x].CartId.ToString());
                            cmd.Parameters.Add("@sourceCode", SqlDbType.VarChar).Value = session.Cart.Items[x].Item.Form.SourceCode;
                            cmd.Parameters.Add("@formName", SqlDbType.VarChar).Value = session.Cart.Items[x].Item.Form.Name.MaxLength(50, true);
                            cmd.ExecuteNonQuery();
                            cmd.Dispose();
                        }
                    }
                    /* place order */
                    o = ExecPlaceOrder(
                        new Guid(session.Id.ToString()),
                        session.UserId,
                        paymentMethodId,
                        Main.Site.test_mode,
                        new Guid(Main.Site.Defaults.SiteId.ToString()),
                        Guid.Empty,
                        args["purchaseOrder"].ToString(),
                        orderDate,
                        termId,
                        session.Cart.DiscountTotal,
                        cn,
                        orderTransaction
                    );
                    errorId = (int)o["error"];
                    errorDescription = (string)o["description"];
                    if(errorId == 0) {/* these keys will be absent in the event of an error */
                        orderId = (int)o["orderId"];
                        orderNumber = (string)o["orderNumber"];
                    }
                    if(errorId == 0) {
                        /* if termId == 0 then this is a credit card and we can actaully automate the payment. */
                        if(termId == 0 && session.User.AccountType == 0/*AR accounts only*/) {
                            if(card.Error == 0) {
                                ("starting payment gateway...").Debug(5);
                                vt = Commerce.VirtualTerminal.ChargeCreditCard(
                                    billToAddress, shipToAddress, card, session.Cart.GrandTotal, session.Id, orderNumber, args["purchaseOrder"].ToString(), cn, orderTransaction
                                );
                                if(vt == null) {
                                    o.Add("error", -1754);
                                    o.Add("description", "Internal virtual terminal error.  Unable to create virtual terminal object.");
                                    rollback = true;
                                    Exception e = new Exception("Invalid credit card passed to local system");
                                    e.Message.Debug(5);
                                    throw e;
                                }
                                transactionSucsessStatus = vt["error"].ToString() == "0";
                                vtDesc = vt["description"].ToString();
                            } else {
                                o.Add("error", -1744);
                                o.Add("description", "Invalid credit card passed to local system");
                                rollback = true;
                                Exception e = new Exception("Invalid credit card passed to local system");
                                e.Message.Debug(5);
                                throw e;
                            }
                        } else { /* if this was anything else we can't really tell if the payment is good or bad so we just assume it's good */
                            ("Non credit card order - assume payment is OK").Debug(7);
                            transactionSucsessStatus = true;
                        }
                        if(transactionSucsessStatus || Main.Site.test_mode == true) {
                            /* add info to the order now that it has been placed */
                            if(args.ContainsKey("orderNumber")) {
                                if(args["orderNumber"].ToString() != "") {
                                    customOrderNumber = args["orderNumber"].ToString();
                                }
                            }
                            if(!Int32.TryParse(args["soldBy"].ToString(), out soldBy)) {
                                soldBy = -1;
                            }
                            if(!Int32.TryParse(args["requisitionedBy"].ToString(), out requisitionedBy)) {
                                requisitionedBy = -1;
                            }
                            if(!Int32.TryParse(args["approvedBy"].ToString(), out soldBy)) {
                                approvedBy = -1;
                            }
                            if(!Int32.TryParse(args["parentOrderId"].ToString(), out parentOrderId)) {
                                parentOrderId = -1;
                            }
                            if(!DateTime.TryParse(args["deliverBy"].ToString(), out deliverBy)) {
                                deliverBy = SQLMin;
                            }
                            string discountCode = "";
                            object s_code = session.GetProperty("discountCode");
                            object s_desc = session.GetProperty("discountDescription");
                            if(s_desc != null) {
                                discountCode = s_desc.ToString().MaxLength(50, true);
                            } else if(s_code != null) {
                                string t_code = s_code.ToString().ToLower().Trim();
                                /* if ther was a discount code enter the description into the order now */
                                Discount orderDiscount = Main.Site.Discounts.List.Find(delegate(Discount d) {
                                    return d.Code == t_code;
                                });
                                if(orderDiscount != null) {
                                    discountCode = orderDiscount.Comments.MaxLength(50, true);
                                }
                            }
                            ("Execute SP [dbo].[updateExtOrderInfo]").Debug(7);
                            using(cmd = new SqlCommand(@"dbo.updateExtOrderInfo @orderId,@purchaseOrder,@soldBy,@manifestNumber,@requisitionedBy,
						@deliverBy,@vendorAccountNumber,@fob,@parentOrderId,@scannedImage,@comments,@approvedBy,@oldSessionId,
						@uniqueSiteId,@customOrderNumber,@discountCode", cn, orderTransaction)) {
                                cmd.Parameters.Add("@orderId", SqlDbType.Int).Value = orderId;
                                cmd.Parameters.Add("@purchaseOrder", SqlDbType.VarChar).Value = Convert.ToString(args["purchaseOrder"]).MaxLength(100, true);
                                cmd.Parameters.Add("@soldBy", SqlDbType.Int).Value = soldBy;
                                cmd.Parameters.Add("@manifestNumber", SqlDbType.VarChar).Value = Convert.ToString(args["manifestNumber"]).MaxLength(100, true);
                                cmd.Parameters.Add("@requisitionedBy", SqlDbType.Int).Value = soldBy;
                                cmd.Parameters.Add("@deliverBy", SqlDbType.DateTime).Value = deliverBy;
                                cmd.Parameters.Add("@vendorAccountNumber", SqlDbType.VarChar).Value = Convert.ToString(args["vendorAccountNumber"]).MaxLength(50, true);
                                cmd.Parameters.Add("@fob", SqlDbType.VarChar).Value = Convert.ToString(args["FOB"]).MaxLength(50, true);
                                cmd.Parameters.Add("@parentOrderId", SqlDbType.Int).Value = parentOrderId;
                                cmd.Parameters.Add("@scannedImage", SqlDbType.VarChar).Value = Convert.ToString(args["scannedImage"]).MaxLength(50, true);
                                cmd.Parameters.Add("@approvedBy", SqlDbType.Int).Value = approvedBy;
                                cmd.Parameters.Add("@comments", SqlDbType.VarChar).Value = Convert.ToString(args["comments"]).MaxLength(10000, true);
                                cmd.Parameters.Add("@oldSessionId", SqlDbType.UniqueIdentifier).Value = new Guid(session.Id.ToString());
                                cmd.Parameters.Add("@uniqueSiteId", SqlDbType.UniqueIdentifier).Value = new Guid(Site.Id.ToString());
                                cmd.Parameters.Add("@customOrderNumber", SqlDbType.VarChar).Value = customOrderNumber;
                                cmd.Parameters.Add("@discountCode", SqlDbType.VarChar).Value = discountCode;
                                cmd.ExecuteNonQuery();
                            }
                            bool eraseVisitorHistory = false;
                            if(!bool.TryParse(args["eraseVisitorHistory"].ToString(), out eraseVisitorHistory)) {
                                eraseVisitorHistory = false;
                            }
                            if(eraseVisitorHistory) {
                                /* TODO: erase Visitor History.  This was causing a deadlock. maybe do it later? */
                            }
                            /* if there was a scaned image attached move it now */
                            if(((string)args["scannedImage"]).Length > 0) {
                                Admin.StoreScannedImage((string)args["scannedImage"], orderNumber);
                            }
                            if(Main.Site.test_mode) {
                                rollback = true;
                                Exception e = new Exception("placeOrder > __TEST MODE__ - ORDER SUCCESS - __TEST MODE__ >> ROLLBACK!" +
                                " Order Number:" + orderNumber + ",SessionId:" + session.Id.ToString());
                                e.Message.Debug(7);
                                throw e;
                            } else {
                                /* if they had a discount code, remove that now */
                                session.RemoveProperty("discountCode", cn, orderTransaction);
                                session.RemoveProperty("discountDescription", cn, orderTransaction);

                                if(fcn == null) {/* commit transaction if there was no caller transaction */
                                    orderTransaction.Commit();
                                }
                                Commerce.Order order = Commerce.Order.GetOrderByOrderId(orderId, cn, orderTransaction);
                                ("placeOrder > $$$$$$$$$$ <CHA CHING> - ORDER SUCCESS - <CHA CHING> $$$$$$$$$$ Order Number:" + orderNumber).Debug(7);
                                AfterPlaceOrderEventArgs f = new AfterPlaceOrderEventArgs(order, cn, orderTransaction, session, HttpContext.Current);
                                Main.Site.raiseOnplaceorder(f);
                                if(args.ContainsKey("sendOrderConfirmEmail")) {
                                    if(((bool)args["sendOrderConfirmEmail"]) == true) {
                                        try {
                                            Dictionary<string, object> emailArgs = new Dictionary<string, object>();
                                            emailArgs.Add("orderId", orderId);
                                            PlacedOrderEmail(order, cn, orderTransaction);
                                        } catch(Exception e) {
                                            String.Format("Could not send email for orderId {0}. {1}"
                                            , orderId, e.Message).Debug(1);
                                        }
                                    }
                                }
                            }
                            if(fcn == null) {
                                cn.Dispose();
                            }
                            return o;
                        } else {
                            if(fcn == null) {
                                rollback = true;
                            }
                            /* the order failed becuase the user could not provide a convincing enough payment method */
                            o.Remove("error");
                            o.Remove("description");
                            o.Add("error", -2000);
                            o.Add("description", vtDesc);
                            rollback = true;
                            Exception e = new Exception(vtDesc);
                            e.Message.Debug(3);
                            throw e;
                        }
                    } else {
                        /* error occured, error in in the object o */
                        o.Remove("error");
                        o.Remove("description");
                        o.Add("error", errorId);
                        o.Add("description", errorDescription);
                        rollback = true;
                        Exception e = new Exception(errorId.ToString() + ":" + errorDescription);
                        e.Message.Debug(1);
                        throw e;
                    }
                } catch(Exception ex) {
                    o.Remove("error");
                    o.Remove("description");
                    o.Add("error", -500);
                    o.Add("description", ex.Message);
                    ("Exception:" + ex.Message + " SessionId:" + session.Id.ToString()).Debug(1);
                    rollback = true;
                    return o;
                } finally {
                    if(rollback) {
                        if(fcn == null) {
                            orderTransaction.Rollback(transSessionId);
                        }
                    }
                }
            }
            #endregion
        }
    }
}
