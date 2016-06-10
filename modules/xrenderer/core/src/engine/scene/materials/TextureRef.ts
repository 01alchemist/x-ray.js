
import {MemoryObject} from "../../../pointer/src/MemoryObject";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export class TextureRef extends MemoryObject {

    source:string;
    width:number;
    height:number;
    data:Float32Array;//viewer for shared array buffer

    constructor(length:number){
        super(length);
    }
    
}
