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
using System.Data;
using System.Data.SqlClient;
namespace Rendition {
    public partial class Commerce {
        /// <summary>
        /// This class creates a single review made of an item
        /// An instance of rendtion._site must exist to use this class
        /// </summary>
        public class Review {
            #region Static Properties
            /// <summary>
            /// Gets all Replies.
            /// </summary>
            public static List<Review> All {
                get {
                    return Main.Site.Reviews.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// Id of the view
            /// </summary>
            public Guid Id { get; internal set; }
            /// <summary>
            /// userId of ther user who made the review.
            /// </summary>
            public int UserId { get; internal set; }
            /// <summary>
            /// Rating the user gave this object.
            /// </summary>
            public double Rating { get; internal set; }
            /// <summary>
            /// The message attached to the review.
            /// </summary>
            public string Value { get; internal set; }
            /// <summary>
            /// If this review has been placed in the archive (no longer visible).
            /// </summary>
            public bool Archive { get; internal set; }
            /// <summary>
            /// The date this review as made on.
            /// </summary>
            public DateTime Date { get; internal set; }
            /// <summary>
            /// The reference for this review (e.g.: the item number being reviewed).
            /// </summary>
            public string RefId { get; internal set; }
            /// <summary>
            /// What type of object is being reviewed (e.g.: "itemNumber")
            /// </summary>
            public string RefType { get; internal set; }
            /// <summary>
            /// The user who created the review.
            /// </summary>
            public User User { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Review"/> class.
            /// </summary>
            /// <param name="f_id">The f_id.</param>
            /// <param name="f_userId">The f_user id.</param>
            /// <param name="f_rating">The f_rating.</param>
            /// <param name="f_value">The f_value.</param>
            /// <param name="f_archive">if set to <c>true</c> [f_archive].</param>
            /// <param name="f_date">The f_date.</param>
            /// <param name="f_refId">The f_ref id.</param>
            /// <param name="f_refType">Type of the f_ref.</param>
            /// <param name="site">The site.</param>
            public Review(Guid f_id, int f_userId, double f_rating, string f_value, bool f_archive,
            DateTime f_date, string f_refId, string f_refType, Site site) {
                Id = f_id;
                UserId = f_userId;
                Rating = f_rating;
                Value = f_value;
                Archive = f_archive;
                Date = f_date;
                RefId = f_refId;
                RefType = f_refType;
                User = site.Users.List.Find(delegate(User u) {
                    return u.UserId == f_userId;
                });
            }
            #endregion
            #region Static Methods
            /// <summary>
            /// creates a review for a hash match object accessable later thru _site._reviews
            /// </summary>
            /// <param name="args">JSON Object containging
            ///review_rating,
            ///review_message,
            ///review_objId,
            ///review_objType</param>
            /// <returns>{reviewId:Guid,userId:Int,rating:Int,value:string,archive:bool
            /// addDate:date,refType:string,refId:string,error:int,errorDesc:string}.</returns>
            public static Dictionary<string, object> AddReview(Dictionary<string, object> args) {
                ("FUNCTION /w SP addReview").Debug(10);
                Dictionary<string, object> j = new Dictionary<string, object>();
                Session session = null;
                if(args.ContainsKey("sessionId")) {
                    session = new Session(Main.Site, new Guid((string)args["sessionId"]));
                } else {
                    session = Main.GetCurrentSession();
                }
                Guid reviewId = Guid.NewGuid();
                SqlCommand cmd = new SqlCommand("dbo.insertReview @reviewId,@userId,@rating,@message,@refId,@archive,@addDate,@refType", Site.SqlConnection);
                cmd.Parameters.Add("@reviewId", SqlDbType.UniqueIdentifier).Value = new Guid(reviewId.ToString());
                cmd.Parameters.Add("@userId", SqlDbType.Int).Value = session.UserId;
                cmd.Parameters.Add("@rating", SqlDbType.Int).Value = Convert.ToInt32(args["rating"]);
                cmd.Parameters.Add("@message", SqlDbType.VarChar).Value = Convert.ToString(args["message"]);
                cmd.Parameters.Add("@refId", SqlDbType.VarChar, 50).Value = Convert.ToString(args["objId"]);
                cmd.Parameters.Add("@archive", SqlDbType.Bit).Value = false;
                cmd.Parameters.Add("@addDate", SqlDbType.DateTime).Value = DateTime.Now;
                cmd.Parameters.Add("@refType", SqlDbType.VarChar, 50).Value = Convert.ToString(args["objType"]);
                cmd.ExecuteNonQuery();
                cmd.Dispose();
                /* add to review list in memory */
                Commerce.Review rev = new Commerce.Review(reviewId, Main.GetCurrentSession().UserId, (float)Convert.ToInt32(args["rating"]),
                Convert.ToString(args["message"]), false, DateTime.Now, Convert.ToString(args["objId"]), Convert.ToString(args["objType"]), Main.Site);
                Main.Site.Reviews.List.Add(rev);
                if(Convert.ToString(args["objType"]).l() == "itemnumber") {
                    Commerce.Item i = Main.Site.Items.List.Find(delegate(Commerce.Item itm) {
                        return itm.ItemNumber.l() == Convert.ToString(args["objId"]).l();
                    });
                    /* refresh item item in-memory as well*/
                    if(i != null) {
                        i.RefreshReviews();
                    }
                }
                j.Add("reviewId", rev.Id.ToString());
                j.Add("userId", rev.UserId);
                j.Add("rating", rev.Rating);
                j.Add("message", rev.Value);
                j.Add("archive", rev.Archive);
                j.Add("addDate", rev.Date);
                j.Add("refType", rev.RefType);
                j.Add("refId", rev.RefId);
                j.Add("error", 0);
                j.Add("errorDesc", "");
                return j;
            }
            #endregion
        }
        /// <summary>
        /// This is a list of all reviews on the site.
        /// </summary>
        public class Reviews {
            #region Instance Fields
            /// <summary>
            /// This is a list of all reviews on the site.
            /// </summary>
            public List<Review> List = new List<Review>();
            #endregion
            #region Instance Methods
            private void Add(Review newProperty) {
                List.Add(newProperty);
            }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Reviews"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public Reviews(Site site) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getReviews", cn)) {
                        using(SqlDataReader review_list = cmd.ExecuteReader()) {
                            while(review_list.Read()) {
                                List.Add(new Review(
                                    review_list.GetGuid(0),
                                    review_list.GetInt32(1),
                                    review_list.GetDouble(2),
                                    review_list.GetString(3),
                                    review_list.GetBoolean(4),
                                    review_list.GetDateTime(5),
                                    review_list.GetString(6),
                                    review_list.GetString(7),
                                    site
                                ));
                            }
                        }
                    }
                }
                return;
            }
            #endregion
        }
    }
}
