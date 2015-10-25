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
/* main.js (Rendition.Merchant) version 0.1.78 */
/** 
* Rendition merchant applications.  
* Designed to be exposed to the public.
* This inclucde constructors like LogOn, add to cart, place order etc.. 
* This is a reference/example of how to use Rendition.dll as a front end e-commerce site.
* This file contains methods and properties that impement AJAX/JSON path /responder.html to Rendition.dll
* If your AJAX/JSON responder.html is not the URL /responder.html it will be nessessary to modify this file.
* This file exclusivly uses JQuery 1.4.2 to execute all AJAX and animation procedures and is required.
* @name Rendition.Merchant
* @namespace
*/
var Rendition = Rendition || {};
Rendition.Merchant = {
    /**
    * The URL the classes in the merchant 
    * namespace will use to communicate with the server.  Usually 'responder'.
    * @name Rendition.Merchant.responderURL
    * @memberOf Rendition.Merchant
    * @type Native.String
    * @public
    * @property
    * @readOnly
    */
    responderURL: '/responder',
    /**
    * pulseColor1 and pulseColor2 are the default colors for the validation methods.
    * @name Rendition.Merchant.pulseColor1
    * @memberOf Rendition.Merchant
    * @type Native.String
    * @public
    * @property
    * @readOnly
    */
    pulseColor1: 'lightblue',
    /**
    * pulseColor1 and pulseColor2 are the default colors for the validation methods.
    * @name Rendition.Merchant.pulseColor2
    * @memberOf Rendition.Merchant
    * @type Native.String
    * @public
    * @property
    * @readOnly
    */
    pulseColor2: 'white',
    /* these are the deafult easing methods for the validation method later in this file */
    /**
    * easeOut and easeIn are the default easing methods for all animations
    * unless specifically overriden by the caller.
    * @name Rendition.Merchant.easeOut
    * @memberOf Rendition.Merchant
    * @type Native.String
    * @public
    * @property
    * @readOnly
    */
    easeOut: "linear",
    /**
    * easeOut and easeIn are the default easing methods for all animations
    * unless specifically overriden by the caller.
    * @name Rendition.Merchant.easeIn
    * @memberOf Rendition.Merchant
    * @type Native.String
    * @public
    * @property
    * @readOnly
    */
    easeIn: "linear",
    /**
    * Validation patterns for the given input type for 
    * fields that can be left blank, but probably shouldn't be.
    * @name Rendition.Merchant.askLeaveBlank
    * @memberOf Rendition.Merchant
    * @type Native.RegExp
    * @public
    * @property
    * @readOnly
    */
    askLeaveBlank: '.*plz.*',
    /**
    * Validation patterns for fields that cannot be left blank.
    * @name Rendition.Merchant.cannotBeBlank
    * @memberOf Rendition.Merchant
    * @type Native.RegExp
    * @public
    * @property
    * @readOnly
    */
    cannotBeBlank: '(^billTo[^2]*$)|(^shipTo[^2]*$)|(^card.*$)|(^exp.*$)|(^nameOnCard$)|(^secNumber$)|(^ponumber$)',
    /**
    * Validation patterns for fields that can be left blank 
    * but look a lot like fields that cannot be left blank
    * @name Rendition.Merchant.cannotBeBlankExceptions
    * @memberOf Rendition.Merchant
    * @type Native.RegExp
    * @public
    * @property
    * @readOnly
    */
    cannotBeBlankExceptions: '(^(.*SpecialInstructions|.*SendShipmentUpdates)$)',
    /**
    * Validation patterns for fields fields that cannot be left the default value.
    * See <link xlink:href="Rendition.Merchant.defaultValues"/> to set the list of default values.
    * @name Rendition.Merchant.cannotBeDefault
    * @memberOf Rendition.Merchant
    * @type Native.RegExp
    * @public
    * @property
    * @readOnly
    */
    cannotBeDefault: '(^gender.*$)|(^hair.*$)|(^skin.*$)',
    /**
    * Validation patterns for fields fields that can be left the default value but cause a warning message.
    * See <link xlink:href="Rendition.Merchant.defaultValues"/> to set the list of default values.
    * @name Rendition.Merchant.cannotBeDefault
    * @memberOf Rendition.Merchant
    * @type Native.RegExp
    * @public
    * @property
    * @readOnly
    */
    askLeaveDefault: 'gender\\d+|character\\d+|hair\\d+|skin\\d+',
    /**
    * Array of values the <link xlink:href="Rendition.Merchant.cannotBeDefault"/> fields cannot be set to.
    * @name Rendition.Merchant.defaultValues
    * @memberOf Rendition.Merchant
    * @type Native.RegExp
    * @public
    * @property
    * @readOnly
    */
    defaultValues: ["-Select-", "Select"],
    /**
    * A generic error for unexpected responses from the server..
    * @name Rendition.Merchant.ajaxError
    * @memberOf Rendition.Merchant
    * @type Native.Function
    * @public
    * @property
    * @readOnly
    */
    ajaxError: function (jqXHR, textStatus, errorThrown) {
        alert("Error in AJAX request:" + textStatus + '\n\r' + errorThrown);
    },
    /**
    * Adds a discount code to the current session and executes an optional callback procedure.
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.String} [args.discountCode] The discount code.
    * @param {Native.Function} [args.callbackProcedure] Procedure to run when this method completes successfully. Signature: (JSONResponse e).
    * @type Native.Function
    * @name Rendition.Merchant.setDiscountCode
    * @memberOf Rendition.Merchant
    */
    setDiscountCode: function (args) {
        var instance = {}
        $.ajax({
            type: "POST",
            url: Rendition.Merchant.responderURL,
            data: 'method1=' + encodeURIComponent(JSON.stringify([
			    'SetDiscountCode',
			    [
				    args.discountCode
			    ]
		    ])),
            processData: false,
            dataType: "json",
            error: Rendition.Merchant.ajaxError,
            success: function (e) {
                e = e.method1;
                if (e.error !== undefined) {
                    alert(e.description);
                    return; /* error accessing method */
                }
                e = e.SetDiscountCode;
                if (e.error != 0) {
                    alert(e.description);
                    return; /* method returns an error */
                }
                if (args.callbackProcedure !== undefined) {
                    args.callbackProcedure.apply(this, [e]);
                }
            }
        });
    },
    /**
    * Removes an item to the wish list session property and executes an optional callback procedure.
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.DHTMLElement} [args.button] DHTMLElement button to change innerHTML and disable/enable.
    * @param {Native.String} [args.returnMessage] the message that appeears on the button when the method completes successfully.
    * @param {Native.Function} [args.callbackProcedure] Procedure to run when this method completes successfully. Signature: (JSONResponse e)
    * @type Native.Function
    * @name Rendition.Merchant.removeFromWishlist
    * @memberOf Rendition.Merchant
    */
    removeFromWishlist: function (args) {
        if (args.button !== undefined) {
            args.button.disabled = true;
            args.button.innerHTML = 'Removing Items...';
        }
        $.ajax({
            type: "POST",
            url: Rendition.Merchant.responderURL,
            data: 'method1=' + encodeURIComponent(JSON.stringify([
			    'RemoveFromWishlist',
			    [
				    args.itemNumber
			    ]
		    ])),
            processData: false,
            dataType: "json",
            error: Rendition.Merchant.ajaxError,
            success: function (e) {
                e = e.method1;
                if (e.error !== undefined) {
                    alert(e.description);
                    args.button.disabled = false;
                    return; /* error accessing method */
                }
                e = e.RemoveFromWishlist;
                if (e.error != 0) {
                    alert(e.description);
                    args.button.disabled = false;
                    return; /* method returns an error */
                }
                if (args.callbackProcedure !== undefined) {
                    args.callbackProcedure.apply(this, [e]);
                }
                args.button.innerHTML = args.returnMessage || 'Item Removed';
            }
        });
    },
    /**
    * adds an item to the wish list session property and executes an optional callback procedure.
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.String} [args.returnMessage] the message that appeears on the button when the method completes successfully.
    * @param {Native.Function} [args.callbackProcedure] Procedure to run when this method completes successfully. Signature: (JSONResponse e)
    * @type Native.Function
    * @name Rendition.Merchant.duplicateCartId
    * @memberOf Rendition.Merchant
    */
    duplicateCartId: function (args) {
        var instance = {}
        if (args.button !== undefined) {
            args.button.disabled = true;
            instance.buttonHTML = args.button.innerHTML;
            args.button.innerHTML = 'Adding Item...';
        }
        instance.restoreButton = function () {
            if (args.button !== undefined) {
                args.button.innerHTML = instance.buttonHTML = instance.buttonHTML;
                args.button.disabled = false;
            }
        }
        $.ajax({
            type: "POST",
            url: Rendition.Merchant.responderURL,
            data: 'method1=' + encodeURIComponent(JSON.stringify([
			    'DuplicateCartId',
			    [
				    args
			    ]
		    ])),
            processData: false,
            dataType: "json",
            error: Rendition.Merchant.ajaxError,
            success: function (e) {
                e = e.method1;
                if (e.error !== undefined) {
                    alert(e.description);
                    instance.restoreButton();
                    return; /* error accessing method */
                }
                e = e.DuplicateCartId;
                if (e.error != 0) {
                    alert(e.description);
                    instance.restoreButton();
                    return; /* method returns an error */
                }
                if (args.callbackProcedure !== undefined) {
                    args.callbackProcedure.apply(this, [e]);
                }
                args.button.innerHTML = args.returnMessage || 'Item In Cart';
            }
        });
    },
    /**
    * adds an item to the wish list session property and executes an optional callback procedure.
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.DHTMLElement} [args.button] DHTMLElement button to change innerHTML and disable/enable.
    * @param {Native.String} [args.returnMessage] the message that appeears on the button when the method completes successfully.
    * @param {Native.Function} [args.callbackProcedure] Procedure to run when this method completes successfully. Signature: (JSONResponse e)
    * @type Native.Function
    * @name Rendition.Merchant.addToWishList
    * @memberOf Rendition.Merchant
    */
    addToWishList: function (args) {
        var instance = {}
        if (args.button !== undefined) {
            args.button.disabled = true;
            instance.buttonHTML = args.button.innerHTML;
            args.button.innerHTML = 'Adding Item...';
        }
        instance.restoreButton = function () {
            if (args.button !== undefined) {
                args.button.innerHTML = instance.buttonHTML = instance.buttonHTML;
                args.button.disabled = false;
            }
        }
        $.ajax({
            type: "POST",
            url: Rendition.Merchant.responderURL,
            data: 'method1=' + encodeURIComponent(JSON.stringify([
			    'AddToWishlist',
			    [
				    args.itemNumber
			    ]
		    ])),
            processData: false,
            dataType: "json",
            error: Rendition.Merchant.ajaxError,
            success: function (e) {
                e = e.method1;
                if (e.error !== undefined) {
                    alert(e.description);
                    instance.restoreButton();
                    return; /* error accessing method */
                }
                e = e.AddToWishlist;
                if (e.error != 0) {
                    alert(e.description);
                    instance.restoreButton();
                    return; /* method returns an error */
                }
                if (args.callbackProcedure !== undefined) {
                    args.callbackProcedure.apply(this, [e]);
                }
                args.button.innerHTML = args.returnMessage || 'Item In Wishlist';
            }
        });
    },
    /**
    * produces a dialog (DIV) that contains default buttons and fields nessessary to email a friend
    * information about this item using the EmailAFriend event handler in Rendition.dll.
    * @constructor
    * @name Rendition.Merchant.EmailAFriend
    * @memberOf Rendition.Merchant
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.Integer} [args.width=600] Width of the dialog in pixles.
    * @param {Native.Integer} [args.height=315] height of the dialog in pixles.
    * @param {Native.Integer} [args.previewWidth=800] Width of the message preview dialog in pixles.
    * @param {Native.Integer} [args.previewHeight=450] height of the message preview dialog in pixles.
    * @param {Native.Object} [args.animationTimer='fast'] time for the animation to complete default. JQuery, 'fast', 'slow', 100 etc..
    * @param {Native.Object} [args.animationEasing='linear'] animation easing method using avaliable JQuery easing methods: 'swing', 'linear'.
    * @param {Native.String} [args.emailSentMessage='EMAIL SENT!'] message to display to the user after the email has been sent.
    * @param {Native.Integer} [args.callbackMessageDelay=3000] how long to delay before removing the message in miliseconds.
    */
    EmailAFriend: function (args) {
        if (window.user.userId == -1 || window.user === undefined) {
            Rendition.Merchant.LogOn({
                callbackProcedure: function () {
                    Rendition.Merchant.EmailAFriend(args);
                }
            });
            return;
        }
        var instance = {}
        if (args === undefined) {
            args = {}
        }
        instance.margin = {
            top: args.marginTop || 50
        }
        instance.rect = {
            width: args.width || 600,
            height: args.height || 315
        }
        instance.previewMargin = {
            top: args.previewMarginTop || 10
        }
        instance.previewRect = {
            width: args.previewWidth || 800,
            height: args.previewHeight || 450
        }
        instance.animationTimer = args.animationTimer || 'fast';
        instance.animationEasing = args.animationEasing || 'linear';
        instance.resize = function () {
            var p = {
                t: document.documentElement.scrollTop,
                l: document.documentElement.scrollLeft,
                h: document.documentElement.clientHeight,
                w: document.documentElement.clientWidth
            }
            instance.modalBackground.style.height = p.h + 'px';
            instance.modalBackground.style.width = p.w + 'px';
            instance.modalBackground.style.top = p.t + 'px';
            instance.modalBackground.style.left = p.l + 'px';
            instance.email.style.top = instance.finalTop() + 'px';
            instance.email.style.left = (document.documentElement.clientWidth / 2 - (instance.rect.width / 2)) + 'px';
        }
        instance.init = function () {

            instance.email = document.createElement('div');
            instance.modalBackground = document.createElement('div');

            instance.finalLeft = (document.documentElement.clientWidth / 2) - (instance.rect.width / 2);
            instance.finalTop = function () { return document.documentElement.scrollTop + instance.margin.top }
            instance.email.style.top = instance.finalTop();
            instance.email.style.left = (document.documentElement.clientWidth / 2 - (instance.rect.width / 2)) + 'px';
            instance.modalBackground.style.background = 'url(/img/25PctAlphaBlackDot.png)';
            instance.modalBackground.style.position = 'absolute';
            instance.modalBackground.style.zIndex = '9996';
            instance.email.className = 'replyWindow emailAFriendWindow';
            instance.email.style.zIndex = '9997';
            instance.email.style.position = 'absolute';
            Rendition.Merchant.appendEvent('resize', window.document, instance.resize, false);
            Rendition.Merchant.appendEvent('scroll', window.document, instance.resize, false);
            instance.email.style.width = 10 + 'px';
            instance.email.style.height = 10 + 'px';
            instance.resize();

            instance.formTable = document.createElement('table');
            instance.formTable.className = 'blogReply emailAFriend';
            instance.formTable.style.width = '100%';
            instance.formTable.style.marginTop = '10px';

            instance.friendsEmail = document.createElement('input');
            instance.message = document.createElement('textarea');
            instance.cancelButton = document.createElement('button');
            instance.postButton = document.createElement('button');

            instance.friendsEmail.style.width = '350px';

            instance.cancelButton.onclick = instance.close;
            instance.postButton.onclick = instance.submit;

            instance.cancelButton.style.margin = '4px';
            instance.postButton.style.margin = '4px';

            instance.cancelButton.innerHTML = 'Cancel';
            instance.postButton.innerHTML = 'Post';

            var t = instance.formTable;
            var r4 = t.insertRow(0);
            var r3 = t.insertRow(0);
            var r2 = t.insertRow(0);
            var r1 = t.insertRow(0);
            var r4c1 = r4.insertCell(0);
            r4c1.setAttribute('colspan', '2');
            var r3c1 = r3.insertCell(0);
            r3c1.setAttribute('colspan', '2');
            var r2c1 = r2.insertCell(0);
            r2c1.setAttribute('colspan', '2');
            var r1c2 = r1.insertCell(0);
            var r1c1 = r1.insertCell(0);

            r1c1.style.textAlign = 'right';
            r1c2.style.fontWeight = 'bold';
            r2c1.style.textAlign = 'center';
            r1c1.appendChild(document.createTextNode('Friend\'s Email Address'));
            r1c2.appendChild(instance.friendsEmail);
            r2c1.appendChild(document.createTextNode('Message To Include'));
            r3c1.appendChild(instance.message);
            r2c1.style.padding = '0 0 0 16px';
            r2c1.style.textAlign = 'left';
            r3c1.style.padding = '4px';
            r3c1.style.textAlign = 'right';
            r4c1.style.padding = '4px';
            r4c1.style.textAlign = 'right';
            instance.message.style.width = '550px';
            instance.message.style.height = '200px';

            r4c1.appendChild(instance.cancelButton);
            r4c1.appendChild(instance.postButton);

            document.body.appendChild(instance.modalBackground);
            document.body.appendChild(instance.email);

            instance.email.appendChild(instance.formTable);

            $(instance.email).animate({ width: instance.rect.width, left: instance.finalLeft }, instance.animationTimer, instance.animationEasing, function () {
                $(instance.email).animate({ height: instance.rect.height }, instance.animationTimer, instance.animationEasing, function () {
                    instance.friendsEmail.focus();
                    instance.friendsEmail.select();
                });
            });

            return instance;
        }
        instance.close = function (e) {
            instance.dispose();
        }
        instance.formStruct = function () {
            return {
                message: instance.message.value,
                subject: instance.friendsEmail.value
            }
        }
        instance.submit = function (button) {
            instance.postButton.disabled = true;
            $.ajax({
                type: "POST",
                url: Rendition.Merchant.responderURL,
                data: 'method1=' + encodeURIComponent(JSON.stringify(instance.getEmailMethod())),
                processData: false,
                dataType: "json",
                error: Rendition.Merchant.ajaxError,
                success: instance.submitCallback
            });
        }
        instance.submitCallback = function (e) {
            e = e.method1;
            if (e.error !== undefined) {
                alert(e.description);
                instance.postButton.disabled = false;
                return; /* error accessing method */
            }
            e = e.EmailAFriend;
            if (e.error != 0) {
                alert(e.description);
                instance.postButton.disabled = false;
                return; /* method returns an error */
            }
            instance.postButton.innerHTML = args.emailSentMessage || 'EMAIL SENT!';
            setTimeout(instance.dispose, args.callbackMessageDelay || 3000); /*close the window 3 seconds after post callback */
        }
        instance.dispose = function () {
            instance.postButton.disabled = false;
            document.body.removeChild(instance.modalBackground);
            document.body.removeChild(instance.email);
        }
        instance.getEmailMethod = function () {
            return [
			    'EmailAFriend',
			    [
				    args.itemNumber,
				    instance.message.value,
				    instance.friendsEmail.value
			    ]
		    ]
        }
        return instance.init();
    },
    /**
    * Changes the location to the search Url and passes the paramater to the Url.  E.g.:"/list.aspx?search=My%20Search"
    * @param {Native.Object} [value] The value to search for.
    * @type Native.Function
    * @name Rendition.Merchant.searchClick
    * @memberOf Rendition.Merchant
    */
    searchClick: function (value) {
        window.location = '/list.aspx?search=' + value;
    },
    /**
    * Changes the location to the search Url
    * and passes a value when the enter key is pressed.  This should be bound to a keypress event.
    * @param {Native.Object} [e] The event object.
    * @param {Native.Object} [value] The value to search for.
    * @type Native.Function
    * @name Rendition.Merchant.searchKeyPress
    * @memberOf Rendition.Merchant
    */
    searchKeyPress: function (e, value) {
        e = e || window.event;
        if (e.keyCode == 13) {
            window.location = '/list.aspx?search=' + value;
        }
    },
    /**
    * Bill to fields overwrite the ship to fields. 
    * Copies the information the checkout form from one set of DOM inputs to another.
    * This function will look for fields with the 'shipTo' and 'billTo' prefix ids.
    * For example shipToFirstName.
    * @type Native.Function
    * @name Rendition.Merchant.copyShipTo
    * @memberOf Rendition.Merchant
    */
    copyShipTo: function () {
        var g = function (i) { return document.getElementById(i); }
        g('shipToFirstName').value = g('billToFirstName').value;
        g('shipToLastName').value = g('billToLastName').value;
        g('shipToAddress1').value = g('billToAddress1').value;
        g('shipToAddress2').value = g('billToAddress2').value;
        g('shipToCity').value = g('billToCity').value;
        g('shipToState').value = g('billToState').value;
        g('shipToCountry').value = g('billToCountry').value;
        g('shipToHomePhone').value = g('billToHomePhone').value;
        g('shipToWorkPhone').value = g('billToWorkPhone').value;
        g('shipToZip').value = g('billToZip').value;
    },
    /**
    * Ship to fields overwrite the bill to fields. 
    * Copies the information the checkout form from one set of DOM inputs to another.
    * This function will look for fields with the 'shipTo' and 'billTo' prefix ids.
    * For example shipToFirstName.
    * @type Native.Function
    * @name Rendition.Merchant.copyBillTo
    * @memberOf Rendition.Merchant
    */
    copyBillTo: function () {
        var g = function (i) { return document.getElementById(i); }
        g('billToFirstName').value = g('shipToFirstName').value;
        g('billToLastName').value = g('shipToLastName').value;
        g('billToAddress1').value = g('shipToAddress1').value;
        g('billToAddress2').value = g('shipToAddress2').value;
        g('billToCity').value = g('shipToCity').value;
        g('billToState').value = g('shipToState').value;
        g('billToCountry').value = g('shipToCountry').value;
        g('billToHomePhone').value = g('shipToHomePhone').value;
        g('billToWorkPhone').value = g('shipToWorkPhone').value;
        g('billToZip').value = g('shipToZip').value;
    },
    /**
    * Creates a drop down menu for multiple calendar entries to be displayed without mucking up the calendar. 
    * @type Native.Function
    * @name Rendition.Merchant.calendarEntries
    * @memberOf Rendition.Merchant
    */
    calendarEntries: function (o, a) {
        var m = document.createElement('div');
        m.className = 'calendarDetail';
        var t = document.createElement('table');
        var h = a.length;
        for (var x = 0; h > x; x++) {
            var r = t.insertRow(0);
            var c = r.insertCell(0);
            c.className = 'calendarDetailCell';
            c.innerHTML = '<a href="/reply.aspx?entryId=' + a[x][0] + '">' + a[x][2] + '</a>';
            c = r.insertCell(0);
            c.className = 'calendarDetailCell';
            c.innerHTML = '<a href="/reply.aspx?entryId=' + a[x][0] + '">' + a[x][1] + '</a>';
        }
        var r = t.insertRow(0);
        c = r.insertCell(0);
        c.className = 'calendarDetailHeader';
        c.innerHTML = 'Date';
        c = r.insertCell(0);
        c.className = 'calendarDetailHeader';
        c.innerHTML = 'Subject';
        m.appendChild(t);
        new Rendition.Merchant.openMenu(m, o, {});
    },
    /**
    * Recalculates the cart based on the inputs in a DHTMLElement. 
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.DHTMLElement} [args.form] the DOMElement that contains the inputs that makeup the cart or checkout form.
    * @type Native.Function
    * @name Rendition.Merchant.recalculateCart
    * @memberOf Rendition.Merchant
    */
    recalculateCart: function (args) {
        var instance = {};
        if (!window.user) {
            window.user = {
                email: '',
                sessionId: '{00000000-0000-0000-0000-000000000000}',
                userId: -1,
                wholesale: 0
            }
        }
        instance.updatingMessage = args.updatingMessage || '<h2>Updating your cart...</h2>';
        instance.completeRecalculate = function (e) {
            if (e.method1.error !== undefined) {
                if (instance.miniDialog) {
                    instance.miniDialog.HTML(e.method1.description);
                } else {
                    alert(e.method1.description);
                }
                return;
            }
            if (e.method1.Recalculate.error != 0) {
                if (instance.miniDialog) {
                    instance.miniDialog.HTML(e.method1.Recalculate.description);
                } else {
                    alert(e.method1.Recalculate.description);
                }
                return;
            }
            if (instance.miniDialog) {
                instance.miniDialog.close();
            }
            e = e.method1.Recalculate;
            var zipFilled = true;
            for (var x = 0; e.addresses.length > x; x++) {
                /* there should be a global 'user' object by now
                The header.master file should set this object.
                */
                if (e.addresses[x].Id === user.sessionId) {
                    if (e.addresses[x].Zip.length === 0) {
                        zipFilled = false;
                    }
                }
            }
            for (var x = 0; e.addresses.length > x; x++) {
                if (a !== undefined) { continue; }
                var a = document.getElementById(Rendition.Merchant.encodeXMLId(e.addresses[x].Id));
                if (a) {
                    var r = e.addresses[x].Rates;
                    while (a.options.length > 0) {
                        a.remove(a.options[0]);
                    }
                    for (var y = 0; r.length > y; y++) {
                        if (r[y].ShowsUpInRetailCart ||
                        (window.user.wholesale === 1 && r[y].ShowsUpInWholesaleCart)) {
                            var opt = document.createElement('option');
                            opt.value = r[y].Id;
                            if (r[y].id != -1) {
                                opt.text = r[y].Name + ' $' + r[y].EstShippingCost.toFixed(2);
                            } else {
                                opt.text = "ZIP codes required";
                            }
                            if (r.length == 1 || r[y].Id != -1) {
                                try {
                                    a.add(opt, null); // standards compliant; doesn't work in IE
                                }
                                catch (ex) {
                                    a.add(opt); // IE only
                                }
                            }
                            if (e.addresses[x].Rate != null) {
                                if (e.addresses[x].Rate.Id == r[y].Id) {
                                    opt.selected = "selected";
                                }
                            }
                        }
                    }
                }
            }
            if (r === undefined) { var r = { length: 0} };
            if (zipFilled && r.length == 1 && a) {
                var opt = document.createElement('option');
                opt.value = -1;
                opt.text = "Invalid ZIP code";
                try {
                    a.add(opt, null); // standards compliant; doesn't work in IE
                }
                catch (ex) {
                    a.add(opt); // IE only
                }
                new Rendition.Merchant.pointOutAProblem({
                    obj: a,
                    message: "A quote for your shipping charges will be sent to you within 1 business day.",
                    fixMessage: "Ok",
                    onFixProbelm: function (e) {
                        return false;
                    }
                });
                window.shippingWarning = true;
            } else {
                window.shippingWarning = false;
            }
            if (args.recalculateCallbackProcedure === undefined) {
                $('#subTotal').html('$' + e.subTotal.toFixed(2));
                $('#discountTotal').html('$' + e.discountTotal.toFixed(2));
                $('#taxTotal').html('$' + e.taxTotal.toFixed(2));
                $('#estShipTotal').html('$' + e.estShipTotal.toFixed(2));
                $('#grandTotal').html('$' + e.grandTotal.toFixed(2));
            } else {
                args.recalculateCallbackProcedure.apply(instance, [e, instance]);
            }
        }
        instance.init = function (e) {
            var inputs = Rendition.Merchant.getInputs(args.form);
            inputs.billToEmail = "";
            inputs.billToComments = "";
            inputs.billToEmailAds = false;
            inputs.billToCompany = "";
            inputs.shipToEmail = "";
            inputs.shipToComments = "";
            inputs.shipToEmailAds = false;
            inputs.shipToCompany = "";
            inputs.billToSendShipmentUpdates = false;
            inputs.billToSpecialInstructions = "";
            inputs.billToRateId = -1;
            if (args.form === undefined) { return; }
            if (args.hideDialog === undefined || args.hideDialog == false) {
                instance.miniDialog = new Rendition.Merchant.MiniDialog({
                    HTML: instance.updatingMessage,
                    height: 90,
                    dialogClass: instance.dialogClass,
                    animate: false
                });
            }
            $.ajax({
                type: "POST",
                url: Rendition.Merchant.responderURL,
                data: 'method1=["Recalculate",[' + JSON.stringify(inputs) + ']]',
                processData: false,
                dataType: "json",
                error: function (e) {
                    instance.miniDialog.close();
                    Rendition.Merchant.ajaxError(e);
                },
                success: instance.completeRecalculate
            });
        }
        instance.init();
    },
    /**
    * Creates a gallery dialog (DIV) that displays a list of gallery 
    * images based on the Id of a single image in the gallery. 
    * This constructor is also used by the galleryRotator constructor.
    * @constructor
    * @name Rendition.Merchant.Gallery
    * @memberOf Rendition.Merchant
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.Object} [args.pageAlign={x: 'right', y: 'bottom'}] Where to align the page buttons.
    * @param {Native.Object} [args.animationTimer='fast'] time for the animation to complete default. JQuery, 'fast', 'slow', 100 etc..
    * @param {Native.Object} [args.animationEasing='linear'] animation easing method using avaliable JQuery easing methods: 'swing', 'linear'.
    * @param {Native.DHTMLElement} [args.img=''] the gallery image that belongs to the gallery, image must contain the attribute galleryId with the gallery's UUID.
    * @param {Native.String} [args.galleryId=''] the galleryId, used instead of passing the galleryId attribute in the image argument.
    * @param {Native.String} [args.pageText='<page>'] text that appears on each button.  The string <page> will be replaced with the page number.
    * @param {Native.String} [args.pageClass='galleryPages'] the CSS class the page buttons use.
    * @param {Native.Boolean} [args.alwaysShowPages=false] if true, the pages are shown even when the mouse isn't hovering over the dialog.
    * @param {Native.String} [args.previousText='&lArr;'] The text to display on the 'previous' button.
    * @param {Native.String} [args.nextText='&rArr;'] The text to display on the 'next' button.
    * @param {Native.String} [args.closeClass='galleryClose'] the CSS class the 'close' button uses.
    * @param {Native.String} [args.previousClass='previous'] the CSS class the 'previous' button uses.
    * @param {Native.String} [args.frameClass='frame gallery'] the CSS class the gallery DIV uses.
    * @param {Native.String} [args.URL=''] override the default responder URL.
    * @param {Native.String} [args.pageActiveClass='galleryActivePage'] the CSS class the 'active page' uses.
    * @param {Native.Function} [args.frameAnimate=Rendition.Merchant.Gallery.defaultAnimate] procedure to use to animate images changing. Signature: (DIV frame,IMG oldImage,IMG newImage)
    * @param {Native.Object} [args.rect=''] rectange used for the height and width of the background div. looks like { x:Integer, y:Integer }
    */
    Gallery: function (args) {
        if (args === undefined) { args = {} }
        var instance = {}
        instance.rect = {
            height: 600,
            width: 900
        }
        if (args.img) {
            instance.originalId = args.img.getAttribute('imageId');
        }
        if (args.rect !== undefined) {
            instance.rect = args.rect;
        }
        instance.margin = {
            top: 20
        }
        instance.pageMargin = 5;
        instance.pageAlign = args.pageAlign || { x: 'right', y: 'bottom' }
        instance.index = 0;
        instance.images = [];
        instance.navigation = {
            pages: []
        }
        instance.defaultAnimateInterval = args.interval || 'fast';
        instance.animationEasing = args.animationEasing || 'linear';
        instance.initCallback = function (e) {
            instance.images = [];
            instance.imagePaths = [];
            if (instance.originalId !== undefined) {
                for (var x = 0; e.length > x; x++) {
                    if (e[x].LocationType == 'f') {/* full size image */
                        if (e[x].Id == instance.originalId) {
                            instance.index = instance.imagePaths.length;
                        }
                        instance.imagePaths.push(e[x].Url);
                    }
                }
            } else if (args.galleryId !== undefined) {
                e = e.method1.GetGallery.gallery.Images;
                for (var x = 0; e.length > x; x++) {
                    instance.imagePaths.push(e[x].Full);
                }
            }
            var h = instance.imagePaths.length;
            if (h == 0) { h = 1 } // if only 1 image in the collection then make sure the loop still runs
            for (var x = 0; h > x; x++) {
                var pageText = (x + 1);
                if (args.pageText !== undefined) {
                    pageText = args.pageText.replace('<page>', (x + 1));
                }
                var page = document.createElement('button');
                page.style.cursor = 'pointer';
                page.onmousedown = function (e) {
                    if (e) {
                        e.preventDefault();
                    }
                    return false;
                }
                page.className = args.pageClass || 'galleryPages';
                var showPages = args.alwaysShowPages === undefined ? false : args.alwaysShowPages;
                if (showPages) {
                    page.style.visibility = 'hidden';
                }
                page.index = parseInt(x);
                page.style.position = 'absolute';
                page.onclick = function () {
                    if (this.index == instance.index) { return; }
                    instance.index = this.index;
                    $(instance.oldImage).stop(true, true);
                    $(instance.currentImage).stop(true, true);
                    instance.loadImage(this.index);
                    $(instance.oldImage).stop(true, true);
                    $(instance.currentImage).stop(true, true);
                }
                page.innerHTML = pageText;

                if (instance.imagePaths.length > 1) {
                    instance.frame.appendChild(page);
                }

                instance.navigation.pages.push(page);
                var i = new Image();
                i.setAttribute('path', instance.imagePaths[x]);
                i.loaded = false;
                i.className = args.imageClass || 'gallery';
                Rendition.Merchant.appendEvent('load', i, function () {
                    this.loaded = true;
                    if (this.addEventListener) {
                        this.frameAnimate();
                    } else {
                        if (instance.oldImage) {
                            instance.frame.removeChild(instance.oldImage);
                        }
                        instance.frame.appendChild(instance.currentImage);
                    }
                }, false);
                i.frameAnimate = function () {
                    instance.frameAnimate(instance.oldImage, instance.currentImage);
                }
                i.image = instance.images[x];
                i.index = x;
                instance.images.push(i);
            }
            if (instance.imagePaths.length > 1) {
                instance.frame.appendChild(instance.navigation.previous);
                instance.frame.appendChild(instance.navigation.next);
            }
            instance.frame.style.height = '10px';
            instance.frame.style.width = '10px';
            instance.frame.style.textAlign = 'left'; /* must remain left for button positioning to work */
            instance.navigation.previous.innerHTML = args.previousText !== undefined ? args.previousText : '&lArr;';
            instance.navigation.next.innerHTML = args.nextText !== undefined ? args.nextText : '&rArr;';
            instance.closeButton.innerHTML = args.closeText !== undefined ? args.closeText : 'Close';
            instance.closeButton.onclick = instance.dispose;
            instance.frame.appendChild(instance.closeButton);
            document.body.appendChild(instance.frame);
            document.body.appendChild(instance.modalBackground);

            $(instance.frame).animate({ width: instance.rect.width, left: instance.finalLeft }, instance.defaultAnimateInterval, instance.animationEasing, function () {
                $(instance.frame).animate({ height: instance.rect.height }, instance.defaultAnimateInterval, instance.animationEasing, function () {
                    instance.loadImage(instance.index);
                    instance.positionButtons();
                });
            });
        }
        instance.positionButtons = function () {
            var h = instance.navigation.pages.length;
            var x = 0;
            var y = 0;
            var pH = instance.navigation.pages[0].offsetHeight;
            var pW = instance.navigation.pages[0].offsetWidth;
            var totalW = (instance.navigation.pages.length * (pW + instance.pageMargin));
            var rx = 0;
            var pbH = instance.navigation.previous.offsetHeight;
            var pbW = instance.navigation.previous.offsetWidth;
            var nbH = instance.navigation.next.offsetHeight;
            var nbW = instance.navigation.next.offsetWidth;

            instance.closeButton.style.marginLeft = (instance.rect.width - instance.pageMargin - instance.closeButton.offsetWidth) + 'px';

            instance.navigation.previous.style.marginTop = (parseInt(instance.rect.height / 2) + parseInt(pbH / 2) - pbH) + 'px';
            instance.navigation.previous.style.marginLeft = instance.pageMargin + 'px';

            instance.navigation.next.style.marginTop = (parseInt(instance.rect.height / 2) + parseInt(nbH / 2) - nbH) + 'px';
            instance.navigation.next.style.marginLeft = ((instance.rect.width - instance.pageMargin) - nbW) + 'px';

            for (var x = h - 1; -1 < x; x--) {
                var p = instance.navigation.pages[x];
                if (instance.pageAlign.y == 'top') {
                    p.style.marginTop = instance.pageMargin + 'px';
                } else {
                    p.style.marginTop = (instance.rect.height - instance.pageMargin - pH) + 'px';
                }
                if (instance.pageAlign.x == 'right') {
                    p.style.marginLeft = (instance.frame.offsetWidth - (pW + instance.pageMargin) - rx) + 'px';
                } else {
                    p.style.marginLeft = (instance.pageMargin + rx) + 'px';
                }
                rx += instance.pageMargin + pW;
            }
        }
        instance.resize = function () {
            var p = {
                t: document.documentElement.scrollTop,
                l: document.documentElement.scrollLeft,
                h: document.documentElement.clientHeight,
                w: document.documentElement.clientWidth
            }
            instance.modalBackground.style.height = p.h + 'px';
            instance.modalBackground.style.width = p.w + 'px';
            instance.modalBackground.style.top = p.t + 'px';
            instance.modalBackground.style.left = p.l + 'px';
            instance.frame.style.top = instance.finalTop() + 'px';
            instance.frame.style.left = (document.documentElement.clientWidth / 2 - (instance.rect.width / 2)) + 'px';
        }
        instance.finalTop = function () { return document.documentElement.scrollTop + instance.margin.top }
        instance.init = function () {
            instance.frame = document.createElement('div');
            instance.frame.style.position = 'absolute';
            instance.frame.style.zIndex = '9997';
            instance.closeButton = document.createElement('button');
            instance.navigation.previous = document.createElement('button');
            instance.navigation.next = document.createElement('button');
            instance.modalBackground = document.createElement('div');
            instance.modalBackground.style.background = 'url(/img/25PctAlphaBlackDot.png)';
            instance.modalBackground.style.position = 'absolute';
            instance.modalBackground.style.zIndex = '9996';
            instance.modalBackground.onclick = instance.dispose;

            instance.navigation.previous.onclick = function (e) {
                $(instance.oldImage).stop(true, true);
                $(instance.currentImage).stop(true, true);
                instance.index = instance.index == 0 ? instance.images.length - 1 : instance.index - 1;
                instance.loadImage(instance.index);
                $(instance.oldImage).stop(true, true);
                $(instance.currentImage).stop(true, true);
                if (e) {
                    e.preventDefault();
                }
                return false;
            }

            instance.navigation.next.onclick = function (e) {
                $(instance.oldImage).stop(true, true);
                $(instance.currentImage).stop(true, true);
                instance.index = instance.index == instance.images.length - 1 ? 0 : instance.index + 1;
                instance.loadImage(instance.index);
                $(instance.oldImage).stop(true, true);
                $(instance.currentImage).stop(true, true);
                if (e) {
                    e.preventDefault();
                }
                return false;
            }

            instance.navigation.next.className = args.nextClass || 'galleryNext';
            instance.navigation.next.style.position = 'absolute';
            instance.closeButton.className = args.closeClass || 'galleryClose';
            instance.closeButton.style.position = 'absolute';
            instance.navigation.previous.className = args.previousClass || 'galleryPrevious';
            instance.navigation.previous.style.position = 'absolute';
            instance.frame.className = args.frameClass || 'frame gallery';
            Rendition.Merchant.appendEvent('resize', window, instance.resize, false);
            Rendition.Merchant.appendEvent('scroll', window.document, instance.resize, false);
            instance.resize();
            instance.finalLeft = (document.documentElement.clientWidth / 2) - (instance.rect.width / 2);
            if (args.galleryId !== undefined && args.data == undefined) {
                var request = [
				    'GetGallery',
				    [args.galleryId]
			    ]
                args.data = 'method1=' + encodeURIComponent(JSON.stringify(request));
            } else if (instance.originalId !== undefined && args.data == undefined) {
                var request = [
				    'GetImagesByImageId',
				    [instance.originalId]
			    ]
                args.data = 'method1=' + encodeURIComponent(JSON.stringify(request));
            }
            $.ajax({
                type: "POST",
                url: args.URL || Rendition.Merchant.responderURL,
                data: args.data,
                processData: false,
                dataType: "json",
                error: Rendition.Merchant.ajaxError,
                success: instance.initCallback
            });
        }
        instance.dispose = function () {
            if (instance.frame.parentNode == document.body) { document.body.removeChild(instance.frame); }
            if (instance.modalBackground.parentNode == document.body) { document.body.removeChild(instance.modalBackground) }
            Rendition.Merchant.removeEvent('resize', window, instance.resize, false);
            Rendition.Merchant.removeEvent('scroll', window.document, instance.resize, false);
            instance.frame = undefined;
            instance.frame = instance.modalBackground;
            instance = undefined;
        }
        instance.loadImage = function (imageIndex) {
            var h = instance.navigation.pages.length;
            for (var x = 0; h > x; x++) {
                instance.navigation.pages[x].className = args.pageClass || 'galleryPages';
                instance.navigation.pages[x].style.position = 'absolute';
            }
            if (h > 0) {
                instance.navigation.pages[imageIndex].className = args.pageActiveClass || 'galleryActivePage';
            }
            instance.oldImage = instance.currentImage;
            instance.currentImage = instance.images[imageIndex];

            if (instance.currentImage === undefined) {
                instance.currentImage = instance.images[0];
            }

            if (instance.currentImage.loaded) {
                instance.currentImage.frameAnimate();
            } else {
                instance.currentImage.src = instance.currentImage.getAttribute('path');
            }
        }
        instance.frameAnimate = function (oldImage, newImage) {
            var callback = function () {
                var h = instance.frame.childNodes.length;
                for (var x = 0; h > x; x++) {
                    if (instance.frame.childNodes[x] == oldImage) {
                        instance.frame.removeChild(oldImage);
                    }
                }
                callbackProcedure.call();
            }
            if (typeof args.frameAnimate == 'function') {
                args.frameAnimate.apply(instance, [instance.frame, oldImage, newImage]);
            } else {
                instance.defaultAnimate(instance.frame, oldImage, newImage);
            }
        }
        instance.defaultAnimate = function (frame, oldImage, newImage) {
            /* 
            the old image starts as the only element in the frame
            your job, if you choose to replace this default function,
            is to get the new image in the frame and remove the old image
            and do it in a stylish way - then call the callback procedure
            using call or apply
            */

            newImage.style.position = 'absolute';
            newImage.style.opacity = 0;
            newImage.style.left = ((frame.offsetWidth / 2) - (newImage.width / 2)) + 'px';
            newImage.style.top = ((frame.offsetHeight / 2) - (newImage.height / 2)) + 'px';
            frame.appendChild(newImage);
            /* if you fade all the way out JQuery likes to be "helpfull" and remove the node */
            $(oldImage).animate({ opacity: .01 }, instance.defaultAnimateInterval);
            $(newImage).animate({ opacity: 1 }, instance.defaultAnimateInterval);
        }


        instance.init();
    },
    /**
    * Creates a gallery dialog (DIV) that displays a list of gallery 
    * images based on the Id of a single image in the gallery. 
    * This constructor is also used by the galleryRotator constructor.
    * @constructor
    * @name Rendition.Merchant.GalleryRotator
    * @memberOf Rendition.Merchant
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.Object} [args.pageAlign={x: 'right', y: 'bottom'}] Where to align the page buttons.
    * @param {Native.Float} [args.interval=1000.00] time in ms to wait between images.
    * @param {Native.Float} [args.defaultAnimateInterval=2000.00] how long it takes for animations to occur.
    * @param {Native.String} [args.pauseText='||'] HTML to display on the play/pause button when it is paused.
    * @param {Native.String} [args.transportPlayClass='galleryPlay'] the class the 'play/pause' button uses while playing.
    * @param {Native.String} [args.transportClass='galleryPlay'] the class the 'play/pause' button uses while not playing.
    * @param {Native.String} [args.playText='&rang;'] text to display on the play/pause button when it is playing.
    * @param {Native.String} [args.nextClass='galleryNext'] the CSS class the 'next' button uses.
    * @param {Native.String} [args.previousClass='galleryPrevious'] the CSS class the 'previous' button uses.
    * @param {Native.String} [args.pageRect] the offset rect for the page elements.  This effectively moves the page elements around using margins.
    * @param {Native.String} [args.frameClass='frameClass'] the CSS the frame DIV uses.
    * @param {Native.String} [args.pageClass='galleryPages'] the CSS class the page buttons use.
    * @param {Native.String} [args.pageActiveClass='galleryActivePage'] the CSS class the 'active page' uses.
    * @param {Native.String} [args.mouseOverPause=true] when the user hovers over the image does the image stop moving.
    * @param {Native.String} [args.alwaysShowPages=false] if true, the pages are shown even when the mouse isn't hovering.
    * @param {Native.Function} [args.frameAnimate=Rendition.Merchant.Gallery.defaultAnimate] procedure to use to animate images changing. Signature: (DIV frame,IMG oldImage,IMG newImage)
    */
    GalleryRotator: function (args) {
        /* identifiy the gallery */
        if (args === undefined) { args = {} }
        var image = args.image;
        var id = image.getAttribute('galleryId');
        if (id === undefined) { return; }
        var instance = {}
        instance.pageMargin = 5;
        instance.pageAlign = args.pageAlign || { x: 'right', y: 'bottom' }
        if (args.mouseOverPause === true || args.mouseOverPause === undefined) {
            instance.mouseOverPause = true;
        } else {
            instance.mouseOverPause = false;
        }
        instance.pageRect = args.pageRect || { h: 0, w: 0, x: 0, y: 0 }
        instance.index = 0;
        instance.images = [];
        instance.navigation = {
            pages: []
        }
        instance.initalImage = image;
        instance.interval = args.interval || 1000;
        instance.defaultAnimateInterval = args.animateInterval || 2000;
        instance.transportPlay = args.playTransport || true;
        instance.frameMouseover = function (e) {
            if (instance.mouseOverPause) {
                instance.transportPlay = false;
                $(instance.oldImage).stop(true, true);
                $(instance.currentImage).stop(true, true);
                instance.showTransport();
                instance.navigation.transport.innerHTML = args.pauseText !== undefined ? args.pauseText : '||';
                clearTimeout(instance.timer);
                instance.timer = undefined;
                e.cancelBubble = true;
            }
        }
        instance.frameMouseout = function (e) {
            instance.transportPlay = true;
            $(instance.oldImage).stop(true, true);
            $(instance.currentImage).stop(true, true);
            instance.hideTransport();
            if (instance.timer !== undefined) {
                clearTimeout(instance.timer);
            }
            instance.timer = setTimeout(instance.elapsed, instance.interval);
            e.cancelBubble = true;
        }
        instance.initCallback = function (e) {
            if (e.method1.error !== undefined) { return; }
            if (e.method1.GetGallery.error != 0) { return; }
            instance.gallery = e.method1.GetGallery.gallery;
            /* create a div that will lay on top of the image */
            instance.height = instance.initalImage.offsetHeight;
            instance.width = instance.initalImage.offsetWidth;
            instance.frame = document.createElement('div');
            instance.navigation.previous = document.createElement('button');
            instance.navigation.next = document.createElement('button');
            instance.navigation.transport = document.createElement('button');
            instance.navigation.previous.ondblclick = function (e) {
                if (e) {
                    e.preventDefault();
                }
                return false;
            }
            instance.navigation.next.ondblclick = function (e) {
                if (e) {
                    e.preventDefault();
                }
                return false;
            }
            instance.navigation.previous.onclick = function (e) {
                instance.transportPlay = true;
                $(instance.oldImage).stop(true, true);
                $(instance.currentImage).stop(true, true);
                instance.index = instance.index == 0 ? instance.images.length - 1 : instance.index - 1;
                instance.loadImage(instance.index);
                instance.transportPlay = false;
                $(instance.oldImage).stop(true, true);
                $(instance.currentImage).stop(true, true);
                if (e) {
                    e.preventDefault();
                }
                return false;
            }
            instance.navigation.next.onclick = function (e) {
                instance.transportPlay = true;
                $(instance.oldImage).stop(true, true);
                $(instance.currentImage).stop(true, true);
                instance.index = instance.index == instance.images.length - 1 ? 0 : instance.index + 1;
                instance.loadImage(instance.index);
                instance.transportPlay = false;
                $(instance.oldImage).stop(true, true);
                $(instance.currentImage).stop(true, true);
                if (e) {
                    e.preventDefault();
                }
                return false;
            }
            instance.navigation.transport.onclick = function () {
                instance.transportPlay = !instance.transportPlay;
                if (instance.transportPlay) {
                    Rendition.Merchant.removeEvent('mouseover', instance.frame, instance.frameMouseover, true);
                    Rendition.Merchant.appendEvent('mouseover', instance.frame, function (e) {
                        Rendition.Merchant.appendEvent('mouseover', instance.frame, instance.frameMouseover, true);
                        Rendition.Merchant.removeEvent('mouseover', instance.frame, arguments.callee, true);
                        e.cancelBubble = true;
                        if (e) {
                            e.preventDefault();
                        }
                        return false;
                    }, true);
                    instance.navigation.transport.className = args.transportPlayClass || 'galleryPlay';
                    instance.navigation.transport.innerHTML = args.playText !== undefined ? args.playText : '&rang;';
                    instance.hideTransport();
                    if (instance.timer !== undefined) {
                        clearTimeout(instance.timer);
                    }
                    instance.timer = setTimeout(instance.elapsed, instance.interval);
                } else {
                    instance.navigation.transport.className = args.transportPauseClass || 'galleryPause';
                    instance.navigation.transport.innerHTML = args.pauseText !== undefined ? args.pauseText : '||';
                }
            }
            instance.navigation.next.className = args.nextClass || 'galleryNext';
            instance.navigation.next.style.position = 'absolute';
            instance.navigation.next.style.visibility = 'hidden';
            instance.navigation.previous.className = args.previousClass || 'galleryPrevious';
            instance.navigation.previous.style.position = 'absolute';
            instance.navigation.previous.style.visibility = 'hidden';
            instance.navigation.transport.className = args.transportClass || 'galleryPlay';
            instance.navigation.transport.style.position = 'absolute';
            instance.navigation.transport.style.visibility = 'hidden';
            instance.frame.className = args.frameClass || 'frame';
            if (instance.initalImage.style.position == 'absolute' || instance.initalImage.style.position == 'relative') {
                instance.frame.style.top = instance.initalImage.style.top;
                instance.frame.style.left = instance.initalImage.style.left;
            }
            instance.frame.style.display = instance.initalImage.style.display || 'inline-block';
            instance.badIE = !(navigator.userAgent.indexOf('MSIE 7') == -1 && navigator.userAgent.indexOf('MSIE 6') == -1);
            if (!instance.badIE) {
                instance.frame.style.position = instance.initalImage.style.position || 'inherit';
            }
            instance.frame.style.margin = instance.initalImage.style.margin || '0';
            instance.frame.style.border = instance.initalImage.style.border || 'none';
            instance.frame.style.height = instance.initalImage.offsetHeight + 'px';
            instance.frame.style.width = instance.initalImage.offsetWidth + 'px';
            instance.frame.style.overflow = 'hidden';
            Rendition.Merchant.appendEvent('mouseover', instance.frame, instance.frameMouseover, true);
            Rendition.Merchant.appendEvent('mouseout', instance.frame, instance.frameMouseout, true);
            instance.initalImage.parentNode.insertBefore(instance.frame, instance.initalImage);
            instance.initalImage.style.position = 'absolute';
            var h = instance.gallery.Images.length;
            if (h == 0) { h = 1 } // if only 1 image in the collection then make sure the loop still runs
            for (var x = 0; h > x; x++) {
                var pageText = (x + 1);
                if (args.pageText !== undefined) {
                    pageText = args.pageText.replace('<page>', (x + 1));
                }
                var page = document.createElement('button');
                page.style.cursor = 'pointer';
                page.onmousedown = function (e) {
                    if (e) {
                        e.preventDefault();
                    }
                    return false;
                }
                if (x == 0) {
                    page.className = args.pageActiveClass || 'galleryActivePage';
                } else {
                    page.className = args.pageClass || 'galleryPages';
                }
                var showPages = args.alwaysShowPages === undefined ? false : args.alwaysShowPages;
                if (!showPages) {
                    page.style.visibility = 'hidden';
                }
                page.index = parseInt(x);
                page.style.position = 'absolute';
                page.onclick = function () {
                    if (this.index == instance.index) { return; }
                    instance.index = this.index;
                    $(instance.oldImage).stop(true, true);
                    $(instance.currentImage).stop(true, true);
                    instance.transportPlay = true;
                    instance.loadImage(this.index);
                    $(instance.oldImage).stop(true, true);
                    $(instance.currentImage).stop(true, true);
                    instance.transportPlay = false;
                }
                page.innerHTML = pageText;
                instance.navigation.transport.innerHTML = args.playText !== undefined ? args.playText : '||';
                instance.navigation.previous.innerHTML = args.previousText !== undefined ? args.previousText : '&lArr;';
                instance.navigation.next.innerHTML = args.nextText !== undefined ? args.nextText : '&rArr;';
                instance.frame.appendChild(page);
                instance.frame.appendChild(instance.navigation.previous);
                instance.frame.appendChild(instance.navigation.next);
                instance.frame.appendChild(instance.navigation.transport);
                instance.navigation.pages.push(page);
                if (x == 0) {
                    var i = instance.initalImage;
                    instance.currentImage = i;
                    i.loaded = true;
                } else {
                    var i = new Image();
                    i.loaded = false;
                }
                i.data = instance.gallery.Images[x];
                i.className = args.imageClass || 'gallery';
                Rendition.Merchant.appendEvent('load', i, function () {
                    this.loaded = true;
                    this.frameAnimate();
                }, false);
                i.frameAnimate = function () {
                    instance.frameAnimate(instance.oldImage, instance.currentImage, function () {
                        if (instance.timer !== undefined) {
                            clearTimeout(instance.timer);
                            instance.timer = undefined;
                        }
                        instance.timer = setTimeout(instance.elapsed, instance.interval);
                    });
                }
                i.gallery = instance.gallery;
                i.image = instance.gallery.Images[x];
                i.onclick = args.onclick || function () {
                    new gallery({ galleryId: this.gallery.Id, rect: args.rect });
                };
                i.index = x;
                instance.images.push(i);
            }
            var showPages = args.alwaysShowPages === undefined ? false : args.alwaysShowPages;
            if (!showPages) {
                var h = instance.navigation.pages.length;
                for (var x = 0; h > x; x++) {
                    instance.navigation.pages[x].style.visibility = 'hidden';
                }
            }
            instance.frame.appendChild(instance.initalImage);
            instance.positionButtons();
            instance.timer = setTimeout(instance.elapsed, instance.interval);
        }
        instance.showTransport = function () {
            instance.navigation.next.style.visibility = 'visible';
            instance.navigation.previous.style.visibility = 'visible';
            instance.navigation.transport.style.visibility = 'visible';
            var showPages = args.alwaysShowPages === undefined ? false : args.alwaysShowPages;
            if (!showPages) {
                var h = instance.navigation.pages.length;
                for (var x = 0; h > x; x++) {
                    instance.navigation.pages[x].style.visibility = 'visible';
                }
            }
        }
        instance.hideTransport = function () {
            instance.navigation.next.style.visibility = 'hidden';
            instance.navigation.previous.style.visibility = 'hidden';
            instance.navigation.transport.style.visibility = 'hidden';
            var showPages = args.alwaysShowPages === undefined ? false : args.alwaysShowPages;
            if (!showPages) {
                var h = instance.navigation.pages.length;
                for (var x = 0; h > x; x++) {
                    instance.navigation.pages[x].style.visibility = 'hidden';
                }
            }
        }
        instance.positionButtons = function () {
            var h = instance.navigation.pages.length;
            var x = 0;
            var y = 0;
            var pH = instance.navigation.pages[0].offsetHeight;
            var pW = instance.navigation.pages[0].offsetWidth;
            var totalW = (instance.navigation.pages.length * (pW + instance.pageMargin));
            var rx = 0;
            var pbH = instance.navigation.previous.offsetHeight;
            var pbW = instance.navigation.previous.offsetWidth;
            var nbH = instance.navigation.next.offsetHeight;
            var nbW = instance.navigation.next.offsetWidth;
            var tbW = instance.navigation.transport.offsetWidth;
            var tbH = instance.navigation.transport.offsetHeight;
            instance.navigation.previous.style.marginTop = (parseInt(instance.height / 2) + parseInt(pbH / 2) - pbH) + 'px';
            instance.navigation.previous.style.marginLeft = instance.pageMargin + 'px';

            instance.navigation.next.style.marginTop = (parseInt(instance.height / 2) + parseInt(nbH / 2) - nbH) + 'px';
            instance.navigation.next.style.marginLeft = ((instance.width - instance.pageMargin) - nbW) + 'px';

            instance.navigation.transport.style.marginTop = (parseInt(instance.height / 2) + parseInt(tbH / 2) - tbH) + 'px';
            instance.navigation.transport.style.marginLeft = ((tbW / 2) + (instance.width / 2) - tbW) + 'px';

            for (var x = h - 1; -1 < x; x--) {
                var p = instance.navigation.pages[x];
                if (instance.pageAlign.y == 'top') {
                    p.style.marginTop = (instance.pageMargin + instance.pageRect.y) + 'px';
                } else {
                    p.style.marginTop = ((instance.height - instance.pageMargin - pH) + instance.pageRect.y) + 'px';
                }
                if (instance.pageAlign.x == 'right') {
                    p.style.marginLeft = ((instance.frame.offsetWidth - (pW + instance.pageMargin) - rx) + instance.pageRect.x) + 'px';
                } else {
                    p.style.marginLeft = ((instance.pageMargin + rx) + instance.pageRect.x) + 'px';
                }
                rx += instance.pageMargin + pW;
            }
        }
        instance.init = function () {
            /* fetch all the other images via an ajax request */
            var request = [
			    'GetGallery',
			    [id]
		    ]
            $.ajax({
                type: "POST",
                url: Rendition.Merchant.responderURL,
                data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
                processData: false,
                dataType: "json",
                error: Rendition.Merchant.ajaxError,
                success: instance.initCallback
            });

        }
        instance.elapsed = function () {
            if (!instance.transportPlay) { return }
            /* time has passed so load another image */
            instance.index = instance.currentImage.index + 1;
            if (instance.index == instance.gallery.Images.length) {
                instance.index = 0;
            }
            instance.loadImage(instance.index);
        }
        instance.loadImage = function (imageIndex) {
            if (!instance.transportPlay) { return }
            var h = instance.navigation.pages.length;
            for (var x = 0; h > x; x++) {
                instance.navigation.pages[x].className = args.pageClass || 'galleryPages';
                instance.navigation.pages[x].style.position = 'absolute';
            }
            if (h > 0) {
                instance.navigation.pages[imageIndex].className = args.pageActiveClass || 'galleryActivePage';
            }
            instance.oldImage = instance.currentImage;
            instance.currentImage = instance.images[imageIndex];
            if (instance.currentImage === undefined) {
                instance.currentImage = instance.images[0];
            }
            var srcs = instance.currentImage.image;
            if (instance.currentImage.loaded) {
                instance.currentImage.frameAnimate();
            } else {
                instance.currentImage.src = srcs.Rotator;
            }
        }
        instance.frameAnimate = function (oldImage, newImage, callbackProcedure) {
            var callback = function () {
                var h = instance.frame.childNodes.length;
                for (var x = 0; h > x; x++) {
                    if (instance.frame.childNodes[x] == oldImage) {
                        instance.frame.removeChild(oldImage);
                    }
                }
                callbackProcedure.call();
            }
            if (typeof args.frameAnimate == 'function') {
                args.frameAnimate.apply(instance, [instance.frame, oldImage, newImage, callback]);
            } else {
                instance.defaultAnimate(instance.frame, oldImage, newImage, callback);
            }
        }
        instance.defaultAnimate = function (frame, oldImage, newImage, callbackProcedure) {
            /* 
            the old image starts as the only element in the frame
            your job, if you choose to replace this default function,
            is to get the new image in the frame and remove the old image
            and do it in a stylish way - then call the callback procedure
            using call or apply
            */
            newImage.style.position = 'absolute';
            newImage.style.opacity = 0;
            frame.appendChild(newImage);
            /* if you fade all the way out JQuery likes to be "helpfull" and remove the node */
            $(oldImage).animate({ opacity: .01 }, instance.defaultAnimateInterval);
            $(newImage).animate({ opacity: 1 }, instance.defaultAnimateInterval, function () {
                callbackProcedure.call();
            });
        }
        instance.init();
    },
    /**
    * Logs the user off.
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.DHTMLElement} [args.infoId] Id of a DHTML element that should contain a link to log back on after logoff success.
    * @param {Native.Function} [args.callbackProcedure] procedure to execute after logoff success.
    * @type Native.Function
    * @name Rendition.Merchant.logoff
    * @memberOf Rendition.Merchant
    */
    LogOff: function (args) {
        var request = [
		    'LogOff',
		    [{}]
	    ]
        $.ajax({
            type: "POST",
            url: Rendition.Merchant.responderURL,
            data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
            processData: false,
            dataType: "json",
            error: Rendition.Merchant.ajaxError,
            success: function (e) {
                window.user = {
                    email: '',
                    userId: -1
                }
                window.loggedon = false;
                if (args.infoId !== undefined) {
                    var info = document.getElementById(args.infoId);
                    info.innerHTML = '<a onclick="javascript:Rendition.Merchant.LogOn({infoId:\'logonInfo\'});">Logon</a>';
                }
                if (args.callbackProcedure !== undefined) {
                    args.callbackProcedure.apply(this, [e]);
                }
                if (window.location.toString().match(/^.*(cart|checkout)*.$/)) {
                    window.location = '/';
                }
            }
        });
    },
    /**
    * logs the user onto the system using a dialog (DIV) with fields and buttons nessessary to do so.
    * The LogOn procedure organicly contains a method to create accounts.  A create account button is also provided.
    * using Rendition.dll -> site.LogOn.
    * Also includes a seperate function to retreive a lost password via Rendition.dll lostPassword email event handler.
    * @constructor
    * @name Rendition.Merchant.LogOn
    * @memberOf Rendition.Merchant
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.Integer} [args.width=300] Width of the dialog in pixles.
    * @param {Native.Integer} [args.height=120] height of the dialog in pixles.
    * @param {Native.Integer} [args.marginTop=50] how far away the dialog should be placed from the top of the window.
    * @param {Native.Object} [args.animationTimer='fast'] time for the animation to complete default. JQuery, 'fast', 'slow', 100 etc..
    * @param {Native.Object} [args.animationEasing='linear'] animation easing method using avaliable JQuery easing methods: 'swing', 'linear'.
    * @param {Native.String} [args.forgotPasswordMessage='Enter your email address in the email field above and press Reset Password to have 
    * your password reset and sent to your email inbox.'] animation easing method using avaliable JQuery easing methods: 'swing', 'linear'.
    * @param {Native.String} [args.successColor='green'] color of the message that appears when LogOn is successful.
    * @param {Native.String} [args.errorColor='red'] color of the message that displays errors (wrong password etc).
    * @param {Native.Integer} [args.successMessageDelay=2500] number of miliseconds for the success message to stay before the dialog is closed.
    * @param {Native.Integer} [args.infoId=''] Id of the DHTML element that should contain a link to logoff once the user is succussfully logged on.
    * The link looks like <a onclick="javascript:logoff({infoId:\'LogOnInfo\'});">Logoff</a>.
    * @param {Native.Function} [args.cancelCallbackProcedure] the procedure to execute if the user clicks the cancel button to close the dialog.
    * @param {Native.Function} [args.callbackProcedure] the procedure to execute once the user is successfully logged on.
    * @param {Native.Function} [args.LogOnTryCallback] the procedure to execute when the LogOn procedure returns. 
    * This procedure runs before callbackProcedure and can intercept failed LogOns etc..  Signature: (JSON status,DHTMLElement element ,Object args).
    *     <table>
    *       <title>Return Status Codes for args.LogOnTryCallback</title>
    *       <tableHeader>
    *           <row>
    *               <entry><para>Status Code</para></entry>
    *               <entry><para>Definition</para></entry>
    *           </row>
    *           </tableHeader>
    *       <row>
    *           <entry><para>-10 </para></entry>
    *           <entry><para>Account already exists</para></entry>
    *       </row>
    *       <row>
    *           <entry><para>-20</para></entry>
    *           <entry><para>Incorrect name/password</para></entry>
    *       </row>
    *       <row>
    *           <entry><para>-30 </para></entry>
    *           <entry><para>LogOn attempt limit reached</para></entry>
    *       </row>
    *       <row>
    *           <entry><para>-40 </para></entry>
    *           <entry><para>UserId key is in an incorrect format</para></entry>
    *       </row>
    *     </table>
    */
    LogOn: function (args) {
        var instance = {}
        if (args === undefined) {
            args = {}
        }
        instance.margin = {
            top: args.marginTop || 50
        }
        instance.rect = {
            width: args.width || 300,
            height: args.height || 120
        }
        instance.animationTimer = args.animationTimer || 'fast';
        instance.animationEasing = args.animationEasing || 'linear';
        instance.LogOnCancel = function () {
            if (args.cancelCallbackProcedure !== undefined) {
                args.cancelCallbackProcedure.apply(this, [instance]);
            }
            instance.close();
        }
        instance.close = function () {
            Rendition.Merchant.removeEvent('resize', window, instance.resize, false);
            Rendition.Merchant.removeEvent('scroll', window.document, instance.resize, false);
            document.body.removeChild(instance.modalBackground);
            document.body.removeChild(instance.LogOn);
            instance.modalBackground = undefined;
            instance.LogOn = undefined;
            instance.password = undefined;
            instance.email = undefined;
            instance = undefined;
        }
        instance.resize = function () {
            var p = {
                t: document.documentElement.scrollTop,
                l: document.documentElement.scrollLeft,
                h: document.documentElement.clientHeight,
                w: document.documentElement.clientWidth
            }
            instance.modalBackground.style.height = p.h + 'px';
            instance.modalBackground.style.width = p.w + 'px';
            instance.modalBackground.style.top = p.t + 'px';
            instance.modalBackground.style.left = p.l + 'px';
            instance.LogOn.style.top = instance.finalTop() + 'px';
            instance.LogOn.style.left = (document.documentElement.clientWidth / 2 - (instance.rect.width / 2)) + 'px';
        }
        instance.resetPasswordTryCallback = function (e) {
            if (e.method1.error !== undefined) {
                alert('Exception Error:' + e.method1.error + ":" + e.method1.description);
            }
            if (e.method1.ResetPassword.error != 0) {
                if (e.method1.ResetPassword.error == -1) {
                    instance.errormsg.style.color = args.successColor || 'red';
                    instance.errormsg.innerHTML = args.successPasswordResetMessage ||
				    'Your email address cannot be found.  Check the address and try again.  If you feel there is an error click the contact us link to reach customer support.';
                } else {
                    alert('Exception Error:' + e.method1.ResetPassword.description);
                }
            } else {
                instance.errormsg.style.color = args.successColor || 'green';
                instance.errormsg.innerHTML = args.successPasswordResetMessage ||
			    'Password reset, new password emailed.';
                setTimeout(function () {
                    instance.close();
                }, args.successMessageDelay || 2500);
            }
        }
        instance.tryResetPassword = function () {
            var request = [
			    'ResetPassword',
			    [
				    instance.email.value
			    ]
		    ]
            $.ajax({
                type: "POST",
                url: Rendition.Merchant.responderURL,
                data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
                processData: false,
                dataType: "json",
                error: Rendition.Merchant.ajaxError,
                success: instance.resetPasswordTryCallback
            });
        }
        instance.forgotPassword = function () {
            /* 
            hide the password text and input row, unhide the msg row
            hide the three buttons, unhide button that activates the email thing
            on return display email success/failure then return LogOn buttons and row
            */
            instance.h(instance.forgotPasswordLink);
            instance.errormsg.className = '';
            instance.errormsg.color = 'inherit';
            instance.errormsg.innerHTML = args.forgotPasswordMessage || 'Enter your email address in the email field above and press \'Reset Password\' \
		    to have your password reset and sent to your email inbox.';
            instance.h(instance.cancelButton);
            instance.h(instance.LogOnButton);
            instance.h(instance.createAccountButton);
            instance.s(instance.cancelresetPasswordButton);
            instance.s(instance.resetPasswordButton);
            instance.passwordRow.style.visibility = 'hidden';
            instance.passwordRow.style.display = 'none';
        }
        instance.cancelResetPassword = function () {
            instance.errormsg.innerHTML = '';
            instance.errormsg.style.color = 'inherit';
            instance.errormsg.className = 'errormsg';
            instance.h(instance.cancelresetPasswordButton);
            instance.h(instance.resetPasswordButton);
            instance.s(instance.cancelButton);
            instance.s(instance.LogOnButton);
            instance.s(instance.createAccountButton);
            instance.s(instance.forgotPasswordLink);
            instance.passwordRow.style.visibility = 'visible';
            instance.passwordRow.style.display = 'table-row';
            instance.passwordRow.style.display = 'table-row';
        }
        instance.tryCreateAccount = function () {
            var request = [
			    'CreateAccount',
			    [
				    {
				        email: instance.email.value,
				        password: instance.password.value,
				        showUserData: true
				    }
			    ]
		    ]
            $.ajax({
                type: "POST",
                url: Rendition.Merchant.responderURL,
                data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
                processData: false,
                dataType: "json",
                error: Rendition.Merchant.ajaxError,
                success: instance.createAccountTryCallback
            });
        }
        instance.tryLogOn = function () {
            var request = [
			    'LogOn',
			    [
				    {
				        email: instance.email.value,
				        password: instance.password.value,
				        showUserData: true
				    }
			    ]
		    ]
            $.ajax({
                type: "POST",
                url: Rendition.Merchant.responderURL,
                data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
                processData: false,
                dataType: "json",
                error: Rendition.Merchant.ajaxError,
                success: instance.LogOnTryCallback
            });
        }
        instance.emailTry = function () {
            var request = [
			    'SendPasswordEmail',
			    [
				    {
				        email: instance.email.value
				    }
			    ]
		    ]
            $.ajax({
                type: "POST",
                url: Rendition.Merchant.responderURL,
                data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
                processData: false,
                dataType: "json",
                error: Rendition.Merchant.ajaxError,
                success: instance.LogOnTryCallback
            });
        }
        instance.emailTryCallback = function (e) {
            if (e.method1.error !== undefined) {
                alert('Exception Error:' + e.method1.error + ":" + e.method1.description);
            }
            if (e.method1.LogOn.error != 0) {
                alert('Exception Error:' + e.method1.error + ":" + e.method1.description);
            } else {
                instance.errormsg.style.color = args.successColor || 'green';
                instance.errormsg.innerHTML = e.method1.SendPasswordEmail.description;
                setTimeout(function () {
                    instance.close();
                }, args.successMessageDelay || 2500);
            }
        }
        instance.createAccountTryCallback = function (e) {
            if (e.method1.error !== undefined) {
                alert('Exception Error:' + e.method1.error + ":" + e.method1.description);
            }
            if (e.method1.CreateAccount.error != 0) {
                instance.errormsg.style.color = args.errorColor || 'red';
                instance.errormsg.innerHTML = e.method1.CreateAccount.description;
            } else {
                window.user = e.method1.CreateAccount.user;
                instance.errormsg.style.color = args.successColor || 'green';
                instance.errormsg.innerHTML = e.method1.CreateAccount.description;
                setTimeout(function () {
                    if (args.callbackProcedure !== undefined) {
                        args.callbackProcedure.apply(this, []);
                    }
                    instance.close();
                }, args.successMessageDelay || 2500);
            }
        }
        instance.LogOnTryCallback = function (e) {
            if (e.method1.error !== undefined) {
                alert('Exception Error:' + e.method1.error + ":" + e.method1.description);
            }
            if (args.LogOnTryCallback !== undefined) {
                instance.preventDefault = false;
                args.LogOnTryCallback.apply(instance, [e.method1.LogOn, instance.errormsg, args]);
                if (instance.preventDefault) {
                    return;
                }
            }
            if (e.method1.LogOn.error != 0) {
                instance.errormsg.style.color = args.errorColor || 'red';
                instance.errormsg.innerHTML = e.method1.LogOn.description;
            } else {
                window.user = e.method1.LogOn.user;
                instance.errormsg.style.color = args.successColor || 'green';
                instance.errormsg.innerHTML = e.method1.LogOn.description;
                setTimeout(function () {
                    if (args.infoId !== undefined) {
                        var info = document.getElementById(args.infoId);
                        info.innerHTML = '<a onclick="javascript:logoff({infoId:\'LogOnInfo\'});">Logoff</a>';
                    }
                    if (args.callbackProcedure !== undefined) {
                        args.callbackProcedure.apply(this, []);
                    }
                    instance.close();
                }, args.successMessageDelay || 2500);
            }
        }
        instance.submitOnEnter = function (e) {
            e = e || window.event;
            if (e.keyCode == 13) {
                instance.tryLogOn();
            }
        }
        instance.h = function (b) {
            b.style.visibility = 'hidden';
            b.style.display = 'none';
        }
        instance.s = function (b) {
            b.style.visibility = 'visible';
            b.style.display = 'inline-block';
        }
        instance.init = function () {
            instance.badIE = !(navigator.userAgent.indexOf('MSIE 7') == -1 && navigator.userAgent.indexOf('MSIE 6') == -1);
            instance.modalBackground = document.createElement('div');
            instance.LogOn = document.createElement('div');
            instance.LogOn.style.position = 'absolute';
            instance.LogOn.style.zIndex = '9997';
            instance.LogOn.className = 'LogOn';
            instance.finalLeft = (document.documentElement.clientWidth / 2) - (instance.rect.width / 2);
            instance.finalTop = function () { return document.documentElement.scrollTop + instance.margin.top }
            instance.LogOn.style.top = instance.finalTop() + 'px';
            instance.LogOn.style.left = (document.documentElement.clientWidth / 2 - (instance.rect.width / 2)) + 'px';
            if (!instance.badIE) {/* bad IE has a probelm animating */
                instance.LogOn.style.height = '1px';
                instance.LogOn.style.width = instance.rect.width + 'px';
            }
            instance.modalBackground.style.background = 'url(/img/25PctAlphaBlackDot.png)';
            instance.modalBackground.style.position = 'absolute';
            instance.modalBackground.style.zIndex = '9996';
            Rendition.Merchant.appendEvent('resize', window, instance.resize, false);
            Rendition.Merchant.appendEvent('scroll', window.document, instance.resize, false);
            instance.resize();
            instance.formTable = document.createElement('table');
            instance.formTable.className = '';
            instance.formTable.style.marginTop = '10px';
            instance.email = document.createElement('input');
            if (window.loggedon == true) {
                instance.email.value = window.user.email;
            }
            instance.email.style.width = (instance.rect.width - 100) + 'px';
            instance.email.onkeypress = instance.submitOnEnter;
            instance.password = document.createElement('input');
            instance.password.style.width = (instance.rect.width - 100) + 'px'; ;
            instance.password.onkeypress = instance.submitOnEnter;
            instance.password.type = 'password';
            instance.cancelButton = document.createElement('button');
            instance.LogOnButton = document.createElement('button');
            instance.createAccountButton = document.createElement('button');
            instance.resetPasswordButton = document.createElement('button');
            instance.cancelresetPasswordButton = document.createElement('button');
            instance.cancelButton.style.margin = '4px';
            instance.LogOnButton.style.margin = '4px';
            instance.createAccountButton.style.margin = '4px';
            instance.resetPasswordButton.style.margin = '4px';
            instance.cancelresetPasswordButton.style.margin = '4px';
            instance.cancelButton.onclick = instance.LogOnCancel;
            instance.LogOnButton.onclick = instance.tryLogOn;
            instance.createAccountButton.onclick = instance.tryCreateAccount;
            instance.cancelresetPasswordButton.onclick = instance.cancelResetPassword;
            instance.resetPasswordButton.onclick = instance.tryResetPassword;
            instance.cancelButton.innerHTML = args.cancelButtonInnerHTML || 'Cancel';
            instance.LogOnButton.innerHTML = args.LogOnButtonInnerHTML || 'Logon';
            instance.createAccountButton.innerHTML = args.createAccountButtonInnerHTML || 'Create New Account';
            instance.cancelresetPasswordButton.innerHTML = args.cancelResetPasswordButtonInnerHTML || 'Cancel';
            instance.resetPasswordButton.innerHTML = args.resetPasswordButtonInnerHTML || 'Reset Password';
            instance.forgotPasswordLink = document.createElement('a');
            instance.forgotPasswordLink.className = args.forgotPasswordLinkClassName || 'forgotPasswordLink';
            instance.forgotPasswordLink.style.cursor = 'pointer';
            instance.forgotPasswordLink.onclick = instance.forgotPassword;
            instance.forgotPasswordLink.innerHTML = args.forgotPasswordLinkInnerHTML || 'Forgot your password?';
            instance.errormsg = document.createElement('span');
            instance.errormsg.className = 'errormsg';
            var t = instance.formTable;
            var r3 = t.insertRow(0);
            var r2 = t.insertRow(0);
            var r1 = t.insertRow(0);
            var r3c1 = r3.insertCell(0);
            r3c1.setAttribute('colspan', '2');
            var r2c2 = r2.insertCell(0);
            var r2c1 = r2.insertCell(0);
            var r1c2 = r1.insertCell(0);
            var r1c1 = r1.insertCell(0);
            r1c1.style.textAlign = 'right';
            r1c2.style.fontWeight = 'bold';
            r2c1.style.textAlign = 'right';
            r2c2.style.fontWeight = 'bold';
            r1c1.appendChild(document.createTextNode('Email'));
            r1c2.appendChild(instance.email);
            r2c1.appendChild(document.createTextNode('Password'));
            r2c2.appendChild(instance.password);
            r3c1.style.padding = '4px';
            r3c1.style.textAlign = 'right';
            instance.passwordRow = r2;
            instance.h(instance.cancelresetPasswordButton);
            instance.h(instance.resetPasswordButton);
            r3c1.appendChild(instance.createAccountButton);
            r3c1.appendChild(instance.cancelButton);
            r3c1.appendChild(instance.LogOnButton);
            r3c1.appendChild(instance.resetPasswordButton);
            r3c1.appendChild(instance.cancelresetPasswordButton);
            r3c1.appendChild(document.createElement('br'));
            r3c1.appendChild(instance.forgotPasswordLink);
            r3c1.appendChild(instance.errormsg);
            document.body.appendChild(instance.modalBackground);
            document.body.appendChild(instance.LogOn);
            /* add message from argument */
            if (args.message !== undefined) {
                if (typeof args.message == 'string') {
                    instance.LogOn.innerHTML = args.message;
                } else if (typeof args.message == 'object') {
                    instance.LogOn.appendChild(args.message);
                } else if (typeof args.message == 'function') {
                    var result = args.message.apply(this, []);
                    if (typeof args.message == 'object') {
                        instance.LogOn.appendChild(result);
                    } else if (typeof args.message == 'string') {
                        instance.LogOn.innerHTML = result;
                    }
                }
            }
            instance.LogOn.appendChild(t);
            if (!instance.badIE) {
                $(instance.LogOn).animate({ width: instance.rect.width, left: instance.finalLeft }, instance.animationTimer, instance.animationEasing, function () {
                    $(instance.LogOn).animate({ height: instance.rect.height }, instance.animationTimer, instance.animationEasing, function () {
                        instance.email.focus();
                        instance.email.select();
                    });
                });
            } else {
                instance.LogOn.style.height = instance.rect.height + 'px';
                instance.email.focus();
                instance.email.select();
            }
            return instance;
        }
        return instance.init();
    },
    /**
    * Produces a dialog (DIV) that contains default buttons and fields nessessary reply to a blog entry.
    * @constructor
    * @name Rendition.Merchant.Reply
    * @memberOf Rendition.Merchant
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.DHTMLElement} [args.button] The button to find the current form by traversing out from the button until the 'blogReply' class element is found.
    * @param {Native.Integer} [args.marginTop=50] how far away the dialog should be placed from the top of the window.
    * @param {Native.Integer} [args.previewMarginTop=10] size of the margin of the absolutly position div preview.
    * @param {Native.Integer} [args.width=300] Width of the dialog in pixles.
    * @param {Native.Integer} [args.height=120] height of the dialog in pixles.
    * @param {Native.Integer} [args.previewWidth=800] width of the preview of the message.
    * @param {Native.Integer} [args.previewHeight=450] height of the preview of the message.
    * @param {Native.Object} [args.animationTimer='fast'] time for the animation to complete default. JQuery, 'fast', 'slow', 100 etc..
    * @param {Native.Object} [args.animationEasing='linear'] animation easing method using avaliable JQuery easing methods: 'swing', 'linear'.
    * @param {Native.String} [args.parentId] Reloads this DHTML object with a fresh list of replies to this blog after the message is posted.
    */
    Reply: function (args) {
        if (window.user.userId == -1 || window.user === undefined) {
            Rendition.Merchant.LogOn({
                callbackProcedure: function () {
                    reply(button, args);
                }
            });
            return;
        }
        var instance = {}
        if (args === undefined) {
            args = {}
        }
        var button = args.button;
        instance.margin = {
            top: args.marginTop || 50
        }
        instance.rect = {
            width: args.width || 600,
            height: args.height || 435
        }
        instance.previewMargin = {
            top: args.previewMarginTop || 10
        }
        instance.previewRect = {
            width: args.previewWidth || 800,
            height: args.previewHeight || 450
        }
        instance.animationTimer = args.animationTimer || 'fast';
        instance.animationEasing = args.animationEasing || 'linear';
        instance.resize = function () {
            var p = {
                t: document.documentElement.scrollTop,
                l: document.documentElement.scrollLeft,
                h: document.documentElement.clientHeight,
                w: document.documentElement.clientWidth
            }
            instance.modalBackground.style.height = p.h + 'px';
            instance.modalBackground.style.width = p.w + 'px';
            instance.modalBackground.style.top = p.t + 'px';
            instance.modalBackground.style.left = p.l + 'px';
            instance.reply.style.top = instance.finalTop() + 'px';
            instance.preview.style.top = instance.finalPreviewTop() + 'px';
            instance.reply.style.left = (document.documentElement.clientWidth / 2 - (instance.rect.width / 2)) + 'px';
            instance.preview.style.left = (document.documentElement.clientWidth / 2 - (instance.previewRect.width / 2)) + 'px';
        }
        instance.init = function () {

            instance.reply = document.createElement('div');
            instance.modalBackground = document.createElement('div');
            instance.preview = document.createElement('div');
            instance.preview.className = 'replyWindow previewWindow';
            instance.preview.style.zIndex = '9998';
            instance.preview.style.position = 'absolute';

            instance.finalLeft = (document.documentElement.clientWidth / 2) - (instance.rect.width / 2);
            instance.finalPreviewLeft = (document.documentElement.clientWidth / 2) - (instance.previewRect.width / 2);
            instance.finalTop = function () { return document.documentElement.scrollTop + instance.margin.top }
            instance.finalPreviewTop = function () { return document.documentElement.scrollTop + instance.previewMargin.top }
            instance.reply.style.top = instance.finalTop();
            instance.reply.style.left = (document.documentElement.clientWidth / 2 - (instance.rect.width / 2)) + 'px';
            instance.preview.style.top = instance.finalPreviewTop();
            instance.preview.style.left = (document.documentElement.clientWidth / 2 - (instance.previewRect.width / 2)) + 'px';
            instance.modalBackground.style.background = 'url(/img/25PctAlphaBlackDot.png)';
            instance.modalBackground.style.position = 'absolute';
            instance.modalBackground.style.zIndex = '9996';
            instance.reply.className = 'replyWindow';
            instance.reply.style.zIndex = '9997';
            instance.reply.style.position = 'absolute';
            Rendition.Merchant.appendEvent('resize', window.document, instance.resize, false);
            Rendition.Merchant.appendEvent('scroll', window.document, instance.resize, false);
            instance.reply.style.width = 10 + 'px';
            instance.reply.style.height = 10 + 'px';
            instance.resize();


            instance.formTable = document.createElement('table');
            instance.formTable.className = 'blogReply';
            instance.formTable.style.width = '100%';
            instance.formTable.style.marginTop = '10px';

            instance.subject = document.createElement('input');
            instance.message = document.createElement('textarea');
            instance.cancelButton = document.createElement('button');
            instance.postButton = document.createElement('button');
            instance.previewButton = document.createElement('button');

            instance.subject.style.width = '350px';

            instance.cancelButton.onclick = instance.close;
            instance.postButton.onclick = instance.submit;
            instance.previewButton.onclick = instance.replyPreview;

            instance.cancelButton.style.margin = '4px';
            instance.postButton.style.margin = '4px';
            instance.previewButton.style.margin = '4px';

            instance.cancelButton.innerHTML = 'Cancel';
            instance.postButton.innerHTML = 'Post';
            instance.previewButton.innerHTML = 'Preview';


            var t = instance.formTable;
            var r3 = t.insertRow(0);
            var r2 = t.insertRow(0);
            var r1 = t.insertRow(0);
            var r3c1 = r3.insertCell(0);
            r3c1.setAttribute('colspan', '2');
            var r2c1 = r2.insertCell(0);
            r2c1.setAttribute('colspan', '2');
            var r1c2 = r1.insertCell(0);
            var r1c1 = r1.insertCell(0);

            r1c1.style.textAlign = 'right';
            r1c2.style.fontWeight = 'bold';
            r2c1.style.textAlign = 'center';
            r1c1.appendChild(document.createTextNode('Subject'));
            r1c2.appendChild(instance.subject);
            r2c1.appendChild(instance.message);
            r3c1.style.padding = '4px';
            r3c1.style.textAlign = 'right';
            instance.message.style.width = '550px';
            instance.message.style.height = '350px';

            r3c1.appendChild(instance.cancelButton);
            r3c1.appendChild(instance.postButton);
            r3c1.appendChild(instance.previewButton);
            document.body.appendChild(instance.modalBackground);
            document.body.appendChild(instance.reply);

            instance.reply.appendChild(instance.formTable);


            $(instance.reply).animate({ width: instance.rect.width, left: instance.finalLeft }, instance.animationTimer, instance.animationEasing, function () {
                $(instance.reply).animate({ height: instance.rect.height }, instance.animationTimer, instance.animationEasing, function () {
                    instance.subject.focus();
                    instance.subject.select();
                });
            });
            return instance;
        }
        instance.close = window.replyCancel = function (e) {
            instance.dispose();
        }
        instance.formStruct = function () {
            return {
                message: instance.message.value,
                subject: instance.subject.value
            }
        }
        instance.getReplyMethod = function (button, preview) {
            /* find the current form by traversing out from the button until we find the blogReply class element
            that was cloned from the aspx page */
            var e = button.parentNode;
            while (e) {
                if (e.className == 'blogReply') {
                    break;
                }
                e = e.parentNode;
            }
            /* grab the input elements as JSON from the node we just found */
            var f = instance.formStruct();
            f.parentId = args.parentId;
            f.preview = preview;
            return [
			    'AddReply',
			    [
				    f
			    ]
		    ]
        }
        instance.submit = window.replySubmit = function (button) {
            $.ajax({
                type: "POST",
                url: Rendition.Merchant.responderURL,
                data: 'method1=' + encodeURIComponent(JSON.stringify(instance.getReplyMethod(button, false))),
                processData: false,
                dataType: "json",
                error: Rendition.Merchant.ajaxError,
                success: instance.submitCallback
            });
        }
        instance.replyPreview = window.replyPreview = function (button) {
            $.ajax({
                type: "POST",
                url: Rendition.Merchant.responderURL,
                data: 'method1=' + encodeURIComponent(JSON.stringify(instance.getReplyMethod(button, true))),
                processData: false,
                dataType: "json",
                error: Rendition.Merchant.ajaxError,
                success: function (e) {
                    /* keep the reference to the orginal button so we can traverse back to the form */
                    instance.previewCallback(e, button);
                }
            });
        }
        instance.submitCallback = function (e) {
            e = e.method1;
            if (e.error !== undefined) {
                alert(e.description);
                return; /* error accessing method */
            }
            e = e.AddReply;
            if (e.error != 0) {
                alert(e.description);
                return; /* method returns an error */
            }
            instance.replyId = e.replyId;
            instance.blogEntryId = e.blogEntryId;
            instance.close();
            /* now refresh the current replies block */
            document.getElementById("blogReplies").innerHTML = '<img src="/img/a_g_loading.gif"> Loading ...';
            $.ajax({
                type: "POST",
                url: "reply.aspx",
                data: 'refreshReplies=true&entryId=' + instance.blogEntryId,
                processData: false,
                dataType: "html",
                error: Rendition.Merchant.ajaxError,
                success: instance.loadRepliesBlock
            });

        }
        instance.loadRepliesBlock = function (e) {
            /* e contains the replies */
            document.getElementById("blogReplies").innerHTML = e;
            window.location = '#' + instance.replyId;
        }
        instance.previewCallback = function (e, button) {
            /* keep the reference to the orginal button so we can traverse back to the form */
            e = e.method1;
            if (e.error !== undefined) {
                alert(e.description);
                return; /* error accessing method */
            }
            e = e.AddReply;
            if (e.error != 0) {
                alert(e.description);
                return; /* method returns an error */
            }
            /* no errors */
            instance.preview.style.width = 10 + 'px';
            instance.preview.style.height = 10 + 'px';
            document.body.appendChild(instance.preview);
            $(instance.preview).animate({ width: instance.previewRect.width, left: instance.finalPreviewLeft }, instance.animationTimer, instance.animationEasing, function () {
                $(instance.preview).animate({ height: instance.previewRect.height }, instance.animationTimer, instance.animationEasing);
            });
            instance.preview.innerHTML = '<h3 style="text-align:left;">Subject: ' + e.subject + '</h3>' + '<p>' + e.message + '</p>';
            instance.previewSubmit = document.createElement('button');
            instance.previewCancel = document.createElement('button');
            instance.previewSubmit.onclick = function (e) {
                /* keep the reference to the orginal button so we can traverse back to the form */
                window.replySubmit(button);
            }
            instance.previewCancel.onclick = function (e) {
                instance.preview.innerHTML = '';
                document.body.removeChild(instance.preview);
            }
            instance.preview.appendChild(instance.previewSubmit);
            instance.preview.appendChild(instance.previewCancel);
            instance.previewSubmit.innerHTML = 'Post';
            instance.previewCancel.innerHTML = 'Cancel';
        }
        instance.dispose = function () {
            document.body.removeChild(instance.modalBackground);
            document.body.removeChild(instance.reply);
            if (instance.preview) {
                if (instance.preview.parentNode) {
                    instance.preview.parentNode.removeChild(instance.preview);
                }
            }
            window.replyPreview = undefined;
            window.replyCancel = undefined;
        }

        return instance.init();
    },
    /* approve of a blog reply.  Replaced numberNode argument with new number of approves
    numberNode: the DHTML Element that contains the number of approves
    replyId: the Id of the reply
    */
    approve: function (numberNode, replyId) {
        var request = [
		    'SetReplyState',
		    [
			    {
			        replyId: replyId,
			        approve: true,
			        disapprove: false,
			        inappropriate: false
			    }
		    ]
	    ]
        $.ajax({
            type: "POST",
            url: Rendition.Merchant.responderURL,
            data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
            processData: false,
            dataType: "json",
            error: Rendition.Merchant.ajaxError,
            success: function (e) {
                numberNode.innerHTML = e.method1.SetReplyState.approves;
            }
        });
    },
    /* disapprove of a blog reply.  Replaced numberNode argument with new number of disapproves
    numberNode: the DHTML Element that contains the number of disapproves
    replyId: the Id of the reply
    */
    disapprove: function (numberNode, replyId) {
        var request = [
		    'SetReplyState',
		    [
			    {
			        replyId: replyId,
			        approve: false,
			        disapprove: true,
			        inappropriate: false
			    }
		    ]
	    ]
        $.ajax({
            type: "POST",
            url: Rendition.Merchant.responderURL,
            data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
            processData: false,
            dataType: "json",
            error: Rendition.Merchant.ajaxError,
            success: function (e) {
                numberNode.innerHTML = e.method1.SetReplyState.disapproves;
            }
        });
    },
    /*	flag a reply inappropriate and return an alert that says as much to the user.
    replyId: the Id of the reply
    */
    inappropriate: function (replyId) {
        var request = [
		    'SetReplyState',
		    [
			    {
			        replyId: replyId,
			        approve: false,
			        disapprove: false,
			        inappropriate: true
			    }
		    ]
	    ]
        $.ajax({
            type: "POST",
            url: Rendition.Merchant.responderURL,
            data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
            processData: false,
            dataType: "json",
            error: Rendition.Merchant.ajaxError,
            success: function () {
                alert('Message reported to site administrator.');
            }
        });
    },
    /* update every item in the cart at once
    on callback the function will <strike>attempt</strike> to set the form and qtys to the value in the ajax callback
    accepts one argument dictionary {
    button:<DHTML button element that will contain the 'updating' message (usualy the one pressed>
    updateMessage:<the message to display in the button on click default:'Updating Cart...'>
    form<the DHTML element that contains the inputs that make up the cart (forms and QTYS)>
    cartTableId:< the Id of the cart table default:'cart'>
    }
    */
    updateCart: function (args) {
        var instance = {}
        instance.updatingMessage = args.updatingMessage || '<h2>Updating your cart...</h2>' +
	    'Please wait a moment while the items in your cart are updated.';
        instance.dialogClass = args.dialogClass;
        if (!(args.form === undefined || args.form == null)) {
            var formArguments = Rendition.Merchant.getInputs(args.form);
        } else {
            var formArguments = {}
        }
        args.form = undefined;
        if (args.button) {
            instance.originalButtonHTML = args.button.innerHTML;
            args.button.innerHTML = args.updateMessage || 'Updating Cart...';
        }
        args.showCartDetails = true;
        $.extend(true, formArguments, args);
        /* don't allow the DHTML button to be passed as an argument to the AJAX function */
        formArguments.button = undefined;
        instance.updateCartCallback = function (e) {
            instance.miniDialog.close();
            var e = e.method1.UpdateCart;
            var cb = {}
            var g = function (i) { return document.getElementById(i); }
            var table = document.getElementById(args.cartTableId || 'cart');
            var h = table.rows.length;
            var j = e.items.length;
            if (j == 0) { window.location = "/" }
            cb.chk = function () {
                for (var x = 1; (h - 1) > x; x++) {/* don't check the first or last row */
                    var inCart = false;
                    for (var y = 0; j > y; y++) {
                        if ((table.rows[x].id == 'row' + Rendition.Merchant.encodeXMLId(e.items[y].cartId))) {
                            inCart = true;
                        }
                    }
                    if (!inCart) {
                        /* if one was missing, remove it and start over */
                        table.removeChild(table.rows[x]);
                        cb.chk.call();
                        break;
                    }
                }
            }
            cb.chk(); /* check every row and see if the item is still in the cart */
            for (var x = 0; j > x; x++) {
                var i = e.items[x];
                var eId = Rendition.Merchant.encodeXMLId(i.cartId);
                if (!document.getElementById('p' + eId)) { continue; }
                if (i.qty == 0) {
                    var row = g('row' + eId);
                    var table = row.parentNode;
                    table.removeChild(row);
                } else {
                    g('p' + eId).innerHTML = '$' + parseFloat(i.price).toFixed(2);
                    g('l' + eId).innerHTML = '$' + parseFloat(parseFloat(i.price) * parseFloat(i.qty)).toFixed(2);
                    g(eId).value = i.qty;
                    var k = i.inputs.length;
                    for (var y = 0; k > y; y++) {
                        var n = g(i.inputs[y].id);
                        if (n) {
                            if (n.type.toLowerCase() == 'checkbox') {
                                n.checked = Boolean(i.inputs[y].value);
                            } else {
                                n.value = i.inputs[y].value
                            }
                        }
                    }
                }
            }
            g('subTotal').innerHTML = '$' + parseFloat(e.subTotal).toFixed(2);
            g('estShipTotal').innerHTML = '$' + parseFloat(e.estShipTotal).toFixed(2);
            g('grandTotal').innerHTML = '$' + parseFloat(e.grandTotal).toFixed(2);
            g('discountTotal').innerHTML = '$' + parseFloat(e.discountTotal).toFixed(2);
            g('taxTotal').innerHTML = '$' + parseFloat(e.taxTotal).toFixed(2);
            if (args.button) {
                args.button.innerHTML = instance.originalButtonHTML;
                args.button.disabled = false;
            }
            if (args.callbackProcedure !== undefined) {
                args.callbackProcedure.apply(instance, [instance]);
            }
        }
        instance.init = function () {
            instance.miniDialog = new Rendition.Merchant.MiniDialog({
                HTML: instance.updatingMessage,
                height: 90,
                dialogClass: instance.dialogClass,
                animate: false
            });
            var request = [
			    'UpdateCart',
			    [formArguments]
		    ]
            $.ajax({
                type: "POST",
                url: Rendition.Merchant.responderURL,
                data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
                processData: false,
                dataType: "json",
                error: function (e) {
                    instance.miniDialog.close();
                    Rendition.Merchant.ajaxError(e);
                },
                success: instance.updateCartCallback
            });
        }
        instance.init();
    },
    /**
    * Update a single item in the cart.
    * @type Native.Function
    * @name Rendition.Merchant.updateCartItem
    * @memberOf Rendition.Merchant
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.DHTMLElement} [args.button] DHTML button element that will contain the 'updating' message, usualy the one pressed.
    * @param {Native.DHTMLElement} [args.form] the DHTMLElementt that contains the inputs that make up the cart, forms and qtys.
    * @param {Native.Function} [args.updateMessage='Updating Cart...'] the message to display in the button on click.
    */
    updateCartItem: function (args) {
        if (!(args.form === undefined || args.form == null)) {
            var formArguments = Rendition.Merchant.getInputs(args.form);
        } else {
            var formArguments = {}
        }
        args.form = undefined;
        args.showCartDetails = true;
        var instance = {}
        $.extend(true, formArguments, args);
        instance.updateCartItemCallback = function (e) {
            var e = e.method1.UpdateCartItem;
            var g = function (i) { return document.getElementById(i); }
            var eId = Rendition.Merchant.encodeXMLId(args.cartId);
            if (args.qty == 0) {
                var row = g('row' + eId);
                var table = row.parentNode;
                table.removeChild(row);
                if (table.rows.length == 2) { window.location = '/' }
            } else {
                g('p' + eId).innerHTML = '$' + parseFloat(e.price).toFixed(2);
                g('l' + eId).innerHTML = '$' + parseFloat(parseFloat(e.price) * parseFloat(e.qty)).toFixed(2);
            }
            g('subTotal').innerHTML = '$' + parseFloat(e.subTotal).toFixed(2);
            g('estShipTotal').innerHTML = '$' + parseFloat(e.estShipTotal).toFixed(2);
            g('grandTotal').innerHTML = '$' + parseFloat(e.grandTotal).toFixed(2);
            g('discountTotal').innerHTML = '$' + parseFloat(e.discountTotal).toFixed(2);
            g('taxTotal').innerHTML = '$' + parseFloat(e.taxTotal).toFixed(2);
        }
        var request = [
		    'UpdateCartItem',
		    [formArguments]
	    ]
        $.ajax({
            type: "POST",
            url: Rendition.Merchant.responderURL,
            data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
            processData: false,
            dataType: "json",
            error: Rendition.Merchant.ajaxError,
            success: instance.updateCartItemCallback
        });
    },
    /**
    * It's not a big dialog, it's a mini dialog!
    * @constructor
    * @name Rendition.Merchant.MiniDialog
    * @memberOf Rendition.Merchant
    * @param {Native.Object} [rect] Parameters for the function.
    * @param {Native.Object} [args.HTML] This is the content of the dialog.  This can be a string, DHTML or a function that returns a String.
    * @param {Native.Integer} [args.height] The height of the dialog. 
    * @param {Native.Integer} [args.width] The width of the dialog. 
    * @param {Native.Function} [args.resize] Window resize event listener. 
    * @param {Native.String} [args.modalBackgroundImage] The background image path.
    * @param {Native.String} [args.dialogClass='miniDialog'] The class of the dialog.
    * @param {Native.Boolean} [args.animate] When true, the dialog will be animated.
    * @param {Native.Object} [args.animationTimer='fast'] time for the animation to complete default. JQuery, 'fast', 'slow', 100 etc..
    * @param {Native.Object} [args.animationEasing='linear'] animation easing method using avaliable JQuery easing methods: 'swing', 'linear'.
    * @example ///Open a new dialog and assign it to the variable foo.///
    * var foo = new miniDialog({HTML:'blah'}).open();
    */
    MiniDialog: function (args) {
        var instance = {};
        args = args || {};
        instance.animationTimer = args.animationTimer || 'fast';
        instance.animationEasing = args.animationEasing || 'linear';
        instance.doAnimations = true;
        instance.showCloseButton = true;
        instance.margin = { top: args.marginTop || 50 };
        instance.rect = args.rect || { width: 400, height: 250 };
        instance.closeButtonOffsetTop = args.closeButtonOffsetTop || 5;
        instance.closeButtonOffsetLeft = args.closeButtonOffsetLeft || -5;
        if (args.height !== undefined) { instance.rect.height = args.height; }
        if (args.width !== undefined) { instance.rect.width = args.width; }
        if (args.animate !== undefined) { instance.doAnimations = args.animate; }
        if (args.resize !== undefined) { instance._resize = args.resize; }
        if (args.closeButton !== undefined) { instance.showCloseButton = args.closeButton; }
        instance.close = instance.hide = function () {
            if (instance.dialog.parentNode) {
                /* this can fail frequently becuase the DOM changes in unexpected ways, do the best we can... */
                try { instance.dialog.parentNode.removeChild(instance.dialog); } catch (e) { }
                try { instance.modalBackground.parentNode.removeChild(instance.modalBackground); } catch (e) { }
                if (instance.showCloseButton) {
                    try { instance.closeButton.parentNode.removeChild(instance.closeButton); } catch (e) { }
                }
            }
            return instance;
        }
        instance.dispose = function () {
            instance = undefined;
            return;
        }
        instance.init = function () {
            Rendition.Merchant.appendEvent('resize', window.document, instance.resize, false);
            Rendition.Merchant.appendEvent('scroll', window.document, instance.resize, false);
            instance.dialog = document.createElement('div');
            instance.modalBackground = document.createElement('div');
            instance.finalLeft = (document.documentElement.clientWidth / 2) - (instance.rect.width / 2);
            instance.finalTop = function () { return document.documentElement.scrollTop + instance.margin.top }
            instance.dialog.style.top = instance.finalTop();
            instance.dialog.style.left = (document.documentElement.clientWidth / 2 - (instance.rect.width / 2)) + 'px';
            instance.modalBackground.style.background = args.modalBackgroundImage || 'url(/img/25PctAlphaBlackDot.png)';
            instance.modalBackground.style.position = 'absolute';
            instance.modalBackground.style.zIndex = '9996';
            instance.dialog.className = args.dialogClass || 'miniDialog';
            instance.dialog.style.zIndex = '9997';
            instance.dialog.style.position = 'absolute';
            instance._currentHTML = args.HTML;
            if (!args.dontOpen) {
                instance.open();
            }
            instance.resize();
            return instance;
        }
        instance.HTML = function (HTML) {
            if (HTML !== undefined) {
                instance._currentHTML = HTML;
            }
            if (HTML === undefined) {
                return instance.dialog.innerHTML;
            } else if (typeof HTML == 'string') {
                instance.dialog.innerHTML = HTML;
            } else if (typeof HTML == 'function') {
                var ret = HTML.apply(instance, [instance]);
                return instance.HTML(ret);
            } else if (typeof HTML == 'object') {
                instance.dialog.appendChild(HTML);
            }
            return instance;
        }
        instance.animate = function () {
            if (instance.showCloseButton) {
                instance.closeButton.style.visibility = 'hidden';
            }
            instance.dialog.style.width = 10 + 'px';
            instance.dialog.style.height = 10 + 'px';
            $(instance.dialog).animate({ width: instance.rect.width, left: instance.finalLeft }, instance.animationTimer, instance.animationEasing, function () {
                $(instance.dialog).animate({ height: instance.rect.height }, instance.animationTimer, instance.animationEasing, function () {
                    instance.HTML(instance._currentHTML);
                    instance.resize();
                    if (instance.showCloseButton) {
                        instance.closeButton.style.visibility = 'visible';
                    }
                });
            });
        }
        instance.open = instance.unhide = function () {
            document.body.appendChild(instance.modalBackground);
            document.body.appendChild(instance.dialog);
            if (instance.showCloseButton) {
                instance.closeButton = document.createElement('button');
                instance.closeButton.innerHTML = args.closeText !== undefined ? args.closeText : 'Close';
                instance.closeButton.style.zIndex = '9998';
                instance.closeButton.style.position = 'absolute';
                instance.closeButton.onclick = instance.close;
                document.body.appendChild(instance.closeButton);
            }
            if (instance.doAnimations) {
                instance.animate();
            } else {
                instance.dialog.style.width = instance.rect.width + 'px';
                instance.dialog.style.height = instance.rect.height + 'px';
                instance.HTML(instance._currentHTML);
            }
            return instance;
        }
        instance.resize = function () {
            var de = document.documentElement;
            var p = { t: de.scrollTop, l: de.scrollLeft, h: de.clientHeight, w: de.clientWidth }
            var dLeft = (document.documentElement.clientWidth / 2 - (instance.rect.width / 2));
            var dTop = instance.finalTop();
            instance.modalBackground.style.height = p.h + 'px';
            instance.modalBackground.style.width = p.w + 'px';
            instance.modalBackground.style.top = p.t + 'px';
            instance.modalBackground.style.left = p.l + 'px';
            instance.dialog.style.top = dTop + 'px';
            instance.dialog.style.left = dLeft + 'px';
            if (instance.showCloseButton) {
                instance.closeButton.style.left =
			    (dLeft + instance.rect.width + (instance.closeButtonOffsetLeft) - instance.closeButton.offsetWidth) + 'px';
                instance.closeButton.style.top = (dTop + (instance.closeButtonOffsetTop)) + 'px';
                if (instance._resize !== undefined) {
                    instance._resize.apply(instance, [instance]);
                }
            }
            return instance;
        }
        return instance.init();
    },
    /**
    * Validates the form, adds an item to the cart.
    * @type Native.Function
    * @name Rendition.Merchant.addToCart
    * @memberOf Rendition.Merchant
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.DHTMLElement} [args.button] DHTML button element that will contain the 'updating' message, usualy the one pressed.
    * @param {Native.DHTMLElement} [args.form] the DHTMLElementt that contains the inputs that make up the cart, forms and qtys.
    * @param {Native.Function} [args.callbackProcedure] Procedure to run when this method completes successfully. Signature: (JSONResponse e)
    */
    addToCart: function (args) {
        var instance = {}
        if (args === undefined) {
            args = {}
        }
        var form = args.form;
        var callbackProcedure = args.callbackProcedure;
        instance.dialogClass = args.dialogClass;
        instance.waitToCloseTime = args.waitToCloseTime || 1500;
        instance.addingMessage = args.addingMessage || '<h2>Adding an item to your cart...</h2>' +
	    'Adding an item to your cart, please wait a moment.';
        instance.addedMessage = args.addedMessage || '<h2>Item was added.</h2>' +
	    'Your cart has been updated with a new item, please wait while your cart is recalculated.';
        instance.init = function () {
            /* display add to cart message */
            instance.miniDialog = new Rendition.Merchant.MiniDialog({
                HTML: instance.addingMessage,
                height: 90,
                dialogClass: instance.dialogClass,
                animate: false
            });
            var formArguments = Rendition.Merchant.getInputs(form);
            /* prevent JSON.stringify errors by clearing non stringafiable objects */
            args.form = undefined;
            args.callbackProcedure = undefined;
            $.extend(true, args, formArguments); /* combine form args with function args */
            var request = [
			    'AddToCart',
			    [args]
		    ]
            $.ajax({
                type: "POST",
                url: Rendition.Merchant.responderURL,
                data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
                processData: false,
                dataType: "json",
                error: function (e) {
                    instance.miniDialog.close();
                    Rendition.Merchant.ajaxError(e);
                },
                success: instance.addToCartCallback
            });
        }
        instance.addToCartCallback = function (e) {
            e = e.method1;
            if (e.error !== undefined) {
                instance.miniDialog.HTML(e.description);
                return; /* error accessing method */
            }
            e = e.AddToCart;
            if (e.error != 0) {
                instance.miniDialog.HTML(e.description);
                return; /* method returns an error */
            }
            instance.miniDialog.HTML(instance.addedMessage);
            /* wait a 1.5 seconds, close message then apply callback proc */
            setTimeout(function () {
                instance.miniDialog.close();
                if (callbackProcedure !== undefined) {
                    callbackProcedure.apply(this, [e]);
                }
            }, instance.waitToCloseTime);
        }
        Rendition.Merchant.validateForm(form, instance.init);
    },
    /**
    * Empties the cart of the current session and blankifies the cart element 'lines' by removing all the children.
    * @type Native.Function
    * @name Rendition.Merchant.emptyCart
    * @memberOf Rendition.Merchant
    * @param {Native.Function} [callbackProcedure] Procedure to run when this method completes successfully. Signature: (JSONResponse e).
    */
    emptyCart: function (callbackProcedure) {
        var request = [
		    'EmptyCart',
		    ['']
	    ]
        $.ajax({
            type: "POST",
            url: Rendition.Merchant.responderURL,
            data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
            processData: false,
            dataType: "json",
            error: Rendition.Merchant.ajaxError,
            success: function (e) {
                if (callbackProcedure) {
                    callbackProcedure.apply(this, [e, this]);
                } else {
                    history.go(-1);
                }
            }
        });
    },
    /**
    * Validates a form then places an order using the current sesisons cart.
    * @type Native.Function
    * @name Rendition.Merchant.placeOrder
    * @memberOf Rendition.Merchant
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.DHTMLElement} [args.button] DHTML button element that will contain the 'updating' message, usualy the one pressed.
    * @param {Native.DHTMLElement} [args.form] the DHTMLElementt that contains the inputs that make up the cart, forms and qtys.
    * @param {Native.Function} [args.successCallbackProcedure] Procedure to run when this method completes successfully. Signature: (JSONResponse e)
    */
    placeOrder: function (args) {
        var instance = {}
        if (args.button === undefined) { return; }
        instance.waitToCloseTime = args.waitToCloseTime || 2000;
        instance.placeOrderMessage = args.placeOrderMessage || '<h2>Placing Order, please wait.</h2>' +
	    'Please wait a moment while your order is placed...';
        instance.orderPlacedMessage = args.orderPlacedMessage || '<h2>Your order has been placed.</h2>' +
	    'Please wait a moment while you are redirected to your new order.';
        instance.dialogClass = args.dialogClass;
        Rendition.Merchant.validateForm(args.form, function () {
            var formArguments = Rendition.Merchant.getInputs(args.form);
            args.userId = "";
            args.soldBy = "";
            args.requisitionedBy = "";
            args.parentOrderId = "";
            args.deliverBy = "";
            args.purchaseOrder = "";
            args.manifestNumber = "";
            args.vendorAccountNumber = "";
            args.FOB = "";
            args.scannedImage = "";
            args.comments = "";
            args.termId = "";
            args.approvedBy = "";
            args.scannedImage = "";
            args.orderDate = "";
            args.cardType = "";
            args.billToEmail = "";
            args.billToComments = "";
            args.billToEmailAds = false;
            args.billToCompany = "";
            args.shipToEmail = "";
            args.shipToComments = "";
            args.shipToEmailAds = false;
            args.shipToCompany = "";
            args.billToSendShipmentUpdates = false;
            args.billToSpecialInstructions = "";
            args.billToRateId = -1;
            args.sendOrderConfirmEmail = true;
            $.extend(true, args, formArguments); /* combine form args with function args */
            /* remove HTML objects or safari JSON.stringify will fail */
            instance.button = args.button;
            instance.form = args.button;
            instance.successCallbackProcedure = args.successCallbackProcedure;
            args.button = undefined;
            args.form = undefined;
            args.successCallbackProcedure = undefined;
            instance.miniDialog = new Rendition.Merchant.MiniDialog({
                HTML: instance.placeOrderMessage,
                height: 110,
                dialogClass: instance.dialogClass,
                animate: false,
                closeButton: false
            });
            var request = [
			    'PlaceOrder',
			    [args]
		    ]
            $.ajax({
                type: "POST",
                url: Rendition.Merchant.responderURL,
                data: 'method1=' + encodeURIComponent(JSON.stringify(request)),
                processData: false,
                dataType: "json",
                error: Rendition.Merchant.ajaxError,
                success: function (e) {
                    if (e.method1.error !== undefined) {
                        instance.miniDialog.HTML(e.method1.description);
                        return;
                    }
                    if (e.method1.PlaceOrder.error != 0) {
                        instance.button.disabled = false;
                        instance.miniDialog.HTML(
					    '<h2>There was a probelm with your order.</h2>' +
					    e.method1.PlaceOrder.description);
                        var closeButton = document.createElement('button');
                        closeButton.style.cssFloat = 'right';
                        closeButton.onclick = function () {
                            instance.miniDialog.close();
                        }
                        closeButton.innerHTML = 'Ok';
                        instance.miniDialog.dialog.appendChild(closeButton);
                        return;
                    }
                    instance.miniDialog.HTML(instance.orderPlacedMessage);
                    /* wait a 2 seconds, close message then apply callback proc */
                    setTimeout(instance.miniDialog.close, instance.waitToCloseTime);
                    if (instance.successCallbackProcedure) {
                        instance.successCallbackProcedure.apply(this, [e.method1.PlaceOrder]);
                    }
                }
            });
            return null;
        });
    },
    /**
    * Adds a review to an item, requires the user to LogOn using the LogOn procedure .
    * @constructor
    * @name Rendition.Merchant.AddReview
    * @memberOf Rendition.Merchant
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.Integer} [args.marginTop=50] how far away the dialog should be placed from the top of the window.
    * @param {Native.Integer} [args.width=600] Width of the dialog in pixles.
    * @param {Native.Integer} [args.height=435] height of the dialog in pixles.
    * @param {Native.Object} [args.animationTimer='fast'] time for the animation to complete default. JQuery, 'fast', 'slow', 100 etc..
    * @param {Native.Object} [args.animationEasing='linear'] animation easing method using avaliable JQuery easing methods: 'swing', 'linear'.
    * @param {Native.String} [args.updateTargetId] The id of the target the callback will replace with the full list of reviews.
    * @param {Native.String} [args.itemNumber] The item number being reviewed.
    */
    AddReview: function (args) {
        if (window.user.userId == -1 || window.user === undefined) {
            Rendition.Merchant.LogOn({
                callbackProcedure: function () {
                    Rendition.Merchant.AddReview(args);
                }
            });
            return;
        }
        var instance = {}
        if (args === undefined) {
            args = {}
        }
        instance.margin = {
            top: args.marginTop || 50
        }
        instance.rect = {
            width: args.width || 600,
            height: args.height || 435
        }
        instance.animationTimer = args.animationTimer || 'fast';
        instance.animationEasing = args.animationEasing || 'linear';
        instance.resize = function () {
            var p = {
                t: document.documentElement.scrollTop,
                l: document.documentElement.scrollLeft,
                h: document.documentElement.clientHeight,
                w: document.documentElement.clientWidth
            }
            instance.modalBackground.style.height = p.h + 'px';
            instance.modalBackground.style.width = p.w + 'px';
            instance.modalBackground.style.top = p.t + 'px';
            instance.modalBackground.style.left = p.l + 'px';
            instance.review.style.top = instance.finalTop() + 'px';
            instance.review.style.left = (document.documentElement.clientWidth / 2 - (instance.rect.width / 2)) + 'px';
        }
        instance.init = function () {
            instance.review = document.createElement('div');
            instance.modalBackground = document.createElement('div');

            instance.finalLeft = (document.documentElement.clientWidth / 2) - (instance.rect.width / 2);
            instance.finalTop = function () { return document.documentElement.scrollTop + instance.margin.top }
            instance.review.style.top = instance.finalTop();
            instance.review.style.left = (document.documentElement.clientWidth / 2 - (instance.rect.width / 2)) + 'px';
            instance.modalBackground.style.background = 'url(/img/25PctAlphaBlackDot.png)';
            instance.modalBackground.style.position = 'absolute';
            instance.modalBackground.style.zIndex = '9996';
            instance.review.className = 'replyWindow';
            instance.review.style.zIndex = '9997';
            instance.review.style.position = 'absolute';
            Rendition.Merchant.appendEvent('resize', window.document, instance.resize, false);
            Rendition.Merchant.appendEvent('scroll', window.document, instance.resize, false);
            instance.review.style.width = 10 + 'px';
            instance.review.style.height = 10 + 'px';
            instance.resize();


            instance.formTable = document.createElement('table');
            instance.formTable.className = 'blogReply';
            instance.formTable.style.width = '100%';
            instance.formTable.style.marginTop = '10px';


            instance.message = document.createElement('textarea');
            instance.cancelButton = document.createElement('button');
            instance.postButton = document.createElement('button');

            instance.cancelButton.onclick = instance.close;
            instance.postButton.onclick = instance.submit;

            instance.cancelButton.style.margin = '0 4px 4px 4px';
            instance.postButton.style.margin = '0 4px 4px 4px';

            instance.cancelButton.innerHTML = 'Cancel';
            instance.postButton.innerHTML = 'Post';

            var stars = [
			    document.createElement('button'),
			    document.createElement('button'),
			    document.createElement('button'),
			    document.createElement('button'),
			    document.createElement('button')
		    ];
            var x;
            var ratingHolder = document.createElement('div');
            instance.rating = document.createElement('input');
            var ratingSpan = document.createElement('span');
            ratingHolder.style.height = '25px';
            ratingHolder.style.width = '190px';
            ratingSpan.style.display = 'block';
            ratingSpan.style.cssFloat = 'right';
            ratingSpan.style.marginTop = '6px';
            instance.rating.value = 0;
            for (var x = 0; 5 > x; x++) {
                stars[x].setAttribute('index', x);
                stars[x].onmouseover = function (e) {
                    $(this).addClass('ui-state-hover', 0);
                }

                stars[x].onmouseout = function (e, x) {
                    $(this).removeClass('ui-state-hover', 0);
                }
                stars[x].onclick = function (e) {
                    var y;
                    var z = this.getAttribute('index');
                    instance.rating.value = z;
                    var u = false;
                    for (var y = 0; 5 > y; y++) {
                        if (u) {
                            stars[y].innerHTML = '<img src="/img/star_gray.png" alt="">';
                        } else {
                            stars[y].innerHTML = '<img src="/img/star.png" alt="">';
                        }
                        if (z == stars[y].getAttribute('index')) {
                            u = true;
                        }
                    }
                    ratingSpan.innerHTML = (parseInt(z) + 1) + ' of 5';
                }
                stars[x].style.paddingBottom = '2px';
                stars[x].className = 'starButton';
                stars[x].innerHTML = '<img src="/img/star_gray.png" alt="">';
                ratingHolder.appendChild(stars[x]);
            }
            ratingHolder.appendChild(ratingSpan);
            stars[4].onclick();

            var t = instance.formTable;
            var r3 = t.insertRow(0);
            var r2 = t.insertRow(0);
            var r1 = t.insertRow(0);
            var r3c1 = r3.insertCell(0);
            r3c1.setAttribute('colspan', '2');
            var r2c1 = r2.insertCell(0);
            r2c1.setAttribute('colspan', '2');
            var r1c2 = r1.insertCell(0);
            var r1c1 = r1.insertCell(0);

            r1c1.style.textAlign = 'right';
            r1c2.style.fontWeight = 'bold';
            r2c1.style.textAlign = 'center';
            r1c1.appendChild(document.createTextNode('Rate this item'));
            r1c2.appendChild(ratingHolder);
            r2c1.appendChild(instance.message);
            r3c1.style.padding = '4px';
            r3c1.style.textAlign = 'right';
            instance.message.style.width = '545px';
            instance.message.style.height = '350px';

            r3c1.appendChild(instance.cancelButton);
            r3c1.appendChild(instance.postButton);
            document.body.appendChild(instance.modalBackground);
            document.body.appendChild(instance.review);
            instance.review.appendChild(instance.formTable);

            $(instance.review).animate({ width: instance.rect.width, left: instance.finalLeft }, instance.animationTimer, instance.animationEasing, function () {
                $(instance.review).animate({ height: instance.rect.height }, instance.animationTimer, instance.animationEasing, function () {
                    instance.message.focus();
                    instance.message.select();
                });
            });

            return instance;
        }
        instance.submit = function () {
            if (instance.message.value.length == 0) {
                alert('You must eneter a message along with your review.');
                return;
            }
            $.ajax({
                type: "POST",
                processData: false,
                url: Rendition.Merchant.responderURL,
                data: 'method1=["AddReview",[' + JSON.stringify({
                    rating: instance.rating.value,
                    message: instance.message.value,
                    objId: args.itemNumber,
                    objType: 'itemNumber'
                }) + ']]',
                dataType: "json",
                error: Rendition.Merchant.ajaxError,
                success: function (e) {
                    var rev = document.getElementById(args.updateTargetId);
                    if (rev) {
                        $(rev).load('/detail.aspx?reviews=' + Rendition.Merchant.createUUID() + '&item=' + args.itemNumber, function () {
                            window.location = '#' + e.method1.AddReview.reviewId;
                        });
                    }
                    instance.close();
                }
            });
        }
        instance.dispose = function () {
            document.body.removeChild(instance.modalBackground);
            document.body.removeChild(instance.review);
        }
        instance.close = function (e) {
            instance.dispose();
        }
        instance.init();
    },
    /**
    * Form validation.  Prevents invalid input and runs a callback procedure when validation is successful.
    * @type Native.Function
    * @name Rendition.Merchant.validateForm
    * @memberOf Rendition.Merchant
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.DHTMLElement} [args.form] The DHTMLElement that contains the controls to validate.
    * @param {Native.Function} [args.callbackProcedure] Procedure to run when this method completes successfully. Signature: (JSONResponse e).
    */
    validateForm: function (form, callbackProcedure) {
        var self = this;
        formElements = $(form).find(':input');
        var i = null;
        var h = formElements.length;
        for (var x = 0; h > x; x++) {
            i = formElements[x];
            if (i.tagName.toLowerCase() == "input" || i.tagName.toLowerCase() == "select" || i.tagName.toLowerCase() == "textarea") {
                if (i.type == "text" && i.name.match(Rendition.Merchant.askLeaveBlank)) {
                    if (i.value.length == 0 && i.getAttribute("ignorevalidation") != "1") {
                        new Rendition.Merchant.pointOutAProblem({
                            obj: i,
                            message: "Are you sure you want to leave this field blank?",
                            ignoreMessage: "I want to leave it blank",
                            fixMessage: "I want to go back and change it",
                            onFixProbelm: function (e) {
                                e.focus();
                                e.select();
                                return false;
                            },
                            onIgnoreProbelm: function (e) {
                                e.setAttribute("ignorevalidation", "1");
                                return Rendition.Merchant.validateForm(form, callbackProcedure);
                            }
                        });
                        return null;
                    }
                } else if (i.tagName.toLowerCase() == "select" &&
                    i.name.match(Rendition.Merchant.askLeaveDefault)) {
                    if (Rendition.Merchant.defaultValues.indexOf(i.value) != -1
                    && i.getAttribute("ignorevalidation") != "1") {
                        new Rendition.Merchant.pointOutAProblem({
                            obj: i,
                            message: "Are you sure you want to leave this unselected?",
                            ignoreMessage: "I want to leave it unselected",
                            fixMessage: "I want to go back and change it",
                            onFixProbelm: function (e) {
                                e.focus();
                                return false;
                            },
                            onIgnoreProbelm: function (e) {
                                e.setAttribute("ignorevalidation", "1");
                                return Rendition.Merchant.validateForm(form, callbackProcedure);
                            }
                        });
                        return null;
                    }
                } else if (
				    i.name.match(Rendition.Merchant.cannotBeBlank)
				    && (!i.name.match(Rendition.Merchant.cannotBeBlankExceptions))
				    ) {
                    if (i.value.length == 0) {
                        new Rendition.Merchant.pointOutAProblem({
                            obj: i,
                            message: i.title + ' cannot be left blank',
                            fixMessage: "Close",
                            onFixProbelm: function (e) {
                                e.focus();
                                return false;
                            }
                        });
                        return null;
                    }
                } else if (i.name.match(Rendition.Merchant.cannotBeDefault)) {
                    if (Rendition.Merchant.defaultValues.indexOf(i.value) != -1) {
                        new Rendition.Merchant.pointOutAProblem({
                            obj: i,
                            message: "Please select a value to continue.",
                            fixMessage: "Close",
                            onFixProbelm: function (e) {
                                e.focus();
                                return false;
                            }
                        });
                        return null;
                    }
                }
            }
        }
        callbackProcedure.apply(self, [self]);
    },
    /* utility */
    /* creates a menu (DIV) with an animation - works hierarchaly */
    /**
    * Creates drop down menus.  Works in a hierarchy.  
    * Clones hidden DHTMLElements as children of another DHTMLElement positioned absolutly.
    * @type Native.Function
    * @name Rendition.Merchant.openMenu
    * @memberOf Rendition.Merchant
    * @param {Native.Object} [args] Parameters for the function.
    * @param {Native.DHTMLElement} [args.source] The DHTMLElement to clone.
    * @param {Native.DHTMLElement} [args.target] The DHTMLElement to append the cloned object to.
    * @param {Native.Boolean} [args.supressOnClick=false] Prevent clicks from causing the menu to close.
    * @param {Native.Boolean} [args.supressOnMouseout=false] Prevent mouseouts from causing the menu to close.
    * @param {Native.Boolean} [args.animate=true] When true the element will be animated.
    * @param {Native.Array} [args.slide=['down']] Array of directions to 'slide' when opening.  For example ['down','left'] to go down, then left.
    * @param {Native.Object} [args.easingOut] The easing method of the reveal animation.
    * @param {Native.Object} [args.easingIn] The easing method of the hide animation.
    * @param {Native.Object} [args.hideSpeed] The speed of the hide animation.
    * @param {Native.Object} [args.revealSpeed] The speed of the reveal animation.
    * @param {Native.Object} [args.offsetTop=0] The offset of the top.
    */
    openMenu: function (params) {
        var caller = params.target; /*ya, that's confusing*/
        var targetMenu = params.source;
        if (caller.getAttribute('menu') == '1' || targetMenu === undefined) { return null; }
        var self = {};
        self.closed = true;
        self.caller = caller;
        self.caller.setAttribute('menu', '1');
        self.supressOnClick = params.supressOnClick || false;
        self.supressOnMouseout = params.supressOnMouseout || false;
        self.animate = params.animate || true;
        self.slide = params.slide || ["down"];
        self.easingRevealMenu = params.easingOut || Rendition.Merchant.easeOut;
        self.easingHideMenu = params.easingIn || Rendition.Merchant.easeIn;
        self.easingHideMenuTime = params.hideSpeed || 0;
        self.easingRevealMenuTime = params.revealSpeed || 0;
        self.offsetTop = params.offsetTop || 0;
        self.offsetLeft = params.offsetLeft || 0;
        self.delay = params.delay || 0;
        self.closeTimeoutTime = params.closeTimeoutTime || 25;
        self.dispose = function () {
            Rendition.Merchant.removeEvent('mouseout', self.caller, self.closeMouseEvent, true);
            if (self.timer) {
                Rendition.Merchant.removeEvent('click', self.caller, self.init, false);
                clearTimeout(self.timer);
            } else {
                if (self.menu) {
                    Rendition.Merchant.removeEvent('click', self.menu, self.close, false);
                    Rendition.Merchant.removeEvent('mouseout', self.menu, self.closeMouseEvent, true);
                    self.caller.removeChild(self.menu);
                    self.menu = null;
                }
            }
            return null;
        }
        self.closeMouseEvent = function (e) {
            if (self.closeTimeout) {
                clearTimeout(self.timer);
            }
            e = e || window.event;
            if (self.badIE) {
                var rel = e.toElement;
            } else {
                var rel = e.relatedTarget;
            }
            self.closeTimeout = setTimeout(function () {
                self.close(rel);
            }, self.closeTimeoutTime);
        }
        self.close = function (rel) {
            /* begin trying to close */
            self.closed = true;
            if (Rendition.Merchant.isChildOf(rel, self.caller) || Rendition.Merchant.isChildOf(rel, self.menu)) {
                return null
            }
            self.caller.setAttribute('menu', '0');
            if (self.timer) {
                return self.dispose();
            } else {
                if (self.animate) {
                    $(self.menu).animate({ top: "+=" + self.pos.y, opacity: 0 }, self.easingHideMenuTime, self.easingHideMenu, function () {
                        return self.dispose();
                    });
                    return null;
                } else {
                    return self.dispose();
                }
            }
        }
        self.init = function () {
            self.closed = false;
            Rendition.Merchant.removeEvent('click', self.caller, self.init, false);
            if (self.timer) {
                clearTimeout(self.timer);
                self.timer = null;
            }
            var org = targetMenu;
            if (org === undefined) { return null }
            self.pos = Rendition.Merchant.getPositionUntilAbsolute(self.caller);
            self.menu = targetMenu.cloneNode(true);
            self.menu.style.position = 'absolute';
            self.menu.style.display = 'block';
            self.menu.style.visibility = 'visible';
            self.menu.style.zIndex = '9999';
            /* append and animate */
            self.caller.appendChild(self.menu);
            /* get the size of the item we just cloned */
            var dim = { h: parseInt(self.menu.offsetHeight), w: parseInt(self.menu.offsetWidth) }
            for (var x = 0; self.slide.length > x; x++) {
                if (self.slide[x].toLowerCase() == "down") {
                    if (self.animate) {
                        self.menu.style.top = self.pos.y + 'px';
                        self.menu.style.left = self.pos.x + 'px';
                        self.pos.y += self.caller.offsetHeight;
                    } else {
                        self.pos.y += self.caller.offsetHeight;
                        self.menu.style.top = (self.pos.y) + 'px';
                        self.menu.style.left = self.pos.x + 'px';
                    }
                } else if (self.slide[x].toLowerCase() == "right") {
                    if (self.animate) {
                        self.menu.style.top = (self.pos.y) + 'px';
                        self.menu.style.left = (self.pos.x) + 'px';
                        self.pos.x += self.caller.offsetWidth;
                    } else {
                        self.pos.x += self.caller.offsetWidth;
                        self.menu.style.top = (self.pos.y) + 'px';
                        self.menu.style.left = (self.pos.x) + 'px';
                    }
                } else if (self.slide[x].toLowerCase() == "left") {
                    if (self.animate) {
                        self.menu.style.top = (self.pos.y) + 'px';
                        self.menu.style.left = (self.pos.x) + 'px';
                        self.pos.x -= (dim.w);
                    } else {
                        self.pos.x -= (dim.w);
                        self.menu.style.top = (self.pos.y) + 'px';
                        self.menu.style.left = (self.pos.x) + 'px';
                    }
                }
            }
            self.pos.y -= self.offsetTop;
            self.pos.x -= self.offsetLeft;
            if (self.animate) {
                if (self.menu.addEventListener) {
                    /* get small, vanish */
                    self.menu.style.opacity = '0';
                    self.menu.style.width = '0';
                    self.menu.style.height = '0';
                    var aniOptions = {
                        top: self.pos.y + 'px',
                        left: self.pos.x + 'px',
                        opacity: 1,
                        height: dim.h + 'px',
                        width: dim.w + 'px'
                    }
                    $(self.menu).animate(aniOptions, self.easingRevealMenuTime, self.easingRevealMenu);
                } else {
                    /* don't get small for IE */
                    self.menu.style.top = self.pos.y + 'px';
                    self.menu.style.left = self.pos.x + 'px';
                }
            }
            if (!self.supressOnMouseout) {
                Rendition.Merchant.appendEvent('mouseout', self.menu, self.closeMouseEvent, true);
            }
            if (params.callbackProcedure && !self.closed) {
                params.callbackProcedure.apply(self, [self, params]);
            }
        }
        /* add close procedure */
        if (!self.supressOnMouseout) {
            Rendition.Merchant.appendEvent('mouseout', self.caller, self.closeMouseEvent, true);
        }
        if (!self.supressOnClick) {
            Rendition.Merchant.appendEvent('click', self.caller, self.init, false);
        }
        /* start the timer */
        self.timer = setTimeout(self.init, self.delay);
    },
    /* checks to see if this object is a child of the current object */
    isChildOf: function (e, parentObj) {
        while (e) {
            if (e == parentObj) {
                return true;
            }
            e = e.parentNode;
        }
        return false;
    },
    /* gets the position of the element */
    getPosition: function (e) {
        var eleft = 0;
        var etop = 0;
        while (e.offsetParent) {
            eleft += e.offsetLeft;
            etop += e.offsetTop;
            eleft -= e.scrollLeft;
            etop -= e.scrollTop;
            e = e.offsetParent;
        }
        return { x: eleft, y: etop }
    },
    /* gets the position of the element until it finds an absolutly positioned element*/
    getPositionUntilAbsolute: function (e) {
        var eleft = 0;
        var etop = 0;
        while (e.offsetParent) {
            if (e.style.position == 'absolute') {
                break;
            }
            eleft += e.offsetLeft;
            etop += e.offsetTop;
            eleft -= e.scrollLeft;
            etop -= e.scrollTop;
            e = e.offsetParent;
        }
        return { x: eleft, y: etop }
    },
    /* cross browser addEventListener *//* gets the position of the element */
    appendEvent: function (type, listener, appendedFunction, capture) {
        if (listener) {
            if (listener.addEventListener) {
                listener.addEventListener(type, appendedFunction, capture);
            } else if (listener.attachEvent) {
                listener.attachEvent('on' + type, appendedFunction);
            } else {
                //alert('Can\'t attach event to listener!');
            }
        }
    },
    /* cross browser removeEventListener *//* gets the position of the element */
    removeEvent: function (type, listener, removedFunction, capture) {
        if (listener) {
            if (listener.removeEventListener) {
                listener.removeEventListener(type, removedFunction, capture);
            } else if (listener.detachEvent) {
                listener.detachEvent('on' + type, removedFunction);
            } else {
                //alert('Can\'t unattach event from listener!');
            }
        } else {
            //alert('No function to detach found for event on' + type);
        }
    },
    /* uses JQuery selector to find all inputs in a DHTML object and turns them into an structure/object/dictionary/whatever */
    getInputs: function (form) {
        if (form) {
            var t = {}
            inputs = $(form).find(':input');
            for (var i = inputs.length - 1; i >= 0; --i) {
                if (inputs[i].type == 'checkbox') {
                    if (inputs[i].name.length == 0) { continue; }
                    if (inputs[i].checked) {
                        t[inputs[i].name] = true;
                    } else {
                        t[inputs[i].name] = false;
                    }
                } else if (inputs[i].type == 'radio') {
                    if (inputs[i].name.length == 0) { continue; }
                    if (inputs[i].checked) {
                        t[inputs[i].name] = inputs[i].checked;
                    }
                } else {
                    if (inputs[i].name.length == 0) { continue; }
                    t[inputs[i].name] = inputs[i].value;
                }
            }
            return t;
        } else {
            return {}
        }
    },
    /* creates a UUID (hence the name createUUID) */
    createUUID: function () {
        /*http://www.rfc-archive.org/getrfc.php?rfc=4122 4.4.  Algorithms for Creating a UUID from Truly Random or Pseudo-Random Numbers */
        var s = [];
        var hexDigits = '0123456789ABCDEF';
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        /*bits 12-15 of the time_hi_and_version field to 0010*/
        s[12] = '4';
        /*bits 6-7 of the clock_seq_hi_and_reserved to 01*/
        s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);
        var uuid = s.join('');
        return uuid.substring(0, 8) + '-' + uuid.substring(8, 12) + '-' + uuid.substring(12, 16) + '-' + uuid.substring(16, 20) + '-' + uuid.substring(20, 32);
    },
    /* encodes strings for safe transport in JSON */
    jsonEncode: function (str) {
        return str.replace(/"/g, '\"').replace(/\\/g, '\\\\');
    },
    /* turns GUIDs into JS/DHTML safe Ids */
    encodeXMLId: function (e) {
        return 'd' + e.replace(/}/g, '').replace(/{/g, '').replace(/-/g, '_');
    },
    /* used by validate to point out problems with forms */
    pointOutAProblem: function (params) {
        if (params.obj.pointOutAProblem) { return null }
        params.offsetLeftMax = params.offsetLeftMax || 300;
        params.offsetTopMax = params.offsetTopMax || 300;
        var self = {};
        self.params = params;
        self.maxWidth = params.maxWidth || 300;
        self.p = {
            t: document.documentElement.scrollTop,
            l: document.documentElement.scrollLeft,
            h: document.documentElement.clientHeight,
            w: document.documentElement.clientWidth
        }
        params.obj.pointOutAProblem = self;
        var pos = Rendition.Merchant.getPosition(params.obj);
        self.dialog = document.createElement("div");
        self.uiDialog = $(".ui-dialog-content")[0];
        if (self.uiDialog === undefined) {
            self.uiDialog = { scrollTop: 0 }
        }
        self.dialog.className = 'pointOutAProblem';
        self.dialog.style.maxWidth = self.maxWidth + 'px';
        self.dialog.style.position = 'absolute';
        self.dialog.style.top = (pos.y + 10 - self.uiDialog.scrollTop) + "px";
        self.dialog.style.left = parseInt(self.p.w / 2) + "px";
        if (self.p.w < (self.left + params.offsetLeftMax)) {
            /* box needs to be on the left hand side of the object */
            self.dialog.innerHTML = '\<div class="pointOutAProblemArrowRight" style="float:right;height:15px;width:15px;margin:-15px -25px 0 0;text-shadow:#000 1px 1px 1px;">&#8655;</div>\
		    <div style="padding:4px;">\
		    ' + params.message + '</div>';
        } else {
            /* box needs to be on the right hand side of the object */
            self.dialog.innerHTML = '\<div class="pointOutAProblemArrowLeft" style="float:left;height:15px;width:15px;margin:-15px 0 0 -25px;text-shadow:#000 1px 1px 1px;">&#8656;</div>\
		    <div style="padding:4px;">\
		    ' + params.message + '</div>';
        }
        self.fixProbelm = document.createElement("button");
        self.fixProbelm.style.margin = '4px';
        self.fixProbelm.innerHTML = params.fixMessage;
        if (params.ignoreMessage) {
            self.ignoreProbelm = document.createElement("button");
            self.ignoreProbelm.style.margin = '4px';
            self.ignoreProbelm.innerHTML = params.ignoreMessage;
            self.ignoreProbelm.onclick = function () {
                self.close();
                params.onIgnoreProbelm.apply(self, [params.obj, self]);
                params.obj.pointOutAProblem = null;
                return null;
            }
            self.dialog.appendChild(self.ignoreProbelm);
        }
        self.close = function () {
            Rendition.Merchant.removeEvent("keypress", params.obj, self.close, false);
            self.dialog.innerHTML = '';
            document.body.removeChild(self.dialog);
            Rendition.Merchant.removeEvent("change", params.obj, self.close, false);
            Rendition.Merchant.removeEvent('resize', window, self.redraw, false);
            Rendition.Merchant.removeEvent('scroll', window, self.redraw, false);
            Rendition.Merchant.removeEvent('scroll', $(".ui-dialog-content")[0], self.redraw, false);
            params.obj.style.backgroundColor = 'white';
            self = null;
        }
        self.fixProbelm.onclick = function () {
            self.close();
            params.onFixProbelm.apply(self, [params.obj, self]);
            params.obj.pointOutAProblem = null;
            return null;
        }
        self.redraw = function () {
            self.p = {
                t: document.documentElement.scrollTop,
                l: document.documentElement.scrollLeft,
                h: document.documentElement.clientHeight,
                w: document.documentElement.clientWidth
            }
            var pos = Rendition.Merchant.getPosition(self.params.obj);
            if (self.p.w < (pos.x + self.maxWidth)) {
                self.left = pos.x - self.maxWidth - 30;
                self.dialog.firstChild.className = 'pointOutAProblemArrowRight';
                self.dialog.firstChild.innerHTML = '&#8655';
                self.dialog.firstChild.style.margin = '-15px -25px 0 0';
                self.dialog.firstChild.style.cssFloat = 'right';
            } else {
                self.left = pos.x + params.obj.offsetWidth + 10;
                self.dialog.firstChild.className = 'pointOutAProblemArrowLeft';
                self.dialog.firstChild.innerHTML = '&#8656';
                self.dialog.firstChild.style.margin = '-15px 0 0 -25px';
                self.dialog.firstChild.style.cssFloat = 'left';
            }
            self.dialog.style.top = (pos.y + 10 - self.uiDialog.scrollTop) + "px";
            self.dialog.style.left = self.left + "px";
            return null;
        }
        Rendition.Merchant.appendEvent('scroll', window, self.redraw, false);
        Rendition.Merchant.appendEvent('resize', window, self.redraw, false);
        Rendition.Merchant.appendEvent("keypress", params.obj, self.close, false);
        self.dialog.appendChild(self.fixProbelm);
        document.body.appendChild(self.dialog);
        self.flash = function () {
            $(params.obj).animate({ backgroundColor: Rendition.Merchant.pulseColor1 }, 500, 'linear', function () {
                $(params.obj).animate({ backgroundColor: Rendition.Merchant.pulseColor2 }, 500, 'linear', function () {
                    if (self) {
                        self.flash();
                    }
                });
            });
        }
        if (pos.y + params.offsetTopMax > (self.p.t + self.p.h)) {
            document.documentElement.scrollTop = pos.y - params.offsetTopMax;
        }
        try {
            /* this blows IE's mind - who knows why */
            self.dialog.style.left = (self.left + 'px');
        } catch (ex) { }
        self.redraw();
        self.flash();
    },
    updateSelectablePrice: function (_basePrice, inputContainerSelector, priceElementSelector, callbackProcedure) {
        var formElements = $(inputContainerSelector).find(':input');
        var priceElement = $(priceElementSelector);
        var total = 0;
        /* for newbies to JS: when adding floats - money - 
        it's important to _first_ convert all numbers to integers
        then covert them back to floats (x*100 / 100).toFixed(2) */
        for (var x = 0; formElements.length > x; x++) {
            var i = formElements[x];
            /* form constructor.cs select options contain attributes called 'price' and 'itemNumber' */
            if (i.tagName.toLowerCase() == "select") {
                /* get the selected option */
                var opt = i.options[i.selectedIndex];
                var price = 0;
                var itemNumber = '';
                var _price = opt.getAttribute('price');
                var _itemNumber = opt.getAttribute('itemNumber');
                if (_price !== undefined) {
                    if (!isNaN(parseFloat(_price))) {
                        price = parseInt(parseFloat(_price) * 100);
                        total += price;
                    }
                }
                if (_itemNumber !== undefined) {
                    itemNumber = _itemNumber;
                }
                if (i.previousSibling) {
                    if (i.previousSibling.className == 'info') {
                        var info = i.previousSibling;
                        info.onmouseover = function (e) {
                            /* put info bubble */
                        }
                        info.onclick = function (e) {
                            /* put info bubble */
                        }
                    }
                }
            }
        }
        var basePrice = parseInt(parseFloat(_basePrice) * 100);
        total += basePrice;
        if (priceElement[0]) {
            priceElement[0].innerHTML = '$' + (parseFloat(total) / parseFloat(100)).toFixed(2);
        }
        if (callbackProcedure) {
            callbackProcedure.apply(this, []);
        }
    }
}

/* Some versions of IE are missing this prototype */
if (!Array.indexOf) {
    Array.prototype.indexOf = function (obj) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == obj) {
                return i;
            }
        }
        return -1;
    }
}

/*
http://www.JSON.org/json2.js
2011-02-23

Public Domain.

NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

See http://www.JSON.org/js.html


This code should be minified before deployment.
See http://javascript.crockford.com/jsmin.html

USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
NOT CONTROL.


This file creates a global JSON object containing two methods: stringify
and parse.

JSON.stringify(value, replacer, space)
value       any JavaScript value, usually an object or array.

replacer    an optional parameter that determines how object
values are stringified for objects. It can be a
function or an array of strings.

space       an optional parameter that specifies the indentation
of nested structures. If it is omitted, the text will
be packed without extra whitespace. If it is a number,
it will specify the number of spaces to indent at each
level. If it is a string (such as '\t' or '&nbsp;'),
it contains the characters used to indent at each level.

This method produces a JSON text from a JavaScript value.

When an object value is found, if the object contains a toJSON
method, its toJSON method will be called and the result will be
stringified. A toJSON method does not serialize: it returns the
value represented by the name/value pair that should be serialized,
or undefined if nothing should be serialized. The toJSON method
will be passed the key associated with the value, and this will be
bound to the value

For example, this would serialize Dates as ISO strings.

Date.prototype.toJSON = function (key) {
function f(n) {
// Format integers to have at least two digits.
return n < 10 ? '0' + n : n;
}

return this.getUTCFullYear()   + '-' +
f(this.getUTCMonth() + 1) + '-' +
f(this.getUTCDate())      + 'T' +
f(this.getUTCHours())     + ':' +
f(this.getUTCMinutes())   + ':' +
f(this.getUTCSeconds())   + 'Z';
};

You can provide an optional replacer method. It will be passed the
key and value of each member, with this bound to the containing
object. The value that is returned from your method will be
serialized. If your method returns undefined, then the member will
be excluded from the serialization.

If the replacer parameter is an array of strings, then it will be
used to select the members to be serialized. It filters the results
such that only members with keys listed in the replacer array are
stringified.

Values that do not have JSON representations, such as undefined or
functions, will not be serialized. Such values in objects will be
dropped; in arrays they will be replaced with null. You can use
a replacer function to replace those with JSON values.
JSON.stringify(undefined) returns undefined.

The optional space parameter produces a stringification of the
value that is filled with line breaks and indentation to make it
easier to read.

If the space parameter is a non-empty string, then that string will
be used for indentation. If the space parameter is a number, then
the indentation will be that many spaces.

Example:

text = JSON.stringify(['e', {pluribus: 'unum'}]);
// text is '["e",{"pluribus":"unum"}]'


text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
// text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

text = JSON.stringify([new Date()], function (key, value) {
return this[key] instanceof Date ?
'Date(' + this[key] + ')' : value;
});
// text is '["Date(---current time---)"]'


JSON.parse(text, reviver)
This method parses a JSON text to produce an object or array.
It can throw a SyntaxError exception.

The optional reviver parameter is a function that can filter and
transform the results. It receives each of the keys and values,
and its return value is used instead of the original value.
If it returns what it received, then the structure is not modified.
If it returns undefined then the member is deleted.

Example:

// Parse the text. Values that look like ISO date strings will
// be converted to Date objects.

myData = JSON.parse(text, function (key, value) {
var a;
if (typeof value === 'string') {
a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
if (a) {
return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
+a[5], +a[6]));
}
}
return value;
});

myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
var d;
if (typeof value === 'string' &&
value.slice(0, 5) === 'Date(' &&
value.slice(-1) === ')') {
d = new Date(value.slice(5, -1));
if (d) {
return d;
}
}
return value;
});


This is a reference implementation. You are free to copy, modify, or
redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
lastIndex, length, parse, prototype, push, replace, slice, stringify,
test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
	JSON = {};
}

(function () {
	"use strict";

	function f(n) {
		// Format integers to have at least two digits.
		return n < 10 ? '0' + n : n;
	}

	if (typeof Date.prototype.toJSON !== 'function') {

		Date.prototype.toJSON = function (key) {

			return isFinite(this.valueOf()) ?
                this.getUTCFullYear() + '-' +
                f(this.getUTCMonth() + 1) + '-' +
                f(this.getUTCDate()) + 'T' +
                f(this.getUTCHours()) + ':' +
                f(this.getUTCMinutes()) + ':' +
                f(this.getUTCSeconds()) + 'Z' : null;
		};

		String.prototype.toJSON =
            Number.prototype.toJSON =
            Boolean.prototype.toJSON = function (key) {
            	return this.valueOf();
            };
	}

	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
        	'\b': '\\b',
        	'\t': '\\t',
        	'\n': '\\n',
        	'\f': '\\f',
        	'\r': '\\r',
        	'"': '\\"',
        	'\\': '\\\\'
        },
        rep;


	function quote(string) {

		// If the string contains no control characters, no quote characters, and no
		// backslash characters, then we can safely slap some quotes around it.
		// Otherwise we must also replace the offending characters with safe escape
		// sequences.

		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		}) + '"' : '"' + string + '"';
	}


	function str(key, holder) {

		// Produce a string from holder[key].

		var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

		// If the value has a toJSON method, call it to obtain a replacement value.

		if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}

		// If we were called with a replacer function, then call the replacer to
		// obtain a replacement value.

		if (typeof rep === 'function') {
			value = rep.call(holder, key, value);
		}

		// What happens next depends on the value's type.

		switch (typeof value) {
			case 'string':
				return quote(value);

			case 'number':

				// JSON numbers must be finite. Encode non-finite numbers as null.

				return isFinite(value) ? String(value) : 'null';

			case 'boolean':
			case 'null':

				// If the value is a boolean or null, convert it to a string. Note:
				// typeof null does not produce 'null'. The case is included here in
				// the remote chance that this gets fixed someday.

				return String(value);

				// If the type is 'object', we might be dealing with an object or an array or
				// null.

			case 'object':

				// Due to a specification blunder in ECMAScript, typeof null is 'object',
				// so watch out for that case.

				if (!value) {
					return 'null';
				}

				// Make an array to hold the partial results of stringifying this object value.

				gap += indent;
				partial = [];

				// Is the value an array?

				if (Object.prototype.toString.apply(value) === '[object Array]') {

					// The value is an array. Stringify every element. Use null as a placeholder
					// for non-JSON values.

					length = value.length;
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || 'null';
					}

					// Join all of the elements together, separated with commas, and wrap them in
					// brackets.

					v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
					gap = mind;
					return v;
				}

				// If the replacer is an array, use it to select the members to be stringified.

				if (rep && typeof rep === 'object') {
					length = rep.length;
					for (i = 0; i < length; i += 1) {
						if (typeof rep[i] === 'string') {
							k = rep[i];
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				} else if (value.tagName === undefined) {

					// Otherwise, iterate through all of the keys in the object.

					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ': ' : ':') + v);
							}
						}
					}
				}

				// Join all of the member texts together, separated with commas,
				// and wrap them in braces.

				v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
				gap = mind;
				return v;
		}
	}

	// If the JSON object does not yet have a stringify method, give it one.

	if (typeof JSON.stringify !== 'function') {
		JSON.stringify = function (value, replacer, space) {

			// The stringify method takes a value and an optional replacer, and an optional
			// space parameter, and returns a JSON text. The replacer can be a function
			// that can replace values, or an array of strings that will select the keys.
			// A default replacer method can be provided. Use of the space parameter can
			// produce text that is more easily readable.

			var i;
			gap = '';
			indent = '';

			// If the space parameter is a number, make an indent string containing that
			// many spaces.

			if (typeof space === 'number') {
				for (i = 0; i < space; i += 1) {
					indent += ' ';
				}

				// If the space parameter is a string, it will be used as the indent string.

			} else if (typeof space === 'string') {
				indent = space;
			}

			// If there is a replacer, it must be a function or an array.
			// Otherwise, throw an error.

			rep = replacer;
			if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
				throw new Error('JSON.stringify');
			}

			// Make a fake root object containing our value under the key of ''.
			// Return the result of stringifying the value.

			return str('', { '': value });
		};
	}


	// If the JSON object does not yet have a parse method, give it one.

	if (typeof JSON.parse !== 'function') {
		JSON.parse = function (text, reviver) {

			// The parse method takes a text and an optional reviver function, and returns
			// a JavaScript value if the text is a valid JSON text.

			var j;

			function walk(holder, key) {

				// The walk method is used to recursively walk the resulting structure so
				// that modifications can be made.

				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}


			// Parsing happens in four stages. In the first stage, we replace certain
			// Unicode characters with escape sequences. JavaScript handles many characters
			// incorrectly, either silently deleting them, or treating them as line endings.

			text = String(text);
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (a) {
					return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}

			// In the second stage, we run the text against regular expressions that look
			// for non-JSON patterns. We are especially concerned with '()' and 'new'
			// because they can cause invocation, and '=' because it can cause mutation.
			// But just to be safe, we want to reject all unexpected forms.

			// We split the second stage into 4 regexp operations in order to work around
			// crippling inefficiencies in IE's and Safari's regexp engines. First we
			// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
			// replace all simple value tokens with ']' characters. Third, we delete all
			// open brackets that follow a colon or comma or that begin the text. Finally,
			// we look to see that the remaining characters are only whitespace or ']' or
			// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

			if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

				// In the third stage we use the eval function to compile the text into a
				// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
				// in JavaScript: it can begin a block or an object literal. We wrap the text
				// in parens to eliminate the ambiguity.

				j = eval('(' + text + ')');

				// In the optional fourth stage, we recursively walk the new structure, passing
				// each name/value pair to a reviver function for possible transformation.

				return typeof reviver === 'function' ?
                    walk({ '': j }, '') : j;
			}

			// If the text is not JSON parseable, then a SyntaxError is thrown.

			throw new SyntaxError('JSON.parse');
		};
	}
} ());