System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function append(slice) {
        var elements = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            elements[_i - 1] = arguments[_i];
        }
        if (slice == undefined) {
            return elements;
        }
        else {
            slice.push.apply(slice, elements);
        }
        return slice;
    }
    exports_1("append", append);
    function sortAscending(slice) {
        slice.sort(function (a, b) {
            return a - b;
        });
    }
    exports_1("sortAscending", sortAscending);
    function sortDescending(slice) {
        slice.sort(function (a, b) {
            return b - a;
        });
    }
    exports_1("sortDescending", sortDescending);
    return {
        setters:[],
        execute: function() {
        }
    }
});
//# sourceMappingURL=MapUtils.js.map