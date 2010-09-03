var boffo = function () {
    var doc = document,
        imgs = doc.images,
        bestSize = 0,
        bestImg;
    for (var i = 0; i < imgs.length; ++i) {
        var img = imgs[i];
        var size = img.width * img.height;
        if (size > bestSize) {
            bestSize = size;
            bestImg = img;
        }
    }
    location = 'http://jigsawr.org/?u=' + escape(bestImg.src) + '&d=24&j=1';
};