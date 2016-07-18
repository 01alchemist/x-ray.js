System.register(["./DirectMemory"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DirectMemory_1;
    var Pointer;
    function sizeof(ptr) {
        return ptr.memorySize;
    }
    exports_1("sizeof", sizeof);
    return {
        setters:[
            function (DirectMemory_1_1) {
                DirectMemory_1 = DirectMemory_1_1;
            }],
        execute: function() {
            Pointer = (function () {
                function Pointer(reference) {
                    this.reference = reference;
                    if (!Pointer.heap) {
                        Pointer.init();
                    }
                    this.beginLocation = Pointer.offset;
                    this.currentLocation = Pointer.offset;
                    Pointer.offset = reference.write(Pointer.memory);
                }
                Pointer.init = function () {
                    if (Pointer.initialized) {
                        return;
                    }
                    var maxMemory = 64 * 1024 * 1024;
                    Pointer.heap = new Uint8Array(new SharedArrayBuffer(maxMemory));
                    Pointer.memory = new DirectMemory_1.DirectMemory(Pointer.heap.buffer);
                    Pointer.initialized = true;
                    return Pointer.memory;
                };
                Pointer.prototype.read = function () {
                    Pointer.offset = this.reference.read(Pointer.memory);
                    return this.reference;
                };
                return Pointer;
            }());
            exports_1("Pointer", Pointer);
        }
    }
});
//# sourceMappingURL=Pointer.js.map