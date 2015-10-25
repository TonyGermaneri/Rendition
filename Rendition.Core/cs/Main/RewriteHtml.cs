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
using System.Web;
using System.IO;
using System.Text.RegularExpressions;
using System.IO.Compression;
namespace Rendition {
	/// <summary>
	/// A response filter used with the URL rewrite directives.  Any 'error=0' directives will be treated as a response filter.
	/// </summary>
	public class RewriteHtml : MemoryStream {
        #region Instance Fields
        /// <summary>
		/// The output stream
		/// </summary>
		public Stream OutputStream = null;
        #endregion
        #region Constructors
        /// <summary>
		/// Initializes a new instance of the <see cref="RewriteHtml"/> class.
		/// </summary>
		/// <param name="stream">The stream.</param>
		public RewriteHtml( Stream stream ) {
			OutputStream = stream;
		}
        #endregion
        #region Instance Methods
        /// <summary>
		/// Writes a block of bytes to the current stream using data read from buffer.
		/// </summary>
		/// <param name="buffer">The buffer to write data from.</param>
		/// <param name="offset">The byte offset in <paramref name="buffer"/> at which to begin writing from.</param>
		/// <param name="count">The maximum number of bytes to write.</param>
		/// <exception cref="T:System.ArgumentNullException">
		/// 	<paramref name="buffer"/> is null. </exception>
		/// <exception cref="T:System.NotSupportedException">The stream does not support writing. For additional information see <see cref="P:System.IO.Stream.CanWrite"/>.-or- The current position is closer than <paramref name="count"/> bytes to the end of the stream, and the capacity cannot be modified. </exception>
		/// <exception cref="T:System.ArgumentException">
		/// 	<paramref name="offset"/> subtracted from the buffer length is less than <paramref name="count"/>. </exception>
		/// <exception cref="T:System.ArgumentOutOfRangeException">
		/// 	<paramref name="offset"/> or <paramref name="count"/> are negative. </exception>
		/// <exception cref="T:System.IO.IOException">An I/O error occurs. </exception>
		/// <exception cref="T:System.ObjectDisposedException">The current stream instance is closed. </exception>
		public override void Write( byte[] buffer, int offset, int count ) {
			bool handled = false;
			HttpContext current = HttpContext.Current;
			string executionFilePath = current.Request.AppRelativeCurrentExecutionFilePath;
			string contentType = current.Response.ContentType;
			bool _isTextOutput = contentType.Contains( "text" ) || contentType.Contains( "javascript" );
			byte[] _buffer = new byte[buffer.Length+2];
			byte[] _suffix = new byte[2]{0,0};
			/* add two empty bytes to the end of the output */
			string content = "";
			System.Buffer.BlockCopy(buffer,0,_buffer,0,buffer.Length);
			System.Buffer.BlockCopy(_suffix,0,_buffer,0,_suffix.Length);
			try {
				if( executionFilePath.Contains( Main.Responder )
				|| executionFilePath.Contains( Main.AdminResponder )
				|| executionFilePath.Contains( Main.AdminDirectory ) ) {
					handled = false;
					return;/* finally will still execute */
				}
				if( Main.Site != null ) {
					if( Main.Site.Redirectors != null ) {
						content = UTF8Encoding.UTF8.GetString( buffer ) + "  ";
						foreach( Commerce.Redirector r in Main.Site.Redirectors.List ) {
							if( current.Response.ContentType.Contains( r.ErrorMatch )
							&& r.RedirectorType == RedirectorTypes.ResponseFilter &&
							_isTextOutput && r.Enabled ) {
								try {
									if( r.RegEx.IsMatch( content ) ) {
										handled = true;
										content = r.RegEx.Replace( content, r.UrlToRedirectTo );
									}
								} catch( Exception e ) {
									String.Format( "An error occured in HTML Rewrite directive {0}. {1}", r.Id.ToString(), e.Message ).Debug( 0 );
								}
							}
						}
					}
				}
			} catch( Exception e ) {
				String.Format( "An error occured in HTML Rewrite directive. {0}", e.Message ).Debug( 0 );
				OutputStream.Write( buffer, offset, buffer.Length );
			} finally {
				if(_isTextOutput&&handled){
					OutputStream.Write( UTF8Encoding.UTF8.GetBytes( content ), offset, UTF8Encoding.UTF8.GetByteCount( content ) );
				} else {
					OutputStream.Write( buffer, offset, buffer.Length );
				}
			}
        }
        #endregion
    }
}
