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
*	This class holds all grid styling.  The default grid style is
*   Rendition.UI.defaultGridStyle, an instance of this class.
*   You can replace it by replacing this property with a 
*	new instance of this class <link xlink:href="Rendition.UI.GridStyle"/> or 
*   you can use $.extend to make a copy Rendition.UI.defaultGridStyle 
*   and use it as a parameter in a single instance of <link xlink:href="Rendition.UI.Grid"/>.
*	@constructor
*	@name Rendition.UI.GridStyle
*/
Rendition.UI.GridStyle = function () {
	var instance = {}
	/**
	* The unique id of this instance.
	* @name GridStyle.id
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget.  Returns RenditionGridStyle.
	* @name GridStyle.type
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionGridStyle';
	/**
	* Offset <link xlink:href="Rendition.UI.Rect"/>.  The grid will be drawn offset by the values provided.
	* Looks like { x: 0, y: 0, h: 0, w: 0 }.
	* @name GridStyle.rect
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rect = { x: 0, y: 0, h: 0, w: 0 }
	/**
	* The CSS font property of the edit input.
	* @name GridStyle.editCellFont
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.editCellFont = 'normal 11px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
	/**
	* The background of the cell while it is being edited. Standard CSS.
	* @name GridStyle.editCellBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.editCellBackground = 'HoneyDew';
	/**
	* The CSS color property (text color) of the cell while it is being edited.
	* @name GridStyle.editCellColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.editCellColor = 'MidnightBlue';
	/**
	* Background of the 'new' row at the bottom of the gird if the edit mode supports it.
	* @name GridStyle.insertrowBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.insertrowBackground = 'DarkOliveGreen';
	/**
	* Background of the editing row while the row is being edited.
	* @name GridStyle.editingRecordBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.editingRecordBackground = 'OldLace';
	/**
	* The offset <link xlink:href="Rendition.UI.Rect"/> of each cell.  This changes the overall size 
	* of the cell from its default.  Looks like: { x: 0, y: 0, h: 18, w: -2 }
	* @name GridStyle.cellRect
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.cellRect = { x: 0, y: 0, h: 18, w: -2 }
	/**
	* The offset <link xlink:href="Rendition.UI.Rect"/> of each header cell.  This changes the overall size 
	* of the cell from its default.  Looks like: { x: 0, y: 0, h: 18, w: 2 }
	* @name GridStyle.headerCellRect
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.headerCellRect = { x: 0, y: 0, h: 18, w: 2 }
	/**
	* The offset <link xlink:href="Rendition.UI.Rect"/> of the entire header.  This changes the total size of the header 
	* clip box from its default.  Looks like: { x: 0, y: 0, h: 18, w: 0 }
	* @name GridStyle.headerRect
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.headerRect = { x: 0, y: 0, h: 18, w: 0 }
	/**
	* The alignment of the 'order by' arrow.  Valid values are center, left, right.  This is not CSS.
	* @name GridStyle.orderArrowAlign
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.orderArrowAlign = 'center';
	/**
	* The size of the order by arrow as a <link xlink:href="Rendition.UI.Rect"/>.  Looks like: { x: 0, y: 9, h: 8, w: 8 }.
	* @name GridStyle.orderArrowRect
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.orderArrowRect = { x: 0, y: 9, h: 8, w: 8 }
	/**
	* The CSS background property of the 'order by' arrow when the
	* column is in descending mode.
	* @name GridStyle.orderArrowDescBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.orderArrowDescBackground = 'DarkViolet';
	/**
	* The CSS background property of the 'order by' arrow when the
	* column is in ascending mode.
	* @name GridStyle.orderArrowAscBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.orderArrowAscBackground = 'DarkRed';
	/**
	* The offset <link xlink:href="Rendition.UI.Rect"/> of the scrolling grid area within the viewport.
	* Looks like: { x: 4, y: 0, h: 0, w: 0 }.
	* @name GridStyle.gridRect
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.gridRect = { x: 4, y: 0, h: 0, w: 0 }
	/**
	* CSS Background property of the scrolling area.
	* @name GridStyle.gridBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.gridBackground = 'Fuchsia';
	/**
	* CSS Background property header background.
	* @name GridStyle.headerBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.headerBackground = 'BurlyWood';
	/**
	* CSS Background property header background.
	* @name GridStyle.headerCellBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.headerCellBackground = 'MediumOrchid';
	/**
	* Height of the row as a <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like: { h: 18 }.
	* @name GridStyle.rowRect
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.rowRect = { x: 0, y: 0, h: 18, w: 0 }
	/**
	* The height and width of the header row (the row count column) as a <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like: { h: 18, w: 33 }.
	* @name GridStyle.rowHeaderRect
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.rowHeaderRect = { x: 0, y: 0, h: 18, w: 33 }
	/**
	* The CSS font property of the header cells.
	* @name GridStyle.headerCellFont
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.headerCellFont = 'normal 11px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
	/**
	* The CSS color property (text color) of the header cells.
	* @name GridStyle.headerCellFontColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.headerCellFontColor = 'black';
	/**
	* the CSS text-align property of the header cells.
	* @name GridStyle.headerCellAlignment
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.headerCellAlignment = 'left';
	/**
	* the CSS background property of cells when selected.
	* @name GridStyle.headerCellSelectBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.headerCellSelectBackground = 'Tomato';
	/**
	* the CSS color property (text color) of cells when selected.
	* @name GridStyle.headerCellSelectFontColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.headerCellSelectFontColor = 'DarkBlue';
	/**
	* the CSS font property (text color) of the grid cells.
	* @name GridStyle.cellFont
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.cellFont = 'normal 11px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
	/**
	* The padding within the header cells.  <legacyBold>This is not CSS.</legacyBold>
	* Looks like: { t: 0, r: 0, b: 0, l: 5 }.  Stands for top, right, bottom, left.
	* @name GridStyle.headerCellPadding
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
    instance.headerCellPadding = { t: 0, r: 0, b: 0, l: 5 }
    /**
	* The padding within the cells.  <legacyBold>This is not CSS.</legacyBold>
	* Looks like: { t: 0, r: 0, b: 0, l: 5 }.  Stands for top, right, bottom, left.
	* @name GridStyle.cellPadding
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.cellPadding = { t: 0, r: 0, b: 0, l: 5 }
	/**
	* the CSS background property of the cells.
	* @name GridStyle.cellBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.cellBackground = 'MistyRose';
	/**
	* the CSS border property of the cells.  
	* <legacyBold>Note: borders must be 1px wide even if transparent.</legacyBold>
	* @name GridStyle.cellBorder
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.cellBorder = 'solid 1px LemonChiffon';
	/**
	* the CSS color property (text color) of the cells.  
	* @name GridStyle.cellFontColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.cellFontColor = 'Black';
	/**
	* the CSS color property (text color) of the cells when selected.  
	* @name GridStyle.cellSelectFontColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.cellSelectFontColor = 'Thistle';
	/**
	* the CSS font property (text color) of the row header (row count column).
	* @name GridStyle.rowHeaderFont
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowHeaderFont = 'normal 11px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
	/**
	* the CSS text-align property of the row header (row count column).
	* @name GridStyle.rowHeaderTextAlign
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowHeaderTextAlign = 'left';
	/**
	* the CSS background property of the row header (row count column).
	* @name GridStyle.rowHeaderBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowHeaderBackground = 'LightSalmon';
	/**
	* the CSS color property (text color) of the row header (row count column).
	* @name GridStyle.rowHeaderFontColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowHeaderFontColor = 'Pink';
	/**
	* the CSS color property (text color) of the row header (row count column)
	* when the user hovers over the cell.
	* @name GridStyle.rowHeaderHoverFontColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowHeaderHoverFontColor = 'OrangeRed';
	/**
	* the CSS border property of the row header (row count column).  
	* <legacyBold>Note: borders must be 1px wide even if transparent.</legacyBold>
	* @name GridStyle.rowHeaderBorder
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowHeaderBorder = 'solid 1px GoldenRod';
	/**
	* the CSS background property of the row header (row count column)
	* when the user hovers over the cell.
	* @name GridStyle.rowHeaderHoverBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowHeaderHoverBackground = 'MediumSpringGreen';
	/**
	* the CSS color property (text color) of the row header (row count column)
	* when the row is selected.
	* @name GridStyle.rowHeaderSelectFontColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowHeaderSelectFontColor = 'Orchid';
	/**
	* the CSS background property of the row header (row count column)
	* when the row is selected.
	* @name GridStyle.rowHeaderSelectBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowHeaderSelectBackground = 'PowderBlue';
	/**
	* the CSS background property of the row when the row is selected.
	* @name GridStyle.rowSelectedBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowSelectedBackground = 'Khaki';
	/**
	* the CSS color property (text color) of the row when the row is selected.
	* @name GridStyle.rowSelectedFontColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowSelectedFontColor = 'Maroon';
	/**
	* the CSS background property of the cell when the user hovers over it.
	* @name GridStyle.cellHoverBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.cellHoverBackground = 'HoneyDew';
	/**
	* the CSS color property (text color) of the cell when the user hovers over it.
	* @name GridStyle.cellHoverFontColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.cellHoverFontColor = 'Gold';
	/**
	* the CSS background property of the cell when the cell is selected.
	* @name GridStyle.cellSelectBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.cellSelectBackground = 'BlanchedAlmond';
	/**
	* the CSS background property of the row preview bubble.
	* @name GridStyle.previewBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.previewBackground = 'Navy';
	/**
	* the CSS color property (text color) of the row preview bubble.
	* @name GridStyle.previewFontColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.previewFontColor = 'OldLace';
	/**
	* the CSS border property of the row preview bubble.
	* @name GridStyle.previewBorder
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.previewBorder = 'solid 1px Gold';
	/**
	* The padding within preview.  <legacyBold>This is not CSS.</legacyBold>
	* Looks like: { t: 0, r: 0, b: 0, l: 5 }.  Stands for top, right, bottom, left.
	* @name GridStyle.previewPaddingRect
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.previewPaddingRect = { t: 5, r: 5, b: 5, l: 5 }
	/**
	* The offset <link xlink:href="Rendition.UI.Rect"/> of the row preview bubble.
	* Looks like: { x: 15, y: 0, h: 0, w: 0 }
	* @name GridStyle.previewRect
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.previewRect = { x: 15, y: 0, h: 0, w: 0 }
	/**
	* The width allocated for the scrollbar.  This should be 17.
	* @name GridStyle.scrollBarWidth
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.scrollBarWidth = 17;
	/**
	* the CSS color property (text color) of search result cells.
	* @name GridStyle.searchFontColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.searchFontColor = 'Dark Green';
	/**
	* the CSS background property of search result cells.
	* @name GridStyle.searchBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.searchBackground = 'Chartreuse';
	/**
	* the CSS color property (text color) of the row headers of search results.
	* @name GridStyle.rowHeaderSearchRowFontColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowHeaderSearchRowFontColor = 'Khaki';
	/**
	* the CSS background property of the row headers of search results.
	* @name GridStyle.rowHeaderSearchBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rowHeaderSearchBackground = 'Light Goldenrod Yellow';
	/**
	* The text that appears in the row header for aggregate results.
	* @name GridStyle.aggregateRowTitle
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.aggregateRowTitle = '&crarr;';
	/**
	* The text that appears in the row header for the 'new' row.
	* @name GridStyle.newRowTitle
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.newRowTitle = '&diams;';
	/**
	* The text that appears in the row header while the aggregate results load.
	* @name GridStyle.aggregateCellLoading
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.aggregateCellLoading = '&hearts;';
	/**
	* The CSS background property of the viewport, the grid background.
	* @name GridStyle.viewPortBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.viewPortBackground = 'Navy';
	/**
	* The border of the viewport.  
	* <legacyBold>Note: borders must be 1px wide even if transparent.</legacyBold>
	* @name GridStyle.viewPortBorder
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.viewPortBorder = 'solid 1px tan';
	/**
	* The border of the header.  
	* <legacyBold>Note: borders must be 1px wide even if transparent.</legacyBold>
	* @name GridStyle.headerBorder
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.headerBorder = 'solid 1px red';
	/**
	* The height and offset x, y and width of the deails pane as a <link xlink:href="Rendition.UI.Rect"/>.
	* Looks like: { x: 0, y: 0, h: 75, w: 0 }.
	* @name GridStyle.detailsPaneRect
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.detailsPaneRect = { x: 0, y: 0, h: 75, w: 0 }
	/**
	* The CSS background property of the deails pane.
	* @name GridStyle.detailsPaneBackground
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.detailsPaneBackground = 'OldLace';
	/**
	* The CSS color property (text color) of the deails pane.
	* @name GridStyle.detailsPaneColor
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.detailsPaneColor = 'black';
	/**
	* The border of the details pane.  
	* <legacyBold>Note: borders must be 1px wide even if transparent.</legacyBold>
	* @name GridStyle.detailsPaneBorder
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.detailsPaneBorder = 'solid 1px green';
	/**
	* the CSS font property (text color) of the heading of the details pane.
	* @name GridStyle.detailsPaneHeadingFont
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.detailsPaneHeadingFont = 'normal 12px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
	/**
	* the CSS font property (text color) of the details pane.
	* @name GridStyle.detailsPaneFont
	* @memberOf Rendition.UI.GridStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.detailsPaneFont = 'normal 11px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
	return instance;
}
/**
* <para>Creates a DHTML based data grid.</para>
* <para>Grid can synchronously or asynchronously read from a recordset you provide 
* at runtime or it can read directly from a MS-SQL Database.  Grid provides default functionality like edit,
* search and export.  </para>
* <para> Grid also provides events you can subscribe to so you can extend the functionality of the grid. 
* When used on a table or view that implements the VerCol timestamp column records are tracked for their edit state.
* This means if someone edits the record that you're editing you'll be warned that the data on the server has changed.</para>
* <para>Grid can also work as a recordset fetching tool.  You can use grid to search through a large table and return relivent
* records, create, update, delete and read records synchronously or asynchronously.</para>
* <para>Full pramatization and strong typing for MS SQL databases supported.
* By default grid streams in data as you scroll.  Only when you have scrolled past the page does the data stream in from the server
* via asynchronous requests to the server that return JSON data.</para>
* @constructor
* @name Rendition.UI.Grid
* @param {Native.Object} args Parameters for the grid.
* @param {Native.DHTMLElement} [args.parentNode] The DOM node this grid will be appended to.
* @param {Native.Array} [args.operators=[['=','='],['like','Like (%=wildcard)'],['between','Between'],['&gt;','Greater Than'],['&lt;','Less Than'],['is null','Is Null'],['is not null','Is Not Null']]]
* Two dimentional list of operators that will appear in the search dialog.
* @param {Native.Object} [args.selectionMethod=3] Method for selecting columns and rows.
* 0 = Single Row, 1 = Single Cell, 2 = Single Column, 3 = Multipule Rows, 4 = Multiple Cells, 5 = Multiple Columns
* @param {Native.Boolean} [args.ignoreTableChanges=false] Don't warn that the table/row content has changed.  
* Also, don't dump local cache after each 'dirty' request.
* @param {Native.Boolean} [args.detailsPaneVisible=false] When true the detail pane is visible.
* @param {String|Function} [args.suffix] The value to append to the end of the query.  
* For example " where myColumn = 'Some value' ".  This can be a String or a Function.  
* Pass the value &gt;columnX&lt; where X is the column number to return name of column X.  
* When a function is used the function will be evaluated before each asynchronous request.
* @param {Boolean|String} [args.orderBy] The column to order this recordset by.  This prevents the user from reordering the recordset.
* This can be a String, Integer or a function that returns a String or an Integer. 
* When a function is used the function will be evaluated before each asynchronous request.
* @param {Native.Object} [args.orderDirection] The direction to order this recordset by. 0 = Descending, 1 = Ascending.    This prevents the user from reordering the recordset.
* @param {Native.Integer} [args.searchMatchRowOffset=3] The number of rows the search match is offset from the top by.
* @param {Native.Object} [args.searchFilters=[]] Search filters object generated by the search function.  
* Looks like [{ column:'TheColumnName',operator:'=',value:'blah',value2:'',type:'VarChar(50)',group:'1',linkOperator:'or'}].  
* For more information about searchFilters see <link xlink:href="Rendition.search"/>.
* @param {Native.Boolean} [args.rowCountColumn=false] If true the first column is a row counter.
* @param {Native.Boolean} [args.preventReorder=false] When true the grid cannot be reordered.
* @param {Native.Boolean} [args.preventHeaderResize=false] When true the grid columns cannot be resized.
* @param {Native.Boolean} [args.preventHeaderReposition=false] When true the grid columns cannot be repositioned.
* @param {Native.Integer} [args.editMode=0] How edit commands will behave.  
* 0 = Read Only,  1 = Update only, 2 = Update + Create, 3 = Create + Read + Update + Delete.
* @param {Native.String} [args.dateFormat='mm/dd/yyyy hh:nn:ss'] How to format date/datetime data in the grid. See <link xlink:href="Rendition.UI.formatDate"/>.
* @param {Native.Object} [args.editorParameters={}] When using the grid in generic editor mode,
* editorParameters will override the default editor paramaters for the generic editor.  
* For more information about the generic editor paramaters see <link xlink:href="Rendition.search"/>.
* @param {Native.Object} [args.style=Rendition.UI.defaultGridStyle] When supplied this value will override the 
* default grid style (Rendition.UI.defaultGridStyle).  For more information about grid style see the gridStyle object.
* @param {Native.String} [args.objectName] The name of the view or table this grid is bound to.  This option is required when in MS-SQL mode.
* @param {Native.Object} [args.data] Grid data.  This option is required when in local data mode.  See gridData object for more informaiton.
* When a function is used the function will be evaluated before each asynchronous request.  
* See client server sync help topic on the construction of this URL.
* @param {Native.Object} [args.offsetRect={x:0,y:0,h:0,y:0}] rect object that looks like 
* this {x:Integer,y:Integer,h:Integer,w:Integer}.  This object will offest the size and position of the main container of the grid.  
* This is the best way to distort the size and shape of the grid.
* @param {Native.Boolean} [args.hideNewRow=false] When true, the 'new row' row will not be visible.  
* Note, when edit mode is in editMode=0 (read), or editMode=1 (read+update) mode the new row is not visible.  
* The new row is only visible in editMode=2 (read+update+create) or editMode=3 (create+read+update+delete). 
* @param {Native.Boolean} [args.preventHeaderEvents=false] Prevents the execution of default events in the header, where the column names are.
* @param {Native.Object} [args.newRecord={}] Object used to replace the default new data drawn from the 
* header object (if remote, then from the default value column of the SQL object).  Looks like: {columnName:data,columnName2:data2}
* @param {Native.Array} [args.contextMenuOptions=[]] An array of menuOptions objects that will be appended to the 
* default context menu when a context menu is called on row cells.  See the menuOption object for more information.
* @param {Native.Boolean} [args.noRefresh=false] Prevents the option 'Refresh' from appearing on the default context menu.
* @param {Native.Boolean} [args.headerContextMenuOptions=[]] An array of menuOptions objects that will be 
* appended to the default context menu when a context menu is called on the headers.  See the menuOption object for more information.
* @param {Native.Boolean} [args.noRefresh=false] Prevents the option 'Refresh' from appearing on the default context menu.
* @param {Native.Boolean} [args.genericEditor=false] Use the genericEditor class to edit rows instead of the inline editor.  
* Paramaters can be changed from the default using the args.editorParameters parameter.
* @param {Native.Function} [args.selectURL] See <link xlink:href="Rendition.UI.gridSelectURL"/>.
* @param {Native.Function} [args.selectCallback] See <link xlink:href="Rendition.UI.gridSelectCallback"/>.
* @param {Native.Function} [args.deleteURL] See <link xlink:href="Rendition.UI.gridDeleteURL"/>.
* @param {Native.Function} [args.deleteCallback] See <link xlink:href="Rendition.UI.gridDeleteCallback"/>.
* @param {Native.Function} [args.updateURL] See <link xlink:href="Rendition.UI.gridUpdateURL"/>.
* @param {Native.Function} [args.updateCallback] See <link xlink:href="Rendition.UI.gridUpdateCallback"/>.
* @param {Native.Function} [args.insertURL] See <link xlink:href="Rendition.UI.gridInsertURL"/>.
* @param {Native.Function} [args.insertCallback] See <link xlink:href="Rendition.UI.gridInsertCallback"/>.
* @param {Native.Function} [args.schemaUpdateURL] See <link xlink:href="Rendition.UI.gridSchemaUpdateURL"/>.
* @example ///Create a new dialog.  Create a new grid and attach it to the dialog.///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.Grid({
*	objectName: 'items',
*	parentNode: foo.content
*});
* @example ///Create a new grid and attaches a cellclick event to it that sets the title of the foo dialog to the value of the cell clicked.///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.Grid({
*	objectName: 'items',
*	parentNode: foo.content,
*	cellclick: function (e, grid, element, row, column, selection, data, header) {
*		foo.title(grid.getRecord(row, column));
*		return;
*	}
*});
* @example ///Create a dialog, add a grid that uses the generic editor <link xlink:href="Rendition.UI.GenericEditor"/> instead of the inline editor. ///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.Grid({
*	editMode:3,
*	genericEditor: true,
*	objectName: 'items',
*	parentNode: foo.content
*});
* @example /// Creates a grid for use as a recordset handling class.  After the grid loads a record from the recordset is displayed. ///
*var foo = Rendition.UI.Dialog();
*var foo = Rendition.UI.Grid({
*	objectName: 'users',
*	afterloadcallback: function(e, grid, element, row, column, selection, data, header){
*		alert(bar.getRecord(1,'handle'));
*	}
*});
*/
Rendition.UI.Grid = function (args) {
    var instance = {}
    if (args === undefined) { throw ('arguments are required for grid object'); }
    if (args.parentNode === undefined) {
        /**
        * Selection method.  This value is read only.  To change the selection method you must re-instantiate the grid.
        * @name Grid.noParent
        * @memberOf Rendition.UI.Grid.prototype
        * @type Native.Integer
        * @private
        * @property
        */
        var noParent = true;
    }
    /**
    * unique id of this object.  Assigned automatcilly in this reg format /uid_UUID/
    * @name Grid.id
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.id = 'uid_' + Rendition.UI.createId();
    /**
    * The type of object.  returns 'RenditionGrid'
    * @name Grid.type
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.type = 'RenditionGrid';
    /**
    * The number of times the draw procedure was called.  To help with async debug logging.
    * @name Grid.drawCount
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @property
    */
    instance.drawCount = 0;
    /**
    * The local recordset array.
    * @name Grid.local
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.local = [];
    /**
    * List of operators that appear in the search function.
    * @name Grid.operators
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Array
    * @public
    * @property
    */
    instance.operators = args.operators || [
        ['=', Rendition.Localization['Grid_Operator_Equal'].Title],
        ['like', Rendition.Localization['Grid_Operator_Like'].Title],
        ['between', Rendition.Localization['Grid_Operator_Between'].Title],
        ['>', Rendition.Localization['Grid_Operator_Greater_Than'].Title],
        ['<', Rendition.Localization['Grid_Operator_Less_Than'].Title],
        ['is null', Rendition.Localization['Grid_Operator_Is_Null'].Title],
        ['is not null', Rendition.Localization['Grid_Operator_Is_Not_Null'].Title]
    ];
    /**
    * The size of the dead zone while repositioning the columns.
    * @name Grid.headerRepositionDeadZone
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @property
    */
    instance.headerRepositionDeadZone = 10;
    /**
    * Inital number of records to request from the remote recordset.
    * @name Grid.initalRecords
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @property
    */
    instance.initalRecords = 75;
    /**
    * The empty area below the last row of the recordset so the grid just feel better.
    * @name Grid.emptyAreaBelowGridOffset
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @property
    */
    instance.emptyAreaBelowGridOffset = 3;
    /**
    * How many records beyond the visible range to fetch from the remote recordset.
    * @name Grid.readaheadAbortThreshold
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @property
    */
    instance.readaheadAbortThreshold = 12;
    /**
    * How many records is required to start displying "you have a lot of records" warning messages while exporting and downloading datasets.
    * @name Grid.manyRecordsThreshold
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @property
    */
    instance.manyRecordsThreshold = 5000;
    /**
    * How many miliseconds to wait before fetching each recordset from the remote source to allow the client time to parse and redraw.
    * @name Grid.downloadDelay
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @property
    */
    instance.downloadDelay = 500;
    /**
    * Selection method.  This value is read only.  To change the selection method you must re-instantiate the grid.
    * @name Grid.selectionMethod
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @property
    */
    if (args.selectionMethod === undefined) { args.selectionMethod = 3; }
    /**
    * Don't warn that the table/row content has changed.  Also, don't dump local cache after each 'dirty' request.
    * @name Grid.ignoreTableChanges
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @private
    * @property
    */
    if (args.ignoreTableChanges === undefined) { args.ignoreTableChanges = true; }
    /**
    * Keeps track of which row is to be used as the aggregate total row.
    * @name Grid.aggregateRow
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @property
    */
    instance.aggregateRow = -1;
    /**
    * Keeps track of which row is to be used as the new record row.
    * @name Grid.newRowIndex
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @property
    */
    instance.newRowIndex = -1;
    /**
    * Table checksum.  When checksum is different than the remote checksum the table data has changed or cannot track changes. (Uses Sum(conver(binary,vercol)) of selected object to create checksum).  Only works with remote recordsets.
    * @name Grid.objectChecksum
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @property
    */
    instance.objectChecksum = -1; /* is: select sum(binary_checksum(vercol)) from object to check for table changes*/
    /**
    * This does nothing.
    * @name Grid.newCellMessage
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.String
    * @private
    * @property
    * @deprecated
    */
    instance.newCellMessage = '';
    /**
    * Used internally to hold process messages.
    * @name Grid.rowPreviewText
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.String
    * @private
    * @property
    */
    instance.rowPreviewText = '';
    /**
    * Used internally to hold process messages for the aggregate cell being calculated.
    * @name Grid.aggregateCellMessage
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.String
    * @private
    * @property
    */
    instance.aggregateCellMessage = '';
    if (args.detailsPaneVisible !== undefined) {
        instance.detailsPaneVisible = args.detailsPaneVisible;
    } else {
        /**
        * When true the detail pane is visible.
        * @name Grid.detailsPaneVisible
        * @memberOf Rendition.UI.Grid.prototype
        * @type Native.Boolean
        * @private
        * @readOnly
        * @property
        */
        instance.detailsPaneVisible = false;
    }
    /**
    * List of the exportable file types.  Used to create the export dialog.
    * @name Grid.outputFileTypes
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Array
    * @private
    * @readOnly
    * @property
    */
    instance.outputFileTypes = [
		['CSV', Rendition.Localization['Grid_OutputFileTypes_CSV_Comma_Seperated_Values'].Title],
		['HTML', Rendition.Localization['Grid_OutputFileTypes_HTML'].Title],
		['XML', Rendition.Localization['Grid_OutputFileTypes_XML'].Title]
	]
    /**
    * List of the supported SQL aggregate functions.  Used to create the aggregate dialog.  Only supported by remote recordsets.
    * @name Grid.SQL_aggregate_functions
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Array
    * @private
    * @readOnly
    * @property
    */
    instance.SQL_aggregate_functions = [
		['SUM', Rendition.Localization['Grid_aggOp_Sum'].Title],
		['AVG', Rendition.Localization['Grid_aggOp_Average'].Title],
		['COUNT', Rendition.Localization['Grid_aggOp_Count'].Title],
		['MAX', Rendition.Localization['Grid_aggOp_Max'].Title],
		['MIN', Rendition.Localization['Grid_aggOp_Min'].Title]
	];
    /**
    * List of addtional SQL aggregate functions.  Used to create the aggregate dialog.  Only supported by remote recordsets.
    * @name Grid.SQL_add_aggregate_functions
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Array
    * @private
    * @readOnly
    * @property
    */
    instance.SQL_add_aggregate_functions = [
		['STDEV', Rendition.Localization['Grid_aggOp_Standard_Deviation'].Title],
		['STDEVP', Rendition.Localization['Grid_aggOp_Standard_Deviation_for_Population'].Title],
		['VAR', Rendition.Localization['Grid_aggOp_Variance'].Title],
		['VARP', Rendition.Localization['Grid_aggOp_Variance_of_Population'].Title]
	];
    /**
    * Object id returned by the remote recordset.  When there is no remote recordset this will be -1.  Some objects, for example ad hoc queries may not return -1.
    * @name Grid.objectId
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @readOnly
    * @property
    */
    instance.objectId = -1;
    /**
    * The value to append to the end of the query.  For example " where myColumn = 'Some value' ".  This can be a String or a Function.  Pass the value &gt;columnX&lt; where X is the column number to return name of column X.  When a function is used the function will be evaluated before each asynchronous request.
    * @name Grid.suffix
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Object
    * @public
    * @property
    */
    instance.suffix = args.suffix || '';
    /**
    * The column to order this recordset by.  This can be a String, Integer or a function that returns a String or an Integer. When a function is used the function will be evaluated before each asynchronous request.
    * @name Grid.orderBy
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Object
    * @public
    * @property
    */
    instance.orderBy = args.orderBy || '0';
    /**
    * The direction to order this recordset by. 0 = Descending, 1 = Ascending.  Can be an Integer or a function that returns an Integer. When a function is used the function will be evaluated before each asynchronous request.
    * @name Grid.orderDirection
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Object
    * @public
    * @property
    */
    instance.orderByDirection = args.orderDirection || '0';
    /**
    * The number of records in this recordset.  This will be 0 when there are no records or the inital recordset has not yet returned.
    * @name Grid.records
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @public
    * @property
    * @readOnly
    */
    instance.records = 0;
    /**
    * The number of columns in this recordset.  This will be 0 when there are no records or the inital recordset has not yet returned.
    * @name Grid.columns
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @public
    * @property
    * @readOnly
    */
    instance.columns = 0;
    /**
    * How many rows.
    * @name Grid.searchMatchRowOffset
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @property
    * @readOnly
    */
    instance.searchMatchRowOffset = args.searchMatchRowOffset || 3;
    /**
    * An object looks that looks like {x:Int,y:Int} representing where the viewport div is scrolled to.
    * @name Grid.scrollPos
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Object
    * @private
    * @readOnly
    * @property
    */
    instance.scrollPos = { x: 0, y: -1 }
    /**
    * An object looks that looks like {h:Int,w:Int} representing the dimentions of the viewport.
    * @name Grid.viewPortDim
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Object
    * @private
    * @readOnly
    * @property
    */
    instance.viewPortDim = { h: 0, w: 0 }
    /**
    * An object looks that looks like {top:Int,bottom:Int} representing the size of the rowset buffer above and below the visible area.
    * @name Grid.viewPortDataBuffer
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Object
    * @private
    * @readOnly
    * @property
    */
    instance.viewPortDataBuffer = { top: 40, bottom: 40 }
    /**
    * An object looks that looks like {x:Int,y:Int} representing location of the parent node.
    * @name Grid.parentPos
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Object
    * @private
    * @readOnly
    * @property
    */
    instance.parentPos = { x: 0, y: 0 }
    /**
    * An object looks that looks like {from:Int,to:Int} representing currently visible rows in the viewport.
    * @name Grid.loadedRange
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Object
    * @private
    * @readOnly
    * @property
    */
    instance.loadedRange = { from: Infinity, to: Infinity }
    /**
    * An object looks that looks like {from:Int,to:Int,bufferFrom:Int,bufferTo:Int} representing an empty range object.  Used internally while buffering data.
    * @name Grid.emptyRange
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Object
    * @private
    * @readOnly
    * @property
    */
    instance.emptyRange = { from: 0, to: 0, bufferFrom: 0, bufferTo: 0 }
    /**
    * Internal abort count for request object.  When abort count reaches abort threshold the request is aborted.
    * @name Grid.abortCounter
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @readOnly
    * @property
    */
    instance.abortCounter = 0;
    /**
    * Used internally to force redrawing of the viewport area.
    * @name Grid.forceRedraw
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @private
    * @readOnly
    * @property
    */
    instance.forceRedraw = false;
    /**
    * Used internally to keep track of the currently selected by search function row.
    * @name Grid.searchHighlight
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @readOnly
    * @property
    */
    instance.searchHighlight = null;
    /**
    * Used internally to hold the aggregate result data.
    * @name Grid.aggregateResult
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Integer
    * @private
    * @readOnly
    * @property
    * @deprecated
    */
    instance.aggregateResult = undefined;
    /**
    * Used internally prevent/allow selection of text.
    * @name Grid.mozSelect
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @private
    * @readOnly
    * @property
    */
    instance.mozSelect = false;
    /**
    * Used internally to hold the suffix built by the search function.
    * @name Grid.searchSuffix
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.String
    * @private
    * @readOnly
    * @property
    */
    instance.searchSuffix = '';
    /**
    * DOMElement that will hold the command focus for the grid.  When the gird is 'active' the cursor wll be focused on this input.  The input is positioned off the screen (negitive top/left) but visible.  The input listens for 'hot keys' for the grid.
    * @name Grid.editInput
    * @memberOf Rendition.UI.Grid.prototype
    * @type DOMElement
    * @private
    * @readOnly
    * @property
    */
    instance.editInput = null;
    /**
    * List of selected rows.  E.g.: [1,2,3,5,6].  This array is not populated unless the grid is in row select mode.
    * @name Grid.selectedRows
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Array
    * @public
    * @readOnly
    * @property
    */
    instance.selectedRows = [];
    /**
    * List of selected columns.  E.g.: [1,2,3,5,6].  This array is not populated unless the grid is in column select mode.
    * @name Grid.selectedColumns
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Array
    * @public
    * @readOnly
    * @property
    */
    instance.selectedColumns = [];
    /**
    * List of selected cells.  E.g.: [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3]] menas select row 1,2,3 and columns 1,2,3.   This array is not populated unless the grid is in cell select mode.
    * @name Grid.selectedCells
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Array
    * @public
    * @readOnly
    * @property
    */
    instance.selectedCells = [];
    /**
    * Matching rows returned from the search function.
    * @name Grid.searchMatchRows
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Array
    * @public
    * @readOnly
    * @property
    */
    instance.searchMatchRows = [];
    /**
    * Search filters object generated by the search function.  Looks like [{ column:'TheColumnName',operator:'=',value:'blah',value2:'',type:'VarChar(50)',group:'1',linkOperator:'or'}].  For more information about searchFilters see the commerce search object.
    * @name Grid.searchFilters
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Array
    * @public
    * @readOnly
    * @property
    */
    if (args.searchFilters !== undefined) {
        instance.searchFilters = args.searchFilters;
    } else {
        instance.searchFilters = [{
            column: undefined,
            operator: undefined,
            value: undefined,
            value2: undefined,
            type: undefined,
            group: undefined,
            linkOperator: undefined
        }];
    }
    /**
    * List of the column data in this grid.
    * @name Grid.headers
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Array
    * @public
    * @readOnly
    * @property
    */
    instance.headers = undefined;
    /**
    * Used internally to help reposition the header columns.
    * @name Grid.reposition
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Array
    * @private
    * @readOnly
    * @property
    */
    instance.reposition = null;
    /**
    * Used internally to keep track of the inline editor while in edit mode.
    * @name Grid.edit
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Object
    * @private
    * @readOnly
    * @property
    */
    instance.edit = {
        record: null,
        cell: null,
        rowIndex: null,
        columnIndex: null,
        cellIndex: null,
        state: null,
        timestamp: null,
        inputs: null
    }
    /**
    * If true the first column is a row counter.  Cannot be changed at runtime.
    * @name Grid.rowCountColumn
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Object
    * @public
    * @readOnly
    * @property
    */
    instance.rowCountColumn = Rendition.UI.iif(args.rowCountColumn === undefined, false, args.rowCountColumn);
    /* end of properties */
    /**
    * Executes event subscriptions.
    * @function
    * @name Grid.executeEvents
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Boolean} false if cancel default was called.
    * @param {Native.Array} events to execute.
    * @param {Native.Object} e The DOM event object.
    * @param {Native.DHTMLElement} element the related DHTML element.
    * @param {Native.Array} evntArg The arguments to add to the event signature.
    */
    instance.executeEvents = function (events, e, element, evntArg) {
        var fLength = events.length;
        if (fLength < 1) { return false; }
        if (evntArg === undefined) { evntArg = []; }
        var row = null;
        var column = null;
        var data = null;
        var header = null;
        if (element) {
            if (element.getAttribute) {
                if (element.tagName.toLowerCase() === 'input') {
                    row = parseInt(element.parentNode.getAttribute('row'));
                    column = parseInt(element.parentNode.getAttribute('column'));
                } else {
                    row = parseInt(element.getAttribute('row'));
                    column = parseInt(element.getAttribute('column'));
                }
                if (instance.local[row]) {
                    data = instance.local[row].data;
                    if (data === null) {
                        /* if the data rows are not loaded, get the data from the argument set
                        * fixes a bug on init cell style for local JS recordsets
                        */
                        data = evntArg[0];
                    }
                } else {
                    data = [];
                }
                if (instance.headers) {
                    header = instance.headers[column];
                } else {
                    header = undefined;
                }
            }
        }
        instance.cancelDefault = false;
        evntArg.unshift(e, instance, element, row, column, instance.selection, data, header);
        for (var x = 0; fLength > x; x++) {
            events[x].apply(this, evntArg);
        }
        return instance.cancelDefault;
    }
    /**
    * Prevent the default event from occuring.  For use within an event handler.  For example, when used in within a function subscribed to the editfinish event, running grid.preventDefault() will prevent the grid from updating the recordset.
    * @function
    * @name Grid.preventDefault
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.undefined
    * @public
    */
    instance.preventDefault = function () {
        instance.cancelDefault = true;
    }
    /**
    * Attach a procedure to an event.  Usage grid.addEventListener('cellmousedown',function(e,grid,element,row,column,selection,data,header){/*your procedure code},false)
    * @function
    * @name Grid.addEventListener
    * @memberOf Rendition.UI.Grid.prototype
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
            instance.log('can\'t attach to event handler ' + type);
        }
        return null;
    }
    /**
    * Removes an event from subscription list.  The [proc] must match exactly the [proc] subscribed with.
    * @function
    * @name Grid.removeEventListener
    * @memberOf Rendition.UI.Grid.prototype
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
    * @name Grid.addInitalEvents
    * @memberOf Rendition.UI.Grid.prototype
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
    /* event arrays and attachment of events passed as arguments */
    instance.events = {
        /**
        * Occurs when the mouse moves while in a cell in the rowset.
        * @event
        * @name Grid.oncellmousemove
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        cellmousemove: instance.addInitalEvents(args.cellmousemove),
        /**
        * Occurs when the mouse moves over a cell in the rowset.
        * @event
        * @name Grid.oncellmouseover
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        cellmouseover: instance.addInitalEvents(args.cellmouseover),
        /**
        * Occurs when the mouse moves out of a cell in the rowset.
        * @event
        * @name Grid.oncellmouseout
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        cellmouseout: instance.addInitalEvents(args.cellmouseout),
        /**
        * Occurs when the mouse clicks on a cell in the rowset.
        * @event
        * @name Grid.oncellclick
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        cellclick: instance.addInitalEvents(args.cellclick),
        /**
        * Occurs when the mouse double clicks on a cell in the rowset.
        * @event
        * @name Grid.oncelldblclick
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        celldblclick: instance.addInitalEvents(args.celldblclick),
        /**
        * Occurs when a mouse button is released on a cell in the rowset.
        * @event
        * @name Grid.oncellmouseup
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        cellmouseup: instance.addInitalEvents(args.cellmouseup),
        /**
        * Occurs when a mouse button is depresed on a cell in the rowset.
        * @event
        * @name Grid.oncellmousedown
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        cellmousedown: instance.addInitalEvents(args.cellmousedown),
        /**
        * Occurs when a context menu is called on a cell.
        * @event
        * @name Grid.oncellcontextmenu
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        cellcontextmenu: instance.addInitalEvents(args.cellcontextmenu),
        /**
        * Occurs when a mouse button is depresed on a row in the rowset.
        * @event
        * @name Grid.onrowmousedown
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        rowmousedown: instance.addInitalEvents(args.rowmousedown),
        /**
        * Occurs when a mouse button is released on a row in the rowset.
        * @event
        * @name Grid.onrowmouseup
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        rowmouseup: instance.addInitalEvents(args.rowmouseup),
        /**
        * Occurs when a mouse button is clicked on a row in the rowset.
        * @event
        * @name Grid.onrowclick
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        rowclick: instance.addInitalEvents(args.rowclick),
        /**
        * Occurs when a mouse button is double clicked on a row in the rowset.
        * @event
        * @name Grid.onrowdblclick
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        rowdblclick: instance.addInitalEvents(args.rowdblclick),
        /**
        * Occurs when the mouse moves over a row in the rowset.
        * @event
        * @name Grid.onrowmouseover
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        rowmouseover: instance.addInitalEvents(args.rowmouseover),
        /**
        * Occurs when the mouse moves out of a row in the rowset.
        * @event
        * @name Grid.onrowmouseout
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        rowmouseout: instance.addInitalEvents(args.rowmouseout),
        /**
        * Occurs when the mouse moves within a row in the rowset.
        * @event
        * @name Grid.onrowmousemove
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        rowmousemove: instance.addInitalEvents(args.rowmousemove),
        /**
        * Occurs when a context menu is called on a row.
        * @event
        * @name Grid.onrowcontextmenu
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        rowcontextmenu: instance.addInitalEvents(args.rowcontextmenu),
        /**
        * Occurs when a mouse button is depresed on a header cell.
        * @event
        * @name Grid.onheadermousedown
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        headermousedown: instance.addInitalEvents(args.headermousedown),
        /**
        * Occurs when a mouse button is released on a header cell.
        * @event
        * @name Grid.onheadermouseup
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        headermouseup: instance.addInitalEvents(args.headermouseup),
        /**
        * Occurs when a mouse button is clicked on a header cell.
        * @event
        * @name Grid.onheaderclick
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        headerclick: instance.addInitalEvents(args.headerclick),
        /**
        * Occurs when a mouse button is double clicked on a header cell.
        * @event
        * @name Grid.onheaderdblclick
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        headerdblclick: instance.addInitalEvents(args.headerdblclick),
        /**
        * Occurs when the mouse moves over a header cell.
        * @event
        * @name Grid.onheadermouseover
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        headermouseover: instance.addInitalEvents(args.headermouseover),
        /**
        * Occurs when the mouse moves out of a header cell.
        * @event
        * @name Grid.onheadermouseout
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        headermouseout: instance.addInitalEvents(args.headermouseout),
        /**
        * Occurs when the mouse moves within a header cell.
        * @event
        * @name Grid.onheadermousemove
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        headermousemove: instance.addInitalEvents(args.headermousemove),
        /**
        * Occurs when a context menu is called on a header.
        * @event
        * @name Grid.onheadercontextmenu
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        headercontextmenu: instance.addInitalEvents(args.headercontextmenu),
        /**
        * Occurs when a mouse button is depressed anywhere on the grid.
        * @event
        * @name Grid.onviewportmousedown
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        viewportmousedown: instance.addInitalEvents(args.viewportmousedown),
        /**
        * Occurs when a mouse button is released anywhere on the grid.
        * @event
        * @name Grid.onviewportmouseup
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        viewportmouseup: instance.addInitalEvents(args.viewportmouseup),
        /**
        * Occurs when a mouse button is clicked anywhere on the grid.
        * @event
        * @name Grid.onviewportclick
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        viewportclick: instance.addInitalEvents(args.viewportclick),
        /**
        * Occurs when a mouse button is double clicked anywhere on the grid.
        * @event
        * @name Grid.onviewportdblclick
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        viewportdblclick: instance.addInitalEvents(args.viewportdblclick),
        /**
        *  Occurs when the mouse moves out of a header cell.
        * @event
        * @name Grid.onviewportmouseover
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        viewportmouseover: instance.addInitalEvents(args.viewportmouseover),
        /**
        *  Occurs when the mouse moves out of the grid.
        * @event
        * @name Grid.onviewportmouseout
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        viewportmouseout: instance.addInitalEvents(args.viewportmouseout),
        /**
        * Occurs when the mouse moves within the grid.
        * @event
        * @name Grid.onviewportmousemove
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        viewportmousemove: instance.addInitalEvents(args.viewportmousemove),
        /**
        * Occurs when a context menu is called anywhere on the grid.
        * @event
        * @name Grid.onviewportcontextmenu
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        viewportcontextmenu: instance.addInitalEvents(args.viewportcontextmenu),
        /**
        * Occurs when a row is deleted.
        * @event
        * @name Grid.ondeleterow
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        deleterow: instance.addInitalEvents(args.deleterow),
        /**
        * Occurs before a row is deleted.
        * @event
        * @name Grid.ondeleterowstart
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        deleterowstart: instance.addInitalEvents(args.deleterow),
        /**
        * Occurs after a row is deleted.
        * @event
        * @name Grid.ondeleterowfinish
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        deleterowfinish: instance.addInitalEvents(args.deleterow),
        /**
        * Occurs when a row is inserted.
        * @event
        * @name Grid.oninsertrow
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        insertrow: instance.addInitalEvents(args.insertrow),
        /**
        * Occurs before a row is inserted.
        * @event
        * @name Grid.oninsertrowstart
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        insertrowstart: instance.addInitalEvents(args.insertrowstart),
        /**
        * Occurs after a row is inserted.
        * @event
        * @name Grid.oninsertrowfinish
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        insertrowfinish: instance.addInitalEvents(args.insertrowfinish),
        /**
        * Occurs when a key is released in an inline edit cell.
        * @event
        * @name Grid.oneditkeyup
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editkeyup: instance.addInitalEvents(args.editkeyup),
        /**
        * Occurs when a key is depressed in an inline edit cell.
        * @event
        * @name Grid.oneditkeydown
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editkeydown: instance.addInitalEvents(args.editkeydown),
        /**
        * Occurs when a key is pressed in an inline edit cell.
        * @event
        * @name Grid.oneditkeypress
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editkeypress: instance.addInitalEvents(args.editkeypress),
        /**
        * Occurs before inline editing begins.
        * @event
        * @name Grid.oneditstart
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editstart: instance.addInitalEvents(args.editstart),
        /**
        * Occurs after inline editing begins.
        * @event
        * @name Grid.onaftereditstart
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        aftereditstart: instance.addInitalEvents(args.aftereditstart),
        /**
        * Occurs when the inline editor values are commited.
        * @event
        * @name Grid.oneditfinish
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editfinish: instance.addInitalEvents(args.editfinish),
        /**
        * Occurs the a mouse button is depressed in an inline editor cell.
        * @event
        * @name Grid.oneditmousedown
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editmousedown: instance.addInitalEvents(args.editmousedown),
        /**
        * Occurs the a mouse button is released in an inline editor cell.
        * @event
        * @name Grid.oneditmouseup
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editmouseup: instance.addInitalEvents(args.editmouseup),
        /**
        * Occurs the a mouse button is clicked in an inline editor cell.
        * @event
        * @name Grid.oneditclick
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editclick: instance.addInitalEvents(args.editclick),
        /**
        * Occurs the a mouse button is double clicked in an inline editor cell.
        * @event
        * @name Grid.oneditdblclick
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editdblclick: instance.addInitalEvents(args.editdblclick),
        /**
        * Occurs the a mouse moves over an inline editor cell.
        * @event
        * @name Grid.oneditmouseover
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editmouseover: instance.addInitalEvents(args.editmouseover),
        /**
        * Occurs the a mouse moves out of an inline editor cell.
        * @event
        * @name Grid.oneditmouseout
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editmouseout: instance.addInitalEvents(args.editmouseout),
        /**
        * Occurs the a mouse moves within an inline editor cell.
        * @event
        * @name Grid.oneditmousemove
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editmousemove: instance.addInitalEvents(args.editmousemove),
        /**
        * Occurs the a context menu is called on an editor cell.
        * @event
        * @name Grid.oneditcontextmenu
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        editcontextmenu: instance.addInitalEvents(args.editcontextmenu),
        /**
        * Occurs the grid is being resized.
        * @event
        * @name Grid.onresize
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        resize: instance.addInitalEvents(args.resize),
        /**
        * Occurs the grid is scrolling.
        * @event
        * @name Grid.onscroll
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        scroll: instance.addInitalEvents(args.scroll),
        /**
        * Occurs after the row is loaded into the DOM after data is read in.
        * @event
        * @name Grid.onrowload
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        rowload: instance.addInitalEvents(args.rowload),
        /**
        * Occurs after the callback for data request.
        * @event
        * @name Grid.onloadcallback
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        loadcallback: instance.addInitalEvents(args.loadcallback),
        /**
        * Occurs before the row is loaded into the DOM after data is read in.
        * @event
        * @name Grid.onafterloadcallback
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.Object} JSON Data.
        */
        afterloadcallback: instance.addInitalEvents(args.afterloadcallback),
        /**
        * Occurs when the selection has changed.
        * @event
        * @name Grid.onselectionchange
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        selectionchange: instance.addInitalEvents(args.selectionchange),
        /**
        * Occurs before the selection has changed.
        * @event
        * @name Grid.onbeforeselectionchange
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        beforeselectionchange: instance.addInitalEvents(args.beforeselectionchange),
        /**
        * Occurs whent the DOM is being redrawn from local data.
        * @event
        * @name Grid.ondraw
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        draw: instance.addInitalEvents(args.draw),
        /**
        * Occurs after the search is complete.
        * @event
        * @name Grid.onaftersearch
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        aftersearch: instance.addInitalEvents(args.aftersearch),
        /**
        * Occurs the grid is initalized.
        * @event
        * @name Grid.oninit
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        init: instance.addInitalEvents(args.init),
        /**
        * Occurs before the grid is initalized.
        * @event
        * @name Grid.onbeforeinit
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        */
        beforeinit: instance.addInitalEvents(args.beforeinit),
        /**
        * Occurs when each row is stylized giving you a chance to change the appeance of the row.
        * @event
        * @name Grid.onrowstyle
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Array} data The data related to this event.
        * @param {Native.Array} header The header related to this event.
        */
        rowstyle: instance.addInitalEvents(args.rowstyle),
        /**
        * Occurs when each cell is stylized giving you a chance to change the appeance of the cell.
        * @event
        * @name Grid.oncellstyle
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Array} data The data related to this event.
        * @param {Native.Array} header The header related to this event.
        */
        cellstyle: instance.addInitalEvents(args.cellstyle),
        /**
        * Occurs when each selected row is stylized giving you a chance to change the appeance of the row.
        * @event
        * @name Grid.onselectionstyle
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Array} data The data related to this event.
        * @param {Native.Array} header The header related to this event.
        */
        selectionstyle: instance.addInitalEvents(args.selectionstyle),
        /**
        * Occurs when the detail pane is being redrawn.
        * @event
        * @name Grid.ondetailspane
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        detailspane: instance.addInitalEvents(args.detailspane),
        /**
        * Occurs when the data is being submitted to the rowset provider.
        * @event
        * @name Grid.onrecordupdated
        * @memberOf Rendition.UI.Grid.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} grid The grid instance firing the event.
        * @param {Native.DHTMLElement} element The DOM object the event belongs to.
        * @param {Native.Integer} row The row the event occured on.
        * @param {Native.Integer} column The column the event occured on.
        * @param {Native.Array} selection A list of the selected rows/columns depending on the current selection method.
        * @param {Native.Array} data The rowset data of this event.
        * @param {Native.Object} header The rowset data of this event.
        */
        recordupdated: instance.addInitalEvents(args.recordupdated)
    }


    /* events */
    /*editing*/
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_deleterow
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_deleterow = function (e, obj) {
        if (instance.executeEvents(instance.events.deleterow, e, obj)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_deleterowstart
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_deleterowstart = function (e, obj) {
        if (instance.executeEvents(instance.events.deleterowstart, e, obj)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_deleterowfinish
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_deleterowfinish = function (e, obj) {
        if (instance.executeEvents(instance.events.deleterowfinish, e, obj)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_insertrow
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_insertrow = function (e, obj) {
        if (instance.executeEvents(instance.events.insertrow, e, obj)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_insertrowstart
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_insertrowstart = function (e, obj) {
        if (instance.executeEvents(instance.events.insertrowstart, e, obj)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_recordupdated
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_recordupdated = function (e, obj) {
        if (instance.executeEvents(instance.events.recordupdated, e, obj)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_insertrowfinish
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_insertrowfinish = function (e, obj) {
        if (instance.executeEvents(instance.events.insertrowfinish, e, obj)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_afterEditStart
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_afterEditStart = function (e, obj) {
        if (instance.executeEvents(instance.events.aftereditstart, e, obj)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editStart
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editStart = function (e, obj) {
        if (instance.executeEvents(instance.events.editstart, e, obj)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editFinish
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editFinish = function (e, obj) {
        if (instance.executeEvents(instance.events.editfinish, e, obj)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editKeyUp
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editKeyUp = function (e) {
        if (instance.executeEvents(instance.events.editkeyup, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editKeyDown
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editKeyDown = function (e) {
        if (instance.executeEvents(instance.events.editkeydown, e, this)) { return false }
        var ctrl = false;
        var shift = false;
        if (e.ctrlKey || e.metaKey) { ctrl = true; }
        if (e.shiftKey) { var shift = true; }
        /*
        13 = enter
        46 = delete
        40 = down arrow
        37 = left arrow
        38 = up arrow
        39 = right arrow
        27 = esc
        33 = pgup
        34 = pgdown
        36 = home
        35 = end
        70 = F (find)
        78 = N (new)
        65 = A (select all)
        82 = R (refresh)
        */
        if (instance.edit.rowIndex != null) {/*user is editing*/
            if (e.keyCode === 27) {/* esc: abort editing */
                instance.abortEdit();
            } else if (e.keyCode === 13) {/* enter: confirm edits */
                instance.endEdit(false);
            } else if (e.keyCode === 13) {/* arrow down: confirm edits, start editing in the cell directly below this one */
                debugger;
            }
        }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editKeyPress
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editKeyPress = function (e) {
        if (instance.executeEvents(instance.events.editkeypress, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editMouseMove
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editMouseMove = function (e) {
        if (instance.executeEvents(instance.events.editmousemove, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editMouseOver
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editMouseOver = function (e) {
        if (instance.executeEvents(instance.events.editmouseover, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editMouseOut
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editMouseOut = function (e) {
        if (instance.executeEvents(instance.events.editmouseout, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editClick
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editClick = function (e) {
        if (instance.executeEvents(instance.events.editclick, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editDblClick
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editDblClick = function (e) {
        if (instance.executeEvents(instance.events.editdblclick, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editMouseUp
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editMouseUp = function (e) {
        if (instance.executeEvents(instance.events.editmouseup, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editMouseDown
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editMouseDown = function (e) {
        if (instance.executeEvents(instance.events.editmousedown, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_editContextMenu
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_editContextMenu = function (e) {
        if (instance.executeEvents(instance.events.editcontextmenu, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_resize
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_resize = function (e) {
        if (instance.executeEvents(instance.events.resize, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_scroll
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_scroll = function (e) {
        if (instance.executeEvents(instance.events.scroll, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_rowload
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.Integer} rowNum The row the event occured on.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_rowload = function (obj, rowNum) {
        if (instance.executeEvents(instance.events.rowload, null, obj, [rowNum])) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_loadcallback
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.Object} json_data The JSON response data.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_loadcallback = function (e, json_data) {
        if (instance.executeEvents(instance.events.loadcallback, e, null, [json_data])) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_afterloadcallback
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.Object} json_data The JSON response data.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_afterloadcallback = function (e, json_data) {
        if (instance.executeEvents(instance.events.afterloadcallback, e, null, [json_data])) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_beforeSelectionChange
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_beforeSelectionChange = function (e, obj) {
        if (instance.executeEvents(instance.events.beforeselectionchange, e, obj)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_selectionChange
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_selectionChange = function (e, obj) {
        if (instance.executeEvents(instance.events.selectionchange, e, obj)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_draw
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} previous_range The previous range of rows.
    * @param {Native.Object} range The new range of rows.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_draw = function (previous_range, range) {
        if (instance.executeEvents(instance.events.draw, null, null, [previous_range, range])) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_init
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.Object} args The inital grid arguments passed by the caller.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_init = function (e, args) {
        if (instance.executeEvents(instance.events.init, e, null, [args])) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_beforeinit
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.Object} args The inital grid arguments passed by the caller.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_beforeinit = function (e, args) {
        if (instance.executeEvents(instance.events.beforeinit, e, null, [args])) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_rowstyle
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.Integer} rowNum The row the event occured on.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_rowstyle = function (obj, rowNum) {
        if (instance.executeEvents(instance.events.rowstyle, null, obj, [rowNum])) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_cellstyle
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.DHTMLElement} e The element the event is related to.
    * @param {Native.Array} data The data on the related row.
    * @param {Native.Array} header The header of the related column.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_cellstyle = function (obj, data, header) {
        if (instance.executeEvents(instance.events.cellstyle, null, obj, [data, header])) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_selectionstyle
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.DHTMLElement} obj The element the event is related to.
    * @param {Native.Integer} rowIndex The row the event occured on.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_selectionstyle = function (obj, rowIndex) {
        if (instance.executeEvents(instance.events.selectionstyle, null, obj, [rowIndex])) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_headerMouseMove
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_headerMouseMove = function (e) {
        if (instance.executeEvents(instance.events.headermousemove, e, this)) { return false }
        instance.headerMouseMove(e, this);
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_headerMouseOver
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_headerMouseOver = function (e, obj) {
        if (instance.executeEvents(instance.events.headermouseover, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_headerMouseOut
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_headerMouseOut = function (e) {
        if (instance.executeEvents(instance.events.headermouseout, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_headerClick
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_headerClick = function (e) {
        if (instance.executeEvents(instance.events.headerclick, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_headerDblClick
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_headerDblClick = function (e) {
        if (instance.executeEvents(instance.events.headerdblclick, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_aftersearch
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_aftersearch = function (e) {
        if (instance.executeEvents(instance.events.aftersearch, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_headerMouseUp
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_headerMouseUp = function (e) {
        if (instance.executeEvents(instance.events.headermouseup, e, this)) { return false }
        if (instance.headerClick) {
            if (instance.headerClickTimer) {
                clearTimeout(instance.headerClickTimer);
                instance.headerClickTimer = null;
            }
            if (args.preventReorder === false || args.preventReorder === undefined) {
                instance.reorderColumn(e, this);
            }
        }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_headerMouseDown
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_headerMouseDown = function (e) {
        if (instance.executeEvents(instance.events.headermousedown, e, this)) { return false }
        if (this.getAttribute('resize') === '1') {
            if (e.button === 0) {
                if (args.preventHeaderResize === false || args.preventHeaderResize === undefined) {
                    instance.headerStartResize(e, this);
                }
            }
        } else {
            if (e.button === 0) {
                if (args.preventHeaderReposition === false || args.preventHeaderReposition === undefined) {
                    instance.headerStartReposition(e, this);
                }
            }
        }
        if (this.getAttribute('resize') === '0' && e.button === 0) {
            instance.headerClick = true;
            instance.headerClickTimer = setTimeout(function () {
                instance.headerClick = false;
            }, 500);
        } else {
            instance.headerClick = false;
        }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_headerContextMenu
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_headerContextMenu = function (e) {
        if (instance.executeEvents(instance.events.headercontextmenu, e, this)) { return false }
        instance.headerContextMenu(e, this);
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_rowMouseMove
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_rowMouseMove = function (e) {
        if (instance.executeEvents(instance.events.rowmousemove, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_rowMouseOver
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_rowMouseOver = function (e) {
        if (instance.executeEvents(instance.events.rowmouseover, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_rowMouseOut
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_rowMouseOut = function (e) {
        if (instance.executeEvents(instance.events.rowmouseout, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_rowClick
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_rowClick = function (e) {
        if (instance.executeEvents(instance.events.rowclick, e, this)) { return false }
        instance.selectRowCellColumnClick(this, e);
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_rowDblClick
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_rowDblClick = function (e) {
        if (instance.executeEvents(instance.events.rowdblclick, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_rowMouseUp
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_rowMouseUp = function (e) {
        if (instance.executeEvents(instance.events.rowmouseup, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_rowMouseDown
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_rowMouseDown = function (e) {
        if (instance.executeEvents(instance.events.rowmousedown, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_rowContextMenu
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_rowContextMenu = function (e) {
        if (instance.executeEvents(instance.events.rowcontextmenu, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_cellMouseMove
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_cellMouseMove = function (e) {
        if (instance.executeEvents(instance.events.cellmousemove, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_cellMouseOver
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_cellMouseOver = function (e) {
        if (instance.executeEvents(instance.events.cellmouseover, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_cellMouseOut
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_cellMouseOut = function (e) {
        if (instance.executeEvents(instance.events.cellmouseout, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_cellClick
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_cellClick = function (e) {
        if (instance.headers === undefined) { return false }
        if (instance.executeEvents(instance.events.cellclick, e, this)) { return false }
        var columnIndex = parseInt(this.getAttribute('column'));
        var rowIndex = parseInt(this.getAttribute('row'));
        if (instance.edit.cell != null && !(instance.edit.rowIndex === rowIndex)) {
            instance.endEdit(false);
        }
        instance.selectRowCellColumnClick(this, e);
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_cellDblClick
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_cellDblClick = function (e) {
        if (instance.headers === undefined) { return false }
        if (instance.executeEvents(instance.events.celldblclick, e, this)) { return false }
        if (args.editMode > 0) {
            var columnIndex = parseInt(this.getAttribute('column'));
            var rowIndex = parseInt(this.getAttribute('row'));
            if (instance.edit.cell != null && !(instance.edit.rowIndex === rowIndex)) {
                instance.endEdit(false);
            } else {
                instance.startEdit(e, this);
            }
        }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_cellMouseUp
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_cellMouseUp = function (e) {
        if (instance.executeEvents(instance.events.cellmouseup, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_cellMouseDown
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_cellMouseDown = function (e) {
        if (instance.executeEvents(instance.events.cellmousedown, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_cellContextMenu
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_cellContextMenu = function (e) {
        if (instance.executeEvents(instance.events.cellcontextmenu, e, this)) { return false }
        instance.rowCellColumnContextMenu(e, this);
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_viewPortDblClick
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_viewPortDblClick = function (e) {
        if (instance.executeEvents(instance.events.viewportdblclick, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_viewPortClick
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_viewPortClick = function (e) {
        if (instance.executeEvents(instance.events.viewportclick, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_viewPortMouseMove
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_viewPortMouseMove = function (e) {
        if (instance.executeEvents(instance.events.viewportmousemove, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_viewPortMouseOut
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_viewPortMouseOut = function (e) {
        if (instance.executeEvents(instance.events.viewportmouseout, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_viewPortMouseOver
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_viewPortMouseOver = function (e) {
        if (instance.executeEvents(instance.events.viewportmouseover, e, this)) { return false }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_viewPortMouseDown
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_viewPortMouseDown = function (e) {
        if (instance.headers === undefined) { return false }
        if (instance.executeEvents(instance.events.viewportmousedown, e, this)) { return false }
        if (e.button === 0) {
            instance.mouseSelect = true;
        }
        var mouse = Rendition.UI.mouseCoords(e);
        var pos = Rendition.UI.getPosition(instance.viewPort);
        /* show scroll preview thingy if the user has clicked on the scroll bar area */
        instance.rowPreview.textContent = Rendition.Localization['Grid_Click_and_drag_to_see_x'].Title.replace('{0}', instance.headers[instance.orderBy].displayName);
        if ((mouse.x - pos.x) > instance.viewPortPos.x + instance.viewPortDim.w + instance.parentPos.x - instance.style.scrollBarWidth
		&& (instance.records * instance.style.rowRect.h) > instance.viewPortDim.h) {
            instance.rowPreview.style.visibility = 'visible';
            var dest = { y: mouse.y + instance.style.previewRect.y, x: mouse.x + instance.style.previewRect.x }
            if (instance.rowPreview.offsetWidth + dest.x > document.documentElement.clientWidth) {
                instance.rowPreview.style.left = (dest.x - (instance.rowPreview.offsetWidth * 1.25)) + 'px';
            } else {
                instance.rowPreview.style.left = (dest.x) + 'px';
            }
            instance.rowPreview.style.top = (dest.y) + 'px';
        }
        return true;
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_detailPane
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_detailPane = function (e, obj) {
        if (instance.detailsPaneVisible === false) { return false }
        if (instance.executeEvents(instance.events.detailspane, e, instance.detailsPane)) { return false }
        if (instance.local.length < 1) { return false }
        instance.tabs = [];
        instance.tabs[0] = Rendition.UI.TabBarTab({
            title: 'Details',
            load: function (tab, tabBar, content) {
                var c = content;
                c.innerHTML = '';
                c.style.overflow = 'hidden';
                c.style.overflowY = 'scroll';
                if (instance.selection === undefined || instance.local === undefined) {
                    c.innerHTML = '<div style="padding:5px;"><i>' +
                        Rendition.Localization['Grid_Click_on_a_row_to_see_details_about_that_row_here'].Title + '</i></div>';
                    return;
                }

                var loc = instance.local[instance.selection[0].rowIndex];
                if (loc.data === undefined) {
                    return;
                }
                var val = loc.data[instance.orderBy];
                var obHeader = instance.headers[instance.orderBy];
                if (loc.state > 1) {
                    c.innerHTML = '<div style="float:left;clear:both;margin:5px;max-width:450px;padding:3px;background:lightyellow;border:solid 1px #777" class="ui-corner-all">' +
						obHeader.description + '</div><div style="padding:5px;">' +
					obHeader.displayName
					+ ' ' +
					val + '<br>' +
					Rendition.Localization['Grid_Selected_Rows'].Title + instance.selection.length +
					'<br></div>';

                }
            }
        });
        /*  Never finished this part.
        instance.tabs[1] = Rendition.UI.TabBarTab({
        title: 'Aggregate',
        load: function (tab, tabBar, content) {
        var c = content;
        c.innerHTML = '';
        }
        });
        instance.tabs[2] = Rendition.UI.TabBarTab({
        title: 'Controls',
        load: function (tab, tabBar, content) {
        var c = content;
        c.innerHTML = '';
        }
        });
        */
        instance.tabbar = Rendition.UI.TabBar({
            tabs: instance.tabs,
            parentNode: instance.detailsPane,
            activeTabIndex: 0
        });

    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name Grid.eventlisteners_viewPortMouseUp
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} e The event object.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_viewPortMouseUp = function (e) {
        if (instance) {
            if (instance.rowPreview) {
                instance.rowPreview.style.visibility = 'hidden';
            }
            if (instance.executeEvents(instance.events.viewportmouseup, e, this)) { return false }
            if (e.button === 0) {
                instance.mouseSelect = false;
            }
        }
        return true;
    }
    /**
    * Redraw the grid, reapply the style.
    * @function
    * @name Grid.resize
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns undefined.
    */
    instance.resize = function () {
        instance.applyStyle();
    }
    /**
    * Creates a generic editor to edit a row using the genericEditor class.
    * @function
    * @name Grid.genericEditor
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} rowIndex The row to edit.
    * @param {Native.Object} [Formparams] Parameters for the generic editor.  See the genericEditor class for more information.
    * @param {Native.Object} [newRecordRowData] Object used to replace the default new data drawn from the header object (if remote, then from the default value column of the SQL object).  Looks like: {columnName:data,columnName2:data2}
    * @public
    * @returns {Native.Object} A instance of the genericEditor class.
    */
    instance.genericEditor = function (rowIndex, Formparams, newRecordRowData) {
        var commandType = 0;
        if (rowIndex === undefined) {
            rowIndex = instance.newRowIndex;
        }
        if (rowIndex === instance.newRowIndex) {
            commandType = 1;
        }
        var data = null;

        var p = {
            commandType: commandType,
            dataSet: {
                schema: instance.schema,
                header: instance.headers,
                data: [instance.local[rowIndex].data]
            },
            title: Rendition.UI.iif(rowIndex === instance.newRowIndex, Rendition.Localization['Grid_Add_To'].Title, Rendition.Localization['Grid_Update'].Title) + instance.schema.displayName,
            callbackProcedure: function (e) {
                if (!instance.eventlisteners_recordupdated(e, null)) { }
                instance.refresh();
            }
        }
        if (args.editorParameters !== undefined) {
            $.extend(true, p, args.editorParameters);
        }
        if (Formparams !== undefined) {
            $.extend(true, p, Formparams);
        }
        if (newRecordRowData !== undefined) {
            p.dataSet.data = [newRecordRowData];
        }
        var ed = Rendition.UI.GenericEditor(p);
        return ed;
    }
    /**
    * Used inernally to create a list of control buttons.
    * @function
    * @name Grid.controlBox
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Object} ctrlArgs Parameters for the controlBox.
    * @param {Native.Boolean} [ctrlArgs.addButton=true] Show the add button or not.
    * @param {Native.Boolean} [ctrlArgs.removeButton=true] Show the remove button or not.
    * @param {Native.Boolean} [ctrlArgs.searchButton=true] Show the search button or not.
    * @param {Native.Boolean} [ctrlArgs.selectAll=true] Show the selecta all button or not.
    * @param {Native.Boolean} [ctrlArgs.outputToAFile=true] Show the output to a file button or not.
    * @private
    * @returns {Native.Object} A groupBox class containing all the buttons.
    */
    instance.controlBox = function (ctrlArgs) {
        if (ctrlArgs === undefined) {
            ctrlArgs = { showAll: true }
        }
        var clds = [];
        if (ctrlArgs.addButton !== undefined || ctrlArgs.showAll === true) {
            var addButton = document.createElement('button');
            addButton.style.fontSize = '.8em';
            addButton.onclick = function () {
                instance.genericEditor();
            }
            addButton.innerHTML = 'Add';
            clds.push(addButton);
        }
        if (ctrlArgs.removeButton !== undefined || ctrlArgs.showAll === true) {
            var removeButton = document.createElement('button');
            removeButton.style.fontSize = '.8em';
            removeButton.onclick = function () {
                alert('not implmented');
            }
            removeButton.innerHTML = Rendition.Localization['Grid_controlbox_Delete'].Title;
            clds.push(removeButton);
        }
        if (ctrlArgs.searchButton !== undefined || ctrlArgs.showAll === true) {
            var searchButton = document.createElement('button');
            searchButton.style.fontSize = '.8em';
            searchButton.onclick = function () {
                instance.searchDialog();
            }
            searchButton.innerHTML = Rendition.Localization['Grid_context_Search'].Title;
            clds.push(searchButton);
        }
        if (ctrlArgs.selectAll !== undefined || ctrlArgs.showAll === true) {
            var selectAll = document.createElement('button');
            selectAll.style.fontSize = '.8em';
            selectAll.onclick = function () {
                instance.selectAll();
            }
            selectAll.innerHTML = Rendition.Localization['Grid_context_Select_All'].Title;
            clds.push(selectAll);
        }
        if (ctrlArgs.outputToAFile !== undefined || ctrlArgs.showAll === true) {
            var outputToAFile = document.createElement('button');
            outputToAFile.style.fontSize = '.8em';
            outputToAFile.onclick = function () {
                instance.outputToFileDialog();
            }
            outputToAFile.innerHTML = Rendition.Localization['Grid_context_Export'].Title;
            clds.push(outputToAFile);
        }
        var g = Rendition.UI.GroupBox({
            title: ctrlArgs.title || Rendition.Localization['Grid_context_Controls'].Title,
            childNodes: clds,
            alwaysExpanded: true
        })
        return g
    }
    /**
    * Initializes the grid.
    * @function
    * @name Grid.init
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} The initialized grid.
    */
    instance.init = function () {
        if (!instance.eventlisteners_beforeinit(null, null)) {
            return;
        }
        /* get some backgrounds and rects from the style function */
        if (args.style !== undefined) {
            instance.style = args.style;
        } else {
            instance.style = Rendition.UI.defaultGridStyle;
        }
        if (!Rendition.UI.gridStyleApplied) {
            Rendition.UI.gridStyleApplied = true;
            var s = '.r_gridTable tr { \
				height:' + instance.style.rowRect.h + 'px;\
				font:' + instance.style.rowHeaderFont + ';\
				color:' + instance.style.rowHeaderFontColor + ';\
				text-align:' + instance.style.rowHeaderTextAlign + ';\
				moz-user-select:text;\
				border:none;\
			}\
			.r_gridRowPreview { \
				position:absolute;\
				visibility:hidden;\
				min-width:175px;\
				padding:' + instance.paddingRectToString(instance.style.previewPaddingRect) + ';\
				background:' + instance.style.previewBackground + ';\
				color:' + instance.style.previewFontColor + ';\
				border:' + instance.style.previewBorder + ';\
			}\
			.r_gridHeader { \
				position:absolute;\
				cursor:auto;\
				overflow:hidden;\
				z-index:1000;\
				padding:' + instance.paddingRectToString(instance.style.headerCellPadding) + ';\
				height:' + instance.style.headerCellRect.h + 'px;\
				background:' + instance.style.headerCellBackground + ';\
				font:' + instance.style.headerCellFont + ';\
				color:' + instance.style.headerCellFontColor + ';\
				textAlign:' + instance.style.headerCellAlignment + ';\
			}\
			.r_gridSelect {\
				padding:0;\
				border:none;\
				margin:0;\
				width:%100;\
				color:' + instance.style.editCellColor + ';\
				font:' + instance.style.editCellFont + ';\
				height:' + instance.style.rowRect.h + 'px;\
				background:' + instance.style.editCellBackground + ';\
			}\
			.r_gridInput {\
				padding:' + instance.paddingRectToString(instance.style.cellPadding) + ';\
				border:none;\
				margin:0;\
				width:%100;\
				color:' + instance.style.editCellColor + ';\
				font:' + instance.style.editCellFont + ';\
				height:' + instance.style.rowRect.h + 'px;\
				background:' + instance.style.editCellBackground + ';\
			}\
			.r_gridTable { \
				table-layout:fixed;\
				border-collapse:collapse;\
				margin:0;\
				empty-cells:show;\
				position:absolute;\
			}\
			.r_gridTable td { \
				overflow:hidden;\
				color:' + instance.style.cellFontColor + ';\
				font:' + instance.style.cellFont + ';\
				moz-user-select:text;\
				padding:' + instance.paddingRectToString(instance.style.cellPadding) + ';\
				background:' + instance.style.cellBackground + ';\
			}\
			.r_gridOrderByArrowDesc {\
				position:absolute;\
				z-index:9999;\
				height:' + instance.style.orderArrowRect.h + 'px;\
				width:' + instance.style.orderArrowRect.w + 'px;\
				top:' + instance.style.orderArrowRect.y + 'px;\
				background:' + instance.style.orderArrowDescBackground + ';\
			}\
			.r_gridOrderByArrowAsc {\
				position:absolute;\
				z-index:9999;\
				height:' + instance.style.orderArrowRect.h + 'px;\
				width:' + instance.style.orderArrowRect.w + 'px;\
				top:' + instance.style.orderArrowRect.y + 'px;\
				background:' + instance.style.orderArrowAscBackground + ';\
			}\
			.r_gridAggSelect { \
				border:none;\
				padding:0;\
				margin:0;\
			}\
			.r_gridReposition { \
				opacity:.7;\
				moz-opacity:.7;\
				z-index:9999;\
			}';
            Rendition.UI.addCss(s);
        }
        /* figure out where the grid will live */
        if (args.parentNode) {
            /**
            * The parent node of the grid.
            * @name Grid.parentNode
            * @memberOf Rendition.UI.Grid.prototype
            * @type Native.DHTMLElement
            * @public
            * @readOnly
            * @property
            */
            instance.parentNode = args.parentNode;
        }
        if (args.dialog) {
            /**
            * The dialog the grid belongs to if no parent node was defined and the grid paramaters contained dialog = true
            * @name Grid.dialog
            * @memberOf Rendition.UI.Grid.prototype
            * @type Native.Object
            * @public
            * @readOnly
            * @property
            */
            instance.dialog = Rendition.UI.dialogWindow({
                rect: {
                    x: document.documentElement.clientWidth * .10,
                    y: document.documentElement.clientHeight * .10,
                    w: document.documentElement.clientWidth * .80,
                    h: document.documentElement.clientHeight * .80
                },
                title: Rendition.Localization['Grid_Grid'].Title
            });
            instance.parentNode = instance.dialog.content;
        }
        /**
        * DIV element that contains all grid elements.  This DIV hadles the scrolling events.
        * @name Grid.viewPort
        * @memberOf Rendition.UI.Grid.prototype
        * @type DHTMLObject
        * @private
        * @readOnly
        * @property
        */
        instance.viewPort = document.createElement('div');
        /**
        * DIV element that contains the table rows.  This div causes the scrollbar on the viewport DIV.
        * @name Grid.grid
        * @memberOf Rendition.UI.Grid.prototype
        * @type DHTMLObject
        * @private
        * @readOnly
        * @property
        */
        instance.grid = document.createElement('div');
        /**
        * DIV element that holds the header elements.  This DIV uses css clipping to move around.
        * @name Grid.header
        * @memberOf Rendition.UI.Grid.prototype
        * @type DHTMLObject
        * @private
        * @readOnly
        * @property
        */
        instance.header = document.createElement('div');
        /**
        * DIV element that holds the header elements.  This DIV uses css clipping to move around.
        * @name Grid.rowPreview
        * @memberOf Rendition.UI.Grid.prototype
        * @type DHTMLObject
        * @private
        * @readOnly
        * @property
        */
        instance.rowPreview = document.createElement('div');
        instance.editInput = document.createElement('input');
        /**
        * DIV element that changes css background property and position to show which column is the column being ordered by and which direction.
        * @name Grid.orderByArrow
        * @memberOf Rendition.UI.Grid.prototype
        * @type DHTMLObject
        * @private
        * @readOnly
        * @property
        */
        instance.orderByArrow = document.createElement('div');
        /**
        * DIV element that that contains the detail pane DHTML.
        * @name Grid.detailsPane
        * @memberOf Rendition.UI.Grid.prototype
        * @type DHTMLObject
        * @private
        * @readOnly
        * @property
        */
        instance.detailsPane = document.createElement('div');
        /**
        * Tells the resize, clipping etc if the parent is absolutly positioned or relitivly positioned.
        * @name Grid.parentAbsolute
        * @memberOf Rendition.UI.Grid.prototype
        * @type Native.Boolean
        * @private
        * @readOnly
        * @property
        */
        instance.parentAbsolute = true;
        instance.orderByArrow.className = 'r_gridOrderByArrowAsc';
        instance.header.style.position = 'absolute';
        instance.grid.style.position = 'absolute';
        instance.detailsPane.style.position = 'absolute';
        if (typeof instance.grid.style.MozUserSelect != 'undefined') {
            instance.mozSelect = true;
            instance.grid.style.MozUserSelect = '-moz-none';
        } else {
            instance.grid.onselectstart = function () { return false; }
        }
        instance.viewPort.style.position = 'absolute';
        instance.viewPort.style.overflow = 'scroll';
        instance.viewPort.style.display = 'block';
        instance.rowPreview.className = 'r_gridRowPreview ui-corner-all';
        instance.viewPort.appendChild(instance.grid);
        if (instance.parentNode) {
            instance.appendTo(instance.parentNode);
        }
        if (instance.eventlisteners_init(null, args)) {
            instance.orderByUnInitialized = true;
            if (args.objectName !== undefined) {
                instance.draw({ from: 1, to: instance.initalRecords, bufferFrom: 1, bufferTo: instance.initalRecords });
            } else if (args.data !== undefined) {
                instance.JSONToLocalCache(undefined, args.data).redraw();
            }
        }
        return instance;
    }
    /**
    * Appends the grid to a DHTML object.  This is used to append the grid after initilization or move the grid from one element to another.
    * @function
    * @name Grid.appendTo
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.DHTMLElement} node The DHTML Element to append the grid to.
    */
    instance.appendTo = function (node) {
        if (instance.viewPort.parentNode !== null) {
            if (instance.parentNode === node) { return instance; }
            if (instance.dialog) {
                setTimeout(function () {
                    instance.dialog.close();
                }, 0);
            }
            Rendition.UI.wireupResizeEvents(instance.resize, instance.parentNode, true);
        } else {
            Rendition.UI.appendEvent('scroll', instance.viewPort, instance.scroll, false);
            Rendition.UI.appendEvent('mousedown', instance.viewPort, instance.eventlisteners_viewPortMouseDown, false);
            Rendition.UI.appendEvent('mouseup', document.body, instance.eventlisteners_viewPortMouseUp, false);
        }
        instance.parentNode = node;
        instance.parentNode.appendChild(instance.viewPort);
        instance.parentNode.appendChild(instance.detailsPane);
        instance.parentNode.appendChild(instance.header);
        document.body.appendChild(instance.rowPreview);
        /* on top of everything */
        instance.rowPreview.style.zIndex = Rendition.UI.topModalzindex + 1;
        Rendition.UI.wireupResizeEvents(instance.resize, instance.parentNode);
        instance.applyStyle();
        instance.eventlisteners_detailPane(null, null);
        return instance;
    }
    /**
    * Used internally to create the delete request.
    * @function
    * @name Grid.deleteURL
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Object} data The data for the URL.  An array of selected row numbers.
    */
    instance.deleteURL = function (data) {
        var url = args.deleteURL || Rendition.UI.gridDeleteURL;
        try {
            var uri = url.apply(instance, [
				args.objectName/*object name*/, Rendition.UI.stringOrFunction(instance.suffix, instance)/*suffix*/,
				instance.dataSet.range.from/*from*/, instance.dataSet.range.to/*to*/,
				""/*search suffix*/, {}/*agg cols*/,
				data/*selected rows*/, 'JSON'/*outputType*/, true/*schemaUpdate*/,
				instance.objectChecksum/*checksum*/, true/*delete*/,
				instance.headers[instance.orderBy].name,
				Rendition.UI.iif(instance.orderByDirection === 0, 'asc', 'desc'), instance
			]);
        } catch (err) {
            alert("Error in delegate Rendition.UI.gridDeleteURL > " + err.message);
            return "";
        }
        return uri;
    }
    /**
    * Used internally to create the insert request.
    * @function
    * @name Grid.insertURL
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Object} data The data for the URL.  An object containing the new row data.
    * @param {Native.Object} [overwrite] Overwrite the data if it exists without prompting.
    */
    instance.insertURL = function (data, overwrite) {
        var url = args.URL || Rendition.UI.gridInsertURL;
        try {
            var uri = url.apply(instance, [args.objectName, JSON.parse(data), overwrite]);
        } catch (err) {
            alert("Error in delegate gridUpdateURL > " + err.message);
            return "";
        }
        return uri;
    }
    /**
    * Used internally to create the update request.
    * @function
    * @name Grid.updateURL
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Object} data The data for the URL.  An object containing the new row data.
    * @param {Native.Object} [overwrite] Overwrite the data if it exists without prompting.
    */
    instance.updateURL = function (data, overwrite) {
        var url = args.updateURL || Rendition.UI.gridUpdateURL;
        try {
            var uri = url.apply(instance, [args.objectName, JSON.parse(data), overwrite]);
        } catch (err) {
            alert("Error in delegate gridUpdateURL > " + err.message);
            return "";
        }
        return uri;
    }
    /**
    * Used internally to create the schema update (column sizes prefrences etc.) request.
    * @function
    * @name Grid.schemaUpdateURL
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    */
    instance.schemaUpdateURL = function () {
        var url = args.schemaUpdateURL || Rendition.UI.gridSchemaUpdateURL;
        try {
            var uri = url.apply(instance, [instance.objectId, instance.headers, instance]);
        } catch (err) {
            alert("Error in delegate schemaUpdateURL > " + err.message);
            return "";
        }
        return uri;
    }
    /**
    * Used internally to create the select request.
    * @function
    * @name Grid.selectURL
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Integer} from The record to start grabbing from.
    * @param {Native.Integer} from The record to grab to.
    * @param {Native.Array} aggregateColumns Array of columns to include in an aggregate function.
    * @param {Native.Array} selectedRows of columns to include in an aggregate function.
    * @param {Native.String} [outputType='JSON'] What sort of output to generate.
    */
    instance.selectURL = function (from, to, searchSuffix, aggregateColumns, selectedRows, outputType) {
        var url = args.selectURL || Rendition.UI.gridSelectURL;
        if (searchSuffix !== undefined) {
            var ss = searchSuffix;
        } else {
            var ss = '';
        }
        var orderByOverride = '';
        var orderDirectionOverride = '';
        if (instance.orderByUnInitialized && args.orderBy !== undefined) {
            orderByOverride = args.orderBy;
        }
        if (instance.orderByUnInitialized && args.orderDirection !== undefined) {
            orderDirectionOverride = args.orderDirection;
        }
        var schemaUpdate = Rendition.UI.iif(instance.headers === undefined || instance.includeSchema === true, true, false);
        instance.includeSchema = undefined;
        /* execute the Rendition.UI.gridSelectURL, passing the arguments to
        the function expecting to see the URI 
        signature :
        (objectName, suffix, from, to, searchSuffix, aggregateColumns,
        selectedRows, outputType, includeSchema, checksum, del, orderBy, orderDirection)
        */
        var ac = aggregateColumns;
        if (ac) {
            ac = JSON.parse(ac);
        }
        var sr = selectedRows;
        if (sr) {
            sr = JSON.parse(sr);
        }
        try {
            var uri = url.apply(instance, [
				args.objectName/*object name*/, Rendition.UI.stringOrFunction(instance.suffix, instance, [instance])/*suffix*/,
				from/*from*/, to || 10/*to*/, ss/*search suffix*/, ac || {}/*agg cols*/,
				sr || []/*selected rows*/, outputType || 'JSON'/*outputType*/, schemaUpdate,
				instance.objectChecksum/*checksum*/, false/*delete*/,
				orderByOverride || '', orderDirectionOverride || '', instance
			]);
        } catch (err) {
            alert("Error in delegate Rendition.UI.gridSelectURL > " + err.message);
            return "";
        }
        return uri;
    }
    /**
    * Clips the header DIV to the desired width.  Slow. Dirty.
    * @function
    * @name Grid.clip
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    */
    instance.clip = function () {
        if (instance.parentNode === undefined || instance.viewPortPos === undefined) { return null; }
        var addH = 0;
        if (!instance.parentAbsolute) {
            addH++;
        }
        instance.header.style.clip = 'rect(' +
			((instance.style.gridRect.x * -1)) + 'px, ' +
			((instance.scrollPos.x) + instance.viewPort.offsetWidth + instance.style.headerRect.w - instance.style.scrollBarWidth - addH) + 'px, ' +
			(instance.scrollPos.y + instance.style.headerRect.h + instance.viewPort.offsetHeight) + 'px, ' +
			(instance.scrollPos.x) + 'px' +
		')';
        instance.header.style.left = ((instance.scrollPos.x * -1) + instance.style.headerRect.x + instance.style.gridRect.x + instance.viewPortPos.x + addH) + 'px';
        return null;
    }
    /**
    * Used internally to encapsulate the clip() function and prevent it from fireing when the grid is scrolled up and down.
    * @function
    * @name Grid.scrollX
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    */
    instance.scrollX = function () {
        instance.clip();
        return null;
    }
    /**
    * Used internally to _not_ encapsulate the clip() function and prevent it from fireing when the grid is scrolled up and down.
    * @function
    * @name Grid.scrollY
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    */
    instance.scrollY = function () {
        instance.loadedIndex = '';
        instance.visibleRange = instance.getVisibleRange();
        instance.updateRowPreview();
        if (instance.scrollTimer !== undefined) {
            clearTimeout(instance.scrollTimer);
        }
        instance.scrollTimer = setTimeout(function () {
            instance.draw(instance.visibleRange, false)
        }, 100);
        return null;
    }
    /**
    * Redraws the grid firing all related events and recreating or updating DHTML elements.
    * @function
    * @name Grid.redraw
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Function} [callbackProcedure] A function to execute after the grid is finished redrawing and all requests are complete.
    */
    instance.redraw = function (callbackProcedure) {
        instance.loadedRange = { from: 0, to: 0 }
        instance.forceRedraw = true;
        instance.loadedIndex = '';
        instance.draw(instance.getVisibleRange(), false, callbackProcedure);
        return instance;
    }
    /**
    * Scroll is used internally to attach to the viewport and listen for onscroll events.  This will then update the viewport scroll position and fire either scrollX or scrollY.
    * @function
    * @name Grid.scroll
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    */
    instance.scroll = function () {
        if (!instance.eventlisteners_scroll()) { return null }
        if (instance.scrollPos.x != instance.viewPort.scrollLeft) {
            instance.scrollPos.x = instance.viewPort.scrollLeft;
            instance.scrollX();
        }
        if (instance.scrollPos.y != instance.viewPort.scrollTop) {
            instance.scrollPos.y = instance.viewPort.scrollTop;
            instance.scrollY();
        }
        return null;
    }
    /**
    * Update the row preview element causing it to display the most recent data.
    * @function
    * @name Grid.updateRowPreview
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null
    */
    instance.updateRowPreview = function () {
        if (instance.records < 1) { return null }
        if (!instance.visibleRange) { return null }
        if (instance.local[instance.visibleRange.from + 1] === undefined) { return null }
        var previewRow = '';
        if (instance.local[instance.visibleRange.from + 1].state > 1) {
            previewRow = instance.local[instance.visibleRange.from + 1].data[instance.orderBy];
        }
        if (previewRow.toString().length > 0) {
            instance.rowPreviewText = instance.headers[instance.orderBy].displayName + ' ' + previewRow;
        } else {
            instance.rowPreviewText = 'Row ' + instance.visibleRange.from + ' Loading...';
        }
        instance.rowPreview.textContent = instance.rowPreviewText;
        return null;
    }
    /**
    * Used interallly to determine the visible number of rows for the fetching and redrawing functions.
    * @function
    * @name Grid.getVisibleRange
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} {from: Integer, to: Integer, bufferFrom:Integer, bufferTo:Integer}.
    */
    instance.getVisibleRange = function () {
        var rowadd = 1;
        if (instance.aggregateRow != -1) { rowadd++; }
        if (instance.newRowIndex != -1) { rowadd++; }
        /* start counting from  how many records down we've scrolled */
        var f = Math.round(instance.scrollPos.y / instance.style.rowRect.h);
        /* count up to the height of the window. */
        var t = Math.round(instance.viewPortDim.h / instance.style.rowRect.h);
        if (f < 1) { f = 1 }
        t += f;
        if (t > instance.records + rowadd) { t = instance.records + rowadd }
        var bf = f - instance.viewPortDataBuffer.top;
        if (bf < 1) { bf = 1 }
        var bt = t + instance.viewPortDataBuffer.bottom;
        if (bt > instance.records + rowadd) { bt = instance.records + rowadd }
        return { from: f, to: t, bufferFrom: bf, bufferTo: bt }
    }
    /**
    * Log information to the console if it exists.
    * @function
    * @name Grid.log
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @depreciated
    * @returns {Native.Object} grid.
    * @param {Native.Object} e The message or object to log.
    */
    instance.log = function (e) {
        if (console.log) { console.log(e); return; }
        return instance;
    }
    /**
    * Appends a range of rows to the grid from the cache by creating or appending to viewport.firstChild TABLE element (i.e.: the grid).
    * @function
    * @name Grid.appendRows
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Integer} from Rows to append from.
    * @param {Native.Integer} z Rows to append to.
    */
    instance.appendRows = function (from, z) {
        if (instance.loadedIndex === String(from + '_' + z)) {
            return null;
        }
        instance.loadedIndex = String(from + '_' + z);
        var table = document.createElement('table');
        table.style.width = instance.headerWidth + 'px';
        table.className = 'r_gridTable';
        table.style.top = Math.round(from * instance.style.rowRect.h) + 'px';
        while (z > from) {
            table.appendChild(instance.local[from].DOM);
            from++;
        }
        if (instance.grid.firstChild) {
            instance.grid.replaceChild(table, instance.grid.firstChild);
        } else {
            instance.grid.appendChild(table);
        }
    }
    /**
    * Used interally to draw the grid elments, request new rows and define the viewport state.
    * @function
    * @name Grid.draw
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    * @param {Native.Object} range Object that contains what to redraw.
    * @param {Native.Boolean} forceRedraw Forces the grid to redaw even if it looks like it doesn't need to be redrawn.
    * @param {Native.Function} callbackProcedure Procedure that is applied after the grid is finished redrawing and all requests generated by this draw instance have returend without error.
    */
    instance.draw = function (range, forceRedraw, callbackProcedure) {
        if (instance.local.header !== undefined && range.from === 0) {
            if (callbackProcedure !== undefined) { callbackProcedure.apply(this, [null]) }
            return instance;
        }
        var addRange = 0;
        if (args.editMode > 1) { addRange++; }
        if (instance.aggregateRow != -1) { addRange++; }
        if (range.bufferTo > (instance.records + addRange)) { range.bufferTo = instance.records + addRange }
        /* count from the top down looking for the first missing record */
        var inCache = true;
        if (instance.local[0] === undefined) {
            inCache = false;
            z = 1; /* 1 is the first record not zero */
        } else {
            for (var z = range.bufferFrom; range.bufferTo >= z; z++) {
                if (instance.local[z].state === 0) {
                    inCache = false;
                    break;
                }
            }
        }
        if (forceRedraw || (instance.headers !== undefined && z > range.bufferFrom && (range.from < instance.loadedRange.from || range.to > instance.loadedRange.to))) {
            if (!instance.eventlisteners_draw(instance.loadedRange, range)) { return instance; }
            instance.loadedRange = { from: range.bufferFrom, to: range.bufferTo }
            /* append rows to table */
            instance.appendRows(range.bufferFrom, z);
        }
        /* one or more record was not in the local cache */
        if (!inCache) {
            /* count from the bottom up looking for the first missing record */
            var y = 0;
            if (instance.headers) {
                for (var y = range.bufferTo; z - 1 < y; y--) {
                    if (instance.local[y].state === 0) {
                        break;
                    }
                }
            }
            /* y-z to find out low large a recordset we need to fetch */
            if (z < 0) { z = 0 }
            if (y < 0) { y = 0 }
            instance.abortCounter++;
            if (instance.abortCounter > instance.readaheadAbortThreshold ||
            instance.grid.firstChild === null || instance.abortCounter < 2 || instance.forceRedraw) {
                instance.forceRedraw = false;
                instance.updateRowPreview();
                if (instance.reqEval !== null && instance.abortCounter > instance.readaheadAbortThreshold) {
                    instance.reqEval.abort();
                }
                if (instance.records > 0 || instance.grid.firstChild === null) {
                    /* check one last time if the record has shown up before fetching */
                    if (z === y && instance.local[z] !== undefined) { return instance; }
                    /* fetch the record(s) */
                    if (instance.local[0] === undefined) {
                        y = instance.initalRecords;
                    }
                    instance.downloadRecords(z, y, function (e) {
                        instance.abortCounter = 0;
                        instance.JSONToLocalCache(e);
                        if (instance.grid.firstChild == null) {
                            instance.loadedRange = { from: instance.dataSet.range.from, to: instance.dataSet.range.to }
                        }
                        document.body.style.cursor = 'auto';
                        instance.updateRowPreview();
                        instance.draw(instance.getVisibleRange(), true);
                        instance.reqEval = null;
                        if (callbackProcedure !== undefined) { callbackProcedure.apply(this, [e, JSON.parse(e.responseText)]) }
                    });
                }
            }
            /* HACK: stop counting up on fetch about to fix 'blank' pages */
            instance.abortCounter = 0;
        } else {
            if (callbackProcedure !== undefined) { callbackProcedure.apply(this, [null]) }
        }
        return instance;
    }
    /**
    * Download a range of records.
    * @function
    * @name Grid.downloadRecords
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Integer} from The record to start fetching from.
    * @param {Native.Integer} to The record to fetch to.
    * @param {Native.Function} callbackProcedure The function to execute after the request has finished successfully.
    * @param {Native.Boolean} [async=true] Sets if the function will be executed synchronously or asynchronously.  If this function is executed asynchronously the function will return immediatly, before the row data is loaded from the remote data source.
    */
    instance.downloadRecords = function (from, to, callbackProcedure, async) {
        instance.reqEval = Rendition.UI.Ajax(instance.selectURL(from, to), callbackProcedure, this, async);
        return instance;
    }
    /**
    * Get the result of an aggregate function on a particualr column from the SQL database and return it to the aggregate row.
    * @function
    * @name Grid.getAggregateColumn
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.String} columnName The name of the column to return aggregate data from.
    * @param {Native.String} The aggregate function to call.  Sum, Total, Min, Max are just a few.  See the MS SQL documentation for a complete list of aggregate functions.
    * @param {Native.Function} callbackProcedure The function to execute after the request has finished successfully.
    */
    instance.getAggregateColumn = function (columnName, aggregate, callbackProcedure) {
        var a = {}
        if (instance.selection !== undefined) {
            var sel = JSON.stringify(instance.selection);
        } else {
            var sel = JSON.stringify([]);
        }
        a[columnName] = aggregate;
        instance.aggEval = Rendition.UI.Ajax(instance.selectURL(0, 1, undefined, JSON.stringify(a), sel), callbackProcedure, this, false);
        return instance;
    }
    /**
    * Downloads all records.  If the number of records meets or exceeds manyRecordsThreshold a message will be displayed and a progress meter will appear with a cancel button.
    * @function
    * @name Grid.downloadAllRecords
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    */
    instance.downloadAllRecords = function () {
        instance.downloadDialog = Rendition.UI.dialogWindow({
            rect: {
                x: (document.documentElement.clientWidth * .5) - (400 * .5),
                y: (document.documentElement.clientHeight * .2),
                w: 400,
                h: 140
            },
            title: Rendition.Localization['Grid_Downloading_All_Records'].Title,
            modal: true,
            modalCloseable: false
        })
        instance.downloadMessage = document.createElement('div');
        var cancel = document.createElement(Rendition.Localization['Grid_button'].Title);
        cancel.innerHTML = Rendition.Localization['Grid_Cancel_Download'].Title;
        var findBox = Rendition.UI.GroupBox({
            title: Rendition.Localization['Grid_Just_a_moment'].Title,
            childNodes: [instance.downloadMessage, cancel],
            alwaysExpanded: true
        })
        instance.downloadMessage.textContent = Rendition.UI.iif(instance.records > instance.manyRecordsThreshold, 'There are ' + instance.records + ' records, depending on your connection speed downloading could take a while.', 'Downloading entire table, just a moment...');
        findBox.appendTo(instance.downloadDialog.content);
        instance.downloadRecords(1, instance.records, function (e) {
            instance.cancelDownload = false;
            instance.JSONToLocalCache(e).draw(instance.getVisibleRange());
            cancel.onclick = function () {
                instance.cancelDownload = true;
            }
            instance.reqEval = null;
        });
        cancel.onclick = function () {
            instance.reqEval.abort();
            instance.downloadMessage = undefined;
            instance.downloadDialog.close();
        }
        return instance;
    }
    /**
    * Updates all DHTML elements.
    * @function
    * @name Grid.applyStyle
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    */
    instance.applyStyle = function () {
        if (instance.parentNode === undefined) { return instance; }
        var dH = 0;
        if (instance.detailsPaneVisible) {
            dH = instance.style.detailsPaneRect.h - 4;
        }
        /* parents move? */
        instance.parentPos = Rendition.UI.getPositionUntilAbsolute(instance.parentNode);
        /*size and position*/
        var h = instance.parentNode.offsetHeight;
        var w = instance.parentNode.offsetWidth;
        if (args.offsetRect !== undefined) {
            instance.offsetRect = args.offsetRect;
            h -= args.offsetRect.h;
            w -= args.offsetRect.w;
            instance.parentPos.y += args.offsetRect.y;
            instance.parentPos.x += args.offsetRect.x;
        } else {
            instance.offsetRect = { x: 0, y: 0, h: 0, w: 0 }
        }
        if (h == 0 || w == 0) { return; } /* never resize when hidden */
        /*viewport*/
        instance.viewPortPos = { x: (instance.parentPos.x + instance.style.gridRect.x), y: (instance.parentPos.y + instance.style.gridRect.y + dH + instance.style.detailsPaneRect.y) }
        instance.viewPort.style.left = instance.viewPortPos.x + 'px';
        instance.viewPort.style.top = instance.viewPortPos.y + 'px';
        instance.viewPortDim.h = (instance.parentNode.offsetHeight + instance.offsetRect.h
		+ instance.style.gridRect.h - dH);
        instance.viewPortDim.w = (instance.parentNode.offsetWidth + instance.offsetRect.w
		+ instance.style.gridRect.w);
        instance.viewPort.style.height = instance.viewPortDim.h + 'px';
        instance.viewPort.style.width = instance.viewPortDim.w + 'px';
        /* details pane */
        instance.detailsPane.style.height = (dH) + 'px';
        if (instance.viewPort.offsetWidth > 0) {
            instance.detailsPane.style.width = (instance.style.detailsPaneRect.w + instance.viewPort.offsetWidth - 2) + 'px';
            instance.detailsPane.style.left = (instance.parentPos.x + instance.style.gridRect.x + instance.style.detailsPaneRect.x) + 'px';
            instance.detailsPane.style.top = (instance.parentPos.y + instance.style.gridRect.y + instance.style.detailsPaneRect.y) + 'px';
        }
        /*header*/
        instance.header.style.top = (instance.viewPortPos.y + instance.style.headerRect.y) + 'px';
        instance.header.style.left = (instance.viewPortPos.x + instance.style.headerRect.x) + 'px';
        instance.header.style.height = instance.style.headerRect.h + 'px';
        /*backgrounds*/
        if (instance.parentNode.style.position != 'absolute' || instance.detailsPaneVisible == true) {
            instance.parentAbsolute = false;
            instance.viewPort.style.border = instance.style.viewPortBorder;
            //instance.header.style.borderTop = instance.style.headerBorder;
            instance.detailsPane.style.background = instance.style.detailsPaneBackground;
            instance.detailsPane.style.color = instance.style.detailsPaneColor;
            instance.detailsPane.style.border = instance.style.detailsPaneBorder;
            instance.detailsPane.style.font = instance.style.detailsPaneFont;
        } else {
            instance.viewPort.style.border = 'none';
            instance.header.style.borderTop = 'none';
            instance.detailsPane.style.background = instance.style.detailsPaneBackground;
            instance.detailsPane.style.color = 'black';
            //instance.detailsPane.style.border = 'none';
            instance.detailsPane.style.font = instance.style.detailsPaneFont;
        }
        /*background*/
        instance.grid.style.background = instance.style.gridBackground;
        instance.header.style.background = instance.style.headerBackground;
        instance.viewPort.style.background = instance.style.viewPortBackground;
        instance.eventlisteners_detailPane(null, null);
        instance.clip();
        return instance;
    }
    /**
    * Used interally to load data from a local record source.
    * @function
    * @name Grid.loadData
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    */
    instance.loadData = function (a) {
        instance.disposeActiveCache();
        instance.JSONToLocalCache(undefined, a);
        instance.redraw();
        return instance;
    }
    /**
    * Used interally to load data from a JSON object and append it to the various properties in the grid.
    * @function
    * @name Grid.JSONToLocalCache
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    */
    instance.JSONToLocalCache = function (e, a) {
        /* in local datasets a (the Rendition.UI.DataSet object) is already parsed and defined
        * so selectCallback is not run.  Local recordsets don't use the e (XHTTP object). */
        if (e !== undefined) {
            var cb = args.selectCallback || Rendition.UI.gridSelectCallback;
            try {
                a = cb.apply(instance, [e, instance]);
            } catch (err) {
                alert("Error in delegate Rendition.UI.gridSelectCallback > " + err.message);
            }
        }
        if (!instance.eventlisteners_loadcallback(null, a)) { return instance }
        if (a.schema) {
            instance.objectId = a.schema.objectId;
            instance.columns = a.schema.columns;
            instance.displayName = a.schema.objectDisplayName;
            instance.schema = a.schema;
            if (a.schema.records != -1) {
                instance.records = a.schema.records;
            }
            if (a.schema.orderBy !== undefined) {
                instance.orderBy = a.schema.orderBy;
            }
            if (a.schema.orderByDirection !== undefined) {
                instance.orderByDirection = a.schema.orderByDirection;
            }
            if (instance.objectChecksum == -1) {
                instance.objectChecksum = a.schema.checksum;
            } else {
                if (a.schema.checksum != instance.objectChecksum && (args.ignoreTableChanges == false)) {
                    instance.objectChecksum = a.schema.checksum;
                    /* table has changed since last update, dispose of the cache and refresh the current view */
                    return instance.refresh();
                }
            }
        }
        /* add the headers if they aren't there yet */
        if (a.header !== undefined && instance.header.childNodes.length == 0) {
            instance.setupHeader(a.header);
        }
        /*add into the local cache and create DOM rows */
        var cnt = 0;
        if (a.range.to > instance.records) { a.range.to = instance.records; }
        var f = parseInt(a.range.from);
        var t = parseInt(a.range.to);
        for (var x = f; t > x; x++) {
            instance.local[x].state = 1;
        }
        a.data = Rendition.UI.parseDataTypes(a.data, instance.headers);
        var dlMsgUpdate = instance.downloadMessage !== undefined;
        var downloadRPMS = 1;
        var modUpdate = 37;
        var downloadProc = function () {
            if (t < f || instance.cancelDownload == true) {
                instance.downloadDialog.close();
                instance.downloadMessage = undefined;
                return null;
            }
            instance.createRow(f, a.data[f - 1], 'normal');
            f++;
            if (f % modUpdate == 0) {
                instance.downloadMessage.textContent = Rendition.Localization['Grid_Parseing_data_x_complete'].Title.replace('{0}', ((f / t) * 100).toFixed(2));
                setTimeout(downloadProc, downloadRPMS);
                return;
            }
            downloadProc();
            return;
        }
        if (dlMsgUpdate) {
            setTimeout(downloadProc, downloadRPMS);
        } else {
            var dataDefined = args.data !== undefined;
            if (dataDefined) {
                var l = a.data.length;
                for (var x = 0; l > x; x++) {
                    instance.createRow(x + 1, a.data[x], 'normal');
                }
            } else {
                for (var x = f; t >= x; x++) {
                    instance.createRow(x, a.data[x - f], 'normal');
                }
            }
        }
        document.body.style.cursor = 'auto';
        if (!instance.eventlisteners_afterloadcallback(null, a)) { return instance }
        /* add the public dataSet struct after the checks */
        instance.dataSet = {
            schema: a.schema,
            header: instance.headers,
            description: a.description,
            error: a.error,
            data: instance.getData(),
            range: a.range
        }
        return instance;
    }
    /**
    * Gets all the data in the local record cache.
    * @function
    * @name Grid.getData
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Array} Two dimentional array of the rows rows columns of data.
    */
    instance.getData = function () {
        var data = [];
        for (var x = 1; instance.records + 1 > x; x++) {
            data.push(instance.local[x].data);
        }
        return data;
    }
    /**
    * Used internally to truncate the presentation text.
    * @function
    * @name Grid.truncateText
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.String} text Text to be truncated.
    * @param {Integer|Float} width The width to truncate the text to.
    */
    instance.truncateText = function (text, width) {
        var aproxWidth = Rendition.UI.getAproxWidth(String(text).trim(), width, 11);
        if (aproxWidth.overwidth) {
            return aproxWidth.text + '...';
        } else {
            return String(text).trim();
        }
        return null;
    }
    /**
    * Used internally to process the aggregate return data.
    * @function
    * @name Grid.aggregateCallback
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Object} e The aggregate JSON data.
    */
    instance.aggregateCallback = function (e) {
        var a = JSON.parse(e.responseText);
        a = a.method1.DataSet.data;
        for (var x = 0; a.length > x; x++) {
            var s = a['aggregate' + x];
            var header = instance.getHeaderByName(s.name);
            var DOM = instance.local[instance.aggregateRow].DOM;
            var cell = Rendition.UI.getElementsByAttribute('index', header.index, 'td', DOM);
            cell[0].textContent = s.aggregateFunction + '(' + s.aggregateResult + ')';
        }
        instance.gotoRow(instance.aggregateRow);
    }
    /**
    * Used internally create rows for display on the grid.
    * @function
    * @name Grid.createRow
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Integer} rowNum The row number to create.
    * @param {Native.Array} rowData The data for this row.
    * @param {Native.String} rowType The type of row.  Can be 'normal', 'new' or 'agg'.
    */
    instance.createRow = function (rowNum, rowData, rowType) {
        if (rowData === undefined) { return }
        if (rowType == 'new') {
            instance.newRowIndex = rowNum;
        }
        var obj = instance.local[rowNum];
        if (instance.tempTbl === undefined || rowNum % 5000) {
            instance.tempTbl = document.createElement('table');
        }
        var row = instance.tempTbl.insertRow(0);
        for (var x = instance.columns - 1; -1 < x; x--) {
            var header = instance.getHeader(x);
            cell = row.insertCell(0);
            cell.setAttribute('column', x);
            cell.setAttribute('index', header.index);
            cell.setAttribute('row', rowNum);
            /* apply the current selection color to the new DOM rows as they come in */
            cell.style.width = (header.width + instance.style.cellRect.w) + 'px';
            cell.style.border = instance.style.cellBorder;
            cell.oncontextmenu = instance.eventlisteners_cellContextMenu;
            cell.onmouseover = instance.eventlisteners_cellMouseOver;
            cell.onmouseout = instance.eventlisteners_cellMouseOut;
            cell.onmouseup = instance.eventlisteners_cellMouseUp;
            cell.onmousedown = instance.eventlisteners_cellMouseDown;
            cell.onclick = instance.eventlisteners_cellClick;
            cell.ondblclick = instance.eventlisteners_cellDblClick;
            if (rowType == 'agg') {
                cell.onclick = function () {
                    instance.aggregateDialog(this.getAttribute('index'));
                }
            }
            if (header.dataType == 'datetime') {
                cell.textContent = instance.truncateText(Rendition.UI.formatDate(rowData[header.index], (args.dateFormat || 'mm/dd/yy hh:nn:ss')), header.width);
            } else {
                cell.textContent = instance.truncateText(rowData[header.index], header.width);
            }
            if ((header.visibility == 0) || (rowType == 'new' && args.hideNewRow)) {
                cell.style.visibility = 'hidden';
                cell.style.display = 'none';
            }
            instance.eventlisteners_cellstyle(cell, rowData, header);
        }
        /* header column */
        var cell = row.insertCell(0);
        cell.setAttribute('column', -1);
        cell.setAttribute('row', rowNum);
        cell.style.width = (instance.style.rowHeaderRect.w + instance.style.cellRect.w) + 'px';
        if (rowType == 'new') {
            cell.style.textAlign = 'center';
            cell.innerHTML = instance.style.newRowTitle;
        } else if (rowType == 'agg') {
            cell.style.textAlign = 'center';
            cell.innerHTML = instance.style.aggregateRowTitle;
        } else if (rowType == 'normal') {
            cell.textContent = rowNum;
        }
        cell.style.font = instance.style.rowHeaderFont;
        cell.style.color = instance.style.rowHeaderFontColor;
        cell.style.background = instance.style.rowHeaderBackground;
        cell.style.border = instance.style.cellBorder;
        if ((!instance.rowCountColumn) || (rowType == 'new' && args.hideNewRow)) {
            cell.style.visibility = 'hidden';
            cell.style.display = 'none';
        }
        cell.oncontextmenu = instance.eventlisteners_rowContextMenu;
        cell.onmouseover = instance.eventlisteners_rowMouseOver;
        cell.onmouseout = instance.eventlisteners_rowMouseOut;
        cell.onmouseup = instance.eventlisteners_rowMouseUp;
        cell.onmousedown = instance.eventlisteners_rowMouseDown;
        cell.onclick = instance.eventlisteners_rowClick;
        cell.ondblclick = instance.eventlisteners_rowDblClick;
        obj.DOM = row;
        obj.data = rowData;
        obj.state = 2;
        obj.rowType = rowType;
        instance.eventlisteners_rowload(obj, rowNum);
        instance.eventlisteners_rowstyle(obj, rowNum);
        instance.applySelectionStyle(rowNum);
        return instance;
    }
    /**
    * Gets one of the header (column) objects by its index number.
    * @function
    * @name Grid.getHeaderByIndex
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} Header object, or grid if no header is found.
    * @param {Native.Integer} ordinal The index number of the column.
    */
    instance.getHeaderByIndex = function (ordinal) {
        for (var x = 0; instance.columns > x; x++) {
            if (instance.headers[x].index == ordinal) {
                return instance.headers[x];
            }
        }
        return instance;
    }
    /**
    * Gets one of the header (column) objects by its order number (used defined column order).
    * @function
    * @name Grid.getHeader
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} Header object or undefined if no header is found.
    * @param {Native.Integer} ordinal The order number of the column.
    */
    instance.getHeader = function (ordinal) {
        if (instance.headers === undefined) { return }
        for (var x = 0; instance.columns > x; x++) {
            if (instance.headers[x].order == ordinal) {
                return instance.headers[x];
            }
        }
        return;
    }
    /**
    * Used interally to setup the header DHTML elements and some grid properties related to the header.
    * @function
    * @name Grid.setupHeader
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    * @param {Native.Object} src The inital header objects as parsed by the JSONToLocalCache function.
    */
    instance.setupHeader = function (src) {
        instance.headers = [];
        /* row header column */
        var h = document.createElement('div');
        h.className = 'r_gridHeader';
        instance.header.appendChild(h);
        h.style.width = instance.style.rowHeaderRect.w + 'px';
        h.style.left = '0px';
        if (!instance.rowCountColumn) {
            h.style.visibility = 'hidden';
            h.style.display = 'none';
        }
        var totalLeft = Rendition.UI.iif(instance.rowCountColumn, instance.style.rowHeaderRect.w + instance.style.headerCellPadding.r + instance.style.headerCellPadding.l, 0);
        /* every other column except 1 */
        var fLength = src.length;
        for (var x = 0; fLength > x; x++) {
            h = document.createElement('div');
            h.setAttribute('column', x);
            h.setAttribute('index', src[x].columnOrder);
            h.setAttribute('resize', '0');
            h.className = 'r_gridHeader';
            h.textContent = src[x].displayName;
            if (args.preventHeaderEvents === undefined || args.preventHeaderEvents == false) {
                h.onmousemove = instance.eventlisteners_headerMouseMove;
                h.onmouseover = instance.eventlisteners_headerMouseOver;
                h.onmouseout = instance.eventlisteners_headerMouseOut;
                h.onclick = instance.eventlisteners_headerClick;
                h.ondblclick = instance.eventlisteners_headerDblClick;
                h.oncontextmenu = instance.eventlisteners_headerContextMenu;
                h.onmousedown = instance.eventlisteners_headerMouseDown;
                h.onmouseup = instance.eventlisteners_headerMouseUp;
            }
            if (instance.mozSelect) {
                h.style.MozUserSelect = '-moz-none';
            } else {
                h.onselectstart = function () { return false; }
            }
            instance.header.appendChild(h);
            var titleWidth = h.offsetWidth;
            var width = src[x].columnSize;
            h.style.width = width + 'px';
            // Apply loclization - override values from database
            // get an Id no matter what
            if (args.dataSet) {
                if (args.dataSet.schema) {
                    var dssn = args.dataSet.schema.name;
                }
            }
            var lId = args.name || args.objectName || dssn;
            if (lId === undefined) {
                try { console.log('Grid missing name - cannot localize.'); } catch (e) { }
            }
            if (i.columnName !== 'VerCol') {
                var colId = 'Grid_' + lId + "_" + src[x].name.replace(/%/g, 'Pct').replace(/ /g, '_');
                if (Rendition.Localization[colId]) {
                    var loc = Rendition.Localization[colId];
                    src[x].displayName = loc.Title;
                    src[x].description = loc.Message;
                    src[x].hidden = loc.Hidden;
                    src[x].defaultValue = loc.DefaultValue;
                } else {
                    try {
                        console.log('<Field Id="' + colId + '" Title="' + src[x].displayName + '" Hidden="' + src[x].hidden + '" DefaultValue="' + src[x].defaultValue + '">' + src[x].description + '</Field>');
                    } catch (e) { }
                }
            }
            instance.headers.push({
                name: src[x].name,
                dataType: src[x].dataType,
                dataLength: src[x].dataLength,
                order: src[x].columnOrder,
                visibility: Rendition.UI.iif(src[x].name == 'VerCol', 0, Rendition.UI.iif(src[x].hidden == 1, 0, src[x].visibility)),
                description: src[x].description,
                object: h,
                titleWidth: titleWidth,
                width: width,
                offsetLeft: parseInt(totalLeft),
                index: parseInt(x),
                isNullable: src[x].isNullable,
                primaryKey: src[x].primaryKey,
                defaultValue: src[x].defaultValue,
                displayName: src[x].displayName,
                hidden: src[x].hidden
            });
            h.style.left = totalLeft + 'px';
            totalLeft += width + instance.style.headerCellPadding.r + instance.style.headerCellPadding.l;
        }
        instance.header.style.left = instance.style.headerRect.x + 'px';
        instance.clip();
        instance.createRowCache();
        instance.redrawHeaders();
        instance.createAddRows(instance.headers);
        return instance;
    }
    /**
    * Used interally to Create a new record.
    * @function
    * @name Grid.newRecord
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    * @param {Native.Object} newRecordOverrides The values used in the new record that override the defalult values from the database.
    */
    instance.newRecord = function (newRecordOverrides) {
        return Rendition.UI.createDefaultRow(instance.headers, newRecordOverrides);
    }
    /**
    * Used interally add a new row, first appending the default data.
    * @function
    * @name Grid.createAddRows
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    * @param {Native.Object} headers The headers to create the new data structure with.
    */
    instance.createAddRows = function (headers) {
        if (args.editMode > 1) {
            /* create the new row with it's default data */
            var data = Rendition.UI.createDefaultRow(headers, args.newRecord);
            instance.createRow(instance.records + 1, data, 'new');
        }
        return instance;
    }
    /**
    * Used interally create a new blank row.
    * @function
    * @name Grid.blankRow
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Array} a blank array of data.
    * @param {Native.String} str The string to fill the row with.
    */
    instance.blankRow = function (str) {
        var blank = [];
        for (var x = 0; instance.columns > x; x++) { blank.push(str) }
        return blank;
    }
    /**
    * Used interally create a row cache.
    * @function
    * @name Grid.createRowCache
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    */
    instance.createRowCache = function () {
        var z = 1;
        if (args.editMode > 1) {
            z++;
        }
        for (var x = 0; instance.records + z > x; x++) {
            instance.local.push({
                state: 0,
                DOM: null,
                data: null
            });
        }
    }
    /**
    * Redraws the headers firing all related events and recreating or updating DHTML elements.
    * @function
    * @name Grid.redrawHeaders
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    */
    instance.redrawHeaders = function () {
        var repoHead = instance.reposition || { header: null }
        var totalLeft = Rendition.UI.iif(instance.rowCountColumn, instance.style.rowHeaderRect.w + instance.style.headerCellPadding.r + instance.style.headerCellPadding.l, 0);
        for (var x = 0; instance.columns > x; x++) {
            var column = instance.getHeader(x);
            column.object.style.borderLeft = instance.style.headerBorder;
            column.object.style.borderRight = instance.style.headerBorder;
            column.object.style.borderBottom = instance.style.headerBorder;
            var width = column.width;
            if (column != repoHead.header) {
                column.object.style.width = width + 'px';
                column.object.style.left = totalLeft + 'px';
                column.offsetLeft = totalLeft;
            }
            if (parseInt(instance.orderBy) == column.index) {
                /* add little order by arrow */
                if (instance.orderByDirection == '0') {
                    instance.orderByArrow.className = 'r_gridOrderByArrowAsc';
                } else {
                    instance.orderByArrow.className = 'r_gridOrderByArrowDesc';
                }
                instance.orderByArrow.style.left = instance.style.orderArrowRect.x + (width * .5) + (instance.style.orderArrowRect.w * .5) + 'px';
                column.object.appendChild(instance.orderByArrow);
            }
            if (column.visibility == 1) {
                totalLeft += width + instance.style.headerCellPadding.r + instance.style.headerCellPadding.l;
                column.object.style.visibility = "visible";
            } else {
                column.object.style.visibility = "hidden";
            }
        }
        instance.headerWidth = totalLeft;
        instance.header.style.width = totalLeft + 'px';
        /* make the grid height fit the # of records in the recordset */
        var addH = 0;
        if (args.editMode > 1) { addH++; }
        instance.grid.style.height = (instance.style.rowRect.h * (instance.records + instance.emptyAreaBelowGridOffset + addH)) + 'px';
        /* make the header and the grid wide engouh to fit all the rows */
        instance.header.style.width = (totalLeft + instance.style.headerRect.w - instance.style.scrollBarWidth) + 'px';
        instance.grid.style.width = totalLeft + 'px';
        return instance;
    }
    /**
    * Adds a column to the selection.
    * @function
    * @name Grid.addColumnToSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Integer} columnIndex The column index of the column to add to the selection.
    * @param {Native.Boolean} shift Behave as if the shift key were depressed (Select range).
    * @param {Native.Boolean} shift Behave as if the control key were depressed (append or un-append single).
    */
    instance.addColumnToSelection = function (columnIndex, shift, ctrl) {
        if (instance.selectedColumnIndex != null) {
            var startIndex = instance.selectedColumnIndex;
        }
        if (columnIndex == -1 || startIndex == -1) { return null; }
        instance.selectedColumnIndex = columnIndex;
        if (shift && columnIndex >= startIndex) {
            /*low to high*/
            instance.removePreviousColumnSelection();
            for (var x = startIndex; columnIndex + 1 > x; x++) {
                instance.selectedColumns.push(x);
            }
        } else if (shift && columnIndex < startIndex) {
            /*high to low*/
            instance.removePreviousColumnSelection();
            for (var x = startIndex; x > columnIndex - 1; x--) {
                instance.selectedColumns.push(x);
            }
        } else {
            /*toggle*/
            if (ctrl) {
                if (instance.isColumnInSelection(columnIndex)) {
                    instance.removeColumnFromSelection(columnIndex);
                } else {
                    instance.selectedColumns.push(columnIndex);
                }
            } else {
                instance.removePreviousColumnSelection();
                instance.selectedColumns = [columnIndex];
            }
        }
        return instance;
    }
    /**
    * Adds a cell to the selection.
    * @function
    * @name Grid.addCellToSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Integer} columnIndex The column index of the cell to add to the selection.
    * @param {Native.Integer} rowIndex The row index of the cell to add to the selection.
    * @param {Native.Boolean} shift Behave as if the shift key were depressed (Select range).
    * @param {Native.Boolean} shift Behave as if the control key were depressed (append or un-append single).
    */
    instance.addCellToSelection = function (columnIndex, rowIndex, shift, ctrl) {
        if (instance.selectedRowIndex != null) {
            var startRowIndex = instance.selectedRowIndex;
        }
        if (instance.selectedColumnIndex != null) {
            var startColumIndex = instance.selectedColumnIndex;
        }
        instance.selectedRowIndex = rowIndex;
        instance.selectedColumnIndex = columnIndex;
        if (shift && rowIndex >= startRowIndex) {
            /*low to high*/
            instance.removePreviousCellSelection();
            for (var x = startRowIndex; rowIndex + 1 > x; x++) {
                if (columnIndex >= startColumIndex) {
                    /*low to high */
                    for (var y = startColumIndex; columnIndex + 1 > y; y++) {
                        instance.selectedCells.push(x + '.' + y);
                    }
                } else {
                    /*high to low*/
                    for (var y = startColumIndex; y > columnIndex - 1; y--) {
                        instance.selectedCells.push(x + '.' + y);
                    }
                }
            }
        } else if (shift && rowIndex < startRowIndex) {
            /*high to low*/
            instance.removePreviousCellSelection();
            for (var x = startRowIndex; x > rowIndex - 1; x--) {
                if (columnIndex >= startColumIndex) {
                    /*low to high */
                    for (var y = startColumIndex; columnIndex + 1 > y; y++) {
                        instance.selectedCells.push(x + '.' + y);
                    }
                } else {
                    /*high to low*/
                    for (var y = startColumIndex; y > columnIndex - 1; y--) {
                        instance.selectedCells.push(x + '.' + y);
                    }
                }
            }
        } else {
            /*toggle*/
            if (ctrl) {
                if (instance.isCellInSelection(rowIndex + '.' + columnIndex)) {
                    instance.removeCellFromSelection(rowIndex + '.' + columnIndex);
                } else {
                    instance.selectedCells.push(rowIndex + '.' + columnIndex);
                }
            } else {
                instance.removePreviousCellSelection();
                instance.selectedCells = [rowIndex + '.' + columnIndex];
            }
        }
        return instance;
    }
    /**
    * Click on a row.  This will fire any events associated with clicking on a row and select the row as if someone had clicked on it.
    * @function
    * @name Grid.clickRow
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Integer} rowIndex The row index of the row to click.
    */
    instance.clickRow = function (rowIndex) {
        if (instance.local[rowIndex].state > 1) {
            instance.local[rowIndex].DOM.cells[0].onclick({ shiftKey: false, metaKey: false, ctrlKey: false });
        }
    }
    /**
    * Adds row to the selection.
    * @function
    * @name Grid.addRowToSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Integer} rowIndex The row index of the row to add to the selection.
    * @param {Native.Boolean} shift Behave as if the shift key were depressed (Select range).
    * @param {Native.Boolean} shift Behave as if the control key were depressed (append or un-append single).
    */
    instance.addRowToSelection = function (rowIndex, shift, ctrl) {
        if (instance.selectedRowIndex != null) {
            var startIndex = instance.selectedRowIndex;
        }
        instance.selectedRowIndex = rowIndex;
        if (shift && rowIndex >= startIndex) {
            /*low to high*/
            instance.removePreviousRowSelection();
            for (var x = startIndex; rowIndex + 1 > x; x++) {
                instance.selectedRows.push(x);
            }
        } else if (shift && rowIndex < startIndex) {
            /*high to low*/
            instance.removePreviousRowSelection();
            for (var x = startIndex; x > rowIndex - 1; x--) {
                instance.selectedRows.push(x);
            }
        } else {
            /*toggle*/
            if (ctrl) {
                if (instance.isRowInSelection(rowIndex)) {
                    instance.removeRowFromSelection(rowIndex);
                } else {
                    instance.selectedRows.push(rowIndex);
                }
            } else {
                instance.removePreviousRowSelection();
                instance.selectedRows = [parseInt(rowIndex)];
            }
        }
        return instance;
    }
    /**
    * Removes a cell from the selection.
    * @function
    * @name Grid.removeCellFromSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Integer} cellIndex The index of the cell to remove as defined in the selectedCells array.
    */
    instance.removeCellFromSelection = function (cellIndex) {
        instance.selectedCells.splice(instance.selectedCells.indexOf(cellIndex), 1);
        instance.colorCell(cellIndex, instance.style.cellFontColor, instance.style.cellBackground);
        return instance;
    }
    /**
    * Removes a column from the selection.
    * @function
    * @name Grid.removeColumnFromSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Integer} columnIndex The index of the column to remove as defined in the selectedColumns array.
    */
    instance.removeColumnFromSelection = function (columnIndex) {
        instance.selectedColumns.splice(instance.selectedColumns.indexOf(columnIndex), 1);
        instance.colorColumn(columnIndex, instance.style.headerCellFontColor,
		instance.style.headerCellBackground, instance.style.cellFontColor, instance.style.cellBackground);
        return instance;
    }
    /**
    * Removes a row from the selection.
    * @function
    * @name Grid.removeRowFromSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Integer} rowIndex The index of the row to remove as defined in the selectedRows array.
    */
    instance.removeRowFromSelection = function (rowIndex) {
        instance.selectedRows.splice(instance.selectedRows.indexOf(rowIndex), 1);
        instance.colorRow(rowIndex, instance.style.rowHeaderFontColor,
		instance.style.rowHeaderBackground, instance.style.cellFontColor, instance.style.cellBackground);
        return instance;
    }
    /**
    * Checks if a column is in the selection.
    * @function
    * @name Grid.isColumnInSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Boolean} true if the column is in the selection.
    * @param {Native.Integer} columnIndex The index of the column to check.
    */
    instance.isColumnInSelection = function (columnIndex) {
        return instance.selectedColumns.indexOf(columnIndex) != -1;
    }
    /**
    * Checks if a row is in the selection.
    * @function
    * @name Grid.isRowInSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Boolean} true if the row is in the selection.
    * @param {Native.Integer} rowIndex The index of the row to check.
    */
    instance.isRowInSelection = function (rowIndex) {
        return instance.selectedRows.indexOf(rowIndex) != -1;
    }
    /**
    * Checks if a cell is in the selection.
    * @function
    * @name Grid.isCellInSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Boolean} true if the cell is in the selection.
    * @param {Native.Integer} cellIndex The index of the cell to check.
    */
    instance.isCellInSelection = function (cellIndex) {
        return instance.selectedCells.indexOf(cellIndex) != -1;
    }
    /**
    * Removes any previous cell selections.
    * @function
    * @name Grid.removePreviousCellSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} null.
    */
    instance.removePreviousCellSelection = function () {
        while (instance.selectedCells.length > 0) {
            instance.removeCellFromSelection(instance.selectedCells[0]);
        }
        return null;
    }
    /**
    * Removes any previous column selections.
    * @function
    * @name Grid.removePreviousColumnSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} null.
    */
    instance.removePreviousColumnSelection = function () {
        while (instance.selectedColumns.length > 0) {
            instance.removeColumnFromSelection(instance.selectedColumns[0]);
        }
        return null;
    }
    /**
    * Removes any previous column selections.
    * @function
    * @name Grid.removePreviousRowSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} null.
    */
    instance.removePreviousRowSelection = function () {
        while (instance.selectedRows.length > 0) {
            instance.removeRowFromSelection(instance.selectedRows[0]);
        }
        return null;
    }
    /**
    * Used interally to create a table.
    * @function
    * @name Grid.buildSelectedTable
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.DHTMLElement} table.
    */
    instance.buildSelectedTable = function () {
        var table = document.createElement('table');
        return table;
    }
    /**
    * Returns true if there is a selection.
    * @function
    * @name Grid.selectionExists
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Boolean} true when a selection exists, false if there is no selection.
    */
    instance.selectionExists = function () {
        if (args.selectionMethod == 0 || args.selectionMethod == 3) {
            if (!instance.selectedRows.length > 0) { return false }
        } else if (args.selectionMethod == 1 || args.selectionMethod == 4) {
            if (!instance.selectedCells.length > 0) { return false }
        } else if (args.selectionMethod == 2 || args.selectionMethod == 5) {
            if (!instance.selectedColumns.length > 0) { return false }
        }
        return true;
    }
    /**
    * Used interally to apply the selection style.
    * @function
    * @name Grid.applySelectionStyle
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Integer} [rowIndex] If defined limit the application of style to this row.
    */
    instance.applySelectionStyle = function (rowIndex) {
        if ((!instance.selectionExists()) && instance.searchHighlight == null) { return null }
        /*
        if a row is specified then color just that row
        if no row is specified then color any row where instance.local[x].status>1
        */
        if (rowIndex !== undefined) {
            var x = rowIndex;
            var hLength = rowIndex + 1;
        } else {
            var x = 0;
            var hLength = instance.records + 1;
        }
        for (x; hLength > x; x++) {
            if (!instance.eventlisteners_selectionstyle(x, instance.local[x])) { continue }
            if (instance.local[x] === undefined) { return null }
            if (instance.local[x].state > 1) {
                if (instance.searchHighlight != null) {
                    if (instance.searchMatchRows[instance.searchHighlight] == x) {
                        instance.colorRow(x, instance.style.rowHeaderSearchBackground,
					    instance.style.rowHeaderSearchRowFontColor, instance.style.searchFontColor, instance.style.searchBackground);
                    }
                }
                if (args.selectionMethod == 0 || args.selectionMethod == 3) {
                    if (instance.selectedRowIndex != null) {
                        if (instance.isRowInSelection(x)) {
                            instance.colorRow(x, instance.style.rowHeaderSelectFontColor,
							instance.style.rowHeaderSelectBackground, instance.style.cellSelectFontColor, instance.style.cellSelectBackground);
                        }
                    }
                } else if (args.selectionMethod == 1 || args.selectionMethod == 4) {
                    if (instance.selectedRowIndex != null && instance.selectedColumnIndex != null) {
                        for (var y = 0; instance.columns > y; y++) {
                            if (instance.isCellInSelection(x + '.' + y)) {
                                instance.colorCell(x + '.' + y, instance.style.cellSelectFontColor, instance.style.cellSelectBackground);
                            }
                        }
                    }
                } else if (args.selectionMethod == 2 || args.selectionMethod == 5) {
                    if (instance.selectedColumnIndex != null) {
                        var iLength = instance.selectedColumns.length;
                        for (var y = 0; iLength > y; y++) {
                            instance.colorColumn(instance.selectedColumns[y], instance.style.headerCellSelectFontColor,
							instance.style.headerCellSelectBackground, instance.style.cellSelectFontColor, instance.style.cellSelectBackground, x);
                        }
                    }
                }
            }
        }
        return instance;
    }
    /**
    * Remove the selection.
    * @function
    * @name Grid.removeSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    */
    instance.removeSelection = function () {
        if (args.selectionMethod == 0 || args.selectionMethod === undefined || args.selectionMethod == 3) {
            instance.removePreviousRowSelection();
        } else if (args.selectionMethod == 1 || args.selectionMethod == 4) {
            instance.removePreviousCellSelection();
        } else if (args.selectionMethod == 2 || args.selectionMethod == 5) {
            instance.removePreviousColumnSelection();
        }
        return instance;
    }
    /* MAIN CLICK FUNCTION FOR CELLS, ROWS AND COLUMNS */
    instance.selectRowCellColumnClick = function (obj, e) {
        var ctrl = false;
        var shift = false;
        if (obj) {
            var rowIndex = parseInt(obj.getAttribute('row'));
        }
        e = e || window.event;
        if (e.ctrlKey || e.metaKey) { ctrl = true; }
        if (e.shiftKey) { var shift = true; }
        if (!instance.eventlisteners_beforeSelectionChange(e, obj)) { return null; }
        if (args.selectionMethod == 0 || args.selectionMethod === undefined) {
            instance.addRowToSelection(parseInt(obj.getAttribute('row')), false, false);
        } else if (args.selectionMethod == 1) {
            instance.addCellToSelection(parseInt(obj.getAttribute('column')), parseInt(obj.getAttribute('row')), false, false);
        } else if (args.selectionMethod == 2) {
            instance.addColumnToSelection(parseInt(obj.getAttribute('column')), false, false);
        } else if (args.selectionMethod == 3) {
            instance.addRowToSelection(parseInt(obj.getAttribute('row')), shift, ctrl);
        } else if (args.selectionMethod == 4) {
            instance.addCellToSelection(parseInt(obj.getAttribute('column')), parseInt(obj.getAttribute('row')), shift, ctrl);
        } else if (args.selectionMethod == 5) {
            instance.addColumnToSelection(parseInt(obj.getAttribute('column')), shift, ctrl);
        }
        instance.applySelectionStyle();
        /* create a more accessable version of the selection for the event handler */
        instance.applySelection();
        instance.eventlisteners_selectionChange(e, obj);
        if (rowIndex == instance.newRowIndex) {
            if (instance.edit.state == null) {
                instance.startEdit(e, obj);
            }
            return null;
        }
        instance.eventlisteners_detailPane(e, obj);
        return null;
    }
    /**
    * If the selection arrays have changed, use this function to update the appearance of the grid.
    * @function
    * @name Grid.applySelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    */
    instance.applySelection = function () {
        if (instance.selectionExists()) {
            instance.selection = [];
            if (args.selectionMethod == 0 || args.selectionMethod == 3) {
                var hLength = instance.selectedRows.length;
                for (var x = 0; hLength > x; x++) {
                    if (instance.selectedRows[x] != instance.newRowIndex) {
                        var sel = {
                            state: instance.selectionState,
                            DOM: instance.selectionDOM,
                            data: instance.selectionData,
                            rowIndex: instance.selectedRows[x]
                        }
                        instance.selection.push(sel);
                    }
                }
            } else if (args.selectionMethod == 1 || args.selectionMethod == 4) {
                var hLength = instance.selectedCells.length;
                for (var x = 0; hLength > x; x++) {
                    for (var y = 0; instance.columns > y; y++) {
                        if (instance.isCellInSelection(x + '.' + y)) {
                            if (x != instance.newRowIndex) {
                                var sel = {
                                    state: instance.selectionState,
                                    DOM: instance.selectionDOM,
                                    data: instance.selectionData,
                                    rowIndex: instance.selectedCells[x],
                                    columnIndex: y
                                }
                                instance.selection.push(sel);
                            }
                        }
                    }
                }
            } else if (args.selectionMethod == 2 || args.selectionMethod == 5) {
                var hLength = instance.selectedColumns.length;
                for (var x = 1; instance.records > x; x++) {
                    for (var y = 0; hLength > y; y++) {
                        if (instance.isColumnInSelection(instance.selectedColumns[y])) {
                            var sel = {
                                state: instance.selectionState,
                                DOM: instance.selectionDOM,
                                data: instance.selectionData,
                                rowIndex: x,
                                columnIndex: instance.selectedColumns[y]
                            }
                            instance.selection.push(sel);
                        }
                    }
                }
            }
        }
    }
    /**
    * Returns the load state of a row.
    * @function
    * @name Grid.selectionState
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} state will show in what condition this element is loaded. 0 = no DOM, 1 = DOM no data, 2 = DOM and data.
    */
    instance.selectionState = function () {
        return instance.local[this.rowIndex].state;
    }
    /**
    * Returns the select row data as DHTML elements.
    * @function
    * @name Grid.selectionDOM
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @param {Native.Boolean} singleRowOnly When true selectionDOM will only refrence the first selected row.
    * @returns {Native.Array} Array of DHTML elements that are in the selection.
    */
    instance.selectionDOM = function (singleRowOnly) {
        if (this.state() > 1) {
            if (args.selectionMethod == 0 || args.selectionMethod == 3) {
                return instance.local[this.rowIndex].DOM;
            } else if (args.selectionMethod == 2 || args.selectionMethod == 5 || args.selectionMethod == 1 || args.selectionMethod == 4) {
                return instance.local[this.rowIndex].DOM.cells[this.columnIndex];
            }
        } else {
            if (args.selectionMethod == 0 || args.selectionMethod == 3) {
                return instance.syncDownloadSelectedRecords(singleRowOnly, this.rowIndex).local[this.rowIndex].DOM;
            } else if (args.selectionMethod == 2 || args.selectionMethod == 5 || args.selectionMethod == 1 || args.selectionMethod == 4) {
                return instance.syncDownloadSelectedRecords(singleRowOnly, this.rowIndex).local[this.rowIndex].DOM;
            }

        }
    }
    /**
    * Returns the row data from the selected elements as a two dimentional array of data. If the row data is not loaded a synchronous request is made to load the data before the return.
    * @function
    * @name Grid.selectionData
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @param {Native.Boolean} singleRowOnly When true selectionDOM will only refrence the first selected row.
    * @returns {Native.Array} Two dimentional array of data.
    */
    instance.selectionData = function (singleRowOnly) {
        if (this.state() > 1) {
            return instance.local[this.rowIndex].data;
        } else {
            return instance.syncDownloadSelectedRecords(singleRowOnly, this.rowIndex).local[this.rowIndex].data;
        }
    }
    /**
    * Finds a record based on the tables primary key.
    * @function
    * @name Grid.getRecordById
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @param {Native.Integer} primaryKey The primary key of the record desiered.
    * @returns {Native.Array|Object} Array of the row data of the row with the matching primary key value.
    */
    instance.getRecordById = function (primaryKey) {
        var hdr = instance.getPKHeader();
        var fltr = [{
            column: hdr.name,
            operator: '=',
            value: primaryKey,
            value2: '',
            type: hdr.dataType,
            group: '0',
            linkOperator: 'or'
        }];
        var ret = undefined;
        instance.reqSearch = Rendition.UI.Ajax(instance.selectURL(1, 1, instance.buildSearchSuffixString(fltr)), function (e) {
            var a = JSON.parse(e.responseText);
            if (a.method1.DataSet.data.length != 0) {
                var rowNum = a.method1.DataSet.data.match0;
                ret = instance.getRecord(rowNum);
                return;
            }
        }, instance, false);
        return ret;
    }
    /**
    * Synchronously fetches a row or a cell from the rowset data.  GetRecord will first try and fetch the value using the local record cache, if the data is missing a synchronous request will be made.
    * @function
    * @name Grid.getRecord
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @param {Native.Integer} rowIndex The number of the row desired.
    * @param {Integer|String} [columnIndex] Can be a String matching one of the column names or a Integer representing a column index.
    * @returns {Native.Array|Object} Array of the row data or the selected cell value if the paramater columnIndex was supplied.
    */
    instance.getRecord = function (rowIndex, columnIndex) {
        var m = function (columnIndex) {
            if (typeof columnIndex == 'string') {
                columnName = String(columnIndex);
                columnIndex = instance.getHeaderByName(columnIndex);
                if (columnIndex === undefined) {
                    instance.log('unknown columnIndex: ' + columnIndex);
                    return columnIndex;
                } else {
                    columnIndex = columnIndex.index;
                }
            }
            /* no data in this recordset but the user tried to read the recordset */
            if (instance.local[rowIndex].data == null) {
                return null;
            }
            var l = instance.local[rowIndex].data.length;
            if (!(l >= columnIndex)) {
                if (columnName) {
                    instance.log('Can\'t find column named ' + columnName + '.\n');
                } else {
                    instance.log('column ' + columnIndex + ' is outside of the column range of ' + l + '.\n');
                }
            }
            return columnIndex;
        }
        if (instance.local[rowIndex] === undefined) { return null }
        if (instance.local[rowIndex].state > 1) {
            if (columnIndex !== undefined) {
                return instance.local[rowIndex].data[m(columnIndex)];
            } else {
                return instance.local[rowIndex].data;
            }
        } else {
            if (columnIndex !== undefined) {
                /* get the actual column index */
                var cId = m(columnIndex);
                if (cId == null) {
                    /* an attempt to read data when no data is present was made */
                    return null;
                } else {
                    return instance.syncDownloadSelectedRecords(true, rowIndex).local[rowIndex].data[cId];
                }
            } else {
                return instance.syncDownloadSelectedRecords(true, rowIndex).local[rowIndex].data;
            }
        }
    }
    /**
    * Gets the highest and lowest number in the selection.
    * @function
    * @name Grid.getSelectionBounds
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} An object that looks like : {low:Integer,high:Integer}.
    */
    instance.getSelectionBounds = function () {
        var l = Infinity;
        var h = -Infinity;
        if (args.selectionMethod == 0 || args.selectionMethod == 3) {
            var hLength = instance.selectedRows.length;
            for (var x = 0; hLength > x; x++) {
                if (l > instance.selectedRows[x]) {
                    l = instance.selectedRows[x];
                }
                if (h < instance.selectedRows[x]) {
                    h = instance.selectedRows[x];
                }
            }
        } else if (args.selectionMethod == 1 || args.selectionMethod == 4) {
            var hLength = instance.selectedCell.length;
            for (var x = 0; hLength > x; x++) {
                var row = instance.selectedCell[x].split('.')[0];
                if (l > row) {
                    l = row;
                }
                if (h < row) {
                    h = row;
                }
            }
        } else if (args.selectionMethod == 2 || args.selectionMethod == 5) {
            /* column selections always need to download all records */
            for (var l = 1; instance.records > l; l++) {
                if (instance.local[l].state == 0) {
                    break;
                }
            }
            h = instance.records;
        }
        return { low: l, high: h }
    }
    /**
    * Synchronously download a range of records.
    * @function
    * @name Grid.syncDownloadRange
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @param {Native.Integer} from The record to start fetching from.
    * @param {Native.Integer} to The record to fetch to.
    */
    instance.syncDownloadRange = function (from, to) {
        instance.downloadRecords(from, to, function (e) {
            instance.JSONToLocalCache(e).draw(instance.getVisibleRange());
            instance.reqEval = null;
        }, false); /*not async*/
        return instance;
    }
    /**
    * Synchronously download the selected records.
    * @function
    * @name Grid.syncDownloadSelectedRecords
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @param {Native.Boolean} singleRowOnly When true selectionDOM will only refrence the first selected row.
    * @param {Native.Integer} [rowIndex] Only download this row index.
    */
    instance.syncDownloadSelectedRecords = function (singleRowOnly, rowIndex) {
        var reqBounds = instance.getSelectionBounds();
        if (singleRowOnly == true && rowIndex !== undefined) {
            reqBounds.low = reqBounds.high = rowIndex;
        }
        instance.downloadRecords(reqBounds.low, reqBounds.high, function (e) {
            instance.JSONToLocalCache(e).draw(instance.getVisibleRange());
            instance.reqEval = null;
            instance.redraw();
        }, false); /*not async*/
        return instance;
    }
    /**
    * Used interally to figure out cell padding.
    * @function
    * @name Grid.paddingRectToString
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Object} paddingRect Rect object that the padding follows.
    */
    instance.paddingRectToString = function (paddingRect) {
        return paddingRect.t + 'px ' + paddingRect.r + 'px ' + paddingRect.b + 'px ' + paddingRect.l + 'px ';
    }
    /**
    * Gets a column as an array of DHTML elements.
    * @function
    * @name Grid.getColumnDOM
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @param {Native.Integer} columnIndex The column index to fetch.
    * @returns {Native.Array} Array of DHTML elements.
    */
    instance.getColumnDOM = function (columnIndex) {
        var columnDOM = [];
        for (x; instance.records + 1 > x; x++) {
            if (instance.local[x].state > 1) {
                columnDOM.push(instance.local[x].DOM.cells[columnIndex]);
            }
        }
        return columnDOM;
    }
    /**
    * Used interally to color the cells.
    * @function
    * @name Grid.colorColumn
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Integer} columnIndex The column index.
    * @param {Native.String} headerColor The color of the header text.
    * @param {Native.String} headerBackground The color of the header background.
    * @param {Native.String} columnColor The color of the cell text.
    * @param {Native.String} columnBackground The color of the cell background.
    * @param {Native.String} [rowIndex] The row index.  If supplied only this row will be altered.
    * @returns {Native.Object} null.
    */
    instance.colorColumn = function (columnIndex, headerColor, headerBackground, columnColor, columnBackground, rowIndex) {
        /* draw all columns if rowIndex is left undefined */
        if (rowIndex !== undefined) {
            var x = rowIndex;
            var hLength = rowIndex + 1;
        } else {
            var x = 0;
            var hLength = instance.records + 1;
        }
        var i = columnIndex;
        instance.colorHeader(i, headerColor, headerBackground);
        for (x; hLength > x; x++) {
            if (instance.local[x].state > 1) {
                /* ignore the row header column */
                instance.local[x].DOM.cells[i + 1].style.background = columnBackground;
                instance.local[x].DOM.cells[i + 1].style.color = columnColor;
            }
        }
        return null;
    }
    /**
    * Used internally to reset the color of the headers to the style default.
    * @function
    * @name Grid.resetHeaderColor
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    */
    instance.resetHeaderColor = function () {
        for (var x = 0; instance.columns > x; x++) {
            instance.headers[x].style.color = instance.style.headerCellFontColor;
            instance.headers[x].style.background = instance.style.headerCellBackground;
        }
        return null;
    }
    /**
    * Used internally to color the headers.
    * @function
    * @name Grid.colorHeader
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Integer} headerIndex The header index to alter.
    * @param {Native.String} headerColor The header text color.
    * @param {Native.String} headerBackground The header background color.
    */
    instance.colorHeader = function (headerIndex, headerColor, headerBackground) {
        var header = instance.getHeader(headerIndex);
        header.object.style.color = headerColor;
        header.object.style.background = headerBackground;
        return null;
    }
    /**
    * Used internally to color a row.  'Header' in this case is talking about the row headers, the row counter column.
    * @function
    * @name Grid.colorRow
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Integer} rowIndex The index of the row to alter.
    * @param {Native.Integer} headerIndex The header index to alter.
    * @param {Native.String} headerColor The header text color.
    * @param {Native.String} headerBackground The header background color.
    * @param {Native.String} rowColor The text color.
    * @param {Native.String} rowBackground The background color.
    */
    instance.colorRow = function (rowIndex, headerColor, headerBackground, rowColor, rowBackground) {
        if (!instance.local[rowIndex]) { return }
        if (instance.local[rowIndex].state > 1) {
            var l = args.data ? (instance.columns + 1) : instance.columns;
            for (var x = 0; l > x; x++) {
                if (!instance.eventlisteners_cellstyle(cell, instance.local[rowIndex].data, instance.headers[x])) {
                    continue;
                }
                var cell = instance.local[rowIndex].DOM.cells[x];
                if (x == 0) {
                    cell.style.background = headerBackground;
                    cell.style.color = headerColor;
                } else {
                    cell.style.background = rowBackground;
                    cell.style.color = rowColor;
                }
            }
        }
        return;
    }
    /**
    * Used internally to color a cell.
    * @function
    * @name Grid.colorCell
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Integer} cellIndex The index of the cell to alter.
    * @param {Native.String} cellColor The text color.
    * @param {Native.String} cellBackground The background color.
    */
    instance.colorCell = function (cellIndex, cellColor, cellBackground) {
        var cellSplit = cellIndex.split('.');
        var i = parseInt(cellSplit[1]);
        if (instance.local[cellSplit[0]].state > 1) {
            instance.local[cellSplit[0]].DOM.cells[i + 1].style.background = cellBackground;
            instance.local[cellSplit[0]].DOM.cells[i + 1].style.color = cellColor;
        }
        return null;
    }
    /**
    * Used internally to create a context menu for rows.
    * @function
    * @name Grid.rowCellColumnContextMenu
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element clicked on.
    */
    instance.rowCellColumnContextMenu = function (e, obj) {
        /* if editing, allow user to access the browser's context menu */
        if (instance.edit.rowIndex != null) { return true }
        /* default context menu */
        var options = Rendition.UI.stringOrFunction(args.contextMenuOptions, instance, [e, obj]) || [];
        var optionLength = options.length - 1;
        if (instance.schema.objectId != 0) {
            if (instance.selectionExists()) {
                /*options dealing with the fact somthing is selected */
                if (args.editMode > 2) {
                    optionLength++;
                    options[optionLength] = Rendition.UI.MenuOption();
                    options[optionLength].text = Rendition.Localization['Grid_Delete_Selected_Rows'].Title;
                    Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
                        var close = document.createElement('button');
                        close.innerHTML = Rendition.Localization['Grid_delete_No'].Title;
                        var refreshClose = document.createElement('button');
                        refreshClose.innerHTML = Rendition.Localization['Grid_delete_Yes'].Title;
                        close.onclick = function (e, confirm) {
                            instance.deleteConfirmDialog.close();
                        }
                        refreshClose.onclick = function (e, confirm) {
                            instance.deleteSelectedRows();
                            instance.deleteConfirmDialog.close();
                        }
                        instance.deleteConfirmDialog = Rendition.UI.ConfirmDialog({
                            message: Rendition.Localization['Grid_Are_you_sure_you_want_to_delete'].Title,
                            subTitle: Rendition.Localization['Grid_Confirm_delete_row'].Title,
                            title: Rendition.Localization['Grid_Confirm_Delete'].Title,
                            buttons: [refreshClose, close],
                            dialogRect: { x: (document.documentElement.clientWidth / 2) - Rendition.UI.saveChangesDialogWidth / 2, y: 105, h: 134, w: Rendition.UI.saveChangesDialogWidth }
                        });
                    }, false);
                }
            }
            if (args.noRefresh === undefined) {
                optionLength++;
                options[optionLength] = Rendition.UI.MenuOption();
                options[optionLength].text = Rendition.Localization['Grid_delete_Refresh'].Title;
                Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
                    instance.refresh();
                }, false);
            }
        }
        if (options.length > 0) {
            /* if options were generated then display the grid's context menu
            if no options were found then allow the browsers default context menu to appear */
            var menu = Rendition.UI.ContextMenu(e, {
                elements: options,
                caller: obj,
                type: 'mouse'
            });
            Rendition.UI.closeContextMenus(menu);
            e.preventDefault();
        }
        return false;
    }
    /**
    * Used internally to fire header mouse move events.
    * @function
    * @name Grid.headerMouseMove
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element clicked on.
    */
    instance.headerMouseMove = function (e, obj) {
        /* get header object reference */
        if (instance.headers === undefined) { return null }
        var headerIndex = obj.getAttribute('column');
        var header = instance.headers[headerIndex];
        /* object position */
        var objPos = Rendition.UI.getPosition(obj);
        /* mouse offset */
        var mouse = Rendition.UI.mouseCoords(e);
        /* where is the mouse on the object */
        var pos = { x: mouse.x - objPos.x - instance.viewPortPos.x, y: mouse.y - objPos.y - instance.viewPortPos.y }
        if (obj.offsetWidth - pos.x < 25) {
            obj.style.cursor = 'e-resize';
            obj.setAttribute('resize', 1);
        } else {
            obj.style.cursor = 'auto';
            obj.setAttribute('resize', 0);
        }
        return null;
    }
    /**
    * Used internally to resize the header.
    * @function
    * @name Grid.headerResize
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Object} e The event object.
    */
    instance.headerResize = function (e) {
        instance.headerResizeCurrentPos = Rendition.UI.mouseCoords(e);
        var offsetX = instance.headerResizeCurrentPos.x - instance.headerResizeStartPos.x;
        var target = instance.headerResizeStartWidth + offsetX;
        instance.resizeHeader.width = target;
        instance.redrawHeaders();
        return null;
    }
    /**
    * Used internally to write resized data to column headers.
    * @function
    * @name Grid.resizeColumn
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Integer} columnIndex
    * @param {Native.Integer} columnIndex Index of the column to resize.
    * @param {Native.Integer} width Width of the column to resize.
    */
    instance.resizeColumn = function (columnIndex, width) {
        var header = instance.headers[columnIndex];
        var i = header.order;
        var rAdd = 1;
        if (instance.newRowIndex != -1) {
            rAdd++;
        }
        if (instance.aggregateRow != -1) {
            rAdd++;
        }
        for (var x = 0; (instance.records + rAdd) > x; x++) {
            if (instance.local[x].state > 1) {
                instance.local[x].DOM.cells[i + 1].style.width = width + 'px';
                if (header.dataType == 'datetime') {
                    instance.local[x].DOM.cells[i + 1].textContent = instance.truncateText(
                        Rendition.UI.formatDate(
                            instance.local[x].data[columnIndex],
                            (args.dateFormat || 'mm/dd/yy hh:nn:ss')
                        ), header.width
                    );
                } else {
                    instance.local[x].DOM.cells[i + 1].textContent = instance.truncateText(instance.local[x].data[columnIndex], width);
                }
                instance.eventlisteners_cellstyle(instance.local[x].DOM.cells[i + 1], instance.local[x].data, instance.getHeader(columnIndex));
            }
        }
        instance.grid.firstChild.style.width = instance.headerWidth + 'px';
        return columnIndex;
    }
    /**
    * Used internally to get the width of all the headers combined.
    * @function
    * @name Grid.getHeaderWidth
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Integer} total width.
    */
    instance.getHeaderWidth = function () {
        var width = 0;
        for (var x = 0; instance.columns > x; x++) {
            width += instance.headers[x].width;
        }
        return width;
    }
    /**
    * Used internally to start the header resize function.
    * @function
    * @name Grid.headerStartResize
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element clicked on.
    */
    instance.headerStartResize = function (e, obj) {
        document.body.style.cursor = 'e-resize';
        instance.headerResizeStartPos = Rendition.UI.mouseCoords(e);
        instance.resizeHeader = instance.headers[obj.getAttribute('column')];
        instance.headerResizeStartWidth = instance.resizeHeader.width;
        Rendition.UI.appendEvent('mousemove', document.body, instance.headerResize, false);
        Rendition.UI.appendEvent('mouseup', document.body, instance.headerEndResize, false);
        return null;
    }
    /**
    * Used internally to end the header resize function.
    * @function
    * @name Grid.headerEndResize
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Object} e The event object.
    */
    instance.headerEndResize = function (e) {
        instance.resizeColumn(instance.resizeHeader.index, instance.resizeHeader.width);
        document.body.style.cursor = 'auto';
        Rendition.UI.removeEvent('mousemove', document.body, instance.headerResize, false);
        Rendition.UI.removeEvent('mouseup', document.body, instance.headerEndResize, false);
        instance.updateSchemaData(false);
        return null;
    }
    /**
    * Removes all the children from an object.
    * @function
    * @name Grid.removeChildren
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Object} obj The object to remove all children from.
    * @returns {Native.Object} obj.
    * @param {Native.Object} e The event object.
    */
    instance.removeChildren = function (obj) {
        while (obj.firstChild) {
            obj.removeChild(obj.firstChild);
        }
        return obj;
    }
    /**
    * Used internally to start the header reposition function.
    * @function
    * @name Grid.headerStartReposition
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element clicked on.
    */
    instance.headerStartReposition = function (e, obj) {
        var columnIndex = obj.getAttribute('column');
        instance.reposition = {
            header: instance.headers[columnIndex],
            start: Rendition.UI.mouseCoords(e),
            startOffsetLeft: parseInt(instance.headers[columnIndex].offsetLeft),
            endOffsetLeft: 0
        }
        instance.reposition.header.object.className = 'r_gridHeader r_gridReposition';
        Rendition.UI.appendEvent('mousemove', document.body, instance.headerReposition, false);
        Rendition.UI.appendEvent('mouseup', document.body, instance.headerEndReposition, false);
        return null;
    }
    /**
    * Used internally to end the header reposition function.
    * @function
    * @name Grid.headerEndReposition
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Object} e The event object.
    */
    instance.headerEndReposition = function (e) {
        instance.reposition.header.object.className = 'r_gridHeader';
        instance.reposition.header.offsetLeft = instance.reposition.endOffsetLeft;
        instance.reposition = null;
        Rendition.UI.removeEvent('mousemove', document.body, instance.headerReposition, false);
        Rendition.UI.removeEvent('mouseup', document.body, instance.headerEndReposition, false);
        instance.redrawHeaders();
        instance.updateSchemaData(false);
        return null;
    }
    /**
    * Used internally to swap the position of two columns.  Using during header reposition function.
    * @function
    * @name Grid.swapOrder
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Integer} order1 The order ordinal of the first column.
    * @param {Native.Integer} order2 The order ordinal of the second column.
    */
    instance.swapOrder = function (order1, order2) {
        for (var x = 0; instance.columns > x; x++) {
            if (instance.headers[x].order == order1) {
                instance.headers[x].order = parseInt(order2);
            } else if (instance.headers[x].order == order2) {
                instance.headers[x].order = parseInt(order1);
            }
        }
        return instance;
    }
    /**
    * Used internally while repositioning the headers.
    * @function
    * @name Grid.headerReposition
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Object} e The event object.
    */
    instance.headerReposition = function (e) {
        var pos = Rendition.UI.mouseCoords(e);
        instance.reposition.endOffsetLeft = instance.reposition.startOffsetLeft + (pos.x - instance.reposition.start.x);
        instance.reposition.header.object.style.left = instance.reposition.endOffsetLeft + 'px';
        for (var x = 0; instance.columns > x; x++) {
            if (instance.reposition.endOffsetLeft > (instance.headers[x].offsetLeft - parseInt(instance.headers[x].width * .5)
            - instance.headerRepositionDeadZone)
			&& instance.headers[x].order > instance.reposition.header.order) {
                instance.swapOrder(instance.headers[x].order, instance.reposition.header.order);
                instance.columnReposition(instance.headers[x].order, instance.reposition.header.order);
                instance.redrawHeaders();
            } else if ((instance.headers[x].offsetLeft + parseInt(instance.headers[x].width * .5)
            - instance.headerRepositionDeadZone) > instance.reposition.endOffsetLeft
			&& instance.headers[x].order < instance.reposition.header.order) {
                instance.swapOrder(instance.headers[x].order, instance.reposition.header.order);
                instance.columnReposition(instance.headers[x].order, instance.reposition.header.order);
                instance.redrawHeaders();
            }
        }
        return null;
    }
    /**
    * Swap children within a DHTML element.
    * @function
    * @name Grid.swapChildren
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.DHTMLElement} child1 The first child.
    * @param {Native.DHTMLElement} child2 The second child.
    */
    instance.swapChildren = function (child1, child2) {
        var parent1 = child1.parentNode;
        var parent2 = child2.parentNode;
        var sibling1 = child1.nextSibling;
        var sibling2 = child2.nextSibling;
        if (sibling2 != child1) {
            parent2.insertBefore(child1, sibling2);
        }
        if (sibling1 != child2) {
            parent1.insertBefore(child2, sibling1);
        }
    }
    /**
    * Reposition columns.
    * @function
    * @name Grid.columnReposition
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Integer} order1 The index of the first column.
    * @param {Native.Integer} order2 The index of the second column.
    */
    instance.columnReposition = function (order1, order2) {
        /* reposition columns loaded in the cache */
        for (var x = 0; instance.records + 1 > x; x++) {
            if (instance.local[x].state > 1) {
                instance.local[x].DOM.cells[order1 + 1].setAttribute('column', order2);
                instance.local[x].DOM.cells[order2 + 1].setAttribute('column', order1);
                /* swap in selection */
                instance.swapChildren(instance.local[x].DOM.cells[order1 + 1], instance.local[x].DOM.cells[order2 + 1]);

            }
        }
    }
    /**
    * Set the order by property of the grid.
    * @function
    * @name Grid.setOrderBy
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} null.
    * @param {Native.Integer} columnIndex The index of the column you want to order by.
    * @param {Native.Integer} direction The direction to order by. 0 = ascending, 1 = descending.
    */
    instance.setOrderBy = function (columnIndex, direction) {
        instance.orderByUnInitialized = false;
        var header = instance.headers[columnIndex];
        instance.orderBy = header.index;
        if (header.index == instance.orderBy && direction === undefined) {
            if (instance.orderByDirection == '0') {
                instance.orderByDirection = '1';
            } else {
                instance.orderByDirection = '0';
            }
        } else if (direction === undefined) {
            instance.orderByDirection = 0;
        } else {
            instance.orderByDirection = direction;
        }
        if (args.data !== undefined) {
            var sortMulti = null;
            if (instance.orderByDirection == 0) {
                var sortMulti = function (a, b) {
                    return ((a[instance.orderBy] < b[instance.orderBy]) ? -1 : ((a[instance.orderBy] > b[instance.orderBy]) ? 1 : 0));
                }
            } else {
                var sortMulti = function (b, a) {
                    return ((a[instance.orderBy] < b[instance.orderBy]) ? -1 : ((a[instance.orderBy] > b[instance.orderBy]) ? 1 : 0));
                }
            }
            instance.dataSet.data.sort(sortMulti);
            instance.JSONToLocalCache(undefined, instance.dataSet).redraw();
            /* if this is a local data set then return now */
            return;
        }
        instance.redrawHeaders();
        instance.clearGrid();
        if (instance.schema.objectId != 0) {
            instance.updateSchemaData(true);
        }
    }
    /**
    * Used internally to update DHTML element's attribute of the order of the columns.
    * @function
    * @name Grid.reorderColumn
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element.
    */
    instance.reorderColumn = function (e, obj) {
        var columnIndex = obj.getAttribute('column');
        instance.setOrderBy(columnIndex);
        return instance;
    }
    /**
    * Used internally to remove all child elements from the grid.
    * @function
    * @name Grid.clearGrid
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    */
    instance.clearGrid = function () {
        if (instance.grid.firstChild) {
            instance.grid.removeChild(instance.grid.firstChild);
        }
    }
    /**
    * Used internally remove any refrences to remote data or schema information, effectivly resetting the grid's data.
    * @function
    * @name Grid.disposeActiveCache
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    */
    instance.disposeActiveCache = function () {
        instance.local = undefined; /* clear local data */
        instance.local = [];
        instance.clearGrid();
        while (instance.header.firstChild) { instance.header.removeChild(instance.header.firstChild) }
        instance.headers = undefined; /* clear the schema data */
        instance.searchMatchRows = [];
        instance.newRowIndex = -1;
        instance.aggregateRow = -1;
        instance.objectChecksum = -1;
        instance.records = 0;
        if (instance.find !== undefined) {
            instance.find.searchText.textContent = '';
            instance.find.dialog.close();
            instance.find = undefined;
        }
    }
    /**
    * Refresh the data and schema information from the remote recordset.
    * @function
    * @name Grid.refresh
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Function} [callbackProcedure] The function to execute after the grid is done refreshing and the last request has finished executing.
    */
    instance.refresh = function (callbackProcedure) {
        instance.disposeActiveCache();
        instance.redraw(callbackProcedure); /* redraw the data */
        instance.eventlisteners_detailPane(null, null);
        return instance;
    }
    /**
    * Used internally to build a CSV list of prefrences for schema updates.
    * @function
    * @name Grid.getColumnVisibilityCSV
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.String} CSV prefrence data. A list of columns like this: 0,1,1,1,0,0 where 0=visible and 1=hidden.  The order is based on the column index.
    */
    instance.getColumnVisibilityCSV = function () {
        var a = [];
        for (var x = 0; instance.columns > x; x++) {
            a.push(instance.headers[x].visibility);
        }
        return a.join();
    }
    /**
    * Used internally to build a CSV list of prefrences for schema updates.
    * @function
    * @name Grid.getColumnSizeCSV
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.String} CSV prefrence data. A list of column sizes like this: 150,75,154,778,94,115 measured in px.  The order is based on the column index.
    */
    instance.getColumnSizeCSV = function () {
        var a = [];
        for (var x = 0; instance.columns > x; x++) {
            a.push(instance.headers[x].width);
        }
        return a.join();
    }
    /**
    * Used internally to build a CSV list of prefrences for schema updates.
    * @function
    * @name Grid.getColumnOrderCSV
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.String} CSV prefrence data. A list of column indexes like this: 1,2,4,3,5,6,7 where column 3 and 4's position is swapped.  The order is based on the order desired, the number is the index number of the column.  Or the other way around...  I'm not sure. TODO: Look into this
    */
    instance.getColumnOrderCSV = function () {
        var a = [];
        for (var x = 0; instance.columns > x; x++) {
            a.push(instance.headers[x].order);
        }
        return a.join();
    }
    /**
    * Used internally update schema data.  Column size,order etc. prefrences.
    * @function
    * @name Grid.updateSchemaData
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Boolean} refreshAfterUpdate Refresh the grid after the schema update is complete.  For instance, if the order element of the schema was just updated.
    */
    instance.updateSchemaData = function (refreshAfterUpdate) {
        instance.schemaReqEval = Rendition.UI.Ajax(instance.schemaUpdateURL(), function () {
            if (refreshAfterUpdate) { instance.refresh(); }
        }, instance);
    }
    /**
    * Sets the visibiliy of a column.
    * @function
    * @name Grid.setColumnVisibility
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} null.
    * @param {Native.Integer} visibility 1 = Visible, 0 = Hidden.
    * @param {Native.Integer} columnIndex The index of the column to alter.
    */
    instance.setColumnVisibility = function (columnIndex, visibility) {
        var header = instance.headers[columnIndex];
        if (visibility === undefined) {
            if (header.visibility == 1 || header.hidden != 0) {
                header.visibility = 0;
            } else {
                header.visibility = 1;
            }
        } else {
            header.visibility = visibility;
        }
        instance.updateColumnVisibility(columnIndex);
        instance.redrawHeaders();
        instance.redraw(); /*stops table from resizing itself*/
        instance.updateSchemaData();
        return null;
    }
    /**
    * Selects all rows and columns.
    * @function
    * @name Grid.selectAll
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    */
    instance.selectAll = function () {
        instance.removePreviousRowSelection();
        instance.selectedRowIndex = 0;
        for (var x = 0; instance.records + 1 > x; x++) {
            instance.selectedRows.push(x);
        }
        instance.applySelectionStyle();
        instance.applySelection();
        instance.eventlisteners_selectionChange(null, null);
    }
    /**
    * Inverts the selection.  All that is selected becomes unselected and all that isn't selected becomes selected.
    * @function
    * @name Grid.invertSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    */
    instance.invertSelection = function () {
        var rowsToSelect = [];
        for (var x = 0; instance.records + 1 > x; x++) {
            if (!instance.isRowInSelection(x)) {
                rowsToSelect.push(x);
            }
        }
        instance.removePreviousRowSelection();
        var l = rowsToSelect.length;
        for (var x = 0; l > x; x++) {
            instance.addRowToSelection(rowsToSelect[x], false, true);
        }
        instance.applySelectionStyle();
        instance.eventlisteners_selectionChange(null, null);
    }
    /**
    * Used internally to update a columns visiblity state.
    * @function
    * @name Grid.updateColumnVisibility
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Integer} columnIndex The index of the column to update.
    */
    instance.updateColumnVisibility = function (columnIndex) {
        for (var x = 0; instance.records + 1 > x; x++) {
            if (instance.local[x].state > 1) {
                if (instance.headers[columnIndex].visibility == 0) {
                    instance.local[x].DOM.cells[columnIndex + 1].style.visibility = 'hidden';
                    instance.local[x].DOM.cells[columnIndex + 1].style.display = 'none';
                } else {
                    instance.local[x].DOM.cells[columnIndex + 1].style.visibility = 'visible';
                    instance.local[x].DOM.cells[columnIndex + 1].style.display = 'table-cell';
                }
            }
        }
        return null;
    }
    /**
    * Used internally to create a context menu for headers (column titles).
    * @function
    * @name Grid.headerContextMenu
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element clicked on.
    */
    instance.headerContextMenu = function (e, obj) {
        /* default header context menu */
        var header = instance.headers[parseInt(obj.getAttribute('column'))];
        var options = args.headerContextMenuOptions || [];
        var optionLength = options.length - 1;

        if (instance.schema.objectId != 0) {

            optionLength++;
            options[optionLength] = Rendition.UI.MenuOption();
            options[optionLength].text = Rendition.Localization['Grid_ContextMenu_Search'].Title;
            Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
                instance.searchDialog(header.index);
            }, false);

            optionLength++;
            options[optionLength] = Rendition.UI.MenuOption();
            options[optionLength].text = Rendition.Localization['Grid_ContextMenu_Refresh'].Title;
            Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
                instance.refresh();
            }, false);

            optionLength++;
            options[optionLength] = Rendition.UI.MenuOption();
            options[optionLength].text = Rendition.Localization['Grid_ContextMenu_Get_Aggregate_Total'].Title;
            Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
                instance.aggregateDialog(header.index);
            }, false);
        }
        optionLength++;
        options[optionLength] = Rendition.UI.MenuOption();
        options[optionLength].text = Rendition.Localization['Grid_ContextMenu_Hide_this_column'].Title;
        Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
            instance.setColumnVisibility(header.index, 0);
        }, false);

        optionLength++;
        options[optionLength] = Rendition.UI.MenuOption();
        options[optionLength].text = Rendition.Localization['Grid_ContextMenu_Order_by_This_Column_Ascending'].Title;
        if (instance.orderBy == header.index && instance.orderByDirection == 0) {
            options[optionLength].checked = true;
        }
        Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
            instance.setOrderBy(header.index, 0);
        }, false);

        optionLength++;
        options[optionLength] = Rendition.UI.MenuOption();
        options[optionLength].text = Rendition.Localization['Grid_ContextMenu_Order_by_This_Column_Descending'].Title;
        if (instance.orderBy == header.index && instance.orderByDirection == 1) {
            options[optionLength].checked = true;
        }
        Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
            instance.setOrderBy(header.index, 1);
        }, false);
        if (instance.schema.objectId != 0) {
            optionLength++;
            options[optionLength] = Rendition.UI.MenuOption();
            options[optionLength].text = Rendition.Localization['Grid_ContextMenu_Download_All_Records'].Title;
            Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
                instance.downloadAllRecords();
            }, false);

            optionLength++;
            options[optionLength] = Rendition.UI.MenuOption();
            options[optionLength].text = Rendition.Localization['Grid_ContextMenu_Output_to_a_File'].Title;
            Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
                instance.outputToFileDialog();
            }, false);
        }
        optionLength++;
        options[optionLength] = Rendition.UI.MenuOption();
        options[optionLength].text = Rendition.Localization['Grid_ContextMenu_Select_All'].Title;
        Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
            instance.selectAll();
        }, false);
        optionLength++;
        options[optionLength] = Rendition.UI.MenuOption();
        options[optionLength].text = Rendition.Localization['Grid_ContextMenu_Invert_Selection'].Title;
        Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
            instance.invertSelection();
        }, false);
        optionLength++;
        options[optionLength] = Rendition.UI.MenuOption();
        options[optionLength].text = Rendition.Localization['Grid_ContextMenu_Toggle_Details_Pane'].Title;
        Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
            instance.toggleDetailsPane();
        }, false);
        optionLength++;
        options[optionLength] = Rendition.UI.MenuOption();
        options[optionLength].text = Rendition.Localization['Grid_ContextMenu_AddRemove_Columns'].Title;
        options[optionLength].hasChildren = true;
        Rendition.UI.appendEvent('mousedown', options[optionLength], function (e) {
            return false;
        }, false);
        Rendition.UI.appendEvent('mouseover', options[optionLength], function (e) {
            if (Rendition.UI.contextMenus.length > 0) {
                var elements = instance.getColumnVisibilityOptionList();
                var cmenu = Rendition.UI.ContextMenu(e, {
                    elements: elements,
                    caller: this,
                    type: 'RenditionContextMenu'
                });
            }
            return false;
        }, false);
        if (options.length > 0) {
            /* if options were generated then display the grid's context menu
            if no options were found then allow the browsers default context menu to appear */
            var menu = Rendition.UI.ContextMenu(e, {
                elements: options,
                caller: obj,
                type: 'mouse'
            });
            Rendition.UI.closeContextMenus(menu);
            e.preventDefault();
        }
        return false;
    }
    /**
    * Used internally to build a context menu array for the visibility list on the header context menu.
    * @function
    * @name Grid.getColumnVisibilityOptionList
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    */
    instance.getColumnVisibilityOptionList = function () {
        var elements = [];
        var y = 0;
        for (var x = 0; instance.columns > x; x++) {
            var header = instance.headers[x];
            if (header.hidden == 0 && header.name != 'VerCol') {
                elements[y] = Rendition.UI.MenuOption();
                elements[y].text = header.displayName || '';
                elements[y].checked = header.visibility == 1;
                elements[y].hasIcon = true;
                elements[y].headerIndex = parseInt(header.index);
                Rendition.UI.appendEvent('mousedown', elements[y], function (e) {
                    instance.setColumnVisibility(this.option.headerIndex);
                }, false);
                y++;
            }
        }
        return elements;
    }
    /**
    * Used internally return a cell to its normal state after being in inline edit mode.
    * @function
    * @name Grid.editEdit_deStyleEditCell
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    */
    instance.editEdit_deStyleEditCell = function () {
        try {/* where this object to suddenly vanish, it would be good to not throw up errors */
            for (var x = 0; instance.columns > x; x++) {
                var header = instance.getHeader(x);
                var pNode = instance.edit.inputs[x].parentNode;
                pNode.style.padding = instance.paddingRectToString(instance.style.cellPadding);
                instance.removeChildren(pNode);
                pNode.appendChild(document.createTextNode(instance.truncateText(instance.edit.record.data[x], header.width)));
            }
            instance.clearEditObject().redraw();
        } catch (e) {

        }
    }
    /**
    * Used internally to check if a cell in in the selection.
    * @function
    * @name Grid.inSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @depreciated
    * @returns {Native.Boolean} If true the cell is in the selection.
    * @param {Native.Integer} cellIndex The cell index.
    */
    instance.inSelection = function (cellIndex) {
        if (args.selectionMethod == 0 || args.selectionMethod == 3) {
            return instance.isRowInSelection(cellIndex.split('.')[0]);
        } else if (args.selectionMethod == 1 || args.selectionMethod == 4) {
            return instance.isCellInSelection(cellIndex);
        } else if (args.selectionMethod == 2 || args.selectionMethod == 5) {
            return instance.isColumnInSelection(cellIndex.split('.')[1]);
        }
        return false;
    }
    /**
    * Used internally to refresh a range of rows.
    * @function
    * @name Grid.refreshRowRange
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Integer} low The row to start from.
    * @param {Native.Integer} low The row to to to.
    * @param {Native.Function} [callbackProcedure] The function to execute after the grid is done refreshing and the last request has finished executing.
    */
    instance.refreshRowRange = function (low, high, callbackprocedure) {
        if (high === undefined) { high = low }
        for (var x = low; high >= x; x++) {
            instance.local[x] = {
                state: 0,
                DOM: null,
                data: null
            }
        }
        instance.downloadRecords(low, high, function (e) {
            instance.JSONToLocalCache(e);
            instance.reqEval = null;
            if (callbackprocedure) {
                callbackprocedure.apply(this, [this]);
            }
        }, false); /* not async*/
    }
    /**
    * Abort the edit procedure and return to read mode.
    * @function
    * @name Grid.abortEdit
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    */
    instance.abortEdit = function () {
        instance.editEdit_deStyleEditCell();
        return instance;
    }
    /**
    * Used internally turn row data into a JSON string.
    * @function
    * @name Grid.stringifyRow
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.String} JSON string of the row data.
    * @param {Native.Integer} rowIndex The index of the row.
    */
    instance.stringifyRow = function (rowIndex) {
        var r = {}
        for (var x = 0; instance.columns > x; x++) {
            r[instance.headers[x].name] = instance.local[rowIndex].data[x];
        }
        return JSON.stringify(r);
    }
    /**
    * Used internally turn schema data into a JSON string.
    * @function
    * @name Grid.stringifyEditor
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.String} JSON string of the header data.
    */
    instance.stringifyEditor = function () {
        var r = [];
        for (var x = 0; instance.columns > x; x++) {
            r.push({
                name: instance.headers[x].name,
                value: instance.edit.inputs[x].value,
                dataType: instance.headers[x].dataType,
                primaryKey: instance.headers[x].primaryKey,
                dataLength: instance.headers[x].dataLength
            });
        }
        return JSON.stringify(r);
    }
    /**
    * Gets the header that is defined as the primary key.
    * @function
    * @name Grid.getPKHeader
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} The header object or null if no primary key is defined in the object schema.  Note: editing is not allowed where objects do not have primary keys defined.
    */
    instance.getPKHeader = function () {
        for (var x = 0; instance.columns > x; x++) {
            if (instance.headers[x].primaryKey == 1) {
                return instance.headers[x];
            }
        }
        null;
    }
    /**
    * Used internally.  The callback procedure of the delete row function.
    * @function
    * @name Grid.deleteRowCallback
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Object} e The JSON data returned from the delete request.
    */
    instance.deleteRowCallback = function (e) {
        var cb = args.deleteCallback || Rendition.UI.gridDeleteCallback;
        try {
            cb.apply(instance, [e, instance]);
        } catch (err) {
            alert("Error in delegate gridDeleteCallback > " + err.message);
        }
        if (!instance.eventlisteners_deleterowfinish(null, null)) { return false }
        instance.removeSelection();
        instance.refresh();
        return;
    }
    /**
    * Deletes the selected rows.
    * @function
    * @name Grid.deleteSelectedRows
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    */
    instance.deleteSelectedRows = function () {
        if (!instance.eventlisteners_deleterow(null, null)) { return false }
        if (!instance.eventlisteners_deleterowstart(null, null)) { return false }
        if (instance.selectionExists()) {
            if (args.selectionMethod != 2 && args.selectionMethod != 5) {
                instance.reqDelete = Rendition.UI.Ajax(instance.deleteURL(instance.selection, false), instance.deleteRowCallback, this, true);
            }
        }
    }
    /**
    * Used interinally to handle the new row request return.
    * @function
    * @name Grid.insertRowFinish
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Object} primaryKeyValue The value of the new primary key.
    */
    instance.insertRowFinish = function (primaryKeyValue) {
        var PKheader = instance.getPKHeader();
        var srch = [{
            column: PKheader.name,
            operator: '=',
            value: primaryKeyValue,
            value2: undefined,
            type: PKheader.dataType,
            group: '0',
            linkOperator: 'or'
        }];
        instance.disposeActiveCache();
        instance.searchFilters = srch;
        instance.clearEditObject();
        instance.redraw(function () {
            instance.closeUpdateDialog();
            instance.reqSearch = Rendition.UI.Ajax(instance.selectURL(1, 1, instance.buildSearchSuffixString(instance.searchFilters)), instance.searchNewRowCallback, this, false);
        });
    }
    /**
    * End the edit procedure and commit changes to the recordset.
    * @function
    * @name Grid.endEdit
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @param {Native.Boolean} abort If true the update will be aborted and the row will be taken out of inline edit mode.
    * @param {Native.Function} callbackprocedure If the record is successfuly updated then this procedure will be applied.
    * @param {Native.Boolean} overwrite If true the record will be overwritten without prompting.
    */
    instance.endEdit = function (abort, callbackprocedure, overwrite) {
        if (instance.edit.state == null || instance.edit.state > 0) { return false }
        if (!instance.eventlisteners_editFinish(instance.edit.inputs, instance.edit.cell)) { return false }
        try {/* sometimes things just dissapear */
            if (!abort) {
                /* try and commit the changes to the database */
                instance.edit.state = 1;
                var columnIndex = instance.edit.cell.getAttribute('column');
                var rowIndex = instance.edit.cell.getAttribute('row');
                var PKheader = instance.getPKHeader();
                var pkvalue = instance.local[rowIndex].data[PKheader.index];
                var header = instance.headers[columnIndex];
                if (PKheader == null) {
                    /* no PK column found! insert/update/delete is impossible! */
                    alert(Rendition.Localization['Grid_This_table_does_not_support_editing__No_primary_key_defined'].Title);
                    instance.refreshRowRange(instance.edit.rowIndex, undefined, callbackprocedure);
                    instance.confirmDialog.dialog.close();
                    instance.editEdit_deStyleEditCell();
                    return null;
                }
                var url = '';
                var insertMode = false;
                if (rowIndex != instance.newRowIndex) {
                    url = instance.updateURL(instance.stringifyEditor(), overwrite || false);
                } else {
                    insertMode = true;
                    url = instance.insertURL(instance.stringifyEditor(), overwrite || false);
                    if (!instance.eventlisteners_insertrowstart(abort, null)) { return false }
                }
                instance.showUpdateDialog();
                var req = Rendition.UI.Ajax(url, function (e) {
                    instance.crudCallback(e, callbackprocedure, rowIndex, insertMode);
                    instance.closeUpdateDialog();
                }, instance);
            } else {
                instance.editEdit_deStyleEditCell();
                instance.clearEditObject().redraw();
            }
        } catch (e) {
            /* endEdit can sometime be called within event handlers after the grid has been removed from the dom
            resulting in an unpredictable and benign error. */
        }
        return null;
    }
    /**
    * Used internally to show the user a progress dialog.
    * @function
    * @name Grid.showUpdateDialog
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    */
    instance.showUpdateDialog = function () {
        instance.updateDialog = Rendition.UI.dialogWindow({
            rect: {
                x: (document.documentElement.clientWidth * .5) - (400 * .5),
                y: (document.documentElement.clientHeight * .2),
                w: 400,
                h: 110
            },
            title: Rendition.Localization['Grid_StatusUpdate_Updating_Record'].Title,
            alwaysOnTop: true
        });
        var updBox = Rendition.UI.GroupBox({
            title: Rendition.Localization['Grid_StatusUpdate_Updating_Record'].Title,
            childNodes: [Rendition.UI.txt(Rendition.Localization['Grid_StatusUpdate_Please_wait_while_your_record_is_updated'].Title)],
            alwaysExpanded: true
        });
        updBox.appendTo(instance.updateDialog.content);
    }
    /**
    * Used internally to close the progress dialog for this grid.
    * @function
    * @name Grid.closeUpdateDialog
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    */
    instance.closeUpdateDialog = function () {
        instance.updateDialog.close();
    }
    /**
    * Used internally to complete the update, adding or deleting of rows.
    * @function
    * @name Grid.crudCallback
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    * @param {Native.Object} e The JSON object returned from the remote recordset server.
    * @param {Native.Function} callbackprocedure A procedure to apply once the record has been updated.
    * @param {Native.Integer} rowIndex The index of the row being updated.
    */
    instance.crudCallback = function (e, callbackprocedure, rowIndex, insertMode) {
        document.body.style.cursor = 'auto';
        updateReqEval = null;
        instance.edit.state = 2;
        try {
            if (insertMode) {
                var cb = args.insertCallback || Rendition.UI.gridInsertCallback;
                var a = cb.apply(instance, [e, instance]);
            } else {
                var cb = args.updateCallback || Rendition.UI.gridUpdateCallback;
                var a = cb.apply(instance, [e, instance]);
            }
        } catch (err) {
            alert("Error in delegate grid" + Rendition.UI.iif(insertMode, "Insert", "Update") + "Callback > " + err.message);
        }
        if (a.error == 0) {
            /* sucsess!  refresh row to get the new timestamp */
            if (!instance.eventlisteners_recordupdated(a, null)) { }
            if (rowIndex == instance.newRowIndex) {
                if (!instance.eventlisteners_insertrowfinish(a, null)) { return false }
                instance.insertRowFinish(a.primaryKey);
            } else {
                instance.objectChecksum = -1;
                instance.refreshRowRange(instance.edit.rowIndex, undefined, callbackprocedure);
                instance.editEdit_deStyleEditCell();
            }
        } else if (a.error == -2) {
            var close = document.createElement('button');
            close.innerHTML = Rendition.Localization['Grid_EditReturn_Return_To_Editing'].Title;
            var refreshClose = document.createElement('button');
            refreshClose.innerHTML = Rendition.Localization['Grid_EditReturn_Refresh_row_and_discarding_any_changes'].Title;
            close.onclick = function (e, confirm) {
                instance.confirmDialog.dialog.close();
                instance.editInput.focus();
                if (instance.editInput.select) { instance.editInput.select() }
                instance.edit.state = 0;
            }
            refreshClose.onclick = function (e) {
                instance.refreshRowRange(instance.edit.rowIndex, undefined, callbackprocedure);
                instance.confirmDialog.dialog.close();
                instance.editEdit_deStyleEditCell();
            }
            instance.confirmDialog = Rendition.UI.ConfirmDialog({
                message: Rendition.Localization['Grid_EditReturn_The_row_was_deleted_since_you_last_refreshed_it'].Title,
                subTitle: Rendition.Localization['Grid_EditReturn_This_row_has_been_deleted'].Title,
                title: Rendition.Localization['Grid_EditReturn_Row_no_longer_exists'].Title,
                buttons: [close, refreshClose],
                autosize: true
            });
        } else if (a.error == -1) {
            var yesNoCancel = []; for (var x = 0; 3 > x; x++) { yesNoCancel.push(document.createElement('button')) }
            yesNoCancel[0].innerHTML = 'Yes';
            yesNoCancel[0].onclick = function (e, confirm) {
                instance.edit.state = 0;
                instance.endEdit(false, callbackprocedure, true);
                instance.confirmDialog.close();
            }
            yesNoCancel[1].innerHTML = 'No';
            yesNoCancel[1].onclick = function (e, confirm) {
                instance.refreshRowRange(instance.edit.rowIndex, undefined, callbackprocedure);
                instance.confirmDialog.dialog.close();
            }
            yesNoCancel[2].innerHTML = 'Cancel';
            yesNoCancel[2].onclick = function (e, confirm) {
                instance.edit.state = 0;
                instance.edit.inputs[0].focus();
                instance.confirmDialog.close();
            }
            instance.confirmDialog = Rendition.UI.ConfirmDialog({
                message: Rendition.Localization['Grid_This_row_has_changed_msg'].Message,
                subTitle: Rendition.Localization['Grid_Data_updated_since_last_refresh'].Title,
                title: Rendition.Localization['Grid_Data_Timestamp_Mismatch'].Title,
                buttons: yesNoCancel,
                dialogRect: { x: (document.documentElement.clientWidth * .5) - (Rendition.UI.saveChangesDialogWidth * .5), y: 75, h: 200, w: Rendition.UI.saveChangesDialogWidth },
                autosize: true
            });
        } else if (a.error != 0) {
            var cancelButton = document.createElement('button');
            cancelButton.innerHTML = Rendition.Localization['Grid_VerColMissmatch_Cancel'].Title;
            var noButton = document.createElement('button');
            noButton.innerHTML = Rendition.Localization['Grid_VerColMissmatch_No'].Title;
            cancelButton.onclick = function (e, confirm) {
                instance.confirmDialog.dialog.close();
                instance.editInput.focus();
                if (instance.editInput.select) { instance.editInput.select() }
                instance.edit.state = 0;
            }
            noButton.onclick = function (e) {
                instance.refreshRowRange(instance.edit.rowIndex, undefined, callbackprocedure);
                instance.confirmDialog.dialog.close();
                instance.editEdit_deStyleEditCell();
            }
            instance.confirmDialog = Rendition.UI.ConfirmDialog({
                message: Rendition.Localization['Grid_VerColMissmatch_Click_No_to_discard_your_changes'].Title.replace('{0}', a.error).replace('{1}', a.description),
                subTitle: Rendition.Localization['Grid_SQL_Server_error'].Title,
                title: Rendition.Localization['Grid_SQL_Server_error'].Title,
                buttons: [cancelButton, noButton],
                autosize: true
            });
        }
    }
    /**
    * Used internally to update the edit object into its uninitialized state (not in edit mode).
    * @function
    * @name Grid.clearEditObject
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    */
    instance.clearEditObject = function () {
        instance.edit = {
            record: null,
            cell: null,
            rowIndex: null,
            columnIndex: null,
            cellIndex: null,
            state: null,
            inputs: null,
            timestamp: null
        }
        return instance;
    }
    /**
    * Used internally to start inline editing a row.
    * @function
    * @name Grid.startEdit
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} null.
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element.
    */
    instance.startEdit = function (e, obj) {
        if (!instance.eventlisteners_editStart(e, obj)) { return false }
        var rowIndex = parseInt(obj.getAttribute('row'));
        if (args.genericEditor == true) {
            instance.genericEditor(rowIndex);
            return instance;
        }
        var columnIndex = parseInt(obj.getAttribute('column'));
        var boolSelect = [[true, true], [false, false]];
        var loc = instance.local[rowIndex];
        editInputs = [];
        for (var x = 0; instance.columns > x; x++) {
            var header = instance.getHeader(x);
            if (header.dataType == 'bit') {
                var editInput = document.createElement('select');
                Rendition.UI.fillSelect(editInput, boolSelect, 0, 1, loc.data[header.index]);
                editInput.className = 'r_gridSelect';
            } else {
                var editInput = document.createElement('input');
                editInput.className = 'r_gridInput';
            }
            var cell = loc.DOM.cells[header.order + 1];
            editInput.onkeyup = instance.eventlisteners_editKeyUp;
            editInput.onkeypress = instance.eventlisteners_editKeyPress;
            editInput.onkeydown = instance.eventlisteners_editKeyDown;
            editInput.onmousedown = instance.eventlisteners_editMouseDown;
            editInput.onmouseup = instance.eventlisteners_editMouseUp;
            editInput.onmousemove = instance.eventlisteners_editMouseMove;
            editInput.onmouseover = instance.eventlisteners_editMouseOver;
            editInput.onmouseout = instance.eventlisteners_editMouseOut;
            editInput.onclick = instance.eventlisteners_editClick;
            editInput.ondblclick = instance.eventlisteners_editDblClick;
            editInput.oncontextmenu = instance.eventlisteners_editContextMenu;
            editInput.style.width = cell.offsetWidth + 'px';
            instance.removeChildren(cell);
            cell.style.padding = 0;
            cell.appendChild(editInput);
            if (header.dataType != 'bit') {
                editInput.value = loc.data[header.index];
            } else {
                editInput.checked = loc.data[header.index];
            }
            editInputs.push(editInput);
        }
        var header = instance.getHeaderByName('VerCol');
        if (header != null) {
            timeStamp = instance.local[rowIndex].data[header.index];
        } else {
            timeStamp = "";
        }
        instance.edit = {
            record: loc,
            cell: loc.DOM.cells[columnIndex + 1],
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            cellIndex: rowIndex + '.' + columnIndex,
            state: 0,
            inputs: editInputs,
            timestamp: timeStamp
        }
        editInputs[columnIndex].focus();
        if (editInputs[columnIndex].select) { editInputs[columnIndex].select() }
        if (!instance.eventlisteners_afterEditStart(e, obj)) { return false }
        return null;
    }
    /**
    * Gets a header object by its column name.
    * @function
    * @name Grid.getHeaderByName
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} null.
    * @param {Native.String} name The name of the header.
    */
    instance.getHeaderByName = function (name) {
        for (var x = 0; instance.columns > x; x++) {
            if (instance.headers[x].name == name) {
                return instance.headers[x];
            }
        }
        return null;
    }
    /**
    * Creates a dialog that the user can select their choice of aggregate functions against a column they select or one you predefine.
    * @function
    * @name Grid.aggregateDialog
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @param {Native.Integer} [startWithRowSelected=0] The index of the column you want to define by default.
    */
    instance.aggregateDialog = function (startWithRowSelected) {
        var aggDialog = Rendition.UI.dialogWindow({
            rect: {
                x: (document.documentElement.clientWidth * .5) - (468 * .5),
                y: (document.documentElement.clientHeight * .2),
                w: 468,
                h: 150
            },
            title: 'Aggregate',
            modal: true,
            modalCloseable: true
        });
        var tab = document.createElement('table');
        var r2 = tab.insertRow(0);
        var r1 = tab.insertRow(0);
        var r1c2 = r1.insertCell(0);
        var r1c1 = r1.insertCell(0);
        var r2c1 = r2.insertCell(0);
        r2c1.setAttribute('colspan', 2);
        var column = document.createElement('select');
        var aggFunc = document.createElement('select');
        var calcButton = document.createElement('button');
        calcButton.innerHTML = Rendition.Localization['Grid_aggDialog_Calculate'].Title;
        var columnList = instance.getColumnListAry();
        Rendition.UI.fillSelect(column, columnList, 0, 1, startWithRowSelected);
        Rendition.UI.fillSelect(aggFunc, instance.SQL_aggregate_functions, 0, 1);
        r1c1.appendChild(column);
        r1c2.appendChild(aggFunc);
        r2c1.appendChild(calcButton);
        var aggBox = Rendition.UI.GroupBox({
            title: Rendition.Localization['Grid_aggDialog_Select_column_and_aggregate_function_to_use'].Title,
            childNodes: [tab],
            alwaysExpanded: true
        });
        aggBox.appendTo(aggDialog.content);
        calcButton.onclick = function () {
            var header = instance.getHeaderByIndex(column.value);
            var famType = header.dataType;
            if (!(famType == 'int' || famType == 'money' || famType == 'int' || famType == 'float' || famType == 'real')
			&& (aggFunc.value == 'SUM' || aggFunc.value == 'AVG' || aggFunc.value == 'MIN' || aggFunc.value == 'MAX')) {
                alert(Rendition.Localization['Grid_You_cannot_use_this_aggregate'].Title.replace('{0}', aggFunc.value).replace('{1}', header.displayName).replace('{2}', famType));
            } else {
                aggDialog.close();
                if (instance.aggregateRow == -1) {
                    instance.addRow(instance.blankRow(instance.aggregateCellMessage), 'agg');
                    instance.redraw();
                }
                instance.gotoRow(instance.aggregateRow);
                instance.calculateAggregate(column.value, aggFunc.value, instance.aggregateCallback);
            }
        }
    }
    /**
    * Get an aggregate calculation and place it into the aggregate row at the bottom of the rowset.
    * @function
    * @name Grid.calculateAggregate
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @param {Native.Integer} headerIndex The index of the header to preform the aggregate function from.
    * @param {Native.String} aggregateFunctionName The name of the aggregate function, for example: SUM, MIN, MAX, AVG.
    * @param {Native.Function} [callbackProcedure] The function to execute after server has returned from calculating the aggregate.
    */
    instance.calculateAggregate = function (headerIndex, aggregateFunctionName, callbackProcedure) {
        var header = instance.getHeaderByIndex(headerIndex);
        if (instance.aggregateRow == -1) {
            instance.addRow(instance.blankRow(instance.aggregateCellMessage), 'agg');
            instance.redraw();
        }
        var DOM = instance.local[instance.aggregateRow].DOM;
        var cell = Rendition.UI.getElementsByAttribute('index', header.index, 'td', DOM);
        cell[0].innerHTML = instance.style.aggregateCellLoading;
        instance.getAggregateColumn(header.name, aggregateFunctionName, callbackProcedure);
    }
    /**
    * Used internally create record rows.  This does nothing.
    * @function
    * @name Grid.addRecord
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @depreciated
    * @memberOf Rendition.UI.Grid.prototype
    */
    instance.addRecord = function () {
        var struct = {}
        for (var x = 0; instance.columns > x; x++) {
            struct[instance.headers[x].name].value = null;
        }
    }
    /**
    * Used internally create record rows.
    * @function
    * @name Grid.addRow
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @depreciated
    * @returns {Native.Object} grid.
    * @param {Native.Object} data The data to add to this row.
    * @param {Native.String} rowType The type of row. 'normal','new' or 'agg'
    */
    instance.addRow = function (data, rowType) {
        if (data === undefined) {
            instance.blankRow('');
        }
        instance.local.push({
            state: 0,
            DOM: null,
            data: null
        });
        var newRowIndex = instance.local.length - 1;
        if (rowType == 'agg') {
            instance.aggregateRow = newRowIndex;
        }
        instance.createRow(newRowIndex, data, rowType);
        return instance.local[newRowIndex];
    }
    /**
    * Creates a dialog that allows the user to output selected grid data to a file.
    * @function
    * @name Grid.outputToFileDialog
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    */
    instance.outputToFileDialog = function () {
        var outputDialog = Rendition.UI.dialogWindow({
            rect: {
                x: (document.documentElement.clientWidth * .5) - (564 * .5),
                y: (document.documentElement.clientHeight * .2),
                w: 564,
                h: 192
            },
            title: Rendition.Localization['Grid_OutputDialog_Output_to_a_File'].Title,
            modal: true,
            modalCloseable: true
        });
        var tab = document.createElement('table');
        var r5 = tab.insertRow(0);
        var r4 = tab.insertRow(0);
        r4.style.visibility = 'hidden';
        r4.style.display = 'none';
        var r3 = tab.insertRow(0);
        var r2 = tab.insertRow(0);
        var r1 = tab.insertRow(0);
        var r1c2 = r1.insertCell(0);
        var r1c1 = r1.insertCell(0);
        var r2c2 = r2.insertCell(0);
        var r2c1 = r2.insertCell(0);
        var r3c2 = r3.insertCell(0);
        var r3c1 = r3.insertCell(0);
        var r4c2 = r4.insertCell(0);
        var r4c1 = r4.insertCell(0);
        var r5c1 = r5.insertCell(0);
        r5c1.setAttribute('colspan', 2);
        var createButton = document.createElement('button');
        var fileType = document.createElement('select');
        var justSelection = document.createElement('input');
        justSelection.type = 'checkbox';
        justSelection.checked = true;
        var includeHeaders = document.createElement('input');
        includeHeaders.type = 'checkbox';
        includeHeaders.checked = true;
        var zipFile = document.createElement('input');
        zipFile.type = 'checkbox';
        zipFile.checked = false;
        Rendition.UI.fillSelect(fileType, instance.outputFileTypes, 0, 1);
        r5c1.appendChild(createButton);
        r1c1.appendChild(Rendition.UI.txt(Rendition.Localization['Grid_OutputDialog_File_Type'].Title));
        r1c2.appendChild(fileType);
        r2c1.appendChild(Rendition.UI.txt(Rendition.Localization['Grid_OutputDialog_Only_included_selected_rows_and_columns'].Title));
        r2c2.appendChild(justSelection);
        r3c1.appendChild(Rendition.UI.txt(Rendition.Localization['Grid_OutputDialog_Include_header_names_on_first_row'].Title));
        r3c2.appendChild(includeHeaders);
        r4c1.appendChild(Rendition.UI.txt(Rendition.Localization['Grid_OutputDialog_Send_in_a_compressed_zip_file'].Title));
        r4c2.appendChild(zipFile);
        createButton.innerHTML = Rendition.Localization['Grid_OutputDialog_Create'].Title;
        var outBox = Rendition.UI.GroupBox({
            title: Rendition.Localization['Grid_OutputDialog_Select_what_type_of_file_to_create'].Title,
            childNodes: [tab],
            alwaysExpanded: true
        });
        outBox.appendTo(outputDialog.content);
        createButton.onclick = function () {
            var type = fileType.value + "|" + justSelection.checked + "|" + includeHeaders.checked + "|" + zipFile.checked;
            var bounds = { low: 0, high: instance.records }
            if (justSelection.checked && instance.selection !== undefined) {
                bounds = instance.getSelectionBounds();
            }
            instance.includeSchema = true;
            var url = instance.selectURL(bounds.low, bounds.high, undefined, undefined, Rendition.UI.iif(justSelection.checked, JSON.stringify(instance.selection), undefined), type);
            Rendition.UI.postToNewWindow(decodeURIComponent(url));
            outputDialog.close();
        }
        return instance;
    }
    /**
    * Toggles the visibility of the details pane.
    * @function
    * @name Grid.toggleDetailsPane
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    */
    instance.toggleDetailsPane = function () {
        if (instance.detailsPaneVisible == true) {
            instance.detailsPaneVisible = false;
            instance.detailsPane.style.visibility = 'hidden';
            instance.detailsPane.style.display = 'none';
            instance.applyStyle();
        } else {
            instance.detailsPaneVisible = true;
            instance.detailsPane.style.visibility = 'visible';
            instance.detailsPane.style.display = 'block';
            instance.applyStyle();
        }
    }
    /**
    * Creates a dialog the user can use to search for row data.
    * @function
    * @name Grid.searchDialog
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Integer} [startWithRowSelected=0] The index of the column you want to define by default.
    */
    instance.searchDialog = function (startWithRowSelected) {
        var validation = [];
        var filter = instance.searchFilters[0];
        var columnList = instance.getColumnListAry();
        if (instance.find !== undefined) {
            instance.find.dialog.close();
            instance.find = undefined;
        }
        var tab = document.createElement('table');
        tab.style.margin = 'auto';
        var r2 = tab.insertRow(0);
        var r1 = tab.insertRow(0);
        var r1c4 = r1.insertCell(0);
        var r1c3 = r1.insertCell(0);
        var r1c2 = r1.insertCell(0);
        var r1c1 = r1.insertCell(0);
        var r2c1 = r2.insertCell(0);
        r2c1.setAttribute('colspan', 4);
        var column = document.createElement('select');
        var operator = document.createElement('select');
        var value = document.createElement('input');
        var value2 = document.createElement('input');
        var findNextButton = document.createElement('button');
        var findPreviousButton = document.createElement('button');
        var searchText = document.createElement('span');
        var addToSelectionButton = document.createElement('button');
        addToSelectionButton.innerHTML = Rendition.Localization['Grid_FindDialog_Add_Results_To_Selection'].Title;
        findNextButton.innerHTML = Rendition.Localization['Grid_FindDialog_Find_Next'].Title;
        findPreviousButton.innerHTML = Rendition.Localization['Grid_FindDialog_Find_Previous'].Title;
        //r2c1.appendChild(addToSelectionButton);
        r2c1.appendChild(findPreviousButton);
        r2c1.appendChild(findNextButton);
        r2c1.appendChild(addToSelectionButton);
        r2c1.appendChild(searchText);
        r1c1.appendChild(column);
        r1c2.appendChild(operator);
        r1c3.appendChild(value);
        r1c4.appendChild(document.createTextNode('and'));
        r1c4.appendChild(value2);
        value2.style.marginLeft = '5px';
        value.style.width = '120px';
        value2.style.width = '120px';
        if (filter.operator != 'between') {
            r1c4.style.visibility = 'hidden';
        }
        searchText.style.paddingLeft = '50px';
        searchText.textContent = '';
        var findBox = Rendition.UI.GroupBox({
            title: Rendition.Localization['Grid_FindDialog_Select_your_search_criteria'].Title,
            childNodes: [tab],
            alwaysExpanded: true
        });
        var findDialog = Rendition.UI.dialogWindow({
            rect: {
                x: (document.documentElement.clientWidth * .5) - (668 * .5),
                y: (document.documentElement.clientHeight * .2),
                w: 774,
                h: 155
            },
            title: Rendition.Localization['Grid_FindDialog_Find_Dialog_Title'].Title,
            alwaysOnTop: true
        });
        findBox.appendTo(findDialog.content);
        findDialog.addEventListener('close', function () {
            instance.find = undefined;
            return true;
        }, false);
        instance.find = {
            dialog: findDialog,
            column: column,
            operator: operator,
            value: value,
            value2: value2,
            findTable: tab,
            groupBox: findBox,
            findNext: findNextButton,
            findPrevious: findPreviousButton,
            searchText: searchText,
            addToSelection: addToSelectionButton,
            validation: validation
        }
        operator.onchange = function () {
            instance.clearSearchHighlight(false);
            if (this.value.match(/is.*/i)) {
                r1c3.style.visibility = 'hidden';
            } else if (this.value != 'between') {
                r1c3.style.visibility = 'visible';
                r1c4.style.visibility = 'hidden';
            } else {
                r1c3.style.visibility = 'visible';
                r1c4.style.visibility = 'visible';
            }
        }
        column.onchange = function () { instance.clearSearchHighlight(false) }
        value.onchange = function () { instance.clearSearchHighlight(false) }
        value2.onchange = function () { instance.clearSearchHighlight(false) }
        value.onkeyup = function (e) {
            e = e || window.event;
            if (e.keyCode == 13) {
                if (operator.value != 'between') {
                    findNextButton.onclick();
                } else {
                    value2.focus();
                }
            }
        }
        value2.onkeyup = function (e) {
            e = e || window.event;
            if (e.keyCode == 13) {
                findNextButton.onclick();
            }
        }

        /* fill column */
        Rendition.UI.fillSelect(column, columnList, 0, 1);
        Rendition.UI.fillSelect(operator, instance.operators, 0, 1);
        operator.value = filter.operator || '';
        column.value = filter.column || '';
        value.value = filter.value || '';
        value2.value = filter.value2 || '';
        addToSelectionButton.onclick = instance.addFindToSelection;
        findNextButton.onclick = function () {
            instance.findNextPrevious(true);
        }
        findPreviousButton.onclick = function () {
            instance.findNextPrevious(false);
        }
        if (startWithRowSelected !== undefined) {
            column.selectedIndex = startWithRowSelected;
        }
        validation.push(new Rendition.UI.AutoComplete({
            input: value,
            autoComplete: false,
            mustMatchPattern: /(^[0-1]{1,1}[0-9]{1,1}[0-9]{2,2}$)|(^$)/,
            patternMismatchMessage: instance.dataTypeSearchMismatchMessage,
            patternMismatchTitle: 'Type Mismatch'
        }));
        validation.push(new Rendition.UI.AutoComplete({
            input: value2,
            autoComplete: false,
            mustMatchPattern: /(^[0-1]{1,1}[0-9]{1,1}[0-9]{2,2}$)|(^$)/,
            patternMismatchMessage: instance.dataTypeSearchMismatchMessage,
            patternMismatchTitle: 'Type Mismatch'
        }));
        value.focus();
    }
    /**
    * Used internally to create a message telling the user their data type is not matched to the column they are searching.
    * @function
    * @name Grid.dataTypeSearchMismatchMessage
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    * @param {Native.Object} e The event object.
    */
    instance.dataTypeSearchMismatchMessage = function (e) {
        var column = instance.headers[instance.find.column.value];
        var type = column.dataType;
        var msg = Rendition.Localization['Grid_search_You_have_entered_a_value_that_does_not_match'].Title.replace('{0}', type);
        return msg || 'Type Mismatch';
    }
    /**
    * Add the find results to the selection.
    * @function
    * @name Grid.addFindToSelection
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    */
    instance.addFindToSelection = instance.addSearchToSelection = function () {
        var hlength = instance.searchMatchRows.length;
        for (var x = 0; hlength > x; x++) {
            instance.addRowToSelection(instance.searchMatchRows[x], false/*shift*/, true/*ctrl*/);
        }
        if (instance.find !== undefined) {
            instance.find.dialog.close();
        }
        instance.applySelection();
        instance.applySelectionStyle();
        instance.redraw();
        instance.eventlisteners_selectionChange(null, null);
    }
    /**
    * Used internally to swap the color of the search fields from selected to highlighted.
    * @function
    * @name Grid.swapSearchHilightColor
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    * @param {Native.Integer} oldRow The index of the old row.
    * @param {Native.Integer} newRow The index of the new row.
    * @param {Native.Integer} hLength The number of matches in the search.
    */
    instance.swapSearchHilightColor = function (oldRow, newRow, hLength) {
        instance.applySelectionStyle(instance.searchMatchRows[oldRow]);
        instance.applySelectionStyle(instance.searchMatchRows[newRow]);
        instance.gotoRow(instance.searchMatchRows[newRow]);
        instance.find.searchText.textContent =
            Rendition.Localization['Grid_Find_Match_x_of_x'].Title.replace('{0}', (instance.searchHighlight + 1)).replace('{1}', hLength);
    }
    /**
    * Used internally to goto the next search result.
    * @function
    * @name Grid.find_next
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Integer} hLength The number of matches in the search.
    */
    instance.find_next = function (hLength) {
        if (instance.searchHighlight < (hLength - 1)) {
            instance.searchHighlight++;
            instance.swapSearchHilightColor(instance.searchHighlight - 1, instance.searchHighlight, hLength);
        } else {
            alert(Rendition.Localization['Grid_Reached_the_end_of_the_search'].Title);
            var oldRowIndex = parseInt(instance.searchHighlight);
            instance.searchHighlight = 0;
            instance.swapSearchHilightColor(oldRowIndex, 0, hLength);
        }
    }
    /**
    * Used internally to goto the previous search result.
    * @function
    * @name Grid.find_previous
    * @private
    * @memberOf Rendition.UI.Grid.prototype
    * @param {Native.Integer} hLength The number of matches in the search.
    */
    instance.find_previous = function (hLength) {
        if (instance.searchHighlight > 0) {
            instance.searchHighlight--;
            instance.swapSearchHilightColor(instance.searchHighlight + 1, instance.searchHighlight, hLength);
        } else {
            alert(Rendition.Localization['Grid_Reached_the_beginging_of_the_search'].Title);
            var oldRowIndex = parseInt(instance.searchHighlight);
            instance.searchHighlight = hLength - 1;
            instance.swapSearchHilightColor(oldRowIndex, hLength - 1, hLength);
        }
    }
    /**
    * Finds the next or the previous search result and selects the row.
    * @function
    * @name Grid.findNextPrevious
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @param {Native.Boolean} [next=false] If true, move to the next result, if false move to the previous result.
    */
    instance.findNextPrevious = function (next) {
        var passedValidation = true;
        for (var x = 0; instance.find.validation.length > x; x++) {
            if (instance.find.validation[x].isValid() == false) {
                passedValidation = false;
            }
        }
        if (!passedValidation) {
            return false;
        }
        instance.find.findPrevious.disabled = true;
        instance.find.findNext.disabled = true;
        instance.clearSearchHighlight(true);
        var hLength = instance.searchMatchRows.length;
        if (hLength == 0) {
            instance.buildSearchFromFindDialog();
            instance.search();
        } else {
            if (next) {
                instance.find_next(hLength);
            } else {
                instance.find_previous(hLength);
            }
        }
        instance.find.findPrevious.disabled = false;
        instance.find.findNext.disabled = false;
    }
    /**
    * Used internally clear the search highlight optionally preserving or removing the search result cache.
    * @function
    * @name Grid.clearSearchHighlight
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    * @param {Native.Boolean} saveResults If true save the results.
    */
    instance.clearSearchHighlight = function (saveResults) {
        /* set field validation */
        var column = instance.headers[instance.find.column.value];
        for (var x = 0; instance.find.validation.length > x; x++) {
            var type = column.dataType;
            if (type == 'int' || type == 'money' || type == 'float' || type == 'real' || type == 'bigint') {
                instance.find.validation[x].mustMatchPattern = /^[0-9.]*$/;
            } else if (type == 'datetime') {
                instance.find.validation[x].mustMatchPattern = /^.*$/;
            } else if (type == 'text' || type == 'varchar' || type == 'nchar' || type == 'char' || type == 'ntext' || type == 'nvarchar') {
                instance.find.validation[x].mustMatchPattern = /^.*$/;
            } else {
                instance.find.validation[x].mustMatchPattern = /^.*$/;
            }
        }
        if (instance.searchHighlight != null) {
            var previousHRow = parseInt(instance.searchMatchRows[instance.searchHighlight]);
            var previousSearchIndex = parseInt(instance.searchHighlight);
            instance.searchHighlight = null;
            /* reset to unselected color */
            if (!isNaN(previousHRow)) {
                instance.colorRow(previousHRow, instance.style.rowHeaderFontColor,
				instance.style.rowHeaderBackground, instance.style.cellFontColor, instance.style.cellBackground);
                instance.applySelectionStyle(previousHRow);
                instance.searchHighlight = previousSearchIndex;
            }
        }
        if (!saveResults) {
            instance.searchMatchRows = [];
            instance.find.searchText.textContent = '';
        }
    }
    /**
    * Gets a list of the column names in a array.
    * @function
    * @name Grid.getColumnListAry
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Array} Array of {String} column names.
    */
    instance.getColumnListAry = function () {
        var columns = [];
        if (instance.headers === undefined) { return columns }
        for (var x = 0; instance.columns > x; x++) {
            columns.push([instance.headers[x].index, instance.headers[x].displayName]);
        }
        return columns;
    }
    /**
    * Used internally to build a searchFilter object from the find dialog.
    * @function
    * @name Grid.buildSearchFromFindDialog
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    */
    instance.buildSearchFromFindDialog = function () {
        var column = instance.headers[instance.find.column.value];
        instance.searchFilters = [{
            column: column.name,
            operator: instance.find.operator.value,
            value: instance.find.value.value,
            value2: instance.find.value2.value,
            type: column.dataType,
            group: '0',
            linkOperator: 'or'
        }];
    }
    /**
    * Adds a search filter to the grid.
    * @function
    * @name Grid.addSearchFilter
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    * @param {Native.Integer} columnIndex The column index to search.
    * @param {Native.String} [operator='='] The search operator.  Possible values are '=', '&gt;', '&lt;', etc.. See MS SQL documentaion for a complete list of column comparison operators.
    * @param {Native.String} [value] The first match value of the search.
    * @param {Native.String} [value2] The second match value of the search.
    * @param {Native.String} [group=0] The id of the groupping of the search filter.  Filters are grouped by their group id.  This has an impact on the way link operators work. E.g.: where Group 0 -> (this=this or this=that) __Last link operator of group 0__ -> and __Group 1 ->__ (this=that and that=there).
    * @param {Native.String} [linkOperator='or'] The link operator.  Can be 'and' or 'or'.
    */
    instance.addSearchFilter = function (columnIndex, operator, value, value2, group, linkOperator) {
        var column = instance.headers[columnIndex];
        instance.searchFilters.push({
            column: column.name,
            operator: operator || '=',
            value: value || '',
            value2: value2 || '',
            type: column.dataType,
            group: group || '0',
            linkOperator: linkOperator || 'or'
        });
        return instance;
    }
    /**
    * Clears the search filters loaded into this grid.
    * @function
    * @name Grid.clearSearchFilters
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    */
    instance.clearSearchFilters = function () {
        instance.searchFilters = [];
        return instance;
    }
    /**
    * Starts the search defined in the search filters.
    * @function
    * @name Grid.search
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @returns {Native.Object} grid.
    */
    instance.search = function () {
        /* find out the row number(s) that match the search criteria currently defined */
        if (instance.searchFilters.length == 0) { return false }
        /* do a sync request for the row numbers */
        if (instance.find !== undefined) {
            instance.find.searchText.textContent = Rendition.Localization['Grid_Finding_matches'].Title;
        }
        instance.reqSearch = Rendition.UI.Ajax(instance.selectURL(1, 1, instance.buildSearchSuffixString(instance.searchFilters)), instance.searchCallback, this, false);
        return instance;
    }
    /**
    * Used internally to build a suffix from the searchFilters object.
    * @function
    * @name Grid.buildSearchSuffixString
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    * @param {Native.Array} filters The array of searchFilters objects.
    */
    instance.buildSearchSuffixString = function (filters) {
        var s = [];
        var group = '0';
        var hLength = filters.length;
        var pLinkOp = '';
        for (var x = 0; hLength > x; x++) {
            var filter = filters[x];
            var type = filter.type;
            var linkOp = filter.linkOperator;
            var op = filter.operator;
            if (x == 0 || group != filter.group) {
                if (x != 0) {
                    var ct = String(s[s.length - 1]);
                    s[s.length - 1] = ct.substring(0, ct.length - (pLinkOp.length + 1));
                    /* remove the previous link operator */
                    s.push(')'); /*close previous group */
                    s.push(filters[x - 1].linkOperator); /*add an operator between the two groups*/
                }
                s.push('(');
                group = filter.group;
            }
            if (op == 'between') {
                if (type == 'int' || type == 'money' || type == 'float' || type == 'real' || type == 'bigint') {
                    s.push('[' + filter.column + '] between ' + filter.value + ' and ' + filter.value2 + ' ' + Rendition.UI.iif(x == hLength - 1, '', filter.linkOperator + ' '));
                } else if (type == 'datetime') {
                    s.push('[' + filter.column + '] between \'' + filter.value + '\' and \'' + filter.value2 + '\' ' + Rendition.UI.iif(x == hLength - 1, '', filter.linkOperator + ' '));
                }
            } else if (op == 'is') {
                s.push('[' + filter.column + '] is ' + filter.value + ' ' + Rendition.UI.iif(x == hLength - 1, '', filter.linkOperator + ' '));
            } else if (type == 'text' || type == 'uniqueidentifier' || type == 'varchar' || type == 'nchar' || type == 'char' || type == 'ntext' || type == 'nvarchar') {
                s.push('[' + filter.column + '] ' + op + ' \'' + filter.value + '\' ' + Rendition.UI.iif(x == hLength - 1, '', filter.linkOperator + ' '));
            } else if (type == 'int' || type == 'money' || type == 'float' || type == 'real' || type == 'bigint') {
                s.push('[' + filter.column + '] ' + op + ' ' + filter.value + ' ' + Rendition.UI.iif(x == hLength - 1, '', filter.linkOperator + ' '));
            }
            pLinkOp = String(linkOp);
        }
        if (hLength > 0) {
            s.push(')'); /*close the last group */
            return 'where ' + s.join('');
        } else {
            return '';
        }
    }
    /**
    * Used internally to find the row that was just inserted.
    * @function
    * @name Grid.searchNewRowCallback
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @param {Native.Object} e The JSON object returned from the search function.
    */
    instance.searchNewRowCallback = function (e) {
        var a = JSON.parse(e.responseText);
        a = a.method1.DataSet.data;
        var hLength = a.length;
        for (var x = 0; hLength > x; x++) {
            instance.searchMatchRows.push(a['match' + x]);
        }
        var rowIndex = instance.searchMatchRows[0];
        if (args.selectionMethod != 2 && args.selectionMethod != 5 && args.selectionMethod != 1) {
            instance.addRowToSelection(rowIndex, false, false);
        }
        var hLength = instance.searchMatchRows.length;
        instance.gotoRow(rowIndex);
        return;
    }
    /**
    * Used internally process a search request return.
    * @function
    * @name Grid.searchCallback
    * @memberOf Rendition.UI.Grid.prototype
    * @private
    * @returns {Native.Object} grid.
    * @param {Native.Object} e The event object.
    */
    instance.searchCallback = function (e) {
        var a = JSON.parse(e.responseText);
        a = a.method1.DataSet.data;
        var hLength = a.length;
        for (var x = 0; hLength > x; x++) {
            instance.searchMatchRows.push(a['match' + x]);
        }
        var hLength = instance.searchMatchRows.length;
        if (hLength > 0) {
            /* match, goto first row*/
            instance.searchHighlight = 0;
            instance.gotoRow(instance.searchMatchRows[0]);
            if (instance.find !== undefined) {
                instance.find.searchText.textContent =
                    Rendition.Localization['Grid_Find_Match_x_of_x'].Title.replace('{0}', (instance.searchHighlight + 1)).replace('{1}', hLength);
            }
            instance.applySelectionStyle(instance.searchMatchRows[0]);
        } else {
            /* no match show a sad face */
            if (instance.find !== undefined) {
                instance.find.searchText.textContent = Rendition.Localization['Grid_No_matches'].Title;
            }
        }
        instance.eventlisteners_aftersearch(e);
        return;
    }
    /**
    * Goto a row and select it.
    * @function
    * @name Grid.gotoRow
    * @memberOf Rendition.UI.Grid.prototype
    * @public
    * @param {Native.Object} rowIndex The index of the row to goto.
    */
    instance.gotoRow = function (rowIndex) {
        if (instance.records - instance.searchMatchRowOffset <= rowIndex) {
            var offset = 0;
        } else {
            var offset = instance.searchMatchRowOffset;
        }
        var scrollY = (rowIndex - offset) * instance.style.rowRect.h;
        if (scrollY < 0) { scrollY = 0 }
        instance.viewPort.scrollTop = scrollY;
        instance.redraw();
    }
    return instance.init();
}