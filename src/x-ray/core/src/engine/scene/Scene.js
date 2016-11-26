System.register(["../math/Color", "./tree/Tree", "../utils/MapUtils", "../math/Vector3", "../math/Ray", "./shapes/Shape", "./shapes/Cube", "./shapes/Sphere", "./shapes/Mesh", "./shapes/TransformedShape", "./shapes/Triangle"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Color_1, Tree_1, MapUtils_1, Vector3_1, Ray_1, Shape_1, Cube_1, Sphere_1, Mesh_1, TransformedShape_1, Triangle_1;
    var Scene;
    return {
        setters:[
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (Tree_1_1) {
                Tree_1 = Tree_1_1;
            },
            function (MapUtils_1_1) {
                MapUtils_1 = MapUtils_1_1;
            },
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            },
            function (Ray_1_1) {
                Ray_1 = Ray_1_1;
            },
            function (Shape_1_1) {
                Shape_1 = Shape_1_1;
            },
            function (Cube_1_1) {
                Cube_1 = Cube_1_1;
            },
            function (Sphere_1_1) {
                Sphere_1 = Sphere_1_1;
            },
            function (Mesh_1_1) {
                Mesh_1 = Mesh_1_1;
            },
            function (TransformedShape_1_1) {
                TransformedShape_1 = TransformedShape_1_1;
            },
            function (Triangle_1_1) {
                Triangle_1 = Triangle_1_1;
            }],
        execute: function() {
            Scene = (function () {
                function Scene(color, shapes, lights, tree, rays) {
                    if (color === void 0) { color = new Color_1.Color(); }
                    if (shapes === void 0) { shapes = []; }
                    if (lights === void 0) { lights = []; }
                    if (tree === void 0) { tree = null; }
                    if (rays === void 0) { rays = 0; }
                    this.color = color;
                    this.shapes = shapes;
                    this.lights = lights;
                    this.tree = tree;
                    this.rays = rays;
                    this.shared = false;
                }
                Object.defineProperty(Scene.prototype, "estimatedMemory", {
                    get: function () {
                        var size = Color_1.Color.SIZE + 1;
                        this.shapes.forEach(function (shape) {
                            size += shape.memorySize;
                        });
                        return size;
                    },
                    enumerable: true,
                    configurable: true
                });
                Scene.fromJson = function (scene) {
                    var _scene = new Scene(Color_1.Color.fromJson(scene.color));
                    scene.shapes.forEach(function (shape) {
                        switch (shape.type) {
                            case Shape_1.ShapeType.CUBE:
                                _scene.add(Cube_1.Cube.fromJson(shape));
                                break;
                            case Shape_1.ShapeType.SPHERE:
                                _scene.add(Sphere_1.Sphere.fromJson(shape));
                                break;
                            case Shape_1.ShapeType.MESH:
                                _scene.add(Mesh_1.Mesh.fromJson(shape));
                                break;
                            case Shape_1.ShapeType.TRANSFORMED_SHAPE:
                                _scene.add(TransformedShape_1.TransformedShape.fromJson(shape));
                                break;
                            case Shape_1.ShapeType.TRIANGLE:
                                _scene.add(Triangle_1.Triangle.fromJson(shape));
                                break;
                        }
                    });
                    return _scene;
                };
                Scene.prototype.compile = function () {
                    this.shapes.forEach(function (shape) {
                        shape.compile();
                    });
                    if (this.tree == null) {
                        this.tree = Tree_1.Tree.newTree(this.shapes);
                    }
                    return this;
                };
                Scene.prototype.add = function (shape) {
                    this.shapes = MapUtils_1.append(this.shapes, shape);
                    shape.index = this.shapes.length - 1;
                    var mat = shape.getMaterial(new Vector3_1.Vector3());
                    if (mat && mat.emittance > 0) {
                        this.lights = MapUtils_1.append(this.lights, shape);
                    }
                };
                Scene.prototype.rayCount = function () {
                    return this.rays;
                };
                Scene.prototype.intersect = function (r) {
                    this.rays++;
                    return this.tree.intersect(r);
                };
                Scene.prototype.shadow = function (r, light, max) {
                    var hit = this.intersect(r);
                    return hit.shape != light && hit.T < max;
                };
                Scene.prototype.directLight = function (n) {
                    if (this.lights.length == 0) {
                        return new Color_1.Color();
                    }
                    var color = new Color_1.Color();
                    var self = this;
                    var i = 0;
                    var light;
                    for (; i < this.lights.length; i++) {
                        light = this.lights[i];
                        var p = light.getRandomPoint();
                        var d = p.sub(n.origin);
                        var lr = new Ray_1.Ray(n.origin, d.normalize());
                        var diffuse = lr.direction.dot(n.direction);
                        if (diffuse <= 0) {
                            continue;
                        }
                        var distance = d.length();
                        if (self.shadow(lr, light, distance)) {
                            continue;
                        }
                        var material = light.getMaterial(p);
                        var emittance = material.emittance;
                        var attenuation = material.attenuation.compute(distance);
                        color = color.add(light.getColor(p).mulScalar(diffuse * emittance * attenuation));
                    }
                    return color.divScalar(this.lights.length);
                };
                Scene.prototype.sample = function (r, emission, samples, depth) {
                    if (depth < 0) {
                        return new Color_1.Color(0, 0, 0);
                    }
                    var hit = this.intersect(r);
                    if (!hit.ok()) {
                        return this.color;
                    }
                    var info = hit.getInfo(r);
                    var result = new Color_1.Color();
                    if (emission) {
                        var emittance = info.material.emittance;
                        if (emittance > 0) {
                            var attenuation = info.material.attenuation.compute(hit.T);
                            result = result.add(info.color.mulScalar(emittance * attenuation * samples));
                        }
                    }
                    var n = Math.round(Math.sqrt(samples));
                    for (var u = 0; u < n; u++) {
                        for (var v = 0; v < n; v++) {
                            var p = Math.random();
                            var fu = (u + Math.random()) / n;
                            var fv = (v + Math.random()) / n;
                            var bounce = r.bounce(info, p, fu, fv);
                            var indirect = this.sample(bounce.ray, bounce.reflected, 1, depth - 1);
                            if (bounce.reflected) {
                                var tinted = indirect.mix(info.color.mul(indirect), info.material.tint);
                                result = result.add(tinted);
                            }
                            else {
                                var direct = this.directLight(info.ray);
                                result = result.add(info.color.mul(direct.add(indirect)));
                            }
                        }
                    }
                    return result.divScalar(n * n);
                };
                return Scene;
            }());
            exports_1("Scene", Scene);
        }
    }
});
//# sourceMappingURL=Scene.js.map