import {ByteArrayBase} from "./ByteArrayBase";
import {DirectMemory} from "./DirectMemory";
/**
 * Created by Nidin Vinayakan on 10/6/2016.
 */
export class MemoryObject {

    protected heap32:DirectMemory|ByteArrayBase;
    public pointer:number = null;

    constructor(public length:number) {

    }
}