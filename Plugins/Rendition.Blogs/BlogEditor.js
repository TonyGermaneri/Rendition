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
* Blog editor.
* @constructor
* @name Rendition.Commerce.BlogEditor
*/
Rendition.Commerce.BlogEditor = function (args) {
    var instance = {}
    instance.dateFormatString = 'MM/DD/YYYY HH:nn:ss a';
    if (args === undefined) { args = {} }
    var ratingOption = [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]];
    instance.blogCategoryGroup = function () {
        var a = [];
        a.push({
            name: 'Properties',
            expanded: true,
            inputs: [
				{
				    columnName: 'categoryName'
				},
				{
				    columnName: 'publicCategory'
				},
				Rendition.Commerce.userIdFormInput('author', false),
				{
				    columnName: 'showInTicker'
				},
				{
				    columnName: 'blogPage'
				}
			]
        });
        return a;
    }
    instance.blogEditorGroup = function () {
        var a = [];
        a.push({
            name: 'Properties',
            expanded: true,
            inputs: [
				{
				    columnName: 'subject'
				}
			]
        });
        a.push({
            name: 'Extended Properties',
            expanded: false,
            inputs: [
				{
				    columnName: 'enabled'
				},
				{
				    columnName: 'auditComments'
				},
				{
				    columnName: 'allowComments'
				},
				{
				    columnName: 'emailUpdates'
				},
				{
				    columnName: 'archive'
				},
				{
				    columnName: 'comments'
				},
				{
				    columnName: 'addDate',
				    timePicker: {}
				},
				{
				    columnName: 'dateChanged',
				    timePicker: {}
				},
				Rendition.Commerce.userIdFormInput('editor', false),
				Rendition.Commerce.userIdFormInput('author', false),
				Rendition.Commerce.userIdFormInput('lastEditor', false),
				{
				    columnName: 'tags'
				},
				{
				    columnName: 'annotations'
				},
				{
				    columnName: 'blogImage',
				    inputType: 'fileManager'
				}
			]
        });
        a.push({
            name: 'Message',
            expanded: true,
            inputs: [
				{
				    columnName: 'message',
				    inputType: 'rte'
				}
			]
        });

        return a;
    }
    instance.blogReplyGroup = function () {
        var a = [];
        a.push({
            name: 'Properties',
            expanded: true,
            smallTitles: true,
            inputs: [
				{
				    columnName: 'subject'
				}
			]
        });
        a.push({
            name: 'Extended Properties',
            expanded: false,
            inputs: [
				{
				    columnName: 'disabled'
				},
				{
				    columnName: 'rating',
				    inputType: 'select',
				    options: ratingOption
				},
				{
				    columnName: 'userId'
				},
				{
				    columnName: 'email'
				},
				{
				    columnName: 'approves',
				    inputType: 'numericUpDown'
				},
				{
				    columnName: 'disapproves',
				    inputType: 'numericUpDown'
				},
				{
				    columnName: 'flaggedInappropriate'
				},
				{
				    columnName: 'flaggedOk'
				},
				{
				    columnName: 'addedOn',
				    inputType: 'datePicker'
				}
			]
        });
        a.push({
            name: 'Message',
            expanded: true,
            inputs: [
				{
				    columnName: 'comment',
				    inputType: 'rte'
				}
			]
        });
        return a;
    }
    instance.closeDialog = function (e, dialog) {
        if (instance.activeForm === undefined) {
            return;
        }
        if (instance.activeForm.dirty()) {
            instance.checkSave(function () {
                Rendition.UI.removeEvent('close', instance.dialog, instance.closeDialog);
                instance.dialog.close();
            });
            instance.dialog.preventDefault();
        } else {
            Rendition.UI.removeEvent('close', instance.dialog, instance.closeDialog);
            instance.dialog.close();
        }
        return;
    }
    instance.init = function () {
        if (args.parentNode === undefined) {
            instance.dialog = Rendition.UI.Dialog({
                rect: {
                    x: Rendition.UI.dialogPosition.x,
                    y: Rendition.UI.dialogPosition.y,
                    h: document.documentElement.clientHeight - 100,
                    w: 700
                },
                title: 'Blog Editor',
                rememberPosition: true,
                id: 'blogEditorAllByItself'
            });
            Rendition.UI.appendEvent('close', instance.dialog, instance.closeDialog);
            args.parentNode = instance.dialog.content;
        }
        instance.rootCutter = Rendition.UI.CutterBar({
            parentNode: args.parentNode,
            autoResize: false,
            id: 'blogCutter1',
            position: 170
        });
        instance.blogGrid = Rendition.UI.Grid({
            objectName: 'blogs',
            editMode: 3,
            suffix: 'where 1=2',
            genericEditor: true,
            scroll: true,
            editorParameters: {
                groups: instance.blogEditorGroup(),
                supressUpdateButton: true
            }
        });
        instance.blogCategoryGrid = Rendition.UI.Grid({
            objectName: 'blogCategories',
            editMode: 3,
            suffix: 'where 1=2',
            genericEditor: true,
            editorParameters: {
                groups: instance.blogCategoryGroup(),
                supressUpdateButton: true
            }
        });
        instance.repliesGrid = Rendition.UI.Grid({
            objectName: 'replies',
            editMode: 3,
            suffix: 'where 1=2',
            genericEditor: true,
            editorParameters: {
                groups: instance.blogReplyGroup(),
                supressUpdateButton: true
            }
        });
        instance.initTreeView();
        return instance;
    }
    instance.initTreeView = function () {
        var req1 = ['GetSqlArray',
			[{
			    commandText: 'select blogCategories.blogCategoryId, categoryName, case when blogs.blogCategoryId is null then 0 else count(0) end as count \
				from blogCategories with (nolock) \
				left join blogs with (nolock) on blogs.blogCategoryId = blogCategories.blogCategoryId \
				group by blogCategories.blogCategoryId, categoryName, blogs.blogCategoryId order by categoryName'
			}]
		]
        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI();
        var reqEval = Rendition.UI.Ajax(url, function (e) {
            var a = JSON.parse(e.responseText);
            instance.blogs = a.method1.GetSqlArray;
            instance.tree = Rendition.UI.TreeView({
                parentNode: instance.rootCutter.cutters[0],
                rootNode: {
                    text: 'blogs',
                    value: 'root',
                    childNodes: instance.blogNodes
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
    instance.checkSave = function (okCallback) {
        instance.confirmSave = Rendition.UI.ConfirmDialog({
            ontrue: function () {
                instance.rootCutter.cutters[1].innerHTML = '';
                okCallback.apply(instance, []);
                instance.confirmSave.dialog.close();
            },
            onfalse: function () {
                instance.confirmSave.dialog.close();
            },
            title: 'Save before you go?',
            subTitle: 'Save changes?',
            message: 'Do you want to save changes before you go?<br>' +
			'If you want to go back and save click cancel.<br>' +
			'If you\'re sure you want to leave without saving click Ok.<br>',
            dialogRect: { x: (document.documentElement.clientWidth * .5) - (450 * .5), y: 75, h: 173, w: 450 }
        });
    }
    instance.treeObject = function (data, node, nestLevel, parentNode) {
        var nLevel = '';
        if (nestLevel === 'year') {
            nLevel = 'month';
        } else if (nestLevel === 'month') {
            nLevel = 'entry';
        } else if (nestLevel === 'entry') {
            nLevel = 'comment';
        } else if (nestLevel === 'comment' || nestLevel === 'reply') {
            nLevel = 'reply';
        }
        var childNodes = [];
        var l = data.length;
        if (l != 0) {
            for (var x = 0; l > x; x++) {
                var url = '';
                var text = '';
                if (nLevel === 'month') {
                    url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(["GetSqlArray",
						[{ commandText: 'dbo.blogMonthCategories \'' + data[x][2] + '\', \'' + data[x][0] + '\''}]
					]).toURI();
                    text = '<img style="margin-bottom:-4px;" src="/admin/img/icons/calendar.png" alt=""> ' + data[x][0] + " (" + data[x][1] + ")";
                } else if (nLevel === 'entry') {
                    url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(["GetSqlArray",
						[{ commandText:
							"select \n" +
							"blogId, subject, message, comments, tags, editor, author, addDate, \n" +
							"dateChanged, lastEditor, annotations, enabled, auditComments, allowComments, \n" +
							"emailUpdates, blogImage, blogCategoryId, publicBlog, listOrder, archive, VerCol, \n" +
							"(select count(0) from replies where parentId = blogId) as replyCount \n" +
							"from dbo.blogs with (nolock) \n" +
							"where datename(year,addDate) = '" + data[x][3] + "' and \n" +
							"datename(month,addDate) = '" + data[x][0] + "' and blogCategoryId = '" + data[x][2] + "' \n" +
							"order by listOrder asc"
						}]
					]).toURI();
                    text = '<img style="margin-bottom:-4px;" src="/admin/img/icons/calendar.png" alt=""> ' + data[x][0] + " (" + data[x][1] + ")";
                } else if (nLevel === 'comment' || nLevel === 'reply') {
                    url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(["GetSqlArray",
						[{ commandText:
							"select \n" +
							"replyId, subject, email, rating, userId, comment, addedOn, parentId, reference, disabled, \n" +
							"approves, disapproves, flaggedInappropriate, flaggedOk, VerCol, \n" +
							"(select count(0) from replies b where b.parentId = replies.replyId) as replyCount \n" +
							"from dbo.replies with (nolock) where parentId = '" + data[x][0] + "' \n" +
							"order by addedOn"
						}]
					]).toURI();
                    if (nLevel === 'reply') {
                        text = '<img style="margin-bottom:-4px;" src="/admin/img/icons/comment.png" alt=""> ' + data[x][1] + ' (' + data[x][15] + ')';
                    } else {
                        text = '<img style="margin-bottom:-4px;" src="/admin/img/icons/newspaper.png" alt=""> ' + data[x][1] + ' (' + data[x][21] + ')';
                    }
                }
                childNodes.push({
                    text: text,
                    value: data[x][0],
                    data: data[x],
                    id: parentNode.id,
                    nodeType: nestLevel,
                    childNodes: {
                        url: url,
                        callbackArguments: [String(data[x][0])],
                        callbackProcedure: function (id, json, tree, node) {
                            var a = json.method1.GetSqlArray;
                            var treeObj = instance.treeObject(a, node, nLevel, parentNode);
                            var l = treeObj.length;
                            while (node.firstChild) { node.removeChild(node.firstChild) }
                            for (var x = 0; l > x; x++) {
                                tree.add(treeObj[x], node);
                            }
                            if (nLevel === 'comment' || nLevel === 'reply') {
                                tree.add({
                                    text: '- Reply to this -',
                                    value: id,
                                    childNodes: [],
                                    nodeType: 'newreply'
                                }, node);
                            }
                        }
                    }
                });
            }
        }
        return childNodes;
    }
    instance.blogNodes = function (treeView, treeNode, parentNode) {
        var l = instance.blogs.length;
        for (var x = 0; l > x; x++) {
            var id = String(instance.blogs[x][0]);
            var req = ["GetSqlArray",
				[
					{
					    commandText: 'dbo.blogYearCategories \'' + id + '\''
					}
				]
			]
            treeView.add({
                text: '<img style="margin-bottom:-4px;" src="/admin/img/icons/comments.png" alt="' + String(instance.blogs[x][1]) + '"> ' +
				'<span style="font-weight:bold;">' + instance.blogs[x][1] + " (" + instance.blogs[x][2] + ")",
                value: String(instance.blogs[x][1]),
                data: instance.blogs[x],
                id: id,
                template: true,
                nodeType: 'root',
                childNodes: {
                    url: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req),
                    callbackArguments: [String(id)],
                    callbackProcedure: function (id, json, tree, node) {
                        var a = json.method1.GetSqlArray;
                        var treeObj = instance.treeObject(a, node, 'year', treeNode);
                        var l = treeObj.length;
                        while (node.firstChild) { node.removeChild(node.firstChild) }
                        for (var x = 0; l > x; x++) {
                            tree.add(treeObj[x], node);
                        }
                        tree.add({
                            text: '- Add an entry -',
                            value: id,
                            childNodes: [],
                            nodeType: 'newentry'
                        }, node);
                        return false;
                    }
                }
            }, parentNode);
        }
        treeView.add({
            text: '- Add a blog -',
            nodeType: 'newblog',
            value: Rendition.UI.emptyUUID,
            childNodes: []
        }, parentNode);
    }
    instance.formStruct = function (inReadObject, inCallbackProcedure) {
        var a =
		{
		    callbackProcedure: inCallbackProcedure,
		    dataSet: inReadObject,
		    groups: undefined
		}
        return a;
    }
    instance.replyEditor = function (replyId, parentNode, node, newRecordRow) {
        instance.tabs = [];
        instance.tabs[0] = Rendition.UI.TabBarTab({
            title: 'Message',
            load: function (tab, tabBar, content) {
                if (content.innerHTML === '') {
                    if (replyId != Rendition.UI.emptyUUID) {
                        var req1 = ["DataSet",
							['replies', 'where replyId = \'' + replyId + '\'', "1", "1", '', {}, [], 'JSON', true, "-1", false, '', '']
						]
                        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI();
                        var reqEval = Rendition.UI.Ajax(url, function (e) {
                            var a = JSON.parse(e.responseText);
                            instance.replyFormStruct = {
                                dataSet: a.method1.DataSet,
                                groups: instance.blogReplyGroup()
                            }
                            instance.replyForm = Rendition.UI.Form(instance.replyFormStruct);
                            instance.replyForm.appendTo(content);
                        }, instance);
                    } else {
                        instance.replyForm = instance.repliesGrid.genericEditor(instance.repliesGrid.newRowIndex, { parentNode: content }, newRecordRow);
                    }
                    setTimeout(function () {
                        instance.activeForm = instance.replyForm;
                    }, 100);
                }
            }
        });
        instance.tabs[1] = Rendition.UI.TabBarTab({
            title: 'Direct Replies',
            load: function (tab, tabBar, content) {
                return instance.directRepliesTabLoad(tab, tabBar, content, replyId);
            }
        });
        instance.menuBarElements = [];
        instance.menuBarElements[0] = Rendition.UI.MenuOption();
        instance.menuBarElements[0].text = 'Save';
        Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
            var n = replyId === Rendition.UI.emptyUUID;
            instance.replyForm.save(n, Rendition.UI.iif(n, 1, 0), function () {
                instance.refreshSiteBlogs();
                if (node.parentNode) {
                    node.refreshParent(); /* refresh the node this item was just added to */
                }
            }, false/*async*/);
            return false;
        }, false);
        instance.menuBar = Rendition.UI.MenuBar({
            options: instance.menuBarElements,
            parentNode: parentNode
        });
        instance.tabbar = Rendition.UI.TabBar({
            tabs: instance.tabs,
            parentNode: parentNode,
            activeTabIndex: 0,
            offsetRect: { x: 0, y: instance.menuBar.style.rect.h, h: 0, w: 0 }
        });
    }
    instance.imageGalleryTabLoad = function (tab, tabBar, content, entryId) {
        if (content.innerHTML === '') {
            new Rendition.Commerce.GalleryEditor({ parentNode: content, galleryId: instance.entryForm.getValueByName('galleryId') });
        }
    }
    instance.directRepliesTabLoad = function (tab, tabBar, content, refId) {
        if (content.innerHTML === '') {
            instance.blogReplyGrid = Rendition.UI.Grid({
                objectName: 'replies',
                editMode: 3,
                suffix: 'where parentId = \'' + refId + '\'',
                parentNode: content,
                genericEditor: true,
                rowCountColumn: true,
                editorParameters: {
                    groups: instance.blogReplyGroup()
                }
            });
        }
    }
    instance.blogEditor = function (blogId, parentNode, node) {
        instance.tabs = [];
        instance.tabs[0] = Rendition.UI.TabBarTab({
            title: 'Blog Properties',
            load: function (tab, tabBar, content) {
                if (content.innerHTML === '') {
                    if (blogId != Rendition.UI.emptyUUID) {
                        var req1 = ["DataSet",
							['blogCategories', 'where blogCategoryId = \'' + blogId + '\'', '1', '1', '', {}, [], 'JSON', true, '-1', false, '', '']
						]
                        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI();
                        var reqEval = Rendition.UI.Ajax(url, function (e) {
                            var a = JSON.parse(e.responseText);
                            instance.formStruct = {
                                dataSet: a.method1.DataSet,
                                groups: instance.blogCategoryGroup()
                            }
                            instance.categoryForm = Rendition.UI.Form(instance.formStruct);
                            instance.categoryForm.appendTo(content);
                        }, instance);
                    } else {
                        instance.categoryForm = instance.blogCategoryGrid.genericEditor(instance.blogCategoryGrid.newRowIndex, {
                            parentNode: content
                        }, instance.blogCategoryGrid.newRecord());
                    }
                    setTimeout(function () {
                        instance.activeForm = instance.categoryForm;
                    }, 100);
                }
            }
        });
        instance.tabs[1] = Rendition.UI.TabBarTab({
            title: 'Blog Entries',
            load: function (tab, tabBar, content) {
                if (content.innerHTML === '') {
                    instance.blogGrid = Rendition.UI.Grid({
                        objectName: 'blogs',
                        editMode: 3,
                        rowCountColumn: true,
                        suffix: 'where blogCategoryId = \'' + blogId + '\'',
                        parentNode: content,
                        genericEditor: true,
                        editorParameters: {
                            groups: instance.blogEditorGroup()
                        }
                    });
                }
            }
        });
        var mLength = 0;
        instance.menuBarElements = [];
        instance.menuBarElements[mLength] = Rendition.UI.MenuOption();
        instance.menuBarElements[mLength].text = 'Save';
        Rendition.UI.appendEvent('click', instance.menuBarElements[mLength], function (e) {
            var n = blogId === Rendition.UI.emptyUUID;
            instance.categoryForm.save(n, Rendition.UI.iif(n, 1, 0), function () {
                instance.refreshSiteBlogs();
                if (node.parentNode) {
                    node.refreshParent(); /* refresh the node this item was just added to */
                }
            }, false/*async*/);
            return false;
        }, false);
        if (blogId !== Rendition.UI.emptyUUID) {
            mLength++;
            instance.menuBarElements[mLength] = Rendition.UI.MenuOption();
            instance.menuBarElements[mLength].text = 'Add New Blog Entry';
            Rendition.UI.appendEvent('click', instance.menuBarElements[mLength], function (e) {
                instance.rootCutter.cutters[1].innerHTML = '';
                var now = Rendition.UI.formatDate(new Date(), instance.dateFormatString);
                var newRecordRow = instance.blogGrid.newRecord({
                    blogCategoryId: blogId,
                    lastEditor: Rendition.Commerce.user.userId,
                    author: Rendition.Commerce.user.userId,
                    editor: Rendition.Commerce.user.userId,
                    addDate: now,
                    dateChanged: now
                });
                instance.entryEditor(Rendition.UI.emptyUUID, instance.rootCutter.cutters[1], node, newRecordRow);
            }, false);
            mLength++;
            instance.menuBarElements[mLength] = Rendition.UI.MenuOption();
            instance.menuBarElements[mLength].text = 'Create New Blog Category';
            Rendition.UI.appendEvent('click', instance.menuBarElements[mLength], function (e) {
                instance.rootCutter.cutters[1].innerHTML = '';
                instance.blogEditor(Rendition.UI.emptyUUID, instance.rootCutter.cutters[1], node);
            }, false);
        }
        instance.menuBar = Rendition.UI.MenuBar({
            options: instance.menuBarElements,
            parentNode: parentNode
        });
        instance.tabbar = Rendition.UI.TabBar({
            tabs: instance.tabs,
            parentNode: parentNode,
            activeTabIndex: 0,
            offsetRect: { x: 0, y: instance.menuBar.style.rect.h, h: 0, w: 0 }
        });
    }
    instance.entryEditor = function (entryId, parentNode, node, newRecordRow) {
        instance.tabs = [];
        instance.tabs[0] = Rendition.UI.TabBarTab({
            title: 'Message',
            load: function (tab, tabBar, content) {
                if (content.innerHTML === '') {
                    if (entryId != Rendition.UI.emptyUUID) {
                        var req1 = ["DataSet",
							['blogs', 'where blogId = \'' + entryId + '\'', '1', '1', '', {}, [], 'JSON', true, '-1', false, '', '']
						]
                        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI();
                        var reqEval = Rendition.UI.Ajax(url, function (e) {
                            var a = JSON.parse(e.responseText);
                            instance.formStruct = {
                                dataSet: a.method1.DataSet,
                                groups: instance.blogEditorGroup()
                            }
                            instance.entryForm = Rendition.UI.Form(instance.formStruct);
                            instance.entryForm.appendTo(content);
                        }, instance);
                    } else {
                        instance.entryForm = instance.blogGrid.genericEditor(instance.blogGrid.newRowIndex, { parentNode: content }, newRecordRow);
                    }
                    setTimeout(function () {
                        instance.activeForm = instance.entryForm;
                    }, 100);
                }
            }
        });
        instance.tabs[1] = Rendition.UI.TabBarTab({
            title: 'Images',
            load: function (tab, tabBar, content) {
                return instance.imageGalleryTabLoad(tab, tabBar, content, entryId);
            }
        });
        instance.tabs[2] = Rendition.UI.TabBarTab({
            title: 'Direct Replies',
            load: function (tab, tabBar, content) {
                return instance.directRepliesTabLoad(tab, tabBar, content, entryId);
            }
        });
        instance.menuBarElements = [];
        instance.menuBarElements[0] = Rendition.UI.MenuOption();
        instance.menuBarElements[0].text = 'Save';
        Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
            var n = entryId === Rendition.UI.emptyUUID;
            instance.entryForm.save(n, Rendition.UI.iif(n, 1, 0), function () {
                instance.refreshSiteBlogs();
                if (node.parentNode) {
                    node.refreshParent(); /* refresh the node this item was just added to */
                }
            }, false/*async*/);
            return false;
        }, false);
        instance.menuBar = Rendition.UI.MenuBar({
            options: instance.menuBarElements,
            parentNode: parentNode
        });
        instance.tabbar = Rendition.UI.TabBar({
            tabs: instance.tabs,
            parentNode: parentNode,
            activeTabIndex: 0,
            offsetRect: { x: 0, y: instance.menuBar.style.rect.h, h: 0, w: 0 }
        });
    }
    instance.labelClick = function (e, treeView, node, labelText, treeNode, parentNode) {
        if (instance.activeForm === undefined) {
            instance.loadNodeForEditing(e, treeView, node, labelText, treeNode, parentNode);
            return;
        }
        if (instance.activeForm.dirty()) {
            instance.checkSave(function () {
                instance.loadNodeForEditing(e, treeView, node, labelText, treeNode, parentNode);
            });
        } else {
            instance.loadNodeForEditing(e, treeView, node, labelText, treeNode, parentNode);
        }
        treeView.preventDefault();
    }
    instance.loadNodeForEditing = function (e, treeView, node, labelText, treeNode, parentNode) {
        var nType = treeNode.nodeType;
        treeView.highlightLabelText(labelText);
        if (nType === 'root') {
            instance.rootCutter.cutters[1].innerHTML = '';
            instance.blogEditor(treeNode.data[0], instance.rootCutter.cutters[1], node);
        } else if (nType === 'year') {
            instance.activeForm = undefined;
            instance.rootCutter.cutters[1].innerHTML = '';
            instance.blogGrid = Rendition.UI.Grid({
                objectName: 'blogs',
                editMode: 3,
                suffix: 'where datename(year,addDate) = ' + treeNode.data[0] + ' and blogCategoryId = \'' + treeNode.data[2] + '\'',
                parentNode: instance.rootCutter.cutters[1],
                genericEditor: true,
                rowCountColumn: true,
                editorParameters: {
                    groups: instance.blogEditorGroup()
                }
            });
        } else if (nType === 'month') {
            instance.activeForm = undefined;
            instance.rootCutter.cutters[1].innerHTML = '';
            instance.blogGrid = Rendition.UI.Grid({
                objectName: 'blogs',
                editMode: 3,
                rowCountColumn: true,
                suffix: 'where datename(month,addDate) = \'' + treeNode.data[0] + '\' and blogCategoryId = \'' + treeNode.data[2] + '\' and datename(year,addDate) = ' + treeNode.data[3],
                parentNode: instance.rootCutter.cutters[1],
                genericEditor: true,
                editorParameters: {
                    groups: instance.blogEditorGroup()
                }
            });
        } else if (nType === 'entry') {
            instance.rootCutter.cutters[1].innerHTML = '';
            instance.entryEditor(treeNode.data[0], instance.rootCutter.cutters[1], node);
        } else if (nType === 'comment' || nType === 'reply') {
            instance.rootCutter.cutters[1].innerHTML = '';
            instance.replyEditor(treeNode.data[0], instance.rootCutter.cutters[1], node);
        } else if (nType === 'newentry') {
            instance.rootCutter.cutters[1].innerHTML = '';
            var now = Rendition.UI.formatDate(new Date(), instance.dateFormatString);
            var newRecordRow = instance.blogGrid.newRecord({
                blogCategoryId: treeNode.value,
                lastEditor: Rendition.Commerce.user.userId,
                author: Rendition.Commerce.user.userId,
                editor: Rendition.Commerce.user.userId,
                addDate: now,
                dateChanged: now
            });
            instance.entryEditor(Rendition.UI.emptyUUID, instance.rootCutter.cutters[1], node, newRecordRow);
        } else if (nType === 'newreply') {
            instance.rootCutter.cutters[1].innerHTML = '';
            var newRecordRow = instance.repliesGrid.newRecord({
                parentId: treeNode.value,
                userId: Rendition.Commerce.user.userId
            });
            instance.replyEditor(Rendition.UI.emptyUUID, instance.rootCutter.cutters[1], node, newRecordRow);
        } else if (nType === 'newblog') {
            instance.rootCutter.cutters[1].innerHTML = '';
            instance.blogEditor(Rendition.UI.emptyUUID, instance.rootCutter.cutters[1], node);
        }
    }
    instance.refreshSiteBlogs = function () {
        var req = [
			'refreshSiteBlogs',
			[]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            return;
        }, instance);
    }
    instance.labelContextMenu = function (e, treeView, node, labelText, treeNode, parentNode) {
        var optionIndex = -1;
        var options = [];
        var nType = treeNode.nodeType;

        if (nType === 'reply' || nType === 'comment') {
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = 'Delete Reply';
            Rendition.UI.appendEvent('click', options[optionIndex], function () {/*TODO:put delete reciprcol replies here */
                var req = ['SqlCommand', ['delete from replies where replyId = \'' + treeNode.data[0] + '\'']];
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                    var f = JSON.parse(e.responseText);
                    if (f.method1.SqlCommand.error != 0) {
                        alert(f.method1.SqlCommand.description);
                    } else {
                        treeView.removeNode(node);
                    }
                }, instance);
            }, false);
            if (treeNode.data[9] === 0) {
                optionIndex++;
                options[optionIndex] = Rendition.UI.MenuOption();
                options[optionIndex].text = 'Disable Reply';
                Rendition.UI.appendEvent('click', options[optionIndex], function () {
                    var req = ['SqlCommand', ['update replies set disabled = 1 where replyId = \'' + treeNode.data[0] + '\'']];
                    instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                        var f = JSON.parse(e.responseText);
                        if (f.method1.SqlCommand.error != 0) {
                            alert(f.method1.SqlCommand.description);
                        }
                        node.refreshParent();
                    }, instance);
                }, false);
            } else {
                optionIndex++;
                options[optionIndex] = Rendition.UI.MenuOption();
                options[optionIndex].text = 'Enable Reply';
                Rendition.UI.appendEvent('click', options[optionIndex], function () {
                    var req = ['SqlCommand', ['update replies set disabled = 0 where replyId = \'' + treeNode.data[0] + '\'']];
                    instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                        var f = JSON.parse(e.responseText);
                        if (f.method1.SqlCommand.error != 0) {
                            alert(f.method1.SqlCommand.description);
                        }
                        node.refreshParent();
                    }, instance);
                }, false);
            }
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = 'Audited Ok';
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                var req = ['SqlCommand', ['update replies set flaggedOk = 1 where replyId = \'' + treeNode.data[0] + '\'']];
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                    var f = JSON.parse(e.responseText);
                    if (f.method1.SqlCommand.error != 0) {
                        alert(f.method1.SqlCommand.description);
                    }
                    node.refreshParent();
                }, instance);
            }, false);
        } else if (nType === 'entry') {
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = 'Delete Entry';
            Rendition.UI.appendEvent('click', options[optionIndex], function () {/*TODO:put delete reciprcol replies here */
                var req = ['SqlCommand', ['delete from blogs where blogId = \'' + treeNode.data[0] + '\'']];
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                    var f = JSON.parse(e.responseText);
                    if (f.method1.SqlCommand.error != 0) {
                        alert(f.method1.SqlCommand.description);
                    } else {
                        treeView.removeNode(node);
                    }
                }, instance);
            }, false);
        } else if (nType === 'root') {
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = 'Delete Blog';
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                instance.confirmClose = Rendition.UI.ConfirmDialog({
                    ontrue: function () {
                        var req = ['SqlCommand', [/*UNDONE:put delete reciprcol replies here */
						'delete from blogCategories where blogCategoryId = \'' + treeNode.data[0] + '\';' +
						'delete from blogs where blogCategoryId = \'' + treeNode.data[0] + '\';']];
                        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                            var f = JSON.parse(e.responseText);
                            if (f.method1.SqlCommand.error != 0) {
                                alert(f.method1.SqlCommand.description);
                            } else {
                                treeView.removeNode(node);
                            }
                        }, instance);
                        instance.confirmClose.dialog.close();
                        instance.rootCutter.cutters[1].innerHTML = '';
                    },
                    onfalse: function () {
                        instance.confirmClose.dialog.close();
                    },
                    title: 'Confirm Blog Delete',
                    subTitle: 'Delete this entire blog?',
                    message: 'Delete this entire blog and all entires and replies belonging to it?<br>' +
					'If you don\'t want to delete this blog click cancel.<br>' +
					'If you\'re sure you want to delete this blog click Ok.<br>',
                    dialogRect: { x: (document.documentElement.clientWidth * .5) - (450 * .5), y: 75, h: 173, w: 450 }
                });
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
			"UpdateBlogOrder",
			[JSON.stringify(order)]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
            var f = JSON.parse(e.responseText);
            if (f.method1.UpdateBlogOrder.error != 0) {
                alert(f.method1.UpdateBlogOrder.description);
            }
            instance.refreshSiteBlogs();
        }, instance);
        return false;
    }
    instance.refreshSiteBlogs = function () {
        var req = [
			'RefreshBlogsCache',
			[]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            return;
        }, instance);
    }
    instance.init();
    return instance;
}