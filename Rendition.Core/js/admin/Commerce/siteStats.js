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
* Site stats.
* @constructor
* @name Rendition.Commerce.SiteStats
*/
Rendition.Commerce.SiteStats = function (args) {
    var instance = {}
    instance.browsers = [
                    ['%MSIE 5.0%', 'MSIE 5', 'Aqua'],
                    ['%MSIE 5.5%', 'MSIE 5.5', 'CadetBlue'],
                    ['%MSIE 6%', 'MSIE 6', 'Blue'],
                    ['%MSIE 7%', 'MSIE 7', 'CornflowerBlue'],
                    ['%MSIE 8%', 'MSIE 8', 'LightBlue'],
                    ['%MSIE 9%', 'MSIE 9', 'LightSkyBlue'],
                    ['%MSIE 10%', 'MSIE 10', 'LightSteelBlue'],
                    ['%MSIE 11%', 'MSIE 11', 'MediumSlateBlue'],
                    ['%MSIE 12%', 'MSIE 12', 'MidnightBlue'],
                    ['%BlackBerry%', 'BlackBerry', 'Purple'],
                    ['%iPhone%', 'iPhone', 'AntiqueWhite'],
                    ['%iPad%', 'iPad', 'MintCream'],
                    ['%Chrome%', 'Chrome', 'ForestGreen'],
                    ['%Android%', 'Android', 'Green'],
                    ['%Safari%', 'Safari', 'Ivory'],
                    ['%Opera%', 'Opera', 'Brown'],
                    ['%Firefox%', 'Firefox', 'Red']
                ];
    if (args === undefined) { args = {} }
    instance.tabOrder = {
        visitors: 0,
        sessions: 1
    }
    instance.resizeDialog = function () {
        setTimeout(function () {
            if (instance.browsersDiv) {
                instance.browsersDiv.style.width = (instance.statCutter.cutters[1].offsetWidth - 16) + "px";
                instance.hitsTicDiv.style.width = (instance.statCutter.cutters[1].offsetWidth - 16) + "px";
                instance.ordersTicDiv.style.width = (instance.statCutter.cutters[1].offsetWidth - 16) + "px";
                instance.visitorsGasGauge.style.width = (instance.statCutter.cutters[1].offsetWidth - 16) + "px";
                /*
                instance.hitsTicChart.resize();
                instance.browserPieChart.resize();
                instance.ordersTicChart.resize();
                */
            }
        }, 100);
    }
    if (args.parentNode === undefined) {
        instance.dialog = Rendition.UI.Dialog({
            rect: {
                x: Rendition.UI.dialogPosition.x,
                y: Rendition.UI.dialogPosition.y,
                h: 600,
                w: 900
            },
            title: Rendition.Localization['SiteStats_Site_Statistics'].Title,
            resize: instance.resizeDialog
        });
        args.parentNode = instance.dialog.content;
    }

    instance.init = function () {
        instance.tabs = [];
        instance.tabs[instance.tabOrder.visitors] = Rendition.UI.TabBarTab({
            title: 'Main',
            load: function (tab, tabBar, content) {
                if (content.innerHTML == '') {
                    instance.statCutter = Rendition.UI.CutterBar({
                        parentNode: content,
                        autoResize: false,
                        id: 'sessionViewerCutter1',
                        orientation: 1,
                        position: 35
                    });
                    instance.statCutter.cutters[1].style.overflow = 'scroll';
                    var f = new Date();
                    var t = new Date();
                    f.setDate(f.getDate() - 30); /* default to from 30 days ago  */
                    instance.dateFrom = document.createElement('input');
                    instance.dateTo = document.createElement('input');
                    var ptfrom = Rendition.UI.pairtable({ rows: [[document.createTextNode('From'), instance.dateFrom]] });
                    ptfrom.table.style.cssFloat = 'left';
                    var ptto = Rendition.UI.pairtable({ rows: [[document.createTextNode('To'), instance.dateTo]] });
                    ptto.table.style.cssFloat = 'left';
                    var refreshButton = document.createElement('button');
                    refreshButton.innerHTML = 'Refresh';
                    refreshButton.style.cssFloat = 'left';
                    refreshButton.style.margin = '4px';
                    refreshButton.onclick = function () {
                        instance.hitsTicChart.refresh();
                        instance.browserPieChart.refresh();
                        instance.ordersTicChart.refresh();
                    }
                    instance.dateFrom.value = Rendition.UI.formatDate(f, 'mm/dd/yyyy');
                    instance.dateTo.value = Rendition.UI.formatDate(t, 'mm/dd/yyyy');
                    instance.statCutter.cutters[0].appendChild(ptfrom.table);
                    instance.statCutter.cutters[0].appendChild(ptto.table);
                    instance.statCutter.cutters[0].appendChild(refreshButton);
                    instance.hitsTicDiv = document.createElement('div');
                    instance.browsersDiv = document.createElement('div');
                    instance.visitorsGasGauge = document.createElement('div');
                    instance.visitorsGasGauge.style.height = "200px";
                    instance.visitorsGasGauge.style.top = "0px";
                    instance.visitorsGasGauge.style.backgroundColor = 'white';
                    instance.statCutter.cutters[1].appendChild(instance.visitorsGasGauge);
                    instance.ordersTicDiv = document.createElement('div');
                    instance.hitsTicDiv.style.height = "350px";
                    instance.hitsTicDiv.style.position = "absolute";
                    instance.hitsTicDiv.style.top = instance.visitorsGasGauge.offsetHeight + 'px';
                    instance.statCutter.cutters[1].appendChild(instance.hitsTicDiv);
                    instance.browsersDiv.style.height = "350px";
                    instance.browsersDiv.style.position = "absolute";
                    instance.browsersDiv.style.top = (instance.visitorsGasGauge.offsetHeight + instance.hitsTicDiv.offsetHeight) + 'px';
                    instance.statCutter.cutters[1].appendChild(instance.browsersDiv);
                    instance.ordersTicDiv.style.height = "350px";
                    instance.ordersTicDiv.style.position = "absolute";
                    instance.visitorsGasGauge.style.position = "absolute";
                    instance.ordersTicDiv.style.top = (instance.visitorsGasGauge.offsetHeight + instance.hitsTicDiv.offsetHeight + instance.hitsTicDiv.offsetHeight) + 'px';
                    instance.statCutter.cutters[1].appendChild(instance.ordersTicDiv);
                    Rendition.UI.DatePicker({ input: instance.dateFrom });
                    Rendition.UI.DatePicker({ input: instance.dateTo });
                    instance.visitorsGasGaugeChart = Rendition.UI.Chart({
                        parentNode: instance.visitorsGasGauge,
                        title: 'Sessions in the last hour',
                        type: 'Gauge',
                        chart: function (dateChart, chartArguments, chartOptions) {
                            return " select 'Hits/Day' as [Label], count(0) as [Count] from visitorDetail v with (nolock) " +
" left join visitors i  with (nolock) on i.sessionId = v.sessionId  " +
" where v.time between DATEADD(HH,-24,getdate()) and GETDATE() " +
" union all    " +
" select 'Sessions/Day' as [Label], count(0) as [Count] from  visitors v  with (nolock)  " +
" where v.addDate between DATEADD(HH,-24,getdate()) and GETDATE() " +
" union all " +
" select 'Orders/Day' as [Label], count(0) as [Count] from orders o  with (nolock) " +
" where o.orderDate between DATEADD(HH,-24,getdate()) and GETDATE() and o.canceled = 0 " +
" union all " +
" select 'ATC/Day' as [Label], count(0) as [Count] from cart c  with (nolock) " +
" where c.addTime between DATEADD(HH,-24,getdate()) and GETDATE() ";
                        }
                    });
                    instance.ordersTicChart = Rendition.UI.Chart({
                        parentNode: instance.ordersTicDiv,
                        title: Rendition.Localization['SiteStats_Orders'].Title,
                        type: 'TicChart',
                        chart: function (dateChart, chartArguments, chartOptions) {
                            var a =
                    " declare @dayTo datetime = '" + instance.dateTo.value +
                    "' declare @dayFrom datetime = '" + instance.dateFrom.value + "' declare @days table(days datetime);  " +
                    " declare @todate int;  declare @fromdate int;  set @todate = (DATEDIFF(D,@dayTo,GETDATE()))*-1; " +
                    " set @fromdate = (DATEDIFF(D,@dayFrom,GETDATE()))*-1;  while (@todate>=@fromdate)  begin " +
                    " insert into @days (days) values (DATEADD(dd,@todate,cast(convert(varchar(20),getDate(),1) as datetime))); " +
                    " set @todate = @todate -1;  end  " +
                    " select d.days,count(0)-1 as [Count] from  @days d " +
                    " left join orders o on o.canceled = 0 and o.orderDate between d.days and d.days+1 group by d.days order by d.days; ";
                            return a;
                        }
                    });
                    instance.hitsTicChart = Rendition.UI.Chart({
                        parentNode: instance.hitsTicDiv,
                        title: Rendition.Localization['SiteStats_SessionsHits'].Title,
                        type: 'TicChart',
                        chart: function (dateChart, chartArguments, chartOptions) {
                            var a =
                            " declare @dayTo datetime = '" + instance.dateTo.value + "';" +
                            " declare @dayFrom datetime = '" + instance.dateFrom.value + "';" +
                            " declare @days table(days datetime);declare @todate int;declare @fromdate int;set @todate = (DATEDIFF(D,@dayTo,GETDATE()))*-1;set @fromdate = (DATEDIFF(D,@dayFrom,GETDATE()))*-1;while (@todate>=@fromdate)  begin  insert into @days (days)values (DATEADD(dd,@todate,cast(convert(varchar(20),getDate(),1) as datetime)));set @todate = @todate -1;  end " +
                            " select f.days as [Date],f.Count as [Hits],g.Count as [Visitors] from ( " +
                            "	 select d.days as days,count(0)-1 as [Count] from  @days d  " +
                            "	 left join visitorDetail v  with (nolock) on v.time between d.days and d.days+1  " +
                            "	 left join visitors i  with (nolock) on i.sessionId = v.sessionId group by d.days " +
                            " ) f " +
                            " inner join ( " +
                            " select d.days,count(0) as [Count] from  @days d  " +
                            "	 left join visitors v  with (nolock) on v.addDate between d.days and d.days+1 group by d.days " +
                            " ) g on f.days = g.days order by g.days ";
                            return a;
                        }
                    });
                    // this stupid thing doesn't work unless it loads late
                    setTimeout(function () {
                        instance.browserPieChart = Rendition.UI.Chart({
                            parentNode: instance.browsersDiv,
                            title: Rendition.Localization['SiteStats_Browsers'].Title,
                            type: 'PieChart',
                            options: { showLegend: true },
                            chart: function (dateChart, chartArguments, chartOptions) {
                                var a = [];
                                a.push("select browser, count(0) as [Count] from (  " +
	                                        "    select  " +
		                                    "        case  ");
                                for (var x = 0; instance.browsers.length > x; x++) {
                                    a.push(" when HTTP_USER_AGENT like '" + instance.browsers[x][0] + "' " +
                                                        " then '" + instance.browsers[x][1] + "' ");
                                }
                                a.push("else 'Other' end as browser, " +
                                            "       case ");
                                for (var x = 0; instance.browsers.length > x; x++) {
                                    a.push(" when HTTP_USER_AGENT like '" + instance.browsers[x][0] + "' " +
                                                        " then '" + instance.browsers[x][2] + "' ");
                                }
                                a.push("else 'Other' end as browser_color " +
	                                        "    from visitors v with (nolock) " +
	                                        "    where v.addDate between '" + instance.dateFrom.value + "' " +
                                            "    and '" + instance.dateTo.value + "' " +
	                                        "    and not remote_addr like '192.168.0.%' " +
	                                        "    and not HTTP_USER_AGENT = 'INTERNAL_SESSION' " +
                                            ") v where not browser = 'Other' group by browser,browser_color;");
                                return a.join('');
                            }
                        });
                    }, 100);
                }
            }
        });
        instance.tabs[instance.tabOrder.sessions] = Rendition.Commerce.sessionBrowserTab();
        instance.tabbar = Rendition.UI.TabBar({
            tabs: instance.tabs,
            parentNode: args.parentNode,
            activeTabIndex: 0,
            offsetRect: { x: 0, y: 0, h: 0, w: 0 }
        });
        instance.resizeDialog();
    }
    // hold off a sec becuase the charts have difficulty starting before the elements are resized fully.
    setTimeout(instance.init, 10);
    return instance;
}
/**
* Site stats tab.
* @constructor
* @name Rendition.Commerce.sessionBrowserTab
*/
Rendition.Commerce.sessionBrowserTab = function (userId, sessionId) {
    var instance = {}
    return Rendition.UI.TabBarTab({
        title: Rendition.Localization['SiteStats_Session_Browser'].Title,
        load: function (tab, tabBar, content) {
            if (content.innerHTML == '') {
                instance.cutter = Rendition.UI.CutterBar({
                    parentNode: content,
                    autoResize: false,
                    id: 'sessionViewerCutter1'
                });
                instance.cutter_0 = Rendition.UI.CutterBar({
                    parentNode: instance.cutter.cutters[0],
                    autoResize: false,
                    id: 'sessionViewerCutter2',
                    orientation: 1
                });
                instance.cutter_1 = Rendition.UI.CutterBar({
                    parentNode: instance.cutter.cutters[1],
                    autoResize: false,
                    id: 'sessionViewerCutter3',
                    orientation: 1
                });
                var _suffix = '';
                if (userId !== undefined) {
                    _suffix = 'where userId = \'' + userId + '\'';
                }
                if (sessionId !== undefined) {
                    _suffix = 'where sessionId = \'' + sessionId + '\'';
                }
                instance.visitors = Rendition.UI.Grid({
                    selectionMethod: 3,
                    objectName: 'visitors',
                    suffix: _suffix,
                    rowCountColumn: true,
                    parentNode: instance.cutter_0.cutters[1]
                });
                Rendition.UI.appendEvent('cellclick', instance.visitors, function (e, grid, element, row, column, selection, data, header) {
                    instance.cutter_0.cutters[0].innerHTML = '';
                    grid.genericEditor(row, {
                        parentNode: instance.cutter_0.cutters[0],
                        titleWidth: '75px'
                    });
                    instance.cutter_1.cutters[1].innerHTML = '';
                    instance.visitorDetail = Rendition.UI.Grid({
                        afterloadcallback: function (e, grid, JSON) {
                            instance.cutter_1.cutters[0].innerHTML = '';
                            if (grid.records > 0) {
                                grid.gotoRow(1);
                                grid.clickRow(1);
                            }
                            instance.visitorDetail.genericEditor(1, {
                                parentNode: instance.cutter_1.cutters[0],
                                titleWidth: '75px'
                            });
                        },
                        selectionMethod: 3,
                        objectName: 'visitorDetail',
                        suffix: 'where sessionId = \'' + data[0] + '\'',
                        parentNode: instance.cutter_1.cutters[1],
                        ignoreTableChanges: true
                        /* funny story here, each time the table would download a row,
                        the table would change becuase downloading a row would change the table,
                        so I had to add this option to the grid */
                    });
                    Rendition.UI.appendEvent('cellclick', instance.visitorDetail, function (e, grid, element, row, column, selection, data, header) {
                        instance.cutter_1.cutters[0].innerHTML = '';
                        grid.genericEditor(row, {
                            parentNode: instance.cutter_1.cutters[0],
                            titleWidth: '75px'
                        });
                    });
                }, false);
            }
        }
    });
}