import {Vector3} from "./Vector3";
import {ByteArrayBase} from "../../pointer/ByteArrayBase";
import {DirectMemory} from "../../pointer/DirectMemory";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */

export interface RGBA {
    r:number,
    g:number,
    b:number,
    a:number
}
export class Color {

    static SIZE:number = 3;

    constructor(public r:number = 0,
                public g:number = 0,
                public b:number = 0) {
    }

    directWrite(mem:Float32Array, offset:number):number {
        mem[offset++] = this.r;
        mem[offset++] = this.g;
        mem[offset++] = this.b;
        return offset;
    }

    directRead(mem:Float32Array, offset:number):number {
        this.r = mem[offset++];
        this.g = mem[offset++];
        this.b = mem[offset++];
        return offset;
    }

    read(memory:ByteArrayBase|DirectMemory):number {
        this.r = memory.readFloat();
        this.g = memory.readFloat();
        this.b = memory.readFloat();
        return memory.position;
    }
    write(memory:ByteArrayBase|DirectMemory):number {
        memory.writeFloat(this.r);
        memory.writeFloat(this.g);
        memory.writeFloat(this.b);
        return memory.position;
    }

    static fromJson(color:Color):Color {
        if (color) {
            return new Color(
                color.r,
                color.g,
                color.b
            );
        } else {
            return null;
        }
    }

    static hexColor(hex:number):Color {
        var red = ((hex >> 16) & 255 ) / 255;
        var green = ((hex >> 8) & 255) / 255;
        var blue = (hex & 255) / 255;
        return new Color(red, green, blue).pow(2.2);
    }

    static newColor(c:RGBA):Color {
        return new Color(c.r / 65535, c.g / 65535, c.b / 65535);
    }

    RGBA():RGBA {
        let a:Color = this;
        let _c:Uint8Array = new Uint8Array(3);
        _c[0] = Math.max(0, Math.min(255, a.r * 255));
        _c[1] = Math.max(0, Math.min(255, a.g * 255));
        _c[2] = Math.max(0, Math.min(255, a.b * 255));
        return {r: _c[0], g: _c[1], b: _c[2], a: 255};
    }

    add(b:Color):Color {
        return new Color(this.r + b.r, this.g + b.g, this.b + b.b);
    }

    sub(b:Color):Color {
        return new Color(this.r - b.r, this.g - b.g, this.b - b.b);
    }

    mul(b:Color):Color {
        return new Color(this.r * b.r, this.g * b.g, this.b * b.b);
    }

    mulScalar(b:number):Color {
        return new Color(this.r * b, this.g * b, this.b * b)
    }

    divScalar(b:number):Color {
        return new Color(this.r / b, this.g / b, this.b / b);
    }

    min(b:Color):Color {
        return new Color(Math.min(this.r, b.r), Math.min(this.g, b.g), Math.min(this.b, b.b));
    }

    max(b:Color):Color {
        return new Color(Math.max(this.r, b.r), Math.max(this.g, b.g), Math.max(this.b, b.b));
    }

    pow(b:number):Color {
        return new Color(Math.pow(this.r, b), Math.pow(this.g, b), Math.pow(this.b, b));
    }

    mix(b:Color, pct:number):Color {
        let a = this.mulScalar(1 - pct);
        b = b.mulScalar(pct);
        return a.add(b);
    }

    clone():Color {
        return new Color(
            this.r,
            this.g,
            this.b
        );
    }
}
