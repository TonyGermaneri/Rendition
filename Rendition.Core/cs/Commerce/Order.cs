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
		/// This class represents an order
		/// </summary>
		public partial class Order {
            #region Instance Properties
            /// <summary>
			/// The order id.
			/// </summary>
            public int OrderId { get; internal set; }
			/// <summary>
			/// The order date.
			/// </summary>
            public DateTime OrderDate { get; internal set; }
			/// <summary>
			/// The grand total.
			/// </summary>
            public decimal GrandTotal { get; internal set; }
			/// <summary>
			/// The tax total.
			/// </summary>
			public decimal TaxTotal { get; internal set; }
			/// <summary>
			/// The sub total.
			/// </summary>
            public decimal SubTotal { get; internal set; }
			/// <summary>
			/// The shipping total.
			/// </summary>
            public decimal ShippingTotal { get; internal set; }
			/// <summary>
			/// service 1 (not implemented).
			/// </summary>
            public decimal Service1 { get; internal set; }
			/// <summary>
			/// service 1 (not implemented).
			/// </summary>
            public decimal Service2 { get; internal set; }
			/// <summary>
			/// Manifest number this order belongs to if any.
			/// </summary>
            public string Manifest { get; internal set; }
			/// <summary>
			/// Purchase order this order belongs to if any.
			/// </summary>
            public string PurchaseOrder { get; internal set; }
			/// <summary>
			/// The discount total.
			/// </summary>
            public decimal Discount { get; internal set; }
			/// <summary>
			/// Comments provided by the customer.
			/// </summary>
            public string Comment { get; internal set; }
			/// <summary>
			/// Amount paid.
			/// </summary>
            public decimal Paid { get; internal set; }
			/// <summary>
			/// Address id of the bill to Address.
			/// </summary>
            public Guid BillToAddressId { get; internal set; }
			/// <summary>
			/// Is this order closed?
			/// </summary>
            public bool Closed { get; internal set; }
			/// <summary>
			/// Is this order canceled?
			/// </summary>
            public bool Canceled { get; internal set; }
			/// <summary>
			/// The paymentMethodId of this order's payment method.
			/// </summary>
            public Guid PaymentMethodId { get; internal set; }
			/// <summary>
			/// The term id of this order's terms.
			/// </summary>
            public int TermId { get; internal set; }
			/// <summary>
			/// Gets the terms of this order.
			/// </summary>
			/// <value>The term.</value>
			public Term Term {
				get {
					return Main.Site.Terms.List.Find( delegate( Commerce.Term t1 ) {
						return t1.Id == this.TermId;
					} );
				}
			}
			/// <summary>
			/// The account number this order belongs to.
			/// </summary>
            public int UserId { get; internal set; }
			/// <summary>
			/// The order number.
			/// </summary>
            public string OrderNumber { get; internal set; }
			/// <summary>
			/// Is this order a credit memo (not implemented).
			/// </summary>
            public bool CreditMemo { get; internal set; }
			/// <summary>
			/// File name of scanned order image.
			/// </summary>
            public string ScannedOrderImage { get; internal set; }
			/// <summary>
			/// Date this order was ready for export.
			/// </summary>
            public DateTime ReadyForExport { get; internal set; }
			/// <summary>
			/// Last date this order was recalculated (via dbo.placeOrder).
			/// </summary>
            public DateTime RecalculatedOn { get; internal set; }
			/// <summary>
			/// The sessionId of this order.
			/// </summary>
            public Guid SessionId { get; internal set; }
			/// <summary>
			/// The user id of the account that sold this order.
			/// </summary>
            public int SoldBy { get; internal set; }
			/// <summary>
			/// The user id of the account that requisitioned this order.
			/// </summary>
            public int RequisitionedBy { get; internal set; }
			/// <summary>
			/// The user id of the account that approved this order.
			/// </summary>
            public int ApprovedBy { get; internal set; }
			/// <summary>
			/// The date this order should be delivered by.
			/// </summary>
            public DateTime DeliverBy { get; internal set; }
			/// <summary>
			/// The account number your vendor refers to you with.
			/// </summary>
            public string VendorAccountNumber { get; internal set; }
			/// <summary>
			/// Freight on board for this order or blank.
			/// </summary>
            public string FOB { get; internal set; }
			/// <summary>
			/// The parent order Id of this order (in case of a chained purchase order).
			/// </summary>
            public int ParentOrderId { get; internal set; }
			/// <summary>
			/// The bill to Address.
			/// </summary>
            public Address BillToAddress { get; internal set; }
			/// <summary>
			/// The list of ship to addresses.
			/// </summary>
            public List<Address> ShipToAddresses { get; internal set; }
			/// <summary>
			/// The primary ship to Address.
			/// </summary>
            public Address ShipToAddress { get; internal set; }
			/// <summary>
			/// The list of line items on this order.
			/// </summary>
            public List<Line> Lines { get; internal set; }
			/// <summary>
			/// The user/account this order belongs to.
			/// </summary>
            public Commerce.User User { get; internal set; }
			/// <summary>
			/// the shipments in this order
			/// </summary>
            public List<Shipment> Shipments { get; internal set; }
			/// <summary>
			/// The last FlagType id status the order passed through.
			/// </summary>
            public int LastStatusId { get; internal set; }
			/// <summary>
			/// The last FlagType status of the order
			/// </summary>
			public Commerce.Flag LastStatus {
				get {
					return Main.Site.FlagTypes.List.Find( delegate( Commerce.Flag ft ) {
						return ft.Id == LastStatusId;
					} );
				}
			}
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Order"/> class.
            /// </summary>
            /// <param name="orderId">The order id.</param>
            /// <param name="orderDate">The order date.</param>
            /// <param name="grandTotal">The grand total.</param>
            /// <param name="taxTotal">The tax total.</param>
            /// <param name="subTotal">The sub total.</param>
            /// <param name="shippingTotal">The shipping total.</param>
            /// <param name="service1">The service1.</param>
            /// <param name="service2">The service2.</param>
            /// <param name="manifest">The manifest.</param>
            /// <param name="purchaseOrder">The purchase order.</param>
            /// <param name="discount">The discount.</param>
            /// <param name="comment">The comment.</param>
            /// <param name="paid">The paid.</param>
            /// <param name="billToAddressId">The bill to Address id.</param>
            /// <param name="closed">if set to <c>true</c> [closed].</param>
            /// <param name="canceled">if set to <c>true</c> [canceled].</param>
            /// <param name="paymentMethodId">The payment method id.</param>
            /// <param name="termId">The term id.</param>
            /// <param name="userId">The user id.</param>
            /// <param name="orderNumber">The order number.</param>
            /// <param name="creditMemo">if set to <c>true</c> [credit memo].</param>
            /// <param name="scanned_order_image">The scanned_order_image.</param>
            /// <param name="readyForExport">The ready for export.</param>
            /// <param name="recalculatedOn">The recalculated on.</param>
            /// <param name="sessionId">The session id.</param>
            /// <param name="soldBy">The sold by.</param>
            /// <param name="requisitionedBy">The requisitioned by.</param>
            /// <param name="approvedBy">The approved by.</param>
            /// <param name="deliverBy">The deliver by.</param>
            /// <param name="vendor_accountNo">The vendor_account no.</param>
            /// <param name="FOB">The FOB.</param>
            /// <param name="parentOrderId">The parent order id.</param>
            /// <param name="lines">The lines.</param>
            /// <param name="_lastStatusId">The _last status id.</param>
            /// <param name="cn">The connection being used.</param>
            /// <param name="trans">The transaction being used.</param>
			public Order( int orderId, DateTime orderDate, decimal grandTotal, decimal taxTotal, decimal subTotal, decimal shippingTotal, decimal service1,
			decimal service2, string manifest, string purchaseOrder, decimal discount, string comment, decimal paid, Guid billToAddressId, bool closed,
			bool canceled, Guid paymentMethodId, int termId, int userId, string orderNumber, bool creditMemo, string scanned_order_image,
			DateTime readyForExport, DateTime recalculatedOn, Guid sessionId, int soldBy, int requisitionedBy, int approvedBy, DateTime deliverBy,
			string vendor_accountNo, string FOB, int parentOrderId, List<Line> lines, int _lastStatusId, SqlConnection cn, SqlTransaction trans ) {
				this.OrderId = orderId;
				this.OrderDate = orderDate;
				this.GrandTotal = grandTotal;
				this.TaxTotal = taxTotal;
				this.SubTotal = subTotal;
				this.ShippingTotal = shippingTotal;
				this.Service1 = service1;
				this.Service2 = service2;
				this.Manifest = manifest;
				this.PurchaseOrder = purchaseOrder;
				this.Discount = discount;
				this.Comment = comment;
				this.Paid = paid;
				this.BillToAddressId = billToAddressId;
				this.Closed = closed;
				this.Canceled = canceled;
				this.PaymentMethodId = paymentMethodId;
				this.TermId = termId;
				this.UserId = userId;
				this.OrderNumber = orderNumber;
				this.CreditMemo = creditMemo;
				this.ScannedOrderImage = scanned_order_image;
				this.ReadyForExport = readyForExport;
				this.RecalculatedOn = recalculatedOn;
				this.SessionId = sessionId;
				this.SoldBy = soldBy;
				this.RequisitionedBy = requisitionedBy;
				this.ApprovedBy = approvedBy;
				this.DeliverBy = deliverBy;
				this.VendorAccountNumber = vendor_accountNo;
				this.FOB = FOB;
				this.ParentOrderId = parentOrderId;
				Guid currentAddressId = Guid.Empty;
				BillToAddress = new Address( billToAddressId, cn, trans );
				if( this.Lines != null ) {
					this.Lines.Clear();
				} else {
					this.Lines = new List<Line>();
				}
				this.Lines.AddRange( lines );
				if( ShipToAddresses != null ) {
					ShipToAddresses.Clear();
				} else {
					ShipToAddresses = new List<Address>();
				}
				foreach( Line l in lines ) {/* only lookup addresses on the lines, and only do it once */
					if( currentAddressId != l.AddressId ) {
						currentAddressId = l.AddressId;
						ShipToAddresses.Add( new Address( currentAddressId, cn, trans ) );
					}
				}
				foreach( Line l in lines ) { /* assign the addresses looked up */
					l.Address = ShipToAddresses.Find( delegate( Address adr ) {
						return l.AddressId == adr.Id;
					} );
				}
				if( this.Lines.Count > 0 ) {
					ShipToAddress = this.Lines[ 0 ].Address;
				} else {
					ShipToAddress = Commerce.Address.CreateAddress();
				}
				User = Commerce.Users.GetUserById( this.UserId );
				Shipments = new List<Shipment>();
				this.LastStatusId = _lastStatusId;
            }
            #endregion
        }
	}
}
