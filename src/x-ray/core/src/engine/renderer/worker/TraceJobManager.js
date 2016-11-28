System.register(["./ThreadPool"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ThreadPool_1;
    var TraceJobManager;
    return {
        setters:[
            function (ThreadPool_1_1) {
                ThreadPool_1 = ThreadPool_1_1;
            }],
        execute: function() {
            TraceJobManager = (function () {
                function TraceJobManager() {
                    this.iterations = 0;
                    this.initCount = 0;
                    this.maxLoop = 1;
                    this.currentLoop = 0;
                    this.totalThreads = 0;
                    this.deferredStart = false;
                    this.lockCount = 0;
                    this.queue = [];
                    this.deferredQueue = [];
                    this.referenceQueue = [];
                }
                Object.defineProperty(TraceJobManager.prototype, "initialized", {
                    get: function () {
                        return this._initialized;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TraceJobManager.prototype, "isAllLocked", {
                    get: function () {
                        for (var i = 0; i < this.totalThreads; i++) {
                            if (this.flags[3 + i] !== 3 && this.flags[3 + i] !== 0) {
                                return false;
                            }
                        }
                        return true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TraceJobManager.prototype, "finished", {
                    get: function () {
                        return this._finished;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TraceJobManager.prototype, "pixels", {
                    get: function () {
                        return this.pixelMemory;
                    },
                    enumerable: true,
                    configurable: true
                });
                TraceJobManager.prototype.configure = function (param, scene) {
                    console.log("configure");
                    this.width = param.width;
                    this.height = param.height;
                    this.flags = new Uint8Array(new SharedArrayBuffer(ThreadPool_1.ThreadPool.maxThreads));
                    TraceJobManager.flags = this.flags;
                    this.pixelMemory = new Uint8Array(new SharedArrayBuffer(this.width * this.height * 3));
                    this.sampleMemory = new Float32Array(new SharedArrayBuffer(4 * this.width * this.height * 3));
                    this.traceParameters = {
                        turboBuffer: unsafe.RAW_MEMORY,
                        flagsBuffer: this.flags.buffer,
                        sampleBuffer: this.sampleMemory.buffer,
                        pixelBuffer: this.pixelMemory.buffer,
                        scene: scene,
                        camera: param.camera,
                        cameraSamples: param.cameraSamples,
                        hitSamples: param.hitSamples,
                        bounces: param.bounces,
                        full_width: this.width,
                        full_height: this.height
                    };
                };
                TraceJobManager.prototype.add = function (job) {
                    this.queue.push(job);
                    this.referenceQueue.push(job);
                };
                TraceJobManager.prototype.init = function (callback) {
                    console.log("Initializing threads...");
                    console.time(ThreadPool_1.ThreadPool.maxThreads + " Threads initialized");
                    this.threads = ThreadPool_1.ThreadPool.getThreads();
                    this.totalThreads = this.threads.length;
                    this.lockCount = this.threads.length;
                    this.initNext(callback);
                };
                TraceJobManager.prototype.initNext = function (callback) {
                    var self = this;
                    if (this.initCount == this.totalThreads) {
                        this._initialized = true;
                        console.timeEnd(ThreadPool_1.ThreadPool.maxThreads + " Threads initialized");
                        if (callback) {
                            callback();
                        }
                        else {
                            this.start();
                        }
                        return;
                    }
                    var thread = this.threads[this.initCount++];
                    thread.onThreadLocked = this.onThreadLocked.bind(this);
                    thread.init(this.traceParameters, [
                        this.traceParameters.flagsBuffer,
                        this.traceParameters.pixelBuffer,
                        this.traceParameters.sampleBuffer,
                        this.traceParameters.turboBuffer
                    ], function () {
                        self.initNext.bind(self)(callback);
                    });
                };
                TraceJobManager.prototype.onThreadLocked = function () {
                    this.lockCount++;
                    if (this.isAllLocked && this.deferredStart) {
                        this.deferredStart = false;
                        this.clear();
                        this.restart();
                    }
                    console.log("lockCount:" + this.lockCount);
                };
                TraceJobManager.prototype.lockAllThreads = function () {
                    for (var i = 0; i < this.threads.length; i++) {
                        var thread = this.threads[i];
                        if (thread.isTracing) {
                            this.flags[3 + i] = 2;
                        }
                        else {
                            this.flags[3 + i] = 0;
                        }
                    }
                };
                TraceJobManager.prototype.stop = function () {
                    if (this.flags) {
                        this.queue = null;
                        this.deferredQueue = null;
                        this.deferredStart = false;
                        this.lockAllThreads();
                        this.stopped = true;
                        this.lockCount = 0;
                        this._await = true;
                        var job;
                        for (var i = 0; i < this.referenceQueue.length; i++) {
                            job = this.referenceQueue[i];
                            job.runCount = 0;
                        }
                    }
                };
                TraceJobManager.prototype.clear = function () {
                    for (var y = 0; y < this.height; y++) {
                        for (var x = 0; x < this.width; x++) {
                            var si = (y * (this.width * 3)) + (x * 3);
                            this.pixelMemory[si] = 0;
                            this.pixelMemory[si + 1] = 0;
                            this.pixelMemory[si + 2] = 0;
                            this.sampleMemory[si] = 0;
                            this.sampleMemory[si + 1] = 0;
                            this.sampleMemory[si + 2] = 0;
                        }
                    }
                    if (this.updatePixels) {
                        this.updatePixels({
                            xoffset: 0,
                            yoffset: 0,
                            width: this.width,
                            height: this.height,
                            pixels: this.pixelMemory
                        });
                    }
                };
                TraceJobManager.prototype.restart = function () {
                    if (!this.stopped) {
                        this.stop();
                    }
                    if (this.flags && this.isAllThreadsFree) {
                        this.queue = this.referenceQueue.concat();
                        this.deferredQueue = [];
                        this._await = false;
                        this.deferredStart = false;
                        clearTimeout(this.resetTimerId);
                        this.resetTimerId = setTimeout(this.start.bind(this), 100);
                    }
                    else {
                        this.deferredStart = true;
                    }
                };
                Object.defineProperty(TraceJobManager.prototype, "isAllThreadsFree", {
                    get: function () {
                        var thread;
                        for (var i = 0; i < this.threads.length; i++) {
                            thread = this.threads[i];
                            if (thread.isTracing) {
                                if (this.flags[3 + i] === 1 || this.flags[3 + i] === 2) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    },
                    enumerable: true,
                    configurable: true
                });
                TraceJobManager.prototype.start = function () {
                    if (this.currentLoop >= this.maxLoop || (this.queue.length == 0 && this.deferredQueue.length === 0)) {
                        console.log("Rendering finished");
                        return;
                    }
                    console.log("queue:" + this.queue.length);
                    console.time('trace::start');
                    var self = this;
                    if (this._initialized) {
                        this.stopped = false;
                        var thread;
                        var job;
                        for (var i = 0; i < this.threads.length; i++) {
                            thread = this.threads[i];
                            if (self.queue && self.deferredQueue && self.queue.length > 0) {
                                job = self.queue.shift();
                                self.deferredQueue.push(job);
                                job.start(thread, function (_job, _thread) {
                                    if (!self._await) {
                                        self.processQueue.call(self, _job, _thread);
                                    }
                                });
                            }
                            else {
                                break;
                            }
                        }
                    }
                };
                TraceJobManager.prototype.processQueue = function (job, thread) {
                    if (this.updatePixels) {
                        this.updatePixels(job.param);
                    }
                    if (this._finished) {
                        return;
                    }
                    var self = this;
                    if (this.queue.length > 0) {
                        var job = self.queue.shift();
                        self.deferredQueue.push(job);
                        if (this.updateIndicator) {
                            this.updateIndicator(job.param);
                        }
                        job.start(thread, function (_job, _thread) {
                            if (!self._await) {
                                self.processQueue.call(self, _job, _thread);
                            }
                        });
                    }
                    else {
                        if (this.isAllThreadsFree) {
                            this._finished = true;
                            console.timeEnd('trace::start');
                            this.initDeferredQueue();
                        }
                    }
                };
                TraceJobManager.prototype.initDeferredQueue = function () {
                    if (this.currentLoop >= this.maxLoop || (this.queue.length == 0 && this.deferredQueue.length === 0)) {
                        console.log("Rendering finished");
                        return;
                    }
                    this.currentLoop++;
                    this._finished = false;
                    var self = this;
                    self.deferredQueue.sort(function (a, b) {
                        return b.time - a.time;
                    });
                    self.queue = self.deferredQueue;
                    self.deferredQueue = [];
                    console.time('trace::start');
                    this.start();
                };
                return TraceJobManager;
            }());
            exports_1("TraceJobManager", TraceJobManager);
        }
    }
});
//# sourceMappingURL=TraceJobManager.js.map