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
* Menu editor.
* @constructor
* @name Rendition.Commerce.MenuEditor
*/
Rendition.Commerce.MenuEditor = function (args) {
    var instance = {}
    if (args === undefined) { args = {} }
    instance.init = function () {
        if (args.parentNode === undefined) {
            instance.dialog = Rendition.UI.dialogWindow({
                rect: { 
                    x: Rendition.UI.dialogPosition.x,
                    y: Rendition.UI.dialogPosition.y,
                    h: document.documentElement.clientHeight - 100, 
                    w: 900
                },
                title: Rendition.Localization['MenuEditor_Menu_Editor'].Title,
                rememberPosition: true,
                id: 'menuEditorAllByItself'
            });
            args.parentNode = instance.dialog.content;
        }
        instance.rootCutter = Rendition.UI.CutterBar({
            parentNode: args.parentNode,
            autoResize: false,
            id: 'imagemenusCutter1',
            position: 220
        });
        instance.grid = Rendition.UI.Grid({
            objectName: 'menus',
            editMode: 3
        });
        instance.initTreeView();
        return instance;
    }
    instance.initTreeView = function () {
        var req1 = [
			"DataSet",
			['menus', args.rootSuffix || 'where parentId = \'' + Rendition.UI.emptyUUID + '\' and not menuId in (select categoryId from categories with (nolock))', '1', '9999999', '', {}, [], 'JSON', true, '-1', false, 'menuName', 'asc']
		]
        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1);
        var reqEval = Rendition.UI.Ajax(url, function (e) {
            var a = JSON.parse(e.responseText);
            instance.menus = a.method1.DataSet.data;
            instance.tree = Rendition.UI.TreeView({
                parentNode: instance.rootCutter.cutters[0],
                rootNode: {
                    text: Rendition.Localization['MenuEditor_Menus'].Title,
                    value: 'root',
                    childNodes: instance.menuNodes
                },
                labelclick: instance.labelClick,
                labelcontextmenu: instance.labelContextMenu,
                refresh: function () {
                    instance.rootCutter.cutters[0].innerHTML = '';
                    instance.initTreeView();
                },
                drop: instance.dropTreeNode,
                dragMode: 0
            });
        }, instance);
        return instance;
    }
    instance.treeObject = function (data, nodeName) {
        var childNodes = [];
        var l = data.length;
        if (l != 0) {
            for (var x = 0; l > x; x++) {
                childNodes.push({
                    text: '<img style="margin-bottom:-4px;" src="/admin/img/icons/application_cascade.png" alt=""> ' +
                     data[x][1] + " ( Order:" + data[x][5] + " )",
                    value: data[x][0],
                    data: data[x],
                    childNodes: {
                        url: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify([
							"DataSet",
							['menus', 'where parentId = \'' + data[x][0] + '\'', '0', '9999999', '', {}, [], 'JSON', true, '-1', false, 'listOrder', 'asc']
						]),
                        callbackArguments: [String(data[x][0])],
                        callbackProcedure: function (id, json, tree, node) {
                            var a = json.method1.DataSet;
                            if (a.error == 0) {
                                var treeObj = instance.treeObject(a.data, node);
                                var l = treeObj.length;
                                while (node.firstChild) { node.removeChild(node.firstChild) }
                                for (var x = 0; l > x; x++) {
                                    tree.add(treeObj[x], node);
                                }
                                tree.add({
                                    text: Rendition.Localization['MenuEditor_Add_a_menu'].Title,
                                    value: id,
                                    childNodes: []
                                }, node);
                            } else {

                            }
                        }
                    }
                });
            }
        }
        return childNodes;
    }
    instance.menuNodes = function (treeView, treeNode, parentNode) {
        var l = instance.menus.length;
        for (var x = 0; l > x; x++) {
            var id = String(instance.menus[x][0]);
            var req = [
				"DataSet",
				['menus', 'where parentId = \'' + id + '\'', '0', '9999999', '', {}, [], 'JSON', true, '-1', false, 'listOrder', 'asc']
			]
            treeView.add({
                text: '<img style="margin-bottom:-4px;" src="/admin/img/icons/application_cascade.png" alt="Menu"> ' +
                 '<span style="font-weight:bold;">' + String(instance.menus[x][1] + " ( Order:" + instance.menus[x][5] + " )"),
                value: String(instance.menus[x][1]),
                data: instance.menus[x],
                template: true,
                childNodes: {
                    url: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req),
                    callbackArguments: [String(id)],
                    callbackProcedure: function (id, json, tree, node) {
                        var a = json.method1.DataSet;
                        if (a.error == 0) {
                            var treeObj = instance.treeObject(a.data, node);
                            var l = treeObj.length;
                            while (node.firstChild) { node.removeChild(node.firstChild) }
                            for (var x = 0; l > x; x++) {
                                tree.add(treeObj[x], node);
                            }
                            treeView.add({
                                text: Rendition.Localization['MenuEditor_Add_a_menu'].Title,
                                value: id,
                                childNodes: []
                            }, node);
                        } else {
                            instance.errorMessage(a);
                            tree.preventDefault();
                        }
                        return false;
                    }
                }
            }, parentNode);
        }
        if (args.rootSuffix === undefined) {
            treeView.add({
                text: Rendition.Localization['MenuEditor_Add_a_menu'].Title,
                value: Rendition.UI.emptyUUID,
                childNodes: []
            }, parentNode);
        }
    }
    instance.formStruct = function (inReadObject, inCallbackProcedure) {
        var a =
		{
		    callbackProcedure: inCallbackProcedure,
		    dataSet: inReadObject,
		    groups:
			[
				{
				    name: Rendition.Localization['MenuEditor_General'].Title,
				    expanded: true,
				    inputs: [
						{
						    columnName: 'menuName',
						    displayName: 'Link Text',
						    autoComplete: {
						        mustMatchPattern: /.+/i,
						        patternMismatchMessage: 'This field must contain a value.',
						        patternMismatchTitle: 'Invalid value.'
						    }
						},
						{
						    columnName: 'href',
						    displayName: 'Link URL (Address)',
						    autoComplete: {
						        mustMatchPattern: /.+/i,
						        patternMismatchMessage: 'This field must contain a value.',
						        patternMismatchTitle: 'Invalid value.'
						    }
						},
						{
						    columnName: 'enabled'
						}
					]
				},
				{
				    name: 'Description',
				    expanded: true,
				    inputs: [
						{
						    columnName: 'menuDescription',
						    inputType: 'rte'
						}
					]
				}
			]
		}
        return a;
    }
    instance.labelClick = function (e, treeView, node, labelText, treeNode, parentNode) {
        if (treeNode.text != '- Add a menu -') {
            var req = [
				"DataSet",
				['menus', 'where menuId = \'' + treeNode.data[0] + '\'', '0', '9999999', '', {}, [], 'JSON', true, '-1', false, 'listOrder', 'asc']
			]
            instance.selectedId = treeNode.data[0];
            var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
            var reqEval = Rendition.UI.Ajax(url, function (e) {
                var a = JSON.parse(e.responseText);
                instance.rootCutter.cutters[1].innerHTML = '';
                if (a.method1.error !== undefined) {
                    alert(a.method1.description);
                } else {
                    instance.menuBarElements = [];
                    instance.menuBarElements[0] = Rendition.UI.MenuOption();
                    instance.menuBarElements[0].text = Rendition.Localization['MenuEditor_Save_Menu'].Title;
                    Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
                        instance.form.save(undefined, undefined, function () {
                            instance.refreshSiteMenus();
                        }, false);
                        return false;
                    }, false);
                    instance.menuBar = Rendition.UI.MenuBar({
                        options: instance.menuBarElements,
                        parentNode: instance.rootCutter.cutters[1]
                    });

                    instance.form = Rendition.UI.Form(instance.formStruct(a.method1.DataSet));
                    instance.form.groupBoxes[0].outer.style.marginTop = '40px';
                    instance.form.getInputByName('menuName').style.width = '200px';
                    instance.form.getInputByName('href').style.width = '200px';
                    instance.form.appendTo(instance.rootCutter.cutters[1]);
                }
            }, instance);
        } else {
            var newRecordRow = instance.grid.newRecord({
                unique_siteId: Rendition.Commerce.site.SiteId,
                menuId: Rendition.UI.createUUID,
                parentId: treeNode.value
            });
            instance.newRecordForm = instance.grid.genericEditor(instance.grid.newRowIndex, instance.formStruct(instance.grid.dataSet, function () {
                node.refreshParent();
                instance.refreshSiteMenus();
                return;
            }), newRecordRow);
        }
    }
    instance.refreshSiteMenus = function () {
        var req = [
			'RefreshMenus',
			[]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            return;
        }, instance);
    }
    instance.labelContextMenu = function (e, treeView, node, labelText, treeNode, parentNode) {
        var optionIndex = -1;
        var options = [];
        optionIndex++;
        options[optionIndex] = Rendition.UI.MenuOption();
        options[optionIndex].text = Rendition.Localization['MenuEditor_Copy_Menu'].Title;
        Rendition.UI.appendEvent('click', options[optionIndex], function () {
            Rendition.copyMenuSource = treeNode.data[0];
        }, false);
        if (Rendition.copyMenuSource !== undefined) {
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = Rendition.Localization['MenuEditor_Paste_Menu_as_Sibling'].Title;
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                var req = [
					'PasteMenu',
					[Rendition.copyMenuSource, treeNode.data[7], true/*copy descendants*/]
				]
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                    var f = JSON.parse(e.responseText);
                    if (f.method1.error !== undefined) {
                        alert(f.method1.description);
                        return;
                    } else {
                        node.refreshParent();
                    }
                    instance.refreshSiteMenus();
                }, instance);
            }, false);
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = Rendition.Localization['MenuEditor_Paste_Menu_as_Child'].Title;
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                var req = [
					'PasteMenu',
					[Rendition.copyMenuSource, treeNode.data[0], true/*copy descendants*/]
				]
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                    var f = JSON.parse(e.responseText);
                    if (f.method1.error !== undefined) {
                        alert(f.method1.description);
                        return;
                    } else {
                        node.refreshParent();
                    }
                    instance.refreshSiteMenus();
                }, instance);
            }, false);
        }
        optionIndex++;
        options[optionIndex] = Rendition.UI.MenuOption();
        options[optionIndex].text = Rendition.Localization['MenuEditor_Delete_Menu'].Title;
        Rendition.UI.appendEvent('click', options[optionIndex], function () {
            var req = [
				'SqlCommand',
				['delete from menus where menuId = \'' + treeNode.data[0] + '\'\
				delete from menus where parentId = \'' + treeNode.data[0] + '\'']
			]
            instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                var f = JSON.parse(e.responseText);
                if (f.method1.SqlCommand.error != 0) {
                    alert(f.method1.SqlCommand.description);
                } else {
                    treeView.removeNode(node);
                }
                instance.refreshSiteMenus();
            }, instance);
        }, false);
        var menu = Rendition.UI.ContextMenu(e, {
            elements: options,
            caller: this,
            type: 'mouse'
        });
        e.preventDefault();
        treeView.preventDefault();
        treeView.highlightLabelText(labelText);
    }
    instance.dropTreeNode = function (e, tree, dragSource, dragTarget) {
        var p = dragSource.parentNode;
        var l = p.childNodes.length;
        var node = dragSource.node;
        var order = [];
        if (instance.form) {
            var loadedFormId = instance.form.getInputByName('menuId').value;
        } else {
            var loadedFormId = "";
        }
        for (var x = 0; l > x; x++) {
            var id = p.childNodes[x].getAttribute('value');
            if (id != 'add') {
                order.push({
                    id: id,
                    order: parseInt(x)
                });
                if (loadedFormId == id) {
                    instance.form.getInputByName('listOrder').value = parseInt(x);
                }
            }
        }
        var req1 = [
			"UpdateMenuOrder",
			[JSON.stringify(order)]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
            var f = JSON.parse(e.responseText);
            if (f.method1.UpdateMenuOrder.error != 0) {
                alert(f.method1.UpdateMenuOrder.description);
            }
            /* check the open menu to make sure its order gets updated */
            if (node !== undefined) {
                node.refreshParent();
            }
            instance.refreshSiteMenus();
        }, instance);
        return false;
    }
    instance.init();
    return instance;
}