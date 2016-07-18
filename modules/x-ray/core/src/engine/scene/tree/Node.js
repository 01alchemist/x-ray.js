System.register(["../Axis", "../../math/Hit", "../../utils/MapUtils", "../../utils/MathUtils"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Axis_1, Hit_1, MapUtils_1, MapUtils_2, MathUtils_1;
    var Node;
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
            }],
        execute: function() {
            Node = (function () {
                function Node(axis, point, shapes, left, right) {
                    this.axis = axis;
                    this.point = point;
                    this.shapes = shapes;
                    this.left = left;
                    this.right = right;
                    this.index = Node.map.push(this) - 1;
                }
                Node.newNode = function (shapes) {
                    return new Node(Axis_1.Axis.AxisNone, 0, shapes, null, null);
                };
                Node.prototype.intersect = function (r, tmin, tmax) {
                    var node = this;
                    var tsplit;
                    var leftFirst;
                    switch (node.axis) {
                        case Axis_1.Axis.AxisNone:
                            return node.intersectShapes(r);
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
                        return first.intersect(r, tmin, tmax);
                    }
                    else if (tsplit < tmin) {
                        return second.intersect(r, tmin, tmax);
                    }
                    else {
                        var h1 = first.intersect(r, tmin, tsplit);
                        if (h1.T <= tsplit) {
                            return h1;
                        }
                        var h2 = second.intersect(r, tsplit, Math.min(tmax, h1.T));
                        if (h1.T <= h2.T) {
                            return h1;
                        }
                        else {
                            return h2;
                        }
                    }
                };
                Node.prototype.intersectShapes = function (r) {
                    var node = this;
                    var hit = Hit_1.NoHit;
                    node.shapes.forEach(function (shape) {
                        var h = shape.intersect(r);
                        if (h.T < hit.T) {
                            hit = h;
                        }
                    });
                    return hit;
                };
                Node.prototype.partitionScore = function (axis, point) {
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
                Node.prototype.partition = function (size, axis, point) {
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
                Node.prototype.split = function (depth) {
                    var node = this;
                    if (node.shapes.length < 8) {
                        return;
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
                        return;
                    }
                    var p = node.partition(best, bestAxis, bestPoint);
                    node.axis = bestAxis;
                    node.point = bestPoint;
                    node.left = Node.newNode(p.left);
                    node.right = Node.newNode(p.right);
                    node.left.split(depth + 1);
                    node.right.split(depth + 1);
                    node.shapes = null;
                };
                Node.map = [];
                return Node;
            }());
            exports_1("Node", Node);
        }
    }
});
//# sourceMappingURL=Node.js.map