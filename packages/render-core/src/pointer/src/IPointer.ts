import {ByteArrayBase} from "./ByteArrayBase";
import {DirectMemory} from "./DirectMemory";
/**
 * Created by Nidin Vinayakan on 15/1/2016.
 */
export interface IPointer{

    memorySize:number;
    write(memory:ByteArrayBase|DirectMemory):number;
    directWrite(memory:Uint8Array, offset:number):number;
    read(memory:ByteArrayBase|DirectMemory):number;
    directRead(memory:Uint8Array, offset:number):number;
}