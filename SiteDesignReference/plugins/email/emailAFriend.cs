using System;
using System.Collections.Generic;
using System.Web;
using Rendition;
public class emailAFriend {
	public void sendMail(ref CreateEmailEventArgs args) {
		/* construct your message here */
		string msg=@"You may be interested in "+args.Item.Number+
		@"<br>Here's a message from your friend <hr>"+args.UserComment;
		/* this is what you're sending as an email */
		args.MessageBody = msg;
		args.Subject = "Your friend "+args.User.Email+" thought you would be intrested in.";
		return;
	}
}
