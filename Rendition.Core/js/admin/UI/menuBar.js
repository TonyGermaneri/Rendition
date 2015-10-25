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
/* WIDGIT: MENUBARSTYLE */
/**
* Style for the <link xlink:href="Rendition.UI.MenuBar"/>.  The default style
* is Rendition.UI.defaultMenuBarStyle.
* @constructor
* @name Rendition.UI.MenuBarStyle
*/
Rendition.UI.MenuBarStyle = function () {
	var instance = {}
	/**
	* unique id of this object.  Assigned automatcilly in this reg format /uid_UUID/
	* @name MenuBarStyle.id
	* @memberOf Rendition.UI.MenuBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of object.  returns 'RenditionMenuBarStyle'
	* @name MenuBarStyle.type
	* @memberOf Rendition.UI.MenuBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionMenuBarStyle';
	/**
	* The minimum size of the <link xlink:href="Rendition.UI.MenuBar"/> as a <link xlink:href="Rendition.UI.Rect"/>.
	* @name MenuBarStyle.minRect
	* @memberOf Rendition.UI.MenuBarStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.minRect = { x: 0, y: 0, h: 5, w: 5 }
	/**
	* The height of the <link xlink:href="Rendition.UI.MenuBar"/> as a <link xlink:href="Rendition.UI.Rect"/>.
	* @name MenuBarStyle.rect
	* @memberOf Rendition.UI.MenuBarStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.rect = { x: 0, y: 0, h: 25, w: 0 }
	/**
	* the CSS background property of the menu background.
	* when the user hovers over the cell.
	* @name MenuBarStyle.background
	* @memberOf Rendition.UI.MenuBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.background = 'gray';
	/**
	* The horizontal spacing of the <link xlink:href="Rendition.UI.MenuOptionElement"/> elements.
	* @name MenuBarStyle.horizontalSpacing
	* @memberOf Rendition.UI.MenuBarStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.horizontalSpacing = 3;
	/**
	* The vertical spacing of the <link xlink:href="Rendition.UI.MenuOptionElement"/> elements.  Not implemented.
	* @name MenuBarStyle.verticalSpacing
	* @memberOf Rendition.UI.MenuBarStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.verticalSpacing = 3;
	/**
	* The orientation of the menu, vertical or horizontal.  Not implemented.
	* @name MenuBarStyle.orientation
	* @memberOf Rendition.UI.MenuBarStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.orientation = 0;
	return instance;
}
/* WIDGIT: MENUBAR */
/**
* Creates a DHTML based menu bar that contains an array of <link xlink:href="Rendition.UI.MenuOption"/> elements.
* @constructor
* @name Rendition.UI.MenuBar
* @example /// Create a menu bar with a context menu.///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.Grid({
*	objectName: 'items',
*	parentNode: foo.content
*});
* @example /// Create a menu bar with multiple options and context menus. ///
// Create a dialog //
var foo = Rendition.UI.Dialog();
foo.maximize();
// Create an array of elements for the context sub menu		//
var conSubOptions = [];
for (var x = 0; 10 > x; x++) {
	conSubOptions[x] = Rendition.UI.MenuOption;
	conSubOptions[x].text = 'Option ' + x;
	conSubOptions[x].addEventListener('mousedown', function (e) {
		alert(this.option.text);
	}, false);
}
// Create an array of elements for the context menu			//
var conOptions = [];
for (var x = 0; 10 > x; x++) {
	conOptions[x] = Rendition.UI.MenuOption;
	conOptions[x].text = 'Option ' + x;
	conOptions[x].hasChildren = true;
	// when the mouse moves over this element, show the context menu //
	conOptions[x].addEventListener('mouseover', function (e) {
		// Rendition.UI.closeContextMenus closes all context				//
		// menus that are not related to the menu passed as a parameter //
		// In this case we're passing the new menu as the parameter     //
		Rendition.UI.closeContextMenus(new Rendition.UI.ContextMenu(e, {
			elements: conSubOptions,
			caller: this,
			// by changing the type, you can control where the	//
			// context menu appears. 'RenditionContextMenu'		//
			// means appear to the right of the caller element.	//
			type: 'RenditionContextMenu'
		}));
	}, false);
}
// Create an array of elements for the menu bar //
var menuOptions = [];
for (var x = 0; 10 > x; x++) {
	menuOptions[x] = Rendition.UI.MenuOption;
	menuOptions[x].text = 'Option ' + x;
	// When the user clicks the element, display the menu //
	menuOptions[x].addEventListener('mousedown', function (e) {
		new Rendition.UI.ContextMenu(e, {
			elements: conOptions,
			caller: this,
			// by changing the type, you can control where the	//
			// context menu appears. 'RenditionContextMenu'		//
			// means appear below the caller element.			//
			type: 'RenditionMenuBar'
		});
	}, false);
	menuOptions[x].addEventListener('mouseover', function (e) {
		// When a user mouses over an element and a  //
		// context menu is open, create context menu //
		// and close all context menus unrelated to  //
		// the new menu we created using the method  //
		// Rendition.UI.closeContextMenus               //
		if (Rendition.UI.contextMenus.length > 0) {
			Rendition.UI.closeContextMenus(new Rendition.UI.ContextMenu(e, {
				elements: conOptions,
				caller: this,
				type: 'RenditionMenuBar'
			}));
		}
	}, false);
}
// Create the menu bar and add it to the dialog 'foo' //
var bar = Rendition.UI.MenuBar({
	options: menuOptions,
	parentNode: foo.content
});
*/
Rendition.UI.MenuBar = function (args) {
	var instance = {}
	instance.index = Rendition.UI.menuBars.length;
	Rendition.UI.menuBars.push(instance);
	/**
	* The unique id of this instance.
	* @name MenuBar.id
	* @memberOf Rendition.UI.MenuBar.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget.  Returns RenditionMenuBar.
	* @name MenuBar.type
	* @memberOf Rendition.UI.MenuBar.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionMenuBar';
	instance.style = null;
	instance.elements = [];
	instance.leftOffset = 0;
	instance.topOffset = 0;
	instance.menu = document.createElement('div');
	instance.menu.setAttribute('clip', 1);
	instance.menu.setAttribute('menuBar', 1);
	instance.menu.parentObject = instance;
	instance.menu.style.position = 'absolute';
	instance.menu.style.zIndex = '1';
	instance.parentRect = { x: 0, y: 0, h: 0, w: 0 }
	/**
	* Updates the style by applying the CSS values to the DHTML elements.
	* @function
	* @name MenuBar.applyStyle
	* @memberOf Rendition.UI.MenuBar.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.applyStyle = function () {
		instance.leftOffset = 0;
		instance.style = Rendition.UI.defaultMenuBarStyle;
		instance.rect = instance.style.rect;
		instance.menu.style.background = instance.style.background;
		for (var x = 0; x < instance.elements.length; x++) {
			instance.elements[x].applyStyle();
		}
		instance.updateRect();
		return false;
	}
	/**
	* Used interanlly to fire an event procedure.
	* @function
	* @name MenuBar.resize
	* @memberOf Rendition.UI.MenuBar.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.resize = function () {
		instance.applyStyle();
	}
	/**
	* Removes any refrences to this <link xlink:href="Rendition.UI.MenuBar"/> by releasing all resources and
	* getting the object ready for the garbage collector.
	* @function
	* @name MenuBar.dispose
	* @memberOf Rendition.UI.MenuBar.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.dispose = function () {
		if (args.parentNode !== undefined) {
			args.parentNode.removeChild(instance.menu);
		}
		return instance;
	}
	/**
	* Used interanlly to fire an event procedure.
	* @function
	* @name MenuBar.updateRect
	* @memberOf Rendition.UI.MenuBar.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.updateRect = function () {
		instance.parentRect = Rendition.UI.getRect(instance.parentNode);
		instance.menu.style.top = instance.rect.y + 'px';
		instance.menu.style.left = instance.rect.x + 'px';
		instance.menu.style.height = instance.rect.h + 'px';
		instance.menu.style.width = instance.parentRect.w + instance.rect.w + 'px';
	}
	/**
	* Updates all the menu elements by removing the elements and redrawing them from the
	* <link xlink:href="Rendition.UI.MenuOptionElement"/> array.
	* @function
	* @name MenuBar.refreshElements
	* @memberOf Rendition.UI.MenuBar.prototype
	* @public
	* @returns {Native.Object} undefined.
	*/
	instance.refreshElements = function () {
		instance.menu.innerHTML = '';
		for (var x; x < instance.elements.length; x++) {
		    instance.addElement(instance.elements[parseInt(x)]);
		}
	}
	/**
	* Adds a <link xlink:href="Rendition.UI.MenuOptionElement"/> to the <link xlink:href="Rendition.UI.MenuOptionElement"/> array
	* This is the only way to add <link xlink:href="Rendition.UI.MenuOptionElement"/> elements after instantiation.
	* @function
	* @name MenuBar.addElement
	* @memberOf Rendition.UI.MenuBar.prototype
	* @public
	* @returns {Native.Object} undefined.
	*/
	instance.addElement = function (targetElement) {
		var element = Rendition.UI.MenuOptionElement({ option: targetElement, parentNode: instance });
		instance.elements.push(element);
	}
	/**
	* Appends this widget to a DHTML element.
	* @function
	* @name MenuBar.appendTo
	* @memberOf Rendition.UI.MenuBar.prototype
	* @public
	* @returns {Native.Object} undefined.
	*/
	instance.appendTo = function (targetNode) {
		instance.parentNode = targetNode;
		targetNode.appendChild(instance.menu);
		instance.applyStyle();
		Rendition.UI.wireupResizeEvents(instance.resize, instance.parentNode);
	}
	/**
	* Starts the <link xlink:href="Rendition.UI.MenuBar"/>.
	* @function
	* @name MenuBar.initElements
	* @memberOf Rendition.UI.MenuBar.prototype
	* @public
	* @returns {Native.Object} undefined.
	*/
	instance.initElements = function (newElements) {
		var l = newElements.length;
		instance.elements = [];
		instance.menu.innerHTML = '';
		for (var x = 0; l > x; x++) {
			instance.addElement(newElements[parseInt(x)]);
		}
	}
	if (args.options !== undefined) {
		instance.initElements(args.options);
	}
	if (args.parentNode !== undefined) {
		instance.appendTo(args.parentNode);
	}
	return instance;
}
