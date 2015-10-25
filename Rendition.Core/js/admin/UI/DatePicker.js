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
Rendition.UI.DatePickerStyle = function () {
    var instance = {}
    instance.inputWidth = '160px';
    instance.selectButtonBackground = 'transparent url(/admin/img/icons/date.png) no-repeat center center';
    instance.selectButtonRect = { x: -19, y: 0, h: 19, w: 19 };
    instance.cellRect = { x: 0, y: 0, h: 35, w: 35 }
    instance.headerCellRect = { x: 0, y: 0, h: 35, w: 35 }
    instance.calendarTodayCellBackground = 'lightblue';
    instance.calendarTodayCellColor = 'white';
    instance.calendarTodayCellBorder = 'solid 1px black';
    instance.selectedCellBackground = 'goldenrod';
    instance.selectedCellColor = 'black';
    instance.selectedCellBorder = 'solid 1px black';
    instance.hoverCellBackground = 'lightgreen';
    instance.hoverCellColor = 'black';
    instance.timeInputTickers = true;
    instance.timeInputCellAlignment = 'left';
    instance.timeInputCellPadding = '4px 0 0 4px';
    instance.timeInputWidth = '40px';
    instance.todayButtonHTML = 'Today';
    instance.okButtonHTML = 'Ok';
    instance.cancelButtonHTML = 'Cancel';
    instance.controlButtonMargin = '4px';
    instance.previousInnerHTML = '<';
    instance.nextInnerHTML = '>';
    instance.calendarOffsetRect = { x: 4, y: 0, h: 0, w: -8 }
    instance.headerAlignment = 'center';
    instance.previousButtonCellAlign = 'left';
    instance.previousButtonBackground = '';
    instance.nextButtonBackground = '';
    instance.previousButtonColor = 'black';
    instance.nextButtonColor = 'black';
    instance.nextButtonCellAlign = 'right';
    instance.dayHeaderCellBackground = 'white';
    instance.dayHeaderCellColor = 'black';
    instance.dayCellBackground = 'white';
    instance.dayCellColor = 'black';
    instance.calendarBackground = 'white';
    instance.calendarColor = 'black';
    instance.calendarHeaderColor = 'black';
    instance.calendarHeaderBackground = 'black';
    instance.calendarHeaderFontSize = '14px';
    instance.calendarHeaderFontFamily = 'Arial, Helvetica, Sans-Serif';
    instance.nonDayCellBorder = 'solid 1px transparet';
    instance.dayCellBorder = 'solid 1px black';
    instance.dayCellAlignment = 'left';
    instance.dayCellMargin = '2px';
    instance.dayCellFontFamily = 'Arial, Helvetica, Sans-Serif';
    instance.dayHeaderCellFontFamily = 'Arial, Helvetica, Sans-Serif';
    instance.dayCellFontSize = '11px';
    instance.dayCellPadding = '2px';
    instance.dayCellAlignment = 'left';
    instance.dayHeaderCellFontSize = '11px';
    instance.dayHeaderCellPadding = '2px';
    instance.dayHeaderCellAlignment = 'left';
    return instance;
}
/**
* Uses <link xlink:href="Rendition.UI.Dialog"/> with a date chooser widget to fill an input.
* @constructor
* @public
* @param {Native.Object} args The arguments for the widget.
* @param {Native.Object} args.input The DHTML input element to bind the datepicker to.
* @name Rendition.UI.DatePicker
* @example /// Create an input and bind a datepicker to it ///
* var foo = Rendition.UI.Dialog();
* var bar = document.createElement('input');
* foo.content.appendChild(bar);
* Rendition.UI.DatePicker({ input: bar });
*/
Rendition.UI.DatePicker = function (args) {
    var instance = {}
    args = args || {}
    //events
    /**
    * Executes event subscriptions.
    * @function
    * @name CutterBar.executeEvents
    * @memberOf Rendition.UI.CutterBar.prototype
    * @returns {Native.Boolean} false if cancel default was called.
    * @private
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
    instance.eventlisteners_monthChange = function (e, obj, args) {
        if (instance.executeEvents(instance.events.monthChange, e, obj)) { return true }
        return true;
    }
    instance.eventlisteners_daySelect = function (e, obj, args) {
        if (instance.executeEvents(instance.events.daySelect, e, obj)) { return true }
        return true;
    }
    instance.eventlisteners_today = function (e, obj, args) {
        if (instance.executeEvents(instance.events.today, e, obj)) { return true }
        return true;
    }
    instance.eventlisteners_ok = function (e, obj, args) {
        if (instance.executeEvents(instance.events.ok, e, obj)) { return true }
        return true;
    }
    instance.eventlisteners_cancel = function (e, obj, args) {
        if (instance.executeEvents(instance.events.cancel, e, obj)) { return true }
        return true;
    }
    /**
    * Used internally to add events used in the arugments of this instance.
    * @function
    * @name DatePicker.addInitalEvents
    * @memberOf Rendition.UI.DatePicker.prototype
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
    /**
    * Removes an event from subscription list.  The [proc] must match exactly the [proc] subscribed with.
    * @function
    * @name DatePicker.removeEventListener
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.undefined
    * @param {Native.String} type The type of event to subscribe to.
    * @param {Native.Function} proc The function to call when the event is fired.
    * @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
    * @public
    */
    instance.removeEventListener = function (type, proc, capture) {
        var evts = instance.events[type];
        for (var x = 0; evts.length > x; x++) {
            if (evts[x] === proc) {
                evts.splice(x, 1);
            }
        }
        return null;
    }
    /**
    * Prevent the default event from occuring.  For use within an event handler.  For example, when used in within a function subscribed to the editfinish event, running grid.preventDefault() will prevent the grid from updating the recordset.
    * @function
    * @name DatePicker.preventDefault
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.undefined
    * @public
    */
    instance.preventDefault = function () {
        instance.cancelDefault = true;
    }
    /**
    * Attach a procedure to an event.  Usage grid.addEventListener('cellmousedown',function(e,grid,element,row,column,selection,data,header){/*your procedure code},false)
    * @function
    * @name DatePicker.addEventListener
    * @memberOf Rendition.UI.Grid.prototype
    * @type Native.undefined
    * @param {Native.String} type The type of event to subscribe to.
    * @param {Native.Function} proc The function to call when the event is fired.
    * @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
    * @public
    */
    instance.addEventListener = function (type, proc, capture) {
        if (instance.events[type]) {
            if (instance.events[type].indexOf(proc) === -1) {
                instance.events[type].push(proc);
            }
        } else {
            instance.log('can\'t attach to event handler ' + type);
        }
        return null;
    }
    instance.events = {
        timeChange: instance.addInitalEvents(args.timeChange),
        monthChange: instance.addInitalEvents(args.monthChange),
        daySelect: instance.addInitalEvents(args.daySelect),
        cancel: instance.addInitalEvents(args.cancel),
        ok: instance.addInitalEvents(args.ok),
        today: instance.addInitalEvents(args.today)
    }
    // end of events 
    instance.refreshToday = function () {
        instance.today = new Date();
        instance.today_month = instance.today.getMonth();
        instance.today_date = instance.today.getDate();
        instance.today_year = instance.today.getFullYear();
    }
    instance.style = args.style || Rendition.UI.DatePickerStyle();
    instance.date = args.date || new Date();
    instance.dialogRect = args.dialogRect || { x: 36, y: 36, w: 203, h: 267 }
    instance.cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    instance.cal_months_labels = ['January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    instance.cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    instance.drawMonth = function (year, month) {
        instance.selectorMonth = new Date(year, month, 1);
        instance.month = instance.selectorMonth.getMonth();
        instance.year = instance.selectorMonth.getFullYear();
        if (instance.month == 1) { // leap year
            if ((instance.year % 4 == 0 && instance.year % 100 != 0) || instance.year % 400 == 0) {
                instance.monthLength = 29;
            }
        }
        instance.monthLength = instance.cal_days_in_month[instance.month];
        instance.monthName = instance.cal_months_labels[instance.month];
        instance.startingDayOfWeek = instance.selectorMonth.getDay();
        instance.month_name_cell.innerHTML = instance.monthName + ' ' + instance.selectorMonth.getFullYear();
        var t = document.createElement('table');
        t.style.tableLayout = 'fixed';
        t.style.borderCollapse = 'collapse';
        var table = [];
        for (x = 6; x >= 0; x--) {
            var row = t.insertRow(0);
            table[x] = [];
            for (y = 6; y >= 0; y--) {
                table[x][y] = row.insertCell(0);
                table[x][y].style.fontSize = instance.style.dayCellFontSize;
                table[x][y].style.padding = instance.style.dayCellPadding;
                table[x][y].style.alignment = instance.style.dayCellAlignment;
                table[x][y].style.width = instance.style.cellRect.w;
                table[x][y].style.height = instance.style.cellRect.h;
            }
        }
        var d = 0;
        var i = 1;
        var date = 1;
        for (var x = 0; 7 > x; x++) {
            table[0][x].innerHTML = instance.cal_days_labels[x];
            table[0][x].style.background = instance.style.dayHeaderCellBackground;
            table[0][x].style.color = instance.style.dayHeaderCellColor;
            table[0][x].style.fontFamily = instance.style.dayHeaderCellFontFamily;
            table[0][x].style.fontSize = instance.style.dayHeaderCellFontSize;
            table[0][x].style.padding = instance.style.dayHeaderCellPadding;
            table[0][x].style.alignment = instance.style.dayHeaderCellAlignment;
            table[0][x].style.width = instance.style.headerCellRect.w;
            table[0][x].style.height = instance.style.headerCellRect.h;
        }
        for (var x = 1; 7 > x; x++) {
            for (var y = 0; 7 > y; y++) {
                table[x][y].style.border = instance.style.nonDayCellBorder;
                if (instance.startingDayOfWeek <= d) {
                    if (i <= instance.monthLength) {
                        table[x][y].innerHTML = date;
                        table[x][y].fullDate = month + '/' + date + '/' + year;
                        table[x][y].month = month;
                        table[x][y].date = date;
                        table[x][y].year = year;
                        table[x][y].style.fontFamily = instance.style.dayCellFontFamily;
                        instance.formatDayCell(table[x][y]);
                        table[x][y].onmouseover = function () {
                            this.pBackground = this.style.background;
                            this.pColor = this.style.color;
                            this.style.background = instance.style.hoverCellBackground;
                            this.style.color = instance.style.hoverCellColor;
                        }
                        table[x][y].onmouseout = function () {
                            this.style.background = this.pBackground;
                            this.style.color = this.pColor;
                        }
                        table[x][y].onclick = function (e) {
                            if (instance.eventlisteners_daySelect(e, this, [this.fullDate, instance])) {
                                instance.selected_month = this.month;
                                instance.selected_date = this.date;
                                instance.selected_year = this.year;
                                instance.formatDayCell(this);
                                //create selected date
                                if (args.time) {
                                    instance.selectedDate = new Date(instance.selected_year,
                                        instance.selected_month,
                                        instance.selected_date,
                                        instance.hours_input.value,
                                        instance.minutes_input.value,
                                        instance.seconds_input.value);
                                } else {
                                    instance.selectedDate = new Date(instance.selected_year,
                                        instance.selected_month,
                                        instance.selected_date);
                                }
                                if (args.input !== undefined && args.time === true) {

                                } else if (args.input !== undefined) {
                                    args.input.value = Rendition.UI.formatDate(instance.selectedDate, 'MM/DD/YYYY');
                                }
                                instance.calDiv.removeChild(instance.calendarTable);
                                instance.calendarTable = instance.drawMonth(instance.year, instance.month);
                                instance.calDiv.appendChild(instance.calendarTable);
                                instance.resizeDialog();
                            }
                        }
                        table[x][y].style.cursor = 'pointer';
                        date++;
                    }
                    i++;
                }
                d++;
            }
        }
        return t;
    }
    instance.formatDayCell = function (cell) {
        if (instance.selected_month === cell.month
            && instance.selected_year === cell.year
            && instance.selected_date === cell.date) {
            cell.style.border = instance.style.selectedCellBorder;
            cell.style.background = instance.style.selectedCellBackground;
            cell.style.color = instance.style.selectedCellColor;
            cell.pBackground = instance.style.selectedCellBackground;
            cell.pColor = instance.style.selectedCellColor;
        } else if (instance.today_month === cell.month
            && instance.today_year === cell.year
            && instance.today_date === cell.date) {
            cell.style.border = instance.style.calendarTodayCellBorder;
            cell.style.background = instance.style.calendarTodayCellBackground;
            cell.style.color = instance.style.calendarTodayCellColor;
        } else {
            cell.style.border = instance.style.dayCellBorder;
            cell.style.background = instance.style.dayCellBackground;
            cell.style.color = instance.style.dayCellColor;
        }
    }
    instance.setTimeInputs = function () {
        var hours = instance.date.getHours();
        var minutes = instance.date.getMinutes();
        var seconds = instance.date.getSeconds();
        var ampm = 'AM';
        if (hours > 12) {
            hours = hours - 12;
            ampm = 'PM';
        }
        instance.hours_input.value = hours;
        instance.minutes_input.value = minutes;
        instance.seconds_input.value = seconds;
        instance.ampm_input.value = ampm;
    }
    instance.drawCalendar = function (drawArgs) {
        var prev = document.createElement('button');
        var next = document.createElement('button');
        var today = document.createElement('button');
        var ok = document.createElement('button');
        var cancel = document.createElement('button');
        today.innerHTML = instance.style.todayButtonHTML;
        ok.innerHTML = instance.style.okButtonHTML;
        cancel.innerHTML = instance.style.cancelButtonHTML;
        today.style.margin = instance.style.controlButtonMargin;
        ok.style.margin = instance.style.controlButtonMargin;
        cancel.style.margin = instance.style.controlButtonMargin;
        instance.hours_input = document.createElement('input');
        instance.hours_input.style.width = instance.style.timeInputWidth;
        instance.minutes_input = document.createElement('input');
        instance.minutes_input.style.width = instance.style.timeInputWidth;
        instance.seconds_input = document.createElement('input');
        instance.seconds_input.style.width = instance.style.timeInputWidth;
        instance.ampm_input = document.createElement('select');
        Rendition.UI.fillSelect(instance.ampm_input, [['AM', 'AM'], ['PM', 'PM']], 0, 1, 'AM');
        instance.calDiv = document.createElement('div');
        instance.timeDiv = document.createElement('div');
        instance.timeDivH = document.createElement('div');
        instance.timeDivM = document.createElement('div');
        instance.timeDivS = document.createElement('div');
        prev.innerHTML = instance.style.previousInnerHTML;
        next.innerHTML = instance.style.nextInnerHTML;
        prev.style.background = instance.style.previousButtonBackground;
        next.style.background = instance.style.nextButtonBackground;
        prev.style.color = instance.style.previousButtonColor;
        next.style.color = instance.style.nextButtonColor;
        instance.header = document.createElement('table');
        instance.header.style.color = instance.style.calendarHeaderColor;
        instance.header.style.background = instance.style.calendarBackground;
        instance.header.style.fontSize = instance.style.calendarHeaderFontSize;
        instance.header.style.fontFamily = instance.style.calendarHeaderFontFamily;
        var hRow = instance.header.insertRow(0);
        var nCell = hRow.insertCell(0);
        nCell.appendChild(next);
        nCell.style.textAlign = instance.style.nextButtonCellAlign;
        instance.month_name_cell = hRow.insertCell(0);
        instance.month_name_cell.style.textAlign = instance.style.headerAlignment;
        var pCell = hRow.insertCell(0);
        pCell.appendChild(prev);
        pCell.style.textAlign = instance.style.previousButtonCellAlign;
        prev.onclick = function () {
            instance.previousMonth();
        }
        next.onclick = function () {
            instance.nextMonth();
        }
        instance.nextMonth = function () {
            if (instance.eventlisteners_monthChange(null, this, [instance.selectorMonth, instance, 'Next'])) {
                instance.setMonth(1);
            }
        }
        instance.previousMonth = function () {
            if (instance.eventlisteners_monthChange(null, this, [instance.selectorMonth, instance, 'Previous'])) {
                instance.setMonth(-1);
            }
        }
        ok.onclick = function (e) {
            if (instance.eventlisteners_ok(e, this, [instance.selectedDate, instance])) {
                if (args.input !== undefined) {
                    instance.selectedDate = new Date(instance.selected_year,
                        instance.selected_month,
                        instance.selected_date,
                        instance.hours_input.value,
                        instance.minutes_input.value,
                        instance.seconds_input.value);
                    if (args.time) {
                        args.input.value = Rendition.UI.formatDate(instance.selectedDate, 'MM/DD/YYYY hh:nn:ss') + ' ' + instance.ampm_input.value;
                    } else {
                        args.input.value = Rendition.UI.formatDate(instance.selectedDate, 'MM/DD/YYYY');
                    }
                }
                instance.dialog.close();
            }
        }
        cancel.onclick = function (e) {
            if (instance.eventlisteners_cancel(e, this, [instance.selectedDate, instance])) {
                instance.dialog.close();
            }
        }
        today.onclick = function (e) {
            if (instance.eventlisteners_today(e, this, [instance.selectedDate, instance])) {
                if (instance.calendarTable) {
                    instance.calDiv.removeChild(instance.calendarTable);
                }
                instance.selected_month = instance.today_month;
                instance.selected_date = instance.today_date;
                instance.selected_year = instance.today_year;
                instance.calendarTable = instance.drawMonth(instance.today_year, instance.today_month);
                instance.calDiv.appendChild(instance.calendarTable);
                instance.resizeDialog();
            }
        }
        instance.setMonth = function (offset) {
            instance.selectorMonth.setMonth(instance.selectorMonth.getMonth() + offset);
            if (instance.calendarTable) {
                instance.calDiv.removeChild(instance.calendarTable);
            }
            instance.calendarTable = instance.drawMonth(instance.selectorMonth.getFullYear(),
                instance.selectorMonth.getMonth());
            instance.calDiv.appendChild(instance.calendarTable);
            instance.resizeDialog();
        }
        instance.timeDivH.appendChild(instance.hours_input);
        instance.timeDivM.appendChild(instance.minutes_input);
        instance.timeDivS.appendChild(instance.seconds_input);
        instance.timeDiv.appendChild(instance.timeDivH);
        instance.timeDiv.appendChild(instance.timeDivM);
        instance.timeDiv.appendChild(instance.timeDivS);
        instance.timeDiv.appendChild(instance.ampm_input);
        instance.dialog.content.appendChild(instance.header);
        instance.dialog.content.appendChild(instance.calDiv);
        instance.dialog.content.appendChild(instance.timeDiv);
        instance.dialog.content.appendChild(today);
        instance.dialog.content.appendChild(ok);
        instance.dialog.content.appendChild(cancel);
        instance.calendarTable = instance.drawMonth(drawArgs.year, drawArgs.month);
        instance.calDiv.appendChild(instance.calendarTable);
        instance.timeDiv.style.textAlign = instance.style.timeInputCellAlignment;
        instance.timeDiv.style.padding = instance.style.timeInputCellPadding;
        instance.dialog.content.style.background = instance.style.calendarBackground;
        instance.dialog.content.style.color = instance.style.calendarColor;
        instance.setTimeInputs();
        Rendition.UI.NumericUpDown({
            input: instance.hours_input,
            max: 12,
            min: 1,
            value: instance.hours_input.value
        });
        Rendition.UI.NumericUpDown({
            input: instance.minutes_input,
            max: 59,
            min: 0,
            value: instance.minutes_input.value
        });
        Rendition.UI.NumericUpDown({
            input: instance.seconds_input,
            max: 59,
            min: 0,
            value: instance.seconds_input.value
        });
    }
    instance.resizeDialog = function () {
        if (instance.dialog) {
            var c = instance.dialog.content;
            instance.header.style.marginTop = (instance.style.calendarOffsetRect.y) + 'px';
            instance.header.style.marginLeft = (instance.style.calendarOffsetRect.x) + 'px';
            instance.calendarTable.style.marginLeft = (instance.style.calendarOffsetRect.x) + 'px';
            instance.calendarTable.style.width = (c.offsetWidth + instance.style.calendarOffsetRect.w) + 'px';
            instance.header.style.width = (c.offsetWidth + instance.style.calendarOffsetRect.w) + 'px';
        }
    }
    instance.initDialog = function () {
        instance.refreshToday();
        if (args.input !== undefined) {
            var indate = new Date(args.input.value);
            if (Rendition.UI.isDate(indate)) {
                instance.date = instance.selectedDate = indate;
            } else {
                instance.date = instance.selectedDate = new Date();
            }
            instance.selected_month = instance.date.getMonth();
            instance.selected_date = instance.date.getDate();
            instance.selected_year = instance.date.getFullYear();
            var pos = Rendition.UI.getPosition(instance.selectButton);
            instance.dialogRect.x = pos.x;
            instance.dialogRect.y = pos.y - parseInt(instance.dialogRect.h / 2);
            if (instance.dialogRect.y < 0) {
                instance.dialogRect.y = 0;
            }
            if ((instance.dialogRect.y + instance.dialogRect.h) > document.documentElement.clientHeight) {
                instance.dialogRect.y = document.documentElement.clientHeight - instance.dialogRect.h;
            }
        }
        instance.dialog = Rendition.UI.dialogWindow({
            rect: instance.dialogRect,
            title: args.title || 'Select Date',
            modal: (args.input !== undefined) || false,
            alwaysOnTop: true,
            modalCloseable: true,
            resize: instance.resizeDialog,
            close: function () {
                instance.dialog = undefined;
            }
        });
        instance.drawCalendar({
            year: instance.date.getFullYear(),
            month: instance.date.getMonth()
        });
        instance.resizeDialog();
    }
    instance.init = function () {
        instance.refreshToday();
        if (args.input !== undefined) {
            args.input.style.width = instance.style.inputWidth;
            instance.content = document.createElement('span');
            instance.selectButton = document.createElement('button');
            instance.selectButton.style.display = 'inline-block';
            instance.selectButton.style.position = 'relative';
            instance.selectButton.style.background = instance.style.selectButtonBackground;
            var m = instance.style.selectButtonMargin;
            instance.selectButton.style.border = 'none';
            instance.selectButton.style.verticalAlign = 'tOP';
            instance.selectButton.style.lineHeight = instance.style.selectButtonRect.h + 'px';
            instance.selectButton.style.height = instance.style.selectButtonRect.h + 'px';
            instance.selectButton.style.width = instance.style.selectButtonRect.w + 'px';
            instance.selectButton.style.top = instance.style.selectButtonRect.y + 'px';
            instance.selectButton.style.left = instance.style.selectButtonRect.x + 'px';
            instance.selectButton.style.marginRight = instance.style.selectButtonRect.x + 'px';
            /* mask and append field */
            args.input.onblur = function () {
                /* validate date - or go back */
                if (!Rendition.UI.isDate(this.value)) {
                    this.focus();
                    this.select();
                    this.validDate = false;
                } else {
                    this.validDate = true;
                }
            }
            instance.selectButton.onclick = function () {
                if (!instance.dialog) {
                    instance.initDialog();
                }
            }
            instance.getAttached();
        } else {
            instance.initDialog();
        }
    }
    instance.getAttached = function () {
        setTimeout(function () {
            if (args.input.parentNode) {
                args.input.parentNode.insertBefore(instance.content, args.input);
                instance.content.appendChild(args.input);
                instance.content.appendChild(instance.selectButton);
            } else {
                instance.getAttached();
            }
        }, 100);
    }
    instance.init();
}