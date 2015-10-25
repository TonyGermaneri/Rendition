<%@ Page Language="C#" MasterPageFile="~/Header.Master" %>
<%@ Import Namespace="Rendition" %>
<asp:Content ID="beforeHtml" ContentPlaceHolderID="beforeHtml" Runat="Server">
<%
    // Create a list of items using the default request key "category"
    List l = List.CurrentList;
%>
</asp:Content>
<asp:Content ID="title" ContentPlaceHolderID="title" Runat="Server"><%=List.CurrentList.Meta.Title%></asp:Content>
<asp:Content ID="description" ContentPlaceHolderID="description" Runat="Server"><%=List.CurrentList.Meta.MetaDescription%></asp:Content>
<asp:Content ID="keywords" ContentPlaceHolderID="keywords" Runat="Server"><%=List.CurrentList.Meta.MetaKeywords%></asp:Content>
<asp:Content ID="adminTool" ContentPlaceHolderID="adminTool" Runat="Server">
    <button onclick="edit('~/List.aspx');">List.aspx</button>
</asp:Content>
<asp:Content ID="header" ContentPlaceHolderID="header" Runat="Server">
    <%List l = List.CurrentList;%>
    <h1><%=l.CategoryName%></h1>
    <h2><%=l.Meta.Title%></h2>
    <h3><%=l.Meta.MetaDescription%></h3>
    <h4><%=l.Meta.MetaKeywords%></h4>
    <%=l.Section.Value%>
</asp:Content>
<asp:Content ID="leftAside" ContentPlaceHolderID="leftAside" Runat="Server">
<%
    List l = List.CurrentList;
    if(l.ItemList == null) { Response.Redirect("/"); };
    if(l.ItemList.Count > 0 && (l.HasFilters || l.HasPriceFilters)) {%>
		<div class="filter">
			<%if(l.HasRemoveFilters){%>
			<h2>
				Remove Filter
			</h2>
			<%l.RemoveFilterTable.w();}%>
			<%if(!Request.QueryString.ToString().Contains("Price%7c")){%>
			<h2>
				Shop by Price
			</h2>
			<%l.PriceFilterTable.w();}%>
			<%if(l.HasFilters){%>
			<h2>
				Narrow Your Search
			</h2>
			<%l.FilterTable.w();}%>
		</div>
	<%}%>
</asp:Content>
<asp:Content ID="content" ContentPlaceHolderID="content" Runat="Server">
    <%List l = List.CurrentList;%>
    <table class="itemList">
        <tr>
        <%int length = l.ItemList.Count;
          for(int x = 0; length > x; x++) {
              Commerce.Item i = l.ItemList[x];%>
            <td>
                <a href="/Detail.aspx?item=<%=i.Number%>">
                    <img src="<%=i.GetImage(ImageType.Listing).Url%>" alt="<%=i.Description.h()%>">
                </a>
            </td>
            <%if( x % 3 == 0 && x > 0 ){ %>
            </tr><tr>
            <%}%>
        <%}%>
        </tr>
    </table>
</asp:Content>
<asp:Content ID="rightAside" ContentPlaceHolderID="rightAside" Runat="Server">
    <table class="rightAsideCart">
    <%
        foreach(Commerce.CartItem i in Rendition.Session.CurrentSession.Cart.Items) {%>
        <tr>
            <td><%=i.Item.Description%></td>
        </tr>
    <%}%>
    </table>
</asp:Content>