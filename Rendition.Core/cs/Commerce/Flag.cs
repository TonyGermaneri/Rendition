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
using System.Text.RegularExpressions;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using Microsoft.SqlServer.Server;
using System.Web;
using System.IO;
namespace Rendition {
	public partial class Commerce {
		/// <summary>
		/// A flag, also called a status change.  A flag can be placed on one of:
		/// order, line, shipment to determine the status of the order, line or shipment.
		/// </summary>
		public class Flag {
            #region Static Properties
            /// <summary>
            /// Gets all flags.
            /// </summary>
            public static List<Flag> All {
                get {
                    return Main.Site.FlagTypes.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
			/// Id of the flag as specified in the table flagTypes.
			/// </summary>
            public int Id { get; internal set; }
			/// <summary>
			/// Name of the flag.
			/// </summary>
            public string Name { get; internal set; }
			/// <summary>
			/// Description of the flag.
			/// </summary>
            public string Description { get; internal set; }
			/// <summary>
			/// What user level can implement the flag? (not implemented).
			/// </summary>
            public int SecurityLevel { get; internal set; }
			/// <summary>
			/// Can this flag be used for a shipment?
			/// </summary>
            public bool IsShipmentFlag { get; internal set; }
			/// <summary>
			/// Can this flag be used for a user? (not implemented).
			/// </summary>
            public bool IsUserFlag { get; internal set; }
			/// <summary>
			/// Can this flag be used for an order?
			/// </summary>
            public bool IsOrderFlag { get; internal set; }
			/// <summary>
			/// Can this flag be used for a line?
			/// </summary>
            public bool IsLineFlag { get; internal set; }
			/// <summary>
			/// Can this flag be used for a line detail? (not implemented).
			/// </summary>
            public bool IsLineDetailFlag { get; internal set; }
			/// <summary>
			/// Description of what the customer will for the status of this object.
			/// </summary>
            public string IsCustomerReadable { get; internal set; }
			/// <summary>
			/// How many days in this flag state from the day ordered is this aging status 1.
			/// </summary>
            public int AgingDaysStatus1 { get; internal set; }
			/// <summary>
			/// How many days in this flag state from the day ordered is this aging status 2.
			/// </summary>
            public int AgingDaysStatus2 { get; internal set; }
			/// <summary>
			/// How many days in this flag state from the day ordered is this aging status 3.
			/// </summary>
            public int AgingDaysStatus3 { get; internal set; }
			/// <summary>
			/// How many days in this flag state from the day ordered is this aging status 4.
			/// </summary>
            public int AgingDaysStatus4 { get; internal set; }
			/// <summary>
			/// How many days in this flag state from the day ordered is this aging status 5.
			/// </summary>
            public int AgingDaysStatus5 { get; internal set; }
			/// <summary>
			/// Does this flag show up in the production aging report?
			/// </summary>
            public bool ShowInProductionAgingReport { get; internal set; }
			/// <summary>
			/// What order does this flag appear in in the production aging report?
			/// </summary>
            public int ProductionAgingReportOrder { get; internal set; }
			/// <summary>
			/// This flag cannot occur until this other flag occurs. (via dbo.serial_line.tr_line_deplete_inventory_UPDATE)
			/// </summary>
            public int CannotOccurBeforeFlagId { get; internal set; }
			/// <summary>
			/// This flag cannot occur after this other flag has occured. (via dbo.serial_line.tr_line_deplete_inventory_UPDATE)
			/// </summary>
            public int CannotOccurAfterFlagId { get; internal set; }
			/// <summary>
			/// This flag can show up on purchase orders.
			/// </summary>
            public bool PurchaseOrderFlag { get; internal set; }
			/// <summary>
			/// This flag can show up on purchase order shipments.
			/// </summary>
            public bool PurchaseShipmentFlag { get; internal set; }
			/// <summary>
			/// This flag can show up on purchase order lines.
			/// </summary>
            public bool PurchaseLineFlag { get; internal set; }
			/// <summary>
			/// When this flag occurs a new purchase order with the same set of line items is created. (not implemented)
			/// </summary>
            public bool CreatesNewPurchaseOrder { get; internal set; }
			/// <summary>
			/// When this flag occurs the line items on the purchase order will be turned into inventory items (cannot undo).
			/// </summary>
            public bool FinishedPurchaseOrderFlag { get; internal set; }
			/// <summary>
			/// Color of the flag in various reports
			/// </summary>
            public System.Drawing.Color Color { get; internal set; }
            #endregion
            #region Instance Methods
            /// <summary>
			/// Returns a <see cref="System.String"/> that represents this instance.  Returns Flag.Name.
			/// </summary>
			/// <returns>
			/// A <see cref="System.String"/> that represents this instance.
			/// </returns>
			public override string ToString() {
				return this.Name;
			}
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Flag"/> class.
			/// </summary>
			/// <param name="id">The id.</param>
			/// <param name="flagTypeName">Name of the flag type.</param>
			/// <param name="flagTypeDesc">The flag type desc.</param>
			/// <param name="userLevel">The user level.</param>
			/// <param name="shipmentFlag">if set to <c>true</c> [shipment flag].</param>
			/// <param name="userFlag">if set to <c>true</c> [user flag].</param>
			/// <param name="orderFlag">if set to <c>true</c> [order flag].</param>
			/// <param name="lineFlag">if set to <c>true</c> [line flag].</param>
			/// <param name="lineDetailFlag">if set to <c>true</c> [line detail flag].</param>
			/// <param name="customerReadable">The customer readable.</param>
			/// <param name="agingDaysStatus1">The aging days status1.</param>
			/// <param name="agingDaysStatus2">The aging days status2.</param>
			/// <param name="agingDaysStatus3">The aging days status3.</param>
			/// <param name="agingDaysStatus4">The aging days status4.</param>
			/// <param name="agingDaysStatus5">The aging days status5.</param>
			/// <param name="showInProductionAgingReport">if set to <c>true</c> [show in production aging report].</param>
			/// <param name="productionAgingReportOrder">The production aging report order.</param>
			/// <param name="cannotOccurBeforeFlagId">The cannot occur before flag id.</param>
			/// <param name="cannotOccurAfterFlagId">The cannot occur after flag id.</param>
			/// <param name="purchaseOrderFlag">if set to <c>true</c> [purchase order flag].</param>
			/// <param name="purchaseShipmentFlag">if set to <c>true</c> [purchase shipment flag].</param>
			/// <param name="purchaseLineFlag">if set to <c>true</c> [purchase line flag].</param>
			/// <param name="createsNewPurchaseOrder">if set to <c>true</c> [creates new purchase order].</param>
			/// <param name="finishedPurchaseOrderFlag">if set to <c>true</c> [finished purchase order flag].</param>
			/// <param name="color">The color.</param>
			public Flag( int id, string flagTypeName, string flagTypeDesc, int userLevel, bool shipmentFlag, bool userFlag,
			bool orderFlag, bool lineFlag, bool lineDetailFlag, string customerReadable, int agingDaysStatus1,
			int agingDaysStatus2, int agingDaysStatus3, int agingDaysStatus4, int agingDaysStatus5,
			bool showInProductionAgingReport, int productionAgingReportOrder, int cannotOccurBeforeFlagId,
			int cannotOccurAfterFlagId, bool purchaseOrderFlag, bool purchaseShipmentFlag, bool purchaseLineFlag,
			bool createsNewPurchaseOrder, bool finishedPurchaseOrderFlag, string color ) {
				this.Id = id;
				this.Name = flagTypeName;
				this.Description = flagTypeDesc;
				this.SecurityLevel = userLevel;
                this.IsShipmentFlag = shipmentFlag;
                this.IsUserFlag = userFlag;
                this.IsOrderFlag = orderFlag;
                this.IsLineFlag = lineFlag;
                this.IsLineDetailFlag = lineDetailFlag;
				this.IsCustomerReadable = customerReadable;
				this.AgingDaysStatus1 = agingDaysStatus1;
				this.AgingDaysStatus2 = agingDaysStatus2;
				this.AgingDaysStatus3 = agingDaysStatus3;
				this.AgingDaysStatus4 = agingDaysStatus4;
				this.AgingDaysStatus5 = agingDaysStatus5;
				this.ShowInProductionAgingReport = showInProductionAgingReport;
				this.ProductionAgingReportOrder = productionAgingReportOrder;
				this.CannotOccurBeforeFlagId = cannotOccurBeforeFlagId;
				this.CannotOccurAfterFlagId = cannotOccurAfterFlagId;
				this.PurchaseOrderFlag = purchaseOrderFlag;
				this.PurchaseShipmentFlag = purchaseShipmentFlag;
				this.PurchaseLineFlag = purchaseLineFlag;
				this.CreatesNewPurchaseOrder = createsNewPurchaseOrder;
				this.FinishedPurchaseOrderFlag = finishedPurchaseOrderFlag;
				this.Color = System.Drawing.Color.FromName( color );
            }
            #endregion
        }
		/// <summary>
		/// Collection of flags for the site to hold in its cache.
		/// </summary>
		public class FlagTypes {
            #region Instance Fields
            /// <summary>
			/// List of the flags.
			/// </summary>
			public List<Flag> List = new List<Flag>();
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="FlagTypes"/> class.
			/// </summary>
			/// <param name="site">The site to read from.</param>
			public FlagTypes( Site site ) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getFlagTypes", cn)) {
                        using(SqlDataReader r = cmd.ExecuteReader()) {
                            while(r.Read()) {
                                Flag f = new Flag(
                                    r.GetInt32(0) /*flagTypeId*/,
                                    r.GetString(1) /*flagTypeName*/,
                                    r.GetString(2) /*flagTypeDesc*/,
                                    r.GetInt32(3) /*userLevel*/,
                                    r.GetBoolean(4) /*shipmentFlag*/,
                                    r.GetBoolean(5) /*userFlag*/,
                                    r.GetBoolean(6) /*orderFlag*/,
                                    r.GetBoolean(7) /*lineFlag*/,
                                    r.GetBoolean(8) /*lineDetailFlag*/,
                                    r.GetString(9) /*customerReadable*/,
                                    r.GetInt32(10) /*agingDaysStatus1*/,
                                    r.GetInt32(11) /*agingDaysStatus2*/,
                                    r.GetInt32(12) /*agingDaysStatus3*/,
                                    r.GetInt32(13) /*agingDaysStatus4*/,
                                    r.GetInt32(14) /*agingDaysStatus5*/,
                                    r.GetBoolean(15) /*showInProductionAgingReport*/,
                                    r.GetInt32(16) /*productionAgingReportOrder*/,
                                    r.GetInt32(17) /*cannotOccurBeforeFlagId*/,
                                    r.GetInt32(18) /*cannotOccurAfterFlagId*/,
                                    r.GetBoolean(19) /*purchaseOrderFlag*/,
                                    r.GetBoolean(20) /*purchaseShipmentFlag*/,
                                    r.GetBoolean(21) /*purchaseLineFlag*/,
                                    r.GetBoolean(22) /*createsNewPurchaseOrder*/,
                                    r.GetBoolean(23) /*finishedPurchaseOrderFlag*/,
                                    r.GetString(24) /*color*/
                                );
                                List.Add(f);
                            }
                        }
                    }
                }
            }
            #endregion
        }
	}
}
