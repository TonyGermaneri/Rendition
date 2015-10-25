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
        /// Shipping rate.
        /// </summary>
        public class Rate {
            #region Static Properties
            /// <summary>
            /// Gets all rates.
            /// </summary>
            public static List<Rate> All {
                get {
                    return Main.Site.Rates.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// Id of the rate.
            /// </summary>
            public int Id { get; internal set; }
            /// <summary>
            /// Name of the rate.
            /// </summary>
            public string Name { get; internal set; }
            /// <summary>
            /// The order this rate shows up in.
            /// </summary>
            public int Order { get; internal set; }
            /// <summary>
            /// Is this rate for shipment outside of this country?
            /// </summary>
            public bool International { get; internal set; }
            /// <summary>
            /// Is this rate enabled?
            /// </summary>
            public bool Enabled { get; internal set; }
            /// <summary>
            /// What type of rate is this (not implemented).
            /// </summary>
            public int RateType { get; internal set; }
            /// <summary>
            /// The zone Carrier id.
            /// </summary>
            public int ZoneCarrierId { get; internal set; }
            /// <summary>
            /// Zone service class.
            /// </summary>
            public int ZoneServiceClass { get; internal set; }
            /// <summary>
            /// Is this a discountable rate?
            /// </summary>
            public bool DiscountRate { get; internal set; }
            /// <summary>
            /// The link that displays information on the Carriers website about this shipment.
            /// </summary>
            public string TrackingLink { get; internal set; }
            /// <summary>
            /// Commercial area surcharge.
            /// </summary>
            public decimal CmrAreaSurch { get; internal set; }
            /// <summary>
            /// Residential area surcharge.
            /// </summary>
            public decimal ResAreaSurchg { get; internal set; }
            /// <summary>
            /// Ground fuel surcharge.
            /// </summary>
            public double GroundFuelSurchgPct { get; internal set; }
            /// <summary>
            /// Air fuel surcharge.
            /// </summary>
            public double AirFuelSurchgPct { get; internal set; }
            /// <summary>
            /// This rate shows up in the retail cart.
            /// </summary>
            public bool ShowsUpInRetailCart { get; internal set; }
            /// <summary>
            /// This rate shows up it the wholesale cart.
            /// </summary>
            public bool ShowsUpInWholesaleCart { get; internal set; }
            /// <summary>
            /// This rate shows up in order entry application.
            /// </summary>
            public bool ShowsUpInOrderEntry { get; internal set; }
            /// <summary>
            /// Estimated shipping cost (not implemented).
            /// </summary>
            public decimal EstShippingCost { get; internal set; }
            /// <summary>
            /// Ship Zone (not implemented).
            /// </summary>
            public int ShipZone { get; internal set; }
            /// <summary>
            /// Selected (not implemented).
            /// </summary>
            public bool Selected { get; internal set; }
            #endregion
            #region Instance Methods
            /// <summary>
            /// Returns a <see cref="System.String"/> that represents this instance.  Returns rate.name.
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
            /// Initializes a new instance of the <see cref="Rate"/> class.
            /// </summary>
            /// <param name="f_id">The f_id.</param>
            /// <param name="f_name">The f_name.</param>
            /// <param name="f_order">The f_order.</param>
            /// <param name="f_international">if set to <c>true</c> [f_international].</param>
            /// <param name="f_enabled">if set to <c>true</c> [f_enabled].</param>
            /// <param name="f_ratetype">The f_ratetype.</param>
            /// <param name="f_zoneCarrierId">The f_zone Carrier id.</param>
            /// <param name="f_ZoneServiceClass">The f_ zone service class.</param>
            /// <param name="f_discountRate">if set to <c>true</c> [f_discount rate].</param>
            /// <param name="f_trackingLink">The f_tracking link.</param>
            /// <param name="f_cmrAreaSurch">The F_CMR area surch.</param>
            /// <param name="f_resAreaSurchg">The f_res area surchg.</param>
            /// <param name="f_groundFuelSurchgPct">The f_ground fuel surchg PCT.</param>
            /// <param name="f_airFuelSurchgPct">The f_air fuel surchg PCT.</param>
            /// <param name="f_showsUpInRetailCart">if set to <c>true</c> [f_shows up in retail cart].</param>
            /// <param name="f_showsUpInWholesaleCart">if set to <c>true</c> [f_shows up in wholesale cart].</param>
            /// <param name="f_showsUpInOrderEntry">if set to <c>true</c> [f_shows up in order entry].</param>
            public Rate(int f_id, string f_name, int f_order, bool f_international, bool f_enabled, int f_ratetype,
            int f_zoneCarrierId, int f_ZoneServiceClass, bool f_discountRate, string f_trackingLink, decimal f_cmrAreaSurch,
            decimal f_resAreaSurchg, double f_groundFuelSurchgPct, double f_airFuelSurchgPct, bool f_showsUpInRetailCart,
            bool f_showsUpInWholesaleCart, bool f_showsUpInOrderEntry) {
                EstShippingCost = 0;
                ShipZone = 0;
                Id = f_id;
                Name = f_name;
                Order = f_order;
                International = f_international;
                Enabled = f_enabled;
                RateType = f_ratetype;
                ZoneCarrierId = f_zoneCarrierId;
                ZoneServiceClass = f_ZoneServiceClass;
                DiscountRate = f_discountRate;
                TrackingLink = f_trackingLink;
                CmrAreaSurch = f_cmrAreaSurch;
                ResAreaSurchg = f_resAreaSurchg;
                GroundFuelSurchgPct = f_groundFuelSurchgPct;
                AirFuelSurchgPct = f_airFuelSurchgPct;
                ShowsUpInRetailCart = f_showsUpInRetailCart;
                ShowsUpInWholesaleCart = f_showsUpInWholesaleCart;
                ShowsUpInOrderEntry = f_showsUpInOrderEntry;
            }
            #endregion
        }
        /// <summary>
        /// A list of rates avalible on the site for all services and Carriers.
        /// </summary>
        internal class Rates {
            #region Instance Fields
            /// <summary>
            /// A list of rates avalible on the site for all services and Carriers.
            /// </summary>
            public List<Rate> List { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Rates"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public Rates(Site site) {
                List = new List<Rate>();
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getRates", cn)) {
                        using(SqlDataReader rateList = cmd.ExecuteReader()) {
                            while(rateList.Read()) {
                                Rate r = new Rate(
                                    rateList.GetInt32(1),
                                    rateList.GetString(0),
                                    rateList.GetInt32(2),
                                    rateList.GetBoolean(3),
                                    rateList.GetBoolean(4),
                                    rateList.GetInt32(5),
                                    rateList.GetInt32(6),
                                    rateList.GetInt32(7),
                                    rateList.GetBoolean(8),
                                    rateList.GetString(9),
                                    rateList.GetDecimal(10),
                                    rateList.GetDecimal(11),
                                    rateList.GetDouble(12),
                                    rateList.GetDouble(13),
                                    rateList.GetBoolean(14),
                                    rateList.GetBoolean(15),
                                    rateList.GetBoolean(16)
                                );
                                List.Add(r);
                            }
                        }
                    }
                }
                /* the null rate is so users that can't find a suitable shipping type will still get a cart */
                Rate n = new Rate(-1, "No suitable rate", 9999, true, true, -1, -1, -1, true, "", 0, 0, 0, 0, false, false, false);
                List.Add(n);
            }
            #endregion
        }
    }
}
