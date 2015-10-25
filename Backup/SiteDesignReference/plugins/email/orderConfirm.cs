using System;
using System.Collections.Generic;
using System.Web;
using System.Text;
using Rendition;
public class orderConfirm {
	/// <summary>
	/// Sends an new order mail.
	/// </summary>
	/// <param name="user">The user of the order.</param>
	/// <param name="order">The order.</param>
	/// <returns>Dictionary with two keys: message and subject.</returns>
	public void sendMail(ref CreateEmailEventArgs args) {
		String URL = Main.Site.Defaults.SiteUrl;
		StringBuilder b=new StringBuilder();
		b.Append(@"
		<table width='500'>
			<tr>
				<td colspan='2'>
					<div style='float:right;text-align:right;'>
						<span><a href="+URL+"/"+Main.Responder+"?method1="+
						("[\"printOrder\",[{\"orderNumber\":\""+args.Order.OrderNumber+"\"}]]").UrlEncode()+
						">PRINT</a></span>"+
					@"</div>
				</td>
			</tr>
			<tr>
				<td><img src='http://"+URL+@"/img/blueStar.jpg'></td>
				<td>THANKS FOR YOUR ORDER!</td>
			</tr>
			<tr>
				<td colspan='2' bgcolor='#58595B'>
					<font color='#ffffff'>PURCHASHING INFORMATION</font>
				</td>
			</tr>
			<tr>
				<td colspan='2'>
					<strong>E-mail Address:</strong> "+args.User.Email+@"
				</td>
			</tr>
			<tr>
				<td>
					<strong>Billing Address:</strong><br/>
					"+args.Order.BillToAddress.CreateShortAddressBlock("<br/>")+@"
				</td>
				<td>
					<strong>Shipping Address:</strong><br/>
					"+args.Order.BillToAddress.CreateShortAddressBlock("<br/>")+@"
				</td>
			</tr>
			<tr>
				<td colspan='2' bgcolor='#58595B'>
					<font color='#FFFFFF'>Order Summary</font>
				</td>
			</tr>
			<tr>
				<td colspan='2'>
					ORDER #: 
					"+args.Order.OrderNumber+@"
				</td>
			</tr>
			<tr>
			<tr>
				<td colspan='2'>
					<table width='100%'>
						<tr>
							<td>
								Item No.
							</td>
							<td>
								Qty.
							</td>
							<td>
								Price
							</td>
						</tr>");
		foreach(Commerce.Line c in args.Order.Lines) {
			b.Append(@"<tr>
				<td>"+c.ItemNumber+@"</td>
				<td>"+c.Item.Description+@"</td>
				<td>"+c.Qty+@"</td>
				<td>"+c.Price.ToString("f")+@"</td>
			</tr>");
		};
		b.Append(@"
						</tr>
					</table>
				</td>
			</tr>
			<tr>
				<td colspan='2'>
					<table align='right'>
						<tr>
							<td align='left'>
								Sub-total of Items:
							</td>
							<td align='right'>
								"+args.Order.SubTotal.ToString("c")+@"
							</td>
						</tr>
						<tr>
							<td align='left'>
								Shipping &amp; Handling:
							</td>
							<td align='right'>
								"+args.Order.ShippingTotal.ToString("c")+@"
							</td>
						</tr>
						<tr>
							<td align='left'>
								Sales Tax:
							</td>
							<td align='right'>
								"+args.Order.TaxTotal.ToString("c")+@"
							</td>
						</tr>
						<tr>
							<td align='left'>
								Discount:
							</td>
							<td align='right'>
								"+args.Order.Discount.ToString("c")+@"
							</td>
						</tr>
						<tr>
							<td align='left'>
								Total for this Order:
							</td>
							<td align='right'>
								"+args.Order.GrandTotal.ToString("c")+@"
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>");
		args.MessageBody = b.ToString();
		args.Subject = "Order "+args.Order.OrderNumber+" from "+Main.Site.Defaults.SiteName;
		return;
	}
}