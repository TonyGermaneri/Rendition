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
* Creates a DHTML based resizeable box with a resizer in the lower right corner.
* Ever want to have a DHTML DIV element that can be resized by the user?
* This widget doesn't work correctly.
* @constructor
* @name Rendition.UI.ResizeableBox
* @param {Native.Object} args Parameters for the <link xlink:href="Rendition.UI.ResizeableBox"/>.
* @param {Native.Integer} [args.height=250] The height of the box.
* @param {Native.Integer} [args.marginTop] The margin-top property in PX.
* @param {Native.Integer} [args.marginRight] The margin-right property in PX.
* @param {Native.Integer} [args.marginLeft] The margin-left property in PX.
* @param {Native.Integer} [args.marginBottom] The margin-bottom property in PX.
* @param {Native.Boolean} [args.verticalOnly=false] Only allow vertical resizing.
* @param {Native.Boolean} [args.horizontalOnly=false] Only allow horizontal resizing.
* @example /// Create a resizeable box ///
* var bar = Rendition.UI.ResizeableBox({
*	resize: function () {
*		bar.box.style.background = '#'+Rendition.UI.getFixedWidthRandomInt(10,6,16);
*	}
* });
bar.box.style.background = 'teal';
document.body.appendChild(bar.box);
*/
Rendition.UI.ResizeableBox = function (args) {
	var instance = {}
	/**
	* The type of widget. Returns RenditionResizeableBox.
	* @name ResizeableBox.type
	* @memberOf Rendition.UI.ResizeableBox.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionResizeableBox';
	/**
	* The unique id of this instance.
	* @name ResizeableBox.id
	* @memberOf Rendition.UI.ResizeableBox.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	instance.defaultHeight = 250;
	/**
	* The DHTML DIV box.  This box should be appended to other DHTML elements or have
	* child DHTML elements appended to it.
	* @name ResizeableBox.box
	* @memberOf Rendition.UI.ResizeableBox.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.box = document.createElement('div');
	instance.box.style.display = 'block';
	if (args.height !== undefined) {
		instance.box.style.height = args.height + 'px';
	} else {
		instance.box.style.height = instance.defaultHeight + 'px';
	}
	if (args.marginTop !== undefined) {
		instance.box.style.marginTop = args.marginTop + 'px';
	}
	if (args.marginRight !== undefined) {
		instance.box.style.marginRight = args.marginRight + 'px';
	}
	if (args.marginLeft !== undefined) {
		instance.box.style.marginLeft = args.marginLeft + 'px';
	}
	if (args.marginBottom !== undefined) {
		instance.box.style.marginBottom = args.marginBottom + 'px';
	}
	/**
	* Used internally to add events used in the arugments of this instance.
	* @function
	* @name ResizeableBox.addInitalEvents
	* @memberOf Rendition.UI.ResizeableBox.prototype
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
	instance.events = {
		resize: instance.addInitalEvents(args.resize)
	}
	/**
	* Attach a procedure to an event.
	* @function
	* @name ResizeableBox.addEventListener
	* @memberOf Rendition.UI.ResizeableBox.prototype
	* @type Native.undefined
	* @param {Native.String} type The type of event to subscribe to.
	* @param {Native.Function} proc The function to call when the event is fired.
	* @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
	* @public
	*/
	instance.addEventListener = function (type, proc, capture) {
		if (instance.events[type]) {
			if (instance.events[type].indexOf(proc) === -1) {
				instance.events[type].push(proc);
			}
		} else {
			instance.log('can\'t attach to event handler ' + type);
		}
		return null;
	}
	/**
	* Removes an event from subscription list.  The [proc] must match exactly the [proc] subscribed with.
	* @function
	* @name ResizeableBox.removeEventListener
	* @memberOf Rendition.UI.ResizeableBox.prototype
	* @type Native.undefined
	* @param {Native.String} type The type of event to subscribe to.
	* @param {Native.Function} proc The function to call when the event is fired.
	* @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
	* @public
	*/
	instance.removeEventListener = function (type, proc, capture) {
		var evts = instance.events[type];
		for (var x = 0; evts.length > x; x++) {
			if (evts[x] === proc) {
				evts.splice(x, 1);
			}
		}
		return null;
	}
	/**
	* Executes event subscriptions.
	* @function
	* @name ResizeableBox.executeEvents
	* @memberOf Rendition.UI.ResizeableBox.prototype
	* @private
	* @returns {Native.Boolean} false if cancel default was called.
	* @param {Native.Array} events to execute.
	* @param {Native.Object} e The DOM event object.
	* @param {Native.DHTMLElement} element the related DHTML element.
	* @param {Native.Array} arguments The arguments to add to the event signature.
	*/
	instance.executeEvents = function (events, e, element, arguments) {
		var fLength = events.length;
		if (fLength < 1) { return false; }
		if (arguments === undefined) { arguments = []; }
		instance.cancelDefault = false;
		arguments.unshift(e, instance, element);
		for (var x = 0; fLength > x; x++) {
			if (events[x] !== undefined) {
				events[x].apply(this, arguments);
			}
		}
		return instance.cancelDefault;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name ResizeableBox.mouseout
	* @memberOf Rendition.UI.ResizeableBox.prototype
	* @type Native.Boolean
	* @param {Native.Object} e The event object.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.mouseout = function (e) {
		document.body.style.cursor = 'auto';
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name ResizeableBox.mousedown
	* @memberOf Rendition.UI.ResizeableBox.prototype
	* @type Native.Boolean
	* @param {Native.Object} e The event object.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.mousedown = function (e) {
		if (instance.hoverObj) {
			instance.mouseStart = Rendition.UI.mouseCoords(e);
			instance.startPos = {
				h: instance.box.offsetHeight,
				w: instance.box.offsetWidth
			}
			Rendition.UI.appendEvent('mousemove', document.documentElement, instance.mousemove, true);
			Rendition.UI.appendEvent('mouseup', document.documentElement, function (e) {
				instance.hoverObj = undefined;
				document.body.style.cursor = 'auto';
				Rendition.UI.removeEvent('mouseup', document.documentElement, arguments.callee, true);
				Rendition.UI.removeEvent('mousemove', document.documentElement, instance.mousemove, true);
			}, true);
		}
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name ResizeableBox.mouseover
	* @memberOf Rendition.UI.ResizeableBox.prototype
	* @type Native.Boolean
	* @param {Native.Object} e The event object.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.mouseover = function (e) {
		var objPos = Rendition.UI.getPosition(instance.box);
		var mouse = Rendition.UI.mouseCoords(e);
		var s = { x: objPos.x + instance.box.offsetWidth - 35, y: objPos.y + instance.box.offsetHeight - 35 }
		if ((mouse.x > s.x) && (mouse.y > s.y)) {
			instance.hoverObj = instance.box;
			if (args.horizontalOnly) {
				document.body.style.cursor = 'ew-resize';
			} else if (args.verticalOnly) {
				document.body.style.cursor = 'ns-resize';	
			}
			if ((!args.verticalOnly) && (!args.horizontalOnly)) {
				document.body.style.cursor = 'se-resize';
			}
			e.stopPropagation();
			return false;
		} else {
			instance.hoverObj = undefined;
			document.body.style.cursor = 'auto';
			return false;
		}
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name ResizeableBox.mousemove
	* @memberOf Rendition.UI.ResizeableBox.prototype
	* @type Native.Boolean
	* @param {Native.Object} e The event object.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.mousemove = function (e) {
		var mouse = Rendition.UI.mouseCoords(e);
		var offset = {
			x: instance.mouseStart.x - mouse.x,
			y: instance.mouseStart.y - mouse.y
		}
		if (args.horizontalOnly) {
			instance.box.style.height = instance.box.parentNode.offsetHeight - 15 + 'px';
		} else {
			instance.box.style.height = instance.startPos.h + (offset.y * -1) + 'px';
		}
		if (args.verticalOnly) {
			instance.box.style.width = instance.box.parentNode.offsetWidth - 15 + 'px';
		} else {
			instance.box.style.width = instance.startPos.w + (offset.x * -1) + 'px';
		}
		instance.resize();
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name ResizeableBox.resize
	* @memberOf Rendition.UI.ResizeableBox.prototype
	* @type Native.Boolean
	* @param {Native.Object} e The event object.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.resize = function (e) {
		if (instance.executeEvents(instance.events.resize, e, instance.content)) { return false }
	}
	/**
	* Starts the widget.  This is run automatcially during instantiation.
	* @function
	* @name ResizeableBox.init
	* @memberOf Rendition.UI.ResizeableBox.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.init = function () {
		Rendition.UI.appendEvent('mousedown', instance.box, instance.mousedown, true);
		Rendition.UI.appendEvent('mouseover', instance.box, instance.mouseover, true);
		Rendition.UI.appendEvent('mouseout', instance.box, instance.mouseout, true);
	}
	instance.init();
	return instance;
}