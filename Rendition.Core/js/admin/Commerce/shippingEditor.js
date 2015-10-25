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
* Shipping editor.
* @constructor
* @name Rendition.Commerce.ShippingEditor
*/
Rendition.Commerce.ShippingEditor = function (args) {
    var instance = {}
    instance.folderIcon = '<img style="margin-bottom:-4px;" src="img/icons/folder.png" alt=""> ';
    instance.noServiceIcon = '<img style="margin-bottom:-4px;" src="img/icons/lorry_flatbed.png" alt=""> ';
    instance.serviceIcon = '<img style="margin-bottom:-4px;" src="img/icons/lorry.png" alt=""> '
    if (args === undefined) { args = {} }
    instance.carrierTabOrder = {
        general: 0,
        areaSurcharge: 1,
        zipToZone: 2
    }
    instance.serviceTabOrder = {
        general: 0,
        rates: 1,
        thirdParty: 2,
        zoneExclusions: 3
    }
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
	]
    instance.carrierFormArgs = function () {
        return {
            groups: [
				{
				    name: Rendition.Localization['ShippingEditor_Carrier'].Title,
				    expaned: true,
				    inputs: [
						{
						    columnName: 'carrierName'
						}
					]
				}
			]
        }
    }
    instance.serviceFormArgs = function () {
        return {
            groups: [
				{
				    name: Rendition.Localization['ShippingEditor_General'].Title,
				    expaned: true,
				    inputs: [
						{
						    columnName: 'shippingName'
						},
						{
						    columnName: 'zoneServiceClass',
						    inputType: 'select',
						    options: instance.serviceLevels
						},
						{
						    columnName: 'discountRate'
						},
						{
						    columnName: 'enabled'
						},
						{
						    columnName: 'international'
						}
					]
				},
				{
				    name: Rendition.Localization['ShippingEditor_Surcharges'].Title,
				    expaned: true,
				    inputs: [
						{
						    columnName: 'cmrAreaSurch'
						},
						{
						    columnName: 'resAreaSurchg'
						},
						{
						    columnName: 'groundFuelSurchgPct'
						},
						{
						    columnName: 'airFuelSurchgPct'
						},
						{
						    columnName: 'addCharge'
						}
					]
				},
				{
				    name: Rendition.Localization['ShippingEditor_Where_does_it_show_up'].Title,
				    expaned: true,
				    inputs: [
						{
						    columnName: 'showsUpInRetailCart'
						},
						{
						    columnName: 'showsUpInWholesaleCart'
						},
						{
						    columnName: 'showsUpInOrderEntry'
						}
					]
				},
				{
				    name: Rendition.Localization['ShippingEditor_Rate_Calculator'].Title,
				    expaned: true,
				    inputs: [
                        {
                            HTML: function () {
                                instance.ratePreviewDiv = document.createElement('div');
                                instance.ratePreviewZIPInput = document.createElement('input');
                                instance.ratePreviewWeightInput = document.createElement('input');
                                instance.ratePreviewButton = document.createElement('button');
                                instance.ratePreviewOutput = document.createElement('div');
                                instance.ratePreviewCOMInput = document.createElement('input');
                                instance.ratePreviewCOMInput.type = "checkbox"
                                instance.ratePreviewZIPInput.style.width = '60px'
                                instance.ratePreviewWeightInput.style.width = '35px'
                                instance.ratePreviewDiv.appendChild(Rendition.UI.txt("Commercial:"));
                                instance.ratePreviewDiv.appendChild(instance.ratePreviewCOMInput);
                                instance.ratePreviewDiv.appendChild(Rendition.UI.txt("Weight:"));
                                instance.ratePreviewDiv.appendChild(instance.ratePreviewWeightInput);
                                instance.ratePreviewDiv.appendChild(Rendition.UI.txt("ZIP:"));
                                instance.ratePreviewDiv.appendChild(instance.ratePreviewZIPInput);
                                instance.ratePreviewDiv.appendChild(instance.ratePreviewButton);
                                instance.ratePreviewDiv.appendChild(instance.ratePreviewOutput);
                                instance.ratePreviewButton.innerHTML = 'Calculate';
                                instance.ratePreviewButton.onclick = function () {
                                    var req1 = [
			                            "CalculateShippingRate",
			                            [{
			                                weight: instance.ratePreviewWeightInput.value,
			                                zip: instance.ratePreviewZIPInput.value,
			                                commercial: instance.ratePreviewCOMInput.checked,
			                                rateId: instance.currentRateId
			                            }]
		                            ]
                                    var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1);
                                    var reqEval = Rendition.UI.Ajax(url, function (e) {
                                        var a = JSON.parse(e.responseText);
                                        a = a.method1.CalculateShippingRate;
                                        var o = instance.ratePreviewOutput;
                                        if (a.error !== 0) {
                                            o.innerHTML = a.description;
                                            return;
                                        }
                                        if (a.rateId == -1) {
                                            o.innerHTML = "<i>Not Supported By This Rate</i>";
                                            return;
                                        }
                                        o.innerHTML = "<table class=ratesPreview>" +
                                        "<tr><th>Zone</th><td>" + a.zone + "</td></tr>" +
                                        "<tr><th>Base Rate</th><td>" + a.baseRate.toFixed(2) + "</td></tr>" +
                                        "<tr><th>Fuel Surcharge</th><td>" + a.fuelSurcharge.toFixed(2) + "</td></tr>" +
                                        "<tr><th>Rural Area Surcharge</th><td>" + a.ruralAreaSurcharge.toFixed(2) + "</td></tr>" +
                                        "<tr><th class=baseline>Handling Charge</th><td class=baseline>" + a.addCharge.toFixed(2) + "</td></tr>" +
                                        "<tr><th>Total</th><td>" + a.total.toFixed(2) + "</td></tr>" +
                                        "<tr><th>Rounded Up</th><td>" + a.roundedTotal.toFixed(2) + "</td></tr>" +
                                        "</table>";
                                    }, instance);
                                };
                                return instance.ratePreviewDiv;
                            }
                        }
                    ]
				}
			]
        }
    }
    instance.init = function () {
        if (args.parentNode === undefined) {
            instance.dialog = Rendition.UI.dialogWindow({
                rect: { x: Rendition.UI.dialogPosition.x,
                    y: Rendition.UI.dialogPosition.y,
                    h: document.documentElement.clientHeight - 100, w: 600
                },
                title: Rendition.Localization['ShippingEditor_Shipping_Editor'].Title,
                rememberPosition: true,
                id: 'ShippingTypeEditorAllByItself'
            });
            args.parentNode = instance.dialog.content;
        }
        instance.rootCutter = Rendition.UI.CutterBar({
            parentNode: args.parentNode,
            autoResize: false,
            id: 'imageShippingTypesCutter1',
            position: 170
        });
        instance.typeGrid = Rendition.UI.Grid({
            objectName: 'shippingType',
            editMode: 3,
            editorParameters: instance.serviceFormArgs
        });
        instance.carrierGrid = Rendition.UI.Grid({
            objectName: 'carriers',
            editMode: 3,
            editorParameters: instance.carrierFormArgs
        });
        instance.initTreeView();
        return instance;
    }
    instance.initTreeView = function () {
        var req1 = [
			"DataSet",
			['carriers', '', "1", "9999999", '', {}, [], 'JSON', true, "-1", false, 'carrierName', 'asc']
		]
        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1);
        var reqEval = Rendition.UI.Ajax(url, function (e) {
            var a = JSON.parse(e.responseText);
            instance.ShippingTypes = a.method1.DataSet.data;
            instance.tree = Rendition.UI.TreeView({
                parentNode: instance.rootCutter.cutters[0],
                rootNode: {
                    text: 'ShippingTypes',
                    value: 'root',
                    childNodes: instance.shippingTypeNodes
                },
                labelclick: instance.labelClick,
                labelcontextmenu: instance.labelContextMenu,
                refresh: function () {
                    instance.rootCutter.cutters[0].innerHTML = '';
                    instance.initTreeView();
                }
            });
        }, instance);
        return instance;
    }
    instance.treeObject = function (data, nodeName) {
        var childNodes = [];
        var l = data.length;
        if (l != 0) {
            for (var x = 0; l > x; x++) {
                childNodes.push({
                    text: instance.serviceIcon + data[x][0],
                    value: data[x][1],
                    data: data[x],
                    childNodes: [],
                    type: 'service'
                });
            }
        }
        return childNodes;
    }
    instance.shippingTypeNodes = function (treeView, treeNode, parentNode) {
        var l = instance.ShippingTypes.length;
        for (var x = 0; l > x; x++) {
            var id = String(instance.ShippingTypes[x][0]);
            var req = [
				"DataSet",
				['shippingType', 'where zoneCarrierId = \'' + id + '\'', "0", "9999999", '', {}, [], 'JSON', true, "-1", false, 'menuOrder', 'asc']
			]
            treeView.add({
                text: instance.folderIcon + '<span style="font-weight:bold;">' + String(instance.ShippingTypes[x][1]),
                value: String(instance.ShippingTypes[x][0]),
                data: instance.ShippingTypes[x],
                type: 'carrier',
                childNodes: {
                    url: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req),
                    callbackArguments: [String(id)],
                    callbackProcedure: function (id, json, tree, node) {
                        var a = json.method1.DataSet;
                        if (a.error == 0) {
                            var treeObj = instance.treeObject(a.data, node);
                            var l = treeObj.length;
                            while (node.firstChild) { node.removeChild(node.firstChild) }
                            for (var x = 0; l > x; x++) {
                                tree.add(treeObj[x], node);
                            }
                            treeView.add({
                                text: Rendition.Localization['ShippingEditor_Add_a_Service'].Title,
                                value: id,
                                childNodes: [],
                                type: 'newService'
                            }, node);
                        } else {
                            instance.errorMessage(a);
                            tree.preventDefault();
                        }
                        return false;
                    }
                }
            }, parentNode);
        }
        treeView.add({
            text: instance.noServiceIcon + Rendition.Localization['ShippingEditor_No_Service'].Title,
            value: -1,
            childNodes: [],
            type: 'noService'
        }, parentNode);
        treeView.add({
            text: Rendition.Localization['ShippingEditor_Add_a_Carrier'].Title,
            value: Rendition.UI.emptyUUID,
            childNodes: [],
            type: 'newCarrier'
        }, parentNode);
    }
    instance.serviceFormStruct = function (inReadObject, inCallbackProcedure) {
        var a =
		{
		    callbackProcedure: inCallbackProcedure,
		    dataSet: inReadObject,
		    groups: instance.serviceFormArgs().groups
		}
        return a;
    }
    instance.carrierFormStruct = function (inReadObject, inCallbackProcedure) {
        var a =
		{
		    callbackProcedure: inCallbackProcedure,
		    dataSet: inReadObject,
		    groups: instance.carrierFormArgs().groups
		}
        return a;
    }
    instance.serviceEdit = function (e, treeView, node, labelText, treeNode, parentNode) {
        var rateId = treeNode.data[1];
        instance.currentRateId = rateId;
        var req = [
			"DataSet",
			['shippingType', 'where rate = \'' + rateId + '\'', "0", "9999999", '', {}, [], 'JSON', true, "-1", false, 'menuOrder', 'asc']
		]
        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
        var reqEval = Rendition.UI.Ajax(url, function (e) {
            var a = JSON.parse(e.responseText);
            instance.rootCutter.cutters[1].innerHTML = '';
            instance.tabs = [];
            instance.tabs[instance.serviceTabOrder.general] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ShippingEditor_General'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML == '') {
                        content.style.overflow = 'scroll';
                        if (a.method1.error !== undefined) {
                            alert(a.method1.description);
                        } else {
                            instance.menuBarElements = [];
                            instance.menuBarElements[0] = Rendition.UI.MenuOption();
                            instance.menuBarElements[0].text = Rendition.Localization['ShippingEditor_Save'].Title;
                            Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
                                instance.form.save();
                                return false;
                            }, false);
                            instance.menuBarElements[1] = Rendition.UI.MenuOption();
                            instance.menuBarElements[1].text = Rendition.Localization['ShippingEditor_Upload_Rates'].Title;
                            Rendition.UI.appendEvent('click', instance.menuBarElements[1], function (e) {
                                new Rendition.Commerce.ImportFile({ importType: 'Shipping Rates', rateId: rateId });
                                return false;
                            }, false);
                            instance.menuBarElements[2] = Rendition.UI.MenuOption();
                            instance.menuBarElements[2].text = Rendition.Localization['ShippingEditor_Refresh'].Title;
                            Rendition.UI.appendEvent('click', instance.menuBarElements[2], function (e) {
                                labelText.onclick();
                                return false;
                            }, false);
                            instance.menuBar = Rendition.UI.MenuBar({
                                options: instance.menuBarElements,
                                parentNode: content
                            });
                            instance.form = Rendition.UI.Form(instance.serviceFormStruct(a.method1.DataSet));
                            instance.form.groupBoxes[0].outer.style.marginTop = '40px';
                            instance.form.appendTo(content);
                        }
                    }
                }
            });

            instance.tabs[instance.serviceTabOrder.rates] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ShippingEditor_Rates'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML == '') {
                        instance.rateGrid = Rendition.UI.Grid({
                            objectName: 'shipZone',
                            editMode: 3,
                            parentNode: content,
                            suffix: 'where rate = \'' + rateId + '\'',
                            genericEditor: true,
                            newRecord: {
                                rate: rateId
                            }
                        });
                    }
                }
            });

            instance.tabs[instance.serviceTabOrder.thirdParty] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ShippingEditor_Third_Party_Accounts'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML == '') {
                        instance.thirdPartyAccountsgrid = Rendition.UI.Grid({
                            objectName: 'thirdPartyShipping',
                            editMode: 3,
                            parentNode: content,
                            suffix: 'where rateId = \'' + rateId + '\'',
                            genericEditor: true,
                            newRecord: {
                                rateId: rateId
                            }
                        });
                    }
                }
            });

            instance.tabs[instance.serviceTabOrder.zoneExclusions] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ShippingEditor_Exclusions'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML == '') {
                        instance.exclusionsGrid = Rendition.UI.Grid({
                            objectName: 'zoneExclusions',
                            editMode: 3,
                            parentNode: content,
                            suffix: 'where rate = \'' + rateId + '\'',
                            genericEditor: true,
                            newRecord: {
                                rate: rateId
                            }
                        });
                    }
                }
            });


            instance.tabbar = Rendition.UI.TabBar({
                tabs: instance.tabs,
                parentNode: instance.rootCutter.cutters[1],
                activeTabIndex: 0
            });
        }, instance);
    }
    instance.carrierEdit = function (e, treeView, node, labelText, treeNode, parentNode) {
        var req = [
			"DataSet",
			['carriers', 'where carrierId = \'' + treeNode.data[0] + '\'', "0", "9999999", '', {}, [], 'JSON', true, "-1", false, '', '']
		]
        var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
        var reqEval = Rendition.UI.Ajax(url, function (e) {
            var a = JSON.parse(e.responseText);
            instance.rootCutter.cutters[1].innerHTML = '';
            instance.tabs = [];
            instance.tabs[instance.carrierTabOrder.general] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ShippingEditor_General'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML == '') {
                        content.style.overflow = 'scroll';
                        if (a.method1.error !== undefined) {
                            alert(a.method1.description);
                        } else {
                            instance.menuBarElements = [];
                            instance.menuBarElements[0] = Rendition.UI.MenuOption();
                            instance.menuBarElements[0].text = Rendition.Localization['ShippingEditor_Save'].Title;
                            Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
                                instance.form.save();
                                return false;
                            }, false);
                            instance.menuBarElements[1] = Rendition.UI.MenuOption();
                            instance.menuBarElements[1].text = Rendition.Localization['ShippingEditor_Upload_Area_Surcharge'].Title;
                            Rendition.UI.appendEvent('click', instance.menuBarElements[1], function (e) {
                                new Rendition.Commerce.ImportFile({ importType: 'Area Surcharge', carrierId: treeNode.data[0] });
                                return false;
                            }, false);
                            instance.menuBarElements[2] = Rendition.UI.MenuOption();
                            instance.menuBarElements[2].text = Rendition.Localization['ShippingEditor_Upload_Zip_To_Zone'].Title;
                            Rendition.UI.appendEvent('click', instance.menuBarElements[2], function (e) {
                                new Rendition.Commerce.ImportFile({ importType: 'Zip To Zone', carrierId: treeNode.data[0] });
                                return false;
                            }, false);
                            instance.menuBarElements[3] = Rendition.UI.MenuOption();
                            instance.menuBarElements[3].text = Rendition.Localization['ShippingEditor_Refresh'].Title;
                            Rendition.UI.appendEvent('click', instance.menuBarElements[3], function (e) {
                                labelText.onclick();
                                return false;
                            }, false);
                            instance.menuBar = Rendition.UI.MenuBar({
                                options: instance.menuBarElements,
                                parentNode: content
                            });
                            instance.form = Rendition.UI.Form(instance.carrierFormStruct(a.method1.DataSet));
                            instance.form.groupBoxes[0].outer.style.marginTop = '40px';
                            instance.form.appendTo(content);
                        }
                    }
                }
            });


            instance.tabs[instance.carrierTabOrder.areaSurcharge] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ShippingEditor_Area_Surcharge'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML == '') {
                        instance.areaSurchargeGrid = Rendition.UI.Grid({
                            objectName: 'areaSurcharge',
                            editMode: 3,
                            parentNode: content,
                            suffix: 'where carrier = \'' + treeNode.data[0] + '\'',
                            genericEditor: true,
                            newRecord: {
                                carrier: treeNode.data[0]
                            }
                        });
                    }
                }
            });

            instance.tabs[instance.carrierTabOrder.zipToZone] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ShippingEditor_Zip_To_Zone'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML == '') {
                        instance.zipToZoneGrid = Rendition.UI.Grid({
                            objectName: 'zipToZone',
                            editMode: 3,
                            parentNode: content,
                            suffix: 'where carrier = \'' + treeNode.data[0] + '\'',
                            genericEditor: true,
                            newRecord: {
                                carrier: treeNode.data[0]
                            }
                        });
                    }
                }
            });

            instance.tabbar = Rendition.UI.TabBar({
                tabs: instance.tabs,
                parentNode: instance.rootCutter.cutters[1],
                activeTabIndex: 0
            });


        }, instance);
    }
    instance.noServiceCarrier = function () {
        content.innerHTML = '';
        var nsTabs = [];
        nsTabs[0] = Rendition.UI.TabBarTab({
            title: Rendition.Localization['ShippingEditor_Thrid_Party_Shipping'].Title,
            load: function (tab, tabBar, content) {
                if (content.innerHTML == '') {
                    instance.thirdPartyAccountsgrid = Rendition.UI.Grid({
                        objectName: 'thirdPartyShipping',
                        editMode: 3,
                        parentNode: content,
                        suffix: 'where rateId = -1',
                        genericEditor: true,
                        newRecord: {
                            rateId: -1
                        }
                    });
                }
            }
        });
        instance.tabbar = Rendition.UI.TabBar({
            tabs: nsTabs,
            parentNode: instance.rootCutter.cutters[1],
            activeTabIndex: 0
        });
    }
    instance.labelClick = function (e, treeView, node, labelText, treeNode, parentNode) {
        if (treeNode.type == 'service') {
            instance.serviceEdit(e, treeView, node, labelText, treeNode, parentNode);
        } else if (treeNode.type == 'noService') {
            instance.rootCutter.cutters[1].innerHTML = '';
            instance.noServiceCarrier();
        } else if (treeNode.type == 'carrier') {
            instance.carrierEdit(e, treeView, node, labelText, treeNode, parentNode);
        } else if (treeNode.type == 'newService') {
            var rate = Rendition.UI.getSqlArray('select case when max(rate) is null then 1 else max(rate)+(ROUND(RAND()*100,0,0))+1 end from shippingType with (nolock)');
            var newRecordRow = instance.typeGrid.newRecord({ zoneCarrierId: treeNode.value, rate: rate });
            instance.newRecordForm = instance.typeGrid.genericEditor(instance.typeGrid.newRowIndex, instance.serviceFormStruct(instance.typeGrid.dataSet, function () {
                node.refreshParent();
                instance.refreshSiteShippingTypes();
                return;
            }), newRecordRow);
        } else if (treeNode.type == 'newCarrier') {
            var carrierId = Rendition.UI.getSqlArray('select case when max(carrierid) is null then 1 else max(carrierid)+(ROUND(RAND()*100,0,0))+1 end from carriers with (nolock)');
            var newRecordRow = instance.carrierGrid.newRecord({ carrierId: carrierId });
            instance.newRecordForm = instance.carrierGrid.genericEditor(instance.carrierGrid.newRowIndex, instance.carrierFormStruct(instance.carrierGrid.dataSet, function () {
                node.refreshParent();
                instance.refreshSiteShippingTypes();
                return;
            }), newRecordRow);
        }
    }
    instance.refreshSiteShippingTypes = function () {
        var req = [
			'refreshShippingTypes',
			[]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            return;
        }, instance);
    }
    instance.labelContextMenu = function (e, treeView, node, labelText, treeNode, parentNode) {
        if (treeNode.type == 'newcarrier' || treeNode.type == 'newservice') { return null; }
        if (treeNode.type == 'carrier' || treeNode.type == 'service') {
            var optionIndex = -1;
            var options = [];
            if (treeNode.type == 'carrier') {
                optionIndex++;
                options[optionIndex] = Rendition.UI.MenuOption();
                options[optionIndex].text = Rendition.Localization['ShippingEditor_Delete_Carrier'].Title;
                Rendition.UI.appendEvent('click', options[optionIndex], function () {
                    instance.confirmDelete = Rendition.UI.ConfirmDialog({
                        ontrue: function () {
                            var req = [
								'SqlCommand',
								['delete from carriers where carrierId = \'' + treeNode.data[0] + '\';' +
								'delete from shipZone where rate in (select rate from shippingtype where zoneCarrierId = \'' + treeNode.data[0] + '\');' +
								'delete from zoneExclusions where rate in (select rate from shippingtype where zoneCarrierId = \'' + treeNode.data[0] + '\');' +
								'delete from thirdPartyShipping where rateId in (select rate from shippingtype where zoneCarrierId = \'' + treeNode.data[0] + '\');' +
								'delete from shippingType where zoneCarrierId = \'' + treeNode.data[0] + '\';' +
								'delete from zipToZone where carrier = \'' + treeNode.data[0] + '\';'
								]
							]
                            instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                                var f = JSON.parse(e.responseText);
                                if (f.method1.SqlCommand.error != 0) {
                                    alert(f.method1.SqlCommand.description);
                                } else {
                                    treeView.removeNode(node);
                                }
                            }, instance);
                            instance.confirmDelete.dialog.close();
                        },
                        onfalse: function () {
                            instance.confirmDelete.dialog.close();
                        },
                        title: Rendition.Localization['ShippingEditor_Confirm_Carrier_Delete'].Title,
                        subTitle: Rendition.Localization['ShippingEditor_Delete_Carrier'].Title,
                        message: Rendition.Localization['ShippingEditor_Are_you_sure_you_want_to_delete_this_carrier'].Title.replace('\n','<br>'),
                        dialogRect: { x: (document.documentElement.clientWidth * .5) - (450 * .5), y: 75, h: 173, w: 450 }
                    });
                }, false);
            } else {
                optionIndex++;
                options[optionIndex] = Rendition.UI.MenuOption();
                options[optionIndex].text = 'Delete Service';
                Rendition.UI.appendEvent('click', options[optionIndex], function () {
                    instance.confirmDelete = Rendition.UI.ConfirmDialog({
                        ontrue: function () {
                            var req = [
								'SqlCommand',
								['delete from shippingType where rate = \'' + treeNode.data[1] + '\';' +
								'delete from shipZone where rate = \'' + treeNode.data[1] + '\';' +
								'delete from zoneExclusions where rate = \'' + treeNode.data[1] + '\';' +
								'delete from thirdPartyShipping where rateId = \'' + treeNode.data[1] + '\';']
							]
                            instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                                var f = JSON.parse(e.responseText);
                                if (f.method1.SqlCommand.error != 0) {
                                    alert(f.method1.SqlCommand.description);
                                } else {
                                    treeView.removeNode(node);
                                }
                            }, instance);
                            instance.confirmDelete.dialog.close();
                        },
                        onfalse: function () {
                            instance.confirmDelete.dialog.close();
                        },
                        title: Rendition.Localization['ShippingEditor_Confirm_Service_Delete'].Title,
                        subTitle: Rendition.Localization['ShippingEditor_Delete_Service'].Title,
                        message: Rendition.Localization['ShippingEditor_Are_you_sure_you_want_to_delete_this_service'].Title.replace('\n','<br>'),
                        dialogRect: { x: (document.documentElement.clientWidth * .5) - (450 * .5), y: 75, h: 173, w: 450 }
                    });
                }, false);
            }
            var ShippingType = Rendition.UI.ContextMenu(e, {
                elements: options,
                caller: this,
                type: 'mouse'
            });
        }
        e.preventDefault();
        treeView.preventDefault();
        treeView.highlightLabelText(labelText);
    }
    instance.init();
    return instance;
}