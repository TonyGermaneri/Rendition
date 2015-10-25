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
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Linq;
using BarcodeLib;
using System.IO;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Data;
using System.Web;
using System.Threading;
using Microsoft.SqlServer;
using Microsoft.SqlServer.Server;
namespace Rendition {
	public partial class Admin {
		/// <summary>
		/// updates the Grids schema for the current user.
		/// </summary>
		/// <param name="objectId">The object id.</param>
		/// <param name="visibilityCSV">The visibility CSV.</param>
		/// <param name="orderCSV">The order CSV.</param>
		/// <param name="sizeCSV">The size CSV.</param>
		/// <param name="orderBy">The order by.</param>
		/// <param name="orderDirection">The order direction.</param>
		/// <returns></returns>
		public static Dictionary<string, object> GridSchemaUpdate( Int64 objectId, string visibilityCSV, string orderCSV, string sizeCSV, Int64 orderBy, Int64 orderDirection ) {
			( "FUNCTION /w SP,(!PRIVATE ACCESS ONLY!) gridSchemaUpdate" ).Debug( 10 );
			string commandText = "dbo.dataGridSchemaUpdate @userId,@objectId,@visibilityCSV,@orderCSV,@sizeCSV,@orderBy,@orderDirection";
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(commandText, cn)) {
                    cmd.Parameters.Add("@userId", SqlDbType.Int).Value = Main.GetCurrentSession().UserId;
                    cmd.Parameters.Add("@objectId", SqlDbType.Int).Value = (int)objectId;
                    cmd.Parameters.Add("@visibilityCSV", SqlDbType.VarChar).Value = visibilityCSV;
                    cmd.Parameters.Add("@orderCSV", SqlDbType.VarChar).Value = orderCSV;
                    cmd.Parameters.Add("@sizeCSV", SqlDbType.VarChar).Value = sizeCSV;
                    cmd.Parameters.Add("@orderBy", SqlDbType.VarChar).Value = (int)orderBy;
                    cmd.Parameters.Add("@orderDirection", SqlDbType.Int).Value = (int)orderDirection;
                    cmd.ExecuteNonQuery();
                }
            }
			Dictionary<string, object> j = new Dictionary<string, object>();
			j.Add( "error", 0 );
			j.Add( "description", "" );
			return j;
		}
		/// <summary>
		/// SQL command.
		/// </summary>
		/// <param name="commandText">The command text.</param>
		/// <returns></returns>
		public static Dictionary<string, object> SqlCommand( string commandText ) {
			( "FUNCTION /w ADHOC,(!PRIVATE ACCESS ONLY!) SQLCommand" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
			if( commandText.Length > 0 ) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand(commandText, cn)) {
                        try {
                            cmd.ExecuteNonQuery();
                            j.Add("error", 0);
                            j.Add("description", "");
                        } catch(Exception e) {
                            j.Add("error", -10);
                            j.Add("description", "SQL Server Error. " + e.Message);
                        }
                    }
                }
			}
			return j;
		}
		/// <summary>
		/// Gets a SQL array.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static object GetSqlArray( Dictionary<string, object> args ) {
			( "FUNCTION /w SP,(!PRIVATE ACCESS ONLY!) GetSqlArray" ).Debug( 10 );
			List<object> j = null;
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				object proc = null;
				object argumentCollection = null;
				foreach( KeyValuePair<string, object> field in args ) {
					if( field.Key == "commandText" ) {
						proc = field.Value;
					} else if( field.Key == "arguments" ) {
						if( field.GetType() != typeof( Dictionary<string, object> ) ) {
							argumentCollection = new Dictionary<string, object>();
						} else {
							argumentCollection = field;
						}
					}
				}
				if( proc == null ) { return null; };
				StringBuilder t = new StringBuilder();
				if( argumentCollection != null ) {
					foreach( KeyValuePair<string, object> field in argumentCollection as Dictionary<string, object> ) {
						t.Append( "@" + field.Key + "," );
					}
					if( t.Length > 0 ) {
						t.Remove( t.Length - 1, 1 );/*remove last comma */
					}
				}
				using( SqlCommand cmd = new SqlCommand( proc + " " + t.ToString(), cn ) ) {
					if( argumentCollection != null ) {
						foreach( KeyValuePair<string, object> field in argumentCollection as Dictionary<string, object> ) {
							cmd.Parameters.Add( "@" + field.Key, field.GetType().ToSqlDbType() ).Value = field.Value;
						}
					}
					j = cmd.ExecuteReader().GetJsonArray();
				}
			}
			return j;
		}
		/// <summary>
		/// Auto pagination fuction for JS class Rendtion.UI.Grid
		/// </summary>
		/// <param name="objectName">Name of the object.</param>
		/// <param name="suffix">Where clause or any other suffix that would come after the table and table options.</param>
		/// <param name="_from">Row to fetch from.</param>
		/// <param name="_to">Row to fetch to.</param>
		/// <param name="searchSuffix">A where clause that will return a row number list of rows in the primary query matching this where clause.</param>
		/// <param name="aggregateColumns">Which columns to aggregate in an aggregate query.</param>
		/// <param name="selectedRows">Which rows are selected.</param>
		/// <param name="outputType">What type of output?</param>
		/// <param name="includeSchema">if set to <c>true</c> also returns table schema including width and position of each column on a per user basis.</param>
		/// <param name="_checksum">Checksum of the last query.  Each time the table changes the checksum (sum(VerCol)) of the table changes.</param>
		/// <param name="deleteSelection">if set to <c>true</c> [delete selection].</param>
		/// <param name="orderBy_override">Override the user/default schema ordering for this table.</param>
		/// <param name="orderDirection_override">When overriding the order by direction, which order: asc, or desc.</param>
		/// <returns>
		/// Complex JSON for Rendition.ui.grid javaScript program.
		/// </returns>
		public static Dictionary<string, object> DataSet( string objectName, string suffix, string _from, string _to,
		string searchSuffix, Dictionary<string, object> aggregateColumns, List<object> selectedRows, string outputType,
		bool includeSchema, string _checksum, bool deleteSelection, string orderBy_override, string orderDirection_override ) {
			HttpContext current = HttpContext.Current;
			Dictionary<string, object> j = new Dictionary<string, object>();
			List<int> rows = new List<int>();
			List<int> columns = new List<int>();
			StringBuilder rows_SQLPRAM = new StringBuilder( "" );
			int from = 0;
			int to = 0;
			int checksum = -1;
			if( !int.TryParse( _from, out from ) ) {
				from = 0;
			}
			if( !int.TryParse( _to, out to ) ) {
				to = 0;
			}
			if( !int.TryParse( _checksum, out checksum ) ) {
				checksum = -1;
			}
			if( from > to ) {
				to = from;
			}
			bool justSelection = false;
			bool includeHeaders = false;
			bool zipFile = false;
			foreach( Dictionary<string, object> field in selectedRows ) {
				foreach( KeyValuePair<string, object> innerField in field ) {
					if( innerField.Key == "rowIndex" ) {
						rows.Add( Convert.ToInt32( innerField.Value ) - 1 );
						rows_SQLPRAM.Append( innerField.Value + "," );
					} else if( innerField.Key == "columnIndex" ) {
						columns.Add( Convert.ToInt32( innerField.Value ) - 1 );
					}
				}
			}
			if( rows_SQLPRAM.Length > 0 ) {
				rows_SQLPRAM.RemoveLast( 1 );
			}
			if( outputType.Contains( "|" ) ) {/* deconstruct pipe seperated output type */
				string[] fTypes = outputType.Split( '|' );
				/*fileType.value+"|"+justSelection+"|"+includeHeaders+"|"+zipFile;*/
				outputType = fTypes[ 0 ];
				justSelection = Convert.ToBoolean( fTypes[ 1 ] );
				includeHeaders = Convert.ToBoolean( fTypes[ 2 ] );
				zipFile = Convert.ToBoolean( fTypes[ 3 ] );
			}
			StringBuilder g = new StringBuilder();
			if( aggregateColumns.Count > 0 ) {
				foreach( KeyValuePair<string, object> field in aggregateColumns as Dictionary<string, object> ) {
					if( field.Value.ToString().ToLower() != "false" ) {
						g.Append( field.Key + "|" + field.Value.ToString() + "," );
					}
				}
			}
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand("dbo.toJSON", cn)) {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandTimeout = 0;/* never timeout */
                    cmd.Parameters.Add("@objName", SqlDbType.VarChar).Value = HttpUtility.UrlDecode(objectName);
                    cmd.Parameters.Add("@record_from", SqlDbType.Int).Value = (int)from;
                    cmd.Parameters.Add("@record_to", SqlDbType.Int).Value = (int)to;
                    cmd.Parameters.Add("@suffix", SqlDbType.VarChar).Value = suffix;
                    cmd.Parameters.Add("@userId", SqlDbType.Int).Value = Main.GetCurrentSession().UserId;
                    cmd.Parameters.Add("@searchSuffix", SqlDbType.Text).Value = searchSuffix;
                    cmd.Parameters.Add("@aggregateColumns", SqlDbType.Text).Value = g.ToString();
                    cmd.Parameters.Add("@selectedRowsCSV", SqlDbType.VarChar).Value = rows_SQLPRAM.ToString();
                    cmd.Parameters.Add("@includeSchema", SqlDbType.Bit).Value = includeSchema;
                    cmd.Parameters.Add("@checksum", SqlDbType.BigInt).Value = checksum;
                    cmd.Parameters.Add("@delete", SqlDbType.Bit).Value = deleteSelection;
                    cmd.Parameters.Add("@orderBy_override", SqlDbType.VarChar).Value = orderBy_override;
                    cmd.Parameters.Add("@orderDirection_override", SqlDbType.VarChar).Value = orderDirection_override;
                    //using(SqlDataReader u=cmd.ExecuteReader()) {
                    IAsyncResult result = cmd.BeginExecuteReader();
                    WaitHandle w = result.AsyncWaitHandle;
                    /* HACK: Async ajax grid: HttpContext.Current.Response.IsClientConnected not working
                     * this does not work, but it does no harm and is logical
                     * the client ajax funciton passes an abort() to the server
                     * but I cannot see this abort in the expected IsClientConnected property
                     * or worker process IsClientConnected() method.  I can see updated it if I pass
                     * response.flush() but this passes random wierd characters to the client
                     * tried response.clear, no help, but someday I'll figure it out!
                     * At least the server side async query part is done.
                     */
                    while(true) {
                        if(result.IsCompleted) {
                            ("DataSet callback").Debug(10);
                            break;
                        } else {
                            Thread.Sleep(100);/* wait a (fraction of a) second */
                            if(HttpContext.Current.Response.IsClientConnected == false) {/* check if the client is there to get it */
                                ("client abort/DataSet canceled").Debug(10);
                                j.Add("error", -600);
                                j.Add("description", "client disconnect");
                                cmd.Cancel();
                                cmd.Dispose();
                                return j;
                            }
                        }
                    }
                    using(SqlDataReader u = cmd.EndExecuteReader(result)) {
                        List<object> d = new List<object>();
                        j.Add("error", 0);
                        j.Add("description", "");
                        StringBuilder t = new StringBuilder();
                        List<string> columnNames = new List<string>();
                        string lastAdded = "";
                        if(searchSuffix.Length == 0 && g.Length == 0) {
                            List<object> dat = new List<object>();
                            int counter = -2;/*don't count the first two rows */
                            Dictionary<string, object> range = new Dictionary<string, object>();
                            range.Add("from", from);
                            range.Add("to", to);
                            j.Add("range", range);
                            if(outputType == "HTML") {
                                t.Append("<table><tr>");
                            } else if(outputType == "XML") {
                                t.Append("<?xml version=\"1.0\" encoding=\"utf-8\" ?><records>");
                            }
                            while(u.Read()) {
                                if(counter == -1) {
                                    if(includeSchema || includeHeaders) {
                                        List<Dictionary<string, object>> hed = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(u.GetString(0).ToString());
                                        if(outputType == "JSON") {
                                            j.Add("header", hed);
                                        } else if(outputType == "CSV" || outputType == "HTML" || outputType == "XML") {
                                            if(outputType == "HTML") {
                                                t.Append("<tr>");
                                            }
                                            foreach(Dictionary<string, object> field in hed) {
                                                Dictionary<string, object> innerO = field;
                                                int z = 0;
                                                foreach(KeyValuePair<string, object> innerField in innerO) {
                                                    if(columns.IndexOf(z) > -1 && columns.Count > 0) {
                                                        continue;
                                                    };
                                                    if(innerField.Key == "displayName") {
                                                        columnNames.Add((string)innerField.Value);
                                                        if(includeHeaders) {
                                                            if(outputType == "HTML") {
                                                                t.Append("<th>" + innerField.Value.ToString().HtmlEncode() + "</th>");
                                                            } else if(outputType == "CSV") {
                                                                t.Append(innerField.Value.ToString().ToCsv() + ",");
                                                            }
                                                        }
                                                    }
                                                    z++;
                                                }
                                            }
                                            if(outputType == "HTML") {
                                                t.Append("</tr>");
                                            }
                                            if(outputType == "CSV" && includeHeaders) {
                                                t.RemoveLast(1);/*remove last comma*/
                                                t.Append(Environment.NewLine);
                                            }
                                        }
                                    }
                                } else if(counter == -2) {
                                    Dictionary<string, object> sch = JsonConvert.DeserializeObject<Dictionary<string, object>>(u.GetString(0).ToString());
                                    j.Add("schema", sch);
                                } else {
                                    dat = JsonConvert.DeserializeObject<List<object>>(u.GetString(0).ToString());
                                    if(outputType == "JSON") {
                                        d.Add(dat);
                                    } else if(outputType == "CSV" || outputType == "HTML" || outputType == "XML") {
                                        if(rows.IndexOf(counter) > -1 || rows.Count == 0) {
                                            int colCount = 0;
                                            foreach(object field in dat) {
                                                if(columns.IndexOf(colCount) > -1 && columns.Count > 0) {
                                                    continue;
                                                };
                                                if(outputType == "HTML") {
                                                    t.Append("<td>" + field.ToString().HtmlEncode() + "</td>");
                                                } else if(outputType == "XML") {
                                                    t.Append("<" + System.Security.SecurityElement.Escape(columnNames[colCount].Replace(" ", "")) + ">" +
                                                    System.Security.SecurityElement.Escape(field.ToString()) +
                                                    "</" + System.Security.SecurityElement.Escape(columnNames[colCount].Replace(" ", "")) + ">");
                                                } else {
                                                    t.Append(field.ToString().ToCsv() + ",");
                                                }
                                                colCount++;
                                            }
                                            if(outputType == "CSV") {
                                                t.RemoveLast(1);/*remove last comma*/
                                            }
                                            t.Append(Environment.NewLine);
                                        }
                                    }
                                }
                                if(counter > -1) {
                                    if(outputType == "HTML") {
                                        t.Append("</tr><tr>");
                                    } else if(outputType == "XML") {
                                        t.Append("</record" + counter + ">");
                                    }
                                }
                                counter++;
                                if(counter > -1) {
                                    if(outputType == "XML") {
                                        lastAdded = "<record" + counter + ">";
                                        t.Append(lastAdded);
                                    }
                                }
                            }
                            if(outputType == "HTML") {
                                t.RemoveLast(4);
                                t.Append("</table>");
                            } else if(outputType == "XML") {
                                t.RemoveLast(lastAdded.Length);
                                t.Append("</records>");
                            }
                            j.Add("data", d);
                        } else if(g.Length > 0) {
                            Dictionary<string, object> dat = new Dictionary<string, object>();
                            int counter = 0;
                            while(u.Read()) {
                                Dictionary<string, object> f = JsonConvert.DeserializeObject<Dictionary<string, object>>(u.GetString(0).ToString());
                                dat.Add("aggregate" + counter, f);
                                counter++;
                            }
                            dat.Add("length", counter);
                            j.Add("data", dat);
                        } else {
                            Dictionary<string, object> dat = new Dictionary<string, object>();
                            int counter = 0;
                            while(u.Read()) {
                                dat.Add("match" + (counter++), u.GetInt64(0));
                            }
                            dat.Add("length", counter);
                            j.Add("data", dat);
                            ("DataSet output to JSON").Debug(10);
                        }
                        if(outputType == "HTML" || outputType == "CSV" || outputType == "XML") {
                            Dictionary<string, object> f = new Dictionary<string, object>();
                            if(outputType == "CSV") {
                                f.Add("content", t);
                                f.Add("contentType", "text/csv");
                                f.Add("fileName", "grid_" + DateTime.Now.ToString("MM.dd.yyyy-HH.mm.ss") + ".csv");
                                ("DataSet output to csv").Debug(10);
                            } else if(outputType == "HTML") {
                                f.Add("content", t);
                                f.Add("contentType", "text/html");
                                f.Add("fileName", "grid_" + DateTime.Now.ToString("MM.dd.yyyy-HH.mm.ss") + ".html");
                                ("DataSet output to html").Debug(10);
                            } else if(outputType == "XML") {
                                f.Add("content", t);
                                f.Add("contentType", "text/xml");
                                f.Add("fileName", "grid_" + DateTime.Now.ToString("MM.dd.yyyy-HH.mm.ss") + ".xml");
                                ("DataSet output to xml").Debug(10);
                            }
                            return f;
                        }
                        u.Close();
                    }
                }
            }
			return j;
		}
		/// <summary>
		/// CRUD functions for grid database interaction.
		/// </summary>
		/// <param name="objectName">Name of the object.</param>
		/// <param name="data">The data.</param>
		/// <param name="overwrite">if set to <c>true</c> [overwrite].</param>
		/// <param name="commandType">Type of the command.</param>
		/// <returns></returns>
		public static Dictionary<string, object> Crud( string objectName, List<object> data, bool overwrite, Int64 commandType ) {
			( "FUNCTION /w SP,(!PRIVATE ACCESS ONLY!) crud" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
			StringBuilder t = new StringBuilder();
			List<SqlDataRecord> rowData = new List<SqlDataRecord>();
			SqlMetaData[] hashTable = { 
				new SqlMetaData("keyName",SqlDbType.VarChar,100),
				new SqlMetaData("keyValue",SqlDbType.Variant),
				new SqlMetaData("primary_key",SqlDbType.Bit),
				new SqlMetaData("dataType",SqlDbType.VarChar,50),
				new SqlMetaData("dataLength",SqlDbType.Int),
				new SqlMetaData("varCharMaxValue",SqlDbType.VarChar,-1)
			};
			foreach( object field in data as List<object> ) {
				Dictionary<string, object> inner = ( Dictionary<string, object> )field;
				SqlDataRecord rec = new SqlDataRecord( hashTable );
				string dataType = "";
				string varCharMaxValue = "";
				foreach( KeyValuePair<string, object> innerField in inner ) {
					if( innerField.Key == "dataType" ) {
						dataType = innerField.Key;
						rec.SetString( 3, ( string )innerField.Value.ToString() );
					} else if( innerField.Key == "primaryKey" ) {
						rec.SetBoolean( 2, Convert.ToBoolean( innerField.Value ) );
					} else if( innerField.Key == "name" ) {
						rec.SetString( 0, ( string )innerField.Value.ToString() );
					} else if( innerField.Key == "value" ) {
						varCharMaxValue = innerField.Value.ToString();
						rec.SetValue( 1, innerField.Value );
					} else if( innerField.Key == "dataLength" ) {
						rec.SetValue( 4, Convert.ToInt32( innerField.Value ) );
					}
				}
				rec.SetValue( 5, Convert.ToString( varCharMaxValue ) );
				rowData.Add( rec );
			}
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = cn.CreateCommand()) {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "dbo.crud";
                    cmd.Parameters.Add("@objectName", SqlDbType.VarChar, 50);
                    cmd.Parameters["@objectName"].Direction = ParameterDirection.Input;
                    cmd.Parameters["@objectName"].Value = objectName;

                    cmd.Parameters.Add("@row", SqlDbType.Structured);
                    cmd.Parameters["@row"].Direction = ParameterDirection.Input;
                    cmd.Parameters["@row"].Value = rowData;

                    cmd.Parameters.Add("@overwrite", SqlDbType.Bit);
                    cmd.Parameters["@overwrite"].Direction = ParameterDirection.Input;
                    cmd.Parameters["@overwrite"].Value = overwrite;

                    cmd.Parameters.Add("@commandType", SqlDbType.Int);
                    cmd.Parameters["@commandType"].Direction = ParameterDirection.Input;
                    cmd.Parameters["@commandType"].Value = Convert.ToInt32(commandType);/* 0 = Update, 1 = insert, 2 = delete*/
                    ("Execute SP [dbo].[crud] @commandType = " + commandType).Debug(10);
                    using(SqlDataReader u = cmd.ExecuteReader()) {
                        u.Read();
                        j.Add("error", u.GetInt32(0));
                        j.Add("description", u.GetString(1));
                        j.Add("primaryKey", u.GetValue(2).ToString());
                        if(commandType == 0) {
                            if(u.GetInt32(0) == 0) {
                                j.Add("verCol", u.GetValue(3).ToString());
                            }
                        } else {
                            j.Add("verCol", -1);
                        }
                        j.Add("commandType", commandType.ToString());
                    }
                }
            }
			return j;
		}
	}
}
