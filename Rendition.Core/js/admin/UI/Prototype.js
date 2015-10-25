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
/* undocumented prototypes */
String.prototype.JSONEncode = function() {
	return this.replace(/\\/gm,'\\\\').replace(/"/gm, '\\"');
}
String.prototype.idSafe = function() {
	return this.replace(/-/g,'_').toLowerCase().trim();
}
String.prototype.toBoolian = function(){
	if(this==true||this=='true'||this==1){
		return true;
	}else{
		return false;
	}
}
String.prototype.toCheckbox = function(){
	if(this==true||this=='true'||this==1){
		return 'checked';
	}else{
		return '';
	}
}
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,'');
}
String.prototype.ltrim = function() {
	return this.replace(/^\s+/,'');
}
String.prototype.rtrim = function() {
	return this.replace(/\s+$/,'');
}
String.prototype.toCheckbox = function(){
	if(this==true||this=='true'||this==1){
		return 'checked';
	}else{
		return '';
	}
}
String.prototype.toMoney = function(){
	var i = isNaN(this) || this === '' || this === null ? 0.00 : this;
	return parseFloat(i).toFixed(2);
}
Number.prototype.toURI = function() {
	return encodeURIComponent(this);
}
Boolean.prototype.toURI = function() {
	return encodeURIComponent(this);
}
Boolean.prototype.bitToBool = function() {
	return this;
}
String.prototype.bitToBool = function() {
	return this=="1";
}
Number.prototype.bitToBool = function() {
	return this==1;
}
String.prototype.toURI = function() {
	return encodeURIComponent(this);
}
String.prototype.s = function() {
	return this.replace(/'/g,"''");
}
Array.prototype.compare = function(testArr) {
	if (this.length != testArr.length) return false;
	for (var i = 0; i < testArr.length; i++) {
		if (this[i].compare) { 
			if (!this[i].compare(testArr[i])) return false;
		}
		if (this[i] !== testArr[i]) return false;
	}
	return true;
}
if(!Array.prototype.indexOf){
  Array.prototype.indexOf = function(elt /*, from*/){
	var len = this.length;
	var from = Number(arguments[1]) || 0;
	from = (from < 0)
		 ? Math.ceil(from)
		 : Math.floor(from);
	if (from < 0)
	  from += len;
	for (; from < len; from++){
	  if (from in this &&
		  this[from] === elt)
		return from;
	}
	return -1;
  }
}
if(!Array.prototype.lastIndexOf){
  Array.prototype.lastIndexOf = function(elt /*, from*/){
	var len = this.length;
	var from = Number(arguments[1]);
	if (isNaN(from)){
	  from = len - 1;
	}else{
	  from = (from < 0)
		   ? Math.ceil(from)
		   : Math.floor(from);
	  if (from < 0)
		from += len;
	  else if (from >= len)
		from = len - 1;
	}
	for (; from > -1; from--){
	  if (from in this &&
		  this[from] === elt)
		return from;
	}
	return -1;
  }
}
if (!Array.prototype.forEach){
	Array.prototype.forEach = function(fun /*, thisp*/){
	var len = this.length;
	if (typeof fun != "function")
	throw new TypeError();
	var thisp = arguments[1];
	for (var i = 0; i < len; i++)
		{
			if (i in this)
			fun.call(thisp, this[i], i, this);
		}
	}
}
String.prototype.JSONDateToString = function (formatString) {
    var s = String(formatString).replace('Date(', '').replace(/\//g, '').replace(')', '').split('-');
    var m = parseInt(s[0]) - parseInt(s[1]);
    var d = new Date(m);
    return d;
}
/* found on the interweb */
function custLog(x, base) {
	// Created 1997 by Brian Risk.  http://brianrisk.com
	return (Math.log(x)) / (Math.log(base));
}
function custRound(x, places) {
	// Created 1997 by Brian Risk.  http://brianrisk.com
	return (Math.round(x * Math.pow(10, places))) / Math.pow(10, places)
}
function fractApprox(x, maxDenominator) {
	// Created 1997 by Brian Risk.  http://brianrisk.com
	maxDenominator = parseInt(maxDenominator);
	var approx = 0;
	var error = 0;
	var best = 0;
	var besterror = 0;
	for (var i = 1; i <= maxDenominator; i++) {
		approx = Math.round(x / (1 / i));
		error = (x - (approx / i))
		if (i == 1) { best = i; besterror = error; }
		if (Math.abs(error) < Math.abs(besterror)) { best = i; besterror = error; }
	}
	return (Math.round(x / (1 / best)) + "/" + best);
}
function baseConverter(number, ob, nb) {
	// Created 1997 by Brian Risk.  http://brianrisk.com
	number = number.toUpperCase();
	var list = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var dec = 0;
	for (var i = 0; i <= number.length; i++) {
		dec += (list.indexOf(number.charAt(i))) * (Math.pow(ob, (number.length - i - 1)));
	}
	number = "";
	var magnitude = Math.floor((Math.log(dec)) / (Math.log(nb)));
	for (var i = magnitude; i >= 0; i--) {
		var amount = Math.floor(dec / Math.pow(nb, i));
		number = number + list.charAt(amount);
		dec -= amount * (Math.pow(nb, i));
	}
	return number;
}