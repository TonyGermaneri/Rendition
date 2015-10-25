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
* Sales journal.
* @constructor
* @name Rendition.Commerce.SalesJournal
*/
Rendition.Commerce.SalesJournal = function (args) {
    var instance = {}
    var groupByOptions = [['date', 'Date'], ['account', 'Account'], ['dateAndAccount', 'Date And Account']];
    instance.formGroup = function () {
        return {
            name: 'SalesJournal',
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
            title: 'Sales Journal'
        });
        args.parentNode = instance.dialog.content;
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
            if (instance.grid1) {
                instance.grid1.refresh();
            }
            if (instance.grid2) {
                instance.grid2.refresh();
            }
            instance.salesChart.refresh();
        }
        instance.form = Rendition.UI.Form(instance.formGroup());
        instance.form.appendTo(instance.cutter.cutters[0]);
        instance.tabs = [];
        instance.tabs[0] = Rendition.UI.TabBarTab({
            title: 'Tic Chart',
            load: function (tab, tabBar, content) {
                content.style.overflow = 'hidden';
                instance.salesChart = Rendition.UI.Chart({
                    parentNode: content,
                    title: 'Sales',
                    type: 'TicChart',
                    chart: function (dateChart, chartArguments, chartOptions) {
                        var u = instance.form.getInputByName("userId").value;
                        var f = instance.getDates();
                        return " /* random " + Rendition.UI.rand(10000) + " */ declare @dayTo datetime = '" + f.to + "' declare @dayFrom datetime = '" + f.from + "' declare @days table(days datetime);  " +
								" declare @todate int;  declare @fromdate int;  set @todate = (DATEDIFF(D,@dayTo,GETDATE()))*-1; " +
								" set @fromdate = (DATEDIFF(D,@dayFrom,GETDATE()))*-1;  while (@todate>=@fromdate)  begin " +
								" insert into @days (days) values (DATEADD(dd,@todate,cast(convert(varchar(20),getDate(),1) as datetime))); " +
								" set @todate = @todate -1;  end  " +
                                " select g.days as Date, total as Sales, [Count] as Orders from ( " +
								" select d.days,case when sum(grandTotal) is null then 0 else sum(grandTotal) end as Total from  @days d " +
								" left join orders o on o.canceled = 0 and o.orderDate between d.days and d.days+1 and (userId = '" + u.s() + "' or '" + u.s() + "' = '') group by d.days " +
                                " ) f inner join ( " +
								" select d.days,count(0)-1 as [Count] from @days d " +
								" left join orders o on o.canceled = 0 and o.orderDate between d.days and d.days+1 and (userId = '" + u.s() + "' or '" + u.s() + "' = '') group by d.days " +
                                " ) g on f.days = g.days order by g.days";
                    }
                });
            }
        });
        instance.tabs[1] = Rendition.UI.TabBarTab({
            title: 'Tabular By Date',
            load: function (tab, tabBar, content) {
                if (content.innerHTML == '') {
                    var u = instance.form.getInputByName("userId").value;
                    content.style.overflow = 'hidden';
                    instance.grid1 = Rendition.UI.Grid({
                        selectionMethod: 3,
                        editMode: 0,
                        objectName: Rendition.UI.iif(u != "", "salesJournalByAccountAndDate", "salesJournalByDate"),
                        contextMenuOptions: instance.gridContextMenuOptions,
                        parentNode: content,
                        rowCountColumn: true,
                        suffix: function () {
                            var f = instance.getDates();
                            return " where orderDate between '" + f.from + "' and '" + f.to + "' " +
                            Rendition.UI.iif(u != "", " and (userId = '" + u.s() + "' or '" + u.s() + "' = '') ", "")
                        }
                    });
                }
            }
        });
        instance.tabs[2] = Rendition.UI.TabBarTab({
            title: 'Tabular By Date And Account',
            load: function (tab, tabBar, content) {
                if (content.innerHTML == '') {
                    var u = instance.form.getInputByName("userId").value;
                    content.style.overflow = 'hidden';
                    instance.grid2 = Rendition.UI.Grid({
                        selectionMethod: 3,
                        editMode: 0,
                        objectName: Rendition.UI.iif(u != "", "salesJournalByAccountAndDate", "salesJournalByDate"),
                        contextMenuOptions: instance.gridContextMenuOptions,
                        parentNode: content,
                        rowCountColumn: true,
                        suffix: function () {
                            var f = instance.getDates();
                            var u = instance.form.getInputByName("userId").value;
                            return " where orderDate between '" + f.from + "' and '" + f.to + "' " +
                            Rendition.UI.iif(u != "", " and (userId = '" + u.s() + "' or '" + u.s() + "' = '') ", "")
                        }
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
        if (instance.grid === undefined) { return [] }
        var row = parseInt(element.getAttribute('row'));
        var column = parseInt(element.getAttribute('column'));
        var rDate = instance.grid.getRecord(row, 'orderDate');
        var optionLength = -1;
        var options = [];
        var header = instance.grid.headers[column];
        optionLength++;
        options[optionLength] = Rendition.UI.MenuOption();
        options[optionLength].text = 'Show orders placed on ' + rDate;
        Rendition.UI.appendEvent('click', options[optionLength], function (e) {
            new Rendition.Commerce.Search({
                objectName: 'orders',
                criteria: [
					['orderDate', 'between', rDate + ' 00:00:00.000', rDate + ' 23:59:59.999', 'or', '1']
				],
                title: 'Orders Placed On ' + rDate + ' - Search'
            });
        }, false);
        return options;
    }
    instance.cellStyle = function (e, grid, element, row, column, selection, data, header) {
        return;
    }
    instance.init();
}