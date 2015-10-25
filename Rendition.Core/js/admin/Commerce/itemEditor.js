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
* Item editor.
* @constructor
* @name Rendition.Commerce.ItemEditor
*/
Rendition.Commerce.ItemEditor = function (args) {
    var instance = {}
    instance.tabOrder = {
        general: 0,
        images: 1,
        bom: 2,
        form: 3,
        inventory: 4,
        categories: 5,
        attachments: 6,
        vendors: 7,
        reviews: 8,
        seo: 9,
        stats: 10
    }
    if (args === undefined) { args = {} }
    if (args.itemNumber === undefined) {
        instance.newItem = true;
        args.itemNumber = '';
    }
    instance.itemVendorAssignmentGroup = function () {
        var a = [
			{
			    name: Rendition.Localization['ItemEditor_Vendor_Item_Information'].Title,
			    expanded: true,
			    inputs: [
					Rendition.Commerce.itemNumberInput(instance.itemNumber, 'localItemNumber', true, false),
					Rendition.Commerce.userIdFormInput('vendorId', true),
					{
					    columnName: 'description'
					},
					{
					    columnName: 'casePack'
					},
					{
					    columnName: 'innerPack'
					},
					{
					    columnName: 'minOrder'
					},
					{
					    columnName: 'price'
					}
				]
			}
		]
        return a;
    }
    instance.itemGrid = Rendition.UI.Grid({
        objectName: 'items',
        suffix: Rendition.UI.iif(instance.newItem, 'where itemNumber = \'' + Rendition.UI.createUUID() + '\'', 'where itemNumber = \'' + args.itemNumber.s() + '\'')
    });
    if (args.activeTab === undefined) { args.activeTab = 0; }
    if (args.parentNode === undefined) {
        instance.dialog = Rendition.UI.Dialog({
            rect: {
                x: Rendition.UI.dialogPosition.x,
                y: Rendition.UI.dialogPosition.y,
                h: document.documentElement.clientHeight - 50,
                w: 670
            },
            title: Rendition.Localization['ItemEditor_Item_editor_loading'].Title,
            rememberPosition: true,
            id: 'itemEditorAllByItself' + Rendition.UI.iif(Rendition.UI.deskStyle.dialogSizePreference == '1', String(args.itemNumber).toUpperCase(), '')
        });
        args.parentNode = instance.dialog.content;
    }
    instance.initURL = function () {
        return 'method1=["DataSet",["items","where itemNumber = \'' + args.itemNumber + '\'","1","1","",{},[],"JSON",true,"-1",false,\'\',\'\']]' +
		'&method2=["GetSqlArray", [{"commandText":"select upper(convert(varchar(50),sizeid)) as sizeid,size from sizes with (nolock) order by size;"}]]' +
		'&method3=["GetSqlArray", [{"commandText":"select upper(convert(varchar(50),swatchid)) as swatchid,description from swatches with (nolock) order by description;"}]]' +
		'&method4=["GetSqlArray", [{"commandText":"select upper(convert(varchar(50),divisionId)) as divisionId,divisionName from divisions with (nolock) order by divisionName;"}]]' +
		'&method5=["GetSqlArray", [{"commandText":"select upper(convert(varchar(50),categoryid)) as categoryId,category from Categories with (nolock) order by category;"}]]' +
		'&method7=["GetSqlArray", [{"commandText":"select upper(convert(varchar(50),flagTypeId)) as flagTypeId, flagTypeDesc from flagTypes with (nolock);"}]]' +
		'&method8=["GetItemImages", ["' + args.itemNumber + '"]]' +
		'&method9=["GetSqlArray", [{"commandText":"exec kitList \'' + args.itemNumber + '\',1"}]]' +
		'&method10=["Ls", ["forms/"]]' +
        '&method11=["defaultItem", []]';
    }
    instance.imgL = [["Listing", "m"], ["Cart", "c"], ["Full Size", "f"], ["Checkout", "t"], ["Packing Slip", "a"],
	["Invoice", "x"], ["Listing 2", "y"], ["Listing 3", "z"], ["Admin", "b"], ["Detail", "d"]];
    instance.bomInsertText = Rendition.Localization['ItemEditor_Insert_item'].Title;
    instance.bomNoKitText = Rendition.Localization['ItemEditor_No_Kit'].Title;
    instance.refresh = function () {
        Rendition.UI.wireupCloseEvents(instance.closeEditor, args.parentNode, true);
        args.parentNode.innerHTML = '';
        instance.init();
    }
    instance.getCategoryNameFromId = function (categoryId) {
        var l = instance.categories.length;
        for (var x = 0; l > x; x++) {
            if (instance.categories[x][0].toLowerCase() == categoryId.toLowerCase()) {
                return instance.categories[x][1].trim();
            }
        }
        return '';
    }
    instance.copyAnItem = function (itemNumberFrom, itemNumberTo) {
        /* TODO: copy an item to another item,
        create a new item or overwrite/update existing items */
        var req = [
		    'copyAnItem',
		    []
	    ];
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + req, function (e) {

        }, instance);
    }
    instance.init = function () {
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + instance.initURL(), function (e) {
            var a = JSON.parse(e.responseText);
            if (a.method1.DataSet.schema.records == 0 && instance.newItem === undefined) {
                alert(Rendition.Localization['ItemEditor_Item_does_not_exist'].Title.replace('{0}', args.itemNumber));
                instance.dialog.close();
                return;
            }
            instance.dataSet = a.method1.DataSet;
            instance.sizes = a.method2.GetSqlArray;
            instance.swatches = a.method3.GetSqlArray;
            instance.divisions = a.method4.GetSqlArray;
            instance.categories = a.method5.GetSqlArray;
            instance.flagTypes = a.method7.GetSqlArray;
            instance.bom = a.method9.GetSqlArray;
            instance.forms = a.method10.Ls.files;
            instance.defaultItem = a.method11.defaultItem;
            instance.recordIndex = 0;
            if (instance.newItem !== undefined) {
                instance.itemNumber = '';
                var newRecordRow = instance.itemGrid.newRecord({
                    homeAltCategory: Rendition.UI.emptyUUID,
                    homeCategory: Rendition.UI.emptyUUID,
                    swatchId: Rendition.UI.emptyUUID,
                    sizeId: Rendition.UI.emptyUUID,
                    divisionId: Rendition.UI.emptyUUID,
                    inventoryDepletesOnFlagId: Rendition.Commerce.initData.defaultInventoryDepletesOnFlagId,
                    inventoryRestockOnFlagId: Rendition.Commerce.initData.defaultInventoryRestockOnFlagId,
                    itemIsConsumedOnFlagId: Rendition.Commerce.initData.defaultItemIsConsumedOnFlagId,
                    revenueAccount: Rendition.Commerce.initData.defaultRevenueAccount,
                    expenseAccount: Rendition.Commerce.initData.defaultExpenseAccount,
                    inventoryAccount: Rendition.Commerce.initData.defaultExpenseInventoryAccount,
                    COGSAccount: Rendition.Commerce.initData.defaultInventoryCOGSAccount,
                    inventoryOperator: Rendition.Commerce.initData.defaultInventoryOperator
                });
                instance.dataSet = instance.itemGrid.dataSet;
                instance.dataSet.data[0] = newRecordRow;
                instance.rowIndex = instance.itemGrid.newRowIndex;
            } else {
                instance.rowIndex = 0;
                instance.itemNumber = instance.dataSet.data[instance.rowIndex][0];
            }
            instance.itemDetailFormGroup = [
				{
				    name: Rendition.Localization['ItemEditor_Componet_Item'].Title,
				    expanded: true,
				    inputs: [
						Rendition.Commerce.itemNumberInput('', 'subItemNumber', true, false, undefined, 'Item Number'),
						{
						    columnName: 'qty'
						},
						{
						    columnName: 'showAsSeperateLineOnInvoice'
						},
						{
						    columnName: 'onlyWhenSelectedOnForm'
						},
						{
						    columnName: 'itemComponetType'
						}
					]
				}
			]
            instance.itemFormStruct = {
                titleWidth: '155px',
                dataSet: instance.dataSet,
                groups: [
					{
					    name: Rendition.Localization['ItemEditor_General'].Title,
					    expanded: true,
					    inputs: [
							{
							    columnName: 'itemNumber',
							    autoComplete: {
							        mustMatchPattern: /[a-z 0-9]+/i,
							        patternMismatchMessage: Rendition.Localization['ItemEditor_Item_Number_can_only_contain'].Title,
							        patternMismatchTitle: Rendition.Localization['ItemEditor_Invalid_Item_Number'].Title
							    }
							},
							{
							    columnName: 'description'
							},
							{
							    columnName: 'quantifier'
							},
							{
							    columnName: 'weight',
							    numericupdown: {
							        min: 0,
							        max: 1000000000
							    }
							}
						]
					},
					{
					    name: Rendition.Localization['ItemEditor_Main_Description'].Title,
					    expanded: false,
					    inputs: [
							{
							    columnName: 'itemHTML',
							    inputType: 'rte'
							}
						]
					},
					{
					    name: Rendition.Localization['ItemEditor_Extended_Descriptions'].Title,
					    expanded: false,
					    inputs: [
							{
							    columnName: 'shortCopy'
							},
							{
							    displayName: 'Product Copy',
							    columnName: 'productCopy'
							},
							{
							    columnName: 'shortDescription'
							}
						]
					},
					{
					    name: Rendition.Localization['ItemEditor_Inventory_Control'].Title,
					    expanded: false,
					    inputs: [
							{
							    columnName: 'reorderPoint',
							    numericupdown: {
							        min: 0,
							        max: 1000000000
							    }
							},
							{
							    columnName: 'highThreshold',
							    numericupdown: {
							        min: 0,
							        max: 1000000000
							    }
							},
							{
							    columnName: 'allowPreorders'
							},
							Rendition.Commerce.userIdFormInput('inventoryOperator', false),
							{
							    columnName: 'inventoryDepletesOnFlagId',
							    inputType: 'select',
							    options: instance.flagTypes
							},
							{
							    columnName: 'inventoryRestockOnFlagId',
							    inputType: 'select',
							    options: instance.flagTypes
							},
							{
							    columnName: 'itemIsConsumedOnFlagId',
							    inputType: 'select',
							    options: instance.flagTypes
							},
							{
							    columnName: 'ratio',
							    numericupdown: {
							        min: 0,
							        max: 1000000000
							    }
							}
						]
					},
					{
					    name: Rendition.Localization['ItemEditor_Price_Lists'].Title,
					    expanded: false,
					    inputs: [
							{
							    columnName: 'price',
							    autoComplete: {
							        mustMatchPattern: /[0-9\.]+/i,
							        patternMismatchMessage: Rendition.Localization['ItemEditor_This_field_can_only_contain_whole_or_fractional_numbers'].Title,
							        patternMismatchTitle: Rendition.Localization['ItemEditor_Invalid_Number'].Title
							    }
							},
                            {
                                name: 'Sale Price',
                                columnName: 'salePrice',
                                autoComplete: {
                                    mustMatchPattern: /[0-9\.]+/i,
                                    patternMismatchMessage: Rendition.Localization['ItemEditor_This_field_can_only_contain_whole_or_fractional_numbers'].Title,
                                    patternMismatchTitle: Rendition.Localization['ItemEditor_Invalid_Number'].Title
                                }
                            },
							{
							    columnName: 'wholeSalePrice',
							    autoComplete: {
							        mustMatchPattern: /[0-9\.]+/i,
							        patternMismatchMessage: Rendition.Localization['ItemEditor_This_field_can_only_contain_whole_or_fractional_numbers'].Title,
							        patternMismatchTitle: Rendition.Localization['ItemEditor_Invalid_Number'].Title
							    }
							},
							{
							    name: Rendition.Localization['ItemEditor_On_Sale'].Title,
							    columnName: 'isOnSale'
							},
							{
							    grid: {
							        selectionMethod: 3,
							        editMode: 3,
							        objectName: 'userPriceList',
							        suffix: ' where itemnumber = \'' + instance.itemNumber + '\'',
							        genericEditor: true,
							        newRecord: {
							            userPriceListId: Rendition.UI.createUUID,
							            itemNumber: instance.itemNumber
							        },
							        editorParameters: {
							            groups: [
											{
											    name: Rendition.Localization['ItemEditor_User_Specific_Price'].Title,
											    expanded: true,
											    inputs: [
													Rendition.Commerce.userIdFormInput('userId'),
													{
													    columnName: 'price',
													    autoComplete: {
													        mustMatchPattern: /[0-9\.]+/i,
													        patternMismatchMessage: Rendition.Localization['ItemEditor_This_field_can_only_contain_whole_or_fractional_numbers'].Title,
													        patternMismatchTitle: Rendition.Localization['ItemEditor_Invalid_Number'].Title
													    }
													},
													{
													    columnName: 'fromDate',
													    inputType: 'calendar'
													},
													{
													    columnName: 'toDate',
													    inputType: 'calendar'
													}
												]
											},
											{
											    name: Rendition.Localization['ItemEditor_Comments'].Title,
											    expaneded: true,
											    inputs: [
													{
													    columnName: 'comments',
													    inputType: 'rte'
													}
												]
											}
										]
							        }
							    }
							}
						]
					},
					{
					    name: Rendition.Localization['ItemEditor_Properties'].Title,
					    expanded: false,
					    inputs: [
							{
							    grid: {
							        selectionMethod: 3,
							        editMode: 3,
							        objectName: 'itemProperties',
							        suffix: ' where itemnumber = \'' + instance.itemNumber + '\'',
							        contextMenuOptions: instance.propertyContextMenuOptions,
							        genericEditor: true,
							        newRecord: {
							            itemPropertyId: Rendition.UI.createUUID,
							            itemNumber: instance.itemNumber
							        },
							        editorParameters: {
							            groups: [
											{
											    name: Rendition.Localization['ItemEditor_Item_Property'].Title,
											    expanded: true,
											    inputs: [
													{
													    columnName: 'itemProperty',
													    autoComplete: {
													        mustMatchPattern: /.+/i,
													        patternMismatchMessage: Rendition.Localization['ItemEditor_This_field_must_contain_a_value'].Title,
													        patternMismatchTitle: Rendition.Localization['ItemEditor_Invalid_value'].Title,
													        objectName: 'itemProperties',
													        suffix: 'where itemProperty like \'%<value>%\'',
													        autoComplete: true,
													        optionDisplayValue: '<column2>',
													        optionValue: '<column2>'
													    }
													},
													{
													    columnName: 'propertyValue',
													    autoComplete: {
													        mustMatchPattern: /.+/i,
													        patternMismatchMessage: Rendition.Localization['ItemEditor_This_field_must_contain_a_value'].Title,
													        patternMismatchTitle: Rendition.Localization['ItemEditor_Invalid_value'].Title,
													        objectName: 'itemProperties',
													        suffix: 'where propertyValue like \'%<value>%\'',
													        autoComplete: true,
													        optionDisplayValue: '<column3>',
													        optionValue: '<column3>'
													    }
													},
													{
													    columnName: 'displayValue',
													    autoComplete: {
													        mustMatchPattern: /.+/i,
													        patternMismatchMessage: Rendition.Localization['ItemEditor_This_field_must_contain_a_value'].Title,
													        patternMismatchTitle: Rendition.Localization['ItemEditor_Invalid_value'].Title,
													        objectName: 'itemProperties',
													        suffix: 'where displayValue like \'%<value>%\'',
													        autoComplete: true,
													        optionDisplayValue: '<column4>',
													        optionValue: '<column4>'
													    }
													},
													{
													    columnName: 'valueOrder'
													},
													{
													    columnName: 'price'
													},
													{
													    columnName: 'BOMItem'
													},
													{
													    columnName: 'taxable'
													},
													{
													    columnName: 'showAsSeperateLineOnInvoice'
													},
													{
													    columnName: 'showInFilter'
													}
												]
											}
										]
							        }
							    }
							}
						]
					},
					{
					    name: Rendition.Localization['ItemEditor_Miscellaneous'].Title,
					    expanded: false,
					    inputs: [
							{
							    columnName: 'BOMOnly'
							},
							{
							    columnName: 'noTax'
							},
							{
							    columnName: 'freeShipping'
							},
							{
							    inputType: 'select',
							    columnName: 'homeCategory',
							    options: instance.categories
							},
							{
							    inputType: 'select',
							    columnName: 'homeAltCategory',
							    options: instance.categories
							},
							{
							    columnName: 'displayPrice'
							},
							{
							    columnName: 'searchPriority',
							    numericupdown: {
							        min: 0,
							        max: 100000
							    }
							},
							{
							    inputType: 'select',
							    columnName: 'swatchId',
							    options: instance.swatches
							},
							{
							    columnName: 'sizeId',
							    inputType: 'select',
							    options: instance.sizes
							},
							{
							    columnName: 'parentItemNumber',
							    inputSelectButton: {
							        mustMatchPattern: undefined,
							        patternMismatchMessage: Rendition.Localization['ItemEditor_This_field_cannot_be_blank'].Title,
							        patternMismatchTitle: Rendition.Localization['ItemEditor_Invalid_value'].Title,
							        objectName: 'shortItemList',
							        mustMatchRecord: false,
							        matchSuffix: 'where itemnumber = \'<value>\'',
							        autoComplete: true,
							        optionDisplayValue: '<column0> - <column1>',
							        optionValue: '<column0>'
							    }
							},
							Rendition.Commerce.userIdFormInput('revenueAccount', false),
							Rendition.Commerce.userIdFormInput('expenseAccount', false),
							Rendition.Commerce.userIdFormInput('inventoryAccount', false),
							Rendition.Commerce.userIdFormInput('COGSAccount', false),
							{
							    columnName: 'SKU'
							},
							{
							    columnName: 'itemType',
							    inputType: 'select',
							    options: [
									[0, Rendition.Localization['ItemEditor_Inventory_Part'].Title],
									[1, Rendition.Localization['ItemEditor_Non_Inventory_Part'].Title],
									[2, Rendition.Localization['ItemEditor_Service'].Title],
									[3, Rendition.Localization['ItemEditor_Assembly_Item'].Title],
									[4, Rendition.Localization['ItemEditor_Generic'].Title]
								]
							},
							{
							    inputType: 'select',
							    columnName: 'divisionId',
							    options: instance.divisions
							}
						]
					}
				]
            }
            instance.bomCutter = Rendition.UI.CutterBar({
                position: 155,
                autoResize: false
            });
            instance.formCutter = Rendition.UI.CutterBar({
                position: 65,
                autoResize: false,
                orientation: 1
            });
            instance.initImages(a.method8.GetItemImages);
            instance.initBomTreeView(instance.bomCutter.cutters[0]);
            instance.initForms(instance.formCutter.cutters[0]);
            var bomGridOptions = {
                selectionMethod: 3,
                editMode: 3,
                objectName: 'itemDetail',
                suffix: ' where itemnumber = \'' + instance.itemNumber + '\'',
                genericEditor: true,
                newRecord: {
                    userPriceListId: Rendition.UI.createUUID,
                    itemNumber: instance.itemNumber
                }
            }
            instance.bomGrid = Rendition.UI.Grid(bomGridOptions);
            instance.attachments = Rendition.UI.Grid({
                selectionMethod: 3,
                editMode: 3,
                objectName: 'attachments',
                suffix: ' where referenceId = \'' + instance.itemNumber + '\' and referenceType = \'itemNumber\'',
                genericEditor: true,
                editorParameters: Rendition.Commerce.attachmentFormparams(''),
                newRecord: {
                    referenceId: instance.itemNumber,
                    path: '',
                    referenceType: 'itemNumber'
                },
                contextMenuOptions: function (e, obj) { return Rendition.UI.DownloadAttachmentContextMenu(e, obj, instance.attachments); }
            });
            instance.vendors = Rendition.UI.Grid({
                selectionMethod: 3,
                editMode: 3,
                objectName: 'itemVendorAssignment',
                suffix: ' where localItemNumber = \'' + instance.itemNumber + '\' ',
                genericEditor: true,
                editorParameters: instance.itemVendorAssignmentGroup,
                newRecord: {
                    localItemNumber: instance.itemNumber,
                    minOrder: 1
                }
            });
            instance.reviews = Rendition.UI.Grid({
                selectionMethod: 3,
                editMode: 3,
                objectName: 'reviews',
                suffix: ' where refType = \'itemNumber\' and refId = \'' + instance.itemNumber + '\' ',
                genericEditor: true,
                hideNewRow: true
            });
            instance.form = Rendition.UI.Form(instance.itemFormStruct);
            Rendition.UI.appendEvent('resize', instance.form, instance.resizeArtboard, false);
            instance.tabs = [];
            instance.tabs[instance.tabOrder.general] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ItemEditor_General'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML == '') {
                        content.style.overflow = 'scroll';
                        instance.form.appendTo(content);
                    }
                }
            });
            instance.tabs[instance.tabOrder.images] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ItemEditor_Images'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newItem === undefined) {
                        if (content.innerHTML == '') {
                            content.style.overflow = 'hidden';
                            instance.imageContent = content;
                            content.appendChild(instance.imageArtboard);
                        }
                        instance.resizeArtboard();
                    } else {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['ItemEditor_You_can_access_this_tab_after_you_save_your_item_for_the_first_time'].Title);
                    }
                }
            });
            instance.tabs[instance.tabOrder.bom] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ItemEditor_Assembly'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newItem === undefined) {
                        if (content.innerHTML == '') {
                            content.style.overflow = 'hidden';
                            instance.bomCutter.appendTo(content);
                        }
                    } else {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['ItemEditor_You_can_access_this_tab_after_you_save_your_item_for_the_first_time'].Title);
                    }
                }
            });
            instance.tabs[instance.tabOrder.form] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ItemEditor_Form'].Title,
                load: function (tab, tabBar, content) {
                    if (content.innerHTML == '') {
                        content.style.overflow = 'hidden';
                        instance.formCutter.appendTo(content);
                    }
                }
            });
            instance.tabs[instance.tabOrder.inventory] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ItemEditor_Inventory'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newItem === undefined) {
                        if (content.innerHTML == '') {
                            content.style.overflow = 'hidden';
                            instance.inventoryChart = Rendition.UI.DateChart({
                                parentNode: content,
                                title: Rendition.Localization['ItemEditor_Inventory_Levels'].Title,
                                type: 'TicChart',
                                options: {
                                    nodeLabelFormat: "f0"
                                },
                                chart: function (dateChart, chartArguments, chartOptions) {
                                    var f = "exec itemInventoryplot \
								'" + instance.itemNumber.s() + "',\
								'" + chartArguments.fromDate.value.s() + " 00:00:00.000',\
								'" + chartArguments.toDate.value.s() + " 23:59:59.999';";
                                    return f;
                                }
                            });
                            instance.inventoryChart.chart.refresh();
                        }
                    } else {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['ItemEditor_You_can_access_this_tab_after_you_save_your_item_for_the_first_time'].Title);
                    }
                }
            });
            instance.tabs[instance.tabOrder.categories] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ItemEditor_Categories'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newItem === undefined) {
                        content.style.overflow = 'hidden';
                        instance.categoryGrid = Rendition.UI.Grid({
                            selectionMethod: 3,
                            editMode: 3,
                            objectName: 'categoryDetail',
                            suffix: ' where itemnumber = \'' + instance.itemNumber.s() + '\'',
                            parentNode: content,
                            cellstyle: function (e, grid, element, row, column, selection, data, header) {
                                if (header === undefined || data === null) { return }
                                element.textContent = Rendition.UI.truncateText(instance.getCategoryNameFromId(data[1]), grid.headers[column].width);
                                return;
                            },
                            editstart: function (e, grid, element, row, column, selection, data, header) {
                                var newRecordRow = grid.newRecord({
                                    categoryDetailId: Rendition.UI.createUUID,
                                    categoryId: Rendition.UI.emptyUUID,
                                    itemNumber: instance.itemNumber,
                                    listOrder: '0',
                                    childCategoryId: Rendition.UI.emptyUUID
                                });
                                var gridFormGroup = [
									{
									    name: Rendition.Localization['ItemEditor_Add_Item_to_Category_'].Title,
									    expanded: true,
									    inputs: [
											{
											    grid: {
											        selectionMethod: 3,
											        editMode: 0,
											        objectName: 'categories',
											        orderBy: 'category',
											        orderDirection: 'asc'
											    }
											}
										]
									}
								]
                                var formparams = {
                                    dataSet: grid.dataSet,
                                    groups: gridFormGroup,
                                    callbackProcedure: function () {
                                        instance.categoryGrid.refresh();
                                        return;
                                    }
                                }
                                var editor = grid.genericEditor(grid.newRowIndex, formparams, newRecordRow);
                                editor.submitButton.onclick = function () {
                                    var grid = editor.grids[0];
                                    var l = grid.selectedRows.length;
                                    if (l == 0) {
                                        alert(Rendition.Localization['ItemEditor_Select_one_or_more_rows__Select_multiple_rows_by_holding_ctrl_or_shift_while_clicking'].Title);
                                    } else {
                                        var rows = [];
                                        for (var x = 0; l > x; x++) {
                                            var i = grid.getRecord(grid.selectedRows[x])[0];
                                            rows.push(i);
                                        }
                                    }
                                    var req = [
										'SqlCommand',
										['insertItemIntoCategories \'' + rows.join(',') + '\', \'' + instance.itemNumber.s() + '\'']
									]
                                    var req2 = [
										'RefreshCategoriesCache',
										[]
									]
                                    instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI +
									Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI() +
									'&method2=' + JSON.stringify(req2).toURI(), function (e) {
									    var f = JSON.parse(e.responseText);
									    if (f.method1.SqlCommand.error != 0) {
									        alert(f.method1.SqlCommand.description);
									    } else {
									        editor.dialog.close();
									        instance.categoryGrid.refresh();
									    }
									}, instance);
                                    return;
                                }
                                grid.preventDefault();
                                return;
                            }
                        });
                    } else {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['ItemEditor_You_can_access_this_tab_after_you_save_your_item_for_the_first_time'].Title);
                    }
                }
            });
            instance.tabs[instance.tabOrder.attachments] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ItemEditor_Attachments'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newItem === undefined) {
                        content.innerHTML = ''
                        content.style.overflow = 'hidden';
                        instance.attachments.appendTo(content);
                    } else {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['ItemEditor_You_can_access_this_tab_after_you_save_your_item_for_the_first_time'].Title);
                    }
                }
            });
            instance.tabs[instance.tabOrder.vendors] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ItemEditor_Vendors'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newItem === undefined) {
                        instance.vendors.appendTo(content);
                    } else {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['ItemEditor_You_can_access_this_tab_after_you_save_your_item_for_the_first_time'].Title);
                    }
                }
            });
            instance.tabs[instance.tabOrder.reviews] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ItemEditor_Reviews'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newItem === undefined) {
                        instance.reviews.appendTo(content);
                    } else {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['ItemEditor_You_can_access_this_tab_after_you_save_your_item_for_the_first_time'].Title);
                    }
                }
            });
            instance.tabs[instance.tabOrder.seo] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['ItemEditor_Seo'].Title,
                load: function (tab, tabBar, content) {
                    content.innerHTML = '';
                    if (instance.newItem === undefined) {
                        instance.seo = Rendition.Commerce.Seo({
                            URL: '/detail.aspx?item=' + instance.itemNumber,
                            parentNode: content,
                            trackingSearch: instance.itemNumber
                        });
                    } else {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['ItemEditor_You_can_access_this_tab_after_you_save_your_item_for_the_first_time'].Title);
                    }
                }
            });
            instance.save = function () {
                if (instance.form.isValid()) {
                    if (!instance.newItem) {
                        instance.form.save(undefined, undefined, function () {
                            instance.refreshThisItem();
                            instance.updateCategoryCache();
                        }, false);
                    } else {
                        var itemNumber = instance.form.getInputByName('itemNumber').value;
                        Rendition.UI.removeEvent('close', instance.dialog, instance.closeEditor, false);
                        // must hide or RTEs will lose their input values
                        instance.dialog.hide();
                        instance.cacheRefreshDialog = Rendition.UI.UpdateDialog({
                            title: Rendition.Localization['ItemEditor_Creating_new_item'].Title,
                            subTitle: Rendition.Localization['ItemEditor_Creating_new_item'].Title,
                            message: Rendition.Localization['ItemEditor_Please_wait_while_site_cache_is_refreshed'].Title
                        });
                        instance.form.save(true, 1, function () {
                            // now we can close it
                            instance.dialog.close();
                            instance.refreshSiteItems(function () {
                                instance.cacheRefreshDialog.close();
                                Rendition.Commerce.ItemEditor({ itemNumber: itemNumber });
                                instance.updateCategoryCache();
                            });
                        });
                    }
                } else {
                    instance.form.showValidationMessage();
                }
            }
            instance.menuBarElements = [];
            instance.menuBarElements[0] = Rendition.UI.MenuOption();
            instance.menuBarElements[0].text = Rendition.UI.iif(instance.newItem, 'Save New Item', 'Save Item');
            Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
                instance.save();
                return false;
            }, false);
            if (instance.newItem === undefined) {
                instance.menuBarElements[1] = Rendition.UI.MenuOption();
                instance.menuBarElements[1].text = Rendition.Localization['ItemEditor_Open_Another_Item'].Title;
                Rendition.UI.appendEvent('click', instance.menuBarElements[1], function (e) {
                    Rendition.UI.SelectButtonDialog({
                        objectName: 'shortItemList',
                        ordinal: 0,
                        inputTitle: Rendition.Localization['ItemEditor_Item_Number'].Title,
                        boxTitle: Rendition.Localization['ItemEditor_Enter_an_Item_Number'].Title,
                        title: Rendition.Localization['ItemEditor_Enter_or_browse_for_an_Item_Number'].Title,
                        callbackProcedure: function (e) {
                            Rendition.UI.removeEvent('close', instance.dialog, instance.closeEditor, false);
                            instance.dialog.close();
                            Rendition.Commerce.ItemEditor({ itemNumber: e.selectedValue });
                        }
                    });
                    return false;
                }, false);
                instance.menuBarElements[2] = Rendition.UI.MenuOption();
                instance.menuBarElements[2].text = Rendition.Localization['ItemEditor_Refresh'].Title;
                Rendition.UI.appendEvent('click', instance.menuBarElements[2], function (e) {
                    instance.refresh();
                    return false;
                }, false);
                instance.menuBarElements[3] = Rendition.UI.MenuOption();
                instance.menuBarElements[3].text = Rendition.Localization['ItemEditor_DupItem'].Title;
                Rendition.UI.appendEvent('click', instance.menuBarElements[3], function (e) {
                    instance.duplicateItem();
                    return false;
                }, false);
            }
            /* check if there are any more menus to add */
            for (var x = 0; Rendition.Commerce.itemEditorMenus.length > x; x++) {
                var arr = Rendition.Commerce.itemEditorMenus[x].apply(instance, [instance, instance.menuBarElements]);
                if (arr !== undefined) {
                    instance.menuBarElements.push(arr);
                }
            }
            instance.menuBar = Rendition.UI.MenuBar({
                options: instance.menuBarElements,
                parentNode: args.parentNode
            });
            /* check if there are any more tabs to add */
            for (var x = 0; Rendition.Commerce.itemEditorTabs.length > x; x++) {
                var arr = Rendition.Commerce.itemEditorTabs[x].apply(instance, [instance, instance.tabs]);
                if (arr !== undefined) {
                    instance.tabs.push(arr);
                }
            }
            instance.tabbar = Rendition.UI.TabBar({
                tabs: instance.tabs,
                parentNode: args.parentNode,
                activeTabIndex: args.activeTab,
                offsetRect: { x: 0, y: instance.menuBar.style.rect.h, h: 0, w: 0 }
            });
            instance.tabbar.tabs[0].activate();
            if (instance.dialog) {
                instance.dialog.title(Rendition.Localization['ItemEditor_Item_Editor'].Title.replace('{0}', instance.itemNumber))
            }
            if (instance.dialog) {
                Rendition.UI.wireupCloseEvents(instance.closeEditor, args.parentNode);
            }
            // init events
            for (var x = 0; Rendition.Commerce.itemEditorInitEvents.length > x; x++) {
                Rendition.Commerce.itemEditorInitEvents[x].apply(instance, [instance]);
            }
        }, instance);
    }
    instance.closeEditor = function (e, dialog) {
        var cleanYesNo = function (e, genForm) {
            Rendition.UI.removeEvent('close', dialog, instance.closeEditor, false);
            dialog.close();
        }
        instance.form.checkSaveState({
            no: cleanYesNo,
            yes: cleanYesNo,
            clean: cleanYesNo
        });
        dialog.preventDefault();
    }
    instance.duplicateItem = function () {
        instance.dupDialog = Rendition.UI.Dialog({
            rect: {
                x: Rendition.UI.dialogPosition.x,
                y: Rendition.UI.dialogPosition.y,
                h: 143,
                w: 310
            },
            modal: true,
            title: Rendition.Localization['ItemEditor_DupItem'].Title
        });
        instance.dupTarget = document.createElement('input');
        instance.dupButton = document.createElement('button');
        instance.dupButton.innerHTML = Rendition.Localization['ItemEditor_DupItem_DupSubmit'].Title;
        instance.dupButton.style.cssFloat = 'right';
        instance.dupButton.style.margin = '4px';
        instance.dupPairTable = Rendition.UI.pairtable({
            rows: [
			    [Rendition.UI.txt(Rendition.Localization['ItemEditor_DupItem_Enter_Number'].Title), instance.dupTarget]
		    ]
        });
        instance.dupGroupBox = Rendition.UI.GroupBox({
            title: Rendition.Localization['ItemEditor_DupItem_Enter_Number'].Title,
            childNodes: [instance.dupPairTable.table],
            expanded: true,
            parentNode: instance.dupDialog.content
        });
        instance.dupDialog.content.appendChild(instance.dupButton);
        instance.dupButton.onclick = function () {
            var req = [
				'DuplicateItem',
				[
					{
					    source: instance.itemNumber,
					    target: instance.dupTarget.value
					}
				]
			]
            instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req), function (e) {
                var a = JSON.parse(e.responseText);
                instance.dupDialog.close();
                instance.bomItemEditor = Rendition.Commerce.ItemEditor({ itemNumber: instance.dupTarget.value });
                return;
            }, instance);
        }
    }
    instance.bomTreeContextMenu = function (e, treeView, node, labelText, treeNode) {
        if (instance.itemNumber == treeNode.value) { return; }
        var options = [];
        var optionIndex = -1;
        if (treeNode.text != instance.bomInsertText &&
			treeNode.text != instance.bomNoKitText && treeNode.text != instance.itemNumber) {
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = Rendition.Localization['ItemEditor_Remove_From_Kit'].Title;
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                var url = 'method2=["SqlCommand", ["delete from itemdetail where itemDetailId = \'' + treeNode.data[0] + '\';"]]' +
					'&method9=["GetSqlArray", [{"commandText":"exec kitList \'' + instance.itemNumber + '\',1"}]]';
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                    var a = JSON.parse(e.responseText);
                    instance.bom = a.method9.GetSqlArray;
                    node.refreshParent();
                    return;
                }, instance);
            }, false);
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = Rendition.Localization['ItemEditor_Open_Item_in_Another_Window'].Title;
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                instance.bomItemEditor = Rendition.Commerce.ItemEditor({
                    itemNumber: treeNode.value
                });
            }, false);
            optionIndex++;
            options[optionIndex] = Rendition.UI.MenuOption();
            options[optionIndex].text = Rendition.Localization['ItemEditor_Change_Kit_Content'].Title;
            Rendition.UI.appendEvent('click', options[optionIndex], function () {
                var p = {
                    dataSet: {
                        schema: instance.bomGrid.dataSet.schema,
                        header: instance.bomGrid.dataSet.header,
                        data: [treeNode.data]
                    },
                    groups: instance.itemDetailFormGroup,
                    callbackProcedure: function () {
                        node.refreshParent();
                        return;
                    }
                }
                instance.bomGrid.genericEditor(instance.bomGrid.newRowIndex, p);
            }, false);
        }
        if (options.length > 0) {
            var menu = Rendition.UI.ContextMenu(e, {
                elements: options,
                caller: this,
                type: 'mouse'
            });
            e.preventDefault();
            treeView.preventDefault();
            treeView.highlightLabelText(labelText);
        }
    }
    instance.bomTreeLabelClick = function (e, treeView, node, labelText, treeNode) {
        if (treeNode.text != instance.bomInsertText &&
			treeNode.text != instance.bomNoKitText) {
            instance.bomCutter.cutters[1].innerHTML = '';
            if (treeNode.value == instance.itemNumber) {
                instance.bomGrid.appendTo(instance.bomCutter.cutters[1]);
            } else {
                instance.bomCutter.cutters[1].innerHTML = '';
                instance.bomItemEditor = Rendition.Commerce.ItemEditor({
                    itemNumber: treeNode.value,
                    parentNode: instance.bomCutter.cutters[1]
                });
            }
        } else {
            var itemNumberHeader = Rendition.UI.getHeaderByName(instance.bomGrid.dataSet, 'itemNumber');
            var qtyHeader = Rendition.UI.getHeaderByName(instance.bomGrid.dataSet, 'qty');
            var data = Rendition.UI.createDefaultRow(instance.bomGrid.dataSet.header);
            data[itemNumberHeader.index] = treeNode.value;
            data[qtyHeader.index] = 1;
            var p = {
                dataSet: {
                    schema: instance.bomGrid.dataSet.schema,
                    header: instance.bomGrid.dataSet.header,
                    data: [data]
                },
                groups: instance.itemDetailFormGroup,
                callbackProcedure: function () {
                    instance.bomCutter.cutters[1].innerHTML = '';
                    instance.initBomTreeView(instance.bomCutter.cutters[1]);
                    node.refreshParent();
                    return;
                }
            }
            instance.bomGrid.genericEditor(instance.bomGrid.newRowIndex, p);
        }
    }
    instance.bomTreeObject = function (data) {
        var childNodes = [];
        var l = data.length;
        if (l != 0) {
            for (var x = 0; l > x; x++) {
                var req = [
					"DataSet",
					['itemDetail', 'where itemNumber = \'' + data[x][2] + '\'', '0', '9999999', '', {}, [], 'JSON', true, '-1', false, 'subItemNumber', 'desc']
				]
                childNodes.push({
                    text: (data[x][3] + ' x <img style="margin-bottom:-4px;" src="img/icons/tag_blue.png"> ' + data[x][2]),
                    value: data[x][2],
                    childNodes: {
                        url: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req),
                        callbackArguments: [String(data[x][2])],
                        callbackProcedure: function (_id, json, tree, node) {
                            var a = json.method1.DataSet;
                            if (a.error == 0) {
                                var treeObj = instance.bomTreeObject(a.data);
                                var l = treeObj.length;
                                while (node.firstChild) { node.removeChild(node.firstChild) }
                                for (var x = 0; l > x; x++) {
                                    tree.add(treeObj[x], node);
                                }
                                tree.add({
                                    text: instance.bomInsertText,
                                    value: _id,
                                    childNodes: [],
                                    data: [_id]
                                }, node);
                            } else {
                                instance.errorMessage(a);
                                tree.preventDefault();
                            }
                            return false;
                        }
                    },
                    data: data[x]
                });
            }
        }
        return childNodes;
    }
    instance.initImages = function (e) {
        /* create the add images button */
        instance.images = e;
        instance.imageArtboard = document.createElement('div');
        instance.imageArtboard.className = 'item_image_artboard ui-corner-all';
        var i = document.createElement('button');
        i.onclick = function () {
            instance.uploadDialog = Rendition.UI.UploadDialog({
                callbackProcedure: function (uploadDialog, returnparams) {
                    /* open the hourglass dialog */
                    var imageUpdateDialog = Rendition.UI.UpdateDialog();
                    var fs = [];
                    var fd = [];
                    var h = returnparams.uploadedFiles.length;
                    for (var x = 0; h > x; x++) {
                        /* add the image method */
                        fs.push(
							Rendition.UI.iif(x == 0, '', '&') + 'method' + (x + 1) + '=' +
							JSON.stringify(['AddItemImage', [instance.itemNumber, returnparams.uploadedFiles[x]]]).toURI()
						);
                        /* then remove the uploaded image method */
                        fd.push(
							Rendition.UI.iif(x == 0, '', '&') + 'method' + (x + 1) + '=' +
							JSON.stringify(['Rm', [returnparams.uploadedFiles[x]]]).toURI()
						);
                    }
                    /* then update the item so it knows its timestamp has changed method */
                    var reqX1 = [
						"DataSet",
						["items", "where itemNumber = '" + instance.itemNumber + "'", '1', '1', "", {}, [], "JSON", true, '-1', false, "", ""]
					]
                    /* then refresh the list of images method */
                    var reqX2 = [
						"GetItemImages",
						[
							instance.itemNumber
						]
					]
                    var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI +
					fs.join('') +
					'&method' + (h + 1) + '=' + JSON.stringify(reqX1).toURI() +
					'&method' + (h + 2) + '=' + JSON.stringify(reqX2).toURI(), function (e) {
					    var a = JSON.parse(e.responseText);
					    for (var x = 0; h > x; x++) {
					        /* check for any errors */
					        var u = a['method' + (x + 1)];
					        if (u.error !== undefined) {
					            alert(u.description);
					            continue;
					        }
					        if (u.AddItemImage.error != 0) {
					            alert(u.AddItemImage.description);
					            continue;
					        }
					    }
					    /* and the last two methods refresh data -  */
					    instance.dataSet = a['method' + (h + 1)].DataSet;
					    /* set the hidden image selectors */
					    var di = function (colName) {
					        return instance.dataSet.data[0][Rendition.UI.getHeaderByName(instance.dataSet, colName).index];
					    }
					    instance.form.getInputByName('m').value = di('m');
					    instance.form.getInputByName('c').value = di('c');
					    instance.form.getInputByName('f').value = di('f');
					    instance.form.getInputByName('t').value = di('t');
					    instance.form.getInputByName('a').value = di('a');
					    instance.form.getInputByName('x').value = di('x');
					    instance.form.getInputByName('y').value = di('y');
					    instance.form.getInputByName('z').value = di('z');
					    instance.form.getInputByName('b').value = di('b');
					    instance.form.getInputByName('d').value = di('d');
					    /* set the items timestamp to be the new timestamp */
					    instance.form.getInputByName('VerCol').value = instance.dataSet.data[0][instance.dataSet.data[0].length - 1];
					    /* refresh image display */
					    instance.initImages(a['method' + (h + 2)].GetItemImages);
					    instance.imageContent.innerHTML = '';
					    instance.imageContent.appendChild(instance.imageArtboard);
					    instance.form.resize();
					    /* execute the delete uploaded files method */
					    Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + fd.join(''), function (e) { return; }, instance);
					    /* close the hourglass dialog */
					    imageUpdateDialog.close();
					}, instance);
                }
            });
        }
        i.className = 'item_image_button ui-corner-all';
        i.innerHTML = '<div>' + Rendition.Localization['ItemEditor_Add_A_New_Image'].Title + '</div>';
        instance.imageArtboard.appendChild(i);
        var l = instance.images.length;
        if (l) {
            var imgButton = document.createElement('button');
            imgButton.className = 'item_image_button ui-corner-all';
            imgButton.innerHTML = '<div>' + Rendition.Localization['ItemEditor_Recreate_All_Images'].Title + '</div>';
            imgButton.style.cssFloat = 'left';
            imgButton.style.height = '137px';
            imgButton.style.marginTop = '150px';
            imgButton.style.marginLeft = '-180px';
            i.style.height = '137px';
            imgButton.onclick = function () {
                instance.renderThisItemsImages();
            }
            instance.imageArtboard.appendChild(imgButton);
        }
        /* add the images to the image list */
        if (instance.images === undefined) {
            return;
        }
        for (var x = 0; l > x; x++) {
            var i = document.createElement('div');
            i.className = 'item_image_button ui-corner-all';
            var img = new Image();
            img.src = '/img/items/' + instance.itemNumber + '/' + instance.images[x].src;
            img.className = 'item_image_image';
            img.fileName = +instance.images[x].src;
            img.length = instance.images[x].fileSize;
            img.orginalFileName = instance.images[x].fileName;
            var nfo = document.createElement('div');
            var name = document.createElement('div');
            img.nfo = nfo;
            nfo.className = 'image_info ui-corner-all';
            name.className = 'item_image_name';
            name.textContent = Rendition.UI.truncateText(instance.images[x].fileName, 100);
            name.title = instance.images[x].fileName;
            nfo.textContent = Rendition.Localization['ItemEditor_Loading'].Title;
            i.appendChild(name);
            i.appendChild(img);
            i.appendChild(nfo);
            Rendition.UI.appendEvent('load', img, function () {
                this.nfo.title = Rendition.Localization['ItemEditor_Orignal_Name_File_Name'].Title.replace('{0}', this.orginalFileName).replace('{1}', this.fileName);
                this.nfo.innerHTML = this.naturalWidth + 'x' + this.naturalHeight + ' - ' + Rendition.UI.addCommas(this.length) + ' bytes';
            }, false);
            var openImage = document.createElement('button');
            openImage.className = 'item_image_function_button';
            var deleteImage = document.createElement('button');
            deleteImage.setAttribute('imagingId', instance.images[x].imagingId);
            deleteImage.className = 'item_image_function_button';
            var assignImage = document.createElement('button');
            assignImage.setAttribute('imagingId', instance.images[x].imagingId);
            assignImage.className = 'item_image_function_button';
            var renderImage = document.createElement('button');
            renderImage.setAttribute('imagingId', instance.images[x].imagingId);
            renderImage.className = 'item_image_function_button';
            i.appendChild(openImage);
            i.appendChild(deleteImage);
            i.appendChild(assignImage);
            i.appendChild(renderImage);
            openImage.innerHTML = Rendition.Localization['ItemEditor_View_Image'].Title;
            deleteImage.innerHTML = Rendition.Localization['ItemEditor_Remove_Image'].Title;
            assignImage.innerHTML = Rendition.Localization['ItemEditor_Assign_Image'].Title;
            renderImage.innerHTML = Rendition.Localization['ItemEditor_Recreate_Images'].Title;
            openImage.src = String(img.src);
            openImage.onclick = img.onclick = function () {
                var newImageViewer = Rendition.UI.ImageViewer({ src: this.src });
            }
            assignImage.onclick = instance.assignImage;
            deleteImage.onclick = instance.deleteImage;
            renderImage.onclick = function () {
                instance.renderThisImage(this.getAttribute('imagingId'));
            }
            instance.imageArtboard.appendChild(i);
        }
    }
    instance.checkIfIsLocation = function (imgId, loc) {
        var l = instance.imgL.length;
        for (var x = 0; l > x; x++) {
            var header = Rendition.UI.getHeaderByName(instance.dataSet, instance.imgL[x][1]);
            fId = String(instance.dataSet.data[0][header.index]).toLowerCase();
            if (fId == imgId.toLowerCase() && loc == instance.imgL[x][1]) {
                return true;
            }
        }
        return false;
    }
    instance.initBomTreeView = function (appendTo) {
        var rootdata = instance.bomTreeObject([[null, null, instance.itemNumber, 1]])[0];
        instance.bomTreeView = Rendition.UI.TreeView({
            parentNode: appendTo,
            rootNode: rootdata,
            includeRoot: true,
            labelclick: instance.bomTreeLabelClick,
            labelcontextmenu: instance.bomTreeContextMenu
        });
    }
    instance.assignImage = function (e) {
        var imagingId = this.getAttribute('imagingId');
        var l = instance.imgL.length;
        var optionLength = -1;
        var options = [];
        for (var x = 0; l > x; x++) {
            optionLength++;
            var isChecked = instance.checkIfIsLocation(imagingId, String(instance.imgL[x][1]));
            options[optionLength] = Rendition.UI.MenuOption();
            options[optionLength].text = String(instance.imgL[x][0]);
            options[optionLength].location = String(instance.imgL[x][1]);
            options[optionLength].checked = isChecked;
            options[optionLength].location = String(instance.imgL[x][1]);
            options[optionLength].imagingId = String(imagingId);
            options[optionLength].hasIcon = true;
            Rendition.UI.appendEvent('click', options[optionLength], function () {
                var location = this.option.location;
                var id = this.option.imagingId;
                var url = 'method2=["SqlCommand",["update items set ' + location + ' = \'' + id + '\' where itemnumber = \'' + instance.itemNumber + '\';"]]' +
				'&method1=["DataSet",["items","where itemNumber = \'' + instance.itemNumber + '\'","1","1","",{},[],"JSON",true,"-1",false,\'\',\'\']]';
                instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
                    var a = JSON.parse(e.responseText);
                    instance.dataSet = a.method1.DataSet;
                    instance.form.getInputByName('VerCol').value = instance.dataSet.data[0][instance.dataSet.data[0].length - 1];
                    instance.form.getInputByName(location).value = id;
                    /* refresh the item on the site in another thread */
                    instance.refreshThisItem();
                    instance.updateCategoryCache();
                    return;
                }, instance);
            }, false);
        }
        var menu = Rendition.UI.ContextMenu(e, {
            elements: options,
            caller: this,
            type: 'mouse'
        });
    }
    instance.deleteImage = function (e) {
        var imagingId = this.getAttribute('imagingId');
        var url = 'method1=[]';
        var req1 = [
			"DeleteImage", [
				{
				    "imagingId": imagingId
				}
			]
		]
        var req2 = [
			"GetItemImages",
			[
				instance.itemNumber
			]
		]
        var req3 = [
			"DataSet",
			["items", "where itemNumber = '" + instance.itemNumber + "'", "1", "1", "", {}, [], "JSON", true, "-1", false, "", ""]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI +
		Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI() +
		'&method2=' + JSON.stringify(req2).toURI() +
		'&method3=' + JSON.stringify(req3).toURI(), function (e) {
		    var a = JSON.parse(e.responseText);
		    instance.initImages(a.method2.GetItemImages);
		    instance.imageContent.innerHTML = '';
		    instance.imageContent.appendChild(instance.imageArtboard);
		    instance.form.resize();
		    instance.dataSet = a.method3.DataSet;
		    instance.form.getInputByName('VerCol').value = instance.dataSet.data[0][instance.dataSet.data[0].length - 1];
		    /* refresh the item on the site in another thread */
		    instance.refreshThisItem();
		    instance.updateCategoryCache();
		    return;
		}, instance);
        return;
    }
    instance.fillFormSelect = function () {
        var data = [];
        data.push(['NO FORM', 'NO FORM'])
        if (instance.forms === undefined) { return data; }
        var l = instance.forms.length;
        for (var x = 0; l > x; x++) {
            if (instance.forms[x].objectType != 'directory') {
                var path = instance.forms[x].name;
                var fileName = path.substring(path.lastIndexOf('\\') + 1);
                data.push([fileName, fileName]);
            }
        }
        return data;
    }
    instance.initForms = function (target) {
        instance.formSelect = document.createElement('select');
        var r = instance.dataSet;
        var header = Rendition.UI.getHeaderByName(r, 'formName');
        if (instance.newItem !== undefined) {
            var formName = 'NO FORM';
        } else {
            var formName = r.data[instance.rowIndex][header.index].trim();
        }
        var forms = instance.fillFormSelect();
        Rendition.UI.fillSelect(instance.formSelect, forms, 0, 0, null);
        /* find the form that matches the selected form ignoring case */
        for (var x = 0; forms.length > x; x++) {
            if (formName.toUpperCase() == forms[x][0].toUpperCase()) {
                formName = forms[x][0];
            }
        }
        instance.formSelect.value = formName;
        instance.formGroupBox = Rendition.UI.GroupBox({
            title: Rendition.Localization['ItemEditor_Selected_Form'].Title,
            childNodes: [instance.formSelect],
            expanded: true
        });
        instance.formSelect.onchange = function (e) {
            var i = instance.form.getInputByName('formName');
            i.value = this.value;
            instance.updateFormInfo(this.value);
        }
        instance.updateFormInfo(instance.formSelect.value);
        instance.formGroupBox.appendTo(target);
    }
    instance.updateFormInfo = function (formName) {
        var t = instance.formCutter.cutters[1];
        t.innerHTML = '';
        var req = [
			"GetFormInfo",
			[{ formName: formName}]
		]
        var URL = Rendition.UI.clientServerSyncURI + "method1=" + JSON.stringify(req);
        var j = Rendition.UI.Ajax(URL, function (e) {
            var a = JSON.parse(e.responseText);
            a = a.method1.GetFormInfo;
            if (a.inputs == null) {
                return;
            }
            var l = a.inputs.length;
            var tbl = document.createElement('table');
            for (var x = l - 1; 0 < x + 1; x--) {
                var row = tbl.insertRow(0);
                var cell2 = row.insertCell(0);
                var cell1 = row.insertCell(0);
                cell1.textContent = (x + 1);
                cell2.textContent = a.inputs[x].Name;
            }
            var formPreview = document.createElement('div');
            formPreview.innerHTML = a.HTML;
            instance.formGroupBox = Rendition.UI.GroupBox({
                title: a.name,
                childNodes: [formPreview],
                expanded: true
            });
            instance.inputGroupBox = Rendition.UI.GroupBox({
                title: 'Inputs',
                childNodes: [tbl],
                expanded: true
            });
            instance.formGroupBox.appendTo(t);
            instance.inputGroupBox.appendTo(t);
            t.style.overflow = 'scroll';
        }, instance);
    }
    instance.resizeArtboard = function () {
        if (instance.imageArtboard) {
            if (instance.imageArtboard.parentNode) {
                var p = instance.imageArtboard.parentNode;
                var a = instance.imageArtboard;
                a.style.marginTop = '5px';
                a.style.marginLeft = '5px';
                a.style.height = p.offsetHeight - 39 + 'px';
                a.style.width = p.offsetWidth - 39 + 'px';
            }
        }
    }
    instance.refreshSiteItems = function (callbackProcedure) {
        var req = [
			'RefreshItemsCache',
			[]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            if (typeof callbackProcedure === 'function') {
                callbackProcedure.apply(this, []);
            }
            return;
        }, instance);
    }
    instance.renderThisImage = function (imagingId) {
        var req = [
			'RefreshThisImage',
			[instance.itemNumber, imagingId]
		]
        var imageUpdateDialog = Rendition.UI.UpdateDialog({ title: 'Rendering Images' });
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            imageUpdateDialog.close();
            return;
        }, instance);
    }
    instance.renderThisItemsImages = function () {
        var req = [
			'RefreshAllItemImages',
			[instance.itemNumber]
		]
        var imageUpdateDialog = Rendition.UI.UpdateDialog({ title: 'Rendering Images' });
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            imageUpdateDialog.close();
            return;
        }, instance);
    }
    instance.refreshThisItem = function () {
        var req = [
			'RefreshItemCache',
			[instance.itemNumber]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            return;
        }, instance);
    }
    instance.updateCategoryCache = function () {
        var req = [
			'RefreshCategoriesCache',
			[]
		]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI +
		Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) { }, instance);
    }
    instance.propertyContextMenuOptions = function (e, element) {
        var row = parseInt(element.getAttribute('row'));
        var column = parseInt(element.getAttribute('column'));
        var options = [];
        var optionLength = -1;
        optionLength++;
        options[optionLength] = Rendition.UI.MenuOption();
        options[optionLength].text = 'Copy Selected Properties';
        Rendition.UI.appendEvent('click', options[optionLength], function (e) {
            /* get the selected rows */
            /* property grid */
            var ids = [];
            var grid = instance.form.grids[1];
            for (var x = 0; grid.selectedRows.length > x; x++) {
                ids.push(grid.getRecord(grid.selectedRows[x], 'itemPropertyId'));
            }
            /* now we have the Ids, now ask the user what items to copy the properties to */
            instance.propertyAddDialog = Rendition.UI.SelectDialog({
                objectName: 'shortItemList',
                contextMenuOptions: Rendition.Commerce.ComContext,
                multiSelect: true,
                ordinal: 0,
                inputTitle: Rendition.Localization['ItemEditor_Item_Numbers'].Title,
                boxTitle: Rendition.Localization['ItemEditor_Enter_an_Item_Number'].Title,
                title: Rendition.Localization['ItemEditor_Select_one_or_more_items_to_copy_selected_properties_to'].Title,
                callbackProcedure: function (e) {
                    /* copy the selected ids as new properties for the selected group of items */
                    var innerGrid = instance.propertyAddDialog.grid;
                    var itemNumbers = [];
                    for (var x = 0; innerGrid.selectedRows.length > x; x++) {
                        itemNumbers.push(innerGrid.getRecord(innerGrid.selectedRows[x], 'itemNumber'));
                    }
                    var req = [
						'CopyItemPropertiesToItems',
						[ids, itemNumbers]
					]
                    instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                        return;
                    }, instance);
                }
            });
        }, false);
        optionLength++;
        options[optionLength] = Rendition.UI.MenuOption();
        options[optionLength].text = Rendition.Localization['ItemEditor_Update_Child_Items_With_Selected_Properties'].Title;
        Rendition.UI.appendEvent('click', options[optionLength], function (e) {
            /* TODO: Update Child Items With Selected Properties */
            /*  get the selected rows */
            /* property grid */
            var ids = [];
            var grid = instance.form.grids[1];
            for (var x = 0; grid.selectedRows.length > x; x++) {
                ids.push(grid.getRecord(grid.selectedRows[x], 'itemPropertyId'));
            }
            var req = [
				'copyItemPropertiesToAllChildItems',
				[ids]
			]
            instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                return;
            }, instance);
        }, false);
        return options;
    }
    instance.init();
    return instance;
}