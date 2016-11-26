System.register(["../../math/Color", "../../math/Vector3", "../../data/ImageLoader", "../../utils/MathUtils"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Color_1, Vector3_1, ImageLoader_1, MathUtils_1;
    var Texture;
    return {
        setters:[
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            },
            function (ImageLoader_1_1) {
                ImageLoader_1 = ImageLoader_1_1;
            },
            function (MathUtils_1_1) {
                MathUtils_1 = MathUtils_1_1;
            }],
        execute: function() {
            Texture = (function (_super) {
                __extends(Texture, _super);
                function Texture(arg) {
                    _super.call(this);
                    try {
                        if (importScripts) {
                            return;
                        }
                    }
                    catch (e) {
                    }
                    if (!Texture.ctx) {
                        var canvas = document.createElement("canvas");
                        canvas.width = 4096;
                        canvas.height = 4096;
                        Texture.ctx = canvas.getContext("2d");
                    }
                    if (arg) {
                        if (typeof arg === "string") {
                            this.load(arg);
                        }
                        else if (arg instanceof HTMLImageElement) {
                            this.setImage(arg);
                        }
                    }
                }
                Texture.getTexture = function (url) {
                    var texture = Texture.list[Texture.map.get(url)];
                    if (texture) {
                        return texture;
                    }
                    else {
                        return new Texture(url);
                    }
                };
                Texture.setTexture = function (url, texture) {
                    texture.index = Texture.list.push(texture) - 1;
                    Texture.map.set(url, texture.index);
                    return texture;
                };
                Texture.fromJson = function (texture) {
                    if (texture) {
                        var _texture = new Texture();
                        _texture.data = texture.data;
                        _texture.pixels = texture.pixels;
                        return _texture;
                    }
                    else {
                        return null;
                    }
                };
                Texture.prototype.read = function (memory) {
                    this.sourceFile = memory.readUTF();
                    this.width = memory.readUnsignedInt();
                    this.height = memory.readUnsignedInt();
                    this.data = [];
                    for (var i = 0; i < this.width * this.height; i++) {
                        var color = new Color_1.Color();
                        color.read(memory);
                        this.data.push(color);
                    }
                    Texture.setTexture(this.sourceFile, this);
                    return memory.position;
                };
                Texture.prototype.write = function (memory) {
                    memory.writeUTF(this.sourceFile);
                    memory.writeUnsignedInt(this.width);
                    memory.writeUnsignedInt(this.height);
                    for (var i = 0; i < this.width * this.height; i++) {
                        this.data[i].write(memory);
                    }
                    return memory.position;
                };
                Texture.prototype.bilinearSample = function (u, v) {
                    var w = this.width - 1;
                    var h = this.height - 1;
                    var Xx = MathUtils_1.MathUtils.Modf(u * w);
                    var Yy = MathUtils_1.MathUtils.Modf(v * h);
                    var X = Xx.int;
                    var x = Xx.frac;
                    var Y = Yy.int;
                    var y = Yy.frac;
                    var x0 = X;
                    var y0 = Y;
                    var x1 = x0 + 1;
                    var y1 = y0 + 1;
                    var i00 = y0 * this.width + x0;
                    var i01 = y1 * this.width + x0;
                    var i10 = y0 * this.width + x1;
                    var i11 = y1 * this.width + x1;
                    var c00 = this.data[i00 >= this.data.length ? this.data.length - 1 : i00];
                    var c01 = this.data[i01 >= this.data.length ? this.data.length - 1 : i01];
                    var c10 = this.data[i10 >= this.data.length ? this.data.length - 1 : i10];
                    var c11 = this.data[i11 >= this.data.length ? this.data.length - 1 : i11];
                    var c = new Color_1.Color();
                    c = c.add(c00.mulScalar((1 - x) * (1 - y)));
                    c = c.add(c10.mulScalar(x * (1 - y)));
                    c = c.add(c01.mulScalar((1 - x) * y));
                    c = c.add(c11.mulScalar(x * y));
                    if (c.isBlack()) {
                    }
                    return c;
                };
                Texture.prototype.sample = function (u, v) {
                    u = MathUtils_1.MathUtils.fract(MathUtils_1.MathUtils.fract(u) + 1);
                    v = MathUtils_1.MathUtils.fract(MathUtils_1.MathUtils.fract(v) + 1);
                    return this.bilinearSample(u, 1 - v);
                };
                Texture.prototype.normalSample = function (u, v) {
                    var c = this.sample(u, v);
                    return new Vector3_1.Vector3(c.r * 2 - 1, c.g * 2 - 1, c.b * 2 - 1).normalize();
                };
                Texture.prototype.bumpSample = function (u, v) {
                    u = MathUtils_1.MathUtils.fract(MathUtils_1.MathUtils.fract(u) + 1);
                    v = MathUtils_1.MathUtils.fract(MathUtils_1.MathUtils.fract(v) + 1);
                    v = 1 - v;
                    var x = Math.round(u * this.width);
                    var y = Math.round(v * this.height);
                    var x1 = MathUtils_1.MathUtils.clampInt(x - 1, 0, this.width - 1);
                    var x2 = MathUtils_1.MathUtils.clampInt(x + 1, 0, this.width - 1);
                    var y1 = MathUtils_1.MathUtils.clampInt(y - 1, 0, this.height - 1);
                    var y2 = MathUtils_1.MathUtils.clampInt(y + 1, 0, this.height - 1);
                    var cx = this.data[y * this.width + x1].sub(this.data[y * this.width + x2]);
                    var cy = this.data[y1 * this.width + x].sub(this.data[y2 * this.width + x]);
                    return new Vector3_1.Vector3(cx.r, cy.r, 0);
                };
                Texture.prototype.load = function (url, onLoad, onProgress, onError) {
                    this.sourceFile = url;
                    var texture = Texture.getTexture(url);
                    if (texture) {
                        this.index = texture.index;
                        this.data = texture.data;
                        this.image = texture.image;
                        this.pixels = texture.pixels;
                        this.sourceFile = texture.sourceFile;
                        if (onLoad) {
                            onLoad(this.data);
                        }
                        return this.image;
                    }
                    return _super.prototype.load.call(this, url, function (image) {
                        this.setImage(image);
                        if (onLoad) {
                            onLoad(this.pixels);
                        }
                    }.bind(this), onProgress, onError);
                };
                Texture.prototype.setImage = function (image) {
                    this.sourceFile = image.currentSrc;
                    Texture.setTexture(this.sourceFile, this);
                    Texture.ctx.drawImage(image, 0, 0);
                    var pixels = Texture.ctx.getImageData(0, 0, image.width, image.height).data;
                    this.setImageData(image.width, image.height, pixels);
                    this.image = image;
                };
                Texture.prototype.setImageData = function (width, height, pixels) {
                    this.data = [];
                    for (var y = 0; y < height; y++) {
                        for (var x = 0; x < width; x++) {
                            var pi = y * (width * 4) + (x * 4);
                            var index = y * width + x;
                            var rgba = {
                                r: pixels[pi],
                                g: pixels[pi + 1],
                                b: pixels[pi + 2],
                                a: pixels[pi + 3],
                            };
                            this.data[index] = new Color_1.Color(rgba.r / 255, rgba.g / 255, rgba.b / 255);
                        }
                    }
                    this.width = width;
                    this.height = height;
                    this.pixels = pixels;
                };
                Texture.write = function (memory) {
                    memory.writeUnsignedInt(Texture.list.length);
                    Texture.list.forEach(function (texture) {
                        texture.write(memory);
                    });
                    return memory.position;
                };
                Texture.restore = function (memory) {
                    var numTextures = memory.readUnsignedInt();
                    for (var i = 0; i < numTextures; i++) {
                        var tex = new Texture();
                        tex.read(memory);
                    }
                    console.info(numTextures + " Textures restored");
                    return memory.position;
                };
                Texture.list = [];
                Texture.map = new Map();
                return Texture;
            }(ImageLoader_1.ImageLoader));
            exports_1("Texture", Texture);
        }
    }
});
//# sourceMappingURL=Texture.js.map