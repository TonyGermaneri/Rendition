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
/* generic payment methods group */
Rendition.Commerce.paymentGroup = function () {
    var a = {
        name: 'MakePayment',
		groups: [
			{
				name: Rendition.Localization['MakePayment_Posted_By_Account'].Title,
				expanded: true,
				inputs: [
					Rendition.Commerce.userIdFormInput(undefined, true, 'userId', Rendition.Localization['MakePayment_Account_No'].Title)
				]
			},
			{
				name: 'Amount',
				expanded: true,
				inputs: [
					{
						name: 'amount',
						displayName: 'Amount To Pay'
					},
					{
						name: 'paymentType',
						displayName: 'Payment Type',
						inputType: 'select',
						options: [
							['creditCard', 'Credit Card'],
							['cash', 'Cash'],
							['check', 'Check'],
							['wire', 'Wire'],
							['payPal', 'PayPal'],
							['credit', 'Existing Payment']
						]
					}
				]
			},
			{
				name: 'Pay with a credit card',
				expanded: true,
				inputs: [
					{
						name: 'cardName',
						displayName: 'Name on card'
					},
					{
						name: 'cardNumber',
						displayName: 'Card Number'
					},
					{
						name: 'expMonth',
						displayName: 'Exp. Month'
					},
					{
						name: 'expYear',
						displayName: 'Exp. Year'
					},
					{
						name: 'secNumber',
						displayName: 'Security Number'
					}
				]
			},
			{
				name: 'Pay with a check',
				expanded: true,
				inputs: [
					{
						name: 'checkNumber',
						displayName: 'Check No.'
					},
					{
						name: 'bankAccountNumber',
						displayName: 'Bank Acct. No.'
					},
					{
						name: 'routingNumber',
						displayName: 'Routing Number'
					},
					{
						name: 'notes',
						displayName: 'Notes'
					}
				]
			},
			{
				name: 'Pay by wire',
				expanded: true,
				inputs: [
					{
						name: 'swift',
						displayName: 'SWIFT No.'
					},
					{
						name: 'bankName',
						displayName: 'Bank Name'
					},
					{
						name: 'routingTransitNumber',
						displayName: 'Routing Transit Number'
					}
				]
			},
			{
				name: 'Pay with PayPal',
				expanded: true,
				inputs: [
					{
						name: 'payPalEmailAddress',
						displayName: 'PayPal Email Address'
					}
				]
			},
			{
				name: 'Pay with cash',
				expanded: true,
				inputs: [
					{
						name: 'cash',
						displayName: 'Pay With Cash',
						inputType: 'select',
						options: [['USD', 'USD - U.S. Dollars']]
					}
				]
			},
			{
				name: 'Select Payment(s) to use',
				expanded: true,
				inputs: [
					{
						grid: {
							selectionMethod: 3,
							editMode: 0,
							objectName: 'unconsumedPayments'
						}
					}
				]
			}
		]
	}
	return a;
}
/**
* Make a payment dialog.
* @constructor
* @name Rendition.Commerce.MakePayment
*/
Rendition.Commerce.MakePayment = function (args) {
    if (args === undefined) { args = {} }
    var instance = {}
    if (args.orderIds !== undefined) {
        instance.orderIds = args.orderIds;
    } else {
        instance.orderIds = [];
    }
    if (args.modal !== undefined) {
        instance.modal = args.modal;
    } else {
        instance.modal = true;
    }
    instance.selectedOrdersTotal = 0;
    instance.paymentDialog = Rendition.UI.dialogWindow({
        rect: { x: (document.documentElement.clientWidth / 2) - (720 / 2),
            y: 30, h: 580, w: 720
        },
        title: 'Make A Payment',
        modal: instance.modal,
        modalCloseable: instance.modal
    });
    instance.updateRefSelection = function (e, grid, element, row, column, selection, data, header) {
        var grid = instance.refGrid.grid;
        grid.syncDownloadSelectedRecords();
        var s = grid.selectedRows;
        instance.orderIds = [];
        for (var y = 0; s.length > y; y++) {
            var id = parseInt(grid.getRecord(s[y], 'orderId'));
            if (!isNaN(id)) {
                instance.orderIds.push(String(id));
            }
        }
        instance.getOrdersTotals(instance.orderIds);
    }
    instance.refreshRefGrid = function () {
        var crt = [];
        var menuOptions = [];
        var optionLength = 0;
        instance.cutter.cutters[1].innerHTML = '';
        menuOptions[optionLength] = Rendition.UI.MenuOption();
        menuOptions[optionLength].text = 'Make Payment';
        Rendition.UI.appendEvent('click', menuOptions[optionLength], instance.makePaymentSubmit, false);
        for (var x = 0; x < instance.orderIds.length; x++) {
            crt.push(['orderId', '=', instance.orderIds[x], '', Rendition.UI.iif(instance.orderIds.length - 1 == (x), 'and', 'or'), '1']);
        }
        var u = instance.paymentForm.getInputByName('userId').value;
        if (!isNaN(parseInt(u))) {
            crt.push(['userId', '=', u, '', 'or', '3']);
        }
        instance.refGrid = Rendition.Commerce.Search({
            objectName: 'unpaidOrders',
            criteria: crt,
            title: 'Selected orders for payment',
            parentNode: instance.cutter.cutters[1],
            menuOptions: menuOptions,
            quiet: true,
            hideCriteria: true
        });
        /* HACK: the search object above does not init fast enough to bind events to its grid
        * so wait a second to do that.
        */
        setTimeout(function () {
            Rendition.UI.appendEvent('selectionchange', instance.refGrid.grid, instance.updateRefSelection, false);
            instance.cutter.resize();
            setTimeout(instance.selectPreviousOrders, 0);
        }, 1000);
    }
    instance.makePaymentSubmit = function (e) {
        var p = instance.paymentForm.getInputByName('paymentType').value;
        var grid = instance.refGrid.grid;
        grid.syncDownloadSelectedRecords();
        var s = grid.selectedRows;
        instance.orderIds = [];
        for (var y = 0; s.length > y; y++) {
            var oid = parseInt(grid.getRecord(s[y], 'orderId'));
            /* make sure the same id isn't inserted twice */
            if (instance.orderIds.indexOf(oid) == -1) {
                instance.orderIds.push(oid);
            }
        }
        s = undefined;
        if (p == 'creditCard') {
            var req = [
				'PayWithCreditCard',
				[
					instance.paymentForm.getInputByName('cardName').value,
					"noCardTypeProvided",
					instance.paymentForm.getInputByName('cardNumber').value,
					instance.paymentForm.getInputByName('expMonth').value,
					instance.paymentForm.getInputByName('expYear').value,
					instance.paymentForm.getInputByName('secNumber').value,
					instance.paymentForm.getInputByName('amount').value,
					instance.paymentForm.getInputByName('userId').value,
					Rendition.UI.formatDate(new Date()/*now*/, 'mm/dd/yyyy'),
					instance.orderIds
				]
			]
        } else if (p == 'check') {
            var req = [
				'PayWithCheck',
				[
					instance.paymentForm.getInputByName('routingNumber').value,
					instance.paymentForm.getInputByName('checkNumber').value,
					instance.paymentForm.getInputByName('bankAccountNumber').value,
					instance.paymentForm.getInputByName('notes').value,
					instance.paymentForm.getInputByName('amount').value,
					instance.paymentForm.getInputByName('userId').value,
					Rendition.UI.formatDate(new Date()/*now*/, 'mm/dd/yyyy'),
					instance.orderIds
				]
			]
        } else if (p == 'wire') {
            var req = [
				'PayWithWire',
				[
					instance.paymentForm.getInputByName('swift').value,
					instance.paymentForm.getInputByName('bankName').value,
					instance.paymentForm.getInputByName('routingTransitNumber').value,
					instance.paymentForm.getInputByName('amount').value,
					instance.paymentForm.getInputByName('userId').value,
					Rendition.UI.formatDate(new Date()/*now*/, 'mm/dd/yyyy'),
					instance.orderIds
				]
			]
        } else if (p == 'payPal') {
            var req = [
				'PayWithPayPal',
				[
					instance.paymentForm.getInputByName('payPalEmailAddress').value,
					instance.paymentForm.getInputByName('amount').value,
					instance.paymentForm.getInputByName('userId').value,
					Rendition.UI.formatDate(new Date()/*now*/, 'mm/dd/yyyy'),
					instance.orderIds
				]
			]
        } else if (p == 'cash') {
            var req = [
				'PayWithCash',
				[
					instance.paymentForm.getInputByName('amount').value,
					instance.paymentForm.getInputByName('userId').value,
					Rendition.UI.formatDate(new Date()/*now*/, 'mm/dd/yyyy'),
					instance.orderIds
				]
			]
        } else if (p == 'credit') {
            var req = [
				'PayWithExistingPaymentMethods',
				[
					instance.paymentMethodIds,
					instance.paymentForm.getInputByName('amount').value,
					instance.paymentForm.getInputByName('userId').value,
					Rendition.UI.formatDate(new Date()/*now*/, 'mm/dd/yyyy'),
					instance.orderIds
				]
			]
        }
        instance.submitWaitDialog = Rendition.UI.UpdateDialog({
            title: 'Submitting Payment',
            subTitle: 'Just a moment...',
            message: 'Validating transaction and updating orders.'
        });
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            instance.submitWaitDialog.close();
            var a = JSON.parse(e.responseText);
            if (a.method1.error !== undefined) {
                /* interal server error */
                alert(a.method1.description);
                return;
            }
            if (a.method1[req[0]].error != 0) {
                /* process error */
                alert(a.method1[req[0]].description);
                return;
            }
            /* if there's an error give the user a chance to fix it before closing everything so return before we get here */
            instance.paymentDialog.close();
            new Rendition.UI.Info({
                timeout: 1500,
                position: { x: 15, y: 15 },
                title: 'Payment Successful',
                message: 'Trasaction completed successfully.'
            });
            if (args.callbackProcedure) {
                args.callbackProcedure.apply(instance, [instance.paymentForm]);
            }
        }, instance);
        return;
    }
    instance.paymentTypeChange = function () {
        var p = instance.paymentForm.getInputByName('paymentType').value;
        instance.hideGroupBoxes();
        if (p == 'creditCard') {
            instance.paymentForm.groupBoxes[2].show();
        } else if (p == 'check') {
            instance.paymentForm.groupBoxes[3].show();
        } else if (p == 'wire') {
            instance.paymentForm.groupBoxes[4].show();
        } else if (p == 'payPal') {
            instance.paymentForm.groupBoxes[5].show();
        } else if (p == 'cash') {
            instance.paymentForm.groupBoxes[6].show();
        } else if (p == 'credit') {
            instance.paymentForm.groupBoxes[7].show();
            instance.paymentForm.resize();
            var g = instance.paymentForm.grids[0];
            g.suffix = "where userId = '" + instance.paymentForm.getInputByName('userId').value + "'";
            g.refresh();
            if (g.events.selectionchange.length == 0) {
                Rendition.UI.appendEvent('selectionchange', g, instance.updateSelectedPaymentMethods, false);
            }
        }
    }
    instance.updateSelectedPaymentMethods = function (e, grid, element, row, column, selection, data, header) {
        grid.syncDownloadSelectedRecords();
        var s = grid.selectedRows;
        instance.paymentMethodIds = [];
        for (var y = 0; s.length > y; y++) {
            instance.paymentMethodIds.push(grid.getRecord(s[y], 'paymentMethodId'));
        }
        var req1 = [
		"GetPaymentsTotal",
			[
				instance.paymentMethodIds
			]
		];
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
            var a = JSON.parse(e.responseText);
            if (a.method1.error !== undefined) {
                alert(a.method1.description);
                return;
            }
            if (a.method1.GetPaymentsTotal.error != 0) {
                alert(a.method1.GetPaymentsTotal.description);
                return;
            }
            instance.selectedPaymentsRemaningTotal = a.method1.GetPaymentsTotal.totalRemaning;
            instance.paymentForm.groupBoxes[7].tspan.firstChild.textContent =
			'$' + instance.selectedPaymentsRemaningTotal.toFixed(2) + ' Selected';
        }, instance, false);
        return;
    }
    instance.hideGroupBoxes = function () {
        var g = instance.paymentForm.groupBoxes;
        var l = g.length;
        for (var x = 2/*ignore index 0,1 */; l > x; x++) {
            g[x].hide();
        }
    }
    instance.getOrdersTotals = function (ids) {
        if (ids === undefined) { return; }
        if (ids.length == 0) { return; }
        var req1 = [
		"GetOrdersTotal",
			[
				ids
			]
		];
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
            var a = JSON.parse(e.responseText);
            if (a.method1.error !== undefined) {
                alert(a.method1.description);
                return;
            }
            if (a.method1.GetOrdersTotal.error != 0) {
                alert(a.method1.GetOrdersTotal.description);
                return;
            }
            var orders = a.method1.GetOrdersTotal.orders;
            var ui = instance.paymentForm.getInputByName('userId');
            var u = ui.value;
            var refChanged = false;
            if (isNaN(parseInt(u))) {
                ui.value = orders[0].userId;
                refChanged = true;
            }
            instance.orderIds = [];
            for (var y = 0; orders.length > y; y++) {
                if (parseInt(orders[y].userId) != parseInt(u)) {
                    ui.value = orders[y].userId;
                    refChanged = true;
                }
                instance.orderIds.push(orders[y].orderId);
            }
            /* set the amount to be paid to the value of all the selected orders unpaid amount */
            instance.selectedOrdersTotal = a.method1.GetOrdersTotal.total;
            var amountInput = instance.paymentForm.getInputByName('amount');
            amountInput.value = instance.selectedOrdersTotal;
        }, instance, false);
    }
    instance.selectPreviousOrders = function () {
        var g = instance.refGrid.grid;
        g.clearSearchFilters();
        for (var y = 0; instance.orderIds.length > y; y++) {
            /* search for each orderId */
            g.addSearchFilter(0, '=', instance.orderIds[y], '', '0', 'or');
        }
        /* do the search */
        g.search();
        /* add the search to the selection */
        g.addSearchToSelection();
    }
    instance.init = function () {
        instance.paymentForm = Rendition.UI.Form(Rendition.Commerce.paymentGroup());
        instance.cutter = Rendition.UI.CutterBar({
            parentNode: instance.paymentDialog.content
        });
        instance.paymentForm.appendTo(instance.cutter.cutters[0]);
        instance.cutter.cutters[0].style.overflow = 'scroll';
        instance.paymentForm.getInputByName('amount').value = args.amount || 0;
        instance.paymentForm.getInputByName('userId').value = args.userId || '';
        if (args.paymentType !== undefined) {
            instance.paymentForm.getInputByName('paymentType').value = args.paymentType;
        }
        Rendition.UI.appendEvent('change', instance.paymentForm.getInputByName('userId'), instance.refreshRefGrid, false);
        Rendition.UI.appendEvent('change', instance.paymentForm.getInputByName('paymentType'), instance.paymentTypeChange, false);
        instance.cutter.resize();
        /* HACK: This occurs too quickly */
        setTimeout(function () {
            instance.refreshRefGrid();
            instance.paymentTypeChange();
        }, 3000);
    }
    instance.init();
    return instance;
}