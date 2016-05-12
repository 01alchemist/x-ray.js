System.register(["Worker", "xrenderer"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Worker_1, xrenderer_1, xrenderer_2, xrenderer_3;
    var Example;
    return {
        setters:[
            function (Worker_1_1) {
                Worker_1 = Worker_1_1;
            },
            function (xrenderer_1_1) {
                xrenderer_1 = xrenderer_1_1;
                xrenderer_2 = xrenderer_1_1;
                xrenderer_3 = xrenderer_1_1;
            }],
        execute: function() {
            Example = (function (_super) {
                __extends(Example, _super);
                function Example() {
                    Worker = Worker_1.Worker;
                    xrenderer_3.Thread.workerUrl = "./trace-worker.js";
                    _super.call(this, 2560 / 4, 1440 / 4);
                    this.scene.add(xrenderer_1.Cube.newCube(new xrenderer_1.Vector3(-100, -1, -100), new xrenderer_1.Vector3(100, 0, 100), new xrenderer_2.DiffuseMaterial(new xrenderer_3.Color(1, 1, 1))));
                    this.scene.add(xrenderer_1.Sphere.newSphere(new xrenderer_1.Vector3(0, 5, 0), 1, new xrenderer_2.LightMaterial(new xrenderer_3.Color(1, 1, 1), 1, new xrenderer_3.LinearAttenuation(0.84))));
                    this.scene.add(xrenderer_1.Sphere.newSphere(new xrenderer_1.Vector3(-1, 0.15, -1), 0.15, new xrenderer_2.LightMaterial(xrenderer_3.Color.hexColor(0xFFC0CB), 10, new xrenderer_3.LinearAttenuation(1))));
                    this.camera = xrenderer_1.Camera.lookAt(new xrenderer_1.Vector3(-3, 2, -7), new xrenderer_1.Vector3(0, 0, 3), new xrenderer_1.Vector3(0, 1, 0), 45);
                    var glass = new xrenderer_2.ClearMaterial(1.3, xrenderer_3.MathUtils.radians(0));
                    var roughGlass = new xrenderer_2.ClearMaterial(1.3, xrenderer_3.MathUtils.radians(4));
                    var mirror = new xrenderer_2.SpecularMaterial(xrenderer_3.Color.hexColor(0xFFFFFF), 1000);
                    var tintedGlass = new xrenderer_2.TransparentMaterial(xrenderer_3.Color.hexColor(0x00ff00), 1.3, xrenderer_3.MathUtils.radians(0), 0.5);
                    var red = new xrenderer_2.GlossyMaterial(new xrenderer_3.Color(1, 0, 0), 1.5, xrenderer_3.MathUtils.radians(0));
                    glass.transparent = true;
                    this.scene.add(xrenderer_1.Sphere.newSphere(new xrenderer_1.Vector3(-3, 0.5, 1), 0.5, red));
                    this.scene.add(xrenderer_1.Sphere.newSphere(new xrenderer_1.Vector3(-2, 0.5, -1), 0.5, glass));
                    this.scene.add(xrenderer_1.Sphere.newSphere(new xrenderer_1.Vector3(-3.5, 0.5, -1), 0.5, roughGlass));
                    this.scene.add(xrenderer_1.Sphere.newSphere(new xrenderer_1.Vector3(-4, 1, 4), 1, mirror));
                    this.scene.add(xrenderer_1.Sphere.newSphere(new xrenderer_1.Vector3(-1, 0.5, -3), 0.5, tintedGlass));
                    this.scene.add(xrenderer_1.Sphere.newSphere(new xrenderer_1.Vector3(1.5, 1, 0), 1, new xrenderer_2.SpecularMaterial(xrenderer_3.Color.hexColor(0x334D5C), 2)));
                    this.scene.add(xrenderer_1.Sphere.newSphere(new xrenderer_1.Vector3(-1, 1, 2), 1, new xrenderer_2.SpecularMaterial(xrenderer_3.Color.hexColor(0xEFC94C), 2)));
                    this.cameraSamples = -1;
                    this.hitSamples = 1;
                    this.bounces = 4;
                    this.iterations = 2;
                    this.blockIterations = 1;
                    this.render(null, this.updatePixelsRect.bind(this));
                }
                Example.prototype.updatePixelsRect = function (rect, pixels) {
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
                    console.log("OK");
                };
                return Example;
            }(xrenderer_1.HeadlessRenderBase));
            exports_1("Example", Example);
        }
    }
});
//# sourceMappingURL=Example.js.map