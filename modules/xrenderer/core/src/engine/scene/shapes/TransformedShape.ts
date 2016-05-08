import {Box} from "./Box";
import {Hit} from "../../math/Hit";
import {Ray} from "../../math/Ray";
import {Vector3} from "../../math/Vector3";
import {Material} from "../materials/Material";
import {Color} from "../../math/Color";
import {Shape, ShapeType, ShapesfromJson, directRestoreShape, ShapefromJson, restoreShape} from "./Shape";
import {ByteArrayBase} from "../../../pointer/src/ByteArrayBase";
import {DirectMemory} from "../../../pointer/src/DirectMemory";
import {Matrix4} from "../../math/Matrix4";
import {HitInfo} from "../../math/HitInfo";
/**
 * Created by Nidin Vinayakan on 11-01-2016.
 */
export class TransformedShape implements Shape {

    type:ShapeType = ShapeType.TRANSFORMED_SHAPE;
    index:number;

    get memorySize():number {
        if (this.shape) {
            return this.shape.memorySize + Matrix4.SIZE + 1;// store only one matrix
        } else {
            return 0;
        }
    };

    constructor(public shape:Shape = null,
                public matrix:Matrix4 = new Matrix4(),
                public inverse:Matrix4 = new Matrix4(),
                public normalMatrix?:THREE.Matrix3) {
    }

    directRead(memory:Float32Array, offset:number):number {
        offset = this.matrix.directRead(memory, offset);
        this.inverse = this.matrix.inverse();
        var container:Shape[] = [];
        offset = directRestoreShape(memory, offset, container);
        this.shape = container[0];
        container = null;
        return offset;
    }

    directWrite(memory:Float32Array, offset:number):number {
        memory[offset++] = this.type;
        offset = this.matrix.directWrite(memory, offset);
        offset = this.shape.directWrite(memory, offset);
        return offset;
    }

    read(memory:ByteArrayBase|DirectMemory):number {
        this.matrix.read(memory);
        this.inverse = this.matrix.inverse();
        var container:Shape[] = [];
        restoreShape(memory, container);
        this.shape = container[0];
        container = null;
        return memory.position;
    }

    write(memory:ByteArrayBase|DirectMemory):number {
        memory.writeByte(this.type);
        this.matrix.write(memory);
        this.shape.write(memory);
        return memory.position;
    }

    static fromJson(transformedShape:TransformedShape):TransformedShape {
        return new TransformedShape(
            ShapefromJson(transformedShape.shape),
            Matrix4.fromJson(<Matrix4>transformedShape.matrix),
            Matrix4.fromJson(<Matrix4>transformedShape.inverse)
        );
    }

    static newTransformedShape(s:Shape, m:Matrix4):Shape {
        return new TransformedShape(s, m, m.inverse());
    }

    get box():Box {
        return this.matrix.mulBox(this.shape.box);
    }

    compile() {
        this.shape.compile();
    }

    intersect(r:Ray):Hit {

        var shapeRay:Ray = this.inverse.mulRay(r);
        var hit:Hit = this.shape.intersect(shapeRay);
        if(!hit.ok()) {
            return hit
        }
        var shape = hit.shape;
        var shapePosition = shapeRay.position(hit.T);
        var shapeNormal = shape.getNormal(shapePosition);
        var position = this.matrix.mulPosition(shapePosition);
        var normal = this.inverse.transpose().mulDirection(shapeNormal);
        var color = shape.getColor(shapePosition);
        var material = shape.getMaterial(shapePosition);
        var inside = false;
        if(shapeNormal.dot(shapeRay.direction) > 0){
            normal = normal.mulScalar(-1);
            inside = true
        }
        var ray = new Ray(position, normal);
        var info = new HitInfo(shape, position, normal, ray, color, material, inside);
        hit.T = position.sub(r.origin).length();
        hit.info = info;
        return hit;
    }

    getColor(p:Vector3):Color {
        return this.shape.getColor(this.inverse.mulPosition(p));
    }

    getMaterial(p:Vector3):Material {
        return this.shape.getMaterial(this.inverse.mulPosition(p));
    }

    getNormal(p:Vector3):Vector3 {
        console.log("getNormal");
        return null;
        //return this.matrix.mulDirection(this.shape.getNormal(this.inverse.mulPosition(p)));
    }

    getRandomPoint():Vector3 {
        return this.shape.getRandomPoint();
        //return this.matrix.mulPosition(this.shape.getRandomPoint());
    }

}
