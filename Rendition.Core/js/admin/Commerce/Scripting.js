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
* Scripting editor.
* @constructor
* @name Rendition.Commerce.Scripting
*/
Rendition.Commerce.Scripting = function (args) {
	var instance = {}
	if (args === undefined) { args = {} }
	instance.eventTypes = [
        ['AddedToCart', 'AddedToCart'],
        ['AddingToCart', 'AddingToCart'],
        ['BeginRequest', 'BeginRequest'],
        ['CalculatingDiscount', 'CalculatingDiscount'],
        ['CreatingEmail', 'CreatingEmail'],
        ['CreatingItem', 'CreatingItem'],
        ['CreatingUser', 'CreatingUser'],
        ['Disposing', 'Disposing'],
        ['EndRequest', 'EndRequest'],
        ['Initializing', 'Initializing'],
        ['LineUpdated', 'LineUpdated'],
        ['LoggedOff', 'LoggedOff'],
        ['LoggedOn', 'LoggedOn'],
        ['OpeningPaymentGateway', 'OpeningPaymentGateway'],
        ['PlacedOrder', 'PlacedOrder'],
        ['PlacingOrder', 'PlacingOrder'],
        ['RecalculatedCart', 'RecalculatedCart'],
        ['RecalculatedOrder', 'RecalculatedOrder'],
        ['RenderedItemImage', 'RenderedItemImage'],
        ['RenderingItemImage', 'RenderingItemImage'],
        ['ShipmentUpdated', 'ShipmentUpdated'],
        ['StatusChanged', 'StatusChanged'],
        ['StatusChanging', 'StatusChanging'],
        ['UIInitializing', 'UIInitializing']
	]
	instance.parentNode = args.parentNode;
	instance.languages = [['CSharp', 'CSharp']];
	instance.defaultScript =
	'using System;\n' +
	'public class script {\n' +
	'public static string main(object sender, EventArgs e){\n' +
	'		\n' +
	'		/* Your code goes here */\n' +
	'		\n' +
	'		return "Output Console Message";\n' +
	'	}\n' +
	'}'
	instance.init = function () {
		if (args.parentNode === undefined) {
			instance.dialog = Rendition.UI.dialogWindow({
			    rect: { 
                    x: Rendition.UI.dialogPosition.x,
			        y: Rendition.UI.dialogPosition.y,
                    h: document.documentElement.clientHeight - 100, w: 650
			    },
				title: Rendition.Localization['Scripting_Scripting_Editor'].Title,
				rememberPosition: true,
				id: 'scriptingEditorAllByItself'
			});
			args.parentNode = instance.dialog.content;
		}
		instance.rootCutter = Rendition.UI.CutterBar({
			parentNode: args.parentNode,
			autoResize: false,
			id: 'scriptingCutter1',
			position: 170
		});
		instance.cutter2 = Rendition.UI.CutterBar({
			parentNode: instance.rootCutter.cutters[1],
			autoResize: false,
			id: 'scriptingCutter2',
			orientation: 1,
			position: 200
		});
		Rendition.UI.appendEvent('resize', instance.cutter2, instance.cutterResize, false);
		instance.grid = Rendition.UI.Grid({
			objectName: 'eventHandlers',
			editMode: 3,
			parentNode: instance.rootCutter.cutters[0],
			genericEditor: true,
			cellclick: instance.cellclick
		});
		instance.cutterResize();
		instance.cutter2.cutters[0].innerHTML = '<div style="width:5000px">Ready...</div>';
		instance.cutter2.cutters[0].style.overflow = 'scroll';
		instance.cutter2.cutters[1].style.overflow = 'scroll';
		instance.cutter2.cutters[1].style.overflowX = 'hidden';
		return instance;
	}
	instance.cutterResize = function () {
		instance.cutter2.cutters[0].style.background = 'black';
		instance.cutter2.cutters[0].style.color = 'white';
		instance.cutter2.cutters[0].style.fontFamily = 'Consolas, Lucida Console, Courier New, courier';
		instance.cutter2.cutters[0].style.padding = '3px';
	}
	instance.formStruct = function (dataSet, callbackProcedure, rowIndex) {
		var a =
		{
			dataSetIndex: rowIndex - 1,
			callbackProcedure: callbackProcedure,
			dataSet: dataSet,
			groups: [
				{
					name: Rendition.Localization['Scripting_General'].Title,
					expanded: true,
					inputs: [
						{
							columnName: 'name'
						},
						{
							columnName: 'enabled'
						},
						{
							columnName: 'interval'
						},
						{
							columnName: 'language',
							inputType: 'select',
							options: instance.languages
						},
						{
							columnName: 'eventType',
							inputType: 'select',
							options: instance.eventTypes
			            }
					]
				},
				{
					name: Rendition.Localization['Scripting_Source_Code'].Title,
					expanded: true,
					inputs: [
						{
							columnName: 'sourceCode',
							inputType: 'codearea',
							language: 'csharp',
							saveProcedure: function () {
								instance.editor.save();
							}
						}
					]
				},
                {
                    name: Rendition.Localization['Scripting_Runtime_Information'].Title,
                    expanded: true,
					inputs: [
                        {
                            columnName: 'startTime'
                        },
                        {
                            columnName: 'lastRun'
                        },
                        {
                            columnName: 'lock'
                        },
						{
							columnName: 'error'
			            },
                        {
			                columnName: 'errorDesc',
			                inputType: 'rte'
			            }
					]
                }
			]
		}
		return a;
	}
	instance.cellclick = function (e, grid, element, row, column, selection, data, header) {
		instance.cutter2.cutters[1].innerHTML = '';
		if (row != grid.newRowIndex) {
			instance.menuBarElements = [];
			instance.menuBarElements[0] = Rendition.UI.MenuOption();
			instance.menuBarElements[0].text = Rendition.Localization['Scripting_Save_Script'].Title;
			Rendition.UI.appendEvent('click', instance.menuBarElements[0], function (e) {
				instance.editor.save();
				return false;
			}, false);
			instance.menuBarElements[1] = Rendition.UI.MenuOption();
			instance.menuBarElements[1].text = Rendition.Localization['Scripting_Preview_Script'].Title;
			Rendition.UI.appendEvent('click', instance.menuBarElements[1], function (e) {
				instance.previewScript(grid.getRecord(row, 'taskId'));
				return false;
			}, false);
			instance.menuBarElements[2] = Rendition.UI.MenuOption();
			instance.menuBarElements[2].text = Rendition.Localization['Scripting_Clear_Console'].Title;
			Rendition.UI.appendEvent('click', instance.menuBarElements[2], function (e) {
				instance.cutter2.cutters[0].innerHTML = '<div style="width:5000px"></div>';
				return false;
			}, false);
			instance.menuBar = Rendition.UI.MenuBar({
				options: instance.menuBarElements,
				parentNode: instance.cutter2.cutters[1]
			});
			instance.editor = Rendition.UI.Form(instance.formStruct(instance.grid.dataSet, undefined, row));
			instance.editor.groupBoxes[0].outer.style.marginTop = '40px';
			instance.editor.appendTo(instance.cutter2.cutters[1]);
		} else {
			var newRecordRow = instance.grid.newRecord({
				taskId: Rendition.UI.createUUID,
				sourceCode: instance.defaultScript
			});
			instance.newRecordForm = instance.grid.genericEditor(instance.grid.newRowIndex,
			instance.formStruct(instance.grid.dataSet, function () {
				instance.grid.refresh();
				return;
			}), newRecordRow);
			grid.preventDefault();
		}
	}
	instance.previewScript = function (objectId) {
		var req = ["PreviewScript", [
				objectId,
				instance.editor.getInputByName('sourceCode').value,
				instance.editor.getInputByName('language').value,
				instance.editor.getInputByName('eventType').value,
				instance.editor.getInputByName('name').value
			]
		]
		var url = Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(req);
		var reqEval = Rendition.UI.Ajax(url, function (e) {
			var a = JSON.parse(e.responseText);
			if (a.method1.error !== undefined) {
				/* error in compliation script */
				alert(Rendition.Localization['Scripting_Error_'].Title + a.method1.error + ':' + a.method1.description);
				return;
			}
			a = a.method1.PreviewScript;
			if (a.error == 0 || a.error === undefined) {
				/* no error in script */
				if (a.console !== undefined) {
					instance.writeLine(a.console);
				} else {
					instance.writeLine(Rendition.Localization['Scripting_Script_completed_with_no_errors_but_did_not_return_anything'].Title);
				}
			} else {
				var errors = a.errors;
				var msg = [];
				for (var x = 0; errors.length > x; x++) {
					msg.push(
						Rendition.Localization['Scripting_Error'].Title + (x + 1) + '<br>' +
						Rendition.Localization['Scripting_Number'].Title + errors[x].errorNumber + '<br>' +
						Rendition.Localization['Scripting_Description'].Title + errors[x].errorText + '<br>'
					)
				}
				instance.writeLine(msg.join(''));
			}
		}, instance);
	}
	instance.write = function (whatToWrite) {
		instance.cutter2.cutters[0].firstChild.innerHTML =
		instance.cutter2.cutters[0].firstChild.innerHTML + whatToWrite;
		instance.cutter2.cutters[0].scrollTop = instance.cutter2.cutters[0].scrollHeight;
	}
	instance.writeLine = function (whatToWrite) {
		instance.write(whatToWrite + '<br>');
	}
	instance.init();
	return instance;
}