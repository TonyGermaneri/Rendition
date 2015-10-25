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
* Logon dialog.
* @constructor
* @name Rendition.Commerce.LogOn
*/
Rendition.Commerce.LogOn = function (args) {
	var instance = {}
	if (args === undefined) { args = {} }
	if (args.parentNode === undefined) {
		instance.dialog = Rendition.UI.dialogWindow({
			rect: {
				x: (document.documentElement.clientWidth / 2) - (350 / 2),
				y: 150,
				h: 163,
				w: 350
			},
			title: 'Logon',
			keepCentered: true,
			modal: true,
			modalCloseable: true
		});
		args.parentNode = instance.dialog.content;
	}
	instance.userId = document.createElement('input');
	instance.password = document.createElement('input');
	Rendition.UI.appendEvent('keydown', instance.password, function (e) {
		if (e.keyCode == 13) {
			instance.logon.onclick();
		}
	}, false);
	instance.password.type = 'password';
	instance.logon = document.createElement('button');
	instance.logon.innerHTML = 'Logon';
	instance.logon.style.cssFloat = 'right';
	instance.logon.style.margin = '4px';
	instance.pairTable = Rendition.UI.pairtable({
		rows: [
			[Rendition.UI.txt('User Id or Email '), instance.userId],
			[Rendition.UI.txt('Password '), instance.password]
		]
	});
	instance.groupbox = Rendition.UI.GroupBox({
		title: 'Logon',
		parentNode: instance.dialog.content,
		childNodes: [instance.pairTable.table],
		alwaysExpanded: true
	});
	instance.groupbox.appendTo(args.parentNode);
	args.parentNode.appendChild(instance.logon);
	instance.logon.onclick = function () {
		var id = instance.userId.value;
		var req = [
			'LogOn',
			[{
				logon: Rendition.UI.iif(!isNaN(id), id, ''),
				email: Rendition.UI.iif(isNaN(id), id, ''),
				password: instance.password.value
			}]
		];
		var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI();
		/* this and logoff are the only apps that use clientServerSyncPublicURI 
		* All other programs use the admin URI clientServerSyncURI
		* which will return 403 until a successful admin logon occurs
		*/
		instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncPublicURI + url, function (e) {
			var a = JSON.parse(e.responseText);
			if (a.method1.error !== undefined) {
			    alert('unknown error\nError ' + a.method1.error + ':' + a.method1.description);
			}
			if (a.method1.LogOn.error != 0) {
				alert(a.method1.LogOn.description);
				var info = Rendition.UI.Info({
					timeout: 5000,
					position: { x: 30, y: 30 },
					title: 'Error',
					message: a.method1.LogOn.description
				});
			} else {
				var info = Rendition.UI.Info({
					timeout: 5000,
					position: { x: 30, y: 30 },
					title: 'Logon successful',
					message: ''
				});
				if (instance.dialog) {
					instance.dialog.close();
				}
				if (args.callbackProcedure) {
					args.callbackProcedure.apply(instance, [instance]);
				}
				if (args.redirect) {
					window.location(args.redirect);
				}
			}
		}, instance, false);
	}
	instance.userId.focus();
	return instance;
}
/**
* Logs the user off.
* @param {Native.Object} [args] Parameters for the function.
* @param {Native.String} [args.redirect] String location of where to redirect to after logoff.
* @type Native.Function
* @name Rendition.Commerce.LogOff
* @memberOf Rendition.Commerce
*/
Rendition.Commerce.LogOff = function (args) {
    var instance = {}
    args = args || {}
    var req = [
			'LogOff',
			[{}]
		];
    var url = Rendition.UI.responderKeyName + '1=' + JSON.stringify(req).toURI();
    /* this and logon are the only apps that use clientServerSyncPublicURI 
    * All other programs use the admin URI clientServerSyncURI
    * which will return 403 until a successful admin logon occurs
    */
    instance.reqEval = Rendition.UI.Ajax(Rendition.UI.clientServerSyncPublicURI + url, function (e) {
        if (args.redirect !== undefined) {
            window.location = args.redirect;
        } else {
            window.location = '/';
        }
    }, instance);
}
