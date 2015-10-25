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
* Creates a DHTML info bubble that is absolutly positioned and z-indexed above everything.
* @constructor
* @name Rendition.UI.Info
* @param {Native.Integer} args Parameters for the info bubble.
* @param {Native.Integer} [args.hoverTimeout] How long the info bubble will stay on screen if the user hovers their mouse over it.  In miliseconds.
* @param {Native.Integer} [args.timeout] How long the info bubble will stay on screen.  In miliseconds.
* @param {DHTMLObject} [args.hover] When defined, when the user hovers over this object the info bubble will appear.  Events are appends to this object to facilitate this.  This value will cause [args.position] to not work.
* @param {Native.Object} [args.position] When defined the info bubble will appear in this position.  This value is not used when [args.hover] is defined.
* @param {Native.String} [args.title] The title of the info message.
* @param {Native.String} [args.message] The content of the info message.
* @example /// Open an info bubble in the top left corner that dissapears after 1.5 seconds. ///
*var foo = Rendition.UI.Info({
*	timeout: 1500,
*	position: {x:10,y:10},
*	title: 'Lorem ipsum.',
*	message: 'Duis autem vel eum iriure dolor.'
*});
* @example /// Create a dialog, create an input in the dialog and attach an info bubble to it explaining the field.///
*var foo = Rendition.UI.Dialog();
*var input = document.createElement('input');
*foo.content.appendChild(input);
*var bar = Rendition.UI.Info({
*	timeout: 1500,
*	hover: input,
*	title: 'Lorem ipsum.',
*	message: 'Duis autem vel eum iriure dolor.'
*});
*/
Rendition.UI.Info = function (args) {
	var instance = {}
	instance.content = document.createElement('div');
	instance.content.style.position = 'absolute';
	instance.content.style.zIndex = '1000000';
	instance.content.style.padding = '6px';
	instance.content.style.maxWidth = '450px';
	instance.content.className = 'ui-corner-all info';
	instance.timeout = 5000;
	instance.hoverTimeout = 600;

	if (args.hoverTimeout !== undefined) {
		instance.hoverTimeout = args.hoverTimeout;
	}
	if (args.timeout !== undefined) {
		instance.timeout = args.timeout;
	}
	instance.show = function () {
		if (args.hover) {
			var objPos = Rendition.UI.getPosition(args.hover);
			var objRect = Rendition.UI.getRect(args.hover);
		} else {
			var objPos = args.position;
			var objRect = { h: 0, w: 0, x: 0, y: 0 }
		}
		instance.content.style.left = '-5000px';
		instance.content.style.top = '-5000px';
		document.body.appendChild(instance.content);

		/* TODO: make sure the dialog does not fall off the page */
		var dest = { x: 0, y: 0, h: 0, w: 0 }
		var cw = document.documentElement.clientWidth;
		var ch = document.documentElement.clientHeight;
		dest.x = objPos.x + objRect.w;
		dest.y = objPos.y - instance.content.offsetHeight;
		if (dest.x < 0) {
			dest.x = 1
		}
		if (dest.x + instance.content.offsetWidth > cw) {
			dest.x = cw - instance.content.offsetWidth - 1;
		}
		if (dest.y < 0) {
			dest.y = 1
		}
		if (dest.y + instance.content.offsetHeight > ch) {
			dest.y = ch - instance.content.offsetHeight - 1;
		}

		instance.content.style.left = (dest.x) + 'px';
		instance.content.style.top = (dest.y) + 'px';

		if (!args.hover) {
			setTimeout(instance.hide, instance.timeout);
		}
	}
	instance.hide = instance.close = function () {
		try {
			document.body.removeChild(instance.content);
		} catch (err) {

		}
	}
	if (args.title === undefined) {
		args.title = '<img src="img/icons/information.png" alt="" style="float:left;margin-left:4px;margin-right:4px;">Information';
	}
	instance.content.innerHTML = '<h1 class="ui-corner-all" style="text-align:center;border:solid 1px #777;background:white;font-size:14px;margin:3px;padding:3px;">' +
	args.title + '</h1>' + args.message;
	if (args.hover) {
		Rendition.UI.appendEvent('mouseover', args.hover, function (e) {
			instance.hovertimer = setTimeout(instance.show, instance.hoverTimeout);
		}, false);
		Rendition.UI.appendEvent('mouseout', args.hover, function (e) {
			clearTimeout(instance.hovertimer);
			instance.hide();
		}, false);
	} else if (args.position) {
		instance.show();
	}
	Rendition.UI.appendEvent('mousedown', instance.content, function () {
		clearTimeout(instance.hovertimer);
		instance.hide();
	}, true);
	return instance;
}