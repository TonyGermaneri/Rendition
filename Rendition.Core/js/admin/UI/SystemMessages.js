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
* Requests messages from the server.  This is loop function for the client-server sync.
* @function
* @name Rendition.UI.systemMessage
* @memberOf Rendition.prototype
* @private
*/
Rendition.UI.systemMessage = function () {
    var req = [
		'GetMessages',
		[]
	]
    Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(),
    Rendition.systemMessageCallback, Rendition);
}
/**
* Callback for systemMessage.  Parses the system messages and sends 
* system message to the system message function and personal messages
* to the personal message function.
* If the dialog is already visible than reuse it.
* @function
* @name Rendition.systemMessageCallback
* @memberOf Rendition.prototype
* @private
*/
Rendition.UI.systemMessageCallback = function (e) {
    var a = JSON.parse(e.responseText);
    if (a.method1.error !== undefined) {
        alert(a.method1.description);
        setTimeout(Rendition.UI.systemMessage, Rendition.UI.clientServerSyncDelay);
        return;
    } else {
        /* run the callback messages */
        Rendition.showSystemMessage(a.method1.GetMessages);
        /* start the cycle again */
        setTimeout(Rendition.UI.systemMessage, Rendition.UI.clientServerSyncDelay);
        return;
    }
}
/**
* Uses <link xlink:href="Rendition.UI.Dialog"/> 
* to show and clear messages from the system.  
* If the dialog is already visible than reuse it.
* @function
* @name Rendition.showSystemMessage
* @param {Native.String} msg Message to show.
* @memberOf Rendition.prototype
* @private
*/
Rendition.UI.showSystemMessage = function (msg) {
    var l = msg.systemMessages.length;
    if (l > 0) {
        if (Rendition.systemMessageDialog === undefined) {
            Rendition.UI.systemMessagesReported = [];
            var c = { w: document.documentElement.clientWidth, h: document.documentElement.clientHeight }
            Rendition.systemMessageDialog = Rendition.UI.Dialog({
                title: Rendition.Localization['SystemMessages_System_Message'].Title,
                close: function (e, dialog) {
                    Rendition.systemMessageDialog = undefined;
                    Rendition.UI.setMessageRead(Rendition.UI.systemMessagesReported);
                    return;
                },
                rect: { x: parseInt(c.w / 2) - 300, y: 60, w: 600, h: 400 }
            });
            var la = document.createElement('div');
            Rendition.systemMessageDialog.logArea = la;
            Rendition.systemMessageDialog.content.style.overflow = 'scroll';
            Rendition.systemMessageDialog.content.style.overflowX = 'hidden';
            Rendition.systemMessageDialog.content.style.overflowY = 'scroll';
            Rendition.systemMessageDialog.content.style.background = 'white';
            Rendition.systemMessageDialog.content.appendChild(la);
        } else {
            var la = Rendition.systemMessageDialog.logArea;
        }
        for (var x = 0; l > x; x++) {
            var id = msg.systemMessages[x].id;
            if (Rendition.UI.systemMessagesReported.indexOf(id) != -1) {
                /* this message is already in the list */
                return;
            }
            Rendition.UI.systemMessagesReported.push(id);
            var ent = document.createElement('div');
            var dismiss = document.createElement('button');
            ent.style.padding = '4px';
            ent.style.fontSize = '10px';
            ent.style.margin = '4px';
            ent.className = 'ui-corner-all';
            ent.style.background = 'lightyellow';
            dismiss.style.margin = '4px';
            dismiss.style.cssFloat = 'right';
            dismiss.onclick = function () {
                Rendition.UI.setMessageRead([this.systemMessageId]);
                this.disabled = true;
            }
            dismiss.systemMessageId = msg.systemMessages[x].id;
            dismiss.innerHTML = Rendition.Localization['SystemMessages_Dismiss'].Title;
            ent.style.border = 'solid 1px #777';
            ent.style.padding = '4px';
            ent.innerHTML = Rendition.Localization['SystemMessages_Event_Time'].Title + msg.systemMessages[x].logTime +
			'<hr>' + msg.systemMessages[x].message;
            ent.insertBefore(dismiss, ent.firstChild);
            if (la.firstChild) {
                la.insertBefore(ent, la.firstChild);
            } else {
                la.appendChild(ent);
            }
        }
        return;
    }
}
/**
* Clear a message (let the system know you've read it).
* @function
* @name Rendition.UI.setMessageRead
* @param {Native.Array} messageIds MessageIds to clear.
* @memberOf Rendition.prototype
* @private
*/
Rendition.UI.setMessageRead = function (messageIds) {
    var req = [
		'SetMessageRead',
		[messageIds]
	]
    var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
        return;
    }, Rendition);
}