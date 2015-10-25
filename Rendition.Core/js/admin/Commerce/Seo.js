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
* Search Engine Optimization.
* Analyzes a local page and aggregatees information about the page.
* @constructor
* @name Rendition.Commerce.Seo
*/
Rendition.Commerce.Seo = function (args) {
    var instance = {}
    if (args === undefined) { args = {} }
    if (args.parentNode === undefined) {
        instance.dialog = Rendition.UI.Dialog({
            rect: {
                x: Rendition.UI.dialogPosition.x,
                y: Rendition.UI.dialogPosition.y,
                h: 575,
                w: 920
            },
            title: Rendition.Localization['Seo_Search_Engine_Optimization_Title'].Title
        });
        args.parentNode = instance.dialog.content;
    }
    instance.getWordCount = function (word, lowerWordArray) {
        var c = 0;
        word = word.toLowerCase();
        var l = lowerWordArray.length;
        for (var x = 0; l > x; x++) {
            if (lowerWordArray[x] == word) {
                c++;
            }
        }
        return c;
    };
    instance.init = function () {
        instance.controlCutter = Rendition.UI.CutterBar({
            position: 50,
            autoResize: false,
            parentNode: args.parentNode,
            orientation: 1
        });
        instance.iframe = document.createElement('iframe');
        instance.iframe.border = '0';
        instance.iframe.style.border = 'none';
        instance.refreshFrameLocation = function () {
            try {
                instance.location = instance.iframe.contentDocument.URL;
                if (!instance.addressHasFocus) {
                    instance.address.value = instance.location;
                }
                if (instance.dialog) {
                    instance.dialog.title(Rendition.Localization['Seo_Search_Engine_Optimization_x_Title'].Title + instance.location);
                }
            } catch (e) {
                instance.address.value = e;
            } finally {
                if (instance.iframe.contentDocument !== null) {
                    setTimeout(instance.refreshFrameLocation, 2000);
                }
            }
        }
        instance.controlCutter.cutters[1].appendChild(instance.iframe);
        instance.options = [];
        instance.options.push(new Rendition.UI.TabBarTab({
            title: Rendition.Localization['Seo_Address'].Title,
            load: function (tab, tabBar, content) {
                instance.controlCutter.position = 50;
                instance.controlCutter.resize();
                if (content.innerHTML != "") { return }
                instance.previousButton = document.createElement('button');
                instance.previousButton.innerHTML = '<img src="/admin/img/icons/arrow_left.png" alt="Previous">';
                instance.previousButton.style.height = '24px';
                instance.previousButton.onclick = function (e) {
                    instance.iframe.contentWindow.history.go(-1);
                }
                instance.nextButton = document.createElement('button');
                instance.nextButton.innerHTML = '<img src="/admin/img/icons/arrow_right.png" alt="Next">';
                instance.nextButton.style.height = '24px';
                instance.nextButton.onclick = function (e) {
                    instance.iframe.contentWindow.history.go(1);
                }
                instance.goButton = document.createElement('button');
                instance.goButton.innerHTML = '<img src="/admin/img/icons/accept.png" alt="Go">';
                instance.goButton.style.height = '24px';
                instance.refresh = document.createElement('button');
                instance.refresh.innerHTML = '<img src="/admin/img/icons/arrow_rotate_clockwise.png" alt="Refresh">';
                instance.refresh.style.height = '24px';
                instance.homeButton = document.createElement('button');
                instance.homeButton.innerHTML = '<img src="/admin/img/icons/house.png" alt="Home">';
                instance.homeButton.style.height = '24px';
                instance.homeButton.onclick = function (e) {
                    instance.setLocation('/');
                }
                instance.address = document.createElement('input');
                instance.address.onfocus = function () {
                    instance.addressHasFocus = true;
                }
                instance.address.onblur = function () {
                    instance.addressHasFocus = false;
                }
                instance.address.onkeyup = function (e) {
                    if (e.keyCode == 13) {
                        instance.goButton.onclick();
                    }
                }
                instance.goButton.onclick = function () {
                    instance.setLocation(instance.address.value);
                };
                content.appendChild(instance.previousButton);
                content.appendChild(instance.nextButton);
                content.appendChild(instance.address);
                content.appendChild(instance.refresh);
                content.appendChild(instance.homeButton);
            }
        }));
        instance.options.push(new Rendition.UI.TabBarTab({
            title: Rendition.Localization['Seo_Content_Analytics'].Title,
            load: function (tab, tabBar, content) {
                instance.controlCutter.position = 300;
                instance.controlCutter.resize();
                var words = [];
                var wordLengths = [];
                var word3s = [];
                var word4s = [];
                instance.controlCutter.position = 220;
                instance.controlCutter.resize();
                var body = instance.iframe.contentDocument.body.textContent;
                var matches = body.match(/([A-Z]?[^A-Z ]+)/g);
                /* drop noise words */
                var noise = ['for', 'in', 'to', 'and', 'the'];
                /* count words */
                var wg3 = [];
                var wg4 = [];
                var powers = [];
                var lowerWordArray = [];
                for (var x = 0; x < matches.length; x++) {
                    var f = matches[x];
                    f = f.replace(/[^a-z]+/gi, '');
                    if (f.length > 0 && noise.indexOf(String(f).toLowerCase()) == -1) {
                        words.push(f);
                        wg3.push(f);
                        wg4.push(f);
                        lowerWordArray.push(f.toLowerCase());
                        wordLengths.push(f.length);
                    }
                    if (wg3.length == 3) {
                        word3s.push(wg3);
                        wg3 = [];
                    }
                    if (wg4.length == 4) {
                        word4s.push(wg4);
                        wg4 = [];
                    }
                }
                /* count links */
                var links = $(instance.iframe.contentDocument.body).find("a");
                content.innerHTML = '';
                var wordLengthAgg = instance.agg(wordLengths);
                var wordAgg = instance.agg(words);

                instance.ca_options = [];
                instance.ca_options.push(new Rendition.UI.TabBarTab({
                    title: Rendition.Localization['Seo_Overview'].Title,
                    load: function (tab, tabBar, content) {
                        var data = [
                                        [Rendition.Localization['Seo_Link_Count'].Title, links.length],
                                        [Rendition.Localization['Seo_Word_Count'].Title, words.length],
                                        [Rendition.Localization['Seo_3_Word_Phrase_Count'].Title, word3s.length],
                                        [Rendition.Localization['Seo_4_Word_Phrase_Count'].Title, word4s.length],
                                        [Rendition.Localization['Seo_Word_Length_Mean'].Title, wordLengthAgg.mean.toFixed(2)],
                                        [Rendition.Localization['Seo_Word_Length_Deviation'].Title, wordLengthAgg.deviation.toFixed(2)],
                                        [Rendition.Localization['Seo_Word_Length_Variance'].Title, wordLengthAgg.variance.toFixed(2)]
                                    ];
                        var pgrid = Rendition.UI.Grid({
                            name: 'SeoGridItem',
                            data: instance.createReadObject(data, [Rendition.Localization['Seo_Item'].Title,
                            Rendition.Localization['Seo_Value'].Title], [250, 85]),
                            parentNode: content,
                            rowCountColumn: true
                        });
                        return;
                    }
                }));
                instance.ca_options.push(new Rendition.UI.TabBarTab({
                    title: 'Links',
                    load: function (tab, tabBar, content) {
                        var data = [];
                        for (var y = 0; links.length > y; y++) {
                            data.push([String(links[y].innerHTML), String(links[y].href)]);
                        }
                        var pgrid = Rendition.UI.Grid({
                            name: 'SeoGridLinks',
                            data: instance.createReadObject(data, [Rendition.Localization['Seo_Text'].Title,
                            Rendition.Localization['Seo_URL'].Title], [250, 700]),
                            parentNode: content,
                            rowCountColumn: true
                        });
                        return;
                    }
                }));
                instance.ca_options.push(new Rendition.UI.TabBarTab({
                    title: 'Words',
                    load: function (tab, tabBar, content) {
                        var data = [];
                        var addedWords = [];
                        for (var y = 0; words.length > y; y++) {
                            var currentWord = String(words[y]);
                            if (addedWords.indexOf(currentWord) != -1) { continue };
                            var cnt = instance.getWordCount(currentWord, lowerWordArray);
                            data.push([currentWord, cnt, ((cnt / lowerWordArray.length) * 100).toFixed(2) + '%']);
                            addedWords.push(currentWord);
                        }
                        var pgrid = Rendition.UI.Grid({
                            name: 'SeoGridWords',
                            data: instance.createReadObject(data, [Rendition.Localization['Seo_Word'].Title,
                            Rendition.Localization['Seo_Occurrences'].Title, Rendition.Localization['Seo_Occurrence_Pct'].Title], [150, 100, 85]),
                            parentNode: content,
                            rowCountColumn: true
                        });
                        return;
                    }
                }));
                instance.ca_options.push(new Rendition.UI.TabBarTab({
                    title: Rendition.Localization['Seo_3-Word_Phrases'].Title,
                    load: function (tab, tabBar, content) {
                        var data = [];
                        for (var y = 0; word3s.length > y; y++) {
                            var vi1 = instance.getWordCount(word3s[y][0], lowerWordArray);
                            var vi2 = instance.getWordCount(word3s[y][1], lowerWordArray);
                            var vi3 = instance.getWordCount(word3s[y][2], lowerWordArray);
                            data.push([String(word3s[y].join(' ')),
                                            '( ' + vi1 + ' + ' + vi2 + ' + ' + vi3 + ' )', (vi1 + vi2 + vi3)
                                        ]);
                        }
                        var pgrid = Rendition.UI.Grid({
                            name: 'Seo3Word',
                            data: instance.createReadObject(data, [Rendition.Localization['Seo_Phrase'].Title,
                            Rendition.Localization['Seo_Occurrences'].Title, Rendition.Localization['Seo_Total'].Title], [250, 120, 85]),
                            parentNode: content,
                            rowCountColumn: true
                        });
                        return;
                    }
                }));
                instance.ca_options.push(new Rendition.UI.TabBarTab({
                    title: Rendition.Localization['Seo_4-Word_Phrases'].Title,
                    load: function (tab, tabBar, content) {
                        var data = [];
                        for (var y = 0; word4s.length > y; y++) {
                            var vi1 = instance.getWordCount(word4s[y][0], lowerWordArray);
                            var vi2 = instance.getWordCount(word4s[y][1], lowerWordArray);
                            var vi3 = instance.getWordCount(word4s[y][2], lowerWordArray);
                            var vi4 = instance.getWordCount(word4s[y][3], lowerWordArray);
                            data.push([String(word4s[y].join(' ')),
                                            '( ' + vi1 + ' + ' + vi2 + ' + ' + vi3 + ' + ' + vi4 + ' )', (vi1 + vi2 + vi3 + vi4)
                                        ]);
                        }
                        var pgrid = Rendition.UI.Grid({
                            name: 'Seo4Word',
                            data: instance.createReadObject(data, [Rendition.Localization['Seo_Phrase'].Title, Rendition.Localization['Seo_Occurrences'].Title, Rendition.Localization['Seo_Total'].Title], [250, 120, 85]),
                            parentNode: content,
                            rowCountColumn: true
                        });
                        return;
                    }
                }));
                instance.ca_tabs = Rendition.UI.TabBar({
                    tabs: instance.ca_options,
                    activeTabIndex: 0,
                    parentNode: content
                });
            }
        }));
        instance.agg = function (a) {
            var r = { mean: 0, variance: 0, deviation: 0 }, t = a.length;
            for (var m, s = 0, l = t; l--; s += a[l]);
            for (m = Rendition.mean = s / t, l = t, s = 0; l--; s += Math.pow(a[l] - m, 2));
            return Rendition.deviation = Math.sqrt(Rendition.variance = s / t), r;
        }
        /*
        instance.options.push(new Rendition.UI.TabBarTab({
        title: 'Visitor Analytics',
        load: function (tab, tabBar, content) {
        instance.controlCutter.position = 300;
        instance.controlCutter.resize();
        instance.dateChart = Rendition.UI.DateChart({
        parentNode: content,
        title: 'Pages',
        type: 'ticChart',
        chart: function (dateChart, chartArguments, chartOptions) {
        var a =
        "declare @dayTo datetime = '" + chartArguments.toDate.value + "' \
        declare @dayFrom datetime = '" + chartArguments.fromDate.value + "' \
        declare @url varchar(7000) = '" + (args.trackingSearch || instance.location.replace("'", "''")) + "' \
        declare @days table(days datetime); \
        declare @todate int;  declare @fromdate int;  set @todate = (DATEDIFF(D,@dayTo,GETDATE()))*-1; \
        set @fromdate = (DATEDIFF(D,@dayFrom,GETDATE()))*-1;  while (@todate>=@fromdate)  begin \
        insert into @days (days) values (DATEADD(dd,@todate,cast(convert(varchar(20),getDate(),1) as datetime))); \
        set @todate = @todate -1;end \
        declare @catlist table(category varchar(500),hits int,onDate datetime) \
        insert into @catlist \
        select URL, count(0), CONVERT(varchar(50),time,101) as time from ( \
        select URL, time \
        from \
        ( \
        select URL, time \
        from ( \
        select URL, time from visitorDetail  \
        where time between @dayFrom and @dayTo and URL like '%' + @url + '%'\
        ) f \
        ) g \
        ) h group by URL, CONVERT(varchar(50),time,101) order by URL \
        declare @category varchar(100), @hits int  \
        declare cur cursor forward_only static for  \
        select category  \
        from @catlist group by (category)  \
        OPEN cur;  \
        fetch next from cur \
        into @category \
        while @@FETCH_STATUS = 0 \
        begin \
        select @category,d.days,case when SUM(hits) is null then 0 else SUM(hits) end as hits,(select top 1 color from systemColors order by newid()),'White',3,5 from @days d \
        left join (select category, onDate, hits from @catlist where @category = category) o on o.onDate between d.days and d.days+1 \
        group by d.days order by days; \
        fetch next from cur \
        into @category \
        end \
        close cur; \
        deallocate cur;"
        return a;
        }
        });

        }
        }));
        */
        instance.controlTabs = Rendition.UI.TabBar({
            tabs: instance.options,
            activeTabIndex: 0,
            parentNode: instance.controlCutter.cutters[0]
        });
        instance.controlTabs.addEventListener('resize', function () {
            if (instance.address) {
                var rect0 = {
                    w: instance.controlCutter.cutters[0].offsetWidth,
                    h: instance.controlCutter.cutters[0].offsetHeight
                };
                var rect1 = {
                    w: instance.controlCutter.cutters[1].offsetWidth,
                    h: instance.controlCutter.cutters[1].offsetHeight
                };
                instance.address.style.width = (rect0.w - 170) + "px";
                instance.iframe.style.width = (rect1.w) + "px";
                instance.iframe.style.height = (rect1.h) + "px";
            }
        }, false);
        instance.controlTabs.resize();
        instance.setLocation(args.URL || '/');
        instance.refreshFrameLocation();
    }
    instance.setLocation = function (location) {
        instance.iframe.src = location;
        instance.address.value = instance.iframe.src;
        if (instance.dialog) {
            instance.dialog.title(Rendition.Localization['Seo_Search_Engine_Optimization_x_Title'].Title + instance.iframe.src);
        }
    }
    instance.createReadObject = function (data, headers, columnWidths) {
        var hdr = [];
        if (columnWidths === undefined) {
            var columnWidths = [];
            for (var x = 0; headers.length > x; x++) {
                columnWidths.push(400);
            }
        }
        for (var x = 0; headers.length > x; x++) {
            hdr.push({
                name: headers[x],
                dataType: 'varchar',
                dataLength: 255,
                columnOrder: x,
                columnSize: columnWidths[x],
                visibility: 1,
                description: '',
                isNullable: 0,
                primaryKey: 0,
                defaultValue: '',
                displayName: headers[x],
                hidden: 0
            });
        }
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
                columns: headers.length,
                records: data.length,
                orderBy: 0,
                orderByDirection: 0,
                checksum: -1,
                name: '',
                displayName: ''
            },
            header: hdr
        }
    }
    instance.init();
    return instance;
}