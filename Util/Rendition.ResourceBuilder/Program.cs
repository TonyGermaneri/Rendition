using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Resources;
using System.IO;
namespace Rendition.ResourceBuilder {
	public static class resourceBuilder {
		public static void Main(){
			string[] commandLineArgs = Environment.GetCommandLineArgs();
			if(!Directory.Exists(commandLineArgs[1])){
				Console.WriteLine("Source directory (" + commandLineArgs[1] + ") does not exist");
				return;
			}
			string targetDirectory = Path.GetDirectoryName(commandLineArgs[2]);
			if(!Directory.Exists(targetDirectory)) {
				Console.WriteLine("Target directory ("+targetDirectory+") does not exist");
				return;
			}
			generateResourceFile(commandLineArgs[1],commandLineArgs[2]);
		}
		public static string getRscString(string fileName,string sourceDirectory){
			return fileName.Replace(sourceDirectory,"").
			Replace(fileName,"").Replace(".","").Replace(":","").
			Replace("\\","__").Replace("-","_").ToLower();
		}
		public static void generateResourceFile(string sourceDirectory, string targetResrouceFile){
			IEnumerable<string> files = Directory.EnumerateFiles(sourceDirectory,"*.*",SearchOption.AllDirectories);
			ResXResourceWriter rw=new ResXResourceWriter(targetResrouceFile);
			string baseUI = "";
			string baseCOM = "";
			StringBuilder allACE = new StringBuilder();
			StringBuilder allJS = new StringBuilder();
			StringBuilder allCom = new StringBuilder();
			StringBuilder allUI = new StringBuilder();
			StringBuilder allCSS = new StringBuilder();
			StringBuilder jquery = new StringBuilder();
            string jq_timePicker = "";
			foreach(string file in files){
				if(!file.Contains(".svn")){/* don't include subversion files */
					/* only include certain files. Other files don't get included */
					if(file.EndsWith(".png")||file.EndsWith(".jpg")
					||file.EndsWith(".gif")||file.EndsWith(".ico")) {
						rw.AddResource(getRscString(file,sourceDirectory),File.ReadAllBytes(file));
					}else if(file.EndsWith(".js")||file.EndsWith(".html")||
					file.EndsWith(".css")||file.EndsWith(".aspx")||file.EndsWith(".sql")
					||file.EndsWith(".txt")) {
						string content = File.ReadAllText(file);
						if(file.EndsWith(".css")){
							allCSS.Append(content+Environment.NewLine);
						} else if(file.EndsWith(".js")) {
							if(file.ToLower().Contains("ui\\ui.js")){
								baseUI = content+Environment.NewLine+Environment.NewLine;
                            } else if(file.ToLower().Contains("commerce\\commerce.js")) {
								baseCOM = content+Environment.NewLine+Environment.NewLine;
                            } else if(file.ToLower().Contains("timepicker\\jquery-timepicker.js")) {
                                jq_timePicker = content + Environment.NewLine + Environment.NewLine;
							} else if(file.ToLower().Contains("jquery\\jquery")) {
								jquery.Append(content+Environment.NewLine+Environment.NewLine);
							} else if(file.ToLower().Contains("ui\\")){
								allUI.Append(content+Environment.NewLine+Environment.NewLine);
								allJS.Append(content+Environment.NewLine+Environment.NewLine);
							} else if(file.ToLower().Contains("ace\\")){
								allACE.Append(content+Environment.NewLine+Environment.NewLine);
							} else if(file.ToLower().Contains("commerce\\")){
								allCom.Append(content+Environment.NewLine+Environment.NewLine);
								allJS.Append(content+Environment.NewLine+Environment.NewLine);
							}else{
								allJS.Append(content+Environment.NewLine+Environment.NewLine);
							}
						}
						rw.AddResource(getRscString(file,sourceDirectory),content);
					} else if(file.ToLower() == "thumbs.db") {
						File.Delete(file); /* evil */
					}
				}
			}
            rw.AddResource("admin__renditionjs", baseUI + baseCOM + allJS.ToString());
            rw.AddResource("admin__acejs", allACE.ToString());
            rw.AddResource("admin__jqueryjs", jquery.ToString());
            rw.AddResource("admin__renditionUIjs", allACE.ToString() + baseUI + allUI.ToString());
			rw.Generate();
			rw.Close();
		}
	}
}
