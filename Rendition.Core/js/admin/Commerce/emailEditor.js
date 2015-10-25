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
* Email editor.
* @constructor
* @name Rendition.Commerce.EmailEditor
*/
Rendition.Commerce.EmailEditor = function (args) {
    var instance = {}
    if (args === undefined) { args = {} }
    if (args.parentNode === undefined) {
        instance.dialog = Rendition.UI.Dialog({
            rect: {
                x: Rendition.UI.dialogPosition.x,
                y: Rendition.UI.dialogPosition.y,
                h: 675,
                w: 763
            },
            title: 'Site Email Box'
        });
        args.parentNode = instance.dialog.content;
    }
    instance.emailTypes = [
		['emailAFriend', 'Email A Friend'],
		['lostPassword', 'Lost Password'],
		['newOrder', 'New Order'],
    /*['statusUpdate', 'Status Update'],*/
		['shipConfirm', 'Shipment Confirm'],
    /*['stockAlert', 'Low Stock Alert'],
    ['newsletter', 'Newsletter']*/
	]
    instance.editorGroups = function () {
        return [
			{
			    name: 'Address',
			    expanded: true,
			    inputs: [
					{
					    columnName: 'mailTo'
					},
					{
					    columnName: 'mailFrom'
					},
					{
					    columnName: 'sender'
					},
					{
					    columnName: 'bcc'
					},
					{
					    columnName: 'subject'
					}
				]
			},
			{
			    name: 'Message',
			    expanded: true,
			    inputs: [
					{
					    columnName: 'HTMLBody',
					    inputType: 'rte'
					}
				]
			},
			{
			    name: 'Error Report',
			    expanded: false,
			    inputs: [
					{
					    columnName: 'errorDesc',
					    inputType: 'rte'
					}
				]
			}

		]
    }
    instance.formStruct = function (inReadObject, inCallbackProcedure, newRow) {
        if (newRow === undefined) {
            var newRecordRow = instance.grid.newRecord({
                messageSentOn: '1/1/1900 00:00:00.000'
            });
            inReadObject.data[instance.grid.newRowIndex] = newRecordRow;
        }
        var a =
		{
		    groups: instance.editorGroups()

		}
        if (newRow === undefined) {
            a.dataSetIndex = instance.grid.newRowIndex;
            a.callbackProcedure = inCallbackProcedure;
            a.dataSet = inReadObject;
        }
        return a;
    }
    instance.grid = Rendition.UI.Grid({ objectName: 'emails', editMode: 3 });
    instance.init = function () {
        instance.tabs = [];
        instance.tabs[0] = Rendition.UI.TabBarTab({
            title: 'Outbox',
            load: function (tab, tabBar, content) {
                instance.emailQueue = Rendition.UI.Grid({
                    selectionMethod: 3,
                    objectName: 'emails',
                    suffix: ' where messageSentOn = \'1/1/1900 00:00:00.000\'',
                    parentNode: content,
                    editMode: 3,
                    genericEditor: true,
                    editorParameters: {
                        groups: instance.editorGroups()
                    }
                });
            }
        });
        instance.tabs[1] = Rendition.UI.TabBarTab({
            title: 'Sent Items',
            load: function (tab, tabBar, content) {
                instance.emailSent = Rendition.UI.Grid({
                    selectionMethod: 3,
                    objectName: 'emails',
                    suffix: ' where not messageSentOn = \'1/1/1900 00:00:00.000\'',
                    parentNode: content,
                    editMode: 3,
                    genericEditor: true,
                    editorParameters: {
                        groups: instance.editorGroups()
                    }
                });
            }
        });
        instance.tabs[2] = Rendition.UI.TabBarTab({
            title: 'Compose',
            load: function (tab, tabBar, content) {
                if (content.innerHTML === '') {
                    instance.menuBarElements = [];
                    instance.menuBarElements[0] = Rendition.UI.MenuOption();
                    instance.menuBarElements[0].text = 'Send';
                    Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
                        instance.form.save(true, 1, function () {
                            instance.emailQueue.refresh();
                            content.innerHTML = '';
                            instance.tabs[3].activate();
                            instance.tabs[2].activate();
                        }, false);
                        return false;
                    }, false);
                    instance.menuBar = Rendition.UI.MenuBar({
                        options: instance.menuBarElements,
                        parentNode: content
                    });
                    var formOptions = instance.formStruct(instance.grid.dataSet);
                    formOptions.offsetRect = {
                        y: instance.menuBar.rect.h + 10
                    }
                    formOptions.scroll = true;
                    instance.form = Rendition.UI.Form(formOptions);
                    instance.form.appendTo(content);
                }
            }
        });
        instance.tabbar = Rendition.UI.TabBar({
            tabs: instance.tabs,
            parentNode: args.parentNode,
            activeTabIndex: 0
        });
    }
    instance.appendOutput = function (dataToAppend) {
        instance.output.innerHTML = instance.output.innerHTML + "<br>" + dataToAppend;
        instance.output.scrollTop = instance.output.scrollHeight;
    }
    instance.init();
    return instance;
}