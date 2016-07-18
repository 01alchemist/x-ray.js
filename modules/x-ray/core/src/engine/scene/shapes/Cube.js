System.register(["../../math/Vector3", "../materials/Material", "./Box", "../../math/Constants", "../../math/Hit", "./Shape", "../materials/MaterialUtils"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Vector3_1, Material_1, Box_1, Constants_1, Hit_1, Hit_2, Shape_1, MaterialUtils_1;
    var Cube;
    return {
        setters:[
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            },
            function (Material_1_1) {
                Material_1 = Material_1_1;
            },
            function (Box_1_1) {
                Box_1 = Box_1_1;
            },
            function (Constants_1_1) {
                Constants_1 = Constants_1_1;
            },
            function (Hit_1_1) {
                Hit_1 = Hit_1_1;
                Hit_2 = Hit_1_1;
            },
            function (Shape_1_1) {
                Shape_1 = Shape_1_1;
            },
            function (MaterialUtils_1_1) {
                MaterialUtils_1 = MaterialUtils_1_1;
            }],
        execute: function() {
            Cube = (function () {
                function Cube(min, max, material, box) {
                    if (min === void 0) { min = new Vector3_1.Vector3(); }
                    if (max === void 0) { max = new Vector3_1.Vector3(); }
                    if (material === void 0) { material = null; }
                    if (box === void 0) { box = null; }
                    this.min = min;
                    this.max = max;
                    this.material = material;
                    this.box = box;
                    this.type = Shape_1.ShapeType.CUBE;
                    this.memorySize = (Vector3_1.Vector3.SIZE * 2) + 2;
                }
                Cube.prototype.write = function (memory) {
                    memory.writeByte(this.type);
                    this.min.write(memory);
                    this.max.write(memory);
                    memory.writeInt(this.material.index);
                    return memory.position;
                };
                Cube.prototype.read = function (memory) {
                    this.min.read(memory);
                    this.max.read(memory);
                    var materialIndex = memory.readInt();
                    this.box = new Box_1.Box(this.min, this.max);
                    var material = Material_1.Material.map[materialIndex];
                    if (material) {
                        this.material = material;
                    }
                    return memory.position;
                };
                Cube.prototype.directWrite = function (memory, offset) {
                    memory[offset++] = this.type;
                    offset = this.min.directWrite(memory, offset);
                    offset = this.max.directWrite(memory, offset);
                    memory[offset++] = this.material.index;
                    return offset;
                };
                Cube.prototype.directRead = function (memory, offset) {
                    offset = this.min.directRead(memory, offset);
                    offset = this.max.directRead(memory, offset);
                    this.box = new Box_1.Box(this.min, this.max);
                    this.material.index = memory[offset++];
                    var material = Material_1.Material.map[this.material.index];
                    if (material) {
                        this.material = material;
                    }
                    return offset;
                };
                Cube.fromJson = function (shape) {
                    return new Cube(Vector3_1.Vector3.fromJson(shape.min), Vector3_1.Vector3.fromJson(shape.max), MaterialUtils_1.MaterialUtils.fromJson(shape.material), Box_1.Box.fromJson(shape.box));
                };
                Cube.newCube = function (min, max, material) {
                    var box = new Box_1.Box(min, max);
                    return new Cube(min, max, material, box);
                };
                Cube.prototype.compile = function () {
                };
                Cube.prototype.intersect = function (r) {
                    var n = this.min.sub(r.origin).div(r.direction);
                    var f = this.max.sub(r.origin).div(r.direction);
                    var _n = n;
                    n = _n.min(f);
                    f = _n.max(f);
                    var t0 = Math.max(Math.max(n.x, n.y), n.z);
                    var t1 = Math.min(Math.min(f.x, f.y), f.z);
                    if (t0 > 0 && t0 < t1) {
                        return new Hit_1.Hit(this, t0);
                    }
                    return Hit_2.NoHit;
                };
                Cube.prototype.getColor = function (p) {
                    return this.material.color;
                };
                Cube.prototype.getMaterial = function (p) {
                    return this.material;
                };
                Cube.prototype.getNormal = function (p) {
                    if (p.x < this.min.x + Constants_1.EPS) {
                        return new Vector3_1.Vector3(-1, 0, 0);
                    }
                    else if (p.x > this.max.x - Constants_1.EPS) {
                        return new Vector3_1.Vector3(1, 0, 0);
                    }
                    else if (p.y < this.min.y + Constants_1.EPS) {
                        return new Vector3_1.Vector3(0, -1, 0);
                    }
                    else if (p.y > this.max.y - Constants_1.EPS) {
                        return new Vector3_1.Vector3(0, 1, 0);
                    }
                    else if (p.z < this.min.z + Constants_1.EPS) {
                        return new Vector3_1.Vector3(0, 0, -1);
                    }
                    else if (p.z > this.max.z - Constants_1.EPS) {
                        return new Vector3_1.Vector3(0, 0, 1);
                    }
                    return new Vector3_1.Vector3(0, 1, 0);
                };
                Cube.prototype.getRandomPoint = function () {
                    var x = this.min.x + Math.random() * (this.max.x - this.min.x);
                    var y = this.min.y + Math.random() * (this.max.y - this.min.y);
                    var z = this.min.z + Math.random() * (this.max.z - this.min.z);
                    return new Vector3_1.Vector3(x, y, z);
                };
                return Cube;
            }());
            exports_1("Cube", Cube);
        }
    }
});
//# sourceMappingURL=Cube.js.map