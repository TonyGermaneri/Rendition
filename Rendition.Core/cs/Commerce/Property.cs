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
using System.Data;
using System.Data.SqlClient;
namespace Rendition {
    public partial class Commerce {
        /// <summary>
        /// This represents a single physical or metaphysical property of the item.
        /// For example. height:30" or manufacture:Jim's Cogs
        /// </summary>
        public class Property {
            #region Static Properties
            /// <summary>
            /// Gets all properties.
            /// </summary>
            List<Property> All {
                get {
                    return Main.Site.Properties.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// The id of the property.
            /// </summary>
            public Guid Id { get; internal set; }
            /// <summary>
            /// The item number this property belongs to.
            /// </summary>
            public string ItemNumber { get; internal set; }
            /// <summary>
            /// The name of this property.
            /// </summary>
            public string Name { get; internal set; }
            /// <summary>
            /// The value of the property.
            /// </summary>
            public string Value { get; internal set; }
            /// <summary>
            /// The human readable version of the value for this property.
            /// </summary>
            public string Text { get; internal set; }
            /// <summary>
            /// What order this property shows up in relation to other Properties of the same item.
            /// </summary>
            public int Order { get; internal set; }
            /// <summary>
            /// If this property refers to an item in the database this is true.
            /// </summary>
            public bool IsItem { get; internal set; }
            /// <summary>
            /// The price of this property when it is selected.
            /// </summary>
            public decimal Price { get; internal set; }
            /// <summary>
            /// When true, this property will be added to the taxable total.
            /// </summary>
            public bool Taxable { get; internal set; }
            /// <summary>
            /// When true this property will appear on the invoice beneath the parent item.
            /// </summary>
            public bool ShowOnInvoice { get; internal set; }
            /// <summary>
            /// When true this property will appear in the "filter by" list in the item listings.
            /// </summary>
            public bool ShowInFilter { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Property"/> class.
            /// </summary>
            /// <param name="f_id">The f_id.</param>
            /// <param name="f_itemNumber">The f_item number.</param>
            /// <param name="f_property">The f_property.</param>
            /// <param name="f_value">The f_value.</param>
            /// <param name="f_text">The f_text.</param>
            /// <param name="f_order">The f_order.</param>
            /// <param name="f_isItem">if set to <c>true</c> [f_is item].</param>
            /// <param name="f_price">The f_price.</param>
            /// <param name="f_taxable">if set to <c>true</c> [f_taxable].</param>
            /// <param name="f_showOnInvoice">if set to <c>true</c> [f_show on invoice].</param>
            /// <param name="f_showInFilter">if set to <c>true</c> [f_show in filter].</param>
            public Property(Guid f_id, string f_itemNumber, string f_property, string f_value, string f_text, int f_order,
                            bool f_isItem, decimal f_price, bool f_taxable, bool f_showOnInvoice, bool f_showInFilter) {
                Id = f_id;
                ItemNumber = f_itemNumber;
                Name = f_property;
                Value = f_value;
                Text = f_text;
                Order = f_order;
                IsItem = f_isItem;
                Price = f_price;
                Taxable = f_taxable;
                ShowOnInvoice = f_showOnInvoice;
                ShowInFilter = f_showInFilter;
                return;
            }
            #endregion
        }
        /// <summary>
        /// This class creates a list of item Properties for use in the item class
        /// you can use the Properties list to filter items or just view addtional information
        /// </summary>
        internal class Properties {
            #region Instance Fields
            /// <summary>
            /// List of the Properties for all items.
            /// </summary>
            public List<Property> List = new List<Property>();
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Properties"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public Properties(Site site) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getProperties", cn)) {
                        using(SqlDataReader prop_list = cmd.ExecuteReader()) {
                            while(prop_list.Read()) {
                                List.Add(new Property(
                                    prop_list.GetGuid(0),
                                    prop_list.GetString(1),
                                    prop_list.GetString(2),
                                    prop_list.GetString(3),
                                    prop_list.GetString(4),
                                    prop_list.GetInt32(5),
                                    (bool)prop_list.GetSqlBoolean(6),
                                    prop_list.GetDecimal(7),
                                    (bool)prop_list.GetSqlBoolean(8),
                                    (bool)prop_list.GetSqlBoolean(9),
                                    (bool)prop_list.GetSqlBoolean(10)
                                ));
                            }
                        }
                    }
                }
                return;
            }
            #endregion
            #region Instance Methods
            /// <summary>
            /// Adds the specified new property.
            /// </summary>
            /// <param name="newProperty">The new property.</param>
            public void Add(Property newProperty) {
                List.Add(newProperty);
            }
            #endregion
        }
    }
}
