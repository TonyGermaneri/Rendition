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
using System.Text.RegularExpressions;
namespace Rendition {
	public partial class Admin {
        /// <summary>
        /// Used in getWordCounts to scan substrings.
        /// </summary>
        /// <param name="words">The words.</param>
        /// <param name="results">The results.</param>
        /// <param name="searchString">The search string.</param>
        /// <param name="id">The id.</param>
        /// <param name="description">The description.</param>
        /// <param name="runningTotalOfAllWords">The running total of all words.</param>
		private static void GetWordCountCheckMatch( string[] words, List<Dictionary<string, object>> results,
		 string searchString, object id, string description, ref int runningTotalOfAllWords ) {
			foreach( string word in words ) {
				Regex reg = new Regex( "\\b" + word.Trim() + "\\b" );
				MatchCollection matches = reg.Matches( searchString );
				if( matches.Count > 0 ) {
					Dictionary<string, object> j = new Dictionary<string, object>();
					j.Add( "word", word );
					j.Add( "location", description );
					j.Add( "id", id );
					j.Add( "total", matches.Count );
					results.Add( j );
				}
			}
			Regex all = new Regex( "\\w" );
			runningTotalOfAllWords += all.Matches( searchString ).Count;
		}
		/// <summary>
		/// Updates the total word count.  Used by getWordCounts.
		/// </summary>
		/// <param name="detail">The detail.</param>
		/// <param name="_words">The _words.</param>
		/// <param name="totalForAll">The total for all.</param>
		/// <returns></returns>
		private static int UpdateTotalWordCount( List<Dictionary<string, object>> detail, string[] _words, int totalForAll ) {
			int totalMatches = 0;
			foreach( string word in _words ) {
				int total = 0;
				foreach( Dictionary<string, object> rslt in detail ) {
					if( ( string )rslt[ "word" ] == word ) {
						total += ( int )rslt[ "total" ];
					}
				}
				Dictionary<string, object> wrd = new Dictionary<string, object>();
				wrd.Add( "word", word );
				wrd.Add( "total", total );
				if( total > 0 ) {
					wrd.Add( "percentage", ( total / totalForAll ) * 100 );
				} else {
					wrd.Add( "percentage", 0 );
				}
				detail.Add( wrd );
				totalMatches += total;
			}
			return totalMatches;
		}
		/// <summary>
		/// Gets the number of occurances of a word in the system and returns a detailed result list.
		/// This function scans:
		/// Meta Descriptions
		/// Meta Keywords
		/// Page Titles
		/// Menu Link Texts
		/// Item Descriptions
		/// Item Short Description
		/// Item HTML
		/// Site Section Name
		/// Site Section Description
		/// Site Section Entry
		/// </summary>
		/// <param name="words">The words.</param>
		/// <returns></returns>
		public static Dictionary<string, object> GetWordCounts( string words ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			List<Dictionary<string, object>> details = new List<Dictionary<string, object>>();
			List<Dictionary<string, object>> results = new List<Dictionary<string, object>>();
			List<Dictionary<string, object>> sections = new List<Dictionary<string, object>>();
			string[] _words = words.Split( ' ' );
			int runningTotalOfAllWords = 0, runningTotalOfAllMatches = 0,
			metaDescTotal = 0, metaKeywordsTotal = 0, pageTitle = 0, menuLinkTotal = 0,
			itemDescTotal = 0, itemShortDescTotal = 0, itemHTMLTotal = 0,
			sectionNameTotal = 0, sectionDescTotal = 0, sectionEntryTotal = 0;

			/* meta description */
			Dictionary<string, object> section = new Dictionary<string, object>();
			List<Dictionary<string, object>> detail = new List<Dictionary<string, object>>();
			int matches = 0;
			foreach( Commerce.SeoListMetaUtility i in Main.Site.SeoListMetaUtilities.List ) {
				GetWordCountCheckMatch( _words, detail, i.MetaDescription, i.Id, "Meta Description", ref metaDescTotal );
			}
			matches = UpdateTotalWordCount( detail, _words, metaDescTotal );
			runningTotalOfAllWords += metaDescTotal;
			runningTotalOfAllMatches += matches;
			section.Add( "matches", matches );
			section.Add( "detail", detail );
			section.Add( "total", metaDescTotal );
			section.Add( "name", "Meta Description" );
			sections.Add( section );
			details.AddRange( detail );

			/* meta keywords */
			section = new Dictionary<string, object>();
			detail = new List<Dictionary<string, object>>();
			matches = 0;
			foreach( Commerce.SeoListMetaUtility i in Main.Site.SeoListMetaUtilities.List ) {
				GetWordCountCheckMatch( _words, detail, i.MetaKeywords, i.Id, "Meta Keywords", ref metaKeywordsTotal );
			}
			matches = UpdateTotalWordCount( detail, _words, metaDescTotal );
			runningTotalOfAllWords += metaKeywordsTotal;
			runningTotalOfAllMatches += matches;
			section.Add( "matches", UpdateTotalWordCount( detail, _words, metaKeywordsTotal ) );
			section.Add( "detail", detail );
			section.Add( "total", metaKeywordsTotal );
			section.Add( "name", "Meta Keywords" );
			sections.Add( section );

			/* page titles */
			section = new Dictionary<string, object>();
			detail = new List<Dictionary<string, object>>();
			matches = 0;
			foreach( Commerce.SeoListMetaUtility i in Main.Site.SeoListMetaUtilities.List ) {
				GetWordCountCheckMatch( _words, detail, i.Title, i.Id, "Page Title", ref pageTitle );
			}
			matches = UpdateTotalWordCount( detail, _words, pageTitle );
			runningTotalOfAllWords += pageTitle;
			runningTotalOfAllMatches += matches;
			section.Add( "matches", matches );
			section.Add( "detail", detail );
			section.Add( "total", pageTitle );
			section.Add( "name", "Page Title" );
			sections.Add( section );

			/* menu texts */
			section = new Dictionary<string, object>();
			detail = new List<Dictionary<string, object>>();
			matches = 0;
			foreach( Commerce.Menu i in Main.Site.Menus.List ) {
				GetWordCountCheckMatch( _words, detail, i.Name, i.Id, "Menu Link Text", ref menuLinkTotal );
			}
			matches = UpdateTotalWordCount( detail, _words, menuLinkTotal );
			runningTotalOfAllWords += menuLinkTotal;
			runningTotalOfAllMatches += matches;
			section.Add( "matches", matches );
			section.Add( "detail", detail );
			section.Add( "total", menuLinkTotal );
			section.Add( "name", "Menu Link Text" );
			sections.Add( section );

			/* item description */
			section = new Dictionary<string, object>();
			detail = new List<Dictionary<string, object>>();
			matches = 0;
			foreach( Commerce.Item i in Main.Site.Items.List ) {
				GetWordCountCheckMatch( _words, detail, i.Description, i.Number, "Item Description", ref itemDescTotal );
			}
			matches = UpdateTotalWordCount( detail, _words, itemDescTotal );
			runningTotalOfAllWords += itemDescTotal;
			runningTotalOfAllMatches += matches;
			section.Add( "matches", matches );
			section.Add( "detail", detail );
			section.Add( "total", itemDescTotal );
			section.Add( "name", "Item Description" );
			sections.Add( section );

			/* short item description */
			section = new Dictionary<string, object>();
			detail = new List<Dictionary<string, object>>();
			matches = 0;
			foreach( Commerce.Item i in Main.Site.Items.List ) {
				GetWordCountCheckMatch( _words, detail, i.ShortDescription, i.Number, "Item Short Description", ref itemShortDescTotal );
			}
			matches = UpdateTotalWordCount( detail, _words, itemShortDescTotal );
			runningTotalOfAllWords += itemShortDescTotal;
			runningTotalOfAllMatches += matches;
			section.Add( "matches", matches );
			section.Add( "detail", detail );
			section.Add( "total", itemShortDescTotal );
			section.Add( "name", "Item Short Description" );
			sections.Add( section );

			/* item html */
			section = new Dictionary<string, object>();
			detail = new List<Dictionary<string, object>>();
			matches = 0;
			foreach( Commerce.Item i in Main.Site.Items.List ) {
				GetWordCountCheckMatch( _words, detail, i.Html, i.Number, "Item HTML", ref itemHTMLTotal );
			}
			matches = UpdateTotalWordCount( detail, _words, itemHTMLTotal );
			runningTotalOfAllWords += itemHTMLTotal;
			runningTotalOfAllMatches += matches;
			section.Add( "matches", matches );
			section.Add( "detail", detail );
			section.Add( "total", itemHTMLTotal );
			section.Add( "name", "Item HTML" );
			sections.Add( section );

			/* section name */
			section = new Dictionary<string, object>();
			detail = new List<Dictionary<string, object>>();
			matches = 0;
			foreach( Commerce.SiteSection i in Main.Site.SiteSections.List ) {
				GetWordCountCheckMatch( _words, detail, i.Name, i.Id, "Site Section Name", ref sectionNameTotal );
			}
			matches = UpdateTotalWordCount( detail, _words, sectionNameTotal );
			runningTotalOfAllWords += sectionNameTotal;
			runningTotalOfAllMatches += matches;
			section.Add( "matches", matches );
			section.Add( "detail", detail );
			section.Add( "total", sectionNameTotal );
			section.Add( "name", "Site Section Name" );
			sections.Add( section );

			/* section Section Description */
			section = new Dictionary<string, object>();
			detail = new List<Dictionary<string, object>>();
			matches = 0;
			foreach( Commerce.SiteSection i in Main.Site.SiteSections.List ) {
				GetWordCountCheckMatch( _words, detail, i.Description, i.Id, "Site Section Description", ref sectionDescTotal );
			}
			matches = UpdateTotalWordCount( detail, _words, sectionDescTotal );
			runningTotalOfAllWords += sectionDescTotal;
			runningTotalOfAllMatches += matches;
			section.Add( "matches", matches );
			section.Add( "detail", detail );
			section.Add( "total", sectionDescTotal );
			section.Add( "name", "Site Section Description" );
			sections.Add( section );

			/* section entries */
			section = new Dictionary<string, object>();
			detail = new List<Dictionary<string, object>>();
			matches = 0;
			foreach( Commerce.SiteSection i in Main.Site.SiteSections.List ) {
				foreach( Commerce.SiteSectionEntry e in i.Entries ) {
					GetWordCountCheckMatch( _words, detail, e.Source, e.Id, "Site Section Entry", ref sectionEntryTotal );
				}
			}
			matches = UpdateTotalWordCount( detail, _words, sectionEntryTotal );
			runningTotalOfAllWords += sectionEntryTotal;
			runningTotalOfAllMatches += matches;
			section.Add( "matches", matches );
			section.Add( "detail", detail );
			section.Add( "total", sectionEntryTotal );
			section.Add( "name", "Site Section Entry" );
			sections.Add( section );

			/* get pct totals */

			j.Add( "matches", runningTotalOfAllMatches );
			j.Add( "total", runningTotalOfAllWords );
			j.Add( "results", results );
			j.Add( "detail", detail );
			j.Add( "sections", sections );
			j.Add( "error", 0 );
			j.Add( "description", "" );
			return j;
		}
	}
}
