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
using Microsoft.SqlServer.Server;
using System.Text.RegularExpressions;
namespace Rendition {
    partial class Commerce {
        /// <summary>
        /// Replies to Blogs or replies on the site.
        /// </summary>
        internal class Replies {
            #region Instance Fields
            /// <summary>
            /// Replies to Blogs or replies on the site.
            /// </summary>
            public List<Reply> List = new List<Reply>();
            #endregion
            #region Instance Methods
            /// <summary>
            /// Initializes a new instance of the <see cref="Replies"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public Replies(Site site) {
                this.Refresh(site);
            }
            /// <summary>
            /// Builds the reply hierarchy.
            /// </summary>
            public void BuildReplyHierarchy() {
                foreach(Reply rpl in this.List) {
                    rpl.Replies.AddRange(this.List.FindAll(delegate(Commerce.Reply r1) {
                        return r1.ParentId == rpl.Id;
                    }));
                }
            }
            /// <summary>
            /// Refreshes the list of replies on the site.
            /// </summary>
            /// <param name="site">The site.</param>
            public void Refresh(Site site) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    SqlCommand cmd = new SqlCommand(@"select replyId, email, subject, rating, userId, comment, addedOn, parentId, reference, disabled, approves, disapproves,
				flaggedInappropriate, flaggedOk from replies with (nolock) order by addedOn asc", cn);
                    int counter = 0;
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        while(d.Read()) {
                            List.Add(
                                new Reply(
                                    d.GetGuid(0),
                                    d.GetString(1),
                                    d.GetString(2),
                                    d.GetInt32(3),
                                    d.GetInt32(4),
                                    d.GetString(5),
                                    d.GetDateTime(6),
                                    d.GetGuid(7),
                                    d.GetString(8),
                                    d.GetBoolean(9),
                                    d.GetInt32(10),
                                    d.GetInt32(11),
                                    d.GetInt32(12),
                                    d.GetBoolean(13),
                                    site
                                )
                            );
                            counter++;
                        }
                        BuildReplyHierarchy();
                    }
                }
            }
            #endregion
            #region Static Methods
            /// <summary>
            /// Generates a generic hierarchial HTML structure to represent
            /// replies to an article or other reply-able object.
            /// </summary>
            /// <param name="replies">The replies.</param>
            /// <param name="hierarchial">if set to <c>true</c> [hierarchial].</param>
            public static void ReplyNode(List<Commerce.Reply> replies, bool hierarchial) {
                ReplyNode(replies, hierarchial, false, false, false);
            }
            /// <summary>
            /// Generates a generic hierarchial HTML structure to represent
            /// replies to an article or other reply-able object.
            /// </summary>
            /// <param name="replies">The replies.</param>
            public static void ReplyNode(List<Commerce.Reply> replies) {
                ReplyNode(replies, false, false, false, false);
            }
            /// <summary>
            /// Generates a generic hierarchial HTML structure to represent
            /// replies to an article or other reply-able object.
            /// </summary>
            /// <param name="replies">The replies.</param>
            /// <param name="hierarchial">if set to <c>true</c> [hierarchial].</param>
            /// <param name="approvesButton">if set to <c>true</c> [approves button] is visible.</param>
            /// <param name="disapprovesButton">if set to <c>true</c> [disapproves button] is visible.</param>
            /// <param name="inappropriateButton">if set to <c>true</c> [inappropriate button] is visible.</param>
            public static void ReplyNode(List<Commerce.Reply> replies, bool hierarchial, bool approvesButton,
            bool disapprovesButton, bool inappropriateButton) {
                StringBuilder s = new StringBuilder();
                foreach(Commerce.Reply r in replies) {
                    s.Append("<div><div style=\"border-bottom:dashed 1px black;\"><h4>" + r.Subject + "</h4>" +
                    "<a name=\"" + r.Id.ToString() + "\"></a>");
                    if(approvesButton) {
                        s.Append("<a href=\"javascript:approve(document.getElementById('a" + r.Id.EncodeXMLId() + "'),'" + r.Id.ToString() + "');\">" +
                        "<img style=\"cursor:pointer;border:none;\" src=\"/img/thumb_up.png\" alt=\"Approve\"></a>&nbsp;+" +
                        "<span id=\"a" + r.Id.EncodeXMLId() + "\">" + r.Approves.ToString() + "</span>&nbsp;&nbsp;");
                    }
                    if(approvesButton) {
                        s.Append("<a href=\"javascript:disapprove(document.getElementById('d" + r.Id.EncodeXMLId() + "'),'" + r.Id.ToString() + "');\">" +
                        "<img style=\"cursor:pointer;border:none;\" src=\"/img/thumb_down.png\" alt=\"Disapprove\"></a>&nbsp;-" +
                        "<span id=\"d" + r.Id.EncodeXMLId() + "\">" + r.Disapproves.ToString() + "</span>&nbsp;&nbsp;");
                    }
                    if(inappropriateButton) {
                        s.Append("<a href=\"javascript:inappropriate('" + r.Id.ToString() + "');\">" +
                        "<img style=\"cursor:pointer;border:none;\" src=\"/img/error.png\" alt=\"Report Inappropriate Comment\"></a>");
                    }
                    s.Append("<h5>By <b>" + r.User.FirstName + " " + r.User.LastName + "</b> On " + r.AddedOn.ToString("f") + "</h5>");
                    if(hierarchial) {
                        s.Append("<button class=\"replyButton\" onclick=\"javascript:reply(this,{parentId:'" + r.Id.ToString() + "'});\">Reply</button>");
                    }
                    s.Append("<p>" + r.Comment + "</p>");
                    s.Append("</div>").w();
                    if(hierarchial) {
                        ReplyNode(r.Replies, true, approvesButton, disapprovesButton, inappropriateButton);
                    }
                    ("</div>").w();
                }
            }
            #endregion
        }
        /// <summary>
        /// A single reply to a Blog or reply.
        /// </summary>
        public class Reply {
            #region Static Properties
            /// <summary>
            /// Gets all Replies.
            /// </summary>
            public static List<Reply> All {
                get {
                    return Main.Site.Replies.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// List of replies that belong to this reply.
            /// </summary>
            public List<Reply> Replies { get; internal set; }
            /// <summary>
            /// Id of this reply.
            /// </summary>
            public Guid Id { get; internal set; }
            /// <summary>
            /// Email Address of the person who replied (when not logged on).
            /// </summary>
            public string Email { get; internal set; }
            /// <summary>
            /// Subject of the reply.
            /// </summary>
            public string Subject { get; internal set; }
            /// <summary>
            /// Rating of the reply.
            /// </summary>
            public int Rating { get; internal set; }
            /// <summary>
            /// UserId of the user who made the reply.
            /// </summary>
            public int UserId { get; internal set; }
            /// <summary>
            /// Message on the reply.
            /// </summary>
            public string Comment { get; internal set; }
            /// <summary>
            /// Date this reply was added.
            /// </summary>
            public DateTime AddedOn { get; internal set; }
            /// <summary>
            /// The parent objectId (blogId,replyId).
            /// </summary>
            public Guid ParentId { get; internal set; }
            /// <summary>
            /// What type of parent this reply has (Blog,reply).
            /// </summary>
            public string Reference { get; internal set; }
            /// <summary>
            /// Is this reply enabled?
            /// </summary>
            public bool Disabled { get; internal set; }
            /// <summary>
            /// How many times approve has been hit.
            /// </summary>
            public int Approves { get; internal set; }
            /// <summary>
            /// How many times disapprove has been hit.
            /// </summary>
            public int Disapproves { get; internal set; }
            /// <summary>
            ///  How many times flag inappropriate has been hit.
            /// </summary>
            public int FlaggedInappropriate { get; internal set; }
            /// <summary>
            /// Did the administrator flag this Ok?
            /// </summary>
            public bool FlaggedOk { get; internal set; }
            /// <summary>
            /// User who added this reply.
            /// </summary>
            public Commerce.User User { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Reply"/> class.
            /// </summary>
            /// <param name="_replyId">The _reply id.</param>
            /// <param name="_email">The _email.</param>
            /// <param name="_subject">The _subject.</param>
            /// <param name="_rating">The _rating.</param>
            /// <param name="_userId">The _user id.</param>
            /// <param name="_comment">The _comment.</param>
            /// <param name="_addedOn">The _added on.</param>
            /// <param name="_parentId">The _parent id.</param>
            /// <param name="_reference">The _reference.</param>
            /// <param name="_disabled">if set to <c>true</c> [_disabled].</param>
            /// <param name="_approves">The _approves.</param>
            /// <param name="_disapproves">The _disapproves.</param>
            /// <param name="_flaggedInappropriate">The _flagged inappropriate.</param>
            /// <param name="_flaggedOk">if set to <c>true</c> [_flagged ok].</param>
            /// <param name="site">The site.</param>
            public Reply(Guid _replyId, string _email, string _subject, int _rating, int _userId, string _comment, DateTime _addedOn,
            Guid _parentId, string _reference, bool _disabled, int _approves, int _disapproves, int _flaggedInappropriate, bool _flaggedOk, Site site) {
                Id = _replyId;
                Email = _email;
                Subject = _subject;
                Rating = _rating;
                UserId = _userId;
                Comment = _comment;
                AddedOn = _addedOn;
                ParentId = _parentId;
                Reference = _reference;
                Disabled = _disabled;
                Approves = _approves;
                Disapproves = _disapproves;
                FlaggedInappropriate = _flaggedInappropriate;
                FlaggedOk = _flaggedOk;
                Replies = new List<Reply>();
                User = site.Users.List.Find(delegate(Commerce.User u) {
                    return u.UserId == _userId;
                });
                if(User == null) {
                    User = site.NullUser;
                }
            }
            #endregion
            #region Instance Methods
            /// <summary>
            /// Adds a reply to the reply or Blog matching the replyId key.
            /// Uses a SQL transaction to roll back changes if the boolean key "preview"
            /// is true, but still shows what would have happened.
            /// </summary>
            /// <param name="args">The argument dictionary {
            ///		replyId
            ///		email
            ///		subject
            ///		rating
            ///		userId
            ///		comment
            ///		addedOn
            ///		parentId
            ///		reference
            ///		disabled
            ///		approves
            ///		disapproves
            ///		flaggedInappropriate
            ///		message
            /// }</param>
            /// <returns>Dictionary containing {error:0,desc:"",subject:"blah",message:"blah"} when successfull or the error. </returns>
            public static Dictionary<string, object> AddReply(Dictionary<string, object> args) {
                ("FUNCTION /w SP addReply").Debug(10);
                Dictionary<string, object> j = new Dictionary<string, object>();
                Session session = null;
                bool preview = false;
                if(args.ContainsKey("sessionId")) {
                    session = new Session(Main.Site, new Guid((string)args["sessionId"]));
                } else {
                    session = Main.GetCurrentSession();
                }
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlTransaction trans = cn.BeginTransaction("reply")) {
                        if(args.ContainsKey("preview")) {
                            preview = (bool)args["preview"];
                        }
                        string replyId = Guid.NewGuid().ToString();
                        Guid parentId;
                        if(args.ContainsKey("replyId")) {
                            replyId = args["replyId"].ToString();
                        }
                        if(args.ContainsKey("parentId")) {
                            parentId = new Guid(args["parentId"].ToString());
                        } else {
                            j.Add("error", 2);
                            j.Add("description", "Key parentId is not present.");
                            return j;
                        }
                        /* email the Blog to which this reply belongs, if they like that sort of thing. */
                        //int nestCount = 0;
                        /*
                        BlogEntry entry = null;
                        while(entry == null) {
                            entry = Main.Site.Blogs.AllEntries.Find(delegate(BlogEntry be) {
                                return be.Id == parentId;
                            });
                            if(entry == null) {
                                Reply reply = Main.Site.Replies.List.Find(delegate(Commerce.Reply rp) {
                                    return rp.Id == parentId;
                                });
                                if(reply == null) {
                                    j.Add("error", 4);
                                    j.Add("description", "Could not find parent..");
                                    return j;
                                }
                                // step up until the parent is a Blog 
                                parentId = reply.ParentId;
                            }
                            nestCount++;
                        }
                        if(!entry.AllowComments) {
                            j.Add("error", 5);
                            j.Add("description", "This Blog does not allow comments.");
                            return j;
                        }
                        */
                        string email = args.KeyOrDefault("email", "").ToString();
                        string subject = args.KeyOrDefault("subject", "").ToString();
                        string rating = args.KeyOrDefault("rating", "").ToString();
                        string comment = args.KeyOrDefault("message", "").ToString();
                        string addedOn = args.KeyOrDefault("addedOn", DateTime.Now.ToString()).ToString();
                        string reference = args.KeyOrDefault("reference", "").ToString();
                        /* accept all messages instantly in test mode */
                        string disabled = args.KeyOrDefault("disabled", false).ToString();
                        string approves = args.KeyOrDefault("approves", 0).ToString();
                        string disapproves = args.KeyOrDefault("disapproves", 0).ToString();
                        string flaggedInappropriate = args.KeyOrDefault("flaggedInappropriate", false).ToString();
                        string commandText = @"dbo.insertReply @replyId, @email, 
					@subject, @rating, @userId, @comment, @addedOn, @parentId, 
					@reference, @disabled, @approves, @disapproves, @flaggedInappropriate";
                        using(SqlCommand cmd = new SqlCommand(commandText, cn, trans)) {
                            cmd.Parameters.Add("@replyId", SqlDbType.UniqueIdentifier).Value = new Guid(replyId);
                            cmd.Parameters.Add("@email", SqlDbType.VarChar).Value = email;
                            cmd.Parameters.Add("@subject", SqlDbType.VarChar).Value = subject;
                            cmd.Parameters.Add("@rating", SqlDbType.VarChar).Value = rating;
                            cmd.Parameters.Add("@userId", SqlDbType.Int).Value = session.UserId;
                            cmd.Parameters.Add("@comment", SqlDbType.VarChar).Value = comment;
                            cmd.Parameters.Add("@addedOn", SqlDbType.DateTime).Value = Convert.ToDateTime(addedOn);
                            cmd.Parameters.Add("@parentId", SqlDbType.UniqueIdentifier).Value = new Guid(parentId.ToString());
                            cmd.Parameters.Add("@reference", SqlDbType.VarChar).Value = reference;
                            cmd.Parameters.Add("@disabled", SqlDbType.Bit).Value = Convert.ToBoolean(disabled);
                            cmd.Parameters.Add("@approves", SqlDbType.Int).Value = Convert.ToInt32(approves);
                            cmd.Parameters.Add("@disapproves", SqlDbType.Int).Value = Convert.ToInt32(disapproves);
                            cmd.Parameters.Add("@flaggedInappropriate", SqlDbType.Int).Value = 0;
                            cmd.ExecuteNonQuery();
                            j.Add("subject", args["subject"].ToString());
                            j.Add("message", args["message"].ToString());
                            j.Add("replyId", replyId);
                            if(preview) {
                                trans.Rollback();
                            } else {
                                trans.Commit();
                            }
                        }
                        /*
                        if(!preview) {
                            Main.Site.Replies = new Commerce.Replies(Main.Site);
                            Main.Site.Blogs = new Commerce.Blogs(Main.Site);
                            Guid gReplyId = new Guid(replyId);
                            Commerce.Reply newReply = Main.Site.Replies.List.Find(delegate(Commerce.Reply rp) {
                                return rp.Id == gReplyId;
                            });
                            if(entry.EmailUpdates) {
                                CreateEmailEventArgs emailArgs =
                                new CreateEmailEventArgs("commentAdded",
                                Main.Site.site_operator_email,
                                entry.Author.Email, Main.Site.site_log_email,
                                entry.Author, session, newReply, entry);
                                DefaultEmails.CommentAdded(ref emailArgs);
                                Main.Site.raiseOncreateemail(emailArgs);
                                SendEmailArgResult(emailArgs, cn, null);
                            }
                        }
                         */
                        j.Add("blogEntryId", parentId);
                        j.Add("error", 0);
                        j.Add("description", "");
                    }
                }
                return j;
            }
            #endregion
        }
    }
}
