System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MathUtils;
    return {
        setters:[],
        execute: function() {
            MathUtils = (function () {
                function MathUtils() {
                }
                MathUtils.radians = function (degrees) {
                    return degrees * Math.PI / 180;
                };
                MathUtils.degrees = function (radians) {
                    return radians * 180 / Math.PI;
                };
                MathUtils.median = function (items) {
                    var n = items.length;
                    if (n == 0) {
                        return 0;
                    }
                    else if (n % 2 == 1) {
                        return items[n / 2];
                    }
                    else {
                        var a = items[n / 2 - 1];
                        var b = items[n / 2];
                        return (a + b) / 2;
                    }
                };
                MathUtils.fract = function (x) {
                    var n = MathUtils.Modf(x);
                    return n.frac;
                };
                MathUtils.Modf = function (f) {
                    var int = Math.floor(f);
                    var frac = f - int;
                    return { int: int, frac: frac };
                };
                MathUtils.clampInt = function (x, lo, hi) {
                    if (x < lo) {
                        return lo;
                    }
                    if (x > hi) {
                        return hi;
                    }
                    return x;
                };
                return MathUtils;
            }());
            exports_1("MathUtils", MathUtils);
        }
    }
});
//# sourceMappingURL=MathUtils.js.map