System.register(["../core/src/engine/math/Vector3"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Vector3_1;
    var SIMDTest;
    return {
        setters:[
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            }],
        execute: function() {
            SIMDTest = (function () {
                function SIMDTest() {
                    var a = new Vector3_1.Vector3(Math.random(), Math.random(), Math.random());
                    var b = new Vector3_1.Vector3(Math.random(), Math.random(), Math.random());
                    console.time("Normal Dot Time");
                    var c = a.dot(b);
                    console.timeEnd("Normal Dot Time");
                    console.time("Normal Cross Time");
                    var d = a.cross(b);
                    console.timeEnd("Normal Cross Time");
                    console.log("Normal Dot:" + c);
                    console.log("Normal Cross:" + d);
                    var _a = SIMD.Float32x4.load(a.data, 0);
                    var _b = SIMD.Float32x4.load(b.data, 0);
                    console.time("SIMD Dot Time");
                    var _c = Vector3_1.Vector3.SIMD.dot(_a, _b);
                    console.timeEnd("SIMD Dot Time");
                    console.time("SIMD Cross Time");
                    var _d = Vector3_1.Vector3.SIMD.cross(_a, _b);
                    console.timeEnd("SIMD Cross Time");
                    var dd = new Vector3_1.Vector3();
                    SIMD.Float32x4.store(dd.data, 0, _d);
                    dd.sync();
                    console.log("SIMD Dot:" + _c);
                    console.log("SIMD Cross:" + dd);
                }
                return SIMDTest;
            }());
            exports_1("SIMDTest", SIMDTest);
        }
    }
});
//# sourceMappingURL=SIMDTest.js.map