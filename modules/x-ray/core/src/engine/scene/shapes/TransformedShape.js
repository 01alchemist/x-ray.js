System.register(["../../math/Ray", "./Shape", "../../math/Matrix4", "../../math/HitInfo"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Ray_1, Shape_1, Matrix4_1, HitInfo_1;
    var TransformedShape;
    return {
        setters:[
            function (Ray_1_1) {
                Ray_1 = Ray_1_1;
            },
            function (Shape_1_1) {
                Shape_1 = Shape_1_1;
            },
            function (Matrix4_1_1) {
                Matrix4_1 = Matrix4_1_1;
            },
            function (HitInfo_1_1) {
                HitInfo_1 = HitInfo_1_1;
            }],
        execute: function() {
            TransformedShape = (function () {
                function TransformedShape(shape, matrix, inverse, normalMatrix) {
                    if (shape === void 0) { shape = null; }
                    if (matrix === void 0) { matrix = new Matrix4_1.Matrix4(); }
                    if (inverse === void 0) { inverse = new Matrix4_1.Matrix4(); }
                    this.shape = shape;
                    this.matrix = matrix;
                    this.inverse = inverse;
                    this.normalMatrix = normalMatrix;
                    this.type = Shape_1.ShapeType.TRANSFORMED_SHAPE;
                }
                Object.defineProperty(TransformedShape.prototype, "memorySize", {
                    get: function () {
                        if (this.shape) {
                            return this.shape.memorySize + Matrix4_1.Matrix4.SIZE + 1;
                        }
                        else {
                            return 0;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                TransformedShape.prototype.directRead = function (memory, offset) {
                    offset = this.matrix.directRead(memory, offset);
                    this.inverse = this.matrix.inverse();
                    var container = [];
                    offset = Shape_1.directRestoreShape(memory, offset, container);
                    this.shape = container[0];
                    container = null;
                    return offset;
                };
                TransformedShape.prototype.directWrite = function (memory, offset) {
                    memory[offset++] = this.type;
                    offset = this.matrix.directWrite(memory, offset);
                    offset = this.shape.directWrite(memory, offset);
                    return offset;
                };
                TransformedShape.prototype.read = function (memory) {
                    this.matrix.read(memory);
                    this.inverse = this.matrix.inverse();
                    var container = [];
                    Shape_1.restoreShape(memory, container);
                    this.shape = container[0];
                    container = null;
                    return memory.position;
                };
                TransformedShape.prototype.write = function (memory) {
                    memory.writeByte(this.type);
                    this.matrix.write(memory);
                    this.shape.write(memory);
                    return memory.position;
                };
                TransformedShape.fromJson = function (transformedShape) {
                    return new TransformedShape(Shape_1.ShapefromJson(transformedShape.shape), Matrix4_1.Matrix4.fromJson(transformedShape.matrix), Matrix4_1.Matrix4.fromJson(transformedShape.inverse));
                };
                TransformedShape.newTransformedShape = function (s, m) {
                    return new TransformedShape(s, m, m.inverse());
                };
                Object.defineProperty(TransformedShape.prototype, "box", {
                    get: function () {
                        return this.matrix.mulBox(this.shape.box);
                    },
                    enumerable: true,
                    configurable: true
                });
                TransformedShape.prototype.compile = function () {
                    this.shape.compile();
                };
                TransformedShape.prototype.intersect = function (r) {
                    var shapeRay = this.inverse.mulRay(r);
                    var hit = this.shape.intersect(shapeRay);
                    if (!hit.ok()) {
                        return hit;
                    }
                    var shape = hit.shape;
                    var shapePosition = shapeRay.position(hit.T);
                    var shapeNormal = shape.getNormal(shapePosition);
                    var position = this.matrix.mulPosition(shapePosition);
                    var normal = this.inverse.transpose().mulDirection(shapeNormal);
                    var color = shape.getColor(shapePosition);
                    var material = shape.getMaterial(shapePosition);
                    var inside = false;
                    if (shapeNormal.dot(shapeRay.direction) > 0) {
                        normal = normal.mulScalar(-1);
                        inside = true;
                    }
                    var ray = new Ray_1.Ray(position, normal);
                    var info = new HitInfo_1.HitInfo(shape, position, normal, ray, color, material, inside);
                    hit.T = position.sub(r.origin).length();
                    hit.info = info;
                    return hit;
                };
                TransformedShape.prototype.getColor = function (p) {
                    return this.shape.getColor(this.inverse.mulPosition(p));
                };
                TransformedShape.prototype.getMaterial = function (p) {
                    return this.shape.getMaterial(this.inverse.mulPosition(p));
                };
                TransformedShape.prototype.getNormal = function (p) {
                    console.log("getNormal");
                    return null;
                };
                TransformedShape.prototype.getRandomPoint = function () {
                    return this.shape.getRandomPoint();
                };
                return TransformedShape;
            }());
            exports_1("TransformedShape", TransformedShape);
        }
    }
});
//# sourceMappingURL=TransformedShape.js.map