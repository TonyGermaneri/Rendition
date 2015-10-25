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
        /// The customization fields and assembily item selections.
        /// </summary>
        public class LineDetail {
            #region Instance Properties
            /// <summary>
            /// The detail Id primary key as found in the cartDetail table.
            /// </summary>
            public Guid CartDetailId { get; internal set; }
            /// <summary>
            /// The foreign key that links this record to 
            /// the cart table via cart.cartId = cartDetail.cartId.
            /// </summary>
            public Guid CartId { get; internal set; }
            /// <summary>
            /// The foreign key sessionId to whom this LineDetail belongs to.
            /// This table relates to visitors.sessionId = LineDetail.sessionId
            /// </summary>
            public Guid SessionId { get; internal set; }
            /// <summary>
            /// This is the unique Id of this field or assembily item selection.
            /// This is the same as cartDetailId.
            /// </summary>
            public Guid Id { get; internal set; }
            /// <summary>
            /// The key name of this input field.
            /// </summary>
            public string InputName { get; internal set; }
            /// <summary>
            /// The key value of this input field.
            /// </summary>
            public string Value { get; internal set; }
            #endregion
            #region Constructors
            /// <summary>
            /// Initializes a new instance of the <see cref="LineDetail"/> class.
            /// </summary>
            /// <param name="_cartDetailId">The _cart detail id.</param>
            /// <param name="_cartId">The _cart id.</param>
            /// <param name="_sessionId">The _session id.</param>
            /// <param name="_inputName">Name of the _input.</param>
            /// <param name="_value">The _value.</param>
            public LineDetail(Guid _cartDetailId, Guid _cartId, Guid _sessionId,
            string _inputName, string _value) {
                CartDetailId = _cartDetailId;
                CartId = _cartId;
                SessionId = _sessionId;
                Id = _cartDetailId;
                InputName = _inputName;
                Value = _value;
            }
            #endregion
        }
    }
}
