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
        /// A country in the list of countries.  Like tears in the rain.
        /// </summary>
        public class Country {
            #region Static Properties
            /// <summary>
            /// Gets all countries.
            /// </summary>
            public static List<Country> All {
                get {
                    return Main.Site.Countries.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// Name of the country
            /// </summary>
            public string Name { get; internal set; }
            #endregion
            #region Instance Methods
            /// <summary>
            /// Returns a <see cref="System.String"/> that represents this instance.
            /// </summary>
            /// <returns>
            /// A <see cref="System.String"/> that represents this instance.
            /// </returns>
            public override string ToString() {
                return this.Name;
            }
            #endregion
            #region Instance Constructor
            /// <summary>
            /// Initializes a new instance of the <see cref="Country"/> class.
            /// </summary>
            /// <param name="f_name">The f_name.</param>
            public Country(string f_name) {
                Name = f_name;
            }
            #endregion
        }
        /// <summary>
        /// country list, for easy consistant form creation
        /// </summary>
        internal class Countries {
            #region Instance Fields
            /// <summary>
            /// List of the countries in dbo.countries 
            /// </summary>
            public List<Country> List = new List<Country>();
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Countries"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public Countries(Site site) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getCountries", cn)) {
                        using(SqlDataReader countryList = cmd.ExecuteReader()) {
                            while(countryList.Read()) {
                                List.Add(new Country(countryList.GetString(0)));
                            }
                        }
                    }
                }
            }
            #endregion
        }
    }
}
