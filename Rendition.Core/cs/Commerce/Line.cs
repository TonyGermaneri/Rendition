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
namespace Rendition {
    public partial class Commerce {
        /// <summary>
        /// Represents a single line item in a order.
        /// </summary>
        public class Line {
            #region Private Fields
            /// <summary>
            /// Internal holder for form
            /// </summary>
            private Commerce.Form _form;
            #endregion
            #region Instance Properties
            /// <summary>
            /// The name of the form if any, drawn from order_line_forms.
            /// </summary>
            public string FormName { get; internal set; }
            /// <summary>
            /// The source code of the form if any, drawn from order_line_forms.
            /// </summary>
            public string SourceCode { get; internal set; }
            /// <summary>
            /// The form this item uses.
            /// </summary>
            public Commerce.Form Form {
                get {
                    if(_form == null) {
                        /* build form */
                        Commerce.Form form = new Commerce.Form(this.Item, this.SourceCode, this.FormName);
                        List<Commerce.Input> inputs = form.Inputs;
                        /* match LineDetail to form inputs */
                        foreach(Commerce.Input input in inputs) {
                            foreach(Commerce.LineDetail d in this.LineDetail) {
                                if(d.InputName == input.Name) {
                                    input.Value = d.Value;
                                    input.Id = d.Id;
                                }
                            }
                        }
                        _form = form;
                    }
                    return _form;
                }
            }
            /// <summary>
            /// Line detail - content of cartDetail for this order's line items.
            /// Use this line's form property to access line detail information.
            /// </summary>
            public List<LineDetail> LineDetail { get; internal set; }
            /// <summary>
            /// The unique id of this line item.
            /// </summary>
            public Guid CartId { get; internal set; }
            /// <summary>
            /// the sesisonId of this line item.
            /// </summary>
            public Guid SessionId { get; internal set; }
            /// <summary>
            /// Quantity of this line item.
            /// </summary>
            public int Qty { get; internal set; }
            /// <summary>
            /// Item number of this line item.
            /// </summary>
            public string ItemNumber { get; internal set; }
            /// <summary>
            /// Price of the line item.
            /// </summary>
            public decimal Price { get; internal set; }
            /// <summary>
            /// Date this line item was added to the order.
            /// </summary>
            public DateTime AddTime { get; internal set; }
            /// <summary>
            /// The order id this line item belongs to.
            /// </summary>
            public int OrderId { get; internal set; }
            /// <summary>
            /// The serial id of this line item.
            /// </summary>
            public int SerialId { get; internal set; }
            /// <summary>
            /// The order number of this line item.
            /// </summary>
            public string OrderNumber { get; internal set; }
            /// <summary>
            /// The serial number of this line item.
            /// </summary>
            public string SerialNumber { get; internal set; }
            /// <summary>
            /// The Address id of this line item.
            /// </summary>
            public Guid AddressId { get; internal set; }
            /// <summary>
            /// The shipment id this line item.
            /// </summary>
            public int ShipmentId { get; internal set; }
            /// <summary>
            /// The shipment number of this line item.
            /// </summary>
            public string ShipmentNumber { get; internal set; }
            /// <summary>
            /// The line number of this line.
            /// </summary>
            public int LineNumber { get; internal set; }
            /// <summary>
            /// The print status of this line item.
            /// </summary>
            public string EPSMMCSOutput { get; internal set; }
            /// <summary>
            /// The file name of this line item.
            /// </summary>
            public string EPSMMCSAIFileName { get; internal set; }
            /// <summary>
            /// The total cost of the form selections.
            /// </summary>
            public decimal ValueCostTotal { get; internal set; }
            /// <summary>
            /// The total cost of the line items that is not taxable.
            /// </summary>
            public decimal NoTaxValueCostTotal { get; internal set; }
            /// <summary>
            /// The date this line item should be fulfilled on.
            /// </summary>
            public DateTime FulfillmentDate { get; internal set; }
            /// <summary>
            /// The date the line item is expected to be fulfilled.
            /// </summary>
            public DateTime EstimatedFulfillmentDate { get; internal set; }
            /// <summary>
            /// The parent line item of this line item (in the case of a backorder).
            /// </summary>
            public Guid ParentCartId { get; internal set; }
            /// <summary>
            /// Quantity of this line item that has been backordered.
            /// </summary>
            public int BackorderedQty { get; internal set; }
            /// <summary>
            /// Quantity of this line item that has been canceled.
            /// </summary>
            public int CanceledQty { get; internal set; }
            /// <summary>
            /// The item for this line item.
            /// </summary>
            public Item Item { get; internal set; }
            /// <summary>
            /// The Address of this line item.
            /// </summary>
            public Address Address { get; internal set; }
            /// <summary>
            /// The custom line number of this item.
            /// </summary>
            public string CustomLineNumber { get; internal set; }
            /// <summary>
            /// Sub componet id of item.
            /// </summary>
            public int KitAllocationId { get; internal set; }
            /// <summary>
            /// Quantity of this subcomponet.
            /// </summary>
            public int KitQty { get; internal set; }
            /// <summary>
            /// Show this subcomponet as a seperate line on the invoice.
            /// </summary>
            public bool ShowAsSeperateLineOnInvoice { get; internal set; }
            /// <summary>
            /// When inventory is allocated to this sub componet this is the id of the row in dbo.vendorItemKitAssignment that it was assigned from.
            /// </summary>
            public Guid VendorItemKitAssignmentId { get; internal set; }
            /// <summary>
            /// The cartId (from dbo.cart) of the parent/virtual item that this sub componet is a part of.  If cartId == kitAllocationCartId than this is the parent/virtual item.
            /// </summary>
            public Guid KitAllocationCartId { get; internal set; }
            /// <summary>
            /// The last status id of the line item
            /// </summary>
            public int LastStatusId { get; internal set; }
            /// <summary>
            /// The last FlagType status of the line item
            /// </summary>
            public Commerce.Flag LastStatus {
                get {
                    return Main.Site.FlagTypes.List.Find(delegate(Commerce.Flag ft) {
                        return ft.Id == LastStatusId;
                    });
                }
            }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Line"/> class.
            /// </summary>
            /// <param name="f_cartId">The f_cart id.</param>
            /// <param name="f_SessionId">The f_ session id.</param>
            /// <param name="f_qty">The f_qty.</param>
            /// <param name="f_itemNumber">The f_item number.</param>
            /// <param name="f_price">The f_price.</param>
            /// <param name="f_addTime">The f_add time.</param>
            /// <param name="f_orderId">The f_order id.</param>
            /// <param name="f_serialId">The f_serial id.</param>
            /// <param name="f_orderNumber">The f_order number.</param>
            /// <param name="f_serialNumber">The f_serial number.</param>
            /// <param name="f_addressId">The f_address id.</param>
            /// <param name="f_shipmentId">The f_shipment id.</param>
            /// <param name="f_shipmentnumber">The f_shipmentnumber.</param>
            /// <param name="f_lineNumber">The f_line number.</param>
            /// <param name="f_epsmmcsOutput">The f_epsmmcs output.</param>
            /// <param name="f_epsmmcsAIFilename">The f_epsmmcs AI filename.</param>
            /// <param name="f_valueCostTotal">The f_value cost total.</param>
            /// <param name="f_noTaxValueCostTotal">The f_no tax value cost total.</param>
            /// <param name="f_fulfillmentDate">The f_fulfillment date.</param>
            /// <param name="f_estimatedFulfillmentDate">The f_estimated fulfillment date.</param>
            /// <param name="f_parentCartId">The f_parent cart id.</param>
            /// <param name="f_backorderedQty">The f_backordered qty.</param>
            /// <param name="f_canceledQty">The f_canceled qty.</param>
            /// <param name="f_customLineNumber">The f_custom line number.</param>
            /// <param name="f_kitAllocationId">The f_kit allocation id.</param>
            /// <param name="f_kitQty">The f_kit qty.</param>
            /// <param name="f_showAsSeperateLineOnInvoice">if set to <c>true</c> [f_show as seperate line on invoice].</param>
            /// <param name="f_vendorItemKitAssignmentId">The f_vendor item kit assignment id.</param>
            /// <param name="f_kitAllocationCartId">The f_kit allocation cart id.</param>
            /// <param name="f_lastStatusId">The f_last status id.</param>
            public Line(Guid f_cartId, Guid f_SessionId, int f_qty, string f_itemNumber, decimal f_price, DateTime f_addTime,
            int f_orderId, int f_serialId, string f_orderNumber, string f_serialNumber, Guid f_addressId,
            int f_shipmentId, string f_shipmentnumber, int f_lineNumber, string f_epsmmcsOutput,
            string f_epsmmcsAIFilename, decimal f_valueCostTotal, decimal f_noTaxValueCostTotal,
            DateTime f_fulfillmentDate, DateTime f_estimatedFulfillmentDate, Guid f_parentCartId, int f_backorderedQty,
            int f_canceledQty, string f_customLineNumber, int f_kitAllocationId, int f_kitQty, bool f_showAsSeperateLineOnInvoice,
            Guid f_vendorItemKitAssignmentId, Guid f_kitAllocationCartId, int f_lastStatusId) {
                LineDetail = new List<LineDetail>();
                CartId = f_cartId;
                SessionId = f_SessionId;
                Qty = f_qty;
                ItemNumber = f_itemNumber;
                Price = f_price;
                AddTime = f_addTime;
                OrderId = f_orderId;
                SerialId = f_serialId;
                OrderNumber = f_orderNumber;
                SerialNumber = f_serialNumber;
                AddressId = f_addressId;
                ShipmentId = f_shipmentId;
                ShipmentNumber = f_shipmentnumber;
                LineNumber = f_lineNumber;
                EPSMMCSOutput = f_epsmmcsOutput;
                EPSMMCSAIFileName = f_epsmmcsAIFilename;
                ValueCostTotal = f_valueCostTotal;
                NoTaxValueCostTotal = f_noTaxValueCostTotal;
                FulfillmentDate = f_fulfillmentDate;
                EstimatedFulfillmentDate = f_estimatedFulfillmentDate;
                ParentCartId = f_parentCartId;
                BackorderedQty = f_backorderedQty;
                CanceledQty = f_canceledQty;
                Item = Main.Site.Items.GetItemByItemNumber(f_itemNumber);
                CustomLineNumber = f_customLineNumber;
                KitAllocationId = f_kitAllocationId;
                KitQty = f_kitQty;
                ShowAsSeperateLineOnInvoice = f_showAsSeperateLineOnInvoice;
                VendorItemKitAssignmentId = f_vendorItemKitAssignmentId;
                KitAllocationCartId = f_kitAllocationCartId;
                LastStatusId = f_lastStatusId;
            }
            #endregion
        }
    }
}
