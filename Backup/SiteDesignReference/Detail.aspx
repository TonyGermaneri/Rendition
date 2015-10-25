<%@ Page Language="C#" MasterPageFile="~/Header.Master" %>
<%@ Import Namespace="Rendition" %>
<asp:Content ID="title" ContentPlaceHolderID="title" Runat="Server"><%=Commerce.Item.CurrentItem.Description%></asp:Content>
<asp:Content ID="description" ContentPlaceHolderID="description" Runat="Server"><%=Commerce.Item.CurrentItem.Description%></asp:Content>
<asp:Content ID="keywords" ContentPlaceHolderID="keywords" Runat="Server"><%=Commerce.Item.CurrentItem.Keywords%></asp:Content>
<asp:Content ID="head" ContentPlaceHolderID="head" Runat="Server">
    <script type="text/javascript">
        var addToCart = function () {
            Rendition.Merchant.addToCart({
                form: document.getElementById('customizationForm'),
                qty: 1,
                itemNumber: '<%=Commerce.Item.CurrentItem.Number%>',
                callbackProcedure: function (e) {
                    window.location = '/cart.aspx'
                }
            });
        }
    </script>
</asp:Content>
<asp:Content ID="adminTool" ContentPlaceHolderID="adminTool" Runat="Server">
    <button onclick="edit('~/Detail.aspx');">Detail.aspx</button>
</asp:Content>
<asp:Content ID="header" ContentPlaceHolderID="header" Runat="Server">
    <h1><%=Commerce.Item.CurrentItem.Description%></h1>
</asp:Content>
<asp:Content ID="leftAside" ContentPlaceHolderID="leftAside" Runat="Server">
    
</asp:Content>
<asp:Content ID="content" ContentPlaceHolderID="content" Runat="Server">
    <%Commerce.Item i = Commerce.Item.CurrentItem;%>
    <%
        
        if(i.Thumbnails.Count>1){
            
            %>	
	<div>
		<%foreach(Commerce.Image img in i.Thumbnails){
			Commerce.Image d = img.Siblings.Find(delegate(Commerce.Image m) {
				return m.ImageType == ImageType.Detail;
			});
            if(d == null) {

            }
        
        %>
			<img
			src="<%=img.Url%>"
			alt="<%=i.Description%>"
			class="itemThumbnail"
			style="cursor:pointer;"
			imageId="<%=img.Id.ToString()%>"
			onclick="javascript:new Rendition.Merchant.Gallery({img:this,itemNumber:'<%=i.Number%>',nextText:'&rarr;',previousText:'&larr;',rect:{width:603,height:603},marginTop:1});"
			onmouseover="javascript:var m = document.getElementById('image');m.src = '<%=d.Url%>';m.setAttribute('imageId','<%=d.Id.ToString()%>');">
		<%}%>
	</div>
	<%}%>
    <img id="image" src="<%=i.GetImage(ImageType.Detail).Url%>"
    onclick="javascript:new Rendition.Merchant.Gallery({img:this,itemNumber:'<%=i.Number%>',nextText:'&rarr;',previousText:'&larr;',rect:{width:603,height:603},marginTop:1});"
    >
    <%=i.Html%>
    <button onclick="addToCart();">Add To Cart</button>
    <div id="customizationForm">
    <%if(i.Form.Name != "NO FORM") {%>
        <%=i.Form.Html%>
    <%}%>
    </div>
</asp:Content>
<asp:Content ID="rightAside" ContentPlaceHolderID="rightAside" Runat="Server">
    <h2>Your Cart</h2>
    <table class="rightAsideCart">
    <%foreach(Commerce.CartItem i in Rendition.Session.CurrentSession.Cart.Items) {%>
        <tr>
            <td><%=i.Item.Description%></td>
        </tr>
    <%}%>
    </table>
</asp:Content>
<asp:Content ID="footer" ContentPlaceHolderID="footer" Runat="Server">
    <table>
    <%List l = new List(Commerce.Item.CurrentItem.AltCategory.Name);
      foreach(Commerce.Item i in l.ItemList) {%>
        <td><%=i.Description%></td>
    <%}%>
    </table>
</asp:Content>