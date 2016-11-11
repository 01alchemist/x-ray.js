System.register(["./SimpleGUI", "../core/src/ThreeJSView", "../core/src/GIJSView", "../core/src/engine/renderer/worker/Thread", "../core/src/engine/utils/MathUtils"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var SimpleGUI_1, ThreeJSView_1, GIJSView_1, Thread_1, MathUtils_1;
    var FBXTest;
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
            FBXTest = (function (_super) {
                __extends(FBXTest, _super);
                function FBXTest() {
                    _super.call(this);
                    Thread_1.Thread.workerUrl = "../workers/trace-worker-bootstrap-debug.js";
                    this.i_width = 2560 / 4;
                    this.i_height = 1440 / 4;
                }
                FBXTest.prototype.onInit = function () {
                    var _this = this;
                    var self = this;
                    this.threeJSView = new ThreeJSView_1.ThreeJSView(this.i_width, this.i_height, this.webglOutput, this.appContainer);
                    this.giJSView = new GIJSView_1.GIJSView(this.i_width, this.i_height, this.giOutput);
                    this.giJSView.iterations = 10000000;
                    this.giJSView.hitSamples = 1;
                    this.giJSView.blockIterations = 1;
                    this.giJSView.bounces = 0;
                    this.giJSView.scene.color.set(0, 0, 0);
                    var directionalLight = new THREE.DirectionalLight(0xffeedd, 1);
                    directionalLight.castShadow = true;
                    directionalLight.position.set(0, 1, 0);
                    this.threeJSView.scene.add(directionalLight);
                    var color = 0xffeedd;
                    var geometry = new THREE.SphereGeometry(1, 32, 32);
                    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
                    var sphere = new THREE.Mesh(geometry, material);
                    var pointLight1 = new THREE.PointLight(0xffffff, 1, 30);
                    pointLight1.position.set(-10, 5, 10);
                    pointLight1.add(sphere.clone());
                    this.threeJSView.scene.add(pointLight1);
                    var pointLight2 = new THREE.PointLight(0xffffff, 1, 30);
                    pointLight2.position.set(10, 5, 10);
                    pointLight2.add(sphere.clone());
                    this.threeJSView.scene.add(pointLight2);
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
                    geometry = new THREE.PlaneGeometry(100, 100);
                    material = new THREE.MeshPhongMaterial({ color: 0xB9B9B9 });
                    material.ior = 1.5;
                    material.gloss = MathUtils_1.MathUtils.radians(15);
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.rotation.set(MathUtils_1.MathUtils.radians(-90), 0, 0);
                    mesh.castShadow = false;
                    mesh.receiveShadow = true;
                    this.threeJSView.scene.add(mesh);
                    self.render();
                    var objectLoader = new THREE["FBXLoader"]();
                    objectLoader.load("../../../models/porsche-cayman-vray-fbx/porsche-cayman-vray.fbx", function (obj) {
                        self.threeJSView.scene.add(obj);
                        self.render();
                        setTimeout(function () {
                            self.giJSView.setThreeJSScene(self.threeJSView.scene, function () {
                                self.giJSView.updateCamera(self.threeJSView.camera);
                                if (self._tracing.value) {
                                    self.giJSView.toggleTrace(true);
                                }
                            });
                            self.render();
                        }, 5000);
                    });
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
                FBXTest.prototype.render = function () {
                    this.threeJSView.render();
                };
                FBXTest.prototype.toggleGI = function (newValue) {
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
                FBXTest.prototype.toggleTrace = function (newValue) {
                    this.giJSView.toggleTrace(newValue);
                };
                return FBXTest;
            }(SimpleGUI_1.SimpleGUI));
            exports_1("FBXTest", FBXTest);
        }
    }
});
//# sourceMappingURL=FBXTest.js.map