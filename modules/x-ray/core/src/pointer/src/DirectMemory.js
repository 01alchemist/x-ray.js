System.register(["./MemoryUtils", "./UTF8"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MemoryUtils_1, UTF8_1;
    var DirectMemory;
    return {
        setters:[
            function (MemoryUtils_1_1) {
                MemoryUtils_1 = MemoryUtils_1_1;
            },
            function (UTF8_1_1) {
                UTF8_1 = UTF8_1_1;
            }],
        execute: function() {
            DirectMemory = (function () {
                function DirectMemory(buffer, offset, length) {
                    if (offset === void 0) { offset = 0; }
                    if (length === void 0) { length = 0; }
                    this.buffer = buffer;
                    this.offset = offset;
                    this.BUFFER_EXT_SIZE = 32 * 1024 * 1024;
                    if (buffer == undefined) {
                        buffer = new ArrayBuffer(this.BUFFER_EXT_SIZE);
                        this.write_position = 0;
                    }
                    else if (buffer == null) {
                        this.write_position = 0;
                    }
                    else {
                        this.write_position = length > 0 ? length : buffer.byteLength;
                    }
                    if (buffer) {
                        this.data = new Uint8Array(buffer, offset, length > 0 ? length : buffer.byteLength);
                    }
                    this._position = 0;
                    this.endian = DirectMemory.BIG_ENDIAN;
                }
                Object.defineProperty(DirectMemory.prototype, "phyPosition", {
                    get: function () {
                        return this._position + this.data.byteOffset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DirectMemory.prototype, "bufferOffset", {
                    get: function () {
                        return this.data.byteOffset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DirectMemory.prototype, "position", {
                    get: function () {
                        return this._position;
                    },
                    set: function (value) {
                        if (this._position < value) {
                            if (!this.validate(this._position - value)) {
                                return;
                            }
                        }
                        this._position = value;
                        this.write_position = value > this.write_position ? value : this.write_position;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DirectMemory.prototype, "length", {
                    get: function () {
                        return this.write_position;
                    },
                    set: function (value) {
                        this.validateBuffer(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(DirectMemory.prototype, "bytesAvailable", {
                    get: function () {
                        return this.data.byteLength - this._position;
                    },
                    enumerable: true,
                    configurable: true
                });
                DirectMemory.prototype.clear = function () {
                    this._position = 0;
                };
                DirectMemory.prototype.setBuffer = function (buffer, offset, length) {
                    if (offset === void 0) { offset = 0; }
                    if (length === void 0) { length = 0; }
                    if (buffer) {
                        this.data = new Uint8Array(buffer, offset, length > 0 ? length : buffer.byteLength);
                        this.write_position = length > 0 ? length : buffer.byteLength;
                    }
                    else {
                        this.write_position = 0;
                    }
                    this._position = 0;
                };
                DirectMemory.prototype.readBoolean = function () {
                    if (!this.validate(DirectMemory.SIZE_OF_BOOLEAN))
                        return null;
                    return this.data[this.position++] != 0;
                };
                DirectMemory.prototype.readByte = function () {
                    if (!this.validate(DirectMemory.SIZE_OF_INT8))
                        return null;
                    return this.data[this.position++];
                };
                DirectMemory.prototype.readBytes = function (_bytes, offset, length, createNewBuffer) {
                    if (_bytes === void 0) { _bytes = null; }
                    if (offset === void 0) { offset = 0; }
                    if (length === void 0) { length = 0; }
                    if (createNewBuffer === void 0) { createNewBuffer = false; }
                    if (length == 0) {
                        length = this.bytesAvailable;
                    }
                    else if (!this.validate(length))
                        return null;
                    if (createNewBuffer) {
                        _bytes = _bytes == null ? new DirectMemory(new ArrayBuffer(length)) : _bytes;
                        for (var i = 0; i < length; i++) {
                            _bytes.data[i + offset] = this.data[this.position++];
                        }
                    }
                    else {
                        _bytes = _bytes == null ? new DirectMemory(null) : _bytes;
                        _bytes.setBuffer(this.data.buffer, this.bufferOffset + this.position, length);
                        this.position += length;
                    }
                    return _bytes;
                };
                DirectMemory.prototype.readDouble = function () {
                    if (!this.validate(DirectMemory.SIZE_OF_FLOAT64))
                        return null;
                    var value = MemoryUtils_1.MemoryUtils.readFloat64(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_FLOAT64;
                    return value;
                };
                DirectMemory.prototype.readFloat = function () {
                    if (!this.validate(DirectMemory.SIZE_OF_FLOAT32))
                        return null;
                    var value = MemoryUtils_1.MemoryUtils.readFloat32(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_FLOAT32;
                    return value;
                };
                DirectMemory.prototype.readInt = function () {
                    if (!this.validate(DirectMemory.SIZE_OF_INT32))
                        return null;
                    var value = MemoryUtils_1.MemoryUtils.readInt32(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_INT32;
                    return value;
                };
                DirectMemory.prototype.readMultiByte = function (length, charSet) {
                    if (!this.validate(length))
                        return null;
                    throw "readMultiByte: Not Implemented!";
                };
                DirectMemory.prototype.readShort = function () {
                    if (!this.validate(DirectMemory.SIZE_OF_INT16))
                        return null;
                    var value = MemoryUtils_1.MemoryUtils.readInt16(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_INT16;
                    return value;
                };
                DirectMemory.prototype.readUnsignedByte = function () {
                    if (!this.validate(DirectMemory.SIZE_OF_UINT8))
                        return null;
                    return this.data[this.position++];
                };
                DirectMemory.prototype.readUnsignedInt = function () {
                    if (!this.validate(DirectMemory.SIZE_OF_UINT32))
                        return null;
                    var value = MemoryUtils_1.MemoryUtils.readUint32(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_UINT32;
                    return value;
                };
                DirectMemory.prototype.readVariableSizedUnsignedInt = function () {
                    var value;
                    var c = this.readUnsignedByte();
                    if (c != 0xFF) {
                        value = c << 8;
                        c = this.readUnsignedByte();
                        value |= c;
                    }
                    else {
                        c = this.readUnsignedByte();
                        value = c << 16;
                        c = this.readUnsignedByte();
                        value |= c << 8;
                        c = this.readUnsignedByte();
                        value |= c;
                    }
                    return value;
                };
                DirectMemory.prototype.readU16VX = function () {
                    return (this.readUnsignedByte() << 8) | this.readUnsignedByte();
                };
                DirectMemory.prototype.readUnsignedShort = function () {
                    if (!this.validate(DirectMemory.SIZE_OF_UINT16))
                        return null;
                    var value = MemoryUtils_1.MemoryUtils.readUint16(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_UINT16;
                    return value;
                };
                DirectMemory.prototype.readUTF = function () {
                    if (!this.validate(DirectMemory.SIZE_OF_UINT16))
                        return null;
                    var length = MemoryUtils_1.MemoryUtils.readUint16(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_UINT16;
                    if (length > 0) {
                        return this.readUTFBytes(length);
                    }
                    else {
                        return "";
                    }
                };
                DirectMemory.prototype.readUTFBytes = function (length) {
                    if (!this.validate(length))
                        return null;
                    var _bytes = new Uint8Array(this.buffer, this.bufferOffset + this.position, length);
                    this.position += length;
                    return UTF8_1.UTF8.decode(_bytes);
                };
                DirectMemory.prototype.readStandardString = function (length) {
                    if (!this.validate(length))
                        return null;
                    var str = "";
                    for (var i = 0; i < length; i++) {
                        str += String.fromCharCode(this.data[this.position++]);
                    }
                    return str;
                };
                DirectMemory.prototype.readStringTillNull = function (keepEvenByte) {
                    if (keepEvenByte === void 0) { keepEvenByte = true; }
                    var str = "";
                    var num = 0;
                    while (this.bytesAvailable > 0) {
                        var _byte = this.data[this.position++];
                        num++;
                        if (_byte != 0) {
                            str += String.fromCharCode(_byte);
                        }
                        else {
                            if (keepEvenByte && num % 2 != 0) {
                                this.position++;
                            }
                            break;
                        }
                    }
                    return str;
                };
                DirectMemory.prototype.writeBoolean = function (value) {
                    this.validateBuffer(DirectMemory.SIZE_OF_BOOLEAN);
                    this.data[this.position++] = value ? 1 : 0;
                };
                DirectMemory.prototype.writeByte = function (value) {
                    this.validateBuffer(DirectMemory.SIZE_OF_INT8);
                    this.data[this.position++] = value;
                };
                DirectMemory.prototype.writeUnsignedByte = function (value) {
                    this.validateBuffer(DirectMemory.SIZE_OF_UINT8);
                    this.data[this.position++] = value;
                };
                DirectMemory.prototype.writeBytes = function (_bytes, offset, length) {
                    if (offset === void 0) { offset = 0; }
                    if (length === void 0) { length = 0; }
                    this.validateBuffer(length);
                    length = length > 0 ? length : _bytes.length;
                    var tmp_data = new Uint8Array(_bytes.buffer, offset, length);
                    for (var i = 0; i < length; i++) {
                        this.data[offset + this.position++] = tmp_data[i];
                    }
                };
                DirectMemory.prototype.writeDouble = function (value) {
                    this.validateBuffer(DirectMemory.SIZE_OF_FLOAT64);
                    MemoryUtils_1.MemoryUtils.writeFloat64(this.data, this.position, value, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_FLOAT64;
                };
                DirectMemory.prototype.writeFloat = function (value) {
                    this.validateBuffer(DirectMemory.SIZE_OF_FLOAT32);
                    MemoryUtils_1.MemoryUtils.writeFloat32(this.data, this.position, value, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_FLOAT32;
                };
                DirectMemory.prototype.writeInt = function (value) {
                    this.validateBuffer(DirectMemory.SIZE_OF_INT32);
                    MemoryUtils_1.MemoryUtils.writeInt32(this.data, this.position, value, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_INT32;
                };
                DirectMemory.prototype.writeMultiByte = function (value, charSet) {
                };
                DirectMemory.prototype.writeShort = function (value) {
                    this.validateBuffer(DirectMemory.SIZE_OF_INT16);
                    MemoryUtils_1.MemoryUtils.writeInt16(this.data, this.position, value, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_INT16;
                };
                DirectMemory.prototype.writeUnsignedShort = function (value) {
                    this.validateBuffer(DirectMemory.SIZE_OF_UINT16);
                    MemoryUtils_1.MemoryUtils.writeUint16(this.data, this.position, value, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_UINT16;
                };
                DirectMemory.prototype.writeUnsignedInt = function (value) {
                    this.validateBuffer(DirectMemory.SIZE_OF_UINT32);
                    MemoryUtils_1.MemoryUtils.writeUint32(this.data, this.position, value, this.endian == DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_UINT32;
                };
                DirectMemory.prototype.writeUTF = function (value) {
                    var utf8bytes = UTF8_1.UTF8.encode(value);
                    var length = utf8bytes.length;
                    this.validateBuffer(DirectMemory.SIZE_OF_UINT16 + length);
                    MemoryUtils_1.MemoryUtils.writeUint16(this.data, this.position, length, this.endian === DirectMemory.LITTLE_ENDIAN);
                    this.position += DirectMemory.SIZE_OF_UINT16;
                    this.writeUint8Array(utf8bytes);
                };
                DirectMemory.prototype.writeUTFBytes = function (value) {
                    this.writeUint8Array(UTF8_1.UTF8.encode(value));
                };
                DirectMemory.prototype.toString = function () {
                    return "[DirectMemory] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
                };
                DirectMemory.prototype.writeUint8Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        this.data[this.position++] = _bytes[i];
                    }
                };
                DirectMemory.prototype.writeUint16Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        MemoryUtils_1.MemoryUtils.writeUint16(this.data, this.position, _bytes[i], this.endian === DirectMemory.LITTLE_ENDIAN);
                        this.position += DirectMemory.SIZE_OF_UINT16;
                    }
                };
                DirectMemory.prototype.writeUint32Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        MemoryUtils_1.MemoryUtils.writeUint32(this.data, this.position, _bytes[i], this.endian === DirectMemory.LITTLE_ENDIAN);
                        this.position += DirectMemory.SIZE_OF_UINT32;
                    }
                };
                DirectMemory.prototype.writeInt8Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        this.data[this.position++] = _bytes[i];
                    }
                };
                DirectMemory.prototype.writeInt16Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        MemoryUtils_1.MemoryUtils.writeInt16(this.data, this.position, _bytes[i], this.endian === DirectMemory.LITTLE_ENDIAN);
                        this.position += DirectMemory.SIZE_OF_INT16;
                    }
                };
                DirectMemory.prototype.writeInt32Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        MemoryUtils_1.MemoryUtils.writeInt32(this.data, this.position, _bytes[i], this.endian === DirectMemory.LITTLE_ENDIAN);
                        this.position += DirectMemory.SIZE_OF_INT32;
                    }
                };
                DirectMemory.prototype.writeFloat32Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        MemoryUtils_1.MemoryUtils.writeFloat32(this.data, this.position, _bytes[i], this.endian === DirectMemory.LITTLE_ENDIAN);
                        this.position += DirectMemory.SIZE_OF_FLOAT32;
                    }
                };
                DirectMemory.prototype.writeFloat64Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        MemoryUtils_1.MemoryUtils.writeFloat64(this.data, this.position, _bytes[i], this.endian === DirectMemory.LITTLE_ENDIAN);
                        this.position += DirectMemory.SIZE_OF_FLOAT64;
                    }
                };
                DirectMemory.prototype.readUint8Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    if (!this.validate(length))
                        return null;
                    if (!createNewBuffer) {
                        var result = new Uint8Array(this.buffer, this.bufferOffset + this.position, length);
                        this.position += length;
                    }
                    else {
                        result = new Uint8Array(new ArrayBuffer(length));
                        for (var i = 0; i < length; i++) {
                            result[i] = this.data[this.position];
                            this.position += DirectMemory.SIZE_OF_UINT8;
                        }
                    }
                    return result;
                };
                DirectMemory.prototype.readUint16Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    var size = length * DirectMemory.SIZE_OF_UINT16;
                    if (!this.validate(size))
                        return null;
                    if (!createNewBuffer) {
                        var result = new Uint16Array(this.buffer, this.bufferOffset + this.position, length);
                        this.position += size;
                    }
                    else {
                        result = new Uint16Array(new ArrayBuffer(size));
                        for (var i = 0; i < length; i++) {
                            result[i] = MemoryUtils_1.MemoryUtils.readUint16(this.data, this.position, this.endian === DirectMemory.LITTLE_ENDIAN);
                            this.position += DirectMemory.SIZE_OF_UINT16;
                        }
                    }
                    return result;
                };
                DirectMemory.prototype.readUint32Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    var size = length * DirectMemory.SIZE_OF_UINT32;
                    if (!this.validate(size))
                        return null;
                    if (!createNewBuffer) {
                        var result = new Uint32Array(this.buffer, this.bufferOffset + this.position, length);
                        this.position += size;
                    }
                    else {
                        result = new Uint32Array(new ArrayBuffer(size));
                        for (var i = 0; i < length; i++) {
                            result[i] = MemoryUtils_1.MemoryUtils.readUint32(this.data, this.position, this.endian === DirectMemory.LITTLE_ENDIAN);
                            this.position += DirectMemory.SIZE_OF_UINT32;
                        }
                    }
                    return result;
                };
                DirectMemory.prototype.readInt8Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    if (!this.validate(length))
                        return null;
                    if (!createNewBuffer) {
                        var result = new Int8Array(this.buffer, this.bufferOffset + this.position, length);
                        this.position += length;
                    }
                    else {
                        result = new Int8Array(new ArrayBuffer(length));
                        for (var i = 0; i < length; i++) {
                            result[i] = this.data[this.position];
                            this.position += DirectMemory.SIZE_OF_INT8;
                        }
                    }
                    return result;
                };
                DirectMemory.prototype.readInt16Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    var size = length * DirectMemory.SIZE_OF_INT16;
                    if (!this.validate(size))
                        return null;
                    if (!createNewBuffer) {
                        var result = new Int16Array(this.buffer, this.bufferOffset + this.position, length);
                        this.position += size;
                    }
                    else {
                        result = new Int16Array(new ArrayBuffer(size));
                        for (var i = 0; i < length; i++) {
                            result[i] = MemoryUtils_1.MemoryUtils.readInt16(this.data, this.position, this.endian === DirectMemory.LITTLE_ENDIAN);
                            this.position += DirectMemory.SIZE_OF_INT16;
                        }
                    }
                    return result;
                };
                DirectMemory.prototype.readInt32Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    var size = length * DirectMemory.SIZE_OF_INT32;
                    if (!this.validate(size))
                        return null;
                    if (!createNewBuffer) {
                        if ((this.bufferOffset + this.position) % 4 == 0) {
                            var result = new Int32Array(this.buffer, this.bufferOffset + this.position, length);
                            this.position += size;
                        }
                        else {
                            var tmp = new Uint8Array(new ArrayBuffer(size));
                            for (var i = 0; i < size; i++) {
                                tmp[i] = this.data[this.position];
                                this.position += DirectMemory.SIZE_OF_UINT8;
                            }
                            result = new Int32Array(tmp.buffer);
                        }
                    }
                    else {
                        result = new Int32Array(new ArrayBuffer(size));
                        for (var i = 0; i < length; i++) {
                            result[i] = MemoryUtils_1.MemoryUtils.readInt32(this.data, this.position, this.endian === DirectMemory.LITTLE_ENDIAN);
                            this.position += DirectMemory.SIZE_OF_INT32;
                        }
                    }
                    return result;
                };
                DirectMemory.prototype.readFloat32Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    var size = length * DirectMemory.SIZE_OF_FLOAT32;
                    if (!this.validate(size))
                        return null;
                    if (!createNewBuffer) {
                        if ((this.bufferOffset + this.position) % 4 == 0) {
                            var result = new Float32Array(this.buffer, this.bufferOffset + this.position, length);
                            this.position += size;
                        }
                        else {
                            var tmp = new Uint8Array(new ArrayBuffer(size));
                            for (var i = 0; i < size; i++) {
                                tmp[i] = this.data[this.position];
                                this.position += DirectMemory.SIZE_OF_UINT8;
                            }
                            result = new Float32Array(tmp.buffer);
                        }
                    }
                    else {
                        result = new Float32Array(new ArrayBuffer(size));
                        for (var i = 0; i < length; i++) {
                            result[i] = MemoryUtils_1.MemoryUtils.readFloat32(this.data, this.position, this.endian === DirectMemory.LITTLE_ENDIAN);
                            this.position += DirectMemory.SIZE_OF_FLOAT32;
                        }
                    }
                    return result;
                };
                DirectMemory.prototype.readFloat64Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    var size = length * DirectMemory.SIZE_OF_FLOAT64;
                    if (!this.validate(size))
                        return null;
                    if (!createNewBuffer) {
                        var result = new Float64Array(this.buffer, this.position, length);
                        this.position += size;
                    }
                    else {
                        result = new Float64Array(new ArrayBuffer(size));
                        for (var i = 0; i < length; i++) {
                            result[i] = MemoryUtils_1.MemoryUtils.readFloat64(this.data, this.position, this.endian === DirectMemory.LITTLE_ENDIAN);
                            this.position += DirectMemory.SIZE_OF_FLOAT64;
                        }
                    }
                    return result;
                };
                DirectMemory.prototype.validate = function (len) {
                    if (this.data.byteLength > 0 && this._position + len <= this.data.byteLength) {
                        return true;
                    }
                    else {
                        throw "Error #2030: End of file was encountered";
                    }
                };
                DirectMemory.prototype.validateBuffer = function (len) {
                    this.write_position = len > this.write_position ? len : this.write_position;
                    if (this.data.byteLength < len) {
                        var tmp = new Uint8Array(new SharedArrayBuffer(len + this.BUFFER_EXT_SIZE));
                        tmp.set(new Uint8Array(this.data.buffer));
                        this.data.buffer = tmp.buffer;
                    }
                };
                DirectMemory.BIG_ENDIAN = "bigEndian";
                DirectMemory.LITTLE_ENDIAN = "littleEndian";
                DirectMemory.MIN_FLOAT32_VALUE = 1.1754943508222875e-38;
                DirectMemory.SIZE_OF_BOOLEAN = 1;
                DirectMemory.SIZE_OF_INT8 = 1;
                DirectMemory.SIZE_OF_INT16 = 2;
                DirectMemory.SIZE_OF_INT32 = 4;
                DirectMemory.SIZE_OF_INT64 = 8;
                DirectMemory.SIZE_OF_UINT8 = 1;
                DirectMemory.SIZE_OF_UINT16 = 2;
                DirectMemory.SIZE_OF_UINT32 = 4;
                DirectMemory.SIZE_OF_UINT64 = 8;
                DirectMemory.SIZE_OF_FLOAT32 = 4;
                DirectMemory.SIZE_OF_FLOAT64 = 8;
                return DirectMemory;
            }());
            exports_1("DirectMemory", DirectMemory);
        }
    }
});
//# sourceMappingURL=DirectMemory.js.map