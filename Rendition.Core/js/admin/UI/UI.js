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

 /* Although this is the first file rendered in the resource stream, localization is placed before it */

/* globals for doc links */

/** 
Native objects and methods built into ECMAScript.
@name Native
@namespace
*/
/**
* ECMAScript Object
* @constructor
* @public
* @name Native.Object
* @memberOf Native
* @returns <link xlink:href="Native.Object"/>.
*/
/**
* ECMAScript XMLHttpRequest object
* @constructor
* @public
* @name Native.XMLHttpRequest
* @memberOf Native
* @returns <link xlink:href="Native.XMLHttpRequest"/>.
*/
/**
* ECMAScript RegExp object
* @constructor
* @public
* @name Native.RegExp
* @memberOf Native
* @returns <link xlink:href="Native.RegExp"/>.
*/
/**
* ECMAScript String
* @constructor
* @public
* @name Native.String
* @memberOf Native
* @returns <link xlink:href="Native.String"/>.
*/
/**
* DHTML DOM Object (Dynamic Hypertext Markup Language Document Object Model Object).
* An object in the browser.
* @constructor
* @public
* @name Native.DHTMLElement 
* @memberOf Native
* @returns <link xlink:href="Native.DHTMLElement"/>.
*/
/**
* ECMAScript Boolean 
* @constructor
* @public
* @name Native.Boolean 
* @memberOf Native
* @returns <link xlink:href="Native.Boolean"/>.
*/
/**
* ECMAScript Array  
* @constructor
* @public
* @name Native.Array 
* @memberOf Native
* @returns <link xlink:href="Native.Array"/>.
*/
/**
* ECMAScript Number. But should be an integer.
* @constructor
* @public
* @name Native.Integer 
* @memberOf Native
* @returns <link xlink:href="Native.Integer"/>.
*/
/**
* ECMAScript Number.  But can be a float.
* @constructor
* @public
* @name Native.Float 
* @memberOf Native
* @returns <link xlink:href="Native.Float"/>.
*/
/**
* ECMAScript Number.  But can be a Decimal.
* @constructor
* @public
* @name Native.Decimal 
* @memberOf Native
* @returns <link xlink:href="Native.Decimal"/>.
*/
/**
* ECMAScript Number.
* @constructor
* @public
* @name Native.Number 
* @memberOf Native
* @returns <link xlink:href="Native.Integer"/>.
*/
/**
* ECMAScript Function.
* @constructor
* @public
* @name Native.Function 
* @memberOf Native
* @returns <link xlink:href="Native.Function"/>.
*/
/**
* ECMAScript Date.
* @constructor
* @public
* @name Native.Date 
* @memberOf Native
* @returns <link xlink:href="Native.Date"/>.
*/
/**
* ECMAScript Date. With date time resolution.
* @constructor
* @public
* @name Native.DateTime 
* @memberOf Native
* @returns <link xlink:href="Native.DateTime"/>.
*/
/**
* ECMAScript undefined.
* @constructor
* @public
* @name Native.undefined 
* @memberOf Native
* @returns <link xlink:href="Native.undefined"/>.
*/
/**
* ECMAScript null.
* @constructor
* @public
* @name Native.null 
* @memberOf Native
* @returns <link xlink:href="Native.null"/>.
*/
/**
* ECMAScript NaN. Native object.
* @constructor
* @public
* @name Native.NaN 
* @memberOf Native
* @returns <link xlink:href="Native.NaN"/>.
*/
/* 
RENDITION UI ECMAScript DOM Based UI
This file contains:
base structures that other UI application share
and base documentation
*/
/** 
Rendition Javascript framework
@name Rendition
@namespace
*/
/** 
Rendition UI framework
@name Rendition.UI
@namespace
*/
/** 
Rendition localization strings associative array.
@name Rendition.Localization
@namespace
*/
/**
* Global hover function for some widgets.
* @function
* @public
* @name Rendition.UI.hover
* @param {Native.DHTMLElement} obj The object being hovered over. 
* @returns {Native.undefined}
*/
Rendition.UI.hover = function (obj) {
	if (Rendition.UI.objHover) {
	    Rendition.UI.objHover.blur();
	}
	Rendition.UI.objHover = obj;
	obj.hover();
}
/**
* Creates an auto incrementing number to identifiy each widget.
* @function
* @public
* @name Rendition.UI.createId
* @returns {Native.undefined}
*/
Rendition.UI.createId = function () {
	Rendition.UI.topId++;
	return Rendition.UI.topId;
}
/**
* Occurs when Rendition is finished loading.
* @event
* @name Rendition.onFinishedLoading
* @memberOf Rendition.prototype
* @public
* @param {Native.Object} Rendition.
*/
Rendition.UI.onFinishedLoading = function () {
	for (var x = 0; Rendition.UI.e_finishedloading.length > x; x++) {
	    Rendition.UI.e_finishedloading[x].apply(Rendition, arguments);
	}
	return false;
}
/**
* Occurs when Rendition has started loading.
* @event
* @name Rendition.onStartedLoading
* @memberOf Rendition.prototype
* @public
* @param {Native.Object} Rendition.
*/
Rendition.UI.onStartedLoading = function () {
	for (var x = 0; Rendition.UI.e_startedloading.length > x; x++) {
	    Rendition.UI.e_startedloading[x].apply(Rendition, arguments);
	}
	return false;
}