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
using System.CodeDom;
using System.CodeDom.Compiler;
using System.Reflection;
using Microsoft.CSharp;
namespace Rendition {
	public partial class Admin {
        #region Static Methods
        /// <summary>
		/// Previews the script.
		/// </summary>
		/// <param name="id">The id.</param>
		/// <param name="sourceCode">The source code.</param>
		/// <param name="language">The language.</param>
		/// <param name="eventType">Type of the event.</param>
		/// <param name="name">The name.</param>
		/// <returns></returns>
		public static Dictionary<string, object> PreviewScript( string id, string sourceCode, string language, string eventType, string name ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			if( eventType == "scheduler" ) {
				return PreviewTaskScript( id, sourceCode, language );
			} else if( eventType == "init" ) {
				InitEventArgs e = new InitEventArgs( Main.Site, HttpContext.Current );
				j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
			} else if( eventType == "dispose" ) {
				DisposeEventArgs e = new DisposeEventArgs( Main.Site, HttpContext.Current );
				j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
			} else if( eventType == "beginrequest" ) {
				BeginRequestEventArgs e = new BeginRequestEventArgs( HttpContext.Current, Main.App, null );
				j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
			} else if( eventType == "endrequest" ) {
                BeginRequestEventArgs e = new BeginRequestEventArgs( HttpContext.Current, Main.App, null );
				j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
			} else if( eventType == "logon" ) {
				using( SqlConnection cn = Site.CreateConnection( true, true ) ) {
					cn.Open();
					SqlTransaction trans = cn.BeginTransaction( "preview_script_transaction" );
					LogOnEventArgs e = new LogOnEventArgs( Main.GetCurrentSession(), cn, trans, HttpContext.Current );
					try {
						trans.Rollback();
					} catch( Exception ex ) {
						( ex.Message ).Debug( 0 );
					}
					j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
				}
			} else if( eventType == "logoff" ) {
				using( SqlConnection cn = Site.CreateConnection( true, true ) ) {
					cn.Open();
					SqlTransaction trans = cn.BeginTransaction( "preview_script_transaction" );
					LogOffEventArgs e = new LogOffEventArgs( Main.GetCurrentSession(), cn, trans, HttpContext.Current );
					try {
						trans.Rollback();
					} catch( Exception ex ) {
						( ex.Message ).Debug( 0 );
					}
					j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
				}
			} else if( eventType == "addtocart" ) {
				using( SqlConnection cn = Site.CreateConnection( true, true ) ) {
					cn.Open();
					SqlTransaction trans = cn.BeginTransaction( "preview_script_transaction" );
					Commerce.CartItem ci = new Commerce.CartItem( "SAMPLE", Guid.Empty, 10, 3, Guid.Empty,
					DateTime.Today, Main.GetCurrentSession() );
					AddToCartEventArgs e = new AddToCartEventArgs( ci, Main.GetCurrentSession().Cart, cn, trans, Main.GetCurrentSession(), HttpContext.Current );
					try {
						trans.Rollback();
					} catch( Exception ex ) {
						( ex.Message ).Debug( 0 );
					}
					j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
				}
			} else if( eventType == "recalculatecart" ) {
				using( SqlConnection cn = Site.CreateConnection( true, true ) ) {
					cn.Open();
					SqlTransaction trans = cn.BeginTransaction( "preview_script_transaction" );
					RecalculateCartEventArgs e = new RecalculateCartEventArgs( Main.GetCurrentSession().Cart,
						Main.GetCurrentSession(), HttpContext.Current, new Dictionary<string, object>() );
					try {
						trans.Rollback();
					} catch( Exception ex ) {
						( ex.Message ).Debug( 0 );
					}
					j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
				}
			} else if( eventType == "recalculateorder" ) {
				using( SqlConnection cn = Site.CreateConnection( true, true ) ) {
					cn.Open();
					SqlTransaction trans = cn.BeginTransaction( "preview_script_transaction" );
					SqlCommand cmd = new SqlCommand( "select top 1 orderId from orders order by newId();", cn, trans );
					SqlDataReader d = cmd.ExecuteReader();
					Commerce.Order order = null;
					d.Read();
					int orderId = -1;
					if( !d.HasRows ) {
						Exception ex = new Exception( "You need to have at least one order in the system to test this event." );
						throw ex;
					} else {
						order = Commerce.Order.GetOrderByOrderId( orderId, cn, trans );
					}
					RecalculateOrderEventArgs e = new RecalculateOrderEventArgs( order, cn, trans, j, Main.GetCurrentSession(), HttpContext.Current );
					try {
						trans.Rollback();
					} catch( Exception ex ) {
						( ex.Message ).Debug( 0 );
					}
					j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
				}
			} else if( eventType == "placeorder" ) {
				using( SqlConnection cn = Site.CreateConnection( true, true ) ) {
					cn.Open();
					SqlTransaction trans = cn.BeginTransaction( "preview_script_transaction" );
					Commerce.Item i = Main.Site.Items.List[ 0 ];
					PlaceOrderEventArgs e = new PlaceOrderEventArgs( Main.GetCurrentSession().Cart, cn, trans, Main.GetCurrentSession(), HttpContext.Current );
					try {
						trans.Rollback();
					} catch( Exception ex ) {
						( ex.Message ).Debug( 0 );
					}
					j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
				}
			} else if( eventType == "statuschange" ) {
				using( SqlConnection cn = Site.CreateConnection( true, true ) ) {
					cn.Open();
					SqlTransaction trans = cn.BeginTransaction( "preview_script_transaction" );
					StatusChangeEventArgs e = new StatusChangeEventArgs( "orderId", "-1", -1, 1, Guid.Empty, Guid.Empty, cn, trans );
					try {
						trans.Rollback();
					} catch( Exception ex ) {
						( ex.Message ).Debug( 0 );
					}
					j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
				}
			} else if( eventType == "createitem" ) {
				using( SqlConnection cn = Site.CreateConnection( true, true ) ) {
					cn.Open();
					SqlTransaction trans = cn.BeginTransaction( "preview_script_transaction" );
					CreateItemEventArgs e = new CreateItemEventArgs( Main.Site.Items.List[ 0 ], Main.GetCurrentSession(), cn, trans, HttpContext.Current );
					try {
						trans.Rollback();
					} catch( Exception ex ) {
						( ex.Message ).Debug( 0 );
					}
					j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
				}
			} else if( eventType == "createuser" ) {
				using( SqlConnection cn = Site.CreateConnection( true, true ) ) {
					cn.Open();
					SqlTransaction trans = cn.BeginTransaction( "preview_script_transaction" );
					CreateUserEventArgs e = new CreateUserEventArgs( Main.Site.NullUser, Main.GetCurrentSession(), cn, trans, HttpContext.Current );
					try {
						trans.Rollback();
					} catch( Exception ex ) {
						( ex.Message ).Debug( 0 );
					}
					j = Site.ExecuteScriptedEvent( eventType, new Guid( id ), name, sourceCode, language, Main.Site, e, false );
				}
			} else if( eventType == "renderitemimage" ) {
				UnmanagedMemoryStream ms = ( UnmanagedMemoryStream )Main.getAdminResource( "__shizumaru_hisame_and_haohmarupng" );
				System.Drawing.Bitmap bitmap = new System.Drawing.Bitmap( ms );
				RenderItemImageEventArgs e = new RenderItemImageEventArgs( bitmap, Guid.Empty, Guid.Empty,
					Main.Site.Items.List[ 0 ], Main.GetCurrentSession(), HttpContext.Current );
			}
			return j;
		}
		/// <summary>
		/// Previews the task script.
		/// </summary>
		/// <param name="_taskId">The _task id.</param>
		/// <param name="sourceCode">The source code.</param>
		/// <param name="language">The language.</param>
		/// <returns>Error description and function output.</returns>
		public static Dictionary<string, object> PreviewTaskScript( string _taskId, string sourceCode, string language ) {
			Guid taskId = new Guid( _taskId );
			Dictionary<string, object> j = new Dictionary<string, object>();
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
				cn.Open();
				using( SqlTransaction trns = cn.BeginTransaction( "Scheduled Task" ) ) {
					List<object> errors = new List<object>();
					DateTime startDate = new DateTime();
					startDate = DateTime.Now;
					DateTime endDate = new DateTime();
					endDate = DateTime.MinValue;
					string errorNumber = "0";
					string errorJSON = "";
					string name = "";
					string consoleOutput = "";
                    using(SqlCommand cmd = new SqlCommand(@"select
					taskId, name, interval, sourceCode, language, lastRun, error, errorDesc VerCol
					from
					eventHandlers where taskId = @taskId;", cn)) {
                        cmd.Parameters.Add("@taskId", SqlDbType.UniqueIdentifier).Value = new Guid(taskId.ToString());
                        using(SqlDataReader d = cmd.ExecuteReader()) {
                            if(d.HasRows) {
                                d.Read();
                                name = d.GetString(1);
                                TimerEventArgs evntArgs = new TimerEventArgs(cn, trns, d.GetDateTime(5), taskId, name, d.GetString(6), d.GetString(7));
                                object[] scriptArguments = { Main.Site, evntArgs };
                                object obj = Admin.ExecuteScript(sourceCode, language, "script", "main", ref scriptArguments, ref errors);
                                if(errors.Count == 0) {
                                    if(obj.GetType() == typeof(string)) {
                                        consoleOutput = (string)obj;
                                    }
                                    errorNumber = "0";
                                    errorJSON = "{\"errorNumber\":0,\"errorDesc\":\"\"}";
                                    trns.Rollback();/* Always roll back.. hey it's a preview! */
                                } else {
                                    errorJSON = errors.ToJson();
                                    errorNumber = (string)((Dictionary<string, object>)(errors[0]))["errorNumber"].ToString();
                                    trns.Rollback();/* one or more errors occured so rollback the transaction */
                                }
                            }
                        }
                    }
					if( errors.Count > 0 ) {
						j.Add( "error", -1 );
					} else {
						j.Add( "error", 0 );
					}
					j.Add( "errors", errors );
					j.Add( "description", errorJSON );
					j.Add( "console", consoleOutput );
				}
			}
			return j;
		}
		/// <summary>
		/// Compiles the script.
		/// </summary>
		/// <param name="sourceCode">The source code.</param>
		/// <param name="language">The language.</param>
		/// <returns></returns>
		private static CompilerResults CompileScript( string sourceCode, string language ) {
			//("FUNCTION /w Compiler,(!PRIVATE ACCESS ONLY!) compileScript").debug();
			CompilerResults results = null;
			using( CodeDomProvider codeProvider = CodeDomProvider.CreateProvider( language ) ) {
				//ICodeCompiler icc=codeProvider.CreateCompiler();
				CompilerParameters p = new CompilerParameters();
				Assembly asm = Assembly.GetExecutingAssembly();
				p.ReferencedAssemblies.Add( "System.dll" );
				p.ReferencedAssemblies.Add( "System.Drawing.dll" );
				p.ReferencedAssemblies.Add( "System.Data.dll" );
				p.ReferencedAssemblies.Add( "System.Web.dll" );
				p.ReferencedAssemblies.Add( asm.Location );
				p.GenerateInMemory = true;
				p.GenerateExecutable = false;
				results = codeProvider.CompileAssemblyFromSource( p, sourceCode );
			}
			return results;
		}
		/// <summary>
		/// Executes the script.
		/// </summary>
		/// <param name="sourceCode">The source code.</param>
		/// <param name="language">The language.</param>
		/// <param name="startClass">The start class.</param>
		/// <param name="startMethod">The start method.</param>
		/// <param name="startArgs">The start args.</param>
		/// <param name="errors">The errors.</param>
		/// <returns></returns>
		public static object ExecuteScript( string sourceCode, string language, string startClass, string startMethod, ref object[] startArgs, ref List<object> errors ) {
			//("FUNCTION /w Compiler,(!PRIVATE ACCESS ONLY!) executeScript").debug();
			/* store all CompilerResults into a dictionary by source
			 * then check if they exist and pull the CompilerResults from the dict if
			 * the source code hasn't changed.
			 */
			CompilerResults r;
            if(Site.CompiledEvents == null) {
                Site.CompiledEvents = new Dictionary<string, object>();
            }
			if( Site.CompiledEvents.ContainsKey( sourceCode ) ) {
				r = ( CompilerResults )Site.CompiledEvents[ sourceCode ];
			} else {
				r = CompileScript( sourceCode, language );
			}
			object ret = null;
			List<object> errs = new List<object>();
			if( r.Errors.Count > 0 ) {
				foreach( CompilerError cErr in r.Errors ) {
					Dictionary<string, object> err = new Dictionary<string, object>();
					err.Add( "errorNumber", cErr.ErrorNumber );
					err.Add( "errorText", cErr.ErrorText );
					err.Add( "line", cErr.Line );
					err.Add( "sourceCode", sourceCode );
					errs.Add( err );
				}
				errors = errs;
				( "A script caused an error.  ==> " + errors.ToJson() ).Debug( 1 );
			} else {
				object obj = r.CompiledAssembly.CreateInstance( startClass );
				if( obj == null ) {
					Dictionary<string, object> err = new Dictionary<string, object>();
					err.Add( "errorNumber", -3 );
					err.Add( "line", 0 );
					err.Add( "sourceCode", sourceCode );
					err.Add( "errorText", "CompiledAssembly.CreateInstance() returned null." );
					errs.Add( err );
					errors = errs;
				} else {
					Type t = obj.GetType();
					try {
						ret = t.InvokeMember( startMethod, BindingFlags.InvokeMethod, null, obj, startArgs );
					} catch( Exception e ) {
						e = Main.getInnermostException( e );
						Dictionary<string, object> err = new Dictionary<string, object>();
						err.Add( "errorNumber", -2 );
						err.Add( "errorText", e.Message );
						err.Add( "line", 0 );
						err.Add( "sourceCode", sourceCode );
						errs.Add( err );
						errors = errs;
					}
				}
			}
			return ret;
        }
        #endregion
    }
}
