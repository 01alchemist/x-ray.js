declare var THREE:any;

import {SimpleGUI} from "./SimpleGUI";
// import {ThreeJSView, XRayView, MathUtils, Thread} from "xrenderer";
import Matrix3 = THREE.Matrix3;
import {ThreeJSView} from "../core/src/ThreeJSView";
import {XRayView} from "../core/src/XRayView";
import {Thread} from "../core/src/engine/renderer/worker/Thread";
import {MathUtils} from "../core/src/engine/utils/MathUtils";
import {Color} from "../core/src/engine/math/Color";
/**
 * Created by Nidin Vinayakan on 27-02-2016
 * Turbo Kernel Test
 */
export class CTMTest extends SimpleGUI {

    private threeJSView: ThreeJSView;
    private xrayView: XRayView;
    textureCube;

    constructor() {
        super();

        Thread.workerUrl = "../workers/trace-worker-bootstrap-debug.js";

        this.i_width = 2560 / 4;
        this.i_height = 1536 / 4;
    }

    onInit() {
        var self = this;

        this.threeJSView = new ThreeJSView(this.i_width, this.i_height, this.webglOutput, this.appContainer);
        this.xrayView = new XRayView(this.i_width, this.i_height, this.giOutput);
        this.xrayView.iterations = 10000;
        this.xrayView.hitSamples = 1;
        // this.xrayView.cameraSamples = 4;
        this.xrayView.blockIterations = 1;
        this.xrayView.bounces = 5;
        //this.xrayView.scene.color.set(0, 0, 0);
        // this.xrayView.scene.color = Color.hexColor(0xFDDCBA);
        var ambient = new THREE.AmbientLight(0x5C5C5C);
        // this.threeJSView.scene.add(ambient);
        var directionalLight = new THREE.DirectionalLight(0xffeedd, 1);
        directionalLight.castShadow = true;
        directionalLight.position.set(0, 1, 0);
        // this.threeJSView.scene.add(directionalLight);

        var color = 0xffeedd;

        var geometry: any = new THREE.SphereGeometry(10, 32, 32);
        var material: any = new THREE.MeshBasicMaterial({color: 0xffffff});
        var sphere = new THREE.Mesh(geometry, material);

        var pointLight1 = new THREE.PointLight(0xffffff, 3, 30);
        pointLight1.position.set(-10, 5, 10);
        pointLight1.add(sphere.clone());
        // this.threeJSView.scene.add(pointLight1);

        var pointLight2 = new THREE.PointLight(0xffffff, 3, 30);
        pointLight2.position.set(30, 60, 10);
        pointLight2.add(sphere.clone());
        this.threeJSView.scene.add(pointLight2);

        var pointLight = new THREE.PointLight(color, 1, 30);
        pointLight.position.set(5, 5, 0);
        pointLight.castShadow = true;
        pointLight.shadow.camera["near"] = 1;
        pointLight.shadow.camera["far"] = 300;
        pointLight.shadow.bias = 0.01;
        // this.threeJSView.scene.add(pointLight);

        let size = 300;

        // geometry = new THREE.BoxBufferGeometry( 1000, 1, 1000);
        geometry = new THREE.CubeGeometry(1000,1,1000,10,1,10);
        material = new THREE.MeshPhongMaterial({color: 0xffffff});
        material.ior = 1.5;
        material.gloss = MathUtils.radians(15);
        var ground = new THREE.Mesh(geometry, material);
        ground.castShadow = false;
        ground.receiveShadow = true;
        this.threeJSView.scene.add(ground);

        geometry = new THREE.CubeGeometry(1,size,size,1,10,10);
        material = new THREE.MeshPhongMaterial({color: 0xFF0000});
        material.ior = 1.5;
        material.gloss = MathUtils.radians(15);
        var left = new THREE.Mesh(geometry, material);
        left.position.set(-size/2,0,0);
        left.castShadow = false;
        left.receiveShadow = true;
        this.threeJSView.scene.add(left);

        geometry = new THREE.CubeGeometry(1,size,size,1,10,10);
        material = new THREE.MeshPhongMaterial({color: 0x00FF00});
        material.ior = 1.5;
        material.gloss = MathUtils.radians(15);
        var right = new THREE.Mesh(geometry, material);
        right.position.set(size/2,0,0);
        right.castShadow = false;
        right.receiveShadow = true;
        this.threeJSView.scene.add(right);

        geometry = new THREE.CubeGeometry(size,size,1,10,10,1);
        material = new THREE.MeshPhongMaterial({color: 0xB9B9B9});
        material.ior = 1.5;
        material.gloss = MathUtils.radians(15);
        var back = new THREE.Mesh(geometry, material);
        back.position.set(0,0,-size/2);
        back.castShadow = false;
        back.receiveShadow = true;
        this.threeJSView.scene.add(back);

        /*var areaLightMesh = mesh.clone();
         var pointLight3 = new THREE.PointLight(0xffffff, 1, 1000);
         pointLight3.position.set(0, 100, 0);
         pointLight3.add(areaLightMesh);
         this.threeJSView.scene.add(pointLight3);*/

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

        this.textureCube = new THREE.CubeTextureLoader().load( urls );

        /// CTM Loader
        var start = Date.now();

        // new way via CTMLoader and separate parts

        let loaderCTM = new THREE.CTMLoader();

        var position = new THREE.Vector3( -105, 0, 0 );
        var scale = new THREE.Vector3( 30, 30, 30 );

        loaderCTM.loadParts( "three/models/ctm/camaro/camaro.js", ( geometries, materials ) => {

            this.hackMaterials( materials );

            for ( var i = 0; i < geometries.length; i ++ ) {

                var mesh = new THREE.Mesh( geometries[ i ], materials[ i ] );
                mesh.position.copy( position );
                mesh.scale.copy( scale );
                this.threeJSView.scene.add( mesh );

            }

            var end = Date.now();

            console.log( "load time:", end - start, "ms" );

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

        }, { useWorker: true, worker: new Worker('../../../node_modules/three/examples/js/loaders/ctm/CTMWorker.js') } );

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

    hackMaterials( materials ) {

    for ( var i = 0; i < materials.length; i ++ ) {

        var m = materials[ i ];

        if ( m.name.indexOf( "Body" ) !== -1 ) {

            var mm = new THREE.MeshStandardMaterial();

            mm.color.setHex( 0xFF0000 );
            mm.lightMap = m.map;
            mm.envMap = this.textureCube;
            mm.metalness = 0.5;
            mm.roughness = 0.3;

            materials[ i ] = mm;

        } else if ( m.name.indexOf( "tire_car" ) !== -1 ) {

            var mm = new THREE.MeshStandardMaterial();

            mm.color.setHex( 0x000000 );
            mm.lightMap = m.map;
            mm.metalness = 0.1;
            mm.roughness = 0.9;

            materials[ i ] = mm;

        } else if ( m.name.indexOf( "mirror" ) !== -1 ) {

            var mm = new THREE.MeshStandardMaterial();

            mm.color.setHex( 0x808080 );
            mm.lightMap = m.map;
            mm.envMap = this.textureCube;
            mm.metalness = 0.9;
            mm.roughness = 0.5;

            materials[ i ] = mm;

        } else if ( m.name.indexOf( "glass" ) !== -1 ) {

            var mm = new THREE.MeshStandardMaterial();

            mm.color.copy( m.color );
//						mm.lightMap = m.map;
            mm.envMap = this.textureCube;
            mm.metalness = 1;
            mm.roughtness = 0.1;
            mm.opacity = m.opacity;
            mm.transparent = true;

            materials[ i ] = mm;

        } else if ( m.name.indexOf( "Material.001" ) !== -1 ) {

            var mm = new THREE.MeshPhongMaterial( { map: m.map } );

            mm.specularMap = m.map;
            mm.shininess = 30;
            mm.color.setHex( 0x404040 );
            mm.metal = true;

            materials[ i ] = mm;

        }

        materials[ i ].side = THREE.DoubleSide;

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
            if (this._tracing.value && this.xrayView.dirty) {
                this.xrayView.toggleTrace(newValue);
            }
        }
    }

    toggleTrace(newValue: boolean) {
        this.xrayView.toggleTrace(newValue);
    }
}
