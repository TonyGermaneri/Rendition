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
* Used for data interchange between Rendition C# JSON and client Rendition JavaScript JSON.
* Also used for interchange between client Rendition JavaScript objects.
* @constructor
* @public
* @name Rendition.UI.DataSet
* @returns {Native.Object} <link xlink:href="Rendition.UI.DataSet"/>.
* @example /// A table with three columns and two records ///
* {
*	"error": 0,
*	"description": "",
*	"range": {
*		"from": 1,
*		"to": 75 
*	},
*	"schema": {
*		"error": 0,
*		"description": "",
*		"objectId": 1143727177,
*		"columns": 3,
*		"records": 2,
*		"orderBy": 0,
*		"orderByDirection": 1,
*		"checksum": -2,
*		"name": "shortItemList",
*		"displayName": "shortItemList" 
*	},
*	"header": [
*		{
*			"name": "itemNumber",
*			"dataType": "varchar",
*			"dataLength": 50,
*			"columnOrder": 0,
*			"columnSize": 200,
*			"visibility": 1,
*			"description": "",
*			"isNullable": 0,
*			"primaryKey": 0,
*			"defaultValue": "",
*			"displayName": "itemNumber",
*			"hidden": 0 
*		},
*		{
*			"name": "shortDescription",
*			"dataType": "varchar",
*			"dataLength": 50,
*			"columnOrder": 1,
*			"columnSize": 200,
*			"visibility": 1,
*			"description": "",
*			"isNullable": 0,
*			"primaryKey": 0,
*			"defaultValue": "",
*			"displayName": "shortDescription",
*			"hidden": 0 
*		},
*		{
*			"name": "VerCol",
*			"dataType": "int",
*			"dataLength": 4,
*			"columnOrder": 2,
*			"columnSize": 200,
*			"visibility": 0,
*			"description": "",
*			"isNullable": 0,
*			"primaryKey": 0,
*			"defaultValue": "",
*			"displayName": "VerCol",
*			"hidden": 0 
*		} 
*	],
*	"data": [
*		[
*			"NO-NA-EOT-3FTS",
*			"",
*			"-1" 
*		],
*		[
*			"0/103C",
*			"",
*			"-1" 
*		] 
*	] 
* }
*/
Rendition.UI.DataSet = function () {
    return {
        /**
        * The error the remote record set provider returned.
        * @name DataSet.error
        * @memberOf Rendition.UI.DataSet.prototype
        * @type Native.String
        * @public
        * @property
        */
        error: 0,
        /**
        * Description of the error returned if any.
        * @name DataSet.description
        * @memberOf Rendition.UI.DataSet.prototype
        * @type Native.String
        * @public
        * @property
        */
        description: '',
        /**
        * The range of records in this recordset. An instance of <link xlink:href="Rendition.UI.Range"/>.
        * @name DataSet.range
        * @memberOf Rendition.UI.DataSet.prototype
        * @type Native.String
        * @public
        * @property
        */
        range: Rendition.UI.Range(),
        /**
        * The schema of this recordset. An instance of <link xlink:href="Rendition.UI.Schema"/>.
        * @name DataSet.schema
        * @memberOf Rendition.UI.DataSet.prototype
        * @type Native.String
        * @public
        * @property
        */
        schema: Rendition.UI.Schema(),
        /**
        * Two dimentional array of data.  Example:
        * <code language="JavaScript">
        *	[
        *		['Column 1 Row 1','Column 2 Row 1'],
        *		['Column 1 Row 2','Column 2 Row 2']
        *	]
        * </code>
        * @name DataSet.data
        * @memberOf Rendition.UI.DataSet.prototype
        * @type Native.Array
        * @public
        * @property
        */
        data: [],
        /**
        * Array of <link xlink:href="Rendition.UI.Header"/> objects.
        * @name DataSet.header
        * @memberOf Rendition.UI.DataSet.prototype
        * @type Native.Array
        * @public
        * @property
        */
        header: []
    }
}
/**
* Creates a <link xlink:href="Rendition.UI.Schema"/> object
* for use in <link xlink:href="Rendition.UI.DataSet"/> objects.
* @constructor
* @public
* @name Rendition.UI.Schema
* @returns {Native.Object} <link xlink:href="Rendition.UI.Schema"/>.
*/
Rendition.UI.Schema = function () {
    return {
        /**
        * Any errors returned by the schema command (select, delete, update, insert)
        * @name Schema.error
        * @memberOf Rendition.UI.Schema.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        error: 0,
        /**
        * Description of the schema error if any.
        * @name Schema.description
        * @memberOf Rendition.UI.Schema.prototype
        * @type Native.String
        * @public
        * @property
        */
        description: '',
        /**
        * The objectId of the database object.
        * @name Schema.objectId
        * @memberOf Rendition.UI.Schema.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        objectId: 0,
        /**
        * The number of columns in this schema.
        * @name Schema.columns
        * @memberOf Rendition.UI.Schema.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        columns: 0,
        /**
        * The number of records in this schema.
        * @name Schema.records
        * @memberOf Rendition.UI.Schema.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        records: 0,
        /**
        * The column this table is being ordered by.
        * @name Schema.orderBy
        * @memberOf Rendition.UI.Schema.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        orderBy: 0,
        /**
        * The direction this table is being ordered by.  0 = Ascending, 1 = Descending.
        * @name Schema.orderByDirection
        * @memberOf Rendition.UI.Schema.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        orderByDirection: 0,
        /**
        * The version of the table.  Used for updating.  sum(VerCol).
        * @name Schema.checksum
        * @memberOf Rendition.UI.Schema.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        checksum: 0,
        /**
        * The name of the object.
        * @name Schema.name
        * @memberOf Rendition.UI.Schema.prototype
        * @type Native.String
        * @public
        * @property
        */
        name: '',
        /**
        * The display name of the object.
        * @name Schema.displayName
        * @memberOf Rendition.UI.Schema.prototype
        * @type Native.String
        * @public
        * @property
        */
        displayName: ''
    }
}
/**
* Creates a <link xlink:href="Rendition.UI.Header"/> object
* for use in <link xlink:href="Rendition.UI.DataSet"/> objects.
* @constructor
* @public
* @name Rendition.UI.Header
* @returns {Native.Object} <link xlink:href="Rendition.UI.Header"/>.
*/
Rendition.UI.Header = function () {
    return {
        /**
        * The name of the column.
        * @name Header.name
        * @memberOf Rendition.UI.Header.prototype
        * @type Native.String
        * @public
        * @property
        */
        name: '',
        /**
        * The display name of the column.
        * @name Header.dataType
        * @memberOf Rendition.UI.Header.prototype
        * @type Native.String
        * @public
        * @property
        */
        dataType: '',
        /**
        * The maximum length of the column.
        * @name Header.dataLength
        * @memberOf Rendition.UI.Header.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        dataLength: 0,
        /**
        * The order of this column.
        * @name Header.columnOrder
        * @memberOf Rendition.UI.Header.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        columnOrder: 0,
        /**
        * The graphical width of the column.
        * @name Header.columnSize
        * @memberOf Rendition.UI.Header.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        columnSize: 200,
        /**
        * Client side visibility setting. 1 = Visible, 0 = Hidden.
        * @name Header.visibility
        * @memberOf Rendition.UI.Header.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        visibility: 1,
        /**
        * Determines if this column can contain null values.  0 = no nulls, 1 = nulls.
        * @name Header.isNullable
        * @memberOf Rendition.UI.Header.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        isNullable: 0,
        /**
        * Determines if this column is the primary key of the schema.
        * @name Header.primaryKey
        * @memberOf Rendition.UI.Header.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        primaryKey: 0,
        /**
        * Determines if this column is always hidden. 1 = Hidden, 0 = Visible.
        * @name Header.hidden
        * @memberOf Rendition.UI.Header.prototype
        * @type Native.Integer
        * @public
        * @property
        */
        hidden: 0,
        /**
        * Description of this column.
        * @name Header.description
        * @memberOf Rendition.UI.Header.prototype
        * @type Native.String
        * @public
        * @property
        */
        description: '',
        /**
        * Default value of this column.
        * @name Header.defaultValue
        * @memberOf Rendition.UI.Header.prototype
        * @type Native.String
        * @public
        * @property
        */
        defaultValue: '',
        /**
        * The display name of this column.
        * @name Header.displayName
        * @memberOf Rendition.UI.Header.prototype
        * @type Native.String
        * @public
        * @property
        */
        displayName: ''
    }
}