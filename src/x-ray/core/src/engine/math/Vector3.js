System.register(["../../pointer/src/DirectMemory"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DirectMemory_1;
    var Vector3;
    return {
        setters:[
            function (DirectMemory_1_1) {
                DirectMemory_1 = DirectMemory_1_1;
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
                    this.data = new Float32Array(4);
                    this.update();
                }
                Vector3.prototype.update = function () {
                    this.data[0] = this.x;
                    this.data[1] = this.y;
                    this.data[2] = this.z;
                };
                Vector3.prototype.sync = function () {
                    this.x = this.data[0];
                    this.y = this.data[1];
                    this.z = this.data[2];
                };
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
                    this.update();
                };
                Vector3.prototype.setFromJson = function (a) {
                    this.x = a.x;
                    this.y = a.y;
                    this.z = a.z;
                    this.update();
                };
                Vector3.prototype.length = function () {
                    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
                };
                Vector3.prototype.dot = function (b) {
                    return this.x * b.x + this.y * b.y + this.z * b.z;
                };
                Vector3.prototype.SIMD_dot = function (_b) {
                    var _a = SIMD.Float32x4.load(this.data, 0);
                    return Vector3.SIMD.dot(_a, _b);
                };
                Vector3.prototype.cross = function (b) {
                    var x = this.y * b.z - this.z * b.y;
                    var y = this.z * b.x - this.x * b.z;
                    var z = this.x * b.y - this.y * b.x;
                    return new Vector3(x, y, z);
                };
                Vector3.prototype.SIMD_cross = function (_b) {
                    this.update();
                    var _a = SIMD.Float32x4.load(this.data, 0);
                    return Vector3.SIMD.cross(_a, _b);
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
                Vector3.prototype.SIMD_sub = function (_b) {
                    var _a = SIMD.Float32x4.load(this.data, 0);
                    return SIMD.Float32x4.sub(_a, _b);
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
                    return this.x == DirectMemory_1.DirectMemory.MIN_FLOAT32_VALUE &&
                        this.y == DirectMemory_1.DirectMemory.MIN_FLOAT32_VALUE &&
                        this.z == DirectMemory_1.DirectMemory.MIN_FLOAT32_VALUE;
                };
                Vector3.SIZE = 3;
                Vector3.NullVector = new Vector3(DirectMemory_1.DirectMemory.MIN_FLOAT32_VALUE, DirectMemory_1.DirectMemory.MIN_FLOAT32_VALUE, DirectMemory_1.DirectMemory.MIN_FLOAT32_VALUE);
                Vector3.SIMD = {
                    dot: function (a, b) {
                        var lvMult = SIMD.Float32x4.mul(a, b);
                        var lvTemp = SIMD.Float32x4.shuffle(lvMult, lvMult, 1, 0, 0, 0);
                        var lvTemp2 = SIMD.Float32x4.shuffle(lvMult, lvMult, 2, 0, 0, 0);
                        var lvSum = SIMD.Float32x4.add(lvMult, SIMD.Float32x4.add(lvTemp, lvTemp2));
                        return SIMD.Float32x4.extractLane(SIMD.Float32x4.shuffle(lvSum, lvSum, 0, 0, 0, 0), 0);
                    },
                    cross: function (a, b) {
                        var lvTemp1 = SIMD.Float32x4.shuffle(a, a, 1, 2, 0, 0);
                        var lvTemp2 = SIMD.Float32x4.shuffle(b, b, 2, 0, 1, 0);
                        var lvMult = SIMD.Float32x4.mul(lvTemp1, lvTemp2);
                        lvTemp1 = SIMD.Float32x4.shuffle(a, a, 2, 0, 1, 0);
                        lvTemp2 = SIMD.Float32x4.shuffle(b, b, 1, 2, 0, 0);
                        var lvMult2 = SIMD.Float32x4.mul(lvTemp1, lvTemp2);
                        return SIMD.Float32x4.sub(lvMult, lvMult2);
                    }
                };
                return Vector3;
            }());
            exports_1("Vector3", Vector3);
        }
    }
});
//# sourceMappingURL=Vector3.js.map