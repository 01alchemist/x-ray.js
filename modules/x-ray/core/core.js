System.register(["./src/pointer/pointer", "./src/engine/engine", "./src/ThreeObjects", "./src/ThreeJSView", "./src/CanvasDisplay", "./src/HeadlessRenderBase", "./src/GIRenderBase", "./src/GIJSView"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_1(exports);
    }
    return {
        setters:[
            function (pointer_1_1) {
                exportStar_1(pointer_1_1);
            },
            function (engine_1_1) {
                exportStar_1(engine_1_1);
            },
            function (ThreeObjects_1_1) {
                exportStar_1(ThreeObjects_1_1);
            },
            function (ThreeJSView_1_1) {
                exportStar_1(ThreeJSView_1_1);
            },
            function (CanvasDisplay_1_1) {
                exportStar_1(CanvasDisplay_1_1);
            },
            function (HeadlessRenderBase_1_1) {
                exportStar_1(HeadlessRenderBase_1_1);
            },
            function (GIRenderBase_1_1) {
                exportStar_1(GIRenderBase_1_1);
            },
            function (GIJSView_1_1) {
                exportStar_1(GIJSView_1_1);
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=core.js.map