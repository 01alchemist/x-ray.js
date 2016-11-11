System.register(["./DataCache"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DataCache_1;
    var ImageLoader;
    return {
        setters:[
            function (DataCache_1_1) {
                DataCache_1 = DataCache_1_1;
            }],
        execute: function() {
            ImageLoader = (function () {
                function ImageLoader() {
                }
                ImageLoader.prototype.load = function (url, onLoad, onProgress, onError) {
                    var self = this;
                    var cached = DataCache_1.DataCache.getItem(url);
                    if (cached !== undefined) {
                        onLoad(cached);
                        return;
                    }
                    var image = document.createElement('img');
                    image.addEventListener('load', function (event) {
                        DataCache_1.DataCache.add(url, this);
                        if (onLoad)
                            onLoad(this);
                    }, false);
                    if (onProgress !== undefined) {
                        image.addEventListener('progress', function (event) {
                            onProgress(event);
                        }, false);
                    }
                    if (onError !== undefined) {
                        image.addEventListener('error', function (event) {
                            onError(event);
                        }, false);
                    }
                    if (ImageLoader.crossOrigin !== undefined)
                        image.crossOrigin = ImageLoader.crossOrigin;
                    image.src = url;
                    return image;
                };
                ImageLoader.crossOrigin = "*";
                return ImageLoader;
            }());
            exports_1("ImageLoader", ImageLoader);
        }
    }
});
//# sourceMappingURL=ImageLoader.js.map