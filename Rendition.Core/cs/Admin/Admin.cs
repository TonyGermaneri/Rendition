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
/* -------------------------------------------------------------------------
* Admin.cs
* 
* Methods for administrators.  People who don't want to destroy everything.
* these are the sorts of people whom we would trust with one the keys on
* one of thoes "you need two keys" ICBM launch station.
*
* Heren lie most methods for 'working' with the order system.
* With proper access administrators can access any of the public static methods in
* this class using the AJAX URL built into the HTTPModule class of this application.
* Most of the methods in this class are wrappers for methods in 
* Commerce.cs (class Commerce), although there are a good deal of imaging
* tools and order/content automation functions in this class/file.
*
* to gain access to administrative functions in the Commerce class users
* must use this file.  The Commerce class is not directly exposed to web users.
* the Commerce class however is still accessable through the use of
* plugins and event handlers.
* ------------------------------------------------------------------------- */
using System;
using System.Data;
using System.Web;
using System.Collections;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Reflection;
using System.IO;
using System.Diagnostics;
using Newtonsoft.Json;
using System.Linq;
namespace Rendition {
	/// <summary>
	/// This contains all the private Admin interaction with the site
	/// </summary>
	public partial class Admin {
        /// <summary>
        /// Gets the application path.
        /// </summary>
        /// <returns></returns>
        public static string GetApplicationPath() {
            return Main.PhysicalApplicationPath;
        }
        /// <summary>
        /// Adds a script to the end of the main.js file for the public web site.
        /// </summary>
        /// <param name="script_to_add">The script_to_add.</param>
        public static void AddMainScript(string script_to_add) {
            Main.MainScripts.Add(script_to_add);
        }
        /// <summary>
        /// Adds a script to the end of the Rendition.js file.
        /// </summary>
        /// <param name="script_to_add">The script_to_add.</param>
        public static void AddUIScript(string script_to_add) {
            Main.UIScripts.Add(script_to_add);
        }
		/// <summary>
		/// Stub text value
		/// 1 - unus, una, unum
		/// 2 - duo, duae, duo
		/// 3 - tres, tres, tria
		/// 4 - quattuor
		/// 5 - quinque
		/// 6 - sex
		/// 7 - septem
		/// 8 - octo
		/// 9 - novem
		/// 10 - decem
		/// 11 - undecim
		/// 12 - duodecim
		/// 13 - tredecim
		/// 14 - quattuordecim
		/// 15 - quindecim
		/// 16 - sedecim
		/// 17 - septendecim
		/// 18 - duodeviginti
		/// 19 - undeviginti
		/// 20 - viginti
		/// 21 - viginti unus
		/// 30 - triginta
		/// 40 - quadraginta
		/// 50 - quinquaginta
		/// 60 - sexaginta
		/// 70 - septuaginta
		/// 80 - octoginta
		/// 90 - nonaginta
		/// 100 - centum
		/// 200 - ducenti, ducentae, ducenta
		/// 300 - trecenti, trecentae, trecenta
		/// 400 - quadrigenti, quadrigentae, quadrigenta(*)
		/// 500 - quingenti, quingentae, quingenta
		/// 600 - sescenti, sescentae, sescenta
		/// 700 - septingenti, septingentae, septingenta
		/// 800 - octingenti, octingentae, octingenta
		/// 900 - nongenti, nongentae, nongenta
		/// 1000 - mille
		/// 2000 - duo milia
		/// </summary>
		public const string LoremIpsum=@"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut 
		laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis
		nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat,
		vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril 
		delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming 
		id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. 
		Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur 
		mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum 
		formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes 
		in futurum.";
        /// <summary>
        /// Revokes the plugin.
        /// </summary>
        /// <param name="pluginId">The plugin id.</param>
        /// <param name="unrevoke">if set to <c>true</c> [unrevoke].</param>
        /// <returns></returns>
        public static Dictionary<string, object> revokePlugin(string pluginId, bool unrevoke) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            Guid id = Guid.Empty;
            Guid.TryParse(pluginId, out id);
            Main.revokePlugin(id, unrevoke);
            j.Add("error", 0);
            j.Add("description", "");
            return j;
        }
        /// <summary>
        /// Calculates the shipping rate.
        /// </summary>
        /// <param name="args">The args.</param>
        /// <returns></returns>
		public static Dictionary<string,object>	CalculateShippingRate(Dictionary<string,object> args){
			Dictionary<string,object> j = new Dictionary<string,object>();
			 /* parse the string into numbers */
			int zip = 0;
			bool commercial = false;
			decimal weight = 0;
			if( !int.TryParse( args[ "zip" ].ToString(), out zip ) ) {
				j.Add( "error", -1 );
				j.Add( "description", "Zip code is not in the required format.  Should be #####.  Not #####-####." );
				return j;
			}
			if( !decimal.TryParse( args[ "weight" ].ToString(), out weight ) ) {
				j.Add( "error", -2 );
				j.Add( "description", "Weight must only contain numbers.  E.g.: 3 or 3.3 or 3.357.  Weight is always rounded up to the next whole number." );
				return j;
			}
			/* round weight up */
			weight = Math.Round(weight,0,MidpointRounding.AwayFromZero);
			if( !bool.TryParse( args[ "commercial" ].ToString(), out commercial ) ) {
				commercial = false;
			}
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(@"
				    select rateId, rateWithSurcharge, name, commercial, 
				    baseRate, fuelSurcharge, ruralAreaSurcharge, addCharge, rateWithSurcharge+addCharge as total, shipzone  from (
					    select 
					    rateId,[dbo].[getShippingSurcharge](rateid, 90814, shippingCost,
					    ZoneServiceClass, airFuelSurchgPct, groundFuelSurchgPct, @wholesale, cmrAreaSurch, resAreaSurchg) as rateWithSurcharge,
					    name,@wholesale commercial,shippingCost as baseRate, 
					    case when ZoneServiceClass > 1 then shippingCost*airFuelSurchgPct else shippingCost*groundFuelSurchgPct end as fuelSurcharge,
					    case when exists(select 1 from areaSurcharge where carrier = ZoneCarrierID and deliveryArea = @zip) then
						    case when @wholesale = 1then
							    cmrAreaSurch
						    else
							    resAreaSurchg
						    end
					    else
						    0
					    end as ruralAreaSurcharge, addCharge, shipzone
					    from shipping_services
					    where (@zip between fromzip and tozip) and weight = @weight and rateId = @rateId
				    ) f", cn)) {
                    cmd.Parameters.Add("@zip", SqlDbType.Int).Value = zip;
                    cmd.Parameters.Add("@weight", SqlDbType.Int).Value = Convert.ToInt32(weight);
                    cmd.Parameters.Add("@rateId", SqlDbType.Int).Value = Convert.ToInt32(args["rateId"].ToString());
                    cmd.Parameters.Add("@wholesale", SqlDbType.Bit).Value = commercial;
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        if(d.HasRows) {
                            d.Read();
                            j.Add("rateId", d.GetInt32(0));
                            j.Add("rateWithSurcharge", d.GetDecimal(1));
                            j.Add("name", d.GetString(2));
                            j.Add("commercial", d.GetBoolean(3));
                            j.Add("baseRate", d.GetDecimal(4));
                            j.Add("fuelSurcharge", d.GetDouble(5));
                            j.Add("ruralAreaSurcharge", d.GetDecimal(6));
                            j.Add("addCharge", d.GetDecimal(7));
                            decimal total = d.GetDecimal(8);
                            j.Add("total", total);
                            j.Add("roundedTotal", Math.Round(total, 2, MidpointRounding.AwayFromZero));
                            j.Add("zone", d.GetInt32(9));
                        } else {
                            j.Add("rateId", -1);
                            j.Add("rateWithSurcharge", 0);
                            j.Add("name", "");
                            j.Add("commercial", false);
                            j.Add("baseRate", 0);
                            j.Add("fuelSurcharge", 0);
                            j.Add("ruralAreaSurcharge", 0);
                            j.Add("addCharge", 0);
                            j.Add("total", 0);
                            j.Add("roundedTotal", 0);
                            j.Add("zone", 0);
                        }
                    }
                }
            }
			j.Add( "error", 0 );
			j.Add( "description", "" );
			return j;
		}
		/// <summary>
		/// Clears the site section cache for an id.
		/// </summary>
		/// <param name="siteSectionDetailId">The site section detail id.</param>
		/// <returns></returns>
		public static Dictionary<string,object> ClearSiteSectionCacheForId(string siteSectionDetailId){
			Dictionary<string,object> j=new Dictionary<string,object>();
			Guid id = new Guid(siteSectionDetailId);
			File.Delete(Main.PhysicalApplicationPath+Main.TempDirectory.Replace("~","").Replace("/","\\")
			+"\\"+id.ToFileName()+".aspx");
			Commerce.SiteSectionEntry entry = Main.Site.SiteSections.GetEntryById(id);
			/* update the in memory cache */
            using(SqlConnection cn = Site.CreateConnection(true, true)){
                cn.Open();
			    using(SqlCommand cmd=new SqlCommand(@"select top 1 data from
			    siteSectionsDetail with (nolock) where siteSectionDetailId = @siteSectionDetailId",cn)){
				    cmd.Parameters.Add("@siteSectionDetailId",SqlDbType.UniqueIdentifier).Value = new Guid(id.ToString());
				    using(SqlDataReader d = cmd.ExecuteReader()){
					    if(d.HasRows){
						    d.Read();
						    entry.Source = d.GetString(0);
					    }
				    }
			    }
            }
			j.Add("error",0);
			j.Add("description","");
			return j;
		}
		/// <summary>
		/// Generates a SHA1 hash value + salt from input string.
		/// </summary>
		/// <param name="clearText">The cleartext value being hashed.</param>
		/// <returns>{error:0,desc:"error description",digest:"hash value"}</returns>
		public static Dictionary<string,object> GetHash(string clearText) {
			Dictionary<string,object> j = new Dictionary<string,object>();
			j.Add("error",0);
			j.Add("description","");
			j.Add("digest",Site.GetHash(clearText));
			return j;
		}
		/// <summary>
		/// Posts the journal entries.
		/// </summary>
		/// <param name="journalEntries">The journal entries.
		/// Must be a JSON object in this format:
		///		{
		/// 		userId: int userId,
		/// 		debit: float debit,
		/// 		credit: float credit,
		/// 		date: string date (MM/DD/YYYY),
		/// 		comments: string comments
		/// 	}
		/// </param>
		/// <returns>{error:0,desc:"error description"}</returns>
		public static Dictionary<string,object> PostJournalEntries(List<object> journalEntries) {
			return Commerce.PostJournalEntries(journalEntries);
		}
		/// <summary>
		/// Posts payments to general ledger.
		/// </summary>
		/// <param name="ids">The payment ids.</param>
		/// <param name="postingDate">The posting date.</param>
		/// <param name="postingNotes">The posting notes.</param>
		/// <param name="preview">if set to <c>true</c> [preview].</param>
		/// <returns>{error:0,desc:"error description",preview:false,
		/// generalLedgerEntries:{
		///		drDate,
		///		drDetails,
		///		drReference,
		///		drAmount,
		///		crDate,
		///		crDetails,
		///		crReference,
		///		crAmount
		/// },
		/// rawGL:{
		///		generalLedgerId,
		///		creditRecord,
		///		debitRecord,
		///		amount,
		///		userId,
		///		termId,
		///		addDate,
		///		reference,
		///		orderId,
		///		generalLedgerId
		/// },
		/// rawGLDetail:{
		///		generalLedgerDetailId,
		///		generalLedgerId,
		///		refId,
		///		refType
		/// }
		/// }.</returns>
		public static Dictionary<string,object> PostPaymentsToGeneralLedger(List<object> ids,string postingDate,string postingNotes,bool preview) {
			return Commerce.PostPaymentsToGeneralLedger(ids,postingDate,postingNotes,preview);
		}
		/// <summary>
		/// Posts the orders to general ledger. Wrapper for Commerce.postOrdersToGeneralLedger.
		/// </summary>
		/// <param name="ids">The order ids.</param>
		/// <param name="postingDate">The posting date.</param>
		/// <param name="postingNotes">The posting notes.</param>
		/// <param name="preview">if set to <c>true</c> [preview].</param>
		/// <returns>{error:0,desc:"error description",preview:false,
		/// generalLedgerEntries:{
		///		drDate,
		///		drDetails,
		///		drReference,
		///		drAmount,
		///		crDate,
		///		crDetails,
		///		crReference,
		///		crAmount
		/// },
		/// rawGL:{
		///		generalLedgerId,
		///		creditRecord,
		///		debitRecord,
		///		amount,
		///		userId,
		///		termId,
		///		addDate,
		///		reference,
		///		orderId,
		///		generalLedgerId
		/// },
		/// rawGLDetail:{
		///		generalLedgerDetailId,
		///		generalLedgerId,
		///		refId,
		///		refType
		/// }
		/// }.</returns>
		public static Dictionary<string,object> PostOrdersToGeneralLedger(List<object> ids,string postingDate,string postingNotes, bool preview){
			return Commerce.PostOrdersToGeneralLedger(ids,postingDate,postingNotes,preview);
		}
		/// <summary>
		/// Previews the regex pattern.
		/// </summary>
		/// <param name="regexPattern">The regex pattern.</param>
		/// <param name="regexReplacePattern">The regex replace pattern.</param>
		/// <param name="stringToReplace">The string to replace.</param>
		/// <returns></returns>
		public static Dictionary<string,object> PreviewRegexPattern(string regexPattern, string regexReplacePattern, string stringToReplace){
			Dictionary<string,object> j = new Dictionary<string,object>();
			j.Add("stringToReplace",stringToReplace);
			j.Add("regexPattern",regexPattern);
			j.Add("regexReplacePattern",regexReplacePattern);
			try{
				
				Regex r = new Regex(regexPattern,RegexOptions.Compiled|RegexOptions.ECMAScript);
				string result=r.Replace(stringToReplace,regexReplacePattern);
				if(r.IsMatch(Main.Responder)){
					Exception ex = new Exception(@"Warning! Pattern will override the 
					AJAX Responder page and break the site!");
					throw ex;
				}
				if(r.IsMatch(Main.AdminResponder)){
					Exception ex = new Exception(@"Warning! Pattern will override the 
					AJAX Admin Responder page and break the site!");
					throw ex;
				}
				if(r.IsMatch(Main.AdminDirectory)){
					Exception ex = new Exception(@"Warning! Pattern will override the 
					AJAX Admin Directory page and break the site!");
					throw ex;
				}
				j.Add("match",r.IsMatch(stringToReplace));
				j.Add("result",result);
			}catch(Exception e){
				j.Add("match",false);
				j.Add("result",e.Message);
			}
			return j;
		}
		/// <summary>
		/// Previews the rewrite directive.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> PreviewRewriteDirective(Dictionary<string,object> args) {
			Dictionary<string,object> j = new Dictionary<string,object>();
			Dictionary<string,object> result = new Dictionary<string,object>();
			string _urlMatchPattern = (string)args["urlMatchPattern"];
			string _urlToRedirectTo = ( string )args[ "urlToRedirectTo" ];
			string _errorMatch = ( string )args[ "errorMatch" ];
			string _contentType = ( string )args[ "contentType" ];
			string _type = ( string )args[ "type" ];
			string _listOrder = ( string )args[ "order" ];
			string _rawURL = ( string )args[ "url" ];
            string[] rslt = RewriteUrlString(_rawURL);
			result.Add("status", rslt[0]);
            result.Add("target", rslt[2]);
            result.Add("type", rslt[3]);
            result.Add("contentType", rslt[1]);
            result.Add("id", rslt[4]);
			j.Add("result", result);
			j.Add("error", 0);
			j.Add("description", "");
			return j;
		}
        /// <summary>
        /// Rewrites the URL string.
        /// This is a copy of renition.main.rewriteURL, rewritten to ouput a string[] CODE,CONTENTTYPE,URL
        /// </summary>
        /// <param name="url">The URL.</param>
        /// <returns></returns>
        private static string[] RewriteUrlString( string url ) {
            string[] result = new string[] { "200", "TEXT/HTML", url, "None", Guid.Empty.ToString() };
            string rawURL = "~" + url;
			foreach( Commerce.Redirector rdr in Main.Site.Redirectors.List ) {
				int statusCode = 0;
				int.TryParse( rdr.ErrorMatch, out statusCode );
				if( rdr.RedirectorType == RedirectorTypes.Rewriter && /* this is a rewriter*/
				rdr.Enabled/* that's enabled */) {
					if( rdr.RegEx.IsMatch( rawURL ) ) {
						string target = rdr.RegEx.Replace( rawURL, rdr.UrlToRedirectTo );
						/* check now if this file exists
						 * if not change the response code */
						/* format the target, extracting the URL */
						var rp = "http://127.0.0.1/"; /* root path */
						Uri uri = null;
						if( target.StartsWith( "~/" ) ) {
							uri = new Uri( rp + target.Substring( 2 ) );
						} else if( !target.StartsWith( "http://" ) ) {
							uri = new Uri( rp + target );
						} else {
							uri = new Uri( target );
						}
						string physicalPath = HttpContext.Current.Server.MapPath( uri.LocalPath );
						if( !File.Exists( physicalPath ) ) {
							/* the target file does not exist */
                            foreach(Commerce.Redirector er_rdr in Main.Site.Redirectors.List) {
                                if(er_rdr.RedirectorType == RedirectorTypes.Error
                                && er_rdr.Enabled && er_rdr.ErrorMatch == "404") {
                                    /* try and execute any supplied error page, but don't expect it to work */
                                    result[0] = "404";
                                    result[1] = "TEXT/HTML";
                                    result[2] = er_rdr.RegEx.Replace(rawURL, rdr.UrlToRedirectTo);
                                    result[3] = rdr.RedirectorType.ToString();
                                    result[4] = rdr.Id.ToString();
                                    return result;
                                }
                            }
						} else {
							/* the target file exists */
							int.TryParse( rdr.ErrorMatch, out statusCode );
                            if(statusCode != 200) {
                                result[0] = "200";
                            } else {
                                result[0] = statusCode.ToString();
                            }
							result[1] = rdr.ContentType;
                            result[2] = target;
                            result[3] = rdr.RedirectorType.ToString();
                            result[4] = rdr.Id.ToString();
                            return result;
						}
					}
				}
			}
            return result;
        }
		/// <summary>
		/// Starts the telnet logging server.
		/// </summary>
		public static void StartTelnetServer() {
			TelnetServer.Start("127.0.0.1");
		}
		/// <summary>
		/// Exports a XML table.
		/// </summary>
		/// <param name="SQLQuery">The SQL query.</param>
		public static void ExportXmlTable(string SQLQuery){
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(SQLQuery, cn)) {
                    HttpContext.Current.Response.ContentType = "text/xml";
                    SqlDataReader d = cmd.ExecuteReader();
                    d.Read();
                    HttpContext.Current.Response.Write(d.GetString(0));
                    d.Close();
                }
            }
			HttpContext.Current.Response.Flush();
			HttpContext.Current.ApplicationInstance.CompleteRequest();
		}
        /// <summary>
        /// Adds a flag.
        /// </summary>
        /// <param name="flagType">Type of the flag.</param>
        /// <param name="objectType">Type of the object order, line order shipment.</param>
        /// <param name="objectId">The object id.</param>
        /// <param name="comments">The comments.</param>
        /// <returns></returns>
		public static Dictionary<string,object> AddFlag(string flagType, string objectType, string objectId, string comments){
			return Commerce.AddFlag(flagType,objectType,objectId,comments);
		}
		/// <summary>
		/// Updates the Blog order.
		/// </summary>
		/// <param name="updateList">The update list.</param>
		/// <returns></returns>
		public static Dictionary<string,object> UpdateBlogOrder(string updateList) {
			("FUNCTION /w ADHOC updateBlogOrder").Debug(10);
			List<Dictionary<string,object>> list=JsonConvert.DeserializeObject<List<Dictionary<string,object>>>(updateList);
			Dictionary<string,object> j=new Dictionary<string,object>();
			StringBuilder s=new StringBuilder();
			for(var x=0;list.Count>x;x++) {
				s.Append(@"update Blogs
					 set listOrder = '"+list[x]["order"].ToString()+@"' 
					 where blogId = '"+list[x]["id"].ToString()+"';");
			}
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(s.ToString(), cn)) {
                    try {
                        cmd.ExecuteNonQuery();
                        j.Add("error", 0);
                        j.Add("description", "");
                    } catch(Exception e) {
                        j.Add("error", -1);
                        j.Add("description", e.Message);
                    }
                }
            }
			return j;
		}
		/// <summary>
		/// Updates the gallery order.
		/// </summary>
		/// <param name="updateList">The update list.</param>
		/// <returns></returns>
		public static Dictionary<string,object> UpdateGalleryOrder(string updateList) {
			("FUNCTION /w ADHOC updateMenuOrder").Debug(10);
			List<Dictionary<string,object>> list=JsonConvert.DeserializeObject<List<Dictionary<string,object>>>(updateList);
			Dictionary<string,object> j=new Dictionary<string,object>();
			StringBuilder s=new StringBuilder();
			for(var x=0;list.Count>x;x++) {
				s.Append(@"update imageRotatorDetail
					 set rotator_order = '"+list[x]["order"].ToString()+@"' 
					 where imageRotatorDetailId = '"+list[x]["id"].ToString()+"';");
			}
            using( SqlConnection cn = Site.CreateConnection(true, true) ){
                cn.Open();
			    using(SqlCommand cmd=new SqlCommand(s.ToString(),cn)){
			        try {
				        cmd.ExecuteNonQuery();
				        j.Add("error",0);
				        j.Add("description","");
			        } catch(Exception e) {
				        j.Add("error",-1);
				        j.Add("description",e.Message);
			        }
                }
            }
			return j;
		}
		/// <summary>
		/// Updates the menu order.
		/// </summary>
		/// <param name="updateList">The update list.</param>
		/// <returns></returns>
		public static Dictionary<string,object> UpdateMenuOrder(string updateList) {
			("FUNCTION /w ADHOC updateMenuOrder").Debug(10);
			List<Dictionary<string,object>> list=JsonConvert.DeserializeObject<List<Dictionary<string,object>>>(updateList);
			Dictionary<string,object> j=new Dictionary<string,object>();
			StringBuilder s=new StringBuilder();
			for(var x=0;list.Count>x;x++) {
				s.Append(@"update menus
					 set listOrder = '"+list[x]["order"].ToString()+@"' 
					 where menuId = '"+list[x]["id"].ToString()+"';");
			}
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(s.ToString(), cn)) {
                    try {
                        cmd.ExecuteNonQuery();
                        j.Add("error", 0);
                        j.Add("description", "");
                    } catch(Exception e) {
                        j.Add("error", -1);
                        j.Add("description", e.Message);
                    }
                }
            }
			return j;
		}
		/// <summary>
		/// Updates the category detail order.
		/// </summary>
		/// <param name="updateList">The update list.</param>
		/// <returns></returns>
		public static Dictionary<string,object> UpdateCategoryDetailOrder(string updateList) {
			("FUNCTION /w ADHOC updateCategoryDetailOrder").Debug(10);
			List<Dictionary<string,object>> list=JsonConvert.DeserializeObject<List<Dictionary<string,object>>>(updateList);
			Dictionary<string,object> j=new Dictionary<string,object>();
			StringBuilder s=new StringBuilder();
			for(var x=0;list.Count>x;x++) {
				s.Append(@"update categoryDetail
					 set listOrder = '"+list[x]["order"].ToString()+@"' 
					 where categoryDetailId = '"+list[x]["id"].ToString()+"';");
			}
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(s.ToString(), cn)) {
                    try {
                        cmd.ExecuteNonQuery();
                        j.Add("error", 0);
                        j.Add("description", "");
                    } catch(Exception e) {
                        j.Add("error", -1);
                        j.Add("description", e.Message);
                    }
                }
            }
			return j;
		}
		/// <summary>
		/// Refreshes the item images.
		/// </summary>
		/// <param name="itemNumber">The item number.</param>
		/// <param name="imagingId">The imaging id.</param>
		/// <returns></returns>
		public static Dictionary<string,object> RefreshThisImage(string itemNumber, string imagingId) {
			string[] ls=new string[0];
			return RefreshItemImages(itemNumber, ls, Guid.Empty, new Guid(imagingId));
		}
		/// <summary>
		/// gets progress info generated during file uploads using the upload class.
		/// </summary>
		/// <param name="uploadId">The upload id.</param>
		/// <returns></returns>
		public static Dictionary<string,object> ProgressInfo(string uploadId) {
			("FUNCTION progressInfo").Debug(10);
			Dictionary<string,object> j=new Dictionary<string,object>();
			Guid id = new Guid(uploadId);
			if(Main.ProgressInfos.ContainsKey(id)){
				ProgressInfo m = Main.ProgressInfos[id];
				j.Add("complete",m.Complete);
				j.Add("currentItemCount",m.CurrentItemCount);
				j.Add("currentItemName",m.CurrentItemName);
				j.Add("currentItemSize",m.CurrentItemSize);
				j.Add("currentSizeComplete",m.CurrentSizeComplete);
				j.Add("started",m.Started.ToSeconds());
				j.Add("timerId",m.TimerId);
				j.Add("totalItemCount",m.TotalItemCount);
				j.Add("totalItemSize",m.TotalItemSize);
				j.Add("updated",m.Updated.ToSeconds());
				j.Add("uploadedFiles",m.UploadedFiles);
				j.Add("error",0);
				j.Add("description","");
			}else{
				j.Add("error",-1);
				j.Add("description","Entry does not exist");
			}
			return j;
		}
		/// <summary>
		/// Removes the implict security from a directory.
		/// </summary>
		/// <param name="path">The path.</param>
		private static void RemoveImplictSecurity(string path) {
			DirectoryInfo directoryInfo=new DirectoryInfo(path);
			System.Security.AccessControl.DirectorySecurity directorySecurity=directoryInfo.GetAccessControl();
			System.Security.AccessControl.AuthorizationRuleCollection rules=directorySecurity.GetAccessRules(true,false,typeof(System.Security.Principal.NTAccount));
			foreach(System.Security.AccessControl.FileSystemAccessRule rule in rules){
				directorySecurity.RemoveAccessRule(rule);
			}
			Directory.SetAccessControl(path,directorySecurity);
		}
		/// <summary>
		/// Inits values for the UI.
		/// </summary>
		/// <returns></returns>
		public static Dictionary<string,object> Init() {
			("FUNCTION -> init").Debug(10);
			Dictionary<string,object> j=new Dictionary<string,object>();
			Dictionary<string,object> u=new Dictionary<string,object>();
			Session session = Main.GetCurrentSession();
			j.Add("site",Main.Site.Defaults);
			u.Add("userId",session.UserId);
			if( session.User != null && session.LoggedOn ) {
				u.Add("handle",session.User.Handle);
				u.Add("email",session.Email);
				u.Add("loggedon",session.LoggedOn);
				u.Add("admin_script",session.AdminScript);
				u.Add("allowPreorders",session.AllowPreorders);
				u.Add("sessionId",session.Id.ToString());
				u.Add("administrator",session.Administrator);
				u.Add("script",session.AdminScript);
				u.Add("UI_JSON",session.UIJson);
				j.Add("flagTypes",Main.Site.FlagTypes.List);
			}
            j.Add("defaultExpenseAccount", Main.Site.default_expenseAccount);
            j.Add("defaultExpenseInventoryAccount", Main.Site.default_inventoryAccount);
            j.Add("defaultInventoryCOGSAccount", Main.Site.default_inventoryCOGSAccount);
            j.Add("defaultRevenueAccount", Main.Site.default_revenueAccount);
            j.Add("discountGLAccount", Main.Site.discountGLAccount);
            j.Add("shippingGLAccount", Main.Site.shippingGLAccount);
            j.Add("defaultInventoryOperator", Main.Site.default_inventoryOperator);
            j.Add("defaultInventoryRestockOnFlagId", Main.Site.default_inventoryRestockOnFlagId);
            j.Add("defaultItemIsConsumedOnFlagId", Main.Site.default_itemIsConsumedOnFlagId);
            j.Add("defaultInventoryDepletesOnFlagId", Main.Site.default_inventoryDepletesOnFlagId);
			j.Add("user",u);
			j.Add("error",0);
			j.Add("description","");
			UIInitArgs uiinitArgs = new UIInitArgs();
			Main.Site.raiseOnUIInit(uiinitArgs);
            j.Add("startupProcedures", uiinitArgs.StartupProcedures);
            j.Add("startupParameters", uiinitArgs.StartupParameters);
			return j;
		}
		/// <summary>
		/// Return information about the system.
		/// </summary>
		/// <returns></returns>
		public static Dictionary<string,object> SystemInfo(){
			("FUNCTION systemInfo").Debug(10);
			Dictionary<string,object> j = new Dictionary<string,object>();
			Dictionary<string,object> rvars=new Dictionary<string,object>();
			rvars.Add("version",Main.Version);
			rvars.Add("BillOfMaterials",Main.Site.BillOfMaterials.List.Count);
			//rvars.Add("Blogs",Main.Site.Blogs.List.Count);
			rvars.Add("Carriers",Main.Site.Carriers.List.Count);
			rvars.Add("categories",Main.Site.Categories.List.Count);
			rvars.Add("countries",Main.Site.Countries.List.Count);
			rvars.Add("defaults",Main.Site.Defaults);
			rvars.Add("discounts",Main.Site.Discounts.List.Count);
			rvars.Add("flagTypes",Main.Site.FlagTypes.List.Count);
			//rvars.Add("galleries",Main.Site.Galleries.List.Count);
			rvars.Add("itemImages",Main.Site.ItemImages.List.Count);
			rvars.Add("items",Main.Site.Items.List.Count);
			rvars.Add("menus",Main.Site.Menus.List.Count);
			rvars.Add("path",Main.PhysicalApplicationPath);
			rvars.Add("properties",Main.Site.Properties.List.Count);
			rvars.Add("rates",Main.Site.Rates.List.Count);
			rvars.Add("redirectors",Main.Site.Redirectors.List.Count);
			rvars.Add("renderedImages",Main.Site.RenderedImages.List.Count);
			rvars.Add("replies",Main.Site.Replies.List.Count);
			rvars.Add("reviews",Main.Site.Reviews.List.Count);
			rvars.Add("SeoListMetaUtilities",Main.Site.SeoListMetaUtilities.List.Count);
			rvars.Add("siteImagePlaceholders",Main.Site.SiteImagePlaceholders.List.Count);
			rvars.Add("siteSections",Main.Site.SiteSections.List.Count);
            rvars.Add("Site State", Site.SiteState.ToString());
			rvars.Add("terms",Main.Site.Terms.List.Count);
			rvars.Add("timers",Main.Timers.Count);
			rvars.Add("users",Main.Site.Users.List.Count);
			rvars.Add("zipToZones",Main.Site.ZipToZones.List.Count);
			rvars.Add("zones",Main.Site.Zones.List.Count);
			rvars.Add("currentThread",Thread.CurrentThread.ManagedThreadId);
			j.Add("renditionInfo",rvars);
			List<Dictionary<string,object>> threads=new List<Dictionary<string,object>>();
			Process process = Process.GetCurrentProcess();
			foreach(ProcessThread thread in process.Threads) {
				Dictionary<string,object> dThread=new Dictionary<string,object>();
				dThread.Add("Id",thread.Id);
				dThread.Add("ThreadState",thread.ThreadState.ToString());
				dThread.Add("PrivilegedProcessorTime",thread.PrivilegedProcessorTime.ToString());
				dThread.Add("TotalProcessorTime",thread.TotalProcessorTime.ToString());
				dThread.Add("UserProcessorTime",thread.UserProcessorTime.ToString());
				if(thread.ThreadState==System.Diagnostics.ThreadState.Wait){
					dThread.Add("WaitReason",thread.WaitReason.ToString());
				}else{
					dThread.Add("WaitReason","");
				}
				threads.Add(dThread);
			}
			j.Add("threads",threads);
			Dictionary<string,object> dProcess = new Dictionary<string,object>();
			dProcess.Add("ProcessName",process.ProcessName);
			dProcess.Add("HandleCount",process.HandleCount);
			dProcess.Add("Id",process.Id);
			dProcess.Add("MachineName",process.MachineName);
			dProcess.Add("PagedMemorySize",process.PagedMemorySize64);
			dProcess.Add("PagedSystemMemorySize64",process.PagedSystemMemorySize64);
			dProcess.Add("PeakPagedMemorySize64",process.PeakPagedMemorySize64);
			dProcess.Add("PeakVirtualMemorySize64",process.PeakVirtualMemorySize64);
			dProcess.Add("PeakWorkingSet64",process.PeakWorkingSet64);
			dProcess.Add("PrivateMemorySize64",process.PrivateMemorySize64);
			dProcess.Add("PrivilegedProcessorTime",process.PrivilegedProcessorTime.ToString());
			dProcess.Add("StartTime",process.StartTime.ToString());
			dProcess.Add("TotalProcessorTime",process.TotalProcessorTime.ToString());
			dProcess.Add("UserProcessorTime",process.UserProcessorTime.ToString());
			dProcess.Add("VirtualMemorySize",process.VirtualMemorySize64);
			dProcess.Add("WorkingSet",process.WorkingSet64);
			dProcess.Add("BasePriority",process.BasePriority.ToString());
			j.Add("process",dProcess);
			List<Dictionary<string,object>> plugins=new List<Dictionary<string,object>>();
			foreach(Plugin plugin in Main.Plugins){
				Dictionary<string,object> dPlug=new Dictionary<string,object>();
				dPlug.Add("name",plugin.Info.Name);
				dPlug.Add("description",plugin.Info.Description);
				dPlug.Add("Author",plugin.Info.Author);
				dPlug.Add("version",plugin.Info.Version);
				dPlug.Add("message",plugin.Message);
				dPlug.Add("error",plugin.Error);
                dPlug.Add("enabled", !Main.isPluginRevoked(plugin.GetType().GUID));
                dPlug.Add("GUID", plugin.GetType().GUID.ToString());
				plugins.Add(dPlug);
			}
            foreach(string[] pluginData in Main.RevokedPlugins) {
                if(pluginData[0]!=null){
                    Dictionary<string, object> dPlug = new Dictionary<string, object>();
                    dPlug.Add("name", pluginData[0]);
                    dPlug.Add("description", "");
                    dPlug.Add("Author", "");
                    dPlug.Add("version", "");
                    dPlug.Add("message", "");
                    dPlug.Add("error", "");
                    dPlug.Add("enabled", false);
                    dPlug.Add("GUID", pluginData[1]);
                    plugins.Add(dPlug);
                }
            }
			j.Add("plugins",plugins);
			List<Dictionary<string,object>> timers=new List<Dictionary<string,object>>();
			foreach(Admin.Timer timer in Main.Timers) {
				Dictionary<string,object> dTimer=new Dictionary<string,object>();
				dTimer.Add("error",timer.Error);
				dTimer.Add("message",timer.Message);
				dTimer.Add("AutoReset",timer.AutoReset);
				dTimer.Add("name",timer.Name);
				dTimer.Add("Interval",timer.Interval);
				dTimer.Add("timeUntilElapsed",timer.TimeUntilElapsed);
				timers.Add(dTimer);
			}
			j.Add("timers",timers);
			if(HttpContext.Current!=null){
				System.Collections.Specialized.NameValueCollection nvars = HttpContext.Current.Request.ServerVariables;
				Dictionary<string,object> vars = new Dictionary<string,object>();
				foreach(string key in nvars.Keys){
					if(!key.StartsWith("ALL")){
						vars.Add(key,nvars[key]);
					}
				}
				j.Add("ServerVariables",vars);
			}
			j.Add("error",0);
			j.Add("description","");
			return j;
		}
		/// <summary>
		/// Restarts the worker process.
		/// </summary>
		/// <returns></returns>
		public static Dictionary<string,object> RestartWorkerProcess(){
			Dictionary<string,object> j=new Dictionary<string,object>();
			/* do this is just a second */
			Timer killshot = new Timer();
			killshot.Interval = 2000; /* wait 2 seconds */
			killshot.elapsed+=new EventHandler(delegate(object sender, EventArgs e){
				Process process = Process.GetCurrentProcess();
				process.Kill();
				return;
			});
			killshot.Start();			
			j.Add("error",0);
			j.Add("description","");
			return j;
		}
		/// <summary>
		/// Gets any system message for the current userId.
		/// </summary>
		/// <returns>{error:0,desc:"error description"}.</returns>
		public static Dictionary<string,object> GetMessages() {
			Dictionary<string,object> j=new Dictionary<string,object>();
			Session s = Main.GetCurrentSession();
			/* find all the system messages that have not been recieved by an administrator this session */
			List<Dictionary<string,object>> systemMessages = new List<Dictionary<string,object>>();
			/* only send system messages to Admin's who have ticked the "would like email" box. */
			j.Add("systemMessages",systemMessages);
			if(s.User==null){return j;};
			if(s.User.WouldLikEmail){
				if(Main.SystemMessages.Count>0){
					Dictionary<string,object>[] smCopy=new Dictionary<string,object>[Main.SystemMessages.Count];
					Main.SystemMessages.CopyTo(smCopy);
					foreach(Dictionary<string,object> msg in smCopy.Reverse()) {
						Dictionary<string,object> dMsg=new Dictionary<string,object>();
						dMsg.Add("id",msg["id"]);
						dMsg.Add("message",msg["message"]);
						dMsg.Add("logTime",msg["logTime"]);
						systemMessages.Add(dMsg);
					}
				}
			}
			
			return j;
		}
		/// <summary>
		/// Sets an internal email or system message as read.
		/// </summary>
		/// <param name="messageIds">The message ids.  One or more GUIDs that represent a systemMessage or an emailId.</param>
		/// <returns>{error:0,desc:"error description"}.</returns>
		public static Dictionary<string,object> SetMessageRead(List<object> messageIds){
			Dictionary<string,object> j=new Dictionary<string,object>();
			foreach(string messageId in messageIds){
				for(int x=0;Main.SystemMessages.Count>x;x++){
					if(Main.SystemMessages[x]["id"].ToString()==messageId) {
						Main.SystemMessages.Remove(Main.SystemMessages[x]);
						break;
					}
				}
			}
			j.Add("error",0);
			j.Add("description","");
			return j;
		}
	}
}