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
/* send me an arg that looks like this 
	objectName is optional, it defaults to 'shortOrderOverview'
	the last 'LINK_OPERATOR' in the data argument is ignored.
	{
		criteria:[['itemNumber', '=', '', '', 'or', '1']]
		objectName:'shortOrderOverview'
	}
	or
	{
		criteria:[
			['itemNumber', 'like', '%80%', '', 'and', '1'],
			['userId', '=', '153', '', 'and', '1'],
			['orderDate', 'between', '1/1/2010', '1/31/2010', 'or', '1']
		]
		objectName:'shortOrderOverview'
	}
	or /* here the where clause is group into two groups. 
	(itemNumber and userId and orderDate) and (itemNumber or userId)
	{
		criteria:[
			['itemNumber', 'like', '%80%', '', 'and', '1'],
			['userId', '=', '153', '', 'and', '1'],
			['orderDate', 'between', '1/1/2010', '1/31/2010', 'and', '1']
			['itemNumber', 'not is null', '', '', 'or', '2'],
			['userId', 'is null', '153', '', 'and', '2']
		]
		objectName:'shortOrderOverview(optional,default)'
	}

	arg data = ['COLUMN_NAME', 'OPERATOR', 'VALUE1', 'VALUE2', 'LINK_OPERATOR', 'GROUP NO.']
*/
/**
* Search program.
* @constructor
* @name Rendition.Commerce.Search
*/
Rendition.Commerce.Search = function (args) {
	var instance = {}
	var groupByOptions = [['items', 'Items'], ['orders', 'Orders']];
	var linkOptions = [['or', 'or'], ['and', 'and']];
	if (args === undefined) { args = {} }
	if (args.objectName === undefined) { args.objectName = 'shortOrderOverview'; }
	if (args.hideCriteria !== undefined) {
		instance.hideCriteria = args.hideCriteria;
	} else {
		instance.hideCriteria = false;
	}
	instance.tabOrder = {
		items: 0
	}
	if (args.parentNode === undefined) {
		instance.dialog = Rendition.UI.dialogWindow({
			rect: {
			    x: Rendition.UI.dialogPosition.x,
			    y: Rendition.UI.dialogPosition.y,
				h: 400,
				w: 763
			},
			title: args.title || Rendition.Localization['Search_Search'].Title
		});
		args.parentNode = instance.dialog.content;
	}
	instance.searchReadObject = function (data) {
		return dataSet = {
			data: data,
			error: 0,
			description: '',
			range: {
				from: 1,
				to: 1
			},
			schema: {
				error: 0,
				errorDesc: '',
				objectId: 0,
				columns: 7,
				records: data.length,
				orderBy: 0,
				orderByDirection: 0,
				checksum: -1,
				name: 'search',
				displayName: 'Search'
			},
			header: [
				{
					name: 'name',
					dataType: 'varchar',
					dataLength: 255,
					columnOrder: 0,
					columnSize: 150,
					visibility: 1,
					description: 'Select the column you want to add to your search.',
					isNullable: 0,
					primaryKey: 1,
					defaultValue: '',
					displayName: 'Column Name',
					hidden: 0
				},
				{
					name: 'operator',
					dataType: 'varchar',
					dataLength: 10,
					columnOrder: 1,
					columnSize: 100,
					visibility: 1,
					description: 'What type of match is to be made.',
					isNullable: 0,
					primaryKey: 0,
					defaultValue: '=',
					displayName: 'Operator',
					hidden: 0
				},
				{
					name: 'value',
					dataType: 'varchar',
					dataLength: 5000,
					columnOrder: 2,
					columnSize: 150,
					visibility: 1,
					description: 'Match value 1.',
					isNullable: 0,
					primaryKey: 0,
					defaultValue: '',
					displayName: 'Value 1',
					hidden: 0
				},
				{
					name: 'value2',
					dataType: 'varchar',
					dataLength: 5000,
					columnOrder: 3,
					columnSize: 150,
					visibility: 1,
					description: 'Match value 2.',
					isNullable: 0,
					primaryKey: 0,
					defaultValue: '',
					displayName: 'Value 2',
					hidden: 0
				},
				{
					name: 'linkOperator',
					dataType: 'varchar',
					dataLength: 3,
					columnOrder: 4,
					columnSize: 60,
					visibility: 1,
					description: 'How this condition links to the condition below it.',
					isNullable: 0,
					primaryKey: 0,
					defaultValue: 'or',
					displayName: 'Operator',
					hidden: 0
				},
				{
					name: 'group',
					dataType: 'int',
					dataLength: 2,
					columnOrder: 5,
					columnSize: 60,
					visibility: 1,
					description: 'Group these conditions into group 1-10.',
					isNullable: 0,
					primaryKey: 0,
					defaultValue: '1',
					displayName: 'Group',
					hidden: 0
				},
				{
					name: 'VerCol',
					dataType: 'timestamp',
					dataLength: 50,
					columnOrder: 6,
					columnSize: 200,
					visibility: 0,
					description: '',
					isNullable: 0,
					primaryKey: 0,
					defaultValue: '-1',
					displayName: 'VerCol',
					hidden: 1
				}
			]
		}
	}
	instance.changeObject = function () {
		instance.changeObjectDialog = Rendition.UI.dialogWindow({
			rect: {
			    x: Rendition.UI.dialogPosition.x,
			    y: Rendition.UI.dialogPosition.y,
				h: 135,
				w: 260
			},
			modal: true,
			modalCloseable: true,
			title: Rendition.Localization['Search_Change_TableView'].Title
		});
		var c = instance.changeObjectDialog.content;
		var req1 = [
			"GetSqlArray",
			[
				{
					"commandText": "select name,name as objectName from sys.objects where type = 'U' or type = 'V' order by name;"
				}
			]
		]
		instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
			var a = JSON.parse(e.responseText);
			var sel = document.createElement('select');
			var submitButton = document.createElement('button');
			submitButton.style.margin = '4px';
			submitButton.innerHTML = Rendition.Localization['Search_Submit'].Title;
			submitButton.style.cssFloat = 'right';
			var cancelButton = document.createElement('button');
			cancelButton.style.margin = '4px';
			cancelButton.innerHTML = 'Cancel';
			cancelButton.style.cssFloat = 'right';
			cancelButton.onclick = function () {
				instance.changeObjectDialog.close();
			}
			submitButton.onclick = function () {
				args = { objectName: sel.value }
				instance.init();
				instance.changeObjectDialog.close();
			}
			Rendition.UI.fillSelect(sel, a.method1.GetSqlArray, 0, 1, args.objectName);
			var gb = Rendition.UI.GroupBox({
				title: Rendition.Localization['Search_Select_a_Table_or_View'].Title,
				childNodes: [sel],
				expanded: true
			});
			gb.appendTo(c);
			c.appendChild(submitButton);
			c.appendChild(cancelButton);
			return;
		}, instance);

	}
	instance.addCondition = function () {
		if (instance.searchGrid.editing) {
			instance.editfinish(null, instance.searchGrid, null, instance.searchGrid.editingRow, 0, null, null, null);
		}
		instance.data.push(['itemNumber', '=', '', '', 'or', '1']);
		instance.searchGrid = Rendition.UI.Grid(instance.searchGridArgs(instance.data));
	}
	instance.init = function () {
		instance.menuBarElements = [];
		instance.menuBarElements[0] = Rendition.UI.MenuOption();
		instance.menuBarElements[0].text = Rendition.Localization['Search_Search'].Title;
		Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
			instance.search();
			return false;
		}, false);
		instance.menuBarElements[1] = Rendition.UI.MenuOption();
		instance.menuBarElements[1].text = Rendition.Localization['Search_Add_Condition'].Title;
		Rendition.UI.appendEvent('click', instance.menuBarElements[1], function (e) {
			instance.addCondition();
			return false;
		}, false);
		instance.menuBarElements[2] = Rendition.UI.MenuOption();
		instance.menuBarElements[2].text = Rendition.Localization['Search_Change_TableView'].Title;
		Rendition.UI.appendEvent('click', instance.menuBarElements[2], function (e) {
			instance.changeObject();
			return false;
		}, false);
		if (instance.menuBar === undefined) {
			instance.menuBar = Rendition.UI.MenuBar({
				options: Rendition.UI.iif(args.menuOptions !== undefined, args.menuOptions, instance.menuBarElements),
				parentNode: args.parentNode
			});
		}
		instance.menuOffsetRect = { x: 0, y: instance.menuBar.rect.h, h: instance.menuBar.rect.h * -1, w: 0 }
		if (!instance.hideCriteria) {
			if (instance.cutter === undefined) {
				instance.cutter = Rendition.UI.CutterBar({
					position: 100,
					autoResize: false,
					parentNode: args.parentNode,
					orientation: 1,
					offsetRect: instance.menuOffsetRect
				});
			}
		} else {
			instance.cutter = { cutters: [0, 0] }
		}
		if (args.criteria !== undefined) {
			instance.data = args.criteria;
		} else {
			instance.data = [
				['', '=', '', '', 'or', '1']
			];
		}
		instance.searchGrid = Rendition.UI.Grid(instance.searchGridArgs(instance.data));
		instance.grid = Rendition.UI.Grid(instance.gridArgs(' where 1 = 2 ', function () {
			if (args.criteria !== undefined) {
				instance.search();
			}
		}));
		if (!instance.hideCriteria) {
			if (args.showCriteria == false || args.showCriteria === undefined) {
				instance.cutter.minimize();
			}
		}
	}
	instance.gridArgs = function (suffix, callbackProc) {
	    var a = {
			selectionMethod: 3,
			editMode: 0,
			objectName: args.objectName,
			cellstyle: instance.itemCellStyle,
			hideNewRow: true,
			contextMenuOptions: Rendition.Commerce.ComContext,
			parentNode: Rendition.UI.iif(instance.hideCriteria, args.parentNode, instance.cutter.cutters[1]),
			rowCountColumn: true,
			suffix: suffix,
			afterloadcallback: function () {
				if (callbackProc !== undefined) {
					callbackProc.apply(instance, []);
				}
			},
			offsetRect: Rendition.UI.iif(args.menuOptions === undefined, undefined, instance.menuOffsetRect)
		}
		return a;
	}
	instance.searchGridArgs = function (data) {
	    var a = {
	        name: 'Search',
			selectionMethod: 3,
			data: instance.searchReadObject(data),
			editMode: 0,
			parentNode: Rendition.UI.iif(instance.hideCriteria, undefined, instance.cutter.cutters[0]),
			cellclick: instance.editstart,
			editstart: instance.editstart,
			editfinish: instance.editfinish,
			preventHeaderResize: true,
			preventHeaderReposition: true,
			preventReorder: true,
			rowCountColumn: true,
			contextMenuOptions: instance.contextMenuOptions
		}
		return a;
	}
	instance.buildSuffix = function () {
		var l = instance.searchGrid.local.length;
		var srch = [];

		for (var x = 1; l > x; x++) {
			var data = instance.searchGrid.local[x].data;
			var hdr = instance.grid.getHeaderByName(data[0]);
			if (hdr == null) {
				srch = [];
				break;
			}
			srch.push({
				column: data[0],
				operator: data[1],
				value: data[2],
				value2: data[3],
				type: hdr.dataType,
				group: data[5],
				linkOperator: data[4]
			});
		}
		return instance.grid.buildSearchSuffixString(srch);
	}
	instance.search = function () {
		instance.searchingDialog = Rendition.UI.UpdateDialog({
			title: Rendition.Localization['Search_Searching'].Title,
			subTitle: Rendition.Localization['Search_Please_Wait'].Title,
			message: Rendition.Localization['Search_Searching_for_records_that_match_your_criteria'].Title
		});
		if (instance.searchGrid.editing) {
			instance.editfinish(null, instance.searchGrid, null, instance.searchGrid.editingRow, 0, null, null, null);
		}
		var suffix = instance.buildSuffix();
		instance.cutter.cutters[1].innerHTML = ''; /* remove old grid and create a new one */
		instance.grid = Rendition.UI.Grid(instance.gridArgs(suffix, function () {
			instance.searchingDialog.close();
			if (args.quiet === undefined || args.quiet == false) {
				if (!instance.grid.recordcountinfo) {
					instance.grid.recordcountinfo = Rendition.UI.Info({
						timeout: 3000,
						position: { x: 10, y: 10 },
						title: Rendition.Localization['Search_Search_complete'].Title,
						message: instance.grid.records + Rendition.Localization['Search_x_records_found'].Title
					});
				}
			}
		}));
	}
	instance.contextMenuOptions = function (e, element) {
		var options = [];
		var optionLength = -1;
		optionLength++;
		options[optionLength] = Rendition.UI.MenuOption();
		options[optionLength].text = Rendition.Localization['Search_Remove_Condition'].Title;
		Rendition.UI.appendEvent('click', options[optionLength], function (e) {
			if (instance.searchGrid.editing) {
				instance.editfinish(null, instance.searchGrid, null, instance.searchGrid.editingRow, 0, null, null, null);
			}
			instance.data.splice(parseInt(element.getAttribute('row')) - 1, 1);
			instance.searchGrid = Rendition.UI.Grid(instance.searchGridArgs(instance.data));
		}, false);
		return options;
	}
	instance.editcancel = function (e, grid, element, row, column, selection, data, header) {
		grid.editing = false;
		for (var x = 1; grid.headers.length > x; x++) {
			var rw = grid.local[row].DOM;
			var data = grid.local[row].data[x - 1];
			var cell = rw.cells[x];
			cell.innerHTML = data;
		}
		return;
	}
	instance.editfinish = function (e, grid, element, row, column, selection, data, header) {
		grid.editing = false;
		for (var x = 1; grid.headers.length > x; x++) {
			i = grid.editingInputs[x - 1];
			var rw = grid.local[grid.editingRow].DOM;
			grid.local[grid.editingRow].data[x - 1] = i.value;
			var data = grid.local[grid.editingRow].data[x - 1];
			var cell = rw.cells[x];
			cell.innerHTML = data;
		}
		return;
	}
	instance.editstart = function (e, grid, element, row, column, selection, data, header) {
		grid.preventDefault();
		if (instance.grid.headers === undefined) { return; }
		if (grid.editing) {
			if (row != grid.editingRow) {
				instance.editfinish(e, grid, element, row, column, selection, data, header);
				grid.editing = false;
			}
		}
		if (!grid.editing) {
			grid.editing = true;
			grid.editingRow = row;
			grid.editingInputs = [];
			var headers = instance.grid.headers; /*headers from table 1*/
			var l = headers.length;
			for (var x = 1; grid.headers.length > x; x++) {
				var rw = grid.local[row].DOM;
				var currentValue = grid.local[row].data[x - 1];
				var cell = rw.cells[x];
				if (x == 1) {
					cell.innerHTML = '';
					var options = [];
					for (var y = 0; l > y; y++) {
						options.push([headers[y].name, headers[y].displayName]);
					}
					var i = document.createElement('select');
					Rendition.UI.fillSelect(i, options, 0, 1, currentValue);
				} else if (x == 2) {
					cell.innerHTML = '';
					var i = document.createElement('select');
					Rendition.UI.fillSelect(i, grid.operators, 0, 1, currentValue);
				} else if (x == 5) {
					cell.innerHTML = '';
					var i = document.createElement('select');
					Rendition.UI.fillSelect(i, linkOptions, 0, 1, currentValue);
				} else if (x == 6) {
					cell.innerHTML = '';
					var options = [];
					for (var y = 1; 13 > y; y++) {
						options.push([y, y]);
					}
					var i = document.createElement('select');
					Rendition.UI.fillSelect(i, options, 0, 1, currentValue);
				} else {
					cell.innerHTML = '';
					var i = document.createElement('input');
					i.onkeypress = function (e) {
						if (e.keyCode == 13) {
							instance.editfinish(e, grid, element, row, column, selection, data, header);
						} else if (e.keyCode == 27) {
							instance.editcancel(e, grid, element, row, column, selection, data, header);
						}
					}
					i.setAttribute('column', x);
					i.style.border = 'none';
					i.value = currentValue;
					i.style.width = cell.offsetWidth + 'px';
					i.style.height = '15px';
					cell.appendChild(i);
				}
				if (x == 1 || x == 2 || x == 6 || x == 5) {
					i.setAttribute('column', x);
					i.style.fontSize = '.8em';
					cell.appendChild(i);
					i.onchange = function () {
						instance.editfinish(e, grid, element, row, column, selection, data, header);
					}
				} else {
					i.style.font = grid.style.cellFont;
				}
				i.style.margin = '0 0 0 -1px';
				grid.editingInputs.push(i);
			}
		}
		if (column == 2) {
			grid.editingInputs[2].focus();
			grid.editingInputs[2].select();
		} else if (column == 3) {
			grid.editingInputs[3].focus();
			grid.editingInputs[3].select();
		}
		return;
	}
	instance.gridContextMenuOptions = function (e, element) {
		var row = parseInt(element.getAttribute('row'));
		var column = parseInt(element.getAttribute('column'));
		var options = [];
		var optionLength = -1;
		if (args.objectName == 'orders' || args.objectName == 'orders') {
			optionLength++;
			options[optionLength] = Rendition.UI.MenuOption();
			options[optionLength].text = Rendition.Localization['Search_Open_related_order'].Title;
			Rendition.UI.appendEvent('click', options[optionLength], function (e) {
				new Rendition.Commerce.OrderEditor({ orderNumber: instance.grid.getRecord(row, 'orderNumber') });
			}, false);
		}
		if (args.objectName == 'shortOrderOverview') {
			optionLength++;
			options[optionLength] = Rendition.UI.MenuOption();
			options[optionLength].text = Rendition.Localization['Search_Open_related_base_item'].Title;
			Rendition.UI.appendEvent('click', options[optionLength], function (e) {
				new Rendition.Commerce.ItemEditor({ itemNumber: instance.grid.getRecord(row, 'itemNumber') });
			}, false);
		}
		if (args.objectName == 'orders' || args.objectName == 'shortOrderOverview') {
			optionLength++;
			options[optionLength] = Rendition.UI.MenuOption();
			options[optionLength].text = Rendition.Localization['Search_Open_related_account'].Title;
			Rendition.UI.appendEvent('click', options[optionLength], function (e) {
				new Rendition.Commerce.AccountEditor({ userId: instance.grid.getRecord(row, 'userId') });
			}, false);
		}
		return options;
	}
	instance.cellStyle = function (e, grid, element, row, column, selection, data, header) {
		return;
	}
	instance.init();
	return instance;
}