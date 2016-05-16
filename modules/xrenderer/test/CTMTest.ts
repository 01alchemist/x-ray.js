import {SimpleGUI} from "./SimpleGUI";
import {ThreeJSView} from "../core/src/ThreeJSView";
import {GIJSView} from "../core/src/GIJSView";
import {Thread} from "../core/src/engine/renderer/worker/Thread";
import {MathUtils} from "../core/src/engine/utils/MathUtils";
import Matrix3 = THREE.Matrix3;
/**
 * Created by Nidin Vinayakan on 27-02-2016.
 */
export class CTMTest extends SimpleGUI {

    private threeJSView:ThreeJSView;
    private giJSView:GIJSView;
    private model;

    constructor() {
        super();

        Thread.workerUrl = "../workers/trace-worker-bootstrap-debug.js";

        this.i_width = 2560 / 4;
        this.i_height = 1440 / 4;
    }

    onInit() {
        var self = this;

        this.threeJSView = new ThreeJSView(this.i_width, this.i_height, this.webglOutput, this.appContainer);
        this.giJSView = new GIJSView(this.i_width, this.i_height, this.giOutput);

        this.giJSView.iterations = 10000000;
        this.giJSView.hitSamples = 1;
        this.giJSView.cameraSamples = -1;
        this.giJSView.blockIterations = 1;
        this.giJSView.bounces = 5;
        this.giJSView.scene.color.set(0, 0, 0);

        //var ambient = new THREE.AmbientLight(0x5C5C5C);
        //this.threeJSView.scene.add(ambient);
        var directionalLight = new THREE.DirectionalLight(0xffeedd, 1);
        directionalLight.castShadow = true;
        directionalLight.position.set(0, 1, 0);
        this.threeJSView.scene.add(directionalLight);

        var color = 0xffeedd;

        var geometry:any = new THREE.SphereGeometry(0.05, 32, 32);
        var material:any = new THREE.MeshBasicMaterial({color: 0xffffff});
        var sphere = new THREE.Mesh(geometry, material);

        var pointLight1 = new THREE.PointLight(0xffffff, 1, 30);
        pointLight1.position.set(5, 5, 20);
        pointLight1.add(sphere.clone());
        this.threeJSView.scene.add(pointLight1);

        var pointLight2 = new THREE.PointLight(0xffffff, 1, 30);
        pointLight2.position.set(5, 3, 1);
        pointLight2.add(sphere.clone());
        this.threeJSView.scene.add(pointLight2);

        // var pointLight3 = new THREE.PointLight(0xffffff, 1, 30);
        // pointLight3.position.set(-10, -10, 10);
        // pointLight3.add(sphere.clone());
        //this.threeJSView.scene.add(pointLight3);

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
        material = new THREE.MeshPhongMaterial({color: 0x307430});
        var mesh = new THREE.Mesh(geometry, material);
        // mesh.rotation.set(MathUtils.radians(-90), 0, 0);
        mesh.position.set(0, 0, -5);
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        this.threeJSView.scene.add(mesh);
        material = new THREE.MeshPhongMaterial({color: 0x0000ff});
        var red = new THREE.Mesh(geometry, material);
        red.rotation.set(0, MathUtils.radians(90),0);
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
                // mesh.position.copy( position );
                // mesh.scale.copy( scale );
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

        }, {useWorker: true, worker: new Worker("../../../three.js/examples/js/loaders/ctm/CTMWorker.js")});

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

    hackMaterials(materials) {
        for (var i = 0; i < materials.length; i++) {
            var m = materials[i];
            if (m.name.indexOf("Body") !== -1) {
                var mm:any = new THREE["MeshStandardMaterial"]();
                mm.color.setHex(0xff0000);
                mm.lightMap = m.map;
                //mm.envMap = textureCube;
                mm.metalness = 0.9;
                mm.roughness = 0.2;
                mm.ior = 10;
                mm.gloss = MathUtils.radians(45);
                materials[i] = mm;
            } else if (m.name.indexOf("mirror") !== -1) {
                mm = new THREE["MeshStandardMaterial"]();
                mm.color.setHex(0x808080);
                mm.lightMap = m.map;
                //mm.envMap = textureCube;
                mm.metalness = 0.9;
                mm.roughness = 0.5;
                mm.ior = 1000;
                materials[i] = mm;
            } else if (m.name.indexOf("glass") !== -1) {
                mm = new THREE["MeshStandardMaterial"]();
                mm.color.copy(m.color);
//						mm.lightMap = m.map;
                //mm.envMap = textureCube;
                mm.metalness = 1;
                mm.roughtness = 0.1;
                mm.opacity = m.opacity;
                mm.ior = 1.3;
                mm.glosss = MathUtils.radians(45);
                mm.transparent = true;
                materials[i] = mm;
            } else if (m.name.indexOf("Material.001") !== -1) {
                mm = new THREE.MeshPhongMaterial({map: m.map});
                mm.specularMap = m.map;
                mm.shininess = 30;
                mm.color.setHex(0x404040);
                mm.metal = true;
                mm.ior = 1;
                mm.gloss = MathUtils.radians(45);
                materials[i] = mm;
            } else if (m.name.indexOf("tire_car-ao") !== -1) {
                mm = new THREE.MeshPhongMaterial({map: m.map});
                mm.specularMap = m.map;
                mm.shininess = 0;
                mm.color.setHex(0x000000);
                mm.metal = false;
                mm.ior = 1;
                materials[i] = mm;
            }
            materials[i].side = THREE.DoubleSide;
        }
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
