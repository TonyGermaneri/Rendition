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
/* WIDGIT: treeViewStyle */
/**
* Style of the tree view.
* @constructor
* @name Rendition.UI.TreeViewStyle
*/
Rendition.UI.TreeViewStyle = function() {
	var instance = {}
	/**
	* The unique id of this instance.
	* @name TreeViewStyle.id
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @readOnly
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of object.  Returns RenditionTreeViewStyle.
	* @name TreeViewStyle.type
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @readOnly
	* @property
	*/
	instance.type = 'RenditionTreeViewStyle';
	/**
	* The background of the treeView.
	* @name TreeViewStyle.background
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.background = 'grey';
	/**
	* The offset rect of each node.  Looks like: { x: 0, y: 0, h: 19, w: 0 }.
	* @name TreeViewStyle.nodeRect
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.nodeRect = { x: 0, y: 0, h: 19, w: 0 }
	/**
	* The offset rect of each node.  Looks like: { x: 0, y: 5, h: 16, w: 16 }.
	* @name TreeViewStyle.nodeControlRect
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.nodeControlRect = { x: 0, y: 5, h: 16, w: 16 }
	/**
	* The background of the control node when it is closed. CSS Background property. Example: #ff0015, LightBlue or url('/img/bg.jpg').
	* @name TreeViewStyle.nodeControlClosedBackground.
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.nodeControlClosedBackground = '#ff0015';
	/**
	* The background of the control node when it is open. CSS Background property. Example: #ff0015, LightBlue or url('/img/bg.jpg').
	* @name TreeViewStyle.nodeControlOpenBackground.
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.nodeControlOpenBackground = '#1500ff';
	/**
	* The background of each node.
	* @name TreeViewStyle.nodeBackground.
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.nodeBackground = 'brown';
	/**
	* The horizontal offset of each node.
	* @name TreeViewStyle.nodeHorizontalOffset.
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.nodeHorizontalOffset = 12;
	/**
	* The font of the label.
	* @name TreeViewStyle.labelFont.
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.labelFont = 'normal 11px \'Trebuchet MS\',\'Arial\',\'Helvetica\',\'Sans-serif\'';
	/**
	* The background of the label. CSS Background property. Example: #ff0015, LightBlue or url('/img/bg.jpg').
	* @name TreeViewStyle.labelBackground.
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.labelBackground = 'lavender';
	/**
	* The color of the label. CSS Color property.
	* @name TreeViewStyle.labelFontColor.
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.labelFontColor = 'blue';
	/**
	* The background of label when it is selected. CSS Background property. Example: #ff0015, LightBlue or url('/img/bg.jpg').
	* @name TreeViewStyle.labelSelectedBackground.
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.labelSelectedBackground = 'tan';
	/**
	* The font color of the selected label. CSS Color property.
	* @name TreeViewStyle.labelSelectedFontColor.
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.labelSelectedFontColor = 'black';
	/**
	* The border of the selected label. CSS Border property.
	* @name TreeViewStyle.labelSelectedBorder.
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.labelSelectedBorder = 'dashed 1px gray';
	/**
	* The HTML that appears when a node is requesting a remote URL.  Example:  &lt;img style="margin-bottom:-2px;" src="img/status_anim.gif" alt="Loading..."&gt;
	* @name TreeViewStyle.loadingImage.
	* @memberOf Rendition.UI.TreeViewStyle.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.loadingImage = ' <img style="margin-bottom:-2px;" src="/admin/img/status_anim.gif" alt="Loading...">';
	return instance;
}
/**
* 
* @constructor
* @name Rendition.UI.TreeNode
*/
Rendition.UI.TreeNode = function (args) {
	var instance = {}
	/**
	* The type of widget.  Returns RenditionTreeNode.
	* @name treeNode.type
	* @memberOf Rendition.UI.TreeNode.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionTreeNode';
	/**
	* The text of the tree node.
	* @name treeNode.text
	* @memberOf Rendition.UI.TreeNode.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.text = '';
	/**
	* The value of the treeNode
	* @name treeNode.value
	* @memberOf Rendition.UI.TreeNode.prototype
	* @type Native.Object
	* @public
	* @property
	*/
	instance.value = {}
	/**
	* Array of <link xlink:href="Rendition.UI.TreeNode"/> elements.
	* @name treeNode.childNodes
	* @memberOf Rendition.UI.TreeNode.prototype
	* @type Native.Array
	* @public
	* @property
	*/
	instance.childNodes = [];
	/**
	* The URL to send the server.  When the server responds callbackProcedure will be executed.
	* @name treeNode.URL
	* @memberOf Rendition.UI.TreeNode.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.URL = '';
	/**
	* Array of parameters to prepend to the front of the normal argument list in the callbackProcedure.
	* @name treeNode.callbackArguments
	* @memberOf Rendition.UI.TreeNode.prototype
	* @type Native.Array
	* @public
	* @property
	*/
	instance.callbackArguments = [];
	/**
	* Function to execute when server responds from the URL parameter.
	* You can add addtional parameters to the function's parameter list by
	* adding your addtional parameters to callbackArguments.
	* @function
	* @name treeNode.callbackProcedure
	* @memberOf Rendition.UI.TreeNode.prototype
	* @public
	* @param {Native.Object} json The JSON object returned from the remote procedure call the URL generated.
	* @param {Native.Object} treeView The <link xlink:href="Rendition.UI.TreeView"/> object this <link xlink:href="Rendition.UI.TreeNode"/> belongs to.
	* @param {Native.Array} siblingNodes List of <link xlink:href="Rendition.UI.TreeNode"/> objects with the same parent as this <link xlink:href="Rendition.UI.TreeNode"/>.
	* @param {Native.Object} node This <link xlink:href="Rendition.UI.TreeNode"/> as described in <link xlink:href="Rendition.UI.TreeView"/>.
	* @returns {Native.undefined}.
	*/
	instance.callbackProcedure = function (json, treeView, siblingNodes, node) {

	}
	return instance;
}
/**
* <para>Creates a DHTML based tree view.  The tree view uses the natural 
* hierarchial nature of the DOM to create a tree.  Tree nodes can be
* a <link xlink:href="Rendition.UI.TreeNode"/> Object, a function  or a URL and callback function.</para>
* <para>When a <link xlink:href="Rendition.UI.TreeNode"/> object is added to a treeView it will get a
*  few extra properties from the treeView and will end up looking like this
* <code language="JavaScript">
* {
*	
*	treeNode:{
*		text: String,
*		value: Object,
*		childNodes: Array,
*		URL: String,
*		callbackArguments: Array,
*		callbackProcedure: Function
*	},
*	parentNode: DHTMLElement,
*	element: DHTMLElement,
*	treeNodeId: Integer,
*	parentTreeNode: Object
* }
*</code>
*</para><para>If the property URL is defined in a treeNode the URL will be requested when the node's open event occurs.
* when the request is complete the Array [callbackArguments] will be <legacyItalic>prefixed</legacyItalic> to
* the event signature: (json, tree, siblingNodes, node).  The [callbackProcedure] will then be applied to the response
* within the context of the treeView.  The function you provide should create treeNodes when it is fired.
* An example of this can be found in the list of examples.</para>
* <para> The treeNode object above can be found by selecting a DHTML Element in the treeView and looking at its
* treeNode property, by using the <link xlink:href="Rendition.UI.TreeNode#Rendition.UI.TreeView.getNodeById"/> method to get the node by its treeNodeId
* or by searching through the <link xlink:href="Rendition.UI.TreeNode#Rendition.UI.TreeView.treeNodes"/> array for the desired node.</para>
* @constructor
* @name Rendition.UI.TreeView
* @param {Native.Object} args Parameters for the treeView widget.
* @param {Native.DHTMLElement} [args.parentNode]  The DHTML element to append the widget to.
* @param {Native.Object} [args.rootNode] The inital treeNode to add to the treeView.
* @param {Native.Integer} [args.dragMode=undefined] The mode that node dragging works in.
* undefined = No dragging allowed. 0 = Stay within the same parent.  
* 1 = Move from any node to any other node in the same <link xlink:href="Rendition.UI.TreeView"/> instance.
* @param {Native.Object} [args.dragMode=undefined] The mode that node dragging works in.
* @param {Native.Boolean} [args.includeRoot] Include the root tree node.  
* All the nodes are the decendant of a single node.  
* When this parameter is true this root node will be visible.
* @example ///Create a new dialog.  Create a treeView and attach it to the dialog.   Add a two tree nodes.///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.TreeView({
*	parentNode: foo.content
*});
*var unus = bar.add({
*	text: 'Duis autem vel.',
*	value: 'unus',
*	childNodes: []
*});
*var duo = unus.add({
*	text: 'Minim veniam.',
*	value: 'duo',
*	childNodes: []
*});
* @example ///Create a new dialog.  Create a treeView and attach it to the dialog.   Add a two tree nodes another way.///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.TreeView({
*	parentNode: foo.content
*});
*bar.add({
*	text: 'Duis autem vel.',
*	value: 'unus',
*	childNodes: [{
*		text: 'Minim veniam.',
*		value: 'duo',
*		childNodes: []
*	}]
*});
* @example ///Create a new dialog.  Create a treeView and attach it to the dialog.   Add a two tree nodes yet another way.///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.TreeView({
*	parentNode: foo.content,
*	includeRoot: true,
*	rootNode: {
*		text: 'Duis autem vel.',
*		value: 'unus',
*		childNodes: [{
*			text: 'Minim veniam.',
*			value: 'duo',
*			childNodes: []
*		}]
*	}
*});
* @example ///Create a new dialog.  Create a treeView and attach it to the dialog, hide the root node.  Add some nodes.  Allow dragging the nodes.///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.TreeView({
*	parentNode: foo.content,
*	dragMode: 0,
*	rootNode: {
*		text: 'Unus.',
*		value: 'unus',
*		childNodes: [
*			{
*				text: 'Duo.',
*				value: 'duo',
*				childNodes: []
*			},
*			{
*				text: 'Tres.',
*				value: 'tres',
*				childNodes: []
*			},
*			{
*				text: 'Quattuor.',
*				value: 'quattuor',
*				childNodes: []
*			},
*			{
*				text: 'Quinque.',
*				value: 'quinque',
*				childNodes: []
*			},
*			{
*				text: 'Sex.',
*				value: 'sex',
*				childNodes: []
*			}
*		]
*	}
*});
* @example ///Create a new dialog.  Create a treeView and attach it to the dialog.  Add some nodes.  Bind an event to the label click.///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.TreeView({
*	parentNode: foo.content,
*	dragMode: 0,
*	includeRoot: true,
*	labelclick: function(e, treeView, node, labelText, treeNode, parentNode){
*		alert(labelText.textContent);
*	},
*	rootNode: {
*		text: 'Unus.',
*		value: 'unus',
*		childNodes: [
*			{
*				text: 'Duo.',
*				value: 'duo',
*				childNodes: []
*			},
*			{
*				text: 'Tres.',
*				value: 'tres',
*				childNodes: []
*			}
*		]
*	}
*});
* @example ///Create a new dialog.  Create a treeView and attach it to the dialog.  Use a URL and callback procedure as a child node.  Bind an event to the label's context menu.///
*var foo = Rendition.UI.Dialog();
*var bar = Rendition.UI.TreeView({
*	parentNode: foo.content,
*	dragMode: 0,
*	includeRoot: true,
*	labelcontextmenu: function (e, treeView, node, labelText, treeNode, parentNode) {
*		var options = [];
*		options[0] = Rendition.UI.MenuOption();
*		options[0].text = 'Remove Node';
*		options[0].addEventListener('mousedown', function () {
*			node.remove();
*		}, false);
*		options[1] = Rendition.UI.MenuOption();
*		options[1].text = 'Show Node Value';
*		options[1].addEventListener('mousedown', function () {
*			alert(treeNode.value);
*		}, false);
*		new Rendition.UI.ContextMenu(e, {
*			elements: options,
*			caller: this,
*			type: 'mouse'
*		});
*		e.preventDefault();
*		treeView.preventDefault();
*	},
*	rootNode: {
*		text: 'Unus.',
*		value: 'unus',
*		childNodes: [
*			{
*				text: 'Duis vel.',
*				url: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(['GetSqlArray',
*				[{ commandText: 'select userId from users with (nolock)'}]]),
*				callbackArguments: [],
*				callbackProcedure: function (json, tree, siblingNodes, node) {
*					var a = json.method1.GetSqlArray;
*					var l = a.length;
*					for (var x = 0; l > x; x++) {
*						var newNode = {
*							text: a[x][0],
*							value: a[x][0]
*						}
*						if (!node.containsNode(newNode)) {
*							node.add(newNode);
*						}
*					}
*					return false;
*				}
*			}
*		]
*	}
*});
* @example ///Check the result of drag and drop's new node ordering.///
* //Create a new dialog.
*var foo = Rendition.UI.Dialog();
* // Create a treeView and attach it to the dialog.
* // Use a URL and callback procedure as a child node.
* // Check the order of the nodes after the user has reordered the nodes.
*var bar = Rendition.UI.TreeView({
*	parentNode: foo.content,
*	dragMode: 0,
*	rootNode: {
*		text: 'Unus.',
*		value: 'unus',
*		childNodes: [
*			{
*				text: 'Duis vel.',
*				url: Rendition.UI.clientServerSyncURI + Rendition.UI.responderKeyName + '1=' + JSON.stringify(['GetSqlArray',
*				[{ commandText: 'select userId from users with (nolock)'}]]),
*				callbackArguments: [],
*				callbackProcedure: function (json, tree, siblingNodes, node) {
*					var a = json.method1.GetSqlArray;
*					var l = a.length;
*					for (var x = 0; l > x; x++) {
*						var newNode = {
*							text: a[x][0],
*							value: a[x][0]
*						}
*						if (!node.containsNode(newNode)) {
*							node.add(newNode);
*						}
*					}
*					return false;
*				}
*			}
*		]
*	},
*	drop: function (e, tree, dragSource, dragTarget) {
*		var p = dragSource.parentNode;
*		var l = p.childNodes.length;
*		var order = [];
*		for (var x = 0; l > x; x++) {
*			order.push({
*				value: p.childNodes[x].treeNode.value,
*				order: x
*			});
*		}
*		alert(JSON.stringify(order));
*	}
*});
*/
Rendition.UI.TreeView = function (args) {
	var instance = {}
	/**
	* Complete, flat list of all the treeNodes in this treeView.
	* @name TreeView.treeNodes
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.Array
	* @public
	* @property
	*/
	instance.treeNodes = [];
	/**
	* Unique id of this instance of <link xlink:href="Rendition.UI.TreeView"/>.
	* @name TreeView.id
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.id = 'uid_' + Rendition.UI.createId();
	/**
	* The type of widget.  Returns RenditionTreeView.
	* @name TreeView.type
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.String
	* @public
	* @property
	*/
	instance.type = 'RenditionTreeView';
	/**
	* The style of this widget.  Type of <link xlink:href="Rendition.UI.TreeViewStyle"/>.  Cannot (safely) be changed after instantiation.
	* @name TreeView.style
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.Object
	* @public
	* @readOnly
	* @property
	*/
	instance.style = Rendition.UI.defaultTreeViewStyle;
	/**
	* Used interally to keep track of the highlighted label.
	* @name TreeView.labels
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.Array
	* @private
	* @readOnly
	* @property
	*/
	instance.labels = [];
	/**
	* Total number of treeNodes in this instance.
	* @name TreeView.length
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.Integer
	* @private
	* @readOnly
	* @property
	*/
	instance.length = 0;
	/**
	* How many px the mouse must move before it is considered to be draggin a tree node.
	* @name TreeView.dragThreshold
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.Integer
	* @private
	* @readOnly
	* @property
	*/
	instance.dragThreshold = 5;
	/**
	* Used interally to keep track of the difference between drag start and drag stop.  Looks like { x: 0, y: 0 }.
	* @name TreeView.dragOffset
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.Object
	* @private
	* @readOnly
	* @property
	*/
	instance.dragOffset = { x: 0, y: 0 }
	/**
	* When true, the user is dragging a treeNode in this instance.
	* @name TreeView.dragging
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.Boolean
	* @public
	* @readOnly
	* @property
	*/
	instance.dragging = false;
	/**
	* The parent DHTML element of this widget.
	* @name TreeView.parentNode
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.DHTMLElement
	* @public
	* @readOnly
	* @property
	*/
	if (args.parentNode !== undefined) {
		instance.parentNode = args.parentNode;
	} else {
		/**
		* The dialog that was created automatically when no parentNode was defined for this <link xlink:href="Rendition.UI.TreeView"/> instance.
		* @name TreeView.dialog
		* @memberOf Rendition.UI.TreeView.prototype
		* @type Native.Object
		* @public
		* @readOnly
		* @property
		*/
		instance.dialog = Rendition.UI.dialogWindow({
			rect: {
				x: document.documentElement.clientWidth * .10,
				y: document.documentElement.clientHeight * .10,
				w: document.documentElement.clientWidth * .80,
				h: document.documentElement.clientHeight * .80
			},
			title: 'Tree View'
		});
		instance.parentNode = instance.dialog.content;
	}
	/**
	* Executes event subscriptions.
	* @function
	* @name TreeView.executeEvents
	* @memberOf Rendition.UI.TreeView.prototype
	* @private
	* @returns {Native.Boolean} false if cancel default was called.
	* @param {Native.Array} events to execute.
	* @param {Native.Object} e The DOM event object.
	* @param {Native.DHTMLElement} element the related DHTML element.
	* @param {Native.Array} evntArg The arguments to add to the event signature.
	*/
	instance.executeEvents = function (events, arguments) {
		var fLength = events.length;
		if (fLength < 1) { return false; }
		var row = null;
		var column = null;
		instance.cancelDefault = false;
		for (var x = 0; fLength > x; x++) {
			events[x].apply(instance, arguments);
		}
		return instance.cancelDefault;
	}
	/**
	* Prevent the default event from occuring.  For use within an event handler.  For example, when used in within a function subscribed to the labelclick event, running treeView.preventDefault() will prevent the treeView from highlighting the treeNode.
	* @function
	* @name TreeView.preventDefault
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.undefined
	* @public
	*/
	instance.preventDefault = function () {
		instance.cancelDefault = true;
		return instance;
	}
	/**
	* Attach a procedure to an event.  Usage treeView.addEventListener('labelclick',function(e, treeView, node, labelText, treeNode, parentNode){/*your procedure code},false)
	* @function
	* @name TreeView.addEventListener
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.undefined
	* @param {Native.String} type The type of event to subscribe to.
	* @param {Native.Function} proc The function to call when the event is fired.
	* @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
	* @public
	*/
	instance.addEventListener = function (type, proc, capture) {
		if (instance.events[type]) {
			instance.events[type].push(proc);
		} else {
			instance.log('can\'t attach to event handler ' + type);
		}
		return null;
	}
	/**
	* Removes an event from subscription list.  The [proc] must match exactly the [proc] subscribed with.
	* @function
	* @name TreeView.removeEventListener
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.undefined
	* @param {Native.String} type The type of event to subscribe to.
	* @param {Native.Function} proc The function to call when the event is fired.
	* @param {Native.Boolean} [capture=false] What phase of the event will occur on.  This is not used.
	* @public
	*/
	instance.removeEventListener = function (type, proc, capture) {
		var evts = instance.events[type];
		for (var x = 0; evts.length > x; x++) {
			if (evts[x] == proc) {
				evts.splice(x, 1);
			}
		}
		return null;
	}
	/**
	* Used internally to add events used in the arugments of this instance.
	* @function
	* @name TreeView.addInitalEvents
	* @memberOf Rendition.UI.TreeView.prototype
	* @type Native.undefined
	* @param {Native.Function} eventProc The event to add.
	* @private
	*/
	instance.addInitalEvents = function (eventProc) {
		if (eventProc) {
			return [eventProc];
		} else {
			return [];
		}
	}
	/* event arrays and attachment of events passed as arguments */
	instance.events = {
		/**
		* Occurs when a tree node is toggled open to reveal its child nodes.
		* @event
		* @name TreeView.onopen
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		open: instance.addInitalEvents(args.open),
		/**
		* Occurs when a tree node is toggled closed to hide its child nodes.
		* @event
		* @name TreeView.onclose
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		close: instance.addInitalEvents(args.close),
		/**
		* Occurs when a tree node's label is clicked on.
		* @event
		* @name TreeView.onlabelclick
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		labelclick: instance.addInitalEvents(args.labelclick),
		/**
		* Occurs when a tree node's label's context menu is triggered.   This usualy due to a right mouse button click (or Command+click for Mac users).
		* <alert class="note"><para>It is important you use the method e.preventDefault when subscribing to this event.   Failure to do so will cause the system's context menu to appear.</para></alert>
		* @event
		* @name TreeView.onlabelcontextmenu
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		labelcontextmenu: instance.addInitalEvents(args.labelcontextmenu),
		/**
		* Not implemented.  Occurs when a tree node's label is being edited. 
		* @event
		* @name TreeView.onlabeledit
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		labeledit: instance.addInitalEvents(args.labeledit),
		/**
		* Not implemented.  Occurs when a tree node's label is entering edit mode.  treeView.preventDefault will prevent entering edit mode.
		* @event
		* @name TreeView.onlabelstartedit
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		labelstartedit: instance.addInitalEvents(args.labelstartedit),
		/**
		* Not implemented.  Occurs when a tree node's label is exiting edit mode.  treeView.preventDefault will prevent the exit from edit mode.
		* @event
		* @name TreeView.onlabelendedit
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		labelendedit: instance.addInitalEvents(args.labelendedit),
		/**
		* Not implemented.  Occurs when a tree node's label's edit input keydownevent occurs.
		* @event
		* @name TreeView.onlabelkeydown
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		labelkeydown: instance.addInitalEvents(args.labelkeydown),
		/**
		* Not implemented.  Occurs when a tree node's label's edit input keyup occurs.
		* @event
		* @name TreeView.onlabelkeyup
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		labelkeyup: instance.addInitalEvents(args.labelkeyup),
		/**
		* Not implemented.  Occurs when a tree node's label's edit input keypress occurs.
		* @event
		* @name TreeView.onlabelkeypress
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		labelkeypress: instance.addInitalEvents(args.labelkeypress),
		/**
		* Occurs when the treeview is being resized.
		* @event
		* @name TreeView.onresize
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object ( will always be null during this event ).
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		resize: instance.addInitalEvents(args.resize),
		/**
		* Occurs when a node has been started to drag.
		* @event
		* @name TreeView.onstartdrag
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		startdrag: instance.addInitalEvents(args.startdrag),
		/**
		* Occurs when a node is being moved.
		* @event
		* @name TreeView.ondrag
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.DHTMLElement} node The DOM object the event belongs to.
		* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
		* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
		* @param {Native.DHTMLElement} parentNode The parent treeNode DHTML element.
		*/
		drag: instance.addInitalEvents(args.drag),
		/**
		* Occurs when a node is being moved.
		* @event
		* @name TreeView.ondrop
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.Object} dragSource The source of the drag. Looks like: { node, labelText, treeNode }.
		* @param {Native.Object} dragTarget The target of the drag. Looks like: { node, labelText, treeNode }.
		*/
		drop: instance.addInitalEvents(args.drop),
		/**
		* Occurs when a node is being moved over another node.
		* @event
		* @name TreeView.ondragover
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object.
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		* @param {Native.Object} dragSource The source of the drag. Looks like: { node, labelText, treeNode }.
		* @param {Native.Object} dragTarget The target of the drag. Looks like: { node, labelText, treeNode }.
		*/
		dragover: instance.addInitalEvents(args.dragover),
		/**
		* Occurs when the tree is being reinitalized from the original parameters.
		* @event
		* @name TreeView.onrefresh
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @param {Native.Object} e Browser event object ( will always be null during this event ).
		* @param {Rendition.UI.TreeView} treeView The treeView instance firing the event.
		*/
		refresh: instance.addInitalEvents(args.refresh)
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.resize
	* @memberOf Rendition.UI.TreeView.prototype
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.resize = function () {
		instance.eventlisteners_resize(null, instance);
		instance.parentNode.style.background = instance.style.background;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.eventlisteners_refresh
	* @memberOf Rendition.UI.TreeView.prototype
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.eventlisteners_refresh = function () {
		if (instance.executeEvents(instance.events.refresh, [null, instance])) { return false }
		return true;
	}
	/**
	* Used internally to fire an event procedure.  This appears to be a copy of [treeView.resize].  Or they at least do the same thing.
	* @function
	* @name TreeView.eventlisteners_resize
	* @memberOf Rendition.UI.TreeView.prototype
	* @private
	* @depreciated
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.eventlisteners_resize = function () {
		if (instance.executeEvents(instance.events.resize, [null, instance])) { return false }
		return true;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.eventlisteners_open
	* @memberOf Rendition.UI.TreeView.prototype
	* @param {Native.Object} e The event object.
	* @param {Native.DHTMLElement} node The DOM object the event belongs to.
	* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
	* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.eventlisteners_open = function (e, node, labelText, treeNode) {
		if (instance.executeEvents(instance.events.open, [e, instance, node, labelText, treeNode])) { return false }
		return true;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.eventlisteners_close
	* @memberOf Rendition.UI.TreeView.prototype
	* @param {Native.Object} e The event object.
	* @param {Native.DHTMLElement} node The DOM object the event belongs to.
	* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
	* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.eventlisteners_close = function (e, node, labelText, treeNode) {
		if (instance.executeEvents(instance.events.close, [e, instance, node, labelText, treeNode])) { return false }
		return true;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.eventlisteners_dragover
	* @memberOf Rendition.UI.TreeView.prototype
	* @param {Native.Object} e The event object.
	* @param {Native.DHTMLElement} node The DOM object the event belongs to.
	* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
	* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.eventlisteners_dragover = function (e, node, labelText, treeNode, parentNode) {
		if (instance.dragging) {
			instance.dragTarget = { node: node, labelText: labelText, treeNode: treeNode }
			/* event handler sig: e,dragSource,dragTarget */
			if (instance.executeEvents(instance.events.dragover, [e, instance, instance.dragSource, instance.dragTarget])) { return false }
			try {
				/* try and move the node */
				instance.dragSource.node.parentNode.insertBefore(instance.dragSource.node, instance.dragTarget.node);
			} catch (e) {
				/* return to original location */
				instance.dragSource.node.parentNode.insertBefore(instance.dragSource.node, instance.dragSource.nextSibling);
			}
		}
		return true;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.eventlisteners_startdrag
	* @memberOf Rendition.UI.TreeView.prototype
	* @param {Native.Object} e The event object.
	* @param {Native.DHTMLElement} node The DOM object the event belongs to.
	* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
	* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.eventlisteners_startdrag = function (e, node, labelText, treeNode, parentNode) {
		if (args.dragMode === undefined) {
			return null;
		}
		if (instance.executeEvents(instance.events.startdrag, [e, instance, node, labelText, treeNode])) { return false }
		var pos = Rendition.UI.mouseCoords(e);
		instance.sourceObject = node;
		if (args.dragMode == 1) {
			instance.dragObject = document.createElement('div');
			instance.dragObject.className = 'treeNode treeDrag';
			instance.dragObject.style.position = 'absolute';
			instance.dragObject.style.zIndex = '999999';
			instance.dragObject.style.font = instance.style.labelFont;
			instance.dragObject.style.height = labelText.offsetHeight + 'px';
			instance.dragObject.style.width = node.offsetWidth + 'px';
			var clone = labelText.cloneNode(true);
			instance.dragObject.appendChild(clone);
			instance.dragObject.style.top = pos.y + 'px';
			instance.dragObject.style.left = pos.x + 'px';
			document.body.appendChild(instance.dragObject);
		}
		if (!instance.dragging) {
			instance.dragSource = { node: node, labelText: labelText, treeNode: treeNode, nextSibling: node.nextSibling, parentNode: node.parentNode }
			instance.highlightLabelText(labelText);
		}

		return true;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.eventlisteners_drag
	* @memberOf Rendition.UI.TreeView.prototype
	* @param {Native.Object} e The event object.
	* @param {Native.DHTMLElement} node The DOM object the event belongs to.
	* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
	* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.eventlisteners_drag = function (e, node, labelText, treeNode, parentNode) {
		if (instance.executeEvents(instance.events.drag, [e, instance, node, labelText, treeNode])) { return false }
		if (args.dragMode == 1) {
			var pos = Rendition.UI.mouseCoords(e);
			instance.dragObject.style.top = pos.y + 'px';
			instance.dragObject.style.left = pos.x + 'px';
		}
		return true;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.eventlisteners_drop
	* @memberOf Rendition.UI.TreeView.prototype
	* @param {Native.Object} e The event object.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.eventlisteners_drop = function (e) {
		if (instance.dragTarget !== undefined && instance.dragSource !== undefined) {
			if (instance.executeEvents(instance.events.drop, [e, instance, instance.dragSource, instance.dragTarget])) {
				/* return to the original location */
				instance.dragSource.node.parentNode.insertBefore(instance.dragSource.node, instance.dragSource.nextSibling);
				return false;
			}
			if (args.dragMode == 1) {
				document.body.removeChild(instance.dragObject);
			}
			/* actually move the node */
			instance.dragTarget = undefined;
			instance.dragSource = undefined;
			return true;
		}
	}
	/**
	* Used internally to refresh tree nodes.
	* @function
	* @name TreeView.nodeSetRefresh
	* @memberOf Rendition.UI.TreeView.prototype
	* @param {Native.DHTMLElement} e node to refresh the parent of.
	* @private
	* @returns {Native.undefined}.
	*/
	instance.nodeSetRefresh = function (node) {
		if (node.parentNode.parentNode.childNodes[0].childNodes[0]) {
			if (node.parentNode.parentNode.childNodes[0].childNodes[0].onclick) {
				node.refreshParent = function () {
					node.parentNode.parentNode.childNodes[0].childNodes[0].onclick();
					node.parentNode.parentNode.childNodes[0].childNodes[0].onclick();
					return instance;
				}
			} else {
				node.refreshParent = function () {
					instance.eventlisteners_refresh(null);
				}
			}
		}
		return;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.eventlisteners_labelclick
	* @memberOf Rendition.UI.TreeView.prototype
	* @param {Native.Object} e The event object.
	* @param {Native.DHTMLElement} node The DOM object the event belongs to.
	* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
	* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.eventlisteners_labelclick = function (e, node, labelText, treeNode, parentNode) {
		instance.nodeSetRefresh(node);
		if (instance.executeEvents(instance.events.labelclick, [e, instance, node, labelText, treeNode, parentNode])) { return false }
		return true;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.eventlisteners_labelcontextmenu
	* @memberOf Rendition.UI.TreeView.prototype
	* @param {Native.Object} e The event object.
	* @param {Native.DHTMLElement} node The DOM object the event belongs to.
	* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
	* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
	* @private
	* @returns {Native.Boolean} If true the preventDefault function was not run.
	*/
	instance.eventlisteners_labelcontextmenu = function (e, node, labelText, treeNode) {
		if (instance.executeEvents(instance.events.labelcontextmenu, [e, instance, node, labelText, treeNode])) { return false }
		return true;
	}
	/**
	* Initializes the treeView.
	* @function
	* @name TreeView.init
	* @memberOf Rendition.UI.TreeView.prototype
	* @private
	* @returns {Rendition.UI.TreeView}
	*/
	instance.init = function () {
		if (instance.tree) {
			Rendition.UI.wireupResizeEvents(instance.resize, instance.parentNode, true);
			instance.parentNode.innerHTML = '';
		}
		instance.parentNode.style.overflow = 'scroll';
		instance.tree = document.createElement('div');
		if (typeof instance.tree.style.MozUserSelect != 'undefined') {
			instance.mozSelect = true;
			instance.tree.style.MozUserSelect = '-moz-none';
		} else {
			instance.tree.onselectstart = function () { return false; }
		}
		instance.tree.className = 'tree';
		instance.parentNode.style.background = instance.style.background;
		var padLeft = instance.style.nodeHorizontalOffset * -1;
		if (padLeft > 0) {
			instance.tree.style.paddingLeft = padLeft + 'px';
		}
		if (args.rootNode !== undefined) {
			args.rootNode.id = Rendition.UI.createUUID();
			if (args.includeRoot == true) {
				instance.add(args.rootNode, instance.tree);
			} else {
				var initalChildren = args.rootNode.childNodes;
				if (typeof initalChildren == 'function') {
					initalChildren.apply(instance, [instance, args.rootNode, instance.tree]);
				} else {
					var l = initalChildren.length;
					for (var x = 0; l > x; x++) {
						instance.add(initalChildren[x], instance.tree);
					}
				}
			}
		}
		instance.parentNode.appendChild(instance.tree);
		Rendition.UI.wireupResizeEvents(instance.resize, instance.parentNode);
		return instance;
	}
	/**
	* Highlights a label.
	* @function
	* @name TreeView.highlightLabelText
	* @memberOf Rendition.UI.TreeView.prototype
	* @public
	* @returns {Native.undefined}
	* @param {Native.DHTMLElement} labelText The labelText SPAN element to highlight.
	*/
	instance.highlightLabelText = function (labelText) {
		var l = instance.labels.length;
		for (var x = 0; l > x; x++) {
			instance.labels[x].style.background = instance.style.labelBackground;
			instance.labels[x].style.color = instance.style.labelFontColor;
			instance.labels[x].style.border = 'solid 1px transparent';
		}
		labelText.style.background = instance.style.labelSelectedBackground;
		labelText.style.color = instance.style.labelSelectedFontColor;
		labelText.style.border = instance.style.labelSelectedBorder;
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.dragMove
	* @memberOf Rendition.UI.TreeView.prototype
	* @param {Native.Object} e The event object.
	* @param {Native.DHTMLElement} i The DOM object the event belongs to.
	* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
	* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
	* @param {Rendition.UI.TreeNode} parentNode The parent treeNode DHTML element.
	* @private
	* @returns {Native.undefined}
	*/
	instance.dragMove = function (e, i, labelText, treeNode, parentNode) {
		var pos = Rendition.UI.mouseCoords(e);
		if (instance.startDragging && (Math.abs(pos.x - instance.dragOffset.x) > 5 || Math.abs(pos.y - instance.dragOffset.y) > 5)) {
			if (instance.eventlisteners_startdrag(e, i, labelText, treeNode, parentNode)) {
				instance.dragging = true;
				Rendition.UI.appendEvent('mousemove', document.body, instance.drag_ = function (e) {
					instance.eventlisteners_drag(e, i, labelText, treeNode, parentNode);
					return false;
				}, false);
			}
			Rendition.UI.removeEvent('mousemove', document.body, instance.dragMove_, false);
		}
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.dragStart
	* @memberOf Rendition.UI.TreeView.prototype
	* @param {Native.Object} e The event object.
	* @param {Native.DHTMLElement} i The DOM object the event belongs to.
	* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
	* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
	* @param {Rendition.UI.TreeNode} parentNode The parent treeNode DHTML element.
	* @private
	* @returns {Native.undefined}
	*/
	instance.dragStart = function (e, i, labelText, treeNode, parentNode) {
		instance.startDragging = true;
		instance.dragOffset = Rendition.UI.mouseCoords(e);
		Rendition.UI.appendEvent('mousemove', document.body, instance.dragMove_ = function (e) {
			instance.dragMove(e, i, labelText, treeNode, parentNode);
		}, false);
		Rendition.UI.appendEvent('mouseup', document.body, instance.dragEnd_ = function (e) {
			instance.dragEnd(e, i, labelText, treeNode, parentNode);
			return false;
		}, false);
	}
	/**
	* Used internally to fire an event procedure.
	* @function
	* @name TreeView.dragEnd
	* @memberOf Rendition.UI.TreeView.prototype
	* @param {Native.Object} e The event object.
	* @param {Native.DHTMLElement} i The DOM object the event belongs to.
	* @param {Native.DHTMLElement} labelText The SPAN element containing the label text.
	* @param {Rendition.UI.TreeNode} treeNode The treeNode object defined to create this node.
	* @param {Rendition.UI.TreeNode} parentNode The parent treeNode DHTML element.
	* @private
	* @returns {Native.undefined}
	*/
	instance.dragEnd = function (e, i, labelText, treeNode, parentNode) {
		if (instance.dragging) {
			instance.dragging = false;
			instance.eventlisteners_drop(e);
		}
		Rendition.UI.removeEvent('mousemove', document.body, instance.drag_, false);
		Rendition.UI.removeEvent('mousemove', document.body, instance.dragMove_, false);
		Rendition.UI.removeEvent('mouseup', document.body, instance.dragEnd_, true);
		instance.startDragging = false;
		return null;
	}
	/**
	* removes the selected node.  This method is depreciated.  Use treeNode.remove() or removeNodeById(id) instead.
	* @function
	* @name TreeView.removeNode
	* @memberOf Rendition.UI.TreeView.prototype
	* @public
	* @depreciated
	* @returns {Native.undefined}
	* @param {Native.DHTMLElement} labelText The labelText SPAN element to highlight.
	*/
	instance.removeNode = function (node) {
		if (node.parentNode) {
			node.parentNode.removeChild(node);
		}
		return instance;
	}
	/**
	* Checks if the tree node has child members.
	* @function
	* @name TreeView.hasMembers
	* @memberOf Rendition.UI.TreeView.prototype
	* @public
	* @returns {Native.Boolean} true = the treeNode has children. false = the treeNode has no children (and probably dosen't even have a girlfriend!).
	* @param {Rendition.UI.TreeNode} treeNode The DHTML treeNode.
	*/
	instance.hasMembers = function (treeNode) {
		if (treeNode.childNodes.length > 0 ||
			treeNode.childNodes.url !== undefined ||
			treeNode.url !== undefined ||
			typeof treeNode.childNodes == 'function') {
			return true;
		} else {
			return false;
		}
	}
	/**
	* Adds a treeNode to the selected treeNode.
	* @function
	* @name TreeView.add
	* @memberOf Rendition.UI.TreeView.prototype
	* @public
	* @returns {Native.DHTMLElement} The new treeNode.
	* @param {Native.Object} treeNode The treeNode Object you want to create.  Looks like { text: String, value: Object,... }.  See <link xlink:href="Rendition.UI.TreeNode"/> for more information.
	* @param {Native.DHTMLElement} [parentNode] The treeNode you want to attach to.  If no parameter is defined, the node will be appended to the root of the tree.
	*/
	instance.add = function (treeNode, parentNode) {
		if (parentNode === undefined) {
			parentNode = instance.tree;
		}
		var i = document.createElement('div');
		if (treeNode.childNodes === undefined) {
			treeNode.childNodes = [];
		}
		/* add to the global list */
		var tn_index = Rendition.UI.createId();
		var parentTreeNode = null;
		if (parentNode.parentNode) {
			/* this node is at the top of the list, it has no parent.  
			Beware of checking its parentNode.parentNode, it is undefined when there is no parentNode. */
			var parentTreeNode = parentNode.parentNode.treeNode;
		}
		instance.treeNodes.push({
			treeNode: treeNode,
			parentNode: parentNode,
			element: i,
			treeNodeId: tn_index,
			parentTreeNode: parentTreeNode,
			id: treeNode.id
		});
		instance.length++;
		i.className = 'treeNode';
		i.treeNodeId = tn_index;
		i.id = treeNode.id;
		var nodeControl = document.createElement('div');
		var label = document.createElement('div');
		var labelText = document.createElement('span');
		labelText.style.background = instance.style.labelBackground;
		labelText.style.color = instance.style.labelFontColor;
		instance.labels.push(labelText);
		i.style.height = instance.style.nodeRect.h + 'px';
		label.setAttribute('name', treeNode.value);
		label.setAttribute('value', treeNode.value);
		label.setAttribute('text', treeNode.text);
		labelText.onmousedown = function (e) {
			instance.dragStart(e, i, labelText, treeNode, parentNode);
			return null;
		}
		labelText.onclick = function (e) {
			if (!instance.eventlisteners_labelclick(e, i, labelText, treeNode, parentNode)) { return false }
			instance.highlightLabelText(labelText);
			return null;
		}
		label.oncontextmenu = function (e) {
			instance.nodeSetRefresh(this.parentNode);
			if (!instance.eventlisteners_labelcontextmenu(e, i, labelText, treeNode)) { return false }

			return null;
		}
		Rendition.UI.appendEvent('mouseover', i, function (e) {
			if (!instance.eventlisteners_dragover(e, i, labelText, treeNode)) { return false }
			e.stopPropagation();
			return false;
		}, false);
		labelText.innerHTML = treeNode.text;
		label.style.font = instance.style.labelFont;
		var childNodes = document.createElement('div');
		childNodes.setAttribute('visibility', 0);
		childNodes.style.visibility = 'hidden';
		childNodes.style.display = 'none';
		i.setAttribute('value', treeNode.value);
		i.setAttribute('text', treeNode.text);
		i.nodeControl = nodeControl;
		i.treeNode = treeNode;
		i._childNodes = childNodes;
		i._parentNode = parentNode;
		childNodes.setAttribute('name', treeNode.value);
		childNodes.setAttribute('value', treeNode.value);
		childNodes.setAttribute('text', treeNode.text);
		nodeControl.style.display = 'inline-block';
		nodeControl.style.position = 'relative';
		nodeControl.style.height = instance.style.nodeControlRect.h + 'px';
		nodeControl.style.width = instance.style.nodeControlRect.w + 'px';
		nodeControl.style.top = instance.style.nodeControlRect.y + 'px';
		nodeControl.style.left = instance.style.nodeControlRect.x + 'px';
		label.style.whiteSpace = 'nowrap';
		label.style.display = 'inline-block';
		nodeControl.style.overflow = 'hidden';
		if (instance.hasMembers(treeNode)) {
			nodeControl.style.background = instance.style.nodeControlClosedBackground;
		} else {
			nodeControl.style.background = 'transparent';
		}
		/**
		* Checks if this tree node contains a child matching the parameter [testNode] by comparing testNode.value with other node values in this treeNode's list of child elements.
		* @function
		* @name TreeView.treeNode.containsNode
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @returns {Native.Boolean} When true, testNode is a child of the treeNode.  Or at least there's an object with the same value.
		* @param {Native.Object} testNode The treeNode Object you want check the existance of.
		*/
		i.containsNode = function (testNode) {
			if (testNode.childNodes === undefined) {
				testNode.childNodes = [];
			}
			if (typeof this.treeNode.childNodes == 'function') {
				return this.treeNode.childNodes == testNode;
			} else if (typeof this.treeNode.childNodes == 'object') {
				var ln = treeNode.childNodes.length;
				for (var x = 0; ln > x; x++) {
					if (treeNode.childNodes[x].value == testNode.value) {
						return true;
					}
				}
			}
			return false;
		}
		/**
		* Removes all the child treeNode elements from this treeNode.
		* @function
		* @name TreeView.treeNode.removeChildren
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @returns {Native.undefined}
		*/
		i.removeChildren = function () {
			var childNodes = this._childNodes;
			var ln = childNodes.length;
			for (var x = 0; ln > x; x++) {
				childNodes[x].remove();
			}
		}
		/**
		* Toggles the node open or closed.  This only works if the node has children and will return without error if no children are present.
		* @function
		* @name TreeView.treeNode.toggle
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @returns {Native.undefined}
		*/
		nodeControl.onclick = i.toggle = function () {
			if (childNodes.getAttribute('visibility') == 0) {
				var url = treeNode.childNodes.url || treeNode.url;
				var cbArgs = treeNode.childNodes.callbackArguments || treeNode.callbackArguments;
				var cbProc = treeNode.childNodes.callbackProcedure || treeNode.callbackProcedure;
				if (url !== undefined) {
					labelText.innerHTML = treeNode.text + instance.style.loadingImage;
					i.callbackProcedure = function (e) {
						var a = JSON.parse(e.responseText);
						labelText.innerHTML = treeNode.text;
						instance.cancelDefault = false;
						var applyArguments = [a, instance, childNodes, i];
						if (cbArgs !== undefined) {
							for (var z = 0; cbArgs.length > z; z++) {
								applyArguments.unshift(cbArgs[z]);
							}
						}
						cbProc.apply(i, applyArguments);
						if (instance.cancelDefault != true) {
							childNodes.style.visibility = 'visible';
							childNodes.style.display = 'block';
							nodeControl.style.background = instance.style.nodeControlOpenBackground;
							childNodes.setAttribute('visibility', 1)
							i.style.height = '';
						}
					}
					new Rendition.UI.Ajax(url, i.callbackProcedure, i);
				} else if (typeof treeNode.childNodes == 'function') {
					treeNode.childNodes.apply(instance, [instance, treeNode, childNodes]);
					if (instance.cancelDefault) { return }
					childNodes.style.visibility = 'visible';
					childNodes.style.display = 'block';
					nodeControl.style.background = instance.style.nodeControlOpenBackground;
					childNodes.setAttribute('visibility', 1);
					i.style.height = '';
				} else if (treeNode.childNodes.length) {
					childNodes.style.visibility = 'visible';
					childNodes.style.display = 'block';
					nodeControl.style.background = instance.style.nodeControlOpenBackground;
					childNodes.setAttribute('visibility', 1);
					i.style.height = '';
				}
			} else {
				childNodes.style.visibility = 'hidden';
				childNodes.style.display = 'none';
				nodeControl.style.background = instance.style.nodeControlClosedBackground;
				childNodes.setAttribute('visibility', 0);
				i.style.height = instance.style.nodeRect.h + 'px';
			}
		}
		label.appendChild(nodeControl);
		label.appendChild(labelText);
		i.appendChild(label);
		i.appendChild(childNodes);
		childNodes.style.marginLeft = instance.style.nodeHorizontalOffset + 'px';
		parentNode.appendChild(i);
		if (typeof treeNode.childNodes == 'object') {
			var l = treeNode.childNodes.length;
			for (var x = 0; l > x; x++) {
				instance.add(treeNode.childNodes[x], childNodes);
			}
		}
		/**
		* Adds a treeNode as a child of this treeNode.
		* @function
		* @name TreeView.treeNode.add
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @returns {Native.undefined}
		* @param {Rendition.UI.TreeNode} node The treeNode you want to append.
		*/
		i.add = function (node) {
			this.treeNode.childNodes.push(node);
			this.nodeControl.style.visibility = 'visible';
			this.nodeControl.style.background = instance.style.nodeControlClosedBackground;
			return instance.add(node, this._childNodes);
		}
		/**
		* Refreshes the children of this treeNode.
		* @function
		* @name TreeView.treeNode.refresh
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @returns {Native.undefined}
		*/
		i.refresh = function () {
			this.toggle();
			this.toggle();
		}
		/**
		* Refreshes the children of this treeNode's parent. Viz. this node and all of this nodes sibling nodes.
		* @function
		* @name TreeView.treeNode.refreshParentNode
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @returns {Native.undefined}
		*/
		i.refreshParentNode = function () {
			this.parentNode.parentNode.toggle();
			this.parentNode.parentNode.toggle();
		}
		/**
		* Removes this node.
		* @function
		* @name TreeView.treeNode.remove
		* @memberOf Rendition.UI.TreeView.prototype
		* @public
		* @returns {Native.undefined}
		*/
		i.remove = function () {
			instance.length--;
			/* find this nodes entry in the parent node's tree object and remove it */
			if (this.parentNode == instance.tree) {
				this.parentNode.removeChild(this);
				/* remove this child from the list *?
				/* unless its at the root where there is no tree object */
				return;
			}
			var parentTreeNode = this.parentNode.parentNode.treeNode;
			var parentNodeControl = this.parentNode.parentNode.nodeControl;
			var index = -1;
			for (var y = 0; parentTreeNode.childNodes.length > y; y++) {
				if (this.treeNode.treeNodeId == parentTreeNode.childNodes[y].treeNodeId) {
					index = y;
					break;
				}
			}
			if (index != -1) {
				parentTreeNode.childNodes.splice(index, 1);
			}
			instance.removeNodeById(this.id);
			if (instance.hasMembers(parentTreeNode)) {
				parentNodeControl.style.visibility = 'visible';
				parentNodeControl.style.background = instance.style.nodeControlClosedBackground;
			} else {
				parentNodeControl.style.visibility = 'hidden';
				nodeControl.style.background = 'transparent';
			}
			return;
		}
		return i;
	}
	/**
	* Removes a node by its treeNodeId number.
	* @function
	* @name TreeView.removeNodeById
	* @memberOf Rendition.UI.TreeView.prototype
	* @public
	* @returns {Native.undefined}
	*/
	instance.removeNodeById = function (nodeId) {
		/* used interally only by i.remove().  Should not be called directly. */
		var l = instance.treeNodes.length;
		for (var x = 0; l > x; x++) {
			if (instance.treeNodes[x].id == nodeId) {
				instance.treeNodes.splice(x, 1);
				var e = instance.treeNodes.element;
				e.parentNode.removeChild(e);
				break;
			}
		}
	}
	/**
	* Gets a node by its treeNode.value.
	* @function
	* @name TreeView.getNodeByValue
	* @memberOf Rendition.UI.TreeView.prototype
	* @public
	* @returns {Rendition.UI.TreeNode}
	*/
	instance.getNodeByValue = function (value) {
		var l = instance.treeNodes.length;
		for (var x = 0; l > x; x++) {
			if (instance.treeNodes[x].treeNode.value == value) {
				return instance.treeNodes[x];
			}
		}
		return null;
	}
	/**
	* Gets a node by its id.  By default, tree nodes do not have an id attribute, you must assign it.
	* @function
	* @name TreeView.getNodeById
	* @memberOf Rendition.UI.TreeView.prototype
	* @public
	* @returns {Rendition.UI.TreeNode}
	*/
	instance.getNodeById = function (id) {
		var l = instance.treeNodes.length;
		for (var x = 0; l > x; x++) {
			if (instance.treeNodes[x].id == id) {
				return instance.treeNodes[x];
			}
		}
		return null;
	}
	/**
	* Gets a node by its treeNodeId number.
	* @function
	* @name TreeView.getNodeByTreeNodeId
	* @memberOf Rendition.UI.TreeView.prototype
	* @public
	* @returns {Rendition.UI.TreeNode}
	*/
	instance.getNodeByTreeNodeId = function (nodeId) {
		var l = instance.treeNodes.length;
		for (var x = 0; l > x; x++) {
			if (instance.treeNodes[x].treeNodeId == nodeId) {
				return instance.treeNodes[x];
			}
		}
		return null;
	}
    /**
    * Gets a node by a specified treeNode property value.
    * @function
    * @name TreeView.getNodeByProperyValue
    * @param {Native.Object} propertyName The name of the property to search for.  For example: "text".
    * @param {Native.Object} propertyValue The value of the property to search for.  For example: "Tim The Enchanter".
    * @memberOf Rendition.UI.TreeView.prototype
    * @public
    * @returns {Rendition.UI.TreeNode}
    */
    instance.getNodeByProperyValue = function (propertyName, propertyValue) {
        var l = instance.treeNodes.length;
        for (var x = 0; l > x; x++) {
            if (instance.treeNodes[x][propertyName] == propertyValue) {
                return instance.treeNodes[x];
            }
        }
        return null;
    }
	instance.init();
	return instance;
}