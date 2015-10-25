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
* Creates a text node.
* @function
* @public
* @name Rendition.UI.txt
* @param {Native.String} text The value of the text node.
* @returns {Native.DHTMLElement} Text element
*/
Rendition.UI.txt = function (text) {
	return document.createTextNode(text);
}
/**
* Creates a simple 1 or 2 column table from an array of values.
* @function
* @public
* @name Rendition.UI.pairtable
* @param {Native.Array} args.rows A 1 or 2 dimentional array of 
* DHTML elements that will create a 1 or 2 column table.
* @returns {Native.DHTMLElement} Text element
*/
Rendition.UI.pairtable = function (args) {
	var instance = {}
	if (args === undefined) { args = {} }
	instance.table = document.createElement('table');
	instance.table.className = 'proptable';
	instance.add = function (c1, c2) {
	    var row = instance.table.insertRow(0);
	    if (c2) {
	        var cell2 = row.insertCell(0);
	    }
	    var cell1 = row.insertCell(0);
	    if (c1) {
	        cell1.appendChild(c1);
	        if (!(c2)) {
	            cell1.setAttribute('colspan', 2);
	        }
	    }
	    if (c2) {
	        cell2.appendChild(c2);
	    }
	}
	if (args.rows !== undefined) {
	    for (var x = args.rows.length - 1; x > -1; x--) {
	        instance.add(args.rows[x][0], args.rows[x][1]);
	    }
	}
	return instance;
}
/**
* Check if the DHTML element is in the body.
* @function
* @public
* @name Rendition.UI.isInBody
* @param {DHTMLObject} e The object to check.
* @returns {Native.Boolean} If true the object is in the body.
*/
Rendition.UI.isInBody = function (e) {
	while (e.parentNode) {
	    if (String(e.tagName).toLowerCase() === 'body') {
	        return true;
	    }
	    e = e.parentNode;
	}
	return false;
}
/**
* Attaches CSS code to the body of the document after the page is loaded.
* @function
* @public
* @name Rendition.UI.addCss
* @param {Native.String} cssCode The CSS rules (as a string) to add.
* @returns {Native.undefined}
*/
Rendition.UI.addCss = function (cssCode) {
	var styleElement = document.createElement('style');
	styleElement.type = 'text/css';
	if (styleElement.styleSheet) {
	    styleElement.styleSheet.cssText = cssCode;
	} else {
	    styleElement.appendChild(document.createTextNode(cssCode));
	}
	document.getElementsByTagName('head')[0].appendChild(styleElement);
}
/**
* Attaches JavaScript code to the body of the document after the page is loaded.
* @function
* @public
* @name Rendition.UI.addScript
* @param {Native.String} scriptPath Path (URL) to the script.
* @param {Native.String} callbackProcedure Procedure to run after the script is loaded.
* @returns {Native.undefined}
*/
Rendition.UI.addScript = function (scriptPath, callbackProcedure) {
    $.ajax({
        url: scriptPath,
        dataType: "script",
        success: callbackProcedure
    });
}
/**
* An array of object that have the specified attribute and value starting from a common parent.
* @function
* @public
* @name Rendition.UI.getElementsByAttribute
* @param {Native.String} attribute The name of the attribute.
* @param {Native.String} value The value of the attribute.
* @param {Native.String} tagName The tag name of the attribute.
* @param {Native.DHTMLElement} parentElement The DHTML element to begin searching from.
* @returns {Native.Array}  Array of DHTML elements.
*/
Rendition.UI.getElementsByAttribute = function (attribute, value, tagName, parentElement) {
	var elements = [];
	var children = parentElement.getElementsByTagName(tagName);
	for (var x = 0; children.length > x; x++) {
	    var attributeValue = children[x].getAttribute(attribute);
	    if (attributeValue == value) {
	        elements.push(children[x]);
	    }
	}
	return elements;
}
/**
* Finds all DHTML input types within a given DHTML element
* and returns a JSON string representing them.
* @function
* @public
* @name Rendition.UI.getInputsAsJSON
* @param {Native.Object} obj The DHTML element to search.
* @returns {Native.undefined}
*/
Rendition.UI.getInputsAsJSON = function (obj) {
	if (obj) {
	    var returnString = '';
	    inputs = $(obj).find(':input');
	    for (var i = inputs.length - 1; i >= 0; --i) {
	        if (inputs[i].type === 'checkbox') {
	            if (inputs[i].name.length === 0) { continue; }
	            returnString += ',';
	            if (inputs[i].checked) {
	                returnString += '"' + encodeURIComponent(inputs[i].name) + '":true';
	            } else {
	                returnString += '"' + encodeURIComponent(inputs[i].name) + '":false';
	            }
	        } else if (inputs[i].type === 'radio') {
	            if (inputs[i].name.length === 0) { continue; }
	            if (inputs[i].checked) {
	                returnString += ',';
	                returnString += '"' + encodeURIComponent(inputs[i].name) + '":"' + inputs[i].value.toString().JSONEncode() + '"'
	            }
	        } else {
	            if (inputs[i].name.length === 0) { continue; }
	            returnString += ','
	            returnString += '"' + encodeURIComponent(inputs[i].name) + '":"' + inputs[i].value.toString().JSONEncode() + '"';
	        }
	    }
	    return returnString.substring(1, returnString.length);
	} else {
	    return '';
	}
}
/**
* Finds all the DHTML input types within a 
* given DHTML element and returns an array of inputs.
* @function
* @public
* @name Rendition.UI.getNodeInputs
* @param {Native.Object} obj The DHTML element to search.
* @returns {Native.undefined}
*/
Rendition.UI.getNodeInputs = function (obj) {
	if (obj) {
	    var inputs = obj.getElementsByTagName('input');
	    var selects = obj.getElementsByTagName('select');
	    var textareas = obj.getElementsByTagName('textarea');
	    var formElements = [];
	    for (var x = 0; inputs.length > x; x++) {
	        formElements.push(inputs[x]);
	    }
	    for (var x = 0; selects.length > x; x++) {
	        formElements.push(selects[x]);
	    }
	    for (var x = 0; textareas.length > x; x++) {
	        formElements.push(textareas[x]);
	    }
	}
	return formElements;
}
/**
* Gets all the form elements (input,select,textarea) 
* within an object and returns them as a URI ready string 
* @function
* @public
* @name Rendition.UI.getNodeInputsAsString
* @param {Native.Object} obj The DHTML element.
* @returns {Native.undefined}
*/
Rendition.UI.getNodeInputsAsString = function (obj) {
	if (obj) {
	    var returnString = '';
	    var inputs = obj.getElementsByTagName('input');
	    var selects = obj.getElementsByTagName('select');
	    var textareas = obj.getElementsByTagName('textarea');
	    var formElements = [];
	    for (var x = 0; inputs.length > x; x++) {
	        formElements.push(inputs[x]);
	    }
	    for (var x = 0; selects.length > x; x++) {
	        formElements.push(selects[x]);
	    }
	    for (var x = 0; textareas.length > x; x++) {
	        formElements.push(textareas[x]);
	    }
	    for (var i = formElements.length - 1; i >= 0; --i) {
	        if (formElements[i].type === 'checkbox') {
	            returnString += '&';
	            if (formElements[i].checked) {
	                returnString += escape(formElements[i].name) + '=on';
	            } else {
	                returnString += escape(formElements[i].name) + '=';
	            }
	        } else if (formElements[i].type == 'radio') {
	            if (formElements[i].checked) {
	                returnString += '&';
	                returnString += escape(formElements[i].name) + '=' + escape(formElements[i].value)
	            }
	        } else if (formElements[i].type == 'button') {

	        } else {
	            returnString += '&'
	            returnString += escape(formElements[i].name) + '=' + escape(formElements[i].value);
	        }
	    }
	    return returnString;
	} else {
	    return null;
	}
}
/**
* Sets an element's text ect unselectable for use in dragging elements.
* @function
* @public
* @name Rendition.UI.makeUnselectable
* @param {Native.Object} obj The DHTML element.
* @returns undefined
*/
Rendition.UI.makeUnselectable = function(obj){
    if (typeof obj.style.MozUserSelect != 'undefined') {
        obj.style.MozUserSelect = 'none';
    } else if (typeof obj.style.webkitTouchCallout != 'undefined') {
        obj.style.webkitTouchCallout = 'none';
    } else if (typeof obj.style.webkitUserSelect != 'undefined') {
        obj.style.webkitUserSelect = 'none';
    } else if (typeof obj.style.khtmlUserSelect != 'undefined') {
        obj.style.khtmlUserSelect = 'none';
    } else if (typeof obj.style.khtmlUserSelect != 'undefined') {
        obj.style.khtmlUserSelect = 'none';
    } else if (typeof obj.style.msUserSelect != 'undefined') {
        obj.style.msUserSelect = 'none';
    } else if (typeof obj.style.userSelect != 'undefined') {
        obj.style.userSelect = 'none';
    } else {
        obj.onselectstart = function () { return false; }
    }
}
/**
* Gets the position of an element.  
* Return the offset position + scroll position for position:absolute elements.
* @function
* @public
* @name Rendition.UI.getPosition
* @param {Native.Object} obj The DHTML element.
* @returns {Native.Object} Returns { x: Integer, y: Integer }
*/
Rendition.UI.getPosition = function (e) {
	var eleft = 0;
	var etop = 0;
	while (e.offsetParent) {
	    eleft += e.offsetLeft;
	    etop += e.offsetTop;
	    eleft -= e.scrollLeft;
	    etop -= e.scrollTop;
	    e = e.offsetParent;
	}
	return { x: eleft, y: etop }
}
/**
* Gets the absolute position of an element within an absolutely or fixed positioned element.  
* @function
* @public
* @name Rendition.UI.getPositionUntilAbsolute
* @param {Native.Object} e The DHTML element.
* @returns {Native.undefined}
*/
Rendition.UI.getPositionUntilAbsolute = function (e) {
	var eleft = 0;
	var etop = 0;
	while (e.offsetParent) {
	    if (e.style.position == 'absolute' || e.style.position == 'fixed') {
	        break;
	    }
	    eleft += e.offsetLeft;
	    etop += e.offsetTop;
	    eleft -= e.scrollLeft;
	    etop -= e.scrollTop;
	    e = e.offsetParent;
	}
	return { x: eleft, y: etop }
}
/**
* Fills a DHTML select element with the values in an array.
* @function
* @public
* @name Rendition.UI.fillSelect
* @param {Native.DHTMLElement} selectElement The DHTML select element.
* @param {Native.Array} twoDimArray Two dimentional array contaning the option value and the option inner text.  Looks like:
* <code language="JavaScript">
*	var foo = [
*		[1,'Value 1'],
*		[2,'Value 2'],
*		[3,'Value 3']
*	];
* </code>
* @param {Native.Integer} varOrd The index containing the value.
* @param {Native.Integer} textOrd The index containing the inner text.
* @param {Native.Object} selectedValue The selected value.  
* When this value matches any value in the option list
* it will have its 'selected' attribute set to true (i.e. It will be the selected value).
* @returns {Native.Integer} New random number.
*/
Rendition.UI.fillSelect = function (selectElement, twoDimArray, varOrd, textOrd, selectedValue) {
	for (var x = 0; twoDimArray.length > x; x++) {
	    var y = document.createElement('option');
	    y.text = twoDimArray[x][textOrd];
	    y.value = twoDimArray[x][varOrd];
	    if (selectedValue == twoDimArray[x][0]) { y.selected = true }
	    selectElement.add(y, null);
	}
}
    /**
* Creates an array of DHTML inputs based on a generic object.  
* Boolean values get turned into checkboxes, object gets turned into arrays of inputs. 
* This is a reciprocal function.
* @function
* @depreciated
* @public
* @name Rendition.UI.inputifyStruct
* @param {Native.Object} inputStruct Object to turn into DHTML inputs.
* @returns {Native.Array} Hierarchical array of inputs.
*/
Rendition.UI.inputifyStruct = function (inputStruct) {
	var ord;
	var r = [];
	var length = 0;
	for (ord in inputStruct) {
	    var value = inputStruct[ord];
	    if (typeof (value) == 'boolean') {
	        var i = document.createElement('input');
	        i.type = 'checkbox';
	        i.name = ord;
	        i.checked = inputStruct[ord];
	        r.push(i);
	    } else if (typeof (value) == 'number' || typeof (value) == 'string') {
	        var i = document.createElement('input');
	        i.name = ord;
	        i.value = inputStruct[ord];
	        r.push(i);
	    } else if (typeof (value) == 'object') {
	        r.push(inputifyStruct(inputStruct[ord]));
	    }
	    length++;
	}
	return r;
}
/**
* Pre JSON.Stringify stringify object.  Accepts an object containing DHTML input elements 
* that will be turned into a string of JSON data
* @function
* @public
* @depreciated
* @name Rendition.UI.stringifyInputs
* @param {Native.Object} inputStruct.
* @returns {Native.Array} Hierarchical array of inputs.
*/
Rendition.UI.stringifyInputs = function (inputStruct) {
	var ord;
	var s = [];
	var t = '';
	for (ord in inputStruct) {
	    if (inputStruct[ord].type == 'checkbox') {
	        s.push('"' + ord + '":' + inputStruct[ord].checked + ',');
	    } else if (inputStruct[ord].type !== undefined) {
	        s.push('"' + ord + '":"' + inputStruct[ord].value + '",');
	    }
	}
	if (s.length > 0) {
	    t = s.join('');
	    t = t.substring(1, t.length - 1);
	}
	return '{' + t + '}';
}
/**
* Gets an array of objects that have the specified className attribute.
* @function
* @public
* @name Rendition.UI.getElementsByClass
* @param {Native.String} selClass The class to search for.
* @returns {Native.Array} Array of DHTML elements.
*/
Rendition.UI.getElementsByClass = function (selClass) {
	var returnArray = [];
	var allTags = document.getElementsByTagName('*');
	for (i = 0; i < allTags.length; i++) {
	    if (allTags[i].className === selClass) {
	        returnArray.push(allTags[i]);
	    }
	}
	return returnArray;
}
/**
* Creates a HTML button, quick and easy way.
* @function
* @public
* @name Rendition.UI.button
* @param {Native.Object} args Arguments for this widget.
* @param {Native.Object} args.innerHTML The buttons innerHTML.
* @param {Native.Object} args.onclick The click event for this button.
* @returns {Native.DHTMLElement} The button
*/
Rendition.UI.button = function (args) {
	instance = {}
	instance.button = document.createElement('button');
	if (args.innerHTML !== undefined) {
	    instance.button.innerHTML = args.innerHTML;
	}
	if (args.onclick !== undefined) {
	    Rendition.UI.appendEvent('click', instance.button, args.onclick, false);
	}
	return instance.button;
}
/**
* Gets a given header from an instance of <link xlink:href="Rendition.UI.DataSet"/>.
* @function
* @private
* @param {Native.Object} dataSet The <link xlink:href="Rendition.UI.DataSet"/> instance.
* @param {Native.String} name.
* @name Rendition.UI.getHeaderByName
* @type Native.Object
* @returns <link xlink:href="Rendition.UI.Header"/>.
*/
Rendition.UI.getHeaderByName = function (dataSet, name) {
	var headers = dataSet.header;
	var l = headers.length;
	for (var x = 0; l > x; x++) {
	    if (headers[x].name == name) {
	        var p = { index: x }
	        $.extend(true, p, headers[x]);
	        return p;
	    }
	}
}
/**
* Creates a default row based on a <link xlink:href="Rendition.UI.DataSet"/>'s header.
* @function
* @private
* @param {Native.Object} headers An array of <link xlink:href="Rendition.UI.Header"/> to construct the new row from.
* @param {Native.Object} New record value overrides.  Looks like <code language="JavaScriopt">
*	{
*		columnName1: 'value 1',
*		coulmnName2: 'Value 2'
*	}
* </code>
* @name Rendition.UI.createDefaultRow
* @type Native.Array
* @returns Array of data making up the new row.
*/
Rendition.UI.createDefaultRow = function (headers, newRecord) {
	var instance = {}
	instance.getDefaultRowValue = function (columnName, orginalDefaultValue) {
	    if (newRecord !== undefined) {
	        var l = newRecord.length;
	        var x;
	        for (x in newRecord) {
	            if (x == columnName) {
	                return Rendition.UI.stringOrFunction(newRecord[x], instance, [headers, newRecord]);
	            }
	        }
	    }
	    return orginalDefaultValue;
	}
	var data = [];
	var l = headers.length;
	for (var x = 0; l > x; x++) {
	    var header = headers[x];
	    var defaultValue = instance.getDefaultRowValue(header.name, header.defaultValue);
	    if (String(defaultValue).length > 0) {
	        if (header.dataType == 'money' || header.dataType == 'int' || header.dataType == 'real' || header.dataType == 'float' || header.dataType == 'bigint' || header.dataType == 'timestamp') {
	            data[x] = parseFloat(defaultValue);
	        } else {
	            data[x] = defaultValue;
	        }
	    } else {
	        if (header.dataType == 'bit') {
	            data[x] = false;
	        } else if (header.dataType == 'text' || header.dataType == 'varchar' || header.dataType == 'nchar' || header.dataType == 'char' || header.dataType == 'ntext' || header.dataType == 'nvarchar') {
	            data[x] = '';
	        } else if (header.dataType == 'money' || header.dataType == 'int' || header.dataType == 'real' || header.dataType == 'float' || header.dataType == 'bigint' || header.dataType == 'timestamp') {
	            data[x] = 0;
	        } else if (header.dataType == 'uniqueidentifier') {
	            data[x] = Rendition.UI.createUUID();
	        } else if (header.dataType == 'image' || header.dataType == 'varbinary') {
	            data[x] = null;
	        } else if (header.dataType == 'datetime') {
	            data[x] = Rendition.UI.formatDate(new Date, 'mm/dd/yyyy');
	        }
	    }
	}
	return data;
}
/**
* Gets a column/row value from a <link xlink:href="Rendition.UI.DataSet"/> instance.
* @function
* @private
* @param {Native.Object} dataSet The <link xlink:href="Rendition.UI.DataSet"/> instance.
* @param {Native.String} columnName The name of the column.
* @param {Native.Integer} rowIndex The row index.
* @name Rendition.UI.getColumnByName
* @type Native.Object
* @returns The selected cell value.
*/
Rendition.UI.getColumnByName = function (dataSet, columnName, rowIndex) {
	if (rowIndex === undefined) { rowIndex = 0 }
	var h = Rendition.UI.getHeaderByName(dataSet, columnName);
	if (dataSet.data) {
	    return dataSet.data[rowIndex][h.index];
	} else {
	    return null;
	}
}