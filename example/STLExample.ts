import {SimpleGUI} from "./SimpleGUI";
//import {ThreeJSView} from "core/src/ThreeJSView";
//import {GIJSView} from "core/src/GIJSView";
import {ThreeJSView, GIJSView, MathUtils, Color} from "xrenderer";
import Matrix3 = THREE.Matrix3;
import {Thread} from "xrenderer";
/**
 * Created by Nidin Vinayakan on 27-02-2016.
 */
export class STLExample extends SimpleGUI {

    private threeJSView:ThreeJSView;
    private giJSView:GIJSView;
    private model;

    constructor() {
        super();

        Thread.workerUrl = "../modules/xrenderer/workers/trace-worker-bootstrap.js";

        this.i_width = 2560 / 2;
        this.i_height = 1440 / 2;
    }

    onInit() {
        var self = this;

        this.threeJSView = new ThreeJSView(this.i_width, this.i_height, this.webglOutput, this.appContainer);
        this.giJSView = new GIJSView(this.i_width, this.i_height, this.giOutput);
        this.giJSView.hitSamples = 16;
        // this.giJSView.cameraSamples = 4;
        // this.giJSView.blockIterations = 4;
        this.giJSView.bounces = 3;
        this.giJSView.scene.color.set(0, 0, 0);
        // this.giJSView.scene.color = Color.hexColor(0xFDDCBA);
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

        var pointLight1 = new THREE.PointLight(0xffffff, 1, 30);
        pointLight1.position.set(0, 20, 0);
        pointLight1.add(sphere.clone());
        this.threeJSView.scene.add(pointLight1);

        var pointLight2 = new THREE.PointLight(0xffffff, 1, 30);
        pointLight2.position.set(12, 0, 0);
        pointLight2.add(sphere.clone());
        //this.threeJSView.scene.add(pointLight2);

        /*var pointLight = new THREE.PointLight(color, 1, 30);
         pointLight.position.set(5, 5, 0);
         pointLight.castShadow = true;
         pointLight.shadow.camera["near"] = 1;
         pointLight.shadow.camera["far"] = 300;
         pointLight.shadow.bias = 0.01;
         this.threeJSView.scene.add(pointLight);*/

        // texture
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
        // material = new THREE.MeshPhongMaterial({color: 0xFDDCBA});
        material = new THREE.MeshPhongMaterial({color: 0xB9B9B9});
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

        var loader = new THREE["STLLoader"](manager);
        loader.load('../models/stl/binary/pr2_head_tilt.stl', function (geometry) {

            var material = new THREE.MeshPhongMaterial({
                // ambient: 0x555555,
                color: 0xAAAAAA,
                specular: 0x111111,
                shininess: 200
            });
            var mesh = new THREE.Mesh(geometry, material);

            mesh.position.set(0, 0, 0);
            mesh.rotation.set(-Math.PI / 2, 0.3, 0);
            mesh.scale.set(2, 2, 2);

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            self.threeJSView.scene.add(mesh);
            self.render();
            self.giJSView.setThreeJSScene(self.threeJSView.scene, function () {
                self.giJSView.updateCamera(self.threeJSView.camera);
                if (self._tracing.value) {
                    self.giJSView.toggleTrace(true);
                }
            });
            self.render();
        }, onProgress, onError);

        /* GI */

        /*this.giJSView.loadModel('../models/teapot.obj', function(){
         //this.giJSView.loadModel('../models/emerald.obj', function(){
         if(self._tracing.value){
         self.giJSView.toggleTrace(true);
         }
         });*/
        this.threeJSView.onCameraChange = function (camera) {
            self.giJSView.updateCamera(camera);
            if (self._tracing.value && self.giJSView.dirty) {
                //self.giJSView.toggleTrace(true);
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
            if (this._tracing.value && this.giJSView.dirty) {
                this.giJSView.toggleTrace(newValue);
            }
        }
    }

    toggleTrace(newValue:boolean) {
        this.giJSView.toggleTrace(newValue);
    }
}
