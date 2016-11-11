System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TraceJob;
    return {
        setters:[],
        execute: function() {
            TraceJob = (function () {
                function TraceJob(param, extra) {
                    if (extra === void 0) { extra = {}; }
                    this.param = param;
                    this.extra = extra;
                    this.runCount = 0;
                    this.id = param.id;
                    this.finished = false;
                }
                Object.defineProperty(TraceJob.prototype, "lifeCount", {
                    get: function () {
                        return this._lifeCount;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TraceJob.prototype, "time", {
                    get: function () {
                        return this._time;
                    },
                    enumerable: true,
                    configurable: true
                });
                TraceJob.prototype.start = function (thread, onComplete) {
                    this._time = performance.now();
                    var self = this;
                    var _param = this.getTraceParam();
                    thread.trace(_param, function (thread) {
                        self._time = performance.now() - self._time;
                        self._lifeCount = Math.round(self._time / 10);
                        if (onComplete) {
                            onComplete(self, thread);
                        }
                    });
                    this.runCount++;
                };
                TraceJob.prototype.getTraceParam = function () {
                    var _param = { init_iterations: 0 };
                    var extraCount = 0;
                    for (key in this.extra) {
                        if (this.extra.hasOwnProperty(key)) {
                            _param[key] = this.extra[key];
                            delete this.extra[key];
                            extraCount++;
                        }
                    }
                    if (extraCount > 0) {
                        for (var key in this.param) {
                            if (this.param.hasOwnProperty(key)) {
                                _param[key] = this.param[key];
                            }
                        }
                    }
                    else {
                        _param = this.param;
                    }
                    _param.init_iterations = (this.runCount * this.param.blockIterations) - (this.runCount > 0 ? (this.param.blockIterations - 1) : 0);
                    return _param;
                };
                TraceJob.INIT = "INIT";
                TraceJob.INITED = "INITED";
                TraceJob.TRACE = "TRACE";
                TraceJob.TRACED = "TRACED";
                TraceJob.TERMINATE = "TERMINATE";
                TraceJob.LOCKED = "LOCKED";
                return TraceJob;
            }());
            exports_1("TraceJob", TraceJob);
        }
    }
});
//# sourceMappingURL=TraceJob.js.map