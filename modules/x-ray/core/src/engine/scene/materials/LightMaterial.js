System.register(["./Material"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Material_1, Material_2;
    var LightMaterial;
    return {
        setters:[
            function (Material_1_1) {
                Material_1 = Material_1_1;
                Material_2 = Material_1_1;
            }],
        execute: function() {
            LightMaterial = (function (_super) {
                __extends(LightMaterial, _super);
                function LightMaterial(color, emittance, attenuation) {
                    _super.call(this, color, null, null, null, 1, emittance, attenuation, 1, 0, 0, false);
                    this.type = Material_2.MaterialType.EMISSIVE;
                }
                return LightMaterial;
            }(Material_1.Material));
            exports_1("LightMaterial", LightMaterial);
        }
    }
});
//# sourceMappingURL=LightMaterial.js.map