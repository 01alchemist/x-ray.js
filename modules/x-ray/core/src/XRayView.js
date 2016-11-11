System.register(["./XRayRenderBase", "./engine/math/Color", "./engine/scene/Camera", "./engine/scene/shapes/Cube", "./engine/math/Vector3", "./engine/scene/shapes/Sphere", "./engine/scene/materials/LightMaterial", "./ThreeObjects", "./engine/scene/shapes/Mesh", "./engine/scene/shapes/Triangle", "./engine/scene/materials/Material", "./engine/scene/shapes/TransformedShape", "./engine/scene/materials/Attenuation", "./engine/math/Matrix4", "./engine/scene/materials/Texture"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var XRayRenderBase_1, Color_1, Camera_1, Cube_1, Vector3_1, Sphere_1, LightMaterial_1, ThreeObjects_1, Mesh_1, Triangle_1, Material_1, TransformedShape_1, Attenuation_1, Attenuation_2, Matrix4_1, Texture_1;
    var XRayView;
    return {
        setters:[
            function (XRayRenderBase_1_1) {
                XRayRenderBase_1 = XRayRenderBase_1_1;
            },
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (Camera_1_1) {
                Camera_1 = Camera_1_1;
            },
            function (Cube_1_1) {
                Cube_1 = Cube_1_1;
            },
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            },
            function (Sphere_1_1) {
                Sphere_1 = Sphere_1_1;
            },
            function (LightMaterial_1_1) {
                LightMaterial_1 = LightMaterial_1_1;
            },
            function (ThreeObjects_1_1) {
                ThreeObjects_1 = ThreeObjects_1_1;
            },
            function (Mesh_1_1) {
                Mesh_1 = Mesh_1_1;
            },
            function (Triangle_1_1) {
                Triangle_1 = Triangle_1_1;
            },
            function (Material_1_1) {
                Material_1 = Material_1_1;
            },
            function (TransformedShape_1_1) {
                TransformedShape_1 = TransformedShape_1_1;
            },
            function (Attenuation_1_1) {
                Attenuation_1 = Attenuation_1_1;
                Attenuation_2 = Attenuation_1_1;
            },
            function (Matrix4_1_1) {
                Matrix4_1 = Matrix4_1_1;
            },
            function (Texture_1_1) {
                Texture_1 = Texture_1_1;
            }],
        execute: function() {
            XRayView = (function (_super) {
                __extends(XRayView, _super);
                function XRayView(width, height, container) {
                    _super.call(this, width, height, container);
                    this.width = width;
                    this.height = height;
                    this.container = container;
                    this.identityMatrix = new THREE.Matrix4().identity();
                    this.scene = new xray.MasterScene(0x262626);
                    this.camera = Camera_1.Camera.lookAt(new Vector3_1.Vector3(0, 0, 0), new Vector3_1.Vector3(0, 0, 0), new Vector3_1.Vector3(0, 1, 0), 45);
                    this.cameraSamples = -1;
                    this.hitSamples = 1;
                    this.bounces = 4;
                    this.iterations = 1000000;
                    this.blockIterations = 1;
                }
                XRayView.prototype.setThreeJSScene = function (scene, onInit) {
                    this.loadChildren(scene);
                    this.render(onInit);
                };
                XRayView.prototype.loadChildren = function (parent) {
                    var child;
                    for (var i = 0; i < parent.children.length; i++) {
                        child = parent.children[i];
                        var obj = this.buildSceneObject(child);
                        if (obj) {
                            this.scene.add(obj);
                        }
                        if (obj) {
                            if (!(obj.getMaterial(new Vector3_1.Vector3()) instanceof LightMaterial_1.LightMaterial) && child.children.length > 0) {
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
                            var material = XRayView.getMaterial(src.material);
                            var shape = this.buildGeometry(src.geometry, material, src.smooth);
                            var matrixWorld = src.matrixWorld;
                            if (matrixWorld.equals(this.identityMatrix)) {
                                return shape;
                            }
                            else {
                                var mat = Matrix4_1.Matrix4.fromTHREEJS(matrixWorld.elements);
                                return TransformedShape_1.TransformedShape.newTransformedShape(shape, mat);
                            }
                        case ThreeObjects_1.ThreeObjects.PointLight:
                            return this.getLight(src);
                    }
                    return null;
                };
                XRayView.prototype.buildGeometry = function (geometry, material, smooth) {
                    if (smooth === void 0) { smooth = false; }
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
                                var triangle = new Triangle_1.Triangle();
                                triangle.material = material;
                                triangle.v1 = new Vector3_1.Vector3(vertices[face.a].x, vertices[face.a].y, vertices[face.a].z);
                                triangle.v2 = new Vector3_1.Vector3(vertices[face.b].x, vertices[face.b].y, vertices[face.b].z);
                                triangle.v3 = new Vector3_1.Vector3(vertices[face.c].x, vertices[face.c].y, vertices[face.c].z);
                                triangle.n1 = new Vector3_1.Vector3();
                                triangle.n2 = new Vector3_1.Vector3();
                                triangle.n3 = new Vector3_1.Vector3();
                                triangle.updateBox();
                                triangle.fixNormals();
                                triangles.push(triangle);
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
                                var a;
                                var b;
                                var c;
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
                                var triangle = new Triangle_1.Triangle();
                                triangle.material = material;
                                triangle.v1 = new Vector3_1.Vector3(positions[ax], positions[ay], positions[az]);
                                triangle.v2 = new Vector3_1.Vector3(positions[bx], positions[by], positions[bz]);
                                triangle.v3 = new Vector3_1.Vector3(positions[cx], positions[cy], positions[cz]);
                                triangle.n1 = new Vector3_1.Vector3(normals[ax], normals[ay], normals[az]);
                                triangle.n2 = new Vector3_1.Vector3(normals[bx], normals[by], normals[bz]);
                                triangle.n3 = new Vector3_1.Vector3(normals[cx], normals[cy], normals[cz]);
                                if (uv) {
                                    triangle.t1 = new Vector3_1.Vector3(uv[au], uv[av], 0);
                                    triangle.t2 = new Vector3_1.Vector3(uv[bu], uv[bv], 0);
                                    triangle.t3 = new Vector3_1.Vector3(uv[cu], uv[cv], 0);
                                }
                                triangle.fixNormals();
                                triangle.updateBox();
                                triangles.push(triangle);
                                uvIndex += 2;
                            }
                        }
                        else {
                            uvIndex = 0;
                            for (var i = 0; i < positions.length; i = i + 9) {
                                var triangle = new Triangle_1.Triangle();
                                triangle.material = material;
                                triangle.v1 = new Vector3_1.Vector3(positions[i], positions[i + 1], positions[i + 2]);
                                triangle.v2 = new Vector3_1.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
                                triangle.v3 = new Vector3_1.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
                                triangle.n1 = new Vector3_1.Vector3(normals[i], normals[i + 1], normals[i + 2]);
                                triangle.n2 = new Vector3_1.Vector3(normals[i + 3], normals[i + 4], normals[i + 5]);
                                triangle.n3 = new Vector3_1.Vector3(normals[i + 6], normals[i + 7], normals[i + 8]);
                                if (uv) {
                                    triangle.t1 = new Vector3_1.Vector3(uv[uvIndex], uv[uvIndex + 1], 0);
                                    triangle.t2 = new Vector3_1.Vector3(uv[uvIndex + 2], uv[uvIndex + 3], 0);
                                    triangle.t3 = new Vector3_1.Vector3(uv[uvIndex + 4], uv[uvIndex + 5], 0);
                                }
                                triangle.fixNormals();
                                triangle.updateBox();
                                triangles.push(triangle);
                                uvIndex += 6;
                            }
                        }
                    }
                    var mesh = Mesh_1.Mesh.newMesh(triangles);
                    if (smooth) {
                        mesh.smoothNormals();
                    }
                    return mesh;
                };
                XRayView.prototype.computeNormals = function (positions) {
                    return new Float32Array(positions.length);
                };
                XRayView.prototype.updateCamera = function (camera) {
                    this.camera.p.setFromJson(camera.position);
                    this.camera.m = 1 / Math.tan(camera.fov * Math.PI / 360);
                    var e = camera.matrix.elements;
                    var x = [-e[0], -e[1], -e[2]];
                    var y = [e[4], e[5], e[6]];
                    var z = [-e[8], -e[9], -e[10]];
                    this.camera.u.setFromArray(x);
                    this.camera.v.setFromArray(y);
                    this.camera.w.setFromArray(z);
                    this.dirty = true;
                    if (this.renderer) {
                        this.renderer.traceManager.stop();
                    }
                };
                XRayView.getMaterial = function (srcMaterial) {
                    if (srcMaterial instanceof THREE.MultiMaterial) {
                        srcMaterial = srcMaterial.materials[0];
                    }
                    var material = new Material_1.Material(Color_1.Color.hexColor(srcMaterial.color.getHex()));
                    material.ior = srcMaterial.ior ? srcMaterial.ior : 1;
                    material.tint = srcMaterial.tint ? srcMaterial.tint : 0;
                    material.gloss = srcMaterial.gloss ? srcMaterial.gloss : 0;
                    material.emittance = srcMaterial.emittance ? srcMaterial.emittance : 0;
                    material.transparent = srcMaterial.transparent;
                    material.attenuation = Attenuation_1.Attenuation.fromJson(srcMaterial.attenuation);
                    if (srcMaterial.map) {
                        if (srcMaterial.map.image && srcMaterial.map.image.length == 0) {
                            var image = srcMaterial.map.mipmaps[0];
                            material.texture = new Texture_1.Texture();
                            material.texture.setImageData(image.width, image.height, image.data);
                            material.texture.sourceFile = srcMaterial.map.uuid;
                        }
                        else if (srcMaterial.map.image) {
                            material.texture = new Texture_1.Texture(srcMaterial.map.image);
                        }
                    }
                    if (srcMaterial.normalMap) {
                        if (srcMaterial.normalMap.image && srcMaterial.normalMap.image.length == 0) {
                            var image = srcMaterial.normalMap.mipmaps[0];
                            material.normalTexture = new Texture_1.Texture();
                            material.normalTexture.setImageData(image.width, image.height, image.data);
                            material.normalTexture.sourceFile = srcMaterial.normalMap.uuid;
                        }
                        else if (srcMaterial.normalMap.image) {
                            material.normalTexture = new Texture_1.Texture(srcMaterial.normalMap.image);
                        }
                    }
                    if (srcMaterial.bumpMap) {
                        if (srcMaterial.bumpMap.image && srcMaterial.bumpMap.image.length == 0) {
                            var image = srcMaterial.bumpMap.mipmaps[0];
                            material.bumpTexture = new Texture_1.Texture();
                            material.bumpTexture.setImageData(image.width, image.height, image.data);
                            material.bumpTexture.sourceFile = srcMaterial.bumpMap.uuid;
                        }
                        else if (srcMaterial.bumpMap.image) {
                            material.bumpTexture = new Texture_1.Texture(srcMaterial.bumpMap.image);
                        }
                    }
                    return material;
                };
                XRayView.prototype.getLight = function (src) {
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
                    var material = new LightMaterial_1.LightMaterial(Color_1.Color.hexColor(src.color.getHex()), src.intensity, new Attenuation_2.LinearAttenuation(src.distance));
                    if (_radius) {
                        var shape = Sphere_1.Sphere.newSphere(new Vector3_1.Vector3(src.position.x, src.position.y, src.position.z), _radius, material);
                    }
                    else {
                        shape = Cube_1.Cube.newCube(new Vector3_1.Vector3(-width / 2, src.position.y, -height / 2), new Vector3_1.Vector3(width / 2, src.position.y + 1, height / 2), material);
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