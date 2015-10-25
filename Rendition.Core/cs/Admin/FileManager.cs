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
using System.Collections;
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
namespace Rendition {
	public partial class Admin {
        /// <summary>
        /// Saves text of a file at the specified path.
        /// </summary>
        /// <param name="path">The path.</param>
        /// <param name="encoding">The encoding.</param>
        /// <param name="text">The text.</param>
        /// <param name="lastWriteTime">The last write time.</param>
        /// <param name="override_warning">if set to <c>true</c> [override_warning].</param>
        /// <returns>
        /// JSON Object
        /// </returns>
        public static Dictionary<string, object> SaveFileText(string path, string encoding, string text, string lastWriteTime, bool override_warning) {
            ("FUNCTION /w (!PRIVATE ACCESS ONLY!),fileSystem SaveFileText").Debug(10);
            //convert virtual paths into real paths
            if(path.StartsWith("~/")) {
                path = HttpContext.Current.Request.MapPath(path);
            }
            Dictionary<string, object> fd = new Dictionary<string, object>();
            FileInfo info = new FileInfo(path);
            if(Main.FileSystemAccess == FileSystemAccess.Site && (!info.FullName.Contains(Main.PhysicalApplicationPath.Substring(0, Main.PhysicalApplicationPath.Length - 1)))) {
                Exception e = new Exception("Access outside of physical site path not allowed");
                throw e;
            }
            using(Impersonation imp = new Impersonation()) {
                File.WriteAllText(path, text);
            }
            fd.Add("creationTime", info.CreationTime.ToString("mm/dd/yy hh:mm:ss"));
            fd.Add("lastAccessTime", info.LastAccessTime.ToString("mm/dd/yy hh:mm:ss"));
            fd.Add("lastWriteTime", info.LastWriteTime.ToString("mm/dd/yy hh:mm:ss"));
            fd.Add("extension", info.Extension);
            fd.Add("fullName", info.FullName);
            fd.Add("name", info.Name);
            fd.Add("size", info.Length);
            fd.Add("directoryName", info.DirectoryName);
            fd.Add("error", "0");
            fd.Add("description", "");
            return fd;
        }
        /// <summary>
        /// Gets the text of the file at the specified path.  As well as other information.
        /// </summary>
        /// <param name="path">The path.</param>
        /// <param name="encoding">The encoding.</param>
        /// <returns>
        /// JSON Object
        /// </returns>
        public static Dictionary<string, object> GetFileText(string path, string encoding) {
            ("FUNCTION /w (!PRIVATE ACCESS ONLY!),fileSystem GetFileText").Debug(10);
            //convert virtual paths into real paths
            if(path.StartsWith("~/")) {
                path = HttpContext.Current.Request.MapPath(path);
            }
            Dictionary<string, object> fd = new Dictionary<string, object>();
            FileInfo info = new FileInfo(path);
            if(Main.FileSystemAccess == FileSystemAccess.Site && (!info.FullName.Contains(Main.PhysicalApplicationPath.Substring(0, Main.PhysicalApplicationPath.Length - 1)))) {
                Exception e = new Exception("Access outside of physical site path not allowed");
                throw e;
            }
            using(Impersonation imp = new Impersonation()) {
                fd.Add("creationTime", info.CreationTime.ToString("mm/dd/yy hh:mm:ss"));
                fd.Add("lastAccessTime", info.LastAccessTime.ToString("mm/dd/yy hh:mm:ss"));
                fd.Add("lastWriteTime", info.LastWriteTime.ToString("mm/dd/yy hh:mm:ss"));
                fd.Add("extension", info.Extension);
                fd.Add("fullName", info.FullName);
                fd.Add("name", info.Name);
                fd.Add("size", info.Length);
                fd.Add("directoryName", info.DirectoryName);
                fd.Add("text", File.ReadAllText(path));
                fd.Add("error", "0");
                fd.Add("description", "");
            }
            return fd;
        }
		/// <summary>
		/// List recursivly the specified path.
		/// </summary>
		/// <param name="path">The path.</param>
		/// <returns>JSON Object</returns>
		public static Dictionary<string, object> LsRecursive( string path ) {
			( "FUNCTION /w (!PRIVATE ACCESS ONLY!),fileSystem ls_recursive" ).Debug( 10 );
			Dictionary<string, object> fd = new Dictionary<string, object>();
			try {
                if(Main.FileSystemAccess == FileSystemAccess.Site && (!path.Contains(Main.PhysicalApplicationPath.Substring(0, Main.PhysicalApplicationPath.Length - 1)))) {
                    Exception e = new Exception("Access outside of physical site path not allowed");
                    throw e;
                }
                using(Impersonation imp = new Impersonation()) {
                    string[] dirs = Directory.GetDirectories(path.Replace("~", Main.PhysicalApplicationPath));
                    foreach(string dir in dirs) {
                        if(Main.FileSystemAccess == FileSystemAccess.Site && (!dir.Contains(Main.PhysicalApplicationPath.Substring(0, Main.PhysicalApplicationPath.Length - 1)))) {
                            Exception e = new Exception("Access outside of physical site path not allowed");
                            throw e;
                        }
                        fd.Add("name", dir);
                        fd.Add("size", 0);
                        fd.Add("creationTime", File.GetCreationTime(dir).ToString("mm/dd/yy hh:mm:ss"));
                        fd.Add("lastAccessTime", File.GetLastAccessTime(dir).ToString("mm/dd/yy hh:mm:ss"));
                        fd.Add("lastWriteTime", File.GetLastWriteTime(dir).ToString("mm/dd/yy hh:mm:ss"));
                        fd.Add("objectType", "directory");
                        fd.Add("path", LsRecursive(dir));
                    }
                }
			} catch( Exception e ) {
				if( e.GetType().FullName == "System.UnauthorizedAccessException" ) {
					fd.Add( "name", path + " <restricted>" );
					fd.Add( "size", 0 );
					fd.Add( "creationTime", DateTime.MinValue.ToString( "mm/dd/yy hh:mm:ss" ) );
					fd.Add( "lastAccessTime", DateTime.MinValue.ToString( "mm/dd/yy hh:mm:ss" ) );
					fd.Add( "lastWriteTime", DateTime.MinValue.ToString( "mm/dd/yy hh:mm:ss" ) );
					fd.Add( "objectType", "directory" );
				}
			}
			return fd;
		}
		/// <summary>
		/// List the specified path.
		/// </summary>
		/// <param name="path">The path.</param>
		/// <returns></returns>
		public static Dictionary<string, object> Ls( string path ) {
			( "FUNCTION /w (!PRIVATE ACCESS ONLY!),fileSystem ls" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
			ArrayList dirs = new ArrayList();
			ArrayList files = new ArrayList();
			List<object> f = new List<object>();
			Dictionary<string, object> up = new Dictionary<string, object>();
			try {
                using(Impersonation imp = new Impersonation()) {
                    if(path.Length == 0) {
                        string targetDirectory = Main.PhysicalApplicationPath;
                        if(Main.GetCurrentSession().UserId == -1) {
                            targetDirectory += "user\\public";
                            if(!Directory.Exists(targetDirectory)) {
                                Directory.CreateDirectory(targetDirectory);
                            }
                        } else {
                            targetDirectory += "user\\" + Convert.ToString(Main.GetCurrentSession().UserId);
                            if(!Directory.Exists(targetDirectory)) {
                                Directory.CreateDirectory(targetDirectory);
                            }
                        }
                        /*
                         * this seems like it woulbe be cool, but really it isn't
                         * so lets just put this here
                         * */
                        path = Main.PhysicalApplicationPath;
                    }
                    if(path.StartsWith("/")) {
                        path = path.TrimStart('/');
                    }
                    /* trim ending slash */
                    if(path.EndsWith("\\")) {
                        path = path.Substring(0, path.Length - 1);
                    }
                    if(!path.Contains(":")) {
                        path = Main.PhysicalApplicationPath + path.Replace("/", "\\");
                    }
                    if(Main.FileSystemAccess == FileSystemAccess.Site && (!path.Contains(Main.PhysicalApplicationPath.Substring(0, Main.PhysicalApplicationPath.Length - 1)))) {
                        Exception e = new Exception("Access outside of physical site path not allowed");
                        throw e;
                    }
                    files.AddRange(Directory.GetFiles(path));
                    dirs.AddRange(Directory.GetDirectories(path));
                    if(path.Length > 3) {
                        up.Add("name", path + "\\..");
                        up.Add("size", 0);
                        up.Add("creationTime", "");
                        up.Add("lastAccessTime", "");
                        up.Add("lastWriteTime", "");
                        up.Add("objectType", "directory");
                        f.Add(up);
                    }
                    foreach(string dir in dirs) {
                        Dictionary<string, object> fd = new Dictionary<string, object>();
                        fd.Add("name", dir);
                        fd.Add("size", 0);
                        fd.Add("creationTime", File.GetCreationTime(dir));
                        fd.Add("lastAccessTime", File.GetLastAccessTime(dir));
                        fd.Add("lastWriteTime", File.GetLastWriteTime(dir));
                        fd.Add("objectType", "directory");
                        f.Add(fd);
                    }
                    foreach(string file in files) {
                        /* for some reason some files are listed that are not actually there
                         * for instance C:\WebDev.WebServer20.EXE shows in the list
                         * but is not in the directory.  */
                        try {
                            Dictionary<string, object> fd = new Dictionary<string, object>();
                            fd.Add("name", file);
                            FileInfo info = new FileInfo(file);
                            fd.Add("size", info.Length);
                            fd.Add("creationTime", info.CreationTime);
                            fd.Add("lastAccessTime", info.LastAccessTime);
                            fd.Add("lastWriteTime", info.LastWriteTime);
                            fd.Add("objectType", info.Extension);
                            f.Add(fd);
                        } catch{ }
                    }
                    j.Add("files", f);
                    j.Add("error", 0);
                    j.Add("description", "");
                }
			} catch( Exception e ) {
				j.Add( "error", -1 );
				j.Add( "source", e.Source );
				j.Add( "description", e.Message );
			}
			return j;
		}
		/// <summary>
		/// creates the specified new dir path.
		/// </summary>
		/// <param name="newDirPath">The new dir path.</param>
		/// <returns></returns>
		public static Dictionary<string, object> MkDir( string newDirPath ) {
			( "FUNCTION /w (!PRIVATE ACCESS ONLY!),fileSystem mkdir" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
			string path = "";
			try {
                using(Impersonation imp = new Impersonation()) {
                    path = Path.GetFullPath(newDirPath.Replace("~", Main.PhysicalApplicationPath));
                    if(Main.FileSystemAccess == FileSystemAccess.Site && (!path.Contains(Main.PhysicalApplicationPath.Substring(0, Main.PhysicalApplicationPath.Length - 1)))) {
                        Exception e = new Exception("Access outside of physical site path not allowed");
                        throw e;
                    }
                    if(!Directory.Exists(path)) {
                        Directory.CreateDirectory(path);
                        j.Add("description", "");
                    } else {
                        j.Add("description", "Directory already exists.");
                    }
                    j.Add("error", 0);
                }
			} catch( Exception e ) {
				j.Add( "error", -1 );
				j.Add( "source", e.Source );
				j.Add( "description", e.Message );
			}
			if( path.Length > 0 ) {
				Dictionary<string, object> l = Ls( path );
				return l;
			}
			return j;
		}
		/// <summary>
		/// Renames the specified file name.
		/// </summary>
		/// <param name="oldName">Full path to the old name.</param>
		/// <param name="newName">Full path to the new name.</param>
		/// <returns>Dictionary the new names directory.</returns>
		public static Dictionary<string, object> Rn( string oldName, string newName ) {
			( "FUNCTION /w (!PRIVATE ACCESS ONLY!),fileSystem rn" ).Debug( 10 );
			int error = 0;
			try {
				if( Main.FileSystemAccess == FileSystemAccess.Site && ( !oldName.Contains( Main.PhysicalApplicationPath.Substring( 0, Main.PhysicalApplicationPath.Length - 1 ) ) ) ) {
					Exception e = new Exception( "Access outside of physical site path not allowed" );
					error = -1;
					throw e;
				}
				if( Main.FileSystemAccess == FileSystemAccess.Site && ( !newName.Contains( Main.PhysicalApplicationPath.Substring( 0, Main.PhysicalApplicationPath.Length - 1 ) ) ) ) {
					Exception e = new Exception( "Access outside of physical site path not allowed" );
					error = -2;
					throw e;
				}
                using(Impersonation imp = new Impersonation()) {
                    if(File.Exists(oldName)) {
                        if(!File.Exists(newName)) {
                            File.Move(oldName, newName);
                        } else {
                            Exception e = new Exception("A file with that name already exists.");
                            error = -3;
                            throw e;
                        }
                    } else {
                        Exception e = new Exception("Source file does not exist.");
                        error = -4;
                        throw e;
                    }
                }
			} catch( Exception e ) {
				Dictionary<string, object> j = new Dictionary<string, object>();
				if( error == 0 ) { error = -5; };
				j.Add( "error", error );
				j.Add( "source", e.Source );
				j.Add( "description", e.Message );
			}
			Dictionary<string, object> l = Ls( Path.GetDirectoryName( newName ) );
			return l;
		}
		/// <summary>
		/// deletes the specified file paths.
		/// </summary>
		/// <param name="filePaths">The file paths.</param>
		/// <returns></returns>
		public static Dictionary<string, object> Rm( List<object> filePaths ) {
			( "FUNCTION /w (!PRIVATE ACCESS ONLY!),fileSystem rm" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
			string path = "";
            bool isDirectory = false;
            string showPathWhenDone = "";
			try {
                using(Impersonation imp = new Impersonation()) {
                    foreach(string file in filePaths as List<object>) {
                        isDirectory = Directory.Exists(file);
                        path = Path.GetDirectoryName(file.Replace("~", Main.PhysicalApplicationPath));
                        if(!isDirectory) {
                            showPathWhenDone = path;
                        } else {
                            DirectoryInfo di = new DirectoryInfo(path);
                            showPathWhenDone = di.Parent.FullName;
                        }
                        if(Main.FileSystemAccess == FileSystemAccess.Site && (!path.Contains(Main.PhysicalApplicationPath.Substring(0, Main.PhysicalApplicationPath.Length - 1)))) {
                            Exception e = new Exception("Access outside of physical site path not allowed");
                            throw e;
                        }
                        /* is this a file or directory ? */
                        if(isDirectory) {
                            /* delete this directory tree */
                            Directory.Delete(file, true);
                        } else {
                            /* delete this file */
                            File.Delete(file);
                        }
                    }
                }
			} catch( Exception e ) {
				j.Add( "error", -1 );
				j.Add( "source", e.Source );
				j.Add( "description", e.Message );
				return j;
			}
			if( path.Length > 0 ) {
                Dictionary<string, object> l = Ls(showPathWhenDone);
				return l;
			}
			j.Add( "error", -2 );
			j.Add( "source", "unknown" );
			j.Add( "description", "an unknown error has occured" );
			return j;
		}
		/// <summary>
		/// Recursively copy.
		/// </summary>
		/// <param name="sourceFolder">The source folder.</param>
		/// <param name="destFolder">The dest folder.</param>
		/// <param name="move">if set to <c>true</c> [move].</param>
		static public void RecursiveCopy( string sourceFolder, string destFolder, bool move ) {
			( "FUNCTION /w (!PRIVATE ACCESS ONLY!),fileSystem recursiveCopy" ).Debug( 10 );
            if(Main.FileSystemAccess == FileSystemAccess.Site && 
                (!sourceFolder.Contains(Main.PhysicalApplicationPath.Substring(0, Main.PhysicalApplicationPath.Length - 1)))) {
                Exception e = new Exception("Access outside of physical site path not allowed");
                throw e;
            }
            using(Impersonation imp = new Impersonation()) {
                if(move) {
                    Directory.Move(sourceFolder, destFolder);
                } else {
                    if(!Directory.Exists(destFolder))
                        Directory.CreateDirectory(destFolder);
                    string[] files = Directory.GetFiles(sourceFolder);
                    foreach(string file in files) {
                        string name = Path.GetFileName(file);
                        string dest = Path.Combine(destFolder, name);
                        File.Copy(file, dest);
                    }
                    string[] folders = Directory.GetDirectories(sourceFolder);
                    foreach(string folder in folders) {
                        string name = Path.GetFileName(folder);
                        string dest = Path.Combine(destFolder, name);
                        RecursiveCopy(folder, dest, move);
                    }
                }
            }
		}
		/// <summary>
		/// Copies the specified file path sources.
		/// </summary>
		/// <param name="filePathSources">The file path sources.</param>
		/// <param name="filePathDest">The file path dest.</param>
		/// <param name="move">if set to <c>true</c> [move].</param>
		/// <returns></returns>
		public static Dictionary<string, object> Cp( List<object> filePathSources, string filePathDest, bool move ) {
			( "FUNCTION /w (!PRIVATE ACCESS ONLY!),fileSystem cp" ).Debug( 10 );
			Dictionary<string, object> j = new Dictionary<string, object>();
			string secPath = Main.PhysicalApplicationPath.Substring( 0, Main.PhysicalApplicationPath.Length - 1 );
			string path = "";
			string exSecMsg = "Access outside of physical site path not allowed";
			string strFtp = "ftp://";
			string strVSiteRoot = "~";
			string backSlash = "\\";
			try {
                using(Impersonation imp = new Impersonation()) {
                    string dest = filePathDest.Replace("~", Main.PhysicalApplicationPath);
                    foreach(string file in filePathSources as List<object>) {
                        if((!filePathDest.Contains(strFtp)) && (!file.Contains(strFtp))) {
                            /* if LOCAL to LOCAL */
                            string f = file.ToString().Replace(strVSiteRoot, Main.PhysicalApplicationPath);
                            /* both source and dest must be in the site */
                            if(Main.FileSystemAccess == FileSystemAccess.Site && ((!f.Contains(secPath) || !dest.Contains(secPath)))) {
                                Exception e = new Exception(exSecMsg);
                                throw e;
                            }
                            if(f.EndsWith(backSlash)) {
                                path = Path.GetDirectoryName(Path.GetDirectoryName(f));
                                string fName = Path.GetFileName(Path.GetDirectoryName(f));
                                string fDest = Path.Combine(dest, fName);
                                if(!move) {
                                    if(!Directory.Exists(fDest)) {
                                        Directory.CreateDirectory(fDest);
                                    }
                                }
                                RecursiveCopy(f, fDest, move);
                            } else {
                                path = Path.GetDirectoryName(f);
                                if(move) {
                                    File.Move(f, Path.Combine(dest, Path.GetFileName(f)));
                                } else {
                                    File.Copy(f, Path.Combine(dest, Path.GetFileName(f)));
                                }
                            }
                        }
                    }
                }
			} catch( Exception e ) {
				j.Add( "error", -1 );
				j.Add( "source", e.Source );
				j.Add( "description", e.Message );
			}
			if( path.Length > 0 ) {
				Dictionary<string, object> l = Ls( path );
				return l;
			} else {
				return j;
			}
		}
		/// <summary>
		/// Gets the type of the MIME.
		/// </summary>
		/// <param name="fileName">Name of the file.</param>
		/// <returns></returns>
		public static string GetMimeType( string fileName ) {
			( "FUNCTION /w Registry getMimeType" ).Debug( 10 );
			string mimeType = "application/unknown";
			string ext = System.IO.Path.GetExtension( fileName ).ToLower();
			Microsoft.Win32.RegistryKey regKey = Microsoft.Win32.Registry.ClassesRoot.OpenSubKey( ext );
			if( regKey != null && regKey.GetValue( "Content Type" ) != null )
				mimeType = regKey.GetValue( "Content Type" ).ToString();
			return mimeType;
		}
		/// <summary>
		/// Downloads the file.
		/// </summary>
		/// <param name="path">The path.</param>
		/// <returns></returns>
		public static void DownloadFile( string path ) {
			( "FUNCTION /w (!PRIVATE ACCESS ONLY!),fileSystem downloadFile" ).Debug( 10 );
			FileInfo info = null;
			string mimeType = GetMimeType( path );
			string outputFile = "";
			string tempFileName = "";
			string fileName = "";
			outputFile = path;
			info = new FileInfo( outputFile );
			fileName = ( string )info.Name;
			/* HACK: win2k3 server has a probelm with SVG MIME type by default - this will allow SVGs on vanilla win2k3 */
			( "Download File:" + info.Name + "(" + mimeType + ")" ).Debug( 5 );
			if( path.ToLower().EndsWith( ".svg" ) ) {
				HttpContext.Current.Response.ContentType = "text/xml";
			} else {
				HttpContext.Current.Response.ContentType = mimeType;
			}
			HttpContext.Current.Response.WriteFile( outputFile );
			HttpContext.Current.Response.AddHeader( "Content-Disposition", "attachment; filename=\"" + fileName + "\"" );
			HttpContext.Current.Response.AddHeader( "Content-Length", info.Length.ToString() );
			HttpContext.Current.Response.Flush();
			HttpContext.Current.ApplicationInstance.CompleteRequest();
			/* remove the temp file */
			if( tempFileName.Length > 0 ) {
				if( File.Exists( tempFileName ) ) {
					File.Delete( tempFileName );
				}
			}
			return;
		}
		/// <summary>
		/// Gets the logical drives.
		/// </summary>
		/// <returns></returns>
		public static List<object> GetLogicalDrives() {
			( "FUNCTION /w (!PRIVATE ACCESS ONLY!),fileSystem getLogicalDrives" ).Debug( 10 );
			List<object> j = new List<object>();
			string[] drives = Directory.GetLogicalDrives();
			foreach( string drive in drives ) {
				Dictionary<string, object> fd = new Dictionary<string, object>();
				fd.Add( "name", drive );
				j.Add( fd );
			}
			return j;
		}
	}
}
