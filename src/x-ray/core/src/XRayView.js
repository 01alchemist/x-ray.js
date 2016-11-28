System.register(["./XRayRenderBase", "./ThreeObjects"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var XRayRenderBase_1, ThreeObjects_1;
    var xColor, xVec3, xMat, xCamera, xShape, xTriangle, xMesh, xSphere, xCube, xMasterScene, XRayView;
    return {
        setters:[
            function (XRayRenderBase_1_1) {
                XRayRenderBase_1 = XRayRenderBase_1_1;
            },
            function (ThreeObjects_1_1) {
                ThreeObjects_1 = ThreeObjects_1_1;
            }],
        execute: function() {
            xColor = xray.Color;
            xVec3 = xray.Vector;
            xMat = xray.Material;
            xCamera = xray.Camera;
            xShape = xray.Shape;
            xTriangle = xray.Triangle;
            xMesh = xray.Mesh;
            xSphere = xray.Sphere;
            xCube = xray.Cube;
            xMasterScene = xray.MasterScene;
            XRayView = (function (_super) {
                __extends(XRayView, _super);
                function XRayView(width, height, container) {
                    _super.call(this, width, height, container);
                    this.width = width;
                    this.height = height;
                    this.container = container;
                    this.identityMatrix = new THREE.Matrix4().identity();
                    this.scene = new xMasterScene(0x262626);
                    this.camera = xCamera.LookAt(xVec3.NewVector(0, 0, 0), xVec3.NewVector(0, 0, 0), xVec3.NewVector(0, 0, 1), 45);
                    this.cameraSamples = -1;
                    this.hitSamples = 1;
                    this.bounces = 4;
                    this.iterations = 1000000;
                    this.blockIterations = 1;
                }
                XRayView.prototype.setThreeJSScene = function (scene, onInit) {
                    this.loadChildren(scene);
                    console.time("Scene builder");
                    this.scene.Commit();
                    console.timeEnd("Scene builder");
                    this.render(onInit);
                };
                XRayView.prototype.loadChildren = function (parent) {
                    var child;
                    for (var i = 0; i < parent.children.length; i++) {
                        child = parent.children[i];
                        var obj = this.buildSceneObject(child);
                        if (obj) {
                            this.scene.Add(obj);
                        }
                        if (obj) {
                            if (!(xMat.IsLight(xShape.MaterialAt(obj, xVec3.NewVector()))) && child.children.length > 0) {
                                this.loadChildren(child);
                            }
                        }
                        else {
                            if (child.children.length > 0) {
                                this.loadChildren(child);
                            }
                        }
                    }
                };
                XRayView.prototype.buildSceneObject = function (src) {
                    switch (src.type) {
                        case ThreeObjects_1.ThreeObjects.Mesh:
                            var material = XRayView.getTurboMaterial(src.material);
                            var shape = this.buildTurboGeometry(src.geometry, material, src.smooth);
                            var matrixWorld = src.matrixWorld;
                            if (matrixWorld.equals(this.identityMatrix)) {
                                return shape;
                            }
                            else {
                                var mat = xray.Matrix.fromTHREEJS(matrixWorld.elements);
                                return xray.TransformedShape.NewTransformedShape(shape, mat);
                            }
                        case ThreeObjects_1.ThreeObjects.PointLight:
                            return this.getTurboLight(src);
                    }
                    return null;
                };
                XRayView.prototype.buildTurboGeometry = function (geometry, material, smooth) {
                    if (geometry["_bufferGeometry"]) {
                        geometry = geometry["_bufferGeometry"];
                    }
                    var triangles = [];
                    if (!geometry.attributes) {
                        var vertices = geometry.vertices;
                        var faces = geometry.faces;
                        if (vertices && faces) {
                            for (var i = 0; i < faces.length; i++) {
                                var face = faces[i];
                                var t = xTriangle.initInstance(turbo.Runtime.allocOrThrow(53, 4));
                                turbo.Runtime._mem_int32[(t + 44) >> 2] = material;
                                turbo.Runtime._mem_int32[(t + 8) >> 2] = xVec3.NewVector(vertices[face.a].x, vertices[face.a].y, vertices[face.a].z);
                                turbo.Runtime._mem_int32[(t + 12) >> 2] = xVec3.NewVector(vertices[face.b].x, vertices[face.b].y, vertices[face.b].z);
                                turbo.Runtime._mem_int32[(t + 16) >> 2] = xVec3.NewVector(vertices[face.c].x, vertices[face.c].y, vertices[face.c].z);
                                turbo.Runtime._mem_int32[(t + 20) >> 2] = xVec3.NewVector();
                                turbo.Runtime._mem_int32[(t + 24) >> 2] = xVec3.NewVector();
                                turbo.Runtime._mem_int32[(t + 28) >> 2] = xVec3.NewVector();
                                triangles.push(t);
                            }
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        var positions = geometry.attributes["position"].array;
                        if (geometry.attributes["uv"]) {
                            var uv = geometry.attributes["uv"].array;
                        }
                        var normals;
                        if (geometry.attributes["normal"]) {
                            normals = geometry.attributes["normal"].array;
                        }
                        else {
                            normals = this.computeNormals(positions);
                        }
                        var triCount = 0;
                        var indexAttribute = geometry.getIndex();
                        if (indexAttribute) {
                            var indices = indexAttribute.array;
                            var uvIndex = 0;
                            for (var i = 0; i < indices.length; i = i + 3) {
                                triCount++;
                                var a = void 0;
                                var b = void 0;
                                var c = void 0;
                                a = indices[i];
                                b = indices[i + 1];
                                c = indices[i + 2];
                                if (triCount % 2 !== 0) {
                                    a = indices[i];
                                    b = indices[i + 1];
                                    c = indices[i + 2];
                                }
                                else {
                                    c = indices[i];
                                    b = indices[i + 1];
                                    a = indices[i + 2];
                                }
                                var ax = a * 3;
                                var ay = (a * 3) + 1;
                                var az = (a * 3) + 2;
                                var bx = b * 3;
                                var by = (b * 3) + 1;
                                var bz = (b * 3) + 2;
                                var cx = c * 3;
                                var cy = (c * 3) + 1;
                                var cz = (c * 3) + 2;
                                var au = a * 2;
                                var av = (a * 2) + 1;
                                var bu = b * 2;
                                var bv = (b * 2) + 1;
                                var cu = c * 2;
                                var cv = (c * 2) + 1;
                                var t_1 = xTriangle.initInstance(turbo.Runtime.allocOrThrow(53, 4));
                                turbo.Runtime._mem_int32[(t_1 + 44) >> 2] = material;
                                turbo.Runtime._mem_int32[(t_1 + 8) >> 2] = xVec3.NewVector(positions[ax], positions[ay], positions[az]);
                                turbo.Runtime._mem_int32[(t_1 + 12) >> 2] = xVec3.NewVector(positions[bx], positions[by], positions[bz]);
                                turbo.Runtime._mem_int32[(t_1 + 16) >> 2] = xVec3.NewVector(positions[cx], positions[cy], positions[cz]);
                                turbo.Runtime._mem_int32[(t_1 + 20) >> 2] = xVec3.NewVector(normals[ax], normals[ay], normals[az]);
                                turbo.Runtime._mem_int32[(t_1 + 24) >> 2] = xVec3.NewVector(normals[bx], normals[by], normals[bz]);
                                turbo.Runtime._mem_int32[(t_1 + 28) >> 2] = xVec3.NewVector(normals[cx], normals[cy], normals[cz]);
                                if (uv) {
                                    turbo.Runtime._mem_int32[(t_1 + 32) >> 2] = xVec3.NewVector(uv[au], uv[av], 0);
                                    turbo.Runtime._mem_int32[(t_1 + 36) >> 2] = xVec3.NewVector(uv[bu], uv[bv], 0);
                                    turbo.Runtime._mem_int32[(t_1 + 40) >> 2] = xVec3.NewVector(uv[cu], uv[cv], 0);
                                }
                                triangles.push(t_1);
                                uvIndex += 2;
                            }
                        }
                        else {
                            uvIndex = 0;
                            for (var i_1 = 0; i_1 < positions.length; i_1 = i_1 + 9) {
                                var t_2 = xTriangle.initInstance(turbo.Runtime.allocOrThrow(53, 4));
                                turbo.Runtime._mem_int32[(t_2 + 44) >> 2] = material;
                                turbo.Runtime._mem_int32[(t_2 + 8) >> 2] = xVec3.NewVector(positions[i_1], positions[i_1 + 1], positions[i_1 + 2]);
                                turbo.Runtime._mem_int32[(t_2 + 12) >> 2] = xVec3.NewVector(positions[i_1 + 3], positions[i_1 + 4], positions[i_1 + 5]);
                                turbo.Runtime._mem_int32[(t_2 + 16) >> 2] = xVec3.NewVector(positions[i_1 + 6], positions[i_1 + 7], positions[i_1 + 8]);
                                turbo.Runtime._mem_int32[(t_2 + 20) >> 2] = xVec3.NewVector(normals[i_1], normals[i_1 + 1], normals[i_1 + 2]);
                                turbo.Runtime._mem_int32[(t_2 + 24) >> 2] = xVec3.NewVector(normals[i_1 + 3], normals[i_1 + 4], normals[i_1 + 5]);
                                turbo.Runtime._mem_int32[(t_2 + 28) >> 2] = xVec3.NewVector(normals[i_1 + 6], normals[i_1 + 7], normals[i_1 + 8]);
                                if (uv) {
                                    turbo.Runtime._mem_int32[(t_2 + 32) >> 2] = xVec3.NewVector(uv[uvIndex], uv[uvIndex + 1], 0);
                                    turbo.Runtime._mem_int32[(t_2 + 36) >> 2] = xVec3.NewVector(uv[uvIndex + 2], uv[uvIndex + 3], 0);
                                    turbo.Runtime._mem_int32[(t_2 + 40) >> 2] = xVec3.NewVector(uv[uvIndex + 4], uv[uvIndex + 5], 0);
                                }
                                xTriangle.FixNormals(t_2);
                                triangles.push(t_2);
                                uvIndex += 6;
                            }
                        }
                    }
                    var meshRef = xMesh.NewMesh(xTriangle.Pack(triangles));
                    return meshRef;
                };
                XRayView.prototype.computeNormals = function (positions) {
                    return new Float32Array(positions.length);
                };
                XRayView.prototype.updateCamera = function (camera) {
                    var e = camera.matrix.elements;
                    var x = { x: -e[0], y: -e[1], z: -e[2] };
                    var y = { x: e[4], y: e[5], z: e[6] };
                    var z = { x: -e[8], y: -e[9], z: -e[10] };
                    xray.Camera.SetFromJSON(this.camera, {
                        p: camera.position,
                        u: x,
                        v: y,
                        w: z,
                        m: 1 / Math.tan(camera.fov * Math.PI / 360)
                    });
                    this.dirty = true;
                    if (this.renderer) {
                        this.renderer.traceManager.stop();
                    }
                };
                XRayView.getTurboMaterial = function (srcMaterial) {
                    if (srcMaterial instanceof THREE.MultiMaterial) {
                        srcMaterial = srcMaterial.materials[0];
                    }
                    var material = xMat.DiffuseMaterial(xray.Color.HexColor(srcMaterial.color.getHex()));
                    return material;
                };
                XRayView.prototype.getTurboLight = function (src) {
                    if (src.children.length > 0) {
                        var lightGeometry = src.children[0].geometry;
                        if (lightGeometry instanceof THREE.SphereGeometry) {
                            var _radius = lightGeometry.parameters.radius;
                        }
                        else if (lightGeometry instanceof THREE.PlaneGeometry) {
                            var width = lightGeometry.parameters.width;
                            var height = lightGeometry.parameters.height;
                        }
                    }
                    var material = xMat.LightMaterial(xColor.HexColor(src.color.getHex()), src.intensity);
                    if (_radius) {
                        var shape = xSphere.NewSphere(xVec3.NewVector(src.position.x, src.position.y, src.position.z), _radius, material);
                    }
                    else {
                        shape = xCube.NewCube(xVec3.NewVector(-width / 2, src.position.y, -height / 2), xVec3.NewVector(width / 2, src.position.y + 1, height / 2), material);
                    }
                    return shape;
                };
                return XRayView;
            }(XRayRenderBase_1.XRayRenderBase));
            exports_1("XRayView", XRayView);
        }
    }
});
//# sourceMappingURL=XRayView.js.map