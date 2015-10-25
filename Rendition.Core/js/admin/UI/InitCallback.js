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
* Callback procedure for init.  
* Fires three events: C# event handler: startupProcedures
* and native event procedure onFinishedLoading.
* Handles main client side switch to turn on setup mode.
* Creates inital desktop and creates default styles for all widgets.
* @function
* @name Rendition.UI.initCallback
* @memberOf Rendition.prototype
* @param {Native.Object} e Response event object.
* @private
*/
Rendition.UI.initCallback = function (e) {
    if (e.status === 404 || e.status === 403) {
        /* the UI cannot communicate with the server so blah */
    } else {
        var a = JSON.parse(e.responseText);
        if (a.method1.error !== undefined) {
            /* an error occured during init */
            alert(a.method1.description);
            return;
        }
        var init = a.method1.Init;
        /* the order must be startupParameters, applyDefaultStyle, startupProcedure */
        if (init.startupParameters.length > 0) {
            /* check if init has any startup parameters to execute */
            Rendition.UI.parameters = $.extend(true, JSON.parse(init.startupParameters), Rendition.UI.parameters);
        }
        if (init.startupProcedures.length > 0) {
            /* check if init has a function to run */
            for (var x = 0; init.startupProcedures.length > x; x++) {
                var fn = new Function('Rendition', 'startupProcedure' + x, init.startupProcedures[x]);
                try {
                    fn.apply(Rendition, [Rendition, init]);
                } catch (ex) {
                    alert('Error in JavaScript event handler in Rendition.Core.dll onUIInit#startupProcedure:\n' + ex.message);
                }
            }
        }
        if (a.method1.Init.site) {
            /* normal */
            Rendition.Commerce.site = a.method1.Init.site;
            Rendition.Commerce.user = a.method1.Init.user;
            Rendition.Commerce.flagTypes = a.method1.Init.flagTypes;
            Rendition.Commerce.initData = a.method1.Init;
            /* start messaging service */
            setTimeout(Rendition.UI.systemMessage, Rendition.UI.clientServerSyncDelay);
        } else if (a.method1.Init.splash) {
            /* setup mode */
            Rendition.UI.initData = a.method1.Init;
        }
    }
    /* a style is required to continue */
    if (!Rendition.UI.parameters.preventDefaultStyle) {
        Rendition.UI.applyDefaultStyle();
    }
    /* bind the control input the the body */
    document.body.appendChild(Rendition.UI.controlInput);
    Rendition.UI.onFinishedLoading();
}