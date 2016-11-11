System.register(["../math/Color", "./Scene", "./materials/Material", "./shapes/Shape", "./tree/SharedTree", "../../pointer/src/Pointer", "./shapes/Box", "../renderer/worker/ThreadPool", "./materials/Texture"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Color_1, Scene_1, Material_1, Shape_1, SharedTree_1, Pointer_1, Box_1, ThreadPool_1, Texture_1;
    var SharedScene;
    return {
        setters:[
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (Scene_1_1) {
                Scene_1 = Scene_1_1;
            },
            function (Material_1_1) {
                Material_1 = Material_1_1;
            },
            function (Shape_1_1) {
                Shape_1 = Shape_1_1;
            },
            function (SharedTree_1_1) {
                SharedTree_1 = SharedTree_1_1;
            },
            function (Pointer_1_1) {
                Pointer_1 = Pointer_1_1;
            },
            function (Box_1_1) {
                Box_1 = Box_1_1;
            },
            function (ThreadPool_1_1) {
                ThreadPool_1 = ThreadPool_1_1;
            },
            function (Texture_1_1) {
                Texture_1 = Texture_1_1;
            }],
        execute: function() {
            SharedScene = (function (_super) {
                __extends(SharedScene, _super);
                function SharedScene(color, shapes, lights, tree, rays) {
                    if (color === void 0) { color = new Color_1.Color(); }
                    if (shapes === void 0) { shapes = []; }
                    if (lights === void 0) { lights = []; }
                    if (tree === void 0) { tree = null; }
                    if (rays === void 0) { rays = 0; }
                    _super.call(this, color, shapes, lights, tree, rays);
                    this.shared = true;
                }
                SharedScene.prototype.getMemory = function () {
                    console.time("getMemory");
                    Pointer_1.Pointer.init();
                    var memory = Pointer_1.Pointer.memory;
                    memory.writeByte(0);
                    memory.writeByte(0);
                    memory.writeByte(0);
                    memory.position += ThreadPool_1.ThreadPool.maxThreads;
                    Texture_1.Texture.write(memory);
                    Material_1.Material.write(memory);
                    this.color.write(memory);
                    memory.writeUnsignedInt(this.shapes.length);
                    this.shapes.forEach(function (shape) {
                        shape.write(memory);
                    });
                    var box = Box_1.Box.boxForShapes(this.shapes);
                    box.write(memory);
                    SharedTree_1.SharedTree.buildAndWrite(memory, this.shapes);
                    console.timeEnd("getMemory");
                    return memory;
                };
                SharedScene.getScene = function (memory) {
                    var scene = new SharedScene();
                    memory.position = 0;
                    memory.position += 3;
                    memory.position += ThreadPool_1.ThreadPool.maxThreads;
                    var offset = Texture_1.Texture.restore(memory);
                    offset = Material_1.Material.restore(memory);
                    scene.color.read(memory);
                    var numShapes = memory.readUnsignedInt();
                    var shapes = [];
                    for (var i = 0; i < numShapes; i++) {
                        offset = Shape_1.restoreShape(memory, shapes);
                        var shape = shapes[i];
                        scene.add(shape);
                    }
                    var box = new Box_1.Box();
                    box.read(memory);
                    scene.tree = SharedTree_1.SharedTree.readFromMemory(memory, shapes);
                    scene.tree.box = box;
                    return scene;
                };
                return SharedScene;
            }(Scene_1.Scene));
            exports_1("SharedScene", SharedScene);
        }
    }
});
//# sourceMappingURL=SharedScene.js.map