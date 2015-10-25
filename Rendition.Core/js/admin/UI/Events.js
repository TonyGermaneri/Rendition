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
* Handles mouse wheel events.
* @function
* @private
* @name Rendition.UI.wheel
* @param {Native.Object} event The browser event object.
* @param {Native.Object} eventProc The function to execute.  Signature (Integer delta).
* @returns {Native.undefined}
*/
Rendition.UI.wheel = function (event, eventProc) {
	var delta = 0;
	if (!event) {
	    event = window.event;
	}
	if (event.wheelDelta) {
	    delta = event.wheelDelta / 120;
	    if (window.opera) {
	        delta = -delta;
	    }
	} else if (event.detail) {
	    delta = -event.detail / 3;
	}
	if (delta) {
	    eventProc.apply(this, [delta])
	}
	if (event.preventDefault) {
	    event.preventDefault();
	}
	event.returnValue = false;
}
/**
* Check if the keyCode is a valid key in an numeric input field. 
* @function
* @public
* @name Rendition.UI.isNumericKey
* @param {Native.Integer} keyCode the keyCode of the key event.
* @returns {Native.Boolean} true if a key with a number on it was pressed.
*/
Rendition.UI.isNumericKey = function (keyCode) {
	/* keys with valid numbers - keys on the second line are not numbers but valid (like arrows) */
	var vNum = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
				110, 190, 37, 38, 39, 40, 33, 34, 35, 36, 45, 46, 16, 8];
	if (vNum.indexOf(keyCode) > -1) {
	    return true;
	}
	return false;
}
/**
* Cross browser remove event.
* @function
* @public
* @name Rendition.UI.removeEvent
* @param {Native.String} type Event name. E.g.: resize, close etc.
* @param {Native.Object} listener The object to unsubscribe from.
* @param {Native.Function} removedFunction The function to remove.
* @param {Native.Boolean} capture The capture phase.
* @returns {Native.undefined}
*/
Rendition.UI.removeEvent = function (type, listener, removedFunction, capture) {
	if (listener) {
	    if (listener.removeEventListener) {
	        listener.removeEventListener(type, removedFunction, capture);
	    } else if (listener.detachEvent) {
	        listener.detachEvent('on' + type, removedFunction);
	    } else {
	        alert('Can\'t unattach event from listener!');
	    }
	} else {
	    alert('No object to detach from for event on' + type);
	}
}
/**
* Cross browser append event.
* @function
* @public
* @name Rendition.UI.appendEvent
* @param {Native.String} type Event name. E.g.: resize, close etc.
* @param {Native.Object} listener The object to subscribe to.
* @param {Native.Function} appendedFunction The function to append.
* @param {Native.Boolean} capture The capture phase.
* @returns {Native.undefined}
*/
Rendition.UI.appendEvent = function (type, listener, appendedFunction, capture) {
	if (listener) {
	    if (listener.addEventListener) {
	        try {
	            listener.addEventListener(type, appendedFunction, capture);
	        } catch (e) {
	            debugger;
	        }
	    } else if (listener.attachEvent) {
	        listener.attachEvent('on' + type, appendedFunction);
	    }
	}
}
/**
* Prevents moving the cursor from an input or textarea when tab is pressed
* and adds a tab charater to the field at the cursor position.
* @function
* @public
* @name Rendition.UI.allowTabCharacter
* @param {Native.Object} e Browser event object.
* @returns {Native.undefined}
*/
Rendition.UI.AllowTabCharacter = function (e) {
	var event = e || window.event;
	if (event != null) {
	    if (event.srcElement) {
	        if (event.srcElement.value) {
	            if (event.keyCode === 9) {  // tab character
	                if (document.selection != null) {
	                    document.selection.createRange().text = '\t';
	                    event.returnValue = false;
	                } else {
	                    event.srcElement.value += '\t';
	                    return false;
	                }
	            }
	        }
	    }
	}
}
/**
* Gets the mouse coordinates from the browser event.  
* @function
* @public
* @name Rendition.UI.mouseCoords
* @param {Native.Object} ev The browser event object.
* @returns {Native.Object} { x: Integer, y: Integer }
*/
Rendition.UI.mouseCoords = function (ev) {
	return {
	    x: ev.clientX, y: ev.clientY
	}
}
/**
* Attach a procedure to an event.
* @function
* @name Rendition.UI.addEventListener
* @memberOf Rendition.prototype
* @type Native.undefined
* @param {Native.String} type The type of event to subscribe to.
* @param {Native.Function} proc The function to call when the event is fired.
* @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
* @public
*/
Rendition.UI.addEventListener = function (type, proc, capture) {
	if (type == 'finishedLoading') {
	    Rendition.UI.e_finishedloading.push(proc);
	}
}
/**
* Find the first acceptable parent node to attach a close event to. 
* @function
* @private
* @param {Native.Object} closeProc The close procedure.
* @param {Native.DHTMLElement} f The parent object.
* @name Rendition.UI.wireupCloseEvents
*/
Rendition.UI.wireupCloseEvents = function (closeProc, f) {
	var windowId = null;
	while (f.parentNode !== undefined) {
	    var g = f.getAttribute('windowId');
	    if (g !== undefined) {
	        windowId = g;
	        break;
	    }
	    f = f.parentNode;
	}
	var l = Rendition.UI.dialogs.length;
	for (var x = 0; l > x; x++) {
	    if (windowId == Rendition.UI.dialogs[x].id) {
	        Rendition.UI.dialogs[x].addEventListener('close', closeProc, false);
	        break;
	    }
	}
}
/**
* Find the first acceptable parent node to attach 
* a resize event to, or remove the event.
* @function
* @private
* @param {Native.Function} resizeProc The resize procedure.
* @param {Native.DHTMLElement} f The parent object.
* @param {Native.Boolean} remove remove the function.
* @name Rendition.UI.wireupResizeEvents
*/
Rendition.UI.wireupResizeEvents = function (resizeProc, f, remove) {
	var windowId = null;
	var cutterId = null;
	var groupboxId = null;
	var tabBarTabId = null;
	while (f.parentNode !== null) {
	    var t = f.getAttribute('tabBarTabId');
	    var g = f.getAttribute('windowId');
	    var c = f.getAttribute('cutterId');
	    var b = f.getAttribute('groupboxId');
	    if (g !== null) {
	        windowId = g;
	        break;
	    }
	    if (c !== null) {
	        cutterId = c;
	        break;
	    }
	    if (b !== null) {
	        groupboxId = b;
	        break;
	    }
	    if (t !== null) {
	        tabBarTabId = t;
	        break;
	    }
	    f = f.parentNode;
	}
	if (cutterId !== null) {
	    var l = Rendition.UI.cutterBars.length;
	    for (var x = 0; l > x; x++) {
	        if (cutterId === Rendition.UI.cutterBars[x].id) {
	            if (remove) {
	                Rendition.UI.cutterBars[x].removeEventListener('resize', resizeProc, false);
	            } else {
	                Rendition.UI.cutterBars[x].addEventListener('resize', resizeProc, false);
	            }
	            break;
	        }
	    }
	} else if (tabBarTabId !== null) {
	    var l = Rendition.UI.tabBarTabs.length;
	    for (var x = 0; l > x; x++) {
	        if (tabBarTabId === Rendition.UI.tabBarTabs[x].id) {
	            if (remove) {
	                Rendition.UI.tabBarTabs[x].removeEventListener('resize', resizeProc, false);
	            } else {
	                Rendition.UI.tabBarTabs[x].addEventListener('resize', resizeProc, false);
	            }
	            break;
	        }
	    }
	} else if (groupboxId !== null) {
	    var l = Rendition.UI.groupBoxes.length;
	    for (var x = 0; l > x; x++) {
	        if (groupboxId === Rendition.UI.groupBoxes[x].id) {
	            if (remove) {
	                Rendition.UI.groupBoxes[x].removeEventListener('resize', resizeProc, false);
	            } else {
	                Rendition.UI.groupBoxes[x].addEventListener('resize', resizeProc, false);
	            }
	            break;
	        }
	    }
	} else {
	    var l = Rendition.UI.dialogs.length;
	    for (var x = 0; l > x; x++) {
	        if (windowId === Rendition.UI.dialogs[x].id) {
	            if (remove) {
	                Rendition.UI.dialogs[x].removeEventListener('resize', resizeProc, false);
	            } else {
	                Rendition.UI.dialogs[x].addEventListener('resize', resizeProc, false);
	            }
	            break;
	        }
	    }
	}
}
/**
* Get the mouse offset reletive to an object
* @function
* @public
* @name Rendition.UI.getMouseOffset
* @param {Native.Object} target The DHTML element.
* @param {Native.Object} ev The browser event object.
* @returns {Native.Object} { x: Integer, y: Integer }
*/
Rendition.UI.getMouseOffset = function (target, ev) {
	ev = ev || window.event;
	var docPos = Rendition.UI.getPosition(target);
	var mousePos = Rendition.UI.mouseCoords(ev);
	return { x: mousePos.x - docPos.x, y: mousePos.y - docPos.y }
}
/**
* Takes a URL with query string and sends it using the POST method to a
* new window.  Mostly used for downloading files that are the result of
* an invocation.
* @function
* @public
* @name Rendition.UI.postToNewWindow
* @param {Native.String} urlWithPram The entire URL with query string.
* @param {Native.String} [targetBlank='_blank'] Name of the target window.
* @returns {Native.undefined}
*/
Rendition.UI.postToNewWindow = function (urlWithPram, targetBlank) {
	var url = urlWithPram.split('?')[0];
	var params = urlWithPram.split('?')[1].split('&');
	var pLength = params.length;
	var form = document.createElement('form');
	for (var x = 0; pLength > x; x++) {
	    var key = params[x].split("=")[0];
	    var value = params[x].split("=")[1];
	    var i = document.createElement('textarea');
	    i.name = key;
	    i.value = String(value);
	    form.appendChild(i);
	}
	form.action = url;
	form.method = 'POST';
	if (targetBlank == false || targetBlank === undefined) {
	    form.target = '_blank';
	}
	form.style.visiblity = 'hidden';
	form.style.display = 'none';
	document.body.appendChild(form);
	form.submit();
}