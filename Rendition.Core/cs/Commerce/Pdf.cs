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
using iTextSharp.text;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text.pdf;
using System.IO;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Text.RegularExpressions;
using System.Web;
using System.Data;
namespace Rendition {
	public partial class Commerce {
        /// <summary>
        /// PDF template rendering class
        /// </summary>
        public class Pdf {
            #region PDF Field Class
            /// <summary>
            /// field variable in PDF rendering system.
            /// </summary>
            private class AField {
                public Rectangle Rect = null;
                public string Value = "";
                public int Page = -1;
                public int Record = -1;
                public bool IsImage = false;
                public string PDFKey = "";
                public string FontFamily = "Helvetica";
                public float FontSize = 16f;
                public double Alignment = 0d;
                public float R = 0f;
                public float G = 0f;
                public float B = 0f;
            }
            #endregion
            #region Private Static Methods
            /* TODO: See if PDF->requestReplace is secure, seems fishy */
            /// <summary>
            /// Replaces regex pattern &lt;#([^#]+)#&gt; in the query with Request[xxx] variable or one of the queryArguments.  Very dangerous! 
            /// </summary>
            /// <param name="query">The query.</param>
            /// <param name="queryArguments">The query arguments.</param>
            /// <returns>Resulting rendered string</returns>
            private static string RequestReplace(string query, Dictionary<string, object> queryArguments) {
                Regex req = new Regex("<#[^#]+#>");
                MatchCollection rpls = req.Matches(query);
                foreach(Match m in rpls) {
                    string reqName = Regex.Replace(m.Value, "<#([^#]+)#>", "$1");
                    if(queryArguments.Count > 0) {
                        if(queryArguments.ContainsKey(reqName)) {
                            string reqValue = (string)queryArguments[reqName];
                            query = query.Replace(m.Value, reqValue);
                        } else {
                            Exception e = new Exception("This form requires the key " + reqName + " which was not present in the querystring or SQL query");
                            throw e;
                        }
                    } else {
                        string reqValue = HttpContext.Current.Request[reqName];
                        query = query.Replace(m.Value, reqValue);
                    }
                }
                return query;
            }
            /// <summary>
            /// Creates a PDF page from a file and flattens after adding the dynamics from the dictionary queryArguments to it.
            /// </summary>
            /// <param name="filePath">The file path.</param>
            /// <param name="queryArguments">The query arguments.</param>
            /// <returns>rendered pdf page</returns>
            private static MemoryStream MakeStaticPage(string filePath, Dictionary<string, object> queryArguments) {
                ("FUNCTION /w binaryStream makeStaticPage").Debug(10);
                MemoryStream ms = new MemoryStream();
                PdfReader reader = new PdfReader(filePath);
                PdfStamper stamp = new PdfStamper(reader, ms);
                Dictionary<string, AField> docFields = new Dictionary<string, AField>();
                foreach(string fieldKey in stamp.AcroFields.Fields.Keys) {
                    WriteField(0, 2, 0, fieldKey, ref stamp, ref docFields, 1, 1, null, queryArguments);
                }
                WriteAFieldCollection(ref stamp, docFields, filePath);
                stamp.FormFlattening = true;
                stamp.Close();
                reader.Close();
                return ms;
            }
            /// <summary>
            /// Internal font hash table for reading PDF objects
            /// </summary>
            /// <param name="dictValue">The dict value.</param>
            /// <returns>decoded font string</returns>
            private static string GetFontFromDict(string dictValue) {
                string fontName = FontFactory.TIMES;
                switch(dictValue) {
                    case "/Cour": fontName = FontFactory.COURIER; break;
                    case "/CoOb": fontName = FontFactory.COURIER_OBLIQUE; break;
                    case "/CoBo": fontName = FontFactory.COURIER_BOLD; break;
                    case "/CoBO": fontName = FontFactory.COURIER_BOLDOBLIQUE; break;
                    case "/Helv": fontName = FontFactory.HELVETICA; break;
                    case "/HeOb": fontName = FontFactory.HELVETICA_OBLIQUE; break;
                    case "/HeBo": fontName = FontFactory.HELVETICA_BOLD; break;
                    case "/TiRo": fontName = FontFactory.TIMES; break;
                    case "/TiIt": fontName = FontFactory.TIMES_ITALIC; break;
                    case "/TiBo": fontName = FontFactory.TIMES_BOLD; break;
                    case "/TiBI": fontName = FontFactory.TIMES_BOLDITALIC; break;
                    case "/Symb": fontName = FontFactory.SYMBOL; break;
                    case "/ZaDb": fontName = FontFactory.ZAPFDINGBATS; break;
                }
                return fontName;
            }
            /// <summary>
            /// Writes the field into a PDF document from a dataTable.
            /// </summary>
            /// <param name="record">The index of the record.</param>
            /// <param name="fieldType">Type of the field.</param>
            /// <param name="topAdd">The Y coordnate (should be a running total).</param>
            /// <param name="fieldKey">The keyname of the field.</param>
            /// <param name="stamp">PDf stamp object to stamp with.</param>
            /// <param name="docFields">Collection of fields that may go onto the document.</param>
            /// <param name="currentPage">The current page.</param>
            /// <param name="totalPages">The total number of pages.</param>
            /// <param name="dt">The SQL dataTable.</param>
            /// <param name="queryArguments">Collection to replace AField values (from docFields) with.</param>
            private static void WriteField(int record, int fieldType, float topAdd, string fieldKey, ref PdfStamper stamp,
            ref Dictionary<string, AField> docFields, int currentPage, int totalPages, DataTable dt, Dictionary<string, object> queryArguments) {
                string pattern1 = @"(^)(>)(.*$)";
                string pattern2 = @"(.*)>([^;]+);(.*)";
                string rplPat2 = ">$2;";
                string rplPat1 = "$1$3";
                //Never used -> string colPat="$2";
                if(fieldType == 1) {
                    pattern1 = @"(^)(>>)(.*$)";
                    pattern2 = @"(.*)>>([^;]+);(.*)";
                    rplPat2 = ">>$2;";
                }
                foreach(AcroFields.FieldPosition pos in stamp.AcroFields.GetFieldPositions(fieldKey)) {
                    AField f = new AField();
                    f.PDFKey = fieldKey;
                    Rectangle rect = new Rectangle(pos.position);
                    AcroFields.Item item = stamp.AcroFields.GetFieldItem(fieldKey);
                    rect = new Rectangle(pos.position);
                    if(fieldType == 1) {
                        rect.Top += topAdd;
                        rect.Bottom += topAdd;
                    }
                    f.Rect = new Rectangle(rect);
                    f.Page = pos.page;
                    if(fieldKey.StartsWith("_pages")) {
                        f.Value = "Page " + currentPage.ToString() + " of " + totalPages.ToString();
                    } else if(fieldKey.StartsWith(">image") || fieldKey.StartsWith(">>image")) {
                        string v = "";
                        if(Regex.IsMatch(fieldKey, pattern2) && dt != null) {
                            string col = RequestReplace(Regex.Replace(fieldKey, pattern2, "$2"), queryArguments);
                            v = fieldKey.Replace(Regex.Replace(fieldKey, pattern2, rplPat2), dt.Rows[record][col].ToString().Trim());
                        } else {
                            v = fieldKey;
                        }
                        f.Value = RequestReplace(v, queryArguments);
                        f.IsImage = true;
                    } else if(fieldType != 2) {
                        PRAcroForm.FieldInformation info = stamp.Reader.AcroForm.GetField(fieldKey);
                        PdfDictionary dic = info.Info;
                        if(dic.Contains(PdfName.DA)) {
                            PdfString pdfs = dic.Get(PdfName.DA) as PdfString;
                            string s = pdfs.ToString();
                            string[] vals = s.Split(' ');
                            f.FontFamily = vals[0];
                            f.FontSize = (float)Convert.ToInt32(vals[1]);
                            if(vals.Length > 6) {
                                f.R = (float)Convert.ToDouble(vals[3]);
                                f.G = (float)Convert.ToDouble(vals[4]);
                                f.B = (float)Convert.ToDouble(vals[5]);
                            }
                        }
                        double int_alignment = 0;
                        if(dic.Contains(PdfName.Q)) {
                            int_alignment = ((iTextSharp.text.pdf.PdfNumber)(dic.Get(PdfName.Q))).DoubleValue;
                        }
                        f.Alignment = int_alignment;
                        string v = Regex.Replace(fieldKey, pattern1, rplPat1);
                        f.Value = dt.Rows[record][v].ToString();
                    }
                    f.Record = 0;
                    Guid g = Guid.NewGuid();
                    if(pos.page == 1) {
                        docFields.Add(Convert.ToBase64String(g.ToByteArray()) + fieldKey, f);
                    }
                }
            }
            /// <summary>
            /// Writes the a collection of aFields to the destination document.
            /// </summary>
            /// <param name="stamp">The stamp.</param>
            /// <param name="docFields">The doc fields.</param>
            /// <param name="filePath">The file path.</param>
            private static void WriteAFieldCollection(ref PdfStamper stamp, Dictionary<string, AField> docFields, string filePath) {
                foreach(KeyValuePair<string, AField> f in docFields) {
                    if(f.Value.IsImage) {
                        IList<AcroFields.FieldPosition> poes = stamp.AcroFields.GetFieldPositions(f.Key);
                        AcroFields.FieldPosition pos = null;
                        if(poes == null) {
                            pos = stamp.AcroFields.GetFieldPositions(f.Value.PDFKey)[0];
                        } else {
                            pos = poes[0];
                        }
                        Rectangle rect = new Rectangle(pos.position);
                        f.Value.Value = f.Value.Value.Replace(">>image", "").Replace(">image", "");
                        try {
                            Dictionary<string, object> methodResult = Main.JsonToMethod(f.Value.Value, true);
                            if(methodResult.ContainsKey("error")) {
                                if((int)methodResult["error"] != 0) {
                                    Exception exp = new Exception((string)methodResult["description"]);
                                    throw exp;
                                }
                            }
                            KeyValuePair<string, object> src = methodResult.ElementAt(0);
                            MemoryStream stream = new MemoryStream();
                            ((System.Drawing.Bitmap)(src.Value)).Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                            iTextSharp.text.Image img = iTextSharp.text.Image.GetInstance(stream.GetBuffer());
                            iTextSharp.text.Rectangle imageRect = new Rectangle(rect);
                            img.ScaleToFit(imageRect.Width, imageRect.Height);
                            img.SetAbsolutePosition(imageRect.Left, imageRect.Top - imageRect.Height);
                            PdfContentByte overContent = stamp.GetOverContent(1);
                            overContent.AddImage(img);
                        } catch(Exception ex) {
                            ex = Main.getInnermostException(ex);
                            /* place text describing the error in place of the image */
                            PdfContentByte cb = stamp.GetOverContent(1);
                            ColumnText ct = new ColumnText(cb);
                            BaseColor color = new BaseColor(f.Value.R, f.Value.G, f.Value.B, 1);
                            string msg = String.Format("{0},Message:{1}, Source: {2}",
                            filePath, ex.Message, f.Value.Value);
                            ("PDF Exception on PDF:" + msg).Debug(2);
                            Phrase ph = new Phrase(new Chunk(msg,
                            FontFactory.GetFont(GetFontFromDict(f.Value.FontFamily), 3f, Font.NORMAL, BaseColor.BLACK)));
                            ct.SetSimpleColumn(ph, rect.Left, rect.Top, rect.Right, rect.Bottom, 3f, (int)f.Value.Alignment);
                            ct.Go();
                        }
                    } else {
                        float fontSize = (float)Convert.ToDouble(f.Value.FontSize);
                        if(fontSize == 0) {
                            fontSize = 10f;
                        }
                        PdfContentByte cb = stamp.GetOverContent(1);
                        ColumnText ct = new ColumnText(cb);
                        BaseColor color = new BaseColor(f.Value.R, f.Value.G, f.Value.B, 1);
                        Phrase ph = new Phrase(new Chunk(f.Value.Value,
                        FontFactory.GetFont(GetFontFromDict(f.Value.FontFamily), fontSize, Font.NORMAL, color)));
                        Rectangle rect = f.Value.Rect;
                        ct.SetSimpleColumn(ph, rect.Left, rect.Top, rect.Right, rect.Bottom, fontSize, (int)f.Value.Alignment);
                        ct.Go();
                    }
                }
                return;
            }
            /// <summary>
            /// Makes a single PDF page by reference.
            /// </summary>
            /// <param name="filePath">The file path.</param>
            /// <param name="x">The running record total.</param>
            /// <param name="dt">DataTable contaning report query.</param>
            /// <param name="bdt">DataTable containing the report detail query.</param>
            /// <param name="verticalSpacing">The vertical spacing between each line in the report detail.</param>
            /// <param name="rpp">Records Per Page.</param>
            /// <param name="page">Current Page to read from.</param>
            /// <param name="currentPage">Current page to write to.</param>
            /// <param name="totalPages">The total number of pages.</param>
            /// <param name="queryArguments">The query arguments.</param>
            /// <returns>rendered pdf page</returns>
            private static MemoryStream MakePage(string filePath, ref int x, ref DataTable dt, ref DataTable bdt,
            int verticalSpacing, int rpp, int page, int currentPage, int totalPages, Dictionary<string, object> queryArguments) {
                ("FUNCTION /w binaryStream makePage").Debug(10);
                MemoryStream ms = new MemoryStream();
                PdfReader reader = new PdfReader(filePath);
                PdfStamper stamp = new PdfStamper(reader, ms);
                Dictionary<string, AField> docFields = new Dictionary<string, AField>();
                reader.SelectPages(page.ToString());
                float top = 0;
                for(var y = 0; rpp > y; y++) {
                    if(y + x > bdt.Rows.Count - 1) { break; };
                    foreach(string fieldKey in stamp.AcroFields.Fields.Keys) {
                        if(fieldKey.StartsWith(">>") || fieldKey.StartsWith(">>image")) {
                            WriteField(x + y, 1, top, fieldKey, ref stamp, ref docFields, currentPage, totalPages, bdt, queryArguments);
                        }
                    }
                    top -= verticalSpacing;
                }
                foreach(string fieldKey in stamp.AcroFields.Fields.Keys) {
                    if(
                    (fieldKey.StartsWith(">") && (!fieldKey.StartsWith(">>"))) ||
                    (fieldKey.StartsWith(">image") && (!fieldKey.StartsWith(">>image"))) || fieldKey.StartsWith("_page")
                    ) {
                        WriteField(0, 0, 0, fieldKey, ref stamp, ref docFields, currentPage, totalPages, dt, queryArguments);
                    }
                }
                reader.RemoveFields();
                foreach(KeyValuePair<string, AField> f in docFields) {
                    Rectangle rect = f.Value.Rect;
                    string value = f.Value.Value;
                    TextField field = new TextField(stamp.Writer, rect, f.Key);
                    field.DefaultText = value;
                    field.FieldName = f.Key;
                    field.Options = iTextSharp.text.pdf.TextField.MULTILINE;
                    stamp.AddAnnotation(field.GetTextField(), 1);
                }
                stamp.Close();
                reader.Close();
                reader = new PdfReader(ms.GetBuffer());
                MemoryStream os = new MemoryStream();
                stamp = new PdfStamper(reader, os);
                WriteAFieldCollection(ref stamp, docFields, filePath);
                reader.RemoveFields();
                stamp.Close();
                reader.Close();
                return os;
            }
            /// <summary>
            /// Gets the RPP value from the PDF.
            /// </summary>
            /// <param name="inputRPP">The input name of the RPP input.</param>
            /// <param name="rpp">By reference the RPP value you want to fill.</param>
            /// <param name="pOffset">By reference the page offset (page*rpp=x).</param>
            /// <param name="bdt">The report detail dataTable.</param>
            /// <param name="y">The current record iteration.</param>
            private static void GetRPP(string inputRPP, ref int rpp, ref int pOffset, DataTable bdt, int y) {
                rpp = Convert.ToInt32(inputRPP.Split(',')[0]);
                if((y + rpp) >= bdt.Rows.Count - 1 && bdt.Rows.Count - 1 > rpp) {
                    pOffset++;
                    pOffset++;
                    rpp = Convert.ToInt32(inputRPP.Split(',')[2]);
                } else if(y >= rpp) {
                    pOffset++;
                    rpp = Convert.ToInt32(inputRPP.Split(',')[1]);
                }
            }
            /// <summary>
            /// Outputs the PDF buffer to the HTTP client as a file attachment.
            /// </summary>
            /// <param name="os">The PDF memory stream.</param>
            /// <param name="fileName">Name of the file.</param>
            private static void OutputBuffer(MemoryStream os, string fileName) {
                OutputBuffer(os, fileName, true);
            }
            /// <summary>
            /// Outputs the PDF buffer to the HTTP client, optinally as an attachment.
            /// </summary>
            /// <param name="os">The PDF memory stream.</param>
            /// <param name="fileName">Name of the file.</param>
            /// <param name="attachment">if set to <c>true</c> file will be an attachment (download as a file, not a new window).</param>
            private static void OutputBuffer(MemoryStream os, string fileName, bool attachment) {
                string attch = (string)Utilities.Iif(attachment, "attachment; ", "");
                HttpContext.Current.Response.Clear();
                HttpContext.Current.Response.AddHeader("Content-Disposition", attch + "filename=\"" + fileName + "\"");
                HttpContext.Current.Response.AddHeader("Content-Length", os.GetBuffer().Length.ToString());
                HttpContext.Current.Response.ContentType = "application/pdf";
                HttpContext.Current.Response.Buffer = false;
                HttpContext.Current.Response.BinaryWrite(os.GetBuffer());
            }
            /// <summary>
            /// Creates a PDF document with a description of the error that occured.
            /// </summary>
            /// <param name="error">The error.</param>
            private static void ErrorDocument(string error) {
                Document doc = new Document(PageSize.LETTER);
                MemoryStream os = new MemoryStream();
                PdfWriter.GetInstance(doc, os);
                doc.Open();
                Paragraph paragraph = new Paragraph(@"
				An error occured while trying to render your PDF.
				" + error + @"	");
                doc.Add(paragraph);
                doc.Close();
                OutputBuffer(os, "error.pdf");
            }
            #endregion
            #region Instance Public Methods
            /// <summary>
            /// Prints the specified dynamic PDF document as an attachment.
            /// These documents must fit the correct specification to be dynamic.
            /// Dynamic PDF documents contain specially labeled fields that will
            /// permit the system to execute queries and use the adminResponder virtual
            /// execution method to return binary images, strings and other data and to execute arbitrary code.
            /// </summary>
            /// <param name="refDoc">The ref doc.</param>
            /// <param name="queryArguments">The query arguments.</param>
            public static void Print(string refDoc, Dictionary<string, object> queryArguments) {
                Print(refDoc, queryArguments, true);
            }
            /// <summary>
            /// Prints the specified dynamic PDF document.
            /// These documents must fit the correct specification to be dynamic.
            /// Dynamic PDF documents contain specially labeled fields that will
            /// permit the system to execute queries and use the adminResponder virtual
            /// execution method to return binary images, strings and other data and to execute arbitrary code.
            /// </summary>
            /// <param name="refDoc">The ref doc.</param>
            /// <param name="queryArguments">The query arguments.</param>
            /// <param name="asAttachment">if set to <c>true</c> file will download as attachment (as a file, don't open in the current window).</param>
            public static void Print(string refDoc, Dictionary<string, object> queryArguments, bool asAttachment) {
                ("FUNCTION /w fileResponse print").Debug(10);
                string filePath = "";
                refDoc = refDoc.Replace(Main.PhysicalApplicationPath, "");
                if(!File.Exists(Main.PhysicalApplicationPath + refDoc)) {
                    ErrorDocument("The path " + Main.PhysicalApplicationPath + refDoc + " was not found.");
                    return;
                } else {
                    filePath = Main.PhysicalApplicationPath + refDoc;
                };
                MemoryStream ms = new MemoryStream();
                PdfReader reader = new PdfReader(filePath);
                PdfStamper stamp = new PdfStamper(reader, ms);
                /* find each field and field type */
                string headerQuery = "";
                string bodyQuery = "";
                string query = "";
                string recordsPerPage = "";
                bool autoPrint = false;
                string outputFileName = "pdf.pdf";
                int verticalSpacing = 15;
                foreach(string fieldKey in stamp.AcroFields.Fields.Keys) {
                    if(fieldKey == "_header") {
                        headerQuery = stamp.AcroFields.GetField(fieldKey);
                    } else if(fieldKey == "_body") {
                        bodyQuery = stamp.AcroFields.GetField(fieldKey);
                    } else if(fieldKey == "_query") {
                        query = stamp.AcroFields.GetField(fieldKey);
                    } else if(fieldKey == "_recordsPerPage") {
                        recordsPerPage = stamp.AcroFields.GetField(fieldKey);
                    } else if(fieldKey == "_autoPrint") {
                        autoPrint = stamp.AcroFields.GetField(fieldKey) == "true";
                    } else if(fieldKey == "_verticalSpacing") {
                        verticalSpacing = Convert.ToInt32(stamp.AcroFields.GetField(fieldKey));
                    } else if(fieldKey == "_fileName") {
                        outputFileName = RequestReplace(stamp.AcroFields.GetField(fieldKey), queryArguments);
                    }
                }
                if(query.Length > 0) {
                    query = RequestReplace(bodyQuery, queryArguments);
                } else if(bodyQuery.Length > 0 && headerQuery.Length > 0) {
                    headerQuery = RequestReplace(headerQuery, queryArguments);
                    bodyQuery = RequestReplace(bodyQuery, queryArguments);
                }
                List<PdfReader> pages = new List<PdfReader>();
                if(query.Length > 0 || (bodyQuery.Length > 0 && headerQuery.Length > 0)) {
                    using(SqlConnection cn = Site.CreateConnection(true, true)) {
                        cn.Open();
                        /* execute header query */
                        SqlDataAdapter da = new SqlDataAdapter(headerQuery, cn);
                        DataSet ds = new DataSet();
                        DataTable dt = new DataTable();
                        da.Fill(0, 9999999, dt);
                        /* execute body query */
                        SqlDataAdapter bda = new SqlDataAdapter(bodyQuery, cn);
                        DataSet bds = new DataSet();
                        DataTable bdt = new DataTable();
                        bda.Fill(0, 9999999, bdt);
                        int x = 0;
                        int totalPages = 0;
                        for(var y = 0; bdt.Rows.Count > y; y++) {
                            int pOffset = 1;
                            int rpp = 10;
                            GetRPP(recordsPerPage, ref rpp, ref pOffset, bdt, y);
                            totalPages++;
                            y += rpp - 1;
                        }
                        int currentPage = 1;
                        if(bdt.Rows.Count == 0) {
                            pages.Add(new PdfReader(
                                MakePage(filePath, ref x, ref dt, ref bdt,
                                verticalSpacing, 0, 1, 1, 1, queryArguments).GetBuffer()
                            ));
                        } else {
                            for(var y = 0; bdt.Rows.Count > y; y++) {
                                int pOffset = 1;
                                int rpp = 10;
                                GetRPP(recordsPerPage, ref rpp, ref pOffset, bdt, y);
                                pages.Add(new PdfReader(
                                    MakePage(filePath, ref x, ref dt, ref bdt,
                                    verticalSpacing, rpp, pOffset, currentPage, totalPages, queryArguments).GetBuffer()
                                ));
                                currentPage++;
                                y += rpp - 1;
                                x = y + 1;
                            }
                        }
                    }
                } else {
                    /* no database interaction on this PDF */
                    pages.Add(new PdfReader(MakeStaticPage(filePath, queryArguments).GetBuffer()));
                }
                MemoryStream os = new MemoryStream();
                Document doc = new Document(pages[0].GetPageSizeWithRotation(1));
                PdfCopy copier = new PdfCopy(doc, os);
                doc.Open();
                foreach(PdfReader page in pages) {
                    copier.AddPage(copier.GetImportedPage(page, 1));
                    page.Close();
                }
                doc.Close();
                OutputBuffer(os, outputFileName, asAttachment);
                return;
            }
            #endregion
        }
	}
}
