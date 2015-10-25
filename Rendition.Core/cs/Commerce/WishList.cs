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
        #region Static Methods
        /// <summary>
		/// Removes an item from the user's CSV list of items in session.Properties["wishlist"].
		/// </summary>
		/// <param name="itemNumber">The item number.</param>
		/// <returns>{error:0,desc:"error description",wishList:"wishListCSV"}.</returns>
		public static Dictionary<string, object> RemoveFromWishlist( string itemNumber ) {
			/* get the existing wishlist - a CSV list of item numbers */
			Dictionary<string, object> j = new Dictionary<string, object>();
			Session session = Main.GetCurrentSession();
			string wishListCSV = ( string )session.GetPropertyOrBlank( "wishList" );
			string[] wishList = wishListCSV.Split( ',' );
			List<string> newWishList = new List<string>();
			foreach( string itm in wishList ) {
				if( !newWishList.Contains( itm ) ) {
					if( itm != itemNumber ) {
						newWishList.Add( itm );
					}
				}
			}
			session.AddProperty( "wishList", string.Join( ",", newWishList.ToArray() ) );
			j.Add( "error", 0 );
			j.Add( "description", "" );
			j.Add( "wishList", newWishList );
			return j;
		}
		/// <summary>
		/// Adds an item to the user's CSV list of items in session.Properties["wishlist"].
		/// </summary>
		/// <param name="itemNumber">The item number.</param>
		/// <returns>{error:0,desc:"error description",wishList:"wishlistCSV"}.</returns>
		public static Dictionary<string, object> AddToWishlist( string itemNumber ) {
			/* get the existing wishlist - a CSV list of item numbers */
			Dictionary<string, object> j = new Dictionary<string, object>();
			Session session = Main.GetCurrentSession();
			string wishListCSV = ( string )session.GetPropertyOrBlank( "wishList" );
			string[] wishList = wishListCSV.Split( ',' );
			List<string> newWishList = new List<string>();
			foreach( string itm in wishList ) {
				/* prevent blank and duplicate items */
				if( !newWishList.Contains( itm ) && itm.Trim().Length > 0 ) {
					newWishList.Add( itm );
				}
			}
			Commerce.Item i = Main.Site.Items.GetItemByItemNumber( itemNumber );
			if( !newWishList.Contains( itemNumber ) && i != null ) {
				newWishList.Add( itemNumber );
			}
			session.AddProperty( "wishList", string.Join( ",", newWishList.ToArray() ) );
			j.Add( "error", 0 );
			j.Add( "description", "" );
			j.Add( "wishList", newWishList );
			return j;
        }
        #endregion
    }
}
