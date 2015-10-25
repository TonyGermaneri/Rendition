<%@ Page Language="C#" MasterPageFile="~/Header.Master" %>
<%@ Import Namespace="Rendition" %>
<asp:Content ID="title" ContentPlaceHolderID="title" Runat="Server">Default.aspx</asp:Content>
<asp:Content ID="metaDescription" ContentPlaceHolderID="description" Runat="Server">TODO: Replace this text.</asp:Content>
<asp:Content ID="keywords" ContentPlaceHolderID="keywords" Runat="Server">TODO: Replace this text with keywords.</asp:Content>
<asp:Content ID="head" ContentPlaceHolderID="head" Runat="Server"></asp:Content>
<asp:Content ID="adminTool" ContentPlaceHolderID="adminTool" Runat="Server">
    <button onclick="edit('~/header.master');">Default.aspx</button>
</asp:Content>
<asp:Content ID="leftAside" ContentPlaceHolderID="leftAside" Runat="Server">
</asp:Content>
<asp:Content ID="content" ContentPlaceHolderID="content" Runat="Server">
<%=Rendition.Commerce.SiteSection.GetSectionByName("Home").Value%>
<%=Rendition.Blogs.GetBlogByName("Home Page").Entries[0].Message%>

Sed diam nonummy nibh euismod tincidunt ut 
laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis
nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.
</asp:Content>
<asp:Content ID="rightAside" ContentPlaceHolderID="rightAside" Runat="Server">
Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat,
vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril 
delenit augue duis dolore te feugait nulla facilisi.
</asp:Content>
<asp:Content ID="footer" ContentPlaceHolderID="footer" Runat="Server">
Legere quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur 
mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum 
formas humanitatis per seacula quarta decima et quinta decima.
</asp:Content>