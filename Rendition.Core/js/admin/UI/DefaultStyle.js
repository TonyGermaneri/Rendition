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
Rendition.UI.applyDefaultStyle = function () {
    /* default tree view */
    Rendition.UI.defaultTreeViewStyle.nodeControlRect = { x: 0, y: 0, h: 16, w: 16 }
    Rendition.UI.defaultTreeViewStyle.nodeControlClosedBackground = 'transparent url(/admin/img/icons/bullet_toggle_plus.png) no-repeat 0 3px';
    Rendition.UI.defaultTreeViewStyle.nodeControlOpenBackground = 'transparent url(/admin/img/icons/bullet_toggle_minus.png) no-repeat 0 3px';
    Rendition.UI.defaultTreeViewStyle.nodeBackground = 'brown';
    Rendition.UI.defaultTreeViewStyle.nodeHorizontalOffset = 12;
    Rendition.UI.defaultTreeViewStyle.labelFont = 'normal 12px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    Rendition.UI.defaultTreeViewStyle.nodeRect = { x: 0, y: 0, h: 19, w: 4 }
    Rendition.UI.defaultTreeViewStyle.labelBackground = 'transparent';
    Rendition.UI.defaultTreeViewStyle.labelFontColor = 'black';
    Rendition.UI.defaultTreeViewStyle.labelSelectedBackground = '#3399ff';
    Rendition.UI.defaultTreeViewStyle.labelSelectedFontColor = 'white';
    Rendition.UI.defaultTreeViewStyle.labelSelectedBorder = 'dashed 1px brown';
    Rendition.UI.defaultTreeViewStyle.background = 'white';
    Rendition.UI.defaultTreeViewStyle.loadingImage = ' <img style="margin-bottom:-2px;" src="/admin/img/status_anim.gif" alt="Loading...">';
    /* default grid style */
    Rendition.UI.defaultGridStyle.rect = { x: 0, y: 0, h: 0, w: 0 }
    Rendition.UI.defaultGridStyle.editCellFont = 'normal 11px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    Rendition.UI.defaultGridStyle.headerCellSpacing = 4;
    Rendition.UI.defaultGridStyle.editCellBackground = 'url(/admin/img/a_g_celledit.gif) repeat';
    Rendition.UI.defaultGridStyle.editCellColor = 'black';
    Rendition.UI.defaultGridStyle.insertrowBackground = 'DarkOliveGreen';
    Rendition.UI.defaultGridStyle.editingRecordBackground = 'url(/admin/img/a_g_editrow.gif) repeat';
    Rendition.UI.defaultGridStyle.headerCellRect = { x: 0, y: 0, h: 17, w: 2 }
    Rendition.UI.defaultGridStyle.headerRect = { x: 0, y: 0, h: 17, w: 0 }
    Rendition.UI.defaultGridStyle.orderArrowAlign = 'center';
    Rendition.UI.defaultGridStyle.orderArrowRect = { x: 0, y: 9, h: 8, w: 8 }
    Rendition.UI.defaultGridStyle.orderArrowDescBackground = 'url(/admin/img/arrow_gray_up.gif) no-repeat';
    Rendition.UI.defaultGridStyle.orderArrowAscBackground = 'url(/admin/img/arrow_gray_down.gif) no-repeat';
    Rendition.UI.defaultGridStyle.gridRect = { x: 0, y: 0, h: 0, w: 0 }
    Rendition.UI.defaultGridStyle.gridBackground = 'transparent';
    Rendition.UI.defaultGridStyle.headerBackground = 'transparent';
    Rendition.UI.defaultGridStyle.headerCellBackground = 'url(/admin/img/a_g_colHeader.gif) repeat';
    Rendition.UI.defaultGridStyle.rowRect = { x: 0, y: 0, h: 18, w: 0 }
    Rendition.UI.defaultGridStyle.rowHeaderRect = { x: 0, y: 0, h: 18, w: 30 }
    Rendition.UI.defaultGridStyle.headerCellFont = 'normal 11px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    Rendition.UI.defaultGridStyle.headerCellFontColor = 'black';
    Rendition.UI.defaultGridStyle.headerCellAlignment = 'left';
    Rendition.UI.defaultGridStyle.headerCellSelectBackground = 'Tomato';
    Rendition.UI.defaultGridStyle.headerCellSelectFontColor = 'DarkBlue';
    Rendition.UI.defaultGridStyle.statusColor = 'black';
    Rendition.UI.defaultGridStyle.fetchingBackground = '';
    Rendition.UI.defaultGridStyle.idleBackground = '';
    Rendition.UI.defaultGridStyle.pageBuffer = 3;
    Rendition.UI.defaultGridStyle.cellFont = 'normal 11px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    Rendition.UI.defaultGridStyle.headerCellPadding = { t: 1, r: 0, b: 0, l: 7 }
    Rendition.UI.defaultGridStyle.cellPadding = { t: 0, r: 0, b: 0, l: 5 }
    Rendition.UI.defaultGridStyle.cellBackground = 'url(/admin/img/a_g_cellBackground.gif) repeat';
    Rendition.UI.defaultGridStyle.cellBorder = 'solid 1px #CCC';
    Rendition.UI.defaultGridStyle.cellFontColor = 'Black';
    Rendition.UI.defaultGridStyle.cellSelectFontColor = 'White';
    Rendition.UI.defaultGridStyle.cellSelectBackground = 'url(/admin/img/a_g_cellSelectBackground.gif) repeat';
    Rendition.UI.defaultGridStyle.rowHeaderFont = 'normal 11px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    Rendition.UI.defaultGridStyle.rowHeaderTextAlign = 'left';
    Rendition.UI.defaultGridStyle.rowHeaderBackground = 'url(/admin/img/a_g_rowHeader.gif) repeat';
    Rendition.UI.defaultGridStyle.rowHeaderFontColor = 'Black';
    Rendition.UI.defaultGridStyle.rowHeaderHoverFontColor = 'OrangeRed';
    Rendition.UI.defaultGridStyle.rowHeaderBorder = 'solid 1px GoldenRod';
    Rendition.UI.defaultGridStyle.rowHeaderHoverBackground = 'MediumSpringGreen';
    Rendition.UI.defaultGridStyle.rowHeaderSelectFontColor = 'White';
    Rendition.UI.defaultGridStyle.rowHeaderSelectBackground = 'url(/admin/img/a_g_rowHeaderSelect.gif) repeat';
    Rendition.UI.defaultGridStyle.rowSelectedBackground = 'Khaki';
    Rendition.UI.defaultGridStyle.rowSelectedFontColor = 'Maroon ';
    Rendition.UI.defaultGridStyle.cellHoverBackground = 'HoneyDew';
    Rendition.UI.defaultGridStyle.cellHoverFontColor = 'Gold';
    Rendition.UI.defaultGridStyle.selectorBorder = 'solid 1px FireBrick';
    Rendition.UI.defaultGridStyle.selectorBackground = 'AliceBlue';
    Rendition.UI.defaultGridStyle.sizerRect = { x: 0, y: 0, h: 17, w: 6 }
    Rendition.UI.defaultGridStyle.sizerBackground = 'Green';
    Rendition.UI.defaultGridStyle.loadingBackground = 'Tomato';
    Rendition.UI.defaultGridStyle.menuBackground = 'OrangeRed';
    Rendition.UI.defaultGridStyle.activeBackground = 'BlueViolet';
    Rendition.UI.defaultGridStyle.totalsRecordBackground = 'Orange';
    Rendition.UI.defaultGridStyle.previewBackground = 'lightYellow';
    Rendition.UI.defaultGridStyle.previewFontColor = 'black';
    Rendition.UI.defaultGridStyle.previewBorder = 'solid 1px black';
    Rendition.UI.defaultGridStyle.previewPaddingRect = { t: 5, r: 5, b: 5, l: 5 }
    Rendition.UI.defaultGridStyle.previewRect = { x: 15, y: 0, h: 0, w: 0 }
    Rendition.UI.defaultGridStyle.scrollBarWidth = 17;
    Rendition.UI.defaultGridStyle.searchFontColor = 'Dark Green';
    Rendition.UI.defaultGridStyle.searchBackground = 'Chartreuse';
    Rendition.UI.defaultGridStyle.rowHeaderSearchRowFontColor = 'Khaki';
    Rendition.UI.defaultGridStyle.rowHeaderSearchBackground = 'Light Goldenrod Yellow';
    Rendition.UI.defaultGridStyle.aggregateRowTitle = '&crarr;';
    Rendition.UI.defaultGridStyle.newRowTitle = '&diams;';
    Rendition.UI.defaultGridStyle.aggregateCellLoading = '<img src="img/ajax-loader2.gif" alt="Loading...">';
    Rendition.UI.defaultGridStyle.viewPortBackground = 'url(/admin/img/darkgray_background.jpg) repeat-x';
    Rendition.UI.defaultGridStyle.viewPortBorder = 'solid 1px darkgray';
    Rendition.UI.defaultGridStyle.headerBorder = 'solid 1px darkgray';
    Rendition.UI.defaultGridStyle.cellRect = { x: 0, y: 0, h: 18, w: 0 };
    Rendition.UI.defaultGridStyle.detailsPaneRect = { x: 0, y: 0, h: 79, w: 0 }
    Rendition.UI.defaultGridStyle.detailsPaneBackground = 'url(/admin/img/bwgradient.jpg) repeat-x';
    Rendition.UI.defaultGridStyle.detailsPaneColor = 'black';
    Rendition.UI.defaultGridStyle.detailsPaneBorder = 'solid 1px lightgray';
    Rendition.UI.defaultGridStyle.detailsPaneHeadingFont = 'bold 12px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    Rendition.UI.defaultGridStyle.detailsPaneFont = 'normal 11px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    /* default tab bar style */
    Rendition.UI.tabStyle.charToPx = 8;
    Rendition.UI.tabStyle.horizontalSpacing = -5;
    Rendition.UI.tabStyle.verticalSpacing = 1;
    Rendition.UI.tabStyle.tabBarRect = { x: 0, y: 0, h: 17, w: 0 }
    Rendition.UI.tabStyle.tabBarBackground = 'url(/admin/img/a_tabBar_background.gif) repeat-x';
    Rendition.UI.tabStyle.contentBackground = 'url(/admin/img/a_tabContent.gif)';
    Rendition.UI.tabStyle.contentRect = { x: 0, y: 1, h: 0, w: 0 }
    /* default tab style */
    Rendition.UI.tabElementStyle.tabLeftRect = { x: 0, y: 2, h: 15, w: 4 }
    Rendition.UI.tabElementStyle.tabRightRect = { x: 0, y: 2, h: 15, w: 4 }
    Rendition.UI.tabElementStyle.tabCenterRect = { x: 0, y: 2, h: 15, w: 0 }
    Rendition.UI.tabElementStyle.textRect = { x: 0, y: 1, h: 15, w: 0 }
    Rendition.UI.tabElementStyle.maxTabRect = { x: 0, y: 0, h: 0, w: 0 }
    Rendition.UI.tabElementStyle.minTabRect = { x: 0, y: 0, h: 0, w: 0 }
    Rendition.UI.tabElementStyle.tabLeftBackground = 'url(/admin/img/a_tabLeft.gif)';
    Rendition.UI.tabElementStyle.tabRightBackground = 'url(/admin/img/a_tabRight.gif)';
    Rendition.UI.tabElementStyle.tabCenterBackground = 'url(/admin/img/a_tabCenter.gif) repeat-x';
    Rendition.UI.tabElementStyle.tabLeftHoverBackground = 'url(/admin/img/a_tabLeft.gif)';
    Rendition.UI.tabElementStyle.tabRightHoverBackground = 'url(/admin/img/a_tabRight.gif)';
    Rendition.UI.tabElementStyle.tabCenterHoverBackground = 'url(/admin/img/a_tabCenter.gif) repeat-x';
    Rendition.UI.tabElementStyle.tabLeftActiveBackground = 'url(/admin/img/a_tabActiveLeft.gif)';
    Rendition.UI.tabElementStyle.tabRightActiveBackground = 'url(/admin/img/a_tabActiveRight.gif)';
    Rendition.UI.tabElementStyle.tabCenterActiveBackground = 'url(/admin/img/a_tabActiveCenter.gif) repeat-x';
    Rendition.UI.tabElementStyle.font = 'normal 12px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    Rendition.UI.tabElementStyle.fontColor = 'black';
    Rendition.UI.tabElementStyle.fontHoverColor = 'black';
    Rendition.UI.tabElementStyle.fontActiveColor = 'black';
    Rendition.UI.tabElementStyle.textAlignment = 'center';
    /* default cutter bar style */
    Rendition.UI.cutterStyle.cutterBackground = 'transparent';
    Rendition.UI.cutterStyle.leftTopBackground = '#f0f0f0';
    Rendition.UI.cutterStyle.rightBottomBackground = '#f0f0f0';
    Rendition.UI.cutterStyle.sizerRect = { x: 0, y: 0, h: 6, w: 6 }
    Rendition.UI.cutterStyle.sizerHBackground = 'url(/admin/img/a_cutter_h.gif) repeat-y';
    Rendition.UI.cutterStyle.sizerVBackground = 'url(/admin/img/a_cutter_v.gif) repeat-x';
    Rendition.UI.cutterStyle.minerHBackground = 'url(/admin/img/a_cutter_h_miner.png)';
    Rendition.UI.cutterStyle.maxerVBackground = 'url(/admin/img/a_cutter_v_miner.png)';
    Rendition.UI.cutterStyle.maxerHBackground = 'url(/admin/img/a_cutter_h_maxer.png)';
    Rendition.UI.cutterStyle.minerVBackground = 'url(/admin/img/a_cutter_v_maxer.png)';
    Rendition.UI.cutterStyle.maxerHRect = { x: -1, y: 0, h: 27, w: 8 }
    Rendition.UI.cutterStyle.minerHRect = { x: -1, y: 0, h: 27, w: 8 }
    Rendition.UI.cutterStyle.maxerVRect = { x: 0, y: -1, h: 8, w: 27 }
    Rendition.UI.cutterStyle.minerVRect = { x: 0, y: -1, h: 8, w: 27 }
    /* default desktop menu bar style */
    Rendition.UI.desktopMenuBarStyle.rect = { x: 0, y: 0, h: 27, w: 0 }
    Rendition.UI.desktopMenuBarStyle.background = 'url(/admin/img/a_d_menu.gif) repeat-x';
    Rendition.UI.desktopMenuBarStyle.horizontalSpacing = 3;
    Rendition.UI.desktopMenuBarStyle.verticalSpacing = 3;
    Rendition.UI.desktopMenuBarStyle.orientation = 0;
    /* default desktop menu bar option style */
    Rendition.UI.desktopMenuBarElementStyle.centerRect = { x: 0, y: 1, h: 24, w: 0 }
    Rendition.UI.desktopMenuBarElementStyle.leftRect = { x: 0, y: 1, h: 24, w: 5 }
    Rendition.UI.desktopMenuBarElementStyle.rightRect = { x: 0, y: 1, h: 24, w: 5 }
    Rendition.UI.desktopMenuBarElementStyle.textRect = { x: 0, y: 4, h: 19, w: 0 }
    Rendition.UI.desktopMenuBarElementStyle.hasIcon = false;
    Rendition.UI.desktopMenuBarElementStyle.centerBackground = 'url(/admin/img/a_d_menu_center.gif) repeat-x';
    Rendition.UI.desktopMenuBarElementStyle.leftBackground = 'url(/admin/img/a_d_menu_left.gif) no-repeat';
    Rendition.UI.desktopMenuBarElementStyle.rightBackground = 'url(/admin/img/a_d_menu_right.gif) no-repeat';
    Rendition.UI.desktopMenuBarElementStyle.centerHoverBackground = 'url(/admin/img/a_d_menu_center_hover.gif) repeat-x';
    Rendition.UI.desktopMenuBarElementStyle.leftHoverBackground = 'url(/admin/img/a_d_menu_left_hover.gif) no-repeat';
    Rendition.UI.desktopMenuBarElementStyle.rightHoverBackground = 'url(/admin/img/a_d_menu_right_hover.gif) no-repeat';
    Rendition.UI.desktopMenuBarElementStyle.font = 'normal 12px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    Rendition.UI.desktopMenuBarElementStyle.textAlignment = 'center';
    Rendition.UI.desktopMenuBarElementStyle.textColor = '#555';
    Rendition.UI.desktopMenuBarElementStyle.childArrowRect = { x: -26, y: 5, h: 0, w: 0 }
    Rendition.UI.desktopMenuBarElementStyle.childArrowBackground = 'transparent';
    Rendition.UI.desktopMenuBarElementStyle.checkRect = { x: 7, y: 7, h: 16, w: 16 }
    Rendition.UI.desktopMenuBarElementStyle.checkBackground = 'url(/admin/img/check.png) no-repeat';
    /* default menu bar style */
    Rendition.UI.defaultMenuBarStyle.rect = { x: 0, y: 0, h: 27, w: 0 }
    Rendition.UI.defaultMenuBarStyle.background = 'url(/admin/img/a_d_menu.gif) repeat-x';
    Rendition.UI.defaultMenuBarStyle.horizontalSpacing = 3;
    Rendition.UI.defaultMenuBarStyle.verticalSpacing = 3;
    Rendition.UI.defaultMenuBarStyle.orientation = 0;
    /* default menu bar option style */
    Rendition.UI.menuBarElementStyle.centerRect = { x: 0, y: 1, h: 24, w: 0 }
    Rendition.UI.menuBarElementStyle.leftRect = { x: 0, y: 1, h: 24, w: 5 }
    Rendition.UI.menuBarElementStyle.rightRect = { x: 0, y: 1, h: 24, w: 5 }
    Rendition.UI.menuBarElementStyle.textRect = { x: 0, y: 4, h: 19, w: 0 }
    Rendition.UI.menuBarElementStyle.hasIcon = false;
    Rendition.UI.menuBarElementStyle.centerBackground = 'url(/admin/img/a_d_menu_center.gif) repeat-x';
    Rendition.UI.menuBarElementStyle.leftBackground = 'url(/admin/img/a_d_menu_left.gif) no-repeat';
    Rendition.UI.menuBarElementStyle.rightBackground = 'url(/admin/img/a_d_menu_right.gif) no-repeat';
    Rendition.UI.menuBarElementStyle.centerHoverBackground = 'url(/admin/img/a_d_menu_center_hover.gif) repeat-x';
    Rendition.UI.menuBarElementStyle.leftHoverBackground = 'url(/admin/img/a_d_menu_left_hover.gif) no-repeat';
    Rendition.UI.menuBarElementStyle.rightHoverBackground = 'url(/admin/img/a_d_menu_right_hover.gif) no-repeat';
    Rendition.UI.menuBarElementStyle.font = 'normal 12px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    Rendition.UI.menuBarElementStyle.textAlignment = 'center';
    Rendition.UI.menuBarElementStyle.textColor = '#000';
    Rendition.UI.menuBarElementStyle.childArrowRect = { x: -26, y: 5, h: 0, w: 0 }
    Rendition.UI.menuBarElementStyle.childArrowBackground = 'transparent';
    Rendition.UI.menuBarElementStyle.checkRect = { x: 7, y: 7, h: 16, w: 16 }
    Rendition.UI.menuBarElementStyle.checkBackground = 'url(/admin/img/check.png) no-repeat';
    /* default context menu style */
    Rendition.UI.contextStyle.rect = { x: 0, y: 0, h: 5, w: 0 }
    Rendition.UI.contextStyle.childRect = { x: -44, y: -1, h: 0, w: 0 }
    Rendition.UI.contextStyle.maxRect = { x: 0, y: 0, h: 0, w: 0 }
    Rendition.UI.contextStyle.minRect = { x: 0, y: 0, h: 10, w: 350 }
    Rendition.UI.contextStyle.contentRect = { x: 0, y: 2, h: -7, w: -4 }
    Rendition.UI.contextStyle.nRect = { x: 4, y: 0, h: 2, w: -8 }
    Rendition.UI.contextStyle.sRect = { x: 4, y: -1, h: 4, w: -8 }
    Rendition.UI.contextStyle.eRect = { x: 0, y: 4, h: -9, w: 4 }
    Rendition.UI.contextStyle.wRect = { x: 0, y: 4, h: -9, w: 4 }
    Rendition.UI.contextStyle.nwRect = { x: 0, y: 0, h: 4, w: 4 }
    Rendition.UI.contextStyle.neRect = { x: 0, y: 0, h: 4, w: 4 }
    Rendition.UI.contextStyle.seRect = { x: 0, y: 0, h: 5, w: 4 }
    Rendition.UI.contextStyle.swRect = { x: 0, y: 0, h: 5, w: 4 }
    Rendition.UI.contextStyle.downRect = { x: 0, y: -2, h: 10, w: 10 }
    Rendition.UI.contextStyle.upRect = { x: 0, y: 2, h: 10, w: 10 }
    Rendition.UI.contextStyle.scrollOffset = { x: 0, y: 0, h: -28, w: 0 }
    Rendition.UI.contextStyle.menuBackground = 'transparent';
    Rendition.UI.contextStyle.contentBackground = '#fdfdfd';
    Rendition.UI.contextStyle.nBackground = 'url(/admin/img/a_context_n.png) repeat-x';
    Rendition.UI.contextStyle.sBackground = 'url(/admin/img/a_context_s.png) repeat-x';
    Rendition.UI.contextStyle.eBackground = 'url(/admin/img/a_context_e.png) repeat-y';
    Rendition.UI.contextStyle.wBackground = 'url(/admin/img/a_context_w.png) repeat-y';
    Rendition.UI.contextStyle.nwBackground = 'url(/admin/img/a_context_nw.png) no-repeat';
    Rendition.UI.contextStyle.neBackground = 'url(/admin/img/a_context_ne.png) no-repeat';
    Rendition.UI.contextStyle.seBackground = 'url(/admin/img/a_context_se.png) no-repeat';
    Rendition.UI.contextStyle.swBackground = 'url(/admin/img/a_context_sw.png) no-repeat';
    Rendition.UI.contextStyle.downBackground = 'url(/admin/img/arrow_black_down.gif) no-repeat';
    Rendition.UI.contextStyle.upBackground = 'url(/admin/img/arrow_black_up.gif) no-repeat';
    Rendition.UI.contextStyle.downDisabledBackground = 'url(/admin/img/arrow_gray_down.gif) no-repeat';
    Rendition.UI.contextStyle.upDisabledBackground = 'url(/admin/img/arrow_gray_up.gif) no-repeat';
    Rendition.UI.contextStyle.icons = true;
    Rendition.UI.contextStyle.orientation = 1;
    Rendition.UI.contextStyle.verticalSpacing = 3;
    Rendition.UI.contextStyle.horizontalSpacing = 5;
    /* default context menu option style */
    Rendition.UI.ContextMenuElementStyle.centerRect = { x: -15, y: 2, h: 22, w: -28 }
    Rendition.UI.ContextMenuElementStyle.leftRect = { x: 3, y: 2, h: 22, w: 6 }
    Rendition.UI.ContextMenuElementStyle.rightRect = { x: 0, y: 2, h: 22, w: 6 }
    Rendition.UI.ContextMenuElementStyle.textRect = { x: 0, y: 4, h: 22, w: 0 }
    Rendition.UI.ContextMenuElementStyle.checkRect = { x: 6, y: 7, h: 16, w: 16 }
    Rendition.UI.ContextMenuElementStyle.iconRect = { x: 5, y: 2, h: 22, w: 21 }
    Rendition.UI.ContextMenuElementStyle.hasIcon = true;
    Rendition.UI.ContextMenuElementStyle.childArrowRect = { x: -12, y: 9, h: 8, w: 8 }
    Rendition.UI.ContextMenuElementStyle.iconBackground = 'transparent';
    Rendition.UI.ContextMenuElementStyle.iconHoverBackground = 'url(/admin/img/a_contextHighlight_center.gif) repeat-x';
    Rendition.UI.ContextMenuElementStyle.centerBackground = 'transparent';
    Rendition.UI.ContextMenuElementStyle.leftBackground = 'transparent';
    Rendition.UI.ContextMenuElementStyle.rightBackground = 'transparent';
    Rendition.UI.ContextMenuElementStyle.centerBackground = 'transparent';
    Rendition.UI.ContextMenuElementStyle.leftBackground = 'transparent';
    Rendition.UI.ContextMenuElementStyle.rightBackground = 'transparent';
    Rendition.UI.ContextMenuElementStyle.centerHoverBackground = 'url(/admin/img/a_contextHighlight_center.gif) repeat-x';
    Rendition.UI.ContextMenuElementStyle.leftHoverBackground = 'url(/admin/img/a_contextHighlight_left.gif) no-repeat';
    Rendition.UI.ContextMenuElementStyle.rightHoverBackground = 'url(/admin/img/a_contextHighlight_right.gif) no-repeat';
    Rendition.UI.ContextMenuElementStyle.hoverTextColor = '#CCC';
    Rendition.UI.ContextMenuElementStyle.font = 'normal 12px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    Rendition.UI.ContextMenuElementStyle.textAlignment = 'left';
    Rendition.UI.ContextMenuElementStyle.textColor = '#000';
    Rendition.UI.ContextMenuElementStyle.childArrowBackground = 'url(/admin/img/arrow_black_right.gif) no-repeat';
    Rendition.UI.ContextMenuElementStyle.checkBackground = 'url(/admin/img/check.png) no-repeat';
    /* default desktop [0] background default */
    Rendition.UI.deskStyle.background = 'white';
    Rendition.UI.deskStyle.rect = { x: 0, y: 0, h: 0, w: 0 }
    Rendition.UI.deskStyle.scroll = false;
    /* default task bar style */
    Rendition.UI.taskStyle.rect = { x: 0, y: 0, h: 28, w: 0 }
    Rendition.UI.taskStyle.background = 'url(/admin/img/a_task.gif) repeat-x';
    Rendition.UI.taskStyle.horizontalSpacing = 4;
    /*  create a default task element style */
    Rendition.UI.taskElementStyle.charToPx = 7;
    Rendition.UI.taskElementStyle.maxWidth = 250;
    Rendition.UI.taskElementStyle.textRect = { x: 8, y: 6, h: 20, w: 0 }
    Rendition.UI.taskElementStyle.centerRect = { x: 0, y: 3, h: 23, w: 0 }
    Rendition.UI.taskElementStyle.leftRect = { x: 2, y: 3, h: 23, w: 10 }
    Rendition.UI.taskElementStyle.rightRect = { x: 0, y: 3, h: 23, w: 10 }
    Rendition.UI.taskElementStyle.centerBackground = 'url(/admin/img/a_taskCenter.gif) repeat-x';
    Rendition.UI.taskElementStyle.leftBackground = 'url(/admin/img/a_taskLeft.gif) no-repeat';
    Rendition.UI.taskElementStyle.rightBackground = 'url(/admin/img/a_taskRight.gif) no-repeat';
    Rendition.UI.taskElementStyle.centerHoverBackground = '#000';
    Rendition.UI.taskElementStyle.leftHoverBackground = '#000';
    Rendition.UI.taskElementStyle.rightHoverBackground = '#000';
    Rendition.UI.taskElementStyle.font = 'normal 12px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    Rendition.UI.taskElementStyle.textAlignment = 'center';
    /* 	create a default window style */
    Rendition.UI.dialogStyle.xCharToPx = 10;
    Rendition.UI.dialogStyle.yCharToPx = 10;
    Rendition.UI.dialogStyle.nRect = { x: 10, y: 0, h: 4, w: -20 }
    Rendition.UI.dialogStyle.sRect = { x: 10, y: 0, h: 4, w: -20 }
    Rendition.UI.dialogStyle.eRect = { x: 0, y: 25, h: -45, w: 4 }
    Rendition.UI.dialogStyle.wRect = { x: 0, y: 25, h: -45, w: 4 }
    Rendition.UI.dialogStyle.nwRect = { x: 0, y: 0, h: 25, w: 10 }
    Rendition.UI.dialogStyle.neRect = { x: 0, y: 0, h: 25, w: 10 }
    Rendition.UI.dialogStyle.seRect = { x: 0, y: 0, h: 20, w: 10 }
    Rendition.UI.dialogStyle.swRect = { x: 0, y: 0, h: 20, w: 10 }
    Rendition.UI.dialogStyle.minimumRect = { x: 0, y: 0, h: 75, w: 180 }
    Rendition.UI.dialogStyle.titleCenterRect = { x: 4, y: 4, h: 22, w: 0 }
    Rendition.UI.dialogStyle.titleLeftRect = { x: 4, y: 4, h: 22, w: 4 }
    Rendition.UI.dialogStyle.titleRightRect = { x: -4, y: 4, h: 22, w: 4 }
    Rendition.UI.dialogStyle.statusBarCenterRect = { x: 0, y: -4, h: 17, w: 0 }
    Rendition.UI.dialogStyle.statusBarLeftRect = { x: 0, y: -4, h: 17, w: 4 }
    Rendition.UI.dialogStyle.statusBarRightRect = { x: 0, y: -4, h: 17, w: 4 }
    Rendition.UI.dialogStyle.titleTextRect = { x: 3, y: 0, h: 17, w: 0 }
    Rendition.UI.dialogStyle.minRect = { x: -78, y: 1, h: 15, w: 19 }
    Rendition.UI.dialogStyle.maxRect = { x: -58, y: 1, h: 15, w: 19 }
    Rendition.UI.dialogStyle.restoreRect = { x: -58, y: 1, h: 15, w: 19 }
    Rendition.UI.dialogStyle.closeRect = { x: -38, y: 1, h: 15, w: 19 }
    Rendition.UI.dialogStyle.contentRect = { x: 4, y: 0, h: -4, w: -8 }
    Rendition.UI.dialogStyle.dialogBackground = 'transparent';
    Rendition.UI.dialogStyle.closeBackground = 'url(/admin/img/a_close.gif) no-repeat';
    Rendition.UI.dialogStyle.minBackground = 'url(/admin/img/a_minimize.gif) no-repeat';
    Rendition.UI.dialogStyle.maxBackground = 'url(/admin/img/a_maximize.gif) no-repeat';
    Rendition.UI.dialogStyle.restoreBackground = 'url(/admin/img/a_restore.gif) no-repeat';
    Rendition.UI.dialogStyle.restoreHoverBackground = 'url(/admin/img/a_restore_hover.gif) no-repeat';
    Rendition.UI.dialogStyle.closeHoverBackground = 'url(/admin/img/a_close_hover.gif) no-repeat';
    Rendition.UI.dialogStyle.minHoverBackground = 'url(/admin/img/a_minimize_hover.gif) no-repeat';
    Rendition.UI.dialogStyle.maxHoverBackground = 'url(/admin/img/a_maximize_hover.gif) no-repeat';
    Rendition.UI.dialogStyle.contentBackground = '#f0f0f0';
    Rendition.UI.dialogStyle.nwBackground = 'url(/admin/img/a_nw.gif) no-repeat';
    Rendition.UI.dialogStyle.neBackground = 'url(/admin/img/a_ne.gif) no-repeat';
    Rendition.UI.dialogStyle.seBackground = 'url(/admin/img/a_se.gif) no-repeat';
    Rendition.UI.dialogStyle.swBackground = 'url(/admin/img/a_sw.gif) no-repeat';
    Rendition.UI.dialogStyle.nBackground = 'url(/admin/img/a_n.gif) repeat-x';
    Rendition.UI.dialogStyle.eBackground = 'url(/admin/img/a_e.gif) repeat-y';
    Rendition.UI.dialogStyle.sBackground = 'url(/admin/img/a_s.gif) repeat-x';
    Rendition.UI.dialogStyle.wBackground = 'url(/admin/img/a_w.gif) repeat-y';
    Rendition.UI.dialogStyle.titleFont = 'normal 14px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
    Rendition.UI.dialogStyle.titleCenterBackground = 'url(/admin/img/a_title.gif) repeat-x';
    Rendition.UI.dialogStyle.titleLeftBackground = 'url(/admin/img/a_title.gif) repeat-x';
    Rendition.UI.dialogStyle.titleRightBackground = 'url(/admin/img/a_title.gif) repeat-x';
    Rendition.UI.dialogStyle.statusBarCenterBackground = 'url(/admin/img/a_status.gif) repeat-x';
    Rendition.UI.dialogStyle.statusBarLeftBackground = 'url(/admin/img/a_status.gif) repeat-x fixed bottom';
    Rendition.UI.dialogStyle.statusBarRightBackground = 'url(/admin/img/a_status.gif) repeat-x fixed bottom';
    Rendition.UI.dialogStyle.titleTextAlignment = 'left';
    Rendition.UI.dialogStyle.titleColor = '#000';
    Rendition.UI.dialogStyle.modalBackground = 'url(/admin/img/50PctAlphaBlackDot.png)';
    Rendition.UI.dialogStyle.previewBackground = 'url(/admin/img/50PctAlphaBlackDot.png)';
}