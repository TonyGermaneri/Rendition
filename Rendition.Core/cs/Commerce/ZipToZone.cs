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
        /// Zip to zone table.
        /// </summary>
        public class ZipToZone {
            #region Static Properties
            /// <summary>
            /// Gets all ZipToZones.
            /// </summary>
            public static List<ZipToZone> All {
                get {
                    return Main.Site.ZipToZones.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// Id of the zip to zone entry.
            /// </summary>
            public Guid Id { get; internal set; }
            /// <summary>
            /// The Carrier the zip to zone table belongs to.
            /// </summary>
            public int CarrierId { get; internal set; }
            /// <summary>
            /// The source zip code of this zip to zone table.
            /// </summary>
            public int SourceZip { get; internal set; }
            /// <summary>
            /// The rate Id this zip to zone table belongs to.
            /// </summary>
            public int RateId { get; internal set; }
            /// <summary>
            /// The from zip code of this zone.
            /// </summary>
            public int FromZip { get; internal set; }
            /// <summary>
            /// The to zip code of this zone.
            /// </summary>
            public int ToZip { get; internal set; }
            /// <summary>
            /// The zone.
            /// </summary>
            public int ShipZone { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="ZipToZone"/> class.
            /// </summary>
            /// <param name="f_id">The f_id.</param>
            /// <param name="f_carrierId">The f_carrier id.</param>
            /// <param name="f_sourceZip">The f_source zip.</param>
            /// <param name="f_rateId">The f_rate id.</param>
            /// <param name="f_fromzip">The f_fromzip.</param>
            /// <param name="f_tozip">The f_tozip.</param>
            /// <param name="f_shipzone">The f_shipzone.</param>
            public ZipToZone(Guid f_id, int f_carrierId, int f_sourceZip, int f_rateId, int f_fromzip, int f_tozip, int f_shipzone) {
                Id = f_id;
                CarrierId = f_carrierId;
                SourceZip = f_sourceZip;
                RateId = f_rateId;
                FromZip = f_fromzip;
                ToZip = f_tozip;
                ShipZone = f_shipzone;
            }
            #endregion
        }
        /// <summary>
        /// Zip to zone lookup for all Carriers on the site.
        /// </summary>
        internal class ZipToZones {
            #region Instance Fields
            /// <summary>
            /// List of the zip to zone entries
            /// </summary> 
            public List<ZipToZone> List { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="ZipToZones"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public ZipToZones(Site site) {
                List = new List<ZipToZone>();
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getZipToZones", cn)) {
                        using(SqlDataReader zoneList = cmd.ExecuteReader()) {
                            while(zoneList.Read()) {
                                List.Add(new ZipToZone(
                                    zoneList.GetGuid(0),
                                    zoneList.GetInt32(1),
                                    zoneList.GetInt32(2),
                                    zoneList.GetInt32(3),
                                    zoneList.GetInt32(4),
                                    zoneList.GetInt32(5),
                                    zoneList.GetInt32(6)
                                ));
                            }
                        }
                    }
                }
            }
            #endregion
        }
    }
}
