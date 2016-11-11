System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MemoryUtils;
    return {
        setters:[],
        execute: function() {
            MemoryUtils = (function () {
                function MemoryUtils() {
                }
                MemoryUtils.readUint16 = function (memory, offset, littleEndian) {
                    if (littleEndian === void 0) { littleEndian = false; }
                    var mem = MemoryUtils.ui16mem;
                    if (littleEndian) {
                        mem[0] = memory[offset++];
                        mem[1] = memory[offset];
                    }
                    else {
                        mem[1] = memory[offset++];
                        mem[0] = memory[offset];
                    }
                    return MemoryUtils.ui16[0];
                };
                MemoryUtils.writeUint16 = function (memory, offset, value, littleEndian) {
                    if (littleEndian === void 0) { littleEndian = false; }
                    MemoryUtils.ui16[0] = value;
                    var mem = MemoryUtils.ui16mem;
                    if (littleEndian) {
                        memory[offset++] = mem[0];
                        memory[offset++] = mem[1];
                    }
                    else {
                        memory[offset++] = mem[1];
                        memory[offset++] = mem[0];
                    }
                    return offset;
                };
                MemoryUtils.readInt16 = function (memory, offset, littleEndian) {
                    if (littleEndian === void 0) { littleEndian = false; }
                    var mem = MemoryUtils.i16mem;
                    if (littleEndian) {
                        mem[0] = memory[offset++];
                        mem[1] = memory[offset];
                    }
                    else {
                        mem[1] = memory[offset++];
                        mem[0] = memory[offset];
                    }
                    return MemoryUtils.i16[0];
                };
                MemoryUtils.writeInt16 = function (memory, offset, value, littleEndian) {
                    if (littleEndian === void 0) { littleEndian = false; }
                    MemoryUtils.i16[0] = value;
                    var mem = MemoryUtils.i16mem;
                    if (littleEndian) {
                        memory[offset++] = mem[0];
                        memory[offset++] = mem[1];
                    }
                    else {
                        memory[offset++] = mem[1];
                        memory[offset++] = mem[0];
                    }
                    return offset;
                };
                MemoryUtils.readInt32 = function (memory, offset, littleEndian) {
                    if (littleEndian === void 0) { littleEndian = false; }
                    var mem = MemoryUtils.i32mem;
                    if (littleEndian) {
                        mem[0] = memory[offset++];
                        mem[1] = memory[offset++];
                        mem[2] = memory[offset++];
                        mem[3] = memory[offset];
                    }
                    else {
                        mem[3] = memory[offset++];
                        mem[2] = memory[offset++];
                        mem[1] = memory[offset++];
                        mem[0] = memory[offset];
                    }
                    return MemoryUtils.i32[0];
                };
                MemoryUtils.writeInt32 = function (memory, offset, value, littleEndian) {
                    if (littleEndian === void 0) { littleEndian = false; }
                    MemoryUtils.i32[0] = value;
                    var mem = MemoryUtils.i32mem;
                    if (littleEndian) {
                        memory[offset++] = mem[0];
                        memory[offset++] = mem[1];
                        memory[offset++] = mem[2];
                        memory[offset++] = mem[3];
                    }
                    else {
                        memory[offset++] = mem[3];
                        memory[offset++] = mem[2];
                        memory[offset++] = mem[1];
                        memory[offset++] = mem[0];
                    }
                    return offset;
                };
                MemoryUtils.readUint32 = function (memory, offset, littleEndian) {
                    if (littleEndian === void 0) { littleEndian = false; }
                    var mem = MemoryUtils.ui32mem;
                    if (littleEndian) {
                        mem[0] = memory[offset++];
                        mem[1] = memory[offset++];
                        mem[2] = memory[offset++];
                        mem[3] = memory[offset];
                    }
                    else {
                        mem[3] = memory[offset++];
                        mem[2] = memory[offset++];
                        mem[1] = memory[offset++];
                        mem[0] = memory[offset];
                    }
                    return MemoryUtils.ui32[0];
                };
                MemoryUtils.writeUint32 = function (memory, offset, value, littleEndian) {
                    if (littleEndian === void 0) { littleEndian = false; }
                    MemoryUtils.ui32[0] = value;
                    var mem = MemoryUtils.ui32mem;
                    if (littleEndian) {
                        memory[offset++] = mem[0];
                        memory[offset++] = mem[1];
                        memory[offset++] = mem[2];
                        memory[offset++] = mem[3];
                    }
                    else {
                        memory[offset++] = mem[3];
                        memory[offset++] = mem[2];
                        memory[offset++] = mem[1];
                        memory[offset++] = mem[0];
                    }
                    return offset;
                };
                MemoryUtils.readFloat32 = function (memory, offset, littleEndian) {
                    if (littleEndian === void 0) { littleEndian = false; }
                    var mem = MemoryUtils.f32mem;
                    if (littleEndian) {
                        mem[0] = memory[offset++];
                        mem[1] = memory[offset++];
                        mem[2] = memory[offset++];
                        mem[3] = memory[offset];
                    }
                    else {
                        mem[3] = memory[offset++];
                        mem[2] = memory[offset++];
                        mem[1] = memory[offset++];
                        mem[0] = memory[offset];
                    }
                    return MemoryUtils.f32[0];
                };
                MemoryUtils.writeFloat32 = function (memory, offset, value, littleEndian) {
                    if (littleEndian === void 0) { littleEndian = false; }
                    MemoryUtils.f32[0] = value;
                    var mem = MemoryUtils.f32mem;
                    if (littleEndian) {
                        memory[offset++] = mem[0];
                        memory[offset++] = mem[1];
                        memory[offset++] = mem[2];
                        memory[offset++] = mem[3];
                    }
                    else {
                        memory[offset++] = mem[3];
                        memory[offset++] = mem[2];
                        memory[offset++] = mem[1];
                        memory[offset++] = mem[0];
                    }
                    return offset;
                };
                MemoryUtils.readFloat64 = function (memory, offset, littleEndian) {
                    if (littleEndian === void 0) { littleEndian = false; }
                    var mem = MemoryUtils.f64mem;
                    if (littleEndian) {
                        mem[0] = memory[offset++];
                        mem[1] = memory[offset++];
                        mem[2] = memory[offset++];
                        mem[3] = memory[offset++];
                        mem[4] = memory[offset++];
                        mem[5] = memory[offset++];
                        mem[6] = memory[offset++];
                        mem[7] = memory[offset];
                    }
                    else {
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
                };
                MemoryUtils.writeFloat64 = function (memory, offset, value, littleEndian) {
                    if (littleEndian === void 0) { littleEndian = false; }
                    MemoryUtils.f64[0] = value;
                    var mem = MemoryUtils.f64mem;
                    if (littleEndian) {
                        memory[offset++] = mem[0];
                        memory[offset++] = mem[1];
                        memory[offset++] = mem[2];
                        memory[offset++] = mem[3];
                        memory[offset++] = mem[4];
                        memory[offset++] = mem[5];
                        memory[offset++] = mem[6];
                        memory[offset++] = mem[7];
                    }
                    else {
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
                };
                MemoryUtils.i8 = new Int8Array(1);
                MemoryUtils.ui16 = new Uint16Array(1);
                MemoryUtils.ui32 = new Uint32Array(1);
                MemoryUtils.i32 = new Int32Array(1);
                MemoryUtils.i16 = new Int16Array(1);
                MemoryUtils.f32 = new Float32Array(1);
                MemoryUtils.f64 = new Float64Array(1);
                MemoryUtils.ui32mem = new Uint8Array(MemoryUtils.ui32.buffer);
                MemoryUtils.ui16mem = new Uint8Array(MemoryUtils.ui16.buffer);
                MemoryUtils.i32mem = new Uint8Array(MemoryUtils.i32.buffer);
                MemoryUtils.i16mem = new Uint8Array(MemoryUtils.i16.buffer);
                MemoryUtils.f32mem = new Uint8Array(MemoryUtils.f32.buffer);
                MemoryUtils.f64mem = new Uint8Array(MemoryUtils.f64.buffer);
                return MemoryUtils;
            }());
            exports_1("MemoryUtils", MemoryUtils);
        }
    }
});
//# sourceMappingURL=MemoryUtils.js.map