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
		/// Gets category data for built in category editor.
		/// </summary>
		/// <returns>category data across multiple tables</returns>
		public static Dictionary<string, object> GetCategoryData( string categoryId ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			/* pull data for several related tools
			 * siteSection
			 * siteSectionDetail (active)
			 * pageTitles */
			string query = @"/* getCategoryData */
			/* make sure the following items exist then select them */
			if not exists(select 0 from pageTitles with (nolock) where pageTitleId = @categoryId) begin
				insert into pageTitles (pageTitleId, page, category, title, metaDescription, metaKeywords, VerCol)
				values (@categoryId, 0, '', '', '', '', null)
			end
			if not exists(select 0 from siteSections with (nolock) where siteSectionId = @categoryId) begin
				insert into siteSections (siteSectionId, name, description, URL, unique_siteId, VerCol)
				values (@categoryId, '', '', '', '00000000-0000-0000-0000-000000000000', null)
			end
			if not exists(select 0 from siteSectionsDetail with (nolock) where siteSectionId = @categoryId) begin
				insert into siteSectionsDetail (siteSectionDetailId, siteSectionId, data, addDate, active, description, VerCol)
				values (newid(), @categoryId, '', GETDATE(), 1, '', null )
			end
			if not exists(select 0 from menus with (nolock) where menuId = @categoryId) begin
				insert into menus (menuId, menuName, spacer, menuDescription, menuOnClick, listOrder, menutype, parentId, href, enabled,
				onmouseover, onmouseout, addDate, userId, childType, childFilter, maxChildren, usePager, childOrder, script, unique_siteId, VerCol)
				values (@categoryId, (select category from categories with (nolock) where categoryId = @categoryId), 0, '', '', 0, 0, '00000000-0000-0000-0000-000000000000', '', 1, '',
				'', GETDATE(), -1, 0, '', 0, 0, 0, '', '00000000-0000-0000-0000-000000000000', null)
			end
			/* first batch pageTitles */
			select page, rtrim(category), rtrim(title), rtrim(metaDescription), rtrim(metaKeywords), verCol
			from pageTitles with (nolock)
			where pageTitleId = @categoryId
			/* next batch siteSection */
			select rtrim(name), rtrim(description), rtrim(URL), unique_siteId, verCol
			from siteSections with (nolock)
			where siteSectionId = @categoryId
			/* next batch siteSectionDetail */
			select top 1 siteSectionDetailId, data,
			addDate, active, rtrim(description), VerCol
			from siteSectionsDetail with (nolock)
			where siteSectionId = @categoryId order by active desc
			/* next batch categories */
			select rtrim(category), enabled from categories with (nolock)
			where categoryId = @categoryId
			 ";
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(query, cn)) {
                    cmd.Parameters.Add("@categoryId", SqlDbType.UniqueIdentifier).Value = new Guid(categoryId);
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        r.Read();
                        j.Add("page", r.GetInt32(0));
                        j.Add("categoryURL", r.GetString(1));
                        j.Add("title", r.GetString(2));
                        j.Add("metaDescription", r.GetString(3));
                        j.Add("metaKeywords", r.GetString(4));
                        r.NextResult();
                        r.Read();
                        j.Add("sectionName", r.GetString(0));
                        j.Add("sectionDescription", r.GetString(1));
                        j.Add("cannocalURL", r.GetString(2));
                        j.Add("sectionUnique_siteId", r.GetGuid(3));
                        r.NextResult();
                        r.Read();
                        j.Add("siteSectionDetailId", r.GetGuid(0));
                        j.Add("data", r.GetString(1));
                        j.Add("addDate", r.GetDateTime(2));
                        j.Add("active", r.GetBoolean(3));
                        j.Add("category_description", r.GetString(4));
                        r.NextResult();
                        r.Read();
                        j.Add("category", r.GetString(0));
                        j.Add("enabled", r.GetBoolean(1));
                    }
                }
            }
			j.Add( "error", 0 );
			j.Add( "description", "" );
			return j;
		}
		/// <summary>
		/// Saves category data for built in category editor.
		/// </summary>
		/// <returns></returns>
		public static Dictionary<string, object> SaveCategoryData( Dictionary<string, object> args ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			Guid categoryId = new Guid( args[ "categoryId" ].ToString() );
			string query = @"/* saveCategoryData */
				/* category */
				update categories set category = @categoryName, enabled = @enabled where categoryId = @categoryId;
				/* site section */
				update siteSections set name = @sectionName, description = @sectionDescription, 
				URL = @cannocalURL where siteSectionId = @categoryId;
				/* section detail (always a single entry) */
				update siteSectionsDetail set data = @code, active = 1 where siteSectionId = @categoryID;
				/* page titles */
				update pageTitles set title = @title, category = @categoryURL,
				metaDescription = @metaDescription,	metaKeywords = @metaKeywords
				where pageTitleId = @categoryId;
			";
            using(SqlConnection cn = Site.CreateConnection(true, true)){
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(query, cn)) {
				    cmd.Parameters.Add( "@categoryId", SqlDbType.UniqueIdentifier ).Value = new Guid( categoryId.ToString() );
				    cmd.Parameters.Add( "@categoryName", SqlDbType.VarChar ).Value = args[ "name" ].ToString();
				    cmd.Parameters.Add( "@sectionName", SqlDbType.VarChar ).Value = args[ "sectionName" ].ToString();
				    cmd.Parameters.Add( "@title", SqlDbType.VarChar ).Value = args[ "title" ].ToString();
				    cmd.Parameters.Add( "@categoryURL", SqlDbType.VarChar ).Value = args[ "categoryURL" ].ToString();
				    cmd.Parameters.Add( "@cannocalURL", SqlDbType.VarChar ).Value = args[ "cannocalURL" ].ToString();
				    cmd.Parameters.Add( "@metaDescription", SqlDbType.VarChar ).Value = args[ "metaDescription" ].ToString();
				    cmd.Parameters.Add( "@metaKeywords", SqlDbType.VarChar ).Value = args[ "metaKeywords" ].ToString();
				    cmd.Parameters.Add( "@sectionDescription", SqlDbType.VarChar ).Value = args[ "sectionDescription" ].ToString();
				    cmd.Parameters.Add( "@code", SqlDbType.VarChar ).Value = args[ "code" ].ToString();
                    cmd.Parameters.Add( "@enabled", SqlDbType.Bit).Value = args["enabled"].ToString();
				    cmd.ExecuteNonQuery();
			    }
            }
			j.Add( "error", 0 );
			j.Add( "description", "" );
			return j;
		}
	}
}
