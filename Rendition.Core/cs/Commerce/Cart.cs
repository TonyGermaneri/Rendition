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
		/// <summary>
		/// This class creates a cart with items drawn from the database
		/// </summary>
		public class Cart {
            #region Constants
            internal const string UPDATE_CART_QUERY = @"if exists(select 0 from cart where cartId = @cartId) begin
	declare @sessionId uniqueidentifier;
	declare @wholesale bit;
	declare @userId int;
	declare @emptyGUID uniqueidentifier = '{00000000-0000-0000-0000-000000000000}';
	select @sessionId = sessionId, @userId = userId from cart where cartId = @cartId
	set @wholesale = (select wholeSaleDealer from users where userId = @userId)
	if @qty = 0 begin
		delete from cartDetail where cartId = @cartId;
		delete from cart where cartId = @cartId;
	end else begin
		update Cart set qty = @qty, 
		addressId = case when @addressId = @emptyGUID then
			addressId
		else
			@addressId
		end,
		price = case when @setPrice = 1 then 
			@price 
		else 
			price 
		end 
		where cartID = @cartId;
	end
end";
            #endregion
            #region Private Fields
            /// <summary>
			/// The session of this cart.
			/// </summary>
			internal Session Session;
            /// <summary>
            /// The site this cart belongs to.
            /// </summary>
            internal Site Site;
            #endregion
            #region Instance Properties
            /// <summary>
			/// List of cart items in this cart.
			/// </summary>
            public List<CartItem> Items { get; internal set; }
			/// <summary>
			/// List of addresses associated with line items in this account.
			/// </summary>
            public List<Address> Addresses { get; internal set; }
			/// <summary>
			/// Estimated shipping cost.
			/// </summary>
            public decimal EstShippingCost { get; internal set; }
			/// <summary>
			/// The estimated total of all shipping costs.
			/// </summary>
            public decimal EstShipTotal { get; internal set; }
			/// <summary>
			/// Sub total.
			/// </summary>
            public decimal SubTotal { get; internal set; }
			/// <summary>
			/// Grand Total.
			/// </summary>
            public decimal GrandTotal { get; internal set; }
			/// <summary>
			/// Tax total.
			/// </summary>
            public decimal TaxTotal { get; internal set; }
			/// <summary>
			/// Discount Total.
			/// </summary>
            public decimal DiscountTotal { get; internal set; }
            /// <summary>
            /// Gets the bill to address.
            /// </summary>
            public Commerce.Address BillToAddress {
                get {
                    Commerce.Address billTo = this.Addresses.Find(delegate(Rendition.Commerce.Address adr) {
                        return this.Session.Id == adr.Id;
                    });
                    if(billTo == null) {/* if the address does not exist yet, create it now */
                        billTo = Commerce.Address.CreateAddress();

                    }
                    return billTo;
                }
            }
            /// <summary>
            /// Gets the first ship to address.
            /// </summary>
            public Commerce.Address ShipToAddress {
                get {
                    Commerce.Address shipTo = this.Addresses.Find(delegate(Rendition.Commerce.Address adr) {
                        return this.Session.Id != adr.Id;
                    });
                    if(shipTo == null) {/* if the address does not exist yet, create it now */
                        shipTo = Commerce.Address.CreateAddress();
                    }
                    if(shipTo.Rate == null) {
                        shipTo.Rate = Main.Site.Rates.List.Find(delegate(Commerce.Rate r) {
                            return r.Id == -1;
                        });
                    }
                    return shipTo;
                }
            }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Cart"/> class.
			/// </summary>
			/// <param name="f_session">The f_session.</param>
			/// <param name="f_site">The f_site.</param>
			public Cart( Session f_session, Site f_site ) {
                EstShippingCost = 0;
                EstShipTotal = 0;
                SubTotal = 0;
                GrandTotal = 0;
                TaxTotal = 0;
                DiscountTotal = 0;
                Items = new List<CartItem>();
                Addresses = new List<Address>();
                Session = f_session;
				Site = f_site;
			}
            #endregion
            #region Instance Methods
            /// <summary>
			/// Creates an item used to populate the class _cart. 
			/// This method does not add items to the database.
			/// </summary>
			/// <param name="cartId">Cart Id of the item</param>
			/// <returns>matching _cart_item</returns>
			public CartItem GetItemById( Guid cartId ) {
				return Items.Find( delegate( CartItem ci ) {
					return ci.CartId == cartId;
				} );
			}
            /// <summary>
            /// Emptys cart in memory and then refreshes it from the database
            /// </summary>
            public void Refresh() {
                Refresh(null, null);
            }
            /// <summary>
            /// Emptys cart in memory and then refreshes it from the database
            /// </summary>
            public void Refresh(SqlConnection cn, SqlTransaction trans) {
                string commandText = "dbo.getCart @sessionId";
                SqlCommand cmd;
                if(cn == null) {
                    cmd = new SqlCommand(commandText, Site.SqlConnection);
                } else {
                    cmd = new SqlCommand(commandText, cn, trans);
                }
                cmd.Parameters.Add("@sessionId", SqlDbType.UniqueIdentifier).Value = new Guid(Session.Id.ToString());
                this.EstShipTotal = 0;
                SqlDataReader raw;
                Guid crnt = Guid.Empty;
                Guid crnt_d = Guid.Empty;
                CartItem i = null;
                Address addr = null;
                Addresses.Clear();
                bool shippingServiceWasSelected = false;
                decimal default_rate_cost = 0;
                using(raw = cmd.ExecuteReader()) {
                    /* cartDetailId,cartId,itemnumber,price,qty,
                     * i.addressId,value,inputName,o.estShipPrice,subTotal,
                     * taxTotal,addtime,parentCartId */
                    Items.Clear();
                    while(raw.Read()) {
                        if(crnt == Guid.Empty) {
                            SubTotal = Math.Round(raw.GetDecimal(9), 2, MidpointRounding.AwayFromZero);
                            TaxTotal = Math.Round(raw.GetDecimal(10), 2, MidpointRounding.AwayFromZero);
                        };
                        if(crnt != raw.GetGuid(1)) {
                            /* construct the form inputs */
                            i = new CartItem(raw.GetString(2), raw.GetGuid(1), raw.GetDecimal(3), raw.GetInt32(4), raw.GetGuid(5), raw.GetDateTime(11), Session);
                            i.ParentCartId = raw.GetGuid(12);
                            Items.Add(i);
                            crnt = raw.GetGuid(1);
                        }
                        if(i.Item.Form != null) {
                            Input f = new Input(raw.GetString(7), raw.GetString(6));
                            f.Id = raw.GetGuid(0);
                            i.Inputs.Add(f);
                            /* make a copy of the items form */
                            i.Form = new Form(i.Item, i.Item.Form.SourceCode, i.Item.Form.Name);
                            i.Form.CartItem = i;
                        }
                        crnt_d = raw.GetGuid(1);
                    }
                    raw.Close();

                }
                /* make a reference to this CartItem on the form for the form's event handler */
                commandText = "dbo.getCartContacts @sessionId";
                if(cn == null) {
                    cmd = new SqlCommand(commandText, Site.SqlConnection);
                } else {
                    cmd = new SqlCommand(commandText, cn, trans);
                }
                cmd.Parameters.Add("@sessionId", SqlDbType.UniqueIdentifier).Value = new Guid(Session.Id.ToString());
                //ContactID, userID, FirstName, LastName, Address1, Address2, City, State, ZIP, Country, HomePhone, WorkPhone, 
                //Email, SpecialInstructions, Comments, sessionID, sendShipmentUpdates, emailads, rate, dateCreated, Company, 
                //rate,selected,shippingname,selectedZip,shipZone,estShipCost
                using(raw = cmd.ExecuteReader()) {
                    while(raw.Read()) {
                        /* the contact with the sessionId == contactId is the bill to Address */
                        if(crnt != raw.GetGuid(0)) {
                            crnt = raw.GetGuid(0);
                            addr = new Address(
                                raw.GetGuid(0),
                                raw.GetString(2),
                                raw.GetString(3),
                                raw.GetString(4),
                                raw.GetString(5),
                                raw.GetString(6),
                                raw.GetString(7),
                                raw.GetString(8),
                                raw.GetString(9),
                                raw.GetString(10),
                                raw.GetString(11),
                                raw.GetString(12),
                                raw.GetString(13),
                                raw.GetString(14),
                                raw.GetBoolean(16),
                                raw.GetBoolean(17),
                                Main.Site.Rates.List.Find(delegate(Rate rate) {
                                return rate.Id == raw.GetInt32(18);
                            }),
                                raw.GetDateTime(19),
                                raw.GetString(20)
                            );
                            Addresses.Add(addr);
                        }
                        /* this goes outside of the "crnt!=raw.GetGuid(0)" condition above */
                        Rate r = Main.Site.Rates.List.Find(delegate(Rate rate) {
                            return rate.Id == raw.GetInt32(33);
                        });
                        r.Selected = raw.GetBoolean(55);
                        r.ShipZone = raw.GetInt32(47);
                        /* TODO event handler calculate shipping */
                        r.EstShippingCost = Math.Round(raw.GetDecimal(26), 2);
                        if(!addr.Rates.Contains(r)) {
                            addr.Rates.Add(r);
                        }
                        if(r.Id == Main.Site.default_rateId) {
                            /* get the price for the default method, in case no rate, or an invalid/disabled rate was selected */
                            default_rate_cost = Math.Round(raw.GetDecimal(26), 2);
                        }
                        if(r.Selected && addr.Id != Session.Id) {
                            shippingServiceWasSelected = true;
                            EstShippingCost = r.EstShippingCost;
                            this.EstShipTotal = EstShippingCost;
                        }
                    }
                    raw.Close();
                }
                cmd.Dispose();
                if(!shippingServiceWasSelected) {
                    /* update with the default price now so the user doesn't see uncalculated shipping ever */
                    EstShippingCost = default_rate_cost;
                    this.EstShipTotal += EstShippingCost;
                    /* update this person to have the default rate selected */
                    commandText = "dbo.updateShippingMethod @addressId,@rateId";
                    if(cn == null) {
                        cmd = new SqlCommand(commandText, Site.SqlConnection);
                    } else {
                        cmd = new SqlCommand(commandText, cn, trans);
                    }
                    cmd.Parameters.Add("@addressId", SqlDbType.UniqueIdentifier).Value = new Guid(Session.Id.ToString());
                    cmd.Parameters.Add("@rateId", SqlDbType.Int).Value = Main.Site.default_rateId;
                    cmd.ExecuteNonQuery();
                    cmd.Dispose();
                }
                CalculateDiscountEventArgs args = new CalculateDiscountEventArgs(this, Session.User, Session, null);
                try {
                    Main.Site.raiseOnCalculateDiscount(args);
                } catch(Exception ex) {
                    ("raiseOncalculatediscount exception => " + ex.Message).Debug(3);
                    args.Discount = 0;
                }
                DiscountTotal = args.Discount;
                GrandTotal = EstShippingCost + SubTotal + TaxTotal - DiscountTotal;
            }
            #endregion
            #region Static Methods
            /// <summary>
            /// Recalculates the selected cart by its SessionId
            /// </summary>
            /// <param name="args">The args.</param>
            /// <returns>
            /// {error:int,errorDescription:string,subTotal:float,taxTotal:float,estShipTotal:float,discountTotal:float,grandTotal:float}.
            /// </returns>
            public static Dictionary<string, object> Recalculate(Dictionary<string, object> args) {
                ("FUNCTION recalculate (cart)").Debug(10);
                Dictionary<string, object> j = new Dictionary<string, object>();
                Session session;
                if(args.ContainsKey("sessionId")) {
                    session = new Session(Main.Site, new Guid(args["sessionId"].ToString()));
                } else {
                    session = Main.GetCurrentSession();
                }
                if(args.ContainsKey("billToContactId") || args.ContainsKey("shipToContactId")) {
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
                    if(args.ContainsKey("shipToContactId")) {
                        stAddr.Add("contactId", stAddr["ContactId"].ToString());
                        stAddr.Remove("ContactId");
                    }
                    if(args.ContainsKey("billToContactId")) {
                        btAddr.Add("contactId", btAddr["ContactId"].ToString());
                        btAddr.Remove("ContactId");
                    }
                    /* update the bill to and ship to addresses in the database 
                     * if the Address does not exist, validate it and insert it.
                     */
                    if(stAddr.Count > 0) {
                        stAddr.Add("sessionId", session.Id.ToString());
                        stAddr.Add("userId", session.UserId.ToString());
                        Address.UpdateContact(stAddr);
                    }
                    if(btAddr.Count > 0) {
                        btAddr.Add("sessionId", session.Id.ToString());
                        btAddr.Add("userId", session.UserId.ToString());
                        Address.UpdateContact(btAddr);
                    }
                }
                /* if the cart isn't populated, do that now */
                if(session.Cart.Items.Count == 0) {
                    session.Cart.Refresh();
                }
                /* execute recalculateCart events */
                RecalculateCartEventArgs ev = new RecalculateCartEventArgs(session.Cart,
                session, HttpContext.Current, args);
                Main.Site.raiseOnrecalculatecart(ev);
                /* refresh again to reflect changes in the addresses */
                session.Cart.Refresh();
                j.Add("error", 0);
                j.Add("description", "");
                j.Add("subTotal", (float)session.Cart.SubTotal);
                j.Add("taxTotal", (float)session.Cart.TaxTotal);
                j.Add("estShipTotal", (float)session.Cart.EstShipTotal);
                j.Add("discountTotal", (float)session.Cart.DiscountTotal);
                j.Add("grandTotal", (float)session.Cart.GrandTotal);
                j.Add("addresses", session.Cart.Addresses);
                return j;
            }
            /// <summary>
            /// Updates the cart based on the dictionary provided.
            /// Pass the quantity of the item as qty+jguid(cartId) or as the jguid(cartId)
            /// All other form variables should be passed using their cartDetailId.
            /// </summary>
            /// <param name="args">The args.</param>
            /// <returns>{error:0,desc:"error description",items:item Collection,subTotal:x,taxTotal:x,estShipTotal:x,discountTotal:x,grandTotal:x,addresses:addressCollection}.</returns>
            public static Dictionary<string, object> UpdateCart(Dictionary<string, object> args) {
                ("FUNCTION /w SP updateCart").Debug(10);
                Dictionary<string, object> j = new Dictionary<string, object>();
                Session session = null;
                if(args.ContainsKey("sessionId")) {
                    session = new Session(Main.Site, new Guid((string)args["sessionId"]));
                } else {
                    session = Main.GetCurrentSession();
                }
                if(session.Cart.Items.Count == 0) {
                    session.Cart.Refresh();
                }
                foreach(Commerce.CartItem i in session.Cart.Items) {
                    /* check for each QTY key, if the key exists then update this item. */
                    if(args.ContainsKey(i.CartId.EncodeXMLId())) {
                        string formId = i.CartId.EncodeXMLId();
                        int qty = 0;/* if a qty was passed, and it turns out not to be numeric, then you loose the item */
                        if(!int.TryParse(args[formId].ToString(), out qty)) {
                            qty = 0;
                        }
                        Guid addressId = Guid.Empty;
                        if(args.ContainsKey("addressId")) {
                            addressId = new Guid(args["addressId"].ToString());
                        }
                        SqlCommand cmd = new SqlCommand(Cart.UPDATE_CART_QUERY, Site.SqlConnection);
                        cmd.Parameters.Add("@qty", SqlDbType.Int).Value = args[i.CartId.EncodeXMLId()];
                        cmd.Parameters.Add("@price", SqlDbType.Money).Value = 0;
                        cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = new Guid(i.CartId.ToString());
                        cmd.Parameters.Add("@setPrice", SqlDbType.Bit).Value = false;
                        cmd.Parameters.Add("@addressId", SqlDbType.UniqueIdentifier).Value = addressId;
                        cmd.ExecuteNonQuery();
                        cmd.Dispose();
                        UpdateCartDetail(i, args);
                    }
                }
                session.Cart.Refresh();
                List<object> items = new List<object>();
                foreach(Commerce.CartItem i in session.Cart.Items) {
                    Dictionary<string, object> jt = new Dictionary<string, object>();
                    jt.Add("cartId", i.CartId);
                    jt.Add("price", i.Price);
                    jt.Add("qty", i.Qty);
                    jt.Add("addressId", i.AddressId);
                    jt.Add("inputs", i.Inputs);
                    items.Add(jt);
                }
                j.Add("items", items);
                j.Add("subTotal", (float)session.Cart.SubTotal);
                j.Add("taxTotal", (float)session.Cart.TaxTotal);
                j.Add("estShipTotal", (float)session.Cart.EstShipTotal);
                j.Add("discountTotal", (float)session.Cart.DiscountTotal);
                j.Add("grandTotal", (float)session.Cart.GrandTotal);
                j.Add("addresses", session.Cart.Addresses);
                j.Add("error", 0);
                j.Add("description", "");
                return j;
            }
            /// <summary>
            /// updates an item or items in the selected sessions cart
            /// </summary>
            /// <param name="args">Dictionary Object containing sessionId, cartId, qty, and form inputs {key/value...}</param>
            /// <returns>Json Item Description with cart totals.</returns>
            public static Dictionary<string, object> UpdateCartItem(Dictionary<string, object> args) {
                ("FUNCTION /w SP updateCartItem").Debug(10);
                Dictionary<string, object> j = new Dictionary<string, object>();
                Session session = null;
                if(args.ContainsKey("sessionId")) {
                    session = new Session(Main.Site, new Guid((string)args["sessionId"]));
                } else {
                    session = Main.GetCurrentSession();
                }
                Guid cartId;
                if(args.ContainsKey("cartId")) {
                    if(args["cartId"].ToString().Contains("_")) {
                        cartId = Convert.ToString(args["cartId"]).DecodeXMLId();
                    } else {
                        cartId = new Guid(args["cartId"].ToString());
                    }
                    if(cartId == Guid.Empty) {
                        cartId = new Guid(Convert.ToString(args["cartId"]));
                    }
                } else {
                    /* cartId not found */
                    j.Add("error", -6);
                    j.Add("description", "cartId key not found");
                    return j;
                }
                session.Cart.Refresh();
                Commerce.CartItem ci = session.Cart.GetItemById(cartId);
                if(ci == null) {
                    /* item not found */
                    j.Add("error", -5);
                    j.Add("description", "cartId " + cartId.ToString() + "not found");
                    return j;
                } else {
                    int qty = ci.Qty;
                    decimal price = ci.Price;
                    if(args.ContainsKey(ci.XMLId)) {
                        if(!int.TryParse(args[ci.XMLId].ToString(), out qty)) {
                            qty = ci.Qty;
                        }
                    } else if(args.ContainsKey("qty")) {
                        if(!int.TryParse(args["qty"].ToString(), out qty)) {
                            qty = ci.Qty;
                        }
                    }
                    bool setPrice = false;
                    /* allow changing prices when the user is an administrator or when the site is a POS */
                    if(session.Administrator || Main.Site.Defaults.SiteUrl == "POS") {
                        if(args.ContainsKey("price")) {
                            price = Convert.ToDecimal(args["price"]);
                            setPrice = true;
                        }
                    }
                    Guid addressId = Guid.Empty;
                    if(args.ContainsKey("addressId")) {
                        addressId = new Guid(args["addressId"].ToString());
                    }
                    /* update quantity */
                    SqlCommand cmd = new SqlCommand(Cart.UPDATE_CART_QUERY, Site.SqlConnection);
                    cmd.Parameters.Add("@qty", SqlDbType.Int).Value = qty;
                    cmd.Parameters.Add("@price", SqlDbType.Money).Value = price;
                    cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = new Guid(ci.CartId.ToString());
                    cmd.Parameters.Add("@setPrice", SqlDbType.Bit).Value = setPrice;
                    cmd.Parameters.Add("@addressId", SqlDbType.UniqueIdentifier).Value = addressId;
                    cmd.ExecuteNonQuery();
                    cmd.Dispose();
                    if(ci.Item.Form != null) {
                        UpdateCartDetail(ci, args);
                    }
                    session.Cart.Refresh();
                    ci = session.Cart.GetItemById(cartId);
                    j.Add("error", 0);
                    j.Add("description", "");
                    j.Add("subTotal", (float)session.Cart.SubTotal);
                    j.Add("taxTotal", (float)session.Cart.TaxTotal);
                    j.Add("estShipTotal", (float)session.Cart.EstShipTotal);
                    j.Add("discountTotal", (float)session.Cart.DiscountTotal);
                    j.Add("grandTotal", (float)session.Cart.GrandTotal);
                    j.Add("addresses", session.Cart.Addresses);
                    if(ci != null) {
                        j.Add("itemNumber", ci.Item.Number);
                        j.Add("price", (float)ci.Price);
                        j.Add("qty", ci.Qty);
                        j.Add("cartId", ci.CartId.ToString());
                        j.Add("addressId", ci.Item.Number);
                        j.Add("sessionId", session.Id.ToString());
                        j.Add("packingSlipImage", ci.Item.PackingSlipImage);
                        j.Add("auxillaryImage", ci.Item.AuxillaryImage);
                        j.Add("cartImage", ci.Item.CartImage);
                        j.Add("detailImage", ci.Item.DetailImage);
                        j.Add("fullSizeImage", ci.Item.FullSizeImage);
                        j.Add("listingImage", ci.Item.ListingImage);
                        j.Add("listing2Image", ci.Item.Listing2Image);
                        j.Add("item_description", ci.Item.Description);
                        j.Add("form", ci.Item.FormName);
                    }
                    return j;
                }
            }
            private static Dictionary<string, object> UpdateCartDetail(CartItem ci, Dictionary<string, object> args) {
                Dictionary<string, object> d = new Dictionary<string, object>();
                Commerce.Input i;
                string value;
                /* update form values - 
                 * look for the cartId.encodeXMLId() or input.name in the key collection*/
                int inputCount = ci.Inputs.Count;
                for(int x = 0; inputCount > x; x++) {
                    i = ci.Inputs[x];
                    if(args.ContainsKey(i.Id.EncodeXMLId())) {
                        value = Convert.ToString(args[i.Id.EncodeXMLId()]);
                    } else {
                        if(args.ContainsKey(i.Name)) {
                            value = Convert.ToString(args[i.Name]);
                        } else {
                            value = null;
                        }
                    }
                    if(value != null) {
                        SqlCommand cmd = new SqlCommand("update cartdetail set value = @value where cartDetailID = @cartDetailId;", Site.SqlConnection);
                        i.Value = value;
                        cmd.Parameters.Add("@cartDetailId", SqlDbType.UniqueIdentifier).Value = new Guid(i.Id.ToString());
                        cmd.Parameters.Add("@value", SqlDbType.VarChar).Value = i.Value;
                        cmd.ExecuteNonQuery();
                        cmd.Dispose();
                        d.Add(i.Id.EncodeXMLId(), i.Value);
                    }
                }
                return d;
            }
            /// <summary>
            /// Deletes the cart item.
            /// </summary>
            /// <param name="args">{cartId:cartId}</param>
            /// <returns></returns>
            public static Dictionary<string, object> DeleteCartItem(Dictionary<string, object> args) {
                ("FUNCTION /w SP deleteCartItem").Debug(10);
                /* requires sessionId, cartId */
                Dictionary<string, object> j = new Dictionary<string, object>();
                if(args.ContainsKey("cartId")) {
                    SqlCommand cmd = new SqlCommand("dbo.deleteCartItem @cartId", Site.SqlConnection);
                    cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = new Guid((string)args["cartId"]);
                    cmd.ExecuteNonQuery();
                    cmd.Dispose();
                } else {
                    j.Add("error", -1);
                    j.Add("description", "Missing cartId key");
                    return j;
                }
                j.Add("error", 0);
                j.Add("description", "");
                return j;

            }
            /// <summary>
            /// empty the selected cart
            /// </summary>
            /// <param name="sessionId">Guid sessionId.</param>
            /// <returns>{success:bool}.</returns>
            public static Dictionary<string, object> EmptyCart(string sessionId) {
                ("FUNCTION /w SP emptyCart").Debug(10);
                Dictionary<string, object> j = new Dictionary<string, object>();
                Session session = null;
                if(sessionId.IsGuid()) {
                    session = new Session(Main.Site, new Guid(sessionId));
                } else {
                    session = Main.GetCurrentSession();
                }
                SqlCommand cmd = new SqlCommand("dbo.emptyCart @sessionId", Site.SqlConnection);
                cmd.Parameters.Add("@sessionId", SqlDbType.UniqueIdentifier).Value = session.Id;
                cmd.ExecuteNonQuery();
                j.Add("error", 0);
                j.Add("description", "");
                cmd.Dispose();
                return j;
            }
            /// <summary>
            /// Returns a _cart_item AND adds the selected item to the user's cart
            /// </summary>
            /// <param name="item_number">Number of the item you want to add to the user's cart</param>
            /// <param name="item_qty">Quantity of the item you want to add</param>
            /// <param name="session">session</param>
            /// <param name="args">The args.</param>
            /// <param name="price">The price.</param>
            /// <param name="allowPreorder">if set to <c>true</c> [allow preorder].</param>
            /// <param name="allow_priceOverride">if set to <c>true</c> [allow_price override].</param>
            /// <returns>
            /// Returns an empty string rather than a null from the Request[] object.
            /// </returns>
            internal static Commerce.CartItem AddToCartProc(string item_number, int item_qty, Session session,
            Dictionary<string, object> args, object price, bool allowPreorder, bool allow_priceOverride) {
                return addToCartProc(item_number, item_qty, session, args, price, allowPreorder, allow_priceOverride, null, null);
            }
            /// <summary>
            /// Returns a _cart_item AND adds the selected item to the user's cart within a transaction
            /// </summary>
            /// <param name="item_number">Number of the item you want to add to the user's cart</param>
            /// <param name="item_qty">Quantity of the item you want to add</param>
            /// <param name="session">session</param>
            /// <param name="args">The args.</param>
            /// <param name="price">The price.</param>
            /// <param name="allowPreorder">if set to <c>true</c> [allow preorder].</param>
            /// <param name="allow_price_override">if set to <c>true</c> [allow_price_override].</param>
            /// <param name="cn">The connection being used.</param>
            /// <param name="trans">The transaction being used.</param>
            /// <returns>
            /// Returns an empty string rather than a null from the Request[] object.
            /// </returns>
            internal static Commerce.CartItem addToCartProc(string item_number, int item_qty, Session session,
            Dictionary<string, object> args, object price, bool allowPreorder, bool allow_price_override, SqlConnection cn, SqlTransaction trans) {
                ("FUNCTION /w SP:Add to cart").Debug(10);
                Guid cartId = Guid.Empty;
                int error = -1;
                string itemNumber = "";
                decimal r_price = 0;
                int qty = 0;
                Guid r_addressId = Guid.Empty;
                string errorDesc = "";
                Commerce.Item item = Main.Site.Item(item_number);
                if(Site.AbortDefaultEvent == true) {
                    Site.AbortDefaultEvent = false;
                    return null;
                }
                /* if the item exists in the database */
                if(!(item != null)) { return null; };
                string addressId = Guid.Empty.ToString();
                if(args.ContainsKey("addressId")) {
                    if(args["addressId"] != null) {
                        if(Utilities.GuidPattern.IsMatch(args["addressId"].ToString())) {
                            addressId = args["addressId"].ToString();
                        }
                    }
                }
                string commandText = @"dbo.addToCart @itemnumber, @qty, @sessionid, @userid, @wholesale,
				@allow_Preorders, @unique_siteId, @new_price, @override_Price,
				@overrideAddressId, @override_allow_preorder";
                SqlCommand cmd;
                if(cn == null) {
                    cmd = new SqlCommand(commandText, Site.SqlConnection);
                } else {
                    cmd = new SqlCommand(commandText, cn, trans);
                }
                /* don't let people put items with zero qty in their cart */
                if(qty == 0) { qty = 1; }
                cmd.Parameters.Add("@itemnumber", SqlDbType.VarChar, 50).Value = item_number;
                cmd.Parameters.Add("@qty", SqlDbType.Int).Value = item_qty;
                cmd.Parameters.Add("@sessionid", SqlDbType.UniqueIdentifier).Value = new Guid(session.Id.ToString());
                cmd.Parameters.Add("@userid", SqlDbType.Int).Value = session.UserId;
                cmd.Parameters.Add("@wholesale", SqlDbType.Bit).Value = session.Wholesale;
                cmd.Parameters.Add("@allow_Preorders", SqlDbType.Bit).Value = session.AllowPreorders;
                cmd.Parameters.Add("@unique_siteId", SqlDbType.UniqueIdentifier).Value = new Guid(Site.Id.ToString());
                cmd.Parameters.Add("@new_price", SqlDbType.Money).Value = price;
                cmd.Parameters.Add("@override_Price", SqlDbType.Bit).Value = allow_price_override;
                cmd.Parameters.Add("@overrideAddressId", SqlDbType.UniqueIdentifier).Value = new Guid(addressId);
                cmd.Parameters.Add("@override_allow_preorder", SqlDbType.Bit).Value = allowPreorder;
                using(SqlDataReader d = cmd.ExecuteReader()) {
                    d.Read();
                    cartId = d.GetGuid(1);
                    error = d.GetInt32(2);
                    errorDesc = d.GetString(3);
                    itemNumber = d.GetString(4);
                    qty = d.GetInt32(5);
                    r_addressId = d.GetGuid(6);
                    r_price = d.GetDecimal(7);
                }
                cmd.Dispose();
                if(error != 0) {
                    Commerce.CartItem i = new Commerce.CartItem(item_number, Guid.Empty, 0, 0, Guid.Empty, DateTime.Now, Main.GetCurrentSession());
                    i.Error_Description = errorDesc;
                    i.Error_Id = error;
                    return i;
                } else {
                    List<Commerce.Input> formInputs = null;
                    if(item.Form != null) {
                        formInputs = item.Form.Inputs;
                        String.Format("Add to Cart > Using form {0} for item {1}.", item.Form.Name, item.Number).Debug(8);
                    } else {
                        String.Format("Add to Cart > No form found for item {0}.", item.Number).Debug(8);
                    };
                    /* add item to cart */
                    Commerce.CartItem citm = new Commerce.CartItem(itemNumber, cartId, r_price, qty, r_addressId, DateTime.Now, session);
                    /* save forms */
                    if(args.ContainsKey("orderId")) {
                        if(item.Form != null) {
                            /* add forms that may end up on order to the line forms table now */
                            commandText = "dbo.insertOrderLineForm @cartId,@sourceCode,@formName";
                            if(cn == null) {
                                cmd = new SqlCommand(commandText, Site.SqlConnection);
                            } else {
                                cmd = new SqlCommand(commandText, cn, trans);
                            }
                            cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = new Guid(citm.CartId.ToString());
                            cmd.Parameters.Add("@sourceCode", SqlDbType.VarChar).Value = item.Form.SourceCode;
                            cmd.Parameters.Add("@formName", SqlDbType.VarChar).Value = item.Form.Name;
                            cmd.ExecuteNonQuery();
                            cmd.Dispose();
                        }
                    }
                    try {
                        if(formInputs != null) {
                            /* add form inputs if any to _cart_item we're returning as well as the database */
                            Guid newCartId = new Guid(cartId.ToString());
                            for(int x = 0; formInputs.Count > x; x++) {
                                Commerce.Input i = formInputs[x];
                                if(args.ContainsKey(i.Name)) {
                                    i.Value = Convert.ToString(args[i.Name]);
                                } else {
                                    i.Value = "";
                                }
                                citm.Item.Form.Inputs.Find(delegate(Commerce.Input inp) { return inp.Name.l() == i.Name.l(); }).Value = i.Value;
                                String.Format("Add to Cart > Adding input {0}, value {1}", i.Name, i.Value).Debug(8);
                                commandText = "dbo.insertCartDetail @cartDetailId,@cartId,@inputName,@value,@sessionId;";
                                if(cn == null) {
                                    cmd = new SqlCommand(commandText, Site.SqlConnection);
                                } else {
                                    cmd = new SqlCommand(commandText, cn, trans);
                                }
                                Guid newCartDetailId = Guid.NewGuid();
                                i.Id = newCartDetailId;
                                cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = new Guid(newCartId.ToString());
                                cmd.Parameters.Add("@sessionId", SqlDbType.UniqueIdentifier).Value = new Guid(session.Id.ToString());
                                cmd.Parameters.Add("@cartDetailId", SqlDbType.UniqueIdentifier).Value = new Guid(newCartDetailId.ToString());
                                cmd.Parameters.Add("@inputName", SqlDbType.VarChar).Value = i.Name;
                                cmd.Parameters.Add("@value", SqlDbType.VarChar).Value = i.Value;
                                cmd.ExecuteNonQuery();
                                cmd.Dispose();
                            }
                        } else {
                            ("Add to Cart > No form inputs found.").Debug(8);
                        }
                    } catch(Exception ex) {
                        String.Format("Add to Cart > An exception occured {0}", ex.Message).Debug(0);
                    }
                    return citm;
                }
            }
            /// <summary>
            /// Duplicates an item into a new cart with transactions
            /// </summary>
            /// <param name="args">{cartId:string}</param>
            /// <param name="cn">The connection being used.</param>
            /// <param name="trans">The transaction being used.</param>
            /// <returns>
            /// {error:int,description:string + more}.
            /// </returns>
            public static Dictionary<string, object> DuplicateCartId(Dictionary<string, object> args, SqlConnection cn, SqlTransaction trans) {
                Dictionary<string, object> rslt = new Dictionary<string, object>();
                if(args.ContainsKey("cartId")) {
                    string refItemNumber = "";
                    if(args["cartId"].ToString().IsGuid()) {
                        Dictionary<string, object> atcArgs = new Dictionary<string, object>();
                        /* get the item number */
                        using(SqlCommand cmd = new SqlCommand(@" /* DuplicateCartId */
                        select itemNumber, inputName, value 
                        from cart with (nolock)
                        inner join cartDetail with (nolock) on cartDetail.cartId = cart.cartId
                        where cart.cartId = @cartId", cn, trans)) {
                            cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = new Guid(args["cartId"].ToString());
                            using(SqlDataReader r = cmd.ExecuteReader()) {
                                if(!r.HasRows) {
                                    rslt.Add("error", -3);
                                    rslt.Add("description", "cartId does not exist.");
                                    return rslt;
                                }
                                while(r.Read()) {
                                    refItemNumber = r.GetString(0);
                                    atcArgs.Add(r.GetString(1), r.GetString(2));
                                }
                            }
                        }
                        atcArgs.Add("itemNumber", refItemNumber);
                        if(args.ContainsKey("qty")) {
                            atcArgs.Add("qty", args["qty"]);
                        } else {
                            atcArgs.Add("qty", 1);
                        }
                        Dictionary<string, object> atcResult = AddToCart(atcArgs, cn, trans);
                        if((int)atcResult["error"] != 0) {
                            /* if there's an error, pass it to the caller */
                            return atcResult;
                        }
                        /* tag this item as a copy and deplete qty on purchase by setting parentCartId and setting price */
                        using(SqlCommand cmd = new SqlCommand(@" /* DuplicateCartId */
                        update cart set 
                        parentCartId = @sourceCartId,
                        price = (select top 1 price from cart with (nolock) where cartId = @sourceCartId)
                        where cartId = @targetCartId;", cn, trans)) {
                            cmd.Parameters.Add("@sourceCartId", SqlDbType.UniqueIdentifier).Value = new Guid(args["cartId"].ToString());
                            cmd.Parameters.Add("@targetCartId", SqlDbType.UniqueIdentifier).Value = new Guid(atcResult["cartId"].ToString());
                            cmd.ExecuteNonQuery();
                        }
                        rslt.Add("error", 0);
                        rslt.Add("description", "");
                        return rslt;
                    } else {
                        rslt.Add("error", -1);
                        rslt.Add("description", "cartId must be a Guid.");
                        return rslt;
                    }
                } else {
                    rslt.Add("error", -2);
                    rslt.Add("description", "cartId must be defined.");
                    return rslt;
                }
            }
            /// <summary>
            /// Adds an item to the selected sessions cart with transactions
            /// </summary>
            /// <param name="args">{itemnumber:string,qty:int,sessionid:Guid,other misc item form inputs}</param>
            /// <param name="cn">The connection being used.</param>
            /// <param name="trans">The transaction being used.</param>
            /// <returns>
            /// {itemNumber:string,price:float,qty:int,cartId:Guid,addressId:Guid
            /// sessionId:Guid,packingSlipImage:string,auxillaryImage:string,cartImage:string,detailImage:string,
            /// fullSizeImage:string,listingImage:string,listing2Image:string,description:string,
            /// form:string,error_id:int,error_desc:string,inputs:Dictionary}.
            /// </returns>
            public static Dictionary<string, object> AddToCart(Dictionary<string, object> args, SqlConnection cn, SqlTransaction trans) {
                ("FUNCTION:Add to Cart > Result object to JSON").Debug(10);
                Dictionary<string, object> j = new Dictionary<string, object>();
                Session session = null;
                if(args.ContainsKey("sessionId")) {
                    if(cn == null) {
                        session = new Session(Main.Site, new Guid((string)args["sessionId"]));
                    } else {
                        session = new Session(Main.Site, new Guid((string)args["sessionId"]), cn, trans);
                    }
                } else {
                    session = Main.GetCurrentSession();
                }
                Commerce.Item item = Main.Site.Items.List.Find(delegate(Commerce.Item itm) {
                    return itm.ItemNumber.ToLower() == ((string)args["itemNumber"]).ToLower();
                });
                if(item == null) {
                    j.Add("error", -1);
                    string passedItem = ((string)args["itemNumber"]).MaxLength(50, true);
                    j.Add("description", "Item number " + passedItem + " (itemNumber argument length:" +
                    passedItem.Length.ToString() + ") does not exist.");
                    return j;
                }
                if(!args.ContainsKey("itemNumber")) {
                    j.Add("error", -2);
                    j.Add("description", "the key itemNumber is missing from the collection.");
                    return j;
                }
                int qty = 1;
                if(args.ContainsKey("qty")) {
                    if(!int.TryParse(args["qty"].ToString(), out qty)) {
                        qty = 1;
                    }
                }
                /* figure out the price that should be set.   The user can override the price if:
                 * They are an administrator (session.administrator)
                 * An administrator is entering the order (instatitationSession.administrator)
                 * The order is entered via EDI transmission (HttpContext.Current==null)
                 */
                decimal price = (decimal)0.00;
                bool allowPreorder = false;
                bool allowPriceOverride = false;
                bool allowPreorderOverride = false;
                bool overridePrice = false;
                if(session.Wholesale == 1) {
                    price = item.WholeSalePrice;
                } else if(item.IsOnSale) {
                    price = item.SalePrice;
                }
                /* check if the user is an administrator or  */
                if(session.Administrator || HttpContext.Current == null) {
                    allowPriceOverride = true;
                }
                /* check if this item is being added by someone else */
                if(HttpContext.Current != null) {
                    Session instatitationSession = Main.GetCurrentSession();
                    if(instatitationSession != null) {
                        /* are they an administrator (What else would they be?  But what the hell.) */
                        if(instatitationSession.Administrator) {
                            allowPriceOverride = true;
                        }
                    }
                }
                if(allowPriceOverride) {
                    if(args.ContainsKey("price")) {
                        /* if the key is present, try and convert it into a decimal,
                         * if that doesn't work enter price 0 to throw an exception */
                        if(!decimal.TryParse(args["price"].ToString(), out price)) {
                            price = 0;
                        } else {
                            /* only override the price if a valid price was provided */
                            overridePrice = true;
                        }
                    }
                }
                if(allowPreorderOverride) {
                    if(args.ContainsKey("allowPreorder")) {
                        /* check if somthing silly was put in the key, if not allow the user to change allowPreorder */
                        if(!bool.TryParse(args["allowPreorder"].ToString(), out allowPreorder)) {
                            allowPreorder = false;
                        }
                    }
                }
                BeforeAddToCartEventArgs e = new BeforeAddToCartEventArgs(item, session, cn, trans, HttpContext.Current);
                Main.Site.raiseOnBeforeAddtoCart(e);
                Commerce.CartItem i = addToCartProc(
                    (string)args["itemNumber"],
                    qty,
                    session,
                    args,
                    price,
                    allowPreorder,
                    overridePrice,
                    cn,
                    trans
                );
                string form = "";
                if(i.Item.Form == null) {
                    form = "";
                } else {
                    form = i.Item.Form.Html;
                };
                /* spit a json object out to the console that initiated the request */
                j.Add("itemNumber", i.Item.Number);
                j.Add("price", (double)i.Price);
                j.Add("qty", i.Qty);
                j.Add("cartId", i.CartId.ToString());
                j.Add("addressId", i.AddressId.ToString());
                j.Add("sessionId", session.Id.ToString());
                j.Add("packingSlipImage", i.Item.PackingSlipImage);
                j.Add("auxillaryImage", i.Item.AuxillaryImage);
                j.Add("cartImage", i.Item.CartImage);
                j.Add("detailImage", i.Item.FullSizeImage);
                j.Add("fullSizeImage", i.Item.FullSizeImage);
                j.Add("listingImage", i.Item.ListingImage);
                j.Add("listing2Image", i.Item.Listing2Image);
                j.Add("item_description", i.Item.Description);
                j.Add("formName", i.Item.FormName);
                j.Add("error_id", i.Error_Id);
                j.Add("error_desc", i.Error_Description);
                j.Add("error", i.Error_Id);
                j.Add("description", i.Error_Description);
                if(i.Item.Form != null) {
                    Dictionary<string, object> k = new Dictionary<string, object>();
                    for(var x = 0; i.Inputs.Count > x; x++) {
                        if(!k.ContainsKey(i.Inputs[x].Name)) {
                            k.Add(i.Inputs[x].Name, i.Inputs[x].Value);
                        }
                    }
                    j.Add("inputs", k);
                    j.Add("formHTML", form);
                } else {
                    j.Add("inputs", false);
                }
                AddToCartEventArgs f = new AddToCartEventArgs(i, session.Cart, cn, trans, session, HttpContext.Current);
                Main.Site.raiseOnAddToCart(f);
                return j;
            }
            #endregion
        }
		/// <summary>
		/// This class represents an item in the cart class
		/// This class contains the item that is in the cart
		/// as well as quantity, Address and other information.
		/// </summary>
		public class CartItem {
            #region Instance Properties
            /// <summary>
			/// Date this item was added to the cart.
			/// </summary>
            public DateTime AddedOn { get; internal set; }
			/// <summary>
			/// Item for this line.
			/// </summary>
            public Item Item { get; internal set; }
			/// <summary>
			/// Unique id of this item.
			/// </summary>
            public Guid CartId { get; internal set; }
			/// <summary>
			/// Price of this item.
			/// </summary>
            public decimal Price { get; internal set; }
			/// <summary>
			/// Quantity of this item.
			/// </summary>
            public int Qty { get; internal set; }
			/// <summary>
			/// List of inputs in this item's form.
			/// </summary>
            public List<Input> Inputs { get; internal set; }
			/// <summary>
			/// Id of the Address associated with this line item.
			/// </summary>
            public Guid AddressId { get; internal set; }
			private Commerce.Address _address = null;
			/// <summary>
			/// The form used by this line item, if any.
			/// </summary>
            public Form Form { get; internal set; }
            /// <summary>
            /// The related parent cartId if any.
            /// </summary>
            public Guid ParentCartId { get; internal set; }
			/// <summary>
			/// Gets the HTML with values.
			/// </summary>
			/// <value>The HTML with values.</value>
			public string HtmlWithValues {
				get {
					if( Form != null ) {
						return Form.HtmlWithValues( Inputs );
					} else {
						return Item.Form.HtmlWithValues( Inputs );
					}
				}
			}
			/// <summary>
			/// The Address of this line item.
			/// </summary>
			/// <value>The Address.</value>
			public Commerce.Address Address {
				get {
					if( _address == null ) {
						_address = Session.Cart.Addresses.Find( delegate( Commerce.Address adr ) {
							return adr.Id == AddressId;
						} );
					}
					return _address;
				}
			}
			/// <summary>
			/// The session this cart line belongs to.
			/// </summary>
            public Session Session { get; internal set; }
			/// <summary>
			/// the Address id encoded for ECMA/DHTML
			/// </summary>
            public string XMLAddressId { get; internal set; }
			/// <summary>
			/// the cart id encoded for ECMA/DHTML
			/// </summary>
            public string XMLId { get; internal set; }
			/// <summary>
			/// Any errors that may occur on this line.
			/// </summary>
            public int Error_Id { get; internal set; }
			/// <summary>
			/// The description of any errors that occured.
			/// </summary>
			public string Error_Description { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
			/// Creates an item used to populate the class _cart.  This method does not add items to the database.
			/// </summary>
			/// <param name="_item_number">Item Number</param>
			/// <param name="_cartId">Cart Id from the table cart</param>
			/// <param name="_price">Price of the item in the cart</param>
			/// <param name="_qty">Quantity of this line item</param>
			/// <param name="_addressId">Address Id of the Address to ship to</param>
			/// <param name="addTime">The add time.</param>
			/// <param name="session">_session to attach this item to</param>
			public CartItem( string _item_number, Guid _cartId, decimal _price, int _qty, Guid _addressId, DateTime addTime, Session session ) {
                if(Inputs == null) {
                    Inputs = new List<Input>();
                }
                Item = Main.Site.Item( _item_number );
				CartId = _cartId;
				Price = _price;
				Qty = _qty;
				AddressId = _addressId;
				XMLId = _cartId.EncodeXMLId();
				XMLAddressId = _addressId.EncodeXMLId();
				AddedOn = addTime;
            }
            #endregion
        }
	}
}
