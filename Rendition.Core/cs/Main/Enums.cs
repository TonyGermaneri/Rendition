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
using System.Web;
namespace Rendition {
    #region Enums
    /// <summary>
    /// What type of plugins are acceptable in this system.
    /// </summary>
    public enum RedirectorTypes : int {
        /// <summary>
        /// A filter that is used on output from Response.Write.
        /// </summary>
        ResponseFilter,
        /// <summary>
        /// Rewrite filter for URLs. This redirects the page the user sees
        /// without changing the URL in their Address bar.
        /// </summary>
        Rewriter,
        /// <summary>
        /// A redirector redirects users to a new page,
        /// changing the URL in their Address bar.
        /// </summary>
        Redirector,
        /// <summary>
        /// An error directive replaces the standard error page with
        /// a custom one based on the status match (404, 500 etc.)
        /// </summary>
        Error
    }
    /// <summary>
    /// Item image types.  For example, list, cart, detail, thumbnail, full size etc.
    /// </summary>
    public enum ImageType {
        /// <summary>
        /// No image accessor selected.
        /// </summary>
        None = 0,
        /// <summary>
        /// Listing.
        /// </summary>
        Listing = 1,
        /// <summary>
        /// Cart.
        /// </summary>
        Cart = 2,
        /// <summary>
        /// Full Size.
        /// </summary>
        FullSize = 3,
        /// <summary>
        /// Checkout.
        /// </summary>
        Checkout = 4,
        /// <summary>
        /// Packing Slip.
        /// </summary>
        PackingSlip = 5,
        /// <summary>
        /// Invoice.
        /// </summary>
        Invoice = 6,
        /// <summary>
        /// Listing 2.
        /// </summary>
        Listing2 = 7,
        /// <summary>
        /// Listing 3.
        /// </summary>
        Listing3 = 8,
        /// <summary>
        /// Administrative tools
        /// </summary>
        Admin = 9,
        /// <summary>
        /// Detail.
        /// </summary>
        Detail = 10,
        /// <summary>
        /// Original.
        /// </summary>
        Original = 11
    }
    /// <summary>
    /// The state of the site.
    /// </summary>
    public enum SiteState {
        /// <summary>
        /// The site has not yet started.
        /// </summary>
        NotYetStarted = 0,
        /// <summary>
        /// Can't logon to SQL database.
        /// </summary>
        CannotLogonToDataBase = -1,
        /// <summary>
        /// Begining startup.
        /// </summary>
        BeginingStartup = -2,
        /// <summary>
        /// Shutting down.
        /// </summary>
        ShuttingDown = -3,
        /// <summary>
        /// Started.
        /// </summary>
        Started = 1,
        /// <summary>
        /// Refreshing.
        /// </summary>
        Refreshing = -4,
        /// <summary>
        /// Can't Start.
        /// </summary>
        CannotStart = -5
    }
    /// <summary>
    /// File System access mode
    /// </summary>
    public enum FileSystemAccess {
        /// <summary>
        /// Site only access
        /// </summary>
        Site = 0,
        /// <summary>
        /// System wide access
        /// </summary>
        System = 1
    }
    #endregion
}
