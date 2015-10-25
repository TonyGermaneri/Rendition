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
* Sync fetch a SQL query and return a 2D array.
* @function
* @public
* @param {Native.String} query The query to execute.
* @name Rendition.UI.getSqlArray
* @returns {Native.Array} Data
*/
Rendition.UI.getSqlArray = function (query) {
	var data = [];
	var url = 'method1=["GetSqlArray",[{"commandText":"' + query.toURI() + '"}]]';
	var req = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
	    var a = JSON.parse(e.responseText);
	    if (a.method1.GetSqlArray.error !== undefined) {
	        alert(a.method1.GetSqlArray.description);
	    } else {
	        data = a.method1.GetSqlArray;
	    }
	}, this, false);
	return data;
}
/**
* Creates a GUID by using Rendition.UI.createUUID.
* @function
* @public
* @name Rendition.UI.createGUID
* @returns {Native.String} New GUID/UUID.
*/
Rendition.UI.createGUID = function () {
	return Rendition.UI.createUUID();
}
/**
* Creates a UUID.  
* http://www.rfc-archive.org/getrfc.php?rfc=4122 4.4.  Algorithms for Creating a UUID from Truly Random or Pseudo-Random Numbers
* @function
* @public
* @name Rendition.UI.createUUID
* @returns {Native.String} New GUID/UUID.
*/
Rendition.UI.createUUID = function () {
	var s = [];
	var hexDigits = '0123456789ABCDEF';
	for (var i = 0; i < 32; i++) {
	    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	/*bits 12-15 of the time_hi_and_version field to 0010*/
	s[12] = '4';
	/*bits 6-7 of the clock_seq_hi_and_reserved to 01*/
	s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);
	var uuid = s.join('');
	return uuid.substring(0, 8) + '-' + uuid.substring(8, 12) + '-' + uuid.substring(12, 16) + '-' + uuid.substring(16, 20) + '-' + uuid.substring(20, 32);
}
/**
* Accepts two date strings in this format '1/1/2009' and returns the int difference in days.
* @function
* @public
* @name Rendition.UI.dateDiff
* @param {Native.String} day1 The first date to compare.
* @param {Native.String} day2 The second date to compare.
* @returns {Native.Integer} The difference, in days, between the two days.
*/
Rendition.UI.dateDiff = function (day1, day2) {
	var d1 = new Date(Date.parse(day1));
	var d2 = new Date(Date.parse(day2));
	/*Set 1 day in milliseconds*/
	var one_day = 1000 * 60 * 60 * 24;
	/*Calculate difference btw the two dates, and convert to days*/
	return Math.ceil((d2.getTime() - d1.getTime()) / (one_day));
}
/**
* Convert parseSQLDate.
* @function
* @name Grid.parseSQLDate
* @memberOf Rendition.UI.prototype
* @private
* @returns {Native.Object} parsed date.
*/
Rendition.UI.parseSQLDate = function (date) {
    /* format 10* */
    var f10 = /^([a-zA-Z]{3,3}) +([0-9]{1,2}) +([0-9]{2,4}) +([0-9]{1,2}):([0-9]{1,2})(AM|PM)$/i;
    if (f10.test(date)) {
        var month = '';
        var exp = f10.exec(date);
        switch (exp[1]) {
            case 'Jan':
                month = 1;
                break;
            case 'Feb':
                month = 2;
                break;
            case 'Mar':
                month = 3;
                break;
            case 'Apr':
                month = 4;
                break;
            case 'May':
                month = 5;
                break;
            case 'Jun':
                month = 6;
                break;
            case 'Jul':
                month = 7;
                break;
            case 'Aug':
                month = 8;
                break;
            case 'Sep':
                month = 9;
                break;
            case 'Oct':
                month = 10;
                break;
            case 'Nov':
                month = 11;
                break;
            case 'Dec':
                month = 12;
                break;
        }
        var day = exp[2];
        var year = exp[3];
        var timeHr = exp[4];
        var timeMn = exp[5];
        var time = timeHr + ":" + timeMn;
        if (exp[6] === "PM") {
            time = (parseInt(timeHr) + 12) + ":" + timeMn;
        }
        return new Date(month + '/' + day + '/' + year + ' ' + time);
    } else {
        return new Date(date);
    }
}
/**
* Turns SQL data types into JS data types..
* @function
* @name Grid.parseDataTypes
* @memberOf Rendition.UI.Grid.prototype
* @private
* @returns {Native.Object} grid.
*/
Rendition.UI.parseDataTypes = function (data, headers) {
    for (var x = 0; headers.length > x; x++) {
        for (var y = 0; data.length > y; y++) {
            if (data[y] !== undefined && data[y] !== null) {
                var type = headers[x].dataType;
                if (type == 'int' || type == 'bigint') {
                    data[y][x] = parseInt(data[y][x]);
                } else if (type == 'money' || type == 'float' || type == 'real') {
                    data[y][x] = parseFloat(data[y][x]);
                } else if (type == 'datetime') {
                    data[y][x] = Rendition.UI.parseSQLDate(data[y][x]);
                }
            }
        }
    }
    return data;
}