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
namespace Rendition {
	internal partial class Main : IHttpModule {
		private static void setStatusCode( HttpContext current, int code ) {
			int statusCode;
			string statusDescription;
			switch( code ) {
				case 100:
					statusCode = 100;
					statusDescription = "Continue";
					break;
				case 101:
					statusCode = 101;
					statusDescription = "Switching Protocols";
					break;
				case 200:
					statusCode = 200;
					statusDescription = "OK";
					break;
				case 201:
					statusCode = 201;
					statusDescription = "Created";
					break;
				case 202:
					statusCode = 201;
					statusDescription = "Accepted";
					break;
				case 203:
					statusCode = 203;
					statusDescription = "Non-Authoritative Information";
					break;
				case 204:
					statusCode = 204;
					statusDescription = "Content";
					break;
				case 205:
					statusCode = 205;
					statusDescription = "Reset Content";
					break;
				case 206:
					statusCode = 206;
					statusDescription = "Partial Content";
					break;
				case 301:
					statusCode = 301;
					statusDescription = "Moved Permanently";
					break;
				case 302:
					statusCode = 302;
					statusDescription = "Found";
					break;
				case 303:
					statusCode = 303;
					statusDescription = "See Other";
					break;
				case 304:
					statusCode = 304;
					statusDescription = "Not Modified";
					break;
				case 305:
					statusCode = 305;
					statusDescription = "Use Proxy";
					break;
				case 306:
					statusCode = 306;
					statusDescription = "(Unused)";
					break;
				case 307:
					statusCode = 307;
					statusDescription = "Temporary Redirect";
					break;
				case 401:
					statusCode = 401;
					statusDescription = "Unauthorized";
					break;
				case 402:
					statusCode = 402;
					statusDescription = "Payment Required";
					break;
				case 403:
					statusCode = 403;
					statusDescription = "Forbidden";
					break;
				case 404:
					statusCode = 404;
					statusDescription = "Not Found";
					break;
				case 405:
					statusCode = 405;
					statusDescription = "Method Not Allowed";
					break;
				case 406:
					statusCode = 406;
					statusDescription = "Not Acceptable";
					break;
				case 407:
					statusCode = 407;
					statusDescription = "Proxy Authentication Required";
					break;
				case 408:
					statusCode = 408;
					statusDescription = "Request Timeout";
					break;
				case 409:
					statusCode = 409;
					statusDescription = "Conflict";
					break;
				case 410:
					statusCode = 410;
					statusDescription = "Gone";
					break;
				case 411:
					statusCode = 411;
					statusDescription = "Length Required";
					break;
				case 412:
					statusCode = 412;
					statusDescription = "Precondition Failed";
					break;
				case 413:
					statusCode = 413;
					statusDescription = "Request Entity Too Large";
					break;
				case 414:
					statusCode = 414;
					statusDescription = "Request-URI Too Long";
					break;
				case 415:
					statusCode = 415;
					statusDescription = "Unsupported Media Type";
					break;
				case 416:
					statusCode = 416;
					statusDescription = "Requested Range Not Satisfiable";
					break;
				case 417:
					statusCode = 417;
					statusDescription = "Expectation Failed";
					break;
				case 500:
					statusCode = 500;
					statusDescription = "Internal Server Error";
					break;
				case 501:
					statusCode = 501;
					statusDescription = "Not Implemented";
					break;
				case 502:
					statusCode = 502;
					statusDescription = "Bad Gateway";
					break;
				case 503:
					statusCode = 503;
					statusDescription = "Service Unavailable";
					break;
				case 504:
					statusCode = 504;
					statusDescription = "Gateway Timeout";
					break;
				case 505:
					statusCode = 505;
					statusDescription = "HTTP Version Not Supported";
					break;
				default:
					statusCode = 200;
					statusDescription = "OK";
					break;
			}
			current.Response.StatusDescription = statusDescription;
			current.Response.StatusCode = statusCode;
		}
	}
}