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
* Creates a button next to a DHTML input element that says 'Browse...'.  The button
* creates a <link xlink:href="Rendition.UI.FileManager"/> that by default allows the user 
* to select a single file and returns the result to the input.value.
* @constructor
* @name Rendition.UI.FileSelectButton
* @param {Native.DHTMLElement} args.input The DHTML input element to bind the button to.
* @param {Native.Boolean} [args.selectFile] When true, turns the file <link xlink:href="Rendition.UI.FileManager"/>
* into a 'select a file' dialog that works with the args.selectCallback parameter to return a selected file.
* @param {Native.Boolean} [args.selectFolder] When true, turns the file <link xlink:href="Rendition.UI.FileManager"/>
* into a 'select a folder' dialog that works with the args.selectCallback parameter to return a selected folder.
* @param {Native.Boolean} [args.selectFiles] When true, turns the file <link xlink:href="Rendition.UI.FileManager"/>
* into a 'select a file' dialog that works with the args.selectCallback parameter to return a selected files.
* @param {Native.Boolean} [args.selectFolders] When true, turns the file <link xlink:href="Rendition.UI.FileManager"/>
* into a 'select a folder' dialog that works with the args.selectCallback parameter to return a selected folders.
* @param {Native.Function} [args.selectCallback] A function to execute when the user comfirms their selection.
* Function signature:
* <code language="javascript">
*	function(selectedFilesOrFoldersPath, fileManager){
*		/// procedure code ///
*	}
* </code>
* @example /// Add the <link xlink:href="Rendition.UI.FileSelectButton"/> to an input. ///
* var foo = Rendition.UI.Dialog();
* var input = document.createElement('input');
* foo.content.appendChild(input);
* var bar = Rendition.UI.FileManager({
*		selectFile: true,
*		input: input
* });
*/
Rendition.UI.FileSelectButton = function (args) {
	var instance = {}
	/**
	* The type of object.  returns 'RenditionFileSelectButton'
	* @name FileSelectButton.type
	* @memberOf Rendition.UI.FileSelectButton.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionFileSelectButton';
	if (args.callbackProcedure === undefined) {
		instance.callbackProcedure = null;
	} else {
		instance.callbackProcedure = args.callbackProcedure;
	}
	if (args.input === undefined) {
		alert('no input bound to fileSelectButton function');
	}
	/**
	* The DHTML input element.
	* @name FileSelectButton.button
	* @memberOf Rendition.UI.FileSelectButton.prototype
	* @type Native.DHTMLElement
	* @public
	* @property
	*/
	instance.button = document.createElement('button');
	instance.button.innerHTML = Rendition.Localization['FileManager_Browse'].Title;
	instance.input = args.input;
	Rendition.UI.appendEvent('click', instance.button, function (e) {
		instance.fileManager = Rendition.UI.FileManager(args);
		instance.fileManager.fileSelectButton = instance;
	}, false);
	/**
	* Appends to the DHTML parent node.  Waits until the input has been appended to its parent node..
	* @name FileSelectButton.getConnected
	* @memberOf Rendition.UI.FileSelectButton.prototype
	* @type Native.DHTMLElement
	* @private
	* @property
	*/
	instance.getConnected = function () {
		if (instance.input.parentNode) {
			instance.input.parentNode.appendChild(instance.button);
		} else {
			setTimeout(instance.getConnected, Rendition.UI.waitToAttachTimeout);
		}
	}
	/**
	* Starts the widget.
	* @name FileSelectButton.init
	* @memberOf Rendition.UI.FileSelectButton.prototype
	* @type Native.DHTMLElement
	* @private
	* @property
	*/
	instance.init = function () {
		instance.getConnected();
	}
	instance.init();
	return instance;
}

/**
* Creates a dialog that allows you to upload one or more files to the server.  Provides a
* status bar during upload and allows the user to cancel out of the upload.
* @constructor
* @name Rendition.UI.UploadDialog
* @param {Native.Object} args Parameters for the widget.
* @param {Native.String} [args.target=User's Directory] The directory to upload to.  By default the current user's directory is used.
* The path can be a local path (on the server) e.g.: c:\\inetpub\\www.mysite.com\\myDirectory\\mySubDirectory,
* a relitive (to this site) path e.g.: /myDirectory/mySubDirectory, 
* a UNC path e.g.: \\\\192.168.0.1\\inetpub\\www.mysite.com\\myDirectory\\mySubDirectory or
* an FTP path e.g.: ftp://192.168.0.1/myDirectory/mySubDirectory 
* @param {Native.DHTMLElement} [args.parentNode] The DHTML Element to append to. 
* If left undefined a dialog will be created to hold the upload widget.
* @param {Native.String} [args.title='Upload File'] The title of the upload dialog.
* @param {Native.Boolean} [args.modal=true] When true the upload dialog is modal.
* @param {Native.Boolean} [args.alwaysOnTop=true] When true the upload dialog is always on top.
* @param {Native.Boolean} [args.modalCloseable=true] When true the upload dialog can be closed when it is in modal mode.
* @param {Native.Boolean} [args.singleFile=false] When true only one file can be uploaded.
* @param {Native.Object} [args.fileManager] The <link xlink:href="Rendition.UI.FileManager"/> to use, if any.
* <code language="JavaScript">
*	function(uploadDialog, fileUploadResponse){
*		/// Event procedure ///
*	}
* </code>
* @param {Native.Function} [args.callbackProcedure] A function to execute after the file or files are finished uploading.
*/
Rendition.UI.UploadDialog = function(args){
	var instance = {}
	if (args === undefined) {
		args = {}
	}
	if (args.target !== undefined){
		instance.target = args.target;
	}else{
		instance.target = '';
	}
	if(Rendition.UI.safari===true){
		instance.THeight = 205;
	}else{
		instance.THeight = 145;
	}
	instance.dialogHeight = instance.THeight;
	var mult = { p: .20, d: .50 }
	instance.dialogRect = {
		x: (document.documentElement.clientWidth/2)-(475/2),
		y: document.documentElement.clientHeight * mult.p,
		w: 475,
		h: instance.dialogHeight
	}
	/**
	* The type of object.  returns 'renditonUploadDialog'
	* @name UploadDialog.type
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'renditonUploadDialog';
	/**
	* When set true during the upload loop the upload will be aborted.
	* @name UploadDialog.abort
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @type Native.Boolean
	* @public
	* @property
	*/
	instance.abort = false;
	if (args.parentNode !== undefined) {
		instance.parentNode = args.parentNode;
	} else {
		var modal = false;
		/**
		* The <link xlink:href="Rendition.UI.Dialog"/>.
		* @name UploadDialog.dialog
		* @memberOf Rendition.UI.UploadDialog.prototype
		* @type Native.Object
		* @public
		* @property
		*/
		instance.dialog = Rendition.UI.dialogWindow({
			rect: instance.dialogRect,
			title: args.title || Rendition.Localization['FileManager_upload_Upload_File_Title'].Title,
			modal: args.modal||true,
			alwaysOnTop: args.alwaysOnTop||false,
			modalCloseable: args.modalCloseable||true
		});
		Rendition.UI.appendEvent('close', instance.dialog, function() {

		}, false);
		Rendition.UI.appendEvent('resize', instance.dialog, function() {
			instance.iframe.height = instance.parentNode.offsetHeight;
			instance.iframe.width = instance.parentNode.offsetWidth;
			instance.dialogRect = instance.dialog.rect;
		}, false);
		instance.parentNode = instance.dialog.content;
	}
	/**
	* The UUID of this upload.
	* @name UploadDialog.uploadId
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.uploadId = Rendition.UI.createUUID();
	/**
	* The target iframe the file will be posted to.
	* @name UploadDialog.iframe
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.iframe = document.createElement('iframe');
	instance.iframe.src = 'js/blank.html';
	instance.iframe.border = 'none';
	instance.iframe.style.border = 'none';
	instance.iframe.height = instance.parentNode.offsetHeight;
	instance.iframe.width = instance.parentNode.offsetWidth;
	/**
	* List of files in the file inputs.
	* @name UploadDialog.files
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @type Native.Array
	* @public
	* @property
	*/
	instance.files = [];
	/**
	* Removes all the empty file input fields and adds an empty one.
	* @function
	* @name UploadDialog.removeEmptyFieldsAndAddOneExtraOne
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @private
	*/
	instance.removeEmptyFieldsAndAddOneExtraOne = function(){
		var index = 0;
		var i = instance.files[index];
		while(i){
			if(i.value.length===0){
				var l = instance.files.length;
				for(var x=0;l>x;x++){
					if(i===instance.files[x]){
						instance.files.splice(x,1);
						break;
					}
				}
			}
			index++;
			i = instance.files[index];
		}
		instance.dialogHeight=(instance.THeight+((instance.files.length)*30));
		if(instance.dialogRect.h<instance.dialogHeight){
			instance.dialogRect.h=instance.dialogHeight;
			instance.dialog.updateRect(instance.dialogRect);
		}
		instance.addFileInput();
		return;
	}
	/**
	* Adds a new empty file input to the list of file inputs
	* @function
	* @name UploadDialog.addFileInput
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @returns {Native.Object} undefined
	* @private
	*/
	instance.addFileInput = function(){
		var i = document.createElement('input');
		var d = document.createElement('button');
		d.type = 'button';
		d.innerHTML = Rendition.Localization['FileManager_uploadInput_Remove'].Title;
		d.onclick = function(e){
			if(instance.files.length>1){
				if(i.value.length===0){return}
				var l = instance.files.length;
				for(var x=0;l>x;x++){
					if(i===instance.files[x]){
						instance.files.splice(x,1);
						break;
					}
				}
				d.parentNode.removeChild(d);
				i.parentNode.removeChild(i);
			}else{
				alert(Rendition.Localization['FileManager_uploadInput_You_cant_remove_the_last_file'].Title);
			}
			e.preventDefault();
			return false;
		}
		i.type = 'file';
		i.name = 'uid_'+Rendition.UI.createId();
		i.onchange = function(){
			if(args.singleFile===undefined||args.singleFile===false){
				instance.removeEmptyFieldsAndAddOneExtraOne();
			}
			return;
		}
		instance.files.push(i);
		instance.pt.table.rows[0].cells[0].appendChild(d);
		instance.pt.table.rows[0].cells[1].appendChild(i);
		return;
	}
	var rows = [[Rendition.UI.txt(''),Rendition.UI.txt('')]];
	instance.pt = Rendition.UI.pairtable({
		rows: rows
	});
	instance.addFileInput();
	/**
	* Whent the form is submitted at the same time this method is called and
	* creates a loop until the upload is complete.  This loop updates the
	* status of the upload.
	* @name UploadDialog.startProgressTimer
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @private
	* @function
	* @returns {Native.Object} <link xlink:href="Rendition.UI.UploadDialog"/>.
	*/
	instance.startProgressTimer = function(){
		instance.dialog.hide();
		instance.progressDialog = Rendition.UI.dialogWindow({
			rect: {
				x: document.documentElement.clientWidth * .5 - (420*.5),
				y: document.documentElement.clientHeight * .2,
				w: 420,
				h: 245
			},
			title: Rendition.Localization['FileManager_uploadInput_Uploading'].Title,
			modal: true
		});
		instance.details = document.createElement('div');
		instance.details.innerHTML = Rendition.Localization['FileManager_uploadInput_Updating_data'].Title;
		var rows = [[instance.details]];
		instance.dt = Rendition.UI.pairtable({
			rows: rows
		});
		instance.cancelUploadButton = document.createElement('button');
		instance.cancelUploadButton.style.margin = '4px 7px 4px auto';
		instance.cancelUploadButton.style.display = 'block';
		instance.cancelUploadButton.innerHTML = 'Cancel';
		instance.cancelUploadButton.onclick = function(){
			instance.abort = true;
			instance.progressDialog.close();
			instance.dialog.close();
			return;
		}
		instance.progressGraphic = document.createElement('img');
		instance.progressGraphic.style.display = 'block';
		instance.progressGraphic.style.margin = 'auto';
		instance.progressGraphic.src = '/admin/img/UPload_00.gif';
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
			title: Rendition.Localization['FileManager_uploadInput_Details'].Title,
			childNodes: [instance.dt.table]
		});
		instance.progressbox.appendTo(instance.progressDialog.content);
		instance.lastTime = null;
		instance.lastComplete = 0;
		instance.progressTimer();
		return instance;
	}
	/**
	* Used internally to request upload data from the server.  
	* Part of <link xlink:href="Rendition.UI.UploadDialog#startProgressTimer"/>
	* @name UploadDialog.progressTimer
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @private
	* @function
	* @returns {Native.Object} <link xlink:href="Rendition.UI.UploadDialog"/>.
	*/
	instance.progressTimer = function(){
		var timerInterval = 500;
		if(instance.abort){return;}
		var req = [
			'ProgressInfo',
			[
				instance.uploadId
			]
		]
		var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI+Rendition.UI.responderKeyName + '1=' + JSON.stringify(req), function(e) {
			var f = JSON.parse(e.responseText);
			if (f.method1.error!=undefined) {
				alert('Error: '+f.method1.error + '\nDescription: ' + f.method1.description);
				instance.progressDialog.close();
				instance.dialog.close();
				return;
			}
			a = f.method1.ProgressInfo;
			if (a.error === 0) {
				if (!a.complete) {
					setTimeout(instance.progressTimer, timerInterval);
				}else{
					if(args.fileManager){
						args.fileManager.ls(instance.target, null, args.fileManager.pane[1]);
					}
					if(args.callbackProcedure){
						args.callbackProcedure.apply(instance,[instance,a]);
					}
					instance.progressDialog.close();
					instance.dialog.close();
				}
			} else if (a.error === -1) {
				setTimeout(instance.progressTimer, timerInterval);
			}
			if (a.error === 0) {
				var pct = (a.currentSizeComplete/a.totalItemSize)*100;
                var comp = Rendition.Localization['FileManager_x_pct_Complete_xMB_of_xMB'].Title
                .replace('{0}',pct.toFixed(2))
                .replace('{1}',Rendition.UI.addCommas((a.currentSizeComplete/1000000).toFixed(2)))
                .replace('{2}',Rendition.UI.addCommas((a.totalItemSize/1000000).toFixed(2)));
				if(a.currentItemName==='multipart/form-data stream'){
					instance.progressMeterFill.style.width = Math.floor(pct)+'%';
					if(instance.lastTime!=null){
						var kbps = ((a.currentSizeComplete-instance.lastComplete)/1000)/(a.updated-instance.lastTime);
						if(!isNaN(kbps)&&isFinite(kbps)&&kbps>0){
							instance.details.innerHTML = comp + '<br>' 
                            +  Rendition.Localization['FileManager_Speed_xKBsecond'].Title.replace('{0}',Rendition.UI.addCommas(kbps.toFixed(2)));
						}
					}else{
						instance.details.innerHTML = comp + '<br>' + Rendition.Localization['FileManager_uploadInput_Calculating'].Title;
					}
				}else{
					if(pct<100){
						instance.progressMeterFill.style.width = Math.floor(pct)+'%';
						var p = Rendition.Localization['FileManager_uploadInput_pct_Complete'].Title.replace('{0}',pct.toFixed(2));
					}else{
						instance.progressMeterFill.style.width = '0%';
						var p = Rendition.Localization['FileManager_uploadInput_pct_Complete'].Title.replace('{0}',0);
					}
					instance.details.innerHTML = p + Rendition.Localization['FileManager__parsing_file_data'].Title + '<br>' +
					Rendition.Localization['FileManager_uploadInput_Current_file_x'].Title.replace('{0}',Rendition.UI.truncateText(a.currentItemName,200));
				}
				instance.lastTime = a.updated;
				instance.lastComplete = a.currentSizeComplete;
			}
		},instance);
	}
	instance.submitButton = document.createElement('button');
	instance.submitButton.innerHTML = Rendition.Localization['FileManager_uploadInput_submit_Upload'].Title;
	instance.submitButton.style.margin = '4px';
	/**
	* Starts the upload.  Same as clicking on the submit button.
	* @name UploadDialog.startUpload
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @private
	* @function
	* @returns {Native.Object} undefined.
	*/
	instance.startUpload = function(e){
		instance.timeToSubmit = true;
		instance.form.submit();
		instance.startProgressTimer();
	}
	instance.submitButton.onclick = instance.startUpload;
	instance.groupbox = Rendition.UI.GroupBox({
		title: Rendition.Localization['FileManager_uploadInput_Select_one_or_more_files_to_upload'].Title,
		childNodes: [instance.pt.table],
		alwaysExpaned: true
	});
	instance.parentNode.appendChild(instance.iframe);
	instance.iframeDoc = instance.iframe.contentWindow.document;
	instance.iframeDoc.open();
	instance.iframeDoc.write('<html><head></head><body style="overflow:hidden;margin:0;padding:10px;font-family:Trebuchet MS, Arial, Helvetica, Sans-serif;">'+
	'<form style="width:100%;overflow:hidden;margin:0;padding:0;" method="post" action="'+Rendition.UI.clientServerSyncURI+'uploadId='+instance.uploadId+'&target='+instance.target+'" enctype="multipart/form-data"></form></body></html>');
	instance.iframeDoc.close();
	instance.form = instance.iframeDoc.body.firstChild;
	instance.form.onsubmit = function(){
		if(instance.timeToSubmit===true){
			return true;
		}
		return false;
	}
	instance.groupbox.appendTo(instance.form);
	instance.form.appendChild(instance.submitButton);
}
/**
* Creates a DHTML based file manager that allows you to upload/download/copy etc. 
* with the server and remote FTP or UNC paths.  Can also function as a 'select a file(s)' or 'select a folder(s)' dialog.
* @constructor
* @name Rendition.UI.FileManager
* @param {Native.DHTMLElement} [args.parentNode] DHTML element to append to.  If left undefined a dialog will be created.
* @param {Native.Boolean} [args.selectFile] When true, turns the file <link xlink:href="Rendition.UI.FileManager"/>
* into a 'select a file' dialog that works with the args.selectCallback parameter to return a selected file.
* @param {Native.Boolean} [args.selectFolder] When true, turns the file <link xlink:href="Rendition.UI.FileManager"/>
* into a 'select a folder' dialog that works with the args.selectCallback parameter to return a selected folder.
* @param {Native.Boolean} [args.selectFiles] When true, turns the file <link xlink:href="Rendition.UI.FileManager"/>
* into a 'select a file' dialog that works with the args.selectCallback parameter to return a selected files.
* @param {Native.Boolean} [args.selectFolders] When true, turns the file <link xlink:href="Rendition.UI.FileManager"/>
* into a 'select a folder' dialog that works with the args.selectCallback parameter to return a selected folders.
* @param {Native.Function} [args.selectCallback] A function to execute when the user comfirms their selection.
* Function signature:
* <code language="javascript">
*	function(selectedFilesOrFoldersPath, fileManager){
*		/// procedure code ///
*	}
* </code>
* @example /// Create a file manager ///
* Rendition.UI.FileManager();
* @example /// Create a file manager that asks the user to select a file, then displays the selection in an alert ///
* var foo = Rendition.UI.FileManager({
*		selectFile: true,
*		selectCallback: function (selectedFilePath, fileMan) {
*			alert(selectedFilePath);
*			return;
*		}
* });
*/
Rendition.UI.FileManager = function(args) {
	var instance = {}
	if (args === undefined) {
		args = {}
	}
	/**
	* The type of object. returns 'renditonfileManager'
	* @name FileManager.type
	* @memberOf Rendition.UI.FileManager.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditonFileManager';
	if (args.parentNode !== undefined) {
		instance.parentNode = args.parentNode;
	} else {
		var mult = { p: .10, d: .80 }
		var modal = false;
		if (args.selectFile || args.selectFolder) {
			var modal = true;
			mult = { p: .05, d: .90 }
		}
		/**
		* The <link xlink:href="Rendition.UI.Dialog"/> of this file manager.
		* @name FileManager.dialog
		* @memberOf Rendition.UI.FileManager.prototype
		* @type Native.Object
		* @public
		* @property
		*/
		instance.dialog = Rendition.UI.dialogWindow({
			rect: {
                x: Rendition.UI.dialogPosition.x,
		        y: Rendition.UI.dialogPosition.y,
				w: 770,
				h: document.documentElement.clientHeight * mult.d
			},
			title: args.title || Rendition.Localization['FileManager_File_Manager_Title'].Title,
			modal: modal,
			modalCloseable: true
		});
		Rendition.UI.appendEvent('close', instance.dialog, function() {
			if (instance.listReq !== undefined) {
				instance.listReq.abort();
			}
		}, false);
		/**
		* The parent DHTML element.
		* @name FileManager.parentNode
		* @memberOf Rendition.UI.FileManager.prototype
		* @type Native.Object
		* @public
		* @property
		*/
		instance.parentNode = instance.dialog.content;
	}
	/**
	* Appends the grid to a DHTML object.  This is used to append the grid after initilization or move the grid from one element to another.
	* @function
	* @name FileManager.getTypeIcon
	* @memberOf Rendition.UI.FileManager.prototype
	* @private
	* @returns {Native.String} file name of the icon that matches the extention.
	* @param {Native.String} [objType='file'] is this a 'file' or a 'directory'.
	* @param {Native.String} path Full path to the file.
	*/
	instance.getTypeIcon = function(objType,path){
		var ext = path.substring(path.length-3).toLowerCase();
		var super_big_ext = path.substring(path.length-6).toLowerCase();
        var big_ext = path.substring(path.length-4).toLowerCase();
		var small_ext = path.substring(path.length-2).toLowerCase();
		var img = 'page_white.png';
		if(objType==="directory"){
			img = 'folder.png';
		}else if(ext==='png'||ext==='gif'||ext==='jpg'){
			img = 'image.png';
		}else if(ext==='com'||ext==='exe'||ext==='bat'||ext==='cmd'){
			img = 'application.png';
		}else if(ext==='xls'||ext==='csv'||ext==='iif'){
			img = 'page_white_excel.png';
		}else if(ext==='pdf'){
			img = 'page_white_acrobat.png';
		}else if(ext==='doc'){
			img = 'page_white_word.png';
		}else if(small_ext==='js'){
			img = 'script.png';
		}else if(ext==='txt'){
			img = 'page_white_text.png';
		}else if(ext==='htm'||big_ext==='html'){
			img = 'page_white_world.png';
		}else if(small_ext==='cs'||big_ext==='aspx'||super_big_ext==='master'){
			img = 'page_white_csharp.png';
		}else if(ext==='zip'||ext==='arj'||ext==='ace'||ext==='cab'){
			img = 'page_white_compressed.png';
		}else if(ext==='ini'||ext==='cfg'||super_big_ext==='config'||super_big_ext==='csproj'){
			img = 'page_white_gear.png';
		}else if(ext==='lnk'){
			img = 'page_white_link.png';
		}else if(ext==='bmp'||ext==='psd'||ext==='tif'||big_ext==='tiff'||ext==='ico'){
			img = 'page_white_paintbrush.png';
		}else if(ext==='dll'||ext==='ocx'||ext==='suo'||ext==='sln'){
			img = 'page_white_gear.png';
		}else if(path.length<4){
			img = 'drive.png';
		}
		return img;
	}
	/**
	* Used internally to create the directory tree.
	* @function
	* @name FileManager.treeObject
	* @memberOf Rendition.UI.FileManager.prototype
	* @private
	* @returns {Native.Array} Array of <link xlink:href="Rendition.UI.TreeNode"/> elements.
	* @param {Native.String} [objType='file'] is this a 'file' or a 'directory'.
	* @param {Native.String} path Full path to the file.
	*/
	instance.treeObject = function(data, path) {
		var childNodes = [];
		var l = data.length;
		if(l===1){
			childNodes.push({
					text: '<i> - empty - </i>',
					value: 'empty',
					childNodes: {}
				});
		}else{
			for (var x = 0; l > x; x++) {
				if(data[x].objectType==='directory'){
					var req = [
						'Ls',
						[
							String(data[x].name)
						]
					]
					var c = {
						url: Rendition.UI.clientServerSyncURI+Rendition.UI.responderKeyName + '1=' + JSON.stringify(req),
						callbackProcedure: function(json, tree, node) {
							var a = json.method1.Ls;
							if (a.error === 0) {
								var treeObj = instance.treeObject(a.files, node.getAttribute('name'));
								var l = treeObj.length;
								while (node.firstChild) { node.removeChild(node.firstChild) }
								for (var x = 0; l > x; x++) {
									tree.add(treeObj[x], node);
								}
							} else {
								instance.errorMessage(a);
								tree.preventDefault();
							}
							return false;
						}
					}
				}else{
					var c = [];
				}
				var req = [
					'Ls',
					[
						String(data[x].name)
					]
				]
				if(data[x].name.substring(data[x].name.length-2)!='..'){
					if(data[x].objectType==='directory'){
						childNodes.push({
							text: '&nbsp;&nbsp;<img style="margin-bottom: -3px;margin-left: -13px;margin-right:2px" src="/admin/img/icons/'+
								instance.getTypeIcon(data[x].objectType,data[x].name)+'" alt="">'+
								Rendition.UI.iif(data[x].name.indexOf('//')>0,
									data[x].name.substring(data[x].name.lastIndexOf('\\') + 1, 256),
									data[x].name.substring(data[x].name.lastIndexOf('/') + 1, 256)
								),
							value: String(data[x].name),
							childNodes: c
						});
					}
				}
			}
		}
		return childNodes;
	}
	/**
	* Used internally to create datasets for the <link xlink:href="Rendition.UI.Grid"/> widget.
	* @function
	* @name FileManager.dataSet
	* @memberOf Rendition.UI.FileManager.prototype
	* @private
	* @returns {Native.Object} <link xlink:href="Rendition.UI.DataSet"/>.
	* @param {Native.String} data List of files and directories.
	* @param {Native.String} path Full path of this directory.
	*/
	instance.dataSet = function(data, path) {
        for(var x=0;data.length>x;x++){
            data[x][2] = String.prototype.JSONDateToString(data[x][2]);
            data[x][3] = String.prototype.JSONDateToString(data[x][3]);
        }
		return dataSet = {
			data: data,
			error: 0,
			description: '',
			range: {
				from: 1,
				to: data.length
			},
			schema: {
				error: 0,
				errorDesc: '',
				objectId: 0,
				columns: 5,
				records: data.length,
				orderBy: 0,
				orderByDirection: 0,
				checksum: -1,
				name: path,
				displayName: path
			},
			header: [
				{
					name: 'name',
					dataType: 'varchar',
					dataLength: 255,
					columnOrder: 0,
					columnSize: 325,
					visibility: 1,
					description: Rendition.Localization['FileManager_Schema_File_or_directory_name'].Title,
					isNullable: 0,
					primaryKey: 1,
					defaultValue: 'Untitled.txt',
					displayName: Rendition.Localization['FileManager_Schema_Name'].Title,
					hidden: 0
				},
				{
					name: 'size',
					dataType: 'bigint',
					dataLength: -1,
					columnOrder: 1,
					columnSize: 90,
					visibility: 1,
					description: Rendition.Localization['FileManager_Schema_Size_of_the_file'].Title,
					isNullable: 0,
					primaryKey: 0,
					defaultValue: '',
					displayName: Rendition.Localization['FileManager_Schema_Size'].Title,
					hidden: 0
				},
				{
					name: 'lastAccessTime',
					dataType: 'datetime',
					dataLength: -1,
					columnOrder: 2,
					columnSize: 150,
					visibility: 1,
					description: Rendition.Localization['FileManager_Schema_Last_time_this_file_was_accessed'].Title,
					isNullable: 0,
					primaryKey: 0,
					defaultValue: '',
					displayName: Rendition.Localization['FileManager_Schema_Last_Access_Time'].Title,
					hidden: 0
				},
				{
					name: 'creationTime',
					dataType: 'datetime',
					dataLength: -1,
					columnOrder: 3,
					columnSize: 150,
					visibility: 1,
					description: Rendition.Localization['FileManager_Schema_The_date_this_file_was_created'].Title,
					isNullable: 0,
					primaryKey: 0,
					defaultValue: '',
					displayName: Rendition.Localization['FileManager_Schema_Creation_Time'].Title,
					hidden: 0
				},
				{
					name: 'objectType',
					dataType: 'bit',
					dataLength: -1,
					columnOrder: 4,
					columnSize: 200,
					visibility: 0,
					description: 'directory?file',
					isNullable: 0,
					primaryKey: 0,
					defaultValue: '',
					displayName: 'objectType',
					hidden: 1
				}
			]
		}
	}
	/**
	* Creates an error message for the file manager.
	* @function
	* @name FileManager.errorMessage
	* @memberOf Rendition.UI.FileManager.prototype
	* @private
	* @returns {Native.Object} undefined.
	* @param {Native.Object} a The error object returned from the server.
	*/
	instance.errorMessage = function(a) {
		var no = Rendition.UI.button({ innerHTML: 'Ok', onclick: function(e, confirm) {
			instance.errorDialog.close();
			return;
		}
		});
		instance.errorDialog = Rendition.UI.ConfirmDialog({
			message: a.error + ' ' + a.description,
			subTitle: Rendition.Localization['FileManager_Server_error'].Title,
			title: Rendition.Localization['FileManager_Server_error'].Title,
			buttons: [no],
			autosize: true
		});
	}
	/**
	* Creates an upload dialog.
	* @function
	* @name FileManager.upload
	* @memberOf Rendition.UI.FileManager.prototype
	* @private
	* @returns {Native.Object} undefined.
	* @param {Native.String} path The path to upload to.
	* @param {Native.Function} callbackProcedure The procedure to run when the upload is complete.
	* @param {Native.Object} pane This does nothing.
	*/
	instance.upload = function(path, callbackProcedure, pane) {
		instance.uploadDialog = Rendition.UI.UploadDialog({fileManager:instance,target:path});
	}
	/**
	* Creates a directory.
	* @function
	* @name FileManager.mkdir
	* @memberOf Rendition.UI.FileManager.prototype
	* @public
	* @returns {Native.Object} undefined.
	* @param {Native.String} Path to create.
	* @param {Native.Function} callbackProcedure The procedure to run when the remote procedure call is complete.
	* @param {Native.Object} pane This does nothing.
	*/
	instance.mkdir = function(path, callbackProcedure, pane) {
		var req = [
			'MkDir',
			[
				path
			]
		]
		var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI+Rendition.UI.responderKeyName + '1=' + JSON.stringify(req), function(e) {
			var a = JSON.parse(e.responseText);
			a = a.method1.MkDir;
			if (a.error === 0) {
				if (pane) {
					var fparse = instance.parseFileData(a);
					pane.dataSet = instance.dataSet(fparse.data, fparse.path);
					pane.grid.loadData(pane.dataSet).clickRow(1);
				}
			} else {
				instance.errorMessage(a);
			}
			if (callbackProcedure) { callbackProcedure.apply(this, [instance, a]) }
		}, instance);
	}
	/**
	* Renames a directory or file.  Same as UNIX "mv" or windows "rename".
	* @function
	* @name FileManager.rn
	* @memberOf Rendition.UI.FileManager.prototype
	* @public
	* @returns {Native.Object} undefined.
	* @param {Native.String} sourcePath Source name.
	* @param {Native.String} targetPath Target name.
	* @param {Native.Function} callbackProcedure The procedure to run when the remote procedure call is complete.
	* @param {Native.Object} pane Used internally to update the <link xlink:href="Rendition.UI.Grid"/>'s status pane.
	* This can be left undefined.
	*/
	instance.rn = function(sourcePath, targetPath, callbackProcedure, pane) {
		var req = [
			'Rn',
			[
				sourcePath,
				targetPath
			]
		]
		var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI+Rendition.UI.responderKeyName + '1=' + JSON.stringify(req), function(e) {
			var a = JSON.parse(e.responseText);
			a = a.method1.Rn;
			if (a.error === 0) {
				if (pane) {
					var fparse = instance.parseFileData(a);
					pane.dataSet = instance.dataSet(fparse.data, fparse.path);
					pane.grid.loadData(pane.dataSet).clickRow(1);
				}
			} else {
				instance.errorMessage(a);
			}
			if (callbackProcedure) { callbackProcedure.apply(this, [instance, a]) }
		}, instance);
	}
	/**
	* Moves one or more file to another directory.  "mv" or windows "move /y".
	* @function
	* @name FileManager.mv
	* @memberOf Rendition.UI.FileManager.prototype
	* @public
	* @returns {Native.Object} undefined.
	* @param {Native.Array} sourcePaths Array of source paths.
	* @param {Native.Array} targetPath Target path.
	* @param {Native.Function} callbackProcedure The procedure to run when the remote procedure call is complete.
	* @param {Native.Object} pane Used internally to update the <link xlink:href="Rendition.UI.Grid"/>'s status pane.
	* This can be left undefined.
	*/
	instance.mv = function(sourcePaths, targetPath, callbackProcedure, pane) {
		var req = [
			'Cp',
			[
				sourcePaths,
				targetPath,
				true/*this makes Cp mv rather than Cp*/
			]
		]
		var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI+Rendition.UI.responderKeyName + '1=' + JSON.stringify(req), function(e) {
			var a = JSON.parse(e.responseText);
			a = a.method1.Cp;
			if (a.error === 0) {
				if (pane) {
					var fparse = instance.parseFileData(a);
					pane.dataSet = instance.dataSet(fparse.data, fparse.path);
					pane.grid.loadData(pane.dataSet).clickRow(1);
				}
			} else {
				instance.errorMessage(a);
			}
			if (callbackProcedure) { callbackProcedure.apply(this, [instance, a]) }
		}, instance);
	}
	/**
	* Copies one or more file or directory and subdirectories to another directory.  
	* Similar to UNIX "cp" or windows "xcopy /y /e".
	* @function
	* @name FileManager.cp
	* @memberOf Rendition.UI.FileManager.prototype
	* @public
	* @returns {Native.Object} undefined.
	* @param {Native.Array} sourcePaths Array of source files or folders.
	* @param {Native.Array} targetPath Target path.
	* @param {Native.Function} callbackProcedure The procedure to run when the remote procedure call is complete.
	* @param {Native.Object} pane Used internally to update the <link xlink:href="Rendition.UI.Grid"/>'s status pane.
	* This can be left undefined.
	*/
	instance.cp = function(sourcePaths, targetPath, callbackProcedure, pane) {
		var req = [
			'Cp',
			[
				sourcePaths,
				targetPath,
				false/*move*/
			]
		]
		var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI+Rendition.UI.responderKeyName + '1=' + JSON.stringify(req), function(e) {
			var a = JSON.parse(e.responseText);
			a = a.method1.Cp;
			if (a.error === 0) {
				if (pane) {
					var fparse = instance.parseFileData(a);
					pane.dataSet = instance.dataSet(fparse.data, fparse.path);
					pane.grid.loadData(pane.dataSet).clickRow(1);
				}
			} else {
				instance.errorMessage(a);
			}
			if (callbackProcedure) { callbackProcedure.apply(this, [instance, a]) }
		}, instance);
	}
	/**
	* Recursivly removes a file or directory.  Similar to UNIX "rm -r" or windows "deltree /y".
	* @function
	* @name FileManager.rm
	* @memberOf Rendition.UI.FileManager.prototype
	* @public
	* @returns {Native.Object} undefined.
	* @param {Native.Array} paths Array of paths (file or directories) to delete.
	* @param {Native.Function} callbackProcedure The procedure to run when the remote procedure call is complete.
	* @param {Native.Object} pane Used internally to update the <link xlink:href="Rendition.UI.Grid"/>'s status pane.
	* This can be left undefined.
	*/
	instance.rm = function(paths, callbackProcedure, pane) {
		var url = '';
		var req = [
			'Rm',
			[
				paths
			]
		]
		var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI+Rendition.UI.responderKeyName + '1=' + JSON.stringify(req), function(e) {
			var a = JSON.parse(e.responseText);
			a = a.method1.Rm;
			if (a.error === 0) {
				if (pane) {
					var fparse = instance.parseFileData(a);
					pane.dataSet = instance.dataSet(fparse.data, fparse.path);
					pane.grid.loadData(pane.dataSet).clickRow(1);
				}
			} else {
				instance.errorMessage(a);
			}
			if (callbackProcedure) { callbackProcedure.apply(this, [instance, a]) }
		}, instance);
	}
	/**
	* Edit's the file on the server by loading the file text into an instance of Rendition.UI.CodeEditor.
	* @function
	* @name FileManager.edit
	* @memberOf Rendition.UI.FileManager.prototype
	* @public
	* @returns {Native.Object} Editor.
	* @param {Native.String} path Path to edit.
	* @param {Native.Boolean} newFile When true, a new file will be created.
	* @param {Native.Function} saveCallbackProcedure Procedure to run when save is complete.
	* This can be left undefined.
	*/
    instance.edit = function(path, newFile, saveCallbackProcedure){
        instance.nextEditorId = instance.nextEditorId || 1;
        instance.nextEditorId++;
        instance.newFile = newFile;
        var codearea = {};
        codearea.dirty = false;
        codearea.highlightLine = true;
        codearea.wordWrap = false;
        codearea.printMargin = false;
        codearea.lineGotoNumber = 1;
        codearea.newFileName = Rendition.Localization['FileManager_editor_defaultname_Untitledtxt'].Title;
        codearea.encoding = 'UTF-8';
        /* TODO: get language by file ext */
        codearea.resize = function(){ 
            if(codearea.editor){
                /* move the pre element down so the menu does not overlap the editor */
                codearea.input.style.margin = codearea.menuBar.rect.h + 'px 0 0 0';
                codearea.input.style.height = (codearea.dialog.content.offsetHeight - codearea.menuBar.rect.h) + 'px';
                codearea.input.style.width = codearea.dialog.content.offsetWidth + 'px';
                codearea.editor.resize();
            }
        }
        codearea.close = function () {
            if (codearea.dirty) {
                return Rendition.Localization['FileManager_Are_you_sure_you_want_exit__You_have_unsaved_changes'].Title;
            } else {
                return;
            }
        }
        codearea.initEditor = function(){
            /* initalize the editor dialog */
            codearea.dialog = Rendition.UI.dialogWindow({
			    rect: {
                    x: Rendition.UI.dialogPosition.x,
		            y: Rendition.UI.dialogPosition.y,
				    w: 770,
				    h: 600
			    },
			    title: Rendition.Localization['FileManager_Text_Editor_'].Title,
                resize: codearea.resize
		    });
            codearea.findOptions = {};
            Rendition.UI.appendEvent('beforeunload', window, codearea.close, false);
            codearea.dialog.addEventListener('close', codearea.closeDialog, true);
            codearea.input = document.createElement('pre');
            codearea.input.id = 'te' + instance.nextEditorId;
            codearea.dialog.content.appendChild(codearea.input);
            codearea.theme = 'clouds';
            codearea.language = 'html';
            codearea.editor = ace.edit(codearea.input.id);
            codearea.editor.setShowPrintMargin(false);
            codearea.editor.setTheme("ace/theme/" + codearea.theme);
            var mode = require("ace/mode/" + codearea.language).Mode;
            codearea.editor.getSession().setMode(new mode());
            var barButtons = [];
            var fileButtons = [];
            var editButtons = [];
            var viewButtons = [];
            var themeButtons = [];
            var languageButtons = [];
            barButtons.push({
                text: Rendition.Localization['FileManager_editorMenu_File'].Title,
                childNodes: fileButtons
            });
            barButtons.push({
                text: Rendition.Localization['FileManager_editorMenu_Edit'].Title,
                childNodes: editButtons
            });
            barButtons.push({
                text: Rendition.Localization['FileManager_editorMenu_View'].Title,
                childNodes: viewButtons
            });
            viewButtons.push({
                text: Rendition.Localization['FileManager_editorMenu_Language'].Title,
                childNodes: languageButtons
            });
            viewButtons.push({
                text: Rendition.Localization['FileManager_editorMenu_Theme'].Title,
                childNodes: themeButtons
            });
            viewButtons.push({
                text: Rendition.Localization['FileManager_editorMenu_Word_Wrap'].Title,
                checked: function(){ return codearea.wordWrap},
                click: function (e) {
                    codearea.wordWrap = !codearea.wordWrap;
                    codearea.editor.getSession().setUseWrapMode(codearea.wordWrap);
                }
            });
            languageButtons.push({
                text: 'HTML',
                checked: function(){ return codearea.language === "html"},
                click: function (e) {
                    codearea.language = "html";
                    var mode = require("ace/mode/" + codearea.language).Mode;
                    codearea.editor.getSession().setMode(new mode());
                    return false;
                }
            });
            languageButtons.push({
                text: 'C#',
                checked: function(){ return codearea.language === "csharp"},
                click: function (e) {
                    codearea.language = "csharp";
                    var mode = require("ace/mode/" + codearea.language).Mode;
                    codearea.editor.getSession().setMode(new mode());
                    return false;
                }
            });
           languageButtons.push({
                text: 'CSS',
                checked: function(){ return codearea.language === "css"},
                click: function (e) {
                    codearea.language = "css";
                    var mode = require("ace/mode/" + codearea.language).Mode;
                    codearea.editor.getSession().setMode(new mode());
                    return false;
                }
            });
           languageButtons.push({
                text: 'JavaScript',
                checked: function(){ return codearea.language === "javascript"},
                click: function (e) {
                    codearea.language = "javascript";
                    var mode = require("ace/mode/" + codearea.language).Mode;
                    codearea.editor.getSession().setMode(new mode());
                    return false;
                }
            });
           languageButtons.push({
                text: 'XML',
                checked: function(){ return codearea.language === "xml" },
                click: function (e) {
                    codearea.language = "xml";
                    var mode = require("ace/mode/" + codearea.language).Mode;
                    codearea.editor.getSession().setMode(new mode());
                    return false;
                }
            });
           languageButtons.push({
                text: 'SVG',
                checked: function(){ return codearea.language === "svg" },
                click: function (e) {
                    codearea.language = "svg";
                    var mode = require("ace/mode/" + codearea.language).Mode;
                    codearea.editor.getSession().setMode(new mode());
                    return false;
                }
            });
            for(var x=0;Rendition.UI.aceThemes.length>x;x++){
                themeButtons.push({
                    checked: function(){ return codearea.theme === this.text.toLowerCase().replace(' ','_') },
                    text: Rendition.UI.aceThemes[x][0],
                    click: function (e) {
                        codearea.theme = this.text.toLowerCase().replace(' ','_');
                        codearea.editor.setTheme("ace/theme/"+this.text.toLowerCase().replace(' ','_'));
                        return false;
                    }
                });
            }
            
            fileButtons.push({
                text: Rendition.Localization['FileManager_FileMenu_New'].Title,
                click: function (e) {
                    codearea.closeDialog(undefined, codearea.dialog, function(){
                        instance.edit(codearea.file.DirectoryName,true);
                    });
                    return false;
                }
            });
            fileButtons.push({
                text: Rendition.Localization['FileManager_FileMenu_Save'].Title,
                click: function (e) {
                    codearea.save();
                    if(saveCallbackProcedure){
                        saveCallbackProcedure.apply(codearea,[codearea, instance]);
                    }
                    return false;
                }
            });
            fileButtons.push({
                text: Rendition.Localization['FileManager_FileMenu_Save_As'].Title,
                click: function (e) {
                    codearea.saveAs();
                    if(saveCallbackProcedure){
                        saveCallbackProcedure.apply(codearea,[codearea, instance]);
                    }
                    return false;
                }
            });
            fileButtons.push({
                text: Rendition.Localization['FileManager_FileMenu_Exit'].Title,
                click: function (e) {
                    codearea.dialog.close();
                    return false;
                }
            });
            editButtons.push({
                text: Rendition.Localization['FileManager_EditMenu_Undo'].Title,
                click: function (e) {
                    codearea.editor.undo();
                }
            });
            editButtons.push({
                text: Rendition.Localization['FileManager_EditMenu_Redo'].Title,
                click: function (e) {
                    codearea.editor.redo();
                    return false;
                }
            });
            editButtons.push({
                text: Rendition.Localization['FileManager_EditMenu_Find_and_Replace'].Title,
                click: function (e) {
                    codearea.findAndReplace();
                }
            });
            editButtons.push({
                text: Rendition.Localization['FileManager_EditMenu_Go_To'].Title,
                click: function (e) {
                    codearea.gotoLine();
                }
            });
            codearea.menuBar = Rendition.UI.menu(barButtons, codearea.dialog.content, 'menuBar');
            codearea.resize();
        }
        codearea.gotoLine = function(){
            if(codearea.gotoDialog){
                codearea.gotoDialog.close();
            }
            codearea.gotoDialog = Rendition.UI.dialogWindow({
			    rect: {
				    x: codearea.dialog.rect.x + 45,
				    y: codearea.dialog.rect.y + 45,
				    w: 224,
				    h: 107
			    },
                alwaysOnTop:true,
			    title: Rendition.Localization['FileManager_EditMenu_Goto_Line'].Title
		    });
            var t = document.createElement('table');
            var gotoButton = document.createElement('button');
            gotoButton.innerHTML = 'Go';
            gotoButton.style.cssFloat = 'right';
            gotoButton.style.marginRight = '4px';
            var gotoLineInput = document.createElement('input');
            gotoLineInput.value = codearea.lineGotoNumber;
            gotoLineInput.style.width = '164px';
            t.style.margin = '4px';
            t.style.width = '100%';
            var row1 = t.insertRow(0);
            row1.insertCell(0).appendChild(gotoButton);
            row1.insertCell(0);
            var row2 = t.insertRow(0);
            row2.insertCell(0).appendChild(gotoLineInput);
            row2.insertCell(0).innerHTML = 'Line';
            var submitLine = function(){
                if(!isNaN(parseInt(gotoLineInput.value))){
                    codearea.lineGotoNumber = gotoLineInput.value;
                    codearea.gotoDialog.close();
                    codearea.editor.gotoLine(gotoLineInput.value);
                }else{
                    alert(Rendition.Localization['FileManager_Line_number_must_be_a_number'].Title);
                }
            }
            gotoButton.onclick = function(){
                submitLine();
            };
            gotoLineInput.focus();
            gotoLineInput.select();
            gotoLineInput.onkeyup = function(e){
                if(e.keyCode===13){
                    submitLine();
                }
            }
            codearea.gotoDialog.content.appendChild(t);
        }
        codearea.findAndReplace = function(findValue){
            if(codearea.findAndReplaceDialog){
                codearea.findAndReplaceDialog.close();
            }
            codearea.findAndReplaceDialog = Rendition.UI.dialogWindow({
			    rect: {
				    x: codearea.dialog.rect.x + 45,
				    y: codearea.dialog.rect.y + 45,
				    w: 450,
				    h: 250
			    },
                alwaysOnTop:true,
			    title: Rendition.Localization['FileManager_Find_and_Replace'].Title
		    });
            var t = document.createElement('table');
            t.style.margin = '4px';
            t.style.width = '100%';
            var c = document.createElement('table');
            var findWhat = document.createElement('input');
            findWhat.style.width = '85%';
            findWhat.value = findValue || codearea.findOptions.findWhat || '';
            var replaceWith = document.createElement('input');
            replaceWith.style.width = '85%';
            replaceWith.value = codearea.findOptions.replaceWith || '';
            var findNext = document.createElement('button');
            findNext.style.display = 'block';
            findNext.innerHTML = 'Find Next';
            var replace = document.createElement('button');
            replace.style.display = 'block';
            replace.innerHTML = 'Replace';
            var replaceAll = document.createElement('button');
            replaceAll.style.display = 'block';
            replaceAll.innerHTML = 'Replace All';
            var findPrevious = document.createElement('button');
            findPrevious.style.display = 'block';
            findPrevious.innerHTML = 'Find Previous';
            var cancel = document.createElement('button');
            cancel.style.display = 'block';
            cancel.innerHTML = 'Cancel';
            var matchWholeWord = document.createElement('input');
            matchWholeWord.type = 'checkbox';
            var matchCase = document.createElement('input');
            matchCase.type = 'checkbox';
            var regularExpression = document.createElement('input');
            regularExpression.type = 'checkbox';
            var setFindOptions = function(){
                codearea.findOptions = {
                    findWhat:findWhat.value,
                    replaceWith:replaceWith.value,
                    backwards: false,
                    wrap: false,
                    caseSensitive: matchCase.checked,
                    wholeWord: matchWholeWord.checked,
                    regExp: regularExpression.checked
                }
                var f = codearea.editor.find(findWhat.value,codearea.findOptions);
                return f;
            }
            findNext.onclick = function(){
                setFindOptions();
                codearea.editor.findNext();
            }
            findPrevious.onclick = function(){
                setFindOptions();
                codearea.editor.findPrevious();
            }
            replace.onclick = function(){
                setFindOptions();
                codearea.editor.replace(replaceWith.value);
            }
            replaceAll.onclick = function(){
                setFindOptions();
                codearea.editor.replaceAll(replaceWith.value);
            }
            cancel.onclick = function(){
                codearea.findAndReplaceDialog.close();
            }
            var table = [];
            var checktable = [];
            for(x=3;x>=0;x--){
                var row = t.insertRow(0);
                table[x] = [];
                for(y=2;y>=0;y--){
                    table[x][y] = row.insertCell(0);
                }
            }
            for(x=3;x>=0;x--){
                var row = c.insertRow(0);
                checktable[x] = [];
                for(y=2;y>=0;y--){
                    checktable[x][y] = row.insertCell(0);
                }
            }
            table[0][0].innerHTML = Rendition.Localization['FileManager_Find_What'].Title;
            table[1][0].innerHTML = Rendition.Localization['FileManager_Replace_With'].Title;
            table[1][0].style.width = '130px';
            table[0][1].appendChild(findWhat);
            table[1][1].appendChild(replaceWith);
            table[2][1].appendChild(c);
            table[2][1].style.verticalAlign = 'top';
            table[2][0].appendChild(findNext);
            table[2][0].appendChild(findPrevious);
            table[2][0].appendChild(replace);
            table[2][0].appendChild(replaceAll);
            table[2][0].appendChild(cancel);

            checktable[0][0].appendChild(matchWholeWord);
            checktable[0][1].innerHTML = Rendition.Localization['FileManager_Match_Whole_Word'].Title;
            checktable[1][0].appendChild(matchCase);
            checktable[1][1].innerHTML = Rendition.Localization['FileManager_Match_Case'].Title;
            checktable[2][0].appendChild(regularExpression);
            checktable[2][1].innerHTML = Rendition.Localization['FileManager_Use_Regular_Expression'].Title;
            codearea.findAndReplaceDialog.content.appendChild(t);
        }
        codearea.closeDialog = function(e,dialog,successCallback){
            if(codearea.dirty){
                var yes = Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_EditorClose_Yes'].Title, onclick: function (e, confirm) {
	                codearea.save();
                    codearea.saveDialog.dialog.close();
                    codearea.dialog.removeEventListener('close', codearea.closeDialog, true);
                    codearea.dialog.close();
                    Rendition.UI.removeEvent('beforeunload', window, codearea.close, false);
	                if(typeof successCallback === 'function'){
                        successCallback.apply(codearea,[]);
                    }
                    return;
	            }});
                var no = Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_EditorClose_No'].Title, onclick: function (e, confirm) {
                    codearea.saveDialog.dialog.close();
                    codearea.dialog.removeEventListener('close', codearea.closeDialog, true);
                    codearea.dialog.close();
                    Rendition.UI.removeEvent('beforeunload', window, codearea.close, false);
	                if(typeof successCallback === 'function'){
                        successCallback.apply(codearea,[]);
                    }
                    return;
	            }});
                var cancel = Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_EditorClose_Cancel'].Title, onclick: function (e, confirm) {
                    codearea.saveDialog.dialog.close();
	                return;
	            }});
                codearea.saveDialog = Rendition.UI.ConfirmDialog({
                    message: Rendition.Localization['FileManager_EditorClose_Do_you_want_to_save'].Message.replace('\n','<br>') ,
                    subTitle: Rendition.Localization['FileManager_Save_changes'].Title,
                    title: Rendition.Localization['FileManager_Save_changes_before_closing'].Title,
                    buttons: [yes, no, cancel],
                    dialogRect: { x: (document.documentElement.clientWidth * .5) - (750 * .5), y: 75, h: 200, w: 750 },
                    autoSize: true
                });
                if(dialog){
                    dialog.preventDefault();
                }
                return;
            }
        }
        codearea.openFile = function(path_and_filename){
            var req = [ 'GetFileText',[path_and_filename, codearea.encoding] ];
		    url = Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
            Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI+'' + url, function(e) {
			    var r = JSON.parse(e.responseText);
			    if(r.method1.error!=undefined){
				    alert(r.method1.description);
				    return;
			    }
			    r = r.method1.GetFileText;
                var mode = require("ace/mode/html").Mode;
                codearea.editor.getSession().setMode(new mode());
                codearea.editor.getSession().setValue(r.text);
                codearea.dialog.title(r.name);
                codearea.file = r;
                codearea.attachChangeEvent();
                setTimeout(function(){
                    codearea.input.childNodes[1].scrollLeft = 0;
                    codearea.setCursorData();
                },0);
            },instance);
        }
        codearea.setCursorData = function(){
            var c = codearea.editor.getSession().getSelection().getCursor();
            var len = codearea.editor.getSession().getValue().split("\n").length;
            var loc = '&nbsp;&nbsp;['+c.row + ':' + c.column+'] : ' + len;
            var mod = codearea.dirty === true ? 'Modified' : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            var enc = codearea.encoding;
            codearea.dialog.statusBarCenter.style.paddingTop = '3px';
            codearea.dialog.statusBarCenter.style.fontSize = '12px';
            codearea.dialog.statusBarCenter.innerHTML = loc +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
            mod + ' ' + enc;
        }
        codearea.attachChangeEvent = function(){
            codearea.editor.getSession().selection.on('changeCursor',function(){
                codearea.setCursorData();
            });
            codearea.editor.getSession().on('change', function(){
                codearea.setCursorData();
                if(!codearea.dirty){
                    codearea.dialog.title(codearea.file.name + '*');
                    codearea.dirty = true;
                }
            });
        }
        codearea.saveAs = function(){
            codearea.saveAsDialog = Rendition.UI.dialogWindow({
			    rect: {
				    x: 35,
				    y: 35,
				    w: 400,
				    h: 140
			    },
			    title: 'Save ' + codearea.file.name + ' as...',
                modal: true,
                modalCloseable: true
		    });
            var cancelButton = document.createElement('button');
            var saveButton = document.createElement('button');
            var newFileName = document.createElement('input');
            cancelButton.style.cssFloat = 'right';
            saveButton.style.cssFloat = 'right';
            saveButton.style.margin = '4px';
            cancelButton.style.margin = '4px';
            newFileName.style.width = '85%';
           
            saveButton.innerHTML = Rendition.Localization['FileManager_SaveAs_Save'].Title;
            cancelButton.innerHTML = Rendition.Localization['FileManager_SaveAs_Cancel'].Title;
            cancelButton.onclick = function(){
                codearea.saveAsDialog.close();
            }
            saveButton.onclick = function(){
                codearea.file.fullName = newFileName.value;
                codearea.save();
                codearea.saveAsDialog.close();
                instance.newFile = false;
            }
            var rows = [[Rendition.UI.txt('Name'), newFileName]];
			var pt = Rendition.UI.pairtable({
				rows: rows
			});
            pt.table.style.width = '100%';
            pt.table.rows[0].cells[0].style.width = '50px';
            newFileName.value = codearea.file.fullName;
            var g = Rendition.UI.GroupBox({
                title:  Rendition.Localization['FileManager_Save_x_as'].Title.replace('{0}',codearea.file.name),
                childNodes: [pt.table],
                alwaysExpanded: true
            });
            g.appendTo(codearea.saveAsDialog.content);
            codearea.saveAsDialog.content.appendChild(saveButton);
            codearea.saveAsDialog.content.appendChild(cancelButton);
        }
        codearea.save = function(){
            if(instance.newFile){
                codearea.saveAs();
                return;
            }
            var text = codearea.editor.getSession().getValue();
            var req = [ 'SaveFileText',[
                codearea.file.fullName,
                codearea.encoding,
                text,
                codearea.file.lastWriteTime,
                true
            ]];
		    var url = Rendition.UI.responderKeyName + '1=' + encodeURIComponent(JSON.stringify(req));
            Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function(e) {
			    var r = JSON.parse(e.responseText);
			    if(r.method1.error!=undefined){
				    alert(r.method1.description);
				    return;
			    }
                r = r.method1.SaveFileText;
                codearea.file = r;
                codearea.dialog.title(codearea.file.name);
                if(codearea.saveAsDialog){
                    codearea.saveAsDialog.close();
                }
                codearea.dirty = false;
                codearea.setCursorData();
            },instance);
        }
        codearea.initEditor();
        if(instance.newFile){
            codearea.file = {};
            codearea.file.name = codearea.newFileName;
            codearea.file.fullName = path + codearea.newFileName;
            codearea.file.lastWriteTime = '';
            codearea.dialog.title(codearea.file.name);
            codearea.attachChangeEvent();
            codearea.setCursorData();
        }else{
            codearea.openFile(path);
        }
        return codearea;
    }
	/**
	* Gets a list of files and directories in a directory.  Similar to UNIX "ls" or windows "dir".
	* @function
	* @name FileManager.ls
	* @memberOf Rendition.UI.FileManager.prototype
	* @public
	* @returns {Native.Array} List of paths and files.
	* @param {Native.Array} paths List of paths to return.
	* @param {Native.Function} callbackProcedure The procedure to run when the remote procedure call is complete.
	* @param {Native.Object} pane Used internally to update the <link xlink:href="Rendition.UI.Grid"/>'s status pane.
	* This can be left undefined.
	*/
	instance.ls = function(paths, callbackProcedure, pane) {
		var url = '';
		if (typeof paths != 'string') {
			var l = paths.length;
			var reqs = [];
			for (var x = 0; l > x; x++) {
				var req = [
					'Ls',
					[
						paths[x]
					]
				]
				reqs.push('method' + (x + 1) + '=' + JSON.stringify(req));
			}
			url = reqs.join('&');
		} else {
			var req = [
				'Ls',
				[
					paths
				]
			]
			url = Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
		}
		instance.listReq = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI+'' + url, function(e) {
			var a = JSON.parse(e.responseText);
			if(a.method1.error!=undefined){
				alert(a.method1.description);
				return;
			}
			a = a.method1.Ls;
			if (pane) {
				if (a.error === 0) {
					var fparse = instance.parseFileData(a);
					pane.dataSet = instance.dataSet(fparse.data, fparse.path);
					pane.grid.loadData(pane.dataSet).clickRow(1);
					Rendition.UI.lastBrowsePath = fparse.path;
				} else {
					instance.errorMessage(a);
				}
				if (callbackProcedure) { callbackProcedure.apply(this, [instance, a]) }
			} else {
				if (a.error === 0) {
					
				} else {
					instance.errorMessage(a);
				}
				if (callbackProcedure) { callbackProcedure.apply(this, [instance, a]) }
			}
		}, instance);
	}
	/**
	* Handles clicking on a node path, opens the node path in the file manager's grid.
	* @function
	* @name UploadDialog.treeLabelClick
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @param {Native.String} e The browser event object.
	* @param {Native.Object} treeView The <link xlink:href="Rendition.UI.TreeView"/>.
	* @param {Native.DHTMLElement} node The DHTML element.
	* @param {Native.DHTMLElement} labelText The DHTML element that makes up the label text.
	* @param {Native.Object} treeNode The <link xlink:href="Rendition.UI.TreeNode"/>.
	* @private
	*/
	instance.treeLabelClick = function(e, treeView, node, labelText, treeNode) {
		if(treeNode.value!='empty'&&treeNode.childNodes.url!=undefined){
			labelText.innerHTML = treeNode.text + treeView.style.loadingImage;
			instance.ls(treeNode.value, function() {
				labelText.innerHTML = treeNode.text;
			}, instance.pane[1]);
		}else{
			treeView.preventDefault();
		}
		return false;
	}
	/**
	* Used internally to process RPC data from the server.  
	* @name UploadDialog.parseFileData
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @private
	* @function
	* @returns {Native.Object} { data: data, path: path }.
	*/
	instance.parseFileData = function(a) {
		var data = [];
		var l = a.files.length;
		for (var x = 0; l > x; x++) {
			var fullName = a.files[x].name;
			var fileName = fullName.substring(fullName.lastIndexOf('/') + 1, 256);
			var path = fullName.substring(0, fullName.length - (fileName.length));
			if(fullName.lastIndexOf('\\')!=-1){
				var fileName = fullName.substring(fullName.lastIndexOf('\\') + 1, 256);
				var path = fullName.substring(0, fullName.length - (fileName.length));
			}
			var row = [];
			row.push(Rendition.UI.iif(a.files[x].objectType == 'directory', fileName, fileName));
			row.push(Rendition.UI.iif(a.files[x].objectType == 'directory', '<DIR>', a.files[x].size));
			row.push(a.files[x].creationTime);
			row.push(a.files[x].lastAccessTime);
			row.push(a.files[x].objectType);
			if ((a.files[x].objectType == 'directory' && args.selectFolder == true) || (args.selectFolder == false || args.selectFolder === undefined)) {
				data.push(row);
			}
		}
		/* trim the trailing periods when connected to FTP and .. is the only dir */
		if(path.substring(path.length-3)=="/.."){
			path = path.substring(0,path.length-3);
		}
		return { data: data, path: path }
	}
	/**
	* Starts the file manager.  
	* @name UploadDialog.init
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @private
	* @function
	* @returns {Native.Object} undefined.
	*/
	instance.init = function() {
		instance.pane = [{}, {}];
		instance.contextMenuOptions = [];
		var req = [
			'Ls',
			[
				args.path || Rendition.UI.lastBrowsePath
			]
		]
		var req2 = [
			'GetLogicalDrives',[]
		]
		instance.listReq = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI+Rendition.UI.responderKeyName + '1=' + JSON.stringify(req) + '&method2=' + JSON.stringify(req2), function(e) {
			var z = JSON.parse(e.responseText);
			var a = z.method1.Ls;
			var data = z.method2.GetLogicalDrives;
			var childNodes = [];
			if(z.method1.error!=undefined){
				alert(z.method1.description);
				return;
			}
			if(z.method2.error!=undefined){
				alert(z.method2.description);
				return;
			}
			if (a.error == 0) {
				var l = data.length;
				for (var x = 0; l > x; x++) {
					var req = [
						'Ls',
						[
							String(data[x].name)
						]
					]
					var url = Rendition.UI.clientServerSyncURI+Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
					childNodes.push({
						text: '&nbsp;&nbsp;<img style="margin-bottom: -3px;margin-left: -13px;margin-right:2px" src="/admin/img/icons/'+
						instance.getTypeIcon(data[x].objectType,data[x].name)+'" alt="">'+String(data[x].name),
						value: String(data[x].name),
						childNodes: {
							url: url,
							callbackProcedure: function(json, tree, node, parentNode) {
								if(json.method1.error!=undefined){
									alert(json.method1.description);
									return;
								}
								var a = json.method1.Ls;
								if(a.error!=0){
									alert(a.description);
									return;
								}
								var treeObj = instance.treeObject(a.files, node.getAttribute('name'));
								var l = treeObj.length;
								while (node.firstChild) { node.removeChild(node.firstChild) }
								for (var x = 0; l > x; x++) {
									tree.add(treeObj[x], node);
								}
								return null;
							}
						}
					});
				}
				var fparse = instance.parseFileData(a);
				instance.pane = [{}, {}];
				instance.pane[0].treeObject = {
					name: Rendition.Localization['FileManager_Logical_Drives'].Title,
					childNodes: childNodes
				}
				instance.pane[1].dataSet = instance.dataSet(fparse.data, fparse.path);
				var selectionMethod = 3; /*multi row*/
				if (args.selectFolder == true || args.selectFile == true) {
					selectionMethod = 0; /*single row*/
				}
				instance.pane[1].grid = Rendition.UI.Grid({
					name: 'FileManager',
                    parentNode: instance.parentNode,
					data: instance.pane[1].dataSet,
					detailspane: instance.detailsPane,
					celldblclick: instance.celldblclick,
					contextMenuOptions: instance.contextMenuOptions,
					selectionMethod: selectionMethod,
					cellstyle: instance.cellStyle,
					detailsPaneVisible: true,
                    preventReorder: true
				});
				instance.pane[1].grid.clickRow(1);
			} else {
				alert(a.error + ' ' + a.description);
			}
		}, instance);
	}
	/**
	* Styles the grid cell to look like a file browser.
	* @name UploadDialog.cellStyle
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @private
	* @function
	* @returns {Native.Object} undefined.
	*/
	instance.cellStyle = function(e, grid, element, row, column, selection, data, header){
		if(header==undefined){return}
		if(header.index==0){
			var img = '<img style="float:left;margin:left:3px;" src="/admin/img/icons/'+instance.getTypeIcon(data[4],data[0])+'" alt="">';
			element.innerHTML = img +'&nbsp;&nbsp;'+ grid.truncateText(data[header.index],header.width);
		}else if(header.index==1){
			if(!isNaN(data[header.index])){
				if(data[header.index]>0){
					element.textContent = Rendition.UI.addCommas(data[header.index]);
				}else{
					element.textContent = 0;
				}
			}else{
                element.textContent = '';
            }
		}else if(header.index==2||header.index==3){
            var s = Rendition.UI.formatDate(data[header.index],'MM/DD/YYYY hh:nn:ss A');
            var o = grid.truncateText(s,header.width);
            if(o.indexOf('NaN')>0){
                element.textContent = "";
            }else{
			    element.textContent = o;
            }
		}
		return;
	}
	instance.styleBytes = function(){
	
	}
	/**
	* Handles creating a context menu for the tree view.
	* @function
	* @name UploadDialog.treeContextMenu
	* @memberOf Rendition.UI.UploadDialog.prototype
	* @param {Native.String} e The browser event object.
	* @param {Native.Object} treeView The <link xlink:href="Rendition.UI.TreeView"/>.
	* @param {Native.DHTMLElement} node The DHTML element.
	* @param {Native.DHTMLElement} labelText The DHTML element that makes up the label text.
	* @param {Native.Object} treeNode The <link xlink:href="Rendition.UI.TreeNode"/>.
	* @private
	*/
	instance.treeContextMenu = function(e, treeView, node, labelText, treeNode){
		instance.treeContextMenuOptions = []
		optionLength = -1;
		optionLength++;
		instance.treeContextMenuOptions[optionLength] = Rendition.UI.MenuOption();
		instance.treeContextMenuOptions[optionLength].text = Rendition.Localization['FileManager_TreeContext_Copy'].Title;
		Rendition.UI.appendEvent('mousedown', instance.treeContextMenuOptions[optionLength],undefined , false);
		optionLength++;
		instance.treeContextMenuOptions[optionLength] = Rendition.UI.MenuOption();
		instance.treeContextMenuOptions[optionLength].text = Rendition.Localization['FileManager_TreeContext_Move'].Title;
		Rendition.UI.appendEvent('mousedown', instance.treeContextMenuOptions[optionLength],undefined , false);
		optionLength++;
		instance.treeContextMenuOptions[optionLength] = Rendition.UI.MenuOption();
		instance.treeContextMenuOptions[optionLength].text = Rendition.Localization['FileManager_TreeContext_Rename'].Title;
		Rendition.UI.appendEvent('mousedown', instance.treeContextMenuOptions[optionLength],undefined , false);
		optionLength++;
		instance.treeContextMenuOptions[optionLength] = Rendition.UI.MenuOption();
		instance.treeContextMenuOptions[optionLength].text = Rendition.Localization['FileManager_TreeContext_Delete'].Title;
		Rendition.UI.appendEvent('mousedown', instance.treeContextMenuOptions[optionLength],undefined , false);
		var menu = Rendition.UI.ContextMenu(e,{
			elements:instance.treeContextMenuOptions,
			caller:node,
			type:'mouse'
		});
		
		e.preventDefault();
		return null;
	}
	/**
	* Downloads a file.
	* @function
	* @name FileManager.downloadFile
	* @memberOf Rendition.UI.FileManager.prototype
	* @private
	* @returns {Native.Object} undefined.
	* @param {Native.String} path The path to the file to download.
	*/
	instance.downloadFile = function(path) {
		var req = [
			'DownloadFile',
			[
				path
			]
		]
		Rendition.UI.postToNewWindow(Rendition.UI.clientServerSyncURI+Rendition.UI.responderKeyName + '1=' + JSON.stringify(req));
	}
	/**
	* Handle double clicking row cells.
	* @name FileManager.celldblclick
	* @memberOf Rendition.UI.FileManager.prototype
	* @private
	* @function
	* @returns {Native.Object} undefined.
	*/
	instance.celldblclick = function(e, grid, element, row, column, selection) {
		grid.preventDefault();
		var data = grid.local[selection[0].rowIndex].data;
		var pane = instance.pane[1];
		var path = pane.dataSet.schema.name;
        var ext = data[4].toLowerCase();
		if (ext != 'directory') {
            if(Rendition.UI.imageExt.indexOf(ext)!=-1){
                var req = [
			        'DownloadFile',
			        [
				        pane.dataSet.schema.name + data[0]
			        ]
		        ]
		        var src = Rendition.UI.clientServerSyncURI+Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
                Rendition.UI.ImageViewer({ src: src });
            }else if(Rendition.UI.textExt.indexOf(ext)!=-1){
                instance.downloadFile(pane.dataSet.schema.name + data[0]);
            }else{
                instance.edit(pane.dataSet.schema.name + data[0]);
            }
		} else {
			if (data[0] == '..') {
				if(path.indexOf('/')!=-1){
					/* FTP mode - uses forward slashes */
					path = path.substring(0, path.lastIndexOf('/', path.length - 2));
				}else{
					/* local path mode uses backslashes (and the cow says MOOO) */
					path = path.substring(0, path.lastIndexOf('\\', path.length - 2));
					if (path.indexOf('\\') == -1) {
						path += '\\';
					}
				}

			} else {
				path += data[0];
			}
			instance.ls(path, null, pane);
		}

	}
	/**
	* Handles updating the detail pane when the grid's selection has changed.
	* @name FileManager.detailsPane
	* @memberOf Rendition.UI.FileManager.prototype
	* @private
	* @function
	* @returns {Native.Object} undefined.
	*/
	instance.detailsPane = function(e, grid, element, row, column, selection) {
		var path = '';
		if(selection==undefined){return;}
		if (instance.pane.length == 0) { return false }
		var tree = instance.pane[0];
		var pane = instance.pane[1];
		var pathBox = document.createElement('input');
		path = instance.pane[1].dataSet.schema.name;
		pathBox.value = path;
		pane.selectedFiles = [];
		pane.selectedFilesWithPath = [];
		pane.selectedDirectories = [];
		pane.selectedFilesAndDirectoriesWithPath = [];
		pane.files = [];
		pane.filesWithPath = [];
		pane.directories = [];
		pane.filesAndDirectoriesWithPath = [];
		grid.preventDefault();
		element.innerHTML = '';
		if (selection !== undefined) {
			var l = selection.length;
			var totalSelectedSize = 0;
			var totalSize = 0;
			for (var x = 0; l > x; x++) {
				if (grid.local[selection[x].rowIndex].data[4] != 'directory') {
					pane.selectedFiles.push(grid.local[selection[x].rowIndex].data[0]);
					pane.selectedFilesWithPath.push(path + grid.local[selection[x].rowIndex].data[0]);
					totalSelectedSize += grid.local[selection[x].rowIndex].data[1];
					pane.selectedFilesAndDirectoriesWithPath.push(path + grid.local[selection[x].rowIndex].data[0]);
				} else {
					pane.selectedDirectories.push(grid.local[selection[x].rowIndex].data[0] + '\\');
					pane.selectedFilesAndDirectoriesWithPath.push(path + grid.local[selection[x].rowIndex].data[0] + '\\');
				}

			}
		}
		for (var x = 0; instance.records > x; x++) {
			if (grid.local[x].data[4] != 'directory') {
				pane.files.push(grid.local[x].data[0]);
				pane.filesWithPath.push(path + grid.local[x].data[0]);
				pane.filesAndDirectoriesWithPath.push(path + grid.local[selection[x].rowIndex].data[0]);
				totalSize += grid.local[x].data[1];
			} else {
				pane.directories.push(grid.local[x].data[0] + '\\');
				pane.filesAndDirectoriesWithPath.push(path + grid.local[selection[x].rowIndex].data[0] + '\\');
			}
		}
		if (args.selectFolder == true && pane.selectedDirectories !== undefined) {
			path = path + pane.selectedDirectories[0];
		}
		if (args.selectFile == true) {
			if (pane.selectedFilesWithPath.length>0) {
				pathBox.value = pane.selectedFilesWithPath.join(',');
			}
		}
		var optionLength = -1;
		if (pane.selectedFiles !== undefined) {
			var downloadFilesArchive = function(e) {
				instance.downloadFile(pane.selectedFilesWithPath[0]);
				return;
			}
            var edit = function(e) {
                instance.edit(pane.selectedFilesWithPath[0]);
                return;
            }
			var downloadFile = function(e) {
				instance.downloadFile(pane.selectedFilesWithPath[0]);
				return;
			}
            var newFile = function(e){
                instance.edit(path,true);
            }
			var copy = function(e) {
				var utilFile = Rendition.UI.FileManager({
					title: Rendition.Localization['FileManager_Context_Copy_To'].Title,
					path: path,
					selectFolder: true,
					selectCallback: function(path, fileMan) {
						if (path.length > 0) {
							instance.cp(pane.selectedFilesAndDirectoriesWithPath, path, null, pane);
						}
						return null;
					}
				});
				return;
			}
			var rename = function(e){
				instance.renameDialog = Rendition.UI.dialogWindow({
					rect: {
						x: 0,
						y: 0,
						w: 400,
						h: 175
					},
					title: Rendition.Localization['FileManager_Context_RenameMove_Single_File'].Title,
					modal: true,
					modalCloseable: true
				});
				var ok = Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_Context_Rename'].Title, onclick: function(e, confirm) {
					if(instance.mkDirValid.isValid()){
						ok.disabled = true;
						instance.rn(pane.selectedFilesWithPath[0],instance.mkDirInput.value,function() {
							instance.renameDialog.close();
						},pane);
					}
					return;
				}
				});
				var cancel = Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_RenameContext_Cancel'].Title, onclick: function(e, confirm) {
					instance.renameDialog.close();
					return;
				}
				});
				ok.style.margin = '4px';
				cancel.style.margin = '4px';
				instance.mkDirInput = document.createElement('input');
				instance.mkDirInput.value = pane.selectedFilesWithPath[0];
				instance.mkDirValid = Rendition.UI.AutoComplete({
					mustMatchPattern: /.+/,
					patternMismatchMessage: Rendition.Localization['FileManager_File_and_folder_names_cannot_contain_the_following_characters'].Title + ' \\/:*?"<>|',
					patternMismatchTitle: Rendition.Localization['FileManager_Invalid_file_name'].Title,
					input: instance.mkDirInput
				});
				instance.mkDirInput.style.width = '85%';
				var rows = [
					[Rendition.UI.txt('Rename/Move'),Rendition.UI.txt(pane.selectedFilesWithPath[0])],
					[Rendition.UI.txt('To'), instance.mkDirInput]
				];
				var pt = Rendition.UI.pairtable({
					rows: rows
				});
				instance.mkdirGroupbox = Rendition.UI.GroupBox({
					title: Rendition.Localization['FileManager_Enter_the_new_file_name_and_path'].Title,
					childNodes: [pt.table],
					alwaysExpaned: true
				});
				instance.mkdirGroupbox.appendTo(instance.renameDialog.content);
				instance.renameDialog.content.appendChild(ok);
				instance.renameDialog.content.appendChild(cancel);
				instance.renameDialog.autosize();
				return;
			}
			var move = function(e) {
				var utilFile = Rendition.UI.FileManager({
					title: Rendition.Localization['FileManager_Context_Move_To'].Title,
					path: path,
					selectFolder: true,
					selectCallback: function(path, fileMan) {
						if (path.length > 0) {
							instance.mv(pane.selectedFilesAndDirectoriesWithPath, path, null, pane);
						}
						return null;
					}
				});
				return;
			}
			var deleteFile = function(e) {
				var yes = Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_Delete_Yes'].Title, onclick: function(e, confirm) {
					instance.rm(pane.selectedFilesAndDirectoriesWithPath, function() {
						instance.confirmDeleteDialog.close();
					}, pane);
					return;
				}
				});
				var no = Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_Delete_No'].Title, onclick: function(e, confirm) {
					instance.confirmDeleteDialog.close();
					return;
				}
				});
				yes.style.margin = '4px';
				no.style.margin = '4px';
				instance.confirmDeleteDialog = Rendition.UI.ConfirmDialog({
					message: Rendition.Localization['FileManager_Are_you_sure_you_want'].Title,
					subTitle: Rendition.Localization['FileManager_Confirm_Delete'].Title,
					title: Rendition.Localization['FileManager_Confirm_Delete'].Title,
					buttons: [yes, no],
					autosize: true
				});
				return;
			}
			var createFolder = function(e) {
				instance.mkdirDialog = Rendition.UI.dialogWindow({
					rect: {
						x: 0,
						y: 0,
						w: 400,
						h: 175
					},
					title: Rendition.Localization['FileManager_Create_Folder'].Title,
					modal: true,
					modalCloseable: true
				});
				var ok = Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_Create_Folder'].Title, onclick: function(e, confirm) {
					if(instance.mkDirValid.isValid()){
						ok.disabled = true;
						instance.mkdir(path + instance.mkDirInput.value, function() {
							instance.mkdirDialog.close();
						}, pane);
					}
					return;
				}
				});
				var cancel = Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_MkDir_Cancel'].Title, onclick: function(e, confirm) {
					instance.mkdirDialog.close();
					return;
				}
				});
				ok.style.margin = '4px';
				cancel.style.margin = '4px';
				instance.mkDirInput = document.createElement('input');
				instance.mkDirInput.value = Rendition.Localization['FileManager_New_Folder'].Title;
				instance.mkDirValid = Rendition.UI.AutoComplete({
					mustMatchPattern: /^[^\\/:\*\?"<>\|]+$/,
					patternMismatchMessage: Rendition.Localization['FileManager_File_and_folder_names_cannot_contain_the_following_characters'].Title +' \\/:*?"<>|',
					patternMismatchTitle: Rendition.Localization['FileManager_Invalid_folder_name'].Title,
					input: instance.mkDirInput
				});
				instance.mkDirInput.style.width = '85%';
				var rows = [[Rendition.UI.txt('Folder Name'), instance.mkDirInput]];
				var pt = Rendition.UI.pairtable({
					rows: rows
				});
				instance.mkdirGroupbox = Rendition.UI.GroupBox({
					title: Rendition.Localization['FileManager_Enter_a_name_for_your_new_folder_GroupBox_title'].Title,
					childNodes: [pt.table],
					alwaysExpaned: true
				});
				instance.mkdirGroupbox.appendTo(instance.mkdirDialog.content);
				instance.mkdirDialog.content.appendChild(ok);
				instance.mkdirDialog.content.appendChild(cancel);
				instance.mkdirDialog.autosize();
				return;
			}
			var uploadFile = function(e) {
				instance.upload(path);
				return;
			}
			optionLength++;
			if(pane.selectedFilesWithPath.length===1){
				instance.contextMenuOptions[optionLength] = Rendition.UI.MenuOption();
				instance.contextMenuOptions[optionLength].text = Rendition.Localization['FileManager_ContextMenu_Download_File'].Title;
				Rendition.UI.appendEvent('mousedown', instance.contextMenuOptions[optionLength], downloadFile, false);
			}
            if(pane.selectedFilesWithPath.length===1){
			    optionLength++;
			    instance.contextMenuOptions[optionLength] = Rendition.UI.MenuOption();
			    instance.contextMenuOptions[optionLength].text = Rendition.Localization['FileManager_ContextMenu_Edit'].Title;
			    Rendition.UI.appendEvent('mousedown', instance.contextMenuOptions[optionLength], edit , false);
            }
			optionLength++;
			instance.contextMenuOptions[optionLength] = Rendition.UI.MenuOption();
			instance.contextMenuOptions[optionLength].text = Rendition.Localization['FileManager_ContextMenu_Copy'].Title;
			Rendition.UI.appendEvent('mousedown', instance.contextMenuOptions[optionLength],copy , false);
			optionLength++;
			instance.contextMenuOptions[optionLength] = Rendition.UI.MenuOption();
			instance.contextMenuOptions[optionLength].text = Rendition.Localization['FileManager_ContextMenu_Move'].Title;
			Rendition.UI.appendEvent('mousedown', instance.contextMenuOptions[optionLength],move , false);
			optionLength++;
			instance.contextMenuOptions[optionLength] = Rendition.UI.MenuOption();
			instance.contextMenuOptions[optionLength].text = Rendition.Localization['FileManager_ContextMenu_Rename'].Title;
			Rendition.UI.appendEvent('mousedown', instance.contextMenuOptions[optionLength],rename , false);
			optionLength++;
			instance.contextMenuOptions[optionLength] = Rendition.UI.MenuOption();
			instance.contextMenuOptions[optionLength].text = Rendition.Localization['FileManager_ContextMenu_Delete'].Title;
			Rendition.UI.appendEvent('mousedown', instance.contextMenuOptions[optionLength],deleteFile , false);
		}
		optionLength++;
		instance.contextMenuOptions[optionLength] = Rendition.UI.MenuOption();
		instance.contextMenuOptions[optionLength].text = Rendition.Localization['FileManager_ContextMenu_Create_Folder'].Title;
		Rendition.UI.appendEvent('mousedown', instance.contextMenuOptions[optionLength],createFolder , false);
		optionLength++;
		instance.contextMenuOptions[optionLength] = Rendition.UI.MenuOption();
		instance.contextMenuOptions[optionLength].text = Rendition.Localization['FileManager_ContextMenu_Upload_A_File'].Title;
		Rendition.UI.appendEvent('mousedown', instance.contextMenuOptions[optionLength],uploadFile , false);
		var buttons = [];
		if (args.selectFile == true) {
			buttons.push(Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_Select_File'].Title, onclick: function(e, confirm) {
				var file = String(pane.selectedFilesWithPath[0]);
				if(file.substring(file.length-1,file.length)=="\\"){
					alert(Rendition.Localization['FileManager_You_must_select_a_file_not_a_folder'].Title);
					return;
				}
				instance.dialog.close();
				if (args.selectCallback !== undefined) { args.selectCallback.apply(instance, [file, instance]) }
				return;
			}
			}));
		} else if (args.selectFiles == true) {
			buttons.push(Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_Select_Files'].Title, onclick: function(e, confirm) {
				instance.dialog.close();
				if (args.selectCallback !== undefined) { args.selectCallback.apply(instance, [pane.selectedFilesWithPath, instance]) }
				return;
			}
			}));
		} else if (args.selectFolder == true) {
			buttons.push(Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_Select_Folder'].Title, onclick: function(e, confirm) {
				/* prevent selecting the .. folder */
				path = path.replace("\\..\\","\\");
				if(!path.substring(path.length-1,path.length)=="\\"){
					alert(Rendition.Localization['FileManager_You_must_select_a_folder_not_a_file'].Title);
					return;
				}
				instance.dialog.close();
				if (args.selectCallback !== undefined) { args.selectCallback.apply(instance, [path, instance]) }
				return;
			}
			}));
		}
		buttons.push(Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_ButtonBar_Copy'].Title, onclick: copy }));
		buttons.push(Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_ButtonBar_Move'].Title, onclick: move }));
		buttons.push(Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_ButtonBar_Rename'].Title, onclick: rename }));
		buttons.push(Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_ButtonBar_New_Folder'].Title, onclick: createFolder }));
		buttons.push(Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_ButtonBar_Delete'].Title, onclick: deleteFile }));
		buttons.push(Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_ButtonBar_Upload'].Title, onclick: uploadFile }));
        if(pane.selectedFilesWithPath.length==1){
            buttons.push(Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_ButtonBar_Edit'].Title, onclick: edit }));
        }
        buttons.push(Rendition.UI.button({ innerHTML: Rendition.Localization['FileManager_ButtonBar_New'].Title, onclick: newFile }));
		for (var x = 0; buttons.length > x; x++) {
			buttons[x].style.margin = '0 auto 0 auto';
			buttons[x].style.display = 'inline-block';
		}
		pathBox.style.width = '100%';
		pathBox.onkeydown = function(e) {
			if (e.keyCode == 13) {
				pathBox.disabled = true;
				instance.ls(pathBox.value, function() {
					pathBox.disabled = false;
				}, instance.pane[1]);
			}
		}
		pathBox.style.cssFloat = 'left';
		element.appendChild(pathBox);
		var appendButtons = function(targetObj) {
			for (var x = 0; buttons.length > x; x++) {
				targetObj.appendChild(buttons[x]);
			}
		}
		var disableButtons = function() {
			for (var x = 0; buttons.length > x; x++) {
				buttons[x].enabled = false;
			}
		}
		var enableButtons = function() {
			for (var x = 0; buttons.length > x; x++) {
				buttons[x].enabled = true;
			}
		}
		if (selection === undefined || grid.headers === undefined) {
			disableButtons();
		}
		var buttonDiv = document.createElement('div');
		buttonDiv.style.margin = 0;
		buttonDiv.style.background = grid.style.viewPortBackground;
		element.appendChild(buttonDiv);
		appendButtons(buttonDiv);
		var div = document.createElement('div');
		div.className = 'fileList';
		element.appendChild(div);
		/* pretty description */
		if (selection !== undefined) {
			if (selection.length == 1) {
                var co = Rendition.UI.formatDate(grid.local[selection[0].rowIndex].data[2],'MM/DD/YYYY hh:nn:ss A');
                var mo = Rendition.UI.formatDate(grid.local[selection[0].rowIndex].data[3],'MM/DD/YYYY hh:nn:ss A');
                co = co.indexOf('NaN') !== -1 ? '' : co;
                mo = mo.indexOf('NaN') !== -1 ? '' : mo;
				div.innerHTML = '<div><b>Name:</b>' + grid.local[selection[0].rowIndex].data[0] + '</div>' +
				'<div><b>' + Rendition.Localization['FileManager_DetailBar_File_Size'].Title + '</b>' + grid.local[selection[0].rowIndex].data[1] + '</div>' +
				'<div><b>' + Rendition.Localization['FileManager_DetailBar_Type'].Title + '</b>' + grid.local[selection[0].rowIndex].data[4] + '</div>' +
				'<div><b>' + Rendition.Localization['FileManager_DetailBar_Created_On'].Title + '</b>' + co + '</div>' +
				'<div><b>' + Rendition.Localization['FileManager_DetailBar_Last_Modified_On'].Title + '</b>' + mo + '</div>';
			} else if (selection.length > 1) {
				div.innerHTML = '<div>' + Rendition.Localization['FileManager_x_files_selected_Total_of_x_bytes'].Title
                .replace('{0}',pane.selectedFiles.length).replace('{1}',totalSelectedSize) + '</div>' +
				'<div>' + Rendition.Localization['FileManager_x_folders_selected'].Title.replace('{0}',pane.selectedDirectories.length)  + '</div>';
			}
			enableButtons();
		}
		return false;
	}
	instance.init();
	return instance;
}