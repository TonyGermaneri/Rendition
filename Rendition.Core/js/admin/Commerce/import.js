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
* Importing editor.
* @constructor
* @name Rendition.Commerce.ImportFile
*/
Rendition.Commerce.ImportFile = function (args) {
    var instance = {}
    instance.hasChangedDialogSize = false;
    if (args === undefined) { args = {} }
    instance.serviceLevels = [
		['1', '1 (zones 2-99)'],
		['2', '2 (zones 100-199)'],
		['3', '3 (zones 200-299)'],
		['4', '4 (zones 300-399)'],
		['5', '5 (zones 400-499)'],
		['6', '6 (zones 500-599)'],
		['7', '7 (zones 600-699)'],
		['8', '8 (zones 700-799)'],
		['9', '9 (zones 800-899)'],
		['10', '10 (zones 900-999)']
	];
    instance.xlsSheet = [
		['0', 'Sheet 1'], ['1', 'Sheet 2'], ['2', 'Sheet 3'], ['3', 'Sheet 4'], ['4', 'Sheet 5'], ['5', 'Sheet 6'],
		['6', 'Sheet 7'], ['7', 'Sheet 8'], ['8', 'Sheet 9'], ['9', 'Sheet 10'], ['10', 'Sheet 11'], ['11', 'Sheet 12'],
		['12', 'Sheet 13'], ['13', 'Sheet 14'], ['14', 'Sheet 15'], ['15', 'Sheet 16'], ['16', 'Sheet 17'], ['17', 'Sheet 18'],
		['18', 'Sheet 19'], ['19', 'Sheet 20']
	];
    instance.imports = [
		['Items', 'Items'],
		['Categories', 'Categories'],
		['Shipping Rates', 'Shipping Rates'],
		['Area Surcharge', 'Area Surcharge'],
		['Zip To Zone', 'Zip To Zone']
	];
    instance.getTypeReq = function () {
        if (instance.fileType == 'Items') {
            return { reqField: ['itemNumber'], method: 'ImportItems', selectedFieldType: instance.fields.item }
        } else if (instance.fileType == 'Users') {
            return { reqField: ['handle'], method: 'ImportUsers', selectedFieldType: instance.fields.user }
        } else if (instance.fileType == 'Categories') {
            return { reqField: ['categoryName', 'itemNumber'], method: 'ImportCategories', selectedFieldType: instance.fields.category }
        } else if (instance.fileType == 'Shipping Rates') {
            return { reqField: ['weight'], method: 'ImportRates', selectedFieldType: instance.fields.rates }
        } else if (instance.fileType == 'Zone Exclusions') {
            return { reqField: ['zip'], method: 'importExclusions', selectedFieldType: instance.fields.exclusions }
        } else if (instance.fileType == 'Area Surcharge') {
            return { reqField: ['deliveryArea'], method: 'ImportSurcharge', selectedFieldType: instance.fields.surcharge }
        } else if (instance.fileType == 'Zip To Zone') {
            return { reqField: ['zipRange', 'shipZone'], method: 'ImportZipToZone', selectedFieldType: instance.fields.zone }
        }
    }
    instance.dupe = [
		[0, 'Ignore duplicate records'],
		[1, 'Update duplicate records']
	];
    instance.fields = {
        item: [
			['!ignore!', '- Select Field -'], ['itemNumber', 'itemNumber'], ['displayPrice', 'displayPrice'], ['reorderPoint', 'reorderPoint'], ['BOMOnly', 'BOMOnly'],
			['itemHTML', 'itemHTML'], ['price', 'price'], ['salePrice', 'salePrice'], ['wholeSalePrice', 'wholeSalePrice'], ['isOnSale', 'isOnSale'],
			['description', 'description'], ['shortCopy', 'shortCopy'], ['productCopy', 'productCopy'],
			['weight', 'weight'], ['quantifier', 'quantifier'], ['shortDescription', 'shortDescription'],
			['freeShipping', 'freeShipping'], ['formName', 'formName'], ['keywords', 'keywords'], ['searchPriority', 'searchPriority'],
			['workCreditValue', 'workCreditValue'], ['noTax', 'noTax'], ['deleted', 'deleted'], ['removeAfterPurchase', 'removeAfterPurchase'],
			['parentItemNumber', 'parentItemNumber'], ['allowPreorders', 'allowPreorders'], ['inventoryOperator', 'inventoryOperator'],
			['inventoryRestockOnFlagId', 'inventoryRestockOnFlagId'], ['itemIsConsumedOnFlagId', 'itemIsConsumedOnFlagId'],
			['inventoryDepletesOnFlagId', 'inventoryDepletesOnFlagId'], ['revenueAccount', 'revenueAccount'], ['ratio', 'ratio'],
			['highThreshold', 'highThreshold'], ['expenseAccount', 'expenseAccount'], ['inventoryAccount', 'inventoryAccount'],
			['COGSAccount', 'COGSAccount'], ['SKU', 'SKU'], ['itemType', 'itemType'], ['averageCost', 'averageCost']

		],
        category: [
			['!ignore!', '- Select Field -'], ['categoryName', 'categoryName'], ['itemNumber', 'itemNumber']
		],
        exclusions: [
			['!ignore!', '- Select Field -'], ['zip', 'Excluded Zip']
		],
        rates: [],
        zone: [
			['!ignore!', '- Select Field -'], ['zipRange', 'Zip Range'], ['shipZone', 'Zone']
		],
        surcharge: [
			['!ignore!', '- Select Field -'], ['deliveryArea', 'deliveryArea'], ['deliveryArea1', 'deliveryArea1'],
			['deliveryArea2', 'deliveryArea2'], ['deliveryArea3', 'deliveryArea3'], ['deliveryArea4', 'deliveryArea4']
		],
        user: [
			['!ignore!', '- Select Field -'],
			['userId', 'userId'], ['userLevel', 'userLevel'], ['handle', 'handle'], ['email', 'email'],
			['wholeSaleDealer', 'wholeSaleDealer'], ['lastVisit', 'lastVisit'], ['comments', 'comments'],
			['password', 'password'], ['administrator', 'administrator'], ['wouldLikeEmail', 'wouldLikeEmail'],
			['createDate', 'createDate'], ['sessionId', 'sessionId'], ['quotaWholesale', 'quotaWholesale'],
			['quotaComplete', 'quotaComplete'], ['quota', 'quota'], ['credit', 'credit'], ['loggedIn', 'loggedIn'],
			['purchaseAccount', 'purchaseAccount'], ['creditLimit', 'creditLimit'], ['contact', 'contact'],
			['address1', 'address1'], ['address2', 'address2'], ['zip', 'zip'], ['state', 'state'], ['country', 'country'],
			['city', 'city'], ['homePhone', 'homePhone'], ['companyEmail', 'companyEmail'], ['fax', 'fax'], ['www', 'www'],
			['firstName', 'firstName'], ['lastName', 'lastName'], ['termId', 'termId'], ['usesTerms', 'usesTerms'],
			['accountType', 'accountType'], ['noTax', 'noTax'], ['allowPreorders', 'allowPreorders'], ['FOB', 'FOB'],
			['packingSlip', 'packingSlip'], ['quote', 'quote'], ['invoice', 'invoice'], ['logon_redirect', 'logon_redirect'],
			['admin_script', 'admin_script'], ['rateId', 'rateId'], ['workPhone', 'workPhone'],
			['sendShipmentUpdates', 'sendShipmentUpdates'], ['autoFillOrderForm', 'autoFillOrderForm'],
			['estTransitTime', 'estTransitTime'], ['estLeadTime', 'estLeadTime']
		]
    }
    instance.fields.rates.push(['!ignore!', '- Select Field -']);
    instance.fields.rates.push(['weight', 'weight']);
    for (var x = 0; 1000 > x; x++) {
        instance.fields.rates.push(['zone' + x, 'Zone ' + x]);
    }
    instance.originalRect = { x: Rendition.UI.dialogPosition.x,
        y: Rendition.UI.dialogPosition.y, h: 200, w: 550
    };
    if (args.parentNode === undefined) {
        instance.dialog = Rendition.UI.dialogWindow({
            rect: instance.originalRect,
            title: 'Import',
            startingResize: function () {
                instance.hasChangedDialogSize = true;
            }
        });
        args.parentNode = instance.dialog.content;
    }
    instance.content = args.parentNode;
    instance.fieldBindings = [];
    instance.init = function () {
        instance.next = document.createElement('button');
        instance.next.style.margin = '4px';
        instance.next.innerHTML = 'Next';
        instance.next.style.cssFloat = 'right';
        instance.previous = document.createElement('button');
        instance.previous.style.margin = '4px';
        instance.previous.innerHTML = 'Previous';
        instance.previous.style.cssFloat = 'right';
        instance.tabs = [];
        instance.fileId = Rendition.UI.createUUID();
        instance.step1(args.parentNode);
        Rendition.UI.wireupCloseEvents(instance.dialogClose, args.parentNode);
    }
    instance.fileTypeChange = function (e) {
        var g = function (f) {
            return instance.formStep1.getInputByName(f);
        }
        var v = instance.formStep1.getInputByName('file').value;
        var ft = g('fileType');
        var h = instance.originalRect.h;
        if (ft.value === 'Items' || ft.value === 'Categories') {
            g('carrierId').parentNode.parentNode.style.visibility = 'hidden';
            g('rateId').parentNode.parentNode.style.visibility = 'hidden';
            g('service').parentNode.parentNode.style.visibility = 'hidden';
            g('carrierId').parentNode.parentNode.style.display = 'none';
            g('rateId').parentNode.parentNode.style.display = 'none';
            g('service').parentNode.parentNode.style.display = 'none';
        } else {
            g('carrierId').parentNode.parentNode.style.visibility = 'visible';
            g('rateId').parentNode.parentNode.style.visibility = 'visible';
            g('service').parentNode.parentNode.style.visibility = 'visible';
            g('carrierId').parentNode.parentNode.style.display = 'table-row';
            g('rateId').parentNode.parentNode.style.display = 'table-row';
            g('service').parentNode.parentNode.style.display = 'table-row';
            h += (25 * 3);
        }
        if (v.toLowerCase().indexOf('.xls') === -1) {
            g('sheetNumber').parentNode.parentNode.style.visibility = 'hidden';
            g('sheetNumber').parentNode.parentNode.style.display = 'none';
        } else {
            g('sheetNumber').parentNode.parentNode.style.visibility = 'visible';
            g('sheetNumber').parentNode.parentNode.style.display = 'table-row';
            h += (25);
        }
        instance.dialog.rect.h = h;
        instance.dialog.resize(instance.dialog.rect);
    }
    instance.step1 = function (parentNode) {
        if (!instance.hasChangedDialogSize) {
            if (instance.dialog) {
                var rect = instance.dialog.rect;
                rect.h = 200;
                rect.w = 550;
                instance.dialog.resize(rect);
            }
        }
        parentNode.innerHTML = '';
        instance.formStep1 = Rendition.UI.Form(instance.form1Args());
        instance.fileTypeChange();
        instance.formStep1.getInputByName('carrierId').value = args.carrierId || '';
        instance.formStep1.getInputByName('rateId').value = args.rateId || '';
        instance.formStep1.appendTo(parentNode);
        parentNode.appendChild(instance.next);
        parentNode.appendChild(instance.previous);
        instance.previous.disabled = true;
        instance.next.disabled = false;
        if (args.importType !== undefined) {
            instance.formStep1.getInputByName('fileType').value = args.importType;
        } else {
            Rendition.UI.appendEvent('change', instance.formStep1.getInputByName('fileType'), instance.fileTypeChange);
            Rendition.UI.appendEvent('keyup', instance.formStep1.getInputByName('file'), instance.fileTypeChange);
        }
        instance.next.onclick = function () {
            instance.next.disabled = true;
            instance.previous.disabled = true;
            instance.updateDialog = Rendition.UI.UpdateDialog({ title: 'Parseing', subTitle: 'Parsing file', message: 'Your file is being analyzed, please wait.' });
            var file = instance.formStep1.getInputByName('file').value;
            instance.fileType = instance.formStep1.getInputByName('fileType').value;
            if (file.length != 0) {
                var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify(["ImportWizard", [{
                    importFilePath: file,
                    fileType: instance.fileType,
                    includesHeader: instance.formStep1.getInputByName('includesHeader').checked,
                    ignoreBlanks: instance.formStep1.getInputByName('ignoreBlanks').checked,
                    sheetNumber: instance.formStep1.getInputByName('sheetNumber').value,
                    rateId: instance.formStep1.getInputByName('rateId').value
                }]
				]);
                new Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                    var a = JSON.parse(e.responseText);
                    instance.updateDialog.close();
                    instance.next.disabled = false;
                    instance.previous.disabled = false;
                    if (a.method1.error !== undefined) {
                        alert('Error ' + a.method1.error + ':' + a.method1.description);
                        return;
                    }
                    if (a.method1.ImportWizard.error != 0) {
                        alert('Error ' + a.method1.ImportWizard.error + ':' + a.method1.ImportWizard.description);
                        return;
                    }
                    instance.step2Data = a.method1.ImportWizard.parse;
                    /* if there were no errors, create a grid and dump the data into it */
                    instance.step2(instance.content, instance.step2Data);
                }, instance, false);
            } else {
                alert('you need to add a file to import first');
            }
        }
    }
    instance.step2 = function (parentNode, data) {
        if (!instance.hasChangedDialogSize) {
            if (instance.dialog) {
                var rect = instance.dialog.rect;
                rect.h = 518;
                rect.w = 733;
                instance.dialog.resize(rect);
            }
        }
        parentNode.innerHTML = '';
        instance.formStep2 = Rendition.UI.Form(instance.form2Args(data));
        instance.formStep2.appendTo(parentNode);
        parentNode.appendChild(instance.next);
        parentNode.appendChild(instance.previous);
        instance.previous.disabled = false;
        instance.next.disabled = false;
        instance.next.onclick = function () {
            instance.next.disabled = true;
            instance.previous.disabled = true;
            instance.updateDialog = Rendition.UI.UpdateDialog({ title: 'Parseing', subTitle: 'Parsing file', message: 'Your file is being analyzed, please wait.' });
            var hasRequiredField = false;
            instance.reqFieldName = instance.getTypeReq();
            var dupe = instance.formStep2.getInputByName('dupe').checked;
            for (var y = 0; instance.reqFieldName.reqField.length > y; y++) {
                hasRequiredField = false;
                for (var x = 0; instance.fieldBindings.length > x; x++) {
                    if (instance.fieldBindings[x].input.value == instance.reqFieldName.reqField[y]) {
                        hasRequiredField = true;
                    }
                }
                if (hasRequiredField == false) {
                    instance.next.disabled = false;
                    instance.previous.disabled = false;
                    instance.updateDialog.close();
                    alert('You must at least bind a column to ' + instance.reqFieldName.reqField[y]);
                    return;
                }
            }
            if (instance.fileType == 'Items' || instance.fileType == 'Users'
			|| instance.fileType == 'Categories') {
                var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify([
					instance.reqFieldName.method,
					[
					true/*preview the transaction*/,
					Rendition.UI.iif(dupe == 0, false, true),
					instance.getGridCollection()
				]
				]).toURI();
            } else if (instance.fileType == 'Area Surcharge') {
                var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify([
					instance.reqFieldName.method,
					[
					true/*preview the transaction*/,
					Rendition.UI.iif(dupe == 0, false, true),
					instance.getGridCollection(),
					instance.formStep1.getInputByName('carrierId').value
				]
				]).toURI();
            } else if (instance.fileType == 'Zip To Zone') {
                var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify([
					instance.reqFieldName.method,
					[
					true/*preview the transaction*/,
					Rendition.UI.iif(dupe == 0, false, true),
					instance.getGridCollection(),
					instance.formStep1.getInputByName('carrierId').value,
					instance.formStep1.getInputByName('service').value
				]
				]).toURI();
            } else if (instance.fileType == 'Shipping Rates' || instance.fileType == 'Zone Exclusions') {
                var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify([
					instance.reqFieldName.method,
					[
					true/*preview the transaction*/,
					Rendition.UI.iif(dupe == 0, false, true),
					instance.getGridCollection(),
					instance.formStep1.getInputByName('rateId').value
				]
				]).toURI();
            }
            new Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                var a = JSON.parse(e.responseText);
                instance.updateDialog.close();
                instance.next.disabled = false;
                instance.previous.disabled = false;
                if (a.method1.error !== undefined) {
                    alert('Error ' + a.method1.error + ':' + a.method1.description);
                }
                instance.step3Data = a.method1[instance.reqFieldName.method];
                /* if there were no errors, create a grid and dump the data into it */
                instance.step3(instance.content, instance.step3Data);
            }, instance, false);
            return;
        }
        instance.previous.onclick = function () {
            instance.step1(instance.content);
            return;
        }
    }
    instance.step3 = function (parentNode, data) {
        if (!instance.hasChangedDialogSize) {
            if (instance.dialog) {
                var rect = instance.dialog.rect;
                rect.h = 518;
                rect.w = 733;
                instance.dialog.resize(rect);
            }
        }
        parentNode.innerHTML = '';
        instance.formStep3 = Rendition.UI.Form(instance.form3Args(data));
        instance.formStep3.appendTo(parentNode);
        parentNode.appendChild(instance.next);
        parentNode.appendChild(instance.previous);
        instance.previous.disabled = false;
        instance.next.disabled = false;
        instance.formStep3.resize();
        instance.next.onclick = function () {
            instance.previous.disabled = true;
            instance.next.disabled = true;
            var dupe = instance.formStep2.getInputByName('dupe').checked;
            instance.updateDialog = Rendition.UI.UpdateDialog({ title: 'Importing', subTitle: 'Importing', message: 'Your file is being imported, please wait.' });
            if (instance.fileType == 'Items' || instance.fileType == 'Users'
			|| instance.fileType == 'Categories') {
                var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify([
					instance.reqFieldName.method,
					[
					false/*!preview the transaction*/,
					Rendition.UI.iif(dupe == 0, false, true),
					instance.getGridCollection()
				]
				]).toURI();
            } else if (instance.fileType == 'Area Surcharge') {
                var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify([
					instance.reqFieldName.method,
					[
					false/*!preview the transaction*/,
					Rendition.UI.iif(dupe == 0, false, true),
					instance.getGridCollection(),
					instance.formStep1.getInputByName('carrierId').value
				]
				]).toURI();
            } else if (instance.fileType == 'Zip To Zone') {
                var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify([
					instance.reqFieldName.method,
					[
					false/*!preview the transaction*/,
					Rendition.UI.iif(dupe == 0, false, true),
					instance.getGridCollection(),
					instance.formStep1.getInputByName('carrierId').value,
					instance.formStep1.getInputByName('service').value
				]
				]).toURI();
            } else if (instance.fileType == 'Shipping Rates' || instance.fileType == 'Zone Exclusions') {
                var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify([
					instance.reqFieldName.method,
					[
					false/*!preview the transaction*/,
					Rendition.UI.iif(dupe == 0, false, true),
					instance.getGridCollection(),
					instance.formStep1.getInputByName('rateId').value
				]
				]).toURI();
            }
            new Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                var a = JSON.parse(e.responseText);
                instance.updateDialog.close();
                instance.next.disabled = false;
                instance.previous.disabled = false;
                if (a.method1.error !== undefined) {
                    alert('Error ' + a.method1.error + ':' + a.method1.description);
                }
                var pos = { x: 4, y: 4 }
                if (args.quiet != true) {
                    var info = Rendition.UI.Info({
                        timeout: 1500,
                        position: pos,
                        title: 'Imported ' + instance.formStep3.grids[0].records + ' records.',
                        message: 'Import Complete'
                    });
                }
                /* return to the first step */
                if (args.rateId === undefined && args.carrierId === undefined) {
                    instance.step1(instance.content);
                } else {
                    instance.dialog.close();
                }
            }, instance, false);
            return;
        }
        instance.previous.onclick = function () {
            instance.step2(instance.content, instance.step2Data);
            return;
        }
    }
    instance.getGridCollection = function () {
        var ignoreBlanks = instance.formStep1.getInputByName('ignoreBlanks').checked;
        var onlySelectedRows = instance.formStep2.getInputByName('onlySelectedRows').checked;
        /* make an item list struct */
        var grid = instance.formStep2.grids[0];
        var items = [];
        for (var x = 1; grid.records > x; x++) {
            if ((onlySelectedRows && grid.isRowInSelection(x)) || (!onlySelectedRows)) {
                var item = {}
                var rowLength = 0;
                for (var y = 0; grid.columns + 1 > y; y++) {
                    if (instance.fieldBindings[y].input.value != '!ignore!') {
                        var value = grid.getRecord(x, y - 1);
                        if (typeof value == 'string') {
                            rowLength += value.length;
                            item[instance.fieldBindings[y].input.value] = value;
                        }
                    }
                }
                if (item !== undefined && ((ignoreBlanks == false) || (rowLength > 0 && ignoreBlanks == true))) {
                    items.push(item);
                }
            }

        }
        return items;
    }
    instance.form1Args = function () {
        var a = {
            name: 'ImportForm1',
            groups: [
					{
					    name: 'Select a file to import',
					    expaned: true,
					    inputs: [
							{
							    name: 'file',
							    displayName: 'File',
							    fileManager: {
							        path: '',
							        selectCallback: function (selectedFilesOrFoldersPath, fileManager) {
							            instance.formStep1.getInputByName('file').value = selectedFilesOrFoldersPath;
							            instance.fileTypeChange();
							        }
							    }
							},
							{
							    name: 'includesHeader',
							    displayName: 'Ignore Header Row',
							    inputType: 'checkbox'
							},
							{
							    name: 'ignoreBlanks',
							    displayName: 'Ignore Blank Rows',
							    inputType: 'checkbox'
							},
							{
							    name: 'sheetNumber',
							    displayName: 'XLS Sheet',
							    inputType: 'select',
							    options: instance.xlsSheet
							}
						]
					}
				]
        }
        if (args.importType === undefined) {
            a.groups[0].inputs.push({
                name: 'fileType',
                displayName: 'File Type',
                inputType: 'select',
                options: instance.imports
            });
        }
        if (args.carrierId === undefined && args.rateId === undefined) {
            a.groups[0].inputs.push({
                name: 'rateId',
                displayName: 'Rate For Shipping Import',
                inputSelectButton: {
                    objectName: 'shortShippingRates',
                    ordinal: 0
                }
            });
            a.groups[0].inputs.push({
                name: 'carrierId',
                displayName: 'Carrier For Shipping Import',
                inputSelectButton: {
                    objectName: 'carriers',
                    ordinal: 0
                }
            });
        } else {
            a.groups[0].inputs.push({
                name: 'fileType',
                inputType: 'hidden'
            });
            a.groups[0].inputs.push({
                name: 'carrierId',
                inputType: 'hidden'
            });
            a.groups[0].inputs.push({
                name: 'rateId',
                inputType: 'hidden'
            });
        }
        a.groups[0].inputs.push({
            displayName: 'Zip-To-Zone Class',
            name: 'service',
            inputType: 'select',
            options: instance.serviceLevels
        });
        return a;
    }
    instance.form2Args = function (data) {
        return {
            name: 'ImportForm2',
            groups: [
					{
					    name: 'Import Options',
					    expaned: true,
					    inputs: [
							{
							    name: 'onlySelectedRows',
							    displayName: 'Only import selected rows',
							    inputType: 'checkbox'
							},
							{
							    name: 'dupe',
							    displayName: 'Duplicate Handling',
							    inputType: 'select',
							    options: instance.dupe
							}
						]
					},
					{
					    name: 'Select field bindings',
					    expaned: true,
					    inputs: [
							{
							    grid: {
							        name: 'ImportBindings',
							        data: instance.createReadObject(data),
							        afterloadcallback: instance.afterloadcallback,
							        preventHeaderEvents: true
							    }
							}
						]
					}
				]
        }
    }
    instance.form3Args = function (data) {
        return {
            name: 'ImportForm3',
            groups: [
				{
				    name: 'Imported values',
				    expaned: true,
				    inputs: [
						{
						    HTML: function () {
						        var info = document.createElement('div');
						        info.className = 'ui-corner-all info';
						        info.style.maxWidth = '450px';
						        info.innerHTML = 'Review the table below. ' +
								'When you are satisfied with the results click next to import the table. ';
						        return info;
						    }
						},
						{
						    grid: {
						        name: 'ImportPreview',
						        data: instance.createPreviewReadObject(data)
						    }
						}
					]
				}
			]
        }
    }
    instance.afterloadcallback = function (e, grid, element, row, column, selection, data, header) {
        var h = grid.header;
        var l = h.childNodes.length;
        instance.fieldBindings = [];
        var includeHeaders = instance.formStep1.getInputByName('includesHeader').checked;
        var fileType = instance.formStep1.getInputByName('fileType').value;
        for (var x = 0; l > x; x++) {
            var i = document.createElement('select');
            var guessValue = '';
            i.setAttribute('column', x);
            i.style.fontSize = '.8em';
            i.style.margin = '1px auto 0 auto';
            h.childNodes[x].innerHTML = '';
            h.childNodes[x].appendChild(i);
            if (grid.headers[x - 1] !== undefined) {
                guessValue = grid.headers[x - 1].name;
            }
            if (fileType == 'Items') {
                Rendition.UI.fillSelect(i, instance.fields.item, 0, 1, guessValue);
            } else if (fileType == 'Categories') {
                Rendition.UI.fillSelect(i, instance.fields.category, 0, 1, guessValue);
            } else if (fileType == 'Users') {
                Rendition.UI.fillSelect(i, instance.fields.user, 0, 1, guessValue);
            } else if (fileType == 'Shipping Rates') {
                Rendition.UI.fillSelect(i, instance.fields.rates, 0, 1, guessValue);
            } else if (fileType == 'Zone Exclusions') {
                Rendition.UI.fillSelect(i, instance.fields.exclusions, 0, 1, guessValue);
            } else if (fileType == 'Area Surcharge') {
                Rendition.UI.fillSelect(i, instance.fields.surcharge, 0, 1, guessValue);
            } else if (fileType == 'Zip To Zone') {
                Rendition.UI.fillSelect(i, instance.fields.zone, 0, 1, guessValue);
            }
            instance.fieldBindings.push({
                index: x,
                input: i
            });
        }
    }
    instance.createPreviewReadObject = function (previewData) {
        var flds = instance.reqFieldName.selectedFieldType;
        var headers = [];
        var data = [];
        var l = previewData.length;
        for (var x = 0; l > x; x++) {
            if (previewData[x][0] !== undefined) {
                data.push(previewData[x]);
            }
        }

        if (instance.fileType == 'Shipping Rates' || instance.fileType == 'Area Surcharge') {
            var i = 0;
            for (var x = 0; instance.fieldBindings.length > x; x++) {
                if (instance.fieldBindings[x].input.value != '!ignore!') {
                    var colName = 'Column ' + parseInt(i);
                    headers.push({
                        name: instance.fieldBindings[x].input.value,
                        dataType: 'varchar',
                        dataLength: 255,
                        columnOrder: parseInt(i),
                        index: parseInt(i),
                        columnSize: 190,
                        visibility: 1,
                        description: '',
                        isNullable: 0,
                        primaryKey: 1,
                        defaultValue: '',
                        displayName: instance.fieldBindings[x].input.value,
                        hidden: 0
                    });
                    i++;
                }
            }
        } else {
            for (var x = 0; flds.length - 1 > x; x++) {
                var colName = 'Column ' + parseInt(x);
                headers.push({
                    name: flds[x + 1][0],
                    dataType: 'varchar',
                    dataLength: 255,
                    columnOrder: parseInt(x),
                    index: parseInt(x),
                    columnSize: 190,
                    visibility: 1,
                    description: '',
                    isNullable: 0,
                    primaryKey: 1,
                    defaultValue: '',
                    displayName: flds[x + 1][1],
                    hidden: 0
                });
            }
        }
        return {
            data: data,
            error: 0,
            description: '',
            range: {
                from: 1,
                to: data.length
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
                name: 'ImportPreview',
                displayName: 'ImportPreview'
            },
            header: headers
        }
    }
    instance.createReadObject = function (data) {
        var headers = [];
        var includeHeaders = instance.formStep1.getInputByName('includesHeader').checked;
        var columns = data[0].length;
        var start = Rendition.UI.iif(includeHeaders, 1, 0);
        instance.defRow = [];
        for (var x = 0; columns > x; x++) {
            var colName = 'Column ' + parseInt(x);
            headers.push({
                name: Rendition.UI.iif(includeHeaders, String(data[0][x]) || colName, colName),
                dataType: 'varchar',
                dataLength: 255,
                columnOrder: x,
                columnSize: 190,
                visibility: 1,
                description: '',
                isNullable: 0,
                primaryKey: 1,
                defaultValue: '',
                displayName: Rendition.UI.iif(includeHeaders, String(data[0][x]) || colName, colName),
                hidden: 0
            });
            instance.defRow.push([]);
        }
        if (includeHeaders) {
            data.splice(0, 1);
        }
        data.unshift(instance.defRow);
        return {
            data: data,
            error: 0,
            description: '',
            range: {
                from: 1,
                to: data.length
            },
            schema: {
                error: 0,
                errorDesc: '',
                objectId: 0,
                columns: columns,
                records: data.length,
                orderBy: 0,
                orderByDirection: 0,
                checksum: -1,
                name: 'ImportPreview',
                displayName: 'ImportPreview'
            },
            header: headers
        }
    }
    instance.init();
    return instance;
}