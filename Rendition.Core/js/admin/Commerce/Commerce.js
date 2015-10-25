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
/* this file contains generic structures that all commerce applications share */

/** 
Rendition commerce applications.  
This includes constructors like item editor, order editor, category editor etc..
@name Rendition.Commerce
@namespace
*/

/**
* Procedures (functions) to execute when the item editor program starts. 
* Function arguments: ItemEditor
* @name itemEditorInitEvents
* @memberOf Rendition.Commerce.prototype
* @type Native.Array
* @public
* @property
*/
Rendition.Commerce.itemEditorInitEvents = Rendition.Commerce.itemEditorInitEvents || [];
/**
* Procedures (functions) to execute when the item editor program starts. 
* Function arguments: OrderEditor
* @name orderEditorInitEvents
* @memberOf Rendition.Commerce.prototype
* @type Native.Array
* @public
* @property
*/
Rendition.Commerce.orderEditorInitEvents = Rendition.Commerce.orderEditorInitEvents || [];
/**
* Procedures (functions) to execute when the item editor program starts. 
* Function arguments: AccountEditor
* @name accountEditorInitEvents
* @memberOf Rendition.Commerce.prototype
* @type Native.Array
* @public
* @property
*/
Rendition.Commerce.accountEditorInitEvents = Rendition.Commerce.accountEditorInitEvents || [];
/**
* Tabs to add to the item editor program.  Should be an array of {Native.Function}s that return {Rendition.UI.Tab}s. 
* Function arguments: ItemEditor, Tabs
* @name itemEditorTabs
* @memberOf Rendition.Commerce.prototype
* @type Native.Array
* @public
* @property
*/
Rendition.Commerce.itemEditorTabs = Rendition.Commerce.itemEditorTabs || [];
/**
* Tabs to add to the account editor program.  Should be an array of {Native.Function}s that return {Rendition.UI.Tab}s.
* Function arguments: AccountEditor, Tabs
* @name accountEditorTabs
* @memberOf Rendition.Commerce.prototype
* @type Native.Array
* @public
* @property
*/
Rendition.Commerce.accountEditorTabs = Rendition.Commerce.accountEditorTabs || [];
/**
* Tabs to add to the account editor program stats tab section.  Should be an array of {Native.Function}s that return {Rendition.UI.Tab}s.
* Function arguments: AccountEditor, Tabs
* @name accountEditorStatsTabs
* @memberOf Rendition.Commerce.prototype
* @type Native.Array
* @public
* @property
*/
Rendition.Commerce.accountEditorStatsTabs = Rendition.Commerce.accountEditorStatsTabs || [];
/**
* Tabs to add to the order editor program.  Should be an array of {Native.Function}s that return {Rendition.UI.Tab}s.
* Function arguments: OrderEditor, Tabs
* @name orderEditorTabs
* @memberOf Rendition.Commerce.prototype
* @type Native.Array
* @public
* @property
*/
Rendition.Commerce.orderEditorTabs = Rendition.Commerce.orderEditorTabs || [];
/**
* Menus to add to the order editor item section.  Should be an array of {Native.Function}s that return {Rendition.UI.menu} arguments.
* Function arguments: OrderEditor, ItemMenus
* @name orderEditorItemMenus
* @memberOf Rendition.Commerce.prototype
* @type Native.Array
* @public
* @property
*/
Rendition.Commerce.orderEditorItemMenus = Rendition.Commerce.orderEditorItemMenus || [];
/**
* Menus to add to the order editor program.  Should be an array of {Native.Function}s that return {Rendition.UI.menu} arguments.
* Function arguments: OrderEditor, Menus
* @name orderEditorMenus
* @memberOf Rendition.Commerce.prototype
* @type Native.Array
* @public
* @property
*/
Rendition.Commerce.orderEditorMenus = Rendition.Commerce.orderEditorMenus || [];
/**
* Menus to add to the item editor program.  Should be an array of {Native.Function}s that return {Rendition.UI.menuOption} elements.
* Function arguments: ItemEditor, Menus
* @name itemEditorMenus
* @memberOf Rendition.Commerce.prototype
* @type Native.Array
* @public
* @property
*/
Rendition.Commerce.itemEditorMenus = Rendition.Commerce.itemEditorMenus || [];
/**
* Menus to add to the account editor program.  Should be an array of {Native.Function}s that return {Rendition.UI.menuOption} elements.
* Function arguments: AccountEditor, Menus
* @name accountEditorMenus
* @memberOf Rendition.Commerce.prototype
* @type Native.Array
* @public
* @property
*/
Rendition.Commerce.accountEditorMenus = Rendition.Commerce.accountEditorMenus || [];
/* generic procedure for opening existing orders via a selectButtonDialog */
Rendition.Commerce.openOrderProcedure = function () {
	new Rendition.UI.SelectButtonDialog({
		objectName: 'shortOrderList',
		contextMenuOptions: Rendition.Commerce.ComContext,
		ordinal: 1,
		modal: true,
		autoCompleteSuffix: "where orderNumber like '%<value>%' or purchaseOrder like '%<value>%'",
		mustMatchRecord: "where orderNumber = '<value>'",
		optionDisplayValue: '<column1> <column2> <column4>',
		inputTitle: Rendition.Localization['Commerce_Order_Number'].Title,
		boxTitle: Rendition.Localization['Commerce_Enter_an_order_number'].Title,
		title: Rendition.Localization['Commerce_Open_Order'].Title,
		cellstyle: function (e, grid, element, row, column, selection, data, header) {
			if (column === 9) {
				if (data[8] === 1000000) {
					data[8] = Rendition.Localization['Commerce_Paid'].Title;
				} else {
					if (data[8] > 0) {
						data[8] = Rendition.Localization['Commerce_Due_in_days'].Title.replace('{0}',data[8]);
					} else if (data[8] === 0) {
						data[8] = 'Due Today';
					} else {
		                data[8] = Rendition.Localization['Commerce_Overdue_by_days'].Title.replace('{0}',(data[8] * -1));
					}
				}
			}
		},
		callbackProcedure: function (e) {
			new Rendition.Commerce.OrderEditor({ orderNumber: e.selectedValue });
		}
	});
}
Rendition.Commerce.createProductionAgingQuery = function (userId, viewName) {
	var req1 = [
		'SqlCommand',
		[
		"if exists(select 0 from sys.views where name = '" + viewName + "') begin " +
				" drop view [" + viewName + "] end"
		]
	]
	var selList = [];
	var pivotList = [];
	var flags = Rendition.Commerce.flagTypes;
	for (var x = 0; flags.length > x; x++) {
		var flag = flags[x];
		if (flag.ShowInProductionAgingReport &&
		(flag.IsLineDetailFlag ||
		flag.IsLineFlag ||
		flag.IsOrderFlag ||
		flag.IsShipmentFlag
		)) {
			selList.push('sum([' + flag.Id + ']) as [' + flag.Name + ']');
			pivotList.push('[' + flag.Id + ']');
		}
	}
	var req2 = [
		'SqlCommand',
		[

			"create view [" + viewName + "] as select \
			orderDate, \
			" + selList.join(',') + ", -1 as VerCol \
			from \
			( \
				select convert(datetime,convert(varchar(50),orderDate,101)) as orderDate, r.lastFlagStatus \
				from orders o \
				inner join serial_order r on r.orderid = o.orderid and userId = " + userId + " \
			) s \
			pivot (count(lastFlagStatus) for lastFlagStatus in (" + pivotList.join(',') + ")) p \
			group by orderDate"
		]
	]
	new Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI +
	Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI() +
	'&method2=' + JSON.stringify(req2).toURI(),
	function (e) { }, this, false/* sync */);
	return;
}
/* show the history of a order, shipment or line */
Rendition.Commerce.showLineHistory = function (args) {
	if (args === undefined) { return; }
	var instance = {}
	instance.dialog = Rendition.UI.dialogWindow({
		rect: { x: (document.documentElement.clientWidth / 2) - (520 / 2),
			y: 30, h: 372, w: 520
		},
		title: Rendition.Localization['Commerce_Status_Change_History'].Title,
		alwaysOnTop: true
	});
	var suffix = " where orderId = '" + (args.orderId || "") + "' " +
	" or serialId = '" + (args.serialId || "") + "' " +
	" or shipmentId = '" + (args.shipmentId || "") + "' ";
	instance.lineHistory = Rendition.UI.Grid({
		selectionMethod: 3,
		editMode: 1,
		objectName: 'flagHistory',
		suffix: suffix,
		contextMenuOptions: Rendition.Commerce.ComContext,
		genericEditor: true,
		parentNode: instance.dialog.content,
		hideNewRow: true,
		editorParameters: Rendition.Commerce.flagHistoryStruct(),
		editstart: function (e, grid, element, row, column, selection, data, header) {
			if (row === grid.newRowIndex) {
				grid.cancelDefault = true;
			}
			return;
		}
	});
	/* TODO: Write a handler that will display the correct number in the title bar when the grid loads */
	return instance;
}
/* display flag history in a box */
Rendition.Commerce.flagHistoryStruct = function (path) {
	return {
		title: Rendition.Localization['Commerce_History_Details'].Title,
		hideUpdateButton: true,
		groups: [
			{
				name: 'Flag Entry',
				expanded: true,
				inputs: [
					{
						columnName: 'flagLevel',
						inputType: 'title'
					},
					{
						columnName: 'addTime',
						inputType: 'title'
					},
					{
						columnName: 'flagTypeName',
						inputType: 'title'
					},
					{
						columnName: 'comments',
						inputType: 'rte'
					}
				]
			}
		]
	}
}
/* generic attachment form */
Rendition.Commerce.attachmentFormparams = function (path) {
	return {
		groups: [
			{
				name: Rendition.Localization['Commerce_Attachments'].Title,
				expanded: true,
				inputs: [
					{
						columnName: 'path',
						fileManager: {
							path: ''
						}
					}
				]
			}
		]
	}
}
/* generic itemnumber form input */
Rendition.Commerce.itemNumberInput = function (itemNumber, columnName, required, multiselect, name, displayName) {
	if (required === undefined) { required = true }
	var colName = columnName || 'itemNumber';
	if (name !== undefined) {
		colName = undefined;
	}
	return {
		columnName: colName,
		displayName: displayName,
		name: name,
		inputSelectButton: {
			objectName: 'shortItemList',
			ordinal: 0,
			matchSuffix: "where itemNumber = '<value>'",
			mustMatchRecord: required,
			selectionMethod: Rendition.UI.iif(multiselect, 3, 0),
			contextMenuOptions: Rendition.Commerce.ComContext
		},
		autoComplete: {
			mustMatchPattern: Rendition.UI.iif(required, /.+/i, undefined),
			patternMismatchMessage: Rendition.Localization['Commerce_This_field_cannot_be_blank'].Title,
			patternMismatchTitle: Rendition.Localization['Commerce_Invalid_value'].Title,
			objectName: 'shortItemList',
			suffix: "where itemnumber like '%<value>%'",
			mustMatchRecord: required,
			matchSuffix: "where itemnumber = '<value>'",
			autoComplete: true,
			optionDisplayValue: "<column0> - <column1>",
			optionValue: "<column0>"
		}
	}
}
/* generic userId form input */
Rendition.Commerce.userIdFormInput = function (columnName, required, name, displayName) {
	if (required === undefined) {
		required = true;
	}
	return {
		columnName: columnName,
		name: name,
		displayName: displayName,
		inputSelectButton: {
			width: 60,
			objectName: 'shortUserList',
			ordinal: 0,
			mustMatchRecord: required,
			matchSuffix: Rendition.UI.iif(required, 'where userId = \'<value>\'', ''),
			contextMenuOptions: Rendition.Commerce.ComContext
		},
		autoComplete: {
			mustMatchPattern: /[0-9]+|^$/i,
			patternMismatchMessage: Rendition.Localization['Commerce_This_field_can_only_contain_the_numbers_0-9'].Title,
			patternMismatchTitle: Rendition.Localization['Commerce_Invalid_value'].Title,
			objectName: 'shortUserList',
			suffix: "where userId like '%<value>%' or handle like '%<value>%' or email like '%<value>%'",
			mustMatchRecord: required,
			matchSuffix: "where userId = '<value>'",
			autoComplete: true,
			optionDisplayValue: '<column0> <column1>',
			optionValue: '<column0>'
		}
	}
}
/* generic address form */
Rendition.Commerce.addressForm = function (rates, groupName) {
	return {
		groups: [
			{
				name: groupName || Rendition.Localization['Commerce_Address'].Title,
				expanded: true,
				inputs: [
					{
						columnName: 'firstName'
					},
					{
						columnName: 'lastName'
					},
					{
						columnName: 'address1',
						autoComplete: {
							mustMatchPattern: /[a-z 0-9]+/i
						}
					},
					{
						columnName: 'address2'
					},
					{
						columnName: 'city',
						autoComplete: {
							mustMatchPattern: /[a-z 0-9]+/i
						}
					},
					{
						columnName: 'state',
						autoComplete: {
							mustMatchPattern: /[a-z 0-9]+/i
						}
					},
					{
						columnName: 'zip',
						autoComplete: {
							mustMatchPattern: Rendition.UI.zipPattern,
							patternMismatchMessage: 'This value must be a zip code'
						}
					},
					{
						columnName: 'country',
						autoComplete: {
							mustMatchPattern: /[a-z 0-9]+/i
						}
					},
					{
						columnName: 'homePhone'
					},
					{
						columnName: 'workPhone'
					}
				]
			},
			{
				name: Rendition.Localization['Commerce_Extended_Information'].Title,
				expanded: true,
				inputs: [

					{
					    displayName: 'Email',
						columnName: 'email'
					},
					{
					    displayName: 'Send Shipment Updates',
						columnName: 'sendShipmentUpdates'
					},
					{
                        displayName: 'Email Ads',
						columnName: 'emailAds'
					},
					{
					    displayName: 'Rate',
						columnName: 'rate',
						inputType: Rendition.UI.iif(rates !== undefined, 'select', 'hidden'),
						options: rates
					},
					{
					    displayName: 'Date Created',
						columnName: 'dateCreated',
						inputType: 'title'
					},
					{
					    displayName: 'Company',
						columnName: 'company'
					}
				]
			},
			{
				name: Rendition.Localization['Commerce_Comments'].Title,
				expanded: false,
				inputs: [
					{
						columnName: 'comments',
						inputType: 'rte'
					}
				]
			},
			{
				name: Rendition.Localization['Commerce_Special_Delivery_Instructions'].Title,
				expanded: false,
				inputs: [
					{
						columnName: Rendition.Localization['Commerce_specialInstructions'].Title,
						inputType: 'rte'
					}
				]
			}
		]
	}
}
Rendition.Commerce.getItemForm = function (args, callbackFunction) {
	var req = [
		"GetFormInfo",
		[args]
	]
	var a = null;
	var URL = Rendition.UI.clientServerSyncURI + "method1=" + JSON.stringify(req);
	var j = Rendition.UI.Ajax(URL, function (e) {
		var a = JSON.parse(e.responseText);
		if (a.method1.GetFormInfo.error != 0) {
			alert(a.method1.GetFormInfo.description);
			return null;
		} else {
			a = a.method1.GetFormInfo;
		}
		if (callbackFunction) {
			callbackFunction.apply(arguments.callee, [a]);
		}
	}, arguments.callee);
	return a;
}