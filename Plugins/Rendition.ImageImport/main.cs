using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rendition;
using System.IO;
using System.Web;
namespace Rendition.standardPlugins.imageImport {
	public class imageImport:Plugin {
		private static int interval = 30000;
        private static string importDirectory = Admin.GetApplicationPath() + "import\\items\\img\\";
		private static string importRepository=importDirectory+"repository\\";
		private static string importErrors=importDirectory+"errors\\";
		public imageImport(){
			Admin.Timer importItemImages = new Admin.Timer();
			importItemImages.Name = "Auto Image Import";
			importItemImages.Interval = interval;
			importItemImages.elapsed+=new EventHandler(importItemImages_elapsed);
			importItemImages.AutoReset=false;
			importItemImages.Start();
			this.Message="Loaded";
		}
		void importImage(string itemNumber, string pathToFileToImport){
			string fileName = Path.GetFileName( pathToFileToImport );
			Dictionary<string, object> j = Admin.AddItemImage( itemNumber, pathToFileToImport );
			if( ( int )j[ "error" ] != 0 ) {
				Error = 2;
				( "Auto import item image error -> " + fileName + " - " + ( string )j[ "desc" ] ).Debug( 3 );
			} else {
				( "Auto import item imported -> " + fileName ).Debug( 3 );
			}
		}
		void importDirectoryImages(string directoryPath, Admin.Timer t){
			string[] files = Directory.GetFiles( importDirectory );
			string[] dirs = Directory.GetDirectories( importDirectory );
			foreach( string dir in dirs ) {
				if( dir.ToLower().EndsWith( "\\repository" ) || dir.ToLower().EndsWith( "\\error" ) ) { continue; };
				foreach(Commerce.Item item in Commerce.Item.All){
					/* if the directory is the same as the 
					 * item number then import all images in the directory */
					if( dir.EndsWith( "\\" + item.Number.ToLower().Trim() ) ) {
						string[] innerFiles = Directory.GetFiles( dir );
						foreach(string f in innerFiles){
							/* import all image files in this directory becuase 
							 * the directory name matched the item number */
							importImage( item.Number, f );
							/* move the file to the Repository (make sure the target directory exists first */
							string repTarget = importRepository + item.Number;
							if( !Directory.Exists( repTarget ) ) {
								Directory.CreateDirectory( repTarget );
							}
							File.Move(
								Path.Combine( dir, Path.GetFileName( f ) ),
								Path.Combine( repTarget, Path.GetFileName( f ) )
							);
						}
					}
				}
				if( Directory.GetDirectories(dir).Length == 0 ) {
					Directory.Delete( dir );
				}
			}
			foreach(string file in files){
				int error = 0;
				bool itemExists = false;
				string importItemNo = Path.GetFileNameWithoutExtension( file );
				foreach(Commerce.Item item in Commerce.Item.All){
					/* import image file if any part 
					 * of the file contains the item number */
					if(importItemNo.ToLower().Trim().Contains(item.Number.ToLower().Trim())) {
						importImage(item.Number,file);
					}
					/* move the file to the 
					 * Repository even if it doesn't match */
					File.Move(
						Path.Combine( importDirectory, Path.GetFileName( file ) ),
						Path.Combine( importRepository, Path.GetFileName( file ) )
					);
				}
				if(!Directory.Exists(importErrors)) {
					Directory.CreateDirectory(importErrors);
				}
				
				if(itemExists) {
					/* matches an item */
					
				}else{
					error = 3;
					("Could not match this file to an item number (case does not matter) -> "+file).Debug(3);
				}
				if(error!=0){
					if(!Directory.Exists(importErrors)) {
						Directory.CreateDirectory(importErrors);
					}
					File.Move(
						Path.Combine(importRepository,Path.GetFileName(file)),
						Path.Combine(importErrors,Path.GetFileName(file))
					);
					t.Message="Importing Images:"+file;
				}
			}
		}
		void importItemImages_elapsed(object sender,EventArgs e) {
			Admin.Timer t=(Admin.Timer)sender;
			if(!Directory.Exists(importDirectory)) {
				Directory.CreateDirectory(importDirectory);
			}
			if(!Directory.Exists(importRepository)) {
				Directory.CreateDirectory(importRepository);
			}
			bool error = false;
			string errorMessage = "";
			try{
				/* import files in the root that contain a part of the item number */
				importDirectoryImages(importDirectory,t);
				/* import files in directories matching item numbers exactly */
				string[] directories = Directory.GetDirectories(importDirectory);
				foreach(string directory in directories){
                    foreach(Commerce.Item item in Commerce.Item.All) {
						if(directory.ToLower().Trim() == item.Number.ToLower().Trim()) {
							importDirectoryImages(directory,t);
						}
					}
				}
			}catch(Exception ex){
				error = true;
				errorMessage = ex.Message;
			}
			if(error){
				errorMessage.Debug(0);
			}

			t.Message="Idle";
			t.Start();
		}
	}
}
