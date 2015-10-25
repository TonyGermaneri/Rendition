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
* Set main variables and make inital server request (admin.init). 
* initCallbacklater acts on this.
* @function
* @name Rendition.UI.init
* @memberOf Rendition.prototype
* @param {Native.Object} e Response event object.
* @private
*/
Rendition.UI.init = function () {
    /**
    * The type of object.  Returns 'Rendition'.
    * @property
    * @type Native.String
    * @name Rendition.UI.type
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.type = 'RenditionUI';
    /**
    * Detects IE within the user agent string.
    * @property
    * @type Native.Boolean
    * @name Rendition.UI.ie
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.ie = false;
    /**
    * Detects Safari within the user agent string.
    * @property
    * @type Native.Boolean
    * @name Rendition.UI.safari
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.safari = false;
    /**
    * Detects Opera within the user agent string.
    * @property
    * @type Native.Boolean
    * @name Rendition.UI.opera
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.opera = false;
    /**
    * Detects Firefox within the user agent string.
    * @property
    * @type Native.Boolean
    * @name Rendition.UI.firefox
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.firefox = false;
    /**
    * Detects Chrome within the user agent string.
    * @property
    * @type Native.Boolean
    * @name Rendition.UI.chrome
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.chrome = false;
    /**
    * Detects iPhone within the user agent string.
    * @property
    * @type Native.Boolean
    * @name Rendition.UI.iphone
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.iphone = false;
    /**
    * Detects android within the user agent string.
    * @property
    * @type Native.Boolean
    * @name Rendition.UI.android
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.android = false;
    /**
    * The default X Y position of dialogs in applications.
    * @property
    * @type Native.Object
    * @name Rendition.UI.dialogPosition
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.dialogPosition = { x: 245, y: 5 }
    /**
    * Ideal maximum width for all mobile devices.
    * @property
    * @type Native.Integer
    * @name Rendition.UI.mobileMaxWidth
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.mobileMaxWidth = 375;
    /**
    * The user agent string.
    * @property
    * @type Native.Boolean
    * @name Rendition.UI.userAgent
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.userAgent = String(navigator.userAgent);
    if (Rendition.UI.userAgent.indexOf('MSIE') > -1) { Rendition.UI.ie = true }
    /* other browsers like to imitate the obstinate IE */
    if (Rendition.UI.userAgent.indexOf('Safari') > -1) { Rendition.UI.safari = true; Rendition.UI.ie = false }
    if (Rendition.UI.userAgent.indexOf('Firefox') > -1) { Rendition.UI.firefox = true; Rendition.UI.ie = false }
    if (Rendition.UI.userAgent.indexOf('Chrome') > -1) { Rendition.UI.chrome = true; Rendition.UI.ie = false }
    if (Rendition.UI.userAgent.indexOf('Opera') > -1) { Rendition.UI.opera = true; Rendition.UI.ie = false }
    if (Rendition.UI.userAgent.indexOf('Android') > -1) { Rendition.UI.android = true; Rendition.UI.ie = false }
    if (Rendition.UI.userAgent.indexOf('iPhone') > -1) { Rendition.UI.iphone = true; Rendition.UI.ie = false }
    /**
    * The key name used for the responder JSON program.  The default is "method".
    * @property
    * @type Native.String
    * @name Rendition.UI.responderKeyName
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.responderKeyName = Rendition.Localization['Init_responderKeyName'].Title;
    /**
    * The base URL to the public responder page.  Defaults to /responder.
    * This responder should respond to sessions that have yet to logon as administrators.
    * @property
    * @type Native.String
    * @name Rendition.UI.clientServerSyncPublicURL
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.clientServerSyncPublicURL = Rendition.Localization['Rendition_UI_clientServerSyncPublicURL'].Title;
    /**
    * Computed URI from Rendition.UI.clientServerSyncPublicURL. ( URL+"?" )
    * @property
    * @type Native.String
    * @name Rendition.UI.clientServerSyncPublicURI
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.clientServerSyncPublicURI = Rendition.UI.clientServerSyncPublicURL + '?';
    /**
    * The base URL to the admin responder page.  Defaults to /admin/responder.
    * This responder should only respond to users who authenticate as administrators.
    * @property
    * @type Native.String
    * @name Rendition.UI.clientServerSyncURL
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.clientServerSyncURL = Rendition.Localization['Rendition_UI_clientServerSyncURL'].Title;
    /**
    * Computed URI from Rendition.UI.clientServerSyncURL. ( URL+"?" )
    * @property
    * @type Native.String
    * @name Rendition.UI.clientServerSyncURI
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.clientServerSyncURI = Rendition.UI.clientServerSyncURL + '?';
    /**
    * URL to the init function on the server.  This JSON method, on callback starts the UI.
    * @property
    * @type Native.Function
    * @name Rendition.UI.initURL
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.initURL = function (Rendition) {
        return Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(["Init", []]).toURI();
    }
    /**
    * The path the file explorer program will display by default.  
    * Each time the path in the fileExplorer changes, it will update this path.
    * @property
    * @type Native.String
    * @name Rendition.UI.lastBrowsePath
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.lastBrowsePath = '';
    /**
    * The URL <link xlink:href="Rendition.UI.AutoComplete"/> class uses to select data.
    * The function's signature is: Function(objectName, suffix, from,
    * to, searchSuffix, aggregateColumns, selectedRows, outputType, includeSchema,
    * checksum, del, orderBy, orderDirection, autoComplete).
    * The result will be sent to the Rendition.UI.autocompleteCallback procedure which
    * must return a <link xlink:href="Rendition.UI.DataSet"/>.
    * The default function calls the C# Rendition.admin.dataSet method.
    * @property
    * @type Native.Function
    * @name Rendition.UI.autocompleteURL
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.autocompleteURL = function (objectName, suffix, from,
	to, searchSuffix, aggregateColumns, selectedRows, outputType, includeSchema,
	checksum, del, orderBy, orderDirection, autoComplete) {
        var i = [];
        /* don't catch the last argument */
        for (var x = 0; arguments.length - 1 > x; x++) {
            if (typeof arguments[x] === 'number') {
                i.push(String(arguments[x]));
            } else {
                i.push(arguments[x]);
            }
        }
        return Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(['DataSet', i]).toURI();
    }
    /**
    * This function processes the data returned from the server when the Rendition.UI.autocompleteURL
    * is sent.  The type returned by this function must be a <link xlink:href="Rendition.UI.DataSet"/>.
    * The signature of the function is 
    * Function(XMLHttpRequest e, <link xlink:href="Rendition.UI.AutoComplete"/> autoComplete).
    * The default function uses the C# Rendition.admin.dataSet method.
    * @property
    * @type Native.Function
    * @name Rendition.UI.autocompleteCallback
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.autocompleteCallback = function (e, autoComplete) {
        var e = JSON.parse(e.responseText);
        if (e.error !== undefined) {
            throw e.description;
        }
        return e.method1.DataSet;
    }
    /**
    * The URL <link xlink:href="Rendition.UI.Grid"/> class uses to select data.  The function's signature is
    * Function(objectName, suffix, from,
    * to, searchSuffix, aggregateColumns, selectedRows, outputType, includeSchema,
    * checksum, del, orderBy, orderDirection, grid).
    * The result will be sent to the Rendition.UI.gridSelectCallback procedure which
    * must return a <link xlink:href="Rendition.UI.DataSet"/>.
    * The default function calls the C# Rendition.admin.dataSet method.
    * @property
    * @type Native.Function
    * @name Rendition.UI.gridSelectURL
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.gridSelectURL = function (objectName, suffix, from,
	to, searchSuffix, aggregateColumns, selectedRows, outputType, includeSchema,
	checksum, del, orderBy, orderDirection, grid) {
        var i = [];
        /* don't catch the last argument */
        for (var x = 0; arguments.length - 1 > x; x++) {
            if (typeof arguments[x] === 'number') {
                i.push(String(arguments[x]));
            } else {
                i.push(arguments[x]);
            }
        }
        return Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(['DataSet', i]).toURI();
    }
    /**
    * This function processes the data returned from the server when the Rendition.UI.gridSelectURL
    * is sent.  The type returned by this function must be a <link xlink:href="Rendition.UI.DataSet"/>.
    * The signature of the function is 
    * Function(XMLHttpRequest e, <link xlink:href="Rendition.UI.Grid"/> grid).
    * The default function uses the C# Rendition.admin.dataSet method.
    * @property
    * @type Native.Function
    * @name Rendition.UI.gridSelectCallback
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.gridSelectCallback = function (e, grid) {
        var e = JSON.parse(e.responseText);
        if (e.error !== undefined) {
            throw e.description;
        }
        if (e.method1 !== undefined) {
            if (e.method1.error !== undefined) {
                alert(e.method1.description);
                return undefined;
            }
        }
        return e.method1.DataSet;
    }
    /**
    * The URL <link xlink:href="Rendition.UI.Grid"/> class uses to delete data.  The function's signature is
    * Function(objectName, suffix, from,
    * to, searchSuffix, aggregateColumns, selectedRows, outputType, includeSchema,
    * checksum, del, orderBy, orderDirection, grid).
    * The result will be sent to the Rendition.UI.gridDeleteCallback procedure.
    * The default function uses the C# Rendition.admin.dataSet method.
    * @property
    * @type Native.Function
    * @name Rendition.UI.gridDeleteURL
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.gridDeleteURL = function (objectName, suffix, from,
	to, searchSuffix, aggregateColumns, selectedRows, outputType, includeSchema,
	checksum, del, orderBy, orderDirection, grid) {
        var i = [];
        /* don't catch the last argument */
        for (var x = 0; arguments.length - 1 > x; x++) {
            if (typeof arguments[x] === 'number') {
                i.push(String(arguments[x]));
            } else {
                i.push(arguments[x]);
            }
        }
        return Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(['DataSet', i]).toURI();
    }
    /**
    * This function processes the data returned from the server when the Rendition.UI.gridDeleteURL
    * is sent.  The object returned by this function must look like this:
    * {error: &lt;Integer&gt;, description: &lt;String&gt; }.
    * <para>The parameter [error] can return one of the following values:</para>
    *	<table>
    *		<tableHeader>
    *			<row>
    *				<entry>
    *					<para>
    *						Error
    *					</para>
    *				</entry>
    *				<entry>
    *					<para>
    *						Description
    *					</para>
    *				</entry>
    *			</row>
    *		</tableHeader>
    *		<row>
    *			<entry>
    *				<para>
    *					0
    *				</para>
    *			</entry>
    *			<entry>
    *				<para>
    *					No error occured.
    *				</para>
    *			</entry>
    *		</row>
    *		<row>
    *			<entry>
    *				<para>
    *					-1
    *				</para>
    *			</entry>
    *			<entry>
    *				<para>
    *					Row value has changed on the server (verCol mismatch).
    *				</para>
    *			</entry>
    *		</row>
    *		<row>
    *			<entry>
    *				<para>
    *					-2
    *				</para>
    *			</entry>
    *			<entry>
    *				<para>
    *					Row has been deleted and cannot be updated or deleted.
    *				</para>
    *			</entry>
    *		</row>
    *		<row>
    *			<entry>
    *				<para>
    *					Any other Integer
    *				</para>
    *			</entry>
    *			<entry>
    *				<para>
    *					Custom error.  The [description] parameter will be displayed.
    *				</para>
    *			</entry>
    *		</row>
    *	</table>
    * Function(XMLHttpRequest e, <link xlink:href="Rendition.UI.Grid"/> grid).
    * @property
    * @type Native.Function
    * @name Rendition.UI.gridDeleteCallback
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.gridDeleteCallback = function (e, grid) {
        var e = JSON.parse(e.responseText);
        if (e.method1 !== undefined) {
            if (e.method1.error !== undefined) {
                alert(e.method1.description);
                return undefined;
            }
        }
        return e.method1.DataSet;
    }
    /**
    * This function should return the URL the grid class uses to update tables.
    * The function's signature is
    * Function(objectName, data, overwrite, grid).
    * The server side function should update the row in the table matching
    * the [objectName] parameter where the primary key equals the [primaryKey] parameter.
    * When the boolean value [overwrite] is true, the user has requested to
    * overwrite existings values even if the row has changed since last update (verCol mismatch).
    * If the [overwrite] parameter is false, than the user does not want to overwrite
    * any records that have changed on the server since the last update (verCol mismatch).
    * When this occurs, error -1 should be returned in the gridUpdateCallback object.
    * When the record is deleted and cannot be updated error -2 should be returned.
    * For more information see the Rendition.UI.gridUpdateCallback function documentation.
    * The result will be sent to the Rendition.UI.gridUpdateCallback procedure which
    * must return a an object that looks like this:
    * {error: &lt;Integer&gt;, description: &lt;String&gt;, primaryKey: &lt;String&gt;,verCol: &lt;Integer&gt; }.
    * The default function calls the C# Rendition.admin.Crud method.
    * @property
    * @type Native.Function
    * @name Rendition.UI.gridUpdateURL
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.gridUpdateURL = function (objectName, data, overwrite, grid) {
        return Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(['Crud', [objectName, data, overwrite, 0]]).toURI();
    }
    /**
    * This function processes the data returned from the server when the Rendition.UI.gridSelectURL
    * is sent.  The object returned by this function must look like this:
    * {error: &lt;Integer&gt;, description: &lt;String&gt;, primaryKey: &lt;String&gt;,verCol: &lt;Integer&gt; }.
    * <para>The parameter [primaryKey] should be the primaryKey of the row updated.</para>
    * <para>The parameter [verCol] should be the new verCol of the row.</para>
    * <para>The parameter [error] can return one of the following values:</para>
    *	<table>
    *		<tableHeader>
    *			<row>
    *				<entry>
    *					<para>
    *						Error
    *					</para>
    *				</entry>
    *				<entry>
    *					<para>
    *						Description
    *					</para>
    *				</entry>
    *			</row>
    *		</tableHeader>
    *		<row>
    *			<entry>
    *				<para>
    *					0
    *				</para>
    *			</entry>
    *			<entry>
    *				<para>
    *					No error occured.
    *				</para>
    *			</entry>
    *		</row>
    *		<row>
    *			<entry>
    *				<para>
    *					-1
    *				</para>
    *			</entry>
    *			<entry>
    *				<para>
    *					Row value has changed on the server (verCol mismatch).
    *				</para>
    *			</entry>
    *		</row>
    *		<row>
    *			<entry>
    *				<para>
    *					-2
    *				</para>
    *			</entry>
    *			<entry>
    *				<para>
    *					Row has been deleted and cannot be updated or deleted.
    *				</para>
    *			</entry>
    *		</row>
    *		<row>
    *			<entry>
    *				<para>
    *					Any other Integer
    *				</para>
    *			</entry>
    *			<entry>
    *				<para>
    *					Custom error.  The [description] parameter will be displayed.
    *				</para>
    *			</entry>
    *		</row>
    *	</table>
    * The signature of the function is 
    * Function(XMLHttpRequest e, <link xlink:href="Rendition.UI.Grid"/> grid).
    * The default function uses the C# Rendition.admin.dataSet method.
    * @property
    * @type Native.Function
    * @name Rendition.UI.gridUpdateCallback
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.gridUpdateCallback = function (e, grid) {
        var e = JSON.parse(e.responseText);
        return e.method1.Crud;
    }
    /**
    * This function should return the URL the grid class uses to insert into tables.
    * The function's signature is
    * Function(objectName, data, overwrite, grid).
    * The server side function should insert the row in the table matching
    * the [objectName] parameter.
    * The result will be sent to the Rendition.UI.gridInsertCallback procedure which
    * must return a an object that looks like this:
    * {error: &lt;Integer&gt;, description: &lt;String&gt;, primaryKey: &lt;String&gt;,verCol: &lt;Integer&gt; }.
    * The default function calls the C# Rendition.admin.Crud method.
    * @property
    * @type Native.String
    * @name Rendition.UI.gridInsertURL
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.gridInsertURL = function (objectName, data, overwrite, grid) {
        return Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(['Crud', [objectName, data, true, 1]]).toURI();
    }
    /**
    * This function processes the data returned from the server when the Rendition.UI.gridSelectURL
    * is sent.  The object returned by this function must look like this:
    * {error: &lt;Integer&gt;, description: &lt;String&gt;, primaryKey: &lt;String&gt;,verCol: &lt;Integer&gt; }.
    * <para>The parameter [primaryKey] should be the primaryKey of the row inserted.</para>
    * <para>The parameter [verCol] should be the new verCol of the row.</para>
    * <para>The parameter [error] can return one of the following values:</para>
    *	<table>
    *		<tableHeader>
    *			<row>
    *				<entry>
    *					<para>
    *						Error
    *					</para>
    *				</entry>
    *				<entry>
    *					<para>
    *						Description
    *					</para>
    *				</entry>
    *			</row>
    *		</tableHeader>
    *		<row>
    *			<entry>
    *				<para>
    *					0
    *				</para>
    *			</entry>
    *			<entry>
    *				<para>
    *					No error occured.
    *				</para>
    *			</entry>
    *		</row>
    *		<row>
    *			<entry>
    *				<para>
    *					Any other Integer
    *				</para>
    *			</entry>
    *			<entry>
    *				<para>
    *					Custom error.  The [description] parameter will be displayed.
    *				</para>
    *			</entry>
    *		</row>
    *	</table>
    * The signature of the function is 
    * Function(XMLHttpRequest e, <link xlink:href="Rendition.UI.Grid"/> grid).
    * The default function uses the C# Rendition.admin.dataSet method.
    * @property
    * @type Native.Function
    * @name Rendition.UI.gridInsertCallback
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.gridInsertCallback = function (e, grid) {
        var e = JSON.parse(e.responseText);
        return e.method1.Crud;
    }
    /**
    * The URL the grid class uses for updating personal schema size data (column size, position etc.).
    * The signature of the function is Function(objectId, headers, grid).
    * This URL should update the data that is returned when the schema data is requested
    * in the Rendition.UI.gridSelectURL or the Rendition.gridAutocompleteURL.
    * @property
    * @type Native.String
    * @name Rendition.UI.gridSchemaUpdateURL
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.gridSchemaUpdateURL = function (objectId, headers, grid) {
        return Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(['GridSchemaUpdate',
		[
			objectId,
			grid.getColumnVisibilityCSV(),
			grid.getColumnOrderCSV(),
			grid.getColumnSizeCSV(),
			grid.orderBy,
			parseInt(grid.orderByDirection)
		]]).toURI();
    }
    /**
    * List of messages that this client has recieved.
    * @property
    * @type Native.Array
    * @name Rendition.UI.systemMessagesReported
    * @memberOf Rendition.prototype
    * @private
    */
    Rendition.UI.systemMessagesReported = [];
    /**
    * The width of the generic editor's save dialog.
    * @property
    * @type Native.Integer
    * @name Rendition.UI.saveChangesDialogWidth
    * @memberOf Rendition.prototype
    * @private
    */
    Rendition.UI.saveChangesDialogWidth = 450;
    /**
    * An empty UUID. Looks like: 00000000-0000-0000-0000-000000000000.
    * @property
    * @type Native.String
    * @name Rendition.UI.emptyUUID
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.emptyUUID = '00000000-0000-0000-0000-000000000000';
    /* date pattern works for 1900-2199
    Rendition.UI.dateMatchPattern = /^(0|1)?\d\/[0123]?\d\/(19|20|21)?\d{2}$/; */
    /**
    * Regular Expression for dates between 1900-2199 in this format mm/dd/yyyy.
    * @property
    * @type Native.RegExp
    * @name Rendition.UI.dateMatchPattern
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.dateMatchPattern = /^([0]\d|[1][0-2])\/([0-2]\d|[3][0-1])\/([2][01]|[1][6-9])\d{2}(\s([0]\d|[1][0-2])(\:[0-5]\d){1,2})*\s*([aApP][mM]{0,2})?$/;
    /* zip pattern */
    /**
    * Regular Expression for US ZIP codes.
    * @property
    * @type Native.RegExp
    * @name Rendition.UI.zipPattern
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.zipPattern = /^(\d{5}((|-)-\d{4})?)|([A-Za-z]\d[A-Za-z][\s\.\-]?(|-)\d[A-Za-z]\d)|[A-Za-z]{1,2}\d{1,2}[A-Za-z]? \d[A-Za-z]{2}$/;
    /**
    * Array of pending AJAX requests.
    * @property
    * @type Native.Array
    * @name Rendition.UI.AjaxRequests
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.AjaxRequests = [];
    /* 
    how frequently the client asks the server for updates and saves client state data
    300000 = 5 minutes 30000 = 30 seconds 3000 = 3 seconds 
    */
    /**
    * Client server sync delay.  How long between update intervals.
    * @property
    * @type Native.Integer
    * @name Rendition.UI.clientServerSyncDelay
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.clientServerSyncDelay = 30000;
    /**
    * Maximum number of simultaneous ajax requests (to prevent the server from choking)
    * @property
    * @type Native.Integer
    * @name Rendition.UI.maxSimultaneousAjaxRequests
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.maxSimultaneousAjaxRequests = 2;
    /**
    * Numbmer of ms to wait between checking the AJAX reqest queue
    * @property
    * @type Native.Integer
    * @name Rendition.UI.AjaxRequestRestTimeout
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.AjaxRequestRestTimeout = 25;
    /**
    * how long to wait before checking for a parent node when attaching input+button widigets
    * @property
    * @type Native.Integer
    * @name Rendition.UI.waitToAttachTimeout
    * @memberOf Rendition.prototype
    * @private
    */
    Rendition.UI.waitToAttachTimeout = 500;
    /**
    * A random Id for this instance of Rendition UI.
    * @property
    * @type Native.Integer
    * @name Rendition.UI.id
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.id = Rendition.UI.rand(10000);
    /**
    * Z index to start stacking windows from.
    * @property
    * @type Native.Integer
    * @name Rendition.UI.topzindex
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.topzindex = 1;
    /**
    * Z index to start stacking modal windows from.
    * @property
    * @type Native.Integer
    * @name Rendition.UI.topModalzindex
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.topModalzindex = 10000;
    /**
    * Base ID number to start creating ID using the createId function.
    * @property
    * @type Native.Integer
    * @name Rendition.UI.topId
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.topId = 0;
    /**
    * List of <link xlink:href="Rendition.UI.Desktop"/> widgets.
    * @property
    * @type Native.Array
    * @name Rendition.UI.desktops
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.desktops = [];
    /**
    * List of icons.
    * @property
    * @type Native.Array
    * @name Rendition.UI.icons
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.icons = [];
    /**
    * List of <link xlink:href="Rendition.UI.Dialog"/> widgets.
    * @property
    * @type Native.Array
    * @name Rendition.UI.dialogs
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.dialogs = [];
    /**
    * List of <link xlink:href="Rendition.UI.TaskBar"/> widgets.
    * @property
    * @type Native.Array
    * @name Rendition.UI.taskBars
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.taskBars = [];
    /**
    * List of <link xlink:href="Rendition.UI.TabBar"/> widgets.
    * @property
    * @type Native.Array
    * @name Rendition.UI.tabBars
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.tabBars = [];
    /**
    * List of <link xlink:href="Rendition.UI.TabBarTab"/> widgets.
    * @property
    * @type Native.Array
    * @name Rendition.UI.tabBarTabs
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.tabBarTabs = [];
    /**
    * List of <link xlink:href="Rendition.UI.MenuBar"/> widgets.
    * @property
    * @type Native.Array
    * @name Rendition.UI.menuBars
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.menuBars = [];
    /**
    * List of <link xlink:href="Rendition.UI.CutterBar"/> widgets.
    * @property
    * @type Native.Array
    * @name Rendition.UI.cutterBars
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.cutterBars = [];
    /**
    * List of <link xlink:href="Rendition.UI.ContextMenu"/> widgets.
    * @property
    * @type Native.Array
    * @name Rendition.UI.contextMenus
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.contextMenus = [];
    /**
    * List of <link xlink:href="Rendition.UI.RichTextEditor"/> widgets.
    * @property
    * @type Native.Array
    * @name Rendition.UI.richTextEditors
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.richTextEditors = [];
    /**
    * List of <link xlink:href="Rendition.UI.Chart"/> widgets.
    * @property
    * @type Native.Array
    * @name Rendition.UI.Charts
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.Charts = [];
    /**
    * Default <link xlink:href="Rendition.UI.DesktopStyle"/>.
    * @property
    * @type Native.Object
    * @name Rendition.UI.deskStyle
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.deskStyle = null;
    /**
    * Default <link xlink:href="Rendition.UI.TaskBarStyle"/>.
    * @property
    * @type Native.Object
    * @name Rendition.UI.taskStyle
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.taskStyle = null;
    /**
    * Default <link xlink:href="Rendition.UI.TaskBarElementStyle"/>.
    * @property
    * @type Native.Object
    * @name Rendition.UI.taskElementStyle
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.taskElementStyle = null;
    /**
    * Default <link xlink:href="Rendition.UI.MenuOptionStyle"/> for 
    * <link xlink:href="Rendition.UI.MenuBar"/> <link xlink:href="Rendition.UI.MenuOptionElement"/> elements.
    * @property
    * @type Native.Object
    * @name Rendition.UI.menuBarElementStyle
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.menuBarElementStyle = null;
    /**
    * Default <link xlink:href="Rendition.UI.ContextMenuStyle"/>.
    * @property
    * @type Native.Object
    * @name Rendition.UI.contextStyle
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.contextStyle = null;
    /**
    * Default <link xlink:href="Rendition.UI.MenuOptionStyle"/> for 
    * <link xlink:href="Rendition.UI.ContextMenu"/> <link xlink:href="Rendition.UI.MenuOptionElement"/> elements.
    * @property
    * @type Native.Object
    * @name Rendition.UI.ContextMenuElementStyle
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.ContextMenuElementStyle = null;
    /**
    * Default <link xlink:href="Rendition.UI.CutterBarStyle"/>.
    * @property
    * @type Native.Object
    * @name Rendition.UI.cutterStyle
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.cutterStyle = null;
    /**
    * Default <link xlink:href="Rendition.UI.TabBarStyle"/>.
    * @property
    * @type Native.Object
    * @name Rendition.UI.tabStyle
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.tabStyle = null;
    /**
    * Default <link xlink:href="Rendition.UI.TabBarTabStyle"/>.
    * @property
    * @type Native.Object
    * @name Rendition.UI.tabElementStyle
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.tabElementStyle = null;
    /**
    * Default <link xlink:href="Rendition.UI.GridStyle"/>.
    * @property
    * @type Native.Object
    * @name Rendition.UI.defaultGridStyle
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.defaultGridStyle = null;
    /**
    * Log window.  Instance of <link xlink:href="Rendition.UI.Dialog"/>.
    * @property
    * @type Native.Object
    * @name Rendition.UI.logWindow
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.logWindow = null;
    /**
    * List of <link xlink:href="Rendition.UI.GroupBox"/> elements.
    * @property
    * @type Native.Array
    * @name Rendition.UI.groupBoxes
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.groupBoxes = [];
    /**
    * List of <link xlink:href="Rendition.UI.Chat"/> elements.
    * @property
    * @type Native.Array
    * @name Rendition.UI.chats
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.chats = [];
    /* for use with class autocomplete when validation tries to move the curosr, 
    make sure other validation does not try and move it back creating a loop */
    /**
    * Used globaly by all instances of <link xlink:href="Rendition.UI.AutoComplete"/> to prevent validation looping.
    * @property
    * @type Native.Boolean
    * @name Rendition.UI.movingFocus
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.movingFocus = false;
    /**
    * Master key control input.  Used for shortcut keys.
    * @property
    * @type Native.DHTMLElement
    * @name Rendition.UI.controlInput
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.controlInput = document.createElement('input');
    Rendition.UI.controlInput.style.position = 'absolute';
    Rendition.UI.controlInput.style.left = '-500px';
    Rendition.UI.controlInput.style.top = '-500px';
    /**
    * Used globally by <link xlink:href="Rendition.UI.Grid"/> show 
    * the dynamic grid CSS is missing until it's loaded later.
    * @property
    * @type Native.Boolean
    * @name Rendition.UI.gridStyleApplied
    * @memberOf Rendition.prototype
    * @public
    */
    Rendition.UI.gridStyleApplied = false;
    /* event handler arrays */
    Rendition.UI.e_finishedloading = [];
    Rendition.UI.e_startedloading = [];
    if (Rendition.UI.parameters.startedloading !== undefined) {
        Rendition.UI.e_startedloading.push(Rendition.UI.parameters.startedloading);
    }
    if (Rendition.UI.parameters.finishedLoading !== undefined) {
        Rendition.UI.e_finishedloading.push(Rendition.UI.parameters.finishedLoading);
    }
    if (Rendition.UI.parameters.icons !== undefined) {
        Rendition.UI.icons = Rendition.UI.parameters.icons;
    } else {
        Rendition.UI.icons = Rendition.UI.defaultPanelItems;
    }
    Rendition.UI.initCss();
    Rendition.UI.deskStyle = Rendition.UI.DesktopStyle();
    Rendition.UI.taskStyle = Rendition.UI.TaskBarStyle();
    Rendition.UI.taskElementStyle = Rendition.UI.TaskBarElementStyle();
    Rendition.UI.desktopMenuBarStyle = Rendition.UI.MenuBarStyle();
    Rendition.UI.defaultMenuBarStyle = Rendition.UI.MenuBarStyle();
    Rendition.UI.dialogStyle = Rendition.UI.DialogWindowStyle();
    Rendition.UI.desktopMenuBarElementStyle = Rendition.UI.MenuOptionStyle();
    Rendition.UI.menuBarElementStyle = Rendition.UI.MenuOptionStyle();
    Rendition.UI.contextStyle = Rendition.UI.ContextMenuStyle();
    Rendition.UI.ContextMenuElementStyle = Rendition.UI.MenuOptionStyle();
    Rendition.UI.cutterStyle = Rendition.UI.CutterBarStyle();
    Rendition.UI.tabStyle = Rendition.UI.TabBarStyle();
    Rendition.UI.tabElementStyle = Rendition.UI.TabBarTabStyle();
    Rendition.UI.defaultGridStyle = Rendition.UI.GridStyle();
    Rendition.UI.defaultRichTextEditorStyle = Rendition.UI.RichTextEditorStyle();
    Rendition.UI.defaultTreeViewStyle = Rendition.UI.TreeViewStyle();
    if (Rendition.UI.parameters.finishedLoading !== undefined) {
        Rendition.UI.menuBarElements = Rendition.UI.parameters.menuBarElements;
    }
    Rendition.UI.onStartedLoading();
    // get the google chart API
    Rendition.UI.addScript('https://www.google.com/jsapi?autoload={"modules":[{"name":"visualization","version":"1","packages":["corechart","table"]}]}');
    var URL = Rendition.UI.parameters.initURL || Rendition.UI.initURL;
    var uri = URL.apply(Rendition, [Rendition]);
    var iCB = Rendition.UI.parameters.initCallback || Rendition.UI.initCallback;
    var reqEval = Rendition.UI.Ajax(uri, iCB, Rendition, false, 0, iCB);
    return Rendition;
}