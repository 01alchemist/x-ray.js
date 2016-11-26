System.register(["../../math/Vector3", "../materials/Material", "./Box", "../../math/Hit", "./Shape", "../materials/MaterialUtils"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Vector3_1, Material_1, Box_1, Hit_1, Hit_2, Shape_1, MaterialUtils_1;
    var Sphere;
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
            Sphere = (function () {
                function Sphere(center, radius, material, box) {
                    if (center === void 0) { center = new Vector3_1.Vector3(); }
                    if (radius === void 0) { radius = 1; }
                    if (material === void 0) { material = null; }
                    if (box === void 0) { box = null; }
                    this.center = center;
                    this.radius = radius;
                    this.material = material;
                    this.box = box;
                    this.type = Shape_1.ShapeType.SPHERE;
                    this.memorySize = Vector3_1.Vector3.SIZE + 3;
                    if (!box && center) {
                        var min = new Vector3_1.Vector3(center.x - radius, center.y - radius, center.z - radius);
                        var max = new Vector3_1.Vector3(center.x + radius, center.y + radius, center.z + radius);
                        this.box = new Box_1.Box(min, max);
                    }
                }
                Sphere.prototype.directRead = function (memory, offset) {
                    offset = this.center.directRead(memory, offset);
                    this.radius = memory[offset++];
                    var min = new Vector3_1.Vector3(this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);
                    var max = new Vector3_1.Vector3(this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
                    this.box = new Box_1.Box(min, max);
                    var materialIndex = memory[offset++];
                    var material = Material_1.Material.map[materialIndex];
                    if (material) {
                        this.material = material;
                    }
                    return offset;
                };
                Sphere.prototype.directWrite = function (memory, offset) {
                    memory[offset++] = this.type;
                    offset = this.center.directWrite(memory, offset);
                    memory[offset++] = this.radius;
                    memory[offset++] = this.material.index;
                    return offset;
                };
                Sphere.prototype.read = function (memory) {
                    this.center.read(memory);
                    this.radius = memory.readFloat();
                    var min = new Vector3_1.Vector3(this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);
                    var max = new Vector3_1.Vector3(this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
                    this.box = new Box_1.Box(min, max);
                    var materialIndex = memory.readInt();
                    var material = Material_1.Material.map[materialIndex];
                    if (material) {
                        this.material = material;
                    }
                    return memory.position;
                };
                Sphere.prototype.write = function (memory) {
                    memory.writeByte(this.type);
                    this.center.write(memory);
                    memory.writeFloat(this.radius);
                    memory.writeInt(this.material.index);
                    return memory.position;
                };
                Sphere.fromJson = function (sphere) {
                    return new Sphere(Vector3_1.Vector3.fromJson(sphere.center), sphere.radius, MaterialUtils_1.MaterialUtils.fromJson(sphere.material), Box_1.Box.fromJson(sphere.box));
                };
                Sphere.newSphere = function (center, radius, material) {
                    var min = new Vector3_1.Vector3(center.x - radius, center.y - radius, center.z - radius);
                    var max = new Vector3_1.Vector3(center.x + radius, center.y + radius, center.z + radius);
                    var box = new Box_1.Box(min, max);
                    return new Sphere(center, radius, material, box);
                };
                Sphere.prototype.compile = function () {
                };
                Sphere.prototype.intersect = function (r) {
                    var to = r.origin.sub(this.center);
                    var b = to.dot(r.direction);
                    var c = to.dot(to) - this.radius * this.radius;
                    var d = b * b - c;
                    if (d > 0) {
                        d = Math.sqrt(d);
                        var t1 = -b - d;
                        if (t1 > 0) {
                            return new Hit_1.Hit(this, t1);
                        }
                    }
                    return Hit_2.NoHit;
                };
                Sphere.prototype.getColor = function (p) {
                    if (this.material.texture == null) {
                        return this.material.color;
                    }
                    var u = Math.atan2(p.z, p.x);
                    var v = Math.atan2(p.y, new Vector3_1.Vector3(p.x, 0, p.z).length());
                    u = (u + Math.PI) / (2 * Math.PI);
                    v = 1 - (v + Math.PI / 2) / Math.PI;
                    return this.material.texture.sample(u, v);
                };
                Sphere.prototype.getMaterial = function (p) {
                    return this.material;
                };
                Sphere.prototype.getNormal = function (p) {
                    return p.sub(this.center).normalize();
                };
                Sphere.prototype.getRandomPoint = function () {
                    while (true) {
                        var x = Math.random() * 2 - 1;
                        var y = Math.random() * 2 - 1;
                        var z = Math.random() * 2 - 1;
                        var v = new Vector3_1.Vector3(x, y, z);
                        if (v.length() <= 1) {
                            return v.mulScalar(this.radius).add(this.center);
                        }
                    }
                };
                return Sphere;
            }());
            exports_1("Sphere", Sphere);
        }
    }
});
//# sourceMappingURL=Sphere.js.map