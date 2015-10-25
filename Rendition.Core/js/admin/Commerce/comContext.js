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
* Context menu for attchment grids.  
* This allows a person to download the file listed in the context menu.
* @function
* @name Rendition.UI.DownloadAttachmentContextMenu
* @memberOf Rendition.UI.prototype
* @public
* @param {Native.Object} e The browser event object.
* @param {Native.String} element The DHTML element being clicked on.
* @param {Native.Object} grid The <link xlink:href="Rendition.UI.Dialog"/> to read from.
*/
Rendition.UI.DownloadAttachmentContextMenu = function (e, element, grid) {
	var row = parseInt(element.getAttribute('row'));
	var column = parseInt(element.getAttribute('column'));
	var optionLength = -1;
	var contextMenuOptions = [];
	optionLength++
	contextMenuOptions[optionLength] = Rendition.UI.MenuOption();
	contextMenuOptions[optionLength].text = Rendition.Localization['ComContext_Download_File'].Title;
	Rendition.UI.appendEvent('click', contextMenuOptions[optionLength], function () {
	    var filepath = grid.getRecord(row, column);
	    if (filepath == '') { return }
	    var req = [
			'DownloadFile',
			[
				filepath
			]
		]
	    Rendition.UI.postToNewWindow(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req));
	}, false);
	return contextMenuOptions;
}
/**
* Generic context menu for commerce objects.
* @constructor
* @name Rendition.Commerce.ComContext
*/
Rendition.Commerce.ComContext = function (e, element) {
	var grid = this;
	var instance = {}
	var row = parseInt(element.getAttribute('row'));
	var column = parseInt(element.getAttribute('column'));
	instance.options = [];
	instance.optionLength = -1;
	instance.op = function (text, proc) {
		instance.optionLength++;
		instance.options[instance.optionLength] = Rendition.UI.MenuOption();
		instance.options[instance.optionLength].text = text;
		Rendition.UI.appendEvent('click', instance.options[instance.optionLength], proc, false);
	}
	instance.isThere = function (colName) {
		for (var x = 0; grid.columns > x; x++) {
			if (grid.headers[x].name === colName) {
				return true;
			}
		}
		return false;
	}
	/* is there an order number column? */
	var orderIdPresent = instance.isThere('orderId');
	var orderNumberPresent = instance.isThere('orderNumber');
	for (var x = 0; grid.columns > x; x++) {
		if (grid.headers[x].name === 'itemNumber') {
			instance.op(Rendition.Localization['ComContext_Open_Item'].Title, function (e) {
				Rendition.Commerce.ItemEditor({ itemNumber: grid.getRecord(row, 'itemNumber') });
			});
		} else if (grid.headers[x].name === 'userId') {
			instance.op(Rendition.Localization['ComContext_Open_User'].Title, function (e) {
				Rendition.Commerce.AccountEditor({ userId: grid.getRecord(row, 'userId') });
			});
		} else if (grid.headers[x].name === 'orderId') {
			grid.syncDownloadSelectedRecords();
			var s = grid.selectedRows;
			var ids = [];
			for (var y = 0; s.length > y; y++) {
				ids.push(grid.getRecord(s[y], 'orderId'));
			}
			instance.op(Rendition.Localization['ComContext_Change_Orders_Status'].Title, function (e) {
				Rendition.Commerce.ChangeStatus({
					callerType: 'order',
					objectIds: ids,
					quiet: false,
					supressErrors: false,
					callbackProcedure: function (returnStatus) {
						grid.refresh();
					}
				});
			});
			instance.op(Rendition.Localization['ComContext_Order_History'].Title, function (e) {
				Rendition.Commerce.showLineHistory({
					orderId: ids[0]
				});
			});
			instance.op(Rendition.Localization['ComContext_Pay_Orders'].Title, function (e) {
				/* find all the selected orderIds, add them to an array and pass that as the argument to the function */
				grid.syncDownloadSelectedRecords();
				var s = grid.selectedRows;
				var ids = [];
				for (var y = 0; s.length > y; y++) {
					ids.push(grid.getRecord(s[y], 'orderId'));
				}
				Rendition.Commerce.MakePayment({ orderIds: ids });
			});
			instance.op(Rendition.Localization['ComContext_Allocate_Inventory_To_Orders'].Title, function (e) {
				/* find all the selected orderIds, add them to an array and pass that as the argument to the function */
				grid.syncDownloadSelectedRecords();
				var s = grid.selectedRows;
				var ids = [];
				for (var y = 0; s.length > y; y++) {
					ids.push(grid.getRecord(s[y], 'orderId'));
				}
				var req1 = [
					Rendition.Localization['ComContext_AllocateOrders'].Title,
					[
						ids
					]
				]
				instance.aloupd = Rendition.UI.UpdateDialog({
					title: Rendition.Localization['ComContext_Updating_Status'].Title,
					subTitle: Rendition.Localization['ComContext_Updating_Status'].Title,
					message: Rendition.Localization['ComContext_Please_wait_while_the_orders_status_are_updated'].Title
				});
				instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
					instance.aloupd.close();
					var a = JSON.parse(e.responseText);
					if (a.method1.error !== undefined) {
						alert(a.method1.description);
						return;
					}
					/* loop through the return values, if there are errors build up a list of errors and display that to the user. */
					var errors = [];
					var s = a.method1.AllocateOrders;
					for (var y = 0; s.length > y; y++) {
						for (var z = 0; s[y].length > z; z++) {
							if (s[y][z].error != 0) {
								errors.push('Error ' + s[y][z].error + ':' + s[y][z].description);
							}
						}
					}
					if (errors.length === 0) {
						grid.refresh();
					} else {
						Rendition.UI.ConfirmErrors(errors.join('<br>'), Rendition.Localization['ComContext_Error_changing_order_status'].Title);
					}
				}, instance);
			});
			instance.op(Rendition.Localization['ComContext_Unallocate_Inventory_From_Orders'].Title, function (e) {
				/* find all the selected orderIds, add them to an array and pass that as the argument to the function */
				grid.syncDownloadSelectedRecords();
				var s = grid.selectedRows;
				var ids = [];
				for (var y = 0; s.length > y; y++) {
					ids.push(grid.getRecord(s[y], 'orderId'));
				}
				var req1 = [
					"UnallocateOrders",
					[
						ids
					]
				]
				instance.aloupd = Rendition.UI.UpdateDialog({
					title: Rendition.Localization['ComContext_Updating_Status'].Title,
					subTitle: Rendition.Localization['ComContext_Updating_Status'].Title,
					message: Rendition.Localization['ComContext_Please_wait_while_the_order(s)_status_are_updated'].Title
				});
				instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
					instance.aloupd.close();
					var a = JSON.parse(e.responseText);
					if (a.method1.error !== undefined) {
						alert(a.method1.description);
						return;
					}
					/* loop through the return values, if there are errors build up a list of errors and display that to the user. */
					var errors = [];
					var s = a.method1.UnallocateOrders;
					for (var y = 0; s.length > y; y++) {
						if (s[y].error != 0) {
							errors.push('Error ' + s[y].error + ':' + s[y].description);
						}
					}
					if (errors.length === 0) {
						grid.refresh();
					} else {
						Rendition.UI.ConfirmErrors(errors.join('<br>'), Rendition.Localization['ComContext_Error_changing_order_status'].Title);
					}
				}, instance);
			});
			if (!orderNumberPresent) {
				instance.op(Rendition.Localization['ComContext_Open_Order'].Title, function (e) {
					Rendition.Commerce.OrderEditor({ orderId: grid.getRecord(row, 'orderId') });
				});
			}
		} else if (grid.headers[x].name === 'orderNumber') {
			instance.op(Rendition.Localization['ComContext_Open_Order'].Title, function (e) {
				Rendition.Commerce.OrderEditor({ orderNumber: grid.getRecord(row, 'orderNumber') });
			});
			instance.op(Rendition.Localization['ComContext_Print_Order'].Title, function (e) {
				var orderNumber = grid.getRecord(row, 'orderNumber');
				var req = [
					'PrintOrder',
					[
						{
							orderNumber: orderNumber
						}
					]
				]
				Rendition.UI.IFrameDialog({
					title: Rendition.Localization['ComContext_Order'].Title.replace('{0}',orderNumber),
					src: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req)
				});
			});
		} else if (grid.headers[x].name === 'serialId') {
			grid.syncDownloadSelectedRecords();
			var s = grid.selectedRows;
			var ids = [];
			for (var y = 0; s.length > y; y++) {
				ids.push(grid.getRecord(s[y], 'serialId'));
			}
			instance.op(Rendition.Localization['ComContext_Line_History'].Title, function (e) {
				Rendition.Commerce.showLineHistory({
					serialId: ids[0]
				});
			});
			instance.op(Rendition.Localization['ComContext_Change_Lines_Status'].Title, function (e) {
                Rendition.Commerce.ChangeStatus({
					callerType: 'line',
					objectIds: ids,
					quiet: false,
					supressErrors: false,
					callbackProcedure: function (returnStatus) {
						grid.refresh();
					}
				});
			});
			instance.op(Rendition.Localization['ComContext_Allocate_Inventory_To_Lines'].Title, function (e) {
				/* find all the selected serialIds, add them to an array and pass that as the argument to the function */
				grid.syncDownloadSelectedRecords();
				var s = grid.selectedRows;
				var ids = [];
				for (var y = 0; s.length > y; y++) {
					ids.push(grid.getRecord(s[y], 'serialId'));
				}
				var req1 = [
					"AllocateLines",
					[
						ids
					]
				]
				instance.aloupd = Rendition.UI.UpdateDialog({
					title: Rendition.Localization['ComContext_Updating_Status'].Title,
					subTitle: Rendition.Localization['ComContext_Updating_Status'].Title,
					message: Rendition.Localization['ComContext_Please_wait_while_the_lines_status_are_updated'].Title
				});
				instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
					instance.aloupd.close();
					var a = JSON.parse(e.responseText);
					if (a.method1.error !== undefined) {
						alert(a.method1.description);
						return;
					}
					/* loop through the return values, if there are errors build up a list of errors and display that to the user. */
					var errors = [];
					var s = a.method1.AllocateLines;
					for (var y = 0; s.length > y; y++) {
						if (s[y].error != 0) {
							errors.push('Error ' + s[y].error + ':' + s[y].description);
						}
					}
					if (errors.length === 0) {
						grid.refresh();
					} else {
						Rendition.UI.ConfirmErrors(errors.join('<br>'), Rendition.Localization['ComContext_Error_changing_line_status'].Title);
					}
				}, instance);
			});
			instance.op(Rendition.Localization['ComContext_Unallocate_Inventory_From_Lines'].Title, function (e) {
				/* find all the selected serialIds, add them to an array and pass that as the argument to the function */
				grid.syncDownloadSelectedRecords();
				var s = grid.selectedRows;
				var ids = [];
				for (var y = 0; s.length > y; y++) {
					ids.push(grid.getRecord(s[y], 'serialId'));
				}
				var req1 = [
					"UnallocateLines",
					[
						ids
					]
				]
				instance.aloupd = Rendition.UI.UpdateDialog({
					title: Rendition.Localization['ComContext_Updating_Status'].Title,
					subTitle: Rendition.Localization['ComContext_Updating_Status'].Title,
					message: Rendition.Localization['ComContext_Please_wait_while_the_line(s)_status_are_updated'].Title
				});
				instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
					instance.aloupd.close();
					var a = JSON.parse(e.responseText);
					if (a.method1.error !== undefined) {
						alert(a.method1.description);
						return;
					}
					/* loop through the return values, if there are errors build up a list of errors and display that to the user. */
					var errors = [];
					var s = a.method1.UnallocateLines;
					for (var y = 0; s.length > y; y++) {
						if (s[y].error != 0) {
							errors.push('Error ' + s[y].error + ':' + s[y].description);
						}
					}
					if (errors.length === 0) {
						grid.refresh();
					} else {
						Rendition.UI.ConfirmErrors(errors.join('<br>'), Rendition.Localization['ComContext_Error_changing_line_status'].Title);
					}
				}, instance);
			});
		}
	}
	return instance.options;
}