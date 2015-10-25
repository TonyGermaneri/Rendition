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
* Style of the <link xlink:href="Rendition.UI.TaskBar"/>.  The default
* style of the <link xlink:href="Rendition.UI.GridStyle"/> 
* is Rendition.UI.taskStyle.
* @constructor
* @name Rendition.UI.TaskBarStyle
*/
Rendition.UI.TaskBarStyle = function() {
	var instance = {}
	/**
	* The unique id of this instance.
	* @name TaskBarStyle.id
	* @memberOf Rendition.UI.TaskBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget.  Returns RenditionTaskBarStyle.
	* @name TaskBarStyle.type
	* @memberOf Rendition.UI.TaskBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionTaskBarStyle';
	/**
	* This rect represents the height of the <link xlink:href="Rendition.UI.TaskBar"/>.
	* Looks like { x: 0, y: 0, h: 20, w: 0 }.
	* @name TaskBarStyle.rect
	* @memberOf Rendition.UI.TaskBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.rect = { x: 0, y: 0, h: 20, w: 0 }
	/**
	* the CSS background property of the taskbar.
	* @name TaskBarStyle.background
	* @memberOf Rendition.UI.TaskBarStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.background = 'grey';
	/**
	* The horizontal spacing in PX between <link xlink:href="Rendition.UI.TaskBarElement"/> elements.
	* @name TaskBarStyle.horizontalSpacing
	* @memberOf Rendition.UI.TaskBarStyle.prototype
	* @type Native.Integer
	* @public
	* @property
	*/
	instance.horizontalSpacing = 4;
	instance.maxWindowWidthDiv = 1.5
	return instance;
}
/**
* Creates a DHTML task bar.  The <link xlink:href="Rendition.UI.TaskBar"/> consists of
* an array of <link xlink:href="Rendition.UI.TaskBarElement"/> elements.
* The task bar is created automatically by the <link xlink:href="Rendition.UI.Desktop"/> widget
* each time a <link xlink:href="Rendition.UI.Dialog"/> is created.
* @constructor
* @name Rendition.UI.TaskBar
* @param {Native.Object} f_objDesktop The <link xlink:href="Rendition.UI.Desktop"/> to append this <link xlink:href="Rendition.UI.TaskBar"/> to.
* @param {Native.Object} f_objTaskBarStyle The <link xlink:href="Rendition.UI.TaskBarStyle"/> to append this <link xlink:href="Rendition.UI.TaskBar"/> to.
* @param {Native.Object} f_objTaskBarStyle The <link xlink:href="Rendition.UI.TaskBarElementStyle"/> to use when rendering
* this <link xlink:href="Rendition.UI.TaskBar"/>'s <link xlink:href="Rendition.UI.TaskBarElement"/>.
*/
Rendition.UI.TaskBar = function (f_objDesktop, f_objTaskBarStyle, f_objTaxBarElementStyle) {
    var instance = {}
    instance.elements = [];
    /**
    * unique id of this object.  Assigned automatcilly in this reg format /uid_UUID/
    * @name TaskBar.id
    * @memberOf Rendition.UI.TaskBar.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.id = 'uid_' + Rendition.UI.createId();
    /**
    * The type of object.  returns 'RenditionTaskBar'
    * @name TaskBar.type
    * @memberOf Rendition.UI.TaskBar.prototype
    * @type Native.String
    * @public
    * @property
    */
    instance.type = 'RenditionTaskBar';
    /**
    * The index of this taskBar in Rendition.UI.taskBars array.
    * @name TaskBar.index
    * @memberOf Rendition.UI.TaskBar.prototype
    * @type Native.Integer
    * @public
    * @property
    */
    instance.index = Rendition.UI.taskBars.length;
    Rendition.UI.taskBars.push(instance);
    /**
    * The currently applied <link xlink:href="Rendition.UI.TaskBarStyle"/>.
    * @name TaskBar.style
    * @memberOf Rendition.UI.TaskBar.prototype
    * @type Native.String
    * @public
    * @property
    */
    if (f_objTaskBarStyle) {
        instance.style = f_objTaskBarStyle;
    } else {
        instance.style = Rendition.UI.taskStyle;
    }
    if (f_objTaxBarElementStyle) {
        instance.taskElementStyle = f_objTaxBarElementStyle;
    } else {
        instance.taskElementStyle = Rendition.UI.taskElementStyle;
    }
    instance.leftOffset = 0;
    /**
    * The content DHTML DIV element.
    * @name TaskBar.content
    * @memberOf Rendition.UI.TaskBar.prototype
    * @type Native.DHTMLElement
    * @private
    * @property
    */
    instance.content = document.createElement('div');
    instance.content.style.position = 'fixed';
    instance.content.style.background = instance.style.background;
    instance.content.style.bottom = '0';
    instance.content.style.left = instance.style.rect.x + 'px';
    instance.content.style.width = instance.style.rect.x + document.documentElement.clientWidth + 'px';
    instance.content.style.height = instance.style.rect.h + 'px';
    if (f_objDesktop) {
        f_objDesktop.addTaskBar(instance);
    } else {
        document.body.appendChild(instance.content);
    }
    /**
    * Refreshes all the <link xlink:href="Rendition.UI.TaskBarElement"/> entries in the task bar.
    * @function
    * @name TaskBar.refreshTaskElements
    * @memberOf Rendition.UI.TaskBar.prototype
    * @public
    * @returns {Native.Boolean} false.
    */
    instance.refreshTaskElements = function () {
        instance.content.innerHTML = '';
        instance.elements = [];
        instance.maxWindowWidth = (document.documentElement.clientWidth / Rendition.UI.dialogs.length) / instance.style.maxWindowWidthDiv;
        instance.leftOffset = 0;
        var wLength = Rendition.UI.dialogs.length;
        for (var x = 0; x < wLength; x++) {
            Rendition.UI.dialogs[x].index = x;
            Rendition.UI.dialogs[x].taskElement = instance.addTaskElement(Rendition.UI.dialogs[x], instance.taskElementStyle);
        }
        return false;
    }
    /**
    * Adds a new <link xlink:href="Rendition.UI.TaskBarElement"/> to this <link xlink:href="Rendition.UI.TaskBar"/>.
    * Used by <link xlink:href="Rendition.UI.Desktop"/>.
    * @function
    * @name TaskBar.addTaskElement
    * @memberOf Rendition.UI.TaskBar.prototype
    * @private
    * @returns {Native.Boolean} false.
    */
    instance.addTaskElement = function (dialogWindow, elementStyle) {
        var tElement = Rendition.UI.TaskBarElement(dialogWindow, instance, elementStyle);
        instance.elements.push(tElement);
        return tElement;
    }
    instance.resize = function () {
        instance.content.style.bottom = '0';
        instance.content.style.width = instance.style.rect.x + document.documentElement.clientWidth + 'px';
        instance.refreshTaskElements();
    }
    Rendition.UI.appendEvent('resize', window, instance.resize, false);
    Rendition.UI.appendEvent('scroll', window.document, instance.resize, false);
    Rendition.UI.appendEvent('scroll', window, instance.resize, false);
    return instance;
}