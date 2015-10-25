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
        /// List of terms in the site.
        /// </summary>
        internal class Terms {
            #region Instance Fields
            /// <summary>
            /// The actual list of terms
            /// </summary>
            public List<Term> List { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Terms"/> class.
            /// </summary>
            /// <param name="_site">The _site.</param>
            public Terms(Site _site) {
                List = new List<Term>();
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    SqlCommand cmd = new SqlCommand("dbo.getTerms", cn);
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        while(r.Read()) {
                            Term d = new Term(r.GetInt32(0), r.GetString(1), r.GetInt32(2), r.GetBoolean(3));
                            List.Add(d);
                        }
                    }
                }
            }
            #endregion
        }
        /// <summary>
        /// Terms of payment for purchase orders and work orders.
        /// </summary>
        public class Term {
            #region Static Properties
            /// <summary>
            /// Gets all Terms.
            /// </summary>
            public static List<Term> All {
                get {
                    return Main.Site.Terms.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// Id of the term (as defined in the dbo.terms table)
            /// </summary>
            public int Id { get; internal set; }
            /// <summary>
            /// Name of this term.
            /// </summary>
            public string Name { get; internal set; }
            /// <summary>
            /// How many days until this term becomes payment due.
            /// </summary>
            public int TermDays { get; internal set; }
            /// <summary>
            /// Does this term create sales reciepts (false) or invoice recievables (true)
            /// </summary>
            public bool Accrued { get; internal set; }
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
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Term"/> class.
            /// </summary>
            /// <param name="_id">The _id.</param>
            /// <param name="_name">The _name.</param>
            /// <param name="_termDays">The _term days.</param>
            /// <param name="_accrued">if set to <c>true</c> [_accrued].</param>
            public Term(int _id, string _name, int _termDays, bool _accrued) {
                Id = _id;
                Name = _name;
                TermDays = _termDays;
                Accrued = _accrued;
            }
            #endregion
        }
    }
}
