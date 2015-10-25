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
* Style of the dialog.
* @constructor
* @name Rendition.UI.DialogWindowStyle
*/
Rendition.UI.DialogWindowStyle = function () {
	var instance = {}
	instance.id = 'uid_' + Rendition.UI.createId();
	instance.type = 'RenditionDialogWindowStyle';
	instance.titleCenterRect = {x:0,y:0,h:22,w:0}
	instance.titleLeftRect = {x:0,y:0,h:22,w:6}
	instance.titleRightRect = {x:0,y:0,h:22,w:6}
	instance.titleTextRect = {x:0,y:0,h:17,w:0}
	instance.contentRect = {x:0,y:0,h:0,w:0}
	instance.minRect = {x:-80,y:3,h:15,w:15}
	instance.maxRect = {x:-60,y:3,h:15,w:15}
	instance.restoreRect = {x:-60,y:3,h:15,w:15}
	instance.closeRect = {x:-40,y:3,h:15,w:15}
	instance.statusBarCenterRect = {x:0,y:0,h:17,w:0}
	instance.statusBarLeftRect = {x:0,y:0,h:17,w:6}
	instance.statusBarRightRect = {x:0,y:0,h:17,w:6}
	instance.menuBarRect = {x:0,y:0,h:0,w:0}
	instance.toolBarRect = {x:0,y:0,h:0,w:0}
	instance.nRect = {x:0,y:0,h:4,w:0}
	instance.sRect = {x:0,y:0,h:4,w:0}
	instance.eRect = {x:0,y:0,h:0,w:4}
	instance.wRect = {x:0,y:0,h:0,w:4}
	instance.nwRect = {x:0,y:0,h:10,w:10}
	instance.neRect = {x:0,y:0,h:10,w:10}
	instance.seRect = {x:0,y:0,h:10,w:10}
	instance.swRect = {x:0,y:0,h:10,w:10}
	instance.minimumRect = {x:0,y:0,h:10,w:10}
	instance.charToPx = 6;
	instance.nwBackground = '#99CC00';
	instance.nBackground = '#FF9900';
	instance.neBackground = '#CC0033';
	instance.eBackground = '#660066';
	instance.seBackground = '#3300CC';
	instance.sBackground = '#0099FF';
	instance.swBackground = '#00CC99';
	instance.wBackground = '#33CC33';
	instance.titleCenterBackground = '#FFFF00';
	instance.titleLeftBackground = '#CC6600';
	instance.titleRightBackground = '#99FFCC';
	instance.statusBarCenterBackground = '#33FF99';
	instance.statusBarLeftBackground = '#FF0000';
	instance.statusBarRightBackground = '#FF0000';
	instance.dialogBackground = '#CCCCCC';
	instance.contentBackground = '#DDDDDD';
	instance.restoreBackground = '#CCFFFF';
	instance.closeBackground = '#CCFFFF';
	instance.minBackground = '#CC9999';
	instance.maxBackground = '#999966';
	instance.restoreHoverBackground = '#0099FF';
	instance.closeHoverBackground = '#0099FF';
	instance.minHoverBackground = '#6600CC';
	instance.maxHoverBackground = '#FF3333';
	instance.restoreBorder = 'none';
	instance.closeBorder = 'none';
	instance.minBorder = 'none';
	instance.maxBorder = 'none';
	instance.titleFont = 'normal 12px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
	instance.titleTextAlignment = 'left';
	instance.titleColor = '#000';
	instance.taskElement = null;
	instance.modalBackground = 'url(img/50PctAlphaBlackDot.png)';
	instance.previewBackground = 'url(img/50PctAlphaBlackDot.png)';
	instance.boxShadow = '2px 2px 2px #AAA';
	return instance;
}
/**
* Creates a DHTML based dialog.  The dialog contains control boxes, a title bar, an entry in the task bar if visible, resize controls and dozens of events to attach to.
* @constructor
* @name Rendition.UI.Dialog
* @param {Native.Object} [args] Parameters for the dialog.
* @param {Native.Boolean} [args.alwaysOnTop=false] When true the dialog will always appear above other dialogs not set alwaysOnTop=true.
* @param {Native.Boolean} [args.hidden=false] When true the dialog will be hidden.  Hidden means displayed off screen at left:-10,000px top:10,000px.
* @param {Native.Boolean} [args.modalCloseable=false] When true and the dialog is in modal mode, the control box for close will still work.
* @param {Native.Boolean} [args.modal=false] When true and the dialog the dialog will appear in modal mode.  No other dialogs or controls will be accessable until this dialog closes.
* @param {Native.String} [args.title] The title that will appear in the title bar of the dialog.
* @param {Native.Boolean} [args.resizeable=true] When true the dialog can be resized by the user when not in maximized mode.
* @param {Native.Object} [args.rect={x:centered,y:75,h:350,w:400}] An object that looks like {x:Integer,y:Integer,h:Integer,w:Integer} that represents the position and dimentions of the dialog.  When not defined a dialog 350x400 will be created and centered in the current browser.
* @param {Native.Boolean} [args.dontInit=false] Don't initialize the dialog until you call the dialogs init method.
* @example ///Create a simple refrence to a new dialog, set the title and make it modal.///
*var myDialog = Rendition.UI.Dialog({
*	title:'My Dialog',
*	modal: true
*});
* @example ///Attach to an event when you create the dialog.///
*var myDialog = Rendition.UI.Dialog({
*	title:'My Dialog',
*	close:function(e,dialog){
*	    dialog.title('Can\'t close me.');
*		dialog.preventDefault();
*		return
*	}
*});
* @example ///Attach to an event after you create the dialog///
*var myDialog = Rendition.UI.Dialog({
*	title:'My Dialog'
*});
*myDialog.addEventListener('close',function(e,dialog){
*   dialog.title('Can\'t close me.');
*	dialog.preventDefault();
*	return
*},false);
*/
Rendition.UI.Dialog = Rendition.UI.dialogWindow = function (args) {
    if (args === undefined) { args = {} }
    var instance = {}
    /**
    * The type of object.  returns 'RenditionGrid'
    * @name Dialog.type
    * @memberOf Rendition.UI.Dialog.prototype
    * @type Native.String
    * @public
    * @property
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.type = 'RenditionDialogWindow';
    /**
    * unique id of this object.  Assigned automatcilly in this reg format /uid_UUID/
    * @name Dialog.id
    * @memberOf Rendition.UI.Dialog.prototype
    * @type Native.String
    * @public
    * @property
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.id = 'uid_' + Rendition.UI.createId();
    /**
    * The desktop object this dialog is a memeber of.  This is always Rendition.UI.desktops[0].
    * @name Dialog.desktop
    * @memberOf Rendition.UI.Dialog.prototype
    * @type Native.Object
    * @public
    * @property
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.desktop = args.desktop || Rendition.UI.desktops[0];
    /**
    * If true, this dialog is set to be 'always on top'.
    * @name Dialog.alwaysOnTop
    * @memberOf Rendition.UI.Dialog.prototype
    * @type Native.Boolean
    * @public
    * @property
    * @readOnly
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.alwaysOnTop = args.alwaysOnTop || false;
    /**
    * If true, this dialog is hidden.
    * @name Dialog.hidden
    * @memberOf Rendition.UI.Dialog.prototype
    * @type Native.Boolean
    * @public
    * @property
    * @readOnly
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.hidden = args.hidden || false;
    /**
    * If true, this dialog is closeable while in modal mode.
    * @name Dialog.modalCloseable
    * @memberOf Rendition.UI.Dialog.prototype
    * @type Native.Boolean
    * @public
    * @property
    * @readOnly
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.modalCloseable = args.modalCloseable == false ? false : true;
    /**
    * If true, this dialog is in modal mode.
    * @name Dialog.modal
    * @memberOf Rendition.UI.Dialog.prototype
    * @type Native.Boolean
    * @public
    * @property
    * @readOnly
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.modal = args.modal || false;
    args.title = args.title || '';
    /**
    * If true, this dialog can be resized.
    * @name Dialog.resizeable
    * @memberOf Rendition.UI.Dialog.prototype
    * @type Native.Boolean
    * @public
    * @property
    * @readOnly
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.resizeable = args.resizeable || true;
    /*events */
    /**
    * Executes event subscriptions.
    * @function
    * @name Dialog.executeEvents
    * @memberOf Rendition.UI.Dialog.prototype
    * @returns {Native.Boolean} false if cancel default was called.
    * @private
    * @param {Native.Array} events to execute.
    * @param {Native.Object} e The DOM event object.
    * @param {Native.String} element the related DHTML element.
    * @param {Native.String} arguments The arguments to add to the event signature.
    * @memberOf Rendition.UI.Dialog.prototype
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
    * Prevent the default event from occuring.  For use within an event handler.  For example, when used in within a function subscribed to the close event, running dialog.preventDefault() will prevent the dialog from closing.
    * @function
    * @name Dialog.preventDefault
    * @memberOf Rendition.UI.Dialog.prototype
    * @type Native.undefined
    * @public
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.preventDefault = function () {
        instance.cancelDefault = true;
    }
    /**
    * Attach a procedure to an event.  Usage dialog.addEventListener('cellmousedown',function(e,grid,element,row,column,selection,data,header){/*your procedure code},false)
    * @function
    * @name Dialog.addEventListener
    * @memberOf Rendition.UI.Dialog.prototype
    * @type Native.undefined
    * @param {Native.String} type The type of event to subscribe to.
    * @param {Native.Function} proc The function to call when the event is fired.
    * @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
    * @public
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.addEventListener = function (type, proc, capture) {
        if (instance.events[type]) {
            if (instance.events[type].indexOf(proc) == -1) {
                instance.events[type].push(proc);
            }
        } else {
            if (console) {
                console.log('can\'t attach to event handler ' + type);
            }
        }
        return null;
    }
    /**
    * Removes an event from subscription list.  The [proc] must match exactly the [proc] subscribed with.
    * @function
    * @name Dialog.removeEventListener
    * @memberOf Rendition.UI.Dialog.prototype
    * @type Native.undefined
    * @param {Native.String} type The type of event to subscribe to.
    * @param {Native.Function} proc The function to call when the event is fired.
    * @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
    * @public
    * @memberOf Rendition.UI.Dialog.prototype
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
    * @name Dialog.addInitalEvents
    * @memberOf Rendition.UI.Dialog.prototype
    * @type Native.undefined
    * @param {Native.Function} eventProc The event to add.
    * @private
    * @memberOf Rendition.UI.Dialog.prototype
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
        * Occurs when the dialog is closed.
        * @event
        * @name Dialog.onclose
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        close: instance.addInitalEvents(args.close),
        /**
        * Occurs when the dialog is being resized.
        * @event
        * @name Dialog.onresize
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        resize: instance.addInitalEvents(args.resize),
        /**
        * Occurs when the dialog is maximized.
        * @event
        * @name Dialog.onmaximize
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        maximize: instance.addInitalEvents(args.maximize),
        /**
        * Occurs when the dialog is minimized.
        * @event
        * @name Dialog.onminimize
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        minimize: instance.addInitalEvents(args.minimize),
        /**
        * Occurs when the dialog is restored.
        * @event
        * @name Dialog.onrestore
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        restore: instance.addInitalEvents(args.restore),
        /**
        * Occurs when the dialog is moving.
        * @event
        * @name Dialog.onmove
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        move: instance.addInitalEvents(args.move),
        /**
        * Occurs when the is starting to be resized.
        * @event
        * @name Dialog.onstartingResize
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        startingResize: instance.addInitalEvents(args.startingResize),
        /**
        * Occurs when the is starting to be moved.
        * @event
        * @name Dialog.onstartingMove
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        startingMove: instance.addInitalEvents(args.startingMove),
        /**
        * Occurs when the is dialog is finished resizing.
        * @event
        * @name Dialog.onfinishedResize
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        finishedResize: instance.addInitalEvents(args.finishedResize),
        /**
        * Occurs when the is dialog is finished moving.
        * @event
        * @name Dialog.onfinishedMove
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        finishedMove: instance.addInitalEvents(args.finishedMove),
        /**
        * Occurs when the is dialog's title has changed.
        * @event
        * @name Dialog.ontitleChanged
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        titleChanged: instance.addInitalEvents(args.titleChanged),
        /**
        * Occurs when the is dialog is activated.
        * @event
        * @name Dialog.onactivate
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        activate: instance.addInitalEvents(args.activate),
        /**
        * Occurs when the is dialog is hidden.
        * @event
        * @name Dialog.onhide
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        hide: instance.addInitalEvents(args.hide),
        /**
        * Occurs when the is dialog is shown.
        * @event
        * @name Dialog.onshow
        * @memberOf Rendition.UI.Dialog.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} dialog dialog.
        */
        show: instance.addInitalEvents(args.show)
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_restore
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_restore = function (e) {
        if (instance.executeEvents(instance.events.show, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_show
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_show = function (e) {
        if (instance.executeEvents(instance.events.show, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_hide
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_hide = function (e) {
        if (instance.executeEvents(instance.events.hide, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_activate
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_activate = function (e) {
        if (instance.executeEvents(instance.events.activate, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_titleChanged
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_titleChanged = function (e) {
        if (instance.executeEvents(instance.events.titleChanged, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_resize
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_resize = function (e) {
        if (instance.executeEvents(instance.events.resize, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_close
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_close = function (e) {
        if (instance.executeEvents(instance.events.close, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_maximize
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_maximize = function (e) {
        if (instance.executeEvents(instance.events.maximize, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_minimize
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_minimize = function (e) {
        if (instance.executeEvents(instance.events.minimize, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_move
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_move = function (e) {
        if (instance.executeEvents(instance.events.move, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_startingResize
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_startingResize = function (e) {
        if (instance.executeEvents(instance.events.startingResize, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_startingMove
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_startingMove = function (e) {
        if (instance.executeEvents(instance.events.startingMove, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_finishedResize
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_finishedResize = function (e) {
        if (instance.executeEvents(instance.events.finishedResize, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Dialog.eventlisteners_finishedMove
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.eventlisteners_finishedMove = function (e) {
        if (instance.executeEvents(instance.events.finishedMove, e, this)) { return false }
        return true;
    }
    /**
    * Initalizes the dialog adding it to the current desktop.
    * @function
    * @name Dialog.init
    * @memberOf Rendition.UI.Dialog.prototype
    * @private
    * @returns {Native.Object} dialog.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.init = function () {
        if (args.rect === undefined) {
            args.rect = { x: (document.documentElement.clientWidth / 2) - 200, y: 75, h: 350, w: 400 }
        }
        /**
        * The rectangle of this dialog.  Looks like {x:Integer,y:Integer,h:Integer,w:Integer}.
        * @name Dialog.rect
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.Object
        * @public
        * @property
        * @readOnly
        */
        instance.rect = {
            x: Math.floor(args.rect.x),
            y: Math.floor(args.rect.y),
            h: Math.floor(args.rect.h),
            w: Math.floor(args.rect.w)
        }
        /**
        * The dimentions of the DIV that appears when the dialog is being moved.
        * @name Dialog.previewRect
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.Object
        * @private
        * @property
        * @readOnly
        */
        instance.previewRect = args.rect;
        /**
        * The state of the window. 0 = Restored (normal), 1 = Maximized, 2 = Minimized
        * @name Dialog.windowState
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.Object
        * @public
        * @property
        * @readOnly
        */
        instance.windowState = 0;
        /**
        * Used interally to track the offset of the mouse.
        * @name Dialog.mouseOffset
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.Object
        * @private
        * @property
        * @readOnly
        */
        instance.mouseOffset = { x: 0, y: 0 }
        /**
        * Used interally to track the previous rect state while entering other rect modes (e.g.: hidden, maximized).
        * @name Dialog.previousRect
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.Object
        * @private
        * @property
        * @readOnly
        */
        instance.previousRect = null;
        /**
        * Used interally to track the previous state while entering other rect modes (e.g.: hidden, maximized).
        * @name Dialog.previousState
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.Integer
        * @private
        * @property
        * @readOnly
        */
        instance.previousState = null;
        /**
        * The index of this grid amongst other grids on this grids desktop.
        * @name Dialog.index
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.Integer
        * @private
        * @property
        * @readOnly
        */
        instance.index = null;
        /**
        * The original value of the title.
        * @name Dialog.originalTitleText
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.String
        * @private
        * @property
        * @readOnly
        */
        instance.originalTitleText = args.title;
        /**
        * When the dialog is closed then true.
        * @name Dialog.closed
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.Boolean
        * @private
        * @property
        * @readOnly
        */
        instance.closed = false;
        /**
        * The style of the dialog.
        * @name Dialog.style
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.Object
        * @private
        * @property
        * @readOnly
        */
        instance.style = Rendition.UI.dialogStyle;
        /**
        * The preview DIV element.
        * @name Dialog.preview
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.preview = document.createElement('div');
        instance.preview.style.visibility = 'hidden';
        instance.preview.style.display = 'none';
        instance.preview.style.position = 'absolute';
        instance.preview.style.zIndex = '1000000';
        /**
        * The title text node.
        * @name Dialog.titleTextNode
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.titleTextNode = document.createTextNode('');
        /**
        * The main dialog container element.
        * @name Dialog.dialog
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.dialog = document.createElement('div');
        instance.dialog.style.position = 'absolute';
        instance.dialog.style.id = 'dialog_' + instance.id;
        instance.dialog.style.top = instance.rect.y + 'px';
        instance.dialog.style.left = instance.rect.x + 'px';
        instance.dialog.style.height = instance.rect.h + 'px';
        instance.dialog.style.width = instance.rect.w + 'px';
        /**
        * Resize the modal dialog background.
        * @function
        * @name Dialog.resizeModalBackground
        * @memberOf Rendition.UI.Dialog.prototype
        * @private
        * @param {Native.Object} [e] The event object.
        */
        instance.resizeModalBackground = function (e) {
            instance.modalBackground.style.height = document.documentElement.clientHeight + 'px';
            instance.modalBackground.style.width = document.documentElement.clientWidth + 'px';
        }
        if (instance.modal) {
            instance.modalBackground = document.createElement('div');
            instance.modalBackground.style.position = 'absolute';
            instance.modalBackground.style.top = '0';
            instance.modalBackground.style.left = '0';
            instance.modalBackground.style.background = instance.style.modalBackground;
            Rendition.UI.appendEvent('resize', window, instance.resizeModalBackground, false);
            instance.modalBackground.style.zIndex = Rendition.UI.topModalzindex + 1; Rendition.UI.topModalzindex++;
            instance.dialog.style.zIndex = Rendition.UI.topModalzindex + 2; Rendition.UI.topModalzindex++;
            instance.resizeModalBackground();
        } else if (instance.alwaysOnTop) {
            instance.dialog.style.zIndex = Rendition.UI.topModalzindex + 2; Rendition.UI.topModalzindex++;
        } else {
            instance.dialog.style.zIndex = Rendition.UI.topzindex + 1; Rendition.UI.topzindex++;
        }
        Rendition.UI.appendEvent('mousedown', instance.dialog, function () {
            instance.activate();
        }, false);
        /**
        * The content element.  This is where the dialog content should be appended.
        * @name Dialog.content
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @public
        * @property
        * @readOnly
        */
        instance.content = document.createElement('div');
        instance.content.style.position = 'absolute';
        instance.content.style.overflow = 'hidden';
        instance.content.parentObject = instance;
        instance.content.addEventListener = instance.addEventListener;
        instance.content.setAttribute('windowId', instance.id);
        instance.dialog.appendChild(instance.content);
        /**
        * The center of the title bar.
        * @name Dialog.titleBarCenter
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.titleBarCenter = document.createElement('div');
        instance.titleBarCenter.style.position = 'absolute';
        instance.titleBarCenter.ondblclick = function (e) {
            if (!instance.modal) {
                if (instance.windowState == 1) {
                    instance.unmaximize();
                } else {
                    instance.maximize();
                }
            }
        }
        instance.dialog.appendChild(instance.titleBarCenter);
        /**
        * The element to the left of the title.
        * @name Dialog.titleBarLeft
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.titleBarLeft = document.createElement('div');
        instance.titleBarLeft.style.position = 'absolute';
        instance.dialog.appendChild(instance.titleBarLeft);
        /**
        * The element to the right of the title.
        * @name Dialog.titleBarRight
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.titleBarRight = document.createElement('div');
        instance.titleBarRight.style.position = 'absolute';
        instance.dialog.appendChild(instance.titleBarRight);
        /**
        * The element that holds the title textNode.
        * @name Dialog.titleBarText
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.titleBarText = document.createElement('div');
        instance.titleBarText.appendChild(instance.titleTextNode);
        instance.titleBarText.style.cursor = 'default';
        instance.titleBarText.style.position = 'absolute';
        instance.titleBarCenter.appendChild(instance.titleBarText);
        if (typeof instance.titleBarText.style.MozUserSelect != 'undefined') {
            instance.titleBarCenter.style.MozUserSelect = 'none';
            instance.titleBarText.style.MozUserSelect = 'none';
        } else {
            instance.titleBarCenter.onselectstart = function () { return false; }
            instance.titleBarText.onselectstart = function () { return false; }
        }
        /**
        * Center of the status bar.
        * @name Dialog.statusBarCenter
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.statusBarCenter = document.createElement('div');
        instance.statusBarCenter.style.position = 'absolute';
        instance.dialog.appendChild(instance.statusBarCenter);
        /**
        * Left of the status bar.
        * @name Dialog.statusBarLeft
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.statusBarLeft = document.createElement('div');
        instance.statusBarLeft.style.position = 'absolute';
        instance.dialog.appendChild(instance.statusBarLeft);
        /**
        * Right of the status bar.
        * @name Dialog.statusBarRight
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.statusBarRight = document.createElement('div');
        instance.statusBarRight.style.position = 'absolute';
        instance.dialog.appendChild(instance.statusBarRight);
        if (!instance.modal || instance.modalCloseable) {
            /**
            * Close button.
            * @name Dialog.closeButton
            * @memberOf Rendition.UI.Dialog.prototype
            * @type Native.DHTMLElement
            * @private
            * @property
            * @readOnly
            */
            instance.closeButton = document.createElement('button');
            instance.closeButton.style.position = 'absolute';
            instance.titleBarCenter.appendChild(instance.closeButton);
        }
        if (!instance.modal) {
            /**
            * Maximize button.
            * @name Dialog.maxButton
            * @memberOf Rendition.UI.Dialog.prototype
            * @type Native.DHTMLElement
            * @private
            * @property
            * @readOnly
            */
            instance.maxButton = document.createElement('button');
            instance.maxButton.style.position = 'absolute';
            instance.titleBarCenter.appendChild(instance.maxButton);
            /**
            * Restore button.
            * @name Dialog.restoreButton
            * @memberOf Rendition.UI.Dialog.prototype
            * @type Native.DHTMLElement
            * @private
            * @property
            * @readOnly
            */
            instance.restoreButton = document.createElement('button');
            instance.restoreButton.style.position = 'absolute';
            instance.restoreButton.style.visibility = 'hidden';
            instance.restoreButton.style.display = 'none';
            instance.titleBarCenter.appendChild(instance.restoreButton);
            /**
            * Minimize button.
            * @name Dialog.minButton
            * @memberOf Rendition.UI.Dialog.prototype
            * @type Native.DHTMLElement
            * @private
            * @property
            * @readOnly
            */
            instance.minButton = document.createElement('button');
            instance.minButton.style.position = 'absolute';
            instance.titleBarCenter.appendChild(instance.minButton);
        }
        /**
        * The top border element.
        * @name Dialog.n
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.n = document.createElement('div');
        instance.n.style.cursor = 'n-resize';
        instance.n.onmousedown = function () { return false }
        instance.n.style.position = 'absolute';
        instance.dialog.appendChild(instance.n);
        /**
        * The right border element.
        * @name Dialog.e
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.e = document.createElement('div');
        instance.e.style.cursor = 'e-resize';
        instance.e.onmousedown = function () { return false }
        instance.e.style.position = 'absolute';
        instance.dialog.appendChild(instance.e);
        /**
        * The left border element.
        * @name Dialog.w
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.w = document.createElement('div');
        instance.w.style.cursor = 'e-resize';
        instance.w.onmousedown = function () { return false }
        instance.w.style.position = 'absolute';
        instance.dialog.appendChild(instance.w);
        /**
        * The bottom border element.
        * @name Dialog.s
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.s = document.createElement('div');
        instance.s.style.cursor = 'n-resize';
        instance.s.onmousedown = function () { return false }
        instance.s.style.position = 'absolute';
        instance.dialog.appendChild(instance.s);
        /**
        * The top left border element.
        * @name Dialog.nw
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.nw = document.createElement('div');
        instance.nw.style.cursor = 'nw-resize';
        instance.nw.onmousedown = function () { return false }
        instance.nw.style.position = 'absolute';
        instance.dialog.appendChild(instance.nw);
        /**
        * The top right border element.
        * @name Dialog.ne
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.ne = document.createElement('div');
        instance.ne.style.cursor = 'ne-resize';
        instance.ne.onmousedown = function () { return false }
        instance.ne.style.position = 'absolute';
        instance.dialog.appendChild(instance.ne);
        /**
        * The bottom right border element.
        * @name Dialog.se
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.se = document.createElement('div');
        instance.se.style.cursor = 'nw-resize';
        instance.se.onmousedown = function () { return false }
        instance.se.style.position = 'absolute';
        instance.dialog.appendChild(instance.se);
        /**
        * The bottom left element.
        * @name Dialog.sw
        * @memberOf Rendition.UI.Dialog.prototype
        * @type Native.DHTMLElement
        * @private
        * @property
        * @readOnly
        */
        instance.sw = document.createElement('div');
        instance.sw.style.cursor = 'ne-resize';
        instance.sw.onmousedown = function () { return false }
        instance.sw.style.position = 'absolute';
        instance.dialog.appendChild(instance.sw);
        Rendition.UI.appendEvent('mousedown', instance.titleBarCenter, instance.startMoveDialog, false);
        if (!instance.modal || instance.modalCloseable) {
            Rendition.UI.appendEvent('mousedown', instance.closeButton, instance.beginButtonEvent, true);
            Rendition.UI.appendEvent('click', instance.closeButton, instance.close, false);
        }
        if (!instance.modal) {
            Rendition.UI.appendEvent('mousedown', instance.minButton, instance.beginButtonEvent, true);
            Rendition.UI.appendEvent('click', instance.minButton, instance.minimize, false);
            Rendition.UI.appendEvent('mousedown', instance.restoreButton, instance.beginButtonEvent, true);
            Rendition.UI.appendEvent('click', instance.restoreButton, instance.unmaximize, false);
            Rendition.UI.appendEvent('mousedown', instance.maxButton, instance.beginButtonEvent, true);
            Rendition.UI.appendEvent('click', instance.maxButton, instance.maximize, false);
        }
        Rendition.UI.appendEvent('mousedown', instance.n, function (ev) {
            instance.getResizeArrays(ev, instance.n);
            Rendition.UI.appendEvent('mousemove', document.documentElement, instance.resizeDialog, true);
            return false;
        }, true);
        Rendition.UI.appendEvent('mousedown', instance.s, function (ev) {
            instance.getResizeArrays(ev, instance.s);
            Rendition.UI.appendEvent('mousemove', document.documentElement, instance.resizeDialog, true);
            return false;
        }, true);
        Rendition.UI.appendEvent('mousedown', instance.e, function (ev) {
            instance.getResizeArrays(ev, instance.e);
            instance.mouseOffset.x = instance.mouseOffset.x - instance.style.eRect.w;
            Rendition.UI.appendEvent('mousemove', document.documentElement, instance.resizeDialog, true);
            return false;
        }, true);
        Rendition.UI.appendEvent('mousedown', instance.w, function (ev) {
            instance.getResizeArrays(ev, instance.w);
            Rendition.UI.appendEvent('mousemove', document.documentElement, instance.resizeDialog, true);
            return false;
        }, true);
        Rendition.UI.appendEvent('mousedown', instance.nw, function (ev) {
            instance.getResizeArrays(ev, instance.nw);
            Rendition.UI.appendEvent('mousemove', document.documentElement, instance.resizeDialog, true);
            return false;
        }, true);
        Rendition.UI.appendEvent('mousedown', instance.ne, function (ev) {
            instance.getResizeArrays(ev, instance.ne);
            instance.mouseOffset.x = instance.mouseOffset.x - instance.style.neRect.w;
            Rendition.UI.appendEvent('mousemove', document.documentElement, instance.resizeDialog, true);
            return false;
        }, true);
        Rendition.UI.appendEvent('mousedown', instance.se, function (ev) {
            instance.getResizeArrays(ev, instance.se);
            instance.mouseOffset.x = instance.mouseOffset.x - instance.style.seRect.w;
            instance.mouseOffset.y = instance.mouseOffset.y - instance.style.seRect.h;
            Rendition.UI.appendEvent('mousemove', document.documentElement, instance.resizeDialog, true);
            return false;
        }, true);
        Rendition.UI.appendEvent('mousedown', instance.sw, function (ev) {
            instance.getResizeArrays(ev, instance.sw);
            instance.mouseOffset.y = instance.mouseOffset.y - instance.style.swRect.h;
            Rendition.UI.appendEvent('mousemove', document.documentElement, instance.resizeDialog, true);
            return false;
        }, true);
        if (!instance.modal) {
            instance.minButton.blur = function () {
                return false;
            }
            instance.minButton.hover = function () {
                return false;
            }
            Rendition.UI.appendEvent('mouseover', instance.minButton, instance.mousehover = function () {
                Rendition.UI.hover(instance.minButton);
            }, false);
            Rendition.UI.appendEvent('mouseout', instance.minButton, instance.mousehover = function () {
                instance.minButton.blur();
            }, false);
        }
        instance.title(args.title);
        instance.applyStyle();
        if (instance.hidden) {
            instance.hide();
        }
        if (instance.desktop) {
            instance.desktop.addDialogWindow(instance);
        } else {
            Rendition.UI.dialogs.push(instance);
            document.body.appendChild(instance.dialog);
            document.body.appendChild(instance.preview);
            if (instance.modal) {
                document.body.appendChild(instance.modalBackground);
            }
            Rendition.UI.refreshTaskBars();
        }
        return instance;
    }
    /**
    * Used interally to prevent dialog movments when the control boxes are used.
    * @function
    * @name Dialog.beginButtonEvent
    * @memberOf Rendition.UI.Dialog.prototype
    * @private
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.beginButtonEvent = function () {
        instance.buttonEventOccuring = true;
        instance.buttonEventOccuringProc = function () {
            instance.buttonEventOccuring = false;
            Rendition.UI.removeEvent('mouseup', document.documentElement, instance.buttonEventOccuringProc, true);
        }
        Rendition.UI.appendEvent('mouseup', document.documentElement, instance.buttonEventOccuringProc, true);
    }
    /**
    * Used interally to process the end of move events.
    * @function
    * @name Dialog.stopMoving
    * @memberOf Rendition.UI.Dialog.prototype
    * @private
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.stopMoving = function () {
        instance.preview.style.visibility = 'hidden';
        instance.preview.style.display = 'none';
        instance.dialog.style.left = instance.rect.x + 'px';
        instance.dialog.style.top = instance.rect.y + 'px';
        Rendition.UI.removeEvent('mousemove', document.documentElement, instance.moveDialog, true);
        Rendition.UI.removeEvent('mouseup', document.documentElement, instance.stopMoving, true);
        instance.eventlisteners_finishedMove(null);
    }
    /**
    * Used interally to process the start moving events.
    * @function
    * @name Dialog.startMoveDialog
    * @memberOf Rendition.UI.Dialog.prototype
    * @private
    * @returns {Native.Boolean} false.
    * @param {Native.Object} ev The event object.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.startMoveDialog = function (ev) {
        if ((!instance.closed) && (!instance.buttonEventOccuring)) {
            instance.mouseOffset = Rendition.UI.getMouseOffset(instance.titleBarCenter, ev);
            instance.mouseOffset.x = instance.mouseOffset.x + instance.style.titleLeftRect.w + instance.style.titleCenterRect.x;
            instance.mouseOffset.y = instance.mouseOffset.y + instance.style.titleCenterRect.y;
            instance.previewRect = instance.rect;
            instance.preview.style.left = instance.previewRect.x + 'px';
            instance.preview.style.top = instance.previewRect.y + 'px';
            instance.preview.style.width = instance.previewRect.w + 'px';
            instance.preview.style.height = instance.previewRect.h + 'px';
            Rendition.UI.appendEvent('mousemove', document.documentElement, instance.moveDialog, true);
            Rendition.UI.appendEvent('mouseup', document.documentElement, instance.stopMoving, true);
            instance.eventlisteners_startingMove(ev);
        }
        return false;
    }
    /**
    * Used interally to process moving the dialog.
    * @function
    * @name Dialog.moveDialog
    * @memberOf Rendition.UI.Dialog.prototype
    * @private
    * @returns {Native.Boolean} false.
    * @param {Native.Object} ev The event object.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.moveDialog = function (ev) {
        if ((instance.mouseOffset.x < 2 && instance.mouseOffset.y < 2) || instance.windowState == 1) { return false }
        var mousePos = Rendition.UI.mouseCoords(ev);
        instance.preview.style.display = 'block';
        instance.preview.style.visibility = 'visible';
        instance.rect.x = mousePos.x - instance.mouseOffset.x;
        instance.rect.y = mousePos.y - instance.mouseOffset.y;
        instance.previewRect = instance.rect;
        instance.preview.style.top = instance.previewRect.y + 'px';
        instance.preview.style.left = instance.previewRect.x + 'px';
        instance.eventlisteners_move(ev);
        return false;
    }
    /**
    * Used to check if the dialog is still alive and a decendant of the body.
    * @function
    * @name Dialog.alive
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @returns {Native.Boolean} false.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.alive = function () {
        e = instance.dialog.parentNode;
        while (e) {
            if (e.tagName.toLowerCase() == 'body') {
                return true;
            }
            e = e.parentNode;
        }
        return false;
    }
    /**
    * Used interally apply all the CSS commands to the dialogs DHTML elements.
    * @function
    * @name Dialog.applyStyle
    * @memberOf Rendition.UI.Dialog.prototype
    * @private
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.applyStyle = function () {
        instance.dialog.style.boxShadow = instance.style.boxShadow;
        instance.titleBarCenter.style.top = instance.style.titleCenterRect.y + 'px';
        instance.titleBarCenter.style.left = instance.style.titleCenterRect.x + instance.style.titleLeftRect.w + 'px';
        instance.titleBarCenter.style.height = instance.style.titleCenterRect.h + 'px';
        instance.titleBarCenter.style.background = instance.style.titleCenterBackground;
        instance.titleBarLeft.style.top = instance.style.titleLeftRect.y + 'px';
        instance.titleBarLeft.style.left = instance.style.titleLeftRect.x + 'px';
        instance.titleBarLeft.style.height = instance.style.titleLeftRect.h + 'px';
        instance.titleBarLeft.style.width = instance.style.titleLeftRect.w + 'px';
        instance.titleBarLeft.style.background = instance.style.titleLeftBackground;
        instance.titleBarRight.style.top = instance.style.titleRightRect.y + 'px';
        instance.titleBarRight.style.height = instance.style.titleRightRect.h + 'px';
        instance.titleBarRight.style.width = instance.style.titleRightRect.w + 'px';
        instance.titleBarRight.style.background = instance.style.titleRightBackground;
        instance.titleBarText.style.left = instance.style.titleTextRect.x + 'px';
        instance.titleBarText.style.top = instance.style.titleTextRect.y + 'px';
        instance.titleBarText.style.height = instance.style.titleTextRect.h + 'px';
        instance.titleBarText.style.font = instance.style.titleFont;
        instance.titleBarText.style.color = instance.style.titleColor;
        instance.titleBarText.style.textAlign = instance.style.titleTextAlignment;
        if (!instance.modal) {
            instance.minButton.style.background = instance.style.minBackground;
            instance.minButton.style.border = instance.style.minBorder;
            instance.minButton.style.height = instance.style.minRect.h + 'px';
            instance.minButton.style.width = instance.style.minRect.w + 'px';
            instance.minButton.style.top = instance.style.minRect.y + 'px';
            instance.restoreButton.style.background = instance.style.restoreBackground;
            instance.restoreButton.style.border = instance.style.restoreBorder;
            instance.restoreButton.style.height = instance.style.restoreRect.h + 'px';
            instance.restoreButton.style.width = instance.style.restoreRect.w + 'px';
            instance.restoreButton.style.top = instance.style.restoreRect.y + 'px';
            instance.maxButton.style.background = instance.style.maxBackground;
            instance.maxButton.style.border = instance.style.maxBorder;
            instance.maxButton.style.height = instance.style.maxRect.h + 'px';
            instance.maxButton.style.width = instance.style.maxRect.w + 'px';
            instance.maxButton.style.top = instance.style.maxRect.y + 'px';
        }
        if (instance.modalCloseable || !instance.modal) {
            instance.closeButton.style.background = instance.style.closeBackground;
            instance.closeButton.style.border = instance.style.closeBorder;
            instance.closeButton.style.height = instance.style.closeRect.h + 'px';
            instance.closeButton.style.width = instance.style.closeRect.w + 'px';
            instance.closeButton.style.top = instance.style.closeRect.y + 'px';
        }
        instance.preview.style.background = instance.style.previewBackground;
        instance.dialog.style.background = instance.style.dialogBackground;
        instance.content.style.left = instance.style.contentRect.x + 'px';
        instance.content.style.backgroundColor = instance.style.contentBackground;
        instance.statusBarRight.style.height = instance.style.statusBarRightRect.h + 'px';
        instance.statusBarRight.style.width = instance.style.statusBarRightRect.w + 'px';
        instance.statusBarRight.style.background = instance.style.statusBarRightBackground;
        instance.statusBarLeft.style.left = instance.style.statusBarLeftRect.x + 'px';
        instance.statusBarLeft.style.height = instance.style.statusBarLeftRect.h + 'px';
        instance.statusBarLeft.style.width = instance.style.statusBarLeftRect.w + 'px';
        instance.statusBarLeft.style.background = instance.style.statusBarLeftBackground;
        instance.statusBarCenter.style.left = instance.style.statusBarCenterRect.x + instance.style.statusBarLeftRect.w + 'px';
        instance.statusBarCenter.style.height = instance.style.statusBarCenterRect.h + 'px';
        instance.statusBarCenter.style.background = instance.style.statusBarCenterBackground;
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
        return;
    }
    /**
    * Automaticaly resize the dialog height to fit its content, optionally with the specified width or 90% of the client width.
    * @function
    * @name Dialog.autosize
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @returns {Native.Boolean} false.
    * @param {Native.Integer} [width=90% of the client width] Dialog width.
    * @param {Native.Boolean} [makeYScroll] Cause the dialogs content area to have a scrollbar.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.autosize = function (width, makeYScroll) {
        if (instance.content.firstChild) {
            var e = instance.content.firstChild;
            var height = 0;
            width = width || (document.documentElement.clientWidth * .9);
            instance.updateRect({
                h: 250,
                w: instance.rect.w,
                x: -1000,
                y: -1000
            });
            while (e) {
                if (e.offsetLeft < 10) {
                    height += e.offsetHeight;
                }
                e = e.nextSibling;
            }
            height += instance.style.statusBarCenterRect.h;
            height += instance.style.titleCenterRect.h + instance.style.titleCenterRect.y;
            if (height > document.documentElement.clientHeight - 50) {
                height = document.documentElement.clientHeight - 50;
                makeYScroll = true;
            }
            if (makeYScroll) {
                instance.content.style.overflow = 'hidden';
                instance.content.style.overflowX = 'hidden';
                instance.content.style.overflowY = 'scroll';
            }
            rect = {
                w: width,
                h: height + 30,
                x: (document.documentElement.clientWidth * .5 - (width * .5)),
                y: (document.documentElement.clientHeight * .4 - (height * .5))
            }
            instance.updateRect(rect);
        }
        return instance;
    }
    /**
    * Minimizes the dialog.
    * @function
    * @name Dialog.minimize
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @returns {Native.Object} dialog.
    * @param {Native.Object} [e] The event object.
    */
    instance.minimize = function (e) {
        instance.previousState = instance.windowState;
        instance.windowState = 2;
        instance.dialog.style.visibility = 'hidden';
        instance.dialog.style.display = 'none';
        instance.eventlisteners_minimize(null);
        if (e !== undefined) {
            e.cancelBubble = true;
        }
        return instance;
    }
    /**
    * Activate the dialog. Brings the dialog to the top of the stack of dialogs.  Threre are two sets of dialog stacks.  The 'alwaysOnTop' stack and the normal stack.  The always on top stack is always on top of the normal stack.
    * @function
    * @name Dialog.activate
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @returns {Native.Object} dialog.
    */
    instance.activate = function () {
        Rendition.UI.activeWindow = instance;
        if (instance.windowState == 2) {
            instance.restore();
        }
        if (parseInt(instance.dialog.style.zIndex) < Rendition.UI.topzindex) {
            if (instance.modal || instance.alwaysOnTop) {
                instance.dialog.style.zIndex = Rendition.UI.topModalzindex + 1; Rendition.UI.topModalzindex++;
            } else {
                instance.dialog.style.zIndex = Rendition.UI.topzindex + 1; Rendition.UI.topzindex++;
            }
        }
        instance.eventlisteners_activate(null);
        return instance;
    }
    /**
    * Hides the dialog by moving it to top:-10,000px, left:-10,000px so even the largest dialogs will be hidden but still in the DOM and visible for functions to execute on the visible elements in the content area of the dialog.
    * @function
    * @name Dialog.hide
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @returns {Native.Object} dialog.
    */
    instance.hide = function () {
        instance.dialog.style.top = '-10000px';
        instance.dialog.style.left = '-10000px';
        if (instance.modal) {
            instance.modalBackground.style.visibility = 'hidden';
            instance.modalBackground.style.display = 'none';
        }
        Rendition.UI.dialogs.splice(instance.index, 1);
        Rendition.UI.refreshTaskBars();
        instance.eventlisteners_hide(null);
        return instance;
    }
    /**
    * Shows the dialog if it was in hidden mode by returning it to its previous position.
    * @function
    * @name Dialog.show
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @returns {Native.Object} dialog.
    */
    instance.show = function () {
        instance.dialog.style.top = instance.rect.y + 'px';
        instance.dialog.style.left = instance.rect.x + 'px';
        if (instance.modal) {
            instance.modalBackground.style.visibility = 'visible';
            instance.modalBackground.style.display = 'block';
        }
        instance.index = Rendition.UI.dialogs.length;
        Rendition.UI.dialogs.push(instance);
        Rendition.UI.refreshTaskBars();
        instance.eventlisteners_show(null);
        return instance;
    }
    /**
    * Closes the dialog optionally firing a callback procedure.
    * @function
    * @name Dialog.close
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @param {Native.Function} callbackProcedure The procedure to apply after the dialog has closed.
    */
    instance.close = function (callbackProcedure) {
        if (instance.closed) { return null }
        if (!instance.eventlisteners_close(null)) { return instance }
        instance.closed = true;
        if (instance.modal) {
            try {
                Rendition.UI.removeEvent('resize', window, instance.resizeModalBackground, false);
                instance.modalBackground.parentNode.removeChild(instance.modalBackground);
            } catch (e) {

            }
        }
        if (instance.dialog.parentNode) {
            instance.dialog.parentNode.removeChild(instance.dialog);
        }
        Rendition.UI.dialogs.splice(instance.index, 1);
        Rendition.UI.refreshTaskBars();
        if (typeof callbackProcedure == 'function') {
            callbackProcedure.apply(instance, []);
        }
        return;
    }
    /**
    * Restores the dialog.
    * @function
    * @name Dialog.restore
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @returns {Native.Object} dialog.
    */
    instance.restore = function () {
        instance.windowState = instance.previousState;
        instance.dialog.style.visibility = 'visible';
        instance.dialog.style.display = 'block';
        instance.eventlisteners_restore(null);
        return instance;
    }
    /**
    * Restores the dialog by taking it out of maximize mode.
    * @function
    * @name Dialog.unmaximize
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @returns {Native.Object} dialog.
    */
    instance.unmaximize = function () {
        instance.windowState = 0;
        instance.restoreButton.style.visibility = 'hidden';
        instance.restoreButton.style.display = 'none';
        instance.maxButton.style.visibility = 'visible';
        instance.maxButton.style.display = 'block';
        instance.rect = instance.previousRect;
        instance.updateRect(instance.rect);
        Rendition.UI.removeEvent('resize', window, instance.resizeWithWindow, false);
        instance.eventlisteners_restore(null);
        return instance;
    }
    /**
    * Maximizes the dialog by matching the border to the dimentions of the client rectangle.  When the client rectangle is updated the dialog will change dimentions to match the new client rectangle.
    * @function
    * @name Dialog.maximize
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @returns {Native.Object} dialog.
    */
    instance.maximize = function () {
        instance.previousRect = Rendition.UI.getRect(instance.dialog);
        instance.previousState = instance.windowState;
        instance.windowState = 1;
        if (instance.modalCloseable || !instance.modal) {
            instance.maxButton.style.visibility = 'hidden';
            instance.maxButton.style.display = 'none';
            instance.restoreButton.style.visibility = 'visible';
            instance.restoreButton.style.display = 'block';
        }
        instance.updateRect(instance.rect);
        Rendition.UI.appendEvent('resize', window, instance.resizeWithWindow = function (ev) { instance.updateRect(instance.rect) }, false);
        instance.eventlisteners_maximize(null);
        return instance;
    }
    /**
    * Checks to see if this dialog is the topmost dialog.
    * @function
    * @name Dialog.isTopmostWindow
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @returns {Native.Boolean} If true this dialog is the topmost dialog.
    */
    instance.isTopmostWindow = function () {
        bolReturn = false;
        var topIndex = 0;
        var winLength = Rendition.UI.dialogs.length;
        for (var x = 0; x < winLength; x++) {
            var intIndex = parseInt(Rendition.UI.dialogs[x].dialog.style.zIndex);
            if (topIndex < intIndex) {
                topIndex = intIndex;
            }
        }
        if (parseInt(instance.dialog.style.zIndex) == topIndex) {
            bolReturn = true;
        }
        return bolReturn;
    }
    /**
    * Used interally to resize the dialog.
    * @function
    * @name Dialog.resizeDialog
    * @memberOf Rendition.UI.Dialog.prototype
    * @private
    * @param {Native.Object} ev The event object.
    */
    instance.resizeDialog = function (ev) {
        if (!instance.resizeable) { return null }
        instance.preview.style.display = 'block';
        instance.preview.style.visibility = 'visible';
        var mousePos = Rendition.UI.mouseCoords(ev);
        var newRect = { x: null, y: null, h: null, w: null }
        if (instance.resizeObject == instance.n) {
            newRect.y = mousePos.y - instance.mouseOffset.y;
            newRect.h = instance.resizeOffset.y - newRect.y + instance.resizeOffset.h;
            newRect.w = null;
            newRect.x = null;
        } else if (instance.resizeObject == instance.w) {
            newRect.x = mousePos.x - instance.mouseOffset.x;
            newRect.w = instance.resizeOffset.x - newRect.x + instance.resizeOffset.w;
            newRect.y = null;
            newRect.h = null;
        } else if (instance.resizeObject == instance.e) {
            newRect.x = mousePos.x - instance.mouseOffset.x;
            newRect.w = instance.resizeOffset.x - (newRect.x * -1) - instance.resizeOffset.x - instance.resizeOffset.x;
            newRect.x = null;
            newRect.y = null;
            newRect.h = null;
        } else if (instance.resizeObject == instance.s) {
            newRect.y = mousePos.y - instance.mouseOffset.y;
            newRect.h = instance.resizeOffset.y - (newRect.y * -1) - instance.resizeOffset.y - instance.resizeOffset.y;
            newRect.x = null;
            newRect.y = null;
            newRect.w = null;
        } else if (instance.resizeObject == instance.ne) {
            newRect.x = mousePos.x - instance.mouseOffset.x;
            newRect.y = mousePos.y - instance.mouseOffset.y;
            newRect.w = instance.resizeOffset.x - (newRect.x * -1) - instance.resizeOffset.x - instance.resizeOffset.x;
            newRect.h = (instance.resizeOffset.y - newRect.y) + instance.resizeOffset.h;
            newRect.x = null;
        } else if (instance.resizeObject == instance.se) {
            newRect.x = mousePos.x - instance.mouseOffset.x;
            newRect.y = mousePos.y - instance.mouseOffset.y;
            newRect.w = instance.resizeOffset.x - (newRect.x * -1) - instance.resizeOffset.x - instance.resizeOffset.x;
            newRect.h = instance.resizeOffset.y - (newRect.y * -1) - instance.resizeOffset.y - instance.resizeOffset.y;
            newRect.x = null;
            newRect.y = null;
        } else if (instance.resizeObject == instance.sw) {
            newRect.x = mousePos.x - instance.mouseOffset.x;
            newRect.y = mousePos.y - instance.mouseOffset.y;
            newRect.w = instance.resizeOffset.x - newRect.x + instance.resizeOffset.w;
            newRect.h = instance.resizeOffset.y - (newRect.y * -1) - instance.resizeOffset.y - instance.resizeOffset.y;
            newRect.y = null;
        } else if (instance.resizeObject == instance.nw) {
            newRect.x = mousePos.x - instance.mouseOffset.x;
            newRect.y = mousePos.y - instance.mouseOffset.y;
            newRect.w = instance.resizeOffset.x - newRect.x + instance.resizeOffset.w;
            newRect.h = instance.resizeOffset.y - newRect.y + instance.resizeOffset.h;
        }
        instance.setDialogSize(newRect);
        return;
    }
    /**
    * Sets the dialog to a new size or fires off the resize events using the current rectangle.
    * @function
    * @name Dialog.setDialogSize
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @param {Native.Object} [newRect] The new rectangle size to set the dialog to.  Like {x:Integer,y:Integer,h:Integer,w:Integer}.
    */
    instance.setDialogSize = function (newRect) {
        var rect = { x: null, y: null, h: null, w: null }
        var oldRect = Rendition.UI.getRect(instance.dialog);
        if (newRect.x) { if (newRect.x >= instance.style.minimumRect.x) { rect.x = newRect.x } } else { rect.x = oldRect.x }
        if (newRect.y) { if (newRect.y >= instance.style.minimumRect.y) { rect.y = newRect.y } } else { rect.y = oldRect.y }
        if (newRect.h) { if (newRect.h >= instance.style.minimumRect.h) { rect.h = newRect.h } } else { rect.h = oldRect.h }
        if (newRect.w) { if (newRect.w >= instance.style.minimumRect.w) { rect.w = newRect.w } } else { rect.w = oldRect.w }
        instance.previewRect = rect;
        instance.preview.style.top = instance.previewRect.y + 'px';
        instance.preview.style.left = instance.previewRect.x + 'px';
        instance.preview.style.height = instance.previewRect.h + 'px';
        instance.preview.style.width = instance.previewRect.w + 'px';
        return;
    }
    /**
    * Changes the title of the dialog.
    * @function
    * @name Dialog.title
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @param {Native.String} newTitle The new title of the dialog.
    */
    instance.title = function (newTitle) {
        var oldTitle = instance.titleValue;
        if (newTitle) {
            instance.titleValue = newTitle;
        } else {
            instance.titleValue = instance.originalTitleText;
        }
        if ((instance.titleValue.length * instance.style.charToPx) >
				(instance.style.titleCenterRect.w + instance.rect.w - instance.style.titleLeftRect.w - instance.style.titleRightRect.w)) {
            instance.titleTextNode.data = instance.titleValue.substring(0, instance.rect.w / instance.style.charToPx) + '...';
        } else {
            instance.titleTextNode.data = instance.titleValue;
            if (instance.taskElement) {
                instance.taskElement.updatetitle();
                Rendition.UI.refreshTaskBars();
            }
        }
        instance.eventlisteners_titleChanged([newTitle, oldTitle]);
        return instance.titleValue;
    }
    /**
    * Resize the dialog.  Accepts one argument of type {Rendition.UI.Rect}.
    * When no arguments are used the current instance's rect object is used.
    * @function
    * @name Dialog.updateRect
    * @memberOf Rendition.UI.Dialog.prototype
    * @public
    * @returns {Native.Boolean} false.
    * @param {Native.Object} ev The event object.
    */
    instance.updateRect = instance.resize = function (rect) {
        if (rect !== undefined) {
            instance.rect = rect;
        } else {
            rect = instance.rect;
        }
        var statusAdd = 0;
        var tabAdd = 0;
        var titleAdd = 0;
        var menuAdd = 0;
        statusAdd = instance.style.statusBarCenterRect.h;
        titleAdd = instance.style.titleCenterRect.h + instance.style.titleCenterRect.y;
        if (instance.windowState == 1) {
            instance.rect.w = document.documentElement.clientWidth;
            instance.rect.h = document.documentElement.clientHeight;
            instance.rect.x = 0;
            instance.rect.y = 0;
        }
        if ((instance.rect.x + 20) > document.documentElement.clientWidth) {
            instance.rect.x = document.documentElement.clientWidth - (instance.rect.w / 2);
        }
        if ((instance.rect.y + 20) > document.documentElement.clientHeight) {
            instance.rect.y = document.documentElement.clientHeight - (instance.rect.h / 2);
        }
        if (instance.rect.x >= instance.style.minimumRect.x) { instance.dialog.style.left = (instance.rect.x) + 'px'; }
        if (instance.rect.y >= instance.style.minimumRect.y) { instance.dialog.style.top = (instance.rect.y) + 'px'; }
        if (instance.rect.h >= instance.style.minimumRect.h) { instance.dialog.style.height = (instance.rect.h) + 'px'; }
        if (instance.rect.w >= instance.style.minimumRect.w) { instance.dialog.style.width = (instance.rect.w) + 'px'; }
        instance.title(instance.titleValue);
        instance.contentRect = {
            x: instance.style.contentRect.x,
            y: (instance.style.contentRect.y + titleAdd + menuAdd),
            h: (instance.rect.h + instance.style.contentRect.h - statusAdd - titleAdd - menuAdd),
            w: (instance.rect.w + instance.style.contentRect.w)
        }
        instance.content.style.top = instance.contentRect.y + 'px';
        instance.content.style.height = instance.contentRect.h + 'px';
        instance.content.style.width = instance.contentRect.w + 'px';
        instance.n.style.width = (instance.style.nRect.w + instance.rect.w) + 'px';
        instance.e.style.height = (instance.style.eRect.h + instance.rect.h) + 'px';
        instance.e.style.left = (instance.style.eRect.x + instance.rect.w - instance.style.eRect.w) + 'px';
        instance.w.style.height = (instance.style.wRect.h + instance.rect.h) + 'px';
        instance.s.style.width = (instance.style.sRect.w + instance.rect.w) + 'px';
        instance.s.style.top = (instance.style.sRect.y + instance.rect.h - instance.style.sRect.h) + 'px';
        instance.ne.style.left = (instance.style.neRect.x + instance.rect.w - instance.style.neRect.w) + 'px';
        instance.se.style.top = (instance.style.seRect.y + instance.rect.h - instance.style.seRect.h) + 'px';
        instance.se.style.left = (instance.style.seRect.x + instance.rect.w - instance.style.seRect.w) + 'px';
        instance.sw.style.top = (instance.style.swRect.y + instance.rect.h - instance.style.swRect.h) + 'px';
        instance.titleBarText.style.width = (instance.style.titleCenterRect.w + instance.rect.w - instance.style.titleLeftRect.w - instance.style.titleRightRect.w) + 'px';
        instance.titleBarCenter.style.width = (instance.style.titleCenterRect.w + instance.rect.w - instance.style.titleLeftRect.w - instance.style.titleRightRect.w) + 'px';
        instance.titleBarRight.style.left = (instance.style.titleRightRect.x + instance.rect.w - instance.style.titleRightRect.w) + 'px';
        if (!instance.modal || instance.modalCloseable) {
            instance.closeButton.style.left = (instance.style.closeRect.x + instance.rect.w) + 'px';
        }
        if (!instance.modal) {
            instance.restoreButton.style.left = (instance.style.restoreRect.x + instance.rect.w) + 'px';
            instance.maxButton.style.left = (instance.style.maxRect.x + instance.rect.w) + 'px';
            instance.minButton.style.left = (instance.style.minRect.x + instance.rect.w) + 'px';
        }
        instance.statusBarCenter.style.top = (instance.style.statusBarCenterRect.y + instance.rect.h - instance.style.statusBarCenterRect.h) + 'px';
        instance.statusBarCenter.style.width = (instance.style.statusBarCenterRect.w + instance.rect.w - instance.style.statusBarLeftRect.w - instance.style.statusBarRightRect.w) + 'px';
        instance.statusBarLeft.style.top = (instance.style.statusBarLeftRect.y + instance.rect.h - instance.style.statusBarLeftRect.h) + 'px';
        instance.statusBarRight.style.top = (instance.style.statusBarRightRect.y + instance.rect.h - instance.style.statusBarRightRect.h) + 'px';
        instance.statusBarRight.style.left = (instance.style.statusBarRightRect.x + instance.rect.w - instance.style.statusBarRightRect.w) + 'px';
        instance.eventlisteners_resize(null);
        return;
    }
    /**
    * Used interally handle the reisze mouse up events.
    * @function
    * @name Dialog.resizemouseup
    * @memberOf Rendition.UI.Dialog.prototype
    * @private
    */
    instance.resizemouseup = function () {
        Rendition.UI.removeEvent('mousemove', document.documentElement, instance.resizeDialog, true);
        Rendition.UI.removeEvent('mouseup', document.documentElement, instance.resizemouseup, true);
        instance.updateRect(instance.previewRect);
        document.documentElement.style.cursor = 'default';
        instance.preview.style.visibility = 'hidden';
        instance.preview.style.display = 'none';
        instance.eventlisteners_finishedResize(null);
        return;
    }
    /**
    * Used interally handle the reisze mouse up events.
    * @function
    * @name Dialog.getResizeArrays
    * @memberOf Rendition.UI.Dialog.prototype
    * @private
    * @param {Native.Object} ev The event object.
    * @param {Native.DHTMLElement} obj The object related to this event.
    */
    instance.getResizeArrays = function (ev, obj) {
        document.documentElement.style.cursor = obj.style.cursor;
        Rendition.UI.appendEvent('mouseup', document.documentElement, instance.resizemouseup, true);
        instance.mouseOffset = Rendition.UI.getMouseOffset(obj, ev);
        instance.resizeOffset = Rendition.UI.getRect(instance.dialog);
        instance.resizeObject = obj;
        instance.eventlisteners_startingResize(ev);
        return;
    }
    if (args.dontInit != true) {
        instance.init();
    }
    return instance;
}