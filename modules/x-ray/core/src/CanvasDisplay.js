System.register(["./engine/math/Color"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Color_1;
    var CanvasDisplay;
    return {
        setters:[
            function (Color_1_1) {
                Color_1 = Color_1_1;
            }],
        execute: function() {
            CanvasDisplay = (function () {
                function CanvasDisplay(i_width, i_height, container) {
                    if (i_width === void 0) { i_width = 640; }
                    if (i_height === void 0) { i_height = 480; }
                    this.i_width = i_width;
                    this.i_height = i_height;
                    this.container = container;
                    this.canvas = document.createElement("canvas");
                    this.canvas.id = "giImageOutput";
                    this.canvas.style.backgroundColor = "#3C3C3C";
                    this.canvas.style.position = "absolute";
                    this.canvas.width = this.i_width;
                    this.canvas.height = this.i_height;
                    if (container) {
                        this.attachDom(container);
                    }
                }
                CanvasDisplay.prototype.attachDom = function (dom) {
                    this.container = dom;
                    this.container.appendChild(this.canvas);
                    this.ctx = this.canvas.getContext("2d");
                    this.imageData = this.ctx.getImageData(0, 0, this.i_width, this.i_height);
                    this.data = this.imageData.data;
                    this.onWindowResize();
                };
                CanvasDisplay.prototype.onWindowResize = function () {
                };
                CanvasDisplay.prototype.setResolution = function (width, height) {
                    this.i_width = width;
                    this.i_height = height;
                    this.canvas.width = width;
                    this.canvas.height = height;
                    this.imageData = this.ctx.getImageData(0, 0, this.i_width, this.i_height);
                    this.data = this.imageData.data;
                };
                CanvasDisplay.prototype.updatePixels = function (pixels) {
                    for (var y = 0; y < this.i_height; y++) {
                        for (var x = 0; x < this.i_width; x++) {
                            var i = y * (this.i_width * 4) + (x * 4);
                            var pi = y * (this.i_width * 3) + (x * 3);
                            this.data[i] = pixels[pi];
                            this.data[i + 1] = pixels[pi + 1];
                            this.data[i + 2] = pixels[pi + 2];
                            this.data[i + 3] = 255;
                        }
                    }
                    this.ctx.putImageData(this.imageData, 0, 0);
                };
                CanvasDisplay.prototype.updatePixelsRect = function (rect, pixels) {
                    for (var y = rect.yoffset; y < rect.yoffset + rect.height; y++) {
                        for (var x = rect.xoffset; x < rect.xoffset + rect.width; x++) {
                            var i = y * (this.i_width * 4) + (x * 4);
                            var pi = y * (this.i_width * 3) + (x * 3);
                            this.data[i] = pixels[pi];
                            this.data[i + 1] = pixels[pi + 1];
                            this.data[i + 2] = pixels[pi + 2];
                            this.data[i + 3] = 255;
                        }
                    }
                    this.ctx.putImageData(this.imageData, 0, 0);
                };
                CanvasDisplay.prototype.updateIndicator = function (rect) {
                    var color = Color_1.Color.random();
                    this.fillRect({ x: rect.xoffset, y: rect.yoffset, width: 4, height: 1 }, color);
                    this.fillRect({ x: rect.xoffset, y: rect.yoffset + 1, width: 1, height: 3 }, color);
                    this.fillRect({ x: rect.xoffset + rect.width - 4, y: rect.yoffset, width: 4, height: 1 }, color);
                    this.fillRect({ x: rect.xoffset + rect.width - 1, y: rect.yoffset + 1, width: 1, height: 3 }, color);
                    this.fillRect({ x: rect.xoffset, y: rect.yoffset + rect.height - 4, width: 1, height: 4 }, color);
                    this.fillRect({ x: rect.xoffset + 1, y: rect.yoffset + rect.height - 1, width: 3, height: 1 }, color);
                    this.fillRect({ x: rect.xoffset + rect.width - 4, y: rect.yoffset + rect.height - 1, width: 4, height: 1 }, color);
                    this.fillRect({ x: rect.xoffset + rect.width - 1, y: rect.yoffset + rect.height - 4, width: 1, height: 3 }, color);
                    this.ctx.putImageData(this.imageData, 0, 0);
                };
                CanvasDisplay.prototype.fillRect = function (rect, color) {
                    for (var y = rect.y; y < rect.y + rect.height; y++) {
                        for (var x = rect.x; x < rect.x + rect.width; x++) {
                            var i = y * (this.i_width * 4) + (x * 4);
                            this.data[i] = color.r * 255;
                            this.data[i + 1] = color.g * 255;
                            this.data[i + 2] = color.b * 255;
                            this.data[i + 3] = 255;
                        }
                    }
                    this.ctx.putImageData(this.imageData, 0, 0);
                };
                return CanvasDisplay;
            }());
            exports_1("CanvasDisplay", CanvasDisplay);
        }
    }
});
//# sourceMappingURL=CanvasDisplay.js.map