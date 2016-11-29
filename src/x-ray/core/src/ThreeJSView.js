System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ThreeJSView;
    return {
        setters:[],
        execute: function() {
            ThreeJSView = (function () {
                function ThreeJSView(width, height, container, appContainer) {
                    var _this = this;
                    this.width = width;
                    this.height = height;
                    this.container = container;
                    this.appContainer = appContainer;
                    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 20000);
                    this.camera.up = new THREE.Vector3(0, 1, 0);
                    this.camera.position.y = 50;
                    this.camera.position.z = 10;
                    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
                    this.scene = new THREE.Scene();
                    this.scene.position.x = 0;
                    this.scene.position.y = 0;
                    this.renderer = new THREE.WebGLRenderer();
                    this.renderer.setPixelRatio(window.devicePixelRatio);
                    this.renderer.setSize(this.width, this.height);
                    this.renderer.shadowMap.enabled = true;
                    this.renderer.shadowMap.type = THREE.BasicShadowMap;
                    this.container.appendChild(this.renderer.domElement);
                    this.controls = new THREE["EditorControls"](this.camera, this.appContainer);
                    this.controls.addEventListener('change', function () {
                        _this.render();
                        if (_this.onCameraChange) {
                            _this.onCameraChange(_this.camera);
                        }
                    });
                }
                ThreeJSView.prototype.animate = function () {
                    requestAnimationFrame(this.animate.bind(this));
                    this.render();
                };
                ThreeJSView.prototype.render = function () {
                    this.renderer.render(this.scene, this.camera);
                };
                return ThreeJSView;
            }());
            exports_1("ThreeJSView", ThreeJSView);
        }
    }
});
//# sourceMappingURL=ThreeJSView.js.map