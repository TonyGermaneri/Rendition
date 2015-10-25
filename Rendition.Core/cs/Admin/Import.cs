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
using System.Data.OleDb;
using System.Text.RegularExpressions;
namespace Rendition {
	public partial class Admin {
		/// <summary>
		/// Imports a status change.
		/// </summary>
		/// <param name="args">The arguments of the new status changes.</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="cn">SQL connection.</param>
		/// <param name="trns">SQL transaction.</param>
		/// <returns></returns>
		public static Dictionary<string, object> ImportStatusChange( Dictionary<string, object> args, bool dupeMode, SqlConnection cn, SqlTransaction trns ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			return j;
		}
		/// <summary>
		/// Imports the item property.
		/// </summary>
		/// <param name="args">The arguments of the new Properties.</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="cn">SQL connection.</param>
		/// <param name="trns">SQL transaction.</param>
		/// <returns></returns>
		public static Dictionary<string, object> ImportProperty( Dictionary<string, object> args, bool dupeMode, SqlConnection cn, SqlTransaction trns ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			return j;
		}
		/// <summary>
		/// Imports the status changes (not implemented).
		/// </summary>
		/// <param name="preview">if set to <c>true</c> [preview].</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="args">The args.</param>
		/// <returns>List of errors that may have occured.</returns>
		public static List<object> ImportStatusChanges( bool preview, bool dupeMode, Dictionary<string, object> args ) {
			List<object> outputItemList = new List<object>();
			return outputItemList;
		}
		/// <summary>
		/// Imports a zip to zone table.
		/// </summary>
		/// <param name="preview">if set to <c>true</c> [preview].</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="zones">The zones.</param>
		/// <param name="carrierId">The Carrier id.</param>
		/// <param name="service">The service.</param>
		/// <returns></returns>
		public static List<object> ImportZipToZone( bool preview, bool dupeMode, List<object> zones, string carrierId, string service ) {
			List<object> outputItemList = new List<object>();
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trns = cn.BeginTransaction( "Import areaSurcharge" ) ) {
					string zipRange = "";
					string shipZone = "";
					int fromZip = 0;
					int toZip = 0;
					using( SqlCommand cmd = new SqlCommand( @"delete from zipToZone where carrier = @carrierId and service = @service", cn, trns ) ) {
						cmd.Parameters.Add( "@carrierId", SqlDbType.Int ).Value = carrierId;
						cmd.Parameters.Add( "@service", SqlDbType.Int ).Value = service;
						cmd.ExecuteNonQuery();/* get rid of existing rates */
					}
					foreach( Dictionary<string, object> keys in zones ) {
						List<object> columns = new List<object>();
						if( keys.ContainsKey( "zipRange" ) && keys.ContainsKey( "shipZone" ) ) {
							zipRange = keys[ "zipRange" ].ToString();
							shipZone = keys[ "shipZone" ].ToString();
							if( Regex.IsMatch( zipRange, "^[0-9]{3,5}-?[0-9]{0,5}$" )
							&& Regex.IsMatch( shipZone, "^[0-9]{1,3}$" )
							&& Regex.IsMatch( service, "^[0-9]{1,3}$" ) ) {
								if( zipRange.Contains( "-" ) ) {
									/* rage of codes, not a single code */
									string[] range = zipRange.Split( '-' );
									switch( range[ 0 ].Length ) {
										case 1: range[ 0 ] = range[ 0 ] + "0000"; break;
										case 2: range[ 0 ] = range[ 0 ] + "000"; break;
										case 3: range[ 0 ] = range[ 0 ] + "00"; break;
										case 4: range[ 0 ] = range[ 0 ] + "0"; break;
									}
									switch( range[ 1 ].Length ) {
										case 1: range[ 1 ] = range[ 1 ] + "9999"; break;
										case 2: range[ 1 ] = range[ 1 ] + "999"; break;
										case 3: range[ 1 ] = range[ 1 ] + "99"; break;
										case 4: range[ 1 ] = range[ 1 ] + "9"; break;
									}
									int z = 0;
									int s = 0;
									if( ( int.TryParse( range[ 0 ], out fromZip )
									&& int.TryParse( range[ 1 ], out toZip )
									&& int.TryParse( shipZone, out z )
									&& int.TryParse( service, out s ) ) ) {
										using( SqlCommand cmd = new SqlCommand( @"insert into zipToZone
										(zipToZoneId,carrier,sourceZip,service,fromzip,toZip,shipZone,VerCol)
										values (newId(),@carrierId,@sourceZip,@service,@fromZip,@toZip,@shipZone,null)", cn, trns ) ) {
											cmd.Parameters.Add( "@carrierId", SqlDbType.Int ).Value = carrierId;
											cmd.Parameters.Add( "@sourceZip", SqlDbType.Int ).Value = Main.Site.company_zip.Substring( 0, 5 );
											cmd.Parameters.Add( "@service", SqlDbType.Int ).Value = service;
											cmd.Parameters.Add( "@fromZip", SqlDbType.Int ).Value = fromZip;
											cmd.Parameters.Add( "@toZip", SqlDbType.Int ).Value = toZip;
											cmd.Parameters.Add( "@shipZone", SqlDbType.Int ).Value = shipZone;
											cmd.ExecuteNonQuery();
										}
										columns.Add( fromZip.ToString() + "-" + toZip.ToString() );
										columns.Add( shipZone );
									}
								} else {
									int zip = 0;
									int z = 0;
									int s = 0;
									switch( zipRange.Length ) {
										case 1: zipRange = zipRange + "0000"; break;
										case 2: zipRange = zipRange + "000"; break;
										case 3: zipRange = zipRange + "00"; break;
										case 4: zipRange = zipRange + "0"; break;
									}
									if( ( int.TryParse( zipRange, out zip )
									&& int.TryParse( shipZone, out z )
									&& int.TryParse( service, out s ) ) ) {
										/* just a single zip to bo in both */
										using( SqlCommand cmd = new SqlCommand( @"insert into zipToZone
										(zipToZoneId,carrier,sourceZip,service,fromzip,toZip,shipZone,VerCol)
										values (newId(),@carrierId,@sourceZip,@service,@fromZip,@toZip,@shipZone,null)", cn, trns ) ) {
											cmd.Parameters.Add( "@carrierId", SqlDbType.Int ).Value = carrierId;
											cmd.Parameters.Add( "@sourceZip", SqlDbType.Int ).Value = Main.Site.company_zip.Substring( 0, 5 );
											cmd.Parameters.Add( "@service", SqlDbType.Int ).Value = service;
											cmd.Parameters.Add( "@fromZip", SqlDbType.Int ).Value = zip;
											cmd.Parameters.Add( "@toZip", SqlDbType.Int ).Value = zip;
											cmd.Parameters.Add( "@shipZone", SqlDbType.Int ).Value = shipZone;
											cmd.ExecuteNonQuery();
										}
										columns.Add( zip.ToString() + "-" + zip.ToString() );
										columns.Add( shipZone );
									}
								}

							}
						}
						outputItemList.Add( columns );
					}
					if( preview ) {
						trns.Rollback();
					} else {
						trns.Commit();
					}
				}
			}
			return outputItemList;
		}
		/// <summary>
		/// Imports a surcharge table.
		/// </summary>
		/// <param name="preview">if set to <c>true</c> [preview].</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="rates">The rates.</param>
		/// <param name="carrierId">The Carrier id.</param>
		/// <returns></returns>
		public static List<object> ImportSurcharge( bool preview, bool dupeMode, List<object> rates, string carrierId ) {
			List<object> outputSurchargeList = new List<object>();
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trns = cn.BeginTransaction( "Import areaSurcharge" ) ) {
					using( SqlCommand cmd = new SqlCommand( @"delete from areaSurcharge where carrier = @carrierId", cn, trns ) ) {
						cmd.Parameters.Add( "@carrierId", SqlDbType.Int ).Value = carrierId;
						cmd.ExecuteNonQuery();/* get rid of existing rates */
					}
					foreach( Dictionary<string, object> keys in rates ) {
						if( keys.Count > 0 ) {
							if( keys.ContainsKey( "deliveryArea" ) ) {
								if( keys[ "deliveryArea" ].ToString() != "" ) {
									List<object> columns = new List<object>();
									foreach( KeyValuePair<string, object> key in keys ) {
										if( key.Key.ToString().StartsWith( "deliveryArea" ) ) {
											string deliveryArea = key.Value.ToString().Trim();
											if( Regex.IsMatch( deliveryArea, "^[0-9]{3,5}$" ) ) {
												using( SqlCommand cmd = new SqlCommand( @"insert into areaSurcharge (areaSurchargeId,deliveryArea,carrier,VerCol)
												values (newId(),@deliveryArea,@carrierId,null)", cn, trns ) ) {
													cmd.Parameters.Add( "@deliveryArea", SqlDbType.Int ).Value = deliveryArea;
													cmd.Parameters.Add( "@carrierId", SqlDbType.Int ).Value = carrierId;
													cmd.ExecuteNonQuery();
												}
												columns.Add( deliveryArea );
											} else {
												columns.Add( "" );
											}
										}
									}
									outputSurchargeList.Add( columns );
								}
							}
						}
					}
					if( preview ) {
						trns.Rollback();
					} else {
						trns.Commit();
					}
				}
			}
			return outputSurchargeList;
		}
		/// <summary>
		/// Imports a rates table.
		/// </summary>
		/// <param name="preview">if set to <c>true</c> [preview].</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="rates">The rates.</param>
		/// <param name="rateId">The rate id.</param>
		/// <returns></returns>
		public static List<object> ImportRates( bool preview, bool dupeMode, List<object> rates, string rateId ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			List<object> outputRateList = new List<object>();
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trns = cn.BeginTransaction( "Import rates" ) ) {
					string weight = "0";
					string shipZone = "0";
					string cost = "0";
					int lastWeight = -1;
					using( SqlCommand cmd = new SqlCommand( @"delete from shipZone where rate = @rateId", cn, trns ) ) {
						cmd.Parameters.Add( "@rateId", SqlDbType.Int ).Value = rateId;
						cmd.ExecuteNonQuery();/* get rid of existing rates */
					}
					foreach( Dictionary<string, object> keys in rates ) {
						List<object> columns = new List<object>();
						foreach( KeyValuePair<string, object> key in keys ) {
							if( key.Key == "weight" ) {
								weight = key.Value.ToString();
								weight = weight.Replace( "letter", "0" ).Replace( "envelope", "0" ).Replace( "Letter", "0" ).Replace( "Envelope", "0" )
								.Replace( "LETTER", "0" ).Replace( "ENVELOPE", "0" ).Replace( "lbs.", "" ).Replace( "Lbs.", "" ).Trim();
								columns.Add( weight );
							} else if( key.Key.ToString().StartsWith( "zone" ) ) {
								shipZone = key.Key.ToString().Replace( "zone", "" ).Trim();
								cost = key.Value.ToString().Replace( "$", "" ).Trim();
								if( Regex.IsMatch( weight, "^[0-9]+$" ) && Regex.IsMatch( cost, "^([0-9.])+$" ) && Regex.IsMatch( shipZone, "^[0-9]+$" ) ) {
									Dictionary<string, object> sz = new Dictionary<string, object>();
									sz.Add( "weight", weight );
									sz.Add( "shipZone", shipZone );
									sz.Add( "cost", cost );
									using( SqlCommand cmd = new SqlCommand( @"insert into shipZone (zoneId,rate,weight,shipZone,cost,VerCol)
									values (newId(),@rateId,@weight,@zone,@cost,null)", cn, trns ) ) {
										cmd.Parameters.Add( "@rateId", SqlDbType.Int ).Value = rateId;
										cmd.Parameters.Add( "@weight", SqlDbType.Int ).Value = weight;
										cmd.Parameters.Add( "@zone", SqlDbType.Int ).Value = shipZone;
										cmd.Parameters.Add( "@cost", SqlDbType.Money ).Value = cost;
										cmd.ExecuteNonQuery();
									}
									columns.Add( cost );
								}
							}
							if( lastWeight.ToString() != weight ) {
								if( Regex.IsMatch( weight, "^[0-9]+$" ) && Regex.IsMatch( cost, "^([0-9.])+$" ) && Regex.IsMatch( shipZone, "^[0-9]+$" ) ) {
									if( columns.Count > 0 ) {
										if( columns[ 0 ].ToString().Length > 0 ) {
											lastWeight = Convert.ToInt32( weight );
											outputRateList.Add( columns );
										}
									}
								}
							}
						}
					}
					if( preview ) {
						trns.Rollback();
					} else {
						trns.Commit();
					}
				}
			}
			return outputRateList;
		}
		/// <summary>
		/// Imports one or more categories.
		/// </summary>
		/// <param name="preview">if set to <c>true</c> [preview].</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="categories">The categories.</param>
		/// <returns></returns>
		public static List<object> ImportCategories( bool preview, bool dupeMode, List<object> categories ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			List<object> outputCategoryList = new List<object>();
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trns = cn.BeginTransaction( "Import categories" ) ) {
					foreach( Dictionary<string, object> k in categories ) {
						outputCategoryList.Add( ImportCategory( ( Dictionary<string, object> )k, dupeMode, cn, trns ) );
					}
					if( preview ) {
						trns.Rollback();
					} else {
						trns.Commit();
					}
				}
			}
			return outputCategoryList;
		}
		/// <summary>
		/// Imports a category.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="cn">SQL Connection.</param>
		/// <param name="trns">SQL Transaction.</param>
		/// <returns></returns>
		public static List<object> ImportCategory( Dictionary<string, object> args, bool dupeMode, SqlConnection cn, SqlTransaction trns ) {
			List<object> j = new List<object>();
			/* must contain at least the primary key */
			if( ( !args.ContainsKey( "categoryName" ) ) || ( !args.ContainsKey( "itemNumber" ) ) ) {
				return j;
			}
			if( args[ "itemNumber" ].ToString() == "" || args[ "itemNumber" ] == null ) {
				return j;
			}
			try {
				using( SqlCommand cmd = new SqlCommand( @"insertCategory @categoryName,@itemNumber", cn, trns ) ) {
					cmd.Parameters.Add( "@categoryName", SqlDbType.VarChar ).Value = args.KeyOrDefault( "categoryName", "", true );
					cmd.Parameters.Add( "@itemNumber", SqlDbType.VarChar ).Value = args.KeyOrDefault( "itemNumber", "", true );
					using( SqlDataReader d = cmd.ExecuteReader() ) {
						if( d.HasRows ) {
							return ( List<object> )d.GetJsonArray( false )[ 0 ];
						}
					}
				}
			} catch( Exception e ) {
				String.Format( "importCategory threw an exception ==> {0}", e.Message ).Debug( 0 );
				return j;
			}
			return j;
		}
		/// <summary>
		/// Imports item Properties (not implemented).
		/// </summary>
		/// <param name="preview">if set to <c>true</c> [preview].</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static List<object> ImportProperties( bool preview, bool dupeMode, Dictionary<string, object> args ) {
			List<object> outputItemList = new List<object>();
			return outputItemList;
		}
		/// <summary>
		/// Imports one or more users (not implemented).
		/// </summary>
		/// <param name="preview">if set to <c>true</c> [preview].</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="items">The items.</param>
		/// <returns>List of erorrs that may have occured.</returns>
		public static List<object> ImportUsers( bool preview, bool dupeMode, List<object> items ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			List<object> outputItemList = new List<object>();
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trns = cn.BeginTransaction( "Import Users" ) ) {
					foreach( Dictionary<string, object> k in items ) {
						outputItemList.Add( ImportUser( ( Dictionary<string, object> )k, dupeMode, cn, trns ) );
					}
					if( preview ) {
						trns.Rollback();
					}
				}
			}
			return outputItemList;
		}
		/// <summary>
		/// Imports a user.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="cn">SQL Connection.</param>
		/// <param name="trns">SQL Transaction.</param>
		/// <returns></returns>
		public static Dictionary<string, object> ImportUser( Dictionary<string, object> args, bool dupeMode, SqlConnection cn, SqlTransaction trns ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			return j;
		}
		/// <summary>
		/// Imports one or more items.
		/// </summary>
		/// <param name="preview">if set to <c>true</c> [preview].</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="items">The items.</param>
		/// <returns></returns>
		public static List<object> ImportItems( bool preview, bool dupeMode, List<object> items ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			List<object> outputItemList = new List<object>();
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trns = cn.BeginTransaction( "Import Items" ) ) {
					foreach( Dictionary<string, object> k in items ) {
						outputItemList.Add( ImportItem( ( Dictionary<string, object> )k, dupeMode, cn, trns ) );
					}
					if( preview ) {
						trns.Rollback();
					} else {
						trns.Commit();
					}
				}
			}
			return outputItemList;
		}
		/// <summary>
		/// Parses CSV and XLS files for import.
		/// </summary>
		/// <param name="args">{importFilePath:path,sheetNumber:XLS sheet number,ignoreBlanks:true/false}</param>
		/// <returns></returns>
		public static Dictionary<string, object> ImportWizard( Dictionary<string, object> args ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			List<object> l = new List<object>();
			string importFilePath = "";
			bool ignoreBlanks = false;
			j.Add( "error", 0 );
			j.Add( "description", "" );
			if( !args.ContainsKey( "importFilePath" ) ) {
				j[ "error" ] = -2;
				j[ "description" ] = "Missing key: importFilePath";
				return j;
			} else {
				importFilePath = ( string )args[ "importFilePath" ];
			}
			int sheetNumber;
			if( !int.TryParse( args[ "sheetNumber" ].ToString(), out sheetNumber ) ) {
				sheetNumber = 0;
			}
			if( args.ContainsKey( "ignoreBlanks" ) ) {
				ignoreBlanks = ( bool )args[ "ignoreBlanks" ];
			}
			try {
				if( !File.Exists( importFilePath ) ) {
					Exception e = new Exception( "File not found:" + importFilePath );
					throw e;
				}
				OleDbConnection cn;
				OleDbCommand cmd;
				OleDbDataAdapter ad = new OleDbDataAdapter();
				DataSet ds = new DataSet();
				if( importFilePath.ToLower().EndsWith( ".xls" ) ) {
					string connection = "Provider=Microsoft.Jet.OLEDB.4.0;" +
					"Data Source=" + importFilePath + ";" +
					"Extended Properties='Excel 8.0;IMEX=1';";
					cn = new OleDbConnection( connection );
					cn.Open();
					DataTable sheets = cn.GetOleDbSchemaTable( System.Data.OleDb.OleDbSchemaGuid.Tables, null );
					if( sheetNumber > sheets.Rows.Count ) {
						Exception e = new Exception( "Only " + sheets.Rows.Count + " were found in the XLS file, but you selected sheet " + sheetNumber );
						throw e;
					}
					cmd = new OleDbCommand( "select * from [" + sheets.Rows[ sheetNumber ].ItemArray[ 2 ] + "]", cn );
				} else if( importFilePath.ToLower().EndsWith( ".csv" ) ) {
					string connection = "Provider=Microsoft.Jet.OLEDB.4.0;" +
					"Data Source=" + Path.GetDirectoryName( importFilePath ) + ";" +
					"Extended Properties='text;IMEX=1;HDR=Yes;FMT=Delimited(,)';";
					cn = new OleDbConnection( connection );
					cn.Open();
					cmd = new OleDbCommand( "select * from [" + Path.GetFileName( importFilePath ) + "]", cn );
				} else {
					Exception e = new Exception( "Unsupported file format." );
					throw e;
				}
				List<string[]> parse = new List<string[]>();
				using( OleDbDataReader d = cmd.ExecuteReader() ) {
					while( d.Read() ) {
						int h = d.FieldCount;
						List<string> lst = new List<string>();
						for( int x = 0; h > x; x++ ) {
							lst.Add( d.GetValue( x ).ToString() );
						}
						parse.Add( lst.ToArray() );
					}
				}
				if( cn.State == ConnectionState.Open ) {
					cn.Close();
				}
				j.Add( "parse", parse );
			} catch( Exception e ) {
				j[ "error" ] = -1;
				j[ "description" ] = e.Message;
			}
			return j;
		}
		/// <summary>
		/// Imports an item.
		/// </summary>
		/// <param name="args">The item arguments.</param>
		/// <param name="dupeMode">if set to <c>true</c> [dupe mode].</param>
		/// <param name="cn">SQL connection.</param>
		/// <param name="trns">SQL transaction.</param>
		/// <returns>List of item imported.</returns>
		public static List<object> ImportItem( Dictionary<string, object> args, bool dupeMode, SqlConnection cn, SqlTransaction trns ) {
			List<object> j = new List<object>();
			/* must contain at least the primary key */
			if( !args.ContainsKey( "itemNumber" ) ) {
				return j;
			}
			if( args[ "itemNumber" ].ToString() == "" || args[ "itemNumber" ] == null ) {
				return j;
			}
			try {
				string commandText = @"dbo.insertItem
				@itemNumber,@displayPrice,@reorderPoint,@BOMOnly,@itemHTML,@price,
				@salePrice,@wholeSalePrice, @isOnSale,@description,@shortCopy,
				@productCopy,@weight,@quantifier, @shortDescription, @freeShipping, 
				@formName,@keywords, @searchPriority, @workCreditValue, @noTax, 
				@deleted, @removeAfterPurchase,@parentItemNumber,@allowPreorders, @inventoryOperator,
				@inventoryRestockOnFlagId,@itemIsConsumedOnFlagId,@inventoryDepletesOnFlagId,@revenueAccount,
				@ratio,@highThreshold,@expenseAccount,@inventoryAccount,
				@COGSAccount,@SKU,@itemType,@averageCost,@dupeMode";
				using( SqlCommand cmd = new SqlCommand( commandText, cn, trns ) ) {
					cmd.Parameters.Add( "@itemNumber", SqlDbType.Variant ).Value = args.KeyOrDefault( "itemNumber", "", dupeMode );
					cmd.Parameters.Add( "@displayPrice", SqlDbType.Variant ).Value = args.KeyOrDefault( "displayPrice", "", dupeMode );
					cmd.Parameters.Add( "@reorderPoint", SqlDbType.Variant ).Value = args.KeyOrDefault( "reorderPoint", 10, dupeMode );
					cmd.Parameters.Add( "@BOMOnly", SqlDbType.Variant ).Value = args.KeyOrDefault( "BOMOnly", true, dupeMode );
					cmd.Parameters.Add( "@itemHTML", SqlDbType.Variant ).Value = args.KeyOrDefault( "itemHTML", "", dupeMode );
					cmd.Parameters.Add( "@price", SqlDbType.Variant ).Value = args.KeyOrDefault( "price", 0, dupeMode );
					cmd.Parameters.Add( "@salePrice", SqlDbType.Variant ).Value = args.KeyOrDefault( "salePrice", 0, dupeMode );
					cmd.Parameters.Add( "@wholeSalePrice", SqlDbType.Variant ).Value = args.KeyOrDefault( "wholeSalePrice", 0, dupeMode );
					cmd.Parameters.Add( "@isOnSale", SqlDbType.Variant ).Value = args.KeyOrDefault( "isOnSale", false, dupeMode );
					cmd.Parameters.Add( "@description", SqlDbType.Variant ).Value = args.KeyOrDefault( "description", "", dupeMode );
					cmd.Parameters.Add( "@shortCopy", SqlDbType.Variant ).Value = args.KeyOrDefault( "shortCopy", "", dupeMode );
					cmd.Parameters.Add( "@productCopy", SqlDbType.Variant ).Value = args.KeyOrDefault( "productCopy", "", dupeMode );
					cmd.Parameters.Add( "@weight", SqlDbType.Variant ).Value = args.KeyOrDefault( "weight", 1, dupeMode );
					cmd.Parameters.Add( "@quantifier", SqlDbType.Variant ).Value = args.KeyOrDefault( "quantifier", "Each", dupeMode );
					cmd.Parameters.Add( "@shortDescription", SqlDbType.Variant ).Value = args.KeyOrDefault( "shortDescription", "", dupeMode );
					cmd.Parameters.Add( "@freeShipping", SqlDbType.Variant ).Value = args.KeyOrDefault( "freeShipping", false, dupeMode );
					cmd.Parameters.Add( "@formName", SqlDbType.Variant ).Value = args.KeyOrDefault( "formName", "NO FORM", dupeMode );
					cmd.Parameters.Add( "@keywords", SqlDbType.Variant ).Value = args.KeyOrDefault( "keywords", "", dupeMode );
					cmd.Parameters.Add( "@searchPriority", SqlDbType.Variant ).Value = args.KeyOrDefault( "searchPriority", 0, dupeMode );
					cmd.Parameters.Add( "@workCreditValue", SqlDbType.Variant ).Value = args.KeyOrDefault( "workCreditValue", 0, dupeMode );
					cmd.Parameters.Add( "@noTax", SqlDbType.Variant ).Value = args.KeyOrDefault( "noTax", false, dupeMode );
					cmd.Parameters.Add( "@deleted", SqlDbType.Variant ).Value = args.KeyOrDefault( "deleted", false, dupeMode );
					cmd.Parameters.Add( "@removeAfterPurchase", SqlDbType.Variant ).Value = args.KeyOrDefault( "removeAfterPurchase", false, dupeMode );
					cmd.Parameters.Add( "@parentItemNumber", SqlDbType.Variant ).Value = args.KeyOrDefault( "parentItemNumber", "", dupeMode );
					cmd.Parameters.Add( "@allowPreorders", SqlDbType.Variant ).Value = args.KeyOrDefault( "allowPreorders", Main.Site.new_item_allowPreorders, dupeMode );
					cmd.Parameters.Add( "@inventoryOperator", SqlDbType.Variant ).Value = args.KeyOrDefault( "inventoryOperator", Main.Site.default_inventoryOperator, dupeMode );
					cmd.Parameters.Add( "@inventoryRestockOnFlagId", SqlDbType.Variant ).Value = args.KeyOrDefault( "inventoryRestockOnFlagId", Main.Site.default_inventoryRestockOnFlagId, dupeMode );
					cmd.Parameters.Add( "@itemIsConsumedOnFlagId", SqlDbType.Variant ).Value = args.KeyOrDefault( "itemIsConsumedOnFlagId", Main.Site.default_itemIsConsumedOnFlagId, dupeMode );
					cmd.Parameters.Add( "@inventoryDepletesOnFlagId", SqlDbType.Variant ).Value = args.KeyOrDefault( "inventoryDepletesOnFlagId", Main.Site.default_inventoryDepletesOnFlagId, dupeMode );
					cmd.Parameters.Add( "@revenueAccount", SqlDbType.Variant ).Value = args.KeyOrDefault( "revenueAccount", Main.Site.default_revenueAccount, dupeMode );
					cmd.Parameters.Add( "@ratio", SqlDbType.Variant ).Value = args.KeyOrDefault( "ratio", 1, dupeMode );
					cmd.Parameters.Add( "@highThreshold", SqlDbType.Variant ).Value = args.KeyOrDefault( "highThreshold", 500, dupeMode );
					cmd.Parameters.Add( "@expenseAccount", SqlDbType.Variant ).Value = args.KeyOrDefault( "expenseAccount", Main.Site.default_expenseAccount, dupeMode );
					cmd.Parameters.Add( "@inventoryAccount", SqlDbType.Variant ).Value = args.KeyOrDefault( "inventoryAccount", Main.Site.default_inventoryAccount, dupeMode );
					cmd.Parameters.Add( "@COGSAccount", SqlDbType.Variant ).Value = args.KeyOrDefault( "COGSAccount", Main.Site.default_inventoryCOGSAccount, dupeMode );
					cmd.Parameters.Add( "@SKU", SqlDbType.Variant ).Value = args.KeyOrDefault( "SKU", "", dupeMode );
					cmd.Parameters.Add( "@itemType", SqlDbType.Variant ).Value = args.KeyOrDefault( "itemType", 0, dupeMode );
					cmd.Parameters.Add( "@averageCost", SqlDbType.Variant ).Value = args.KeyOrDefault( "averageCost", 0, dupeMode );
					cmd.Parameters.Add( "@dupeMode", SqlDbType.Int ).Value = Utilities.Iif( dupeMode, 0, 1 );
					using( SqlDataReader d = cmd.ExecuteReader() ) {
						if( d.HasRows ) {
							return ( List<object> )d.GetJsonArray( false )[ 0 ];
						}
					}
				}
				return j;
			} catch( Exception e ) {
				String.Format( "Immport item threw an exception ==> {0}", e.Message ).Debug( 0 );
				return j;
			}
		}
	}
}
