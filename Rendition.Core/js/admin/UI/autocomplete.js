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
* Creates a DHTML based autocomplete.  This class implements Rendition.UI.ContextMenu 
* to create a drop down menu when [args.autoComplete] is true.
* It also provides methods for validating user input against Regular Expresions and database records.
* Most all validation in Rendition is done using this class.
* @constructor
* @name Rendition.UI.AutoComplete
* @param {Native.Object} args Parameters for the widget.
* @param {Native.DHTMLElement}	args.input The DHTML element input to attach to
* @param {Native.String} args.objectName The object to scan
* @param {String|Function} [args.optionDisplayValue='&lt;column0&gt;'] Value that shows up on the drop down menu, &lt;column0&gt; will be replaced by the first column value etc.   When a function is passed, the function must return a string and will be evaluated after each request.
* @param {String|Function} [args.optionValue='&lt;column0&gt;'] Value that is returned to the field when an option is selected.  &lt;column0&gt; will be replaced by the first column value etc..   When a function is passed, the function must return a string and will be evaluated after each request.
* @param {Native.Boolean} [args.matchCase=false] When true, match the input value with the case of the recordset result.
* @param {Native.Integer} [args.matchPart=0] Is the substring match matching the begining of the string (left) or any part of the string. 0=match begining (left), 1=match any (left or right).
* @param {Native.Integer} [args.max=10] Maximum number of rows to show.
* @param {Native.Boolean} [args.autoComplete=true] When true use the autocomplete function, or just use the validation procedures.
* @param {Native.Boolean} [args.mustMatchRecord=false] When true force focus /w msg until value matches with a record.
* @param {Native.Boolean} [args.cantMatchRecord=false] When true force focus /w msg until value does not match any records.
* @param {String|Function} [args.mustMatchPattern] The Regular Expression the input value must match to be valid.   When a function is passed, the function must return a string and will be evaluated after each request.
* @param {String|Function} [args.recordMismatchMessage='The value you supplied does not exist in the database.'] Message that appears when mustMatchRecord or cantMatchRecord is true and the valid condition is not met.   When a function is passed, the function must return a string and will be evaluated after each request.
* @param {String|Function} [args.recordMismatchTitle='Field validation error'] Title that appears when mustMatchRecord or cantMatchRecord is true and the valid condition is not met.   When a function is passed, the function must return a string and will be evaluated after each request.
* @param {String|Function} [args.patternMismatchMessage='The value in this field does not match the pattern supplied (' + instance.mustMatchPattern + ').'] Message that appears when mustMatchPattern is true and the valid condition is not met.   When a function is passed, the function must return a string and will be evaluated after each request.
* @param {String|Function} [args.patternMismatchTitle='Field validation error'] Title that appears when mustMatchPattern is true and the valid condition is not met.  When a function is passed, the function must return a string and will be evaluated after each request.
* @param {Native.Boolean} [args.forceValidation=false] Keep user on the field even if the field is blank when it fails validation.
* @param {Native.Boolean} [args.supressBlur=false] Stops the blur function on the input from validating the field onblur, still validates on isValid().
* @param {Native.String} [args.suffix] The suffix (where clause) used to produce the close match list in the context menu.
* @param {Native.String} [args.matchSuffix] The suffix (where clause) used check if the value is an acceptable match to a value in the database.
* @param {Native.Function} [args.selectURL]  The URL the autocomplete class uses.  The function's signature is
* function(objectName, suffix, from, to, selectedRows,
* checksum, outputType, searchSuffix, includeSchema, orderBy, orderDirection, aggregateColumns).
* The result will be sent to the Rendition.UI.autocompleteCallback procedure which
* must return a <link xlink:href="Rendition.UI.DataSet"/>.
* The default function calls the C# Rendition.Admin.DataSet method.
* @param {Native.Function} [args.callback] This function processes the data returned from the server when the Rendition.UI.autocompleteURL
* is sent.  The type returned by this function must be a <link xlink:href="Rendition.UI.DataSet"/>.
* The signature of the function is 
* Function(XMLHttpRequest e, <link xlink:href="Rendition.UI.AutoComplete"/> autoComplete).
* The default function uses the C# Rendition.Admin.DataSet method.
* @example ///Bind autocomplete to an input and prevent invalid input.///
*var foo = Rendition.UI.Dialog();
*var input = document.createElement('input');
*var submit = document.createElement('button');
*var bar = Rendition.UI.AutoComplete({
*	mustMatchPattern: /^.+$/,
*	patternMismatchMessage: 'This field cannot be blank.',
*	patternMismatchTitle: 'Invalid Value.',
*	input: input
*});
*submit.innerHTML = 'Check validation';
*foo.content.appendChild(input);
*foo.content.appendChild(submit);
*submit.onclick = function () {
*	alert(bar.isValid());
*}
*});
*@example ///Bind autocomplete to an input.  Require the value to be present in the result of the query matching the object + suffix and require the value to match a pattern.///
*var foo = Rendition.UI.Dialog();
*var input = document.createElement('input');
*var submit = document.createElement('button');
*var bar = Rendition.UI.AutoComplete({
*	mustMatchPattern: /[0-9]+|^$/i,
*	patternMismatchMessage: 'This field can only contain the numbers 0-9.',
*	patternMismatchTitle: 'Invalid value.',
*	objectName: 'shortUserList',
*	suffix: "where userId like '%&lt;value&gt;%' or handle like '%&lt;value&gt;%' or email like '%&lt;value&gt;%'",
*	mustMatchRecord: true,
*	matchSuffix: "where userId = '&lt;value&gt;'",
*	autoComplete: true,
*	optionDisplayValue: '&lt;column0&gt; &lt;column1&gt;',
*	optionValue: '&lt;column0&gt;',
*	input: input
*});
*submit.innerHTML = 'Check validation';
*foo.content.appendChild(input);
*foo.content.appendChild(submit);
*submit.onclick = function () {
*	alert(bar.isValid());
*}
*/
Rendition.UI.AutoComplete = function (args) {
	var instance = {}
	/**
	* The type of object. Returns RenditionAutoComplete.
	* @name AutoComplete.type
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionAutoComplete';
	/**
	* The value in the context menu selected.
	* @name AutoComplete.selectedValue
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.selectedValue = -1;
	/**
	* Value matches the pattern.  This is only updated after isValid() is run.
	* @name AutoComplete.patternMatches
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.patternMatches = false;
	/**
	* Value matches a record.  This is only updated after isValid() is run.
	* @name AutoComplete.recordMatches
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.recordMatches = false;
	/**
	* The value is valid.  This is only updated after isValid() is run.
	* @name AutoComplete.valid
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.valid = false;
	/**
	* The info message is in the closed state.
	* @name AutoComplete.closed
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @type Native.Boolean
	* @private
	* @property
	*/
	instance.closed = false;
	/**
	* The records cached in this autocomplete instance.
	* @name AutoComplete.records
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @type Native.Array
	* @private
	* @property
	*/
	instance.records = [];
	var actual = '';
	var text = '';
	if (args.suffix === undefined) {
		args.suffix = '';
	}
	if (args.mustMatchPattern === undefined) {
		instance.mustMatchPattern = '';
	} else {
		instance.mustMatchPattern = args.mustMatchPattern;
	}
	if (args.forceValidation === undefined) {
		args.forceValidation = false;
	}
	if (args.mustMatchRecord === undefined) {
		args.mustMatchRecord = false;
	}
	if (args.cantMatchRecord === undefined) {
		args.cantMatchRecord = false;
	}
	if (args.patternMismatchTitle === undefined) {
		args.patternMismatchTitle = 'Field validation error';
	}
	if (args.recordMismatchTitle === undefined) {
		args.patternMismatchTitle = 'Field validation error';
	}
	if (args.patternMismatchMessage === undefined) {
		args.patternMismatchMessage = 'The value in this field does not match the pattern supplied (' + instance.mustMatchPattern + ').';
	}
	if (args.recordMismatchMessage === undefined) {
		if (args.mustMatchRecord) {
			args.recordMismatchMessage = 'The value you supplied does not exist in the database.';
		} else {
			args.recordMismatchMessage = 'The value you supplied already exists in the database.';
		}
	}
	if (args.matchCase === undefined) {
		/* not implemented on server for autocomplete, works for validation */
		args.matchCase = false;
	}
	if (args.matchPart === undefined) {
		/* 0 = only match the begining of the string.  1 = match any part */
		args.matchPart = 0;
	}
	if (args.max === undefined) {
		/* max number of rows to return */
		args.max = '';
	}
	/* if not defined, then always show autocomplete */
	if (args.autoComplete === undefined) {
		args.autoComplete = false;
	}
	instance.args = args;
	/**
	* Use this method to check if the value in the field has passed all validation tests.
	* @function
	* @name AutoComplete.isValid
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @public
	* @returns {Native.Boolean} When true the value in the input field is valid.
	*/
	instance.isValid = function (dontShowMessage) {
		instance.dontShowMessage = dontShowMessage;
		instance.showValidationMessage();
		return instance.valid;
	}
	/**
	* Show the validation message if the value is invalid.  Update the validation state against the local pattern match and remote dataset.
	* @function
	* @name AutoComplete.showValidationMessage
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @public
	* @returns {Native.Boolean} When true the value in the input field is valid.
	*/
	instance.showValidationMessage = function () {
		var pval = !!args.forceValidation;
		args.forceValidation = true;
		instance.onblur();
		args.forceValidation = pval;
	}
	/**
	* Used internally to create the URL used to check against the remote data source.
	* @function
	* @name AutoComplete.URL
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @private
	* @returns {Native.String} The URL.
	*/
	instance.URL = function (e, match) {
		if (args.suffix) {
			var f = Rendition.UI.stringOrFunction(args.suffix, [e, this]);
			f = f.replace(/<value>/g, instance.input.value.toString().s());
		}
		if (args.matchSuffix !== undefined) {
			var g = Rendition.UI.stringOrFunction(args.matchSuffix, [e, this]);
			g = g.replace(/<value>/g, instance.input.value.toString().s());
		}
		/* execute the Rendition.UI.autocompleteURL, passing the arguments to
		the function expecting to see the URI 
		signature :
		(objectName, suffix, from,
		to, searchSuffix, aggregateColumns, selectedRows, outputType, includeSchema,
		checksum, del, orderBy, orderDirection, instance)
		*/
		var dele = args.selectURL || Rendition.UI.autocompleteURL;
		try {
			var uri = dele.apply(instance, [
				args.objectName/*object name*/, Rendition.UI.iif(match, g, f)/*suffix*/, 0/*from*/,
				args.max || 10/*to*/, ""/*search suffix*/, {}/*agg cols*/,
				[]/*selected rows*/, 'JSON'/*outputType*/, true,
				-1/*checksum*/, false/*delete*/,
				args.orderBy || '', args.orderDirection || '', instance
			]);
		} catch (err) {
			alert("Error in delegate autocompleteURL > " + err.message);
			return "";
		}
		return uri;
	}
	/**
	* Used internally to reset the focus of the target input.
	* @function
	* @name AutoComplete.resetFocus
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.resetFocus = function () {
		setTimeout(function () {
			if (!Rendition.UI.movingFocus) {
				Rendition.UI.movingFocus = true;
				instance.input.focus();
				instance.input.select();
				instance.closed = false;
				setTimeout(function () {
					Rendition.UI.movingFocus = false;
				}, 0);
			} else {
				if (instance.info) {
					instance.info.hide();
				}
			}
		}, 0);
	}
	/**
	* Used internally to handle the input onblur event on the target field.
	* @function
	* @name AutoComplete.onblur
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.onblur = function (e) {
		instance.validationMessage = [];
		if (String(instance.mustMatchPattern).length > 0) {
			if (instance.input.value.trim().length == 0 && args.forceValidation == false) {
				instance.close();
				return false;
			}
			if (!instance.input.value.match(instance.mustMatchPattern)) {
				instance.valid = false;
				instance.validationMessage = [Rendition.UI.stringOrFunction(args.patternMismatchTitle, [e, this]), Rendition.UI.stringOrFunction(args.patternMismatchMessage, [e, this])];
				if (instance.dontShowMessage == false || instance.dontShowMessage === undefined) {
					instance.resetFocus();
					if (instance.info) {
						instance.info.hide();
						instance.info = null;
					}
					instance.info = Rendition.UI.Info({
						position: Rendition.UI.getPosition(instance.input),
						message: instance.validationMessage[1],
						title: instance.validationMessage[0]
					});
				}
				return false;
			} else {
				instance.valid = true;
			}
			instance.close();
			instance.hasFocus = false;
		}
		if (args.mustMatchRecord && args.autoComplete) {
			if (instance.reqEval) {
				instance.reqEval.abort();
			}
			instance.reqEval = Rendition.UI.Ajax(instance.URL(e, true), function (e) {
				/* execute the callback procedure */
				var cb = args.callback || Rendition.UI.autocompleteCallback;
				try {
					var ds = cb.apply(instance, [e, instance]);
				} catch (err) {
					alert("Error in delegate Rendition.UI.autocompleteCallback > " + err.message);
					return;
				}
				instance.dataSet = ds;
				instance.records = ds.data;
				instance.recordMatches = false;
				if (instance.records.length > 0) {
					instance.recordMatches = true;
				}
				if (instance.recordMatches == false) {
					instance.valid = false;
					instance.validationMessage = [Rendition.UI.stringOrFunction(args.recordMismatchTitle, [e, this, instance]), Rendition.UI.stringOrFunction(args.recordMismatchMessage, [e, this, instance])];
					if (instance.dontShowMessage == false || instance.dontShowMessage === undefined) {
						instance.resetFocus();
						if (instance.info) {
							instance.info.hide();
							instance.info = null;
						}
						/**
						* The info message that appears when the state is invalid. An instance of <link xlink:href="Rendition.UI.Info"/>.
						* @name AutoComplete.info
						* @memberOf Rendition.UI.AutoComplete.prototype
						* @type Native.Object
						* @public
						* @property
						*/
						instance.info = Rendition.UI.Info({
							position: Rendition.UI.getPosition(instance.input),
							message: instance.validationMessage[1],
							title: instance.validationMessage[0]
						});
					}
					return false;
				} else {
					instance.valid = true;
				}
				if (instance.reqEval) {
					instance.reqEval.abort();
				}
				instance.close();
				instance.hasFocus = false;
			}, instance, false);
		}
		if (args.cantMatchRecord && args.autoComplete) {
			if (instance.reqEval) {
				instance.reqEval.abort();
			}
			instance.reqEval = Rendition.UI.Ajax(instance.URL(e, true), function (e) {
				/* execute the callback procedure */
				var cb = args.callback || Rendition.UI.autocompleteCallback;
				try {
					var ds = cb.apply(instance, [e, instance]);
				} catch (err) {
					alert("Error in delegate Rendition.UI.autocompleteCallback > " + err.message);
					return;
				}
				instance.dataSet = ds;
				instance.records = ds.data;
				instance.recordMatches = false;
				if (instance.records.length > 0) {
					instance.recordMatches = true;
				}
				if (instance.recordMatches) {
					instance.valid = false;
					instance.validationMessage = [Rendition.UI.stringOrFunction(args.recordMismatchTitle, [e, this]), Rendition.UI.stringOrFunction(args.recordMismatchMessage, [e, this])];
					if (instance.dontShowMessage == false || instance.dontShowMessage === undefined) {
						instance.resetFocus();
						if (instance.info) {
							instance.info.hide();
							instance.info = null;
						}
						instance.info = Rendition.UI.Info({
							position: Rendition.UI.getPosition(instance.input),
							message: instance.validationMessage[1],
							title: instance.validationMessage[0]
						});
					}
					return false;
				} else {
					instance.valid = true;
				}
				if (instance.reqEval) {
					instance.reqEval.abort();
				}
				instance.close();
				instance.hasFocus = false;
			}, instance, false);
		}
	}
	/**
	* Force close the info message.
	* @function
	* @name AutoComplete.close
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @public
	* @returns {Native.Object} undefined.
	*/
	instance.close = function () {
		if (instance.reqEval) {
			instance.reqEval.abort();
		}
		if (instance.info) {
			instance.info.hide();
			instance.info = null;
		}
		instance.closed = true;

		if (instance.menu) {
			instance.menu.firstRun();
		}
		Rendition.UI.closeContextMenus();

	}
	/**
	* Force close the context menu.
	* @function
	* @name AutoComplete.disposeContextMenu
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @public
	* @returns {Native.Object} undefined.
	*/
	instance.disposeContextMenu = function () {
		if (instance.menu) {
			instance.menu.firstRun();
		}
		Rendition.UI.closeContextMenus();
		instance.options = [];
	}
	/**
	* Used internally to handle the target field keyup event.
	* @function
	* @name AutoComplete.keyup
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @public
	* @returns {Native.Object} undefined.
	*/
	instance.keyup = function (e) {
		instance.recordMatches = false;
		if (instance.input.value.length == 0) {
			instance.disposeContextMenu();
			return;
		}
		if (instance.input) {
			/* 
			13 = enter 
			27 = esc 
			37 = arrow left 
			38 = arrow up 
			39 = arrow right 
			40 = arrow down 
			9 = tab
			*/
			if (e.keyCode == 13) {
				if (instance.menu) {
					/* enter means pick last selected value */
					instance.input.value = instance.menu.elements[instance.selectedValue].option.actual;
					instance.disposeContextMenu();
				}
			} else if (e.keyCode == 9) {
				/* tab means close the stupid menu and leave user alone */
				if (instance.menu) {
					instance.menu.firstRun();
				}
				Rendition.UI.closeContextMenus();
				instance.options = [];
			} else if (e.keyCode == 38 || e.keyCode == 37) {
				if (instance.options) {
					if (instance.options.length > 1) {
						/*update the old entry to show it's not selected */
						instance.menu.elements[instance.selectedValue].blur();
						if (instance.selectedValue == 0) {
							instance.selectedValue = instance.options.length - 1;
						} else {
							instance.selectedValue--;
						}
						instance.menu.elements[instance.selectedValue].hover();
						instance.input.value = instance.menu.elements[instance.selectedValue].option.actual;
					}
				}
			} else if (e.keyCode == 40 || e.keyCode == 39) {
				if (instance.options) {
					if (instance.options.length > 1) {
						/*update the old entry to show it's not selected */
						instance.menu.elements[instance.selectedValue].blur();
						if (instance.selectedValue == instance.options.length - 1) {
							instance.selectedValue = 0;
						} else {
							instance.selectedValue++;
						}
						instance.menu.elements[instance.selectedValue].hover();
						instance.input.value = instance.menu.elements[instance.selectedValue].option.actual;
					}
				}
			} else if (e.keyCode == 27) {
				/* esc - just close everything and put the orignal value back in the field */
				instance.input.value = instance.originalValue;
				instance.disposeContextMenu();
			} else {
				/* if the key is any other key */
				instance.fetchingRecord = true;
				/* if the key comes down again before the previous request is complete then cancel the previous request */
				if (instance.reqEval) {
					instance.reqEval.abort();
				}
				instance.reqEval = Rendition.UI.Ajax(instance.URL(e), function (e) {
					/* execute the callback procedure */
					var cb = args.callback || Rendition.UI.autocompleteCallback;
					try {
						var ds = cb.apply(instance, [e, instance]);
					} catch (err) {
						alert("Error in delegate Rendition.UI.autocompleteCallback > " + err.message);
						return;
					}
					instance.dataSet = ds;
					instance.records = ds.data;
					instance.valid = true;
					if (instance.menu) {
						instance.menu.firstRun();
					}
					Rendition.UI.closeContextMenus();
					instance.options = [];
					var menuIndex = -1;
					for (var x = 0; instance.records.length > x; x++) {
						menuIndex++;
						instance.options[menuIndex] = Rendition.UI.MenuOption();
						if (args.optionDisplayValue === undefined) { args.optionDisplayValue = '<column0>' }
						if (args.optionValue === undefined) { args.optionValue = '<column0>' }
						var text = Rendition.UI.stringOrFunction(args.optionDisplayValue);
						var actual = Rendition.UI.stringOrFunction(args.optionValue);
						for (var y = 0; instance.dataSet.schema.columns > y; y++) {
							if (actual !== undefined && text !== undefined) {
								actual = actual.replace('<column' + y + '>', instance.records[x][y].trim());
								text = text.replace('<column' + y + '>', instance.records[x][y]);
							} else {
								actual = '';
								text = '';
							}
						}
						text = text.replace(/<column\d>/gi, '');
						instance.options[menuIndex].text = text;
						instance.options[menuIndex].actual = actual;
						instance.options[menuIndex].index = String(menuIndex);
						Rendition.UI.appendEvent('click', instance.options[menuIndex], function (e) {
							instance.input.value = this.option.actual;
						}, false);
					}
					if (instance.options.length > 0 && instance.hasFocus) {
						instance.menu = Rendition.UI.ContextMenu(e, {
							elements: instance.options,
							caller: instance.input,
							type: 'RenditionAutoComplete'
						});
						instance.selectedValue = 0;
						instance.menu.elements[instance.selectedValue].hover();
					}
					/* if the field lost foucs and the last recordset is just coming back, check once again for validation */
					if (!instance.hasFocus) {
						instance.onblur();
					}
					instance.fetchingRecord = false;
					instance.reqEval = null;
					return false;
				}, instance);
			}
		}
	}
	/**
	* Used internally to handle the target field keyup event.
	* @function
	* @name AutoComplete.init
	* @memberOf Rendition.UI.AutoComplete.prototype
	* @public
	* @returns {Native.Object} undefined.
	*/
	instance.init = function () {
		instance.input = args.input;
		instance.originalValue = String(instance.input.value);
		if (args.autoComplete) {
			Rendition.UI.appendEvent('focus', instance.input, function (e) {
				instance.hasFocus = true;
			}, instance);
			//Rendition.UI.appendEvent('keyup', instance.input, instance.keyup, false);
			Rendition.UI.appendEvent('keyup', instance.input, function (e) {
				if (instance.keyTimer) {
					clearTimeout(instance.keyTimer);
					instance.keyTimer = null;
				}
				instance.keyTimer = setTimeout(function () {
					instance.keyup(e);
				}, 250);
			}, instance);
		}
		if (args.supressBlur === undefined || args.supressBlur == false) {
			Rendition.UI.appendEvent('blur', instance.input, instance.onblur, instance);
		}
	}
	instance.init();
	return instance;
}