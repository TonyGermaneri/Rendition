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
* Production aging.
* @constructor
* @name Rendition.Commerce.ProductionAging
*/
Rendition.Commerce.ProductionAging = function (args) {
	var instance = {}
	var groupByOptions = [['items', 'Items'], ['orders', 'Orders']];
	instance.productionAgingGroup = function () {
	    return {
            name: 'ProductionAging',
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
							name: 'groupBy',
							displayName: 'Grouping',
							inputType: 'select',
							options: groupByOptions
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
			title: 'Production Aging'
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
			if (instance.grid) {
				instance.beforeInit();
				instance.grid.refresh();
			}
			instance.chart.refresh();
		}
		instance.form = Rendition.UI.Form(instance.productionAgingGroup());
		instance.form.appendTo(instance.cutter.cutters[0]);
		instance.getDates();
		instance.tabs = [];
		instance.tabs[0] = Rendition.UI.TabBarTab({
			title: 'Status Pie',
			load: function (tab, tabBar, content) {
				if (content.innerHTML == '') {
					content.style.overflow = 'hidden';
					instance.chart = Rendition.UI.Chart({
						parentNode: content,
						title: 'Order Statuses',
						type: 'PieChart',
						chart: function (dateChart, chartArguments, chartOptions) {
						    var groupBy = instance.form.getInputByName("groupBy").value;
						    var userId = instance.form.getInputByName("userId").value;
						    var from = instance.form.getInputByName("from").value;
						    var to = instance.form.getInputByName("to").value;
							return Rendition.UI.iif(groupBy == "items", "select t.flagTypeName,sum(qty),t.color,'White' " +
							"from flagTypes t with (nolock)" +
							"inner join serial_line so with (nolock) on so.lastFlagStatus = t.flagTypeId " +
                            "inner join orders o with (nolock) on so.orderId = o.orderId " +
							"inner join cart c with (nolock) on so.serialId = c.serialId " +
                            "inner join users u with (nolock) on u.userId = o.userId " +
							"where showInProductionAgingReport = 1 " +
                            "and u.accountType = 0 " +
                            "and o.orderDate between '" + from + " 00:00:00.000' and '" + to + " 23:59:59.999' " +
                            Rendition.UI.iif(userId != "", " and o.userId = '" + userId + "'", "") +
							"group by t.flagTypeName,t.color", "select t.flagTypeName,count(0),t.color,'White' " +
							"from flagTypes t with (nolock)" +
							"inner join serial_order so with (nolock) on so.lastFlagStatus = t.flagTypeId " +
							"inner join orders o with (nolock) on so.orderId = o.orderId " +
                            "inner join users u with (nolock) on u.userId = o.userId " +
							"where showInProductionAgingReport = 1 " +
                            "and u.accountType = 0 " +
                            "and o.orderDate between '" + from + " 00:00:00.000' and '" + to + " 23:59:59.999' " +
                            Rendition.UI.iif(userId != ""," and o.userId = '" + userId + "' ","") +
							"group by t.flagTypeName,t.color");
						}
					});
				}
			}
		});
		instance.tabs[1] = Rendition.UI.TabBarTab({
			title: 'Tabular',
			load: function (tab, tabBar, content) {
				if (content.innerHTML == '') {
					content.style.overflow = 'hidden';
					instance.grid = Rendition.UI.Grid({
						selectionMethod: 3,
						editMode: 0,
						objectName: "productionAging" + Rendition.Commerce.user.userId,
						cellstyle: instance.itemCellStyle,
						hideNewRow: true,
						contextMenuOptions: instance.gridContextMenuOptions,
						parentNode: content,
						beforeinit: instance.beforeInit
					});
				}
			}
		});
		instance.tabbar = Rendition.UI.TabBar({
			tabs: instance.tabs,
			parentNode: instance.cutter.cutters[1],
			activeTabIndex: 0
		});
	}
	instance.gridContextMenuOptions = function (e, element) {
		var row = parseInt(element.getAttribute('row'));
		var column = parseInt(element.getAttribute('column'));
		var rDate = Rendition.UI.formatDate(instance.grid.getRecord(row, 'orderDate'),'mm/dd/yyyy');
		var userId = instance.form.getInputByName("userId").value;
		var from = instance.form.getInputByName("from").value;
		var to = instance.form.getInputByName("to").value;
		var groupBy = instance.form.getInputByName("groupBy").value;
		var optionLength = -1;
		var options = [];
		var header = instance.grid.headers[column];
		optionLength++;
		options[optionLength] = Rendition.UI.MenuOption();
		options[optionLength].text = 'Show ' + rDate;
		Rendition.UI.appendEvent('click', options[optionLength], function (e) {
			new Rendition.Commerce.Search({
				objectName: 'orders',
				criteria: [
					['orderDate', 'between', rDate + ' 00:00:00.000', rDate + ' 23:59:59.999', 'or', '1']
				],
				title: 'Orders On ' + rDate + ' - Search'
			});
		}, false);

		optionLength++;
		options[optionLength] = Rendition.UI.MenuOption();
		options[optionLength].text = 'Show ' + header.displayName.trim() + ' on ' + rDate;
		Rendition.UI.appendEvent('click', options[optionLength], function (e) {
			new Rendition.Commerce.Search({
				objectName: 'shortOrderOverview',
				criteria: [
					['orderDate', 'between', rDate + ' 00:00:00.000', rDate + ' 23:59:59.999', 'and', '1'],
					['flagTypeName', '=', header.name, '', 'and', '1']
				],
				title: 'Orders On ' + rDate + ' Flagged ' + header.name + ' - Search'
			});
		}, false);
		if (userId != "") {
			optionLength++;
			options[optionLength] = Rendition.UI.MenuOption();
			options[optionLength].text = 'Show ' + header.displayName.trim() + ' on ' + rDate + ' For ' + userId;
			Rendition.UI.appendEvent('click', options[optionLength], function (e) {
				new Rendition.Commerce.Search({
					objectName: 'shortOrderOverview',
					criteria: [
						['orderDate', 'between', rDate + ' 00:00:00.000', rDate + ' 23:59:59.999', 'and', '1'],
						['flagTypeName', '=', header.name, '', 'and', '1'],
						['userId', '=', userId, '', 'and', '1']
					],
					title: 'Orders On ' + rDate + ' Flagged ' + header.name + ' - Search'
				});
			}, false);
		}
		return options;
	}
	instance.cellStyle = function (e, grid, element, row, column, selection, data, header) {
		return;
	}
	instance.beforeInit = function () {
		instance.getDates();
		var userId = instance.form.getInputByName("userId").value;
		var from = instance.form.getInputByName("from").value;
		var to = instance.form.getInputByName("to").value;
		var groupBy = instance.form.getInputByName("groupBy").value;
		var req1 = [
			'SqlCommand',
			["if exists(select 0 from sys.views where name = 'productionAging" + Rendition.Commerce.user.userId + "') begin \
				drop view [productionAging" + Rendition.Commerce.user.userId + "] \
				end"]
		]
		var selList = [];
		var pivotList = [];
		var flags = Rendition.Commerce.flagTypes;
		for (var x = 0; flags.length > x; x++) {
			var flag = flags[x];
			if (flag.ShowInProductionAgingReport &&
		(flag.IsLineDetailFlag ||
		flag.IsLineFlag ||
		flag.IsOrderFlag ||
		flag.IsShipmentFlag
		)) {
				selList.push('sum([' + flag.Id + ']) as [' + flag.Name + ']');
				pivotList.push('[' + flag.Id + ']');
			}
		}
		/* this is ugly, there are 2 overlaping languages here, so I'm just trying to keep it narrow */
		var req2 = [
			'SqlCommand',
			[
				"create view [productionAging" + Rendition.Commerce.user.userId + "] as select \
				orderDate, \
				" + selList.join(',') + ",-1 as VerCol \
				from \
				( \
				select convert(datetime,convert(varchar(50),orderDate,101)) as orderDate, r.lastFlagStatus \
				from orders o \
				inner join " + Rendition.UI.iif(groupBy == "items", "serial_line", "serial_order") +
				" r on r.orderId = o.orderid " + Rendition.UI.iif(userId != "", " and userId = " + userId.s(), "") + " \
				) s \
				pivot (count(lastFlagStatus) for lastFlagStatus in (" + pivotList.join(',') + ")) p \
				" + Rendition.UI.iif(from != "" && to != "", "where orderDate between '" + from.s() + "' and '" + to.s() + "' ", "") + " \
				group by orderDate"
			]
		]
		instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI +
		'method1=' + JSON.stringify(req1).toURI() +
		'&method2=' + JSON.stringify(req2).toURI(),
		function (e) { }, instance, false/* sync */);
	}
	instance.getDates = function () {
		var from = instance.form.getInputByName("from").value;
		var to = instance.form.getInputByName("to").value;
		var date = new Date();
		if (from.length == 0 || !Rendition.UI.isDate(from)) {/* 30 days ago until today when blank*/
			from = Rendition.UI.formatDate(new Date(new Date().getTime() - (30 * 24 * 60 * 60 * 1000)), 'mm/dd/yyyy');
		}
		if (to.length == 0 || !Rendition.UI.isDate(to)) {
			to = Rendition.UI.formatDate(date, 'mm/dd/yyyy');
		}
		instance.form.getInputByName("from").value = from;
		instance.form.getInputByName("to").value = to;
		return { from: from, to: to }
	}
	instance.init();
}