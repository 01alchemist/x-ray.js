System.register(["./SimpleGUI", "../core/src/ThreeJSView", "../core/src/XRayView", "../core/src/engine/renderer/worker/Thread", "../core/src/engine/utils/MathUtils"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var SimpleGUI_1, ThreeJSView_1, XRayView_1, Thread_1, MathUtils_1;
    var CTMTest;
    return {
        setters:[
            function (SimpleGUI_1_1) {
                SimpleGUI_1 = SimpleGUI_1_1;
            },
            function (ThreeJSView_1_1) {
                ThreeJSView_1 = ThreeJSView_1_1;
            },
            function (XRayView_1_1) {
                XRayView_1 = XRayView_1_1;
            },
            function (Thread_1_1) {
                Thread_1 = Thread_1_1;
            },
            function (MathUtils_1_1) {
                MathUtils_1 = MathUtils_1_1;
            }],
        execute: function() {
            CTMTest = (function (_super) {
                __extends(CTMTest, _super);
                function CTMTest() {
                    _super.call(this);
                    Thread_1.Thread.workerUrl = "../workers/trace-worker-bootstrap-debug.js";
                    this.i_width = 2560 / 4;
                    this.i_height = 1536 / 4;
                }
                CTMTest.prototype.onInit = function () {
                    var _this = this;
                    var self = this;
                    this.threeJSView = new ThreeJSView_1.ThreeJSView(this.i_width, this.i_height, this.webglOutput, this.appContainer);
                    this.xrayView = new XRayView_1.XRayView(this.i_width, this.i_height, this.giOutput);
                    this.xrayView.iterations = 10000;
                    this.xrayView.hitSamples = 1;
                    this.xrayView.blockIterations = 1;
                    this.xrayView.bounces = 5;
                    var ambient = new THREE.AmbientLight(0x5C5C5C);
                    var directionalLight = new THREE.DirectionalLight(0xffeedd, 1);
                    directionalLight.castShadow = true;
                    directionalLight.position.set(0, 1, 0);
                    var color = 0xffeedd;
                    var geometry = new THREE.SphereGeometry(10, 32, 32);
                    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                    var sphere = new THREE.Mesh(geometry, material);
                    var pointLight1 = new THREE.PointLight(0xffffff, 3, 30);
                    pointLight1.position.set(-10, 5, 10);
                    pointLight1.add(sphere.clone());
                    var pointLight2 = new THREE.PointLight(0xffffff, 3, 30);
                    pointLight2.position.set(10, 150, 10);
                    pointLight2.add(sphere.clone());
                    this.threeJSView.scene.add(pointLight2);
                    var pointLight = new THREE.PointLight(color, 1, 30);
                    pointLight.position.set(5, 5, 0);
                    pointLight.castShadow = true;
                    pointLight.shadow.camera["near"] = 1;
                    pointLight.shadow.camera["far"] = 300;
                    pointLight.shadow.bias = 0.01;
                    var size = 300;
                    geometry = new THREE.CubeGeometry(1000, 1, 1000, 10, 1, 10);
                    material = new THREE.MeshPhongMaterial({ color: 0xffffff });
                    material.ior = 1.5;
                    material.gloss = MathUtils_1.MathUtils.radians(15);
                    var ground = new THREE.Mesh(geometry, material);
                    ground.castShadow = false;
                    ground.receiveShadow = true;
                    this.threeJSView.scene.add(ground);
                    geometry = new THREE.CubeGeometry(1, size, size, 1, 10, 10);
                    material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
                    material.ior = 1.5;
                    material.gloss = MathUtils_1.MathUtils.radians(15);
                    var left = new THREE.Mesh(geometry, material);
                    left.position.set(-size / 2, 0, 0);
                    left.castShadow = false;
                    left.receiveShadow = true;
                    this.threeJSView.scene.add(left);
                    geometry = new THREE.CubeGeometry(1, size, size, 1, 10, 10);
                    material = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
                    material.ior = 1.5;
                    material.gloss = MathUtils_1.MathUtils.radians(15);
                    var right = new THREE.Mesh(geometry, material);
                    right.position.set(size / 2, 0, 0);
                    right.castShadow = false;
                    right.receiveShadow = true;
                    this.threeJSView.scene.add(right);
                    geometry = new THREE.CubeGeometry(size, size, 1, 10, 10, 1);
                    material = new THREE.MeshPhongMaterial({ color: 0xB9B9B9 });
                    material.ior = 1.5;
                    material.gloss = MathUtils_1.MathUtils.radians(15);
                    var back = new THREE.Mesh(geometry, material);
                    back.position.set(0, 0, -size / 2);
                    back.castShadow = false;
                    back.receiveShadow = true;
                    this.threeJSView.scene.add(back);
                    self.render();
                    var manager = new THREE.LoadingManager();
                    manager.onLoad = function () {
                        console.log(arguments);
                    };
                    var onProgress = function (xhr) {
                        if (xhr.lengthComputable) {
                            var percentComplete = xhr.loaded / xhr.total * 100;
                            console.log(Math.round(percentComplete) + '% downloaded');
                        }
                    };
                    var onError = function (xhr) {
                    };
                    var r = "three/textures/cube/pisa/";
                    var urls = [
                        r + "px.png", r + "nx.png",
                        r + "py.png", r + "ny.png",
                        r + "pz.png", r + "nz.png"
                    ];
                    this.textureCube = new THREE.CubeTextureLoader().load(urls);
                    var start = Date.now();
                    var loaderCTM = new THREE.CTMLoader();
                    var position = new THREE.Vector3(-105, 0, 0);
                    var scale = new THREE.Vector3(30, 30, 30);
                    loaderCTM.loadParts("three/models/ctm/camaro/camaro.js", function (geometries, materials) {
                        _this.hackMaterials(materials);
                        for (var i = 0; i < geometries.length; i++) {
                            var mesh = new THREE.Mesh(geometries[i], materials[i]);
                            mesh.position.copy(position);
                            mesh.scale.copy(scale);
                            _this.threeJSView.scene.add(mesh);
                        }
                        var end = Date.now();
                        console.log("load time:", end - start, "ms");
                        self.render();
                        setTimeout(function () {
                            self.xrayView.setThreeJSScene(self.threeJSView.scene, function () {
                                self.xrayView.updateCamera(self.threeJSView.camera);
                                if (self._tracing.value) {
                                    self.xrayView.toggleTrace(true);
                                }
                            });
                            self.render();
                        }, 2000);
                    }, { useWorker: true, worker: new Worker('../../../node_modules/three/examples/js/loaders/ctm/CTMWorker.js') });
                    this.threeJSView.onCameraChange = function (camera) {
                        self.xrayView.updateCamera(camera);
                        if (self._tracing.value && self.xrayView.dirty) {
                        }
                    };
                    this.render();
                    this.threeJSView.controls.onMouseDown = function (event) {
                        _this.toggleGI(false);
                        if (!_this._tracing.value && _this._gi.value) {
                            _this._gi.click();
                        }
                    };
                    this.threeJSView.controls.onMouseUp = function (event) {
                        if (_this._tracing.value && _this._gi.value) {
                            _this.toggleGI(true);
                        }
                    };
                    this.threeJSView.controls.onMouseWheel = function (event) {
                        if (_this._tracing.value && _this._gi.value) {
                            _this.toggleGI(true);
                        }
                    };
                };
                CTMTest.prototype.hackMaterials = function (materials) {
                    for (var i = 0; i < materials.length; i++) {
                        var m = materials[i];
                        if (m.name.indexOf("Body") !== -1) {
                            var mm = new THREE.MeshStandardMaterial();
                            mm.color.setHex(0x000000);
                            mm.lightMap = m.map;
                            mm.envMap = this.textureCube;
                            mm.metalness = 0.5;
                            mm.roughness = 0.3;
                            materials[i] = mm;
                        }
                        else if (m.name.indexOf("tire_car") !== -1) {
                            var mm = new THREE.MeshStandardMaterial();
                            mm.color.setHex(0x000000);
                            mm.lightMap = m.map;
                            mm.metalness = 0.1;
                            mm.roughness = 0.9;
                            materials[i] = mm;
                        }
                        else if (m.name.indexOf("mirror") !== -1) {
                            var mm = new THREE.MeshStandardMaterial();
                            mm.color.setHex(0x808080);
                            mm.lightMap = m.map;
                            mm.envMap = this.textureCube;
                            mm.metalness = 0.9;
                            mm.roughness = 0.5;
                            materials[i] = mm;
                        }
                        else if (m.name.indexOf("glass") !== -1) {
                            var mm = new THREE.MeshStandardMaterial();
                            mm.color.copy(m.color);
                            mm.envMap = this.textureCube;
                            mm.metalness = 1;
                            mm.roughtness = 0.1;
                            mm.opacity = m.opacity;
                            mm.transparent = true;
                            materials[i] = mm;
                        }
                        else if (m.name.indexOf("Material.001") !== -1) {
                            var mm = new THREE.MeshPhongMaterial({ map: m.map });
                            mm.specularMap = m.map;
                            mm.shininess = 30;
                            mm.color.setHex(0x404040);
                            mm.metal = true;
                            materials[i] = mm;
                        }
                        materials[i].side = THREE.DoubleSide;
                    }
                };
                CTMTest.prototype.render = function () {
                    this.threeJSView.render();
                };
                CTMTest.prototype.toggleGI = function (newValue) {
                    _super.prototype.toggleGI.call(this, newValue);
                    if (newValue) {
                        if (!this._tracing.value && !this.traceInitialized) {
                            this._tracing.click();
                            this.traceInitialized = true;
                        }
                        if (this._tracing.value && this.xrayView.dirty) {
                            this.xrayView.toggleTrace(newValue);
                        }
                    }
                };
                CTMTest.prototype.toggleTrace = function (newValue) {
                    this.xrayView.toggleTrace(newValue);
                };
                return CTMTest;
            }(SimpleGUI_1.SimpleGUI));
            exports_1("CTMTest", CTMTest);
        }
    }
});
//# sourceMappingURL=CTMTest.js.map