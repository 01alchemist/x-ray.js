System.register([], function(exports_1, context_1) {
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
//# sourceMappingURL=ByteArrayBase.js.map