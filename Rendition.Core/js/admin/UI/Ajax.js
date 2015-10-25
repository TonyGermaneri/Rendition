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
* Finds the best AJAX object across many browsers.
* @function
* @public
* @name Rendition.UI.createXMLHttpRequest
* @returns {Native.Object} Finds any of XMLHttpRequest, Msxml2.XMLHTTP, Microsoft.XMLHTTP in that order.
*/
Rendition.UI.createXMLHttpRequest = function () {
	try { return new XMLHttpRequest(); } catch (e) { }
	try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch (e) { }
	try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch (e) { }
	return null;
}
/**
* Main AJAX function. Requests the URL from the server, executes a procedure when the server responds.
* You provide the closure to execute the procedure in, if it's synchronous or asynchronous, 
* and if the request should be delayed.
* @constructor
* @public
* @name Rendition.UI.Ajax
* @param {Native.String} f_url The complete URL with query string.
* @param {Native.Function} proc The function to apply when the server returns code 200 OK.
* @param {Native.Object} context The scope to execute in.
* @param {Native.Boolean} [async=true] When true the function will execute asynchronously.
* @param {Native.Integer} [delayDownloading=0] Wait before starting. In miliseconds.
* @example /// Fetch some HTML data from the default.aspx page and fill the dialog with the data. ///
* var foo = Rendition.UI.Dialog();
* var URL = '/default.aspx'
* var bar = Rendition.UI.Ajax(URL, function (e) {
*	foo.content.innerHTML = e.responseText;
* }, this);
* @example /// Fetch some JSON data from the Rendition responder. ///
* // Create a dialog //
* var foo = Rendition.UI.Dialog();
* // Create a request for the JSON C# Rendition responder //
* var req = [
*	// for more information on the SystemInfo method //
*	// check out the help topic:                     //
*	// Rendition Namespace > admin > SystemInfo      //
*	'SystemInfo', []
* ];
* var URL = '/admin/responder?method1=' + JSON.stringify(req).toURI();
* // Create the AJAX request //
* var bar = Rendition.UI.Ajax(URL, function (e) {
*	// parse the data returned //
*	var a = JSON.parse(e.responseText);
*	// show the name of the worker process //
*	foo.content.innerHTML = a.method1.SystemInfo.process.ProcessName;
* }, this);
*/
Rendition.UI.Ajax = function (f_url, proc, context, async, delayDownloading, errorProc) {
	var instance = {}
	if (delayDownloading === undefined) { delayDownloading = 0; }
	async = async === undefined ? true : async;
	/**
	* Aborts the request.
	* @function
	* @name Ajax.abort
	* @memberOf Rendition.UI.Ajax.prototype
	* @public
	* @returns
	*/
	instance.abort = function () {
	    Rendition.UI.AjaxRequests.splice(Rendition.UI.AjaxRequests.indexOf(instance), 1);
	    clearTimeout(instance.request);
	    if (instance.downloadTimer !== undefined) {
	        clearTimeout(instance.downloadTimer);
	    }
	    if (instance.http_request) {
	        instance.http_request.abort();
	    }
	    return null;
	}
	/**
	* Executes the request.
	* @function
	* @name Ajax.doRequest
	* @memberOf Rendition.UI.Ajax.prototype
	* @private
	* @returns
	*/
	instance.doRequest = function () {
	    if (!context) {
	        instance.abort();
	        return null;
	    }
	    if (Rendition.UI.AjaxRequests.length < Rendition.UI.maxSimultaneousAjaxRequests) {
	        instance.index = String(Rendition.UI.AjaxRequests.length - 1);
	        Rendition.UI.AjaxRequests.push(instance);
	        instance.http_request = Rendition.UI.createXMLHttpRequest();
	        instance.postData = '';
	        instance.url = '';
	        if (f_url.indexOf('?') > 0) {
	            instance.postData = f_url.substring(f_url.indexOf('?') + 1);
	            instance.url = f_url.substring(0, f_url.indexOf('?'));
	        } else {
	            instance.url = f_url;
	        }
	        instance.http_request.open('POST', instance.url, async);
	        if (async) {
	            instance.http_request.onreadystatechange = instance.readyStateChange;
	        }
	        instance.http_request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	        if (delayDownloading == 0) {
	            instance.http_request.send(instance.postData);
	        } else {
	            instance.downloadTimer = setTimeout(function () {
	                instance.http_request.send(instance.postData);
	            }, delayDownloading);
	        }
	        if (!async) {
	            instance.readyStateChange();
	        }
	    } else {
	        instance.request = setTimeout(instance.doRequest, Rendition.UI.AjaxRequestRestTimeout);
	    }
	}
	/**
	* Executes when the state had changed.
	* @function
	* @name Ajax.readyStateChange
	* @memberOf Rendition.UI.Ajax.prototype
	* @private
	* @returns
	*/
	instance.readyStateChange = function () {
	    if (!context) {
	        instance.http_request.abort();
	    }
	    if (instance.http_request.readyState != 4 || instance.http_request.status == 0) {
	        return false;
	    }
	    if (instance.http_request.status != 200) {
	        if (errorProc) {
	            errorProc.apply(context, [instance.http_request]);
	        } else {
	            if (instance.http_request.status === 403) {
	                window.location = '/pub/logon.html?rdr=~' + encodeURIComponent(window.location.pathname);
	            } else {
	                Rendition.UI.ConfirmErrors('A request sent to the server resulted in an error, the error details follow\n\n' +
				    'Url:' + instance.url + '\n' +
				    'Post Data:' + instance.postData + '\n' +
				    'Status:' + instance.http_request.status + '\n' +
                    'Status Description:' + instance.http_request.statusText + '\n' +
				    'Details:\n' + (instance.http_request.responseText || 'No Details'), 'Internal Server Error');
	            }
	        }
	        Rendition.UI.AjaxRequests.splice(Rendition.UI.AjaxRequests.indexOf(instance), 1);
	        return false;
	    }
	    Rendition.UI.AjaxRequests.splice(Rendition.UI.AjaxRequests.indexOf(instance), 1);
	    if (proc) {
	        proc.apply(context, [instance.http_request]);
	    }
	    return false;
	}
	instance.doRequest();
	return instance;
}