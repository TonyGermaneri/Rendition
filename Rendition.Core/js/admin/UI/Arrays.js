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
* Startup parameters for the main Rendition class.  Altering the parameters
* of this property will change the startup behaviour of Rendition class.
* Parameters include: events: startedloading, finishedLoading, initURL, initCallback
* boolean: preventDefaultStyle
* collection: icons e.g.: 
{
	text: 'Go to Admin Page',
	src: '/admin/img/icons/cog.png',
	message: 'Naviage to the admin',
	proc: function (e) {
		window.location = '/admin';
	}
}

* @property
* @type Object
* @name Rendition.UI.parameters
* @memberOf Rendition.prototype
* @public
*/
Rendition.UI.parameters = {}
/**
* Status colors from green 0 to red 4.  For use with anything that might have a color status (level of importance).
* each member looks like like {background:'#00ff36',color:'#000'}.
* @property
* @type Array
* @name Rendition.UI.statusColors
* @memberOf Rendition.prototype
* @public
*/
Rendition.UI.statusColors = [
{background:'#00ff36',color:'#000'},
{background:'#ffff00',color:'#000'},
{background:'#ffcd00',color:'#000'},
{background:'#ff9700',color:'#fff'},
{background:'#ff0000',color:'#fff'}
];
/**
* Colors for the plot program and other color driven functions.  Each member looks like ['AliceBlue','#F0F8FF'].
* @property
* @type Array
* @name Rendition.UI.HTMLColorNames
* @memberOf Rendition.prototype
* @public
*/
Rendition.UI.HTMLColorNames = [
	['AliceBlue','#F0F8FF'],
	['AntiqueWhite','FAEBD7'],
	['Aqua','00FFFF'],
	['Aquamarine','7FFFD4'],
	['Azure','F0FFFF'],
	['Beige','F5F5DC'],
	['Bisque','FFE4C4'],
	['Black','000000'],
	['BlanchedAlmond','FFEBCD'],
	['Blue','0000FF'],
	['BlueViolet','8A2BE2'],
	['Brown','A52A2A'],
	['BurlyWood','DEB887'],
	['CadetBlue','5F9EA0'],
	['Chartreuse','7FFF00'],
	['Chocolate','D2691E'],
	['Coral','FF7F50'],
	['CornflowerBlue','6495ED'],
	['Cornsilk','FFF8DC'],
	['Crimson','DC143C'],
	['Cyan','00FFFF'],
	['DarkBlue','00008B'],
	['DarkCyan','008B8B'],
	['DarkGoldenRod','B8860B'],
	['DarkGray','A9A9A9'],
	['DarkGreen','006400'],
	['DarkKhaki','BDB76B'],
	['DarkMagenta','8B008B'],
	['DarkOliveGreen','556B2F'],
	['Darkorange','FF8C00'],
	['DarkOrchid','9932CC'],
	['DarkRed','8B0000'],
	['DarkSalmon','E9967A'],
	['DarkSeaGreen','8FBC8F'],
	['DarkSlateBlue','483D8B'],
	['DarkSlateGray','2F4F4F'],
	['DarkTurquoise','00CED1'],
	['DarkViolet','9400D3'],
	['DeepPink','FF1493'],
	['DeepSkyBlue','00BFFF'],
	['DimGray','696969'],
	['DodgerBlue','1E90FF'],
	['FireBrick','B22222'],
	['FloralWhite','FFFAF0'],
	['ForestGreen','228B22'],
	['Fuchsia','FF00FF'],
	['Gainsboro','DCDCDC'],
	['GhostWhite','F8F8FF'],
	['Gold','FFD700'],
	['GoldenRod','DAA520'],
	['Gray','808080'],
	['Green','008000'],
	['GreenYellow','ADFF2F'],
	['HoneyDew','F0FFF0'],
	['HotPink','FF69B4'],
	['IndianRed',' CD5C5C'],
	['Indigo',' 4B0082'],
	['Ivory','FFFFF0'],
	['Khaki','F0E68C'],
	['Lavender','E6E6FA'],
	['LavenderBlush','FFF0F5'],
	['LawnGreen','7CFC00'],
	['LemonChiffon','FFFACD'],
	['LightBlue','ADD8E6'],
	['LightCoral','F08080'],
	['LightCyan','E0FFFF'],
	['LightGoldenRodYellow','FAFAD2'],
	['LightGrey','D3D3D3'],
	['LightGreen','90EE90'],
	['LightPink','FFB6C1'],
	['LightSalmon','FFA07A'],
	['LightSeaGreen','20B2AA'],
	['LightSkyBlue','87CEFA'],
	['LightSlateGray','778899'],
	['LightSteelBlue','B0C4DE'],
	['LightYellow','FFFFE0'],
	['Lime','00FF00'],
	['LimeGreen','32CD32'],
	['Linen','FAF0E6'],
	['Magenta','FF00FF'],
	['Maroon','800000'],
	['MediumAquaMarine','66CDAA'],
	['MediumBlue','0000CD'],
	['MediumOrchid','BA55D3'],
	['MediumPurple','9370D8'],
	['MediumSeaGreen','3CB371'],
	['MediumSlateBlue','7B68EE'],
	['MediumSpringGreen','00FA9A'],
	['MediumTurquoise','48D1CC'],
	['MediumVioletRed','C71585'],
	['MidnightBlue','191970'],
	['MintCream','F5FFFA'],
	['MistyRose','FFE4E1'],
	['Moccasin','FFE4B5'],
	['NavajoWhite','FFDEAD'],
	['Navy','000080'],
	['OldLace','FDF5E6'],
	['Olive','808000'],
	['OliveDrab','6B8E23'],
	['Orange','FFA500'],
	['OrangeRed','FF4500'],
	['Orchid','DA70D6'],
	['PaleGoldenRod','EEE8AA'],
	['PaleGreen','98FB98'],
	['PaleTurquoise','AFEEEE'],
	['PaleVioletRed','D87093'],
	['PapayaWhip','FFEFD5'],
	['PeachPuff','FFDAB9'],
	['Peru','CD853F'],
	['Pink','FFC0CB'],
	['Plum','DDA0DD'],
	['PowderBlue','B0E0E6'],
	['Purple','800080'],
	['Red','FF0000'],
	['RosyBrown','BC8F8F'],
	['RoyalBlue','4169E1'],
	['SaddleBrown','8B4513'],
	['Salmon','FA8072'],
	['SandyBrown','F4A460'],
	['SeaGreen','2E8B57'],
	['SeaShell','FFF5EE'],
	['Sienna','A0522D'],
	['Silver','C0C0C0'],
	['SkyBlue','87CEEB'],
	['SlateBlue','6A5ACD'],
	['SlateGray','708090'],
	['Snow','FFFAFA'],
	['SpringGreen','00FF7F'],
	['SteelBlue','4682B4'],
	['Tan','D2B48C'],
	['Teal','008080'],
	['Thistle','D8BFD8'],
	['Tomato','FF6347'],
	['Turquoise','40E0D0'],
	['Violet','EE82EE'],
	['Wheat','F5DEB3'],
	['White','FFFFFF'],
	['WhiteSmoke','F5F5F5'],
	['Yellow','FFFF00'],
	['YellowGreen','9ACD32']
];
/**
* Colors for the plot program and other color driven functions.  Each entry looks like '#edc240'.
* @property
* @type Array
* @name Rendition.UI.plotColors
* @memberOf Rendition.prototype
* @public
*/
Rendition.UI.plotColors = [
	'#edc240','#afd8f8','#cb4b4b','#4da74d','#9440ed','#bd9b33','#3d853d','#7633bd','#ffe84c','#f35a5a',
	'#5cc85c','#b14cff','#8e7426','#698194','#792d2d','#2e642e','#58268e','#ffff59','#f4ffff','#ff6969',
	'#6be96b','#cf59ff','#5e4d19','#455663','#511d1d','#adc240','#bfd8f8','#ab4b4b','#bda74d','#a440ed',
	'#ad9b33','#bd853d','#a633bd','#bfe84c','#a35a5a','#bcc85c','#a14cff','#be7426','#a98194','#b92d2d',
	'#ae642e','#b8268e','#afff59','#b4ffff','#af6969','#bbe96b','#af59ff','#be4d19','#a55663','#b11d1d',
	'#ff000d','#c42d35','#ac0009','#ff7a00','#ac5300','#ff00b9','#c42d9a','#ff46cc','#18ff00','#3cc42d',
	'#4619d7','#9f08d4','#135ed4','#832ba3','#ec0063','#f32c80','#00d870','#23ad6a','#8af400','#7fc327',
	'#600ab8','#5d1e9d','#4b0692','#9347e0','#aa76e0','#ff0000','#da2020','#cb0000','#ff4747','#ff8080',
	'#0678af','#1a6d95','#035f8b','#43aadb','#72b9db','#17489d','#2c446e','#05255b','#3567bc','#4a74bc',
	'#7a0e9d','#5d286e','#46035b','#9a2cbc','#9f43bc','#62d20c','#5c9332','#367a03','#7ce02f','#8be04a'
];
/* array for charcter to px conversion */
/**
* Array of character to px size converstions for the truncate text procedure.  Each member looks like ['a',7].
* @property
* @type Array
* @name Rendition.UI.alpha
* @memberOf Rendition.prototype
* @public
*/
Rendition.UI.alpha = [
	['a',7],['b',7],['c',7],['d',7],['e',7],['f',7],
	['g',7],['h',7],['i',7],['j',7],['k',7],['l',7],
	['m',7],['n',7],['o',7],['p',7],['q',7],['r',7],
	['s',7],['t',7],['u',7],['v',7],['w',7],['x',7],
	['y',7],['z',7],['A',8],['B',8],['C',8],['D',8],
	['E',8],['F',8],['G',8],['H',8],['I',8],['J',8],
	['K',8],['L',8],['M',8],['N',8],['O',8],['P',8],
	['Q',8],['R',8],['S',8],['T',8],['U',8],['V',8],
	['W',8],['X',8],['Y',8],['Z',8],['0',8],['1',7],
	['2',7],['3',7],['4',7],['5',7],['6',7],['7',7],
	['8',7],['9',7],['/',7],['\\',7],['=',7],['+',7],
	['-',7],['_',7],[')',7],['(',7],['*',7],['&',7],
	['^',7],['%',7],['$',7],['#',7],['@',7],['!',7],
	['`',7],['~',7],['?',7],['.',7],['<',7],['"',7],
	['\'',7],[']',7],['[',7],[';',7],[':',7],['>',7],
	[' ',6]
];
/**
* List of axis values. ['horizontal','Horizontal'], ['vertical','Vertical'].
* @property
* @type Array
* @name Rendition.UI.axis
* @memberOf Rendition.prototype
* @public
*/
Rendition.UI.axis = [
	['horizontal','Horizontal'],
	['vertical','Vertical']
];
/**
* List of image extentions for use in file manage as deafult double click behaviour.
* @property
* @type Array
* @name Rendition.UI.imageExt
* @memberOf Rendition.prototype
* @public
*/
Rendition.UI.imageExt = [
    '.jpg','.jpeg','.gif','png'
]
/**
* List of text extentions for use in file manage as deafult double click behaviour.
* @property
* @type Array
* @name Rendition.UI.textExt
* @memberOf Rendition.prototype
* @public
*/
Rendition.UI.textExt = [
    '.htm', '.html', '.aspx', '.asp', '.txt', '.css',
    '.cs', '.config', '.cfg', '.master', '.xml', '.log', '.sql',
    '.csv', '.iif'
]
/**
* Associative array of extentions and default languages for use in ACE as default syntax type.
* @property
* @type Array
* @name Rendition.UI.syntaxTextExt
* @memberOf Rendition.prototype
* @public
*/
Rendition.UI.syntaxTextExt = [
    ['.htm','html'],
    ['.html', 'html'],
    ['.aspx', 'html'],
    ['.asp', 'html'],
    ['.txt', 'text'],
    ['.css', 'css'],
    ['.cs', 'csharp'],
    ['.config', 'xml'],
    ['.cfg', 'text'],
    ['.master', 'html'],
    ['.xml', 'xml'],
    ['.log', 'text'],
    ['.sql', 'text'],
    ['.csv', 'text'],
    ['.iif', 'text']
]
/**
* Associative array of ace themes.
* @property
* @type Array
* @name Rendition.UI.aceThemes
* @memberOf Rendition.prototype
* @public
*/
Rendition.UI.aceThemes = [
    ['Clouds', 'clouds'],
    ['Clouds Midnight', 'clouds_midnight'],
    ['Cobalt', 'cobalt'],
    ['Crimson Editor', 'crimson_editor'],
    ['Dawn', 'dawn'],
    ['Eclipse', 'eclipse'],
    ['Idle Fingers', 'idle_fingers'],
    ['KR Theme', 'kr_theme'],
    ['Merbivore', 'mervivore'],
    ['Mono Industrial', 'mono_industrial'],
    ['Monokai', 'monokai'],
    ['Pastel On Dark', 'pastel_on_dark'],
    ['Solarized Dark', 'solarized_dark'],
    ['Solarized Light', 'solarized_light'],
    ['Textmate', 'textmate'],
    ['Twilight', 'twilight'],
    ['Vibrant Ink', 'vibrant_ink']
]
