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
using System.Web;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Linq;
using ZedGraph;
using System.Drawing;
namespace Rendition {
	public partial class Admin {
        /// <summary>
        /// Gets the google data type string from the C# type.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <returns></returns>
        private static string getGoogleDataType(Type type) {
            string lowerTypeName = type.Name.ToLower().Trim();
            string otype;
            switch(lowerTypeName){
                case "int32":
                    otype = "number";
                    break;
                case "decimal":
                    otype = "number";
                    break;
                case "float":
                    otype = "float";
                    break;
                default:
                    otype = lowerTypeName;
                    break;
            }
            return otype;
        }
        /// <summary>
        /// Populates a google JSON row.
        /// </summary>
        /// <param name="r">The r.</param>
        /// <param name="columnLength">Length of the column.</param>
        /// <returns></returns>
        private static Dictionary<string, object> populateGoogleRow(object[] r, int columnLength) {
            Dictionary<string, object> row = new Dictionary<string, object>();
            List<Dictionary<string, object>> colData = new List<Dictionary<string, object>>();
            for(int x = 0; x < columnLength; x++) {
                Dictionary<string, object> col = new Dictionary<string, object>();
                
                col.Add("v", r[x]);
                col.Add("f", null);
                colData.Add(col);
            }
            row.Add("c", colData);
            return row;
        }
        /// <summary>
        /// Gets the google chart query.  
        /// Returns the format that google data table is expecting for direct interjection.
        /// </summary>
        /// <param name="chartType">Type of the chart.</param>
        /// <param name="query">The query.</param>
        /// <returns></returns>
        public static Dictionary<string, object> GetGoogleChartQuery(string chartType, string query) {
            Dictionary<string, object> j = new Dictionary<string, object>();
            Dictionary<string, object> dataObject = new Dictionary<string, object>();
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            List<Dictionary<string, object>> columns = new List<Dictionary<string, object>>();
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                try {
                    using(SqlCommand cmd = new SqlCommand(query, cn)) {
                        using(SqlDataReader r = cmd.ExecuteReader()) {
                            int colLength = r.FieldCount;
                            while(r.Read()) {
                                if(columns.Count==0){
                                    object[] colNames = new object[colLength];
                                    for(int x = 0; x < colLength; x++) {
                                        string name = r.GetName(x);
                                        Dictionary<string, object> col = new Dictionary<string, object>();
                                        if(name == string.Empty) {
                                            name = "Column" + (x+1);
                                        }
                                        col.Add("id",name);
                                        col.Add("label",name);
                                        col.Add("pattern","");
                                        col.Add("type",getGoogleDataType(r.GetFieldType(x)));
                                        colNames[x] = name;
                                        columns.Add(col);
                                    }
                                }
                                object[] values = new object[colLength];
                                r.GetValues(values);
                                rows.Add(populateGoogleRow(values, colLength));
                            }
                        }
                    }
                } catch(Exception ex) {
                    j.Add("message", ex.Message);
                    j.Add("error", -1);
                    return j;
                }
            }
            dataObject.Add("cols",columns);
            dataObject.Add("rows",rows);
            j.Add("message", "");
            j.Add("error", 0);
            j.Add("data", dataObject);
            return j;
        }
		/// <summary>
		/// For converting JSON object into a set of options for the zedChart object
		/// </summary>
		public class PieChartPiece {
			/// <summary>
			/// Fill angle
			/// </summary>
			public float FillAngle = 45f;
			/// <summary>
			/// value of the piece
			/// </summary>
			public int Value = 0;
			/// <summary>
			/// Starting color
			/// </summary>
			public string StartColor = System.Drawing.Color.Navy.ToString();
			/// <summary>
			/// Ending color
			/// </summary>
			public string EndColor = System.Drawing.Color.White.ToString();
		}
		/// <summary>
		/// For converting JSON object into a set of options for the zedChart object
		/// </summary>
		public class FillOptions {
			/// <summary>
			/// Type of fill
			/// </summary>
			public string Type = "fill";
			/// <summary>
			/// Starting color
			/// </summary>
			public string StartColor = System.Drawing.Color.White.ToString();
			/// <summary>
			/// Ending color
			/// </summary>
			public string EndColor = System.Drawing.Color.LightBlue.ToString();
			/// <summary>
			/// Fill angle
			/// </summary>
			public float Angle = 45f;
		}
		/// <summary>
		/// For converting JSON object into a set of options for the zedChart object
		/// </summary>
		public class GraphOptions {
			/// <summary>
			/// title of the graph
			/// </summary>
			public string Title;
			/// <summary>
			/// if true then font is italic
			/// </summary>
			public bool IsItalic = false;
			/// <summary>
			/// title font size
			/// </summary>
			public float TitleFontSize = 24f;
			/// <summary>
			/// Font family
			/// </summary>
			public string FontFamily = "Trebuchet MS";
			/// <summary>
			/// xAxis title
			/// </summary>
			public string XAxisTitle = "";
			/// <summary>
			/// yAxis title
			/// </summary>
			public string YAxisTitle = "";
			/// <summary>
			/// xAxis font angle
			/// </summary>
			public float XAxisFontAngle = 65f;
			/// <summary>
			/// xAxis font size
			/// </summary>
			public float XAxisFontSize = 11f;
			/// <summary>
			/// Format of the xAxis
			/// </summary>
			public string XAxisFormat = "d MMM";
			/// <summary>
			/// Format of the node label
			/// </summary>
			public string NodeLabelFormat = "f0";
			/// <summary>
			/// Height of the image
			/// </summary>
			public int Height = 375;
			/// <summary>
			/// Width of the image
			/// </summary>
			public int Width = 500;
			/// <summary>
			/// if true, the legend will be drawn
			/// </summary>
			public bool ShowLegend = true;
			/// <summary>
			/// if true, node label will be drawn
			/// </summary>
			public bool NodeLabel = true;
			/// <summary>
			/// Font size of the label
			/// </summary>
			public float NodeLabelFontSize = 12f;
			/// <summary>
			/// Angle of the node lables
			/// </summary>
			public float NodeLabelRotation = 65f;
			/// <summary>
			/// Bar fill options
			/// </summary>
			public FillOptions Fill;
			/// <summary>
			/// orientation of the bars
			/// </summary>
			public bool Orientation = false;
			/// <summary>
			/// Spacing between bars
			/// </summary>
			public float BarSpacing = 50.00f;
            /// <summary>
            /// No data message
            /// </summary>
            public string NoDataMessage = "This chart contains no data.";
		}
		/// <summary>
		/// Gas gauge chart.
		/// </summary>
		/// <param name="query">The query.</param>
		/// <param name="_options">GraphOptions.</param>
		/// <param name="binaryOutput">if set to <c>true</c> the image will output in the response stream.</param>
		/// <returns></returns>
		public static System.Drawing.Bitmap GasGauge( string query, Dictionary<string, object> _options, bool binaryOutput ) {
			( "FUNCTION /w binaryStream gasGauge" ).Debug( 10 );
			JToken jtOpt = JToken.FromObject( _options );
			JsonSerializer serializer = new JsonSerializer();
			GraphOptions options = null;
			using( JTokenReader jtr = new JTokenReader( jtOpt ) ) {
				options = ( GraphOptions )serializer.Deserialize( jtr, typeof( GraphOptions ) );
			}
			GraphPane myPane = new GraphPane( new System.Drawing.Rectangle( 0, 0, options.Width, options.Height ), options.Title, "", "" );
			myPane.Title.Text = options.Title;

			// Define the title
			myPane.Title.Text = "Gas Gauge Demo";

			// Fill the pane with gray
			myPane.Fill = new Fill( System.Drawing.Color.LightGray, System.Drawing.Color.White, 45.0f );
			// Fill the chart rect with blue
			myPane.Chart.Fill = new Fill( System.Drawing.Color.White, System.Drawing.Color.SkyBlue, 45.0f );

			// Don't show any axes for the gas gauge
			myPane.XAxis.IsVisible = false;
			myPane.Y2Axis.IsVisible = false;
			myPane.YAxis.IsVisible = false;

			//Define needles; can add more than one
			GasGaugeNeedle gg1 = new GasGaugeNeedle( "Cereal", 30.0f, System.Drawing.Color.Black );
			GasGaugeNeedle gg2 = new GasGaugeNeedle( "Milk", 80.0f, System.Drawing.Color.DarkGreen );
			myPane.CurveList.Add( gg1 );
			myPane.CurveList.Add( gg2 );

			//Define all regions
			GasGaugeRegion ggr1 = new GasGaugeRegion( "Red", 0.0f, 33.0f, System.Drawing.Color.Red );
			GasGaugeRegion ggr2 = new GasGaugeRegion( "Yellow", 33.0f, 66.0f, System.Drawing.Color.Yellow );
			GasGaugeRegion ggr3 = new GasGaugeRegion( "Green", 66.0f, 100.0f, System.Drawing.Color.Green );

			// Add the curves
			myPane.CurveList.Add( ggr1 );
			myPane.CurveList.Add( ggr2 );
			myPane.CurveList.Add( ggr3 );

			System.Drawing.Bitmap image = myPane.GetImage( true );
			if( binaryOutput ) {
				using( MemoryStream ms = new MemoryStream() ) {
					image.Save( ms, System.Drawing.Imaging.ImageFormat.Png );
					if(HttpContext.Current!=null){
						HttpContext.Current.Response.Clear();
						HttpContext.Current.Response.ContentType = "image/png";
						HttpContext.Current.Response.AddHeader( "Expires", "0" );/* RFC 2616 14.21 Content has already expired */
						HttpContext.Current.Response.AddHeader( "Cache-Control", "no-store" );/* RFC 2616 14.9.2 Don't ever cache */
						HttpContext.Current.Response.AddHeader( "Pragma", "no-store" );/* RFC 2616 14.32 Pragma - same as cache control */
						ms.WriteTo( HttpContext.Current.Response.OutputStream );
					}
				}
				image.Dispose();
			}
			return image;
		}
		/// <summary>
		/// Bar chart.
		/// </summary>
		/// <param name="query">The query.</param>
		/// <param name="_options">GraphOptions.</param>
		/// <param name="binaryOutput">if set to <c>true</c> the image will output in the response stream.</param>
		/// <returns></returns>
		public static System.Drawing.Bitmap BarChart( string query, Dictionary<string, object> _options, bool binaryOutput ) {
			( "FUNCTION /w binaryStream barChart" ).Debug( 10 );
			/*
				* 0 = name
				* 1 = value
				* 2 = color1
				* 3 = color2
				* 4 = angle
				*/
			GraphOptions options = null;
			JToken jtOpt = JToken.FromObject( _options );
			using( JTokenReader tr = new JTokenReader( jtOpt ) ) {
				JsonSerializer serializer = new JsonSerializer();
				options = ( GraphOptions )serializer.Deserialize( tr, typeof( GraphOptions ) );
			}
            System.Drawing.Bitmap image = null;
            GraphPane myPane = null;
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                try {
                    using(SqlCommand cmd = new SqlCommand(query, cn)) {
                        myPane = new GraphPane(new System.Drawing.Rectangle(0, 0, options.Width, options.Height), options.Title, "", "");
                        myPane.Title.Text = options.Title;
                        myPane.XAxis.Title.Text = options.XAxisTitle;
                        myPane.YAxis.Title.Text = options.YAxisTitle;
                        if(options.Orientation) {
                            myPane.YAxis.Type = AxisType.Ordinal;
                        } else {
                            myPane.XAxis.Type = AxisType.Ordinal;
                        }
                        float barLocation = 0;
                        using(SqlDataReader r = cmd.ExecuteReader()) {
                            if(r.HasRows) {
                                while(r.Read()) {
                                    PointPairList list = new PointPairList();
                                    if(options.Orientation) {
                                        list.Add(Convert.ToDouble(r.GetValue(1)), barLocation);
                                        BarItem myCurve = myPane.AddBar(r.GetString(0), list, System.Drawing.Color.FromName(r.GetString(2)));
                                        myCurve.Bar.Fill = new Fill(
                                            System.Drawing.Color.FromName(r.GetString(2)),
                                            System.Drawing.Color.FromName(r.GetString(3)),
                                            System.Drawing.Color.FromName(r.GetString(2)),
                                            (float)r.GetInt32(4)
                                        );
                                    } else {
                                        list.Add(barLocation, Convert.ToDouble(r.GetValue(1)));
                                        BarItem myCurve = myPane.AddBar(r.GetString(0), list, System.Drawing.Color.FromName(r.GetString(2)));
                                        myCurve.Bar.Fill = new Fill(
                                            System.Drawing.Color.FromName(r.GetString(2)),
                                            System.Drawing.Color.FromName(r.GetString(3)),
                                            (float)r.GetInt32(4)
                                        );

                                    }
                                    barLocation += options.BarSpacing;
                                }
                            }else{
                                if(image == null) {
                                    image = new Bitmap(700, 700);
                                }
                                image = WriteImageError(image, options.NoDataMessage, options.FontFamily, options.XAxisFontSize);
                                return image;
                            }
                        }
                        if(options.Orientation) {
                            myPane.YAxis.IsVisible = false;
                            //myPane.YAxis.Scale.Max=barLocation;
                            myPane.YAxis.Scale.Min = 0;
                            myPane.BarSettings.Base = BarBase.Y;
                        } else {
                            myPane.XAxis.IsVisible = false;
                            myPane.XAxis.Scale.Min = 0;
                            //myPane.XAxis.Scale.Max=barLocation-options.barSpacing;
                            myPane.BarSettings.Base = BarBase.X;
                        }
                        // Fill the chart background with a color gradient
                        myPane.Chart.Fill = new Fill(
                        System.Drawing.Color.FromName(options.Fill.StartColor),
                        System.Drawing.Color.FromName(options.Fill.EndColor), options.Fill.Angle);
                        myPane.AxisChange();

                        // Create TextObj's to provide labels for each bar
                        BarItem.CreateBarLabels(myPane, false, "f0");
                        image = myPane.GetImage(true);
                        using(MemoryStream ms = new MemoryStream()) {
                            image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                            if(HttpContext.Current != null) {
                                HttpContext.Current.Response.Clear();
                                HttpContext.Current.Response.ContentType = "image/png";
                                HttpContext.Current.Response.AddHeader("Expires", "0");/* RFC 2616 14.21 Content has already expired */
                                HttpContext.Current.Response.AddHeader("Cache-Control", "no-store");/* RFC 2616 14.9.2 Don't ever cache */
                                HttpContext.Current.Response.AddHeader("Pragma", "no-store");/* RFC 2616 14.32 Pragma - same as cache control */
                                ms.WriteTo(HttpContext.Current.Response.OutputStream);
                            }
                        }
                    }
                } catch(Exception ex) {
                    if(image == null) {
                        image = new Bitmap(700, 700);
                    }
                    image = WriteImageError(image, ex.Message, "Arial", 8f);
                }
            }
            return image;
		}
		/// <summary>
		/// Creates a tic chart based on the query batch.
		/// </summary>
		/// <param name="query">The query batch.  Each line is a seperate query batch.  The query should look like:
		/// 0:name, 1:x, 2:y, 3:colorName, 4:fillColorName, 5:lineWidth, 6:ticSize.</param>
		/// <param name="_options">GraphOptions.</param>
		/// <param name="binaryOutput">if set to <c>true</c> the image will output in the response stream.</param>
		/// <returns></returns>
		public static System.Drawing.Bitmap TicChart( string query, Dictionary<string, object> _options, bool binaryOutput ) {
			( "FUNCTION /w binaryStream ticChart" ).Debug( 10 );
			/* query expects two columns
				* 0 name
				* 1 x 
				* 2 y
				* 3 color
				* 4 fill color
				* 5 line Width
				* 6 symbol size
				*/
			JToken jtOpt = JToken.FromObject( _options );
			JsonSerializer serializer = new JsonSerializer();
			GraphOptions options = ( GraphOptions )serializer.Deserialize( new JTokenReader( jtOpt ), typeof( GraphOptions ) );
            System.Drawing.Bitmap image = null;
            GraphPane myPane = null;
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                try{
                    using(SqlCommand cmd = new SqlCommand(query, cn)) {
                        myPane = new GraphPane(new System.Drawing.Rectangle(0, 0, options.Width, options.Height), options.Title, "", "");
                        // Set the titles and axis labels
                        myPane.Title.Text = options.Title;
                        myPane.XAxis.Title.Text = options.XAxisTitle;
                        myPane.YAxis.Title.Text = options.YAxisTitle;
                        myPane.XAxis.Type = AxisType.Date;
                        myPane.XAxis.Scale.FontSpec.Angle = options.XAxisFontAngle;
                        myPane.XAxis.Scale.FontSpec.Size = options.XAxisFontSize;
                        myPane.XAxis.Scale.Format = options.XAxisFormat;
                        using(SqlDataReader r = cmd.ExecuteReader()) {
                            float lineWidth = 4.5f;
                            ZedGraph.Fill fill = new Fill(System.Drawing.Color.White);
                            float size = 5;
                            string label = "";
                            System.Drawing.Color symbolColor = System.Drawing.Color.Black;
                            bool nextResult = r.HasRows;
                            while(nextResult) {
                                int count = 0;
                                PointPairList list = new PointPairList();
                                while(r.Read()) {
                                    lineWidth = (float)Convert.ToDouble(r.GetValue(5));
                                    fill = new Fill(System.Drawing.Color.FromName(r.GetString(4)));
                                    size = (float)Convert.ToDouble(r.GetValue(6));
                                    label = r.GetString(0);
                                    symbolColor = System.Drawing.Color.FromName(r.GetString(3));
                                    list.Add(new XDate(r.GetDateTime(1)), Convert.ToDouble(r.GetValue(2)));
                                    count++;
                                }
                                LineItem curve = myPane.AddCurve(label, list, symbolColor, SymbolType.Circle);
                                curve.Line.Width = lineWidth;
                                curve.Symbol.Fill = fill;
                                curve.Symbol.Size = size;
                                nextResult = r.NextResult();
                                if(options.NodeLabel) {
                                    const double offset = 1.0;
                                    // Loop to add text labels to the points
                                    for(int i = 0; i < count; i++) {
                                        // Get the pointpair
                                        PointPair pt = curve.Points[i];
                                        // Create a text label from the Y data value
                                        TextObj text = new TextObj(pt.Y.ToString(options.NodeLabelFormat), pt.X, pt.Y + offset,
                                            CoordType.AxisXYScale, AlignH.Left, AlignV.Center);
                                        text.FontSpec.Size = options.NodeLabelFontSize;
                                        text.ZOrder = ZOrder.A_InFront;
                                        // Hide the border and the fill
                                        text.FontSpec.Border.IsVisible = false;
                                        text.FontSpec.Fill.IsVisible = false;
                                        // text.FontSpec.Fill = new Fill( Color.FromArgb( 100, Color.White ) );
                                        // Rotate the text to 90 degrees
                                        text.FontSpec.Angle = options.NodeLabelRotation;
                                        myPane.GraphObjList.Add(text);
                                    }
                                }
                            }
                        }
                    }
                    myPane.Legend.IsVisible = options.ShowLegend;
                    myPane.XAxis.Scale.MinGrace = 0;
                    myPane.XAxis.Scale.MaxGrace = 0;
                    // Fill the axis background with a gradient
                    myPane.Chart.Fill = new Fill(System.Drawing.Color.FromName(options.Fill.StartColor), System.Drawing.Color.FromName(options.Fill.EndColor), options.Fill.Angle);
                    myPane.AxisChange();
                    image = myPane.GetImage(true);
                } catch(Exception ex) {
                    if(image == null) {
                        image = new Bitmap(700, 700);
                    }
                    image = WriteImageError(image, ex.Message, "Arial", 8f);
                }
                if(binaryOutput) {
                    using(MemoryStream ms = new MemoryStream()) {
                        image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                        if(HttpContext.Current != null) {
                            HttpContext.Current.Response.Clear();
                            HttpContext.Current.Response.ContentType = "image/png";
                            HttpContext.Current.Response.AddHeader("Expires", "0");/* RFC 2616 14.21 Content has already expired */
                            HttpContext.Current.Response.AddHeader("Cache-Control", "no-store");/* RFC 2616 14.9.2 Don't ever cache */
                            HttpContext.Current.Response.AddHeader("Pragma", "no-store");/* RFC 2616 14.32 Pragma - same as cache control */
                            ms.WriteTo(HttpContext.Current.Response.OutputStream);
                        }
                    }
                }
            }
            return image;
		}
		/// <summary>
		/// Creates a pie chart from a JSON request.
		/// </summary>
		/// <param name="query">Query batch.</param>
		/// <param name="_options">GraphOptions.</param>
		/// <param name="binaryOutput">if set to <c>true</c> the image will output in the response stream.</param>
		/// <returns></returns>
		public static System.Drawing.Bitmap PieChart( string query, Dictionary<string, object> _options, bool binaryOutput ) {
			( "FUNCTION /w binaryStream pieChart" ).Debug( 10 );
			/* query expects two columns
				* 0 name
				* 1 value 
				* 2 color1 (or null)
				* 3 color2 (or null)
				*/
			JToken jtOpt = JToken.FromObject( _options );
			JsonSerializer serializer = new JsonSerializer();
			GraphOptions options = ( GraphOptions )serializer.Deserialize( new JTokenReader( jtOpt ), typeof( GraphOptions ) );
			if( options.Width == 0 || options.Height == 0 ) {
				/*bad image size defined */
				return null;
			}
            System.Drawing.Bitmap image = null;
            GraphPane myPane = null;
            using(SqlConnection cn = Site.CreateConnection(true, true)) {
                cn.Open();
                try {
                    using(SqlCommand cmd = new SqlCommand(query, cn)) {
                        myPane = new GraphPane(new System.Drawing.Rectangle(0, 0, options.Width, options.Height), options.Title, "", "");
                        // Set the GraphPane title
                        myPane.Title.Text = options.Title;
                        myPane.Title.FontSpec.IsItalic = options.IsItalic;
                        myPane.Title.FontSpec.Size = options.TitleFontSize;
                        myPane.Title.FontSpec.Family = options.FontFamily;
                        System.Drawing.Color fill1 = System.Drawing.Color.FromName(options.Fill.StartColor);
                        System.Drawing.Color fill2 = System.Drawing.Color.FromName(options.Fill.EndColor);
                        // Fill the pane background with a color gradient
                        myPane.Fill = new Fill(fill1, fill2, options.Fill.Angle);
                        // No fill for the chart background
                        myPane.Chart.Fill.Type = FillType.None;
                        // Set the legend to an arbitrary location
                        myPane.Legend.IsVisible = options.ShowLegend;
                        myPane.Legend.Position = LegendPos.Float;
                        myPane.Legend.Location = new Location(0.95f, 0.15f, CoordType.PaneFraction, AlignH.Right, AlignV.Top);
                        myPane.Legend.FontSpec.Size = 10f;
                        myPane.Legend.IsHStack = false;
                        List<PieItem> segments = new List<PieItem>();
                        using(SqlDataReader r = cmd.ExecuteReader()) {
                            while(r.Read()) {
                                System.Drawing.Color color1 = System.Drawing.Color.FromName(r.GetString(2));
                                System.Drawing.Color color2 = System.Drawing.Color.FromName(r.GetString(3));
                                PieItem s = myPane.AddPieSlice(Convert.ToDouble(r.GetValue(1)), color1, color2, 45f, 0, r.GetString(0));
                                if(r.GetValue(1).GetType() == typeof(decimal)) {
                                    s.Label.Text = r.GetString(0) + ' ' + r.GetDecimal(1).ToString(options.NodeLabelFormat);
                                } else {
                                    s.Label.Text = s.Label.Text = r.GetString(0) + ' ' + Convert.ToString(r.GetValue(1));
                                }
                                segments.Add(s);
                            }
                        }
                    }
                    // Sum up the pie values                                                               
                    CurveList curves = myPane.CurveList;
                    double total = 0;
                    for(int x = 0; x < curves.Count; x++)
                        total += ((PieItem)curves[x]).Value;
                    // Calculate the Axis Scale Ranges
                    myPane.AxisChange();
                    image = myPane.GetImage(true);
                } catch(Exception ex) {
                    if(image == null) {
                        image = new Bitmap(700, 700);
                    }
                    image = WriteImageError(image, ex.Message, "Arial", 8f);
                }
                if(binaryOutput) {
                    using(MemoryStream ms = new MemoryStream()) {
                        image.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                        if(HttpContext.Current != null) {
                            HttpContext.Current.Response.Clear();
                            HttpContext.Current.Response.ContentType = "image/png";
                            HttpContext.Current.Response.AddHeader("Expires", "0");/* RFC 2616 14.21 Content has already expired */
                            HttpContext.Current.Response.AddHeader("Cache-Control", "no-store");/* RFC 2616 14.9.2 Don't ever cache */
                            HttpContext.Current.Response.AddHeader("Pragma", "no-store");/* RFC 2616 14.32 Pragma - same as cache control */
                            ms.WriteTo(HttpContext.Current.Response.OutputStream);
                        }
                    }
                    image.Dispose();
                    if(HttpContext.Current != null) {
                        HttpContext.Current.Response.Flush();
                        HttpContext.Current.ApplicationInstance.CompleteRequest();
                    }
                }
            }
            return image;
		}
        internal static Bitmap WriteImageError(Bitmap picture, string message, string fontfamily, float fontSize) {
            using( System.Drawing.Graphics gfx = System.Drawing.Graphics.FromImage( picture ) ) {
                Font font = new Font(fontfamily, fontSize);
				SolidBrush brush = new SolidBrush( Color.Black );
				gfx.DrawString( message, font, brush, 20f, 20f );
				gfx.Save();
			}
            return picture;
        }
	}
}
