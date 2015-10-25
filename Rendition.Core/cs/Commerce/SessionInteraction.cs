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
namespace Rendition {
	public partial class Session {
        #region Static Methods
        /// <summary>
        /// updates current session's order by setting
        /// </summary>
        /// <param name="orderBy">Integer of the order by to write to the current sessions order by setting</param>
        /// <returns>{error:0,desc:"error description"}.</returns>
        public static Dictionary<string, object> UpdateOrderBy(int orderBy) {
            ("REQUEST:update order by").Debug(10);
            Regex number = new Regex("[0-9]+");
            /* alter value in memory */
            Main.GetCurrentSession().ListOrder = orderBy;
            /* alter the database */
            SqlCommand cmd = new SqlCommand("dbo.updateOrderBy @sessionid,@orderby", Site.SqlConnection);
            cmd.Parameters.Add("@sessionid", SqlDbType.UniqueIdentifier).Value = new Guid(Main.GetCurrentSession().Id.ToString());
            cmd.Parameters.Add("@orderby", SqlDbType.Int).Value = Main.GetCurrentSession().ListOrder;
            cmd.ExecuteNonQuery();
            cmd.Dispose();
            Dictionary<string, object> j = new Dictionary<string, object>();
            j.Add("error", 0);
            j.Add("description", "list mode updated");
            j.Add("orderBy", orderBy);
            return j;
        }
        /// <summary>
        /// updates current session's records per page setting
        /// </summary>
        /// <param name="records_per_page">Integer of the records per page to write to the current sessions records per page setting</param>
        /// <returns>{error:0,desc:"error description"}.</returns>
        public static Dictionary<string, object> UpdateRecordsPerPage(int records_per_page) {
            ("REQUEST:update records per page").Debug(10);
            Regex number = new Regex("[0-9]+");
            /* alter value in memory */
            Main.GetCurrentSession().RecordsPerPage = records_per_page;
            /* alter the database */
            SqlCommand cmd = new SqlCommand("dbo.updateRecordsPerPage @sessionid,@recordsPerPage", Site.SqlConnection);
            cmd.Parameters.Add("@sessionid", SqlDbType.UniqueIdentifier).Value = new Guid(Main.GetCurrentSession().Id.ToString());
            cmd.Parameters.Add("@recordsPerPage", SqlDbType.Int).Value = Main.GetCurrentSession().RecordsPerPage;
            cmd.ExecuteNonQuery();
            cmd.Dispose();
            Dictionary<string, object> j = new Dictionary<string, object>();
            j.Add("error", 0);
            j.Add("description", "records per page updated");
            j.Add("records_per_page", records_per_page);
            return j;
        }
        /// <summary>
        /// updates current session's list mode setting
        /// </summary>
        /// <param name="list_mode">Integer of the list mode to write to the current sessions list mode setting</param>
        /// <returns>{error:0,desc:"error description",listMode:x}.</returns>
        public static Dictionary<string, object> UpdateListMode(int list_mode) {
            ("REQUEST:update list mode").Debug(10);
            Regex number = new Regex("[0-9]+");
            /* alter value in memory */
            Main.GetCurrentSession().ListView = Convert.ToInt32(list_mode);
            /* alter the database */
            SqlCommand cmd = new SqlCommand("dbo.updateListMode @sessionid,@listmode", Site.SqlConnection);
            cmd.Parameters.Add("@sessionid", SqlDbType.UniqueIdentifier).Value = new Guid(Main.GetCurrentSession().Id.ToString());
            cmd.Parameters.Add("@listmode", SqlDbType.Int).Value = Main.GetCurrentSession().ListView;
            cmd.ExecuteNonQuery();
            cmd.Dispose();
            Dictionary<string, object> j = new Dictionary<string, object>();
            j.Add("error", 0);
            j.Add("description", "list mode updated");
            j.Add("list_mode", list_mode);
            return j;
        }
        /// <summary>
        /// Set the session.Properties["discountCode"] value when discountCode matches a discount code in the database.
        /// </summary>
        /// <param name="discountCode">The discount code.</param>
        /// <returns></returns>
        public static Dictionary<string, object> SetDiscountCode(string discountCode) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            string keyName = "discountCode";
            discountCode = discountCode.MaxLength(25, true, true);
            Commerce.Discount discount = Main.Site.Discounts.List.Find(delegate(Commerce.Discount d) {
                return d.Code.MaxLength(25, true, true) == discountCode;
            });
            Session session = Main.GetCurrentSession();
            if(discount != null) {
                session.AddProperty(keyName, discount.Code);
                j.Add("error", 0);
                j.Add("description", "");
            } else {
                session.AddProperty(keyName, "");
                j.Add("error", -1);
                j.Add("description", "Discount code does not exist.");
            }
            return j;
        }
        /// <summary>
        /// Emails A friend information about this item using the createemail event handler.
        /// </summary>
        /// <param name="item">The item.</param>
        /// <param name="user">The user.</param>
        /// <param name="message">The message.</param>
        /// <param name="emailTo">Send the email to.</param>
        /// <returns>{error:0,desc:"error description"}.</returns>
        public static Dictionary<string, object> EmailAFriend(Commerce.Item item, Commerce.User user, string message, string emailTo) {
            CreateEmailEventArgs emailArgs =
                new CreateEmailEventArgs("emailAFriend", Main.Site.site_operator_email, user.Email,
                Main.Site.site_log_email, user, Main.GetCurrentSession(), null, item, message, null);
            DefaultEmails.EmailAFriend(ref emailArgs);
            Main.Site.raiseOnCreateEmail(emailArgs);
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                return Commerce.SendEmailArgResult(emailArgs, cn, null);
            }
        }
        /// <summary>
        /// Changes the password of a given account when the old password is provided.
        /// </summary>
        /// <param name="userId">The user id.</param>
        /// <param name="oldPassword">The old password.</param>
        /// <param name="newPassword">The new password.</param>
        /// <returns></returns>
        public static Dictionary<string, object> ChangePassword(int userId, string oldPassword, string newPassword) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            /* see if the old password matches */
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(@"if exists(select
			userId from users with (nolock)
			where password = @oldPassword
			and userId = @userId) begin
				update users set password = @newPassword where userId = @userId
			end", cn)) {
                    cmd.Parameters.Add("@userId", SqlDbType.Int).Value = Convert.ToInt32(userId);
                    cmd.Parameters.Add("@oldPassword", SqlDbType.VarChar).Value = Site.GetHash(oldPassword.MaxLength(50));
                    cmd.Parameters.Add("@newPassword", SqlDbType.VarChar).Value = Site.GetHash(newPassword.MaxLength(50));
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        if(!r.HasRows) {
                            j.Add("error", -1);
                            j.Add("description", "Incorrect Password.");
                        } else {
                            j.Add("error", 0);
                            j.Add("description", "Password Changed.");
                        }
                    }
                }
            }
            return j;
        }
        /// <summary>
        /// Resets the password of the account matching the email provided in the argument.
        /// An email will be sent to the account with the new randomly created password.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <returns></returns>
        public static Dictionary<string, object> ResetPassword(string email) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            /* see if the old password matches */
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(@"select userId from users with (nolock) where email = @email;
			update users set password = @newPassword where email = @email;
			", cn)) {
                    string newPassword = Guid.NewGuid().ToBase64Hash().Substring(1, 7);
                    string hashPassword = Site.GetHash(newPassword);
                    cmd.Parameters.Add("@email", SqlDbType.VarChar).Value = email;
                    cmd.Parameters.Add("@newPassword", SqlDbType.VarChar).Value = hashPassword;
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        if(!r.HasRows) {
                            j.Add("error", -1);
                            j.Add("description", "No such email.  Password reset failed.");
                        } else {
                            /* find the user's Id */
                            Rendition.Commerce.User user = Commerce.Users.GetUserByEmail(email);
                            /* set the new password while we know it */
                            user.Password = newPassword;
                            ("Password reset for user " + user.UserId + ".  New password:" + newPassword).Debug(5);
                            CreateEmailEventArgs emailArgs =
                                new CreateEmailEventArgs("lostPassword", Main.Site.site_operator_email, user.Email,
                                Main.Site.site_log_email, user, Main.GetCurrentSession(), null, null, "", null);
                            DefaultEmails.LostPassword(ref emailArgs);
                            Main.Site.raiseOnCreateEmail(emailArgs);
                            Commerce.SendEmailArgResult(emailArgs, cn, null);
                            j.Add("error", 0);
                            j.Add("description", "Password Reset.");
                        }
                    }
                }
            }
            return j;
        }
        #endregion
    }
}