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
* Creates a DHTML based confimation dialog.  Confirm dialog creates a dialog with two buttons by default, ok and cancel.
* You can bind procedures to these default buttons or you can add your own buttons, replacing the default buttons.
* This class may appear to have events but it does not have an addEventListener method.  The only
* way to bind to the default buttons is by using the [args.ontrue] or [args.onfalse] parameters respectivly during instantiation.
* @constructor
* @name Rendition.UI.ConfirmDialog
* @param {Native.Object} args Parameters for the confirmDialog.
* @param {Native.DHTMLElement} [args.trueButton] DHTML button element to replace the default true button.
* @param {Native.DHTMLElement} [args.falseButton] DHTML button element to replace the default false button.
* @param {Native.String} [args.trueButtonTitle='Ok'] innerHTML of the true button.
* @param {Native.String} [args.falseButtonTitle='Cancel'] innerHTML of the false button.
* @param {Native.String} [args.ontrue] Function The function that executes when the true button is clicked.
* @param {Native.String} [args.onfalse] Function The function that executes when the false button is clicked.
* @param {Native.String} [args.dialogRect] Object The rectange of the dialog.  Looks like {h:Integer,w:Integer,x:Integer,y:Integer}.
* @param {Native.String} [args.title='Confirm'] String The title of the dialog.
* @param {Native.String} [args.subTitle='Confirm'] String The sub title of the dialog.  This is the title of the <link xlink:href="Rendition.UI.GroupBox"/> class that the buttons are inside of.
* @param {Native.String} [args.modal=true] Boolean When true, the dialog will be in modal mode.
* @param {Native.String} [args.modalCloseable=true] Boolean When true, the dialog will have a close button when in modal mode.
* @param {Native.String} [args.message='Are you sure?'] String The message that will appear in the dialog.
* @param {Native.String} [args.content] DHTMLElement A replacement DHTML element that will appear where the group box containing the message and buttons appear.
* @param {Native.String} [args.buttons] Array An array of DHTML element buttons that will appear in place of the standard true and false buttons.
* @param {Native.String} [args.autosize=true] Boolean The message that will appear in the dialog.
* @example ///Create a confirm dialog that displays one of two alerts.///
*var foo = Rendition.UI.ConfirmDialog({
*	ontrue: function (e, confirmDialog) {
*		alert("unus");
*		confirmDialog.close();
*	},
*	onfalse: function (e, confirmDialog) {
*		alert("duo");
*		confirmDialog.close();
*	}
*});
* @example /// Create a custom list of buttons. ///
* // Create an array to hold the button elements //
* var bar = [];
* // Create an event for the buttons to execute //
* var clickEvent = function (e) {
*	alert(this.textContent);
*	foo.close();
*}
* // Create three buttons and add them to the bar array //
* var unus = document.createElement('button');
* unus.innerHTML = 'Unus';
* unus.onclick = clickEvent;
* bar.push(unus);
* var duo = document.createElement('button');
* duo.innerHTML = 'Duo';
* duo.onclick = clickEvent;
* bar.push(duo);
* var tres = document.createElement('button');
* tres.innerHTML = 'Tres';
* tres.onclick = clickEvent;
* bar.push(tres);
* // Create the confirmDialog //
* var foo = Rendition.UI.ConfirmDialog({
* 	buttons: bar
* });
*/
Rendition.UI.ConfirmDialog = function (args) {
	var instance = {}
	/**
	* The type of widget.  Returns RenditionConfirmDialog.
	* @name ConfirmDialog.type
	* @memberOf Rendition.UI.ConfirmDialog.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.type = 'RenditionConfirmDialog';
	if (args === undefined) {
		alert('no pramaters attached to confirmDialog');
		return null;
	}
	if (args.trueButton !== undefined && args.buttons === undefined) {
		instance.trueButton = args.trueButton;
	} else {
		instance.trueButton = document.createElement('button');
		instance.trueButton.style.margin = '4px';
		instance.trueButton.style.cssFloat = 'right';
		if (args.trueButtonTitle !== undefined) {
			instance.trueButtonTitle = args.trueButtonTitle
		} else {
			instance.trueButtonTitle = Rendition.Localization['ConfirmDialog_Ok'].Title;
		}
		instance.trueButton.innerHTML = instance.trueButtonTitle;
	}
	if (args.falseButton !== undefined && args.buttons === undefined) {
		instance.falseButton = args.trueButton;
	} else {
		instance.falseButton = document.createElement('button');
		instance.falseButton.style.margin = '4px';
		instance.falseButton.style.cssFloat = 'right';
		if (args.falseButtonTitle !== undefined) {
			instance.falseButtonTitle = args.falseButtonTitle
		} else {
			instance.falseButtonTitle = Rendition.Localization['ConfirmDialog_Cancel'].Title;
		}
		instance.falseButton.innerHTML = instance.falseButtonTitle;
	}
	if (args.onfalse !== undefined) {
		instance.falseFunction = function (e) {
			args.onfalse.apply(instance, [e, instance]);
		}
	} else {
		instance.falseFunction = function () {
			instance.dialog.close();
		}
	}
	if (args.ontrue !== undefined) {
		instance.trueFunction = function (e) {
			args.ontrue.apply(instance, [e, instance]);
		}
	} else {
		instance.trueFunction = function () {
			instance.dialog.close();
		}
	}
	if (args.dialogRect !== undefined) {
		instance.dialogRect = args.dialogRect;
	} else {
		instance.dialogRect = { x: (document.documentElement.clientWidth / 2) - 175, y: 105, h: 170, w: 350 }
	}
	if (args.title !== undefined) {
		instance.title = args.title;
	} else {
		instance.title = Rendition.Localization['ConfirmDialog_Confirm'].Title;
	}
	if (args.subTitle !== undefined) {
		instance.subTitle = args.subTitle;
	} else {
		instance.subTitle = Rendition.Localization['ConfirmDialog_Confirm'].Title;
	}
	if (args.modal !== undefined) {
		instance.modal = args.modal
	} else {
		instance.modal = true;
	}
	if (args.modalCloseable !== undefined) {
		instance.modalCloseable = args.modalCloseable
	} else {
		instance.modalCloseable = instance.modal
	}
	if (args.message !== undefined) {
		instance.message = args.message;
	} else {
		instance.message = Rendition.Localization['ConfirmDialog_Are_you_sure'].Title;
	}
	instance.dialog = Rendition.UI.dialogWindow({
		rect: instance.dialogRect,
		title: instance.title,
		modal: instance.modal,
		modalCloseable: instance.modalCloseable
	});
	/**
	* The dialog.  An instance of <link xlink:href="Rendition.UI.Dialog"/>.
	* @name ConfirmDialog.dialog
	* @memberOf Rendition.UI.ConfirmDialog.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	if (args.content !== undefined) {
		instance.dialog.content = args.content;
	} else {
		var d = document.createElement('div');
		d.innerHTML = instance.message;
		instance.groupbox = Rendition.UI.GroupBox({
			title: instance.subTitle,
			childNodes: [d],
			alwaysExpanded: true
		});
		instance.groupbox.appendTo(instance.dialog.content);
		if (args.buttons !== undefined) {
			for (var x = 0; args.buttons.length > x; x++) {
				args.buttons[x].style.margin = '4px 4px 0 4px';
				instance.dialog.content.appendChild(args.buttons[x]);
			}
		} else {
			instance.trueButton.onclick = instance.trueFunction;
			instance.falseButton.onclick = instance.falseFunction;
			instance.dialog.content.appendChild(instance.trueButton);
			instance.dialog.content.appendChild(instance.falseButton);
		}
	}
	if (args.autosize == true) {
		instance.dialog.autosize();
	}
	/**
	* Closes the dialog.
	* @function
	* @name ConfirmDialog.close
	* @memberOf Rendition.UI.ConfirmDialog.prototype
	* @private
	* @returns {Native.Object} null.
	*/
	instance.close = function () {
		if (instance.dialog) {
			instance.dialog.close();
		}
	}
	return instance;
}