import {GUI} from "./GUI";
import {GIJSView} from "./GIJSView";
import {ThreeJSView} from "./ThreeJSView";
import {MathUtils} from "../core/src/engine/utils/MathUtils";
/**
 * Created by Nidin Vinayakan on 27-02-2016.
 */
export class Example extends GUI {

    private threeJSView:ThreeJSView;
    private giJSView:GIJSView;
    private model;

    constructor() {
        super();
        this.i_width = 2560 / 2;
        this.i_height = 1440 / 2;
    }
    onInit() {
        var self = this;

        this.threeJSView = new ThreeJSView(this.i_width, this.i_height, this.webglOutput);
        this.giJSView = new GIJSView(this.i_width, this.i_height, this.giOutput);

        //var ambient = new THREE.AmbientLight(0x5C5C5C);
        //this.scene.add(ambient);
        //var directionalLight = new THREE.DirectionalLight(0xffeedd, 1);
        //directionalLight.castShadow = true;
        //directionalLight.position.set(0, 1, 0);
        //this.scene.add(directionalLight);

        var color = 0xffeedd;

        var pointLight = new THREE.PointLight(color, 1, 30);
        pointLight.position.set(5, 5, 0);
        pointLight.castShadow = true;
        pointLight.shadow.camera["near"] = 1;
        pointLight.shadow.camera["far"] = 300;
        pointLight.shadow.bias = 0.01;

        //this.threeJSView.scene.add(new THREE.CameraHelper(pointLight.shadow.camera));

        var geometry:any  = new THREE.SphereGeometry(1, 32, 32);
        var material:any  = new THREE.MeshBasicMaterial({color: color});
        var sphere = new THREE.Mesh(geometry, material);
        //pointLight.add(sphere);

        this.threeJSView.scene.add(pointLight);

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
        material = new THREE.MeshPhongMaterial({color: 0xffffff});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.set(MathUtils.radians(-90), 0, 0);
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        this.threeJSView.scene.add(mesh);

        var loader = new THREE["OBJLoader"](manager);
        loader.load('../../models/teapot.obj', function (object) {
        //loader.load('../models/dragon.obj', function (object) {
        //loader.load('../models/emerald.obj', function (object) {
            self.model = object;
            self.model.castShadow = true;
            self.model.receiveShadow = false;
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.color = new THREE.Color(0x00ff00);
                    child.material.ior = 1.3;
                    //child.material.tint = 0.5;
                    //child.material.gloss = 0;
                    //child.material.transparent = true;1
                    //child.castShadow = true;
                    child.receiveShadow = false;
                }
            });
            self.threeJSView.scene.add(object);
            self.giJSView.setThreeJSScene(self.threeJSView.scene, function(){
                if(self._tracing.value){
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
        this.threeJSView.onCameraChange = function(camera){
            self.giJSView.updateCamera(camera);
        };
        this.render();
    }

    render(){
        this.threeJSView.render();
    }

    //configure GUI
    toggleGI(newValue){
        super.toggleGI(newValue);
        if (newValue) {
            if(!this._tracing.value && !this.traceInitialized){
                this._tracing.click();
                this.traceInitialized = true;
            }
            if(this._tracing.value && this.giJSView.dirty){
                this.giJSView.toggleTrace(newValue);
            }
        }
    }

    toggleTrace(newValue:boolean) {
        this.giJSView.toggleTrace(newValue);
    }
}
