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
using System.Web;
using System.IO;
namespace Rendition {
	public partial class Commerce {
		/// <summary>
		/// An entry in a site section.  Sections are made up of one or more entries.
		/// Only one entry can be 'active' at a time.
		/// </summary>
		public class SiteSectionEntry {
            #region Instance Properties
            /// <summary>
			/// unique id of this entry
			/// </summary>
            public Guid Id { get; internal set; }
			/// <summary>
			/// unique id of the parent of this entry
			/// </summary>
            public Guid ParentId { get; internal set; }
			/// <summary>
			/// Date the entry was added
			/// </summary>
            public DateTime AddDate { get; internal set; }
			/// <summary>
			/// The name of the section
			/// </summary>
            public string Name { get; internal set; }
			/// <summary>
			/// If the entry is active
			/// </summary>
            public bool Active { get; internal set; }
			/// <summary>
			/// Rendered output of the page section entry.
			/// </summary>
			public string Value {
				get {
					if( !this.Source.StartsWith( "<%@" ) ) {
                        return this.Source;
					};
					string errorMsg = "An error occured while trying to render site section file '{0}':{1}";
					try {
						/* create the file to be rendered */
						string tempPath = Main.PhysicalApplicationPath +
						Main.TempDirectory.Replace( "~", "" ).Replace( "/", "\\" ) + "\\";
						string target = Id.ToFileName() + ".aspx";
						if( !System.IO.File.Exists( target ) ) {
							if( !Directory.Exists( tempPath ) ) {
								Directory.CreateDirectory( tempPath );
							}
							/* write the file just in time */
							using( StreamWriter tf = File.CreateText( tempPath + target ) ) {
								tf.Write( this.Source );
							}
						}
						/* render the file */
						StringWriter sw = new StringWriter();
						try {
							HttpContext.Current.Server.Execute( Main.TempDirectory + "/" + target, sw, true );
						} catch( Exception ex ) {
							if( ex.InnerException != null ) {
								string err = string.Format( errorMsg,
								Description, ex.InnerException.Message );
								String.Format( errorMsg, Description, err ).Debug( 0 );
								sw.Write( err.h() );
							} else {
								string.Format( errorMsg, Description, ex.Message ).Debug( 0 );
							}
						}
						return sw.ToString();
					} catch( Exception ex ) {
						string.Format( errorMsg, Description, ex.Message ).Debug( 0 );
						return "";
					}
				}
			}
			/// <summary>
			/// Source of the page section entry
			/// </summary>
            public string Source { get; internal set; }
			/// <summary>
			/// Descripton of this entry
			/// </summary>
            public string Description { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="SiteSectionEntry"/> class.
            /// </summary>
            /// <param name="_id">The _id.</param>
            /// <param name="_parentId">The parent id.</param>
            /// <param name="_source">The source code.</param>
            /// <param name="_addDate">The _add date.</param>
            /// <param name="_active">if set to <c>true</c> [_active].</param>
            /// <param name="_name">The _name.</param>
            /// <param name="_description">The description.</param>
			public SiteSectionEntry( Guid _id, Guid _parentId, string _source,
			 DateTime _addDate, bool _active, string _name ,string _description ) {
				Id = _id;
				AddDate = _addDate;
				Source = _source;
				Active = _active;
				ParentId = _parentId;
				Description = _description;
				Name = _name;
            }
            #endregion
        }
		/// <summary>
		/// A section is a container of section entries.  One one entry can be the 'active'
		/// entry at a time.  Entries have dates to help tell them apart.
		/// </summary>
		public class SiteSection {
            #region Instance Properties
            /// <summary>
            /// Gets the value of the active entry for this section.
            /// </summary>
            /// <value>The value.</value>
            public string Value {
                get {
                    SiteSectionEntry val = null;
                    bool useDefault = false;
                    if(HttpContext.Current == null) {
                        useDefault = true;
                    } else {
                        string keyDetail = "___siteSectionDetailId___";
                        string key = "___siteSectionId___";
                        HttpContext c = HttpContext.Current;
                        if(c.Request[key] != null && c.Request[keyDetail] != null) {
                            Guid keyVal = new Guid(c.Request[key]);
                            Guid keyDetailVal = new Guid(c.Request[keyDetail]);
                            if(keyVal == Id) {
                                val = Entries.Find(delegate(SiteSectionEntry se) {
                                    return se.Id == keyDetailVal;
                                });
                            } else {
                                useDefault = true;
                            }
                        } else {
                            useDefault = true;
                        }
                    }
                    if(useDefault) {
                        val = Entries.Find(delegate(SiteSectionEntry se) {
                            return se.Active == true;
                        });
                    }
                    if(val != null) {
                        return val.Value;
                    }
                    return "";
                }
            }
            /// <summary>
            /// This section is associated with a category.
            /// </summary>
            public bool isCategory { get; internal set; }
			/// <summary>
			/// entries for this section.
			/// </summary>
            public List<SiteSectionEntry> Entries { get; internal set; }
			/// <summary>
			/// Unique id of the section
			/// </summary>
            public Guid Id { get; internal set; }
			/// <summary>
			/// Description of this section
			/// </summary>
            public string Description { get; internal set; }
			/// <summary>
			/// Name of this section
			/// </summary>
            public string Name { get; internal set; }
			/// <summary>
			/// URL of this section
			/// </summary>
            public string Url { get; internal set; }
            #endregion
            #region Instance Methods
            /// <summary>
            /// Gets the section by name.
            /// </summary>
            /// <param name="sectionName">Name of the section.</param>
            /// <returns></returns>
            public static SiteSection GetSectionByName(string sectionName) {
                return Main.Site.SiteSections.List.Find(delegate(SiteSection sec) {
                    return sec.Name == sectionName;
                });
            }
            /// <summary>
            /// Gets the section by id.
            /// </summary>
            /// <param name="id">The id.</param>
            /// <returns></returns>
            public static SiteSection GetSectionById(Guid id) {
                return Main.Site.SiteSections.List.Find(delegate(SiteSection sec) {
                    return sec.Id == id;
                });
            }
            /// <summary>
            /// Gets the entry by id.
            /// </summary>
            /// <param name="id">The id.</param>
            /// <returns></returns>
            public static SiteSectionEntry GetEntryById(Guid id) {
                return Main.Site.SiteSections.Entries.Find(delegate(SiteSectionEntry se) {
                    return se.Id == id;
                });
            }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="SiteSection"/> class.
			/// </summary>
			/// <param name="_id">The _id.</param>
			/// <param name="_name">The _name.</param>
			/// <param name="_description">The _description.</param>
			/// <param name="_URL">The _ URL.</param>
			public SiteSection( Guid _id, string _name, string _description, string _URL ) {
                Entries = new List<SiteSectionEntry>();
				Id = _id;
				Description = _description;
				Url = _URL;
				Name = _name;
            }
            #endregion
        }
		/// <summary>
		/// A cacheable group of siteSections filtered for this site.
		/// </summary>
		internal class SiteSections {
            #region Instance Fields
            /// <summary>
			/// list of sections in this group
			/// </summary>
			public List<SiteSection> List = new List<SiteSection>();
			/// <summary>
			/// list of entries in this site group
			/// </summary>
			public List<SiteSectionEntry> Entries = new List<SiteSectionEntry>();
            #endregion
            #region Instance Methods
            /// <summary>
			/// Gets the section by name.
			/// </summary>
			/// <param name="sectionName">Name of the section.</param>
			/// <returns></returns>
			public SiteSection GetSectionByName( string sectionName ) {
				return List.Find( delegate( SiteSection sec ) {
					return sec.Name == sectionName;
				} );
			}
			/// <summary>
			/// Gets the section by id.
			/// </summary>
			/// <param name="id">The id.</param>
			/// <returns></returns>
			public SiteSection GetSectionById( Guid id ) {
				return List.Find( delegate( SiteSection sec ) {
					return sec.Id == id;
				} );
			}
			/// <summary>
			/// Gets the entry by id.
			/// </summary>
			/// <param name="id">The id.</param>
			/// <returns></returns>
			public SiteSectionEntry GetEntryById( Guid id ) {
				return Entries.Find( delegate( SiteSectionEntry se ) {
					return se.Id == id;
				} );
			}
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="SiteSections"/> class.
			/// </summary>
			/// <param name="site">The site.</param>
			public SiteSections( Site site ) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand(@"select s.siteSectionId, siteSectionDetailId,
				name, s.description, URL, data, addDate, active, unique_siteId, s.name, sd.description
				from siteSections s with (nolock)
				inner join siteSectionsDetail sd with (nolock) on s.siteSectionId = sd.siteSectionId
				where unique_siteId = @siteId order by s.siteSectionId, addDate", cn)) {
                        ;
                        cmd.Parameters.Add("@siteId", SqlDbType.UniqueIdentifier).Value = new Guid(Site.Id.ToString());
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            if(d.HasRows) {
                                Guid currentId = Guid.Empty;
                                SiteSection section = null;
                                while(d.Read()) {
                                    if(currentId != d.GetGuid(0)) {
                                        currentId = d.GetGuid(0);
                                        section = new SiteSection(
                                            d.GetGuid(0),
                                            d.GetString(2),
                                            d.GetString(3),
                                            d.GetString(4)
                                        );
                                        List.Add(section);
                                        /* if this isn't a category add it to the list of URLs to rewrite */
                                        section.isCategory = Main.Site.Categories.List.Exists(delegate(Commerce.Category cat) {
                                            return cat.Id == section.Id;
                                        });
                                    }
                                    SiteSectionEntry e = new SiteSectionEntry(
                                        d.GetGuid(1),
                                        d.GetGuid(0),
                                        d.GetString(5),
                                        d.GetDateTime(6),
                                        d.GetBoolean(7),
                                        d.GetString(9),
                                        d.GetString(10)
                                    );
                                    if(section != null) {
                                        section.Entries.Add(e);
                                    }
                                    Entries.Add(e);
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
