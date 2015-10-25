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
using System.Text.RegularExpressions;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Data;
using Microsoft.SqlServer.Server;
namespace Rendition {
	/// <summary>
	/// Collection of strings that describe a herarchial menu structure in xHTML.
	/// An instance of this class is passed to an instance of
	/// Commerce menu's menuHierarchy method to create an HTML menu
	/// that uses the site's database menu system.
	/// </summary>
	public class MenuCollectionCode {
        #region Instance Properties
        /// <summary>
		/// Main container 
		/// ( defaults to: { &lt;div,&gt;&lt;ul&gt;,&lt;/ul&gt;&lt;/div&gt; } )
		/// </summary>
        public string[] Menu { get; set; }
		/// <summary>
		/// Container item ( defaults to: { &lt;li,&gt;,&lt;/li&gt; } )
		/// </summary>
        public string[] MenuItem { get; set; }
		/// <summary>
		/// Link item ( defaults to: { &lt;a,&gt;,&lt;/a&gt; } )
		/// </summary>
        public string[] MenuLink { get; set; }
		/// <summary>
		/// Used in creating menus that create tables.
		/// </summary>
        public string[] MenuRow { get; set; }
		/// <summary>
		/// Class name of the main container.
		/// </summary>
        public string MenuClassName { get; set; }
		/// <summary>
		/// Class name of the container item.
		/// </summary>
        public string MenuItemClassName { get; set; }
		/// <summary>
        /// Menu mouse over event. (e.g.: onmouseover="alert('Test');" )
		/// </summary>
        public string MenuMouseOver { get; set; }
		/// <summary>
        /// Menu mouse out event. (e.g.: onmouseout="alert('Test');" )
		/// </summary>
        public string MenuMouseOut { get; set; }
		/// <summary>
        /// Menu mouse click. (e.g.: onmouseclick="alert('Test');" )
		/// </summary>
        public string MenuClick { get; set; }
		/// <summary>
        /// Menu mouse down. (e.g.: onmousedown="alert('Test');" )
		/// </summary>
        public string MenuMouseDown { get; set; }
		/// <summary>
        /// Menu mouse up. (e.g.: onmouseup="alert('Test');" )
		/// </summary>
        public string MenuMouseUp { get; set; }
		/// <summary>
        /// Menu item mouse over. (e.g.: onmouseover="alert('Test');" )
		/// </summary>
        public string MenuItemMouseOver { get; set; }
		/// <summary>
        /// Menu item mouse out. (e.g.: onmouseout="alert('Test');" )
		/// </summary>
        public string MenuItemMouseOut { get; set; }
		/// <summary>
        /// Menu item mouse click. (e.g.: onmouseclick="alert('Test');" )
		/// </summary>
        public string MenuItemClick { get; set; }
		/// <summary>
        /// Menu item mouse down. (e.g.: onmousedown="alert('Test');" )
		/// </summary>
        public string MenuItemMouseDown { get; set; }
		/// <summary>
		/// Menu item mouse up. (e.g.: onmouseup="alert('Test');" )
		/// </summary>
        public string MenuItemMouseUp { get; set; }
        #endregion
        #region Constructors
        /// <summary>
        /// Initializes a new instance of the <see cref="MenuCollectionCode"/> class.
        /// </summary>
        public MenuCollectionCode() {
            Menu = new string[] { "<div", "><ul>", "</ul></div>" };
            MenuItem = new string[] { "<li", ">", "</li>" };
            MenuLink = new string[] { "<a", ">", "</a>" };
            MenuRow = new string[] { "<tr", ">", "</tr>" };
        }
        #endregion
    }
	public partial class Commerce {
		/// <summary>
		/// This class creates a list of menus drawn from the database
		/// for use in making hierarchal menus.  This class is used by
		/// the site during initalization and cache refresh, not to make menus.
		/// To create menus use the menu class instead.
		/// </summary>
		internal class Menus {
            #region Instance Fields
            /// <summary>
			/// Rawl list of hierarchal menus from the database.
			/// </summary>
			public List<Menu> List = new List<Menu>();
			/// <summary>
			/// Count of the menus.
			/// </summary>
			public int Count = 0;
            #endregion
            #region Instance Methods
            /// <summary>
            /// Gets the menu by name.
            /// </summary>
            /// <param name="name">The name.</param>
            /// <returns>Selected menu or null</returns>
            public Commerce.Menu GetMenuByName(string name) {
                if(name == null) { return null; };
                for(int x = 0; Main.Site.Menus.List.Count > x; x++) {
                    Commerce.Menu m = (Commerce.Menu)Main.Site.Menus.List[x];
                    if(m.Name == name && m.ParentId == Guid.Empty) {
                        return m;
                    }
                }
                return null;
            }
            /// <summary>
            /// Gets the menu by id.
            /// </summary>
            /// <param name="id">The id.</param>
            /// <returns>
            /// Selected menu or null
            /// </returns>
            public Commerce.Menu GetMenuById(Guid id) {
                for(int x = 0; Main.Site.Menus.List.Count > x; x++) {
                    Commerce.Menu m = (Commerce.Menu)Main.Site.Menus.List[x];
                    if(m.Id == id) {
                        return m;
                    }
                }
                return null;
            }
            /// <summary>
            /// Gets id of the menu by its name.
            /// </summary>
            /// <param name="name">The name.</param>
            /// <returns>The selected menu Id</returns>
            public Guid GetIdByName(string name) {
                Menu m = GetMenuByName(name);
                if(m != null) { return m.Id; };
                return Guid.Empty;
            }
            /// <summary>
            /// Adds the specified menu to the cache.
            /// </summary>
            /// <param name="menu">The menu.</param>
            /// <returns></returns>
            private Menu Add(Menu menu) {
                List.Add(menu);
                Count = List.Count;
                return menu;
            }
            /// <summary>
			/// Builds the menu hierarchies.
			/// </summary>
			public void BuildHierarchies() {
				foreach( Commerce.Menu menu in List ) {
					List<Menu> ms = List.FindAll( delegate( Commerce.Menu m1 ) {
						return menu.Id == m1.ParentId;
					} );
					if( ms != null ) {
						menu.Menus.AddRange( ms );
					}
				}
			}
            /// <summary>
            /// Get the menu of the specified menu ordinal.
            /// </summary>
            /// <param name="ordinal">The ordinal.</param>
            /// <returns>Selected menu or null</returns>
            public Menu Menu(int ordinal) {
                return (Commerce.Menu)Main.Site.Menus.List[ordinal];
            }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Menus"/> class.
			/// </summary>
			/// <param name="site">The site.</param>
			public Menus( Site site ) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getMenus", cn)) {
                        using(SqlDataReader menu_list = cmd.ExecuteReader()) {
                            string[] column_names = new string[menu_list.FieldCount];
                            for(int x = 0; menu_list.FieldCount > x; x++) {
                                column_names[x] = menu_list.GetName(x);
                            }
                            while(menu_list.Read()) {
                                Object[] raw = new Object[menu_list.FieldCount];
                                menu_list.GetValues(raw);
                                Menu m = new Menu(
                                    menu_list.GetGuid(0),
                                    menu_list.GetGuid(1),
                                    menu_list.GetValue(2).ToString(),
                                    menu_list.GetValue(3).ToString(),
                                    menu_list.GetBoolean(4),
                                    menu_list.GetInt32(5),
                                    menu_list.GetInt32(6),
                                    menu_list.GetInt32(7),
                                    menu_list.GetInt32(8),
                                    menu_list.GetValue(9).ToString(),
                                    menu_list.GetInt32(10),
                                    menu_list.GetValue(11).ToString()
                                );
                                this.Add(m);
                            }
                            BuildHierarchies();
                        }
                    }
                }
				return;
			}
            #endregion
		}
		/// <summary>
		/// This class creates a single menu for use with the menus class
		/// </summary>
		public class Menu {
            #region Static Methods
            /// <summary>
            /// Gets a menu by looking up its name.
            /// </summary>
            /// <param name="name">The name.</param>
            /// <returns></returns>
            public static Commerce.Menu GetMenuByName(string name) {
                return Main.Site.Menus.GetMenuByName(name);
            }
            /// <summary>
            /// Gets a menu by looking up its id.
            /// </summary>
            /// <param name="id">The id.</param>
            /// <returns></returns>
            public static Commerce.Menu GetMenuById(Guid id) {
                return Main.Site.Menus.GetMenuById(id);
            }
            /// <summary>
            /// Gets id of the menu by its name.
            /// </summary>
            /// <param name="name">The name.</param>
            /// <returns>The selected menu Id</returns>
            public static Guid GetIdByName(string name) {
                return Main.Site.Menus.GetIdByName(name);
            }
            #endregion
            #region Static Properties
            /// <summary>
            /// Gets all menus.
            /// </summary>
            public static List<Menu> All {
                get {
                    return Main.Site.Menus.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// The order the child menus are in.
            /// </summary>
            /// <returns>Ordering method.</returns>
            public int ChildOrder {
                get {
                    return _childOrder;
                }
            }
            /// <summary>
            /// The order number of this menu in relation to its siblings.
            /// </summary>
            /// <returns>This objects order</returns>
            public int Order {
                get {
                    return _order;
                }
            }
            /// <summary>
			/// List of menus that belong to this menu.
			/// </summary>
			public List<Menu> Menus {get; internal set;}
			/// <summary>
			/// The link this menus goes to when you click on it.
			/// </summary>
			public string Href {get; internal set;}
			/// <summary>
			/// When true this menu should show up in the list.
			/// </summary>
            public bool Enabled { get; internal set; }
			private int _order;
			/// <summary>
			/// Type of children.
			/// </summary>
            public int ChildType { get; internal set; }
			private int _childOrder;
			/// <summary>
			/// Type of menu.
			/// </summary>
            public int Type { get; internal set; }
			/// <summary>
			/// Name of the menu.
			/// </summary>
            public string Name { get; internal set; }
			/// <summary>
			/// Only show the children that match this pattern.
			/// </summary>
            public string ChildFilter { get; internal set; }
			/// <summary>
			/// Maximum number of children to show in this menu.
			/// </summary>
            public int MaxChildren { get; internal set; }
			/// <summary>
			/// Expand by default when page name matches this pattern.
			/// </summary>
            public string ExpandOnPageName { get; internal set; }
			/// <summary>
			/// ECMA/DHTML safe unique id.
			/// </summary>
            public string JId { get; internal set; }
			/// <summary>
			/// The unique id of this menu.
			/// </summary>
            public Guid Id { get; internal set; }
			/// <summary>
			/// The unique id of this menu's parent.
			/// </summary>
            public Guid ParentId { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Menu"/> class.
			/// </summary>
			/// <param name="f_id">The f_id.</param>
			/// <param name="f_parentId">The f_parent id.</param>
			/// <param name="f_name">The f_name.</param>
			/// <param name="f_href">The f_href.</param>
			/// <param name="f_enabled">if set to <c>true</c> [f_enabled].</param>
			/// <param name="f_order">The f_order.</param>
			/// <param name="f_childType">Type of the f_child.</param>
			/// <param name="f_childOrder">The f_child order.</param>
			/// <param name="f_type">The f_type.</param>
			/// <param name="f_child_filter">The f_child_filter.</param>
			/// <param name="f_max_children">The f_max_children.</param>
			/// <param name="f_expand_on_pageName">Name of the f_expand_on_page.</param>
			public Menu( Guid f_id, Guid f_parentId, string f_name, string f_href, bool f_enabled, int f_order, int f_childType,
			int f_childOrder, int f_type, string f_child_filter, int f_max_children, string f_expand_on_pageName ) {
				Href = f_href;
				Enabled = f_enabled;
				_order = f_order;
				ChildType = f_childType;
				_childOrder = f_childOrder;
				Type = f_type;
				Name = f_name;
				Id = f_id;
				ParentId = f_parentId;
				ChildFilter = f_child_filter;
				MaxChildren = f_max_children;
				ExpandOnPageName = f_expand_on_pageName;
				JId = "d" + Id.ToString().Replace( "{", "" ).Replace( "}", "" ).Replace( "-", "" );
				Menus = new List<Menu>();
			}
            #endregion
            #region Instance Methods
            /// <summary>
			/// Creates a HTML menu hierarchy by creating a ul/li list.
			/// </summary>
			/// <returns>HTML UL/LI list based on this menu.</returns>
			public string CreateMenuHierarchy() {
                return CreateMenuHierarchy(null, null, "", "");
			}
            /// <summary>
            /// Creates a simple navigation menu using a default MenuCollectionCode.
            /// </summary>
            /// <param name="rewriteFilter">The rewrite filter.</param>
            /// <param name="rewriteReplace">The rewrite replace.</param>
            /// <returns></returns>
            public string CreateNavigationMenu( string rewriteFilter, string rewriteReplace) {
                MenuCollectionCode rootCode = new MenuCollectionCode();
                rootCode.MenuItemMouseOver = " onmouseover=\"try{Rendition.Merchant.openMenu({ source:$('#'+this.id+' ul')[0], target:this, revealSpeed:0, slide:['down'] });}catch(e){};\"";
                rootCode.MenuItemClassName = " class=\"menu\" ";
                MenuCollectionCode childCode = new MenuCollectionCode();
                childCode.MenuItemMouseOver = " onmouseover=\"try{Rendition.Merchant.openMenu({ source:$('#'+this.id+' ul')[0], target:this, revealSpeed:0, slide:['down'] });}catch(e){};\"";
                childCode.MenuClassName = " style=\"visibility:hidden;display:none;\" ";
                return CreateMenuHierarchy(rootCode, childCode, rewriteFilter, rewriteReplace);
            }
            /// <summary>
            /// Creates a simple navigation menu using a default MenuCollectionCode.
            /// </summary>
            /// <returns>HTML String</returns>
            public string CreateNavigationMenu() {
                MenuCollectionCode rootCode = new MenuCollectionCode();
                rootCode.MenuItemMouseOver = " onmouseover=\"try{Rendition.Merchant.openMenu({ source:$('#'+this.id+' ul')[0], target:this, revealSpeed:0, slide:['down'] });}catch(e){};\"";
                rootCode.MenuItemClassName = " class=\"menu\" ";
                MenuCollectionCode childCode = new MenuCollectionCode();
                childCode.MenuItemMouseOver = " onmouseover=\"try{Rendition.Merchant.openMenu({ source:$('#'+this.id+' ul')[0], target:this, revealSpeed:0, slide:['down'] });}catch(e){};\"";
                childCode.MenuClassName = " style=\"visibility:hidden;display:none;\" ";
                return CreateMenuHierarchy(rootCode, childCode);
            }
			/// <summary>
			/// Creates a HTML menu hierarchy by creating list using the MenuCollectionCode specified.
			/// </summary>
			/// <param name="rootCode">The root code.</param>
			/// <param name="childCode">The child code.</param>
			/// <returns>HTML UL/LI list based on this menu.</returns>
            public string CreateMenuHierarchy(MenuCollectionCode rootCode, MenuCollectionCode childCode) {
                return CreateMenuHierarchy(rootCode, childCode, "", "");
			}
			/// <summary>
			/// Creates a HTML menu hierarchy by creating list using the MenuCollectionCode specified.
			/// </summary>
			/// <param name="rootCode">The root code.</param>
			/// <param name="childCode">The child code.</param>
			/// <param name="rewriteFilter">The rewrite filter.</param>
			/// <param name="rewriteReplace">The rewrite replace string.</param>
			/// <returns>HTML UL/LI list based on this menu.</returns>
            public string CreateMenuHierarchy(MenuCollectionCode rootCode, MenuCollectionCode childCode,
			string rewriteFilter, string rewriteReplace ) {
				StringBuilder sb = new StringBuilder();
				if( rootCode == null ) {
					rootCode = new MenuCollectionCode();
                }
				if( childCode == null ) {
					childCode = new MenuCollectionCode();
				}
				string id = Guid.NewGuid().ToBase64DomId();
				sb.Append( rootCode.Menu[ 0 ] );
				sb.Append( " id=\"" + id + "\" " );
				sb.Append( rootCode.MenuClassName );
				sb.Append( rootCode.MenuMouseOver );
				sb.Append( rootCode.MenuMouseOut );
				sb.Append( rootCode.MenuClick );
				sb.Append( rootCode.MenuMouseDown );
				sb.Append( rootCode.MenuMouseUp );
				sb.Append( rootCode.Menu[ 1 ] );
				foreach( Commerce.Menu menu in Menus ) {
					sb.Append( BuildMenu( menu, childCode, rootCode, rewriteFilter, rewriteReplace ) );
				}
				sb.Append( rootCode.Menu[ 2 ] );
				return sb.ToString();
			}
			/// <summary>
            /// Internal method used by CreateMenuHierarchy to create HTML menus.
			/// </summary>
			/// <param name="menu">The menu.</param>
			/// <param name="childCode">The child code.</param>
			/// <param name="rootCode">The root code.</param>
			/// <param name="rewriteFilter">Rewrite Match Pattern.</param>
			/// <param name="rewriteReplace">Rewrite Replace.</param>
			/// <param name="recursive">if set to <c>true</c> child menus will be rendered.</param>
			/// <returns>
			/// built string
			/// </returns>
			private string BuildMenu( Commerce.Menu menu, MenuCollectionCode childCode, MenuCollectionCode rootCode,
				string rewriteFilter, string rewriteReplace, bool recursive = true ) {
				/* empty root menus should return nothing */
				if(menu.Id==Guid.Empty){return "";};
				StringBuilder sb = new StringBuilder();
				MenuCollectionCode s = childCode;
				if( rootCode != null ) {
					s = rootCode;
				}
				string id = Guid.NewGuid().ToBase64DomId();
				sb.Append( s.MenuItem[ 0 ] );
				sb.Append( " id=\"" + id + "\" " );
				sb.Append( s.MenuItemClassName );
				sb.Append( s.MenuItemMouseOver );
				sb.Append( s.MenuItemMouseOut );
				sb.Append( s.MenuItemClick );
				sb.Append( s.MenuItemMouseDown );
				sb.Append( s.MenuItemMouseUp );
				sb.Append( s.MenuItem[ 1 ] );
				sb.Append( s.MenuLink[ 0 ] );
				sb.Append( " href=\"" + menu.Href + "\" " );
				sb.Append( s.MenuLink[ 1 ] );
				sb.Append( menu.Name );
				sb.Append( s.MenuLink[ 2 ] );
				if( menu.Menus.Count > 0 ) {
					id = Guid.NewGuid().ToBase64DomId();
					sb.Append( childCode.Menu[ 0 ] );
					sb.Append( " id=\"" + id + "\" " );
					sb.Append( childCode.MenuClassName );
					sb.Append( childCode.MenuMouseOver );
					sb.Append( childCode.MenuMouseOut );
					sb.Append( childCode.MenuClick );
					sb.Append( childCode.MenuMouseDown );
					sb.Append( childCode.MenuMouseUp );
					sb.Append( childCode.Menu[ 1 ] );
					foreach( Commerce.Menu m in menu.Menus ) {
						sb.Append( BuildMenu( m, childCode, null, rewriteFilter, rewriteReplace ) );
					}
					sb.Append( childCode.Menu[ 2 ] );
				}
				sb.Append( s.MenuItem[ 2 ] );
				if( rewriteFilter.Length > 0 ) {
					return Regex.Replace( sb.ToString(), rewriteFilter, rewriteReplace );
				} else {
					return sb.ToString();
				}
            }
            #endregion
        }
	}
}
