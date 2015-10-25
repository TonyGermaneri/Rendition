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
* Inventory editor.
* @constructor
* @name Rendition.Commerce.InventoryEditor
*/
Rendition.Commerce.InventoryEditor = function (args) {
    var instance = {}
    if (args === undefined) { args = {} }
    instance.tabOrder = {
        snap: 0,
        preorders: 1,
        wip: 2,
        assignment: 3,
        consumed: 4,
        itemDetail: 5
    }
    if (args.parentNode === undefined) {
        instance.dialog = Rendition.UI.dialogWindow({
            rect: {
                x: 35,
                y: 35,
                h: 600,
                w: 680
            },
            title: 'Inventory Control'
        });
        args.parentNode = instance.dialog.content;
    }
    instance.refreshGrids = function () {
        if (instance.pre !== undefined) { instance.pre.refresh(); }
        if (instance.wip !== undefined) { instance.wip.refresh(); }
        if (instance.aloc !== undefined) { instance.aloc.refresh(); }
        if (instance.snap !== undefined) { instance.snap.refresh(); }
    }
    instance.init = function () {
        instance.tabs = [];
        var barButtons = [];
        barButtons.push({
            text: 'Refresh',
            mousedown: function (e) {
                var req1 = [
					'SqlCommand',
					[

						"declare @now datetime = getdate();\
						exec refreshItemOnHandTemp @now,'';"
					]
				]
                instance.refreshDialog = Rendition.UI.UpdateDialog({
                    title: 'Updating Inventory',
                    subTitle: 'Just a moment...',
                    message: 'Bringing Inventory View Up To Date.'
                });
                new Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI +
				'method1=' + JSON.stringify(req1).toURI(),
				function (e) {
				    instance.refreshDialog.close();
				    instance.refreshGrids();
				}, this, false/* sync */);
                return false;
            }
        });

        instance.tabs[instance.tabOrder.snap] = Rendition.UI.TabBarTab({
            title: 'At A Glance',
            load: function (tab, tabBar, content) {
                if (content.innerHTML == '') {
                    instance.cutter = Rendition.UI.CutterBar({
                        position: 200,
                        autoResize: false,
                        parentNode: content,
                        orientation: 1
                    });
                    instance.snap = Rendition.UI.Grid({
                        selectionMethod: 3,
                        objectName: "inventorySnapshot",
                        parentNode: instance.cutter.cutters[0],
                        rowCountColumn: true,
                        contextMenuOptions: Rendition.Commerce.ComContext,
                        selectionchange: function (e, grid, element, row, column, selection, data, header) {
                            if (selection.length === 0) {
                                return;
                            }
                            var itemList = [];
                            for (var x = 0; selection.length > x; x++) {
                                itemList.push(selection[x].data()[0]);
                            }
                            instance.cutter.cutters[1].innerHTML = '';
                            instance.snapChart = Rendition.UI.Chart({
                                parentNode: instance.cutter.cutters[1],
                                type: 'ColumnChart',
                                chart: function (chart, chartArguments, chartOptions) {
                                    return "select top 10 i.itemNumber, volume, prebook, wip, ats, consumed " +
                                    " from itemonhandtemp t with (nolock) " +
                                    " inner join items i on t.itemNumber = i.itemNumber " +
                                    " where i.itemnumber in ('" + itemList.join("','") + "') order by i.itemNumber ";
                                }
                            });
                        }
                    });
                    instance.snapChart = Rendition.UI.Chart({
                        parentNode: instance.cutter.cutters[1],
                        type: 'ColumnChart',
                        chart: function (chart, chartArguments, chartOptions) {
                            return "select top 10 i.itemNumber, volume, prebook, wip, ats, consumed " +
                            " from itemonhandtemp t with (nolock) " +
                            " inner join items i on t.itemNumber = i.itemNumber order by ats desc";
                        }
                    });
                }
            }
        });
        instance.tabs[instance.tabOrder.preorders] = Rendition.UI.TabBarTab({
            title: 'Prebook',
            load: function (tab, tabBar, content) {
                if (content.innerHTML == '') {
                    if (content.innerHTML == '') {
                        instance.pre = Rendition.UI.Grid({
                            selectionMethod: 3,
                            objectName: "prebook",
                            parentNode: content,
                            rowCountColumn: true,
                            contextMenuOptions: Rendition.Commerce.ComContext
                        });
                    }
                }
            }
        });
        instance.tabs[instance.tabOrder.wip] = Rendition.UI.TabBarTab({
            title: 'Work In Progress',
            load: function (tab, tabBar, content) {
                if (content.innerHTML == '') {
                    instance.wip = Rendition.UI.Grid({
                        selectionMethod: 3,
                        objectName: "workInProgress",
                        parentNode: content,
                        rowCountColumn: true,
                        contextMenuOptions: Rendition.Commerce.ComContext
                    });
                }
            }
        });
        instance.tabs[instance.tabOrder.assignment] = Rendition.UI.TabBarTab({
            title: 'Allocated Stock',
            load: function (tab, tabBar, content) {
                if (content.innerHTML == '') {
                    instance.aloc = Rendition.UI.Grid({
                        selectionMethod: 3,
                        objectName: "allocatedStock",
                        parentNode: content,
                        rowCountColumn: true,
                        contextMenuOptions: Rendition.Commerce.ComContext
                    });
                }
            }
        });
        instance.tabs[instance.tabOrder.consumed] = Rendition.UI.TabBarTab({
            title: 'Consumed Stock',
            load: function (tab, tabBar, content) {
                if (content.innerHTML == '') {
                    instance.aloc = Rendition.UI.Grid({
                        selectionMethod: 3,
                        objectName: "consumedStock",
                        parentNode: content,
                        rowCountColumn: true,
                        contextMenuOptions: Rendition.Commerce.ComContext
                    });
                }
            }
        });
        instance.tabs[instance.tabOrder.itemDetail] = Rendition.UI.TabBarTab({
            title: 'Item Detail',
            load: function (tab, tabBar, content) {
                if (content.innerHTML == '') {
                    instance.itemDetailCutter = Rendition.UI.CutterBar({
                        position: 200,
                        autoResize: false,
                        parentNode: content
                    });
                    instance.detailSelector = Rendition.UI.Grid({
                        selectionMethod: 3,
                        editMode: 0,
                        objectName: "shortItemList",
                        parentNode: instance.itemDetailCutter.cutters[0],
                        selectionchange: function (e, grid, element, row, column, selection, data, header) {
                            instance.itemDetailCutter.cutters[1].innerHTML = '';
                            var itemNumber = grid.getRecord(row, column);
                            new Rendition.UI.DateChart({
                                parentNode: instance.itemDetailCutter.cutters[1],
                                title: itemNumber,
                                type: 'TicChart',
                                chart: function (dateChart, chartArguments, chartOptions) {
                                    var a = "declare @itemnumber varchar(8000) = '" + itemNumber + "';" +
									" exec dbo.itemInventoryPlot @itemnumber,'" + chartArguments.fromDate.value.s() + "','" + chartArguments.toDate.value.s() + "'; ";
                                    return a;
                                }
                            });
                        },
                        contextMenuOptions: Rendition.Commerce.ComContext
                    });
                }
            }
        });
        instance.menuBar = Rendition.UI.menu(barButtons, args.parentNode, 'menuBar');

        instance.tabbar = Rendition.UI.TabBar({
            tabs: instance.tabs,
            parentNode: args.parentNode,
            activeTabIndex: 0,
            offsetRect: { x: 0, y: instance.menuBar.style.rect.h, h: 0, w: 0 }
        });

    }
    instance.init();
    return instance;
}