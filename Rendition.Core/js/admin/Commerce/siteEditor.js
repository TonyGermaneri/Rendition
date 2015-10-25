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
* Site editor.
* @constructor
* @name Rendition.Commerce.SiteEditor
*/
Rendition.Commerce.SiteEditor = function (args) {
    var instance = {}
    args = args === undefined ? {} : args;
    instance.infoTabs = []
    instance.assemblyTabs = []
    instance.historyTabs = []
    instance.tabs = []
    instance.configurationTabs = []
    if (args.parentNode === undefined) {
        instance.dialog = Rendition.UI.dialogWindow({
            rect: { x: Rendition.UI.dialogPosition.x,
                y: Rendition.UI.dialogPosition.y,
                h: document.documentElement.clientHeight - 100, w: 1000
            },
            title: Rendition.Localization['SiteEditor_Settings'].Title,
            rememberPosition: true,
            id: 'siteEditorAllByItself'
        });
        args.parentNode = instance.dialog.content;
    }
    instance.refreshSiteCache = function () {
        var req = [
			'RefreshSiteData',
			[]
		]
        instance.updateDialog = Rendition.UI.UpdateDialog({ message: Rendition.Localization['SiteEditor_Reloading_site_cache'].Title });
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            setTimeout(function () {
                instance.updateDialog.close();
            }, 2500);
        }, instance);
    }
    instance.stopWorkerProcess = function () {
        instance.restartWorkerProcess(true);
    }
    instance.restartWorkerProcess = function (stop) {
        var req = [
			'RestartWorkerProcess',
			[]
		];
        instance.updateDialog = Rendition.UI.UpdateDialog({ message: Rendition.Localization['SiteEditor_Restarting_application_just_a_moment'].Title });
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
            setTimeout(function () {
                instance.updateDialog.close();
                instance.restartDialog = Rendition.UI.UpdateDialog({ message: Rendition.Localization['SiteEditor_Restarting_Application'].Title });
                setTimeout(function () {
                    location.reload(true);
                }, 2500);
            }, 2500);
        }, instance);
    }
    var url = 'method1=["DataSet", ["site_configuration","","1","1","",{},[],"JSON",true,"-1",false,\'\',\'\']]';
    instance.flagsTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'flagTypes',
            parentNode: content
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.siteVarsTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.form = Rendition.UI.Form(instance.formStruct);
        instance.saveButton = document.createElement('button');
        instance.saveButton.style.margin = '4px 4px 0 4px';
        instance.saveButton.innerHTML = 'Save';
        instance.saveButton.onclick = function () {
            instance.form.save();
            return;
        }
        instance.refreshSiteButton = document.createElement('button');
        instance.refreshSiteButton.style.margin = '4px 4px 0 4px';
        instance.refreshSiteButton.innerHTML = Rendition.Localization['SiteEditor_Refresh_Cache'].Title;
        instance.refreshSiteButton.onclick = function () {
            instance.refreshSiteCache();
            return;
        }
        instance.restartWorkerProcessButton = document.createElement('button');
        instance.restartWorkerProcessButton.style.margin = '4px 4px 0 4px';
        instance.restartWorkerProcessButton.innerHTML = Rendition.Localization['SiteEditor_Restart_Web_Site'].Title;
        instance.restartWorkerProcessButton.onclick = function () {
            instance.restartWorkerProcess();
            return;
        }

        content.appendChild(instance.saveButton);
        content.appendChild(instance.refreshSiteButton);
        content.appendChild(instance.restartWorkerProcessButton);

        instance.form.appendTo(content);

        args.parentNode.style.overflow = 'scroll';
    }
    instance.divisionsTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'divisions',
            parentNode: content
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.swatchesTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'swatches',
            parentNode: content
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.sizesTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'sizes',
            parentNode: content
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.countriesTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'countries',
            parentNode: content
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.discountsTabs = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'discount',
            parentNode: content
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.taxTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'tax',
            parentNode: content
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.termsTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'terms',
            parentNode: content
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.hashTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'sessionHash',
            parentNode: content
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.packagesTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'addressUpdate',
            parentNode: content
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.uiCachetab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'ui_columns',
            parentNode: content,
            hideNewRow: true
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.secLevelTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'userLevels',
            parentNode: content
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.transactionsTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        instance.flagTypes = Rendition.UI.Grid({
            editMode: 3,
            objectName: 'vtTransactions',
            parentNode: content,
            hideNewRow: true
        });
        args.parentNode.style.overflow = 'hidden';
    }
    instance.renditionInfoTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        var data = [];
        for (var x in instance.info.renditionInfo) {
            if (!x) { continue; }
            if (x == 'defaults') { continue; }
            if (x == 'plugins') { continue; }
            if (x == 'threads') { continue; }
            data.push([x, instance.info.renditionInfo[x]]);
        }
        for (var x in instance.info.renditionInfo.defaults) {
            if (!x) { continue; }
            data.push([x, instance.info.renditionInfo.defaults[x]]);
        }
        var pgrid = Rendition.UI.Grid({
            name: 'RenditionInfo',
            data: instance.createReadObject(data, [Rendition.Localization['SiteEditor_Property'].Title, Rendition.Localization['SiteEditor_Value'].Title]),
            parentNode: content
        });
    }
    instance.pluginsInfoTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        var data = [];
        for (var x = 0; instance.info.plugins.length > x; x++) {
            var plugin = instance.info.plugins[x];
            data.push([
							plugin.name,
							plugin.message,
							plugin.error,
							plugin.description,
							plugin.Author,
							plugin.version,
							plugin.enabled,
                            plugin.GUID
						]);
        }
        var pgrid = Rendition.UI.Grid({
            name: 'Plugins',
            data: instance.createReadObject(data, ['Name',
									Rendition.Localization['SiteEditor_Status'].Title,
                                    Rendition.Localization['SiteEditor_Status_Code'].Title,
                                    Rendition.Localization['SiteEditor_Description'].Title,
                                    Rendition.Localization['SiteEditor_Author'].Title,
                                    Rendition.Localization['SiteEditor_Version'].Title,
                                    Rendition.Localization['SiteEditor_Enabled'].Title,
                                    Rendition.Localization['SiteEditor_GUID'].Title
            ]),
            parentNode: content,
            contextMenuOptions: instance.pluginMenuOptions
        });
    }
    instance.pluginMenuOptions = function (e, element) {
        var data = this.getData()[parseInt(element.attributes["row"].value) - 1];
        var options = [];
        var optionLength = -1;
        var grid = this;
        optionLength++;
        options[optionLength] = Rendition.UI.MenuOption();
        var text = data[7] === false ? Rendition.Localization['SiteEditor_Plugin_Enable'].Title : Rendition.Localization['SiteEditor_Plugin_Disable'].Title;
        options[optionLength].text = text;
        Rendition.UI.appendEvent('click', options[optionLength], function (e) {
            var req = [
			    'revokePlugin',
			    [data[8], !data[7]]
		    ]
            Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
                instance.stopWorkerProcess();
            }, instance);
        }, false);
        return options;
    }
    instance.processInfoTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        var data = [];
        for (var x in instance.info.process) {
            if (!x) { continue; }
            data.push([x, instance.info.process[x]]);
        }
        var pgrid = Rendition.UI.Grid({
            name: 'Process Info', 
            data: instance.createReadObject(data, [
                Rendition.Localization['SiteEditor_Property'].Title,
                Rendition.Localization['SiteEditor_Value'].Title
            ]),
            parentNode: content
        });
    }
    instance.threadInfoTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        var data = [];
        for (var x = 0; instance.info.threads.length > x; x++) {
            var thread = instance.info.threads[x];
            data.push([
						    thread.Id,
						    thread.ThreadState,
						    thread.PrivilegedProcessorTime,
						    thread.TotalProcessorTime,
						    thread.UserProcessorTime,
						    thread.WaitReason
					    ]);
        }
        var pgrid = Rendition.UI.Grid({
            name: 'ThreadInfo',
            data: instance.createReadObject(data, [
            'Id',
            'State',
			'Privileged Processor Time',
            'TotalProcessorTime',
			'UserProcessorTime',
            'WaitReason']),
            parentNode: content
        });
    }
    instance.timersTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        var data = [];
        for (var x = 0; instance.info.timers.length > x; x++) {
            var timer = instance.info.timers[x];
            data.push([
							timer.name,
							timer.message,
							timer.timeUntilElapsed,
							timer.Interval,
							timer.AutoReset,
							timer.error
						]);
        }
        var pgrid = Rendition.UI.Grid({
            name: 'Timers',
            data: instance.createReadObject( data, ['Name', 'Status', 'Time Remaining',
									'Interval', 'AutoReset', 'Error']),
            parentNode: content
        });
    }
    instance.serverVarTabs = function (tab, tabBar, content) {
        content.innerHTML = '';
        var data = [];
        for (var x in instance.info.ServerVariables) {
            if (!x) { return; }
            data.push([x, instance.info.ServerVariables[x]]);
        }
        var pgrid = Rendition.UI.Grid({
            name: 'ServerVars',
            data: instance.createReadObject( data, [Rendition.Localization['SiteEditor_Property'].Title, Rendition.Localization['SiteEditor_Value'].Title], [200, 1700]),
            parentNode: content
        });
    }
    instance.rewriteTab = function (tab, tabBar, content) {
        instance.grid = new Rendition.UI.Grid({
            objectName: 'redirector',
            parentNode: content,
            editMode: 3,
            genericEditor: true,
            recordupdated: function () {
                instance.updateSiteDirectives();
            }
        });
    }
    instance.scriptingTab = function(tab, tabBar, content) {
        instance.scripting = Rendition.Commerce.Scripting({ parentNode: content });
    }
    instance.assemblyTab = function (tab, tabBar, content) {
        instance.assemblyTabBar = Rendition.UI.TabBar({
            tabs: instance.assemblyTabs,
            parentNode: content,
            activeTabIndex: 0
        });
    }
    instance.configurationTab = function (tab, tabBar, content) {
        instance.configurationTabBar = Rendition.UI.TabBar({
            tabs: instance.configurationTabs,
            parentNode: content,
            activeTabIndex: 0
        });
    }
    instance.historyTab = function (tab, tabBar, content) {
        instance.historyTabBar = Rendition.UI.TabBar({
            tabs: instance.historyTabs,
            parentNode: content,
            activeTabIndex: 0
        });
    }
    instance.infoTab = function (tab, tabBar, content) {
        content.innerHTML = '';
        var req1 = ["SystemInfo", []]
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req1).toURI(), function (e) {
            var f = JSON.parse(e.responseText);
            instance.info = f.method1.SystemInfo;
            instance.tabbar = Rendition.UI.TabBar({
                tabs: instance.infoTabs,
                parentNode: content,
                activeTabIndex: 0
            });
        }, instance);
        args.parentNode.style.overflow = 'hidden';
    }
    instance.init = function () {
        instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
            var a = JSON.parse(e.responseText);
            instance.dataSet = a.method1.DataSet;
            instance.formStruct = {
                dataSet: instance.dataSet,
                groups: undefined
            }
            instance.infoTabs[instance.infoTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Rendition_Information'].Title,
                load: instance.renditionInfoTab
            });
            instance.infoTabs[instance.infoTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Plugins_Information'].Title,
                load: instance.pluginsInfoTab
            });
            instance.infoTabs[instance.infoTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Process_Information'].Title,
                load: instance.processInfoTab
            });
            instance.infoTabs[instance.infoTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Thread_Information'].Title,
                load: instance.threadInfoTab
            });
            instance.infoTabs[instance.infoTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Timers'].Title,
                load: instance.timersTab
            });
            instance.infoTabs[instance.infoTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Server_Variables'].Title,
                load: instance.serverVarTabs
            });
            instance.tabs[instance.tabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Site'].Title,
                load: instance.siteVarsTab
            });
            instance.configurationTabs[instance.configurationTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Flags'].Title,
                load: instance.flagsTab
            });
            instance.configurationTabs[instance.configurationTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Scripting'].Title,
                load: instance.scriptingTab
            });
            instance.tabs[instance.tabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Assembly'].Title,
                load: instance.assemblyTab
            });
            instance.tabs[instance.tabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Site_History'].Title,
                load: instance.historyTab
            });
            instance.tabs[instance.tabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Configuration'].Title,
                load: instance.configurationTab
            });
            instance.assemblyTabs[instance.assemblyTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Divisions'].Title,
                load: instance.divisionsTab
            });
            instance.assemblyTabs[instance.assemblyTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Swatches'].Title,
                load: instance.swatchesTab
            });
            instance.assemblyTabs[instance.assemblyTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Sizes'].Title,
                load: instance.sizesTab
            });
            instance.configurationTabs[instance.configurationTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Countries'].Title,
                load: instance.countriesTab
            });
            instance.configurationTabs[instance.configurationTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Discounts'].Title,
                load: instance.discountsTabs
            });
            instance.configurationTabs[instance.configurationTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Tax'].Title,
                load: instance.taxTab
            });
            instance.configurationTabs[instance.configurationTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Terms'].Title,
                load: instance.termsTab
            });
            instance.historyTabs[instance.historyTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_User_Property_Store'].Title,
                load: instance.hashTab
            });
            instance.historyTabs[instance.historyTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Packages'].Title,
                load: instance.packagesTab
            });
            instance.historyTabs[instance.historyTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Data_Grid_Cache'].Title,
                load: instance.uiCachetab
            });
            instance.configurationTabs[instance.configurationTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Security_Levels'].Title,
                load: instance.secLevelTab
            });
            instance.historyTabs[instance.historyTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Transactions'].Title,
                load: instance.transactionsTab
            });
            instance.tabs[instance.tabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Info'].Title,
                load: instance.infoTab
            });
            instance.configurationTabs[instance.configurationTabs.length] = Rendition.UI.TabBarTab({
                title: Rendition.Localization['SiteEditor_Rewrite_Directives'].Title,
                load: instance.rewriteTab
            });
            if (Rendition.UI.parameters.siteEditorTabs !== undefined) {
                for (var x = 0; Rendition.UI.parameters.siteEditorTabs.length > x; x++) {
                    instance.tabs.push(Rendition.UI.parameters.siteEditorTabs[x]);
                }
            }
            instance.tabbar = Rendition.UI.TabBar({
                tabs: instance.tabs,
                parentNode: args.parentNode,
                activeTabIndex: 0
            });
        }, instance);
    }
    instance.updateSiteDirectives = function () {
        var req = [
			'RefreshRewriteCache',
			[]
		]
        new Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) { return; }, instance);
    }
    instance.refreshRewriteCache = function () {
        var url = 'method1=["RefreshRewriteCache",[]]';
        instance.reqEval = new Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + url, function (e) {
            var a = JSON.parse(e.responseText);
            if (a.method1.RefreshRewriteCache.error === 0) {
                instance.recalculate(function () {
                    instance.startNewItem(null, instance.itemsGrid);
                });
            }
        }, instance);
    }
    instance.createReadObject = function (data, headers, columnWidths) {
        var hdr = [];
        if (columnWidths === undefined) {
            var columnWidths = [];
            for (var x = 0; headers.length > x; x++) {
                columnWidths.push(200);
            }
        }
        for (var x = 0; headers.length > x; x++) {
            hdr.push({
                name: headers[x],
                dataType: 'varchar',
                dataLength: 255,
                columnOrder: x,
                columnSize: columnWidths[x],
                visibility: 1,
                description: '',
                isNullable: 0,
                primaryKey: 0,
                defaultValue: '',
                displayName: headers[x],
                hidden: 0
            });
        }
        return dataSet = {
            data: data,
            error: 0,
            description: '',
            range: {
                from: 1,
                to: 1
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
                name: '',
                displayName: ''
            },
            header: hdr
        }
    }
    instance.init();
    return instance;
}