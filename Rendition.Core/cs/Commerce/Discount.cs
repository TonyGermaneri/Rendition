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
using System.Diagnostics;
namespace Rendition {
    public partial class Commerce {
        /// <summary>
        /// Discount list
        /// </summary>
        internal class Discounts {
            #region Instance Fields
            /// <summary>
            /// A list of the discounts in dbo.discount
            /// </summary>
            public List<Discount> List = new List<Discount>();
            #endregion
            #region Instance Methods
            /// <summary>
            /// Adds the specified new discount.
            /// </summary>
            /// <param name="newProperty">The new discount.</param>
            public void Add(Discount newProperty) {
                List.Add(newProperty);
            }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Discounts"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public Discounts(Site site) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getDiscounts", cn)) {
                        using(SqlDataReader disc_list = cmd.ExecuteReader()) {
                            while(disc_list.Read()) {
                                List.Add(new Discount(
                                    disc_list.GetString(0).MaxLength(50, true, true),
                                    disc_list.GetFloat(1),
                                    disc_list.GetString(2).MaxLength(1000, true, true)
                                ));
                            }
                        }
                    }
                }
                return;
            }
            #endregion
        }
        /// <summary>
        /// Discount drawn from the table dbo.discount
        /// </summary>
        public class Discount {
            #region Static Properties
            /// <summary>
            /// Gets all discounts.
            /// </summary>
            public static List<Discount> All {
                get {
                    return Main.Site.Discounts.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// Discount code. The code the customer enters to get the discount.
            /// </summary>
            public string Code { get; internal set; }
            /// <summary>
            /// Percentage off when this discount code is used.
            /// </summary>
            public float Percent { get; internal set; }
            /// <summary>
            /// Description of the discount.
            /// </summary>
            public string Comments { get; internal set; }
            #endregion
            #region Static Methods
            /// <summary>
            /// Adds the specified new discount.
            /// </summary>
            /// <param name="newProperty">The new discount.</param>
            public static void Add(Discount newProperty) {
                bool propertyIsNull = Main.Site.Discounts != null;
                string err_msg = "The site discounts class was not initilized correctly.";
                if(propertyIsNull) {
                    Main.Site.Discounts.List.Add(newProperty);
                } else {
                    NullReferenceException ex = new NullReferenceException(err_msg);
                    throw ex;
                }
            }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Discount"/> class.
            /// </summary>
            /// <param name="f_code">The f_code.</param>
            /// <param name="pct">The PCT.</param>
            /// <param name="f_comments">The f_comments.</param>
            public Discount(string f_code, float pct, string f_comments) {
                Code = f_code;
                Percent = pct;
                Comments = f_comments;
            }
            #endregion
        }
    }
}
