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
/* WIDGIT: TABBARTABSTYLE */
/**
* Style of the <link xlink:href="Rendition.UI.TabBarTab"/>.
* @constructor
* @name Rendition.UI.TabBarTabStyle
*/
Rendition.UI.TabBarTabStyle = function () {
	var instance = {}
	/**
	* unique id of this object.  Assigned automatcilly in this reg format /uid_UUID/
	* @name TabBarTabStyle.id
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of object.  returns 'RenditionTabBarTabStyle'
	* @name TabBarTabStyle.type
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionTabBarTabStyle';
	/**
	* This rect represents left side of the tab.
	* This object looks like { x: 0, y: 0, h: 26, w: 4 }.
	* @name TabBarTabStyle.tabLeftRect
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.tabLeftRect = { x: 0, y: 0, h: 26, w: 4 }
	/**
	* This rect represents right side of the tab.
	* This object looks like { x: 0, y: 0, h: 26, w: 4 }.
	* @name TabBarTabStyle.tabRightRect
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.tabRightRect = { x: 0, y: 0, h: 26, w: 4 }
	/**
	* This rect represents center of the tab.
	* This object looks like { x: 0, y: 0, h: 26, w: 0 }.
	* @name TabBarTabStyle.tabCenterRect
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.tabCenterRect = { x: 0, y: 0, h: 26, w: 0 }
	/**
	* This rect represents the text area of the tab.
	* This object looks like { x: 0, y: 0, h: 26, w: 0 }.
	* @name TabBarTabStyle.textRect
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.textRect = { x: 0, y: 0, h: 26, w: 0 }
	/* not used */
	instance.maxTabRect = { x: 0, y: 0, h: 0, w: 0 }
	instance.minTabRect = { x: 0, y: 0, h: 0, w: 0 }
	instance.tabBarBackground = 'red';
	/**
	* The CSS background property of the left side.
	* @name TabBarTabStyle.tabLeftBackground
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.tabLeftBackground = 'yellow';
	/**
	* The CSS background property of the right side.
	* @name TabBarTabStyle.tabRightBackground
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.tabRightBackground = 'green';
	/**
	* The CSS background property of the center.
	* @name TabBarTabStyle.tabCenterBackground
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.tabCenterBackground = 'lightblue';
	/**
	* The CSS background property of the left side when the mouse hovers over it.
	* @name TabBarTabStyle.tabLeftHoverBackground
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.tabLeftHoverBackground = 'tan';
	/**
	* The CSS background property of the right side when the mouse hovers over it.
	* @name TabBarTabStyle.tabRightHoverBackground
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.tabRightHoverBackground = 'cyan';
	/**
	* The CSS background property of the center when the mouse hovers over it.
	* @name TabBarTabStyle.tabCenterHoverBackground
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.tabCenterHoverBackground = 'navy';
	/**
	* The CSS background property of the left side when it is the active tab.
	* @name TabBarTabStyle.tabLeftActiveBackground
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.tabLeftActiveBackground = 'red';
	/**
	* The CSS background property of the right side when it is the active tab.
	* @name TabBarTabStyle.tabRightActiveBackground
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.tabRightActiveBackground = 'green';
	/**
	* The CSS background property of the center when it is the active tab.
	* @name TabBarTabStyle.tabCenterActiveBackground
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.tabCenterActiveBackground = 'lightgreen';
	/**
	* The CSS font property of the tab.
	* @name TabBarTabStyle.font
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.font = 'normal 12px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
	/**
	* The CSS color property of the tab (font color).
	* @name TabBarTabStyle.fontColor
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.fontColor = 'black';
	/**
	* The CSS color property of the tab (font color) when the mouse hovers over the tab.
	* @name TabBarTabStyle.fontHoverColor
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.fontHoverColor = 'goldenrod';
	/**
	* The CSS color property of the tab (font color) when the mouse hovers over the tab.
	* @name TabBarTabStyle.fontActiveColor
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.fontActiveColor = 'silver';
	/**
	* The CSS text-align property of the text area of the tab.
	* @name TabBarTabStyle.textAlignment
	* @memberOf Rendition.UI.TabBarTabStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.textAlignment = 'center';
	return instance;
}
/**
* The <link xlink:href="Rendition.UI.TabBarTab"/> is used with the <link xlink:href="Rendition.UI.TabBar"/>
* class.  A <link xlink:href="Rendition.UI.TabBar"/> is made up of an array of 
* <link xlink:href="Rendition.UI.TabBarTab"/> objects defined before the <link xlink:href="Rendition.UI.TabBar"/>
* is instantiated.  Each tab is a seperate DHTML DIV element whose position is controlled  by the
* <link xlink:href="Rendition.UI.TabBar"/>.  When a tab is depressed any initialized tab's
* DHTML content DIV elements, which will henceforth be referred to as content, are moved to top:-10000px, left:-10000px 
* making them invisible to the user while still keeping them in the layout.  
* The active tab, if not already initialized, will then be initialized by having its onload event fired and 
* the content area created. If the tab has previously been initialized (clicked on before) 
* the <legacyItalic>onload event will still fire</legacyItalic>, but the content DHTML DIV element 
* will not be recreated, any children in the content will still be in the content when it is activated. 
* This is important if you have DHTML elements that are being generated and placed into the
* content using the onload function.  If you don't remember that the children are still in the content
* you might duplicate the child elements.  A good way to avoid this is by clearing out the
* content each time the onload event fires via content.innerHTML = ''.
* <alert type="note">The content area is not cleared automatically because you may want to keep the result of a long
* running function in the content between tab refreshes, allowing the user to refresh the data.
* It also leaves the data in the content available for other functions even when the tab is not active.
* </alert>
* <alert type="note">The tab must be active a least once for the content DHTML element of that
* tab to be created.</alert>
* @constructor
* @name Rendition.UI.TabBarTab
* @example /// Create a list of tabs. ///
* // Create a dialog //
* var foo = Rendition.UI.Dialog();
* // Create an array to hold the tabs //
* var options = [];
* // Create a tab and add it to the array //
*	options.push(new Rendition.UI.TabBarTab({
*	title: 'Lorem ipsum',
*	load: function (tab, tabBar, content) {
*		content.innerHTML = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut '+
*		'laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis '+
*		'nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, '+
*		'vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim.';
*	}
* }));
* // Create another tab and add it to the array //
* options.push(new Rendition.UI.TabBarTab({
*	title: 'Nam liber',
*	load: function (tab, tabBar, content) {
*		content.innerHTML = 'Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming '+
*		'id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. '+
*		'Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur '+
*		'mutationem consuetudium lectorum.';
*	}
* }));
* // Create the tab bar and bind it to the dialog //
* var bar = Rendition.UI.TabBar({
*	tabs: options,
*	activeTabIndex: 0,
*	parentNode: foo.content
* });
*/
Rendition.UI.TabBarTab = function (args) {
	var instance = {}
	/**
	* unique id of this object.  Assigned automatcilly in this reg format /uid_UUID/
	* @name TabBarTab.id
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of object.  returns 'RenditionTabBarTab'
	* @name TabBarTab.type
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionTabBarTab';
	/**
	* The index of this tabBarTab in Rendition.UI.tabBarTabs array.
	* @name TabBarTab.index
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.index = Rendition.UI.tabBars.length;
	Rendition.UI.tabBarTabs.push(instance);
	instance.width = 0;
	/**
	* The title of the tab.
	* @name TabBarTab.title
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.title = '';
	if (args.title !== undefined) {
		instance.title = args.title;
	}
	instance.reqHTTP = null;
	instance.reqEval = null;
	instance.reqEvalProc = null;
	instance.content = function () {
		instance.innerHTML = '';
	}
	instance.onclickevents = [];
	instance.onmouseupevents = [];
	instance.onmousedownevents = [];
	instance.onmouseoutevents = [];
	instance.onmouseoverevents = [];
	instance.afterloadcontentevents = [];
	instance.onloadevents = [];
	instance.onresizeevents = [];
	/**
	* Removes an event from subscription list.  The [proc] must match exactly the [proc] subscribed with.
	* @function
	* @name TabBarTab.removeEventListener
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.undefined
	* @param {Native.String} type The type of event to subscribe to.
	* @param {Native.Function} proc The function to call when the event is fired.
	* @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
	* @public
	*/
	instance.removeEventListener = function (type, proc, capture) {
		return;
	}
	/**
	* Attach a procedure to an event.
	* @function
	* @name TabBarTab.addEventListener
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.undefined
	* @param {Native.String} type The type of event to subscribe to.
	* @param {Native.Function} proc The function to call when the event is fired.
	* @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
	* @public
	*/
	instance.addEventListener = function (type, proc, capture) {
		if (type == 'click') {
			/**
			* Occurs when the user clicks on the <link xlink:href="Rendition.UI.TabBarTab"/>.
			* @event
			* @name TabBarTab.onclick
			* @memberOf Rendition.UI.TabBarTab.prototype
			* @param {Native.Object} tab The <link xlink:href="Rendition.UI.TabBarTab"/> being clicked.
			* @param {Native.Object} tabBar The <link xlink:href="Rendition.UI.TabBar"/> the <link xlink:href="Rendition.UI.TabBarTab"/> belongs to.
			* @param {Native.Object} content The DHTML element that content should be appended to.
			* @public
			*/
			instance.onclickevents.push(proc);
		} else if (type == 'mouseup') {
			/**
			* Occurs when the mouse button is released on the <link xlink:href="Rendition.UI.TabBarTab"/>.
			* @event
			* @name TabBarTab.onmouseup
			* @memberOf Rendition.UI.TabBarTab.prototype
			* @param {Native.Object} tab The <link xlink:href="Rendition.UI.TabBarTab"/> being clicked.
			* @param {Native.Object} tabBar The <link xlink:href="Rendition.UI.TabBar"/> the <link xlink:href="Rendition.UI.TabBarTab"/> belongs to.
			* @param {Native.Object} content The DHTML element that content should be appended to.
			* @public
			*/
			instance.onmouseupevents.push(proc);
		} else if (type == 'mousedown') {
			/**
			* Occurs when the mouse button is pressed down on the <link xlink:href="Rendition.UI.TabBarTab"/>.
			* @event
			* @name TabBarTab.onmousedown
			* @memberOf Rendition.UI.TabBarTab.prototype
			* @param {Native.Object} tab The <link xlink:href="Rendition.UI.TabBarTab"/> being clicked.
			* @param {Native.Object} tabBar The <link xlink:href="Rendition.UI.TabBar"/> the <link xlink:href="Rendition.UI.TabBarTab"/> belongs to.
			* @param {Native.Object} content The DHTML element that content should be appended to.
			* @public
			*/
			instance.onmousedownevents.push(proc);
		} else if (type == 'mouseout') {
			/**
			* Occurs when the mouse moves out of the <link xlink:href="Rendition.UI.TabBarTab"/>.
			* @event
			* @name TabBarTab.onmouseout
			* @memberOf Rendition.UI.TabBarTab.prototype
			* @param {Native.Object} tab The <link xlink:href="Rendition.UI.TabBarTab"/> being clicked.
			* @param {Native.Object} tabBar The <link xlink:href="Rendition.UI.TabBar"/> the <link xlink:href="Rendition.UI.TabBarTab"/> belongs to.
			* @param {Native.Object} content The DHTML element that content should be appended to.
			* @public
			*/
			instance.onmouseoutevents.push(proc);
		} else if (type == 'load') {
			/**
			* Occurs when the <link xlink:href="Rendition.UI.TabBarTab"/> is finished loading and is ready to accept content.
			* @event
			* @name TabBarTab.onload
			* @memberOf Rendition.UI.TabBarTab.prototype
			* @param {Native.Object} tab The <link xlink:href="Rendition.UI.TabBarTab"/> being clicked.
			* @param {Native.Object} tabBar The <link xlink:href="Rendition.UI.TabBar"/> the <link xlink:href="Rendition.UI.TabBarTab"/> belongs to.
			* @param {Native.Object} content The DHTML element that content should be appended to.
			* @public
			*/
			instance.onloadevents.push(proc);
		} else if (type == 'afterloadcontent') {
			/**
			* Occurs after the remote procdure call has returned.
			* @event
			* @name TabBarTab.onafterloadcontent
			* @memberOf Rendition.UI.TabBarTab.prototype
			* @param {Native.Object} tab The <link xlink:href="Rendition.UI.TabBarTab"/> being clicked.
			* @param {Native.Object} tabBar The <link xlink:href="Rendition.UI.TabBar"/> the <link xlink:href="Rendition.UI.TabBarTab"/> belongs to.
			* @param {Native.Object} content The DHTML element that content should be appended to.
			* @public
			* @depreciated
			*/
			instance.afterloadcontentevents.push(proc);
		} else if (type == 'mouseover') {
			/**
			* Occurs when the mouse moves over of the <link xlink:href="Rendition.UI.TabBarTab"/>.
			* @event
			* @name TabBarTab.onmouseover
			* @memberOf Rendition.UI.TabBarTab.prototype
			* @param {Native.Object} tab The <link xlink:href="Rendition.UI.TabBarTab"/> being clicked.
			* @param {Native.Object} tabBar The <link xlink:href="Rendition.UI.TabBar"/> the <link xlink:href="Rendition.UI.TabBarTab"/> belongs to.
			* @param {Native.Object} content The DHTML element that content should be appended to.
			* @public
			*/
			instance.onmouseoverevents.push(proc);
		} else if (type == 'resize') {
			/**
			* Occurs when the parent <link xlink:href="Rendition.UI.TabBar"/> is resized.
			* @event
			* @name TabBarTab.onresize
			* @memberOf Rendition.UI.TabBarTab.prototype
			* @param {Native.Object} tab The <link xlink:href="Rendition.UI.TabBarTab"/> being clicked.
			* @param {Native.Object} tabBar The <link xlink:href="Rendition.UI.TabBar"/> the <link xlink:href="Rendition.UI.TabBarTab"/> belongs to.
			* @param {Native.Object} content The DHTML element that content should be appended to.
			* @public
			*/
			instance.onresizeevents.push(proc);
		}
	}
	/**
	* The current style.  An instance of <link xlink:href="Rendition.UI.TabBarTab"/>.
	* @name TabBarTab.style
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.style = Rendition.UI.tabElementStyle;
	instance.tabLeft = document.createElement('div');
	instance.tabLeft.style.position = 'absolute';
	instance.tabRight = document.createElement('div');
	instance.tabRight.style.position = 'absolute';
	instance.tabCenter = document.createElement('div');
	instance.tabCenter.style.position = 'absolute';
	instance.tabText = document.createElement('div');
	instance.tabText.style.position = 'absolute';
	instance.tabText.style.cursor = 'default';
	if (typeof instance.tabText.style.MozUserSelect != 'undefined') {
		instance.tabText.style.MozUserSelect = '-moz-none';
	} else {
		instance.tabText.onselectstart = function () { return false; }
	}
	/* append events with addtional appended events */
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TabBarTab.onclick
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.undefined
	* @param {Native.String} ev The browser event object.
	* @private
	*/
	instance.onclick = function (ev) {
		for (var x = 0; instance.onclickevents.length > x; x++) {
			instance.onclickevents[x].apply(instance, arguments);
		}
		instance.activate();
		return false;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TabBarTab.mousedown
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.undefined
	* @param {Native.String} ev The browser event object.
	* @private
	*/
	instance.onmousedown = function (ev) {
		for (var x = 0; instance.onmousedownevents.length > x; x++) {
			instance.onmousedownevents[x].apply(instance, arguments);
		}
		return false;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TabBarTab.onmouseup
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.undefined
	* @param {Native.String} ev The browser event object.
	* @private
	*/
	instance.onmouseup = function (ev) {
		for (var x = 0; instance.onmouseupevents.length > x; x++) {
			instance.onmouseupevents[x].apply(instance, arguments);
		}
		return false;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TabBarTab.onmouseover
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.undefined
	* @param {Native.String} ev The browser event object.
	* @private
	*/
	instance.onmouseover = function (ev) {
		Rendition.UI.hover(instance);
		for (var x = 0; instance.onmouseoverevents.length > x; x++) {
			instance.onmouseoverevents[x].apply(instance, arguments);
		}
		return false;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TabBarTab.onmouseout
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.undefined
	* @param {Native.String} ev The browser event object.
	* @private
	*/
	instance.onmouseout = function (ev) {
		instance.blur();
		for (var x = 0; instance.onmouseoutevents.length > x; x++) {
			instance.onmouseoutevents[x].apply(instance, arguments);
		}
		return false;
	}
	Rendition.UI.appendEvent('mousedown', instance.tabText, instance.onmousedown, false);
	Rendition.UI.appendEvent('mousedown', instance.tabCenter, instance.onmousedown, false);
	Rendition.UI.appendEvent('mouseout', instance.tabText, instance.onmouseout, false);
	Rendition.UI.appendEvent('mouseout', instance.tabCenter, instance.onmouseout, false);
	Rendition.UI.appendEvent('mouseover', instance.tabText, instance.onmouseover, false);
	Rendition.UI.appendEvent('mouseover', instance.tabCenter, instance.onmouseover, false);
	Rendition.UI.appendEvent('click', instance.tabText, instance.onclick, false);
	Rendition.UI.appendEvent('click', instance.tabCenter, instance.onclick, false);
	instance.afterLoadContent = function () {
		return false;
	}
	instance.beforeLoadContent = function () {
		return false;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TabBarTab.loadContent
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.undefined
	* @param {Native.String} ev The browser event object.
	* @private
	*/
	instance.loadContent = function () {
		instance.parentTabBar.content[instance.parentTabBar.activeTabIndex].innerHTML = instance.content.innerHTML;
		for (var x = 0; instance.afterloadcontentevents.length > x; x++) {
			instance.afterloadcontentevents[x].apply(instance, arguments);
		}
		return false;
	}
	/**
	* Appends content to this tab's content DHTML DIV element.
	* @function
	* @name TabBarTab.appendChild
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.undefined
	* @param {Native.DHTMLElement} childElement The DHTML element to append.
	* @public
	*/
	instance.appendChild = function (childElement) {
		instance.parentTabBar.content[instance.parentTabBar.activeTabIndex].appendChild(childElement);
		return false;
	}
	/**
	* Appends the tab to the DTHML <link xlink:href="Rendition.UI.TabBar"/> parent.  This method should only be used 
	* internally by the <link xlink:href="Rendition.UI.TabBar"/> class.
	* @function
	* @name TabBarTab.appendTo
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.undefined
	* @param {Native.DHTMLElement} childElement The DHTML element to append.
	* @private
	*/
	instance.appendTo = function (parentTabBar) {
		instance.parentTabBar = parentTabBar;
		instance.applyStyle();
		instance.parentTabBar.tabBar.appendChild(instance.tabLeft);
		instance.parentTabBar.tabBar.appendChild(instance.tabRight);
		instance.parentTabBar.tabBar.appendChild(instance.tabCenter);
		instance.parentTabBar.tabBar.appendChild(instance.tabText);
	}
	/**
	* Removes the tab from the DTHML <link xlink:href="Rendition.UI.TabBar"/> parent.  This method should only be used 
	* internally by the <link xlink:href="Rendition.UI.TabBar"/> class.
	* @function
	* @name TabBarTab.remove
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @type Native.undefined
	* @param {Native.DHTMLElement} childElement The DHTML element to append.
	* @private
	*/
	instance.remove = function (parentTabBar) {
		instance.parentTabBar = parentTabBar;
		instance.parentTabBar.tabBar.removeChild(instance.tabLeft);
		instance.parentTabBar.tabBar.removeChild(instance.tabRight);
		instance.parentTabBar.tabBar.removeChild(instance.tabCenter);
		instance.parentTabBar.tabBar.removeChild(instance.tabText);
		instance.applyStyle();
	}
	/**
	* Updates the tab by resetting top and left of each of the tab element.
	* This method should only be called by the <link xlink:href="Rendition.UI.TabBar"/> class.
	* @function
	* @name TabBarTab.updateRect
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @returns undefined
	* @private
	*/
	instance.updateRect = function () {
		instance.tabLeft.style.left = instance.parentTabBar.offsetLeft + instance.style.tabLeftRect.x + 'px';
		instance.tabLeft.style.top = instance.style.tabLeftRect.y + 'px';
		instance.tabRight.style.left = instance.parentTabBar.offsetLeft + instance.style.tabRightRect.x + instance.width + instance.style.tabCenterRect.w +
										instance.style.tabCenterRect.x + instance.style.tabLeftRect.x + instance.style.tabLeftRect.w + 'px';
		instance.tabRight.style.top = instance.style.tabRightRect.y + 'px';
		instance.tabCenter.style.left = instance.parentTabBar.offsetLeft + instance.style.tabCenterRect.x + instance.style.tabLeftRect.x + instance.style.tabLeftRect.w + 'px';
		instance.tabCenter.style.top = instance.style.tabCenterRect.y + 'px'
		instance.tabText.style.left = instance.parentTabBar.offsetLeft + instance.style.textRect.x + instance.style.tabLeftRect.x + instance.style.tabLeftRect.w + 'px'
		instance.tabText.style.top = instance.style.textRect.y + 'px';
		instance.resize();
	}
	/**
	* Updates the tab by setting the background,height,width,title,color,font and more of each of the tab element.
	* This method should only be called by the <link xlink:href="Rendition.UI.TabBar"/> class.
	* @function
	* @name TabBarTab.applyStyle
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @returns undefined
	* @private
	*/
	instance.applyStyle = function () {
		instance.width = instance.title.length * instance.parentTabBar.style.charToPx;
		instance.tabText.innerHTML = '';
		instance.tabText.appendChild(document.createTextNode(instance.title));
		instance.tabText.style.width = instance.width + instance.style.textRect.w + 'px';
		instance.tabText.style.height = instance.style.textRect.h + 'px';
		instance.tabLeft.style.width = instance.style.tabLeftRect.w + 'px';
		instance.tabLeft.style.height = instance.style.tabLeftRect.h + 'px';
		instance.tabRight.style.width = instance.style.tabRightRect.w + 'px';
		instance.tabRight.style.height = instance.style.tabRightRect.h + 'px';
		instance.tabCenter.style.width = instance.width + instance.style.tabCenterRect.w + 'px';
		instance.tabCenter.style.height = instance.style.tabCenterRect.h + 'px';
		instance.tabText.style.font = instance.style.font;
		instance.tabText.style.color = instance.style.fontColor;
		instance.tabText.style.textAlign = instance.style.textAlignment;
		instance.tabText.style.background = 'transparent';
		instance.tabCenter.style.background = instance.style.tabCenterBackground;
		instance.tabRight.style.background = instance.style.tabRightBackground;
		instance.tabLeft.style.background = instance.style.tabLeftBackground;
		instance.updateRect();
	}
	/**
	* Activates the tab, firing the load event and the resize event and
	* creating or repositioning this tab's content DHTML element.
	* @function
	* @name TabBarTab.activate
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @returns undefined
	* @private
	*/
	instance.activate = function () {
		if (instance != instance.parentTabBar.activeTab) {
			instance.beforeLoadContent();
			instance.parentTabBar.activeTab = instance;
			instance.activateStyle();
			var l = instance.parentTabBar.tabs.length;
			for (var x = 0; l > x; x++) {
				if (instance.parentTabBar.tabs[x] == instance) {
					instance.parentTabBar.activeTabIndex = x;
					instance.zIndex(l);
				} else {
					instance.parentTabBar.tabs[x].deactivate();
					instance.parentTabBar.tabs[x].zIndex(x);
				}
			}
			var l = instance.parentTabBar.tabs.length;
			for (var x = 0; l > x; x++) {
				instance.parentTabBar.content[x].style.display = 'none';
				instance.parentTabBar.content[x].style.visibility = 'hidden';
			}
			var c = instance.parentTabBar.content[instance.parentTabBar.activeTabIndex];

			c.style.display = 'block';
			c.style.visibility = 'visible';
			c.style.background = instance.parentTabBar.style.contentBackground;
			for (var x = 0; instance.onloadevents.length > x; x++) {
				instance.onloadevents[x].apply(instance, [instance, instance.parentTabBar, c]);
			}
			instance.resize();
			return false;
		}
	}
	/**
	* Fire's the parent <link xlink:href="Rendition.UI.TabBar"/>'s resize event and this tab's resize event.
	* @function
	* @name TabBarTab.resize
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @returns undefined
	* @private
	*/
	instance.resize = function () {
		instance.parentTabBar.resize();
		for (var x = 0; instance.onresizeevents.length > x; x++) {
			instance.onresizeevents[x].apply(instance, [instance.parentTabBar.content[instance.parentTabBar.activeTabIndex]]);
		}
	}
	/**
	* Used inernally by the <link xlink:href="Rendition.UI.TabBar"/> class to set the z-index of this tab bar tab.
	* @function
	* @name TabBarTab.zIndex
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @returns undefined
	* @private
	*/
	instance.zIndex = function (i_zIndex) {
		instance.tabCenter.style.zIndex = i_zIndex;
		instance.tabRight.style.zIndex = i_zIndex;
		instance.tabLeft.style.zIndex = i_zIndex;
		instance.tabText.style.zIndex = i_zIndex;
		return instance;
	}
	/**
	* Used inernally to set this tab's appearance to active.
	* @function
	* @name TabBarTab.activateStyle
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @returns undefined
	* @private
	*/
	instance.activateStyle = function () {
		instance.tabCenter.style.background = instance.style.tabCenterActiveBackground;
		instance.tabRight.style.background = instance.style.tabRightActiveBackground;
		instance.tabLeft.style.background = instance.style.tabLeftActiveBackground;
		instance.tabText.style.color = instance.style.fontActiveColor;
	}
	/**
	* Used inernally to set this tab's appearance to inactive.
	* @function
	* @name TabBarTab.deactivate
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @returns undefined
	* @private
	*/
	instance.deactivate = function () {
		instance.tabCenter.style.background = instance.style.tabCenterBackground;
		instance.tabRight.style.background = instance.style.tabRightBackground;
		instance.tabLeft.style.background = instance.style.tabLeftBackground;
		instance.tabText.style.color = instance.style.fontColor;
		return instance;
	}
	/**
	* Used inernally to set this tab's appearance to hover.
	* @function
	* @name TabBarTab.hover
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @returns undefined
	* @private
	*/
	instance.hover = function () {
		if (instance != instance.parentTabBar.activeTab) {
			instance.tabCenter.style.background = instance.style.tabCenterHoverBackground;
			instance.tabRight.style.background = instance.style.tabRightHoverBackground;
			instance.tabLeft.style.background = instance.style.tabLeftHoverBackground;
			instance.tabText.style.color = instance.style.fontHoverColor;
		}
	}
	/**
	* Used inernally to set this tab's appearance to inactive.
	* @function
	* @name TabBarTab.blur
	* @memberOf Rendition.UI.TabBarTab.prototype
	* @returns undefined
	* @private
	*/
	instance.blur = function () {
		if (instance != instance.parentTabBar.activeTab) {
			instance.tabCenter.style.background = instance.style.tabCenterBackground;
			instance.tabRight.style.background = instance.style.tabRightBackground;
			instance.tabLeft.style.background = instance.style.tabLeftBackground;
			instance.tabText.style.color = instance.style.fontColor;
		}
	}
	if (args.load !== undefined) {
		instance.addEventListener('load', args.load, false);
	}
	return instance;
}