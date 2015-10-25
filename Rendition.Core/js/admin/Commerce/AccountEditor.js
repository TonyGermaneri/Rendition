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
* User editor.
* @constructor
* @name Rendition.Commerce.AccountEditor
*/
Rendition.Commerce.AccountEditor = function (args) {
    var instance = {}
    instance.tabOrder = {
        general: 0,
        contacts: 1,
        orders: 2,
        stats: 3,
        attachments: 4,
        payments: 5,
        translation: 6,
        sessions: 7
    }
    if (args === undefined) { args = {} }
    if (args.userId === undefined) {
        instance.newUser = true;
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
    instance.init = function () {
        if (instance.newUser) {
            args.userId = instance.userId = -1;
        }
        var userIdInput = {
            columnName: 'userId',
            inputType: 'title'
        }
        if (instance.newUser) {
            userIdInput = {
                columnName: 'userId',
                autoComplete: {
                    forceValidation: true,
                    mustMatchPattern: /[0-9]+/i,
                    patternMismatchMessage: Rendition.Localization['AccountEditor_This_field_can_only_contain_the_numbers_0-9'].Title,
                    patternMismatchTitle: Rendition.Localization['AccountEditor_Invalid_value'].Title,
                    objectName: 'users',
                    suffix: 'where userId  like \'%<value>%\'',
                    matchSuffix: 'where userId  = <value> and not userId = ' + (instance.userId || -100),
                    cantMatchRecord: true,
                    recordMismatchMessage: Rendition.Localization['AccountEditor_Every_account_number_must_be_unique'].Title,
                    recordMismatchTitle: Rendition.Localization['AccountEditor_Invalid_value'].Title,
                    autoComplete: true
                }
            }
        }
        if (args.activeTab === undefined) { args.activeTab = 0; }
        if (args.parentNode === undefined) {
            instance.dialog = Rendition.UI.dialogWindow({
                rect: {
                    x: Rendition.UI.dialogPosition.x,
                    y: Rendition.UI.dialogPosition.y,
                    h: document.documentElement.clientHeight - 100,
                    w: 630
                },
                title: Rendition.Localization['AccountEditor_Account_editor_loading'].Title,
                rememberPosition: true,
                id: 'AccountEditorAllByItself' + Rendition.UI.iif(Rendition.UI.deskStyle.dialogSizePreference === '1', String(args.userId).toUpperCase(), '')
            });
            args.parentNode = instance.dialog.content;
        }
        instance.initURL = 'method1=["DataSet", ["users","where userId = \'' + args.userId + '\'","1","1","",{},[],"JSON",true,"-1",false,\'\',\'\']]' +
		'&method2=["GetSqlArray", [{"commandText":"select rate,shippingType.shippingName from shippingType with (nolock)  union all  select -1,\'No Service\' order by shippingName;"}]]' +
		'&method4=["GetSqlArray", [{"commandText":"select balance from accountBalance where userId = \'' + args.userId + '\'"}]]' +
		'&method5=["GetSqlArray", [{"commandText":"select accountTypeId, accountType from accountTypes with (nolock) order by accountTypeId"}]]' +
		'&method3=["GetSqlArray", [{"commandText":"select termId, termName from terms with (nolock) order by termId;"}]]';
        instance.refresh = function () {
            Rendition.UI.wireupCloseEvents(instance.closeEditor, args.parentNode, true);
            args.parentNode.innerHTML = '';
            instance.init();
        }
        instance.userGrid = Rendition.UI.Grid({
            objectName: 'users',
            suffix: ' where userId = \'' + args.userId.toString().replace(/'/g) + '\''
        });
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + instance.initURL, function (e) {
            var a = JSON.parse(e.responseText);
            instance.dataSet = a.method1.DataSet;
            instance.data = a.method1.DataSet.data[0];
            instance.rates = a.method2.GetSqlArray;
            instance.terms = a.method3.GetSqlArray;
            instance.accountTypes = a.method5.GetSqlArray;
            instance.balance = a.method4.GetSqlArray;
            if (instance.newUser !== undefined) {
                instance.itemNumber = '';
                var newRecordRow = instance.userGrid.newRecord({ userId: -2 });
                instance.dataSet = instance.userGrid.dataSet;
                instance.dataSet.data[0] = newRecordRow;
                instance.rowIndex = instance.userGrid.newRowIndex;
                instance.data = newRecordRow;
                instance.userId = -2;
            } else {
                instance.rowIndex = 0;
                if (instance.data === undefined) {
                    alert(Rendition.Localization['AccountEditor_Account_{0}_does_not_exist'].Title.replace('{0}', args.userId.toString()));
                    if (instance.dialog) {
                        instance.dialog.close();
                    }
                    return;
                }
                instance.userId = instance.data[0];
            }
            instance.dialog.title(Rendition.Localization['AccountEditor_Title'].Title.replace('{0}', instance.userId).replace('{1}', instance.data[3]));
            instance.contactsGrid = Rendition.UI.Grid({
                selectionMethod: 3,
                editMode: 3,
                objectName: 'contacts',
                contextMenuOptions: Rendition.Commerce.ComContext,
                suffix: ' where userId = \'' + instance.userId + '\'',
                genericEditor: true,
                editorParameters: Rendition.Commerce.addressForm(instance.rates),
                newRecord: {
                    userId: instance.userId
                }
            });
            instance.attachments = Rendition.UI.Grid({
                selectionMethod: 3,
                editMode: 3,
                objectName: 'attachments',
                suffix: ' where referenceId = \'' + instance.userId.toString().replace(/'/g) + '\' and referenceType = \'user\'',
                genericEditor: true,
                editorParameters: Rendition.Commerce.attachmentFormparams(''),
                newRecord: {
                    referenceId: instance.userId,
                    path: '',
                    referenceType: 'user'
                },
                contextMenuOptions: function (e, obj) { return Rendition.UI.DownloadAttachmentContextMenu(e, obj, instance.attachments); }
            });
            instance.translations = Rendition.UI.Grid({
                selectionMethod: 3,
                editMode: 3,
                objectName: 'importFileItemTranslation',
                suffix: ' where userId = \'' + instance.userId + '\'',
                genericEditor: true,
                newRecord: {
                    userId: instance.userId
                }
            });
            instance.ordersGrid = Rendition.UI.Grid({
                selectionMethod: 3,
                editMode: 0,
                objectName: 'orderList',
                suffix: ' where userId = \'' + instance.userId.toString().replace(/'/g) + '\'',
                contextMenuOptions: Rendition.Commerce.ComContext,
                ignoreTableChanges: true/*once again you come in handy my friend */
            });
            /* get the account type */
            if (instance.newUser !== undefined) {
                instance.accountType = -1;
            } else {
                var atHeader = Rendition.UI.getHeaderByName(instance.dataSet, 'accountType');
                instance.accountType = instance.dataSet.data[0][atHeader.index];
            }
            instance.formStruct = {
                dataSet: instance.dataSet,
                groups: [
					{
					    name: Rendition.Localization['AccountEditor_General'].Title,
					    expanded: true,
					    inputs: [
							userIdInput,
							{
							    HTML: function () {
							        var info = document.createElement('div');
							        if (instance.newUser === undefined) {
							            info.onclick = function () {
							                instance.tabBar.tabs[instance.tabOrder.stats].activate();
							                instance.statTabBar.tabs[2].activate();
							            }
							        }
							        var bal = 0;
							        if (instance.balance.length === 0) {
							            bal = "0.00";
							        } else {
							            bal = instance.balance[0][0].toFixed(2);
							        }
							        info.className = 'ui-corner-all info';
							        info.innerHTML = '<b>' + Rendition.Localization['AccountEditor_Balance'].Title + '</b>&nbsp;&nbsp;$' + bal;
							        return info
							    }
							},
							{
							    columnName: 'handle'
							},
							{
							    columnName: 'email'
							},
							{
							    columnName: 'password',
							    inputType: 'password'
							},
							{
							    displayName: 'Account Type',
							    columnName: 'accountType',
							    inputType: Rendition.UI.iif(instance.newUser, 'select', 'title'),
							    options: instance.accountTypes
							},
							{
							    columnName: 'userLevel',
							    displayName: 'Security Level',
							    inputType: 'select',
							    options: [
                                    [0, '0 - Retail Web User'],
                                    [1, '1 - Web Moderator'],
                                    [2, '2'],
                                    [3, 3],
                                    [4, 4],
                                    [5, '5 - Wholesale Web User'],
                                    [6, 6],
                                    [7, 7],
                                    [8, '8 - Operator'],
                                    [9, '9 - Admin Page Access']
                                ]
							}
						]
					},
					{
					    name: Rendition.Localization['AccountEditor_Printable_Forms'].Title,
					    expanded: false,
					    inputs: [
							{
							    columnName: 'quote',
							    fileManager: {
							        path: 'pdfs/'
							    }
							},
							{
							    columnName: 'invoice',
							    fileManager: {
							        path: 'pdfs/'
							    }
							},
							{
							    columnName: 'packingSlip',
							    fileManager: {
							        path: 'pdfs/'
							    }
							}

						]
					},
					{
					    name: Rendition.Localization['AccountEditor_Address'].Title,
					    expanded: false,
					    inputs: [
							{
							    columnName: 'contact'
							},
							{
							    columnName: 'firstName'
							},
							{
							    columnName: 'lastName'
							},
							{
							    columnName: 'address1'
							},
							{
							    columnName: 'address2'
							},
							{
							    columnName: 'city'
							},
							{
							    columnName: 'state'
							},
							{
							    columnName: 'zip'
							},
							{
							    columnName: 'country'
							},
							{
							    columnName: 'homePhone'
							},
							{
							    columnName: 'workPhone'
							},
							{
							    columnName: 'companyEmail'
							},
							{
							    columnName: 'fax'
							},
							{
							    columnName: 'www'
							},
							{
							    columnName: 'FOB'
							}
						]
					},
					{
					    name: Rendition.Localization['AccountEditor_Ordering'].Title,
					    expanded: false,
					    inputs: [
							{
							    columnName: 'autoFillOrderForm'
							},
							{
							    columnName: 'sendShipmentUpdates'
							},
							{
							    columnName: 'estLeadTime'
							},
							{
							    columnName: 'wouldLikeEmail',
							    displayName: Rendition.UI.iif(instance.accountType === 2, 'Send System Messages', 'Send Update Emails')
							},
							{
							    columnName: 'termId',
							    inputType: 'select',
							    options: instance.terms
							},
							{
							    columnName: 'noTax'
							},
							{
							    columnName: 'allowPreorders'
							},
							{
							    columnName: 'rateId',
							    inputType: 'select',
							    options: instance.rates
							},
							{
							    columnName: 'wholeSaleDealer',
							    displayName: 'Wholesale pricing'
							}
						]
					},
					{
					    name: Rendition.Localization['AccountEditor_Item_Specific_Prices'].Title,
					    expanded: false,
					    inputs: [
							{
							    grid: {
							        selectionMethod: 3,
							        editMode: 3,
							        objectName: 'userPriceList',
							        suffix: ' where userId = \'' + instance.userId + '\'',
							        contextMenuOptions: Rendition.Commerce.ComContext,
							        genericEditor: true,
							        newRecord: {
							            userPriceListId: Rendition.UI.createUUID,
							            userId: instance.userId
							        },
							        editorParameters: {
							            groups: [
											{
											    name: Rendition.Localization['AccountEditor_User_Specific_Price'].Title,
											    expanded: true,
											    inputs: [
													Rendition.Commerce.itemNumberInput(),
													{
													    columnName: 'price',
													    autoComplete: {
													        mustMatchPattern: /[0-9\.]+/i,
													        patternMismatchMessage: Rendition.Localization['AccountEditor_This_field_can_only_contain_whole_or_fractional_numbers'].Title,
													        patternMismatchTitle: Rendition.Localization['AccountEditor_Invalid_Number'].Title
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
											    name: Rendition.Localization['AccountEditor_Comments'].Title,
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
					    name: Rendition.Localization['AccountEditor_Comments'].Title,
					    expanded: true,
					    inputs: [
							{
							    columnName: 'comments',
							    inputType: 'rte'
							}
						]
					},
					{
					    name: Rendition.Localization['AccountEditor_Customization'].Title,
					    expanded: false,
					    inputs: [
							{
							    columnName: 'admin_script',
							    fileManager: {
							        path: '/'
							    }
							},
							{
							    columnName: 'defaultPrinterPath',
							    displayName: 'Printer Path'
							}
						]
					},
					{
					    name: Rendition.Localization['AccountEditor_Startup_Parameters'].Title,
					    expanded: false,
					    inputs: [
							{
							    columnName: 'UI_JSON',
							    inputType: 'codearea',
							    language: 'javascript',
							    saveProcedure: instance.save
							}
						]
					}
				]
            }
            /* create a form */
            instance.form = Rendition.UI.Form(instance.formStruct);
            Rendition.UI.appendEvent('change', instance.form.getInputByName('password'), instance.hashPasswordField, false);
            if (instance.newUser) {
                instance.form.getInputByName('userId').value = instance.userId;
                instance.form.getInputByName('email').value = '';
                instance.form.getInputByName('accountType').onchange = instance.getNewAccountNumber;
                instance.getNewAccountNumber(); /* fetch a new account number based on the default settings */
                if (instance.dialog) {
                    instance.dialog.title(Rendition.Localization['AccountEditor_New_User_User_Editor_Title'].Title);
                }
            }
            instance.tabs = [];
            instance.tabs[instance.tabOrder.general] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['AccountEditor_General'].Title,
                load: function (tab, tabBar, content) {
                    content.innerHTML = '';
                    content.style.overflow = 'scroll';
                    instance.form.appendTo(content);
                }
            });
            instance.tabs[instance.tabOrder.contacts] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['AccountEditor_Contacts'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newItem === undefined) {
                        content.innerHTML = '';
                        content.style.overflow = 'hidden';
                        instance.contactsGrid.appendTo(content);
                    } else {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['AccountEditor_You_can_access_the_Contacts_tab_after_you_save_this_account_for_the_first_time'].Title);
                    }
                }
            });
            instance.tabs[instance.tabOrder.orders] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['AccountEditor_Orders'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newItem === undefined) {
                        content.innerHTML = '';
                        content.style.overflow = 'hidden';
                        instance.ordersGrid.appendTo(content);
                    } else {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['AccountEditor_You_can_access_the_Contacts_tab_after_you_save_this_account_for_the_first_time'].Title);
                    }
                }
            });
            instance.tabs[instance.tabOrder.stats] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['AccountEditor_Statistics'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newUser !== undefined) {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['AccountEditor_You_can_access_the_Contacts_tab_after_you_save_this_account_for_the_first_time'].Title);
                        return;
                    }
                    var statTabs = [];
                    statTabs[0] = Rendition.UI.TabBarTab({
                        title: Rendition.Localization['AccountEditor_Visits'].Title,
                        load: function (tab, tabBar, content) {
                            instance.lastStatTabIndex = 4;
                            if (instance.newUser !== undefined) {
                                instance.tabbar.tabs[0].activate();
                                alert(Rendition.Localization['AccountEditor_You_can_access_the_Contacts_tab_after_you_save_this_account_for_the_first_time'].Title);
                                return;
                            }
                            innerHTML = '';
                            new Rendition.UI.DateChart({
                                parentNode: content,
                                title: Rendition.Localization['AccountEditor_SessionsHits'].Title,
                                type: 'TicChart',
                                chart: function (dateChart, chartArguments, chartOptions) {
                                    var a =
									" declare @dayTo datetime = '" + chartArguments.toDate.value.s() + "' declare @dayFrom datetime = '" + chartArguments.fromDate.value.s() + "' declare @days table(days datetime);  " +
									" declare @todate int;  declare @fromdate int;  set @todate = (DATEDIFF(D,@dayTo,GETDATE()))*-1; " +
									" set @fromdate = (DATEDIFF(D,@dayFrom,GETDATE()))*-1;  while (@todate>=@fromdate)  begin " +
									" insert into @days (days) values (DATEADD(dd,@todate,cast(convert(varchar(20),getDate(),1) as datetime))); " +
									" set @todate = @todate -1;  end  " +
									" select 'Hits',d.days,count(0)-1,'Navy','White',3,5 from  @days d " +
									" left join visitorDetail v  with (nolock) on v.time between d.days and d.days+1 " +
									" inner join visitors i  with (nolock) on i.sessionId = v.sessionId and userId = " + instance.userId + " group by d.days; " +
									" select 'Sessions',d.days,count(0)-1,'Red','White',3,5 from  @days d " +
									" inner join visitors v  with (nolock) on v.addDate between d.days and d.days+1 and userId = " + instance.userId + "  group by d.days "
                                    return a;
                                }
                            });
                        }
                    });
                    /* check if there are any more tabs to add */
                    for (var x = 0; Rendition.Commerce.accountEditorStatsTabs.length > x; x++) {
                        var arr = Rendition.Commerce.accountEditorStatsTabs[x].apply(instance, [instance, statTabs]);
                        if (arr !== undefined) {
                            statTabs.push(arr);
                        }
                    }
                    instance.statTabBar = Rendition.UI.TabBar({
                        tabs: statTabs,
                        parentNode: content,
                        activeTabIndex: instance.lastStatTabIndex || 0
                    });
                }
            });
            instance.tabs[instance.tabOrder.payments] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['AccountEditor_Payments'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newUser !== undefined) {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['AccountEditor_You_can_access_the_Contacts_tab_after_you_save_this_account_for_the_first_time'].Title);
                        return;
                    }
                    content.style.overflow = 'hidden';
                    instance.paymentsGrid = Rendition.UI.Grid({
                        selectionMethod: 3,
                        objectName: 'paymentMethods',
                        contextMenuOptions: Rendition.Commerce.ComContext,
                        suffix: ' where userId = \'' + instance.userId.toString().replace(/'/g) + '\'',
                        parentNode: content
                    });

                }
            });

            instance.tabs[instance.tabOrder.attachments] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['AccountEditor_Attachments'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newUser !== undefined) {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['AccountEditor_You_can_access_the_Contacts_tab_after_you_save_this_account_for_the_first_time'].Title);
                        return;
                    }
                    content.innerHTML = '';
                    content.style.overflow = 'hidden';
                    instance.attachments.appendTo(content);
                }
            });

            instance.tabs[instance.tabOrder.translation] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['AccountEditor_Translations'].Title,
                load: function (tab, tabBar, content) {
                    if (instance.newUser !== undefined) {
                        instance.tabbar.tabs[0].activate();
                        alert(Rendition.Localization['AccountEditor_You_can_access_the_Contacts_tab_after_you_save_this_account_for_the_first_time'].Title);
                        return;
                    }
                    content.innerHTML = '';
                    content.style.overflow = 'hidden';
                    instance.translations.appendTo(content);
                }
            });
            /* check if there are any more tabs to add */
            for (var x = 0; Rendition.Commerce.accountEditorTabs.length > x; x++) {
                var arr = Rendition.Commerce.accountEditorTabs[x].apply(instance, [instance, instance.tabs]);
                if (arr !== undefined) {
                    instance.tabs.push(arr);
                }
            }
            instance.menuBarElements = [];
            instance.menuBarElements[0] = Rendition.UI.MenuOption();
            instance.menuBarElements[0].text = Rendition.UI.iif(instance.newUser, Rendition.Localization['AccountEditor_Create_Account'].Title, Rendition.Localization['AccountEditor_Save_Account'].Title);
            Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
                instance.save();
                return false;
            }, false);
            if (!instance.newUser) {
                instance.menuBarElements[1] = Rendition.UI.MenuOption();
                instance.menuBarElements[1].text = Rendition.Localization['AccountEditor_Open_Account'].Title;
                Rendition.UI.appendEvent('click', instance.menuBarElements[1], function (e) {
                    new Rendition.UI.SelectButtonDialog({
                        objectName: 'shortUserList',
                        ordinal: 0,
                        inputTitle: 'Customer Id',
                        boxTitle: Rendition.Localization['AccountEditor_Enter_a_customer_Id'].Title,
                        title: Rendition.Localization['AccountEditor_Enter_or_browse_for_an_customer_Id'].Title,
                        callbackProcedure: function (e) {
                            Rendition.UI.removeEvent('close', instance.dialog, instance.closeEditor, false);
                            instance.dialog.close();
                            new Rendition.Commerce.AccountEditor({ userId: e.selectedValue });
                        }
                    });
                    return false;
                }, false);

                instance.menuBarElements[2] = Rendition.UI.MenuOption();
                instance.menuBarElements[2].text = Rendition.Localization['AccountEditor_Refresh'].Title;
                Rendition.UI.appendEvent('click', instance.menuBarElements[2], function (e) {
                    instance.refresh();
                    return false;
                }, false);
                instance.menuBarElements[3] = Rendition.UI.MenuOption();
                instance.menuBarElements[3].text = Rendition.Localization['AccountEditor_New_Order'].Title;
                Rendition.UI.appendEvent('click', instance.menuBarElements[3], function (e) {
                    new Rendition.Commerce.OrderEditor({ userId: instance.userId });
                    return false;
                }, false);
            }
            instance.tabs[instance.tabOrder.sessions] = Rendition.Commerce.sessionBrowserTab(instance.userId);
            /* check if there are any more menus to add */
            for (var x = 0; Rendition.Commerce.accountEditorMenus.length > x; x++) {
                var arr = Rendition.Commerce.accountEditorMenus[x].apply(instance, [instance, instance.menuBarElements]);
                if (arr !== undefined) {
                    instance.menuBarElements.push();
                }
            }
            instance.menuBar = Rendition.UI.MenuBar({
                options: instance.menuBarElements,
                parentNode: args.parentNode
            });
            instance.tabBar = Rendition.UI.TabBar({
                tabs: instance.tabs,
                parentNode: args.parentNode,
                activeTabIndex: args.activeTab,
                offsetRect: { x: 0, y: instance.menuBar.style.rect.h, h: 0, w: 0 }
            });
            Rendition.UI.wireupCloseEvents(instance.closeEditor, args.parentNode);
            // init events
            for (var x = 0; Rendition.Commerce.accountEditorInitEvents.length > x; x++) {
                Rendition.Commerce.accountEditorInitEvents[x].apply(instance, [instance]);
            }
        }, instance);

    }
    instance.save = function (overwrite) {
        if (instance.form.isValid()) {
            if (instance.newUser) {
                var userId = instance.form.getInputByName('userId').value;
                instance.form.save(true, 1, function () {
                    instance.refreshUserInSiteCache();
                    Rendition.UI.removeEvent('close', instance.dialog, instance.closeEditor, false);
                    instance.dialog.close();
                    new Rendition.Commerce.AccountEditor({ userId: userId });
                });
            } else {
                instance.form.save(true, 0, instance.refreshUserInSiteCache, false);
            }
        } else {
            instance.form.showValidationMessage();
        }
    }
    instance.getNewAccountNumber = function () {
        var acctType = 0;
        if (instance.form) {
            acctType = instance.form.getInputByName('accountType').value;
        }
        /* get the next userId in the line */
        var req = [
			'GetNewAccountNumber',
			[
				String(acctType)
			]
		]
        if (instance.form) {
            instance.form.getInputByName('userId').value = Rendition.Localization['AccountEditor_Generating_New_Account_Number'].Title;
        }
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            var a = JSON.parse(e.responseText);
            args.userId = instance.userId = a.method1.GetNewAccountNumber.userId;
            if (instance.form) {
                instance.form.getInputByName('userId').value = instance.userId;
            }
        }, instance, false/*sync*/);
    }
    instance.refreshUserInSiteCache = function () {
        /* save worked so refresh the user data, but do it long after the data has been saved */
        setTimeout(function () {
            var req = [
				'RefreshUserById',
				[
					instance.userId.toString()
				]
			]
            instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                return;
            }, instance, false);
        }, 1000);
    }
    instance.hashPasswordField = function () {
        var req = [
			'GetHash',
			[
				instance.form.getInputByName('password').value
			]
		]
        instance.form.getInputByName('password').value = Rendition.Localization['AccountEditor_Generating_password_hash_value'].Title;
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            var a = JSON.parse(e.responseText);
            instance.form.getInputByName('password').value = a.method1.GetHash.digest;
            return;
        }, instance, false);
    }
    instance.init();
    return instance;
}