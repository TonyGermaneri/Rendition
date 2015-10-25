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
using System.Web;
using System.IO;
using Microsoft.SqlServer;
using Microsoft.SqlServer.Server;
namespace Rendition {
	public partial class Admin {
		/// <summary>
		/// Gets an order by a serial number in the order.  Formated for JSON.
		/// </summary>
		/// <param name="serialNumber">The serial number.</param>
		/// <returns></returns>
		public static Dictionary<string, object> GetSerial( string serialNumber ) {
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                return Commerce.Order.GetOrderBySerialNumber(serialNumber, cn, null).GetOrderJson();
            }
		}
        /// <summary>
		/// Gets an order by a shipment number in the order.  Formated for JSON.
        /// </summary>
		/// <param name="shipmentNumber">The shipment number.</param>
        /// <returns></returns>
        public static Dictionary<string,object> GetShipment(string shipmentNumber) {
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                return Commerce.Order.GetOrderByShipmentNumber(shipmentNumber, cn, null).GetOrderJson();
            }
        }
		/// <summary>
		/// Gets an order by order number.  Formated for JSON.
		/// </summary>
		/// <param name="orderNumber">The order number.</param>
		/// <returns></returns>
		public static Dictionary<string, object> GetOrder( string orderNumber ) {
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                return Commerce.Order.GetOrderJson(orderNumber, -1, null, cn, null);
            }
		}
		/// <summary>
		/// Stores the scanned image in the destination repository.
		/// </summary>
		/// <param name="scannedImage">The scanned image.</param>
		/// <param name="orderNumber">The order number.</param>
		/// <returns></returns>
		public static Dictionary<string, object> StoreScannedImage( string scannedImage, string orderNumber ) {
			( "FUNCTION /w fileSystem storeScannedImage" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
			if(HttpContext.Current==null){
				j.Add( "description", "No HTTP context found - scanned image not stored." );
				j.Add( "error", 0 );
				return j;
			}
			/* TODO: Add path variables to storeScannedImage and related functions*/
			string source_path = HttpContext.Current.Server.MapPath( "~/temp" );
			if( File.Exists( Path.Combine( source_path, scannedImage ) ) ) {
				/* try and move the scanned image to the final directory and name it the orderNumber+ext */
				string target_path = HttpContext.Current.Server.MapPath( "~/scan" );
				if( !Directory.Exists( target_path ) ) {
					Directory.CreateDirectory( target_path );
				}
				string ext = Path.GetExtension( scannedImage );
				try {
					File.Move( Path.Combine( source_path, scannedImage ), Path.Combine( target_path, orderNumber + ext ) );
				} catch( Exception e ) {
					j.Add( "description", e.Message );
					j.Add( "error", -2 );
					return j;
				}
				j.Add( "description", "Using scan ~\\scan\\" + orderNumber + ext );
				j.Add( "file", orderNumber + ext );
				j.Add( "error", 0 );
			} else {
				j.Add( "description", "Scanned image has been moved." );
				j.Add( "error", -1 );
			}
			return j;
		}
		/// <summary>
		/// Starts using a scanned image for a quote.
		/// </summary>
		/// <param name="scannedImage">The scanned image.</param>
		/// <param name="sessionId">The session id.</param>
		/// <returns></returns>
		public static Dictionary<string, object> InitScannedImage( string scannedImage, string sessionId ) {
			( "FUNCTION /w fileSystem initScannedImage" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
			string fileName = Path.GetFileName( scannedImage );
			string ext = Path.GetExtension( fileName );
			string source_path = HttpContext.Current.Server.MapPath( Main.Site.scanned_image_path );
			string target_path = HttpContext.Current.Server.MapPath( "~/temp" );
			if( File.Exists( Path.Combine( source_path, fileName ) ) ) {
				/* try and move the scanned image to the temp directory and name it the sessionId+ext */
				File.Move( Path.Combine( source_path, fileName ), Path.Combine( target_path, "order_" + sessionId + ext ) );
				j.Add( "description", "Using scan ~\\temp\\order_" + sessionId + ext );
				j.Add( "file", "order_" + sessionId + ext );
				j.Add( "error", 0 );
			} else {
				j.Add( "description", "Scanned image has been moved." );
				j.Add( "error", -1 );
			}
			return j;
		}
		/// <summary>
		/// Gets the next scanned order image.
		/// </summary>
		/// <returns>List of scanned images.</returns>
		public static List<object> GetNextScannedOrderImage() {
			( "FUNCTION /w fileSystem getNextScannedOrderImage" ).Debug( 10 );
			List<object> f = new List<object>();
			string source_path = HttpContext.Current.Server.MapPath( Main.Site.scanned_image_path );
			if( Directory.Exists( source_path ) ) {
				string[] files = Directory.GetFiles( source_path );
				foreach( string file in files ) {
					Dictionary<string, object> fd = new Dictionary<string, object>();
					fd.Add( "name", file );
					FileInfo info = new FileInfo( file );
					fd.Add( "size", info.Length );
					fd.Add( "creationTime", info.CreationTime );
					fd.Add( "lastAccessTime", info.LastAccessTime );
					fd.Add( "lastWriteTime", info.LastWriteTime );
					fd.Add( "objectType", info.Extension );
					if(
						info.Extension.ToLower() == ".jpg" ||
						info.Extension.ToLower() == ".png" ||
						info.Extension.ToLower() == ".gif"
					) {
						f.Add( fd );
					}
				}
				/* sort the list by date created */
				f.Sort( delegate( object f1, object f2 ) {
					Dictionary<string, object> a = ( Dictionary<string, object> )f1;
					Dictionary<string, object> b = ( Dictionary<string, object> )f2;
					DateTime d1 = Convert.ToDateTime( a[ "creationTime" ].ToString() );
					DateTime d2 = Convert.ToDateTime( b[ "creationTime" ].ToString() );
					return d2.CompareTo( d1 );
				} );
			}
			return f;
		}
		/// <summary>
		/// Returns the scanned image to the source repository.
		/// </summary>
		/// <param name="fileName">Name of the file.</param>
		/// <returns></returns>
		public static List<object> ReturnScannedImage( string fileName ) {
			( "FUNCTION /w fileSystem returnScannedImage" ).Debug( 10 );
			List<object> a = new List<object>();
			string target_path = HttpContext.Current.Server.MapPath( Main.Site.scanned_image_path );
			string source_path = HttpContext.Current.Server.MapPath( "~/temp" );
			try {
				string ext = Path.GetExtension( fileName );
				Guid newFileName = Guid.NewGuid();
				File.Move( Path.Combine( source_path, fileName ), Path.Combine( target_path, newFileName.ToString() + ext ) );
			} catch( Exception e ) {
				Dictionary<string, object> j = new Dictionary<string, object>();
				j.Add( "description", e.Message );
				j.Add( "error", -2 );
				return a;
			}
			return GetNextScannedOrderImage();
		}
		/// <summary>
		/// Adds a flag to multile lines, shipments or orders.
        ///  line status change Ids
        /// -11 = backordered/cancled line item qty
        /// This uses the column "returnToStock" to determine now many qty to reduce from the order
        /// and updates the inventory tables
        /// -3 = allocate inventory
        /// -5 = unallocate inventory
        /// -2 = consume inventory
        /// -4 = unconsume inventory *I don't know if this works, it should never be used anyway
		/// </summary>
		/// <param name="statusId">The status id.</param>
		/// <param name="objectType">Type of the object.</param>
		/// <param name="objectIds">The object ids.</param>
		/// <param name="comments">Comments.</param>
		/// <returns></returns>
		public static List<object> AddFlags( string statusId, string objectType, List<object> objectIds, string comments ) {
			( "FUNCTION addFlags" ).Debug( 10 );
			List<object> j = new List<object>();
			foreach( object objectId in objectIds ) {
				j.Add( Admin.AddFlag( statusId, objectType, objectId.ToString(), comments ) );
			}
			return j;
		}
		/// <summary>
		/// Allocates inventory for selected serialIds.
		/// </summary>
		/// <param name="serialIds">The serial ids.</param>
		/// <returns>List errors that may have occured.</returns>
		public static List<object> AllocateLines( List<object> serialIds ) {
			return LineStatusChange( -3, serialIds );
		}
		/// <summary>
		/// Unallocates inventory for selected serialIds.
		/// </summary>
		/// <param name="serialIds">The serial ids.</param>
		/// <returns>List errors that may have occured.</returns>
		public static List<object> UnallocateLines( List<object> serialIds ) {
			return LineStatusChange( -5, serialIds );
		}
		/// <summary>
		/// Allocates inventory for selected orderIds.
		/// </summary>
		/// <param name="orderIds">The order ids.</param>
		/// <returns>List errors that may have occured.</returns>
		public static List<object> AllocateOrders( List<object> orderIds ) {
			return OrderStatusChange( -3, orderIds );
		}
		/// <summary>
		/// Unallocates inventory for selected orderIds.
		/// </summary>
		/// <param name="orderIds">The order ids.</param>
		/// <returns>List errors that may have occured.</returns>
		public static List<object> UnallocateOrders( List<object> orderIds ) {
			return OrderStatusChange( -5, orderIds );
		}
		/// <summary>
		/// Sets inventory status to consumed by serialid.
		/// </summary>
		/// <param name="serialIds">The serial ids.</param>
		/// <returns>List errors that may have occured.</returns>
		public static List<object> ConsumeLines( List<object> serialIds ) {
			return LineStatusChange( -2, serialIds );
		}
		/// <summary>
		/// Sets inventory status to unconsumed by serialid.
		/// </summary>
		/// <param name="serialIds">The serial ids.</param>
		/// <returns>List errors that may have occured.</returns>
		public static List<object> UnconsumeLines( List<object> serialIds ) {
			return LineStatusChange( -4, serialIds );/*I don't know if this works, it should never be used anyway*/
		}
		/// <summary>
		/// Changes status of one or more serialIds.
		/// </summary>
		/// <param name="statusId">The status id.</param>
		/// <param name="serialIds">The serial ids.</param>
		/// <returns>List errors that may have occured.</returns>
		public static List<object> LineStatusChange( int statusId, List<object> serialIds ) {
			( "FUNCTION /W SP lineStatusChange" ).Debug( 10 );
			List<object> j = new List<object>();
			bool bigError = false;
			/* try to change status and set lastErrorId = 0 - if successfull lastErrorId will still be 0 */
			foreach( object serialId in serialIds ) {
				Dictionary<string, object> f = new Dictionary<string, object>();
				string desc = "";
				bool errorOccured = false;
				int error = 0;
				try {
                    using(SqlConnection cn = Site.CreateConnection(true, true)) {
                        cn.Open();
                        using(SqlCommand cmd = new SqlCommand(@"/* manual allocate Lines */
					update serial_line set lastFlagStatus = @flagTypeId, lastErrorId = 0 where serialId = @serialId;
					select lastErrorId, lastFlagStatus, lastFlagId, serialId, cartId from serial_line where serialId = @serialId", cn)) {
                            cmd.Parameters.Add("@flagTypeId", SqlDbType.Int).Value = statusId;
                            cmd.Parameters.Add("@serialId", SqlDbType.Int).Value = serialId;
                            using(SqlDataReader r = cmd.ExecuteReader()) {
                                if(r.Read()) {
                                    error = r.GetInt32(0);
                                    if(error != 0) {
                                        errorOccured = true;
                                        /*
                                            1 = item is out of stock
                                            2 = Never used
                                            3 = cannotOccurBeforeFlagId (as set in the flagTypes table)
                                            4 = cannotOccurAfterFlagId (as set in the flagTypes table)
                                            5 = cannot set to a status that it is already in (unless that state is 'comment')
                                            6 = orders are not allowed to change once they are canceled
                                            7 = orders are not allowed to change once they are closed
                                         */
                                        if(error == 1) {
                                            desc = "Item is out of stock.";
                                        } else if(error == 3) {
                                            desc = "Cannot occur before another status that has not yet occured.";
                                        } else if(error == 4) {
                                            desc = "Cannot occur after another status that has already occured.";
                                        } else if(error == 5) {
                                            desc = "Cannot change to the same status.";
                                        } else if(error == 6) {
                                            desc = "Cannot change status once the order is canceled.";
                                        } else if(error == 7) {
                                            desc = "Cannot change status once the order is closed.";
                                        }
                                    } else {
                                        desc = "";
                                    }
                                    f.Add("lastErrorId", error);
                                    f.Add("error", error);
                                    f.Add("lastFlagStatus", r.GetInt32(1));
                                    f.Add("lastFlagId", r.GetGuid(2));
                                    f.Add("serialId", r.GetInt32(3));
                                    f.Add("cartId", r.GetGuid(4));
                                    f.Add("description", desc);
                                } else {
                                    errorOccured = true;
                                    desc = "Wierd! > SerialId" + serialId + " does not exist.";
                                }
                            }
                        }
                    }
				} catch( Exception e ) {
					desc = e.Message;
					errorOccured = true;
				}
				if( errorOccured ) {
					bigError = true;
				}
				if( bigError ) {
					( "status change error" ).Debug( 7 );
				}
				j.Add( f );
			}
			return j;
		}
		/// <summary>
		/// Gets aggregates from a list of orderIds.
		/// </summary>
		/// <param name="_orderIds">The _order ids.</param>
		/// <returns></returns>
		public static Dictionary<string, object> GetOrdersTotal( List<object> _orderIds ) {
			/* provide a list of orderNumbers for the associated orderIds as well as the total
			 * grandTotal-paid of all the orders in the range */
			Dictionary<string, object> j = new Dictionary<string, object>();
			List<string> orderIds = new List<string>();
			List<object> orders = new List<object>();
			foreach( object orderId in _orderIds ) {
				int oid = -1;
				if( int.TryParse( ( string )orderId, out oid ) ) {
					orderIds.Add( ( string )orderId );
				}
			}
			/* 
			 * HACK: my theory here is that interjection cannot occur becuase I've throughly converted everything into a number
			 * am I wrong about this?  Who knows?  Another way to do this would be write an SP that takes my custom
			 * hash table object as a sql_variant (user defined table function) and then do a join on the order table
			 * far more time consuming but also far more secure
			 */
			string commandText = @"select orderId,orderNumber,grandTotal,paid,grandTotal-paid, userId
			from orders with (nolock) where orderId in (" + string.Join( ",", orderIds.ToArray() ) + ")";
			decimal runningTotal = 0;
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(commandText, cn)) {
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        while(d.Read()) {
                            Dictionary<string, object> o = new Dictionary<string, object>();
                            decimal owed = d.GetDecimal(4);
                            o.Add("orderId", d.GetInt32(0));
                            o.Add("orderNumber", d.GetString(1));
                            o.Add("grandTotal", d.GetDecimal(2));
                            o.Add("paid", d.GetDecimal(3));
                            o.Add("owed", owed);
                            o.Add("userId", d.GetInt32(5));
                            orders.Add(o);
                            runningTotal += owed;
                        }
                    }
                }
            }
			j.Add( "error", 0 );
			j.Add( "description", "" );
			j.Add( "total", runningTotal );
			j.Add( "orders", orders );
			return j;
		}
		/// <summary>
		/// Pays with credit card.
		/// </summary>
		/// <param name="cardName">Name of the card.</param>
		/// <param name="cardType">Type of the card.</param>
		/// <param name="cardNumber">The card number.</param>
		/// <param name="expMonth">The exp month.</param>
		/// <param name="expYear">The exp year.</param>
		/// <param name="secNumber">The sec number.</param>
		/// <param name="amount">The amount.</param>
		/// <param name="userId">The user id.</param>
		/// <param name="postingDate">The posting date.</param>
		/// <param name="orderIds">The order ids.</param>
		/// <returns></returns>
		public static Dictionary<string, object> PayWithCreditCard( string cardName, string cardType, string cardNumber, string expMonth,
			string expYear, string secNumber, string amount, string userId, string postingDate, List<object> orderIds ) {
			( "FUNCTION payWithCreditCard" ).Debug( 10 );
			Dictionary<string, object> j = null;
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trans = cn.BeginTransaction( "payWithCreditCard" ) ) {
					bool errorOccured = false;
					string desc = "";
					try {
						j = Commerce.MakePayment.PayWithCreditCard( cardName, cardType, cardNumber, expMonth, expYear,
                        secNumber, Convert.ToDecimal(amount), Convert.ToInt32(userId), Convert.ToDateTime(postingDate), orderIds, cn, trans);
					} catch( Exception e ) {
						desc = "CRITICAL WARNING! (NAME: " + cardName + ", userId: " + userId.ToString() + ", amount " + amount.ToString() +
						" ) A CREDIT CARD MAY HAVE BEEN CHARGED AND NO CREDIT GIVEN! \nReason -> " + e.Message;
						desc.Debug( 0 );
						errorOccured = true;
					}
					if( j == null ) { j = new Dictionary<string, object>(); }
					if( !errorOccured ) {
						trans.Commit();
					} else {
						if( j.ContainsKey( "error" ) ) {
							j.Remove( "error" );
						}
						if( j.ContainsKey( "description" ) ) {
							j.Remove( "description" );
						}
						j.Add( "error", -1 );
						j.Add( "description", desc );
						trans.Rollback();
					}
				}
			}
			return j;
		}
		/// <summary>
		/// Pays with check.
		/// </summary>
		/// <param name="routingNumber">The routing number.</param>
		/// <param name="checkNumber">The check number.</param>
		/// <param name="bankAccountNumber">The bank account number.</param>
		/// <param name="notes">The notes.</param>
		/// <param name="amount">The amount.</param>
		/// <param name="userId">The user id.</param>
		/// <param name="postingDate">The posting date.</param>
		/// <param name="orderIds">The order ids.</param>
		/// <returns></returns>
		public static Dictionary<string, object> PayWithCheck( string routingNumber, string checkNumber, string bankAccountNumber,
			string notes, string amount, string userId, string postingDate, List<object> orderIds ) {
			Dictionary<string, object> j = null;
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trans = cn.BeginTransaction( "payWithCheck" ) ) {
					bool errorOccured = false;
					string desc = "";
					try {
						j = Commerce.MakePayment.PayWithCheck( routingNumber, checkNumber, bankAccountNumber, notes,
                        Convert.ToDecimal(amount), Convert.ToInt32(userId), Convert.ToDateTime(postingDate), orderIds, cn, trans);
					} catch( Exception e ) {
						desc = e.Message;
						errorOccured = true;
					}
					if( j == null ) { j = new Dictionary<string, object>(); }
					if( !errorOccured ) {
						trans.Commit();
					} else {
						if( j.ContainsKey( "error" ) ) {
							j.Remove( "error" );
						}
						if( j.ContainsKey( "description" ) ) {
							j.Remove( "description" );
						}
						j.Add( "error", -1 );
						j.Add( "description", desc );
						trans.Rollback();
					}
				}
			}
			return j;
		}
		/// <summary>
		/// Pays with wire.
		/// </summary>
		/// <param name="swift">The swift.</param>
		/// <param name="bankName">Name of the bank.</param>
		/// <param name="routingTransitNumber">The routing transit number.</param>
		/// <param name="amount">The amount.</param>
		/// <param name="userId">The user id.</param>
		/// <param name="postingDate">The posting date.</param>
		/// <param name="orderIds">The order ids.</param>
		/// <returns></returns>
		public static Dictionary<string, object> PayWithWire( string swift, string bankName, string routingTransitNumber,
			string amount, string userId, string postingDate, List<object> orderIds ) {
			Dictionary<string, object> j = null;
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trans = cn.BeginTransaction( "payWithWire" ) ) {
					bool errorOccured = false;
					string desc = "";
					try {
						j = Commerce.MakePayment.PayWithWire( swift, bankName, routingTransitNumber,
                        Convert.ToDecimal(amount), Convert.ToInt32(userId), Convert.ToDateTime(postingDate), orderIds, cn, trans);
					} catch( Exception e ) {
						desc = e.Message;
						errorOccured = true;
					}
					if( j == null ) { j = new Dictionary<string, object>(); }
					if( !errorOccured ) {
						trans.Commit();
					} else {
						if( j.ContainsKey( "error" ) ) {
							j.Remove( "error" );
						}
						if( j.ContainsKey( "description" ) ) {
							j.Remove( "description" );
						}
						j.Add( "error", -1 );
						j.Add( "description", desc );
						trans.Rollback();
					}
				}
			}
			return j;
		}
		/// <summary>
		/// Pays with pay pal (not implemented).
		/// </summary>
		/// <param name="payPalEmailAddress">The pay pal email Address.</param>
		/// <param name="amount">The amount.</param>
		/// <param name="userId">The user id.</param>
		/// <param name="postingDate">The posting date.</param>
		/// <param name="orderIds">The order ids.</param>
		/// <returns></returns>
		public static Dictionary<string, object> PayWithPayPal( string payPalEmailAddress,
			string amount, string userId, string postingDate, List<object> orderIds ) {
			Dictionary<string, object> j = null;
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trans = cn.BeginTransaction( "payWithPayPal" ) ) {
					bool errorOccured = false;
					string desc = "";
					try {
						j = Commerce.MakePayment.PayWithPayPal( payPalEmailAddress, Convert.ToDecimal( amount ),
                        Convert.ToInt32(userId), Convert.ToDateTime(postingDate), orderIds, cn, trans);
					} catch( Exception e ) {
						desc = e.Message;
						errorOccured = true;
					}
					if( j == null ) { j = new Dictionary<string, object>(); }
					if( !errorOccured ) {
						trans.Commit();
					} else {
						if( j.ContainsKey( "error" ) ) {
							j.Remove( "error" );
						}
						if( j.ContainsKey( "description" ) ) {
							j.Remove( "description" );
						}
						j.Add( "error", -1 );
						j.Add( "description", desc );
						trans.Rollback();
					}
				}
			}
			return j;
		}
		/// <summary>
		/// Pays with existing payment.
		/// </summary>
		/// <param name="paymentMethodIds">The list of paymentMethodIds.</param>
		/// <param name="amount">The amount.</param>
		/// <param name="userId">The userId.</param>
		/// <param name="postingDate">The posting date.</param>
		/// <param name="orderIds">The order ids.</param>
		/// <returns>{error:0,desc:"error description"}.</returns>
		public static Dictionary<string, object> PayWithExistingPaymentMethods( List<object> paymentMethodIds,
		string amount, string userId, string postingDate, List<object> orderIds ) {
			Dictionary<string, object> j = null;
			decimal _amount = 0;
			if( !decimal.TryParse( amount, out _amount ) ) {
				j.Add( "error", -2 );
				j.Add( "description", "Amount must be a decimal (e.g.: 12.94, 12 or 12.00)" );
				return j;
			}
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trans = cn.BeginTransaction( "payWithExistingPaymentMethods" ) ) {
					bool errorOccured = false;
					string desc = "";
					try {
						j = Commerce.MakePayment.PayWithExistingPaymentMethods( paymentMethodIds, _amount,
                        Convert.ToInt32(userId), Convert.ToDateTime(postingDate), orderIds, cn, trans);
					} catch( Exception e ) {
						desc = e.Message;
						errorOccured = true;
					}
					if( j == null ) { j = new Dictionary<string, object>(); }
					if( !errorOccured ) {
						trans.Commit();
					} else {
						if( j.ContainsKey( "error" ) ) {
							j.Remove( "error" );
						}
						if( j.ContainsKey( "description" ) ) {
							j.Remove( "description" );
						}
						j.Add( "error", -1 );
						j.Add( "description", desc );
						trans.Rollback();
					}
				}
			}
			return j;
		}
		/// <summary>
		/// Pays with cash.
		/// </summary>
		/// <param name="amount">The amount.</param>
		/// <param name="userId">The user id.</param>
		/// <param name="postingDate">The posting date.</param>
		/// <param name="orderIds">The order ids.</param>
		/// <returns></returns>
		public static Dictionary<string, object> PayWithCash( string amount, string userId, string postingDate, List<object> orderIds ) {
			Dictionary<string, object> j = null;
			decimal _amount = 0;
			if( !decimal.TryParse( amount, out _amount ) ) {
				j.Add( "error", -2 );
				j.Add( "description", "Amount must be a decimal (e.g.: 12.94, 12 or 12.00)" );
				return j;
			}
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trans = cn.BeginTransaction( "payWithCash" ) ) {
					bool errorOccured = false;
					string desc = "";
					try {
                        j = Commerce.MakePayment.PayWithCash(_amount, Convert.ToInt32(userId), Convert.ToDateTime(postingDate), orderIds, cn, trans);
					} catch( Exception e ) {
						desc = e.Message;
						errorOccured = true;
					}
					if( j == null ) { j = new Dictionary<string, object>(); }
					if( !errorOccured ) {
						trans.Commit();
					} else {
						if( j.ContainsKey( "error" ) ) {
							j.Remove( "error" );
						}
						if( j.ContainsKey( "description" ) ) {
							j.Remove( "description" );
						}
						j.Add( "error", -1 );
						j.Add( "description", desc );
						trans.Rollback();
					}
				}
			}
			return j;
		}
		/// <summary>
		/// Gets total amount remaning in a list of paymentMethodIds.
		/// </summary>
		/// <param name="paymentMethodIds">The payment method ids.</param>
		/// <returns>{error:0,desc:"error description",totalRemaning:decimal - total remaning on selected paymentMethods}</returns>
		public static Dictionary<string, object> GetPaymentsTotal( List<object> paymentMethodIds ) {
			decimal amount = 0;
			Dictionary<string, object> j = new Dictionary<string, object>();
			using( SqlCommand cmd = new SqlCommand() ) {
				List<SqlDataRecord> rec_paymentMethodIds = new List<SqlDataRecord>();
				SqlMetaData[] hashTable = { 
					new SqlMetaData("keyName",SqlDbType.VarChar,100),
					new SqlMetaData("keyValue",SqlDbType.Variant),
					new SqlMetaData("primary_key",SqlDbType.Bit),
					new SqlMetaData("dataType",SqlDbType.VarChar,50),
					new SqlMetaData("dataLength",SqlDbType.Int),
					new SqlMetaData("varCharMaxValue",SqlDbType.VarChar,-1)
				};
				foreach( string id in paymentMethodIds ) {
					SqlDataRecord rec = new SqlDataRecord( hashTable );
					rec.SetValue( 0, "paymentMethodId" );
					rec.SetValue( 1, id );
					rec.SetBoolean( 2, false );
					rec.SetString( 3, "uniqueidentifier" );
					rec.SetValue( 4, 32 );
					rec_paymentMethodIds.Add( rec );
				}
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    cmd.Connection = cn;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "dbo.getRemaningPaymentMethodIdsTotal";
                    cmd.Parameters.Add("@paymentMethodIds", SqlDbType.Structured);
                    cmd.Parameters["@paymentMethodIds"].Direction = ParameterDirection.Input;
                    if(rec_paymentMethodIds.Count == 0) {
                        string message = "You must select at least one payment method.";
                        message.Debug(7);
                        Exception ex = new Exception(message);
                        throw ex;
                    } else {
                        cmd.Parameters["@paymentMethodIds"].Value = rec_paymentMethodIds;
                    }
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        r.Read();
                        /* only returns a single row and a single column.  the sum of the remaning
                         * payments in the payment id list (just like the SP says) */
                        amount = r.GetDecimal(0);
                    }
                }
			}
			j.Add( "error", 0 );
			j.Add( "description", "" );
			j.Add( "totalRemaning", amount );
			return j;
		}
		/// <summary>
		/// Change the status of one or more orders.
		/// </summary>
		/// <param name="statusId">The status id.</param>
		/// <param name="orderIds">The order ids.</param>
		/// <returns></returns>
		public static List<object> OrderStatusChange( int statusId, List<object> orderIds ) {
			( "FUNCTION /W ADHOC orderStatusChange" ).Debug( 10 );
			List<object> j = new List<object>();
			List<object> serialIds = new List<object>();
			bool bigError = false;
			try {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    foreach(object orderId in orderIds) {
                        using(SqlCommand cmd = new SqlCommand("select serialId from cart with (nolock) where orderId = @orderId", cn)) {
                            cmd.Parameters.Add("@orderId", SqlDbType.Int).Value = orderId;
                            using(SqlDataReader r = cmd.ExecuteReader()) {
                                while(r.Read()) {
                                    serialIds.Add(r.GetInt32(0));
                                }
                            }
                        }
                    }
                    j.Add(LineStatusChange(statusId, serialIds));
                    foreach(List<object> l in j) {
                        foreach(Dictionary<string, object> f in l) {
                            if(f.ContainsKey("error")) {
                                if((int)f["error"] != 0) {
                                    bigError = true;
                                }
                            } else {
                                bigError = true;
                            }
                        }
                    }
                }
			} catch( Exception e ) {
				( "Exception Error in orderStatusChange:" + e.Message ).Debug( 1 );
				bigError = true;
			}
			if( bigError ) {
				( "orderStatusChange threw an error" ).Debug( 7 );
			}
			return j;
		}
	}
}
