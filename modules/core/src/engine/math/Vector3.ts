import {ByteArrayBase} from "../../pointer/ByteArrayBase";
import {DirectMemory} from "../../pointer/DirectMemory";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */

export class Vector3 {

    static SIZE:number = 3;
    static NullVector:Vector3 = new Vector3(DirectMemory.MIN_FLOAT32_VALUE,DirectMemory.MIN_FLOAT32_VALUE,DirectMemory.MIN_FLOAT32_VALUE);
    memorySize:number = Vector3.SIZE;

    constructor(public x:number = 0, public y:number = 0, public z:number = 0) {

    }

    static fromJson(v:Vector3):Vector3 {
        if(v){
            return new Vector3(v.x, v.y, v.z);
        }else{
            return null;
        }
    }

    setFromArray(a, offset:number=0){
        this.x = a[offset];
        this.y = a[offset+1];
        this.z = a[offset+2];
    }

    setFromJson(a):void {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    dot(b:Vector3) {
        return this.x * b.x + this.y * b.y + this.z * b.z
    }

    cross(b:Vector3):Vector3 {
        let x = this.y * b.z - this.z * b.y;
        let y = this.z * b.x - this.x * b.z;
        let z = this.x * b.y - this.y * b.x;
        return new Vector3(x, y, z);
    }

    normalize():Vector3 {
        let d = this.length();
        return new Vector3(this.x / d, this.y / d, this.z / d);
    }

    add(b:Vector3):Vector3 {
        return new Vector3(this.x + b.x, this.y + b.y, this.z + b.z);
    }

    sub(b:Vector3):Vector3 {
        return new Vector3(this.x - b.x, this.y - b.y, this.z - b.z);
    }

    mul(b:Vector3):Vector3 {
        return new Vector3(this.x * b.x, this.y * b.y, this.z * b.z);
    }

    div(b:Vector3):Vector3 {
        return new Vector3(this.x / b.x, this.y / b.y, this.z / b.z);
    }

    mulScalar(b):Vector3 {
        return new Vector3(this.x * b, this.y * b, this.z * b);
    }

    divScalar(b):Vector3 {
        return new Vector3(this.x / b, this.y / b, this.z / b);
    }

    min(b:Vector3):Vector3 {
        return new Vector3(Math.min(this.x, b.x), Math.min(this.y, b.y), Math.min(this.z, b.z));
    }

    max(b:Vector3):Vector3 {
        return new Vector3(Math.max(this.x, b.x), Math.max(this.y, b.y), Math.max(this.z, b.z));
    }

    minAxis():Vector3 {
        let x = Math.abs(this.x);
        let y = Math.abs(this.y);
        let z = Math.abs(this.z);
        if (x <= y && x <= z) {
            return new Vector3(1, 0, 0);
        } else if (y <= x && y <= z) {
            return new Vector3(0, 1, 0);
        }
        return new Vector3(0, 0, 1);
    }

    minComponent() {
        return Math.min(Math.min(this.x, this.y), this.z)
    }

    reflect(i:Vector3):Vector3 {
        return i.sub(this.mulScalar(2 * this.dot(i)))
    }

    refract(i:Vector3, n1, n2):Vector3 {
        let nr = n1 / n2;
        let cosI = -this.dot(i);
        let sinT2 = nr * nr * (1 - cosI * cosI);
        if (sinT2 > 1) {
            return new Vector3();
        }
        let cosT = Math.sqrt(1 - sinT2);
        return i.mulScalar(nr).add(this.mulScalar(nr * cosI - cosT));
    }

    reflectance(i:Vector3, n1, n2) {
        let nr = n1 / n2;
        let cosI = -this.dot(i);
        let sinT2 = nr * nr * (1 - cosI * cosI);
        if (sinT2 > 1) {
            return 1
        }
        let cosT = Math.sqrt(1 - sinT2);
        let rOrth = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
        let rPar = (n2 * cosI - n1 * cosT) / (n2 * cosI + n1 * cosT);
        return (rOrth * rOrth + rPar * rPar) / 2;
    }

    toString():string {
        return "(" + this.x + "," + this.y + "," + this.z + ")";
    }

    equals(v:Vector3):Boolean {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    isZero():Boolean {
        return this.x == 0 && this.y == 0 && this.z == 0;
    }

    directWrite(memory:Float32Array, offset:number):number {
        memory[offset++] = this.x;
        memory[offset++] = this.y;
        memory[offset++] = this.z;
        return offset;
    }

    directRead(memory:Float32Array, offset:number):number {
        this.x = memory[offset++];
        this.y = memory[offset++];
        this.z = memory[offset++];
        return offset;
    }

    read(memory:ByteArrayBase|DirectMemory):number {
        this.x = memory.readFloat();
        this.y = memory.readFloat();
        this.z = memory.readFloat();
        return memory.position;
    }

    write(memory:ByteArrayBase|DirectMemory):number {
        memory.writeFloat(this.x);
        memory.writeFloat(this.y);
        memory.writeFloat(this.z);
        return memory.position;
    }

    isNullVector():boolean {
        return this.x == DirectMemory.MIN_FLOAT32_VALUE &&
            this.y == DirectMemory.MIN_FLOAT32_VALUE &&
            this.z == DirectMemory.MIN_FLOAT32_VALUE
    }
}