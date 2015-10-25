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
namespace Rendition {
    public partial class Commerce {
        /// <summary>
        /// An image associated with an item or gallery.
        /// </summary>
        public class Image {
            #region Instance Properties
            /// <summary>
            /// Height of the image.
            /// </summary>
            public int Height { get; internal set; }
            /// <summary>
            /// Width of the image.
            /// </summary>
            public int Width { get; internal set; }
            /// <summary>
            /// Horizontal Aspect Ratio.
            /// </summary>
            public decimal HorizontalAspectRatio { get; internal set; }
            /// <summary>
            /// Vertical Aspect Ratio.
            /// </summary>
            public decimal VerticalAspectRatio { get; internal set; }
            /// <summary>
            /// Name of the file.
            /// </summary>
            public string FileName { get; internal set; }
            /// <summary>
            /// Type of image as a string (List, Cart, Invoice etc.).
            /// </summary>
            public string LocationType { get; internal set; }
            /// <summary>
            /// Type of image.
            /// </summary>
            public ImageType ImageType  {get; internal set;}
            /// <summary>
            /// Item Number this image is associated with (if any).
            /// </summary>
            public string ItemNumber { get; internal set; }
            /// <summary>
            /// URL to the image.
            /// </summary>
            public string Url { get; internal set; }
            /// <summary>
            /// Id of the image.
            /// </summary>
            public Guid Id { get; internal set; }
            /// <summary>
            /// other images that belong in the same group of images.
            /// </summary>
            [Newtonsoft.Json.JsonIgnore]
            public List<Image> Siblings {get; internal set;}
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Image"/> class.
            /// </summary>
            /// <param name="id">The id.</param>
            /// <param name="itemNumber">The item number.</param>
            /// <param name="fileName">Name of the file.</param>
            /// <param name="height">The height.</param>
            /// <param name="width">The width.</param>
            /// <param name="locationType">Type of the location.</param>
            /// <param name="_site">The _site.</param>
            public Image(Guid id, string itemNumber, string fileName, int height, int width, string locationType, Site _site) {
                this.ItemNumber = itemNumber;
                this.FileName = fileName;
                this.Url = "/img/items/" + _site.siteAddress + "/" + itemNumber + "/" + fileName;
                this.Height = height;
                this.Width = width;
                this.LocationType = locationType;
                this.ImageType = imageTypeStringToImageType(LocationType);
                this.Id = id;
                if(height > 0 && width > 0) {
                    this.HorizontalAspectRatio = (height / width);
                    this.VerticalAspectRatio = (width / height);
                }
            }
            #endregion
            #region Static Methods
            internal static Rendition.ImageType imageTypeStringToImageType(string value) {
                if(value == "m") {
                    return Rendition.ImageType.Listing;
                } else if(value == "c") {
                    return Rendition.ImageType.Cart;
                } else if(value == "f") {
                    return Rendition.ImageType.FullSize;
                } else if(value == "t") {
                    return Rendition.ImageType.Checkout;
                } else if(value == "a") {
                    return Rendition.ImageType.PackingSlip;
                } else if(value == "x") {
                    return Rendition.ImageType.Invoice;
                } else if(value == "y") {
                    return Rendition.ImageType.Listing2;
                } else if(value == "z") {
                    return Rendition.ImageType.Listing3;
                } else if(value == "b") {
                    return Rendition.ImageType.Admin;
                } else if(value == "d") {
                    return Rendition.ImageType.Detail;
                } else if(value == "o") {
                    return Rendition.ImageType.Original;
                } else {
                    return Rendition.ImageType.None;
                }
            }
            #endregion
        }
    }
}
