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
* Style for the <link xlink:href="Rendition.UI.RichTextEditor"/>.
* The default style is Rendition.UI.defaultRichTextEditorStyle.
* @constructor
* @name Rendition.UI.RichTextEditorStyle
*/
Rendition.UI.RichTextEditorStyle = function () {
	var instance = {}
	/**
	* The unique id of this instance.
	* @name RichTextEditorStyle.id
	* @memberOf Rendition.UI.RichTextEditorStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of object. Returns RenditionRichTextEditorStyle.
	* @name RichTextEditorStyle.type
	* @memberOf Rendition.UI.RichTextEditorStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionRichTextEditorStyle';
	/**
	* CSS Background property of the editing area.
	* @name RichTextEditorStyle.pageBackground
	* @memberOf Rendition.UI.RichTextEditorStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.pageBackground = 'White';
	/**
	* CSS Color property (font color) of the editing area.
	* @name RichTextEditorStyle.pageFontColor
	* @memberOf Rendition.UI.RichTextEditorStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.pageFontColor = 'Black';
	/**
	* The CSS border property of the editing area.
	* @name RichTextEditorStyle.pageBorder
	* @memberOf Rendition.UI.RichTextEditorStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.pageBorder = 'solid 1px #777';
	/**
	* CSS Background property of the tool bar area.
	* @name RichTextEditorStyle.toolBarBackground
	* @memberOf Rendition.UI.RichTextEditorStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.toolBarBackground = 'transparent';
	/**
	* The CSS border property of the tool bar area.
	* @name RichTextEditorStyle.toolBarBorder
	* @memberOf Rendition.UI.RichTextEditorStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.toolBarBorder = 'solid 1px #CCC';
	/**
	* The offset, and height and width the <link xlink:href="Rendition.UI.RichTextEditor"/>.
	* @name RichTextEditorStyle.tabBarRect
	* @memberOf Rendition.UI.RichTextEditorStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.previewRect = { x: 0, y: 0, h: 0, w: 800 }
	return instance;
}
/**
* Creates a DHTML based rich text editor.  Uses a iFrame or textarea depending on the editing mode
* the user selects.
* @constructor
* @name Rendition.UI.RichTextEditor
* @param {Native.Object} args Parameters for the <link xlink:href="Rendition.UI.SelectDialog"/>.
*/
Rendition.UI.RichTextEditor = function (args) {
	var instance = {}
	if (args === undefined) { args = {} }
	/**
	* The unique id of this instance.
	* @name richTextEditor.id
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of object. Returns RenditionInputSelectButton.
	* @name richTextEditor.type
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionRichTextEditor';
	instance.index = Rendition.UI.richTextEditors.length;
	instance.recordId = args.recordId;
	/* how long to wait inbetween checks to see if the iframe componet has connected to the body and is loadable */
	instance.pauseForDocumentWireup = 250;
	Rendition.UI.richTextEditors.push(instance);
	/**
	* Attach a procedure to an event. 
	* @function
	* @name richTextEditor.addEventListener
	* @memberOf Rendition.UI.RichTextEditor.prototype
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
	/**
	* Removes an event from subscription list.  The [proc] must match exactly the [proc] subscribed with.
	* @function
	* @name richTextEditor.removeEventListener
	* @memberOf Rendition.UI.RichTextEditor.prototype
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
	* Used internally to add events used in the arugments of this instance.
	* @function
	* @name richTextEditor.addInitalEvents
	* @memberOf Rendition.UI.RichTextEditor.prototype
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
    * Used internally to add css for this widget. (Deprecated)
    * @function
    * @name richTextEditor.applyCSS
    * @memberOf Rendition.UI.RichTextEditor.prototype
    * @type Native.undefined
    * @private
    */
    instance.applyCSS = function(){

    }
	/**
	* Adds an image at the cursor using <link xlink:href="Rendition.UI.UploadDialog"/>.
	* @function
	* @name richTextEditor.insertImage
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @param {Native.Function} eventProc The event to add.
	* @public
	*/
	instance.insertImage = function (e) {
		instance.uploadDialog = Rendition.UI.UploadDialog({
			singleFile: true,
			callbackProcedure: function (uploadDialog, returnparams) {
				var selectedFilePath = returnparams.uploadedFiles[0];
				var fileName = selectedFilePath.substring(selectedFilePath.lastIndexOf("\\") + 1);
				var req1 = [
					'MkDir',
					[
								"~\\img\\rte"
							]
				]
				var req2 = [
					'Cp',
					[
								[selectedFilePath],
								"~\\img\\rte\\",
								true/*move*/
							]
				]
				var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI() + '&method2=' + JSON.stringify(req2).toURI(), function (e) {
					var a = JSON.parse(e.responseText);
					a = a.method2.Cp;
					if (a.error != 0) {
						alert(a);
					} else {
						var ext = fileName.substring(fileName.length - 3).toUpperCase();
						if (ext === 'JPG' || ext === 'PNG' || ext === 'GIF') {
							instance.editorCmd('insertImage', window.document.URL.replace(/\/admin\//g, "") + "/img/rte/" + fileName);
						} else {
							alert(Rendition.Localization['RichTextEditor_You_can_only_insert_jpg_gif_or_png_images'].Title);
						}
					}
				}, instance);
			}
		});
		return;
	}
	/**
	* Adds a gallery script to the current cursor position using a dialog.
	* @function
	* @name richTextEditor.insertGallery
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @param {Native.Function} eventProc The event to add.
	* @public
	*/
	instance.insertGallery = function (e) {
		instance.galleryWindow = Rendition.UI.dialogWindow({
			rect: { x: document.documentElement.clientWidth / 2 - 250, y: 100, h: 140, w: 500 },
			title: 'Add A Gallery',
			modal: true
		});
		var req1 = [
			'GetSqlArray',
			[{
				commandText: "select imageRotatorCategoryId, categoryName from imageRotatorCategories with (nolock) order by categoryName"
			}]
		]
		var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
			var a = JSON.parse(e.responseText);
			if (a.method1.error !== undefined) {
				alert(a.method1.description);
				return;
			}
			instance.galleries = a.method1.GetSqlArray;
			var input = document.createElement('select');
			Rendition.UI.fillSelect(input, instance.galleries, 0, 1);
			var okButton = document.createElement('button');
			var cancelButton = document.createElement('button');
			okButton.innerHTML = 'Ok';
			okButton.style.margin = '4px';
			okButton.style.cssFloat = 'right';
			cancelButton.innerHTML = 'Cancel';
			cancelButton.style.cssFloat = 'right';
			cancelButton.style.margin = '4px';
			okButton.onclick = function () {
				var req1 = [
					'GetGallery',
					[
						input.value
					]
				]
				var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
					var a = JSON.parse(e.responseText);
					instance.galleryWindow.close();
					instance.selectionReplaceWith('<img src="' + a.method1.GetGallery.gallery.images[0].rotator + '" galleryId="' + a.method1.GetGallery.gallery.id + '" class="gallery">');
				}, instance);
			}
			var pt = Rendition.UI.pairtable({
				rows: [[Rendition.UI.txt('Gallery'), input]]
			});
			var gb = Rendition.UI.GroupBox({
				title: 'Gallery',
				childNodes: [pt.table],
				expanded: true
			});
			gb.appendTo(instance.galleryWindow.content);
			instance.galleryWindow.content.appendChild(okButton);
			instance.galleryWindow.content.appendChild(cancelButton);
		}, instance);


	}
	/**
	* Adds a link to the current cursor position using a happy little dialog.
	* @function
	* @name richTextEditor.insertLink
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @param {Native.Function} eventProc The event to add.
	* @public
	*/
	instance.insertLink = function (e) {
		instance.linkWindow = Rendition.UI.dialogWindow({
			rect: { x: document.documentElement.clientWidth / 2 - 250, y: 100, h: 140, w: 500 },
			title: Rendition.Localization['RichTextEditor_Add_A_Link'].Title,
			modal: true
		});
		var okButton = document.createElement('button');
		var prviewButton = document.createElement('button');
		var cancelButton = document.createElement('button');
		var input = document.createElement('input');
		cancelButton.onclick = function () {
			instance.linkWindow.close();
		}
		okButton.onclick = function () {
			instance.editorCmd('createlink', [input.value]);
			instance.linkWindow.close();
		}
		prviewButton.onclick = function () {
			window.open(input.value, 'linkpreview');
		}
		input.style.width = '100%';
		okButton.innerHTML = 'Ok';
		okButton.style.margin = '4px';
		okButton.style.cssFloat = 'right';
		prviewButton.innerHTML = 'Preview';
		prviewButton.style.cssFloat = 'right';
		prviewButton.style.margin = '4px';
		cancelButton.innerHTML = 'Cancel';
		cancelButton.style.cssFloat = 'right';
		cancelButton.style.margin = '4px';
		var pt = Rendition.UI.pairtable({
			rows: [[Rendition.UI.txt('Link'), input]]
		});
		var gb = Rendition.UI.GroupBox({
			title: Rendition.Localization['RichTextEditor_Link'].Title,
			childNodes: [pt.table],
			expanded: true
		});
		pt.table.rows[0].cells[1].width = '90%';
		gb.appendTo(instance.linkWindow.content);
		instance.linkWindow.content.appendChild(okButton);
		instance.linkWindow.content.appendChild(prviewButton);
		instance.linkWindow.content.appendChild(cancelButton);
		return;
	}
	/**
	* Array of tools.  A tool looks like this { proc: function(){// event procedure //}, title:'Title', icon: 'path to icon' }.
	* @name richTextEditor.tools
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.Array
	* @public
	* @property
	*/
	instance.tools = [
		{
			proc: function () {
				if (instance.mode === 'design') {
					instance.mode = 'html';
					instance.htmlMode();
				} else {
					instance.mode = 'design';
					instance.designMode();
				}

				return;
			},
			title: Rendition.Localization['RichTextEditor_Mode'].Title,
			icon: '/admin/img/icons/html.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('bold', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Bold'].Title,
			icon: '/admin/img/icons/text_bold.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('italic', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Italic'].Title,
			icon: '/admin/img/icons/text_italic.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('strikethrough', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Strike_Through'].Title,
			icon: '/admin/img/icons/text_strikethrough.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('underline', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Underline'].Title,
			icon: '/admin/img/icons/text_underline.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('justifyleft', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Justify_Left'].Title,
			icon: '/admin/img/icons/text_align_left.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('justifycenter', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Justify_Center'].Title,
			icon: '/admin/img/icons/text_align_center.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('justifyright', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Justify_Right'].Title,
			icon: '/admin/img/icons/text_align_right.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('justifyfull', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Justify_Full'].Title,
			icon: '/admin/img/icons/text_align_justify.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('indent', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Indent'].Title,
			icon: '/admin/img/icons/text_indent.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('outdent', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Outdent'].Title,
			icon: '/admin/img/icons/text_indent_remove.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('subscript', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Sub_Script'].Title,
			icon: '/admin/img/icons/text_subscript.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('superscript', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Super_Script'].Title,
			icon: '/admin/img/icons/text_superscript.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('insertorderedlist', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Ordered_List'].Title,
			icon: '/admin/img/icons/text_list_numbers.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('insertunorderedlist', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Unordered_List'].Title,
			icon: '/admin/img/icons/text_list_bullets.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('inserthorizontalrule', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Horizontal_Rule'].Title,
			icon: '/admin/img/icons/text_horizontalrule.png'
		},
		{
			proc: function (e) {
				new Rendition.UI.ColorChooser({
					callbackProcedure: function (e) {
						instance.editorCmd('forecolor', ['#' + e]);
					}
				});
				return;
			},
			title: Rendition.Localization['RichTextEditor_Color'].Title,
			icon: '/admin/img/icons/palette.png'
		},
		{
			proc: function (e) {
				new Rendition.UI.ColorChooser({
					callbackProcedure: function (e) {
						instance.editorCmd('backcolor', ['#' + e]);
					}
				});
				return;
			},
			title: Rendition.Localization['RichTextEditor_Background_Color'].Title,
			icon: '/admin/img/icons/color_wheel.png'
		},
		{
			proc: instance.insertImage,
			title: Rendition.Localization['RichTextEditor_Insert_Image'].Title,
			icon: '/admin/img/icons/image.png'
		}, /*
		{
			proc: function (e) {
				instance.insertGallery(e);
				return;
			},
			title: 'Insert Image Gallery',
			icon: '/admin/img/icons/images.png'
		},*/
		{
		proc: instance.insertLink,
		title: Rendition.Localization['RichTextEditor_Link'].Title,
		icon: '/admin/img/icons/link.png'
	},
		{
			proc: function (e) {
				instance.editorCmd('unlink', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Unlink'].Title,
			icon: '/admin/img/icons/link_break.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('undo', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Undo'].Title,
			icon: '/admin/img/icons/arrow_undo.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('RemoveFormat', []);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Remove_Formating'].Title,
			icon: '/admin/img/icons/html_delete.png'
		},
		{
			proc: function () {
				var val = instance.value();
				val = instance.cleanupWord(val);
				instance.value(val);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Remove_Word_Glyphs'].Title,
			icon: '/admin/img/icons/page_word.png'
		},
		{
			proc: function () {
				instance.value('');
				return;
			},
			title: Rendition.Localization['RichTextEditor_Clear'].Title,
			icon: '/admin/img/icons/page_white.png'
		},
		{
			proc: function (e) {
				instance.editorCmd('fontname', e);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Font'].Title,
			options: [
				['', ' - Font - '],
				['arial, helvetica, sans-serif', 'Arial'],
				['trebuchet ms, helvetica, sans-serif', 'Trebuchet'],
				['verdana, helvetica, sans-serif', 'Verdana'],
				['courier new, courier', 'Courier'],
				['georgia', 'Georgia'],
				['impact', 'Impact'],
				['Times New Roman, Times', 'Times']
			]
		},
		{
			proc: function (e) {
				instance.editorCmd('fontSize', e);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Font_Size'].Title,
			options: [
				['', ' - Size - '],
				['1', '1'],
				['2', '2'],
				['3', '3'],
				['4', '4'],
				['5', '5'],
				['6', '6'],
				['7', '7']
			]
		},
		{
			proc: function (e) {
				instance.editorCmd('formatBlock', e);
				return;
			},
			title: Rendition.Localization['RichTextEditor_Block'].Title,
			options: [
				['', ' - Block Type - '],
				['<p>', 'Paragraph'],
				['<h1>', 'Header 1'],
				['<h2>', 'Header 2'],
				['<h3>', 'Header 3'],
				['<h4>', 'Header 4'],
				['<h5>', 'Header 5'],
				['<h6>', 'Jump']
			]
		}
	]
	/**
	* List of events in this widget.
	* @name richTextEditor.events
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.Array
	* @public
	* @property
	*/
	instance.events = {
		resize: instance.addInitalEvents(args.resize)
	}
	/**
	* Executes an editor command.  See https://developer.mozilla.org/en/rich-text_editing_in_mozilla for
	* a list of command's available for Firefox.  Note that not all browsers support all commands,
	* but generally all the commands are the same, though the way the commands are implemented
	* may be different.  For instance, in IE changing font size might results in a &lt;font&gt; tag
	* where it may result in a &lt;span&gt; tag in Safari.  It usually doesn't make a difference.
	* See the execCommand documentation for your browser for more info.
	* @function
	* @name richTextEditor.editorCmd
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @param {Native.String} command Name of the command.
	* @param {Native.Array} args Array of arguments to be passed to the command.
	* @param {Native.Boolean} ui Show the default UI for the command.
	* @public
	*/
	instance.editorCmd = function (command, args, ui) {
		instance.iframe.contentWindow.focus();
		try {
			instance.doc.execCommand(command, ui || false, args);
		} catch (e) {
		}
		instance.iframe.contentWindow.focus();
	}
	/**
	* Executes event subscriptions.
	* @function
	* @name richTextEditor.executeEvents
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @private
	* @returns {Native.Boolean} false if cancel default was called.
	* @param {Native.Array} events to execute.
	* @param {Native.Object} e The DOM event object.
	* @param {Native.DHTMLElement} element the related DHTML element.
	* @param {Native.Array} arguments The arguments to add to the event signature.
	*/
	instance.executeEvents = function (events, e, element, arguments) {
		var fLength = events.length;
		if (fLength < 1) { return false; }
		if (arguments === undefined) { arguments = []; }
		instance.cancelDefault = false;
		arguments.unshift(e, instance, element);
		for (var x = 0; fLength > x; x++) {
			if (events[x] !== undefined) {
				events[x].apply(this, arguments);
			}
		}
		return instance.cancelDefault;
	}
	/**
	* Used interally to fire an event procedure.
	* @function
	* @name richTextEditor.resize
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @param {Native.Object} e The browser event object.
	* @public
	*/
	instance.resize = function (e) {
		var tH = instance.toolbar.offsetHeight;
		instance.height = instance.parentNode.offsetHeight;
		instance.width = instance.parentNode.offsetWidth;
		instance.iframe.height = (instance.height - 10 - tH) + 'px';
		instance.iframe.width = (instance.width - 10) + 'px';
		instance.iframe.style.height = (instance.height - 10 - tH) + 'px';
		instance.iframe.style.width = (instance.width - 10) + 'px';
		instance.textarea.style.height = (instance.height - 10 - tH) + 'px';
		instance.textarea.style.width = (instance.width - 10) + 'px';
		instance.toolbar.style.width = (instance.width - 10) + 'px';
		if (instance.executeEvents(instance.events.resize, e, instance.content)) { return false }
		if (instance.codearea_editor) {
			instance.codearea_editor.resize();
		}
	}
	instance.style = args.style !== undefined ? args.style : Rendition.UI.defaultRichTextEditorStyle;
	if (args.parentNode === undefined) {
		instance.dialog = Rendition.UI.dialogWindow({
			rect: { x: 15, y: 15, h: document.documentElement.clientHeight - 100, w: 900 },
			title: Rendition.Localization['RichTextEditor_Rich_Text_Editor'].Title,
			id: 'rteAllByItself',
			rememberPosition: true
		});
		instance.parentNode = instance.dialog;
	} else {
		instance.parentNode = args.parentNode;
	}
	/**
	* Sets the value of the design mode textarea.  Should only be used internally.
	* @function
	* @name richTextEditor.setDesignValue
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @param {Native.String} value The value to set.
	* @private
	*/
	instance.setDesignValue = function (value) {
		instance.doc.body.innerHTML = value;
	}
	/**
	* Starts the <link xlink:href="Rendition.UI.RichTextEditor"/>.
	* @function
	* @name richTextEditor.init
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @public
	*/
	instance.init = function () {
	    instance.applyCSS();
		instance.content = '';
		instance.mode = 'design';
		instance.iframe = document.createElement('iframe');
		instance.iframe.style.position = 'absolute';
		instance.textarea = document.createElement('pre');
		instance.textarea.style.position = 'absolute';
		instance.toolbar = document.createElement('div');
		instance.height = 100;
		instance.width = 100;
		instance.toolbar.style.borderTop = instance.style.toolBarBorder;
		instance.toolbar.style.borderLeft = instance.style.toolBarBorder;
		instance.toolbar.style.borderRight = instance.style.toolBarBorder;
		instance.toolbar.style.background = instance.style.toolBarBackground;
		instance.content = instance.iframe;
		instance.iframe.frameBorder = 0;
		instance.iframe.frameMargin = 0;
		instance.iframe.framePadding = 0;
		instance.iframe.src = "javascript:void(0);";
		instance.iframe.height = instance.height;
		instance.iframe.width = instance.width;
		instance.iframe.style.backgroundColor = instance.style.pageBackground;
		instance.iframe.style.border = instance.style.pageBorder;
		instance.textarea.style.border = instance.style.pageBorder;
		/* add tool buttons from parameters */
		if (args.toolBarButtons !== undefined) {
			for (var x = 0; args.toolBarButtons.length > x; x++) {
				instance.tools.push(args.toolBarButtons[x]);
			}
		}
		for (var x = 0; instance.tools.length > x; x++) {
			if (instance.tools[x].icon !== undefined) {
				var button = document.createElement('button');
				button.onclick = instance.tools[x].proc;
				button.title = instance.tools[x].title;
				button.style.padding = '2px 0 0 0'
				var img = new Image();
				img.src = instance.tools[x].icon;
				button.appendChild(img);
				instance.toolbar.appendChild(button);
				button.style.border = 'none';
			} else if (instance.tools[x].options !== undefined) {
				var select = document.createElement('select');
				select.proc = instance.tools[x].proc;
				select.onchange = function () {
					this.proc.apply(this, [[this.value]]);
				}
				Rendition.UI.fillSelect(select, instance.tools[x].options, 0, 1);
				instance.toolbar.appendChild(select);
			}
		}
		setTimeout(instance.getAttached, 0);
	}
	/**
	* Switches to design (Rich Text Editor) mode.
	* @function
	* @name richTextEditor.designMode
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @public
	*/
	instance.designMode = function (firstTime) {
		instance.textarea.style.marginTop = '-10000px';
		instance.textarea.style.marginLeft = '-10000px';
		instance.iframe.style.marginTop = '0';
		instance.iframe.style.marginLeft = '0';
		if (!firstTime) {
			instance.setDesignValue(instance.codearea_editor.getSession().getValue());
			instance.codearea_editor.resize();
		}
	}
	/**
	* Switches to HTML editor (textarea) mode.
	* @function
	* @name richTextEditor.htmlMode
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @public
	*/
	instance.htmlMode = function () {
		instance.iframe.style.marginTop = '-10000px';
		instance.iframe.style.marginLeft = '-10000px';
		instance.textarea.style.marginTop = '0';
		instance.textarea.id = instance.id;
		instance.textarea.style.marginLeft = '0';
		var theme = instance.theme || Rendition.codeareaTheme || 'vibrant_ink';
		var language = instance.language || 'html';
		var a = ace.edit(instance.textarea.id);
		a.setTheme("ace/theme/" + theme);
		var mode = require("ace/mode/" + language).Mode;
		a.getSession().setMode(new mode());
		a.getSession().setValue(instance.doc.body.innerHTML);
		instance.codearea_editor = a;
		a.resize();
	}
	/**
	* Sets the value of the <link xlink:href="Rendition.UI.RichTextEditor"/>.
	* This is the only valid way to set the value of the <link xlink:href="Rendition.UI.RichTextEditor"/>.
	* @function
	* @name richTextEditor.value
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @public
	*/
	instance.value = function (value) {
		if (value !== undefined) {
			if (instance.mode === 'design') {
				instance.setDesignValue(value);
			} else {
				instance.codearea_editor.getSession().setValue(value);
			}
		} else {
			/* if the RTE never connected to the body element the RTE was never seen
			let alone used so return the value initally given to the RTE 
			rather than the impossible iframe value 
			This element is tricky becuase we're attaching to it as the page loads.
			We want to allow the user to leave the RTE before it finishes loading
			but we always need the RTE to return a value (for close callback procedures)
			So we need to check and check and check at each node, it's this or
			put a loop here which would force the user to wait for the iframe to load
			before they could close the RTE which sucks.
			*/
			if (instance.iframe.contentWindow) {
				if (instance.iframe.contentWindow.document) {
					if (instance.iframe.contentWindow.document.body) {
						if (instance.mode === 'design') {
							return instance.iframe.contentWindow.document.body.innerHTML;
						} else {
							return instance.codearea_editor.getSession().getValue();
						}
					}
				}
			}
			return args.content || '';
		}
		return value;
	}
	/**
	* Used internally to attach to the parent DHTML element, waiting until the parent element
	* is attached before initialing the widget.
	* @function
	* @name richTextEditor.getAttached
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @private
	*/
	instance.getAttached = function () {
		if (Rendition.UI.isInBody(instance.parentNode)) {
			instance.parentNode.appendChild(instance.toolbar);
			instance.parentNode.appendChild(instance.textarea);
			instance.parentNode.appendChild(instance.iframe); /* this must come after doc.close() */
			instance.designMode(true);
			instance.doc = instance.iframe.contentWindow.document;
			if (args.content === undefined) {
				args.content = '';
			}
			instance.setDesignValue(args.content);
			setTimeout(instance.resize, 0);
			if (typeof instance.doc.designMode === 'function') {
				instance.doc.designMode();
			} else {
				instance.doc.designMode = 'on';
			}
			try {
				instance.doc.execCommand('styleWithCSS', true, true);
			} catch (ex) {
				/* try and force making markup using CSS */
			}
			/* this should work better, but it does not, so it gets an extra resize command a full second later */
			setTimeout(instance.resize, 1000);
		} else {
			setTimeout(instance.getAttached, instance.pauseForDocumentWireup);
		}
	}
	/**
	* Gets the selected object or text in the <link xlink:href="Rendition.UI.RichTextEditor"/>.
	* @function
	* @name richTextEditor.getSelectedElement
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @returns {Native.Object} Selected object.
	* @public
	*/
	instance.getSelectedElement = function () {
		var node, selection, range;
		var iframe_win = instance.iframe.contentWindow;
		if (iframe_win.getSelection) {
			try {
				selection = iframe_win.getSelection();
				range = selection.getRangeAt(0);
				node = range.commonAncestorContainer;
			} catch (e) {
				return false;
			}
		} else {
			try {
				selection = iframe_win.document.selection;
				range = selection.createRange();
				node = range.parentElement();
			} catch (e) {
				return false;
			}
		}
		return node;
	}
	/**
	* Gets the selected range of characters currently selected in
	* the <link xlink:href="Rendition.UI.RichTextEditor"/>.
	* @function
	* @name richTextEditor.getSelectionRange
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @returns {Native.Object} Selected object.
	* @public
	*/
	instance.getSelectionRange = function () {
		var rng = null;
		var iframe_window = instance.iframe.contentWindow;
		this.iframe.focus();

		if (iframe_window.getSelection) {
			rng = iframe_window.getSelection().getRangeAt(0);
			if ($.browser.opera) {
				var s = rng.startContainer;
				if (s.nodeType === Node.TEXT_NODE)
					rng.setStartBefore(s.parentNode);
			}
		} else {
			this.range.select();
			rng = this.iframe_doc.selection.createRange();
		}

		return rng;
	}
	/**
	* Replaces the selected characters with the HTML in the parameter.
	* @function
	* @name richTextEditor.selectionReplaceWith
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @returns {Native.Object} Selected object.
	* @param {Native.Object} html The value to replace the selection with.
	* @public
	*/
	instance.selectionReplaceWith = function (html) {
		var rng = instance.getSelectionRange();
		var iframe_window = instance.iframe.contentWindow;

		if (!rng)
			return;

		instance.editorCmd('removeFormat');

		if (iframe_window.getSelection) {
			rng.deleteContents();
			rng.insertNode(rng.createContextualFragment(html));
			instance.editorCmd('delete');
		} else {
			instance.editorCmd('delete');
			rng.pasteHTML(html);
		}
	}
	/**
	* Gets the text currently selected in the <link xlink:href="Rendition.UI.RichTextEditor"/>.
	* @function
	* @name richTextEditor.getSelectedText
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @returns {Native.String} Selected text.
	* @public
	*/
	instance.getSelectedText = function () {
		var iframe_win = this.iframe.contentWindow;

		if (iframe_win.getSelection)
			return iframe_win.getSelection().toString();

		this.range.select();
		return iframe_win.document.selection.createRange().text;
	}
	/**
	* Gets the HTML string currently selected in the <link xlink:href="Rendition.UI.RichTextEditor"/>.
	* @function
	* @name richTextEditor.getSelectedHtml
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @returns {Native.String} Selected HTML string.
	* @public
	*/
	instance.getSelectedHtml = function () {
		var html = null;
		var iframe_window = this.iframe.contentWindow;
		var rng = this.getSelectionRange();
		if (rng) {
			if (iframe_window.getSelection) {
				var e = document.createElement('div');
				e.appendChild(rng.cloneContents());
				html = e.innerHTML;
			} else {
				html = rng.htmlText;
			}
		}
		return html;
	}
	/**
	* Removes all of the word glyphs from a selected string.
	* Borrowed from http://code.google.com/p/lwrte/.
	* @function
	* @name richTextEditor.cleanupWord
	* @memberOf Rendition.UI.RichTextEditor.prototype
	* @type Native.undefined
	* @returns {Native.String} Selected HTML string.
	* @public
	*/
	instance.cleanupWord = function (s) {
		/* HACK: THIS FUNCTION WAS STOLEN FROM ANOTHER GNU OSS PRGM (jquery lwrte), NEEDS REPLACEMENT */
		var bIgnoreFont = false;
		var bRemoveStyles = false;
		var bCleanWordKeepsStructure = false;
		s = s.replace(/<o:p>\s*<\/o:p>/g, '');
		s = s.replace(/<o:p>[\s\S]*?<\/o:p>/g, '&nbsp;');
		// Remove mso-xxx styles.
		s = s.replace(/\s*mso-[^:]+:[^;"]+;?/gi, '');
		// Remove margin styles.
		s = s.replace(/\s*MARGIN: 0cm 0cm 0pt\s*;/gi, '');
		s = s.replace(/\s*MARGIN: 0cm 0cm 0pt\s*"/gi, "\"");
		s = s.replace(/\s*TEXT-INDENT: 0cm\s*;/gi, '');
		s = s.replace(/\s*TEXT-INDENT: 0cm\s*"/gi, "\"");
		s = s.replace(/\s*TEXT-ALIGN: [^\s;]+;?"/gi, "\"");
		s = s.replace(/\s*PAGE-BREAK-BEFORE: [^\s;]+;?"/gi, "\"");
		s = s.replace(/\s*FONT-VARIANT: [^\s;]+;?"/gi, "\"");
		s = s.replace(/\s*tab-stops:[^;"]*;?/gi, '');
		s = s.replace(/\s*tab-stops:[^"]*/gi, '');
		// Remove FONT face attributes.
		if (bIgnoreFont) {
			s = s.replace(/\s*face="[^"]*"/gi, '');
			s = s.replace(/\s*face=[^ >]*/gi, '');

			s = s.replace(/\s*FONT-FAMILY:[^;"]*;?/gi, '');
		}
		// Remove Class attributes
		s = s.replace(/<(\w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3");
		// Remove styles.
		if (bRemoveStyles)
			s = s.replace(/<(\w[^>]*) style="([^\"]*)"([^>]*)/gi, "<$1$3");
		// Remove style, meta and link tags
		s = s.replace(/<STYLE[^>]*>[\s\S]*?<\/STYLE[^>]*>/gi, '');
		s = s.replace(/<(?:META|LINK)[^>]*>\s*/gi, '');
		// Remove empty styles.
		s = s.replace(/\s*style="\s*"/gi, '');
		s = s.replace(/<SPAN\s*[^>]*>\s*&nbsp;\s*<\/SPAN>/gi, '&nbsp;');
		s = s.replace(/<SPAN\s*[^>]*><\/SPAN>/gi, '');
		// Remove Lang attributes
		s = s.replace(/<(\w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3");
		s = s.replace(/<SPAN\s*>([\s\S]*?)<\/SPAN>/gi, '$1');
		s = s.replace(/<FONT\s*>([\s\S]*?)<\/FONT>/gi, '$1');
		// Remove XML elements and declarations
		s = s.replace(/<\\?\?xml[^>]*>/gi, '');
		// Remove w: tags with contents.
		s = s.replace(/<w:[^>]*>[\s\S]*?<\/w:[^>]*>/gi, '');
		// Remove Tags with XML namespace declarations: <o:p><\/o:p>
		s = s.replace(/<\/?\w+:[^>]*>/gi, '');
		// Remove comments [SF BUG-1481861].
		s = s.replace(/<\!--[\s\S]*?-->/g, '');
		s = s.replace(/<(U|I|STRIKE)>&nbsp;<\/\1>/g, '&nbsp;');
		s = s.replace(/<H\d>\s*<\/H\d>/gi, '');
		// Remove "display:none" tags.
		s = s.replace(/<(\w+)[^>]*\sstyle="[^"]*DISPLAY\s?:\s?none[\s\S]*?<\/\1>/ig, '');
		// Remove language tags
		s = s.replace(/<(\w[^>]*) language=([^ |>]*)([^>]*)/gi, "<$1$3");
		// Remove onmouseover and onmouseout events (from MS Word comments effect)
		s = s.replace(/<(\w[^>]*) onmouseover="([^\"]*)"([^>]*)/gi, "<$1$3");
		s = s.replace(/<(\w[^>]*) onmouseout="([^\"]*)"([^>]*)/gi, "<$1$3");
		if (bCleanWordKeepsStructure) {
			// The original <Hn> tag send from Word is something like this: <Hn style="margin-top:0px;margin-bottom:0px">
			s = s.replace(/<H(\d)([^>]*)>/gi, '<h$1>');
			// Word likes to insert extra <font> tags, when using MSIE. (Wierd).
			s = s.replace(/<(H\d)><SPAN[^>]*>([\s\S]*?)<\/SPAN><\/\1>/gi, '<$1>$2<\/$1>');
			s = s.replace(/<(H\d)><EM>([\s\S]*?)<\/EM><\/\1>/gi, '<$1>$2<\/$1>');
		} else {
			s = s.replace(/<H1([^>]*)>/gi, '<div$1 style="font-size:17px;"><b>');
			s = s.replace(/<H2([^>]*)>/gi, '<div$1 style="font-size:15px;"><b>');
			s = s.replace(/<H3([^>]*)>/gi, '<div$1 style="font-size:14px;"><b>');
			s = s.replace(/<H4([^>]*)>/gi, '<div$1 style="font-size:12px;"><b>');
			s = s.replace(/<H5([^>]*)>/gi, '<div$1 style="font-size:10px;"><b>');
			s = s.replace(/<H6([^>]*)>/gi, '<div$1 style="font-size:8px;"><b>');
			s = s.replace(/<\/H\d>/gi, '<\/b><\/div>');
			// Transform <P> to <DIV>
			var re = new RegExp('(<P)([^>]*>[\\s\\S]*?)(<\/P>)', 'gi'); // Different because of a IE 5.0 error
			s = s.replace(re, '<div$2<\/div>');
			// Remove empty tags (three times, just to be sure).
			// This also removes any empty anchor
			s = s.replace(/<([^\s>]+)(\s[^>]*)?>\s*<\/\1>/g, '');
			s = s.replace(/<([^\s>]+)(\s[^>]*)?>\s*<\/\1>/g, '');
			s = s.replace(/<([^\s>]+)(\s[^>]*)?>\s*<\/\1>/g, '');
		}
		return s;
	}
	instance.init();
	return instance;
}


