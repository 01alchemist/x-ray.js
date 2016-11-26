import {Box} from "./Box";
import {Hit} from "../../math/Hit";
import {Color} from "../../math/Color";
import {Material} from "../materials/Material";
import {Vector3} from "../../math/Vector3";
import {Ray} from "../../math/Ray";
import {Cube} from "./Cube";
import {Sphere} from "./Sphere";
import {Mesh} from "./Mesh";
import {Triangle} from "./Triangle";
import {TransformedShape} from "./TransformedShape";
import {IPointer} from "../../../pointer/src/IPointer";
import {ByteArrayBase} from "../../../pointer/src/ByteArrayBase";
import {DirectMemory} from "../../../pointer/src/DirectMemory";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export enum ShapeType{
    TRIANGLE,
    CUBE,
    SPHERE,
    MESH,
    TRANSFORMED_SHAPE
}
export interface Shape extends IPointer{

    index:number;
    /*id:number;*/
    type:ShapeType;
    box:Box;
    compile();
    intersect(r:Ray):Hit;
    getColor(p:Vector3):Color;
    getMaterial(p:Vector3):Material;
    getNormal(p:Vector3):Vector3;
    getRandomPoint():Vector3;
    directWrite(memory:Uint8Array, offset:number):number;
}
export function ShapesfromJson(shapes:Shape[]):Shape[] {
    var _shapes:Shape[] = [];
    shapes.forEach(function (shape:Shape) {

        switch (shape.type) {
            case ShapeType.CUBE:
                _shapes.push(Cube.fromJson(<Cube>shape));
                break;
            case ShapeType.SPHERE:
                _shapes.push(Sphere.fromJson(<Sphere>shape));
                break;
            case ShapeType.MESH:
                _shapes.push(Mesh.fromJson(<Mesh>shape));
                break;
            case ShapeType.TRANSFORMED_SHAPE:
                _shapes.push(TransformedShape.fromJson(<TransformedShape>shape));
                break;
            case ShapeType.TRIANGLE:
                _shapes.push(<Triangle>Triangle.fromJson(<Triangle>shape));
                break;
        }

    });
    return _shapes;
}
export function ShapefromJson(shape:Shape):Shape {
    switch (shape.type) {
        case ShapeType.CUBE:
            return Cube.fromJson(<Cube>shape);
        case ShapeType.SPHERE:
            return Sphere.fromJson(<Sphere>shape);
        case ShapeType.MESH:
            return Mesh.fromJson(<Mesh>shape);
        case ShapeType.TRANSFORMED_SHAPE:
            return TransformedShape.fromJson(<TransformedShape>shape);
        case ShapeType.TRIANGLE:
            return <Triangle>Triangle.fromJson(<Triangle>shape);
    }
}
export function directRestoreShape(memory:Float32Array, offset:number, container:Shape[]):number {
    var type:ShapeType = memory[offset++];
    switch (type) {
        case ShapeType.CUBE:
            var cube = new Cube();
            container.push(cube);
            return cube.directRead(memory, offset);
        case ShapeType.SPHERE:
            var sphere = new Sphere();
            container.push(sphere);
            return sphere.directRead(memory, offset);
        case ShapeType.MESH:
            var mesh = new Mesh();
            container.push(mesh);
            return mesh.directRead(memory, offset);
        case ShapeType.TRANSFORMED_SHAPE:
            var shape = new TransformedShape();
            container.push(shape);
            return shape.directRead(memory, offset);
       /* case ShapeType.TRIANGLE:
            var triangle = new Triangle();
            container.push(triangle);
            return triangle.directRead(memory, offset);*/
    }
}
export function restoreShape(memory:ByteArrayBase|DirectMemory, container:Shape[]):number {
    var type:ShapeType = memory.readByte();
    switch (type) {
        case ShapeType.CUBE:
            var cube = new Cube();
            container.push(cube);
            return cube.read(memory);
        case ShapeType.SPHERE:
            var sphere = new Sphere();
            container.push(sphere);
            return sphere.read(memory);
        case ShapeType.MESH:
            var mesh = new Mesh();
            container.push(mesh);
            return mesh.read(memory);
        case ShapeType.TRANSFORMED_SHAPE:
            var shape = new TransformedShape();
            container.push(shape);
            return shape.read(memory);

        /*case ShapeType.TRIANGLE:
            var triangle = new Triangle();
            container.push(triangle);
            return triangle.read(memory);*/
    }
}