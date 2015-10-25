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
/* WIDGIT: TABBARSTYLE */
/**
* Style for the <link xlink:href="Rendition.UI.TabBar"/>.  This includes the background
* behind the tabs, the spacing around the tabs, and the content background, offset rect
* and offset rect for the whole <link xlink:href="Rendition.UI.TabBar"/>.
* @constructor
* @name Rendition.UI.TabBarStyle
*/
Rendition.UI.TabBarStyle = function () {
	var instance = {}
	/**
	* The unique id of this instance.
	* @name TabBarStyle.id
	* @memberOf Rendition.UI.TabBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget.  Returns RenditionTabBarStyle.
	* @name TabBarStyle.type
	* @memberOf Rendition.UI.TabBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionTabBarStyle';
	/**
	* The number of PX to estimate for each character in the tab's title.
	* @name TabBarStyle.charToPx
	* @memberOf Rendition.UI.TabBarStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.charToPx = 8;
	/**
	* The number of PX between each tab.
	* @name TabBarStyle.horizontalSpacing
	* @memberOf Rendition.UI.TabBarStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.horizontalSpacing = 0;
	/**
	* The vertical spacing between each row of tab.  Not implemented.
	* @name TabBarStyle.verticalSpacing
	* @memberOf Rendition.UI.TabBarStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.verticalSpacing = 1;
	/**
	* The offset, and height and width the tab bar.
	* @name TabBarStyle.tabBarRect
	* @memberOf Rendition.UI.TabBarStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.tabBarRect = { x: 0, y: 0, h: 36, w: 0 }
	/**
	* CSS Background property of the area behind the tabs.
	* @name TabBarStyle.tabBarBackground
	* @memberOf Rendition.UI.TabBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.tabBarBackground = 'lavender';
	/**
	* CSS Background property of the content area.
	* @name TabBarStyle.contentBackground
	* @memberOf Rendition.UI.TabBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.contentBackground = 'azure';
	/**
	* The text that appears when the tab bar is awaiting completion of the RPC request.
	* @name TabBarStyle.contentLoadingHTML
	* @memberOf Rendition.UI.TabBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.contentLoadingHTML = 'Loading...';
	/**
	* The offset rect of the content area.
	* @name TabBarStyle.contentRect
	* @memberOf Rendition.UI.TabBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.contentRect = { x: 0, y: 0, h: 0, w: 0 }
	return instance;
}
/* WIDGIT: TABBAR */
/**
* Creates a DHTML based tab bar.
* @constructor
* @name Rendition.UI.TabBar
*/
Rendition.UI.TabBar = function (args) {
	var instance = {}
	/**
	* Active tab index.
	* @name TabBar.activeTabIndex
	* @memberOf Rendition.UI.TabBar.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.activeTabIndex = null;
	f_activeIndex = 0;
	/**
	* The unique id of this instance.
	* @name TabBar.id
	* @memberOf Rendition.UI.TabBar.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget.  Returns RenditionTabBar.
	* @name TabBar.type
	* @memberOf Rendition.UI.TabBar.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionTabBar';
	instance.tabBar = document.createElement('div');
	instance.tabBar.style.position = 'absolute';
	instance.tabBar.style.zIndex = '1';
	instance.content = [];
	/**
	* The current rect of the <link xlink:href="Rendition.UI.TabBar"/>.
	* @name TabBar.rect
	* @memberOf Rendition.UI.TabBar.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rect = { x: 0, y: 0, h: 0, w: 0 }
	instance.offsetLeft = 0;
	instance.offsetTop = 0;
	instance.width = 0;
	instance.height = 0;
	instance.topZindex = 0;
	instance.activeTab = null;
	instance.addY = 0;
	instance.resizeEvents = [];
	instance.style = Rendition.UI.tabStyle;
	/**
	* Appends a DHTML element to the currently active tab's content area.
	* @function
	* @name TabBar.appendChild
	* @memberOf Rendition.UI.TabBar.prototype
	* @type Native.undefined
	* @public
	*/
	instance.appendChild = function (childElement) {
		instance.content[instance.activeTabIndex].appendChild(childElement);
		return false;
	}
	/**
	* Attach a procedure to an event. 
	* @function
	* @name TabBar.addEventListener
	* @memberOf Rendition.UI.TabBar.prototype
	* @type Native.undefined
	* @param {Native.String} type The type of event to subscribe to.
	* @param {Native.Function} proc The function to call when the event is fired.
	* @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
	* @public
	*/
	instance.addEventListener = function (eventtype, proc, capture) {
		if (eventtype == 'resize') {
			instance.resizeEvents.push(proc);
		}
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TabBar.onresize
	* @memberOf Rendition.UI.TabBar.prototype
	* @type Native.Boolean
	* @param {Native.Object} e The event object.
	* @param {Native.DHTMLElement} obj The element related to this event.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.onresize = function (ev) {
		for (var x = 0; instance.resizeEvents.length > x; x++) {
			instance.resizeEvents[x].call(instance, Rendition, instance.desktop);
		}
		return false;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TabBar.resize
	* @memberOf Rendition.UI.TabBar.prototype
	* @param {Native.Object} e The event object.
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.resize = function (e) {
		return instance.updateRect();
	}
	/**
	* Used internally to redraw the tabs on the tab bar.
	* @function
	* @name TabBar.updateTabs
	* @memberOf Rendition.UI.TabBar.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.updateTabs = function () {
		instance.tabBar.innerHTML = '';
		for (var x = 0; instance.tabs.length > x; x++) {
			instance.tabs[x].appendTo(instance);
			instance.tabs[x].applyStyle();
			/* increment the spacing in between the tabs */
			instance.offsetLeft = instance.offsetLeft + instance.tabs[x].width
			+ instance.tabs[x].style.tabLeftRect.w + instance.tabs[x].style.tabLeftRect.x +
			+instance.tabs[x].style.tabCenterRect.w + instance.tabs[x].style.tabCenterRect.x +
			+instance.tabs[x].style.tabRightRect.w + instance.tabs[x].style.tabRightRect.x +
			instance.style.horizontalSpacing;
		}
	}
	/**
	* Used to append this tab bar to a DHTML element.  This is the only
	* way to add the <link xlink:href="Rendition.UI.TabBar"/> to a DHTML 
	* element after instantiation.
	* @function
	* @name TabBar.appendTo
	* @memberOf Rendition.UI.TabBar.prototype
	* @type Native.undefined
	* @public
	*/
	instance.appendTo = function (targetNode) {
		instance.parentNode = targetNode;
		instance.parentNode.appendChild(instance.tabBar);
		var l = instance.tabs.length;
		for (var x = 0; l > x; x++) {
			instance.parentNode.appendChild(instance.content[x]);
		}
		Rendition.UI.wireupResizeEvents(instance.resize, instance.parentNode);
		instance.updateRect();
	}
	/**
	* Updates the tab bar's rect as well as the content rects.
	* @function
	* @name TabBar.updateRect
	* @memberOf Rendition.UI.TabBar.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.updateRect = function () {
		instance.addY = 0;
		if (args.offsetRect !== undefined) {
			instance.addY += args.offsetRect.y;
		}
		instance.width = instance.parentNode.offsetWidth;
		instance.height = instance.parentNode.offsetHeight;
		instance.tabBar.style.top = instance.addY + instance.style.tabBarRect.y + 'px';
		instance.tabBar.style.left = instance.style.tabBarRect.x + 'px';
		instance.tabBar.style.height = instance.style.tabBarRect.h + 'px';
		instance.tabBar.style.width = instance.width + instance.style.tabBarRect.w + 'px';
		var l = instance.tabs.length;
		instance.contentRect = {
			y: instance.addY + instance.style.contentRect.y + instance.style.tabBarRect.h + instance.style.tabBarRect.y,
			x: instance.style.contentRect.x,
			h: instance.style.contentRect.h + instance.height - instance.style.tabBarRect.y - instance.style.tabBarRect.h - instance.addY,
			w: instance.width + instance.style.contentRect.w
		}
		for (var x = 0; l > x; x++) {
			instance.content[x].style.top = instance.contentRect.y + 'px';
			instance.content[x].style.left = instance.contentRect.x + 'px';
			instance.content[x].style.height = instance.contentRect.h + 'px';
			instance.content[x].style.width = instance.contentRect.w + 'px';
		}
		instance.onresize();
	}
	/**
	* Calls updateRect, updateTabs, and applies the style to the content, tabbar baackground and
	* updates the tabBar.rect object.
	* @function
	* @name TabBar.applyStyle
	* @memberOf Rendition.UI.TabBar.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.applyStyle = function () {
		instance.updateRect();
		instance.updateTabs();
		instance.rect.y = instance.tabBar.offsetTop;
		instance.rect.x = instance.tabBar.offsetLeft;
		instance.rect.h = instance.tabBar.offsetHeight;
		instance.rect.w = instance.tabBar.offsetWidth;
		instance.tabBar.style.background = instance.style.tabBarBackground;
		var l = instance.tabs.length;
		for (var x = 0; l > x; x++) {
			instance.content[x].style.background = instance.style.contentBackground;
		}
	}
	/**
	* Adds a <link xlink:href="Rendition.UI.TabBarTab"/> to the <link xlink:href="Rendition.UI.TabBar"/>.
	* @function
	* @name TabBar.addTab
	* @memberOf Rendition.UI.TabBar.prototype
	* @public
	* @returns {Native.Object} undefined.
	*/
	instance.addTab = function (tab) {
		instance.tabs.push(tab);
		tab.appendTo(instance.parentNode);
		tab.applyStyle();
	}
	/**
	* Removes a <link xlink:href="Rendition.UI.TabBarTab"/> from the <link xlink:href="Rendition.UI.TabBar"/>.
	* @function
	* @name TabBar.removeTab
	* @memberOf Rendition.UI.TabBar.prototype
	* @public
	* @returns {Native.Object} undefined.
	*/
	instance.removeTab = function (tabIndex) {
		instance.tabs.splice(tabIndex,1);
		instance.tabs[tabIndex].remove();
		tab.applyStyle();
	}
	/**
	* Starts the <link xlink:href="Rendition.UI.TabBar"/>.
	* When a parentNode is provided in the constructor's
	* arguments, this method is run during instantiation.
	* @function
	* @name TabBar.init
	* @memberOf Rendition.UI.TabBar.prototype
	* @public
	* @returns {Native.Object} undefined.
	*/
	instance.init = function () {
		var l = instance.tabs.length;
		for (var x = 0; l > x; x++) {
			var p = document.createElement('div');
			var tabBarTab = instance.tabs[x];
			Rendition.UI.wireupResizeEvents(function () {
				instance.activeTab.resize();
			}, instance.parentNode);
			p.style.position = 'absolute';
			p.style.visibility = 'hidden';
			p.style.display = 'none';
			p.setAttribute('tabBarTabId', tabBarTab.id);
			p.parentObject = instance;
			p.parent = instance.tabBar;
			instance.content.push(p);
		}
		instance.appendTo(instance.parentNode);
		instance.applyStyle();
		if (args.activeTabIndex !== undefined) {
			instance.tabs[args.activeTabIndex].activate();
		}
	}
	if (args.tabs !== undefined) {
		instance.tabs = args.tabs;
	}
	if (args.parentNode !== undefined) {
		instance.parentNode = args.parentNode;
		instance.init();
	}
	return instance;
}