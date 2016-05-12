var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("core/src/pointer/src/ByteArrayBase", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ByteArrayBase;
    return {
        setters:[],
        execute: function() {
            ByteArrayBase = (function () {
                function ByteArrayBase(buffer, offset, length) {
                    if (offset === void 0) { offset = 0; }
                    if (length === void 0) { length = 0; }
                    this.BUFFER_EXT_SIZE = 1024;
                    this.array = null;
                    this.EOF_byte = -1;
                    this.EOF_code_point = -1;
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
                        this.data = new DataView(buffer, offset, length > 0 ? length : buffer.byteLength);
                    }
                    this._position = 0;
                    this.endian = ByteArrayBase.BIG_ENDIAN;
                }
                Object.defineProperty(ByteArrayBase.prototype, "buffer", {
                    get: function () {
                        return this.data.buffer;
                    },
                    set: function (value) {
                        this.data = new DataView(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ByteArrayBase.prototype, "dataView", {
                    get: function () {
                        return this.data;
                    },
                    set: function (value) {
                        this.data = value;
                        this.write_position = value.byteLength;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ByteArrayBase.prototype, "phyPosition", {
                    get: function () {
                        return this._position + this.data.byteOffset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ByteArrayBase.prototype, "bufferOffset", {
                    get: function () {
                        return this.data.byteOffset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ByteArrayBase.prototype, "position", {
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
                Object.defineProperty(ByteArrayBase.prototype, "length", {
                    get: function () {
                        return this.write_position;
                    },
                    set: function (value) {
                        this.validateBuffer(value);
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ByteArrayBase.prototype, "bytesAvailable", {
                    get: function () {
                        return this.data.byteLength - this._position;
                    },
                    enumerable: true,
                    configurable: true
                });
                ByteArrayBase.prototype.clear = function () {
                    this._position = 0;
                };
                ByteArrayBase.prototype.getArray = function () {
                    if (this.array == null) {
                        this.array = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength);
                    }
                    return this.array;
                };
                ByteArrayBase.prototype.setArray = function (array) {
                    this.array = array;
                    this.setBuffer(array.buffer, array.byteOffset, array.byteLength);
                };
                ByteArrayBase.prototype.setBuffer = function (buffer, offset, length) {
                    if (offset === void 0) { offset = 0; }
                    if (length === void 0) { length = 0; }
                    if (buffer) {
                        this.data = new DataView(buffer, offset, length > 0 ? length : buffer.byteLength);
                        this.write_position = length > 0 ? length : buffer.byteLength;
                    }
                    else {
                        this.write_position = 0;
                    }
                    this._position = 0;
                };
                ByteArrayBase.prototype.readBoolean = function () {
                    if (!this.validate(ByteArrayBase.SIZE_OF_BOOLEAN))
                        return null;
                    return this.data.getUint8(this.position++) != 0;
                };
                ByteArrayBase.prototype.readByte = function () {
                    if (!this.validate(ByteArrayBase.SIZE_OF_INT8))
                        return null;
                    return this.data.getInt8(this.position++);
                };
                ByteArrayBase.prototype.readBytes = function (_bytes, offset, length, createNewBuffer) {
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
                        _bytes = _bytes == null ? new ByteArrayBase(new ArrayBuffer(length)) : _bytes;
                        for (var i = 0; i < length; i++) {
                            _bytes.data.setUint8(i + offset, this.data.getUint8(this.position++));
                        }
                    }
                    else {
                        _bytes = _bytes == null ? new ByteArrayBase(null) : _bytes;
                        _bytes.dataView = new DataView(this.data.buffer, this.bufferOffset + this.position, length);
                        this.position += length;
                    }
                    return _bytes;
                };
                ByteArrayBase.prototype.readDouble = function () {
                    if (!this.validate(ByteArrayBase.SIZE_OF_FLOAT64))
                        return null;
                    var value = this.data.getFloat64(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_FLOAT64;
                    return value;
                };
                ByteArrayBase.prototype.readFloat = function () {
                    if (!this.validate(ByteArrayBase.SIZE_OF_FLOAT32))
                        return null;
                    var value = this.data.getFloat32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_FLOAT32;
                    return value;
                };
                ByteArrayBase.prototype.readInt = function () {
                    if (!this.validate(ByteArrayBase.SIZE_OF_INT32))
                        return null;
                    var value = this.data.getInt32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_INT32;
                    return value;
                };
                ByteArrayBase.prototype.readMultiByte = function (length, charSet) {
                    if (!this.validate(length))
                        return null;
                    return "";
                };
                ByteArrayBase.prototype.readShort = function () {
                    if (!this.validate(ByteArrayBase.SIZE_OF_INT16))
                        return null;
                    var value = this.data.getInt16(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_INT16;
                    return value;
                };
                ByteArrayBase.prototype.readUnsignedByte = function () {
                    if (!this.validate(ByteArrayBase.SIZE_OF_UINT8))
                        return null;
                    return this.data.getUint8(this.position++);
                };
                ByteArrayBase.prototype.readUnsignedInt = function () {
                    if (!this.validate(ByteArrayBase.SIZE_OF_UINT32))
                        return null;
                    var value = this.data.getUint32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_UINT32;
                    return value;
                };
                ByteArrayBase.prototype.readVariableSizedUnsignedInt = function () {
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
                ByteArrayBase.prototype.readU16VX = function () {
                    return (this.readUnsignedByte() << 8) | this.readUnsignedByte();
                };
                ByteArrayBase.prototype.readUnsignedShort = function () {
                    if (!this.validate(ByteArrayBase.SIZE_OF_UINT16))
                        return null;
                    var value = this.data.getUint16(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_UINT16;
                    return value;
                };
                ByteArrayBase.prototype.readUTF = function () {
                    if (!this.validate(ByteArrayBase.SIZE_OF_UINT16))
                        return null;
                    var length = this.data.getUint16(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_UINT16;
                    if (length > 0) {
                        return this.readUTFBytes(length);
                    }
                    else {
                        return "";
                    }
                };
                ByteArrayBase.prototype.readUTFBytes = function (length) {
                    if (!this.validate(length))
                        return null;
                    var _bytes = new Uint8Array(this.buffer, this.bufferOffset + this.position, length);
                    this.position += length;
                    return this.decodeUTF8(_bytes);
                };
                ByteArrayBase.prototype.readStandardString = function (length) {
                    if (!this.validate(length))
                        return null;
                    var str = "";
                    for (var i = 0; i < length; i++) {
                        str += String.fromCharCode(this.data.getUint8(this.position++));
                    }
                    return str;
                };
                ByteArrayBase.prototype.readStringTillNull = function (keepEvenByte) {
                    if (keepEvenByte === void 0) { keepEvenByte = true; }
                    var str = "";
                    var num = 0;
                    while (this.bytesAvailable > 0) {
                        var _byte = this.data.getUint8(this.position++);
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
                ByteArrayBase.prototype.writeBoolean = function (value) {
                    this.validateBuffer(ByteArrayBase.SIZE_OF_BOOLEAN);
                    this.data.setUint8(this.position++, value ? 1 : 0);
                };
                ByteArrayBase.prototype.writeByte = function (value) {
                    this.validateBuffer(ByteArrayBase.SIZE_OF_INT8);
                    this.data.setInt8(this.position++, value);
                };
                ByteArrayBase.prototype.writeUnsignedByte = function (value) {
                    this.validateBuffer(ByteArrayBase.SIZE_OF_UINT8);
                    this.data.setUint8(this.position++, value);
                };
                ByteArrayBase.prototype.writeBytes = function (_bytes, offset, length) {
                    if (offset === void 0) { offset = 0; }
                    if (length === void 0) { length = 0; }
                    this.validateBuffer(length);
                    var tmp_data = new DataView(_bytes.buffer);
                    for (var i = 0; i < _bytes.length; i++) {
                        this.data.setUint8(this.position++, tmp_data.getUint8(i));
                    }
                };
                ByteArrayBase.prototype.writeDouble = function (value) {
                    this.validateBuffer(ByteArrayBase.SIZE_OF_FLOAT64);
                    this.data.setFloat64(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_FLOAT64;
                };
                ByteArrayBase.prototype.writeFloat = function (value) {
                    this.validateBuffer(ByteArrayBase.SIZE_OF_FLOAT32);
                    this.data.setFloat32(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_FLOAT32;
                };
                ByteArrayBase.prototype.writeInt = function (value) {
                    this.validateBuffer(ByteArrayBase.SIZE_OF_INT32);
                    this.data.setInt32(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_INT32;
                };
                ByteArrayBase.prototype.writeMultiByte = function (value, charSet) {
                };
                ByteArrayBase.prototype.writeShort = function (value) {
                    this.validateBuffer(ByteArrayBase.SIZE_OF_INT16);
                    this.data.setInt16(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_INT16;
                };
                ByteArrayBase.prototype.writeUnsignedShort = function (value) {
                    this.validateBuffer(ByteArrayBase.SIZE_OF_UINT16);
                    this.data.setUint16(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_UINT16;
                };
                ByteArrayBase.prototype.writeUnsignedInt = function (value) {
                    this.validateBuffer(ByteArrayBase.SIZE_OF_UINT32);
                    this.data.setUint32(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_UINT32;
                };
                ByteArrayBase.prototype.writeUTF = function (value) {
                    var utf8bytes = this.encodeUTF8(value);
                    var length = utf8bytes.length;
                    this.validateBuffer(ByteArrayBase.SIZE_OF_UINT16 + length);
                    this.data.setUint16(this.position, length, this.endian === ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_UINT16;
                    this.writeUint8Array(utf8bytes);
                };
                ByteArrayBase.prototype.writeUTFBytes = function (value) {
                    this.writeUint8Array(this.encodeUTF8(value));
                };
                ByteArrayBase.prototype.toString = function () {
                    return "[ByteArrayBase] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
                };
                ByteArrayBase.prototype.writeUint8Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        this.data.setUint8(this.position++, _bytes[i]);
                    }
                };
                ByteArrayBase.prototype.writeUint16Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        this.data.setUint16(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
                        this.position += ByteArrayBase.SIZE_OF_UINT16;
                    }
                };
                ByteArrayBase.prototype.writeUint32Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        this.data.setUint32(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
                        this.position += ByteArrayBase.SIZE_OF_UINT32;
                    }
                };
                ByteArrayBase.prototype.writeInt8Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        this.data.setInt8(this.position++, _bytes[i]);
                    }
                };
                ByteArrayBase.prototype.writeInt16Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        this.data.setInt16(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
                        this.position += ByteArrayBase.SIZE_OF_INT16;
                    }
                };
                ByteArrayBase.prototype.writeInt32Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        this.data.setInt32(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
                        this.position += ByteArrayBase.SIZE_OF_INT32;
                    }
                };
                ByteArrayBase.prototype.writeFloat32Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        this.data.setFloat32(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
                        this.position += ByteArrayBase.SIZE_OF_FLOAT32;
                    }
                };
                ByteArrayBase.prototype.writeFloat64Array = function (_bytes) {
                    this.validateBuffer(this.position + _bytes.length);
                    for (var i = 0; i < _bytes.length; i++) {
                        this.data.setFloat64(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
                        this.position += ByteArrayBase.SIZE_OF_FLOAT64;
                    }
                };
                ByteArrayBase.prototype.readUint8Array = function (length, createNewBuffer) {
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
                            result[i] = this.data.getUint8(this.position);
                            this.position += ByteArrayBase.SIZE_OF_UINT8;
                        }
                    }
                    return result;
                };
                ByteArrayBase.prototype.readUint16Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    var size = length * ByteArrayBase.SIZE_OF_UINT16;
                    if (!this.validate(size))
                        return null;
                    if (!createNewBuffer) {
                        var result = new Uint16Array(this.buffer, this.bufferOffset + this.position, length);
                        this.position += size;
                    }
                    else {
                        result = new Uint16Array(new ArrayBuffer(size));
                        for (var i = 0; i < length; i++) {
                            result[i] = this.data.getUint16(this.position, this.endian === ByteArrayBase.LITTLE_ENDIAN);
                            this.position += ByteArrayBase.SIZE_OF_UINT16;
                        }
                    }
                    return result;
                };
                ByteArrayBase.prototype.readUint32Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    var size = length * ByteArrayBase.SIZE_OF_UINT32;
                    if (!this.validate(size))
                        return null;
                    if (!createNewBuffer) {
                        var result = new Uint32Array(this.buffer, this.bufferOffset + this.position, length);
                        this.position += size;
                    }
                    else {
                        result = new Uint32Array(new ArrayBuffer(size));
                        for (var i = 0; i < length; i++) {
                            result[i] = this.data.getUint32(this.position, this.endian === ByteArrayBase.LITTLE_ENDIAN);
                            this.position += ByteArrayBase.SIZE_OF_UINT32;
                        }
                    }
                    return result;
                };
                ByteArrayBase.prototype.readInt8Array = function (length, createNewBuffer) {
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
                            result[i] = this.data.getInt8(this.position);
                            this.position += ByteArrayBase.SIZE_OF_INT8;
                        }
                    }
                    return result;
                };
                ByteArrayBase.prototype.readInt16Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    var size = length * ByteArrayBase.SIZE_OF_INT16;
                    if (!this.validate(size))
                        return null;
                    if (!createNewBuffer) {
                        var result = new Int16Array(this.buffer, this.bufferOffset + this.position, length);
                        this.position += size;
                    }
                    else {
                        result = new Int16Array(new ArrayBuffer(size));
                        for (var i = 0; i < length; i++) {
                            result[i] = this.data.getInt16(this.position, this.endian === ByteArrayBase.LITTLE_ENDIAN);
                            this.position += ByteArrayBase.SIZE_OF_INT16;
                        }
                    }
                    return result;
                };
                ByteArrayBase.prototype.readInt32Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    var size = length * ByteArrayBase.SIZE_OF_INT32;
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
                                tmp[i] = this.data.getUint8(this.position);
                                this.position += ByteArrayBase.SIZE_OF_UINT8;
                            }
                            result = new Int32Array(tmp.buffer);
                        }
                    }
                    else {
                        result = new Int32Array(new ArrayBuffer(size));
                        for (var i = 0; i < length; i++) {
                            result[i] = this.data.getInt32(this.position, this.endian === ByteArrayBase.LITTLE_ENDIAN);
                            this.position += ByteArrayBase.SIZE_OF_INT32;
                        }
                    }
                    return result;
                };
                ByteArrayBase.prototype.readFloat32Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    var size = length * ByteArrayBase.SIZE_OF_FLOAT32;
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
                                tmp[i] = this.data.getUint8(this.position);
                                this.position += ByteArrayBase.SIZE_OF_UINT8;
                            }
                            result = new Float32Array(tmp.buffer);
                        }
                    }
                    else {
                        result = new Float32Array(new ArrayBuffer(size));
                        for (var i = 0; i < length; i++) {
                            result[i] = this.data.getFloat32(this.position, this.endian === ByteArrayBase.LITTLE_ENDIAN);
                            this.position += ByteArrayBase.SIZE_OF_FLOAT32;
                        }
                    }
                    return result;
                };
                ByteArrayBase.prototype.readFloat64Array = function (length, createNewBuffer) {
                    if (createNewBuffer === void 0) { createNewBuffer = true; }
                    var size = length * ByteArrayBase.SIZE_OF_FLOAT64;
                    if (!this.validate(size))
                        return null;
                    if (!createNewBuffer) {
                        var result = new Float64Array(this.buffer, this.position, length);
                        this.position += size;
                    }
                    else {
                        result = new Float64Array(new ArrayBuffer(size));
                        for (var i = 0; i < length; i++) {
                            result[i] = this.data.getFloat64(this.position, this.endian === ByteArrayBase.LITTLE_ENDIAN);
                            this.position += ByteArrayBase.SIZE_OF_FLOAT64;
                        }
                    }
                    return result;
                };
                ByteArrayBase.prototype.validate = function (len) {
                    if (this.data.byteLength > 0 && this._position + len <= this.data.byteLength) {
                        return true;
                    }
                    else {
                        throw 'Error #2030: End of file was encountered.';
                    }
                };
                ByteArrayBase.prototype.validateBuffer = function (len) {
                    this.write_position = len > this.write_position ? len : this.write_position;
                    if (this.data.byteLength < len) {
                        var tmp = new Uint8Array(new ArrayBuffer(len + this.BUFFER_EXT_SIZE));
                        tmp.set(new Uint8Array(this.data.buffer));
                        this.data.buffer = tmp.buffer;
                    }
                };
                ByteArrayBase.prototype.encodeUTF8 = function (str) {
                    var pos = 0;
                    var codePoints = this.stringToCodePoints(str);
                    var outputBytes = [];
                    while (codePoints.length > pos) {
                        var code_point = codePoints[pos++];
                        if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                            this.encoderError(code_point);
                        }
                        else if (this.inRange(code_point, 0x0000, 0x007f)) {
                            outputBytes.push(code_point);
                        }
                        else {
                            var count, offset;
                            if (this.inRange(code_point, 0x0080, 0x07FF)) {
                                count = 1;
                                offset = 0xC0;
                            }
                            else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                                count = 2;
                                offset = 0xE0;
                            }
                            else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                                count = 3;
                                offset = 0xF0;
                            }
                            outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                            while (count > 0) {
                                var temp = this.div(code_point, Math.pow(64, count - 1));
                                outputBytes.push(0x80 + (temp % 64));
                                count -= 1;
                            }
                        }
                    }
                    return new Uint8Array(outputBytes);
                };
                ByteArrayBase.prototype.decodeUTF8 = function (data) {
                    var fatal = false;
                    var pos = 0;
                    var result = "";
                    var code_point;
                    var utf8_code_point = 0;
                    var utf8_bytes_needed = 0;
                    var utf8_bytes_seen = 0;
                    var utf8_lower_boundary = 0;
                    while (data.length > pos) {
                        var _byte = data[pos++];
                        if (_byte === this.EOF_byte) {
                            if (utf8_bytes_needed !== 0) {
                                code_point = this.decoderError(fatal);
                            }
                            else {
                                code_point = this.EOF_code_point;
                            }
                        }
                        else {
                            if (utf8_bytes_needed === 0) {
                                if (this.inRange(_byte, 0x00, 0x7F)) {
                                    code_point = _byte;
                                }
                                else {
                                    if (this.inRange(_byte, 0xC2, 0xDF)) {
                                        utf8_bytes_needed = 1;
                                        utf8_lower_boundary = 0x80;
                                        utf8_code_point = _byte - 0xC0;
                                    }
                                    else if (this.inRange(_byte, 0xE0, 0xEF)) {
                                        utf8_bytes_needed = 2;
                                        utf8_lower_boundary = 0x800;
                                        utf8_code_point = _byte - 0xE0;
                                    }
                                    else if (this.inRange(_byte, 0xF0, 0xF4)) {
                                        utf8_bytes_needed = 3;
                                        utf8_lower_boundary = 0x10000;
                                        utf8_code_point = _byte - 0xF0;
                                    }
                                    else {
                                        this.decoderError(fatal);
                                    }
                                    utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                                    code_point = null;
                                }
                            }
                            else if (!this.inRange(_byte, 0x80, 0xBF)) {
                                utf8_code_point = 0;
                                utf8_bytes_needed = 0;
                                utf8_bytes_seen = 0;
                                utf8_lower_boundary = 0;
                                pos--;
                                code_point = this.decoderError(fatal, _byte);
                            }
                            else {
                                utf8_bytes_seen += 1;
                                utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                                if (utf8_bytes_seen !== utf8_bytes_needed) {
                                    code_point = null;
                                }
                                else {
                                    var cp = utf8_code_point;
                                    var lower_boundary = utf8_lower_boundary;
                                    utf8_code_point = 0;
                                    utf8_bytes_needed = 0;
                                    utf8_bytes_seen = 0;
                                    utf8_lower_boundary = 0;
                                    if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                        code_point = cp;
                                    }
                                    else {
                                        code_point = this.decoderError(fatal, _byte);
                                    }
                                }
                            }
                        }
                        if (code_point !== null && code_point !== this.EOF_code_point) {
                            if (code_point <= 0xFFFF) {
                                if (code_point > 0)
                                    result += String.fromCharCode(code_point);
                            }
                            else {
                                code_point -= 0x10000;
                                result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                                result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                            }
                        }
                    }
                    return result;
                };
                ByteArrayBase.prototype.encoderError = function (code_point) {
                    throw 'EncodingError! The code point ' + code_point + ' could not be encoded.';
                };
                ByteArrayBase.prototype.decoderError = function (fatal, opt_code_point) {
                    if (fatal) {
                        throw 'DecodingError';
                    }
                    return opt_code_point || 0xFFFD;
                };
                ByteArrayBase.prototype.inRange = function (a, min, max) {
                    return min <= a && a <= max;
                };
                ByteArrayBase.prototype.div = function (n, d) {
                    return Math.floor(n / d);
                };
                ByteArrayBase.prototype.stringToCodePoints = function (string) {
                    var cps = [];
                    var i = 0, n = string.length;
                    while (i < string.length) {
                        var c = string.charCodeAt(i);
                        if (!this.inRange(c, 0xD800, 0xDFFF)) {
                            cps.push(c);
                        }
                        else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                            cps.push(0xFFFD);
                        }
                        else {
                            if (i === n - 1) {
                                cps.push(0xFFFD);
                            }
                            else {
                                var d = string.charCodeAt(i + 1);
                                if (this.inRange(d, 0xDC00, 0xDFFF)) {
                                    var a = c & 0x3FF;
                                    var b = d & 0x3FF;
                                    i += 1;
                                    cps.push(0x10000 + (a << 10) + b);
                                }
                                else {
                                    cps.push(0xFFFD);
                                }
                            }
                        }
                        i += 1;
                    }
                    return cps;
                };
                ByteArrayBase.BIG_ENDIAN = "bigEndian";
                ByteArrayBase.LITTLE_ENDIAN = "littleEndian";
                ByteArrayBase.SIZE_OF_BOOLEAN = 1;
                ByteArrayBase.SIZE_OF_INT8 = 1;
                ByteArrayBase.SIZE_OF_INT16 = 2;
                ByteArrayBase.SIZE_OF_INT32 = 4;
                ByteArrayBase.SIZE_OF_INT64 = 8;
                ByteArrayBase.SIZE_OF_UINT8 = 1;
                ByteArrayBase.SIZE_OF_UINT16 = 2;
                ByteArrayBase.SIZE_OF_UINT32 = 4;
                ByteArrayBase.SIZE_OF_UINT64 = 8;
                ByteArrayBase.SIZE_OF_FLOAT32 = 4;
                ByteArrayBase.SIZE_OF_FLOAT64 = 8;
                return ByteArrayBase;
            }());
            exports_1("ByteArrayBase", ByteArrayBase);
        }
    }
});
System.register("core/src/pointer/src/MemoryUtils", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
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
            exports_2("MemoryUtils", MemoryUtils);
        }
    }
});
System.register("core/src/pointer/src/UTF8", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var UTF8;
    return {
        setters:[],
        execute: function() {
            UTF8 = (function () {
                function UTF8() {
                    this.EOF_byte = -1;
                    this.EOF_code_point = -1;
                }
                UTF8.encode = function (str) {
                    if (str) {
                        if (!UTF8.instance) {
                            UTF8.instance = new UTF8();
                        }
                        return UTF8.instance.encode(str);
                    }
                    return null;
                };
                UTF8.decode = function (data) {
                    if (data) {
                        if (!UTF8.instance) {
                            UTF8.instance = new UTF8();
                        }
                        return UTF8.instance.decode(data);
                    }
                    return null;
                };
                UTF8.prototype.encode = function (str) {
                    var pos = 0;
                    var codePoints = this.stringToCodePoints(str);
                    var outputBytes = [];
                    while (codePoints.length > pos) {
                        var code_point = codePoints[pos++];
                        if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                            this.encoderError(code_point);
                        }
                        else if (this.inRange(code_point, 0x0000, 0x007f)) {
                            outputBytes.push(code_point);
                        }
                        else {
                            var count, offset;
                            if (this.inRange(code_point, 0x0080, 0x07FF)) {
                                count = 1;
                                offset = 0xC0;
                            }
                            else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                                count = 2;
                                offset = 0xE0;
                            }
                            else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                                count = 3;
                                offset = 0xF0;
                            }
                            outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                            while (count > 0) {
                                var temp = this.div(code_point, Math.pow(64, count - 1));
                                outputBytes.push(0x80 + (temp % 64));
                                count -= 1;
                            }
                        }
                    }
                    return new Uint8Array(outputBytes);
                };
                UTF8.prototype.decode = function (data) {
                    var fatal = false;
                    var pos = 0;
                    var result = "";
                    var code_point;
                    var utf8_code_point = 0;
                    var utf8_bytes_needed = 0;
                    var utf8_bytes_seen = 0;
                    var utf8_lower_boundary = 0;
                    while (data.length > pos) {
                        var _byte = data[pos++];
                        if (_byte === this.EOF_byte) {
                            if (utf8_bytes_needed !== 0) {
                                code_point = this.decoderError(fatal);
                            }
                            else {
                                code_point = this.EOF_code_point;
                            }
                        }
                        else {
                            if (utf8_bytes_needed === 0) {
                                if (this.inRange(_byte, 0x00, 0x7F)) {
                                    code_point = _byte;
                                }
                                else {
                                    if (this.inRange(_byte, 0xC2, 0xDF)) {
                                        utf8_bytes_needed = 1;
                                        utf8_lower_boundary = 0x80;
                                        utf8_code_point = _byte - 0xC0;
                                    }
                                    else if (this.inRange(_byte, 0xE0, 0xEF)) {
                                        utf8_bytes_needed = 2;
                                        utf8_lower_boundary = 0x800;
                                        utf8_code_point = _byte - 0xE0;
                                    }
                                    else if (this.inRange(_byte, 0xF0, 0xF4)) {
                                        utf8_bytes_needed = 3;
                                        utf8_lower_boundary = 0x10000;
                                        utf8_code_point = _byte - 0xF0;
                                    }
                                    else {
                                        this.decoderError(fatal);
                                    }
                                    utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                                    code_point = null;
                                }
                            }
                            else if (!this.inRange(_byte, 0x80, 0xBF)) {
                                utf8_code_point = 0;
                                utf8_bytes_needed = 0;
                                utf8_bytes_seen = 0;
                                utf8_lower_boundary = 0;
                                pos--;
                                code_point = this.decoderError(fatal, _byte);
                            }
                            else {
                                utf8_bytes_seen += 1;
                                utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                                if (utf8_bytes_seen !== utf8_bytes_needed) {
                                    code_point = null;
                                }
                                else {
                                    var cp = utf8_code_point;
                                    var lower_boundary = utf8_lower_boundary;
                                    utf8_code_point = 0;
                                    utf8_bytes_needed = 0;
                                    utf8_bytes_seen = 0;
                                    utf8_lower_boundary = 0;
                                    if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                        code_point = cp;
                                    }
                                    else {
                                        code_point = this.decoderError(fatal, _byte);
                                    }
                                }
                            }
                        }
                        if (code_point !== null && code_point !== this.EOF_code_point) {
                            if (code_point <= 0xFFFF) {
                                if (code_point > 0)
                                    result += String.fromCharCode(code_point);
                            }
                            else {
                                code_point -= 0x10000;
                                result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                                result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                            }
                        }
                    }
                    return result;
                };
                UTF8.prototype.encoderError = function (code_point) {
                    throw 'EncodingError! The code point ' + code_point + ' could not be encoded.';
                };
                UTF8.prototype.decoderError = function (fatal, opt_code_point) {
                    if (fatal) {
                        throw 'DecodingError';
                    }
                    return opt_code_point || 0xFFFD;
                };
                UTF8.prototype.inRange = function (a, min, max) {
                    return min <= a && a <= max;
                };
                UTF8.prototype.div = function (n, d) {
                    return Math.floor(n / d);
                };
                UTF8.prototype.stringToCodePoints = function (string) {
                    var cps = [];
                    var i = 0, n = string.length;
                    while (i < string.length) {
                        var c = string.charCodeAt(i);
                        if (!this.inRange(c, 0xD800, 0xDFFF)) {
                            cps.push(c);
                        }
                        else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                            cps.push(0xFFFD);
                        }
                        else {
                            if (i === n - 1) {
                                cps.push(0xFFFD);
                            }
                            else {
                                var d = string.charCodeAt(i + 1);
                                if (this.inRange(d, 0xDC00, 0xDFFF)) {
                                    var a = c & 0x3FF;
                                    var b = d & 0x3FF;
                                    i += 1;
                                    cps.push(0x10000 + (a << 10) + b);
                                }
                                else {
                                    cps.push(0xFFFD);
                                }
                            }
                        }
                        i += 1;
                    }
                    return cps;
                };
                return UTF8;
            }());
            exports_3("UTF8", UTF8);
        }
    }
});
System.register("core/src/pointer/src/DirectMemory", ["core/src/pointer/src/MemoryUtils", "core/src/pointer/src/UTF8"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
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
            exports_4("DirectMemory", DirectMemory);
        }
    }
});
System.register("core/src/pointer/src/IPointer", [], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("core/src/pointer/src/Pointer", ["core/src/pointer/src/DirectMemory"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var DirectMemory_1;
    var Pointer;
    function sizeof(ptr) {
        return ptr.memorySize;
    }
    exports_6("sizeof", sizeof);
    return {
        setters:[
            function (DirectMemory_1_1) {
                DirectMemory_1 = DirectMemory_1_1;
            }],
        execute: function() {
            Pointer = (function () {
                function Pointer(reference) {
                    this.reference = reference;
                    if (!Pointer.heap) {
                        Pointer.init();
                    }
                    this.beginLocation = Pointer.offset;
                    this.currentLocation = Pointer.offset;
                    Pointer.offset = reference.write(Pointer.memory);
                }
                Pointer.init = function () {
                    if (Pointer.initialized) {
                        return;
                    }
                    var maxMemory = 64 * 1024 * 1024;
                    Pointer.heap = new Uint8Array(new SharedArrayBuffer(maxMemory));
                    Pointer.memory = new DirectMemory_1.DirectMemory(Pointer.heap.buffer);
                    Pointer.initialized = true;
                    return Pointer.memory;
                };
                Pointer.prototype.read = function () {
                    Pointer.offset = this.reference.read(Pointer.memory);
                    return this.reference;
                };
                return Pointer;
            }());
            exports_6("Pointer", Pointer);
        }
    }
});
System.register("core/src/pointer/pointer", ["core/src/pointer/src/ByteArrayBase", "core/src/pointer/src/DirectMemory", "core/src/pointer/src/MemoryUtils", "core/src/pointer/src/UTF8", "core/src/pointer/src/Pointer"], function(exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    function exportStar_1(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_7(exports);
    }
    return {
        setters:[
            function (ByteArrayBase_1_1) {
                exportStar_1(ByteArrayBase_1_1);
            },
            function (DirectMemory_2_1) {
                exportStar_1(DirectMemory_2_1);
            },
            function (MemoryUtils_2_1) {
                exportStar_1(MemoryUtils_2_1);
            },
            function (UTF8_2_1) {
                exportStar_1(UTF8_2_1);
            },
            function (Pointer_1_1) {
                exportStar_1(Pointer_1_1);
            }],
        execute: function() {
        }
    }
});
System.register("core/src/engine/data/DataCache", [], function(exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var DataCache;
    return {
        setters:[],
        execute: function() {
            DataCache = (function () {
                function DataCache() {
                }
                DataCache.getItem = function (url) {
                    return DataCache.cache.get(url);
                };
                DataCache.add = function (url, item) {
                    DataCache.cache.set(url, item);
                    return item;
                };
                DataCache.cache = new Map();
                return DataCache;
            }());
            exports_8("DataCache", DataCache);
        }
    }
});
System.register("core/src/engine/data/ImageLoader", ["core/src/engine/data/DataCache"], function(exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var DataCache_1;
    var ImageLoader;
    return {
        setters:[
            function (DataCache_1_1) {
                DataCache_1 = DataCache_1_1;
            }],
        execute: function() {
            ImageLoader = (function () {
                function ImageLoader() {
                }
                ImageLoader.prototype.load = function (url, onLoad, onProgress, onError) {
                    var self = this;
                    var cached = DataCache_1.DataCache.getItem(url);
                    if (cached !== undefined) {
                        onLoad(cached);
                        return;
                    }
                    var image = document.createElement('img');
                    image.addEventListener('load', function (event) {
                        DataCache_1.DataCache.add(url, this);
                        if (onLoad)
                            onLoad(this);
                    }, false);
                    if (onProgress !== undefined) {
                        image.addEventListener('progress', function (event) {
                            onProgress(event);
                        }, false);
                    }
                    if (onError !== undefined) {
                        image.addEventListener('error', function (event) {
                            onError(event);
                        }, false);
                    }
                    if (ImageLoader.crossOrigin !== undefined)
                        image.crossOrigin = ImageLoader.crossOrigin;
                    image.src = url;
                    return image;
                };
                ImageLoader.crossOrigin = "*";
                return ImageLoader;
            }());
            exports_9("ImageLoader", ImageLoader);
        }
    }
});
System.register("core/src/engine/math/Vector3", ["core/src/pointer/src/DirectMemory"], function(exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var DirectMemory_3;
    var Vector3;
    return {
        setters:[
            function (DirectMemory_3_1) {
                DirectMemory_3 = DirectMemory_3_1;
            }],
        execute: function() {
            Vector3 = (function () {
                function Vector3(x, y, z) {
                    if (x === void 0) { x = 0; }
                    if (y === void 0) { y = 0; }
                    if (z === void 0) { z = 0; }
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    this.memorySize = Vector3.SIZE;
                }
                Vector3.fromJson = function (v) {
                    if (v) {
                        return new Vector3(v.x, v.y, v.z);
                    }
                    else {
                        return null;
                    }
                };
                Vector3.prototype.setFromArray = function (a, offset) {
                    if (offset === void 0) { offset = 0; }
                    this.x = a[offset];
                    this.y = a[offset + 1];
                    this.z = a[offset + 2];
                };
                Vector3.prototype.setFromJson = function (a) {
                    this.x = a.x;
                    this.y = a.y;
                    this.z = a.z;
                };
                Vector3.prototype.length = function () {
                    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
                };
                Vector3.prototype.dot = function (b) {
                    return this.x * b.x + this.y * b.y + this.z * b.z;
                };
                Vector3.prototype.cross = function (b) {
                    var x = this.y * b.z - this.z * b.y;
                    var y = this.z * b.x - this.x * b.z;
                    var z = this.x * b.y - this.y * b.x;
                    return new Vector3(x, y, z);
                };
                Vector3.prototype.normalize = function () {
                    var d = this.length();
                    return new Vector3(this.x / d, this.y / d, this.z / d);
                };
                Vector3.prototype.add = function (b) {
                    return new Vector3(this.x + b.x, this.y + b.y, this.z + b.z);
                };
                Vector3.prototype.sub = function (b) {
                    return new Vector3(this.x - b.x, this.y - b.y, this.z - b.z);
                };
                Vector3.prototype.mul = function (b) {
                    return new Vector3(this.x * b.x, this.y * b.y, this.z * b.z);
                };
                Vector3.prototype.div = function (b) {
                    return new Vector3(this.x / b.x, this.y / b.y, this.z / b.z);
                };
                Vector3.prototype.mulScalar = function (b) {
                    return new Vector3(this.x * b, this.y * b, this.z * b);
                };
                Vector3.prototype.divScalar = function (b) {
                    return new Vector3(this.x / b, this.y / b, this.z / b);
                };
                Vector3.prototype.min = function (b) {
                    return new Vector3(Math.min(this.x, b.x), Math.min(this.y, b.y), Math.min(this.z, b.z));
                };
                Vector3.prototype.max = function (b) {
                    return new Vector3(Math.max(this.x, b.x), Math.max(this.y, b.y), Math.max(this.z, b.z));
                };
                Vector3.prototype.minAxis = function () {
                    var x = Math.abs(this.x);
                    var y = Math.abs(this.y);
                    var z = Math.abs(this.z);
                    if (x <= y && x <= z) {
                        return new Vector3(1, 0, 0);
                    }
                    else if (y <= x && y <= z) {
                        return new Vector3(0, 1, 0);
                    }
                    return new Vector3(0, 0, 1);
                };
                Vector3.prototype.minComponent = function () {
                    return Math.min(Math.min(this.x, this.y), this.z);
                };
                Vector3.prototype.reflect = function (i) {
                    return i.sub(this.mulScalar(2 * this.dot(i)));
                };
                Vector3.prototype.refract = function (i, n1, n2) {
                    var nr = n1 / n2;
                    var cosI = -this.dot(i);
                    var sinT2 = nr * nr * (1 - cosI * cosI);
                    if (sinT2 > 1) {
                        return new Vector3();
                    }
                    var cosT = Math.sqrt(1 - sinT2);
                    return i.mulScalar(nr).add(this.mulScalar(nr * cosI - cosT));
                };
                Vector3.prototype.reflectance = function (i, n1, n2) {
                    var nr = n1 / n2;
                    var cosI = -this.dot(i);
                    var sinT2 = nr * nr * (1 - cosI * cosI);
                    if (sinT2 > 1) {
                        return 1;
                    }
                    var cosT = Math.sqrt(1 - sinT2);
                    var rOrth = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
                    var rPar = (n2 * cosI - n1 * cosT) / (n2 * cosI + n1 * cosT);
                    return (rOrth * rOrth + rPar * rPar) / 2;
                };
                Vector3.prototype.toString = function () {
                    return "(" + this.x + "," + this.y + "," + this.z + ")";
                };
                Vector3.prototype.equals = function (v) {
                    return this.x == v.x && this.y == v.y && this.z == v.z;
                };
                Vector3.prototype.isZero = function () {
                    return this.x == 0 && this.y == 0 && this.z == 0;
                };
                Vector3.prototype.directWrite = function (memory, offset) {
                    memory[offset++] = this.x;
                    memory[offset++] = this.y;
                    memory[offset++] = this.z;
                    return offset;
                };
                Vector3.prototype.directRead = function (memory, offset) {
                    this.x = memory[offset++];
                    this.y = memory[offset++];
                    this.z = memory[offset++];
                    return offset;
                };
                Vector3.prototype.read = function (memory) {
                    this.x = memory.readFloat();
                    this.y = memory.readFloat();
                    this.z = memory.readFloat();
                    return memory.position;
                };
                Vector3.prototype.write = function (memory) {
                    memory.writeFloat(this.x);
                    memory.writeFloat(this.y);
                    memory.writeFloat(this.z);
                    return memory.position;
                };
                Vector3.prototype.isNullVector = function () {
                    return this.x == DirectMemory_3.DirectMemory.MIN_FLOAT32_VALUE &&
                        this.y == DirectMemory_3.DirectMemory.MIN_FLOAT32_VALUE &&
                        this.z == DirectMemory_3.DirectMemory.MIN_FLOAT32_VALUE;
                };
                Vector3.SIZE = 3;
                Vector3.NullVector = new Vector3(DirectMemory_3.DirectMemory.MIN_FLOAT32_VALUE, DirectMemory_3.DirectMemory.MIN_FLOAT32_VALUE, DirectMemory_3.DirectMemory.MIN_FLOAT32_VALUE);
                return Vector3;
            }());
            exports_10("Vector3", Vector3);
        }
    }
});
System.register("core/src/engine/math/Color", [], function(exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    var Color;
    return {
        setters:[],
        execute: function() {
            Color = (function () {
                function Color(r, g, b) {
                    if (r === void 0) { r = 0; }
                    if (g === void 0) { g = 0; }
                    if (b === void 0) { b = 0; }
                    this.r = r;
                    this.g = g;
                    this.b = b;
                }
                Color.prototype.directWrite = function (mem, offset) {
                    mem[offset++] = this.r;
                    mem[offset++] = this.g;
                    mem[offset++] = this.b;
                    return offset;
                };
                Color.prototype.directRead = function (mem, offset) {
                    this.r = mem[offset++];
                    this.g = mem[offset++];
                    this.b = mem[offset++];
                    return offset;
                };
                Color.prototype.read = function (memory) {
                    this.r = memory.readFloat();
                    this.g = memory.readFloat();
                    this.b = memory.readFloat();
                    return memory.position;
                };
                Color.prototype.write = function (memory) {
                    memory.writeFloat(this.r);
                    memory.writeFloat(this.g);
                    memory.writeFloat(this.b);
                    return memory.position;
                };
                Color.fromJson = function (color) {
                    if (color) {
                        return new Color(color.r, color.g, color.b);
                    }
                    else {
                        return null;
                    }
                };
                Color.hexColor = function (hex) {
                    var red = ((hex >> 16) & 255) / 255;
                    var green = ((hex >> 8) & 255) / 255;
                    var blue = (hex & 255) / 255;
                    return new Color(red, green, blue).pow(2.2);
                };
                Color.newColor = function (c) {
                    return new Color(c.r / 65535, c.g / 65535, c.b / 65535);
                };
                Color.prototype.RGBA = function () {
                    var a = this;
                    var _c = new Uint8Array(3);
                    _c[0] = Math.max(0, Math.min(255, a.r * 255));
                    _c[1] = Math.max(0, Math.min(255, a.g * 255));
                    _c[2] = Math.max(0, Math.min(255, a.b * 255));
                    return { r: _c[0], g: _c[1], b: _c[2], a: 255 };
                };
                Color.prototype.add = function (b) {
                    return new Color(this.r + b.r, this.g + b.g, this.b + b.b);
                };
                Color.prototype.sub = function (b) {
                    return new Color(this.r - b.r, this.g - b.g, this.b - b.b);
                };
                Color.prototype.mul = function (b) {
                    return new Color(this.r * b.r, this.g * b.g, this.b * b.b);
                };
                Color.prototype.mulScalar = function (b) {
                    return new Color(this.r * b, this.g * b, this.b * b);
                };
                Color.prototype.divScalar = function (b) {
                    return new Color(this.r / b, this.g / b, this.b / b);
                };
                Color.prototype.min = function (b) {
                    return new Color(Math.min(this.r, b.r), Math.min(this.g, b.g), Math.min(this.b, b.b));
                };
                Color.prototype.max = function (b) {
                    return new Color(Math.max(this.r, b.r), Math.max(this.g, b.g), Math.max(this.b, b.b));
                };
                Color.prototype.pow = function (b) {
                    return new Color(Math.pow(this.r, b), Math.pow(this.g, b), Math.pow(this.b, b));
                };
                Color.prototype.mix = function (b, pct) {
                    var a = this.mulScalar(1 - pct);
                    b = b.mulScalar(pct);
                    return a.add(b);
                };
                Color.prototype.set = function (r, g, b) {
                    this.r = r;
                    this.g = g;
                    this.b = b;
                    return this;
                };
                Color.prototype.clone = function () {
                    return new Color(this.r, this.g, this.b);
                };
                Color.SIZE = 3;
                return Color;
            }());
            exports_11("Color", Color);
        }
    }
});
System.register("core/src/engine/math/Constants", [], function(exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    var INF, EPS, shift, uvnan, uvinf, uvneginf, mask, bias;
    return {
        setters:[],
        execute: function() {
            exports_12("INF", INF = 1e9);
            exports_12("EPS", EPS = 1e-9);
            exports_12("shift", shift = 64 - 11 - 1);
            exports_12("uvnan", uvnan = 0x7FF8000000000001);
            exports_12("uvinf", uvinf = 0x7FF0000000000000);
            exports_12("uvneginf", uvneginf = 0xFFF0000000000000);
            exports_12("mask", mask = 0x7FF);
            exports_12("bias", bias = 1023);
        }
    }
});
System.register("core/src/engine/utils/MathUtils", ["core/src/engine/math/Constants"], function(exports_13, context_13) {
    "use strict";
    var __moduleName = context_13 && context_13.id;
    var Constants_1, Constants_2, Constants_3;
    var MathUtils;
    return {
        setters:[
            function (Constants_1_1) {
                Constants_1 = Constants_1_1;
                Constants_2 = Constants_1_1;
                Constants_3 = Constants_1_1;
            }],
        execute: function() {
            MathUtils = (function () {
                function MathUtils() {
                }
                MathUtils.radians = function (degrees) {
                    return degrees * Math.PI / 180;
                };
                MathUtils.degrees = function (radians) {
                    return radians * 180 / Math.PI;
                };
                MathUtils.median = function (items) {
                    var n = items.length;
                    if (n == 0) {
                        return 0;
                    }
                    else if (n % 2 == 1) {
                        return items[n / 2];
                    }
                    else {
                        var a = items[n / 2 - 1];
                        var b = items[n / 2];
                        return (a + b) / 2;
                    }
                };
                MathUtils.fract = function (x) {
                    var n = MathUtils.Modf(x);
                    return n.frac;
                };
                MathUtils.Modf = function (f) {
                    if (f < 1) {
                        if (f < 0) {
                            var n = MathUtils.Modf(-f);
                            return { int: -n.int, frac: -n.frac };
                        }
                        return { int: 0, frac: f };
                    }
                    var x = f;
                    var e = (x >> Constants_1.shift) & Constants_2.mask - Constants_3.bias;
                    if (e < 64 - 12) {
                        x &= 1 << (64 - 12 - e) - 1;
                        x ^= x;
                    }
                    var int = x;
                    var frac = f - int;
                    return { int: int, frac: frac };
                };
                MathUtils.clampInt = function (x, lo, hi) {
                    if (x < lo) {
                        return lo;
                    }
                    if (x > hi) {
                        return hi;
                    }
                    return x;
                };
                return MathUtils;
            }());
            exports_13("MathUtils", MathUtils);
        }
    }
});
System.register("core/src/engine/scene/materials/Texture", ["core/src/engine/math/Color", "core/src/engine/math/Vector3", "core/src/engine/data/ImageLoader", "core/src/engine/utils/MathUtils"], function(exports_14, context_14) {
    "use strict";
    var __moduleName = context_14 && context_14.id;
    var Color_1, Vector3_1, ImageLoader_1, MathUtils_1;
    var Texture;
    return {
        setters:[
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            },
            function (ImageLoader_1_1) {
                ImageLoader_1 = ImageLoader_1_1;
            },
            function (MathUtils_1_1) {
                MathUtils_1 = MathUtils_1_1;
            }],
        execute: function() {
            Texture = (function (_super) {
                __extends(Texture, _super);
                function Texture(url) {
                    _super.call(this);
                    try {
                        if (importScripts) {
                            return;
                        }
                    }
                    catch (e) {
                    }
                    if (!Texture.ctx) {
                        var canvas = document.createElement("canvas");
                        Texture.ctx = canvas.getContext("2d");
                    }
                    if (url) {
                        this.load(url);
                    }
                }
                Texture.getTexture = function (url) {
                    var texture = Texture.map.get(url);
                    if (texture) {
                        return texture;
                    }
                    else {
                        return new Texture(url);
                    }
                };
                Texture.fromJson = function (texture) {
                    if (texture) {
                        var _texture = new Texture();
                        _texture.data = texture.data;
                        _texture.pixels = texture.pixels;
                        return _texture;
                    }
                    else {
                        return null;
                    }
                };
                Texture.prototype.sample = function (u, v) {
                    u = MathUtils_1.MathUtils.fract(MathUtils_1.MathUtils.fract(u) + 1);
                    v = MathUtils_1.MathUtils.fract(MathUtils_1.MathUtils.fract(v) + 1);
                    v = 1 - v;
                    var x = Math.round(u * this.width);
                    var y = Math.round(v * this.height);
                    return this.data[y * this.width + x];
                };
                Texture.prototype.normalSample = function (u, v) {
                    var c = this.sample(u, v).pow(1 / 2.2);
                    return new Vector3_1.Vector3(c.r * 2 - 1, c.g * 2 - 1, c.b * 2 - 1).normalize();
                };
                Texture.prototype.bumpSample = function (u, v) {
                    u = MathUtils_1.MathUtils.fract(MathUtils_1.MathUtils.fract(u) + 1);
                    v = MathUtils_1.MathUtils.fract(MathUtils_1.MathUtils.fract(v) + 1);
                    v = 1 - v;
                    var x = Math.round(u * this.width);
                    var y = Math.round(v * this.height);
                    var x1 = MathUtils_1.MathUtils.clampInt(x - 1, 0, this.width - 1);
                    var x2 = MathUtils_1.MathUtils.clampInt(x + 1, 0, this.width - 1);
                    var y1 = MathUtils_1.MathUtils.clampInt(y - 1, 0, this.height - 1);
                    var y2 = MathUtils_1.MathUtils.clampInt(y + 1, 0, this.height - 1);
                    var cx = this.data[y * this.width + x1].sub(this.data[y * this.width + x2]);
                    var cy = this.data[y1 * this.width + x].sub(this.data[y2 * this.width + x]);
                    return new Vector3_1.Vector3(cx.r, cy.r, 0);
                };
                Texture.prototype.load = function (url, onLoad, onProgress, onError) {
                    var self = this;
                    this.sourceFile = url;
                    var texture = Texture.map.get(url);
                    if (texture) {
                        this.data = texture.data;
                        this.image = texture.image;
                        this.pixels = texture.pixels;
                        this.sourceFile = texture.sourceFile;
                        if (onLoad) {
                            onLoad(this.data);
                        }
                        return this.image;
                    }
                    Texture.map.set(url, this);
                    return _super.prototype.load.call(this, url, function (image) {
                        Texture.ctx.drawImage(image, 0, 0);
                        var pixels = Texture.ctx.getImageData(0, 0, image.width, image.height).data;
                        if (onLoad) {
                            onLoad(pixels);
                        }
                        self.data = [];
                        for (var y = 0; y < image.height; y++) {
                            for (var x = 0; x < image.width; x++) {
                                var pi = y * (image.width * 4) + (x * 4);
                                var index = y * image.width + x;
                                var rgba = {
                                    r: pixels[pi],
                                    g: pixels[pi + 1],
                                    b: pixels[pi + 2],
                                    a: pixels[pi + 3],
                                };
                                self.data[index] = Color_1.Color.newColor(rgba).pow(2.2);
                            }
                        }
                        self.image = image;
                        self.width = image.width;
                        self.height = image.height;
                        self.pixels = pixels;
                    }, onProgress, onError);
                };
                Texture.map = new Map();
                return Texture;
            }(ImageLoader_1.ImageLoader));
            exports_14("Texture", Texture);
        }
    }
});
System.register("core/src/engine/scene/materials/Attenuation", [], function(exports_15, context_15) {
    "use strict";
    var __moduleName = context_15 && context_15.id;
    var Attenuation, NoAttenuation, LinearAttenuation, QuadraticAttenuation;
    return {
        setters:[],
        execute: function() {
            Attenuation = (function () {
                function Attenuation(constant, linear, quadratic) {
                    if (constant === void 0) { constant = 1; }
                    if (linear === void 0) { linear = 0; }
                    if (quadratic === void 0) { quadratic = 0; }
                    this.constant = constant;
                    this.linear = linear;
                    this.quadratic = quadratic;
                }
                Attenuation.fromJson = function (attenuation) {
                    if (!attenuation) {
                        return NoAttenuation;
                    }
                    else {
                        return new Attenuation(attenuation.constant, attenuation.linear, attenuation.quadratic);
                    }
                };
                Attenuation.prototype.compute = function (d) {
                    return 1 / (this.constant + this.linear * d + this.quadratic * d * d);
                };
                Attenuation.prototype.set = function (attenation) {
                    this.constant = attenation.constant;
                    this.linear = attenation.linear;
                    this.quadratic = attenation.quadratic;
                    return this;
                };
                Attenuation.prototype.clone = function () {
                    return new Attenuation(this.constant, this.linear, this.quadratic);
                };
                Attenuation.prototype.directWrite = function (mem, offset) {
                    mem[offset++] = this.constant;
                    mem[offset++] = this.linear;
                    mem[offset++] = this.quadratic;
                    return offset;
                };
                Attenuation.prototype.directRead = function (mem, offset) {
                    this.constant = mem[offset++];
                    this.linear = mem[offset++];
                    this.quadratic = mem[offset++];
                    return offset;
                };
                Attenuation.prototype.read = function (memory) {
                    this.constant = memory.readFloat();
                    this.linear = memory.readFloat();
                    this.quadratic = memory.readFloat();
                    return memory.position;
                };
                Attenuation.prototype.write = function (memory) {
                    memory.writeFloat(this.constant);
                    memory.writeFloat(this.linear);
                    memory.writeFloat(this.quadratic);
                    return memory.position;
                };
                Attenuation.SIZE = 3;
                return Attenuation;
            }());
            exports_15("Attenuation", Attenuation);
            exports_15("NoAttenuation", NoAttenuation = new Attenuation(1, 0, 0));
            LinearAttenuation = (function (_super) {
                __extends(LinearAttenuation, _super);
                function LinearAttenuation(value) {
                    _super.call(this, 1, value, 0);
                }
                return LinearAttenuation;
            }(Attenuation));
            exports_15("LinearAttenuation", LinearAttenuation);
            QuadraticAttenuation = (function (_super) {
                __extends(QuadraticAttenuation, _super);
                function QuadraticAttenuation(value) {
                    _super.call(this, 1, 0, value);
                }
                return QuadraticAttenuation;
            }(Attenuation));
            exports_15("QuadraticAttenuation", QuadraticAttenuation);
        }
    }
});
System.register("core/src/engine/scene/materials/Material", ["core/src/engine/math/Color", "core/src/engine/scene/materials/Attenuation"], function(exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    var Color_2, Attenuation_1, Attenuation_2;
    var MaterialType, Material;
    return {
        setters:[
            function (Color_2_1) {
                Color_2 = Color_2_1;
            },
            function (Attenuation_1_1) {
                Attenuation_1 = Attenuation_1_1;
                Attenuation_2 = Attenuation_1_1;
            }],
        execute: function() {
            (function (MaterialType) {
                MaterialType[MaterialType["GENERIC"] = 0] = "GENERIC";
                MaterialType[MaterialType["DIFFUSE"] = 1] = "DIFFUSE";
                MaterialType[MaterialType["SPECULAR"] = 2] = "SPECULAR";
                MaterialType[MaterialType["CLEAR"] = 3] = "CLEAR";
                MaterialType[MaterialType["GLOSSY"] = 4] = "GLOSSY";
                MaterialType[MaterialType["EMISSIVE"] = 5] = "EMISSIVE";
            })(MaterialType || (MaterialType = {}));
            exports_16("MaterialType", MaterialType);
            Material = (function () {
                function Material(color, texture, normalTexture, bumpTexture, bumpMultiplier, emittance, attenuation, ior, gloss, tint, transparent) {
                    if (color === void 0) { color = new Color_2.Color(); }
                    if (attenuation === void 0) { attenuation = Attenuation_2.NoAttenuation; }
                    this.color = color;
                    this.texture = texture;
                    this.normalTexture = normalTexture;
                    this.bumpTexture = bumpTexture;
                    this.bumpMultiplier = bumpMultiplier;
                    this.emittance = emittance;
                    this.attenuation = attenuation;
                    this.ior = ior;
                    this.gloss = gloss;
                    this.tint = tint;
                    this.transparent = transparent;
                    this.type = MaterialType.GENERIC;
                    this.index = Material.map.push(this) - 1;
                }
                Material.prototype.clone = function () {
                    var material = new Material(this.color.clone(), this.texture, this.normalTexture, this.bumpTexture, this.bumpMultiplier, this.emittance, this.attenuation.clone(), this.ior, this.gloss, this.tint, this.transparent);
                    material.type = this.type;
                    return material;
                };
                Material.prototype.directRead = function (memory, offset) {
                    offset = this.color.directRead(memory, offset);
                    this.bumpMultiplier = memory[offset++];
                    this.emittance = memory[offset++];
                    offset = this.attenuation.directRead(memory, offset);
                    this.ior = memory[offset++];
                    this.gloss = memory[offset++];
                    this.tint = memory[offset++];
                    this.transparent = memory[offset++] == 1;
                    return offset;
                };
                Material.prototype.directWrite = function (memory, offset) {
                    offset = this.color.directWrite(memory, offset);
                    memory[offset++] = this.bumpMultiplier;
                    memory[offset++] = this.emittance;
                    offset = this.attenuation.directWrite(memory, offset);
                    memory[offset++] = this.ior;
                    memory[offset++] = this.gloss;
                    memory[offset++] = this.tint;
                    memory[offset++] = this.transparent ? 1 : 0;
                    return offset;
                };
                Material.prototype.read = function (memory) {
                    this.color.read(memory);
                    this.bumpMultiplier = memory.readFloat();
                    this.emittance = memory.readFloat();
                    this.attenuation.read(memory);
                    this.ior = memory.readFloat();
                    this.gloss = memory.readFloat();
                    this.tint = memory.readFloat();
                    this.transparent = memory.readBoolean();
                    return memory.position;
                };
                Material.prototype.write = function (memory) {
                    this.color.write(memory);
                    memory.writeFloat(this.bumpMultiplier);
                    memory.writeFloat(this.emittance);
                    this.attenuation.write(memory);
                    memory.writeFloat(this.ior);
                    memory.writeFloat(this.gloss);
                    memory.writeFloat(this.tint);
                    memory.writeBoolean(this.transparent);
                    return memory.position;
                };
                Object.defineProperty(Material, "estimatedMemory", {
                    get: function () {
                        return Material.SIZE * Material.map.length + 1;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Material.directWrite = function (memory, offset) {
                    memory[offset++] = Material.map.length;
                    Material.map.forEach(function (material) {
                        offset = material.directWrite(memory, offset);
                    });
                    return offset;
                };
                Material.directRestore = function (memory, offset) {
                    if (offset === void 0) { offset = 0; }
                    var numMaterials = memory[offset++];
                    for (var i = 0; i < numMaterials; i++) {
                        offset = new Material().directRead(memory, offset);
                    }
                    return offset;
                };
                Material.write = function (memory) {
                    memory.writeUnsignedInt(Material.map.length);
                    Material.map.forEach(function (material) {
                        material.write(memory);
                    });
                    return memory.position;
                };
                Material.restore = function (memory) {
                    var numMaterials = memory.readUnsignedInt();
                    for (var i = 0; i < numMaterials; i++) {
                        new Material().read(memory);
                    }
                    return memory.position;
                };
                Material.SIZE = Color_2.Color.SIZE + Attenuation_1.Attenuation.SIZE + 6;
                Material.map = [];
                return Material;
            }());
            exports_16("Material", Material);
        }
    }
});
System.register("core/src/engine/scene/Axis", [], function(exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    var Axis;
    return {
        setters:[],
        execute: function() {
            (function (Axis) {
                Axis[Axis["AxisNone"] = 0] = "AxisNone";
                Axis[Axis["AxisX"] = 1] = "AxisX";
                Axis[Axis["AxisY"] = 2] = "AxisY";
                Axis[Axis["AxisZ"] = 3] = "AxisZ";
            })(Axis || (Axis = {}));
            exports_17("Axis", Axis);
        }
    }
});
System.register("core/src/engine/math/Ray", ["core/src/engine/math/Vector3", "core/src/engine/math/Constants"], function(exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    var Vector3_2, Constants_4;
    var Ray;
    return {
        setters:[
            function (Vector3_2_1) {
                Vector3_2 = Vector3_2_1;
            },
            function (Constants_4_1) {
                Constants_4 = Constants_4_1;
            }],
        execute: function() {
            Ray = (function () {
                function Ray(origin, direction) {
                    if (origin === void 0) { origin = new Vector3_2.Vector3(); }
                    if (direction === void 0) { direction = new Vector3_2.Vector3(); }
                    this.origin = origin;
                    this.direction = direction;
                    this.data = new Float32Array([
                        origin.x, origin.y, origin.z,
                        direction.x, direction.y, direction.z
                    ]);
                }
                Ray.prototype.position = function (t) {
                    return this.origin.add(this.direction.mulScalar(t));
                };
                Ray.prototype.reflect = function (i) {
                    return new Ray(this.origin, this.direction.reflect(i.direction));
                };
                Ray.prototype.Refract = function (i, n1, n2) {
                    return new Ray(this.origin, this.direction.refract(i.direction, n1, n2));
                };
                Ray.prototype.reflectance = function (i, n1, n2) {
                    return this.direction.reflectance(i.direction, n1, n2);
                };
                Ray.prototype.weightedBounce = function (u, v) {
                    var m1 = Math.sqrt(u);
                    var m2 = Math.sqrt(1 - u);
                    var a = v * 2 * Math.PI;
                    var q = new Vector3_2.Vector3(u - 0.5, v - 0.5, u + v - 1);
                    var s = this.direction.cross(q.normalize());
                    var t = this.direction.cross(s);
                    var d = new Vector3_2.Vector3();
                    d = d.add(s.mulScalar(m1 * Math.cos(a)));
                    d = d.add(t.mulScalar(m1 * Math.sin(a)));
                    d = d.add(this.direction.mulScalar(m2));
                    return new Ray(this.origin, d);
                };
                Ray.prototype.coneBounce = function (theta, u, v) {
                    if (theta < Constants_4.EPS) {
                        return this;
                    }
                    theta = theta * (1 - (2 * Math.acos(u) / Math.PI));
                    var m1 = Math.sin(theta);
                    var m2 = Math.cos(theta);
                    var a = v * 2 * Math.PI;
                    var s = this.direction.cross(this.direction.minAxis());
                    var t = this.direction.cross(s);
                    var d = new Vector3_2.Vector3();
                    d = d.add(s.mulScalar(m1 * Math.cos(a)));
                    d = d.add(t.mulScalar(m1 * Math.sin(a)));
                    d = d.add(this.direction.mulScalar(m2));
                    return new Ray(this.origin, d);
                };
                Ray.prototype.bounce = function (info, p, u, v) {
                    var n = info.ray;
                    var n1 = 1.0;
                    var n2 = info.material.ior;
                    if (info.inside) {
                        var _n1 = n1;
                        n1 = n2;
                        n2 = _n1;
                    }
                    if (p < n.reflectance(this, n1, n2)) {
                        var reflected = n.reflect(this);
                        var ray = reflected.coneBounce(info.material.gloss, u, v);
                        return { ray: ray, reflected: true };
                    }
                    else if (info.material.transparent) {
                        var refracted = n.Refract(this, n1, n2);
                        var ray = refracted.coneBounce(info.material.gloss, u, v);
                        return { ray: ray, reflected: true };
                    }
                    else {
                        var ray = n.weightedBounce(u, v);
                        return { ray: ray, reflected: false };
                    }
                };
                Ray.prototype.toString = function () {
                    return "Ray:" + this.origin.toString() + " -> " + this.direction.toString();
                };
                return Ray;
            }());
            exports_18("Ray", Ray);
        }
    }
});
System.register("core/src/engine/math/HitInfo", [], function(exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    var HitInfo;
    return {
        setters:[],
        execute: function() {
            HitInfo = (function () {
                function HitInfo(shape, position, normal, ray, color, material, inside) {
                    this.shape = shape;
                    this.position = position;
                    this.normal = normal;
                    this.ray = ray;
                    this.color = color;
                    this.material = material;
                    this.inside = inside;
                }
                return HitInfo;
            }());
            exports_19("HitInfo", HitInfo);
        }
    }
});
System.register("core/src/engine/math/Hit", ["core/src/engine/math/Constants", "core/src/engine/math/HitInfo", "core/src/engine/math/Ray"], function(exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    var Constants_5, HitInfo_1, Ray_1;
    var Hit, NoHit;
    return {
        setters:[
            function (Constants_5_1) {
                Constants_5 = Constants_5_1;
            },
            function (HitInfo_1_1) {
                HitInfo_1 = HitInfo_1_1;
            },
            function (Ray_1_1) {
                Ray_1 = Ray_1_1;
            }],
        execute: function() {
            Hit = (function () {
                function Hit(shape, T, info) {
                    this.shape = shape;
                    this.T = T;
                    this.info = info;
                }
                Hit.prototype.ok = function () {
                    return this.T < Constants_5.INF;
                };
                Hit.prototype.getInfo = function (ray) {
                    if (this.info) {
                        return this.info;
                    }
                    var shape = this.shape;
                    var position = ray.position(this.T);
                    var normal = shape.getNormal(position);
                    var color = shape.getColor(position);
                    var material = shape.getMaterial(position);
                    var inside = false;
                    if (normal.dot(ray.direction) > 0) {
                        normal = normal.mulScalar(-1);
                        inside = true;
                    }
                    ray = new Ray_1.Ray(position, normal);
                    this.info = new HitInfo_1.HitInfo(shape, position, normal, ray, color, material, inside);
                    return this.info;
                };
                return Hit;
            }());
            exports_20("Hit", Hit);
            exports_20("NoHit", NoHit = new Hit(null, Constants_5.INF));
        }
    }
});
System.register("core/src/engine/scene/materials/DiffuseMaterial", ["core/src/engine/scene/materials/Material", "core/src/engine/scene/materials/Attenuation"], function(exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    var Material_1, Attenuation_3, Material_2;
    var DiffuseMaterial;
    return {
        setters:[
            function (Material_1_1) {
                Material_1 = Material_1_1;
                Material_2 = Material_1_1;
            },
            function (Attenuation_3_1) {
                Attenuation_3 = Attenuation_3_1;
            }],
        execute: function() {
            DiffuseMaterial = (function (_super) {
                __extends(DiffuseMaterial, _super);
                function DiffuseMaterial(color) {
                    _super.call(this, color, null, null, null, 1, 0, Attenuation_3.NoAttenuation, 1, 0, 0, false);
                    this.type = Material_2.MaterialType.DIFFUSE;
                }
                return DiffuseMaterial;
            }(Material_1.Material));
            exports_21("DiffuseMaterial", DiffuseMaterial);
        }
    }
});
System.register("core/src/engine/scene/materials/SpecularMaterial", ["core/src/engine/scene/materials/Material", "core/src/engine/scene/materials/Attenuation"], function(exports_22, context_22) {
    "use strict";
    var __moduleName = context_22 && context_22.id;
    var Material_3, Attenuation_4, Material_4;
    var SpecularMaterial;
    return {
        setters:[
            function (Material_3_1) {
                Material_3 = Material_3_1;
                Material_4 = Material_3_1;
            },
            function (Attenuation_4_1) {
                Attenuation_4 = Attenuation_4_1;
            }],
        execute: function() {
            SpecularMaterial = (function (_super) {
                __extends(SpecularMaterial, _super);
                function SpecularMaterial(color, index) {
                    _super.call(this, color, null, null, null, 1, 0, Attenuation_4.NoAttenuation, index, 0, 0, false);
                    this.type = Material_4.MaterialType.SPECULAR;
                }
                return SpecularMaterial;
            }(Material_3.Material));
            exports_22("SpecularMaterial", SpecularMaterial);
        }
    }
});
System.register("core/src/engine/scene/materials/ClearMaterial", ["core/src/engine/scene/materials/Material", "core/src/engine/math/Color", "core/src/engine/scene/materials/Attenuation"], function(exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    var Material_5, Color_3, Attenuation_5, Material_6;
    var ClearMaterial;
    return {
        setters:[
            function (Material_5_1) {
                Material_5 = Material_5_1;
                Material_6 = Material_5_1;
            },
            function (Color_3_1) {
                Color_3 = Color_3_1;
            },
            function (Attenuation_5_1) {
                Attenuation_5 = Attenuation_5_1;
            }],
        execute: function() {
            ClearMaterial = (function (_super) {
                __extends(ClearMaterial, _super);
                function ClearMaterial(index, gloss) {
                    _super.call(this, new Color_3.Color(), null, null, null, 1, 0, Attenuation_5.NoAttenuation, index, gloss, 0, true);
                    this.type = Material_6.MaterialType.CLEAR;
                }
                return ClearMaterial;
            }(Material_5.Material));
            exports_23("ClearMaterial", ClearMaterial);
        }
    }
});
System.register("core/src/engine/scene/materials/GlossyMaterial", ["core/src/engine/scene/materials/Material", "core/src/engine/scene/materials/Attenuation"], function(exports_24, context_24) {
    "use strict";
    var __moduleName = context_24 && context_24.id;
    var Material_7, Attenuation_6, Material_8;
    var GlossyMaterial;
    return {
        setters:[
            function (Material_7_1) {
                Material_7 = Material_7_1;
                Material_8 = Material_7_1;
            },
            function (Attenuation_6_1) {
                Attenuation_6 = Attenuation_6_1;
            }],
        execute: function() {
            GlossyMaterial = (function (_super) {
                __extends(GlossyMaterial, _super);
                function GlossyMaterial(color, index, gloss) {
                    _super.call(this, color, null, null, null, 1, 0, Attenuation_6.NoAttenuation, index, gloss, 0, false);
                    this.type = Material_8.MaterialType.GLOSSY;
                }
                return GlossyMaterial;
            }(Material_7.Material));
            exports_24("GlossyMaterial", GlossyMaterial);
        }
    }
});
System.register("core/src/engine/scene/materials/LightMaterial", ["core/src/engine/scene/materials/Material"], function(exports_25, context_25) {
    "use strict";
    var __moduleName = context_25 && context_25.id;
    var Material_9, Material_10;
    var LightMaterial;
    return {
        setters:[
            function (Material_9_1) {
                Material_9 = Material_9_1;
                Material_10 = Material_9_1;
            }],
        execute: function() {
            LightMaterial = (function (_super) {
                __extends(LightMaterial, _super);
                function LightMaterial(color, emittance, attenuation) {
                    _super.call(this, color, null, null, null, 1, emittance, attenuation, 1, 0, 0, false);
                    this.type = Material_10.MaterialType.EMISSIVE;
                }
                return LightMaterial;
            }(Material_9.Material));
            exports_25("LightMaterial", LightMaterial);
        }
    }
});
System.register("core/src/engine/scene/materials/MaterialUtils", ["core/src/engine/scene/materials/Material", "core/src/engine/math/Color", "core/src/engine/scene/materials/Texture", "core/src/engine/scene/materials/Attenuation", "core/src/engine/scene/materials/DiffuseMaterial", "core/src/engine/scene/materials/SpecularMaterial", "core/src/engine/scene/materials/ClearMaterial", "core/src/engine/scene/materials/GlossyMaterial", "core/src/engine/scene/materials/LightMaterial"], function(exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    var Material_11, Material_12, Color_4, Texture_1, Attenuation_7, DiffuseMaterial_1, SpecularMaterial_1, ClearMaterial_1, GlossyMaterial_1, LightMaterial_1;
    var MaterialUtils;
    return {
        setters:[
            function (Material_11_1) {
                Material_11 = Material_11_1;
                Material_12 = Material_11_1;
            },
            function (Color_4_1) {
                Color_4 = Color_4_1;
            },
            function (Texture_1_1) {
                Texture_1 = Texture_1_1;
            },
            function (Attenuation_7_1) {
                Attenuation_7 = Attenuation_7_1;
            },
            function (DiffuseMaterial_1_1) {
                DiffuseMaterial_1 = DiffuseMaterial_1_1;
            },
            function (SpecularMaterial_1_1) {
                SpecularMaterial_1 = SpecularMaterial_1_1;
            },
            function (ClearMaterial_1_1) {
                ClearMaterial_1 = ClearMaterial_1_1;
            },
            function (GlossyMaterial_1_1) {
                GlossyMaterial_1 = GlossyMaterial_1_1;
            },
            function (LightMaterial_1_1) {
                LightMaterial_1 = LightMaterial_1_1;
            }],
        execute: function() {
            MaterialUtils = (function () {
                function MaterialUtils() {
                }
                MaterialUtils.fromJson = function (material) {
                    if (!material)
                        return null;
                    switch (material.type) {
                        case Material_12.MaterialType.GENERIC:
                            return new Material_11.Material(Color_4.Color.fromJson(material.color), Texture_1.Texture.fromJson(material.texture), Texture_1.Texture.fromJson(material.normalTexture), Texture_1.Texture.fromJson(material.bumpTexture), material.bumpMultiplier, material.emittance, Attenuation_7.Attenuation.fromJson(material.attenuation), material.index, material.gloss, material.tint, material.transparent);
                        case Material_12.MaterialType.DIFFUSE:
                            return new DiffuseMaterial_1.DiffuseMaterial(Color_4.Color.fromJson(material.color));
                        case Material_12.MaterialType.SPECULAR:
                            return new SpecularMaterial_1.SpecularMaterial(Color_4.Color.fromJson(material.color), material.index);
                        case Material_12.MaterialType.CLEAR:
                            return new ClearMaterial_1.ClearMaterial(material.index, material.gloss);
                        case Material_12.MaterialType.GLOSSY:
                            return new GlossyMaterial_1.GlossyMaterial(Color_4.Color.fromJson(material.color), material.index, material.gloss);
                        case Material_12.MaterialType.EMISSIVE:
                            return new LightMaterial_1.LightMaterial(Color_4.Color.fromJson(material.color), material.emittance, Attenuation_7.Attenuation.fromJson(material.attenuation));
                    }
                };
                MaterialUtils.debug = true;
                return MaterialUtils;
            }());
            exports_26("MaterialUtils", MaterialUtils);
        }
    }
});
System.register("core/src/engine/scene/shapes/Cube", ["core/src/engine/math/Vector3", "core/src/engine/scene/materials/Material", "core/src/engine/scene/shapes/Box", "core/src/engine/math/Constants", "core/src/engine/math/Hit", "core/src/engine/scene/shapes/Shape", "core/src/engine/scene/materials/MaterialUtils"], function(exports_27, context_27) {
    "use strict";
    var __moduleName = context_27 && context_27.id;
    var Vector3_3, Material_13, Box_1, Constants_6, Hit_1, Hit_2, Shape_1, MaterialUtils_1;
    var Cube;
    return {
        setters:[
            function (Vector3_3_1) {
                Vector3_3 = Vector3_3_1;
            },
            function (Material_13_1) {
                Material_13 = Material_13_1;
            },
            function (Box_1_1) {
                Box_1 = Box_1_1;
            },
            function (Constants_6_1) {
                Constants_6 = Constants_6_1;
            },
            function (Hit_1_1) {
                Hit_1 = Hit_1_1;
                Hit_2 = Hit_1_1;
            },
            function (Shape_1_1) {
                Shape_1 = Shape_1_1;
            },
            function (MaterialUtils_1_1) {
                MaterialUtils_1 = MaterialUtils_1_1;
            }],
        execute: function() {
            Cube = (function () {
                function Cube(min, max, material, box) {
                    if (min === void 0) { min = new Vector3_3.Vector3(); }
                    if (max === void 0) { max = new Vector3_3.Vector3(); }
                    if (material === void 0) { material = null; }
                    if (box === void 0) { box = null; }
                    this.min = min;
                    this.max = max;
                    this.material = material;
                    this.box = box;
                    this.type = Shape_1.ShapeType.CUBE;
                    this.memorySize = (Vector3_3.Vector3.SIZE * 2) + 2;
                }
                Cube.prototype.write = function (memory) {
                    memory.writeByte(this.type);
                    this.min.write(memory);
                    this.max.write(memory);
                    memory.writeInt(this.material.index);
                    return memory.position;
                };
                Cube.prototype.read = function (memory) {
                    this.min.read(memory);
                    this.max.read(memory);
                    var materialIndex = memory.readInt();
                    this.box = new Box_1.Box(this.min, this.max);
                    var material = Material_13.Material.map[materialIndex];
                    if (material) {
                        this.material = material;
                    }
                    return memory.position;
                };
                Cube.prototype.directWrite = function (memory, offset) {
                    memory[offset++] = this.type;
                    offset = this.min.directWrite(memory, offset);
                    offset = this.max.directWrite(memory, offset);
                    memory[offset++] = this.material.index;
                    return offset;
                };
                Cube.prototype.directRead = function (memory, offset) {
                    offset = this.min.directRead(memory, offset);
                    offset = this.max.directRead(memory, offset);
                    this.box = new Box_1.Box(this.min, this.max);
                    this.material.index = memory[offset++];
                    var material = Material_13.Material.map[this.material.index];
                    if (material) {
                        this.material = material;
                    }
                    return offset;
                };
                Cube.fromJson = function (shape) {
                    return new Cube(Vector3_3.Vector3.fromJson(shape.min), Vector3_3.Vector3.fromJson(shape.max), MaterialUtils_1.MaterialUtils.fromJson(shape.material), Box_1.Box.fromJson(shape.box));
                };
                Cube.newCube = function (min, max, material) {
                    var box = new Box_1.Box(min, max);
                    return new Cube(min, max, material, box);
                };
                Cube.prototype.compile = function () {
                };
                Cube.prototype.intersect = function (r) {
                    var n = this.min.sub(r.origin).div(r.direction);
                    var f = this.max.sub(r.origin).div(r.direction);
                    var _n = n;
                    n = _n.min(f);
                    f = _n.max(f);
                    var t0 = Math.max(Math.max(n.x, n.y), n.z);
                    var t1 = Math.min(Math.min(f.x, f.y), f.z);
                    if (t0 > 0 && t0 < t1) {
                        return new Hit_1.Hit(this, t0);
                    }
                    return Hit_2.NoHit;
                };
                Cube.prototype.getColor = function (p) {
                    return this.material.color;
                };
                Cube.prototype.getMaterial = function (p) {
                    return this.material;
                };
                Cube.prototype.getNormal = function (p) {
                    if (p.x < this.min.x + Constants_6.EPS) {
                        return new Vector3_3.Vector3(-1, 0, 0);
                    }
                    else if (p.x > this.max.x - Constants_6.EPS) {
                        return new Vector3_3.Vector3(1, 0, 0);
                    }
                    else if (p.y < this.min.y + Constants_6.EPS) {
                        return new Vector3_3.Vector3(0, -1, 0);
                    }
                    else if (p.y > this.max.y - Constants_6.EPS) {
                        return new Vector3_3.Vector3(0, 1, 0);
                    }
                    else if (p.z < this.min.z + Constants_6.EPS) {
                        return new Vector3_3.Vector3(0, 0, -1);
                    }
                    else if (p.z > this.max.z - Constants_6.EPS) {
                        return new Vector3_3.Vector3(0, 0, 1);
                    }
                    return new Vector3_3.Vector3(0, 1, 0);
                };
                Cube.prototype.getRandomPoint = function () {
                    var x = this.min.x + Math.random() * (this.max.x - this.min.x);
                    var y = this.min.y + Math.random() * (this.max.y - this.min.y);
                    var z = this.min.z + Math.random() * (this.max.z - this.min.z);
                    return new Vector3_3.Vector3(x, y, z);
                };
                return Cube;
            }());
            exports_27("Cube", Cube);
        }
    }
});
System.register("core/src/engine/scene/shapes/Sphere", ["core/src/engine/math/Vector3", "core/src/engine/scene/materials/Material", "core/src/engine/scene/shapes/Box", "core/src/engine/math/Hit", "core/src/engine/scene/shapes/Shape", "core/src/engine/scene/materials/MaterialUtils"], function(exports_28, context_28) {
    "use strict";
    var __moduleName = context_28 && context_28.id;
    var Vector3_4, Material_14, Box_2, Hit_3, Hit_4, Shape_2, MaterialUtils_2;
    var Sphere;
    return {
        setters:[
            function (Vector3_4_1) {
                Vector3_4 = Vector3_4_1;
            },
            function (Material_14_1) {
                Material_14 = Material_14_1;
            },
            function (Box_2_1) {
                Box_2 = Box_2_1;
            },
            function (Hit_3_1) {
                Hit_3 = Hit_3_1;
                Hit_4 = Hit_3_1;
            },
            function (Shape_2_1) {
                Shape_2 = Shape_2_1;
            },
            function (MaterialUtils_2_1) {
                MaterialUtils_2 = MaterialUtils_2_1;
            }],
        execute: function() {
            Sphere = (function () {
                function Sphere(center, radius, material, box) {
                    if (center === void 0) { center = new Vector3_4.Vector3(); }
                    if (radius === void 0) { radius = 1; }
                    if (material === void 0) { material = null; }
                    if (box === void 0) { box = null; }
                    this.center = center;
                    this.radius = radius;
                    this.material = material;
                    this.box = box;
                    this.type = Shape_2.ShapeType.SPHERE;
                    this.memorySize = Vector3_4.Vector3.SIZE + 3;
                    if (!box && center) {
                        var min = new Vector3_4.Vector3(center.x - radius, center.y - radius, center.z - radius);
                        var max = new Vector3_4.Vector3(center.x + radius, center.y + radius, center.z + radius);
                        this.box = new Box_2.Box(min, max);
                    }
                }
                Sphere.prototype.directRead = function (memory, offset) {
                    offset = this.center.directRead(memory, offset);
                    this.radius = memory[offset++];
                    var min = new Vector3_4.Vector3(this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);
                    var max = new Vector3_4.Vector3(this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
                    this.box = new Box_2.Box(min, max);
                    var materialIndex = memory[offset++];
                    var material = Material_14.Material.map[materialIndex];
                    if (material) {
                        this.material = material;
                    }
                    return offset;
                };
                Sphere.prototype.directWrite = function (memory, offset) {
                    memory[offset++] = this.type;
                    offset = this.center.directWrite(memory, offset);
                    memory[offset++] = this.radius;
                    memory[offset++] = this.material.index;
                    return offset;
                };
                Sphere.prototype.read = function (memory) {
                    this.center.read(memory);
                    this.radius = memory.readFloat();
                    var min = new Vector3_4.Vector3(this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);
                    var max = new Vector3_4.Vector3(this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
                    this.box = new Box_2.Box(min, max);
                    var materialIndex = memory.readInt();
                    var material = Material_14.Material.map[materialIndex];
                    if (material) {
                        this.material = material;
                    }
                    return memory.position;
                };
                Sphere.prototype.write = function (memory) {
                    memory.writeByte(this.type);
                    this.center.write(memory);
                    memory.writeFloat(this.radius);
                    memory.writeInt(this.material.index);
                    return memory.position;
                };
                Sphere.fromJson = function (sphere) {
                    return new Sphere(Vector3_4.Vector3.fromJson(sphere.center), sphere.radius, MaterialUtils_2.MaterialUtils.fromJson(sphere.material), Box_2.Box.fromJson(sphere.box));
                };
                Sphere.newSphere = function (center, radius, material) {
                    var min = new Vector3_4.Vector3(center.x - radius, center.y - radius, center.z - radius);
                    var max = new Vector3_4.Vector3(center.x + radius, center.y + radius, center.z + radius);
                    var box = new Box_2.Box(min, max);
                    return new Sphere(center, radius, material, box);
                };
                Sphere.prototype.compile = function () {
                };
                Sphere.prototype.intersect = function (r) {
                    var to = r.origin.sub(this.center);
                    var b = to.dot(r.direction);
                    var c = to.dot(to) - this.radius * this.radius;
                    var d = b * b - c;
                    if (d > 0) {
                        d = Math.sqrt(d);
                        var t1 = -b - d;
                        if (t1 > 0) {
                            return new Hit_3.Hit(this, t1);
                        }
                    }
                    return Hit_4.NoHit;
                };
                Sphere.prototype.getColor = function (p) {
                    if (this.material.texture == null) {
                        return this.material.color;
                    }
                    var u = Math.atan2(p.z, p.x);
                    var v = Math.atan2(p.y, new Vector3_4.Vector3(p.x, 0, p.z).length());
                    u = (u + Math.PI) / (2 * Math.PI);
                    v = 1 - (v + Math.PI / 2) / Math.PI;
                    return this.material.texture.sample(u, v);
                };
                Sphere.prototype.getMaterial = function (p) {
                    return this.material;
                };
                Sphere.prototype.getNormal = function (p) {
                    return p.sub(this.center).normalize();
                };
                Sphere.prototype.getRandomPoint = function () {
                    while (true) {
                        var x = Math.random() * 2 - 1;
                        var y = Math.random() * 2 - 1;
                        var z = Math.random() * 2 - 1;
                        var v = new Vector3_4.Vector3(x, y, z);
                        if (v.length() <= 1) {
                            return v.mulScalar(this.radius).add(this.center);
                        }
                    }
                };
                return Sphere;
            }());
            exports_28("Sphere", Sphere);
        }
    }
});
System.register("core/src/engine/math/Matrix4", ["core/src/engine/math/Vector3", "core/src/engine/scene/shapes/Box", "core/src/engine/math/Ray"], function(exports_29, context_29) {
    "use strict";
    var __moduleName = context_29 && context_29.id;
    var Vector3_5, Box_3, Ray_2;
    var Matrix4;
    return {
        setters:[
            function (Vector3_5_1) {
                Vector3_5 = Vector3_5_1;
            },
            function (Box_3_1) {
                Box_3 = Box_3_1;
            },
            function (Ray_2_1) {
                Ray_2 = Ray_2_1;
            }],
        execute: function() {
            Matrix4 = (function () {
                function Matrix4(x00, x01, x02, x03, x10, x11, x12, x13, x20, x21, x22, x23, x30, x31, x32, x33) {
                    if (x00 === void 0) { x00 = 0; }
                    if (x01 === void 0) { x01 = 0; }
                    if (x02 === void 0) { x02 = 0; }
                    if (x03 === void 0) { x03 = 0; }
                    if (x10 === void 0) { x10 = 0; }
                    if (x11 === void 0) { x11 = 0; }
                    if (x12 === void 0) { x12 = 0; }
                    if (x13 === void 0) { x13 = 0; }
                    if (x20 === void 0) { x20 = 0; }
                    if (x21 === void 0) { x21 = 0; }
                    if (x22 === void 0) { x22 = 0; }
                    if (x23 === void 0) { x23 = 0; }
                    if (x30 === void 0) { x30 = 0; }
                    if (x31 === void 0) { x31 = 0; }
                    if (x32 === void 0) { x32 = 0; }
                    if (x33 === void 0) { x33 = 0; }
                    this.x00 = x00;
                    this.x01 = x01;
                    this.x02 = x02;
                    this.x03 = x03;
                    this.x10 = x10;
                    this.x11 = x11;
                    this.x12 = x12;
                    this.x13 = x13;
                    this.x20 = x20;
                    this.x21 = x21;
                    this.x22 = x22;
                    this.x23 = x23;
                    this.x30 = x30;
                    this.x31 = x31;
                    this.x32 = x32;
                    this.x33 = x33;
                    this.m = new Float32Array(16);
                }
                Matrix4.prototype.directRead = function (memory, offset) {
                    var m = this;
                    m.x00 = memory[offset++];
                    m.x01 = memory[offset++];
                    m.x02 = memory[offset++];
                    m.x03 = memory[offset++];
                    m.x10 = memory[offset++];
                    m.x11 = memory[offset++];
                    m.x12 = memory[offset++];
                    m.x13 = memory[offset++];
                    m.x20 = memory[offset++];
                    m.x21 = memory[offset++];
                    m.x22 = memory[offset++];
                    m.x23 = memory[offset++];
                    m.x30 = memory[offset++];
                    m.x31 = memory[offset++];
                    m.x32 = memory[offset++];
                    m.x33 = memory[offset++];
                    return offset;
                };
                Matrix4.prototype.directWrite = function (memory, offset) {
                    var m = this;
                    memory[offset++] = m.x00;
                    memory[offset++] = m.x01;
                    memory[offset++] = m.x02;
                    memory[offset++] = m.x03;
                    memory[offset++] = m.x10;
                    memory[offset++] = m.x11;
                    memory[offset++] = m.x12;
                    memory[offset++] = m.x13;
                    memory[offset++] = m.x20;
                    memory[offset++] = m.x21;
                    memory[offset++] = m.x22;
                    memory[offset++] = m.x23;
                    memory[offset++] = m.x30;
                    memory[offset++] = m.x31;
                    memory[offset++] = m.x32;
                    memory[offset++] = m.x33;
                    return offset;
                };
                Matrix4.prototype.read = function (memory) {
                    this.x00 = memory.readFloat();
                    this.x01 = memory.readFloat();
                    this.x02 = memory.readFloat();
                    this.x03 = memory.readFloat();
                    this.x10 = memory.readFloat();
                    this.x11 = memory.readFloat();
                    this.x12 = memory.readFloat();
                    this.x13 = memory.readFloat();
                    this.x20 = memory.readFloat();
                    this.x21 = memory.readFloat();
                    this.x22 = memory.readFloat();
                    this.x23 = memory.readFloat();
                    this.x30 = memory.readFloat();
                    this.x31 = memory.readFloat();
                    this.x32 = memory.readFloat();
                    this.x33 = memory.readFloat();
                    return memory.position;
                };
                Matrix4.prototype.write = function (memory) {
                    memory.writeFloat(this.x00);
                    memory.writeFloat(this.x01);
                    memory.writeFloat(this.x02);
                    memory.writeFloat(this.x03);
                    memory.writeFloat(this.x10);
                    memory.writeFloat(this.x11);
                    memory.writeFloat(this.x12);
                    memory.writeFloat(this.x13);
                    memory.writeFloat(this.x20);
                    memory.writeFloat(this.x21);
                    memory.writeFloat(this.x22);
                    memory.writeFloat(this.x23);
                    memory.writeFloat(this.x30);
                    memory.writeFloat(this.x31);
                    memory.writeFloat(this.x32);
                    memory.writeFloat(this.x33);
                    return memory.position;
                };
                Matrix4.fromJson = function (m) {
                    return new Matrix4(m.x00, m.x01, m.x02, m.x03, m.x10, m.x11, m.x12, m.x13, m.x20, m.x21, m.x22, m.x23, m.x30, m.x31, m.x32, m.x33);
                };
                Matrix4.fromTHREEJS = function (e) {
                    return new Matrix4(e[0], e[4], e[8], e[12], e[1], e[5], e[9], e[13], e[2], e[6], e[10], e[14], e[3], e[7], e[11], e[15]);
                };
                Matrix4.identity = function () {
                    return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
                };
                Matrix4.translate = function (v) {
                    return new Matrix4(1, 0, 0, v.x, 0, 1, 0, v.y, 0, 0, 1, v.z, 0, 0, 0, 1);
                };
                Matrix4.scale = function (v) {
                    return new Matrix4(v.x, 0, 0, 0, 0, v.y, 0, 0, 0, 0, v.z, 0, 0, 0, 0, 1);
                };
                Matrix4.rotate = function (v, a) {
                    v = v.normalize();
                    var s = Math.sin(a);
                    var c = Math.cos(a);
                    var m = 1 - c;
                    return new Matrix4(m * v.x * v.x + c, m * v.x * v.y + v.z * s, m * v.z * v.x - v.y * s, 0, m * v.x * v.y - v.z * s, m * v.y * v.y + c, m * v.y * v.z + v.x * s, 0, m * v.z * v.x + v.y * s, m * v.y * v.z - v.x * s, m * v.z * v.z + c, 0, 0, 0, 0, 1);
                };
                Matrix4.frustum = function (l, r, b, t, n, f) {
                    var t1 = 2 * n;
                    var t2 = r - l;
                    var t3 = t - b;
                    var t4 = f - n;
                    return new Matrix4(t1 / t2, 0, (r + l) / t2, 0, 0, t1 / t3, (t + b) / t3, 0, 0, 0, (-f - n) / t4, (-t1 * f) / t4, 0, 0, -1, 0);
                };
                Matrix4.orthographic = function (l, r, b, t, n, f) {
                    return new Matrix4(2 / (r - l), 0, 0, -(r + l) / (r - l), 0, 2 / (t - b), 0, -(t + b) / (t - b), 0, 0, -2 / (f - n), -(f + n) / (f - n), 0, 0, 0, 1);
                };
                Matrix4.perspective = function (fov, aspect, near, far) {
                    var ymax = near * Math.tan(fov * Math.PI / 360);
                    var xmax = ymax * aspect;
                    return Matrix4.frustum(-xmax, xmax, -ymax, ymax, near, far);
                };
                Matrix4.LookAtMatrix = function (eye, center, up, fovy) {
                    up = up.normalize();
                    var f = center.sub(eye).normalize();
                    var s = f.cross(up);
                    var u = s.cross(f);
                    var m = new Matrix4(s.x, u.x, -f.x, eye.x, s.y, u.y, -f.y, eye.y, s.z, u.z, -f.z, eye.z, 0, 0, 0, 1);
                    return m.inverse();
                };
                Matrix4.prototype.translate = function (v) {
                    return Matrix4.translate(v).mul(this);
                };
                Matrix4.prototype.scale = function (v) {
                    return Matrix4.scale(v).mul(this);
                };
                Matrix4.prototype.rotate = function (v, a) {
                    return Matrix4.rotate(v, a).mul(this);
                };
                Matrix4.prototype.frustum = function (l, r, b, t, n, f) {
                    return Matrix4.frustum(l, r, b, t, n, f).mul(this);
                };
                Matrix4.prototype.orthographic = function (l, r, b, t, n, f) {
                    return Matrix4.orthographic(l, r, b, t, n, f).mul(this);
                };
                Matrix4.prototype.perspective = function (fov, aspect, near, far) {
                    return Matrix4.perspective(fov, aspect, near, far).mul(this);
                };
                Matrix4.prototype.mul = function (b) {
                    var a = this;
                    var m = new Matrix4();
                    m.x00 = a.x00 * b.x00 + a.x01 * b.x10 + a.x02 * b.x20 + a.x03 * b.x30;
                    m.x10 = a.x10 * b.x00 + a.x11 * b.x10 + a.x12 * b.x20 + a.x13 * b.x30;
                    m.x20 = a.x20 * b.x00 + a.x21 * b.x10 + a.x22 * b.x20 + a.x23 * b.x30;
                    m.x30 = a.x30 * b.x00 + a.x31 * b.x10 + a.x32 * b.x20 + a.x33 * b.x30;
                    m.x01 = a.x00 * b.x01 + a.x01 * b.x11 + a.x02 * b.x21 + a.x03 * b.x31;
                    m.x11 = a.x10 * b.x01 + a.x11 * b.x11 + a.x12 * b.x21 + a.x13 * b.x31;
                    m.x21 = a.x20 * b.x01 + a.x21 * b.x11 + a.x22 * b.x21 + a.x23 * b.x31;
                    m.x31 = a.x30 * b.x01 + a.x31 * b.x11 + a.x32 * b.x21 + a.x33 * b.x31;
                    m.x02 = a.x00 * b.x02 + a.x01 * b.x12 + a.x02 * b.x22 + a.x03 * b.x32;
                    m.x12 = a.x10 * b.x02 + a.x11 * b.x12 + a.x12 * b.x22 + a.x13 * b.x32;
                    m.x22 = a.x20 * b.x02 + a.x21 * b.x12 + a.x22 * b.x22 + a.x23 * b.x32;
                    m.x32 = a.x30 * b.x02 + a.x31 * b.x12 + a.x32 * b.x22 + a.x33 * b.x32;
                    m.x03 = a.x00 * b.x03 + a.x01 * b.x13 + a.x02 * b.x23 + a.x03 * b.x33;
                    m.x13 = a.x10 * b.x03 + a.x11 * b.x13 + a.x12 * b.x23 + a.x13 * b.x33;
                    m.x23 = a.x20 * b.x03 + a.x21 * b.x13 + a.x22 * b.x23 + a.x23 * b.x33;
                    m.x33 = a.x30 * b.x03 + a.x31 * b.x13 + a.x32 * b.x23 + a.x33 * b.x33;
                    return m;
                };
                Matrix4.prototype.mulPosition = function (b) {
                    var a = this;
                    var x = a.x00 * b.x + a.x01 * b.y + a.x02 * b.z + a.x03;
                    var y = a.x10 * b.x + a.x11 * b.y + a.x12 * b.z + a.x13;
                    var z = a.x20 * b.x + a.x21 * b.y + a.x22 * b.z + a.x23;
                    return new Vector3_5.Vector3(x, y, z);
                };
                Matrix4.prototype.mulDirection = function (b) {
                    var a = this;
                    var x = a.x00 * b.x + a.x01 * b.y + a.x02 * b.z;
                    var y = a.x10 * b.x + a.x11 * b.y + a.x12 * b.z;
                    var z = a.x20 * b.x + a.x21 * b.y + a.x22 * b.z;
                    return new Vector3_5.Vector3(x, y, z).normalize();
                };
                Matrix4.prototype.mulRay = function (b) {
                    var a = this;
                    return new Ray_2.Ray(a.mulPosition(b.origin), a.mulDirection(b.direction));
                };
                Matrix4.prototype.mulBox = function (box) {
                    var a = this;
                    var r = new Vector3_5.Vector3(a.x00, a.x10, a.x20);
                    var u = new Vector3_5.Vector3(a.x01, a.x11, a.x21);
                    var b = new Vector3_5.Vector3(a.x02, a.x12, a.x22);
                    var t = new Vector3_5.Vector3(a.x03, a.x13, a.x23);
                    var xa = r.mulScalar(box.min.x);
                    var xb = r.mulScalar(box.max.x);
                    var ya = u.mulScalar(box.min.y);
                    var yb = u.mulScalar(box.max.y);
                    var za = b.mulScalar(box.min.z);
                    var zb = b.mulScalar(box.max.z);
                    xa = xa.min(xb);
                    xb = xa.max(xb);
                    ya = ya.min(yb);
                    yb = ya.max(yb);
                    za = za.min(zb);
                    zb = za.max(zb);
                    var min = xa.add(ya).add(za).add(t);
                    var max = xb.add(yb).add(zb).add(t);
                    return new Box_3.Box(min, max);
                };
                Matrix4.prototype.transpose = function () {
                    var a = this;
                    return new Matrix4(a.x00, a.x10, a.x20, a.x30, a.x01, a.x11, a.x21, a.x31, a.x02, a.x12, a.x22, a.x32, a.x03, a.x13, a.x23, a.x33);
                };
                Matrix4.prototype.determinant = function () {
                    var a = this;
                    return (a.x00 * a.x11 * a.x22 * a.x33 - a.x00 * a.x11 * a.x23 * a.x32 +
                        a.x00 * a.x12 * a.x23 * a.x31 - a.x00 * a.x12 * a.x21 * a.x33 +
                        a.x00 * a.x13 * a.x21 * a.x32 - a.x00 * a.x13 * a.x22 * a.x31 -
                        a.x01 * a.x12 * a.x23 * a.x30 + a.x01 * a.x12 * a.x20 * a.x33 -
                        a.x01 * a.x13 * a.x20 * a.x32 + a.x01 * a.x13 * a.x22 * a.x30 -
                        a.x01 * a.x10 * a.x22 * a.x33 + a.x01 * a.x10 * a.x23 * a.x32 +
                        a.x02 * a.x13 * a.x20 * a.x31 - a.x02 * a.x13 * a.x21 * a.x30 +
                        a.x02 * a.x10 * a.x21 * a.x33 - a.x02 * a.x10 * a.x23 * a.x31 +
                        a.x02 * a.x11 * a.x23 * a.x30 - a.x02 * a.x11 * a.x20 * a.x33 -
                        a.x03 * a.x10 * a.x21 * a.x32 + a.x03 * a.x10 * a.x22 * a.x31 -
                        a.x03 * a.x11 * a.x22 * a.x30 + a.x03 * a.x11 * a.x20 * a.x32 -
                        a.x03 * a.x12 * a.x20 * a.x31 + a.x03 * a.x12 * a.x21 * a.x30);
                };
                Matrix4.prototype.inverse = function () {
                    var a = this;
                    var m = new Matrix4();
                    var d = a.determinant();
                    m.x00 = (a.x12 * a.x23 * a.x31 - a.x13 * a.x22 * a.x31 + a.x13 * a.x21 * a.x32 - a.x11 * a.x23 * a.x32 - a.x12 * a.x21 * a.x33 + a.x11 * a.x22 * a.x33) / d;
                    m.x01 = (a.x03 * a.x22 * a.x31 - a.x02 * a.x23 * a.x31 - a.x03 * a.x21 * a.x32 + a.x01 * a.x23 * a.x32 + a.x02 * a.x21 * a.x33 - a.x01 * a.x22 * a.x33) / d;
                    m.x02 = (a.x02 * a.x13 * a.x31 - a.x03 * a.x12 * a.x31 + a.x03 * a.x11 * a.x32 - a.x01 * a.x13 * a.x32 - a.x02 * a.x11 * a.x33 + a.x01 * a.x12 * a.x33) / d;
                    m.x03 = (a.x03 * a.x12 * a.x21 - a.x02 * a.x13 * a.x21 - a.x03 * a.x11 * a.x22 + a.x01 * a.x13 * a.x22 + a.x02 * a.x11 * a.x23 - a.x01 * a.x12 * a.x23) / d;
                    m.x10 = (a.x13 * a.x22 * a.x30 - a.x12 * a.x23 * a.x30 - a.x13 * a.x20 * a.x32 + a.x10 * a.x23 * a.x32 + a.x12 * a.x20 * a.x33 - a.x10 * a.x22 * a.x33) / d;
                    m.x11 = (a.x02 * a.x23 * a.x30 - a.x03 * a.x22 * a.x30 + a.x03 * a.x20 * a.x32 - a.x00 * a.x23 * a.x32 - a.x02 * a.x20 * a.x33 + a.x00 * a.x22 * a.x33) / d;
                    m.x12 = (a.x03 * a.x12 * a.x30 - a.x02 * a.x13 * a.x30 - a.x03 * a.x10 * a.x32 + a.x00 * a.x13 * a.x32 + a.x02 * a.x10 * a.x33 - a.x00 * a.x12 * a.x33) / d;
                    m.x13 = (a.x02 * a.x13 * a.x20 - a.x03 * a.x12 * a.x20 + a.x03 * a.x10 * a.x22 - a.x00 * a.x13 * a.x22 - a.x02 * a.x10 * a.x23 + a.x00 * a.x12 * a.x23) / d;
                    m.x20 = (a.x11 * a.x23 * a.x30 - a.x13 * a.x21 * a.x30 + a.x13 * a.x20 * a.x31 - a.x10 * a.x23 * a.x31 - a.x11 * a.x20 * a.x33 + a.x10 * a.x21 * a.x33) / d;
                    m.x21 = (a.x03 * a.x21 * a.x30 - a.x01 * a.x23 * a.x30 - a.x03 * a.x20 * a.x31 + a.x00 * a.x23 * a.x31 + a.x01 * a.x20 * a.x33 - a.x00 * a.x21 * a.x33) / d;
                    m.x22 = (a.x01 * a.x13 * a.x30 - a.x03 * a.x11 * a.x30 + a.x03 * a.x10 * a.x31 - a.x00 * a.x13 * a.x31 - a.x01 * a.x10 * a.x33 + a.x00 * a.x11 * a.x33) / d;
                    m.x23 = (a.x03 * a.x11 * a.x20 - a.x01 * a.x13 * a.x20 - a.x03 * a.x10 * a.x21 + a.x00 * a.x13 * a.x21 + a.x01 * a.x10 * a.x23 - a.x00 * a.x11 * a.x23) / d;
                    m.x30 = (a.x12 * a.x21 * a.x30 - a.x11 * a.x22 * a.x30 - a.x12 * a.x20 * a.x31 + a.x10 * a.x22 * a.x31 + a.x11 * a.x20 * a.x32 - a.x10 * a.x21 * a.x32) / d;
                    m.x31 = (a.x01 * a.x22 * a.x30 - a.x02 * a.x21 * a.x30 + a.x02 * a.x20 * a.x31 - a.x00 * a.x22 * a.x31 - a.x01 * a.x20 * a.x32 + a.x00 * a.x21 * a.x32) / d;
                    m.x32 = (a.x02 * a.x11 * a.x30 - a.x01 * a.x12 * a.x30 - a.x02 * a.x10 * a.x31 + a.x00 * a.x12 * a.x31 + a.x01 * a.x10 * a.x32 - a.x00 * a.x11 * a.x32) / d;
                    m.x33 = (a.x01 * a.x12 * a.x20 - a.x02 * a.x11 * a.x20 + a.x02 * a.x10 * a.x21 - a.x00 * a.x12 * a.x21 - a.x01 * a.x10 * a.x22 + a.x00 * a.x11 * a.x22) / d;
                    return m;
                };
                Matrix4.SIZE = 16;
                return Matrix4;
            }());
            exports_29("Matrix4", Matrix4);
        }
    }
});
System.register("core/src/engine/scene/shapes/TransformedShape", ["core/src/engine/math/Ray", "core/src/engine/scene/shapes/Shape", "core/src/engine/math/Matrix4", "core/src/engine/math/HitInfo"], function(exports_30, context_30) {
    "use strict";
    var __moduleName = context_30 && context_30.id;
    var Ray_3, Shape_3, Matrix4_1, HitInfo_2;
    var TransformedShape;
    return {
        setters:[
            function (Ray_3_1) {
                Ray_3 = Ray_3_1;
            },
            function (Shape_3_1) {
                Shape_3 = Shape_3_1;
            },
            function (Matrix4_1_1) {
                Matrix4_1 = Matrix4_1_1;
            },
            function (HitInfo_2_1) {
                HitInfo_2 = HitInfo_2_1;
            }],
        execute: function() {
            TransformedShape = (function () {
                function TransformedShape(shape, matrix, inverse, normalMatrix) {
                    if (shape === void 0) { shape = null; }
                    if (matrix === void 0) { matrix = new Matrix4_1.Matrix4(); }
                    if (inverse === void 0) { inverse = new Matrix4_1.Matrix4(); }
                    this.shape = shape;
                    this.matrix = matrix;
                    this.inverse = inverse;
                    this.normalMatrix = normalMatrix;
                    this.type = Shape_3.ShapeType.TRANSFORMED_SHAPE;
                }
                Object.defineProperty(TransformedShape.prototype, "memorySize", {
                    get: function () {
                        if (this.shape) {
                            return this.shape.memorySize + Matrix4_1.Matrix4.SIZE + 1;
                        }
                        else {
                            return 0;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                TransformedShape.prototype.directRead = function (memory, offset) {
                    offset = this.matrix.directRead(memory, offset);
                    this.inverse = this.matrix.inverse();
                    var container = [];
                    offset = Shape_3.directRestoreShape(memory, offset, container);
                    this.shape = container[0];
                    container = null;
                    return offset;
                };
                TransformedShape.prototype.directWrite = function (memory, offset) {
                    memory[offset++] = this.type;
                    offset = this.matrix.directWrite(memory, offset);
                    offset = this.shape.directWrite(memory, offset);
                    return offset;
                };
                TransformedShape.prototype.read = function (memory) {
                    this.matrix.read(memory);
                    this.inverse = this.matrix.inverse();
                    var container = [];
                    Shape_3.restoreShape(memory, container);
                    this.shape = container[0];
                    container = null;
                    return memory.position;
                };
                TransformedShape.prototype.write = function (memory) {
                    memory.writeByte(this.type);
                    this.matrix.write(memory);
                    this.shape.write(memory);
                    return memory.position;
                };
                TransformedShape.fromJson = function (transformedShape) {
                    return new TransformedShape(Shape_3.ShapefromJson(transformedShape.shape), Matrix4_1.Matrix4.fromJson(transformedShape.matrix), Matrix4_1.Matrix4.fromJson(transformedShape.inverse));
                };
                TransformedShape.newTransformedShape = function (s, m) {
                    return new TransformedShape(s, m, m.inverse());
                };
                Object.defineProperty(TransformedShape.prototype, "box", {
                    get: function () {
                        return this.matrix.mulBox(this.shape.box);
                    },
                    enumerable: true,
                    configurable: true
                });
                TransformedShape.prototype.compile = function () {
                    this.shape.compile();
                };
                TransformedShape.prototype.intersect = function (r) {
                    var shapeRay = this.inverse.mulRay(r);
                    var hit = this.shape.intersect(shapeRay);
                    if (!hit.ok()) {
                        return hit;
                    }
                    var shape = hit.shape;
                    var shapePosition = shapeRay.position(hit.T);
                    var shapeNormal = shape.getNormal(shapePosition);
                    var position = this.matrix.mulPosition(shapePosition);
                    var normal = this.inverse.transpose().mulDirection(shapeNormal);
                    var color = shape.getColor(shapePosition);
                    var material = shape.getMaterial(shapePosition);
                    var inside = false;
                    if (shapeNormal.dot(shapeRay.direction) > 0) {
                        normal = normal.mulScalar(-1);
                        inside = true;
                    }
                    var ray = new Ray_3.Ray(position, normal);
                    var info = new HitInfo_2.HitInfo(shape, position, normal, ray, color, material, inside);
                    hit.T = position.sub(r.origin).length();
                    hit.info = info;
                    return hit;
                };
                TransformedShape.prototype.getColor = function (p) {
                    return this.shape.getColor(this.inverse.mulPosition(p));
                };
                TransformedShape.prototype.getMaterial = function (p) {
                    return this.shape.getMaterial(this.inverse.mulPosition(p));
                };
                TransformedShape.prototype.getNormal = function (p) {
                    console.log("getNormal");
                    return null;
                };
                TransformedShape.prototype.getRandomPoint = function () {
                    return this.shape.getRandomPoint();
                };
                return TransformedShape;
            }());
            exports_30("TransformedShape", TransformedShape);
        }
    }
});
System.register("core/src/engine/scene/shapes/Shape", ["core/src/engine/scene/shapes/Cube", "core/src/engine/scene/shapes/Sphere", "core/src/engine/scene/shapes/Mesh", "core/src/engine/scene/shapes/Triangle", "core/src/engine/scene/shapes/TransformedShape"], function(exports_31, context_31) {
    "use strict";
    var __moduleName = context_31 && context_31.id;
    var Cube_1, Sphere_1, Mesh_1, Triangle_1, TransformedShape_1;
    var ShapeType;
    function ShapesfromJson(shapes) {
        var _shapes = [];
        shapes.forEach(function (shape) {
            switch (shape.type) {
                case ShapeType.CUBE:
                    _shapes.push(Cube_1.Cube.fromJson(shape));
                    break;
                case ShapeType.SPHERE:
                    _shapes.push(Sphere_1.Sphere.fromJson(shape));
                    break;
                case ShapeType.MESH:
                    _shapes.push(Mesh_1.Mesh.fromJson(shape));
                    break;
                case ShapeType.TRANSFORMED_SHAPE:
                    _shapes.push(TransformedShape_1.TransformedShape.fromJson(shape));
                    break;
                case ShapeType.TRIANGLE:
                    _shapes.push(Triangle_1.Triangle.fromJson(shape));
                    break;
            }
        });
        return _shapes;
    }
    exports_31("ShapesfromJson", ShapesfromJson);
    function ShapefromJson(shape) {
        switch (shape.type) {
            case ShapeType.CUBE:
                return Cube_1.Cube.fromJson(shape);
            case ShapeType.SPHERE:
                return Sphere_1.Sphere.fromJson(shape);
            case ShapeType.MESH:
                return Mesh_1.Mesh.fromJson(shape);
            case ShapeType.TRANSFORMED_SHAPE:
                return TransformedShape_1.TransformedShape.fromJson(shape);
            case ShapeType.TRIANGLE:
                return Triangle_1.Triangle.fromJson(shape);
        }
    }
    exports_31("ShapefromJson", ShapefromJson);
    function directRestoreShape(memory, offset, container) {
        var type = memory[offset++];
        switch (type) {
            case ShapeType.CUBE:
                var cube = new Cube_1.Cube();
                container.push(cube);
                return cube.directRead(memory, offset);
            case ShapeType.SPHERE:
                var sphere = new Sphere_1.Sphere();
                container.push(sphere);
                return sphere.directRead(memory, offset);
            case ShapeType.MESH:
                var mesh = new Mesh_1.Mesh();
                container.push(mesh);
                return mesh.directRead(memory, offset);
            case ShapeType.TRANSFORMED_SHAPE:
                var shape = new TransformedShape_1.TransformedShape();
                container.push(shape);
                return shape.directRead(memory, offset);
        }
    }
    exports_31("directRestoreShape", directRestoreShape);
    function restoreShape(memory, container) {
        var type = memory.readByte();
        switch (type) {
            case ShapeType.CUBE:
                var cube = new Cube_1.Cube();
                container.push(cube);
                return cube.read(memory);
            case ShapeType.SPHERE:
                var sphere = new Sphere_1.Sphere();
                container.push(sphere);
                return sphere.read(memory);
            case ShapeType.MESH:
                var mesh = new Mesh_1.Mesh();
                container.push(mesh);
                return mesh.read(memory);
            case ShapeType.TRANSFORMED_SHAPE:
                var shape = new TransformedShape_1.TransformedShape();
                container.push(shape);
                return shape.read(memory);
        }
    }
    exports_31("restoreShape", restoreShape);
    return {
        setters:[
            function (Cube_1_1) {
                Cube_1 = Cube_1_1;
            },
            function (Sphere_1_1) {
                Sphere_1 = Sphere_1_1;
            },
            function (Mesh_1_1) {
                Mesh_1 = Mesh_1_1;
            },
            function (Triangle_1_1) {
                Triangle_1 = Triangle_1_1;
            },
            function (TransformedShape_1_1) {
                TransformedShape_1 = TransformedShape_1_1;
            }],
        execute: function() {
            (function (ShapeType) {
                ShapeType[ShapeType["TRIANGLE"] = 0] = "TRIANGLE";
                ShapeType[ShapeType["CUBE"] = 1] = "CUBE";
                ShapeType[ShapeType["SPHERE"] = 2] = "SPHERE";
                ShapeType[ShapeType["MESH"] = 3] = "MESH";
                ShapeType[ShapeType["TRANSFORMED_SHAPE"] = 4] = "TRANSFORMED_SHAPE";
            })(ShapeType || (ShapeType = {}));
            exports_31("ShapeType", ShapeType);
        }
    }
});
System.register("core/src/engine/scene/shapes/Box", ["core/src/engine/math/Vector3", "core/src/engine/scene/Axis"], function(exports_32, context_32) {
    "use strict";
    var __moduleName = context_32 && context_32.id;
    var Vector3_6, Axis_1;
    var Box;
    return {
        setters:[
            function (Vector3_6_1) {
                Vector3_6 = Vector3_6_1;
            },
            function (Axis_1_1) {
                Axis_1 = Axis_1_1;
            }],
        execute: function() {
            Box = (function () {
                function Box(min, max) {
                    if (min === void 0) { min = new Vector3_6.Vector3(); }
                    if (max === void 0) { max = new Vector3_6.Vector3(); }
                    this.min = min;
                    this.max = max;
                    this.memorySize = Box.SIZE;
                }
                Box.prototype.directWrite = function (memory, offset) {
                    offset = this.min.directWrite(memory, offset);
                    offset = this.max.directWrite(memory, offset);
                    return offset;
                };
                Box.prototype.directRead = function (memory, offset) {
                    offset = this.min.directRead(memory, offset);
                    offset = this.max.directRead(memory, offset);
                    return offset;
                };
                Box.prototype.read = function (memory) {
                    this.min.read(memory);
                    this.max.read(memory);
                    return memory.position;
                };
                Box.prototype.write = function (memory) {
                    this.min.write(memory);
                    this.max.write(memory);
                    return memory.position;
                };
                Box.fromJson = function (box) {
                    return new Box(Vector3_6.Vector3.fromJson(box.min), Vector3_6.Vector3.fromJson(box.max));
                };
                Box.boxForShapes = function (shapes) {
                    if (shapes.length == 0) {
                        return new Box();
                    }
                    var box = shapes[0].box;
                    shapes.forEach(function (shape) {
                        box = box.extend(shape.box);
                    });
                    return box;
                };
                Box.boxForTriangles = function (shapes) {
                    if (shapes.length == 0) {
                        return new Box();
                    }
                    var box = shapes[0].box;
                    shapes.forEach(function (shape) {
                        box = box.extend(shape.box);
                    });
                    return box;
                };
                Box.prototype.anchor = function (anchor) {
                    return this.min.add(this.size().mul(anchor));
                };
                Box.prototype.center = function () {
                    return this.anchor(new Vector3_6.Vector3(0.5, 0.5, 0.5));
                };
                Box.prototype.size = function () {
                    return this.max.sub(this.min);
                };
                Box.prototype.extend = function (b) {
                    return new Box(this.min.min(b.min), this.max.max(b.max));
                };
                Box.prototype.intersect = function (r) {
                    var x1 = (this.min.x - r.origin.x) / r.direction.x;
                    var y1 = (this.min.y - r.origin.y) / r.direction.y;
                    var z1 = (this.min.z - r.origin.z) / r.direction.z;
                    var x2 = (this.max.x - r.origin.x) / r.direction.x;
                    var y2 = (this.max.y - r.origin.y) / r.direction.y;
                    var z2 = (this.max.z - r.origin.z) / r.direction.z;
                    if (x1 > x2) {
                        var _x1 = x1;
                        x1 = x2;
                        x2 = _x1;
                    }
                    if (y1 > y2) {
                        var _y1 = y1;
                        y1 = y2;
                        y2 = _y1;
                    }
                    if (z1 > z2) {
                        var _z1 = z1;
                        z1 = z2;
                        z2 = _z1;
                    }
                    var t1 = Math.max(Math.max(x1, y1), z1);
                    var t2 = Math.min(Math.min(x2, y2), z2);
                    return { min: t1, max: t2 };
                };
                Box.prototype.partition = function (axis, point) {
                    var left;
                    var right;
                    switch (axis) {
                        case Axis_1.Axis.AxisX:
                            left = this.min.x <= point;
                            right = this.max.x >= point;
                            break;
                        case Axis_1.Axis.AxisY:
                            left = this.min.y <= point;
                            right = this.max.y >= point;
                            break;
                        case Axis_1.Axis.AxisZ:
                            left = this.min.z <= point;
                            right = this.max.z >= point;
                            break;
                    }
                    return { left: left, right: right };
                };
                Box.prototype.toString = function () {
                    return "Box(min:" + this.min.toString() + ", max:" + this.max.toString() + ")";
                };
                Box.SIZE = Vector3_6.Vector3.SIZE * 2;
                return Box;
            }());
            exports_32("Box", Box);
        }
    }
});
System.register("core/src/engine/scene/shapes/Triangle", ["core/src/engine/scene/materials/Material", "core/src/engine/scene/shapes/Box", "core/src/engine/math/Vector3", "core/src/engine/math/Hit", "core/src/engine/math/Constants", "core/src/engine/math/Matrix4", "core/src/engine/scene/shapes/Shape", "core/src/engine/scene/materials/MaterialUtils", "core/src/pointer/src/ByteArrayBase"], function(exports_33, context_33) {
    "use strict";
    var __moduleName = context_33 && context_33.id;
    var Material_15, Box_4, Vector3_7, Hit_5, Constants_7, Hit_6, Matrix4_2, Shape_4, MaterialUtils_3, ByteArrayBase_2;
    var Triangle;
    return {
        setters:[
            function (Material_15_1) {
                Material_15 = Material_15_1;
            },
            function (Box_4_1) {
                Box_4 = Box_4_1;
            },
            function (Vector3_7_1) {
                Vector3_7 = Vector3_7_1;
            },
            function (Hit_5_1) {
                Hit_5 = Hit_5_1;
                Hit_6 = Hit_5_1;
            },
            function (Constants_7_1) {
                Constants_7 = Constants_7_1;
            },
            function (Matrix4_2_1) {
                Matrix4_2 = Matrix4_2_1;
            },
            function (Shape_4_1) {
                Shape_4 = Shape_4_1;
            },
            function (MaterialUtils_3_1) {
                MaterialUtils_3 = MaterialUtils_3_1;
            },
            function (ByteArrayBase_2_1) {
                ByteArrayBase_2 = ByteArrayBase_2_1;
            }],
        execute: function() {
            Triangle = (function () {
                function Triangle(material, box, v1, v2, v3, n1, n2, n3, t1, t2, t3) {
                    if (material === void 0) { material = null; }
                    if (box === void 0) { box = new Box_4.Box(); }
                    if (v1 === void 0) { v1 = new Vector3_7.Vector3(); }
                    if (v2 === void 0) { v2 = new Vector3_7.Vector3(); }
                    if (v3 === void 0) { v3 = new Vector3_7.Vector3(); }
                    if (n1 === void 0) { n1 = new Vector3_7.Vector3(); }
                    if (n2 === void 0) { n2 = new Vector3_7.Vector3(); }
                    if (n3 === void 0) { n3 = new Vector3_7.Vector3(); }
                    if (t1 === void 0) { t1 = new Vector3_7.Vector3(); }
                    if (t2 === void 0) { t2 = new Vector3_7.Vector3(); }
                    if (t3 === void 0) { t3 = new Vector3_7.Vector3(); }
                    this.material = material;
                    this.box = box;
                    this.v1 = v1;
                    this.v2 = v2;
                    this.v3 = v3;
                    this.n1 = n1;
                    this.n2 = n2;
                    this.n3 = n3;
                    this.t1 = t1;
                    this.t2 = t2;
                    this.t3 = t3;
                    this.type = Shape_4.ShapeType.TRIANGLE;
                    this.memorySize = Triangle.SIZE;
                }
                Triangle.prototype.directRead = function (memory, offset) {
                    offset++;
                    var materialIndex = memory[offset++];
                    var material = Material_15.Material.map[materialIndex];
                    if (material) {
                        this.material = material;
                    }
                    this.index = memory[offset++];
                    offset = this.v1.directRead(memory, offset);
                    offset = this.v2.directRead(memory, offset);
                    offset = this.v3.directRead(memory, offset);
                    offset = this.n1.directRead(memory, offset);
                    offset = this.n2.directRead(memory, offset);
                    offset = this.n3.directRead(memory, offset);
                    if (this.t1) {
                        offset = this.t1.directRead(memory, offset);
                    }
                    else {
                        offset = offset + Vector3_7.Vector3.SIZE;
                    }
                    if (this.t2) {
                        offset = this.t2.directRead(memory, offset);
                    }
                    else {
                        offset = offset + Vector3_7.Vector3.SIZE;
                    }
                    if (this.t3) {
                        offset = this.t3.directRead(memory, offset);
                    }
                    else {
                        offset = offset + Vector3_7.Vector3.SIZE;
                    }
                    this.updateBox();
                    return offset;
                };
                Triangle.prototype.directWrite = function (memory, offset) {
                    memory[offset++] = this.type;
                    memory[offset++] = this.material.index;
                    memory[offset++] = this.index;
                    offset = this.v1.directWrite(memory, offset);
                    offset = this.v2.directWrite(memory, offset);
                    offset = this.v3.directWrite(memory, offset);
                    offset = this.n1.directWrite(memory, offset);
                    offset = this.n2.directWrite(memory, offset);
                    offset = this.n3.directWrite(memory, offset);
                    if (this.t1) {
                        offset = this.t1.directWrite(memory, offset);
                    }
                    else {
                        offset = offset + Vector3_7.Vector3.SIZE;
                    }
                    if (this.t2) {
                        offset = this.t2.directWrite(memory, offset);
                    }
                    else {
                        offset = offset + Vector3_7.Vector3.SIZE;
                    }
                    if (this.t3) {
                        offset = this.t3.directWrite(memory, offset);
                    }
                    else {
                        offset = offset + Vector3_7.Vector3.SIZE;
                    }
                    return offset;
                };
                Triangle.prototype.read = function (memory) {
                    memory.position += ByteArrayBase_2.ByteArrayBase.SIZE_OF_UINT8;
                    var materialIndex = memory.readInt();
                    var material = Material_15.Material.map[materialIndex];
                    if (material) {
                        this.material = material;
                    }
                    this.index = memory.readInt();
                    this.v1.read(memory);
                    this.v2.read(memory);
                    this.v3.read(memory);
                    this.n1.read(memory);
                    this.n2.read(memory);
                    this.n3.read(memory);
                    this.t1.read(memory);
                    this.t2.read(memory);
                    this.t3.read(memory);
                    if (this.t1.isNullVector()) {
                        this.t1 = null;
                    }
                    if (this.t2.isNullVector()) {
                        this.t2 = null;
                    }
                    if (this.t3.isNullVector()) {
                        this.t3 = null;
                    }
                    this.updateBox();
                    return memory.position;
                };
                Triangle.prototype.write = function (memory) {
                    memory.writeByte(this.type);
                    memory.writeInt(this.material.index);
                    memory.writeInt(this.index);
                    this.v1.write(memory);
                    this.v2.write(memory);
                    this.v3.write(memory);
                    this.n1.write(memory);
                    this.n2.write(memory);
                    this.n3.write(memory);
                    if (this.t1) {
                        this.t1.write(memory);
                    }
                    else {
                        Vector3_7.Vector3.NullVector.write(memory);
                    }
                    if (this.t2) {
                        this.t2.write(memory);
                    }
                    else {
                        Vector3_7.Vector3.NullVector.write(memory);
                    }
                    if (this.t3) {
                        this.t3.write(memory);
                    }
                    else {
                        Vector3_7.Vector3.NullVector.write(memory);
                    }
                    return memory.position;
                };
                Triangle.fromJson = function (triangles) {
                    if (triangles instanceof Triangle) {
                        var t = triangles;
                        return new Triangle(MaterialUtils_3.MaterialUtils.fromJson(t.material), Box_4.Box.fromJson(t.box), Vector3_7.Vector3.fromJson(t.v1), Vector3_7.Vector3.fromJson(t.v2), Vector3_7.Vector3.fromJson(t.v3), Vector3_7.Vector3.fromJson(t.n1), Vector3_7.Vector3.fromJson(t.n2), Vector3_7.Vector3.fromJson(t.n3), Vector3_7.Vector3.fromJson(t.t1), Vector3_7.Vector3.fromJson(t.t2), Vector3_7.Vector3.fromJson(t.t3));
                    }
                    else {
                        var _ts = [];
                        var ts = triangles;
                        ts.forEach(function (t) {
                            _ts.push(new Triangle(MaterialUtils_3.MaterialUtils.fromJson(t.material), Box_4.Box.fromJson(t.box), Vector3_7.Vector3.fromJson(t.v1), Vector3_7.Vector3.fromJson(t.v2), Vector3_7.Vector3.fromJson(t.v3), Vector3_7.Vector3.fromJson(t.n1), Vector3_7.Vector3.fromJson(t.n2), Vector3_7.Vector3.fromJson(t.n3), Vector3_7.Vector3.fromJson(t.t1), Vector3_7.Vector3.fromJson(t.t2), Vector3_7.Vector3.fromJson(t.t3)));
                        });
                        return _ts;
                    }
                };
                Triangle.newTriangle = function (v1, v2, v3, t1, t2, t3, material) {
                    var t = new Triangle();
                    t.v1 = v1;
                    t.v2 = v2;
                    t.v3 = v3;
                    t.t1 = t1;
                    t.t2 = t2;
                    t.t3 = t3;
                    t.material = material;
                    t.updateBox();
                    t.fixNormals();
                    return t;
                };
                Triangle.prototype.compile = function () {
                };
                Object.defineProperty(Triangle.prototype, "vertices", {
                    get: function () {
                        return [this.v1, this.v2, this.v3];
                    },
                    enumerable: true,
                    configurable: true
                });
                Triangle.prototype.intersect = function (r) {
                    var e1 = this.v2.sub(this.v1);
                    var e2 = this.v3.sub(this.v1);
                    var p = r.direction.cross(e2);
                    var det = e1.dot(p);
                    if (det > -Constants_7.EPS && det < Constants_7.EPS) {
                        return Hit_6.NoHit;
                    }
                    var inv = 1 / det;
                    var t = r.origin.sub(this.v1);
                    var u = t.dot(p) * inv;
                    if (u < 0 || u > 1) {
                        return Hit_6.NoHit;
                    }
                    var q = t.cross(e1);
                    var v = r.direction.dot(q) * inv;
                    if (v < 0 || u + v > 1) {
                        return Hit_6.NoHit;
                    }
                    var d = e2.dot(q) * inv;
                    if (d < Constants_7.EPS) {
                        return Hit_6.NoHit;
                    }
                    return new Hit_5.Hit(this, d);
                };
                Triangle.prototype.getColor = function (p) {
                    var t = this;
                    if (t.material.texture == null) {
                        return t.material.color;
                    }
                    var _uvw = t.baryCentric(p);
                    var u = _uvw.u;
                    var v = _uvw.v;
                    var w = _uvw.w;
                    var n = new Vector3_7.Vector3();
                    n = n.add(t.t1.mulScalar(u));
                    n = n.add(t.t2.mulScalar(v));
                    n = n.add(t.t3.mulScalar(w));
                    return t.material.texture.sample(n.x, n.y);
                };
                Triangle.prototype.getMaterial = function (p) {
                    return this.material;
                };
                Triangle.prototype.getNormal = function (p) {
                    var t = this;
                    var _uvw = t.baryCentric(p);
                    var u = _uvw.u;
                    var v = _uvw.v;
                    var w = _uvw.w;
                    var n = new Vector3_7.Vector3();
                    n = n.add(t.n1.mulScalar(u));
                    n = n.add(t.n2.mulScalar(v));
                    n = n.add(t.n3.mulScalar(w));
                    n = n.normalize();
                    if (t.material.normalTexture != null) {
                        var b = new Vector3_7.Vector3();
                        b = b.add(t.t1.mulScalar(u));
                        b = b.add(t.t2.mulScalar(v));
                        b = b.add(t.t3.mulScalar(w));
                        var ns = t.material.normalTexture.normalSample(b.x, b.y);
                        var dv1 = t.v2.sub(t.v1);
                        var dv2 = t.v3.sub(t.v1);
                        var dt1 = t.t2.sub(t.t1);
                        var dt2 = t.t3.sub(t.t1);
                        var T = dv1.mulScalar(dt2.y).sub(dv2.mulScalar(dt1.y)).normalize();
                        var B = dv2.mulScalar(dt1.x).sub(dv1.mulScalar(dt2.x)).normalize();
                        var N = T.cross(B);
                        var matrix = new Matrix4_2.Matrix4(T.x, B.x, N.x, 0, T.y, B.y, N.y, 0, T.z, B.z, N.z, 0, 0, 0, 0, 1);
                        n = matrix.mulDirection(ns);
                    }
                    if (t.material.bumpTexture != null) {
                        var b = new Vector3_7.Vector3();
                        b = b.add(t.t1.mulScalar(u));
                        b = b.add(t.t2.mulScalar(v));
                        b = b.add(t.t3.mulScalar(w));
                        var bump = t.material.bumpTexture.bumpSample(b.x, b.y);
                        var dv1 = t.v2.sub(t.v1);
                        var dv2 = t.v3.sub(t.v1);
                        var dt1 = t.t2.sub(t.t1);
                        var dt2 = t.t3.sub(t.t1);
                        var tangent = dv1.mulScalar(dt2.y).sub(dv2.mulScalar(dt1.y)).normalize();
                        var biTangent = dv2.mulScalar(dt1.x).sub(dv1.mulScalar(dt2.x)).normalize();
                        n = n.add(tangent.mulScalar(bump.x * t.material.bumpMultiplier));
                        n = n.add(biTangent.mulScalar(bump.y * t.material.bumpMultiplier));
                    }
                    n = n.normalize();
                    return n;
                };
                Triangle.prototype.getRandomPoint = function () {
                    return new Vector3_7.Vector3();
                };
                Triangle.prototype.area = function () {
                    var t = this;
                    var e1 = t.v2.sub(t.v1);
                    var e2 = t.v3.sub(t.v1);
                    var n = e1.cross(e2);
                    return n.length() / 2;
                };
                Triangle.prototype.baryCentric = function (p) {
                    var t = this;
                    var v0 = t.v2.sub(t.v1);
                    var v1 = t.v3.sub(t.v1);
                    var v2 = p.sub(t.v1);
                    var d00 = v0.dot(v0);
                    var d01 = v0.dot(v1);
                    var d11 = v1.dot(v1);
                    var d20 = v2.dot(v0);
                    var d21 = v2.dot(v1);
                    var d = d00 * d11 - d01 * d01;
                    var v = (d11 * d20 - d01 * d21) / d;
                    var w = (d00 * d21 - d01 * d20) / d;
                    var u = 1 - v - w;
                    return { u: u, v: v, w: w };
                };
                Triangle.prototype.updateBox = function () {
                    var t = this;
                    var min = t.v1.min(t.v2).min(t.v3);
                    var max = t.v1.max(t.v2).max(t.v3);
                    t.box = new Box_4.Box(min, max);
                };
                Triangle.prototype.fixNormals = function () {
                    var t = this;
                    var e1 = t.v2.sub(t.v1);
                    var e2 = t.v3.sub(t.v1);
                    var n = e1.cross(e2).normalize();
                    var zero = new Vector3_7.Vector3();
                    if (t.n1 == undefined || t.n1.equals(zero)) {
                        t.n1 = n;
                    }
                    if (t.n2 == undefined || t.n2.equals(zero)) {
                        t.n2 = n;
                    }
                    if (t.n3 == undefined || t.n3.equals(zero)) {
                        t.n3 = n;
                    }
                };
                Triangle.SIZE = Box_4.Box.SIZE + (Vector3_7.Vector3.SIZE * 9) + 2;
                return Triangle;
            }());
            exports_33("Triangle", Triangle);
        }
    }
});
System.register("core/src/engine/utils/MapUtils", [], function(exports_34, context_34) {
    "use strict";
    var __moduleName = context_34 && context_34.id;
    function append(slice) {
        var elements = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            elements[_i - 1] = arguments[_i];
        }
        if (slice == undefined) {
            return elements;
        }
        else {
            slice.push.apply(slice, elements);
        }
        return slice;
    }
    exports_34("append", append);
    function sortAscending(slice) {
        slice.sort(function (a, b) {
            return a - b;
        });
    }
    exports_34("sortAscending", sortAscending);
    function sortDescending(slice) {
        slice.sort(function (a, b) {
            return b - a;
        });
    }
    exports_34("sortDescending", sortDescending);
    return {
        setters:[],
        execute: function() {
        }
    }
});
System.register("core/src/engine/scene/tree/Node", ["core/src/engine/scene/Axis", "core/src/engine/math/Hit", "core/src/engine/utils/MapUtils", "core/src/engine/utils/MathUtils"], function(exports_35, context_35) {
    "use strict";
    var __moduleName = context_35 && context_35.id;
    var Axis_2, Hit_7, MapUtils_1, MapUtils_2, MathUtils_2;
    var Node;
    return {
        setters:[
            function (Axis_2_1) {
                Axis_2 = Axis_2_1;
            },
            function (Hit_7_1) {
                Hit_7 = Hit_7_1;
            },
            function (MapUtils_1_1) {
                MapUtils_1 = MapUtils_1_1;
                MapUtils_2 = MapUtils_1_1;
            },
            function (MathUtils_2_1) {
                MathUtils_2 = MathUtils_2_1;
            }],
        execute: function() {
            Node = (function () {
                function Node(axis, point, shapes, left, right) {
                    this.axis = axis;
                    this.point = point;
                    this.shapes = shapes;
                    this.left = left;
                    this.right = right;
                    this.index = Node.map.push(this) - 1;
                }
                Node.newNode = function (shapes) {
                    return new Node(Axis_2.Axis.AxisNone, 0, shapes, null, null);
                };
                Node.prototype.intersect = function (r, tmin, tmax) {
                    var node = this;
                    var tsplit;
                    var leftFirst;
                    switch (node.axis) {
                        case Axis_2.Axis.AxisNone:
                            return node.intersectShapes(r);
                        case Axis_2.Axis.AxisX:
                            tsplit = (node.point - r.origin.x) / r.direction.x;
                            leftFirst = (r.origin.x < node.point) || (r.origin.x == node.point && r.direction.x <= 0);
                            break;
                        case Axis_2.Axis.AxisY:
                            tsplit = (node.point - r.origin.y) / r.direction.y;
                            leftFirst = (r.origin.y < node.point) || (r.origin.y == node.point && r.direction.y <= 0);
                            break;
                        case Axis_2.Axis.AxisZ:
                            tsplit = (node.point - r.origin.z) / r.direction.z;
                            leftFirst = (r.origin.z < node.point) || (r.origin.z == node.point && r.direction.z <= 0);
                            break;
                    }
                    var first;
                    var second;
                    if (leftFirst) {
                        first = node.left;
                        second = node.right;
                    }
                    else {
                        first = node.right;
                        second = node.left;
                    }
                    if (tsplit > tmax || tsplit <= 0) {
                        return first.intersect(r, tmin, tmax);
                    }
                    else if (tsplit < tmin) {
                        return second.intersect(r, tmin, tmax);
                    }
                    else {
                        var h1 = first.intersect(r, tmin, tsplit);
                        if (h1.T <= tsplit) {
                            return h1;
                        }
                        var h2 = second.intersect(r, tsplit, Math.min(tmax, h1.T));
                        if (h1.T <= h2.T) {
                            return h1;
                        }
                        else {
                            return h2;
                        }
                    }
                };
                Node.prototype.intersectShapes = function (r) {
                    var node = this;
                    var hit = Hit_7.NoHit;
                    node.shapes.forEach(function (shape) {
                        var h = shape.intersect(r);
                        if (h.T < hit.T) {
                            hit = h;
                        }
                    });
                    return hit;
                };
                Node.prototype.partitionScore = function (axis, point) {
                    var node = this;
                    var left = 0;
                    var right = 0;
                    node.shapes.forEach(function (shape) {
                        var box = shape.box;
                        var p = box.partition(axis, point);
                        if (p.left) {
                            left++;
                        }
                        if (p.right) {
                            right++;
                        }
                    });
                    if (left >= right) {
                        return left;
                    }
                    else {
                        return right;
                    }
                };
                Node.prototype.partition = function (size, axis, point) {
                    var node = this;
                    var left = [];
                    var right = [];
                    node.shapes.forEach(function (shape) {
                        var box = shape.box;
                        var p = box.partition(axis, point);
                        if (p.left) {
                            left = MapUtils_1.append(left, shape);
                        }
                        if (p.right) {
                            right = MapUtils_1.append(right, shape);
                        }
                    });
                    return { left: left, right: right };
                };
                Node.prototype.split = function (depth) {
                    var node = this;
                    if (node.shapes.length < 8) {
                        return;
                    }
                    var xs = [];
                    var ys = [];
                    var zs = [];
                    node.shapes.forEach(function (shape) {
                        var box = shape.box;
                        xs = MapUtils_1.append(xs, box.min.x);
                        xs = MapUtils_1.append(xs, box.max.x);
                        ys = MapUtils_1.append(ys, box.min.y);
                        ys = MapUtils_1.append(ys, box.max.y);
                        zs = MapUtils_1.append(zs, box.min.z);
                        zs = MapUtils_1.append(zs, box.max.z);
                    });
                    MapUtils_2.sortAscending(xs);
                    MapUtils_2.sortAscending(ys);
                    MapUtils_2.sortAscending(zs);
                    var mx = MathUtils_2.MathUtils.median(xs);
                    var my = MathUtils_2.MathUtils.median(ys);
                    var mz = MathUtils_2.MathUtils.median(zs);
                    var best = Math.round(node.shapes.length * 0.85);
                    var bestAxis = Axis_2.Axis.AxisNone;
                    var bestPoint = 0.0;
                    var sx = node.partitionScore(Axis_2.Axis.AxisX, mx);
                    if (sx < best) {
                        best = sx;
                        bestAxis = Axis_2.Axis.AxisX;
                        bestPoint = mx;
                    }
                    var sy = node.partitionScore(Axis_2.Axis.AxisY, my);
                    if (sy < best) {
                        best = sy;
                        bestAxis = Axis_2.Axis.AxisY;
                        bestPoint = my;
                    }
                    var sz = node.partitionScore(Axis_2.Axis.AxisZ, mz);
                    if (sz < best) {
                        best = sz;
                        bestAxis = Axis_2.Axis.AxisZ;
                        bestPoint = mz;
                    }
                    if (bestAxis == Axis_2.Axis.AxisNone) {
                        return;
                    }
                    var p = node.partition(best, bestAxis, bestPoint);
                    node.axis = bestAxis;
                    node.point = bestPoint;
                    node.left = Node.newNode(p.left);
                    node.right = Node.newNode(p.right);
                    node.left.split(depth + 1);
                    node.right.split(depth + 1);
                    node.shapes = null;
                };
                Node.map = [];
                return Node;
            }());
            exports_35("Node", Node);
        }
    }
});
System.register("core/src/engine/scene/tree/Tree", ["core/src/engine/scene/shapes/Box", "core/src/engine/scene/tree/Node", "core/src/engine/math/Hit"], function(exports_36, context_36) {
    "use strict";
    var __moduleName = context_36 && context_36.id;
    var Box_5, Node_1, Hit_8;
    var Tree;
    return {
        setters:[
            function (Box_5_1) {
                Box_5 = Box_5_1;
            },
            function (Node_1_1) {
                Node_1 = Node_1_1;
            },
            function (Hit_8_1) {
                Hit_8 = Hit_8_1;
            }],
        execute: function() {
            Tree = (function () {
                function Tree(box, root) {
                    this.box = box;
                    this.root = root;
                }
                Tree.newTree = function (shapes, box) {
                    if (box === void 0) { box = null; }
                    console.time("Building k-d tree (" + shapes.length + " shapes)... ");
                    box = box ? box : Box_5.Box.boxForShapes(shapes);
                    var node = Node_1.Node.newNode(shapes);
                    node.split(0);
                    console.timeEnd("Building k-d tree (" + shapes.length + " shapes)... ");
                    return new Tree(box, node);
                };
                Tree.prototype.intersect = function (r) {
                    var t = this.box.intersect(r);
                    if (t.max < t.min || t.max <= 0) {
                        return Hit_8.NoHit;
                    }
                    return this.root.intersect(r, t.min, t.max);
                };
                return Tree;
            }());
            exports_36("Tree", Tree);
        }
    }
});
System.register("core/src/engine/scene/tree/SharedNode", ["core/src/engine/scene/Axis", "core/src/engine/math/Hit", "core/src/engine/utils/MapUtils", "core/src/engine/utils/MathUtils", "core/src/pointer/src/ByteArrayBase", "core/src/pointer/src/DirectMemory"], function(exports_37, context_37) {
    "use strict";
    var __moduleName = context_37 && context_37.id;
    var Axis_3, Hit_9, MapUtils_3, MapUtils_4, MathUtils_3, ByteArrayBase_3, DirectMemory_4;
    var NodeMarker, SharedNode;
    return {
        setters:[
            function (Axis_3_1) {
                Axis_3 = Axis_3_1;
            },
            function (Hit_9_1) {
                Hit_9 = Hit_9_1;
            },
            function (MapUtils_3_1) {
                MapUtils_3 = MapUtils_3_1;
                MapUtils_4 = MapUtils_3_1;
            },
            function (MathUtils_3_1) {
                MathUtils_3 = MathUtils_3_1;
            },
            function (ByteArrayBase_3_1) {
                ByteArrayBase_3 = ByteArrayBase_3_1;
            },
            function (DirectMemory_4_1) {
                DirectMemory_4 = DirectMemory_4_1;
            }],
        execute: function() {
            (function (NodeMarker) {
                NodeMarker[NodeMarker["ROOT"] = 1118481] = "ROOT";
                NodeMarker[NodeMarker["LEFT"] = 15597585] = "LEFT";
                NodeMarker[NodeMarker["RIGHT"] = 1114350] = "RIGHT";
                NodeMarker[NodeMarker["LEAF"] = 15597806] = "LEAF";
                NodeMarker[NodeMarker["EON"] = 14737632] = "EON";
                NodeMarker[NodeMarker["NULL"] = 15658734] = "NULL";
            })(NodeMarker || (NodeMarker = {}));
            exports_37("NodeMarker", NodeMarker);
            SharedNode = (function () {
                function SharedNode(axis, point, shapes, shapeIndices, _left, _right) {
                    if (axis === void 0) { axis = null; }
                    if (point === void 0) { point = null; }
                    if (shapes === void 0) { shapes = null; }
                    if (shapeIndices === void 0) { shapeIndices = null; }
                    if (_left === void 0) { _left = null; }
                    if (_right === void 0) { _right = null; }
                    this.axis = axis;
                    this.point = point;
                    this.shapes = shapes;
                    this.shapeIndices = shapeIndices;
                    this._left = _left;
                    this._right = _right;
                    this.size = 0;
                    this.treeLength = 0;
                    this.thisPtr = -1;
                    this.resolved = false;
                    this.index = SharedNode.map.push(this) - 1;
                }
                Object.defineProperty(SharedNode.prototype, "left", {
                    get: function () {
                        if (!this._left) {
                            this.readChild(this.memory, NodeMarker.LEFT);
                        }
                        return this._left;
                    },
                    set: function (value) {
                        this._left = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SharedNode.prototype, "right", {
                    get: function () {
                        if (!this._right) {
                            this.readChild(this.memory, NodeMarker.RIGHT);
                        }
                        return this._right;
                    },
                    set: function (value) {
                        this._right = value;
                    },
                    enumerable: true,
                    configurable: true
                });
                SharedNode.prototype.readRoot = function (memory) {
                    this.memory = memory;
                    this.thisPtr = memory.position;
                    this.treeLength = memory.readUnsignedInt();
                    this.marker = memory.readUnsignedInt();
                    if (this.marker == NodeMarker.LEAF) {
                        this.axis = memory.readByte();
                        this.point = memory.readFloat();
                        var shapeLength = memory.readUnsignedInt();
                        this.shapeIndices = [];
                        for (var i = 0; i < shapeLength; i++) {
                            var shapeIndex = memory.readUnsignedInt();
                            this.shapeIndices.push(shapeIndex);
                        }
                        if (memory.readUnsignedInt() != NodeMarker.EON) {
                            console.error("End marker not found on leaf node");
                        }
                        this.resolved = true;
                        return memory.position;
                    }
                    else if (this.marker != NodeMarker.ROOT) {
                        throw "Root marker not found!, found:" + this.marker + ",  pos:" + memory.position;
                    }
                    else {
                        this.axis = memory.readByte();
                        this.point = memory.readFloat();
                        this.leftPtr = memory.readUnsignedInt();
                        this.rightPtr = memory.readUnsignedInt();
                    }
                    this.resolved = true;
                    memory.position = this.thisPtr + this.treeLength;
                    return memory.position;
                };
                SharedNode.prototype.read = function (memory) {
                    if (this.resolved) {
                        return;
                    }
                    this.memory = memory;
                    if (this.thisPtr == -1) {
                        this.thisPtr = memory.position;
                    }
                    else {
                        memory.position = this.thisPtr;
                    }
                    this.marker = memory.readUnsignedInt();
                    this.axis = memory.readByte();
                    this.point = memory.readFloat();
                    if (this.marker == NodeMarker.LEAF) {
                        var shapeLength = memory.readUnsignedInt();
                        this.shapeIndices = [];
                        for (var i = 0; i < shapeLength; i++) {
                            var shapeIndex = memory.readUnsignedInt();
                            this.shapeIndices.push(shapeIndex);
                        }
                        if (memory.readUnsignedInt() != NodeMarker.EON) {
                            console.error("End marker not found on leaf node");
                        }
                    }
                    else {
                        this.leftPtr = memory.readUnsignedInt();
                        this.rightPtr = memory.readUnsignedInt();
                    }
                    this.resolved = true;
                    return memory.position;
                };
                SharedNode.prototype.readChild = function (memory, marker) {
                    var node = new SharedNode();
                    if (marker == NodeMarker.LEFT) {
                        memory.position = this.leftPtr;
                        node.read(memory);
                        this.left = node;
                    }
                    else if (marker == NodeMarker.RIGHT) {
                        memory.position = this.rightPtr;
                        node.read(memory);
                        this.right = node;
                    }
                    return memory.position;
                };
                SharedNode.newNode = function (shapes, memory) {
                    var node = new SharedNode(Axis_3.Axis.AxisNone, 0, shapes, [], null, null);
                    node.memory = memory;
                    return node;
                };
                SharedNode.fromJson = function (node) {
                    return new SharedNode(node.axis, node.point, null, node.shapeIndices, node.left, node.right);
                };
                SharedNode.prototype.intersect = function (r, tmin, tmax) {
                    var node = this;
                    var tsplit;
                    var leftFirst;
                    switch (node.axis) {
                        case Axis_3.Axis.AxisNone:
                            return this.intersectShapes(node, r);
                        case Axis_3.Axis.AxisX:
                            tsplit = (node.point - r.origin.x) / r.direction.x;
                            leftFirst = (r.origin.x < node.point) || (r.origin.x == node.point && r.direction.x <= 0);
                            break;
                        case Axis_3.Axis.AxisY:
                            tsplit = (node.point - r.origin.y) / r.direction.y;
                            leftFirst = (r.origin.y < node.point) || (r.origin.y == node.point && r.direction.y <= 0);
                            break;
                        case Axis_3.Axis.AxisZ:
                            tsplit = (node.point - r.origin.z) / r.direction.z;
                            leftFirst = (r.origin.z < node.point) || (r.origin.z == node.point && r.direction.z <= 0);
                            break;
                    }
                    var first;
                    var second;
                    if (leftFirst) {
                        first = node.left;
                        second = node.right;
                    }
                    else {
                        first = node.right;
                        second = node.left;
                    }
                    if (!first || !second) {
                        console.log("node:", node);
                        console.log("null nodes found");
                    }
                    if (tsplit > tmax || tsplit <= 0) {
                        return this.intersectNode(first, r, tmin, tmax);
                    }
                    else if (tsplit < tmin) {
                        return this.intersectNode(second, r, tmin, tmax);
                    }
                    else {
                        var h1 = this.intersectNode(first, r, tmin, tsplit);
                        if (h1.T <= tsplit) {
                            return h1;
                        }
                        var h2 = this.intersectNode(second, r, tsplit, Math.min(tmax, h1.T));
                        if (h1.T <= h2.T) {
                            return h1;
                        }
                        else {
                            return h2;
                        }
                    }
                };
                SharedNode.prototype.intersectNode = function (node, r, tmin, tmax) {
                    var tsplit;
                    var leftFirst;
                    switch (node.axis) {
                        case Axis_3.Axis.AxisNone:
                            return this.intersectShapes(node, r);
                        case Axis_3.Axis.AxisX:
                            tsplit = (node.point - r.origin.x) / r.direction.x;
                            leftFirst = (r.origin.x < node.point) || (r.origin.x == node.point && r.direction.x <= 0);
                            break;
                        case Axis_3.Axis.AxisY:
                            tsplit = (node.point - r.origin.y) / r.direction.y;
                            leftFirst = (r.origin.y < node.point) || (r.origin.y == node.point && r.direction.y <= 0);
                            break;
                        case Axis_3.Axis.AxisZ:
                            tsplit = (node.point - r.origin.z) / r.direction.z;
                            leftFirst = (r.origin.z < node.point) || (r.origin.z == node.point && r.direction.z <= 0);
                            break;
                    }
                    var first;
                    var second;
                    if (leftFirst) {
                        first = node.left;
                        second = node.right;
                    }
                    else {
                        first = node.right;
                        second = node.left;
                    }
                    if (tsplit > tmax || tsplit <= 0) {
                        return this.intersectNode(first, r, tmin, tmax);
                    }
                    else if (tsplit < tmin) {
                        return this.intersectNode(second, r, tmin, tmax);
                    }
                    else {
                        var h1 = this.intersectNode(first, r, tmin, tsplit);
                        if (h1.T <= tsplit) {
                            return h1;
                        }
                        var h2 = this.intersectNode(second, r, tsplit, Math.min(tmax, h1.T));
                        if (h1.T <= h2.T) {
                            return h1;
                        }
                        else {
                            return h2;
                        }
                    }
                };
                SharedNode.prototype.intersectShapes = function (node, r) {
                    var hit = Hit_9.NoHit;
                    var self = this;
                    if (!node.resolved && !node.shapeIndices) {
                        node.read(this.memory);
                    }
                    var i = 0;
                    var shapeIndex;
                    var shape;
                    var h;
                    for (; i < node.shapeIndices.length; i++) {
                        shapeIndex = node.shapeIndices[i];
                        shape = self.shapes[shapeIndex];
                        h = shape.intersect(r);
                        if (h.T < hit.T) {
                            hit = h;
                        }
                    }
                    return hit;
                };
                SharedNode.prototype.partitionScore = function (axis, point) {
                    var node = this;
                    var left = 0;
                    var right = 0;
                    node.shapes.forEach(function (shape) {
                        var box = shape.box;
                        var p = box.partition(axis, point);
                        if (p.left) {
                            left++;
                        }
                        if (p.right) {
                            right++;
                        }
                    });
                    if (left >= right) {
                        return left;
                    }
                    else {
                        return right;
                    }
                };
                SharedNode.prototype.partition = function (size, axis, point) {
                    var node = this;
                    var left = [];
                    var right = [];
                    node.shapes.forEach(function (shape) {
                        var box = shape.box;
                        var p = box.partition(axis, point);
                        if (p.left) {
                            left = MapUtils_3.append(left, shape);
                        }
                        if (p.right) {
                            right = MapUtils_3.append(right, shape);
                        }
                    });
                    return { left: left, right: right };
                };
                SharedNode.prototype.split = function (depth) {
                    var node = this;
                    if (node.shapes.length < 8) {
                        var self = this;
                        this.memory.position -= DirectMemory_4.DirectMemory.SIZE_OF_UINT32;
                        this.memory.writeUnsignedInt(NodeMarker.LEAF);
                        this.memory.writeByte(Axis_3.Axis.AxisNone);
                        this.memory.writeFloat(0);
                        this.memory.writeUnsignedInt(node.shapes.length);
                        node.shapes.forEach(function (shape) {
                            if (self.memory) {
                                self.memory.writeUnsignedInt(shape.index);
                            }
                        });
                        if (this.memory) {
                            this.memory.writeUnsignedInt(NodeMarker.EON);
                        }
                        return false;
                    }
                    var xs = [];
                    var ys = [];
                    var zs = [];
                    node.shapes.forEach(function (shape) {
                        var box = shape.box;
                        xs = MapUtils_3.append(xs, box.min.x);
                        xs = MapUtils_3.append(xs, box.max.x);
                        ys = MapUtils_3.append(ys, box.min.y);
                        ys = MapUtils_3.append(ys, box.max.y);
                        zs = MapUtils_3.append(zs, box.min.z);
                        zs = MapUtils_3.append(zs, box.max.z);
                    });
                    MapUtils_4.sortAscending(xs);
                    MapUtils_4.sortAscending(ys);
                    MapUtils_4.sortAscending(zs);
                    var mx = MathUtils_3.MathUtils.median(xs);
                    var my = MathUtils_3.MathUtils.median(ys);
                    var mz = MathUtils_3.MathUtils.median(zs);
                    var best = Math.round(node.shapes.length * 0.85);
                    var bestAxis = Axis_3.Axis.AxisNone;
                    var bestPoint = 0.0;
                    var sx = node.partitionScore(Axis_3.Axis.AxisX, mx);
                    if (sx < best) {
                        best = sx;
                        bestAxis = Axis_3.Axis.AxisX;
                        bestPoint = mx;
                    }
                    var sy = node.partitionScore(Axis_3.Axis.AxisY, my);
                    if (sy < best) {
                        best = sy;
                        bestAxis = Axis_3.Axis.AxisY;
                        bestPoint = my;
                    }
                    var sz = node.partitionScore(Axis_3.Axis.AxisZ, mz);
                    if (sz < best) {
                        best = sz;
                        bestAxis = Axis_3.Axis.AxisZ;
                        bestPoint = mz;
                    }
                    if (bestAxis == Axis_3.Axis.AxisNone) {
                        var shapes = node.shapes;
                        var shapeIndices = [];
                        var self_1 = this;
                        if (this.memory) {
                            this.memory.position -= DirectMemory_4.DirectMemory.SIZE_OF_UINT32;
                            this.memory.writeUnsignedInt(NodeMarker.LEAF);
                            this.memory.writeByte(bestAxis);
                            this.memory.writeFloat(bestPoint);
                            this.memory.writeUnsignedInt(shapes.length);
                        }
                        shapes.forEach(function (shape) {
                            shapeIndices.push(shape.index);
                            if (self_1.memory) {
                                self_1.memory.writeUnsignedInt(shape.index);
                            }
                        });
                        if (this.memory) {
                            this.memory.writeUnsignedInt(NodeMarker.EON);
                        }
                        node.shapes = null;
                        node.shapeIndices = shapeIndices;
                        return true;
                    }
                    var p = node.partition(best, bestAxis, bestPoint);
                    node.axis = bestAxis;
                    node.point = bestPoint;
                    node.left = SharedNode.newNode(p.left, this.memory);
                    node.right = SharedNode.newNode(p.right, this.memory);
                    if (this.memory) {
                        this.memory.writeByte(bestAxis);
                        this.memory.writeFloat(bestPoint);
                        var leftStartPosition = this.memory.position + (2 * ByteArrayBase_3.ByteArrayBase.SIZE_OF_UINT32);
                        this.memory.writeUnsignedInt(leftStartPosition);
                        var rightLengthPosition = this.memory.position;
                        this.memory.position += ByteArrayBase_3.ByteArrayBase.SIZE_OF_UINT32;
                        this.memory.writeUnsignedInt(NodeMarker.LEFT);
                    }
                    node.left.split(depth + 1);
                    if (this.memory) {
                        var rightStartPosition = this.memory.position;
                        this.memory.position = rightLengthPosition;
                        this.memory.writeUnsignedInt(rightStartPosition);
                        this.memory.position = rightStartPosition;
                        this.memory.writeUnsignedInt(NodeMarker.RIGHT);
                    }
                    node.right.split(depth + 1);
                    if (this.memory) {
                        this.memory.writeUnsignedInt(NodeMarker.EON);
                    }
                    node.shapes = null;
                    return true;
                };
                SharedNode.map = [];
                return SharedNode;
            }());
            exports_37("SharedNode", SharedNode);
        }
    }
});
System.register("core/src/engine/scene/tree/SharedTree", ["core/src/engine/scene/shapes/Box", "core/src/engine/math/Hit", "core/src/engine/scene/tree/SharedNode", "core/src/pointer/src/ByteArrayBase"], function(exports_38, context_38) {
    "use strict";
    var __moduleName = context_38 && context_38.id;
    var Box_6, Hit_10, SharedNode_1, ByteArrayBase_4, SharedNode_2;
    var SharedTree;
    return {
        setters:[
            function (Box_6_1) {
                Box_6 = Box_6_1;
            },
            function (Hit_10_1) {
                Hit_10 = Hit_10_1;
            },
            function (SharedNode_1_1) {
                SharedNode_1 = SharedNode_1_1;
                SharedNode_2 = SharedNode_1_1;
            },
            function (ByteArrayBase_4_1) {
                ByteArrayBase_4 = ByteArrayBase_4_1;
            }],
        execute: function() {
            SharedTree = (function () {
                function SharedTree(box, root) {
                    this.box = box;
                    this.root = root;
                }
                SharedTree.newTree = function (shapes, box) {
                    if (box === void 0) { box = null; }
                    console.time("Building k-d tree (" + shapes.length + " shapes)... ");
                    box = box ? box : Box_6.Box.boxForShapes(shapes);
                    var node = SharedNode_1.SharedNode.newNode(shapes);
                    node.split(0);
                    console.timeEnd("Building k-d tree (" + shapes.length + " shapes)... ");
                    return new SharedTree(box, node);
                };
                SharedTree.prototype.intersect = function (r) {
                    var t = this.box.intersect(r);
                    if (t.max < t.min || t.max <= 0) {
                        return Hit_10.NoHit;
                    }
                    return this.root.intersect(r, t.min, t.max);
                };
                SharedTree.fromJson = function (tree, mesh) {
                    var box = Box_6.Box.fromJson(tree.box);
                    var node = SharedNode_1.SharedNode.fromJson(tree.root);
                    node.mesh = mesh;
                    return new SharedTree(box, node);
                };
                SharedTree.readFromMemory = function (memory, shapes) {
                    var node = new SharedNode_1.SharedNode();
                    node.shapes = shapes;
                    node.readRoot(memory);
                    return new SharedTree(null, node);
                };
                SharedTree.buildAndWrite = function (memory, shapes) {
                    var startPosition = memory.position;
                    var endPosition;
                    memory.position += ByteArrayBase_4.ByteArrayBase.SIZE_OF_UINT32;
                    var node = SharedNode_1.SharedNode.newNode(shapes, memory);
                    memory.writeUnsignedInt(SharedNode_2.NodeMarker.ROOT);
                    node.split(0);
                    endPosition = memory.position;
                    memory.position = startPosition;
                    memory.writeUnsignedInt(endPosition - startPosition);
                    memory.position = endPosition;
                    return memory.position;
                };
                return SharedTree;
            }());
            exports_38("SharedTree", SharedTree);
        }
    }
});
System.register("core/src/engine/scene/shapes/Mesh", ["core/src/engine/scene/shapes/Triangle", "core/src/engine/math/Matrix4", "core/src/engine/math/Vector3", "core/src/engine/math/Color", "core/src/engine/utils/MapUtils", "core/src/engine/scene/tree/Tree", "core/src/engine/scene/shapes/Box", "core/src/engine/scene/shapes/Shape", "core/src/engine/scene/tree/SharedTree"], function(exports_39, context_39) {
    "use strict";
    var __moduleName = context_39 && context_39.id;
    var Triangle_2, Matrix4_3, Vector3_8, Color_5, MapUtils_5, Tree_1, Box_7, Shape_5, SharedTree_1;
    var Mesh;
    return {
        setters:[
            function (Triangle_2_1) {
                Triangle_2 = Triangle_2_1;
            },
            function (Matrix4_3_1) {
                Matrix4_3 = Matrix4_3_1;
            },
            function (Vector3_8_1) {
                Vector3_8 = Vector3_8_1;
            },
            function (Color_5_1) {
                Color_5 = Color_5_1;
            },
            function (MapUtils_5_1) {
                MapUtils_5 = MapUtils_5_1;
            },
            function (Tree_1_1) {
                Tree_1 = Tree_1_1;
            },
            function (Box_7_1) {
                Box_7 = Box_7_1;
            },
            function (Shape_5_1) {
                Shape_5 = Shape_5_1;
            },
            function (SharedTree_1_1) {
                SharedTree_1 = SharedTree_1_1;
            }],
        execute: function() {
            Mesh = (function () {
                function Mesh(box, triangles, tree) {
                    if (box === void 0) { box = null; }
                    if (triangles === void 0) { triangles = []; }
                    if (tree === void 0) { tree = null; }
                    this.box = box;
                    this.triangles = triangles;
                    this.tree = tree;
                    this.type = Shape_5.ShapeType.MESH;
                }
                Object.defineProperty(Mesh.prototype, "memorySize", {
                    get: function () {
                        if (this.box && this.triangles) {
                            return Box_7.Box.SIZE + this.triangles.length * Triangle_2.Triangle.SIZE + 2;
                        }
                        else {
                            throw "Box or Triangles are missing, box:" + this.box + ", triangles:" + this.triangles.length;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Mesh.prototype.directRead = function (memory, offset) {
                    this.box = new Box_7.Box();
                    offset = this.box.directRead(memory, offset);
                    var numTriangles = memory[offset++];
                    for (var i = 0; i < numTriangles; i++) {
                        var triangle = new Triangle_2.Triangle();
                        offset = triangle.directRead(memory, offset);
                        this.triangles.push(triangle);
                    }
                    return offset;
                };
                Mesh.prototype.directWrite = function (memory, offset) {
                    memory[offset++] = this.type;
                    offset = this.box.directWrite(memory, offset);
                    memory[offset++] = this.triangles.length;
                    this.triangles.forEach(function (t, index) {
                        t.index = index;
                        offset = t.directWrite(memory, offset);
                    });
                    this.tree = SharedTree_1.SharedTree.newTree(this.triangles, this.box);
                    return offset;
                };
                Mesh.prototype.read = function (memory) {
                    if (!this.box) {
                        this.box = new Box_7.Box();
                    }
                    this.box.read(memory);
                    var numTriangles = memory.readUnsignedInt();
                    for (var i = 0; i < numTriangles; i++) {
                        var t = new Triangle_2.Triangle();
                        t.read(memory);
                        this.triangles.push(t);
                    }
                    this.tree = SharedTree_1.SharedTree.readFromMemory(memory, this.triangles);
                    this.tree.box = this.box;
                    return memory.position;
                };
                Mesh.prototype.write = function (memory) {
                    memory.writeByte(this.type);
                    this.box.write(memory);
                    memory.writeUnsignedInt(this.triangles.length);
                    this.triangles.forEach(function (t, index) {
                        t.index = index;
                        t.write(memory);
                    });
                    SharedTree_1.SharedTree.buildAndWrite(memory, this.triangles);
                    return memory.position;
                };
                Mesh.fromJson = function (mesh) {
                    return new Mesh(Box_7.Box.fromJson(mesh.box), Triangle_2.Triangle.fromJson(mesh.triangles));
                };
                Mesh.newMesh = function (triangles) {
                    var box = Box_7.Box.boxForTriangles(triangles);
                    return new Mesh(box, triangles, null);
                };
                Mesh.prototype.compile = function () {
                    var m = this;
                    if (m.tree == null) {
                        m.tree = Tree_1.Tree.newTree(m.triangles, m.box);
                    }
                };
                Mesh.prototype.intersect = function (r) {
                    return this.tree.intersect(r);
                };
                Mesh.prototype.getColor = function (p) {
                    return new Color_5.Color();
                };
                Mesh.prototype.getMaterial = function (p) {
                    return this.material;
                };
                Mesh.prototype.getNormal = function (p) {
                    return new Vector3_8.Vector3();
                };
                Mesh.prototype.getRandomPoint = function () {
                    return new Vector3_8.Vector3();
                };
                Mesh.prototype.updateBox = function () {
                    this.box = Box_7.Box.boxForTriangles(this.triangles);
                };
                Mesh.prototype._smoothNormalsThreshold = function (normal, normals, threshold) {
                    var result = new Vector3_8.Vector3();
                    normals.forEach(function (x) {
                        if (x.dot(normal) >= threshold) {
                            result = result.add(x);
                        }
                    });
                    return result.normalize();
                };
                Mesh.prototype.smoothNormalsThreshold = function (radians) {
                    var m = this;
                    var threshold = Math.cos(radians);
                    var lookup = new Map();
                    m.triangles.forEach(function (t) {
                        lookup[t.v1] = MapUtils_5.append(lookup[t.v1], t.n1);
                        lookup[t.v2] = MapUtils_5.append(lookup[t.v2], t.n2);
                        lookup[t.v3] = MapUtils_5.append(lookup[t.v3], t.n3);
                    });
                    m.triangles.forEach(function (t) {
                        t.n1 = m._smoothNormalsThreshold(t.n1, lookup[t.v1], threshold);
                        t.n2 = m._smoothNormalsThreshold(t.n2, lookup[t.v2], threshold);
                        t.n3 = m._smoothNormalsThreshold(t.n3, lookup[t.v3], threshold);
                    });
                };
                Mesh.prototype.smoothNormals = function () {
                    var m = this;
                    var lookup = new Map();
                    m.triangles.forEach(function (t) {
                        lookup[t.v1] = lookup[t.v1] ? lookup[t.v1].add(t.n1) : t.n1;
                        lookup[t.v2] = lookup[t.v2] ? lookup[t.v2].add(t.n2) : t.v2;
                        lookup[t.v3] = lookup[t.v3] ? lookup[t.v3].add(t.n3) : t.v3;
                    });
                    lookup.forEach(function (v, k) {
                        lookup[k] = v.normalize();
                    });
                    m.triangles.forEach(function (t) {
                        t.n1 = lookup[t.v1];
                        t.n2 = lookup[t.v2];
                        t.n3 = lookup[t.v3];
                    });
                };
                Mesh.prototype.moveTo = function (position, anchor) {
                    var m = this;
                    var matrix = Matrix4_3.Matrix4.translate(position.sub(m.box.anchor(anchor)));
                    m.transform(matrix);
                };
                Mesh.prototype.fitInside = function (box, anchor) {
                    var m = this;
                    var scale = box.size().div(m.box.size()).minComponent();
                    var extra = box.size().sub(m.box.size().mulScalar(scale));
                    var matrix = Matrix4_3.Matrix4.identity();
                    matrix = matrix.translate(m.box.min.mulScalar(-1));
                    matrix = matrix.scale(new Vector3_8.Vector3(scale, scale, scale));
                    matrix = matrix.translate(box.min.add(extra.mul(anchor)));
                    m.transform(matrix);
                };
                Mesh.prototype.transform = function (matrix) {
                    var m = this;
                    m.triangles.forEach(function (t) {
                        t.v1 = matrix.mulPosition(t.v1);
                        t.v2 = matrix.mulPosition(t.v2);
                        t.v3 = matrix.mulPosition(t.v3);
                        t.n1 = matrix.mulDirection(t.n1);
                        t.n2 = matrix.mulDirection(t.n2);
                        t.n3 = matrix.mulDirection(t.n3);
                        t.updateBox();
                    });
                    m.updateBox();
                    m.tree = null;
                };
                Mesh.inter = 0;
                return Mesh;
            }());
            exports_39("Mesh", Mesh);
        }
    }
});
System.register("core/src/engine/data/OBJLoader", ["core/src/engine/scene/shapes/Mesh", "core/src/engine/math/Vector3", "core/src/engine/scene/shapes/Triangle", "core/src/engine/utils/MapUtils", "core/src/engine/math/Color"], function(exports_40, context_40) {
    "use strict";
    var __moduleName = context_40 && context_40.id;
    var Mesh_2, Vector3_9, Triangle_3, MapUtils_6, Color_6;
    var OBJLoader;
    return {
        setters:[
            function (Mesh_2_1) {
                Mesh_2 = Mesh_2_1;
            },
            function (Vector3_9_1) {
                Vector3_9 = Vector3_9_1;
            },
            function (Triangle_3_1) {
                Triangle_3 = Triangle_3_1;
            },
            function (MapUtils_6_1) {
                MapUtils_6 = MapUtils_6_1;
            },
            function (Color_6_1) {
                Color_6 = Color_6_1;
            }],
        execute: function() {
            OBJLoader = (function () {
                function OBJLoader() {
                    this.hasMaterials = false;
                    this.materialsLoaded = false;
                    this.materialsLoading = false;
                    this.pendingCallback = null;
                }
                OBJLoader.prototype.load = function (url, onLoad) {
                    console.log("Loading OBJ:" + url);
                    this.basePath = url.substring(0, url.lastIndexOf("/"));
                    var self = this;
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.onload = function () {
                        self.lastMesh = self.loadOBJ(xhr.response);
                        if (onLoad) {
                            if (self.hasMaterials && self.materialsLoaded) {
                                onLoad(self.lastMesh);
                            }
                            else if (!self.hasMaterials) {
                                onLoad(self.lastMesh);
                            }
                            else {
                                self.pendingCallback = onLoad;
                            }
                        }
                    };
                    xhr.send(null);
                    return null;
                };
                OBJLoader.parseIndex = function (value, length) {
                    var n = parseInt(value);
                    if (n < 0) {
                        n += length;
                    }
                    return n;
                };
                OBJLoader.parseLine = function (line) {
                    try {
                        var result = line.match(/^(\S+)\s(.*)/);
                        if (result) {
                            var _str = result.slice(1);
                        }
                        else {
                            return null;
                        }
                    }
                    catch (e) {
                        console.log("Error in line:", line, e);
                        return null;
                    }
                    if (!_str) {
                        return null;
                    }
                    else {
                        return {
                            keyword: _str[0],
                            value: _str[1].split(/ {1,}/)
                        };
                    }
                };
                OBJLoader.parseFloats = function (fs) {
                    var floats = [];
                    fs.forEach(function (f) {
                        floats.push(parseFloat(f));
                    });
                    return floats;
                };
                OBJLoader.prototype.loadOBJ = function (data) {
                    this.hasMaterials = false;
                    this.materialsLoaded = false;
                    this.materialsLoading = false;
                    var vs = [null];
                    var vts = [null];
                    var vns = [null];
                    var triangles;
                    this.materials = new Map();
                    var material = this.parentMaterial;
                    var lines = data.split("\n");
                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i].trim();
                        if (line.length == 0) {
                            continue;
                        }
                        var item = OBJLoader.parseLine(line);
                        if (item) {
                            var f = void 0;
                            var v = void 0;
                            switch (item.keyword) {
                                case "mtllib":
                                    this.hasMaterials = true;
                                    this.materialsLoaded = false;
                                    this.loadMTL(item.value[0]);
                                    break;
                                case "usemtl":
                                    material = this.getMaterial(item.value[0]);
                                    break;
                                case "v":
                                    f = OBJLoader.parseFloats(item.value);
                                    v = new Vector3_9.Vector3(f[0], f[1], f[2]);
                                    vs = MapUtils_6.append(vs, v);
                                    break;
                                case "vt":
                                    f = OBJLoader.parseFloats(item.value);
                                    v = new Vector3_9.Vector3(f[0], f[1], 0);
                                    vts = MapUtils_6.append(vts, v);
                                    break;
                                case "vn":
                                    f = OBJLoader.parseFloats(item.value);
                                    v = new Vector3_9.Vector3(f[0], f[1], f[2]);
                                    vns = MapUtils_6.append(vns, v);
                                    break;
                                case "f":
                                    var fvs = [];
                                    var fvts = [];
                                    var fvns = [];
                                    item.value.forEach(function (str, i) {
                                        var vertex = str.split(/\/\/{1,}/);
                                        fvs[i] = OBJLoader.parseIndex(vertex[0], vs.length);
                                        fvts[i] = OBJLoader.parseIndex(vertex[1], vts.length);
                                        fvns[i] = OBJLoader.parseIndex(vertex[2], vns.length);
                                    });
                                    for (var i_1 = 1; i_1 < fvs.length - 1; i_1++) {
                                        var i1 = 0;
                                        var i2 = i_1;
                                        var i3 = i_1 + 1;
                                        var t = new Triangle_3.Triangle();
                                        t.material = material;
                                        t.v1 = vs[fvs[i1]];
                                        t.v2 = vs[fvs[i2]];
                                        t.v3 = vs[fvs[i3]];
                                        t.t1 = vts[fvts[i1]];
                                        t.t2 = vts[fvts[i2]];
                                        t.t3 = vts[fvts[i3]];
                                        t.n1 = vns[fvns[i1]];
                                        t.n2 = vns[fvns[i2]];
                                        t.n3 = vns[fvns[i3]];
                                        t.updateBox();
                                        t.fixNormals();
                                        triangles = MapUtils_6.append(triangles, t);
                                    }
                                    break;
                            }
                        }
                    }
                    return Mesh_2.Mesh.newMesh(triangles);
                };
                OBJLoader.prototype.getMaterial = function (index) {
                    if (this.materials[index] == undefined) {
                        var material = this.parentMaterial.clone();
                        this.materials[index] = material;
                        return material;
                    }
                    else {
                        return this.materials[index];
                    }
                };
                OBJLoader.prototype.loadMTL = function (url) {
                    if (this.materialsLoaded || this.materialsLoading) {
                        return;
                    }
                    this.materialsLoading = true;
                    url = this.basePath == "" ? url : this.basePath + "/" + url;
                    console.log("Loading MTL:" + url);
                    var self = this;
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.onload = function () {
                        var lines = xhr.response.split("\n");
                        for (var i = 0; i < lines.length; i++) {
                            var line = lines[i].trim();
                            if (line.length == 0) {
                                continue;
                            }
                            var item = OBJLoader.parseLine(line);
                            if (item) {
                                var material;
                                switch (item.keyword) {
                                    case "newmtl":
                                        material = self.materials[item.value[0]];
                                        material = material ? material : self.parentMaterial.clone();
                                        self.materials[item.value[0]] = material;
                                        break;
                                    case "Kd":
                                        var c = OBJLoader.parseFloats(item.value);
                                        material.color = new Color_6.Color(c[0], c[1], c[2]);
                                        break;
                                    case "map_Kd":
                                        break;
                                }
                            }
                        }
                        self.materialsLoaded = true;
                        if (self.pendingCallback) {
                            self.pendingCallback(self.lastMesh);
                            self.pendingCallback = null;
                        }
                    };
                    xhr.send(null);
                    return null;
                };
                return OBJLoader;
            }());
            exports_40("OBJLoader", OBJLoader);
        }
    }
});
System.register("core/src/engine/math/TMatrix4", ["core/src/engine/math/Vector3", "core/src/engine/scene/shapes/Box", "core/src/engine/math/Ray"], function(exports_41, context_41) {
    "use strict";
    var __moduleName = context_41 && context_41.id;
    var Vector3_10, Box_8, Ray_4;
    var TMatrix4;
    return {
        setters:[
            function (Vector3_10_1) {
                Vector3_10 = Vector3_10_1;
            },
            function (Box_8_1) {
                Box_8 = Box_8_1;
            },
            function (Ray_4_1) {
                Ray_4 = Ray_4_1;
            }],
        execute: function() {
            TMatrix4 = (function () {
                function TMatrix4(x00, x01, x02, x03, x10, x11, x12, x13, x20, x21, x22, x23, x30, x31, x32, x33) {
                    if (x00 === void 0) { x00 = 0; }
                    if (x01 === void 0) { x01 = 0; }
                    if (x02 === void 0) { x02 = 0; }
                    if (x03 === void 0) { x03 = 0; }
                    if (x10 === void 0) { x10 = 0; }
                    if (x11 === void 0) { x11 = 0; }
                    if (x12 === void 0) { x12 = 0; }
                    if (x13 === void 0) { x13 = 0; }
                    if (x20 === void 0) { x20 = 0; }
                    if (x21 === void 0) { x21 = 0; }
                    if (x22 === void 0) { x22 = 0; }
                    if (x23 === void 0) { x23 = 0; }
                    if (x30 === void 0) { x30 = 0; }
                    if (x31 === void 0) { x31 = 0; }
                    if (x32 === void 0) { x32 = 0; }
                    if (x33 === void 0) { x33 = 0; }
                    if (x00 instanceof THREE.Matrix4) {
                        this.tm = x00;
                    }
                    else {
                        this.tm = new THREE.Matrix4();
                        this.tm.elements = new Float32Array([
                            x00, x10, x20, x30,
                            x01, x11, x21, x31,
                            x02, x12, x22, x32,
                            x03, x13, x23, x33
                        ]);
                    }
                }
                Object.defineProperty(TMatrix4.prototype, "x00", {
                    get: function () { return this.tm.elements[0]; },
                    set: function (v) { this.tm.elements[0] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x01", {
                    get: function () { return this.tm.elements[4]; },
                    set: function (v) { this.tm.elements[4] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x02", {
                    get: function () { return this.tm.elements[8]; },
                    set: function (v) { this.tm.elements[8] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x03", {
                    get: function () { return this.tm.elements[12]; },
                    set: function (v) { this.tm.elements[12] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x10", {
                    get: function () { return this.tm.elements[1]; },
                    set: function (v) { this.tm.elements[1] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x11", {
                    get: function () { return this.tm.elements[5]; },
                    set: function (v) { this.tm.elements[5] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x12", {
                    get: function () { return this.tm.elements[9]; },
                    set: function (v) { this.tm.elements[9] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x13", {
                    get: function () { return this.tm.elements[13]; },
                    set: function (v) { this.tm.elements[13] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x20", {
                    get: function () { return this.tm.elements[2]; },
                    set: function (v) { this.tm.elements[2] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x21", {
                    get: function () { return this.tm.elements[6]; },
                    set: function (v) { this.tm.elements[6] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x22", {
                    get: function () { return this.tm.elements[10]; },
                    set: function (v) { this.tm.elements[10] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x23", {
                    get: function () { return this.tm.elements[14]; },
                    set: function (v) { this.tm.elements[14] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x30", {
                    get: function () { return this.tm.elements[3]; },
                    set: function (v) { this.tm.elements[3] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x31", {
                    get: function () { return this.tm.elements[7]; },
                    set: function (v) { this.tm.elements[7] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x32", {
                    get: function () { return this.tm.elements[11]; },
                    set: function (v) { this.tm.elements[11] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                Object.defineProperty(TMatrix4.prototype, "x33", {
                    get: function () { return this.tm.elements[15]; },
                    set: function (v) { this.tm.elements[15] = v; },
                    enumerable: true,
                    configurable: true
                });
                ;
                ;
                TMatrix4.prototype.directRead = function (memory, offset) {
                    var m = this;
                    m.x00 = memory[offset++];
                    m.x01 = memory[offset++];
                    m.x02 = memory[offset++];
                    m.x03 = memory[offset++];
                    m.x10 = memory[offset++];
                    m.x11 = memory[offset++];
                    m.x12 = memory[offset++];
                    m.x13 = memory[offset++];
                    m.x20 = memory[offset++];
                    m.x21 = memory[offset++];
                    m.x22 = memory[offset++];
                    m.x23 = memory[offset++];
                    m.x30 = memory[offset++];
                    m.x31 = memory[offset++];
                    m.x32 = memory[offset++];
                    m.x33 = memory[offset++];
                    return offset;
                };
                TMatrix4.prototype.directWrite = function (memory, offset) {
                    var m = this;
                    memory[offset++] = m.x00;
                    memory[offset++] = m.x01;
                    memory[offset++] = m.x02;
                    memory[offset++] = m.x03;
                    memory[offset++] = m.x10;
                    memory[offset++] = m.x11;
                    memory[offset++] = m.x12;
                    memory[offset++] = m.x13;
                    memory[offset++] = m.x20;
                    memory[offset++] = m.x21;
                    memory[offset++] = m.x22;
                    memory[offset++] = m.x23;
                    memory[offset++] = m.x30;
                    memory[offset++] = m.x31;
                    memory[offset++] = m.x32;
                    memory[offset++] = m.x33;
                    return offset;
                };
                TMatrix4.prototype.read = function (memory) {
                    this.x00 = memory.readFloat();
                    this.x01 = memory.readFloat();
                    this.x02 = memory.readFloat();
                    this.x03 = memory.readFloat();
                    this.x10 = memory.readFloat();
                    this.x11 = memory.readFloat();
                    this.x12 = memory.readFloat();
                    this.x13 = memory.readFloat();
                    this.x20 = memory.readFloat();
                    this.x21 = memory.readFloat();
                    this.x22 = memory.readFloat();
                    this.x23 = memory.readFloat();
                    this.x30 = memory.readFloat();
                    this.x31 = memory.readFloat();
                    this.x32 = memory.readFloat();
                    this.x33 = memory.readFloat();
                    return memory.position;
                };
                TMatrix4.prototype.write = function (memory) {
                    memory.writeFloat(this.x00);
                    memory.writeFloat(this.x01);
                    memory.writeFloat(this.x02);
                    memory.writeFloat(this.x03);
                    memory.writeFloat(this.x10);
                    memory.writeFloat(this.x11);
                    memory.writeFloat(this.x12);
                    memory.writeFloat(this.x13);
                    memory.writeFloat(this.x20);
                    memory.writeFloat(this.x21);
                    memory.writeFloat(this.x22);
                    memory.writeFloat(this.x23);
                    memory.writeFloat(this.x30);
                    memory.writeFloat(this.x31);
                    memory.writeFloat(this.x32);
                    memory.writeFloat(this.x33);
                    return memory.position;
                };
                TMatrix4.fromJson = function (m) {
                    return new TMatrix4(m.x00, m.x01, m.x02, m.x03, m.x10, m.x11, m.x12, m.x13, m.x20, m.x21, m.x22, m.x23, m.x30, m.x31, m.x32, m.x33);
                };
                TMatrix4.identity = function () {
                    return new TMatrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
                };
                TMatrix4.translate = function (v) {
                    return new TMatrix4(1, 0, 0, v.x, 0, 1, 0, v.y, 0, 0, 1, v.z, 0, 0, 0, 1);
                };
                TMatrix4.scale = function (v) {
                    return new TMatrix4(v.x, 0, 0, 0, 0, v.y, 0, 0, 0, 0, v.z, 0, 0, 0, 0, 1);
                };
                TMatrix4.rotate = function (v, a) {
                    v = v.normalize();
                    var s = Math.sin(a);
                    var c = Math.cos(a);
                    var m = 1 - c;
                    return new TMatrix4(m * v.x * v.x + c, m * v.x * v.y + v.z * s, m * v.z * v.x - v.y * s, 0, m * v.x * v.y - v.z * s, m * v.y * v.y + c, m * v.y * v.z + v.x * s, 0, m * v.z * v.x + v.y * s, m * v.y * v.z - v.x * s, m * v.z * v.z + c, 0, 0, 0, 0, 1);
                };
                TMatrix4.frustum = function (l, r, b, t, n, f) {
                    var t1 = 2 * n;
                    var t2 = r - l;
                    var t3 = t - b;
                    var t4 = f - n;
                    return new TMatrix4(t1 / t2, 0, (r + l) / t2, 0, 0, t1 / t3, (t + b) / t3, 0, 0, 0, (-f - n) / t4, (-t1 * f) / t4, 0, 0, -1, 0);
                };
                TMatrix4.orthographic = function (l, r, b, t, n, f) {
                    return new TMatrix4(2 / (r - l), 0, 0, -(r + l) / (r - l), 0, 2 / (t - b), 0, -(t + b) / (t - b), 0, 0, -2 / (f - n), -(f + n) / (f - n), 0, 0, 0, 1);
                };
                TMatrix4.perspective = function (fov, aspect, near, far) {
                    var ymax = near * Math.tan(fov * Math.PI / 360);
                    var xmax = ymax * aspect;
                    return TMatrix4.frustum(-xmax, xmax, -ymax, ymax, near, far);
                };
                TMatrix4.prototype.translate = function (v) {
                    return TMatrix4.translate(v).mul(this);
                };
                TMatrix4.prototype.scale = function (v) {
                    return TMatrix4.scale(v).mul(this);
                };
                TMatrix4.prototype.rotate = function (v, a) {
                    return TMatrix4.rotate(v, a).mul(this);
                };
                TMatrix4.prototype.frustum = function (l, r, b, t, n, f) {
                    this.tm.makeFrustum(l, r, b, t, n, f);
                    return this;
                };
                TMatrix4.prototype.orthographic = function (l, r, b, t, n, f) {
                    this.tm.makeOrthographic(l, r, t, b, n, f);
                    return this;
                };
                TMatrix4.prototype.perspective = function (fov, aspect, near, far) {
                    this.tm.makePerspective(fov, aspect, near, far);
                    return this;
                };
                TMatrix4.prototype.mul = function (b) {
                    var a = this;
                    var m = new TMatrix4();
                    m.tm = a.tm.multiply(b.tm);
                    return m;
                };
                TMatrix4.prototype.mulPosition = function (b) {
                    var a = this;
                    var x = a.x00 * b.x + a.x01 * b.y + a.x02 * b.z + a.x03;
                    var y = a.x10 * b.x + a.x11 * b.y + a.x12 * b.z + a.x13;
                    var z = a.x20 * b.x + a.x21 * b.y + a.x22 * b.z + a.x23;
                    return new Vector3_10.Vector3(x, y, z);
                };
                TMatrix4.prototype.mulDirection = function (b) {
                    var a = this;
                    var x = a.x00 * b.x + a.x01 * b.y + a.x02 * b.z;
                    var y = a.x10 * b.x + a.x11 * b.y + a.x12 * b.z;
                    var z = a.x20 * b.x + a.x21 * b.y + a.x22 * b.z;
                    return new Vector3_10.Vector3(x, y, z).normalize();
                };
                TMatrix4.prototype.mulRay = function (b) {
                    var a = this;
                    return new Ray_4.Ray(a.mulPosition(b.origin), a.mulDirection(b.direction));
                };
                TMatrix4.prototype.mulBox = function (b) {
                    var a = this;
                    var minx = b.min.x;
                    var maxx = b.max.x;
                    var miny = b.min.y;
                    var maxy = b.max.y;
                    var minz = b.min.z;
                    var maxz = b.max.z;
                    var xa = a.x00 * minx + a.x10 * minx + a.x20 * minx + a.x30 * minx;
                    var xb = a.x00 * maxx + a.x10 * maxx + a.x20 * maxx + a.x30 * maxx;
                    var ya = a.x01 * miny + a.x11 * miny + a.x21 * miny + a.x31 * miny;
                    var yb = a.x01 * maxy + a.x11 * maxy + a.x21 * maxy + a.x31 * maxy;
                    var za = a.x02 * minz + a.x12 * minz + a.x22 * minz + a.x32 * minz;
                    var zb = a.x02 * maxz + a.x12 * maxz + a.x22 * maxz + a.x32 * maxz;
                    minx = Math.min(xa, xb);
                    maxx = Math.max(xa, xb);
                    miny = Math.min(ya, yb);
                    maxy = Math.max(ya, yb);
                    minz = Math.min(za, zb);
                    maxz = Math.max(za, zb);
                    var min = new Vector3_10.Vector3(minx + a.x03, miny + a.x13, minz + a.x23);
                    var max = new Vector3_10.Vector3(maxx + a.x03, maxy + a.x13, maxz + a.x23);
                    return new Box_8.Box(min, max);
                };
                TMatrix4.prototype.transpose = function () {
                    var a = this;
                    return new TMatrix4(a.tm.transpose());
                };
                TMatrix4.prototype.determinant = function () {
                    var a = this;
                    return a.tm.determinant();
                };
                TMatrix4.prototype.inverse = function () {
                    var a = this;
                    var m = new TMatrix4();
                    m.tm.getInverse(a.tm);
                    return m;
                };
                TMatrix4.SIZE = 16;
                return TMatrix4;
            }());
            exports_41("TMatrix4", TMatrix4);
        }
    }
});
System.register("core/src/engine/renderer/worker/TraceJob", [], function(exports_42, context_42) {
    "use strict";
    var __moduleName = context_42 && context_42.id;
    var TraceJob;
    return {
        setters:[],
        execute: function() {
            TraceJob = (function () {
                function TraceJob(param, extra) {
                    if (extra === void 0) { extra = {}; }
                    this.param = param;
                    this.extra = extra;
                    this.runCount = 0;
                    this.id = param.id;
                    this.finished = false;
                }
                Object.defineProperty(TraceJob.prototype, "lifeCount", {
                    get: function () {
                        return this._lifeCount;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TraceJob.prototype, "time", {
                    get: function () {
                        return this._time;
                    },
                    enumerable: true,
                    configurable: true
                });
                TraceJob.prototype.start = function (thread, onComplete) {
                    this._time = performance.now();
                    var self = this;
                    var _param = this.getTraceParam();
                    thread.trace(_param, function (thread) {
                        self._time = performance.now() - self._time;
                        self._lifeCount = Math.round(self._time / 10);
                        if (onComplete) {
                            onComplete(self, thread);
                        }
                    });
                    this.runCount++;
                };
                TraceJob.prototype.getTraceParam = function () {
                    var _param = { init_iterations: 0 };
                    var extraCount = 0;
                    for (key in this.extra) {
                        if (this.extra.hasOwnProperty(key)) {
                            _param[key] = this.extra[key];
                            delete this.extra[key];
                            extraCount++;
                        }
                    }
                    if (extraCount > 0) {
                        for (var key in this.param) {
                            if (this.param.hasOwnProperty(key)) {
                                _param[key] = this.param[key];
                            }
                        }
                    }
                    else {
                        _param = this.param;
                    }
                    _param.init_iterations = (this.runCount * this.param.blockIterations) - (this.runCount > 0 ? (this.param.blockIterations - 1) : 0);
                    return _param;
                };
                TraceJob.INIT = "INIT";
                TraceJob.INITED = "INITED";
                TraceJob.TRACE = "TRACE";
                TraceJob.TRACED = "TRACED";
                TraceJob.TERMINATE = "TERMINATE";
                TraceJob.LOCKED = "LOCKED";
                return TraceJob;
            }());
            exports_42("TraceJob", TraceJob);
        }
    }
});
System.register("core/src/engine/renderer/worker/ThreadPool", ["core/src/engine/renderer/worker/Thread"], function(exports_43, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    var Thread_1;
    var ThreadPool;
    return {
        setters:[
            function (Thread_1_1) {
                Thread_1 = Thread_1_1;
            }],
        execute: function() {
            ThreadPool = (function () {
                function ThreadPool() {
                }
                Object.defineProperty(ThreadPool, "maxThreads", {
                    get: function () {
                        return navigator["hardwareConcurrency"] || 2;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                ThreadPool.getThreads = function () {
                    console.info("Available Threads:" + ThreadPool.maxThreads);
                    if (ThreadPool.pool) {
                        return ThreadPool.pool;
                    }
                    var threads = [];
                    for (var i = 0; i < ThreadPool.maxThreads; i++) {
                        threads.push(new Thread_1.Thread("Thread:#" + i, i));
                    }
                    ThreadPool.pool = threads;
                    return threads;
                };
                return ThreadPool;
            }());
            exports_43("ThreadPool", ThreadPool);
        }
    }
});
System.register("core/src/engine/scene/Scene", ["core/src/engine/math/Color", "core/src/engine/scene/tree/Tree", "core/src/engine/utils/MapUtils", "core/src/engine/math/Vector3", "core/src/engine/math/Ray", "core/src/engine/scene/shapes/Shape", "core/src/engine/scene/shapes/Cube", "core/src/engine/scene/shapes/Sphere", "core/src/engine/scene/shapes/Mesh", "core/src/engine/scene/shapes/TransformedShape", "core/src/engine/scene/shapes/Triangle"], function(exports_44, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
    var Color_7, Tree_2, MapUtils_7, Vector3_11, Ray_5, Shape_6, Cube_2, Sphere_2, Mesh_3, TransformedShape_2, Triangle_4;
    var Scene;
    return {
        setters:[
            function (Color_7_1) {
                Color_7 = Color_7_1;
            },
            function (Tree_2_1) {
                Tree_2 = Tree_2_1;
            },
            function (MapUtils_7_1) {
                MapUtils_7 = MapUtils_7_1;
            },
            function (Vector3_11_1) {
                Vector3_11 = Vector3_11_1;
            },
            function (Ray_5_1) {
                Ray_5 = Ray_5_1;
            },
            function (Shape_6_1) {
                Shape_6 = Shape_6_1;
            },
            function (Cube_2_1) {
                Cube_2 = Cube_2_1;
            },
            function (Sphere_2_1) {
                Sphere_2 = Sphere_2_1;
            },
            function (Mesh_3_1) {
                Mesh_3 = Mesh_3_1;
            },
            function (TransformedShape_2_1) {
                TransformedShape_2 = TransformedShape_2_1;
            },
            function (Triangle_4_1) {
                Triangle_4 = Triangle_4_1;
            }],
        execute: function() {
            Scene = (function () {
                function Scene(color, shapes, lights, tree, rays) {
                    if (color === void 0) { color = new Color_7.Color(); }
                    if (shapes === void 0) { shapes = []; }
                    if (lights === void 0) { lights = []; }
                    if (tree === void 0) { tree = null; }
                    if (rays === void 0) { rays = 0; }
                    this.color = color;
                    this.shapes = shapes;
                    this.lights = lights;
                    this.tree = tree;
                    this.rays = rays;
                    this.shared = false;
                }
                Object.defineProperty(Scene.prototype, "estimatedMemory", {
                    get: function () {
                        var size = Color_7.Color.SIZE + 1;
                        this.shapes.forEach(function (shape) {
                            size += shape.memorySize;
                        });
                        return size;
                    },
                    enumerable: true,
                    configurable: true
                });
                Scene.fromJson = function (scene) {
                    var _scene = new Scene(Color_7.Color.fromJson(scene.color));
                    scene.shapes.forEach(function (shape) {
                        switch (shape.type) {
                            case Shape_6.ShapeType.CUBE:
                                _scene.add(Cube_2.Cube.fromJson(shape));
                                break;
                            case Shape_6.ShapeType.SPHERE:
                                _scene.add(Sphere_2.Sphere.fromJson(shape));
                                break;
                            case Shape_6.ShapeType.MESH:
                                _scene.add(Mesh_3.Mesh.fromJson(shape));
                                break;
                            case Shape_6.ShapeType.TRANSFORMED_SHAPE:
                                _scene.add(TransformedShape_2.TransformedShape.fromJson(shape));
                                break;
                            case Shape_6.ShapeType.TRIANGLE:
                                _scene.add(Triangle_4.Triangle.fromJson(shape));
                                break;
                        }
                    });
                    return _scene;
                };
                Scene.prototype.compile = function () {
                    this.shapes.forEach(function (shape) {
                        shape.compile();
                    });
                    if (this.tree == null) {
                        this.tree = Tree_2.Tree.newTree(this.shapes);
                    }
                    return this;
                };
                Scene.prototype.add = function (shape) {
                    this.shapes = MapUtils_7.append(this.shapes, shape);
                    shape.index = this.shapes.length - 1;
                    var mat = shape.getMaterial(new Vector3_11.Vector3());
                    if (mat && mat.emittance > 0) {
                        this.lights = MapUtils_7.append(this.lights, shape);
                    }
                };
                Scene.prototype.rayCount = function () {
                    return this.rays;
                };
                Scene.prototype.intersect = function (r) {
                    this.rays++;
                    return this.tree.intersect(r);
                };
                Scene.prototype.shadow = function (r, light, max) {
                    var hit = this.intersect(r);
                    return hit.shape != light && hit.T < max;
                };
                Scene.prototype.directLight = function (n) {
                    if (this.lights.length == 0) {
                        return new Color_7.Color();
                    }
                    var color = new Color_7.Color();
                    var self = this;
                    var i = 0;
                    var light;
                    for (; i < this.lights.length; i++) {
                        light = this.lights[i];
                        var p = light.getRandomPoint();
                        var d = p.sub(n.origin);
                        var lr = new Ray_5.Ray(n.origin, d.normalize());
                        var diffuse = lr.direction.dot(n.direction);
                        if (diffuse <= 0) {
                            continue;
                        }
                        var distance = d.length();
                        if (self.shadow(lr, light, distance)) {
                            continue;
                        }
                        var material = light.getMaterial(p);
                        var emittance = material.emittance;
                        var attenuation = material.attenuation.compute(distance);
                        color = color.add(light.getColor(p).mulScalar(diffuse * emittance * attenuation));
                    }
                    return color.divScalar(this.lights.length);
                };
                Scene.prototype.sample = function (r, emission, samples, depth) {
                    if (depth < 0) {
                        return new Color_7.Color(0, 0, 0);
                    }
                    var hit = this.intersect(r);
                    if (!hit.ok()) {
                        return this.color;
                    }
                    var info = hit.getInfo(r);
                    var result = new Color_7.Color();
                    if (emission) {
                        var emittance = info.material.emittance;
                        if (emittance > 0) {
                            var attenuation = info.material.attenuation.compute(hit.T);
                            result = result.add(info.color.mulScalar(emittance * attenuation * samples));
                        }
                    }
                    var n = Math.round(Math.sqrt(samples));
                    for (var u = 0; u < n; u++) {
                        for (var v = 0; v < n; v++) {
                            var p = Math.random();
                            var fu = (u + Math.random()) / n;
                            var fv = (v + Math.random()) / n;
                            var bounce = r.bounce(info, p, fu, fv);
                            var indirect = this.sample(bounce.ray, bounce.reflected, 1, depth - 1);
                            if (bounce.reflected) {
                                var tinted = indirect.mix(info.color.mul(indirect), info.material.tint);
                                result = result.add(tinted);
                            }
                            else {
                                var direct = this.directLight(info.ray);
                                result = result.add(info.color.mul(direct.add(indirect)));
                            }
                        }
                    }
                    return result.divScalar(n * n);
                };
                Scene.interval = 0;
                return Scene;
            }());
            exports_44("Scene", Scene);
        }
    }
});
System.register("core/src/engine/scene/SharedScene", ["core/src/engine/math/Color", "core/src/engine/scene/Scene", "core/src/engine/scene/materials/Material", "core/src/engine/scene/shapes/Shape", "core/src/engine/scene/tree/SharedTree", "core/src/pointer/src/Pointer", "core/src/engine/scene/shapes/Box", "core/src/engine/renderer/worker/ThreadPool"], function(exports_45, context_45) {
    "use strict";
    var __moduleName = context_45 && context_45.id;
    var Color_8, Scene_1, Material_16, Shape_7, SharedTree_2, Pointer_2, Box_9, ThreadPool_1;
    var SharedScene;
    return {
        setters:[
            function (Color_8_1) {
                Color_8 = Color_8_1;
            },
            function (Scene_1_1) {
                Scene_1 = Scene_1_1;
            },
            function (Material_16_1) {
                Material_16 = Material_16_1;
            },
            function (Shape_7_1) {
                Shape_7 = Shape_7_1;
            },
            function (SharedTree_2_1) {
                SharedTree_2 = SharedTree_2_1;
            },
            function (Pointer_2_1) {
                Pointer_2 = Pointer_2_1;
            },
            function (Box_9_1) {
                Box_9 = Box_9_1;
            },
            function (ThreadPool_1_1) {
                ThreadPool_1 = ThreadPool_1_1;
            }],
        execute: function() {
            SharedScene = (function (_super) {
                __extends(SharedScene, _super);
                function SharedScene(color, shapes, lights, tree, rays) {
                    if (color === void 0) { color = new Color_8.Color(); }
                    if (shapes === void 0) { shapes = []; }
                    if (lights === void 0) { lights = []; }
                    if (tree === void 0) { tree = null; }
                    if (rays === void 0) { rays = 0; }
                    _super.call(this, color, shapes, lights, tree, rays);
                    this.shared = true;
                }
                SharedScene.prototype.getMemory = function () {
                    console.time("getMemory");
                    Pointer_2.Pointer.init();
                    var memory = Pointer_2.Pointer.memory;
                    memory.writeByte(0);
                    memory.writeByte(0);
                    memory.writeByte(0);
                    memory.position += ThreadPool_1.ThreadPool.maxThreads;
                    Material_16.Material.write(memory);
                    this.color.write(memory);
                    memory.writeUnsignedInt(this.shapes.length);
                    this.shapes.forEach(function (shape) {
                        shape.write(memory);
                    });
                    var box = Box_9.Box.boxForShapes(this.shapes);
                    box.write(memory);
                    SharedTree_2.SharedTree.buildAndWrite(memory, this.shapes);
                    console.timeEnd("getMemory");
                    return memory;
                };
                SharedScene.getScene = function (memory) {
                    var scene = new SharedScene();
                    memory.position = 0;
                    memory.position += 3;
                    memory.position += ThreadPool_1.ThreadPool.maxThreads;
                    var offset = Material_16.Material.restore(memory);
                    scene.color.read(memory);
                    var numShapes = memory.readUnsignedInt();
                    var shapes = [];
                    for (var i = 0; i < numShapes; i++) {
                        offset = Shape_7.restoreShape(memory, shapes);
                        var shape = shapes[i];
                        scene.add(shape);
                    }
                    var box = new Box_9.Box();
                    box.read(memory);
                    scene.tree = SharedTree_2.SharedTree.readFromMemory(memory, shapes);
                    scene.tree.box = box;
                    return scene;
                };
                return SharedScene;
            }(Scene_1.Scene));
            exports_45("SharedScene", SharedScene);
        }
    }
});
System.register("core/src/engine/renderer/worker/TraceJobManager", ["core/src/engine/renderer/worker/ThreadPool"], function(exports_46, context_46) {
    "use strict";
    var __moduleName = context_46 && context_46.id;
    var ThreadPool_2;
    var TraceJobManager;
    return {
        setters:[
            function (ThreadPool_2_1) {
                ThreadPool_2 = ThreadPool_2_1;
            }],
        execute: function() {
            TraceJobManager = (function () {
                function TraceJobManager() {
                    this.iterations = 0;
                    this.initCount = 0;
                    this.maxLoop = 1;
                    this.currentLoop = 0;
                    this.totalThreads = 0;
                    this.deferredStart = false;
                    this.lockCount = 0;
                    this.queue = [];
                    this.deferredQueue = [];
                    this.referenceQueue = [];
                }
                Object.defineProperty(TraceJobManager.prototype, "initialized", {
                    get: function () {
                        return this._initialized;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TraceJobManager.prototype, "isAllLocked", {
                    get: function () {
                        for (var i = 0; i < this.totalThreads; i++) {
                            if (this.flags[3 + i] !== 3 && this.flags[3 + i] !== 0) {
                                console.log(this.flags);
                                console.log(this.threads);
                                return false;
                            }
                        }
                        return true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TraceJobManager.prototype, "finished", {
                    get: function () {
                        return this._finished;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(TraceJobManager.prototype, "pixels", {
                    get: function () {
                        return this.pixelMemory;
                    },
                    enumerable: true,
                    configurable: true
                });
                TraceJobManager.prototype.configure = function (param, scene) {
                    console.log("configure");
                    this.width = param.width;
                    this.height = param.height;
                    this.sceneMemory = scene.getMemory();
                    this.flags = new Uint8Array(this.sceneMemory.data.buffer, 0, 3 + ThreadPool_2.ThreadPool.maxThreads);
                    TraceJobManager.flags = this.flags;
                    this.pixelMemory = new Uint8Array(new SharedArrayBuffer(this.width * this.height * 3));
                    this.sampleMemory = new Float32Array(new SharedArrayBuffer(4 * this.width * this.height * 3));
                    this.traceParameters = {
                        pixelBuffer: this.pixelMemory.buffer,
                        sampleBuffer: this.sampleMemory.buffer,
                        sceneBuffer: this.sceneMemory.buffer,
                        camera: param.camera,
                        cameraSamples: param.cameraSamples,
                        hitSamples: param.hitSamples,
                        bounces: param.bounces,
                        full_width: this.width,
                        full_height: this.height
                    };
                };
                TraceJobManager.prototype.add = function (job) {
                    this.queue.push(job);
                    this.referenceQueue.push(job);
                };
                TraceJobManager.prototype.init = function (callback) {
                    console.log("Initializing threads...");
                    console.time("init");
                    this.threads = ThreadPool_2.ThreadPool.getThreads();
                    this.totalThreads = this.threads.length;
                    this.lockCount = this.threads.length;
                    this.initNext(callback);
                };
                TraceJobManager.prototype.initNext = function (callback) {
                    var self = this;
                    if (this.initCount == this.totalThreads) {
                        this._initialized = true;
                        console.timeEnd("init");
                        if (callback) {
                            callback();
                        }
                        else {
                            this.start();
                        }
                        return;
                    }
                    var thread = this.threads[this.initCount++];
                    thread.onThreadLocked = this.onThreadLocked.bind(this);
                    thread.init(this.traceParameters, [
                        this.traceParameters.pixelBuffer,
                        this.traceParameters.sampleBuffer,
                        this.traceParameters.sceneBuffer
                    ], function () {
                        console.log("thread:" + self.initCount + " inited");
                        self.initNext.bind(self)(callback);
                    });
                };
                TraceJobManager.prototype.onThreadLocked = function () {
                    this.lockCount++;
                    if (this.isAllLocked && this.deferredStart) {
                        this.deferredStart = false;
                        this.clear();
                        this.restart();
                    }
                    console.log("lockCount:" + this.lockCount);
                };
                TraceJobManager.prototype.lockAllThreads = function () {
                    for (var i = 0; i < this.threads.length; i++) {
                        var thread = this.threads[i];
                        if (thread.isTracing) {
                            this.flags[3 + i] = 2;
                        }
                        else {
                            this.flags[3 + i] = 0;
                        }
                    }
                };
                TraceJobManager.prototype.stop = function () {
                    if (this.flags) {
                        this.queue = null;
                        this.deferredQueue = null;
                        this.deferredStart = false;
                        this.lockAllThreads();
                        this.stopped = true;
                        this.lockCount = 0;
                        this._await = true;
                        var job;
                        for (var i = 0; i < this.referenceQueue.length; i++) {
                            job = this.referenceQueue[i];
                            job.runCount = 0;
                        }
                    }
                };
                TraceJobManager.prototype.clear = function () {
                    for (var y = 0; y < this.height; y++) {
                        for (var x = 0; x < this.width; x++) {
                            var si = (y * (this.width * 3)) + (x * 3);
                            this.pixelMemory[si] = 0;
                            this.pixelMemory[si + 1] = 0;
                            this.pixelMemory[si + 2] = 0;
                            this.sampleMemory[si] = 0;
                            this.sampleMemory[si + 1] = 0;
                            this.sampleMemory[si + 2] = 0;
                        }
                    }
                    if (this.updatePixels) {
                        this.updatePixels({
                            xoffset: 0,
                            yoffset: 0,
                            width: this.width,
                            height: this.height,
                            pixels: this.pixelMemory
                        });
                    }
                };
                TraceJobManager.prototype.restart = function () {
                    if (!this.stopped) {
                        this.stop();
                    }
                    if (this.flags && this.isAllThreadsFree) {
                        this.queue = this.referenceQueue.concat();
                        this.deferredQueue = [];
                        this._await = false;
                        this.deferredStart = false;
                        clearTimeout(this.resetTimerId);
                        this.resetTimerId = setTimeout(this.start.bind(this), 100);
                    }
                    else {
                        this.deferredStart = true;
                    }
                };
                Object.defineProperty(TraceJobManager.prototype, "isAllThreadsFree", {
                    get: function () {
                        var thread;
                        for (var i = 0; i < this.threads.length; i++) {
                            thread = this.threads[i];
                            if (thread.isTracing) {
                                if (this.flags[3 + i] === 1 || this.flags[3 + i] === 2) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    },
                    enumerable: true,
                    configurable: true
                });
                TraceJobManager.prototype.start = function () {
                    if (this.currentLoop >= this.maxLoop || (this.queue.length == 0 && this.deferredQueue.length === 0)) {
                        console.log("Rendering finished");
                        return;
                    }
                    console.log("queue:" + this.queue.length);
                    console.time('trace::start');
                    var self = this;
                    if (this._initialized) {
                        this.stopped = false;
                        var thread;
                        var job;
                        for (var i = 0; i < this.threads.length; i++) {
                            thread = this.threads[i];
                            if (self.queue && self.deferredQueue && self.queue.length > 0) {
                                job = self.queue.shift();
                                self.deferredQueue.push(job);
                                job.start(thread, function (_job, _thread) {
                                    if (!self._await) {
                                        self.processQueue.call(self, _job, _thread);
                                    }
                                });
                            }
                            else {
                                break;
                            }
                        }
                    }
                };
                TraceJobManager.prototype.processQueue = function (job, thread) {
                    if (this.updatePixels) {
                        this.updatePixels(job.param);
                    }
                    if (this._finished) {
                        return;
                    }
                    var self = this;
                    if (this.queue.length > 0) {
                        var job = self.queue.shift();
                        self.deferredQueue.push(job);
                        job.start(thread, function (_job, _thread) {
                            if (!self._await) {
                                self.processQueue.call(self, _job, _thread);
                            }
                        });
                    }
                    else {
                        if (this.isAllThreadsFree) {
                            this._finished = true;
                            console.timeEnd('trace::start');
                            this.initDeferredQueue();
                        }
                    }
                };
                TraceJobManager.prototype.initDeferredQueue = function () {
                    if (this.currentLoop >= this.maxLoop || (this.queue.length == 0 && this.deferredQueue.length === 0)) {
                        console.log("Rendering finished");
                        return;
                    }
                    this.currentLoop++;
                    this._finished = false;
                    var self = this;
                    self.deferredQueue.sort(function (a, b) {
                        return b.time - a.time;
                    });
                    self.queue = self.deferredQueue;
                    self.deferredQueue = [];
                    console.time('trace::start');
                    this.start();
                };
                return TraceJobManager;
            }());
            exports_46("TraceJobManager", TraceJobManager);
        }
    }
});
System.register("core/src/engine/renderer/worker/Thread", ["core/src/engine/renderer/worker/TraceJob", "core/src/engine/renderer/worker/TraceJobManager"], function(exports_47, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
    var TraceJob_1, TraceJobManager_1;
    var Thread;
    return {
        setters:[
            function (TraceJob_1_1) {
                TraceJob_1 = TraceJob_1_1;
            },
            function (TraceJobManager_1_1) {
                TraceJobManager_1 = TraceJobManager_1_1;
            }],
        execute: function() {
            Thread = (function () {
                function Thread(name, id) {
                    this.id = id;
                    this.instance = new Worker(Thread.workerUrl);
                    this.instance.onmessage = this.onMessageReceived.bind(this);
                }
                Object.defineProperty(Thread.prototype, "isTracing", {
                    get: function () {
                        return this._isTracing;
                    },
                    enumerable: true,
                    configurable: true
                });
                Thread.prototype.onMessageReceived = function (event) {
                    if (event.data == TraceJob_1.TraceJob.INITED) {
                        this.initialized = true;
                        this._isTracing = false;
                        if (this.onInitComplete) {
                            this.onInitComplete(this);
                        }
                    }
                    if (event.data == TraceJob_1.TraceJob.TRACED) {
                        this._isTracing = false;
                        TraceJobManager_1.TraceJobManager.flags[3 + this.id] = 0;
                        if (this.onTraceComplete) {
                            this.onTraceComplete(this);
                        }
                    }
                    if (event.data == TraceJob_1.TraceJob.LOCKED) {
                        this._isTracing = false;
                        TraceJobManager_1.TraceJobManager.flags[3 + this.id] = 3;
                        if (this.onThreadLocked) {
                            this.onThreadLocked(this);
                        }
                    }
                };
                Thread.prototype.init = function (param, transferable, onInit) {
                    console.log("Initializing thread " + this.id);
                    this.onInitComplete = onInit;
                    param.command = TraceJob_1.TraceJob.INIT;
                    param.id = this.id;
                    this.send(param, transferable);
                };
                Thread.prototype.trace = function (param, onComplete) {
                    if (TraceJobManager_1.TraceJobManager.flags[3 + this.id] == 2) {
                        this._isTracing = false;
                        TraceJobManager_1.TraceJobManager.flags[3 + this.id] = 3;
                        if (this.onThreadLocked) {
                            this.onThreadLocked(this);
                        }
                    }
                    else {
                        this._isTracing = true;
                        TraceJobManager_1.TraceJobManager.flags[3 + this.id] = 1;
                        this.onTraceComplete = onComplete;
                        param.command = TraceJob_1.TraceJob.TRACE;
                        this.send(param);
                    }
                };
                Thread.prototype.send = function (data, buffers) {
                    this.instance.postMessage(data, buffers);
                };
                Thread.prototype.terminate = function () {
                };
                Thread.workerUrl = "../workers/trace-worker-bootstrap.js";
                return Thread;
            }());
            exports_47("Thread", Thread);
        }
    }
});
System.register("core/src/engine/scene/Camera", ["core/src/engine/math/Vector3", "core/src/engine/math/Ray"], function(exports_48, context_48) {
    "use strict";
    var __moduleName = context_48 && context_48.id;
    var Vector3_12, Ray_6;
    var Camera;
    return {
        setters:[
            function (Vector3_12_1) {
                Vector3_12 = Vector3_12_1;
            },
            function (Ray_6_1) {
                Ray_6 = Ray_6_1;
            }],
        execute: function() {
            Camera = (function () {
                function Camera(p, u, v, w, m, focalDistance, apertureRadius) {
                    this.p = p;
                    this.u = u;
                    this.v = v;
                    this.w = w;
                    this.m = m;
                    this.focalDistance = focalDistance;
                    this.apertureRadius = apertureRadius;
                }
                Camera.fromJson = function (camera) {
                    return new Camera(Vector3_12.Vector3.fromJson(camera.p), Vector3_12.Vector3.fromJson(camera.u), Vector3_12.Vector3.fromJson(camera.v), Vector3_12.Vector3.fromJson(camera.w), camera.m, camera.focalDistance, camera.apertureRadius);
                };
                Camera.lookAt = function (eye, look, up, fovy) {
                    var c = new Camera();
                    c.p = eye;
                    c.w = look.sub(eye).normalize();
                    c.u = up.cross(c.w).normalize();
                    c.v = c.w.cross(c.u).normalize();
                    c.m = 1 / Math.tan(fovy * Math.PI / 360);
                    return c;
                };
                Camera.prototype.updateFromArray = function (eye, look, up, fovy, focus, aperture) {
                    eye = new Vector3_12.Vector3(eye[0], eye[1], eye[2]);
                    look = new Vector3_12.Vector3(look[0], look[1], look[2]);
                    up = new Vector3_12.Vector3(up[0], up[1], up[2]);
                    var c = this;
                    c.p = eye;
                    c.w = look.sub(eye).normalize();
                    c.u = up.cross(c.w).normalize();
                    c.v = c.w.cross(c.u).normalize();
                    c.m = 1 / Math.tan(fovy * Math.PI / 360);
                    c.focalDistance = focus < 0 ? null : focus;
                    c.apertureRadius = aperture < 0 ? null : aperture;
                };
                Camera.prototype.updateFromJson = function (prop) {
                    this.p.setFromJson(prop.p);
                    this.w.setFromJson(prop.w);
                    this.u.setFromJson(prop.u);
                    this.v.setFromJson(prop.v);
                    this.m = prop.m;
                    if (prop.focalDistance && prop.apertureRadius) {
                        this.focalDistance = prop.focalDistance;
                        this.apertureRadius = prop.apertureRadius;
                    }
                };
                Camera.prototype.setFocus = function (focalPoint, apertureRadius) {
                    this.focalDistance = focalPoint.sub(this.p).length();
                    this.apertureRadius = apertureRadius;
                };
                Camera.prototype.castRay = function (x, y, w, h, u, v) {
                    var c = this;
                    var aspect = w / h;
                    var px = ((x + u - 0.5) / (w - 1)) * 2 - 1;
                    var py = ((y + v - 0.5) / (h - 1)) * 2 - 1;
                    var d = new Vector3_12.Vector3();
                    d = d.add(c.u.mulScalar(-px * aspect));
                    d = d.add(c.v.mulScalar(-py));
                    d = d.add(c.w.mulScalar(c.m));
                    d = d.normalize();
                    var p = c.p;
                    if (c.apertureRadius > 0) {
                        var focalPoint = c.p.add(d.mulScalar(c.focalDistance));
                        var angle = Math.random() * 2 * Math.PI;
                        var radius = Math.random() * c.apertureRadius;
                        p = p.add(c.u.mulScalar(Math.cos(angle) * radius));
                        p = p.add(c.v.mulScalar(Math.sin(angle) * radius));
                        d = focalPoint.sub(p).normalize();
                    }
                    return new Ray_6.Ray(p, d);
                };
                Camera.prototype.toJSON = function () {
                    return {
                        p: this.p,
                        w: this.w,
                        u: this.u,
                        v: this.v,
                        m: this.m,
                        focalDistance: this.focalDistance,
                        apertureRadius: this.apertureRadius
                    };
                };
                Camera.debug = true;
                return Camera;
            }());
            exports_48("Camera", Camera);
        }
    }
});
System.register("core/src/engine/renderer/LiteBucketRenderer", ["core/src/engine/renderer/worker/TraceJobManager", "core/src/engine/renderer/worker/TraceJob"], function(exports_49, context_49) {
    "use strict";
    var __moduleName = context_49 && context_49.id;
    var TraceJobManager_2, TraceJob_2;
    var LiteBucketRenderer;
    return {
        setters:[
            function (TraceJobManager_2_1) {
                TraceJobManager_2 = TraceJobManager_2_1;
            },
            function (TraceJob_2_1) {
                TraceJob_2 = TraceJob_2_1;
            }],
        execute: function() {
            LiteBucketRenderer = (function () {
                function LiteBucketRenderer() {
                    this.bucketSize = 64;
                    this.traceManager = new TraceJobManager_2.TraceJobManager();
                }
                Object.defineProperty(LiteBucketRenderer.prototype, "initialized", {
                    get: function () {
                        return this.traceManager.initialized;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LiteBucketRenderer.prototype, "iterations", {
                    get: function () {
                        return this.traceManager.iterations;
                    },
                    enumerable: true,
                    configurable: true
                });
                LiteBucketRenderer.prototype.render = function (scene, camera, width, height, cameraSamples, hitSamples, bounces, iterations, onUpdate) {
                    if (iterations === void 0) { iterations = 1; }
                    if (!this.traceManager) {
                        this.traceManager = new TraceJobManager_2.TraceJobManager();
                    }
                    this.traceManager.configure({
                        camera: camera,
                        width: width,
                        height: height,
                        cameraSamples: cameraSamples,
                        hitSamples: hitSamples,
                        bounces: bounces
                    }, scene);
                    var col = width / this.bucketSize;
                    var row = height / this.bucketSize;
                    for (var j = 0; j < row; j++) {
                        for (var i = 0; i < col; i++) {
                            this.traceManager.add(new TraceJob_2.TraceJob({
                                id: j + "_" + i,
                                iterations: iterations,
                                width: this.bucketSize,
                                height: this.bucketSize,
                                xoffset: i * this.bucketSize,
                                yoffset: j * this.bucketSize
                            }));
                        }
                    }
                    this.traceManager.updatePixels = onUpdate;
                    this.traceManager.init();
                    return this.traceManager.pixels;
                };
                LiteBucketRenderer.DEBUG = false;
                LiteBucketRenderer.interval = 0;
                return LiteBucketRenderer;
            }());
            exports_49("LiteBucketRenderer", LiteBucketRenderer);
        }
    }
});
System.register("core/src/engine/renderer/SmartBucketRenderer", ["core/src/engine/renderer/worker/TraceJobManager", "core/src/engine/renderer/worker/TraceJob"], function(exports_50, context_50) {
    "use strict";
    var __moduleName = context_50 && context_50.id;
    var TraceJobManager_3, TraceJob_3;
    var SmartBucketRenderer;
    return {
        setters:[
            function (TraceJobManager_3_1) {
                TraceJobManager_3 = TraceJobManager_3_1;
            },
            function (TraceJob_3_1) {
                TraceJob_3 = TraceJob_3_1;
            }],
        execute: function() {
            SmartBucketRenderer = (function () {
                function SmartBucketRenderer() {
                    this.bucketSize = 64;
                    this.traceManager = new TraceJobManager_3.TraceJobManager();
                }
                Object.defineProperty(SmartBucketRenderer.prototype, "initialized", {
                    get: function () {
                        return this.traceManager.initialized;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SmartBucketRenderer.prototype, "iterations", {
                    get: function () {
                        return this.traceManager.iterations;
                    },
                    enumerable: true,
                    configurable: true
                });
                SmartBucketRenderer.prototype.updateCameraSamples = function (newValue) {
                    this.traceManager.queue.forEach(function (job) {
                        job.extra.cameraSamples = newValue;
                    });
                };
                SmartBucketRenderer.prototype.updateHitSamples = function (newValue) {
                    this.traceManager.queue.forEach(function (job) {
                        job.extra.hitSamples = newValue;
                    });
                };
                SmartBucketRenderer.prototype.updateCamera = function (newValue) {
                    this.traceManager.stop();
                    this.traceManager.clear();
                    this.traceManager.referenceQueue.forEach(function (job) {
                        job.extra.camera = newValue;
                    });
                    this.traceManager.restart();
                };
                SmartBucketRenderer.prototype.render = function (scene, camera, width, height, cameraSamples, hitSamples, bounces, iterations, blockIterations, onUpdate, onInit) {
                    if (iterations === void 0) { iterations = 1; }
                    if (blockIterations === void 0) { blockIterations = 1; }
                    if (!this.traceManager) {
                        this.traceManager = new TraceJobManager_3.TraceJobManager();
                    }
                    this.traceManager.maxLoop = iterations - 1;
                    this.traceManager.configure({
                        camera: camera,
                        width: width,
                        height: height,
                        cameraSamples: cameraSamples,
                        hitSamples: hitSamples,
                        bounces: bounces
                    }, scene);
                    var col = width / this.bucketSize;
                    var row = height / this.bucketSize;
                    for (var j = 0; j < row; j++) {
                        for (var i = 0; i < col; i++) {
                            this.traceManager.add(new TraceJob_3.TraceJob({
                                id: j + "_" + i,
                                blockIterations: blockIterations,
                                width: this.bucketSize,
                                height: this.bucketSize,
                                xoffset: i * this.bucketSize,
                                yoffset: j * this.bucketSize
                            }));
                        }
                    }
                    this.traceManager.updatePixels = onUpdate;
                    this.traceManager.init(onInit);
                    return this.traceManager.pixels;
                };
                SmartBucketRenderer.DEBUG = false;
                SmartBucketRenderer.interval = 0;
                return SmartBucketRenderer;
            }());
            exports_50("SmartBucketRenderer", SmartBucketRenderer);
        }
    }
});
System.register("core/src/engine/scene/materials/TransparentMaterial", ["core/src/engine/scene/materials/Material", "core/src/engine/scene/materials/Attenuation"], function(exports_51, context_51) {
    "use strict";
    var __moduleName = context_51 && context_51.id;
    var Material_17, Attenuation_8;
    var TransparentMaterial;
    return {
        setters:[
            function (Material_17_1) {
                Material_17 = Material_17_1;
            },
            function (Attenuation_8_1) {
                Attenuation_8 = Attenuation_8_1;
            }],
        execute: function() {
            TransparentMaterial = (function (_super) {
                __extends(TransparentMaterial, _super);
                function TransparentMaterial(color, index, gloss, tint) {
                    if (index === void 0) { index = 1; }
                    if (gloss === void 0) { gloss = 1; }
                    if (tint === void 0) { tint = 0; }
                    _super.call(this, color, null, null, null, 1, 0, Attenuation_8.NoAttenuation, index, gloss, tint, true);
                }
                return TransparentMaterial;
            }(Material_17.Material));
            exports_51("TransparentMaterial", TransparentMaterial);
        }
    }
});
System.register("core/src/engine/engine", ["core/src/engine/data/DataCache", "core/src/engine/data/ImageLoader", "core/src/engine/data/OBJLoader", "core/src/engine/math/Color", "core/src/engine/math/Constants", "core/src/engine/math/Hit", "core/src/engine/math/HitInfo", "core/src/engine/math/Matrix4", "core/src/engine/math/TMatrix4", "core/src/engine/math/Ray", "core/src/engine/math/Vector3", "core/src/engine/renderer/worker/Thread", "core/src/engine/renderer/worker/ThreadPool", "core/src/engine/renderer/worker/TraceJobManager", "core/src/engine/renderer/worker/TraceJob", "core/src/engine/renderer/LiteBucketRenderer", "core/src/engine/renderer/SmartBucketRenderer", "core/src/engine/scene/Axis", "core/src/engine/scene/Camera", "core/src/engine/scene/Scene", "core/src/engine/scene/SharedScene", "core/src/engine/scene/materials/Attenuation", "core/src/engine/scene/materials/Material", "core/src/engine/scene/materials/DiffuseMaterial", "core/src/engine/scene/materials/GlossyMaterial", "core/src/engine/scene/materials/ClearMaterial", "core/src/engine/scene/materials/LightMaterial", "core/src/engine/scene/materials/MaterialUtils", "core/src/engine/scene/materials/SpecularMaterial", "core/src/engine/scene/materials/Texture", "core/src/engine/scene/materials/TransparentMaterial", "core/src/engine/scene/shapes/Box", "core/src/engine/scene/shapes/Shape", "core/src/engine/scene/shapes/Cube", "core/src/engine/scene/shapes/Mesh", "core/src/engine/scene/shapes/Sphere", "core/src/engine/scene/shapes/TransformedShape", "core/src/engine/scene/shapes/Triangle", "core/src/engine/scene/tree/Node", "core/src/engine/scene/tree/SharedNode", "core/src/engine/scene/tree/Tree", "core/src/engine/scene/tree/SharedTree", "core/src/engine/utils/MapUtils", "core/src/engine/utils/MathUtils"], function(exports_52, context_52) {
    "use strict";
    var __moduleName = context_52 && context_52.id;
    function exportStar_2(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_52(exports);
    }
    return {
        setters:[
            function (DataCache_2_1) {
                exportStar_2(DataCache_2_1);
            },
            function (ImageLoader_2_1) {
                exportStar_2(ImageLoader_2_1);
            },
            function (OBJLoader_1_1) {
                exportStar_2(OBJLoader_1_1);
            },
            function (Color_9_1) {
                exportStar_2(Color_9_1);
            },
            function (Constants_8_1) {
                exportStar_2(Constants_8_1);
            },
            function (Hit_11_1) {
                exportStar_2(Hit_11_1);
            },
            function (HitInfo_3_1) {
                exportStar_2(HitInfo_3_1);
            },
            function (Matrix4_4_1) {
                exportStar_2(Matrix4_4_1);
            },
            function (TMatrix4_1_1) {
                exportStar_2(TMatrix4_1_1);
            },
            function (Ray_7_1) {
                exportStar_2(Ray_7_1);
            },
            function (Vector3_13_1) {
                exportStar_2(Vector3_13_1);
            },
            function (Thread_2_1) {
                exportStar_2(Thread_2_1);
            },
            function (ThreadPool_3_1) {
                exportStar_2(ThreadPool_3_1);
            },
            function (TraceJobManager_4_1) {
                exportStar_2(TraceJobManager_4_1);
            },
            function (TraceJob_4_1) {
                exportStar_2(TraceJob_4_1);
            },
            function (LiteBucketRenderer_1_1) {
                exportStar_2(LiteBucketRenderer_1_1);
            },
            function (SmartBucketRenderer_1_1) {
                exportStar_2(SmartBucketRenderer_1_1);
            },
            function (Axis_4_1) {
                exportStar_2(Axis_4_1);
            },
            function (Camera_1_1) {
                exportStar_2(Camera_1_1);
            },
            function (Scene_2_1) {
                exportStar_2(Scene_2_1);
            },
            function (SharedScene_1_1) {
                exportStar_2(SharedScene_1_1);
            },
            function (Attenuation_9_1) {
                exportStar_2(Attenuation_9_1);
            },
            function (Material_18_1) {
                exportStar_2(Material_18_1);
            },
            function (DiffuseMaterial_2_1) {
                exportStar_2(DiffuseMaterial_2_1);
            },
            function (GlossyMaterial_2_1) {
                exportStar_2(GlossyMaterial_2_1);
            },
            function (ClearMaterial_2_1) {
                exportStar_2(ClearMaterial_2_1);
            },
            function (LightMaterial_2_1) {
                exportStar_2(LightMaterial_2_1);
            },
            function (MaterialUtils_4_1) {
                exportStar_2(MaterialUtils_4_1);
            },
            function (SpecularMaterial_2_1) {
                exportStar_2(SpecularMaterial_2_1);
            },
            function (Texture_2_1) {
                exportStar_2(Texture_2_1);
            },
            function (TransparentMaterial_1_1) {
                exportStar_2(TransparentMaterial_1_1);
            },
            function (Box_10_1) {
                exportStar_2(Box_10_1);
            },
            function (Shape_8_1) {
                exportStar_2(Shape_8_1);
            },
            function (Cube_3_1) {
                exportStar_2(Cube_3_1);
            },
            function (Mesh_4_1) {
                exportStar_2(Mesh_4_1);
            },
            function (Sphere_3_1) {
                exportStar_2(Sphere_3_1);
            },
            function (TransformedShape_3_1) {
                exportStar_2(TransformedShape_3_1);
            },
            function (Triangle_5_1) {
                exportStar_2(Triangle_5_1);
            },
            function (Node_2_1) {
                exportStar_2(Node_2_1);
            },
            function (SharedNode_3_1) {
                exportStar_2(SharedNode_3_1);
            },
            function (Tree_3_1) {
                exportStar_2(Tree_3_1);
            },
            function (SharedTree_3_1) {
                exportStar_2(SharedTree_3_1);
            },
            function (MapUtils_8_1) {
                exportStar_2(MapUtils_8_1);
            },
            function (MathUtils_4_1) {
                exportStar_2(MathUtils_4_1);
            }],
        execute: function() {
        }
    }
});
System.register("core/src/ThreeObjects", [], function(exports_53, context_53) {
    "use strict";
    var __moduleName = context_53 && context_53.id;
    var ThreeObjects;
    return {
        setters:[],
        execute: function() {
            ThreeObjects = (function () {
                function ThreeObjects() {
                }
                ThreeObjects.PointLight = "PointLight";
                ThreeObjects.Mesh = "Mesh";
                ThreeObjects.Group = "Group";
                return ThreeObjects;
            }());
            exports_53("ThreeObjects", ThreeObjects);
        }
    }
});
System.register("core/src/ThreeJSView", [], function(exports_54, context_54) {
    "use strict";
    var __moduleName = context_54 && context_54.id;
    var ThreeJSView;
    return {
        setters:[],
        execute: function() {
            ThreeJSView = (function () {
                function ThreeJSView(width, height, container, appContainer) {
                    var _this = this;
                    this.width = width;
                    this.height = height;
                    this.container = container;
                    this.appContainer = appContainer;
                    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 20000);
                    this.camera.up = new THREE.Vector3(0, 1, 0);
                    this.camera.position.y = 10;
                    this.camera.position.z = 10;
                    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
                    this.scene = new THREE.Scene();
                    this.scene.position.x = 0;
                    this.scene.position.y = 0;
                    this.renderer = new THREE.WebGLRenderer();
                    this.renderer.setPixelRatio(window.devicePixelRatio);
                    this.renderer.setSize(this.width, this.height);
                    this.renderer.shadowMap.enabled = true;
                    this.renderer.shadowMap.type = THREE.BasicShadowMap;
                    this.container.appendChild(this.renderer.domElement);
                    this.controls = new THREE["EditorControls"](this.camera, this.appContainer);
                    this.controls.addEventListener('change', function () {
                        _this.render();
                        if (_this.onCameraChange) {
                            _this.onCameraChange(_this.camera);
                        }
                    });
                }
                ThreeJSView.prototype.animate = function () {
                    requestAnimationFrame(this.animate.bind(this));
                    this.render();
                };
                ThreeJSView.prototype.render = function () {
                    this.renderer.render(this.scene, this.camera);
                };
                return ThreeJSView;
            }());
            exports_54("ThreeJSView", ThreeJSView);
        }
    }
});
System.register("core/src/CanvasDisplay", [], function(exports_55, context_55) {
    "use strict";
    var __moduleName = context_55 && context_55.id;
    var CanvasDisplay;
    return {
        setters:[],
        execute: function() {
            CanvasDisplay = (function () {
                function CanvasDisplay(i_width, i_height, container) {
                    if (i_width === void 0) { i_width = 640; }
                    if (i_height === void 0) { i_height = 480; }
                    this.i_width = i_width;
                    this.i_height = i_height;
                    this.container = container;
                    this.canvas = document.createElement("canvas");
                    this.canvas.id = "giImageOutput";
                    this.canvas.style.backgroundColor = "#3C3C3C";
                    this.canvas.style.position = "absolute";
                    this.canvas.width = this.i_width;
                    this.canvas.height = this.i_height;
                    if (container) {
                        this.attachDom(container);
                    }
                }
                CanvasDisplay.prototype.attachDom = function (dom) {
                    this.container = dom;
                    this.container.appendChild(this.canvas);
                    this.ctx = this.canvas.getContext("2d");
                    this.imageData = this.ctx.getImageData(0, 0, this.i_width, this.i_height);
                    this.data = this.imageData.data;
                    this.onWindowResize();
                };
                CanvasDisplay.prototype.onWindowResize = function () {
                };
                CanvasDisplay.prototype.setResolution = function (width, height) {
                    this.i_width = width;
                    this.i_height = height;
                    this.canvas.width = width;
                    this.canvas.height = height;
                    this.imageData = this.ctx.getImageData(0, 0, this.i_width, this.i_height);
                    this.data = this.imageData.data;
                };
                CanvasDisplay.prototype.updatePixels = function (pixels) {
                    for (var y = 0; y < this.i_height; y++) {
                        for (var x = 0; x < this.i_width; x++) {
                            var i = y * (this.i_width * 4) + (x * 4);
                            var pi = y * (this.i_width * 3) + (x * 3);
                            this.data[i] = pixels[pi];
                            this.data[i + 1] = pixels[pi + 1];
                            this.data[i + 2] = pixels[pi + 2];
                            this.data[i + 3] = 255;
                        }
                    }
                    this.ctx.putImageData(this.imageData, 0, 0);
                };
                CanvasDisplay.prototype.updatePixelsRect = function (rect, pixels) {
                    for (var y = rect.yoffset; y < rect.yoffset + rect.height; y++) {
                        for (var x = rect.xoffset; x < rect.xoffset + rect.width; x++) {
                            var i = y * (this.i_width * 4) + (x * 4);
                            var pi = y * (this.i_width * 3) + (x * 3);
                            this.data[i] = pixels[pi];
                            this.data[i + 1] = pixels[pi + 1];
                            this.data[i + 2] = pixels[pi + 2];
                            this.data[i + 3] = 255;
                        }
                    }
                    this.ctx.putImageData(this.imageData, 0, 0);
                };
                return CanvasDisplay;
            }());
            exports_55("CanvasDisplay", CanvasDisplay);
        }
    }
});
System.register("core/src/GIRenderBase", ["core/src/CanvasDisplay", "core/src/engine/renderer/SmartBucketRenderer"], function(exports_56, context_56) {
    "use strict";
    var __moduleName = context_56 && context_56.id;
    var CanvasDisplay_1, SmartBucketRenderer_2;
    var GIRenderBase;
    return {
        setters:[
            function (CanvasDisplay_1_1) {
                CanvasDisplay_1 = CanvasDisplay_1_1;
            },
            function (SmartBucketRenderer_2_1) {
                SmartBucketRenderer_2 = SmartBucketRenderer_2_1;
            }],
        execute: function() {
            GIRenderBase = (function (_super) {
                __extends(GIRenderBase, _super);
                function GIRenderBase(i_width, i_height, container) {
                    _super.call(this, i_width, i_height, container);
                    this.renderer = new SmartBucketRenderer_2.SmartBucketRenderer();
                }
                GIRenderBase.prototype.updateCameraSamples = function (newValue) {
                    if (this.cameraSamples != newValue) {
                        this.cameraSamples = newValue;
                        this.renderer.updateCameraSamples(newValue);
                    }
                };
                GIRenderBase.prototype.updateHitSamples = function (newValue) {
                    if (this.hitSamples != newValue) {
                        this.hitSamples = newValue;
                        this.renderer.updateHitSamples(newValue);
                    }
                };
                GIRenderBase.prototype.updateCamera = function (newValue) {
                    this.camera.updateFromArray(newValue.eye, newValue.lookAt, newValue.up, newValue.fov, newValue.focus, newValue.aperture);
                    this.renderer.updateCamera(this.camera.toJSON());
                };
                GIRenderBase.prototype.updateCameraMatrix = function (matrix) {
                    this.camera.u.setFromArray(matrix, 0);
                    this.camera.v.setFromArray(matrix, 4);
                    this.camera.w.setFromArray(matrix, 8);
                    this.renderer.updateCamera(this.camera.toJSON());
                };
                GIRenderBase.prototype.toggleTrace = function (newValue) {
                    if (this.renderer.initialized) {
                        console.log("toggleTrace:" + newValue);
                        if (newValue) {
                            var cam = this.camera.toJSON();
                            this.dirty = false;
                            this.renderer.updateCamera(cam);
                        }
                        else {
                            this.renderer.traceManager.stop();
                        }
                    }
                };
                GIRenderBase.prototype.render = function (onInit) {
                    console.info("+ Render settings");
                    console.info("      Resolution          :   " + this.i_width + "x" + this.i_height);
                    console.info("      CameraSamples       :   " + this.cameraSamples);
                    console.info("      HitSamples          :   " + this.hitSamples);
                    console.info("      Bounces             :   " + this.bounces);
                    console.info("      Iterations          :   " + this.iterations);
                    console.info("      Block-Iterations    :   " + this.blockIterations);
                    var self = this;
                    this.pixels = this.renderer.render(this.scene, this.camera, this.i_width, this.i_height, this.cameraSamples, this.hitSamples, this.bounces, this.iterations, this.blockIterations, onUpdate, onInit);
                    function onUpdate(rect) {
                        self.updatePixelsRect(rect, self.pixels);
                    }
                };
                return GIRenderBase;
            }(CanvasDisplay_1.CanvasDisplay));
            exports_56("GIRenderBase", GIRenderBase);
        }
    }
});
System.register("core/src/GIJSView", ["core/src/GIRenderBase", "core/src/engine/math/Color", "core/src/engine/scene/Camera", "core/src/engine/scene/SharedScene", "core/src/engine/scene/shapes/Cube", "core/src/engine/math/Vector3", "core/src/engine/scene/shapes/Sphere", "core/src/engine/scene/materials/LightMaterial", "core/src/ThreeObjects", "core/src/engine/scene/shapes/Mesh", "core/src/engine/scene/shapes/Triangle", "core/src/engine/scene/materials/Material", "core/src/engine/scene/shapes/TransformedShape", "core/src/engine/scene/materials/Attenuation", "core/src/engine/math/Matrix4"], function(exports_57, context_57) {
    "use strict";
    var __moduleName = context_57 && context_57.id;
    var GIRenderBase_1, Color_10, Camera_2, SharedScene_2, Cube_4, Vector3_14, Sphere_4, LightMaterial_3, ThreeObjects_1, Mesh_5, Triangle_6, Material_19, TransformedShape_4, Attenuation_10, Attenuation_11, Matrix4_5;
    var GIJSView;
    return {
        setters:[
            function (GIRenderBase_1_1) {
                GIRenderBase_1 = GIRenderBase_1_1;
            },
            function (Color_10_1) {
                Color_10 = Color_10_1;
            },
            function (Camera_2_1) {
                Camera_2 = Camera_2_1;
            },
            function (SharedScene_2_1) {
                SharedScene_2 = SharedScene_2_1;
            },
            function (Cube_4_1) {
                Cube_4 = Cube_4_1;
            },
            function (Vector3_14_1) {
                Vector3_14 = Vector3_14_1;
            },
            function (Sphere_4_1) {
                Sphere_4 = Sphere_4_1;
            },
            function (LightMaterial_3_1) {
                LightMaterial_3 = LightMaterial_3_1;
            },
            function (ThreeObjects_1_1) {
                ThreeObjects_1 = ThreeObjects_1_1;
            },
            function (Mesh_5_1) {
                Mesh_5 = Mesh_5_1;
            },
            function (Triangle_6_1) {
                Triangle_6 = Triangle_6_1;
            },
            function (Material_19_1) {
                Material_19 = Material_19_1;
            },
            function (TransformedShape_4_1) {
                TransformedShape_4 = TransformedShape_4_1;
            },
            function (Attenuation_10_1) {
                Attenuation_10 = Attenuation_10_1;
                Attenuation_11 = Attenuation_10_1;
            },
            function (Matrix4_5_1) {
                Matrix4_5 = Matrix4_5_1;
            }],
        execute: function() {
            GIJSView = (function (_super) {
                __extends(GIJSView, _super);
                function GIJSView(width, height, container) {
                    _super.call(this, width, height, container);
                    this.width = width;
                    this.height = height;
                    this.container = container;
                    this.identityMatrix = new THREE.Matrix4().identity();
                    this.scene = new SharedScene_2.SharedScene(Color_10.Color.hexColor(0x262626));
                    this.camera = Camera_2.Camera.lookAt(new Vector3_14.Vector3(0, 0, 0), new Vector3_14.Vector3(0, 0, 0), new Vector3_14.Vector3(0, 1, 0), 45);
                    this.cameraSamples = -1;
                    this.hitSamples = 1;
                    this.bounces = 4;
                    this.iterations = 1000000;
                    this.blockIterations = 1;
                }
                GIJSView.prototype.setThreeJSScene = function (scene, onInit) {
                    this.loadChildren(scene);
                    this.render(onInit);
                };
                GIJSView.prototype.loadChildren = function (parent) {
                    var child;
                    for (var i = 0; i < parent.children.length; i++) {
                        child = parent.children[i];
                        var obj = this.buildSceneObject(child);
                        if (obj) {
                            this.scene.add(obj);
                        }
                        if (obj) {
                            if (!(obj.getMaterial(new Vector3_14.Vector3()) instanceof LightMaterial_3.LightMaterial) && child.children.length > 0) {
                                this.loadChildren(child);
                            }
                        }
                        else {
                            if (child.children.length > 0) {
                                this.loadChildren(child);
                            }
                        }
                    }
                };
                GIJSView.prototype.buildSceneObject = function (src) {
                    switch (src.type) {
                        case ThreeObjects_1.ThreeObjects.Mesh:
                            var material = GIJSView.getMaterial(src.material);
                            var shape = this.buildGeometry(src.geometry, material);
                            var matrixWorld = src.matrixWorld;
                            if (matrixWorld.equals(this.identityMatrix)) {
                                return shape;
                            }
                            else {
                                var mat = Matrix4_5.Matrix4.fromTHREEJS(matrixWorld.elements);
                                return TransformedShape_4.TransformedShape.newTransformedShape(shape, mat);
                            }
                        case ThreeObjects_1.ThreeObjects.PointLight:
                            return this.getLight(src);
                    }
                    return null;
                };
                GIJSView.prototype.buildGeometry = function (geometry, material) {
                    if (geometry["_bufferGeometry"]) {
                        geometry = geometry["_bufferGeometry"];
                    }
                    var triangles = [];
                    if (!geometry.attributes) {
                        var vertices = geometry.vertices;
                        var faces = geometry.faces;
                        if (vertices && faces) {
                            for (var i = 0; i < faces.length; i++) {
                                var face = faces[i];
                                var triangle = new Triangle_6.Triangle();
                                triangle.material = material;
                                triangle.v1 = new Vector3_14.Vector3(vertices[face.a].x, vertices[face.a].y, vertices[face.a].z);
                                triangle.v2 = new Vector3_14.Vector3(vertices[face.b].x, vertices[face.b].y, vertices[face.b].z);
                                triangle.v3 = new Vector3_14.Vector3(vertices[face.c].x, vertices[face.c].y, vertices[face.c].z);
                                triangle.n1 = new Vector3_14.Vector3();
                                triangle.n2 = new Vector3_14.Vector3();
                                triangle.n3 = new Vector3_14.Vector3();
                                triangle.updateBox();
                                triangle.fixNormals();
                                triangles.push(triangle);
                            }
                        }
                        else {
                            return null;
                        }
                    }
                    else {
                        var positions = geometry.attributes["position"].array;
                        var normals;
                        if (geometry.attributes["normal"]) {
                            normals = geometry.attributes["normal"].array;
                        }
                        else {
                            normals = this.computeNormals(positions);
                        }
                        var triCount = 0;
                        var indexAttribute = geometry.getIndex();
                        if (indexAttribute) {
                            var indices = indexAttribute.array;
                            for (var i = 0; i < indices.length; i = i + 3) {
                                triCount++;
                                var a;
                                var b;
                                var c;
                                a = indices[i];
                                b = indices[i + 1];
                                c = indices[i + 2];
                                if (triCount % 2 !== 0) {
                                    a = indices[i];
                                    b = indices[i + 1];
                                    c = indices[i + 2];
                                }
                                else {
                                    c = indices[i];
                                    b = indices[i + 1];
                                    a = indices[i + 2];
                                }
                                var ax = a * 3;
                                var ay = (a * 3) + 1;
                                var az = (a * 3) + 2;
                                var bx = b * 3;
                                var by = (b * 3) + 1;
                                var bz = (b * 3) + 2;
                                var cx = c * 3;
                                var cy = (c * 3) + 1;
                                var cz = (c * 3) + 2;
                                var triangle = new Triangle_6.Triangle();
                                triangle.material = material;
                                triangle.v1 = new Vector3_14.Vector3(positions[ax], positions[ay], positions[az]);
                                triangle.v2 = new Vector3_14.Vector3(positions[bx], positions[by], positions[bz]);
                                triangle.v3 = new Vector3_14.Vector3(positions[cx], positions[cy], positions[cz]);
                                triangle.n1 = new Vector3_14.Vector3(normals[ax], normals[ay], normals[az]);
                                triangle.n2 = new Vector3_14.Vector3(normals[bx], normals[by], normals[bz]);
                                triangle.n3 = new Vector3_14.Vector3(normals[cx], normals[cy], normals[cz]);
                                triangle.fixNormals();
                                triangle.updateBox();
                                triangles.push(triangle);
                            }
                        }
                        else {
                            for (var i = 0; i < positions.length; i = i + 9) {
                                var triangle = new Triangle_6.Triangle();
                                triangle.material = material;
                                triangle.v1 = new Vector3_14.Vector3(positions[i], positions[i + 1], positions[i + 2]);
                                triangle.v2 = new Vector3_14.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
                                triangle.v3 = new Vector3_14.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
                                triangle.n1 = new Vector3_14.Vector3(normals[i], normals[i + 1], normals[i + 2]);
                                triangle.n2 = new Vector3_14.Vector3(normals[i + 3], normals[i + 4], normals[i + 5]);
                                triangle.n3 = new Vector3_14.Vector3(normals[i + 6], normals[i + 7], normals[i + 8]);
                                triangle.fixNormals();
                                triangle.updateBox();
                                triangles.push(triangle);
                            }
                        }
                    }
                    var mesh = Mesh_5.Mesh.newMesh(triangles);
                    return mesh;
                };
                GIJSView.prototype.computeNormals = function (positions) {
                    return new Float32Array(positions.length);
                };
                GIJSView.prototype.updateCamera = function (camera) {
                    this.camera.p.setFromJson(camera.position);
                    this.camera.m = 1 / Math.tan(camera.fov * Math.PI / 360);
                    var e = camera.matrix.elements;
                    var x = [-e[0], -e[1], -e[2]];
                    var y = [e[4], e[5], e[6]];
                    var z = [-e[8], -e[9], -e[10]];
                    this.camera.u.setFromArray(x);
                    this.camera.v.setFromArray(y);
                    this.camera.w.setFromArray(z);
                    this.dirty = true;
                    if (this.renderer) {
                        this.renderer.traceManager.stop();
                    }
                };
                GIJSView.getMaterial = function (srcMaterial) {
                    var material = new Material_19.Material(Color_10.Color.hexColor(srcMaterial.color.getHex()));
                    material.ior = srcMaterial.ior ? srcMaterial.ior : 1;
                    material.tint = srcMaterial.tint ? srcMaterial.tint : 0;
                    material.gloss = srcMaterial.gloss ? srcMaterial.gloss : 0;
                    material.emittance = srcMaterial.emittance ? srcMaterial.emittance : 0;
                    material.transparent = srcMaterial.transparent;
                    material.attenuation = Attenuation_10.Attenuation.fromJson(srcMaterial.attenuation);
                    return material;
                };
                GIJSView.prototype.getLight = function (src) {
                    if (src.children.length > 0) {
                        var lightGeometry = src.children[0].geometry;
                        if (lightGeometry instanceof THREE.SphereGeometry) {
                            var _radius = lightGeometry.parameters.radius;
                        }
                        else if (lightGeometry instanceof THREE.PlaneGeometry) {
                            var width = lightGeometry.parameters.width;
                            var height = lightGeometry.parameters.height;
                        }
                    }
                    var material = new LightMaterial_3.LightMaterial(Color_10.Color.hexColor(src.color.getHex()), src.intensity, new Attenuation_11.LinearAttenuation(src.distance));
                    if (_radius) {
                        var shape = Sphere_4.Sphere.newSphere(new Vector3_14.Vector3(src.position.x, src.position.y, src.position.z), _radius, material);
                    }
                    else {
                        shape = Cube_4.Cube.newCube(new Vector3_14.Vector3(-width / 2, src.position.y, -height / 2), new Vector3_14.Vector3(width / 2, src.position.y + 1, height / 2), material);
                    }
                    return shape;
                };
                return GIJSView;
            }(GIRenderBase_1.GIRenderBase));
            exports_57("GIJSView", GIJSView);
        }
    }
});
System.register("core/core", ["core/src/pointer/pointer", "core/src/engine/engine", "core/src/ThreeObjects", "core/src/ThreeJSView", "core/src/CanvasDisplay", "core/src/GIRenderBase", "core/src/GIJSView"], function(exports_58, context_58) {
    "use strict";
    var __moduleName = context_58 && context_58.id;
    function exportStar_3(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_58(exports);
    }
    return {
        setters:[
            function (pointer_1_1) {
                exportStar_3(pointer_1_1);
            },
            function (engine_1_1) {
                exportStar_3(engine_1_1);
            },
            function (ThreeObjects_2_1) {
                exportStar_3(ThreeObjects_2_1);
            },
            function (ThreeJSView_1_1) {
                exportStar_3(ThreeJSView_1_1);
            },
            function (CanvasDisplay_2_1) {
                exportStar_3(CanvasDisplay_2_1);
            },
            function (GIRenderBase_2_1) {
                exportStar_3(GIRenderBase_2_1);
            },
            function (GIJSView_1_1) {
                exportStar_3(GIJSView_1_1);
            }],
        execute: function() {
        }
    }
});
System.register("xrenderer", ["core/core"], function(exports_59, context_59) {
    "use strict";
    var __moduleName = context_59 && context_59.id;
    function exportStar_4(m) {
        var exports = {};
        for(var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_59(exports);
    }
    return {
        setters:[
            function (core_1_1) {
                exportStar_4(core_1_1);
            }],
        execute: function() {
        }
    }
});
System.register("core/src/three/GIThree", [], function(exports_60, context_60) {
    "use strict";
    var __moduleName = context_60 && context_60.id;
    var GIThree;
    return {
        setters:[],
        execute: function() {
            GIThree = (function () {
                function GIThree(scene) {
                    this.scene = scene;
                    console.log(scene);
                }
                return GIThree;
            }());
            exports_60("GIThree", GIThree);
        }
    }
});
System.register("core/src/utils/NetworkUtils", [], function(exports_61, context_61) {
    "use strict";
    var __moduleName = context_61 && context_61.id;
    var NetworkUtils;
    return {
        setters:[],
        execute: function() {
            NetworkUtils = (function () {
                function NetworkUtils() {
                }
                return NetworkUtils;
            }());
            exports_61("NetworkUtils", NetworkUtils);
        }
    }
});
//# sourceMappingURL=xrenderer.js.map