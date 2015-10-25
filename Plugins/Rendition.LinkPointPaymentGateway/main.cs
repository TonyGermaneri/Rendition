using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using Rendition;
using System.IO;
using System.Web;
using System.Text.RegularExpressions;
using Rendition;
namespace Rendition.plugins.linkPointPaymentGateway {
	public class linkPointGateway:Plugin {
		static string storeNumber = "";
		static string keyFilePath = "";
		static string transactionOrigin = "";
		static string terminalType = "";
		static string hostPort = "";
		static string host = "";
		static string Url = "";
		static string orderType = "";
		static string mode="";
		public linkPointGateway() {
			this.Message = Info.Name;
			string filePath = ("~/plugins/linkPointPaymentGateway.xml").VirtualToPhysicalSitePath();
			if(!File.Exists(filePath)){
				string message="Link Point gateway service configuration file is missing.\n"+
				"Expected to see it here:"+filePath+".\n"+
				"Should be an xml file with the root node <gateway> and a single child node <info>. \n"+
				"The info node must contain the following attributes:\n"+
				"storeNumber,keyFilePath,transactionOrigin,terminalType,hostPort,URL,host,orderType,mode\n"+
				"You can use ~ (tilde) to represent the web site root directory.";
				message.Debug(0);
				Exception e=new Exception(message);
				throw e;
			}
			/* read in config XML file */
			XmlDocument xmlDoc=new XmlDocument();
			xmlDoc.Load(filePath);
			XmlNode i=xmlDoc.DocumentElement.FirstChild;
			storeNumber = i.Attributes["storeNumber"].Value.ToString();
			keyFilePath = i.Attributes["keyFilePath"].Value.ToString();
			transactionOrigin = i.Attributes["transactionOrigin"].Value.ToString();
			terminalType = i.Attributes["terminalType"].Value.ToString();
			hostPort = i.Attributes["hostPort"].Value.ToString();
			Url=i.Attributes["URL"].Value.ToString();
			host = i.Attributes["host"].Value.ToString();
			orderType = i.Attributes["orderType"].Value.ToString();
			mode=i.Attributes["mode"].Value.ToString();
			keyFilePath = (keyFilePath).VirtualToPhysicalSitePath();
			if(!File.Exists(keyFilePath)) {
				string message = "Link Point gateway service encryption key is missing.\n"+
				"Expected to see it here:"+ keyFilePath + ".\n"+
				"You can specify the location of the key file in the ~/plugins/linkPointPaymentGateway.xml document. \n"+
				"You can use ~ (tilde) to represent the web site root directory.";
				message.Debug(0);
				Exception e = new Exception(message);
				throw e;
			}
			Rendition.Site.CurrentSite.OpeningPaymentGateway+=new EventHandler(payWithLinkPoint);
		}
		public void payWithLinkPoint(object sender,EventArgs e) {
            PaymentGatewayEventArgs args = (PaymentGatewayEventArgs)e;
			args.PreventDefault = true; /* don't do the default CC processor anymore */
			args.Success = false;/* the transaction was a failure until we say otherwise */
			string ipAddress=null;
			try{
				ipAddress = HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
			}finally{
				if(ipAddress==null){
					ipAddress = "127.0.0.1";
				}
			}
			string response = gatewayMethods.tryToPay(orderType,
			storeNumber,args.Amount,args.BillToAddress.Zip,args.BillToAddress.State,
			args.BillToAddress.Address1,args.BillToAddress.HomePhone,args.Card.CardNumber,
			args.Card.ExpMonth,args.Card.ExpYear,args.Card.SecCode,
			keyFilePath,Url,Convert.ToInt32(hostPort),terminalType,transactionOrigin,
			args.OrderNumber,ipAddress,args.PurchaseOrder,mode);
			
			string message = Regex.Replace(response,".*(?:<r_error>.+: )(.*)(?=</r_error>).*","$1").Trim();
			string success = Regex.Replace(response,".*(?:<r_approved>)(.*)(?=</r_approved>).*","$1").Trim();
			
			args.Success = success == "APPROVED";
			args.Message = message;

		}
	}
	public static class gatewayMethods {
		/// <summary>
		/// Pays the specified order type.
		/// </summary>
		/// <param name="orderType">Type of the order:
		/// Sale, Preauth (for auth only), Postauth (for a forced ticked or ticket only),
		/// Void, Credit, Calcshipping (for shipping charge calculations), Calctax</param>
		/// <param name="merchantNumber">The merchant number.</param>
		/// <param name="amount">Amount to charge.</param>
		/// <param name="zip">Billing zip.</param>
		/// <param name="address1">Billing address 1.</param>
		/// <param name="cardNumber">Card number.</param>
		/// <param name="expMonth">Experation month.</param>
		/// <param name="expYear">Experation year.</param>
		/// <param name="secCode">The sec code.</param>
		/// <param name="keyFilePath">The encryption key file path.</param>
		/// <param name="hostURL">The host URL.</param>
		/// <param name="hostPort">The host port.</param>
		/// <param name="terminalType">Type of the terminal: set terminaltype
		/// to POS for an electronic
		/// cash register or integrated POS system,
		/// STANDALONE for a point-of-sale credit card terminal,
		/// UNATTENDED for a self-service station, or
		/// UNSPECIFIED for e-commerce or other applications.</param>
		/// <param name="transactionOrigin">The transaction origin: usualy Eci.  Can be: MOTO (mail/tele), Retail (in person), Telephone.</param>
		/// <param name="orderNumber">The order number.</param>
		/// <param name="ipaddress">The ipaddress.</param>
		/// <param name="ponumber">The ponumber.</param>
		/// <param name="mode">Test or Live</param>
		/// <returns></returns>
		public static string tryToPay(
			string orderType, string merchantNumber,
			Decimal amount, string zip, string state, string address1,string phone,
			string cardNumber, string expMonth, string expYear,
			string secCode, string keyFilePath, string hostURL,
			int hostPort, string terminalType,string transactionOrigin,
			string orderNumber, string ipaddress,
			string ponumber,string mode
		){
			LinkPointTransaction.LPOrderPart order = 
			LinkPointTransaction.LPOrderFactory.createOrderPart("order");
			
			LinkPointTransaction.LPOrderPart op = 
			LinkPointTransaction.LPOrderFactory.createOrderPart();
			
			/*order options*/
			op.put("ordertype","SALE");
			op.put("result",mode);
			order.addPart("orderoptions",op);
			/*merchant info*/
			op.clear();
			op.put("configfile",merchantNumber);
			op.put("keyfile",keyFilePath);
			op.put("host",hostURL);
			op.put("port",hostPort.ToString());
			order.addPart("merchantinfo",op);

			/*billing*/
			op.clear();
			op.put("bzip",zip);
			op.put("bstate",state);
			op.put("baddress1",address1);
			op.put("bphone",phone);
			op.put("baddrnum",Regex.Replace(address1,"^([0-9]+).*$","$1"));
			order.addPart("billing", op);

			/*transaction details*/
			op.clear();
			op.put("terminaltype",terminalType);
			op.put("transactionorigin",transactionOrigin);
			op.put("oid",orderNumber);
			op.put("ip",ipaddress);
			op.put("reference_number","NEW"+orderNumber);
			op.put("ponumber",ponumber);
			order.addPart("transactiondetails",op);

			/*credit card*/
			op.clear();
			op.put("cardnumber",cardNumber);
			op.put("cardexpmonth",expMonth);
			op.put("cardexpyear",expYear);
			op.put("cvmindicator","provided");
			op.put("cvmvalue",secCode);
			order.addPart("creditcard",op);

			/*payment*/
			op.clear();
			op.put("subtotal",amount.ToString());
			op.put("shipping","0");
			op.put("tax","0");
			op.put("chargetotal",amount.ToString());
			order.addPart("payment",op);

			/*transaction object*/
			LinkPointTransaction.LinkPointTxn LPTxn = new LinkPointTransaction.LinkPointTxn();
			
			string outXML = order.toXML();

			outXML = @"<order>
				<merchantinfo>
					<configfile>"+merchantNumber+@"</configfile>
				</merchantinfo>
				<orderoptions>
					<ordertype>Sale</ordertype>
				</orderoptions>
				<payment>
					<chargetotal>"+amount.ToString()+@"</chargetotal>
				</payment>
				<transactiondetails>
					<terminaltype>"+terminalType+@"</terminaltype>
					<transactionorigin>"+transactionOrigin+@"</transactionorigin>
					<oid>"+orderNumber+@"</oid>
					<ip>"+ipaddress+@"</ip>
					<reference_number>"+"NEW"+orderNumber+@"</reference_number>
					<ponumber>"+ponumber+@"</ponumber>
				</transactiondetails>
				<creditcard>
					<cardnumber>"+cardNumber+@"</cardnumber>
					<cardexpmonth>"+expMonth+@"</cardexpmonth>
					<cardexpyear>"+expYear+@"</cardexpyear>
				</creditcard>
			</order>";


			/* execute transaction */
			string response = LPTxn.send(keyFilePath,hostURL,hostPort,outXML);
			
			/* spit out debugging messages on verbosity level 7 */
			response.Debug(7);
			
			return response;
		}
	}
}
