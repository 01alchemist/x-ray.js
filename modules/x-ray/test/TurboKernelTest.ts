import {SimpleGUI} from "./SimpleGUI";
// import {ThreeJSView, XRayView, MathUtils, Thread} from "xrenderer";
import Matrix3 = THREE.Matrix3;
import {ThreeJSView} from "../core/src/ThreeJSView";
import {XRayView} from "../core/src/XRayView";
import {Thread} from "../core/src/engine/renderer/worker/Thread";
import {MathUtils} from "../core/src/engine/utils/MathUtils";
import {Color} from "../core/src/engine/math/Color";
/**
 * Created by Nidin Vinayakan on 27-02-2016.
 */
export class TurboKernelTest extends SimpleGUI {

    private threeJSView:ThreeJSView;
    private xrayView:XRayView;

    constructor() {
        super();

        Thread.workerUrl = "../workers/trace-worker-bootstrap-debug.js";

        this.i_width = 2560 / 4;
        this.i_height = 1440 / 4;
    }

    onInit() {
        var self = this;

        this.threeJSView = new ThreeJSView(this.i_width, this.i_height, this.webglOutput, this.appContainer);
        this.xrayView = new XRayView(this.i_width, this.i_height, this.giOutput);
        this.xrayView.iterations = 10000000;
        this.xrayView.hitSamples = 1;
        // this.xrayView.cameraSamples = 4;
        this.xrayView.blockIterations = 1;
        this.xrayView.bounces = 2;
        this.xrayView.scene.color.set(0, 0, 0);
        // this.xrayView.scene.color = Color.hexColor(0xFDDCBA);
        // var ambient = new THREE.AmbientLight(0x5C5C5C);
        // this.threeJSView.scene.add(ambient);
        var directionalLight = new THREE.DirectionalLight(0xffeedd, 1);
        directionalLight.castShadow = true;
        directionalLight.position.set(0, 1, 0);
        this.threeJSView.scene.add(directionalLight);

        var color = 0xffeedd;

        var geometry:any = new THREE.SphereGeometry(1, 32, 32);
        var material:any = new THREE.MeshBasicMaterial({color: 0xffffff});
        var sphere = new THREE.Mesh(geometry, material);

        var pointLight1 = new THREE.PointLight(0xffffff, 3, 30);
        pointLight1.position.set(-10, 5, 10);
        pointLight1.add(sphere.clone());
        this.threeJSView.scene.add(pointLight1);

        var pointLight2 = new THREE.PointLight(0xffffff, 3, 30);
        pointLight2.position.set(10, 5, 10);
        pointLight2.add(sphere.clone());
        this.threeJSView.scene.add(pointLight2);

        /*var pointLight = new THREE.PointLight(color, 1, 30);
         pointLight.position.set(5, 5, 0);
         pointLight.castShadow = true;
         pointLight.shadow.camera["near"] = 1;
         pointLight.shadow.camera["far"] = 300;
         pointLight.shadow.bias = 0.01;
         this.threeJSView.scene.add(pointLight);*/

        // texture
        var manager = new THREE.LoadingManager();
        /*manager.onProgress = function (item, loaded, total) {
         console.log(item, loaded, total);
         };*/
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
        // material = new THREE.MeshPhongMaterial({color: 0xFDDCBA});
        material = new THREE.MeshPhongMaterial({color: 0xB9B9B9});
        material.ior = 1.5;
        material.gloss = MathUtils.radians(15);
        var mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(MathUtils.radians(-90), 0, 0);
        // mesh.position.set(-0.5, -0.5, -0.5);
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        this.threeJSView.scene.add(mesh);

        /*var areaLightMesh = mesh.clone();
         var pointLight3 = new THREE.PointLight(0xffffff, 1, 1000);
         pointLight3.position.set(0, 100, 0);
         pointLight3.add(areaLightMesh);
         this.threeJSView.scene.add(pointLight3);*/

        self.render();

        var name = "stanford-dragon";
        var folder = "stanford-dragon/";

        //THREE.Loader.Handlers.add( /\.dds$/i, new THREE["DDSLoader"]() );
        var mtlLoader = new THREE["MTLLoader"](manager);
        mtlLoader.setPath('./models/' + folder);
        mtlLoader.load(name + '.mtl', function (materials) {
            var objLoader = new THREE["OBJLoader"]();
            objLoader.setMaterials(materials);
            objLoader.setPath('./models/' + folder);
            materials.preload();
            objLoader.load(name + '.obj', function (object) {
                // object.position.y = -95;
                object.scale.set(0.3, 0.3, 0.3);
                object.smooth = true;
                self.threeJSView.scene.add(object);
                self.render();

                setTimeout(function () {
                    self.xrayView.setThreeJSScene(self.threeJSView.scene, function () {
                        self.xrayView.updateCamera(self.threeJSView.camera);
                        if (self._tracing.value) {
                            self.xrayView.toggleTrace(true);
                        }
                    });
                    self.render();
                }, 5000);

            }, onProgress, onError);
        });


        this.threeJSView.onCameraChange = function (camera) {
            self.xrayView.updateCamera(camera);
            if (self._tracing.value && self.xrayView.dirty) {
                //self.xrayView.toggleTrace(true);
            }
        };
        this.render();

        this.threeJSView.controls.onMouseDown = (event) => {
            this.toggleGI(false);
            if (!this._tracing.value && this._gi.value) {
                this._gi.click();
            }
        };
        this.threeJSView.controls.onMouseUp = (event) => {
            if (this._tracing.value && this._gi.value) {
                this.toggleGI(true);
            }
        };
        this.threeJSView.controls.onMouseWheel = (event) => {
            if (this._tracing.value && this._gi.value) {
                this.toggleGI(true);
            }
        };
    }

    render() {
        this.threeJSView.render();
    }

    //configure GUI
    toggleGI(newValue) {
        super.toggleGI(newValue);
        if (newValue) {
            if (!this._tracing.value && !this.traceInitialized) {
                this._tracing.click();
                this.traceInitialized = true;
            }
            if (this._tracing.value && this.xrayView.dirty) {
                this.xrayView.toggleTrace(newValue);
            }
        }
    }

    toggleTrace(newValue:boolean) {
        this.xrayView.toggleTrace(newValue);
    }
}
