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
* <para>Creates one or more groups of editable controls.  This is the main function for editing single records in your MS SQL database.</para>
* <para>Form uses many other Rendition classes to produce a featureful form, such as autoComplete, grid, groupBox, info, 
* fileManager and many more. </para>
* <para>Form can use a local dataset with schema (data description) or it can connect to a MS SQL database and
* read schema information directly from the database.</para>
* <para>Form can read schema data from the MS SQL server and automatically create a form layout.
* But you can also define a layout that will use the schema data provided by the database.</para>
* <para>For Form to work with your custom object (table/view/procedure) your object must support
* the following:</para>
* <list class="bullet">
*	<listItem><para>Defines a Primary Key</para></listItem>
*	<listItem><para>Column named VerCol with the data type Timestamp. (A.K.A. Row Versioning or Timestamping)</para></listItem>
* </list>
* <p>Your object's columns can optionally have the following:</p>
* <list class="bullet">
*	<listItem><para>Extended Property: MS_Description.  Extended description of this column.</para></listItem>
*	<listItem><para>Extended Property: hidden.  0 = visible, 1 = hidden.  This default can be overridden at runtime. </para></listItem>
*	<listItem><para>Extended Property: displayName.  Human readable column title. 
*  When this property is not present the column name will be used instead.</para></listItem>
*	<listItem><para>Column named VerCol with the data type Timestamp.</para></listItem>
* </list>
* <p>Your object can optionally have the following:</p>
* <list class="bullet">
*	<listItem><para>Extended Property: displayName.  This value will appear in place of the table name on the form.</para></listItem>
* </list>
* <para>Form supplies methods for createing new records and reading and updaing existing records.  You can also use Form to create forms
* that are not connected to record sources, for example, to supply the arguments to a static function.  When used with a MS SQL data source
* Form can detect when the record has been updated on the server since last time Form  loaded the row data and give
* a warning dialog allwing the user to cancel out of the save procedure.</para>
* <para>The validation is handled by the Rendition.UI.AutoComplete class that can check against regular expressions or the presence of matching records on remote rowsets.  
* Even remote validation occurs synchronously so there is no need for complex callback procedures.</para>
* <para>Reading data from the form is done using the [Form.getInputByName] method to get an input or [Form.getInputValue] method to return a value.  
* You can validate the form using the [Form.isValid] method which returns a boolean.</para>
* <para>Note: Your objects title, description can be overridden using the Localization file.</para>
* @constructor
* @name Rendition.UI.Form
* @param {Native.Object} args Parameters for the widget.
* @param {Native.String} [args.validationMessage='One or more inputs are invalid.'] Message that appears above the list of invalid input messages.
* @param {Native.Boolean} [args.scroll=false] When true, a vertical scroll bar is added to the parent node when the form is appended.
* @param {Native.Boolean} [args.quiet=false] When true, info bubbles showing "Save Successful" will not appear when the form saves.
* @param {Native.String} [args.object] The MS SQL object (tabe/view/stored procedure) that is read from to get data and schema from.  
* If this value is not supplied the Object [Form.header] will no be populated with header schema information unless you use 
* the [Form.dataSet] parameter, an object used interally to the <link xlink:href="Rendition.UI.Grid"/>, <link xlink:href="Rendition.UI.TreeView"/> and <link xlink:href="Rendition.UI.Form"/> classes.
* @param {Native.String} [args.dataSet] This object is used internally by the <link xlink:href="Rendition.UI.Grid"/>, <link xlink:href="Rendition.UI.TreeView"/> and <link xlink:href="Rendition.UI.Form"/> classes 
* and can be passed back and forth between the classes to avoid making multiple requests or re-paramitizing functions.  
* You proabably shouldn't use this object unless you <legacyItalic>really</legacyItalic> know what you're doing.  
* You're better off using the [Form.object] paramater and/or the [Form.layout] parameter.
* @param {Native.String} [args.dataSetIndex=0] The record index, by row, in the provided dataSet to load in the editor.
* @param {Native.String} [args.suffix] A value that will be appended to the end of the select statement generated in the request for data.  
* This is the best way to select which record you want to edit in the form.  For instance, if I had a table called users with the primary 
* key userId I could add the suffix "where userId = 0" to select the user 0.  This suffix cannot execute insert, update, exec or delete commands for security reasons.
* @param {Native.Boolean} [args.smallTitles=false] When true, the input titles will be as smaller.  When false the input titles will be displayed normally.
* @param {Native.Boolean} [args.noTitles=false] When true, column holding the input titles will not be drawn.  When false the input titles will be displayed normally.
* @param {Native.Boolean} [args.titleWidth='100px'] You can set the width of the title column.  Setting this value on one input will cause all 
* inputs to draw at this width due to the way DHTML table elements are drawn.
* @param {Native.DHTMLElement} [args.parentNode] The DHTML element this form will append to when it is instantiated.
* @param {Native.Array} [args.layout] The layout of the form.  The layout is an array of expandable boxes (<link xlink:href="Rendition.UI.GroupBox"/>) elements that contain input elements.  
*  *<legacyItalic>n</legacyItalic> indicates a special note defined below this code section.
* <code language="JavaScript">
* [
*	{
*		name: &lt;String&gt;,
*		expanded: &lt;Boolean&gt;,
*		alwaysExpanded: &lt;Boolean&gt;
*		[
*			{
*				columnName: &lt;String&gt;, *1
*				inputType: &lt;String&gt;, *2,
*				language: &lt;String&gt; *6,
*				theme: &lt;String&gt; *7,
*				saveProcedure: &lt;Function&gt; *8,
*				name: &lt;String&gt;, *3
*				displayName &lt;String&gt;, *3
*				defaultValue: &lt;String&gt;, *3
*				isNullable: &lt;Boolean&gt;, *3
*				dataLength: &lt;Integer&gt;, *3
*				primaryKey: &lt;Boolean&gt;, *3
*				dataType: &lt;String&gt;, *3
*				value: &lt;String&gt;, *3
*				grid: &lt;Object&gt;, *4
*				rte: &lt;Object&gt;, *4
*				datePicker: &lt;Object&gt;, *4
*				fileManager: &lt;Object&gt;, *4
*				numericupdown: &lt;Object&gt;, *4
*				inputSelectButton: &lt;Object&gt;, *4
*				autoComplete: &lt;Object&gt;, *4
*				info: &lt;Object&gt;, *4
*				HTML: &lt;String|Function|DHTMLElement&gt; *5
*			},...
*		]
*	},...
* ]
*</code>
* <alert class="note">
* <p> This object is generated automatically when you are connecting to a MS SQL database rowset, but you can override it.  
* Any inputs existing in a database schema already have at least inputType, dataType, dataLength, primaryKey, isNullable, defaultValue defined in the 
* database schema.</p>
* <p><superscript>1</superscript> The form must have a remote record set (defined the [args.object] parameter) to use this key and the [columnName] key must 
* match a column in the remote schema.</p>
* <p><superscript>2</superscript> Can be any one of: checkbox, select, calendar, datePicker, fileManager, numericUpDown, numeric, textarea, text, hidden, 
* password, title, rte, codearea.  This will use defaults for these classes when the inputType paramater is used.  
* For more functionality use the class name directly. Viz. grid: {paramaters}.</p>
* <p><superscript>3</superscript> This key cannot be used on an input from a remote recordset.</p>
* <p><superscript>4</superscript> This key can accept any parameters the specified class can accept.  The parentNode will be overridden by the Form class to 
* attach the object to the form.  All other parameters are passed to the specified class instance.</p>
* <p><superscript>5</superscript> This key can be a string, function or DHTML element.  If a function is passed the function must return a string or a DHTML element. 
*  The function has no signature.</p>
* <p><superscript>6</superscript> This is for the syntax highlighting when inputType:codeArea is selected.  Can be csharp, css, html, javascript, svg or xml.</p>
* <p><superscript>7</superscript> This is the theme for the syntax highlighting.  
* Can be any one of: clouds, clouds_midnight, cobalt, dawn, eclipse, idle_fingers, kr_theme, 
* merbivore, merbivore_soft, mono_industrial, monokai, pastel_on_dark, twilight, vibrant_ink.</p>
* <p><superscript>8</superscript> When defined a button will appear in the codearea full screen mode that says 'save' and when clicked will run this procedure.</p>
* </alert>
* @example ///Create a dialog.  Create the form.  Add a simple save button.  Append the button to the dialog before the form///
*var foo = Rendition.UI.Dialog();
*var gen = Rendition.UI.Form({
*	object: 'users',
*	suffix: "where userId = 0",
*	parentNode: foo.content,
*	scroll: true
*});
*var sen = document.createElement('button');
*sen.innerHTML = 'Save';
*sen.onclick = function () {
*	gen.save();
*}
*foo.content.insertBefore(sen, gen.form);
* @example ///Create a dialog. Create a layout that alters the default layout. Create the form with the new layout.  Add a simple save button.  Append the button to the dialog before the form.///
*var foo = Rendition.UI.Dialog();
*var bar = [
*	{
*		name: 'User Base Info',
*		expanded: true,
*		inputs: [
*			{
*				columnName: 'userId'
*			},
*			{
*				columnName: 'handle'
*			}
*		]
*	},
*	{
*		name: 'Additional Info',
*		expanded: true,
*		inputs: [
*			{
*				columnName: 'lastVisit',
*				inputType: 'datePicker'
*			},
*			{
*				columnName: 'wouldLikeEmail'
*			},
*			{
*				columnName: 'comments',
*				inputType: 'rte'
*			}
*		]
*	}
*];
*var gen = Rendition.UI.Form({
*	object: 'users',
*	suffix: "where userId = 0",
*	parentNode: foo.content,
*	scroll: true,
*	groups: bar
*});
*var sen = document.createElement('button');
*sen.onclick = function () {
*	gen.save();
*}
*sen.innerHTML = 'Save';
*foo.content.insertBefore(sen, gen.form);
* @example ///Create a dialog. Create a layout without a database schema, add some Regular Expresion validation. Create the form with the new layout.  Add a simple save button that reads from the form.  Append the button to the dialog before the form. ///
*var foo = Rendition.UI.Dialog();
*var bar = [{
*	name: 'Claritas est etiam processus',
*	expanded: true,
*	inputs: [
*		{
*			name: 'loremIpsum',
*			displayName: 'Lorem Ipsum',
*			autoComplete: {
*				mustMatchPattern: /.+/,
*				patternMismatchMessage: 'This field cannot be blank'
*			}
*		},
*		{
*			name: 'dolorSit',
*			displayName: 'Dolor Sit',
*			fileManager: {
*				path: undefined
*			}
*		},
*		{
*			name: 'diamNonummy',
*			displayName: 'Diam Nonummy',
*			inputType: 'checkbox'
*		},
*		{
*			name: 'quiBlandit',
*			displayName: 'Qui Blandit',
*			inputType: 'select',
*			options: [
*				['option1value', 'Option 1 Text'],
*				['option2value', 'Option 2 Text']
*			]
*		}
*	]
*}];
*var gen = Rendition.UI.Form({
*	layout: bar,
*	parentNode: foo.content
*});
*gen.getInputByName('loremIpsum').value = 'Eodem modo typi, qui nunc nobis.';
*var sen = document.createElement('button');
*sen.innerHTML = 'Save';
*sen.onclick = function () {
*	if (!gen.isValid()) {
*		alert('Not Valid');
*		return;
*	}
*	var out = '';
*	out += gen.getInputByName('loremIpsum').value + '\n' +
*	gen.getInputByName('diamNonummy').checked + '\n' +
*	gen.getInputByName('quiBlandit').selectedIndex;
*	alert(out);
*}
*foo.content.insertBefore(sen, gen.form);
*/
Rendition.UI.Form = function (args) {
    /* replace the var 'groups' with 'layout' at some point */
    if (args.layout !== undefined) {
        args.groups = args.layout;
    }
    var instance = {}
    /**
    * The type of object. Returns RenditionForm.
    * @name Form.type
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.type = 'RenditionForm';
    /**
    * List of pair tables in this form.
    * @name Form.pairTables
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.pairTables = [];
    /**
    * List of group boxes in this form.
    * @name Form.groupBoxes
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.groupBoxes = [];
    /**
    * List of infos in this form.
    * @name Form.infos
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.infos = [];
    /**
    * List of inputs in this form.  Note: do not use this array to assign or get values from the form, use the [Form.getInputByName()] method instead.
    * @name Form.inputs
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.inputs = [];
    /**
    * List of selects in this form. Note: do not use this array to assign or get values from the form, use the [Form.getInputByName()] method instead.
    * @name Form.selects
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.selects = [];
    /**
    * List of textareas in this form. Note: do not use this array to assign or get values from the form, use the [Form.getInputByName()] method instead.
    * @name Form.textareas
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.textareas = [];
    /**
    * List of codeareas in this form. Note: do not use this array to assign or get values from the form, use the [Form.getInputByName()] method instead.
    * @name Form.codeareas
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.codeareas = [];
    /**
    * List of autoCompletes in this form. 
    * @name Form.autoCompletes
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.autoCompletes = [];
    /**
    * List of grids in this form.
    * @name Form.grids
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.grids = [];
    /**
    * List of rtes (Rich Text Editors) in this form. Note: do not use this array to assign or get values from the form, use the [Form.getInputByName()] method instead.
    * @name Form.rtes
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.rtes = [];
    /**
    * List of numericupdowns in this form. Note: do not use this array to assign or get values from the form, use the [Form.getInputByName()] method instead.
    * @name Form.numericupdowns
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.numericupdowns = [];
    /**
    * List of datePickers in this form. Note: do not use this array to assign or get values from the form, use the [Form.getInputByName()] method instead.
    * @name Form.datePickers
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.datePickers = [];
    /**
    * List of inputSelectButtons in this form. Note: do not use this array to assign or get values from the form, use the [Form.getInputByName()] method instead.
    * @name Form.inputSelectButtons
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.inputSelectButtons = [];
    /**
    * List of resizeableBoxes in this form.
    * @name Form.resizeableBoxes
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.resizeableBoxes = [];
    /**
    * List of fileManagers in this form.
    * @name Form.fileManagers
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.fileManagers = [];
    /**
    * The main container DIV element.  This is the element that is appended to the [args.parentNode] DHTML element.
    * @name Form.form
    * @memberOf Rendition.UI.Form.prototype
    * @type DHTML Element
    * @public
    * @property
    */
    instance.form = document.createElement('div');
    if (args.offsetRect !== undefined) {
        if (args.offsetRect.y != 0) {
            instance.form.style.marginTop = args.offsetRect.y + 'px';
        }
        if (args.offsetRect.x != 0) {
            instance.form.style.marginLeft = args.offsetRect.x + 'px';
        }
    }
    instance.editIndex = 0;
    instance.namedInputs = [];
    /**
    * List of invalid inputs in this form.
    * @name Form.invalidAutocompletes
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.invalidAutocompletes = [];
    /**
    * Message that appears when a record is trying to be commited but there is an invalid field.
    * @name Form.validationMessage
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.validationMessage = Rendition.Localization['Form_One_or_more_inputs_are_invalid'].Title || args.validationMessage;
    instance.log = function (msg) {
        if (console.log) {
            console.log(msg);
        }
    }
    if (args === undefined) {
        throw 'Form: no arguments defined.';
    }
    if (args.titleWidth === undefined) {
        args.titleWidth = '100px';
    }
    /**
    * Removes any refrences for this instance.
    * @function
    * @name Form.dispose
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.undefined
    * @public
    */
    instance.dispose = function () {
        if (instance.form.parentNode) {
            if (!instance.eventlisteners_dispose()) { return }
            instance.form.parentNode.removeChild(instance.form);
            instance.form = undefined;
            instance = undefined;
            return;
        }
    }
    /**
    * Attach a procedure to an event.  Usage foo.addEventListener('resize',function(e,foo){/*your procedure code},false)
    * @function
    * @name Form.addEventListener
    * @memberOf Rendition.UI.Form.prototype
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
            throw 'can\'t attach to event handler ' + type;
        }
        return null;
    }
    /**
    * Removes an event from subscription list.  The [proc] must match exactly the [proc] subscribed with.
    * @function
    * @name Form.removeEventListener
    * @memberOf Rendition.UI.Form.prototype
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
    * Used internally to add events used in the arugments of this instance.
    * @function
    * @name Form.addInitalEvents
    * @memberOf Rendition.UI.Form.prototype
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
    /**
    * Executes event subscriptions.
    * @function
    * @name Form.executeEvents
    * @memberOf Rendition.UI.Form.prototype
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
        arguments.unshift(e, element, instance);
        for (var x = 0; fLength > x; x++) {
            events[x].apply(this, arguments);
        }
        return instance.cancelDefault;
    }
    /**
    * Prevent the default event from occuring.  For use within an event handler.
    * @function
    * @name Form.preventDefault
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.undefined
    * @public
    */
    instance.preventDefault = function () {
        instance.cancelDefault = true;
    }
    /**
    * Used interally to keep track of events bound to this object.
    * @name Form.events
    * @memberOf Rendition.UI.Form.prototype
    * @type Native.Array
    * @private
    * @property
    */
    instance.events = {
        /**
        * Occurs when the widget is being disposed.
        * @event
        * @name Form.onresize
        * @memberOf Rendition.UI.Form.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} form The Form firing the event.
        */
        resize: instance.addInitalEvents(args.resize),
        /**
        * Occurs when the widget is being disposed.
        * @event
        * @name Form.ondispose
        * @memberOf Rendition.UI.Form.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} form The Form firing the event.
        */
        dispose: instance.addInitalEvents(args.dispose)
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Form.eventlisteners_resize
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Form.prototype
    */
    instance.eventlisteners_resize = function (e) {
        if (instance.executeEvents(instance.events.resize, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Form.eventlisteners_dispose
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    * @memberOf Rendition.UI.Form.prototype
    */
    instance.eventlisteners_dispose = function (e) {
        if (instance.executeEvents(instance.events.dispose, e, this)) { return false }
        return true;
    }
    /* end event listener functions */
    /**
    * Gets the header object by its name if the header object exists.  If no header matches the [headerName] parameter then [undefined] is returned.
    * @function
    * @name Form.getHeaderByName
    * @memberOf Rendition.UI.Form.prototype
    * @param {Native.String} headerName The name of the header.
    * @public
    * @returns {Native.Object} Header matching [headerName] parameter.
    */
    instance.getHeaderByName = function (headerName) {
        var l = instance.schema.columns;
        for (var y = 0; l > y; y++) {
            if (instance.header[y].name === headerName) {
                return instance.header[y];
            }
        }
        return undefined;
    }
    /**
    * Used internally to setup the attributes of each input in the form.
    * @function
    * @name Form.setAttributes
    * @memberOf Rendition.UI.Form.prototype
    * @param {Native.DHTMLElement} i The input.
    * @param {Native.Object} header The header.
    * @private
    * @returns {Native.Object} undefined.
    */
    instance.setAttributes = function (i, header) {
        if (!i.setAttribute || !header) { return null }
        i.setAttribute('originalValue', i.data || header.value);
        i.setAttribute('name', header.name);
        i.setAttribute('index', header.columnOrder);
        i.setAttribute('dataType', header.dataType);
        i.setAttribute('defaultValue', header.defaultValue);
        i.setAttribute('description', header.description);
        i.setAttribute('displayName', header.displayName);
        i.setAttribute('hidden', header.hidden);
        i.setAttribute('isNullable', header.isNullable);
        i.setAttribute('dataLength', header.dataLength);
        i.setAttribute('primaryKey', header.primaryKey);
    }
    /**
    * Gets the value data (last saved) values matching the parameter [columnName].  If no input is found then [null] is returned.  This is not the input value, to get the input value use getInputValue.
    * @function
    * @name Form.getValueByName
    * @memberOf Rendition.UI.Form.prototype
    * @param {Native.String} columnName The name of the data you want to get.
    * @public
    * @returns {Native.Object} The value of the data matching the parameter [columnName].  If no data matches the parameter then null is returned.
    */
    instance.getValueByName = function (columnName) {
        var l = instance.header.length;
        for (var x = 0; l > x; x++) {
            if (instance.header[x].name === columnName) {
                return instance.data[x];
            }
        }
        return null;
    }
    /**
    * Returns DHTML element matching the parameter [inputName].
    * @function
    * @name Form.getInputByName
    * @memberOf Rendition.UI.Form.prototype
    * @param {Native.String} columnName The name of the data you want to get.
    * @public
    * @returns {Native.DHTMLElement} The DHTML element matching the parameter [inputName].
    */
    instance.getInputByName = function (inputName) {
        var l = instance.codeareas.length;
        for (var y = 0; l > y; y++) {
            if (instance.codeareas[y].name === inputName) {
                var f = document.createElement('textarea');
                f.editor = instance.codeareas[y].editor;
                f.value = f.editor.getSession().getValue();
                f.onchange = function () {
                    this.editor.getSession().setValue(this.value);
                }
                return f;
            }
        }
        var l = instance.selects.length;
        for (var y = 0; l > y; y++) {
            if (instance.selects[y].name === inputName) {
                return instance.selects[y];
            }
        }
        var l = instance.textareas.length;
        for (var y = 0; l > y; y++) {
            if (instance.textareas[y].name === inputName) {
                return instance.textareas[y];
            }
        }
        var l = instance.rtes.length;
        for (var x = 0; l > x; x++) {
            if (instance.rtes[x].name === inputName) {
                var f = instance.rtes[x].value();
                instance.rtes[x].FormInput.value = f;
                return { value: String(instance.rtes[x].FormInput.value), type: "textarea", name: inputName }
            }
        }
        var l = instance.namedInputs.length;
        for (var y = 0; l > y; y++) {
            if (instance.namedInputs[y].name === inputName) {
                return instance.namedInputs[y];
            }
        }
        var l = instance.iin.length;
        for (var y = 0; l > y; y++) {
            if (instance.iin[y].name === inputName) {
                return instance.iin[y];
            }
        }
        return undefined;
    }
    /**
    * Returns an array of all the invalid inputs.  Viz. inputs who's autocomplete function returns invalid.
    * @function
    * @name Form.getInvalidInputs
    * @memberOf Rendition.UI.Form.prototype
    * @public
    * @returns {Native.Array} The DHTML element matching the parameter [inputName].
    */
    instance.getInvalidInputs = function () {
        var i = [];
        var l = instance.autoCompletes.length;
        for (var x = 0; l > x; x++) {
            if (instance.autoCompletes[x].isValid(true) == false) {
                i.push(instance.autoCompletes[x]);
            }
        }
        return i;
    }
    /**
    * Show a message with a list of invalid inputs. Viz. inputs who's autocomplete function returns invalid) and their validation messages.
    * @function
    * @name Form.showValidationMessage
    * @memberOf Rendition.UI.Form.prototype
    * @public
    * @returns {Native.DHTMLElement} The DHTML element matching the parameter [inputName].
    */
    instance.showValidationMessage = function () {
        var l = instance.invalidAutocompletes.length;
        var errorDesc = [];
        for (var x = 0; l > x; x++) {
            var extMsg = '';
            var a = instance.invalidAutocompletes[x];
            if (instance.invalidAutocompletes[x].validationMessage.length > 0) {
                extMsg = ':' + (a.validationMessage[0] || '') + ' - ' + (a.validationMessage[1] || '');
            }
            errorDesc.push((a.input.getAttribute('displayName') || a.input.name) + extMsg);
        }
        var ok = Rendition.UI.button({ innerHTML: 'Ok', onclick: function (e, confirm) {
            instance.errorDialog.dialog.close();
            return;
        }
        });
        instance.errorDialog = Rendition.UI.ConfirmDialog({
            message: Rendition.Localization['Form_The_following_fields_contain_validation_errors'].Message
            .replace('\n', '<br>').replace('{0}', errorDesc.join('<br>')),
            subTitle: Rendition.Localization['Form_Form_Validation_Error'].Title,
            title: Rendition.Localization['Form_Form_Validation_Error'].Title,
            buttons: [ok],
            dialogRect: { x: (document.documentElement.clientWidth * .5) - (Rendition.UI.saveChangesDialogWidth * .5), y: 75, h: 300, w: Rendition.UI.saveChangesDialogWidth },
            autosize: true
        });
    }
    /**
    * Checks each input containing an autocomplete to see if the input is valid.
    * @function
    * @name Form.isValid
    * @memberOf Rendition.UI.Form.prototype
    * @public
    * @returns {Native.Boolean} False when there are invalid inputs. True when there are no invalid inputs.  Viz. inputs who's autocomplete function returns invalid) and their validation messages.
    */
    instance.validate = instance.isValid = function () {
        var l = instance.autoCompletes.length;
        for (var x = 0; l > x; x++) {
            if (instance.autoCompletes[x].isValid() == false) {
                instance.autoCompletes[x].onblur();
                instance.invalidAutocompletes.push(instance.autoCompletes[x]);
                return false;
            }
        }
        return true;
    }
    /**
    * Used interally to fire resize events
    * @function
    * @name Form.resize
    * @memberOf Rendition.UI.Form.prototype
    * @private
    * @returns {Native.Object} undefined.
    */
    instance.resize = function () {
        for (var x = 0; instance.pairTables.length > x; x++) {
            var t = instance.pairTables[x].table;
            if (t.parentNode.offsetWidth == 0) {
                continue;
            }
            if (args.offsetRect !== undefined) {
                t.style.width = (t.parentNode.offsetWidth + args.offsetRect.w) + 'px';
            } else {
                t.style.width = t.parentNode.offsetWidth + 'px';
            };
        }
        for (var x = 0; instance.resizeableBoxes.length > x; x++) {
            instance.resizeableBoxes[x].resize();
        }
        for (var x = 0; instance.grids.length > x; x++) {
            instance.grids[x].resize();
        }
        for (var x = 0; instance.codeareas.length > x; x++) {
            instance.codeareas[x].editor.resize();
        }
        instance.eventlisteners_resize();
    }
    /**
    * Appends the form to a DHTML element.
    * @function
    * @name Form.appendTo
    * @memberOf Rendition.UI.Form.prototype
    * @param {Native.DHTMLElement} parentNode The DHTML element you want to append the form to.
    * @public
    * @returns {Native.Object} undefined.
    */
    instance.appendTo = function (parentNode) {
        if (!parentNode) {
            throw "Rendition.UI.Form.appendTo(parentNode) -> parentNode does not exist";
        }
        if (!parentNode.appendChild) {
            throw "Rendition.UI.Form.appendTo(parentNode) -> parentNode.appendChild does not exist";
        }
        if (!(typeof parentNode.appendChild == 'function')) {
            throw "Rendition.UI.Form.appendTo(parentNode) -> parentNode.appendChild is not a function";
        }
        if (args.scroll !== undefined) {
            parentNode.style.overflow = 'scroll';
            parentNode.style.overflowX = 'hidden';
            parentNode.style.overflowY = 'scroll';
        }
        parentNode.appendChild(instance.form);
        Rendition.UI.wireupResizeEvents(instance.resize, parentNode);
        for (var x = 0; instance.codeareas.length > x; x++) {
            var theme = instance.codeareas[x].theme || Rendition.codeareaTheme || 'vibrant_ink';
            var language = instance.codeareas[x].language || 'csharp';
            var a = ace.edit(instance.codeareas[x].id);
            a.getSession().setValue(instance.codeareas[x].value);
            a.setShowPrintMargin(false);
            a.setTheme("ace/theme/" + theme);
            var mode = require("ace/mode/" + language).Mode;
            a.getSession().setMode(new mode());
            instance.codeareas[x].editor = a;
            instance.codeareas[x].element.editor = a;
            instance.codeareas[x].element.parentNode.parentNode.parentNode.parentNode.parentNode.style.marginBottom = '-15px';
        }
        instance.resize();
    }
    /**
    * Gets the value of the input matching the [inputName] parameter.
    * @function
    * @name Form.getInputValue
    * @memberOf Rendition.UI.Form.prototype
    * @param {Native.String} inputName The input name of the input value you want to get.
    * @public
    * @returns {Native.String} The value of the input.
    */
    instance.getInputValue = function (inputName) {
        var input = instance.getInputByName(inputName);
        if (input.type == 'checkbox') {
            return input.checked;
        } else {
            return input.value;
        }
    }
    /**
    * Updates the [instance.data] value with the current input names.
    * @function
    * @name Form.updateInputs
    * @memberOf Rendition.UI.Form.prototype
    * @private
    * @returns {Native.Object} unknown.
    */
    instance.updateInputs = function () {
        for (var x = 0; instance.schema.columns > x; x++) {
            var header = instance.header[x];
            instance.data[x] = instance.getInputValue(header.name);
        }
    }
    /**
    * Used interally to create a CRUD structure to update the recordset.
    * @function
    * @name Form.crudStruct
    * @memberOf Rendition.UI.Form.prototype
    * @param {Native.String} [commandType=0] The type of command. 0 = update, 1 = insert, 2 = delete.
    * @param {Native.Boolean} [overwrite=false] When true, existing records will be overwritten without prompting.
    * @private
    * @returns {Native.String} The value of the input.
    */
    instance.crudStruct = function (commandType, overwrite) {
        if (commandType === undefined) { commandType = 0 }
        if (overwrite === undefined) { overwrite = false }
        instance.updateInputs();
        var d = [];
        for (var x = 0; instance.schema.columns > x; x++) {
            var header = instance.header[x];
            d.push({
                name: header.name,
                value: String(instance.data[x]).JSONEncode().toURI(),
                dataType: header.dataType,
                primaryKey: header.primaryKey,
                dataLength: header.dataLength
            });
        }
        return [
			'Crud',
			[
				instance.schema.name,
				d,
				overwrite,
				commandType
			]
		];
    }
    /**
    * Used interally to check if an input's value has changed from its original value.
    * @function
    * @name Form.checkIfInputValueIsDirty
    * @memberOf Rendition.UI.Form.prototype
    * @param {Native.Integer} x The header ordinal of the input.
    * @private
    * @returns {Native.String} The value of the input.
    */
    instance.checkIfInputValueIsDirty = function (x) {
        var header = instance.header[x];
        if (header.dataType == 'money' || header.dataType == 'int' ||
		header.dataType == 'float' || header.dataType == 'real') {
            if (parseFloat(instance.data[x]) != parseFloat(instance.getInputValue(header.name))) {
                return true;
            }
        } else if (header.dataType == 'datetime') {
            if (instance.data[x].toString() != Rendition.UI.parseSQLDate(instance.getInputValue(header.name)).toString()) {
                return true;
            }
        } else if (header.dataType != 'bit') {
            if (instance.data[x] != instance.getInputValue(header.name)) {
                return true;
            }
        } else {
            if (instance.data[x].bitToBool() != instance.getInputValue(header.name)) {
                return true;
            }
        }
        return false;
    }
    /**
    * Checks the form to see if the original values are the same as the current values.  false = The input values match the original data, true = The inputs do not match the original data.
    * @function
    * @name Form.dirty
    * @memberOf Rendition.UI.Form.prototype
    * @public
    * @returns {Native.Boolean} When true, more or one inputs do not match the original value of the form.
    */
    instance.dirty = function () {
        for (var x = 0; instance.schema.columns > x; x++) {
            if (instance.checkIfInputValueIsDirty(x)) {
                return true;
            }
        }
        return false;
    }
    /**
    * Checks to see if the remote recordset has changed since the form was loaded and provides a dialog to allow the user to cancel out of the save procedure.
    * @function
    * @name Form.checkSaveState
    * @memberOf Rendition.UI.Form.prototype
    * @param {Native.Object} dialogArgs The arguments for the dialog.
    * @private
    * @returns {Native.Object} undefined.
    */
    instance.checkSaveState = function (dialogArgs) {
        if (instance.dirty()) {
            var yes = Rendition.UI.button({ innerHTML: Rendition.Localization['Form_CheckSaveState_Yes'].Title, onclick: function (e, confirm) {
                instance.saveDialog.close();
                instance.save(false, 0, function () {
                    if (dialogArgs.yes !== undefined) {
                        dialogArgs.yes.apply(instance, [instance]);
                    }
                });
                return;
            }
            });
            var no = Rendition.UI.button({ innerHTML: Rendition.Localization['Form_CheckSaveState_No'].Title, onclick: function (e, confirm) {
                instance.saveDialog.dialog.close();
                if (dialogArgs.no !== undefined) {
                    dialogArgs.no.apply(instance, [instance]);
                }
                return;
            }
            });
            var cancel = Rendition.UI.button({ innerHTML: Rendition.Localization['Form_CheckSaveState_Cancel'].Title, onclick: function (e, confirm) {
                instance.saveDialog.close();
                if (dialogArgs.cancel !== undefined) {
                    dialogArgs.cancel.apply(instance, [instance]);
                }
                return;
            }
            });
            instance.saveDialog = Rendition.UI.ConfirmDialog({
                message: Rendition.Localization['Form_Do_you_want_to_save_your_changes_now'].Message.replace('\n', '<br>'),
                subTitle: Rendition.Localization['Form_Save_changes'].Title,
                title: Rendition.Localization['Form_Save_changes_before_closing'].Title,
                buttons: [yes, no, cancel],
                dialogRect: { x: (document.documentElement.clientWidth * .5) - (750 * .5), y: 75, h: 200, w: 750 },
                autoSize: true
            });
        } else {
            if (dialogArgs.clean !== undefined) {
                dialogArgs.clean.apply(instance, [instance]);
            }
            return;
        }
    }
    /**
    * Saves the local form to the remote dataset.  A comfermation dialog will appear if the form data has changed on the server allowing the user to cancel out of the save function.
    * @function
    * @name Form.save
    * @memberOf Rendition.UI.Form.prototype
    * @param {Native.Boolean} [overwrite=false] When true, existing records will be overwritten without prompting.
    * @param {Native.Integer} [commandType=0] The type of save command. 0 = update, 1 = insert, 2 = delete.
    * @param {Native.Function} [callbackProcedure] The procedure to execute when the save function is successful.
    * @param {Native.Boolean} [async=true] When true the save function will execute asynchronously.  When false the save function will execute synchronously.
    * @public
    * @returns {Native.Object} undefined.
    */
    instance.save = function (overwrite, commandType/*0:update 1:insert 2:delete*/, callbackProcedure, async) {
        var method1Struct = instance.crudStruct(commandType);
        if (async === undefined) { async = true }
        if (overwrite == true) {
            method1Struct[1][2] = true;
        }
        if (instance.validate()) {
            var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(method1Struct), function (e) {
                var a = JSON.parse(e.responseText);
                if (a.method1.error !== undefined) {
                    alert(a.method1.description);
                    return;
                }
                a = a.method1.Crud;
                if (a.error == 0) {
                    var pos = { x: 4, y: 4 }
                    if (args.quiet != true) {
                        var info = Rendition.UI.Info({
                            timeout: 1500,
                            position: pos,
                            title: Rendition.Localization['Form_Save_Successful'].Title,
                            message: Rendition.Localization['Form_Saved'].Title
                        });
                    }
                    for (var x = 0; instance.schema.columns > x; x++) {
                        if (instance.header[x].name == "VerCol") {
                            instance.data[x] = a.verCol;
                        }
                    }
                    instance.getInputByName("VerCol").value = a.verCol;
                    if (callbackProcedure !== undefined) {
                        callbackProcedure.apply(instance, [instance, a]);
                    }
                } else if (a.error == -2) {
                    alert(Rendition.Localization['Form_record_no_longer_exists'].Title);
                } else if (a.error == -1) {
                    var yes = Rendition.UI.button({ innerHTML: Rendition.Localization['Form_save_Yes'].Title, onclick: function (e, confirm) {
                        instance.save(true);
                        instance.confirmDialog.close();
                        return;
                    }
                    });
                    var no = Rendition.UI.button({ innerHTML: Rendition.Localization['Form_save_No'].Title, onclick: function (e, confirm) {
                        /*todo: make generic form refresh */
                        instance.confirmDialog.dialog.close();
                        return;
                    }
                    });
                    var cancel = Rendition.UI.button({ innerHTML: Rendition.Localization['Form_save_Cancel'].Title, onclick: function (e, confirm) {
                        instance.confirmDialog.dialog.close();
                        return;
                    }
                    });
                    instance.confirmDialog = Rendition.UI.ConfirmDialog({
                        message: Rendition.Localization['Form_This_record_has_changed'].Message.replace('\n', '<br>'),
                        subTitle: Rendition.Localization['Form_Data_updated_since_last_refresh'].Title,
                        title: Rendition.Localization['Form_Data_Timestamp_Mismatch'].Title,
                        buttons: [yes, no, cancel],
                        dialogRect: { x: (document.documentElement.clientWidth * .5) - (620 * .5), y: 75, h: 200, w: 620 },
                        autoSize: true
                    });
                } else {
                    var ok = Rendition.UI.button({ innerHTML: 'Ok', onclick: function () { instance.confirmDialog.dialog.close(); } });
                    instance.confirmDialog = Rendition.UI.ConfirmDialog({
                        message: a.description + '\n' +
						Rendition.Localization['Form_serverError_Click_ok_to_return_to_editing'].Title,
                        subTitle: Rendition.Localization['Form_Internal_Server_error'].Title,
                        title: Rendition.Localization['Form_serverError_Error'].Title + a.error + '.',
                        buttons: [ok],
                        autoSize: true
                    });
                    var c = instance.confirmDialog.dialog.content;
                    var rect = Rendition.UI.getRect(c);
                }
                return false;
            }, instance, async);
        }
    }
    /**
    * Initalizes the form.
    * @function
    * @name Form.init
    * @memberOf Rendition.UI.Form.prototype
    * @public
    * @returns {Native.Object} undefined.
    */
    instance.init = function () {
        if (args.dataSet !== undefined || args.object !== undefined) {
            /* if args.object was supplied then the request must be made now */
            if (args.object !== undefined) {
                /* do a sync request */
                instance.suffix = '';
                if (args.suffix !== undefined) {
                    instance.suffix = args.suffix;
                }
                /* This is the custom request object for Rendition.  If you're trying to reuse this code, this 30 line condition is where you'd put your ajax request for remote data. */
                var req1 = ["DataSet",
					[args.object, instance.suffix, '1', '1', '', {}, [], 'JSON', true, '-1', false, '', '']
				]
                var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI();
                var reqEval = Rendition.UI.Ajax(url, function (e) {
                    var a = JSON.parse(e.responseText);
                    args.dataSet = a.method1.DataSet;
                }, instance, false/*sync*/);
            }
            instance.schema = args.dataSet.schema;
            instance.header = args.dataSet.header;
            /* parse data into JS */
            args.dataSet.data = Rendition.UI.parseDataTypes(args.dataSet.data, instance.header);
            instance.data = args.dataSet.data[args.dataSetIndex || 0];

            /**
            * Used interally to keep track of the unchanged original inputs.  These inputs keep the 'original' state data.  Used to check if the form is in a dirty (unsaved) state.
            * @name Form.iin
            * @memberOf Rendition.UI.Form.prototype
            * @type Native.Array
            * @private
            * @property
            */
            instance.iin = [];
            for (var x = 0; instance.schema.columns > x; x++) {
                if (instance.header === undefined) { return null }
                var i = document.createElement('input');
                i.style.display = 'inline-block';
                var header = instance.header[x];
                var d = header.dataType;
                i.name = header.name;
                if (d == 'bit') {
                    i.type = 'checkbox';
                    i.checked = String(instance.data[x]).bitToBool();
                } else if (d == 'int' || d == 'bigint') {
                    i.value = parseInt(instance.data[x]);
                } else if (d == 'money' || d == 'float' || d == 'real') {
                    i.value = parseFloat(instance.data[x]);
                } else if (d == 'datetime') {
                    i.value = Rendition.UI.formatDate(instance.data[x], 'mm/dd/yyyy HH:nn:ss A');
                } else {
                    i.value = instance.data[x];
                }
                i.data = instance.data[x];
                instance.iin.push(i);
            }
        } else {
            /**
            * Schema data for this record.
            * @name Form.schema
            * @memberOf Rendition.UI.Form.prototype
            * @type Native.Object
            * @private
            * @property
            */
            instance.schema = { columns: 0 }
            /**
            * Array of headers (individual column schemas) in this instance.
            * @name Form.header
            * @memberOf Rendition.UI.Form.prototype
            * @type Native.Object
            * @private
            * @property
            */
            instance.header = [];
            /**
            * Data row for this instance.
            * @name Form.data
            * @memberOf Rendition.UI.Form.prototype
            * @type Native.Object
            * @private
            * @property
            */
            instance.data = [];
            instance.iin = [];
        }
        var l = instance.iin.length;
        if (args.groups === undefined) {
            var i = [];
            for (var x = 0; instance.schema.columns > x; x++) {
                var header = instance.header[x];
                if (header.hidden == 0 && header.name != 'VerCol') {
                    i.push({ columnName: header.name });
                }
            }
            /**
            * Layout data for this form.  This cannot be changed at runtime.
            * @name Form.groups
            * @memberOf Rendition.UI.Form.prototype
            * @type Native.Object
            * @private
            * @readOnly
            * @property
            */
            args.groups = [{
                name: instance.schema.displayName,
                expanded: true,
                inputs: i
            }];
        }
        var g = args.groups.length;
        for (var x = 0; g > x; x++) {
            /**
            * List of data rows in this form.  Currently this class only supports 1 row at a time.
            * @name Form.rows
            * @memberOf Rendition.UI.Form.prototype
            * @type Native.Array
            * @private
            * @readOnly
            * @property
            */
            instance.rows = [];
            var gs = [];
            var d = args.groups[x];
            for (var y = 0; d.inputs.length > y; y++) {
                if (d.inputs[y] == {} || d.inputs[y] === undefined) { continue; } /* skip empty members */
                var i = d.inputs[y];
                var c = undefined;
                var header = instance.getHeaderByName(i.columnName);
                /* check localization first - localization overrides everything else */
                //get name of schema or throw out a warning
                if (args.dataSet) {
                    var schemaName = args.dataSet.schema.name;
                } else {
                    var schemaName = args.name;
                }
                if (schemaName === undefined) {
                    try { console.log('Form missing name - cannot localize.'); } catch (e) { }
                }
                var locId = "Form_" + schemaName + "_" + (i.columnName || i.name);
                var loc = Rendition.Localization[locId];
                if (loc !== undefined) {
                    if (header) {
                        header.displayName = loc.Title;
                        header.description = loc.Message;
                    }
                    i.displayName = loc.Title;
                    i.description = loc.Message;
                    i.hidden = loc.Hidden;
                    i.defaultValue = loc.DefaultValue;
                }
                if (i.columnName !== undefined) {
                    // mode 1:  get data from SQL schema if localization was undefined
                    header.displayName = i.displayName || header.displayName;
                    c = instance.getInputByName(i.columnName);
                } else if (i.name !== undefined) {
                    // mode 2: get data from argument if SQL and localization were undefined
                    c = document.createElement('input');
                    c.style.display = 'inline-block';
                    instance.namedInputs.push(c);
                    var header = {
                        name: i.name,
                        index: y,
                        originalValue: i.value || '',
                        dataType: i.dataType || 'varchar',
                        defaultValue: i.defaultValue || '',
                        description: i.description || '',
                        displayName: i.displayName || i.name,
                        hidden: i.hidden || false,
                        isNullable: i.isNullable || false,
                        dataLength: i.dataLength || 10000,
                        primaryKey: i.primaryKey || false
                    }
                }
                if (loc === undefined && header !== undefined && (i.columnName || i.name) !== undefined) {
                    try {
                        console.log('<Field Id="' + locId +
                   '" Title="' + (header.displayName || '') +
                   '" DefaultValue="' + header.displayName + '" Hidden="' + header.hidden + '">' + header.description + '</Field>');
                    } catch (e) { }
                }
                if (i.grid !== undefined) {
                    var b = Rendition.UI.ResizeableBox({ height: 300 });
                    instance.resizeableBoxes.push(b);
                    var c = b.box;
                    var p = { parentNode: c }
                    $.extend(true, p, i.grid);
                    var grid = Rendition.UI.Grid(p);
                    Rendition.UI.appendEvent('resize', b, grid.resize, false);
                    gs.push(grid);
                    instance.grids.push(grid);
                }
                if (c === undefined && i.HTML === undefined && i.name === undefined) {
                    instance.log('Form: column ' + i.columnName + ' not found. Name:' + i.name);
                    continue;
                }
                if (i.HTML !== undefined) {
                    var c = document.createElement('div');
                }
                if (i.inputType == 'radio') {

                } else if (i.inputType == 'checkbox' || c.type == 'checkbox') {
                    c.type = 'checkbox';
                    c.cssFloat = 'left';
                } else if (i.inputType == 'rte') {
                    var b = Rendition.UI.ResizeableBox({ height: 300 });
                    instance.resizeableBoxes.push(b);
                    var p = { content: c.data, parentNode: b.box }
                    $.extend(true, p, i.rte);
                    var rte = Rendition.UI.RichTextEditor(p);
                    b.rte = rte;
                    Rendition.UI.appendEvent('resize', b, rte.resize, false);
                    if (i.columnName !== undefined) {
                        rte.name = i.columnName;
                    } else if (i.name !== undefined) {
                        rte.name = i.name;
                    }
                    instance.rtes.push(rte);
                    rte.FormInput = c;
                    c.name = i.columnName;
                } else if (i.inputType == 'select') {
                    var val = String(c.data);
                    c = document.createElement('select');
                    if (i.width) {
                        c.style.width = i.width;
                    }
                    c.style.display = 'inline-block';
                    c.name = i.columnName;
                    c.value = val;
                    Rendition.UI.fillSelect(c, i.options, 0, 1, val);
                    instance.selects.push(c);
                } else if (i.datePicker !== undefined) {
                    var p = { input: c }
                    if (i.width) {
                        c.style.width = i.width;
                    }
                    $.extend(true, p, i.datePicker);
                    var f = Rendition.UI.DatePicker(p);
                    instance.datePickers.push(f);
                } else if (i.inputType == 'calendar' || i.inputType == 'calendar' || i.inputType == 'datePicker') {
                    var f = Rendition.UI.DatePicker({
                        input: c
                    });
                    if (i.width) {
                        c.style.width = i.width;
                    }
                    instance.datePickers.push(f);
                } else if (i.fileManager !== undefined || i.inputType == 'fileManager') {
                    var p = {
                        input: c,
                        selectFile: true,
                        selectCallback: function (selectedFilePath, fileMan) {
                            fileMan.fileSelectButton.input.value = selectedFilePath;
                            return;
                        }
                    }
                    if (i.width) {
                        c.style.width = i.width;
                    }
                    if (i.fileManager !== undefined) {
                        $.extend(true, p, i.fileManager);
                    }
                    instance.fileManagers.push(new Rendition.UI.FileSelectButton(p));
                } else if (i.numericupdown !== undefined || i.inputType == 'numericUpDown') {
                    var p = { input: c }
                    if (i.width) {
                        c.style.width = i.width;
                    }
                    $.extend(true, p, i.numericupdown);
                    var f = Rendition.UI.NumericUpDown(p);
                    instance.numericupdowns.push(f);
                } else if (i.inputType == 'numeric') {
                    var p = {
                        mustMatchPattern: /^[-+]?[0-9]*\.?[0-9]+$/,
                        patternMismatchMessage: Rendition.Localization['Form_This_value_can_only_be_a_number'].Title,
                        patternMismatchTitle: Rendition.Localization['Form_Invalid_value'].Title,
                        input: c
                    }
                    instance.autoCompletes.push(new Rendition.UI.AutoComplete(p));
                } else if (i.inputType == 'textarea') {
                    var cc = document.createElement('textarea');
                    cc.style.height = i.height || '400px';
                    cc.style.width = i.width || '95%';
                    cc.style.display = 'block';
                    cc.style.visiblity = 'visible';
                    cc.setAttribute('hidden', 0);
                    cc.setAttribute('wrap', 'off');
                    cc.onkeypress = function (e) {
                        /* allow tabs in the text */
                        if (e.keyCode == 9) {
                            var start = this.selectionStart;
                            var end = this.selectionEnd;
                            this.value = this.value.substring(0, start) + "\t" + this.value.substring(end, this.value.length);
                            this.focus();
                            this.selectionStart = start + 1;
                            this.selectionEnd = start + 1;
                            return false;
                        }
                        return true;
                    }
                    cc.name = i.columnName;
                    cc.value = c.data;
                    c = cc;
                } else if (i.inputType == 'codearea') {
                    var val = String(c.data);
                    var iId = 'd_' + Rendition.UI.createUUID();
                    var b = Rendition.UI.ResizeableBox({ height: 415 });
                    var c = b.box;
                    var box = b;
                    instance.resizeableBoxes.push(b);
                    var max = document.createElement('button');
                    max.className = 'aceMaxControl';
                    max.style.position = 'relative';
                    max.style.cssFloat = 'left';
                    max.innerHTML = '&uarr;';
                    max.setAttribute('state', '0');
                    var _bboxresize = function () {
                        /* make the parent group box get with the program */
                        var h = box.box.parentNode.parentNode.parentNode.parentNode.parentNode.offsetHeight - 4;
                        c.style.width = (box.box.parentNode.parentNode.parentNode.parentNode.parentNode.offsetWidth + 12) + 'px';
                        if (h < 150) {
                            h = 150;
                        }
                        max.style.left = (box.box.offsetWidth - 31) + 'px';
                        max.style.top = '-15px';
                        if (c.parentNode !== null) {
                            c.parentNode.style.height = (box.box.offsetHeight - 42) + 'px';
                            c.style.height = (h) + 'px';
                        }
                        box.box.editor.resize();
                    }
                    max.resize = function () {
                        c.style.height = document.documentElement.clientHeight + 'px';
                        c.style.width = document.documentElement.clientWidth + 'px';
                    }
                    max.onclick = function () {
                        if (max.getAttribute('state') == '0') {
                            Rendition.UI.appendEvent('resize', window, max.resize, false);
                            max.setAttribute('state', '1');
                            /* that's right, the min button is a property of the max button, but only while
                            the editor is maximized.  Once the editor is restored the min button
                            gets removed and undefined.  This was easier than moving the max button around. */
                            max.min = document.createElement('button');
                            max.min.onclick = max.onclick;
                            max.min.className = 'aceMaxControl';
                            max.min.style.top = '0px';
                            max.min.style.right = '17px';
                            max.min.style.zIndex = '99999';
                            max.min.innerHTML = '&darr;';
                            if (i.saveProcedure) {
                                max.save = document.createElement('button');
                                max.save.onclick = i.saveProcedure;
                                max.save.className = 'aceMaxControl';
                                max.save.style.top = '0px';
                                max.save.style.right = '34px';
                                max.save.style.width = '40px';
                                max.save.style.zIndex = '99999';
                                max.save.innerHTML = 'Save';
                                document.body.appendChild(max.save);
                            }
                            /* max */
                            c.originalParentNode = c.parentNode;
                            c.originalWidth = c.style.width;
                            c.originalHeight = c.style.height;
                            c.style.top = '0px';
                            c.style.left = '0px';
                            c.style.zIndex = '99998';
                            document.body.appendChild(c);
                            document.body.appendChild(max.min);
                            max.resize();
                            c.editor.resize();
                        } else {
                            Rendition.UI.removeEvent('resize', window, max.resize, false);
                            max.setAttribute('state', '0');
                            c.style.zIndex = max.originalZIndex;
                            c.style.top = '-8px';
                            c.style.left = '-31px';
                            c.style.height = c.originalHeight;
                            c.style.width = c.originalWidth;
                            c.originalParentNode.appendChild(c);
                            document.body.removeChild(max.min);
                            if (i.saveProcedure) {
                                document.body.removeChild(max.save);
                            }
                            max.min = undefined;
                            box.resize();
                        }
                    }
                    c.max = max;
                    c.style.background = 'white';
                    Rendition.UI.appendEvent('resize', b, _bboxresize, false);
                    c.id = iId;
                    c.style.top = '-8px';
                    c.style.left = '-31px';
                    c.style.height = '415px';
                    c.style.width = '100%';
                    c.style.position = 'relative';
                    c.style.display = 'block';
                    c.style.visiblity = 'visible';
                    instance.codeareas.push({
                        id: iId,
                        language: i.language || "html",
                        name: i.name || i.columnName || '',
                        value: val || '',
                        theme: i.theme,
                        element: c,
                        max: max
                    });
                } else if (i.inputSelectButton !== undefined) {
                    var p = { input: c }
                    $.extend(true, p, i.inputSelectButton);
                    var n = Rendition.UI.InputSelectButton(p);
                    if (i.inputSelectButton.callbackProcedure === undefined) {
                        n.callbackProcedure = function (selButton, selButtonInput) {
                            selButtonInput.input.value = selButton.selectedValue;
                        }
                    }
                    instance.inputSelectButtons.push(n);
                } else if (i.inputType == 'text' || i.inputType === undefined) {
                    /* don't modify the input */
                    if (c.type == 'text') {
                        c.style.width = '90%';
                    }
                } else if (i.inputType == 'hidden') {
                    c.type = 'hidden';
                } else if (i.inputType == 'password') {
                    /* don't modify the input */
                    if (c.type == 'text') {
                        c.style.width = '90%';
                    }
                    c.type = 'password';
                } else if (i.inputType == 'title') {
                    /* don't modify the input */
                    if (c.type == 'text') {
                        c.style.background = 'transparent';
                        c.style.border = 'solid 0px transparent';
                        c.style.color = 'black';
                        c.disabled = true;
                    }
                } else if (i.inputType == 'hidden') {
                    continue;
                } else {
                    instance.log('input type ' + i.inputType + ' not defined.');
                    continue;
                }
                instance.setAttributes(c, header);
                if (i.autoComplete !== undefined) {
                    var p = { input: c }
                    $.extend(true, p, i.autoComplete);
                    instance.autoCompletes.push(new Rendition.UI.AutoComplete(p))
                }
                if (i.info !== undefined) {
                    var p = { hover: c }
                    $.extend(true, p, i.info);
                    instance.infos.push(new Rendition.UI.Info(p));
                } else if (
                /* add a info bubble, but not for these types */
					grid === undefined &&
					i.inputType != 'rte' &&
					i.HTML === undefined &&
					i.inputType != 'codearea' &&
					i.inputType != 'textarea') {
                    var p = {
                        hover: c,
                        title: c.getAttribute('displayName'),
                        message: c.getAttribute('description')
                    }
                    instance.infos.push(new Rendition.UI.Info(p));
                }
                if (i.grid !== undefined) {
                    instance.rows.push([c]);
                } else if (i.inputType == 'rte') {
                    instance.rows.push([b.box]);
                } else if (i.inputType == 'codearea') {
                    instance.rows.push([c]);
                    instance.inputs.push(c);
                } else if (i.inputType == 'textarea') {
                    instance.rows.push([c]);
                    instance.inputs.push(c);
                    instance.textareas.push(c);
                } else if (i.HTML !== undefined) {
                    var objOrString = Rendition.UI.stringOrFunction(i.HTML, instance, [instance]);
                    if (typeof objOrString == 'string') {
                        c.innerHTML = objOrString;
                        instance.rows.push([c]);
                    } else if (typeof objOrString == 'object') {
                        instance.rows.push([objOrString]);
                    }
                } else {
                    /* add to the output array */
                    instance.inputs.push(c);
                    if (args.smallTitles == true) {
                        var hld = document.createElement('div');
                        var txt = document.createElement('div');
                        txt.innerHTML = c.getAttribute('displayName');
                        if (i.width === undefined) {
                            c.style.width = '75px';
                        }
                        hld.appendChild(txt);
                        hld.appendChild(c);
                        instance.rows.push([hld]);
                    } else if (args.noTitles == true) {
                        if (i.width === undefined) {
                            c.style.width = '95%';
                        }
                        instance.rows.push([c]);
                    } else if (i.inputType == 'hidden') {
                        /* don't put the hidden rows in */
                    } else {
                        instance.rows.push([Rendition.UI.txt(c.getAttribute('displayName')), c]);
                    }
                }
            }
            var pt = Rendition.UI.pairtable({
                rows: instance.rows
            });
            var gb = Rendition.UI.GroupBox({
                title: d.name,
                childNodes: [pt.table],
                expanded: Rendition.UI.iif(d.expanded !== undefined, d.expanded, true)
            });
            gb.addEventListener('expand', function () {
                instance.resize();
            }, false);
            gb.addEventListener('collapse', function () {
                instance.resize();
            }, false);
            if (i.grid !== undefined || i.inputType == 'rte' || i.inputType == 'textarea' || i.inputType == 'codearea') {
                pt.table.style.width = '100%';
                gb.inner.style.marginLeft = '5px';
                if (i.inputType == 'codearea') {
                    gb.inner.insertBefore(max, gb.inner.firstChild);
                }
            } else {
                if (pt.table.rows[0] && args.titleWidth) {
                    pt.table.rows[0].cells[0].style.width = args.titleWidth;
                }
            }
            instance.pairTables.push(pt);
            instance.groupBoxes.push(gb);
        }
        var b = instance.groupBoxes.length;
        for (var x = 0; b > x; x++) {
            instance.groupBoxes[x].appendTo(instance.form);
        }
        if (args.parentNode !== undefined) {
            instance.appendTo(args.parentNode);
        }
    }
    instance.init();
    return instance;
}