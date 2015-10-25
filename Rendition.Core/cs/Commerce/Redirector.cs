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
using System.Data;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
namespace Rendition {
    public partial class Commerce {
        /// <summary>
        /// A list of URL redrectors/rewriters.
        /// </summary>
        internal class Redirectors {
            #region Instance Fields
            /// <summary>
            /// A list of URL redrectors/rewriters.
            /// </summary>
            public List<Redirector> List = new List<Redirector>();
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Redirectors"/> class.
            /// </summary>
            /// <param name="site">The site.</param>
            public Redirectors(Site site) {
                using(SqlConnection cn = Site.CreateConnection(true, true)) {
                    cn.Open();
                    SqlCommand cmd = new SqlCommand(@"select redirectorId, urlMatchPattern, urlToRedirectToMatch, errorMatch,
	case when [contentType] is null then '' else [contentType] end,
	case when [type] is null then '' else [type] end,
	case when [listOrder] is null then 0 else [listOrder] end,
	case when [enabled] is null then cast(0 as bit) else [enabled] end
	from redirector with (nolock)", cn);
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        while(r.Read()) {
                            Redirector d = new Redirector(r.GetGuid(0), r.GetString(1),
                            r.GetString(2), r.GetString(3), r.GetString(4), r.GetString(5),
                            r.GetInt32(6), r.GetBoolean(7));
                            List.Add(d);
                        }
                    }
                    /* order the list */
                    List.Sort(delegate(Redirector rdr1, Redirector rdr2) {
                        return rdr2.Order.CompareTo(rdr1.Order);
                    });
                }
            }
            #endregion
        }
        /// <summary>
        /// A directive for redirecting/rewriting URLs
        /// </summary>
        public class Redirector {
            #region Static Properties
            /// <summary>
            /// Gets all redirectors.
            /// </summary>
            public static List<Redirector> All {
                get {
                    return Main.Site.Redirectors.List;
                }
            }
            #endregion
            #region Instance Properties
            /// <summary>
            /// Id of this redirector.
            /// </summary>
            public Guid Id { get; internal set; }
            /// <summary>
            /// Pattern to match in the URL.
            /// </summary>
            public string UrlMatchPattern { get; internal set; }
            /// <summary>
            /// URL to redirect to based on the urlMatchPattern.
            /// </summary>
            public string UrlToRedirectTo { get; internal set; }
            /// <summary>
            /// status number to match for this redirector to work. (e.g.: 404 or 200)
            /// </summary>
            public string ErrorMatch { get; internal set; }
            /// <summary>
            /// The order in which this directive is loaded
            /// </summary>
            public int Order { get; internal set; }
            /// <summary>
            /// When true this directive is processed.
            /// </summary>
            public bool Enabled { get; internal set; }
            /// <summary>
            /// Can be one of: 
            /// "Response Filter",
            /// "Rewriter"
            /// "Redirector" in the database.
            /// When used directly the type is enum main.redirectorTypes
            /// (some redirector types must be accompanied 
            /// by an error match code value in the errorMatch column,
            /// for example 200, 404, 302 etc.) 
            /// </summary>
            public RedirectorTypes RedirectorType { get; internal set; }
            /// <summary>
            /// The type of content this directive applies to.  This usues regular expressions.
            /// </summary>
            public string ContentType { get; internal set; }
            /// <summary>
            /// The Regex object used to do string matching.
            /// </summary>
            public Regex RegEx { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Redirector"/> class.
            /// </summary>
            /// <param name="_id">The _id.</param>
            /// <param name="_urlMatchPattern">The _url match pattern.</param>
            /// <param name="_urlToRedirectTo">The _url to redirect to.</param>
            /// <param name="_errorMatch">The _error match.</param>
            /// <param name="_contentType">Type of the _content.</param>
            /// <param name="_redirectorType">Type of the _redirector.</param>
            /// <param name="_order">The _order.</param>
            /// <param name="_enabled">if set to <c>true</c> [_enabled].</param>
            public Redirector(Guid _id, string _urlMatchPattern, string _urlToRedirectTo, string _errorMatch,
                string _contentType, string _redirectorType, int _order, bool _enabled) {
                Id = _id;
                UrlMatchPattern = _urlMatchPattern;
                UrlToRedirectTo = _urlToRedirectTo;
                ErrorMatch = _errorMatch;
                ContentType = _contentType;
                switch(_redirectorType) {
                    case "Redirector":
                        RedirectorType = RedirectorTypes.Redirector;
                        break;
                    case "Response Filter":
                        RedirectorType = RedirectorTypes.ResponseFilter;
                        break;
                    case "Error":
                        RedirectorType = RedirectorTypes.Error;
                        break;
                    default:
                        RedirectorType = RedirectorTypes.Rewriter;
                        break;
                }
                Order = _order;
                Enabled = _enabled;
                try {
                    RegEx = new Regex(UrlMatchPattern,
                    RegexOptions.Compiled | RegexOptions.ECMAScript | RegexOptions.Multiline);
                } catch(Exception e) {
                    String.Format("An exception creating the redirector pattern {0}. Id:{1}. Message: {2}.",
                    UrlMatchPattern, Id, e.Message);
                }
            }
            #endregion
        }
    }
}
