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
namespace Rendition {
	public partial class Admin {
		/// <summary>
		/// Previews the gallery cropping.
		/// </summary>
		/// <param name="sourcePath">The source path.</param>
		/// <param name="cropX">The crop X.</param>
		/// <param name="cropY">The crop Y.</param>
		/// <param name="cropW">The crop W.</param>
		/// <param name="cropH">The crop H.</param>
		/// <param name="imageX">The image X.</param>
		/// <param name="imageY">The image Y.</param>
		/// <param name="imageW">The image W.</param>
		/// <param name="imageH">The image H.</param>
		/// <param name="destW">The dest W.</param>
		/// <param name="destH">The dest H.</param>
		/// <returns></returns>
		public static string PreviewGalleryCropping( string sourcePath, Int64 cropX, Int64 cropY,
		Int64 cropW, Int64 cropH, Int64 imageX, Int64 imageY, Int64 imageW, Int64 imageH, Int64 destW, Int64 destH ) {
            /* make sure the temp directory exists */
            if(!Directory.Exists(Main.PhysicalApplicationPath + "temp/")) {
                Directory.CreateDirectory(Main.PhysicalApplicationPath + "temp/");
            }
            string fileName = Guid.NewGuid().ToFileName();
            string fileExt = Path.GetExtension(sourcePath);
            string filePath = Main.PhysicalApplicationPath + "temp/" + fileName + fileExt;
            using(Impersonation imp = new Impersonation()) {
                /* set 10 mintue Timer then delete the preview generated */
                Timer deleteTimer = new Timer(10000);
                deleteTimer.elapsed += new EventHandler(delegate(object obj, EventArgs e) {
                    if(File.Exists(filePath)) {
                        File.Delete(filePath);
                    }
                });
                if(File.Exists(sourcePath)) {
                    System.Drawing.Bitmap bmp = new System.Drawing.Bitmap(sourcePath);
                    bmp = GalleryCrop(bmp, cropX, cropY, cropW, cropH, imageX, imageY, imageW, imageH, destW, destH);
                    bmp.Save(filePath);
                }
            }
			return "temp/" + fileName + fileExt;
		}
        /// <summary>
        /// Renders the image gallery.
        /// </summary>
        /// <param name="_galleryId">The _gallery id.</param>
        /// <param name="progressInfoId">The progress info id.</param>
        /// <returns></returns>
		public static Dictionary<string, object> RenderImageGallery( string _galleryId, string progressInfoId ) {
			( "FUNCTION /w SP,fileSystem renderImageGallery" ).Debug( 10 );
			Guid id = new Guid( progressInfoId );
			ProgressInfo u = new ProgressInfo( id );
			if( !Main.ProgressInfos.ContainsKey( id ) ) {
				Main.ProgressInfos.Add( id, u );
			} else {
				Main.ProgressInfos[ id ] = u;
			}
			u.CurrentItemName = "Calculating work size please wait...";
			u.TotalItemCount = 0;
			u.Started = DateTime.Now;
			Dictionary<string, object> j = new Dictionary<string, object>();
			List<object> errors = new List<object>();
			j.Add( "error", 0 );
			j.Add( "description", "" );
			List<Dictionary<Int64, object>> entries = new List<Dictionary<Int64, object>>();
			try {
                using(Impersonation imp = new Impersonation()) {
                    Guid galleryId = new Guid(_galleryId);
                    using(SqlConnection cn = Site.CreateConnection(true, true)) {
                        cn.Open();
                        using(SqlCommand cmd = new SqlCommand("getRotatorCategory @imageRotatorCategoryId", cn)) {
                            cmd.Parameters.Add("@imageRotatorCategoryId", SqlDbType.UniqueIdentifier).Value = new Guid(galleryId.ToString());
                            using(SqlDataReader d = cmd.ExecuteReader()) {
                                while(d.Read()) {
                                    Dictionary<Int64, object> i = new Dictionary<Int64, object>();
                                    i.Add(1, d.GetString(1));
                                    i.Add(2, (Int64)d.GetInt32(2));
                                    i.Add(3, (Int64)d.GetInt32(3));
                                    i.Add(5, d.GetGuid(5));
                                    i.Add(6, d.GetGuid(6));
                                    i.Add(7, d.GetGuid(7));
                                    i.Add(8, d.GetGuid(8));
                                    i.Add(9, d.GetGuid(9));
                                    i.Add(15, d.GetString(15));
                                    i.Add(14, d.GetGuid(14));
                                    i.Add(18, (Int64)d.GetInt32(18));
                                    i.Add(19, (Int64)d.GetInt32(19));
                                    i.Add(20, (Int64)d.GetInt32(20));
                                    i.Add(21, (Int64)d.GetInt32(21));
                                    i.Add(22, (Int64)d.GetInt32(22));
                                    i.Add(23, (Int64)d.GetInt32(23));
                                    i.Add(24, (Int64)d.GetInt32(24));
                                    i.Add(25, (Int64)d.GetInt32(25));
                                    entries.Add(i);
                                    u.CurrentItemName = String.Format("Adding item {0}", Path.GetFileName((string)i[15]));
                                    u.TotalItemCount++;
                                }
                            }
                        }
                    }
                    u.CurrentItemCount = 0;
                    foreach(Dictionary<Int64, object> i in entries) {
                        u.CurrentItemName = String.Format("Working on item {0}", Path.GetFileName((string)i[15]));
                        u.CurrentItemCount++;
                        string categoryDirectory = Main.PhysicalApplicationPath + "img\\gallery\\" + i[1];
                        string srcFilePath = (string)i[15];
                        string outputFileName = ((Guid)i[14]).ToFileName();
                        /* create gallery directory */
                        if(!Directory.Exists(categoryDirectory)) {
                            Directory.CreateDirectory(categoryDirectory);
                        }
                        /* get the input file */
                        using(System.Drawing.Bitmap srcImg = new System.Drawing.Bitmap(srcFilePath)) {
                            /* for each type of image create a file with a special suffix */
                            /* the rotator template is special, it gets the gallery method then the rotator template */
                            System.Drawing.Bitmap b;
                            using(b = (System.Drawing.Bitmap)srcImg.Clone()) {
                                b = Admin.GalleryCrop(b, (Int64)i[18], (Int64)i[19], (Int64)i[21], (Int64)i[20],
                                (Int64)i[22], (Int64)i[23], (Int64)i[25], (Int64)i[24], (Int64)i[3], (Int64)i[2]);
                                b = Admin.ExecuteImageTemplate(b, i[5].ToString(), ref errors);/*5=rotator template */
                                b.SaveJpg(categoryDirectory + "\\" + outputFileName + "r.jpg", 90L);
                            }
                            using(b = (System.Drawing.Bitmap)srcImg.Clone()) {
                                b = Admin.ExecuteImageTemplate(b, i[6].ToString(), ref errors);/*6=thumb template */
                                b.SaveJpg(categoryDirectory + "\\" + outputFileName + "t.jpg", 90L);
                            }
                            using(b = (System.Drawing.Bitmap)srcImg.Clone()) {
                                b = Admin.ExecuteImageTemplate(b, i[7].ToString(), ref errors);/*7=fullsize template */
                                b.SaveJpg(categoryDirectory + "\\" + outputFileName + "f.jpg", 90L);
                            }
                            using(b = (System.Drawing.Bitmap)srcImg.Clone()) {
                                b = Admin.ExecuteImageTemplate(b, i[8].ToString(), ref errors);/*8=portfolio template */
                                b.SaveJpg(categoryDirectory + "\\" + outputFileName + "p.jpg", 90L);
                            }
                            using(b = (System.Drawing.Bitmap)srcImg.Clone()) {
                                b = Admin.ExecuteImageTemplate(b, i[9].ToString(), ref errors);/*9=Blog template */
                                b.SaveJpg(categoryDirectory + "\\" + outputFileName + "b.jpg", 90L);
                            }
                        }
                    }
                    u.Complete = true;
                }
			} catch( Exception e ) {
				j[ "error" ] = -1;
				j[ "description" ] = e.Message;
			}
			if( errors.Count > 0 ) {
				j[ "error" ] = -2;
				j[ "description" ] = errors;
			}
			return j;
		}
		/// <summary>
		/// Gallery crop method.
		/// </summary>
		/// <param name="inputBitmap">The input bitmap.</param>
		/// <param name="cropX">The crop X.</param>
		/// <param name="cropY">The crop Y.</param>
		/// <param name="cropW">The crop W.</param>
		/// <param name="cropH">The crop H.</param>
		/// <param name="imageX">The image X.</param>
		/// <param name="imageY">The image Y.</param>
		/// <param name="imageW">The image W.</param>
		/// <param name="imageH">The image H.</param>
		/// <param name="destW">The dest W.</param>
		/// <param name="destH">The dest H.</param>
		/// <returns></returns>
		public static System.Drawing.Bitmap GalleryCrop( System.Drawing.Bitmap inputBitmap, Int64 cropX, Int64 cropY,
		Int64 cropW, Int64 cropH, Int64 imageX, Int64 imageY, Int64 imageW, Int64 imageH, Int64 destW, Int64 destH ) {
			inputBitmap = ResizeHighQuality( inputBitmap, ( int )imageW, ( int )imageH );/*resize the original image */
			inputBitmap = Crop( inputBitmap, ( int )( cropX - imageX ), ( int )( cropY - imageY ), ( int )cropW, ( int )cropH );/*crop the original image*/
			inputBitmap = ResizeHighQuality( inputBitmap, ( int )destW, ( int )destH );/*make the result fit the target size */
			return inputBitmap;
		}
	}
}
