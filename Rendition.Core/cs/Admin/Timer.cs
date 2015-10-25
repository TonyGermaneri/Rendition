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
using Microsoft.SqlServer.Server;
using System.Timers;
namespace Rendition {
	public partial class Admin {
		/// <summary>
		/// A Timer that simplifies the class System.Timers.Timer
		/// </summary>
		public class Timer : System.Timers.Timer {
			/// <summary>
			/// Gets or sets the _event args.
			/// </summary>
			/// <value>The _event args.</value>
			public EventArgs _eventArgs { get; set; }
			private System.Timers.Timer CountDownTimer;
			/// <summary>
			/// Number of intervals until the Elapsed event is fired.
			/// </summary>
			public double TimeUntilElapsed = 0;
			/// <summary>
			/// Name of the Timer.  By default set to "unnamed".
			/// </summary>
			public string Name = "";
			/// <summary>
			/// Last return message.
			/// </summary>
			public string Message = "Stopped";
			/// <summary>
			/// Last return error number.
			/// </summary>
			public int Error = 0;
			/// <summary>
			/// Id of the event instance - does not need to be unique, but should help you identifiy your Timer.
			/// </summary>
			public int Id = 0;
			/// <summary>
			/// Initializes a new instance of the <see cref="Timer"/> class.
			/// </summary>
			public Timer() {
				this.Elapsed += OnElapsed;
				Main.Timers.Add( this );
			}
			/// <summary>
			/// Initializes a new instance of the <see cref="Timer"/> class.
			/// </summary>
			/// <param name="interval">The interval.</param>
			public Timer( int interval ) {
				base.Interval = interval;
				this.Elapsed += OnElapsed;
				Main.Timers.Add( this );
			}
			/// <summary>
			/// Starts raising the <see cref="E:System.Timers.Timer.Elapsed"/> event by setting <see cref="P:System.Timers.Timer.Enabled"/> to true.
			/// </summary>
			/// <exception cref="T:System.ArgumentOutOfRangeException">The <see cref="T:System.Timers.Timer"/> is created with an interval equal to or greater than <see cref="F:System.Int32.MaxValue"/> + 1, or set to an interval less than zero.</exception>
			/// <PermissionSet>
			/// 	<IPermission class="System.Security.Permissions.SecurityPermission, mscorlib, Version=2.0.3600.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" version="1" Flags="UnmanagedCode"/>
			/// </PermissionSet>
			public new void Start() {
				this.Message = "Running";
				this.TimeUntilElapsed = base.Interval;
				CountDownTimer = new System.Timers.Timer();
				CountDownTimer.Elapsed += new ElapsedEventHandler( countDownTimer_Elapsed );
				CountDownTimer.Interval = 1;
				CountDownTimer.AutoReset = false;
				CountDownTimer.Start();
				base.Start();
			}
			/// <summary>
			/// Stops raising the <see cref="E:System.Timers.Timer.Elapsed"/> event by setting <see cref="P:System.Timers.Timer.Enabled"/> to false.
			/// </summary>
			/// <PermissionSet>
			/// 	<IPermission class="System.Security.Permissions.SecurityPermission, mscorlib, Version=2.0.3600.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" version="1" Flags="UnmanagedCode"/>
			/// </PermissionSet>
			public new void Stop() {
				this.Message = "Stopped";
				CountDownTimer.Stop();
				base.Stop();
			}
			private void countDownTimer_Elapsed( object source, ElapsedEventArgs e ) {
				this.TimeUntilElapsed--;
				CountDownTimer.Start();
			}
			/// <summary>
			/// Called when [elapsed].
			/// </summary>
			/// <param name="source">The source.</param>
			/// <param name="e">The <see cref="System.Timers.ElapsedEventArgs"/> instance containing the event data.</param>
			public void OnElapsed( object source, ElapsedEventArgs e ) {
				this.TimeUntilElapsed = base.Interval;
				if( _eventArgs != null ) {
					_OnElapsed( _eventArgs );
				} else {
					_OnElapsed( e );
				}
			}
			/// <summary>
			/// on elapsed.
			/// </summary>
			/// <param name="args">The <see cref="System.EventArgs"/> instance containing the event data.</param>
			protected virtual void _OnElapsed( EventArgs args ) {
				if( elapsed != null ) {
					try {
						elapsed( this, args );
					} catch( Exception ex ) {
						Message = "Exception Thrown:" + ex.Message;
					}
				}
			}
			/// <summary>
			/// Occurs when [elapsed].
			/// </summary>
			public event EventHandler elapsed;
		}
	}
}
