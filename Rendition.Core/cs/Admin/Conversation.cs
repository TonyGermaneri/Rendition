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
namespace Rendition {
	public partial class Admin {
		/// <summary>
		/// Removes the user from a Conversation.
		/// </summary>
		/// <returns></returns>
		public static Dictionary<string, object> ListConversations() {
			List<Dictionary<string, object>> cons = new List<Dictionary<string,object>>();
			Dictionary<string, object> j = new Dictionary<string, object>();
			foreach(Conversation con in Main.Conversations){
				Dictionary<string, object> f = new Dictionary<string, object>();
				if(con.Hidden){continue;};
				f.Add( "name", con.Name);
				f.Add( "subject", con.Subject);
				f.Add( "tags", con.Tags );
				f.Add( "members", con.GetUserNames );
				f.Add( "ownerId", con.OwnerId );
				f.Add( "version", con.Version );
				f.Add( "password", con.Password.Length>0 );
				f.Add( "id", con.Id);
				cons.Add(f);
			}
			j.Add( "conversations", cons );
			j.Add( "error", 0 );
			j.Add( "description", "" );
			return j;
		}
		/// <summary>
		/// Removes the user from a Conversation.
		/// </summary>
		/// <param name="conversationId">The Conversation id.</param>
		/// <param name="userId">The user id.</param>
		/// <returns></returns>
		public static Dictionary<string, object> RemoveUserFromConversation( string conversationId, Int64 userId ) {
			Guid id = new Guid( conversationId );
			Dictionary<string, object> j = new Dictionary<string, object>();
			List<Conversation> cons = Main.Conversations.FindAll( delegate( Conversation c ) {
				return c.Id == id;
			} );
			if( cons.Count == 0 ) {
				j.Add( "error", -1 );
				j.Add( "description", "Conversation does not exist." );
				return j;
			} else {
				Conversation con = cons[ 0 ];
				Commerce.User user = Commerce.Users.GetUserById( Convert.ToInt32( userId ) );
				con.RemoveUser( user );
				j.Add( "error", 0 );
				j.Add( "description", "" );
				return j;
			}
		}
		/// <summary>
		/// Adds a user Conversation.
		/// </summary>
		/// <param name="conversationId">The Conversation id.</param>
		/// <param name="userId">The user id.</param>
		/// <returns></returns>
		public static Dictionary<string, object> AddUserToConversation( string conversationId, Int64 userId ) {
			Guid id = new Guid( conversationId );
			Dictionary<string, object> j = new Dictionary<string, object>();
			List<Conversation> cons = Main.Conversations.FindAll( delegate( Conversation c ) {
				return c.Id == id;
			} );
			Conversation con = null;
			Commerce.User user = Commerce.Users.GetUserById( Convert.ToInt32( userId ) );
			if( cons.Count==0 ) {
				con = new Conversation(id);
				con.OwnerId = user.UserId;
				Main.Conversations.Add( con );
			} else {
				con = cons[0];
			}
			con.AddUser( user );
			/* return the most recent version */
			return GetConversation( conversationId, con.Version );
		}
		/// <summary>
		/// Gets a Conversation.
		/// </summary>
		/// <param name="conversationId">The Conversation id.</param>
		/// <param name="version">The version.</param>
		/// <returns></returns>
		public static Dictionary<string, object> GetConversation( string conversationId, Int64 version ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
			Guid id = new Guid( conversationId );
			List<Conversation> cons = Main.Conversations.FindAll( delegate( Conversation c ) {
				return c.Id == id;
			} );
			Conversation con = null;
			if( cons.Count == 0 ) {
				j.Add( "error", -1 );
				j.Add( "description", "Conversation does not exist." );
				return j;
			}else{
				con = cons[0];
			}
			List<Dictionary<string, object>> users = new List<Dictionary<string, object>>();
			foreach( Commerce.User user in con.Users ) {
				Dictionary<string, object> u = new Dictionary<string, object>();
				u.Add( "userId", user.UserId );
				u.Add( "handle", user.Handle );
				users.Add( u );
			}
			List<ConversationMessage> messages = con.Messages.FindAll( delegate( ConversationMessage cm ) {
				return cm.Version > version;
			} );
			j.Add( "id", id.ToString() );
			j.Add( "messages", messages );
			j.Add( "users", users );
			j.Add( "error", 0 );
			j.Add( "description", "" );
			return j;
		}
		/// <summary>
		/// Submits a Conversation message.
		/// </summary>
		/// <param name="userId">The user id.</param>
		/// <param name="message">The message.</param>
		/// <param name="conversationId">The Conversation id.</param>
		/// <param name="version">The version of the Conversation submitting to.</param>
		/// <returns></returns>
		public static Dictionary<string, object> SubmitConversationMessage( Int64 userId, string message,
		 string conversationId, Int64 version ) {
			/* get the session of the submtting user */
			Commerce.User user = Commerce.Users.GetUserById( Convert.ToInt32( userId ) );
			/* find the Conversation, or create it if it does't exist */
			Guid id = new Guid( conversationId );
			List<Conversation> cons = Main.Conversations.FindAll( delegate( Conversation c ) {
				return c.Id == id;
			} );
			Conversation con = null;
			if( cons.Count==0 ) {
				con = new Conversation(new Guid(conversationId));
				con.OwnerId = user.UserId;
				con.Users.Add( user );
				con.UserIds.Add( user.UserId );
				Main.Conversations.Add(con);
			}else{
				con = cons[0];
			}
			/* if this is the owner check if the user has submitted a command */
			bool command = false;
			try{
				if( message.StartsWith("/#name")) {
					con.Name = message.Substring(message.IndexOf("/#name")+7);
					ConversationMessage msg = new ConversationMessage( String.Format( "Channel name has been changed to {0}.", con.Name ), Main.Site.NullUser );
					con.AddMessage( msg );
					command = true;
				}
				if( message.StartsWith( "/#subject" ) ) {
					con.Subject = message.Substring( message.IndexOf( "/#subject" ) + 10 );
					ConversationMessage msg = new ConversationMessage( String.Format( "Channel subject has been changed to {0}.", con.Subject ), Main.Site.NullUser );
					con.AddMessage( msg );
					command = true;
				}
				if( message.StartsWith( "/#tags" ) ) {
					con.Tags = message.Substring( message.IndexOf( "/#tags" ) + 7 );
					ConversationMessage msg = new ConversationMessage( String.Format( "Channel tags has been changed to {0}.", con.Tags ), Main.Site.NullUser );
					con.AddMessage( msg );
					command = true;
				}
				if( message.StartsWith( "/#password" ) ) {
					con.Password = message.Substring( message.IndexOf( "/#password" ) + 11 );
					ConversationMessage msg = new ConversationMessage("Channel password has been set/changed.", Main.Site.NullUser );
					con.AddMessage( msg );
					command = true;
				}
				if( message.StartsWith( "/#ownerId" ) ) {
					con.OwnerId = Convert.ToInt32(message.Substring( message.IndexOf( "/#ownerId" ) + 7 ));
					Commerce.User usr = Commerce.Users.GetUserById( con.OwnerId );
					if(usr==null){
						ConversationMessage msg = new ConversationMessage( "User does not exist.", Main.Site.NullUser );
						con.AddMessage( msg );
					}
					ConversationMessage msgx = new ConversationMessage( String.Format( "Channel owner has been changed to {0}.", usr.Handle ), Main.Site.NullUser );
					con.AddMessage( msgx );
					command = true;
				}
				if( message.StartsWith( "/#kick" ) ) {
					int uid = Convert.ToInt32( message.Substring( message.IndexOf( "/#kick" ) + 7 ) );
					Commerce.User usr = Commerce.Users.GetUserById(uid);
					ConversationMessage msg = new ConversationMessage( String.Format( "Kicking {0}.", usr.Handle ), Main.Site.NullUser );
					con.AddMessage( msg );
					con.RemoveUser(usr);
					command = true;
				}
			}catch(Exception e){
				ConversationMessage msg = new ConversationMessage( e.Message, Main.Site.NullUser );
				con.AddMessage( msg );
				return GetConversation( con.Id.ToString(), version );
			}
			/* only add messages with length > 0 */
			if( message.Length > 0 && !command ) {
				ConversationMessage msg = new ConversationMessage( message, user );
				con.AddMessage( msg );
			}
			return GetConversation( con.Id.ToString(), version );
		}
		/// <summary>
		/// A Conversation between one or more users.
		/// </summary>
		public class Conversation {
			/// <summary>
			/// The version of the Conversation.  When the client requests updates to the Conversation, it the can use the
			/// version number, which increments by one for each message added, to limit the number of messages returned
			/// to the client when using the Admin.getConversation().
			/// </summary>
			public int Version = 0;
			/// <summary>
			/// The id of the Conversation.
			/// </summary>
			public Guid Id;
			/// <summary>
			/// List of messages in this Conversation.
			/// </summary>
			public List<ConversationMessage> Messages = new List<ConversationMessage>();
			/// <summary>
			/// List of user's currently in this Conversation.
			/// </summary>
			public List<Commerce.User> Users = new List<Commerce.User>();
			/// <summary>
			/// List of user's userIds currently in this Conversation.
			/// </summary>
			public List<int> UserIds = new List<int>();
			/// <summary>
			/// Name of the Conversation.
			/// </summary>
			public string Name = "";
			/// <summary>
			/// Subject of the Conversation.
			/// </summary>
			public string Subject = "";
			/// <summary>
			/// Tags.
			/// </summary>
			public string Tags = "";
			/// <summary>
			/// Password.
			/// </summary>
			public string Password = "";
			/// <summary>
			/// When this Conversation is hidden then true.
			/// </summary>
			public bool Hidden = false;
			/// <summary>
			/// Owner.
			/// </summary>
			public int OwnerId = -1;
			/// <summary>
			/// Gets user names of the users in the Conversation.
			/// </summary>
			public string GetUserNames {
				get {
					List<string> handles = new List<string>();
					foreach(Commerce.User user in Users){
						handles.Add( user.Handle );
					}
					string joinedHandles = string.Join(", ",handles.ToArray());
					if(Users.Count>0){
						return joinedHandles;
					}else{
						return "Empty";
					}
				}
			}
			/// <summary>
			/// Initializes a new instance of the <see cref="Conversation"/> class.
			/// </summary>
			/// <param name="newConversationId">The new Conversation id.</param>
			public Conversation(Guid newConversationId){
				Id = newConversationId;
			}
			/// <summary>
			/// Adds a message to this Conversation.
			/// </summary>
			/// <param name="message">The message.</param>
			/// <returns></returns>
			public Conversation AddMessage( ConversationMessage message ) {
				Messages.Add( message );
				Version++;
				message.Version = Version;
				return this;
			}
			/// <summary>
			/// Adds a user to the Conversation.
			/// </summary>
			/// <param name="user">The user.</param>
			public void AddUser(Commerce.User user){
				/* don't add the same user twice */
				if(Users.Contains(user)){return;};
				Users.Add(user);
				UserIds.Add(user.UserId);
				Version++;
				return;
			}
			/// <summary>
			/// Removes the user.
			/// </summary>
			/// <param name="user">The user.</param>
			public void RemoveUser( Commerce.User user ) {
				/* don't add the same user twice */
				if(!Users.Contains( user ) ) { return; };
				Users.Remove( user );
				UserIds.Remove( user.UserId );
				Version++;
				return;
			}
		}
		/// <summary>
		/// A message in a Conversation.
		/// </summary>
		public class ConversationMessage {
			/// <summary>
			/// The unique id of this message.
			/// </summary>
			public Guid Id = Guid.NewGuid();
			/// <summary>
			/// The message value.
			/// </summary>
			public string Message = "";
			/// <summary>
			/// The date this message was sent on.
			/// </summary>
			public DateTime SentOn = DateTime.Now;
			/// <summary>
			/// The id of the user who created this message.
			/// </summary>
			public int UserId {
				get {
					return User.UserId;
				}
			}
			/// <summary>
			/// The handle of the user who created this message.
			/// </summary>
			public string Handle {
				get {
					return User.Handle;
				}
			}
			/// <summary>
			/// The user who created this message.
			/// </summary>
			private Commerce.User User;
			/// <summary>
			/// Version of the Conversation this message was created on.
			/// </summary>
			public int Version = 0;
			/// <summary>
			/// Initializes a new instance of the <see cref="ConversationMessage"/> class.
			/// </summary>
			/// <param name="_message">The _message.</param>
			/// <param name="_user">The _user.</param>
			public ConversationMessage( string _message, Commerce.User _user ) {
				Message = _message;
				User = _user;
			}
		}
	}
}
