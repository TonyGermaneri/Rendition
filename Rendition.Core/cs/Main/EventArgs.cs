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
using System.Collections;
using System.Linq;
using System.Text;
using System.Web;
using System.Data;
using System.Data.SqlClient;
namespace Rendition {
    #region EventArgs
    /// <summary>
	/// When an item renders this event is raised.  You can subscribe to this event and modify the image
	/// and return the image to the system in its modified state.
	/// </summary>
	public class RenderItemImageEventArgs:EventArgs {
		/// <summary>
		/// The image currently being modified.
		/// </summary>
		public System.Drawing.Bitmap Bitmap;
		/// <summary>
		/// The itemDetailId in the database.
		/// </summary>
		public Guid ItemDetailId;
		/// <summary>
		/// The templateId currently executing.
		/// </summary>
		public Guid TemplateId;
		/// <summary>
		/// The item being rendered or null when no item is involved (gallery images).
		/// </summary>
		public Commerce.Item Item;
		/// <summary>
		/// The session that is rendering the images or null when no session is involved (automatic).
		/// </summary>
		public Session Session;
		/// <summary>
		/// The HttpContext that is rendering the images or null when no HttpContext is involved (automatic).
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// Initializes a new instance of the <see cref="RenderItemImageEventArgs"/> class.
		/// </summary>
		/// <param name="bitmap">The bitmap.</param>
		/// <param name="itemDetailId">The item detail id.</param>
		/// <param name="templateId">The template id.</param>
		/// <param name="item">The item.</param>
		/// <param name="session">The session.</param>
		/// <param name="context">The context.</param>
		public RenderItemImageEventArgs(System.Drawing.Bitmap bitmap,Guid itemDetailId,Guid templateId,
		Commerce.Item item,Session session,HttpContext context) {
			this.Bitmap=bitmap;
			this.Session=session;
			this.HttpContext=context;
		}
	}
	/// <summary>
	/// Allows you to intercept, abort and replace credit card payments with your own method.
	/// </summary>
	public class PaymentGatewayEventArgs:EventArgs {
		/// <summary>
		/// The bill to Address of the credit card.
		/// </summary>
		public Commerce.Address BillToAddress;
		/// <summary>
		/// The ship to Address of the credit card.
		/// </summary>
		public Commerce.Address ShipToAddress;
		/// <summary>
		/// The credit card.
		/// </summary>
		public Commerce.CreditCard Card;
		/// <summary>
		/// IMPORTANT! Amount being charged.
		/// </summary>
		public decimal Amount;
		/// <summary>
		/// The session this order belongs to if any.  Guid.Empty is used when no order session is present.
		/// </summary>
		public Guid OrderSession;
		/// <summary>
		/// IMPORTANT! Was the transaction a success?  This is what you will need to set to tell the system the transaction was
		/// successfull.  If the transaction fails you can set this to false to prevent further transactions.
		/// </summary>
		public bool Success = false;
		/// <summary>
		/// The error message passed back to the client as to why the transaction has failed.
		/// </summary>
		public string Message = "";
		/// <summary>
		/// IMPORTANT! Failure to set prevent default to true will cause the default credit card method to execute.
		/// So if you've subscribed to this event you should always set this boolean to true.
		/// </summary>
		public bool PreventDefault = false;
		/// <summary>
		/// Order number if any or _VERY_ short description.  Should be unique (optional).
		/// </summary>
		public string OrderNumber = "";
		/// <summary>
		/// Purchase order associated with this transaction (optional).
		/// </summary>
		public string PurchaseOrder="";
		/// <summary>
		/// The SQL connection.  Any access to the site database MUST use this connection.
		/// </summary>
		public SqlConnection SqlConnection;
		/// <summary>
		/// The SQL transaction. Any access to the site database MUST use this transaction.
		/// </summary>
		public SqlTransaction SqlTransaction;
		/// <summary>
		/// Initializes a new instance of the <see cref="PaymentGatewayEventArgs"/> class.
		/// </summary>
		/// <param name="_billToAddress">The _bill to Address.</param>
		/// <param name="_shipToAddress">The _ship to Address.</param>
		/// <param name="_card">The _card.</param>
		/// <param name="_amount">The _amount.</param>
		/// <param name="_orderSession">The _order session.</param>
		/// <param name="_orderNumber">The _order number.</param>
		/// <param name="_purchaseOrder">The _purchase order.</param>
		/// <param name="_cn">The _CN.</param>
		/// <param name="_trans">The _trans.</param>
		public PaymentGatewayEventArgs(Commerce.Address _billToAddress,Commerce.Address _shipToAddress,
		Commerce.CreditCard _card,decimal _amount,Guid _orderSession,string _orderNumber, string _purchaseOrder, 
		SqlConnection _cn,SqlTransaction _trans) {
			BillToAddress=_billToAddress;
			ShipToAddress=_shipToAddress;
			Card=_card;
			Amount=_amount;
			OrderSession=_orderSession;
			OrderNumber = _orderNumber;
			PurchaseOrder = _purchaseOrder;
			SqlConnection=_cn;
			SqlTransaction=_trans;
		}
	}
	/// <summary>
	/// Allows you to create a discount on an order.  Examine the vairables passed to you such
	/// as cart, user or order and return an amount in discount to set the discount amount on the order.
	/// </summary>
	public class CalculateDiscountEventArgs:EventArgs {
		/// <summary>
		/// The cart content of the current quote/order
		/// </summary>
		public Commerce.Cart Cart;
		/// <summary>
		/// The session this quote/order occurs on.
		/// </summary>
		public Session Session;
		/// <summary>
		/// The user that this quote/order belongs to if any.
		/// </summary>
		public Commerce.User User;
		/// <summary>
		/// The order being recalculated if any.
		/// </summary>
		public Commerce.Order Order;
		/// <summary>
		/// The discount amount.
		/// </summary>
		public decimal Discount;
		/// <summary>
		/// Initializes a new instance of the <see cref="CalculateDiscountEventArgs"/> class.
		/// </summary>
		/// <param name="cart">The cart.</param>
		/// <param name="user">The user.</param>
		/// <param name="session">The session.</param>
		/// <param name="order">The order.</param>
		public CalculateDiscountEventArgs(Commerce.Cart cart,Commerce.User user,
		Session session,Commerce.Order order) {
			this.Cart=cart;
			this.User=user;
			this.Session=session;
			this.User=user;
			this.Order=order;
			this.Discount = 0;
		}
	}
	/// <summary>
	/// Allows you to take over the email creation process.  By defaul the site sends a very simplistic
	/// email to customers.  You can crate more elaborate emails by subscribing to this event and
	/// changing the event arguments.  It is also possible to abort emails using this event.
	/// </summary>
	public class CreateEmailEventArgs:EventArgs {
		/// <summary>
		/// The user being sent or requesting the email.
		/// </summary>
		public Commerce.User User = null;
		/// <summary>
		/// The item associated with this email (Stock events and email a friend)
		/// </summary>
		public Commerce.Item Item = null;
		/// <summary>
		/// The orders associated with this email or null.
		/// </summary>
		public Commerce.Order Order = null;
		/// <summary>
		/// The session associated with this email or null.
		/// </summary>
		public Session Session = null;
		/// <summary>
		/// The reply associated with this email or null.
		/// </summary>
		public Commerce.Reply Reply = null;
		/// <summary>
		/// The BlogEntry associated with this email or null.
		/// </summary>
		public object BlogEntry = null;
		/// <summary>
		/// The review associated with this email or null.
		/// </summary>
		public Commerce.Review Review = null;
		/// <summary>
		/// Who is this email being sent from?
		/// </summary>
		public string MailFrom = null;
		/// <summary>
		/// Who is this email being sent to?
		/// </summary>
		public string MailTo = null;
		/// <summary>
		/// Who gets a blind carbon copy?
		/// </summary>
		public string BCC = null;
		/// <summary>
		/// When set to true the email will be aborted and not entered into the email queue.
		/// </summary>
		public bool AbortEmail = false;
		/// <summary>
		/// What type of email is this?  (e.g.: "orderConfermation", "emailAFriend", "lostPassword", "shipmentUpdate"
		/// </summary>
		public string EmailType = null;
		/// <summary>
		/// Comment made by the user. (emailAFriend).
		/// </summary>
		public string UserComment = null;
		/// <summary>
		/// The subject of the email.
		/// </summary>
		public string Subject = null;
		/// <summary>
		/// The main email message.
		/// </summary>
		public string MessageBody = null;
		/// <summary>
		/// Shipment Update Arguments if this is a shipment update.
		/// </summary>
		public ShipmentUpdateArgs ShipmentUpdateArgs = null;
		/// <summary>
		/// Shipment Update Arguments if this is a shipment update.
		/// </summary>
        public Dictionary<string, object> Items = new Dictionary<string, object>();
        /// <summary>
        /// Initializes a new instance of the <see cref="CreateEmailEventArgs"/> class.
        /// </summary>
        /// <param name="emailType">Type of the email.</param>
        /// <param name="mailFrom">The mail from.</param>
        /// <param name="mailTo">The mail to.</param>
        /// <param name="bcc">The BCC.</param>
        /// <param name="user">The user.</param>
        /// <param name="session">The session.</param>
        /// <param name="order">The order.</param>
        /// <param name="item">The item.</param>
        /// <param name="userComment">The user comment.</param>
        /// <param name="shipmentupdateArgs">The shipmentupdate args.</param>
        /// <param name="reply">The reply.</param>
        /// <param name="blogEntry">The blog entry.</param>
        /// <param name="review">The review.</param>
		public CreateEmailEventArgs(string emailType, string mailFrom, string mailTo, string bcc,Commerce.User user,
		Session session,Commerce.Order order,Commerce.Item item,string userComment,ShipmentUpdateArgs shipmentupdateArgs,
		Commerce.Reply reply, object blogEntry, Commerce.Review review) {
			this.EmailType = emailType;
			this.User=user;
			this.Session=session;
			this.Item=item;
			this.Order=order;
			this.MailFrom=mailFrom;
			this.MailTo=mailTo;
			this.UserComment=userComment;
			this.BCC=bcc;
			this.AbortEmail=false;
			this.ShipmentUpdateArgs = shipmentupdateArgs;
			this.Reply = reply;
			this.BlogEntry = blogEntry;
			this.Review = review;
		}
        /// <summary>
        /// Initializes a new instance of the <see cref="CreateEmailEventArgs"/> class.
        /// </summary>
        /// <param name="emailType">Type of the email.</param>
        /// <param name="mailFrom">The mail from.</param>
        /// <param name="mailTo">The mail to.</param>
        /// <param name="bcc">The BCC.</param>
        /// <param name="user">The user.</param>
        /// <param name="session">The session.</param>
        /// <param name="order">The order.</param>
        /// <param name="item">The item.</param>
        /// <param name="userComment">The user comment.</param>
        /// <param name="shipmentupdateArgs">The shipmentupdate args.</param>
		public CreateEmailEventArgs(string emailType, string mailFrom, string mailTo, string bcc,Commerce.User user,
		Session session,Commerce.Order order,Commerce.Item item,string userComment,ShipmentUpdateArgs shipmentupdateArgs) {
			this.EmailType = emailType;
			this.User=user;
			this.Session=session;
			this.Item=item;
			this.Order=order;
			this.MailFrom=mailFrom;
			this.MailTo=mailTo;
			this.UserComment=userComment;
			this.BCC=bcc;
			this.AbortEmail=false;
			this.ShipmentUpdateArgs = shipmentupdateArgs;
		}
		/// <summary>
		/// Initializes a new instance of the <see cref="CreateEmailEventArgs"/> class.
		/// </summary>
		/// <param name="emailType">Type of the email.</param>
		/// <param name="mailFrom">The mail from.</param>
		/// <param name="mailTo">The mail to.</param>
		/// <param name="bcc">The BCC.</param>
		/// <param name="user">The user.</param>
		/// <param name="session">The session.</param>
		/// <param name="order">The order.</param>
		public CreateEmailEventArgs(string emailType, string mailFrom, string mailTo, string bcc,Commerce.User user,
		Session session,Commerce.Order order) {
			this.EmailType = emailType;
			this.User=user;
			this.Session=session;
			this.Order=order;
			this.MailFrom=mailFrom;
			this.MailTo=mailTo;
			this.BCC=bcc;
			this.AbortEmail=false;
		}
        /// <summary>
        /// Initializes a new instance of the <see cref="CreateEmailEventArgs"/> class.
        /// </summary>
        /// <param name="emailType">Type of the email.</param>
        /// <param name="mailFrom">The mail from.</param>
        /// <param name="mailTo">The mail to.</param>
        /// <param name="bcc">The BCC.</param>
        /// <param name="user">The user.</param>
        /// <param name="session">The session.</param>
        /// <param name="order">The order.</param>
        /// <param name="shipmentupdateArgs">The shipmentupdate args.</param>
		public CreateEmailEventArgs(string emailType, string mailFrom, string mailTo, string bcc,Commerce.User user,
		Session session,Commerce.Order order,ShipmentUpdateArgs shipmentupdateArgs) {
			this.EmailType = emailType;
			this.User=user;
			this.Session=session;
			this.Order=order;
			this.MailFrom=mailFrom;
			this.MailTo=mailTo;
			this.BCC=bcc;
			this.AbortEmail=false;
			this.ShipmentUpdateArgs = shipmentupdateArgs;
		}
		/// <summary>
		/// Initializes a new instance of the <see cref="CreateEmailEventArgs"/> class.
		/// </summary>
		/// <param name="emailType">Type of the email.</param>
		/// <param name="mailFrom">The mail from.</param>
		/// <param name="mailTo">The mail to.</param>
		/// <param name="bcc">The BCC.</param>
		/// <param name="user">The user.</param>
		/// <param name="session">The session.</param>
		/// <param name="item">The item.</param>
		/// <param name="review">The review.</param>
        public CreateEmailEventArgs(string emailType, string mailFrom, string mailTo, string bcc, Commerce.User user,
		Session session,Commerce.Item item,Commerce.Review review) {
			this.EmailType = emailType;
			this.User=user;
			this.Session=session;
			this.Item=item;
			this.MailFrom=mailFrom;
			this.MailTo=mailTo;
			this.BCC=bcc;
			this.AbortEmail=false;
			this.Review = review;
		}
        /// <summary>
        /// Initializes a new instance of the <see cref="CreateEmailEventArgs"/> class.
        /// </summary>
        /// <param name="emailType">Type of the email.</param>
        /// <param name="mailFrom">The mail from.</param>
        /// <param name="mailTo">The mail to.</param>
        /// <param name="bcc">The BCC.</param>
        /// <param name="user">The user.</param>
        /// <param name="session">The session.</param>
        /// <param name="item">The item.</param>
        /// <param name="items">The items.</param>
        public CreateEmailEventArgs(string emailType, string mailFrom, string mailTo, string bcc, Commerce.User user,
        Session session, Commerce.Item item, Dictionary<string, object> items) {
            this.EmailType = emailType;
            this.User = user;
            this.Session = session;
            this.Item = item;
            this.MailFrom = mailFrom;
            this.MailTo = mailTo;
            this.BCC = bcc;
            this.AbortEmail = false;
            this.Items = items;
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="CreateEmailEventArgs"/> class.
        /// </summary>
        /// <param name="emailType">Type of the email.</param>
        /// <param name="mailFrom">The mail from.</param>
        /// <param name="mailTo">The mail to.</param>
        /// <param name="bcc">The BCC.</param>
        /// <param name="user">The user.</param>
        /// <param name="session">The session.</param>
        /// <param name="reply">The reply.</param>
        /// <param name="blogEntry">The blog entry.</param>
		public CreateEmailEventArgs(string emailType, string mailFrom, string mailTo, string bcc,Commerce.User user,
		Session session,Commerce.Reply reply, object blogEntry) {
			this.EmailType = emailType;
			this.User=user;
			this.Session=session;
			this.MailFrom=mailFrom;
			this.MailTo=mailTo;
			this.BCC=bcc;
			this.AbortEmail=false;
			this.Reply = reply;
			this.BlogEntry = blogEntry;
		}
	}
    /// <summary>
	/// When a user is created this event is raised.  You can subscribe to this even to watch it happen.
	/// You cannot interact in any meaningful way other than to execute code related to the event.
	/// </summary>
	public class CreateUserEventArgs:EventArgs {
		/// <summary>
		/// The new user.
		/// </summary>
		public Commerce.User User;
		/// <summary>
		/// The session that created the user.
		/// </summary>
		public Session Session;
		/// <summary>
		/// The HttpContext of the session that created the user.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// Initializes a new instance of the <see cref="CreateUserEventArgs"/> class.
		/// </summary>
		/// <param name="user">The user.</param>
		/// <param name="session">The session.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trns">The TRNS.</param>
		/// <param name="context">The context.</param>
		public CreateUserEventArgs(Commerce.User user,Session session,SqlConnection cn,SqlTransaction trns,HttpContext context) {
			this.User=user;
			this.Session=session;
			this.HttpContext=context;
		}
	}
	/// <summary>
	/// When an item is created this event is raised.  You can subscribe to this even to watch it happen.
	/// You cannot interact in any meaningful way other than to execute code related to the event.
	/// </summary>
	public class CreateItemEventArgs:EventArgs {
		/// <summary>
		/// The item being created.
		/// </summary>
		public Commerce.Item Item;
		/// <summary>
		/// The session that created the item or null if none.
		/// </summary>
		public Session Session;
		/// <summary>
		/// The HttpContext of the seesion that created the item.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// Initializes a new instance of the <see cref="CreateItemEventArgs"/> class.
		/// </summary>
		/// <param name="item">The item.</param>
		/// <param name="session">The session.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trns">The TRNS.</param>
		/// <param name="context">The context.</param>
		public CreateItemEventArgs(Commerce.Item item,Session session,SqlConnection cn,SqlTransaction trns,HttpContext context) {
			this.Item=item;
			this.Session=session;
			this.HttpContext=context;
		}
	}
	/// <summary>
	/// At the end of HTTP request this event is raised.
	/// </summary>
	public class EndRequestEventArgs:EventArgs {
		/// <summary>
		/// The session ending the request.
		/// </summary>
		public Session Session;
		/// <summary>
		/// The HtttpContext of the session ending the request.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// Initializes a new instance of the <see cref="EndRequestEventArgs"/> class.
		/// </summary>
		/// <param name="session">The session.</param>
		/// <param name="context">The context.</param>
		public EndRequestEventArgs(Session session,HttpContext context) {
			this.Session=session;
			this.HttpContext=context;
		}
	}
    /// <summary>
    /// At the begining of each request this event is raised after the user has created a session.
    /// </summary>
    public class AfterAuthenticationEventArgs : EventArgs {
        /// <summary>
        /// The session starting the request.
        /// </summary>
        public Session Session;
        /// <summary>
        /// The HttpContext of the session.
        /// </summary>
        public HttpContext HttpContext;
        /// <summary>
        /// Initializes a new instance of the <see cref="BeginRequestEventArgs"/> class.
        /// </summary>
        /// <param name="session">The session.</param>
        /// <param name="context">The context.</param>
        public AfterAuthenticationEventArgs(Session session, HttpContext context) {
            this.Session = session;
            this.HttpContext = context;
        }
    }
	/// <summary>
	/// At the begining of each request this event is raised.
	/// </summary>
	public class BeginRequestEventArgs:EventArgs {
		/// <summary>
		/// The HttpContext.
		/// </summary>
		public HttpContext CurrentHttpContext;
        /// <summary>
        /// The HttpApplication.
        /// </summary>
        public HttpApplication HttpApplication;
        /// <summary>
        /// Let's the event procedure prevent the rest of the site from executing.
        /// </summary>
        public void PreventDefault() {
            AbortDefault = true;
        }
        /// <summary>
        /// Prevent the rest of the site from executing.
        /// </summary>
        internal bool AbortDefault = false;
        /// <summary>
        /// The eventargs sent to the begin request event from the http pipeline.
        /// </summary>
        public EventArgs NativeEventArgs;
        /// <summary>
        /// Initializes a new instance of the <see cref="BeginRequestEventArgs"/> class.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <param name="app">The app.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
		public BeginRequestEventArgs(HttpContext context, HttpApplication app, EventArgs e) {
            this.CurrentHttpContext = context;
            this.HttpApplication = app;
            this.NativeEventArgs = e;
		}
	}
	/// <summary>
	/// Occurs when a users starts the JavaScript user interface.
	/// </summary>
	public class UIInitArgs:EventArgs {
		/// <summary>
		/// Parameters to pass to the Rendition class before it starts up.
		/// </summary>
		public Dictionary<string,object> StartupParameters = new Dictionary<string,object>();
		/// <summary>
		/// Function to execute after the inital callback (before the UI loads).
		/// This is the function body, not the entire function.  There are two
		/// parameters [Rendition, parameters].  Rendition is the Rendition JS
		/// object, parameters is the JSON object passed back from the server
		/// during the init function.
		/// </summary>
		public List<string> StartupProcedures = new List<string>();
	}
	/// <summary>
	/// Shipment updated event occurs when a status of shipped occurs.
	/// </summary>
	public class ShipmentUpdateArgs:EventArgs {
		/// <summary>
		/// Order that was shipped
		/// </summary>
		public Commerce.Order Order;
		/// <summary>
		/// Id of the shipment update record
		/// </summary>
		public Guid Id;
		/// <summary>
		/// Shipment number
		/// </summary>
		public string ShipmentNumber;
		/// <summary>
		/// Tracking number
		/// </summary>
		public string Tracking;
		/// <summary>
		/// Date shipped
		/// </summary>
		public string DateShipped;
		/// <summary>
		/// Actual weight
		/// </summary>
		public string ActualWeight;
		/// <summary>
		/// Actual service
		/// </summary>
		public string ActualService;
		/// <summary>
		/// Actual cost
		/// </summary>
		public string ActualCost;
		/// <summary>
		/// Actual billed weight
		/// </summary>
		public string ActualBilledWeight;
		/// <summary>
		/// Package length
		/// </summary>
		public string PackageLength;
		/// <summary>
		/// Package width
		/// </summary>
		public string PackageWidth;
		/// <summary>
		/// Package height
		/// </summary>
		public string PackageHeight;
		/// <summary>
		/// Third party account number used if any
		/// </summary>
		public string ThirdPartyAccount;
		/// <summary>
		/// If this shipment was voided
		/// </summary>
		public string VoidStatus;
		/// <summary>
		/// Date this shipment update record was added
		/// </summary>
		public string AddDate;
		/// <summary>
		/// when true the default email is not sent
		/// </summary>
		public bool AbortDefaultEmail;
		/// <summary>
		/// The sql connection
		/// </summary>
		public SqlConnection SqlConnection;
		/// <summary>
		/// The sql transaction
		/// </summary>
		public SqlTransaction SqlTransaction;
		/// <summary>
		/// Initializes a new instance of the <see cref="ShipmentUpdateArgs"/> class.
		/// </summary>
		/// <param name="_order">The _order.</param>
		/// <param name="_id">The _id.</param>
		/// <param name="_shipmentNumber">The _shipment number.</param>
		/// <param name="_tracking">The _tracking.</param>
		/// <param name="_dateShipped">The _date shipped.</param>
		/// <param name="_actualWeight">The _actual weight.</param>
		/// <param name="_actualService">The _actual service.</param>
		/// <param name="_actualCost">The _actual cost.</param>
		/// <param name="_actualBilledWeight">The _actual billed weight.</param>
		/// <param name="_packageLength">Length of the _package.</param>
		/// <param name="_packageWidth">Width of the _package.</param>
		/// <param name="_packageHeight">Height of the _package.</param>
		/// <param name="_thirdPartyAccount">The _third party account.</param>
		/// <param name="_voidStatus">The _void status.</param>
		/// <param name="_addDate">The _add date.</param>
		public ShipmentUpdateArgs(Commerce.Order _order,Guid _id,string _shipmentNumber,string _tracking,string _dateShipped,
		string _actualWeight,string _actualService,string _actualCost,string _actualBilledWeight,string _packageLength,
		string _packageWidth,string _packageHeight,string _thirdPartyAccount,string _voidStatus,string _addDate) {
			Order = _order;
			Id = _id;
			ShipmentNumber=_shipmentNumber;
			Tracking=_tracking;
			DateShipped=_dateShipped;
			ActualWeight=_actualWeight;
			ActualService=_actualService;
			ActualCost=_actualCost;
			ActualBilledWeight=_actualBilledWeight;
			PackageLength=_packageLength;
			PackageWidth=_packageWidth;
			PackageHeight=_packageHeight;
			ThirdPartyAccount=_thirdPartyAccount;
			VoidStatus=_voidStatus;
			AddDate=_addDate;
		}
	}
	/// <summary>
	/// When a user logs off this event is raised. 
	/// </summary>
	public class LogOffEventArgs:EventArgs {
		/// <summary>
		/// The session of the user logging off.
		/// </summary>
		public Session Session;
		/// <summary>
		/// The HttpContext of the user logging off.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// Initializes a new instance of the <see cref="LogOffEventArgs"/> class.
		/// </summary>
		/// <param name="session">The session.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trns">The TRNS.</param>
		/// <param name="context">The context.</param>
		public LogOffEventArgs(Session session,SqlConnection cn,SqlTransaction trns,HttpContext context) {
			this.Session=session;
			this.HttpContext=context;
		}
	}
    public class RefreshSessionEventArgs : EventArgs {
        /// <summary>
        /// The selected order by value for this session.
        /// </summary>
        public int OrderBy;
        /// <summary>
        /// The selected list mode value for this session.
        /// </summary>
        public int ListMode;
        /// <summary>
        /// The selected records per page value for this session.
        /// </summary>
        public int RecordsPerPage;
        /// <summary>
        /// The referer value for this session.
        /// </summary>
        public string Referer;
        /// <summary>
        /// The user agent value for this session.
        /// </summary>
        public string UserAgent;
        /// <summary>
        /// The IP Address for this session.
        /// </summary>
        public string IpAddrress;
        /// <summary>
        /// The unique site id that this session is using.
        /// </summary>
        public Guid UniqueSiteId;
        /// <summary>
        /// When <c>true</c> then the default session refresh event will be aborted.
        /// When the default session is aborted the event handler must return a
        /// sessionId.
        /// </summary>
        public bool AbortDefault;
        /// <summary>
        /// When AbortDefault is <c>true</c> then this sessionId must be populated 
        /// by your custom session tracking event.
        /// </summary>
        public Guid SessionId;
        /// <summary>
        /// Initializes a new instance of the <see cref="RefreshSessionEventArgs"/> class.
        /// </summary>
        /// <param name="_OrderBy">The _ order by.</param>
        /// <param name="_ListMode">The _ list mode.</param>
        /// <param name="_RecordsPerPage">The _ records per page.</param>
        /// <param name="_Referer">The _ referer.</param>
        /// <param name="_UserAgent">The _ user agent.</param>
        /// <param name="_IpAddrress">The _ ip addrress.</param>
        /// <param name="_UniqueSiteId">The _ unique site id.</param>
        public RefreshSessionEventArgs(int _OrderBy, int _ListMode, int _RecordsPerPage, string _Referer, string _UserAgent,
            string _IpAddrress, Guid _UniqueSiteId, SqlConnection cn, SqlTransaction trns) {
            OrderBy = _OrderBy;
            ListMode = _ListMode;
            RecordsPerPage = _RecordsPerPage;
            Referer = _Referer;
            UserAgent = _UserAgent;
            IpAddrress = _IpAddrress;
            UniqueSiteId = _UniqueSiteId;
            AbortDefault = false;
        }
    }
	/// <summary>
	/// This event is raised when a user logs on to the system.
	/// </summary>
	public class LogOnEventArgs:EventArgs {
        /// <summary>
        /// When <c>true</c> then the session logged on successfully.  This is only used when <c>AbortDefault</c> is <c>true</c>.
        /// </summary>
        public bool LogonSuccess;
        /// <summary>
        /// Abort the default logon event.
        /// </summary>
        public bool AbortDefault;
		/// <summary>
		/// The session that logged on.
		/// </summary>
		public Session Session;
		/// <summary>
		/// The HttpContext of the session logging on.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// Initializes a new instance of the <see cref="LogOnEventArgs"/> class.
		/// </summary>
		/// <param name="session">The session.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trns">The TRNS.</param>
		/// <param name="context">The context.</param>
		public LogOnEventArgs(Session session,SqlConnection cn,SqlTransaction trns,HttpContext context) {
			this.Session=session;
			this.HttpContext=context;
            
		}
	}
	/// <summary>
	/// This event is raised when a status change occurs in an order, shipment order line.
	/// You can subscribe to this event to make other things happen when this status change occurs.
	/// Fire off emails make other status changes and everything.
	/// </summary>
	public class StatusChangeEventArgs:EventArgs {
		/// <summary>
		/// The previous status of the object that was just changed.
		/// </summary>
		public int PreviousFlagStatus;
		/// <summary>
		/// The new status of the object that was just changed.
		/// </summary>
		public int NewFlagStatus;
		/// <summary>
		/// The previous flag id (dbo.objectFlags PK).
		/// </summary>
		public Guid PreviousFlagId;
		/// <summary>
		/// The new flag id (dbo.objectFlags PK).
		/// </summary>
		public Guid NewFlagId;
		/// <summary>
		/// Type of object, can be order, shipment or line.
		/// </summary>
		public string ObjectType;
		/// <summary>
		/// The id of the order, shipment or line.
		/// </summary>
		public string ObjectId;
		/// <summary>
		/// Current SQL connection.
		/// </summary>
		public SqlConnection SqlConnection;
		/// <summary>
		/// Current SQL Transaction. 
		/// </summary>
		public SqlTransaction SqlTransaction;
		/// <summary>
		/// Initializes a new instance of the <see cref="StatusChangeEventArgs"/> class.
		/// </summary>
		/// <param name="objectType">Type of the object.</param>
		/// <param name="objectId">The object id.</param>
		/// <param name="previousFlagStatus">The previous flag status.</param>
		/// <param name="newFlagStatus">The new flag status.</param>
		/// <param name="previousFlagId">The previous flag id.</param>
		/// <param name="newFlagId">The new flag id.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trans">The trans.</param>
		public StatusChangeEventArgs(string objectType,string objectId, int previousFlagStatus,int newFlagStatus,
		Guid previousFlagId,Guid newFlagId,SqlConnection cn,SqlTransaction trans) {
			this.PreviousFlagStatus=previousFlagStatus;
			this.NewFlagStatus=newFlagStatus;
			this.PreviousFlagId=previousFlagId;
			this.NewFlagId=newFlagId;
			this.ObjectType=objectType;
			this.ObjectId=objectId;
			this.SqlConnection=cn;
			this.SqlTransaction=trans;
		}
	}
	/// <summary>
	/// This event is raised after an order has been placed.
	/// </summary>
	public class AfterPlaceOrderEventArgs:EventArgs {
		/// <summary>
		/// The recently placed order.
		/// </summary>
		public Commerce.Order Order;
		/// <summary>
		/// The session that placed this order if any.
		/// </summary>
		public Session Session;
		/// <summary>
		/// The HttpContext if any.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// Initializes a new instance of the <see cref="AfterPlaceOrderEventArgs"/> class.
		/// </summary>
		/// <param name="order">The order.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trans">The trans.</param>
		/// <param name="session">The session.</param>
		/// <param name="context">The context.</param>
		public AfterPlaceOrderEventArgs(Commerce.Order order,SqlConnection cn,SqlTransaction trans,Session session,HttpContext context) {
			this.Order=order;
			this.Session=session;
			this.HttpContext=context;
		}
	}
	/// <summary>
	/// This event occurs directly before an order is placed.
	/// </summary>
	public class PlaceOrderEventArgs:EventArgs {
		/// <summary>
		/// The cart of the order being placed.
		/// </summary>
		public Commerce.Cart Cart;
		/// <summary>
		/// The session of the order being placed.
		/// </summary>
		public Session Session;
		/// <summary>
		/// The HttpContext of the order being placed if any.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// Initializes a new instance of the <see cref="PlaceOrderEventArgs"/> class.
		/// </summary>
		/// <param name="cart">The cart.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trans">The trans.</param>
		/// <param name="session">The session.</param>
		/// <param name="context">The context.</param>
		public PlaceOrderEventArgs(Commerce.Cart cart,SqlConnection cn,SqlTransaction trans,Session session,HttpContext context) {
			this.Cart=cart;
			this.Session=session;
			this.HttpContext=context;
		}
	}
	/// <summary>
	/// This event is raised when the cart/quote is recalculated.
	/// </summary>
	public class RecalculateCartEventArgs:EventArgs {
		/// <summary>
		/// The cart being recalculated.
		/// </summary>
		public Commerce.Cart Cart;
		/// <summary>
		/// The session that the cart belongs to.
		/// </summary>
		public Session Session;
		/// <summary>
		/// The HttpContext that the session belongs to if any.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// The HttpContext that the session belongs to if any.
		/// </summary>
		public Dictionary<string,object> RecalculateArgs;
		/// <summary>
		/// Initializes a new instance of the <see cref="RecalculateCartEventArgs"/> class.
		/// </summary>
		/// <param name="cart">The cart.</param>
		/// <param name="session">The session.</param>
		/// <param name="context">The context.</param>
		/// <param name="recalculateArgs">The recalculate args.</param>
		public RecalculateCartEventArgs(Commerce.Cart cart,Session session,HttpContext context,
		Dictionary<string,object> recalculateArgs) {
			this.Cart=cart;
			this.Session=session;
			this.HttpContext=context;
			this.RecalculateArgs = recalculateArgs;
		}
	}
	/// <summary>
	/// This event is raised when the confirmed order is recalculated.
	/// </summary>
	public class RecalculateOrderEventArgs:EventArgs {
		/// <summary>
		/// Recalculation arguments.
		/// </summary>
		Dictionary<string,object> dictionaryKeys;
		/// <summary>
		/// SQL connection.
		/// </summary>
		public SqlConnection SqlConnection;
		/// <summary>
		/// SQL Transaction.
		/// </summary>
		public SqlTransaction SqlTransaction;
		/// <summary>
		/// The session doing the recalculation.
		/// </summary>
		public Session Session;
		/// <summary>
		/// The HttpContext of the session doing the recalculation.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// The order being recalculated.
		/// </summary>
		public Commerce.Order Order;
		/// <summary>
		/// Initializes a new instance of the <see cref="RecalculateOrderEventArgs"/> class.
		/// </summary>
		/// <param name="order">The order.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trans">The trans.</param>
		/// <param name="args">The args.</param>
		/// <param name="session">The session.</param>
		/// <param name="context">The context.</param>
		public RecalculateOrderEventArgs(Commerce.Order order, SqlConnection cn,SqlTransaction trans,Dictionary<string,object> args,Session session,HttpContext context) {
			this.dictionaryKeys=args;
			this.Order=order;
			this.SqlConnection=cn;
			this.SqlTransaction=trans;
			this.Session=session;
			this.HttpContext=context;
		}
	}
	/// <summary>
	/// This event occurs just before the item is added to the cart
	/// </summary>
	public class BeforeAddToCartEventArgs:EventArgs {
		/// <summary>
		/// The item being added
		/// </summary>
		public Commerce.Item Item;
		/// <summary>
		/// The session the item is being added to
		/// </summary>
		public Session Session;
		/// <summary>
		/// The HttpContext of the session
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// Initializes a new instance of the <see cref="BeforeAddToCartEventArgs"/> class.
		/// </summary>
		/// <param name="item">The item.</param>
		/// <param name="session">The session.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trns">The TRNS.</param>
		/// <param name="context">The context.</param>
		public BeforeAddToCartEventArgs(Commerce.Item item,Session session,SqlConnection cn,SqlTransaction trns, HttpContext context) {
			this.Item=item;
			this.Session=session;
			this.HttpContext=context;
		}
	}
	/// <summary>
	/// This event is raised when an item is added to the cart.
	/// </summary>
	public class AddToCartEventArgs:EventArgs {
		/// <summary>
		/// The SQL connection.
		/// </summary>
		public SqlConnection SqlConnection;
		/// <summary>
		/// The SQL transaction.
		/// </summary>
		public SqlTransaction SqlTransaction;
		/// <summary>
		/// The CartItem added.
		/// </summary>
		public Commerce.CartItem Item;
		/// <summary>
		/// The cart the item was added to.
		/// </summary>
		public Commerce.Cart Cart;
		/// <summary>
		/// The session adding the item.
		/// </summary>
		public Session Session;
		/// <summary>
		/// The HttpContext of the session adding the item if any.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// Initializes a new instance of the <see cref="AddToCartEventArgs"/> class.
		/// </summary>
		/// <param name="item">The item.</param>
		/// <param name="cart">The cart.</param>
		/// <param name="cn">The cn.</param>
		/// <param name="trns">The TRNS.</param>
		/// <param name="session">The session.</param>
		/// <param name="context">The context.</param>
		public AddToCartEventArgs(Commerce.CartItem item,Commerce.Cart cart,SqlConnection cn,SqlTransaction trns, Session session,HttpContext context) {
			this.Item=item;
			this.Cart=cart;
			this.Session=session;
			this.HttpContext=context;
		}
	}
	/// <summary>
	/// This event is raised when the site is going down.
	/// </summary>
	public class DisposeEventArgs:EventArgs {
		/// <summary>
		/// The site.
		/// </summary>
		public Rendition.Site Site;
		/// <summary>
		/// The HttpContext if any.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// Initializes a new instance of the <see cref="DisposeEventArgs"/> class.
		/// </summary>
		/// <param name="site">The site.</param>
		/// <param name="context">The context.</param>
		public DisposeEventArgs(Site site,HttpContext context) {
			this.Site=site;
			this.HttpContext=context;
		}
	}
	/// <summary>
	/// This class allows you to create a timed event that will execute every x miliseconds.
	/// </summary>
	public class TimerEventArgs:EventArgs {
		/// <summary>
		/// The SQL connection.
		/// </summary>
		public SqlConnection SqlConnection;
		/// <summary>
		/// The SQL transaction.
		/// </summary>
		public SqlTransaction SqlTransaction;
		/// <summary>
		/// The last time this event was run.
		/// </summary>
		public DateTime LastRun;
		/// <summary>
		/// The taskId.
		/// </summary>
		public Guid TaskId;
		/// <summary>
		/// The name of this event.
		/// </summary>
		public string Name;
		/// <summary>
		/// The last error id this event returned.
		/// </summary>
		public string LastErrorId;
		/// <summary>
		/// The last error JSON this event returned.
		/// </summary>
		public string LastErrorJson;
		/// <summary>
		/// Initializes a new instance of the <see cref="TimerEventArgs"/> class.
		/// </summary>
		/// <param name="cn">The cn.</param>
		/// <param name="trns">The TRNS.</param>
		/// <param name="lastRun">The last run.</param>
		/// <param name="taskId">The task id.</param>
		/// <param name="name">The name.</param>
		/// <param name="lastErrorId">The last error id.</param>
		/// <param name="lastErrorJSON">The last error JSON.</param>
		public TimerEventArgs(SqlConnection cn,SqlTransaction trns,DateTime lastRun,Guid taskId,
		string name,string lastErrorId,string lastErrorJSON) {
			this.SqlConnection=cn;
			this.SqlTransaction=trns;
			this.LastRun=lastRun;
			this.TaskId=taskId;
			this.Name=name;
			this.LastErrorId=lastErrorId;
			this.LastErrorJson=lastErrorJSON;
		}
	}
    /// <summary>
    /// Occurs when a line item is updated in an order.
    /// </summary>
    public class LineUpdateEventArgs : EventArgs {
        /// <summary>
        /// The line item being updated.
        /// </summary>
        public Commerce.Line Line;
        /// <summary>
        /// The order the item belongs to.
        /// </summary>
        public Commerce.Order Order;
        /// <summary>
        /// The SQL connection currently in use to update these items.
        /// </summary>
        public SqlConnection SqlConnection;
        /// <summary>
        /// The SQL transaction currently in use if any.
        /// </summary>
        public SqlTransaction SqlTransaction;
        /// <summary>
        /// Initializes a new instance of the <see cref="LineUpdateEventArgs"/> class.
        /// </summary>
        /// <param name="_line">The _line.</param>
        /// <param name="_order">The _order.</param>
        /// <param name="_cn">The _CN.</param>
        /// <param name="_trans">The _trans.</param>
        public LineUpdateEventArgs(Commerce.Line _line, Commerce.Order _order, SqlConnection _cn, SqlTransaction _trans) {
            this.Line = _line;
            this.Order = _order;
            this.SqlConnection = _cn;
            this.SqlTransaction = _trans;
        }
    }
    /// <summary>
	/// This event is raised when the site finishes refreshing.
	/// </summary>
    public class RefreshEventArgs : EventArgs {
		/// <summary>
		/// The stie.
		/// </summary>
		public Rendition.Site Site;
		/// <summary>
		/// The HttpContext of the session starting the site.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
        /// Initializes a new instance of the <see cref="RefreshEventArgs"/> class.
		/// </summary>
		/// <param name="site">The site.</param>
		/// <param name="context">The context.</param>
        public RefreshEventArgs(Rendition.Site site, HttpContext context) {
			this.Site=site;
			this.HttpContext=context;
		}
    }
	/// <summary>
	/// This event is raised when the site starts up.
	/// </summary>
	public class InitEventArgs:EventArgs {
		/// <summary>
		/// The stie.
		/// </summary>
		public Rendition.Site Site;
		/// <summary>
		/// The HttpContext of the session starting the site.
		/// </summary>
		public HttpContext HttpContext;
		/// <summary>
		/// Initializes a new instance of the <see cref="InitEventArgs"/> class.
		/// </summary>
		/// <param name="site">The site.</param>
		/// <param name="context">The context.</param>
		public InitEventArgs(Rendition.Site site,HttpContext context) {
			this.Site=site;
			this.HttpContext=context;
		}
	}
	/// <summary>
	/// Adding to the cart requires that you have at least the keys "qty" and "itemNumber".
	/// Any keys associated with the items form should be sent in the dictionary.
	/// Obviously the form cannot contain the keys that the base item contains.
	/// </summary>
	[Serializable]
	public class AddToCartArguments:Dictionary<string,object> {
		/// <summary>
		/// Initializes a new instance of the <see cref="AddToCartArguments"/> class.
		/// </summary>
		/// <param name="info">The info.</param>
		/// <param name="context">The context.</param>
		protected AddToCartArguments(System.Runtime.Serialization.SerializationInfo info,
		System.Runtime.Serialization.StreamingContext context):base(info,context) { }
		/// <summary>
		/// Initializes a new instance of the <see cref="AddToCartArguments"/> class.
		/// </summary>
		public AddToCartArguments() {
			string[] lineKeys= { "qty","itemNumber","price","serialNumber","shipmentNumber",
				"lineNumber","customerLineNumber","sessionId","customShipmentNumber","customSerialNumber",
				"allowPreorder","addressId" };
			foreach(string key in lineKeys) {
				this.Add(key,"");
			}
		}
	}
	/// <summary>
	/// Fill out as many keys as you can.  If no sessionId key is provided the current session will be used.
	/// Defaults will be attempted, but without the correct information you cannot place an order.
	/// </summary>
	[Serializable]
	public class OrderArguments:Dictionary<string,object> {
		/// <summary>
		/// Initializes a new instance of the <see cref="OrderArguments"/> class.
		/// </summary>
		/// <param name="info">The info.</param>
		/// <param name="context">The context.</param>
		protected OrderArguments(System.Runtime.Serialization.SerializationInfo info,
		System.Runtime.Serialization.StreamingContext context) : base(info,context) { }
		/// <summary>
		/// Initializes a new instance of the <see cref="OrderArguments"/> class.
		/// </summary>
		public OrderArguments() {
			string[] orderkeys= {"sessionId",
				"userId","nameOnCard","cardType","cardNumber","expMonth","expYear","secNumber","soldBy",
				"requisitionedBy","parentOrderId","deliverBy","purchaseOrder","manifestNumber",
				"vendorAccountNumber","FOB","scannedImage","comments","billToContactId",
				"billToFirstName","billToLastName","billToAddress1","billToAddress2",
				"billToCity","billToState","billToZip","billToCountry","billToCompany",
				"billToEmail","billToSendShipmentUpdates","billToHomePhone","billToWorkPhone",
				"billToSpecialInstructions","billToEmailAds","billToComments","billToRateId",
				"shipToContactId","shipToFirstName","shipToLastName","shipToAddress1",
				"shipToAddress2","shipToCity","shipToState","shipToZip","shipToCountry",
				"shipToCompany","shipToEmail","shipToSendShipmentUpdates","shipToHomePhone",
				"shipToWorkPhone","shipToSpecialInstructions","shipToComments","shipToEmailAds",
				"shipToRateId","termId","approvedBy","orderDate","orderNumber"};
			foreach(string key in orderkeys) {
				this.Add(key,"");
			}
        }
    }
    #endregion
}
