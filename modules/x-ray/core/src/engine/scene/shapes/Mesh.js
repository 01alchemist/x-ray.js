System.register(["./Triangle", "../../math/Matrix4", "../../math/Vector3", "../../math/Color", "../../utils/MapUtils", "../tree/Tree", "./Box", "./Shape", "../tree/SharedTree"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Triangle_1, Matrix4_1, Vector3_1, Color_1, MapUtils_1, Tree_1, Box_1, Shape_1, SharedTree_1;
    var Mesh;
    return {
        setters:[
            function (Triangle_1_1) {
                Triangle_1 = Triangle_1_1;
            },
            function (Matrix4_1_1) {
                Matrix4_1 = Matrix4_1_1;
            },
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            },
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (MapUtils_1_1) {
                MapUtils_1 = MapUtils_1_1;
            },
            function (Tree_1_1) {
                Tree_1 = Tree_1_1;
            },
            function (Box_1_1) {
                Box_1 = Box_1_1;
            },
            function (Shape_1_1) {
                Shape_1 = Shape_1_1;
            },
            function (SharedTree_1_1) {
                SharedTree_1 = SharedTree_1_1;
            }],
        execute: function() {
            Mesh = (function () {
                function Mesh(box, triangles, tree) {
                    if (box === void 0) { box = null; }
                    if (triangles === void 0) { triangles = []; }
                    if (tree === void 0) { tree = null; }
                    this.box = box;
                    this.triangles = triangles;
                    this.tree = tree;
                    this.type = Shape_1.ShapeType.MESH;
                }
                Object.defineProperty(Mesh.prototype, "memorySize", {
                    get: function () {
                        if (this.box && this.triangles) {
                            return Box_1.Box.SIZE + this.triangles.length * Triangle_1.Triangle.SIZE + 2;
                        }
                        else {
                            throw "Box or Triangles are missing, box:" + this.box + ", triangles:" + this.triangles.length;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Mesh.prototype.directRead = function (memory, offset) {
                    this.box = new Box_1.Box();
                    offset = this.box.directRead(memory, offset);
                    var numTriangles = memory[offset++];
                    for (var i = 0; i < numTriangles; i++) {
                        var triangle = new Triangle_1.Triangle();
                        offset = triangle.directRead(memory, offset);
                        this.triangles.push(triangle);
                    }
                    return offset;
                };
                Mesh.prototype.directWrite = function (memory, offset) {
                    memory[offset++] = this.type;
                    offset = this.box.directWrite(memory, offset);
                    memory[offset++] = this.triangles.length;
                    this.triangles.forEach(function (t, index) {
                        t.index = index;
                        offset = t.directWrite(memory, offset);
                    });
                    this.tree = SharedTree_1.SharedTree.newTree(this.triangles, this.box);
                    return offset;
                };
                Mesh.prototype.read = function (memory) {
                    if (!this.box) {
                        this.box = new Box_1.Box();
                    }
                    this.box.read(memory);
                    var numTriangles = memory.readUnsignedInt();
                    for (var i = 0; i < numTriangles; i++) {
                        var t = new Triangle_1.Triangle();
                        t.read(memory);
                        this.triangles.push(t);
                    }
                    this.tree = SharedTree_1.SharedTree.readFromMemory(memory, this.triangles);
                    this.tree.box = this.box;
                    return memory.position;
                };
                Mesh.prototype.write = function (memory) {
                    memory.writeByte(this.type);
                    this.box.write(memory);
                    memory.writeUnsignedInt(this.triangles.length);
                    this.triangles.forEach(function (t, index) {
                        t.index = index;
                        t.write(memory);
                    });
                    SharedTree_1.SharedTree.buildAndWrite(memory, this.triangles);
                    return memory.position;
                };
                Mesh.fromJson = function (mesh) {
                    return new Mesh(Box_1.Box.fromJson(mesh.box), Triangle_1.Triangle.fromJson(mesh.triangles));
                };
                Mesh.newMesh = function (triangles) {
                    var box = Box_1.Box.boxForTriangles(triangles);
                    return new Mesh(box, triangles, null);
                };
                Mesh.prototype.compile = function () {
                    var m = this;
                    if (m.tree == null) {
                        m.tree = Tree_1.Tree.newTree(m.triangles, m.box);
                    }
                };
                Mesh.prototype.intersect = function (r) {
                    return this.tree.intersect(r);
                };
                Mesh.prototype.getColor = function (p) {
                    return new Color_1.Color();
                };
                Mesh.prototype.getMaterial = function (p) {
                    return this.material;
                };
                Mesh.prototype.getNormal = function (p) {
                    return new Vector3_1.Vector3();
                };
                Mesh.prototype.getRandomPoint = function () {
                    return new Vector3_1.Vector3();
                };
                Mesh.prototype.updateBox = function () {
                    this.box = Box_1.Box.boxForTriangles(this.triangles);
                };
                Mesh.prototype._smoothNormalsThreshold = function (normal, normals, threshold) {
                    var result = new Vector3_1.Vector3();
                    normals.forEach(function (x) {
                        if (x.dot(normal) >= threshold) {
                            result = result.add(x);
                        }
                    });
                    return result.normalize();
                };
                Mesh.prototype.smoothNormalsThreshold = function (radians) {
                    var m = this;
                    var threshold = Math.cos(radians);
                    var lookup = new Map();
                    m.triangles.forEach(function (t) {
                        lookup[t.v1] = MapUtils_1.append(lookup[t.v1], t.n1);
                        lookup[t.v2] = MapUtils_1.append(lookup[t.v2], t.n2);
                        lookup[t.v3] = MapUtils_1.append(lookup[t.v3], t.n3);
                    });
                    m.triangles.forEach(function (t) {
                        t.n1 = m._smoothNormalsThreshold(t.n1, lookup[t.v1], threshold);
                        t.n2 = m._smoothNormalsThreshold(t.n2, lookup[t.v2], threshold);
                        t.n3 = m._smoothNormalsThreshold(t.n3, lookup[t.v3], threshold);
                    });
                };
                Mesh.prototype.smoothNormals = function () {
                    var m = this;
                    var lookup = new Map();
                    m.triangles.forEach(function (t) {
                        lookup[t.v1] = lookup[t.v1] ? lookup[t.v1].add(t.n1) : t.n1;
                        lookup[t.v2] = lookup[t.v2] ? lookup[t.v2].add(t.n2) : t.v2;
                        lookup[t.v3] = lookup[t.v3] ? lookup[t.v3].add(t.n3) : t.v3;
                    });
                    lookup.forEach(function (v, k) {
                        lookup[k] = v.normalize();
                    });
                    m.triangles.forEach(function (t) {
                        t.n1 = lookup[t.v1];
                        t.n2 = lookup[t.v2];
                        t.n3 = lookup[t.v3];
                    });
                };
                Mesh.prototype.moveTo = function (position, anchor) {
                    var m = this;
                    var matrix = Matrix4_1.Matrix4.translate(position.sub(m.box.anchor(anchor)));
                    m.transform(matrix);
                };
                Mesh.prototype.fitInside = function (box, anchor) {
                    var m = this;
                    var scale = box.size().div(m.box.size()).minComponent();
                    var extra = box.size().sub(m.box.size().mulScalar(scale));
                    var matrix = Matrix4_1.Matrix4.identity();
                    matrix = matrix.translate(m.box.min.mulScalar(-1));
                    matrix = matrix.scale(new Vector3_1.Vector3(scale, scale, scale));
                    matrix = matrix.translate(box.min.add(extra.mul(anchor)));
                    m.transform(matrix);
                };
                Mesh.prototype.transform = function (matrix) {
                    var m = this;
                    m.triangles.forEach(function (t) {
                        t.v1 = matrix.mulPosition(t.v1);
                        t.v2 = matrix.mulPosition(t.v2);
                        t.v3 = matrix.mulPosition(t.v3);
                        t.n1 = matrix.mulDirection(t.n1);
                        t.n2 = matrix.mulDirection(t.n2);
                        t.n3 = matrix.mulDirection(t.n3);
                        t.updateBox();
                    });
                    m.updateBox();
                    m.tree = null;
                };
                Mesh.inter = 0;
                return Mesh;
            }());
            exports_1("Mesh", Mesh);
        }
    }
});
//# sourceMappingURL=Mesh.js.map