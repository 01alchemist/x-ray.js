System.register(["./SimpleGUI", "../core/src/ThreeJSView", "../core/src/GIJSView", "../core/src/engine/renderer/worker/Thread", "../core/src/engine/utils/MathUtils"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var SimpleGUI_1, ThreeJSView_1, GIJSView_1, Thread_1, MathUtils_1;
    var CTMTest;
    return {
        setters:[
            function (SimpleGUI_1_1) {
                SimpleGUI_1 = SimpleGUI_1_1;
            },
            function (ThreeJSView_1_1) {
                ThreeJSView_1 = ThreeJSView_1_1;
            },
            function (GIJSView_1_1) {
                GIJSView_1 = GIJSView_1_1;
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
                    this.i_height = 1440 / 4;
                }
                CTMTest.prototype.onInit = function () {
                    var _this = this;
                    var self = this;
                    this.threeJSView = new ThreeJSView_1.ThreeJSView(this.i_width, this.i_height, this.webglOutput, this.appContainer);
                    this.giJSView = new GIJSView_1.GIJSView(this.i_width, this.i_height, this.giOutput);
                    this.giJSView.iterations = 10000000;
                    this.giJSView.hitSamples = 1;
                    this.giJSView.cameraSamples = -1;
                    this.giJSView.blockIterations = 1;
                    this.giJSView.bounces = 3;
                    this.giJSView.scene.color.set(0, 0, 0);
                    var directionalLight = new THREE.DirectionalLight(0xffeedd, 1);
                    directionalLight.castShadow = true;
                    directionalLight.position.set(0, 1, 0);
                    this.threeJSView.scene.add(directionalLight);
                    var color = 0xffeedd;
                    var geometry = new THREE.SphereGeometry(0.05, 32, 32);
                    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                    var sphere = new THREE.Mesh(geometry, material);
                    var pointLight1 = new THREE.PointLight(0xffffff, 1, 30);
                    pointLight1.position.set(5, 5, 20);
                    pointLight1.add(sphere.clone());
                    this.threeJSView.scene.add(pointLight1);
                    var pointLight2 = new THREE.PointLight(0xffffff, 1, 30);
                    pointLight2.position.set(5, 3, 1);
                    pointLight2.add(sphere.clone());
                    this.threeJSView.scene.add(pointLight2);
                    var manager = new THREE.LoadingManager();
                    manager.onProgress = function (item, loaded, total) {
                        console.log(item, loaded, total);
                    };
                    var onProgress = function (xhr) {
                        if (xhr.lengthComputable) {
                            var percentComplete = xhr.loaded / xhr.total * 100;
                            console.log(Math.round(percentComplete) + '% downloaded');
                        }
                    };
                    var onError = function (xhr) {
                    };
                    geometry = new THREE.PlaneGeometry(100, 100);
                    material = new THREE.MeshPhongMaterial({ color: 0x307430 });
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(0, 0, -5);
                    mesh.castShadow = false;
                    mesh.receiveShadow = true;
                    this.threeJSView.scene.add(mesh);
                    material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
                    var red = new THREE.Mesh(geometry, material);
                    red.rotation.set(0, MathUtils_1.MathUtils.radians(90), 0);
                    red.position.set(-4, 0, 10);
                    this.threeJSView.scene.add(red);
                    var start = Date.now();
                    var loaderCTM = new THREE["CTMLoader"]();
                    var position = new THREE.Vector3(-105, -78, -30);
                    var scale = new THREE.Vector3(30, 30, 30);
                    loaderCTM.loadParts("../../../models/ctm/camaro/camaro.js", function (geometries, materials) {
                        self.hackMaterials(materials);
                        for (var i = 0; i < geometries.length; i++) {
                            var mesh = new THREE.Mesh(geometries[i], materials[i]);
                            self.threeJSView.scene.add(mesh);
                        }
                        var end = Date.now();
                        console.log("load time:", end - start, "ms");
                        self.render();
                        setTimeout(function () {
                            self.giJSView.setThreeJSScene(self.threeJSView.scene, function () {
                                self.giJSView.updateCamera(self.threeJSView.camera);
                                if (self._tracing.value) {
                                    self.giJSView.toggleTrace(true);
                                }
                            });
                            self.render();
                        }, 2000);
                    }, { useWorker: true, worker: new Worker("../../../three.js/examples/js/loaders/ctm/CTMWorker.js") });
                    this.threeJSView.onCameraChange = function (camera) {
                        self.giJSView.updateCamera(camera);
                        if (self._tracing.value && self.giJSView.dirty) {
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
                            var mm = new THREE["MeshStandardMaterial"]();
                            mm.color.setHex(0xff0000);
                            mm.lightMap = m.map;
                            mm.metalness = 0.9;
                            mm.roughness = 0.2;
                            mm.ior = 10;
                            mm.gloss = MathUtils_1.MathUtils.radians(45);
                            materials[i] = mm;
                        }
                        else if (m.name.indexOf("mirror") !== -1) {
                            mm = new THREE["MeshStandardMaterial"]();
                            mm.color.setHex(0x808080);
                            mm.lightMap = m.map;
                            mm.metalness = 0.9;
                            mm.roughness = 0.5;
                            mm.ior = 1000;
                            materials[i] = mm;
                        }
                        else if (m.name.indexOf("glass") !== -1) {
                            mm = new THREE["MeshStandardMaterial"]();
                            mm.color.copy(m.color);
                            mm.metalness = 1;
                            mm.roughtness = 0.1;
                            mm.opacity = m.opacity;
                            mm.ior = 1.3;
                            mm.glosss = MathUtils_1.MathUtils.radians(45);
                            mm.transparent = true;
                            materials[i] = mm;
                        }
                        else if (m.name.indexOf("Material.001") !== -1) {
                            mm = new THREE.MeshPhongMaterial({ map: m.map });
                            mm.specularMap = m.map;
                            mm.shininess = 30;
                            mm.color.setHex(0x404040);
                            mm.metal = true;
                            mm.ior = 1;
                            mm.gloss = MathUtils_1.MathUtils.radians(45);
                            materials[i] = mm;
                        }
                        else if (m.name.indexOf("tire_car-ao") !== -1) {
                            mm = new THREE.MeshPhongMaterial({ map: m.map });
                            mm.specularMap = m.map;
                            mm.shininess = 0;
                            mm.color.setHex(0x000000);
                            mm.metal = false;
                            mm.ior = 1;
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
                        if (this._tracing.value && this.giJSView.dirty) {
                            this.giJSView.toggleTrace(newValue);
                        }
                    }
                };
                CTMTest.prototype.toggleTrace = function (newValue) {
                    this.giJSView.toggleTrace(newValue);
                };
                return CTMTest;
            }(SimpleGUI_1.SimpleGUI));
            exports_1("CTMTest", CTMTest);
        }
    }
});
//# sourceMappingURL=CTMTest.js.map