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
namespace Rendition {
	public partial class Site {
        #region Instance Methods
        /// <summary>
        /// Binds the event handlers.
        /// </summary>
        public void BindEventHandlers() {
            ("FUNCTION bindEventHandlers /W ADHOC (startup only)").Debug(10);
            /* 
             * TODO: change event string names to match event names
             * compile and assign each event handler in the DB to an event */
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(@"select
				taskId, name, interval, sourceCode, language, lastRun, error, errorDesc, eventType VerCol
				from
				eventHandlers where enabled = 1 and not eventType = 'scheduler';", cn)) {
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        if(d.HasRows) {
                            while(d.Read()) {
                                string sourceCode = d.GetString(3);
                                string language = d.GetString(4);
                                string name = d.GetString(1);
                                Guid id = d.GetGuid(0);
                                string eventType = d.GetString(8);
                                if(eventType == "init") {
                                    this.Initializing += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "dispose") {
                                    this.Disposing += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "beginrequest") {
                                    this.BeginRequest += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "endrequest") {
                                    this.EndRequest += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "logon") {
                                    this.LoggedOn += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "logoff") {
                                    this.LoggedOff += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "beforeaddtocart") {
                                    this.AddedToCart += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "addtocart") {
                                    this.AddedToCart += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "recalculatecart") {
                                    this.RecalculatedCart += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "recalculateorder") {
                                    this.RecalculatedOrder += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "placeorder") {
                                    this.PlacedOrder += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "statuschange") {
                                    this.StatusChanged += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "createitem") {
                                    this.CreatingItem += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "createuser") {
                                    this.CreatingUser += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "renderitemimage") {
                                    this.RenderedItemImage += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "uiinit") {
                                    this.UIInitializing += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "beforeplaceorder") {
                                    this.PlacingOrder += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "paymentgateway") {
                                    this.OpeningPaymentGateway += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "beforestatuschange") {
                                    this.StatusChanging += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "beforestatuschange") {
                                    this.StatusChanging += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "beforestatuschange") {
                                    this.StatusChanging += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "beforerenderitemimage") {
                                    this.RenderingItemImage += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "dispose") {
                                    this.Disposing += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "calculatediscount") {
                                    this.Disposing += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "shipmentupdate") {
                                    this.Disposing += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                } else if(eventType == "paymentgateway") {
                                    this.Disposing += delegate(object sender, EventArgs e) {
                                        ExecuteScriptedEvent(eventType, id, name, sourceCode, language, sender, e, false);
                                        return;
                                    };
                                }
                            }
                        }
                    }
                }
            }
            return;
        }
        /// <summary>
        /// Starts the task scheduler.
        /// </summary>
        public void StartTaskScheduler() {
            ("FUNCTION startTaskScheduler /W ADHOC (startup only)").Debug(10);
            /* start a Timer for each task */
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand(@"select
				taskId, name, interval, sourceCode, language, lastRun, error, errorDesc VerCol
				from
				eventHandlers where enabled = 1 and eventType = 'scheduler';", cn)) {
                    using(SqlDataReader d = cmd.ExecuteReader()) {
                        if(d.HasRows) {
                            while(d.Read()) {
                                Timers.Add(ExecuteScheduledTask(d.GetGuid(0), d.GetString(1), d.GetInt32(2),
                                d.GetString(3), d.GetString(4), d.GetDateTime(5), d.GetString(6), d.GetString(7)));
                            }
                        }
                    }
                }
            }
            return;
        }
        /// <summary>
        /// Executes the scripted event.
        /// </summary>
        /// <param name="eventType">Type of the event.</param>
        /// <param name="taskId">The task id.</param>
        /// <param name="name">The name.</param>
        /// <param name="sourceCode">The source code.</param>
        /// <param name="language">The language.</param>
        /// <param name="sender">The sender.</param>
        /// <param name="scriptArguments">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        /// <param name="preview">if set to <c>true</c> [preview].</param>
        /// <returns></returns>
        public static Dictionary<string, object> ExecuteScriptedEvent(string eventType, Guid taskId, string name, string sourceCode, string language, object sender, EventArgs scriptArguments, bool preview) {
            ("EVENT " + eventType + " > delegate " + name + "(" + taskId.ToString() + ")").Debug(10);
            Dictionary<string, object> j = new Dictionary<string, object>();
            string consoleOutput = "";
            string errorNumber = "";
            string errorJSON = "";
            DateTime startDate = DateTime.Now;
            List<object> errors = new List<object>();
            object[] args = { sender, scriptArguments };
            object obj = Admin.ExecuteScript(sourceCode, language, "script", "main", ref args, ref errors);
            if(errors.Count == 0) {
                if(consoleOutput.Length > 0) {
                    if(obj.GetType() == typeof(string)) {
                        consoleOutput = (string)obj;
                    }
                    Dictionary<string, object> err = new Dictionary<string, object>();
                    err.Add("errorNumber", 0);
                    err.Add("errorText", "EVENT " + eventType + " > delegate " + name + " completed without error.");
                    (" --------------------------------------------------").Debug(6);
                    (" |		MESSAGE FROM " + name).Debug(6);
                    (" --------------------------------------------------").Debug(6);
                    (consoleOutput).Debug(6);/*MESSAGE!*/
                    (" --------------------------------------------------").Debug(6);
                    err.Add("line", 0);
                    errorNumber = "0";
                    errorJSON = err.ToJson();
                    err["errorText"].Debug(6);
                }
            } else {
                errorJSON = errors.ToJson();
                errorNumber = (string)((Dictionary<string, object>)(errors[0]))["errorNumber"].ToString();
                errorJSON.Debug(6);
            }
            if(!preview) {
                updateEventTaskStatus(taskId, startDate, false, DateTime.Now, errorNumber, errorJSON);
            }
            j.Add("error", errorNumber);
            j.Add("errors", errors);
            j.Add("console", consoleOutput);
            return j;
        }
        /// <summary>
		/// Stops the task scheduler.
		/// </summary>
		public void StopTaskScheduler() {
			( "FUNCTION stopTaskScheduler (shutdown only)" ).Debug( 10 );
            if(Timers == null) { return; };
			foreach( Admin.Timer timer in Timers ) {
				timer.Stop();
			}
		}
		/// <summary>
		/// Executes a scheduled task.
		/// </summary>
		/// <param name="taskId">The task id.</param>
		/// <param name="name">The name.</param>
		/// <param name="interval">The interval.</param>
		/// <param name="sourceCode">The source code.</param>
		/// <param name="language">The language.</param>
		/// <param name="lastRun">The last run.</param>
		/// <param name="lastErrorId">The last error id.</param>
		/// <param name="lastErrorJSON">The last error JSON.</param>
		/// <returns></returns>
		public Admin.Timer ExecuteScheduledTask( Guid taskId, string name, int interval,
		string sourceCode, string language, DateTime lastRun, string lastErrorId, string lastErrorJSON ) {
			( "FUNCTION executeScheduledTask (init and start task event timers) /W ADHOC (!PRIVATE!)" ).Debug( 10 );
			Admin.Timer timer = new Admin.Timer();
			/* last time this ran, minus the interval is the starting interval */
			timer.Interval = interval;
			timer.Name = "Compiled DB Timer Event" + Utilities.Iif( name.Length > 0, ":", "" );
			timer.elapsed += new EventHandler( delegate( object e, EventArgs args ) {
				List<object> errors = new List<object>();
				DateTime startDate = new DateTime();
				startDate = DateTime.Now;
				DateTime endDate = new DateTime();
				endDate = DateTime.MinValue;
				string errorJSON = "";
				string errorNumber = "0";
				string consoleOut = "";
				try { /* and and run someone elses code */
					( "EVENT DELEGATE Task " + name + " started." ).Debug( 6 );
					if( timer.Interval != interval ) {
						timer.Interval = interval;/* now interval should be set to the actual interval */
					}
					using( SqlConnection cn = Site.CreateConnection( true, true ) ) {
						cn.Open();
						using( SqlTransaction trns = cn.BeginTransaction( "Scheduled Task" ) ) {
							using( SqlCommand cmd = new SqlCommand( "update eventHandlers set startTime = @startTime, lock = 1 where taskId = @taskId", cn ) ) {
								cmd.Parameters.Add( "@taskId", SqlDbType.UniqueIdentifier ).Value = new Guid( taskId.ToString() );
								cmd.Parameters.Add( "@startTime", SqlDbType.DateTime ).Value = startDate;
								cmd.ExecuteNonQuery();
								TimerEventArgs evntArgs = new TimerEventArgs( cn, trns, lastRun, taskId, name, lastErrorId, lastErrorJSON );
								object[] scriptArguments = { Main.Site, evntArgs };
								object obj = Admin.ExecuteScript( sourceCode, language, "script", "main", ref scriptArguments, ref errors );
								if( errors.Count == 0 ) {
									if( obj.GetType() == typeof( string ) ) {
										consoleOut = ( string )obj;
									}
									Dictionary<string, object> s = new Dictionary<string, object>();
									s.Add( "errorNumber", 0 );
									s.Add( "errorDesc", "Timer Event " + name + " completed without error." );
									s.Add( "console", consoleOut );
									errorNumber = "0";
									errorJSON = s.ToJson();
									trns.Commit();/* no errors occured in the script so commit the transaction */
								} else {
									errorJSON = errors.ToJson();
									errorNumber = ( ( Dictionary<string, object> )( errors[ 0 ] ) )[ "errorNumber" ].ToString();
									trns.Rollback();/* one or more errors occured so rollback the transaction */
								}
								endDate = DateTime.Now;
								updateEventTaskStatus( taskId, startDate, false, endDate, errorNumber, errorJSON );
								( "EVENT DELEGATE Task " + name + " ended." ).Debug( 6 );
							}
						}
					}
				} catch( Exception excp ) {
					String.Format( "EVENT DELEGATE Task {0} threw and exception. {1}", name, excp.Message ).Debug( 1 );
				}
			} );
			timer.Start();
			return timer;
		}
        #endregion
        #region Static Methods
        /// <summary>
		/// Updates the event task status.
		/// </summary>
		/// <param name="taskId">The task id.</param>
		/// <param name="startDate">The start date.</param>
		/// <param name="lockStatus">if set to <c>true</c> [lock status].</param>
		/// <param name="endDate">The end date.</param>
		/// <param name="errorNumber">The error number.</param>
		/// <param name="errorJSON">The error JSON.</param>
		private static void updateEventTaskStatus( Guid taskId, DateTime startDate, bool lockStatus, DateTime endDate, string errorNumber, string errorJSON ) {
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand("updateTaskStatus @taskId,@startTime,@lock,@lastRun,@error,@errorDesc", cn)) {
                    cmd.Parameters.Add("@taskId", SqlDbType.UniqueIdentifier).Value = new Guid(taskId.ToString());
                    cmd.Parameters.Add("@startTime", SqlDbType.DateTime).Value = startDate;
                    cmd.Parameters.Add("@lock", SqlDbType.Bit).Value = lockStatus;
                    cmd.Parameters.Add("@lastRun", SqlDbType.DateTime).Value = endDate;
                    cmd.Parameters.Add("@error", SqlDbType.VarChar).Value = errorNumber;
                    cmd.Parameters.Add("@errorDesc", SqlDbType.VarChar).Value = errorJSON;
                    cmd.ExecuteNonQuery();
                }
            }
		}
        #endregion
	}
}
