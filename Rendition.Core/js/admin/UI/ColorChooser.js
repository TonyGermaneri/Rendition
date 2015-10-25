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
* (Depricated) Uses <link xlink:href="Rendition.UI.Dialog"/> with a color chooser widget to fill an input.
* @constructor
* @public
* @param {Native.Object} args.input The DHTML input element to bind the widget to.
* @param {Native.Function} args.callbackProcedure The function to execute after the color has been selected.
* signature (String hexColor, String hexColorWithPoundPrefix, String colorChooser)
* @name Rendition.UI.ColorChooser
* @example /// Bind a color chooser to an input ///
* var foo = Rendition.UI.Dialog();
* var bar = document.createElement('input');
* foo.content.appendChild(bar);
* var unus = Rendition.UI.ColorChooser({
*	input: bar,
*	callbackProcedure: function (hexColor, hexColorWithPoundPrefix, colorChooser) {
*		bar.value = hexColor;
*	}
* });
*/
Rendition.UI.ColorChooser = function (args) {
	var instance = {}
	instance.type = 'RenditionColorChooser';
	if (args.callbackProcedure !== undefined) {
	    instance.callbackProcedure = args.callbackProcedure;
	}
	if (args.input !== undefined) {
	    instance.input = args.input;
	    instance.caller = args.input;
	}
	if (args.input !== undefined) {
	    if (!instance.input.style.originalWidth) {
	        instance.input.style.originalWidth = (instance.input.offsetWidth - 27) + 'px';
	    }
	    instance.input.style.width = instance.input.style.originalWidth;
	    instance.button = document.createElement('div');
	    instance.button.style.margin = '0 0 2px -1px';
	    instance.button.style.cssFloat = 'left';
	    instance.button.style.background = 'url(/admin/img/a_i_button.gif) no-repeat';
	    instance.button.style.height = '22px';
	    instance.button.style.width = '23px';
	    instance.button.style.padding = '0 0 0 3px';
	    instance.button.innerHTML = '<img style="margin:1px 0 0 0;vertical-align:middle;" src="/admin/img/icons/color_wheel.png">';
	    instance.input.style.cssFloat = 'left';
	    instance.input.parentNode.appendChild(instance.button);
	}
	instance.activate = function () {
	    instance.dialog = Rendition.UI.dialogWindow({
	        rect: { x: (document.documentElement.clientWidth / 2) - (440 / 2), y: (document.documentElement.clientHeight / 2) - (170 / 2), h: 170, w: 440 },
	        title: 'Select a Color',
	        id: instance.type,
	        modal: true,
	        modalCloseable: true
	    });
	    instance.sliderHolder = document.createElement('div');
	    instance.input = document.createElement('input');
	    instance.okButton = document.createElement('button');
	    instance.cancelButton = document.createElement('button');
	    instance.none = document.createElement('button');
	    instance.HTMLSwatch = document.createElement('button');
	    instance.HTMLSwatch.onclick = function () {
	        instance.swatchDialog = Rendition.UI.dialogWindow({
	            rect: { x: (document.documentElement.clientWidth / 2) - (326 / 2), y: (document.documentElement.clientHeight / 2) - (144 / 2), h: 144, w: 326 },
	            title: 'Select a Color',
	            id: instance.type,
	            modal: true,
	            modalCloseable: true
	        });
	        var ul = document.createElement('table');
	        ul.style.borderCollapse = 'collapse';
	        var cl = Rendition.UI.HTMLColorNames.length;
	        for (var x = 0; cl > x; x++) {
	            if (x % 20 === 0) {
	                var row = ul.insertRow(0);
	            }
	            var td = row.insertCell(0);
	            td.title = String(Rendition.UI.HTMLColorNames[x][0]);
	            td.style.backgroundColor = '#' + String(Rendition.UI.HTMLColorNames[x][1]);
	            td.colorIndex = String(x);
	            td.style.height = '14px';
	            td.style.width = '14px';
	            td.onmouseover = function () {
	                $(this).animate({ opacity: .8 });
	            }
	            td.onmouseout = function () {
	                $(this).animate({ opacity: 1 });
	            }
	            td.onclick = function () {
	                instance.hexColor = Rendition.UI.HTMLColorNames[this.colorIndex][1];
	                instance.swatchDialog.close();
	                instance.updateSliders();
	            }
	        }
	        instance.swatchDialog.content.appendChild(ul);
	    }
	    instance.PANTONESwatch = document.createElement('button');
	    instance.okButton.innerHTML = 'Ok';
	    instance.cancelButton.innerHTML = 'Cancel';
	    instance.HTMLSwatch.innerHTML = 'Swatch';
	    instance.none.innerHTML = 'None';
	    instance.input.style.margin = '0 5px 0 10px';
	    instance.input.style.width = '50px';
	    instance.cancelButton.style.margin = '5px';
	    instance.okButton.style.margin = '5px';
	    instance.none.style.margin = '5px';
	    instance.HTMLSwatch.style.margin = '5px';
	    instance.red = document.createElement('div');
	    instance.blue = document.createElement('div');
	    instance.green = document.createElement('div');
	    instance.swatch = document.createElement('div');
	    instance.red.className = 'red';
	    instance.blue.className = 'blue';
	    instance.green.className = 'green';
	    instance.red.style.margin = '5px';
	    instance.blue.style.margin = '5px';
	    instance.green.style.margin = '5px';
	    instance.sliderHolder.style.width = '67%';
	    instance.sliderHolder.style.height = '45px';
	    instance.sliderHolder.style.margin = '25px auto 0 25px';
	    instance.sliderHolder.style.fontSize = '.3em';
	    instance.sliderHolder.style.display = 'inline-block';
	    instance.swatch.style.display = 'inline-block';
	    instance.swatch.style.height = '50px';
	    instance.swatch.style.width = '50px';
	    instance.swatch.style.border = 'solid 1px black';
	    instance.swatch.style.margin = '0 10px 0 10px';
	    instance.sliderHolder.appendChild(instance.red);
	    instance.sliderHolder.appendChild(instance.green);
	    instance.sliderHolder.appendChild(instance.blue);
	    instance.dialog.content.appendChild(instance.sliderHolder);
	    instance.dialog.content.appendChild(instance.swatch);
	    instance.dialog.content.appendChild(instance.input);
	    instance.dialog.content.appendChild(instance.okButton);
	    instance.dialog.content.appendChild(instance.cancelButton);
	    instance.dialog.content.appendChild(instance.HTMLSwatch);
	    instance.dialog.content.appendChild(instance.none);
	    instance.refreshSwatch = function () {
	        var red = $(instance.red).slider('value');
	        var green = $(instance.green).slider('value');
	        var blue = $(instance.blue).slider('value');
	        var hex = Rendition.UI.hexFromRGB(red, green, blue);
	        instance.hexColor = hex;
	        instance.input.value = hex;
	        $(instance.swatch).css('background-color', '#' + hex);
	    }
	    instance.sliderOptions = {
	        orientation: 'horizontal',
	        range: 'min',
	        max: 255,
	        value: 127,
	        slide: instance.refreshSwatch,
	        change: instance.refreshSwatch
	    }
	    instance.input.onkeyup = function () {
	        var val = instance.input.value.replace('#', '');
	        if (val.match(/^#{0,1}[0-F][0-F][0-F][0-F][0-F][0-F]$|^#{0,1}[0-F][0-F][0-F]$/)) {
	            instance.hexColor = val;
	            instance.updateSliders();
	        }
	        return true;
	    }
	    $(instance.red).slider(instance.sliderOptions);
	    $(instance.blue).slider(instance.sliderOptions);
	    $(instance.green).slider(instance.sliderOptions);
	    $(instance.red).slider('value', 255);
	    $(instance.blue).slider('value', 140);
	    $(instance.green).slider('value', 60);
	    instance.cancelButton.onclick = function () {
	        instance.dialog.close();
	    }
	    instance.none.onclick = function () {
	        instance.hexColor = 'transparent';
	        instance.callback();
	        instance.dialog.close();
	    }
	    instance.okButton.onclick = function () {
	        instance.callback();
	        instance.dialog.close();
	    }
	    instance.callback = function () {
	        instance.hexColor = instance.hexColor.replace('#', '');
	        var hexAdd = '#';
	        if (instance.hexColor === 'transparent') {
	            hexAdd = '';
	        }
	        if (instance.callbackProcedure) {
	            instance.callbackProcedure.apply(instance, [instance.hexColor, hexAdd + instance.hexColor, instance]);
	        } else {
	            if (instance.input) {
	                instance.input.value = hexAdd + instance.hexColor;
	            }
	        }
	    }
	    instance.updateSliders = function () {
	        instance.hexColor = instance.hexColor.replace('#', '');
	        var color = Rendition.UI.RGBFromHex(instance.hexColor);
	        $(instance.red).slider('value', color.r);
	        $(instance.green).slider('value', color.g);
	        $(instance.blue).slider('value', color.b);
	    }
	    if (instance.input) {
	        if (instance.input.value.match(/^#{0,1}[0-F][0-F][0-F][0-F][0-F][0-F]$|^#{0,1}[0-F][0-F][0-F]$/)) {
	            if (instance.input.value.substring(1, 1) != '#') {
	                instance.input.value = '#' + instance.input.value;
	            }
	            instance.hexColor = instance.input.value;
	        }
	    }
	    instance.updateSliders();
	}
	if (args.input !== undefined) {
	    instance.button.onclick = function () {
	        instance.activate();
	    }
	} else {
	    instance.activate();
	}
	Rendition.UI.appendEvent('dblclick', instance.input, function () {
	    instance.activate();
	}, false);
}