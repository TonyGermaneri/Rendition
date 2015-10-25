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
* Creates a desktop and taskbar that contains the default icons.
* @function
* @name Rendition.UI.createDesktop
* @memberOf Rendition.prototype
* @param {Native.Object} ev The event object.
* @private
* @returns {Native.Object} undefined.
*/
Rendition.UI.createDesktop = function () {
	var d = Rendition.UI.Desktop();
	var t = Rendition.UI.TaskBar(d);
}
/**
* Creates an admin button that contains the default icons in a context menu.
* @function
* @name Rendition.UI.createAdminButton
* @memberOf Rendition.prototype
* @param {Native.Object} ev The event object.
* @private
* @returns {Native.Object} undefined.
*/
Rendition.UI.createAdminButton = function (buttonTitle) {
	var options = [];
	var pLength = Rendition.UI.icons.length;
	for (var x = 0; pLength > x; x++) {
	    options[x] = Rendition.UI.MenuOption();
	    options[x].text = Rendition.UI.icons[x].text;
	    options[x].proc = Rendition.UI.icons[x].proc;
	    Rendition.UI.appendEvent('click', options[x], function (e) {
	        this.option.proc.apply(this, [e, this]);
	        return false;
	    }, false);
	}
	var obj = document.createElement('button');
	obj.style.position = 'absolute';
	obj.style.top = '0';
	obj.style.left = '0';
	obj.innerHTML = buttonTitle || 'Admin';
	obj.onclick = function (e) {
	    new Rendition.UI.ContextMenu(e, {
	        elements: options,
	        caller: obj,
	        type: 'mouse'
	    });
	}
	document.body.appendChild(obj);
	Rendition.UI.TaskBar();
}
/**
* helpBox returns a little yellow help DIV that you can pass a string or a function to
* to fill with text/HTML.
* @function
* @public
* @name Rendition.UI.helpBox
* @param {String|Function} args The HTML or a function that returns a string of HTML.
* @returns {Native.DHTMLElement} DIV element
*/
Rendition.UI.helpBox = function (args) {
	if (args === undefined) { args = {} }
	if (args.message === undefined) { return null }
	var instance = document.createElement('div');
	instance.className = 'ui-corner-all info';
	instance.style.background = 'lightyellow';
	instance.style.border = 'solid 1px #777';
	instance.style.padding = '5px';
	instance.style.margin = '5px auto 5px auto';
	instance.style.width = '90%';
	instance.innerHTML = Rendition.UI.stringOrFunction(args.message, instance, [args]);
	if (args.parentNode !== undefined) {
	    args.parentNode.appendChild(instance);
	}
	return instance;
}
    /**
* Redraw the task bar.
* @function
* @public
* @name Rendition.UI.refreshTaskBars
* @returns {Native.undefined}
*/
Rendition.UI.refreshTaskBars = function () {
	var tLength = Rendition.UI.taskBars.length;
	for (var x = 0; x < tLength; x++) {
	    Rendition.UI.taskBars[x].refreshTaskElements();
	}
}
/**
* closes all context menus except the ansestors of the menu passed as the parameter.
* @function
* @public
* @param {Native.Object} e The menu that you don't want to close.
* @name Rendition.UI.closeContextMenus
* @returns {Native.undefined}
*/
Rendition.UI.closeContextMenus = function (e) {
	var closedMenus = [];
	var chain = [];
	var menuList = Rendition.UI.contextMenus;
	if (e) {
	    chain.push(e);
	    while (e) {
	        chain.push(e.parentNode);
	        e = e.parentNode;
	    }
	}
	for (var x = 0; menuList.length > x; x++) {
	    if (menuList[x]) {
	        var notInChain = true;
	        for (var y = 0; chain.length > y; y++) {
	            if (menuList[x] === chain[y]) {
	                notInChain = false;
	            }
	        }
	        if (notInChain && menuList[x].readyToClose) {
	            closedMenus.push(x);
	        }
	    }
	}
	for (var x = 0; closedMenus.length > x; x++) {
	    menuList[closedMenus[x]].close();
	}
	var stillAlive = false;
	for (var x = 0; Rendition.UI.contextMenus.length > x; x++) {
	    if (Rendition.UI.contextMenus[x]) {
	        stillAlive = true;
	    }
	}
	if (!stillAlive) {
	    Rendition.UI.contextMenus = [];
	}
}
/**
* Creates or appends to a <link xlink:href="Rendition.UI.Dialog"/> to hold log data for debugging.  Value is trimmed to the first 1000 characters.
* @function
* @public
* @param {Native.String} value Message to log
* @name Rendition.UI.log
* @returns {Native.undefined}
*/
Rendition.UI.log = function (value) {
	if (!Rendition.UI.logWindow) {
	    Rendition.UI.logWindow = Rendition.UI.dialogWindow({
	        rect: { x: 885, y: 34, h: 650, w: 250 },
	        title: Rendition.Localization['UIHelpers_Debug_Log'].Title
	    });
	    Rendition.UI.logWindow.content.style.overflow = 'scroll';
	    Rendition.UI.logWindow.content.style.fontSize = '11px';
	}
	if (value) {
	    var output = Rendition.UI.logWindow.content.innerHTML;
	    /* truncate the log if it's getting out of hand */
	    if (output.length > 1000) {
	        output = output.substring(0, 1000);
	    }
	    Rendition.UI.logWindow.content.innerHTML = value + '<br>' + output;
	}
	this.clear = function () {
	    Rendition.UI.logWindow.content.innerHTML = '';
	}
}
/**
* Display a block of error messages.  For use with submit order or other multi step error message.
* @name Rendition.UI.ConfirmErrors
* @constructor
* @public
* @param {Native.Object} args The arguments for the alert.
* @param {Native.Object} [args.dialogRect] The rectange the <link xlink:href="Rendition.UI.Dialog"/> will use.
* @param {Native.Boolean} [args.modal=false] When true the dialog will be modal.
* @param {Native.Boolean} [args.modalCloseable=false] When true the dialog will be closeable when modal.
* @param {String|Function|DHTMLObject} args.content The String, Function or DHTML element to apped to the alert.
* @param {Native.String} args.title The String, Function or DHTML element to apped to the alert.
* @example /// Create a big error message. ///
* Rendition.UI.ConfirmErrors("Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut " +
* "laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis " +
* "nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, " +
* "mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum " +
* "formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes " +
* "in futurum.", 'An error occured');
*/
Rendition.UI.ConfirmErrors = function (description, errorMessagePrefix) {
	var ok = Rendition.UI.button({ innerHTML: Rendition.Localization['UIHelpers_Ok'].Title, onclick: function (e, confirm) {
	    instance.errorDialog.dialog.close();
	    return;
	}
	});
	instance.errorDialog = Rendition.UI.ConfirmDialog({
	    message: '<textarea style="display:block;width:75%;height:135px;margin:auto;">' + description + '</textarea>',
	    subTitle: errorMessagePrefix,
	    title: errorMessagePrefix,
	    buttons: [ok],
	    dialogRect: { x: (document.documentElement.clientWidth * .5) - (Rendition.UI.saveChangesDialogWidth * .5), y: 75, h: 300, w: Rendition.UI.saveChangesDialogWidth },
	    autosize: true
	});
}
/**
* Uses <link xlink:href="Rendition.UI.Dialog"/> to create an alert.
* @name Rendition.UI.Alert
* @constructor
* @public
* @param {Native.Object} args The arguments for the alert.
* @param {Native.Object} [args.dialogRect] The <link xlink:href="Rendition.UI.Rect"/> the <link xlink:href="Rendition.UI.Dialog"/> will use.
* @param {Native.Boolean} [args.modal=false] When true the dialog will be modal.
* @param {Native.Boolean} [args.modalCloseable=false] When true the dialog will be closeable when modal.
* @param {String|Function|DHTMLObject} args.content The String, Function or DHTML element to apped to the alert.
* @param {Native.String} args.title The String, Function or DHTML element to apped to the alert.
* @example /// Create an alert. ///
* Rendition.UI.Alert({
*	content: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.'
* });
*/
Rendition.UI.Alert = function (args) {
	var instance = {}
	if (args.dialogRect !== undefined) {
	    instance.dialogRect = args.dialogRect;
	} else {
	    instance.dialogRect = { x: (document.documentElement.clientWidth / 2) - 175, y: 105, h: 170, w: 350 }
	}
	instance.dialog = Rendition.UI.dialogWindow({
	    rect: instance.dialogRect,
	    modal: args.modal || false,
	    modalCloseable: args.modalCloseable || false
	});
	if (typeof args.content === 'string') {
	    instance.dialog.content.innerHTML = args.content;
	    instance.dialog.title(Rendition.Localization['UIHelpers_Warning'].Title);
	} else if (typeof args.content === 'function') {
	    args.apply(instance, [e, instance, args]);
	} else if (typeof args.content === 'object') {
	    instance.dialog.content.appendChild(args.content);
	    instance.dialog.title(args.title);
	}
	return instance;
}
/**
* Gets the offset rect of a DHTML object using offsetTop, offsetWidth etc..
* @function
* @public
* @name Rendition.UI.getRect
* @param {Native.Object} obj The object to measure.
* @returns {Native.Object} Looks like: {x:obj.offsetLeft,y:obj.offsetTop,w:obj.offsetWidth,h:obj.offsetHeight}
*/
Rendition.UI.getRect = function (obj) {
	return { x: obj.offsetLeft, y: obj.offsetTop, w: obj.offsetWidth, h: obj.offsetHeight }
}
/**
* Creates a <link xlink:href="Rendition.UI.MenuBar"/> and uses
* a more simplistic and shorter method of creating 
* the <link xlink:href="Rendition.UI.MenuBar"/>.The 
* args object looks like
* <code language="JavaScript">
*	var foo = [
*		{
*			text:'blah',
*			mousedown:Function,
*			click:Function,
*			mouseover:Function,
*		}
*	]
* </code>
* @function
* @public
* @name Rendition.UI.menu
* @param {Native.Object} args Arguments object for this widgit.
* @param {Native.Object} parentNode The DHTML element to append to.
* @param {Native.Object} [type='menuBar'] makes the function 
* create an array of <link xlink:href="Rendition.UI.MenuOptionElement"/> objects
* or an <link xlink:href="Rendition.UI.MenuBar"/>.
* @returns {Native.Object} [<link xlink:href="Rendition.UI.MenuOptionElement"/>] or <link xlink:href="Rendition.UI.MenuBar"/>.
*/
Rendition.UI.menu = function (args, parentNode, type) {
	var l = args.length;
	var options = [];
	for (var x = 0; l > x; x++) {
	    options[x] = Rendition.UI.MenuOption();
	    options[x].text = args[x].text;
	    if (typeof args[x].checked === 'boolean') {
	        options[x].checked = args[x].checked;
	    } else if (typeof args[x].checked === 'function') {
	        options[x].checked = args[x].checked.apply(args[x], [args, parentNode, type]);
	    }
	    if (args[x].mousedown) {
	        Rendition.UI.appendEvent('mousedown', options[x], args[x].mousedown, false);
	    }
	    if (args[x].click) {
	        Rendition.UI.appendEvent('click', options[x], args[x].click, false);
	    }
	    if (args[x].mouseover) {
	        Rendition.UI.appendEvent('mouseover', options[x], args[x].mouseover, false);
	    }
	    if (args[x].childNodes !== undefined) {
	        options[x].childNodes = args[x].childNodes;
	        Rendition.UI.appendEvent('click', options[x], function (e) {
	            Rendition.UI.closeContextMenus(Rendition.UI.ContextMenu(e, {
	                elements: Rendition.UI.menu(this.option.childNodes, null, 'options'),
	                caller: this,
	                type: this.parentNode.type
	            }));
	            return false;
	        }, false);
	        Rendition.UI.appendEvent('mouseover', options[x], function (e) {
	            if (Rendition.UI.contextMenus.length > 0) {
	                if (this.parentNode.type !== 'RenditionContextMenu') {
	                    Rendition.UI.closeContextMenus();
	                }
	                Rendition.UI.ContextMenu(e, {
	                    elements: Rendition.UI.menu(this.option.childNodes, null, 'options'),
	                    caller: this,
	                    type: this.parentNode.type
	                });
	            }
	            return false;
	        }, false);
	    }
	}
	if (type == 'menuBar' || type === undefined) {
	    return Rendition.UI.MenuBar({
	        options: options,
	        parentNode: parentNode
	    });
	} else if (type == 'options') {
	    return options
	}
	return;
}
/**
* Creates an iframe using and <link xlink:href="Rendition.UI.Dialog"/>.
* and navigates to the args.src paramenter.
* @constructor
* @param {Native.Object} args The parameters for this widget.
* @param {Native.Object} [args.rect={x:10,y:10,w:800,h:600}] The rectangle of the 
* <link xlink:href="Rendition.UI.Dialog"/>.
* @param {Native.Boolean} args.modal When true the <link xlink:href="Rendition.UI.Dialog"/> will be modal.
* @param {Native.Boolean} args.modalCloseable When true the <link xlink:href="Rendition.UI.Dialog"/> 
* will have a close control box when in modal mode.
* @param {Native.String} src The target of the iframe.
* @public
* @name Rendition.UI.IFrameDialog
* @example /// Open an iframeDialog and point it at a web page ///
* var foo = Rendition.UI.IFrameDialog({
*	src: 'http://www.google.com',
*	title: 'Google'
* });
*/
Rendition.UI.IFrameDialog = function (args) {
	var instance = {}
	if (args.parentNode === undefined) {
	    instance.modal = false;
	    instance.modalCloseable = false;
	    instance.rect = {
	        x: 10,
	        y: 10,
	        w: 800,
	        h: 600
	    }
	    if (args.rect !== undefined) {
	        instance.rect = args.rect;
	    }
	    if (args.modal !== undefined) {
	        instance.modal = args.modal;
	    }
	    if (args.modal !== undefined) {
	        instance.modal = args.modal;
	    }
	    instance.dialog = Rendition.UI.dialogWindow({
	        rect: instance.rect,
	        modal: instance.modal,
	        modalCloseable: instance.modalCloseable,
	        title: args.title || Rendition.Localization['UIHelpers_iFrame'].Title
	    });
	    args.parentNode = instance.dialog.content;
	}
	instance.iframe = document.createElement('iframe');
	args.parentNode.appendChild(instance.iframe);
	instance.iframe.src = args.src;
	instance.resize = function () {
	    var targetRect = Rendition.UI.getRect(args.parentNode);
	    instance.iframe.height = targetRect.h + 'px';
	    instance.iframe.width = targetRect.w + 'px';
	    instance.iframe.style.height = targetRect.h + 'px';
	    instance.iframe.style.width = targetRect.w + 'px';
	}
	Rendition.UI.wireupResizeEvents(instance.resize, args.parentNode, false);
	setTimeout(instance.resize, 100);
	return instance;
}
/**
* Creates a <link xlink:href="Rendition.UI.Dialog"/>
* That displays a 'please wait' message.
* @constructor
* @public
* @borrows Rendition.UI.Dialog as Rendition.UI.UpdateDialog
* @param {Native.Object} args Parameters for the widget. 
* @param {Native.Object} [args.rect] Rectangle of the dialog. 
* @param {Native.Object} [args.title='Updating'] The title of the dialog. 
* @param {Native.Object} [args.subTitle='Please Wait...'] The sub title of the dialog. 
* @param {Native.Object} [args.message='Please wait while your task is completed'] The message in the dialog. 
*/
Rendition.UI.UpdateDialog = function (args) {
	if (args === undefined) { args = {} }
	instance = {}
	instance.updateDialog = Rendition.UI.dialogWindow({
	    rect: args.rect || {
	        x: (document.documentElement.clientWidth * .5) - (400 * .5),
	        y: (document.documentElement.clientHeight * .2),
	        w: 400,
	        h: 110
	    },
	    title: args.title || Rendition.Localization['UIHelpers_Updating'].Title,
	    alwaysOnTop: true
	});
	instance.updateDialog.groupBox = Rendition.UI.GroupBox({
	    title: args.subTitle || Rendition.Localization['UIHelpers_Please_Wait'].Title,
	    childNodes: [Rendition.UI.txt(args.message || Rendition.Localization['UIHelpers_Please_wait_while_your_task_is_completed'].Title)],
	    alwaysExpanded: true
	});
	instance.updateDialog.groupBox.appendTo(instance.updateDialog.content);
	return instance.updateDialog;
}