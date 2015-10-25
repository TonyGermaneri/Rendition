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
* Creates a DHTML based confimation dialog.  Confirm dialog creates a dialog with two buttons by default, ok and cancel.
* You can bind procedures to these default buttons or you can add your own buttons, replacing the default buttons.
* This class may appear to have events but it does not have an addEventListener method.  The only
* way to bind to the default buttons is by using the [args.ontrue] or [args.onfalse] parameters respectivly during instantiation.
* @constructor
* @name Rendition.UI.Chat
*/
Rendition.UI.Chat = function (args) {
    var instance = {}
    args = args || {};
    /**
    * The type of widget.  Returns RenditionConfirmDialog.
    * @name Chat.type
    * @memberOf Rendition.UI.Chat.prototype
    * @type Native.Integer
    * @public
    * @property
    */
    instance.refreshTimer = 3000;
    instance.type = 'RenditionChat';
    instance.userIds = [];
    instance.messages = [];
    instance.conversationList = [];
    instance.conversationId = args.id || Rendition.UI.createUUID();
    Rendition.UI.chats.push(instance);
    instance.version = 0;
    /**
    * Prevent the default event from occuring.  For use within an event handler.  For example, when used in within a function subscribed to the editfinish event, running grid.preventDefault() will prevent the grid from updating the recordset.
    * @function
    * @name Chat.preventDefault
    * @memberOf Rendition.UI.Chat.prototype
    * @type Native.undefined
    * @public
    */
    instance.preventDefault = function () {
        instance.cancelDefault = true;
    }
    /**
    * Attach a procedure to an event.
    * @function
    * @name Chat.addEventListener
    * @memberOf Rendition.UI.Chat.prototype
    * @type Native.undefined
    * @param {Native.String} type The type of event to subscribe to.
    * @param {Native.Function} proc The function to call when the event is fired.
    * @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
    * @public
    */
    instance.addEventListener = function (type, proc, capture) {
        if (instance.events[type]) {
            if (instance.events[type].indexOf(proc) == -1) {
                instance.events[type].push(proc);
            }
        } else {
            instance.log('can\'t attach to event handler ' + type);
        }
        return null;
    }
    /**
    * Removes an event from subscription list.  The [proc] must match exactly the [proc] subscribed with.
    * @function
    * @name Chat.removeEventListener
    * @memberOf Rendition.UI.Chat.prototype
    * @type Native.undefined
    * @param {Native.String} type The type of event to subscribe to.
    * @param {Native.Function} proc The function to call when the event is fired.
    * @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
    * @public
    */
    instance.removeEventListener = function (type, proc, capture) {
        var evts = instance.events[type];
        for (var x = 0; evts.length > x; x++) {
            if (evts[x] == proc) {
                evts.splice(x, 1);
            }
        }
        return null;
    }
    /**
    * Used internally to add events used in the arugments of this instance.
    * @function
    * @name Chat.addInitalEvents
    * @memberOf Rendition.UI.Chat.prototype
    * @type Native.undefined
    * @param {Native.Function} eventProc The event to add.
    * @private
    */
    instance.addInitalEvents = function (eventProc) {
        if (eventProc) {
            return [eventProc];
        } else {
            return [];
        }
    }
    /* event arrays and attachment of events passed as arguments */
    instance.events = {
        messageSent: instance.addInitalEvents(args.sendMessage),
        updated: instance.addInitalEvents(args.updated),
        drawMessage: instance.addInitalEvents(args.drawMessage)
    }
    /*events */
    /**
    * Executes event subscriptions.
    * @function
    * @name Chat.executeEvents
    * @memberOf Rendition.UI.Dialog.prototype
    * @returns {Native.Boolean} false if cancel default was called.
    * @private
    * @param {Native.Array} events to execute.
    * @param {Native.Object} e The DOM event object.
    * @param {Native.String} element the related DHTML element.
    * @param {Native.String} arguments The arguments to add to the event signature.
    * @memberOf Rendition.UI.Dialog.prototype
    */
    instance.executeEvents = function (events, e, element, arguments) {
        var fLength = events.length;
        if (fLength < 1) { return false; }
        if (arguments === undefined) { arguments = []; }
        instance.cancelDefault = false;
        arguments.unshift(e, instance, element);
        for (var x = 0; fLength > x; x++) {
            if (events[x] !== undefined) {
                events[x].apply(this, arguments);
            }
        }
        return instance.cancelDefault;
    }
    instance.init = function () {
        /* get a list of the chats this user is involved in */
        instance.selectChatDialog = Rendition.UI.dialogWindow({
            title: Rendition.Localization['Chat_Select_a_channel'].Title,
            rect: {
                x: (document.documentElement.clientWidth / 2 - 300),
                y: 100,
                w: 600,
                h: 190
            }
        });
        instance.refreshListDialog();
        return;
    }
    instance.refreshListDialog = function () {
        var req = [
			"ListConversations",
			[]
		]
        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
        var reqEval = Rendition.UI.Ajax(url, function (e) {
            var a = JSON.parse(e.responseText);
            instance.conversationList = a.method1.ListConversations.conversations;
            var c = instance.selectChatDialog.content;
            c.innerHTML = '';
            var data = [];
            for (var y = 0; instance.conversationList.length > y; y++) {
                var con = instance.conversationList[y];
                data.push([con.name, con.subject, con.members,
                        con.ownerId, con.password, con.version, con.id]);
            }
            data.push([Rendition.Localization['Chat_-_Create_a_new_channel_-_'].Title, '', '',
                        Rendition.Commerce.user.userId, '', 0, Rendition.UI.createUUID()]);
            instance.conversationListGrid = Rendition.UI.Grid({
                data: instance.createReadObject(data, [
                    Rendition.Localization['Chat_Name'].Title,
                    Rendition.Localization['Chat_Subject'].Title,
                    Rendition.Localization['Chat_Users'].Title,
                    Rendition.Localization['Chat_ownerId'].Title,
                    Rendition.Localization['Chat_Password_Protected'].Title,
                    'version',
                    'id'
                    ], [200, 250, 200, 100, 175, 75, 150]),
                parentNode: c,
                rowCountColumn: true,
                rowDblClick: function (e, grid, element, row, column, selection, data, header) {
                    instance.conversationId = instance.conversationListGrid.getRecord(row, 'id');
                    instance.selectChatDialog.close();
                    instance.addUser(Rendition.Commerce.user.userId);
                    instance.initChatWindow();
                },
                contextMenuOptions: function (e, element) {
                    var row = parseInt(element.getAttribute('row'));
                    var column = parseInt(element.getAttribute('column'));
                    var options = [];
                    options[0] = Rendition.UI.MenuOption();
                    options[0].text = Rendition.Localization['Chat_Join_Conversation'].Title;
                    Rendition.UI.appendEvent('click', options[0], function () {
                        instance.conversationId = instance.conversationListGrid.getRecord(row, 'id');
                        instance.selectChatDialog.close();
                        instance.addUser(Rendition.Commerce.user.userId);
                        instance.initChatWindow();
                    }, false);
                    options[1] = Rendition.UI.MenuOption();
                    options[1].text = Rendition.Localization['Chat_Refresh'].Title;
                    Rendition.UI.appendEvent('click', options[1], function () {
                        instance.refreshListDialog();
                    }, false);
                    return options;
                }
            });
        }, instance);
        return;
    }
    instance.createReadObject = function (data, headers, columnWidths) {
        var hdr = [];
        if (columnWidths === undefined) {
            var columnWidths = [];
            for (var x = 0; headers.length > x; x++) {
                columnWidths.push(400);
            }
        }
        for (var x = 0; headers.length > x; x++) {
            hdr.push({
                name: headers[x],
                dataType: 'varchar',
                dataLength: 255,
                columnOrder: x,
                columnSize: columnWidths[x],
                visibility: 1,
                description: '',
                isNullable: 0,
                primaryKey: 0,
                defaultValue: '',
                displayName: headers[x],
                hidden: 0
            });
        }
        return dataSet = {
            data: data,
            error: 0,
            description: '',
            range: {
                from: 1,
                to: 1
            },
            schema: {
                error: 0,
                errorDesc: '',
                objectId: 0,
                columns: headers.length,
                records: data.length,
                orderBy: 0,
                orderByDirection: 0,
                checksum: -1,
                name: '',
                displayName: ''
            },
            header: hdr
        }
    }
    instance.initChatWindow = function () {
        /* draw the elements */
        /* 
        Dialog, menu, cutter, cutter, tabs, textarea
        -----------------
        |CHAT       |USR|
        |CHAT		|USR|
        |CHAT		|USR|
        |CHAT		|	|
        |CHAT_______|	|
        |BLAH_______|___|
        */
        instance.userCutterPositionOffset = 150;
        instance.chatCutterPositionOffset = 72;
        instance.dialog = Rendition.UI.dialogWindow({
            rect: {
                x: document.documentElement.clientWidth * .10,
                y: document.documentElement.clientHeight * .10,
                w: document.documentElement.clientWidth * .80,
                h: document.documentElement.clientHeight * .80
            },
            title: 'Chat',
            resize: function () {
                if (instance.userCutter) {
                    instance.userCutter.position = instance.dialog.rect.w - instance.userCutterPositionOffset;
                    instance.chatCutter.position = instance.dialog.rect.h - instance.chatCutterPositionOffset;
                }
            },
            close: function () {
                for (var x = 0; Rendition.UI.chats.length > x; x++) {
                    if (Rendition.UI.chats[x].conversationId == instance.conversationId) {
                        Rendition.UI.chats.splice(x, 1);
                    }
                }
                instance.removeUser(Rendition.Commerce.user.userId);
                clearTimeout(instance.timer);
            }
        });
        instance.timerElapsed();
        instance.userCutter = Rendition.UI.CutterBar({
            position: instance.dialog.rect.w - instance.userCutterPositionOffset,
            autoResize: false,
            orientation: 0,
            parentNode: instance.dialog.content
        });
        instance.chatCutter = Rendition.UI.CutterBar({
            position: instance.dialog.rect.h - instance.chatCutterPositionOffset,
            autoResize: false,
            orientation: 1,
            parentNode: instance.userCutter.cutters[0],
            resize: function () {
                if (instance.message) {
                    instance.message.style.width = instance.chatCutter.cutters[1].offsetWidth + 'px';
                    instance.message.style.height = instance.chatCutter.cutters[1].offsetHeight + 'px';
                }
                if (instance.messageArea) {
                    instance.messageArea.style.height = instance.chatCutter.cutters[0].offsetHeight + 'px';
                    instance.messageArea.style.width = instance.chatCutter.cutters[0].offsetWidth + 'px';
                }
            }
        });
        /* a tree goes here */
        instance.userTree = Rendition.UI.TreeView({
            parentNode: instance.userCutter.cutters[1],
            labelclick: function (e, treeView, node, labelText, treeNode, parentNode) {
                if (treeNode.text == Rendition.Localization['Cha_Add_a_user'].Title) {
                    Rendition.UI.SelectButtonDialog({
                        objectName: 'shortUserList',
                        autoCompleteSuffix: "where handle like '%<value>%' or userId like '%<value>%' or email like '%<value>%'",
                        mustMatchRecord: "where userId = '<value>'",
                        optionDisplayValue: '<column0> - <column2>',
                        contextMenuOptions: Rendition.Commerce.ComContext,
                        ordinal: 0,
                        inputTitle: Rendition.Localization['Chat_Account_No'].Title,
                        boxTitle: Rendition.Localization['Chat_Enter_an_Account_No'].Title,
                        title: Rendition.Localization['Chat_Select_user'].Title,
                        callbackProcedure: function (e) {
                            instance.addUser(parseInt(e.selectedValue));
                        }
                    });
                }
            }
        });
        /* add a scroll bar to the chat area */
        instance.userCutter.cutters[1].style.overflow = 'auto';
        /* add the 'add user' button
        instance.userTree.add({
        text: '- Add a user -',
        value: '',
        childNodes: []
        }); */
        instance.message = document.createElement('input');
        instance.message.style.padding = '0 0 4px 4px';
        instance.message.onkeyup = function (e) {
            e = e || window.event;
            if (e.keyCode == 13) {
                instance.submitMessage(this.value);
            }
        }
        instance.chatCutter.cutters[1].appendChild(instance.message);
        instance.chatCutter.resize();
        /* update messages */
        instance.redrawChat();
    }
    instance.timerElapsed = function () {
        instance.refresh(function () {
            instance.timer = setTimeout(instance.timerElapsed, instance.refreshTimer);
        });
    }
    instance.redrawChat = function () {
        var cutter = instance.chatCutter.cutters[0];
        cutter.innerHTML = '';
        instance.messageArea = document.createElement('div');
        instance.messageArea.style.height = cutter.offsetHeight + 'px';
        instance.messageArea.style.width = cutter.offsetWidth + 'px';
        instance.messageArea.className = 'adminChat';
        /* sort the messages by the version number */
        instance.messages.sort(function (a, b) {
            return ((a.version < b.version) ? -1 : ((a.version > b.version) ? 1 : 0));
        });
        /* draw the message area messages
        * get the old scroll position and 
        * reset it when drawing is complete */
        var l = instance.messages.length;
        /* messages are a big UL */
        instance.messageUserList = document.createElement('ul');
        for (var x = 0; l > x; x++) {
            var message = instance.messages[x];
            /* add the message li */
            var messageLi = document.createElement('li');
            if (!instance.executeEvents(instance.events.drawMessage, messageLi, [message])) {
                /* run the default event if 
                no events call 'cancelDefault' */
                instance.defaultDrawMessage.apply(this, [undefined, instance, messageLi, message]);
            }
            instance.messageUserList.appendChild(messageLi);
        }
        instance.messageArea.appendChild(instance.messageUserList);
        cutter.appendChild(instance.messageArea);
        instance.messageArea.scrollTop = instance.messageArea.scrollHeight;
    }
    instance.defaultDrawMessage = function (e, inst, messageLi, message) {
        /* add the time span */
        var timeSpan = document.createElement('i');
        var so = message.SentOn;
        so = so.substring(so.indexOf('(') + 1, so.indexOf(')'));
        var sent = new Date(parseInt(so));
        timeSpan.innerHTML = Rendition.UI.formatDate(sent, 'hh:nn:ss') + ':';
        messageLi.appendChild(timeSpan);
        /* add the user span */
        var userSpan = document.createElement('b');
        userSpan.innerHTML = message.Handle + '>';
        messageLi.appendChild(userSpan);
        /* add the message span */
        var messageParagraph = document.createElement('span');
        messageParagraph.innerHTML = message.Message;
        messageLi.appendChild(messageParagraph);
    }
    instance.update = function (e) {

        /* get array lengths for faster indexing */
        var l = e.messages.length;
        var ml = instance.messages.length;
        var u = e.users.length;
        var ul = instance.userIds.length;
        for (var x = 0; u > x; x++) {
            /* add new users */
            if (instance.userIds.indexOf(e.users[x].userId) == -1) {
                instance.userIds.push(e.users[x].userId);
                instance.userTree.add({
                    text: e.users[x].handle,
                    value: e.users[x].userId,
                    childNodes: []
                });
            }
        }
        /* remove users who are no longer in the list */
        var usersToRemove = [];
        for (var y = 0; ul > y; y++) {
            var isInConversation = false;
            for (var x = 0; u > x; x++) {
                if (e.users[x].userId == instance.userIds[y]) {
                    isInConversation = true;
                }
            }
            if (!isInConversation) {
                usersToRemove.push(instance.userIds[y]);
            }
        }
        /* actually remove users */
        for (var x = 0; usersToRemove.length > x; x++) {
            var node = instance.userTree.getNodeByValue(usersToRemove[x]);
            node.element.remove();
            instance.userIds.splice(instance.userIds.indexOf(usersToRemove[x]), 1);
        }
        /* add new messages */
        for (var x = 0; l > x; x++) {
            var msg = e.messages[x];
            if (msg.Version > instance.version) {
                instance.version = msg.Version;
            }
            var addMessage = true; /* add this message */
            for (var y = 0; ml > y; y++) {
                var mmsg = instance.messages[y];
                if (mmsg.Id == msg.Id) {
                    /* unless the message was already there */
                    addMessage = false;
                }
            }
            if (addMessage) {
                instance.messages.push(msg);
            }
        }
        /* redraw new message data */
        instance.redrawChat();
    }
    instance.removeUser = function (userId) {
        var req = [
			"RemoveUserFromConversation",
			[instance.conversationId, userId]
		]
        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
        var reqEval = Rendition.UI.Ajax(url, function (e) {
            var a = JSON.parse(e.responseText);
            a = a.method1.RemoveUserFromConversation;
            if (instance.dialog.alive()) {
                instance.update(a);
            }
            return;
        }, instance);
    }
    instance.addUser = function (userId) {
        var req = [
			"AddUserToConversation",
			[instance.conversationId, userId]
		]
        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
        var reqEval = Rendition.UI.Ajax(url, function (e) {
            var a = JSON.parse(e.responseText);
            a = a.method1.AddUserToConversation;
            instance.update(a);
            return;
        }, instance);
    }
    instance.submitMessage = function (message) {
        instance.message.value = '';
        var req = [
			"SubmitConversationMessage",
			[Rendition.Commerce.user.userId, message, instance.conversationId, instance.version]
		]
        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
        var reqEval = Rendition.UI.Ajax(url, function (e) {
            var a = JSON.parse(e.responseText);
            a = a.method1.SubmitConversationMessage;
            instance.update(a);
            return;
        }, instance);
    }
    instance.refresh = function (callbackProcedure) {
        var req = [
			"GetConversation",
			[instance.conversationId, instance.version]
		]
        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
        var reqEval = Rendition.UI.Ajax(url, function (e) {
            var a = JSON.parse(e.responseText);
            a = a.method1.GetConversation;
            instance.update(a);
            if (callbackProcedure) {
                callbackProcedure.apply(instance, [instance]);
            }
            return;
        }, instance);
    }
    instance.init();
}