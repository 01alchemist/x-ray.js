System.register(["../../math/Vector3", "../Axis"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Vector3_1, Axis_1;
    var Box;
    return {
        setters:[
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            },
            function (Axis_1_1) {
                Axis_1 = Axis_1_1;
            }],
        execute: function() {
            Box = (function () {
                function Box(min, max) {
                    if (min === void 0) { min = new Vector3_1.Vector3(); }
                    if (max === void 0) { max = new Vector3_1.Vector3(); }
                    this.min = min;
                    this.max = max;
                    this.memorySize = Box.SIZE;
                }
                Box.prototype.directWrite = function (memory, offset) {
                    offset = this.min.directWrite(memory, offset);
                    offset = this.max.directWrite(memory, offset);
                    return offset;
                };
                Box.prototype.directRead = function (memory, offset) {
                    offset = this.min.directRead(memory, offset);
                    offset = this.max.directRead(memory, offset);
                    return offset;
                };
                Box.prototype.read = function (memory) {
                    this.min.read(memory);
                    this.max.read(memory);
                    return memory.position;
                };
                Box.prototype.write = function (memory) {
                    this.min.write(memory);
                    this.max.write(memory);
                    return memory.position;
                };
                Box.fromJson = function (box) {
                    return new Box(Vector3_1.Vector3.fromJson(box.min), Vector3_1.Vector3.fromJson(box.max));
                };
                Box.boxForShapes = function (shapes) {
                    if (shapes.length == 0) {
                        return new Box();
                    }
                    var box = shapes[0].box;
                    shapes.forEach(function (shape) {
                        box = box.extend(shape.box);
                    });
                    return box;
                };
                Box.boxForTriangles = function (shapes) {
                    if (shapes.length == 0) {
                        return new Box();
                    }
                    var box = shapes[0].box;
                    shapes.forEach(function (shape) {
                        box = box.extend(shape.box);
                    });
                    return box;
                };
                Box.prototype.anchor = function (anchor) {
                    return this.min.add(this.size().mul(anchor));
                };
                Box.prototype.center = function () {
                    return this.anchor(new Vector3_1.Vector3(0.5, 0.5, 0.5));
                };
                Box.prototype.size = function () {
                    return this.max.sub(this.min);
                };
                Box.prototype.extend = function (b) {
                    return new Box(this.min.min(b.min), this.max.max(b.max));
                };
                Box.prototype.intersect = function (r) {
                    var x1 = (this.min.x - r.origin.x) / r.direction.x;
                    var y1 = (this.min.y - r.origin.y) / r.direction.y;
                    var z1 = (this.min.z - r.origin.z) / r.direction.z;
                    var x2 = (this.max.x - r.origin.x) / r.direction.x;
                    var y2 = (this.max.y - r.origin.y) / r.direction.y;
                    var z2 = (this.max.z - r.origin.z) / r.direction.z;
                    if (x1 > x2) {
                        var _x1 = x1;
                        x1 = x2;
                        x2 = _x1;
                    }
                    if (y1 > y2) {
                        var _y1 = y1;
                        y1 = y2;
                        y2 = _y1;
                    }
                    if (z1 > z2) {
                        var _z1 = z1;
                        z1 = z2;
                        z2 = _z1;
                    }
                    var t1 = Math.max(Math.max(x1, y1), z1);
                    var t2 = Math.min(Math.min(x2, y2), z2);
                    return { min: t1, max: t2 };
                };
                Box.prototype.partition = function (axis, point) {
                    var left;
                    var right;
                    switch (axis) {
                        case Axis_1.Axis.AxisX:
                            left = this.min.x <= point;
                            right = this.max.x >= point;
                            break;
                        case Axis_1.Axis.AxisY:
                            left = this.min.y <= point;
                            right = this.max.y >= point;
                            break;
                        case Axis_1.Axis.AxisZ:
                            left = this.min.z <= point;
                            right = this.max.z >= point;
                            break;
                    }
                    return { left: left, right: right };
                };
                Box.prototype.toString = function () {
                    return "Box(min:" + this.min.toString() + ", max:" + this.max.toString() + ")";
                };
                Box.SIZE = Vector3_1.Vector3.SIZE * 2;
                return Box;
            }());
            exports_1("Box", Box);
        }
    }
});
//# sourceMappingURL=Box.js.map