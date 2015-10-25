using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml;
using Rendition;
using System.IO;
namespace Rendition.standardPlugins.email {
	public class emails:Plugin {
		public emails(){
			this.Message="Loaded";
			/* attach to the oncreateemail event handler */
            Site.CurrentSite.CreatingEmail += new EventHandler(email);
		}
		public void email(object sender,EventArgs ea){
			this.Message="Creating An Email";
			CreateEmailEventArgs args = (CreateEmailEventArgs)ea;
			Dictionary<string,object> e = new Dictionary<string,object>();
			// never used --> string emailSource = "";
			/* read in config XML file */
			XmlDocument xmlDoc=new XmlDocument();
			xmlDoc.Load(("~/plugins/emails.xml").VirtualToPhysicalSitePath());
			XmlNodeList emails=xmlDoc.GetElementsByTagName("email");
			foreach(XmlNode node in emails){
				string type=node.Attributes["type"].Value.ToString();
				string language = "CSharp";
				if(node.Attributes["language"]!=null){
					language=node.Attributes["language"].Value.ToString();
				}else{
					language="CSharp";
				}
				string emailSourcePath=node.Attributes["source"].Value.ToString().VirtualToPhysicalSitePath();
				if(File.Exists(emailSourcePath)){
					string sourceCode = File.ReadAllText(emailSourcePath);
					if(!e.ContainsKey(type)){
						Dictionary<string,object> f=new Dictionary<string,object>();
						f.Add("sourceCode",sourceCode);
						f.Add("language",language);
						e.Add(type,f);
					}else{
						("Email Writer Plugin: type "+type+" defined more than once in ~/plugins/email.xml.").Debug(1);
					}
				}else{
					("Email Writer Plugin: Email source "+emailSourcePath+" in ~/plugins/email.xml does not exist.").Debug(1);
				}
			}
			if(e.ContainsKey(args.EmailType)){
				List<object> errors = new List<object>();
				object[] scriptArgs = { args };
				Dictionary<string,object> cDict = (Dictionary<string,object>)e[args.EmailType];
				object emailReturnVoid = Admin.ExecuteScript(cDict["sourceCode"].ToString(),cDict["language"].ToString(),
				args.EmailType,"sendMail",ref scriptArgs,ref errors);
			}
			this.Message="Idle";
			return;
		}
	}
}
