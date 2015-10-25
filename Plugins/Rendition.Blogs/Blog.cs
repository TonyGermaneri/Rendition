using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Data;
namespace Rendition {
    /// <summary>
    /// This class creates is a list of Blogs and their associated entries
    /// </summary>
    public class Blogs {
        /// <summary>
        /// List of Blogs on the site.
        /// </summary>
        public List<Blog> List = new List<Blog>();
        /// <summary>
        /// All Blog entries across all Blogs.
        /// </summary>
        public List<BlogEntry> AllEntries = new List<BlogEntry>();
        private Guid CurrentId = Guid.NewGuid();
        private Blog B;
        private int Counter = 0;
        /// <summary>
        /// Gets the Blog entry by id.
        /// </summary>
        /// <param name="entryId">The entry id.</param>
        /// <returns>Selected Blog entry.</returns>
        public static BlogEntry GetBlogEntryById(string entryId) {
            Guid id = new Guid(entryId);
            return BlogPlugin.Blogs.AllEntries.Find(delegate(BlogEntry be) {
                return be.Id == id;
            });
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="Blogs"/> class.
        /// </summary>
        /// <param name="site">The site.</param>
        public Blogs(Site site) {
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand("dbo.getBlogCategories", cn)) {
                    using(SqlDataReader blog_list = cmd.ExecuteReader()) {
                        while(blog_list.Read()) {
                            Counter++;
                            if(!(CurrentId == blog_list.GetGuid(19))) {
                                CurrentId = blog_list.GetGuid(19);
                                B = new Blog(
                                    blog_list.GetGuid(19),
                                    blog_list.GetString(20),
                                    blog_list.GetBoolean(21),
                                    blog_list.GetInt32(22),
                                    blog_list.GetBoolean(23),
                                    blog_list.GetString(24),
                                    site
                                );
                                List.Add(B);
                            }
                            BlogEntry e = new BlogEntry(
                                blog_list.GetGuid(0),
                                blog_list.GetString(1),
                                blog_list.GetString(2),
                                blog_list.GetString(3),
                                blog_list.GetString(4),
                                blog_list.GetInt32(5),
                                blog_list.GetInt32(6),
                                blog_list.GetDateTime(7),
                                blog_list.GetDateTime(8),
                                blog_list.GetInt32(9),
                                blog_list.GetString(10),
                                blog_list.GetBoolean(11),
                                blog_list.GetBoolean(12),
                                blog_list.GetBoolean(13),
                                blog_list.GetBoolean(14),
                                blog_list.GetString(15),
                                blog_list.GetBoolean(16),
                                blog_list.GetInt32(17),
                                blog_list.GetBoolean(18),
                                blog_list.GetGuid(25),
                                B,
                                site
                            );
                            B.Add(e);
                            AllEntries.Add(e);
                        }
                    }
                }
            }
        }
        /// <summary>
        /// Gets the Blog by name.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <returns>Selected Blog.</returns>
        public static Blog GetBlogByName(string name) {
            return BlogPlugin.Blogs.List.Find(delegate(Blog blog) {
                return blog.CategoryName == name;
            });
        }
        /// <summary>
        /// Gets the Blog by id.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>Selected Blog.</returns>
        public static Blog GetBlogById(Guid id) {
            return BlogPlugin.Blogs.List.Find(delegate(Blog blog) {
                return blog.Id == id;
            });
        }
    }
    /// <summary>
    /// This class creates is a single Blog entry.
    /// </summary>
    public class BlogEntry {
        /// <summary>
        /// Id of this Blog entry.
        /// </summary>
        public Guid Id;
        /// <summary>
        /// Relies belonging to this Blog entry.
        /// </summary>
        public List<Commerce.Reply> Replies;
        /// <summary>
        /// Subject of this Blog.
        /// </summary>
        public string Subject;
        /// <summary>
        /// Blog message body.
        /// </summary>
        public string Message;
        /// <summary>
        /// Comments on the Blog.
        /// </summary>
        public string Comments;
        /// <summary>
        /// Tags associated with the Blog in a CSV list.
        /// </summary>
        public string Tags;
        /// <summary>
        /// The userId of the user who is the editor for this Blog entry.
        /// </summary>
        public int EditorId;
        /// <summary>
        /// The userId of the user who is the Author for this Blog entry.
        /// </summary>
        public int AuthorId;
        /// <summary>
        /// The Author of this Blog entry.
        /// </summary>
        public Commerce.User Author;
        /// <summary>
        /// The editor of this Blog entry.
        /// </summary>
        public Commerce.User Editor;
        /// <summary>
        /// The date this Blog entry was added.
        /// </summary>
        public DateTime AddDate;
        /// <summary>
        /// The date this Blog entry was last changed.
        /// </summary>
        public DateTime DateChanged;
        /// <summary>
        /// The userId of the last person who edited this Blog entry (not implemented).
        /// </summary>
        public int LastEditor;
        /// <summary>
        /// Annotations for this Blog entry (not implmented).
        /// </summary>
        public string Annotations;
        /// <summary>
        /// Is this Blog entry enabled?
        /// </summary>
        public bool Enabled;
        /// <summary>
        /// Does the Author/editor want to audit all comments before they are publicly visible?
        /// </summary>
        public bool AuditComments;
        /// <summary>
        /// Does the Author/editor want to allow comments on this Blog entry?
        /// </summary>
        public bool AllowComments;
        /// <summary>
        /// Does the Author/editor want to be updated via email when this Blog entry has a comment posted to it?
        /// </summary>
        public bool EmailUpdates;
        /// <summary>
        /// The path to the single image associated with this Blog.
        /// </summary>
        public string BlogImage;
        /// <summary>
        /// Is this Blog editable by any administrative user or only by the Author/editor?
        /// </summary>
        public bool PublicBlog;
        /// <summary>
        /// The order this Blog will appear in when ordered by list order.
        /// </summary>
        public int ListOrder;
        /// <summary>
        /// Is this Blog archnived (no longer visible)?
        /// </summary>
        public bool Archive;
        /// <summary>
        /// The lead in to the Blog entry.  Specified by a h6 html block in the main article.
        /// </summary>
        public string Introduction;
        /// <summary>
        /// the Blog this Blog entry belongs to.
        /// </summary>
        public Blog Blog;
        /// <summary>
        /// the galleryId that this Blog is associated with.
        /// </summary>
        public Guid GalleryId;
        /// <summary>
        /// The gallery that belongs to this Blog.
        /// </summary>
        public Gallery Gallery;
        /// <summary>
        /// If this Blog has a h6 block for the introduction area this will be set true.
        /// </summary>
        public bool HasIntroduction = false;
        /// <summary>
        /// Initializes a new instance of the <see cref="BlogEntry"/> class.
        /// </summary>
        public BlogEntry() { }
        /// <summary>
        /// Initializes a new instance of the <see cref="BlogEntry"/> class.
        /// </summary>
        /// <param name="f_id">The f_id.</param>
        /// <param name="f_subject">The f_subject.</param>
        /// <param name="f_message">The f_message.</param>
        /// <param name="f_comments">The f_comments.</param>
        /// <param name="f_tags">The f_tags.</param>
        /// <param name="f_editor">The f_editor.</param>
        /// <param name="f_author">The f_author.</param>
        /// <param name="f_addDate">The f_add date.</param>
        /// <param name="f_dateChanged">The f_date changed.</param>
        /// <param name="f_lastEditor">The f_last editor.</param>
        /// <param name="f_annotations">The f_annotations.</param>
        /// <param name="f_enabled">if set to <c>true</c> [f_enabled].</param>
        /// <param name="f_auditComments">if set to <c>true</c> [f_audit comments].</param>
        /// <param name="f_allowComments">if set to <c>true</c> [f_allow comments].</param>
        /// <param name="f_emailUpdates">if set to <c>true</c> [f_email updates].</param>
        /// <param name="f_blogImage">The f_blog image.</param>
        /// <param name="f_publicBlog">if set to <c>true</c> [f_public Blog].</param>
        /// <param name="f_listOrder">The f_list order.</param>
        /// <param name="f_archive">if set to <c>true</c> [f_archive].</param>
        /// <param name="f_galleryId">The f_gallery id.</param>
        /// <param name="_blog">The _blog.</param>
        /// <param name="site">The site.</param>
        public BlogEntry(Guid f_id, string f_subject, string f_message, string f_comments, string f_tags, int f_editor, int f_author, DateTime f_addDate,
            DateTime f_dateChanged, int f_lastEditor, string f_annotations, bool f_enabled, bool f_auditComments, bool f_allowComments,
            bool f_emailUpdates, string f_blogImage, bool f_publicBlog, int f_listOrder, bool f_archive, Guid f_galleryId, Blog _blog, Site site) {
            Id = f_id;
            Subject = f_subject.Trim();
            Message = f_message;
            Comments = f_comments;
            Tags = f_tags.Trim();
            EditorId = f_editor;
            AuthorId = f_author;
            AddDate = f_addDate;
            DateChanged = f_dateChanged;
            LastEditor = f_lastEditor;
            Annotations = f_annotations;
            Enabled = f_enabled;
            AuditComments = f_auditComments;
            AllowComments = f_allowComments;
            EmailUpdates = f_emailUpdates;
            BlogImage = f_blogImage;
            PublicBlog = f_publicBlog;
            ListOrder = f_listOrder;
            Archive = f_archive;
            Blog = _blog;
            GalleryId = f_galleryId;
            Gallery = BlogPlugin.Galleries.List.Find(delegate(Gallery gal) {
                return gal.Id == GalleryId;
            });
            Replies = Commerce.Reply.All.FindAll(delegate(Rendition.Commerce.Reply reply) {
                return (reply.ParentId == f_id)
                && ((reply.FlaggedInappropriate < site.inappropriateHideThreshold) || reply.FlaggedOk);
            });
            Author = Commerce.User.All.Find(delegate(Commerce.User u) {
                return u.UserId == f_author;
            });
            Editor = Commerce.User.All.Find(delegate(Commerce.User u) {
                return u.UserId == f_editor;
            });
            Introduction = Message;
            if(Message.Contains("<h6")) {
                HasIntroduction = true;
                string i = Message.Substring(0, Message.IndexOf("<h6") - 4);
                i = Regex.Replace(i, "(<h6>)|(</h6>)", "", RegexOptions.IgnoreCase);
                Introduction = i;
                Message = Regex.Replace(Message, "(<h6>)|(</h6>)", "", RegexOptions.IgnoreCase);
            }
        }
    }
    /// <summary>
    /// This class creates is a Blog (news section) - a collection of Blog entries (articles).
    /// </summary>
    public class Blog {
        /// <summary>
        /// List of all the entries for this Blog.
        /// </summary>
        public List<BlogEntry> Entries = new List<BlogEntry>();
        /// <summary>
        /// Id of this Blog.
        /// </summary>
        public Guid Id;
        /// <summary>
        /// The name of this Blog.
        /// </summary>
        public string CategoryName;
        /// <summary>
        /// Is this Blog editable by any administrative user or only the Author/editor.
        /// </summary>
        public bool PublicCategory;
        /// <summary>
        /// the userId of the Author.
        /// </summary>
        public int AuthorId;
        /// <summary>
        /// The Author.
        /// </summary>
        public Commerce.User Author;
        /// <summary>
        /// This Blog shows up in the news ticker.
        /// </summary>
        public bool ShowInTicker;
        /// <summary>
        /// The page this Blog feels at home on.
        /// </summary>
        public string BlogPage;
        /// <summary>
        /// Initializes a new instance of the <see cref="Blog"/> class.
        /// </summary>
        /// <param name="f_id">The f_id.</param>
        /// <param name="f_categoryName">Name of the f_category.</param>
        /// <param name="f_publicCategory">if set to <c>true</c> [f_public category].</param>
        /// <param name="f_author">The f_author.</param>
        /// <param name="f_showInTicker">if set to <c>true</c> [f_show in ticker].</param>
        /// <param name="f_blogPage">The f_blog page.</param>
        public Blog(Guid f_id, string f_categoryName, bool f_publicCategory, int f_author, bool f_showInTicker, string f_blogPage) {
            LoadBlog(f_id, f_categoryName, f_publicCategory, f_author, f_showInTicker, f_blogPage, Site.CurrentSite);
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="Blog"/> class.
        /// </summary>
        /// <param name="f_id">The f_id.</param>
        /// <param name="f_categoryName">Name of the f_category.</param>
        /// <param name="f_publicCategory">if set to <c>true</c> [f_public category].</param>
        /// <param name="f_author">The f_author.</param>
        /// <param name="f_showInTicker">if set to <c>true</c> [f_show in ticker].</param>
        /// <param name="f_blogPage">The f_blog page.</param>
        /// <param name="site">The site.</param>
        public Blog(Guid f_id, string f_categoryName, bool f_publicCategory, int f_author, bool f_showInTicker, string f_blogPage, Site site) {
            LoadBlog(f_id, f_categoryName, f_publicCategory, f_author, f_showInTicker, f_blogPage, site);
        }
        /// <summary>
        /// Loads the Blog.
        /// </summary>
        /// <param name="f_id">The f_id.</param>
        /// <param name="f_categoryName">Name of the f_category.</param>
        /// <param name="f_publicCategory">if set to <c>true</c> [f_public category].</param>
        /// <param name="f_author">The f_author.</param>
        /// <param name="f_showInTicker">if set to <c>true</c> [f_show in ticker].</param>
        /// <param name="f_blogPage">The f_blog page.</param>
        /// <param name="site">The site.</param>
        private void LoadBlog(Guid f_id, string f_categoryName, bool f_publicCategory, int f_author, bool f_showInTicker, string f_blogPage, Site site) {
            Id = f_id;
            CategoryName = f_categoryName;
            PublicCategory = f_publicCategory;
            AuthorId = f_author;
            Author = Commerce.User.All.Find(delegate(Commerce.User u) {
                return u.UserId == f_author;
            });
            if(Author == null) {
                Author = site.NullUser;
            }
            ShowInTicker = f_showInTicker;
            BlogPage = f_blogPage;
        }
        /// <summary>
        /// Adds the specified new_blog.
        /// </summary>
        /// <param name="new_blog">The new_blog.</param>
        public void Add(BlogEntry new_blog) {
            Entries.Add(new_blog);
            return;
        }
        /// <summary>
        /// Gets the total number of Blog pages.  This is a 1 based count. e.g.: 1,2,3,4,5...
        /// </summary>
        /// <param name="blogsPerPage">The Blogs per page.</param>
        /// <returns>Total number of Blog pages</returns>
        public int PagesTotal(int blogsPerPage) {
            decimal pagesTotal = Convert.ToDecimal(this.Entries.Count) / Convert.ToDecimal(blogsPerPage);
            if(this.Entries.Count % blogsPerPage > 0) { pagesTotal++; }
            pagesTotal++;/*make it 1 based */
            return Convert.ToInt32(pagesTotal);
        }
        /// <summary>
        /// Gets a list of Blog entries for a certain page.  The page is 1 based so page 1 is 1, not 0.
        /// </summary>
        /// <param name="page">The page.</param>
        /// <param name="blogsPerPage">Enter per page.</param>
        /// <returns></returns>
        public List<BlogEntry> GetPage(int page, int blogsPerPage) {
            List<BlogEntry> pageEntries = new List<BlogEntry>();
            int totalPages = (this.Entries.Count / blogsPerPage) - blogsPerPage;
            if(this.Entries.Count % blogsPerPage > 0) { totalPages++; }
            int start = page * (blogsPerPage) - blogsPerPage;
            int end = start + blogsPerPage;
            if(end > this.Entries.Count) {
                end = this.Entries.Count;
            }
            for(int x = start; end > x; x++) {
                pageEntries.Add(this.Entries[x]);
            }
            return pageEntries;
        }
    }
}
