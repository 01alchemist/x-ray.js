System.register(["../Axis", "../../math/Hit", "../../utils/MapUtils", "../../utils/MathUtils", "../../../pointer/src/ByteArrayBase", "../../../pointer/src/DirectMemory"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Axis_1, Hit_1, MapUtils_1, MapUtils_2, MathUtils_1, ByteArrayBase_1, DirectMemory_1;
    var NodeMarker, SharedNode;
    return {
        setters:[
            function (Axis_1_1) {
                Axis_1 = Axis_1_1;
            },
            function (Hit_1_1) {
                Hit_1 = Hit_1_1;
            },
            function (MapUtils_1_1) {
                MapUtils_1 = MapUtils_1_1;
                MapUtils_2 = MapUtils_1_1;
            },
            function (MathUtils_1_1) {
                MathUtils_1 = MathUtils_1_1;
            },
            function (ByteArrayBase_1_1) {
                ByteArrayBase_1 = ByteArrayBase_1_1;
            },
            function (DirectMemory_1_1) {
                DirectMemory_1 = DirectMemory_1_1;
            }],
        execute: function() {
            (function (NodeMarker) {
                NodeMarker[NodeMarker["ROOT"] = 1118481] = "ROOT";
                NodeMarker[NodeMarker["LEFT"] = 15597585] = "LEFT";
                NodeMarker[NodeMarker["RIGHT"] = 1114350] = "RIGHT";
                NodeMarker[NodeMarker["LEAF"] = 15597806] = "LEAF";
                NodeMarker[NodeMarker["EON"] = 14737632] = "EON";
                NodeMarker[NodeMarker["NULL"] = 15658734] = "NULL";
            })(NodeMarker || (NodeMarker = {}));
            exports_1("NodeMarker", NodeMarker);
            SharedNode = (function () {
                function SharedNode(axis, point, shapes, shapeIndices, _left, _right) {
                    if (axis === void 0) { axis = null; }
                    if (point === void 0) { point = null; }
                    if (shapes === void 0) { shapes = null; }
                    if (shapeIndices === void 0) { shapeIndices = null; }
                    if (_left === void 0) { _left = null; }
                    if (_right === void 0) { _right = null; }
                    this.axis = axis;
                    this.point = point;
                    this.shapes = shapes;
                    this.shapeIndices = shapeIndices;
                    this._left = _left;
                    this._right = _right;
                    this.size = 0;
                    this.treeLength = 0;
                    this.thisPtr = -1;
                    this.resolved = false;
                    this.index = SharedNode.map.push(this) - 1;
                }
                Object.defineProperty(SharedNode.prototype, "left", {
                    get: function () {
                        if (!this._left) {
                            this.readChild(this.memory, NodeMarker.LEFT);
                        }
                        return this._left;
                    },
                    set: function (value) {
                        this._left = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SharedNode.prototype, "right", {
                    get: function () {
                        if (!this._right) {
                            this.readChild(this.memory, NodeMarker.RIGHT);
                        }
                        return this._right;
                    },
                    set: function (value) {
                        this._right = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                SharedNode.prototype.readRoot = function (memory) {
                    this.memory = memory;
                    this.thisPtr = memory.position;
                    this.treeLength = memory.readUnsignedInt();
                    this.marker = memory.readUnsignedInt();
                    if (this.marker == NodeMarker.LEAF) {
                        this.axis = memory.readByte();
                        this.point = memory.readFloat();
                        var shapeLength = memory.readUnsignedInt();
                        this.shapeIndices = [];
                        for (var i = 0; i < shapeLength; i++) {
                            var shapeIndex = memory.readUnsignedInt();
                            this.shapeIndices.push(shapeIndex);
                        }
                        if (memory.readUnsignedInt() != NodeMarker.EON) {
                            console.error("End marker not found on leaf node");
                        }
                        this.resolved = true;
                        return memory.position;
                    }
                    else if (this.marker != NodeMarker.ROOT) {
                        throw "Root marker not found!, found:" + this.marker + ",  pos:" + memory.position;
                    }
                    else {
                        this.axis = memory.readByte();
                        this.point = memory.readFloat();
                        this.leftPtr = memory.readUnsignedInt();
                        this.rightPtr = memory.readUnsignedInt();
                    }
                    this.resolved = true;
                    memory.position = this.thisPtr + this.treeLength;
                    return memory.position;
                };
                SharedNode.prototype.read = function (memory) {
                    if (this.resolved) {
                        return;
                    }
                    this.memory = memory;
                    if (this.thisPtr == -1) {
                        this.thisPtr = memory.position;
                    }
                    else {
                        memory.position = this.thisPtr;
                    }
                    this.marker = memory.readUnsignedInt();
                    this.axis = memory.readByte();
                    this.point = memory.readFloat();
                    if (this.marker == NodeMarker.LEAF) {
                        var shapeLength = memory.readUnsignedInt();
                        this.shapeIndices = [];
                        for (var i = 0; i < shapeLength; i++) {
                            var shapeIndex = memory.readUnsignedInt();
                            this.shapeIndices.push(shapeIndex);
                        }
                        if (memory.readUnsignedInt() != NodeMarker.EON) {
                            console.error("End marker not found on leaf node");
                        }
                    }
                    else {
                        this.leftPtr = memory.readUnsignedInt();
                        this.rightPtr = memory.readUnsignedInt();
                    }
                    this.resolved = true;
                    return memory.position;
                };
                SharedNode.prototype.readChild = function (memory, marker) {
                    var node = new SharedNode();
                    if (marker == NodeMarker.LEFT) {
                        memory.position = this.leftPtr;
                        node.read(memory);
                        this.left = node;
                    }
                    else if (marker == NodeMarker.RIGHT) {
                        memory.position = this.rightPtr;
                        node.read(memory);
                        this.right = node;
                    }
                    return memory.position;
                };
                SharedNode.newNode = function (shapes, memory) {
                    var node = new SharedNode(Axis_1.Axis.AxisNone, 0, shapes, [], null, null);
                    node.memory = memory;
                    return node;
                };
                SharedNode.fromJson = function (node) {
                    return new SharedNode(node.axis, node.point, null, node.shapeIndices, node.left, node.right);
                };
                SharedNode.prototype.intersect = function (r, tmin, tmax) {
                    var node = this;
                    var tsplit;
                    var leftFirst;
                    switch (node.axis) {
                        case Axis_1.Axis.AxisNone:
                            return this.intersectShapes(node, r);
                        case Axis_1.Axis.AxisX:
                            tsplit = (node.point - r.origin.x) / r.direction.x;
                            leftFirst = (r.origin.x < node.point) || (r.origin.x == node.point && r.direction.x <= 0);
                            break;
                        case Axis_1.Axis.AxisY:
                            tsplit = (node.point - r.origin.y) / r.direction.y;
                            leftFirst = (r.origin.y < node.point) || (r.origin.y == node.point && r.direction.y <= 0);
                            break;
                        case Axis_1.Axis.AxisZ:
                            tsplit = (node.point - r.origin.z) / r.direction.z;
                            leftFirst = (r.origin.z < node.point) || (r.origin.z == node.point && r.direction.z <= 0);
                            break;
                    }
                    var first;
                    var second;
                    if (leftFirst) {
                        first = node.left;
                        second = node.right;
                    }
                    else {
                        first = node.right;
                        second = node.left;
                    }
                    if (!first || !second) {
                        console.log("node:", node);
                        console.log("null nodes found");
                    }
                    if (tsplit > tmax || tsplit <= 0) {
                        return this.intersectNode(first, r, tmin, tmax);
                    }
                    else if (tsplit < tmin) {
                        return this.intersectNode(second, r, tmin, tmax);
                    }
                    else {
                        var h1 = this.intersectNode(first, r, tmin, tsplit);
                        if (h1.T <= tsplit) {
                            return h1;
                        }
                        var h2 = this.intersectNode(second, r, tsplit, Math.min(tmax, h1.T));
                        if (h1.T <= h2.T) {
                            return h1;
                        }
                        else {
                            return h2;
                        }
                    }
                };
                SharedNode.prototype.intersectNode = function (node, r, tmin, tmax) {
                    var tsplit;
                    var leftFirst;
                    switch (node.axis) {
                        case Axis_1.Axis.AxisNone:
                            return this.intersectShapes(node, r);
                        case Axis_1.Axis.AxisX:
                            tsplit = (node.point - r.origin.x) / r.direction.x;
                            leftFirst = (r.origin.x < node.point) || (r.origin.x == node.point && r.direction.x <= 0);
                            break;
                        case Axis_1.Axis.AxisY:
                            tsplit = (node.point - r.origin.y) / r.direction.y;
                            leftFirst = (r.origin.y < node.point) || (r.origin.y == node.point && r.direction.y <= 0);
                            break;
                        case Axis_1.Axis.AxisZ:
                            tsplit = (node.point - r.origin.z) / r.direction.z;
                            leftFirst = (r.origin.z < node.point) || (r.origin.z == node.point && r.direction.z <= 0);
                            break;
                    }
                    var first;
                    var second;
                    if (leftFirst) {
                        first = node.left;
                        second = node.right;
                    }
                    else {
                        first = node.right;
                        second = node.left;
                    }
                    if (tsplit > tmax || tsplit <= 0) {
                        return this.intersectNode(first, r, tmin, tmax);
                    }
                    else if (tsplit < tmin) {
                        return this.intersectNode(second, r, tmin, tmax);
                    }
                    else {
                        var h1 = this.intersectNode(first, r, tmin, tsplit);
                        if (h1.T <= tsplit) {
                            return h1;
                        }
                        var h2 = this.intersectNode(second, r, tsplit, Math.min(tmax, h1.T));
                        if (h1.T <= h2.T) {
                            return h1;
                        }
                        else {
                            return h2;
                        }
                    }
                };
                SharedNode.prototype.intersectShapes = function (node, r) {
                    var hit = Hit_1.NoHit;
                    var self = this;
                    if (!node.resolved && !node.shapeIndices) {
                        node.read(this.memory);
                    }
                    var i = 0;
                    var shapeIndex;
                    var shape;
                    var h;
                    for (; i < node.shapeIndices.length; i++) {
                        shapeIndex = node.shapeIndices[i];
                        shape = self.shapes[shapeIndex];
                        h = shape.intersect(r);
                        if (h.T < hit.T) {
                            hit = h;
                        }
                    }
                    return hit;
                };
                SharedNode.prototype.partitionScore = function (axis, point) {
                    var node = this;
                    var left = 0;
                    var right = 0;
                    node.shapes.forEach(function (shape) {
                        var box = shape.box;
                        var p = box.partition(axis, point);
                        if (p.left) {
                            left++;
                        }
                        if (p.right) {
                            right++;
                        }
                    });
                    if (left >= right) {
                        return left;
                    }
                    else {
                        return right;
                    }
                };
                SharedNode.prototype.partition = function (size, axis, point) {
                    var node = this;
                    var left = [];
                    var right = [];
                    node.shapes.forEach(function (shape) {
                        var box = shape.box;
                        var p = box.partition(axis, point);
                        if (p.left) {
                            left = MapUtils_1.append(left, shape);
                        }
                        if (p.right) {
                            right = MapUtils_1.append(right, shape);
                        }
                    });
                    return { left: left, right: right };
                };
                SharedNode.prototype.split = function (depth) {
                    var node = this;
                    if (node.shapes.length < 8) {
                        var self = this;
                        this.memory.position -= DirectMemory_1.DirectMemory.SIZE_OF_UINT32;
                        this.memory.writeUnsignedInt(NodeMarker.LEAF);
                        this.memory.writeByte(Axis_1.Axis.AxisNone);
                        this.memory.writeFloat(0);
                        this.memory.writeUnsignedInt(node.shapes.length);
                        node.shapes.forEach(function (shape) {
                            if (self.memory) {
                                self.memory.writeUnsignedInt(shape.index);
                            }
                        });
                        if (this.memory) {
                            this.memory.writeUnsignedInt(NodeMarker.EON);
                        }
                        return false;
                    }
                    var xs = [];
                    var ys = [];
                    var zs = [];
                    node.shapes.forEach(function (shape) {
                        var box = shape.box;
                        xs = MapUtils_1.append(xs, box.min.x);
                        xs = MapUtils_1.append(xs, box.max.x);
                        ys = MapUtils_1.append(ys, box.min.y);
                        ys = MapUtils_1.append(ys, box.max.y);
                        zs = MapUtils_1.append(zs, box.min.z);
                        zs = MapUtils_1.append(zs, box.max.z);
                    });
                    MapUtils_2.sortAscending(xs);
                    MapUtils_2.sortAscending(ys);
                    MapUtils_2.sortAscending(zs);
                    var mx = MathUtils_1.MathUtils.median(xs);
                    var my = MathUtils_1.MathUtils.median(ys);
                    var mz = MathUtils_1.MathUtils.median(zs);
                    var best = Math.round(node.shapes.length * 0.85);
                    var bestAxis = Axis_1.Axis.AxisNone;
                    var bestPoint = 0.0;
                    var sx = node.partitionScore(Axis_1.Axis.AxisX, mx);
                    if (sx < best) {
                        best = sx;
                        bestAxis = Axis_1.Axis.AxisX;
                        bestPoint = mx;
                    }
                    var sy = node.partitionScore(Axis_1.Axis.AxisY, my);
                    if (sy < best) {
                        best = sy;
                        bestAxis = Axis_1.Axis.AxisY;
                        bestPoint = my;
                    }
                    var sz = node.partitionScore(Axis_1.Axis.AxisZ, mz);
                    if (sz < best) {
                        best = sz;
                        bestAxis = Axis_1.Axis.AxisZ;
                        bestPoint = mz;
                    }
                    if (bestAxis == Axis_1.Axis.AxisNone) {
                        var shapes = node.shapes;
                        var shapeIndices = [];
                        var self_1 = this;
                        if (this.memory) {
                            this.memory.position -= DirectMemory_1.DirectMemory.SIZE_OF_UINT32;
                            this.memory.writeUnsignedInt(NodeMarker.LEAF);
                            this.memory.writeByte(bestAxis);
                            this.memory.writeFloat(bestPoint);
                            this.memory.writeUnsignedInt(shapes.length);
                        }
                        shapes.forEach(function (shape) {
                            shapeIndices.push(shape.index);
                            if (self_1.memory) {
                                self_1.memory.writeUnsignedInt(shape.index);
                            }
                        });
                        if (this.memory) {
                            this.memory.writeUnsignedInt(NodeMarker.EON);
                        }
                        node.shapes = null;
                        node.shapeIndices = shapeIndices;
                        return true;
                    }
                    var p = node.partition(best, bestAxis, bestPoint);
                    node.axis = bestAxis;
                    node.point = bestPoint;
                    node.left = SharedNode.newNode(p.left, this.memory);
                    node.right = SharedNode.newNode(p.right, this.memory);
                    if (this.memory) {
                        this.memory.writeByte(bestAxis);
                        this.memory.writeFloat(bestPoint);
                        var leftStartPosition = this.memory.position + (2 * ByteArrayBase_1.ByteArrayBase.SIZE_OF_UINT32);
                        this.memory.writeUnsignedInt(leftStartPosition);
                        var rightLengthPosition = this.memory.position;
                        this.memory.position += ByteArrayBase_1.ByteArrayBase.SIZE_OF_UINT32;
                        this.memory.writeUnsignedInt(NodeMarker.LEFT);
                    }
                    node.left.split(depth + 1);
                    if (this.memory) {
                        var rightStartPosition = this.memory.position;
                        this.memory.position = rightLengthPosition;
                        this.memory.writeUnsignedInt(rightStartPosition);
                        this.memory.position = rightStartPosition;
                        this.memory.writeUnsignedInt(NodeMarker.RIGHT);
                    }
                    node.right.split(depth + 1);
                    if (this.memory) {
                        this.memory.writeUnsignedInt(NodeMarker.EON);
                    }
                    node.shapes = null;
                    return true;
                };
                SharedNode.map = [];
                return SharedNode;
            }());
            exports_1("SharedNode", SharedNode);
        }
    }
});
//# sourceMappingURL=SharedNode.js.map