using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rendition;
namespace Rendition.standardPlugins.discountCodes {
	public class discountCodes:Plugin {
		public discountCodes() {
			this.Message="Loaded";
			Site.CurrentSite.CalculatingDiscount+=new EventHandler(site_oncalculatediscount);
		}
		public void site_oncalculatediscount(object sender, EventArgs e){
            CalculateDiscountEventArgs args = (CalculateDiscountEventArgs)e;
			/* compare the list of discounts to the session key/value 'discountCode' */
			string discountCode = "";
			decimal discountAmount = 0;
			if(args.Session.Properties.ContainsKey("discountCode")){
				discountCode = (string)args.Session.GetProperty("discountCode");
				Commerce.Discount discount = Commerce.Discount.All.Find(delegate(Commerce.Discount d){
                    return d.Code.MaxLength(25, true, true).ToLower() == discountCode.MaxLength(25, true, true).ToLower();
				});
				if(discount!=null){
					discountAmount = args.Cart.SubTotal * decimal.Parse(discount.Percent.ToString());
				}
			}
			if( discountAmount != 0) {
				args.Discount = decimal.Round(discountAmount,2,MidpointRounding.ToEven);
			}
			return;
		}
	}
}
