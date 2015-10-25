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
using Microsoft.SqlServer.Server;
using System.Text.RegularExpressions;
using System.Web;
namespace Rendition {
	public partial class Commerce {
		/// <summary>
		/// A category consists of a list of items.
		/// </summary>
		public class Category {
            #region Static Properties
            /// <summary>
            /// Gets all categories.
            /// </summary>
            public static List<Category> All {
                get {
                    return Main.Site.Categories.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
			/// The name of the category.
			/// </summary>
            public string Name { get; internal set; }
			/// <summary>
			/// The id of the category.
			/// </summary>
            public Guid Id { get; internal set; }
			/// <summary>
			/// The list of items in this category.
			/// </summary>
            public List<Item> Items { get; internal set; }
            /// <summary>
            /// When true the category is visible to the public.
            /// </summary>
            public bool Enabled { get; internal set; }
            /// <summary>
            /// The Regex object for the category rewriter.
            /// </summary>
            internal Regex URLMatch = null;
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Category"/> class.
			/// </summary>
			/// <param name="categoryName">Name of the category.</param>
			/// <param name="categoryId">The category id.</param>
            /// <param name="enabled">When true the category is enabled.</param>
			public Category( string categoryName, Guid categoryId, bool enabled ) {
                Items = new List<Item>();
				this.Id = categoryId;
				this.Name = categoryName.Trim();
                this.Enabled = enabled;
                URLMatch = new Regex(String.Format(Main.CategoryRewrite,
                    Name,
                    Id, Name.Replace(" ", "-"),
                    Name.Replace(" ", "_"),
                    Name.Replace(" ", ".")));
            }
            #endregion
            #region Static Methods
            /// <summary>
            /// Gets the category by name.
            /// </summary>
            /// <param name="f_categoryName">Name of the f_category.</param>
            /// <returns></returns>
            public static Category GetCategoryByName(string f_categoryName) {
                return Main.Site.Categories.GetCategoryByName(f_categoryName);
            }
            /// <summary>
            /// Gets the category by id.
            /// </summary>
            /// <param name="f_categoryId">The f_category id.</param>
            /// <returns></returns>
            public static Category GetCategoryById(Guid f_categoryId) {
                return Main.Site.Categories.GetCategoryById(f_categoryId);
            }
            #endregion
        }
		/// <summary>
		/// This class creates a list of categories and associated items.
		/// This class, when instantiated, connects to the data base and
		/// refreshes the list of items in categories.
		/// This list can be refreshed using the Rendition.Admin.refreshCategoriesCache() method.
		/// </summary>
		internal class Categories {
            #region Instance Fields
            /// <summary>
			/// List of categories.
			/// </summary>
			public List<Category> List = new List<Category>();
			private Guid CurrentId = Guid.NewGuid();
			private Category Cat;
			private Item I;
            #endregion
            #region Instance Methods
            /// <summary>
			/// Gets the category by looking up the name in the database.
			/// </summary>
			/// <param name="f_categoryName">Name of the category.</param>
			/// <returns>Selected category or null</returns>
			public Category GetCategoryByName( string f_categoryName ) {
				if( f_categoryName == null ) { return null; };
				return List.Find( delegate( Category c1 ) {
					return c1.Name.Trim().ToLower() == f_categoryName.Trim().ToLower();
				} );
			}
			/// <summary>
			/// Gets the category by its id in the database.
			/// </summary>
			/// <param name="f_categoryId">The category id.</param>
			/// <returns>Selected category or null</returns>
			public Category GetCategoryById( Guid f_categoryId ) {
				return List.Find( delegate( Category c1 ) {
					return c1.Id == f_categoryId;
				} );
			}
            #endregion
            #region Constructor
            /// <summary>
			/// Initializes a new instance of the <see cref="Categories"/> class.
			/// </summary>
			/// <param name="site">The site.</param>
			public Categories( Site site ) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.fullCategoryList", cn)) {
                        using(SqlDataReader categories = cmd.ExecuteReader()) {
                            while(categories.Read()) {
                                if(CurrentId != categories.GetGuid(categories.GetOrdinal("categoryId"))) {
                                    Cat = new Category(
                                        categories.GetString(categories.GetOrdinal("categoryName")),
                                        categories.GetGuid(categories.GetOrdinal("categoryId")),
                                        categories.GetBoolean(categories.GetOrdinal("enabled"))
                                    );
                                    CurrentId = Cat.Id;
                                    List.Add(Cat);
                                }
                                I = site.Item(categories.GetString(categories.GetOrdinal("itemNumber")));
                                if(I != null) {
                                    if(!categories.IsDBNull(categories.GetOrdinal("listOrder"))) {
                                        if(I.CategoryOrder == null) {
                                            I.CategoryOrder = new Dictionary<Guid, int>();
                                        }
                                        if(!I.CategoryOrder.ContainsKey(Cat.Id)) {
                                            I.CategoryOrder.Add(Cat.Id, categories.GetInt32(categories.GetOrdinal("listOrder")));
                                        }
                                    };
                                    if(!Cat.Items.Contains(I)) {
                                        Cat.Items.Add(I);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            #endregion
        }
	}
}
