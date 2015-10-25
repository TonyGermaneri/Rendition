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
* Creates a <link xlink:href="Rendition.UI.Range"/> object
* for use in <link xlink:href="Rendition.UI.DataSet"/> objects.
* @constructor
* @public
* @name Rendition.UI.Range
* @returns {Native.Object} <link xlink:href="Rendition.UI.Range"/>.
*/
Rendition.UI.Range = function () {
    return {
        /**
        * The lower bounds of the recordset.
        * @name Range.from
        * @memberOf Rendition.UI.Range.prototype
        * @type Native.String
        * @public
        * @property
        */
        from: 0,
        /**
        * The upper bounds of the recordset.
        * @name Range.to
        * @memberOf Rendition.UI.Range.prototype
        * @type Native.String
        * @public
        * @property
        */
        to: 0
    }
}