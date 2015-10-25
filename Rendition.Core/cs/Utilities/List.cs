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
using System.Text.RegularExpressions;
namespace Rendition {
    /// <summary>
    /// Options used for creating the listing page.
    /// You don't have to use this class or list to
    /// create item lists.  They are just a utility
    /// to help lessen the amount of tedious tasks
    /// you may encounter when setting up your web
    /// site.
    /// </summary>
    public class ListOptions {
        /// <summary>
        /// the request key for records per page.
        /// </summary>
        public string RequestRecordsPerPage = "rpp";
        /// <summary>
        /// The order by mode request key.
        /// </summary>
        public string RequestOrderBy = "orderBy";
        /// <summary>
        /// The listing mode request key.
        /// </summary>
        public string RequestListMode = "listMode";
        /// <summary>
        /// The request key for the category name.
        /// </summary>
        public string RequestCategory = "category";
        /// <summary>
        /// The request key for the filter.
        /// </summary>
        public string RequestFilter = "filter";
        /// <summary>
        /// The request key search
        /// </summary>
        public string RequestSearch = "search";
        /// <summary>
        /// The request key for the page selector.
        /// </summary>
        public string RequestPage = "page";
        /// <summary>
        /// The request key for the price filter.
        /// </summary>
        public string RequestPrice = "Price";
        /// <summary>
        /// The URL to direct to when no items are present in the list.
        /// </summary>
        public string NoItemsFoundRedirect = "/default.aspx?noitems=1";
        /// <summary>
        /// The script name to use in the links.
        /// </summary>
        public string ScriptName = "list.aspx";
        /// <summary>
        /// The text to appear for "Featured Items".
        /// </summary>
        public string OrderMessageFeaturedItem = "Featured Items";
        /// <summary>
        /// The text to appear for "Order By Price Low to High".
        /// </summary>
        public string OrderMessagePriceLowToHigh = "Order By Price Low to High";
        /// <summary>
        /// The text to appear for "Order By Price High to Low".
        /// </summary>
        public string OrderMessagePriceHighToLow = "Order By Price High to Low";
        /// <summary>
        /// The text to appear for "Order By Description A-Z".
        /// </summary>
        public string OrderMessageShortDescAtoZ = "Order By Description A-Z";
        /// <summary>
        /// The text to appear for "Order By Description Z-A".
        /// </summary>
        public string OrderMessageShortDescZtoA = "Order By Description Z-A";
        /// <summary>
        /// The string to find in the category name
        /// in order to make the URL more human readable.
        /// </summary>
        public string CategoryNameRegEx = "-";
        /// <summary>
        /// The string to replace with in the category name
        /// in order to make the URL more human readable.
        /// </summary>
        public string CategoryNameRegExReplace = " ";
        /// <summary>
        /// String to place in the price filter
        /// {0} = low, {1} = high, {2} = count.
        /// </summary>
        public string PriceFilterFormat = "{0} to {1} <span>({2})</span>";
        /// <summary>
        /// String to place in the
        /// first, lowest price filter
        /// {0} = low, {1} = high, {2} = count.
        /// </summary>
        public string PriceFilterLowestFormat = "Under {1} ({2})";
        /// <summary>
        /// String to place in the
        /// last, highest price filter
        /// {0} = low, {1} = high, {2} = count.
        /// </summary>
        public string PriceFilterHighestFormat = "Over {0} ({2})";
        /// <summary>
        /// The string to place in the
        /// 'filter for' link text.
        /// {0} will be replaced by the value.
        /// </summary>
        public string PropertyFilterFormat = "{0} &nbsp;<span>({1})</span>";
        /// <summary>
        /// The string to place in the
        /// 'filter for' link title.
        /// {0} will be replaced by the value.
        /// </summary>
        public string PropertyFilterFormatTitle = "Filter For {0}";
        /// <summary>
        /// The string to place in the
        /// 'remove filter' link.
        /// {0} will be replaced by the value.
        /// </summary>
        public string PropertyFilterValueRemoveFormat = "{0}";
        /// <summary>
        /// The string to place in the
        /// 'remove filter' link text.
        /// {0} will be replaced by
        /// the value.
        /// </summary>
        public string PropertyFilterRemoveFormat = "{0}";
        /// <summary>
        /// The string to place in the
        /// 'remove filter' link title.
        /// {0} will be replaced by
        /// the value.
        /// </summary>
        public string PropertyFilterRemoveTitle = "Remove Filter for {0}";
        /// <summary>
        /// The string to place in the
        /// 'remove price filter' link.
        /// </summary>
        public string PropertyFilterRemovePrice = "Remove Price Filter";
        /// <summary>
        /// The range of prices 
        /// that will appear in 
        /// the price filter.
        /// </summary>
        public List<decimal> PriceRanges = new List<decimal>(new decimal[] { 0m, 10.00m, 25.00m, 50.00m, 75.00m,
		100.00m, 150.00m, 200.00m, 500.00m, 700.00m, 1000.00m, 1500.00m, 2000.00m, 5000.00m });
    }
    /// <summary>
    /// Utility for creating item lists in HTML pages.
    /// Creates a list object based on HttpContext Request variables.  
    /// Used to create item lists from categories and searches.
    /// Provides items, category data, search data, filters,
    /// price filters and other utilities. 
    /// You don't have to use this class or list to
    /// create item lists.  It is just a utility
    /// to help lessen the amount of tedious tasks
    /// you may encounter when setting up your web
    /// site.
    /// </summary>
    public class List {
        private string _rfltTable = "";
        private StringBuilder rfltBuilder = new StringBuilder();
        private string _fltTable = "";
        private StringBuilder fltBuilder = new StringBuilder();
        private string _pfltTable = "";
        private StringBuilder pfltBuilder = new StringBuilder();
        private Commerce.Menu _menu = null;
        private Commerce.SiteSection _section = null;
        private Commerce.SeoListMetaUtility _meta = null;
        /// <summary>
        /// The menu this list will display.
        /// When no entry is found the entry
        /// named Default will be used.
        /// </summary>
        public Commerce.Menu Menu {
            get {
                if(_menu == null) {
                    _menu = Main.Site.Menus.GetMenuById(Category.Id);
                    if(_menu == null) {
                        _menu = Main.Site.Menus.GetMenuByName("Default");
                    }
                    if(_menu == null) {
                        return new Commerce.Menu(Guid.Empty,Guid.Empty,"","",false,0,0,0,0,"",0,"");
                    }
                }
                return _menu;
            }
        }
        /// <summary>
        /// The site section of this list.
        /// When no section is found matching
        /// this list the section named Default
        /// will be used.
        /// </summary>
        public Commerce.SiteSection Section {
            get {
                if(_section == null) {
                    if(Category != null) {
                        _section = Main.Site.SiteSections.GetSectionById(Category.Id);
                    }
                    if(_section == null) {
                        _section = Main.Site.SiteSections.GetSectionByName("Deafult");
                    }
                    if(_section == null) {
                        return new Commerce.SiteSection(Guid.Empty,"","","");
                    }
                } 
                return _section;
            }
        }
        /// <summary>
        /// The meta title, descriptions and keywords.
        /// When no meta entry is found the entry
        /// named Default will be used.
        /// </summary>
        public Commerce.SeoListMetaUtility Meta {
            get {
                if(_meta == null) {
                    if(Category != null) {
                        _meta = Main.Site.SeoListMetaUtilities.GetSEOListMetaUtilityById(Category.Id);
                        if(_meta == null) {
                            _meta = Main.Site.SeoListMetaUtilities.GetSEOListMetaUtilityByName("Default");
                        }
                    } else {
                        return new Commerce.SeoListMetaUtility(Guid.Empty, 0, "", "", "", "");
                    }
                }
                return _meta;
            }
        }
        /// <summary>
        /// The category loaded.
        /// </summary>
        public Commerce.Category Category { get; internal set; }
        /// <summary>
        /// The options in use for this listing.
        /// </summary>
        public ListOptions Options { get; set; }
        /// <summary>
        /// List of price range filters
        /// </summary>
        public List<decimal> PriceRanges { get; set; }
        /// <summary>
        /// A list of price filters for this list.
        /// </summary>
        /// <value>The filter table.</value>
        public string PriceFilterTable {
            get {
                if(_pfltTable.Length == 0) {
                    _pfltTable = pfltBuilder.ToString();
                }
                return _pfltTable;
            }
        }
        /// <summary>
        /// Gets the remove filter table.
        /// </summary>
        /// <value>The remove filter table.</value>
        public string RemoveFilterTable {
            get {
                if(_fltTable.Length == 0) {
                    _rfltTable = rfltBuilder.ToString();
                }
                return _rfltTable;
            }
        }
        /// <summary>
        /// List of price filters in this list.
        /// </summary>
        public List<string> PriceFilterLinks = new List<string>();
        /// <summary>
        /// List of selected filters in this list.
        /// </summary>
        public List<string> RemoveFilterLinks = new List<string>();
        /// <summary>
        /// List of filters avalible in this list.
        /// </summary>
        public List<string> FilterLinks = new List<string>();
        /// <summary>
        /// When true, this list has price filters that can filter items in the list.
        /// </summary>
        public bool HasPriceFilters = false;
        /// <summary>
        /// When true, this list has filters that have been selected.
        /// </summary>
        public bool HasRemoveFilters = false;
        /// <summary>
        /// When true, this list has filters that can filter items in the list.
        /// </summary>
        public bool HasFilters = false;
        /// <summary>
        /// A list of filters for this list in a table with the class filtertable.
        /// </summary>
        /// <value>The filter table.</value>
        public string FilterTable {
            get {
                if(_fltTable.Length == 0) {
                    _fltTable = fltBuilder.ToString();
                }
                return _fltTable;
            }
        }
        /// <summary>
        /// The category selected  (e.g.: Missile parts)
        /// </summary>
        public string CategoryName = "";
        /// <summary>
        /// Name of listing selected (search or category )
        /// </summary>
        public string ListType = "";
        /// <summary>
        /// The value of the listing critera (e.g.: category name or search terms)
        /// </summary>
        public string ListTypeValue = "";
        /// <summary>
        /// Name of the order by method
        /// </summary>
        public string OrderByName = "";
        /// <summary>
        /// Page currently on.
        /// </summary>
        public int Page = 0;
        /// <summary>
        /// The next page
        /// </summary>
        public int NextPage;
        /// <summary>
        /// The previous page
        /// </summary>
        public int PrevPage;
        /// <summary>
        /// Rage of items to
        /// </summary>
        public int To;
        /// <summary>
        /// Range of items from
        /// </summary>
        public int From;
        /// <summary>
        /// Total pages in this category
        /// </summary>
        public int TotalPages;
        /// <summary>
        /// Filter string in this list
        /// </summary>
        public string Filter;
        /// <summary>
        /// list of items in this category
        /// </summary>
        public List<Commerce.Item> ItemList;
        /// <summary>
        /// List of Properties in this category
        /// </summary>
        public List<Commerce.Property> Properties;
        /// <summary>
        /// The string being searched for if any.
        /// </summary>
        public string Search = "";
        /// <summary>
        /// Key name used to store list object in the HttpContext.Items list.
        /// </summary>
        static string super_secret_key_name = "____list";
        /// <summary>
        /// Gets the review stars.
        /// </summary>
        /// <param name="i">The i.</param>
        /// <param name="displayMode">0: display just the stars, 1: Display with the text description.</param>
        /// <returns></returns>
        public static string GetReviewStars(Commerce.Item i, int displayMode) {
            StringBuilder b = new StringBuilder();
            double avgRating = 0;
            if(i.Reviews.Count > 0) {
                for(int j = 0; i.Reviews.Count > j; j++) {
                    /* it's important to add 1 to the zero based
                        * review system or we'll end up with a
                        * devide by zero error.  Or Even better!
                        * for some reason C# will produce an
                        * Infinity so the error will be really
                        * difficult to track down. 
                        */
                    avgRating += (i.Reviews[j].Rating + 1);
                }
                avgRating = Math.Round(avgRating / i.Reviews.Count, 3);
            }
            double star = Math.Round(avgRating * (1 / 0.25), 0) / (1 / 0.25);
            string startSuffx = "";
            if(star > 0 && star.ToString("#####.##").Contains(".")) {
                startSuffx = "0." + star.ToString("#####.##").Split('.')[1];
            }
            for(int j = 0; Math.Floor(avgRating) > j; j++) {
                b.Append("<img src=\"/img/star.png\" title=\"" + avgRating.ToString() + " of 5 Stars\" " +
                " alt=\"" + avgRating.ToString() + " of 5 Stars\">");
            }
            if(startSuffx.Length > 0) {
                b.Append("<img src=\"/img/star" + startSuffx + ".png\" title=\"" + avgRating.ToString() + " of 5 Stars\" " +
                " alt=\"" + avgRating + "\" of 5 Stars\">");
            }
            if(displayMode != 0 && i.Reviews.Count > 0) {
                b.Append("<span>" + avgRating.ToString() + " of 5 (" + i.Reviews.Count.ToString() + ")</span>");
            }
            return b.ToString();
        }
        /// <summary>
        /// Refreshes the price filters based on the list of items fed to it
        /// used in the list class to create and then filter lists of items.
        /// </summary>
        /// <param name="item_list">The item_list.</param>
        /// <param name="priceRanges">The price ranges.</param>
        /// <returns></returns>
        private static List<Dictionary<string, object>> GetPriceFilters(List<Commerce.Item> item_list,
        List<decimal> priceRanges) {
            List<Dictionary<string, object>> priceFilters = new List<Dictionary<string, object>>();
            int ptotal = priceRanges.Count;
            priceRanges.Sort(delegate(decimal p1, decimal p2) {
                return p1.CompareTo(p2);
            });
            for(int x = 0; ptotal > x; x++) {
                /* figure out the range */
                decimal low = 0;
                decimal high = 0;
                bool highest = false;
                if(x == 0) {
                    low = 0;
                    high = priceRanges[x];
                } else if(x == ptotal - 1) {
                    low = priceRanges[x];
                    high = decimal.MaxValue;
                    highest = true;
                } else {
                    low = priceRanges[x];
                    high = priceRanges[x + 1];
                }
                List<Commerce.Item> currentPriceList = item_list.FindAll(delegate(Commerce.Item itm) {
                    /* figure out the effective price */
                    decimal ePrice = itm.GetEffectivePrice();
                    return ePrice > low && ePrice < high;
                });
                Dictionary<string, object> l = new Dictionary<string, object>();
                /* find the highest value item */
                decimal maxValue = 0;
                foreach(Commerce.Item _i in currentPriceList) {
                    decimal p = _i.GetEffectivePrice();
                    maxValue = p > maxValue ? p : maxValue;
                }
                l.Add("id", priceRanges[x]);
                l.Add("low", low);
                l.Add("high", highest ? maxValue : high);
                l.Add("list", currentPriceList);
                l.Add("count", currentPriceList.Count);
                priceFilters.Add(l);
            }
            return priceFilters;
        }
        /// <summary>
        /// Stores the current list for lookup in the List.CurrentList Object.
        /// The List.CurrentList object is automatically populated with the default list.
        /// </summary>
        /// <param name="l">The list to store.</param>
        public static void StoreCurrentList(List l) {
            if(HttpContext.Current.Items.Contains(super_secret_key_name)) {
                HttpContext.Current.Items[super_secret_key_name]  = l;
            } else {
                HttpContext.Current.Items.Add(super_secret_key_name, l);
            }
        }
        /// <summary>
        /// Gets the current list stored for this HttpContext or 
        /// creates a list with default options if one is not yet stored.
        /// </summary>
        public static List CurrentList {
            get {
                
                if(HttpContext.Current.Items.Contains(super_secret_key_name)) {
                    return (List)HttpContext.Current.Items[super_secret_key_name];
                } else {
                    List l = new List();
                    HttpContext.Current.Items.Add(super_secret_key_name, l);
                    return l;
                }
            }
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="List"/> class using default query string and script names.
        /// </summary>
        public List() {
            InitList(null);
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="List"/> class.
        /// </summary>
        /// <param name="search">The search.</param>
        /// <param name="filter">The filter option.  Pipe seperated inclusive value filter.</param>
        /// <param name="l">The list options.</param>
        public List(string search, string filter, ListOptions l) {
            InitListWithValues(l, null, null, null, filter, null, null, null, search);
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="List"/> class.
        /// </summary>
        /// <param name="search">The search.</param>
        /// <param name="l">The list options.</param>
        public List(string search, ListOptions l) {
            InitListWithValues(l, null, null, null, null, null, null, null, search);
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="List"/> class.
        /// </summary>
        /// <param name="categoryName">Name of the category.</param>
        public List(string categoryName) {
            ListOptions l = new ListOptions();
            InitListWithValues(l, categoryName, null, null, null, null, null, null, null);
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="List"/> class.
        /// </summary>
        /// <param name="request_key_category">The request key name for category.</param>
        /// <param name="request_key_records_per_page">The request key name for records_per_page.</param>
        /// <param name="request_key_orderBy">The request key name for order by.</param>
        /// <param name="request_key_filter">The request key name for filter.</param>
        /// <param name="request_key_ListMode">The request key name for  list mode.</param>
        /// <param name="request_key_page">The request key name for page.</param>
        /// <param name="request_key_price">The request key name for price.</param>
        /// <param name="request_key_search">The request key name for search.</param>
        /// <param name="script_name">The script name to appear in links generated by this listing.</param>
        public List(string request_key_category, string request_key_records_per_page,
            string request_key_orderBy, string request_key_filter, string request_key_ListMode,
            string request_key_page, string request_key_price, string request_key_search,
            string script_name) {
            ListOptions l = new ListOptions();
            l.RequestCategory = request_key_category;
            l.RequestRecordsPerPage = request_key_records_per_page;
            l.RequestOrderBy = request_key_orderBy;
            l.RequestFilter = request_key_filter;
            l.RequestListMode = request_key_ListMode;
            l.RequestPage = request_key_page;
            l.RequestPrice = request_key_price;
            l.RequestSearch = request_key_search;
            l.ScriptName = script_name;
            InitList(l);
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="List"/> class.
        /// </summary>
        /// <param name="options">The options.</param>
        public List(ListOptions options) {
            InitList(options);
        }
        private void InitList(ListOptions _options){
            HttpRequest r = HttpContext.Current.Request;
            if(_options != null) {
                Options = _options;
            }
            if(Options == null) {
                Options = new ListOptions();
            }
            string category = r[Options.RequestCategory];
            string recordsPerPage = r[Options.RequestRecordsPerPage];
            string orderBy = r[Options.RequestOrderBy];
            string filter = r[Options.RequestFilter];
            string listMode = r[Options.RequestListMode];
            string page = r[Options.RequestPage];
            string price = r[Options.RequestPrice];
            string search = r[Options.RequestSearch];
            InitListWithValues(Options, category, recordsPerPage, orderBy,
                filter, listMode, page, price, search);
        }
        /// <summary>
        /// List initalizer - after the request vars have been fetched via InitList.
        /// </summary>
        /// <param name="_options">The options.</param>
        /// <param name="_category">The category.</param>
        /// <param name="_recordsPerPage">The records per page.</param>
        /// <param name="_orderBy">The order by.</param>
        /// <param name="_filter">The filter.</param>
        /// <param name="_listMode">The list mode.</param>
        /// <param name="_page">The page.</param>
        /// <param name="_price">The price.</param>
        /// <param name="_search">The search.</param>
        private void InitListWithValues(ListOptions _options, string _category, string _recordsPerPage, string _orderBy,
            string _filter, string _listMode, string _page, string _price, string _search) {
            /* check if the caller
                * has any new options */
            if(_options != null) {
                Options = _options;
                PriceRanges = _options.PriceRanges;
            } else {
                PriceRanges = Options.PriceRanges;
            }
            /* get the context and session
                * then update any listing
                * vars the user may be sending */
            Session session = Main.GetCurrentSession();
            if(_recordsPerPage != null) {
                Rendition.Merchant.UpdateRecordsPerPage(Convert.ToInt32(_recordsPerPage));
            }
            if(_orderBy != null) {
                Rendition.Merchant.UpdateOrderBy(Convert.ToInt32(_orderBy));
            }
            if(_listMode != null) {
                Rendition.Merchant.UpdateListMode(Convert.ToInt32(_listMode));
            }
            /* if a category list was selected 
                run the options.category_nameRegexReplace 
                on it to replace characters in the category
                name to make their URLS more friendly. */
            if(_category != null) {
                if(Options.CategoryNameRegEx.Length > 0) {
                    CategoryName = Regex.Replace(_category,
                        Options.CategoryNameRegEx, Options.CategoryNameRegExReplace);
                }
                ListType = Options.RequestCategory;
            } else {
                CategoryName = "";
            };

            if(_search != null) {
                Search = _search;
                ListType = Options.RequestSearch;
            } else {
                Search = "";
            };
            if(CategoryName == "" && Search == "") {
                return;
            }
            if(_page != null) {
                Options.RequestPage = _page;
            } else {
                Options.RequestPage = "1";
            };
            ItemList = new List<Commerce.Item>();
            if(_search == null) {
                /* list a category */
                ListTypeValue = CategoryName.UrlEncode();
                Category = Main.Site.Categories.GetCategoryByName(CategoryName);
                if(Category == null) {
                    /* category does not exist - redirect if there's a page to redirect to */
                    if(HttpContext.Current != null && Options.NoItemsFoundRedirect.Length > 0) {
                        HttpContext.Current.Response.Redirect(Options.NoItemsFoundRedirect);
                    }
                    NullReferenceException ex = new NullReferenceException("Category is not found.");
                    throw ex;
                } else {
                    /* remove items that are set
                    * hidden from listings */
                    ItemList.AddRange(Category.Items.FindAll(delegate(Rendition.Commerce.Item item) {
                        return !item.BOMOnly;
                    }));
                }
            } else {
                /* list a search */
                char[] splitBy = { ' ' };
                string[] searchSplit = Search.Split(splitBy);
                ListTypeValue = Search.UrlEncode();
                Category = new Commerce.Category(ListTypeValue, Guid.Empty, true);
                /* generate a menu
                 * first try a keyword */
                foreach(string sh in searchSplit) {
                    _menu = Main.Site.Menus.GetMenuByName("search:" + sh);
                    if(_menu != null) {
                        break;
                    }
                }
                /* if not use the 'search' menu */
                if(_menu == null) {
                    _menu = Main.Site.Menus.GetMenuByName("Search");
                }
                /* finally use the 'default' menu */
                if(_menu == null) {
                    _menu = Main.Site.Menus.GetMenuByName("Default");
                }
                foreach(Commerce.Item it in Main.Site.Items.List) {
                    foreach(string sh in searchSplit) {
                        /* prevents nulls from mucking everything up */
                        if(sh == null) { continue; }
                        if(it == null) { continue; }
                        string sa = sh.Trim().ToLower();
                        if(sa.Length > 0) {
                            if(
                                /* search critera */
                                (
                                it.ShortDescription.ToLower().Contains(sa) ||
                                it.Description.ToLower().Contains(sa) ||
                                it.Html.ToLower().Contains(sa) ||
                                it.ItemNumber.ToLower().Contains(sa) ||
                                it.Keywords.ToLower().Contains(sa) ||
                                it.ProductCopy.ToLower().Contains(sa) ||
                                it.HomeCategory.Name.ToLower().Contains(sa) ||
                                it.AltCategory.Name.ToLower().Contains(sa)
                                ) && it.BOMOnly == false /* don't show hidden items */
                            ) {
                                if(!ItemList.Contains(it)) {
                                    ItemList.Add(it);
                                }
                            }
                        }
                    }
                }
                if(ItemList.Count == 0) {
                    string q = Options.NoItemsFoundRedirect.Contains("?") ? "&" : "?";
                    HttpContext.Current.Response.Redirect(Options.NoItemsFoundRedirect + q + "ref=" +
                    _search.UrlEncode());
                }
            }
            /* get an inital list of price filters */
            List<Dictionary<string, object>> priceFilters = GetPriceFilters(ItemList, PriceRanges);
            Filter = "";
            if(_filter != null) {
                Filter = _filter;
            }
            /* apply property and price filters */
            if(Filter.Length > 0) {
                char[] delimiters = new char[] { '_' };
                string[] filters = Filter.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
                for(var x = 0; filters.Length > x; x++) {
                    char[] delimiters2 = new char[] { '|' };
                    string[] hashrow = filters[x].Split(delimiters2, StringSplitOptions.RemoveEmptyEntries);
                    /* apply price filters */
                    if(hashrow[0] == Options.RequestPrice) {
                        Dictionary<string, object> sfilter = priceFilters.Find(delegate(Dictionary<string, object> flt) {
                            return flt["id"].ToString() == hashrow[1];
                        });
                        if(sfilter != null) {
                            List<Commerce.Item> lst = (List<Commerce.Item>)sfilter["list"];
                            if(lst != null) {
                                if(lst.Count > 0) {
                                    ItemList = ItemList.FindAll(delegate(Rendition.Commerce.Item item1) {
                                        return lst.Find(delegate(Rendition.Commerce.Item item2) {
                                            return item1 == item2;
                                        }) != null;
                                    });
                                }
                            }
                        }
                    } else {
                        /* apply property filters */
                        ItemList = ItemList.FindAll(delegate(Rendition.Commerce.Item item) {
                            return item.Properties.FindAll(delegate(Rendition.Commerce.Property prop) {
                                return (prop.Text == hashrow[1] && prop.Name == hashrow[0]);
                            }).Count > 0;
                        });
                    }
                }
            }
            /* now check if there are items
                * in the list and if so do 
                * the listing or fail */
            if(ItemList.Count > 0) {
                /* calculate how many
                    * pages there needs
                    * to be etc.. */
                To = ItemList.Count;
                From = 0;
                Regex number = new Regex("[0-9]+");
                if(!number.IsMatch(Options.RequestPage)) {
                    Page = 1;
                } else {
                    try {
                        Page = Convert.ToInt32(Options.RequestPage);
                    } catch {
                        Page = 1;
                    }
                };
                int rpp = session.RecordsPerPage > 0 ? session.RecordsPerPage : Main.Site.Defaults.RecordsPerPage;
                int addMod = ItemList.Count % rpp > 0 ? 1 : 0;
                TotalPages = (ItemList.Count / rpp) + addMod;

                if(Page > TotalPages) {
                    Page = TotalPages;
                }
                /* Users will pass in a 1 based
                    * set, so it is nessessary to 
                    * convert it to a zero based set */
                PrevPage = Page - 1;
                NextPage = Page + 1;
                Page--;
                if(Page < 0) {
                    Page = 0;
                }
                From = rpp * Page;
                To = (rpp * Page) + rpp;
                if(To > ItemList.Count) {
                    To = ItemList.Count;
                }
                if(rpp < 1) {
                    session.RecordsPerPage = Main.Site.Defaults.RecordsPerPage;
                    if(session.RecordsPerPage < 1) {
                        session.RecordsPerPage = 100;
                    }
                };
                if(NextPage > TotalPages) {
                    NextPage = TotalPages;
                };
                if(PrevPage < 1) {
                    PrevPage = 1;
                };
                /* get the Properties for this selection of items */
                Properties = Rendition.Main.Site.Properties.List.FindAll(delegate(Rendition.Commerce.Property p) {
                    return ItemList.Exists(delegate(Rendition.Commerce.Item itm) {
                        return p.ItemNumber == itm.ItemNumber;
                    });
                });
                /* now that the filters have been
                    * applied recreate the price list
                    * but only for pepole requesting it */
                if(_filter != null) {
                    priceFilters = GetPriceFilters(ItemList, PriceRanges);
                }
                if(session.ListOrder == 0) {
                    OrderByName = Options.OrderMessageFeaturedItem;
                    /* get the order int respective 
                        * to the category id (ix.id)
                        * but on searches order by
                        * item.searchPriority
                        * as there is no category order.
                        */
                    if(Category.Id != Guid.Empty) {
                        ItemList.Sort(delegate(Rendition.Commerce.Item item1, Rendition.Commerce.Item item2) {
                            return item1.CategoryOrder[Category.Id].CompareTo(item2.CategoryOrder[Category.Id]);
                        });
                    } else {
                        ItemList.Sort(delegate(Rendition.Commerce.Item item1, Rendition.Commerce.Item item2) {
                            return item1.SearchPriority.CompareTo(item2.SearchPriority);
                        });
                    }
                } else if(session.ListOrder == 1) {
                    OrderByName = Options.OrderMessagePriceLowToHigh;
                    ItemList.Sort(delegate(Rendition.Commerce.Item item1, Rendition.Commerce.Item item2) {
                        return item1.Price.CompareTo(item2.Price);
                    });
                } else if(session.ListOrder == 2) {
                    OrderByName = Options.OrderMessagePriceHighToLow;
                    ItemList.Sort(delegate(Rendition.Commerce.Item item1, Rendition.Commerce.Item item2) {
                        return item2.Price.CompareTo(item1.Price);
                    });
                } else if(session.ListOrder == 3) {
                    OrderByName = Options.OrderMessageShortDescAtoZ;
                    ItemList.Sort(delegate(Rendition.Commerce.Item item1, Rendition.Commerce.Item item2) {
                        return item1.ShortDescription.CompareTo(item2.ShortDescription);
                    });
                } else if(session.ListOrder == 4) {
                    OrderByName = Options.OrderMessageShortDescZtoA;
                    ItemList.Sort(delegate(Rendition.Commerce.Item item1, Rendition.Commerce.Item item2) {
                        return item2.ShortDescription.CompareTo(item1.ShortDescription);
                    });
                }
                /* build price filter links table */
                pfltBuilder.Append("<table class=\"priceFiltertable\">");
                /* start counting how many times we loop */
                int x = 0;
                int highest = priceFilters.Count - 1;
                foreach(Dictionary<string, object> priceFilter in priceFilters) {
                    if(((int)priceFilter["count"]) > 0) {
                        string low = ((decimal)priceFilter["low"]).ToString("c");
                        string high = ((decimal)priceFilter["high"]).ToString("c");
                        HasPriceFilters = true;
                        /* there are items that are this price, make a link to the items */
                        pfltBuilder.Append("<tr><td>");
                        string pFilterLink = "";
                        string _pflt = Options.PriceFilterFormat;
                        if(x == 0) {
                            _pflt = Options.PriceFilterLowestFormat;
                        } else if(x == highest) {
                            _pflt = Options.PriceFilterHighestFormat;
                        }
                        pFilterLink = "<a rel=\"nofollow\" href=\"/" + Options.ScriptName + "?" + ListType +
                        "=" + ListTypeValue + "&amp;page=" + (Page + 1).ToString() +
                        "&amp;filter=" + HttpUtility.UrlEncode(Filter.Replace(Options.RequestPrice + "|" + priceFilter["id"], "") +
                        "_" + Options.RequestPrice + "|" + priceFilter["id"]) + "\">" +
                        String.Format(_pflt, low, high, priceFilter["count"]) + "</a>";

                        PriceFilterLinks.Add(pFilterLink);
                        pfltBuilder.Append(pFilterLink);
                        pfltBuilder.Append("</td></tr>");
                        x++;
                    }
                }
                pfltBuilder.Append("</table>");
                /* build remove filter links and table */
                string currentValue = "";
                char[] delimiters = new char[] { '_' };
                string[] filters = Filter.Split(delimiters, StringSplitOptions.RemoveEmptyEntries);
                if(filters.Length > 0) {
                    rfltBuilder.Append("<table class=\"removeFiltertable\">");
                    foreach(string flt in filters) {
                        HasRemoveFilters = true;
                        string fltName = flt.Split('|')[0];
                        string fltValue = flt.Split('|')[1];
                        if(currentValue != fltValue && fltName != Options.RequestPrice) {
                            rfltBuilder.Append("<tr><th>");
                            rfltBuilder.Append(String.Format(Options.PropertyFilterRemoveFormat, fltName));
                            rfltBuilder.Append("</th></tr>");
                        }
                        rfltBuilder.Append("<tr><td>");
                        string rFiltLink = "<a rel=\"nofollow\" href=\"/" + Options.ScriptName + "?" + ListType +
                        "=" + ListTypeValue + "&amp;page=" + (Page + 1).ToString() +
                        "&amp;filter=" + HttpUtility.UrlEncode(Filter.Replace(fltName + "|" + fltValue, "")) +
                        "\" title=\"" + String.Format(Options.PropertyFilterRemoveTitle, Options.RequestPrice) + "\">" +
                        String.Format(Options.PropertyFilterValueRemoveFormat, fltValue.HtmlEncode()) + "</a>";
                        if(fltName == Options.RequestPrice) {
                            rFiltLink = "<a rel=\"nofollow\" href=\"/" + Options.ScriptName + "?" + ListType +
                            "=" + ListTypeValue + "&amp;page=" + (Page + 1).ToString() +
                            "&amp;filter=" + HttpUtility.UrlEncode(Filter.Replace(fltName + "|" + fltValue, "")) +
                            "\" title=\"" + String.Format(Options.PropertyFilterRemoveTitle, Options.RequestPrice.HtmlEncode()) + "\">" +
                            Options.PropertyFilterRemovePrice + "</a>";
                        }
                        currentValue = fltValue;
                        rfltBuilder.Append(rFiltLink);
                        RemoveFilterLinks.Add(rFiltLink);
                        rfltBuilder.Append("</td></tr>");
                    }
                    rfltBuilder.Append("</table>");
                }
                /* build filter links and table */
                string currentProperty = "";
                string currentText = "";
                string count = "";
                fltBuilder.Append("<table class=\"filtertable\">");
                for(var y = 0; Properties.Count > y; y++) {
                    if((currentProperty != Properties[y].Name ||
                    currentText != Properties[y].Text)
                    && Properties[y].Text.Trim().Length > 0
                    && Properties[y].ShowInFilter == true
                    && !Filter.Contains(Properties[y].Name)) {
                        HasFilters = true;
                        if(currentProperty != Properties[y].Name) {
                            fltBuilder.Append("<tr><th>");
                            if(currentProperty != Properties[y].Name) {
                                fltBuilder.Append(Properties[y].Name);
                                currentProperty = Properties[y].Name;
                            }
                            fltBuilder.Append("</th></tr>");
                        }
                        fltBuilder.Append("<tr><td>");
                        if(currentText != Properties[y].Text) {
                            count = Properties.FindAll(delegate(Rendition.Commerce.Property p) {
                                return p.Text.Trim() == Properties[y].Text.Trim() &&
                                Properties[y].Name.Trim() == p.Name.Trim();
                            }).Count.ToString();
                            string f_link = "<a rel=\"nofollow\" href=\"/" + Options.ScriptName + "?" + ListType + "=" +
                            ListTypeValue + "&amp;page=" + (Page + 1).ToString() +
                            "&amp;filter=" + HttpUtility.UrlEncode(Filter + "_" + Properties[y].Name.Trim() + '|' + Properties[y].Text.Trim()) +
                            "\" title=\"" + String.Format(Options.PropertyFilterFormatTitle.HtmlEncode(), Properties[y].Text.Trim()) + "\">" +
                            String.Format(Options.PropertyFilterFormat, Properties[y].Text.Trim().HtmlEncode(), count) + "</a>";
                            fltBuilder.Append(f_link);
                            FilterLinks.Add(f_link);
                            currentText = Properties[y].Text;
                        }
                        fltBuilder.Append("</td></tr>");
                    }
                }
                fltBuilder.Append("</table>");
            }
        }
    }
}
