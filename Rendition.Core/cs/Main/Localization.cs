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
using System.Xml;
using System.Web;
using System.IO;
namespace Rendition {
    internal partial class Main : IHttpModule {
        internal static void loadLocalization() {
            // read the default localization file from the resource stream into the dictionary
            string defaultLocResPath = "Rendition.Localization.xml";
            XmlDocument xmlDoc = new System.Xml.XmlDocument();
            using(Stream s = System.Reflection.Assembly.GetExecutingAssembly().
                GetManifestResourceStream(defaultLocResPath)) {
                xmlDoc.Load(s);
                FieldTitleLocalization.AddXMLSource(xmlDoc);
            }
            // read the user's localization file into the dictionary
            if(Main.LocalizationFile != String.Empty) {
                string userLocFile = Main.LocalizationFile.Replace("~/", Main.PhysicalApplicationPath);
                try {
                    xmlDoc = new System.Xml.XmlDocument();
                    if(File.Exists(userLocFile)) {
                        xmlDoc.Load(File.OpenRead(userLocFile));
                        FieldTitleLocalization.AddXMLSource(xmlDoc);
                    }
                } catch(Exception ex) {
                    string errMsg = @"Error Reading Loclization XML file {0}. 
Source: {1}
Message: {2}";
                    Exception innerEx = new Exception(String.Format(errMsg, userLocFile, ex.Source, ex.Message));
                    throw innerEx;
                }
            }
        }
    }
    /// <summary>
    /// All the fields used in the program
    /// Customizable for language or use.
    /// </summary>
    public static class FieldTitleLocalization {
        /// <summary>
        /// Localization fields
        /// </summary>
        public static Dictionary<string, FieldTitle> FieldTitles { get; set; }
        /// <summary>
        /// Initializes the <see cref="FieldTitleLocalization"/> class.
        /// </summary>
        static FieldTitleLocalization() {
            FieldTitles = new Dictionary<string, FieldTitle>();
        }
        /// <summary>
        /// Removes the field from the localization fields.
        /// </summary>
        /// <param name="_uniqueName">Name of the _unique.</param>
        public static void RemoveField(string _uniqueName) {
            FieldTitles.Remove(_uniqueName);
        }
        /// <summary>
        /// Adds the field to the localization fields.
        /// </summary>
        /// <param name="_uniqueName">Name of the _unique.</param>
        /// <param name="_FieldTitle">The _ field title.</param>
        /// <param name="_Message">The _ message.</param>
        /// <param name="_DefaultValue">The _ default value.</param>
        /// <param name="_Hidden">The _ hidden.</param>
        public static void AddField(string _uniqueName,
            string _FieldTitle, string _Message, string _DefaultValue, string _Hidden){
            FieldTitle f = new FieldTitle();
            f.Name = _uniqueName;
            f.Title = _FieldTitle;
            f.Message = _Message;
            if(_DefaultValue != null) {
                f.DefaultValue = _DefaultValue;
            } else {
                f.DefaultValue = ""; 
            }
            bool h = false;
            if(_Hidden == "0" || _Hidden == "1") {
                h = _Hidden == "1";
            }else{
                if(!bool.TryParse(_Hidden, out h)){
                    h = false;
                }
            }
            f.Hidden = h;
            if(FieldTitles.ContainsKey(f.Name)) {
                FieldTitles[f.Name] = f;
            } else {
                FieldTitles.Add(f.Name, f);
            }
        }
        /// <summary>
        /// Adds the XML source to the localization fields.
        /// </summary>
        /// <param name="xmlDoc">The XML doc.</param>
        public static void AddXMLSource(XmlDocument xmlDoc) {
            XmlElement ele = xmlDoc.DocumentElement;
            if(ele != null) {
                XmlNodeList nodes = ele.ChildNodes;
                if(nodes.Count != 0) {
                    foreach(XmlNode n in nodes) {
                        try {
                            if(n.Name == "Field") {
                                string id = n.Attributes["Id"].Value;
                                string title = "";
                                if(n.Attributes["Title"] != null) {
                                    title = n.Attributes["Title"].Value;
                                }
                                string defaultValue = "";
                                if(n.Attributes["DefaultValue"] != null) {
                                    defaultValue = n.Attributes["DefaultValue"].Value;
                                }
                                string hidden = "0";
                                if(n.Attributes["Hidden"] != null) {
                                    hidden = n.Attributes["Hidden"].Value;
                                }
                                if(id.Length > 0 && title.Length > 0) {
                                    AddField(id, title, n.InnerText, defaultValue, hidden);
                                }
                            }
                        } catch(Exception ex) {
                            ex.Message.Debug(1);
                        }
                    }
                } else {
                    ("Warning:  Fields node has zero child nodes.  This file will be ignored.").Debug(0);
                }
            }
        }
    }
    /// <summary>
    /// Localization Field for use in /Admin JS API
    /// </summary>
    public class FieldTitle {
        /// <summary>
        /// Gets or sets the name of the field.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }
        /// <summary>
        /// Gets or sets the title of the field.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; }
        /// <summary>
        /// Gets or sets the message of the field.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        public string Message { get; set; }
        /// <summary>
        /// Gets or sets the default value of the field.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        public string DefaultValue { get; set; }
        /// <summary>
        /// Overrides the default visibility state of this field.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        public bool Hidden { get; set; }
    }
}
 