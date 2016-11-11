System.register(["../x-ray"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var x_ray_1;
    var TraceWorker;
    return {
        setters:[
            function (x_ray_1_1) {
                x_ray_1 = x_ray_1_1;
            }],
        execute: function() {
            TraceWorker = (function () {
                function TraceWorker() {
                    this.iterations = 1;
                    addEventListener('message', this.onMessageReceived.bind(this), false);
                    console.log("TraceWorker up");
                }
                TraceWorker.prototype.onMessageReceived = function (e) {
                    var data = e.data;
                    switch (data.command) {
                        case x_ray_1.TraceJob.INIT:
                            postMessage(x_ray_1.TraceJob.INITED);
                            break;
                        case x_ray_1.TraceJob.TRACE:
                            if (this.flags[3 + this.id] === 2) {
                                console.log("exit:1");
                                this.lock();
                                return;
                            }
                            this.init(e.data.width, e.data.height, e.data.xoffset, e.data.yoffset);
                            this.cameraSamples = e.data.cameraSamples || this.cameraSamples;
                            this.hitSamples = e.data.hitSamples || this.hitSamples;
                            if (e.data.camera) {
                                this.camera.updateFromJson(e.data.camera);
                            }
                            this.iterations = e.data.init_iterations || 0;
                            if (this.locked) {
                                console.log("restarted:" + this.iterations, "samples:" + this.checkSamples());
                                this.locked = false;
                            }
                            if (this.iterations > 0 && e.data.blockIterations) {
                                for (var i = 0; i < e.data.blockIterations; i++) {
                                    if (this.flags[3 + this.id] === 2) {
                                        this.lock();
                                        return;
                                    }
                                    this.run();
                                }
                            }
                            else {
                                if (this.flags[3 + this.id] === 2) {
                                    this.lock();
                                    return;
                                }
                                this.run();
                            }
                            if (this.flags[3 + this.id] === 2) {
                                this.lock();
                                return;
                            }
                            postMessage(x_ray_1.TraceJob.TRACED);
                            break;
                    }
                };
                TraceWorker.prototype.init = function (width, height, xoffset, yoffset) {
                    this.width = width;
                    this.height = height;
                    this.xoffset = xoffset;
                    this.yoffset = yoffset;
                    this.absCameraSamples = Math.round(Math.abs(this.cameraSamples));
                };
                TraceWorker.prototype.lock = function () {
                    if (!this.locked) {
                        this.locked = true;
                        postMessage(x_ray_1.TraceJob.LOCKED);
                    }
                };
                TraceWorker.prototype.run = function () {
                    this.iterations++;
                    var hitSamples = this.hitSamples;
                    var cameraSamples = this.cameraSamples;
                    var absCameraSamples = this.absCameraSamples;
                    if (this.iterations == 1) {
                        hitSamples = 1;
                        cameraSamples = -1;
                        absCameraSamples = Math.round(Math.abs(cameraSamples));
                    }
                    for (var y = this.yoffset; y < this.yoffset + this.height; y++) {
                        for (var x = this.xoffset; x < this.xoffset + this.width; x++) {
                            if (this.flags[3 + this.id] === 2) {
                                console.log("exit:3");
                                this.lock();
                                return;
                            }
                            var screen_index = (y * (this.full_width * 3)) + (x * 3);
                            var c = new x_ray_1.Color();
                            if (cameraSamples <= 0) {
                                for (var i = 0; i < absCameraSamples; i++) {
                                    var fu = Math.random();
                                    var fv = Math.random();
                                    var ray = this.camera.castRay(x, y, this.full_width, this.full_height, fu, fv);
                                    c = c.add(this.scene.sample(ray, true, hitSamples, this.bounces));
                                }
                                c = c.divScalar(absCameraSamples);
                            }
                            else {
                                var n = Math.round(Math.sqrt(cameraSamples));
                                for (var u = 0; u < n; u++) {
                                    for (var v = 0; v < n; v++) {
                                        var fu = (u + 0.5) / n;
                                        var fv = (v + 0.5) / n;
                                        var ray = this.camera.castRay(x, y, this.full_width, this.full_height, fu, fv);
                                        c = c.add(this.scene.sample(ray, true, hitSamples, this.bounces));
                                    }
                                }
                                c = c.divScalar(n * n);
                            }
                            if (this.flags[3 + this.id] === 2) {
                                console.log("exit:7");
                                this.lock();
                                return;
                            }
                            c = c.pow(1 / 2.2);
                            this.updatePixel(c, screen_index);
                        }
                    }
                };
                TraceWorker.prototype.updatePixel = function (color, si) {
                    if (this.flags[3 + this.id] === 2) {
                        console.log("exit:8");
                        this.lock();
                        return;
                    }
                    this.sampleMemory[si] += color.r;
                    this.sampleMemory[si + 1] += color.g;
                    this.sampleMemory[si + 2] += color.b;
                    this.pixelMemory[si] = Math.max(0, Math.min(255, (this.sampleMemory[si] / this.iterations) * 255));
                    this.pixelMemory[si + 1] = Math.max(0, Math.min(255, (this.sampleMemory[si + 1] / this.iterations) * 255));
                    this.pixelMemory[si + 2] = Math.max(0, Math.min(255, (this.sampleMemory[si + 2] / this.iterations) * 255));
                };
                TraceWorker.prototype.checkSamples = function () {
                    for (var y = this.yoffset; y < this.yoffset + this.height; y++) {
                        for (var x = this.xoffset; x < this.xoffset + this.width; x++) {
                            var si = (y * (this.full_width * 3)) + (x * 3);
                            if (this.sampleMemory[si] !== 0 &&
                                this.sampleMemory[si + 1] !== 0 &&
                                this.sampleMemory[si + 2] !== 0) {
                                return "NOT_OK";
                            }
                        }
                    }
                    return "OK";
                };
                TraceWorker.prototype.drawColor = function (i, rgba) {
                    this.pixelMemory[i] = rgba.r;
                    this.pixelMemory[i + 1] = rgba.g;
                    this.pixelMemory[i + 2] = rgba.b;
                };
                TraceWorker.prototype.drawPixelInt = function (i, color) {
                    var red = (color >> 16) & 255;
                    var green = (color >> 8) & 255;
                    var blue = color & 255;
                    this.pixelMemory[i] = red;
                    this.pixelMemory[i + 1] = green;
                    this.pixelMemory[i + 2] = blue;
                };
                return TraceWorker;
            }());
            exports_1("TraceWorker", TraceWorker);
            new TraceWorker();
        }
    }
});
//# sourceMappingURL=TraceWorker.js.map