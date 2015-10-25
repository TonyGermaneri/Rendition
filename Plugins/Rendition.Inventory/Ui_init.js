var RenditionInventoryInit = function () {
    for (var x = 0; Rendition.UI.defaultPanelItems.length > x; x++) {
        if (Rendition.UI.defaultPanelItems[x].text === "Settings And Stats") {
            Rendition.UI.defaultPanelItems.splice(x, 0,
        {
            text: 'Aging And Inventory',
            header: true
        },
        {
            text: 'Aging',
            message: 'See who\'s late paying you and who\'s not.',
            src: '/admin/img/icons/user_suit.png',
            proc: function () {
                Rendition.Commerce.Aging();
            }
        },
        {
            text: 'Production Aging',
            message: 'Check how your production line is running.',
            src: '/admin/img/icons/chart_pie.png',
            proc: function () {
                Rendition.Commerce.ProductionAging();
            }
        },
        {
            text: 'Production Picklist',
            message: 'Check how your production line is running.',
            src: '/admin/img/icons/calendar_edit.png',
            proc: function () {
                Rendition.Commerce.ProductionPicklist();
            }
        },
        {
            text: 'Sales Journal',
            message: 'See the total value of the orders you sold.',
            src: '/admin/img/icons/coins.png',
            proc: function () {
                Rendition.Commerce.SalesJournal();
            }
        },
        {
            text: 'Inventory',
            message: 'Adjust inventory levels and generate purchase orders.',
            src: '/admin/img/icons/chart.gif',
            proc: function () {
                Rendition.Commerce.InventoryEditor();
            }
        });
            break; //prevent endless loop
        }
    }
    Rendition.Commerce.accountEditorStatsTabs.push(function (instance, obj) {
        return Rendition.UI.TabBarTab({
            title: Rendition.Localization['RenditionInventory_Status_Aging_Pie'].Title,
            load: function (tab, tabBar, content) {
                new Rendition.UI.Chart({
                    parentNode: content,
                    title: Rendition.Localization['RenditionInventory_Order_Statuses'].Title,
                    type: 'PieChart',
                    chart: function (dateChart, chartArguments, chartOptions) {
                        return "select t.flagTypeName as [Status],count(0) as [Count] " +
				    "from flagTypes t with (nolock)" +
				    "inner join serial_order so with (nolock) on so.lastFlagStatus = t.flagTypeId " +
				    "inner join orders o with (nolock) on so.orderId = o.orderId " +
				    "where showInProductionAgingReport = 1 and o.userId = " + instance.userId + " " +
				    "group by t.flagTypeName,t.color";
                    }
                });
            }
        });
    });
    Rendition.Commerce.accountEditorStatsTabs.push(function (instance, obj) {
        return Rendition.UI.TabBarTab({
            title: Rendition.Localization['RenditionInventory_Status_Aging_Table'].Title,
            load: function (tab, tabBar, content) {
                instance.grid = Rendition.UI.Grid({
                    selectionMethod: 3,
                    editMode: 0,
                    objectName: "productionAging_u" + instance.userId,
                    cellstyle: instance.itemCellStyle,
                    hideNewRow: true,
                    contextMenuOptions: instance.gridContextMenuOptions,
                    parentNode: content,
                    beforeinit: function () {
                        Rendition.Commerce.createProductionAgingQuery(instance.userId, "productionAging_u" + instance.userId);
                        return;
                    }
                });
            }
        });
    });
    Rendition.Commerce.accountEditorStatsTabs.push(function (instance, obj) {
        return Rendition.UI.TabBarTab({
            title: Rendition.Localization['RenditionInventory_Aging_Pie'].Title,
            load: function (tab, tabBar, content) {
                content.innerHTML = '';
                new Rendition.UI.Chart({
                    parentNode: content,
                    title: Rendition.Localization['RenditionInventory_Order_Statuses'].Title,
                    type: 'PieChart',
                    chart: function (dateChart, chartArguments, chartOptions) {
                        return "select cast(dayGroup as varchar(50)) + ' < Days',sum(amount) as Status,case when CHARINDEX('0',dayGroup) = 1 then " +
				    " 	'LimeGreen' " +
				    " when CHARINDEX('5',dayGroup) = 1 then " +
				    " 	'YellowGreen' " +
				    " when CHARINDEX('120',dayGroup) = 1 then " +
				    " 	'Red' " +
				    " when CHARINDEX('15',dayGroup) = 1 then " +
				    " 	'Olive' " +
				    " when CHARINDEX('30',dayGroup) = 1 then " +
				    " 	'DarkOrange' " +
				    " when CHARINDEX('30',dayGroup) = 1 then " +
				    " 	'DarkOrange' " +
				    " when CHARINDEX('45',dayGroup) = 1 then " +
				    " 	'Gold' " +
				    " when CHARINDEX('60',dayGroup) = 1 then " +
				    " 	'OrangeRed' " +
				    " else " +
				    "	'Black' " +
				    " end as Color, 'white' " +
				    " from agingTable " +
                    " where userId = '" + instance.userId + "' and not dayGroup is null group by dayGroup ";
                    }
                });
            }
        });
    });
    Rendition.Commerce.accountEditorStatsTabs.push(function (instance, obj) {
        return Rendition.UI.TabBarTab({
            title: Rendition.Localization['RenditionInventory_Aging_Table'].Title,
            load: function (tab, tabBar, content) {
                instance.paymentAging = Rendition.UI.Grid({
                    selectionMethod: 3,
                    editMode: 0,
                    objectName: 'aging',
                    contextMenuOptions: Rendition.Commerce.ComContext,
                    suffix: ' where userId = \'' + instance.userId + '\'',
                    parentNode: content
                });
            }
        });
    });
}
window.document.addEventListener('DOMContentLoaded', RenditionInventoryInit, false);