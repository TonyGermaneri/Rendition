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
* Creates a <link xlink:href="Rendition.UI.Dialog"/> with a <link xlink:href="Rendition.UI.GroupBox"/>
* in it and an input with an <link xlink:href="Rendition.UI.InputSelectButton"/>.  When then user
* clicks the Ok button the <link xlink:href="Rendition.UI.InputSelectButton"/> validation is
* executed and if valid a callback procedure you provide as a parameter is executed.
* @constructor
* @name Rendition.UI.SelectButtonDialog
*/
Rendition.UI.SelectButtonDialog = function (args) {
	var instance = {}
	/**
	* The type of object. Returns RenditionSelectButtonDialog.
	* @name SelectButtonDialog.type
	* @memberOf Rendition.UI.SelectButtonDialog.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionSelectButtonDialog';
	instance.dialog =  Rendition.UI.dialogWindow({
		rect: { h: 145, w: 450, x: (document.documentElement.clientWidth * .5) - (450 * .5), y: 150 },
		title: args.title
	});
	if (args.boxTitle === undefined) {
		args.boxTitle = args.title;
	}
	if (args.inputTitle === undefined) {
		args.inputTitle = args.title;
	}
	if (args.buttonTitle === undefined) {
		args.buttonTitle = args.title;
	}
	instance.selectedValue = '';
	if (args.buttons === undefined) {
		instance.buttons = [
			document.createElement('button'),
			document.createElement('button')
		];
		instance.buttons[0].innerHTML = Rendition.Localization['SelectButtonDialog_Ok'].Title;
		instance.buttons[1].innerHTML = Rendition.Localization['SelectButtonDialog_Cancel'].Title;
		instance.buttons[1].onclick = function () {
			instance.dialog.close();
		}
		instance.submit = function () {
			if (instance.autoComplete.isValid()) {
				instance.dialog.close();
				instance.selectedValue = instance.input.value;
				if (args.callbackProcedure) {
					args.callbackProcedure.apply(this, [instance, instance.input]);
				}
			}
		}
		instance.buttons[0].onclick = instance.submit;
	} else {
		instance.buttons = args.buttons;
	}
	if (args.icon === undefined) {
		args.icon = 'img/icons/application_form_magnify.png';
	}
	instance.input = document.createElement('input');
	instance.autoComplete =  Rendition.UI.AutoComplete({
		input: instance.input,
		recordMismatchMessage: function () { return Rendition.Localization['SelectButtonDialog_This_must_match_a_vaule_from_the_column_x_in_the_table_above'].Title.replace('{0}',instance.ordName)},
		recordMismatchTitle: Rendition.Localization['SelectButtonDialog_Invalid_value'].Title,
		objectName: args.objectName,
		suffix: args.autoCompleteSuffix,
		matchSuffix: function () { return Rendition.UI.iif(args.matchSuffix !== undefined, args.matchSuffix, '') },
		mustMatchRecord: function () { return Rendition.UI.iif(args.mustMatchRecord !== undefined, args.mustMatchRecord, true) },
		autoComplete: function () { return Rendition.UI.iif(args.autoComplete !== undefined, args.autoComplete, true) },
		optionDisplayValue: function () { return Rendition.UI.iif(args.optionDisplayValue !== undefined, args.optionDisplayValue, ' <column' + args.ordinal + '>') },
		optionValue: function () { return Rendition.UI.iif(args.optionValue !== undefined, args.optionValue, '<column' + args.ordinal + '>') },
		forceValidation: false,
		supressBlur: true
	});
	Rendition.UI.appendEvent('keyup', instance.input, function (e) {
		if (e.keyCode === 13) {
			if (instance.autoComplete.isValid()) {
				instance.dialog.close();
				instance.selectedValue = instance.input.value;
				if (args.callbackProcedure) {
					args.callbackProcedure.apply(this, [instance, instance.input]);
				}
			}
		} else if (e.keyCode === 27) {
			instance.dialog.close();
		}
	}, false);
	instance.pairTable =  Rendition.UI.pairtable({
		rows: [
			[Rendition.UI.txt(args.inputTitle), instance.input]
		]
	});
	instance.groupBox = Rendition.UI.GroupBox({
		title: args.boxTitle,
		parentNode: instance.dialog.content,
		childNodes: [instance.pairTable.table]
	});
	for (var x = 0; instance.buttons.length > x; x++) {
		instance.buttons[x].style.margin = '4px';
		instance.dialog.content.appendChild(instance.buttons[x]);
	}

	instance.params = {
		callbackProcedure: function (selector) {
			instance.selectedValue = selector.selectedValue
			if (args.onSelect) {
				args.onSelect.apply(this, [this, selector, instance.input]);
			} else {
				instance.input.value = selector.selectedValue;
				instance.submit();
			}
		},
		title: args.buttonTitle,
		input: instance.input
	}
	$.extend(true, instance.params, args);
	instance.inputSelectButton = Rendition.UI.InputSelectButton(instance.params);
	instance.inputSelectButton.selectButtonDialog = instance;
	instance.input.focus();
	return instance;
}