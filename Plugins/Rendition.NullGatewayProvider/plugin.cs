using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Rendition;
namespace Rendition {
    /// <summary>
    /// This is a test gateway provider.  For use before you have a real provider but still
    /// want to test the order placing system.
    /// </summary>
    public class NullGatewayProvider : Plugin {
        /// <summary>
        /// Initializes a new instance of the <see cref="NullGatewayProvider"/> class.
        /// </summary>
        public NullGatewayProvider(){
            Rendition.Site.CurrentSite.OpeningPaymentGateway+=new EventHandler(gatewayProcedure);
		}
        /// <summary>
        /// This is not a full Luhn 10 algorithm, just for testing.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns></returns>
        public static bool simpleLuhn10Check(string x) {
            return x
                .Where(c => Char.IsDigit(c))
                .Reverse()
                .SelectMany((c, i) => ((c - '0') << (i & 1)).ToString())
                .Sum(c => c - '0') % 10 == 0;
        }
        /// <summary>
        /// Gateway procedure.  This would normally use the gateway's API to
        /// authorize the charge and return state data.  In this version it does a
        /// fake Luhn 10 check and returns success (args.Sucess = true;)
        /// </summary>
        /// <param name="sender">The sender.</param>
        /// <param name="e">The <see cref="System.EventArgs"/> instance containing the event data.</param>
        public void gatewayProcedure(object sender, EventArgs e) {
            PaymentGatewayEventArgs args = (PaymentGatewayEventArgs)e;
            /* don't use the default gateway processor anymore */
            args.PreventDefault = true;
            /* declare the transaction was successful */
            args.Success = true;
        }
    }
}
