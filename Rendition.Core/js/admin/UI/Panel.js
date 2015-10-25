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
* Style of the panel.
* @constructor
* @name Rendition.UI.PanelStyle
*/
Rendition.UI.PanelStyle = function () {
    var instance = {}
    //general
    instance.panelBackground = '#CCC';
    instance.panelBorderRight = '3px outset #FFF';
    instance.panelRect = { x: 0, y: 0, h: 0, w: 210 }
    instance.panelPadding = { t: 5, r: 0, b: 0, l: 10 }
    //item
    instance.panelItemFontSize = '14px';
    instance.panelItemFontColor = '#333';
    instance.panelItemAlignment = 'left';
    instance.panelItemHoverColor = 'white';
    instance.panelItemHoverBackground = 'transparent';
    instance.panelItemBackground = 'transparent';
    instance.panelItemRect = { x: 10, y: 0, h: 18, w: 200 }
    instance.panelItemIconRect = { x: 0, y: 0, h: 16, w: 16 }
    instance.panelItemIconMargin = { t: 0, r: 3, b: 0, l: 0 }
    instance.panelItemBorder = 'solid 1px transparent';
    instance.panelItemFontFamily = 'Arial, Helvetica, sans-serif';
    //header
    instance.panelHeaderBackground = 'transparent';
    instance.panelHeaderFontSize = '18px';
    instance.panelHeaderFontColor = '#444';
    instance.panelHeaderRect = { x: 0, y: 0, h: 45, w: 200 };
    instance.panelHeaderAlignment = 'left';
    instance.panelHeaderFontFamily = 'Arial, Helvetica, sans-serif';
    //seperator
    instance.seperatorRect = { x: 0, y: 0, h: 2, w: 200 }
    instance.seperatorBackground = 'transparent';
    instance.seperatorBorderBottom = 'solid 1px transparent';
    instance.seperatorBorderTop = 'solid 1px black';
    // toggle
    instance.toggleBackgroundOpen = 'url(/admin/img/arrow_black_down.gif) no-repeat';
    instance.toggleBackgroundClose = 'url(/admin/img/arrow_black_right.gif) no-repeat';
    instance.toggleBorder = 'none';
    instance.toggleRect = { x: 0, y: 7, h: 10, w: 10 }
    instance.resizeMargin = 10;
    instance.boxShadow = '2px -2px 2px #AAA';
    return instance;
}
/**
* Creates a DHTML based panel for use as a control panel on the left side of the UI desktop.
* @constructor
* @name Rendition.UI.Panel
* @param {Native.Object} [args] Parameters for the dialog.
* @param {Native.Boolean} [args.items] items array.  Used to populate the panel with items.
*/
Rendition.UI.Panel = function (args) {
    args = args || {}
    var instance = {}
    instance.style = args.style || Rendition.UI.PanelStyle();
    instance.resizeMargin = instance.style.resizeMargin;
    instance.resize = function () {
        if (instance.panel) {
            var s = instance.style;
            var w = document.documentElement.clientWidth;
            var h = document.documentElement.clientHeight;
            instance.panel.style.height = (h + s.panelRect.y - s.panelPadding.t) + 'px';
        }
    }
    instance.panelMouseMove = function (e) {
        //if the mouse is over the edge of the panel show the resize cursor and ready to move
        var m = Rendition.UI.mouseCoords(e);
        var s = instance.style;
        // panel is moving
        if (instance.moving) {
            if (m.x > (instance.panel.offsetWidth - instance.resizeMargin)) {
                // very close to fully open
                instance.open();
            } else if (m.x < instance.resizeMargin) {
                // very close to closing
                instance.close();
            } else {
                // something in between
                instance.panel.style.left = (m.x - instance.panel.offsetWidth) + 'px';
            }
        } else {
            // not currently moving so get ready to
            var rightSide = instance.panel.offsetLeft + instance.panel.offsetWidth;
            if (m.x > (rightSide - instance.resizeMargin) && m.x < (rightSide + instance.resizeMargin)) {
                instance.readyToMove = true;
                document.body.style.cursor = 'e-resize';
            } else {
                instance.readyToMove = false;
                document.body.style.cursor = 'inherit';
            }
        }
    }
    instance.close = function () {
        instance.panel.style.left = ((instance.panel.offsetWidth * -1) + instance.resizeMargin) + 'px';
    }
    instance.open = function () {
        instance.panel.style.left = '0px';
    }
    instance.toggle = function () {
        // if the cursor is in the resize position, clicks mean toggle open/close
        if (instance.readyToMove) {
            if ((instance.startOffsetLeft * -1) > (instance.panel.offsetWidth - (instance.resizeMargin * 2))) {
                instance.open();
            } else {
                instance.close();
            }
        }
    }
    instance.stopMoving = function () {
        if (instance.moving) {
            document.body.style.cursor = 'inherit';
            instance.moving = false;
        }
    }
    instance.startMoving = function () {
        instance.startOffsetLeft = instance.panel.offsetLeft;
        if (instance.readyToMove) {
            document.body.style.cursor = 'e-resize';
            instance.moving = true;
        }
    }
    instance.panelClick = function () {
        if (instance.readyToMove) {
            instance.toggle();
        }
    }
    instance.refresh = function () {
        var s = instance.style;
        if (!instance.panel) {
            instance.panel = document.createElement('div');
            Rendition.UI.makeUnselectable(instance.panel);
            instance.panel.setAttribute('expanded', '1');
            instance.panel.style.width = s.panelRect.w + 'px';
            instance.panel.style.overflow = 'auto';
            instance.panel.style.background = s.panelBackground;
            instance.panel.style.position = 'fixed';
            instance.panel.style.boxShadow = s.boxShadow;
            instance.panel.style.top = s.panelRect.y + 'px';
            instance.panel.style.left = s.panelRect.x + 'px';
            instance.panel.style.paddingTop = s.panelPadding.t + 'px';
            instance.panel.style.paddingRight = s.panelPadding.r + 'px';
            instance.panel.style.paddingBottom = s.panelPadding.b + 'px';
            instance.panel.style.paddingLeft = s.panelPadding.l + 'px';
            instance.panel.style.borderRight = s.panelBorderRight;
            Rendition.UI.appendEvent('mousemove', window, instance.panelMouseMove, false);
            Rendition.UI.appendEvent('mousedown', window, instance.startMoving, false);
            Rendition.UI.appendEvent('mouseup', window, instance.stopMoving, false);
            Rendition.UI.appendEvent('click', window, instance.toggle, false);
            document.body.appendChild(instance.panel);
            if (args.hidden) {
                instance.close();
            }
        }
        instance.panel.innerHTML = '';
        instance.resize();
        /* append items structure */
        if (args.items) {
            var currentParent = undefined;
            for (var x = 0; args.items.length > x; x++) {
                var i = args.items[x];
                var item = document.createElement(i.link ? 'a' : 'div');
                var icon = document.createElement('div');
                if (currentParent != undefined) {
                    if (currentParent.getAttribute('expanded') == '0') {
                        item.style.display = 'none';
                        item.style.visibility = 'hidden';
                    }
                }
                if (i.link) {
                    item.href = i.link;
                    item.style.display = 'inline-block';
                }
                icon.style.background = 'url(' + (i.iconImage || i.src) + ') no-repeat 0 0';
                icon.style.height = s.panelItemIconRect.h + 'px';
                icon.style.width = s.panelItemIconRect.w + 'px';
                icon.style.display = 'inline-block';
                icon.style.marginTop = s.panelItemIconMargin.t + 'px';
                icon.style.marginRight = s.panelItemIconMargin.r + 'px';
                icon.style.marginBottom = s.panelItemIconMargin.b + 'px';
                icon.style.marginLeft = s.panelItemIconMargin.l + 'px';
                if (i.background !== undefined) {
                    item.style.background = i.background;
                }
                if (i.cursor) {
                    item.style.cursor = i.cursor;
                } else if (i.onclick || i.ondblclick || i.onmousedown || i.src || i.link) {
                    item.style.cursor = 'pointer';
                } else {
                    item.style.cursor = 'default';
                }
                item.onclick = i.onclick || i.proc;
                item.onmouseover = i.onmouseover;
                item.onmousedown = i.onmousedown;
                item.onmouseup = i.onmouseup;
                item.onmouseout = i.onmouseout;
                item.ondblclick = i.ondblclick;
                item.onmousemove = i.onmousemove;
                item.title = (i.message || i.title || '');
                if (currentParent !== undefined && (!i.header)) {
                    currentParent.appendChild(item);
                } else {
                    instance.panel.appendChild(item);
                }
                if (i.header) {
                    // each subsiquent item should be placed within this item until the next header
                    currentParent = item;
                    var toggle = document.createElement('button');
                    var itemTextHolder = document.createElement('span');
                    if (i.expanded === true || i.expanded === undefined) {
                        toggle.style.background = instance.style.toggleBackgroundOpen;
                        item.setAttribute('expanded', '1');
                    } else {
                        toggle.style.background = instance.style.toggleBackgroundClose;
                        item.setAttribute('expanded', '0');
                    }
                    toggle.style.height = instance.style.toggleRect.h + 'px';
                    toggle.style.width = instance.style.toggleRect.w + 'px';
                    toggle.style.marginTop = instance.style.toggleRect.y + 'px';
                    toggle.style.marginLeft = instance.style.toggleRect.x + 'px';
                    toggle.style.cssFloat = 'left';
                    toggle.style.border = instance.style.toggleBorder;
                    toggle.toggle = toggle;
                    itemTextHolder.toggle = toggle;
                    Rendition.UI.appendEvent('click', toggle, instance.toggleHeader, true);
                    Rendition.UI.appendEvent('click', itemTextHolder, instance.toggleHeader, true);
                    toggle.style.cursor = 'pointer';
                    item.style.cursor = 'pointer';
                    item.appendChild(toggle);
                    itemTextHolder.appendChild(document.createTextNode(i.title || i.text));
                    item.appendChild(itemTextHolder);
                    item.style.fontSize = s.panelHeaderFontSize;
                    item.style.color = s.panelHeaderFontColor;
                    item.style.textAlign = s.panelHeaderAlignment;
                    item.style.background = s.panelHeaderBackground;
                    item.style.marginTop = s.panelHeaderRect.y + 'px';
                    item.style.marginLeft = s.panelHeaderRect.x + 'px';
                    item.style.width = s.panelHeaderRect.w + 'px';
                    item.style.fontFamily = s.panelHeaderFontFamily;
                } else if (i.seperator) {
                    item.style.borderBottom = s.seperatorBorderBottom;
                    item.style.borderTop = s.seperatorBorderTop;
                    item.style.background = s.seperatorBackground;
                    item.style.marginTop = s.seperatorRect.y + 'px';
                    item.style.marginLeft = s.seperatorRect.x + 'px';
                    item.style.width = s.seperatorRect.w + 'px';
                    item.style.height = s.seperatorRect.h + 'px';
                } else {
                    item.appendChild(icon);
                    item.appendChild(document.createTextNode(i.title || i.text));
                    item.style.userSelect = 'none';
                    item.style.fontSize = s.panelItemFontSize;
                    item.style.color = s.panelItemFontColor;
                    item.style.textAlign = s.panelItemAlignment;
                    item.style.background = s.panelItemBackground;
                    item.style.marginTop = s.panelItemRect.y + 'px';
                    item.style.marginLeft = s.panelItemRect.x + 'px';
                    item.style.width = s.panelItemRect.w + 'px';
                    item.style.fontFamily = s.panelItemFontFamily;
                    Rendition.UI.appendEvent('mouseover', item, function () {
                        this.style.background = s.panelItemHoverBackground;
                        this.style.color = s.panelItemHoverColor;
                    }, false);
                    Rendition.UI.appendEvent('mouseout', item, function () {
                        this.style.background = s.panelItemBackground;
                        this.style.color = s.panelItemFontColor;
                    }, false);
                }
            }
        }
    }
    instance.toggleHeader = function (e) {
        var f = this.toggle;
        var visify = function (obj, un) {
            var l = obj.childNodes.length;
            for (var x = 0; l > x; x++) {
                var i = obj.childNodes[x];
                if (i.tagName === 'DIV' || i.tagName === 'A') {
                    i.style.display = un ? (i.tagName === 'A' ? 'block' : 'inline-block') : 'none';
                    i.style.visibility = un ? 'visible' : 'hidden';
                }
            }
        }
        if (f.parentNode.getAttribute('expanded') == '0') {
            f.parentNode.setAttribute('expanded', '1');
            visify(f.parentNode, true);
            f.style.background = instance.style.toggleBackgroundOpen;
        } else {
            f.parentNode.setAttribute('expanded', '0');
            visify(f.parentNode, false);
            f.style.background = instance.style.toggleBackgroundClose;
        }
        e.cancelBubble = true;
    }
    instance.init = function () {
        Rendition.UI.appendEvent('resize', window, instance.resize, false);
        instance.refresh();
        return instance;
    }
    instance.init();
}