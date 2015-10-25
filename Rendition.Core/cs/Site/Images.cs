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
namespace Rendition {
	/// <summary>
	/// This class represents the differnet types of images that can be placed on any given item.
	/// </summary>
	public class SiteImagePlaceholder {
		/// <summary>
		/// Types of images.
		/// </summary>
		public Dictionary<string, Guid> ImageTypes;
		/// <summary>
		/// Site id for this image set.
		/// </summary>
		public Guid SiteId;
		/// <summary>
		/// Main.
		/// </summary>
		public Guid M;
		/// <summary>
		/// Cart.
		/// </summary>
		public Guid C;
		/// <summary>
		/// Form.
		/// </summary>
		public Guid F;
		/// <summary>
		/// Tiny.
		/// </summary>
		public Guid T;
		/// <summary>
		/// Aux a.
		/// </summary>
		public Guid A;
		/// <summary>
		/// Aux x.
		/// </summary>
		public Guid X;
		/// <summary>
		/// Aux y.
		/// </summary>
		public Guid Y;
		/// <summary>
		/// Aux z.
		/// </summary>
		public Guid Z;
		/// <summary>
		/// Aux b.
		/// </summary>
		public Guid B;
		/// <summary>
		/// Detail Image.
		/// </summary>
		public Guid D;
		/// <summary>
		/// The Address of the site.
		/// </summary>
		public string SiteAddress;
		/// <summary>
		/// Initializes a new instance of the <see cref="SiteImagePlaceholder"/> class.
		/// </summary>
		/// <param name="siteId">The site id.</param>
		/// <param name="m">The m.</param>
		/// <param name="c">The c.</param>
		/// <param name="f">The f.</param>
		/// <param name="t">The t.</param>
		/// <param name="a">A.</param>
		/// <param name="x">The x.</param>
		/// <param name="y">The y.</param>
		/// <param name="z">The z.</param>
		/// <param name="b">The b.</param>
		/// <param name="d">The d.</param>
		/// <param name="siteAddress">The site Address.</param>
		public SiteImagePlaceholder( Guid siteId, Guid m, Guid c, Guid f, Guid t, Guid a, Guid x, Guid y, Guid z, Guid b, Guid d, string siteAddress ) {
			this.SiteId = siteId;
			this.M = m;
			this.C = c;
			this.F = f;
			this.T = t;
			this.A = a;
			this.X = x;
			this.Y = y;
			this.Z = z;
			this.B = b;
			this.D = d;
			this.ImageTypes = new Dictionary<string, Guid>();
			this.ImageTypes.Add( "m", m );
			this.ImageTypes.Add( "c", c );
			this.ImageTypes.Add( "f", f );
			this.ImageTypes.Add( "t", t );
			this.ImageTypes.Add( "a", a );
			this.ImageTypes.Add( "x", x );
			this.ImageTypes.Add( "y", y );
			this.ImageTypes.Add( "z", z );
			this.ImageTypes.Add( "b", b );
			this.ImageTypes.Add( "d", d );
			this.SiteAddress = siteAddress;
		}
	}
	/// <summary>
	/// A list of site image placeholders.
	/// </summary>
	internal class SiteImagePlaceholders {
		/// <summary>
		/// The list of site image placeholders.
		/// </summary>
		public List<SiteImagePlaceholder> List;
		/// <summary>
		/// Initializes a new instance of the <see cref="SiteImagePlaceholders"/> class.
		/// </summary>
		/// <param name="site">The site.</param>
		public SiteImagePlaceholders( Site site ) {
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(@"select unique_siteId, m_imagingTemplate,c_imagingTemplate,f_imagingTemplate,t_imagingTemplate,
		a_imagingTemplate,x_imagingTemplate,y_imagingTemplate,z_imagingTemplate,b_imagingTemplate,d_imagingTemplate, siteaddress
		from site_configuration", cn)) {
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        List = new List<SiteImagePlaceholder>();
                        while(r.Read()) {
                            List.Add(new SiteImagePlaceholder(
                                r.GetGuid(0),
                                r.GetGuid(1),
                                r.GetGuid(2),
                                r.GetGuid(3),
                                r.GetGuid(4),
                                r.GetGuid(5),
                                r.GetGuid(6),
                                r.GetGuid(7),
                                r.GetGuid(8),
                                r.GetGuid(9),
                                r.GetGuid(10),
                                r.GetString(11)
                            ));
                        }
                    }
                }
            }
		}
	}
}
