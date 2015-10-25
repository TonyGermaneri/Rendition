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
using System.Web;
namespace Rendition {
    public partial class Commerce {
        public partial class Order {
            #region Cancel Backorder Static Methods
            /// <summary>
            /// Cancels the items.
            /// </summary>
            /// <param name="args">The args.</param>
            /// <returns>{error:0,desc:""}</returns>
            public static Dictionary<string, object> CancelItems(List<object> args) {
                ("FUNCTION /w SP cancelItems").Debug(10);
                return CancelBackorderItems(args, true);
            }
            /// <summary>
            /// Backorders the items.
            /// </summary>
            /// <param name="args">The args.</param>
            /// <returns>{error:0,desc:""}</returns>
            public static Dictionary<string, object> BackorderItems(List<object> args) {
                ("FUNCTION /w SP backorderItems").Debug(10);
                return CancelBackorderItems(args, false);
            }
            /// <summary>
            /// Cancels or backorders the items in an existing order.
            /// </summary>
            /// <param name="args">The args.</param>
            /// <param name="cancel">if set to <c>true</c> [cancel] else backorder</param>
            /// <returns>{error:0,desc:""}</returns>
            private static Dictionary<string, object> CancelBackorderItems(List<object> args, bool cancel) {
                /*TODO: backorder procedure has uncertain payment stuff going on here
                 * cancel works, backorder works, but changing 
                 * 
                 */
                Dictionary<string, object> j = new Dictionary<string, object>();
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlTransaction cancelBackorderTransaction = cn.BeginTransaction("Backorder or Cancel")) {
                        bool rollback = true;
                        try {
                            foreach(object line in args) {
                                Dictionary<string, object> fields = (Dictionary<string, object>)line;
                                // never used -->Dictionary<string,object> flag;
                                if(!fields.ContainsKey("serialId") || !fields.ContainsKey("qty")) {
                                    Exception e = new Exception("key serialId or qty is missing");
                                    throw e;
                                }
                                int serialId = Convert.ToInt32(fields["serialId"].ToString());
                                int qty = Convert.ToInt32(fields["qty"].ToString());
                                /* update the cart table with the number of items to be backordered.   */
                                using(SqlCommand cmd = new SqlCommand("update cart set returnToStock = @return where serialId = @serialId", cn, cancelBackorderTransaction)) {
                                    cmd.Parameters.Add("@serialId", SqlDbType.Int).Value = serialId;
                                    cmd.Parameters.Add("@return", SqlDbType.Int).Value = qty;
                                    cmd.ExecuteNonQuery();
                                }
                                /* now add the flag that will trigger serial_line.TR_LINE_DEPLETE_INVENTORY*/
                                /* flag -11 is backorder, flag -12 is cancel */
                                using(SqlCommand cmd = new SqlCommand("dbo.backorderCancel @serialId,@cancel,@backorder", cn, cancelBackorderTransaction)) {
                                    cmd.Parameters.Add("@serialId", SqlDbType.Int).Value = serialId;
                                    cmd.Parameters.Add("@cancel", SqlDbType.Bit).Value = cancel;
                                    cmd.Parameters.Add("@backorder", SqlDbType.Bit).Value = !cancel;
                                    cmd.ExecuteNonQuery();
                                }
                                /* if this is a cancelation don't create a new order or add to an existing order */
                                if(cancel) {
                                    AddFlagWithTransaction("0", "line", serialId.ToString(), "Quantity of " + qty + " canceled", cn, cancelBackorderTransaction);
                                } else {
                                    /* first check to see if an order is already the child of this order 
                                        * if so, then just add this item to the child order (backorder)
                                        * if there is no child order than create the child order now.
                                        */
                                    Commerce.Order childOrder;
                                    List<Commerce.Order> childOrders = Commerce.Order.GetChildOrdersBySerialId(serialId, cn, cancelBackorderTransaction);
                                    if(childOrders.Count == 0) {
                                        childOrder = null;
                                    } else {
                                        childOrder = childOrders[0];
                                    }
                                    Commerce.Order order = Commerce.Order.GetOrderBySerialId(serialId, cn, cancelBackorderTransaction);
                                    if(childOrder == null) {
                                        /* create a new order and add the item's qty to the new order */
                                        /* get the line that will be added to the backorder */
                                        List<Commerce.Line> sourceLines = order.Lines.FindAll(delegate(Commerce.Line ln) {
                                            return ln.SerialId == serialId && ln.KitAllocationCartId == ln.CartId;
                                        });
                                        /* sort the items by int kitAllocationId */
                                        sourceLines.Sort(delegate(Commerce.Line l1, Commerce.Line l2) {
                                            return l1.KitAllocationId.CompareTo(l2.KitAllocationId);
                                        });
                                        /* when there is more than one source line, always pick the one with the larget id
                                            * this will be the parent/virtual item that needs to be added to the backorder */
                                        Commerce.Line sourceLine = sourceLines[sourceLines.Count - 1];
                                        /* create a new session for the new order */
                                        Session session = new Session(Main.Site, cn, cancelBackorderTransaction);
                                        Site.LogOn(order.UserId, session, cn, cancelBackorderTransaction);
                                        session.Refresh(false, cn, cancelBackorderTransaction);
                                        AddToCartArguments addTocartArgs = new AddToCartArguments();
                                        addTocartArgs["itemNumber"] = sourceLine.ItemNumber;
                                        addTocartArgs["qty"] = fields["qty"].ToString();
                                        addTocartArgs["customerLineNumber"] = sourceLine.CustomLineNumber;
                                        addTocartArgs["sessionId"] = session.Id.ToString();
                                        addTocartArgs["price"] = sourceLine.Price;
                                        addTocartArgs["allowPreorder"] = true;
                                        /* add all of the inputs as arguments */
                                        Dictionary<string, object> addToCartArgs = Cart.AddToCart(addTocartArgs, cn, cancelBackorderTransaction);
                                        if(Convert.ToInt32(addToCartArgs["error"]) != 0) {
                                            Exception e = new Exception(addToCartArgs["description"].ToString());
                                            throw e;
                                        }
                                        Guid newCartId = new Guid(addToCartArgs["cartId"].ToString());
                                        /* copy all of the order header data into the new order */
                                        using(SqlCommand cmd = new SqlCommand("dbo.duplicateCartDetail @sourceCartId,@targetCartId", cn, cancelBackorderTransaction)) {
                                            cmd.Parameters.Add("@sourceCartId", SqlDbType.UniqueIdentifier).Value = new Guid(sourceLine.CartId.ToString());
                                            cmd.Parameters.Add("@targetCartId", SqlDbType.UniqueIdentifier).Value = new Guid(newCartId.ToString());
                                            cmd.ExecuteNonQuery();
                                        }
                                        OrderArguments newOrderArgs = new OrderArguments();
                                        newOrderArgs["billToFirstName"] = order.BillToAddress.FirstName;
                                        newOrderArgs["billToLastName"] = order.BillToAddress.LastName;
                                        newOrderArgs["billToAddress1"] = order.BillToAddress.Address1;
                                        newOrderArgs["billToAddress2"] = order.BillToAddress.Address2;
                                        newOrderArgs["billToCity"] = order.BillToAddress.City;
                                        newOrderArgs["billToState"] = order.BillToAddress.State;
                                        newOrderArgs["billToZip"] = order.BillToAddress.Zip;
                                        newOrderArgs["billToCountry"] = order.BillToAddress.Country;
                                        newOrderArgs["billToHomePhone"] = order.BillToAddress.HomePhone;
                                        newOrderArgs["billToWorkPhone"] = order.BillToAddress.WorkPhone;
                                        newOrderArgs["billToCompany"] = order.BillToAddress.Company;
                                        newOrderArgs["billToComments"] = order.BillToAddress.Comments;
                                        newOrderArgs["billToSpecialInstructions"] = order.BillToAddress.SpecialInstructions;
                                        newOrderArgs["billToSendShipmentUpdates"] = order.BillToAddress.SendShipmentUpdates;
                                        newOrderArgs["FOB"] = order.FOB;
                                        newOrderArgs["termId"] = order.TermId;
                                        newOrderArgs["userId"] = session.User.UserId;
                                        newOrderArgs["manifestNumber"] = order.Manifest;
                                        newOrderArgs["purchaseOrder"] = Utilities.Iif(order.PurchaseOrder.Length > 0, order.PurchaseOrder + ">" + order.OrderNumber, "");
                                        newOrderArgs["sessionId"] = session.Id.ToString();
                                        newOrderArgs["shipToRateId"] = -1;/* never put a shipping method on backorders */
                                        newOrderArgs["billToRateId"] = -1;
                                        newOrderArgs["shipToEmailAds"] = false;
                                        newOrderArgs["billToEmailAds"] = false;
                                        newOrderArgs["billToSendShipmentUpdates"] = false;
                                        newOrderArgs["shipToFirstName"] = order.ShipToAddress.FirstName;
                                        newOrderArgs["shipToLastName"] = order.ShipToAddress.LastName;
                                        newOrderArgs["shipToAddress1"] = order.ShipToAddress.Address1;
                                        newOrderArgs["shipToAddress2"] = order.ShipToAddress.Address2;
                                        newOrderArgs["shipToCity"] = order.ShipToAddress.City;
                                        newOrderArgs["shipToState"] = order.ShipToAddress.State;
                                        newOrderArgs["shipToZip"] = order.ShipToAddress.Zip;
                                        newOrderArgs["shipToCountry"] = order.ShipToAddress.Country;
                                        newOrderArgs["shipToHomePhone"] = order.ShipToAddress.HomePhone;
                                        newOrderArgs["shipToWorkPhone"] = order.ShipToAddress.WorkPhone;
                                        newOrderArgs["shipToCompany"] = order.ShipToAddress.Company;
                                        newOrderArgs["shipToComments"] = order.ShipToAddress.Comments;
                                        newOrderArgs["shipToSpecialInstructions"] = order.ShipToAddress.SpecialInstructions;
                                        newOrderArgs["shipToSendShipmentUpdates"] = order.ShipToAddress.SendShipmentUpdates;
                                        newOrderArgs["parentOrderId"] = order.OrderId;
                                        newOrderArgs["comments"] = "This order is a backorder from Order " + order.OrderNumber;
                                        newOrderArgs.Add("backorder", true);
                                        /* place the new backorder */
                                        Dictionary<string, object> newOrder = Commerce.Order.PlaceOrderWithTransaction(newOrderArgs, cn, cancelBackorderTransaction);
                                        if(Convert.ToInt32(newOrder["error"]) != 0) {
                                            Exception e = new Exception(newOrder["description"].ToString());
                                            throw e;
                                        }
                                        childOrder = Commerce.Order.GetOrderByOrderNumber((string)newOrder["orderNumber"], cn, cancelBackorderTransaction);
                                        j.Add("childOrder", childOrder.GetOrderJson());
                                    } else {
                                        /* the child order (backorder) already existed, so add the item to the backorder */
                                        Commerce.Line sourceLine = order.Lines.Find(delegate(Commerce.Line ln) {
                                            return ln.SerialId == serialId;
                                        });
                                        /* create a new session for the new order */
                                        Session session = new Session(Main.Site, cn, cancelBackorderTransaction);
                                        Site.LogOn(childOrder.UserId, session, cn, cancelBackorderTransaction);
                                        session.Refresh(false, cn, cancelBackorderTransaction);
                                        AddToCartArguments addTocartArgs = new AddToCartArguments();
                                        addTocartArgs["itemNumber"] = sourceLine.ItemNumber;
                                        addTocartArgs["qty"] = fields["qty"].ToString();
                                        addTocartArgs["customerLineNumber"] = sourceLine.CustomLineNumber;
                                        addTocartArgs["sessionId"] = session.Id.ToString();
                                        addTocartArgs["addressId"] = sourceLine.AddressId.ToString();
                                        addTocartArgs["price"] = sourceLine.Price;
                                        addTocartArgs["allowPreorder"] = true;
                                        /* add all of the inputs as arguments */
                                        Dictionary<string, object> addToCartArgs = Cart.AddToCart(addTocartArgs, cn, cancelBackorderTransaction);
                                        if(Convert.ToInt32(addToCartArgs["error"]) != 0) {
                                            Exception e = new Exception(addToCartArgs["description"].ToString());
                                            throw e;
                                        }
                                        Guid newCartId = new Guid(addToCartArgs["cartId"].ToString());
                                        /* copy all of the order header data into the new order */
                                        using(SqlCommand cmd = new SqlCommand("dbo.duplicateCartDetail @sourceCartId,@targetCartId", cn, cancelBackorderTransaction)) {
                                            cmd.Parameters.Add("@sourceCartId", SqlDbType.UniqueIdentifier).Value = new Guid(sourceLine.CartId.ToString());
                                            cmd.Parameters.Add("@targetCartId", SqlDbType.UniqueIdentifier).Value = new Guid(newCartId.ToString());
                                            cmd.ExecuteNonQuery();
                                        }
                                        Dictionary<string, object> recalculateArgs = new Dictionary<string, object>();
                                        recalculateArgs.Add("userId", childOrder.UserId);
                                        recalculateArgs.Add("orderSessionId", childOrder.SessionId.ToString());
                                        recalculateArgs.Add("cartSessionId", session.Id.ToString());
                                        recalculateArgs.Add("cardType", "");
                                        recalculateArgs.Add("cardNumber", "");
                                        recalculateArgs.Add("expMonth", "");
                                        recalculateArgs.Add("expYear", "");
                                        recalculateArgs.Add("secNumber", "");
                                        recalculateArgs.Add("nameOnCard", "");
                                        recalculateArgs.Add("billToAddressId", childOrder.BillToAddress.Id.ToString());
                                        recalculateArgs.Add("shipToAddressId", childOrder.ShipToAddress.Id.ToString());
                                        recalculateArgs.Add("preview", false);
                                        recalculateArgs.Add("purchaseOrder", childOrder.PurchaseOrder);
                                        recalculateArgs.Add("backorder", true);
                                        Dictionary<string, object> recalculatedOrder = RecalculateOrder(recalculateArgs, cn, cancelBackorderTransaction);
                                        if((int)recalculatedOrder["error"] != 0) {
                                            Exception e = new Exception(recalculatedOrder["description"].ToString());
                                            throw e;
                                        }
                                        Commerce.Order _order = Commerce.Order.GetOrderByOrderNumber((string)recalculatedOrder["orderNumber"], cn, cancelBackorderTransaction);
                                        j.Add("childOrder", _order.GetOrderJson());
                                    }
                                    AddFlagWithTransaction("0", "line", serialId.ToString(), "Quantity of " + qty + " added to backorder " + childOrder.OrderNumber, cn, cancelBackorderTransaction);
                                }
                            }
                            rollback = false;
                            cancelBackorderTransaction.Commit();
                            j.Add("error", 0);
                            j.Add("description", "");
                        } catch(Exception e) {
                            rollback = true;
                            j.Add("error", -1);
                            j.Add("description", e.Message);
                        } finally {
                            if(rollback) {
                                cancelBackorderTransaction.Rollback();
                            }
                        }
                    }
                }
                return j;
            }
            #endregion
            #region Order And Item Update Static Methods
            /// <summary>
            /// Updates an item that is already in an order.
            /// </summary>
            /// <param name="args">The line arguments.</param>
            /// <returns>{error:0,desc:""}</returns>
            public static Dictionary<string, object> UpdateOrderItem(Dictionary<string, object> args) {
                ("FUNCTION /w SP updateOrderItem").Debug(10);
                Dictionary<string, object> j = new Dictionary<string, object>();
                if(!(args.ContainsKey("cartId") && args.ContainsKey("sessionId"))) {
                    j.Add("error", 1);
                    j.Add("description", "key cartId or sessionId is missing");
                    return j;
                }
                /* get the form from the database */
                string sourceCode = "";
                string formName = "";
                string itemNumber = "";
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    SqlTransaction trans = cn.BeginTransaction("updateOrderItem");
                    Guid cartId = new Guid(args["cartId"].ToString());
                    Commerce.Order order = Order.GetOrderByCartId(cartId, cn, trans);
                    if(order == null) {
                        throw new Exception("updateOrderItem => cartId does not resolve to an order => " + cartId.ToString());
                    }
                    Commerce.Line line = order.Lines.Find(delegate(Commerce.Line li) {
                        return li.CartId == cartId;
                    });
                    if(line == null) {
                        throw new Exception("updateOrderItem => cartId does not resolve to a line => " + cartId.ToString());
                    }
                    using(SqlCommand cmd = new SqlCommand("dbo.getForm @cartId", cn, trans)) {
                        cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = new Guid(cartId.ToString());
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            if(d.HasRows) {
                                d.Read();
                                sourceCode = d.GetString(0);
                                formName = d.GetString(1);
                                itemNumber = d.GetString(2);
                            }
                        }
                    }
                    Commerce.Form form = new Commerce.Form(Main.Site.Items.GetItemByItemNumber(itemNumber), sourceCode, formName);
                    List<Commerce.Input> formInputs = form.Inputs;
                    /* remove the existing cartdetail entries to make way for the new impoved cartdetail entries */
                    using(SqlCommand cmd = new SqlCommand(@"update cart set qty = @qty, price = @price where cartId = @cartId;
				delete from cartdetail where cartId = @cartId;", cn, trans)) {
                        cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = new Guid(args["cartId"].ToString());
                        cmd.Parameters.Add("@qty", SqlDbType.VarChar).Value = args["qty"].ToString();
                        cmd.Parameters.Add("@price", SqlDbType.VarChar).Value = args["price"].ToString();
                        cmd.ExecuteNonQuery();
                    }
                    for(int x = 0; line.Form.Inputs.Count > x; x++) {
                        Commerce.Input i = line.Form.Inputs[x];
                        if(args.ContainsKey(i.Name)) {
                            i.Value = Convert.ToString(args[i.Name]);
                        } else if(args.ContainsKey(i.Id.EncodeXMLId())) {
                            i.Value = Convert.ToString(args[i.Id.EncodeXMLId()]);
                        } else {
                            i.Value = "";
                        }
                        i.Id = Guid.NewGuid();
                        form.Inputs.Find(delegate(Commerce.Input inp) { return inp.Name.l() == i.Name.l(); }).Value = i.Value;
                        using(SqlCommand cmd = new SqlCommand("dbo.insertCartDetail @cartDetailId,@cartId,@inputName,@value,@sessionId;", cn, trans)) {
                            cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = new Guid(args["cartId"].ToString());
                            cmd.Parameters.Add("@sessionId", SqlDbType.UniqueIdentifier).Value = new Guid(args["sessionId"].ToString());
                            cmd.Parameters.Add("@cartDetailId", SqlDbType.UniqueIdentifier).Value = new Guid(i.Id.ToString());
                            cmd.Parameters.Add("@inputName", SqlDbType.VarChar).Value = i.Name;
                            cmd.Parameters.Add("@value", SqlDbType.VarChar).Value = i.Value;
                            cmd.ExecuteNonQuery();
                        }
                    }
                    LineUpdateEventArgs lineArgs = new LineUpdateEventArgs(line, order, cn, trans);
                    Main.Site.raiseOnLineUpdate(lineArgs);
                    trans.Commit();
                }
                j.Add("error", 0);
                j.Add("description", "");
                return j;
            }
            #endregion
            #region Recalculation Static Methods
            /// <summary>
            /// Recalculates the order.
            /// </summary>
            /// <param name="args">The order arguments.</param>
            /// <returns>{error:0,desc:""}</returns>
            public static Dictionary<string, object> RecalculateOrder(Dictionary<string, object> args) {
                return RecalculateOrder(args, null, null);
            }
            /// <summary>
            /// Recalculates the order.
            /// </summary>
            /// <param name="args">The order arguments.</param>
            /// <param name="fcn">The FCN.</param>
            /// <param name="ftrans">The ftrans.</param>
            /// <returns>{error:0,desc:""}</returns>
            public static Dictionary<string, object> RecalculateOrder(Dictionary<string, object> args, SqlConnection fcn, SqlTransaction ftrans) {
                Dictionary<string, object> vt;
                Dictionary<string, object> j;
                Commerce.CreditCard card = null;
                Commerce.Cash cash = null;
                Commerce.Wire wire = null;
                // never used -> Commerce.PayPal PayPal=null;
                Commerce.Check check = null;
                Commerce.PromiseToPay promiseToPay = null;
                decimal discountAmount = 0;
                Guid paymentMethodId = Guid.NewGuid();
                bool backorder = false;
                bool preview = false;
                int errorId = -1;
                ("FUNCTION /w SP,CN,TRANS recalculateOrder").Debug(10);
                string[] keys = { "userId", "orderSessionId", "cartSessionId", "preview", "purchaseOrder" };
                bool transactionSucsessStatus = false;
                int termId = 0;
                int orderId = 0;
                decimal difference = 0;
                foreach(string keyName in keys) {
                    if(!args.ContainsKey(keyName)) {
                        Dictionary<string, object> o = new Dictionary<string, object>();
                        string _msg = "The key \"" + keyName + "\" is missing from the argument dictionary.  All keys must be present even if they are blank.";
                        o.Add("error", -4010);
                        o.Add("description", _msg);
                        String.Format("recalculateOrder failed. {0}", _msg).Debug(1);
                        return o;
                    }
                }
                /* get the old order */
                SqlConnection cn;
                SqlTransaction trans;
                Guid orderSessionId = new Guid((string)args["orderSessionId"]);
                if(fcn == null) {
                    cn = Site.CreateConnection(true, true);
                    cn.Open();
                    trans = cn.BeginTransaction("Recalculate transaction");
                } else {
                    cn = fcn;
                    trans = ftrans;
                }
                Commerce.Order originalOrder = Commerce.Order.GetOrderBySessionId(orderSessionId, cn, trans);
                termId = originalOrder.TermId;
                preview = Convert.ToBoolean(args["preview"].ToString());
                if(!preview) {
                    /* preview the recalculation in preview to asertain the grand total for charging the card */
                    trans.Save("preChargePreview");
                    j = ExecPlaceOrder(
                        orderSessionId,
                        Convert.ToInt32(args["userId"].ToString()),
                        orderSessionId,
                        true,/*preview*/
                        new Guid(Main.Site.Defaults.SiteId),
                        new Guid((string)args["cartSessionId"]),
                        args["purchaseOrder"].ToString(),
                        DateTime.Now/* this value is ignored in the SP for recalculations */,
                        termId,
                        discountAmount,
                        cn,
                        trans
                    );
                    termId = (int)j["termId"];
                    orderId = (int)j["orderId"];
                    if(j["error"].ToString() != "0" && j["error"].ToString() != "5") {
                        Exception ex = new Exception(j["description"].ToString());
                        throw ex;
                    }
                    if(!decimal.TryParse(j["difference"].ToString(), out difference)) {
                        difference = 0;
                    }
                    difference = Math.Round(difference, 2, MidpointRounding.AwayFromZero);
                    if(difference != 0) {
                        if(backorder) {
                            /* no need to do anything */
                        } else if(termId == 0 && difference > 0) {/*this is a prepaid credit card transaction - termId 0 */
                            /* don't try and charge credit cards negitive amounts */
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
                            card.Insert(paymentMethodId, orderSessionId, originalOrder.UserId, originalOrder.SessionId,
                            termId, "", difference, DateTime.Now, orderIds, "", cn, trans);
                        } else if(termId == 9 /* this is a COD Check transaction - termId 9 */ ) {
                            check = new Commerce.Check(
                                args["checkNumber"].ToString().MaxLength(50, true),
                                args["routingNumber"].ToString().MaxLength(50, true),
                                args["bankAccountNumber"].ToString().MaxLength(50, true),
                                args["checkNotes"].ToString().MaxLength(50, true)
                            );
                            List<int> orderIds = new List<int>();
                            orderIds.Add(orderId);
                            check.Insert(paymentMethodId, originalOrder.UserId, originalOrder.SessionId, termId, "", difference, DateTime.Now, orderIds, "", cn, trans);
                        } else if(termId == 20 /* this is a wire transfer - termId 20 */ ) {
                            wire = new Commerce.Wire(
                                args["swift"].ToString().MaxLength(50, true),
                                args["bankName"].ToString().MaxLength(50, true),
                                args["routingTransitNumber"].ToString().MaxLength(50, true)
                            );
                            List<int> orderIds = new List<int>();
                            orderIds.Add(orderId);
                            wire.Insert(paymentMethodId, originalOrder.UserId, originalOrder.SessionId, termId, "", difference, DateTime.Now, orderIds, "", cn, trans);
                        } else if(termId == 13 /* this order is prepaid in cash */) {
                            cash = new Commerce.Cash(); /*don't you wish it was really that easy?*/
                            List<int> orderIds = new List<int>();
                            orderIds.Add(orderId);
                            cash.Insert(paymentMethodId, originalOrder.UserId, originalOrder.SessionId, termId, "", difference, DateTime.Now, orderIds, "", cn, trans);
                        } else if(difference > 0) {
                            /* this order is an accrued order */
                            promiseToPay = new Commerce.PromiseToPay();
                            List<int> orderIds = new List<int>();
                            orderIds.Add(orderId);
                            promiseToPay.Insert(paymentMethodId, originalOrder.UserId, originalOrder.SessionId, termId, "", difference, DateTime.Now, orderIds, "", cn, trans);
                        }
                    }
                    trans.Rollback("preChargePreview");
                }
                /* do the recalculation */
                j = ExecPlaceOrder(
                    new Guid((string)args["orderSessionId"]),
                    Convert.ToInt32(args["userId"].ToString()),
                    new Guid((string)args["orderSessionId"]),
                    preview,
                    new Guid(Main.Site.Defaults.SiteId),
                    new Guid((string)args["cartSessionId"]),
                    args["purchaseOrder"].ToString(),
                    DateTime.Now/* this value is ignored in the SP for recalculations */,
                    termId,
                    discountAmount,
                    cn,
                    trans
                );
                errorId = Convert.ToInt32(j["error"].ToString());
                if(errorId != 0 && errorId != 5) {/* if there was an return the error without continuing */
                    if(fcn == null) {
                        trans.Rollback();
                        cn.Close();
                    }
                    return j;
                };

                if(termId != 0 || backorder == true) {
                    /* this order uses acrued payment method or has lost value, don't charge now */
                    ("order with payment terms, backorder.  No payment gateway now.").Debug(7);
                    transactionSucsessStatus = true;
                } else if(difference > 0) {
                    ("starting payment gateway...").Debug(5);
                    vt = Commerce.VirtualTerminal.ChargeCreditCard(
                        (Commerce.Address)j["billToAddress"], (Commerce.Address)j["shipToAddress"], card,
                        difference, new Guid((string)args["orderSessionId"]), originalOrder.OrderNumber,
                        originalOrder.PurchaseOrder, fcn, ftrans
                    );
                    if(vt == null) {
                        Dictionary<string, object> o = new Dictionary<string, object>();
                        trans.Rollback();
                        o.Add("error", -1754);
                        o.Add("description", "Internal virtual terminal error.  Unable to create virtual terminal object.");
                        ("Invalid credit card passed to local system").Debug(7);
                        ("placeOrder Failed with error code -1754").Debug(7);
                        if(fcn == null) {
                            cn.Dispose();
                        }
                        return o;
                    }
                    transactionSucsessStatus = vt["error"].ToString() == "0";
                    if(!transactionSucsessStatus) {
                        j.Add("error", -3);
                        j.Add("description", vt["description"]);
                        j.Add("virtualTerminal", vt);
                        if(fcn == null) {
                            cn.Dispose();
                        }
                        return j;
                    }
                }
                if(errorId != 0 || transactionSucsessStatus == false || preview) {
                    if(fcn == null) {
                        trans.Rollback();
                    }
                    if(!preview) {
                        Exception ex = new Exception("The trasnaction failed.");
                        throw ex;
                    }
                } else {
                    Commerce.Order order;
                    RecalculateOrderEventArgs e;
                    if(fcn == null) {
                        order = Commerce.Order.GetOrderByOrderId(orderId, cn, trans);
                        e = new RecalculateOrderEventArgs(order, cn, trans, args, Main.GetCurrentSession(), HttpContext.Current);
                    } else {
                        order = Commerce.Order.GetOrderByOrderId(orderId, fcn, ftrans);
                        e = new RecalculateOrderEventArgs(order, fcn, ftrans, args, Main.GetCurrentSession(), HttpContext.Current);
                    }
                    Main.Site.raiseOnrecalculateorder(e);
                    if(Site.AbortDefaultEvent == true) {
                        Site.AbortDefaultEvent = false;
                    }
                    if(fcn == null) {
                        trans.Commit();
                    }
                }
                if(fcn == null) {
                    cn.Dispose();
                }
                return j;
            }
            #endregion
            #region Instance Methods
            /// <summary>
            /// The parent order.
            /// </summary>
            /// <returns>Parent order.</returns>
            public Order GetParentOrder() {
                return GetParentOrder(null, null);
            }
            /// <summary>
            /// Parents the order.
            /// </summary>
            /// <param name="cn">SQL connection.</param>
            /// <param name="trns">SQL transaction.</param>
            /// <returns>Parent order.</returns>
            public Order GetParentOrder(SqlConnection cn, SqlTransaction trns) {
                int[] orderIds = { ParentOrderId };
                return GetOrdersByOrderIds(orderIds, cn, trns)[0];
            }
            /// <summary>
            /// Gets most of the order's by order id using provided connection. Formated for JSON.
            /// </summary>
            public Dictionary<string, object> GetOrderJson() {
                return GetOrderJson(this);
            }
            #endregion
            #region JSON Order Lookup Static Methods
            /// <summary>
            /// Gets most of the order's by order id using provided connection. Formated for JSON.
            /// </summary>
            /// <param name="orderId">The order id.</param>
            /// <param name="cn">The cn.</param>
            /// <param name="trans">The trans.</param>
            /// <returns></returns>
            public static Dictionary<string, object> GetOrderJson(int orderId, SqlConnection cn, SqlTransaction trans) {
                return GetOrderJson(null, orderId, null, cn, trans);
            }
            /// <summary>
            /// Gets most of the order's by order number using provided connection. Formated for JSON.
            /// </summary>
            /// <param name="orderNumber">The order number.</param>
            /// <param name="cn">The cn.</param>
            /// <param name="trans">The trans.</param>
            /// <returns></returns>
            public static Dictionary<string, object> GetOrderJson(string orderNumber, SqlConnection cn, SqlTransaction trans) {
                return GetOrderJson(orderNumber, -1, null, cn, trans);
            }
            /// <summary>
            /// Gets most of the order's info by reading an existing order object. Formated for JSON.
            /// </summary>
            /// <param name="order">The order.</param>
            /// <returns></returns>
            public static Dictionary<string, object> GetOrderJson(Commerce.Order order) {
                return GetOrderJson(null, -1, order, null, null);
            }
            /// <summary>
            /// Gets most of the order's info by order id.  Formated for JSON.
            /// </summary>
            /// <param name="orderId">The order id.</param>
            /// <returns></returns>
            public static Dictionary<string, object> GetOrderJson(int orderId) {
                return GetOrderJson(null, -1, null, null, null);
            }
            /// <summary>
            /// Gets most of the order's by order number.  Formated for JSON.
            /// </summary>
            /// <param name="orderNumber">The order number.</param>
            /// <returns></returns>
            public static Dictionary<string, object> GetOrderJson(string orderNumber) {
                return GetOrderJson(orderNumber, -1, null, null, null);
            }
            /// <summary>
            /// Gets most of the order's by info using various methods. Formated for JSON.
            /// </summary>
            /// <param name="orderNumber">The order number. Pass null if not used.</param>
            /// <param name="orderId">The order id. Pass a value less than 0 if not use.)</param>
            /// <param name="order">The order. If you already have an order object loaded you can pass it preventing addtional database queries.</param>
            /// <param name="cn">The sql connection.</param>
            /// <param name="trans">The transaction.</param>
            /// <returns></returns>
            public static Dictionary<string, object> GetOrderJson(string orderNumber, int orderId, Commerce.Order order,
                SqlConnection cn, SqlTransaction trans) {
                Dictionary<string, object> j = new Dictionary<string, object>();
                cn = (SqlConnection)Utilities.Iif(cn == null, Site.SqlConnection, cn);
                if(order == null) {
                    if(orderNumber != null) {
                        order = Commerce.Order.GetOrderByOrderNumber(orderNumber, cn, trans);
                    } else if(orderId > -1) {
                        order = Commerce.Order.GetOrderByOrderId(orderId, cn, trans);
                    }
                }
                if(order == null) {
                    j.Add("error", -1);
                    j.Add("description", String.Format("Order {0} not found.", orderNumber));
                    return j;
                }
                j.Add("error", 0);
                j.Add("description", "");
                j.Add("approvedBy", order.ApprovedBy);
                j.Add("billToAddress", order.BillToAddress);
                j.Add("canceled", order.Canceled);
                j.Add("closed", order.Closed);
                j.Add("comment", order.Comment);
                j.Add("deliverBy", order.DeliverBy);
                j.Add("discount", order.Discount);
                j.Add("FOB", order.FOB);
                j.Add("grandTotal", order.GrandTotal);
                j.Add("manifest", order.Manifest);
                j.Add("orderDate", order.OrderDate);
                j.Add("orderId", order.OrderId);
                j.Add("orderNumber", order.OrderNumber);
                j.Add("paid", order.Paid);
                j.Add("parentOrderId", order.ParentOrderId);
                j.Add("paymentMethodId", order.PaymentMethodId);
                j.Add("purchaseOrder", order.PurchaseOrder);
                j.Add("readyForExport", order.ReadyForExport);
                j.Add("recalculatedOn", order.RecalculatedOn);
                j.Add("requisitionedBy", order.RequisitionedBy);
                j.Add("scanned_order_image", order.ScannedOrderImage);
                j.Add("service1", order.Service1);
                j.Add("service2", order.Service2);
                j.Add("sessionId", order.SessionId);
                j.Add("shippingTotal", order.ShippingTotal);
                j.Add("shipToAddress", order.ShipToAddress);
                j.Add("soldBy", order.SoldBy);
                j.Add("subTotal", order.SubTotal);
                j.Add("taxTotal", order.TaxTotal);
                j.Add("term", order.Term);
                j.Add("user", order.User);
                j.Add("userId", order.UserId);
                j.Add("vendor_accountNo", order.VendorAccountNumber);
                j.Add("lastStatusId", order.LastStatusId);
                j.Add("lastStatus", order.LastStatus);
                List<Dictionary<string, object>> lines = new List<Dictionary<string, object>>();
                foreach(Commerce.Line line in order.Lines) {
                    Dictionary<string, object> l = new Dictionary<string, object>();
                    l.Add("addressId", line.AddressId);
                    l.Add("addTime", line.AddTime);
                    l.Add("backorderedQty", line.BackorderedQty);
                    l.Add("canceledQty", line.CanceledQty);
                    l.Add("cartId", line.CartId);
                    l.Add("customLineNumber", line.CustomLineNumber);
                    l.Add("epsmmcsAIFilename", line.EPSMMCSAIFileName);
                    l.Add("epsmmcsOutput", line.EPSMMCSOutput);
                    l.Add("estimatedFulfillmentDate", line.EstimatedFulfillmentDate);
                    l.Add("fulfillmentDate", line.FulfillmentDate);
                    l.Add("itemNumber", line.ItemNumber);
                    l.Add("kitAllocationCartId", line.KitAllocationCartId);
                    l.Add("kitAllocationId", line.KitAllocationId);
                    l.Add("kitQty", line.KitQty);
                    l.Add("lineDetail", line.LineDetail);
                    l.Add("lineNumber", line.LineNumber);
                    l.Add("noTaxValueCostTotal", line.NoTaxValueCostTotal);
                    l.Add("orderId", line.OrderId);
                    l.Add("orderNumber", line.OrderNumber);
                    l.Add("parentCartId", line.ParentCartId);
                    l.Add("price", line.Price);
                    l.Add("qty", line.Qty);
                    l.Add("serialId", line.SerialId);
                    l.Add("serialNumber", line.SerialNumber);
                    l.Add("shipmentId", line.ShipmentId);
                    l.Add("shipmentNumber", line.ShipmentNumber);
                    l.Add("showAsSeperateLineOnInvoice", line.ShowAsSeperateLineOnInvoice);
                    l.Add("valueCostTotal", line.ValueCostTotal);
                    l.Add("vendorItemKitAssignmentId", line.VendorItemKitAssignmentId);
                    l.Add("lastStatus", line.LastStatus);
                    l.Add("lastStatusId", line.LastStatusId);
                    Dictionary<string, object> form = new Dictionary<string, object>();
                    form.Add("HTML", line.Form.HtmlWithValues());
                    form.Add("name", line.Form.Name);
                    form.Add("inputs", line.Form.Inputs);
                    form.Add("ext", line.Form.Extention);
                    l.Add("form", form);
                    l.Add("item", Admin.GetItem(line.ItemNumber));
                    lines.Add(l);
                }
                j.Add("lines", lines);
                return j;
            }
            #endregion
            #region Order Lookup Static Methods
            /// <summary>
            /// Gets the child orders by serial id.
            /// </summary>
            /// <param name="serialId">The serial id.</param>
            /// <param name="cn">SQL connection.</param>
            /// <param name="trans">The trans.</param>
            /// <returns>
            /// A list of orders matching the serial ids.
            /// </returns>
            public static List<Order> GetChildOrdersBySerialId(int serialId, SqlConnection cn, SqlTransaction trans) {
                using(SqlCommand cmd = new SqlCommand(@"select orders.orderId 
				from serial_line with (nolock)
				inner join orders with (nolock) on serial_line.orderId = orders.parentOrderId
				where serial_line.serialId = @serialId", cn, trans)) {
                    cmd.Parameters.Add("@serialId", SqlDbType.Int).Value = serialId;
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        List<int> orderIds = new List<int>();
                        while(d.Read()) {
                            orderIds.Add(d.GetInt32(0));
                        }
                        return GetOrdersByOrderIds(orderIds.ToArray(), cn, trans);
                    }
                }
            }
            /// <summary>
            /// Gets the child orders by order id.
            /// </summary>
            /// <param name="orderId">The order id.</param>
            /// <param name="cn">SQL connection.</param>
            /// <param name="trans">The trans.</param>
            /// <returns>
            /// A list of orders matching the serial ids.
            /// </returns>
            public static List<Order> GetChildOrdersByOrderId(int orderId, SqlConnection cn, SqlTransaction trans) {
                using(SqlCommand cmd = new SqlCommand("select orderId from orders with (nolock) where parentOrderId = @orderId", cn, trans)) {
                    cmd.Parameters.Add("@orderId", SqlDbType.Int).Value = orderId;
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        List<int> orderIds = new List<int>();
                        while(d.Read()) {
                            orderIds.Add(d.GetInt32(0));
                        }
                        return GetOrdersByOrderIds(orderIds.ToArray(), cn, trans);
                    }
                }
            }
            /// <summary>
            /// Gets all the orders for the account.
            /// </summary>
            /// <param name="userId">The user id.</param>
            /// <returns>A list of orders for the account.</returns>
            public static List<Order> GetOrdersByUserId(int userId) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    return GetOrdersByUserId(userId, cn, null);
                }
            }
            /// <summary>
            /// Gets all the orders for the account.
            /// </summary>
            /// <param name="userId">The user id.</param>
            /// <param name="cn">SQL connection.</param>
            /// <param name="trans">The trans.</param>
            /// <returns>
            /// A list of orders for the account.
            /// </returns>
            public static List<Order> GetOrdersByUserId(int userId, SqlConnection cn, SqlTransaction trans) {
                using(SqlCommand cmd = new SqlCommand("select orderId from orders with (nolock) where userId = @userId", cn, trans)) {
                    cmd.Parameters.Add("@userId", SqlDbType.Int).Value = userId;
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        List<int> orderIds = new List<int>();
                        while(d.Read()) {
                            orderIds.Add(d.GetInt32(0));
                        }
                        return GetOrdersByOrderIds(orderIds.ToArray(), cn, trans);
                    }
                }
            }
            /// <summary>
            /// Gets the order by session id.
            /// </summary>
            /// <param name="sessionId">The session id.</param>
            /// <param name="cn">SQL connection.</param>
            /// <param name="trans">The trans.</param>
            /// <returns>
            /// The matching order.
            /// </returns>
            public static Order GetOrderBySessionId(Guid sessionId, SqlConnection cn, SqlTransaction trans) {
                using(SqlCommand cmd = new SqlCommand("select orderId from orders with (nolock) where sessionId = @sessionId", cn, trans)) {
                    cmd.Parameters.Add("@sessionId", SqlDbType.UniqueIdentifier).Value = new Guid(sessionId.ToString());
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        while(d.Read()) {
                            int[] orderIds = { d.GetInt32(0) };
                            return GetOrdersByOrderIds(orderIds, cn, trans)[0];
                        }
                    }
                }
                return null;
            }
            /// <summary>
            /// Gets the order by purchase order number.
            /// </summary>
            /// <param name="purchaseOrder">The purchase order.</param>
            /// <param name="cn">SQL connection.</param>
            /// <param name="trans">The trans.</param>
            /// <returns>
            /// The matching order.
            /// </returns>
            public static Order GetOrderByPurchaseOrder(string purchaseOrder, SqlConnection cn, SqlTransaction trans) {
                using(SqlCommand cmd = new SqlCommand("select orderId from orders with (nolock) where purchaseOrder = @purchaseOrder", cn, trans)) {
                    cmd.Parameters.Add("@purchaseOrder", SqlDbType.VarChar).Value = purchaseOrder;
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        while(d.Read()) {
                            int[] orderIds = { d.GetInt32(0) };
                            return GetOrdersByOrderIds(orderIds, cn, trans)[0];
                        }
                    }
                }
                return null;
            }
            /// <summary>
            /// Gets the order by order number.
            /// </summary>
            /// <param name="orderNumber">The order number.</param>
            /// <param name="cn">SQL connection.</param>
            /// <param name="trans">The trans.</param>
            /// <returns>
            /// The matching order.
            /// </returns>
            public static Order GetOrderByOrderNumber(string orderNumber, SqlConnection cn, SqlTransaction trans) {
                using(SqlCommand cmd = new SqlCommand("select orderId from cart with (nolock) where orderNumber = @orderNumber", cn, trans)) {
                    cmd.Parameters.Add("@orderNumber", SqlDbType.VarChar).Value = orderNumber;
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        while(d.Read()) {
                            int[] orderIds = { d.GetInt32(0) };
                            return GetOrdersByOrderIds(orderIds, cn, trans)[0];
                        }
                    }
                }
                return null;
            }
            /// <summary>
            /// Gets the order by serial number.
            /// </summary>
            /// <param name="serialNumber">The serialNumber number.</param>
            /// <param name="cn">SQL connection.</param>
            /// <param name="trans">The trans.</param>
            /// <returns>
            /// The matching order.
            /// </returns>
            public static Order GetOrderBySerialNumber(string serialNumber, SqlConnection cn, SqlTransaction trans) {
                using(SqlCommand cmd = new SqlCommand("select orderId from cart with (nolock) where serialNumber = @serialNumber", cn, trans)) {
                    cmd.Parameters.Add("@serialNumber", SqlDbType.VarChar).Value = serialNumber;
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        while(d.Read()) {
                            int[] orderIds = { d.GetInt32(0) };
                            return GetOrdersByOrderIds(orderIds, cn, trans)[0];
                        }
                    }
                }
                return null;
            }
            /// <summary>
            /// Gets the order by shipment number.
            /// </summary>
            /// <param name="shipmentNumber">The shipment number.</param>
            /// <param name="cn">SQL connection.</param>
            /// <param name="trans">The trans.</param>
            /// <returns>
            /// The matching order.
            /// </returns>
            public static Order GetOrderByShipmentNumber(string shipmentNumber, SqlConnection cn, SqlTransaction trans) {
                using(SqlCommand cmd = new SqlCommand("select orderId from cart with (nolock) where shipmentNumber = @shipmentNumber", cn, trans)) {
                    cmd.Parameters.Add("@shipmentNumber", SqlDbType.VarChar).Value = shipmentNumber;
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        while(d.Read()) {
                            int[] orderIds = { d.GetInt32(0) };
                            return GetOrdersByOrderIds(orderIds, cn, trans)[0];
                        }
                    }
                }
                return null;
            }
            /// <summary>
            /// Gets the order by cart id.
            /// </summary>
            /// <param name="cartId">The cart id.</param>
            /// <param name="cn">SQL connection.</param>
            /// <param name="trans">The trans.</param>
            /// <returns>
            /// The matching order.
            /// </returns>
            public static Order GetOrderByCartId(Guid cartId, SqlConnection cn, SqlTransaction trans) {
                using(SqlCommand cmd = new SqlCommand("select orderId from cart with (nolock) where cartId = @cartId", cn, trans)) {
                    cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = new Guid(cartId.ToString());
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        while(d.Read()) {
                            int[] orderIds = { d.GetInt32(0) };
                            return GetOrdersByOrderIds(orderIds, cn, trans)[0];
                        }
                    }
                }
                return null;
            }
            /// <summary>
            /// Gets the order by serial id.
            /// </summary>
            /// <param name="serialId">The serial id.</param>
            /// <param name="cn">SQL connection.</param>
            /// <param name="trans">The trans.</param>
            /// <returns>
            /// The matching order.
            /// </returns>
            public static Order GetOrderBySerialId(int serialId, SqlConnection cn, SqlTransaction trans) {
                using(SqlCommand cmd = new SqlCommand("select orderId from serial_line with (nolock) where serialId = @serialId", cn, trans)) {
                    cmd.Parameters.Add("@serialId", SqlDbType.Int).Value = serialId;
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        while(d.Read()) {
                            int[] orderIds = { d.GetInt32(0) };
                            return GetOrdersByOrderIds(orderIds, cn, trans)[0];
                        }
                    }
                }
                return null;
            }
            /// <summary>
            /// Gets the order by order id.
            /// </summary>
            /// <param name="id">The id.</param>
            /// <returns>The matching order</returns>
            public static Order GetOrderByOrderId(int id) {
                int[] orderIds = { id };
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    return GetOrdersByOrderIds(orderIds, cn, null)[0];
                }
            }
            /// <summary>
            /// Gets the order by order id.
            /// </summary>
            /// <param name="id">The id.</param>
            /// <param name="cn">SQL connection.</param>
            /// <param name="trns">SQL transaction.</param>
            /// <returns>The matching order.</returns>
            public static Order GetOrderByOrderId(int id, SqlConnection cn, SqlTransaction trns) {
                int[] orderIds = { id };
                return GetOrdersByOrderIds(orderIds, cn, trns)[0];
            }
            /// <summary>
            /// Gets the orders by order ids.
            /// </summary>
            /// <param name="ids">The ids.</param>
            /// <param name="fcn">SQL connection.</param>
            /// <param name="ftrns">SQL transaction.</param>
            /// <returns>The matching orders.</returns>
            public static List<Order> GetOrdersByOrderIds(int[] ids, SqlConnection fcn, SqlTransaction ftrns) {
                List<Order> orders = new List<Order>();
                if(ids.Length == 0) { return orders; };
                List<SqlDataRecord> rowData = new List<SqlDataRecord>();
                SqlMetaData[] hashTable = { 
					new SqlMetaData("keyName",SqlDbType.VarChar,100),
					new SqlMetaData("keyValue",SqlDbType.Variant),
					new SqlMetaData("primary_key",SqlDbType.Bit),
					new SqlMetaData("dataType",SqlDbType.VarChar,50),
					new SqlMetaData("dataLength",SqlDbType.Int),
					new SqlMetaData("varCharMaxValue",SqlDbType.VarChar,-1)
				};
                StringBuilder s = new StringBuilder();
                foreach(int id in ids) {
                    SqlDataRecord rec = new SqlDataRecord(hashTable);
                    rec.SetValue(0, "orderId");
                    rec.SetValue(1, id);
                    rec.SetBoolean(2, false);
                    rec.SetString(3, "int");
                    rec.SetValue(4, 8);
                    rowData.Add(rec);
                }
                SqlConnection cn;
                if(fcn != null) {
                    cn = fcn;
                } else {
                    cn = Site.SqlConnection;
                }
                using(SqlCommand cmd = cn.CreateCommand()) {
                    if(fcn != null) {
                        cmd.Transaction = ftrns;
                    }
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "dbo.getOrders";
                    cmd.Parameters.Add("@orderIds", SqlDbType.Structured);
                    cmd.Parameters["@orderIds"].Direction = ParameterDirection.Input;
                    cmd.Parameters["@orderIds"].Value = rowData;
                    using(SqlDataReader u = cmd.ExecuteReader()) {
                        int orderId = -1;
                        DateTime orderDate = DateTime.MinValue;
                        decimal grandTotal = 0;
                        decimal taxTotal = 0;
                        decimal subTotal = 0;
                        decimal shippingTotal = 0;
                        decimal service1 = 0;
                        decimal service2 = 0;
                        string manifest = "";
                        string purchaseOrder = "";
                        decimal discount = 0;
                        string comment = "";
                        decimal paid = 0;
                        Guid billToAddressId = Guid.Empty;
                        bool closed = false;
                        bool canceled = false;
                        Guid paymentMethodId = Guid.Empty;
                        int termId = -1;
                        int userId = -1;
                        string orderNumber = "";
                        bool creditMemo = false;
                        string scanned_order_image = "";
                        DateTime readyForExport = DateTime.MinValue;
                        DateTime recalculatedOn = DateTime.MinValue;
                        Guid sessionId = Guid.Empty;
                        int soldBy = -1;
                        int requisitionedBy = -1;
                        int approvedBy = -1;
                        DateTime deliverBy = DateTime.MinValue;
                        string vendor_accountNo = "";
                        string FOB = "";
                        int parentOrderId = -1;
                        int order_status = -1;
                        List<Line> lines = new List<Line>();
                        while(u.Read()) {
                            /* #44 is orderId */
                            if(u.GetInt32(44) != orderId && orderId != -1) {
                                /*the orderId has changed, add the previous order */
                                orders.Add(new Order(
                                    orderId, orderDate, grandTotal, taxTotal, subTotal, shippingTotal, service1,
                                    service2, manifest, purchaseOrder, discount, comment, paid, billToAddressId, closed,
                                    canceled, paymentMethodId, termId, userId, orderNumber, creditMemo, scanned_order_image,
                                    readyForExport, recalculatedOn, sessionId, soldBy, requisitionedBy, approvedBy, deliverBy,
                                    vendor_accountNo, FOB, parentOrderId, lines, order_status, cn, ftrns
                                ));
                                lines = new List<Line>();/* create a new list of lines for the next order */
                            }
                            orderId = u.GetInt32(44);
                            orderDate = u.GetDateTime(132);
                            grandTotal = u.GetDecimal(133);
                            taxTotal = u.GetDecimal(134);
                            subTotal = u.GetDecimal(135);
                            shippingTotal = u.GetDecimal(136);
                            service1 = u.GetDecimal(137);
                            service2 = u.GetDecimal(138);
                            manifest = u.GetString(139);
                            purchaseOrder = u.GetString(140);
                            discount = u.GetDecimal(164);
                            comment = u.GetString(141);
                            paid = u.GetDecimal(190);
                            billToAddressId = u.GetGuid(103);
                            closed = u.GetBoolean(191);
                            canceled = u.GetBoolean(191);
                            termId = u.GetInt32(84);
                            userId = u.GetInt32(55);
                            orderNumber = u.GetString(46);
                            creditMemo = u.GetBoolean(193);
                            scanned_order_image = u.GetString(53);
                            readyForExport = u.GetDateTime(7);
                            recalculatedOn = u.GetDateTime(194);
                            sessionId = u.GetGuid(38);
                            soldBy = u.GetInt32(195);
                            requisitionedBy = u.GetInt32(196);
                            approvedBy = u.GetInt32(197);
                            deliverBy = u.GetDateTime(198);
                            vendor_accountNo = u.GetString(199);
                            FOB = u.GetString(200);
                            parentOrderId = u.GetInt32(201);
                            order_status = u.GetInt32(5);
                            /* always add every line */
                            lines.Add(new Line(
                                u.GetGuid(37)/*cartId*/,
                                u.GetGuid(38)/*sessionId*/,
                                u.GetInt32(39)/*qty*/,
                                u.GetString(0)/*itemNumber*/,
                                u.GetDecimal(41)/*price*/,
                                u.GetDateTime(42)/*add time*/,
                                u.GetInt32(44)/*orderId*/,
                                u.GetInt32(45)/*serialId*/,
                                u.GetString(46)/*orderNumber*/,
                                u.GetString(47)/*serialNumber*/,
                                u.GetGuid(48)/*addressId*/,
                                u.GetInt32(49)/*shipmentId*/,
                                u.GetString(50)/*shipmentNumber*/,
                                u.GetInt32(51)/*lineNumber*/,
                                u.GetString(52)/*epsmmcsoutput*/,
                                u.GetString(54)/*epsmmcsfilename*/,
                                u.GetDecimal(170)/*valueCostTotal*/,
                                u.GetDecimal(171)/*noTaxValueCostTotal*/,
                                u.GetDateTime(203)/*fullfillmentDate*/,
                                u.GetDateTime(204)/*estimatedFulfillmentDate*/,
                                u.GetGuid(202)/*parentCartId*/,
                                u.GetInt32(12)/*backorderedqty*/,
                                u.GetInt32(13)/*canceledQty*/,
                                u.GetString(174)/*customLineNumber*/,
                                u.GetInt32(205)/*kitAllocationId*/,
                                u.GetInt32(206)/*kitQty*/,
                                u.GetBoolean(207)/*showAsSeperateLineOnInvoice*/,
                                u.GetGuid(208)/*vendorItemKitAssignmentId*/,
                                u.GetGuid(209)/*kitAllocationCartId*/,
                                u.GetInt32(1)/*line_status*/
                            ));
                        }
                        /* add the last order */
                        orders.Add(new Order(
                            orderId, orderDate, grandTotal, taxTotal, subTotal, shippingTotal, service1,
                            service2, manifest, purchaseOrder, discount, comment, paid, billToAddressId, closed,
                            canceled, paymentMethodId, termId, userId, orderNumber, creditMemo, scanned_order_image,
                            readyForExport, recalculatedOn, sessionId, soldBy, requisitionedBy, approvedBy, deliverBy,
                            vendor_accountNo, FOB, parentOrderId, lines, order_status, cn, ftrns
                        ));
                        /* now all the shipments that belong to the orders */
                        u.NextResult();
                        while(u.Read()) {
                            int shipmentOrderId = u.GetInt32(0);
                            /* find the order that goes to this shipment */
                            Commerce.Order sOrd = orders.Find(delegate(Commerce.Order ord) {
                                return ord.OrderId == shipmentOrderId;
                            });
                            if(sOrd == null) { continue; }
                            /*
                            cart.orderId,addressUpdateId,cart.shipmentNumber,tracking,
                            dateShipped,actualWeight,actualService,actualCost,
                            actualBilledWeight,packageLength,packageWidth,
                            packageHeight,thirdPartyAccount,voidStatus,
                            emailSent,addDate 
                            */
                            Shipment shp = new Shipment(sOrd.ShipToAddress, sOrd,
                            u.GetGuid(1), u.GetString(2), u.GetString(3),
                            u.GetString(4), u.GetString(5),
                            u.GetString(6), u.GetString(7),
                            u.GetString(8), u.GetString(9),
                            u.GetString(10), u.GetString(11),
                            u.GetString(12), u.GetString(13),
                            u.GetDateTime(14), u.GetDateTime(15));
                            sOrd.Shipments.Add(shp);
                        }
                        /* next batch... line detail 
                        cartDetailId, cartDetail.cartId,
                        inputName, value, cartDetail.sessionId */
                        u.NextResult();
                        while(u.Read()) {
                            LineDetail lineDetail = new LineDetail(
                                u.GetGuid(0),
                                u.GetGuid(1),
                                u.GetGuid(4),
                                u.GetString(2),
                                u.GetString(3)
                            );
                            /* find the line to attach this line detail to */
                            Line line = lines.Find(delegate(Commerce.Line l) {
                                return l.CartId == lineDetail.CartId;
                            });
                            if(line != null) {
                                line.LineDetail.Add(lineDetail);
                            }
                        }
                        /* next batch... form source
                        * order_line_forms.cartId, sourceCode, formName  */
                        u.NextResult();
                        while(u.Read()) {
                            Guid id = u.GetGuid(0);
                            Line line = lines.Find(delegate(Commerce.Line l) {
                                return l.CartId == id;
                            });
                            if(line != null) {
                                if(u.IsDBNull(1)) {
                                    line.SourceCode = "";
                                    line.FormName = "NO FORM";
                                } else {
                                    line.SourceCode = u.GetString(1);
                                    line.FormName = u.GetString(2);
                                }
                            }
                        }
                    }
                }
                return orders;
            }
            #endregion
        }
    }
}
