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
	public partial class Admin {
		/// <summary>
		/// wrapper for merchant backorderItems.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string, object> BackorderItems( List<object> args ) {
            return Commerce.Order.BackorderItems(args);
		}
		/// <summary>
		/// wrapper for merchant cancelItems.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string, object> CancelItems( List<object> args ) {
            return Commerce.Order.CancelItems(args);
		}
		/// <summary>
		/// wrapper for merchant updateOrderItem.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string, object> UpdateOrderItem( Dictionary<string, object> args ) {
			return Commerce.Order.UpdateOrderItem( args );
		}
		/// <summary>
		/// wrapper for merchant deleteCartItem.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string, object> DeleteCartItem( Dictionary<string, object> args ) {
			return Merchant.DeleteCartItem( args );
		}
		/// <summary>
		/// wrapper for merchant logon.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string, object> LogOn( Dictionary<string, object> args ) {
			return Site.LogOn( args );
		}
		/// <summary>
		/// wrapper for merchant.updateCartItem.
		/// </summary>
		/// <param name="args">arguments</param>
		/// <returns></returns>
		public static Dictionary<string, object> UpdateCartItem( Dictionary<string, object> args ) {
			return Commerce.Cart.UpdateCartItem( args );
		}
		/// <summary>
		/// Wrapper for merchant.reclaculate.
		/// </summary>
		/// <param name="args">The args.</param>
		/// <returns></returns>
		public static Dictionary<string, object> Recalculate( Dictionary<string, object> args ) {
			return Commerce.Cart.Recalculate( args );
		}
		/// <summary>
		/// Wrapper for merchat add to cart.
		/// </summary>
		/// <param name="args">arguments.</param>
		/// <returns></returns>
		public static Dictionary<string, object> AddToCart( Dictionary<string, object> args ) {
			return Merchant.AddToCart( args );
		}
		/// <summary>
		/// Wrapper for merchant.recalculateOrder.
		/// </summary>
		/// <param name="args">arguments.</param>
		/// <returns></returns>
		public static Dictionary<string, object> RecalculateOrder( Dictionary<string, object> args ) {
            return Commerce.Order.RecalculateOrder(args);
		}
		/// <summary>
		/// Wrapper for merchant.placeOrder.
		/// </summary>
		/// <param name="args">arguments.</param>
		/// <returns></returns>
		public static Dictionary<string, object> PlaceOrder( Dictionary<string, object> args ) {
			return Merchant.PlaceOrder( args );
		}
	}
}
