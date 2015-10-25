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
* Occurs when Rendition has started loading.
* @event
* @name Rendition.UI.initCss
* @memberOf Rendition.UI.prototype
* @public
* @param {Native.undefined}.
*/
Rendition.UI.initCss = function () {
    Rendition.UI.addCss('input,button { ' +
    '    margin:0; ' +
    '} ' +
    '.progressbar { ' +
    '	background:#f0f0f0; ' +
    '	padding:15px; ' +
    '	text-align:center; ' +
    '	font-family:tahoma; ' +
    '	font-size:11px; ' +
    '	margin:auto; ' +
    '} ' +
    '.progressbar img { ' +
    '	border:0; ' +
    '	display:block; ' +
    '	margin:auto; ' +
    '} ' +
    '.progressbarbar { ' +
    '	width:255px; ' +
    '	height:15px; ' +
    '	border:solid 1px #bfbfbf; ' +
    '	background:#f0f0f0; ' +
    '	margin:auto; ' +
    '	margin-top:5px; ' +
    '} ' +
    '.groupbox { ' +
    '	border: 1px solid #CCC; ' +
    '	-moz-border-radius: 4px; ' +
    '	-webkit-border-radius: 4px; ' +
    '	margin: 15px 5px 0 5px; ' +
    '	font-family:Trebuchet MS, Arial, Helvetica, Sans-serif; ' +
    '	padding: 5px; ' +
    '} ' +
    '.groupboxprodtitle { ' +
    '	font-size:17px; ' +
    '	border:solid 1px #333; ' +
    '	background:white; ' +
    '} ' +
    '.groupboxtitle { ' +
    '	font-size:12px; ' +
    '	margin-top:0px; ' +
    '	margin-left:5px; ' +
    '} ' +
    '.expander_closed { ' +
    '	background:#F1F1F1 url(/admin/img/arrow_black_right.gif) no-repeat; ' +
    '} ' +
    '.expander, .expander_closed { ' +
    '	height:10px; ' +
    '	width:10px; ' +
    '	display: table; ' +
    '	margin-top: -28px; ' +
    '	margin-bottom: 10px; ' +
    '	margin-left: 5px; ' +
    '} ' +
    '.expander { ' +
    '	background:#F1F1F1 url(/admin/img/arrow_black_down.gif) no-repeat; ' +
    '	cursor:default; ' +
    '} ' +
    '.groupboxtitletext { ' +
    '	margin: -14px 0px 15px 15px; ' +
    '	display: table; ' +
    '	padding-bottom: 0px; ' +
    '	background-color:#F1F1F1; ' +
    '	font-family:Trebuchet MS, Arial, Helvetica, Sans-serif; ' +
    '	font-size:14px; ' +
    '	padding-left:3px; ' +
    '	padding-right:3px; ' +
    '	padding-top:0; ' +
    '	cursor:default; ' +
    '} ' +
    '.proptable { ' +
    '	table-layout:fixed; ' +
    '} ' +
    '.proptable th { ' +
    '	text-align:right; ' +
    '	padding:0 0 0 4px; ' +
    '	margin:0 0 0 4px; ' +
    '	font-size:12px; ' +
    '} ' +
    '.proptable td { ' +
    '	text-align:left; ' +
    '	padding:0 0 0 4px; ' +
    '	margin:0 0 0 4px; ' +
    '	font-size:12px; ' +
    '} ' +
    '.info { ' +
    '	background:lightyellow; ' +
    '	border: solid 1px #777; ' +
    '	padding:3px 7px 3px 7px; ' +
    '	max-width:250px; ' +
    '	margin:5px; ' +
    '} ' +
    '.gltable td { ' +
    '	border:solid 1px black; ' +
    '	border-top:none; ' +
    '	padding:2px 2px 2px 2px; ' +
    '} ' +
    '.gltable { ' +
    '	background:#FFF; ' +
    '	font-size:12px; ' +
    '	border-collapse:collapse; ' +
    '	width:100%; ' +
    '} ' +
    '.orderFormTotalStatus { ' +
    '	padding:1px 6px 0 6px; ' +
    '	font-size:12px; ' +
    '	text-align:right; ' +
    '} ' +
    '.item_image_button {  ' +
    '	height:275px; ' +
    '	width:170px; ' +
    '	float:left; ' +
    '	margin:10px; ' +
    '	background:#f0f0f0; ' +
    '	border:solid 1px lightgray; ' +
    '} ' +
    '.item_image_function_button { ' +
    '	display:block; ' +
    '	margin:auto; ' +
    '} ' +
    '.image_info { ' +
    '	background: lightyellow; ' +
    '	border:solid 1px lightgray; ' +
    '	width:90%; ' +
    '	margin:0 auto 3px auto; ' +
    '	padding:3px; ' +
    '	font-size:11px; ' +
    '	text-align:center; ' +
    '} ' +
    '.item_image_artboard { ' +
    '	background: url(/admin/img/transparency.png); ' +
    '	padding:15px; ' +
    '	overflow:scroll; ' +
    '} ' +
    '.item_image_name { ' +
    '	max-width:80%; ' +
    '	margin:5px auto 5px auto; ' +
    '	display:block; ' +
    '	background:white; ' +
    '	border:solid 1px gray; ' +
    '	font-size:12px; ' +
    '	text-align:center; ' +
    '	font-family:Trebuchet MS, Arial, Helvetica, Sans-serif; ' +
    '} ' +
    '.item_image_image { ' +
    '	max-width:80%; ' +
    '	margin:0 auto 5px auto; ' +
    '	display:block; ' +
    '	max-height:115px; ' +
    '	border:solid 1px gray; ' +
    '} ' +
    '.queryAnalyzerOutput th { ' +
    '	border:solid 1px #555; ' +
    '	padding:2px; ' +
    '	background:black; ' +
    '	color:white; ' +
    '} ' +
    '.queryAnalyzerOutput td { ' +
    '	border:solid 1px #555; ' +
    '	padding:2px; ' +
    '} ' +
    '.queryAnalyzerOutput { ' +
    '	border-collapse:collapse; ' +
    '	background:white; ' +
    '	font-size:.7em; ' +
    '} ' +
    '.order_form_form { ' +
    '	border:solid 1px black; ' +
    '	margin:0 5px 5px 5px; ' +
    '	background:white; ' +
    '	padding:5px; ' +
    '} ' +
    '.order_form_line button { ' +
    '	margin:0; ' +
    '	white-space:nowrap; ' +
    '} ' +
    '.order_form_line td { ' +
    '	vertical-align:top; ' +
    '} ' +
    '.order_form_line { ' +
    '	border-bottom:solid 1px #777; ' +
    '	background:#F0F0F0; ' +
    '	font-size:12px; ' +
    '	padding:3px; ' +
    '	display:inline-block; ' +
    '} ' +
    '.purchase h3{ ' +
    '	font-size:14px; ' +
    '	background:black; ' +
    '	color:white; ' +
    '	margin:0; ' +
    '} ' +
    '.purchase th { ' +
    '	font-size:12px; ' +
    '	font-weight:normal; ' +
    '	background:black; ' +
    '	color:white; ' +
    '	margin:0; ' +
    '	border:solid 1px #777; ' +
    '} ' +
    '.purchase table { ' +
    '	border-collapse:collapse; ' +
    '	border:none; ' +
    '	margin:0; ' +
    '	padding:0; ' +
    '	width:100%; ' +
    '	background:transparent; ' +
    '} ' +
    '.purchase td { ' +
    '	background:transparent; ' +
    '	padding:0 0 0 3px; ' +
    '	border:none; ' +
    '	text-align:center; ' +
    '	border:solid 1px #777; ' +
    '} ' +
    '.purchase { ' +
    '	font-size:11px; ' +
    '	border-collapse:collapse; ' +
    '} ' +
    '.purchase input { ' +
    '	font-Size:11px; ' +
    '	height:12px; ' +
    '	padding:1px; ' +
    '	margin:2px; ' +
    '	width:30px; ' +
    '} ' +
    '.stagingtable td { ' +
    '	padding:5px; ' +
    '	background:white; ' +
    '} ' +
    '.dialog_status { ' +
    '	font-size:12px; ' +
    '	margin-left:18px; ' +
    '	padding-top:1px; ' +
    '} ' +
    '.staging_form { ' +
    '	border:solid 1px black; ' +
    '} ' +
    '.stagingtable table { ' +
    '	border-collapse:collapse; ' +
    '} ' +
    '.stagingtable { ' +
    '	border-collapse:collapse; ' +
    '	margin:10px auto 0 0; ' +
    '	width:300px; ' +
    '} ' +
    '.stagingtable th { ' +
    '	border:solid 1px #111; ' +
    '	font-size:12px; ' +
    '	padding:3px; ' +
    '} ' +
    '.stagingtable td { ' +
    '	font-size:11px; ' +
    '	border:solid 1px #111; ' +
    '} ' +
    '.prodforms button { ' +
    '	padding:10px; ' +
    '	width:150px; ' +
    '	height:75px; ' +
    '	margin:10px; ' +
    '} ' +
    '.productionAgingReportLine table, .productionAgingLineDate table { ' +
    '	border-collapse:collapse; ' +
    '	table-layout:fixed; ' +
    '	width:100%; ' +
    '} ' +
    '.productionAgingReportLine th, .productionAgingLineDate th { ' +
    '	font-size:11px; ' +
    '	width:70px; ' +
    '	padding:1px; ' +
    '} ' +
    '.productionAgingReportLine td, .productionAgingLineDate td { ' +
    '	border:solid 1px #CCC; ' +
    '	font-size:10px; ' +
    '	padding:1px; ' +
    '	text-align:center; ' +
    '	width:70px; ' +
    '} ' +
    '.ratesPreview { ' +
    '    background:white; ' +
    '    border-collapse:collapse; ' +
    '    border:solid 1px black; ' +
    '    width:220px; ' +
    '    margin:auto; ' +
    '} ' +
    '.ratesPreview .baseline { ' +
    '    border-bottom:solid 1px black; ' +
    '}' +
    ' .treeDrag { ' +
    '	 opacity: 0.5; ' +
    '	 -moz-opacity: 0.5; ' +
    '	 filter: alpha(opacity = 50); ' +
    ' } ' +
    ' .tree { ' +
    '	 moz-user-select:-moz-none; ' +
    ' } ' +
    ' .treeNode { ' +
    '	 padding:0; ' +
    '	 margin:0;	 ' +
    ' } ' +
    ' .treeNode span { ' +
    '	 cursor:pointer; ' +
    '	 padding:0 6px 0 6px; ' +
    '	 margin:0; ' +
    '	 border:solid 1px transparent; ' +
    ' } ' +
    ' .rte-zone { ' +
    '	 margin: 0; ' +
    '	 padding: 0; ' +
    '	 border: 1px #999 solid; ' +
    '     clear: both; ' +
    '	 font: 10px Tahoma, Verdana, Arial, Helvetica, sans-serif; ' +
    ' } ' +
    ' .rte-zone textarea { ' +
    '	 padding: 0;  ' +
    '	 margin: 0; ' +
    '	 border: 0; ' +
    '	 position: relative; ' +
    '	 left:0; ' +
    '	 clear: both; ' +
    ' } ' +
    ' .rte-toolbar { ' +
    '	 width: 100%; ' +
    '	 margin:0; ' +
    '	 padding: 0; ' +
    '	 display: block; ' +
    '	 border-bottom: 1px solid #ccc; ' +
    '	 background-color: #F0F0F0; ' +
    '	 font: 10px Tahoma, Verdana, Arial, Helvetica, sans-serif; ' +
    ' } ' +
    ' .rte-toolbar p { ' +
    '	 margin: 0; ' +
    '	 padding: 0; ' +
    '	 clear: both; ' +
    ' } ' +
    ' .rte-toolbar select { ' +
    '	 font: 10px Tahoma, Verdana, Arial, Helvetica, sans-serif; ' +
    '	 height: 16px; ' +
    '	 padding: 0; ' +
    '	 margin: 0; ' +
    ' } ' +
    ' .rte-panel { ' +
    '	 position: absolute; ' +
    '	 left: 0; ' +
    '	 top: 0; ' +
    '	 border: 1px solid #999; ' +
    '	 display: block; ' +
    '	 clear: both; ' +
    '	 margin: 0px; ' +
    '	 padding: 5px 5px 0 5px; ' +
    '	 background: #f0f0f0; ' +
    '	 font: 10px Tahoma, Verdana, Arial, Helvetica, sans-serif; ' +
    ' } ' +
    ' .rte-panel div.rte-panel-title { ' +
    '	 font-weight: bold; ' +
    '	 margin: -5px -5px 5px -5px; ' +
    '	 padding: 5px; ' +
    '	 height: 16px; ' +
    '	 line-height: 16px; ' +
    '	 background: #e0e0e0; ' +
    '	 border-bottom: 1px solid #ccc; ' +
    '	 display: block; ' +
    '	 clear: both; ' +
    '	 cursor: move; ' +
    ' } ' +
    ' .rte-panel div.rte-panel-title .close { ' +
    '	 position: absolute; ' +
    '	 top: 0; ' +
    '	 right: 0; ' +
    '	 display: block; ' +
    '	 float: right; ' +
    '	 text-decoration: none; ' +
    '	 font-size: 14px; ' +
    '	 font-weight: bold; ' +
    '	 color: #f00; ' +
    ' } ' +
    ' .rte-panel label { ' +
    '	 display: block; ' +
    '	 float: left; ' +
    '	 width: 50px; ' +
    '	 margin: 0 5px 0 2px; ' +
    '	 font-weight: bold; ' +
    '	 font-size: 10px; ' +
    '	 text-align: right; ' +
    '	 line-height: 20px; ' +
    '	 font-size: 100%; ' +
    ' } ' +
    ' .rte-panel input, .rte-panel select { ' +
    '	 margin: 0 5px 0 2px; ' +
    '	 padding: 0; ' +
    '	 height: 20px; ' +
    '	 font-size: 10px; ' +
    '	 border: 1px solid #ccc; ' +
    '	 float: left; ' +
    '	 vertical-align: middle; ' +
    '	 line-height: 20px; ' +
    ' } ' +
    ' .rte-panel button  { ' +
    '	 margin: 0 5px 0 2px; ' +
    '	 padding: 2px 5px; ' +
    '	 font-size: 10px; ' +
    '	 border: 1px solid #ccc; ' +
    '	 float: left; ' +
    '	 vertical-align: middle; ' +
    ' } ' +
    ' .rte-panel p.submit { ' +
    '	 margin: 5px -5px 0 -5px; ' +
    '	 padding: 5px; ' +
    '	 height: 20px; ' +
    '	 line-height: 20px; ' +
    '	 background: #e0e0e0; ' +
    '	 border-top: 1px solid #ccc; ' +
    '	 display: block; ' +
    '	 clear: both; ' +
    ' } ' +
    ' .rte-panel p.submit button { ' +
    '	 width: 60px; ' +
    '	 padding: 2px 5px; ' +
    '	 margin-left: 10px; ' +
    '	 font-weight: bold; ' +
    ' } ' +
    ' .rte-panel .colorpicker1, .rte-panel .colorpicker2 {  ' +
    '	 margin: 0 5px 0 0; ' +
    '	 padding: 0; ' +
    '	 float: left; ' +
    '	 border: 1px solid #000; ' +
    ' } ' +
    ' .rte-panel .colorpicker2 {  ' +
    '	 margin: 0; ' +
    '	 border: 0; ' +
    ' } ' +
    ' .rte-panel .colorpicker1 .rgb { ' +
    '	 background: url(\'/admin/img/rte_colorpicker_rgb.jpg\') no-repeat 0 0;  ' +
    '	 width: 300px; ' +
    '	 height: 150px; ' +
    '	 cursor: crosshair; ' +
    ' } ' +
    ' .rte-panel .colorpicker1 .gray{ ' +
    '	 background: url(\'/admin/img/rte_colorpicker_gray.jpg\') no-repeat 0 0;  ' +
    '	 width: 15px; ' +
    '	 height: 150px; ' +
    '	 cursor: crosshair; ' +
    ' } ' +
    ' .rte-panel .colorpicker2 .preview {  ' +
    '	 margin: 3px 0; ' +
    '	 padding: 0; ' +
    '	 width: 50px; ' +
    '	 height: 50px; ' +
    '	 border: 1px solid #000; ' +
    '	 clear: both; ' +
    '	 background: #000; ' +
    ' } ' +
    ' .rte-panel .colorpicker2 .color {  ' +
    '	 margin: 3px 0; ' +
    '	 padding: 0; ' +
    '	 clear: both; ' +
    ' } ' +
    ' .rte-panel .colorpicker2 .palette {  ' +
    '	 margin: 0; ' +
    '	 padding: 0; ' +
    '	 width: 50px; ' +
    '	 height: 50px; ' +
    '	 border: 1px solid #000; ' +
    '	 cursor: crosshair; ' +
    '	 clear: both; ' +
    '	 font-size: 1px; ' +
    ' } ' +
    ' .rte-panel .symbols {  ' +
    '	 margin: 0; ' +
    '	 padding: 0; ' +
    '	 clear: both; ' +
    ' } ' +
    ' .rte-panel .symbols a {  ' +
    '	 font-size: 14px; ' +
    '	 line-height: 14px; ' +
    '	 vertical-align: middle; ' +
    '	 text-align: center; ' +
    '	 width: 18px; ' +
    '	 height:18px; ' +
    '	 float: left; ' +
    '	 color: #000; ' +
    '	 text-decoration: none; ' +
    ' } ' +
    ' .rte-panel .symbols a:hover {  ' +
    '	 background: #ccc; ' +
    ' } ' +
    ' .rte-panel .colorpicker2 .palette .item {  ' +
    '	 width: 10px; ' +
    '	 height: 10px; ' +
    '	 margin: 0; ' +
    '	 padding: 0; ' +
    '	 float: left; ' +
    '	 cursor: crosshair; ' +
    '	 border: 0; ' +
    ' } ' +
    ' .rte-panel img { ' +
    '	 padding:0; ' +
    '	 margin:0; ' +
    '	 border:0; ' +
    ' } ' +
    ' .rte-toolbar div.clear { ' +
    '	 display: block; ' +
    '	 clear: both; ' +
    '	 border: 0; ' +
    '	 padding: 0; ' +
    '	 padding: 2px 0 0 0; ' +
    '	 margin: 0; ' +
    ' } ' +
    ' .rte-toolbar ul {  ' +
    '	 display: block; ' +
    '	 margin: 0px; ' +
    '	 padding: 0; ' +
    '	 width: 100%; ' +
    ' } ' +
    ' .rte-toolbar ul li {  ' +
    '	 list-style-type: none;  ' +
    '	 float: left; ' +
    '	 padding: 0; ' +
    '	 margin: 5px 2px; ' +
    '	 height: 16px; ' +
    ' } ' +
    ' .rte-toolbar ul li.separator {  ' +
    '	 height: 16px;  ' +
    '	 margin: 5px; ' +
    '	 border-left: 1px solid #ccc;  ' +
    ' } ' +
    ' .rte-toolbar ul li a {  ' +
    '	 border: 1px solid #fdfdfd; ' +
    '	 display: block;  ' +
    '	 width: 16px;  ' +
    '	 height: 16px;  ' +
    '	 background: url(\'/admin/img/rte_icons.gif\') no-repeat 0 0;  ' +
    '	 cursor: pointer;  ' +
    '	 margin: 0; ' +
    '	 padding: 0;  ' +
    '	 opacity: 0.5; ' +
    '	 -moz-opacity: 0.5; ' +
    '	 filter: alpha(opacity = 50); ' +
    ' } ' +
    ' .rte-toolbar ul li a:hover, .rte-toolbar ul li a.active { ' +
    '	 opacity: 1.0;  ' +
    '	 -moz-opacity: 1.0; ' +
    '	 filter: alpha(opacity = 100); ' +
    ' } ' +
    ' .rte-toolbar ul li a.active {  ' +
    '	 background-color: #f9f9f9;  ' +
    '	 border: 1px solid #ccc;  ' +
    ' } ' +
    ' .rte-toolbar ul li a.empty { background-position: 0px 0px; } ' +
    ' .rte-toolbar ul li a.bold { background-position: 0 -112px; } ' +
    ' .rte-toolbar ul li a.italic { background-position: 0 -128px; } ' +
    ' .rte-toolbar ul li a.strikeThrough { background-position: 0 -144px; } ' +
    ' .rte-toolbar ul li a.underline { background-position: 0 -160px; } ' +
    ' .rte-toolbar ul li a.subscript { background-position: 0 -176px; } ' +
    ' .rte-toolbar ul li a.superscript { background-position: 0 -192px; } ' +
    ' .rte-toolbar ul li a.disable { background-position: 0 -480px; } ' +
    ' .rte-toolbar ul li a.enable { background-position: 0 -592px; } ' +
    ' .rte-toolbar ul li a.unorderedList { background-position: 0 -320px; } ' +
    ' .rte-toolbar ul li a.orderedList{ background-position: 0 -336px; } ' +
    ' .rte-toolbar ul li a.justifyLeft { background-position: 0 -16px; } ' +
    ' .rte-toolbar ul li a.justifyCenter { background-position: 0 -32px; } ' +
    ' .rte-toolbar ul li a.justifyRight { background-position: 0 -48px; } ' +
    ' .rte-toolbar ul li a.justifyFull { background-position: 0 -64px; } ' +
    ' .rte-toolbar ul li a.indent { background-position: 0 -80px; } ' +
    ' .rte-toolbar ul li a.outdent { background-position: 0 -96px; } ' +
    ' .rte-toolbar ul li a.removeFormat { background-position: 0 -352px; } ' +
    ' .rte-toolbar ul li a.h1 { background-position: 0 -208px; } ' +
    ' .rte-toolbar ul li a.h2 { background-position: 0 -224px; } ' +
    ' .rte-toolbar ul li a.h3 { background-position: 0 -240px; } ' +
    ' .rte-toolbar ul li a.h4 { background-position: 0 -256px; } ' +
    ' .rte-toolbar ul li a.h5 { background-position: 0 -272px; } ' +
    ' .rte-toolbar ul li a.h6 { background-position: 0 -288px; } ' +
    ' .rte-toolbar ul li a.increaseFontSize { background-position: 0 -512px; } ' +
    ' .rte-toolbar ul li a.decreaseFontSize { background-position: 0 -528px; } ' +
    ' .rte-toolbar ul li a.image { background-position: 0 -560px; } ' +
    ' .rte-toolbar ul li a.word { background-position: 0 -576px; } ' +
    ' .rte-toolbar ul li a.clear { background-position: 0 -608px; } ' +
    ' .rte-toolbar ul li a.link { background-position: 0 -384px; } ' +
    ' .rte-toolbar ul li a.color { background-position: 0 -624px; } ' +
    ' .rte-toolbar ul li a.unlink { background-position: 0 -640px; } ' +
    ' .red .ui-slider-range { background: #ef2929; } ' +
    ' .red .ui-slider-handle { border-color: #ef2929; } ' +
    ' .green .ui-slider-range { background: #8ae234; } ' +
    ' .green .ui-slider-handle { border-color: #8ae234; } ' +
    ' .blue .ui-slider-range { background: #729fcf; } ' +
    ' .blue .ui-slider-handle { border-color: #729fcf; } ' +
    ' .aceMaxControl { ' +
    '	 border:solid 1px #BBB; ' +
    '	 background:black; ' +
    '	 color:white; ' +
    '	 text-align:center; ' +
    '	 height:12px; ' +
    '	 width:17px; ' +
    '	 font-size:8px; ' +
    '	 position:absolute; ' +
    ' }' + 
    '.fileList { ' +
    '	        background:#f0f0f0; ' +
    '	        border:solid 1px lightgray; ' +
    '	        height:27px; ' +
    '	        margin:0 0 0 0; ' +
    '        } ' +
    '        .fileList div { ' +
    '	        font-size:10px; ' +
    '	        margin:-1px 3px 0px 3px; ' +
    '	        padding:0px 0px 0px 0px; ' +
    '	        float:left; ' +
    '        }' + 
    '.adminChat { ' +
    '    background:black; ' +
    '    color:White; ' +
    '    font-family:Trebuchet MS, Lucida Console, Arial, Helvetica, Sans-Serif; ' +
    '    overflow:scroll; ' +
    '} ' +
    '.adminChat ul { ' +
    '    margin:0 0 0 -30px; ' +
    '} ' +
    '.adminChat li { ' +
    '    list-style-type:none; ' +
    '} ' +
    '.adminChat i { ' +
    '    color:#AAA; ' +
    '} ' +
    '.adminChat b { ' +
    '    color:#BBB; ' +
    '} ' +
    '.adminChat span { ' +
    '    color:#FFF; ' +
    '} ' +
    '.chat { ' +
    '    font-size:10px; ' +
    '    background:white; ' +
    '} ' +
    '.chatBox { ' +
    '    margin:0; ' +
    '    font-size:10px; ' +
    '}' +
    '.scrollpreview { ' +
	'    position:absolute; ' +
	'    padding:4px; ' +
	'    top:-1000px; ' +
	'    left:-1000px; ' +
	'    z-index:9000; ' +
	'    border:solid 1px #777; ' +
	'    background-color:#F1F1F1; ' +
	'    font-family: \'Trebuchet MS, Arial\'; ' +
    '} ' +
    '.ordercontrol button { ' +
	'    height:17px; ' +
    '} ' +
    '.ordercontrol td:hover { ' +
	'    background-image:url(/admin/img/hlight.jpg); ' +
	'    border:none; ' +
    '} ' +
    '.ordercontrol td { ' +
	'    width:18px; ' +
	'    padding:0; ' +
    '} ' +
    '.ordercontrol { ' +
	'    background-image:url(/admin/img/hlightdarkhover.png); ' +
    '} ' +
    '.templatefilters th:hover { ' +
	'    background-image:url(/admin/img/hlight.jpg); ' +
    '} ' +
    '.templatefilters th { ' +
	'    background-image:url(/admin/img/hlightdark.png); ' +
    '} ' +
    '.templatefilters td, .templatefilters th { ' +
	'    padding-left:3px; ' +
	'    padding-right:3px; ' +
	'    padding-top:0; ' +
	'    padding-bottom:0; ' +
	'    border-left:solid 1px #666; ' +
	'    border-right:solid 1px #666; ' +
	'    text-align:center; ' +
	'    font-size:11px; ' +
    '} ' +
    '.selectedfilterrow, .selectedfilterrow th { ' +
	'    background-image:url(/admin/img/hlight.jpg); ' +
    '} ' +
    '.templatefilters tr:hover { ' +
	'    background-image:url(/admin/img/hlight.jpg); ' +
    '} ' +
    '.filterrow { ' +
	'    background-color:transparent; ' +
    '} ' +
    '.templatesampleimage div { ' +
	'    text-align:center; ' +
	'    padding:11px; ' +
	'    border:solid 1px #666; ' +
	'    width:450px; ' +
	'    overflow:scroll; ' +
	'    height:250px; ' +
	'    background-image:url(/admin/img/transparency.png); ' +
    '} ' +
    '.templatesampleimage img { ' +
	'    display:block; ' +
	'    margin:auto; ' +
    '} ' +
    '.templatefilters table { ' +
	'    border-collapse:collapse; ' +
	'    border:solid 1px #666; ' +
	'    width:250px; ' +
    '} ');
}