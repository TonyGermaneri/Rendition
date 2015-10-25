using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections;
namespace Rendition {
    /// <summary>
    /// This class hold information about file transfer
    /// to display on the user's upload dialog.
    /// A circular AJAX script is used on the client
    /// to interogate the server for this information.
    /// </summary>
    public class ProgressInfo {
        /// <summary>
        /// id of the upload instance
        /// </summary>
        public Guid TimerId { get; internal set; }
        /// <summary>
        /// current item (file) name being uploaded
        /// </summary>
        public string CurrentItemName { get; internal set; }
        /// <summary>
        /// total item (file) count
        /// </summary>
        public int TotalItemCount { get; internal set; }
        /// <summary>
        /// current item (file) count
        /// </summary>
        public int CurrentItemCount { get; internal set; }
        /// <summary>
        /// Total item (upload) size
        /// </summary>
        public int TotalItemSize { get; internal set; }
        /// <summary>
        /// Current item (file) size (individual item progress)
        /// </summary>
        public int CurrentItemSize { get; internal set; }
        /// <summary>
        /// Current size (upload) complete (total upload progress)
        /// </summary>
        public int CurrentSizeComplete { get; internal set; }
        /// <summary>
        /// When true, the upload is complete
        /// </summary>
        public bool Complete { get; internal set; }
        /// <summary>
        /// When the upload started
        /// </summary>
        public DateTime Started { get; internal set; }
        /// <summary>
        /// Last time the upload object was updated
        /// </summary>
        public DateTime Updated { get; internal set; }
        /// <summary>
        /// List of files uploaded
        /// </summary>
        public ArrayList UploadedFiles { get; internal set; }
        /// <summary>
        /// Initializes a new instance of the <see cref="ProgressInfo"/> class.
        /// </summary>
        /// <param name="_timerId">The _timer id.</param>
        public ProgressInfo(Guid _timerId) {
            TimerId = _timerId;
            CurrentItemName = "";
            TotalItemCount = 0;
            CurrentItemCount = 0;
            TotalItemSize = 0;
            CurrentItemSize = 0;
            CurrentSizeComplete = 0;
            Complete = false;
            UploadedFiles = new ArrayList();
            Started = DateTime.Now;
            Updated = DateTime.Now;
        }
    }
}
