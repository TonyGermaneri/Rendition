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
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using Microsoft.SqlServer.Server;
using System.Web;
using System.IO;
using System.Net;
namespace Rendition {
	public partial class Commerce {
		/// <summary>
		/// A refrence to an order associated with a payment.
		/// </summary>
		public class PaymentReference {
            #region Instance Properties
            /// <summary>
			/// The id of the refrence.  paymentMethodDetailId in paymentMethodsDetail.
			/// </summary>
            public Guid Id { get; internal set; }
			/// <summary>
			/// The payment this refrence belongs to.
			/// </summary>
            public Payment Payment { get; internal set; }
			/// <summary>
			/// The orderId associated with this reference.
			/// </summary>
            public int OrderId { get; internal set; }
			/// <summary>
			/// The amount paid towards this order by this payment.
			/// </summary>
            public decimal Amount { get; internal set; }
            /// <summary>
			/// Gets the order.
			/// </summary>
			/// <value>The order.</value>
			public Commerce.Order Order {
				get {
					return Commerce.Order.GetOrderByOrderId(this.OrderId);
				}
			}
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="PaymentReference"/> class.
			/// </summary>
			/// <param name="_id">The _id.</param>
			/// <param name="_payment">The _parent id.</param>
			/// <param name="_orderId">The _order id.</param>
			/// <param name="_amount">The _amount.</param>
			public PaymentReference(Guid _id, Payment _payment, int _orderId, decimal _amount){
				Id = _id;
				Payment = _payment;
				OrderId = _orderId;
				Amount = _amount;
            }
            #endregion
        }
		/// <summary>
		/// An existing payment and the orders the payment is related to related to.
		/// </summary>
		public class Payment {
            #region Instance Properties
            /// <summary>
            /// A list of orders and the amounts allocated.
            /// </summary>
            public List<PaymentReference> PaymentRefrences { get; internal set; }
            /// <summary>
            /// Gets a value indicating whether this instance is cash.
            /// </summary>
            /// <value><c>true</c> if this instance is cash; otherwise, <c>false</c>.</value>
            public bool IsCash {
                get {
                    return Cash;
                }
            }
            /// <summary>
            /// Gets a value indicating whether this instance is paypal.
            /// </summary>
            /// <value><c>true</c> if this instance is paypal; otherwise, <c>false</c>.</value>
            public bool IsPaypal {
                get {
                    return PayPalEmailAddress.Length > 0;
                }
            }
            /// <summary>
            /// Gets a value indicating whether this instance is a wire transfer.
            /// </summary>
            /// <value><c>true</c> if this instance is wire; otherwise, <c>false</c>.</value>
            public bool IsWire {
                get {
                    return SWIFT.Length > 0;
                }
            }
            /// <summary>
            /// Gets a value indicating whether this instance is a check.
            /// </summary>
            /// <value><c>true</c> if this instance is check; otherwise, <c>false</c>.</value>
            public bool IsCheck {
                get {
                    return CheckNumber.Length > 0;
                }
            }
            /// <summary>
            /// Gets a value indicating whether this instance is a credit card transaction.
            /// </summary>
            /// <value>
            /// 	<c>true</c> if this instance is credit card; otherwise, <c>false</c>.
            /// </value>
            public bool IsCreditCard {
                get {
                    return CardNumber.Length > 0;
                }
            }
            /// <summary>
            /// Gets the PayPal details for this payment.  Returns null if there are no details.
            /// </summary>
            /// <value>The pay pal.</value>
            public Commerce.PayPal PayPal {
                get {
                    if(IsPaypal) {
                        return new PayPal(PayPalEmailAddress);
                    } else {
                        return null;
                    }
                }
            }
            /// <summary>
            /// Gets the check details for this payment.  Returns null if there are no details.
            /// </summary>
            /// <value>The check.</value>
            public Commerce.Check Check {
                get {
                    if(IsCheck) {
                        return new Check(CheckNumber, RoutingNumber, BankAccountNumber, Notes);
                    } else {
                        return null;
                    }
                }
            }
            /// <summary>
            /// Gets the wire details for this payment.  Returns null if there are no details.
            /// </summary>
            /// <value>The wire.</value>
            public Commerce.Wire Wire {
                get {
                    if(IsWire) {
                        return new Wire(SWIFT, BankName, RoutingNumber);
                    } else {
                        return null;
                    }
                }
            }
            /// <summary>
            /// Gets the credit card details for this payment.  Returns null if there are no details.
            /// </summary>
            /// <value>The credit card.</value>
            public Commerce.CreditCard CreditCard {
                get {
                    if(IsCreditCard) {
                        return new CreditCard(CardType, CardNumber, CardName
                        , SecNumber, ExpMonth, ExpYear);
                    } else {
                        return null;
                    }
                }
            }
            /// <summary>
            /// The userId associated with this payment.
            /// </summary>
            public int UserId { get; internal set; }
            /// <summary>
            /// Gets the user associated with this payment.
            /// </summary>
            /// <value>The user.</value>
            public Commerce.User User {
                get {
                    return Commerce.Users.GetUserById(UserId);
                }
            }
            /// <summary>
			/// The session that created this payment.
			/// </summary>
            public Guid SessionId { get; internal set; }
			/// <summary>
			/// The addressId of the payment.
			/// </summary>
            public Guid AddressId { get; internal set; }
			/// <summary>
			/// The id of this payment.  paymentMethodId in dbo.paymentMethods.
			/// </summary>
            public Guid Id { get; internal set; }
			/// <summary>
			/// A value describing this payment.  For instance: "Credit Card".
			/// </summary>
            public string PaymentType { get; internal set; }
			/// <summary>
			/// Notes about the payment.
			/// </summary>
            public string Notes { get; internal set; }
			/// <summary>
			/// Payment amount.
			/// </summary>
			public decimal Amount;
            #endregion
            #region Private Instance Fields
            /* these fields are used to hold
             * database information
             * while it is transferd to 
             * another method */
            private string RoutingNumber;
			private string CheckNumber;
			private string BankAccountNumber;
			private string PayPalEmailAddress;
			private string SWIFT;
			private string BankName;
			private string RoutingTransitNumber;
			private bool Cash;
			private Guid GeneralLedgerInsertId;
			private bool PromiseToPay;
			private int PaymentRefId;
			private string CardName;
			private string CardType;
			private string CardNumber;
			private string ExpMonth;
			private string ExpYear;
			private string SecNumber;
            #endregion
            #region Instance Methods
            /// <summary>
			/// Addresse of this payment.  This uses the site connection without a transaction. 
			/// If you're using a conneciton besides site.cn, use the overload method to pass your
			/// connection and transaction.
			/// </summary>
			/// <returns>The Address associated with this payment.</returns>
			public Commerce.Address GetAddress() {
				return new Address(AddressId,null,null);
			}
			/// <summary>
			/// Addresse of this payment.
			/// </summary>
			/// <param name="cn">The connection being used.</param>
			/// <param name="trans">The transaction being used.</param>
			/// <returns>The Address associated with this payment.</returns>
			public Commerce.Address GetAddress(SqlConnection cn, SqlTransaction trans) {
				return new Address(AddressId,cn,trans);
			}
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Payment"/> class.
            /// </summary>
            /// <param name="paymentMethodId">The payment method id.</param>
			public Payment(Guid paymentMethodId){
                PaymentRefrences = new List<PaymentReference>();
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand(@"select p.paymentMethodId, paymentType, 
				cardName, cardType, cardNumber, expMonth, expYear, secNumber, userId, sessionId, 
				addressId, routingNumber, checkNumber, bankAccountNumber, payPalEmailAddress, swift, 
				bankName, routingTransitNumber, cash, notes, p.amount totalPayment, 
				generalLedgerInsertId, promiseToPay, paymentRefId, pd.paymentMethodDetailId, 
				pd.orderId, pd.amount from paymentMethods p with (nolock)
				inner join paymentMethodsDetail pd with (nolock) on p.paymentMethodId = pd.paymentMethodId
				where p.paymentMethodId = @paymentMethodId and not generalLedgerInsertId = '00000000-0000-0000-0000-000000000000';", cn)) {
                        cmd.Parameters.Add("@paymentMethodId", SqlDbType.UniqueIdentifier).Value = paymentMethodId;
                        using(SqlDataReader r = cmd.ExecuteReader()) {
                            int i = 0;
                            while(r.Read()) {
                                /* populate the parent object on the first row */
                                if(i == 0) {
                                    Id = r.GetGuid(0);
                                    PaymentType = r.GetString(1);
                                    CardName = r.GetString(2);
                                    CardType = r.GetString(3);
                                    CardNumber = r.GetString(4);
                                    ExpMonth = r.GetString(5);
                                    ExpYear = r.GetString(6);
                                    SecNumber = r.GetString(7);
                                    UserId = r.GetInt32(8);
                                    SessionId = r.GetGuid(9);
                                    AddressId = r.GetGuid(10);
                                    RoutingNumber = r.GetString(11);
                                    CheckNumber = r.GetString(12);
                                    BankAccountNumber = r.GetString(13);
                                    PayPalEmailAddress = r.GetString(14);
                                    SWIFT = r.GetString(15);
                                    BankName = r.GetString(16);
                                    RoutingTransitNumber = r.GetString(17);
                                    Cash = r.GetBoolean(18);
                                    Notes = r.GetString(19);
                                    Amount = r.GetDecimal(20);
                                    GeneralLedgerInsertId = r.GetGuid(21);
                                    PromiseToPay = r.GetBoolean(22);
                                    PaymentRefId = r.GetInt32(23);
                                }
                                PaymentRefrences.Add(new Commerce.PaymentReference(r.GetGuid(24), this, r.GetInt32(25), r.GetDecimal(26)));
                                i++;
                            }
                        }
                    }
                }
            }
            #endregion
        }
		/// <summary>
		/// Allows you to pay off orders (purchase/work orders)
		/// This is the only way to enter payments (credit records)
		/// Payments are not posted until you post them to the GL
		/// </summary>
		public static class MakePayment {
            #region Static Methods
            /// <summary>
			/// Pays with a credit card.
			/// </summary>
			/// <param name="cardName">Name on the card.</param>
			/// <param name="cardType">Type of card (not used or recorded).</param>
			/// <param name="cardNumber">The card number.</param>
			/// <param name="expMonth">The exp month (two digit).</param>
			/// <param name="expYear">The exp year (two digit).</param>
			/// <param name="secNumber">The security number.</param>
			/// <param name="amount">The amount.</param>
			/// <param name="userId">The userId.</param>
			/// <param name="postingDate">The posting date.</param>
			/// <param name="orderIds">The order ids.</param>
			/// <param name="cn">The sql connection (or null).</param>
			/// <param name="trans">The sql transaction (or null).</param>
			/// <returns>{error:0,desc:"error description"}.</returns>
			public static Dictionary<string, object> PayWithCreditCard( string cardName, string cardType, string cardNumber, string expMonth,
			string expYear, string secNumber, decimal amount, int userId, DateTime postingDate,
			List<object> orderIds, SqlConnection cn, SqlTransaction trans ) {
				List<int> intIds = orderIds.ConvertAll( delegate( object i ) {
					return Convert.ToInt32( i );
				} );
				Dictionary<string, object> j = new Dictionary<string, object>();
				Guid paymentMethodId = Guid.NewGuid();
				int error = 0;
				string description = "";
				Commerce.CreditCard card = new CreditCard( cardType, cardNumber, cardName, secNumber, expMonth, expYear );
				Commerce.Order ord = Commerce.Order.GetOrderByOrderId( intIds[ 0 ] );
				/* use the first order's bill to and ship to Address to validate the credit card */
				Dictionary<string, object> vt = Commerce.VirtualTerminal.ChargeCreditCard( ord.BillToAddress,
				ord.ShipToAddresses[ 0 ], card, amount, ord.SessionId, ord.OrderNumber + " Group", ord.PurchaseOrder + " Group", cn, trans );
				if( vt == null ) {
					string _msg = "Internal virtual terminal error.  Unable to create virtual terminal object.";
					j.Add( "error", -1754 );
					j.Add( "description", _msg );
					Exception e = new Exception( _msg );
					String.Format( "payWithCreditCard threw an exception ==>{0}", e.Message ).Debug( 3 );
					throw e;
				}
				error = Convert.ToInt32( vt[ "error" ].ToString() != "0" );/* 1 means error, 0 means no error */
				description = vt[ "description" ].ToString();
				if( error == 0 ) {
					/* update orders becuase the transaction was successful
					this posts the entry to the general ledger table */
					card.Insert( paymentMethodId, Guid.Empty, userId, Guid.Empty, -1, "", amount, postingDate, intIds, "", cn, trans );
					/* update the orders with the payment data */
					UpdateOrders( orderIds, amount, paymentMethodId, cn, trans );
				}
				j.Add( "paymentMethodId", paymentMethodId.ToString() );
				j.Add( "error", error );
				j.Add( "description", description );
				return j;
			}
			/// <summary>
			/// Pays with a wire transfer.
			/// </summary>
			/// <param name="swift">The SWIFT number.</param>
			/// <param name="bankName">Name of the bank.</param>
			/// <param name="routingTransitNumber">The routing transit number.</param>
			/// <param name="amount">The amount.</param>
			/// <param name="userId">The userId.</param>
			/// <param name="postingDate">The posting date.</param>
			/// <param name="orderIds">The order ids.</param>
			/// <param name="cn">The sql connection (or null).</param>
			/// <param name="trans">The sql transaction (or null).</param>
			/// <returns>{error:0,desc:"error description"}.</returns>
			public static Dictionary<string, object> PayWithWire( string swift, string bankName, string routingTransitNumber,
			decimal amount, int userId, DateTime postingDate, List<object> orderIds, SqlConnection cn, SqlTransaction trans ) {
				List<int> intIds = orderIds.ConvertAll( delegate( object i ) {
					return Convert.ToInt32( i );
				} );
				Dictionary<string, object> j = new Dictionary<string, object>();
				Guid paymentMethodId = Guid.NewGuid();
				Commerce.Wire wire = new Commerce.Wire( swift, bankName, routingTransitNumber );
				wire.Insert( paymentMethodId, userId, Guid.Empty, -1, "", amount, postingDate, intIds, "", cn, trans );
				/* update the orders with the payment data */
				UpdateOrders( orderIds, amount, paymentMethodId, cn, trans );
				j.Add( "paymentMethodId", paymentMethodId.ToString() );
				j.Add( "error", 0 );
				j.Add( "description", "" );
				return j;
			}
			/// <summary>
			/// Pays with cash.
			/// </summary>
			/// <param name="amount">The amount.</param>
			/// <param name="userId">The userId.</param>
			/// <param name="postingDate">The posting date.</param>
			/// <param name="orderIds">The order ids.</param>
			/// <param name="cn">The sql connection (or null).</param>
			/// <param name="trans">The sql transaction (or null).</param>
			/// <returns>{error:0,desc:"error description"}.</returns>
			public static Dictionary<string, object> PayWithCash( decimal amount, int userId, DateTime postingDate,
			List<object> orderIds, SqlConnection cn, SqlTransaction trans ) {
				List<int> intIds = orderIds.ConvertAll( delegate( object i ) {
					return Convert.ToInt32( i );
				} );
				Dictionary<string, object> j = new Dictionary<string, object>();
				Guid paymentMethodId = Guid.NewGuid();
				Commerce.Cash cash = new Commerce.Cash();
				cash.Insert( paymentMethodId, userId, Guid.Empty, -1, "", amount, postingDate, intIds, "", cn, trans );
				/* update the orders with the payment data */
				UpdateOrders( orderIds, amount, paymentMethodId, cn, trans );
				j.Add( "paymentMethodId", paymentMethodId.ToString() );
				j.Add( "error", 0 );
				j.Add( "description", "" );
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
			/// <param name="userId">The userId.</param>
			/// <param name="postingDate">The posting date.</param>
			/// <param name="orderIds">The order ids.</param>
			/// <param name="cn">The sql connection (or null).</param>
			/// <param name="trans">The sql transaction (or null).</param>
			/// <returns>{error:0,desc:"error description"}.</returns>
			public static Dictionary<string, object> PayWithCheck( string routingNumber, string checkNumber, string bankAccountNumber,
			string notes, decimal amount, int userId, DateTime postingDate, List<object> orderIds, SqlConnection cn, SqlTransaction trans ) {
				List<int> intIds = orderIds.ConvertAll( delegate( object i ) {
					return Convert.ToInt32( i );
				} );
				Dictionary<string, object> j = new Dictionary<string, object>();
				Guid paymentMethodId = Guid.NewGuid();
				Commerce.Check check = new Commerce.Check( checkNumber, routingNumber, bankAccountNumber, notes );
				check.Insert( paymentMethodId, userId, Guid.Empty, -1, "", amount, postingDate, intIds, "", cn, trans );
				/* update the orders with the payment data */
				UpdateOrders( orderIds, amount, paymentMethodId, cn, trans );
				j.Add( "paymentMethodId", paymentMethodId.ToString() );
				j.Add( "error", 0 );
				j.Add( "description", "" );
				return j;
			}
			/// <summary>
			/// Pays with pay pal.
			/// </summary>
			/// <param name="payPalEmailAddress">The pay pal email Address.</param>
			/// <param name="amount">The amount.</param>
			/// <param name="userId">The userId.</param>
			/// <param name="postingDate">The posting date.</param>
			/// <param name="orderIds">The order ids.</param>
			/// <param name="cn">The sql connection (or null).</param>
			/// <param name="trans">The sql transaction (or null).</param>
			/// <returns>{error:0,desc:"error description"}.</returns>
			public static Dictionary<string, object> PayWithPayPal( string payPalEmailAddress,
			decimal amount, int userId, DateTime postingDate, List<object> orderIds, SqlConnection cn, SqlTransaction trans ) {
				List<int> intIds = orderIds.ConvertAll( delegate( object i ) {
					return Convert.ToInt32( i );
				} );
				Dictionary<string, object> j = new Dictionary<string, object>();
				Guid paymentMethodId = Guid.NewGuid();
				Commerce.PayPal payPal = new Commerce.PayPal( payPalEmailAddress );
				payPal.Insert( paymentMethodId, userId, Guid.Empty, -1, "", amount, postingDate, intIds, "", cn, trans );
				/* update the orders with the payment data */
				UpdateOrders( orderIds, amount, paymentMethodId, cn, trans );
				j.Add( "paymentMethodId", paymentMethodId.ToString() );
				j.Add( "error", 0 );
				j.Add( "description", "" );
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
			/// <param name="cn">The sql connection (or null).</param>
			/// <param name="trans">The sql transaction (or null).</param>
			/// <returns>{error:0,desc:"error description"}.</returns>
			public static Dictionary<string, object> PayWithExistingPaymentMethods( List<object> paymentMethodIds,
			decimal amount, int userId, DateTime postingDate, List<object> orderIds,
			SqlConnection cn, SqlTransaction trans ) {
				int errorId = 0;
				string desc = "";
				List<int> intIds = orderIds.ConvertAll( delegate( object i ) {
					return Convert.ToInt32( i );
				} );
				Dictionary<string, object> j = new Dictionary<string, object>();
				/* before updating - check to ensure that there really is enouch left over on this paymentMethodId(s)
				 * to attach the desiered amount to the selected order
				 */
				using( SqlCommand cmd = new SqlCommand() ) {
					List<SqlDataRecord> rec_paymentMethodIds = new List<SqlDataRecord>();
					List<SqlDataRecord> rec_orderIds = new List<SqlDataRecord>();
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
					foreach( int id in intIds ) {
						SqlDataRecord rec = new SqlDataRecord( hashTable );
						rec.SetValue( 0, "orderId" );
						rec.SetValue( 1, id );
						rec.SetBoolean( 2, false );
						rec.SetString( 3, "int" );
						rec.SetValue( 4, 8 );
						rec_orderIds.Add( rec );
					}
					cmd.Connection = cn;
					cmd.Transaction = trans;
					cmd.CommandType = CommandType.StoredProcedure;
					/* this SP will return a single row with error, desc saying if the procedure was successfull.
					 * the SP sums the remaning total value left on the selected paymentMethods and compares
					 * it to the amount trying to be paid.  If the remaining amount is >= the amount trying to
					 * be paid the payments will be attached, if the remaining amount is < the amoun trying to
					 * be paid an error will be returned saying as much.
					 */
					cmd.CommandText = "dbo.attachPaymentMethods";
					cmd.Parameters.Add( "@amountTryingToBePaid", SqlDbType.Money ).Value = amount;
					cmd.Parameters.Add( "@paymentMethodIds", SqlDbType.Structured );
					cmd.Parameters[ "@paymentMethodIds" ].Direction = ParameterDirection.Input;
					if( rec_paymentMethodIds.Count == 0 ) {
						string message = "You must select at least one payment method.";
						message.Debug( 7 );
						Exception ex = new Exception( message );
						throw ex;
					} else {
						cmd.Parameters[ "@paymentMethodIds" ].Value = rec_paymentMethodIds;
					}
					cmd.Parameters.Add( "@orderIds", SqlDbType.Structured );
					cmd.Parameters[ "@orderIds" ].Direction = ParameterDirection.Input;
					if( rec_orderIds.Count == 0 ) {
						string message = "You must select at least one payment method.";
						message.Debug( 7 );
						Exception ex = new Exception( message );
						throw ex;
					} else {
						cmd.Parameters[ "@orderIds" ].Value = rec_orderIds;
					}
					using( SqlDataReader r = cmd.ExecuteReader() ) {
						/* batch 1 is the status */
						r.Read();
						Dictionary<string, object> s = new Dictionary<string, object>();
						errorId = r.GetInt32( 0 );
						desc = r.GetString( 1 );
						/* NOTE:  Addtional callback information for attaching payments to orders
						 * I don't really care about this stuff so I'm not going to write anything to capture it 
						 * but there is is for anyone who does want to capture it.
						 */
						/* batch 2 is the actual payment detail inserts (paymentMethodDetailId,paymentMethodId,refId,amount)*/
						/* batch 3 is the actual upated orders (orderId, paid) */
					}
				}
				if( errorId != 0 ) {
					j.Add( "error", errorId );
					j.Add( "description", desc );
				} else {
					j.Add( "error", 0 );
					j.Add( "description", "" );
				}
				return j;
			}
            #endregion
            #region Static Private Methods
            /// <summary>
			/// This method is used internally only
			/// Updates the orders payment amount. I was watching x-files S2E6:Ascension via Netflix instant watch when I wrote it.
			/// </summary>
			/// <param name="orderIds">The order ids.</param>
			/// <param name="amount">The amount to be paid across the selected orders, in sequential until amount param is used up.</param>
			/// <param name="paymentMethodId">The payment method id.</param>
			/// <param name="cn">The sql connection (or null).</param>
			/// <param name="trans">The sql transaction (or null).</param>
			private static void UpdateOrders( List<object> orderIds, decimal amount, Guid paymentMethodId, SqlConnection cn, SqlTransaction trans ) {
				List<int> intIds = orderIds.ConvertAll( delegate( object i ) {
					return Convert.ToInt32( i );
				} );
				List<Commerce.Order> orders = Commerce.Order.GetOrdersByOrderIds( intIds.ToArray(), cn, trans );
				decimal runningTotal = amount;
				foreach( Commerce.Order order in orders ) {
					if( amount > 0 ) {
						decimal amountToPay = order.GrandTotal - order.Paid;
						if( amount >= amountToPay ) {
							/* this order has now been paid for */
							using( SqlCommand cmd = new SqlCommand( @"update orders set paid = grandTotal where orderId = @orderId;
							/* add a comment */
							insert into objectFlags select 
							newId() as flagId,null as serialId,null as cartDetailId,
							null as fuserId,null as shipmentId,@orderId as orderId,0 as flagType,
							'A payment of '+cast(@amountPaid as varchar(50))+' was made paying this order off.' as comments,
							0 as userId, getDate() as addTime, null as VerCol;
							/* add a reference to this order, and how much of it was paid using this method */
							insert into paymentMethodsDetail
							select newid(),@paymentMethodId,@orderId,@amountPaid", cn, trans ) ) {
								/* find out what's left to be paid on this order */
								runningTotal -= amountToPay;/* subtract the running total */
								cmd.Parameters.Add( "@amountPaid", SqlDbType.Money ).Value = amountToPay;
								cmd.Parameters.Add( "@orderId", SqlDbType.Int ).Value = order.OrderId;
								cmd.Parameters.Add( "@paymentMethodId", SqlDbType.UniqueIdentifier ).Value = new Guid( paymentMethodId.ToString() );
								cmd.ExecuteNonQuery();
							}
						} else {
							/* this order has been partially paid for */
							using( SqlCommand cmd = new SqlCommand( @"update orders set paid = paid + @amountPaid where orderId = @orderId;
							/* add a comment */
							insert into objectFlags select 
							newId() as flagId,null as serialId,null as cartDetailId,
							null as fuserId,null as shipmentId,@orderId as orderId,0 as flagType,
							'A payment of '+cast(@amountPaid as varchar(50))+' was made partially paying for this order.' as comments,
							0 as userId, getDate() as addTime, null as VerCol;
							/* add a reference to this order, and how much of it was paid using this method */
							insert into paymentMethodsDetail
							select newid(),@paymentMethodId,@orderId,@amountPaid", cn, trans ) ) {
								cmd.Parameters.Add( "@amountPaid", SqlDbType.Money ).Value = amount;
								cmd.Parameters.Add( "@orderId", SqlDbType.Int ).Value = order.OrderId;
								cmd.Parameters.Add( "@paymentMethodId", SqlDbType.UniqueIdentifier ).Value = new Guid( paymentMethodId.ToString() );
								cmd.ExecuteNonQuery();
								runningTotal = 0;
							}
						}
					}
                }
            }
            #endregion
        }
		/// <summary>
		/// This class represents the validation of an accrued payment.  This system is setup using a set of checks and balances.
		/// In order for an order to be placed, there must be a matching payment method, even if the ammount = 0
		/// So a payment must be made before an order can be placed.  This class is a promise to pay based on the terms of the order 
		/// as specified in the placeOrder procedure or the users account settings.
		/// </summary>
		public class PromiseToPay {
            #region Instance Properties
            /// <summary>
			/// Name of the payment method.
			/// </summary>
			public string Name { get; internal set; }
			/// <summary>
			/// When an error occurs this will be set to somthing other than 0
			/// </summary>
            public int Error { get; internal set; }
			/// <summary>
			/// When an error occurs (error!=0) this wll describe the error
			/// </summary>
            public string Description { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="PromiseToPay"/> class.
			/// </summary>
			public PromiseToPay() {
				return;
			}
            #endregion
            #region Instance Methods
            /// <summary>
			/// Inserts the specified payment into paymentMethods.
			/// </summary>
			/// <param name="paymentMethodId">The payment method id.</param>
			/// <param name="userId">The user id.</param>
			/// <param name="sessionId">The session id.</param>
			/// <param name="termId">The term id.</param>
			/// <param name="reference">The reference.</param>
			/// <param name="amount">The amount.</param>
			/// <param name="postingDate">The posting date.</param>
			/// <param name="orderIds">The order ids.</param>
			/// <param name="notes">The notes.</param>
			/// <param name="cn">The connection being used.</param>
			/// <param name="trans">The transaction being used.</param>
			public void Insert( Guid paymentMethodId, int userId, Guid sessionId,
			int termId, string reference, decimal amount, DateTime postingDate, List<int> orderIds, string notes,
			SqlConnection cn, SqlTransaction trans ) {
                Name = "Promise To Pay";
				PaymentMethods.Insert( Name, paymentMethodId, Guid.Empty, userId, sessionId, termId, reference, amount, postingDate, orderIds,
				"", "", "", "", "", "", "", "", "", "", "", "", "", false, "Promise To Pay", true, cn, trans );
            }
            #endregion
        }
		/// <summary>
		/// represents a payment using a wire transfer
		/// </summary>
		public class Wire {
            #region Instance Properties
            /// <summary>
			/// Name of the payment method.
			/// </summary>
            public string Name { get; internal set; }
			/// <summary>
			/// SWIFT Number (no validation, only recorded)
			/// </summary>
            public string SWIFT { get; internal set; }
			/// <summary>
			/// Name of Bank (no validation, only recorded)
			/// </summary>
            public string BankName { get; internal set; }
			/// <summary>
			/// Routing Transit Number (no validation, only recorded)
			/// </summary>
            public string RoutingTransitNumber { get; internal set; }
			/// <summary>
			/// When an error occurs this will be set to somthing other than 0
			/// </summary>
            public int Error { get; internal set; }
			/// <summary>
			/// When an error occurs (error!=0) this wll describe the error
			/// </summary>
            public string Description { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Wire"/> class.
			/// </summary>
			/// <param name="_swift">SWIFT Number.</param>
			/// <param name="_bankName">Name of Bank.</param>
			/// <param name="_routingTransitNumber">Routing Transit Number.</param>
			public Wire( string _swift, string _bankName, string _routingTransitNumber ) {
                Name = "Wire Transfer";
				SWIFT = _swift;
				BankName = _bankName;
				RoutingTransitNumber = _routingTransitNumber;
				return;
			}
            #endregion
            #region Instance Methods
            /// <summary>
			/// Inserts the specified payment into paymentMethods.
			/// </summary>
			/// <param name="paymentMethodId">The payment method id.</param>
			/// <param name="userId">The user id.</param>
			/// <param name="sessionId">The session id.</param>
			/// <param name="termId">The term id.</param>
			/// <param name="reference">The reference.</param>
			/// <param name="amount">The amount.</param>
			/// <param name="postingDate">The posting date.</param>
			/// <param name="orderIds">The order ids.</param>
			/// <param name="notes">The notes.</param>
			/// <param name="cn">The connection being used.</param>
			/// <param name="trans">The transaction being used.</param>
			public void Insert( Guid paymentMethodId, int userId, Guid sessionId,
			int termId, string reference, decimal amount, DateTime postingDate, List<int> orderIds, string notes,
			SqlConnection cn, SqlTransaction trans ) {
				PaymentMethods.Insert( Name, paymentMethodId, Guid.Empty, userId, sessionId, termId, reference, amount, postingDate, orderIds,
				"", "", "", "", "", "", "", "", "", "", "", BankName, RoutingTransitNumber, false, notes, false, cn, trans );
            }
            #endregion
        }
		/// <summary>
		/// PayPal.  Not Implemented.
		/// </summary>
		public class PayPal {
            #region Instance Properties
            /// <summary>
			/// Name of the payment method.
			/// </summary>
            public string Name { get; internal set; }
			/// <summary>
			/// PayPal email
			/// </summary>
            public string PayPalEmail { get; internal set; }
			/// <summary>
			/// Notes
			/// </summary>
            public string Notes { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="PayPal"/> class.
			/// </summary>
			/// <param name="_payPalEmail">The _pay pal email.</param>
			public PayPal( string _payPalEmail ) {
				PayPalEmail = _payPalEmail;
				return;
			}
            #endregion
            #region Instance Methods
            /// <summary>
			/// Charges the amount.
			/// </summary>
			/// <param name="amountToCharge">The amount to charge.</param>
			/// <returns></returns>
			public Dictionary<string, object> ChargeAmount( decimal amountToCharge ) {
				/* TODO: Create the XHTML or whatever to interact with paypal.  anyone got an API manual? */
                Name = "Pay Pal";
				Dictionary<string, object> j = new Dictionary<string, object>();
				return j;
			}
			/// <summary>
			/// Inserts the specified payment into paymentMethods.
			/// </summary>
			/// <param name="paymentMethodId">The payment method id.</param>
			/// <param name="userId">The user id.</param>
			/// <param name="sessionId">The session id.</param>
			/// <param name="termId">The term id.</param>
			/// <param name="reference">The reference.</param>
			/// <param name="amount">The amount.</param>
			/// <param name="postingDate">The posting date.</param>
			/// <param name="orderIds">The order ids.</param>
			/// <param name="notes">The notes.</param>
			/// <param name="cn">The connection being used.</param>
			/// <param name="trans">The transaction being used.</param>
			public void Insert( Guid paymentMethodId, int userId, Guid sessionId,
			int termId, string reference, decimal amount, DateTime postingDate, List<int> orderIds, string notes,
			SqlConnection cn, SqlTransaction trans ) {
				PaymentMethods.Insert( Name, paymentMethodId, Guid.Empty, userId, sessionId, termId, reference, amount, postingDate, orderIds,
				"", "", "", "", "", "", "", "", "", PayPalEmail, "", "", "", false, notes, false, cn, trans );
            }
            #endregion
        }
		/// <summary>
		/// repersents a payment of a check for an order
		/// </summary>
		public class Check {
            #region Instance Properties
            /// <summary>
			/// Name of the payment method.
			/// </summary>
            public string Name { get; internal set; }
			/// <summary>
			/// Check Number.
			/// </summary>
            public string CheckNumber { get; internal set; }
			/// <summary>
			/// Routing number.
			/// </summary>
            public string RoutingNumber { get; internal set; }
			/// <summary>
			/// Bank account number.
			/// </summary>
            public string BankAccountNumber { get; internal set; }
			/// <summary>
			/// Notes on the check.
			/// </summary>
            public string Notes { get; internal set; }
			/// <summary>
			/// When an error occurs this will be set to somthing other than 0
			/// </summary>
            public int Error { get; internal set; }
			/// <summary>
			/// When an error occurs (error!=0) this wll describe the error
			/// </summary>
            public string Description { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Check"/> class.
            /// </summary>
            /// <param name="_checkNumber">Check Number.</param>
            /// <param name="_routingNumber">Routing number.</param>
            /// <param name="_bankAccountNumber">Bank account number.</param>
            /// <param name="_notes">Notes on the check.</param>
			public Check( string _checkNumber, string _routingNumber, string _bankAccountNumber, string _notes ) {
                Name = "Check";
				CheckNumber = _checkNumber;
				RoutingNumber = _routingNumber;
				BankAccountNumber = _bankAccountNumber;
				Notes = _notes;
				return;
			}
            #endregion
            #region Instance Methods
            /// <summary>
			/// Inserts the specified payment into paymentMethods.
			/// </summary>
			/// <param name="paymentMethodId">The payment method id.</param>
			/// <param name="userId">The user id.</param>
			/// <param name="sessionId">The session id.</param>
			/// <param name="termId">The term id.</param>
			/// <param name="reference">The reference.</param>
			/// <param name="amount">The amount.</param>
			/// <param name="postingDate">The posting date.</param>
			/// <param name="orderIds">The order ids.</param>
			/// <param name="notes">The notes.</param>
			/// <param name="cn">The connection being used.</param>
			/// <param name="trans">The transaction being used.</param>
			public void Insert( Guid paymentMethodId, int userId, Guid sessionId,
			int termId, string reference, decimal amount, DateTime postingDate, List<int> orderIds, string notes,
			SqlConnection cn, SqlTransaction trans ) {
				PaymentMethods.Insert( Name, paymentMethodId, Guid.Empty, userId, sessionId, termId, reference, amount, postingDate, orderIds,
				"", "", "", "", "", "", RoutingNumber, CheckNumber, BankAccountNumber, "", "", "", "", false, notes, false, cn, trans );
            }
            #endregion
        }
		/// <summary>
		/// this class represents a payment of cash for an order
		/// </summary>
		public class Cash {
            #region Instance Properties
            /// <summary>
			/// Name of the payment method.
			/// </summary>
            public string Name { get; internal set; }
			/// <summary>
			/// Curreny Type
			/// </summary>
            public string Currency { get; internal set; }
			/// <summary>
			/// When an error occurs this will be set to somthing other than 0
			/// </summary>
            public int Error { get; internal set; }
			/// <summary>
			/// When an error occurs (error!=0) this wll describe the error
			/// </summary>
            public string Description { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Cash"/> class.
			/// </summary>
			public Cash() {
				return;
			}
            /// <summary>
			/// Initializes a new instance of the <see cref="Cash"/> class.
			/// </summary>
			/// <param name="_currency">The type of currency.</param>
			public Cash( string _currency ) {
                Name = "Cash";
				Currency = _currency;
				return;
			}
            #endregion
            #region Instance Methods
			/// <summary>
			/// Inserts the specified payment into the paymentMethods table.
			/// </summary>
			/// <param name="paymentMethodId">The payment method id.</param>
			/// <param name="userId">The user id.</param>
			/// <param name="sessionId">The session id.</param>
			/// <param name="termId">The term id.</param>
			/// <param name="reference">The reference.</param>
			/// <param name="amount">The amount.</param>
			/// <param name="postingDate">The posting date.</param>
			/// <param name="orderIds">The order ids.</param>
			/// <param name="notes">The notes.</param>
			/// <param name="cn">The connection being used.</param>
			/// <param name="trans">The transaction being used.</param>
			public void Insert( Guid paymentMethodId, int userId, Guid sessionId,
			int termId, string reference, decimal amount, DateTime postingDate, List<int> orderIds, string notes,
			SqlConnection cn, SqlTransaction trans ) {
				PaymentMethods.Insert( Name, paymentMethodId, Guid.Empty, userId, sessionId, termId, reference, amount, postingDate, orderIds,
				"", "", "", "", "", "", "", "", "", "", "", "", "", true, "", false, cn, trans );
            }
            #endregion
        }
		/// <summary>
		/// represents a payment using a credit card, also includes methods for charging the instatiated card via xhttp request 
		/// </summary>
		public class CreditCard {
            #region Instance Properties
            /// <summary>
			/// Name of the payment method.
			/// </summary>
            public string Name { get; internal set; }
			/// <summary>
			/// Card number.
			/// </summary>
            public string CardNumber { get; internal set; }
			/// <summary>
			/// Name on card.
			/// </summary>
            public string NameOnCard { get; internal set; }
			/// <summary>
			/// Security Code
			/// </summary>
            public string SecCode { get; internal set; }
			/// <summary>
			/// Experation Year (2 digits).
			/// </summary>
            public string ExpYear { get; internal set; }
			/// <summary>
			/// Experation Month (2 digits).
			/// </summary>
            public string ExpMonth { get; internal set; }
			/// <summary>
			/// Card Type (not recorded or used).
			/// </summary>
            public string CardType { get; internal set; }
			/// <summary>
			/// When an error occurs this will be set to somthing other than 0
			/// </summary>
            public int Error { get; internal set; }
			/// <summary>
			/// When an error occurs (error!=0) this wll describe the error
			/// </summary>
            public string Description { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="CreditCard"/> class.
			/// </summary>
			/// <param name="_cardType">Type of card (not recorded or used).</param>
			/// <param name="_cardNumber">The card number.</param>
			/// <param name="_nameOnCard">The name on the card.</param>
			/// <param name="_secCode">The security code.</param>
			/// <param name="_expMonth">The exp month (2 digits).</param>
			/// <param name="_expYear">The exp year (2 digits).</param>
			public CreditCard( string _cardType, string _cardNumber, string _nameOnCard, string _secCode, string _expMonth, string _expYear ) {
                Name = "Credit Card";
				CardType = _cardType;
				CardNumber = _cardNumber;
				NameOnCard = _nameOnCard;
				SecCode = _secCode;
				ExpMonth = _expMonth;
				ExpYear = _expYear;
				Error = 0;
				Description = "";
				return;
			}
            #endregion
            #region Instance Methods
            /// <summary>
			/// Inserts the specified payment into the paymentMethods table.
			/// </summary>
			/// <param name="paymentMethodId">The payment method id.</param>
			/// <param name="addressId">The Address id.</param>
			/// <param name="userId">The user id.</param>
			/// <param name="sessionId">The session id.</param>
			/// <param name="termId">The term id.</param>
			/// <param name="reference">The reference.</param>
			/// <param name="amount">The amount.</param>
			/// <param name="postingDate">The posting date.</param>
			/// <param name="orderIds">The order ids.</param>
			/// <param name="notes">The notes.</param>
			/// <param name="cn">The connection being used.</param>
			/// <param name="trans">The transaction being used.</param>
			public void Insert( Guid paymentMethodId, Guid addressId, int userId, Guid sessionId,
			int termId, string reference, decimal amount, DateTime postingDate, List<int> orderIds, string notes,
			SqlConnection cn, SqlTransaction trans ) {
				string crdNo = CardNumber;
				if( crdNo.Length > 10 ) {
					crdNo = "***" + CardNumber.Substring( 10 );
				}
				PaymentMethods.Insert( Name, paymentMethodId, addressId, userId, sessionId, termId, reference, amount, postingDate, orderIds,
				NameOnCard, CardType, crdNo, ExpMonth, ExpYear, "***", "", "", "", "", "", "", "", false, "", false, cn, trans );
            }
            #endregion
        }
		internal static class PaymentMethods {
            #region Static Methods
            public static void Insert( string paymentType, Guid paymentMethodId, Guid addressId, int userId, Guid sessionId,
			int termId, string reference, decimal amount, DateTime postingDate, List<int> orderIds,
			string cardName, string cardType, string cardNumber, string expMonth, string expYear,
			string secNumber, string routingNumber, string checkNumber, string bankAccountNumber,
			string payPalEmailAddress, string swift, string bankName, string routingTransitNumber,
			bool cash, string notes, bool _promiseToPay, SqlConnection cn, SqlTransaction trans ) {
				String.Format( "Place Order > insertPaymentMethod for userId: {0}, type: {1}", userId, paymentType ).Debug( 7 );
                try {
                    using(SqlCommand cmd=new SqlCommand()) {
                        List<SqlDataRecord> rowData=new List<SqlDataRecord>();
                        SqlMetaData[] hashTable= { 
						    new SqlMetaData("keyName",SqlDbType.VarChar,100),
						    new SqlMetaData("keyValue",SqlDbType.Variant),
						    new SqlMetaData("primary_key",SqlDbType.Bit),
						    new SqlMetaData("dataType",SqlDbType.VarChar,50),
						    new SqlMetaData("dataLength",SqlDbType.Int),
						    new SqlMetaData("varCharMaxValue",SqlDbType.VarChar,-1)
					    };
                        StringBuilder s=new StringBuilder();
                        foreach(int id in orderIds) {
                            SqlDataRecord rec=new SqlDataRecord(hashTable);
                            rec.SetValue(0,"orderId");
                            rec.SetValue(1,id);
                            rec.SetBoolean(2,false);
                            rec.SetString(3,"int");
                            rec.SetValue(4,8);
                            rowData.Add(rec);
                        }
                        cmd.Connection=cn;
                        cmd.Transaction=trans;
                        cmd.CommandType=CommandType.StoredProcedure;
                        cmd.CommandText="dbo.insertPaymentMethod";
                        cmd.Parameters.Add("@paymentMethodId",SqlDbType.UniqueIdentifier).Value=paymentMethodId;
                        cmd.Parameters.Add("@paymentType",SqlDbType.VarChar).Value=paymentType;
                        cmd.Parameters.Add("@cardName",SqlDbType.VarChar).Value=cardName;
                        cmd.Parameters.Add("@cardType",SqlDbType.VarChar).Value=cardType.MaxLength(25,false);
                        cmd.Parameters.Add("@cardNumber",SqlDbType.VarChar).Value=cardNumber;
                        cmd.Parameters.Add("@expMonth",SqlDbType.VarChar).Value=expMonth;
                        cmd.Parameters.Add("@expYear",SqlDbType.VarChar).Value=expYear;
                        cmd.Parameters.Add("@secNumber",SqlDbType.VarChar).Value=secNumber;
                        cmd.Parameters.Add("@userId",SqlDbType.Int).Value=userId;
                        cmd.Parameters.Add("@sessionId",SqlDbType.UniqueIdentifier).Value=sessionId;
                        cmd.Parameters.Add("@addressId",SqlDbType.UniqueIdentifier).Value=addressId;
                        cmd.Parameters.Add("@routingNumber",SqlDbType.VarChar).Value="";
                        cmd.Parameters.Add("@checkNumber",SqlDbType.VarChar).Value="";
                        cmd.Parameters.Add("@bankAccountNumber",SqlDbType.VarChar).Value="";
                        cmd.Parameters.Add("@payPalEmailAddress",SqlDbType.VarChar).Value="";
                        cmd.Parameters.Add("@swift",SqlDbType.VarChar).Value="";
                        cmd.Parameters.Add("@bankName",SqlDbType.VarChar).Value="";
                        cmd.Parameters.Add("@routingTransitNumber",SqlDbType.VarChar).Value=routingTransitNumber;
                        cmd.Parameters.Add("@cash",SqlDbType.Bit).Value=cash;
                        cmd.Parameters.Add("@notes",SqlDbType.VarChar).Value=notes;
                        cmd.Parameters.Add("@termId",SqlDbType.Int).Value=termId;
                        cmd.Parameters.Add("@reference",SqlDbType.VarChar).Value=reference;
                        cmd.Parameters.Add("@amount",SqlDbType.Money).Value=amount;
                        cmd.Parameters.Add("@promiseToPay",SqlDbType.Bit).Value=_promiseToPay;
                        cmd.Parameters.Add("@orderIds",SqlDbType.Structured);
                        cmd.Parameters["@orderIds"].Direction=ParameterDirection.Input;
                        if(rowData.Count==0) {
                            cmd.Parameters["@orderIds"].Value=null;
                        } else {
                            cmd.Parameters["@orderIds"].Value=rowData;
                        }
                        cmd.ExecuteNonQuery();
                        cmd.Dispose();
                    }
                } catch(Exception ex) {
                    String.Format("Place Order > insertPaymentMethod exception:{0}",ex.Message).Debug(0);
                }
            }
            #endregion
        }
		/// <summary>
		/// This class is used for charging credit cards via HTTPWebRequest obejct.
		/// This class can be overridden using the onpaymentgateway event handler
		/// The table site_configration contains
		/// merchant_message_match - > the Regex pattern that matches the 
		/// merchant_message_match_index
		/// merchant_sucsess_match
		/// </summary>
		public static class VirtualTerminal {
            #region Static Methods
            /// <summary>
			/// internal method to insert virtual terminal history into the database.
			/// </summary>
			/// <param name="args">The <see cref="Rendition.PaymentGatewayEventArgs"/> instance containing the event data.</param>
			private static void InsertPaymentHistory( PaymentGatewayEventArgs args ) {
				( "FUNCTION insertPaymentHistory /w SP dbo.insertVTTransaction > Write transaction details" ).Debug( 10 );
				string cmdString = @"dbo.insertVTTransaction @amount,@cardNumber,@secNumber,@authResponseCode,@authResponse,@addedby,@provider,
							@request,@billToCompany,@billToFirstName,@billToLastName,@billToAddress1,@billToAddress2,@billToCity,@billToState,@billToZIP,@billToCountry,
							@shipToCompany,@shipToFirstName,@shipToLastName,@shipToAddress1,@shipToAddress2,@shipToCity,@shipToState,@shipToZIP,@shipToCountry,@expDate,
							@sessionId";
				/* write the results of the transaction to the database, for postarity */
				SqlCommand cmd = null;
				if( args.SqlConnection != null ) {
					cmd = new SqlCommand( cmdString, args.SqlConnection, args.SqlTransaction );
				} else {
					cmd = new SqlCommand( cmdString, Site.SqlConnection );
				}
				cmd.Parameters.Add( "@amount", SqlDbType.Money ).Value = args.Amount.ToString();
				/* never record any credit card data in full */
				string safeCardNumber = "";
				safeCardNumber = args.Card.CardNumber.MaxLength( 25, true );
				if( safeCardNumber.Length > 5 ) {
					safeCardNumber = safeCardNumber.Substring( args.Card.CardNumber.Length - 4 );
				}
				cmd.Parameters.Add( "@cardNumber", SqlDbType.VarChar ).Value = "xxx-" + safeCardNumber;
				cmd.Parameters.Add( "@secNumber", SqlDbType.VarChar ).Value = "xxxx";
				cmd.Parameters.Add( "@authResponseCode", SqlDbType.VarChar ).Value = args.Success.ToString();
				cmd.Parameters.Add( "@authResponse", SqlDbType.VarChar ).Value = args.Message;
				cmd.Parameters.Add( "@addedby", SqlDbType.Int ).Value = Main.GetCurrentSession().UserId;
				cmd.Parameters.Add( "@provider", SqlDbType.VarChar ).Value = "";
				cmd.Parameters.Add( "@request", SqlDbType.VarChar ).Value = "";
				cmd.Parameters.Add( "@billToCompany", SqlDbType.VarChar ).Value = args.BillToAddress.Company.MaxLength( 100, true );
				cmd.Parameters.Add( "@billToFirstName", SqlDbType.VarChar ).Value = args.BillToAddress.FirstName.MaxLength( 100, true );
				cmd.Parameters.Add( "@billToLastName", SqlDbType.VarChar ).Value = args.BillToAddress.LastName.MaxLength( 100, true );
				cmd.Parameters.Add( "@billToAddress1", SqlDbType.VarChar ).Value = args.BillToAddress.Address1.MaxLength( 100, true );
				cmd.Parameters.Add( "@billToAddress2", SqlDbType.VarChar ).Value = args.BillToAddress.Address2.MaxLength( 25, true );
				cmd.Parameters.Add( "@billToCity", SqlDbType.VarChar ).Value = args.BillToAddress.City.MaxLength( 50, true );
				cmd.Parameters.Add( "@billToState", SqlDbType.VarChar ).Value = args.BillToAddress.State.MaxLength( 25, true );
				cmd.Parameters.Add( "@billToZIP", SqlDbType.VarChar ).Value = args.BillToAddress.Zip.MaxLength( 20, true );
				cmd.Parameters.Add( "@billToCountry", SqlDbType.VarChar ).Value = args.BillToAddress.Country.MaxLength( 50, true );
				cmd.Parameters.Add( "@shipToCompany", SqlDbType.VarChar ).Value = args.ShipToAddress.Company.MaxLength( 100, true );
				cmd.Parameters.Add( "@shipToFirstName", SqlDbType.VarChar ).Value = args.ShipToAddress.FirstName.MaxLength( 100, true );
				cmd.Parameters.Add( "@shipToLastName", SqlDbType.VarChar ).Value = args.ShipToAddress.LastName.MaxLength( 100, true );
				cmd.Parameters.Add( "@shipToAddress1", SqlDbType.VarChar ).Value = args.ShipToAddress.Address1.MaxLength( 100, true );
				cmd.Parameters.Add( "@shipToAddress2", SqlDbType.VarChar ).Value = args.ShipToAddress.Address2.MaxLength( 25, true );
				cmd.Parameters.Add( "@shipToCity", SqlDbType.VarChar ).Value = args.ShipToAddress.City.MaxLength( 50, true );
				cmd.Parameters.Add( "@shipToState", SqlDbType.VarChar ).Value = args.ShipToAddress.State.MaxLength( 25, true );
				cmd.Parameters.Add( "@shipToZIP", SqlDbType.VarChar ).Value = args.ShipToAddress.Zip.MaxLength( 20, true );
				cmd.Parameters.Add( "@shipToCountry", SqlDbType.VarChar ).Value = args.ShipToAddress.Country.MaxLength( 20, true );
				cmd.Parameters.Add( "@expDate", SqlDbType.VarChar ).Value = ( args.Card.ExpMonth.MaxLength( 2, true ) +
				Convert.ToString( args.Card.ExpYear ).MaxLength( 2, true ) ).MaxLength( 10, true );
				cmd.Parameters.Add( "@sessionId", SqlDbType.UniqueIdentifier ).Value = new Guid( args.OrderSession.ToString() );
				cmd.ExecuteNonQuery();
				cmd.Dispose();
			}
			/// <summary>
			/// Defaults gateway processor.  Used when there is no onpaymentgateway event handler specified
			/// </summary>
			/// <param name="args">The <see cref="Rendition.PaymentGatewayEventArgs"/> instance containing the event data.</param>
			private static void DefaultPaymentGatewayProcessor( ref PaymentGatewayEventArgs args ) {
				try {
					StringBuilder url = new StringBuilder( "" );
					string responseMessage = "";
					string strResult = "";

					/* build up the URL to send to the payment gateway URL defined in site_configuration */
					url.Append( Main.Site.merchant_auth_url );
					url.Replace( "{merchant_auth_name}", HttpUtility.UrlEncode( Main.Site.merchant_auth_name ) );
					url.Replace( "{merchant_auth_password}", HttpUtility.UrlEncode( Main.Site.merchant_auth_password ) );
					url.Replace( "{merchant_auth_type}", HttpUtility.UrlEncode( Main.Site.merchant_auth_type ) );

					url.Replace( "{shipToFirstName}", HttpUtility.UrlEncode( args.ShipToAddress.FirstName.Trim() ) );
					url.Replace( "{shipToLastName}", HttpUtility.UrlEncode( args.ShipToAddress.LastName.Trim() ) );
					url.Replace( "{shipToAddress}", HttpUtility.UrlEncode( args.ShipToAddress.Address1.Trim() ) );
					url.Replace( "{shipToAddress2}", HttpUtility.UrlEncode( args.ShipToAddress.Address2.Trim() ) );
					url.Replace( "{shipToCity}", HttpUtility.UrlEncode( args.ShipToAddress.City.Trim() ) );
					url.Replace( "{shipToState}", HttpUtility.UrlEncode( args.ShipToAddress.State.Trim() ) );
					url.Replace( "{shipToZip}", HttpUtility.UrlEncode( args.ShipToAddress.Zip.Trim() ) );
					url.Replace( "{shipToCountry}", HttpUtility.UrlEncode( args.ShipToAddress.Country.Trim() ) );
					url.Replace( "{shipToCompany}", HttpUtility.UrlEncode( args.ShipToAddress.Company.Trim() ) );

					url.Replace( "{billToFirstName}", HttpUtility.UrlEncode( args.BillToAddress.FirstName.Trim() ) );
					url.Replace( "{billToLastName}", HttpUtility.UrlEncode( args.BillToAddress.LastName.Trim() ) );
					url.Replace( "{billToAddress}", HttpUtility.UrlEncode( args.BillToAddress.Address1.Trim() ) );
					url.Replace( "{billToAddress2}", HttpUtility.UrlEncode( args.BillToAddress.Address2.Trim() ) );
					url.Replace( "{billToCity}", HttpUtility.UrlEncode( args.BillToAddress.City.Trim() ) );
					url.Replace( "{billToState}", HttpUtility.UrlEncode( args.BillToAddress.State.Trim() ) );
					url.Replace( "{billToZip}", HttpUtility.UrlEncode( args.BillToAddress.Zip.Trim() ) );
					url.Replace( "{billToCountry}", HttpUtility.UrlEncode( args.BillToAddress.Country.Trim() ) );
					url.Replace( "{billToCompany}", HttpUtility.UrlEncode( args.BillToAddress.Company.Trim() ) );
					url.Replace( "{amount}", args.Amount.ToString() );
					url.Replace( "{cardNumber}", HttpUtility.UrlEncode( args.Card.CardNumber.Trim() ) );
					url.Replace( "{experationMonth}", HttpUtility.UrlEncode( args.Card.ExpMonth.Trim() ) );
					url.Replace( "{experationYear}", HttpUtility.UrlEncode( args.Card.ExpYear.Trim() ) );
					url.Replace( "{securityCode}", HttpUtility.UrlEncode( args.Card.SecCode.Trim() ) );
					url.Replace( "{nameOnCard}", HttpUtility.UrlEncode( args.Card.NameOnCard.Trim() ) );

					string[] auth_array = url.ToString().Split( '?' );
					string auth_url = auth_array[ 0 ];
					string auth_data = auth_array[ 1 ];
					/* create stream */
					ASCIIEncoding encoding = new ASCIIEncoding();
					byte[] data = encoding.GetBytes( auth_data );
					/* create request */
					WebResponse objResponse;
					WebRequest objRequest = HttpWebRequest.Create( auth_url );
					objRequest.Method = "POST";
					objRequest.ContentType = "application/x-www-form-urlencoded";
					objRequest.ContentLength = data.Length;
					( "gateway processor" ).Debug( 5 );
					( "send request>" ).Debug( 5 );
					Stream stream = objRequest.GetRequestStream();
					/* send data */
					stream.Write( data, 0, data.Length );
					stream.Close();
					objResponse = objRequest.GetResponse();
					( "<get response" ).Debug( 5 );
					using( StreamReader sr = new StreamReader( objResponse.GetResponseStream() ) ) {
						strResult = sr.ReadToEnd();
						string[] matchIndexes = Main.Site.merchant_message_match_index.Split( ',' );
						int msgMatch1 = Convert.ToInt32( matchIndexes[ 0 ] );
						/* isolate the message to be displayed to the user in case of auth failure */
						Regex i = new Regex( Main.Site.merchant_message_match, RegexOptions.IgnoreCase | RegexOptions.Multiline );
						MatchCollection m;
						GroupCollection b;
						m = i.Matches( strResult );
						if( matchIndexes.GetUpperBound( 0 ) > 0 ) {
							int msgMatch2 = Convert.ToInt32( matchIndexes[ 1 ] );
							b = m[ msgMatch1 ].Groups;
							responseMessage = b[ msgMatch2 ].Value;
						} else {
							responseMessage = m[ msgMatch1 ].Value;
						}
						/* figure out if the auth was a failure */
						args.Success = Regex.IsMatch( strResult, Main.Site.merchant_sucsess_match );
						args.Message = responseMessage;
					}
					return;
				} catch( Exception e ) {
					( "gateway transaction error > " + e.Message ).Debug( 5 );
					args.Success = false;
					args.Message = e.Message;
					return;
				}
			}
			/// <summary>
			/// Charges the credit card using the internal CC processor function or the onpaymentgateway even handler.
			/// </summary>
			/// <param name="billToAddress">The bill to Address.</param>
			/// <param name="shipToAddress">The ship to Address.</param>
			/// <param name="card">The card.</param>
			/// <param name="amount">The amount.</param>
			/// <param name="orderSession">The order session.</param>
			/// <param name="orderNumber">The order number.</param>
			/// <param name="purchaseOrder">The purchase order.</param>
			/// <param name="cn">The sql connection (or null).</param>
			/// <param name="trans">The sql transaction (or null).</param>
			/// <returns>{error:0,desc:"error description"}.</returns>
			public static Dictionary<string, object> ChargeCreditCard(
			Address billToAddress, Address shipToAddress, CreditCard card,
			 decimal amount, Guid orderSession, string orderNumber, string purchaseOrder,
			 SqlConnection cn, SqlTransaction trans ) {
				( "FUNCTION /w SP,HTTPWebRequest chargeCreditCard" ).Debug( 10 );
				Dictionary<string, object> j = new Dictionary<string, object>();
				if( card.CardNumber.Length == 0 ) {
					j.Add( "error", -6 );
					j.Add( "description", "No card number provided" );
					return j;
				}
				if( card.NameOnCard.Length == 0 ) {
					j.Add( "error", -7 );
					j.Add( "description", "No card name provided" );
					return j;
				}
				if( card.ExpMonth.Length == 0 || card.ExpYear.Length == 0 ) {
					j.Add( "error", -8 );
					j.Add( "description", "No experation date provided." );
					return j;
				}
				/* everything seems ok as far as I can tell, pass it to the REAL judge.*/
				PaymentGatewayEventArgs args = new PaymentGatewayEventArgs( billToAddress, shipToAddress, card, amount, orderSession, orderNumber, purchaseOrder, cn, trans );
				/* try and use an event handler */
				Main.Site.raiseOnPaymentGateway( args );
				/* if preventDefault is not set in the arguments then try and use the internal payment gateway.*/
				if( !args.PreventDefault ) {
					DefaultPaymentGatewayProcessor( ref args );
				}
				/* record that this occured */
				InsertPaymentHistory( args );
				/* send the results back to the caller */
				if( args.Success ) {
					j.Add( "error", 0 );
					j.Add( "description", "" );
					return j;
				} else {
					j.Add( "error", -1 );
					j.Add( "description", args.Message );
					return j;
				}
            }
            #endregion
        }
	}
}
