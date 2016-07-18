System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ThreeObjects;
    return {
        setters:[],
        execute: function() {
            ThreeObjects = (function () {
                function ThreeObjects() {
                }
                ThreeObjects.PointLight = "PointLight";
                ThreeObjects.Mesh = "Mesh";
                ThreeObjects.Group = "Group";
                return ThreeObjects;
            }());
            exports_1("ThreeObjects", ThreeObjects);
        }
    }
});
//# sourceMappingURL=ThreeObjects.js.map