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
/* WIDGIT: MENU OPTION */
/**
* Creates a <link xlink:href="Rendition.UI.MenuOption"/> for the context menu or the <link xlink:href="Rendition.UI.MenuBar"/> classes.  Like all other Rendition classes, events can be
* passed to the parameter object during instatiation.
* @constructor
* @name Rendition.UI.MenuOption
* @param {Native.Object} args Parameters for the widget.
* @param {Native.Boolean} args.text The text value. This is the text users see.
* @param {Native.Boolean} [args.italic] When true, the text will be italic.
* @param {Native.Boolean} [args.bold] When true, the text will be bold.
* @param {Native.Boolean} [args.underline] When true, the text will be underlined.
* @param {Native.Boolean} [args.disabled] When true, the text will be disabled.
* @param {Native.Boolean} [args.strikethru] When true, the text will have a strike thru the letters.
* @param {Native.String} [args.iconSrc] The URL to the icon image for this menu option.
* @param {Native.String} [args.disabledIconSrc] The URL to the icon image for this menu option when it is disabled.
* @param {Native.Boolean} [args.horizontalRule] When true, this option will be a horizontal rule instead of an option.
* @param {Native.Boolean} [args.checked] When true, the option will have a check next to it.
* @param {Native.Boolean} [args.hasChildren] When true, the option will, depending on the parent class, have an arrorw next to it.
* @param {Native.Integer} [args.shortcutKeyCode] The shortcut key code for this option.  This does nothing.
* @param {Native.String} [args.shortcutKey] The shortcut key for this option.  This does nothing.
* @param {Native.Boolean} [args.hasIcon] When true, the icon defined in [menuOption.iconSrc] will be displayed.  This is dependant on the parent class.
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
Rendition.UI.MenuOption = function (args) {
	args = args === undefined ? {} : args;
	var instance = {}
	/**
	* The unique id of this option.
	* @name MenuOption.id
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget.  Always returns RenditionMenuOption.
	* @name MenuOption.type
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionMenuOption';
	/**
	* The text value.  This is the text users see.
	* @name MenuOption.text
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.text = args.text === undefined ? null : args.text;
	/**
	* Used internally to add events used in the arugments of this instance.
	* @function
	* @name MenuOption.addInitalEvents
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.undefined
	* @param {Native.Function} eventProc The event to add.
	* @private
	*/
	instance.addInitalEvents = function (eventProc) {
		if (eventProc) {
			return [eventProc];
		} else {
			return [];
		}
	}
	/**
	* An array of events.
	* @name MenuOption.clickevents
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.String
	* @private
	* @property
	*/
	instance.clickevents = instance.addInitalEvents(args.click);
	/**
	* An array of events.
	* @name MenuOption.mousedownevents
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.String
	* @private
	* @property
	*/
	instance.mousedownevents = instance.addInitalEvents(args.mousedown);
	/**
	* An array of events.
	* @name MenuOption.mouseupevents
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.String
	* @private
	* @property
	*/
	instance.mouseupevents = instance.addInitalEvents(args.mouseup);
	/**
	* An array of events.
	* @name MenuOption.mouseoverevents
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.String
	* @private
	* @property
	*/
	instance.mouseoverevents = instance.addInitalEvents(args.mouseover);
	/**
	* An array of events.
	* @name MenuOption.mouseoutevents
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.String
	* @private
	* @property
	*/
	instance.mouseoutevents = instance.addInitalEvents(args.mouseout);
	/**
	* When true, the text will be italic.
	* @name MenuOption.italic
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.italic = args.italic === undefined ? false : args.italic;
	/**
	* When true, the text will be bold.
	* @name MenuOption.bold
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.bold = args.bold === undefined ? false : args.bold;
	/**
	* When true, the text will be underlined.
	* @name MenuOption.underline
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.underline = args.underline === undefined ? false : args.underline;
	/**
	* When true, the text will be disabled.
	* @name MenuOption.disabled
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.disabled = args.disabled === undefined ? false : args.disabled;
	/**
	* When true, the text will have a strike thru the letters.
	* @name MenuOption.strikethru
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.strikethru = args.strikethru === undefined ? false : args.strikethru;
	/**
	* The URL to the icon image for this menu option.
	* @name MenuOption.iconSrc
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.iconSrc = args.iconSrc === undefined ? null : args.iconSrc;
	/**
	* The URL to the icon image for this menu option when it is disabled.
	* @name MenuOption.disabledIconSrc
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.disabledIconSrc = args.disabledIconSrc === undefined ? null : args.disabledIconSrc;
	/**
	* When true, this option will be a horizontal rule instead of an option.
	* @name MenuOption.horizontalRule
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.horizontalRule = args.horizontalRule === undefined ? false : args.horizontalRule;
	/**
	* When true, the option will have a check next to it.
	* @name MenuOption.checked
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.checked = args.checked === undefined ? false : args.checked;
	/**
	* When true, the option will, depending on the parent class, have an arrorw next to it.
	* @name MenuOption.hasChildren
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.hasChildren = args.hasChildren === undefined ? false : args.hasChildren;
	/**
	* The shortcut key code for this option.  This does nothing.
	* @name MenuOption.shortcutKeyCode
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Integer
	* @private
	* @property
	*/
	instance.shortcutKeyCode = args.shortcutKeyCode === undefined ? null : args.shortcutKeyCode;
	/**
	* The shortcut key for this option.  This does nothing.
	* @name MenuOption.shortcutKey
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.String
	* @private
	* @property
	*/
	instance.shortcutKey = args.shortcutKey === undefined ? null : args.shortcutKey;
	/**
	* The parent class.  This is either an instance of <link xlink:href="Rendition.UI.MenuBar"/> or <link xlink:href="Rendition.UI.ContextMenu"/>.
	* @name MenuOption.parent
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.parent = null;
	/**
	* When true, the icon defined in [menuOption.iconSrc] will be displayed.  This is dependant on the parent class.
	* @name MenuOption.hasIcon
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Object
	* @private
	* @property
	*/
	instance.hasIcon = args.hasIcon === undefined ? false : args.hasIcon;
	/**
	* Offset x.  How far to the left the element will be rendered off of its calculated center.
	* @name MenuOption.x
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Object
	* @private
	* @property
	*/
	instance.x = 0;
	/**
	* Offset y.  How far from the top the element will be rendered off of its calculated center.
	* @name MenuOption.y
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Object
	* @private
	* @property
	*/
	instance.y = 0;
	/**
	* Offset width.  How much wider than the calculated width this element will be.
	* @name MenuOption.offsetWidth
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Object
	* @private
	* @property
	*/
	instance.offsetWidth = 0;
	/**
	* Offset width.  How much taller than the calculated height this element will be.
	* @name MenuOption.offsetHeight
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.Object
	* @private
	* @property
	*/
	instance.offsetHeight = 0;
	/**
	* Attach a procedure to an event.
	* @function
	* @name MenuOption.addEventListener
	* @memberOf Rendition.UI.MenuOption.prototype
	* @type Native.undefined
	* @param {Native.String} type The type of event to subscribe to.
	* @param {Native.Function} proc The function to call when the event is fired.
	* @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
	* @public
	*/
	instance.addEventListener = function (type, proc, capture) {
		if (type == 'click') {
			instance.clickevents.push(proc);
		} else if (type == 'mouseup') {
			instance.mouseupevents.push(proc);
		} else if (type == 'mousedown') {
			instance.mousedownevents.push(proc);
		} else if (type == 'mouseout') {
			instance.mouseoutevents.push(proc);
		} else if (type == 'mouseover') {
			instance.mouseoverevents.push(proc);
		}
	}
	/**
	* Occurs when the user clicks on the option.
	* @event
	* @name MenuOption.onclick
	* @memberOf Rendition.UI.MenuOption.prototype
	* @public
	* @param {Native.Object} e Browser event object.
	*/
	/**
	* Occurs when the user releases a mouse button on the option.
	* @event
	* @name MenuOption.onmouseup
	* @memberOf Rendition.UI.MenuOption.prototype
	* @public
	* @param {Native.Object} e Browser event object.
	*/
	/**
	* Occurs when the user presses a mouse button on the option.
	* @event
	* @name MenuOption.onmousedown
	* @memberOf Rendition.UI.MenuOption.prototype
	* @public
	* @param {Native.Object} e Browser event object.
	*/
	/**
	* Occurs when the mouse leaves the option.
	* @event
	* @name MenuOption.onmouseout
	* @memberOf Rendition.UI.MenuOption.prototype
	* @public
	* @param {Native.Object} e Browser event object.
	*/
	/**
	* Occurs when the mouse moves over the option.
	* @event
	* @name MenuOption.onmouseover
	* @memberOf Rendition.UI.MenuOption.prototype
	* @public
	* @param {Native.Object} e Browser event object.
	*/
	return instance;
}