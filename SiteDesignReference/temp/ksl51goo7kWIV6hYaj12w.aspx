<%@ Page MasterPageFile="~/header.master" Language="C#" CodeBehind="~/list.aspx.cs" %>
<%@ Import Namespace="rendition" %>
<asp:Content ID="head" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>
<asp:Content ID="leftAside" ContentPlaceHolderID="leftAside" Runat="Server">
    <%
	list l = new list();
	List<commerce.property> properties = l.properties;
	List<commerce.item> item_list = l.item_list;
	if(l.item_list==null){
		Response.Redirect("/");
	}
	string listType=l.listType;
	string listTypeValue=l.listTypeValue;
	string filter = l.filter;
	char[] delimiters=new char[] {'_'};
	string currentValue = "";
	string[] filters=filter.Split(delimiters,StringSplitOptions.RemoveEmptyEntries);
	if(item_list==null){Response.Redirect("/");};
	if(item_list.Count>0){
	%>
	<div class="leftaside">
		<div class="filter">
			<%if(filters.Length>0){ %>
				<h2 style="padding:8px 12px 8px 12px;font-size:1.1em;margin:1px 0 0 0;border-bottom:none;">
					Remove Filter
				</h2>
				<table class="filtertable" style="width:100%;border-top:none;margin-top:-2px;">
				<%
				foreach(string flt in filters){
					string fltName = flt.Split('|')[0];
					string fltValue = flt.Split('|')[1];
				%>
					<%if(currentValue!=fltValue){%>
					<tr>
						<th>
							<%
								Response.Write(fltName);
							%>
						</th>
					</tr>
					<%}%>
					<tr>
						<td>
							<%
								Response.Write("<a href=\"list.aspx?"+l.listType+"="+l.listTypeValue+"&amp;page="+(l.page+1).ToString()+
								"&amp;filter="+Server.UrlEncode(filter.Replace(fltName+"|"+fltValue,""))+
								"\" title=\"Remove Filter For "+fltValue+"\">"+fltValue+"</a>");
								currentValue=fltValue;
							%>
						</td>
					</tr>
				<%
				}
				%></table><%
			}
			%>
			<%if(properties.Count>0){%>
			<h2 style="padding:8px 12px 8px 12px;font-size:1.1em;margin:1px 0 0 0;border-bottom:none;">
				Filter Selection
			</h2>
			<table class="filtertable" style="width:100%;border-top:none;margin-top:-2px;">
			<%
			string currentProperty="";
			string currentText="";
			string count = "";
			for(var y=0;properties.Count>y;y++){
				if((currentProperty.Trim().ToLower()!=properties[y].name.Trim().ToLower()||
				currentText.Trim().ToLower()!=properties[y].text.Trim().ToLower())
				&&properties[y].text.Trim().Length>0
				&&properties[y].showInFilter==true
				&&!filter.Trim().ToLower().Contains(properties[y].name.Trim().ToLower())) {
			%>
				<%if(currentProperty!=properties[y].name) {%>
				<tr>
					<th>
						<%if(currentProperty.Trim().ToLower()!=properties[y].name.Trim().ToLower()) {
							Response.Write(properties[y].name);
							currentProperty=properties[y].name;

						}%>
					</th>
				</tr>
				<%}%>
				<tr>
					<td>
						<%if(currentText.Trim().ToLower()!=properties[y].text.Trim().ToLower()) {
						   count=properties.FindAll(delegate(rendition.commerce.property p) {
							   return p.text.ToLower().Trim()==properties[y].text.ToLower().Trim()&&
							   properties[y].name.ToLower().Trim()==p.name.ToLower().Trim();
						   }).Count.ToString();
							Response.Write("<a href=\"list.aspx?"+l.listType+"="+l.listTypeValue+"&amp;page="+(l.page+1).ToString()+
							"&amp;filter="+Server.UrlEncode(filter+'_'+properties[y].name.Trim()+'|'+properties[y].text.Trim())+
							"\" title=\"Filter For "+properties[y].text.Trim()+"\">"+properties[y].text.Trim()+"&nbsp;("+count+")</a>");
							currentText=properties[y].text;
						}%>
					</td>
				</tr>
			<%}}%>
			</table>
			<%}%>
			
		</div>
		<%}else{%>
			Category does not exist!
		<%}%>
	</div>
</asp:Content>
<asp:Content ID="body" ContentPlaceHolderID="body" Runat="Server">
	<%
		site.session session = main.getCurrentSession();
		list l=new list();
		List<commerce.property> properties=l.properties;
		List<commerce.item> item_list=l.item_list;
		double avgRating=0;
		double star=0;
		string startSuffx="";
		string listType = l.listType;
		string listTypeValue = l.listTypeValue;
		int page = l.page;
		int prevPage = l.prevPage;
		int nextPage = l.nextPage;
		string filter=l.filter;
		int totalPages = l.totalPages;
		%>
	<div class="content">
		<div class="navigation">
			<div style="white-space:nowrap;">
				<div style="margin:2px 2px 2px 2px;text-align:center;padding:4px;">
					<a class="nav_button menu" onmouseover="javascript:new openMenu(document.getElementById('rpp'),this);">
						<span>&nbsp;</span> Items Per Page: <%if(main.getCurrentSession().records_per_page==9999){Response.Write("All");}else{Response.Write(main.getCurrentSession().records_per_page);};%>&nbsp;&nbsp;
					</a>
					<a href="list.aspx?page=1&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>" class=" nav_button ">
						<span>&lt;&lt;</span>&nbsp;
					</a>
					<a href="list.aspx?page=<%Response.Write(prevPage);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>" class=" nav_button ">
						<span>&lt;</span>&nbsp;
					</a>
					Page <%Response.Write(page+1);%> of <%l.totalPages.ToString().w(); %>
					<a href="list.aspx?page=<%Response.Write(nextPage);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>" class=" nav_button ">
						<span>&gt;</span>&nbsp;
					</a>
					<a href="list.aspx?page=<%Response.Write(totalPages);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>" class=" nav_button ">
						<span>&gt;&gt;</span>&nbsp;
					</a>
					<a class="nav_button menu" onmouseover="javascript:new openMenu(document.getElementById('orderby'),this);">
						<%Response.Write(l.orderByName);%>
					</a>
				</div>
				
			</div>
			<div style="text-align:center;">
				<%for(int x=0;l.totalPages>x;x++){%>
					<%if(page==x){%>
						<span class="nav_button  nav_not_selected nav_selected"><%Response.Write(x+1);%></span>
					<%}else{%>
						<a class="nav_button  nav_not_selected" href="list.aspx?page=<%Response.Write(x+1);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>">
							<%Response.Write(x+1);%>
						</a>
					<%}%>
				<%}%>
			</div>
			
		</div>
		<div class="list">
			<table>
				<tr>
				<%
				for(int x=l.from;l.to>x;x++) {
					string iid = 'd'+Guid.NewGuid().ToString().Replace("}","").Replace("{","");
					rendition.commerce.item i=item_list[x];
					string qtyInputId = Guid.NewGuid().encodeXMLId();
					%>
					<td>
						<div class="product">
							<h3 class="listRating" style="position:absolute;margin-left:15px;">
								<%list.getReviewStars(i,0).w();%>
							</h3>
							<a href="detail.aspx?item=<%i.itemNumber.w();%>">
								<div class="productListImage">
									<%if(i.images.Count>0){ %>
										<img src="<%i.listingImage.w();%>" alt="<%i.description.w();%>">
									<%}%>
								</div>
							</a>
							<a 
								style="height:30px;display:inline-block;"
								href="detail.aspx?item=<%i.itemNumber.w();%>" 
								title="<%i.description.w();%>">
								<%i.description.w();%>
								<%
								if(i.displayprice.Trim().Length==0){
										bool wholeSale = false;
										if(session.user!=null) {
											wholeSale = session.user.wholesaleDealer;
										};
										if (wholeSale) {
											i.wholeSalePrice.ToString("c").w();
										}else{
											if (i.IsOnSale) {
												i.salePrice.ToString("c").w();
											}else{
												i.price.ToString("c").w();
											};
										};
								}else{
									i.displayprice.w();
								};
								%>
							</a><br>
							<%if(i.form==null||i.formName=="NO FORM"){%>
								<input id="<%qtyInputId.w();%>" value="1" style="width:30px;">
								<button onclick="addToCart(null,{itemNumber:'<%i.number.w();%>',qty:document.getElementById('<%qtyInputId.w();%>').value},function(e){window.location='/cart.aspx'});">
									Add To Cart
								</button>
							<%}else{%>
								<button onclick="javascript:window.location='detail.aspx?item=<%i.itemNumber.w();%>';">
									Customize It
								</button>
							<%}%>
						</div>
					</td>
					<%if((x+1)%4==0){%>
					</tr><tr>
					<%}%>
				<%}%>
				</tr>
			</table>
		</div>
	</div>
	<div id="orderby" style="display:none;visibility:hidden;">
		<ul>
			<li class="subMenuItem">
				<a href="list.aspx?page=<%Response.Write(page+1);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>&amp;orderby=0&amp;filter=<%Response.Write(Server.UrlEncode(filter));%>">
					Best Selling
				</a>
			</li>
			<li class="subMenuItem">
				<a href="list.aspx?page=<%Response.Write(page+1);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>&amp;orderby=1&amp;filter=<%Response.Write(Server.UrlEncode(filter));%>">
					Order By Price Low to High
				</a>
			</li>
			<li class="subMenuItem">
				<a href="list.aspx?page=<%Response.Write(page+1);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>&amp;orderby=2&amp;filter=<%Response.Write(Server.UrlEncode(filter));%>">
					Order By Price High to Low
				</a>
			</li>
			<li class="subMenuItem">
				<a href="list.aspx?page=<%Response.Write(page+1);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>&amp;orderby=3&amp;filter=<%Response.Write(Server.UrlEncode(filter));%>">
					Order By Description A-Z
				</a>
			</li>
			<li class="subMenuItem">
				<a href="list.aspx?page=<%Response.Write(page+1);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>&amp;orderby=4&amp;filter=<%Response.Write(Server.UrlEncode(filter));%>">
					Order By Description Z-A
				</a>
			</li>
		</ul>
	</div>
	<div id="rpp"  class="subMenu" style="display:none;visibility:hidden;">
		<ul>
			<li class="subMenuItem">
				<a href="list.aspx?page=<%Response.Write(page+1);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>&amp;rpp=12&amp;filter=<%Response.Write(Server.UrlEncode(filter));%>">
					12 Items Per Page
				</a>
			</li>
			<li class="subMenuItem">
				<a href="list.aspx?page=<%Response.Write(page+1);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>&amp;rpp=24&amp;filter=<%Response.Write(Server.UrlEncode(filter));%>">
					24 Items Per Page
				</a>
			</li>
			<li class="subMenuItem">
				<a href="list.aspx?page=<%Response.Write(page+1);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>&amp;rpp=48&amp;filter=<%Response.Write(Server.UrlEncode(filter));%>">
					48 Items Per Page
				</a>
			</li>
			<li class="subMenuItem">
				<a href="list.aspx?page=<%Response.Write(page+1);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>&amp;rpp=120&amp;filter=<%Response.Write(Server.UrlEncode(filter));%>">
					120 Items Per Page
				</a>
			</li>
			<li class="subMenuItem">
				<a href="list.aspx?page=<%Response.Write(page+1);%>&amp;<%Response.Write(listType);%>=<%Response.Write(listTypeValue);%>&amp;rpp=9999&amp;filter=<%Response.Write(Server.UrlEncode(filter));%>">
					Show All
				</a>
			</li>
		</ul>
	</div>
</asp:Content>
<asp:Content ID="footer" ContentPlaceHolderID="footer" Runat="Server">

</asp:Content>