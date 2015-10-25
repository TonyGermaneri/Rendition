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
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Data;
using System.IO;
using System.Reflection;
using System.CodeDom;
using System.CodeDom.Compiler;
using System.Web;
using Microsoft.CSharp;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Linq;
using System.Text.RegularExpressions;
using HtmlAgilityPack;
namespace Rendition {
	public partial class Commerce {
		/// <summary>
		/// This class represents a rule that was created to validate Requests going into inputs.
        /// This class is not implemented.
		/// </summary>
		public class ValidationRule {
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="ValidationRule"/> class.
			/// </summary>
			public ValidationRule() { }
            #endregion
        }
		/// <summary>
		/// Select, radio or other multi option inputs.
		/// </summary>
		public class InputOption {
            #region Instance Properties
            /// <summary>
			/// The innerText of this option.
			/// </summary>
            public string InnerText { get; internal set; }
			/// <summary>
			/// The value of this option.
			/// </summary>
            public string Value { get; internal set; }
			/// <summary>
			/// Ordinal (order number) of this option.
			/// </summary>
            public int Ordinal { get; internal set; }
			/// <summary>
			/// When true, this option is selected, on, true, whatever.
			/// </summary>
            public bool Selected { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="InputOption"/> class.
            /// </summary>
            public InputOption() {
                Selected = false;
                Ordinal = 0;
                Value = "";
                InnerText = "";
            }
            #endregion
        }
		/// <summary>
		/// This class creates a single input for the _form class
		/// </summary>
		public class Input {
            #region Instance Properties
            /// <summary>
			/// The attributes of this DHTML element.
			/// </summary>
            public Dictionary<string, string> Attributes { get; internal set; }
			/// <summary>
			/// Name of the input on the form.
			/// </summary>
            public string Name { get; internal set; }
			/// <summary>
			/// Value of the input on the form.
			/// </summary>
            public string Value { get; internal set; }
			/// <summary>
			/// Name of the form.
			/// </summary>
            public string FormName { get; internal set; }
			/// <summary>
			/// Id of the form.
			/// </summary>
            public Guid Id { get; internal set; }
			/// <summary>
			/// Validation rule form must adhere to
			/// </summary>
            public ValidationRule Rule { get; internal set; }
			/// <summary>
			/// Is the input valid?
			/// </summary>
            public bool Valid { get; internal set; }
			/// <summary>
			/// List of options for this input.
			/// </summary>
            public List<InputOption> Options { get; internal set; }
			/// <summary>
			/// The maxlength attribute of this input.
			/// </summary>
			public string MaxLength { get; internal set; }
			/// <summary>
			/// DHTML element attribute type.
			/// </summary>
            public string Type { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Input"/> class.
            /// </summary>
            /// <param name="_name">The name.</param>
            /// <param name="_value">The value.</param>
            /// <param name="_type">The type.</param>
            /// <param name="_options">The options.</param>
            /// <param name="_attributes">The attributes.</param>
            public Input(string _name, string _value, string _type, List<InputOption> _options, Dictionary<string, string> _attributes) {
                Type = _type;
                Options = _options;
                Attributes = _attributes;
                Name = _name;
                Value = _value;
            }
            /// <summary>
            /// Initializes a new instance of the <see cref="Input"/> class.
            /// </summary>
            /// <param name="_name">The name.</param>
            /// <param name="_value">The value.</param>
            /// <param name="_type">The type.</param>
            /// <param name="_options">The options.</param>
            public Input(string _name, string _value, string _type, List<InputOption> _options) {
                Type = _type;
                Options = _options;
                Attributes = new Dictionary<string, string>();
                Name = _name;
                Value = _value;
            }
            /// <summary>
            /// Initializes a new instance of the <see cref="Input"/> class.
            /// </summary>
            /// <param name="_name">The name.</param>
            /// <param name="_value">The value.</param>
            /// <param name="_type">The type.</param>
            public Input(string _name, string _value, string _type) {
                Type = _type;
                Options = new List<InputOption>();
                Attributes = new Dictionary<string, string>();
                Name = _name;
                Value = _value;
            }
            /// <summary>
            /// Initializes a new instance of the <see cref="Input"/> class.
            /// </summary>
            /// <param name="_name">The name.</param>
            /// <param name="_value">The value.</param>
			public Input( string _name, string _value ) {
                Type = "input";
                Options = new List<InputOption>();
                Attributes = new Dictionary<string, string>();
                Options = new List<InputOption>();
				Name = _name;
				Value = _value;
            }
            #endregion
        }
		/// <summary>
		/// This class is a form that attaches to the _item class
		/// An instance of rendtion._site must exist to use this class
		/// </summary>
		public class Form {
            #region Instance Properties
            /// <summary>
            /// Extention of the source code file name.
            /// </summary>
            public string Extention { get; internal set; }
            /// <summary>
            /// The name of the form.
            /// </summary>
            public string Name { get; internal set; }
            /// <summary>
            /// Path to the form.
            /// </summary>
            public string Path { get; internal set; }
            /// <summary>
            /// Parent item.
            /// </summary>
            public Commerce.Item Item { get; internal set; }
            /// <summary>
            /// Parent cart item.
            /// </summary>
            public Commerce.CartItem CartItem { get; internal set; }
            /// <summary>
            /// The list of inputs in the form.
            /// </summary>
            /// <value>The inputs.</value>
            public List<Input> Inputs {
                get {
                    if(this._inputs == null) {
                        this._renderedForm = RenderForm(this._sourceCode);
                        this._inputs = GetFormInputs(this._renderedForm);
                    }
                    return this._inputs;
                }
            }
            /// <summary>
            /// Gets the source code.
            /// </summary>
            /// <value>The source code.</value>
            public string SourceCode {
                get {
                    return _sourceCode;
                }
            }
            /// <summary>
            /// Gets the HTML.
            /// </summary>
            /// <value>The HTML.</value>
            public string Html {
                get {
                    /* render the form each time the form is requested */
                    this._renderedForm = RenderForm(this._sourceCode);
                    /* refresh list of inputs */
                    this._inputs = GetFormInputs(this._renderedForm);
                    return _renderedForm;
                }
            }
            #endregion
            #region Instance Public Fields
            /// <summary>
            /// Errors found while compiling the form.  Not Implemented.
            /// </summary>
            public List<object> FormErrors = new List<object>();
            #endregion
            #region Instance Private Fields
            internal RegexOptions RegexOption = RegexOptions.IgnoreCase | RegexOptions.Compiled | RegexOptions.Multiline;
            /// <summary>
			/// The list of inputs in the form.
			/// </summary>
			private List<Input> _inputs = new List<Input>();
            private string _sourceCode;
            private string _renderedForm;
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Form"/> class.
			/// </summary>
			/// <param name="item">The item.</param>
			public Form( Commerce.Item item ) {
                FormErrors = new List<object>();
				this.Item = item;
				Path = "";
				Extention = "";
				Name = "NO FORM";
				_sourceCode = "";
				_renderedForm = "";
			}
			/// <summary>
			/// Initializes a new instance of the <see cref="Form"/> class.
			/// </summary>
			/// <param name="item">The item.</param>
			/// <param name="path">The path.</param>
			public Form( Commerce.Item item, string path ) {
                FormErrors = new List<object>();
				this.Item = item;
				this.Path = System.IO.Path.GetFullPath( path );
                this.Name = System.IO.Path.GetFileName(path);
                this.Extention = System.IO.Path.GetExtension(path).ToLower();
				this._sourceCode = IncludeFile( path );
				try {
					this._inputs = GetFormInputs( RenderForm( this._sourceCode ) );
				} catch( Exception ex ) {
					String.Format( "Commerce.form > renderForm exception > {0}", ex.Message ).Debug( 0 );
				}
				if( this._inputs == null ) {
					this._inputs = new List<Input>();
				}
			}
			/// <summary>
			/// Initializes a new instance of the <see cref="Form"/> class.
			/// </summary>
			/// <param name="item">The item.</param>
			/// <param name="formSourceCode">The form source code.</param>
			/// <param name="formName">Name of the form.</param>
			public Form( Commerce.Item item, string formSourceCode, string formName ) {
				this.Item = item;
				Name = "";
				Path = "";
				if( formName == null ) {
					this.Extention = "";
					this._sourceCode = "";
					this._inputs = new List<Input>();
				} else {
                    this.Extention = System.IO.Path.GetExtension(formName).ToLower();
					this._sourceCode = formSourceCode;
					try {
						this._inputs = GetFormInputs( RenderForm( this._sourceCode ) );
					} catch( Exception ex ) {
						String.Format( "Commerce.form > renderForm exception > {0}", ex.Message ).Debug( 0 );
					}
					if( this._inputs == null ) {
						this._inputs = new List<Input>();
					}
				}
			}
            #endregion
            #region Instance Methods
            /// <summary>
			/// Renders the form.
			/// </summary>
			/// <param name="scriptText">The script text.</param>
			/// <returns>Rendered HTML form.</returns>
			public string RenderForm( string scriptText ) {
				if( this.Extention == "" ) {
					return scriptText;
				} else if( this.Extention == ".cs" ) {
					object[] args = { Main.GetCurrentSession(), this.Item, this.CartItem, HttpContext.Current };
					object obj = Admin.ExecuteScript( scriptText, "CSharp", "script", "main", ref args, ref FormErrors );
					return ( string )obj;
				} else {
					return scriptText;
				}
			}
			/// <summary>
			/// Writes the input names.
			/// </summary>
			/// <param name="sourceCode">The source code.</param>
			/// <param name="XMLId">The XML id.</param>
			/// <returns>List of input names</returns>
			private string WriteInputNames( string sourceCode, string XMLId ) {
				Regex i;
				i = new Regex( @"(\<+\w+[^>]+name=""*\w*)(""*[^\>]+\>+)", RegexOption );
				MatchCollection m;
				GroupCollection b;
				string input_match;
				m = i.Matches( sourceCode );
				for( int x = 0; m.Count > x; x++ ) {
					for( int y = 0; Inputs.Count > y; y++ ) {
						b = m[ x ].Groups;
						if( b[ 0 ].Value.Contains( "name=\"" + Inputs[ y ].Name + "\"" ) ) {
							input_match = m[ x ].Value;
							sourceCode.Replace( input_match, input_match.Substring( 0, input_match.Length - 1 ) + " name=\"" + Inputs[ y ].Id.EncodeXMLId() + "\">" );
						}
					}
				}
				return sourceCode;
			}
			/// <summary>
			/// Writes the form with the values from the provided List of inputs inserted into the form inputs.
			/// </summary>
			/// <returns></returns>
			public string HtmlWithValues() {
				return HtmlWithValues( this.Inputs );
			}
			/// <summary>
			/// Writes the form with the values from the provided List of inputs inserted into the form inputs.
			/// </summary>
			/// <param name="__inputs">The _inputs.</param>
			/// <returns>Rendered HTML form with values input from list.</returns>
			public string HtmlWithValues( List<Input> __inputs ) {
				HtmlDocument doc = new HtmlDocument();
				doc.LoadHtml( Html );
				doc.DocumentNode.DescendantNodes();
				IEnumerable<HtmlNode> nodes = doc.DocumentNode.DescendantNodes();
				foreach( HtmlNode node in nodes ) {
					string inputType = node.GetAttributeValue( "type", "" ).ToLower();
					string tagName = node.Name;
					string inputName = node.GetAttributeValue( "name", "" );
					foreach( Input input in __inputs ) {
						if( input.Name == inputName ) {
							if( tagName == "select" ) {
								/* find the select that's selected */
								foreach( HtmlNode opt in node.ChildNodes ) {
									if(opt.Name=="option"){
										if( opt.GetAttributeValue( "value", "" ) == input.Value ) {
											opt.SetAttributeValue( "selected", "true" );
										} else {
											opt.Attributes.Remove( "selected" );
										}
									}
								}
								node.SetAttributeValue( "name", input.Id.EncodeXMLId() );
							}else if(inputType == "checkbox"){
                                if(input.Value == "True") {
                                    node.SetAttributeValue("checked", "");
                                } else {
                                    node.Attributes.Remove("checked");
                                }
                                node.SetAttributeValue("name", input.Id.EncodeXMLId());
                            } else if( tagName == "input" ) {
								node.SetAttributeValue( "name", input.Id.EncodeXMLId() );
								node.SetAttributeValue( "value", input.Value );
							}
						}
					}
				}
				string outputDoc = doc.DocumentNode.WriteTo();
				return outputDoc;
			}
            #endregion
            #region Instance Private Methods
            private CompilerResults _compileScript(string source, string reference, CodeDomProvider provider) {
                //ICodeCompiler compiler=provider.CreateCompiler();
                CompilerParameters prams = new CompilerParameters();
                CompilerResults results;
                /* set pramaters */
                prams.GenerateExecutable = false;
                prams.IncludeDebugInformation = false;
                prams.GenerateInMemory = true;
                if(reference == null) {
                    prams.ReferencedAssemblies.Add("System.Windows.Forms.dll");
                    prams.ReferencedAssemblies.Add("System.dll");
                }
                /* compile */
                results = provider.CompileAssemblyFromSource(prams, source);
                return null;
            }
            private List<Input> GetFormInputs(string html) {
                List<Input> ip = new List<Input>();
                HtmlDocument doc = new HtmlDocument();
                if(html == null) {
                    return ip;
                }
                try {
                    doc.LoadHtml(html);
                    IEnumerable<HtmlNode> nodes = doc.DocumentNode.DescendantNodes();
                    foreach(HtmlNode node in nodes) {
                        string tagName = node.Name;
                        if(tagName == "select" || tagName == "input") {
                            Input i = new Input(node.GetAttributeValue("name", ""), "");
                            if(tagName == "select") {
                                List<InputOption> ips = new List<InputOption>();
                                foreach(HtmlNode opt in node.ChildNodes) {
                                    InputOption o = new InputOption();
                                    o.Value = opt.GetAttributeValue("value", "");
                                    o.InnerText = opt.InnerText;
                                    i.Options.Add(o);
                                }
                            } else {
                                string inputType = node.GetAttributeValue("type", "");
                                string maxlength = node.GetAttributeValue("maxlength", "");
                                i.Type = inputType;
                                i.MaxLength = maxlength;
                            }
                            /* add all the attributes */
                            foreach(HtmlAttribute atr in node.Attributes) {
                                i.Attributes.Add(atr.Name, atr.Value);
                            }
                            ip.Add(i);
                        }
                    }
                } catch(Exception ex) {
                    String.Format("getFormInputs exception.  Form:{0}, Item:{1} =>{2}", this.Name, this.Item.Number, ex.Message).Debug(3);
                }
                return ip;
            }
            private string IncludeFile(string pathToFile) {
                if(!File.Exists(pathToFile)) { return null; }
                string t = File.ReadAllText(pathToFile);
                string f;
                int x = 0;
                Regex inc = new Regex(@"(<!--#include file="")([^""]+)("" -->)", RegexOption);
                while(inc.IsMatch(t)) {
                    MatchCollection incMatches = inc.Matches(t);
                    f = incMatches[0].Groups[2].ToString().Replace("/", "\\");
                    if(f.StartsWith(@"\")) {
                        f = f.Remove(0, 1);
                    }
                    if(File.Exists(Main.PhysicalApplicationPath + f)) {
                        t = t.Replace(incMatches[0].ToString(), File.ReadAllText(Main.PhysicalApplicationPath + f));
                    } else {
                        String.Format("Form {0} > Include File not found: {1}", this.Name, Main.PhysicalApplicationPath + f).Debug(2);
                        t = t.Replace(incMatches[0].ToString(), "<!-- Include File not found: " + Main.PhysicalApplicationPath + f + " -->");
                    }
                    x++;
                }
                return t;
            }
            #endregion
		}
		/// <summary>
		/// This class represents a warning generated by the validation class. 
        /// This class is not implemented.
		/// </summary>
		public class Warning {
            #region Instance Properties
            /// <summary>
			/// number of the warning
			/// </summary>
            public int Error { get; internal set; }
			/// <summary>
			/// Description of the warning
			/// </summary>
            public string Description { get; internal set; }
			/// <summary>
			/// Source of the warning
			/// </summary>
            public string Source { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Warning"/> class.
			/// </summary>
			/// <param name="_num">The _num.</param>
			/// <param name="_desc">The _desc.</param>
			/// <param name="_source">The _source.</param>
			public Warning( int _num, string _desc, string _source ) {
				Error = _num;
				Description = _desc;
				Source = _source;
            }
            #endregion
        }
		/// <summary>
		/// This class creates a list of warnings raised from the Request submission of a client (not implemented)
		/// </summary>
		public class Warnings {
            #region Instance Properties
            /// <summary>
			/// list of warnings
			/// </summary>
            public List<Warning> Items { get; internal set; }
            #endregion
            #region Instance Methods
            /// <summary>
            /// Adds the specified item_to_add.
            /// </summary>
            /// <param name="item_to_add">The item_to_add.</param>
            public void add(Warning item_to_add) {
                Items.Add(item_to_add);
                return;
            }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Warnings"/> class.
			/// </summary>
			public Warnings() {
                Items = new List<Warning>();
				return;
			}
            #endregion
        }
	}
}
