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
        /// Represents a zone to ship to in a shipping rate.
        /// </summary>
        public class Zone {
            #region Static Properties
            /// <summary>
            /// Gets all Zones.
            /// </summary>
            public static List<Zone> All {
                get {
                    return Main.Site.Zones.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// The unique id of the zone.
            /// </summary>
            public Guid Id { get; internal set; }
            /// <summary>
            /// The shipping rate this zone belongs to.
            /// </summary>
            public int Rate { get; internal set; }
            /// <summary>
            /// The weight for this zone.
            /// </summary>
            public double Weight { get; internal set; }
            /// <summary>
            /// The zone.
            /// </summary>
            public int ShipZone { get; internal set; }
            /// <summary>
            /// The cost for this zone.
            /// </summary>
            public decimal Cost { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Zone"/> class.
            /// </summary>
            /// <param name="f_id">The f_id.</param>
            /// <param name="f_rate">The f_rate.</param>
            /// <param name="f_weight">The f_weight.</param>
            /// <param name="f_shipzone">The f_shipzone.</param>
            /// <param name="f_cost">The f_cost.</param>
            public Zone(Guid f_id, int f_rate, double f_weight, int f_shipzone, decimal f_cost) {
                Id = f_id;
                Rate = f_rate;
                Weight = f_weight;
                ShipZone = f_shipzone;
                Cost = f_cost;
            }
            #endregion
        }
        /// <summary>
        /// List of all the zones in all services in all cariers.
        /// </summary>
        internal class Zones {
            #region Instance Fields
            /// <summary>
            /// List of all the zones in all services in all cariers.
            /// </summary>
            public List<Zone> List = new List<Zone>();
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Zones"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public Zones(Site site) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getZones", cn)) {
                        using(SqlDataReader carrierList = cmd.ExecuteReader()) {
                            while(carrierList.Read()) {
                                List.Add(new Zone(
                                        carrierList.GetGuid(0),
                                        carrierList.GetInt32(1),
                                        carrierList.GetDouble(2),
                                        carrierList.GetInt32(3),
                                        carrierList.GetDecimal(4)
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