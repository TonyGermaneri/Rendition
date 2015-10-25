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
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using Microsoft.SqlServer.Server;
namespace Rendition {
	public partial class Commerce {
        #region Static Methods
        #region General Ledger
        /// <summary>
        /// Posts the journal entries.
        /// This method might work but it has never been
        /// tested and is not impmented in Rendition 1.0
        /// </summary>
        /// <param name="journalEntries">The journal entries.
        /// Must be a JSON object in this format:
        ///		{
        /// 		userId: int userId,
        /// 		debit: float debit,
        /// 		credit: float credit,
        /// 		date: string date (MM/DD/YYYY),
        /// 		comments: string comments
        /// 	}
        /// </param>
        /// <returns>{error:0,desc:"error description"}</returns>
        public static Dictionary<string, object> PostJournalEntries(List<object> journalEntries) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            SqlConnection cn = Site.CreateConnection(true, true);
            cn.Open();
            SqlTransaction trans = cn.BeginTransaction("postJournalEntries");
            bool commitTrans = true;
            string desc = "";
            string commandText = @"insert into generalLedger 
			(generalLedgerId,refId,refType,creditRecord,debitRecord,
			amount,userId,addDate,reference,generalLedgerInsertId) values
			(
				newId(),
				convert(varchar(50),newId()),
				10/*manual*/,
				case when @debit > 0 then convert(bit,0) else convert(bit,1) end,
				case when @credit > 0 then convert(bit,0) else convert(bit,1) end,
				case when @debit > 0 then @debit else @credit end,
				@userId,
				@date,
				@reference,
				newId()
			)";
            int error = 0;
            try {
                foreach(Dictionary<string, object> entry in journalEntries) {
                    using(SqlCommand cmd = cn.CreateCommand()) {
                        cmd.CommandText = commandText;
                        cmd.CommandType = CommandType.Text;
                        cmd.Transaction = trans;
                        cmd.Parameters.Add("@userId", SqlDbType.Int).Value = Convert.ToInt32(entry["userId"]);
                        cmd.Parameters.Add("@debit", SqlDbType.Money).Value = Convert.ToDecimal(entry["debit"]);
                        cmd.Parameters.Add("@credit", SqlDbType.Money).Value = Convert.ToDecimal(entry["credit"]);
                        cmd.Parameters.Add("@date", SqlDbType.DateTime).Value = Convert.ToDateTime(entry["date"]);
                        cmd.Parameters.Add("@reference", SqlDbType.VarChar).Value = entry["comments"];
                        cmd.ExecuteNonQuery();
                    }
                }
            } catch(Exception ex) {
                error = -1;
                desc = ex.Message;
                commitTrans = false;
            }
            if(commitTrans) {
                trans.Commit();
                j.Add("error", 0);
                j.Add("description", "");
                return j;
            } else {
                trans.Rollback("postJournalEntries");
                j.Add("error", error);
                j.Add("description", desc);
                return j;
            }
        }
        /// <summary>
        /// Posts payments to general ledger.
        /// </summary>
        /// <param name="ids">The payment ids.</param>
        /// <param name="postingDate">The posting date.</param>
        /// <param name="postingNotes">The posting notes.</param>
        /// <param name="preview">if set to <c>true</c> [preview].</param>
        /// <returns>{error:0,desc:"error description",preview:false,
        /// generalLedgerEntries:{
        ///		drDate,
        ///		drDetails,
        ///		drReference,
        ///		drAmount,
        ///		crDate,
        ///		crDetails,
        ///		crReference,
        ///		crAmount
        /// },
        /// rawGL:{
        ///		generalLedgerId,
        ///		creditRecord,
        ///		debitRecord,
        ///		amount,
        ///		userId,
        ///		termId,
        ///		addDate,
        ///		reference,
        ///		orderId,
        ///		generalLedgerId
        /// },
        /// rawGLDetail:{
        ///		generalLedgerDetailId,
        ///		generalLedgerId,
        ///		refId,
        ///		refType
        /// }
        /// }.</returns>
        public static Dictionary<string, object> PostPaymentsToGeneralLedger(List<object> ids, string postingDate, string postingNotes, bool preview) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            List<object> accountantReadable = new List<object>();
            List<object> rawGL = new List<object>();
            List<object> rawGLDetail = new List<object>();
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlTransaction trans = cn.BeginTransaction("paymentPosting")) {
                    List<Order> orders = new List<Order>();
                    int error = 0;
                    string desc = "";
                    decimal crTotal = 0;
                    decimal drTotal = 0;
                    DateTime _postingDate;
                    if(!DateTime.TryParse(postingDate, out _postingDate)) {
                        j.Add("preview", preview);
                        j.Add("error", -2);
                        j.Add("description", "Posting date is not in the correct format.");
                    }
                    if(ids.Count == 0) {
                        j.Add("preview", preview);
                        j.Add("error", -1);
                        j.Add("description", "No orders selected.");
                    };
                    List<SqlDataRecord> rowData = new List<SqlDataRecord>();
                    SqlMetaData[] hashTable = { 
						new SqlMetaData("keyName",SqlDbType.VarChar,100),
						new SqlMetaData("keyValue",SqlDbType.Variant),
						new SqlMetaData("primary_key",SqlDbType.Bit),
						new SqlMetaData("dataType",SqlDbType.VarChar,50),
						new SqlMetaData("dataLength",SqlDbType.Int),
						new SqlMetaData("varCharMaxValue",SqlDbType.VarChar,-1)
					};
                    StringBuilder s = new StringBuilder();
                    foreach(object id in ids) {
                        SqlDataRecord rec = new SqlDataRecord(hashTable);
                        rec.SetValue(0, "paymentId");
                        rec.SetValue(1, (new Guid((string)id)).ToString());
                        rec.SetBoolean(2, false);
                        rec.SetString(3, "uniqueidentifier");
                        rec.SetValue(4, 0);
                        rowData.Add(rec);
                    }

                    using(SqlCommand cmd = cn.CreateCommand()) {
                        cmd.Transaction = trans;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "dbo.postPaymentsToGeneralLedger";

                        cmd.Parameters.Add("@paymentMethodIds", SqlDbType.Structured);
                        cmd.Parameters["@paymentMethodIds"].Direction = ParameterDirection.Input;
                        cmd.Parameters["@paymentMethodIds"].Value = rowData;

                        cmd.Parameters.Add("@unique_site_id", SqlDbType.UniqueIdentifier);
                        cmd.Parameters["@unique_site_id"].Direction = ParameterDirection.Input;
                        cmd.Parameters["@unique_site_id"].Value = new Guid(Site.Id.ToString());

                        cmd.Parameters.Add("@postingDate", SqlDbType.DateTime);
                        cmd.Parameters["@postingDate"].Direction = ParameterDirection.Input;
                        cmd.Parameters["@postingDate"].Value = _postingDate;

                        cmd.Parameters.Add("@referenceNotes", SqlDbType.VarChar);
                        cmd.Parameters["@referenceNotes"].Direction = ParameterDirection.Input;
                        cmd.Parameters["@referenceNotes"].Value = postingNotes;

                        using(SqlDataReader u = cmd.ExecuteReader()) {
                            u.Read();
                            error = u.GetInt32(0);
                            desc = u.GetString(1);
                            drTotal = u.GetDecimal(2);
                            crTotal = u.GetDecimal(3);
                            if(error != 0) {
                                j.Add("error", error);
                                j.Add("description", desc);
                            } else {
                                j.Add("error", 0);
                                j.Add("description", "");
                            }
                            j.Add("drTotal", drTotal);
                            j.Add("crTotal", crTotal);
                            u.NextResult();
                            /* second batch is an accountant readable GL table - the result of the table vars in the SP
                             * but not the literal values in the GL, the literal values are next
                             */
                            while(u.Read()) {
                                /* looks like: userId, handle, addDate, debit, credit, notes */
                                Dictionary<string, object> row = new Dictionary<string, object>();
                                row.Add("userId", u.GetInt32(0));
                                row.Add("handle", u.GetString(1));
                                row.Add("addDate", u.GetDateTime(2));
                                row.Add("debit", u.GetDecimal(3));
                                row.Add("credit", u.GetDecimal(4));
                                row.Add("notes", u.GetString(5));
                                accountantReadable.Add(row);
                            }
                            /* third batch is the GL entries in the format of the generalLedger table */
                            u.NextResult();
                            while(u.Read()) {
                                Dictionary<string, object> row = new Dictionary<string, object>();
                                row.Add("generalLedgerId", u.GetGuid(0));
                                row.Add("refId", u.GetString(1));
                                row.Add("refType", u.GetInt32(2));
                                row.Add("creditRecord", u.GetBoolean(3));
                                row.Add("debitRecord", u.GetBoolean(4));
                                row.Add("amount", u.GetDecimal(5));
                                row.Add("userId", u.GetInt32(6));
                                row.Add("addDate", u.GetDateTime(7));
                                row.Add("reference", u.GetString(8));
                                row.Add("generalLedgerInsertId", u.GetGuid(9));
                                rawGL.Add(row);
                            }
                            j.Add("generalLedgerEntries", accountantReadable);
                            j.Add("rawGL", rawGL);
                            j.Add("preview", preview);
                        }
                    }
                    if(preview) {
                        trans.Rollback("paymentPosting");
                    } else {
                        trans.Commit();
                    }
                }
            }
            return j;
        }
        /// <summary>
        /// Posts orders to general ledger.
        /// </summary>
        /// <param name="ids">The order ids.</param>
        /// <param name="postingDate">The posting date.</param>
        /// <param name="postingNotes">The posting notes.</param>
        /// <param name="preview">if set to <c>true</c> [preview].</param>
        /// <returns>{error:0,desc:"error description",preview:false,
        /// generalLedgerEntries:{
        ///		drDate,
        ///		drDetails,
        ///		drReference,
        ///		drAmount,
        ///		crDate,
        ///		crDetails,
        ///		crReference,
        ///		crAmount
        /// },
        /// rawGL:{
        ///		generalLedgerId,
        ///		creditRecord,
        ///		debitRecord,
        ///		amount,
        ///		userId,
        ///		termId,
        ///		addDate,
        ///		reference,
        ///		orderId,
        ///		generalLedgerId
        /// },
        /// rawGLDetail:{
        ///		generalLedgerDetailId,
        ///		generalLedgerId,
        ///		refId,
        ///		refType
        /// }
        /// }.</returns>
        public static Dictionary<string, object> PostOrdersToGeneralLedger(List<object> ids, string postingDate, string postingNotes, bool preview) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            List<object> accountantReadable = new List<object>();
            List<object> rawGL = new List<object>();
            List<object> rawGLDetail = new List<object>();
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                using(SqlTransaction trans = cn.BeginTransaction("orderPosting")) {
                    List<Order> orders = new List<Order>();
                    int error = 0;
                    string desc = "";
                    decimal crTotal = 0;
                    decimal drTotal = 0;
                    DateTime _postingDate;
                    if(!DateTime.TryParse(postingDate, out _postingDate)) {
                        j.Add("preview", preview);
                        j.Add("error", -2);
                        j.Add("description", "Posting date is not in the correct format.");
                    }
                    if(ids.Count == 0) {
                        j.Add("preview", preview);
                        j.Add("error", -1);
                        j.Add("description", "No orders selected.");
                    };
                    List<SqlDataRecord> rowData = new List<SqlDataRecord>();
                    SqlMetaData[] hashTable = { 
						new SqlMetaData("keyName",SqlDbType.VarChar,100),
						new SqlMetaData("keyValue",SqlDbType.Variant),
						new SqlMetaData("primary_key",SqlDbType.Bit),
						new SqlMetaData("dataType",SqlDbType.VarChar,50),
						new SqlMetaData("dataLength",SqlDbType.Int),
						new SqlMetaData("varCharMaxValue",SqlDbType.VarChar,-1)
					};
                    StringBuilder s = new StringBuilder();
                    foreach(object id in ids) {
                        SqlDataRecord rec = new SqlDataRecord(hashTable);
                        rec.SetValue(0, "orderId");
                        rec.SetValue(1, Convert.ToInt32(id));
                        rec.SetBoolean(2, false);
                        rec.SetString(3, "int");
                        rec.SetValue(4, 8);
                        rowData.Add(rec);
                    }

                    using(SqlCommand cmd = cn.CreateCommand()) {
                        cmd.Transaction = trans;
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.CommandText = "dbo.postOrdersToGeneralLedger";

                        cmd.Parameters.Add("@orderIds", SqlDbType.Structured);
                        cmd.Parameters["@orderIds"].Direction = ParameterDirection.Input;
                        cmd.Parameters["@orderIds"].Value = rowData;

                        cmd.Parameters.Add("@unique_site_id", SqlDbType.UniqueIdentifier);
                        cmd.Parameters["@unique_site_id"].Direction = ParameterDirection.Input;
                        cmd.Parameters["@unique_site_id"].Value = new Guid(Site.Id.ToString());

                        cmd.Parameters.Add("@postingDate", SqlDbType.DateTime);
                        cmd.Parameters["@postingDate"].Direction = ParameterDirection.Input;
                        cmd.Parameters["@postingDate"].Value = _postingDate;

                        cmd.Parameters.Add("@referenceNotes", SqlDbType.VarChar);
                        cmd.Parameters["@referenceNotes"].Direction = ParameterDirection.Input;
                        cmd.Parameters["@referenceNotes"].Value = postingNotes;

                        using(SqlDataReader u = cmd.ExecuteReader()) {
                            u.Read();
                            error = u.GetInt32(0);
                            desc = u.GetString(1);
                            drTotal = u.GetDecimal(2);
                            crTotal = u.GetDecimal(3);
                            if(error != 0) {
                                j.Add("error", error);
                                j.Add("description", desc);
                            } else {
                                j.Add("error", 0);
                                j.Add("description", "");
                            }
                            j.Add("drTotal", drTotal);
                            j.Add("crTotal", crTotal);
                            u.NextResult();
                            /* second batch is an accountant readable GL table - the result of the table vars in the SP
                             * but not the literal values in the GL, the literal values are next
                             */
                            while(u.Read()) {
                                /* looks like: userId, handle, addDate, debit, credit, notes */
                                Dictionary<string, object> row = new Dictionary<string, object>();
                                row.Add("userId", u.GetInt32(0));
                                row.Add("handle", u.GetString(1));
                                row.Add("addDate", u.GetDateTime(2));
                                row.Add("debit", u.GetDecimal(3));
                                row.Add("credit", u.GetDecimal(4));
                                row.Add("notes", u.GetString(5));
                                accountantReadable.Add(row);
                            }
                            /* third batch is the GL entries in the format of the generalLedger table */
                            u.NextResult();
                            while(u.Read()) {
                                Dictionary<string, object> row = new Dictionary<string, object>();
                                row.Add("generalLedgerId", u.GetGuid(0));
                                row.Add("refId", u.GetString(1));
                                row.Add("refType", u.GetInt32(2));
                                row.Add("creditRecord", u.GetBoolean(3));
                                row.Add("debitRecord", u.GetBoolean(4));
                                row.Add("amount", u.GetDecimal(5));
                                row.Add("userId", u.GetInt32(6));
                                row.Add("addDate", u.GetDateTime(7));
                                row.Add("reference", u.GetString(8));
                                row.Add("generalLedgerInsertId", u.GetGuid(9));
                                rawGL.Add(row);
                            }
                            j.Add("generalLedgerEntries", accountantReadable);
                            j.Add("rawGL", rawGL);
                            j.Add("preview", preview);
                        }
                    }
                    if(preview) {
                        trans.Rollback("orderPosting");
                    } else {
                        trans.Commit();
                    }
                }
            }
            return j;
        }
        #endregion
        #endregion
	}
}
