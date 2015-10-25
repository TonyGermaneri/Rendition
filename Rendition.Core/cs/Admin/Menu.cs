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
	public partial class Admin {
        /// <summary>
        /// Copies the menu descendants.  Used by pasteMenu.
        /// </summary>
        /// <param name="targetMenuId">The target menu id.</param>
        /// <param name="sourceMenuId">The source menu id.</param>
        /// <param name="depth">The amout of recursion.</param>
		private static void CopyMenuDescendants( Guid targetMenuId, Guid sourceMenuId, ref int depth ) {
			/* copy all descendants to this new parentId */
			string sqlCommand = @"select menuId from menus with (nolock) where parentId = @targetMenuId";
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(sqlCommand, cn)) {
                    cmd.Parameters.Add("@targetMenuId", SqlDbType.UniqueIdentifier).Value = new Guid(sourceMenuId.ToString());
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        while(r.Read()) {
                            /* copy this node */
                            Guid newMenuId = Guid.NewGuid();
                            Guid innerMenuId = r.GetGuid(0);
                            string innerSqlCommand = @"insert into menus 
						select @newMenuId, menuName, spacer, menuDescription, menuOnClick, listOrder, 
						menutype, @targetMenuId as parentId, href, enabled, onmouseover, onmouseout, addDate, userId, 
						childType, childFilter, maxChildren, usePager, childOrder, script, 
						unique_siteId, null as VerCol from menus where menuId = @thisMenuId";
                            using(SqlCommand innerCmd = new SqlCommand(innerSqlCommand, cn)) {
                                innerCmd.Parameters.Add("@thisMenuId", SqlDbType.UniqueIdentifier).Value = new Guid(innerMenuId.ToString());
                                innerCmd.Parameters.Add("@newMenuId", SqlDbType.UniqueIdentifier).Value = new Guid(newMenuId.ToString());
                                innerCmd.Parameters.Add("@targetMenuId", SqlDbType.UniqueIdentifier).Value = new Guid(targetMenuId.ToString());
                                innerCmd.ExecuteNonQuery();
                            }
                            /* this must be self refrencing in a bad way */
                            if(depth > 500) {
                                Exception ex = new Exception("Too much recursion.");
                                throw ex;
                            }
                            depth++;
                            CopyMenuDescendants(newMenuId, innerMenuId, ref depth);
                        }
                    }
                }
            }
		}
		/// <summary>
		/// Copies a menu to a new menu and optionally includes the menu's children.
		/// </summary>
		/// <param name="menuId">The menu id.</param>
		/// <param name="parentMenuId">The parent menu id.</param>
		/// <param name="includeChildMenus">if set to <c>true</c> [include child menus].</param>
		/// <returns></returns>
		public static Dictionary<string, object> PasteMenu( string menuId, string parentMenuId, bool includeChildMenus ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			/* create a new parent */
			Guid sourceMenuId = new Guid( menuId );
			Guid targetParentMenuId = new Guid( parentMenuId );
			Guid newMenuId = Guid.NewGuid();
			string sqlCommand = @"insert into menus 
			select @newMenuId, menuName, spacer, menuDescription, menuOnClick, listOrder, 
			menutype, @targetMenuId as parentId, href, enabled, onmouseover, onmouseout, addDate, userId, 
			childType, childFilter, maxChildren, usePager, childOrder, script, 
			unique_siteId, null as VerCol from menus where menuId = @sourceMenuId";
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(sqlCommand, cn)) {
                    cmd.Parameters.Add("@newMenuId", SqlDbType.UniqueIdentifier).Value = new Guid(newMenuId.ToString());
                    cmd.Parameters.Add("@sourceMenuId", SqlDbType.UniqueIdentifier).Value = new Guid(sourceMenuId.ToString());
                    cmd.Parameters.Add("@targetMenuId", SqlDbType.UniqueIdentifier).Value = new Guid(targetParentMenuId.ToString());
                    cmd.ExecuteNonQuery();
                }
            }
			if( includeChildMenus ) {
				int depth = 0;
				CopyMenuDescendants( newMenuId, sourceMenuId, ref depth );
			}
			j.Add( "menuId", newMenuId );
			j.Add( "error", 0 );
			j.Add( "description", "" );
			return j;
		}
	}
}
