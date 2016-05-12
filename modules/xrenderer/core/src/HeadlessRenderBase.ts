import {Color} from "./engine/math/Color";
import {Camera} from "./engine/scene/Camera";
import {SharedScene} from "./engine/scene/SharedScene";
import {Vector3} from "./engine/math/Vector3";
import {SmartBucketRenderer} from "./engine/renderer/SmartBucketRenderer";


/**
 * Created by Nidin Vinayakan on 11/5/2016.
 */

export class HeadlessRenderBase {

    protected renderer:SmartBucketRenderer;
    protected pixels:Uint8Array;
    protected data:Uint8Array;
    protected scene:SharedScene;
    protected camera:Camera;
    protected cameraSamples:number;
    protected hitSamples:number;
    protected bounces:number;
    protected iterations:number;
    protected blockIterations:number;

    public dirty:boolean;

    constructor(public i_width:number, public i_height:number, public outmemory?:Uint8Array) {

        this.data = new Uint8Array(i_width * i_height * 4);

        this.scene = new SharedScene(Color.hexColor(0x262626));

        //default ground
        //this.scene.add(Cube.newCube(new Vector3(-100, -1, -100), new Vector3(100, 0, 100), new DiffuseMaterial(new Color(1, 1, 1))));
        //lights
        //this.scene.add(Sphere.newSphere(new Vector3(0, 50, 0), 1, new LightMaterial(Color.hexColor(0xffeedd), 1, NoAttenuation)));
        //this.scene.add(Sphere.newSphere(new Vector3(0, 50, 0), 1, new LightMaterial(Color.hexColor(0xffeedd), 1, NoAttenuation)));
        //this.scene.add(Sphere.newSphere(new Vector3(0, 600, 0), 200, new LightMaterial(Color.hexColor(0xffeedd), 10, NoAttenuation)));

        this.camera = Camera.lookAt(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 1, 0), 45);

        this.cameraSamples = -1;
        this.hitSamples = 1;
        this.bounces = 4;
        this.iterations = 1000000;
        this.blockIterations = 1;

        this.renderer = new SmartBucketRenderer();
    }

    updateCameraSamples(newValue:number) {
        if (this.cameraSamples != newValue) {
            this.cameraSamples = newValue;
            this.renderer.updateCameraSamples(newValue);
        }
    }

    updateHitSamples(newValue:number) {
        if (this.hitSamples != newValue) {
            this.hitSamples = newValue;
            this.renderer.updateHitSamples(newValue);
        }
    }

    updateCamera(newValue:any) {
        this.camera.updateFromArray(newValue.eye, newValue.lookAt, newValue.up,
            newValue.fov, newValue.focus, newValue.aperture
        );
        this.renderer.updateCamera(this.camera.toJSON());
    }

    updateCameraMatrix(matrix:number[]) {
        this.camera.u.setFromArray(matrix, 0);
        this.camera.v.setFromArray(matrix, 4);
        this.camera.w.setFromArray(matrix, 8);
        this.renderer.updateCamera(this.camera.toJSON());
    }

    toggleTrace(newValue:boolean) {
        if (this.renderer.initialized) {
            console.log("toggleTrace:" + newValue);
            if (newValue) {
                var cam = this.camera.toJSON();
                this.dirty = false;
                this.renderer.updateCamera(cam);
            } else {
                this.renderer.traceManager.stop();
            }
        }
    }

    render(onInit?:Function, onUpdate?:Function) {

        console.info("+ Render settings");
        console.info("      Resolution          :   " + this.i_width + "x" + this.i_height);
        console.info("      CameraSamples       :   " + this.cameraSamples);
        console.info("      HitSamples          :   " + this.hitSamples);
        console.info("      Bounces             :   " + this.bounces);
        console.info("      Iterations          :   " + this.iterations);
        console.info("      Block-Iterations    :   " + this.blockIterations);

        var self = this;
        this.pixels = this.renderer.render(
            this.scene, this.camera, this.i_width, this.i_height, this.cameraSamples, this.hitSamples,
            this.bounces, this.iterations, this.blockIterations,
            _onUpdate, onInit
        );
        function _onUpdate(rect) {
            //self.updatePixelsRect(rect, self.pixels);
            if(onUpdate){
                onUpdate(rect, self.pixels);
            }
        }
    }

    setResolution(width:number,height:number):void {
        this.i_width = width;
        this.i_height = height;
        // this.canvas.width = width;
        // this.canvas.height = height;
        // this.imageData = this.ctx.getImageData(0, 0, this.i_width, this.i_height);
        this.data = new Uint8Array(width * height * 4);
    }

    updatePixels(pixels:Uint8Array):void {

        for (var y = 0; y < this.i_height; y++) {
            for (var x = 0; x < this.i_width; x++) {
                var i:number = y * (this.i_width * 4) + (x * 4);
                var pi:number = y * (this.i_width * 3) + (x * 3);
                this.data[i] = pixels[pi];
                this.data[i + 1] = pixels[pi + 1];
                this.data[i + 2] = pixels[pi + 2];
                this.data[i + 3] = 255;
            }
        }
        //this.ctx.putImageData(this.imageData, 0, 0);
    }

    /*updatePixelsRect(rect, pixels:Uint8Array):void {

        for (var y = rect.yoffset; y < rect.yoffset + rect.height; y++) {
            for (var x = rect.xoffset; x < rect.xoffset + rect.width; x++) {

                var i:number = y * (this.i_width * 4) + (x * 4);
                var pi:number = y * (this.i_width * 3) + (x * 3);
                this.data[i] = pixels[pi];
                this.data[i + 1] = pixels[pi + 1];
                this.data[i + 2] = pixels[pi + 2];
                this.data[i + 3] = 255;
            }
        }
        if(this.outmemory){
            this.outmemory = this.data;
        }
        //this.ctx.putImageData(this.imageData, 0, 0);
    }*/
}
