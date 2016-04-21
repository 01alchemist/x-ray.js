import {CanvasDisplay} from "./CanvasDisplay";
import {SmartBucketRenderer} from "../core/src/engine/renderer/SmartBucketRenderer";
import {Camera} from "../core/src/engine/scene/Camera";
import {SharedScene} from "../core/src/engine/scene/SharedScene";
/**
 * Created by Nidin Vinayakan on 19/2/2016.
 */
export abstract class GIRenderBase extends CanvasDisplay {

    protected renderer:SmartBucketRenderer;
    protected pixels:Uint8ClampedArray;
    protected scene:SharedScene;
    protected camera:Camera;
    protected cameraSamples:number;
    protected hitSamples:number;
    protected bounces:number;
    protected iterations:number;
    protected blockIterations:number;

    public dirty:boolean;

    constructor(i_width:number, i_height:number, container:HTMLElement) {
        super(i_width, i_height, container);
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
        if(this.renderer.initialized) {
            if (newValue) {
                var cam = this.camera.toJSON();
                this.dirty = false;
                this.renderer.updateCamera(cam);
            } else {
                this.renderer.traceManager.stop();
            }
        }
    }

    render(onInit?:Function) {

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
            onUpdate, onInit
        );
        function onUpdate(rect) {
            self.updatePixelsRect(rect, self.pixels);
        }
    }

}