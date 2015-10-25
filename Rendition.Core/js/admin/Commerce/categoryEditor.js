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
* Category editor.
* @constructor
* @name Rendition.Commerce.CategoryEditor
*/
Rendition.Commerce.CategoryEditor = function (args) {
    var instance = {}
    if (args === undefined) { args = {} }
    instance.imageFolder = '<img style="margin-bottom:-4px;" src="/admin/img/icons/application_view_tile.png"> ';
    instance.imageTag = '<img style="margin-bottom:-4px;" src="/admin/img/icons/tag_blue.png"> ';
    instance.addText = '<img style="margin-bottom:-4px;" src="/admin/img/icons/bullet_add.png"> Add';
    instance.childNodes = function (data) {
        var childNodes = [];
        var l = data.length;
        if (data[0] !== undefined) {
            if (data[0].length === 4) {
                childNodes.push({
                    text: '<img style="margin-bottom:-4px;" src="/admin/img/icons/bullet_add.png"> Add Root Category',
                    value: 'addcat',
                    childNodes: [],
                    data: []
                });
            }
        }
        for (var x = 0; l > x; x++) {
            var req = [
				"DataSet",
				['categoryDetail', 'where categoryId = \'' + data[x][0] + '\'', '0', '9999999', '', {}, [], 'JSON', true, '-1', false, 'listOrder', 'asc']
			]
            var headerIndex = 0;
            var text = null;
            var value = null;
            var img = instance.imageTag;
            var type = '';
            if (data[x].length === 4 || Rendition.UI.emptyUUID != data[x][4]) {
                img = instance.imageFolder;
            }
            if (data[x].length === 4) {
                var header = Rendition.UI.getHeaderByName(instance.dataSet, 'category');
                headerIndex = header.index;
                text = img + data[x][headerIndex];
                value = data[x][0];
                type = 'category';
            } else if (data[x].length === 3) {
                text = img + data[x][1];
                value = data[x][0];
                type = 'category';
            } else {
                text = img + data[x][2];
                if (Rendition.UI.emptyUUID != data[x][4]) {
                    text = img + instance.getCategoryName(data[x][4]);
                    type = 'category';
                    value = data[x][4];
                } else {
                    type = 'item';
                    value = data[x][0];
                }
            }
            if (data[x].length === 4 || Rendition.UI.emptyUUID != data[x][4]) {
                var catId = data[x][0];
                if (Rendition.UI.emptyUUID != data[x][4] && data[x][4] !== undefined) {
                    catId = data[x][4];
                }
                var req = [
					"DataSet",
					['categoryDetail', 'where categoryId = \'' + catId + '\'', '0', '9999999', '', {}, [], 'JSON', true, '-1', false, 'listOrder', 'asc']
				]
                var cn = {
                    url: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req),
                    callbackArguments: [String(data[x][0])],
                    callbackProcedure: function (_id, json, tree, node) {
                        var a = json.method1.DataSet;
                        if (a.error === 0) {
                            var treeObj = instance.childNodes(a.data);
                            var l = treeObj.length;
                            while (node.firstChild) { node.removeChild(node.firstChild) }
                            for (var x = 0; l > x; x++) {
                                tree.add(treeObj[x], node);
                            }
                            tree.add({
                                text: instance.addText,
                                value: 'add',
                                childNodes: [],
                                data: [_id]
                            }, node);
                        } else {
                            instance.errorMessage(a);
                            tree.preventDefault();
                        }
                        return false;
                    }
                }
            } else {
                var cn = {}
            }

            childNodes.push({
                text: text,
                value: value,
                childNodes: cn,
                data: data[x],
                type: type
            });
        }
        return childNodes;
    }
    instance.refresh = function (callbackProc) {
        var req1 = [
			"DataSet",
			['categories', '', '0', '9999999', '', {}, [], 'JSON', true, '-1', false, 'category', 'asc']
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
            var f = JSON.parse(e.responseText);
            instance.dataSet = f.method1.DataSet;
            instance.categoryList = instance.dataSet.data;
            callbackProc.apply(instance, []);
        }, instance);
    }
    instance.initTreeView = function () {
        if (instance.cutter.cutters[0].firstChild != null) {
            instance.cutter.cutters[0].firstChild.innerHTML = '';
        }
        instance.category = Rendition.UI.TreeView({
            parentNode: instance.cutter.cutters[0],
            rootNode: instance.rootdata,
            includeRoot: false,
            labelclick: instance.labelClick,
            labelcontextmenu: instance.labelContextMenu,
            drop: instance.dropTreeNode,
            dragMode: 0
        });
    }
    instance.dropTreeNode = function (e, tree, dragSource, dragTarget) {
        var p = dragSource.parentNode;
        var l = p.childNodes.length;
        var order = [];
        for (var x = 0; l > x; x++) {
            var id = p.childNodes[x].getAttribute('value');
            if (id != 'add') {
                order.push({
                    id: id,
                    order: parseInt(x)
                });
            }
        }
        var req1 = [
			"UpdateCategoryDetailOrder",
			[JSON.stringify(order)]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
            var f = JSON.parse(e.responseText);
            if (f.method1.UpdateCategoryDetailOrder.error != 0) {
                alert(f.method1.UpdateCategoryDetailOrder.description);
            }
            instance.updateCategoryCache();
        }, instance, false);
        return false;
    }
    instance.refreshCallback = function () {
        instance.rootdata = {
            text: 'Categories',
            childNodes: instance.childNodes(instance.categoryList)
        }

        instance.grid = Rendition.UI.Grid({
            selectionMethod: 3,
            editMode: 3,
            objectName: 'categoryDetail',
            suffix: '',
            genericEditor: true
        });

        instance.categoryGrid = Rendition.UI.Grid({
            selectionMethod: 3,
            editMode: 3,
            objectName: 'categories',
            suffix: '',
            genericEditor: true
        });
        instance.initTreeView();
        if (instance.firstTime === undefined) {
            if (args.categoryId !== undefined) {
                instance.openCategoryEditorPane(args.categoryId);
                instance.cutter.minimize();
            }
        }
    }
    instance.init = function () {
        if (args.parentNode === undefined) {
            instance.dialog = Rendition.UI.dialogWindow({
                rect: {
                    x: Rendition.UI.dialogPosition.x,
                    y: Rendition.UI.dialogPosition.y,
                    h: document.documentElement.clientHeight - 100,
                    w: 800
                },
                title: 'Category Editor',
                rememberPosition: true,
                id: 'categoryEditorAllByItself'
            });
            args.parentNode = instance.dialog.content;
        }
        instance.refresh(instance.refreshCallback);
        instance.cutter = Rendition.UI.CutterBar({
            position: 275,
            autoResize: false,
            parentNode: args.parentNode
        });
    }
    instance.openCategoryById = function (categoryId) {
        var l = instance.categoryList.length;
        for (var x = 0; l > x; x++) {
            if (instance.categoryList[x][0] === categoryId) {
                var n = instance.category.getNodeById(categoryId);
                instance.category.highlightLabelText(n);
                instance.openCategoryEditorPane(categoryId);
                break;
            }
        }
    }
    instance.getCategoryName = function (categoryId) {
        var l = instance.categoryList.length;
        for (var x = 0; l > x; x++) {
            if (instance.categoryList[x][0] === categoryId) {
                return instance.categoryList[x][1];
            }
        }
    }
    instance.getAddToCategoryOptions = function () {
        var l = instance.categoryList.length;
        var options = [];
        for (var x = 0; l > x; x++) {
            options.push([
				instance.categoryList[x][0],
				instance.categoryList[x][1],
			]);
        }
        var l = instance.itemList.length;
        for (var x = 0; l > x; x++) {
            options.push([
				instance.itemList[x][0],
				instance.itemList[x][1],
			]);
        }
        return options;
    }
    instance.labelClick = function (e, treeView, node, labelText, treeNode) {
        if (treeNode.value === 'addcat') {
            var newRecordRow = instance.categoryGrid.newRecord({
                categoryId: Rendition.UI.createUUID,
                category: ''
            });
            var gridFormGroup = [
				{
				    name: 'Create Root Category',
				    expanded: true,
				    inputs: [
						{
						    columnName: 'category',
						    autoComplete: {
						        mustMatchPattern: /[a-z 0-9]+/i,
						        patternMismatchMessage: 'Category name can only contain the numbers 0-9 and the letters a-z.',
						        patternMismatchTitle: 'Invalid category name.'
						    }
						}
					]
				}
			]
            var formparams = {
                // this form gets a name even tho it has a dataset becuase it is mixed mode
                name: 'CategoryEditor',
                dataSet: instance.categoryGrid.dataSet,
                groups: gridFormGroup,
                callbackProcedure: function () {
                    setTimeout(function () {
                        instance.updateCategoryCache();
                        instance.refresh(instance.refreshCallback);
                    }, 500);
                    return;
                }
            }

            instance.categoryGrid.genericEditor(instance.categoryGrid.newRowIndex, formparams, newRecordRow);

        } else if (treeNode.value === 'add') {
            var newRecordRow = instance.grid.newRecord({
                categoryDetailId: Rendition.UI.createUUID,
                categoryId: treeNode.data[0],
                itemNumber: '',
                listOrder: '0',
                childCategoryId: Rendition.UI.emptyUUID
            });
            var gridFormGroup = [
				{
				    name: 'Add Items or Categories ',
				    expanded: true,
				    inputs: [
						{
						    grid: {
						        selectionMethod: 3,
						        editMode: 0,
						        objectName: 'addToCategorySelector',
						        suffix: '',
						        genericEditor: true,
						        orderBy: 'Value',
						        orderDirection: 'asc'
						    }
						}
					]
				}
			]
            var formparams = {
                dataSet: instance.grid.dataSet,
                groups: gridFormGroup,
                callbackProcedure: function () {
                    instance.updateCategoryCache();
                    node.refreshParent();
                    return;
                }
            }

            instance.newRecordForm = instance.grid.genericEditor(instance.grid.newRowIndex, formparams, newRecordRow);
            instance.newRecordForm.submitButton.onclick = function () {
                var grid = instance.newRecordForm.grids[0];
                var l = grid.selectedRows.length;
                if (l === 0) {
                    alert('Select one or more rows.  Select multiple rows by holding ctrl or shift while clicking.');
                } else {
                    var rows = [];
                    for (var x = 0; l > x; x++) {
                        var i = grid.getRecord(grid.selectedRows[x])[0];
                        rows.push(i);
                    }
                    instance.newRecordForm.dialog.close();
                }
                var req = [
					'SqlCommand',
					['insertCategoryItem \'' + rows.join(',') + '\',\'' + treeNode.data[0] + '\'']
				]
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                    var f = JSON.parse(e.responseText);
                    node.refreshParent();
                    if (f.method1.SqlCommand.error != 0) {
                        alert(f.method1.SqlCommand.description);
                    }
                    /* HACK: there is no obvious call back entry point
                    for node.refreshParent() so a long timeout should do the trick */
                    setTimeout(function () {
                        instance.dropTreeNode(null, null, node._parentNode.firstChild, null);
                    }, 2000);
                }, instance);
                return;
            }
        } else if (treeNode.type === 'item') {
            instance.cutter.cutters[1].innerHTML = '';
            instance.itemNumber = Rendition.Commerce.ItemEditor({
                parentNode: instance.cutter.cutters[1],
                itemNumber: treeNode.data[2]
            });
        } else {
            instance.openCategoryEditorPane(treeNode.value);
        }
    }
    instance.openCategoryEditorPane = function (categoryId) {
        instance.cutter.cutters[1].innerHTML = '';
        var req = [
                'GetCategoryData',
                [categoryId]
            ]
        var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            var a = JSON.parse(e.responseText);
            a = a.method1.GetCategoryData;
            instance.options = [];
            instance.options.push(new Rendition.UI.TabBarTab({
                title: 'General',
                load: function (tab, tabBar, content) {
                    if (content.innerHTML != '') {
                        return;
                    }
                    var gridFormGroup = [
				            {
				                name: 'General',
				                expanded: true,
				                inputs: [
                                    {
                                        displayName: 'Page Title',
                                        name: 'title',
                                        inputType: 'text'
                                    },
                                    {
                                        displayName: 'Meta Description',
                                        name: 'metaDescription',
                                        inputType: 'text'
                                    },
                                    {
                                        displayName: 'Meta Keywords',
                                        name: 'metaKeywords',
                                        inputType: 'text'
                                    },
                                    {
                                        displayName: 'Heading',
                                        name: 'sectionName',
                                        inputType: 'text'
                                    },
                                    {
                                        displayName: 'Description',
                                        name: 'sectionDescription',
                                        inputType: 'text'
                                    },
                                    {
                                        displayName: 'Enabled',
                                        name: 'enabled',
                                        inputType: 'checkbox'
                                    }
						        ]
				            },
                            {
                                name: 'URLs',
                                expanded: true,
                                inputs: [
                                    {
                                        displayName: 'Actual URL',
                                        name: 'categoryURL',
                                        inputType: 'text'
                                    },
                                    {
                                        displayName: 'Cannocal URL',
                                        name: 'cannocalURL',
                                        inputType: 'text'
                                    }
						        ]
                            },
                            {
                                name: 'Banner',
                                expanded: true,
                                inputs: [
                                    {
                                        name: 'code',
                                        inputType: 'rte'
                                    }
                                ]
                            }
			            ]
                    instance.form = Rendition.UI.Form({ name: 'CategoryEditor', titleWidth: '100px', layout: gridFormGroup, scroll: true });
                    instance.form.appendTo(content);
                    instance.categoryId = categoryId;
                    instance.categoryName = a.category;
                    var sectionName = instance.form.getInputByName('sectionName');
                    var title = instance.form.getInputByName('title');
                    var categoryURL = instance.form.getInputByName('categoryURL');
                    var cannocalURL = instance.form.getInputByName('cannocalURL');
                    var metaDescription = instance.form.getInputByName('metaDescription');
                    var sectionDescription = instance.form.getInputByName('sectionDescription');
                    var metaKeywords = instance.form.getInputByName('metaKeywords');
                    var enabled = instance.form.getInputByName('enabled');
                    sectionName.setAttribute('maxlength', 255);
                    title.setAttribute('maxlength', 80);
                    categoryURL.setAttribute('maxlength', 50);
                    cannocalURL.setAttribute('maxlength', 255);
                    metaDescription.setAttribute('maxlength', 100);
                    sectionDescription.setAttribute('maxlength', 255);
                    metaKeywords.setAttribute('maxlength', 300);
                    sectionName.value = a.sectionName;
                    title.value = a.title;
                    enabled.checked = a.enabled;
                    categoryURL.value = a.categoryURL;
                    cannocalURL.value = a.cannocalURL;
                    metaDescription.value = a.metaDescription;
                    sectionDescription.value = a.sectionDescription;
                    metaKeywords.value = a.metaKeywords;
                    setTimeout(function () {
                        instance.form.rtes[0].value(a.data);
                    }, 0);
                    return;
                }
            }));
            instance.options.push(new Rendition.UI.TabBarTab({
                title: 'Menus',
                load: function (tab, tabBar, content) {
                    instance.menuEditor = Rendition.Commerce.MenuEditor({
                        parentNode: content,
                        rootSuffix: 'where menuId = \'' + categoryId + '\''
                    });
                    return;
                }
            }));
            instance.options.push(new Rendition.UI.TabBarTab({
                title: 'SEO',
                load: function (tab, tabBar, content) {
                    instance.menuEditor = Rendition.Commerce.Seo({
                        parentNode: content,
                        URL: "/category/" + instance.getCategoryName(categoryId).trim().replace(/ /g, '-') + '.html'
                    });
                    return;
                }
            }));
            instance.menuBarElements = [];
            instance.menuBarElements.push(new Rendition.UI.MenuOption({
                text: 'Save',
                mousedown: function (e) {
                    instance.save();
                }
            }));
            instance.menuBar = Rendition.UI.MenuBar({
                options: instance.menuBarElements,
                parentNode: instance.cutter.cutters[1]
            });
            instance.tabs = Rendition.UI.TabBar({
                tabs: instance.options,
                activeTabIndex: 0,
                parentNode: instance.cutter.cutters[1],
                offsetRect: { h: 0, w: 0, x: 0, y: instance.menuBar.rect.h }
            });
        }, instance);
    }
    instance.save = function () {
        var a = {
            categoryId: instance.categoryId,
            name: instance.categoryName,
            sectionName: instance.form.getInputByName('sectionName').value,
            title: instance.form.getInputByName('title').value,
            categoryURL: instance.form.getInputByName('categoryURL').value,
            cannocalURL: instance.form.getInputByName('cannocalURL').value,
            sectionDescription: instance.form.getInputByName('sectionDescription').value,
            metaDescription: instance.form.getInputByName('metaDescription').value,
            metaKeywords: instance.form.getInputByName('metaKeywords').value,
            code: instance.form.getInputByName('code').value,
            enabled: instance.form.getInputByName('enabled').checked
        }
        var req = [
					'SaveCategoryData',
					[a]
				]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            var f = JSON.parse(e.responseText);
            instance.updateCategoryCache();
            if (f.method1.SaveCategoryData.error != 0) {
                alert(f.method1.SaveCategoryData.description);
                return;
            }
            var info = Rendition.UI.Info({
                timeout: 1500,
                position: { x: 30, y: 30 },
                title: 'Save Successful',
                message: 'Saved'
            });
            /* refresh data for sections and categories */
            instance.updateCategoryCache();
            instance.refreshSiteSections();
            instance.refreshSiteMenus();
        }, instance);
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
    instance.refreshSiteSections = function () {
        var req = [
			'RefreshSiteSectionsCache',
			[]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            return;
        }, instance);
    }
    instance.labelContextMenu = function (e, treeView, node, labelText, treeNode) {
        var options = [];
        var optionIndex = -1;
        if (treeNode.data[4] === Rendition.UI.emptyUUID) {
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = 'Remove Item From Category';
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                var req = [
					'SqlCommand',
					['delete from categoryDetail where categoryDetailId = \'' + treeNode.data[0] + '\'']
				]
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                    var f = JSON.parse(e.responseText);
                    node.refreshParent();
                    instance.updateCategoryCache();
                    if (f.method1.SqlCommand.error != 0) {
                        alert(f.method1.SqlCommand.description);
                    }
                }, instance);

            }, false);
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = 'Open in Editor';
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                Rendition.Commerce.ItemEditor({ itemNumber: treeNode.data[2] });
            }, false);
        } else if (treeNode.data.length === 6) {
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = 'Remove Subcategory';
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                var req = [
					'SqlCommand',
					['delete from categoryDetail where categoryDetailId = \'' + treeNode.data[0] + '\'']
				]
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                    var f = JSON.parse(e.responseText);
                    node.refreshParent();
                    instance.updateCategoryCache();
                    if (f.method1.SqlCommand.error != 0) {
                        alert(f.method1.SqlCommand.description);
                    }
                }, instance);
            }, false);
        } else {
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = 'Rename Category';
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                instance.renameDialog = Rendition.UI.dialogWindow({
                    rect: { x: 15, y: 15, h: 145, w: 450 },
                    title: 'Rename Category',
                    modal: true,
                    modalCloseable: true
                });
                var c = instance.renameDialog.content;

                var newCategoryName = document.createElement('input');
                newCategoryName.value = treeNode.data[1];
                var okButton = document.createElement('button');
                var cancelButton = document.createElement('button');
                okButton.style.cssFloat = 'right';
                cancelButton.style.cssFloat = 'right';
                okButton.style.margin = '4px';
                cancelButton.style.margin = '4px';
                cancelButton.onclick = function (e) {
                    instance.renameDialog.close();
                }
                okButton.innerHTML = 'Rename';
                cancelButton.innerHTML = 'Cancel';
                var pt = Rendition.UI.pairtable({
                    rows: [
						[Rendition.UI.txt('Category Name'), newCategoryName]
					]
                });

                pt.table.style.width = '95%';
                pt.table.rows[0].cells[0].style.width = '90px';

                var gb = Rendition.UI.GroupBox({
                    title: 'Rename Category',
                    childNodes: [pt.table],
                    expanded: true
                });
                gb.appendTo(c);
                c.appendChild(okButton);
                c.appendChild(cancelButton);
                okButton.onclick = function (e) {
                    var req = [
						'SqlCommand',
						['update categories set category = \'' + newCategoryName.value.s() + '\' where categoryId = \'' + treeNode.data[0] + '\'']
					]
                    instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                        instance.renameDialog.close();
                        labelText.innerHTML = instance.imageFolder + newCategoryName.value;
                        treeNode.data[1] = newCategoryName.value;
                        instance.updateCategoryCache();
                    }, instance);
                }
                newCategoryName.focus();
                newCategoryName.select();
            }, false);

            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = 'Delete Category';
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                var req = [
					'SqlCommand',
					['delete from categories where categoryId = \'' + treeNode.data[0] + '\'\
					delete from categoryDetail where categoryId = \'' + treeNode.data[0] + '\'']
				]
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                    var f = JSON.parse(e.responseText);
                    if (f.method1.SqlCommand.error != 0) {
                        alert(f.method1.SqlCommand.description);
                    } else {
                        treeView.removeNode(node);
                    }
                    instance.updateCategoryCache();
                }, instance);

            }, false);
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = 'Update Site Cache';
            Rendition.UI.appendEvent('click', options[optionIndex], instance.updateCategoryCache, false);
        }
        if (options.length > 0) {
            var menu = Rendition.UI.ContextMenu(e, {
                elements: options,
                caller: this,
                type: 'mouse'
            });
            e.preventDefault();
            treeView.preventDefault();
            treeView.highlightLabelText(labelText);
        }
    }
    instance.updateCategoryCache = function () {
        var req = [
			'RefreshCategoriesCache',
			[]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI +
		Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) { }, instance, false/*sync*/);
    }
    instance.init();
    return instance;

}