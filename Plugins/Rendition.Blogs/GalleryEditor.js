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
* Gallery editor.
* @constructor
* @name Rendition.Commerce.GalleryEditor
*/
Rendition.Commerce.GalleryEditor = function (args) {
	var instance = {}
	if (args === undefined) { args = {} }
	instance.mouseStart = { x: 0, y: 0 }
	instance.startCrop = { x: 0, y: 0 }
	instance.startImage = { x: 0, y: 0 }
	instance.resizeOffset = { x: 0, y: 0, h: 0, w: 0 }
	instance.handleBoxSize = 5;
	instance.handleWidth = 1;
	instance.artboardObjects = [];
	instance.active = false;
	instance.galleryCategoryGroup = function (imagingTemplates) {
		var a = [];
		a.push({
			name: 'Properties',
			expanded: true,
			inputs: [
				{
					columnName: 'categoryName'
				},
				{
					columnName: 'gallery_description'
				},
				{
                    displayName: 'Crop Height',
					columnName: 'height'
				},
				{
				    displayName: 'Crop Width',
					columnName: 'width'
				},
				{
					columnName: 'rotatorTemplate',
					inputType: 'select',
					options: imagingTemplates
				},
				{
					columnName: 'thumbTemplate',
					inputType: 'select',
					options: imagingTemplates
				},
				{
					columnName: 'fullsizeTemplate',
					inputType: 'select',
					options: imagingTemplates
				},
				{
					columnName: 'portfolioTemplate',
					inputType: 'select',
					options: imagingTemplates
				},
				{
					columnName: 'blogTemplate',
					inputType: 'select',
					options: imagingTemplates
				},
				{
					columnName: 'tags'
				}
			]
		});
		return a;
	}
	instance.galleryEditorGroup = function () {
		var a = [];
		a.push({
			name: 'Properties',
			expanded: true,
			inputs: [
				{
					columnName: 'title'
				},
				{
					columnName: 'path',
					inputType: 'fileManager'
				},
				{
					columnName: 'description'
				},
				{
					columnName: 'enabled'
				}
			]
		});
		a.push({
			name: 'Extended Properties',
			expanded: true,
			inputs: [
				{
					columnName: 'link'
				},
				{
					columnName: 'comments'
				},
				{
					columnName: 'tagsToSearchFor'
				},
				{
					columnName: 'exif'
				}
			]
		});
		a.push({
			name: 'Raw Coordanates',
			expanded: true,
			inputs: [
				{
					columnName: 'x'
				},
				{
					columnName: 'y'
				},
				{
					columnName: 'height'
				},
				{
					columnName: 'width'
				},
				{
					columnName: 'cropX'
				},
				{
					columnName: 'cropY'
				},
				{
					columnName: 'cropH'
				},
				{
					columnName: 'cropW'
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
	    instance.refreshImagingTemplates();
        if(!Rendition.treeViewCssAdded){
            Rendition.treeViewCssAdded = true;
            Rendition.UI.addCss('.handles { ' +
	        '    background:white; ' +
	        '    position:absolute; ' +
	        '    z-index:9999; ' +
	        '    border:solid 1px blue; ' +
            '} ' +
            '.cropbox { ' +
	        '    background: url(/admin/img/50PctAlphaBlackDot.png); ' +
	        '    color:Black; ' +
	        '    position:absolute; ' +
	        '    z-index:9998; ' +
            '} ');
        }
		if (args.parentNode === undefined) {
			instance.dialog = Rendition.UI.dialogWindow({
			    rect: { 
                    x: Rendition.UI.dialogPosition.x,
			        y: Rendition.UI.dialogPosition.y,
			        h: document.documentElement.clientHeight - 100, 
                    w: 700
			    },
				title: 'Gallery Editor',
				rememberPosition: true,
				id: 'galleryEditorAllByItself'
			});
			Rendition.UI.appendEvent('close', instance.dialog, instance.closeDialog);
			args.parentNode = instance.dialog.content;
		}
		instance.rootCutter = Rendition.UI.CutterBar({
			parentNode: args.parentNode,
			autoResize: false,
			id: 'galleryCutter1',
			position: 170
		});
		instance.galleryGrid = Rendition.UI.Grid({
			objectName: 'imageRotatorDetail',
			editMode: 3,
			suffix: 'where 1=2',
			genericEditor: true,
			editorParameters: {
				groups: instance.galleryEditorGroup(),
				supressUpdateButton: true
			}
		});
		instance.galleryCategoryGrid = Rendition.UI.Grid({
			objectName: 'imageRotatorCategories',
			editMode: 3,
			suffix: 'where 1=2',
			genericEditor: true,
			editorParameters: {
				groups: instance.galleryCategoryGroup(instance.imagingTemplates),
				supressUpdateButton: true
			}
		});
		instance.initTreeView();
		return instance;
	}
	instance.initTreeView = function () {
		var cmdTxt = 'select imageRotatorCategoryId, categoryName from imageRotatorCategories with (nolock) order by categoryName';
		if (args.galleryId !== undefined) {
			cmdTxt = 'select imageRotatorCategoryId, categoryName from imageRotatorCategories with (nolock) where imageRotatorCategoryId = \'' + args.galleryId + '\'';
		}
		var req1 = [
			'GetSqlArray',
			[{
				commandText: cmdTxt
			}]
		]
		var url = Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req1).toURI();
		var reqEval = Rendition.UI.Ajax(url, function (e) {
			var a = JSON.parse(e.responseText);
			instance.gallerys = a.method1.GetSqlArray;
			instance.tree = Rendition.UI.TreeView({
				parentNode: instance.rootCutter.cutters[0],
				rootNode: {
					text: 'gallerys',
					value: 'root',
					childNodes: instance.galleryNodes
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
	instance.treeObject = function (data, node, parentNode) {
		var childNodes = [];
		var l = data.length;
		if (l != 0) {
			for (var x = 0; l > x; x++) {
				childNodes.push({
					text: '<img style="margin-bottom:-4px;" src="/admin/img/icons/picture.png" alt=""> ' + data[x][1] + " (" + Rendition.UI.getFileNameFromFullPath(data[x][2]) + ")",
					value: data[x][0],
					data: data[x],
					id: parentNode.id,
					nodeType: 'image',
					childNodes: []
				});
			}
		}
		return childNodes;
	}
	instance.galleryNodes = function (treeView, treeNode, parentNode) {
		var l = instance.gallerys.length;
		for (var x = 0; l > x; x++) {
			var id = String(instance.gallerys[x][0]);
			var req = [
				"GetSqlArray",
				[
					{
						commandText: 'select imageRotatorDetailId, title, path, imageRotatorCategoryId from imageRotatorDetail with (nolock) where imageRotatorCategoryId = \'' + id + '\' order by rotator_order'
					}
				]
			]
			treeView.add({
				text: '<img style="margin-bottom:-4px;" src="/admin/img/icons/pictures.png" alt="' + String(instance.gallerys[x][1]) + '"> ' +
				'<span style="font-weight:bold;">' + instance.gallerys[x][1],
				value: String(instance.gallerys[x][1]),
				data: instance.gallerys[x],
				id: id,
				template: true,
				nodeType: 'root',
				childNodes: {
					url: Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req),
					callbackArguments: [String(id)],
					callbackProcedure: function (id, json, tree, node) {
						var a = json.method1.GetSqlArray;
						var treeObj = instance.treeObject(a, node, treeNode);
						var l = treeObj.length;
						while (node.firstChild) { node.removeChild(node.firstChild) }
						for (var x = 0; l > x; x++) {
							tree.add(treeObj[x], node);
						}
						tree.add({
							text: '- Add an image -',
							value: id,
							childNodes: [],
							nodeType: 'newimage'
						}, node);
						return false;
					}
				}
			}, parentNode);
		}
		if (args.galleryId === undefined ||
		(args.galleryId !== undefined && instance.gallerys.length === 0)) {
			treeView.add({
				text: '- Add a gallery -',
				nodeType: 'newgallery',
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
			groups: undefined
		}
		return a;
	}
	instance.setObjRect = function (obj, rect) {
		obj.style.top = (rect.y) + 'px';
		obj.style.left = (rect.x) + 'px';
		obj.style.width = (rect.w) + 'px';
		obj.style.height = (rect.h) + 'px';
	}
	instance.insideOf = function (coords, objRect) {
		if (coords.y > objRect.y && coords.y < objRect.y + objRect.h
		&& coords.x > objRect.x && coords.x < objRect.x + objRect.w) {
			return true;
		} else {
			return false;
		}
	}
	instance.showResizeArrows = function (mouse, objRect, toggle, active/*bool*/) {
		var m = 5; /* margin around the object that will change the cursor */
		if (
			mouse.y > objRect.y - m && mouse.y < objRect.y + m && /*on the right Y pane for the top box */
			mouse.x > (objRect.x - m) && mouse.x < (objRect.x + objRect.w + m)/* on the right X pane for the top box */
			) {
			toggle.t = true;
		} else {
			toggle.t = false;
		}
		if (
			mouse.y > objRect.y - m && mouse.y < objRect.y + objRect.h + m && /*on the right Y pane for the right box */
			mouse.x > (objRect.x + objRect.w - m) && mouse.x < (objRect.x + objRect.w + m)/* on the right X pane for the right box */
			) {
			toggle.r = true;
		} else {
			toggle.r = false;
		}
		if (
			mouse.y > objRect.y + objRect.h - m && mouse.y < objRect.y + objRect.h + m && /*on the right Y pane for the bottom box */
			mouse.x > (objRect.x - m) && mouse.x < (objRect.x + objRect.w + m)/* on the right X pane for the bottom box */
			) {
			toggle.b = true;
		} else {
			toggle.b = false;
		}
		if (
			mouse.y > objRect.y - m && mouse.y < objRect.y + objRect.h + m && /*on the left Y pane for the left box */
			mouse.x > (objRect.x - m) && mouse.x < (objRect.x + m)/* on the right X pane for the left box */
			) {
			toggle.l = true;
		} else {
			toggle.l = false;
		}
		if (mouse.y > objRect.y && mouse.y < objRect.y + objRect.h
		&& mouse.x > objRect.x && mouse.x < objRect.x + objRect.w) {
			toggle.m = true;
			document.body.style.cursor = 'move';
		} else {
			toggle.m = false;
		}
		if (toggle.t || toggle.r || toggle.b || toggle.l) {
			if (toggle.t) {
				document.body.style.cursor = 'n-resize';
			}
			if (toggle.r) {
				document.body.style.cursor = 'e-resize';
			}
			if (toggle.b) {
				document.body.style.cursor = 's-resize';
			}
			if (toggle.l) {
				document.body.style.cursor = 'w-resize';
			}
			if (toggle.l && toggle.t) {
				document.body.style.cursor = 'nw-resize';
			}
			if (toggle.l && toggle.b) {
				document.body.style.cursor = 'sw-resize';
			}
			if (toggle.r && toggle.b) {
				document.body.style.cursor = 'se-resize';
			}
			if (toggle.r && toggle.t) {
				document.body.style.cursor = 'ne-resize';
			}
		}
		return toggle;
	}
	instance.getResizedRect = function (e, mousePosition, resizeObj, toggle, aspectRect, obj) {
		/* always constrain aspect ratio */
		var shiftKey = true; //e.shiftKey;
		if (instance.image === obj) {
			aspectRatioH = instance.imageRect.h / instance.imageRect.w;
			aspectRatioW = instance.imageRect.w / instance.imageRect.h;
		} else {
			aspectRatioH = instance.crop.h / instance.crop.w;
			aspectRatioW = instance.crop.w / instance.crop.h;
		}
		var x = mousePosition.x;
		var y = mousePosition.y;
		var rect = false;
		if (toggle.t && toggle.l) {
			document.body.style.cursor = 'nw-resize';
			if (shiftKey) {
				var rect = {
					x: resizeObj.x,
					y: y,
					w: resizeObj.w + (instance.mouseStart.y / aspectRatioH),
					h: (resizeObj.y - y) + resizeObj.h
				}
			} else {
				var rect = {
					x: x,
					y: y,
					w: resizeObj.x - x + resizeObj.w,
					h: resizeObj.y - y + resizeObj.h
				}
			}
		} else if (toggle.t && toggle.r) {
			document.body.style.cursor = 'ne-resize';
			if (shiftKey) {
				var rect = {
					x: resizeObj.x,
					y: y,
					w: resizeObj.w + (instance.mouseStart.y / aspectRatioH),
					h: (resizeObj.y - y) + resizeObj.h
				}
			} else {
				var rect = {
					x: resizeObj.x,
					y: y,
					w: resizeObj.x - (x * -1) - resizeObj.x - resizeObj.x + resizeObj.w,
					h: (resizeObj.y - y) + resizeObj.h
				}
			}
		} else if (toggle.b && toggle.r) {
			document.body.style.cursor = 'se-resize';
			var rect = {
				x: resizeObj.x,
				y: resizeObj.y,
				w: resizeObj.x - (x * -1) - resizeObj.x - resizeObj.x + resizeObj.w,
				h: resizeObj.y - (y * -1) - resizeObj.y - resizeObj.y + resizeObj.h
			}
		} else if (toggle.b && toggle.l) {
			document.body.style.cursor = 'sw-resize';
			if (shiftKey) {
				var rect = {
					x: resizeObj.x,
					y: resizeObj.y,
					w: (resizeObj.x - x) + resizeObj.w,
					h: resizeObj.y - (y * -1) - resizeObj.y - resizeObj.y + resizeObj.h
				}
			} else {
				var rect = {
					x: x,
					y: resizeObj.y,
					w: (resizeObj.x - x) + resizeObj.w,
					h: resizeObj.y - (y * -1) - resizeObj.y - resizeObj.y + resizeObj.h
				}
			}
		} else if (toggle.t) {
			document.body.style.cursor = 'n-resize';
			if (shiftKey) {
				var rect = {
					x: resizeObj.x,
					y: y,
					w: resizeObj.w + (instance.mouseStart.y / aspectRatioH),
					h: (resizeObj.y - y) + resizeObj.h
				}
			} else {
				var rect = {
					x: resizeObj.x,
					y: y,
					w: resizeObj.w,
					h: (resizeObj.y - y) + resizeObj.h
				}
			}
		} else if (toggle.b) {
			document.body.style.cursor = 's-resize';
			if (shiftKey) {
				var rect = {
					x: resizeObj.x,
					y: resizeObj.y,
					w: resizeObj.x - (x * -1) - resizeObj.x - resizeObj.x + resizeObj.w,
					h: resizeObj.y - (y * -1) - resizeObj.y - resizeObj.y + resizeObj.h
				}
			} else {
				var rect = {
					x: resizeObj.x,
					y: resizeObj.y,
					w: resizeObj.w,
					h: resizeObj.y - (y * -1) - resizeObj.y - resizeObj.y + resizeObj.h
				}
			}
		} else if (toggle.r) {
			document.body.style.cursor = 'e-resize';
			if (shiftKey) {
				var rect = {
					x: resizeObj.x,
					y: resizeObj.y,
					w: resizeObj.x - (x * -1) - resizeObj.x - resizeObj.x + resizeObj.w,
					h: resizeObj.h
				}
			} else {
				var rect = {
					x: resizeObj.x,
					y: resizeObj.y,
					w: resizeObj.x - (x * -1) - resizeObj.x - resizeObj.x + resizeObj.w,
					h: resizeObj.h
				}
			}
		} else if (toggle.l) {
			document.body.style.cursor = 'w-resize';
			if (shiftKey) {
				var rect = {
					x: resizeObj.x,
					y: resizeObj.y,
					w: (resizeObj.x - x) + resizeObj.w,
					h: resizeObj.x - (x * -1) - resizeObj.x - resizeObj.x + resizeObj.h
				}
			} else {
				var rect = {
					x: x,
					y: resizeObj.y,
					w: resizeObj.x - x + resizeObj.w,
					h: resizeObj.h
				}
			}
		} else if (toggle.m) {
			var rect = {
				x: x,
				y: y,
				w: resizeObj.w,
				h: resizeObj.h
			}
		}
		if (shiftKey) {
			if (toggle.b || toggle.t || toggle.l) {
				rect.w = rect.h * aspectRatioW;
			} else if (toggle.r) {
				rect.h = rect.w * aspectRatioH;
			} else if (!toggle.m) {
				rect.w = rect.h * aspectRatioH;
			}
		}
		return rect;
	}
	instance.update = function (e) {
		document.body.style.cursor = 'auto';
		var mouse = Rendition.UI.mouseCoords(e); /* where is the mouse now */
		var mouseOffset = { x: (mouse.x - instance.mouseStart.x), y: (mouse.y - instance.mouseStart.y) }
		var cropDest = { x: instance.startCrop.x + mouseOffset.x, y: instance.startCrop.y + mouseOffset.y }
		var imageDest = { x: instance.startImage.x + mouseOffset.x, y: instance.startImage.y + mouseOffset.y }
		instance.overCropper = false;
		instance.overImage = false;
		var h = instance.artboardObjects.length;
		for (var x = 0; h > x; x++) {
			var a = instance.artboardObjects[x];
			var t = a.toggle;
			if (instance.insideOf(mouseOffset, a.rect)) {
				if (a.obj === instance.image) {
					instance.overImage = true;
				} else {
					instance.overCropper = true;
				}
			}
			if ((t.t || t.r || t.b || t.l || t.m) && instance.active && a.obj === instance.selectedObject) {
				var pos = { x: mouseOffset.x + a.rect.x, y: mouseOffset.y + a.rect.y }
				instance.setObjRect(a.obj, instance.getResizedRect(e, pos, a.rect, t, a.aspectRect, a.obj));
			} else if (a.obj === instance.selectedObject) {
				instance.artboardObjects[x].toggle = instance.showResizeArrows(mouseOffset, a.rect, t, a.active);
			}
		}
		instance.drawHandles();
		instance.updateCropBox();
	}
	instance.drawHandles = function () {
		/* draw a box around the selected object */
		if (instance.selectedObject === undefined) {
			instance.hideHandles();
			return;
		} else {
			instance.showHandles();
		}
		instance.handleRect = {
			x: instance.selectedObject.offsetLeft,
			y: instance.selectedObject.offsetTop,
			h: instance.selectedObject.offsetHeight,
			w: instance.selectedObject.offsetWidth
		}

		instance.setObjRect(instance.handles.r, {
			y: instance.handleRect.y,
			x: instance.handleRect.x + instance.handleRect.w,
			w: instance.handleWidth,
			h: instance.handleRect.h
		});

		instance.setObjRect(instance.handles.t, {
			y: instance.handleRect.y,
			x: instance.handleRect.x,
			w: instance.handleRect.w,
			h: instance.handleWidth
		});

		instance.setObjRect(instance.handles.b, {
			y: instance.handleRect.y + instance.handleRect.h,
			x: instance.handleRect.x,
			w: instance.handleRect.w,
			h: instance.handleWidth
		});

		instance.setObjRect(instance.handles.l, {
			y: instance.handleRect.y,
			x: instance.handleRect.x,
			w: instance.handleWidth,
			h: instance.handleRect.h
		});

		instance.setObjRect(instance.handles.tr, {
			y: instance.handleRect.y - (instance.handleBoxSize / 2),
			x: instance.handleRect.x + instance.handleRect.w - (instance.handleBoxSize / 2),
			w: instance.handleBoxSize,
			h: instance.handleBoxSize
		});

		instance.setObjRect(instance.handles.tl, {
			y: instance.handleRect.y - (instance.handleBoxSize / 2),
			x: instance.handleRect.x - (instance.handleBoxSize / 2),
			w: instance.handleBoxSize,
			h: instance.handleBoxSize
		});

		instance.setObjRect(instance.handles.br, {
			y: instance.handleRect.y + instance.handleRect.h - (instance.handleBoxSize / 2),
			x: instance.handleRect.x - (instance.handleBoxSize / 2),
			w: instance.handleBoxSize,
			h: instance.handleBoxSize
		});

		instance.setObjRect(instance.handles.bl, {
			y: instance.handleRect.y + instance.handleRect.h - (instance.handleBoxSize / 2),
			x: instance.handleRect.x + instance.handleRect.w - (instance.handleBoxSize / 2),
			w: instance.handleBoxSize,
			h: instance.handleBoxSize
		});

	}
	instance.updateCropBox = function () {
		instance.crop = {
			x: instance.cropCenter.offsetLeft,
			y: instance.cropCenter.offsetTop,
			h: instance.cropCenter.offsetHeight,
			w: instance.cropCenter.offsetWidth
		}
		var p = instance.artboard.parentNode;
		/* update crop boxes */
		instance.setObjRect(instance.cropBoxes.t, {
			y: 0,
			x: 0,
			w: p.offsetWidth,
			h: instance.crop.y
		});
		instance.setObjRect(instance.cropBoxes.r, {
			y: instance.crop.y,
			x: instance.crop.x + instance.crop.w,
			w: p.offsetWidth - (instance.crop.x + instance.crop.w),
			h: instance.crop.h
		});
		instance.setObjRect(instance.cropBoxes.b, {
			y: instance.crop.y + instance.crop.h,
			x: 0,
			w: p.offsetWidth,
			h: p.offsetHeight - (instance.crop.y + instance.crop.h)
		});
		instance.setObjRect(instance.cropBoxes.l, {
			y: instance.crop.y,
			x: 0,
			w: instance.crop.x,
			h: instance.crop.h
		});
	}
	instance.onmousewheel = function (e) {
		var mouse = Rendition.UI.mouseCoords(e);
		Rendition.UI.wheel(e, function (e) {
			var offset = Rendition.UI.getPosition(instance.image);
			mouse.x -= offset.x;
			mouse.y -= offset.y;
			if (mouse.x > instance.image.width || mouse.x < 0 || mouse.y > instance.image.height || mouse.y < 0) {
				return;
			}
			if (e > 0) {
				instance.zoom += .05
			} else {
				instance.zoom -= .05
			}
			if (instance.zoom <= 0) {
				instance.zoom = .03
			}
			var h = parseInt(instance.originalHeight * instance.zoom);
			var w = parseInt(instance.originalWidth * instance.zoom);
			instance.image.style.height = h + 'px'
			instance.image.style.width = w + 'px'


		});
	}
	instance.showHandles = function () {
		var x;
		for (x in instance.handles) {
			if (instance.handles[x] === undefined) { continue; }
			instance.handles[x].style.display = 'block';
			instance.handles[x].style.visibility = 'visible';
		}
	}
	instance.hideHandles = function () {
		var x;
		for (x in instance.handles) {
			if (instance.handles[x] === undefined) { continue; }
			instance.handles[x].style.display = 'none';
			instance.handles[x].style.visibility = 'hidden';
		}
	}
	instance.highlight = function (e) {
		if (e) {
			instance.drawHandles();
		} else {
			instance.hideHandles();
		}
	}
	instance.mouseup = function (e) {
		instance.selectEnd = Rendition.UI.mouseCoords(e);
		instance.active = false;
		var mouse = Rendition.UI.mouseCoords(e);
		instance.endOffset = {
			x: mouse.x - instance.mouseStart.x,
			y: mouse.y - instance.mouseStart.y
		}
		var h = instance.artboardObjects.length;
		if (instance.overCropper && instance.objectMousedown === instance.cropCenter) {
			instance.selectedObject = instance.cropCenter;
		} else if (instance.overImage && instance.objectMousedown === instance.image) {
			instance.selectedObject = instance.image;
		}
		instance.highlight(instance.selectedObject);
		instance.mouseStart = Rendition.UI.getPosition(instance.artboardParent);
		for (var x = 0; h > x; x++) {
			var a = instance.artboardObjects[x];
			a.toggle = { t: false, r: false, b: false, l: false, m: false }
			a.rect = { y: a.obj.offsetTop, x: a.obj.offsetLeft, h: a.obj.offsetHeight, w: a.obj.offsetWidth }
		}
		/* update values */
		instance.imageForm.getInputByName('cropX').value = instance.crop.x;
		instance.imageForm.getInputByName('cropY').value = instance.crop.y;
		instance.imageForm.getInputByName('cropH').value = instance.crop.h;
		instance.imageForm.getInputByName('cropW').value = instance.crop.w;
		instance.imageForm.getInputByName('x').value = instance.image.offsetLeft;
		instance.imageForm.getInputByName('y').value = instance.image.offsetTop;
		instance.imageForm.getInputByName('height').value = instance.image.height;
		instance.imageForm.getInputByName('width').value = instance.image.width;
		instance.setObjRect(instance.cropCenter, instance.crop);
		document.body.style.cursor = 'auto';
		Rendition.UI.removeEvent('mouseup', document.body, instance.mouseup);
	}

	instance.mousedown = function (e) {
		instance.mouseStart = Rendition.UI.mouseCoords(e);
		instance.selectStart = Rendition.UI.mouseCoords(e);
		var offset = Rendition.UI.getPosition(instance.artboard);
		instance.selectStart.x += offset.x;
		instance.selectStart.y += offset.y;
		instance.objectWasSelected = false;
		if (instance.overCropper) {
			instance.objectMousedown = instance.cropCenter;
		} else if (instance.overImage) {
			instance.objectMousedown = instance.image;
		}
		instance.active = true;
		Rendition.UI.appendEvent('mouseup', document.body, instance.mouseup, false);
		e.preventDefault();
		e.cancelBubble = true;
		return false;
	}
	instance.imageLoad = function () {
		instance.loadingDialog.close();
		instance.originalWidth = instance.image.width;
		instance.originalHeight = instance.image.height;
		instance.finishedLoading = true;
		if (parseInt(instance.imageForm.getInputByName('height').value) === 0 ||
		parseInt(instance.imageForm.getInputByName('width').value) === 0) {
			instance.imageForm.getInputByName('height').value = instance.image.height;
			instance.imageForm.getInputByName('width').value = instance.image.width;
			instance.imagePosition.h = instance.image.height;
			instance.imagePosition.w = instance.image.width;
		}
		instance.image.height = instance.imagePosition.h;
		instance.image.width = instance.imagePosition.w;
		instance.image.style.top = instance.imagePosition.y + 'px';
		instance.image.style.left = instance.imagePosition.x + 'px';
		instance.artboard.appendChild(instance.image);
		instance.originalImageAspectRect = { x: instance.image.offsetLeft, y: instance.image.offsetTop, h: instance.image.height, w: instance.image.width }
		instance.imageRect = { x: instance.image.offsetLeft, y: instance.image.offsetTop, h: instance.image.height, w: instance.image.width }
	}
	instance.nomousedown = function (e) { e.preventDefault(); return false; }
	instance.artboardEditor = function (imageId, parentNode, node) {
		instance.artboardParent = parentNode;
		instance.artboard = document.createElement('div');
		instance.cropCenter = document.createElement('div');
		instance.image = new Image();
		instance.image.onmouse = instance.nomousedown;
		instance.cropCenter.style.position = 'absolute';
		instance.cropCenter.style.background = 'red';
		instance.artboard.onclick = instance.nomousedown;
		Rendition.UI.appendEvent('mousedown', instance.artboard, instance.mousedown, false);
		Rendition.UI.appendEvent('mousedown', instance.cropCenter, instance.mousedown, false);
		instance.artboard.style.overflow = 'hidden';
		instance.zoom = 1;


		instance.artboard.className = 'item_image_artboard';
		instance.artboard.position = 'absolute';
		instance.handles = {
			t: document.createElement('div'),
			r: document.createElement('div'),
			b: document.createElement('div'),
			l: document.createElement('div'),
			tr: document.createElement('div'),
			tl: document.createElement('div'),
			bl: document.createElement('div'),
			br: document.createElement('div')
		}
		instance.cropBoxes = {
			t: document.createElement('div'),
			r: document.createElement('div'),
			b: document.createElement('div'),
			l: document.createElement('div')
		}
		for (var x in instance.cropBoxes) {
			if (instance.cropBoxes[x] !== undefined) {
				instance.cropBoxes[x].className = 'cropbox';
				instance.cropBoxes[x].onmousedown = instance.mousedown;
			}
		}
		for (var x in instance.handles) {
			if (instance.handles[x] !== undefined) {
				instance.handles[x].className = 'handles';
				instance.handles[x].onmousedown = instance.mousedown;
			}
		}

		var path = instance.imageForm.getInputByName('path').value;
		instance.crop = {
			x: parseInt(instance.imageForm.getInputByName('cropX').value),
			y: parseInt(instance.imageForm.getInputByName('cropY').value),
			h: parseInt(instance.imageForm.getInputByName('cropH').value),
			w: parseInt(instance.imageForm.getInputByName('cropW').value)
		}
		instance.imagePosition = {
			x: parseInt(instance.imageForm.getInputByName('x').value),
			y: parseInt(instance.imageForm.getInputByName('y').value),
			h: parseInt(instance.imageForm.getInputByName('height').value),
			w: parseInt(instance.imageForm.getInputByName('width').value)
		}
		instance.setObjRect(instance.cropCenter, instance.crop);

		instance.cropAspectRatio = instance.crop.h / instance.crop.w;
		instance.cropAspectRect = { x: instance.crop.x, y: instance.crop.y, h: instance.crop.h, w: instance.crop.w }
		instance.imageAspectRatio = instance.imagePosition.h / instance.imagePosition.w;
		instance.imageAspectRect = { x: instance.imagePosition.x, y: instance.imagePosition.y, h: instance.imagePosition.h, w: instance.imagePosition.w }

		instance.artboardObjects.push({
			rect: instance.imagePosition,
			originalRect: instance.imagePosition,
			aspectRect: instance.originalImageAspectRect,
			toggle: { t: false, r: false, b: false, l: false, m: false },
			obj: instance.image
		});

		instance.artboardObjects.push({
			rect: instance.crop,
			originalRect: instance.crop,
			aspectRect: instance.cropAspectRect,
			toggle: { t: false, r: false, b: false, l: false, m: false },
			obj: instance.cropCenter
		});

		/* TODO: validate input crop values */

		var req = [
			'GetImageStream',
			[
				path
			]
		]
		imageURL = Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req).toURI();
		instance.loadingDialog = Rendition.UI.UpdateDialog({
			title: 'Loading...',
			subTitle: 'Loading Image',
			message: 'Please wait while your image is loaded.'
		});
		instance.image.style.position = 'absolute';
		Rendition.UI.appendEvent('load', instance.image, instance.imageLoad, false);
		instance.image.src = imageURL;
		var resizeArtboard = function (e) {
			instance.artboard.style.height = instance.rootCutter.cutters[1].offsetHeight + 'px';
			instance.artboard.style.width = instance.rootCutter.cutters[1].offsetWidth + 'px';
			instance.drawHandles();
			instance.updateCropBox();
		}
		parentNode.appendChild(instance.cropBoxes.t);
		parentNode.appendChild(instance.cropBoxes.r);
		parentNode.appendChild(instance.cropBoxes.b);
		parentNode.appendChild(instance.cropBoxes.l);

		parentNode.appendChild(instance.handles.t);
		parentNode.appendChild(instance.handles.r);
		parentNode.appendChild(instance.handles.b);
		parentNode.appendChild(instance.handles.l);

		parentNode.appendChild(instance.handles.tr);
		parentNode.appendChild(instance.handles.tl);
		parentNode.appendChild(instance.handles.br);
		parentNode.appendChild(instance.handles.bl);

		parentNode.appendChild(instance.cropCenter);
		parentNode.appendChild(instance.artboard);
		instance.mouseStart = Rendition.UI.getPosition(instance.artboardParent);
		Rendition.UI.appendEvent('resize', instance.rootCutter, resizeArtboard, false);
		Rendition.UI.appendEvent('mousemove', instance.rootCutter.cutters[1], instance.update, false);
		resizeArtboard({ clientX: 0, clientY: 0 });
	}
	instance.galleryEditor = function (galleryId, parentNode, node) {
		instance.tabs = [];
		instance.tabs[0] = Rendition.UI.TabBarTab({
			title: 'Gallery Properties',
			load: function (tab, tabBar, content) {
				if (content.innerHTML === '') {
					if (args.galleryId !== undefined && instance.gallerys.length === 0) {
						instance.categoryForm = instance.galleryCategoryGrid.genericEditor(instance.galleryCategoryGrid.newRowIndex, {
							parentNode: content
						}, instance.galleryCategoryGrid.newRecord({ imageRotatorCategoryId: args.galleryId }));
					} else if (galleryId != Rendition.UI.emptyUUID) {
						var req1 = [
							"DataSet",
							['imageRotatorCategories', 'where imageRotatorCategoryId = \'' + galleryId + '\'', '1', '1', '', {}, [], 'JSON', true, '-1', false, '', '']
						]
						var url = Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req1).toURI();
						var reqEval = Rendition.UI.Ajax(url, function (e) {
							var a = JSON.parse(e.responseText);
							instance.formStruct = {
								dataSet: a.method1.DataSet,
								groups: instance.galleryCategoryGroup(instance.imagingTemplates)
							}
							instance.categoryForm = Rendition.UI.Form(instance.formStruct);
							instance.categoryForm.appendTo(content);
						}, instance);
					} else {
						instance.categoryForm = instance.galleryCategoryGrid.genericEditor(instance.galleryCategoryGrid.newRowIndex, {
							parentNode: content
						}, instance.galleryCategoryGrid.newRecord());
					}
					setTimeout(function () {
						instance.activeForm = instance.categoryForm;
					}, 100);
				}
			}
		});
		instance.tabs[1] = Rendition.UI.TabBarTab({
			title: 'Gallery Images',
			load: function (tab, tabBar, content) {
				if (content.innerHTML === '') {
					instance.galleryGrid = Rendition.UI.Grid({
						objectName: 'imageRotatorDetail',
						editMode: 3,
						rowCountColumn: true,
						suffix: 'where imageRotatorCategoryId = \'' + galleryId + '\'',
						parentNode: content,
						genericEditor: true,
						editorParameters: {
							groups: instance.galleryEditorGroup()
						}
					});
				}
			}
		});
		instance.menuBarElements = [];
		instance.menuBarElements[0] = Rendition.UI.MenuOption();
		instance.menuBarElements[0].text = 'Save';
		Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
			var n = (galleryId === Rendition.UI.emptyUUID) || (args.galleryId !== undefined && instance.gallerys.length === 0);
			instance.categoryForm.save(n, Rendition.UI.iif(n, 1, 0), function () {
				if (node.parentNode) {
					node.refreshParent(); /* refresh the node this item was just added to */
				}
				instance.refreshSiteGalleries();
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
	instance.imageEditor = function (imageId, parentNode, node, newRecordRow) {
		instance.tabs = [];
		instance.tabs[0] = Rendition.UI.TabBarTab({
			title: 'Properties',
			load: function (tab, tabBar, content) {
				if (content.innerHTML === '') {
					if (imageId != Rendition.UI.emptyUUID) {
						var req1 = [
							"DataSet",
							['imageRotatorDetail', 'where imageRotatorDetailId = \'' + imageId + '\'', '1', '1', '', {}, [], 'JSON', true, '-1', false, '', '']
						]
						var url = Rendition.UI.clientServerSyncURI +
						'method1=' + JSON.stringify(req1).toURI();
						var reqEval = Rendition.UI.Ajax(url, function (e) {
							var a = JSON.parse(e.responseText);
							instance.formStruct = {
								dataSet: a.method1.DataSet,
								groups: instance.galleryEditorGroup()
							}
							instance.imageForm = Rendition.UI.Form(instance.formStruct);

							if (
								parseInt(instance.imageForm.getInputByName('cropH').value) === 0 ||
								parseInt(instance.imageForm.getInputByName('cropW').value) === 0
							) {
								instance.imageForm.getInputByName('cropH').value = instance.galleryHeight;
								instance.imageForm.getInputByName('cropW').value = instance.galleryWidth;
							}
							instance.imageForm.appendTo(content);
						}, instance);
					} else {
						instance.imageForm = instance.galleryGrid.genericEditor(instance.galleryGrid.newRowIndex, { parentNode: content }, newRecordRow);
					}
					setTimeout(function () {
						instance.activeForm = instance.imageForm;
					}, 100);
				}
			}
		});
		instance.tabs[1] = Rendition.UI.TabBarTab({
			title: 'Image',
			load: function (tab, tabBar, content) {
				if (content.innerHTML === '') {
					content.style.overflow = 'hidden';
					instance.artboardEditor(imageId, content, node);
				}
			}
		});
		instance.menuBarElements = [];
		instance.menuBarElements[0] = Rendition.UI.MenuOption();
		instance.menuBarElements[0].text = 'Save';
		Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
			var n = imageId === Rendition.UI.emptyUUID;
			instance.imageForm.save(n, Rendition.UI.iif(n, 1, 0), function () {
				if (node.parentNode) {
					node.refreshParent(); /* refresh the node this item was just added to */
				}
				instance.refreshSiteGalleries();
			}, false/*async*/);
			return false;
		}, false);
		instance.menuBarElements[1] = Rendition.UI.MenuOption();
		instance.menuBarElements[1].text = 'Preview Cropping';
		Rendition.UI.appendEvent('click', instance.menuBarElements[1], function (e) {
			var req = [
				'PreviewGalleryCropping',
				[
					instance.imageForm.getInputByName('path').value,
					parseInt(instance.imageForm.getInputByName('cropX').value),
					parseInt(instance.imageForm.getInputByName('cropY').value),
					parseInt(instance.imageForm.getInputByName('cropW').value),
					parseInt(instance.imageForm.getInputByName('cropH').value),
					parseInt(instance.imageForm.getInputByName('x').value),
					parseInt(instance.imageForm.getInputByName('y').value),
					parseInt(instance.imageForm.getInputByName('width').value),
					parseInt(instance.imageForm.getInputByName('height').value),
					instance.galleryWidth,
					instance.galleryHeight
				]
			]
			var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req).toURI(), function (e) {
				var a = JSON.parse(e.responseText);
				if (a.method1.error !== undefined) {
					alert(a.method1.description);
				} else {
					var newImageViewer = Rendition.UI.ImageViewer({ src: '../' + a.method1.PreviewGalleryCropping });
				}
			}, instance);

			return false;
		}, false);
		instance.menuBarElements[2] = Rendition.UI.MenuOption();
		instance.menuBarElements[2].text = 'Help';
		Rendition.UI.appendEvent('click', instance.menuBarElements[2], function (e) {
			instance.imageCropHelpDialog = Rendition.UI.UpdateDialog({
				title: 'Image Gallery Help',
				subTitle: 'How to use the cropping tool',
				message: 'The image rotator program uses images from galleries to create a rotating list of images.  ' +
				'The images in the rotator program are always the same height and width.  ' +
				'Use the cropping tool to create the rotator cropping properties.  ' +
				'Click and drag the edges of the cropping square or the images to resize the image or cropping tool.'
			});
			instance.imageCropHelpDialog.autosize();
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
			offsetRect: { x: 0, y: instance.menuBar.style.rect.h - 1, h: 0, w: 0 }
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
			instance.galleryEditor(treeNode.data[0], instance.rootCutter.cutters[1], node);
		} else if (nType === 'image') {
			var req1 = [
				'GetSqlArray',
				[{
					commandText: "select width, height from imageRotatorCategories where imageRotatorCategoryId = '" + treeNode.data[3] + "';"
				}]
			]
			var url = Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req1).toURI();
			var reqEval = Rendition.UI.Ajax(url, function (e) {
				var a = JSON.parse(e.responseText);
				var targetSize = a.method1.GetSqlArray;
				instance.galleryHeight = parseInt(targetSize[0][1]);
				instance.galleryWidth = parseInt(targetSize[0][0]);
				instance.rootCutter.cutters[1].innerHTML = '';
				instance.imageEditor(treeNode.data[0], instance.rootCutter.cutters[1], node);
			}, instance);
		} else if (nType === 'newimage') {
			var req1 = [
				'GetSqlArray',
				[{
					commandText: "select width, height from imageRotatorCategories where imageRotatorCategoryId = '" + treeNode.value + "';"
				}]
			]
			var url = Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req1).toURI();
			var reqEval = Rendition.UI.Ajax(url, function (e) {
				var a = JSON.parse(e.responseText);
				var targetSize = a.method1.GetSqlArray;
				instance.galleryHeight = parseInt(targetSize[0][1]);
				instance.galleryWidth = parseInt(targetSize[0][0]);
				instance.rootCutter.cutters[1].innerHTML = '';
				var newRecordRow = instance.galleryGrid.newRecord({
					imageRotatorCategoryId: treeNode.value,
					lastEditor: Rendition.Commerce.user.userId,
					author: Rendition.Commerce.user.userId,
					editor: Rendition.Commerce.user.userId,
					cropW: parseInt(targetSize[0][0]),
					cropH: parseInt(targetSize[0][1])
				});
				instance.imageEditor(Rendition.UI.emptyUUID, instance.rootCutter.cutters[1], node, newRecordRow);
			}, instance);
		} else if (nType === 'newgallery') {
			instance.rootCutter.cutters[1].innerHTML = '';
			if (args.galleryId !== undefined) {
				instance.galleryEditor(args.galleryId, instance.rootCutter.cutters[1], node);
			} else {
				instance.galleryEditor(Rendition.UI.emptyUUID, instance.rootCutter.cutters[1], node);
			}

		}
	}
	instance.refreshSitegallerys = function () {
		var req = [
			'refreshSitegallerys',
			[]
		]
		instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req).toURI(), function (e) {
			return;
		}, instance);
	}
	instance.labelContextMenu = function (e, treeView, node, labelText, treeNode, parentNode) {
		var optionIndex = -1;
		var options = [];
		var nType = treeNode.nodeType;
		if (nType === 'image') {
			optionIndex++;
			options[optionIndex] = Rendition.UI.MenuOption();
			options[optionIndex].text = 'Delete Image';
			Rendition.UI.appendEvent('click', options[optionIndex], function () {/*TODO:put delete reciprcol replies here */
				var req = ['SqlCommand', ['delete from imageRotatorDetail where imageRotatorDetailId = \'' + treeNode.data[0] + '\'']];
				instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req).toURI(), function (e) {
					var f = JSON.parse(e.responseText);
					if (f.method1.SqlCommand.error != 0) {
						alert(f.method1.SqlCommand.description);
					} else {
						treeView.removeNode(node);
					}
				}, instance);
			}, false);
			optionIndex++;
			options[optionIndex] = Rendition.UI.MenuOption();
			options[optionIndex].text = 'Render Image';
			Rendition.UI.appendEvent('click', options[optionIndex], function () {/*TODO:put delete reciprcol replies here */
				instance.renderingDialog = Rendition.UI.UpdateDialog({
					title: 'Rendering...',
					subTitle: 'Rendering Gallery Image',
					message: 'Please wait while images are rendered.'
				});
				instance.progressId = Rendition.UI.createUUID();
				instance.startProgressTimer();
				var req = ['RenderImageGallery', [treeNode.id, instance.progressId]];
				instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req).toURI(), function (e) {
					instance.renderingDialog.close();
					var f = JSON.parse(e.responseText);
					if (f.method1.error !== undefined) {
						alert(f.method1.description);
						return;
					}
					if (f.method1.RenderImageGallery.error != 0) {
						alert(f.method1.RenderImageGallery.description);
						return;
					}
					instance.refreshSiteGalleries();
				}, instance);
			}, false);
		} else if (nType === 'root') {
			optionIndex++;
			options[optionIndex] = Rendition.UI.MenuOption();
			options[optionIndex].text = 'Render Gallery';
			Rendition.UI.appendEvent('click', options[optionIndex], function () {/*TODO:put delete reciprcol replies here */
				instance.renderingDialog = Rendition.UI.UpdateDialog({
					title: 'Rendering...',
					subTitle: 'Rendering Gallery Image(s)',
					message: 'Please wait while images are rendered.'
				});
				instance.progressId = Rendition.UI.createUUID();
				instance.startProgressTimer();
				var req = ['RenderImageGallery', [treeNode.data[0], instance.progressId]];
				instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req).toURI(), function (e) {
					instance.renderingDialog.close();
					var f = JSON.parse(e.responseText);
					if (f.method1.error !== undefined) {
						alert(f.method1.description);
						return;
					}
					if (f.method1.RenderImageGallery.error != 0) {
						alert(f.method1.RenderImageGallery.description);
						return;
					}
					instance.refreshSiteGalleries();
				}, instance);
			}, false);
			optionIndex++;
			options[optionIndex] = Rendition.UI.MenuOption();
			options[optionIndex].text = 'Delete Gallery';
			Rendition.UI.appendEvent('click', options[optionIndex], function () {
				instance.confirmClose = Rendition.UI.ConfirmDialog({
					ontrue: function () {
						var req = ['SqlCommand', [/*TODO:put delete reciprcol replies here */
						'delete from imageRotatorCategories where imageRotatorCategoryId = \'' + treeNode.data[0] + '\';' +
						'delete from imageRotatorDetail where imageRotatorCategoryId = \'' + treeNode.data[0] + '\';']
						];
						instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req).toURI(), function (e) {
							var f = JSON.parse(e.responseText);
							if (f.method1.SqlCommand.error != 0) {
								alert(f.method1.SqlCommand.description);
							} else {
								treeView.removeNode(node);
							}
							instance.refreshSiteGalleries();
						}, instance);
						instance.confirmClose.dialog.close();
						instance.rootCutter.cutters[1].innerHTML = '';
					},
					onfalse: function () {
						instance.confirmClose.dialog.close();
					},
					title: 'Confirm gallery Delete',
					subTitle: 'Delete this entire gallery?',
					message: 'Delete this entire gallery and all entires and replies belonging to it?<br>' +
					'If you don\'t want to delete this gallery click cancel.<br>' +
					'If you\'re sure you want to delete this gallery click Ok.<br>',
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
			"UpdateGalleryOrder",
			[JSON.stringify(order)]
		]
		instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req1).toURI(), function (e) {
			var f = JSON.parse(e.responseText);
			if (f.method1.UpdateGalleryOrder.error != 0) {
				alert(f.method1.UpdateGalleryOrder.description);
			}
			instance.refreshSitegallerys();
		}, instance);
		return false;
	}
	instance.refreshSiteGalleries = function () {
		var req = [
			'RefreshGalleriesCache',
			[]
		]
		instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req).toURI(), function (e) {
			return;
		}, instance);
	}
	instance.refreshImagingTemplates = function () {
		var req = [
			"GetSqlArray",
			[{ "commandText": "select upper(cast(imagingTemplateId as varchar(60))) ,templateName from dbo.imagingTemplates with (nolock)"}]
		]
		instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req).toURI(), function (e) {
			var a = JSON.parse(e.responseText);
			instance.imagingTemplates = a.method1.GetSqlArray;
			return;
		}, instance, false);
	}
	instance.startProgressTimer = function () {
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
		instance.progressTimer();
		return instance;
	}
	instance.progressTimer = function () {
		var timerInterval = 500;
		if (instance.abort) { return; }
		var req = [
			'ProgressInfo',
			[
				instance.progressId
			]
		]
		var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + 'method1=' + JSON.stringify(req), function (e) {
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
						var p = pct.toFixed(2) + '% Complete ';
					} else {
						instance.progressMeterFill.style.width = '0%';
						var p = 0 + '% Complete ';
					}
					instance.details.innerHTML = p + ' ' + Rendition.UI.truncateText(a.currentItemName, 220);
				}
				instance.lastTime = a.updated;
				instance.lastComplete = a.currentItemCount;
			}
		}, instance);
	}
	instance.init();
	return instance;
}