using System;
using System.Text;
using Rendition;
using System.Collections.Generic;
/// <summary>
/// form constructor.  Creates a dynamic form based on the properties.  Version 0.1.1.
/// </summary>
public class script {
	public string main(Session session,Commerce.Item item,Commerce.CartItem cartItem,object current) {
		StringBuilder b=new StringBuilder("");
		decimal basePrice;
		if(item.IsOnSale) {
			basePrice=item.SalePrice;
		} else {
			basePrice=item.Price;
		}
		if(session!=null) {
			if(session.User!=null) {
				if(session.User.WholesaleDealer) {
					basePrice=item.WholeSalePrice;
				}
			}
		}
		b.Append("<script language=\"javascript\" type=\"text/javascript\">"+@"
			window._p = function(){
				updateSelectablePrice("+basePrice+@",document.getElementById('prices'),document.getElementById('price'));
			}
			$(function(){
				setTimeout(function(){
					window._p();
				},1000);
			})
			function updateSelectablePrice(_basePrice, inputContainerSelector, priceElementSelector, callbackProcedure) {
				var formElements = $(inputContainerSelector).find(':input');
				var priceElement = $(priceElementSelector);
				var total = 0;
				/* for newbies to JS: when adding floats - money - 
				it's important to _first_ convert all numbers to integers
				then covert them back to floats (x*100 / 100).toFixed(2) */
				for (var x = 0; formElements.length > x; x++) {
					var i = formElements[x];
					/* form constructor.cs select options contain attributes called 'price' and 'itemNumber' */
					if (i.tagName.toLowerCase() == 'select') {
						/* get the selected option */
						var opt = i.options[i.selectedIndex];
						var price = 0;
						var itemNumber = '';
						var _price = opt.getAttribute('price');
						var _itemNumber = opt.getAttribute('itemNumber');
						if (_price != undefined) {
							if (!isNaN(parseFloat(_price))) {
								price = parseInt(parseFloat(_price) * 100);
								total += price;
							}
						}
						if (_itemNumber != undefined) {
							itemNumber = _itemNumber;
						}
						if (i.previousSibling) {
							if (i.previousSibling.className=='info') {
								var info = i.previousSibling;
								info.onmouseover = function (e) {
									/* put info bubble */
								}
								info.onclick = function (e) {
									/* put info bubble */
								}
							}
						}
					}
				}
				var basePrice = parseInt(parseFloat(_basePrice) * 100);
				total += basePrice;
				if (priceElement[0]) {
					priceElement[0].innerHTML = '$' + (parseFloat(total) / parseFloat(100)).toFixed(2);
				}
				if (callbackProcedure) {
					callbackProcedure.apply(this, []);
				}
			}
		</script>");
		try {
			string thisPropertyName="";
			List<string> selects=new List<string>();
			/* make the selects list */
			item.Properties.Sort(delegate(Commerce.Property p1, Commerce.Property p2){
				return p1.Name.CompareTo(p2.Name);
			});
			foreach(Commerce.Property p in item.Properties) {
				bool endSelect=false;
				if(thisPropertyName!=p.Name) {
					thisPropertyName=p.Name;
					selects.Add(thisPropertyName);
				}
			}
			item.Properties.Sort(delegate(Commerce.Property p1, Commerce.Property p2){
				return p1.Order.CompareTo(p2.Order);
			});
			b.Append("<div class=\"prodcutDetailControls\" style=\"margin:10px;width:auto;\" id=\"prices\">");
			foreach(string select in selects) {
				b.Append(select+"<br>");
				b.Append("<select style=\"width:100%;\" name=\""+select+"\" onchange=\"_p();\">");
				foreach(Commerce.Property p in item.Properties) {
					if(select==p.Name) {
						string price="0.00";
						Commerce.Item i=Rendition.Commerce.Item.GetItem(p.Value);
						if(i!=null) {
							if(i.IsOnSale) {
								price=i.SalePrice.ToString("f");
							} else {
								price=i.Price.ToString("f");
							}
							if(session!=null) {
								if(session.User!=null) {
									if(session.User.WholesaleDealer) {
										price=i.WholeSalePrice.ToString("f");
									}
								}
							}
						}
						if(price=="0.00") {
							b.Append("<option itemNumber=\""+p.Value+"\" price=\"0\" value=\""+p.Value+"\">"+p.Text+"</option>");
						} else {
							b.Append("<option itemNumber=\""+p.Value+"\" price=\""+price.ToString()+"\" value=\""+p.Value+"\">"+p.Text+" +$"+price+"</option>");
						}

					}
				}
				b.Append("</select><br>");
			}
			b.Append("</div>");
			return b.ToString();
		} catch(Exception e) {
			return e.Message;
		}
	}
}