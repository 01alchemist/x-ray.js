import {IPointer} from "./IPointer";
import {ByteArrayBase} from "./ByteArrayBase";
import {DirectMemory} from "./DirectMemory";
/**
 * Created by Nidin Vinayakan on 15/1/2016.
 * C Like pointer to keep objects in shared memory
 * This class is highly experimental
 */
export class Pointer{

    static offset:number;
    static heap:Uint8Array;
    //static memory:ByteArrayBase; //DataView expects ArrayBuffer not SharedArrayBuffer wait for the implementation
    static memory:DirectMemory;
    /*static get memory():Uint8Array{
        return Pointer.heap;
    }*/
    static initialized:boolean;
    static init(){
        if(Pointer.initialized){
            return;
        }
        var maxMemory:number = 64 * 1024 * 1024;//64MB
        Pointer.heap = new Uint8Array(new SharedArrayBuffer(maxMemory));
        //Pointer.memory = new ByteArrayBase(Pointer.heap.buffer);
        Pointer.memory = new DirectMemory(Pointer.heap.buffer);
        Pointer.initialized = true;
        return Pointer.memory;
    }


    private beginLocation:number;
    private currentLocation:number;

    constructor(private reference:IPointer){
        if(!Pointer.heap){
            Pointer.init();
        }
        this.beginLocation = Pointer.offset;
        this.currentLocation = Pointer.offset;
        Pointer.offset = reference.write(Pointer.memory);
    }
    read():IPointer{
        Pointer.offset = this.reference.read(Pointer.memory);
        return this.reference;
    }
}
export function sizeof(ptr:IPointer):number{
    return ptr.memorySize;
}