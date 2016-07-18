System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ColorRef, Color;
    return {
        setters:[],
        execute: function() {
            ColorRef = (function () {
                function ColorRef(index, data) {
                    this.index = index;
                    this.data = data;
                }
                Object.defineProperty(ColorRef.prototype, "r", {
                    get: function () {
                        return this.data[this.index];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ColorRef.prototype, "g", {
                    get: function () {
                        return this.data[this.index + 1];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ColorRef.prototype, "b", {
                    get: function () {
                        return this.data[this.index + 2];
                    },
                    enumerable: true,
                    configurable: true
                });
                return ColorRef;
            }());
            exports_1("ColorRef", ColorRef);
            Color = (function () {
                function Color(r, g, b) {
                    if (r === void 0) { r = 0; }
                    if (g === void 0) { g = 0; }
                    if (b === void 0) { b = 0; }
                    this.r = r;
                    this.g = g;
                    this.b = b;
                }
                Color.prototype.directWrite = function (mem, offset) {
                    mem[offset++] = this.r;
                    mem[offset++] = this.g;
                    mem[offset++] = this.b;
                    return offset;
                };
                Color.prototype.directRead = function (mem, offset) {
                    this.r = mem[offset++];
                    this.g = mem[offset++];
                    this.b = mem[offset++];
                    return offset;
                };
                Color.prototype.read = function (memory) {
                    this.r = memory.readFloat();
                    this.g = memory.readFloat();
                    this.b = memory.readFloat();
                    return memory.position;
                };
                Color.prototype.write = function (memory) {
                    memory.writeFloat(this.r);
                    memory.writeFloat(this.g);
                    memory.writeFloat(this.b);
                    return memory.position;
                };
                Color.fromJson = function (color) {
                    if (color) {
                        return new Color(color.r, color.g, color.b);
                    }
                    else {
                        return null;
                    }
                };
                Color.hexColor = function (hex) {
                    var red = ((hex >> 16) & 255) / 255;
                    var green = ((hex >> 8) & 255) / 255;
                    var blue = (hex & 255) / 255;
                    return new Color(red, green, blue).pow(2.2);
                };
                Color.newColor = function (c) {
                    return new Color(c.r / 65535, c.g / 65535, c.b / 65535);
                };
                Color.prototype.RGBA = function () {
                    var a = this;
                    var _c = new Uint8Array(3);
                    _c[0] = Math.max(0, Math.min(255, a.r * 255));
                    _c[1] = Math.max(0, Math.min(255, a.g * 255));
                    _c[2] = Math.max(0, Math.min(255, a.b * 255));
                    return { r: _c[0], g: _c[1], b: _c[2], a: 255 };
                };
                Color.prototype.isBlack = function () {
                    return this.r === 0 && this.g === 0 && this.b === 0;
                };
                Color.prototype.isWhite = function () {
                    return this.r === 1 && this.g === 1 && this.b === 1;
                };
                Color.prototype.add = function (b) {
                    return new Color(this.r + b.r, this.g + b.g, this.b + b.b);
                };
                Color.prototype.sub = function (b) {
                    return new Color(this.r - b.r, this.g - b.g, this.b - b.b);
                };
                Color.prototype.mul = function (b) {
                    return new Color(this.r * b.r, this.g * b.g, this.b * b.b);
                };
                Color.prototype.mulScalar = function (b) {
                    return new Color(this.r * b, this.g * b, this.b * b);
                };
                Color.prototype.divScalar = function (b) {
                    return new Color(this.r / b, this.g / b, this.b / b);
                };
                Color.prototype.min = function (b) {
                    return new Color(Math.min(this.r, b.r), Math.min(this.g, b.g), Math.min(this.b, b.b));
                };
                Color.prototype.max = function (b) {
                    return new Color(Math.max(this.r, b.r), Math.max(this.g, b.g), Math.max(this.b, b.b));
                };
                Color.prototype.pow = function (b) {
                    return new Color(Math.pow(this.r, b), Math.pow(this.g, b), Math.pow(this.b, b));
                };
                Color.prototype.mix = function (b, pct) {
                    var a = this.mulScalar(1 - pct);
                    b = b.mulScalar(pct);
                    return a.add(b);
                };
                Color.prototype.set = function (r, g, b) {
                    this.r = r;
                    this.g = g;
                    this.b = b;
                    return this;
                };
                Color.prototype.clone = function () {
                    return new Color(this.r, this.g, this.b);
                };
                Color.random = function () {
                    return new Color(Math.random(), Math.random(), Math.random());
                };
                Color.randomBrightColor = function () {
                    var i = Math.round(Math.random() * Color.brightColors.length);
                    return Color.brightColors[i];
                };
                Color.SIZE = 3;
                Color.brightColors = [
                    Color.hexColor(0xFF00FF),
                    Color.hexColor(0x84FF00),
                    Color.hexColor(0xFF0084),
                    Color.hexColor(0x00FFFF),
                    Color.hexColor(0x00FF84),
                    Color.hexColor(0xDD40FF),
                    Color.hexColor(0xFFFF00)
                ];
                return Color;
            }());
            exports_1("Color", Color);
        }
    }
});
//# sourceMappingURL=Color.js.map