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
* Style for the desktop.
* @constructor
* @name Rendition.UI.DesktopStyle
*/
Rendition.UI.DesktopStyle = function () {
	var instance = {}
	/**
	* Use JQuery to animate the dialogs when the appear and disappear.
	* @name DesktopStyle.animateDialogs
	* @memberOf Rendition.UI.DesktopStyle.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.animateDialogs = false;
	/**
	* The unique id of this instance.
	* @name DesktopStyle.id
	* @memberOf Rendition.UI.DesktopStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget. Returns RenditionDesktopStyle.
	* @name DesktopStyle.type
	* @memberOf Rendition.UI.DesktopStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionDesktopStyle';
	/**
	* The CSS background property of the desktop.
	* @name DesktopStyle.background
	* @memberOf Rendition.UI.DesktopStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.background = 'darkblue';
	/**
	* The offset rect of the desktop.  Looks like: { x: 0, y: 0, h: 0, w: 0 }
	* @name DesktopStyle.rect
	* @memberOf Rendition.UI.DesktopStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.rect = { x: 0, y: 0, h: 0, w: 0 }
	/**
	* When true the document.body scroll bar will be visible.  When false, the scroll bar will be hidden.
	* @name DesktopStyle.scroll
	* @memberOf Rendition.UI.DesktopStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.scroll = false;
	return instance;
}
/**
* Desktop that dialogs, icons, the main menu and the taskbar sit inside of.  
* You don't have to make an instance of desktop, one will be created when the document initializes.
* @constructor
* @name Rendition.UI.Desktop
* @param {Native.Object} [f_menuBar] Any <link xlink:href="Rendition.UI.MenuBar"/> to attach to the top of the desktop.
* @param {Native.Boolean} [f_style] <link xlink:href="desktop.desktopStyle"/> to use when creating this instance.
*/
Rendition.UI.Desktop = function (f_menuBar, f_style) {
    var instance = {}
    /**
    * unique id of this object.  Assigned automatcilly in this reg format /uid_UUID/
    * @name Desktop.id
    * @memberOf Rendition.UI.Desktop.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.id = 'uid_' + Rendition.UI.createId();
    /**
    * The type of object.  returns 'RenditionDesktop'
    * @name Desktop.type
    * @memberOf Rendition.UI.Desktop.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.type = 'RenditionDesktop';
    /**
    * Array of resize events attached to the desktop.
    * @name Desktop.resizeEvents
    * @memberOf Rendition.UI.Desktop.prototype
    * @type Native.Array
    * @private
    * @property
    */
    instance.resizeEvents = [];
    /**
    * The style used to render this instance.  Instance of <link xlink:href="desktop.desktopStyle"/>.
    * @name Desktop.style
    * @memberOf Rendition.UI.Desktop.prototype
    * @type Native.Object
    * @public
    * @property
    */
    if (f_style) {
        instance.style = f_style;
    } else {
        instance.style = Rendition.UI.deskStyle;
    }
    /**
    * Array of <link xlink:href="desktop.desktopIcons"/> used in this <link xlink:href="desktop.desktop"/>.
    * @name Desktop.icons
    * @memberOf Rendition.UI.Desktop.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.icons = [];
    instance.onStartedLoading = function () { return false }
    instance.onFinishedLoading = function () { return false }
    instance.index = Rendition.UI.desktops.length;
    Rendition.UI.desktops.push(instance);
    /**
    * The <link xlink:href="desktop.menuBar"/>, if any, used in this desktop.
    * @name Desktop.menuBar
    * @memberOf Rendition.UI.Desktop.prototype
    * @type Native.Object
    * @public
    * @property
    */
    instance.menuBar = f_menuBar;
    instance.onStartedLoading();
    /**
    * The main desktop DHTML element.
    * @name Desktop.desktop
    * @memberOf Rendition.UI.Desktop.prototype
    * @type Native.DHTMLElement
    * @private
    * @property
    */
    instance.desktop = document.createElement('div');
    instance.desktop.style.fontFamily = 'Trebuchet MS, Tahoma, Arial, Helvetica, Sans-serif';
    instance.desktop.parentObject = instance;
    instance.desktop.style.position = 'absolute';
    instance.desktop.style.top = instance.style.rect.y + 'px';
    instance.desktop.style.left = instance.style.rect.y + 'px';
    if (Rendition.UI.parameters.noDesktop == true) {
        instance.desktop.style.width = '0';
        instance.desktop.style.height = '0';
    } else {
        instance.desktop.style.width = instance.style.rect.w + document.documentElement.clientWidth + 'px';
        instance.desktop.style.height = instance.style.rect.h + document.documentElement.clientHeight + 'px';
        instance.desktop.style.background = instance.style.background;
        if (instance.style.scroll) {
            document.body.style.overflow = 'scroll';
        } else {
            document.body.style.overflow = 'hidden';
        }
        document.body.style.margin = '0';
    }
    instance.desktop.style.zIndex = Rendition.UI.topzindex; Rendition.UI.topzindex++;
    document.body.appendChild(instance.desktop);
    /**
    * Adds the <link xlink:href="desktop.taskBar"/> to the desktop.
    * @name Desktop.addTaskBar
    * @memberOf Rendition.UI.Desktop.prototype
    * @type Native.DHTMLElement
    * @private
    * @function
    * @returns {Native.Boolean} True.
    */
    instance.addTaskBar = function (objTaskBar) {
        instance.desktop.appendChild(objTaskBar.content);
        return true;
    }
    if (typeof document.body.style.MozUserSelect != 'undefined') {
        document.body.style.MozUserSelect = '-moz-none';
    } else {
        document.body.onselectstart = function () { return false; }
    }
    /**
    * Attach a procedure to an event.
    * @function
    * @name Desktop.addEventListener
    * @memberOf Rendition.UI.Desktop.prototype
    * @type Native.undefined
    * @param {Native.String} type The type of event to subscribe to.
    * @param {Native.Function} proc The function to call when the event is fired.
    * @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
    * @returns {Native.Object} undefined.
    * @public
    */
    instance.addEventListener = function (eventtype, proc, capture) {
        if (eventtype == 'resize') {
            instance.resizeEvents.push(proc);
        }
    }
    /**
    * Removes an event from subscription list.  The [proc] must match exactly the [proc] subscribed with.
    * @function
    * @name Desktop.removeEventListener
    * @memberOf Rendition.UI.Desktop.prototype
    * @type Native.undefined
    * @param {Native.String} type The type of event to subscribe to.
    * @param {Native.Function} proc The function to call when the event is fired.
    * @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
    * @returns {Native.Object} undefined.
    * @public
    */
    instance.removeEventListener = function (type, appendedFunction, capture) {
        Rendition.UI.removeEvent(type, window, appendedFunction, capture);
    }
    /**
    * Adds a <link xlink:href="desktop.dialog"/> to the desktop.  Used internally by the <link xlink:href="desktop.dialog"/> class.
    * @name Desktop.addDialogWindow
    * @memberOf Rendition.UI.Desktop.prototype
    * @type Native.DHTMLElement
    * @private
    * @function
    */
    instance.addDialogWindow = function (objDialogWindow) {
        Rendition.UI.dialogs.push(objDialogWindow);
        instance.desktop.appendChild(objDialogWindow.dialog);
        instance.desktop.appendChild(objDialogWindow.preview);
        if (objDialogWindow.modal) {
            instance.desktop.appendChild(objDialogWindow.modalBackground);
        }
        for (var x = 0; x < Rendition.UI.dialogs.length; x++) {
            Rendition.UI.dialogs[x].index = x;
        }
        Rendition.UI.refreshTaskBars();
        return true;
    }
    /**
    * Adds the <link xlink:href="desktop.taskBar"/> to the desktop.
    * @name Desktop.addMenuBar
    * @memberOf Rendition.UI.Desktop.prototype
    * @type Native.DHTMLElement
    * @private
    * @function
    * @returns {Native.Boolean} True.
    */
    instance.addMenuBar = function (menuBar) {
        menuBar.appendTo(instance.desktop);
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Desktop.onresize
    * @memberOf Rendition.UI.Desktop.prototype
    * @param {Native.Object} ev The event object.
    * @private
    * @returns {Native.Boolean} false.
    */
    instance.onresize = function (ev) {
        for (var x = 0; instance.resizeEvents.length > x; x++) {
            instance.resizeEvents[x].call(instance, R, instance);
        }
        return false;
    }
    /**
    * Arranges the icons into a grid.
    * @function
    * @name Desktop.arrangeIcons
    * @memberOf Rendition.UI.Desktop.prototype
    * @param {Native.Object} ev The event object.
    * @public
    * @returns {Native.Obect} undefined.
    */
    instance.arrangeIcons = function () {
        var l = instance.icons.length;
        var cHeight = document.documentElement.clientHeight;
        var cWidth = document.documentElement.clientWidth;
        var iconMarginLeft = 0;
        var iconMarginTop = 0;
        var marginX = 165;
        var marginY = 150;
        var iconSquare = 75;
        var cX = 0;
        var cY = 10;
        if (Rendition.UI.menuBarElements === undefined) {
            Rendition.UI.menuBarElements = [];
        }
        if (Rendition.UI.menuBarElements.length > 0) {
            var cY = 35;
        }
        for (var x = 0; l > x; x++) {
            var i = instance.icons[x];
            i.style.top = cY + 'px';
            i.style.left = cX + 'px';
            if (cX < cWidth - marginX) {
                cX += iconSquare + iconMarginLeft;
            } else {
                cX = iconMarginLeft;
                if (cY < cHeight - marginY) {
                    cY += iconMarginTop + iconSquare;
                }
            }
        }
    }
    /**
    * Resizes the desktop by updating the size of the desktop element and the menubar, arranges the icons
    * and calls event procedures.
    * @function
    * @name Desktop.resize
    * @memberOf Rendition.UI.Desktop.prototype
    * @param {Native.Object} ev The event object.
    * @private
    * @returns {Native.Object} undefined.
    */
    instance.resize = function () {
        instance.desktop.style.width = instance.style.rect.w + document.documentElement.clientWidth + 'px';
        instance.desktop.style.height = instance.style.rect.h + document.documentElement.clientHeight + 'px';
        instance.onresize();
        if (instance.menuBar) {
            instance.menuBar.resize();
        }
        instance.arrangeIcons();
    }
    /**
    * Starts moving the icon.
    * @function
    * @name Desktop.startMovingIcon
    * @memberOf Rendition.UI.Desktop.prototype
    * @param {Native.Object} ev The event object.
    * @private
    * @returns {Native.Object} undefined.
    */
    instance.startMovingIcon = function (e, icon) {
        instance.movingIcon = icon;
        var pos = Rendition.UI.getPosition(instance.desktop);
        var iconPos = Rendition.UI.getPosition(icon);
        var mousePos = Rendition.UI.mouseCoords(e);
        instance.offsetTop = (pos.y + (mousePos.y - iconPos.y));
        instance.offsetLeft = (pos.x + (mousePos.x - iconPos.x));
        Rendition.UI.appendEvent('mousemove', document.body, instance.moveIcon, true);
        Rendition.UI.appendEvent('mouseup', document.body, instance.stopMovingIcon, false);
    }
    /**
    * Moves the icon, fires while the mouse is moving.
    * @function
    * @name Desktop.moveIcon
    * @memberOf Rendition.UI.Desktop.prototype
    * @param {Native.Object} ev The event object.
    * @private
    * @returns {Native.Object} undefined.
    */
    instance.moveIcon = function (e) {
        var mousePos = Rendition.UI.mouseCoords(e);

    }
    /**
    * Stops moving the icon.
    * @function
    * @name Desktop.stopMovingIcon
    * @memberOf Rendition.UI.Desktop.prototype
    * @param {Native.Object} ev The event object.
    * @private
    * @returns {Native.Object} undefined.
    */
    instance.stopMovingIcon = function (e) {

    }
    /**
    * Starts up the desktop widget.
    * @function
    * @name Desktop.init
    * @memberOf Rendition.UI.Desktop.prototype
    * @param {Native.Object} ev The event object.
    * @private
    * @returns {Native.Object} undefined.
    */
    instance.init = function () {
        Rendition.UI.appendEvent('resize', window, instance.resize, false);
        var icons = document.createElement('div');
        instance.desktop.appendChild(icons);
        if (Rendition.UI.menuBarElements) {
            icons.style.marginTop = '35px';
            instance.menuElements = [];
            for (var x = 0; Rendition.UI.menuBarElements.length > x; x++) {
                instance.menuElements[x] = Rendition.UI.MenuOption();
                instance.menuElements[x].text = Rendition.UI.menuBarElements[x].text;
                instance.menuElements[x].proc = Rendition.UI.menuBarElements[x].proc;

                Rendition.UI.appendEvent('click', instance.menuElements[x], function (e) {
                    this.option.proc.apply(this, [e, this]);
                    return false;
                }, false);
                Rendition.UI.appendEvent('mouseover', instance.menuElements[x], function (e) {
                    if (Rendition.UI.contextMenus.length > 0) {
                        this.option.proc.apply(this, [e, this]);
                    }
                    return false;
                }, false);
            }
            if (Rendition.UI.menuBarElements.length > 0) {
                instance.menuBar = Rendition.UI.MenuBar({ options: instance.menuElements });
                instance.addMenuBar(instance.menuBar);
            }
        }
        Rendition.UI.appendEvent('click', instance.desktop, function () {
            for (var x = 0; Rendition.UI.icons.length > x; x++) {
                Rendition.UI.icons[x].i.style.border = 'dashed 1px transparent';
            }
        }, false);
        for (var x = 0; Rendition.UI.icons.length > x; x++) {
            var i = document.createElement('div');
            var m = document.createElement('img');
            i.onmousedown = function (e) {
                instance.startMovingIcon(e, i);
            }
            i.title = Rendition.UI.icons[x].message;
            i.style.verticalAlign = 'top';
            i.style.margin = '0';
            i.style.fontSize = '14px';
            i.style.padding = '0';
            i.style.textAlign = 'center';
            i.style.backgroundColor = 'transparent';
            i.style.width = '75px';
            i.style.color = 'black';
            m.style.display = 'block';
            m.style.margin = 'auto';
            m.style.height = '32px';
            m.style.width = '32px';
            i.style.position = 'absolute';
            i.style.cursor = 'default';
            i.style.border = 'dashed 1px transparent';
            if (typeof i.style.MozUserSelect != 'undefined') {
                i.style.MozUserSelect = '-moz-none';
            } else {
                i.onselectstart = function () { return false; }
            }
            i.innerHTML = Rendition.UI.icons[x].text;
            i.insertBefore(m, i.firstChild);
            m.src = Rendition.UI.icons[x].src;
            i.onclick = Rendition.UI.icons[x].proc;
            Rendition.UI.icons[x].i = i;
            icons.appendChild(i);
            instance.icons.push(i);
        }
        instance.arrangeIcons();

        if (Rendition.UI.parameters.clientServerSyncURL !== undefined) {
            Rendition.sync();
        }
        instance.onFinishedLoading();
    }
    instance.init();
    return instance;
}