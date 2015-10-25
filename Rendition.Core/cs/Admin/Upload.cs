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
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Data;
using System.Web;
using System.Reflection;
namespace Rendition {
	public partial class Admin {
        /// <summary>
        /// Iis7s the upload.
        /// </summary>
		public static void Iis7Upload(){

		}
		/// <summary>
		/// Handles file uploads, supplies a progress meter using class ProgressInfo.
		/// </summary>
		public static void Iis6Upload() {
			( "FUNCTION /w SP,ADHOC,fileSystem,binaryStream upload" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
			string uploadId = HttpContext.Current.Request.QueryString[ "uploadId" ];
			string explicitTarget = HttpContext.Current.Request.QueryString[ "target" ];
			string targetDirectory = Main.PhysicalApplicationPath;
			string userRootDir = targetDirectory + "\\user\\";
			string userDir = targetDirectory + "\\user\\" + Convert.ToString( Session.CurrentSession.UserId );
			string publicDir = targetDirectory + "\\user\\public";
			string tempDir = targetDirectory + "\\temp";
			if( !Directory.Exists( userRootDir ) ) {
				Directory.CreateDirectory( userRootDir );
			}
			if( !Directory.Exists( tempDir ) ) {
				Directory.CreateDirectory( tempDir );
			}
            if(Session.CurrentSession.UserId == -1) {
				targetDirectory = publicDir;
				if( !Directory.Exists( publicDir ) ) {
					Directory.CreateDirectory( publicDir );
				}
			} else {
				targetDirectory = userDir;
				if( !Directory.Exists( userDir ) ) {
					Directory.CreateDirectory( userDir );
				}
			}
			if( explicitTarget.Length > 0 ) {
				if( Directory.Exists( explicitTarget ) ) {
					targetDirectory = explicitTarget;
				}
			}
			const int BUFFER_SIZE = 16384;
			/* find the raw request */
			HttpWorkerRequest request = ( HttpWorkerRequest )HttpContext.Current.GetType().GetProperty( "WorkerRequest", ( BindingFlags )36 ).GetValue( HttpContext.Current, null );
			string contentType = HttpContext.Current.Request.ContentType;
			if( contentType.Contains( "multipart/form-data" ) ) {
                using(Impersonation imp = new Impersonation()) {
                    Guid id = new Guid(uploadId);
                    ProgressInfo u = new ProgressInfo(id);
                    if(!Main.ProgressInfos.ContainsKey(id)) {
                        Main.ProgressInfos.Add(id, u);
                    } else {
                        Main.ProgressInfos[id] = u;
                    }
                    string boundary = contentType.Substring(contentType.IndexOf("boundary=") + 9);
                    List<string> delList = new List<string>();
                    byte[] binBoundary = System.Text.Encoding.UTF8.GetBytes(boundary);
                    byte[] binFileNameProp = System.Text.Encoding.UTF8.GetBytes("filename=\"");
                    u.TotalItemSize = Convert.ToInt32(request.GetKnownRequestHeader(HttpWorkerRequest.HeaderContentLength));
                    u.CurrentItemName = "multipart/form-data stream";
                    if(u.TotalItemSize < 0) {
                        u.Complete = true;
                        return;
                    }; /* over size */
                    u.CurrentSizeComplete = 0;
                    int bytes = BUFFER_SIZE;
                    byte[] buffer = new byte[BUFFER_SIZE];
                    Guid tempFileId = System.Guid.NewGuid();
                    buffer.Equals(buffer);
                    byte[] body = request.GetPreloadedEntityBody();
                    u.CurrentSizeComplete += body.Length;
                    string tempFile = Main.PhysicalApplicationPath + "\\temp\\temp_" + tempFileId.ToString() + ".tmp";
                    delList.Add(tempFile);
                    try {
                        long tickCount = Environment.TickCount;
                        long tickTimeout = 1000;
                        u.Started = DateTime.Now;
                        using(FileStream fs = File.Create(tempFile)) {
                            fs.Write(body, 0, body.Length);
                            if(!request.IsEntireEntityBodyIsPreloaded()) {
                                while((u.TotalItemSize - u.CurrentSizeComplete) >= bytes) {
                                    bytes = request.ReadEntityBody(buffer, buffer.Length);
                                    u.CurrentSizeComplete += bytes;
                                    u.Updated = DateTime.Now;
                                    fs.Write(buffer, 0, bytes);
                                    if(bytes > 0) {
                                        tickCount = Environment.TickCount;
                                    }
                                    if(Environment.TickCount - tickCount > tickTimeout) {
                                        ("HTTP client tick timedout during upload.").Debug(4);
                                        u.Complete = true;
                                        File.Delete(tempFile);
                                        return;
                                    }
                                }
                                bytes = request.ReadEntityBody(buffer, (u.TotalItemSize - u.CurrentSizeComplete));
                                fs.Write(buffer, 0, bytes);
                                u.CurrentSizeComplete += bytes;
                            }
                        }
                        /* file(s) downloaded now parse the request file */
                        List<long> boundaries = new List<long>();
                        List<long> fileNames = new List<long>();
                        long boundaryLength = binBoundary.Length;
                        long bufferSize = 10240;
                        using(FileStream fs = File.OpenRead(tempFile)) {
                            boundaries = fs.Find(binBoundary, 0);/*get all the boundraies in the upload*/
                            List<string> tmpFilePaths = new List<string>();
                            u.TotalItemSize = Convert.ToInt32(fs.Length);
                            for(var x = 0; boundaries.Count - 1 > x; x++) {
                                byte[] cBuffer = new byte[bufferSize];
                                string fileName = "";
                                long endAt = 0;
                                long headerEndsAt = 0;
                                string destFilePath = Main.PhysicalApplicationPath + "\\temp\\temp_" + tempFileId.ToString() + "___" + Convert.ToString(x) + ".tmp";
                                if(boundaries.Count - 1 == x) {
                                    endAt = fs.Length;
                                } else {
                                    endAt = boundaries[x + 1];
                                }
                                using(FileStream ds = File.Create(destFilePath)) {
                                    u.CurrentSizeComplete = Convert.ToInt32(boundaries[x]);
                                    fs.Position = boundaries[x];
                                    headerEndsAt = fs.FindFirst(new byte[4] { 13, 10, 13, 10 }, boundaries[x]) + 6;
                                    fs.Position = boundaries[x];
                                    byte[] headerBytes = new byte[headerEndsAt - boundaries[x]];
                                    bytes = fs.Read(headerBytes, 0, headerBytes.Length);
                                    string header = System.Text.Encoding.UTF8.GetString(headerBytes);
                                    int filenameStart = header.IndexOf("filename=\"") + 10;
                                    int filenameEnds = header.IndexOf("\"", filenameStart);
                                    fileName = header.Substring(filenameStart, (filenameEnds - filenameStart));
                                    u.CurrentItemName = fileName;
                                    /* move to the end of the header */
                                    fs.Position = headerEndsAt;
                                    /*copy the data from the sumission temp file into the finished temp file*/
                                    bytes = 1;
                                    long dataLength = endAt - headerEndsAt;
                                    long readIn = 0;
                                    int remainder = Convert.ToInt32(dataLength % cBuffer.Length);
                                    if(dataLength > cBuffer.Length) {
                                        while((readIn + cBuffer.Length) < dataLength) {
                                            bytes = fs.Read(cBuffer, 0, cBuffer.Length);
                                            ds.Write(cBuffer, 0, cBuffer.Length);
                                            readIn += cBuffer.Length;
                                        }
                                    } else {
                                        remainder = Convert.ToInt32(dataLength);
                                    }
                                    if(remainder > 0) {
                                        fs.Read(cBuffer, 0, remainder);
                                        ds.Write(cBuffer, 0, remainder);
                                    }
                                    if(fileName.Length > 0 && filenameStart > 9) {
                                        tmpFilePaths.Add(destFilePath + "|" + fileName);
                                    }
                                    delList.Add(destFilePath);
                                }
                            }
                            for(var y = 0; tmpFilePaths.Count > y; y++) {
                                string tempFileLocation = tmpFilePaths[y].Split('|')[0];
                                string orgFileNameWithExt = tmpFilePaths[y].Split('|')[1];
                                string orgFileExt = Path.GetExtension(orgFileNameWithExt);
                                string orgFileName = Path.GetFileNameWithoutExtension(orgFileNameWithExt);
                                string newFileName = orgFileName;
                                string newFileNameWithExt = orgFileName + orgFileExt;
                                int f = 0;
                                while(File.Exists(Path.Combine(targetDirectory, newFileNameWithExt))) {
                                    newFileNameWithExt = newFileName + "(" + Convert.ToString(f + 1) + ")" + orgFileExt;
                                    f++;
                                }
                                File.Move(tempFileLocation, Path.Combine(targetDirectory, newFileNameWithExt));
                                u.UploadedFiles.Add(Path.Combine(targetDirectory, newFileNameWithExt));
                            }
                        }
                        for(var y = 0; delList.Count > y; y++) {
                            File.Delete(delList[y]);
                        }
                        u.Complete = true;
                    } catch(Exception e) {
                        (e.Message).Debug(0);
                        u.Complete = true;
                        for(var y = 0; delList.Count > y; y++) {
                            File.Delete(delList[y]);
                        }
                    }
                }
			}
			try {
				HttpContext.Current.Response.Redirect( Main.AdminDirectory + "/js/blank.html" );
				request.FlushResponse( true );
				request.EndOfRequest();
				request.CloseConnection();
			} finally {

			}
			return;
		}
	}
}
