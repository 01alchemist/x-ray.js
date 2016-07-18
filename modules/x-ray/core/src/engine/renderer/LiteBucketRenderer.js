System.register(["./worker/TraceJobManager", "./worker/TraceJob"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TraceJobManager_1, TraceJob_1;
    var LiteBucketRenderer;
    return {
        setters:[
            function (TraceJobManager_1_1) {
                TraceJobManager_1 = TraceJobManager_1_1;
            },
            function (TraceJob_1_1) {
                TraceJob_1 = TraceJob_1_1;
            }],
        execute: function() {
            LiteBucketRenderer = (function () {
                function LiteBucketRenderer() {
                    this.bucketSize = 64;
                    this.traceManager = new TraceJobManager_1.TraceJobManager();
                }
                Object.defineProperty(LiteBucketRenderer.prototype, "initialized", {
                    get: function () {
                        return this.traceManager.initialized;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LiteBucketRenderer.prototype, "iterations", {
                    get: function () {
                        return this.traceManager.iterations;
                    },
                    enumerable: true,
                    configurable: true
                });
                LiteBucketRenderer.prototype.render = function (scene, camera, width, height, cameraSamples, hitSamples, bounces, iterations, onUpdate) {
                    if (iterations === void 0) { iterations = 1; }
                    if (!this.traceManager) {
                        this.traceManager = new TraceJobManager_1.TraceJobManager();
                    }
                    this.traceManager.configure({
                        camera: camera,
                        width: width,
                        height: height,
                        cameraSamples: cameraSamples,
                        hitSamples: hitSamples,
                        bounces: bounces
                    }, scene);
                    var col = width / this.bucketSize;
                    var row = height / this.bucketSize;
                    for (var j = 0; j < row; j++) {
                        for (var i = 0; i < col; i++) {
                            this.traceManager.add(new TraceJob_1.TraceJob({
                                id: j + "_" + i,
                                iterations: iterations,
                                width: this.bucketSize,
                                height: this.bucketSize,
                                xoffset: i * this.bucketSize,
                                yoffset: j * this.bucketSize
                            }));
                        }
                    }
                    this.traceManager.updatePixels = onUpdate;
                    this.traceManager.init();
                    return this.traceManager.pixels;
                };
                LiteBucketRenderer.DEBUG = false;
                LiteBucketRenderer.interval = 0;
                return LiteBucketRenderer;
            }());
            exports_1("LiteBucketRenderer", LiteBucketRenderer);
        }
    }
});
//# sourceMappingURL=LiteBucketRenderer.js.map