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
* Creates a group box that opens and closes.
* @constructor
* @public
* @name Rendition.UI.GroupBox
* @param {Native.Object} args Parameters for the widget.
* @param {Native.Boolean} [args.alwaysExpanded=false] The groupBox will appear always expanded and cannot be closed.
* @param {Native.Array} [args.childNodes=false] Array of child elements to append to the groupBox.
* @param {String|Function} [args.title] The title of the groupBox.  When a function is passed the function must return a string.  
* @param {Native.DHTMLElement} [args.parentNode] The parent DHTML element to append this groupBox to.
* @returns {Native.Object} <link xlink:href="Rendition.UI.GroupBox"/>.
*/
Rendition.UI.GroupBox = function (args) {
	var instance = {}
	if (args === undefined) { args = {} }
	/**
	* Unique id of this widget.
	* @property
	* @type Native.String
	* @name GroupBox.id
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* Index of this groupBox in the Rendition.UI.groupBoxes array
	* @property
	* @type Native.Integer
	* @name GroupBox.index
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	*/
	instance.index = Rendition.UI.groupBoxes.length;
	Rendition.UI.groupBoxes.push(instance);
	/**
	* List of child elements in this widget.
	* <alert type="note">This only works if you add elements via groupBox.appendChild to add child nodes
	* or child nodes are passed during instantiation.</alert>
	* @property
	* @type Native.Integer
	* @name GroupBox.childNodes
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	*/
	instance.childNodes = [];
	instance.expanded = 1;
	instance.expandEvents = [];
	instance.collapseEvents = [];
	instance.resizeEvents = [];
	instance.hidden = false;
	/**
	* Attach a procedure to an event. 
	* @function
	* @name GroupBox.addEventListener
	* @memberOf Rendition.UI.GroupBox.prototype
	* @type Native.undefined
	* @param {Native.String} type The type of event to subscribe to.
	* @param {Native.Function} proc The function to call when the event is fired.
	* @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
	* @public
	*/
	instance.addEventListener = function (type, proc, capture) {
	    if (type === 'expand') {
	        instance.expandEvents.push(proc);
	    } else if (type === 'collapse') {
	        instance.collapseEvents.push(proc);
	    } else if (type === 'collapse') {
	        instance.resizeEvents.push(proc);
	    }
	    return instance;
	}
	/**
	* Redraw the group box, reapply the style.
	* @function
	* @name GroupBox.resize
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	* @returns undefined.
	*/
	instance.resize = function () {
	    for (var x = 0; instance.resizeEvents.length > x; x++) {
	        instance.resizeEvents[x].apply(this, [instance]);
	    }
	    return instance;
	}
	/**
	* Opens/Closes the group box by setting the 'inner' DIV from hidden/none to visible/block.
	* @function
	* @name GroupBox.expand
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	* @returns undefined.
	*/
	instance.expand = function () {
	    if (args.alwaysExpanded !== undefined) { return instance; }
	    if (instance.expanded === 0) {
	        instance.inner.style.display = 'block';
	        instance.inner.style.visibility = 'visible';
	        instance.expanded = 1;
	        instance.expander.className = 'expander';
	        for (var x = 0; instance.expandEvents.length > x; x++) {
	            instance.expandEvents[x].apply(this, [instance]);
	        }
	    } else {
	        instance.inner.style.display = 'none';
	        instance.inner.style.visibility = 'hidden';
	        instance.expanded = 0;
	        instance.expander.className = 'expander_closed';
	        for (var x = 0; instance.expandEvents.length > x; x++) {
	            instance.collapseEvents[x].apply(this, [instance]);
	        }
	    }
	    return instance;
	}
	/**
	* The expander control arrow that points right or down depending on the toggled state.
	* @property
	* @type Native.DHTMLElement
	* @name GroupBox.expander
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	*/
	instance.expander = document.createElement('div');
	if (args.alwaysExpanded !== undefined) {
	    instance.expander.style.visibility = 'hidden';
	}
	instance.expander.className = 'expander';
	instance.expander.onclick = function () {
	    instance.expand();
	    return instance;
	}
	/**
	* The DIV that holds everything in the group box.
	* @property
	* @name GroupBox.outer
	* @type Native.DHTMLElement
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	*/
	instance.outer = document.createElement('div');
	instance.outer.className = 'groupbox';
	/**
	* The DIV that holds the title text.
	* @property
	* @name GroupBox.tspan
	* @type Native.DHTMLElement
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	*/
	instance.tspan = document.createElement('div');
	instance.tspan.className = 'groupboxtitletext';
	instance.tspan.onclick = function () {
	    instance.expand();
	    return instance;
	}
	/**
	* The inner most DIV, this DIV holds the content of the groupBox.
	* You should use the groupBox.appendChild method to append child element.
	* Don't use this node directly or risk breaking some functionality.
	* @property
	* @name GroupBox.inner
	* @type Native.DHTMLElement
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	*/
	instance.inner = document.createElement('div');
	instance.inner.className = 'groupboxtitle';
	if (Rendition.UI.safari || Rendition.UI.chrome) {
	    instance.inner.style.marginTop = '5px';
	}
	/**
	* Appends a DHTML element to the group box.
	* @function
	* @name GroupBox.appendChild
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	* @returns <link xlink:href="Rendition.UI.GroupBox"/>.
	*/
	instance.appendChild = function (eleToAppend) {
	    instance.childNodes.push(eleToAppend);
	    instance.inner.appendChild(eleToAppend);
	    return instance;
	}
	instance.outer.appendChild(instance.tspan);
	instance.outer.appendChild(instance.expander);
	instance.outer.appendChild(instance.inner);
	if (args.childNodes !== undefined) {
	    for (var x = 0; args.childNodes.length > x; x++) {
	        instance.appendChild(args.childNodes[x]);
	    }
	}
	/**
	* Sets the title of the groupBox.  This can be a string or a function that returns a string.
	* @function
	* @name GroupBox.title
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	* @returns <link xlink:href="Rendition.UI.GroupBox"/>.
	*/
	instance.title = function (objTitle) {
	    if (typeof objTitle === 'string') {
	        instance.tspan.appendChild(Rendition.UI.txt(objTitle));
	    } else {
	        instance.tspan.appendChild(objTitle);
	    }
	    return instance;
	}
	if (args.title !== undefined) {
	    instance.title(args.title);
	}
	/**
	* Hides the group box.
	* @function
	* @name GroupBox.hide
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	* @returns <link xlink:href="Rendition.UI.GroupBox"/>.
	*/
	instance.hide = function () {
	    instance.hidden = true;
	    instance.outer.style.visibility = 'hidden';
	    instance.outer.style.display = 'none';
	    return instance;
	}
	/**
	* Show (unhide) the group box.
	* @function
	* @name GroupBox.show
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	* @returns <link xlink:href="Rendition.UI.GroupBox"/>.
	*/
	instance.show = function () {
	    instance.hidden = false;
	    instance.outer.style.visibility = 'visible';
	    instance.outer.style.display = 'block';
	    return instance;
	}
	/**
	* Toggle the visibility of the groupBox.
	* @function
	* @name GroupBox.toggleVisibility
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	* @returns <link xlink:href="Rendition.UI.GroupBox"/>.
	*/
	instance.toggleVisibility = function () {
	    if (instance.hidden) {
	        instance.show();
	    } else {
	        instance.hide();
	    }
	    return instance;
	}
	/**
	* Appends the groupBox to a parentElement and wires up resize events.
	* @function
	* @name GroupBox.appendTo
	* @memberOf Rendition.UI.GroupBox.prototype
	* @public
	* @returns <link xlink:href="Rendition.UI.GroupBox"/>.
	*/
	instance.appendTo = function (parentNode) {
	    instance.parentNode = parentNode;
	    instance.parentNode.appendChild(instance.outer);
	    Rendition.UI.wireupResizeEvents(instance.resize, instance.parentNode);
	    return instance;
	}
	if (args.parentNode !== undefined) {
	    instance.appendTo(args.parentNode);
	}
	if (args.expanded === false) {
	    instance.expand();
	}
	return instance;
}