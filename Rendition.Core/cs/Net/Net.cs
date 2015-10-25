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
/* -------------------------------------------------------------------------
* net.cs
* 
* networking stuff
* email, FTP, telnet
* ------------------------------------------------------------------------- */
using System;
using System.Text;
using System.Net.Sockets;
using System.Threading;
using System.Collections;
using System.Diagnostics;
using System.Net.Mail;
using System.Net.Mime;
using System.ComponentModel;
using System.Net;
namespace Rendition {
	/// <summary>
	/// Low level email com (as low as this program goes)
	/// </summary>
	public static class EmailClient {
		/// <summary>
		/// Sends the message.
		/// </summary>
		/// <param name="from">From.</param>
		/// <param name="to">To.</param>
		/// <param name="cc">The cc.</param>
		/// <param name="bcc">The BCC.</param>
		/// <param name="subject">The subject.</param>
		/// <param name="HtmlMessage">The HTML message.</param>
		/// <param name="textMessage">The text message.</param>
		/// <param name="isHtml">if set to <c>true</c> [is HTML].</param>
		/// <param name="sendCallback">The send callback.</param>
		/// <param name="asyncCallbackId">The async callback id.</param>
		public static void SendMessage(
		MailAddress from,MailAddressCollection to,
		MailAddressCollection cc,MailAddressCollection bcc,
		string subject,string HtmlMessage,string textMessage,
		bool isHtml, SendCompletedEventHandler sendCallback, string asyncCallbackId){
			MailMessage mailMsg = new MailMessage();
			for(int x=0;to.Count>x;x++){
				mailMsg.To.Add(to[x]);
			}
			if(cc!=null){
				for(int x=0;cc.Count>x;x++) {
					mailMsg.CC.Add(cc[x]);
				}
			}
			if(bcc!=null) {
				for(int x=0;bcc.Count>x;x++) {
					mailMsg.Bcc.Add(bcc[x]);
				}
			}
			mailMsg.Subject = subject;
			mailMsg.IsBodyHtml = isHtml;
			mailMsg.From = from;
			mailMsg.BodyEncoding = System.Text.Encoding.UTF8;
			mailMsg.SubjectEncoding=System.Text.Encoding.ASCII;
			if(isHtml){
				mailMsg.Body = HtmlMessage;
			}else{
				mailMsg.Body = textMessage;
			}
			SmtpClient smtpClient = new SmtpClient();
			if(Main.Site.smtp_authenticate){
				NetworkCredential nc=new NetworkCredential();
				nc.UserName=Main.Site.smtp_username;
				nc.Password=Main.Site.smtp_password;
				smtpClient.Credentials=(System.Net.ICredentialsByHost)nc.GetCredential(Main.Site.smtp_server,Convert.ToInt32(Main.Site.smtp_port),"Basic");
			}
			smtpClient.Host = Main.Site.smtp_server;
			smtpClient.Port = Convert.ToInt32(Main.Site.smtp_port);
			try{
				smtpClient.Send(mailMsg);
			}catch(Exception e){
				String.Format("Error sending email: {0}",e.Message).Debug(8);
			}
			return;
		}
	}

}