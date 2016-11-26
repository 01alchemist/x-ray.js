System.register(["./src/ByteArrayBase", "./src/DirectMemory", "./src/MemoryUtils", "./src/UTF8", "./src/Pointer"], function(exports_1, context_1) {
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
            function (ByteArrayBase_1_1) {
                exportStar_1(ByteArrayBase_1_1);
            },
            function (DirectMemory_1_1) {
                exportStar_1(DirectMemory_1_1);
            },
            function (MemoryUtils_1_1) {
                exportStar_1(MemoryUtils_1_1);
            },
            function (UTF8_1_1) {
                exportStar_1(UTF8_1_1);
            },
            function (Pointer_1_1) {
                exportStar_1(Pointer_1_1);
            }],
        execute: function() {
        }
    }
});
//# sourceMappingURL=pointer.js.map