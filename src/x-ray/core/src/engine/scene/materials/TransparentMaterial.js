System.register(["./Material", "./Attenuation"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Material_1, Attenuation_1;
    var TransparentMaterial;
    return {
        setters:[
            function (Material_1_1) {
                Material_1 = Material_1_1;
            },
            function (Attenuation_1_1) {
                Attenuation_1 = Attenuation_1_1;
            }],
        execute: function() {
            TransparentMaterial = (function (_super) {
                __extends(TransparentMaterial, _super);
                function TransparentMaterial(color, index, gloss, tint) {
                    if (index === void 0) { index = 1; }
                    if (gloss === void 0) { gloss = 1; }
                    if (tint === void 0) { tint = 0; }
                    _super.call(this, color, null, null, null, 1, 0, Attenuation_1.NoAttenuation, index, gloss, tint, true);
                }
                return TransparentMaterial;
            }(Material_1.Material));
            exports_1("TransparentMaterial", TransparentMaterial);
        }
    }
});
//# sourceMappingURL=TransparentMaterial.js.map