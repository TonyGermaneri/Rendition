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
* Gets a random fixed width integer.
* @function
* @public
* @name Rendition.UI.getFixedWidthRandomInt
* @param {Native.Integer} seed Random seed.
* @param {Native.Integer} width Number of characters the number should contain.
* @param {Native.Integer} base The numbering base (for example: 10).
* @returns {Native.Integer} New random number.
*/
Rendition.UI.getFixedWidthRandomInt = function (seed, width, base) {
	var rand1 = Math.floor(Math.random() * seed).toString(base);
	while (rand1.length < 4) {
	    rand1 = '0' + rand1;
	}
	return rand1;
}
/**
* Gets the aproximate width of the text content of a cell. 
* Shows how much over the max width the input text was at a given font size.
* @function
* @public
* @param {Native.String} text The text to measure and crop.
* @param {Native.Integer} maxWidth The maximum width (in px) that the font can fit.
* @param {Native.Integer} fontsize The font size array to use.  Defined in Rendition.UI.alpha.
* @name Rendition.UI.getAproxWidth
* @returns {Native.Object} {overwidth:[Integer],text:[String]}
*/
Rendition.UI.getAproxWidth = function (text, maxWidth, fontsize) {
	if (text === undefined) { return 0 }
	var mult = .005;
	var aproxWidth = 0;
	var truncText = [];
	var over = false;
	var a = Rendition.UI.alpha.length;
	var tlength = text.length;
	/* becuase 8 is the maximum we'll test to see if when every char is 8
	becuase this is USUALY the case this should speed this function
	up quite a bit
	*/
	if ((tlength * 8) < maxWidth) {
	    return { overwidth: false, text: text }
	}
	for (var x = 0; tlength > x; x++) {
	    for (var y = 0; a > y; y++) {
	        if (text.substring(x, x + 1) === Rendition.UI.alpha[y][0]) {
	            if (aproxWidth + (Rendition.UI.alpha[y][1] - (mult * aproxWidth)) > maxWidth) {
	                over = true
	            } else {
	                truncText.push(text.substring(x, x + 1));
	                aproxWidth += (Rendition.UI.alpha[y][1] - (mult * aproxWidth));
	            }
	        }
	    }
	    if (over) {
	        break;
	    }
	}
	return { overwidth: over, text: truncText.join('') }
}
/**
* Check if an object is a integer.
* @function
* @public
* @name Rendition.UI.isNumeric
* @param {Native.Object} x the value to check.
* @returns {Native.Boolean}
*/
Rendition.UI.isNumeric = function (x) {
	if (x === '' || x === undefined || x === null) { return false }
	var RegExp = /^(-)?(\d*)(\.?)(\d*)$/;
	return String(x).match(RegExp);
}
/**
* Turns a UUID into a JavaScript or XML safe id by adding a 'd' to the front of it,
* removing the curly braces and replacing the hyphens with underscores.
* and adds a tab charater to the field at the cursor position.
* @function
* @public
* @name Rendition.UI.encodeXMLId
* @param {Native.Object} e Browser event object.
* @returns {Native.undefined}
*/
Rendition.UI.encodeXMLId = function (e) {
	return 'd' + e.replace(/}/g, '').replace(/{/g, '').replace(/-/g, '_');
}
/**
* Get a hex value from RGB color.
* @function
* @public
* @name Rendition.UI.hexFromRGB
* @param {Integer|String} The red value.
* @param {Integer|String} The green value.
* @param {Integer|String} The blue value.
* @returns {Native.String} hex color code (without # sign)
*/
Rendition.UI.hexFromRGB = function (r, g, b) {
	var hex = [
		r.toString(16),
		g.toString(16),
		b.toString(16)
	]
	$.each(hex, function (nr, val) {
	    if (val.length == 1) {
	        hex[nr] = '0' + val;
	    }
	});
	return hex.join('').toUpperCase();
}
/**
* Get a RGB color from hex color.
* @function
* @public
* @name Rendition.UI.RGBFromHex
* @param {Native.String} Hex color.
* @returns {Native.String} hex color code (without # sign)
*/
Rendition.UI.RGBFromHex = function (hex) {
	hex = hex.replace('#', '');
	if (hex.length == 3 && hex.match(/^[0-F][0-F][0-F]$/)) {
	    return { r: parseInt(hex.substring(0, 1), 16), g: parseInt(hex.substring(1, 2), 16), b: parseInt(hex.substring(2, 3), 16) }
	} else if (hex.length == 6 && hex.match(/^[0-F][0-F][0-F][0-F][0-F][0-F]$/)) {
	    return { r: parseInt(hex.substring(0, 2), 16), g: parseInt(hex.substring(2, 4), 16), b: parseInt(hex.substring(4, 6), 16) }
	}
	return { r: 0, b: 0, g: 0 }
}
/**
* Gets a random number.
* @function
* @public
* @name Rendition.UI.rand
* @param {Native.Integer} max Max possible number to return.
* @returns {Native.Integer} a random number
*/
Rendition.UI.rand = function (max) {
	var ranNum = Math.floor(Math.random() * max);
	return ranNum;
}
/**
* Checks if an object is an array.
* @function
* @public
* @name Rendition.UI.isArray
* @param {Native.Object} testObject Object to test.
* @returns {Native.Boolean} true when the object is an array.
*/
Rendition.UI.isArray = function (testObject) {
	return testObject && !(testObject.propertyIsEnumerable('length')) && typeof testObject === 'object' && typeof testObject.length === 'number';
}
/**
* When sent a function it will execute the fuction in the scope and with the arguments provided,
* if anything else is sent it will return was was sent.
* @function
* @public
* @name Rendition.UI.stringOrFunction
* @param {Native.Object} obj The object.
* @param {Native.Object} scope The scope to execute in.
* @param {Native.Array} args Array of arguments to pass to the function (if a function is used).
* @returns {Native.Object} Function result or object.
*/
Rendition.UI.stringOrFunction = function (obj, scope, args) {
	if (typeof obj == 'function') {
	    return obj.apply(scope, args);
	} else {
	    return obj;
	}
}
/**
* Makes a string safe for input into an HTML input.
* @function
* @public
* @name Rendition.UI.htmlEncode
* @param {Native.String} s The string to encode.
* @returns {Native.String} HTML encoded string.
*/
Rendition.UI.htmlEncode = function (s) {
	if (s) {
	    return s.replace(/&(?!\w+([;\s]|R))/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
	} else {
	    return '';
	}
}
/**
* Convert the string 'true' or 'false' into a boolean or a string  '1' or '0' into a boolean.
* @function
* @public
* @name Rendition.UI.cbool
* @param {Native.String} strBool The string to convert.
* @returns {Native.Boolean} The boolean version of the string.
*/
Rendition.UI.cbool = function (strBool) {
	strBool = String(strBool).toLowerCase();
	if (strBool == 'true' || strBool == '1') {
	    return true;
	} else {
	    return false;
	}
}
/**
* Converts string 'on' and 'off' (or '') to an Integer 1 or 0. 1=on and 0=off (or '').
* @function
* @public
* @name Rendition.UI.cbit
* @param {Native.String} strBool The string to convert.
* @returns {Native.Boolean} The boolean version of the string.
*/
Rendition.UI.cbit = function (value) {
	if (value == 'on') {
	    return 1;
	} else {
	    return 0;
	}
}
/**
* IIF. Just like var foo = 1>2?3:4; but with a lot more typing.
* @function
* @public
* @depreciated
* @name Rendition.UI.iif
* @param {Native.Boolean} cond Condition to compare.
* @param {Native.Object} ret When the condition parameter is true this will be returned.
* @param {Native.Object} elseRet When the condition parameter is false this will be returned.
* @returns {Native.Object} Parameter ret, or elseRet depending on the condition parameter.
*/
Rendition.UI.iif = function (cond, ret, elseRet) {
	if (cond) {
	    return ret;
	} else {
	    if (elseRet !== undefined) {
	        return elseRet;
	    } else {
	        return '';
	    }
	}
}
/**
* Checks if the object is a date.
* @function
* @public
* @name Rendition.UI.isDate
* @param {Native.String} value The object to test.
* @returns {Native.Boolean} when true the object is a date.
*/
Rendition.UI.isDate = function (value) {
	return (value.toString().match(Rendition.UI.dateMatchPattern) &&
    (!isNaN(new Date(value).getYear()))) || (typeof value.getDate === 'function');
}
/**
* Adds comma grouping to a number.
* @function
* @public
* @name Rendition.UI.addCommas
* @param {Native.String} value The object to test.
* @returns {Native.String} pretty number.
*/
Rendition.UI.addCommas = function (nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
	    x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
/**
* Truncates text to a certain width.
* @function
* @public
* @name Rendition.UI.truncateText
* @param {Native.String} value The object to test.
* @returns {Native.String} Truncated text
*/
Rendition.UI.truncateText = function (text, width) {
	var aproxWidth = Rendition.UI.getAproxWidth(String(text), width, 11);
	if (aproxWidth.overwidth) {
	    return aproxWidth.text + '...';
	} else {
	    return text;
	}
	return null;
}
/**
* Gets the field info object { name: 'Blah', message: 'All About Blah' }.
* @function
* @public
* @name Rendition.UI.GetFieldInfo
* @param {Native.String} uniqueFieldName The unique field name as defined in the xml fields definition.
* @returns {Native.String} The file name
*/
Rendition.UI.GetFieldInfo = function (uniqueFieldName) {
    var f = Rendition.Localization[uniqueFieldName];
    if (f === undefined) {
        return {
            name: uniqueFieldName,
            message: ''
        }
    } else {
        return f;
    }
}
/**
* Gets the file name from a physical path.
* @function
* @public
* @name Rendition.UI.getFileNameFromFullPath
* @param {Native.String} fullPath The full physical path.
* @returns {Native.String} The file name
*/
Rendition.UI.getFileNameFromFullPath = function (fullPath) {
	if (fullPath === undefined) { return undefined }
	if (fullPath == '') { return '' }
	if (typeof fullPath != 'string') { return fullPath }
	var lastBS = fullPath.lastIndexOf("\\");
	if (lastBS == -1) { return fullPath }
	return fullPath.substring(lastBS + 1);
}
/**
* Gets the directory name from a physical path.
* @function
* @public
* @name Rendition.UI.getDirectoryNameFromFullPath
* @param {Native.String} fullPath The full physical path.
* @returns {Native.String} The file name
*/
Rendition.UI.getDirectoryNameFromFullPath = function (fullPath) {
	if (fullPath === undefined) { return undefined }
	if (fullPath == '') { return '' }
	if (typeof fullPath != 'string') { return fullPath }
	fullPath = fullPath.substring(0, fullPath.length - 1);
	var lastBS = fullPath.lastIndexOf("\\");
	if (lastBS == -1) { return fullPath }
	return fullPath.substring(lastBS + 1);
}
/**
* Gets a path from the full path (path+file).
* @function
* @public
* @name Rendition.UI.getPathFromFullPath
* @param {Native.String} fullPath The full physical path.
* @returns {Native.String} Directory Path
*/
Rendition.UI.getPathFromFullPath= function (fullPath) {
	if (fullPath === undefined) { return undefined }
	if (fullPath == '') { return '' }
	if (typeof fullPath != 'string') { return fullPath }
	var lastBS = fullPath.lastIndexOf("\\");
	if (lastBS == -1) { return fullPath }
	return fullPath.substring(0, lastBS - 1);
}