<%@ Page Language="C#" MasterPageFile="~/Header.Master" %>
<%@ Import Namespace="Rendition" %>
<asp:Content ID="title" ContentPlaceHolderID="title" Runat="Server">Cart</asp:Content>
<asp:Content ID="description" ContentPlaceHolderID="description" Runat="Server">Your Cart</asp:Content>
<asp:Content ID="keywords" ContentPlaceHolderID="keywords" Runat="Server">Cart</asp:Content>
<asp:Content ID="head" ContentPlaceHolderID="head" Runat="Server">
    <script type="text/javascript">
        recalc = function () {
            Rendition.Merchant.recalculateCart({
                form: document.getElementById('zipForm'),
                recalculateCallbackProcedure: function (e, inst) {
                    $('#subTotal').html('$' + e.subTotal.toFixed(2));
                    $('#discountTotal').html('-$' + e.discountTotal.toFixed(2));
                    $('#taxTotal').html('$' + e.taxTotal.toFixed(2));
                    $('#estShipTotal').html('$' + e.estShipTotal.toFixed(2));
                    $('#grandTotal').html('$' + e.grandTotal.toFixed(2));
                }
            });
            return;
        }
    </script>
</asp:Content>
<asp:Content ID="adminTool" ContentPlaceHolderID="adminTool" Runat="Server">
    <button onclick="edit('~/Cart.aspx');">Cart.aspx</button>
</asp:Content>
<asp:Content ID="header" ContentPlaceHolderID="header" Runat="Server">
    <h1>Your Cart</h1>
</asp:Content>
<asp:Content ID="leftAside" ContentPlaceHolderID="leftAside" Runat="Server">
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut 
laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation 
ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor 
in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis 
at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue 
duis dolore te feugait nulla facilisi. 
</asp:Content>
<asp:Content ID="content" ContentPlaceHolderID="content" Runat="Server">
    <%Rendition.Session session = Rendition.Session.CurrentSession;
      int lineNumber = 0;
      %>  
    <table class="cart" id="cart">
        <tr>
            <td>
                &nbsp;
            </td>
            <td>
                Description
            </td>
            <td>
                Quantity
            </td>
            <td>
                Price
            </td>
            <td>
                Line
            </td>
        </tr>
    <%foreach(Commerce.CartItem c in session.Cart.Items){%>
        <tr>
            <td>
                <%=(++lineNumber)%>
            </td>
            <td>
                <%=c.Item.Description%>
            </td>
            <td>
                <input class="cartQty" 
                name="<%=c.CartId.EncodeXMLId()%>" 
                id="<%=c.CartId.EncodeXMLId()%>" 
                value="<%=c.Qty%>">
            </td>
            <td>
                <%=c.Price.ToString("c")%>
            </td>
            <td>
                <%=(c.Price*c.Qty).ToString("c")%>
            </td>
        </tr>
        <%if(c.Item.Form.Name != "NO FORM") {%>
            <tr colspan="5">
                <%=c.Form.Html%>
            </tr>
        <%}%>
    <%}%>
    </table>
    <table class="cartTotals">
        <tr>
            <td>
               Sub Total
            </td>
            <td>
                <%=session.Cart.SubTotal.ToString("c")%>
            </td>
        </tr>
        <tr>
            <td>
               Discount Total
            </td>
            <td>
                <%=session.Cart.DiscountTotal.ToString("c")%>
            </td>
        </tr>
        <tr>
            <td>
               Shipping Total
            </td>
            <td>
                <%=session.Cart.EstShipTotal.ToString("c")%>
            </td>
        </tr>
        <tr>
            <td>
               Tax Total
            </td>
            <td>
                <%=session.Cart.TaxTotal.ToString("c")%>
            </td>
        </tr>
        <tr>
            <td>
               Grand Total
            </td>
            <td>
                <%=session.Cart.GrandTotal.ToString("c")%>
            </td>
        </tr>
    </table>
    <button onclick="recalc();">
        Update Cart
    </button>
</asp:Content>
<asp:Content ID="rightAside" ContentPlaceHolderID="rightAside" Runat="Server">
Nam liber tempor cum soluta nobis eleifend option congue nihil 
imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus 
legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius 
quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium 
lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum
formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur
parum clari, fiant sollemnes in futurum.
</asp:Content>
<asp:Content ID="footer" ContentPlaceHolderID="footer" Runat="Server">
Nam liber tempor cum soluta nobis eleifend option congue nihil 
imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus 
legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius 
quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium 
lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum
formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur
parum clari, fiant sollemnes in futurum.
</asp:Content>