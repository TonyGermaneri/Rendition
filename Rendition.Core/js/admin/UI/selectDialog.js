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
* Creates a <link xlink:href="Rendition.UI.Grid"/> that displays
* a recordset and allows the user to select a value which is then
* entered into an input at the bottom of the <link xlink:href="Rendition.UI.Dialog"/>.
* @constructor
* @name Rendition.UI.SelectDialog
* @param {Native.Object} args Parameters for the <link xlink:href="Rendition.UI.SelectDialog"/>.
* @param {Native.Integer} args.ordinal The column index to use when the user clicks on a row.
* @param {Native.Object} [args.rect] The <link xlink:href="Rendition.UI.Rect"/> of the <link xlink:href="Rendition.UI.Dialog"/>.
* @param {Native.String} [args.title='Select'] The title of the <link xlink:href="Rendition.UI.Dialog"/>.
* @param {Native.String} [args.fieldTitle='Selected:'] The text to the left of the DHTML input element with the value.
* @param {Native.String} [args.okButtonHTML='Ok'] The text in the Ok button.
* @param {Native.String} [args.cancelButtonHTML='Cancel'] The text in the Cancel button.
* @param {Native.Boolean} [args.modal=true] When true the <link xlink:href="Rendition.UI.Dialog"/> will be modal.
* @param {Native.Boolean} [args.modalCloseable=true] When true the modal <link xlink:href="Rendition.UI.Dialog"/> will have a close control box.
* @param {Native.Function} [args.callbackProcedure] A procedure to execute when the user clicks Ok
* and the <link xlink:href="Rendition.UI.AutoComplete"/> validation is successful.  Signature function(Object selectDialog).
* @param {Native.Boolean} [args.multiSelect=false] When true, multiple rows can be selected.
* @param {Native.String} args.objectName The name of the SQL object to connect to.
* @param {Native.String} args.suffix The suffix if any to append to the SQL object query.
* @param {Native.String} [args.matchSuffix] The suffix (where clause) used check if the value is an acceptable match to a value in the database.
* @param {Native.Boolean} [args.mustMatchRecord=false] When true force focus /w msg until value matches with a record.
* @param {Native.Boolean} [args.autoComplete=true] When true use the autocomplete function, or just use the validation procedures.
* @param {String|Function} [args.optionDisplayValue='&lt;column0&gt;'] Value that shows up on the drop down menu, &lt;column0&gt; will be replaced by the first column value etc.   When a function is passed, the function must return a string and will be evaluated after each request.
* @param {String|Function} [args.optionValue='&lt;column0&gt;'] Value that is returned to the field when an option is selected.  &lt;column0&gt; will be replaced by the first column value etc..   When a function is passed, the function must return a string and will be evaluated after each request.
* @param {Native.DHTMLElement} args.input The DHTML element to bind to.
* @example /// Create a select dialog that binds to an input and looks at the table users ///
* var foo = Rendition.UI.Dialog();
* var bar = document.createElement('input');
* foo.content.appendChild(bar);
* Rendition.UI.InputSelectButton({
*	callbackProcedure: function (selectDialog) {
*		bar.value = selectDialog.selectedValue;
*	},
*	input: bar,
*	objectName: 'users'
* });
*/
Rendition.UI.SelectDialog = function (args) {
	var instance = {}
	/**
	* The unique id of this instance.
	* @name SelectDialog.id
	* @memberOf Rendition.UI.SelectDialog.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of object. Returns RenditionInputSelectButton.
	* @name SelectDialog.type
	* @memberOf Rendition.UI.SelectDialog.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionSelectDialog';
	instance.ordinal = args.ordinal;
	var controlPosition = -85;
	var controlMarginTop = 3;
	if (args.rect !== undefined) {
		instance.rect = args.rect;
	} else {
		instance.rect = { x: (document.documentElement.clientWidth / 2) - 250, y: 105, h: 410, w: 500 }
	}
	instance.input = document.createElement('input');
	instance.okButton = document.createElement('button');
	instance.cancelButton = document.createElement('button');
	if (args.ordinal !== undefined) {
		instance.ordinal = args.ordinal;
	} else {
		instance.ordinal = 0;
	}
	if (args.title !== undefined) {
		instance.title = args.title;
	} else {
		instance.title = Rendition.Localization['SelectDialog_Select'].Title;
	}
	if (args.fieldTitle !== undefined) {
		instance.fieldTitle = args.fieldTitle;
	} else {
		instance.fieldTitle = Rendition.Localization['SelectDialog_Selected'].Title;
	}
	if (args.okButtonHTML !== undefined) {
		instance.okButtonHTML = args.okButtonHTML;
	} else {
		instance.okButtonHTML = Rendition.Localization['SelectDialog_Ok'].Title;
	}
	if (args.cancelButtonHTML !== undefined) {
		instance.cancelButtonHTML = args.cancelButtonHTML;
	} else {
		instance.cancelButtonHTML = Rendition.Localization['SelectDialog_Cancel'].Title;
	}
	if (args.modal !== undefined) {
		instance.modal = args.modal;
	} else {
		instance.modal = true;
	}
	if (args.modalCloseable !== undefined) {
		instance.modalCloseable = args.modalCloseable;
	} else {
		instance.modalCloseable = true;
	}
	instance.dialog = Rendition.UI.dialogWindow({
		rect: instance.rect,
		title: instance.title,
		modal: instance.modal,
		modalCloseable: instance.modalCloseable,
		autosize: true
	});
	instance.cutter =  Rendition.UI.CutterBar({
		parentNode: instance.dialog.content,
		autoResize: false,
		orientation: 1,
		position: instance.rect.h + controlPosition
	});
	instance.okButton.innerHTML = instance.okButtonHTML;
	instance.okButton.style.margin = controlMarginTop + 'px 5px 0 5px';
	instance.cancelButton.innerHTML = instance.cancelButtonHTML;
	instance.cancelButton.style.margin = controlMarginTop + 'px 5px 0 5px';
	instance.input.style.width = '200px';
	instance.input.style.margin = controlMarginTop + 'px 5px 0 5px';
	instance.cutter.cutters[1].innerHTML = '<div style="margin-top:1px;display:inline-block;">' + instance.fieldTitle + '</div>';
	instance.cutter.cutters[1].style.textAlign = 'right';
	instance.cutter.cutters[1].style.paddingTop = '1px';
	instance.cutter.cutters[1].style.fontSize = '12px';
	instance.cutter.cutters[1].appendChild(instance.input);
	instance.cutter.cutters[1].appendChild(instance.cancelButton);
	instance.cutter.cutters[1].appendChild(instance.okButton);
	instance.gridparams = {
		callbackProcedure: args.callbackProcedure,
		parentNode: instance.cutter.cutters[0],
		selectionMethod: Rendition.UI.iif(args.multiSelect, 3, 0),
		editMode: 0,
		afterloadcallback: function (e, grid, JSON) {
			instance.ordName = grid.headers[instance.ordinal].displayName;
			return;
		}
	}
	$.extend(true, instance.gridparams, args);
	instance.grid =  Rendition.UI.Grid(instance.gridparams);
	instance.autoComplete =  Rendition.UI.AutoComplete({
		input: instance.input,
		recordMismatchMessage: function () { return Rendition.Localization['SelectDialog_This_must_match_a_vaule_from_the_column_x_in_the_table_above'].Title.replace('{0}',instance.ordName) },
		recordMismatchTitle: Rendition.Localization['SelectDialog_Invalid_value'].Title,
		objectName: args.objectName,
		suffix: args.suffix,
		matchSuffix: function () { return Rendition.UI.iif(args.matchSuffix !== undefined, args.matchSuffix, '') },
		mustMatchRecord: function () { return Rendition.UI.iif(args.mustMatchRecord !== undefined, args.mustMatchRecord, true) },
		autoComplete: function () { return Rendition.UI.iif(args.autoComplete !== undefined, args.autoComplete, true) },
		optionDisplayValue: function () { return Rendition.UI.iif(args.optionDisplayValue !== undefined, args.optionDisplayValue, instance.ordName + ' <column' + instance.ordinal + '>') },
		optionValue: function () { return Rendition.UI.iif(args.optionValue !== undefined, args.optionValue, '<column' + instance.ordinal + '>') },
		forceValidation: false,
		supressBlur: true
	});
	instance.close = function () {
		instance.dialog.close();
		return false;
	}
	instance.dialog.addEventListener('resize', function () {
		instance.cutter.position = instance.dialog.rect.h + controlPosition;
		instance.cutter.updateRect();
	}, false);
	instance.grid.addEventListener('cellclick', function (e, grid, element, rowIndex, columnIndex, selection) {
		instance.selectedValue = grid.getRecord(rowIndex)[instance.ordinal];
		instance.input.value = instance.selectedValue;
	}, false);
	instance.grid.addEventListener('celldblclick', function (e, grid, element, rowIndex, columnIndex, selection) {
		instance.selectedValue = grid.getRecord(rowIndex)[instance.ordinal];
		instance.input.value = instance.selectedValue;
		instance.okButton.onclick();
	}, false);
	instance.cancelButton.onclick = function () {
		instance.close();
	}
	Rendition.UI.appendEvent('keyup', instance.input, function (e) {
		if (e.keyCode === 27) {
			instance.close();
		} else if (e.keyCode === 13) {
			setTimeout(function () {
				instance.okButton.onclick(); /* allow other attached events to fire before this one */
			}, 500);
		}
		var update = this;
		setTimeout(function () {
			instance.selectedValue = update.value;
		}, 0);
		return true;
	}, false);
	instance.okButton.onclick = function (e) {
		if (instance.autoComplete.isValid()) {
			instance.close();
			if (instance.gridparams.callbackProcedure) {
				instance.gridparams.callbackProcedure.apply(instance, [instance]);
			} else {
				args.input.value = instance.selectedValue;
				if (args.supressFocusEvent === false || args.supressFocusEvent === undefined) {
					args.input.focus();
				}
			}
			if (instance.selectButtonDialog !== undefined) {
				instance.selectButtonDialog.dialog.close();
			}
		}
	}
	setTimeout(function () {
		instance.input.focus();
	}, 10);
	return instance;
}
/**
* Creates a button next to a DHTML input element you provide as a parameter that when
* clicked creates a <link xlink:href="Rendition.UI.Dialog"/> with a <link xlink:href="Rendition.UI.Grid"/>
* in it that also contains an OK button and an input with an <link xlink:href="Rendition.UI.AutoComplete"/>
* bound to it with the same recordset.  When the user clicks OK and validation is successfull the value
* will be put into the DHTML input element you provided.
* that creates a <link xlink:href="Rendition.UI.SelectDialog"/>.
* Any parameters that work in <link xlink:href="Rendition.UI.SelectDialog"/> will work in this class.
* @constructor
* @name Rendition.UI.InputSelectButton
* @param {Native.Function} [args.callbackProcedure] A procedure to execute when the user clicks Ok
* @param {Native.DHTMLElement} args.input The DHTML element to bind to.
* @param {Native.Integer} args.width The width of the input element in PX.
*/
Rendition.UI.InputSelectButton = function (args) {
	var instance = {}
	/**
	* The type of object. Returns RenditionInputSelectButton.
	* @name InputSelectButton.type
	* @memberOf Rendition.UI.InputSelectButton.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionInputSelectButton';
	if (args.callbackProcedure === undefined) {
		instance.callbackProcedure = undefined;
	} else {
		instance.callbackProcedure = args.callbackProcedure;
	}
	if (args.input === undefined) {
		alert('no input bound to inputSelectButton function');
	}
	if (args.icon === undefined) {
		args.icon = 'img/icons/application_form_magnify.png';
	}
	instance.input = args.input;
	if (args.width !== undefined) {
		instance.input.style.width = args.width + 'px';
	}
	instance.callback = function (itemSelector) {
		instance.callbackProcedure.apply(this, [itemSelector, instance]);
	}
	instance.gridparams = { callbackProcedure: instance.callback }
	$.extend(true, instance.gridparams, args);
	instance.button = document.createElement('button');
	instance.button.innerHTML = Rendition.Localization['SelectDialog_Browse'].Title;
	Rendition.UI.appendEvent('click', instance.button, function (e) {
		instance.selectDialog =  Rendition.UI.SelectDialog(instance.gridparams);
		if (instance.selectButtonDialog !== undefined) {
			/*if this is the function that called this inputSelectButton*/
			instance.selectDialog.selectButtonDialog = instance.selectButtonDialog;
		}
	}, false);
	instance.getConnected = function () {
		if (instance.input.parentNode) {
			instance.input.parentNode.appendChild(instance.button);
		} else {
			setTimeout(instance.getConnected, Rendition.UI.waitToAttachTimeout);
		}
	}
	instance.init = function () {
		instance.getConnected();
	}
	instance.init();
	return instance;
}