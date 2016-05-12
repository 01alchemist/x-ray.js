/**
 * Created by Nidin Vinayakan on 08-05-2016.
 */
import {Worker as _worker} from "Worker";
import {HeadlessRenderBase, SharedScene, Cube, Vector3, Sphere, Camera} from "xrenderer";
import {LightMaterial, ClearMaterial, SpecularMaterial, TransparentMaterial, GlossyMaterial, DiffuseMaterial} from "xrenderer";
import {LinearAttenuation, MathUtils, Color, Thread} from "xrenderer";
// import fs = require("fs");
//import from = require("pngjs").PNG;

export class Example extends HeadlessRenderBase{

    constructor(){

        Worker = _worker;

        Thread.workerUrl = "./trace-worker.js";
        
        super(2560 / 4, 1440 / 4);

        //default ground
        this.scene.add(Cube.newCube(new Vector3(-100, -1, -100), new Vector3(100, 0, 100), new DiffuseMaterial(new Color(1, 1, 1))));
        //lights
        this.scene.add(Sphere.newSphere(new Vector3(0, 5, 0), 1, new LightMaterial(new Color(1, 1, 1), 1, new LinearAttenuation(0.84))));
        this.scene.add(Sphere.newSphere(new Vector3(-1, 0.15, -1), 0.15, new LightMaterial(Color.hexColor(0xFFC0CB), 10, new LinearAttenuation(1))));

        this.camera = Camera.lookAt(new Vector3(-3, 2, -7), new Vector3(0, 0, 3), new Vector3(0, 1, 0), 45);

        var glass = new ClearMaterial(1.3, MathUtils.radians(0));
        var roughGlass = new ClearMaterial(1.3, MathUtils.radians(4));
        var mirror = new SpecularMaterial(Color.hexColor(0xFFFFFF), 1000);
        var tintedGlass = new TransparentMaterial(Color.hexColor(0x00ff00), 1.3, MathUtils.radians(0), 0.5);
        var red = new GlossyMaterial(new Color(1,0,0), 1.5, MathUtils.radians(0));
        glass.transparent = true;
        this.scene.add(Sphere.newSphere(new Vector3(-3, 0.5, 1), 0.5, red));
        this.scene.add(Sphere.newSphere(new Vector3(-2, 0.5, -1), 0.5, glass));
        this.scene.add(Sphere.newSphere(new Vector3(-3.5, 0.5, -1), 0.5, roughGlass));
        this.scene.add(Sphere.newSphere(new Vector3(-4, 1, 4), 1, mirror));
        this.scene.add(Sphere.newSphere(new Vector3(-1, 0.5, -3), 0.5, tintedGlass));
        this.scene.add(Sphere.newSphere(new Vector3(1.5, 1, 0), 1, new SpecularMaterial(Color.hexColor(0x334D5C), 2)));
        this.scene.add(Sphere.newSphere(new Vector3(-1, 1, 2), 1, new SpecularMaterial(Color.hexColor(0xEFC94C), 2)));

        this.cameraSamples = -1;
        this.hitSamples = 1;
        this.bounces = 4;
        this.iterations = 2;
        this.blockIterations = 1;

        this.render(null, this.updatePixelsRect.bind(this));
    }
    updatePixelsRect(rect, pixels:Uint8Array):void {

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

        console.log("OK");

        /*fs.createReadStream('in.png')
            .pipe(new PNG({
                filterType: 4
            }))
            .on('parsed', function() {

                for (var y = 0; y < this.height; y++) {
                    for (var x = 0; x < this.width; x++) {
                        var idx = (this.width * y + x) << 2;

                        // invert color
                        this.data[idx] = 255 - this.data[idx];
                        this.data[idx+1] = 255 - this.data[idx+1];
                        this.data[idx+2] = 255 - this.data[idx+2];

                        // and reduce opacity
                        this.data[idx+3] = this.data[idx+3] >> 1;
                    }
                }

                this.pack().pipe(fs.createWriteStream('out.png'));
            });*/

        //this.ctx.putImageData(this.imageData, 0, 0);
    }
}
