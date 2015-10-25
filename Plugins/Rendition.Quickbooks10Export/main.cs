using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rendition;
using System.Xml;
using System.Data.Sql;
using System.Data.SqlClient;
using System.Data;
using System.IO;
namespace Rendition.quickbooks10export {
	public class main : Plugin {
		private string outputPath = "";
/* these control IDs are for the Rendition import audit table
* they uniquely identify this import routine and the
* files/data it creates.  They should _NEVER_ be changed.
*/
		private string controlId="56028D3A-E8E5-4948-9181-19CF9936D336";
		private string paymentControlId = "3511CB96-333C-466D-AD3E-347DD75BD315";
		private string orderControlId = "384D7FB0-164C-40FB-8FBB-B4CF0B77B1AF";
		private string billFileHeader=
@"!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	TOPRINT	ADDR5	DUEDATE	TERMS
!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	QNTY	REIMBEXP	SERVICEDATE	OTHER2
!ENDTRNS														
";
		private string invoiceFileHeader=
@"!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	TOPRINT	NAMEISTAXABLE	DUEDATE	TERMS	PAYMETH	SHIPVIA	SHIPDATE	REP	FOB	PONUM	INVMEMO	ADDR1	ADDR2	ADDR3	ADDR4	ADDR5	SADDR1	SADDR2	SADDR3	SADDR4	SADDR5	TOSEND	ISAJE	OTHER1
!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	QNTY	PRICE	INVITEM	PAYMETH	TAXABLE	EXTRA	VATCODE	VATRATE	VATAMOUNT	VALADJ	SERVICEDATE	TAXCODE	TAXRATE	TAXAMOUNT	TAXITEM	OTHER2	OTHER3	REIMBEXP
!ENDTRNS
!ACCNT	NAME	REFNUM	ACCNTTYPE	ACCNUM	CURRENCY
!INVITEM	NAME	INVITEMTYPE	DESC	PURCHASEDESC	ACCNT	ASSETACCNT	COGSACCNT	PRICE	COST	TAXABLE	PAYMETH	TAXVEND	TAXDIST	PREFVEND	REORDERPOINT	EXTRA	CUSTFLD1	CUSTFLD2	CUSTFLD3	CUSTFLD4	CUSTFLD5	DEP_TYPE	ISPASSEDTHRU	HIDDEN
!CUST	NAME	BADDR1	BADDR2	BADDR3	BADDR4	BADDR5	COMPANYNAME	FIRSTNAME	MIDINIT	LASTNAME	CONT1	EMAIL	PHONE1	FAXNUM	SALUTATION	FIRSTNAME	MIDINIT	LASTNAME	CONT2	PHONE2	CTYPE	SADDR1	SADDR2	SADDR3	SADDR4	SADDR5
!VEND	NAME	ADDR1	ADDR2	ADDR3	ADDR4	ADDR5	COMPANYNAME	CONT1	EMAIL	PHONE1	FAXNUM	PRINTAS	SALUTATION	FIRSTNAME	MIDINIT	LASTNAME	CONT2	PHONE2	VTYPE
!OTHERNAME	NAME	BADDR1	BADDR2	BADDR3	BADDR4	BADDR5	COMPANYNAME	CONT1	EMAIL	PHONE1	FAXNUM	SALUTATION	FIRSTNAME	MIDINIT	LASTNAME	CONT2	PHONE2
!EMP	NAME	ADDR1	ADDR2	ADDR3	ADDR4	ADDR5	FIRSTNAME	MIDINIT	LASTNAME	CITY	STATE	ZIP
";
		private string billPaymentHeader=
@"!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	AMOUNT	DOCNUM	MEMO	CLEAR	TOPRINT
!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	AMOUNT	DOCNUM	MEMO	CLEAR	QNTY
!ENDTRNS										
";
		private string customerPaymentHeader=
@"!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	AMOUNT	DOCNUM
!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	AMOUNT	DOCNUM
!ENDTRNS							
";
		private Admin.Timer timer;
		private DateTime exportDate;
		private string invoiceFileName="";
		private string billFileName="";
		private string customer_paymentFileName="";
		private string bill_paymentFileName="";
		private string configFilePath = "~/plugins/export.xml";
		public string shippingRevAcct="Shipping Revenue";
		public string taxRevAcct="Sales Tax Payable";
		public string discRevAcct="Sales Discounts";
		public string defaultExportToAccount="Web Orders";
		public main() {
			this.Message = "Starting up...";
			/* load XML containing DB path */
			XmlDocument xmlDoc=new XmlDocument();
			this.Message="Reading config file from "+configFilePath;
			xmlDoc.Load((configFilePath).VirtualToPhysicalSitePath());
			XmlNodeList dataNode = xmlDoc.GetElementsByTagName( "quickbooks_10_iif" );
			if( dataNode != null) {
				if( dataNode.Count == 1 ){
					XmlAttribute _xa = dataNode[0].Attributes[ "outputPath" ];
					if(_xa == null){
						outputPath = "~/";
					} else {
						outputPath = _xa.Value;
					}
					_xa = dataNode[ 0 ].Attributes[ "discountRevenueAccount" ];
					if( _xa == null ) {
						discRevAcct = "Sales Discounts";
					} else {
						discRevAcct = _xa.Value;
					}
					_xa = dataNode[ 0 ].Attributes[ "taxRevenueAccount" ];
					if( _xa == null ) {
						taxRevAcct = "Sales Tax Payable";
					} else {
						taxRevAcct = _xa.Value;
					}
					_xa = dataNode[ 0 ].Attributes[ "shippingRevenueAccount" ];
					if( _xa == null ) {
						shippingRevAcct = "Shipping Revenue";
					} else {
						shippingRevAcct = _xa.Value;
					}
					_xa = dataNode[ 0 ].Attributes[ "anonymousExportToAccount" ];
					if( _xa == null ) {
						defaultExportToAccount = "Anonymous Customer";
					}else{
						defaultExportToAccount = _xa.Value;
					}
				}
			}
			if(!Directory.Exists(outputPath)&&outputPath!=""){
				string msg = string.Format("The path '{0}' specified in {1} in the export.xml file "+
				"( @ export > quickbooks_10_iif : outputPath ) does not exist.  " +
				" Output directory set to application root.",outputPath,configFilePath);
				this.Message = "Warning: Outputting to application root";
				msg.Debug(0);
				outputPath=Admin.GetApplicationPath();
			}else{
				("Quickbooks 10 Export: Output path ="+outputPath).Debug(10);
			}
			/* start a Timer - every five minutes try and export data */
			this.Message="Starting Timer.";
			("Quickbooks 10 Export: "+this.Message).Debug(10);
			timer = new Admin.Timer();
            timer.Name = "Quickbooks 10 Export";
			timer.elapsed+=this.OnElapsed;
			timer.Interval = 30000;/*five min*/
			timer.AutoReset = false;
			timer.Start();
			this.Message="Loaded";
			this.Message.Debug(10);
		}
		private void OnElapsed(object sender,EventArgs e){
			try{
				exportFiles();
			}catch(Exception ex){
				string msg = "An error occured"+ex.Message;
				/* write the error message to the log */
				this.Message=msg;
				("Quickbooks 10 Export: "+this.Message).Debug(0);
			}finally{
				/* start the Timer back up */
				timer.Start();
			}
		}
		/// <summary>
		/// Exports the files.
		/// </summary>
		private void exportFiles(){
			/* create a connection and transaction in case this fails */
			string transactionName = "quickbooksExport";
            SqlConnection cn = Site.CreateConnection(true, true);
			cn.Open();
			SqlTransaction trans=cn.BeginTransaction(transactionName);
			this.Message="Checking for orders to import.";
            ("Quickbooks 10 Export: " + this.Message).Debug(10);
			/* generate file names */
			exportDate=DateTime.Now;
			string dateSuffix=exportDate.ToString("MM-dd-yyyy.hh-mm-ss");
			StringBuilder billFileBuffer=new StringBuilder(@"");
			StringBuilder invoiceFileBuffer=new StringBuilder(@"");
			StringBuilder billPaymentBuffer=new StringBuilder(@"");
			StringBuilder customerPaymentBuffer=new StringBuilder(@"");
			/* there are four potential output files */
			invoiceFileName="Invoice_"+dateSuffix+".iif";
			customer_paymentFileName="Customer_Payment_"+dateSuffix+".iif";
			billFileName="Bill_"+dateSuffix+".iif";
			bill_paymentFileName="Invoice_"+dateSuffix+".iif";
            ("Quickbooks 10 Export: " + this.Message).Debug(10);
			/* get the list of orders to export and close.  This represents bills and invoices. */
			List<int> orderIds=new List<int>();
			using(SqlCommand cmd=new SqlCommand(@"/* Quickbooks IIF Export. Check for orders to export */
			select orderId from orders o with (nolock)
			where not readyForExport = '1/1/1900 00:00:00.000' and not orderId in 
			(
				select convert(int,cid) from
				(select controlId as cid from dbo.exportFileAudit a with (nolock) where controlIdType = '384D7FB0-164C-40FB-8FBB-B4CF0B77B1AF') cids
			)
			", cn,trans)) {
				using(SqlDataReader r=cmd.ExecuteReader()) {
					while(r.Read()) {
						int orderId=r.GetInt32(0);
						orderIds.Add(orderId);
					}
				}
			}
			/* WARNING: THIS DOES NOT WORK - IT WILL NEVER WORK.  quickbooks does not support importing
			 * payments to be associated with existing order because it's a fucking steaming pile of useless shit
			 * 
			 * get the list of payments and close.  This represents the bill and customer payment files */
			List<Guid> paymentIds=new List<Guid>();
			using(SqlCommand cmd=new SqlCommand(@"/* Quickbooks IIF Export. Check for payments to export */
			declare @emptyGuid uniqueidentifier = '00000000-0000-0000-0000-000000000000';
			declare @importPromiseToPay bit = 0;
			select paymentMethodId from paymentMethods with (nolock)
			where generalLedgerInsertId = @emptyGuid and (promiseToPay = 0 or promiseToPay = @importPromiseToPay) and paymentMethodId not in 
			(
				select convert(uniqueidentifier,cid) from
				(select controlId as cid from dbo.exportFileAudit a with (nolock) where controlIdType = '3511CB96-333C-466D-AD3E-347DD75BD315') cids
			)
			",cn,trans)) {
				cmd.Parameters.Add("@controlIdType",SqlDbType.UniqueIdentifier).Value=new Guid(orderControlId);
				using(SqlDataReader r=cmd.ExecuteReader()) {
					if(r.HasRows) {
						while(r.Read()) {
							Guid paymentId=r.GetGuid(0);
							paymentIds.Add(paymentId);
						}
					}
				}
			}
			/* 
			* payments
			*/
			this.Message="Creating Payment Files.";
            ("Quickbooks 10 Export: " + this.Message).Debug(10);
			foreach(Guid paymentId in paymentIds) {
				try {
					Commerce.Payment payment = new Commerce.Payment(paymentId);
					/* create the export string and validate it before adding it to the exportFileAudit table */
					bool customer=payment.User.AccountType==0;
					string fileName;
					if(customer) {
						fileName=bill_paymentFileName;
					} else {
						fileName=customer_paymentFileName;
					}
/* teamplates:
* 
!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	AMOUNT	DOCNUM
!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	AMOUNT	DOCNUM
!ENDTRNS							
* 
* 
* CUSTOMER
TRNS	 	PAYMENT	7/16/98	Undeposited Funds	Ecker Designs:Office Repairs	500	321
SPL	 	PAYMENT	7/16/98	Accounts Receivable	Ecker Designs:Office Repairs	-500	321
ENDTRNS							

* BILL
* 
!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	AMOUNT	DOCNUM	MEMO	CLEAR	TOPRINT
!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	AMOUNT	DOCNUM	MEMO	CLEAR	QNTY
!ENDTRNS										
* 
* 
TRNS		BILLPMT	7/16/98	Checking	Bayshore CalOil Service	-35		Test Memo	N	Y
SPL		BILLPMT	7/16/98	Accounts Payable	Bayshore CalOil Service	35			N	
ENDTRNS										

* 
*/
					if(customer) {
						/* payments from customers */
						string strPaymentDate = payment.GetAddress().DateCreated.ToString("MM/dd/yyyy");
						customerPaymentBuffer.Append("TRNS	 	PAYMENT	"+strPaymentDate+
						"	"+payment.User.UserId+"	"+payment.User.Handle+"	"+payment.Amount.ToString()+"	"+payment.Id.ToBase64Hash()+
						Environment.NewLine);
						foreach(Commerce.PaymentReference reference in payment.PaymentRefrences){
							customerPaymentBuffer.Append("SPL	 	PAYMENT	"+strPaymentDate+
							"	Accounts Receivable	Order Number:"+reference.Order.OrderNumber+"	"+
							(reference.Amount*-1).ToString()+"	"+reference.Order.OrderNumber+
							Environment.NewLine);
						}
						customerPaymentBuffer.Append("ENDTRNS"+Environment.NewLine);
					} else {
						/* payments to vendors */
						string strPaymentDate = payment.GetAddress().DateCreated.ToString("MM/dd/yyyy");
						billPaymentBuffer.Append("TRNS		BILLPMT	"+strPaymentDate+
						"	Checking	"+payment.User.Handle+"	"+(payment.Amount*-1).ToString()+"		"+payment.Notes+"	N	Y"+
						Environment.NewLine);
						foreach(Commerce.PaymentReference reference in payment.PaymentRefrences){
							billPaymentBuffer.Append("SPL		BILLPMT	"+strPaymentDate+
							"	Accounts Payable	Order Number:"+reference.Order.OrderNumber+"	"+reference.Amount.ToString()+"			N	"+
							Environment.NewLine);
						}
						billPaymentBuffer.Append("ENDTRNS"+Environment.NewLine);
					}
					using(SqlCommand cmd=new SqlCommand(@"/* insert exportFileAudit for Quickbooks IFF export plugin (payments) */
					insert into exportFileAudit (exportFileAuditId, exportFileId, exportFileName, controlId, exportDate, controlIdType) 
					values (newId(), @exportFileId, @fileName, @paymentId, @exportDate, @controlIdType)",cn,trans)) {
						cmd.Parameters.Add("@paymentId",SqlDbType.UniqueIdentifier).Value=new Guid(paymentId.ToString());
						cmd.Parameters.Add("@controlIdType",SqlDbType.UniqueIdentifier).Value=new Guid(paymentControlId);
						cmd.Parameters.Add("@exportFileId",SqlDbType.UniqueIdentifier).Value=new Guid(controlId);
						cmd.Parameters.Add("@fileName",SqlDbType.VarChar).Value=fileName;
						cmd.Parameters.Add("@exportDate",SqlDbType.DateTime).Value=exportDate;
						cmd.ExecuteNonQuery();
					}
				} catch(Exception ex) {
					/* somthing didn't work correctly*/
					ex.Message.Debug(0);
				}
			}
			/* 
			* orders
			*/
			this.Message="Creating Order Files.";
            ("Quickbooks 10 Export: " + this.Message).Debug(10);
			foreach(int orderId in orderIds) {
				try {
					/* get the order */
					Commerce.Order order = Commerce.Order.GetOrderByOrderId(orderId,cn,trans);
					/* create the export string and validate it before adding it to the exportFileAudit table */
					bool customer = order.User.AccountType==0;
					string fileName;
					if(customer) {
						fileName=invoiceFileName;
					} else {
						fileName=billFileName;
					}
					if(customer) {
/* 
* INVOICE
*
!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	TOPRINT	NAMEISTAXABLE	DUEDATE	TERMS	PAYMETH	SHIPVIA	SHIPDATE	REP	FOB	PONUM	INVMEMO	ADDR1	ADDR2	ADDR3	ADDR4	ADDR5	SADDR1	SADDR2	SADDR3	SADDR4	SADDR5	TOSEND	ISAJE	OTHER1
!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	QNTY	PRICE	INVITEM	PAYMETH	TAXABLE	EXTRA	VATCODE	VATRATE	VATAMOUNT	VALADJ	SERVICEDATE	TAXCODE	TAXRATE	TAXAMOUNT	TAXITEM	OTHER2	OTHER3	REIMBEXP
!ENDTRNS
!ACCNT	NAME	REFNUM	ACCNTTYPE	ACCNUM	CURRENCY
!INVITEM	NAME	INVITEMTYPE	DESC	PURCHASEDESC	ACCNT	ASSETACCNT	COGSACCNT	PRICE	COST	TAXABLE	PAYMETH	TAXVEND	TAXDIST	PREFVEND	REORDERPOINT	EXTRA	CUSTFLD1	CUSTFLD2	CUSTFLD3	CUSTFLD4	CUSTFLD5	DEP_TYPE	ISPASSEDTHRU	HIDDEN
!CUST	NAME	BADDR1	BADDR2	BADDR3	BADDR4	BADDR5	COMPANYNAME	FIRSTNAME	MIDINIT	LASTNAME	CONT1	EMAIL	PHONE1	FAXNUM	SALUTATION	FIRSTNAME	MIDINIT	LASTNAME	CONT2	PHONE2	CTYPE	SADDR1	SADDR2	SADDR3	SADDR4	SADDR5
!VEND	NAME	ADDR1	ADDR2	ADDR3	ADDR4	ADDR5	COMPANYNAME	CONT1	EMAIL	PHONE1	FAXNUM	PRINTAS	SALUTATION	FIRSTNAME	MIDINIT	LASTNAME	CONT2	PHONE2	VTYPE
!OTHERNAME	NAME	BADDR1	BADDR2	BADDR3	BADDR4	BADDR5	COMPANYNAME	CONT1	EMAIL	PHONE1	FAXNUM	SALUTATION	FIRSTNAME	MIDINIT	LASTNAME	CONT2	PHONE2
!EMP	NAME	ADDR1	ADDR2	ADDR3	ADDR4	ADDR5	FIRSTNAME	MIDINIT	LASTNAME	CITY	STATE	ZIP
*
* 
TRNS		INVOICE	4/5/2011	Accounts Receivable	Clay Design		59.66	48ZC			N	N	4/5/2011									Debbie Gizicki 25659 Kinyon	Taylor, MI 48044				Carrah Wilczynski 21805 E. Sunset Dr.	Macomb, MI 48044		Y		
SPL		INVOICE	4/5/2011	51100			-12.76		UPS Ground Tracking: Shipped On:		-1	12.76	Shipping		N				0.00			Non	0.00	0.00				
SPL		INVOICE	4/5/2011	25501			0		Tax		-1	0	Tax		N				0.00			Non	0.00	0.00				
SPL		INVOICE	4/5/2011	47900			-27.95		2 Quart Bowl		-1	27.95	454.N		N				0.00			Non	0.00	0.00				
SPL		INVOICE	4/5/2011	47900			-18.95		Ice Cream Bowl		-1	18.95	395.STIC		N				0.00			Non	0.00	0.00				
ENDTRNS
*/
						string strExpAcct;
						if(order.User.PurchaseAccount.Length>0){
							strExpAcct = order.User.PurchaseAccount;
						}else{
							strExpAcct= defaultExportToAccount;
						}
						string strShippingDetails = "";
						/* if there was at least one shipment, show that shipment */
						if(order.Shipments.Count>0){
							StringBuilder tl = new StringBuilder();
							foreach(Commerce.Shipment shipment in order.Shipments){
								tl.Append(shipment.Tracking);
							}
							strShippingDetails=string.Format("{0} Tracking:{1} Shipped On:{2}",order.ShipToAddress.Rate.Name,
							string.Join(tl.ToString(),","),order.Shipments[0].DateShipped);
						}
						/* invoice */
						string strOrderDate = order.OrderDate.ToString("MM/dd/yyyy");
						string strShippingTotal = (order.ShippingTotal).ToString();
						string strShippingTotalNeg = (order.ShippingTotal * -1).ToString();
						string strTaxTotal = (order.TaxTotal).ToString();
						string strTaxTotalNeg = (order.TaxTotal*-1).ToString();
						string acctName = order.User.Handle;
						if(acctName.Length==0){
							/* if the acct name is blank use the Id # */
							acctName = order.User.UserId.ToString();
						}
						string transType = "CASH SALE";
						string dpAcct = "Undeposited Funds";
						if(order.Term.Accrued){
							transType = "INVOICE";
							dpAcct = "Accounts Receivable";
						}
						/* header */
						invoiceFileBuffer.Append("TRNS		"+transType+"	"+strOrderDate+
						"	"+dpAcct+"	" +
						acctName + "		" +
						order.GrandTotal.ToString() + "	" +
						order.OrderNumber+"		"+order.OrderNumber+"	N	N	"+
						strOrderDate + "							" +
						order.PurchaseOrder + "		" +
						order.BillToAddress.FirstName + " " +
						order.BillToAddress.LastName + " " +
						order.BillToAddress.Address1 + " " +
						order.BillToAddress.Address2 + "	" +
						order.BillToAddress.City + ", " + order.BillToAddress.State + " " + order.BillToAddress.Zip + "				" +
						order.ShipToAddress.FirstName + " " + order.ShipToAddress.LastName + " " + 
						order.ShipToAddress.Address1 + " " + order.ShipToAddress.Address2 + "	" +
						order.ShipToAddress.City + ", " +
						order.ShipToAddress.State + " " +
						order.ShipToAddress.Zip + "		Y		" +Environment.NewLine);
						/* line items */
						foreach(Commerce.Line line in order.Lines){						
							invoiceFileBuffer.Append("SPL		"+transType+"	" + strOrderDate + "	" + line.Item.RevenueAccount +
							"			"  + ((line.Price*line.Qty)*-1).ToString() + "		" + line.Item.ShortDescription +
							"		" + (line.Qty*-1).ToString() + "	" + line.Price.ToString() + "	" + line.ItemNumber +
							"		N				0.00			Non	0.00	0.00				"+Environment.NewLine);
						}
						/* items that go into the header in Rendition but go into a line item in quickbooks */
						invoiceFileBuffer.Append("SPL		"+transType+"	"+strOrderDate+"	"+shippingRevAcct+"			"+
						strShippingTotalNeg+"		"+strShippingDetails+"		-1	"+strShippingTotal+
						"	"+"Shipping"+"		N				0.00			Non	0.00	0.00				"+
						Environment.NewLine);

						invoiceFileBuffer.Append("SPL		"+transType+"	"+strOrderDate+"	"+taxRevAcct+"			"+strTaxTotalNeg+"		"+
						"Tax"+"		-1	"+strTaxTotal+"	"+"Tax"+"		N				0.00			Non	0.00	0.00				"+
						Environment.NewLine);

						invoiceFileBuffer.Append("SPL		"+transType+"	"+strOrderDate+"	"+discRevAcct+
						"			"+order.Discount+"		"+"Discount"+"		-1	"+(order.Discount*-1)+
						"	"+"Discount"+"		N				0.00			Non	0.00	0.00				"+
						Environment.NewLine);
						invoiceFileBuffer.Append("ENDTRNS"+Environment.NewLine);
					} else {
/* 
* PURCHASE ORDER
* 
* 
!TRNS	TRNSID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	TOPRINT	ADDR5	DUEDATE	TERMS
!SPL	SPLID	TRNSTYPE	DATE	ACCNT	NAME	CLASS	AMOUNT	DOCNUM	MEMO	CLEAR	QNTY	REIMBEXP	SERVICEDATE	OTHER2
!ENDTRNS														
* 
* 
TRNS		BILL	7/16/98	Accounts Payable	Bayshore Water		-59.25			N	N		8/15/98	Net 30
SPL		BILL	7/16/98	Utilities:Water			59.25			N		NOTHING	0/0/0	
ENDTRNS														
* 
*/
						string acctName = order.User.Handle;
						if(acctName.Length==0){
							/* if the acct name is blank use the Id # */
							acctName = order.User.UserId.ToString();
						}
						string strOrderDate = order.OrderDate.ToString("MM/dd/yyyy");
						string strDueDate = order.DeliverBy.ToString("MM/dd/yyyy");
						billFileBuffer.Append("TRNS		BILL	"+strOrderDate+"	Accounts Payable	"+
						order.UserId.ToString()+"		"+(order.GrandTotal*-1)+"			N	N		"+strDueDate+"	"+order.Term.Name+
						Environment.NewLine);
						foreach(Commerce.Line line in order.Lines){
							billFileBuffer.Append("SPL		BILL	"+strOrderDate+"	"+line.Item.ItemNumber + ":" + line.Item.ShortDescription +
							"			"+(line.Price*line.Qty)+"			N		NOTHING	0/0/0	"+
							Environment.NewLine);
						}
						billFileBuffer.Append("ENDTRNS"+Environment.NewLine);
					}
					using(SqlCommand cmd=new SqlCommand(@"/* insert exportFileAudit for Quickbooks IFF export plugin (orders) */
						insert into exportFileAudit (exportFileAuditId, exportFileId, exportFileName, controlId, exportDate, controlIdType) 
						values (newId(), @exportFileId, @fileName, @orderId, @exportDate, @controlIdType)",cn,trans)) {
						cmd.Parameters.Add("@orderId",System.Data.SqlDbType.Int).Value=orderId;
						cmd.Parameters.Add("@controlIdType",SqlDbType.UniqueIdentifier).Value=new Guid(orderControlId);
						cmd.Parameters.Add("@exportFileId",SqlDbType.UniqueIdentifier).Value=new Guid(controlId);
						cmd.Parameters.Add("@fileName",SqlDbType.VarChar).Value=fileName;
						cmd.Parameters.Add("@exportDate",SqlDbType.DateTime).Value=exportDate;
						cmd.ExecuteNonQuery();
					}
				} catch(Exception ex) {
					/* somthing didn't work correctly*/
					Error = -1;
					Message = string.Format("Error exporting to quickbooks:{0}",ex.Message);
					Admin.AddFlag("0","order",orderId.ToString(),string.Format("Error exporting to Quickbooks -> <br>{0}",ex.Message));
					ex.Message.Debug(0);
				}
				
			}
			if(Error!=0) {
				/* an error occured, roll back all transactions and prevent output of any files */
				trans.Rollback(transactionName);
			} else {
				this.Message="Writing buffers to disk.";
				("Quickbooks 10 Export: "+this.Message).Debug(10);
				/* output files when there is data */
				if(billFileBuffer.Length>0) {
					File.WriteAllText(Path.GetFullPath(outputPath).ToString()+billFileName,
					billFileHeader+billFileBuffer.ToString());
				}
				if(invoiceFileBuffer.Length>0) {
					File.WriteAllText(Path.GetFullPath(outputPath).ToString()+invoiceFileName,
					invoiceFileHeader+invoiceFileBuffer.ToString());
				}
				if(billPaymentBuffer.Length>0) {
					File.WriteAllText(Path.GetFullPath(outputPath).ToString()+bill_paymentFileName,
					billPaymentHeader+billPaymentBuffer.ToString());
				}
				if(customerPaymentBuffer.Length>0) {
					File.WriteAllText(Path.GetFullPath(outputPath).ToString()+customer_paymentFileName,
					customerPaymentHeader+customerPaymentBuffer.ToString());
				}
                this.Message = "Last export: " + DateTime.Now.ToString("MM/dd/yyyy hh:mm:ss");
				("Quickbooks 10 Export: "+this.Message).Debug(10);
				try{
					/* sometimes there's just not a trasaction, how can I check? more work thats how! */
					if(paymentIds.Count>0||orderIds.Count>0){
						trans.Commit();
					}
				}catch{}
				cn.Close();
			}
		}
	}
}
