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
* Creates a DHTML based image viewer inside of a dialog.  This class uses RenditionDialog to create a simple image viewer
* with zoom and positioning controls.
* @constructor
* @name Rendition.UI.ImageViewer
* @param {Native.Object} args Parameters for the widget.
* @param {Native.DHTMLElement} [args.parentNode] You can bind the image viewer to any element.  When this parameter is not defined a dialog will be created.
* @param {Native.String} args.src The path to the image.
* @param {Native.String} args.title The title of the dialog.
* @param {Native.Function} [args.load] Optional procedure to execute when the image is finished loading.
* @example ///Create an image viewer.///
*var bar = Rendition.UI.ImageViewer({ src: 'http://upload.wikimedia.org/wikipedia/commons/6/6c/George_Boole.jpg' });
*/
Rendition.UI.ImageViewer = function (args) {
	var instance = {}
	instance.zoom = 1;
	/**
	* The type of object. Returns RenditionImageViewer.
	* @name ImageViewer.type
	* @memberOf Rendition.UI.ImageViewer.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionImageViewer';
	if (args === undefined) {
		args = {}
	}
	if (args.parentNode !== undefined) {
		instance.parentNode = args.parentNode;
	} else {
		instance.dialog = Rendition.UI.dialogWindow({
			rect: { x: (document.documentElement.clientWidth / 2) - 175, y: 105, h: 407, w: 350 },
			title: args.title || Rendition.Localization['ImageViewer_Image_Viewer'].Title
		});
		instance.parentNode = instance.dialog.content;
	}
	/**
	* The x (left) position of the image.
	* @name ImageViewer.x
	* @memberOf Rendition.UI.ImageViewer.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.x = 0;
	/**
	* The y (left) position of the image.
	* @name ImageViewer.y
	* @memberOf Rendition.UI.ImageViewer.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.y = 0;
	instance.parentNode.innerHTML = '';
	/**
	* The DIV DHTML element that contains the image.
	* @name ImageViewer.artboard
	* @memberOf Rendition.UI.ImageViewer.prototype
	* @type Native.String
	* @private
	* @property
	*/
	instance.artboard = document.createElement('div');
	/**
	* The DIV DHTML element that contains the info.
	* @name ImageViewer.info
	* @memberOf Rendition.UI.ImageViewer.prototype
	* @type Native.String
	* @private
	* @property
	*/
	instance.info = document.createElement('div');
	instance.info.style.background = 'white';
	instance.info.style.border = 'solid 1px black';
	instance.info.style.position = 'absolute';
	instance.info.style.top = '5px';
	instance.info.style.left = '5px';
	instance.info.style.padding = '3px';
	instance.info.style.fontSize = '11px';
	instance.info.textContent = '';
	instance.artboard.style.background = 'url(/admin/img/transparency.png)';
	/**
	* Used internally to resize the artboard to its parent element.
	* @function
	* @name ImageViewer.onresize
	* @memberOf Rendition.UI.ImageViewer.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.onresize = function () {
		instance.artboard.style.height = instance.parentNode.offsetHeight + 'px';
		instance.artboard.style.width = instance.parentNode.offsetWidth + 'px';
		return;
	}
	instance.artboard.style.overflow = 'scroll';
	Rendition.UI.wireupResizeEvents(instance.onresize, instance.parentNode);
	instance.img = new Image();
	instance.img.src = args.src;
	instance.img.style.marginTop = '5px';
	instance.img.style.marginLeft = '5px';
	instance.img.ondragstart = function () { return false; }
	instance.img.style.MozUserSelect = '-moz-none';
	instance.img.style.cursor = 'move';
	Rendition.UI.appendEvent('load', instance.img, function () {
		instance.originalWidth = instance.img.width;
		instance.originalHeight = instance.img.height;
		instance.finishedLoading = true;
		if (args.load) {
			args.load.apply(instance, [instance, instance.img]);
		}
	}, false);
	/**
	* Used internally to update the content of the info div.
	* @function
	* @name ImageViewer.updateTextContent
	* @memberOf Rendition.UI.ImageViewer.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.updateTextContent = function () {
		var x = ' ' + instance.img.style.width + ' X ' + instance.img.style.height +
		 '(' + instance.originalWidth + ' X ' + instance.originalHeight + ')';
		if (instance.img.style.width === undefined || instance.originalWidth === undefined) {
			x = '';
		}
		instance.info.textContent = 'x: ' + instance.x + ' y: ' + instance.y +
		 ' ' + (instance.zoom * 100).toFixed(2) + '% ' + x;


		return instance;
	}
	/**
	* Used internally to update the content of the info div.
	* @function
	* @name ImageViewer.moveImage
	* @memberOf Rendition.UI.ImageViewer.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.moveImage = function (e) {
		e = e || window.event;
		var mousePos = Rendition.UI.mouseCoords(e);
		instance.x = mousePos.x - instance.mouseOffset.x;
		instance.y = mousePos.y - instance.mouseOffset.y;
		instance.img.style.marginLeft = instance.x + 'px';
		instance.img.style.marginTop = instance.y + 'px';
		instance.updateTextContent();
	}
	Rendition.UI.appendEvent('mousedown', instance.img, function (e) {
		var e = e || window.event;
		instance.mouseOffset = Rendition.UI.mouseCoords(e);
		instance.mouseOffset.x -= instance.img.offsetLeft;
		instance.mouseOffset.y -= instance.img.offsetTop;
		Rendition.UI.appendEvent('mousemove', document.body, instance.moveImage, false);
		Rendition.UI.appendEvent('mouseup', document.body, function () {
			Rendition.UI.removeEvent('mousemove', document.body, instance.moveImage, false);
		}, false);
	});
	Rendition.UI.appendEvent('mouseover', instance.artboard, function (e) {
		Rendition.UI.appendEvent('DOMMouseScroll', window, instance.onmousewheel, false);
		window.onmousewheel = document.onmousewheel = instance.onmousewheel;
	}, false);
	Rendition.UI.appendEvent('mouseout', instance.artboard, function (e) {
		Rendition.UI.removeEvent('DOMMouseScroll', window, instance.onmousewheel, false);
		window.onmousewheel = function () { }
		document.onmousewheel = function () { }
	}, false);
	/**
	* Used internally to handle mouse wheel events on the 'artboard'.
	* @function
	* @name ImageViewer.onmousewheel
	* @memberOf Rendition.UI.ImageViewer.prototype
	* @private
	* @returns {Native.Object} undefined.
	*/
	instance.onmousewheel = function (e) {
		Rendition.UI.wheel(e, function (e) {
			if (e > 0) {
				instance.zoom += .05
			} else {
				instance.zoom -= .05
			}
			if (instance.zoom <= 0) {
				instance.zoom = .03
			}
			instance.img.style.height = (instance.originalHeight * instance.zoom) + 'px'
			instance.img.style.width = (instance.originalWidth * instance.zoom) + 'px'
		});
		instance.updateTextContent();
	}
	instance.updateTextContent();
	instance.artboard.appendChild(instance.img);
	instance.parentNode.appendChild(instance.artboard);
	instance.parentNode.appendChild(instance.info);
	instance.onresize();
	return instance;
}