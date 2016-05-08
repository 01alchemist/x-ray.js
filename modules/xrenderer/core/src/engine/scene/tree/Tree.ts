import {Box} from "../shapes/Box";
import {Node} from "./Node";
import {Shape} from "../shapes/Shape";
import {Hit} from "../../math/Hit";
import {Ray} from "../../math/Ray";
import {NoHit} from "../../math/Hit";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export class Tree{

    constructor(
        public box:Box,
        public root:Node
    ){

    }
    static newTree(shapes:Shape[], box:Box=null):Tree {
        console.time("Building k-d tree ("+shapes.length+" shapes)... ");
        box = box?box:Box.boxForShapes(shapes);
        var node:Node = Node.newNode(shapes);
        node.split(0);
        console.timeEnd("Building k-d tree ("+shapes.length+" shapes)... ");
        return new Tree(box, node);
    }
    intersect(r:Ray):Hit {
        var t = this.box.intersect(r);
        if(t.max < t.min || t.max <= 0){
            return NoHit;
        }
        return this.root.intersect(r, t.min, t.max);
    }
}
