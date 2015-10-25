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
* Order editor.
* @constructor
* @name Rendition.Commerce.OrderEditor
*/
Rendition.Commerce.OrderEditor = function (args) {
    var instance = {}
    instance.closed = false;
    instance.discountTotal = 0;
    instance.estShipTotal = 0;
    instance.grandTotal = 0;
    instance.subTotal = 0;
    instance.taxTotal = 0;
    instance.scannedImageExists = false;
    instance.previewRecalculation = true;
    instance.parentOrderId = -1;
    instance.childOrderId = -1;
    instance.requisitionedByHandle = '';
    instance.approvedByHandle = '';
    instance.soldByHandle = '';
    instance.defaultErrorMessage = Rendition.Localization['OrderEditor_There_was_an_error_placingupdating_your_order'].Title;
    if (args === undefined) { args = {} }
    /* if the user passed a value trying to open an order, let the struct know it's an existing order and not a new order */
    instance.existingOrder = (args.orderId !== undefined || args.orderNumber !== undefined);
    instance.tabOrder = {
        billTo: 0,
        shipTo: 1,
        lines: 2,
        attachments: 3,
        history: 4,
        payment: 5,
        tracking: 6
    }
    instance.controlInput = function (e) {
        try {
            var controlOn = false;
            if (e === undefined) {
                controlOn = false;
            }
            if (e.explicitOriginalTarget === undefined) {
                controlOn = false;
            }
            if (e.explicitOriginalTarget !== undefined) {
                var tag = e.explicitOriginalTarget.tagName;
                if (tag === 'DIV' || tag === 'TABLE') {
                    controlOn = true;
                }
            }
            if (controlOn) {
                Rendition.UI.controlInput.focus();
                Rendition.UI.controlInput.onkeyup = instance.keyHandler;
            }
        } catch (f) { }
    }
    instance.updateClosed = function () {
        var hLength = instance.flags.length;
        for (var x = 0; hLength > x; x++) {
            if (instance.flags[x][8] || instance.flags[x][9]) {
                if (instance.flags[x][0] === instance.lastFlagStatus) {
                    instance.closed = true;
                    return;
                }
            }
        }
        instance.closed = false;
        return;
    }
    instance.closeDialog = function (e, dialog, callbackProcedure) {
        if (instance.isDirty()) {
            instance.confirmClose = Rendition.UI.ConfirmDialog({
                ontrue: function () {
                    if (instance.dialog) {
                        Rendition.UI.removeEvent('close', instance.dialog, instance.closeDialog, false);
                        instance.dialog.close();
                    } else {
                        args.parentNode.innerHTML = '';
                    }
                    instance.confirmClose.dialog.close();
                    Rendition.UI.removeEvent('beforeunload', window, instance.close, false);
                    if (typeof callbackProcedure == 'function') {
                        callbackProcedure.apply(this, [this, instance, instance.dialog]);
                    }
                },
                onfalse: function () {
                    instance.confirmClose.dialog.close();
                },
                title: Rendition.Localization['OrderEditor_Confirm_Close_Order'].Title,
                subTitle: Rendition.Localization['OrderEditor_You_have_unsaved_changes'].Title,
                message: Rendition.Localization['OrderEditor_Do_you_want_to_save_changes'].Message,
                dialogRect: { x: (document.documentElement.clientWidth * .5) - (450 * .5), y: 75, h: 173, w: 450 }
            });
            instance.dialog.preventDefault();
        } else {
            Rendition.UI.removeEvent('close', instance.dialog, instance.closeDialog, false);
            Rendition.UI.removeEvent('beforeunload', window, instance.close, false);
            if (e === null) {
                instance.dialog.close();
            }
            if (typeof callbackProcedure == 'function') {
                callbackProcedure.apply(this, [this, instance, instance.dialog]);
            }
        }
    }
    if (args.activeTab === undefined) { args.activeTab = 0; }
    if (args.parentNode === undefined) {
        instance.dialog = Rendition.UI.Dialog({
            rect: {
                x: Rendition.UI.dialogPosition.x,
                y: Rendition.UI.dialogPosition.y,
                h: document.documentElement.clientHeight - 100,
                w: 570
            },
            title: Rendition.Localization['OrderEditor_Order_Editor_Loading'].Title,
            rememberPosition: true,
            id: 'orderEditorAllByItself',
            close: instance.closeDialog
        });
        args.parentNode = instance.dialog.content;
        Rendition.UI.appendEvent('close', instance.dialog, instance.closeDialog, false);
        Rendition.UI.appendEvent('click', instance.dialog.content.parentNode, instance.controlInput, false);
    }
    instance.keyHandler = function (e) {
        if (e.keyCode === 113) {/* F2 was pressed, add to order */
            instance.addCurrentItem();
        } else if (e.keyCode === 115) {/* F4 was pressed, place order */
            instance.placeOrder();
        } else if (e.keyCode === 119) {/* F8 was pressed, get / return scanned image */
            if (instance.scannedImageExists) {
                if (instance.currentScannedImage === undefined) {
                    instance.getScannedImage();
                } else {
                    instance.returnScannedImage();
                }
            }
        } else if (e.keyCode === 120) {/* F9 was pressed, get / copy bill to to ship to */
            instance.copyAddress(0);
        }
        if (e.ctrlKey) {
            if (e.keyCode === 49) { /* 1 key pressed, switch to tab 1 */
                instance.tabs[instance.tabOrder.billTo].activate();
            } else if (e.keyCode === 50) { /* 2 key pressed, switch to tab 2 */
                instance.tabs[instance.tabOrder.shipTo].activate();
            } else if (e.keyCode === 51) { /* 3 key pressed, switch to tab 3 */
                instance.tabs[instance.tabOrder.lines].activate();
            } else if (e.keyCode === 52) { /* 4 key pressed, switch to tab 4 */
                instance.tabs[instance.tabOrder.attachments].activate();
            }
        }
    }
    if (instance.dialog === undefined) {
        Rendition.UI.appendEvent('click', args.parentNode, instance.controlInput, false);
    }
    instance.itemGroup = function (itemNumber, readonlyItemNumber, lastFlagStatus) {
        instance.formId = 'f' + Rendition.UI.createUUID();
        if (instance.currentSerialNumber != '' && instance.currentSerialNumber !== undefined) {
            var st = {
                HTML: function () {
                    for (var x = 0; instance.flags.length > x; x++) {
                        if (instance.flags[x][0] === lastFlagStatus) {
                            var info = document.createElement('div');
                            info.onclick = function () {
                                instance.changeStatus('line');
                            }
                            info.className = 'ui-corner-all info';
                            info.id = 'status_' + instance.currentSerialId;
                            info.innerHTML = '<b>' + Rendition.Localization['OrderEditor_Status'].Title + '</b>&nbsp;&nbsp;' + instance.flags[x][1];
                            return info;
                        }
                    }
                }
            }
            var sn = {
                HTML: function () {
                    for (var x = 0; instance.flags.length > x; x++) {
                        if (instance.flags[x][0] === lastFlagStatus) {
                            var info = document.createElement('div');
                            info.className = 'ui-corner-all info';
                            info.innerHTML = '<b>' + Rendition.Localization['OrderEditor_Serial_No'].Title + '</b> ' + instance.currentSerialNumber;
                            return info;
                        }
                    }
                }
            }
        } else {
            if (instance.existingOrder) {
                var sn = {
                    HTML: function () {
                        for (var x = 0; instance.flags.length > x; x++) {
                            if (instance.flags[x][0] === lastFlagStatus) {
                                var info = document.createElement('div');
                                info.className = 'ui-corner-all info';
                                info.innerHTML = Rendition.Localization['OrderEditor_You_have_recently_added_this_item_to_your_order'].Title;
                                return info;
                            }
                        }
                    }
                }
            }
        }
        if (readonlyItemNumber) {
            var f = {
                columnName: 'itemNumber',
                inputType: 'title'
            }
        } else {
            var f = Rendition.Commerce.itemNumberInput(itemNumber);
            f.inputSelectButton.callbackProcedure = function (selectButton) {
                instance.itemForm.getInputByName("itemNumber").value = selectButton.selectedValue;
                instance.fillNewItemDetailArea();
            }
        }
        return [
			{
			    name: Rendition.Localization['OrderEditor_Item'].Title,
			    expanded: true,
			    inputs: [
					st,
					sn,
					f,
					{
					    columnName: 'qty'
					},
					{
					    columnName: 'price'
					},

				]
			},
			{
			    name: Rendition.Localization['OrderEditor_Customization_Form'].Title,
			    expanded: true,
			    inputs: [
					{
					    HTML: '<div id="' + instance.formId + '" style="height:500px;width:100%px;overflow:auto;"></div>'
					}
				]
			}
		]
    }
    instance.orderGroups = function (terms) {
        if (instance.existingOrder) {
            var soldBy = { columnName: 'soldBy', inputType: 'title' }
            var requisitionedBy = {
                HTML: function () {
                    instance.requisitionedByObj = document.createElement('div');
                    instance.requisitionedByObj.className = 'ui-corner-all info';
                    instance.requisitionedByObj.id = 'requisitionedBy_' + instance.orderId;
                    instance.requisitionedByObj.onclick = function () {
                        new Rendition.Commerce.AccountEditor({ orderId: instance.requisitionedBy });
                    }
                    instance.requisitionedByObj.innerHTML = '<b>' + Rendition.Localization['OrderEditor_Requisitioned_By'].Title + '</b>' + instance.requisitionedByHandle;
                    return instance.requisitionedByObj;
                }
            }
            var approvedBy = {
                HTML: function () {
                    instance.approvedByObj = document.createElement('div');
                    instance.approvedByObj.className = 'ui-corner-all info';
                    instance.approvedByObj.id = 'approvedBy_' + instance.orderId;
                    instance.approvedByObj.onclick = function () {
                        new Rendition.Commerce.AccountEditor({ orderId: instance.approvedBy });
                    }
                    instance.approvedByObj.innerHTML = '<b>' + Rendition.Localization['OrderEditor_Approved_By'].Title + '</b>' + instance.approvedByHandle;
                    return instance.approvedByObj;
                }
            }
            var soldBy = {
                HTML: function () {
                    instance.soldByObj = document.createElement('div');
                    instance.soldByObj.className = 'ui-corner-all info';
                    instance.soldByObj.id = 'soldBy_' + instance.orderId;
                    instance.soldByObj.onclick = function () {
                        new Rendition.Commerce.AccountEditor({ orderId: instance.soldBy });
                    }
                    instance.soldByObj.innerHTML = '<b>' + Rendition.Localization['OrderEditor_Sold_By'].Title + '</b>' + instance.soldByHandle;
                    return instance.soldByObj;
                }
            }
            var userId = {
                HTML: function () {
                    var uid = parseInt(this.getInputByName('userId').value);
                    instance.userIdObj = document.createElement('div');
                    instance.userIdObj.className = 'ui-corner-all info';
                    instance.userIdObj.id = 'userId_' + instance.orderId;
                    instance.userIdObj.innerHTML = '<b>' + Rendition.Localization['OrderEditor_Account_No'].Title + '</b>' + uid;
                    instance.userIdObj.onclick = function () {
                        new Rendition.Commerce.AccountEditor({ userId: uid });
                    }
                    return instance.userIdObj;
                }
            }
            var orderDate = { columnName: 'orderDate', inputType: 'title' }
            var termId = {
                HTML: function () {
                    var t = parseInt(this.getInputByName('termId').value);
                    var termName = '';
                    for (var x = 0; terms.length > x; x++) {
                        if (terms[x][0] === t) {
                            termName = terms[x][1];
                        }
                    }
                    instance.termObj = document.createElement('div');
                    instance.termObj.className = 'ui-corner-all info';
                    instance.termObj.id = 'term_' + instance.orderId;
                    instance.termObj.innerHTML = '<b>' + Rendition.Localization['OrderEditor_Terms'].Title + '</b>' + termName;
                    return instance.termObj;
                }
            }
            var status = {
                HTML: function () {
                    for (var x = 0; instance.flags.length > x; x++) {
                        if (instance.flags[x][0] === instance.lastFlagStatus) {
                            var info = document.createElement('div');
                            info.className = 'ui-corner-all info';
                            info.id = 'status_' + instance.orderId;
                            info.onclick = function () {
                                instance.changeStatus('order');
                            }
                            info.innerHTML = '<b>' + Rendition.Localization['OrderEditor_Status'].Title + '</b>&nbsp;&nbsp;' + instance.flags[x][1];
                            return info;
                        }
                    }
                }
            }
            var due = {
                HTML: function () {
                    var t = parseInt(this.getInputByName('termId').value);
                    instance.dueObj = document.createElement('div');
                    instance.dueObj.id = 'due_' + instance.orderId;
                    /* if this is cash */
                    if (t === 13) {
                        return instance.dueObj;
                    }
                    instance.dueObj.className = 'ui-corner-all info';
                    instance.dueObj.onclick = function () {
                        instance.makePayment();
                    }
                    instance.dueObj.innerHTML = '<b>' + Rendition.Localization['OrderEditor_Amount_Paid'].Title + '</b>&nbsp;&nbsp;$' + instance.paid;
                    return instance.dueObj;
                }
            }
            var child = {
                HTML: function () {
                    instance.childOrderObj = document.createElement('div');
                    instance.childOrderObj.className = 'ui-corner-all info';
                    instance.childOrderObj.id = 'child_' + instance.orderId;
                    instance.childOrderObj.onclick = function () {
                        new Rendition.Commerce.OrderEditor({ orderId: instance.childOrderId });
                    }
                    instance.childOrderObj.innerHTML = '<b>' + Rendition.Localization['OrderEditor_Backorder_To'].Title + '</b>' + instance.childOrderNumber;
                    return instance.childOrderObj;
                }
            }
            var parent = {
                HTML: function () {
                    instance.parentOrderObj = document.createElement('div');
                    instance.parentOrderObj.className = 'ui-corner-all info';
                    instance.parentOrderObj.id = 'parent_' + instance.orderId;
                    instance.parentOrderObj.onclick = function () {
                        new Rendition.Commerce.OrderEditor({ orderId: instance.parentOrderId });
                    }
                    instance.parentOrderObj.innerHTML = '<b>' + Rendition.Localization['OrderEditor_Backorder_From'].Title + '</b>' + instance.parentOrderNumber;
                    return instance.parentOrderObj;
                }
            }
        } else {
            var soldBy = Rendition.Commerce.userIdFormInput('soldBy', false);
            var requisitionedBy = Rendition.Commerce.userIdFormInput('requisitionedBy', false);
            var approvedBy = Rendition.Commerce.userIdFormInput('approvedBy', false);
            var userId = Rendition.Commerce.userIdFormInput('userId');
            userId.inputSelectButton.callbackProcedure = function (selectButton) {
                instance.orderForm.getInputByName("userId").value = selectButton.selectedValue;
                instance.lookupUserInfoFromField();
            }
            var termId = {
                columnName: 'termId',
                inputType: 'select',
                options: terms
            }
            var orderDate = {
                columnName: 'orderDate',
                inputType: 'datePicker'
            }
        }
        var a = [
			{
			    name: Rendition.Localization['OrderEditor_Base_Information'].Title,
			    expanded: true,
			    inputs: [
					userId,
					status,
					termId,
					due,
					orderDate,
					{
					    columnName: 'purchaseOrder'
					},
					{
					    columnName: 'manifest'
					},
					{
					    columnName: 'discountCode'
					},
					{
					    columnName: 'deliverBy',
					    inputType: 'datePicker'
					},
					{
					    columnName: 'FOB'
					}
				]
			},
			{
			    name: Rendition.Localization['OrderEditor_Comments'].Title,
			    expanded: instance.existingOrder,
			    inputs: [
					{
					    columnName: 'comment',
					    inputType: 'rte'
					}
				]
			}
		]
        if (instance.parentOrderId != instance.orderId) {
            a[0].inputs.splice(2, 0, parent);
        }
        if (instance.childOrderId != -1) {
            a[0].inputs.splice(2, 0, child);
        }
        if (instance.requisitionedByHandle != '') {
            a[0].inputs.splice(2, 0, requisitionedBy);
        }
        if (instance.approvedByHandle != '') {
            a[0].inputs.splice(2, 0, approvedBy);
        }
        if (instance.soldByHandle != '') {
            a[0].inputs.splice(2, 0, soldBy);
        }
        return a;
    }
    instance.makePayment = function (callbackProcedure) {
        if (instance.grandTotal === instance.paid && (instance.differencePaid === undefined || instance.differencePaid === 0)) {
            alert(Rendition.Localization['OrderEditor_This_order_is_already_paid_in_full'].Title);
            return;
        }
        var paymentType = 'creditCard';
        if (instance.termId === 0) {
            paymentType = 'creditCard';
        } else if (instance.termId === 13) {
            paymentType = 'cash';
        } else if (instance.termId === 20) {
            paymentType = 'wire';
        } else if (instance.termId === 9) {
            paymentType = 'check';
        } else {
            paymentType = 'credit';
        }
        Rendition.Commerce.MakePayment({
            paymentType: paymentType,
            orderIds: [instance.orderId || 0],
            userId: instance.session.UserId,
            amount: instance.grandTotal,
            callbackProcedure: callbackProcedure
        });
    }
    instance.getFlagByFlagTypeId = function (flagTypeId) {
        for (var x = 0; instance.flags.length > x; x++) {
            if (instance.flags[x][0] === flagTypeId) {
                return instance.flags[x][1];
            }
        }
    }
    instance.confirmOrderErrors = function (description, errorMessagePrefix) {
        instance.gotCreditCardData = false;
        var ok = Rendition.UI.button({ innerHTML: Rendition.Localization['OrderEditor_Ok'].Title, onclick: function (e, confirm) {
            instance.errorDialog.dialog.close();
            return;
        }
        });
        instance.errorDialog = Rendition.UI.ConfirmDialog({
            message: errorMessagePrefix || instance.defaultErrorMessage +
	'<textarea style="display:block;width:75%;height:135px;margin:auto;">' + description + '</textarea>',
            subTitle: Rendition.Localization['OrderEditor_Error'].Title,
            title: Rendition.Localization['OrderEditor_Error'].Title,
            buttons: [ok],
            dialogRect: { x: (document.documentElement.clientWidth * .5) - (Rendition.UI.saveChangesDialogWidth * .5), y: 75, h: 300, w: Rendition.UI.saveChangesDialogWidth },
            autosize: true
        });
    }
    if (instance.existingOrder) {
        var column = 'o.orderNumber';
        var value = args.orderNumber;
        if (args.orderId !== undefined) {
            column = 'o.orderId';
            value = args.orderId;
        }
        var url = 'method1=["GetSqlArray",'
		+ '[{"commandText":"select o.orderId, o.sessionId, rtrim(o.orderNumber), o.billToAddressId, '
		+ 'o.grandTotal, o.taxTotal, o.subTotal, o.shippingTotal, o.discount, u.userId, u.accountType, '
		+ 'u.wholeSaleDealer, so.lastFlagId, so.lastFlagStatus, o.purchaseOrder, o.paid, u.handle, '
		+ 'case when p.orderNumber is null then \'\' else rtrim(p.orderNumber) end, '
		+ 'case when p.orderId is null then -1 else p.orderId end, '
		+ 'case when c.orderNumber is null then \'\' else rtrim(c.orderNumber) end, '
		+ 'case when c.orderId is null then -1 else c.orderId end, '
		+ 'case when rb.handle is null then \'\' else rtrim(rb.handle) end, '
		+ 'case when ab.handle is null then \'\' else rtrim(ab.handle) end, '
		+ 'case when sb.handle is null then \'\' else rtrim(sb.handle) end '
		+ 'from orders o with (nolock) '
		+ 'inner join users u with (nolock) on u.userId = o.userId '
		+ 'inner join serial_order so with (nolock) on so.orderId = o.orderId '
		+ 'left join users rb with (nolock) on rb.userId = o.requisitionedBy '
		+ 'left join users ab with (nolock) on ab.userId = approvedBy '
		+ 'left join users sb with (nolock) on sb.userId = soldBy '
		+ 'left join orders p with (nolock) on o.orderId = p.orderId '
		+ 'left join orders c with (nolock) on c.orderId = '
		+ '( select top 1 orderId from '
		+ 'orders with (nolock) where parentOrderId = o.orderId ) '
		+ ' where ' + column + ' = \'' + value + '\';"}]]' +
		'&method2=["GetSqlArray",' +
		'[{"commandText":"select flagTypeId,flagTypeName,lineFlag,shipmentFlag,'
		+ 'orderFlag,purchaseOrderFlag,purchaseShipmentFlag,purchaseLineFlag,'
		+ 'cancelsOrder,closesOrder from flagTypes with (nolock) order by flagTypeName"}]]';
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
            var a = JSON.parse(e.responseText);
            if (a.method1.GetSqlArray.length === 0) {
                instance.confirmOrderErrors(Rendition.Localization['OrderEditor_The_order_you_are_trying_to_lookup_does_not_exist'].Title,
                Rendition.Localization['OrderEditor_Order_does_not_exist'].Title.replace('{0}', args.orderNumber));
                Rendition.UI.removeEvent('close', instance.dialog, instance.closeDialog, false);
                instance.dialog.close();
                return;
            }
            instance.orderId = a.method1.GetSqlArray[0][0];
            instance.orderSessionId = a.method1.GetSqlArray[0][1];
            instance.orderNumber = a.method1.GetSqlArray[0][2];
            instance.billToAddressId = a.method1.GetSqlArray[0][3];
            instance.grandTotal = a.method1.GetSqlArray[0][4];
            instance.originalGrandTotal = a.method1.GetSqlArray[0][4];
            instance.taxTotal = a.method1.GetSqlArray[0][5];
            instance.subTotal = a.method1.GetSqlArray[0][6];
            instance.estShipTotal = a.method1.GetSqlArray[0][7];
            instance.discountTotal = a.method1.GetSqlArray[0][8];
            instance.userId = a.method1.GetSqlArray[0][9];
            instance.accountType = a.method1.GetSqlArray[0][10];
            instance.wholeSaleDealer = a.method1.GetSqlArray[0][11];
            instance.lastFlagId = a.method1.GetSqlArray[0][12];
            instance.lastFlagStatus = a.method1.GetSqlArray[0][13];
            instance.paid = a.method1.GetSqlArray[0][15];
            instance.handle = a.method1.GetSqlArray[0][16];
            instance.parentOrderNumber = a.method1.GetSqlArray[0][17];
            instance.parentOrderId = a.method1.GetSqlArray[0][18];
            instance.childOrderNumber = a.method1.GetSqlArray[0][19];
            instance.childOrderId = a.method1.GetSqlArray[0][20];
            instance.requisitionedByHandle = a.method1.GetSqlArray[0][21];
            instance.approvedByHandle = a.method1.GetSqlArray[0][22];
            instance.soldByHandle = a.method1.GetSqlArray[0][23];
            instance.session = { userId: instance.userId, wholesale: instance.wholeSaleDealer,
                accountType: instance.accountType, handle: instance.handle
            }
            instance.flags = a.method2.GetSqlArray;
            instance.updateClosed();
            /* HACK: for claydesign.com to fix out of sequence numbers.  Another temp fix is in main.cs */
            instance.tracking = Rendition.UI.Grid({
                selectionMethod: 3,
                editMode: 2,
                objectName: 'addressUpdate',
                suffix: ' where shipmentNumber in (select case when cart.orderId > 162706 then cart.orderNumber else cart.shipmentNumber end from cart with (nolock) '
				+ 'where orderId = \'' + instance.orderId + '\')',
                genericEditor: true,
                newRecord: {
                    addressUpdateId: Rendition.UI.createUUID(),
                    shipmentNumber: instance.orderNumber,
                    addDate: Rendition.UI.formatDate(new Date, 'mm/dd/yyyy')
                }
            });
            instance.history = Rendition.UI.Grid({
                selectionMethod: 3,
                editMode: 2,
                objectName: 'flagHistory',
                suffix: ' where orderId = \'' + instance.orderId + '\'',
                genericEditor: true,
                editorParameters: Rendition.Commerce.flagHistoryStruct(),
                editstart: function (e, grid, element, row, column, selection, data, header) {
                    if (row === grid.newRowIndex) {
                        grid.cancelDefault = true;
                        instance.changeStatus('order');
                    }
                    return;
                }
            });
            instance.payments = Rendition.UI.Grid({
                selectionMethod: 3,
                editMode: 0,
                objectName: 'orderPayments',
                suffix: ' where orderId = \'' + instance.orderId + '\'',
                genericEditor: true,
                afterloadcallback: function (e, grid, element, row, column, selection, data, header) {
                    setTimeout(function () {
                        if (instance.dueIn === undefined) {
                            instance.dueIn = ""; /* prevent the procedure from looping */
                            instance.dueIn = grid.getRecord(1, 'dueInDays');
                            if (instance.difference !== undefined) {
                                instance.due = (((instance.grandTotal * 10).toFixed(2) -
								(instance.paid * 10).toFixed(2) + (instance.difference * 10).toFixed(2)) / 10);
                            } else {
                                instance.due = (((instance.grandTotal * 10).toFixed(2) -
								(instance.paid * 10).toFixed(2)) / 10);
                            }
                            if (instance.dueObj && instance.dueIn != null) {

                                if (instance.termId === 13) {
                                    instance.dueObj.innerHTML =
									Rendition.UI.iif(instance.dueIn.length > 0, '<b>' + Rendition.Localization['OrderEditor_Due_In'].Title + instance.dueIn + '<br>', '') +
									'<b>' + Rendition.Localization['OrderEditor_Amount_Paid'].Title + '</b>&nbsp;&nbsp;$' + instance.paid +
									Rendition.UI.iif(instance.grandTotal === instance.paid, Rendition.Localization['OrderEditor_Paid_in_full'].Title, '') + '<br>' +
									Rendition.UI.iif(instance.paid < instance.grandTotal, '<b>' + Rendition.Localization['OrderEditor_Amount_Owed'].Title +
                                    '</b>&nbsp;&nbsp;$' + instance.due.toFixed(2) + '<br>', '');
                                }
                            }
                        }
                    }, 1000)/* wait a second so the instance.due DOM can get attached */
                }
            });
        }, instance, false);
        if (instance.existingOrder) {
            instance.dialog.title(instance.orderNumber);
            instance.newOrder = false;
            instance.orderSuffix = "where orderNumber = '" + instance.orderNumber + "'";
            instance.billToContactSuffix = "where addressId = '" + instance.billToAddressId + "'";
            instance.shipToContactSuffix = "where orderId = " + instance.orderId + " and not addressId = '" + instance.billToAddressId + "'";
            instance.contactTable = 'addresses';
        }
    } else {
        instance.newOrder = true;
        instance.contactTable = 'contacts';
        instance.orderSuffix = instance.billToContactSuffix = instance.shipToContactSuffix = "where 1 = 2";
        if (instance.dialog) {
            instance.dialog.title(Rendition.Localization['OrderEditor_New_Order'].Title);
        }
    }
    instance.itemCutter = Rendition.UI.CutterBar({
        position: 155,
        autoResize: false,
        orientation: 1
    });
    instance.itemCutter.cutters[1].style.overflow = 'scroll';
    instance.initURL =
	'method1=["DataSet", ["orders","' + instance.orderSuffix + '","1","1","",{},[],"JSON",true,"-1",false,\'\',\'\']]' +
	'&method2=["GetSqlArray", [{"commandText":"select rate,shippingType.shippingName from shippingType with (nolock) union all select -1 as rate,\'No Service\' as shippingName order by rate desc;"}]]' +
	'&method3=["DataSet", ["' + instance.contactTable + '","' + instance.billToContactSuffix + '","1","1","",{},[],"JSON",true,"-1",false,\'\',\'\']]' +
	'&method4=["DataSet", ["' + instance.contactTable + '","' + instance.shipToContactSuffix + '","1","1","",{},[],"JSON",true,"-1",false,\'\',\'\']]' +
	'&method5=["GetSqlArray", [{"commandText":"select termId, termName, accrued from terms with (nolock) order by termId;"}]]' +
	'&method6=["GetSqlArray", [{"commandText":"dbo.createSession 0,0,0,\'\',\'\',\'\',\'' + Rendition.Commerce.site.SiteId + '\'"}]]' +
	'&method7=["DataSet", ["paymentMethods","where 1=2","1","1","",{},[],"JSON",true,"-1",false,\'\',\'\']]' +
	'&method8=["GetNextScannedOrderImage", []]';
    instance.init = function () {
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + instance.initURL, function (e) {
            var a = JSON.parse(e.responseText);
            /* warn the user they need to save */
            Rendition.UI.appendEvent('beforeunload', window, instance.close, false);
            instance.orderReadObject = a.method1.DataSet;
            instance.rates = a.method2.GetSqlArray;
            instance.terms = a.method5.GetSqlArray;
            instance.billToReadObject = a.method3.DataSet;
            instance.shipToReadObject = a.method4.DataSet;
            if (a.method7 !== undefined) {
                instance.creditCardReadObject = a.method7.DataSet;
            }
            instance.scannedImages = a.method8.GetNextScannedOrderImage;
            instance.sessionId = a.method6.GetSqlArray[0][0];
            instance.scannedImageExists = instance.scannedImages.length > 0;
            if (instance.existingOrder) {
                instance.scannedImageExists = false;
            }
            instance.refreshTotalsDisplay();
            instance.refreshItemMenuBar();
            if (!instance.existingOrder) {
                /*new orders get new records */
                instance.orderReadObject.data[0] = Rendition.UI.createDefaultRow(instance.orderReadObject.header);
                instance.billToReadObject.data[0] = Rendition.UI.createDefaultRow(instance.billToReadObject.header);
                instance.billToReadObject.data[0][0] = instance.sessionId;
                instance.shipToReadObject.data[0] = Rendition.UI.createDefaultRow(instance.shipToReadObject.header);
                instance.creditCardReadObject.data[0] = Rendition.UI.createDefaultRow(instance.creditCardReadObject.header);
            }
            var btGroups = Rendition.Commerce.addressForm(undefined, Rendition.Localization['OrderEditor_Bill_To_Address'].Title).groups;
            var stGroups = Rendition.Commerce.addressForm(instance.rates, Rendition.Localization['OrderEditor_Ship_To_Address'].Title).groups;
            if (!instance.existingOrder) {
                stGroups[0].inputs.unshift({
                    HTML: instance.copyAddressButton(0)
                });
                btGroups[0].inputs.unshift({
                    HTML: instance.copyAddressButton(1)
                });
            } else {
                var title = "";
                if (instance.session.accountType === 0) {
                    title = Rendition.Localization['OrderEditor_Work_Order_No'].Title + instance.orderNumber + ' - ' + instance.handle + ' (#' + instance.userId + ')';
                } else {
                    title = Rendition.Localization['OrderEditor_Purchase_Order_No'].Title + instance.orderNumber + ' - ' + instance.handle + ' (#' + instance.userId + ')';
                }
                instance.dialog.title(title);
            }
            instance.billToAddressFormStruct = {
                dataSet: instance.billToReadObject,
                groups: btGroups,
                quiet: true
            }
            instance.shipToAddressFormStruct = {
                dataSet: instance.shipToReadObject,
                groups: stGroups,
                quiet: true
            }
            instance.orderFormStruct = {
                dataSet: instance.orderReadObject,
                groups: instance.orderGroups(instance.terms),
                quiet: true,
                titleWidth: '155px'
            }
            instance.billToForm = Rendition.UI.Form(instance.billToAddressFormStruct);
            instance.shipToForm = Rendition.UI.Form(instance.shipToAddressFormStruct);
            instance.orderForm = Rendition.UI.Form(instance.orderFormStruct);
            if (!instance.existingOrder) {
                if (args.userId !== undefined) {
                    if (!isNaN(args.userId)) {
                        var userIdInput = instance.orderForm.getInputByName('userId');
                        userIdInput.value = args.userId;
                    }
                }
            }
            var zip = instance.shipToForm.getInputByName('zip');
            var rate = instance.shipToForm.getInputByName('rate');
            instance.originalRateValue = String(rate.value);
            instance.originalZipValue = String(zip.value);
            Rendition.UI.appendEvent('change', rate, function () {
                instance.refreshMenubar();
                if (!instance.recalculate()) {
                    this.value = instance.originalRateValue;
                }
            }, false);
            Rendition.UI.appendEvent('change', zip, function () {
                instance.refreshMenubar();
                if (!instance.recalculate()) {
                    this.value = instance.originalZipValue;
                }
            }, false);
            instance.itemsGridSuffix = function () {
                return instance.existingOrder ?
				' where sessionId = \'' + instance.orderSessionId + '\' or sessionId = \'' + instance.sessionId + '\''
				: ' where sessionId = \'' + instance.sessionId + '\'';
            }
            instance.itemsGrid = Rendition.UI.Grid({
                selectionMethod: 3,
                editMode: 2,
                editfinish: instance.itemsGridEditFinish,
                editkeydown: instance.itemsGridEditKeyDown,
                aftereditstart: instance.itemsGridAfterEditStart,
                objectName: Rendition.UI.iif(instance.existingOrder, 'order_cart', 'cart'),
                suffix: instance.itemsGridSuffix,
                cellstyle: instance.itemCellStyle,
                rowCountColumn: false,
                hideNewRow: true,
                afterloadcallback: function (e, grid, JSON) {
                    instance.initalLineItemCount = grid.records;
                    Rendition.UI.removeEvent('afterloadcallback', grid, arguments.callee, false);
                },
                contextMenuOptions: Rendition.Commerce.ComContext
            });

            instance.attachments = Rendition.UI.Grid({
                selectionMethod: 3,
                editMode: 3,
                objectName: 'attachments',
                suffix: ' where referenceId = \'' + instance.sessionId + '\' and referenceType = \'sessionId\'',
                genericEditor: true,
                editorParameters: Rendition.Commerce.attachmentFormparams(''),
                newRecord: {
                    referenceId: instance.sessionId,
                    path: '',
                    referenceType: 'sessionId'
                },
                contextMenuOptions: function (e, obj) { return Rendition.UI.DownloadAttachmentContextMenu(e, obj, instance.attachments); }
            });

            Rendition.UI.appendEvent('cellclick', instance.itemsGrid, function (e, grid, element, row, column, selection, data, header) {
                if (grid.getRecord(row, 'itemNumber') != "") {
                    instance.editExistingItem(e, grid, element, row, column, selection, data, header);
                } else {
                    instance.startNewItem(e, grid, element, row, column, selection, data, header);
                    grid.preventDefault();
                }

                return;
            }, instance);

            instance.tabs = [];
            instance.tabs[instance.tabOrder.billTo] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['OrderEditor_Bill_To'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML === '') {
                        content.style.overflow = 'scroll';
                        instance.orderForm.appendTo(content);
                        instance.billToForm.appendTo(content);
                        /* bind keyhandler to all inputs */
                        $(content).find('input').bind('keyup', [], instance.keyHandler);
                        if (!instance.existingOrder) {
                            var userId = instance.orderForm.getInputByName("userId");
                            userId.value = '';
                            var soldBy = instance.orderForm.getInputByName("soldBy");
                            soldBy.value = '';
                            var requisitionedBy = instance.orderForm.getInputByName("requisitionedBy");
                            requisitionedBy.value = '';
                            var approvedBy = instance.orderForm.getInputByName("approvedBy");
                            approvedBy.value = '';
                            userId.focus();
                        }
                        /*when the user leaves the userId field this looks up acount info and price info */
                        instance.lookupUserInfoFromField = function () {
                            var userIdField = instance.orderForm.getInputByName("userId");
                            if (userIdField.value.length > 0) {
                                var url = 'method1=["LogOn",[{"showSessionData":true,"sessionId":"' + instance.sessionId + '","userId":"' + userIdField.value + '"}]]';
                                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                                    var a = JSON.parse(e.responseText);
                                    if (a.method1.error !== undefined) {
                                        instance.dialog.statusBarCenter.innerHTML =
										'<div style="margin:5px 0 0 20px;color:red;font-size:10px;background:yellow;">' +
										Rendition.Localization['OrderEditor_Error_in_logon_procedure'].Title +
										'</div>';
                                    }
                                    if (a.method1.LogOn.error === 0) {
                                        instance.session = a.method1.LogOn.session;
                                        instance.refreshTotalsDisplay();
                                        instance.getUserPriceList(function () {
                                            instance.setTitle();
                                            instance.setFormDefaults();
                                            return;
                                        });

                                    } else {
                                        instance.dialog.statusBarCenter.innerHTML =
										'<div style="margin:5px 0 0 20px;color:red;font-size:10px;background:yellow;">' +
										Rendition.Localization['OrderEditor_Error_initializing_order'].Title +
										'</div>';
                                    }
                                    return true;
                                }, instance);
                            }
                            return true;
                        }
                        Rendition.UI.appendEvent('blur', userId, instance.lookupUserInfoFromField, false);
                    }
                    instance.orderForm.getInputByName("userId").focus();
                }
            });
            instance.tabs[instance.tabOrder.shipTo] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['OrderEditor_Ship_To'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML === '') {
                        content.style.overflow = 'scroll';
                        instance.shipToForm.appendTo(content);
                        $(content).find('input').bind('keyup', [], instance.keyHandler);
                    }
                    instance.shipToForm.getInputByName("firstName").focus();
                }
            });
            instance.tabs[instance.tabOrder.lines] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['OrderEditor_Items'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML === '') {
                        instance.itemCutter.appendTo(content);
                        instance.itemsGrid.appendTo(instance.itemCutter.cutters[0]);
                        if (instance.itemsGrid.records === 0) {
                            instance.startNewItem(null, instance.itemsGrid);
                        } else {
                            instance.cancelNewItem();
                        }
                    } else {
                        instance.itemForm.getInputByName("itemNumber").focus();
                    }
                    instance.itemsGrid.resize(); /*fixes off screen refreshing causing headers to not redraw */
                }
            });
            instance.tabs[instance.tabOrder.attachments] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['OrderEditor_Attachments'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML === '') {
                        instance.attachments.appendTo(content);
                    }
                    instance.controlInput();
                }
            });
            if (instance.existingOrder) {
                instance.tabs[instance.tabOrder.history] = Rendition.UI.TabBarTab({
                    title: Rendition.Localization['OrderEditor_History'].Title,
                    load: function (tab, tabBar, content) {
                        if (content.innerHTML === '') {
                            instance.history.appendTo(content);
                        }
                        instance.controlInput();
                    }
                });
                instance.tabs[instance.tabOrder.payment] = Rendition.UI.TabBarTab({
                    title: Rendition.Localization['OrderEditor_Payment'].Title,
                    load: function (tab, tabBar, content) {
                        if (content.innerHTML === '') {
                            instance.payments.appendTo(content);
                        }
                        instance.controlInput();
                    }
                });
                instance.tabs[instance.tabOrder.tracking] = Rendition.UI.TabBarTab({
                    title: Rendition.Localization['OrderEditor_Tracking'].Title,
                    load: function (tab, tabBar, content) {
                        if (content.innerHTML == '') {
                            instance.tracking.appendTo(content);
                        }
                        instance.controlInput();
                    }
                });
                /* check if there are any more tabs to add */
                for (var x = 0; Rendition.Commerce.orderEditorTabs.length > x; x++) {
                    var arr = Rendition.Commerce.orderEditorTabs[x].apply(instance, [instance, instance.tabs]);
                    if (arr !== undefined) {
                        instance.tabs.push(arr);
                    }
                }
            }
            instance.refreshMenubar();
            instance.tabbar = Rendition.UI.TabBar({
                tabs: instance.tabs,
                parentNode: args.parentNode,
                activeTabIndex: args.activeTab,
                offsetRect: { x: 0, y: instance.menuBar.style.rect.h - 1, h: 0, w: 0 }
            });
            Rendition.UI.wireupCloseEvents(instance.dialogClose, args.parentNode);
            // init events
            for (var x = 0; Rendition.Commerce.orderEditorInitEvents.length > x; x++) {
                Rendition.Commerce.orderEditorInitEvents[x].apply(instance, [instance]);
            }
        }, instance);
    }
    instance.updateCurrentItem = function () {
        if (instance.itemForm.validate()) {
            var inputs = JSON.parse('{' + Rendition.UI.getInputsAsJSON(instance.currentFormDOM) + '}');
            var req = inputs;
            req.sessionId = instance.sessionId;
            req.cartId = instance.currentCartId;
            req.qty = instance.itemForm.getInputByName("qty").value;
            req.price = instance.itemForm.getInputByName("price").value;
            if (instance.currentSerialId == '-1') {
                var url = 'method1=["UpdateCartItem",[' + JSON.stringify(req) + ']]';
                new Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                    instance.recalculate();
                }, instance, false);
            } else {
                /* update form */
                var url = 'method1=["UpdateOrderItem",[' + JSON.stringify(req) + ']]';
                new Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                    instance.recalculate();
                }, instance, false);
            }

        }
        return false;
    }
    instance.cancelNewItem = function () {
        instance.currentCartId = undefined;
        instance.currentItemNumber = undefined;
        instance.startedAddingItem = undefined;
        var c = instance.itemCutter.cutters[1];
        c.innerHTML = '';
        /* if you cancel a new item, then select the only existing item */
        if (instance.existingOrder) {
            instance.itemsGrid.addRowToSelection(1).applySelectionStyle();
            instance.editExistingItem(null, instance.itemsGrid, null, 1, 0, null);
        }
        if (instance.itemsGrid.records == 0) {
            instance.startNewItem(null, instance.itemsGrid);
        }
        instance.refreshItemMenuBar();
    }
    instance.editExistingItem = function (e, grid, element, row, column, selection, data, header) {
        var cid = grid.getRecord(row, 'cartId');
        if (instance.currentCartId == cid) {
            return;
        }
        instance.startedAddingItem = undefined;
        instance.currentCartId = undefined;
        instance.currentItemNumber = undefined;
        instance.currentSerialId = undefined;
        instance.currentShipmentId = undefined;
        var c = instance.itemCutter.cutters[1];
        c.innerHTML = '';
        instance.currentCartId = cid;
        instance.currentItemNumber = grid.getRecord(row, 'itemNumber');
        instance.currentSerialId = grid.getRecord(row, 'serialId');
        instance.currentSerialNumber = grid.getRecord(row, 'serialNumber');
        instance.currentShipmentId = grid.getRecord(row, 'shipmentId');
        instance.orderId = grid.getRecord(row, 'orderId');
        var url = 'method1=["DataSet",["cart","where cartId = \'' + instance.currentCartId + '\'","1","1","",{},[],"JSON",true,"-1",false,\'\',\'\']]' +
				'&method2=["GetSqlArray",[{"commandText":"select CartDetailId, cartId, inputName, value, sessionId\
				from cartDetail where cartId = \'' + instance.currentCartId + '\';"}]]' +
				Rendition.UI.iif(instance.orderId != '-1', '&method3=["GetSqlArray",[{"commandText":"select lastFlagId, lastFlagStatus from serial_line where serialId = \'' + instance.currentSerialId + '\';"}]]', '');
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
            c.innerHTML = '';
            var a = JSON.parse(e.responseText);
            var head = a.method1.DataSet;
            var detail = a.method2.GetSqlArray;
            if (a.method3) {
                instance.item_lastFlagId = a.method3.GetSqlArray[0][0];
                instance.item_lastFlagStatus = a.method3.GetSqlArray[0][1];
            }
            var l = detail.length;
            var d = function (input, inputName) {
                for (var x = 0; l > x; x++) {
                    var n = detail[x][2].trim();
                    if (inputName == n) {
                        input.setAttribute('inputName', String(input.name));
                        //input.name = Rendition.UI.encodeXMLId(detail[x][0]);
                        input.value = detail[x][3];
                        input.setAttribute('cartDetailId', detail[x][0]);
                    }
                }
                return;
            }
            instance.itemFormStruct = {
                dataSet: grid.dataSet,
                groups: instance.itemGroup(undefined, true, instance.item_lastFlagStatus),
                dataSetIndex: row - 1,
                quiet: true
            }
            instance.itemForm = Rendition.UI.Form(instance.itemFormStruct);
            instance.moveItemFormDownABit();
            instance.itemForm.appendTo(c);
            var formVar = {
                itemNumber: instance.currentItemNumber,
                cartId: instance.currentCartId,
                sessionId: instance.sessionId
            }
            Rendition.Commerce.getItemForm(formVar, function (form) {
                instance.currentForm = form;
                var tNode = document.getElementById(instance.formId);
                if (tNode == null) {
                    return;
                }
                instance.currentFormDOM = tNode.parentNode.parentNode;
                instance.currentFormDOM.style.overflow = 'auto';
                instance.currentFormDOM.style.verticalAlign = 'top';
                if (instance.currentFormDOM == null) { return /* form does not exist */ }
                instance.currentFormDOM.parentNode.style.display = 'block';
                instance.currentFormDOM.innerHTML = instance.currentForm.HTML;
                instance.refreshMenubar();
                if (form.inputs != null) {
                    var l = form.inputs.length;
                    for (var x = 0; l > x; x++) {
                        var i = $('#' + instance.formId)
							.find('*[name$=\'' + form.inputs[x].name + '\']')[0];
                        if (i !== undefined) {
                            d(i, form.inputs[x].name);
                        }
                    }
                    $(c).find('input').bind('keyup', [], instance.keyHandler);
                } else {
                    instance.itemForm.getInputByName('qty').focus();
                }
                return;
            });
            instance.refreshItemMenuBar();
            return;
        }, instance);
    }
    instance.moveItemFormDownABit = function () {
        var itemInput = instance.itemForm.getInputByName("itemNumber");
        var n = itemInput.parentNode;
        while (x === undefined) {
            if (n.parentNode.className == 'groupbox') {
                var x = n.parentNode;
            } else {
                n = n.parentNode;
            }
        }
        x.style.marginTop = '35px';
    }
    instance.startNewItem = function (e, grid, element, row, column, selection, data, header) {
        instance.startedAddingItem = true;
        if (instance.existingOrder) {
            var addressId = grid.getRecord(1, 'addressId');
        }
        instance.currentCartId = undefined;
        instance.currentItemNumber = undefined;
        var c = instance.itemCutter.cutters[1];
        c.innerHTML = '';
        instance.abortEditItem = false;
        grid.dataSet.data[grid.records] = Rendition.UI.createDefaultRow(instance.orderReadObject.header);
        instance.itemFormStruct = {
            dataSet: grid.dataSet,
            groups: instance.itemGroup()
        }
        instance.refreshItemMenuBar();
        instance.itemForm = Rendition.UI.Form(instance.itemFormStruct);
        var itemInput = instance.itemForm.getInputByName("itemNumber");
        var price = instance.itemForm.getInputByName("price");
        price.value = 0;
        var qty = instance.itemForm.getInputByName("qty");
        qty.value = 0;
        instance.fillNewItemDetailArea = function (e) {
            var itemInput = instance.itemForm.getInputByName("itemNumber");
            if (itemInput.value.length > 0) {
                itemInput.value = itemInput.value.toUpperCase();
                var url1 = 'method1=["DataSet",["items","where itemNumber = \'' + itemInput.value.toString().s() + '\'","1","1","",{},[],"JSON",true,"-1",false,\'\',\'\']]';
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url1, function (e) {
                    var a = JSON.parse(e.responseText);
                    instance.currentItem = a.method1.DataSet;
                    if (instance.currentItem.data.length == 0) {
                        return; /* item does not exist */
                    }
                    instance.currentFormName = Rendition.UI.getColumnByName(instance.currentItem, 'formName');
                    instance.currentItemPrices = {
                        price: Rendition.UI.getColumnByName(instance.currentItem, 'price'),
                        wholeSalePrice: Rendition.UI.getColumnByName(instance.currentItem, 'wholeSalePrice'),
                        salePrice: Rendition.UI.getColumnByName(instance.currentItem, 'salePrice'),
                        isOnSale: Rendition.UI.getColumnByName(instance.currentItem, 'isOnSale')
                    }
                    price.value = instance.getCurrentItemPrice();
                    qty.value = 1;
                    Rendition.Commerce.getItemForm({ formName: instance.currentFormName, itemNumber: Rendition.UI.getColumnByName(instance.currentItem, 'itemNumber') }, function (form) {
                        instance.currentForm = form;
                        instance.currentFormDOM = document.getElementById(instance.formId);
                        instance.currentFormDOM.parentNode.style.display = 'block';
                        instance.currentFormDOM.innerHTML = instance.currentForm.HTML;
                        instance.refreshMenubar();
                        instance.refreshItemMenuBar();
                        if (form.inputs != null) {
                            var i = $(instance.currentFormDOM).find('input')[0];
                            if (i) {
                                i.focus();
                            }
                            $(c).find('input').bind('keyup', [], instance.keyHandler);
                        } else {
                            qty.focus();
                        }
                        return;
                    });
                    return;
                }, instance);
            }
            return;
        }
        Rendition.UI.appendEvent('blur', itemInput, instance.fillNewItemDetailArea, false);
        var info = document.createElement('div');
        info.className = 'ui-corner-all info';
        info.innerHTML = Rendition.Localization['OrderEditor_New_Item'].Title;
        info.style.marginTop = '30px';
        c.appendChild(info);
        instance.itemForm.appendTo(c);
        $(c).find('input').bind('keyup', [], instance.keyHandler);
        itemInput.value = '';
        itemInput.focus();
    }
    instance.refresh = function (checkForSaveState) {
        if (checkForSaveState == false || checkForSaveState === undefined) {
            Rendition.UI.wireupCloseEvents(instance.dialogClose, args.parentNode, true);
        }
        instance.closeDialog(null, null, function () {
            Rendition.Commerce.OrderEditor({ orderNumber: instance.orderNumber });
        });
        return instance;
    }
    instance.setTitle = function () {
        var subTitle = instance.session.User.Handle + ' (#' + instance.orderForm.getInputByName("userId").value + ')';
        instance.accountType = instance.session.User.AccountType;
        if (instance.accountType == 0) {
            instance.dialog.title(Rendition.Localization['OrderEditor_New_Work_Order_Title'].Title + subTitle);
        } else if (instance.accountType == 1) {
            instance.dialog.title(Rendition.Localization['OrderEditor_New_Purchase_Order_Title'].Title + subTitle);
        } else {
            instance.dialog.title(Rendition.Localization['OrderEditor_New_Credit_Memo_Title'].Title + subTitle);
        }
        return instance;
    }
    instance.getUserPriceList = function (callbackProcedure) {
        var url = 'method1=["GetSqlArray",[{"commandText":"select itemNumber, price\
								from userPriceList where userId = \'' + instance.session.UserId.toString().s() + '\' and getDate() between fromDate and toDate;"}]]';
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
            var a = JSON.parse(e.responseText);
            instance.userPriceList = a.method1.GetSqlArray;
            if (callbackProcedure) {
                callbackProcedure.apply(instance, [a, instance]);
            }
            return true;
        }, instance);
    }
    instance.setFormDefaults = function () {
        var termId = instance.orderForm.getInputByName("termId");
        var b = function (name) {
            return instance.billToForm.getInputByName(name);
        }
        var s = function (name) {
            return instance.shipToForm.getInputByName(name);
        }
        var o = function (name) {
            return instance.orderForm.getInputByName(name);
        }
        var u = instance.session.User;
        /* set form defaults using this section only */
        if (u.AutoFillOrderForm == true || instance.accountType == 1) {
            if (instance.accountType == 1) {
                u = Rendition.Commerce.site;
            }
            var date = new Date();
            var lDate = new Date(date.setDate(date.getDate() + (u.EstLeadTime || instance.session.User.EstLeadTime)));
            if (String(b("firstName").value).trim() != '') { return } /* if somthing is in the form do not replace the data */
            b("firstName").value = u.FirstName || '';
            b("lastName").value = u.LastName || '';
            b("address1").value = u.Address1;
            b("address2").value = u.Address2;
            b("city").value = u.City;
            b("state").value = u.State;
            b("zip").value = u.Zip;
            b("country").value = u.Country;
            b("homePhone").value = u.HomePhone || u.Phone || '';
            b("workPhone").value = u.WorkPhone || '';
            b("emailAds").value = u.WouldLikeEmail;
            s("emailAds").value = u.WouldLikeEmail;
            s("rate").value = u.RateId;
            s("sendShipmentUpdates").checked = u.SendShipmentUpdates;
            s("sendShipmentUpdates").checked = u.SendShipmentUpdates;
            b("sendShipmentUpdates").checked = u.SendShipmentUpdates;
            o("deliverBy").value = Rendition.UI.formatDate(lDate, 'mm/dd/yyyy');
            o("FOB").value = u.FOB || '';
            b("email").value = u.CompanyEmail || u.Email;
            b("company").value = u.Handle || u.Name;
            termId.value = u.TermId || instance.session.User.TermId;
        }
        return;
    }
    instance.changeStatus = function (callerType) {
        var i = document.createElement('select');
        var buttonOk = document.createElement('button');
        var buttonCancel = document.createElement('button');
        var rteBox = document.createElement('div');
        rteBox.style.height = '175px';
        buttonOk.innerHTML = 'Ok';
        buttonOk.style.margin = '4px';
        buttonOk.style.cssFloat = 'right';
        buttonCancel.innerHTML = 'Cancel';
        buttonCancel.style.margin = '4px';
        buttonCancel.style.cssFloat = 'right';
        var l = instance.flags.length;
        var msg = '';
        if (instance.closed) {
            var d = function () {
                return [[0, Rendition.Localization['OrderEditor_Comment'].Title]]
            }
        } else {
            var d = function (f, g, h) {
                var options = [];
                for (var x = 0; l > x; x++) {
                    if (instance.flags[x][f] || instance.flags[x][g] || instance.flags[x][h]) {
                        options.push([instance.flags[x][0], instance.flags[x][1]]);
                    }
                }
                return options;
            }
        }
        if (instance.accountType != 1) {
            if (callerType == 'line') {
                Rendition.UI.fillSelect(i, d(2), 0, 1);
                msg = Rendition.Localization['OrderEditor__this_item'].Title;
                objectId = instance.currentSerialId;
            } else if (callerType == 'shipment') {
                Rendition.UI.fillSelect(i, d(2, 3), 0, 1);
                msg = Rendition.Localization['OrderEditor__this_shipment'].Title;
                objectId = instance.currentShipmentId;
            } else if (callerType == 'order') {
                Rendition.UI.fillSelect(i, d(2, 3, 4), 0, 1);
                msg = Rendition.Localization['OrderEditor__this_order'].Title;
                objectId = instance.orderId;
            } else {
                return;
            }
        } else {
            if (callerType == 'line') {
                Rendition.UI.fillSelect(i, d(5), 0, 1);
                msg = Rendition.Localization['OrderEditor__this_item'].Title;
                objectId = instance.currentSerialId;
            } else if (callerType == 'shipment') {
                Rendition.UI.fillSelect(i, d(5, 6), 0, 1);
                msg = Rendition.Localization['OrderEditor__this_shipment'].Title;
                objectId = instance.currentShipmentId;
            } else if (callerType == 'order') {
                Rendition.UI.fillSelect(i, d(5, 6, 7), 0, 1);
                msg = Rendition.Localization['OrderEditor__this_order'].Title;
                objectId = instance.orderId;
            } else {
                return;
            }
        }
        instance.changeStatusDialog = Rendition.UI.dialogWindow({
            rect: { x: (document.documentElement.clientWidth / 2) - (520 / 2),
                y: 30, h: 372, w: 520
            },
            title: Rendition.Localization['OrderEditor_Change_Status'].Title,
            modal: true
        });
        var c = instance.changeStatusDialog.content;
        var g = Rendition.UI.GroupBox({
            title: Rendition.Localization['OrderEditor_Change_Status_of'].Title + msg,
            childNodes: [Rendition.UI.txt('New Status'), i],
            alwaysExpanded: true
        });
        var h = Rendition.UI.GroupBox({
            title: Rendition.Localization['OrderEditor_Comments'].Title,
            childNodes: [rteBox],
            alwaysExpanded: true
        });
        g.appendTo(c);
        h.appendTo(c);
        c.appendChild(buttonOk);
        c.appendChild(buttonCancel);
        var rte = Rendition.UI.RichTextEditor({
            parentNode: rteBox
        });
        rte.resize();
        buttonCancel.onclick = function () {
            instance.changeStatusDialog.close();
            return;
        }
        buttonOk.onclick = function () {
            this.disabled = true;
            var comments = rte.value();
            //AddFlag(int flagType, string objectType,string objectId, string comments)
            var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify([
				"AddFlag",
				[
					String(i.value),
					String(callerType),
					String(objectId),
					String(comments)
				]
			]).toURI();
            instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                var a = JSON.parse(e.responseText);
                if (a.method1.error !== undefined) {
                    instance.dialog.statusBarCenter.innerHTML =
					instance.confirmOrderErrors('<div style="margin:5px 0 0 20px;color:red;font-size:10px;background:yellow;">' +
					Rendition.Localization['OrderEditor_Unknown_error_occured'].Title +
					'</div>', Rendition.Localization['OrderEditor_Error_adding_flag'].Title);
                    instance.changeStatusDialog.close();
                    return;
                }
                if (a.method1.AddFlag.error == 0) {
                    var info = Rendition.UI.Info({
                        timeout: 5000,
                        position: { x: 30, y: 30 },
                        title: Rendition.Localization['OrderEditor_Flag_added'].Title,
                        message: ''
                    });
                    instance.lastFlagId = a.method1.AddFlag.flagId;
                    instance.lastFlagStatus = a.method1.AddFlag.flagType;
                    instance.updateClosed();
                    if (callerType == 'order') {
                        document.getElementById('status_' + instance.orderId).innerHTML = instance.getFlagByFlagTypeId(instance.lastFlagStatus);
                    }
                } else {
                    instance.confirmOrderErrors(a.method1.AddFlag.description);
                }
                instance.refresh();
                instance.changeStatusDialog.close();
            }, instance, false);
            return;
        }
    }
    instance.getCurrentItemPrice = function () {
        var p = instance.currentItemPrices;
        var price = Rendition.UI.iif(p.isOnSale, p.salePrice, p.price);
        if (instance.session !== undefined) {
            if (instance.session.Wholesale == 1) {
                price = p.wholeSalePrice;
            }
        }
        if (instance.userPriceList !== undefined) {
            var l = instance.userPriceList.length;
            var itemNumber = String(Rendition.UI.getColumnByName(instance.currentItem, 'itemNumber'));
            for (var x = 0; l > x; x++) {
                if (String(itemNumber).toLowerCase().trim() == String(instance.userPriceList[x][0]).toLowerCase().trim()) {
                    price = instance.userPriceList[x][1];
                }
            }
        }
        return price;
    }
    instance.removeCurrentItem = function () {
        var url = 'method1=["DeleteCartItem",[{"cartId":"' + instance.currentCartId + '"}]]';
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
            var a = JSON.parse(e.responseText);
            if (a.method1.DeleteCartItem.error == 0) {
                instance.recalculate(function () {
                    instance.startNewItem(null, instance.itemsGrid);
                });
            } else {
                alert(a.method1.DeleteCartItem.error + ':' + a.method1.DeleteCartItem.description);
            }
        }, instance);
    }
    instance.isDirty = function () {
        if
		(
			(
				(
					instance.initalLineItemCount != instance.itemsGrid.records
					|| instance.shipToForm.dirty()
					|| instance.billToForm.dirty()
				)
				&&
				instance.initalLineItemCount !== undefined
			)
			||
			instance.newOrder
		) {
            return true;
        } else {
            return false;
        }
    }
    instance.close = function () {
        if (instance.isDirty()) {
            return Rendition.Localization['OrderEditor_Are_you_sure_you_want_exit'].Title;
        } else {
            return;
        }
    }
    instance.refreshItemMenuBar = function () {
        var itemMenuOptions = [];
        var barButtons = [];
        var c = instance.itemCutter.cutters[1];
        if (!instance.startedAddingItem) {
            if (!instance.closed) {
                barButtons.push({
                    text: Rendition.Localization['OrderEditor_Add_New_Item'].Title,
                    click: function (e) {
                        instance.startNewItem(null, instance.itemsGrid);
                        return false;
                    }
                });
            }
        } else {
            if (instance.currentItem !== undefined) {
                barButtons.push({
                    text: Rendition.Localization['OrderEditor_Save_New_Item'].Title,
                    click: function (e) {
                        instance.addCurrentItem();
                        return false;
                    }
                });
            }
            if (instance.currentCartId === undefined && instance.itemsGrid.records > 0) {
                barButtons.push({
                    text: Rendition.Localization['OrderEditor_Cancel_New_Item'].Title,
                    click: function (e) {
                        instance.cancelNewItem();
                        return false;
                    }
                });
            }
        }
        if (!instance.closed) {
            itemMenuOptions.push({
                text: Rendition.Localization['OrderEditor_Update_Item'].Title,
                click: function (e) {
                    instance.updateCurrentItem();
                    return false;
                }
            });
            if (instance.currentSerialId == '-1') {
                itemMenuOptions.push({
                    text: Rendition.Localization['OrderEditor_Remove_Item'].Title,
                    click: function (e) {
                        instance.removeCurrentItem();
                        return false;
                    }
                });
            } else {
                itemMenuOptions.push({
                    text: Rendition.Localization['OrderEditor_Backorder_Item'].Title,
                    click: function (e) {
                        instance.removeCurrentItem();
                        return false;
                    }
                });
                itemMenuOptions.push({
                    text: Rendition.Localization['OrderEditor_Cancel_Item'].Title,
                    click: function (e) {
                        instance.removeCurrentItem();
                        return false;
                    }
                });
            }
        }
        if (instance.currentSerialId != '-1') {
            itemMenuOptions.push({
                text: Rendition.Localization['OrderEditor_Change_Status'].Title,
                click: function (e) {
                    instance.changeStatus('line');
                    return false;
                }
            });
            itemMenuOptions.push({
                text: Rendition.Localization['OrderEditor_View_History'].Title,
                click: function (e) {
                    new instance.showLineHistory();
                    return false;
                }
            });
        }
        if (!instance.startedAddingItem && (instance.currentCartId !== undefined)) {
            barButtons.push({
                text: Rendition.Localization['OrderEditor_Item'].Title,
                childNodes: itemMenuOptions
            });
        }
        /* check if there are any more menus to add */
        for (var x = 0; Rendition.Commerce.orderEditorItemMenus.length > x; x++) {
            var arr = Rendition.Commerce.orderEditorItemMenus[x].apply(instance, [instance, instance.barButtons]);
            if (arr !== undefined) {
                instance.barButtons.push(arr);
            }
        }
        Rendition.UI.menu(barButtons, instance.itemCutter.cutters[1], 'menuBar');
    }
    instance.refreshMenubar = function () {
        var barButtons = [];
        var printMenuOptions = [];
        if (instance.existingOrder) {
            printMenuOptions.push({
                text: Rendition.Localization['OrderEditor_Invoice'].Title,
                click: function (e) {
                    var req = [
						'PrintOrder',
						[
							{
							    orderNumber: instance.orderNumber,
							    type: 'invoice'
							}
						]
					]
                    Rendition.UI.IFrameDialog({
                        title: Rendition.Localization['OrderEditor_Order_Print'].Title + instance.orderNumber,
                        src: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req)
                    });
                    return false;
                }
            });
            printMenuOptions.push({
                text: Rendition.Localization['OrderEditor_Packing_Slip'].Title,
                click: function (e) {
                    var req = [
						'PrintOrder',
						[
							{
							    orderNumber: instance.orderNumber,
							    type: 'packingSlip'
							}
						]
					]
                    Rendition.UI.IFrameDialog({
                        title: Rendition.Localization['OrderEditor_Order_Print'].Title + instance.orderNumber,
                        src: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req)
                    });
                    return false;
                }
            });
        } else {
            printMenuOptions.push({
                text: Rendition.Localization['OrderEditor_Quote'].Title,
                click: function (e) {
                    var req = [
						'PrintOrder',
						[
							{
							    quoteNumber: instance.sessionId,
							    type: 'quote'
							}
						]
					]
                    Rendition.UI.IFrameDialog({
                        title: Rendition.Localization['OrderEditor_Quote_Print'].Title + instance.orderNumber,
                        src: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req)
                    });
                    return false;
                }
            });
        }
        printMenuOptions.push({
            text: Rendition.Localization['OrderEditor_Custom_Form_Print'].Title,
            click: function (e) {
                instance.newImageFileManager = Rendition.UI.FileManager({
                    selectFile: true,
                    selectCallback: function (selectedFilePath, fileMan) {
                        var req = [
							'Print',
							[
								selectedFilePath, { orderNumber: instance.orderNumber, sessionId: instance.sessionId, shipmentNumber: instance.itemsGrid.getRecord(1, 'shipmentNumber') }
							]
						]
                        Rendition.UI.IFrameDialog({ src: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req) });
                        return;
                    }
                });
                return false;
            }
        });
        if (instance.newOrder) {
            barButtons.push({
                text: Rendition.Localization['OrderEditor_Place_Order'].Title,
                click: function (e) {
                    instance.placeOrder();
                    return false;
                }
            });
            if (instance.scannedImageExists && !instance.currentScannedImage) {
                barButtons.push({
                    text: Rendition.Localization['OrderEditor_Get_Scanned_Order_Image'].Title,
                    click: function (e) {
                        instance.getScannedImage();
                        return false;
                    }
                });
            } else if (instance.currentScannedImage) {
                barButtons.push({
                    text: Rendition.Localization['OrderEditor_Return_Scanned_Image'].Title,
                    click: function (e) {
                        instance.returnScannedImage();
                        return false;
                    }
                });
            }
        } else {
            barButtons.push({
                text: Rendition.Localization['OrderEditor_MenuBar_Order'].Title,
                childNodes: [
					{
					    text: Rendition.Localization['OrderEditor_MenuBar_Change_Order_Status'].Title,
					    click: function (e) {
					        instance.changeStatus('order');
					        return false;
					    }
					},
					{
					    text: Rendition.Localization['OrderEditor_MenuBar_New_Order'].Title,
					    click: function (e) {
					        new Rendition.Commerce.OrderEditor();
					        return false;
					    }
					},
					{
					    text: Rendition.Localization['OrderEditor_MenuBar_Refresh_Order'].Title,
					    click: function (e) {
					        instance.refresh();
					        return false;
					    }
					}
				]
            });
            barButtons.push({
                text: Rendition.Localization['OrderEditor_MenuBar_Previous_Order'].Title,
                click: function (e) {
                    instance.previousOrder();
                    return false;
                }
            });
            barButtons.push({
                text: Rendition.Localization['OrderEditor_MenuBar_Next_Order'].Title,
                click: function (e) {
                    instance.nextOrder();
                    return false;
                }
            });
            if (instance.orderForm.getInputByName("scanned_order_image").value.length > 0) {
                barButtons[0].childNodes.push({
                    text: Rendition.Localization['OrderEditor_MenuBar_View_Scanned_Image'].Title,
                    click: function () {
                        instance.imageViewer = Rendition.UI.ImageViewer({ src: '../scan/' + instance.orderNumber + '.jpg' });
                        return false;
                    }
                });
            }
            if (!instance.closed) {
                barButtons.push({
                    text: Rendition.Localization['OrderEditor_MenuBar_Save'].Title,
                    click: function (e) {
                        /* do it for real this time */
                        instance.previewRecalculation = false;
                        instance.recalculate();
                        return false;
                    }
                });
            }
            barButtons.push({
                text: Rendition.Localization['OrderEditor_MenuBar_Print'].Title,
                childNodes: printMenuOptions
            });
            barButtons.push({
                text: Rendition.Localization['OrderEditor_MenuBar_Pay'].Title,
                click: function (e) {
                    instance.makePayment();
                    return false;
                }
            });
        }
        /* check if there are any more menus to add */
        for (var x = 0; Rendition.Commerce.orderEditorMenus.length > x; x++) {
            var arr = Rendition.Commerce.orderEditorMenus[x].apply(instance, [instance, instance.tabs]);
            if (arr !== undefined) {
                instance.barButtons.push(arr);
            }
        }
        instance.menuBar = Rendition.UI.menu(barButtons, args.parentNode, 'menuBar');
        return instance;
    }
    instance.getItemInput = function (inputName) {
        return instance.itemForm.getInputByName(inputName);
    }
    instance.addCurrentItem = function () {
        if (instance.addingItem === undefined) {
            instance.addingItem = true;
            /* validate this shit */
            var formInputs = JSON.parse('{' + Rendition.UI.getInputsAsJSON(instance.currentFormDOM) + '}');
            formInputs.itemNumber = instance.getItemInput('itemNumber').value;
            formInputs.qty = instance.getItemInput('qty').value;
            formInputs.price = instance.getItemInput('price').value;
            formInputs.sessionId = instance.sessionId;
            formInputs.addressId = instance.itemsGrid.getRecord(1, 'addressId');
            if (!instance.existingOrder) {
                formInputs.orderId = instance.orderId;
            }
            var url = 'method1=["AddToCart",[' + JSON.stringify(formInputs).toURI() + ']]';
            instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                var a = JSON.parse(e.responseText);
                instance.lastItem = a.method1.AddToCart;
                if (a.method1.error !== undefined) {
                    instance.addingItem = undefined;
                    alert(a.method1.description);
                    return;
                }
                if (a.method1.AddToCart.error != 0) {
                    instance.addingItem = undefined;
                    alert(a.method1.AddToCart.description);
                    return;
                }
                if (!instance.existingOrder) {
                    instance.shipToForm.getInputByName('contactId').value = instance.lastItem.addressId;
                    if (instance.shipToForm.validate()) {
                        instance.shipToForm.save(true, 1, undefined, false);
                    }
                }
                instance.previewRecalculation = true;
                instance.recalculate(function (a) {
                    instance.abortEditItem = true; /* allows starting new item*/
                    instance.currentItem = undefined;
                    instance.itemMenuBar = undefined;
                    instance.addingItem = undefined;
                    instance.startedAddingItem = undefined;
                    instance.currentSerialNumber = undefined;
                    instance.item_lastFlagStatus;
                    instance.refreshMenubar();
                    instance.startNewItem(null, instance.itemsGrid);
                });
            }, instance);
        }
        return instance;
    }
    instance.refreshTotalsDisplay = function () {
        var c = instance.dialog.statusBarCenter;
        c.innerHTML =
		' <div class="orderFormTotalStatus"><b>' + Rendition.Localization['OrderEditor_Sub'].Title + '</b>$' + instance.subTotal.toFixed(2) +
		' &nbsp;&nbsp;<b>' + Rendition.Localization['OrderEditor_Tax'].Title + '</b>$' + instance.taxTotal.toFixed(2) +
		' &nbsp;&nbsp;<b>' + Rendition.Localization['OrderEditor_Shipping'].Title + '</b>$' + instance.estShipTotal.toFixed(2) +
		' &nbsp;&nbsp;<b>' + Rendition.Localization['OrderEditor_Discount'].Title + '</b>$' + instance.discountTotal.toFixed(2) +
		' &nbsp;&nbsp;<b>' + Rendition.Localization['OrderEditor_Total'].Title + '</b>$' + instance.grandTotal.toFixed(2) + '</div>';
        return;
    }
    instance.copyAddress = function (buttonId) {
        var b = function (name) { return instance.billToForm.getInputByName(name); }
        var a = function (name) { return instance.shipToForm.getInputByName(name); }
        var updateList = ['firstName', 'lastName', 'address1',
		'address2', 'city', 'state', 'zip', 'country', 'homePhone', 'workPhone'];
        var l = updateList.length;
        for (var x = 0; l > x; x++) {
            a(updateList[x]).value = b(updateList[x]).value;
        }
        instance.recalculate();
        return instance;
    }
    instance.recalculate = function (callbackProcedure) {
        var formValid = true;
        if (instance.closed) {
            instance.confirmOrderErrors(Rendition.Localization['OrderEditor_This_order_is_closed_and_cannot_be_recalculated'].Title,
			Rendition.Localization['OrderEditor_This_order_is_closed_and_cannot_be_recalculated'].Message);
            return false;
        }
        if (instance.billToForm.validate()) {
            instance.billToForm.save(true, 1, undefined, false);
        } else {
            formValid = false;
        }
        if (instance.shipToForm.validate()) {
            instance.shipToForm.save(true, 1, undefined, false);
        } else {
            formValid = false;
        }
        if (!formValid) {
        }
        /* update PO, manifest, deliver by, fob, comments */
        var url = "";
        if (instance.difference !== undefined && instance.differencePaid === undefined) {
            /* there is a difference between the old price and the new price, if this is NOT an accrued order, demand payment */
            if (instance.termId == 0 || instance.termId == 9 || instance.termId == 20 || instance.termId == 13) {
                instance.makePayment(function () {
                    instance.recalculate(callbackProcedure);
                });
                return;
            }
        }
        if (!instance.existingOrder) {
            url += 'method1=["Recalculate",[{sessionId:"' + instance.sessionId + '"}]]';
        } else {
            url += Rendition.UI.responderKeyName + '1=' + JSON.stringify([
				"RecalculateOrder",
				[
					{
					    userId: instance.userId,
					    orderSessionId: instance.orderSessionId,
					    cartSessionId: instance.sessionId,
					    cardType: '', cardNumber: '', expMonth: '', expYear: '', secNumber: '', nameOnCard: '',
					    billToAddressId: instance.billToForm.getValueByName('addressId'),
					    shipToAddressId: instance.shipToForm.getValueByName('addressId'),
					    preview: instance.previewRecalculation,
					    purchaseOrder: instance.orderForm.getValueByName("purchaseOrder")
					}
				]
			]) +
			Rendition.UI.iif(!instance.previewRecalculation,
			'&method2=["GetSqlArray",[{"commandText":"dbo.createSession 0,0,0,\'\',\'\',\'\',\'' + Rendition.Commerce.site.SiteId + '\'"}]]', '');
            url += "&method3=[\"SqlCommand\",[\"update orders set "
            + "purchaseOrder = '" + instance.orderForm.getInputByName("purchaseOrder").value.s()
            + "', manifest = '" + instance.orderForm.getInputByName("manifest").value.s()
            + "', deliverBy = '" + instance.orderForm.getInputByName("deliverBy").value.s()
            + "', fob = '" + instance.orderForm.getInputByName("FOB").value.s()
            + "', comment = '" + instance.orderForm.getInputByName("comment").value.s()
            + "' where orderNumber = '" + instance.orderNumber + "'\"]]";
        }
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
            var a = JSON.parse(e.responseText);
            if (a.method1.error !== undefined) {
                instance.confirmOrderErrors(Rendition.Localization['OrderEditor_This_order_cannot_be_recalculated'].Title,
				Rendition.Localization['OrderEditor_Error'].Title + a.method1.error + ':' + a.method1.description);
                return;
            }
            if (a.method1.RecalculateOrder) {
                if (a.method1.RecalculateOrder.error != 0
				&& a.method1.RecalculateOrder.error != 5/*supress 'test order' errors*/) {
                    instance.confirmOrderErrors(Rendition.Localization['OrderEditor_This_order_cannot_be_recalculated'].Title,
					a.method1.RecalculateOrder.description);
                    return;
                }
            }
            if (a.method2 !== undefined) {
                instance.sessionId = a.method2.GetSqlArray[0][0];
            }
            if (!instance.existingOrder) {
                var totals = a.method1.Recalculate;
                instance.cart = a.method1.Recalculate.cart;
                instance.discountTotal = totals.discountTotal;
                instance.estShipTotal = totals.estShipTotal;
                instance.grandTotal = totals.grandTotal;
                instance.subTotal = totals.subTotal;
                instance.taxTotal = totals.taxTotal;
            } else if (a.method1.RecalculateOrder) {
                var totals = a.method1.RecalculateOrder;
                instance.discountTotal = totals.discountTotal;
                instance.estShipTotal = totals.estShipTotal;
                instance.grandTotal = totals.grandTotal;
                instance.subTotal = totals.subTotal;
                instance.taxTotal = totals.taxTotal;
                instance.oldDiscountTotal = totals.oldDiscountTotal;
                instance.oldEstShipTotal = totals.oldEstShipTotal;
                instance.oldGrandTotal = totals.oldGrandTotal;
                instance.oldSubTotal = totals.oldSubTotal;
                instance.oldTaxTotal = totals.oldTaxTotal;
                instance.difference = totals.difference;
                if (!instance.previewRecalculation) {
                    instance.orderSessionId = totals.sessionId;
                }
            }
            /* set recalculation method back to preview mode */
            instance.previewRecalculation = true;
            instance.refreshTotalsDisplay();
            setTimeout(function () {
                /* do all menu refreshing AFTER the itemsGrid comes back
                becuase some of the menus use the itemsGrid */
                instance.itemsGrid.refresh(function () {
                    if (callbackProcedure) {
                        return callbackProcedure.apply(instance, [a]);
                        if (instance.existingOrder) {
                            instance.payments.refresh();
                        }
                    }
                });
            }, 1000); /* wait a whole second for any transactions in recalcuate to finish */
            instance.cancelNewItem();
            return;
        }, instance);
        return instance;
    }
    instance.copyAddressButton = function (buttonId) {
        var bTxt = buttonId == 0 ? Rendition.Localization['OrderEditor_Same_as_Bill_To'].Title + ' (F9)' : Rendition.Localization['OrderEditor_Copy_to_Ship_To'].Title + ' (F9)';
        var v = document.createElement('button');
        v.innerHTML = bTxt;
        v.onclick = function () {
            instance.copyAddress(buttonId);
            return;
        }
        return v;
    }
    instance.validation = function () {
        var allFormsValid = true;
        var invalidGroups = [];
        var vMessage = [];
        var addGroup = function (item, a, b, c, d) {
            invalidGroups.push(item);
            return;
        }
        var addValidation = function (formName) {
            for (var x = 0; invalidGroups.length > x; x++) {
                var t = invalidGroups[x];
                vMessage.push(formName + ' ' + t.input.getAttribute('displayName') + Rendition.Localization['OrderEditor_field_is_invalid'].Title);
                allFormsValid = false;
            }
            invalidGroups = [];
        }
        instance.billToForm.getInvalidInputs().forEach(addGroup);
        addValidation(Rendition.Localization['OrderEditor_ValidationPrefix_Bill_To'].Title);
        instance.shipToForm.getInvalidInputs().forEach(addGroup);
        addValidation(Rendition.Localization['OrderEditor_ValidationPrefix_Ship_To'].Title);
        instance.orderForm.getInvalidInputs().forEach(addGroup);
        addValidation(Rendition.Localization['OrderEditor_ValidationPrefix_Order'].Title);
        return { valid: allFormsValid, message: vMessage, groups: invalidGroups }
    }
    instance.getCreditCardData = function (callbackProcedure) {
        instance.creditCardDialog = Rendition.UI.dialogWindow({
            rect: { x: (document.documentElement.clientWidth / 2) - (345 / 2),
                y: 30, h: 240, w: 345
            },
            title: Rendition.Localization['OrderEditor_Enter_Credit_Card_Info'].Title,
            modal: true,
            modalCloseable: true
        });
        var ccg = [{
            name: Rendition.Localization['OrderEditor_Credit_Card_Info'].Title,
            expanded: true,
            inputs: [
                {
                    name: 'cardName',
                    displayName: Rendition.Localization['OrderEditor_Name_On_Card'].Title,
                    autoComplete: {
                        mustMatchPattern: /.+/,
                        patternMismatchMessage: Rendition.Localization['OrderEditor_This_field_cannot_be_blank'].Title
                    }
                },
                {
                    name: 'cardNumber',
                    displayName: Rendition.Localization['OrderEditor_Card_Number'].Title,
                    autoComplete: {
                        mustMatchPattern: /.+/,
                        patternMismatchMessage: Rendition.Localization['OrderEditor_This_field_cannot_be_blank'].Title
                    }
                },
                {
                    name: 'expMonth',
                    displayName: Rendition.Localization['OrderEditor_Exp_Month'].Title,
                    width: '75px',
                    numericupdown: {
                        max: 12,
                        min: 1
                    }
                },
                {
                    name: 'expYear',
                    displayName: Rendition.Localization['OrderEditor_Exp_Year'].Title,
                    width: '75px',
                    numericupdown: {
                        max: 3000,
                        min: 2011
                    }
                },
                {
                    name: 'secNumber',
                    displayName: Rendition.Localization['OrderEditor_Sec_Number'].Title,
                    autoComplete: {
                        mustMatchPattern: /.+/,
                        patternMismatchMessage: Rendition.Localization['OrderEditor_This_field_cannot_be_blank'].Title
                    }
                },
            ]
        }];
        instance.paymentForm = Rendition.UI.Form({
            name: 'OrderPaymentForm',
            parentNode: instance.creditCardDialog.content,
            groups: ccg
        });
        var saveCCData = document.createElement('button');
        saveCCData.style.margin = '4px';
        saveCCData.style.cssFloat = 'right';
        saveCCData.innerHTML = Rendition.Localization['OrderEditor_Submit'].Title;
        saveCCData.onclick = function () {
            if (instance.paymentForm.isValid()) {
                instance.gotCreditCardData = true;
                callbackProcedure.apply(instance, []);
                instance.creditCardDialog.close();
            } else {
                alert(Rendition.Localization['OrderEditor_Fill_out_all_of_the_fields'].Title);
            }
        }
        instance.creditCardDialog.content.appendChild(saveCCData);
    }
    instance.placeOrder = function (callbackProcedure) {
        if (instance.itemsGrid.records == 0) {
            instance.confirmOrderErrors(Rendition.Localization['OrderEditor_This_order_cannot_be_placed'].Title,
					Rendition.Localization['OrderEditor_You_must_have_at_least_one_item_in_your_order_to_place_an_order'].Title);
            return;
        }
        var k = instance.validation();
        instance.termId = parseInt(instance.orderForm.getInputByName('termId').value);
        var accrued = false;
        for (var x = 0; instance.terms.length > x; x++) {
            if (instance.terms[x][0] == instance.termId) {
                if (instance.terms[x][2] === true) {
                    accrued = true;
                }
            }
        }
        if (instance.termId === 0) {
            if (!instance.gotCreditCardData) {
                instance.getCreditCardData(function () {
                    instance.placeOrder(callbackProcedure);
                });
                return;
            }
        }
        if (k.valid) {
            var b = instance.billToForm.crudStruct();
            var s = instance.shipToForm.crudStruct();
            var o = instance.orderForm.crudStruct();
            var u = instance.session.User;
            if (instance.paymentForm) {
                var c = instance.paymentForm.crudStruct();
            }
            var pf = function (inputName) {
                if (instance.paymentForm === undefined) { return '' }
                return instance.paymentForm.getInputByName(inputName).value;
            }
            var g = function (name, st) {
                if (st === undefined) { return '' }
                i = st[1][1]; /* parse the Crud JSON method */
                var l = i.length;
                for (var x = 0; l > x; x++) {
                    if (i[x].name == name) {
                        if (typeof i[x].value == 'string') {
                            return i[x].value.trim();
                        } else {
                            return i[x].value;
                        }
                    }
                }
            }
            var soldBy = g('soldBy', o);
            var requisitionedBy = g('requisitionedBy', o);
            var approvedBy = g('approvedBy', o);
            var req = [
				'PlaceOrder',
				[
					{
					    sessionId: instance.sessionId,
					    userId: instance.session.UserId,
					    nameOnCard: pf('cardName'),
					    cardType: "",
					    cardNumber: pf('cardNumber'),
					    expMonth: pf('expMonth'),
					    expYear: pf('expYear'),
					    secNumber: pf('secNumber'),
					    routingNumber: g('routingNumber', c),
					    checkNumber: g('checkNumber', c),
					    bankAccountNumber: g('bankAccountNumber', c),
					    notes: g('notes', c),
					    amount: g('amount', c),
					    routingNumber: g('swift', c),
					    checkNumber: g('bankName', c),
					    bankAccountNumber: g('routingTransitNumber', c),
					    payPalEmailAddress: g('payPalEmailAddress', c),
					    soldBy: Rendition.UI.iif(Rendition.UI.isNumeric(soldBy), soldBy, -1),
					    requisitionedBy: Rendition.UI.iif(Rendition.UI.isNumeric(requisitionedBy), requisitionedBy, -1),
					    approvedBy: Rendition.UI.iif(Rendition.UI.isNumeric(approvedBy), approvedBy, -1),
					    parentOrderId: g('parentOrderId', o),
					    deliverBy: g('deliverBy', o),
					    orderDate: g('orderDate', o),
					    purchaseOrder: g('purchaseOrder', o),
					    manifestNumber: g('manifest', o),
					    vendorAccountNumber: '',
					    termId: instance.termId,
					    FOB: g('FOB', o),
					    scannedImage: g('scanned_order_image', o),
					    comments: g('comment', o),
					    billToContactId: g('contactId', b),
					    billToFirstName: g('firstName', b),
					    billToLastName: g('lastName', b),
					    billToAddress1: g('address1', b),
					    billToAddress2: g('address2', b),
					    billToCity: g('city', b),
					    billToState: g('state', b),
					    billToZip: g('zip', b),
					    billToCountry: g('country', b),
					    billToCompany: g('company', b),
					    billToEmail: g('email', b),
					    billToSendShipmentUpdates: g('sendShipmentUpdates', b),
					    billToHomePhone: g('homePhone', b),
					    billToWorkPhone: g('workPhone', b),
					    billToSpecialInstructions: g('specialInstructions', b),
					    billToEmailAds: g('emailAds', b),
					    billToComments: g('comments', b),
					    billToRateId: g('rate', b),
					    shipToContactId: g('contactId', s),
					    shipToFirstName: g('firstName', s),
					    shipToLastName: g('lastName', s),
					    shipToAddress1: g('address1', s),
					    shipToAddress2: g('address2', s),
					    shipToCity: g('city', s),
					    shipToState: g('state', s),
					    shipToZip: g('zip', s),
					    shipToCountry: g('country', s),
					    shipToCompany: g('company', s),
					    shipToEmail: g('email', s),
					    shipToSendShipmentUpdates: g('sendShipmentUpdates', s),
					    shipToHomePhone: g('homePhone', s),
					    shipToWorkPhone: g('workPhone', s),
					    shipToSpecialInstructions: g('specialInstructions', s),
					    shipToComments: g('comments', s),
					    shipToEmailAds: g('emailAds', s),
					    shipToRateId: g('rate', s)
					}
				]
			]
            /* save each form sync */
            instance.billToForm.save(true, 1, undefined, false);
            instance.shipToForm.save(true, 1, undefined, false);
            var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
            instance.placeOrderDialog = Rendition.UI.UpdateDialog({
                title: Rendition.Localization['OrderEditor_Placing_Order'].Title,
                subTitle: Rendition.Localization['OrderEditor_Placing_Order'].Title,
                message: Rendition.Localization['OrderEditor_Please_wait_while_your_order_is_processed'].Title
            });
            instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                var a = JSON.parse(e.responseText);
                instance.placeOrderDialog.close();
                /* finish placing the order or deal with any errors */
                if (a.method1.error !== undefined) {
                    instance.confirmOrderErrors(Rendition.Localization['OrderEditor_Error'].Title + a.method1.error + ': ' + a.method1.description);
                    if (callbackProcedure) {
                        callbackProcedure.apply(instance, [instance]);
                    }
                    return;
                }
                var o = a.method1.PlaceOrder;
                if (o.error != 0 && o.error != 5) {
                    instance.confirmOrderErrors(Rendition.Localization['OrderEditor_Error'].Title + o.error + ': ' + o.description);
                    if (callbackProcedure) {
                        callbackProcedure.apply(instance, [instance]);
                    }
                    return;
                }
                if ((!accrued) && (instance.termId !== 13) && (instance.termId !== 0)) {
                    if (instance.paymentDialog) {
                        instance.paymentDialog.close();
                    }
                }
                var info = Rendition.UI.Info({
                    timeout: 5000,
                    position: { x: 30, y: 30 },
                    title: 'Order ' + o.orderNumber + ' created.',
                    message: Rendition.Localization['OrderEditor_You_have_created_a_new_order'].Title + '<br>' +
					'<button onmousedown="new Rendition.Commerce.OrderEditor();">' + Rendition.Localization['OrderEditor_Create_another_order'].Title + '</button><br>' +
					'<button onmousedown="new Rendition.Commerce.OrderEditor({orderNumber:\'' + o.orderNumber + '\'});">' + Rendition.Localization['OrderEditor_Edit_this_order'].Title + '</button>'
                });
                if (instance.currentScannedImage !== undefined) {
                    instance.imageViewer.dialog.close();
                }
                /* 
                do a little post order clean up by removing the extra records we created
                during this process:
                contacts (sessionId),visitors (sessionId)
                */
                var btadId = instance.billToForm.getValueByName('contactId');
                var stadId = instance.shipToForm.getValueByName('contactId');
                var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify(
					[
						"SqlCommand",
						[
							"delete from visitors where sessionId = '" + instance.sessionId.s() + "';" +
							"delete from visitorDetail where sessionId = '" + instance.sessionId.s() + "';" +
							"delete from contacts where contactId = '" + btadId.s() + "' or contactId = '" + stadId.s() + "';"
						]
					]);
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                    /* and at the very last! */
                    if (callbackProcedure) {
                        callbackProcedure.apply(instance, [instance]);
                    }
                    if (instance.dialog) {
                        /* allow the dialog to close without causing a fuss */
                        Rendition.UI.removeEvent('close', instance.dialog, instance.closeDialog, false);
                        instance.dialog.close();
                    }
                }, instance, false);
            }, instance);
        } else {
            instance.paymentDataSubmitted = undefined; /* allow the payment form to appear again */
            instance.confirmOrderErrors(k.message.join('\n'));
        }
        return instance;
    }
    instance.returnScannedImage = function () {
        var url = 'method1=["ReturnScannedImage", ["' + instance.scannedImageFile + '"]]';
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
            var a = JSON.parse(e.responseText);
            if (a.method1.error !== undefined) {
                alert(Rendition.Localization['OrderEditor_Error'].Title + a.method1.error + ':' + a.method1.description);
                return;
            }
            var a = JSON.parse(e.responseText);
            instance.scannedImages = a.method1.ReturnScannedImage;
            instance.imageViewer.dialog.close();
            instance.scannedImageFile = undefined;
            instance.currentScannedImage = undefined;
            instance.orderForm.getInputByName("scanned_order_image").value = '';
            instance.refreshMenubar();
            return;
        }, instance);
    }
    instance.getScannedImage = function () {
        if (instance.scannedImages.length > 0) {
            instance.currentScannedImage = instance.scannedImages.pop();
            var url = 'method1=["InitScannedImage",["' + instance.currentScannedImage.name.replace(/\\/g, '\\\\') + '","' + instance.sessionId + '"]]';
            instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                var a = JSON.parse(e.responseText);
                if (a.method1.error !== undefined) {
                    alert(Rendition.Localization['OrderEditor_Error'].Title + a.method1.error + ':' + a.method1.description);
                    return;
                }
                if (a.method1.InitScannedImage.error == 0) {
                    instance.scannedImageFile = a.method1.InitScannedImage.file;
                    instance.showCurrentScannedImage();
                    instance.refreshMenubar();
                    instance.orderForm.getInputByName("scanned_order_image").value = instance.scannedImageFile;
                } else {
                    alert(Rendition.Localization['OrderEditor_Error'].Title + a.method1.InitScannedImage.error + ':' + a.method1.moveScannedImage.description);
                }
            }, instance);
        }
    }
    instance.showCurrentScannedImage = function () {
        instance.imageViewer = Rendition.UI.ImageViewer({ src: '../temp/' + instance.scannedImageFile });
        instance.imageViewer.dialog.updateRect({
            x: instance.dialog.rect.x + instance.dialog.rect.w,
            y: instance.dialog.rect.y,
            h: instance.dialog.rect.h,
            w: 600
        })
    }
    instance.itemCellStyle = function (e, grid, element, row, column, selection, data, header) {
        if (column == 0 || data == null) { return true }
        if (data[8] == '-1') {
            element.style.color = '#666';
        }
    }
    instance.showLineHistory = function () {
        var v = Rendition.UI.dialogWindow({
            rect: { x: (document.documentElement.clientWidth / 2) - (520 / 2),
                y: 30, h: 372, w: 520
            },
            title: Rendition.Localization['OrderEditor_Serial_No_x_Status_Change_History'].Title.replace('{0}', instance.itemForm.getValueByName('serialNumber')),
            alwaysOnTop: true
        });
        instance.lineHistory = Rendition.UI.Grid({
            selectionMethod: 3,
            editMode: 0,
            objectName: 'flagHistory',
            suffix: ' where orderId = \'' + instance.orderId + '\' \
			or serialId = \'' + instance.currentSerialId + '\' \
			or shipmentId = \'' + instance.currentShipmentId + '\'',
            genericEditor: true,
            parentNode: v.content
        });
    }
    /* you can't modify the following columns :
    addTime
    serialNumber
    shipmentNumber
    lineNumber
    */
    instance.itemsGridAfterEditStart = function (e, grid, element, row, column, selection, data, header) {
        /* gray out cells that cannot be changed */
        var row = grid.local[row].DOM;
        var l = row.cells.length;
        for (var x = 0; l > x; x++) {
            if (row.cells[x].firstChild) {
                if (row.cells[x].firstChild.tagName !== undefined) {
                    if (row.cells[x].firstChild.tagName.toLowerCase() == 'input') {
                        var col = parseInt(row.cells[x].getAttribute('index'));
                        if (!(grid.headers[col].name != 'addTime'
						&& grid.headers[col].name != 'serialNumber'
						&& grid.headers[col].name != 'itemNumber'
						&& grid.headers[col].name != 'shipmentNumber'
						&& grid.headers[col].name != 'lineNumber')) {
                            row.cells[x].firstChild.style.background = 'url(img/2x2.gif)';
                        }
                    }
                }
            }
        }
    }
    instance.itemsGridEditKeyDown = function (e, grid, element, row, column, selection, data, header) {
        if (header.name == 'addTime'
			|| header.name == 'serialNumber'
			|| header.name == 'itemNumber'
			|| header.name == 'shipmentNumber'
			|| header.name == 'lineNumber') {
            this.onblur();
            e.preventDefault();
            return false;
        }
    }
    instance.nextOrder = function () {
        instance.closeDialog(null, null, function () {
            var req1 = [
		    "GetSqlArray",
			    [
				    {
				        commandText:
                        "select (select top 1 orderNumber from orders with (nolock) where orderId < " + instance.orderId + " order by orderId desc) as previous, \r\n" +
                        "(select top 1 orderNumber from orders with (nolock) where orderId > " + instance.orderId + " order by orderId asc) as next"
				    }
			    ]
		    ];
            Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
                var a = JSON.parse(e.responseText);
                if (a.method1.GetSqlArray[0][1] === undefined || a.method1.GetSqlArray[0][1] === null) {
                    /* there is no next order */
                    alert(Rendition.Localization['OrderEditor_This_is_the_last_order'].Title);
                    return;
                }
                /* if the user thinks its ok to go */
                Rendition.Commerce.OrderEditor({ orderNumber: a.method1.GetSqlArray[0][1] });
                return;
            }, instance, false);
        });
    }
    instance.previousOrder = function () {
        instance.closeDialog(null, null, function () {
            var req1 = [
		    "GetSqlArray",
			    [
				    {
				        commandText:
                        "select (select top 1 orderNumber from orders with (nolock) where orderId < " + instance.orderId + " order by orderId desc) as previous, \r\n" +
                        "(select top 1 orderNumber from orders with (nolock) where orderId > " + instance.orderId + " order by orderId asc) as next"
				    }
			    ]
		    ];
            Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
                var a = JSON.parse(e.responseText);
                if (a.method1.GetSqlArray[0][0] === undefined || a.method1.GetSqlArray[0][0] === null) {
                    /* there is no next order */
                    alert(Rendition.Localization['OrderEditor_This_is_the_first_order'].Title);
                    return;
                }
                Rendition.Commerce.OrderEditor({ orderNumber: a.method1.GetSqlArray[0][0] });
                return;
            }, instance, false);
        });
    }
    instance.itemsGridEditFinish = function (e, grid, element, row, column, selection, data, header) {
        var l = e.length;
        var qty = 0;
        var backorderedQty = 0;
        var canceledQty = 0;
        var org_qty = 0;
        var org_backorderedQty = 0;
        var org_canceledQty = 0;
        var cId = 0;
        var serialId = 0;
        var abortEdit = false;
        var price = 0;
        var org_price = 0;
        /* find the values that changed, if they are NOT qty, backorderedQty or canceledQty then change them back */
        for (var x = 0; l > x; x++) {
            if (e[x].value != data[x]) {
                var col = parseInt(e[x].parentNode.getAttribute('index'));
                if (!(grid.headers[col].name == 'qty'
				|| grid.headers[col].name == 'backorderedQty'
				|| grid.headers[col].name == 'price'
				|| grid.headers[col].name == 'canceledQty')) {
                    e[x].value = data[x];
                    abortEdit = true;
                }
            }
        }
        if (abortEdit) {
            alert(Rendition.Localization['OrderEditor_You_cannot_modify_this_column'].Title);
            grid.abortEdit();
            return false;
        }
        for (var x = 0; l > x; x++) {
            var col = parseInt(e[x].parentNode.getAttribute('index'));
            if (grid.headers[col].name == 'qty') {
                /* allow QTY updates here */
                qty = parseInt(e[x].value);
                org_qty = parseInt(data[x]);
            } else if (grid.headers[col].name == 'backorderedQty') {
                backorderedQty = parseInt(e[x].value);
                org_backorderedQty = parseInt(data[x]);
                e[x].value = parseInt(data[x]); /* revert to the original value */
            } else if (grid.headers[col].name == 'canceledQty') {
                canceledQty = parseInt(e[x].value);
                org_canceledQty = parseInt(data[x]);
                e[x].value = data[x]; /* revert to the original value */
            } else if (grid.headers[col].name == 'serialId') {
                serialId = parseInt(data[x]);
            } else if (grid.headers[col].name == 'price') {
                org_price = parseFloat(data[x]);
                price = parseFloat(e[x].value);
            } else if (grid.headers[col].name == 'cartId') {
                cId = data[x];
            }
        }
        /* figure out what to do with all this great data!*/
        var returnToStock = 0;
        if (qty != org_qty && backorderedQty != org_backorderedQty) {
            instance.confirmOrderErrors(Rendition.Localization['OrderEditor_Unable_to_recalculate'].Title,
						Rendition.Localization['OrderEditor_You_cannot_change_the_quantity_and_backorder_an_item_at_the_same_time'].Title);
            grid.abortEdit();
            return;
        }
        if (qty != org_qty && canceledQty != org_canceledQty) {
            instance.confirmOrderErrors(Rendition.Localization['OrderEditor_Unable_to_recalculate'].Title,
						Rendition.Localization['OrderEditor_You_cannot_change_the_quantity_and_cancel_an_item_at_the_same_time'].Title);
            grid.abortEdit();
            return;
        }
        if (canceledQty != org_canceledQty && backorderedQty != org_backorderedQty) {
            instance.confirmOrderErrors(Rendition.Localization['OrderEditor_Unable_to_recalculate'].Title,
						Rendition.Localization['OrderEditor_You_cannot_backorder_an_item_and_cancel_an_item_at_the_same_time'].Title);
            grid.abortEdit();
            return;
        }
        if (backorderedQty < org_backorderedQty) {
            instance.confirmOrderErrors(Rendition.Localization['OrderEditor_Unable_to_recalculate'].Title,
						Rendition.Localization['OrderEditor_You_cannot_decrease_the_number_of_backordered_items'].Title);
            grid.abortEdit();
            return;
        }
        if (canceledQty < org_canceledQty) {
            instance.confirmOrderErrors(Rendition.Localization['OrderEditor_Unable_to_recalculate'].Title,
						Rendition.Localization['OrderEditor_You_cannot_decrease_the_number_of_canceled_items'].Title);
            grid.abortEdit();
            return;
        }
        var cancel = false;
        var backorder = false;
        if (canceledQty != org_canceledQty) {
            returnToStock = canceledQty - org_canceledQty;
            cancel = true;
        }
        if (backorderedQty != org_backorderedQty) {
            returnToStock = backorderedQty - org_backorderedQty;
            backorder = true;
        }
        for (var x = 0; l > x; x++) {
            var col = parseInt(e[x].parentNode.getAttribute('index'));
            if (grid.headers[col].name == 'returnToStock') {
                e[x].value = returnToStock;
            }
        }
        if (cId == 0) {
            alert('wierd,can\'t find cartId');
            grid.abortEdit();
            return;
        }
        if ((serialId == 0 || serialId == -1) && (cancel || backorder)) {
            alert(Rendition.Localization['OrderEditor_This_item_must_be_confirmed_before_you_can_backorder_or_cancel_it'].Title);
            grid.abortEdit();
            return;
        }
        if (cancel && backorder) {
            alert(Rendition.Localization['OrderEditor_You_cant_cancel_and_backorder_at_the_same_time__Do_one_first_than_the_other'].Title);
            grid.abortEdit();
            return;
        }
        /* bind a query to the update - args from above e, grid, element, row, column, selection, data, header */
        if (cancel || backorder && serialId != -1) {
            var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify(
			[
				Rendition.UI.iif(backorder, "BackorderItems", "CancelItems"),
				[/* arguments contains a single argument */
					[/* a list of */
						{	/* serials and qtys */
						"serialId": serialId,
						"qty": returnToStock
		}
					]
				]
			]);
            instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                var a = JSON.parse(e.responseText);
                if (a.method1.error !== undefined) {
                    alert('error in dbo.backorderCancel:' + a.method1.description);
                    grid.abortEdit();
                    return;
                }
                if (backorder) {
                    if (a.method1.BackorderItems.error != 0) {
                        alert('error in dbo.backorderCancel:' + a.method1.BackorderItems.description);
                        grid.abortEdit();
                        return;
                    }
                } else {
                    if (a.method1.CancelItems.error != 0) {
                        alert('error in dbo.backorderCancel:' + a.method1.CancelItems.description);
                        grid.abortEdit();
                        return;
                    }
                }
                if (backorder) {
                    var childOrderNumber = a.method1.BackorderItems.childOrder.orderNumber;
                    var info = Rendition.UI.Info({
                        timeout: 5000,
                        position: { x: 30, y: 30 },
                        title: 'Item(s) Backordered',
                        message: Rendition.Localization['OrderEditor_Items_added_to_backorder_x'].Title.replace('{0}', childOrderNumber) + '<br>' +
						'<button onmousedown="new Rendition.Commerce.OrderEditor();">' + Rendition.Localization['OrderEditor_Create_another_order'].Title + '</button><br>' +
						'<button onmousedown="new Rendition.Commerce.OrderEditor({orderNumber:\'' + childOrderNumber + '\'});">' + Rendition.Localization['OrderEditor_Edit_this_order'].Title + '</button>'
                    });
                } else {
                    var info = Rendition.UI.Info({
                        timeout: 5000,
                        position: { x: 30, y: 30 },
                        title: Rendition.Localization['OrderEditor_Items_Canceled'].Title,
                        message: returnToStock + Rendition.Localization['OrderEditor_Items_Canceled'].Title
                    });
                }
                instance.previewRecalculation = false;
                instance.recalculate();
            }, instance, false);
            return;
        } else if (qty != org_backorderedQty || price != org_price) {
            var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify([
				'SqlCommand',
				["update cart set qty = convert(int,'" + qty + "'), price = convert(money,'" + price + "') where cartId = convert(uniqueidentifier,'" + cId + "');"]
			]).toURI();
            instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                var a = JSON.parse(e.responseText);
                if (a.method1.error !== undefined) {
                    alert(Rendition.Localization['OrderEditor_exception_error_during_quantityprice_change'].Title + a.method1.description);
                    grid.abortEdit();
                    return;
                }
                if (a.method1.SqlCommand.error != 0) {
                    alert(Rendition.Localization['OrderEditor_exception_error_during_quantityprice_change'].Title + a.method1.SqlCommand.description);
                    grid.abortEdit();
                    return;
                }
                /* stop the update from occuring */
                grid.abortEdit();
                /* recalculate the order */
                instance.previewRecalculation = false;
                instance.recalculate();
                return;
            }, instance, false);
        }
        /* stop the update from occuring */
        grid.abortEdit();
        return;
    }
    instance.init();
    return instance;
}