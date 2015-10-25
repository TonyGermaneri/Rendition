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
	/// <summary>
	/// All events in this program are enumerated here.
	/// </summary>
	public interface ISiteInterface {
        /// <summary>
        /// Occurs when the site cache refreshes.
        /// </summary>
        event EventHandler AfterRefresh;
        /// <summary>
		/// Occurs after the user authenticates.
		/// </summary>
        event EventHandler AfterAuthentication;
		/// <summary>
		/// Occurs when the site starts.
		/// </summary>
		event EventHandler Initializing;
		/// <summary>
		/// Occurs when the site is shutting down.
		/// </summary>
		event EventHandler Disposing;
		/// <summary>
		/// Occurs when a request begins.
		/// </summary>
		event EventHandler BeginRequest;
		/// <summary>
		/// Occurs when a request ends.
		/// </summary>
		event EventHandler EndRequest;
		/// <summary>
		/// Occurs when an order is recalculated.
		/// </summary>
		event EventHandler RecalculatedOrder;
		/// <summary>
		/// Occurs when a cart/quote is recalculated.
		/// </summary>
		event EventHandler RecalculatedCart;
		/// <summary>
		/// Occurs just before an order is placed.
		/// </summary>
		event EventHandler PlacingOrder;
		/// <summary>
		/// Occurs after an order is placed.
		/// </summary>
		event EventHandler PlacedOrder;
		/// <summary>
		/// Occurs when a user logs on.
		/// </summary>
		event EventHandler LoggedOff;
        /// <summary>
        /// Occurs when a session is refreshed.
        /// </summary>
        event EventHandler RefreshSession;
		/// <summary>
		/// Occurs when a user logs off.
		/// </summary>
		event EventHandler LoggedOn;
		/// <summary>
		/// Occurs when a user is created.
		/// </summary>
		event EventHandler CreatingUser;
		/// <summary>
		/// Occurs when an item is added to the cart.
		/// </summary>
		event EventHandler AddedToCart;
		/// <summary>
		/// Occurs just before an item is added to the cart.
		/// </summary>
		event EventHandler AddingToCart;
		/// <summary>
		/// Occurs when a status changes.
		/// </summary>
		event EventHandler StatusChanged;
		/// <summary>
		/// Occurs before a status changes.
		/// </summary>
		event EventHandler StatusChanging;
		/// <summary>
		/// Occurs when an item is created.
		/// </summary>
		event EventHandler CreatingItem;
		/// <summary>
		/// Occurs when an image is rendered.
		/// </summary>
		event EventHandler RenderedItemImage;
		/// <summary>
		/// Occurs when before an image is rendered.
		/// </summary>
		event EventHandler RenderingItemImage;
		/// <summary>
		/// Occurs when an email is created.
		/// </summary>
		event EventHandler CreatingEmail;
		/// <summary>
		/// Occurs when the discount is recalculated.
		/// </summary>
		event EventHandler CalculatingDiscount;
		/// <summary>
		/// Occurs when a credit card is charged.
		/// </summary>
		event EventHandler OpeningPaymentGateway;
		/// <summary>
		/// Occurs when a shipment is updated (addressUpdate table gets new row with 'emailSent is null').
		/// </summary>
		event EventHandler ShipmentUpdated;
		/// <summary>
		/// Occurs when a users starts the JavaScript user interface.
		/// </summary>
		event EventHandler UIInitializing;
        /// <summary>
        /// Occurs when a line item is updated in an order.
        /// </summary>
        event EventHandler LineUpdated;
	}
	public partial class Site : ISiteInterface {
        #region Raise Methods
        /// <summary>
        /// Raises the on line update event.
        /// </summary>
        /// <param name="args">The <see cref="Rendition.LineUpdateEventArgs"/> instance containing the event data.</param>
        internal void raiseOnLineUpdate(LineUpdateEventArgs args) {
            if(LineUpdated != null) { LineUpdated(this, args); };
		}
		/// <summary>
		/// Raises the ondispose event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.DisposeEventArgs"/> instance containing the event data.</param>
		internal void raiseOnDispose( DisposeEventArgs args ) {
			if( Disposing != null ) { Disposing( this, args ); };
		}
		/// <summary>
		/// Raises the onbeginrequest event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.BeginRequestEventArgs"/> instance containing the event data.</param>
		internal void raiseOnBeginRequest( BeginRequestEventArgs args ) {
			if( BeginRequest != null ) { BeginRequest( this, args ); };
		}
        /// <summary>
        /// Raises the onafterauthentication event.
        /// </summary>
        /// <param name="args">The <see cref="Rendition.BeginRequestEventArgs"/> instance containing the event data.</param>
        internal void raiseOnAfterAuthentication(AfterAuthenticationEventArgs args) {
            if(AfterAuthentication != null) { AfterAuthentication(this, args); };
        }
		/// <summary>
		/// Raises the onendrequest event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.EndRequestEventArgs"/> instance containing the event data.</param>
		internal void raiseOnendrequest( EndRequestEventArgs args ) {
			if( EndRequest != null ) { EndRequest( this, args ); };
		}
		/// <summary>
		/// Raises the onrecalculateorder event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.RecalculateOrderEventArgs"/> instance containing the event data.</param>
		internal void raiseOnrecalculateorder( RecalculateOrderEventArgs args ) {
			if( RecalculatedOrder != null ) { RecalculatedOrder( this, args ); };
		}
		/// <summary>
		/// Raises the onrecalculatecart event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.RecalculateCartEventArgs"/> instance containing the event data.</param>
		internal void raiseOnrecalculatecart( RecalculateCartEventArgs args ) {
			if( RecalculatedCart != null ) { RecalculatedCart( this, args ); };
		}
		/// <summary>
		/// Raises the onbeforeplaceorder event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.PlaceOrderEventArgs"/> instance containing the event data.</param>
		internal void raiseOnbeforeplaceorder( PlaceOrderEventArgs args ) {
			if( PlacingOrder != null ) { PlacingOrder( this, args ); };
		}
		/// <summary>
		/// Raises the onplaceorder event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.AfterPlaceOrderEventArgs"/> instance containing the event data.</param>
		internal void raiseOnplaceorder( AfterPlaceOrderEventArgs args ) {
			if( PlacedOrder != null ) { PlacedOrder( this, args ); };
		}
        /// <summary>
        /// Raises the on session refresh.
        /// </summary>
        /// <param name="args">The <see cref="Rendition.LogOnEventArgs"/> instance containing the event data.</param>
        internal void raiseOnRefreshSession(RefreshSessionEventArgs args) {
            if(RefreshSession != null) { RefreshSession(this, args); };
        }
        /// <summary>
		/// Raises the onlogon event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.LogOnEventArgs"/> instance containing the event data.</param>
		internal void raiseOnLogon( LogOnEventArgs args ) {
			if( LoggedOn != null ) { LoggedOn( this, args ); };
		}
		/// <summary>
		/// Raises the onlogoff event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.LogOffEventArgs"/> instance containing the event data.</param>
		internal void raiseOnLogOff( LogOffEventArgs args ) {
			if( LoggedOff != null ) { LoggedOff( this, args ); };
		}
		/// <summary>
		/// Raises the oncreateuser event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.CreateUserEventArgs"/> instance containing the event data.</param>
		internal void raiseOnCreateUser( CreateUserEventArgs args ) {
			if( CreatingUser != null ) { CreatingUser( this, args ); };
		}
		/// <summary>
		/// Raises the onaddtocart event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.AddToCartEventArgs"/> instance containing the event data.</param>
		internal void raiseOnAddToCart( AddToCartEventArgs args ) {
			if( AddedToCart != null ) { AddedToCart( this, args ); };
		}
        /// <summary>
        /// Raises the on before addto cart event.
        /// </summary>
        /// <param name="args">The <see cref="Rendition.BeforeAddToCartEventArgs"/> instance containing the event data.</param>
		internal void raiseOnBeforeAddtoCart( BeforeAddToCartEventArgs args ) {
			if( AddingToCart != null ) { AddingToCart( this, args ); };
		}
		/// <summary>
		/// Raises the onstatuschange event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.StatusChangeEventArgs"/> instance containing the event data.</param>
		internal void raiseOnStatusChange( StatusChangeEventArgs args ) {
			if( StatusChanged != null ) { StatusChanged( this, args ); };
		}
		/// <summary>
		/// Raises the onbeforestatuschange event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.StatusChangeEventArgs"/> instance containing the event data.</param>
		internal void raiseOnBeforeStatusChange( StatusChangeEventArgs args ) {
			if( StatusChanging != null ) { StatusChanging( this, args ); };
		}
		/// <summary>
		/// Raises the oncreateitem event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.CreateItemEventArgs"/> instance containing the event data.</param>
		internal void raiseOnCreateItem( CreateItemEventArgs args ) {
			if( CreatingItem != null ) { CreatingItem( this, args ); };
		}
		/// <summary>
		/// Raises the onrenderitemimage event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.RenderItemImageEventArgs"/> instance containing the event data.</param>
		internal void raiseOnRenderItemImage( RenderItemImageEventArgs args ) {
			if( RenderedItemImage != null ) { RenderedItemImage( this, args ); };
		}
		/// <summary>
		/// Raises the onbeforerenderitemimage event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.RenderItemImageEventArgs"/> instance containing the event data.</param>
		internal void raiseOnBeforerEnderitemimage( RenderItemImageEventArgs args ) {
			if( RenderingItemImage != null ) { RenderingItemImage( this, args ); };
		}
		/// <summary>
		/// Raises the oncreateemail event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.CreateEmailEventArgs"/> instance containing the event data.</param>
		internal void raiseOnCreateEmail( CreateEmailEventArgs args ) {
			if( CreatingEmail != null ) { CreatingEmail( this, args ); };
		}
		/// <summary>
		/// Raises the oncalculatediscount event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.CalculateDiscountEventArgs"/> instance containing the event data.</param>
		internal void raiseOnCalculateDiscount( CalculateDiscountEventArgs args ) {
			if( CalculatingDiscount != null ) { CalculatingDiscount( this, args ); };
		}
		/// <summary>
		/// Raises the onpaymentgateway event.
		/// </summary>
		/// <param name="args">The <see cref="Rendition.PaymentGatewayEventArgs"/> instance containing the event data.</param>
		internal void raiseOnPaymentGateway( PaymentGatewayEventArgs args ) {
			if( OpeningPaymentGateway != null ) { OpeningPaymentGateway( this, args ); };
		}
		/// <summary>
		/// Raises the onshipmentupdate event.
		/// </summary>
		/// <param name="args">The args.</param>
		internal void raiseOnShipmentUpdate( ShipmentUpdateArgs args ) {
			if( ShipmentUpdated != null ) { ShipmentUpdated( this, args ); };
		}
		/// <summary>
		/// Raises the onuiinit event.
		/// </summary>
		/// <param name="args">The <see cref="System.EventArgs"/> instance containing the event data.</param>
		internal void raiseOnUIInit( UIInitArgs args ) {
			if( UIInitializing != null ) { UIInitializing( this, args ); };
		}
        /// <summary>
        /// Raises the oninit event.
        /// </summary>
        /// <param name="args">The <see cref="Rendition.InitEventArgs"/> instance containing the event data.</param>
        internal void raiseOnInit(InitEventArgs args) {
            if(Initializing != null) { Initializing(this, args); };
        }
        /// <summary>
        /// Raises after the site has finished refreshing.
        /// </summary>
        /// <param name="args">The <see cref="Rendition.InitEventArgs"/> instance containing the event data.</param>
        internal void raiseOnAfterRefresh(RefreshEventArgs args) {
            if(AfterRefresh != null) { AfterRefresh(this, args); };
        }
        #endregion
        #region ISiteInterface
        /// <summary>
        /// Occurs just after the user has authenticated.
        /// </summary>
        event EventHandler ISiteInterface.AfterAuthentication {
            add {
                lock(AfterAuthentication) {
                    AfterAuthentication += value;
                }
            }
            remove {
                lock(AfterAuthentication) {
                    AfterAuthentication -= value;
                }
            }
        }
		/// <summary>
		/// Occurs when a shipment is updated (addressUpdate table gets new row with 'emailSent is null').
		/// </summary>
		event EventHandler ISiteInterface.ShipmentUpdated {
			add {
				lock( ShipmentUpdated ) {
					ShipmentUpdated += value;
				}
			}
			remove {
				lock( ShipmentUpdated ) {
					ShipmentUpdated -= value;
				}
			}
		}
		/// <summary>
		/// Occurs when a credit card is charged.
		/// </summary>
		event EventHandler ISiteInterface.OpeningPaymentGateway {
			add {
				lock( OpeningPaymentGateway ) {
					OpeningPaymentGateway += value;
				}
			}
			remove {
				lock( OpeningPaymentGateway ) {
					OpeningPaymentGateway -= value;
				}
			}
		}
		/// <summary>
		/// Occurs when the discount is recalculated.
		/// </summary>
		event EventHandler ISiteInterface.CalculatingDiscount {
			add {
				lock( CalculatingDiscount ) {
					CalculatingDiscount += value;
				}
			}
			remove {
				lock( CalculatingDiscount ) {
					CalculatingDiscount -= value;
				}
			}
		}
		/// <summary>
		/// Occurs when an email is created.
		/// </summary>
		event EventHandler ISiteInterface.CreatingEmail {
			add {
				lock( CreatingEmail ) {
					CreatingEmail += value;
				}
			}
			remove {
				lock( CreatingEmail ) {
					CreatingEmail -= value;
				}
			}
		}
		/// <summary>
		/// Occurs when before an image is rendered.
		/// </summary>
		event EventHandler ISiteInterface.RenderingItemImage {
			add {
				lock( RenderingItemImage ) {
					RenderingItemImage += value;
				}
			}
			remove {
				lock( RenderingItemImage ) {
					RenderingItemImage -= value;
				}
			}
		}
		/// <summary>
		/// Occurs when an image is rendered.
		/// </summary>
		event EventHandler ISiteInterface.RenderedItemImage {
			add {
				lock( RenderedItemImage ) {
					RenderedItemImage += value;
				}
			}
			remove {
				lock( RenderedItemImage ) {
					RenderedItemImage += value;
				}
			}
		}
		/// <summary>
		/// Occurs when an item is created.
		/// </summary>
		event EventHandler ISiteInterface.CreatingItem {
			add {
				lock( CreatingItem ) {
					CreatingItem += value;
				}
			}
			remove {
				lock( CreatingItem ) {
					CreatingItem += value;
				}
			}
		}
		/// <summary>
		/// Occurs when a status changes.
		/// </summary>
		event EventHandler ISiteInterface.StatusChanged {
			add {
				lock( StatusChanged ) {
					StatusChanged += value;
				}
			}
			remove {
				lock( StatusChanged ) {
					StatusChanged += value;
				}
			}
		}
		/// <summary>
		/// Occurs when an order is recalculated.
		/// </summary>
		event EventHandler ISiteInterface.RecalculatedOrder {
			add {
				lock( RecalculatedOrder ) {
					RecalculatedOrder += value;
				}
			}
			remove {
				lock( RecalculatedOrder ) {
					RecalculatedOrder += value;
				}
			}
		}
		/// <summary>
		/// Occurs when a cart/quote is recalculated.
		/// </summary>
		event EventHandler ISiteInterface.RecalculatedCart {
			add {
				lock( RecalculatedCart ) {
					RecalculatedCart += value;
				}
			}
			remove {
				lock( RecalculatedCart ) {
					RecalculatedCart += value;
				}
			}
		}
		/// <summary>
		/// Occurs just before an order is placed.
		/// </summary>
		event EventHandler ISiteInterface.PlacingOrder {
			add {
				lock( PlacingOrder ) {
					PlacingOrder += value;
				}
			}
			remove {
				lock( PlacingOrder ) {
					PlacingOrder += value;
				}
			}
		}
		/// <summary>
		/// Occurs after an order is placed.
		/// </summary>
		event EventHandler ISiteInterface.PlacedOrder {
			add {
				lock( PlacedOrder ) {
					PlacedOrder += value;
				}
			}
			remove {
				lock( PlacedOrder ) {
					PlacedOrder += value;
				}
			}
		}
		/// <summary>
		/// Occurs when a user logs on.
		/// </summary>
		event EventHandler ISiteInterface.LoggedOff {
			add {
				lock( LoggedOn ) {
					LoggedOn += value;
				}
			}
			remove {
				lock( LoggedOn ) {
					LoggedOn += value;
				}
			}
		}
		/// <summary>
		/// Occurs when a user logs off.
		/// </summary>
		event EventHandler ISiteInterface.LoggedOn {
			add {
				lock( LoggedOff ) {
					LoggedOff += value;
				}
			}
			remove {
				lock( LoggedOff ) {
					LoggedOff += value;
				}
			}
		}
		/// <summary>
		/// Occurs when a user is created.
		/// </summary>
		event EventHandler ISiteInterface.CreatingUser {
			add {
				lock( CreatingUser ) {
					CreatingUser += value;
				}
			}
			remove {
				lock( CreatingUser ) {
					CreatingUser += value;
				}
			}
		}
		/// <summary>
		/// Occurs when an item is added to the cart.
		/// </summary>
		event EventHandler ISiteInterface.AddedToCart {
			add {
				lock( AddedToCart ) {
					AddedToCart += value;
				}
			}
			remove {
				lock( AddedToCart ) {
					AddedToCart += value;
				}
			}
		}
		/// <summary>
		/// Occurs just before an item is added to the cart.
		/// </summary>
		event EventHandler ISiteInterface.AddingToCart {
			add {
				lock( AddingToCart ) {
					AddingToCart += value;
				}
			}
			remove {
				lock( AddingToCart ) {
					AddingToCart += value;
				}
			}
		}
		/// <summary>
		/// Occurs when a request ends.
		/// </summary>
		event EventHandler ISiteInterface.EndRequest {
			add {
				lock( EndRequest ) {
					EndRequest += value;
				}
			}
			remove {
				lock( EndRequest ) {
					EndRequest += value;
				}
			}
		}
		/// <summary>
		/// Occurs when a request begins.
		/// </summary>
		event EventHandler ISiteInterface.BeginRequest {
			add {
				if( BeginRequest == null ) {
					BeginRequest += value;
					return;
				}
				lock( BeginRequest ) {
					BeginRequest += value;
				}
			}
			remove {
				lock( BeginRequest ) {
					BeginRequest += value;
				}
			}
		}
		/// <summary>
		/// Occurs when the site is shutting down.
		/// </summary>
		event EventHandler ISiteInterface.Disposing {
			add {
				lock( Disposing ) {
					Disposing += value;
				}
			}
			remove {
				lock( Disposing ) {
					Disposing += value;
				}
			}
		}
		/// <summary>
		/// Occurs when the site starts.
		/// </summary>
		event EventHandler ISiteInterface.Initializing {
			add {
				lock( Initializing ) {
					Initializing += value;
				}
			}
			remove {
				lock( Initializing ) {
					Initializing += value;
				}
			}
		}
		/// <summary>
		/// Occurs when a users starts the JavaScript user interface.
		/// </summary>
		event EventHandler ISiteInterface.UIInitializing {
			add {
				lock( UIInitializing ) {
					UIInitializing += value;
				}
			}
			remove {
				lock( UIInitializing ) {
					UIInitializing += value;
				}
			}
		}
        /// <summary>
        /// Occurs when a line item is updated in an order.
        /// </summary>
        event EventHandler ISiteInterface.LineUpdated {
            add {
                lock(LineUpdated) {
                    LineUpdated += value;
                }
            }
            remove {
                lock(LineUpdated) {
                    LineUpdated += value;
                }
            }
        }
        /// <summary>
        /// Occurs after the site cache refreshes.
        /// </summary>
        event EventHandler ISiteInterface.AfterRefresh {
            add {
                lock(AfterRefresh) {
                    AfterRefresh += value;
                }
            }
            remove {
                lock(AfterRefresh) {
                    AfterRefresh += value;
                }
            }
        }
        #endregion
        #region PreventDefault
        /// <summary>
		/// Prevents the default event from occuring.
		/// </summary>
		public static void PreventDefault() {
			AbortDefaultEvent = true;
		}
        /// <summary>
        /// When set true, default events will not occur in the current event handler.
        /// </summary>
        public static bool AbortDefaultEvent = false;
        #endregion
        #region Event Definitions
        /// <summary>
        /// Occurs after the site cache refreshes.
        /// </summary>
        public event EventHandler AfterRefresh;
        /// <summary>
        /// Occurs just after the user authenticates.
        /// </summary>
        public event EventHandler AfterAuthentication;
		/// <summary>
		/// Occurs when a users starts the JavaScript user interface.
		/// </summary>
		public event EventHandler UIInitializing;
		/// <summary>
		/// Occurs when a shipment is updated (addressUpdate table gets new row with 'emailSent is null').
		/// </summary>
		public event EventHandler ShipmentUpdated;
		/// <summary>
		/// Occurs when a credit card is charged.
		/// </summary>
		public event EventHandler OpeningPaymentGateway;
		/// <summary>
		/// Occurs when the discount is recalculated.
		/// </summary>
		public event EventHandler CalculatingDiscount;
		/// <summary>
		/// Occurs when an email is created.
		/// </summary>
		public event EventHandler CreatingEmail;
		/// <summary>
		/// Occurs when a status changes.
		/// </summary>
		public event EventHandler StatusChanged;
		/// <summary>
		/// Occurs before a status changes.
		/// </summary>
		public event EventHandler StatusChanging;
		/// <summary>
		/// Occurs when an item is created.
		/// </summary>
		public event EventHandler CreatingItem;
		/// <summary>
		/// Occurs when an image is rendered.
		/// </summary>
		public event EventHandler RenderedItemImage;
		/// <summary>
		/// Occurs when before an image is rendered.
		/// </summary>
		public event EventHandler RenderingItemImage;
		/// <summary>
		/// Occurs when the site starts.
		/// </summary>
		public event EventHandler Initializing;
		/// <summary>
		/// Occurs when the site is shutting down.
		/// </summary>
		public event EventHandler Disposing;
		/// <summary>
		/// Occurs when a request begins.
		/// </summary>
		public event EventHandler BeginRequest;
		/// <summary>
		/// Occurs when a request ends.
		/// </summary>
		public event EventHandler EndRequest;
		/// <summary>
		/// Occurs when an order is recalculated.
		/// </summary>
		public event EventHandler RecalculatedOrder;
		/// <summary>
		/// Occurs when a cart/quote is recalculated.
		/// </summary>
		public event EventHandler RecalculatedCart;
		/// <summary>
		/// Occurs just before an order is placed.
		/// </summary>
		public event EventHandler PlacingOrder;
		/// <summary>
		/// Occurs after an order is placed.
		/// </summary>
		public event EventHandler PlacedOrder;
		/// <summary>
		/// Occurs when a user logs on.
		/// </summary>
		public event EventHandler LoggedOn;
		/// <summary>
		/// Occurs when a user logs off.
		/// </summary>
		public event EventHandler LoggedOff;
		/// <summary>
		/// Occurs when a user is created.
		/// </summary>
		public event EventHandler CreatingUser;
		/// <summary>
		/// Occurs when an item is added to the cart.
		/// </summary>
		public event EventHandler AddedToCart;
		/// <summary>
		/// Occurs just before an item is added to the cart.
		/// </summary>
		public event EventHandler AddingToCart;
        /// <summary>
        /// Occurs when a line item is updated in an order.
        /// </summary>
        public event EventHandler LineUpdated;
        /// <summary>
        /// Occurs when a session is refreshed.
        /// </summary>
        public event EventHandler RefreshSession;
        #endregion
    }
}