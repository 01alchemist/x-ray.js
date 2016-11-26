System.register(["./Cube", "./Sphere", "./Mesh", "./Triangle", "./TransformedShape"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Cube_1, Sphere_1, Mesh_1, Triangle_1, TransformedShape_1;
    var ShapeType;
    function ShapesfromJson(shapes) {
        var _shapes = [];
        shapes.forEach(function (shape) {
            switch (shape.type) {
                case ShapeType.CUBE:
                    _shapes.push(Cube_1.Cube.fromJson(shape));
                    break;
                case ShapeType.SPHERE:
                    _shapes.push(Sphere_1.Sphere.fromJson(shape));
                    break;
                case ShapeType.MESH:
                    _shapes.push(Mesh_1.Mesh.fromJson(shape));
                    break;
                case ShapeType.TRANSFORMED_SHAPE:
                    _shapes.push(TransformedShape_1.TransformedShape.fromJson(shape));
                    break;
                case ShapeType.TRIANGLE:
                    _shapes.push(Triangle_1.Triangle.fromJson(shape));
                    break;
            }
        });
        return _shapes;
    }
    exports_1("ShapesfromJson", ShapesfromJson);
    function ShapefromJson(shape) {
        switch (shape.type) {
            case ShapeType.CUBE:
                return Cube_1.Cube.fromJson(shape);
            case ShapeType.SPHERE:
                return Sphere_1.Sphere.fromJson(shape);
            case ShapeType.MESH:
                return Mesh_1.Mesh.fromJson(shape);
            case ShapeType.TRANSFORMED_SHAPE:
                return TransformedShape_1.TransformedShape.fromJson(shape);
            case ShapeType.TRIANGLE:
                return Triangle_1.Triangle.fromJson(shape);
        }
    }
    exports_1("ShapefromJson", ShapefromJson);
    function directRestoreShape(memory, offset, container) {
        var type = memory[offset++];
        switch (type) {
            case ShapeType.CUBE:
                var cube = new Cube_1.Cube();
                container.push(cube);
                return cube.directRead(memory, offset);
            case ShapeType.SPHERE:
                var sphere = new Sphere_1.Sphere();
                container.push(sphere);
                return sphere.directRead(memory, offset);
            case ShapeType.MESH:
                var mesh = new Mesh_1.Mesh();
                container.push(mesh);
                return mesh.directRead(memory, offset);
            case ShapeType.TRANSFORMED_SHAPE:
                var shape = new TransformedShape_1.TransformedShape();
                container.push(shape);
                return shape.directRead(memory, offset);
        }
    }
    exports_1("directRestoreShape", directRestoreShape);
    function restoreShape(memory, container) {
        var type = memory.readByte();
        switch (type) {
            case ShapeType.CUBE:
                var cube = new Cube_1.Cube();
                container.push(cube);
                return cube.read(memory);
            case ShapeType.SPHERE:
                var sphere = new Sphere_1.Sphere();
                container.push(sphere);
                return sphere.read(memory);
            case ShapeType.MESH:
                var mesh = new Mesh_1.Mesh();
                container.push(mesh);
                return mesh.read(memory);
            case ShapeType.TRANSFORMED_SHAPE:
                var shape = new TransformedShape_1.TransformedShape();
                container.push(shape);
                return shape.read(memory);
        }
    }
    exports_1("restoreShape", restoreShape);
    return {
        setters:[
            function (Cube_1_1) {
                Cube_1 = Cube_1_1;
            },
            function (Sphere_1_1) {
                Sphere_1 = Sphere_1_1;
            },
            function (Mesh_1_1) {
                Mesh_1 = Mesh_1_1;
            },
            function (Triangle_1_1) {
                Triangle_1 = Triangle_1_1;
            },
            function (TransformedShape_1_1) {
                TransformedShape_1 = TransformedShape_1_1;
            }],
        execute: function() {
            (function (ShapeType) {
                ShapeType[ShapeType["TRIANGLE"] = 0] = "TRIANGLE";
                ShapeType[ShapeType["CUBE"] = 1] = "CUBE";
                ShapeType[ShapeType["SPHERE"] = 2] = "SPHERE";
                ShapeType[ShapeType["MESH"] = 3] = "MESH";
                ShapeType[ShapeType["TRANSFORMED_SHAPE"] = 4] = "TRANSFORMED_SHAPE";
            })(ShapeType || (ShapeType = {}));
            exports_1("ShapeType", ShapeType);
        }
    }
});
//# sourceMappingURL=Shape.js.map