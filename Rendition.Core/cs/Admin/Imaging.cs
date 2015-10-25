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
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Linq;
using BarcodeLib;
using System.IO;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Data;
using System.Web;
using System.Drawing;
namespace Rendition {
	public partial class Admin {
		/// <summary>
		/// Refreshes the item images.
		/// </summary>
		/// <param name="itemNumber">The item number.</param>
		/// <param name="locationArray">The location array.</param>
		/// <param name="uniqueSiteId">The unique site id.</param>
		/// <param name="onlyRenderThisImageId">The only render this image id.  Render all when Guid.Empty.</param>
		/// <returns></returns>
		public static Dictionary<string, object> RefreshItemImages( string itemNumber, string[] locationArray,
		Guid uniqueSiteId, Guid onlyRenderThisImageId ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			string[] als = { "m", "c", "f", "t", "a", "x", "y", "z", "b", "d" };
			string[] ls = new string[ ( int )Utilities.Iif( locationArray.Length == 0, als.Length, locationArray.Length ) ];
			if( locationArray.Length != 0 ) {
				locationArray.CopyTo( ls, 0 );
			} else {
				als.CopyTo( ls, 0 );
			}
            using(Impersonation imp = new Impersonation()) {
                foreach(SiteImagePlaceholder p in Main.Site.SiteImagePlaceholders.List) {
                    if(uniqueSiteId == p.SiteId || uniqueSiteId == Guid.Empty) {
                        List<Commerce.Image> current = Main.Site.ItemImages.List.FindAll(delegate(Commerce.Image img) {
                            return img.ItemNumber == itemNumber;
                        });
                        foreach(Commerce.Image r in current) {
                            if((onlyRenderThisImageId != Guid.Empty) && onlyRenderThisImageId != r.Id) {
                                continue;
                            }
                            string fileExt = Path.GetExtension(r.FileName);
                            string filePath = Main.PhysicalApplicationPath + "img\\items\\" + itemNumber + "\\" + r.Id.ToFileName() +
                            fileExt;
                            string oldStyleFilePath = "";
                            /* check for an older style file path */
                            if(!File.Exists(filePath)) {
                                oldStyleFilePath = Main.PhysicalApplicationPath + "img\\items\\" + itemNumber + "\\" + r.Id.ToString().Replace("-", "_") + r.FileName +
                                fileExt;
                            }
                            if(!File.Exists(filePath) && oldStyleFilePath == "") {
                                j.Add("error", -5);
                                j.Add("description", "Source file does not exist.");
                                return j;
                            }
                            if(oldStyleFilePath.Length != 0) {
                                filePath = oldStyleFilePath;
                            }
                            if(!File.Exists(filePath)) {
                                Exception ex = new Exception(
                                    String.Format("Source file is missing. Path: {0}, Item: {1}, ImageId: {2} ",
                                        filePath,
                                        itemNumber,
                                        r.Id
                                    )
                                );
                                throw ex;
                            }
                            System.Drawing.Bitmap img = new System.Drawing.Bitmap(filePath);
                            foreach(string l in ls) {
                                Guid templateId = p.ImageTypes[l];
                                Guid imagingDetailId = Guid.NewGuid();
                                Guid imagingId = r.Id;
                                System.Drawing.Bitmap target = (System.Drawing.Bitmap)img.Clone();
                                try {
                                    target = ApplyImageTemplate(templateId.ToString(), target);
                                } catch(Exception e) {
                                    j.Add("error", -2);
                                    j.Add("description", e.Message);
                                }
                                string targetFileName = imagingDetailId.ToFileName() + fileExt;
                                string targetPath = Main.PhysicalApplicationPath + "img\\items\\" + p.SiteAddress + "\\" + itemNumber;
                                if(!Directory.Exists(targetPath)) {
                                    Directory.CreateDirectory(targetPath);
                                }
                                if(fileExt == "png") {
                                    target.Save(targetPath + "\\" + targetFileName, System.Drawing.Imaging.ImageFormat.Png);
                                } else {
                                    target.SaveJpg(targetPath + "\\" + targetFileName, Main.Compression);
                                }
                                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                                    cn.Open();
                                    using(SqlCommand cmd = new SqlCommand("dbo.insertItemImageDetail @imagingDetailId,@imagingId,@unique_siteId,@itemnumber,@width,@height,@fileName,@locationType", cn)) {
                                        cmd.Parameters.Add("@imagingDetailId", SqlDbType.UniqueIdentifier).Value = new Guid(imagingDetailId.ToString());
                                        cmd.Parameters.Add("@imagingId", SqlDbType.UniqueIdentifier).Value = new Guid(imagingId.ToString());
                                        cmd.Parameters.Add("@unique_siteId", SqlDbType.UniqueIdentifier).Value = new Guid(p.SiteId.ToString());
                                        cmd.Parameters.Add("@itemnumber", SqlDbType.VarChar).Value = itemNumber;
                                        cmd.Parameters.Add("@width", SqlDbType.BigInt).Value = target.Height;
                                        cmd.Parameters.Add("@height", SqlDbType.BigInt).Value = target.Width;
                                        cmd.Parameters.Add("@fileName", SqlDbType.VarChar).Value = targetFileName;
                                        cmd.Parameters.Add("@locationType", SqlDbType.VarChar).Value = l;
                                        cmd.ExecuteNonQuery();
                                    }
                                }
                                target.Dispose();
                            }
                            /* load new images into the site's in-memory cache */
                            Main.Site.RenderedImages = new Commerce.RenderedImages(Main.Site);
                            Main.Site.ItemImages = new Commerce.ItemImages(Main.Site);
                            /* refresh lists loaded into this item. */
                            Main.Site.Items.GetItemByItemNumber(itemNumber).RefreshImages(Main.Site);
                        }
                    }
                }
            }
			j.Add( "error", 0 );
			j.Add( "description", "" );
			return j;
		}
		/// <summary>
		/// Deletes an item image.
		/// </summary>
		/// <param name="args">{imageId}</param>
		/// <returns></returns>
		public static Dictionary<string, object> DeleteImage( Dictionary<string, object> args ) {
			( "FUNCTION /w SP,File System I/O,deleteImage" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
			string commandText = @"/* delete file list */
			select 'img\items\'+c.siteaddress+'\'+rtrim(itemNumber)+'\'+fileName from imagingDetail d  with (nolock)
			inner join site_configuration c with (nolock) on c.unique_siteID = d.unique_siteId
			where ImagingId = @imagingId
			union all
			select 'img\items\'+rtrim(itemNumber)+'\'+fileName from imaging with (nolock)
			/* remove records */
			delete from Imaging where imagingId = @imagingId;
			delete from ImagingDetail where imagingId = @imagingId;";
            using(Impersonation imp = new Impersonation()) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand(commandText, cn)) {
                        cmd.Parameters.Add("@imagingId", SqlDbType.UniqueIdentifier).Value = new Guid(args["imagingId"].ToString());
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            while(d.Read()) {
                                string fileNameAndPath = Main.PhysicalApplicationPath + d.GetString(0);
                                if(File.Exists(fileNameAndPath)) {
                                    File.Delete(fileNameAndPath);
                                }
                            }
                        }
                    }
                }
            }
			/* return the new state of things */
			Dictionary<string, object> cmdargs = new Dictionary<string, object>();
			cmdargs.Add( "CommandText", "select imagingID,fileSize,fileName,thumbnail,thumbOrder,height,width from Imaging where itemnumber = \'' + instance.itemNumber + '\';" );
			return ( Dictionary<string, object> )Admin.GetSqlArray( cmdargs );
		}
		/// <summary>
		/// Gets the item images for use in a backend application.
		/// </summary>
		/// <param name="itemNumber">The item number.</param>
		/// <returns></returns>
		public static List<object> GetItemImages( string itemNumber ) {
			List<object> l = new List<object>();
            using( SqlConnection cn = Site.CreateConnection(true, true) ){
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(@"select imagingId, fileSize, fileName, thumbnail,
			    thumbOrder, height, width from imaging with (nolock) where itemnumber = @itemnumber;", cn)) {
                    cmd.Parameters.Add("@itemnumber", SqlDbType.VarChar).Value = itemNumber;
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        while(r.Read()) {
                            Dictionary<string, object> j = new Dictionary<string, object>();
                            Guid imgId = r.GetGuid(0);
                            string fileName = r.GetString(2);
                            j.Add("imagingId", imgId.ToString());
                            j.Add("fileSize", r.GetInt32(1).ToString());
                            j.Add("fileName", fileName);
                            j.Add("thumbnail", r.GetBoolean(3));
                            j.Add("thumbOrder", r.GetInt32(4));
                            j.Add("height", r.GetInt32(5));
                            j.Add("width", r.GetInt32(6));
                            j.Add("src", imgId.ToFileName() + Path.GetExtension(fileName));
                            l.Add(j);
                        }
                    }
                }
			}
			return l;
		}
		/// <summary>
		/// Adds an image from the specified path to the specified item.
		/// </summary>
		/// <param name="itemNumber">The item number.</param>
		/// <param name="pathToImage">The path to image.</param>
		/// <returns></returns>
		public static Dictionary<string, object> AddItemImage( string itemNumber, string pathToImage ) {
			( "FUNCTION /w SP,ADHOC,fileSystem addItemImage" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
            using(Impersonation imp = new Impersonation()) {
                if(File.Exists(pathToImage)) {
                    if(pathToImage.ToLower().EndsWith("jpg") || pathToImage.ToLower().EndsWith("gif") || pathToImage.ToLower().EndsWith("png")) {
                        /* 
                            select 
                            ImagingDetailID, ImagingID, unique_siteID, height, width, itemnumber, filename, locationType, VerCol
                            from ImagingDetail
                         * 
                         */
                        /* copy the image to its final resting spot */
                        Guid imageId = Guid.NewGuid();
                        if(!Directory.Exists(Main.PhysicalApplicationPath + "img")) {
                            Directory.CreateDirectory(Main.PhysicalApplicationPath + "img");
                        }
                        if(!Directory.Exists(Main.PhysicalApplicationPath + "img\\items")) {
                            Directory.CreateDirectory(Main.PhysicalApplicationPath + "img\\items");
                        }
                        if(!Directory.Exists(Main.PhysicalApplicationPath + "img\\items\\" + itemNumber)) {
                            Directory.CreateDirectory(Main.PhysicalApplicationPath + "img\\items\\" + itemNumber);
                        }
                        string fileName = Path.GetFileName(pathToImage);
                        string fileExt = Path.GetExtension(fileName);
                        string newFileName = imageId.ToFileName() + fileExt;
                        string newFilePath = Main.PhysicalApplicationPath + "img\\items\\" + itemNumber + "\\" + newFileName;
                        File.Copy(pathToImage, newFilePath);
                        using(System.Drawing.Bitmap img = new System.Drawing.Bitmap(newFilePath)) {
                            FileInfo f = new FileInfo(newFilePath);
                            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                                cn.Open();
                                /* insert record into 'master' table */
                                using(SqlCommand cmd = new SqlCommand("dbo.addItemImage @imagingID,@itemnumber,@filesize,@filename,@thumbnail,@width,@height,@thumborder", cn)) {
                                    cmd.Parameters.Add("@imagingId", SqlDbType.UniqueIdentifier).Value = new Guid(imageId.ToString());
                                    cmd.Parameters.Add("@itemnumber", SqlDbType.VarChar).Value = itemNumber;
                                    cmd.Parameters.Add("@filesize", SqlDbType.BigInt).Value = f.Length;
                                    cmd.Parameters.Add("@filename", SqlDbType.VarChar).Value = fileName;
                                    cmd.Parameters.Add("@thumbnail", SqlDbType.Bit).Value = 1;
                                    cmd.Parameters.Add("@width", SqlDbType.BigInt).Value = img.Height;
                                    cmd.Parameters.Add("@height", SqlDbType.BigInt).Value = img.Width;
                                    cmd.Parameters.Add("@thumborder", SqlDbType.Bit).Value = -1;
                                    cmd.ExecuteNonQuery();
                                }
                            }
                        }
                        /* refresh */
                        Main.Site.ItemImages = new Commerce.ItemImages(Main.Site);
                        j = RefreshAllItemImages(itemNumber);
                        return j;
                    } else {
                        j.Add("error", -2);
                        j.Add("description", "Only png, jpg, or gif images can be selected.");
                    }
                } else {
                    j.Add("error", -1);
                    j.Add("description", "File does not exist");
                }
            }
			return j;
		}
		/// <summary>
		/// Gets an image from a path and streams the content to the current HttpContext
		/// </summary>
		/// <param name="imagePath">The image path.</param>
		/// <returns></returns>
		public static void GetImageStream( string imagePath ) {
            using(Impersonation imp = new Impersonation()) {
                try {
                    if(!File.Exists(imagePath)) {
                        // throw image exception
                        FileNotFoundException ex = new FileNotFoundException(String.Format("File was not found",imagePath));
                        throw ex;
                    }
                    using(System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(imagePath)) {
                        OutputPNGMemoryStream(bmp);
                    }
                } catch(Exception e) {
                    OutputPNGMemoryStream(imageExceptionPicture(e));
                }
            }
			HttpContext.Current.Response.Flush();
			HttpContext.Current.ApplicationInstance.CompleteRequest();
		}
        /// <summary>
        /// Outputs a PNG memory stream to the browser.
        /// </summary>
        /// <param name="bmp">The BMP.</param>
        public static void OutputPNGMemoryStream(Image bmp) {
            using(MemoryStream ms = new MemoryStream()) {
                bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                HttpContext.Current.Response.Clear();
                HttpContext.Current.Response.ContentType = "image/png";
                HttpContext.Current.Response.AddHeader("Expires", "0");/* RFC 2616 14.21 Content has already expired */
                HttpContext.Current.Response.AddHeader("Cache-Control", "no-store");/* RFC 2616 14.9.2 Don't ever cache */
                HttpContext.Current.Response.AddHeader("Pragma", "no-store");/* RFC 2616 14.32 Pragma - same as cache control */
                ms.WriteTo(HttpContext.Current.Response.OutputStream);
            }
        }
        /// <summary>
        /// Creates a 500 x 500 image of the exception.
        /// </summary>
        /// <param name="ex">The Exception.</param>
        /// <returns></returns>
        public static Image imageExceptionPicture(Exception ex){
            Bitmap bmp = new Bitmap(500, 250);
            using(Graphics g = Graphics.FromImage(bmp)) {
                g.FillRegion(Brushes.White, new Region(new Rectangle(0, 0, 500, 250)));
                g.DrawString(@"Exception: " + ex.Message, new Font("Tahoma", 11), Brushes.Black, new PointF(0, 0));
                g.Flush();
            }
            return bmp;
        }
		/// <summary>
		/// Gets an image from a path and returns a Bitmap object from the image
		/// </summary>
		/// <param name="imagePath">The image path.</param>
		/// <returns></returns>
		public static System.Drawing.Bitmap GetImage( string imagePath ) {
			System.Drawing.Bitmap bmp = new System.Drawing.Bitmap( imagePath );
			return bmp;
		}
		/// <summary>
		/// Renders the template images.  Updates an ProgressInfo matching progressInfoId parameter.
		/// </summary>
		/// <param name="templateId">The template id.</param>
		/// <param name="progressInfoId">The progress info id.</param>
		/// <returns></returns>
		public static List<object> RenderTemplateImages( string templateId, string progressInfoId ) {
			Guid id = new Guid( progressInfoId );
			ProgressInfo u = new ProgressInfo( id );
			if( !Main.ProgressInfos.ContainsKey( id ) ) {
				Main.ProgressInfos.Add( id, u );
			} else {
				Main.ProgressInfos[ id ] = u;
			}
			u.CurrentItemName = "Starting";
			u.TotalItemCount = 0;
			u.Started = DateTime.Now;
			( "FUNCTION /w SP renderTemplateImages" ).Debug( 10 );
			List<object> l = new List<object>();
			List<object> entries = new List<object>();
            using(Impersonation imp = new Impersonation()) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("getTemplateUsage @templateId", cn)) {
                        cmd.Parameters.Add("@templateId", SqlDbType.UniqueIdentifier).Value = new Guid(templateId.ToString());
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            if(d.HasRows) {
                                while(d.Read()) {
                                    foreach(Commerce.Item i in Main.Site.Items.List) {
                                        u.TotalItemCount++;
                                        string[] ls = { d.GetString(1) };
                                        List<object> f = new List<object>();
                                        f.Add(i.ItemNumber);
                                        f.Add(ls);
                                        f.Add(d.GetGuid(0));
                                        entries.Add(f);
                                    }
                                }
                            }
                        }
                    }
                }
                foreach(List<object> entry in entries) {
                    l.Add(RefreshItemImages(((string)entry[0]), ((string[])entry[1]), ((Guid)(entry[2])), Guid.Empty));
                    u.CurrentItemCount++;
                    u.Updated = DateTime.Now;
                    u.CurrentItemName = ((string)entry[0]);
                }
            }
			u.Complete = true;
			return l;
		}
		/// <summary>
		/// Applies the imaging template.
		/// </summary>
		/// <param name="templateId">The template id.</param>
		/// <param name="img">The img.</param>
		/// <returns></returns>
		public static System.Drawing.Bitmap ApplyImageTemplate( string templateId, System.Drawing.Bitmap img ) {
			( "FUNCTION /w SP,binaryStream applyImageTemplate" ).Debug( 10 );
            using(Impersonation imp = new Impersonation()) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("select imagingTemplateDetailID,template from imagingTemplateDetail where enabled = 1 and imagingTemplateId = @imagingTemplateId order by filterOrder asc", cn)) {
                        cmd.Parameters.Add("@imagingTemplateId", SqlDbType.UniqueIdentifier).Value = new Guid(templateId.ToString());
                        using(SqlDataReader r = cmd.ExecuteReader()) {
                            if(r.HasRows) {
                                while(r.Read()) {
                                    if(r.GetGuid(1) != Guid.Empty) {
                                        img = ApplyImageTemplate(r.GetGuid(1).ToString(), img);
                                    } else {
                                        List<object> errors = new List<object>();
                                        img = ExecuteImageTemplate(img, r.GetGuid(0).ToString(), ref errors);
                                        if(errors.Count > 0) {
                                            foreach(Dictionary<string, object> d in errors) {
                                                String.Format(" --------------------------------------------------\n" +
                                                " Error:" + d["errorNumber"] + "\n" +
                                                " Description:" + d["errorText"] + "\n" +
                                                " Line:" + d["line"] + "\n" +
                                                " --------------------------------------------------").Debug(1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        return img;
                    }
                }
            }
		}
        /// <summary>
        /// Gets the sample image provided by the user or a built in sample image.
        /// </summary>
        /// <returns></returns>
        private static byte[] getSampleImage() {
            byte[] buffer = { };
            string sampleImagePath = Main.ImageDirectory.Replace("~/", Main.PhysicalApplicationPath) + "\\imageTemplatePreview";
            if(File.Exists(sampleImagePath + ".png")) {
                sampleImagePath = sampleImagePath + ".png";
            }
            if(File.Exists(sampleImagePath + ".jpg")) {
                sampleImagePath = sampleImagePath + ".jpg";
            }
            if(File.Exists(sampleImagePath)) {
                using(FileStream fs = File.OpenRead(sampleImagePath)) {
                    buffer = new byte[Convert.ToInt32(fs.Length)];
                    fs.Read(buffer, 0, Convert.ToInt32(fs.Length));
                }
            } else {
                buffer = (byte[])Main.getAdminResource("img__test_patternpng");
            }
            return buffer;
        }
		/// <summary>
		/// Previews a template.
		/// </summary>
		/// <param name="templateId">The template id.</param>
		/// <param name="sampleImage">Path to the sample image.</param>
		/// <param name="binaryOutput">if set to <c>true</c> [binary output].</param>
		/// <returns></returns>
		public static Dictionary<string, object> PreviewTemplate( string templateId, string sampleImage, bool binaryOutput ) {
			( "FUNCTION /w SP,binaryStream previewTemplate" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
            using(Impersonation imp = new Impersonation()) {
                byte[] buffer = getSampleImage();
                MemoryStream fms = new MemoryStream(buffer);
                System.Drawing.Bitmap img = (System.Drawing.Bitmap)System.Drawing.Bitmap.FromStream(fms);
                try {
                    img = ApplyImageTemplate(templateId, img);
                } catch(Exception e) {
                    if(e.InnerException != null) {
                        j.Add("description", "Internal server error: " + e.InnerException.Source + ": " + e.InnerException.Message);
                    } else {
                        j.Add("description", "Internal server error: " + e.Source + ": " + e.Message);
                    }
                    return j;
                }
                Guid g = Guid.NewGuid();
                string tempRootDir = Main.TempDirectory.Replace("~/", Main.PhysicalApplicationPath);
                if(!Directory.Exists(tempRootDir)) {
                    Directory.CreateDirectory(tempRootDir);
                }
                string tempFileNameAndPath = tempRootDir + "\\" + g.ToString() + ".jpg";
                if(!binaryOutput) {
                    using(Impersonation p = new Impersonation()) {
                        img.Save(tempFileNameAndPath);
                    }
                    Dictionary<string, object> ii = new Dictionary<string, object>();
                    FileInfo f = new FileInfo(tempFileNameAndPath);
                    ii.Add("height", img.Height);
                    ii.Add("width", img.Width);
                    ii.Add("size", f.Length);
                    j.Add("imageInfo", ii);
                    j.Add("image", Main.TempDirectory.Replace("~/", "") + "/" + Path.GetFileName(tempFileNameAndPath));
                    j.Add("error", 0);
                    j.Add("description", "");
                } else {
                    using(MemoryStream ms = new MemoryStream()) {
                        img.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                        HttpContext.Current.Response.Clear();
                        HttpContext.Current.Response.ContentType = "image/png";
                        HttpContext.Current.Response.AddHeader("Expires", "0");/* RFC 2616 14.21 Content has already expired */
                        HttpContext.Current.Response.AddHeader("Cache-Control", "no-store");/* RFC 2616 14.9.2 Don't ever cache */
                        HttpContext.Current.Response.AddHeader("Pragma", "no-store");/* RFC 2616 14.32 Pragma - same as cache control */
                        ms.WriteTo(HttpContext.Current.Response.OutputStream);
                    }
                    img.Dispose();
                    HttpContext.Current.Response.Flush();
                    HttpContext.Current.ApplicationInstance.CompleteRequest();
                }
            }
			return j;
		}
		/// <summary>
		/// Previews a single filter in a filter template.
		/// </summary>
		/// <param name="templateDetailId">The template detail id.</param>
		/// <param name="sampleImage">The sample image.</param>
		/// <param name="binaryOutput">if set to <c>true</c> [binary output].</param>
		/// <returns></returns>
		public static Dictionary<string, object> PreviewTemplateDetail( string templateDetailId, string sampleImage, bool binaryOutput ) {
			( "FUNCTION /w fileSystem previewTemplateDetail" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
            // resrouce file in source path /js/admin/img/test_pattern.png 
            byte[] buffer = getSampleImage();
			MemoryStream fms = new MemoryStream( buffer );
			System.Drawing.Bitmap img = ( System.Drawing.Bitmap )System.Drawing.Bitmap.FromStream( fms );
			List<object> errors = new List<object>();
			try {
                using(Impersonation imp = new Impersonation()) {
                    img = ExecuteImageTemplate(img, templateDetailId, ref errors);
                    if(errors.Count != 0) {
                        j.Add("error", -2);
                        j.Add("description", "One or more scripts generated errors.");
                        j.Add("errors", errors);
                        return j;
                    }
                }
			} catch( Exception e ) {
				if( e.InnerException != null ) {
					j.Add( "description", "Internal server error: " + e.InnerException.Source + ": " + e.InnerException.Message );
				} else {
					j.Add( "description", "Internal server error: " + e.Source + ": " + e.Message );
				}
				return j;
			}
			Guid g = Guid.NewGuid();
			string tempFileName = "temp\\" + g.ToString() + ".jpg";
			if( !binaryOutput ) {
                using(Impersonation imp = new Impersonation()) {
                    img.Save(Main.PhysicalApplicationPath + tempFileName);
                }
				Dictionary<string, object> ii = new Dictionary<string, object>();
				FileInfo f = new FileInfo( Main.PhysicalApplicationPath + tempFileName );
				ii.Add( "height", img.Height );
				ii.Add( "width", img.Width );
				ii.Add( "size", f.Length );
				j.Add( "imageInfo", ii );
				j.Add( "image", tempFileName.Replace( "\\", "/" ) );
				j.Add( "error", 0 );
				j.Add( "description", "" );
			} else {
				using( MemoryStream ms = new MemoryStream() ) {
					img.Save( ms, System.Drawing.Imaging.ImageFormat.Png );
					HttpContext.Current.Response.Clear();
					HttpContext.Current.Response.ContentType = "image/png";
					HttpContext.Current.Response.AddHeader( "Expires", "0" );/* RFC 2616 14.21 Content has already expired */
					HttpContext.Current.Response.AddHeader( "Cache-Control", "no-store" );/* RFC 2616 14.9.2 Don't ever cache */
					HttpContext.Current.Response.AddHeader( "Pragma", "no-store" );/* RFC 2616 14.32 Pragma - same as cache control */
					ms.WriteTo( HttpContext.Current.Response.OutputStream );
				}
				img.Dispose();
				HttpContext.Current.Response.Flush();
				HttpContext.Current.ApplicationInstance.CompleteRequest();
			}
			return j;
		}
		/// <summary>
		/// Executes the image template.  This is a reciprecol function.
		/// </summary>
		/// <param name="image">The image.</param>
		/// <param name="imageTemplateId">The image template id.</param>
		/// <param name="errors">The errors.</param>
		/// <returns></returns>
		public static System.Drawing.Bitmap ExecuteImageTemplate( System.Drawing.Bitmap image, string imageTemplateId, ref List<object> errors ) {
			( "FUNCTION /w SP,ADHOC executeImageTemplate" ).Debug( 10 );
			string commandText = @"select imagingTemplateDetailId, imagingTemplateId, name, 
				description, script, language,filterOrder, enabled, template 
				from imagingTemplateDetail
				where imagingTemplateId = @imagingTemplateId or imagingTemplateDetailId = @imagingTemplateId";
            using(Impersonation imp = new Impersonation()) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand(commandText, cn)) {
                        cmd.Parameters.Add("@imagingTemplateId", SqlDbType.UniqueIdentifier).Value = new Guid(imageTemplateId.ToString());
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            if(d.HasRows) {
                                while(d.Read()) {
                                    if(d.GetGuid(8) != Guid.Empty) {
                                        ExecuteImageTemplate(image, d.GetGuid(8).ToString(), ref errors);
                                    } else {
                                        object[] args = { image };
                                        object obj = ExecuteScript(d.GetString(4), d.GetString(5), "script", "main", ref args, ref errors);
                                        if(errors.Count == 0) {
                                            if(obj.GetType() == typeof(System.Drawing.Bitmap)) {
                                                image = (System.Drawing.Bitmap)obj;
                                            } else {
                                                ("Error in template: " + d.GetGuid(1).ToString() +
                                                " Imaging script must return type System.Drawing.Bitmap.").Debug(1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
			return image;
		}
        /// <summary>
        /// Crops the specified image.
        /// </summary>
        /// <param name="img">The img.</param>
        /// <param name="x">x.</param>
        /// <param name="y">y.</param>
        /// <param name="w">w.</param>
        /// <param name="h">h.</param>
        /// <returns></returns>
		public static System.Drawing.Bitmap Crop( System.Drawing.Bitmap img, int x, int y, int w, int h ) {
			( "FUNCTION /w binaryStream crop" ).Debug( 10 );
			System.Drawing.Bitmap bmpImage = new System.Drawing.Bitmap( img );
			System.Drawing.Rectangle cropArea = new System.Drawing.Rectangle( x, y, w, h );
			System.Drawing.Bitmap bmpCrop = bmpImage.Clone( cropArea, bmpImage.PixelFormat );
			return bmpCrop;
		}
		/// <summary>
		/// Resizes the image using the HighQualityBicubic interpolation method.
		/// </summary>
		/// <param name="image">The image.</param>
		/// <param name="height">The new height.</param>
		/// <param name="width">The new width.</param>
		/// <returns></returns>
		public static System.Drawing.Bitmap ResizeHighQuality( System.Drawing.Bitmap image, int width, int height ) {
			System.Drawing.Bitmap result = new System.Drawing.Bitmap( width, height );
			using( System.Drawing.Graphics g = System.Drawing.Graphics.FromImage( ( System.Drawing.Image )result ) ) {
				g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
				g.DrawImage( image, 0, 0, width, height );
			}
			return result;
		}
	}
}
