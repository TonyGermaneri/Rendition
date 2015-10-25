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
* defaultEmails.cs
* 
* Emails for the defaut emails that go out.
* These emails are supposed to be replaced ASAP by the
* included email plugin.  Think of these as event signatures for people
* who don't care to subscribe to the email event in question.
* ------------------------------------------------------------------------- */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
namespace Rendition {
	/// <summary>
	/// Default emails
	/// </summary>
	public static class DefaultEmails {
		/// <summary>
		/// Emails the A friend.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.CreateEmailEventArgs"/> instance containing the event data.</param>
		public static void EmailAFriend(ref CreateEmailEventArgs args) {
			string msg=@"You may be interested in "+args.Item.Number+@"<br>Here's a message from your friend <hr>"+args.UserComment;
			args.MessageBody = msg;
			args.Subject = "Your friend "+args.User.Email+" thought you would be intrested in.";
			return;
		}
		/// <summary>
		/// Helps a user reset their password.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.CreateEmailEventArgs"/> instance containing the event data.</param>
		public static void LostPassword(ref CreateEmailEventArgs args) {
			string message="Your new password is "+args.User.Password+".";
			args.MessageBody = message;
			args.Subject = "Your new password from "+Main.Site.Defaults.SiteName;
			return;
		}
		/// <summary>
		/// Confirms the user's order
		/// </summary>
		/// <param name="args">The <see cref="Rendition.CreateEmailEventArgs"/> instance containing the event data.</param>
		public static void OrderConfirm(ref CreateEmailEventArgs args) {
			/* construct your message here */
			string message="Thanks for your order .<br>"+
			"you can <a href=\"/printOrder/"+args.Order.OrderNumber+"\">click here</a> any time to see your invoice.</a>";
			/* this is what you're sending as an email */
			args.MessageBody = message;
			args.Subject = "Order "+args.Order.OrderNumber+" from "+Main.Site.Defaults.SiteName;
			return;
		}
		/// <summary>
		/// Confirms the user's shipment
		/// </summary>
		/// <param name="args">The <see cref="Rendition.CreateEmailEventArgs"/> instance containing the event data.</param>
		public static void ShipConfirm(ref CreateEmailEventArgs args) {
			/* construct your message here */
			string message="Your order has been shipped.<br>"+
            "Your tracking number cannot be displayed due to a computer error.  We are sorry for the inconvenience.  "+
            "If you should need your tracking information, "+
            "please call our customer service desk at (800) 779-1979 ext:26 9am - 4:30pm Mon-Fri.";
			args.MessageBody = message;
			args.Subject = "Order "+args.Order.OrderNumber+" from "+Rendition.Main.Site.Defaults.SiteName;
			return;
		}
		/// <summary>
		/// Alerts an operator to a stock level probelm
		/// </summary>
		/// <param name="args">The <see cref="Rendition.CreateEmailEventArgs"/> instance containing the event data.</param>
		public static void StockAlert(ref CreateEmailEventArgs args) {
			/* construct your message here */
			string message="You are low on stock for item "+args.Item.Number;
			/* this is what you're sending as an email */
			args.MessageBody = message;
			args.Subject = "Stock alert for "+args.Item.Number;
			return;
		}
		/// <summary>
		/// Reports new comments to items, Blogs, replies and more.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.CreateEmailEventArgs"/> instance containing the event data.</param>
		public static void CommentAdded(ref CreateEmailEventArgs args) {
			/* construct your message here */
			string message="A comment has been added<br>Subject:"+args.Reply.Subject+"<br>Message:"+args.Reply.Comment;
			/* this is what you're sending as an email */
			args.MessageBody = message;
			args.Subject = "A comment has been added.";
			return;
		}
	}
}
