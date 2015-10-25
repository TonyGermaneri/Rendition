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
* URL rewriter editor.
* @constructor
* @name Rendition.Commerce.URLRewrite
*/
Rendition.Commerce.URLRewrite = function (args) {
    var instance = {}
    if (args === undefined) { args = {} }
    if (args.parentNode === undefined) {
        instance.dialog = new Rendition.UI.dialogWindow({
            rect: {
                x: Rendition.UI.dialogPosition.x,
                y: Rendition.UI.dialogPosition.y,
                h: 475,
                w: 963
            },
            title: Rendition.Localization['UrlRewrite_URL_Rewrite'].Title
        });
        args.parentNode = instance.dialog.content;
    }
    instance.editorGroup = function () {
        return undefined;
    }
    instance.preview = function (e) {
        var req = [
			            'PreviewRewriteDirective',
			            [
                            {
                                urlMatchPattern: instance.form.getInputByName('urlMatchPattern').value,
                                urlToRedirectTo: instance.form.getInputByName('urlToRedirectTo').value,
                                errorMatch: instance.form.getInputByName('errorMatch').value,
                                contentType: instance.form.getInputByName('contentType').value,
                                type: instance.form.getInputByName('type').value,
                                order: instance.form.getInputByName('order').value,
                                url: instance.form.getInputByName('url').value
                            }
			            ]
		            ]
        instance.reqEval = new Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            var a = JSON.parse(e.responseText).method1.PreviewRewriteDirective;
            var content = instance.cutter.cutters[1];
            if (a.error !== 0) {
                alert(a.description);
                return;
            }
            var hitmiss = Rendition.Localization["UrlRewrite_Directive_matched"].Title;
            if (Rendition.UI.emptyUUID == a.result.id) {
                hitmiss = Rendition.Localization['UrlRewrite_No_directive_matched'].Title;
            }
            content.innerHTML = '<table style="background:white;margin:10px;">' +
                            '<tr><td>Status</td><td>' + hitmiss + '</td></tr>' +
                            '<tr><td>Id</td><td>' + a.result.id + '</td></tr>' +
                            '<tr><td>Type</td><td>' + a.result.type + '</td></tr>' +
                            '<tr><td>Content Type</td><td>' + a.result.contentType + '</td></tr>' +
                            '<tr><td>Status</td><td>' + a.result.status + '</td></tr>' +
                            '<tr><td>URL</td><td>' + a.result.target + '</td></tr>' +
                            '</table>';
        }, instance);
    }
    instance.updateSiteDirectives = function () {
        var req = [
			            'RefreshRewriteCache',
			            []
		            ]
        new Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) { return; }, instance);
    }
    instance.submitOnEnter = function (e) {
        if (e.keyCode === 13) {
            instance.preview();
        }
    }
    instance.init = function () {
        instance.tabs = [];
        instance.tabs[1] = new Rendition.UI.TabBarTab({
            title: Rendition.Localization['UrlRewrite_Directives'].Title,
            load: function (tab, tabBar, content) {
                instance.grid = new Rendition.UI.Grid({
                    objectName: 'redirector',
                    parentNode: content,
                    editMode: 3,
                    genericEditor: true,
                    editorParameters: {
                        groups: instance.editorGroup()
                    },
                    recordupdated: function () {
                        instance.updateSiteDirectives();
                    }
                });
            }
        });
        instance.refreshRewriteCache = function () {
            var url = 'method1=["RefreshRewriteCache",[]]';
            instance.reqEval = new Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                var a = JSON.parse(e.responseText);
                if (a.method1.RefreshRewriteCache.error === 0) {
                    instance.recalculate(function () {
                        instance.startNewItem(null, instance.itemsGrid);
                    });
                }
            }, instance);
        }
        instance.tabs[0] = new Rendition.UI.TabBarTab({
            title: Rendition.Localization['UrlRewrite_Regex_Test_Tool'].Title,
            load: function (tab, tabBar, content) {
                if (content.innerHTML === '') {
                    instance.cutter = new Rendition.UI.CutterBar({
                        parentNode: content,
                        autoResize: false,
                        id: 'URLRewriteCutter1',
                        position: 400,
                        orientation: 0
                    });
                    instance.cutter.cutters[1].style.background = 'black';
                    var gridFormGroup = [
				                    {
				                        name: Rendition.Localization['UrlRewrite_Preview_URL'].Title,
				                        expanded: true,
				                        inputs: [
                                            {
                                                displayName: Rendition.Localization['UrlRewrite_URL'].Title,
                                                name: 'url',
                                                inputType: 'text'
                                            }
						                ]
				                    },
                                    {
                                        name: Rendition.Localization['UrlRewrite_Directive'].Title,
                                        expanded: true,
                                        inputs: [
                                            {
                                                displayName: Rendition.Localization['UrlRewrite_Match_Pattern'].Title,
                                                name: 'urlMatchPattern',
                                                inputType: 'text'
                                            },
                                            {
                                                displayName: Rendition.Localization['UrlRewrite_Replace_Pattern'].Title,
                                                name: 'urlToRedirectTo',
                                                inputType: 'text'
                                            },
                                            {
                                                displayName: Rendition.Localization['UrlRewrite_Response_Status'].Title,
                                                name: 'errorMatch',
                                                inputType: 'text'
                                            },
                                            {
                                                displayName: Rendition.Localization['UrlRewrite_Content_Type'].Title,
                                                name: 'contentType',
                                                inputType: 'text'
                                            },
                                            {
                                                displayName: Rendition.Localization['UrlRewrite_Execution_Order'].Title,
                                                name: 'order',
                                                inputType: 'numericUpDown'
                                            },
                                            {
                                                displayName: Rendition.Localization['UrlRewrite_Type'].Title,
                                                name: 'type',
                                                inputType: 'select',
                                                options: [
                                                    ['Response Filter', Rendition.Localization['UrlRewrite_Response_Filter'].Title],
                                                    ['Rewriter', Rendition.Localization['UrlRewrite_URL_Rewriter'].Title],
                                                    ['Redirector', Rendition.Localization['UrlRewrite_URL_Redirector'].Title],
                                                    ['Error',Rendition.Localization['UrlRewrite_Custom_Error'].Title]
                                                ]
                                            }
						                ]
                                    }
			                    ]

                    instance.menuBarElements = [];
                    instance.menuBarElements.push(new Rendition.UI.MenuOption({
                        text: Rendition.Localization['UrlRewrite_Preview'].Title,
                        mousedown: function (e) {
                            instance.preview();
                        }
                    }));
                    instance.menuBarElements.push(new Rendition.UI.MenuOption({
                        text: Rendition.Localization['UrlRewrite_Load_Directive'].Title,
                        mousedown: function (e) {
                            new Rendition.UI.SelectDialog({
                                objectName: 'redirector',
                                ordinal: 0,
                                inputTitle: Rendition.Localization['UrlRewrite_Redirector_Id'].Title,
                                boxTitle: Rendition.Localization['UrlRewrite_Select_a_redirector'].Title,
                                title: Rendition.Localization['UrlRewrite_Select_redirector'].Title,
                                callbackProcedure: function (e) {
                                    var selectedId = e.selectedValue;
                                    var row = e.grid.getRecordById(selectedId);
                                    instance.previewId = selectedId;
                                    instance.form.getInputByName('urlMatchPattern').value = row[1];
                                    instance.form.getInputByName('urlToRedirectTo').value = row[2];
                                    instance.form.getInputByName('errorMatch').value = row[3];
                                    instance.form.getInputByName('contentType').value = row[4];
                                    instance.form.getInputByName('type').value = row[5];
                                    instance.form.getInputByName('order').value = row[6];
                                }
                            });
                        }
                    }));
                    instance.menuBar = new Rendition.UI.MenuBar({
                        options: instance.menuBarElements,
                        parentNode: instance.cutter.cutters[0]
                    });
                    instance.form = new Rendition.UI.Form({
                        name: 'UrlRewrite',
                        titleWidth: '100px',
                        layout: gridFormGroup,
                        offsetRect: { h: 0, w: 0, x: 0, y: instance.menuBar.rect.h + 10 },
                        scroll: true
                    });
                    instance.form.appendTo(instance.cutter.cutters[0]);
                    var type = instance.form.getInputByName('type');
                    Rendition.UI.appendEvent('change', type, instance.setFormState, false);
                }
            }
        });
        instance.tabbar = new Rendition.UI.TabBar({
            tabs: instance.tabs,
            parentNode: args.parentNode,
            activeTabIndex: 0
        });
    }
    instance.setFormState = function (e) {
        var title = function (inputName, title) {
            instance.form.getInputByName(inputName).parentNode.
                        parentNode.firstChild.firstChild.textContent = title;
        }
        var mode = this.value;
        if (mode === 'Response Filter') {
            title('url', 'Sample Text');
            title('urlMatchPattern', 'Regex Match Text');
            title('urlToRedirectTo', 'Replace Text');
            title('errorMatch', 'Not Used');
            title('contentType', 'Regex Content Type Match');
        } else if (mode === 'Rewriter') {
            title('url', 'URL');
            title('urlMatchPattern', 'Regex External URL');
            title('urlToRedirectTo', 'Replace Internal URL');
            title('errorMatch', 'Set Status To');
            title('contentType', 'Set Content Type To');
        } else if (mode === 'Redirector') {
            title('url', 'URL');
            title('urlMatchPattern', 'Regex Redirect From');
            title('urlToRedirectTo', 'Replace Redirect To');
            title('errorMatch', 'Set Status To');
            title('contentType', 'Not Used');
        } else if (mode === 'Error') {
            title('url', 'URL');
            title('urlMatchPattern', 'Regex Match URL');
            title('urlToRedirectTo', 'Replace Internal URL');
            title('errorMatch', 'When error status is');
            title('contentType', 'Not Used');
        }
        return;
    }
    instance.init();
    return instance;
}