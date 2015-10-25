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
/* WIDGIT: CONTEXT MENU STYLE */
/**
* Styling for the <link xlink:href="Rendition.UI.ContextMenu"/> class.
* @constructor
* @name Rendition.UI.ContextMenuStyle
*/
Rendition.UI.ContextMenuStyle = function () {
	var instance = {}
	/**
	* The unique id of this instance.
	* @name ContextMenuStyle.id
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget.  Returns RenditionContextMenuStyle.
	* @name ContextMenuStyle.type
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionContextMenuStyle';
	/**
	* Offset <link xlink:href="Rendition.UI.Rect"/>.  The widget will be drawn offset by the values provided.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.rect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rect = { x: 0, y: 0, h: 0, w: 0 }
	/**
	* Offset <link xlink:href="Rendition.UI.Rect"/> of the child <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.childRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.childRect = { x: 0, y: 0, h: 0, w: 0 }
	/**
	* Size of the maxRect as a <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.maxRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.maxRect = { x: 0, y: 0, h: 0, w: 0 }
	/**
	* Size of the minRect as a <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.minRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.minRect = { x: 0, y: 0, h: 10, w: 250 }
	/**
	* Offset of the contentRect as a <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.contentRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.contentRect = { x: 0, y: 0, h: 0, w: 0 }
	/**
	* Offset and size of the north <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.nRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.nRect = { x: 10, y: 0, h: 4, w: -20 }
	/**
	* Offset and size of the south <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.sRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.sRect = { x: 10, y: 0, h: 4, w: -20 }
	/**
	* Offset and size of the east <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.eRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.eRect = { x: 0, y: 25, h: -45, w: 4 }
	/**
	* Offset and size of the west <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.wRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.wRect = { x: 0, y: 25, h: -45, w: 4 }
	/**
	* Offset and size of the north west <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.nwRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.nwRect = { x: 0, y: 0, h: 25, w: 10 }
	/**
	* Offset and size of the north east <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.neRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.neRect = { x: 0, y: 0, h: 25, w: 10 }
	/**
	* Offset and size of the south east <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.seRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.seRect = { x: 0, y: 0, h: 20, w: 10 }
	/**
	* Offset and size of the south west <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.swRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.swRect = { x: 0, y: 0, h: 20, w: 10 }
	/**
	* Down arrow <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.downRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.downRect = { x: 0, y: 0, h: 10, w: 10 }
	/**
	* Up arrow <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.upRect
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.upRect = { x: 0, y: 0, h: 10, w: 10 }
	/**
	* Amount to reduce from the top or bottom of the context menu as a <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name ContextMenuStyle.scrollOffset
	* @memberOf Rendition.UI.ContextMenuStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.scrollOffset = { x: 0, y: 0, h: -28, w: 0 }
	/**
	* The CSS background property of the down arrow.
	* @name CutterBarStyle.downBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.downBackground = 'PaleVioletRed';
	/**
	* The CSS background property of the up arrow.
	* @name CutterBarStyle.upBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.upBackground = 'IndianRed';
	/**
	* The CSS background property of the down arrow when disabled.
	* @name CutterBarStyle.downDisabledBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.downDisabledBackground = 'DarkSeaGreen';
	/**
	* The CSS background property of the up arrow when disabled.
	* @name CutterBarStyle.upDisabledBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.upDisabledBackground = 'LawnGreen';
	/**
	* The CSS background property of the menu area.
	* @name CutterBarStyle.menuBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.menuBackground = 'lightblue';
	/**
	* The CSS background property of the content area.
	* @name CutterBarStyle.contentBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.contentBackground = 'lightgreen';
	/**
	* The CSS background property of the north element.
	* @name CutterBarStyle.nBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.nBackground = 'green';
	/**
	* The CSS background property of the south element.
	* @name CutterBarStyle.sBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.sBackground = 'yellow';
	/**
	* The CSS background property of the east element.
	* @name CutterBarStyle.eBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.eBackground = 'brown';
	/**
	* The CSS background property of the west element.
	* @name CutterBarStyle.wBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.wBackground = 'red';
	/**
	* The CSS background property of the north west element.
	* @name CutterBarStyle.nwBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.nwBackground = 'navy';
	/**
	* The CSS background property of the north east element.
	* @name CutterBarStyle.neBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.neBackground = 'teal';
	/**
	* The CSS background property of the south east element.
	* @name CutterBarStyle.seBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.seBackground = 'tan';
	/**
	* The CSS background property of the south west element.
	* @name CutterBarStyle.swBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.swBackground = 'blue';
	/**
	* When true an icon column will be present on the context menu and
	* and elements with icons will have their icons displayed.
	* @name CutterBarStyle.icons
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.icons = true;
	/**
	* Vertical spacing between elements.
	* @name CutterBarStyle.verticalSpacing
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.verticalSpacing = 3;
	/**
	* Horizontal spacing between menus when a child menu spawns.
	* @name CutterBarStyle.horizontalSpacing
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.horizontalSpacing = -6;
	/**
	* 1 = vertical orientation, 0 = horizontal orientation.
	* @name CutterBarStyle.orientation
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.orientation = 1;
	return instance;
}
/* WIDGIT: CONTEXT MENU */
/**
* Creates a DHTML based context or dropdown menu.  
* This class requires an array of <link xlink:href="Rendition.UI.MenuOption"/> Objects.
* The context menu can operate in four modes.
*	<table>
*		<tableHeader>
*			<row>
*				<entry>
*					<para>
*						Mode
*					</para>
*				</entry>
*				<entry>
*					<para>
*						Description
*					</para>
*				</entry>
*			</row>
*		</tableHeader>
*		<row>
*			<entry>
*				<para>
*					mouse
*				</para>
*			</entry>
*			<entry>
*				<para>
*					Causes the context menu to appear where the mouse has just clicked.
*				</para>
*			</entry>
*		</row>
*		<row>
*			<entry>
*				<para>
*					RenditionContextMenu
*				</para>
*			</entry>
*			<entry>
*				<para>
*					Causes the menu to appear as a child of another contextMenu.
*				</para>
*			</entry>
*		</row>
*		<row>
*			<entry>
*				<para>
*					RenditionAutoComplete
*				</para>
*			</entry>
*			<entry>
*				<para>
*					Causes the menu to appear below the input to which it was bound.
*				</para>
*			</entry>
*		</row>
*		<row>
*			<entry>
*				<para>
*					RenditionMenuBar
*				</para>
*			</entry>
*			<entry>
*				<para>
*					Causes the menu to below the element it was bound to.
*				</para>
*			</entry>
*		</row>
*	</table>
* <para>This class registers itself with the <link xlink:href="Rendition.UI.Desktop"/> on which it occured and
* makes sure no other context menus are visible.</para>
* @constructor
* @name Rendition.UI.ContextMenu
* @param {Native.Object} e The browser event object.
* @param {Native.Object} args Parameters for the widget.
* @param {Native.Array} args.elements Array of <link xlink:href="Rendition.UI.MenuOption"/> 
* objects that represent the values in this menu.
* @param {Native.Integer} [args.scrollRate=200] The rate the context menu scrolls when the mouse is over
* the scroll icon.
* @param {Native.Object} [args.elementStyle=Rendition.UI.ContextMenuElementStyle] The style of the menuOption 
* object that belongs to this menu.  An instance of <link xlink:href="Rendition.UI.MenuOptionStyle"/>.
* @param {Native.Object} [args.style=Rendition.UI.contextStyle] The style of the menu.  
* An instance of <link xlink:href="Rendition.UI.ContextMenuStyle"/>.
* @param {Native.DHTMLElement} [args.caller] The DHTML element associated with this menu.
* @param {Native.String} [args.callerType] The type of caller. Can be any one of RenditionDatagridStatus, 
* RenditionContextMenu, RenditionAutoComplete, RenditionMenuBar, mouse or undefined.
* @example /// Create multiple options and bind to the context menu event. ///
* // Create a dialog //
* var foo = Rendition.UI.Dialog();
* // Create a button //
* var bar = document.createElement('button');
* bar.innerHTML = 'Right Click On Me.';
* foo.content.appendChild(bar);
* // Create an array to add the menuOption objects to //
* var options = [];
* options.push(new Rendition.UI.MenuOption({
* 	text:'Tres',
* 	mousedown:function (e, menu) {
* 		alert('Facer possim assum.');
* 	}
* }));
* options.push(new Rendition.UI.MenuOption({
* 	text: 'Quattuor',
* 	hasChildren: true,
* 	mouseover: function (e, menu) {
* 		// Create a child menu //
* 		var childOptions = [];
* 		childOptions.push(new Rendition.UI.MenuOption({
* 			text: 'Quattuor',
* 			mousedown: function (e) {
* 				alert('Eodem modo typi.');
* 			}
* 		}));
* 		var menu = Rendition.UI.ContextMenu(e, {
* 			elements: childOptions,
* 			caller: this,
* 			type: 'RenditionContextMenu'
* 		});
* 		// you need to run this to make sure all menus that are _not_ a ancestor of this menu get closed //
* 		Rendition.UI.closeContextMenus(menu);
* 	}
* }));
* // Create the context menu event on the button element //
* bar.oncontextmenu = function (e) {
* 	var menu = Rendition.UI.ContextMenu(e, {
* 		elements: options,
* 		caller: bar,
* 		type: 'bar'
* 	});
* 	e.preventDefault();
* }
*/
Rendition.UI.ContextMenu = function (e, args) {
    var instance = {}
    instance.index = Rendition.UI.contextMenus.length;
    Rendition.UI.contextMenus.push(instance);
    instance.id = 'uid_' + Rendition.UI.createId();
    instance.ansistorOf = null;
    instance.type = 'RenditionContextMenu';
    instance.rect = { x: 0, y: 0, h: 0, w: 0 }
    instance.topOffset = 0;
    instance.scrollTop = 0;
    instance.scrollLeft = 0;
    instance.leftOffset = 0;
    instance.scroll = false;
    instance.elements = [];
    instance.elementsMaxWidth = 0;
    instance.callerType = args.type;
    instance.readyToClose = false;
    instance.firstRun = null;
    if (args.scrollRate === undefined) {
        args.scrollRate = 200;
    }
    if (args.elementStyle === undefined) {
        args.elementStyle = Rendition.UI.ContextMenuElementStyle;
    }
    if (args.icon === undefined) {
        instance.icon = true;
    } else {
        instance.icon = args.icon;
    }
    if (args.style) {
        instance.style = args.style;
    } else {
        instance.style = Rendition.UI.contextStyle;
    }
    if (args.caller) {
        /* find out who exactly called this menu */
        instance.parentNode = args.caller;
        /* now do somthing for the menubar and somthing different for the context menu */
        if (instance.callerType == 'RenditionDatagridStatus') {
            var pos = Rendition.UI.getPosition(args.caller);
            instance.rect.x = pos.x + instance.style.rect.x;
            instance.rect.y = pos.y + args.caller.offsetHeight + instance.style.rect.y;
        } else if (instance.callerType == 'RenditionContextMenu') {
            var pos = Rendition.UI.getPosition(args.caller.elementText);
            Rendition.UI.closeContextMenus(instance);
            instance.rect.x = pos.x + args.caller.elementText.offsetWidth + instance.style.horizontalSpacing + instance.style.childRect.x;
            instance.rect.y = pos.y + instance.style.childRect.y;
        } else if (instance.callerType == 'RenditionAutoComplete') {
            var pos = Rendition.UI.getPosition(args.caller);
            instance.rect.x = pos.x + instance.style.rect.x;
            instance.rect.y = pos.y + args.caller.offsetHeight + instance.style.rect.y;
        } else if (instance.callerType == 'RenditionMenuBar') {
            var pos = Rendition.UI.getPosition(args.caller.elementText);
            instance.rect.x = pos.x + instance.style.rect.x;
            instance.rect.y = pos.y + args.caller.elementText.offsetHeight + instance.style.rect.y;
        } else if (instance.callerType == 'mouse') {
            pos = Rendition.UI.mouseCoords(e);
            instance.rect.x = pos.x + instance.style.rect.x;
            instance.rect.y = pos.y + instance.style.rect.y;
        } else {
            var pos = Rendition.UI.getPosition(args.caller);
            instance.rect.x = pos.x + instance.style.rect.x;
            instance.rect.y = pos.y + args.caller.offsetHeight + instance.style.rect.y;
        }
    } else {
        alert("No Caller?");
    }
    instance.menu = document.createElement('div');
    instance.menu.style.position = 'absolute';
    instance.content = document.createElement('div');
    instance.content.style.position = 'absolute';
    instance.n = document.createElement('div');
    instance.n.style.position = 'absolute';
    instance.s = document.createElement('div');
    instance.s.style.position = 'absolute';
    instance.e = document.createElement('div');
    instance.e.style.position = 'absolute';
    instance.w = document.createElement('div');
    instance.w.style.position = 'absolute';
    instance.nw = document.createElement('div');
    instance.nw.style.position = 'absolute';
    instance.ne = document.createElement('div');
    instance.ne.style.position = 'absolute';
    instance.se = document.createElement('div');
    instance.se.style.position = 'absolute';
    instance.sw = document.createElement('div');
    instance.sw.style.position = 'absolute';
    instance.menu.appendChild(instance.content);
    instance.menu.appendChild(instance.n);
    instance.menu.appendChild(instance.s);
    instance.menu.appendChild(instance.e);
    instance.menu.appendChild(instance.w);
    instance.menu.appendChild(instance.nw);
    instance.menu.appendChild(instance.sw);
    instance.menu.appendChild(instance.se);
    instance.menu.appendChild(instance.ne);
    instance.scrollMenu = function () {
        instance.rect.h = document.documentElement.clientHeight - 5;
        instance.rect.y = 1;
        var visibleElements = Math.round((instance.rect.h + instance.style.scrollOffset.h) / instance.elements[0].style.centerRect.h);
        instance.scrollup = document.createElement('div');
        instance.scrollup.style.position = 'absolute';
        instance.scrollup.style.top = instance.style.upRect.y + 'px';
        instance.scrollup.style.left = Math.round(instance.rect.w / 2) + instance.style.upRect.x + 'px';
        instance.scrollup.style.width = instance.style.upRect.w + 'px';
        instance.scrollup.style.height = instance.style.upRect.h + 'px';
        instance.scrollup.style.background = instance.style.upDisabledBackground;
        instance.menu.appendChild(instance.scrollup);

        instance.scrolldown = document.createElement('div');
        instance.scrolldown.style.position = 'absolute';
        instance.scrolldown.style.top = instance.rect.h - instance.style.downRect.h + instance.style.downRect.y + 'px';
        instance.scrolldown.style.left = Math.round(instance.rect.w / 2) + instance.style.downRect.x + 'px';
        instance.scrolldown.style.width = instance.style.downRect.w + 'px';
        instance.scrolldown.style.height = instance.style.downRect.h + 'px';
        instance.scrolldown.style.background = instance.style.downBackground;
        instance.menu.appendChild(instance.scrolldown);

        instance.scrolldown.ondblclick = function () { return false; }
        instance.scrollup.ondblclick = function () { return false; }
        instance.scrolldown.mousedown = function () { return false; }
        instance.scrollup.mousedown = function () { return false; }
        instance.eventScrollDown = function (e) {
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
            instance.readyToClose = false;
            if (((instance.scrollTop * -1) / instance.elements[0].style.centerRect.h) > (instance.elements.length - visibleElements + 2)) {
                instance.scrolldown.style.background = instance.style.downDisabledBackground;
                return null;
            }
            instance.scrollup.style.background = instance.style.upBackground;
            instance.scrollTop -= instance.elements[0].style.centerRect.h;
            instance.topOffset = instance.scrollTop;
            for (var x = 0; instance.elements.length > x; x++) {
                instance.elements[parseInt(x)].applyStyle();
            }
            instance.timeup = setTimeout(function () {
                instance.eventScrollDown(e);
            }, args.scrollRate);
            return false;
        }
        Rendition.UI.appendEvent('mouseover', instance.scrolldown, instance.eventScrollDown, true);
        Rendition.UI.appendEvent('mousedown', document.documentElement, function (e) {
            if (instance) { instance.readyToClose = true; }
            Rendition.UI.removeEvent('mousedown', document.documentElement, arguments.callee, false);
        }, false);
        instance.eventScrollUp = function (e) {
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
            instance.readyToClose = false;
            if (instance.scrollTop > -1) {
                instance.scrollup.style.background = instance.style.upDisabledBackground;
                return null;
            }
            instance.scrolldown.style.background = instance.style.downBackground;
            instance.scrollTop += instance.elements[0].style.centerRect.h;
            instance.topOffset = instance.scrollTop;
            for (var x = 0; instance.elements.length > x; x++) {
                instance.elements[parseInt(x)].applyStyle();
            }
            instance.timeup = setTimeout(function () {
                if (instance) {
                    instance.eventScrollUp(e);
                }
            }, args.scrollRate);
            return false;
        }
        Rendition.UI.appendEvent('mouseover', instance.scrollup, instance.eventScrollUp, true);
        Rendition.UI.appendEvent('mouseout', instance.scrollup, function (e) {
            clearTimeout(instance.timeup);
        }, true);
        Rendition.UI.appendEvent('mouseout', instance.scrolldown, function (e) {
            clearTimeout(instance.timeup);
        }, true);
        instance.menu.style.clip = 'rect(0px, ' + instance.rect.w + 'px, ' + instance.rect.h + 'px, 0px)';

    }

    instance.updateRect = function (rect) {
        var height = (instance.elements.length * instance.elements[0].style.centerRect.h) + (instance.elements.length * instance.style.verticalSpacing);
        var width = instance.style.rect.w;
        if (instance.style.minRect.h < height) {
            instance.rect.h = height;
        } else {
            instance.rect.h = instance.style.minRect.h;
        }
        if (instance.style.minRect.w < width) {
            instance.rect.w = width;
        } else {
            instance.rect.w = instance.style.minRect.w;
        }
        if (instance.rect.x + instance.rect.w > document.documentElement.clientWidth) {
            if (instance.parentNode.parentNode.menu) {
                /* this is a child of another menu */
                var p = instance.parentNode.parentNode.menu;
                var pPos = Rendition.UI.getPosition(p);
                instance.rect.x = instance.rect.x - instance.rect.w - p.offsetWidth - (instance.style.horizontalSpacing * -1);
                instance.rect.y = instance.rect.y + 1;
            } else {
                /* this is an independant menu */
                instance.rect.x = document.documentElement.clientWidth - instance.rect.w;
            }
        }
        if (instance.rect.y + instance.rect.h > document.documentElement.clientHeight) {
            if (instance.rect.h > document.documentElement.clientHeight) {
                instance.scrollMenu();
            } else {
                instance.rect.y = instance.rect.y - instance.rect.h;
            }

        } else {
            if (instance.rect.y + instance.rect.h > document.documentElement.clientHeight) {
                instance.rect.y = 5;
            }
        }

        instance.rect.h = instance.rect.h + instance.style.rect.h;
        instance.rect.y = instance.rect.y + instance.style.rect.y;
        instance.rect.x = instance.rect.x + instance.style.rect.x;
        instance.menu.style.top = rect.y + 'px';
        instance.menu.style.left = rect.x + 'px';
        instance.menu.style.width = rect.w + 'px';
        instance.menu.style.height = rect.h + 'px';
        instance.content.style.left = instance.style.contentRect.x + 'px';
        instance.content.style.top = instance.style.contentRect.y + 'px';
        instance.content.style.height = instance.rect.h + instance.style.contentRect.h + 'px';
        instance.content.style.width = instance.rect.w + instance.style.contentRect.w + 'px';
        instance.n.style.width = instance.style.nRect.w + instance.rect.w + 'px';
        instance.e.style.height = instance.style.eRect.h + instance.rect.h + 'px';
        instance.e.style.left = instance.style.eRect.x + instance.rect.w - instance.style.eRect.w + 'px';
        instance.w.style.height = instance.style.wRect.h + instance.rect.h + 'px';
        instance.s.style.width = instance.style.sRect.w + instance.rect.w + 'px';
        instance.s.style.top = instance.style.sRect.y + instance.rect.h - instance.style.sRect.h + 'px';
        instance.ne.style.left = instance.style.neRect.x + instance.rect.w - instance.style.neRect.w + 'px';
        instance.se.style.top = instance.style.seRect.y + instance.rect.h - instance.style.seRect.h + 'px';
        instance.se.style.left = instance.style.seRect.x + instance.rect.w - instance.style.seRect.w + 'px';
        instance.sw.style.top = instance.style.swRect.y + instance.rect.h - instance.style.swRect.h + 'px';
    }
    instance.applyStyle = function () {
        for (var x = 0; instance.elements.length > x; x++) {
            var eleWidth = instance.elements[parseInt(x)].text.length * instance.elements[parseInt(x)].style.xCharToPx;
            if (instance.style.rect.w < eleWidth) {
                instance.style.rect.w = eleWidth;
            }
        }
        for (var x = 0; instance.elements.length > x; x++) {
            instance.elements[parseInt(x)].applyStyle();
        }
        instance.menu.style.background = instance.style.menuBackground;
        instance.content.style.background = instance.style.contentBackground;
        instance.n.style.background = instance.style.nBackground;
        instance.n.style.height = instance.style.nRect.h + 'px';
        instance.e.style.background = instance.style.eBackground;
        instance.e.style.width = instance.style.eRect.w + 'px';
        instance.w.style.background = instance.style.wBackground;
        instance.w.style.width = instance.style.wRect.w + 'px';
        instance.s.style.background = instance.style.sBackground;
        instance.s.style.height = instance.style.sRect.h + 'px';
        instance.nw.style.background = instance.style.nwBackground;
        instance.nw.style.height = instance.style.nwRect.h + 'px';
        instance.nw.style.width = instance.style.nwRect.w + 'px';
        instance.ne.style.background = instance.style.neBackground;
        instance.ne.style.height = instance.style.neRect.h + 'px';
        instance.ne.style.width = instance.style.neRect.w + 'px';
        instance.se.style.background = instance.style.seBackground;
        instance.se.style.height = instance.style.seRect.h + 'px';
        instance.se.style.width = instance.style.seRect.w + 'px';
        instance.sw.style.background = instance.style.swBackground;
        instance.sw.style.height = instance.style.swRect.h + 'px';
        instance.sw.style.width = instance.style.swRect.w + 'px';
        instance.e.style.top = instance.style.eRect.y + 'px';
        instance.w.style.top = instance.style.wRect.y + 'px';
        instance.w.style.left = instance.style.wRect.x + 'px';
        instance.s.style.left = instance.style.sRect.x + 'px';
        instance.nw.style.top = instance.style.nwRect.y + 'px';
        instance.nw.style.left = instance.style.nwRect.x + 'px';
        instance.ne.style.top = instance.style.neRect.y + 'px';
        instance.n.style.top = instance.style.nRect.y + 'px';
        instance.n.style.left = instance.style.nRect.x + 'px';
        instance.sw.style.left = instance.style.swRect.x + 'px';
        instance.updateRect(instance.rect);
    }
    instance.addElement = function (f_aryElement) {
        var element = Rendition.UI.MenuOptionElement({ option: f_aryElement, parentNode: instance, style: Rendition.UI.ContextMenuElementStyle });
        instance.elements.push(element);
    }
    instance.close = function () {
        Rendition.UI.contextMenus[instance.index] = null;
        if (Rendition.UI.deskStyle.animateDialogs == true) {
            $(instance.menu).animate({ opacity: 0, width: '10px', height: '10px' }, 250, 'swing', function () {
                document.body.removeChild(this);
            });
        } else {
            document.body.removeChild(instance.menu);
        }
        Rendition.UI.removeEvent('click', document.documentElement, instance.removecontext, false);
        instance = null;
    }
    instance.firstRun = function () {
        if (instance) {
            instance.readyToClose = true;
            Rendition.UI.removeEvent('mousemove', document.documentElement, instance.firstRun, false);
        }
    }
    instance.removecontext = function () {
        Rendition.UI.closeContextMenus();
    }
    instance.init = function () {
        instance.applyStyle();
        instance.menu.style.zIndex = Rendition.UI.topModalzindex + 1;
        instance.menu.onmousedown = function () { return false; }
        if (typeof instance.menu.style.MozUserSelect != 'undefined') {
            instance.menu.style.MozUserSelect = 'none';
        } else {
            instance.menu.onselectstart = function () { return false; }
        }
        Rendition.UI.appendEvent('mousemove', document.documentElement, instance.firstRun, false);
        Rendition.UI.appendEvent('click', document.documentElement, instance.removecontext, false);
        Rendition.UI.appendEvent('click', instance.menu, instance.clicked = function () { Rendition.UI.closeContextMenus(); }, false);

        if (Rendition.UI.deskStyle.animateDialogs == true) {
            $(instance.menu).animate({ opacity: 0, width: '10px', height: '10px' }, 0, 'swing', function () {
                document.body.appendChild(this);
                $(this).animate({ opacity: 1, width: instance.rect.w + 'px', height: instance.rect.h + 'px' }, 250, 'swing');
            });
        } else {
            document.body.appendChild(instance.menu);
        }
    }
    /* if there were elements in this instance then init now */
    if (args.elements) {
        for (var x = 0; args.elements.length > x; x++) {
            instance.addElement(args.elements[parseInt(x)]);
        }
        instance.init();
    }
    return instance;
}