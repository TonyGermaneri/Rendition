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
/**
* Turns a DateTime object into a string and formats it following the provided pattern.
* @function
* @public
* @name Rendition.UI.formatDate
* @param {Native.DateTime} formatDate The DateTime object to convert.
* @param {Native.String} formatString The pattern to convert the DateTime object to.
* <table>
*	<tableHeader>
*		<row>
*			<entry>
*				<para>
*					Pattern
*				</para>
*			</entry>
*			<entry>
*				<para>
*					Description
*				</para>
*			</entry>
*		</row>
*	</tableHeader>
*	<row>
*		<entry>
*			<para>
*				yyyy
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Four digit year
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				yy
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit year
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				mmm
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Month name
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				mm
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit month with leading zero
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				m
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit month without leading zero
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				dd
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit day with leading zero
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				d
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit day without leading zero
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				hh
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit hour with leading zero
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				h
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit hour without leading zero
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				HH
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit 12 hour with leading zero
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				H
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit 12 hour without leading zero
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				nn
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit minute with leading zero
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				n
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit minute without leading zero
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				ss
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit second with leading zero
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				s
*			</para>
*		</entry>
*		<entry>
*			<para>
*				Two digit second without leading zero
*			</para>
*		</entry>
*	</row>
*	<row>
*		<entry>
*			<para>
*				a
*			</para>
*		</entry>
*		<entry>
*			<para>
*				AM / PM
*			</para>
*		</entry>
*	</row>
*</table>
* @returns {Native.String} The formatted date.
*/
Rendition.UI.formatDate = function(formatDate, formatString) {
	if (formatDate instanceof Date) {
	    var months = new Array(
        Rendition.Localization['FormatDate_Jan'].Title,
        Rendition.Localization['FormatDate_Feb'].Title,
        Rendition.Localization['FormatDate_Mar'].Title,
        Rendition.Localization['FormatDate_Apr'].Title,
        Rendition.Localization['FormatDate_May'].Title,
        Rendition.Localization['FormatDate_Jun'].Title,
        Rendition.Localization['FormatDate_Jul'].Title,
        Rendition.Localization['FormatDate_Aug'].Title,
        Rendition.Localization['FormatDate_Sep'].Title,
        Rendition.Localization['FormatDate_Oct'].Title,
        Rendition.Localization['FormatDate_Nov'].Title,
        Rendition.Localization['FormatDate_Dec'].Title
        );
	    var yyyy = formatDate.getFullYear();
	    var yy = yyyy.toString().substring(2);
	    var m = formatDate.getMonth() + 1;
	    var mm = m < 10 ? "0" + m : m;
	    var mmm = months[m];
	    var d = formatDate.getDate();
	    var dd = d < 10 ? "0" + d : d;
	    var h = formatDate.getHours();
	    var hh = h < 10 ? "0" + h : h;
	    var H = h > 12 ? h - 12 : h;
	    var HH = H < 10 ? "0" + H : H;
	    var a = h > 12 ? "pm" : "am";
	    var A = h > 12 ? "PM" : "AM";
	    var n = formatDate.getMinutes();
	    var nn = n < 10 ? "0" + n : n;
	    var s = formatDate.getSeconds();
	    var ss = s < 10 ? "0" + s : s;
	    formatString = formatString.replace(/yyyy/i, yyyy);
	    formatString = formatString.replace(/yy/i, yy);
	    formatString = formatString.replace(/mmm/i, mmm);
	    formatString = formatString.replace(/mm/i, mm);
	    formatString = formatString.replace(/m/i, m);
	    formatString = formatString.replace(/dd/i, dd);
	    formatString = formatString.replace(/d/i, d);
	    formatString = formatString.replace(/hh/, hh);
	    formatString = formatString.replace(/h/, h);
	    formatString = formatString.replace(/HH/, HH);
	    formatString = formatString.replace(/HH/, H);
	    formatString = formatString.replace(/nn/i, nn);
	    formatString = formatString.replace(/n/i, n);
	    formatString = formatString.replace(/ss/i, ss);
	    formatString = formatString.replace(/s/i, s);
	    formatString = formatString.replace(/a/, a);
	    formatString = formatString.replace(/A/, A);
	    return formatString;
	} else {
	    return "";
	}
}