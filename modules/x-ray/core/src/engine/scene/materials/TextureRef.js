System.register(["../../../pointer/src/MemoryObject"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var MemoryObject_1;
    var TextureRef;
    return {
        setters:[
            function (MemoryObject_1_1) {
                MemoryObject_1 = MemoryObject_1_1;
            }],
        execute: function() {
            TextureRef = (function (_super) {
                __extends(TextureRef, _super);
                function TextureRef(length) {
                    _super.call(this, length);
                }
                return TextureRef;
            }(MemoryObject_1.MemoryObject));
            exports_1("TextureRef", TextureRef);
        }
    }
});
//# sourceMappingURL=TextureRef.js.map