System.register(["./engine/math/Color", "./engine/scene/Camera", "./engine/scene/SharedScene", "./engine/math/Vector3", "./engine/renderer/SmartBucketRenderer"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Color_1, Camera_1, SharedScene_1, Vector3_1, SmartBucketRenderer_1;
    var HeadlessRenderBase;
    return {
        setters:[
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            },
            function (SharedScene_1_1) {
                SharedScene_1 = SharedScene_1_1;
            },
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            },
            function (SmartBucketRenderer_1_1) {
                SmartBucketRenderer_1 = SmartBucketRenderer_1_1;
            }],
        execute: function() {
            HeadlessRenderBase = (function () {
                function HeadlessRenderBase(i_width, i_height, outmemory) {
                    this.i_width = i_width;
                    this.i_height = i_height;
                    this.outmemory = outmemory;
                    this.data = new Uint8Array(i_width * i_height * 4);
                    this.scene = new SharedScene_1.SharedScene(Color_1.Color.hexColor(0x262626));
                    this.camera = Camera_1.Camera.lookAt(new Vector3_1.Vector3(0, 0, 0), new Vector3_1.Vector3(0, 0, 0), new Vector3_1.Vector3(0, 1, 0), 45);
                    this.cameraSamples = -1;
                    this.hitSamples = 1;
                    this.bounces = 4;
                    this.iterations = 1000000;
                    this.blockIterations = 1;
                    this.renderer = new SmartBucketRenderer_1.SmartBucketRenderer();
                }
                HeadlessRenderBase.prototype.updateCameraSamples = function (newValue) {
                    if (this.cameraSamples != newValue) {
                        this.cameraSamples = newValue;
                        this.renderer.updateCameraSamples(newValue);
                    }
                };
                HeadlessRenderBase.prototype.updateHitSamples = function (newValue) {
                    if (this.hitSamples != newValue) {
                        this.hitSamples = newValue;
                        this.renderer.updateHitSamples(newValue);
                    }
                };
                HeadlessRenderBase.prototype.updateCamera = function (newValue) {
                    this.camera.updateFromArray(newValue.eye, newValue.lookAt, newValue.up, newValue.fov, newValue.focus, newValue.aperture);
                    this.renderer.updateCamera(this.camera.toJSON());
                };
                HeadlessRenderBase.prototype.updateCameraMatrix = function (matrix) {
                    this.camera.u.setFromArray(matrix, 0);
                    this.camera.v.setFromArray(matrix, 4);
                    this.camera.w.setFromArray(matrix, 8);
                    this.renderer.updateCamera(this.camera.toJSON());
                };
                HeadlessRenderBase.prototype.toggleTrace = function (newValue) {
                    if (this.renderer.initialized) {
                        console.log("toggleTrace:" + newValue);
                        if (newValue) {
                            var cam = this.camera.toJSON();
                            this.dirty = false;
                            this.renderer.updateCamera(cam);
                        }
                        else {
                            this.renderer.traceManager.stop();
                        }
                    }
                };
                HeadlessRenderBase.prototype.render = function (onInit, onUpdate) {
                    console.info("+ Render settings");
                    console.info("      Resolution          :   " + this.i_width + "x" + this.i_height);
                    console.info("      CameraSamples       :   " + this.cameraSamples);
                    console.info("      HitSamples          :   " + this.hitSamples);
                    console.info("      Bounces             :   " + this.bounces);
                    console.info("      Iterations          :   " + this.iterations);
                    console.info("      Block-Iterations    :   " + this.blockIterations);
                    var self = this;
                    this.pixels = this.renderer.render(this.scene, this.camera, this.i_width, this.i_height, this.cameraSamples, this.hitSamples, this.bounces, this.iterations, this.blockIterations, _onUpdate, onInit);
                    function _onUpdate(rect) {
                        if (onUpdate) {
                            onUpdate(rect, self.pixels);
                        }
                    }
                };
                HeadlessRenderBase.prototype.setResolution = function (width, height) {
                    this.i_width = width;
                    this.i_height = height;
                    this.data = new Uint8Array(width * height * 4);
                };
                HeadlessRenderBase.prototype.updatePixels = function (pixels) {
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
                };
                return HeadlessRenderBase;
            }());
            exports_1("HeadlessRenderBase", HeadlessRenderBase);
        }
    }
});
//# sourceMappingURL=HeadlessRenderBase.js.map