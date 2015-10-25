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
		/// List of all Apparel Sizes
		/// </summary>
		internal class Sizes {
            #region Instance Fields
            /// <summary>
			/// List of sizes.
			/// </summary>
			public List<Commerce.Size> List = new List<Size>();
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Sizes"/> class.
			/// </summary>
			/// <param name="site">The site.</param>
			public Sizes( Site site ){
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand(@"select
				sizeId, size, sizeDescription, sizeInteger
				from sizes with (nolock)", cn)) {
                        cmd.Parameters.Add("@siteId", SqlDbType.UniqueIdentifier).Value = new Guid(Site.Id.ToString());
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            while(d.Read()) {
                                List.Add(new Commerce.Size(d.GetGuid(0),
                                d.GetString(1), d.GetString(2),
                                Convert.ToDecimal(d.GetDouble(3))));
                            }
                        }
                    }
                }
				return;
            }
            #endregion
        }
		/// <summary>
		/// List of all Apparel Swatches
		/// </summary>
		internal class Swatches {
            #region Instance Fields
            /// <summary>
			/// List of swatches
			/// </summary>
			public List<Commerce.Swatch> List = new List<Commerce.Swatch>();
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Swatches"/> class.
			/// </summary>
			/// <param name="site">The site.</param>
			public Swatches( Site site ) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand(@"select
				swatchId, description, code, path, VerCol
				from swatches with (nolock)", cn)) {
                        cmd.Parameters.Add("@siteId", SqlDbType.UniqueIdentifier).Value = new Guid(Site.Id.ToString());
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            while(d.Read()) {
                                List.Add(new Commerce.Swatch(d.GetGuid(0), d.GetString(1), d.GetString(2), d.GetString(3)));
                            }
                        }
                    }
                }
				return;
            }
            #endregion
        }
		/// <summary>
		/// The color or pattern of an item.
		/// </summary>
		public class Swatch {
            #region Static Properties
            /// <summary>
            /// Gets all swatches.
            /// </summary>
            public static List<Swatch> All {
                get {
                    return Main.Site.Swatches.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
			/// Unique id of the swatch
			/// </summary>
            public Guid Id { get; internal set; }
			/// <summary>
			/// Name or code of the swatch.
			/// </summary>
            public string Name { get; internal set; }
			/// <summary>
			/// Descripton of the swatch
			/// </summary>
            public string Description { get; internal set; }
			/// <summary>
			/// Path to all the sample images.
			/// </summary>
            public string PathToSampleImages { get; internal set; }
			/// <summary>
			/// Gets the sample images as a list of paths.
			/// </summary>
			public List<string> SampleImages {
				get {
					return new List<string>();
				}
			}
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Swatch"/> class.
			/// </summary>
			/// <param name="_id">The _id.</param>
			/// <param name="_description">The _description.</param>
			/// <param name="_name">The _name.</param>
			/// <param name="_pathToSampleImages">The _path to sample images.</param>
			public Swatch( Guid _id, string _description, string _name, string _pathToSampleImages ) {
				Id = _id;
				Name = _name;
				Description = _description;
				PathToSampleImages = _pathToSampleImages;
            }
            #endregion
        }
		/// <summary>
		/// The size of an item.
		/// </summary>
		public class Size {
            #region Static Properties
            /// <summary>
            /// Gets all sizes.
            /// </summary>
            public static List<Size> All {
                get {
                    return Main.Site.Sizes.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
			/// Unique id of the size.
			/// </summary>
            public Guid Id { get; internal set; }
			/// <summary>
			/// Name of the size.
			/// </summary>
			public string Name  { get; internal set; }
			/// <summary>
			/// Description of the size.
			/// </summary>
            public string Description { get; internal set; }
			/// <summary>
			/// Numeric size of the size for ordering in lists with other sizes.
			/// </summary>
            public decimal NumericSize { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Size"/> class.
			/// </summary>
			/// <param name="_id">The _id.</param>
			/// <param name="_name">The _name.</param>
			/// <param name="_description">The _description.</param>
			/// <param name="_numericSize">Size of the _numeric.</param>
			public Size( Guid _id, string _name, string _description, decimal _numericSize ) {
				Id = _id;
				Name = _name;
				Description = _description;
				NumericSize = _numericSize;
            }
            #endregion
        }
	}
}
