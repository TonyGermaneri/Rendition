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
namespace Rendition {
	public partial class Admin {
        /// <summary>
        /// Duplicates the specified item, creating a new item with a different number.
        /// Images are not duplicated.
        /// </summary>
        /// <param name="args">The args.</param>
        /// <returns></returns>
        public static Dictionary<string, object> DuplicateItem(Dictionary<string, object> args) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            if(!args.ContainsKey("source") || !args.ContainsKey("target")) {
                j.Add("error", -1);
                j.Add("description", "The keys source and target must be present in the arguments parameter.");
                return j;
            }
            // get the source
            Commerce.Item item = null;
            item = Commerce.Item.GetItem(args["source"].ToString());
            if(item == null) {
                j.Add("error", -2);
                j.Add("description", string.Format("Item {0} does not exist.", args["source"].ToString()));
                return j;
            }
            // make sure the target item # does not exist already
            Commerce.Item titem = Commerce.Item.GetItem(args["target"].ToString());
            if(titem != null) {                
                j.Add("error", -3);
                j.Add("description", string.Format("Item {0} already exists.",args["target"].ToString()));
                return j;
            }
            // copy the source properties to the target and create the new item
            // 1 use the import program to copy the item's base table entry
            Dictionary<string, object> n = new Dictionary<string, object>();
            n.Add("itemNumber", args["target"].ToString());
            n.Add("displayPrice",item.DisplayPrice);
            n.Add("reorderPoint",item.ReorderPoint);
            n.Add("BOMOnly",item.BOMOnly);
            n.Add("itemHTML",item.Html);
            n.Add("price",item.Price);
            n.Add("salePrice",item.SalePrice);
            n.Add("wholeSalePrice",item.WholeSalePrice);
            n.Add("isOnSale",item.IsOnSale);
            n.Add("description",item.Description);
            n.Add("shortCopy",item.ShortCopy);
            n.Add("productCopy",item.ProductCopy);
            n.Add("weight",item.Weight);
            n.Add("quantifier",item.Quantifier);
            n.Add("shortDescription",item.ShortDescription);
            n.Add("freeShipping",item.FreeShipping);
            n.Add("formName",item.FormName);
            n.Add("keywords",item.Keywords);
            n.Add("searchPriority",item.SearchPriority);
            n.Add("workCreditValue",item.WorkCreditValue);
            n.Add("noTax",item.NoTax);
            n.Add("deleted",item.Deleted);
            n.Add("removeAfterPurchase",item.RemoveAfterPurchase);
            if(item.ParentItem == null) {
                n.Add("parentItemNumber", "");
            } else {
                n.Add("parentItemNumber", item.ParentItem.Number);
            }
            n.Add("allowPreorders",item.AllowPreorders);
            n.Add("inventoryOperator",item.InventoryOperator);
            n.Add("inventoryRestockOnFlagId",item.InventoryRestockOnFlagId);
            n.Add("itemIsConsumedOnFlagId",item.ItemIsConsumedOnFlagId);
            n.Add("inventoryDepletesOnFlagId",item.InventoryDepletesOnFlagId);
            n.Add("revenueAccount",item.RevenueAccount);
            n.Add("ratio",item.Ratio);
            n.Add("highThreshold","");
            n.Add("expenseAccount","");
            n.Add("inventoryAccount","");
            n.Add("COGSAccount","");
            n.Add("SKU","");
            n.Add("itemType","");
            n.Add("averageCost", "");
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                ImportItem(n, false, cn, null);
            }
            // copy the item's properties using the CopyItemPropertiesToItems method
            List<object> pids = new List<object>();
            foreach(Commerce.Property p in item.Properties) {
                pids.Add(p.Id.ToString());
            }
            List<object> tid = new List<object>();
            tid.Add(args["target"].ToString());
            CopyItemPropertiesToItems(pids, tid);
            // copy BOM structure
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                string sql = @"insert into itemdetail
                select NewId(), @target, subItemNumber, qty, depth, itemQty, kitStock, 
                showAsSeperateLineOnInvoice, onlyWhenSelectedOnForm, itemComponetType, null as VerCol
                from itemdetail with (nolock)
                where itemNumber = @source";
                using(SqlCommand cmd = new SqlCommand(sql, cn)) {
                    cmd.Parameters.Add("@source", SqlDbType.VarChar).Value = args["source"].ToString();
                    cmd.Parameters.Add("@target", SqlDbType.VarChar).Value = args["target"].ToString();
                    cmd.ExecuteNonQuery();
                }
            }
            // copy columns that were not handeled by the import procedure
            // highThreshold
            // expenseAccount
            // inventoryAccount
            // COGSAccount
            // SKU
            // itemType
            // homeCategory
            // homeAltCategory
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                // a brain fart caused me to forget how to do this, so this is how I did it today.  I know this isn't right, but it'll work just fine.
                string sql = @"update items set 
                highThreshold = (select highThreshold from items with (nolock) where itemNumber = @source ),
                expenseAccount = (select expenseAccount from items with (nolock) where itemNumber = @source ),
                inventoryAccount = (select inventoryAccount from items with (nolock) where itemNumber = @source ),
                COGSAccount = (select COGSAccount from items with (nolock) where itemNumber = @source ),
                SKU = (select SKU from items with (nolock) where itemNumber = @source ),
                itemType = (select itemType from items with (nolock) where itemNumber = @source ),
                homeCategory = (select homeCategory from items with (nolock) where itemNumber = @source ),
                homeAltCategory = (select homeAltCategory from items with (nolock) where itemNumber = @source )
                where itemNumber = @target;";
                using(SqlCommand cmd = new SqlCommand(sql, cn)) {
                    cmd.Parameters.Add("@source", SqlDbType.VarChar).Value = args["source"].ToString();
                    cmd.Parameters.Add("@target", SqlDbType.VarChar).Value = args["target"].ToString();
                    cmd.ExecuteNonQuery();
                }
            }
            // copy the item into the various categories the other item belongs to
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                string sql = @"insert into categoryDetail
                select NewId(), categoryId, @target, listOrder, childCategoryId, null as VerCol
                from categoryDetail with (nolock)
                where itemNumber = @source";
                using(SqlCommand cmd = new SqlCommand(sql, cn)) {
                    cmd.Parameters.Add("@source", SqlDbType.VarChar).Value = args["source"].ToString();
                    cmd.Parameters.Add("@target", SqlDbType.VarChar).Value = args["target"].ToString();
                    cmd.ExecuteNonQuery();
                }
            }
            // images are not copied
            // refresh the cache
            RefreshItemsCache();
            j.Add("error", 0);
            j.Add("description", "");
            return j;
        }
		/// <summary>
		/// Gets the form info.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string, object> GetFormInfo( Dictionary<string, object> args ) {
			( "FUNCTION /w SP,fileSystem getFormInfo" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
			Commerce.Item item = null;
			string formName = "";
			if( args.ContainsKey( "formName" ) ) { /* lookup using the form name */
				formName = Convert.ToString( args[ "formName" ] );
			} else if( args.ContainsKey( "cartId" ) ) { /* if this order has been placed lookup using the stored form */
				formName = null;
			} else if( args.ContainsKey( "itemNumber" ) ) { /* lookup using the items form */
				item = Main.Site.Items.List.Find( delegate( Commerce.Item b ) {
					if( Convert.ToString( args[ "itemNumber" ] ).ToLower() == b.ItemNumber.ToLower() ) {
						return true;
					}
					return false;
				} );
				formName = item.FormName;
			}
			if( formName != null ) {
				Commerce.Form form = new Commerce.Form( item, Main.PhysicalApplicationPath + "forms\\" + formName.Trim().ToLower() );
				if( form != null ) {
					j.Add( "name", form.Name );
					j.Add( "inputs", form.Inputs );
					j.Add( "HTML", form.Html );
					j.Add( "error", 0 );
					j.Add( "description", "" );
				} else {
					( "getFormInfo error -1 ==> form not found:" + formName.Trim() ).Debug( 2 );
					j.Add( "error", -1 );
					j.Add( "description", "Form not found" );
				}
			} else if( args.ContainsKey( "cartId" ) ) {
				string sourceCode = "";
				Guid cartId = new Guid( Convert.ToString( args[ "cartId" ] ) );
                Guid sessionId = Guid.Empty;
                if(args.ContainsKey("sessionId")) {
                    sessionId = new Guid(Convert.ToString(args["sessionId"]));
                }
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    /* check if this is an order or a cart item */
                    bool existingOrder = false;
                    using(SqlCommand cmd = new SqlCommand(@"select 0 from cart with (nolock) where cartId = @cartId and not orderId = -1", cn)) {
                        cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = cartId;
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            existingOrder = d.HasRows;
                        }
                    }
                    if(!existingOrder && sessionId != Guid.Empty) {
                        Session session = new Session(Main.Site, sessionId, cn, null);
                        session.Cart.Refresh();
                        /* find the selected id */
                        Commerce.CartItem cartItem = session.Cart.Items.Find(delegate(Commerce.CartItem it) {
                            return it.CartId == cartId;
                        });
                        if(cartItem == null) {
                            j.Add("error", -1);
                            j.Add("description", "No data for cartId " + args["cartId"].ToString());
                            return j;
                        }
                        if(cartItem.Form == null) {
                            j.Add("error", 0);/* this isn't really an error becuase items might contain no form data */
                            j.Add("description", "No form data for cartId " + args["cartId"].ToString());
                        } else {
                            j.Add("name", cartItem.Form.Name);
                            j.Add("inputs", cartItem.Inputs);
                            j.Add("HTML", cartItem.HtmlWithValues);
                            j.Add("emptyHTML", cartItem.Item.Form.Html);
                            j.Add("error", 0);
                            j.Add("description", "");
                        }
                        return j;
                    }else{
                        using(SqlCommand cmd = new SqlCommand("dbo.getOrderForm @cartId", cn)) {
                            cmd.Parameters.Add("@cartId", SqlDbType.UniqueIdentifier).Value = cartId;
                            formName = "";
                            string itemNumber = "";
                            using(SqlDataReader d = cmd.ExecuteReader()) {
                                if(d.HasRows) {
                                    d.Read();
                                    sourceCode = d.GetValue(0).ToString();
                                    formName = d.GetValue(1).ToString();
                                    itemNumber = d.GetValue(2).ToString();
                                }
                            }
                        }
                        /* find the order */
                        Commerce.Order order = Commerce.Order.GetOrderByCartId(cartId, cn, null);
                        /* find the line */
                        Commerce.Line line = order.Lines.Find(delegate(Commerce.Line l) {
                            return l.CartId == cartId;
                        });
                        /* return the data */
                        if(line.Form != null) {
                            j.Add("name", line.Form.Name);
                            j.Add("inputs", line.Form.Inputs);
                            j.Add("HTML", line.Form.HtmlWithValues());
                            j.Add("emptyHTML", line.Form.Html);
                            j.Add("error", 0);
                            j.Add("description", "");
                        } else {
                            j.Add("error", 0);/* this isn't really an error becuase items might contain no form data */
                            j.Add("description", "No form data for cartId " + args["cartId"].ToString());
                        }
                    }
                }
			}
			return j;
		}
		/// <summary>
		/// Refreshes the item images.
		/// </summary>
		/// <param name="itemNumber">The item number.</param>
		/// <returns></returns>
		public static Dictionary<string, object> RefreshAllItemImages( string itemNumber ) {
			string[] ls = new string[ 0 ];
			return RefreshItemImages( itemNumber, ls, Guid.Empty, Guid.Empty );
		}
		/// <summary>
		/// Copies the item Properties to items.
		/// </summary>
		/// <param name="itemPropertyIds">The item property ids.</param>
		/// <param name="targetItemNumbers">The target item numbers.</param>
		/// <returns></returns>
		public static Dictionary<string, object> CopyItemPropertiesToItems( List<object> itemPropertyIds, List<object> targetItemNumbers ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			foreach( object _itemPropertyId in itemPropertyIds ) {
				string itemPropertyId = ( string )_itemPropertyId;
				foreach( object _itemNumber in targetItemNumbers ) {
					string itemNumber = ( string )_itemNumber;
					string sqlCommand = @"insert into itemProperties select
					newId() as itemPropertyId, @itemNumber as itemNumber, itemProperty, propertyValue, displayValue, 
					valueOrder, BOMItem, price, taxable, showAsSeperateLineOnInvoice, showInFilter, 
					null as VerCol from itemProperties with (nolock) where itemPropertyId = @itemPropertyId";
                    using(SqlConnection cn = Site.CreateConnection(true, true)) {
                        cn.Open();
                        using(SqlCommand cmd = new SqlCommand(sqlCommand, cn)) {
                            cmd.Parameters.Add("@itemPropertyId", SqlDbType.UniqueIdentifier).Value = new Guid(itemPropertyId);
                            cmd.Parameters.Add("@itemNumber", SqlDbType.VarChar).Value = itemNumber;
                            cmd.ExecuteNonQuery();
                        }
                    }
				}
			}
			j.Add( "error", 0 );
			j.Add( "description", "" );
			return j;
		}
		/// <summary>
		/// Gets most of the item's information formated for JSON.
		/// </summary>
		/// <param name="itemNumber">The item number.</param>
		/// <returns></returns>
		public static Dictionary<string, object> GetItem( string itemNumber ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			Commerce.Item item = Main.Site.Items.GetItemByItemNumber( itemNumber );
			if( item == null ) {
				j.Add( "error", -1 );
				j.Add( "description", String.Format( "Item {0} not found.", itemNumber ) );
				return j;
			}
			j.Add( "error", 0 );
			j.Add( "description", "" );
			j.Add( "allowPreorders", item.AllowPreorders );
			j.Add( "altCategoryId", item.AltCategoryId );
			j.Add( "altCategoryName", item.AltCategoryName );
			j.Add( "auxillaryImage", item.AuxillaryImage );
			j.Add( "availableOn", item.AvailableOn );
			j.Add( "avaliableToSell", item.AvaliableToSell );
			j.Add( "BOMOnly", item.BOMOnly );
			j.Add( "cartImage", item.CartImage );
			j.Add( "consumed", item.Consumed );
			j.Add( "deleted", item.Deleted );
			j.Add( "item_description", item.Description );
			j.Add( "detailImage", item.DetailImage );
			j.Add( "displayprice", item.DisplayPrice );
			j.Add( "divisionId", item.DivisionId );
			j.Add( "formName", item.FormName );
			j.Add( "freeShipping", item.FreeShipping );
			j.Add( "fullSizeImage", item.FullSizeImage );
			j.Add( "homeCategoryId", item.HomeCategoryId );
			j.Add( "homeCategoryName", item.HomeCategoryName );
			j.Add( "HTML", item.Html );
			j.Add( "inventoryDepletesOnFlagId", item.InventoryDepletesOnFlagId );
			j.Add( "inventoryOperator", item.InventoryOperator );
			j.Add( "inventoryRestockOnFlagId", item.InventoryRestockOnFlagId );
			j.Add( "IsOnSale", item.IsOnSale );
			j.Add( "itemIsConsumedOnFlagId", item.ItemIsConsumedOnFlagId );
			j.Add( "itemNumber", item.ItemNumber );
			j.Add( "keywords", item.Keywords );
			j.Add( "listing2Image", item.Listing2Image );
			j.Add( "listingImage", item.ListingImage );
			j.Add( "notax", item.NoTax );
			j.Add( "packingSlipImage", item.PackingSlipImage );
			j.Add( "parentItemnumber", item.ParentItemnumber );
			j.Add( "prebook", item.Prebook );
			j.Add( "price", item.Price );
			j.Add( "productCopy", item.ProductCopy );
			j.Add( "properties", item.Properties );
			j.Add( "quantifier", item.Quantifier );
			j.Add( "ratio", item.Ratio );
			j.Add( "removeafterpurchase", item.RemoveAfterPurchase );
			j.Add( "reorderpoint", item.ReorderPoint );
			j.Add( "revenueaccount", item.RevenueAccount );
			j.Add( "salePrice", item.SalePrice );
			j.Add( "searchPriority", item.SearchPriority );
			j.Add( "shortCopy", item.ShortCopy );
			j.Add( "shortDescription", item.ShortDescription );
			j.Add( "site_image_prefix_path", item.SiteImagePrefixPath );
			j.Add( "sizeId", item.SizeId );
			j.Add( "stockStatus", item.StockStatus );
			j.Add( "swatchId", item.SwatchId );
			j.Add( "volume", item.Volume );
			j.Add( "weight", item.Weight );
			j.Add( "wholeSalePrice", item.WholeSalePrice );
			j.Add( "workCreditValue", item.WorkCreditValue );
			j.Add( "workInProgress", item.WorkInProgress );
			Dictionary<string, object> form = new Dictionary<string, object>();
			form.Add( "HTML", item.Form.Html );
			form.Add( "name", item.Form.Name );
			form.Add( "inputs", item.Form.Inputs );
			form.Add( "ext", item.Form.Extention );
			j.Add( "form", form );
			return j;
		}
	}
}
