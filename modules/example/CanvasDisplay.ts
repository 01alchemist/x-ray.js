import {GUI} from "./GUI";
import {ThreeJSView} from "./ThreeJSView";
/**
 * Created by Nidin Vinayakan on 11-01-2016.
 */
export abstract class CanvasDisplay{

    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
    imageData:ImageData;
    data:Uint8ClampedArray|number[];

    constructor(public i_width:number = 640, public i_height:number = 480, public container:HTMLElement) {

        this.canvas = <HTMLCanvasElement>document.createElement("canvas");
        this.canvas.id = "giImageOutput";

        this.canvas.style.backgroundColor = "#3C3C3C";
        this.canvas.style.position = "absolute";

        this.canvas.width = this.i_width;
        this.canvas.height = this.i_height;

        this.container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");

        this.imageData = this.ctx.getImageData(0, 0, this.i_width, this.i_height);
        this.data = this.imageData.data;

    }

    setResolution(width:number,height:number):void {
        this.i_width = width;
        this.i_height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    updatePixels(pixels:Uint8ClampedArray):void {

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
        this.ctx.putImageData(this.imageData, 0, 0);
    }

    updatePixelsRect(rect, pixels:Uint8ClampedArray):void {

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
        this.ctx.putImageData(this.imageData, 0, 0);
    }
}
