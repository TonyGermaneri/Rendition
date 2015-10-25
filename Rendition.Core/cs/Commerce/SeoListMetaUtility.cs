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
        /// Search Engine Optimization that manages the title/keywords/descripton of item listing pages.
        /// </summary>
        internal class SeoListMetaUtilities {
            #region Instance Fields
            /// <summary>
            /// List of the SEO objects.
            /// </summary>
            public List<SeoListMetaUtility> List = new List<SeoListMetaUtility>();
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="SeoListMetaUtilities"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public SeoListMetaUtilities(Site site) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    SqlCommand cmd = new SqlCommand("dbo.getPageTitles", cn);
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        while(r.Read()) {
                            SeoListMetaUtility d = new SeoListMetaUtility(r.GetGuid(0), r.GetInt32(1)
                            , r.GetString(2), r.GetString(3), r.GetString(4), r.GetString(5));
                            List.Add(d);
                        }
                    }
                }
            }
            #endregion
            #region Instance Methods
            /// <summary>
            /// Gets the SEO list meta utility by category name.
            /// </summary>
            /// <param name="name">The name.</param>
            /// <returns></returns>
            public SeoListMetaUtility GetSEOListMetaUtilityByName(string name) {
                return Main.Site.SeoListMetaUtilities.List.Find(delegate(Commerce.SeoListMetaUtility meta) {
                    return meta.Category == name;
                });
            }
            /// <summary>
            /// Gets the SEO list meta utility by id.
            /// </summary>
            /// <param name="id">The id.</param>
            /// <returns>Selected SEOListMetaUtility</returns>
            public SeoListMetaUtility GetSEOListMetaUtilityById(Guid id) {
                return Main.Site.SeoListMetaUtilities.List.Find(delegate(Commerce.SeoListMetaUtility meta) {
                    return meta.Id == id;
                });
            }
            #endregion
        }
        /// <summary>
        /// Search Engine Optimization utitliy for setting the  title/keywords/descripton of item listing pages.
        /// </summary>
        public class SeoListMetaUtility {
            #region Static Properties
            /// <summary>
            /// Gets all SeoListMetaUtilities.
            /// </summary>
            public static List<SeoListMetaUtility> All {
                get {
                    return Main.Site.SeoListMetaUtilities.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// Id of this utility.
            /// </summary>
            public Guid Id { get; internal set; }
            /// <summary>
            /// Listing page this utitlity is for.
            /// </summary>
            public int Page { get; internal set; }
            /// <summary>
            /// Category name this utility is for.
            /// </summary>
            public string Category { get; internal set; }
            /// <summary>
            /// Title of the page.
            /// </summary>
            public string Title { get; internal set; }
            /// <summary>
            /// Descripton of the page.
            /// </summary>
            public string MetaDescription { get; internal set; }
            /// <summary>
            /// Keywords of the page.
            /// </summary>
            public string MetaKeywords { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="SeoListMetaUtility"/> class.
            /// </summary>
            /// <param name="_id">The _id.</param>
            /// <param name="_page">The _page.</param>
            /// <param name="_category">The _category.</param>
            /// <param name="_title">The _title.</param>
            /// <param name="_metaDescription">The _meta description.</param>
            /// <param name="_metaKeywords">The _meta keywords.</param>
            public SeoListMetaUtility(Guid _id, int _page, string _category, 
                string _title, string _metaDescription, string _metaKeywords) {
                Id = _id;
                Page = _page;
                Category = _category.Trim();/* front loaded - this has to be matched per refresh from user input */
                Title = _title.Trim();
                MetaDescription = _metaDescription.Trim();
                MetaKeywords = _metaKeywords.Trim();
            }
            #endregion
        }
    }
}
