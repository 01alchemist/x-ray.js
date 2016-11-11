System.register(["./Material", "./Attenuation"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Material_1, Attenuation_1, Material_2;
    var DiffuseMaterial;
    return {
        setters:[
            function (Material_1_1) {
                Material_1 = Material_1_1;
                Material_2 = Material_1_1;
            },
            function (Attenuation_1_1) {
                Attenuation_1 = Attenuation_1_1;
            }],
        execute: function() {
            DiffuseMaterial = (function (_super) {
                __extends(DiffuseMaterial, _super);
                function DiffuseMaterial(color) {
                    _super.call(this, color, null, null, null, 1, 0, Attenuation_1.NoAttenuation, 1, 0, 0, false);
                    this.type = Material_2.MaterialType.DIFFUSE;
                }
                return DiffuseMaterial;
            }(Material_1.Material));
            exports_1("DiffuseMaterial", DiffuseMaterial);
        }
    }
});
//# sourceMappingURL=DiffuseMaterial.js.map