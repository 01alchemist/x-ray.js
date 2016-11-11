System.register(["./Vector3", "../scene/shapes/Box", "./Ray"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Vector3_1, Box_1, Ray_1;
    var TMatrix4;
    return {
        setters:[
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            },
            function (Box_1_1) {
                Box_1 = Box_1_1;
            },
            function (Ray_1_1) {
                Ray_1 = Ray_1_1;
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
                    return new Vector3_1.Vector3(x, y, z);
                };
                TMatrix4.prototype.mulDirection = function (b) {
                    var a = this;
                    var x = a.x00 * b.x + a.x01 * b.y + a.x02 * b.z;
                    var y = a.x10 * b.x + a.x11 * b.y + a.x12 * b.z;
                    var z = a.x20 * b.x + a.x21 * b.y + a.x22 * b.z;
                    return new Vector3_1.Vector3(x, y, z).normalize();
                };
                TMatrix4.prototype.mulRay = function (b) {
                    var a = this;
                    return new Ray_1.Ray(a.mulPosition(b.origin), a.mulDirection(b.direction));
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
                    var min = new Vector3_1.Vector3(minx + a.x03, miny + a.x13, minz + a.x23);
                    var max = new Vector3_1.Vector3(maxx + a.x03, maxy + a.x13, maxz + a.x23);
                    return new Box_1.Box(min, max);
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
            exports_1("TMatrix4", TMatrix4);
        }
    }
});
//# sourceMappingURL=TMatrix4.js.map