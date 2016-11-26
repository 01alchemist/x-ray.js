System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var INF, EPS, shift, uvnan, uvinf, uvneginf, mask, bias;
    return {
        setters:[],
        execute: function() {
            exports_1("INF", INF = 1e9);
            exports_1("EPS", EPS = 1e-9);
            exports_1("shift", shift = 64 - 11 - 1);
            exports_1("uvnan", uvnan = 0x7FF8000000000001);
            exports_1("uvinf", uvinf = 0x7FF0000000000000);
            exports_1("uvneginf", uvneginf = 0xFFF0000000000000);
            exports_1("mask", mask = 0x7FF);
            exports_1("bias", bias = 1023);
        }
    }
});
//# sourceMappingURL=Constants.js.map