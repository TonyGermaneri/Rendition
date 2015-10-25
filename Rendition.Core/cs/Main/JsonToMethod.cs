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
using System.Web;
using System.Reflection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Linq;
namespace Rendition {
    internal partial class Main : IHttpModule {
        #region Static Methods
        /// <summary>
        /// Executes all requets as JSON method/arg pairs
        /// </summary>
        /// <param name="adminMode">if set to <c>true</c> [Admin mode].</param>
        /// <returns></returns>
        internal static string ExecuteJSONResponders(bool adminMode) {
            HttpContext current = HttpContext.Current;
            HttpRequest request = HttpContext.Current.Request;
            HttpResponse response = HttpContext.Current.Response;
            string requestContentType = request.ContentType;
            int requestLength = request.TotalBytes;
            int requestCount = 0;
            int querystringCount = 0;
            DateTime start = new DateTime();
            start = DateTime.Now;
            Dictionary<string, object> j = new Dictionary<string, object>();
            requestCount = request.Form.Count;
            querystringCount = request.QueryString.Count;
            for(var x = 0; requestCount > x; x++) {
                string keyName = request.Form.GetKey(x);
                if(keyName.StartsWith(Main.MethodKey)) {
                    j.Add(keyName, JsonToMethod(request.Form[x], adminMode));
                }
            }
            for(var x = 0; querystringCount > x; x++) {
                string keyName = request.QueryString.GetKey(x);
                if(keyName != null) {
                    if(keyName.StartsWith(Main.MethodKey)) {
                        j.Add(keyName, JsonToMethod(request.QueryString[x], adminMode));
                    }
                }
            }
            if(j.Count > 0) {
                /* if there is a file present output the file instead of the json string */
                foreach(KeyValuePair<string, object> field in j) {
                    Dictionary<string, object> innerFields = (Dictionary<string, object>)field.Value;
                    foreach(KeyValuePair<string, object> innerField in innerFields) {
                        if(innerField.Value != null) {
                            if(innerField.Value.GetType() == typeof(Dictionary<string, object>)) {
                                Dictionary<string, object> iiFields = (Dictionary<string, object>)innerField.Value;
                                if(iiFields.ContainsKey("fileName")) {
                                    string content = (string)iiFields["content"].ToString();
                                    response.ContentType = (string)iiFields["contentType"];
                                    response.Write(content);
                                    response.AddHeader("Content-Disposition", "attachment; filename=\"" + (string)iiFields["fileName"] + "\"");
                                    response.AddHeader("Content-Length", content.Length.ToString());
                                    response.Flush();
                                    current.ApplicationInstance.CompleteRequest();
                                    /* only allowed to output one file at a time */
                                    return "";
                                }
                            }
                        }
                    }
                }
                if(Main.Site != null) {
                    EndRequestEventArgs f = new EndRequestEventArgs(Main.GetCurrentSession(), current);
                    Main.Site.raiseOnendrequest(f);
                }
                return j.ToJson();
            } else {
                if(Main.Site != null) {
                    EndRequestEventArgs f = new EndRequestEventArgs(Main.GetCurrentSession(), current);
                    Main.Site.raiseOnendrequest(f);
                }
                return "";
            }
        }
        /// <summary>
        /// Uses System.Reflection to turn request strings into methods in the merchant, Admin or setup classes.
        /// </summary>
        /// <param name="decodedRequestString">The decoded request string.</param>
        /// <param name="adminMode">if set to <c>true</c> [Admin mode].</param>
        /// <returns></returns>
        public static Dictionary<string, object> JsonToMethod(string decodedRequestString, bool adminMode) {
            //("FUNCTION /w reflection JSONToMethod").debug();
            Dictionary<string, object> o = new Dictionary<string, object>();
            if(decodedRequestString.Length == 0) {
                o.Add("error", -8);
                o.Add("description", "missing arguments argument");
                return o;
            } else {
                MethodInfo methodInfo;
                List<Object> args = new List<Object>();
                string proc = "";
                int x = 0;
                JArray req = null;
                try {
                    req = JsonConvert.DeserializeObject<JArray>(decodedRequestString);
                } catch(Exception e) {
                    o.Add("error", -7);
                    o.Add("description", "JSON parse error. " + e.Message);
                    return o;
                }
                List<object> argumentCollection = new List<object>();
                proc = (string)req[0];
                if(req[1].GetType() == typeof(JArray)) {
                    JArray a = (JArray)req[1];
                    foreach(object q in a as JArray) {
                        argumentCollection.Add(q.JTokenToGeneric());
                    }
                } else {
                    o.Add("error", -6);
                    o.Add("description", "missing second argument (method arguemnts)");
                    return o;
                }
                ParameterInfo[] pramInfo = null;
                if(proc.Length > 0) {
                    methodInfo = null;
                    if(adminMode) {
                        methodInfo = typeof(Admin).GetMethod(proc);
                        /* execute all plugins with an Admin class */
                        bool mexec = false;
                        foreach(Plugin plugin in Main.Plugins) {
                            Type[] cinfos = plugin.GetType().GetNestedTypes();
                            foreach(Type cinfo in cinfos) {
                                if(cinfo.BaseType == typeof(Admin)) {
                                    MethodInfo innerMethodInfo = cinfo.GetMethod(proc);
                                    if(innerMethodInfo != null) {
                                        methodInfo = innerMethodInfo;
                                        mexec = true;
                                        break;
                                    }
                                }
                            }
                            if(mexec) {
                                break;
                            }
                        }
                    } else {
                        methodInfo = typeof(Merchant).GetMethod(proc);
                        /* execute all plugins with an Merchant class */
                        bool mexec = false;
                        foreach(Plugin plugin in Main.Plugins) {
                            Type[] cinfos = plugin.GetType().GetNestedTypes();
                            foreach(Type cinfo in cinfos) {
                                if(cinfo.BaseType == typeof(Merchant)) {
                                    MethodInfo innerMethodInfo = cinfo.GetMethod(proc);
                                    if(innerMethodInfo != null) {
                                        methodInfo = innerMethodInfo;
                                        mexec = true;
                                        break;
                                    }
                                }
                            }
                            if(mexec) {
                                break;
                            }
                        }
                    }
                    if(methodInfo == null) {
                        o.Add("error", -5);
                        o.Add("description", "method not found");
                        return o;
                    } else {
                        pramInfo = methodInfo.GetParameters();
                    }
                } else {
                    o.Add("error", -4);
                    o.Add("description", "method argument is missing");
                    return o;
                }
                if(argumentCollection != null) {
                    foreach(object argument in argumentCollection) {
                        if(argument != null) {
                            if(pramInfo != null) {
                                if(pramInfo.Length == x) {
                                    o.Add("error", -3);
                                    o.Add("description", "Too many arguments.");
                                    return o;
                                }
                                if(pramInfo[x].ParameterType == argument.GetType()) {
                                    args.Add(argument);
                                } else {
                                    o.Add("error", -2);
                                    o.Add("description", "Argument " + x + ":" + pramInfo[x].Name +
                                    " expected type " + pramInfo[x].ParameterType.ToString() + ", " +
                                    " but got type " + argument.GetType().ToString() + ".");
                                    return o;
                                }
                                x++;
                            }
                        } else {
                            o.Add("error", -9);
                            o.Add("description", "Argument " + x + " was null.");
                            return o;
                        }
                    }
                }
                if(args.Count == x) {
                    try {
                        o.Add(methodInfo.Name, methodInfo.Invoke(null, args.ToArray()));
                    } catch(Exception e) {
                        e = Main.getInnermostException(e);
                        string msg = String.Format("Application Error {0} on Page:{1},Message:{2}, Stack Trace: {3}",
                        500,
                        "Responder=>GetMethod exception", e.Message, e.StackTrace);
                        o.Add("error", -500);
                        o.Add("description", "Internal server error: " + e.Source + ": " + e.Message);
                    }
                } else {
                    o.Add("error", -1);
                    o.Add("description", "Expected " + args.Count + " arguments, but got " + x + " arguments");
                }
                return o;
            }
        }
        /// <summary>
        /// Executes the AJAX responders.
        /// </summary>
        /// <param name="current">The current HttpContext.</param>
        /// <param name="session">The session.</param>
        /// <returns></returns>
        static bool executeResponders(HttpContext current, Session session) {
            string executionFilePath = current.Request.AppRelativeCurrentExecutionFilePath;
            try {
                /* if this is a request for the Admin responder page */
                if(executionFilePath.Contains(Main.AdminResponder)) {
                    if(session.Administrator) {
                        /* check if the user is trying to upload a file */
                        if(current.Request.ContentType.Contains("multipart/form-data")) {
                            /* full trust/iis6 upload */
                            Admin.Iis6Upload();
                            return true;
                        } else {
                            if(current.Response.ContentType == "text/html") {
                                current.Response.ContentType = "application/json";
                            }
                            current.Response.Write(ExecuteJSONResponders(true));
                            current.ApplicationInstance.CompleteRequest();
                            return true;
                        }
                    } else {
                        /* user tried to access admin responder without admin access */
                        setStatusCode(current, 403);
                        current.ApplicationInstance.CompleteRequest();
                        return true;
                    }
                } else if(executionFilePath.Contains(Main.Responder)) {
                    if(current.Response.ContentType == "text/html") {
                        current.Response.ContentType = "application/json";
                    }
                    current.Response.Write(ExecuteJSONResponders(false));
                    current.ApplicationInstance.CompleteRequest();
                    return true;
                }
                return false;
            } catch(Exception ex) {
                ("EVENT -> BeginRequest -> responder -> Exception: " + ex.Message).Debug(3);
                return false;
            }
        }
        #endregion
    }
}
