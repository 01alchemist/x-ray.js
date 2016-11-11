System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GIThree;
    return {
        setters:[],
        execute: function() {
            GIThree = (function () {
                function GIThree(scene) {
                    this.scene = scene;
                    console.log(scene);
                }
                return GIThree;
            }());
            exports_1("GIThree", GIThree);
        }
    }
});
//# sourceMappingURL=GIThree.js.map