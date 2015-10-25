<%@ Page MasterPageFile="~/header.master" Language="C#" %>
<%@ Import Namespace="Rendition" %>
<asp:Content ID="title" ContentPlaceHolderID="title" Runat="Server">Checkout</asp:Content>
<asp:Content ID="description" ContentPlaceHolderID="description" Runat="Server"></asp:Content>
<asp:Content ID="keywords" ContentPlaceHolderID="keywords" Runat="Server"></asp:Content>
<asp:Content ID="head" ContentPlaceHolderID="head" Runat="Server">
	<script type="text/javascript">
	    $(function () {
	        var g = function (i) {
	            var obj = document.getElementById(i);
	            if (obj) {
	                return obj;
	            } else {
	                return { value: '' };
	            }
	        }
	        g('secNumber').value = '';
	        g('expYear').value = '';
	        g('expMonth').value = '';
	        g('cardNumber').value = '';
	        g('nameOnCard').value = '';
	        var a = function () {
	            if (window.loggedon == false) {
	                window.location.reload(true);
	            }
	        }
	        if (window.loggedon == false) {
	            Rendition.Merchant.LogOn({
	                message: '<h1 style="border-bottom:solid 1px #042ec8;font-size:17px;margin:5px;">' +
					'Before you checkout please provide the following information.</h1>' +
					'<div style="font-size:12px;margin:5px;"><b style="text-decoration:underline;">If you are a new customer:</b>' +
					'<br>Enter your email address, create a new password and click "Create New Account".' +
					'<br><a target="_blank" href="/logonHelp.aspx">If you need help logging on click here</a><br><br><b style="text-decoration:underline;">If you\'re an existing customer:</b><br>Enter your email address and ' +
					'password and then click "LogOn".</div>',
	                callbackProcedure: a,
	                cancelCallbackProcedure: function () {
	                    window.history.go(-1);
	                },
	                cancelButtonInnerHTML: 'Back',
	                width: 460,
	                height: 280,
	                forgotPasswordLinkInnerHTML: '<div style="margin-top:18px;">Forgot your password?</div>'
	            });
	        }
	        recalc = function (hideDialog) {
	            Rendition.Merchant.recalculateCart({
	                form: document.getElementById('checkoutForm'),
	                hideDialog: hideDialog,
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
	        window.setCode = function (obj) {
	            var code = obj.value;
	            Rendition.Merchant.setDiscountCode({
	                discountCode: code,
	                callbackProcedure: recalc
	            });
	        }
	        window.placeOrder = function (obj) {
	            Rendition.Merchant.placeOrder({
	                button: obj,
	                form: document.getElementById('checkoutForm'),
	                successCallbackProcedure: function (e) {
	                    window.location = '/Default.aspx?orderNumber=' + e.orderNumber;
	                }
	            });
	        }
	    });
	</script>
</asp:Content>
<asp:Content ID="adminTool" ContentPlaceHolderID="adminTool" Runat="Server">
    <button onclick="edit('~/Checkout.aspx');">Checkout.aspx</button>
</asp:Content>
<asp:Content ID="content" ContentPlaceHolderID="content" Runat="Server">
	<%
        Rendition.Session session = Rendition.Session.CurrentSession;
		if(session.Cart.Items.Count==0){
			Response.Redirect(Rendition.Site.CurrentSite.Defaults.EmptyCartPage);
		}
        Commerce.Address billTo = session.Cart.BillToAddress;
        Commerce.Address shipTo = session.Cart.ShipToAddress;
	%>
	<div>
		<button onclick="javascript:recalc();">
			Update Checkout Form
		</button>
		<button onclick="javascript:placeOrder(this);">
			Place Order
		</button>
	</div>
	<div id="checkoutForm" class="checkoutForm">
		<input name="termId" value="<%if(session.User!=null){session.User.TermId.w();}else{("0").w();}%>" type="hidden">
		<input name="billToContactId" value="<%=billTo.Id.ToString()%>" type="hidden">
		<input name="shipToContactId" value="<%=shipTo.Id.ToString()%>" type="hidden">
		<table style="border:solid 1px #D0D0D0;">
			<tr>
				<td>
					<h2>Bill To </h2>
					<div class="checkoutSubForm">
						<!--bill to-->
						<table>
							<tr>
								<th>
									First
								</th>
								<td>
									<input title="Bill To First Name" id="billToFirstName" name="billToFirstName" value="<%=billTo.FirstName%>">
								</td>
							</tr>
							<tr>
								<th>
									Last
								</th>
								<td>
									<input title="Bill To Last Name" id="billToLastName" name="billToLastName" value="<%=billTo.LastName%>">
								</td>
							</tr>
							<tr>
								<th>
									Address Line 1
								</th>
								<td>
									<input title="Bill To Addresss" id="billToAddress1" name="billToAddress1" value="<%=billTo.Address1%>">
								</td>
							</tr>
							<tr>
								<th>
									Address Line 2
								</th>
								<td>
									<input title="Bill To Address Line 2" id="billToAddress2" name="billToAddress2" value="<%=billTo.Address2%>">
								</td>
							</tr>
							<tr>
								<th>
									City
								</th>
								<td>
									<input title="Bill To City" id="billToCity" name="billToCity" value="<%=billTo.City%>">
								</td>
							</tr>
							<tr>
								<th>
									State
								</th>
								<td>
									<input title="Bill To First State" id="billToState" name="billToState" value="<%=billTo.State%>">
								</td>
							</tr>
							<tr>
								<th>
									Zip
								</th>
								<td>
									<input title="Bill To Zip" id="billToZip" name="billToZip" value="<%=billTo.Zip%>">
								</td>
							</tr>
							<tr>
								<th>
									Country
								</th>
								<td>
									<select title="Bill To Country" id="billToCountry" name="billToCountry">
                                        <option value="U.S.A.">U.S.A.</option>
										<%foreach(Commerce.Country c in Commerce.Country.All) {%>
											<option <%if(billTo.Country.Trim().ToUpper()==c.Name.Trim().ToUpper()){%>selected<%}%> value="<%c.Name.w();%>"><%c.Name.w();%></option>
										<%}%>
									</select>
								</td>
							</tr>
							<tr>
								<th>
									Home Phone
								</th>
								<td>
									<input title="Bill To Home Phone" id="billToHomePhone" name="billToHomePhone" value="<%=billTo.HomePhone%>">
								</td>
							</tr>
							<tr>
								<th>
									Work Phone
								</th>
								<td>
									<input title="Bill To Work Phone" id="billToWorkPhone" name="billToWorkPhone" value="<%=billTo.WorkPhone%>">
								</td>
							</tr>
						</table>
					</div>
				</td>
				<td>
					<h2>Ship To </h2>
					<div class="checkoutSubForm">
						<!--ship to-->
						<table>
							<tr>
								<td colspan="2">
									<button onclick="javascript:Rendition.Merchant.copyShipTo();recalc(true);">
										Same as Bill To
									</button>
								</td>
							</tr>
							<tr>
								<th>
									First
								</th>
								<td>
									<input title="Ship To First Name" id="shipToFirstName" name="shipToFirstName" value="">
								</td>
							</tr>
							<tr>
								<th>
									Last
								</th>
								<td>
									<input title="Ship To Last Name" id="shipToLastName" name="shipToLastName" value="">
								</td>
							</tr>
							<tr>
								<th>
									Address Line 1
								</th>
								<td>
									<input title="Ship To Address 1" id="shipToAddress1" name="shipToAddress1" value="">
								</td>
							</tr>
							<tr>
								<th>
									Address Line 2
								</th>
								<td>
									<input title="Ship To Address 2" id="shipToAddress2" name="shipToAddress2" value="">
								</td>
							</tr>
							<tr>
								<th>
									City
								</th>
								<td>
									<input title="Ship To City" id="shipToCity" name="shipToCity" value="">
								</td>
							</tr>
							<tr>
								<th>
									State
								</th>
								<td>
									<input title="Ship To State" id="shipToState" name="shipToState" value="">
								</td>
							</tr>
							<tr>
								<th>
									Zip
								</th>
								<td>
									<input
									onchange="javascript:recalc(true);"
									title="Ship To Zip" id="shipToZip" name="shipToZip" value="">
								</td>
							</tr>
							<tr>
								<th>
									Country
								</th>
								<td>
									<select title="Ship To Country" id="shipToCountry" name="shipToCountry" value="">
                                        <option value="U.S.A.">U.S.A.</option>
										<%foreach(Commerce.Country c in Commerce.Country.All) {%>
											<option <%if(shipTo.Country.Trim().ToUpper()==c.Name.Trim().ToUpper()){%>selected<%}%> value="<%c.Name.w();%>"><%c.Name.w();%></option>
										<%}%>
									</select>
								</td>
							</tr>
							<tr>
								<th>
									Home Phone
								</th>
								<td>
									<input title="Ship To Home Phone" id="shipToHomePhone" name="shipToHomePhone" value="">
								</td>
							</tr>
							<tr>
								<th>
									Work Phone
								</th>
								<td>
									<input title="Ship To Work Phone" id="shipToWorkPhone" name="shipToWorkPhone" value="">
								</td>
							</tr>
			
							<tr>
								<th>
									Email me when my item ships
								</th>
								<td>
									<input 
									<%if(shipTo.SendShipmentUpdates){("checked").w();};%> 
									type="checkbox" title="Send Shipment Updates" name="shipToSendShipmentUpdates">
								</td>
							</tr>
							<tr>
								<th>
									Special Delivery Instructions
								</th>
								<td>
									<textarea title="Special Delivery Instructions"  name="shipToSpecialInstructions" value="" style="height:83px;"></textarea>
								</td>
							</tr>
							<tr>
								<th>
									Shipping Service
								</th>
								<td>
									<select onchange="javascript:recalc(true);" name="shipToRateId" id="<%shipTo.Id.EncodeXMLId().w();%>">
									<%foreach(Commerce.Rate r in shipTo.Rates){
										if(r.ShowsUpInRetailCart || 
                                        (session.Wholesale == 1 && r.ShowsUpInWholesaleCart)){%>
											<option <%if(r.Id==shipTo.Rate.Id){%>selected="selected"<%}%> value="<%r.Id.ToString().w();%>">
												<%r.Name.w();%> $<%r.EstShippingCost.ToString("f").w();%>
											</option>
										<%}else if(shipTo.Rates.Count==1){%>
											<option selected="selected" value="-1">
												<%if(shipTo.Zip.Length>0){%>
													Unrecognized ZIP code
												<%}else{%>
													Enter Your ZIP code
												<%}%>
											</option>
										<%}
									}%>
									</select>
								</td>
							</tr>
						</table>
					</div>
				</td>
				<td>
				<h2>Totals</h2>
				    <div class="checkoutTotals" >
						<table>
							<tr>
								<th>
									Sub Total
								</th>
								<td id="subTotal">
									$<%session.Cart.SubTotal.ToString("f").w();%>
								</td>
							</tr>
                            <tr>
								<th>
									Sales Tax Total
								</th>
								<td id="taxTotal">
									$<%session.Cart.TaxTotal.ToString("f").w();%>
								</td>
							</tr>
							<tr>
								<th>
									Shipping Total
								</th>
								<td id="estShipTotal">
									$<%session.Cart.EstShipTotal.ToString("f").w();%>
								</td>
							</tr>

							<tr>
								<th>
									Discounted
								</th>
								<td id="discountTotal">
									-$<%session.Cart.DiscountTotal.ToString("f").w();%>
								</td>
							</tr>
							<tr>
								<th>
									Grand Total
								</th>
								<td id="grandTotal">
									$<%session.Cart.GrandTotal.ToString("f").w();%>
								</td>
							</tr>
						</table>
					</div>
					<h2>Comments &amp; Discount Code</h2>
					<div class="checkoutSubForm">
						<!--ship to-->
						<table>
							<tr>
								<th>
									Comments
								</th>
								<td>
									<textarea title="Order Comments" name="comments" value=""></textarea>
								</td>
							</tr>
							<tr>
								<th>
									Discount Code
								</th>
								<td>
									<input onchange="javascript:window.setCode(this);" title="Discount Code" name="discountCode" value="">
								</td>
							</tr>
						</table>
					</div>
					<%if(session.User!=null){if(session.User.TermId!=0){
                    Commerce.Term trm = Commerce.Term.All.Find(delegate(Commerce.Term t) {
						return t.Id == session.User.TermId;
					});%>
						<h2 style="margin-top:7px;">Terms: <%trm.Name.w();%></h2>
						<div class="checkoutSubForm"  style="border:solid 1px #D0D0D0;">
							<table>
								<tr>
									<th>
										Purchase Order Number
									</th>
									<td>
										<input title="Purchase Order Number" name="ponumber" value="">
									</td>
								</tr>
								<tr>
									<th>
										Manifest Number (optional)
									</th>
									<td>
										<input title="Manifest Number" name="manifestnumber" value="">
									</td>
								</tr>
							</table>
						</div>
					<%}else{%>
					<h2 style="margin-top:7px;">Credit Card</h2>
					<div class="creditCardForm checkoutSubForm">
						<table>
							<tr>
								<th>
									Name On Card
								</th>
								<td>
									<input title="Name On Credit Card" name="nameOnCard" id="nameOnCard">
								</td>
							</tr>
							<tr>
								<th>
									Card Number
								</th>
								<td>
									<input title="Credit Card Number" name="cardNumber" id="cardNumber">
								</td>
							</tr>
							<tr>
								<th>
									Expiration Date
								</th>
								<td>
									<table>
										<tr>
											<th>
												Month
											</th>
											<td>
												<select title="Credit Card Experation Month" name="expMonth" id="expMonth">
													<option value="01">01</option>
													<option value="02">02</option>
													<option value="03">03</option>
													<option value="04">04</option>
													<option value="05">05</option>
													<option value="06">06</option>
													<option value="07">07</option>
													<option value="08">08</option>
													<option value="09">09</option>
													<option value="10">10</option>
													<option value="11">11</option>
													<option value="12">12</option>
												</select>
											</td>
											<th>
												Year
											</th>
											<td>
												<select title="Credit Card Experation Year" name="expYear" id="expYear">
												<%for(int x=0;15>x;x++){%>
													<%string year = DateTime.Now.AddYears(x).Year.ToString().Substring(2);%>
													<option value="<%year.w();%>"><%year.w();%></option>
												<%}%>
												</select>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<th>
									Security Code
								</th>
								<td>
									<input title="Credit Card Security Code" name="secNumber" id="secNumber">
								</td>
							</tr>
						</table>
						
					</div>
					<%}}%>
				</td>
			</tr>
		</table>
		<div>
			<button onclick="javascript:recalc();">
				Update
			</button>
			<button onclick="javascript:placeOrder(this);">
				Place Order
			</button>
		</div>
	</div>
</asp:Content>
