using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.SqlClient;
namespace Rendition {
    /// <summary>
    /// This class creates a single image for the gallery class
    /// </summary>
    public class GalleryImage {
        /// <summary>
        /// Id of the image.
        /// </summary>
        public Guid Id;
        /// <summary>
        /// path to the orginal image.
        /// </summary>
        public string Path;
        /// <summary>
        /// Link for when the image is clicked.
        /// </summary>
        public string Link;
        /// <summary>
        /// Title of the image.
        /// </summary>
        public string Title;
        /// <summary>
        /// Cropping X coordinate.
        /// </summary>
        public int CropX;
        /// <summary>
        /// Cropping Y coordinate.
        /// </summary>
        public int CropY;
        /// <summary>
        /// Cropping height.
        /// </summary>
        public int CropH;
        /// <summary>
        /// Cropping width.
        /// </summary>
        public int CropW;
        /// <summary>
        /// Height of the image.
        /// </summary>
        public int Height;
        /// <summary>
        /// Width of the image.
        /// </summary>
        public int Width;
        /// <summary>
        /// Comments.
        /// </summary>
        public string Comments;
        /// <summary>
        /// Description of the image.
        /// </summary>
        public string Description;
        /// <summary>
        /// Does this image show up in the list?
        /// </summary>
        public bool Enabled;
        /// <summary>
        /// The order this image appears in in the rotating list.
        /// </summary>
        public int RotatorOrder;
        /// <summary>
        /// The order this image appears in in the thumbnail list.
        /// </summary>
        public int ThumbOrder;
        /// <summary>
        /// Height of the rotator image.
        /// </summary>
        public int RotatorHeight;
        /// <summary>
        /// Width of the rotator image.
        /// </summary>
        public int RotatorWidth;
        /// <summary>
        /// Height of the thumbnail image.
        /// </summary>
        public int ThumbHeight;
        /// <summary>
        /// Width of the thumbnail image.
        /// </summary>
        public int ThumbWidth;
        /// <summary>
        /// The userId of the user who uploaded this image.
        /// </summary>
        public int UserId;
        /// <summary>
        /// The date this image was added.
        /// </summary>
        public DateTime AddDate;
        /// <summary>
        /// The height of the Blog image.
        /// </summary>
        public int BlogHeight;
        /// <summary>
        /// The width of the Blog image.
        /// </summary>
        public int BlogWidth;
        /// <summary>
        /// The height of the portfolio image.
        /// </summary>
        public int PortfolioHeight;
        /// <summary>
        /// The width of the portfolio image.
        /// </summary>
        public int PortfolioWidth;
        /// <summary>
        /// Tags, in a CSV list associated with this image.
        /// </summary>
        public string Tags;
        /// <summary>
        /// Tags that when this image is clicked the system should search for.
        /// </summary>
        public string TagsToSearchFor;
        /// <summary>
        /// EXIF data associated with this image.
        /// </summary>
        public string EXIF;
        /// <summary>
        /// Rotator image path.
        /// </summary>
        public string Rotator;
        /// <summary>
        /// Thumbnail image path.
        /// </summary>
        public string Thumb;
        /// <summary>
        /// Full size image path (not original).
        /// </summary>
        public string Full;
        /// <summary>
        /// Portfolio image path.
        /// </summary>
        public string Portfolio;
        /// <summary>
        /// Blog image path.
        /// </summary>
        public string Blog;
        /// <summary>
        /// Initializes a new instance of the <see cref="GalleryImage"/> class.
        /// </summary>
        /// <param name="f_id">The f_id.</param>
        /// <param name="f_path">The f_path.</param>
        /// <param name="f_link">The f_link.</param>
        /// <param name="f_title">The f_title.</param>
        /// <param name="f_cropX">The f_crop X.</param>
        /// <param name="f_cropY">The f_crop Y.</param>
        /// <param name="f_cropH">The f_crop H.</param>
        /// <param name="f_cropW">The f_crop W.</param>
        /// <param name="f_height">The f_height.</param>
        /// <param name="f_width">The f_width.</param>
        /// <param name="f_comments">The f_comments.</param>
        /// <param name="f_description">The f_description.</param>
        /// <param name="f_enabled">if set to <c>true</c> [f_enabled].</param>
        /// <param name="f_rotator_order">The f_rotator_order.</param>
        /// <param name="f_thumb_order">The f_thumb_order.</param>
        /// <param name="f_rotatorHeight">Height of the f_rotator.</param>
        /// <param name="f_rotatorWidth">Width of the f_rotator.</param>
        /// <param name="f_thumbHeight">Height of the f_thumb.</param>
        /// <param name="f_thumbWidth">Width of the f_thumb.</param>
        /// <param name="f_userid">The f_userid.</param>
        /// <param name="f_addDate">The f_add date.</param>
        /// <param name="f_blogHeight">Height of the f_blog.</param>
        /// <param name="f_blogWidth">Width of the f_blog.</param>
        /// <param name="f_portfolioHeight">Height of the f_portfolio.</param>
        /// <param name="f_portfolioWidth">Width of the f_portfolio.</param>
        /// <param name="f_tags">The f_tags.</param>
        /// <param name="f_tagsToSearchFor">The f_tags to search for.</param>
        /// <param name="f_exif">The f_exif.</param>
        /// <param name="imageX">The image X.</param>
        /// <param name="imageY">The image Y.</param>
        /// <param name="categoryName">Name of the category.</param>
        /// <param name="categoryId">The category id.</param>
        public GalleryImage(Guid f_id, string f_path, string f_link, string f_title, int f_cropX, int f_cropY, int f_cropH, int f_cropW, int f_height,
            int f_width, string f_comments, string f_description, bool f_enabled, int f_rotator_order, int f_thumb_order, int f_rotatorHeight, int f_rotatorWidth,
            int f_thumbHeight, int f_thumbWidth, int f_userid, DateTime f_addDate, int f_blogHeight, int f_blogWidth, int f_portfolioHeight, int f_portfolioWidth,
            string f_tags, string f_tagsToSearchFor, string f_exif, int imageX, int imageY, string categoryName, Guid categoryId) {
            Id = f_id;
            Path = f_path;
            Link = f_link;
            Title = f_title;
            CropX = f_cropX;
            CropY = f_cropY;
            CropH = f_cropH;
            CropW = f_cropW;
            Height = f_height;
            Width = f_width;
            Comments = f_comments;
            Description = f_description;
            Enabled = f_enabled;
            RotatorOrder = f_rotator_order;
            ThumbOrder = f_thumb_order;
            RotatorHeight = f_rotatorHeight;
            RotatorWidth = f_rotatorWidth;
            ThumbHeight = f_thumbHeight;
            ThumbWidth = f_thumbWidth;
            UserId = f_userid;
            AddDate = f_addDate;
            BlogHeight = f_blogHeight;
            BlogWidth = f_blogWidth;
            PortfolioHeight = f_portfolioHeight;
            PortfolioWidth = f_portfolioWidth;
            Tags = f_tags;
            TagsToSearchFor = f_tagsToSearchFor;
            EXIF = f_exif;
            Rotator = "/img/gallery/" + categoryName.UrlEncode() + "/" + this.Id.ToFileName() + "r" + ".jpg";
            Thumb = "/img/gallery/" + categoryName.UrlEncode() + "/" + this.Id.ToFileName() + "t" + ".jpg";
            Full = "/img/gallery/" + categoryName.UrlEncode() + "/" + this.Id.ToFileName() + "f" + ".jpg";
            Portfolio = "/img/gallery/" + categoryName.UrlEncode() + "/" + this.Id.ToFileName() + "p" + ".jpg";
            Blog = "/img/gallery/" + categoryName.UrlEncode() + "/" + this.Id.ToFileName() + "b" + ".jpg";
        }
    }
    /// <summary>
    /// This class creates a list of image galleries and associated images
    /// </summary>
    public class Gallery {
        /// <summary>
        /// List of images in this gallery.
        /// </summary>
        public List<GalleryImage> Images = new List<GalleryImage>();
        /// <summary>
        /// Count of images in this gallery.
        /// </summary>
        public int Count = -1;
        /// <summary>
        /// Id of this gallery.
        /// </summary>
        public Guid Id;
        /// <summary>
        /// Name of this gallery.
        /// </summary>
        public string Name;
        /// <summary>
        /// Height of the gallery rotator.
        /// </summary>
        public int Height;
        /// <summary>
        /// Width of the gallery rotator.
        /// </summary>
        public int Width;
        /// <summary>
        /// Resize method (not implemented).
        /// </summary>
        public int ResizeMethod;
        /// <summary>
        /// The template Id used to create the rotator image.
        /// </summary>
        public Guid RotatorTemplate;
        /// <summary>
        /// The template Id used to create the thumbnail image.
        /// </summary>
        public Guid ThumbTemplate;
        /// <summary>
        /// The template Id used to create the full size image.
        /// </summary>
        public Guid FullSizeTemplate;
        /// <summary>
        /// The template Id used to create the portfolio image.
        /// </summary>
        public Guid PortfolioTemplate;
        /// <summary>
        /// The template Id used to create the Blog image.
        /// </summary>
        public Guid BlogTemplate;
        /// <summary>
        /// Is this a gallery?
        /// </summary>
        public bool IsGallery;
        /// <summary>
        /// Descripton of the gallery.
        /// </summary>
        public String GalleryDescription;
        /// <summary>
        /// The order this gallery appears in with its siblings.
        /// </summary>
        public int GalleryOrder;
        /// <summary>
        /// CSV list of keywords associated with this gallery.
        /// </summary>
        public string Tags;
        /// <summary>
        /// Initializes a new instance of the <see cref="Gallery"/> class.
        /// </summary>
        /// <param name="f_id">The f_id.</param>
        /// <param name="f_name">The f_name.</param>
        /// <param name="f_height">The f_height.</param>
        /// <param name="f_width">The f_width.</param>
        /// <param name="f_resizeMethod">The f_resize method.</param>
        /// <param name="f_rotatorTemplate">The f_rotator template.</param>
        /// <param name="f_thumbTemplate">The f_thumb template.</param>
        /// <param name="f_fullsizeTemplate">The f_fullsize template.</param>
        /// <param name="f_portfolioTemplate">The f_portfolio template.</param>
        /// <param name="f_blogTemplate">The f_blog template.</param>
        /// <param name="f_gallery">if set to <c>true</c> [f_gallery].</param>
        /// <param name="f_gallery_description">The f_gallery_description.</param>
        /// <param name="f_gallery_order">The f_gallery_order.</param>
        /// <param name="f_tags">The f_tags.</param>
        public Gallery(Guid f_id, string f_name, int f_height, int f_width, int f_resizeMethod, Guid f_rotatorTemplate,
            Guid f_thumbTemplate, Guid f_fullsizeTemplate, Guid f_portfolioTemplate, Guid f_blogTemplate, bool f_gallery,
            String f_gallery_description, int f_gallery_order, string f_tags) {
            Id = f_id;
            Name = f_name;
            Height = f_height;
            Width = f_width;
            ResizeMethod = f_resizeMethod;
            RotatorTemplate = f_rotatorTemplate;
            ThumbTemplate = f_thumbTemplate;
            FullSizeTemplate = f_fullsizeTemplate;
            PortfolioTemplate = f_portfolioTemplate;
            BlogTemplate = f_blogTemplate;
            IsGallery = f_gallery;
            GalleryDescription = f_gallery_description;
            GalleryOrder = f_gallery_order;
            Tags = f_tags;
        }
        /// <summary>
        /// Adds the specified new_image.
        /// </summary>
        /// <param name="new_image">The new_image.</param>
        public void Add(GalleryImage new_image) {
            Images.Add(new_image);
            Count = Images.Count;
        }
    }
    /// <summary>
    /// A list of galleries from the database
    /// </summary>
    public class Galleries {
        /// <summary>
        /// Every gallery in the database.
        /// </summary>
        public List<Gallery> List = new List<Gallery>();
        private Gallery G;
        /// <summary>
        /// Gets the entire gallery by looking up an image in the gallery.
        /// </summary>
        /// <param name="galleryImageId">The gallery image id.</param>
        /// <returns>{error:0,desc:"error description",gallery:GalleryObject}.</returns>
        public static Dictionary<string, object> GetGallery(string galleryImageId) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            j.Add("error", 0);
            j.Add("description", "");
            j.Add("gallery", BlogPlugin.Galleries.List.Find(delegate(Gallery gal) {
                return gal.Id == new Guid(galleryImageId);
            }));
            return j;
        }
        /// <summary>
        /// Gets the 'next' image.
        /// </summary>
        /// <param name="galleryImageId">The gallery image id.</param>
        /// <returns>{error:0,desc:"error description",rotator:path,Blog:path,full:path,portfolio:path,
        /// thumb:path,title:title,description:description,link:link,exif:exif data,tags:tag CSV,tagsToSearchFor:search tags CSV}.</returns>
        public Dictionary<string, object> GetNextGalleryImage(string galleryImageId) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            j.Add("error", 0);
            j.Add("description", "");
            foreach(Gallery g in List) {
                for(int x = 0; g.Images.Count > x; x++) {
                    if(g.Images[x].Id == new Guid(galleryImageId)) {
                        int ord = x;
                        if(ord == g.Images.Count) {
                            ord = 0;
                        }
                        j.Add("rotator", g.Images[ord].Rotator);
                        j.Add("Blog", g.Images[ord].Blog);
                        j.Add("full", g.Images[ord].Full);
                        j.Add("portfolio", g.Images[ord].Portfolio);
                        j.Add("thumb", g.Images[ord].Thumb);
                        j.Add("title", g.Images[ord].Title);
                        j.Add("description", g.Images[ord].Description);
                        j.Add("link", g.Images[ord].Link);
                        j.Add("exif", g.Images[ord].EXIF);
                        j.Add("tags", g.Images[ord].Tags);
                        j.Add("tagsToSearchFor", g.Images[ord].TagsToSearchFor);
                        return j;
                    }
                }
            }
            j.Add("error", -1);
            j.Add("description", "gallery not found.");
            return j;
        }
        /// <summary>
        /// Gets the gallery by looking up its name in the database.
        /// </summary>
        /// <param name="galleryName">Name of the gallery.</param>
        /// <returns>Selected gallery or null</returns>
        public static Gallery GetGalleryByName(string galleryName) {
            return BlogPlugin.Galleries.List.Find(delegate(Gallery gal) {
                return gal.Name == galleryName;
            });
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="Galleries"/> class.
        /// </summary>
        /// <param name="site">The site.</param>
        public Galleries(Site site) {
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand("dbo.getGalleries", cn)) {
                    Guid currentId = Guid.NewGuid();
                    using(SqlDataReader gallery_list = cmd.ExecuteReader()) {
                        while(gallery_list.Read()) {
                            if(currentId != gallery_list.GetGuid(28)) {
                                currentId = gallery_list.GetGuid(28);
                                G = new Gallery(
                                    gallery_list.GetGuid(28),
                                    gallery_list.GetString(29),
                                    gallery_list.GetInt32(30),
                                    gallery_list.GetInt32(31),
                                    gallery_list.GetInt32(32),
                                    gallery_list.GetGuid(33),
                                    gallery_list.GetGuid(34),
                                    gallery_list.GetGuid(35),
                                    gallery_list.GetGuid(36),
                                    gallery_list.GetGuid(37),
                                    gallery_list.GetBoolean(38),
                                    gallery_list.GetString(39),
                                    gallery_list.GetInt32(40),
                                    gallery_list.GetString(41)
                                );
                                List.Add(G);
                            }
                            G.Add(new GalleryImage(
                                gallery_list.GetGuid(0),
                                gallery_list.GetString(1),
                                gallery_list.GetString(2),
                                gallery_list.GetString(3),
                                gallery_list.GetInt32(4),
                                gallery_list.GetInt32(5),
                                gallery_list.GetInt32(6),
                                gallery_list.GetInt32(7),
                                gallery_list.GetInt32(8),
                                gallery_list.GetInt32(9),
                                gallery_list.GetString(10),
                                gallery_list.GetString(11),
                                gallery_list.GetBoolean(12),
                                gallery_list.GetInt32(13),
                                gallery_list.GetInt32(14),
                                gallery_list.GetInt32(15),
                                gallery_list.GetInt32(16),
                                gallery_list.GetInt32(17),
                                gallery_list.GetInt32(18),
                                gallery_list.GetInt32(19),
                                gallery_list.GetDateTime(20),
                                gallery_list.GetInt32(21),
                                gallery_list.GetInt32(22),
                                gallery_list.GetInt32(23),
                                gallery_list.GetInt32(24),
                                gallery_list.GetString(25),
                                gallery_list.GetString(26),
                                gallery_list.GetString(27),
                                gallery_list.GetInt32(42),
                                gallery_list.GetInt32(43),
                                gallery_list.GetString(29),
                                gallery_list.GetGuid(28)
                            ));
                        }
                    }
                }
            }
        }
        /// <summary>
        /// Adds the specified new_gallery.
        /// </summary>
        /// <param name="new_gallery">The new_gallery.</param>
        public void Add(Gallery new_gallery) {
            List.Add(new_gallery);
        }
    }
}
