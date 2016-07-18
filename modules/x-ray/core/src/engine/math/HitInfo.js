System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var HitInfo;
    return {
        setters:[],
        execute: function() {
            HitInfo = (function () {
                function HitInfo(shape, position, normal, ray, color, material, inside) {
                    this.shape = shape;
                    this.position = position;
                    this.normal = normal;
                    this.ray = ray;
                    this.color = color;
                    this.material = material;
                    this.inside = inside;
                }
                return HitInfo;
            }());
            exports_1("HitInfo", HitInfo);
        }
    }
});
//# sourceMappingURL=HitInfo.js.map