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
* Aging report.
* @constructor
* @name Rendition.Commerce.Aging
*/
Rendition.Commerce.Aging = function (args) {
	var instance = {}
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
			title: 'Aging'
		});
		args.parentNode = instance.dialog.content;
	}
	instance.init = function () {
		instance.cutter = Rendition.UI.CutterBar({
			position: 200,
			autoResize: false,
			parentNode: args.parentNode
		});
		instance.grid = Rendition.UI.Grid({
			selectionMethod: 3,
			editMode: 0,
			objectName: "shortUserList",
            suffix:' where userId in (select userId from orders group by userId) ',
			parentNode: instance.cutter.cutters[0],
			selectionchange: function (e, grid, element, row, column, selection, data, header) {
				var u = [];
				var l = selection.length;
				for (var x = 0; l > x; x++) {
					u.push(selection[x].data()[0]); /* get all the selected users */
				}
				instance.initAccountData(u);
				return;
			}
		});
		instance.initAccountData([]);
	}
	instance.initAccountData = function (userArray) {
		instance.tabs = [];
		instance.tabs[0] = Rendition.UI.TabBarTab({
			title: 'Status Pie',
			load: function (tab, tabBar, content) {
				if (content.innerHTML === '') {
					content.style.overflow = 'hidden';
					var title = 'Accounts Overview';
					if (userArray.length === 1) {
						title = "Account " + userArray[0]
					} else if (userArray.length > 1) {
						title = "Multiple Accounts"
					}
					Rendition.UI.Chart({
                        options: { nodeLabelFormat: 'C' },
						parentNode: content,
						title: title,
						type: 'PieChart',
						chart: function (dateChart, chartArguments, chartOptions) {
							return "select '< ' + convert(varchar(50),dayGroup) as status,sum(amount), " +
							" case  when dayGroup = 0 then 'DarkGreen' " +
							" when dayGroup = 5 then 'Green' " +
							" when dayGroup = 15 then 'GreenYellow' " +
							" when dayGroup = 30 then 'Gold' " +
							" when dayGroup = 45 then 'Orange' " +
							" when dayGroup = 60 then 'Red' " +
							" when dayGroup = 120 then 'Black' " +
                            " else 'Gray' end as bcolor, " +
							" 'White' as fcolor, dayGroup  from agingTable  where " +
							Rendition.UI.iif(userArray.length > 0, " userId in (" + userArray.join(',') + ") and", "") +
							" not dayGroup is null group by dayGroup ";
						}
					});
				}
			}
		});
		instance.tabs[1] = Rendition.UI.TabBarTab({
			title: 'Summary',
			load: function (tab, tabBar, content) {
				if (content.innerHTML === '') {
					content.style.overflow = 'hidden';
					instance.grid = Rendition.UI.Grid({
						selectionMethod: 3,
						editMode: 0,
						objectName: 'aging',
						cellstyle: instance.itemCellStyle,
						contextMenuOptions: Rendition.Commerce.ComContext,
						parentNode: content,
						suffix: function () {
							return Rendition.UI.iif(userArray.length > 0, "where userId in (" + userArray.join(',') + ")", "");
						}
					});
				}
			}
		});
		instance.tabs[2] = Rendition.UI.TabBarTab({
			title: 'Detail',
			load: function (tab, tabBar, content) {
				if (content.innerHTML === '') {
					content.style.overflow = 'hidden';
					instance.grid = Rendition.UI.Grid({
						selectionMethod: 3,
						editMode: 0,
						objectName: 'orderPayments',
						cellstyle: instance.itemCellStyle,
						contextMenuOptions: Rendition.Commerce.ComContext,
						parentNode: content,
						suffix: function () {
							return Rendition.UI.iif(userArray.length > 0, "where userId in (" + userArray.join(',') + ")", "");
						},
						ignoreTableChanges: true
					});
				}
			}
		});
		/* kill any existing children */
		instance.cutter.cutters[1].innerHTML = '';
		instance.tabbar = Rendition.UI.TabBar({
			tabs: instance.tabs,
			parentNode: instance.cutter.cutters[1],
			activeTabIndex: 0
		});
	}
	instance.cellStyle = function (e, grid, element, row, column, selection, data, header) {
		return;
	}
	instance.init();
}