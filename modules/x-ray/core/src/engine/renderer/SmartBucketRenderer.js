System.register(["./worker/TraceJobManager", "./worker/TraceJob"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TraceJobManager_1, TraceJob_1;
    var SmartBucketRenderer;
    return {
        setters:[
            function (TraceJobManager_1_1) {
                TraceJobManager_1 = TraceJobManager_1_1;
            },
            function (TraceJob_1_1) {
                TraceJob_1 = TraceJob_1_1;
            }],
        execute: function() {
            SmartBucketRenderer = (function () {
                function SmartBucketRenderer() {
                    this.bucketSize = 64 / 2;
                    this.traceManager = new TraceJobManager_1.TraceJobManager();
                }
                Object.defineProperty(SmartBucketRenderer.prototype, "initialized", {
                    get: function () {
                        return this.traceManager.initialized;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SmartBucketRenderer.prototype, "iterations", {
                    get: function () {
                        return this.traceManager.iterations;
                    },
                    enumerable: true,
                    configurable: true
                });
                SmartBucketRenderer.prototype.updateCameraSamples = function (newValue) {
                    this.traceManager.queue.forEach(function (job) {
                        job.extra.cameraSamples = newValue;
                    });
                };
                SmartBucketRenderer.prototype.updateHitSamples = function (newValue) {
                    this.traceManager.queue.forEach(function (job) {
                        job.extra.hitSamples = newValue;
                    });
                };
                SmartBucketRenderer.prototype.updateCamera = function (newValue) {
                    this.traceManager.stop();
                    this.traceManager.clear();
                    this.traceManager.referenceQueue.forEach(function (job) {
                        job.extra.camera = newValue;
                    });
                    this.traceManager.restart();
                };
                SmartBucketRenderer.prototype.render = function (scene, camera, width, height, cameraSamples, hitSamples, bounces, iterations, blockIterations, onUpdate, updateIndicator, onInit) {
                    if (iterations === void 0) { iterations = 1; }
                    if (blockIterations === void 0) { blockIterations = 1; }
                    if (!this.traceManager) {
                        this.traceManager = new TraceJobManager_1.TraceJobManager();
                    }
                    this.traceManager.maxLoop = iterations - 1;
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
                                blockIterations: blockIterations,
                                width: this.bucketSize,
                                height: this.bucketSize,
                                xoffset: i * this.bucketSize,
                                yoffset: j * this.bucketSize
                            }));
                        }
                    }
                    this.traceManager.updatePixels = onUpdate;
                    this.traceManager.updateIndicator = updateIndicator;
                    this.traceManager.init(onInit);
                    return this.traceManager.pixels;
                };
                SmartBucketRenderer.DEBUG = false;
                SmartBucketRenderer.interval = 0;
                return SmartBucketRenderer;
            }());
            exports_1("SmartBucketRenderer", SmartBucketRenderer);
        }
    }
});
//# sourceMappingURL=SmartBucketRenderer.js.map