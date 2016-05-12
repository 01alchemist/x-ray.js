import {Color} from "../../math/Color";
import {Vector3} from "../../math/Vector3";
import {ImageLoader} from "../../data/ImageLoader";
import {MathUtils} from "../../utils/MathUtils";
import {RGBA} from "../../math/Color";
import {ByteArrayBase} from "../../../pointer/src/ByteArrayBase";
import {DirectMemory} from "../../../pointer/src/DirectMemory";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export class Texture extends ImageLoader {

    static list:Array<Texture> = [];
    static map:Map<string,number> = new Map<string, number>();

    static getTexture(url:string):Texture {
        var texture:Texture = Texture.list[Texture.map.get(url)];
        if (texture) {
            return texture;
        } else {
            return new Texture(url);
        }
    }

    static setTexture(url:string, texture:Texture) {
        Texture.map.set(url, Texture.list.push(texture) - 1);
        return texture;
    }

    static fromJson(texture:Texture):Texture {
        if (texture) {
            var _texture = new Texture();
            _texture.data = texture.data;
            _texture.pixels = texture.pixels;
            return _texture;
        } else {
            return null;
        }
    }

    private static ctx:CanvasRenderingContext2D;

    index:number;
    sourceFile:string;
    loaded:boolean;
    width:number;
    height:number;
    image:HTMLImageElement;
    data:Color[];
    pixels:number[]|Uint8ClampedArray;

    constructor(url?:string) {
        super();
        try {
            if (importScripts) {
                //i am in a worker
                return;
            }
        } catch (e) {
            //keep silent
        }
        if (!Texture.ctx) {
            var canvas = document.createElement("canvas");
            Texture.ctx = canvas.getContext("2d");
        }
        if (url) {
            this.load(url);
        }
    }

    read(memory:ByteArrayBase|DirectMemory):number {
        this.width = memory.readUnsignedInt();
        this.height = memory.readUnsignedInt();
        this.data = [];
        for (var i:number = 0; i < this.width * this.height; i++) {
            var color = new Color();
            color.read(memory);
            this.data.push(color);
        }

        return memory.position;
    }

    write(memory:ByteArrayBase|DirectMemory):number {
        memory.writeUnsignedInt(this.width);
        memory.writeUnsignedInt(this.height);

        for (var i:number = 0; i < this.width * this.height; i++) {
            this.data[i].write(memory);
        }

        return memory.position;
    }

    sample(u:number, v:number):Color {
        u = MathUtils.fract(MathUtils.fract(u) + 1);
        v = MathUtils.fract(MathUtils.fract(v) + 1);
        v = 1 - v;
        let x = Math.round(u * this.width);
        let y = Math.round(v * this.height);
        return this.data[y * this.width + x];
    }

    normalSample(u:number, v:number):Vector3 {
        let c:Color = this.sample(u, v).pow(1 / 2.2);
        return new Vector3(c.r * 2 - 1, c.g * 2 - 1, c.b * 2 - 1).normalize();
    }

    bumpSample(u:number, v:number):Vector3 {
        u = MathUtils.fract(MathUtils.fract(u) + 1);
        v = MathUtils.fract(MathUtils.fract(v) + 1);
        v = 1 - v;
        let x:number = Math.round(u * this.width);
        let y:number = Math.round(v * this.height);
        let x1:number = MathUtils.clampInt(x - 1, 0, this.width - 1);
        let x2:number = MathUtils.clampInt(x + 1, 0, this.width - 1);
        let y1:number = MathUtils.clampInt(y - 1, 0, this.height - 1);
        let y2:number = MathUtils.clampInt(y + 1, 0, this.height - 1);
        let cx:Color = this.data[y * this.width + x1].sub(this.data[y * this.width + x2]);
        let cy:Color = this.data[y1 * this.width + x].sub(this.data[y2 * this.width + x]);
        return new Vector3(cx.r, cy.r, 0);
    }

    load(url:string, onLoad?:Function, onProgress?:Function, onError?:Function):HTMLImageElement {
        var self = this;
        this.sourceFile = url;
        let texture:Texture = Texture.getTexture(url);

        if (texture) {

            this.index = texture.index;
            this.data = texture.data;
            this.image = texture.image;
            this.pixels = texture.pixels;
            this.sourceFile = texture.sourceFile;

            if (onLoad) {
                onLoad(this.data);
            }

            return this.image;
        }
        Texture.setTexture(url, this);
        return super.load(url, function (image) {
            Texture.ctx.drawImage(image, 0, 0);
            let pixels:Uint8ClampedArray|number[] = Texture.ctx.getImageData(0, 0, image.width, image.height).data;
            if (onLoad) {
                onLoad(pixels);
            }

            self.data = [];

            for (var y:number = 0; y < image.height; y++) {
                for (var x:number = 0; x < image.width; x++) {
                    var pi:number = y * (image.width * 4) + (x * 4);
                    var index:number = y * image.width + x;
                    var rgba:RGBA = {
                        r: pixels[pi],
                        g: pixels[pi + 1],
                        b: pixels[pi + 2],
                        a: pixels[pi + 3],
                    };
                    self.data[index] = Color.newColor(rgba).pow(2.2);
                }
            }

            self.image = image;
            self.width = image.width;
            self.height = image.height;
            self.pixels = pixels;
        }, onProgress, onError);
    }

    static write(memory:ByteArrayBase|DirectMemory):number {
        memory.writeUnsignedInt(Texture.list.length);
        Texture.list.forEach(function (texture:Texture) {
            texture.write(memory);
        });
        return memory.position;
    }


    static restore(memory:ByteArrayBase|DirectMemory):number {
        var numTextures:number = memory.readUnsignedInt();
        for (var i = 0; i < numTextures; i++) {
            new Texture().read(memory);
        }
        console.info(numTextures + " Textures restored");
        return memory.position;
    }
}
