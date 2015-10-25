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
using System.IO;
namespace Rendition {
	public partial class Commerce {
		/// <summary>
		/// This class creates a single item.
		/// </summary>
		public class Item : IDisposable {
            #region Instance Methods
            /// <summary>
            /// Returns a <see cref="System.String"/> that represents this instance.  Returns item number + description or just item number if description is blank.
            /// </summary>
            /// <returns>
            /// A <see cref="System.String"/> that represents this instance.
            /// </returns>
            public override string ToString() {
                if(this.Description.Length > 0) {
                    return this.ItemNumber + " - " + this.Description;
                } else {
                    return this.ItemNumber;
                }
            }
            /// <summary>
            /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
            /// Which in this case, does nothing.
            /// </summary>
            public void Dispose() { }
            /// <summary>
            /// Refreshes the home and alt category lists associated with this item.
            /// </summary>
            private void RefreshCategoryList() {
                _homeCategory = Main.Site.Categories.List.Find(delegate(Commerce.Category cat) {
                    return cat.Id == this.HomeCategoryId;
                });
                _altCategory = Main.Site.Categories.List.Find(delegate(Commerce.Category cat) {
                    return cat.Id == this.AltCategoryId;
                });
                try {
                    /* sort categories by their featured list order */
                    _homeCategory.Items.Sort(delegate(Item i1, Item i2) {
                        return i1.CategoryOrder[_homeCategory.Id].CompareTo(i2.CategoryOrder[_homeCategory.Id]);
                    });
                    _altCategory.Items.Sort(delegate(Item i1, Item i2) {
                        return i1.CategoryOrder[_altCategory.Id].CompareTo(i2.CategoryOrder[_altCategory.Id]);
                    });
                } catch {
                    string.Format("Item {0} is missing its home or alternate category",this.Number).Debug(0);
                }
            }
            /// <summary>
			/// Gets the effective price based on the user logged on and the on sale status.
			/// </summary>
			/// <returns>Price</returns>
			public decimal GetEffectivePrice() {
				Session s = Main.GetCurrentSession();
				if( s.Wholesale == 1 ) {
					return this.WholeSalePrice;
				} else {
					if( this.IsOnSale ) {
						return this.SalePrice;
					} else {
						return this.Price;
					}
				}
			}
            /// <summary>
            /// Refreshes the reviews.
            /// </summary>
            public void RefreshReviews() {
                _reviews = null;
            }
            /// <summary>
            /// Refreshes the images associated with this item.
            /// </summary>
            public void RefreshImages() {
                this.RefreshImages(Main.Site, "");
            }
            /// <summary>
            /// Refreshes the images associated with this item using another site object.
            /// </summary>
            /// <param name="site">The site.</param>
            public void RefreshImages(Site site) {
                this.RefreshImages(site, "");
            }
            /// <summary>
            /// Gets the item's image based on its image type.
            /// </summary>
            /// <param name="imageType">Type of the image.</param>
            /// <returns></returns>
            public Image GetImage(ImageType imageType) {
                Image i = null;
                i = Images.Find(delegate(Image img) {
                    return img.ImageType == imageType;
                });
                if(i == null) {
                    i = new Image(Guid.Empty, this.Number, "", 1, 1, "", Main.Site);
                }
                return i;
            }
            /// <summary>
            /// Refreshes the images associated with this item.
            /// </summary>
            /// <param name="site">The site.</param>
            /// <param name="locationType">Type of the location.</param>
            public void RefreshImages(Site site, string locationType) {
                _images = Main.Site.RenderedImages.List.FindAll(delegate(Image img) {
                    return (img.ItemNumber == this.ItemNumber && img.LocationType == locationType) ||
                    (img.ItemNumber == this.ItemNumber && locationType == "");
                });
                if(_images == null) {
                    _images = new List<Commerce.Image>();
                }
                if(locationType == "t" || locationType == "") {
                    _thumbnails = _images.FindAll(delegate(Image img) {
                        return img.LocationType == "t";
                    });
                }
                if(_thumbnails != null) {
                    foreach(Image i in _thumbnails) {
                        i.Siblings = _images.FindAll(delegate(Image img) {
                            return img.Id == i.Id;
                        });
                    }
                }

                if(_thumbnails == null) {
                    _thumbnails = new List<Commerce.Image>();
                }
            }
            #endregion
            #region Static Methods
            /// <summary>
            /// Gets the item by its number.
            /// </summary>
            /// <param name="item_number">The item number.</param>
            /// <returns>Item with the matching number</returns>
            public static Item GetItem(string item_number) {
                Commerce.Item i = Main.Site.Items.List.Find(delegate(Commerce.Item itm) {
                    return itm.Number.ToLower() == item_number.ToLower();
                });
                return i;
            }
            #endregion
            #region Static Properties
            /// <summary>
            /// Gets all items.
            /// </summary>
            public static List<Item> All {
                get {
                    return Main.Site.Items.List;
                }
            }
            /// <summary>
            /// Gets the item on the current page based on an
            /// item in the query string defined in Main.RequestItem.
            /// The default request item is "item".
            /// </summary>
            public static Item CurrentItem {
                get {
                    if(System.Web.HttpContext.Current == null) {
                        return null;
                    }
                    System.Web.HttpRequest r = System.Web.HttpContext.Current.Request;
                    System.Collections.IDictionary d = System.Web.HttpContext.Current.Items;
                    if(d.Contains("___" + Main.RequestItem)) {
                        return (Item)d["___" + Main.RequestItem];
                    }
                    if(r[Main.RequestItem]!=null){
                        string r_number = r[Main.RequestItem];
                        Item i = Main.Site.Items.List.Find(delegate(Commerce.Item itm) {
                            return itm.Number.ToLower() == r_number.ToLower();
                        });
                        if(i == null) {
                            return null;
                        }
                        if(!d.Contains("___" + Main.RequestItem)) {
                            d.Add("___" + Main.RequestItem, i);
                            return i;
                        } else {
                            return i;
                        }
                    }
                    return null;
                }
            }
            /// <summary>
            /// Gets all item images.
            /// </summary>
            public static List<Image> AllItemImages {
                get {
                    return Main.Site.ItemImages.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
			/// The order this item shows up in when ordered by 'featured item'
			/// or the natural way the items are listed in the category editor
			/// (categoryDetail.listOrder asc).  The dictionary contains the
			/// categoryId and the order int for this item in the category.
			/// </summary>
			public Dictionary<Guid, int> CategoryOrder {get; internal set;}
			/// <summary>
			/// Quantity of this item avaliable to sell.
			/// </summary>
            public int AvaliableToSell { get; internal set; }
			/// <summary>
			/// Quantity of this item on the production floor.
			/// </summary>
            public int Volume { get; internal set; }
			/// <summary>
			/// Quantity of this item allocated for sale but not yet sold.
			/// </summary>
            public int Prebook { get; internal set; }
			/// <summary>
			/// Quantity of this item being worked on by production or awaiting receipt from a vendor.
			/// </summary>
            public int WorkInProgress { get; internal set; }
			/// <summary>
			/// Quantity of this item consumed by orders.  This number always counts up.
			/// </summary>
            public int Consumed { get; internal set; }
			/// <summary>
			/// The date this time will be available to sell again based on when the next PO containing the item's due date.
			/// </summary>
            public DateTime AvailableOn { get; internal set; }
			private Size _size = null;
			private Swatch _swatch = null;
			/// <summary>
			/// Gets the size of the item.
			/// </summary>
			public Size Size {
				get {
					if(_size!=null){
						return _size;
					}else{
						_size = Main.Site.Sizes.List.Find(delegate(Commerce.Size sz){
							return sz.Id == SizeId;
						});
						if(_size==null){
							return new Size(Guid.Empty,"None","",0);
						}else{
							return _size;
						}
					}
				}
			}
			/// <summary>
			/// Gets the swatch of the item.
			/// </summary>
			public Swatch Swatch {
				get {
					if( _swatch != null ) {
						return _swatch;
					} else {
						_swatch = Main.Site.Swatches.List.Find( delegate( Commerce.Swatch sw ) {
							return sw.Id == SwatchId;
						} );
						if( _swatch == null ) {
							return new Swatch( Guid.Empty, "", "None", "" );
						} else {
							return _swatch;
						}
					}
				}
			}
			/// <summary>
			/// Status of the inventory.
			/// </summary>
			public string StockStatus {get; internal set;}
			private List<Commerce.Image> _images;
			/// <summary>
			/// Images associated with this item.
			/// </summary>
			/// <value>The images.</value>
			public List<Commerce.Image> Images {
				get {
					if( _images == null ) {
						RefreshImages( Main.Site );
					}
					if( _images == null ) {
						_images = new List<Commerce.Image>();
					}
					return _images;
				}
			}
			private List<Commerce.Image> _thumbnails;
			/// <summary>
			/// Thumbnail images associated with this item.
			/// </summary>
			/// <value>The thumbnails.</value>
			public List<Commerce.Image> Thumbnails {
				get {
					if( _thumbnails == null ) {
						RefreshImages( Main.Site, "t" );
					}
					if( _thumbnails.Count == 0 ) {
						RefreshImages( Main.Site, "t" );
					}
					if( _thumbnails == null ) {
						_thumbnails = new List<Commerce.Image>();
					}
					return _thumbnails;
				}
			}
			/// <summary>
			/// Bill of material for this item.
			/// </summary>
			/// <value>The bill of material.</value>
			public List<Commerce.BillOfMaterial> BillOfMaterial {
				get {
					List<Commerce.BillOfMaterial> l = Main.Site.BillOfMaterials.List.FindAll( delegate( Commerce.BillOfMaterial b ) {
						return b.ItemNumber == this.ItemNumber;
					} );
					if( l == null ) {
						l = new List<Commerce.BillOfMaterial>();
					}
					return l;
				}
			}
			/// <summary>
			/// This item's parent item if any.
			/// </summary>
			/// <value>The parent item.</value>
			public Commerce.Item ParentItem {
				get {
					return Main.Site.Items.GetItemByItemNumber( this.ParentItemnumber );
				}
			}
			/// <summary>
			/// The item number. Same as itemNumber.
			/// </summary>
            public string Number { get; internal set; }
			/// <summary>
			/// The item number. Same as number.
			/// </summary>
            public string ItemNumber { get; internal set; }
			/// <summary>
			/// Price to show when this item has a variable price range.
			/// </summary>
            public string DisplayPrice { get; internal set; }
			/// <summary>
			/// The retail price of the item.
			/// </summary>
            public decimal Price { get; internal set; }
			/// <summary>
			/// The sale price of the item.
			/// </summary>
            public decimal SalePrice { get; internal set; }
			/// <summary>
			/// The wholesale price of the item.
			/// </summary>
            public decimal WholeSalePrice { get; internal set; }
			/// <summary>
			/// Is this item on sale?
			/// </summary>
            public bool IsOnSale { get; internal set; }
			/// <summary>
			/// Description of the item.
			/// </summary>
            public string Description { get; internal set; }
			/// <summary>
			/// A short bit of ad copy (not implemented).
			/// </summary>
            public string ShortCopy { get; internal set; }
			/// <summary>
			/// The point at which a stock alert will go out to the item's operator.
			/// </summary>
            public int ReorderPoint { get; internal set; }
			/// <summary>
			/// This item is a bill of material item only and should not show up in item listings.
			/// </summary>
            public bool BOMOnly { get; internal set; }
			/// <summary>
			/// Ad copy (not implmented).
			/// </summary>
            public string ProductCopy { get; internal set; }
			/// <summary>
			/// What category can users trace this item back to.
			/// </summary>
            public Guid HomeCategoryId { get; internal set; }
			/// <summary>
			/// What category should be displayed on this items detail page.
			/// </summary>
            public Guid AltCategoryId { get; internal set; }
			/// <summary>
			/// The weight of the item to pack and ship.
			/// </summary>
            public double Weight { get; internal set; }
			/// <summary>
			/// Unit of measure when selling this item (e.g.: ea, set, pair).
			/// </summary>
            public string Quantifier { get; internal set; }
			/// <summary>
			/// Short descripton of the item (not implmented).
			/// </summary>
            public string ShortDescription { get; internal set; }
			/// <summary>
			/// When true this item will ship for free (weight not calculated).
			/// </summary>
            public bool FreeShipping { get; internal set; }
			/// <summary>
			/// Keywords associated with this item in a CSV list.
			/// </summary>
            public string Keywords { get; internal set; }
			/// <summary>
			/// When the user searches and this item would show up in the same spot as another item in a list, for example by price
			/// whcih item should be displayed first.  The higher the number the higher on the list the item will be displayed.
			/// </summary>
            public int SearchPriority { get; internal set; }
			/// <summary>
			/// How much is this item worth for a production line worker to work on (should be multiple e..g: 1.1 or .75).
			/// Used to multiply against the pay rate for the line worker.
			/// </summary>
            public decimal WorkCreditValue { get; internal set; }
			/// <summary>
			/// Do not charge tax for this item. (not in tax subtotal list)
			/// </summary>
            public bool NoTax { get; internal set; }
			/// <summary>
			/// This item is removed and cannot be purchased.
			/// </summary>
            public bool Deleted { get; internal set; }
			/// <summary>
			/// This item is unique and cannot be purchased more than one time.
			/// </summary>
            public bool RemoveAfterPurchase { get; internal set; }
			/// <summary>
			/// The parent item number of this item.
			/// </summary>
            public string ParentItemnumber { get; internal set; }
			/// <summary>
			/// The swatchId of this item.
			/// </summary>
            public Guid SwatchId { get; internal set; }
			/// <summary>
			/// Does this item allow orders to be placed against it when it is out of stock?
			/// </summary>
            public bool AllowPreorders { get; internal set; }
			/// <summary>
			/// The userId of the user resposible for this item.
			/// </summary>
            public int InventoryOperator { get; internal set; }
			/// <summary>
			/// When this item is in an order and passes through this flag state inventory will be depleted via TR_LINE_DEPLETE_INVENTORY.
			/// </summary>
            public int InventoryDepletesOnFlagId { get; internal set; }
			/// <summary>
			/// When this item is in an order and passes through this flag state inventory will be restocked via TR_LINE_DEPLETE_INVENTORY.
			/// </summary>
            public int InventoryRestockOnFlagId { get; internal set; }
			/// <summary>
			/// When this item is in an order and passes through this flag state inventory will be consumed via TR_LINE_DEPLETE_INVENTORY.
			/// </summary>
            public int ItemIsConsumedOnFlagId { get; internal set; }
			/// <summary>
			/// The revenue account number.  Used while exporting data to a real accouting system (not this janky one).
			/// </summary>
            public int RevenueAccount { get; internal set; }
			/// <summary>
			/// The id of the size of the product.
			/// </summary>
            public Guid SizeId { get; internal set; }
			/// <summary>
			/// The ratio for purchasing this:sibling items in a size/color matrix.
			/// </summary>
            public double Ratio { get; internal set; }
			/// <summary>
			/// The id of the division this item belongs to.
			/// </summary>
            public Guid DivisionId { get; internal set; }
			/// <summary>
			/// The order this item shows up in in a given listing.
			/// </summary>
            public int ListOrder { get; internal set; }
			/// <summary>
			/// Name of the category users can trace this item back to.
			/// </summary>
            public string HomeCategoryName { get; internal set; }
			/// <summary>
			/// Name of the category that should show up on this items detail page.
			/// </summary>
            public string AltCategoryName { get; internal set; }
			/// <summary>
			/// The prefix path of images for this item.
			/// </summary>
            public string SiteImagePrefixPath { get; internal set; }
			private Commerce.Category _homeCategory;
			private Commerce.Category _altCategory;
			/// <summary>
			/// Gets the home category.
			/// </summary>
			/// <value>The home category.</value>
			public Commerce.Category HomeCategory {
				get {
					if( _homeCategory == null ) {
						RefreshCategoryList();
					}
					if( _homeCategory == null ) {
						_homeCategory = new Category( "No Category", Guid.Empty, true );
					}
					return _homeCategory;
				}
			}
			/// <summary>
			/// Gets the alt category.
			/// </summary>
			/// <value>The alt category.</value>
			public Commerce.Category AltCategory {
				get {
					if( _altCategory == null ) {
						RefreshCategoryList();
					}
					if( _altCategory == null ) {
                        _altCategory = new Category("No Category", Guid.Empty, true);
					}
					return _altCategory;
				}
			}
			private List<Property> _properties;
			/// <summary>
			/// Gets the Properties.
			/// </summary>
			/// <value>The Properties.</value>
			public List<Property> Properties {
				get {
					if( _properties == null ) {
						_properties = Main.Site.Properties.List.FindAll( delegate( Property s ) {
							return s.ItemNumber == ItemNumber;
						} );
					}
					if( _properties == null ) {
						return new List<Property>();
					}
					return _properties;
				}
			}
			private List<Review> _reviews;
			/// <summary>
			/// Gets the reviews.
			/// </summary>
			/// <value>The reviews.</value>
			public List<Review> Reviews {
				get {
					if( _reviews == null ) {
						_reviews = Main.Site.Reviews.List.FindAll( delegate( Review review ) {
							return review.RefId == this.ItemNumber && review.RefType == "itemNumber";
						} );
					}
					if( _reviews == null ) {
						return new List<Review>();
					}
					return _reviews;
				}
			}
			private Form _form;
			/// <summary>
			/// Gets the form.
			/// </summary>
			/// <value>The form.</value>
			public Form Form {
				get {
					if( _form == null ) {
						if( FormName != "NO FORM" && FormName != "" ) {
							string path = Main.PhysicalApplicationPath + "forms\\";
							if( File.Exists( path + FormName ) ) {
								_form = new Form( this, path + FormName );
							}
							if( _form == null ) {
								_form = new Form( this );
							}
						} else {
							_form = new Form( this );
						}
					}
					return _form;
				}
			}
			private string _packingSlipImage;
			/// <summary>
			/// Gets the packing slip image.
			/// </summary>
			/// <value>The packing slip image.</value>
			public string PackingSlipImage {
				get {
					return SiteImagePrefixPath + _packingSlipImage;
				}
			}
			private string _auxillaryImage;
			/// <summary>
			/// Gets the auxillary image.
			/// </summary>
			/// <value>The auxillary image.</value>
			public string AuxillaryImage {
				get {
					return SiteImagePrefixPath + _auxillaryImage;
				}
			}
			private string _cartImage;
			/// <summary>
			/// Gets the cart image.
			/// </summary>
			/// <value>The cart image.</value>
			public string CartImage {
				get {
					return SiteImagePrefixPath + _cartImage;
				}
			}
			private string _detailImage;
			/// <summary>
			/// Gets the detail image.
			/// </summary>
			/// <value>The detail image.</value>
			public string DetailImage {
				get {
					return SiteImagePrefixPath + _detailImage;
				}
			}
			private string _fullSizeImage;
			/// <summary>
			/// Gets the full size image.
			/// </summary>
			/// <value>The full size image.</value>
			public string FullSizeImage {
				get {
					return SiteImagePrefixPath + _fullSizeImage;
				}
			}
			private string _listingImage;
			/// <summary>
			/// Gets the listing image.
			/// </summary>
			/// <value>The listing image.</value>
			public string ListingImage {
				get {
					return SiteImagePrefixPath + _listingImage;
				}
			}
			private string _listing2Image;
			/// <summary>
			/// Gets the listing2 image.
			/// </summary>
			/// <value>The listing2 image.</value>
			public string Listing2Image {
				get {
					return SiteImagePrefixPath + _listing2Image;
				}
			}
			/// <summary>
			/// Name of the form for this item.
			/// </summary>
            public string FormName { get; internal set; }
			/// <summary>
			/// HTML Ad Copy associated with this item.
			/// </summary>
            public string Html { get; internal set; }
			private List<Commerce.Item> _childItems = null;
			/// <summary>
			/// Gets the child items.
			/// </summary>
			/// <value>The child items.</value>
			public List<Commerce.Item> ChildItems {
				get {
					if( _childItems == null ) {
						_childItems = Main.Site.Items.List.FindAll( delegate( Commerce.Item i ) {
							return i.ParentItemnumber == this.Number;
						} );
						if( _childItems == null ) {
							_childItems = new List<Item>(); /* return an empty list if no children were found */
						}
					}
					return _childItems;
				}
			}
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Item"/> class.
			/// </summary>
			/// <param name="site">The site.</param>
			/// <param name="item_number">The item_number.</param>
			/// <param name="displayprice">The displayprice.</param>
			/// <param name="price">The price.</param>
			/// <param name="salePrice">The sale price.</param>
			/// <param name="wholeSalePrice">The whole sale price.</param>
			/// <param name="IsOnSale">if set to <c>true</c> [is on sale].</param>
			/// <param name="description">The description.</param>
			/// <param name="shortCopy">The short copy.</param>
			/// <param name="packingSlipImage">The packing slip image.</param>
			/// <param name="auxillaryImage">The auxillary image.</param>
			/// <param name="cartImage">The cart image.</param>
			/// <param name="formName">Name of the form.</param>
			/// <param name="productCopy">The product copy.</param>
			/// <param name="HTML">The HTML.</param>
			/// <param name="detailImage">The detail image.</param>
			/// <param name="fullSizeImage">The full size image.</param>
			/// <param name="listingImage">The listing image.</param>
			/// <param name="listing2Image">The listing2 image.</param>
			/// <param name="reorderpoint">The reorderpoint.</param>
			/// <param name="BOMOnly">if set to <c>true</c> [BOM only].</param>
			/// <param name="HomeCategory">The home category.</param>
			/// <param name="HomeAltCategory">The home alt category.</param>
			/// <param name="Weight">The weight.</param>
			/// <param name="quantifier">The quantifier.</param>
			/// <param name="shortDescription">The short description.</param>
			/// <param name="freeShipping">if set to <c>true</c> [free shipping].</param>
			/// <param name="keywords">The keywords.</param>
			/// <param name="searchPriority">The search priority.</param>
			/// <param name="workCreditValue">The work credit value.</param>
			/// <param name="notax">if set to <c>true</c> [notax].</param>
			/// <param name="deleted">if set to <c>true</c> [deleted].</param>
			/// <param name="removeafterpurchase">if set to <c>true</c> [removeafterpurchase].</param>
			/// <param name="parentItemnumber">The parent itemnumber.</param>
			/// <param name="swatchId">The swatch id.</param>
			/// <param name="allowPreorders">if set to <c>true</c> [allow preorders].</param>
			/// <param name="inventoryOperator">The inventory operator.</param>
			/// <param name="inventoryDepletesOnFlagId">The inventory depletes on flag id.</param>
			/// <param name="inventoryRestockOnFlagId">The inventory restock on flag id.</param>
			/// <param name="itemIsConsumedOnFlagId">The item is consumed on flag id.</param>
			/// <param name="revenueaccount">The revenueaccount.</param>
			/// <param name="sizeId">The size id.</param>
			/// <param name="ratio">The ratio.</param>
			/// <param name="divisionId">The division id.</param>
			public Item( Site site, string item_number, string displayprice, decimal price, decimal salePrice, decimal wholeSalePrice, bool IsOnSale, string description,
			string shortCopy, string packingSlipImage, string auxillaryImage, string cartImage, string formName, string productCopy, string HTML, string detailImage,
			string fullSizeImage, string listingImage, string listing2Image, int reorderpoint, bool BOMOnly, Guid HomeCategory, Guid HomeAltCategory, double Weight,
			string quantifier, string shortDescription, bool freeShipping, string keywords, int searchPriority, decimal workCreditValue, bool notax, bool deleted,
			bool removeafterpurchase, string parentItemnumber, Guid swatchId, bool allowPreorders, int inventoryOperator, int inventoryDepletesOnFlagId,
			int inventoryRestockOnFlagId, int itemIsConsumedOnFlagId, int revenueaccount, Guid sizeId, double ratio, Guid divisionId ) {
				this.Number = item_number;
				this.ItemNumber = item_number;
				this.DisplayPrice = displayprice;
				this.Price = price;
				this.SalePrice = salePrice;
				this.WholeSalePrice = wholeSalePrice;
				this.IsOnSale = IsOnSale;
				this.Description = description;
				this.ShortCopy = shortCopy;
				this._packingSlipImage = packingSlipImage;
				this._auxillaryImage = auxillaryImage;
				this._cartImage = cartImage;
				this.FormName = formName;
				this.ProductCopy = productCopy;
				this.Html = HTML;
				this._detailImage = detailImage;
				this._fullSizeImage = fullSizeImage;
				this._listingImage = listingImage;
				this._listing2Image = listing2Image;
				this.ReorderPoint = reorderpoint;
				this.BOMOnly = BOMOnly;
				this.HomeCategoryId = HomeCategory;
				this.AltCategoryId = HomeAltCategory;
				this.Weight = Weight;
				this.Quantifier = quantifier;
				this.ShortDescription = shortDescription;
				this.FreeShipping = freeShipping;
				this.Keywords = keywords;
				this.SearchPriority = searchPriority;
				this.WorkCreditValue = workCreditValue;
				this.NoTax = notax;
				this.Deleted = deleted;
				this.RemoveAfterPurchase = removeafterpurchase;
				this.ParentItemnumber = parentItemnumber;
				this.SwatchId = swatchId;
				this.AllowPreorders = allowPreorders;
				this.InventoryOperator = inventoryOperator;
				this.InventoryDepletesOnFlagId = inventoryDepletesOnFlagId;
				this.InventoryRestockOnFlagId = inventoryRestockOnFlagId;
				this.ItemIsConsumedOnFlagId = itemIsConsumedOnFlagId;
				this.RevenueAccount = revenueaccount;
				this.SizeId = sizeId;
				this.Ratio = ratio;
				this.DivisionId = divisionId;
				SiteImagePrefixPath = "/img/items/" + site.siteAddress + "/" + ItemNumber + "/";
			}
            #endregion
        }
		/// <summary>
		/// This class creates a list of all the items in the database
		/// </summary>
		internal class Items {
            #region Instance Fields
            /// <summary>
			/// List of the items.
			/// </summary>
			public List<Item> List = new List<Item>();
            #endregion
            #region Instance Methods
            /// <summary>
			/// Gets the item by its item number.
			/// </summary>
			/// <param name="itemNumberToGet">The item number to get.</param>
			/// <returns>Seletced item number or null</returns>
			public Commerce.Item GetItemByItemNumber( string itemNumberToGet ) {
				Commerce.Item i = List.Find( delegate( Commerce.Item itm ) {
					return itm.ItemNumber.ToLower() == itemNumberToGet.ToLower();
				} );
				return i;
			}
            /// <summary>
            /// Loads the items.
            /// </summary>
            /// <param name="site">The site.</param>
            /// <param name="limitItemsToThisList">The limit items to this list.</param>
            private void LoadItems(Site site, string[] limitItemsToThisList) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    using(SqlCommand cmd = new SqlCommand("dbo.getItems @unique_siteId", cn)) {
                        cmd.Parameters.Add("@unique_siteId", SqlDbType.UniqueIdentifier).Value = new Guid(Site.Id.ToString());
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            while(d.Read()) {
                                bool addItem = false;
                                if(limitItemsToThisList != null) {
                                    foreach(string itm in limitItemsToThisList) {
                                        if(itm == d.GetString(0)) {
                                            addItem = true;
                                        }
                                    }
                                } else {
                                    addItem = true;
                                }
                                if(addItem) {
                                    Commerce.Item i = new Item(
                                        site,
                                        d.GetString(0), d.GetString(1), d.GetDecimal(2), d.GetDecimal(3), d.GetDecimal(4), d.GetBoolean(5),
                                        d.GetString(6), d.GetString(7), d.GetString(8), d.GetString(9), d.GetString(10), d.GetString(11),
                                        d.GetString(12), d.GetString(13), d.GetString(14), d.GetString(15), d.GetString(16), d.GetString(17),
                                        d.GetInt32(18), d.GetBoolean(19), d.GetGuid(20), d.GetGuid(21), d.GetDouble(22), d.GetString(23),
                                        d.GetString(24), d.GetBoolean(25), d.GetString(26), d.GetInt32(27), d.GetDecimal(28), d.GetBoolean(29),
                                        d.GetBoolean(30), d.GetBoolean(31), d.GetString(32), d.GetGuid(33), d.GetBoolean(34), d.GetInt32(35),
                                        d.GetInt32(36), d.GetInt32(37), d.GetInt32(38), d.GetInt32(39), d.GetGuid(40), d.GetDouble(41),
                                        d.GetGuid(42)
                                    );
                                    List.Add(i);
                                }
                            }
                        }
                    }
                }
            }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Items"/> class.
			/// </summary>
			/// <param name="site">The site.</param>
			public Items( Site site ) {
				LoadItems( site, null );
			}
			/// <summary>
			/// Initializes a new instance of the <see cref="Items"/> class.
			/// </summary>
			/// <param name="site">The site.</param>
			/// <param name="limitItemsToThisList">The limit items to this list.</param>
			public Items( Site site, string[] limitItemsToThisList ) {
				LoadItems( site, limitItemsToThisList );
			}
            #endregion
		}
	}
}
