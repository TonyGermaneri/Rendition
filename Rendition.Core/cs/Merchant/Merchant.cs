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
 * merchant.cs
 * 
 * High level stuff.
 * Anything in this class is accessable to the public.
 * this class contains methods used by public users to manipulate
 * their orders/account etc.
 * most of the methods in this class are wrappers for methods in the
 * Commerce class to prevent access to the private methods and
 * classes in the Commerce class
* ------------------------------------------------------------------------- */
using System.Collections.Generic;
using System.Web;
namespace Rendition {
	/// <summary>
	/// This contains all the public retail interaction with the site
	/// such as add to cart, place order and calculate lines
	/// Each method is designed to accept data from a JSON source using generic types
	/// </summary>
	public class Merchant {
		/// <summary>
		/// Sets the discount code.
		/// </summary>
		/// <param name="discountCode">The discount code.</param>
		/// <returns></returns>
		public static Dictionary<string,object> SetDiscountCode(string discountCode) {
            return Session.SetDiscountCode(discountCode);
		}
		/// <summary>
		/// Removes from wishlist.
		/// </summary>
		/// <param name="itemNumber">The item number.</param>
		/// <returns></returns>
		public static Dictionary<string,object> RemoveFromWishlist(string itemNumber) {
			return Commerce.RemoveFromWishlist(itemNumber);
		}
		/// <summary>
		/// Adds to wishlist.
		/// </summary>
		/// <param name="itemNumber">The item number.</param>
		/// <returns></returns>
		public static Dictionary<string,object> AddToWishlist(string itemNumber){
			return Commerce.AddToWishlist(itemNumber);
		}
		/// <summary>
		/// Updates the cart.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> UpdateCart(Dictionary<string,object> args){
			return Commerce.Cart.UpdateCart(args);
		}
		/// <summary>
		/// Refreshes the user by id.
		/// </summary>
		/// <param name="userId">The user id.</param>
		public static void RefreshUserById(int userId){
			Commerce.RefreshUserById(userId);
		}
		/// <summary>
		/// Prints the order.
		/// </summary>
		/// <param name="args">The args.</param>
		public static void PrintOrder(Dictionary<string,object> args){
			Admin.PrintOrder(args);
			return;
		}
		/// <summary>
		/// Send an email to help the user reset their password
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> LostPasswordEmail(Dictionary<string,object> args) {
			Dictionary<string,object> j = new Dictionary<string,object>();
			/* check if the email exists */
			if(!args.ContainsKey("email")){
				j.Add("error",-1);
				j.Add("description","Missing key email.  Cannot send lost password email.");
				return j;
			}
			string email = args["email"].ToString();
			Commerce.User user = Main.Site.Users.List.Find(delegate(Commerce.User usr){
				return usr.Email.Trim().ToLower() == email.Trim().ToLower();
			});
			if(user==null){
				j.Add("error",-2);
				j.Add("description","This email is not in the system.");
				return j;
			}
			/* the user exists, so pass the userId to the send password function */
			args.Add("userId",user.UserId);
			return Commerce.LostPasswordEmail(args);
		}
		/// <summary>
		/// Gets the orders.
		/// </summary>
		/// <returns></returns>
		public static Dictionary<string,object> GetOrders() {
			Dictionary<string,object> j = new Dictionary<string,object>();
			List<Commerce.Order> o=Commerce.Order.GetOrdersByUserId(Main.GetCurrentSession().UserId);
			j.Add("orders",o);
			return j;
		}
		/// <summary>
		/// Emails the item to a friend.
		/// </summary>
		/// <param name="itemNumber">The item number.</param>
		/// <param name="message">The message.</param>
		/// <param name="mailTo">The mail to.</param>
		/// <returns></returns>
		public static Dictionary<string,object> EmailAFriend(string itemNumber,string message, string mailTo) {
			Dictionary<string,object> j=new Dictionary<string,object>();
			Commerce.Item item = Main.Site.Items.GetItemByItemNumber(itemNumber);
			if(item==null){
				j.Add("error",-2);
				j.Add("description","item does not exist.");
				return j;
			}
			try{
				System.Net.Mail.MailAddress m=new System.Net.Mail.MailAddress(mailTo);
                return Session.EmailAFriend(item, Main.GetCurrentSession().User, message, mailTo);
			}catch(System.Exception e){
				j.Add("error",-1);
				j.Add("description",e.Message);
				return j;
			}
		}
		/// <summary>
		/// Sends an email to confirm placement of the order
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> PlacedOrderEmail(Dictionary<string,object> args){
			Dictionary<string,object> j=new Dictionary<string,object>();
			if(!args.ContainsKey("orderId")) {
				j.Add("error",-1);
				j.Add("description","Missing key orderId.  Cannot send order confirm email.");
				return j;
			}
			Commerce.Order order = Commerce.Order.GetOrderByOrderId(((int)args["orderId"]));
            using(System.Data.SqlClient.SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                return Commerce.PlacedOrderEmail(order, Site.SqlConnection, null);
            }
		}
		/// <summary>
		/// Refreshes the site data, threaded.
		/// </summary>
		public static void RefreshSiteDataThreaded(){
			Commerce.RefreshSiteDataThreaded();
		}
		/// <summary>
		/// Refreshes the site data.
		/// </summary>
		public static void RefreshSiteData() {
			Commerce.RefreshSiteData();
		}
		/// <summary>
		/// Adds the reply to the object.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> AddReply(Dictionary<string,object> args) {
			/* sanitize user input - but allow i, and blockquote */
			if(args.ContainsKey("message")){
				args["message"]=args["message"].ToString().
				Replace("<blockquote>","[blockquote]").Replace("</blockquote>","[/blockquote]").
				Replace("<i>","[i]").Replace("</i>","[/i]").
				Replace("<b>","[b]").Replace("</b>","[/b]").
				Replace("<u>","[u]").Replace("</u>","[/u]").
				Replace("<br>","[br]").Replace("</br>","[/br]").
				HtmlEncode().
				Replace("[blockquote]","<blockquote>").Replace("[/blockquote]","</blockquote>").
				Replace("[i]","<i>").Replace("[/i]","</i>").
				Replace("[b]","<b>").Replace("[/b]","</b>").
				Replace("[u]","<u>").Replace("[/u]","</u>").
				Replace("[br]","<br>").Replace("[/br]","</br>");
			}
			if(args.ContainsKey("subject")){
				args["subject"]=args["subject"].ToString().HtmlEncode();
			}
			return Commerce.Reply.AddReply(args);
		}
		/// <summary>
		/// Adds the review.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> AddReview(Dictionary<string,object> args) {
			return Commerce.Review.AddReview(args);
		}
		/// <summary>
		/// Updates the list mode for the current session.
		/// </summary>
		/// <param name="list_mode">The list_mode.</param>
		/// <returns></returns>
		public static Dictionary<string,object> UpdateListMode(int list_mode) {
            return Session.UpdateListMode(list_mode);
		}
		/// <summary>
		/// Updates the order by mode for the current session.
		/// </summary>
		/// <param name="orderBy">The order by mode.</param>
		/// <returns></returns>
		public static Dictionary<string,object> UpdateOrderBy(int orderBy) {
			return Session.UpdateOrderBy(orderBy);
		}
		/// <summary>
		/// Updates the records per page for the current session.
		/// </summary>
		/// <param name="records_per_page">The records_per_page.</param>
		/// <returns></returns>
		public static Dictionary<string,object> UpdateRecordsPerPage(int records_per_page) {
            return Session.UpdateRecordsPerPage(records_per_page);
		}
		/// <summary>
		/// Recalculates the specified order.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> Recalculate(Dictionary<string,object> args) {
			return Commerce.Cart.Recalculate(args);
		}
		/// <summary>
		/// Adds an item to cart.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> AddToCart(Dictionary<string,object> args) {
			return Commerce.Cart.AddToCart(args,null,null);
		}
		/// <summary>
		/// Creates an account.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> CreateAccount(Dictionary<string,object> args) {
			return Site.CreateAccount(args);
		}
		/// <summary>
		/// Logon using the current session.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> LogOn(Dictionary<string,object> args) {
			return Site.LogOn(args);
		}
		/// <summary>
		/// Logoffs using the current session.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> LogOff(Dictionary<string,object> args) {
			return Site.LogOff(args);
		}
		/// <summary>
		/// Empties the cart of the current session.
		/// </summary>
		/// <param name="sessionId">The session id.</param>
		/// <returns></returns>
		public static Dictionary<string,object> EmptyCart(string sessionId) {
			return Commerce.Cart.EmptyCart(sessionId);
		}
		/// <summary>
		/// Updates the cart item in the current session.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> UpdateCartItem(Dictionary<string,object> args) {
			return Commerce.Cart.UpdateCartItem(args);
		}
		/// <summary>
		/// Updates an item already in an order.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> UpdateOrderItem(Dictionary<string,object> args) {
            return Commerce.Order.UpdateOrderItem(args);
		}
		/// <summary>
		/// Updates the specified contact.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> UpdateContact(Dictionary<string,object> args) {
            return Commerce.Address.UpdateContact(args);
		}
		/// <summary>
		/// Places the order.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> PlaceOrder(Dictionary<string,object> args){
            return Commerce.Order.PlaceOrder(args);
		}
		/// <summary>
		/// Deletes the specified cart item.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string,object> DeleteCartItem(Dictionary<string,object> args) {
			return Commerce.Cart.DeleteCartItem(args);
		}
		/// <summary>
		/// Resets the password of the account matching the email provided in the argument.
		/// An email will be sent to the account with the new randomly created password.
		/// </summary>
		/// <param name="email">The email.</param>
		/// <returns></returns>
		public static Dictionary<string,object> ResetPassword(string email){
            return Session.ResetPassword(email);
		}
		/// <summary>
		/// Changes the password of the currently logged on user when the old password is provided.
		/// </summary>
		/// <param name="oldPassword">The old password.</param>
		/// <param name="newPassword">The new password.</param>
		/// <returns></returns>
		public static Dictionary<string,object> ChangePassword(string oldPassword, string newPassword){
			Session session = Main.GetCurrentSession();
            return Session.ChangePassword(session.UserId, oldPassword, newPassword);
		}
        /// <summary>
        /// Duplicates the cart id.
        /// </summary>
        /// <param name="args">The args.</param>
        /// <returns></returns>
        public static Dictionary<string, object> DuplicateCartId(Dictionary<string,object> args) {
            return Commerce.Cart.DuplicateCartId(args, Site.SqlConnection, null);
        }
        /// <summary>
        /// Gets the item images by image id of any of the images in the item's collection of images.
        /// </summary>
        /// <param name="imageId">The image id.</param>
        /// <returns></returns>
        public static List<Commerce.Image> GetImagesByImageId(string imageId) {
            System.Guid imgId = new System.Guid(imageId);
            Commerce.Image img = Main.Site.ItemImages.List.Find(delegate(Commerce.Image _img) {
                return _img.Id == imgId;
            });
            return Commerce.Item.GetItem(img.ItemNumber).Images;
        }
	}
}