var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * JavaScript UInt64
 * version : 0.1
 * @author Nidin Vinayakan | nidinthb@gmail.com
 *
 */
var ctypes;
(function (ctypes) {
    var UInt64 = (function () {
        function UInt64(low, high) {
            if (low === void 0) { low = 0; }
            if (high === void 0) { high = 0; }
            this.low = low;
            this.high = high;
        }
        UInt64.prototype.value = function () {
            //this._value = (this.low | (this.high << 32));
            var _h = this.high.toString(16);
            var _hd = 8 - _h.length;
            if (_hd > 0) {
                for (var i = 0; i < _hd; i++) {
                    _h = '0' + _h;
                }
            }
            var _l = this.low.toString(16);
            var _ld = 8 - _l.length;
            if (_ld > 0) {
                for (i = 0; i < _ld; i++) {
                    _l = '0' + _l;
                }
            }
            this._value = Number('0x' + _h + _l);
            return this._value;
        };
        return UInt64;
    }());
    ctypes.UInt64 = UInt64;
})(ctypes || (ctypes = {}));
/**
 * JavaScript Int64
 * version : 0.1
 * @author Nidin Vinayakan | nidinthb@gmail.com
 *
 */
var ctypes;
(function (ctypes) {
    var Int64 = (function () {
        function Int64(low, high) {
            this.low = low;
            this.high = high;
        }
        Int64.prototype.value = function () {
            //this._value = (this.low | (this.high << 32));
            var _h = this.high.toString(16);
            var _hd = 8 - _h.length;
            if (_hd > 0) {
                for (var i = 0; i < _hd; i++) {
                    _h = '0' + _h;
                }
            }
            var _l = this.low.toString(16);
            var _ld = 8 - _l.length;
            if (_ld > 0) {
                for (i = 0; i < _ld; i++) {
                    _l = '0' + _l;
                }
            }
            this._value = Number('0x' + _h + _l);
            return this._value;
        };
        return Int64;
    }());
    ctypes.Int64 = Int64;
})(ctypes || (ctypes = {}));
///<reference path="./ctypes/ctypes.d.ts" />
/**
* JavaScript ByteArrayBase
* version : 0.2
* @author Nidin Vinayakan | nidinthb@gmail.com
*
* ActionScript3 ByteArrayBase implementation in JavaScript
* limitation : size of ByteArrayBase cannot be changed
*
*/
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        var UInt64 = ctypes.UInt64;
        var Int64 = ctypes.Int64;
        var ByteArrayBase = (function () {
            function ByteArrayBase(buffer, offset, length) {
                if (offset === void 0) { offset = 0; }
                if (length === void 0) { length = 0; }
                this.BUFFER_EXT_SIZE = 1024; //Buffer expansion size
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
                // getter setter
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
            //end
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
            /**
             * Reads a Boolean value from the byte stream. A single byte is read,
             * and true is returned if the byte is nonzero,
             * false otherwise.
             * @return	Returns true if the byte is nonzero, false otherwise.
            */
            ByteArrayBase.prototype.readBoolean = function () {
                if (!this.validate(ByteArrayBase.SIZE_OF_BOOLEAN))
                    return null;
                return this.data.getUint8(this.position++) != 0;
            };
            /**
             * Reads a signed byte from the byte stream.
             * The returned value is in the range -128 to 127.
             * @return	An integer between -128 and 127.
             */
            ByteArrayBase.prototype.readByte = function () {
                if (!this.validate(ByteArrayBase.SIZE_OF_INT8))
                    return null;
                return this.data.getInt8(this.position++);
            };
            /**
             * Reads the number of data bytes, specified by the length parameter, from the byte stream.
             * The bytes are read into the ByteArrayBase object specified by the bytes parameter,
             * and the bytes are written into the destination ByteArrayBase starting at the _position specified by offset.
             * @param	bytes	The ByteArrayBase object to read data into.
             * @param	offset	The offset (_position) in bytes at which the read data should be written.
             * @param	length	The number of bytes to read.  The default value of 0 causes all available data to be read.
             */
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
                    //This method is expensive
                    for (var i = 0; i < length; i++) {
                        _bytes.data.setUint8(i + offset, this.data.getUint8(this.position++));
                    }
                }
                else {
                    //Offset argument ignored
                    _bytes = _bytes == null ? new ByteArrayBase(null) : _bytes;
                    _bytes.dataView = new DataView(this.data.buffer, this.bufferOffset + this.position, length);
                    this.position += length;
                }
                return _bytes;
            };
            /**
             * Reads an IEEE 754 double-precision (64-bit) floating-point number from the byte stream.
             * @return	A double-precision (64-bit) floating-point number.
             */
            ByteArrayBase.prototype.readDouble = function () {
                if (!this.validate(ByteArrayBase.SIZE_OF_FLOAT64))
                    return null;
                var value = this.data.getFloat64(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_FLOAT64;
                return value;
            };
            /**
             * Reads an IEEE 754 single-precision (32-bit) floating-point number from the byte stream.
             * @return	A single-precision (32-bit) floating-point number.
             */
            ByteArrayBase.prototype.readFloat = function () {
                if (!this.validate(ByteArrayBase.SIZE_OF_FLOAT32))
                    return null;
                var value = this.data.getFloat32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_FLOAT32;
                return value;
            };
            /**
             * Reads a signed 32-bit integer from the byte stream.
             *
             *   The returned value is in the range -2147483648 to 2147483647.
             * @return	A 32-bit signed integer between -2147483648 and 2147483647.
             */
            ByteArrayBase.prototype.readInt = function () {
                if (!this.validate(ByteArrayBase.SIZE_OF_INT32))
                    return null;
                var value = this.data.getInt32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_INT32;
                return value;
            };
            /**
             * Reads a signed 64-bit integer from the byte stream.
             *
             *   The returned value is in the range −(2^63) to 2^63 − 1
             * @return	A 64-bit signed integer between −(2^63) to 2^63 − 1
             */
            ByteArrayBase.prototype.readInt64 = function () {
                if (!this.validate(ByteArrayBase.SIZE_OF_UINT32))
                    return null;
                var low = this.data.getInt32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_INT32;
                var high = this.data.getInt32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_INT32;
                return new Int64(low, high);
            };
            /**
             * Reads a multibyte string of specified length from the byte stream using the
             * specified character set.
             * @param	length	The number of bytes from the byte stream to read.
             * @param	charSet	The string denoting the character set to use to interpret the bytes.
             *   Possible character set strings include "shift-jis", "cn-gb",
             *   "iso-8859-1", and others.
             *   For a complete list, see Supported Character Sets.
             *   Note: If the value for the charSet parameter
             *   is not recognized by the current system, the application uses the system's default
             *   code page as the character set. For example, a value for the charSet parameter,
             *   as in myTest.readMultiByte(22, "iso-8859-01") that uses 01 instead of
             *   1 might work on your development system, but not on another system.
             *   On the other system, the application will use the system's default code page.
             * @return	UTF-8 encoded string.
             */
            ByteArrayBase.prototype.readMultiByte = function (length, charSet) {
                if (!this.validate(length))
                    return null;
                return "";
            };
            /**
             * Reads a signed 16-bit integer from the byte stream.
             *
             *   The returned value is in the range -32768 to 32767.
             * @return	A 16-bit signed integer between -32768 and 32767.
             */
            ByteArrayBase.prototype.readShort = function () {
                if (!this.validate(ByteArrayBase.SIZE_OF_INT16))
                    return null;
                var value = this.data.getInt16(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_INT16;
                return value;
            };
            /**
             * Reads an unsigned byte from the byte stream.
             *
             *   The returned value is in the range 0 to 255.
             * @return	A 32-bit unsigned integer between 0 and 255.
             */
            ByteArrayBase.prototype.readUnsignedByte = function () {
                if (!this.validate(ByteArrayBase.SIZE_OF_UINT8))
                    return null;
                return this.data.getUint8(this.position++);
            };
            /**
             * Reads an unsigned 32-bit integer from the byte stream.
             *
             *   The returned value is in the range 0 to 4294967295.
             * @return	A 32-bit unsigned integer between 0 and 4294967295.
             */
            ByteArrayBase.prototype.readUnsignedInt = function () {
                if (!this.validate(ByteArrayBase.SIZE_OF_UINT32))
                    return null;
                var value = this.data.getUint32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_UINT32;
                return value;
            };
            /**
             * Reads a variable sized unsigned integer (VX -> 16-bit or 32-bit) from the byte stream.
             *
             *   A VX is written as a variable length 2- or 4-byte element. If the index value is less than 65,280 (0xFF00),
             *   then the index is written as an unsigned two-byte integer. Otherwise the index is written as an unsigned
             *   four byte integer with bits 24-31 set. When reading an index, if the first byte encountered is 255 (0xFF),
             *   then the four-byte form is being used and the first byte should be discarded or masked out.
             *
             *   The returned value is in the range  0 to 65279 or 0 to 2147483647.
             * @return	A VX 16-bit or 32-bit unsigned integer between 0 to 65279 or 0 and 2147483647.
             */
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
            /**
             * Fast read for WebGL since only Uint16 numbers are expected
             */
            ByteArrayBase.prototype.readU16VX = function () {
                return (this.readUnsignedByte() << 8) | this.readUnsignedByte();
            };
            /**
             * Reads an unsigned 64-bit integer from the byte stream.
             *
             *   The returned value is in the range 0 to 2^64 − 1.
             * @return	A 64-bit unsigned integer between 0 and 2^64 − 1
             */
            ByteArrayBase.prototype.readUnsignedInt64 = function () {
                if (!this.validate(ByteArrayBase.SIZE_OF_UINT32))
                    return null;
                var low = this.data.getUint32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_UINT32;
                var high = this.data.getUint32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_UINT32;
                return new UInt64(low, high);
            };
            /**
             * Reads an unsigned 16-bit integer from the byte stream.
             *
             *   The returned value is in the range 0 to 65535.
             * @return	A 16-bit unsigned integer between 0 and 65535.
             */
            ByteArrayBase.prototype.readUnsignedShort = function () {
                if (!this.validate(ByteArrayBase.SIZE_OF_UINT16))
                    return null;
                var value = this.data.getUint16(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_UINT16;
                return value;
            };
            /**
             * Reads a UTF-8 string from the byte stream.  The string
             * is assumed to be prefixed with an unsigned short indicating
             * the length in bytes.
             * @return	UTF-8 encoded  string.
             */
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
            /**
             * Reads a sequence of UTF-8 bytes specified by the length
             * parameter from the byte stream and returns a string.
             * @param	length	An unsigned short indicating the length of the UTF-8 bytes.
             * @return	A string composed of the UTF-8 bytes of the specified length.
             */
            ByteArrayBase.prototype.readUTFBytes = function (length) {
                if (!this.validate(length))
                    return null;
                var _bytes = new Uint8Array(this.buffer, this.bufferOffset + this.position, length);
                this.position += length;
                /*var _bytes: Uint8Array = new Uint8Array(new ArrayBuffer(length));
                for (var i = 0; i < length; i++) {
                    _bytes[i] = this.data.getUint8(this.position++);
                }*/
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
            /**
             * Writes a Boolean value. A single byte is written according to the value parameter,
             * either 1 if true or 0 if false.
             * @param	value	A Boolean value determining which byte is written. If the parameter is true,
             *   the method writes a 1; if false, the method writes a 0.
             */
            ByteArrayBase.prototype.writeBoolean = function (value) {
                this.validateBuffer(ByteArrayBase.SIZE_OF_BOOLEAN);
                this.data.setUint8(this.position++, value ? 1 : 0);
            };
            /**
             * Writes a byte to the byte stream.
             * The low 8 bits of the
             * parameter are used. The high 24 bits are ignored.
             * @param	value	A 32-bit integer. The low 8 bits are written to the byte stream.
             */
            ByteArrayBase.prototype.writeByte = function (value) {
                this.validateBuffer(ByteArrayBase.SIZE_OF_INT8);
                this.data.setInt8(this.position++, value);
            };
            ByteArrayBase.prototype.writeUnsignedByte = function (value) {
                this.validateBuffer(ByteArrayBase.SIZE_OF_UINT8);
                this.data.setUint8(this.position++, value);
            };
            /**
             * Writes a sequence of length bytes from the
             * specified byte array, bytes,
             * starting offset(zero-based index) bytes
             * into the byte stream.
             *
             *   If the length parameter is omitted, the default
             * length of 0 is used; the method writes the entire buffer starting at
             * offset.
             * If the offset parameter is also omitted, the entire buffer is
             * written. If offset or length
             * is out of range, they are clamped to the beginning and end
             * of the bytes array.
             * @param	bytes	The ByteArrayBase object.
             * @param	offset	A zero-based index indicating the _position into the array to begin writing.
             * @param	length	An unsigned integer indicating how far into the buffer to write.
             */
            ByteArrayBase.prototype.writeBytes = function (_bytes, offset, length) {
                if (offset === void 0) { offset = 0; }
                if (length === void 0) { length = 0; }
                this.validateBuffer(length);
                var tmp_data = new DataView(_bytes.buffer);
                for (var i = 0; i < _bytes.length; i++) {
                    this.data.setUint8(this.position++, tmp_data.getUint8(i));
                }
            };
            /**
             * Writes an IEEE 754 double-precision (64-bit) floating-point number to the byte stream.
             * @param	value	A double-precision (64-bit) floating-point number.
             */
            ByteArrayBase.prototype.writeDouble = function (value) {
                this.validateBuffer(ByteArrayBase.SIZE_OF_FLOAT64);
                this.data.setFloat64(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_FLOAT64;
            };
            /**
             * Writes an IEEE 754 single-precision (32-bit) floating-point number to the byte stream.
             * @param	value	A single-precision (32-bit) floating-point number.
            */
            ByteArrayBase.prototype.writeFloat = function (value) {
                this.validateBuffer(ByteArrayBase.SIZE_OF_FLOAT32);
                this.data.setFloat32(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_FLOAT32;
            };
            /**
             * Writes a 32-bit signed integer to the byte stream.
             * @param	value	An integer to write to the byte stream.
            */
            ByteArrayBase.prototype.writeInt = function (value) {
                this.validateBuffer(ByteArrayBase.SIZE_OF_INT32);
                this.data.setInt32(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_INT32;
            };
            /**
             * Writes a multibyte string to the byte stream using the specified character set.
             * @param	value	The string value to be written.
             * @param	charSet	The string denoting the character set to use. Possible character set strings
             *   include "shift-jis", "cn-gb", "iso-8859-1", and others.
             *   For a complete list, see Supported Character Sets.
             */
            ByteArrayBase.prototype.writeMultiByte = function (value, charSet) {
            };
            /**
             * Writes a 16-bit integer to the byte stream. The low 16 bits of the parameter are used.
             * The high 16 bits are ignored.
             * @param	value	32-bit integer, whose low 16 bits are written to the byte stream.
             */
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
            /**
             * Writes a 32-bit unsigned integer to the byte stream.
             * @param	value	An unsigned integer to write to the byte stream.
             */
            ByteArrayBase.prototype.writeUnsignedInt = function (value) {
                this.validateBuffer(ByteArrayBase.SIZE_OF_UINT32);
                this.data.setUint32(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_UINT32;
            };
            /**
             * Writes a UTF-8 string to the byte stream. The length of the UTF-8 string in bytes
             * is written first, as a 16-bit integer, followed by the bytes representing the
             * characters of the string.
             * @param	value	The string value to be written.
             */
            ByteArrayBase.prototype.writeUTF = function (value) {
                var utf8bytes = this.encodeUTF8(value);
                var length = utf8bytes.length;
                this.validateBuffer(ByteArrayBase.SIZE_OF_UINT16 + length);
                this.data.setUint16(this.position, length, this.endian === ByteArrayBase.LITTLE_ENDIAN);
                this.position += ByteArrayBase.SIZE_OF_UINT16;
                this.writeUint8Array(utf8bytes);
            };
            /**
             * Writes a UTF-8 string to the byte stream. Similar to the writeUTF() method,
             * but writeUTFBytes() does not prefix the string with a 16-bit length word.
             * @param	value	The string value to be written.
             */
            ByteArrayBase.prototype.writeUTFBytes = function (value) {
                this.writeUint8Array(this.encodeUTF8(value));
            };
            ByteArrayBase.prototype.toString = function () {
                return "[ByteArrayBase] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
            };
            /****************************/
            /* EXTRA JAVASCRIPT APIs    */
            /****************************/
            /**
             * Writes a Uint8Array to the byte stream.
             * @param	value	The Uint8Array to be written.
             */
            ByteArrayBase.prototype.writeUint8Array = function (_bytes) {
                this.validateBuffer(this.position + _bytes.length);
                for (var i = 0; i < _bytes.length; i++) {
                    this.data.setUint8(this.position++, _bytes[i]);
                }
            };
            /**
             * Writes a Uint16Array to the byte stream.
             * @param	value	The Uint16Array to be written.
             */
            ByteArrayBase.prototype.writeUint16Array = function (_bytes) {
                this.validateBuffer(this.position + _bytes.length);
                for (var i = 0; i < _bytes.length; i++) {
                    this.data.setUint16(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_UINT16;
                }
            };
            /**
             * Writes a Uint32Array to the byte stream.
             * @param	value	The Uint32Array to be written.
             */
            ByteArrayBase.prototype.writeUint32Array = function (_bytes) {
                this.validateBuffer(this.position + _bytes.length);
                for (var i = 0; i < _bytes.length; i++) {
                    this.data.setUint32(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_UINT32;
                }
            };
            /**
             * Writes a Int8Array to the byte stream.
             * @param	value	The Int8Array to be written.
             */
            ByteArrayBase.prototype.writeInt8Array = function (_bytes) {
                this.validateBuffer(this.position + _bytes.length);
                for (var i = 0; i < _bytes.length; i++) {
                    this.data.setInt8(this.position++, _bytes[i]);
                }
            };
            /**
             * Writes a Int16Array to the byte stream.
             * @param	value	The Int16Array to be written.
             */
            ByteArrayBase.prototype.writeInt16Array = function (_bytes) {
                this.validateBuffer(this.position + _bytes.length);
                for (var i = 0; i < _bytes.length; i++) {
                    this.data.setInt16(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_INT16;
                }
            };
            /**
             * Writes a Int32Array to the byte stream.
             * @param	value	The Int32Array to be written.
             */
            ByteArrayBase.prototype.writeInt32Array = function (_bytes) {
                this.validateBuffer(this.position + _bytes.length);
                for (var i = 0; i < _bytes.length; i++) {
                    this.data.setInt32(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_INT32;
                }
            };
            /**
             * Writes a Float32Array to the byte stream.
             * @param	value	The Float32Array to be written.
             */
            ByteArrayBase.prototype.writeFloat32Array = function (_bytes) {
                this.validateBuffer(this.position + _bytes.length);
                for (var i = 0; i < _bytes.length; i++) {
                    this.data.setFloat32(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_FLOAT32;
                }
            };
            /**
             * Writes a Float64Array to the byte stream.
             * @param	value	The Float64Array to be written.
             */
            ByteArrayBase.prototype.writeFloat64Array = function (_bytes) {
                this.validateBuffer(this.position + _bytes.length);
                for (var i = 0; i < _bytes.length; i++) {
                    this.data.setFloat64(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
                    this.position += ByteArrayBase.SIZE_OF_FLOAT64;
                }
            };
            /**
             * Read a Uint8Array from the byte stream.
             * @param	length An unsigned short indicating the length of the Uint8Array.
             */
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
            /**
             * Read a Uint16Array from the byte stream.
             * @param	length An unsigned short indicating the length of the Uint16Array.
             */
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
            /**
             * Read a Uint32Array from the byte stream.
             * @param	length An unsigned short indicating the length of the Uint32Array.
             */
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
            /**
             * Read a Int8Array from the byte stream.
             * @param	length An unsigned short indicating the length of the Int8Array.
             */
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
            /**
             * Read a Int16Array from the byte stream.
             * @param	length An unsigned short indicating the length of the Int16Array.
             */
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
            /**
             * Read a Int32Array from the byte stream.
             * @param	length An unsigned short indicating the length of the Int32Array.
             */
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
            /**
             * Read a Float32Array from the byte stream.
             * @param	length An unsigned short indicating the length of the Float32Array.
             */
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
            /**
             * Read a Float64Array from the byte stream.
             * @param	length An unsigned short indicating the length of the Float64Array.
             */
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
                //len += this.data.byteOffset;
                if (this.data.byteLength > 0 && this._position + len <= this.data.byteLength) {
                    return true;
                }
                else {
                    throw 'Error #2030: End of file was encountered.';
                }
            };
            /**********************/
            /*  PRIVATE METHODS   */
            /**********************/
            ByteArrayBase.prototype.validateBuffer = function (len) {
                this.write_position = len > this.write_position ? len : this.write_position;
                if (this.data.byteLength < len) {
                    var tmp = new Uint8Array(new ArrayBuffer(len + this.BUFFER_EXT_SIZE));
                    tmp.set(new Uint8Array(this.data.buffer));
                    this.data.buffer = tmp.buffer;
                }
            };
            /**
             * UTF-8 Encoding/Decoding
             */
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
                    //Decode string
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
                /** @type {Array.<number>} */
                var cps = [];
                // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
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
        utils.ByteArrayBase = ByteArrayBase;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        var MEMORY = (function () {
            function MEMORY() {
            }
            MEMORY.allocateUint8 = function (len) {
                MEMORY.u8 = new Uint8Array(len);
            };
            MEMORY.allocateUint16 = function (len) {
                MEMORY.u16 = new Uint16Array(len);
            };
            MEMORY.allocateUint32 = function (len) {
                MEMORY.u32 = new Uint32Array(len);
            };
            MEMORY.getUint8 = function () {
                if (!MEMORY.u8) {
                    MEMORY.allocateUint8(10);
                }
                return MEMORY.u8Index++;
            };
            MEMORY.getUint16 = function () {
                if (!MEMORY.u16) {
                    MEMORY.allocateUint16(24);
                }
                return MEMORY.u16Index++;
            };
            MEMORY.getUint32 = function () {
                if (!MEMORY.u32) {
                    MEMORY.allocateUint32(10);
                }
                return MEMORY.u32Index++;
            };
            MEMORY.u8Index = 0;
            MEMORY.u16Index = 0;
            MEMORY.u32Index = 0;
            return MEMORY;
        }());
        utils.MEMORY = MEMORY;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
///<reference path="LZMA.lib.d.ts" />
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        /**
         * LZMA Decoder
         * @author Nidin Vinayakan | nidinthb@gmail.com
         */
        var MEMORY = nid.utils.MEMORY;
        var LzmaDecoder = (function () {
            function LzmaDecoder() {
                this.posSlotDecoder = utils.BitTreeDecoder.constructArray(6, utils.LZMA.kNumLenToPosStates); //6
                this.alignDecoder = new utils.BitTreeDecoder(utils.LZMA.kNumAlignBits);
                this.posDecoders = new Uint16Array(1 + utils.LZMA.kNumFullDistances - utils.LZMA.kEndPosModelIndex);
                this.isMatch = new Uint16Array(utils.LZMA.kNumStates << utils.LZMA.kNumPosBitsMax);
                this.isRep = new Uint16Array(utils.LZMA.kNumStates);
                this.isRepG0 = new Uint16Array(utils.LZMA.kNumStates);
                this.isRepG1 = new Uint16Array(utils.LZMA.kNumStates);
                this.isRepG2 = new Uint16Array(utils.LZMA.kNumStates);
                this.isRep0Long = new Uint16Array(utils.LZMA.kNumStates << utils.LZMA.kNumPosBitsMax);
                this.lenDecoder = new utils.LenDecoder();
                this.repLenDecoder = new utils.LenDecoder();
                this.rangeDec = new utils.RangeDecoder();
                this.outWindow = new utils.OutWindow();
            }
            LzmaDecoder.prototype.init = function () {
                this.loc1 = MEMORY.getUint32() | 0;
                this.loc2 = MEMORY.getUint32() | 0;
                this.matchBitI = MEMORY.getUint16() | 0;
                this.matchByteI = MEMORY.getUint16() | 0;
                this.bitI = MEMORY.getUint16() | 0;
                this.symbolI = MEMORY.getUint16() | 0;
                this.prevByteI = MEMORY.getUint16() | 0;
                this.litStateI = MEMORY.getUint16() | 0;
                this.initLiterals();
                this.initDist();
                utils.LZMA.INIT_PROBS(this.isMatch);
                utils.LZMA.INIT_PROBS(this.isRep);
                utils.LZMA.INIT_PROBS(this.isRepG0);
                utils.LZMA.INIT_PROBS(this.isRepG1);
                utils.LZMA.INIT_PROBS(this.isRepG2);
                utils.LZMA.INIT_PROBS(this.isRep0Long);
                this.lenDecoder.init();
                this.repLenDecoder.init();
            };
            LzmaDecoder.prototype.create = function () {
                this.outWindow.create(this.dictSize);
                this.createLiterals();
            };
            //Private
            LzmaDecoder.prototype.createLiterals = function () {
                this.litProbs = new Uint16Array(0x300 << (this.lc + this.lp));
            };
            LzmaDecoder.prototype.initLiterals = function () {
                var num = 0x300 << (this.lc + this.lp); //UInt32
                for (var i = 0; i < num; i++) {
                    this.litProbs[i] = utils.LZMA.PROB_INIT_VAL;
                }
            };
            LzmaDecoder.prototype.decodeLiteral = function (state, rep0) {
                MEMORY.u16[this.prevByteI] = 0; //unsigned byte
                if (!this.outWindow.isEmpty())
                    MEMORY.u16[this.prevByteI] = this.outWindow.getByte(1);
                MEMORY.u16[this.symbolI] = 1;
                MEMORY.u16[this.litStateI] = ((this.outWindow.totalPos & ((1 << this.lp) - 1)) << this.lc) + (MEMORY.u16[this.prevByteI] >>> (8 - this.lc));
                var probsOffset = (0x300 * MEMORY.u16[this.litStateI]) | 0;
                if (state >= 7) {
                    MEMORY.u16[this.matchByteI] = this.outWindow.getByte(rep0 + 1);
                    do {
                        MEMORY.u16[this.matchBitI] = (MEMORY.u16[this.matchByteI] >>> 7) & 1;
                        MEMORY.u16[this.matchByteI] <<= 1;
                        MEMORY.u16[this.bitI] = this.rangeDec.decodeBit(this.litProbs, probsOffset + ((1 + MEMORY.u16[this.matchBitI]) << 8) + MEMORY.u16[this.symbolI]);
                        MEMORY.u16[this.symbolI] = (MEMORY.u16[this.symbolI] << 1) | MEMORY.u16[this.bitI];
                        if (MEMORY.u16[this.matchBitI] != MEMORY.u16[this.bitI])
                            break;
                    } while (MEMORY.u16[this.symbolI] < 0x100);
                }
                while (MEMORY.u16[this.symbolI] < 0x100) {
                    MEMORY.u16[this.symbolI] = (MEMORY.u16[this.symbolI] << 1) | this.rangeDec.decodeBit(this.litProbs, probsOffset + MEMORY.u16[this.symbolI]);
                }
                this.outWindow.putByte(MEMORY.u16[this.symbolI] - 0x100);
            };
            LzmaDecoder.prototype.decodeDistance = function (len) {
                var lenState = len; //unsigned byte
                if (lenState > utils.LZMA.kNumLenToPosStates - 1)
                    lenState = utils.LZMA.kNumLenToPosStates - 1;
                var posSlot = this.posSlotDecoder[lenState].decode(this.rangeDec); //unsigned byte
                if (posSlot < 4)
                    return posSlot;
                var numDirectBits = ((posSlot >>> 1) - 1); //unsigned byte
                MEMORY.u32[this.loc1] = ((2 | (posSlot & 1)) << numDirectBits); //UInt32
                if (posSlot < utils.LZMA.kEndPosModelIndex) {
                    MEMORY.u32[this.loc1] += utils.LZMA.BitTreeReverseDecode(this.posDecoders, numDirectBits, this.rangeDec, MEMORY.u32[this.loc1] - posSlot);
                }
                else {
                    MEMORY.u32[this.loc1] += this.rangeDec.decodeDirectBits(numDirectBits - utils.LZMA.kNumAlignBits) << utils.LZMA.kNumAlignBits;
                    MEMORY.u32[this.loc1] += this.alignDecoder.reverseDecode(this.rangeDec);
                }
                return MEMORY.u32[this.loc1];
            };
            LzmaDecoder.prototype.initDist = function () {
                for (var i = 0; i < utils.LZMA.kNumLenToPosStates; i++) {
                    this.posSlotDecoder[i].init();
                }
                this.alignDecoder.init();
                utils.LZMA.INIT_PROBS(this.posDecoders);
            };
            LzmaDecoder.prototype.decodeProperties = function (properties) {
                var prop = new Uint8Array(4);
                prop[0] = properties[0];
                if (prop[0] >= (9 * 5 * 5)) {
                    throw "Incorrect LZMA properties";
                }
                prop[1] = prop[0] % 9;
                prop[0] /= 9;
                prop[2] = prop[0] / 5;
                prop[3] = prop[0] % 5;
                this.lc = prop[1];
                this.pb = prop[2];
                this.lp = prop[3];
                this.dictSizeInProperties = 0;
                for (var i = 0; i < 4; i++) {
                    this.dictSizeInProperties |= properties[i + 1] << (8 * i);
                }
                this.dictSize = this.dictSizeInProperties;
                if (this.dictSize < utils.LZMA.LZMA_DIC_MIN) {
                    this.dictSize = utils.LZMA.LZMA_DIC_MIN;
                }
            };
            LzmaDecoder.prototype.updateState_Literal = function (state) {
                if (state < 4)
                    return 0;
                else if (state < 10)
                    return state - 3;
                else
                    return state - 6;
            };
            LzmaDecoder.prototype.updateState_ShortRep = function (state) { return state < 7 ? 9 : 11; };
            LzmaDecoder.prototype.updateState_Rep = function (state) { return state < 7 ? 8 : 11; };
            LzmaDecoder.prototype.updateState_Match = function (state) { return state < 7 ? 7 : 10; };
            LzmaDecoder.prototype.decode = function (unpackSizeDefined, unpackSize) {
                this.init();
                this.rangeDec.init();
                if (unpackSizeDefined) {
                    this.outWindow.outStream = new Uint8Array(new ArrayBuffer(unpackSize));
                }
                var rep0 = 0, rep1 = 0, rep2 = 0, rep3 = 0; //UInt32
                var state = 0; //unsigned byte
                for (;;) {
                    if (unpackSizeDefined && unpackSize == 0 && !this.markerIsMandatory) {
                        if (this.rangeDec.isFinishedOK()) {
                            return utils.LZMA.LZMA_RES_FINISHED_WITHOUT_MARKER;
                        }
                    }
                    var posState = this.outWindow.totalPos & ((1 << this.pb) - 1);
                    if (this.rangeDec.decodeBit(this.isMatch, (state << utils.LZMA.kNumPosBitsMax) + posState) == 0) {
                        if (unpackSizeDefined && unpackSize == 0) {
                            return utils.LZMA.LZMA_RES_ERROR;
                        }
                        this.decodeLiteral(state, rep0);
                        state = this.updateState_Literal(state);
                        unpackSize--;
                        continue;
                    }
                    var len;
                    if (this.rangeDec.decodeBit(this.isRep, state) != 0) {
                        if (unpackSizeDefined && unpackSize == 0) {
                            return utils.LZMA.LZMA_RES_ERROR;
                        }
                        if (this.outWindow.isEmpty()) {
                            return utils.LZMA.LZMA_RES_ERROR;
                        }
                        if (this.rangeDec.decodeBit(this.isRepG0, state) == 0) {
                            if (this.rangeDec.decodeBit(this.isRep0Long, (state << utils.LZMA.kNumPosBitsMax) + posState) == 0) {
                                state = this.updateState_ShortRep(state);
                                this.outWindow.putByte(this.outWindow.getByte(rep0 + 1));
                                unpackSize--;
                                continue;
                            }
                        }
                        else {
                            var dist;
                            if (this.rangeDec.decodeBit(this.isRepG1, state) == 0) {
                                dist = rep1;
                            }
                            else {
                                if (this.rangeDec.decodeBit(this.isRepG2, state) == 0) {
                                    dist = rep2;
                                }
                                else {
                                    dist = rep3;
                                    rep3 = rep2;
                                }
                                rep2 = rep1;
                            }
                            rep1 = rep0;
                            rep0 = dist;
                        }
                        len = this.repLenDecoder.decode(this.rangeDec, posState);
                        state = this.updateState_Rep(state);
                    }
                    else {
                        rep3 = rep2;
                        rep2 = rep1;
                        rep1 = rep0;
                        len = this.lenDecoder.decode(this.rangeDec, posState);
                        state = this.updateState_Match(state);
                        rep0 = this.decodeDistance(len);
                        if (rep0 == 0xFFFFFFFF) {
                            return this.rangeDec.isFinishedOK() ?
                                utils.LZMA.LZMA_RES_FINISHED_WITH_MARKER :
                                utils.LZMA.LZMA_RES_ERROR;
                        }
                        if (unpackSizeDefined && unpackSize == 0) {
                            return utils.LZMA.LZMA_RES_ERROR;
                        }
                        if (rep0 >= this.dictSize || !this.outWindow.checkDistance(rep0)) {
                            return utils.LZMA.LZMA_RES_ERROR;
                        }
                    }
                    len += utils.LZMA.kMatchMinLen;
                    var isError = false;
                    if (unpackSizeDefined && unpackSize < len) {
                        len = unpackSize;
                        isError = true;
                    }
                    this.outWindow.copyMatch(rep0 + 1, len);
                    unpackSize -= len;
                    if (isError) {
                        return utils.LZMA.LZMA_RES_ERROR;
                    }
                }
            };
            return LzmaDecoder;
        }());
        utils.LzmaDecoder = LzmaDecoder;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        /**
         * LZMA Decoder
         * @author Nidin Vinayakan | nidinthb@gmail.com
         */
        var OutWindow = (function () {
            function OutWindow() {
                this.out_pos = 0;
            }
            OutWindow.prototype.create = function (dictSize) {
                this.buf = new Uint8Array(dictSize);
                this.pos = 0;
                this.size = dictSize;
                this.isFull = false;
                this.totalPos = 0;
            };
            OutWindow.prototype.putByte = function (b) {
                this.totalPos++;
                this.buf[this.pos++] = b;
                if (this.pos == this.size) {
                    this.pos = 0;
                    this.isFull = true;
                }
                //this.outStream.writeUnsignedByte(b);
                this.outStream[this.out_pos++] = b;
            };
            OutWindow.prototype.getByte = function (dist) {
                return this.buf[dist <= this.pos ? this.pos - dist : this.size - dist + this.pos];
            };
            OutWindow.prototype.copyMatch = function (dist, len) {
                for (; len > 0; len--) {
                    this.putByte(this.getByte(dist));
                }
            };
            OutWindow.prototype.checkDistance = function (dist) {
                return dist <= this.pos || this.isFull;
            };
            OutWindow.prototype.isEmpty = function () {
                return this.pos == 0 && !this.isFull;
            };
            return OutWindow;
        }());
        utils.OutWindow = OutWindow;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
///<reference path="LZMA.lib.d.ts" />
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        var RangeDecoder = (function () {
            function RangeDecoder() {
                this.rangeI = 0;
                this.codeI = 1;
                this.loc1 = 2;
                this.loc2 = 3;
                this.in_pos = 13;
            }
            RangeDecoder.prototype.isFinishedOK = function () {
                return this.U32[this.codeI] == 0;
            };
            RangeDecoder.prototype.init = function () {
                this.U32 = new Uint32Array(4);
                this.U16 = new Uint16Array(4);
                this.corrupted = false;
                if (this.inStream[this.in_pos++] != 0) {
                    this.corrupted = true;
                }
                this.U32[this.rangeI] = 0xFFFFFFFF;
                this.U32[this.codeI] = 0;
                for (var i = 0; i < 4; i++) {
                    this.U32[this.codeI] = (this.U32[this.codeI] << 8) | this.inStream[this.in_pos++];
                }
                if (this.U32[this.codeI] == this.U32[this.rangeI]) {
                    this.corrupted = true;
                }
            };
            RangeDecoder.prototype.normalize = function () {
                if (this.U32[this.rangeI] < RangeDecoder.kTopValue) {
                    this.U32[this.rangeI] <<= 8;
                    this.U32[this.codeI] = (this.U32[this.codeI] << 8) | this.inStream[this.in_pos++];
                }
            };
            RangeDecoder.prototype.decodeDirectBits = function (numBits) {
                this.U32[this.loc1] = 0; //UInt32
                do {
                    this.U32[this.rangeI] >>>= 1;
                    this.U32[this.codeI] -= this.U32[this.rangeI];
                    this.U32[this.loc2] = 0 - (this.U32[this.codeI] >>> 31);
                    this.U32[this.codeI] += this.U32[this.rangeI] & this.U32[this.loc2];
                    if (this.U32[this.codeI] == this.U32[this.rangeI]) {
                        this.corrupted = true;
                    }
                    this.normalize();
                    this.U32[this.loc1] <<= 1;
                    this.U32[this.loc1] += this.U32[this.loc2] + 1;
                } while (--numBits);
                return this.U32[this.loc1];
            };
            RangeDecoder.prototype.decodeBit = function (prob, index) {
                this.U16[0] = prob[index];
                //bound
                this.U32[2] = (this.U32[0] >>> 11) * this.U16[0];
                //var symbol:number;
                if (this.U32[1] < this.U32[2]) {
                    this.U16[0] += ((1 << 11) - this.U16[0]) >>> 5;
                    this.U32[0] = this.U32[2];
                    this.U16[1] = 0;
                }
                else {
                    //v -= v >>> LZMA.kNumMoveBits;
                    this.U16[0] -= this.U16[0] >>> 5;
                    this.U32[1] -= this.U32[2];
                    this.U32[0] -= this.U32[2];
                    this.U16[1] = 1;
                }
                prob[index] = this.U16[0];
                //this.normalize();
                if (this.U32[0] < 16777216) {
                    this.U32[0] <<= 8;
                    this.U32[1] = (this.U32[1] << 8) | this.inStream[this.in_pos++];
                }
                return this.U16[1];
            };
            RangeDecoder.kTopValue = (1 << 24);
            return RangeDecoder;
        }());
        utils.RangeDecoder = RangeDecoder;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
///<reference path="LZMA.lib.d.ts" />
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        /**
         * LZMA Decoder
         * @author Nidin Vinayakan | nidinthb@gmail.com
         */
        var BitTreeDecoder = (function () {
            function BitTreeDecoder(numBits) {
                this.numBits = numBits;
                this.probs = new Uint16Array(1 << this.numBits);
            }
            BitTreeDecoder.prototype.init = function () {
                utils.LZMA.INIT_PROBS(this.probs);
            };
            BitTreeDecoder.prototype.decode = function (rc) {
                var m = 1; //Uint16
                for (var i = 0; i < this.numBits; i++)
                    m = (m << 1) + rc.decodeBit(this.probs, m);
                return m - (1 << this.numBits);
            };
            BitTreeDecoder.prototype.reverseDecode = function (rc) {
                return utils.LZMA.BitTreeReverseDecode(this.probs, this.numBits, rc);
            };
            BitTreeDecoder.constructArray = function (numBits, len) {
                var vec = [];
                for (var i = 0; i < len; i++) {
                    vec[i] = new BitTreeDecoder(numBits);
                }
                return vec;
            };
            return BitTreeDecoder;
        }());
        utils.BitTreeDecoder = BitTreeDecoder;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
///<reference path="LZMA.lib.d.ts" />
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        /**
         * LZMA Decoder
         * @author Nidin Vinayakan | nidinthb@gmail.com
         */
        var LenDecoder = (function () {
            function LenDecoder() {
                this.lowCoder = utils.BitTreeDecoder.constructArray(3, 1 << utils.LZMA.kNumPosBitsMax);
                this.midCoder = utils.BitTreeDecoder.constructArray(3, 1 << utils.LZMA.kNumPosBitsMax);
                this.highCoder = new utils.BitTreeDecoder(8);
            }
            LenDecoder.prototype.init = function () {
                this.choice = [utils.LZMA.PROB_INIT_VAL, utils.LZMA.PROB_INIT_VAL];
                this.highCoder.init();
                for (var i = 0; i < (1 << utils.LZMA.kNumPosBitsMax); i++) {
                    this.lowCoder[i].init();
                    this.midCoder[i].init();
                }
            };
            LenDecoder.prototype.decode = function (rc, posState) {
                if (rc.decodeBit(this.choice, 0) == 0) {
                    return this.lowCoder[posState].decode(rc);
                }
                if (rc.decodeBit(this.choice, 1) == 0) {
                    return 8 + this.midCoder[posState].decode(rc);
                }
                return 16 + this.highCoder.decode(rc);
            };
            return LenDecoder;
        }());
        utils.LenDecoder = LenDecoder;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
///<reference path="LZMA.lib.d.ts" />
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        "use strict";
        /**
         * LZMA Decoder
         * @author Nidin Vinayakan | nidinthb@gmail.com
         *
         */
        var LZMA = (function () {
            function LZMA() {
                this.decoder = new utils.LzmaDecoder();
            }
            LZMA.INIT_PROBS = function (p) {
                for (var i = 0; i < p.length; i++) {
                    p[i] = this.PROB_INIT_VAL;
                }
            };
            LZMA.BitTreeReverseDecode = function (probs, numBits, rc, offset) {
                if (offset === void 0) { offset = 0; }
                var m = 1;
                var symbol = 0;
                for (var i = 0; i < numBits; i++) {
                    var bit = rc.decodeBit(probs, offset + m);
                    m <<= 1;
                    m += bit;
                    symbol |= (bit << i);
                }
                return symbol;
            };
            LZMA.prototype.decode = function (data) {
                this.data = data;
                //var header:Uint8Array = data.readUint8Array(13);
                var header = new Uint8Array(13);
                var i; //int
                for (i = 0; i < 13; i++) {
                    header[i] = data[i];
                }
                this.decoder.decodeProperties(header);
                console.log("\nlc=" + this.decoder.lc + ", lp=" + this.decoder.lp + ", pb=" + this.decoder.pb);
                console.log("\nDictionary Size in properties = " + this.decoder.dictSizeInProperties);
                console.log("\nDictionary Size for decoding  = " + this.decoder.dictSize);
                //return this.ucdata;
                var unpackSize = 0; //UInt64
                var unpackSizeDefined = false;
                for (i = 0; i < 8; i++) {
                    var b = header[5 + i];
                    if (b != 0xFF) {
                        unpackSizeDefined = true;
                    }
                    unpackSize |= b << (8 * i);
                }
                this.decoder.markerIsMandatory = !unpackSizeDefined;
                console.log("\n");
                if (unpackSizeDefined) {
                    console.log("Uncompressed Size : " + unpackSize + " bytes");
                }
                else {
                    console.log("End marker is expected\n");
                }
                this.decoder.rangeDec.inStream = data;
                console.log("\n");
                this.decoder.create();
                // we support the streams that have uncompressed size and marker.
                var res = this.decoder.decode(unpackSizeDefined, unpackSize); //int
                console.log("Read    ", this.decoder.rangeDec.in_pos);
                console.log("Written ", this.decoder.outWindow.out_pos);
                if (res == LZMA.LZMA_RES_ERROR) {
                    throw "LZMA decoding error";
                }
                else if (res == LZMA.LZMA_RES_FINISHED_WITHOUT_MARKER) {
                    console.log("Finished without end marker");
                }
                else if (res == LZMA.LZMA_RES_FINISHED_WITH_MARKER) {
                    if (unpackSizeDefined) {
                        if (this.decoder.outWindow.out_pos != unpackSize) {
                            throw "Finished with end marker before than specified size";
                        }
                        console.log("Warning: ");
                    }
                    console.log("Finished with end marker");
                }
                else {
                    throw "Internal Error";
                }
                console.log("\n");
                if (this.decoder.rangeDec.corrupted) {
                    console.log("\nWarning: LZMA stream is corrupted\n");
                }
                return this.decoder.outWindow.outStream;
            };
            LZMA.LZMA_DIC_MIN = (1 << 12);
            LZMA.LZMA_RES_ERROR = 0;
            LZMA.LZMA_RES_FINISHED_WITH_MARKER = 1;
            LZMA.LZMA_RES_FINISHED_WITHOUT_MARKER = 2;
            LZMA.kNumBitModelTotalBits = 11;
            LZMA.kNumMoveBits = 5;
            LZMA.PROB_INIT_VAL = ((1 << LZMA.kNumBitModelTotalBits) / 2); //1024
            LZMA.kNumPosBitsMax = 4;
            LZMA.kNumStates = 12;
            LZMA.kNumLenToPosStates = 4;
            LZMA.kNumAlignBits = 4;
            LZMA.kStartPosModelIndex = 4;
            LZMA.kEndPosModelIndex = 14;
            LZMA.kNumFullDistances = (1 << (LZMA.kEndPosModelIndex >>> 1));
            LZMA.kMatchMinLen = 2;
            return LZMA;
        }());
        utils.LZMA = LZMA;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
///<reference path="lzma/LZMA.ts" />
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        var LZMAHelper = (function () {
            function LZMAHelper() {
            }
            LZMAHelper.init = function () {
                var command = 0;
                if (LZMAHelper.enableAsync) {
                    LZMAHelper.decoderAsync = new Worker('LZMAWorker.min.js');
                    LZMAHelper.decoderAsync.onmessage = function (e) {
                        if (command == 0) {
                            command = e.data;
                        }
                        else if (command == LZMAHelper.ENCODE) {
                            command = 0; //encode not implemented
                        }
                        else if (command == LZMAHelper.DECODE) {
                            command = 0;
                            LZMAHelper.callback(e.data);
                            LZMAHelper.callback = null;
                        }
                    };
                }
            };
            /**
             * TODO : Implement encoder
             * @param data
             * @returns {null}
             */
            LZMAHelper.encode = function (data) {
                return null;
            };
            LZMAHelper.decodeBuffer = function (data) {
                return LZMAHelper.decoder.decode(new Uint8Array(data)).buffer;
            };
            LZMAHelper.decode = function (data) {
                return LZMAHelper.decoder.decode(data);
            };
            /**
             * TODO : Implement encoder
             * @param data
             * @param _callback
             */
            LZMAHelper.encodeAsync = function (data, _callback) {
                if (LZMAHelper.enableAsync) {
                }
                else {
                    console.log('Error! Asynchronous encoding is disabled');
                }
            };
            LZMAHelper.decodeAsync = function (data, _callback) {
                if (LZMAHelper.enableAsync) {
                    if (LZMAHelper.callback == null) {
                        LZMAHelper.callback = _callback;
                        LZMAHelper.decoderAsync.postMessage(LZMAHelper.DECODE);
                        LZMAHelper.decoderAsync.postMessage(data, [data]);
                    }
                    else {
                        console.log('Warning! Another LZMA decoding is running...');
                    }
                }
                else {
                    console.log('Error! Asynchronous decoding is disabled');
                }
            };
            LZMAHelper.decoder = new utils.LZMA();
            LZMAHelper.enableAsync = false;
            LZMAHelper.ENCODE = 1;
            LZMAHelper.DECODE = 2;
            return LZMAHelper;
        }());
        utils.LZMAHelper = LZMAHelper;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
nid.utils.LZMAHelper.init();
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        /**
         * JavaScript ByteArray
         * version : 0.2
         * @author Nidin Vinayakan | nidinthb@gmail.com
         */
        var CompressionAlgorithm = (function () {
            function CompressionAlgorithm() {
            }
            CompressionAlgorithm.DEFLATE = "deflate";
            CompressionAlgorithm.LZMA = "lzma";
            CompressionAlgorithm.ZLIB = "zlib";
            return CompressionAlgorithm;
        }());
        utils.CompressionAlgorithm = CompressionAlgorithm;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
///<reference path="./ByteArrayBase.ts" />
///<reference path="./LZMAHelper.ts" />
/*///<reference path="./ZLIBHelper.ts" />*/
///<reference path="./CompressionAlgorithm.ts" />
/**
* JavaScript ByteArray
* version : 0.2
* @author Nidin Vinayakan | nidinthb@gmail.com
*
* ActionScript3 ByteArray implementation in JavaScript
* limitation : size of ByteArray cannot be changed
*
*/
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        var ByteArray = (function (_super) {
            __extends(ByteArray, _super);
            function ByteArray(buffer, offset, length) {
                if (offset === void 0) { offset = 0; }
                if (length === void 0) { length = 0; }
                _super.call(this, buffer, offset, length);
            }
            ByteArray.prototype.compress = function (algorithm) {
                if (algorithm === void 0) { algorithm = utils.CompressionAlgorithm.LZMA; }
                throw "Compression error! " + algorithm + " not implemented";
                if (algorithm == utils.CompressionAlgorithm.LZMA) {
                }
                else {
                    throw "Compression error! " + algorithm + " not implemented";
                }
            };
            ByteArray.prototype.decompressBuffer = function (algorithm) {
                if (algorithm === void 0) { algorithm = utils.CompressionAlgorithm.LZMA; }
                if (algorithm == utils.CompressionAlgorithm.LZMA) {
                    try {
                        this.buffer = utils.LZMAHelper.decodeBuffer(this.buffer);
                    }
                    catch (e) {
                        throw "Uncompression error! " + algorithm + " not implemented";
                    }
                }
                else if (algorithm == utils.CompressionAlgorithm.ZLIB) {
                }
                else {
                    throw "Uncompression error! " + algorithm + " not implemented";
                }
            };
            ByteArray.prototype.decompress = function (algorithm) {
                if (algorithm === void 0) { algorithm = utils.CompressionAlgorithm.LZMA; }
                if (algorithm == utils.CompressionAlgorithm.LZMA) {
                    try {
                        this.array = utils.LZMAHelper.decode(this.array);
                    }
                    catch (e) {
                        throw "Uncompression error! " + algorithm + " not implemented";
                    }
                }
                else if (algorithm == utils.CompressionAlgorithm.ZLIB) {
                }
                else {
                    throw "Uncompression error! " + algorithm + " not implemented";
                }
            };
            ByteArray.prototype.compressAsync = function (algorithm, callback) {
                throw "Compression error! " + algorithm + " not implemented";
                if (algorithm == utils.CompressionAlgorithm.LZMA) {
                }
                else {
                    throw "Compression error! " + algorithm + " not implemented";
                }
            };
            ByteArray.prototype.decompressAsync = function (algorithm, callback) {
                if (algorithm === void 0) { algorithm = utils.CompressionAlgorithm.LZMA; }
                if (callback === void 0) { callback = null; }
                if (algorithm == utils.CompressionAlgorithm.LZMA) {
                    utils.LZMAHelper.decodeAsync(this.buffer, function (_data) {
                        this.buffer = _data;
                    });
                }
                else {
                    throw "Uncompression error! " + algorithm + " not implemented";
                }
            };
            ByteArray.prototype.deflate = function () { };
            ByteArray.prototype.inflate = function () { };
            /**
             * Reads the number of data bytes, specified by the length parameter, from the byte stream.
             * The bytes are read into the ByteArray object specified by the bytes parameter,
             * and the bytes are written into the destination ByteArrayBase starting at the _position specified by offset.
             * @param	bytes	The ByteArray object to read data into.
             * @param	offset	The offset (_position) in bytes at which the read data should be written.
             * @param	length	The number of bytes to read.  The default value of 0 causes all available data to be read.
             */
            ByteArray.prototype.readBytesAsByteArray = function (_bytes, offset, length, createNewBuffer) {
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
                    _bytes = _bytes == null ? new ByteArray(new ArrayBuffer(length)) : _bytes;
                    //This method is expensive
                    for (var i = 0; i < length; i++) {
                        _bytes.data.setUint8(i + offset, this.data.getUint8(this.position++));
                    }
                }
                else {
                    //Offset argument ignored
                    _bytes = _bytes == null ? new ByteArray(null) : _bytes;
                    _bytes.dataView = new DataView(this.data.buffer, this.bufferOffset + this.position, length);
                    this.position += length;
                }
                return _bytes;
            };
            /**
             * Reads an object from the byte array, encoded in AMF
             * serialized format.
             * @return	The deserialized object.
             */
            ByteArray.prototype.readObject = function () {
                //return this.readAmfObject();
                return null;
            };
            /**
             * Writes an object into the byte array in AMF
             * serialized format.
             * @param	object	The object to serialize.
             */
            ByteArray.prototype.writeObject = function (value) {
            };
            ByteArray.BIG_ENDIAN = "bigEndian";
            ByteArray.LITTLE_ENDIAN = "littleEndian";
            return ByteArray;
        }(utils.ByteArrayBase));
        utils.ByteArray = ByteArray;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
///<reference path="ByteArrayBase.ts" />
/**
 * JavaScript BitArray
 * version : 0.2
 * @author Nidin Vinayakan | nidinthb@gmail.com
 *
 * Utility to read bits from ByteArray
 *
 */
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        var BitArray = (function (_super) {
            __extends(BitArray, _super);
            function BitArray(buffer) {
                _super.call(this, buffer);
                this.bitsPending = 0;
            }
            BitArray.prototype.readBits = function (bits, bitBuffer) {
                if (bitBuffer === void 0) { bitBuffer = 0; }
                if (bits == 0) {
                    return bitBuffer;
                }
                var partial;
                var bitsConsumed;
                if (this.bitsPending > 0) {
                    var _byte = this[this.position - 1] & (0xff >> (8 - this.bitsPending));
                    bitsConsumed = Math.min(this.bitsPending, bits);
                    this.bitsPending -= bitsConsumed;
                    partial = _byte >> this.bitsPending;
                }
                else {
                    bitsConsumed = Math.min(8, bits);
                    this.bitsPending = 8 - bitsConsumed;
                    partial = this.readUnsignedByte() >> this.bitsPending;
                }
                bits -= bitsConsumed;
                bitBuffer = (bitBuffer << bitsConsumed) | partial;
                return (bits > 0) ? this.readBits(bits, bitBuffer) : bitBuffer;
            };
            BitArray.prototype.writeBits = function (bits, value) {
                if (bits == 0) {
                    return;
                }
                value &= (0xffffffff >>> (32 - bits));
                var bitsConsumed;
                if (this.bitsPending > 0) {
                    if (this.bitsPending > bits) {
                        this[this.position - 1] |= value << (this.bitsPending - bits);
                        bitsConsumed = bits;
                        this.bitsPending -= bits;
                    }
                    else if (this.bitsPending == bits) {
                        this[this.position - 1] |= value;
                        bitsConsumed = bits;
                        this.bitsPending = 0;
                    }
                    else {
                        this[this.position - 1] |= value >> (bits - this.bitsPending);
                        bitsConsumed = this.bitsPending;
                        this.bitsPending = 0;
                    }
                }
                else {
                    bitsConsumed = Math.min(8, bits);
                    this.bitsPending = 8 - bitsConsumed;
                    this.writeByte((value >> (bits - bitsConsumed)) << this.bitsPending);
                }
                bits -= bitsConsumed;
                if (bits > 0) {
                    this.writeBits(bits, value);
                }
            };
            BitArray.prototype.resetBitsPending = function () {
                this.bitsPending = 0;
            };
            BitArray.prototype.calculateMaxBits = function (signed, values) {
                var b = 0;
                var vmax = -2147483648; //int.MIN_VALUE;
                if (!signed) {
                    for (var usvalue in values) {
                        b |= usvalue;
                    }
                }
                else {
                    for (var svalue in values) {
                        if (svalue >= 0) {
                            b |= svalue;
                        }
                        else {
                            b |= ~svalue << 1;
                        }
                        if (vmax < svalue) {
                            vmax = svalue;
                        }
                    }
                }
                var bits = 0;
                if (b > 0) {
                    bits = b.toString(2).length;
                    if (signed && vmax > 0 && vmax.toString(2).length >= bits) {
                        bits++;
                    }
                }
                return bits;
            };
            return BitArray;
        }(utils.ByteArrayBase));
        utils.BitArray = BitArray;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
/******************************************************************************
 * This file contains code licensed for use under the BSD license, and was
 * modified from the original  C source by James Tursa as provided at the
 * MatLab Central site here:
 *
 *   http://www.mathworks.com/matlabcentral/fileexchange/23173
 *
 * It has been modified to compile under ActionScript 3 for handling the
 * FLOAT16 data format used in Adobe's SWF file format, which is the same
 * as the IEEE 754r Half Precision format implemented by Mr. Tursa in the
 * original source.
 *
 * The original license follows:
 *
 * Copyright (c) 2009, James Tursa
 * All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are
 *  met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the distribution
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 *  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 *  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 *  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 *  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 *  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 */
///<reference path="BitArray.ts" />
var nid;
(function (nid) {
    var utils;
    (function (utils) {
        var HalfPrecisionWriter = (function () {
            function HalfPrecisionWriter() {
            }
            HalfPrecisionWriter.write = function (value, data) {
                data.resetBitsPending();
                var dword;
                var sign;
                var exponent;
                var significand;
                var halfSignificand;
                var signedExponent;
                var result;
                var p;
                p = data.position;
                data.writeDouble(value);
                data.position -= 4;
                dword = data.readUnsignedInt();
                data.position = p;
                if ((dword & 0x7FFFFFFF) == 0) {
                    result = dword >> 16;
                }
                else {
                    sign = dword & 0x80000000;
                    exponent = dword & 0x7FF00000;
                    significand = dword & 0x000FFFFF;
                    if (exponent == 0) {
                        result = sign >> 16;
                    }
                    else if (exponent == 0x7FF00000) {
                        if (significand == 0) {
                            result = ((sign >> 16) | 0x7C00); // Signed infinity
                        }
                        else {
                            result = 0xFE00; // NaN, only 1st mantissa bit is set
                        }
                    }
                    else {
                        sign = sign >> 16;
                        signedExponent = (exponent >> 20) - 1023 + 15; // Reset the bias to half-precision
                        if (signedExponent >= 0x1F) {
                            result = ((significand >> 16) | 0x7C00); // Signed infinity
                        }
                        else if (signedExponent <= 0) {
                            if ((10 - signedExponent) > 21) {
                                halfSignificand = 0;
                            }
                            else {
                                significand |= 0x00100000; // Add leading bit
                                halfSignificand = (significand >> (11 - signedExponent));
                                if ((significand >> (10 - signedExponent)) & 0x00000001) {
                                    halfSignificand += 1; // Round, might overflow into exponent (okay)
                                }
                            }
                            result = (sign | halfSignificand);
                        }
                        else {
                            exponent = signedExponent << 10;
                            halfSignificand = significand >> 10;
                            if (significand & 0x00000200) {
                                result = (sign | exponent | halfSignificand) + 1; // Round, may overflow to infinity (okay)
                            }
                            else {
                                result = (sign | exponent | halfSignificand);
                            }
                        }
                    }
                }
                data.writeShort(result);
                data.length = p + 2;
            };
            return HalfPrecisionWriter;
        }());
        utils.HalfPrecisionWriter = HalfPrecisionWriter;
    })(utils = nid.utils || (nid.utils = {}));
})(nid || (nid = {}));
//////////////////////////////////////
//    EXTERNAL DEPENDENCY
/////////////////////////////////////
///<reference path="../../TS-ByteArray/src/ByteArrayBase.ts" />
///<reference path="../../TS-ByteArray/src/ByteArray.ts" />
///<reference path="../../TS-ByteArray/src/BitArray.ts" />
///<reference path="../../TS-ByteArray/src/HalfPrecisionWriter.ts" />
var ByteArrayBase = nid.utils.ByteArrayBase;
/**
 * Created by Nidin Vinayakan on 01-03-2016.
 */
var rtt;
(function (rtt) {
    var glTFLoader = (function () {
        function glTFLoader() {
        }
        glTFLoader.prototype.load = function (url, callback, parameters, _callbackProgress) {
            parameters = parameters || {};
            var scope = this;
            var xhr = new XMLHttpRequest();
            var callbackProgress = _callbackProgress;
            var length = 0;
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200 || xhr.status === 0) {
                        var binaryData = xhr.response;
                        callback(scope.parse(binaryData, parameters));
                    }
                    else {
                        console.error("Couldn't load [" + url + "] [" + xhr.status + "]");
                    }
                }
                else if (xhr.readyState === 3) {
                    if (callbackProgress) {
                        if (length === 0) {
                            length = parseInt(xhr.getResponseHeader("Content-Length"));
                        }
                        callbackProgress({ total: length, loaded: xhr.responseText.length });
                    }
                }
                else if (xhr.readyState === 2) {
                    length = parseInt(xhr.getResponseHeader("Content-Length"));
                }
            };
            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
        };
        glTFLoader.prototype.parse = function (dataBuffer, spec) {
            var geometryList = [];
            var data = new ByteArrayBase(dataBuffer);
            var geometryLength = data.readUnsignedInt();
            var geometry;
            console.log("geometryLength:" + geometryLength);
            for (var i = 0; i < geometryLength; i++) {
                geometry = this.parseGeometry(data);
                console.log("geometry:" + geometry);
                if (geometry) {
                    geometryList.push(geometry);
                }
            }
            var hierarchyStrLen = data.readUnsignedInt();
            var hierarchyStr = data.readUTFBytes(hierarchyStrLen);
            var hierarchy = JSON.parse(hierarchyStr);
            return {
                hierarchy: hierarchy,
                geometryList: geometryList
            };
        };
        glTFLoader.prototype.parseGeometry = function (data) {
            var length = data.readUnsignedInt();
            var positions = data.readFloat32Array(length, true);
            length = data.readUnsignedInt();
            var indices = data.readInt32Array(length, true);
            length = data.readUnsignedInt();
            var normals = data.readFloat32Array(length, true);
            length = data.readUnsignedInt();
            if (length > 0) {
                var texCoords = data.readFloat32Array(length, true);
            }
            return {
                positions: positions,
                indices: indices,
                normals: normals,
                texCoords: texCoords
            };
        };
        return glTFLoader;
    }());
    rtt.glTFLoader = glTFLoader;
})(rtt || (rtt = {}));
//# sourceMappingURL=glTFLoader.js.map