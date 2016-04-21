import {Tree} from "./tree/Tree";
import {Color} from "../math/Color";
import {Shape} from "./shapes/Shape";
import {Scene} from "./Scene";
import {Material} from "./materials/Material";
import {restoreShape} from "./shapes/Shape";
import {SharedTree} from "./tree/SharedTree";
import {ShapeType} from "./shapes/Shape";
import {Mesh} from "./shapes/Mesh";
import {ByteArrayBase} from "../../pointer/ByteArrayBase";
import {Pointer} from "../../pointer/Pointer";
import {DirectMemory} from "../../pointer/DirectMemory";
import {Box} from "./shapes/Box";
/**
 * Created by Nidin Vinayakan on 13/1/2016.
 */
interface TextEncoder {
    new();
    encode(value:string):Uint8Array;
}
export class SharedScene extends Scene {

    sharedTreeMap:SharedTree[];

    constructor(color:Color = new Color(),
                shapes:Shape[] = [],
                lights:Shape[] = [],
                tree:Tree|SharedTree = null,
                rays:number = 0) {
        super(color, shapes, lights, tree, rays);
        this.shared = true;
    }

    /*getDirectMemory():Uint8Array{
     console.time("getDirectMemory");
     //var memorySize:number = this.estimatedMemory + Material.estimatedMemory;
     var memory:Uint8Array = Pointer.init();
     var offset:number = 0;
     //write materials first
     offset = Material.directWrite(memory, offset);

     //write scene
     offset = this.color.directWrite(memory, offset);

     var self = this;
     memory[offset++] = this.shapes.length;
     this.shapes.forEach(function(shape:Shape){
     offset = shape.directWrite(memory, offset);
     });

     console.timeEnd("getDirectMemory");
     return memory;
     }
     static directReadScene(memory:Uint8Array):SharedScene{
     console.time("getScene");
     var scene:Scene = new SharedScene();
     var offset:number = Material.directRestore(memory);

     offset = scene.color.directRead(memory, offset);
     var numShapes:number = memory.readUnsignedInt();

     var shapes:Shape[] = [];

     for (var i = 0; i < numShapes; i++) {
     offset = restoreShape(memory, shapes);
     var shape:Shape = shapes[i];
     scene.add(shape);
     }
     console.timeEnd("getScene");
     return scene;
     }*/

    getMemory():DirectMemory {
        console.time("getMemory");

        Pointer.init();
        var memory:DirectMemory = Pointer.memory;
        //scene flags
        memory.writeByte(0);//pixels are not locked
        memory.writeByte(0);//samples are not locked
        memory.writeByte(0);//scene is not locked

        //write materials first
        Material.write(memory);

        //write scene
        this.color.write(memory);
        memory.writeUnsignedInt(this.shapes.length);
        this.shapes.forEach(function (shape:Shape) {
            shape.write(memory);
        });

        var box = Box.boxForShapes(this.shapes);
        box.write(memory);
        SharedTree.buildAndWrite(memory, this.shapes);

        console.timeEnd("getMemory");
        return memory;
    }

    static getScene(memory:ByteArrayBase|DirectMemory):SharedScene {
        //console.time("getScene");
        var scene:SharedScene = new SharedScene();
        //skip flags
        memory.position = 0;
        memory.position += 3;

        var offset:number = Material.restore(memory);

        scene.color.read(memory);
        var numShapes:number = memory.readUnsignedInt();

        var shapes:Shape[] = [];
        for (var i = 0; i < numShapes; i++) {
            offset = restoreShape(memory, shapes);
            var shape:Shape = shapes[i];
            scene.add(shape);
        }

        var box:Box = new Box();
        box.read(memory);
        scene.tree = SharedTree.readFromMemory(memory, shapes);
        scene.tree.box = box;

        //console.timeEnd("getScene");
        return scene;
    }
}
