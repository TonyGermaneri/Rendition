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
namespace Rendition {
    public partial class Commerce {
        /// <summary>
        /// Represents a shipment.  One box with a tracking number, date shipped etc.
        /// Orders have a list of shipments that have occured for that order.
        /// </summary>
        public class Shipment {
            #region Instance Properties
            /// <summary>
            /// The Address the shipment is being shipped to.
            /// </summary>
            public Commerce.Address Address { get; internal set; }
            /// <summary>
            /// The order being shipped.
            /// </summary>
            public Commerce.Order Order { get; internal set; }
            /// <summary>
            /// The id of the shipment in the dbo.addressUpdate table.
            /// </summary>
            public Guid Id { get; internal set; }
            /// <summary>
            /// The shipmentNumber of the shipment in the dbo.cart table.
            /// </summary>
            public string ShipmentNumber { get; internal set; }
            /// <summary>
            /// The tracking number of the shipment.
            /// </summary>
            public string Tracking { get; internal set; }
            /// <summary>
            /// The date the shipping terminal reports the item being shipped.
            /// </summary>
            public string DateShipped { get; internal set; }
            /// <summary>
            /// The actual weight of the shipment.
            /// </summary>
            public string ActualWeight { get; internal set; }
            /// <summary>
            /// Actual service used as reported by the shipping terminal.
            /// </summary>
            public string ActualService { get; internal set; }
            /// <summary>
            /// Actual cost of the shipment.
            /// </summary>
            public string ActualCost { get; internal set; }
            /// <summary>
            /// Actual billed weight.
            /// </summary>
            public string ActualBilledWeight { get; internal set; }
            /// <summary>
            /// Actual package length.
            /// </summary>
            public string PackageLength { get; internal set; }
            /// <summary>
            /// Actual package width.
            /// </summary>
            public string PackageWidth { get; internal set; }
            /// <summary>
            /// Actual package height.
            /// </summary>
            public string PackageHeight { get; internal set; }
            /// <summary>
            /// Third part account used if any.
            /// </summary>
            public string ThirdPartyAccount { get; internal set; }
            /// <summary>
            /// Void status. Value varries by Carrier.
            /// </summary>
            public string VoidStatus { get; internal set; }
            /// <summary>
            /// Date the email was sent about this shipment.  Inserting routines should leave this column null.
            /// </summary>
            public DateTime EmailSent { get; internal set; }
            /// <summary>
            /// The date the record was added to the database.
            /// </summary>
            public DateTime AddDate { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="Shipment"/> class.
            /// </summary>
            /// <param name="_address">The _address.</param>
            /// <param name="_order">The _order.</param>
            /// <param name="_id">The _id.</param>
            /// <param name="_shipmentNumber">The _shipment number.</param>
            /// <param name="_tracking">The _tracking.</param>
            /// <param name="_dateShipped">The _date shipped.</param>
            /// <param name="_actualWeight">The _actual weight.</param>
            /// <param name="_actualService">The _actual service.</param>
            /// <param name="_actualCost">The _actual cost.</param>
            /// <param name="_actualBilledWeight">The _actual billed weight.</param>
            /// <param name="_packageLength">Length of the _package.</param>
            /// <param name="_packageWidth">Width of the _package.</param>
            /// <param name="_packageHeight">Height of the _package.</param>
            /// <param name="_thirdPartyAccount">The _third party account.</param>
            /// <param name="_voidStatus">The _void status.</param>
            /// <param name="_emailSent">The _email sent.</param>
            /// <param name="_addDate">The _add date.</param>
            public Shipment(Commerce.Address _address, Commerce.Order _order, Guid _id, string _shipmentNumber,
            string _tracking, string _dateShipped, string _actualWeight, string _actualService, string _actualCost,
            string _actualBilledWeight, string _packageLength, string _packageWidth, string _packageHeight,
            string _thirdPartyAccount, string _voidStatus, DateTime _emailSent, DateTime _addDate) {
                Address = _address;
                Order = _order;
                Id = _id;
                ShipmentNumber = _shipmentNumber;
                Tracking = _tracking;
                DateShipped = _dateShipped;
                ActualWeight = _actualWeight;
                ActualService = _actualService;
                ActualCost = _actualCost;
                ActualBilledWeight = _actualBilledWeight;
                PackageLength = _packageLength;
                PackageWidth = _packageWidth;
                PackageHeight = _packageHeight;
                ThirdPartyAccount = _thirdPartyAccount;
                VoidStatus = _voidStatus;
                EmailSent = _emailSent;
                AddDate = _addDate;
            }
            #endregion
            #region Instance Methods
            /// <summary>
            /// Gets the best shipment.
            /// </summary>
            /// <param name="shipments">The shipments.</param>
            /// <returns></returns>
            public static Commerce.Shipment GetBestShipment(List<Commerce.Shipment> shipments) {
                /* check for voided numbers and add them to a list */
                List<string> voidedTrackingNumbers = new List<string>();
                List<Commerce.Shipment> unvoidedShipments = new List<Commerce.Shipment>();
                foreach(Commerce.Shipment shipment in shipments) {
                    string voidStatus = shipment.VoidStatus.Trim().ToLower();
                    if(voidStatus == "y" || voidStatus == "true" || voidStatus == "voided" || voidStatus == "void" || voidStatus == "yes") {
                        voidedTrackingNumbers.Add(shipment.Tracking);
                    }
                }
                /* go through again and find all the shipments (hopefully just one) that are not voided */
                foreach(Commerce.Shipment shipment in shipments) {
                    bool addShip = true;
                    foreach(string trackingNo in voidedTrackingNumbers) {
                        if(trackingNo == shipment.Tracking) {
                            addShip = false;
                        }
                    }
                    if(addShip) {
                        unvoidedShipments.Add(shipment);
                    }
                }
                /* there's more than one?  Than try and find the lead tracking number */
                if(unvoidedShipments.Count > 1) {
                    unvoidedShipments.Sort(delegate(Commerce.Shipment s1, Commerce.Shipment s2) {
                        int t1 = 0;
                        int t2 = 0;
                        try {
                            if(s1.Tracking.Length > 4) {
                                int.TryParse(s1.Tracking.Substring(1, 5), out t1);
                            }
                            if(s2.Tracking.Length > 4) {
                                int.TryParse(s2.Tracking.Substring(1, 5), out t2);
                            }
                        } catch(Exception e) {
                            (e.Message).Debug(8);
                        }
                        return t1.CompareTo(t2);
                    });
                }
                return unvoidedShipments[0];
            }
            #endregion
        }
    }
}
