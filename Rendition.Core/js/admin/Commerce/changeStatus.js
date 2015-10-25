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
/* generic commerce context menu
Designed to be attached to a Rendition.UI.Grid's contextMenuOptions argument,
automaticlly searches the grid and provides common functions for grid records.

Contains most multi order / multi user/ multi item functions
and other critical single item,order,user function as well.	
*/

/**
* Status chaning dialog.
* @constructor
* @name Rendition.Commerce.ChangeStatus
*/
Rendition.Commerce.ChangeStatus = function (args) {
	var instance = {}
	if (args === undefined) { return }
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
	instance.flags = Rendition.Commerce.flagTypes;
	var l = instance.flags.length;
	var msg = '';
	if (instance.closed) {
		var d = function () {
			return [[0, 'Comment']]
		}
	} else {
		var d = function (line, shipment, order, pLine, pShipment, pOrder) {
			var options = [];
			for (var x = 0; l > x; x++) {
				if (
			(instance.flags[x].orderFlag === order && order === true) ||
			(instance.flags[x].shipmentFlag === shipment && shipment === true) ||
			(instance.flags[x].lineFlag === line && line === true) ||
			(instance.flags[x].purchaseOrderFlag === pOrder && pOrder === true) ||
			(instance.flags[x].purchaseShipmentFlag === pShipment && pShipment) === true ||
			(instance.flags[x].purchaseLineFlag === pLine && pLine) === true
		) {
					options.push([instance.flags[x].id, instance.flags[x].Name]);
				}
			}
			return options;
		}
	}
	if (args.accountType === 0 || args.accountType === undefined) {
		if (args.callerType === 'line') {
			Rendition.UI.fillSelect(i, d(true, false, false, false, false, false), 0, 1, args.flagId);
			msg = ' selected lines(s)';
		} else if (args.callerType === 'shipment') {
			Rendition.UI.fillSelect(i, d(false, true, false, false, false, false), 0, 1, args.flagId);
			msg = ' selected shipment(s)';
		} else if (args.callerType === 'order') {
			Rendition.UI.fillSelect(i, d(false, false, true, false, false, false), 0, 1, args.flagId);
			msg = ' selected order(s)';
		} else {
			return;
		}
	} else if (args.accountType === 1) {
		if (args.callerType === 'line') {
			Rendition.UI.fillSelect(i, d(false, false, false, true, false, false), 0, 1, args.flagId);
			msg = ' selected lines(s)';
		} else if (args.callerType === 'shipment') {
			Rendition.UI.fillSelect(i, d(false, false, false, false, true, false), 0, 1, args.flagId);
			msg = ' selected shipment(s)';
		} else if (args.callerType === 'order') {
			Rendition.UI.fillSelect(i, d(false, false, false, false, false, true), 0, 1, args.flagId);
			msg = ' selected order(s)';
		} else {
			return;
		}
	}
	instance.changeStatusDialog = Rendition.UI.dialogWindow({
		rect: { x: (document.documentElement.clientWidth / 2) - (520 / 2),
			y: 30, h: 372, w: 520
		},
		title: 'Change Status',
		modal: true
	});
	var c = instance.changeStatusDialog.content;
	var g = Rendition.UI.GroupBox({
		title: 'Change Status of ' + msg,
		childNodes: [Rendition.UI.txt('New Status'), i],
		alwaysExpanded: true
	});
	var h = Rendition.UI.GroupBox({
		title: 'Comments',
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
		var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify([
			"AddFlags",
			[
				String(i.value),
				String(args.callerType),
				args.objectIds,
				String(comments)
			]
		]).toURI();
		instance.statusUpdateDialog = Rendition.UI.UpdateDialog({
			title: 'Updating Status',
			subTitle: 'Updating Status',
			message: 'Please wait, updating one or more statuses.'
		});
		instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
			instance.changeStatusDialog.close();
			instance.statusUpdateDialog.close();
			var a = JSON.parse(e.responseText);
			if (a.method1.error !== undefined) {
				alert(a.method1.description);
				return;
			}
			var errors = [];
			var a = a.method1.AddFlags;
			for (var x = 0; a.length > x; x++) {
				if (a[x].error != 0) {
					errors.push("Error " + a[x].error + ":" + a[x].description);
				}
			}
			if (errors.length === 0 && (args.quiet === false || args.quiet === undefined)) {
				var info = Rendition.UI.Info({
					timeout: 5000,
					position: { x: 30, y: 30 },
					title: 'Flag(s) added',
					message: ''
				});
			} else {
				Rendition.UI.ConfirmErrors(errors.join('<br>'), 'Error changing status(es)');
			}
			if (args.callbackProcedure) {
				args.callbackProcedure.apply(this, [a]);
			}
		}, instance, false);
		return;
	}
}