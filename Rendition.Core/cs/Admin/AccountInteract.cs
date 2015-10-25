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
	public partial class Admin {
		/// <summary>
		/// Gets a new account number.
		/// </summary>
		/// <param name="accountType">Type of the account.</param>
		/// <returns></returns>
		public static Dictionary<string, object> GetNewAccountNumber( string accountType ) {
			Dictionary<string, object> j = new Dictionary<string, object>();
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlCommand cmd = new SqlCommand("getNewAccountNumber @accountType", cn)) {
                    cmd.Parameters.Add("@accountType", SqlDbType.Int).Value = Convert.ToInt32(accountType);
                    using(SqlDataReader r = cmd.ExecuteReader()) {
                        while(r.Read()) {
                            j.Add("userId", r.GetInt32(0));
                            j.Add("error", 0);
                            j.Add("description", "");
                            return j;
                        }
                    }
                }
            }
			j.Add( "userId", -1 );
			j.Add( "error", 1 );
			j.Add( "description", "SP getNewAccountNumber failed to produce an account number." );
			return j;
		}
	}
}
