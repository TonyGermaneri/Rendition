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
* Creates a DHTML based generic editor using <link xlink:href="Rendition.UI.Form"/>
* and <link xlink:href="Rendition.UI.Dialog"/>.
* @constructor
* @public
* @borrows Rendition.UI.Form as Rendition.UI.GenericEditor
* @param {Native.Object} args The parameters for this widget.
* @param {Native.Object} [args.title='Add / Create'] The parameters for this widget.
* @param {Native.Object} [args.parentNode] The parent DHTML element this form will append to. 
* If undefined a <link xlink:href="Rendition.UI.Dialog"/> will be created and the form will go into it.
* @param {Native.Integer} [commandType=0] The type of command. 0 = update, 1 = insert, 2 = delete.
* @param {Native.Function} [args.callbackProcedure] An optional procedure to execute on successful create or update. 
* @param {Native.Boolean} [args.hideUpdateButton=false] Hides the 'save' or 'update' button. 
*/
Rendition.UI.GenericEditor = function (args) {
	var instance = {}
	instance.genericEditForm = Rendition.UI.Form(args);
	var title = args.title || Rendition.Localization['GenericEditor_Add_Create'].Title;
	if (args.parentNode === undefined) {
	    instance.genericEditFormDialog = Rendition.UI.dialogWindow({
	        rect: {
	            x: 0,
	            y: 0,
	            w: 600,
	            h: 1000
	        },
	        modal: true,
	        modalCloseable: true,
	        title: title
	    });
	    args.parentNode = instance.genericEditFormDialog.content;
	}
	instance.genericEditForm.appendTo(args.parentNode);
	if (instance.genericEditFormDialog) {
	    var rect = Rendition.UI.getRect(instance.genericEditFormDialog.content.firstChild);
	    args.parentNode.style.overflow = 'hidden';
	    args.parentNode.style.overflowX = 'hidden';
	    args.parentNode.style.overflowY = 'scroll';
	    rect.h += 100;
	    rect.x = document.documentElement.clientWidth * .5 - (rect.w * .5);
	    rect.y = 15;
	    instance.genericEditFormDialog.updateRect(rect);
	    var updateCreate = document.createElement('button');
	    updateCreate.style.margin = '5px';
	    updateCreate.textContent = title;
	    updateCreate.onclick = function () {
	        instance.genericEditForm.save(false, args.commandType, function (e, jsonResponse) {
	            if (instance.genericEditFormDialog) {
	                instance.genericEditFormDialog.close();
	            }
	            if (args.callbackProcedure !== undefined) {
	                args.callbackProcedure.apply(instance, [instance, jsonResponse]);
	            }
	            return;
	        });
	        return;
	    }
	    instance.genericEditForm.submitButton = updateCreate;
	    if (args.hideUpdateButton === undefined || args.hideUpdateButton == false) {
	        args.parentNode.appendChild(updateCreate);
	    }
	    instance.genericEditForm.dialog = instance.genericEditFormDialog;
	}
	return instance.genericEditForm;
}