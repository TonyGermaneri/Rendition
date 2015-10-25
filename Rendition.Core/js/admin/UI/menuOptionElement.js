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
/* WIDGIT: MENU OPTION (for menubar or context menu) */
/**
* Style for the <link xlink:href="Rendition.UI.MenuOptionElement"/>.  The default
* style is Rendition.UI.menuBarElementStyle or Rendition.UI.ContextMenuElementStyle.
* @constructor
* @name Rendition.UI.MenuOptionStyle
*/
Rendition.UI.MenuOptionStyle = function() {
	var instance = {}
	/**
	* The unique id of this instance.
	* @name MenuOptionStyle.id
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of object. Returns RenditionMenuOptionStyle.
	* @name MenuOptionStyle.type
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionMenuOptionStyle';
	/**
	* The number of PX to estimate for each vertical character in the menu options title.
	* @name MenuOptionStyle.xCharToPx
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.xCharToPx = 7;
	/**
	* The number of PX to estimate for each horizontal character in the menu options title.  Not implemented.
	* @name MenuOptionStyle.yCharToPx
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.yCharToPx = 7;
	/**
	* The maximum width of the menu option.
	* @name MenuOptionStyle.maxWidth
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.maxWidth = 250;
	instance.maxChars = instance.maxWidth / instance.xCharToPx;
	/**
	* The height of the center element as a <link xlink:href="Rendition.UI.Rect"/>.
	* @name MenuOptionStyle.centerRect
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.centerRect = { x: 0, y: 0, h: 22, w: 0 }
	/**
	* The height of the left element as a <link xlink:href="Rendition.UI.Rect"/>.
	* @name MenuOptionStyle.leftRect
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.leftRect = { x: 0, y: 0, h: 22, w: 0 }
	/**
	* The height of the right element as a <link xlink:href="Rendition.UI.Rect"/>.
	* @name MenuOptionStyle.rightRect
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.rightRect = { x: 0, y: 0, h: 22, w: 0 }
	/**
	* The height of the text element as a <link xlink:href="Rendition.UI.Rect"/>.
	* @name MenuOptionStyle.textRect
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.textRect = { x: 0, y: 0, h: 22, w: 0 }
	/**
	* The height, width and offset x,y of the child arrow as a <link xlink:href="Rendition.UI.Rect"/>.
	* @name MenuOptionStyle.childArrowRect
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.childArrowRect = { x: 0, y: 0, h: 15, w: 10 }
	/**
	* The height, width and offset x,y of the icon as a <link xlink:href="Rendition.UI.Rect"/>.
	* @name MenuOptionStyle.iconRect
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.iconRect = { x: 0, y: 0, h: 15, w: 15 }
	/**
	* The height, width and offset x,y of the checkbox check as a <link xlink:href="Rendition.UI.Rect"/>.
	* @name MenuOptionStyle.checkRect
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.checkRect = { x: 0, y: 0, h: 15, w: 15 }
	/**
	* The CSS Background property of the checkbox check.
	* @name MenuOptionStyle.checkBackground
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.checkBackground = 'Darkorange';
	/**
	* The CSS Background property of the icon.   Not implemented.
	* @name MenuOptionStyle.iconBackground
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.iconBackground = 'PowderBlue';
	/**
	* The CSS Background property of the icon when the user moves their mouse over it.  Not implemented.
	* @name MenuOptionStyle.iconHoverBackground
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.iconHoverBackground = 'SteelBlue';
	/**
	* The CSS Background property of the child arrow.
	* @name MenuOptionStyle.childArrowBackground
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.childArrowBackground = 'azure';
	/**
	* The CSS Background property center element.
	* @name MenuOptionStyle.centerBackground
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.centerBackground = 'red';
	/**
	* The CSS Background property left element.
	* @name MenuOptionStyle.leftBackground
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.leftBackground = 'blue';
	/**
	* The CSS Background property right element.
	* @name MenuOptionStyle.rightBackground
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rightBackground = 'green';
	/**
	* The CSS Background property center element when the mouse hovers over it.
	* @name MenuOptionStyle.centerHoverBackground
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.centerHoverBackground = 'yellow';
	/**
	* The CSS Background property left element when the mouse hovers over it.
	* @name MenuOptionStyle.leftHoverBackground
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.leftHoverBackground = 'lightblue';
	/**
	* The CSS Background property right element when the mouse hovers over it.
	* @name MenuOptionStyle.rightHoverBackground
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rightHoverBackground = 'lightgreen';
	/**
	* The CSS color property (font color) mouse hovers over the menu option.
	* @name MenuOptionStyle.hoverTextColor
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.hoverTextColor = '#CCC';
	/**
	* The CSS font property of the menu option.
	* @name MenuOptionStyle.font
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.font = 'normal 12px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
	/**
	* The CSS text-align property of the menu option.
	* @name MenuOptionStyle.textAlignment
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.textAlignment = 'left';
	/**
	* The CSS color property (font color).
	* @name MenuOptionStyle.textColor
	* @memberOf Rendition.UI.MenuOptionStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.textColor = '#000';
	return instance;
}
/**
* Menu option element for context menu or menu bar.  
* This class is used internally by the <link xlink:href="Rendition.UI.MenuBar"/> class.
* @constructor
* @name Rendition.UI.MenuOptionElement
*/
Rendition.UI.MenuOptionElement = function (args) {
	var instance = {}
	/**
	* The unique id of this instance.
	* @name MenuOptionElement.id
	* @memberOf Rendition.UI.MenuOptionElement.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget.  Returns RenditionMenuOption.
	* @name MenuOptionElement.type
	* @memberOf Rendition.UI.MenuOptionElement.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionMenuOption';
	instance.parentNode = args.parentNode;
	instance.element = document.createElement('div');
	instance.element.style.position = 'absolute';
	instance.elementLeft = document.createElement('div');
	instance.elementLeft.style.position = 'absolute';
	instance.elementRight = document.createElement('div');
	instance.elementRight.style.position = 'absolute';
	instance.elementCenter = document.createElement('div');
	instance.elementCenter.style.position = 'absolute';
	instance.elementChildArrow = document.createElement('div');
	instance.elementChildArrow.style.position = 'absolute';
	instance.elementText = document.createElement('div');
	instance.icon = document.createElement('div');
	instance.icon.style.position = 'absolute';
	instance.check = document.createElement('div');
	instance.check.style.position = 'absolute';
	instance.check.style.display = 'none';
	instance.check.style.visibility = 'hidden';
	instance.option = args.option;
	instance.elementText.style.position = 'absolute';
	instance.elementText.style.cursor = 'default';
	instance.elementText.style.overflow = 'hidden';
	if (typeof instance.elementText.style.MozUserSelect != 'undefined') {
		instance.elementText.style.MozUserSelect = '-moz-none';
	} else {
		instance.elementText.onselectstart = function () { return false; }
	}
	instance.text = instance.option.text;
	instance.checkstate = false;
	if (args.style !== undefined) {
		instance.style = args.style;
	} else {
        instance.style = Rendition.UI.menuBarElementStyle;
	}
	/**
	* Gets or sets the checked state of .
	* @function
	* @name MenuOptionElement.checked
	* @memberOf Rendition.UI.MenuOptionElement.prototype
	* @public
	* @returns {Native.Boolean} undefined.
	* @param {Native.Boolean} f_bolCheck When a value is provided the check state will be set.
	* when a value is not provided 
	*/
	instance.checked = function (f_bolCheck) {
		if (f_bolCheck === undefined) { return instance.checkstate }
		if (f_bolCheck) {
			instance.checkstate = true;
			instance.check.style.display = 'block';
			instance.check.style.visibility = 'visible';
		} else {
			instance.checkstate = false;
			instance.check.style.display = 'none';
			instance.check.style.visibility = 'hidden';
		}
	}
	/**
	* Used internally to handle hover behaviour for the element.
	* @function
	* @name MenuOptionElement.hover
	* @memberOf Rendition.UI.MenuOptionElement.prototype
	* @private
	* @returns {Native.Boolean} undefined.
	*/
	instance.hover = function () {
		if (instance.style.hasIcon) {
			instance.icon.style.background = instance.style.iconHoverBackground;
		}
		instance.elementLeft.style.background = instance.style.leftHoverBackground;
		instance.elementCenter.style.background = instance.style.centerHoverBackground;
		instance.elementRight.style.background = instance.style.rightHoverBackground;
		instance.elementText.style.color = instance.style.textHoverColor;
	}
	/**
	* Used internally to handle mouseoff behaviour for the element.
	* @function
	* @name MenuOptionElement.blur
	* @memberOf Rendition.UI.MenuOptionElement.prototype
	* @private
	* @returns {Native.Boolean} undefined.
	*/
	instance.blur = function () {
		if (instance.style.hasIcon) {
			instance.icon.style.background = instance.style.iconBackground;
		}
		instance.elementLeft.style.background = instance.style.leftBackground;
		instance.elementCenter.style.background = instance.style.centerBackground;
		instance.elementRight.style.background = instance.style.rightBackground;
		instance.elementText.style.color = instance.style.textColor;
	}
	/**
	* Selects this element in a list of element.
	* @function
	* @name MenuOptionElement.select
	* @memberOf Rendition.UI.MenuOptionElement.prototype
	* @public
	* @returns {Native.Boolean} undefined.
	*/
	instance.select = function () {
		if (instance.style.hasIcon) {
			instance.icon.style.background = instance.style.iconSelectedBackground;
		}
		instance.elementLeft.style.background = instance.style.leftSelectedBackground;
		instance.elementCenter.style.background = instance.style.centerSelectedBackground;
		instance.elementRight.style.background = instance.style.rightSelectedBackground;
		instance.elementText.style.color = instance.style.textSelectedColor;
	}
	/**
	* Applies styling to the element.
	* @function
	* @name MenuOptionElement.applyStyle
	* @memberOf Rendition.UI.MenuOptionElement.prototype
	* @private
	* @returns {Native.Boolean} undefined.
	*/
	instance.applyStyle = function () {
		var height = 0;
		var width = 0;
		width = instance.option.text.length * instance.style.xCharToPx;
		if (instance.parentNode.style.orientation === 1) {
			width = instance.parentNode.style.minRect.w;
		}
		height = instance.style.centerRect.h;
		var iconAdd = 0;
		if (instance.style.hasIcon) {
			iconAdd += (instance.style.iconRect.w + instance.style.iconRect.x);
			instance.icon.style.left = (instance.parentNode.leftOffset + instance.style.iconRect.x) + 'px';
			instance.icon.style.top = (instance.parentNode.topOffset + instance.style.iconRect.y) + 'px';
			instance.icon.style.height = instance.style.iconRect.h + 'px';
			instance.icon.style.width = instance.style.iconRect.w + 'px';
			instance.icon.style.background = instance.style.iconBackground;

			instance.check.style.left = (instance.parentNode.leftOffset + instance.style.checkRect.x) + 'px';
			instance.check.style.top = (instance.parentNode.topOffset + instance.style.checkRect.y) + 'px';
			instance.check.style.height = instance.style.checkRect.h + 'px';
			instance.check.style.width = instance.style.checkRect.w + 'px';
			instance.check.style.background = instance.style.checkBackground;
			if (instance.option.checked) {
				instance.check.style.display = 'block';
				instance.check.style.visibility = 'visible';
			}
		}
		instance.elementLeft.style.left = (instance.parentNode.leftOffset + instance.style.leftRect.x) + 'px';
		instance.elementLeft.style.top = (instance.parentNode.topOffset + instance.style.leftRect.y) + 'px';
		instance.elementLeft.style.height = instance.style.leftRect.h + 'px';
		instance.elementLeft.style.width = instance.style.leftRect.w + 'px';
		instance.elementLeft.style.background = instance.style.leftBackground;
		instance.elementCenter.style.left = (iconAdd + instance.parentNode.leftOffset + instance.style.centerRect.x + instance.style.leftRect.x + instance.style.leftRect.w) + 'px';
		instance.elementCenter.style.top = (instance.parentNode.topOffset + instance.style.centerRect.y) + 'px';
		instance.elementCenter.style.height = instance.style.centerRect.h + 'px';
		if (width + instance.style.centerRect.w > 0) {
			instance.elementCenter.style.width = (width + instance.style.centerRect.w) + 'px';
		} else {
			instance.elementCenter.style.width = '0';
		}
		instance.elementCenter.style.background = instance.style.centerBackground;
		instance.elementRight.style.left = (iconAdd + width + instance.parentNode.leftOffset + instance.style.centerRect.w + instance.style.centerRect.x + instance.style.rightRect.x + instance.style.leftRect.x + instance.style.leftRect.w) + 'px';
		instance.elementRight.style.top = (instance.parentNode.topOffset + instance.style.rightRect.y) + 'px';
		instance.elementRight.style.height = instance.style.rightRect.h + 'px';
		instance.elementRight.style.width = instance.style.rightRect.w + 'px';
		instance.elementRight.style.background = instance.style.rightBackground;
		instance.elementChildArrow.style.left = (iconAdd + width + instance.parentNode.leftOffset + instance.style.centerRect.w + instance.style.centerRect.x + instance.style.childArrowRect.x + instance.style.leftRect.x + instance.style.leftRect.w) + 'px';
		instance.elementChildArrow.style.top = (instance.parentNode.topOffset + instance.style.childArrowRect.y) + 'px';
		instance.elementChildArrow.style.height = instance.style.childArrowRect.h + 'px';
		instance.elementChildArrow.style.width = instance.style.childArrowRect.w + 'px';
		instance.elementChildArrow.style.background = instance.style.childArrowBackground;
		instance.elementText.style.left = (iconAdd + instance.parentNode.leftOffset + instance.style.textRect.x + instance.style.leftRect.x + instance.style.leftRect.w) + 'px';
		instance.elementText.style.top = (instance.parentNode.topOffset + instance.style.textRect.y) + 'px';
		instance.elementText.style.height = instance.style.textRect.h + 'px';
		instance.elementText.style.width = width + instance.style.textRect.w + 'px';
		instance.elementText.style.font = instance.style.font;
		instance.elementText.style.color = instance.style.textColor;
		instance.elementText.style.textAlign = instance.style.textAlignment;
		if (instance.parentNode.style.orientation === 0) {
			instance.parentNode.leftOffset += (iconAdd + instance.parentNode.style.horizontalSpacing + width + instance.style.rightRect.w + instance.style.leftRect.x + instance.style.leftRect.w);
		} else {
			instance.parentNode.topOffset += (instance.parentNode.style.verticalSpacing + height);
		}
		return;
	}
	instance.elementText.appendChild(document.createTextNode(instance.option.text));
	instance.addEventListener = function (type, proc, capture) {
		if (type === 'click') {
			instance.clickevents.push(proc);
		} else if (type === 'mouseup') {
			instance.mouseupevents.push(proc);
		} else if (type === 'mousedown') {
			instance.mousedownevents.push(proc);
		} else if (type === 'mouseout') {
			instance.mouseoutevents.push(proc);
		} else if (type === 'mouseover') {
			instance.mouseoverevents.push(proc);
		}
	}
	/* append events to the text area */
	Rendition.UI.appendEvent('mouseover', instance.element, instance.mousehover = function (e) {
		if (!(e.relatedTarget === instance.elementText || e.relatedTarget === instance.elementRight || e.relatedTarget === instance.elementLeft)) {
			for (var x = 0; instance.option.mouseoverevents.length > x; x++) {
				instance.option.mouseoverevents[x].apply(instance, arguments);
			}
			Rendition.UI.hover(instance);
		}
		return false;
	}, false);
	Rendition.UI.appendEvent('mouseout', instance.element, instance.mousehover = function (e) {
		if (!(e.relatedTarget === instance.elementText || e.relatedTarget === instance.elementRight || e.relatedTarget === instance.elementLeft)) {
			for (var x = 0; instance.option.mouseoutevents.length > x; x++) {
				instance.option.mouseoutevents[x].apply(instance, arguments);
			}
			instance.blur();
		}
		return false;
	}, false);
	Rendition.UI.appendEvent('click', instance.element, instance.onclick = function (e) {
		for (var x = 0; instance.option.clickevents.length > x; x++) {
			instance.option.clickevents[x].apply(instance, arguments);
		}
		return false;
	}, false);
	Rendition.UI.appendEvent('mousedown', instance.element, instance.onmousedown = function (e) {
		for (var x = 0; instance.option.mousedownevents.length > x; x++) {
			instance.option.mousedownevents[x].apply(instance, arguments);
		}
		return false;
	}, false);
	Rendition.UI.appendEvent('mouseup', instance.element, instance.onmouseup = function (e) {
		for (var x = 0; instance.option.mouseupevents.length > x; x++) {
			instance.option.mouseupevents[x].apply(instance, arguments);
		}
		return false;
	}, false);
	instance.element.appendChild(instance.elementLeft);
	instance.element.appendChild(instance.elementRight);
	instance.element.appendChild(instance.icon);
	instance.element.appendChild(instance.check);
	instance.element.appendChild(instance.elementCenter);
	if (instance.option.hasChildren) {
		instance.element.appendChild(instance.elementChildArrow);
	}
	instance.element.appendChild(instance.elementText);
	instance.parentNode.menu.appendChild(instance.element);
	return instance;
}