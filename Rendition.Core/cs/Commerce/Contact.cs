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
using Microsoft.SqlServer.Server;
namespace Rendition {
	public partial class Commerce {
		/// <summary>
		/// An Address with shipping information, potential rates and shipping cost estimates.
		/// </summary>
		public class Address {
            #region Instance Properties
            /// <summary>
			/// The id of the Address.
			/// </summary>
            public Guid Id { get; internal set; }
			/// <summary>
			/// First name.
			/// </summary>
            public string FirstName { get; internal set; }
			/// <summary>
			/// Last name.
			/// </summary>
            public string LastName { get; internal set; }
			/// <summary>
			/// Address line 1.
			/// </summary>
            public string Address1 { get; internal set; }
			/// <summary>
			/// Address line 2.
			/// </summary>
            public string Address2 { get; internal set; }
			/// <summary>
			/// City.
			/// </summary>
            public string City { get; internal set; }
			/// <summary>
			/// State.
			/// </summary>
            public string State { get; internal set; }
			/// <summary>
			/// Zip code.
			/// </summary>
            public string Zip { get; internal set; }
			/// <summary>
			/// Country.
			/// </summary>
            public string Country { get; internal set; }
			/// <summary>
			/// Home phone.
			/// </summary>
            public string HomePhone { get; internal set; }
			/// <summary>
			/// Work phone.
			/// </summary>
            public string WorkPhone { get; internal set; }
			/// <summary>
			/// Email Address.
			/// </summary>
            public string Email { get; internal set; }
			/// <summary>
			/// Special shipping instructions.
			/// </summary>
            public string SpecialInstructions { get; internal set; }
			/// <summary>
			/// Comments.
			/// </summary>
            public string Comments { get; internal set; }
			/// <summary>
			/// Send shipment updates via email when the status changes.
			/// </summary>
            public bool SendShipmentUpdates { get; internal set; }
			/// <summary>
			/// It's ok to email this Address ads.
			/// </summary>
            public bool EmailAds { get; internal set; }
			/// <summary>
			/// The selected rate of this Address.
			/// </summary>
            public Rate Rate { get; internal set; }
			/// <summary>
			/// The date this Address was created.
			/// </summary>
            public DateTime DateCreated { get; internal set; }
			/// <summary>
			/// Company.
			/// </summary>
			public string Company { get; internal set; }
			/// <summary>
			/// Estimated shipping cost.
			/// </summary>
            public decimal EstShippingCost { get; internal set; }
			/// <summary>
			/// List of avaliable shipping rates for this Address.
			/// </summary>
            public List<Rate> Rates { get; internal set; }
            #endregion
            #region Static Methods
            /// <summary>
            /// updates a contact in the database
            /// </summary>
            /// <param name="args">JSON Object </param>
            /// <returns>{error:0,desc:""}</returns>
            public static Dictionary<string, object> UpdateContact(Dictionary<string, object> args) {
                return UpdateContactWithTransaction(args, null, null);
            }
            /// <summary>
            /// updates a contact in the database within a transaction
            /// </summary>
            /// <param name="args">JSON Object containing:
            /// contactId,userId,firstName,lastName,address1,address2,city,
            /// state,zip,country,homePhone,workPhone,email,specialInstructions,comments,
            /// sessionId,sendShipmentUpdates,emailads,company,defaultContact,rate</param>
            /// <param name="cn">The connection being used.</param>
            /// <param name="trans">The transaction being used.</param>
            /// <returns>{error:0,desc:""}</returns>
            public static Dictionary<string, object> UpdateContactWithTransaction(Dictionary<string, object> args, SqlConnection cn, SqlTransaction trans) {
                ("FUNCTION /w SP updateContact").Debug(10);
                Dictionary<string, object> j = new Dictionary<string, object>();
                string commandText = @"dbo.updateContact @contactId,
			@userId,@FirstName,@LastName,@Address1,@Address2,@City,@State,@Zip,@Country,@homePhone,
			@workPhone,@email,@SpecialInstructions,@Comments,@sessionId,@sendShipmentUpdates,@emailads,
			@rate,@Company";
                SqlCommand cmd;
                if(cn == null) {
                    cmd = new SqlCommand(commandText, Site.SqlConnection);
                } else {
                    cmd = new SqlCommand(commandText, cn, trans);
                }
                try {
                    int rateId = -1;
                    cmd.Parameters.Add("@contactId", SqlDbType.UniqueIdentifier).Value = new Guid(Convert.ToString(args["contactId"]));
                    cmd.Parameters.Add("@sessionId", SqlDbType.UniqueIdentifier).Value = new Guid(Convert.ToString(args["sessionId"]));
                    if(args.ContainsKey("userId")) {
                        cmd.Parameters.Add("@userId", SqlDbType.Int).Value = int.Parse(args["userId"].ToString());
                    } else {
                        cmd.Parameters.Add("@userId", SqlDbType.Int).Value = -1;
                    }
                    if(args.ContainsKey("FirstName")) {
                        cmd.Parameters.Add("@FirstName", SqlDbType.VarChar).Value = args["FirstName"].ToString().MaxLength(100, true);
                    } else {
                        cmd.Parameters.Add("@FirstName", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("LastName")) {
                        cmd.Parameters.Add("@LastName", SqlDbType.VarChar).Value = args["LastName"].ToString().MaxLength(100, true);
                    } else {
                        cmd.Parameters.Add("@LastName", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("Address1")) {
                        cmd.Parameters.Add("@Address1", SqlDbType.VarChar).Value = args["Address1"].ToString().MaxLength(25, true);
                    } else {
                        cmd.Parameters.Add("@Address1", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("Address2")) {
                        cmd.Parameters.Add("@Address2", SqlDbType.VarChar).Value = args["Address2"].ToString().MaxLength(25, true);
                    } else {
                        cmd.Parameters.Add("@Address2", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("City")) {
                        cmd.Parameters.Add("@City", SqlDbType.VarChar).Value = args["City"].ToString().MaxLength(50, true);
                    } else {
                        cmd.Parameters.Add("@City", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("State")) {
                        cmd.Parameters.Add("@State", SqlDbType.VarChar).Value = args["State"].ToString().MaxLength(100, true);
                    } else {
                        cmd.Parameters.Add("@State", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("Zip")) {
                        cmd.Parameters.Add("@Zip", SqlDbType.VarChar).Value = args["Zip"].ToString().MaxLength(20, true);
                    } else {
                        cmd.Parameters.Add("@Zip", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("Country")) {
                        cmd.Parameters.Add("@Country", SqlDbType.VarChar).Value = args["Country"].ToString().MaxLength(100, true);
                    } else {
                        cmd.Parameters.Add("@Country", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("homePhone")) {
                        cmd.Parameters.Add("@homePhone", SqlDbType.VarChar).Value = args["HomePhone"].ToString().MaxLength(25, true);
                    } else {
                        cmd.Parameters.Add("@homePhone", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("workPhone")) {
                        cmd.Parameters.Add("@workPhone", SqlDbType.VarChar).Value = args["WorkPhone"].ToString().MaxLength(25, true);
                    } else {
                        cmd.Parameters.Add("@workPhone", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("email")) {
                        cmd.Parameters.Add("@email", SqlDbType.VarChar).Value = args["Email"].ToString().MaxLength(100, true);
                    } else {
                        cmd.Parameters.Add("@email", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("SpecialInstructions")) {
                        cmd.Parameters.Add("@SpecialInstructions", SqlDbType.VarChar).Value = args["SpecialInstructions"].ToString().MaxLength(10000, true);
                    } else {
                        cmd.Parameters.Add("@SpecialInstructions", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("Comments")) {
                        cmd.Parameters.Add("@Comments", SqlDbType.VarChar).Value = args["Comments"].ToString().MaxLength(10000, true);
                    } else {
                        cmd.Parameters.Add("@Comments", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("sendShipmentUpdates")) {
                        cmd.Parameters.Add("@sendShipmentUpdates", SqlDbType.Bit).Value = Convert.ToBoolean(args["SendShipmentUpdates"]);
                    } else {
                        cmd.Parameters.Add("@sendShipmentUpdates", SqlDbType.Bit).Value = false;
                    }
                    if(args.ContainsKey("emailads")) {
                        cmd.Parameters.Add("@emailads", SqlDbType.Bit).Value = Convert.ToBoolean(args["EmailAds"]);
                    } else {
                        cmd.Parameters.Add("@emailads", SqlDbType.Bit).Value = false;
                    }
                    if(args.ContainsKey("Company")) {
                        cmd.Parameters.Add("@Company", SqlDbType.VarChar).Value = args["Company"].ToString().MaxLength(50, true);
                    } else {
                        cmd.Parameters.Add("@Company", SqlDbType.VarChar).Value = "";
                    }
                    if(args.ContainsKey("RateId")) {
                        int.TryParse(args["RateId"].ToString(), out rateId);
                        cmd.Parameters.Add("@rate", SqlDbType.Int).Value = rateId;
                    } else {
                        cmd.Parameters.Add("@rate", SqlDbType.Int).Value = -1;
                    }
                    cmd.ExecuteNonQuery();
                    cmd.Dispose();
                    j.Add("error", 0);
                    j.Add("description", "");
                    return j;
                } catch(Exception e) {
                    j.Add("error", -1);
                    j.Add("description", e.Message);
                    return j;
                }
            }
            /// <summary>
			/// Creates a blank Address.
			/// </summary>
			/// <returns></returns>
			public static Address CreateAddress() {
				return new Address(
				Guid.NewGuid(),
				"", "", "", "", "", "", Main.Site.default_zip,
				Main.Site.default_ship_country, "", "",
				"", "", "",
				Main.Site.site_send_shipment_update_email,
				true,
				Rendition.Main.Site.Rates.List.Find( delegate( Rendition.Commerce.Rate rate ) {
					return Rendition.Main.Site.default_rateId == rate.Id;
				} ),
				DateTime.Now,
				"" );
			}
            #endregion
            #region Instance Methods
            /// <summary>
			/// Returns a <see cref="System.String"/> that represents this instance.
			/// </summary>
			/// <returns>
			/// A <see cref="System.String"/> that represents this instance.
			/// </returns>
			public override string ToString() {
				return FirstName + " " + LastName + " " + Address1 + " " +
				 Address2 + " " + City + " " + State + ( string )Utilities.Iif( Zip.Length > 0, ", ", "" ) + Zip;
			}
			/// <summary>
			/// Saves the Address.
			/// </summary>
			/// <param name="session">The session.</param>
			public void Save( Session session ){
				Save( session, null, null );
			}
			/// <summary>
			/// Saves the Address.
			/// </summary>
			/// <param name="session">The session.</param>
			/// <param name="cn">The cn.</param>
			/// <param name="trans">The trans.</param>
			private void Save( Session session, SqlConnection cn, SqlTransaction trans ) {
				Dictionary<string, object> args = new Dictionary<string, object>();
				args.Add( "sessionId", session.Id.ToString() );
				args.Add( "contactId", Id.ToString() );
				args.Add( "userId", session.UserId );
				args.Add( "FirstName", FirstName );
				args.Add( "LastName", LastName );
				args.Add( "Address1", Address1 );
				args.Add( "Address2", Address2 );
				args.Add( "City", City );
				args.Add( "State", State );
				args.Add( "Zip", Zip );
				args.Add( "Country", Country );
				args.Add( "HomePhone", HomePhone );
				args.Add( "WorkPhone", WorkPhone );
				args.Add( "Email", Email );
				args.Add( "SpecialInstructions", SpecialInstructions );
				args.Add( "Comments", Comments );
				args.Add( "SendShipmentUpdates", SendShipmentUpdates );
				args.Add( "EmailAds", EmailAds );
				args.Add( "Rate", Rate );
				args.Add( "DateCreated", DateCreated );
				args.Add( "Company", Company );
				UpdateContactWithTransaction( args, cn, trans );
			}
            /// <summary>
            /// Creates an HTML table with the Address information.
            /// </summary>
            /// <returns></returns>
            public string CreateAddressBlock() {
                return @"<table>
				<tr>
					<th>
						First Name
					</th>
					<td>
						" + FirstName + @"
					</td>
				</tr>
				<tr>
					<th>
						Last Name
					</th>
					<td>
						" + LastName + @"
					</td>
				</tr>
				<tr>
					<th>
						Address
					</th>
					<td>
						" + Address1 + @"
					</td>
				</tr>
				<tr>
					<th>
						Address 2
					</th>
					<td>
						" + Address2 + @"
					</td>
				</tr>
				<tr>
					<th>
						City
					</th>
					<td>
						" + City + @"
					</td>
				</tr>
				<tr>
					<th>
						State
					</th>
					<td>
						" + State + @"
					</td>
				</tr>
				<tr>
					<th>
						Zip
					</th>
					<td>
						" + Zip + @"
					</td>
				</tr>
				<tr>
					<th>
						Country
					</th>
					<td>
						" + Country + @"
					</td>
				</tr>
				<tr>
					<th>
						Home Phone
					</th>
					<td>
						" + HomePhone + @"
					</td>
				</tr>
				<tr>
					<th>
						Work Phone
					</th>
					<td>
						" + WorkPhone + @"
					</td>
				</tr>
				<tr>
					<th>
						Email
					</th>
					<td>
						" + Email + @"
					</td>
				</tr>
				<tr>
					<th>
						Special Instructions
					</th>
					<td>
						" + SpecialInstructions + @"
					</td>
				</tr>
				<tr>
					<th>
						Comments
					</th>
					<td>
						" + Comments + @"
					</td>
				</tr>
				<tr>
					<th>
						Send Shipment Updates
					</th>
					<td>
						" + SendShipmentUpdates.ToString() + @"
					</td>
				</tr>
				<tr>
					<th>
						Email Ads
					</th>
					<td>
						" + EmailAds + @"
					</td>
				</tr>
				<tr>
					<th>
						Date Created
					</th>
					<td>
						" + DateCreated.ToString() + @"
					</td>
				</tr>
				<tr>
					<th>
						Company
					</th>
					<td>
						" + Company + @"
					</td>
				</tr>";

            }
            /// <summary>
            /// Creates a short Address block seperated by seperator character.
            /// </summary>
            /// <param name="seperatorCharacter">The seperator character.</param>
            /// <returns></returns>
            public string CreateShortAddressBlock(string seperatorCharacter) {
                return FirstName + seperatorCharacter +
                LastName + seperatorCharacter +
                Address1 + seperatorCharacter +
                Address2 + seperatorCharacter +
                City + seperatorCharacter +
                State + seperatorCharacter +
                Zip + seperatorCharacter +
                Country + seperatorCharacter;
            }
            #endregion
            #region Constructors
            /// <summary>
			/// Initializes a new instance of the <see cref="Address"/> class.
			/// </summary>
			/// <param name="f_id">The id of the Address.</param>
			/// <param name="cn">SQL connection.</param>
			/// <param name="trn">The TRN.</param>
			public Address( Guid f_id, SqlConnection cn, SqlTransaction trn ) {
                this.Rates = new List<Rate>();
                EstShippingCost = 0;
				SqlCommand cmd;
				if( cn == null ) {
					cmd = new SqlCommand( "dbo.getAddress @addressId", Site.SqlConnection );
				} else {
					cmd = new SqlCommand( "dbo.getAddress @addressId", cn, trn );
				}
				cmd.Parameters.Add( "@addressId", SqlDbType.UniqueIdentifier ).Value = f_id;
				using( SqlDataReader d = cmd.ExecuteReader() ) {
					if( d.HasRows ) {
						d.Read();
						Id = d.GetGuid( 0 );
						FirstName = d.GetString( 1 );
						LastName = d.GetString( 2 );
						Address1 = d.GetString( 3 );
						Address2 = d.GetString( 4 );
						City = d.GetString( 5 );
						State = d.GetString( 6 );
						Zip = d.GetString( 7 );
						Country = d.GetString( 8 );
						HomePhone = d.GetString( 9 );
						WorkPhone = d.GetString( 10 );
						Email = d.GetString( 11 );
						SpecialInstructions = d.GetString( 12 );
						Comments = d.GetString( 13 );
						SendShipmentUpdates = d.GetBoolean( 14 );
						EmailAds = d.GetBoolean( 15 );
						Rate = Main.Site.Rates.List.Find( delegate( Commerce.Rate t ) {
							return t.Id == d.GetInt32( 16 );
						} );
						DateCreated = d.GetDateTime( 17 );
						Company = d.GetString( 18 );
						d.Close();
					}
				}
				cmd.Dispose();
				return;
			}
			/// <summary>
			/// Initializes a new instance of the <see cref="Address"/> class.
			/// </summary>
			public Address(){
                this.Rates = new List<Rate>();
                EstShippingCost = 0;
				CreateAddress();
			}
			/// <summary>
			/// Initializes a new instance of the <see cref="Address"/> class.
			/// </summary>
			/// <param name="f_id">The f_id.</param>
			/// <param name="f_firstName">Name of the f_first.</param>
			/// <param name="f_lastName">Name of the f_last.</param>
			/// <param name="f_address1">The f_address1.</param>
			/// <param name="f_address2">The f_address2.</param>
			/// <param name="f_city">The f_city.</param>
			/// <param name="f_state">The f_state.</param>
			/// <param name="f_zip">The f_zip.</param>
			/// <param name="f_country">The f_country.</param>
			/// <param name="f_homePhone">The f_home phone.</param>
			/// <param name="f_workPhone">The f_work phone.</param>
			/// <param name="f_email">The f_email.</param>
			/// <param name="f_specialInstructions">The f_special instructions.</param>
			/// <param name="f_comments">The f_comments.</param>
			/// <param name="f_sendshipmentupdates">if set to <c>true</c> [f_sendshipmentupdates].</param>
			/// <param name="f_emailAds">if set to <c>true</c> [f_email ads].</param>
			/// <param name="f_rate">The f_rate.</param>
			/// <param name="f_dateCreated">The f_date created.</param>
			/// <param name="f_company">The f_company.</param>
			public Address(
				Guid f_id, string f_firstName, string f_lastName, string f_address1, string f_address2, string f_city,
				string f_state, string f_zip, string f_country, string f_homePhone, string f_workPhone, string f_email, string f_specialInstructions,
				string f_comments, bool f_sendshipmentupdates, bool f_emailAds, Rate f_rate, DateTime f_dateCreated, string f_company ) {
                this.Rates = new List<Rate>();
                EstShippingCost = 0;
				Id = f_id;
				FirstName = f_firstName;
				LastName = f_lastName;
				Address1 = f_address1;
				Address2 = f_address2;
				City = f_city;
				State = f_state;
				Zip = f_zip;
				Country = f_country;
				HomePhone = f_homePhone;
				WorkPhone = f_workPhone;
				Email = f_email;
				SpecialInstructions = f_specialInstructions;
				Comments = f_comments;
				SendShipmentUpdates = f_sendshipmentupdates;
				EmailAds = f_emailAds;
				Rate = f_rate;
				DateCreated = f_dateCreated;
				Company = f_company;
			}
            #endregion
		}
	}
}
