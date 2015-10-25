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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Linq;
using BarcodeLib;
using System.IO;
namespace Rendition {
	public partial class Admin {
		/// <summary>
		/// Options for the bar code.
		/// </summary>
		public class BarOptions {
			/// <summary>
			/// Height of the chart.
			/// </summary>
			public int Height = 250;
			/// <summary>
			/// Width of the chart.
			/// </summary>
			public int Width = 500;
			/// <summary>
			/// Foreground color.
			/// </summary>
			public string Foreground = "Black";
			/// <summary>
			/// Background color.
			/// </summary>
			public string Background = "White";
			/// <summary>
			/// Type of bar code.
			/// </summary>
			public string Type = "CODE 128";
			/// <summary>
			/// Include a human readable label.
			/// </summary>
			public bool IncludeLabel = true;
			/// <summary>
			/// Font of the label.
			/// </summary>
			public string FontFamily = "Trebuchet MS";
			/// <summary>
			/// Font size of the label.
			/// </summary>
			public float FontSize = 32f;
			/// <summary>
			/// Alignment of the label.
			/// </summary>
			public string Alignment = "center";
			/// <summary>
			/// Rotation of the bar code.
			/// </summary>
			public int Rotate = 0;
		}
        /// <summary>
        /// Barcodes from http://www.codeproject.com/KB/graphics/BarcodeLibrary.aspx by Brad Barnhill
        /// License: http://www.codeproject.com/info/cpol10.aspx GPL (*CPOL)
        /// </summary>
        /// <param name="barType">Type of the bar.</param>
        /// <param name="barValue">The bar value.</param>
        /// <param name="barOptions">The bar options.</param>
        /// <returns>
        /// Bitmap image
        /// </returns>
		public static System.Drawing.Bitmap BarCode( string barType, string barValue, Dictionary<string, object> barOptions ) {
			( "FUNCTION /w binaryStream barCode" ).Debug( 10 );
			JToken jtOpt = JToken.FromObject( barOptions );
			JsonSerializer serializer = new JsonSerializer();
			BarOptions options = null;
			using( JTokenReader jtr = new JTokenReader( jtOpt ) ) {
				options = ( BarOptions )serializer.Deserialize( jtr, typeof( BarOptions ) );
			}
			BarcodeLib.TYPE type = BarcodeLib.TYPE.UPCA;
			switch( barType.ToString().Trim().ToUpper() ) {
				case "UPC-A": type = BarcodeLib.TYPE.UPCA; break;
				case "UPC-E": type = BarcodeLib.TYPE.UPCE; break;
				case "UPC 2 DIGIT EXT.": type = BarcodeLib.TYPE.UPC_SUPPLEMENTAL_2DIGIT; break;
				case "UPC 5 DIGIT EXT.": type = BarcodeLib.TYPE.UPC_SUPPLEMENTAL_5DIGIT; break;
				case "EAN-13": type = BarcodeLib.TYPE.EAN13; break;
				case "JAN-13": type = BarcodeLib.TYPE.JAN13; break;
				case "EAN-8": type = BarcodeLib.TYPE.EAN8; break;
				case "ITF-14": type = BarcodeLib.TYPE.ITF14; break;
				case "CODABAR": type = BarcodeLib.TYPE.Codabar; break;
				case "POSTNET": type = BarcodeLib.TYPE.PostNet; break;
				case "BOOKLAND/ISBN": type = BarcodeLib.TYPE.BOOKLAND; break;
				case "CODE 11": type = BarcodeLib.TYPE.CODE11; break;
				case "CODE 39": type = BarcodeLib.TYPE.CODE39; break;
				case "CODE 39 Extended": type = BarcodeLib.TYPE.CODE39Extended; break;
				case "CODE 93": type = BarcodeLib.TYPE.CODE93; break;
				case "LOGMARS": type = BarcodeLib.TYPE.LOGMARS; break;
				case "MSI": type = BarcodeLib.TYPE.MSI_Mod10; break;
				case "INTERLEAVED 2 OF 5": type = BarcodeLib.TYPE.Interleaved2of5; break;
				case "STANDARD 2 OF 5": type = BarcodeLib.TYPE.Standard2of5; break;
				case "CODE 128": type = BarcodeLib.TYPE.CODE128; break;
				case "CODE 128-A": type = BarcodeLib.TYPE.CODE128A; break;
				case "CODE 128-B": type = BarcodeLib.TYPE.CODE128B; break;
				case "CODE 128-C": type = BarcodeLib.TYPE.CODE128C; break;
				case "TELEPEN": type = BarcodeLib.TYPE.TELEPEN; break;
			}
			AlignmentPositions align = AlignmentPositions.CENTER;
			switch( options.Alignment.Trim().ToUpper() ) {
				case "CENTER": align = AlignmentPositions.CENTER; break;
				case "LEFT": align = AlignmentPositions.LEFT; break;
				case "RIGHT": align = AlignmentPositions.RIGHT; break;
			}
			System.Drawing.Bitmap oBmp = null;
			using( System.Drawing.Font font = new System.Drawing.Font( options.FontFamily, options.FontSize ) ) {
				using( BarcodeLib.Barcode bar = new BarcodeLib.Barcode() ) {
					using( MemoryStream stream = new MemoryStream() ) {
						System.Drawing.Color foreground = System.Drawing.Color.FromName( options.Foreground );
						System.Drawing.Color background = System.Drawing.Color.FromName( options.Background );
						bar.Height = options.Height;
						bar.Width = options.Width;
						bar.IncludeLabel = options.IncludeLabel;
						bar.LabelFont = font;
						bar.Alignment = align;
						System.Drawing.Image img = bar.Encode( type, barValue, foreground, background, options.Width, options.Height );
						img.Save( stream, System.Drawing.Imaging.ImageFormat.Png );
						oBmp = new System.Drawing.Bitmap( stream );
					}
				}
			}
			return oBmp;
		}
	}
}
