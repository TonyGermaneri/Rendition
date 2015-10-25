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
		/// A single bill of material link.
		/// This class describes how one item is related to another.
		/// </summary>
		public class BillOfMaterial {
            #region Static Properties
            /// <summary>
            /// Gets all bill of materials.
            /// </summary>
            public static List<BillOfMaterial> All {
                get {
                    return Main.Site.BillOfMaterials.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
			/// Unique if of the bill of material
			/// </summary>
            public Guid Id { get; internal set; }
			/// <summary>
			/// Item number of assembly
			/// </summary>
            public string ItemNumber { get; internal set; }
			/// <summary>
			/// Item number of the componet part
			/// </summary>
            public string SubItemNumber { get; internal set; }
			/// <summary>
			/// Quantity of the componet part
			/// </summary>
            public int Qty { get; internal set; }
			/// <summary>
			/// Show up on invoice
			/// </summary>
            public bool ShowAsSeperateLineOnInvoice { get; internal set; }
			/// <summary>
			/// Only when selected on form
			/// </summary>
            public bool OnlyWhenSelectedOnForm { get; internal set; }
			/// <summary>
			/// Group of componets this componet part belongs to
			/// </summary>
            public string ItemComponetType { get; internal set; }
			/// <summary>
			/// How deep is this assembly nested
			/// </summary>
            public int Depth { get; internal set; }
			/// <summary>
			/// quantity of requested assembly
			/// </summary>
            public int ItemQty { get; internal set; }
			/// <summary>
			/// Stock level of requested assembly
			/// </summary>
            public int KitStock { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="BillOfMaterial"/> class.
			/// </summary>
			/// <param name="id">The id.</param>
			/// <param name="itemNumber">The item number.</param>
			/// <param name="subItemNumber">The sub item number.</param>
			/// <param name="qty">The qty.</param>
			/// <param name="depth">The depth.</param>
			/// <param name="itemQty">The item qty.</param>
			/// <param name="kitStock">The kit stock.</param>
			/// <param name="showAsSeperateLineOnInvoice">if set to <c>true</c> [show as seperate line on invoice].</param>
			/// <param name="onlyWhenSelectedOnForm">if set to <c>true</c> [only when selected on form].</param>
			/// <param name="itemComponetType">Type of the item componet.</param>
			public BillOfMaterial( Guid id, string itemNumber, string subItemNumber, int qty,
			int depth, int itemQty, int kitStock, bool showAsSeperateLineOnInvoice,
			bool onlyWhenSelectedOnForm, string itemComponetType ) {
				this.Id = id;
				this.Depth = depth;
				this.ItemQty = itemQty;
				this.KitStock = kitStock;
				this.ItemNumber = itemNumber;
				this.SubItemNumber = subItemNumber;
				this.Qty = qty;
				this.ShowAsSeperateLineOnInvoice = showAsSeperateLineOnInvoice;
				this.OnlyWhenSelectedOnForm = onlyWhenSelectedOnForm;
				this.ItemComponetType = itemComponetType;
            }
            #endregion
        }
		/// <summary>
		/// Collection of all the bill of material links.
		/// </summary>
		public class BillOfMaterials {
            #region Instance Fields
            /// <summary>
			/// List of the assemblies in this site
			/// </summary>
			public List<BillOfMaterial> List = new List<BillOfMaterial>();
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="BillOfMaterials"/> class.
			/// </summary>
			/// <param name="site">The site.</param>
			public BillOfMaterials( Site site ) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getBillOfMaterials", cn)) {
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            while(d.Read()) {
                                List.Add(
                                    new BillOfMaterial(
                                        d.GetGuid(0),
                                        d.GetString(1),
                                        d.GetString(2),
                                        d.GetInt32(3),
                                        d.GetInt32(4),
                                        d.GetInt32(5),
                                        d.GetInt32(6),
                                        d.GetBoolean(7),
                                        d.GetBoolean(8),
                                        d.GetString(9)
                                    )
                                );
                            }
                        }
                    }
                }
            }
            #endregion
        }
	}
}
