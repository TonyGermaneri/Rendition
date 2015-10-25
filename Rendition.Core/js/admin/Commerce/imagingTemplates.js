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
* Imaging template editor.
* @constructor
* @name Rendition.Commerce.ImagingTemplates
*/
Rendition.Commerce.ImagingTemplates = function (args) {
	var instance = {}
	if (args === undefined) { args = {} }
	instance.siteCommandText = 'select unique_SiteId, siteAddress, m_imagingTemplate,c_imagingTemplate,f_imagingTemplate,t_imagingTemplate,' +
				'a_imagingTemplate,x_imagingTemplate,y_imagingTemplate,z_imagingTemplate,b_imagingTemplate,d_imagingTemplate from site_configuration order by siteAddress';
	instance.imgL = [["Listing", "m"], ["Cart", "c"], ["Full Size", "f"], ["Checkout", "t"], ["Packing Slip", "a"],
	["Invoice", "x"], ["Listing 2", "y"], ["Listing 3", "z"], ["Backend", "b"], ["Detail", "d"]];
	instance.parentNode = args.parentNode;
	instance.languages = [['CSharp', 'CSharp'], ['Visual Basic', 'Visual Basic'], ['JScript', 'JScript']];
	instance.imagingFormStruc =
	[
		{
			name: 'Details',
			expanded: true,
			inputs: [
				{
					columnName: 'templateName'
				},
				{
					columnName: 'comments',
					inputType: 'rte'
				}
			]
		}

	];
	instance.imagingdetailFormStruc =
	[
		{
			name: 'Details',
			expanded: true,
			inputs: [
				{
					columnName: 'name'
				},
				{
					columnName: 'language',
					inputType: 'select',
					options: instance.languages
				},
				{
					columnName: 'enabled'
				},
				{
					columnName: 'description'
				},
				{
					columnName: 'filterOrder'
				}
			]
		},
		{
			name: 'Code',
			expanded: true,
			inputs: [
				{
					columnName: 'script',
					inputType: 'codearea',
					language: 'csharp'
				}
			]
		}
	];
	instance.init = function () {
		if (args.parentNode === undefined) {
			instance.dialog = Rendition.UI.Dialog({
			    rect: { 
                    x: Rendition.UI.dialogPosition.x,
			        y: Rendition.UI.dialogPosition.y,
			        h: document.documentElement.clientHeight - 100,
                    w: 650
			    },
				title: 'Image Template Editor',
				rememberPosition: true,
				id: 'imageEditorAllByItself'
			});
			args.parentNode = instance.dialog.content;
		}
		instance.rootCutter = Rendition.UI.CutterBar({
			parentNode: args.parentNode,
			autoResize: false,
			id: 'imageTemplatesCutter1',
			position: 170
		});
		instance.cutter2 = Rendition.UI.CutterBar({
			parentNode: instance.rootCutter.cutters[1],
			autoResize: false,
			id: 'imageTemplatesCutter2',
			orientation: 1,
			position: 220
		});
		instance.initTreeView();
		return instance;
	}
	instance.isLocationUsed = function (siteId, templateId, location) {
		var l = instance.siteList.length;
		var m = instance.imgL.length;
		for (var x = 0; l > x; x++) {
			if (instance.siteList[x][0] === siteId) {
				for (var y = 0; m > y; y++) {
					if (String(instance.siteList[x][y + 2]).toLowerCase() === String(templateId).toLowerCase() && instance.imgL[y][1] === location) {
						return true;
					}
				}
			}
		}
		return false;
	}
	instance.initTreeView = function () {
		var req1 = [
			"DataSet",
			['imagingTemplates', '', '1', '9999999', '', {}, [], 'JSON', true, '-1', false, 'templateName', 'asc']
		]
		var req2 = [
			"DataSet",
			['imagingTemplateDetail', '', '1', '1', '', {}, [], 'JSON', true, '-1', false, 'filterOrder', 'asc']
		]
		var req3 = [
			'Ls',
			[
				'/img'
			]
		]
		var req4 = [
			"GetSqlArray",
			[{ commandText: instance.siteCommandText
			}]
		]
		var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1) + '&method2=' + JSON.stringify(req2) + '&method3=' + JSON.stringify(req3) + '&method4=' + JSON.stringify(req4);
		var reqEval = Rendition.UI.Ajax(url, function (e) {
			var a = JSON.parse(e.responseText);
			instance.templates = a.method1.DataSet.data;
			instance.templatesReadObject = a.method1.DataSet;
			instance.templateDetailReadObject = a.method2.DataSet;
			instance.previewFiles = a.method3.Ls.files;
			instance.siteList = a.method4.GetSqlArray;
			instance.filterTree = Rendition.UI.TreeView({
				parentNode: instance.rootCutter.cutters[0],
				rootNode: {
					text: 'Filters',
					value: 'root',
					childNodes: instance.templateNodes
				},
				labelclick: instance.filterLabelClick,
				labelcontextmenu: instance.labelcontextmenu,
				refresh: function () {
					instance.rootCutter.cutters[0].innerHTML = '';
					instance.initTreeView();
				}
			});
		}, instance);
		return instance;
	}
	instance.labelcontextmenu = function (e, treeView, node, labelText, treeNode) {
		if (treeNode.text[0] === '-') { return }
		var options = [];
		var optionLength = -1;
		if (treeNode.childNodes.url === undefined) {
			optionLength++;
			options[optionLength] = Rendition.UI.MenuOption();
			options[optionLength].text = Rendition.UI.iif(treeNode.template, 'Unlink Template', 'Delete Filter');
			Rendition.UI.appendEvent('click', options[optionLength], function () {
				instance.confirmDeleteDialog = Rendition.UI.ConfirmDialog({
				    message: 'Are you sure you want to ' + Rendition.UI.iif(treeNode.template, 'unlink this template', 'delete this filter') + '?',
					subTitle: 'Confirm Delete',
					title: 'Confirm Delete',
					autosize: true,
					ontrue: function (e, confirmDialog) {
						var req = [
							"SqlCommand",
							['delete from imagingTemplateDetail where imagingTemplateDetailID = \'' + treeNode.value + '\'']
						]
						var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
						var reqEval = Rendition.UI.Ajax(url, function () {
							node.refreshParent();
							if (treeNode.value === instance.openFilterReadObject.data[0][0]) {
								instance.cutter2.cutters[1].innerHTML = '';
							}
						}, instance);
						confirmDialog.close();
					},
					onfalse: function (e, confirmDialog) {
						confirmDialog.close();
					}
				});
			}, false);
		} else {
			optionLength++;
			options[optionLength] = Rendition.UI.MenuOption();
			options[optionLength].text = 'Delete Template';
			Rendition.UI.appendEvent('click', options[optionLength], function () {
				instance.confirmDeleteDialog = Rendition.UI.ConfirmDialog({
					message: 'Are you sure you want to delete this template?  All filters in this template will be deleted.  It will also be removed \
				from any other templates it is linked to.',
					subTitle: 'Confirm Delete',
					title: 'Confirm Delete',
					autosize: true,
					ontrue: function (e, confirmDialog) {
						var req = [
							"SqlCommand",
							['delete from imagingTemplateDetail where template = \'' + treeNode.value + '\';\
						delete from imagingTemplateDetail where imagingTemplateID = \'' + treeNode.value + '\';\
						delete from imagingTemplates where imagingTemplateID = \'' + treeNode.value + '\';']
						]
						var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
						var reqEval = Rendition.UI.Ajax(url, function () {
							if (instance.openTemplateReadObject.data[0][0] === treeNode.value) {
								instance.cutter2.cutters[1].innerHTML = '';
							}
							node.refreshParent();
						}, instance);
						confirmDialog.close();
					},
					onfalse: function (e, confirmDialog) {
						confirmDialog.close();
					}
				});
			}, false);
		}
		var menu = Rendition.UI.ContextMenu(e, {
			elements: options,
			caller: node,
			type: 'mouse'
		});
		Rendition.UI.closeContextMenus(menu);
		treeView.highlightLabelText(labelText);
		e.preventDefault();
		return;
	}
	instance.closeEditor = function (dialog) {
		if (instance.form) {
			var cleanYesNo = function (genForm) {
				Rendition.UI.removeEvent('close', instance.dialog, instance.closeEditor, false);
				if (instance.dialog) {
					instance.dialog.close();
				}
			}
			instance.form.checkSaveState({
				no: cleanYesNo,
				yes: cleanYesNo,
				clean: cleanYesNo
			});
			if (instance.dialog) {
				instance.dialog.preventDefault();
			}
		}
		return false;
	}
	instance.filterLabelClick = function (e, treeView, node, labelText, treeNode, parentNode) {
		if (treeView === null) { return }
		if (instance.form) {
			var cleanYesNo = function (genForm) {
				instance.openOrCreateTemplateOrFilter(e, treeView, node, labelText, treeNode, parentNode);
				treeView.highlightLabelText(labelText);
			}
			instance.form.checkSaveState({
				no: cleanYesNo,
				yes: cleanYesNo,
				clean: cleanYesNo
			});
			treeView.preventDefault();
		} else {
			instance.openOrCreateTemplateOrFilter(e, treeView, node, labelText, treeNode, parentNode);
		}
		return;
	}
	instance.openOrCreateTemplateOrFilter = function (e, treeView, node, labelText, treeNode, parentNode) {
		if (treeNode.text === '- Link a template -') {
			if (instance.templates.length < 2) {
				alert('You need to have at least two templates to link templates together.');
				treeView.preventDefault();
				return
			}
			var data = Rendition.UI.createDefaultRow(instance.templateDetailReadObject.header);
			data[1] = String(treeNode.value); /* set forign key */
			var templateList = [];
			var l = instance.templates.length;
			for (var x = 0; l > x; x++) {
				if (treeNode.value != instance.templates[x][0]) {
					templateList.push([instance.templates[x][0], instance.templates[x][1]]);
				}
			}
			var p = {
				commandType: 1,
				dataSet: {
					schema: instance.templateDetailReadObject.schema,
					header: instance.templateDetailReadObject.header,
					data: [data]
				},
				title: 'Add A New Filter',
				callbackProcedure: function (genForm, jsonResponse) {
					node.refreshParent();
					instance.filterLabelClick(null, null, null, null, { childNodes: [], value: jsonResponse.primaryKey }, null)
				},
				groups: [
					{
						name: 'Select Template To Link To',
						expanded: true,
						inputs: [
							{
								columnName: 'template',
								inputType: 'select',
								options: templateList
							}
						]
					}
				]
			}
			var ed = Rendition.UI.GenericEditor(p);
			Rendition.UI.appendEvent('mousedown', ed.submitButton, function () {
				/* name the linked template on the way out */
				ed.getInputByName('name').value = ed.selects[0].childNodes[ed.selects[0].selectedIndex].text;
				return;
			}, false);
			treeView.preventDefault();
			return;
		} else if (treeNode.text === '- Add a template -') {
			var data = Rendition.UI.createDefaultRow(instance.templatesReadObject.header);
			data[1] = 'Untitled Template';
			var p = {
				commandType: 1,
				dataSet: {
					schema: instance.templatesReadObject.schema,
					header: instance.templatesReadObject.header,
					data: [data]
				},
				title: 'Add A New Template',
				groups: instance.imagingFormStruc,
				callbackProcedure: function (genForm, jsonResponse) {
					node.refreshParent();
					instance.filterLabelClick(null, null, null, null, { childNodes: [], value: jsonResponse.primaryKey }, null)
				}
			}
			var ed = Rendition.UI.GenericEditor(p);
			treeView.preventDefault();
			return;
		} else if (treeNode.text === '- Add a filter -') {
			var data = Rendition.UI.createDefaultRow(instance.templateDetailReadObject.header);
			data[1] = String(treeNode.value); /* set forign key */
			data[2] = 'Untitled Filter';
			data[8] = String(Rendition.UI.emptyUUID); /* set -this is not a template- */
			data[4] = '\
using System;\n\
using System.Diagnostics;\n\
using System.Drawing;\n\
using Rendition;\n\
public class script {\n\
	public static Bitmap main(Bitmap image){\n\
		\n\
		/* Your code goes here */\n\
		\n\
		return image;\n\
	}\n\
}';
			var p = {
				commandType: 1,
				dataSet: {
					schema: instance.templateDetailReadObject.schema,
					header: instance.templateDetailReadObject.header,
					data: [data]
				},
				title: 'Add A New Filter',
				callbackProcedure: function (genForm, jsonResponse) {
					node.refreshParent();
					instance.filterLabelClick(null, null, null, null, { childNodes: [], value: jsonResponse.primaryKey }, null)
				},
				groups: instance.imagingdetailFormStruc
			}
			var ed = Rendition.UI.GenericEditor(p);
			treeView.preventDefault();
			return;
		} else {
			if (!treeNode.template) {
				var req = [
					"DataSet",
					['imagingTemplateDetail', 'where imagingTemplateDetailID = \'' + treeNode.value + '\'', '1', '1', '', {}, [], 'JSON', true, '-1', false, 'filterOrder', 'asc']
				]
				var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
				var reqEval = Rendition.UI.Ajax(url, instance.openfilter, instance);
			} else {
				var tId = treeNode.value;
				if (treeNode.data !== undefined) {
					if (treeNode.data[8] != Rendition.UI.emptyUUID) {
						tId = treeNode.data[8];
					}
				}
				var req = [
					"DataSet",
					['imagingTemplates', 'where imagingTemplateID = \'' + tId + '\'', '1', '1', '', {}, [], 'JSON', true, '-1', false, 'templateName', 'asc']
				]
				var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
				var reqEval = Rendition.UI.Ajax(url, instance.opentemplate, instance);
			}
		}
		return;
	}
	instance.assignSubMenu = function (contextParent, e, objectId) {
		var options = [];
		var optionLength = -1;
		var l = instance.imgL.length;
		for (var x = 0; l > x; x++) {
			optionLength++;
			options[optionLength] = Rendition.UI.MenuOption();
			options[optionLength].text = instance.imgL[x][0];
			options[optionLength].imageLocation = instance.imgL[x][1];
			options[optionLength].checked = instance.isLocationUsed(objectId, instance.openTemplateReadObject.data[0][0], instance.imgL[x][1]);
			Rendition.UI.appendEvent('click', options[optionLength], function (e) {
				/* do the assign command
				objectId,instance.openTemplateReadObject.data[0][0],instance.imgL[x][1]
				*/
				var req = [
					"SqlCommand",
					['update site_configuration set ' + this.option.imageLocation.s() + '_imagingTemplate = \'' + instance.openTemplateReadObject.data[0][0].s() + '\'' +
					' where unique_siteId = \'' + objectId.s() + '\'']
				]
				var req2 = [
					"GetSqlArray",
					[{ commandText: instance.siteCommandText}]
				]
				var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI() + '&method2=' + JSON.stringify(req2).toURI();
				var reqEval = Rendition.UI.Ajax(url, function (e) {
					var a = JSON.parse(e.responseText);
					instance.siteList = a.method2.GetSqlArray;
				}, instance);
			}, false);
		}
		var menu = Rendition.UI.ContextMenu(e, {
			elements: options,
			caller: contextParent,
			type: 'RenditionContextMenu'
		});
		return false;
	}
	instance.assignMenu = function (contextParent, e, objectId) {
		var options = [];
		var optionLength = -1;
		var l = instance.siteList.length;
		for (var x = 0; l > x; x++) {
			optionLength++;
			options[optionLength] = Rendition.UI.MenuOption();
			options[optionLength].text = instance.siteList[x][1];
			options[optionLength].siteId = instance.siteList[x][0];
			options[optionLength].hasChildren = true;
			Rendition.UI.appendEvent('mouseover', options[optionLength], function (e) {
				instance.assignSubMenu(this, e, this.option.siteId);
			}, false);
		}
		var menu = Rendition.UI.ContextMenu(e, {
			elements: options,
			caller: contextParent,
			type: 'RenditionMenuBar'
		});
		return false;
	}
	instance.previewMenu = function (contextParent, e, method, objectId) {
		instance.previewImageMessage = Rendition.UI.UpdateDialog({
			title: "Applying Filters...",
			subTitle: "Applying Filters...", message: "Applying filters, just a moment..."
		});
		instance.previewImage(method, objectId, '');
		return false;
	}
	instance.opentemplate = function (e) {
		var a = JSON.parse(e.responseText);
		instance.openTemplateReadObject = a.method1.DataSet;
		instance.menuBarElements = [];
		instance.menuBarElements[0] = Rendition.UI.MenuOption();
		instance.menuBarElements[0].text = 'Preview Template';
		Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
			instance.previewMenu(this, e, 'PreviewTemplate', instance.openTemplateReadObject.data[0][0]);
		}, false);
		Rendition.UI.appendEvent('mouseover', instance.menuBarElements[0], function (e) {
			if (Rendition.UI.contextMenus.length > 0) {
				instance.previewMenu(this, e, 'PreviewTemplate', instance.openTemplateReadObject.data[0][0])
			}
		}, false);
		instance.menuBarElements[1] = Rendition.UI.MenuOption();
		instance.menuBarElements[1].text = 'Render Template Images';
		Rendition.UI.appendEvent('click', instance.menuBarElements[1], function (e) {
			instance.pid = Rendition.UI.createUUID();
			instance.startProgressTimer(instance.openTemplateReadObject.data[0][0]);
			var req = [
				'RenderTemplateImages',
				[
					instance.openTemplateReadObject.data[0][0],
					instance.pid
				]
			]
			var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
			var reqEval = Rendition.UI.Ajax(url, function (e) {
				var a = JSON.parse(e.responseText);
				if (a.method1.error !== undefined) {
					alert(a.method1.description);
					return;
				}
				var i = a.method1.RenderTemplateImages;
				var l = i.length;
				instance.progressDialog.close();
				if (l > 0) {
					var msg = [];
					for (var x = 0; l > x; x++) {
						if (i[x].error != 0) {
							msg.push('Error:' + i[x].error + '\nDescription:' + i[x].description)
						}
					}
					if (msg.length > 0) {
						new Rendition.UI.Alert({
							title: a.description,
							content: '<textarea wrap="off" style="width:100%;height:100%;">There was one or more errors in your template code\n\n' +
										String(msg.join('')) + '</textarea>',
							dialogRect: { x: (document.documentElement.clientWidth / 2) - 325, y: 105, h: 400, w: 650 }
						});
					}
				}
			}, instance);
			return;
		}, false);
		instance.menuBarElements[2] = Rendition.UI.MenuOption();
		instance.menuBarElements[2].text = 'Assign Template';
		Rendition.UI.appendEvent('click', instance.menuBarElements[2], function (e) {
			instance.assignMenu(this, e, instance.openTemplateReadObject.data[0][0]);
		}, false);
		Rendition.UI.appendEvent('mouseover', instance.menuBarElements[2], function (e) {
			if (Rendition.UI.contextMenus.length > 0) {
				instance.assignMenu(this, e, instance.openTemplateReadObject.data[0][0])
			}
		}, false);
		instance.form = Rendition.UI.Form({
			dataSet: instance.openTemplateReadObject,
			dataSetIndex: 0,
			groups: instance.imagingFormStruc
		});
		instance.cutter2.cutters[1].innerHTML = '';
		instance.menuBar = Rendition.UI.MenuBar({
			options: instance.menuBarElements,
			parentNode: instance.cutter2.cutters[1]
		});
		instance.resize();
		Rendition.UI.wireupCloseEvents(instance.closeEditor, instance.cutter2.cutters[1]);
		Rendition.UI.wireupResizeEvents(instance.resize, instance.cutter2.cutters[1]);
		instance.form.form.style.marginTop = (instance.menuBar.style.rect.h + instance.menuBar.style.rect.x) + 'px';
		instance.form.form.style.overflowY = 'scroll';
		instance.form.appendTo(instance.cutter2.cutters[1]);
	}
	instance.previewImage = function (method, objectId, imagePath) {
		var req = [
			method,
			[objectId, imagePath, false]
		]
		var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
		var reqEval = Rendition.UI.Ajax(url, function (e) {
			instance.previewImageMessage.close();
			var a = JSON.parse(e.responseText);
			if (a.method1.error !== undefined) {
				alert('An error occured while rendering the preview image:\n\r' +
				a.method1.description);
			}
			a = a.method1[method];
			if (a.error === 0) {
				var viewer = Rendition.UI.ImageViewer({
					parentNode: instance.cutter2.cutters[0],
					src: '../' + a.image
				});
				if (instance.info !== undefined) {
					instance.info.hide();
				}
				instance.info = Rendition.UI.Info({
					position: { x: 75, y: 75 },
					timeout: 5000,
					title: 'Image Data',
					message: 'Size: ' + Rendition.UI.addCommas((a.imageInfo.size/1000).toFixed(2)) + 'Kb<br>' +
							'Height: ' + a.imageInfo.height + 'px<br>' +
							'Width: ' + a.imageInfo.width + 'px'
				});
			} else {
				var errors = a.errors;
				var msg = ['<textarea wrap="off" style="width:100%;height:100%;">There was one or more errors in your template code\n\n'];
				for (var x = 0; errors.length > x; x++) {
					msg.push(
						'----------------------------------------- Error ' + (x + 1) + ' ------------------------------------------------------- \n' +
						'Number: ' + errors[x].errorNumber + '\n' +
						'Description: ' + errors[x].errorText + '\n' +
						'----------------------------------------- Source ------------------------------------------------------- \n' +
						errors[x].sourceCode + '\n' +
						'----------------------------------------- End of Error ' + (x + 1) + ' ------------------------------------------------------- '
					)
				}
				new Rendition.UI.Alert({
					title: a.description,
					content: String(msg.join('')) + '</textarea>',
					dialogRect: { x: (document.documentElement.clientWidth / 2) - 325, y: 105, h: 400, w: 650 }
				});
			}
		}, instance);
	}
	instance.openfilter = function (e) {
		var a = JSON.parse(e.responseText);
		instance.openFilterReadObject = a.method1.DataSet;
		instance.menuBarElements = [];
		instance.menuBarElements[0] = Rendition.UI.MenuOption();
		instance.menuBarElements[0].text = 'Save Filter';
		Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
			instance.form.save();
			return false;
		}, false);

		instance.menuBarElements[1] = Rendition.UI.MenuOption();
		instance.menuBarElements[1].text = 'Preview';
		Rendition.UI.appendEvent('click', instance.menuBarElements[1], function (e) {
			instance.previewMenu(this, e, 'PreviewTemplateDetail', instance.openFilterReadObject.data[0][0]);
		}, false);
		Rendition.UI.appendEvent('mouseover', instance.menuBarElements[1], function (e) {
			if (Rendition.UI.contextMenus.length > 0) {
				instance.previewMenu(this, e, 'PreviewTemplateDetail', instance.openFilterReadObject.data[0][0])
			}
		}, false);

		instance.form = Rendition.UI.Form({
			dataSet: instance.openFilterReadObject,
			dataSetIndex: 0,
			groups: instance.imagingdetailFormStruc
		});

		instance.cutter2.cutters[1].innerHTML = '';
		instance.menuBar = Rendition.UI.MenuBar({
			options: instance.menuBarElements,
			parentNode: instance.cutter2.cutters[1]
		});
		instance.resize();
		Rendition.UI.wireupCloseEvents(instance.closeEditor, instance.cutter2.cutters[1]);
		Rendition.UI.wireupResizeEvents(instance.resize, instance.cutter2.cutters[1]);
		instance.form.form.style.marginTop = (instance.menuBar.style.rect.h + instance.menuBar.style.rect.x) + 'px';
		instance.form.form.style.overflowY = 'scroll';
		instance.form.appendTo(instance.cutter2.cutters[1]);
	}
	instance.resize = function () {
		instance.form.form.style.height = instance.cutter2.cutters[1].offsetHeight - (instance.menuBar.style.rect.h + instance.menuBar.style.rect.x) + 'px';
	}
	instance.filterNodes = function (treeView, treeNode, parentNode) {
		var m = instance.templateDetail.length;
		while (parentNode.firstChild) { parentNode.removeChild(parentNode.firstChild) }
		for (var x = 0; m > x; x++) {
			var p = {}
			$.extend(true, p, instance.templateDetail[x]);
			treeView.add({
				text: String(instance.templateDetail[x][2]),
				value: String(instance.templateDetail[x][0]),
				childNodes: []
			}, parentNode);
		}
	}
	instance.treeObject = function (data, nodeName) {
		var childNodes = [];
		var l = data.length;
		if (l != 0) {
			for (var x = 0; l > x; x++) {
				if (data[x][8] != Rendition.UI.emptyUUID) {
					childNodes.push({
						text: '<img style="margin-bottom:-4px;" src="/admin/img/icons/folder_link.png" alt="Filter"> ' + '<span style="font-weight:bold;">' + data[x][2] + '</span>',
						value: data[x][0],
						data: data[x],
						childNodes: [],
						template: true
					});
				} else {
					childNodes.push({
						text: '<img style="margin-bottom:-4px;" src="/admin/img/icons/script.png" alt="Filter"> ' + data[x][2],
						value: data[x][0],
						data: data[x],
						childNodes: [],
						template: false
					});
				}
			}
		}
		return childNodes;
	}
	instance.templateNodes = function (treeView, treeNode, parentNode) {
		var l = instance.templates.length;
		for (var x = 0; l > x; x++) {
			var tmpId = String(instance.templates[x][0]);
			var req = [
				"DataSet",
				['imagingTemplateDetail', 'where imagingTemplateID = \'' + tmpId + '\'', '0', '9999999', '', {}, [], 'JSON', true, '-1', false, 'filterOrder', 'asc']
			]
			treeView.add({
				text: '<img style="margin-bottom:-4px;" src="/admin/img/icons/folder.png" alt="Filter"> ' + '<span style="font-weight:bold;">' + String(instance.templates[x][1]),
				value: String(instance.templates[x][0]),
				template: true,
				childNodes: {
					url: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req),
					callbackArguments: [String(tmpId)],
					callbackProcedure: function (templateId, json, tree, node) {
						var a = json.method1.DataSet;
						if (a.error === 0) {
							var treeObj = instance.treeObject(a.data, node);
							var l = treeObj.length;
							while (node.firstChild) { node.removeChild(node.firstChild) }
							for (var x = 0; l > x; x++) {
								tree.add(treeObj[x], node);
							}
							treeView.add({
								text: '- Link a template -',
								value: templateId,
								childNodes: []
							}, node);
							treeView.add({
								text: '- Add a filter -',
								value: templateId,
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
		treeView.add({
			text: '- Add a template -',
			value: 'newtemplate',
			childNodes: []
		}, parentNode);
	}
	instance.startProgressTimer = function (templateId) {
		instance.progressDialog = Rendition.UI.dialogWindow({
			rect: {
				x: document.documentElement.clientWidth * .5 - (420 * .5),
				y: document.documentElement.clientHeight * .2,
				w: 420,
				h: 245
			},
			title: 'Rendering',
			modal: true
		});
		instance.details = document.createElement('div');
		instance.details.innerHTML = '<i>Updating data...</i>';
		var rows = [[instance.details]];
		instance.dt = Rendition.UI.pairtable({
			rows: rows
		});
		instance.cancelUploadButton = document.createElement('button');
		instance.cancelUploadButton.style.margin = '4px 7px 4px auto';
		instance.cancelUploadButton.style.display = 'block';
		instance.cancelUploadButton.style.visibility = 'hidden';
		instance.cancelUploadButton.innerHTML = '';
		instance.cancelUploadButton.onclick = function () {
			instance.abort = true;
			instance.progressDialog.close();
			return;
		}
		instance.progressGraphic = document.createElement('img');
		instance.progressGraphic.style.display = 'block';
		instance.progressGraphic.style.margin = 'auto';
		instance.progressGraphic.src = '/admin/img/update2_00.gif';
		instance.progressGraphic.height = 60;
		instance.progressGraphic.width = 272;
		instance.progressGraphic.style.height = '60px';
		instance.progressGraphic.style.width = '272px';
		instance.progressMeter = document.createElement('div');
		instance.progressMeter.style.width = '390px';
		instance.progressMeter.style.height = '25px';
		instance.progressMeter.style.margin = 'auto';
		instance.progressMeter.style.border = 'solid 1px lightgray';
		instance.progressMeter.style.background = 'darkgray';
		instance.progressMeterFill = document.createElement('div');
		instance.progressMeterFill.style.width = '0px';
		instance.progressMeterFill.style.height = '25px';
		instance.progressMeterFill.style.margin = '0 auto 0 0';
		instance.progressMeterFill.style.padding = '0';
		instance.progressMeterFill.style.background = 'lightblue';
		instance.progressMeter.appendChild(instance.progressMeterFill);
		instance.progressDialog.content.appendChild(instance.progressGraphic);
		instance.progressDialog.content.appendChild(instance.cancelUploadButton);
		instance.progressDialog.content.appendChild(instance.progressMeter);
		instance.progressbox = Rendition.UI.GroupBox({
			title: "Details",
			childNodes: [instance.dt.table]
		});
		instance.progressbox.appendTo(instance.progressDialog.content);
		instance.lastTime = null;
		instance.lastComplete = 0;
		instance.progressTimer(templateId);
		return instance;
	}
	instance.progressTimer = function (templateId) {
		var timerInterval = 500;
		if (instance.abort) { return; }
		var req = [
			'ProgressInfo',
			[
				instance.pid
			]
		]
		var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req), function (e) {
			var f = JSON.parse(e.responseText);
			if (f.method1.error !== undefined) {
				alert('Error: ' + f.method1.error + '\nDescription: ' + f.method1.description);
				instance.progressDialog.close();
				return;
			}
			a = f.method1.ProgressInfo;
			if (a.error === 0) {
				if (!a.complete) {
					setTimeout(instance.progressTimer, timerInterval);
				} else {
					if (args.fileManager) {
						args.fileManager.ls(instance.target, null, args.fileManager.pane[1]);
					}
					if (args.callbackProcedure) {
						args.callbackProcedure.apply(instance, [instance, a]);
					}
					instance.progressDialog.close();
				}
			} else if (a.error === -1) {
				setTimeout(instance.progressTimer, timerInterval);
			}
			if (a.error === 0) {
				var pct = (a.currentItemCount / a.totalItemCount) * 100;
				var comp = pct.toFixed(2) + '% Complete ' + Rendition.UI.addCommas(a.currentItemCount) + ' of ' + Rendition.UI.addCommas(a.totalItemCount) + ' items.';
				if (a.currentItemName === 'multipart/form-data stream') {
					instance.progressMeterFill.style.width = Math.floor(pct) + '%';
					if (instance.lastTime != null) {
						var kbps = ((a.currentItemCount - instance.lastComplete) / 1000) / (a.updated - instance.lastTime);
						if (!isNaN(kbps) && isFinite(kbps) && kbps > 0) {
							instance.details.innerHTML = comp + '<br>Speed: ' + Rendition.UI.addCommas(kbps.toFixed(2)) + ' items/second';
						}
					} else {
						instance.details.innerHTML = comp + '<br><i>Calculating...</i>';
					}
				} else {
					if (pct < 100) {
						instance.progressMeterFill.style.width = Math.floor(pct) + '%';
						var p = pct.toFixed(2) + '% Complete (' + a.currentItemCount + '/' + a.totalItemCount + ') ';
					} else {
						instance.progressMeterFill.style.width = '0%';
						var p = 0 + '% Complete ';
					}
					instance.details.innerHTML = p + 'Current Item: ' + Rendition.UI.truncateText(a.currentItemName, 200);
				}
				instance.lastTime = a.updated;
				instance.lastComplete = a.currentItemCount;
			}
		}, instance);
	}
	instance.init();
	return instance;
}