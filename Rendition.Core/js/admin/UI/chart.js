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
* Creates a DHTML based chart with from and to date selectors.
* See <link xlink:href="Rendition.UI.Chart"/> for more information.
* @constructor
* @name Rendition.UI.DateChart
* @param {Native.String} args.title The title of the chart.  This appears on the chart.
* @param {Native.String} args.type Type of chart.  Can be any one of PieChart, ColumnChart, Gauge, LineChart or function.  When a function is used the signature of the function is (chartDivElement, data)
* @param {Native.String} [args.fromDate=15 days ago] The from date.
* @param {Native.String} [args.toDate=Today] The to date.  This will override the <link xlink:href="Rendition.UI.Chart.args.next"/> parameter.
* @param {Native.String} [args.last=15] Show the last n number of days counting backwards from today.
* @param {Native.String} [args.next=0] Show the next n number of days counting forwards from today.
* @param {Native.Object} [args.options] Options for the chart.  This sets all the options of the chart a full list of chart options can be found here: https://developers.google.com/chart/.
* @param {String|Function} args.chart A string containing a SQL query that produces a chart or a function that produces a SQL query.
* @example /// Create a tic chart ///
* var foo = Rendition.UI.Dialog();
* foo.maximize();
* Rendition.UI.DateChart({
*	parentNode: foo.content,
*	title: 'Sessions/Hits',
*	type: 'TicChart',
*	chart: function (dateChart, chartArguments, chartOptions) {
*		var a = " declare @dayTo datetime = '" + chartArguments.toDate.value.s() + "' declare @dayFrom datetime = '" + chartArguments.fromDate.value.s() + "' declare @days table(days datetime);  " +
*				" declare @todate int;  declare @fromdate int;  set @todate = (DATEDIFF(D,@dayTo,GETDATE()))*-1; " +
*				" set @fromdate = (DATEDIFF(D,@dayFrom,GETDATE()))*-1;  while (@todate>=@fromdate)  begin " +
*				" insert into @days (days) values (DATEADD(dd,@todate,cast(convert(varchar(20),getDate(),1) as datetime))); " +
*				" set @todate = @todate -1;  end  " +
*				" select 'Hits',d.days,count(0)-1,'Navy','White',3,5 from  @days d " +
*				" left join visitorDetail v  with (nolock) on v.time between d.days and d.days+1 " +
*				" left join visitors i  with (nolock) on i.sessionId = v.sessionId group by d.days; " +
*				" select 'Sessions',d.days,count(0)-1,'Red','White',3,5 from  @days d " +
*				" left join visitors v  with (nolock) on v.addDate between d.days and d.days+1 group by d.days "
*		return a;
*	}
* });
*/
Rendition.UI.DateChart = function (args) {
    var instance = {}
    instance.p = args.parentNode;
    instance.cutter = Rendition.UI.CutterBar({
        parentNode: instance.p,
        orientation: 1,
        position: 72,
        autoResize: false
    });
    /**
    * The unique id of this instance.
    * @name DateChart.id
    * @memberOf Rendition.UI.DateChart.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.id = args.id !== undefined ? args.id : 'uid_' + Rendition.UI.createId();
    /**
    * The type of object.  returns 'RenditionDateChart'
    * @name DateChart.type
    * @memberOf Rendition.UI.DateChart.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.type = 'RenditionDateChart';
    var f = new Date();
    var t = new Date();
    var nextDays = args.next || 0;
    var lastDays = args.last || 15;
    lastDays = lastDays * -1; /* invert last */
    if (Math.abs(lastDays) > 0) {
        f.setDate(f.getDate() + lastDays);
    }
    if (Math.abs(nextDays) > 0) {
        t.setDate(f.getDate() + nextDays);
    }
    var fromDate = args.fromDate || Rendition.UI.formatDate(f, 'mm/dd/yyyy');
    var toDate = args.toDate || Rendition.UI.formatDate(t, 'mm/dd/yyyy');
    instance.fromDate = document.createElement('input');
    instance.fromDate.value = fromDate;
    instance.fromDate.style.width = '100px';
    instance.toDate = document.createElement('input');
    instance.toDate.value = toDate;
    instance.toDate.style.width = '100px';
    instance.refreshButton = document.createElement('button');
    instance.refreshButton.style.margin = '4px';
    instance.refreshButton.innerHTML = 'Refresh';
    instance.refreshButton.onclick = function () {
        instance.chart.refresh();
        return;
    }
    instance.printButton = document.createElement('button');
    instance.printButton.style.margin = '4px';
    instance.printButton.innerHTML = 'Print';
    instance.printButton.onclick = function () {
        instance.chart.refresh();
        var co = JSON.parse(instance.chart.chartObject(false));
        co[1][1].height = 3300;
        co[1][1].width = 2550;
        var req = [
			'Print',
			[
				'pdfs\\reference_chart.pdf', { chartObject: JSON.stringify(co) }
			]
		]
        co[1][1].fill.endColor = 'White'; /* save some ink */
        instance.printDialog = Rendition.UI.IFrameDialog({
            title: args.title || '',
            src: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI()
        });
        return;
    }
    instance.controls = document.createElement('div');
    instance.groupBox = Rendition.UI.GroupBox({
        title: 'Date Range',
        childNodes: [instance.controls],
        expanded: true
    });
    instance.controls.appendChild(Rendition.UI.txt(' From '));
    instance.controls.appendChild(instance.fromDate);
    instance.controls.appendChild(Rendition.UI.txt(' To '));
    instance.controls.appendChild(instance.toDate);
    instance.controls.appendChild(instance.refreshButton);
    // no print button until it works
    //instance.controls.appendChild(instance.printButton);
    instance.groupBox.appendTo(instance.cutter.cutters[0]);
    instance.chart = Rendition.UI.Chart({
        title: args.title,
        type: args.type,
        chart: args.chart,
        options: args.options,
        parentNode: instance.cutter.cutters[1],
        fromDate: instance.fromDate,
        toDate: instance.toDate
    });
    return instance;
}
/**
* Creates a DHTML based chart.
* See https://developers.google.com/chart/ for more information.
* @constructor
* @name Rendition.UI.Chart
* @param {Native.String} args.type Type of chart.  Can be any one of PieChart, ColumnChart, Gauge, LineChart or function.  When a function is used the signature of the function is (chartDivElement, data)
* @param {Native.Object} [args.options] Options for the chart.  This sets all the options of the chart a full list of chart options can be found here: https://developers.google.com/chart/.
* @param {String|Function} args.chart A string containing a SQL query that produces a chart or a function that produces a SQL query.
* @example /// Create a line chart ///
* var foo = Rendition.UI.Dialog();
* foo.maximize();
* Rendition.UI.Chart({
*	parentNode: foo.content,
*	title: 'Sessions/Hits',
*	type: 'LineChart',
*	chart: function (dateChart, chartArguments, chartOptions) {
*                            var a =
*                            " declare @dayTo datetime = getdate();" +
*                            " declare @dayFrom datetime = dateadd(mm,-1,getdate());" +
*                            " declare @days table(days datetime);declare @todate int;declare @fromdate int;" +
*                            " set @todate = (DATEDIFF(D,@dayTo,GETDATE()))*-1;" +
*                            " set @fromdate = (DATEDIFF(D,@dayFrom,GETDATE()))*-1;" +
*                            " while (@todate>=@fromdate)  begin  insert into @days (days) " + 
*                            " values (DATEADD(dd,@todate,cast(convert(varchar(20),getDate(),1) as datetime)));" + 
*                            " set @todate = @todate -1;  end " +
*                            " select f.days as [Date],f.Count as [Hits],g.Count as [Visitors] from ( " +
*                            "	 select d.days as days,count(0)-1 as [Count] from  @days d  " +
*                            "	 left join visitorDetail v  with (nolock) on v.time between d.days and d.days+1  " +
*                            "	 left join visitors i  with (nolock) on i.sessionId = v.sessionId group by d.days " +
*                            " ) f " +
*                            " inner join ( " +
*                            " select d.days,count(0) as [Count] from  @days d  " +
*                            "	 left join visitors v  with (nolock) on v.addDate between d.days and d.days+1 group by d.days " +
*                            " ) g on f.days = g.days order by g.days ";
*                            return a;
*	}
* });
*/
Rendition.UI.Chart = function (args) {
    var instance = {}
    instance.parentNode = args.parentNode;
    /**
    * unique id of this object.  Assigned automatcilly in this reg format /uid_UUID/
    * @name chart.id
    * @memberOf Rendition.UI.Chart.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.id = args.id !== undefined ? args.id : 'uid_' + Rendition.UI.createId();
    /**
    * The type of object.  returns 'RenditionChart'
    * @name chart.type
    * @memberOf Rendition.UI.Chart.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.type = 'RenditionChart';
    instance.loadingMessage = 'Loading...';
    instance.version = 0;
    instance.index = Rendition.UI.Charts.length;
    Rendition.UI.Charts.push(instance);
    /**
    * Executes event subscriptions.
    * @function
    * @name chart.executeEvents
    * @memberOf Rendition.UI.Chart.prototype
    * @private
    * @returns {Native.Boolean} false if cancel default was called.
    * @param {Native.Array} events to execute.
    * @param {Native.Object} e The DOM event object.
    * @param {Native.DHTMLElement} element the related DHTML element.
    * @param {Native.Array} evntArg The arguments to add to the event signature.
    */
    instance.executeEvents = function (events, e, element, arguments) {
        var fLength = events.length;
        if (fLength < 1) { return false; }
        if (arguments === undefined) { arguments = []; }
        instance.cancelDefault = false;
        arguments.unshift(e, instance, element);
        for (var x = 0; fLength > x; x++) {
            events[x].apply(this, arguments);
        }
        return instance.cancelDefault;
    }
    /**
    * Prevent the default event from occuring.  For use within an event handler.
    * @function
    * @name chart.preventDefault
    * @memberOf Rendition.UI.Chart.prototype
    * @type Native.undefined
    * @public
    */
    instance.preventDefault = function () {
        instance.cancelDefault = true;
    }
    /**
    * Attach a procedure to an event.
    * @function
    * @name chart.addEventListener
    * @memberOf Rendition.UI.Chart.prototype
    * @type Native.undefined
    * @param {Native.String} type The type of event to subscribe to.
    * @param {Native.Function} proc The function to call when the event is fired.
    * @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
    * @public
    */
    instance.addEventListener = function (type, proc, capture) {
        if (instance.events[type]) {
            if (instance.events[type].indexOf(proc) == -1) {
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
    * @name chart.removeEventListener
    * @memberOf Rendition.UI.Chart.prototype
    * @type Native.undefined
    * @param {Native.String} type The type of event to subscribe to.
    * @param {Native.Function} proc The function to call when the event is fired.
    * @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
    * @public
    */
    instance.removeEventListener = function (type, proc, capture) {
        var evts = instance.events[type];
        for (var x = 0; evts.length > x; x++) {
            if (evts[x] == proc) {
                evts.splice(x, 1);
            }
        }
        return null;
    }
    /**
    * Used internally to add events used in the arugments of this instance.
    * @function
    * @name chart.addInitalEvents
    * @memberOf Rendition.UI.Chart.prototype
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
    instance.events = {
        /**
        * Occurs when the image is resized.
        * @event
        * @name chart.onresize
        * @memberOf Rendition.UI.Chart.prototype
        * @public
        * @param {Native.Object} e Browser event object.
        * @param {Native.Object} chart The chart instance firing the event.
        */
        resize: instance.addInitalEvents(args.resize)
    }
    /**
    * Used internally to fire an event procedure.
    * @function
    * @name chart.eventlisteners_resize
    * @memberOf Rendition.UI.Chart.prototype
    * @type Native.Boolean
    * @param {Native.Object} e The event object.
    * @param {Native.DHTMLElement} obj The element related to this event.
    * @private
    * @returns {Native.Boolean} If true the preventDefault function was not run.
    */
    instance.eventlisteners_resize = function (e) {
        if (instance.executeEvents(instance.events.resize, e, this)) { return false }
        return true;
    }
    instance.initImage = function () {
        /* show loading message over parent */
        instance.parentNode.appendChild(instance.loadingDiv);
        var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + instance.chartObject(true).toURI(), function (e) {
            var a = JSON.parse(e.responseText);
            a = a.method1;
            if (a.error !== undefined) {
                alert(a.message);
            } else {
                var cf = a.GetGoogleChartQuery;
                if (cf.error !== 0) {
                    instance.parentNode.removeChild(instance.loadingDiv);
                    alert(cf.message);
                } else {
                    var d = a.GetGoogleChartQuery.data;
                    var l = d.rows.length;
                    if (l === 0) {
                        instance.loadingDiv.innerHTML = "This chart contains no data";
                        return;
                    }
                    var c = d.rows[0].c.length;
                    for (var x = 0; l > x; x++) {
                        for (var y = 0; c > y; y++) {
                            if (typeof d.rows[x].c[y].v === 'string') {
                                if (d.rows[x].c[y].v.substring(0, 5) === "\/Date") {
                                    var dateBigInt = eval(d.rows[x].c[y].v.replace('-0', '-').replace(/\/Date\(([^\)]+)\)\//g, "$1"));
                                    d.rows[x].c[y].v = new Date(dateBigInt);
                                }
                            }
                        }
                    }
                    instance.createGoogleChart(cf);
                }
            }
            instance.parentNode.removeChild(instance.loadingDiv);
        }, instance);
    }
    instance.createGoogleChart = function (e) {
        if (instance.chartImage) {
            if (instance.chartImage.parentNode) {
                instance.chartImage.parentNode.removeChild(instance.chartImage);
            }
        }
        instance.chartImage = document.createElement('div');
        instance.parentNode.appendChild(instance.chartImage);
        instance.resize();
        var data = instance.currentChartData = new google.visualization.DataTable(e.data);
        if (typeof args.type === 'function') {
            instance.googleChart = args.type.apply(instance, [instance.chartImage, data]);
        } else {
            if (args.type === 'PieChart') {
                instance.googleChart = new google.visualization.PieChart(instance.chartImage);
            } else if (args.type === 'ColumnChart') {
                instance.googleChart = new google.visualization.ColumnChart(instance.chartImage);
            } else if (args.type === 'Gauge') {
                instance.googleChart = new google.visualization.Gauge(instance.chartImage);
            } else if (args.type === 'LineChart' || args.type === 'TicChart') {
                instance.googleChart = new google.visualization.LineChart(instance.chartImage);
            }
            instance.googleChart.draw(instance.currentChartData, instance.chartOptions);
        }
    }
    /**
    * Initializes the chart.
    * @function
    * @name chart.init
    * @memberOf Rendition.UI.Chart.prototype
    * @public
    * @returns {Native.Object} <link xlink:href="Rendition.UI.Chart"/>.
    */
    instance.init = function () {
        Rendition.UI.wireupResizeEvents(instance.resize, instance.parentNode);
        //create loading div
        instance.loadingDiv = document.createElement('div');
        instance.loadingDiv.innerHTML = instance.loadingMessage;
        instance.loadingDiv.style.backgroundColor = '#CCC';
        instance.loadingDiv.style.color = '#000';
        instance.loadingDiv.style.opacity = '.8';
        instance.loadingDiv.style.position = 'absolute';
        instance.loadingDiv.style.padding = '20px 0 0 20px';
        instance.loadingDiv.style.fontSize = '27px';
        instance.loadingDiv.style.fontFamily = 'Trebuchet MS, Arial, Helvetica, Sans-serif';
        instance.loadingDiv.style.top = '0';
        instance.loadingDiv.style.left = '0';
        //allow the parent to grow a bit before we get the inital size
        setTimeout(function () {
            var h = instance.parentNode.offsetHeight;
            var w = instance.parentNode.offsetWidth;
            instance.loadingDiv.style.height = h + 'px';
            instance.loadingDiv.style.height = w + 'px';
        }, 275);
        //refresh chart
        instance.initImage();
        return instance;
    }
    /**
    * Initializes the chart.
    * @function
    * @name chart.chartObject
    * @memberOf Rendition.UI.Chart.prototype
    * @param {Native.Boolean} binaryOutput Selects if the chart will 
    * output to the HTTP client (true) or return a Bitmap Image (false). Note: Bitmap Image mode is never used in a browser, only in PDFs.
    * @public
    * @returns {Native.String} creates the JSON object the C# server componet reads from.
    */
    instance.chartObject = function (binaryOutput) {
        var h = instance.parentNode.offsetHeight;
        var w = instance.parentNode.offsetWidth;
        if (instance.parentNode.parentObject) {
            h = instance.parentNode.parentObject.contentRect.h;
            w = instance.parentNode.parentObject.contentRect.w;
        }
        if (h == 0) {
            h = 1;
        }
        if (w == 0) {
            w = 1;
        }
        var p = {
            title: args.title || '',
            is3D: false,
            chartArea: {
                top: 50,
                left: 50,
                width: w - 175
            },
            titleTextStyle: {
                color: 'black',
                fontName: 'Trebuchet MS',
                fontSize: 24
            },
            fontName: 'Trebuchet MS',
            fontSize: 12
        }
        $.extend(true, p, args.options);
        instance.chartOptions = p;
        if (typeof args.chart == 'string') {
            instance.chart = String(args.chart);
        } else if (typeof args.chart == 'function') {
            instance.chart = args.chart.apply(instance, [instance, args, p]);
        }
        return JSON.stringify([
			'GetGoogleChartQuery',
			[args.type, instance.chart]
		]);
    }
    /**
    * Refresh the chart data and download the new chart.
    * @function
    * @name chart.refresh
    * @memberOf Rendition.UI.Chart.prototype
    * @public
    * @returns {Native.Object} <link xlink:href="Rendition.UI.Chart"/>.
    */
    instance.refresh = function () {
        instance.initImage();
        return instance;
    }
    /**
    * Raises the resize event.
    * @method
    * @name chart.resize
    * @memberOf Rendition.UI.Chart.prototype
    * @public
    */
    instance.resize = function () {
        // 100ms delay required
        setTimeout(function () {
            var h = instance.parentNode.offsetHeight;
            var w = instance.parentNode.offsetWidth;
            instance.loadingDiv.style.height = h + 'px';
            instance.loadingDiv.style.width = w + 'px';
            if (instance.chartImage) {
                instance.chartImage.style.height = h + 'px';
                instance.chartImage.style.width = w + 'px';
                instance.chartOptions.height = h;
                instance.chartOptions.width = w;
                instance.chartOptions.chartArea.width = w - 175
                if (instance.currentChartData) {
                    instance.googleChart.draw(instance.currentChartData, instance.chartOptions);
                }
            }
        }, 275);
        return;
    }
    instance.init();
    return instance;
}