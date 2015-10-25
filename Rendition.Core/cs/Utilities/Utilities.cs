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
/* -------------------------------------------------------------------------
* utilities.cs
* 
* Extentions for many types.  Keeps me from typing so much.
* HTTP utilites for rewriting URLs and URIs and URLamas, and respons.blah shortcuts.
* Utitlies for dealing with binary streams.  Paddles and whatnot.
* JSON serialzing and deserializng devices.
* JSON 'responder'.  Converts a JSON string into a method and executes it.
* and obviously a bunch of string stuff.
* ------------------------------------------------------------------------- */
using System;
using System.Data;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Net;
using System.Text.RegularExpressions;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Collections;
using System.Xml;
using System.Timers;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Linq;
using System.Linq.Expressions;
using System.CodeDom;
using System.CodeDom.Compiler;
using System.Reflection;
using Microsoft.CSharp;
using Microsoft.SqlServer.Server;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Linq;
using ZedGraph;
using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using System.Drawing.Drawing2D;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Media3D;
using System.Windows.Media.Imaging;
using System.Windows.Threading;
using System.Threading;
using System.Runtime.InteropServices;
using System.Security.Principal;
using System.Security.Permissions;
using Microsoft.Win32.SafeHandles;
using System.Runtime.ConstrainedExecution;
using System.Security;
using BarcodeLib;
namespace Rendition {
	/// <summary>
	/// Utitlites and extentions for standard objects.
	/// </summary>
	public static class Utilities {
		/// <summary>
		/// GUID Pattern
		/// </summary>
		public static Regex GuidPattern=new Regex(@"^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$",RegexOptions.Compiled);
		/// <summary>
		/// Determines whether the specified string is a GUID.
		/// </summary>
		/// <returns>
		/// 	<c>true</c> if the specified string is a GUID; otherwise, <c>false</c>.
		/// </returns>
		public static bool IsGuid(this string e) {
			Regex guidPattern=new Regex(@"^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$",RegexOptions.Compiled);
			if(guidPattern.IsMatch(e)) {
				return true;
			}
			return false;
		}
		/// <summary>
		/// IIF
		/// </summary>
		/// <param name="condition">if set to <c>true</c> it will return the true result, otherwise the false.</param>
		/// <param name="trueResult">The true result.</param>
		/// <param name="falseResult">The false result.</param>
		/// <returns></returns>
		public static object Iif(bool condition,object trueResult,object falseResult) {
			if(condition==true) { return trueResult; } else { return falseResult; }
		}
		/// <summary>
		/// Encodes a string representation of the Guid prefixed with the letter "d". 
		/// For use in xHTML id fields where {,} and beginging id's with digits are illegal.
		/// </summary>
		/// <returns>An xHTML Id safe string.</returns>
		public static String EncodeXMLId(this Guid g) {
			return 'd'+g.ToString().Replace("}","").Replace("{","").Replace("-","_");
		}
		/// <summary>
		/// Decodes a Guid that has been encoded with the encodeXMLId method.
		/// </summary>
		/// <returns>Guid from the encoded string.</returns>
		public static Guid DecodeXMLId(this string e) {
			if(e==null) { return Guid.Empty; };
			if(e.Length<30) { return Guid.Empty; };
			e=e.Substring(1,e.Length-1);
			e=e.Replace("_","-");
			Regex guidPattern=new Regex(@"^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$",RegexOptions.Compiled);
			if(guidPattern.IsMatch(e)) {
				return new Guid(e);
			}
			return Guid.Empty;
		}
		/// <summary>
		/// Encodes a string for safe output into JSON
		/// </summary>
		/// <returns>JSON Encoded string.</returns>
		public static String ToJson(this string e) {
			if(e==null) { return null; };
			return e.Replace("\"","\\\"").Replace("\n","\\n").Replace("\r","\\r");
		}
		/// <summary>
		/// Escapes string for safe usage in HTML using Server.HtmlEncode
		/// </summary>
		/// <param name="e">Input string</param>
		/// <param name="max">Max length string is allowed to be</param>
		/// <returns>Returns the escaped string.</returns>
		public static string MaxLength(this string e,int max) {
			if(e==null) { return null; };
			if(e.Length>max) {
				return e.Substring(0,max);
			} else {
				return e;
			}
		}
		/// <summary>
		/// Escapes string for safe usage in HTML using Server.HtmlEncode
		/// </summary>
		/// <param name="e">Input string</param>
		/// <param name="max">Max length string is allowed to be</param>
		/// <param name="trim">Trim the string too</param>
		/// <returns>Returns the escaped string.</returns>
		public static string MaxLength(this string e,int max,bool trim) {
			if(e==null){return null;};
			return e.Trim().MaxLength(max);
		}
		/// <summary>
		/// Escapes string for safe usage in HTML using Server.HtmlEncode
		/// </summary>
		/// <param name="e">Input string</param>
		/// <param name="max">Max length string is allowed to be</param>
		/// <param name="trim">if set to <c>true</c> [trim].</param>
		/// <param name="toLower">if set to <c>true</c> [to lower].</param>
		/// <returns>Returns the escaped string.</returns>
		public static string MaxLength(this string e,int max,bool trim,bool toLower) {
            if(toLower) {
                return e.Trim().MaxLength(max, trim).ToLower();
            } else {
                return e.Trim().MaxLength(max, trim);
            }
		}
		/// <summary>
		/// Escapes string for safe usage in HTML using Server.HtmlEncode
		/// </summary>
		/// <returns>Returns the escaped string.</returns>
		public static string h(this string e) {
			if(e==null) { return null; };
			return HttpUtility.HtmlEncode(e);
		}
		/// <summary>
		/// Escapes string for safe usage in a SQL query by replacing ' with ''
		/// </summary>
		/// <returns>Returns the escaped string.</returns>
		public static string s(this string sql_to_inject) {
			if(sql_to_inject==null) {
				return null;
			};
			return sql_to_inject.Replace("'","''");
		}
		/// <summary>
		/// Trims and lowers the case of a string.
		/// Good for comparing strings that may have extra spaces or disimilar cases.
		/// </summary>
		/// <returns>The trimmed lower case version of the string.</returns>
		public static string l(this string e) {
			if(e==null) { return null; };
			return e.Trim();
		}
		/// <summary>
		/// HttpUtility.UrlEncode
		/// </summary>
		/// <returns>URL encoded string.</returns>
		public static string UrlEncode(this string e) {
			if(e==null) { return null; };
			StringBuilder output = new StringBuilder("");
			int x = 0;
			Regex regex = new Regex("(^[a-zA-Z0-9_.]*)");
			while (x < e.Length) {
				MatchCollection matches = regex.Matches(e);
				if (matches != null && matches.Count > 1 && matches[1].Value != "") {
					output.Append(matches[1].Value);
					x += matches[1].Value.Length;
				} else {
					if (e[x] == ' ')
					output.Append("+");
					else {
					var hexVal = ((int)e[x]).ToString("X");
					output.Append('%' + ( hexVal.Length < 2 ? "0" : "" ) + hexVal.ToUpper());
					}
					x++;
				}
			}
			return output.ToString();
		}
		/// <summary>
		/// HttpUtility.HtmlEncode
		/// </summary>
		/// <returns>HTML encoded string.</returns>
		public static string HtmlEncode(this string e) {
			if(e==null) { return null; };
			return HttpUtility.HtmlEncode(e);
		}
		/// <summary>
		/// returns the string +? if the string does contain a ? or string+&amp; if the string does contain a ?.
		/// </summary>
		/// <returns>string with URI pad added</returns>
		public static string UriPad(this string e) {
			if(e==null) { return null; };
			if(e.Contains("?")) {
				return e+"&";
			} else {
				return e+"?";
			}
		}
		/// <summary>
		/// Removes the last X number of characters from the end of a StringBuilder string
		/// </summary>
		/// <param name="s">Input StringBuilder</param>
		/// <param name="characters">Number of characters to remove from the end</param>
		/// <returns>void</returns>
		public static StringBuilder RemoveLast(this StringBuilder s,int characters) {
			if(s.Length==0){
				return s;
			}
			s.Remove(s.Length-characters,characters);
			return s;
		}
		/// <summary>
		/// Removes the last X number of characters from the end of a string
		/// </summary>
		/// <param name="s">Input string</param>
		/// <param name="characters">Number of characters to remove from the end</param>
		/// <returns>void</returns>
		public static string RemoveLast(this string s,int characters) {
			s.Remove(s.Length-characters,characters);
			return s;
		}
		/// <summary>
		/// Makes the string CSV file safe by adding double qutoes around strings with spaces,cr or lf.
		/// </summary>
		/// <param name="v">Input string</param>
		/// <returns></returns>
		public static string ToCsv(this string v) {
			/* if there are quotes replace them with double quotes */
			if(v.Contains("\"")) {
				v.Replace("\"","\"\"");
			}
			/* if there are quotes,commas,cr or lf's put quotes around the string */
			if(v.Contains(",")||v.Contains("\"")||v.Contains("\r")||v.Contains("\n")) {
				v="\""+v+"\"";
			}
			return v;
		}
		/// <summary>
		/// Gets the JSON array.
		/// </summary>
		/// <param name="d">The d.</param>
		/// <returns></returns>
		public static List<object> GetJsonArray(this SqlDataReader d) {
			return GetJsonArray(d,true);
		}
		/// <summary>
		/// returns a JSON array string from the SqlDataReader containing ONLY the raw record set.
		/// </summary>
		/// <param name="d">The SQL data reader</param>
		/// <param name="closeConnection">Once the readers is complete, the reader is closed.</param>
		/// <returns></returns>
		public static List<object> GetJsonArray(this SqlDataReader d,bool closeConnection) {
			List<object> j=new List<object>();
			if(d.HasRows) {
				int fCount=d.FieldCount;
				while(d.Read()) {
					List<object> r=new List<object>();
					for(var x=0;fCount>x;x++) {
						Type t=d.GetFieldType(x);
						if(d.GetValue(x).GetType()==typeof(System.DBNull)) {
							r.Add(null);
						} else {
							if(t==typeof(int)) {
								r.Add(Convert.ToInt32(d.GetValue(x)));
							} else if(t==typeof(double)||t==typeof(float)||t==typeof(decimal)) {
								r.Add(Convert.ToDecimal(d.GetValue(x)));
							} else if(t==typeof(bool)) {
								r.Add(Convert.ToBoolean(d.GetValue(x)));
							} else {
								r.Add(Convert.ToString(d.GetValue(x)));
							}
						}
					}
					j.Add(r);
				}
				if(!closeConnection) {
					d.Close();
				}
			}
			return j;
		}
		/// <summary>
		/// Returns the SqlDataReader as a JSON object with extened information about each row and column.
		/// </summary>
		/// <returns></returns>
		public static Dictionary<string,object> GetJsonCollection(this SqlDataReader d) {
			Dictionary<string,object> j=new Dictionary<string,object>();
			if(d.HasRows) {
				int counter=0;
				int fCount=d.FieldCount;
				while(d.Read()) {
					List<object> r=new List<object>();
					for(var x=0;fCount>x;x++) {
						Type t=d.GetFieldType(x);
						if(t==typeof(int)||t==typeof(double)||t==typeof(float)||t==typeof(decimal)) {
							r.Add(Convert.ToInt32(d.GetValue(x)));
						} else if(t==typeof(bool)) {
							r.Add(Convert.ToBoolean(d.GetValue(x)));
						} else {
							r.Add(Convert.ToString(d.GetValue(x)));
						}
					}
					j.Add("record"+counter++,r);
				}
				j.Add("length",counter);
			}
			return j;
		}
		/// <summary>
		/// Converts a generic system type to a SqlDbType.
		/// </summary>
		/// <param name="t">The t.</param>
		/// <returns></returns>
		public static SqlDbType ToSqlDbType(this System.Type t) {
			SqlParameter param;
			System.ComponentModel.TypeConverter tc;
			param=new SqlParameter();
			tc=System.ComponentModel.TypeDescriptor.GetConverter(param.DbType);
			if(tc.CanConvertFrom(t)) {
				param.DbType=(DbType)tc.ConvertFrom(t.Name);
			} else {
				try {
					param.DbType=(DbType)tc.ConvertFrom(t.Name);
				} catch(Exception e) {
					Main.debug.WriteLine(DateTime.Now.ToString()+':'+e.Message);
				}
			}
			return param.SqlDbType;
		}
		/// <summary>
		/// Finds the first occurance of the byte array [binarySearchArray] in the MemoryStream starting from [startSearchFrom].
		/// </summary>
		/// <param name="ms">Input memory stream</param>
		/// <param name="binarySearchArray">The binary search array.</param>
		/// <param name="startSearchFrom">Start search from.</param>
		/// <returns></returns>
		public static long FindFirst(this MemoryStream ms,byte[] binarySearchArray,long startSearchFrom) {
			List<long> outputList=ms.Find(binarySearchArray,startSearchFrom);
			if(outputList.Count>0) {
				return outputList[0];
			} else {
				return -1;
			}
		}
		/// <summary>
		/// Moves the MemoryStream backwards until the byte array [binarySearchArray] is found, then returns the location of the byte array.
		/// </summary>
		/// <param name="ms">Input memory stream</param>
		/// <param name="binarySearchArray">The binary search array.</param>
		/// <returns></returns>
		public static long MoveBackwardsUntil(this MemoryStream ms,byte[] binarySearchArray) {
			return ms.MoveUntil(binarySearchArray,true);
		}
		/// <summary>
		/// Moves the MemoryStream forward until the byte array [binarySearchArray] is found, then returns the location of the byte array.
		/// </summary>
		/// <param name="ms">Input memory stream</param>
		/// <param name="binarySearchArray">The binary search array.</param>
		/// <returns></returns>
		public static long MoveForwardUntil(this MemoryStream ms,byte[] binarySearchArray) {
			return ms.MoveUntil(binarySearchArray,false);
		}
		/// <summary>
		/// Moves the MemoryStream position forwards until it encouters [binarySearchArray], then it returns the position of that byte array.
		/// [direction] sets forwards or backwards.
		/// </summary>
		/// <param name="ms">Input memory stream</param>
		/// <param name="binarySearchArray">The binary search array.</param>
		/// <param name="direction">if set to <c>true</c> [direction].</param>
		/// <returns></returns>
		public static long MoveUntil(this MemoryStream ms,byte[] binarySearchArray,bool direction) {
			const int BUFFER_LENGTH=10240;
			byte[] buffer=new byte[BUFFER_LENGTH];
			long bytes=BUFFER_LENGTH;
			long searchOffset=0;
			int searchLength=binarySearchArray.Length;
			while(bytes>0) {
				bytes=ms.Read(buffer,0,BUFFER_LENGTH);
				for(var x=0;bytes>x;x++) {
					for(var y=0;searchLength>y;y++) {
						if(x+y>bytes-1) {
							break;
						}
						if(binarySearchArray[y]!=buffer[x+y]) {
							break;
						}
						if(searchLength-1==y) {
							return x+y+searchOffset-searchLength-1;
						}
					}
				}
				if(!direction) {
					searchOffset+=BUFFER_LENGTH-searchLength;
				} else {
					searchOffset-=BUFFER_LENGTH-searchLength;
				}
			}
			return -1;
		}
		/// <summary>
		/// Finds every instance of the byte array [binarySearchArray] in the MemoryStream, then returns a List of longs of their locations.
		/// </summary>
		/// <param name="ms">Input memory stream</param>
		/// <param name="binarySearchArray">The binary search array.</param>
		/// <param name="startSearchFrom">The start search from.</param>
		/// <returns></returns>
		public static List<long> Find(this MemoryStream ms,byte[] binarySearchArray,long startSearchFrom) {
			List<long> outputList=new List<long>();
			long startingPosition=ms.Position;
			ms.Position=startSearchFrom;
			const int BUFFER_LENGTH=10240;
			byte[] buffer=new byte[BUFFER_LENGTH];
			long bytes=BUFFER_LENGTH;
			long searchOffset=0;
			int searchLength=binarySearchArray.Length;
			while(bytes>0) {
				bytes=ms.Read(buffer,0,BUFFER_LENGTH);
				for(var x=0;bytes>x;x++) {
					for(var y=0;searchLength>y;y++) {
						if(x+y>bytes-1) {
							break;
						}
						if(binarySearchArray[y]!=buffer[x+y]) {
							break;
						}
						if(searchLength-1==y) {
							outputList.Add(x+y+searchOffset-searchLength-1+startSearchFrom);
							break;
						}
					}
				}
				searchOffset+=BUFFER_LENGTH;
			}
			ms.Position=startingPosition;
			return outputList;
		}
		/// <summary>
		/// Finds the first occurance of the byte array [binarySearchArray] in the FileStream starting from [startSearchFrom].
		/// </summary>
		/// <param name="fs">Input FileStream</param>
		/// <param name="binarySearchArray">The binary search array.</param>
		/// <param name="startSearchFrom">Start search from.</param>
		/// <returns></returns>
		public static long FindFirst(this FileStream fs,byte[] binarySearchArray,long startSearchFrom) {
			List<long> outputList=fs.Find(binarySearchArray,startSearchFrom);
			if(outputList.Count>0) {
				return outputList[0];
			} else {
				return -1;
			}
		}
		/// <summary>
		/// Moves the FileStream backwards until the byte array [binarySearchArray] is found, then returns the location of the byte array.
		/// </summary>
		/// <param name="fs">Input FileStream</param>
		/// <param name="binarySearchArray">The binary search array.</param>
		/// <returns></returns>
		public static long MoveBackwardsUntil(this FileStream fs,byte[] binarySearchArray) {
			return fs.MoveUntil(binarySearchArray,true);
		}
		/// <summary>
		/// Moves the FileStream forward until the byte array [binarySearchArray] is found, then returns the location of the byte array.
		/// </summary>
		/// <param name="fs">Input FileStream</param>
		/// <param name="binarySearchArray">The binary search array.</param>
		/// <returns></returns>
		public static long MoveForwardUntil(this FileStream fs,byte[] binarySearchArray) {
			return fs.MoveUntil(binarySearchArray,false);
		}
		/// <summary>
		/// Moves the FileStream position forwards until it encouters [binarySearchArray], then it returns the position of that byte array.
		/// [direction] sets forwards or backwards.
		/// </summary>
		/// <param name="fs">The FileStream</param>
		/// <param name="binarySearchArray">The binary search array.</param>
		/// <param name="direction">if set to <c>true</c> the stream searches forwards.</param>
		/// <returns></returns>
		public static long MoveUntil(this FileStream fs,byte[] binarySearchArray,bool direction) {
			const int BUFFER_LENGTH=10240;
			byte[] buffer=new byte[BUFFER_LENGTH];
			long bytes=BUFFER_LENGTH;
			long searchOffset=0;
			int searchLength=binarySearchArray.Length;
			while(bytes>0) {
				bytes=fs.Read(buffer,0,BUFFER_LENGTH);
				for(var x=0;bytes>x;x++) {
					for(var y=0;searchLength>y;y++) {
						if(x+y>bytes-1) {
							break;
						}
						if(binarySearchArray[y]!=buffer[x+y]) {
							break;
						}
						if(searchLength-1==y) {
							return x+y+searchOffset-searchLength-1;
						}
					}
				}
				if(!direction) {
					searchOffset+=BUFFER_LENGTH;
				} else {
					searchOffset-=BUFFER_LENGTH;
				}
			}
			return -1;
		}
		/// <summary>
		/// Finds every occurace of [binarySearchArray] in the FileStream and returns the locations as a List of longs.
		/// This function only searches forwards from the starting position.
		/// </summary>
		/// <param name="fs">The FileStream</param>
		/// <param name="binarySearchArray">The byte array to search for.</param>
		/// <param name="startSearchFrom">What position to start searching from.</param>
		/// <returns></returns>
		public static List<long> Find(this FileStream fs,byte[] binarySearchArray,long startSearchFrom) {
			List<long> outputList=new List<long>();
			long startingPosition=fs.Position;
			fs.Position=startSearchFrom;
			const int BUFFER_LENGTH=10240;
			byte[] buffer=new byte[BUFFER_LENGTH];
			long bytes=BUFFER_LENGTH;
			long searchOffset=0;
			int searchLength=binarySearchArray.Length;
			while(bytes>0) {
				bytes=fs.Read(buffer,0,BUFFER_LENGTH);
				for(var x=0;bytes>x;x++) {
					for(var y=0;searchLength>y;y++) {
						if(x+y>bytes-1) {
							break;
						}
						if(binarySearchArray[y]!=buffer[x+y]) {
							break;
						}
						if(searchLength-1==y) {
							outputList.Add(x+y+searchOffset-searchLength-1+startSearchFrom);
							break;
						}
					}
				}
				searchOffset+=BUFFER_LENGTH;
			}
			fs.Position=startingPosition;
			return outputList;
		}
		/// <summary>
		/// Turns a date into Unix Epoch time (usualy for output into JSON).
		/// </summary>
		/// <param name="dateTime">The date time.</param>
		/// <returns></returns>
		public static int ToSeconds(this DateTime dateTime) {
			return dateTime.Hour*3600+dateTime.Minute*60+dateTime.Second;
		}
		/// <summary>
		/// Turns almost anything into a JSON string.
		/// </summary>
		/// <returns></returns>
		public static string ToJson(this object obj) {
			Newtonsoft.Json.JsonSerializer json=new Newtonsoft.Json.JsonSerializer();
			json.NullValueHandling=NullValueHandling.Include;
			json.ObjectCreationHandling=Newtonsoft.Json.ObjectCreationHandling.Replace;
			json.MissingMemberHandling=Newtonsoft.Json.MissingMemberHandling.Ignore;
			json.ReferenceLoopHandling=ReferenceLoopHandling.Error;
			json.Error+=delegate(object sender, Newtonsoft.Json.Serialization.ErrorEventArgs args){
				string errObject = args.ErrorContext.OriginalObject.GetType().ToString();
				String.Format("Error serializing object {0}.",errObject).Debug(5);
				args.ErrorContext.Handled = true;
			};
			string output = "";
			using(StringWriter sw=new StringWriter()){
				Newtonsoft.Json.JsonTextWriter writer=new JsonTextWriter(sw);
				writer.Formatting=Newtonsoft.Json.Formatting.Indented;
				writer.QuoteChar='"';
				json.Serialize(writer,obj);
				output=sw.ToString();
			}
			return output;
		}
		/// <summary>
		/// Turns JSON arrays and JSON objects into Lists and Dictionaries.
		/// </summary>
		/// <param name="jobject">The jobject.</param>
		/// <returns></returns>
		public static object JTokenToGeneric(this object jobject) {
			if(jobject.GetType()==typeof(JValue)) {
				JValue o=(JValue)jobject;
				return o.Value;
			} else if(jobject.GetType()==typeof(JArray)) {
				List<object> j=new List<object>();
				foreach(object b in jobject as JArray) {
					j.Add(b.JTokenToGeneric());
				}
				return j;
			} else {
				Dictionary<string,object> j=new Dictionary<string,object>();
				JObject o=(JObject)jobject;
				foreach(KeyValuePair<string,JToken> i in o) {
					j.Add(i.Key,i.Value.JTokenToGeneric());
				}
				return j;
			}
		}
		/// <summary>
		/// Check if the specified column exists in the data set.
		/// </summary>
		/// <param name="r">The r.</param>
		/// <param name="columnName">Name of the column.</param>
		/// <returns>
		/// 	<c>true</c> if the specified r has column; otherwise, <c>false</c>.
		/// </returns>
		public static bool HasColumn(this SqlDataReader r,string columnName) {
			try {
				return r.GetOrdinal(columnName)>=0;
			} catch(IndexOutOfRangeException) {
				return false;
			}
		}
		/// <summary>
		/// If the key is present in the dictionary the key's value will be returned
		/// else the argument defaultValue will be returned
		/// or if the third argument is null then a missing key will result in a null value.
		/// </summary>
		/// <param name="d">The input Dictionary</param>
		/// <param name="keyName">Name of the key.</param>
		/// <param name="defaultValue">The default value.</param>
		/// <param name="defaultValueOrNull">if set to <c>true</c> [default value or null].</param>
		/// <returns></returns>
		public static object KeyOrDefault(this Dictionary<string,object> d,
		string keyName,object defaultValue,bool defaultValueOrNull) {
			if(d.ContainsKey(keyName)) {
				if(d[keyName]!=null) {
					return d[keyName];
				} else {
					if(defaultValueOrNull) {
						return defaultValue;
					} else {
						return null;
					}
				}
			} else {
				if(defaultValueOrNull) {
					return defaultValue;
				} else {
					return null;
				}
			}
		}
		/// <summary>
		/// If the key is present in the dictionary the key's value will be returned
		/// else the argument defaultValue will be returned.
		/// </summary>
		/// <param name="d">Input Dictionary</param>
		/// <param name="keyName">Name of the key.</param>
		/// <param name="defaultValue">The default value.</param>
		/// <returns></returns>
		public static object KeyOrDefault(this Dictionary<string,object> d,
		string keyName,object defaultValue) {
			if(d.ContainsKey(keyName)) {
				return d[keyName];
			} else {
				return defaultValue;
			}
		}
		/// <summary>
		/// Turns a virtual path starting with ~ into a physical path on the server.
		/// </summary>
		/// <param name="path">The path.</param>
		/// <returns></returns>
		public static string VirtualToPhysicalSitePath(this string path){
			return path.Replace("~/",Main.PhysicalApplicationPath).Replace("/","\\");
		}
		/// <summary>
		/// Wrapper for HttpContext.Current.Response.Write.
		/// Writes a line to the current HTTP client.
		/// </summary>
		/// <param name="stringToWrite">The string to write.</param>
		public static void w(this object stringToWrite) {
			HttpContext.Current.Response.Write(stringToWrite);
		}
		/// <summary>
		/// Wrapper for HttpContext.Current.Response.Write.
		/// Writes a line to the current HTTP client.
		/// And optionaly flushes the response buffer to the HTTP client.
		/// </summary>
		/// <param name="stringToWrite">The string to write.</param>
		/// <param name="flush">if set to <c>true</c> [flush].</param>
		public static void w(this object stringToWrite,bool flush) {
			HttpContext.Current.Response.Write(stringToWrite);
			if(flush) {
				HttpContext.Current.Response.Flush();
			}
		}
		/// <summary>
		/// Creates a randoms the number.
		/// </summary>
		/// <param name="min">Minimum number to generate.</param>
		/// <param name="max">Maximum number to generate.</param>
		/// <returns></returns>
		private static int RandomNumber(int min,int max) {
			Random random=new Random();
			return random.Next(min,max);
		}
		/// <summary>
		/// Generates a random string with the given length
		/// </summary>
		/// <param name="size">Size of the string</param>
		/// <param name="lowerCase">If true, generate lowercase string</param>
		/// <returns>Random string</returns>
		private static string RandomString(int size,bool lowerCase) {
			StringBuilder builder=new StringBuilder();
			Random random=new Random();
			char ch;
			for(int i=0;i<size;i++) {
				ch=Convert.ToChar(Convert.ToInt32(Math.Floor(26*random.NextDouble()+65)));
				builder.Append(ch);
			}
			if(lowerCase)
				return builder.ToString();
			return builder.ToString();
		}
		/// <summary>
		/// Creates a file name without extention based on a base64 Guid (but _not_ convertable back into a GUID).
		/// </summary>
		/// <param name="o">The Guid you want to turn into a file name.</param>
		/// <returns>File name safe Guid value.</returns>
		public static string ToFileName(this Guid o) {
			return Regex.Replace(Convert.ToBase64String(o.ToByteArray()),"/|\\\\|:|\\*|\\?|\"|\\<|\\>|\\||\\+|\\=","");
		}
		/// <summary>
		/// Creates a unique hash value from a Guid.
		/// </summary>
		/// <param name="o">The Guid you want to turn into a hash value.</param>
		/// <returns>Base64 representation of the Guid</returns>
		public static string ToBase64DomId(this Guid o) {
			return "d"+Regex.Replace(Convert.ToBase64String(o.ToByteArray()),"/|\\\\|:|\\*|\\?|\"|\\<|\\>|\\||\\+|\\=","");
		}
		/// <summary>
		/// Creates a unique hash value from a Guid.
		/// </summary>
		/// <param name="o">The Guid you want to turn into a hash value.</param>
		/// <returns>Base64 representation of the Guid</returns>
		public static string ToBase64Hash(this Guid o) {
			return Regex.Replace(Convert.ToBase64String(o.ToByteArray()),"/|\\\\|:|\\*|\\?|\"|\\<|\\>|\\||\\+|\\=","");
		}
		/// <summary>
		/// Gets the encoder info for a particualr mimeType.
		/// </summary>
		/// <param name="mimeType">Type of the MIME.</param>
		/// <returns></returns>
		internal static System.Drawing.Imaging.ImageCodecInfo GetEncoderInfo(String mimeType){
			int j;
			System.Drawing.Imaging.ImageCodecInfo[] encoders;
			encoders = System.Drawing.Imaging.ImageCodecInfo.GetImageEncoders();
			for(j = 0; j < encoders.Length; ++j){
				if(encoders[j].MimeType == mimeType)
					return encoders[j];
			}
			return null;
		}
        /// <summary>
        /// Saves the Bitmap as a JPG with options.
        /// </summary>
        /// <param name="bitmap">The bitmap.</param>
        /// <param name="path">The path.</param>
        /// <param name="quality">The quality.</param>
		public static void SaveJpg(this System.Drawing.Bitmap bitmap, string path, long quality){
			System.Drawing.Imaging.ImageCodecInfo codecInfo = GetEncoderInfo("image/jpeg");
			System.Drawing.Imaging.Encoder encoder = System.Drawing.Imaging.Encoder.Quality;
			System.Drawing.Imaging.EncoderParameters encoderParameters = new System.Drawing.Imaging.EncoderParameters(1);
			System.Drawing.Imaging.EncoderParameter encoderParameter = new System.Drawing.Imaging.EncoderParameter(encoder, quality);
			encoderParameters.Param[0] = encoderParameter;
			using(Stream st=File.Create(path)){
				bitmap.Save(st,codecInfo,encoderParameters);
			}
			return;
		}
		/// <summary>
		/// Sends the object as a string to the debugging console (output,debug.log).
		/// </summary>
		/// <param name="o">The Object</param>
		/// <param name="verbosity">The verbosity.</param>
		/// <param name="supressDate">if set to <c>true</c> [supress date].</param>
		/// <returns></returns>
		public static object Debug(this object o, int verbosity, bool supressDate) {
            string _msg = "";
            try {
                if(Main.LogVerbosity >= verbosity) {
                    _msg = o.ToString();
                    string output = (supressDate ? "" : DateTime.Now.ToString() + ":") + _msg;
                    if(Main.debug != null) {
                        Main.debug.WriteLine(output);
                    }
                    Rendition.TelnetServer.WriteToAllClients(_msg);
                }
            }catch{}
			return o;
		}
		/// <summary>
		/// Converts a string to a base 53 number (0-9, A-Z, a-z).
		/// Limited to the size of the int class.
		/// </summary>
		/// <param name="base53number">The base53number.</param>
		/// <returns></returns>
		public static int ConvertBase53(string base53number){
		   char[] base32 = new char[] {
			  '0','1','2','3','4','5','6','7',
			  '8','9','a','b','c','d','e','f',
			  'g','h','i','j','k','l','m','n',
			  'o','p','q','r','s','t','u','v',
			  'w','x','y','z','A','B','C','D',
			  'E','F','G','H','I','J','K','L',
			  'M','N','O','P','Q','R','S','T',
			  'U','V','W','X','Y','Z'
		   };
		   int n = 0;
		   foreach (char d in base53number){
			  n = n << 5;
			  int idx = Array.IndexOf(base32, d);
			  if (idx == -1)
				 throw new Exception("Provided number contains invalid characters");
			  n += idx;
		   }
		   return n;
		}
		/// <summary>
		/// Sends information to the output.
		/// </summary>
		/// <param name="o">The object to turn into a string and display on the console.</param>
		/// <param name="verbosity">Verbosity level 1-10. 1 = quiet time. 10 = the truth shall set you free.</param>
		/// <returns>The object passed.</returns>
		public static object Debug(this object o, int verbosity) {
			o.Debug(verbosity,false);
			return o;
		}
		/// <summary>
		/// Creates a connection when the connection passed is null.
		/// </summary>
		/// <param name="cn1">The CN1.</param>
		/// <returns>Working SQL connection.</returns>
		public static SqlConnection GetActiveConnectionWhenNull(SqlConnection cn1){
			if(cn1!=null){
				return cn1;
			}else{
                return Site.CreateConnection(true, true);
			}
		}
	}
	/// <summary>
	/// Impersonates another user briefly
	/// </summary>
	public class Impersonation : IDisposable {
		WindowsImpersonationContext ImpersonatedUser = null;
		WindowsIdentity NewId = null;
		[DllImport( "advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode )]
		private static extern bool LogonUser( String lpszUsername, String lpszDomain, String lpszPassword,
			int dwLogonType, int dwLogonProvider, out SafeTokenHandle phToken );
		[DllImport( "kernel32.dll", CharSet = CharSet.Auto )]
		private extern static bool CloseHandle( IntPtr handle );
		/// <summary>
		/// Initializes a new instance of the <see cref="Impersonation"/> class.
		/// </summary>
		[PermissionSetAttribute( SecurityAction.Demand, Name = "FullTrust" )]
		public Impersonation() {
			try {
				SafeTokenHandle safeTokenHandle = null;
				string userName, domainName;
				// Get the user token for the specified user, domain, and password using the
				// unmanaged LogonUser method.
				// The local machine name can be used for the domain name to impersonate a user on this machine.
				domainName = Main.ElevatedSecurityDomain;
				userName = Main.ElevatedSecurityUser;
				const int LOGON32_PROVIDER_DEFAULT = 0;
				//This parameter causes LogonUser to create a primary token.
				const int LOGON32_LOGON_INTERACTIVE = 2;

				// Call LogonUser to obtain a handle to an access token.
				bool returnValue = LogonUser( userName, domainName, Main.ElevatedSecurityPassword,
					LOGON32_LOGON_INTERACTIVE, LOGON32_PROVIDER_DEFAULT,
					out safeTokenHandle );
				if( false == returnValue ) {
					int ret = Marshal.GetLastWin32Error();
					( "LogonUser failed with error code : " + ret ).Debug( 0 );
					throw new System.ComponentModel.Win32Exception( ret );
				}
				// Use the token handle returned by LogonUser.
				NewId = new WindowsIdentity( safeTokenHandle.DangerousGetHandle() );
				ImpersonatedUser = NewId.Impersonate();
			} catch( Exception ex ) {
				string msg = "Impersonate user exception occurred. " + ex.Message;
				( msg ).Debug( 0 );
				throw new Exception( msg );
			}
		}
		/// <summary>
		/// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
		/// </summary>
		public void Dispose() {
			NewId.Dispose();
			ImpersonatedUser.Dispose();
		}
	}
	/// <summary>
	/// Used by the Impersonation class
	/// </summary>
	internal sealed class SafeTokenHandle : SafeHandleZeroOrMinusOneIsInvalid {
		private SafeTokenHandle()
			: base( true ) {
		}
		[DllImport( "kernel32.dll" )]
		[ReliabilityContract( Consistency.WillNotCorruptState, Cer.Success )]
		[SuppressUnmanagedCodeSecurity]
		[return: MarshalAs( UnmanagedType.Bool )]
		private static extern bool CloseHandle( IntPtr handle );

		protected override bool ReleaseHandle() {
			return CloseHandle( handle );
		}
	}
}