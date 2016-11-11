System.register(["./Material", "../../math/Color", "./Attenuation"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Material_1, Color_1, Attenuation_1, Material_2;
    var ClearMaterial;
    return {
        setters:[
            function (Material_1_1) {
                Material_1 = Material_1_1;
                Material_2 = Material_1_1;
            },
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (Attenuation_1_1) {
                Attenuation_1 = Attenuation_1_1;
            }],
        execute: function() {
            ClearMaterial = (function (_super) {
                __extends(ClearMaterial, _super);
                function ClearMaterial(index, gloss) {
                    _super.call(this, new Color_1.Color(), null, null, null, 1, 0, Attenuation_1.NoAttenuation, index, gloss, 0, true);
                    this.type = Material_2.MaterialType.CLEAR;
                }
                return ClearMaterial;
            }(Material_1.Material));
            exports_1("ClearMaterial", ClearMaterial);
        }
    }
});
//# sourceMappingURL=ClearMaterial.js.map