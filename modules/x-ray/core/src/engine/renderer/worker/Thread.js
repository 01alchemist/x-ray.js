System.register(["./TraceJob", "./TraceJobManager"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TraceJob_1, TraceJobManager_1;
    var Thread;
    return {
        setters:[
            function (TraceJob_1_1) {
                TraceJob_1 = TraceJob_1_1;
            },
            function (TraceJobManager_1_1) {
                TraceJobManager_1 = TraceJobManager_1_1;
            }],
        execute: function() {
            Thread = (function () {
                function Thread(name, id) {
                    this.id = id;
                    console.log("Checkpoint #4.1");
                    try {
                        this.instance = new Worker(Thread.workerUrl);
                    }
                    catch (e) {
                        console.log(e);
                    }
                    this.instance.onmessage = this.onMessageReceived.bind(this);
                }
                Object.defineProperty(Thread.prototype, "isTracing", {
                    get: function () {
                        return this._isTracing;
                    },
                    enumerable: true,
                    configurable: true
                });
                Thread.prototype.onMessageReceived = function (event) {
                    if (event.data == TraceJob_1.TraceJob.INITED) {
                        this.initialized = true;
                        this._isTracing = false;
                        if (this.onInitComplete) {
                            this.onInitComplete(this);
                        }
                    }
                    if (event.data == TraceJob_1.TraceJob.TRACED) {
                        this._isTracing = false;
                        TraceJobManager_1.TraceJobManager.flags[3 + this.id] = 0;
                        if (this.onTraceComplete) {
                            this.onTraceComplete(this);
                        }
                    }
                    if (event.data == TraceJob_1.TraceJob.LOCKED) {
                        this._isTracing = false;
                        TraceJobManager_1.TraceJobManager.flags[3 + this.id] = 3;
                        if (this.onThreadLocked) {
                            this.onThreadLocked(this);
                        }
                    }
                };
                Thread.prototype.init = function (param, transferable, onInit) {
                    console.log("Initializing thread " + this.id);
                    this.onInitComplete = onInit;
                    param.command = TraceJob_1.TraceJob.INIT;
                    param.id = this.id;
                    this.send(param, transferable);
                };
                Thread.prototype.trace = function (param, onComplete) {
                    if (TraceJobManager_1.TraceJobManager.flags[3 + this.id] == 2) {
                        this._isTracing = false;
                        TraceJobManager_1.TraceJobManager.flags[3 + this.id] = 3;
                        if (this.onThreadLocked) {
                            this.onThreadLocked(this);
                        }
                    }
                    else {
                        this._isTracing = true;
                        TraceJobManager_1.TraceJobManager.flags[3 + this.id] = 1;
                        this.onTraceComplete = onComplete;
                        param.command = TraceJob_1.TraceJob.TRACE;
                        this.send(param);
                    }
                };
                Thread.prototype.send = function (data, buffers) {
                    this.instance.postMessage(data, buffers);
                };
                Thread.prototype.terminate = function () {
                };
                Thread.workerUrl = "../workers/trace-worker-bootstrap.js";
                return Thread;
            }());
            exports_1("Thread", Thread);
        }
    }
});
//# sourceMappingURL=Thread.js.map