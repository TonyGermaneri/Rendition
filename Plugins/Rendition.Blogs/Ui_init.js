var RenditionBlogsInit = function () {
    for (var x = 0; Rendition.UI.defaultPanelItems.length > x; x++) {
        if (Rendition.UI.defaultPanelItems[x].text === "Content") {
            Rendition.UI.defaultPanelItems.splice(x + 1, 0, {
                text: 'Blogs',
                message: 'Edit and create blogs.',
                src: '/admin/img/icons/newspaper.png',
                proc: function () {
                    Rendition.Commerce.BlogEditor();
                }
            },
        {
            text: 'Image Galleries',
            message: 'Create lists of images, apply filters and crop images.',
            src: '/admin/img/icons/pictures.png',
            proc: function () {
                Rendition.Commerce.GalleryEditor();
            }
        });
            break; //prevent endless loop
        }
    }
}
window.document.addEventListener('DOMContentLoaded', RenditionBlogsInit, false);