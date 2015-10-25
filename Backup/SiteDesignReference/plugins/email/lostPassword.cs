using System;
using System.Collections.Generic;
using System.Web;
using Rendition;
public class lostPassword {
	public void sendMail(ref CreateEmailEventArgs args) {
		/* construct your message here */
		string message="Your password is "+args.User.Password+".";
		/* this is what you're sending as an email */
		args.MessageBody = message;
		args.Subject = "Your password from "+Main.Site.Defaults.SiteName;
		return;
	}
}