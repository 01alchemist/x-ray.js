System.register(["./Vector3", "../scene/shapes/Box", "./Ray"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Vector3_1, Box_1, Ray_1;
    var Matrix4;
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
                    return new Vector3_1.Vector3(x, y, z);
                };
                Matrix4.prototype.mulDirection = function (b) {
                    var a = this;
                    var x = a.x00 * b.x + a.x01 * b.y + a.x02 * b.z;
                    var y = a.x10 * b.x + a.x11 * b.y + a.x12 * b.z;
                    var z = a.x20 * b.x + a.x21 * b.y + a.x22 * b.z;
                    return new Vector3_1.Vector3(x, y, z).normalize();
                };
                Matrix4.prototype.mulRay = function (b) {
                    var a = this;
                    return new Ray_1.Ray(a.mulPosition(b.origin), a.mulDirection(b.direction));
                };
                Matrix4.prototype.mulBox = function (box) {
                    var a = this;
                    var r = new Vector3_1.Vector3(a.x00, a.x10, a.x20);
                    var u = new Vector3_1.Vector3(a.x01, a.x11, a.x21);
                    var b = new Vector3_1.Vector3(a.x02, a.x12, a.x22);
                    var t = new Vector3_1.Vector3(a.x03, a.x13, a.x23);
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
                    return new Box_1.Box(min, max);
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
            exports_1("Matrix4", Matrix4);
        }
    }
});
//# sourceMappingURL=Matrix4.js.map