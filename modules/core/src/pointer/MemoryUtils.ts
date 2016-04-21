export class MemoryUtils {

    static i8:Int8Array = new Int8Array(1);
    static ui16:Uint16Array = new Uint16Array(1);
    static ui32:Uint32Array = new Uint32Array(1);
    static i32:Int32Array = new Int32Array(1);
    static i16:Int16Array = new Int16Array(1);
    static f32:Float32Array = new Float32Array(1);
    static f64:Float64Array = new Float64Array(1);
    static ui32mem:Uint8Array = new Uint8Array(MemoryUtils.ui32.buffer);
    static ui16mem:Uint8Array = new Uint8Array(MemoryUtils.ui16.buffer);
    static i32mem:Uint8Array = new Uint8Array(MemoryUtils.i32.buffer);
    static i16mem:Uint8Array = new Uint8Array(MemoryUtils.i16.buffer);
    static f32mem:Uint8Array = new Uint8Array(MemoryUtils.f32.buffer);
    static f64mem:Uint8Array = new Uint8Array(MemoryUtils.f64.buffer);

    static readUint16(memory:Uint8Array, offset:number, littleEndian:boolean = false):number {

        var mem = MemoryUtils.ui16mem;

        if (littleEndian) {

            //default endian is little
            mem[0] = memory[offset++];
            mem[1] = memory[offset];

        } else {

            mem[1] = memory[offset++];
            mem[0] = memory[offset];
        }

        return MemoryUtils.ui16[0];
    }

    static writeUint16(memory:Uint8Array, offset:number, value:number, littleEndian:boolean = false):number {

        MemoryUtils.ui16[0] = value;
        var mem = MemoryUtils.ui16mem;

        if (littleEndian) {

            //default endian is little
            memory[offset++] = mem[0];
            memory[offset++] = mem[1];

        } else {

            memory[offset++] = mem[1];
            memory[offset++] = mem[0];
        }

        return offset;
    }

    static readInt16(memory:Uint8Array, offset:number, littleEndian:boolean = false):number {

        var mem = MemoryUtils.i16mem;

        if (littleEndian) {

            //default endian is little
            mem[0] = memory[offset++];
            mem[1] = memory[offset];

        } else {

            mem[1] = memory[offset++];
            mem[0] = memory[offset];
        }

        return MemoryUtils.i16[0];
    }

    static writeInt16(memory:Uint8Array, offset:number, value:number, littleEndian:boolean = false):number {

        MemoryUtils.i16[0] = value;
        var mem = MemoryUtils.i16mem;

        if (littleEndian) {

            //default endian is little
            memory[offset++] = mem[0];
            memory[offset++] = mem[1];

        } else {

            memory[offset++] = mem[1];
            memory[offset++] = mem[0];
        }

        return offset;
    }

    static readInt32(memory:Uint8Array, offset:number, littleEndian:boolean = false):number {

        var mem = MemoryUtils.i32mem;

        if (littleEndian) {

            //default endian is little
            mem[0] = memory[offset++];
            mem[1] = memory[offset++];
            mem[2] = memory[offset++];
            mem[3] = memory[offset];

        } else {

            mem[3] = memory[offset++];
            mem[2] = memory[offset++];
            mem[1] = memory[offset++];
            mem[0] = memory[offset];
        }

        return MemoryUtils.i32[0];
    }

    static writeInt32(memory:Uint8Array, offset:number, value:number, littleEndian:boolean = false):number {

        MemoryUtils.i32[0] = value;
        var mem = MemoryUtils.i32mem;

        if (littleEndian) {

            //default endian is little
            memory[offset++] = mem[0];
            memory[offset++] = mem[1];
            memory[offset++] = mem[2];
            memory[offset++] = mem[3];

        } else {

            memory[offset++] = mem[3];
            memory[offset++] = mem[2];
            memory[offset++] = mem[1];
            memory[offset++] = mem[0];
        }

        return offset;
    }

    static readUint32(memory:Uint8Array, offset:number, littleEndian:boolean = false):number {

        var mem = MemoryUtils.ui32mem;

        if (littleEndian) {

            //default endian is little
            mem[0] = memory[offset++];
            mem[1] = memory[offset++];
            mem[2] = memory[offset++];
            mem[3] = memory[offset];

        } else {

            mem[3] = memory[offset++];
            mem[2] = memory[offset++];
            mem[1] = memory[offset++];
            mem[0] = memory[offset];
        }

        return MemoryUtils.ui32[0];
    }

    static writeUint32(memory:Uint8Array, offset:number, value:number, littleEndian:boolean = false):number {

        MemoryUtils.ui32[0] = value;
        var mem = MemoryUtils.ui32mem;

        if (littleEndian) {

            //default endian is little
            memory[offset++] = mem[0];
            memory[offset++] = mem[1];
            memory[offset++] = mem[2];
            memory[offset++] = mem[3];

        } else {

            memory[offset++] = mem[3];
            memory[offset++] = mem[2];
            memory[offset++] = mem[1];
            memory[offset++] = mem[0];
        }

        return offset;
    }

    static readFloat32(memory:Uint8Array, offset:number, littleEndian:boolean = false):number {

        var mem = MemoryUtils.f32mem;

        if (littleEndian) {

            //default endian is little
            mem[0] = memory[offset++];
            mem[1] = memory[offset++];
            mem[2] = memory[offset++];
            mem[3] = memory[offset];

        } else {

            mem[3] = memory[offset++];
            mem[2] = memory[offset++];
            mem[1] = memory[offset++];
            mem[0] = memory[offset];
        }

        return MemoryUtils.f32[0];
    }

    static writeFloat32(memory:Uint8Array, offset:number, value:number, littleEndian:boolean = false):number {

        MemoryUtils.f32[0] = value;
        var mem = MemoryUtils.f32mem;

        if (littleEndian) {

            //default endian is little
            memory[offset++] = mem[0];
            memory[offset++] = mem[1];
            memory[offset++] = mem[2];
            memory[offset++] = mem[3];

        } else {

            memory[offset++] = mem[3];
            memory[offset++] = mem[2];
            memory[offset++] = mem[1];
            memory[offset++] = mem[0];
        }

        return offset;
    }

    static readFloat64(memory:Uint8Array, offset:number, littleEndian:boolean = false):number {

        var mem = MemoryUtils.f64mem;

        if (littleEndian) {

            //default endian is little
            mem[0] = memory[offset++];
            mem[1] = memory[offset++];
            mem[2] = memory[offset++];
            mem[3] = memory[offset++];

            mem[4] = memory[offset++];
            mem[5] = memory[offset++];
            mem[6] = memory[offset++];
            mem[7] = memory[offset];

        } else {

            mem[7] = memory[offset++];
            mem[6] = memory[offset++];
            mem[5] = memory[offset++];
            mem[4] = memory[offset++];

            mem[3] = memory[offset++];
            mem[2] = memory[offset++];
            mem[1] = memory[offset++];
            mem[0] = memory[offset];
        }

        return MemoryUtils.f64[0];
    }

    static writeFloat64(memory:Uint8Array, offset:number, value:number, littleEndian:boolean = false):number {

        MemoryUtils.f64[0] = value;
        var mem = MemoryUtils.f64mem;

        if (littleEndian) {

            //default endian in TypedArray is little
            memory[offset++] = mem[0];
            memory[offset++] = mem[1];
            memory[offset++] = mem[2];
            memory[offset++] = mem[3];

            memory[offset++] = mem[4];
            memory[offset++] = mem[5];
            memory[offset++] = mem[6];
            memory[offset++] = mem[7];

        } else {

            memory[offset++] = mem[7];
            memory[offset++] = mem[6];
            memory[offset++] = mem[5];
            memory[offset++] = mem[4];

            memory[offset++] = mem[3];
            memory[offset++] = mem[2];
            memory[offset++] = mem[1];
            memory[offset++] = mem[0];
        }

        return offset;
    }
}