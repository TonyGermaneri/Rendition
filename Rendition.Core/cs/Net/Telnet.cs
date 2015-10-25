using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net.Sockets;
using System.Threading;
using System.Net;
using System.Collections;
using System.Diagnostics;
using System.ComponentModel;
namespace Rendition {
	/// <summary>
	/// State object for reading client data asynchronously
	/// </summary>
	public class StateObject {
		/// <summary>
		/// Client  socket.
		/// </summary>
		public Socket WorkSocket = null;
		/// <summary>
		/// Size of receive buffer.
		/// </summary>
		public const int BufferSize = 1024;
		/// <summary>
		/// Receive buffer.
		/// </summary>
		public byte[] Buffer = new byte[ BufferSize ];
		/// <summary>
		/// Received data string.
		/// </summary>
		public StringBuilder StringBuilder = new StringBuilder();
	}
	/// <summary>
	/// Telnet server - used to output log files to.
	/// </summary>
	public static class TelnetServer {
		/// <summary>
		/// When the server has started and is listening for connections, this value will be true.
		/// </summary>
		public static bool Started = false;
		private static ArrayList stateObjects = new ArrayList();
		private static Thread listenThread;
		private static Socket listener;
		private static string local_ip_address;
		/// <summary>
		/// Thread signal.
		/// </summary>
		public static ManualResetEvent AllDone = new ManualResetEvent( false );
		/// <summary>
		/// Writes to all telnet clients.
		/// </summary>
		/// <param name="message">The message.</param>
		public static void WriteToAllClients( string message ) {
			foreach( StateObject stateObject in stateObjects ) {
				if( stateObject.WorkSocket.Connected ) {
					Send( stateObject.WorkSocket, message );
				} else {
					/* shut down the socket */
					RemoveConnection( stateObject );
				}
			}
		}
		/// <summary>
		/// Shutdowns the telnet server.
		/// </summary>
		public static void Shutdown() {
			foreach( StateObject stateObject in stateObjects ) {
				RemoveConnection( stateObject );
			}
			listener.Close();
			Started = false;
		}
		private static void RemoveConnection( StateObject stateObject ) {
			stateObject.WorkSocket.Shutdown( SocketShutdown.Both );
			stateObject.WorkSocket.Close();
			stateObjects.Remove( stateObject );
		}
		/// <summary>
		/// Starts the telnet server
		/// </summary>
		/// <param name="_local_ip_address">The IP Address to listen to connections on.</param>
		public static void Start( string _local_ip_address ) {
			local_ip_address = _local_ip_address;
			listenThread = new Thread( new ThreadStart( StartListening ) );
			listenThread.Name = "telnetServer_listenThread";
			listenThread.IsBackground = true;
			listenThread.SetApartmentState( ApartmentState.MTA );
			Started = true;
			listenThread.Start();
		}
		/// <summary>
		/// Starts listening for new connecitons.
		/// </summary>
		private static void StartListening() {
			// Data buffer for incoming data.
			byte[] bytes = new Byte[ 1024 ];
			// Establish the local endpoint for the socket.
			// The DNS name of the computer
			// running the listener is "host.contoso.com".
			IPHostEntry ipHostInfo = Dns.GetHostEntry( Dns.GetHostName() );
			IPAddress ipAddress = IPAddress.Parse( local_ip_address );
			IPEndPoint localEndPoint = new IPEndPoint( ipAddress, Main.TelnetServerPort/*4000 by default*/);
			// Create a TCP/IP socket.
			listener = new Socket( AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp );
			// Bind the socket to the local endpoint and listen for incoming connections.
			try {
				listener.Bind( localEndPoint );
				listener.Listen( 100 );
				while( true ) {
					// Set the event to nonsignaled state.
					AllDone.Reset();
					// Start an asynchronous socket to listen for connections.
					listener.BeginAccept( new AsyncCallback( AcceptCallback ), listener );
					// Wait until a connection is made before continuing.
					AllDone.WaitOne();
				}
			} catch( Exception e ) {
				if( !e.Message.Contains( "Thread was being aborted." ) ) {
					e.ToString().Debug( 0 );
				}
			}
		}
		/// <summary>
		/// Accepts the async callback callback.
		/// </summary>
		/// <param name="ar">The ar.</param>
		public static void AcceptCallback( IAsyncResult ar ) {
			// Signal the main thread to continue.
			AllDone.Set();
			// Get the socket that handles the client request.
			Socket listener = ( Socket )ar.AsyncState;
			Socket handler = listener.EndAccept( ar );
			// Create the state object.
			StateObject state = new StateObject();
			state.WorkSocket = handler;
			handler.BeginReceive( state.Buffer, 0, StateObject.BufferSize, 0,
				new AsyncCallback( ReadCallback ), state );
			stateObjects.Add( state );
			Send( handler, "Rendition telnet log listener.  Press 0-9 to set log verbosity." );
		}
		/// <summary>
		/// Reads the callback.
		/// </summary>
		/// <param name="ar">The ar.</param>
		public static void ReadCallback( IAsyncResult ar ) {
			String content = String.Empty;
			// Retrieve the state object and the handler socket
			// from the asynchronous state object.
			StateObject state = ( StateObject )ar.AsyncState;
			Socket handler = state.WorkSocket;
			// Read data from the client socket. 
			int bytesRead = handler.EndReceive( ar );
			if( bytesRead > 0 ) {
				content = Encoding.ASCII.GetString( state.Buffer, 0, bytesRead );
			}
		}
		/// <summary>
		/// Sends a message to the specified handler.
		/// </summary>
		/// <param name="handler">The handler.</param>
		/// <param name="data">The data.</param>
		private static void Send( Socket handler, String data ) {
			// Convert the string data to byte data using ASCII encoding.
			byte[] byteData = Encoding.ASCII.GetBytes( data + Environment.NewLine );
			if( handler.Connected ) {
				try {
					// Begin sending the data to the remote device.
					handler.BeginSend( byteData, 0, byteData.Length, 0, new AsyncCallback( SendCallback ), handler );
				} catch( Exception e ) {
					String.Format( "TelnetServer Send caused an exception: {0}.", e.Message ).Debug( 3 );
				}
			}
		}
		/// <summary>
		/// Async callback from send.
		/// </summary>
		/// <param name="ar">The ar.</param>
		private static void SendCallback( IAsyncResult ar ) {
			try {
				// Retrieve the socket from the state object.
				Socket handler = ( Socket )ar.AsyncState;
				int bytesSent = handler.EndSend( ar );
			} catch( Exception e ) {
				String.Format( "TelnetServer SendCallback caused an exception: {0}.", e.Message ).Debug( 3 );
			}
		}
	}
}
