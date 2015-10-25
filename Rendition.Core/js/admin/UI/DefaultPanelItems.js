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
* Default items in the panel.
* @function
* @public
* @name Rendition.UI.defaultPanelItems
* @returns {Native.Array} The array of items in the panel.
*/
Rendition.UI.defaultPanelItems = [
    {
        text: Rendition.Localization['DefaultPanelItems_Navigation'].Title,
        header: true,
        expanded: !Rendition.Localization['DefaultPanelItems_Navigation'].Hidden
    },
    {
        text: Rendition.Localization['DefaultPanelItems_Go_to_Admin_Page'].Title,
        src: '/admin/img/icons/cog.png',
        message: Rendition.Localization['DefaultPanelItems_Go_to_Admin_Page'].Message,
        link: '/admin'
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Go_to_Home_Page'].Title,
	    src: '/admin/img/icons/house.png',
	    message: Rendition.Localization['DefaultPanelItems_Go_to_Home_Page'].Message,
	    link: '/'
    },
    {
        text: Rendition.Localization['DefaultPanelItems_Items_Categories'].Title,
        header: true,
        expanded: !Rendition.Localization['DefaultPanelItems_Items_Categories'].Hidden
    },
    {
        text: Rendition.Localization['DefaultPanelItems_Category_Editor'].Title,
        message: Rendition.Localization['DefaultPanelItems_Category_Editor'].Message,
        src: '/admin/img/icons/application_view_tile.png',
        proc: function () {
            Rendition.Commerce.CategoryEditor();
        }
    },
    {
        text: Rendition.Localization['DefaultPanelItems_Create_New_Item'].Title,
        src: '/admin/img/icons/tag_blue_add.png',
        message: Rendition.Localization['DefaultPanelItems_Create_New_Item'].Message,
        proc: function () {
            Rendition.Commerce.ItemEditor();
        }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Edit_Existing_Item'].Title,
	    src: '/admin/img/icons/tag_blue.png',
	    message: Rendition.Localization['DefaultPanelItems_Edit_Existing_Item'].Message,
	    proc: function () {
		    Rendition.UI.SelectButtonDialog({
		        objectName: 'shortItemList',
		        contextMenuOptions: Rendition.Commerce.ComContext,
		        autoCompleteSuffix: "where itemNumber like '%<value>%' or shortDescription like '%<value>%'",
		        mustMatchRecord: "where itemNumber = '<value>'",
		        optionDisplayValue: '<column0> - <column1>',
		        ordinal: 0,
		        inputTitle: Rendition.Localization['DefaultPanelItems_Item_Number'].Title,
		        boxTitle: Rendition.Localization['DefaultPanelItems_Enter_an_Item_Number'].Title,
		        title: Rendition.Localization['DefaultPanelItems_Enter_or_browse_for_an_Item_Number'].Title,
		        callbackProcedure: function (e) {
		            new Rendition.Commerce.ItemEditor({ itemNumber: e.selectedValue });
		        }
		    });
	    }
    },
    {
        text: Rendition.Localization['DefaultPanelItems_Orders_and_Accounts'].Title,
        header: true
    },
    {
        text: Rendition.Localization['DefaultPanelItems_Create_New_Order'].Title,
        message: Rendition.Localization['DefaultPanelItems_Create_New_Order'].Message,
        src: '/admin/img/icons/page_add.png',
        proc: function () {
            Rendition.Commerce.OrderEditor();
        }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Edit_Existing_Order'].Title,
	    src: '/admin/img/icons/page.png',
	    message: Rendition.Localization['DefaultPanelItems_Edit_Existing_Order'].Message,
	    proc: function () {
		    Rendition.Commerce.openOrderProcedure();
	    }
    },
    {
        text: Rendition.Localization['DefaultPanelItems_Create_New_Account'].Title,
        src: '/admin/img/icons/user_add.png',
        message: Rendition.Localization['DefaultPanelItems_Create_New_Account'].Message,
        proc: function () {
            Rendition.Commerce.AccountEditor();
        }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Edit_Existing_Account'].Title,
	    src: '/admin/img/icons/user.png',
	    message: Rendition.Localization['DefaultPanelItems_Edit_Existing_Account'].Message,
	    proc: function () {
		    Rendition.UI.SelectButtonDialog({
		        objectName: 'shortUserList',
		        autoCompleteSuffix: "where handle like '%<value>%' or userId like '%<value>%' or email like '%<value>%'",
		        mustMatchRecord: "where userId = '<value>'",
		        optionDisplayValue: '<column0> - <column2>',
		        contextMenuOptions: Rendition.Commerce.ComContext,
		        ordinal: 0,
		        inputTitle: Rendition.Localization['DefaultPanelItems_Account_No'].Title,
		        boxTitle: Rendition.Localization['DefaultPanelItems_Enter_An_Account_No'].Title,
		        title: Rendition.Localization['DefaultPanelItems_Open_Account'].Title,
		        callbackProcedure: function (e) {
		            new Rendition.Commerce.AccountEditor({ userId: e.selectedValue });
		        }
		    });
	    }
    },
    {
        text: Rendition.Localization['DefaultPanelItems_Content'].Title,
        header: true,
        expanded: !Rendition.Localization['DefaultPanelItems_Content'].Hidden
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Menus'].Title,
	    message: Rendition.Localization['DefaultPanelItems_Menus'].Message,
	    src: '/admin/img/icons/application_cascade.png',
	    proc: function () {
		    Rendition.Commerce.MenuEditor();
	    }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Site_Sections'].Title,
	    message: Rendition.Localization['DefaultPanelItems_Site_Sections'].Message,
	    src: '/admin/img/icons/xhtml.png',
	    proc: function () {
		    Rendition.Commerce.SiteSections();
	    }
    },
    {
        text: Rendition.Localization['DefaultPanelItems_Settings_and_Stats'].Title,
        header: true,
        expanded: !Rendition.Localization['DefaultPanelItems_Settings_and_Stats'].Hidden
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Email'].Title,
	    message: Rendition.Localization['DefaultPanelItems_Email'].Message,
	    src: '/admin/img/icons/email.png',
	    proc: function () {
		    Rendition.Commerce.EmailEditor();
	    }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_File_Manager'].Title,
	    message: Rendition.Localization['DefaultPanelItems_File_Manager'].Message,
	    src: '/admin/img/icons/folder_explore.png',
	    proc: function () {
		    Rendition.UI.FileManager();
	    }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Rendition_Help'].Title,
	    message: Rendition.Localization['DefaultPanelItems_Rendition_Help'].Message,
	    src: '/admin/img/icons/help.png',
	    proc: function () {
		    Rendition.UI.IFrameDialog({
		        title: 'Help',
		        src: 'http://help.antidote12.com/'
		    });
	    }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Import'].Title,
	    message: Rendition.Localization['DefaultPanelItems_Import'].Message,
	    src: '/admin/img/icons/database_go.png',
	    proc: function () {
		    Rendition.Commerce.ImportFile();
	    }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Image_Templates'].Title,
	    message: Rendition.Localization['DefaultPanelItems_Image_Templates'].Message,
	    src: '/admin/img/icons/layers.png',
	    proc: function () {
		    Rendition.Commerce.ImagingTemplates();
	    }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Refresh_Cache'].Title,
	    message: Rendition.Localization['DefaultPanelItems_Refresh_Cache'].Message,
	    src: '/admin/img/icons/arrow_rotate_clockwise.png',
	    proc: function () {
		    var req = [
			    'RefreshSiteData',
			    []
		    ]
		    var updateDialog = Rendition.UI.UpdateDialog({ message: Rendition.Localization['DefaultPanelItems_Reloading_site_cache'].Title });
		    var reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI(), function (e) {
		        setTimeout(function () {
		            updateDialog.close();
		        }, 2500);
		    }, this);
	    }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Search'].Title,
	    message: Rendition.Localization['DefaultPanelItems_Search'].Message,
	    src: '/admin/img/icons/magnifier.png',
	    proc: function () {
	        Rendition.Commerce.Search({ showCriteria: true });
	    }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_SEO'].Title,
	    message: Rendition.Localization['DefaultPanelItems_SEO'].Message,
	    src: '/admin/img/icons/page_white_code.png',
	    proc: function () {
	        Rendition.Commerce.Seo();
	    }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Settings'].Title,
	    message: Rendition.Localization['DefaultPanelItems_Settings'].Message,
	    src: '/admin/img/icons/database_gear.png',
	    proc: function () {
	        Rendition.Commerce.SiteEditor();
	    }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Shipping_Services'].Title,
	    message: Rendition.Localization['DefaultPanelItems_Shipping_Services'].Message,
	    src: '/admin/img/icons/lorry.png',
	    proc: function () {
	        Rendition.Commerce.ShippingEditor();
	    }
    },
    {
	    text: Rendition.Localization['DefaultPanelItems_Site_Stats'].Title,
	    message: Rendition.Localization['DefaultPanelItems_Site_Stats'].Message,
	    src: '/admin/img/icons/chart_curve.png',
	    proc: function () {
	        Rendition.Commerce.SiteStats();
	    }
    },
    {
        text: Rendition.Localization['DefaultPanelItems_Logon_Logoff'].Title,
        header: true,
        expanded: !Rendition.Localization['DefaultPanelItems_Logon_Logoff'].Hidden
    },
    {
        text: Rendition.Localization['DefaultPanelItems_Logoff'].Title,
        message: Rendition.Localization['DefaultPanelItems_Logoff'].Message,
        src: '/admin/img/icons/door_out.png',
        proc: function () {
            Rendition.Commerce.LogOff();
        }
    },
    {
        text: Rendition.Localization['DefaultPanelItems_Logon_as_another_user'].Title,
        message: Rendition.Localization['DefaultPanelItems_Logon_as_another_user'].Message,
        src: '/admin/img/icons/door_in.png',
        proc: function () {
            Rendition.Commerce.LogOn();
        }
    }
]