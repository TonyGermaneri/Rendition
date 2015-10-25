using System;
using System.Collections.Generic;
using System.Web;
using System.Text;
using Rendition;
public class commentAdded {
	/// <summary>
	/// Sends a comment update email.
	/// </summary>
	/// <returns>Dictionary with two keys: message and subject.</returns>
	public void sendMail(ref CreateEmailEventArgs args) {
		/* construct your message here */
		string message="A comment has been added<br>Subject:"+args.Reply.Subject+"<br>Message:"+args.Reply.Comment;
		/* this is what you're sending as an email */
		args.MessageBody = message;
		args.Subject = "A comment has been added.";
		return;
	}
	
}
