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
        /// Shipping Carrier.
        /// </summary>
        public class Carrier {
            #region Static Properties
            /// <summary>
            /// Gets all carriers.
            /// </summary>
            public static List<Carrier> All {
                get {
                    return Main.Site.Carriers.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// Id of the Carrier.
            /// </summary>
            public int Id { get; internal set; }
            /// <summary>
            /// Name of the Carrier.
            /// </summary>
            public string Name { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Carrier"/> class.
            /// </summary>
            /// <param name="f_id">The f_id.</param>
            /// <param name="f_name">The f_name.</param>
            public Carrier(int f_id, string f_name) {
                Id = f_id;
                Name = f_name;
            }
            #endregion
        }
        /// <summary>
        /// Shipping Carriers on the site.  Carriers in the root class for rates, zones etc.
        /// </summary>
        internal class Carriers {
            #region Instance Fields
            /// <summary>
            /// List of the Carriers.
            /// </summary>
            public List<Carrier> List = new List<Carrier>();
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Carriers"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public Carriers(Site site) {
                List = new List<Carrier>();
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getCarriers", cn)) {
                        using(SqlDataReader carrierList = cmd.ExecuteReader()) {
                            while(carrierList.Read()) {
                                List.Add(new Carrier(
                                        carrierList.GetInt32(0),
                                        carrierList.GetString(1)
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
