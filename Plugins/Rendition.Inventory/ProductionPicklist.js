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
* Production picklist.
* @constructor
* @name Rendition.Commerce.ProductionPicklist
*/
Rendition.Commerce.ProductionPicklist = function (args) {
	var instance = {}
	instance.id = 'uid_' + Rendition.UI.createId();
	var groupByOptions = [['items', 'Items'], ['orders', 'Orders']];
	instance.productionPicklistGroup = function () {
	    return {
	        name: 'ProductionPicklist',
			smallTitles: true,
			groups: [
				{
					name: 'Filter Results',
					expaned: true,
					inputs: [
						{
							name: 'from',
							displayName: 'From',
							inputType: 'datePicker',
							width: '85px'
						},
						{
							name: 'to',
							displayName: 'To',
							inputType: 'datePicker',
							width: '85px'
						},
						Rendition.Commerce.userIdFormInput(undefined, false, 'userId', 'Account No.'),
						{
							HTML: function () {
								/* display selected flag types */
								var p = document.createElement('div');
								for (var x = 0; Rendition.Commerce.flagTypes.length > x; x++) {
									var f = Rendition.Commerce.flagTypes[x];
									if (f === undefined) { continue; }
									if (!f.ShowInProductionAgingReport) { continue; }
									var d = document.createElement('div');
									var i = document.createElement('input');
									i.type = 'checkbox';
									i.checked = true;
									i.id = instance.id + f.Id;
									d.appendChild(i);
									d.appendChild(Rendition.UI.txt(f.Name));
									p.appendChild(d);
								}
								return p;
							}
						},
						{
							HTML: function () {
								return instance.refreshButton;
							}
						}
					]
				}
			]
		}
	}
	if (args === undefined) { args = {} }
	instance.tabOrder = {
		items: 0
	}
	if (args.parentNode === undefined) {
		instance.dialog = Rendition.UI.dialogWindow({
			rect: {
				x: 35,
				y: 35,
				h: 600,
				w: 700
			},
			title: 'Production Picklist'
		});
		args.parentNode = instance.dialog.content;
	}
	instance.init = function () {
		instance.cutter = Rendition.UI.CutterBar({
			position: 200,
			autoResize: false,
			parentNode: args.parentNode
		});
		instance.refreshButton = document.createElement('button');
		instance.refreshButton.style.marign = '4px';
		instance.refreshButton.innerHTML = 'Refresh';
		instance.refreshButton.onclick = function () {
			instance.beforeInit();
			instance.grid.refresh();
		}
		instance.form = Rendition.UI.Form(instance.productionPicklistGroup());
		var f = new Date();
		var t = new Date();
		f.setDate(f.getDate() - 7);
		instance.form.getInputByName("from").value = Rendition.UI.formatDate(f, 'mm/dd/yyyy'); ;
		instance.form.getInputByName("to").value = Rendition.UI.formatDate(t, 'mm/dd/yyyy'); ;
		instance.form.appendTo(instance.cutter.cutters[0]);
		instance.grid = Rendition.UI.Grid({
			selectionMethod: 3,
			editMode: 0,
			objectName: "productionPicklist" + Rendition.Commerce.user.userId,
			hideNewRow: true,
			parentNode: instance.cutter.cutters[1],
			beforeinit: instance.beforeInit,
			contextMenuOptions: instance.gridContextMenuOptions
		});
	}
	instance.gridContextMenuOptions = function (e, element) {
		var row = parseInt(element.getAttribute('row'));
		var column = parseInt(element.getAttribute('column'));
		var userId = instance.form.getInputByName("userId").value;
		var from = instance.form.getInputByName("from").value;
		var to = instance.form.getInputByName("to").value;
		var itemNumber = instance.grid.getRecord(row, 'itemNumber');
		var optionLength = -1;
		var options = [];
		var header = instance.grid.headers[column];
		optionLength++;
		options[optionLength] = Rendition.UI.MenuOption();
		options[optionLength].text = 'Show related line items';
		Rendition.UI.appendEvent('click', options[optionLength], function (e) {
			var c = []
			if (userId != "") {
				c.push(['userId', '=', userId, '', 'and', '1']);
			}
			if (from != "" && to != "") {
				c.push(['orderDate', 'between', from + ' 00:00:00.000', to + ' 23:59:59.999', 'and', '1']);
			}
			if (itemNumber != "") {
				c.push(['itemNumber', '=', itemNumber, '', 'and', '1']);
			}
			for (var x = 0; Rendition.Commerce.flagTypes.length > x; x++) {
				var f = Rendition.Commerce.flagTypes[x];
				if (f === undefined) { continue; }
				if (!f.ShowInProductionAgingReport) { continue; }
				var fv = document.getElementById(instance.id + f.Id);
				if (fv.checked) {
					c.push(['line_status', '=', f.Id, '', 'or', '2']);
				}
			}
			new Rendition.Commerce.Search({
				objectName: 'shortOrderOverview',
				criteria: c,
				title: 'Related Line Items - Search'
			});
		}, false);

		optionLength++;
		options[optionLength] = Rendition.UI.MenuOption();
		options[optionLength].text = 'Show base item';
		Rendition.UI.appendEvent('click', options[optionLength], function (e) {
			new Rendition.Commerce.ItemEditor({ itemNumber: itemNumber });
		}, false);

		return options;
	}
	instance.cellStyle = function (e, grid, element, row, column, selection, data, header) {
		return;
	}
	instance.beforeInit = function () {
		var userId = instance.form.getInputByName("userId").value;
		var from = instance.form.getInputByName("from").value;
		var to = instance.form.getInputByName("to").value;
		var flagFilter = [];
		for (var x = 0; Rendition.Commerce.flagTypes.length > x; x++) {
			var f = Rendition.Commerce.flagTypes[x];
			if (f === undefined) { continue; }
			if (!f.ShowInProductionAgingReport) { continue; }
			var fv = document.getElementById(instance.id + f.Id);
			if (fv.checked) {
				flagFilter.push("lastFlagStatus = " + f.Id + " \n");
			}
		}
		var fFilterJoined = "";
		if (flagFilter.length > 0) {
			fFilterJoined = " and (" + flagFilter.join(' or ') + ")";
		}
		var req1 = [
			'SqlCommand',
			["if exists(select 0 from sys.views where name = 'productionPicklist" + Rendition.Commerce.user.userId + "') begin \
				drop view [productionPicklist" + Rendition.Commerce.user.userId + "] \
				end"]
		]
		var req2 = [
			'SqlCommand',
			[
"create view [dbo].[productionPicklist" + Rendition.Commerce.user.userId + "] as \n" +
"select f.itemNumber,SUM(f.total) as total, -1 as VerCol  \n" +
"from (select itemNumber,SUM(c.qty) as total  \n" +
"from serial_line i \n" +
"inner join cart c on i.cartId = c.cartId \n" +
"inner join orders o on o.orderId = i.orderId and o.canceled = 0 " +
Rendition.UI.iif(from != "" && to != "",
" and o.orderdate between '" + from.s() + "  00:00:00.000' and '" + to.s() + "  23:59:59.999' ", "") + " \n" +
"where c.qty > 0 " + Rendition.UI.iif(userId != "", " and o.userId = " + userId.s(), "") +
" \n" + fFilterJoined +
"group by itemNumber,CONVERT(datetime,CONVERT(varchar(50),orderdate,101))" +
 Rendition.UI.iif(flagFilter.length > 0, ",lastFlagStatus", "") + ") f group by f.itemNumber;"
			]
		]
		instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI +
		'method1=' + JSON.stringify(req1).toURI() +
		'&method2=' + JSON.stringify(req2).toURI(),
		function (e) { }, instance, false/* sync */);
	}
	instance.init();
}