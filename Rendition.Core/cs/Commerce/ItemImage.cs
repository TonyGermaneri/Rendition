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
namespace Rendition {
    public partial class Commerce {
        /// <summary>
        /// Images associated with a particular item.
        /// </summary>
        internal class ItemImages {
            #region Instance Fields
            /// <summary>
            /// List of image associated with a particular item.
            /// </summary>
            public List<Image> List = new List<Image>();
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="ItemImages"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public ItemImages(Site site) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand(@"select 
imagingId,rtrim(itemNumber) as itemNumber,fileName,height,width 
from imaging with (nolock)", cn)) {
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            if(d.HasRows) {
                                while(d.Read()) {
                                    List.Add(new Image(
                                        d.GetGuid(0),
                                        d.GetString(1),
                                        d.GetString(2),
                                        d.GetInt32(3),
                                        d.GetInt32(4),
                                        "o",
                                        site
                                    ));
                                }
                            }
                        }
                    }
                }
                return;
            }
            #endregion
        }
        /// <summary>
        /// A list of all item images.
        /// </summary>
        internal class RenderedImages {
            #region Instance Fields
            /// <summary>
            /// All images created by this program.
            /// </summary>
            public List<Image> List = new List<Image>();
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="RenderedImages"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public RenderedImages(Site site) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand(@"select imagingId,itemNumber,fileName,height,width,locationType
				from imagingDetail where unique_siteId = @siteId", cn)) {
                        cmd.Parameters.Add("@siteId", SqlDbType.UniqueIdentifier).Value = new Guid(Site.Id.ToString());
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            if(d.HasRows) {
                                while(d.Read()) {
                                    List.Add(new Image(
                                        d.GetGuid(0),
                                        d.GetString(1),
                                        d.GetString(2),
                                        d.GetInt32(3),
                                        d.GetInt32(4),
                                        d.GetString(5),
                                        site
                                    ));
                                }
                            }
                        }
                    }
                }
                return;
            }
            #endregion
        }
    }
}
