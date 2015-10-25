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
* Style of the task bar element.
* @constructor
* @name Rendition.UI.TaskBarElementStyle
*/
Rendition.UI.TaskBarElementStyle = function() {
	var instance = {}
	/**
	* The unique id of this instance.
	* @name TaskBarElementStyle.id
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget.  Returns taskBarElementStyle.
	* @name TaskBarElementStyle.type
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'taskBarElementStyle';
	/**
	* When estimating text length, how many PX per characters should be used.
	* @name TaskBarElementStyle.charToPx
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.charToPx = 7;
	/**
	* The maximum width in PX that the element can be.
	* @name TaskBarElementStyle.maxWidth
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.maxWidth = 250;
	/**
	* The maximum number of visible characters in the element.  This value is calculated:  maxWidth / charToPx.
	* @name TaskBarElementStyle.maxChars
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.Integer
	* @private
	* @property
	*/
	instance.maxChars = instance.maxWidth / instance.charToPx;
	/**
	* This rect represents the text height, the offset left and offset top and the width to add.
	* This object looks like { x: 13, y: 0, h: 20, w: 0 }.
	* @name TaskBarElementStyle.textRect
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.textRect = { x: 13, y: 0, h: 20, w: 0 }
	/**
	* This rect represents the height of the element.
	* This object looks like { x: 0, y: 0, h: 20, w: 0 }.
	* @name TaskBarElementStyle.centerRect
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.centerRect = { x: 0, y: 0, h: 20, w: 0 }
	/**
	* This rect represents the height and width of the left side element.
	* This object looks like { x: 0, y: 0, h: 20, w: 5 }.
	* @name TaskBarElementStyle.leftRect
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.leftRect = { x: 0, y: 0, h: 20, w: 5 }
	/**
	* This rect represents the height and width of the right side element.
	* This object looks like { x: 0, y: 0, h: 20, w: 5 }.
	* @name TaskBarElementStyle.rightRect
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.rightRect = { x: 0, y: 0, h: 20, w: 5 }
	/**
	* The CSS background property of the center element.
	* @name TaskBarElementStyle.centerBackground
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.centerBackground = '#F00';
	/**
	* The CSS background property of the left element.
	* @name TaskBarElementStyle.leftBackground
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.leftBackground = '#700';
	/**
	* The CSS background property of the right element.
	* @name TaskBarElementStyle.rightBackground
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rightBackground = '#FF9';
	/**
	* The CSS background property of the center element when the mouse hovers over it.
	* @name TaskBarElementStyle.centerHoverBackground
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.centerHoverBackground = '#070';
	/**
	* The CSS background property of the left element when the mouse hovers over it.
	* @name TaskBarElementStyle.leftHoverBackground
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.leftHoverBackground = '#00F';
	/**
	* The CSS background property of the right element when the mouse hovers over it.
	* @name TaskBarElementStyle.rightHoverBackground
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rightHoverBackground = '#007';
	/**
	* The CSS font property of the element.
	* @name TaskBarElementStyle.font
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.font = 'normal 12px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
	/**
	* The CSS text-align property of the element.
	* @name TaskBarElementStyle.textAlignment
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.textAlignment = 'left';
	/**
	* The CSS color property of the element text.
	* @name TaskBarElementStyle.textColor
	* @memberOf Rendition.UI.TaskBarElementStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.textColor = '#000';
	return instance;
}
/* WIDGIT: TASKBARELEMENT */
/**
* Creates a task bar element for the task bar.  Elements are automatically added by
* <link xlink:href="Rendition.UI.Desktop"/> when a <link xlink:href="Rendition.UI.Dialog"/>
* is instantiated.
* @param {Native.Object} dialogWindow The <link xlink:href="Rendition.UI.Dialog"/> that represents this instance.  
* @param {Native.Object} objTaskBar The <link xlink:href="Rendition.UI.TaskBar"/> this instance attaches to.  
* @param {Native.Object} objTaskBar The <link xlink:href="Rendition.elementStyle"/> to use.  
* @constructor
* @name Rendition.UI.TaskBarElement
*/
Rendition.UI.TaskBarElement = function(dialogWindow, objTaskBar, elementStyle) {
	var instance = {}
	/**
	* The unique id of this instance.
	* @name TaskBarElement.id
	* @memberOf Rendition.UI.TaskBarElement.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget.  Returns RenditionTaskBarElement.
	* @name TaskBarElement.type
	* @memberOf Rendition.UI.TaskBarElement.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionTaskBarElement';
	instance.text = document.createTextNode(dialogWindow.titleValue);
	instance.width = dialogWindow.titleValue.length * elementStyle.charToPx;
	/**
	* updates the title, clipping and redrawing the text.
	* @function
	* @name TaskBarElement.updatetitle
	* @memberOf Rendition.UI.TaskBarElement.prototype
	* @public
	* @returns undefined.
	*/
	instance.updatetitle = function() {
		if (instance.width > elementStyle.maxWidth) {
			instance.width = elementStyle.maxWidth;
		}
		if (instance.width > objTaskBar.maxWindowWidth) {
			instance.width = objTaskBar.maxWindowWidth;
		}
		var maxChars = instance.width / elementStyle.charToPx;
		if (maxChars < dialogWindow.titleValue.length) {
			instance.text.data = dialogWindow.titleValue.substring(0, maxChars) + '...';
		} else {
			instance.text.data = dialogWindow.titleValue;
		}
	}
	instance.updatetitle();
	/**
	* Activates the element, bringing its <link xlink:href="Rendition.UI.Dialog"/> to the front.
	* @function
	* @name TaskBarElement.onclick
	* @memberOf Rendition.UI.TaskBarElement.prototype
	* @public
	* @returns undefined.
	*/
	instance.onclick = function() {
		if (dialogWindow.windowState == 2) {
			dialogWindow.restore();
		} else {
			if (dialogWindow.isTopmostWindow()) {
				dialogWindow.minimize();
			} else {
				dialogWindow.activate();
			}
		}
		return false;
	}
	instance.dialog = dialogWindow;
	/**
	* The left DHTML div element.
	* @name TaskBarElement.elementLeft
	* @memberOf Rendition.UI.TaskBarElement.prototype
	* @type Native.DHTMLElement
	* @private
	* @property
	*/
	instance.elementLeft = document.createElement('div');
	instance.elementLeft.style.position = 'absolute';
	instance.elementLeft.style.top = elementStyle.leftRect.y + 'px';
	instance.elementLeft.style.left = elementStyle.leftRect.x + objTaskBar.leftOffset + 'px';
	instance.elementLeft.style.width = elementStyle.leftRect.w + 'px';
	instance.elementLeft.style.height = elementStyle.leftRect.h + 'px';
	instance.elementLeft.style.background = elementStyle.leftBackground;
	objTaskBar.content.appendChild(instance.elementLeft);
	Rendition.UI.appendEvent('mousedown', instance.elementLeft, instance.onclick, false);
	/**
	* The right DHTML div element.
	* @name TaskBarElement.elementRight
	* @memberOf Rendition.UI.TaskBarElement.prototype
	* @type Native.DHTMLElement
	* @private
	* @property
	*/
	instance.elementRight = document.createElement('div');
	instance.elementRight.style.position = 'absolute';
	instance.elementRight.style.top = elementStyle.rightRect.y + 'px';
	instance.elementRight.style.left = elementStyle.leftRect.x + objTaskBar.leftOffset + elementStyle.centerRect.w + elementStyle.leftRect.w + instance.width + 'px';
	instance.elementRight.style.width = elementStyle.rightRect.w + 'px';
	instance.elementRight.style.height = elementStyle.rightRect.h + 'px';
	instance.elementRight.style.background = elementStyle.rightBackground;
	objTaskBar.content.appendChild(instance.elementRight);
	Rendition.UI.appendEvent('mousedown', instance.elementRight, instance.onclick, false);
	/**
	* The center DHTML div element.
	* @name TaskBarElement.elementCenter
	* @memberOf Rendition.UI.TaskBarElement.prototype
	* @type Native.DHTMLElement
	* @private
	* @property
	*/
	instance.elementCenter = document.createElement('div');
	instance.elementCenter.style.position = 'absolute';
	instance.elementCenter.style.top = elementStyle.centerRect.y + 'px';
	instance.elementCenter.style.left = elementStyle.centerRect.x + objTaskBar.leftOffset + elementStyle.leftRect.x + elementStyle.leftRect.w + 'px';
	instance.elementCenter.style.width = elementStyle.centerRect.w + instance.width + 'px';
	instance.elementCenter.style.height = elementStyle.centerRect.h + 'px';
	instance.elementCenter.style.background = elementStyle.centerBackground;
	objTaskBar.content.appendChild(instance.elementCenter);
	Rendition.UI.appendEvent('mousedown', instance.elementCenter, instance.onclick, false);
	/**
	* The text holder DHTML div element.
	* @name TaskBarElement.elementText
	* @memberOf Rendition.UI.TaskBarElement.prototype
	* @type Native.DHTMLElement
	* @private
	* @property
	*/
	instance.elementText = document.createElement('div');
	instance.elementText.style.position = 'absolute';
	instance.elementText.style.overflow = 'hidden';
	instance.elementText.style.cursor = 'default';
	instance.elementText.style.top = elementStyle.textRect.y + 'px';
	instance.elementText.style.left = elementStyle.textRect.x + objTaskBar.leftOffset + 'px';
	instance.elementText.style.width = elementStyle.textRect.w + instance.width + 'px';
	instance.elementText.style.height = elementStyle.textRect.h + 'px';
	instance.elementText.style.font = elementStyle.font;
	instance.elementText.style.textAlign = elementStyle.textAlignment;
	objTaskBar.content.appendChild(instance.elementText);
	instance.elementText.appendChild(instance.text);
	Rendition.UI.appendEvent('mousedown', instance.elementText, instance.onclick, false);
	objTaskBar.leftOffset += instance.width + objTaskBar.style.horizontalSpacing + elementStyle.leftRect.w + elementStyle.leftRect.w;
	return instance;
}