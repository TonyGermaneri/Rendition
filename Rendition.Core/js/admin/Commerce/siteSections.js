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
* Site sections editor.
* @constructor
* @name Rendition.Commerce.SiteSections
*/
Rendition.Commerce.SiteSections = function (args) {
    var instance = {}
    instance.imageFolder = '<img style="margin-bottom:-4px;" src="/admin/img/icons/table_multiple.png"> ';
    instance.imageEntry = '<img style="margin-bottom:-4px;" src="/admin/img/icons/table.png"> ';
    instance.addText = '<img style="margin-bottom:-4px;" src="/admin/img/icons/bullet_add.png"> Add';
    instance.imageActive = '<img style="margin-bottom:-4px;" src="/admin/img/icons/bullet_black.png">';
    instance.imageInactive = '<img style="margin-bottom:-4px;" src="/admin/img/icons/bullet_white.png">';
    instance.mode = 'script';
    args = args === undefined ? {} : args;
    if (args.mode !== undefined) {
        instance.mode = args.mode;
    }
    if (args.parentNode === undefined) {
        instance.dialog = Rendition.UI.dialogWindow({
            rect: { x: Rendition.UI.dialogPosition.x,
                y: Rendition.UI.dialogPosition.y,
                h: document.documentElement.clientHeight - 100, w: 700
            },
            title: Rendition.Localization['SiteSections_Sections_Editor'].Title,
            rememberPosition: true,
            id: 'siteSectionsEditorAllByItself'
        });
        args.parentNode = instance.dialog.content;
    }
    instance.refreshTree = function () {
        instance.cutter.cutters[0].innerHTML = '';
        instance.rootdata = {
            text: 'sections',
            childNodes: instance.childNodes(instance.sectionList, 0)
        }
        instance.sections = Rendition.UI.TreeView({
            parentNode: instance.cutter.cutters[0],
            rootNode: instance.rootdata,
            includeRoot: false,
            labelclick: instance.labelClick,
            labelcontextmenu: instance.labelContextMenu
        });
    }
    instance.init = function () {
        instance.cutter = Rendition.UI.CutterBar({
            position: 200,
            autoResize: false,
            parentNode: args.parentNode
        });
        instance.sectionsGrid = Rendition.UI.Grid({
            objectName: 'siteSections',
            editMode: 3,
            suffix: 'where 1=2',
            genericEditor: true,
            editorParameters: {
                groups: instance.sectionGroup(),
                supressUpdateButton: true
            }
        });
        instance.sectionsDetailGrid = Rendition.UI.Grid({
            objectName: 'siteSectionsDetail',
            editMode: 3,
            suffix: 'where 1=2',
            genericEditor: true,
            editorParameters: {
                groups: instance.entryGroup(),
                supressUpdateButton: true
            }
        });
        instance.refresh(instance.refreshTree);
    }
    instance.refresh = function (callbackProc) {
        var req1 = [
			"DataSet",
			['siteSections', ' where not siteSectionId in (select categoryId from categories with (nolock))', '0', '9999999', '', {}, [], 'JSON', true, '-1', false, 'name', 'asc']
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
            var f = JSON.parse(e.responseText);
            instance.dataSet = f.method1.DataSet;
            instance.sectionList = instance.dataSet.data;
            callbackProc.apply(instance, []);
        }, instance);
    }
    instance.childNodes = function (data, type) {
        var childNodes = [];
        var l = data.length;
        for (var x = 0; l > x; x++) {
            var req = [
				"DataSet",
				['siteSectionsDetail', 'where siteSectionId = \'' + data[x][0] + '\'', '0', '9999999', '', {}, [], 'JSON', true, '-1', false, 'addDate', 'asc']
			]
            var text = null;
            var value = null;
            if (type == 0) {
                img = instance.imageFolder;
                text = img + data[x][1];
            } else {
                img = instance.imageEntry;
                if (data[x][4] == "1") {
                    text = instance.imageActive + img + data[x][5] + ' ' + data[x][3];
                } else {
                    text = instance.imageInactive + img + data[x][5] + ' ' + data[x][3];
                }
            }
            value = data[x][0];
            var cn = {
                url: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req),
                callbackArguments: [String(data[x][0])],
                callbackProcedure: function (_id, json, tree, node) {
                    var a = json.method1.DataSet;
                    if (a.error == 0) {
                        var treeObj = instance.childNodes(a.data, 1);
                        var l = treeObj.length;
                        while (node.firstChild) {
                            for (var x = 0; instance.sections.treeNodes.length > x; x++) {
                                if (instance.sections.treeNodes[x].treeNodeId == node.firstChild.treeNodeId) {
                                    instance.sections.treeNodes.splice(x, 1);
                                    break;
                                }
                            }
                            node.removeChild(node.firstChild);
                        }
                        for (var x = 0; l > x; x++) {
                            tree.add(treeObj[x], node);
                        }
                        tree.add({
                            id: _id,
                            text: instance.addText,
                            value: 'newentry',
                            childNodes: [],
                            data: [Rendition.UI.emptyUUID, _id]
                        }, node);
                    } else {
                        instance.errorMessage(a);
                        tree.preventDefault();
                    }
                    return false;
                }
            }
            if (type != 0) {
                cn = [];
            }
            childNodes.push({
                text: text,
                value: value,
                childNodes: cn,
                data: data[x]
            });
        }
        if (type == 0) {
            childNodes.push({
                text: instance.addText,
                value: 'newsection',
                childNodes: [],
                data: [Rendition.UI.emptyUUID]
            });
        }
        return childNodes;
    }
    instance.labelClick = function (e, treeView, node, labelText, treeNode, parentNode) {
        if (instance.entryForm === undefined) {
            instance.loadNodeForEditing(e, treeView, node, labelText, treeNode, parentNode);
            return;
        }
        if (instance.entryForm.dirty()) {
            instance.checkSave(function () {
                instance.loadNodeForEditing(e, treeView, node, labelText, treeNode, parentNode);
            });
        } else {
            instance.loadNodeForEditing(e, treeView, node, labelText, treeNode, parentNode);
        }
        treeView.preventDefault();
    }
    instance.loadNodeForEditing = function (e, treeView, node, labelText, treeNode, parentNode) {
        var nType = treeNode.value;
        if (treeNode.data.length == 6) {
            nType = 'section';
        } else if (treeNode.data.length == 7) {
            nType = 'entry';
        }
        treeView.highlightLabelText(labelText);
        if (nType == 'section') {
            instance.cutter.cutters[1].innerHTML = '';
            instance.entryEditor(treeNode.data, instance.cutter.cutters[1], node, nType);
        } else if (nType == 'entry') {
            instance.cutter.cutters[1].innerHTML = '';
            instance.entryEditor(treeNode.data, instance.cutter.cutters[1], node, nType);
        } else if (nType == 'newsection') {
            instance.cutter.cutters[1].innerHTML = '';
            instance.entryEditor(treeNode.data, instance.cutter.cutters[1], node, nType);
        } else if (nType == 'newentry') {
            instance.cutter.cutters[1].innerHTML = '';
            instance.entryEditor(treeNode.data, instance.cutter.cutters[1], node, nType);
        }
    }
    instance.checkSave = function (okCallback) {
        instance.confirmSave = Rendition.UI.ConfirmDialog({
            ontrue: function () {
                instance.cutter.cutters[1].innerHTML = '';
                okCallback.apply(instance, []);
                instance.confirmSave.dialog.close();
            },
            onfalse: function () {
                instance.confirmSave.dialog.close();
            },
            title: Rendition.Localization['SiteSections_Save_before_you_go'].Title,
            subTitle: Rendition.Localization['SiteSections_Save_changes'].Title,
            message: Rendition.Localization['SiteSections_Do_you_want_to_save_changes_before_you_go'].Title,
            dialogRect: { x: (document.documentElement.clientWidth * .5) - (450 * .5), y: 75, h: 173, w: 450 }
        });
    }
    instance.entryEditor = function (data, parentNode, node, nType) {
        var content = instance.cutter.cutters[1];
        if (content.innerHTML == '') {
            if (data[0] != Rendition.UI.emptyUUID) {
                if (nType != 'section') {
                    var req1 = ["DataSet",
						['siteSectionsDetail', 'where siteSectionDetailId = \'' + data[0] + '\'', '1', '1', '', {}, [], 'JSON', true, '-1', false, '', '']
					]
                } else {
                    var req1 = ["DataSet",
						['siteSections', 'where siteSectionId = \'' + data[0] + '\'', '1', '1', '', {}, [], 'JSON', true, '-1', false, '', '']
					]
                }
                var req2 = ["GetSqlArray",
					[{ commandText: 'select top 1 URL from siteSections s ' +
					' left join siteSectionsDetail sd on s.siteSectionId = sd.siteSectionId ' +
					' where sd.siteSectionDetailId = \'' + data[0] + '\' or s.siteSectionId = \'' + data[0] + '\';'
					}]
				]
                var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI() +
				'&method2=' + JSON.stringify(req2).toURI();
                var reqEval = Rendition.UI.Ajax(url, function (e) {
                    var a = JSON.parse(e.responseText);
                    instance.previewURL = a.method2.GetSqlArray[0][0];
                    if (nType != 'section') {
                        instance.formStruct = {
                            dataSet: a.method1.DataSet,
                            groups: instance.entryGroup()
                        }
                    } else {
                        instance.formStruct = {
                            dataSet: a.method1.DataSet,
                            groups: instance.sectionGroup()
                        }
                    }
                    instance.entryForm = Rendition.UI.Form(instance.formStruct);
                    instance.entryForm.appendTo(content);
                    instance.entryForm.groupBoxes[0].outer.style.marginTop = '37px';
                }, instance);
            } else {
                if (nType == 'newsection') {
                    var row = instance.sectionsGrid.newRecord({
                        unique_siteId: Rendition.Commerce.site.SiteId
                    });
                    instance.entryForm = instance.sectionsGrid.genericEditor(
						instance.sectionsGrid.newRowIndex, { parentNode: content }, row
					);
                    instance.entryForm.groupBoxes[0].outer.style.marginTop = '37px';
                } else {
                    var row = instance.sectionsDetailGrid.newRecord({
                        siteSectionId: data[1],
                        active: false
                    });
                    instance.entryForm = instance.sectionsDetailGrid.genericEditor(
						instance.sectionsDetailGrid.newRowIndex, { parentNode: content }, row
					);
                    instance.entryForm.groupBoxes[0].outer.style.marginTop = '37px';
                }
            }
        }
        instance.entryFormSave = function (e) {
            instance.entryForm.save(true, 1, function () {
                if (node.parentNode) {
                    /* refresh the node this item was just added to */
                    node.refreshParent();
                }
                /* maket one, and only one entry is selected in this group */
                if (nType != 'section') {
                    instance.makeSureGroupHasAssignment(instance.entryForm.data[0]);
                    /* and remove the cached version if any */
                    instance.clearSiteSectionCacheForId(instance.entryForm.data[0]);
                }
                if (nType != 'entry') {
                    /* refresh root node */
                    instance.refresh(instance.refreshTree);
                }
            }, false/*async*/);
            return false;
        }
        instance.menuBarElements = [];
        instance.menuBarElements[0] = Rendition.UI.MenuOption();
        instance.menuBarElements[0].text = Rendition.Localization['SiteSections_Save'].Title;
        Rendition.UI.appendEvent('click', instance.menuBarElements[0], instance.entryFormSave, false);
        instance.menuBarElements[1] = Rendition.UI.MenuOption();
        instance.menuBarElements[1].text = 'Preview URL';
        Rendition.UI.appendEvent('click', instance.menuBarElements[1], function (e) {
            var u = instance.entryForm.getInputByName('URL');
            if (u != null) {
                instance.previewURL = u.value;
            }
            if (instance.previewURL.length > 0) {
                var ap = '';
                if (nType != 'section') {
                    ap = Rendition.UI.iif(instance.previewURL.indexOf('?') != -1, '&', '?') + '___siteSectionDetailId___=' + data[0] +
					'&___siteSectionId___=' + data[1];
                }
                new Rendition.UI.IFrameDialog({
                    title: 'Preview - ' + instance.previewURL,
                    src: instance.previewURL + ap
                });
            } else {
                alert(Rendition.Localization['SiteSections_You_need_to_first_type_the_URL_to_preview_into_the_URL_box'].Title);
            }
        }, false);

        if (nType != 'section') {
            instance.menuBarElements[2] = Rendition.UI.MenuOption();
            instance.menuBarElements[2].text = Rendition.Localization['SiteSections_Set_As_Active_Entry'].Title;
            Rendition.UI.appendEvent('click', instance.menuBarElements[2], function (e) {
                instance.setActiveEntry(data[0], undefined);
                return false;
            }, false);
        }
        instance.menuBar = Rendition.UI.MenuBar({
            options: instance.menuBarElements,
            parentNode: instance.cutter.cutters[1]
        });
    }
    instance.switchEditModes = function () {
        var thisSelect = this;
        var trueFunc = function () {
            instance.mode = thisSelect.value;
            instance.entryForm.dispose();
            instance.formStruct.groups = instance.entryGroup();
            instance.formStruct.name = 'SectionEntry';
            instance.entryForm = Rendition.UI.Form(instance.formStruct);
            instance.entryForm.appendTo(instance.cutter.cutters[1]);
            instance.entryForm.groupBoxes[0].outer.style.marginTop = '37px';
            var m = instance.entryForm.getInputByName('mode');
            Rendition.UI.appendEvent('change', m, instance.switchEditModes, false);
            m.value = instance.mode;
            if (instance.confirmSave) {
                instance.confirmSave.dialog.close();
            }
        }
        if (instance.entryForm.dirty()) {
            instance.confirmSave = Rendition.UI.ConfirmDialog({
                ontrue: trueFunc,
                onfalse: function () {
                    instance.confirmSave.dialog.close();
                },
                title: Rendition.Localization['SiteSections_Save_before_you_change_modes'].Title,
                subTitle: Rendition.Localization['SiteSections_Save_changes'].Title,
                message: Rendition.Localization['SiteSections_The_editor_needs_to_close_and_reopen'].Title,
                dialogRect: { x: (document.documentElement.clientWidth * .5) - (450 * .5), y: 75, h: 173, w: 450 }
            });
        } else {
            trueFunc();
        }
    }
    instance.setActiveEntry = function (siteSectionDetailId, n) {
        var req = [
		'GetSqlArray',
			[{ commandText:
				"update dbo.siteSectionsDetail \n" +
				"set active = 0 \n" +
				"where siteSectionId = (select \n" +
				"	siteSectionId from dbo.siteSectionsDetail \n" +
				"	where siteSectionDetailId = '" + siteSectionDetailId + "' \n" +
				"); \n" +
				"update dbo.siteSectionsDetail \n" +
				"set active = 1 \n" +
				"where siteSectionDetailId = '" + siteSectionDetailId + "';"
			}]
		]
        var ref = instance.entryForm.getInputByName('siteSectionDetailId');
        if (ref != null) {
            if (ref.value == siteSectionDetailId) {
                instance.entryForm.getInputByName('active').checked = true;
            }
        }
        instance.setActiveSiteSectionDetailId = siteSectionDetailId;
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            instance.refreshSiteSections();
            n = n || instance.sections.getNodeByValue(instance.setActiveSiteSectionDetailId);
            if (n.refreshParent) {
                n.refreshParent();
            }
            if (n.element.refreshParent) {
                n.element.refreshParent();
            }
            return;
        }, instance);
    }
    instance.makeSureGroupHasAssignment = function (siteSectionDetailId) {
        var req = [
			'GetSqlArray',
			[{ commandText:
				"if not exists(select 0 from dbo.siteSectionsDetail \n" +
				"		where active = 1 and siteSectionDetailId = '" + siteSectionDetailId + "') begin  \n" +
				"	update dbo.siteSectionsDetail set active = 1  \n" +
				"	where siteSectionDetailId = (  \n" +
				"		select top 1 siteSectionDetailId  \n" +
				"		from dbo.siteSectionsDetail  \n" +
				"		where siteSectionId = (  \n" +
				"			select top 1 siteSectionId from dbo.siteSectionsDetail  \n " +
				"			where siteSectionDetailId = '" + siteSectionDetailId + "'  \n" +
				"		)  \n" +
				"		order by addDate  \n" +
				"	)  \n" +
				"end  "
			}]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            /* now that's done refresh the site cache */
            instance.refreshSiteSections();
            return;
        }, instance);
    }
    instance.refreshSiteSections = function () {
        var req = [
			'RefreshSiteSectionsCache',
			[]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            return;
        }, instance);
    }
    instance.clearSiteSectionCacheForId = function (siteSectionDetailId) {
        var req = [
			'ClearSiteSectionCacheForId',
			[siteSectionDetailId]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            return;
        }, instance);
    }
    instance.labelContextMenu = function (e, treeView, node, labelText, treeNode, parentNode) {
        var optionIndex = -1;
        var options = [];
        if (treeNode.data.length == 6) {
            nType = 'section';
        } else if (treeNode.data.length == 7) {
            nType = 'entry';
        }
        if (nType == 'entry') {
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = Rendition.Localization['SiteSections_Delete_Entry'].Title;
            Rendition.UI.appendEvent('click', options[optionIndex], function () {/*TODO:put delete reciprcol replies here */
                var req = ['SqlCommand', ['delete from siteSectionsDetail where siteSectionDetailId = \'' + treeNode.data[0] + '\'']];
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                    var f = JSON.parse(e.responseText);
                    if (f.method1.SqlCommand.error != 0) {
                        alert(f.method1.SqlCommand.description);
                    } else {
                        treeView.removeNode(node);
                    }
                }, instance);
            }, false);
        }
        if (nType == 'section') {
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = Rendition.Localization['SiteSections_Delete_Section'].Title;
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                var req = ['SqlCommand', ['delete from siteSections where siteSectionId = \'' + treeNode.data[0] + '\';'
				+ 'delete from siteSectionsDetail where siteSectionId = \'' + treeNode.data[0] + '\';']];
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                    var f = JSON.parse(e.responseText);
                    if (f.method1.SqlCommand.error != 0) {
                        alert(f.method1.SqlCommand.description);
                    } else {
                        treeView.removeNode(node);
                    }
                }, instance);
            }, false);
        }
        if (nType == 'entry') {
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = Rendition.Localization['SiteSections_Set_As_Active_Entry'].Title;
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                instance.setActiveEntry(treeNode.data[0], node);
            }, false);
        }
        if (options.length > 0) {
            var menu = Rendition.UI.ContextMenu(e, {
                elements: options,
                caller: this,
                type: 'mouse'
            });
            e.preventDefault();
            treeView.preventDefault();
        }
        treeView.highlightLabelText(labelText);
    }
    instance.entryGroup = function () {
        var a = [{
            name: Rendition.Localization['SiteSections_Properties'].Title,
            expanded: true,
            inputs: [
					{
					    columnName: 'addDate',
					    displayName: 'Date Added'
					},
					{
					    columnName: 'description',
					    displayName: 'Description'
					},
				]
        },
			{
			    name: 'Source',
			    expanded: true,
			    inputs: [
					{
					    columnName: 'data',
					    inputType: 'rte',
					    saveProcedure: instance.entryFormSave
					}
				]
			}
		];
        return a;
    }
    instance.sectionGroup = function () {
        var a = [];
        a.push({
            name: Rendition.Localization['SiteSections_Properties'].Title,
            expanded: true,
            inputs: [
				{
				    columnName: 'name',
				    displayName: 'Name'
				},
				{
				    columnName: 'description',
				    displayName: 'Description'
				},
				{
				    columnName: 'URL',
				    preview: 'Preview URL'
				}
			]
        });
        return a;
    }
    instance.init();
    return instance;
}