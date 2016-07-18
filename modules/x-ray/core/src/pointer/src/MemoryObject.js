System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MemoryObject;
    return {
        setters:[],
        execute: function() {
            MemoryObject = (function () {
                function MemoryObject(length) {
                    this.length = length;
                    this.pointer = null;
                }
                return MemoryObject;
            }());
            exports_1("MemoryObject", MemoryObject);
        }
    }
});
//# sourceMappingURL=MemoryObject.js.map