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
* Styling for the cutterBar.
* @constructor
* @name Rendition.UI.CutterBarStyle
*/
Rendition.UI.CutterBarStyle = function () {
	var instance = {}
	/**
	* The unique id of this instance.
	* @name CutterBarStyle.id
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget.  Returns RenditionCutterBarStyle.
	* @name CutterBarStyle.type
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionCutterBarStyle';
	/**
	* Offset <link xlink:href="Rendition.UI.Rect"/>.  The widget will be drawn offset by the values provided.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name CutterBarStyle.rect
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.rect = { x: 0, y: 0, h: 0, w: 0 }
	/**
	* The CSS background property entire widget.  This cannot be seen unless the
	* child DHTML elements are transparent.
	* @name CutterBarStyle.cutterBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.cutterBackground = 'yellow';
	/**
	* The CSS background property of the left or top element.
	* @name CutterBarStyle.leftTopBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.leftTopBackground = 'blue';
	/**
	* The CSS background property of the bottom or right element.
	* @name CutterBarStyle.rightBottomBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rightBottomBackground = 'green';
	/**
	* The size of the bar between the two elements as a <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 3, w: 3 }.  Only the height or the width
	* of the rect are used.  The height during horizontal mode, the width during vertical mode.
	* @name CutterBarStyle.sizerRect
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.sizerRect = { x: 0, y: 0, h: 3, w: 3 }
	/**
	* The CSS background property of the bar between the two elements when in horizontal mode.
	* @name CutterBarStyle.sizerHBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.sizerHBackground = 'red';
	/**
	* The CSS background property of the bar between the two elements when in vertical mode.
	* @name CutterBarStyle.sizerVBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.sizerVBackground = 'black';
	/**
	* The CSS background property of the maximize button when in vertical mode.
	* @name CutterBarStyle.maxerVBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.maxerVBackground = 'lightgreen';
	/**
	* The height and width of the maximize button 
	* when in vertical mode as a <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 6, w: 25 }.
	* @name CutterBarStyle.maxerVRect
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.maxerVRect = { x: 0, y: 0, h: 6, w: 25 }
	/**
	* The CSS background property of the maximize button when in horizontal mode.
	* @name CutterBarStyle.maxerHBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.maxerHBackground = 'lightgreen';
	/**
	* The height and width of the maximize button
	* when in horizontal mode as a <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 25, w: 6 }.
	* @name CutterBarStyle.maxerHRect
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.maxerHRect = { x: 0, y: 0, h: 25, w: 6 }
	/**
	* The CSS background property of the minimize button when in vertical mode.
	* @name CutterBarStyle.minerVBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.minerVBackground = 'lightblue';
	/**
	* The height and width of the minimize button
	* when in vertical mode as a <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 25, w: 6 }.
	* @name CutterBarStyle.minerVRect
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.minerVRect = { x: 0, y: 0, h: 6, w: 25 }
	/**
	* The CSS background property of the maximize button when in horizontalMode mode.
	* @name CutterBarStyle.minerHBackground
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.minerHBackground = 'lightblue';
	/**
	* The height and width of the minimize button
	* when in horizontal mode as a <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like { x: 0, y: 0, h: 25, w: 6 }.
	* @name CutterBarStyle.minerHRect
	* @memberOf Rendition.UI.CutterBarStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.minerHRect = { x: 0, y: 0, h: 25, w: 6 }
	return instance;
}
/* WIDGIT: CUTTER BAR */
/**
* Creates a DHTML based cutter bar splitting one area into two areas with a resizeable slider. 
* You can change the orientation of the cutterBar from vertical [default] to horizontal.  
* The two sides can be accessed via [cutterBar.cutters] array of DHTML DIV elements.  [0] is the left or top and [1] is the right or bottom.  
* @constructor
* @name Rendition.UI.CutterBar
* @param {Native.Object} args Parameters for the widget.
* @param {Native.Object} [args.offsetRect={x:0,y:0,h:0,y:0}] rect object that looks like this {x:Integer,y:Integer,h:Integer,w:Integer}. 
* This object will offest the size and position of the main container.  This is the best way to distort the size and shape of the widget.
* @param {Native.Integer} [args.orientation=0] 0 = Vertical, 1 = Horizontal.
* @param {Native.Integer} [args.position=Halfway] The position of the cutter in px.  If no value is supplied then the cutter will split the parent object in half.
* @param {Native.DHTMLElement} [args.parentNode] The DOM node this widget will be appended to.
* @param {Native.Boolean} [args.autoResize=true] When true, the aspect ratio of the two sides will stay the same. 
* @param {Native.Boolean} [args.maxer=true] When true, a pair of buttons will appear on the cutter that allow minimize and maximize function.
* @example /// Create a cutter and set the position ///
* 	var bar = Rendition.UI.CutterBar({
*		position: 155,
*		parentNode: document.getElementById('foo')
*	});
* @example /// Create a dialog and add a cutter to it, change the orientation to 1 and set autoResize false. ///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.CutterBar({
*	autoResize: false,
*	orientation: 1,
*	parentNode: foo.content
*});
* @example /// Create a dialog and add a cutter to it, bind a function to the resize event.///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.CutterBar({
*	resize: function (e,cutter) {
*		cutter.cutters[0].innerHTML = (new Date().toString());
*		return;
*	},
*	parentNode: foo.content
*});
* @example /// Create a dialog and add a cutter to it, bind a function to the resize event after the cutter is created. ///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.CutterBar({
*	parentNode: foo.content
*});
*bar.addEventListener('resize', function (e, cutter) {
*	cutter.cutters[0].innerHTML = (new Date().toString());
*	return;
*}, false);
*/
Rendition.UI.CutterBar = function (args) {
	var instance = {}
	instance.parentNode = args.parentNode;
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of object. Returns RenditionCutterBar.
	* @name CutterBar.type
	* @memberOf Rendition.UI.CutterBar.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionCutterBar';
	instance.index = Rendition.UI.cutterBars.length;
	Rendition.UI.cutterBars.push(instance);
	instance.height = 0;
	instance.width = 0;
	instance.previousWidth = 0;
	instance.previousHeight = 0;
	instance.maximizeOffset = 4;
	instance.previousNorm = 0;
	/**
	* The total size of the cutterBar looks like: { x: 0, y: 0, h: 0, w: 0 }.
	* @name CutterBar.rect
	* @memberOf Rendition.UI.CutterBar.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rect = { x: 0, y: 0, h: 0, w: 0 }
	instance.sizerRect = { x: 0, y: 0, h: 0, w: 0 }
	instance.mouseOffset = { x: 0, y: 0 }
	instance.resizeOffset = { x: 0, y: 0, h: 0, w: 0 }
	instance.offsetRect = args.offsetRect || { x: 0, y: 0, h: 0, w: 0 }
	instance.style = Rendition.UI.cutterStyle;
	/**
	* The array of DIV DHTML elements that make up the cutter. Index 0 = left or top, Index 1 = right or bottom.
	* @name CutterBar.cutters
	* @memberOf Rendition.UI.CutterBar.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.cutters = [];
	instance.resizeEvents = [];
	/**
	* The orientation of the cutter. 0 = Vertical, 1 = Horizontal.
	* @name CutterBar._orientation
	* @memberOf Rendition.UI.CutterBar.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance._orientation = args.orientation !== undefined ? args.orientation : 0;
	instance.position = args.position !== undefined ? instance.position = args.position : undefined;
	/*events*/
	/**
	* Executes event subscriptions.
	* @function
	* @name CutterBar.executeEvents
	* @memberOf Rendition.UI.CutterBar.prototype
	* @returns {Native.Boolean} false if cancel default was called.
	* @private
	* @param {Native.Array} events to execute.
	* @param {Native.Object} e The DOM event object.
	* @param {Native.DHTMLElement} element the related DHTML element.
	* @param {Native.Array} evntArg The arguments to add to the event signature.
	*/
	instance.executeEvents = function (events, e, element, arguments) {
		var fLength = events.length;
		if (fLength < 1) { return false; }
		if (arguments === undefined) { arguments = []; }
		instance.cancelDefault = false;
		arguments.unshift(e, instance, element);
		for (var x = 0; fLength > x; x++) {
			events[x].apply(this, arguments);
		}
		return instance.cancelDefault;
	}
	/**
	* Prevent the default event from occuring.  For use within an event handler.
	* @function
	* @name CutterBar.preventDefault
	* @memberOf Rendition.UI.CutterBar.prototype
	* @type Native.undefined
	* @public
	*/
	instance.preventDefault = function () {
		instance.cancelDefault = true;
	}
	/**
	* Attach a procedure to an event.  Usage cutterBar.addEventListener('cellmousedown',function(e,cutter){/*your procedure code},false)
	* @function
	* @name CutterBar.addEventListener
	* @memberOf Rendition.UI.CutterBar.prototype
	* @type Native.undefined
	* @param {Native.String} type The type of event to subscribe to.
	* @param {Native.Function} proc The function to call when the event is fired.
	* @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
	* @public
	*/
	instance.addEventListener = function (type, proc, capture) {
		if (instance.events[type]) {
			if (instance.events[type].indexOf(proc) == -1) {
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
	* @name CutterBar.removeEventListener
	* @memberOf Rendition.UI.CutterBar.prototype
	* @type Native.undefined
	* @param {Native.String} type The type of event to subscribe to.
	* @param {Native.Function} proc The function to call when the event is fired.
	* @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
	* @public
	*/
	instance.removeEventListener = function (type, proc, capture) {
		var evts = instance.events[type];
		for (var x = 0; evts.length > x; x++) {
			if (evts[x] == proc) {
				evts.splice(x, 1);
			}
		}
		return null;
	}
	/**
	* Used internally to add events used in the arugments of this instance.
	* @function
	* @name CutterBar.addInitalEvents
	* @memberOf Rendition.UI.CutterBar.prototype
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
		/**
		* Occurs when the cutter is being resized.
		* @event
		* @name CutterBar.onresize
		* @memberOf Rendition.UI.CutterBar.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Native.Object} cutter The cutter firing the event.
		*/
		resize: instance.addInitalEvents(args.resize)
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name CutterBar.eventlisteners_resize
	* @type Native.Boolean
	* @param {Native.Object} e The event object.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	* @memberOf Rendition.UI.CutterBar.prototype
	*/
	instance.eventlisteners_resize = function (e) {
		if (instance.executeEvents(instance.events.resize, e, this)) { return false }
		return true;
	}
	/* methods */
	/**
	* maximizes the cutter setting the position to its maximum.
	* @function
	* @name CutterBar.maximize
	* @memberOf Rendition.UI.CutterBar.prototype
	* @public
	* @returns {Native.Object} cutterBar.
	*/
	instance.maximize = function () {
		if (instance._orientation == 0) {
			if (instance.position != instance.width - instance.maximizeOffset) {
				instance.position = instance.width - instance.maximizeOffset;
			} else {
				instance.position = instance.previousNorm;
			}
		} else {
			if (instance.position != instance.height - instance.maximizeOffset) {
				instance.position = instance.height - instance.maximizeOffset;
			} else {
				instance.position = instance.previousNorm;
			}
		}
		instance.updateRect(false, false);
		return instance;
	}
	/**
	* minimizes the cutter setting the position to its minimum.
	* @function
	* @name CutterBar.minimize
	* @memberOf Rendition.UI.CutterBar.prototype
	* @public
	* @returns {Native.Object} cutterBar.
	*/
	instance.minimize = function () {
		if (instance.position == 0) {
			instance.position = instance.previousNorm;
		} else {
			instance.position = 0;
		}
		instance.updateRect(false, false);
		return instance;
	}
	/**
	* Change the orintation. 0 = Horizontal, 1 = Vertical
	* @function
	* @name CutterBar.orientation
	* @memberOf Rendition.UI.CutterBar.prototype
	* @public
	* @returns {Native.Object} cutterBar.
	*/
	instance.orientation = function (newOrientation) {
		if (newOrientation == 1 || newOrientation == 0) {
			instance._orientation = newOrientation;
			instance.applyStyle();
		}
		return instance;
	}
	/**
	* Used interally to fire resize events
	* @function
	* @name CutterBar.resize
	* @memberOf Rendition.UI.CutterBar.prototype
	* @private
	* @returns {Native.Object} cutterBar.
	*/
	instance.resize = function () {
		instance.applyStyle();
		return instance;
	}
	/**
	* Used interally update DHTML elements.
	* @function
	* @name CutterBar.updateRect
	* @memberOf Rendition.UI.CutterBar.prototype
	* @private
	* @returns {Native.Object} cutterBar.
	*/
	instance.updateRect = function (autoRepositionSizer, preventResizeEvent) {
		if (instance.parentNode === undefined) { return instance }
		autoRepositionSizer = args.autoResize !== undefined ? args.autoResize : true;
		var newpos = 0;
		instance.height = instance.parentNode.offsetHeight + instance.offsetRect.h;
		instance.width = instance.parentNode.offsetWidth + instance.offsetRect.w;
		if (instance.height == 0 || instance.width == 0) {
			return instance;
		}
		instance.cutter.style.top = instance.offsetRect.y + 'px';
		instance.cutter.style.left = instance.offsetRect.x + 'px';
		instance.cutter.style.height = instance.height + 'px';
		instance.cutter.style.width = instance.width + 'px';
		if (instance.position === undefined) {
			if (instance._orientation == 0) {
				instance.position = Math.round(instance.width * .5);
			} else {
				instance.position = Math.round(instance.height * .5);
			}
		}
		if (autoRepositionSizer) {
			if (instance._orientation == 0) {
				if (instance.previousWidth > 0) {
					newpos = instance.position - ((instance.previousWidth - instance.width) * .5);
					if (newpos > 0 && newpos < instance.width - instance.sizerRect.w - 4) {
						instance.position = newpos;
					}
					if (instance.position > instance.width - instance.sizerRect.w - 4) {
						instance.position = instance.width - instance.sizerRect.w - 4;
					}
				}
				instance.previousWidth = instance.width;
			} else {
				if (instance.previousHeight > 0) {
					newpos = instance.position - ((instance.previousHeight - instance.height) * .5);
					if (newpos > 0 && newpos < instance.height - instance.sizerRect.h - 4) {
						instance.position = newpos;
					}
					if (instance.position > instance.height - instance.sizerRect.h - 4) {
						instance.position = instance.height - instance.sizerRect.h - 4;
					}
				}
				instance.previousHeight = instance.height;
			}
		}

		if (instance._orientation == 0) {
			if (instance.position >= instance.width) {
				instance.position = instance.width - 1;
			}
			instance.cutters[0].style.height = instance.height + 'px';
			instance.cutters[0].style.width = instance.position + 'px';
			instance.cutters[1].style.left = (instance.position + instance.style.sizerRect.w) + 'px';
			instance.cutters[1].style.height = instance.height + 'px';
			instance.cutters[1].style.width = (instance.width - instance.position - instance.style.sizerRect.w) + 'px';
			instance.sizer.style.left = (instance.position) + 'px';
			instance.sizer.style.height = instance.height + 'px';
			instance.sizer.style.width = instance.style.sizerRect.w + 'px';
			instance.sizer.style.cursor = 'e-resize';
			if (args.maxer === undefined || args.maxer) {
				instance.maxer.style.left = (instance.position) + instance.style.maxerHRect.x + 'px';
				instance.maxer.style.top = (instance.height * .5) + instance.style.maxerHRect.y + 'px';
				instance.miner.style.left = (instance.position) + instance.style.minerHRect.x + 'px';
				instance.miner.style.top = (instance.height * .5) + instance.style.minerHRect.y - instance.style.minerHRect.h + 'px';
			}
			if (instance.width - instance.sizerRect.w - instance.maximizeOffset != instance.position && 0 != instance.position) {
				instance.previousNorm = instance.position;
			}
		} else {
			if (instance.position >= instance.height) {
				instance.position = instance.height - 1;
			}
			instance.cutters[0].style.height = (instance.position) + 'px';
			instance.cutters[0].style.width = instance.width + 'px';
			instance.cutters[1].style.left = '0px';
			instance.cutters[1].style.top = (instance.position + instance.style.sizerRect.h) + 'px';
			instance.cutters[1].style.height = (instance.height - instance.position - instance.style.sizerRect.h) + 'px';
			instance.cutters[1].style.width = instance.width + 'px';
			instance.sizer.style.left = '0px';
			instance.sizer.style.top = (instance.position) + 'px';
			instance.sizer.style.width = instance.width + 'px';
			instance.sizer.style.height = instance.style.sizerRect.h + 'px';
			instance.sizer.style.cursor = 'n-resize';
			if (args.maxer === undefined || args.maxer) {
				instance.maxer.style.left = (instance.width / 2) + instance.style.maxerVRect.x + 'px';
				instance.maxer.style.top = instance.position + instance.style.maxerVRect.y + 'px';
				instance.miner.style.left = (instance.width / 2) + instance.style.minerVRect.x - instance.style.minerVRect.w + 'px';
				instance.miner.style.top = instance.position + instance.style.minerVRect.y + 'px';
			}
			if (instance.height - instance.sizerRect.h - instance.maximizeOffset != instance.position && 0 != instance.position) {
				instance.previousNorm = instance.position;
			}
		}
		if (preventResizeEvent === undefined) {
			preventResizeEvent = false;
		}
		if (!preventResizeEvent) {
			instance.eventlisteners_resize();
		}
		return instance;
	}
	/**
	* Used interally update CSS DHTML elements.
	* @function
	* @name CutterBar.applyStyle
	* @memberOf Rendition.UI.CutterBar.prototype
	* @private
	* @returns {Native.Object} cutterBar.
	*/
	instance.applyStyle = function () {
		if (args.maxer === undefined || args.maxer) {
			if (instance._orientation == 0) {
				instance.maxer.style.height = instance.style.maxerHRect.h + 'px';
				instance.maxer.style.width = instance.style.maxerHRect.w + 'px';
				instance.maxer.style.background = instance.style.maxerHBackground;

				instance.miner.style.height = instance.style.minerHRect.h + 'px';
				instance.miner.style.width = instance.style.minerHRect.w + 'px';
				instance.miner.style.background = instance.style.minerHBackground;
			} else {
				instance.maxer.style.height = instance.style.maxerVRect.h + 'px';
				instance.maxer.style.width = instance.style.maxerVRect.w + 'px';
				instance.maxer.style.background = instance.style.maxerVBackground;

				instance.miner.style.height = instance.style.minerVRect.h + 'px';
				instance.miner.style.width = instance.style.minerVRect.w + 'px';
				instance.miner.style.background = instance.style.minerVBackground;
			}
		}
		instance.cutter.style.background = instance.style.cutterBackground;
		instance.cutters[0].style.background = instance.style.leftTopBackground;
		instance.cutters[1].style.background = instance.style.rightBottomBackground;
		if (instance._orientation == 0) {
			instance.sizer.style.background = instance.style.sizerHBackground;
		} else {
			instance.sizer.style.background = instance.style.sizerVBackground;
		}
		instance.updateRect();
		return false;
	}
	/**
	* Initilizes the cutter.
	* @function
	* @name CutterBar.init
	* @memberOf Rendition.UI.CutterBar.prototype
	* @private
	* @returns {Native.Object} cutterBar.
	*/
	instance.init = function () {
		instance.cutter = document.createElement('div');
		instance.cutter.setAttribute('cutter', 1);
		instance.cutter.setAttribute('cutterIndex', instance.index);
		instance.cutter.setAttribute('cutterId', instance.id);
		instance.cutter.style.position = 'absolute';
		instance.cutters[0] = document.createElement('div');
		instance.cutters[0].style.position = 'absolute';
		instance.cutters[0].style.overflow = 'hidden';
		instance.cutters[0].setAttribute('cutterId', instance.id);
		instance.cutters[1] = document.createElement('div');
		instance.cutters[1].style.position = 'absolute';
		instance.cutters[1].style.overflow = 'hidden';
		instance.cutters[0].setAttribute('cutterId', instance.id);
		instance.sizer = document.createElement('div');
		instance.sizer.onmousedown = function (e) {
			instance.startSizer(e);
			return;
		}
		instance.maxer = document.createElement('button');
		instance.miner = document.createElement('button');
		instance.maxer.style.position = 'absolute';
		instance.maxer.style.border = 'none';
		instance.maxer.style.padding = '0';
		instance.miner.style.position = 'absolute';
		instance.miner.style.border = 'none';
		instance.miner.style.padding = '0';
		if (typeof instance.sizer.style.MozUserSelect != 'undefined') {
			instance.sizer.style.MozUserSelect = 'none';
		} else {
			instance.sizer.onselectstart = function () { return false; }
		}
		instance.sizer.style.position = 'absolute';
		instance.cutter.appendChild(instance.cutters[0]);
		instance.cutter.appendChild(instance.cutters[1]);
		instance.cutter.appendChild(instance.sizer);
		instance.cutter.appendChild(instance.maxer);
		instance.cutter.appendChild(instance.miner);
		instance.maxer.onclick = function () { instance.maximize(); return false; }
		instance.miner.onclick = function () { instance.minimize(); return false; }
		if (instance.parentNode !== undefined) {
			instance.appendTo(instance.parentNode);
		}
		instance.applyStyle();
		return instance;
	}
	/**
	* Appends the cutter to a DHTML element after its been initilized.
	* @function
	* @name CutterBar.appendTo
	* @memberOf Rendition.UI.CutterBar.prototype
	* @public
	* @returns {Native.Object} cutterBar.
	*/
	instance.appendTo = function (targetNode) {
		instance.parentNode = targetNode;
		instance.parentNode.appendChild(instance.cutter);
		Rendition.UI.wireupResizeEvents(instance.resize, instance.parentNode);
		instance.resize();
		return false;
	}
	/**
	* Used internally to resize the cutter elements.
	* @function
	* @name CutterBar.resizeCutter
	* @memberOf Rendition.UI.CutterBar.prototype
	* @private
	* @returns {Native.Boolean} false.
	*/
	instance.resizeCutter = function (e) {
		var mousePos = Rendition.UI.mouseCoords(e);
		var newpos = 0;
		if (instance._orientation == 0) {
			document.body.style.cursor = 'e-resize';
			newpos = mousePos.x - instance.offsetLeft;
			var max = instance.width - instance.sizerRect.w - 4;
			if (newpos > 0 && newpos < max) {
				instance.position = newpos;
			} else if (newpos > max) {
				instance.position = max;
			} else if (newpos < 0) {
				instance.position = 0;
			}
		} else {
			document.body.style.cursor = 'n-resize';
			newpos = mousePos.y - instance.offsetTop;
			var max = instance.height - instance.sizerRect.h - 4;
			if (newpos > 0 && newpos < max) {
				instance.position = newpos;
			} else if (newpos > max) {
				instance.position = max;
			} else if (newpos < 0) {
				instance.position = 0;
			}
		}
		instance.updateRect(false, true);
		return false;
	}
	/**
	* Used interally to start the resizing.
	* @function
	* @name CutterBar.startSizer
	* @memberOf Rendition.UI.CutterBar.prototype
	* @public
	* @returns {Native.Object} cutterBar.
	*/
	instance.startSizer = function (e) {
		instance.resizeing = true;
		var pos = Rendition.UI.getPosition(instance.parentNode);
		var sizerPos = Rendition.UI.getPosition(instance.sizer);
		var mousePos = Rendition.UI.mouseCoords(e);
		instance.offsetTop = (pos.y + (mousePos.y - sizerPos.y)) + (instance.offsetRect.y);
		instance.offsetLeft = (pos.x + (mousePos.x - sizerPos.x)) + (instance.offsetRect.x);
		Rendition.UI.appendEvent('mousemove', document.body, instance.resizeCutter, true);
		Rendition.UI.appendEvent('mouseup', document.body, instance.resizeMouseup, false);
		return false;
	}
	/**
	* Used interally to end the resizing.
	* @function
	* @name CutterBar.resizeMouseup
	* @memberOf Rendition.UI.CutterBar.prototype
	* @public
	* @returns {Native.Object} cutterBar.
	*/
	instance.resizeMouseup = function (e) {
		instance.resizeing = false;
		document.body.style.cursor = 'default';
		instance.updateRect();
		Rendition.UI.removeEvent('mousemove', document.body, instance.resizeCutter, true);
		Rendition.UI.removeEvent('mouseup', document.body, arguments.callee, false);
		return false;
	}
	return instance.init();
}