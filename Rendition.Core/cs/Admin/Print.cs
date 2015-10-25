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
using System.IO;
namespace Rendition {
	public partial class Admin {
		/// <summary>
		/// Prints the order.
		/// </summary>
        /// <param name="args">{[orderNumber]:[Number],[shipmentNumber]:[Number],
        /// [quoteNumber]:[Number],[sessionId]:[Number],[Type]:[invoice,packingslip,quote] }</param>
		public static void PrintOrder( Dictionary<string, object> args ) {
			/* print 1 of 3 types of docs - quote, packing slip, invoice */
			( "FUNCTION /w fileResponse printOrder" ).Debug( 10 );
			string refId = "";
			string refType = "";
			string docType = "";
			string packingSlip = "";
			string invoice = "";
			string quote = "";
			/* find the form to print with */
			if( args.ContainsKey( "type" ) ) {
				docType = args[ "type" ].ToString();
			} else {
				docType = "invoice";
			}
			if( args.ContainsKey( "orderNumber" ) ) {
				refType = "orderNumber";
				refId = args[ "orderNumber" ].ToString();
			} else if( args.ContainsKey( "shipmentNumber" ) ) {
				refType = "shipmentNumber";
				refId = args[ "shipmentNumber" ].ToString();
				if( !args.ContainsKey( "type" ) ) {
					docType = "packingSlip";
				}
			} else if( args.ContainsKey( "quoteNumber" ) ) {
				refType = "sessionId";
				refId = args[ "sessionId" ].ToString();
				if( !args.ContainsKey( "type" ) ) {
					docType = "quote";
				}
			}
			/* find the user of this object */
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(@"select orderId,orderNumber,shipmentId,shipmentNumber,packingSlip,invoice,quote
			from orderPrintForms with (nolock) where " + refType + " = @refId", cn)) {
                    if(refType == "orderNumber") {
                        cmd.Parameters.Add("@refId", SqlDbType.VarChar).Value = refId;
                    } else if(refType == "shipmentNumber") {
                        cmd.Parameters.Add("@refId", SqlDbType.VarChar).Value = refId;
                    } else if(refType == "quoteNumber") {
                        cmd.Parameters.Add("@refId", SqlDbType.UniqueIdentifier).Value = new Guid(refId);
                    }
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        while(d.Read()) {
                            packingSlip = d.GetString(4);
                            invoice = d.GetString(5);
                            quote = d.GetString(6);
                        }
                    }
                }
            }
			string fnfMsg = "PDF Exception => File not found {0}, Type:{1}, Ref:{2}";
			if( docType == "quote" ) {
				if( File.Exists( quote ) ) {
					Print( quote, args );
				} else {
					String.Format(fnfMsg,quote,refType,refId).Debug(2);
					Print( Main.Site.defaultQuote, args );
				}
			} else if( docType == "packingSlip" ) {
				if( File.Exists( packingSlip ) ) {
					Print( packingSlip, args );
				} else {
					String.Format( fnfMsg, quote, refType, refId ).Debug( 2 );
					Print( Main.Site.defaultPackingSlip, args );
				}
			} else if( docType == "invoice" ) {
				if( File.Exists( invoice ) ) {
					Print( invoice, args );
				} else {
					String.Format( fnfMsg, quote, refType, refId ).Debug( 2 );
					Print( Main.Site.defaultInvoice, args );
				}
			}
			return;
		}
		/// <summary>
		/// Prints the specified doc type.
		/// </summary>
		/// <param name="refDoc">The ref doc.</param>
		/// <param name="queryArguments">The query arguments.</param>
		public static void Print( string refDoc, Dictionary<string, object> queryArguments ) {
			( "FUNCTION /w fileResponse print" ).Debug( 10 );
			bool attachment = false;
			if( queryArguments.ContainsKey( "attachment" ) ) {
				if( !bool.TryParse( queryArguments[ "attachment" ].ToString(), out attachment ) ) {
					attachment = false;
				}
			}
			Commerce.Pdf.Print( refDoc, queryArguments, attachment );
			return;
		}
	}
}
