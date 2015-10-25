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
using System.Threading;
using System.IO;
namespace Rendition {
    internal class Logger: IDisposable {
        /// <summary>
        /// The log cache that is output to the log file every log_thread_sleep_time miliseconds.
        /// </summary>
        private List<string> log_stream_in = new List<string>();
        /// <summary>
        /// Lock for the shared object log_stream_in.
        /// </summary>
        private object padlock = new object();
        /// <summary>
        /// The thread the log writter is running on.
        /// </summary>
        private Thread logThread;
        /// <summary>
        /// When true the thread is running.
        /// </summary>
        private bool threadIsRunning;
        /// <summary>
        /// The path to the log file.
        /// </summary>
        private string logFilePath = "";
        /// <summary>
        /// How long the writer thread sleeps.
        /// </summary>
        private int log_thread_sleep_time = 1000;
        /// <summary>
        /// Initializes a new instance of the <see cref="Logger"/> class.
        /// </summary>
        public Logger(string logPath) {
            logThread = new Thread(startLogWriter);
            logThread.Name = "Logging.";
            logThread.SetApartmentState(ApartmentState.MTA);
            threadIsRunning = true;
            logThread.Start();
            logFilePath = logPath;
        }
        /// <summary>
        /// Disposes this instance.
        /// </summary>
        public void Dispose(){
            threadIsRunning = false;
            logThread.Abort();
        }
        /// <summary>
        /// Starts the log writer thread.
        /// </summary>
        private void startLogWriter() {
            while(threadIsRunning) {
                string log_stream_out;
                if(log_stream_in.Count > 0) {
                    lock(padlock) {
                        log_stream_out = String.Join(Environment.NewLine, log_stream_in.ToArray());
                        log_stream_in.RemoveRange(0, log_stream_in.Count);
                    }
                    using(StreamWriter w = File.AppendText(logFilePath)) {
                        w.WriteLine(log_stream_out);
                        w.Flush();
                    }
                }
                Thread.Sleep(log_thread_sleep_time);
            }
        }
        /// <summary>
        /// Writes a to the log and ends the string with a new line.
        /// </summary>
        /// <param name="data">The data.</param>
        internal void WriteLine(string data) {
            write_line(data);
        }
        /// <summary>
        /// Write_lines the specified _data to log.
        /// </summary>
        /// <param name="_dataToLog">The _data to log.</param>
        private void write_line(string _dataToLog) {
            lock(padlock) {
                log_stream_in.Add(_dataToLog);
            }
            return;
        }
    }
}