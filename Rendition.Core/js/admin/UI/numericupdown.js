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
* Creates a DHTML based numeric up down widget that binds
* itself to a DHTML input element.  You can specifiy the
* increment, min, max repeat rate and more.
* @constructor
* @name Rendition.UI.NumericUpDown
* @param {Native.DHTMLElement} args.input The DHTML input element this <link xlink:href="Rendition.UI.NumericUpDown"/>.
* @param {Native.Float} [args.increment=1.00] The amount to increment by each time a button is pressed or each cycle when the button is held down.
* @param {Native.Integer} [args.repeatDelay=700] The delay before the button begins repetitiously incrementing.
* @param {Native.Integer} [args.repeatDelay=80] The rate the value will increment when the button is held down.
* @param {Native.Float} [args.min=-Infinity] The minimum value.
* @param {Native.Float} [args.max=Infinity] The maximum value.
* @example /// Bind a numericUpDown widget to an input ///
* var foo = Rendition.UI.Dialog();
* var bar = document.createElement('input');
* foo.content.appendChild(bar);
* Rendition.UI.NumericUpDown({
*	input: bar
* });
*/
Rendition.UI.NumericUpDown = function (args) {
	var instance = {}
	/**
	* The type of object. Returns RenditionNumericUpDown.
	* @name NumericUpDown.type
	* @memberOf Rendition.UI.NumericUpDown.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionNumericUpDown';
	/**
	* The unique id of this instance.
	* @name NumericUpDown.id
	* @memberOf Rendition.UI.NumericUpDown.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	if (args.input === undefined) { return null; }
	instance.input = args.input;
	instance.arrowHolder = document.createElement('div');
	instance.upArrow = document.createElement('div');
	instance.downArrow = document.createElement('div');
	instance.lastGoodValue = null;
	instance.increment = 1;
	instance.repeatDelay = 700;
	instance.repeatRate = 80;
	instance.min = -Infinity;
	instance.max = Infinity;
	if (Rendition.UI.isNumeric(args.increment)) {
		instance.increment = args.increment;
	}
	if (Rendition.UI.isNumeric(args.repeatDelay)) {
		instance.repeatDelay = args.repeatDelay;
	}
	if (Rendition.UI.isNumeric(args.repeatRate)) {
		instance.repeatDelay = args.repeatRate;
	}
	if (Rendition.UI.isNumeric(args.min)) {
		instance.min = args.min;
	}
	if (Rendition.UI.isNumeric(args.max)) {
		instance.max = args.max;
	}
	instance.input.style.cssFloat = 'left';
	instance.arrowHolder.style.cssFloat = 'left';
	instance.arrowHolder.style.width = '23px';
	instance.arrowHolder.style.height = '22px';
	instance.arrowHolder.style.padding = '0';
	instance.upArrow.style.height = '11px';
	instance.downArrow.style.height = '11px';
	instance.upArrow.style.width = '23px';
	instance.downArrow.style.width = '23px';
	instance.upArrow.style.background = 'url(/admin/img/a_i_arrowUp.gif) no-repeat';
	instance.downArrow.style.background = 'url(/admin/img/a_i_arrowDown.gif) no-repeat';
	instance.arrowHolder.appendChild(instance.upArrow);
	instance.arrowHolder.appendChild(instance.downArrow);
	Rendition.UI.appendEvent('keydown', instance.input, function (e) {
		var e = e || window.event;
		if (Rendition.UI.isNumericKey(e.keyCode)) {
			setTimeout(function () {
				instance.lastGoodValue = instance.input.value;
				instance.constrainValue();
			}, 0);
			return true;
		} else {
			return false;
		}
	}, false);
	/**
	* Used intnerally to make sure the value does not go over or under the min or max.
	* @function
	* @name NumericUpDown.constrainValue
	* @memberOf Rendition.UI.NumericUpDown.prototype
	* @type Native.Boolean
	* @private
	* @returns {Native.Boolean} If true the value is ok, if false the value is over or under the min or max value.
	*/
	instance.constrainValue = function () {
		if (String(instance.increment).match(/\.+/)) {
			/*floats WE ALL FLOAT DOWN HERE*/
			if (parseFloat(instance.lastGoodValue) > instance.max) {
				instance.lastGoodValue = instance.max;
				instance.input.value = instance.max;
				return false;
			}
			if (parseFloat(instance.lastGoodValue) < instance.min) {
				instance.lastGoodValue = instance.min;
				instance.input.value = instance.min;
				return false;
			}
		} else {
			/* ints */
			if (parseFloat(instance.lastGoodValue) > instance.max) {
				instance.lastGoodValue = instance.max;
				instance.input.value = instance.max;
				return false;
			}
			if (parseFloat(instance.lastGoodValue) < instance.min) {
				instance.lastGoodValue = instance.min;
				instance.input.value = instance.min;
				return false;
			}
		}
		return true;
	}
	instance.upArrow.onmouseout = function () {
		instance.upArrow.style.background = 'url(/admin/img/a_i_arrowUp.gif) no-repeat';
	}

	instance.downArrow.onmouseout = function () {
		instance.downArrow.style.background = 'url(/admin/img/a_i_arrowDown.gif) no-repeat';
	}

	instance.upArrow.onmouseover = function () {
		instance.upArrow.style.background = 'url(/admin/img/a_i_arrowUp_hover.gif) no-repeat';

	}
	instance.downArrow.onmouseover = function () {
		instance.downArrow.style.background = 'url(/admin/img/a_i_arrowDown_hover.gif) no-repeat';
	}
	instance.startmoveup = function () {
		if (!instance.constrainValue()) { return false }
		if (String(instance.increment).match(/\.+/)) {
			instance.lastGoodValue = parseFloat(instance.lastGoodValue) + parseFloat(instance.increment);
		} else {
			instance.lastGoodValue = parseInt(instance.lastGoodValue) + instance.increment;
		}
		instance.input.value = instance.lastGoodValue;
		instance.input.select();
		instance.timer = setTimeout(instance.startmoveup, instance.repeatRate);
	}
	instance.upArrow.onmousedown = function (e) {
		if (!instance.constrainValue()) { return false }
		if (String(instance.increment).match(/\.+/)) {
			instance.lastGoodValue = parseFloat(instance.lastGoodValue) + parseFloat(instance.increment);
		} else {
			instance.lastGoodValue = parseInt(instance.lastGoodValue) + instance.increment;
		}
		instance.input.value = instance.lastGoodValue;
		instance.input.select();
		instance.timer = setTimeout(instance.startmoveup, instance.repeatDelay);
		Rendition.UI.appendEvent('mouseup', document.body, function (e) {
			clearTimeout(instance.timer);
			Rendition.UI.removeEvent('mouseup', document.body, arguments.callee, false);
			instance.constrainValue()
			instance.input.select();
		}, false);
	}
	instance.startmovedown = function () {
		if (!instance.constrainValue()) { return false }
		if (String(instance.increment).match(/\.+/)) {
			instance.lastGoodValue = parseFloat(instance.lastGoodValue) - parseFloat(instance.increment);
		} else {
			instance.lastGoodValue = parseInt(instance.lastGoodValue) - instance.increment;
		}
		instance.input.value = instance.lastGoodValue;
		instance.input.select();
		instance.timer = setTimeout(instance.startmovedown, instance.repeatRate);
	}
	instance.downArrow.onmousedown = function (e) {
		if (!instance.constrainValue()) { return false }
		if (String(instance.increment).match(/\.+/)) {
			instance.lastGoodValue = parseFloat(instance.lastGoodValue) - parseFloat(instance.increment);
		} else {
			instance.lastGoodValue = parseInt(instance.lastGoodValue) - instance.increment;
		}
		instance.input.value = instance.lastGoodValue;
		instance.input.select();
		Rendition.UI.appendEvent('mouseup', document.body, function (e) {
			clearTimeout(instance.timer);
			Rendition.UI.removeEvent('mouseup', document.body, arguments.callee, false);
			instance.constrainValue()
			instance.input.select();
		}, false);
		instance.timer = setTimeout(instance.startmovedown, instance.repeatDelay)
	}
	instance.getConnected = function () {
		if (instance.input.parentNode) {
			instance.input.parentNode.appendChild(instance.arrowHolder);
		} else {
			setTimeout(instance.getConnected, Rendition.UI.waitToAttachTimeout);
		}
	}
	instance.init = function () {
		if (!instance.input.style.inputOffsetWidth) {
			instance.input.style.inputOffsetWidth = (instance.input.offsetWidth - 27) + 'px';
		}
		instance.input.style.width = instance.input.style.inputOffsetWidth;
		if (Rendition.UI.isNumeric(instance.input.value)) {
			instance.lastGoodValue = instance.input.value;
		} else {
			if (Rendition.UI.isNumeric(args.min)) {
				instance.lastGoodValue = args.min;
			} else {
				instance.lastGoodValue = 0;
			}
		}
		instance.input.value = instance.lastGoodValue;
		instance.constrainValue();
		instance.input.value = instance.lastGoodValue;
		instance.getConnected();
	}
	instance.init();
}