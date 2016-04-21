import {Vector3} from "../../math/Vector3";
import {Axis} from "../Axis";
import {Triangle} from "./Triangle";
import {Shape} from "./Shape";
import {Ray} from "../../math/Ray";
import {IPointer} from "../../../pointer/IPointer";
import {ByteArrayBase} from "../../../pointer/ByteArrayBase";
import {DirectMemory} from "../../../pointer/DirectMemory";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export class Box implements IPointer {

    static SIZE:number = Vector3.SIZE * 2;

    memorySize:number = Box.SIZE;

    constructor(public min:Vector3 = new Vector3(), public max:Vector3 = new Vector3()) {

    }

    directWrite(memory:Float32Array, offset:number):number {
        offset = this.min.directWrite(memory, offset);
        offset = this.max.directWrite(memory, offset);
        return offset;
    }

    directRead(memory:Float32Array, offset:number):number {
        offset = this.min.directRead(memory, offset);
        offset = this.max.directRead(memory, offset);
        return offset;
    }

    read(memory:ByteArrayBase|DirectMemory):number {
        this.min.read(memory);
        this.max.read(memory);
        return memory.position;
    }

    write(memory:ByteArrayBase|DirectMemory):number {
        this.min.write(memory);
        this.max.write(memory);
        return memory.position;
    }

    static fromJson(box:Box):Box {
        return new Box(
            Vector3.fromJson(box.min),
            Vector3.fromJson(box.max)
        );
    }

    static boxForShapes(shapes:Array<Shape>):Box {
        if (shapes.length == 0) {
            return new Box();
        }
        var box = shapes[0].box;

        shapes.forEach(function (shape:Shape) {
            box = box.extend(shape.box);
        });
        return box;
    }

    static boxForTriangles(shapes:Array<Triangle>):Box {
        if (shapes.length == 0) {
            return new Box();

        }
        var box = shapes[0].box;

        shapes.forEach(function (shape:Triangle) {
            box = box.extend(shape.box);
        });
        return box;
    }

    anchor(anchor:Vector3):Vector3 {
        return this.min.add(this.size().mul(anchor));
    }

    center():Vector3 {
        return this.anchor(new Vector3(0.5, 0.5, 0.5));
    }

    size():Vector3 {
        return this.max.sub(this.min);
    }

    extend(b:Box):Box {
        return new Box(this.min.min(b.min), this.max.max(b.max));
    }

    intersect(r:Ray):any {
        var x1:number = (this.min.x - r.origin.x) / r.direction.x;
        var y1:number = (this.min.y - r.origin.y) / r.direction.y;
        var z1:number = (this.min.z - r.origin.z) / r.direction.z;
        var x2:number = (this.max.x - r.origin.x) / r.direction.x;
        var y2:number = (this.max.y - r.origin.y) / r.direction.y;
        var z2:number = (this.max.z - r.origin.z) / r.direction.z;

        if (x1 > x2) {
            let _x1 = x1;
            x1 = x2;
            x2 = _x1;
        }
        if (y1 > y2) {
            let _y1 = y1;
            y1 = y2;
            y2 = _y1;
        }
        if (z1 > z2) {
            let _z1 = z1;
            z1 = z2;
            z2 = _z1;
        }
        var t1 = Math.max(Math.max(x1, y1), z1);
        var t2 = Math.min(Math.min(x2, y2), z2);
        return {min: t1, max: t2};
    }

    partition(axis:Axis, point:number):{left:boolean, right:boolean} {
        var left:boolean;
        var right:boolean;
        switch (axis) {
            case Axis.AxisX:
                left = this.min.x <= point;
                right = this.max.x >= point;
                break;
            case Axis.AxisY:
                left = this.min.y <= point;
                right = this.max.y >= point;
                break;
            case Axis.AxisZ:
                left = this.min.z <= point;
                right = this.max.z >= point;
                break;
        }
        return {left: left, right: right};
    }

    toString():string {
        return "Box(min:" + this.min.toString() + ", max:" + this.max.toString() + ")";
    }
}

