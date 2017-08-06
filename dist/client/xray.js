(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["xray"] = factory();
	else
		root["xray"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 36);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __webpack_require__(2);
const Texture_1 = __webpack_require__(10);
const Attenuation_1 = __webpack_require__(4);
const Attenuation_2 = __webpack_require__(4);
var MaterialType;
(function (MaterialType) {
    MaterialType[MaterialType["GENERIC"] = 0] = "GENERIC";
    MaterialType[MaterialType["DIFFUSE"] = 1] = "DIFFUSE";
    MaterialType[MaterialType["SPECULAR"] = 2] = "SPECULAR";
    MaterialType[MaterialType["CLEAR"] = 3] = "CLEAR";
    MaterialType[MaterialType["GLOSSY"] = 4] = "GLOSSY";
    MaterialType[MaterialType["EMISSIVE"] = 5] = "EMISSIVE";
})(MaterialType = exports.MaterialType || (exports.MaterialType = {}));
class Material {
    constructor(color = new Color_1.Color(), texture, normalTexture, bumpTexture, bumpMultiplier, emittance, attenuation = Attenuation_2.NoAttenuation, ior, gloss, tint, transparent) {
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
    clone() {
        var material = new Material(this.color.clone(), this.texture, this.normalTexture, this.bumpTexture, this.bumpMultiplier, this.emittance, this.attenuation.clone(), this.ior, this.gloss, this.tint, this.transparent);
        material.type = this.type;
        return material;
    }
    directRead(memory, offset) {
        offset = this.color.directRead(memory, offset);
        this.bumpMultiplier = memory[offset++];
        this.emittance = memory[offset++];
        offset = this.attenuation.directRead(memory, offset);
        this.ior = memory[offset++];
        this.gloss = memory[offset++];
        this.tint = memory[offset++];
        this.transparent = memory[offset++] == 1;
        return offset;
    }
    directWrite(memory, offset) {
        offset = this.color.directWrite(memory, offset);
        memory[offset++] = this.bumpMultiplier;
        memory[offset++] = this.emittance;
        offset = this.attenuation.directWrite(memory, offset);
        memory[offset++] = this.ior;
        memory[offset++] = this.gloss;
        memory[offset++] = this.tint;
        memory[offset++] = this.transparent ? 1 : 0;
        return offset;
    }
    read(memory) {
        this.color.read(memory);
        this.bumpMultiplier = memory.readFloat();
        this.emittance = memory.readFloat();
        this.attenuation.read(memory);
        this.ior = memory.readFloat();
        this.gloss = memory.readFloat();
        this.tint = memory.readFloat();
        this.transparent = memory.readBoolean();
        var hasTexture = memory.readBoolean();
        if (hasTexture) {
            this.texture = Texture_1.Texture.getTexture(memory.readUTF());
        }
        var hasNormalTexture = memory.readBoolean();
        if (hasNormalTexture) {
            this.normalTexture = Texture_1.Texture.getTexture(memory.readUTF());
        }
        return memory.position;
    }
    write(memory) {
        this.color.write(memory);
        memory.writeFloat(this.bumpMultiplier);
        memory.writeFloat(this.emittance);
        this.attenuation.write(memory);
        memory.writeFloat(this.ior);
        memory.writeFloat(this.gloss);
        memory.writeFloat(this.tint);
        memory.writeBoolean(this.transparent);
        if (this.texture) {
            memory.writeBoolean(true);
            memory.writeUTF(this.texture.sourceFile);
        }
        else {
            memory.writeBoolean(false);
        }
        if (this.normalTexture) {
            memory.writeBoolean(true);
            memory.writeUTF(this.normalTexture.sourceFile);
        }
        else {
            memory.writeBoolean(false);
        }
        return memory.position;
    }
    static get estimatedMemory() {
        return Material.SIZE * Material.map.length + 1;
    }
    ;
    static directWrite(memory, offset) {
        memory[offset++] = Material.map.length;
        Material.map.forEach(function (material) {
            offset = material.directWrite(memory, offset);
        });
        return offset;
    }
    static directRestore(memory, offset = 0) {
        var numMaterials = memory[offset++];
        for (var i = 0; i < numMaterials; i++) {
            offset = new Material().directRead(memory, offset);
        }
        return offset;
    }
    static write(memory) {
        memory.writeUnsignedInt(Material.map.length);
        Material.map.forEach(function (material) {
            material.write(memory);
        });
        return memory.position;
    }
    static restore(memory) {
        var numMaterials = memory.readUnsignedInt();
        for (var i = 0; i < numMaterials; i++) {
            new Material().read(memory);
        }
        return memory.position;
    }
}
Material.SIZE = Color_1.Color.SIZE + Attenuation_1.Attenuation.SIZE + 6;
Material.map = [];
exports.Material = Material;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DirectMemory_1 = __webpack_require__(13);
class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.memorySize = Vector3.SIZE;
        this.data = new Float32Array(4);
        this.update();
    }
    update() {
        this.data[0] = this.x;
        this.data[1] = this.y;
        this.data[2] = this.z;
    }
    sync() {
        this.x = this.data[0];
        this.y = this.data[1];
        this.z = this.data[2];
    }
    static fromJson(v) {
        if (v) {
            return new Vector3(v.x, v.y, v.z);
        }
        else {
            return null;
        }
    }
    setFromArray(a, offset = 0) {
        this.x = a[offset];
        this.y = a[offset + 1];
        this.z = a[offset + 2];
        this.update();
    }
    setFromJson(a) {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
        this.update();
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    dot(b) {
        return this.x * b.x + this.y * b.y + this.z * b.z;
    }
    cross(b) {
        let x = this.y * b.z - this.z * b.y;
        let y = this.z * b.x - this.x * b.z;
        let z = this.x * b.y - this.y * b.x;
        return new Vector3(x, y, z);
    }
    normalize() {
        let d = this.length();
        return new Vector3(this.x / d, this.y / d, this.z / d);
    }
    add(b) {
        return new Vector3(this.x + b.x, this.y + b.y, this.z + b.z);
    }
    sub(b) {
        return new Vector3(this.x - b.x, this.y - b.y, this.z - b.z);
    }
    mul(b) {
        return new Vector3(this.x * b.x, this.y * b.y, this.z * b.z);
    }
    div(b) {
        return new Vector3(this.x / b.x, this.y / b.y, this.z / b.z);
    }
    mulScalar(b) {
        return new Vector3(this.x * b, this.y * b, this.z * b);
    }
    divScalar(b) {
        return new Vector3(this.x / b, this.y / b, this.z / b);
    }
    min(b) {
        return new Vector3(Math.min(this.x, b.x), Math.min(this.y, b.y), Math.min(this.z, b.z));
    }
    max(b) {
        return new Vector3(Math.max(this.x, b.x), Math.max(this.y, b.y), Math.max(this.z, b.z));
    }
    minAxis() {
        let x = Math.abs(this.x);
        let y = Math.abs(this.y);
        let z = Math.abs(this.z);
        if (x <= y && x <= z) {
            return new Vector3(1, 0, 0);
        }
        else if (y <= x && y <= z) {
            return new Vector3(0, 1, 0);
        }
        return new Vector3(0, 0, 1);
    }
    minComponent() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }
    reflect(i) {
        return i.sub(this.mulScalar(2 * this.dot(i)));
    }
    refract(i, n1, n2) {
        let nr = n1 / n2;
        let cosI = -this.dot(i);
        let sinT2 = nr * nr * (1 - cosI * cosI);
        if (sinT2 > 1) {
            return new Vector3();
        }
        let cosT = Math.sqrt(1 - sinT2);
        return i.mulScalar(nr).add(this.mulScalar(nr * cosI - cosT));
    }
    reflectance(i, n1, n2) {
        let nr = n1 / n2;
        let cosI = -this.dot(i);
        let sinT2 = nr * nr * (1 - cosI * cosI);
        if (sinT2 > 1) {
            return 1;
        }
        let cosT = Math.sqrt(1 - sinT2);
        let rOrth = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
        let rPar = (n2 * cosI - n1 * cosT) / (n2 * cosI + n1 * cosT);
        return (rOrth * rOrth + rPar * rPar) / 2;
    }
    toString() {
        return "(" + this.x + "," + this.y + "," + this.z + ")";
    }
    equals(v) {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }
    isZero() {
        return this.x == 0 && this.y == 0 && this.z == 0;
    }
    directWrite(memory, offset) {
        memory[offset++] = this.x;
        memory[offset++] = this.y;
        memory[offset++] = this.z;
        return offset;
    }
    directRead(memory, offset) {
        this.x = memory[offset++];
        this.y = memory[offset++];
        this.z = memory[offset++];
        return offset;
    }
    read(memory) {
        this.x = memory.readFloat();
        this.y = memory.readFloat();
        this.z = memory.readFloat();
        return memory.position;
    }
    write(memory) {
        memory.writeFloat(this.x);
        memory.writeFloat(this.y);
        memory.writeFloat(this.z);
        return memory.position;
    }
    isNullVector() {
        return this.x == DirectMemory_1.DirectMemory.MIN_FLOAT32_VALUE &&
            this.y == DirectMemory_1.DirectMemory.MIN_FLOAT32_VALUE &&
            this.z == DirectMemory_1.DirectMemory.MIN_FLOAT32_VALUE;
    }
}
Vector3.SIZE = 3;
Vector3.NullVector = new Vector3(DirectMemory_1.DirectMemory.MIN_FLOAT32_VALUE, DirectMemory_1.DirectMemory.MIN_FLOAT32_VALUE, DirectMemory_1.DirectMemory.MIN_FLOAT32_VALUE);
exports.Vector3 = Vector3;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Color {
    constructor(r = 0, g = 0, b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    directWrite(mem, offset) {
        mem[offset++] = this.r;
        mem[offset++] = this.g;
        mem[offset++] = this.b;
        return offset;
    }
    directRead(mem, offset) {
        this.r = mem[offset++];
        this.g = mem[offset++];
        this.b = mem[offset++];
        return offset;
    }
    read(memory) {
        this.r = memory.readFloat();
        this.g = memory.readFloat();
        this.b = memory.readFloat();
        return memory.position;
    }
    write(memory) {
        memory.writeFloat(this.r);
        memory.writeFloat(this.g);
        memory.writeFloat(this.b);
        return memory.position;
    }
    static fromJson(color) {
        if (color) {
            return new Color(color.r, color.g, color.b);
        }
        else {
            return null;
        }
    }
    static hexColor(hex) {
        var red = ((hex >> 16) & 255) / 255;
        var green = ((hex >> 8) & 255) / 255;
        var blue = (hex & 255) / 255;
        return new Color(red, green, blue).pow(2.2);
    }
    static newColor(c) {
        return new Color(c.r / 65535, c.g / 65535, c.b / 65535);
    }
    RGBA() {
        let a = this;
        let _c = new Uint8Array(3);
        _c[0] = Math.max(0, Math.min(255, a.r * 255));
        _c[1] = Math.max(0, Math.min(255, a.g * 255));
        _c[2] = Math.max(0, Math.min(255, a.b * 255));
        return { r: _c[0], g: _c[1], b: _c[2], a: 255 };
    }
    isBlack() {
        return this.r === 0 && this.g === 0 && this.b === 0;
    }
    isWhite() {
        return this.r === 1 && this.g === 1 && this.b === 1;
    }
    add(b) {
        return new Color(this.r + b.r, this.g + b.g, this.b + b.b);
    }
    sub(b) {
        return new Color(this.r - b.r, this.g - b.g, this.b - b.b);
    }
    mul(b) {
        return new Color(this.r * b.r, this.g * b.g, this.b * b.b);
    }
    mulScalar(b) {
        return new Color(this.r * b, this.g * b, this.b * b);
    }
    divScalar(b) {
        return new Color(this.r / b, this.g / b, this.b / b);
    }
    min(b) {
        return new Color(Math.min(this.r, b.r), Math.min(this.g, b.g), Math.min(this.b, b.b));
    }
    max(b) {
        return new Color(Math.max(this.r, b.r), Math.max(this.g, b.g), Math.max(this.b, b.b));
    }
    pow(b) {
        return new Color(Math.pow(this.r, b), Math.pow(this.g, b), Math.pow(this.b, b));
    }
    mix(b, pct) {
        let a = this.mulScalar(1 - pct);
        b = b.mulScalar(pct);
        return a.add(b);
    }
    set(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    }
    clone() {
        return new Color(this.r, this.g, this.b);
    }
    static random() {
        return new Color(Math.random(), Math.random(), Math.random());
    }
    static randomBrightColor() {
        var i = Math.round(Math.random() * Color.brightColors.length);
        return Color.brightColors[i];
    }
}
Color.SIZE = 3;
Color.brightColors = [
    Color.hexColor(0xFF00FF),
    Color.hexColor(0x84FF00),
    Color.hexColor(0xFF0084),
    Color.hexColor(0x00FFFF),
    Color.hexColor(0x00FF84),
    Color.hexColor(0xDD40FF),
    Color.hexColor(0xFFFF00)
];
exports.Color = Color;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = __webpack_require__(9);
const HitInfo_1 = __webpack_require__(27);
const Ray_1 = __webpack_require__(8);
class Hit {
    constructor(shape, T, info) {
        this.shape = shape;
        this.T = T;
        this.info = info;
    }
    ok() {
        return this.T < Constants_1.INF;
    }
    getInfo(ray) {
        if (this.info) {
            return this.info;
        }
        let shape = this.shape;
        let position = ray.position(this.T);
        let normal = shape.getNormal(position);
        let color = shape.getColor(position);
        let material = shape.getMaterial(position);
        let inside = false;
        if (normal.dot(ray.direction) > 0) {
            normal = normal.mulScalar(-1);
            inside = true;
        }
        ray = new Ray_1.Ray(position, normal);
        this.info = new HitInfo_1.HitInfo(shape, position, normal, ray, color, material, inside);
        return this.info;
    }
}
exports.Hit = Hit;
exports.NoHit = new Hit(null, Constants_1.INF);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Attenuation {
    constructor(constant = 1, linear = 0, quadratic = 0) {
        this.constant = constant;
        this.linear = linear;
        this.quadratic = quadratic;
    }
    static fromJson(attenuation) {
        if (!attenuation) {
            return exports.NoAttenuation;
        }
        else {
            return new Attenuation(attenuation.constant, attenuation.linear, attenuation.quadratic);
        }
    }
    compute(d) {
        return 1 / (this.constant + this.linear * d + this.quadratic * d * d);
    }
    set(attenation) {
        this.constant = attenation.constant;
        this.linear = attenation.linear;
        this.quadratic = attenation.quadratic;
        return this;
    }
    clone() {
        return new Attenuation(this.constant, this.linear, this.quadratic);
    }
    directWrite(mem, offset) {
        mem[offset++] = this.constant;
        mem[offset++] = this.linear;
        mem[offset++] = this.quadratic;
        return offset;
    }
    directRead(mem, offset) {
        this.constant = mem[offset++];
        this.linear = mem[offset++];
        this.quadratic = mem[offset++];
        return offset;
    }
    read(memory) {
        this.constant = memory.readFloat();
        this.linear = memory.readFloat();
        this.quadratic = memory.readFloat();
        return memory.position;
    }
    write(memory) {
        memory.writeFloat(this.constant);
        memory.writeFloat(this.linear);
        memory.writeFloat(this.quadratic);
        return memory.position;
    }
}
Attenuation.SIZE = 3;
exports.Attenuation = Attenuation;
exports.NoAttenuation = new Attenuation(1, 0, 0);
class LinearAttenuation extends Attenuation {
    constructor(value) {
        super(1, value, 0);
    }
}
exports.LinearAttenuation = LinearAttenuation;
class QuadraticAttenuation extends Attenuation {
    constructor(value) {
        super(1, 0, value);
    }
}
exports.QuadraticAttenuation = QuadraticAttenuation;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = __webpack_require__(1);
const Axis_1 = __webpack_require__(14);
class Box {
    constructor(min = new Vector3_1.Vector3(), max = new Vector3_1.Vector3()) {
        this.min = min;
        this.max = max;
        this.memorySize = Box.SIZE;
    }
    directWrite(memory, offset) {
        offset = this.min.directWrite(memory, offset);
        offset = this.max.directWrite(memory, offset);
        return offset;
    }
    directRead(memory, offset) {
        offset = this.min.directRead(memory, offset);
        offset = this.max.directRead(memory, offset);
        return offset;
    }
    read(memory) {
        this.min.read(memory);
        this.max.read(memory);
        return memory.position;
    }
    write(memory) {
        this.min.write(memory);
        this.max.write(memory);
        return memory.position;
    }
    static fromJson(box) {
        return new Box(Vector3_1.Vector3.fromJson(box.min), Vector3_1.Vector3.fromJson(box.max));
    }
    static boxForShapes(shapes) {
        if (shapes.length == 0) {
            return new Box();
        }
        var box = shapes[0].box;
        shapes.forEach(function (shape) {
            box = box.extend(shape.box);
        });
        return box;
    }
    static boxForTriangles(shapes) {
        if (shapes.length == 0) {
            return new Box();
        }
        var box = shapes[0].box;
        shapes.forEach(function (shape) {
            box = box.extend(shape.box);
        });
        return box;
    }
    anchor(anchor) {
        return this.min.add(this.size().mul(anchor));
    }
    center() {
        return this.anchor(new Vector3_1.Vector3(0.5, 0.5, 0.5));
    }
    size() {
        return this.max.sub(this.min);
    }
    extend(b) {
        return new Box(this.min.min(b.min), this.max.max(b.max));
    }
    intersect(r) {
        var x1 = (this.min.x - r.origin.x) / r.direction.x;
        var y1 = (this.min.y - r.origin.y) / r.direction.y;
        var z1 = (this.min.z - r.origin.z) / r.direction.z;
        var x2 = (this.max.x - r.origin.x) / r.direction.x;
        var y2 = (this.max.y - r.origin.y) / r.direction.y;
        var z2 = (this.max.z - r.origin.z) / r.direction.z;
        if (x1 > x2) {
            let _x1 = x1;
            x1 = x2;
            x2 = _x1;
        }
        if (y1 > y2) {
            let _y1 = y1;
            y1 = y2;
            y2 = _y1;
        }
        if (z1 > z2) {
            let _z1 = z1;
            z1 = z2;
            z2 = _z1;
        }
        var t1 = Math.max(Math.max(x1, y1), z1);
        var t2 = Math.min(Math.min(x2, y2), z2);
        return { min: t1, max: t2 };
    }
    partition(axis, point) {
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
    }
    toString() {
        return "Box(min:" + this.min.toString() + ", max:" + this.max.toString() + ")";
    }
}
Box.SIZE = Vector3_1.Vector3.SIZE * 2;
exports.Box = Box;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Cube_1 = __webpack_require__(16);
const Sphere_1 = __webpack_require__(18);
const Mesh_1 = __webpack_require__(19);
const Triangle_1 = __webpack_require__(11);
const TransformedShape_1 = __webpack_require__(21);
var ShapeType;
(function (ShapeType) {
    ShapeType[ShapeType["TRIANGLE"] = 0] = "TRIANGLE";
    ShapeType[ShapeType["CUBE"] = 1] = "CUBE";
    ShapeType[ShapeType["SPHERE"] = 2] = "SPHERE";
    ShapeType[ShapeType["MESH"] = 3] = "MESH";
    ShapeType[ShapeType["TRANSFORMED_SHAPE"] = 4] = "TRANSFORMED_SHAPE";
})(ShapeType = exports.ShapeType || (exports.ShapeType = {}));
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
exports.ShapesfromJson = ShapesfromJson;
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
exports.ShapefromJson = ShapefromJson;
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
exports.directRestoreShape = directRestoreShape;
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
exports.restoreShape = restoreShape;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function append(slice, ...elements) {
    if (slice == undefined) {
        return elements;
    }
    else {
        slice.push.apply(slice, elements);
    }
    return slice;
}
exports.append = append;
function sortAscending(slice) {
    slice.sort(function (a, b) {
        return a - b;
    });
}
exports.sortAscending = sortAscending;
function sortDescending(slice) {
    slice.sort(function (a, b) {
        return b - a;
    });
}
exports.sortDescending = sortDescending;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = __webpack_require__(1);
const Constants_1 = __webpack_require__(9);
class Ray {
    constructor(origin = new Vector3_1.Vector3(), direction = new Vector3_1.Vector3()) {
        this.origin = origin;
        this.direction = direction;
        this.data = new Float32Array([
            origin.x, origin.y, origin.z,
            direction.x, direction.y, direction.z
        ]);
    }
    position(t) {
        return this.origin.add(this.direction.mulScalar(t));
    }
    reflect(i) {
        return new Ray(this.origin, this.direction.reflect(i.direction));
    }
    Refract(i, n1, n2) {
        return new Ray(this.origin, this.direction.refract(i.direction, n1, n2));
    }
    reflectance(i, n1, n2) {
        return this.direction.reflectance(i.direction, n1, n2);
    }
    weightedBounce(u, v) {
        var m1 = Math.sqrt(u);
        var m2 = Math.sqrt(1 - u);
        var a = v * 2 * Math.PI;
        var q = new Vector3_1.Vector3(u - 0.5, v - 0.5, u + v - 1);
        var s = this.direction.cross(q.normalize());
        var t = this.direction.cross(s);
        var d = new Vector3_1.Vector3();
        d = d.add(s.mulScalar(m1 * Math.cos(a)));
        d = d.add(t.mulScalar(m1 * Math.sin(a)));
        d = d.add(this.direction.mulScalar(m2));
        return new Ray(this.origin, d);
    }
    coneBounce(theta, u, v) {
        if (theta < Constants_1.EPS) {
            return this;
        }
        theta = theta * (1 - (2 * Math.acos(u) / Math.PI));
        var m1 = Math.sin(theta);
        var m2 = Math.cos(theta);
        var a = v * 2 * Math.PI;
        var s = this.direction.cross(this.direction.minAxis());
        var t = this.direction.cross(s);
        var d = new Vector3_1.Vector3();
        d = d.add(s.mulScalar(m1 * Math.cos(a)));
        d = d.add(t.mulScalar(m1 * Math.sin(a)));
        d = d.add(this.direction.mulScalar(m2));
        return new Ray(this.origin, d);
    }
    bounce(info, p, u, v) {
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
    }
    toString() {
        return "Ray:" + this.origin.toString() + " -> " + this.direction.toString();
    }
}
exports.Ray = Ray;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.INF = 1e9;
exports.EPS = 1e-9;
exports.shift = 64 - 11 - 1;
exports.uvnan = 0x7FF8000000000001;
exports.uvinf = 0x7FF0000000000000;
exports.uvneginf = 0xFFF0000000000000;
exports.mask = 0x7FF;
exports.bias = 1023;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __webpack_require__(2);
const Vector3_1 = __webpack_require__(1);
const ImageLoader_1 = __webpack_require__(43);
const MathUtils_1 = __webpack_require__(15);
class Texture extends ImageLoader_1.ImageLoader {
    constructor(arg) {
        super();
        try {
            if (importScripts) {
                return;
            }
        }
        catch (e) {
        }
        if (!Texture.ctx) {
            var canvas = document.createElement("canvas");
            canvas.width = 4096;
            canvas.height = 4096;
            Texture.ctx = canvas.getContext("2d");
        }
        if (arg) {
            if (typeof arg === "string") {
                this.load(arg);
            }
            else if (arg instanceof HTMLImageElement) {
                this.setImage(arg);
            }
        }
    }
    static getTexture(url) {
        var texture = Texture.list[Texture.map.get(url)];
        if (texture) {
            return texture;
        }
        else {
            return new Texture(url);
        }
    }
    static setTexture(url, texture) {
        texture.index = Texture.list.push(texture) - 1;
        Texture.map.set(url, texture.index);
        return texture;
    }
    static fromJson(texture) {
        if (texture) {
            var _texture = new Texture();
            _texture.data = texture.data;
            _texture.pixels = texture.pixels;
            return _texture;
        }
        else {
            return null;
        }
    }
    read(memory) {
        this.sourceFile = memory.readUTF();
        this.width = memory.readUnsignedInt();
        this.height = memory.readUnsignedInt();
        this.data = [];
        for (var i = 0; i < this.width * this.height; i++) {
            var color = new Color_1.Color();
            color.read(memory);
            this.data.push(color);
        }
        Texture.setTexture(this.sourceFile, this);
        return memory.position;
    }
    write(memory) {
        memory.writeUTF(this.sourceFile);
        memory.writeUnsignedInt(this.width);
        memory.writeUnsignedInt(this.height);
        for (var i = 0; i < this.width * this.height; i++) {
            this.data[i].write(memory);
        }
        return memory.position;
    }
    bilinearSample(u, v) {
        let w = this.width - 1;
        let h = this.height - 1;
        let Xx = MathUtils_1.MathUtils.Modf(u * w);
        let Yy = MathUtils_1.MathUtils.Modf(v * h);
        let X = Xx.int;
        let x = Xx.frac;
        let Y = Yy.int;
        let y = Yy.frac;
        let x0 = X;
        let y0 = Y;
        let x1 = x0 + 1;
        let y1 = y0 + 1;
        let i00 = y0 * this.width + x0;
        let i01 = y1 * this.width + x0;
        let i10 = y0 * this.width + x1;
        let i11 = y1 * this.width + x1;
        let c00 = this.data[i00 >= this.data.length ? this.data.length - 1 : i00];
        let c01 = this.data[i01 >= this.data.length ? this.data.length - 1 : i01];
        let c10 = this.data[i10 >= this.data.length ? this.data.length - 1 : i10];
        let c11 = this.data[i11 >= this.data.length ? this.data.length - 1 : i11];
        let c = new Color_1.Color();
        c = c.add(c00.mulScalar((1 - x) * (1 - y)));
        c = c.add(c10.mulScalar(x * (1 - y)));
        c = c.add(c01.mulScalar((1 - x) * y));
        c = c.add(c11.mulScalar(x * y));
        if (c.isBlack()) {
        }
        return c;
    }
    sample(u, v) {
        u = MathUtils_1.MathUtils.fract(MathUtils_1.MathUtils.fract(u) + 1);
        v = MathUtils_1.MathUtils.fract(MathUtils_1.MathUtils.fract(v) + 1);
        return this.bilinearSample(u, 1 - v);
    }
    normalSample(u, v) {
        let c = this.sample(u, v);
        return new Vector3_1.Vector3(c.r * 2 - 1, c.g * 2 - 1, c.b * 2 - 1).normalize();
    }
    bumpSample(u, v) {
        u = MathUtils_1.MathUtils.fract(MathUtils_1.MathUtils.fract(u) + 1);
        v = MathUtils_1.MathUtils.fract(MathUtils_1.MathUtils.fract(v) + 1);
        v = 1 - v;
        let x = Math.round(u * this.width);
        let y = Math.round(v * this.height);
        let x1 = MathUtils_1.MathUtils.clampInt(x - 1, 0, this.width - 1);
        let x2 = MathUtils_1.MathUtils.clampInt(x + 1, 0, this.width - 1);
        let y1 = MathUtils_1.MathUtils.clampInt(y - 1, 0, this.height - 1);
        let y2 = MathUtils_1.MathUtils.clampInt(y + 1, 0, this.height - 1);
        let cx = this.data[y * this.width + x1].sub(this.data[y * this.width + x2]);
        let cy = this.data[y1 * this.width + x].sub(this.data[y2 * this.width + x]);
        return new Vector3_1.Vector3(cx.r, cy.r, 0);
    }
    load(url, onLoad, onProgress, onError) {
        this.sourceFile = url;
        let texture = Texture.getTexture(url);
        if (texture) {
            this.index = texture.index;
            this.data = texture.data;
            this.image = texture.image;
            this.pixels = texture.pixels;
            this.sourceFile = texture.sourceFile;
            if (onLoad) {
                onLoad(this.data);
            }
            return this.image;
        }
        return super.load(url, function (image) {
            this.setImage(image);
            if (onLoad) {
                onLoad(this.pixels);
            }
        }.bind(this), onProgress, onError);
    }
    setImage(image) {
        this.sourceFile = image.currentSrc;
        Texture.setTexture(this.sourceFile, this);
        Texture.ctx.drawImage(image, 0, 0);
        let pixels = Texture.ctx.getImageData(0, 0, image.width, image.height).data;
        this.setImageData(image.width, image.height, pixels);
        this.image = image;
    }
    setImageData(width, height, pixels) {
        this.data = [];
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var pi = y * (width * 4) + (x * 4);
                var index = y * width + x;
                var rgba = {
                    r: pixels[pi],
                    g: pixels[pi + 1],
                    b: pixels[pi + 2],
                    a: pixels[pi + 3],
                };
                this.data[index] = new Color_1.Color(rgba.r / 255, rgba.g / 255, rgba.b / 255);
            }
        }
        this.width = width;
        this.height = height;
        this.pixels = pixels;
    }
    static write(memory) {
        memory.writeUnsignedInt(Texture.list.length);
        Texture.list.forEach(function (texture) {
            texture.write(memory);
        });
        return memory.position;
    }
    static restore(memory) {
        var numTextures = memory.readUnsignedInt();
        for (var i = 0; i < numTextures; i++) {
            var tex = new Texture();
            tex.read(memory);
        }
        console.info(numTextures + " Textures restored");
        return memory.position;
    }
}
Texture.list = [];
Texture.map = new Map();
exports.Texture = Texture;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Material_1 = __webpack_require__(0);
const Box_1 = __webpack_require__(5);
const Vector3_1 = __webpack_require__(1);
const Hit_1 = __webpack_require__(3);
const Constants_1 = __webpack_require__(9);
const Hit_2 = __webpack_require__(3);
const Matrix4_1 = __webpack_require__(12);
const Shape_1 = __webpack_require__(6);
const MaterialUtils_1 = __webpack_require__(17);
const ByteArrayBase_1 = __webpack_require__(20);
class Triangle {
    constructor(material = null, box = new Box_1.Box(), v1 = new Vector3_1.Vector3(), v2 = new Vector3_1.Vector3(), v3 = new Vector3_1.Vector3(), n1 = new Vector3_1.Vector3(), n2 = new Vector3_1.Vector3(), n3 = new Vector3_1.Vector3(), t1 = new Vector3_1.Vector3(), t2 = new Vector3_1.Vector3(), t3 = new Vector3_1.Vector3()) {
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
        this.type = Shape_1.ShapeType.TRIANGLE;
        this.memorySize = Triangle.SIZE;
        this.data = new Float32Array([
            v1.x, v1.y, v1.z, 0,
            v2.x, v2.y, v2.z, 0,
            v3.x, v3.y, v3.z, 0,
            n1.x, n1.y, n1.z, 0,
            n2.x, n2.y, n2.z, 0,
            n3.x, n3.y, n3.z, 0,
            t1.x, t1.y, t1.z, 0,
            t2.x, t2.y, t2.z, 0,
            t3.x, t3.y, t3.z, 0
        ]);
    }
    update() {
        this.data[0] = this.v1.x;
        this.data[1] = this.v1.y;
        this.data[2] = this.v1.z;
        this.data[3] = 0;
        this.data[4] = this.v2.x;
        this.data[5] = this.v2.y;
        this.data[6] = this.v2.z;
        this.data[7] = 0;
        this.data[8] = this.v3.x;
        this.data[9] = this.v3.y;
        this.data[10] = this.v3.z;
        this.data[11] = 0;
        this.data[12] = this.n1.x;
        this.data[13] = this.n1.y;
        this.data[14] = this.n1.z;
        this.data[15] = 0;
        this.data[16] = this.n2.x;
        this.data[17] = this.n2.y;
        this.data[18] = this.n2.z;
        this.data[19] = 0;
        this.data[20] = this.n3.x;
        this.data[21] = this.n3.y;
        this.data[22] = this.n3.z;
        this.data[23] = 0;
        this.data[24] = this.t1.x;
        this.data[25] = this.t1.y;
        this.data[26] = this.t1.z;
        this.data[27] = 0;
        this.data[28] = this.t2.x;
        this.data[29] = this.t2.y;
        this.data[30] = this.t2.z;
        this.data[31] = 0;
        this.data[32] = this.t3.x;
        this.data[33] = this.t3.y;
        this.data[34] = this.t3.z;
        this.data[35] = 0;
    }
    directRead(memory, offset) {
        offset++;
        var materialIndex = memory[offset++];
        var material = Material_1.Material.map[materialIndex];
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
            offset = offset + Vector3_1.Vector3.SIZE;
        }
        if (this.t2) {
            offset = this.t2.directRead(memory, offset);
        }
        else {
            offset = offset + Vector3_1.Vector3.SIZE;
        }
        if (this.t3) {
            offset = this.t3.directRead(memory, offset);
        }
        else {
            offset = offset + Vector3_1.Vector3.SIZE;
        }
        this.updateBox();
        return offset;
    }
    directWrite(memory, offset) {
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
            offset = offset + Vector3_1.Vector3.SIZE;
        }
        if (this.t2) {
            offset = this.t2.directWrite(memory, offset);
        }
        else {
            offset = offset + Vector3_1.Vector3.SIZE;
        }
        if (this.t3) {
            offset = this.t3.directWrite(memory, offset);
        }
        else {
            offset = offset + Vector3_1.Vector3.SIZE;
        }
        return offset;
    }
    read(memory) {
        memory.position += ByteArrayBase_1.ByteArrayBase.SIZE_OF_UINT8;
        var materialIndex = memory.readInt();
        var material = Material_1.Material.map[materialIndex];
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
        this.update();
        return memory.position;
    }
    write(memory) {
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
            Vector3_1.Vector3.NullVector.write(memory);
        }
        if (this.t2) {
            this.t2.write(memory);
        }
        else {
            Vector3_1.Vector3.NullVector.write(memory);
        }
        if (this.t3) {
            this.t3.write(memory);
        }
        else {
            Vector3_1.Vector3.NullVector.write(memory);
        }
        return memory.position;
    }
    static fromJson(triangles) {
        if (triangles instanceof Triangle) {
            var t = triangles;
            return new Triangle(MaterialUtils_1.MaterialUtils.fromJson(t.material), Box_1.Box.fromJson(t.box), Vector3_1.Vector3.fromJson(t.v1), Vector3_1.Vector3.fromJson(t.v2), Vector3_1.Vector3.fromJson(t.v3), Vector3_1.Vector3.fromJson(t.n1), Vector3_1.Vector3.fromJson(t.n2), Vector3_1.Vector3.fromJson(t.n3), Vector3_1.Vector3.fromJson(t.t1), Vector3_1.Vector3.fromJson(t.t2), Vector3_1.Vector3.fromJson(t.t3));
        }
        else {
            var _ts = [];
            var ts = triangles;
            ts.forEach(function (t) {
                _ts.push(new Triangle(MaterialUtils_1.MaterialUtils.fromJson(t.material), Box_1.Box.fromJson(t.box), Vector3_1.Vector3.fromJson(t.v1), Vector3_1.Vector3.fromJson(t.v2), Vector3_1.Vector3.fromJson(t.v3), Vector3_1.Vector3.fromJson(t.n1), Vector3_1.Vector3.fromJson(t.n2), Vector3_1.Vector3.fromJson(t.n3), Vector3_1.Vector3.fromJson(t.t1), Vector3_1.Vector3.fromJson(t.t2), Vector3_1.Vector3.fromJson(t.t3)));
            });
            return _ts;
        }
    }
    static newTriangle(v1, v2, v3, t1, t2, t3, material) {
        var t = new Triangle();
        t.v1 = v1;
        t.v2 = v2;
        t.v3 = v3;
        t.t1 = t1;
        t.t2 = t2;
        t.t3 = t3;
        t.material = material;
        t.updateBox();
        t.update();
        t.fixNormals();
        return t;
    }
    compile() {
    }
    get vertices() {
        return [this.v1, this.v2, this.v3];
    }
    intersectSIMD(r) {
        this.update();
        var _v1 = SIMD.Float32x4.load(this.data, 0);
        var _v2 = SIMD.Float32x4.load(this.data, 4);
        var _v3 = SIMD.Float32x4.load(this.data, 8);
        var _e1 = SIMD.Float32x4.sub(_v2, _v1);
        var _e2 = SIMD.Float32x4.sub(_v3, _v1);
        var _p = r.direction.SIMD_cross(_e2);
        var det = Vector3_1.Vector3.SIMD.dot(_e1, _p);
        if (det > -Constants_1.EPS && det < Constants_1.EPS) {
            return Hit_2.NoHit;
        }
        var inv = 1 / det;
        var _t = r.origin.SIMD_sub(_v1);
        var u = Vector3_1.Vector3.SIMD.dot(_t, _p) * inv;
        if (u < 0 || u > 1) {
            return Hit_2.NoHit;
        }
        var _q = Vector3_1.Vector3.SIMD.cross(_t, _e1);
        var v = r.direction.SIMD_dot(_q) * inv;
        if (v < 0 || u + v > 1) {
            return Hit_2.NoHit;
        }
        var d = Vector3_1.Vector3.SIMD.dot(_e2, _q) * inv;
        if (d < Constants_1.EPS) {
            return Hit_2.NoHit;
        }
        return new Hit_1.Hit(this, d);
    }
    intersect(r) {
        var e1 = this.v2.sub(this.v1);
        var e2 = this.v3.sub(this.v1);
        var p = r.direction.cross(e2);
        var det = e1.dot(p);
        if (det > -Constants_1.EPS && det < Constants_1.EPS) {
            return Hit_2.NoHit;
        }
        var inv = 1 / det;
        var t = r.origin.sub(this.v1);
        var u = t.dot(p) * inv;
        if (u < 0 || u > 1) {
            return Hit_2.NoHit;
        }
        var q = t.cross(e1);
        var v = r.direction.dot(q) * inv;
        if (v < 0 || u + v > 1) {
            return Hit_2.NoHit;
        }
        var d = e2.dot(q) * inv;
        if (d < Constants_1.EPS) {
            return Hit_2.NoHit;
        }
        return new Hit_1.Hit(this, d);
    }
    getColor(p) {
        var t = this;
        if (t.material.texture == null) {
            return t.material.color;
        }
        var _uvw = t.baryCentric(p);
        var u = _uvw.u;
        var v = _uvw.v;
        var w = _uvw.w;
        var n = new Vector3_1.Vector3();
        n = n.add(t.t1.mulScalar(u));
        n = n.add(t.t2.mulScalar(v));
        n = n.add(t.t3.mulScalar(w));
        return t.material.texture.sample(n.x, n.y);
    }
    getMaterial(p) {
        return this.material;
    }
    getNormal(p) {
        var t = this;
        var _uvw = t.baryCentric(p);
        var u = _uvw.u;
        var v = _uvw.v;
        var w = _uvw.w;
        var n = new Vector3_1.Vector3();
        n = n.add(t.n1.mulScalar(u));
        n = n.add(t.n2.mulScalar(v));
        n = n.add(t.n3.mulScalar(w));
        n = n.normalize();
        if (t.material.normalTexture != null) {
            var b = new Vector3_1.Vector3();
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
            var matrix = new Matrix4_1.Matrix4(T.x, B.x, N.x, 0, T.y, B.y, N.y, 0, T.z, B.z, N.z, 0, 0, 0, 0, 1);
            n = matrix.mulDirection(ns);
        }
        if (t.material.bumpTexture != null) {
            var b = new Vector3_1.Vector3();
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
    }
    getRandomPoint() {
        return new Vector3_1.Vector3();
    }
    area() {
        var t = this;
        var e1 = t.v2.sub(t.v1);
        var e2 = t.v3.sub(t.v1);
        var n = e1.cross(e2);
        return n.length() / 2;
    }
    baryCentric(p) {
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
    }
    updateBox() {
        var t = this;
        var min = t.v1.min(t.v2).min(t.v3);
        var max = t.v1.max(t.v2).max(t.v3);
        t.box = new Box_1.Box(min, max);
    }
    fixNormals() {
        var t = this;
        var e1 = t.v2.sub(t.v1);
        var e2 = t.v3.sub(t.v1);
        var n = e1.cross(e2).normalize();
        var zero = new Vector3_1.Vector3();
        if (t.n1 == undefined || t.n1.equals(zero)) {
            t.n1 = n;
        }
        if (t.n2 == undefined || t.n2.equals(zero)) {
            t.n2 = n;
        }
        if (t.n3 == undefined || t.n3.equals(zero)) {
            t.n3 = n;
        }
    }
}
Triangle.SIZE = Box_1.Box.SIZE + (Vector3_1.Vector3.SIZE * 9) + 2;
exports.Triangle = Triangle;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = __webpack_require__(1);
const Box_1 = __webpack_require__(5);
const Ray_1 = __webpack_require__(8);
class Matrix4 {
    constructor(x00 = 0, x01 = 0, x02 = 0, x03 = 0, x10 = 0, x11 = 0, x12 = 0, x13 = 0, x20 = 0, x21 = 0, x22 = 0, x23 = 0, x30 = 0, x31 = 0, x32 = 0, x33 = 0) {
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
    directRead(memory, offset) {
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
    }
    directWrite(memory, offset) {
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
    }
    read(memory) {
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
    }
    write(memory) {
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
    }
    static fromJson(m) {
        return new Matrix4(m.x00, m.x01, m.x02, m.x03, m.x10, m.x11, m.x12, m.x13, m.x20, m.x21, m.x22, m.x23, m.x30, m.x31, m.x32, m.x33);
    }
    static fromTHREEJS(e) {
        return new Matrix4(e[0], e[4], e[8], e[12], e[1], e[5], e[9], e[13], e[2], e[6], e[10], e[14], e[3], e[7], e[11], e[15]);
    }
    static identity() {
        return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    static translate(v) {
        return new Matrix4(1, 0, 0, v.x, 0, 1, 0, v.y, 0, 0, 1, v.z, 0, 0, 0, 1);
    }
    static scale(v) {
        return new Matrix4(v.x, 0, 0, 0, 0, v.y, 0, 0, 0, 0, v.z, 0, 0, 0, 0, 1);
    }
    static rotate(v, a) {
        v = v.normalize();
        var s = Math.sin(a);
        var c = Math.cos(a);
        var m = 1 - c;
        return new Matrix4(m * v.x * v.x + c, m * v.x * v.y + v.z * s, m * v.z * v.x - v.y * s, 0, m * v.x * v.y - v.z * s, m * v.y * v.y + c, m * v.y * v.z + v.x * s, 0, m * v.z * v.x + v.y * s, m * v.y * v.z - v.x * s, m * v.z * v.z + c, 0, 0, 0, 0, 1);
    }
    static frustum(l, r, b, t, n, f) {
        var t1 = 2 * n;
        var t2 = r - l;
        var t3 = t - b;
        var t4 = f - n;
        return new Matrix4(t1 / t2, 0, (r + l) / t2, 0, 0, t1 / t3, (t + b) / t3, 0, 0, 0, (-f - n) / t4, (-t1 * f) / t4, 0, 0, -1, 0);
    }
    static orthographic(l, r, b, t, n, f) {
        return new Matrix4(2 / (r - l), 0, 0, -(r + l) / (r - l), 0, 2 / (t - b), 0, -(t + b) / (t - b), 0, 0, -2 / (f - n), -(f + n) / (f - n), 0, 0, 0, 1);
    }
    static perspective(fov, aspect, near, far) {
        var ymax = near * Math.tan(fov * Math.PI / 360);
        var xmax = ymax * aspect;
        return Matrix4.frustum(-xmax, xmax, -ymax, ymax, near, far);
    }
    static LookAtMatrix(eye, center, up, fovy) {
        up = up.normalize();
        var f = center.sub(eye).normalize();
        var s = f.cross(up);
        var u = s.cross(f);
        var m = new Matrix4(s.x, u.x, -f.x, eye.x, s.y, u.y, -f.y, eye.y, s.z, u.z, -f.z, eye.z, 0, 0, 0, 1);
        return m.inverse();
    }
    translate(v) {
        return Matrix4.translate(v).mul(this);
    }
    scale(v) {
        return Matrix4.scale(v).mul(this);
    }
    rotate(v, a) {
        return Matrix4.rotate(v, a).mul(this);
    }
    frustum(l, r, b, t, n, f) {
        return Matrix4.frustum(l, r, b, t, n, f).mul(this);
    }
    orthographic(l, r, b, t, n, f) {
        return Matrix4.orthographic(l, r, b, t, n, f).mul(this);
    }
    perspective(fov, aspect, near, far) {
        return Matrix4.perspective(fov, aspect, near, far).mul(this);
    }
    mul(b) {
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
    }
    mulPosition(b) {
        var a = this;
        var x = a.x00 * b.x + a.x01 * b.y + a.x02 * b.z + a.x03;
        var y = a.x10 * b.x + a.x11 * b.y + a.x12 * b.z + a.x13;
        var z = a.x20 * b.x + a.x21 * b.y + a.x22 * b.z + a.x23;
        return new Vector3_1.Vector3(x, y, z);
    }
    mulDirection(b) {
        var a = this;
        var x = a.x00 * b.x + a.x01 * b.y + a.x02 * b.z;
        var y = a.x10 * b.x + a.x11 * b.y + a.x12 * b.z;
        var z = a.x20 * b.x + a.x21 * b.y + a.x22 * b.z;
        return new Vector3_1.Vector3(x, y, z).normalize();
    }
    mulRay(b) {
        var a = this;
        return new Ray_1.Ray(a.mulPosition(b.origin), a.mulDirection(b.direction));
    }
    mulBox(box) {
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
    }
    transpose() {
        var a = this;
        return new Matrix4(a.x00, a.x10, a.x20, a.x30, a.x01, a.x11, a.x21, a.x31, a.x02, a.x12, a.x22, a.x32, a.x03, a.x13, a.x23, a.x33);
    }
    determinant() {
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
    }
    inverse() {
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
    }
}
Matrix4.SIZE = 16;
exports.Matrix4 = Matrix4;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const MemoryUtils_1 = __webpack_require__(39);
const UTF8_1 = __webpack_require__(40);
class DirectMemory {
    constructor(buffer, offset = 0, length = 0) {
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
    get phyPosition() {
        return this._position + this.data.byteOffset;
    }
    get bufferOffset() {
        return this.data.byteOffset;
    }
    get position() {
        return this._position;
    }
    set position(value) {
        if (this._position < value) {
            if (!this.validate(this._position - value)) {
                return;
            }
        }
        this._position = value;
        this.write_position = value > this.write_position ? value : this.write_position;
    }
    get length() {
        return this.write_position;
    }
    set length(value) {
        this.validateBuffer(value);
    }
    get bytesAvailable() {
        return this.data.byteLength - this._position;
    }
    clear() {
        this._position = 0;
    }
    setBuffer(buffer, offset = 0, length = 0) {
        if (buffer) {
            this.data = new Uint8Array(buffer, offset, length > 0 ? length : buffer.byteLength);
            this.write_position = length > 0 ? length : buffer.byteLength;
        }
        else {
            this.write_position = 0;
        }
        this._position = 0;
    }
    readBoolean() {
        if (!this.validate(DirectMemory.SIZE_OF_BOOLEAN))
            return null;
        return this.data[this.position++] != 0;
    }
    readByte() {
        if (!this.validate(DirectMemory.SIZE_OF_INT8))
            return null;
        return this.data[this.position++];
    }
    readBytes(_bytes = null, offset = 0, length = 0, createNewBuffer = false) {
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
    }
    readDouble() {
        if (!this.validate(DirectMemory.SIZE_OF_FLOAT64))
            return null;
        var value = MemoryUtils_1.MemoryUtils.readFloat64(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_FLOAT64;
        return value;
    }
    readFloat() {
        if (!this.validate(DirectMemory.SIZE_OF_FLOAT32))
            return null;
        var value = MemoryUtils_1.MemoryUtils.readFloat32(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_FLOAT32;
        return value;
    }
    readInt() {
        if (!this.validate(DirectMemory.SIZE_OF_INT32))
            return null;
        var value = MemoryUtils_1.MemoryUtils.readInt32(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_INT32;
        return value;
    }
    readMultiByte(length, charSet) {
        if (!this.validate(length))
            return null;
        throw "readMultiByte: Not Implemented!";
    }
    readShort() {
        if (!this.validate(DirectMemory.SIZE_OF_INT16))
            return null;
        var value = MemoryUtils_1.MemoryUtils.readInt16(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_INT16;
        return value;
    }
    readUnsignedByte() {
        if (!this.validate(DirectMemory.SIZE_OF_UINT8))
            return null;
        return this.data[this.position++];
    }
    readUnsignedInt() {
        if (!this.validate(DirectMemory.SIZE_OF_UINT32))
            return null;
        var value = MemoryUtils_1.MemoryUtils.readUint32(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_UINT32;
        return value;
    }
    readVariableSizedUnsignedInt() {
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
    }
    readU16VX() {
        return (this.readUnsignedByte() << 8) | this.readUnsignedByte();
    }
    readUnsignedShort() {
        if (!this.validate(DirectMemory.SIZE_OF_UINT16))
            return null;
        var value = MemoryUtils_1.MemoryUtils.readUint16(this.data, this.position, this.endian == DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_UINT16;
        return value;
    }
    readUTF() {
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
    }
    readUTFBytes(length) {
        if (!this.validate(length))
            return null;
        var _bytes = new Uint8Array(this.buffer, this.bufferOffset + this.position, length);
        this.position += length;
        return UTF8_1.UTF8.decode(_bytes);
    }
    readStandardString(length) {
        if (!this.validate(length))
            return null;
        var str = "";
        for (var i = 0; i < length; i++) {
            str += String.fromCharCode(this.data[this.position++]);
        }
        return str;
    }
    readStringTillNull(keepEvenByte = true) {
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
    }
    writeBoolean(value) {
        this.validateBuffer(DirectMemory.SIZE_OF_BOOLEAN);
        this.data[this.position++] = value ? 1 : 0;
    }
    writeByte(value) {
        this.validateBuffer(DirectMemory.SIZE_OF_INT8);
        this.data[this.position++] = value;
    }
    writeUnsignedByte(value) {
        this.validateBuffer(DirectMemory.SIZE_OF_UINT8);
        this.data[this.position++] = value;
    }
    writeBytes(_bytes, offset = 0, length = 0) {
        this.validateBuffer(length);
        length = length > 0 ? length : _bytes.length;
        var tmp_data = new Uint8Array(_bytes.buffer, offset, length);
        for (var i = 0; i < length; i++) {
            this.data[offset + this.position++] = tmp_data[i];
        }
    }
    writeDouble(value) {
        this.validateBuffer(DirectMemory.SIZE_OF_FLOAT64);
        MemoryUtils_1.MemoryUtils.writeFloat64(this.data, this.position, value, this.endian == DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_FLOAT64;
    }
    writeFloat(value) {
        this.validateBuffer(DirectMemory.SIZE_OF_FLOAT32);
        MemoryUtils_1.MemoryUtils.writeFloat32(this.data, this.position, value, this.endian == DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_FLOAT32;
    }
    writeInt(value) {
        this.validateBuffer(DirectMemory.SIZE_OF_INT32);
        MemoryUtils_1.MemoryUtils.writeInt32(this.data, this.position, value, this.endian == DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_INT32;
    }
    writeMultiByte(value, charSet) {
    }
    writeShort(value) {
        this.validateBuffer(DirectMemory.SIZE_OF_INT16);
        MemoryUtils_1.MemoryUtils.writeInt16(this.data, this.position, value, this.endian == DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_INT16;
    }
    writeUnsignedShort(value) {
        this.validateBuffer(DirectMemory.SIZE_OF_UINT16);
        MemoryUtils_1.MemoryUtils.writeUint16(this.data, this.position, value, this.endian == DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_UINT16;
    }
    writeUnsignedInt(value) {
        this.validateBuffer(DirectMemory.SIZE_OF_UINT32);
        MemoryUtils_1.MemoryUtils.writeUint32(this.data, this.position, value, this.endian == DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_UINT32;
    }
    writeUTF(value) {
        var utf8bytes = UTF8_1.UTF8.encode(value);
        var length = utf8bytes.length;
        this.validateBuffer(DirectMemory.SIZE_OF_UINT16 + length);
        MemoryUtils_1.MemoryUtils.writeUint16(this.data, this.position, length, this.endian === DirectMemory.LITTLE_ENDIAN);
        this.position += DirectMemory.SIZE_OF_UINT16;
        this.writeUint8Array(utf8bytes);
    }
    writeUTFBytes(value) {
        this.writeUint8Array(UTF8_1.UTF8.encode(value));
    }
    toString() {
        return "[DirectMemory] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
    }
    writeUint8Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            this.data[this.position++] = _bytes[i];
        }
    }
    writeUint16Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            MemoryUtils_1.MemoryUtils.writeUint16(this.data, this.position, _bytes[i], this.endian === DirectMemory.LITTLE_ENDIAN);
            this.position += DirectMemory.SIZE_OF_UINT16;
        }
    }
    writeUint32Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            MemoryUtils_1.MemoryUtils.writeUint32(this.data, this.position, _bytes[i], this.endian === DirectMemory.LITTLE_ENDIAN);
            this.position += DirectMemory.SIZE_OF_UINT32;
        }
    }
    writeInt8Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            this.data[this.position++] = _bytes[i];
        }
    }
    writeInt16Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            MemoryUtils_1.MemoryUtils.writeInt16(this.data, this.position, _bytes[i], this.endian === DirectMemory.LITTLE_ENDIAN);
            this.position += DirectMemory.SIZE_OF_INT16;
        }
    }
    writeInt32Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            MemoryUtils_1.MemoryUtils.writeInt32(this.data, this.position, _bytes[i], this.endian === DirectMemory.LITTLE_ENDIAN);
            this.position += DirectMemory.SIZE_OF_INT32;
        }
    }
    writeFloat32Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            MemoryUtils_1.MemoryUtils.writeFloat32(this.data, this.position, _bytes[i], this.endian === DirectMemory.LITTLE_ENDIAN);
            this.position += DirectMemory.SIZE_OF_FLOAT32;
        }
    }
    writeFloat64Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            MemoryUtils_1.MemoryUtils.writeFloat64(this.data, this.position, _bytes[i], this.endian === DirectMemory.LITTLE_ENDIAN);
            this.position += DirectMemory.SIZE_OF_FLOAT64;
        }
    }
    readUint8Array(length, createNewBuffer = true) {
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
    }
    readUint16Array(length, createNewBuffer = true) {
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
    }
    readUint32Array(length, createNewBuffer = true) {
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
    }
    readInt8Array(length, createNewBuffer = true) {
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
    }
    readInt16Array(length, createNewBuffer = true) {
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
    }
    readInt32Array(length, createNewBuffer = true) {
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
    }
    readFloat32Array(length, createNewBuffer = true) {
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
    }
    readFloat64Array(length, createNewBuffer = true) {
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
    }
    validate(len) {
        if (this.data.byteLength > 0 && this._position + len <= this.data.byteLength) {
            return true;
        }
        else {
            throw "Error #2030: End of file was encountered";
        }
    }
    validateBuffer(len) {
        this.write_position = len > this.write_position ? len : this.write_position;
        if (this.data.byteLength < len) {
            var tmp = new Uint8Array(new SharedArrayBuffer(len + this.BUFFER_EXT_SIZE));
            tmp.set(new Uint8Array(this.data.buffer));
            this.data.buffer = tmp.buffer;
        }
    }
}
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
exports.DirectMemory = DirectMemory;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Axis;
(function (Axis) {
    Axis[Axis["AxisNone"] = 0] = "AxisNone";
    Axis[Axis["AxisX"] = 1] = "AxisX";
    Axis[Axis["AxisY"] = 2] = "AxisY";
    Axis[Axis["AxisZ"] = 3] = "AxisZ";
})(Axis = exports.Axis || (exports.Axis = {}));


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class MathUtils {
    static radians(degrees) {
        return degrees * Math.PI / 180;
    }
    static degrees(radians) {
        return radians * 180 / Math.PI;
    }
    static median(items) {
        let n = items.length;
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
    }
    static fract(x) {
        let n = MathUtils.Modf(x);
        return n.frac;
    }
    static Modf(f) {
        var int = Math.floor(f);
        var frac = f - int;
        return { int: int, frac: frac };
    }
    static clampInt(x, lo, hi) {
        if (x < lo) {
            return lo;
        }
        if (x > hi) {
            return hi;
        }
        return x;
    }
}
exports.MathUtils = MathUtils;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = __webpack_require__(1);
const Material_1 = __webpack_require__(0);
const Box_1 = __webpack_require__(5);
const Constants_1 = __webpack_require__(9);
const Hit_1 = __webpack_require__(3);
const Hit_2 = __webpack_require__(3);
const Shape_1 = __webpack_require__(6);
const MaterialUtils_1 = __webpack_require__(17);
class Cube {
    constructor(min = new Vector3_1.Vector3(), max = new Vector3_1.Vector3(), material = null, box = null) {
        this.min = min;
        this.max = max;
        this.material = material;
        this.box = box;
        this.type = Shape_1.ShapeType.CUBE;
        this.memorySize = (Vector3_1.Vector3.SIZE * 2) + 2;
    }
    write(memory) {
        memory.writeByte(this.type);
        this.min.write(memory);
        this.max.write(memory);
        memory.writeInt(this.material.index);
        return memory.position;
    }
    read(memory) {
        this.min.read(memory);
        this.max.read(memory);
        var materialIndex = memory.readInt();
        this.box = new Box_1.Box(this.min, this.max);
        var material = Material_1.Material.map[materialIndex];
        if (material) {
            this.material = material;
        }
        return memory.position;
    }
    directWrite(memory, offset) {
        memory[offset++] = this.type;
        offset = this.min.directWrite(memory, offset);
        offset = this.max.directWrite(memory, offset);
        memory[offset++] = this.material.index;
        return offset;
    }
    directRead(memory, offset) {
        offset = this.min.directRead(memory, offset);
        offset = this.max.directRead(memory, offset);
        this.box = new Box_1.Box(this.min, this.max);
        this.material.index = memory[offset++];
        var material = Material_1.Material.map[this.material.index];
        if (material) {
            this.material = material;
        }
        return offset;
    }
    static fromJson(shape) {
        return new Cube(Vector3_1.Vector3.fromJson(shape.min), Vector3_1.Vector3.fromJson(shape.max), MaterialUtils_1.MaterialUtils.fromJson(shape.material), Box_1.Box.fromJson(shape.box));
    }
    static newCube(min, max, material) {
        var box = new Box_1.Box(min, max);
        return new Cube(min, max, material, box);
    }
    compile() {
    }
    intersect(r) {
        var n = this.min.sub(r.origin).div(r.direction);
        var f = this.max.sub(r.origin).div(r.direction);
        let _n = n;
        n = _n.min(f);
        f = _n.max(f);
        var t0 = Math.max(Math.max(n.x, n.y), n.z);
        var t1 = Math.min(Math.min(f.x, f.y), f.z);
        if (t0 > 0 && t0 < t1) {
            return new Hit_1.Hit(this, t0);
        }
        return Hit_2.NoHit;
    }
    getColor(p) {
        return this.material.color;
    }
    getMaterial(p) {
        return this.material;
    }
    getNormal(p) {
        if (p.x < this.min.x + Constants_1.EPS) {
            return new Vector3_1.Vector3(-1, 0, 0);
        }
        else if (p.x > this.max.x - Constants_1.EPS) {
            return new Vector3_1.Vector3(1, 0, 0);
        }
        else if (p.y < this.min.y + Constants_1.EPS) {
            return new Vector3_1.Vector3(0, -1, 0);
        }
        else if (p.y > this.max.y - Constants_1.EPS) {
            return new Vector3_1.Vector3(0, 1, 0);
        }
        else if (p.z < this.min.z + Constants_1.EPS) {
            return new Vector3_1.Vector3(0, 0, -1);
        }
        else if (p.z > this.max.z - Constants_1.EPS) {
            return new Vector3_1.Vector3(0, 0, 1);
        }
        return new Vector3_1.Vector3(0, 1, 0);
    }
    getRandomPoint() {
        var x = this.min.x + Math.random() * (this.max.x - this.min.x);
        var y = this.min.y + Math.random() * (this.max.y - this.min.y);
        var z = this.min.z + Math.random() * (this.max.z - this.min.z);
        return new Vector3_1.Vector3(x, y, z);
    }
}
exports.Cube = Cube;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Material_1 = __webpack_require__(0);
const Material_2 = __webpack_require__(0);
const Color_1 = __webpack_require__(2);
const Texture_1 = __webpack_require__(10);
const Attenuation_1 = __webpack_require__(4);
const DiffuseMaterial_1 = __webpack_require__(45);
const SpecularMaterial_1 = __webpack_require__(46);
const ClearMaterial_1 = __webpack_require__(47);
const GlossyMaterial_1 = __webpack_require__(48);
const LightMaterial_1 = __webpack_require__(28);
class MaterialUtils {
    static fromJson(material) {
        if (!material)
            return null;
        switch (material.type) {
            case Material_2.MaterialType.GENERIC:
                return new Material_1.Material(Color_1.Color.fromJson(material.color), Texture_1.Texture.fromJson(material.texture), Texture_1.Texture.fromJson(material.normalTexture), Texture_1.Texture.fromJson(material.bumpTexture), material.bumpMultiplier, material.emittance, Attenuation_1.Attenuation.fromJson(material.attenuation), material.index, material.gloss, material.tint, material.transparent);
            case Material_2.MaterialType.DIFFUSE:
                return new DiffuseMaterial_1.DiffuseMaterial(Color_1.Color.fromJson(material.color));
            case Material_2.MaterialType.SPECULAR:
                return new SpecularMaterial_1.SpecularMaterial(Color_1.Color.fromJson(material.color), material.index);
            case Material_2.MaterialType.CLEAR:
                return new ClearMaterial_1.ClearMaterial(material.index, material.gloss);
            case Material_2.MaterialType.GLOSSY:
                return new GlossyMaterial_1.GlossyMaterial(Color_1.Color.fromJson(material.color), material.index, material.gloss);
            case Material_2.MaterialType.EMISSIVE:
                return new LightMaterial_1.LightMaterial(Color_1.Color.fromJson(material.color), material.emittance, Attenuation_1.Attenuation.fromJson(material.attenuation));
        }
    }
}
MaterialUtils.debug = true;
exports.MaterialUtils = MaterialUtils;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = __webpack_require__(1);
const Material_1 = __webpack_require__(0);
const Box_1 = __webpack_require__(5);
const Hit_1 = __webpack_require__(3);
const Hit_2 = __webpack_require__(3);
const Shape_1 = __webpack_require__(6);
const MaterialUtils_1 = __webpack_require__(17);
class Sphere {
    constructor(center = new Vector3_1.Vector3(), radius = 1, material = null, box = null) {
        this.center = center;
        this.radius = radius;
        this.material = material;
        this.box = box;
        this.type = Shape_1.ShapeType.SPHERE;
        this.memorySize = Vector3_1.Vector3.SIZE + 3;
        if (!box && center) {
            var min = new Vector3_1.Vector3(center.x - radius, center.y - radius, center.z - radius);
            var max = new Vector3_1.Vector3(center.x + radius, center.y + radius, center.z + radius);
            this.box = new Box_1.Box(min, max);
        }
    }
    directRead(memory, offset) {
        offset = this.center.directRead(memory, offset);
        this.radius = memory[offset++];
        var min = new Vector3_1.Vector3(this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);
        var max = new Vector3_1.Vector3(this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
        this.box = new Box_1.Box(min, max);
        var materialIndex = memory[offset++];
        var material = Material_1.Material.map[materialIndex];
        if (material) {
            this.material = material;
        }
        return offset;
    }
    directWrite(memory, offset) {
        memory[offset++] = this.type;
        offset = this.center.directWrite(memory, offset);
        memory[offset++] = this.radius;
        memory[offset++] = this.material.index;
        return offset;
    }
    read(memory) {
        this.center.read(memory);
        this.radius = memory.readFloat();
        var min = new Vector3_1.Vector3(this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);
        var max = new Vector3_1.Vector3(this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
        this.box = new Box_1.Box(min, max);
        var materialIndex = memory.readInt();
        var material = Material_1.Material.map[materialIndex];
        if (material) {
            this.material = material;
        }
        return memory.position;
    }
    write(memory) {
        memory.writeByte(this.type);
        this.center.write(memory);
        memory.writeFloat(this.radius);
        memory.writeInt(this.material.index);
        return memory.position;
    }
    static fromJson(sphere) {
        return new Sphere(Vector3_1.Vector3.fromJson(sphere.center), sphere.radius, MaterialUtils_1.MaterialUtils.fromJson(sphere.material), Box_1.Box.fromJson(sphere.box));
    }
    static newSphere(center, radius, material) {
        var min = new Vector3_1.Vector3(center.x - radius, center.y - radius, center.z - radius);
        var max = new Vector3_1.Vector3(center.x + radius, center.y + radius, center.z + radius);
        var box = new Box_1.Box(min, max);
        return new Sphere(center, radius, material, box);
    }
    compile() {
    }
    intersect(r) {
        var to = r.origin.sub(this.center);
        var b = to.dot(r.direction);
        var c = to.dot(to) - this.radius * this.radius;
        var d = b * b - c;
        if (d > 0) {
            d = Math.sqrt(d);
            var t1 = -b - d;
            if (t1 > 0) {
                return new Hit_1.Hit(this, t1);
            }
        }
        return Hit_2.NoHit;
    }
    getColor(p) {
        if (this.material.texture == null) {
            return this.material.color;
        }
        var u = Math.atan2(p.z, p.x);
        var v = Math.atan2(p.y, new Vector3_1.Vector3(p.x, 0, p.z).length());
        u = (u + Math.PI) / (2 * Math.PI);
        v = 1 - (v + Math.PI / 2) / Math.PI;
        return this.material.texture.sample(u, v);
    }
    getMaterial(p) {
        return this.material;
    }
    getNormal(p) {
        return p.sub(this.center).normalize();
    }
    getRandomPoint() {
        while (true) {
            var x = Math.random() * 2 - 1;
            var y = Math.random() * 2 - 1;
            var z = Math.random() * 2 - 1;
            var v = new Vector3_1.Vector3(x, y, z);
            if (v.length() <= 1) {
                return v.mulScalar(this.radius).add(this.center);
            }
        }
    }
}
exports.Sphere = Sphere;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Triangle_1 = __webpack_require__(11);
const Matrix4_1 = __webpack_require__(12);
const Vector3_1 = __webpack_require__(1);
const Color_1 = __webpack_require__(2);
const MapUtils_1 = __webpack_require__(7);
const Tree_1 = __webpack_require__(26);
const Box_1 = __webpack_require__(5);
const Shape_1 = __webpack_require__(6);
const SharedTree_1 = __webpack_require__(29);
class Mesh {
    constructor(box = null, triangles = [], tree = null) {
        this.box = box;
        this.triangles = triangles;
        this.tree = tree;
        this.type = Shape_1.ShapeType.MESH;
    }
    get memorySize() {
        if (this.box && this.triangles) {
            return Box_1.Box.SIZE + this.triangles.length * Triangle_1.Triangle.SIZE + 2;
        }
        else {
            throw "Box or Triangles are missing, box:" + this.box + ", triangles:" + this.triangles.length;
        }
    }
    directRead(memory, offset) {
        this.box = new Box_1.Box();
        offset = this.box.directRead(memory, offset);
        var numTriangles = memory[offset++];
        for (var i = 0; i < numTriangles; i++) {
            var triangle = new Triangle_1.Triangle();
            offset = triangle.directRead(memory, offset);
            this.triangles.push(triangle);
        }
        return offset;
    }
    directWrite(memory, offset) {
        memory[offset++] = this.type;
        offset = this.box.directWrite(memory, offset);
        memory[offset++] = this.triangles.length;
        this.triangles.forEach(function (t, index) {
            t.index = index;
            offset = t.directWrite(memory, offset);
        });
        this.tree = SharedTree_1.SharedTree.newTree(this.triangles, this.box);
        return offset;
    }
    read(memory) {
        if (!this.box) {
            this.box = new Box_1.Box();
        }
        this.box.read(memory);
        var numTriangles = memory.readUnsignedInt();
        for (var i = 0; i < numTriangles; i++) {
            var t = new Triangle_1.Triangle();
            t.read(memory);
            this.triangles.push(t);
        }
        this.tree = SharedTree_1.SharedTree.readFromMemory(memory, this.triangles);
        this.tree.box = this.box;
        return memory.position;
    }
    write(memory) {
        memory.writeByte(this.type);
        this.box.write(memory);
        memory.writeUnsignedInt(this.triangles.length);
        this.triangles.forEach(function (t, index) {
            t.index = index;
            t.write(memory);
        });
        SharedTree_1.SharedTree.buildAndWrite(memory, this.triangles);
        return memory.position;
    }
    static fromJson(mesh) {
        return new Mesh(Box_1.Box.fromJson(mesh.box), Triangle_1.Triangle.fromJson(mesh.triangles));
    }
    static newMesh(triangles) {
        var box = Box_1.Box.boxForTriangles(triangles);
        return new Mesh(box, triangles, null);
    }
    compile() {
        var m = this;
        if (m.tree == null) {
            m.tree = Tree_1.Tree.newTree(m.triangles, m.box);
        }
    }
    intersect(r) {
        return this.tree.intersect(r);
    }
    getColor(p) {
        return new Color_1.Color();
    }
    getMaterial(p) {
        return this.material;
    }
    getNormal(p) {
        return new Vector3_1.Vector3();
    }
    getRandomPoint() {
        return new Vector3_1.Vector3();
    }
    updateBox() {
        this.box = Box_1.Box.boxForTriangles(this.triangles);
    }
    _smoothNormalsThreshold(normal, normals, threshold) {
        var result = new Vector3_1.Vector3();
        normals.forEach(function (x) {
            if (x.dot(normal) >= threshold) {
                result = result.add(x);
            }
        });
        return result.normalize();
    }
    smoothNormalsThreshold(radians) {
        var m = this;
        var threshold = Math.cos(radians);
        var lookup = new Map();
        m.triangles.forEach(function (t) {
            lookup[t.v1] = MapUtils_1.append(lookup[t.v1], t.n1);
            lookup[t.v2] = MapUtils_1.append(lookup[t.v2], t.n2);
            lookup[t.v3] = MapUtils_1.append(lookup[t.v3], t.n3);
        });
        m.triangles.forEach(function (t) {
            t.n1 = m._smoothNormalsThreshold(t.n1, lookup[t.v1], threshold);
            t.n2 = m._smoothNormalsThreshold(t.n2, lookup[t.v2], threshold);
            t.n3 = m._smoothNormalsThreshold(t.n3, lookup[t.v3], threshold);
        });
    }
    smoothNormals() {
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
    }
    moveTo(position, anchor) {
        var m = this;
        var matrix = Matrix4_1.Matrix4.translate(position.sub(m.box.anchor(anchor)));
        m.transform(matrix);
    }
    fitInside(box, anchor) {
        var m = this;
        var scale = box.size().div(m.box.size()).minComponent();
        var extra = box.size().sub(m.box.size().mulScalar(scale));
        var matrix = Matrix4_1.Matrix4.identity();
        matrix = matrix.translate(m.box.min.mulScalar(-1));
        matrix = matrix.scale(new Vector3_1.Vector3(scale, scale, scale));
        matrix = matrix.translate(box.min.add(extra.mul(anchor)));
        m.transform(matrix);
    }
    transform(matrix) {
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
    }
}
Mesh.inter = 0;
exports.Mesh = Mesh;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ByteArrayBase {
    constructor(buffer, offset = 0, length = 0) {
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
    get buffer() {
        return this.data.buffer;
    }
    set buffer(value) {
        this.data = new DataView(value);
    }
    get dataView() {
        return this.data;
    }
    set dataView(value) {
        this.data = value;
        this.write_position = value.byteLength;
    }
    get phyPosition() {
        return this._position + this.data.byteOffset;
    }
    get bufferOffset() {
        return this.data.byteOffset;
    }
    get position() {
        return this._position;
    }
    set position(value) {
        if (this._position < value) {
            if (!this.validate(this._position - value)) {
                return;
            }
        }
        this._position = value;
        this.write_position = value > this.write_position ? value : this.write_position;
    }
    get length() {
        return this.write_position;
    }
    set length(value) {
        this.validateBuffer(value);
    }
    get bytesAvailable() {
        return this.data.byteLength - this._position;
    }
    clear() {
        this._position = 0;
    }
    getArray() {
        if (this.array == null) {
            this.array = new Uint8Array(this.data.buffer, this.data.byteOffset, this.data.byteLength);
        }
        return this.array;
    }
    setArray(array) {
        this.array = array;
        this.setBuffer(array.buffer, array.byteOffset, array.byteLength);
    }
    setBuffer(buffer, offset = 0, length = 0) {
        if (buffer) {
            this.data = new DataView(buffer, offset, length > 0 ? length : buffer.byteLength);
            this.write_position = length > 0 ? length : buffer.byteLength;
        }
        else {
            this.write_position = 0;
        }
        this._position = 0;
    }
    readBoolean() {
        if (!this.validate(ByteArrayBase.SIZE_OF_BOOLEAN))
            return null;
        return this.data.getUint8(this.position++) != 0;
    }
    readByte() {
        if (!this.validate(ByteArrayBase.SIZE_OF_INT8))
            return null;
        return this.data.getInt8(this.position++);
    }
    readBytes(_bytes = null, offset = 0, length = 0, createNewBuffer = false) {
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
    }
    readDouble() {
        if (!this.validate(ByteArrayBase.SIZE_OF_FLOAT64))
            return null;
        var value = this.data.getFloat64(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_FLOAT64;
        return value;
    }
    readFloat() {
        if (!this.validate(ByteArrayBase.SIZE_OF_FLOAT32))
            return null;
        var value = this.data.getFloat32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_FLOAT32;
        return value;
    }
    readInt() {
        if (!this.validate(ByteArrayBase.SIZE_OF_INT32))
            return null;
        var value = this.data.getInt32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_INT32;
        return value;
    }
    readMultiByte(length, charSet) {
        if (!this.validate(length))
            return null;
        return "";
    }
    readShort() {
        if (!this.validate(ByteArrayBase.SIZE_OF_INT16))
            return null;
        var value = this.data.getInt16(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_INT16;
        return value;
    }
    readUnsignedByte() {
        if (!this.validate(ByteArrayBase.SIZE_OF_UINT8))
            return null;
        return this.data.getUint8(this.position++);
    }
    readUnsignedInt() {
        if (!this.validate(ByteArrayBase.SIZE_OF_UINT32))
            return null;
        var value = this.data.getUint32(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_UINT32;
        return value;
    }
    readVariableSizedUnsignedInt() {
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
    }
    readU16VX() {
        return (this.readUnsignedByte() << 8) | this.readUnsignedByte();
    }
    readUnsignedShort() {
        if (!this.validate(ByteArrayBase.SIZE_OF_UINT16))
            return null;
        var value = this.data.getUint16(this.position, this.endian == ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_UINT16;
        return value;
    }
    readUTF() {
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
    }
    readUTFBytes(length) {
        if (!this.validate(length))
            return null;
        var _bytes = new Uint8Array(this.buffer, this.bufferOffset + this.position, length);
        this.position += length;
        return this.decodeUTF8(_bytes);
    }
    readStandardString(length) {
        if (!this.validate(length))
            return null;
        var str = "";
        for (var i = 0; i < length; i++) {
            str += String.fromCharCode(this.data.getUint8(this.position++));
        }
        return str;
    }
    readStringTillNull(keepEvenByte = true) {
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
    }
    writeBoolean(value) {
        this.validateBuffer(ByteArrayBase.SIZE_OF_BOOLEAN);
        this.data.setUint8(this.position++, value ? 1 : 0);
    }
    writeByte(value) {
        this.validateBuffer(ByteArrayBase.SIZE_OF_INT8);
        this.data.setInt8(this.position++, value);
    }
    writeUnsignedByte(value) {
        this.validateBuffer(ByteArrayBase.SIZE_OF_UINT8);
        this.data.setUint8(this.position++, value);
    }
    writeBytes(_bytes, offset = 0, length = 0) {
        this.validateBuffer(length);
        var tmp_data = new DataView(_bytes.buffer);
        for (var i = 0; i < _bytes.length; i++) {
            this.data.setUint8(this.position++, tmp_data.getUint8(i));
        }
    }
    writeDouble(value) {
        this.validateBuffer(ByteArrayBase.SIZE_OF_FLOAT64);
        this.data.setFloat64(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_FLOAT64;
    }
    writeFloat(value) {
        this.validateBuffer(ByteArrayBase.SIZE_OF_FLOAT32);
        this.data.setFloat32(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_FLOAT32;
    }
    writeInt(value) {
        this.validateBuffer(ByteArrayBase.SIZE_OF_INT32);
        this.data.setInt32(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_INT32;
    }
    writeMultiByte(value, charSet) {
    }
    writeShort(value) {
        this.validateBuffer(ByteArrayBase.SIZE_OF_INT16);
        this.data.setInt16(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_INT16;
    }
    writeUnsignedShort(value) {
        this.validateBuffer(ByteArrayBase.SIZE_OF_UINT16);
        this.data.setUint16(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_UINT16;
    }
    writeUnsignedInt(value) {
        this.validateBuffer(ByteArrayBase.SIZE_OF_UINT32);
        this.data.setUint32(this.position, value, this.endian == ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_UINT32;
    }
    writeUTF(value) {
        var utf8bytes = this.encodeUTF8(value);
        var length = utf8bytes.length;
        this.validateBuffer(ByteArrayBase.SIZE_OF_UINT16 + length);
        this.data.setUint16(this.position, length, this.endian === ByteArrayBase.LITTLE_ENDIAN);
        this.position += ByteArrayBase.SIZE_OF_UINT16;
        this.writeUint8Array(utf8bytes);
    }
    writeUTFBytes(value) {
        this.writeUint8Array(this.encodeUTF8(value));
    }
    toString() {
        return "[ByteArrayBase] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
    }
    writeUint8Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            this.data.setUint8(this.position++, _bytes[i]);
        }
    }
    writeUint16Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            this.data.setUint16(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
            this.position += ByteArrayBase.SIZE_OF_UINT16;
        }
    }
    writeUint32Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            this.data.setUint32(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
            this.position += ByteArrayBase.SIZE_OF_UINT32;
        }
    }
    writeInt8Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            this.data.setInt8(this.position++, _bytes[i]);
        }
    }
    writeInt16Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            this.data.setInt16(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
            this.position += ByteArrayBase.SIZE_OF_INT16;
        }
    }
    writeInt32Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            this.data.setInt32(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
            this.position += ByteArrayBase.SIZE_OF_INT32;
        }
    }
    writeFloat32Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            this.data.setFloat32(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
            this.position += ByteArrayBase.SIZE_OF_FLOAT32;
        }
    }
    writeFloat64Array(_bytes) {
        this.validateBuffer(this.position + _bytes.length);
        for (var i = 0; i < _bytes.length; i++) {
            this.data.setFloat64(this.position, _bytes[i], this.endian === ByteArrayBase.LITTLE_ENDIAN);
            this.position += ByteArrayBase.SIZE_OF_FLOAT64;
        }
    }
    readUint8Array(length, createNewBuffer = true) {
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
    }
    readUint16Array(length, createNewBuffer = true) {
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
    }
    readUint32Array(length, createNewBuffer = true) {
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
    }
    readInt8Array(length, createNewBuffer = true) {
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
    }
    readInt16Array(length, createNewBuffer = true) {
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
    }
    readInt32Array(length, createNewBuffer = true) {
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
    }
    readFloat32Array(length, createNewBuffer = true) {
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
    }
    readFloat64Array(length, createNewBuffer = true) {
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
    }
    validate(len) {
        if (this.data.byteLength > 0 && this._position + len <= this.data.byteLength) {
            return true;
        }
        else {
            throw 'Error #2030: End of file was encountered.';
        }
    }
    validateBuffer(len) {
        this.write_position = len > this.write_position ? len : this.write_position;
        if (this.data.byteLength < len) {
            var tmp = new Uint8Array(new ArrayBuffer(len + this.BUFFER_EXT_SIZE));
            tmp.set(new Uint8Array(this.data.buffer));
            this.data.buffer = tmp.buffer;
        }
    }
    encodeUTF8(str) {
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
    }
    decodeUTF8(data) {
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
    }
    encoderError(code_point) {
        throw 'EncodingError! The code point ' + code_point + ' could not be encoded.';
    }
    decoderError(fatal, opt_code_point) {
        if (fatal) {
            throw 'DecodingError';
        }
        return opt_code_point || 0xFFFD;
    }
    inRange(a, min, max) {
        return min <= a && a <= max;
    }
    div(n, d) {
        return Math.floor(n / d);
    }
    stringToCodePoints(string) {
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
    }
}
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
exports.ByteArrayBase = ByteArrayBase;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Ray_1 = __webpack_require__(8);
const Shape_1 = __webpack_require__(6);
const Matrix4_1 = __webpack_require__(12);
const HitInfo_1 = __webpack_require__(27);
class TransformedShape {
    constructor(shape = null, matrix = new Matrix4_1.Matrix4(), inverse = new Matrix4_1.Matrix4(), normalMatrix) {
        this.shape = shape;
        this.matrix = matrix;
        this.inverse = inverse;
        this.normalMatrix = normalMatrix;
        this.type = Shape_1.ShapeType.TRANSFORMED_SHAPE;
    }
    get memorySize() {
        if (this.shape) {
            return this.shape.memorySize + Matrix4_1.Matrix4.SIZE + 1;
        }
        else {
            return 0;
        }
    }
    ;
    directRead(memory, offset) {
        offset = this.matrix.directRead(memory, offset);
        this.inverse = this.matrix.inverse();
        var container = [];
        offset = Shape_1.directRestoreShape(memory, offset, container);
        this.shape = container[0];
        container = null;
        return offset;
    }
    directWrite(memory, offset) {
        memory[offset++] = this.type;
        offset = this.matrix.directWrite(memory, offset);
        offset = this.shape.directWrite(memory, offset);
        return offset;
    }
    read(memory) {
        this.matrix.read(memory);
        this.inverse = this.matrix.inverse();
        var container = [];
        Shape_1.restoreShape(memory, container);
        this.shape = container[0];
        container = null;
        return memory.position;
    }
    write(memory) {
        memory.writeByte(this.type);
        this.matrix.write(memory);
        this.shape.write(memory);
        return memory.position;
    }
    static fromJson(transformedShape) {
        return new TransformedShape(Shape_1.ShapefromJson(transformedShape.shape), Matrix4_1.Matrix4.fromJson(transformedShape.matrix), Matrix4_1.Matrix4.fromJson(transformedShape.inverse));
    }
    static newTransformedShape(s, m) {
        return new TransformedShape(s, m, m.inverse());
    }
    get box() {
        return this.matrix.mulBox(this.shape.box);
    }
    compile() {
        this.shape.compile();
    }
    intersect(r) {
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
        var ray = new Ray_1.Ray(position, normal);
        var info = new HitInfo_1.HitInfo(shape, position, normal, ray, color, material, inside);
        hit.T = position.sub(r.origin).length();
        hit.info = info;
        return hit;
    }
    getColor(p) {
        return this.shape.getColor(this.inverse.mulPosition(p));
    }
    getMaterial(p) {
        return this.shape.getMaterial(this.inverse.mulPosition(p));
    }
    getNormal(p) {
        console.log("getNormal");
        return null;
    }
    getRandomPoint() {
        return this.shape.getRandomPoint();
    }
}
exports.TransformedShape = TransformedShape;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ThreeObjects {
}
ThreeObjects.PointLight = "PointLight";
ThreeObjects.Mesh = "Mesh";
ThreeObjects.Group = "Group";
exports.ThreeObjects = ThreeObjects;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __webpack_require__(2);
class CanvasDisplay {
    constructor(i_width = 640, i_height = 480, container) {
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
    attachDom(dom) {
        this.container = dom;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
        this.imageData = this.ctx.getImageData(0, 0, this.i_width, this.i_height);
        this.data = this.imageData.data;
        this.onWindowResize();
    }
    onWindowResize() {
    }
    setResolution(width, height) {
        this.i_width = width;
        this.i_height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.imageData = this.ctx.getImageData(0, 0, this.i_width, this.i_height);
        this.data = this.imageData.data;
    }
    updatePixels(pixels) {
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
    }
    updatePixelsRect(rect, pixels) {
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
    }
    updateIndicator(rect) {
        var color = Color_1.Color.random();
        this.fillRect({ x: rect.xoffset, y: rect.yoffset, width: 4, height: 1 }, color);
        this.fillRect({ x: rect.xoffset, y: rect.yoffset + 1, width: 1, height: 3 }, color);
        this.fillRect({ x: rect.xoffset + rect.width - 4, y: rect.yoffset, width: 4, height: 1 }, color);
        this.fillRect({ x: rect.xoffset + rect.width - 1, y: rect.yoffset + 1, width: 1, height: 3 }, color);
        this.fillRect({ x: rect.xoffset, y: rect.yoffset + rect.height - 4, width: 1, height: 4 }, color);
        this.fillRect({ x: rect.xoffset + 1, y: rect.yoffset + rect.height - 1, width: 3, height: 1 }, color);
        this.fillRect({ x: rect.xoffset + rect.width - 4, y: rect.yoffset + rect.height - 1, width: 4, height: 1 }, color);
        this.fillRect({ x: rect.xoffset + rect.width - 1, y: rect.yoffset + rect.height - 4, width: 1, height: 3 }, color);
        this.ctx.putImageData(this.imageData, 0, 0);
    }
    fillRect(rect, color) {
        for (var y = rect.y; y < rect.y + rect.height; y++) {
            for (var x = rect.x; x < rect.x + rect.width; x++) {
                var i = y * (this.i_width * 4) + (x * 4);
                this.data[i] = color.r * 255;
                this.data[i + 1] = color.g * 255;
                this.data[i + 2] = color.b * 255;
                this.data[i + 3] = 255;
            }
        }
        this.ctx.putImageData(this.imageData, 0, 0);
    }
}
exports.CanvasDisplay = CanvasDisplay;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Vector3_1 = __webpack_require__(1);
const Ray_1 = __webpack_require__(8);
class Camera {
    constructor(p, u, v, w, m, focalDistance, apertureRadius) {
        this.p = p;
        this.u = u;
        this.v = v;
        this.w = w;
        this.m = m;
        this.focalDistance = focalDistance;
        this.apertureRadius = apertureRadius;
    }
    static fromJson(camera) {
        return new Camera(Vector3_1.Vector3.fromJson(camera.p), Vector3_1.Vector3.fromJson(camera.u), Vector3_1.Vector3.fromJson(camera.v), Vector3_1.Vector3.fromJson(camera.w), camera.m, camera.focalDistance, camera.apertureRadius);
    }
    static lookAt(eye, look, up, fov) {
        var c = new Camera();
        c.p = eye;
        c.w = look.sub(eye).normalize();
        c.u = up.cross(c.w).normalize();
        c.v = c.w.cross(c.u).normalize();
        c.m = 1 / Math.tan(fov * Math.PI / 360);
        return c;
    }
    updateFromArray(eye, look, up, fovy, focus, aperture) {
        eye = new Vector3_1.Vector3(eye[0], eye[1], eye[2]);
        look = new Vector3_1.Vector3(look[0], look[1], look[2]);
        up = new Vector3_1.Vector3(up[0], up[1], up[2]);
        var c = this;
        c.p = eye;
        c.w = look.sub(eye).normalize();
        c.u = up.cross(c.w).normalize();
        c.v = c.w.cross(c.u).normalize();
        c.m = 1 / Math.tan(fovy * Math.PI / 360);
        c.focalDistance = focus < 0 ? null : focus;
        c.apertureRadius = aperture < 0 ? null : aperture;
    }
    updateFromJson(prop) {
        this.p.setFromJson(prop.p);
        this.w.setFromJson(prop.w);
        this.u.setFromJson(prop.u);
        this.v.setFromJson(prop.v);
        this.m = prop.m;
        if (prop.focalDistance && prop.apertureRadius) {
            this.focalDistance = prop.focalDistance;
            this.apertureRadius = prop.apertureRadius;
        }
    }
    setFocus(focalPoint, apertureRadius) {
        this.focalDistance = focalPoint.sub(this.p).length();
        this.apertureRadius = apertureRadius;
    }
    castRay(x, y, w, h, u, v) {
        var c = this;
        var aspect = w / h;
        var px = ((x + u - 0.5) / (w - 1)) * 2 - 1;
        var py = ((y + v - 0.5) / (h - 1)) * 2 - 1;
        var d = new Vector3_1.Vector3();
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
        return new Ray_1.Ray(p, d);
    }
    toJSON() {
        return {
            p: this.p,
            w: this.w,
            u: this.u,
            v: this.v,
            m: this.m,
            focalDistance: this.focalDistance,
            apertureRadius: this.apertureRadius
        };
    }
}
Camera.debug = true;
exports.Camera = Camera;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __webpack_require__(2);
const Scene_1 = __webpack_require__(41);
const Material_1 = __webpack_require__(0);
const Shape_1 = __webpack_require__(6);
const SharedTree_1 = __webpack_require__(29);
const Pointer_1 = __webpack_require__(49);
const Box_1 = __webpack_require__(5);
const ThreadPool_1 = __webpack_require__(31);
const Texture_1 = __webpack_require__(10);
class SharedScene extends Scene_1.Scene {
    constructor(color = new Color_1.Color(), shapes = [], lights = [], tree = null, rays = 0) {
        super(color, shapes, lights, tree, rays);
        this.shared = true;
    }
    getMemory() {
        console.time("getMemory");
        Pointer_1.Pointer.init();
        var memory = Pointer_1.Pointer.memory;
        memory.writeByte(0);
        memory.writeByte(0);
        memory.writeByte(0);
        memory.position += ThreadPool_1.ThreadPool.maxThreads;
        Texture_1.Texture.write(memory);
        Material_1.Material.write(memory);
        this.color.write(memory);
        memory.writeUnsignedInt(this.shapes.length);
        this.shapes.forEach(function (shape) {
            shape.write(memory);
        });
        var box = Box_1.Box.boxForShapes(this.shapes);
        box.write(memory);
        SharedTree_1.SharedTree.buildAndWrite(memory, this.shapes);
        console.timeEnd("getMemory");
        return memory;
    }
    static getScene(memory) {
        var scene = new SharedScene();
        memory.position = 0;
        memory.position += 3;
        memory.position += ThreadPool_1.ThreadPool.maxThreads;
        var offset = Texture_1.Texture.restore(memory);
        offset = Material_1.Material.restore(memory);
        scene.color.read(memory);
        var numShapes = memory.readUnsignedInt();
        var shapes = [];
        for (var i = 0; i < numShapes; i++) {
            offset = Shape_1.restoreShape(memory, shapes);
            var shape = shapes[i];
            scene.add(shape);
        }
        var box = new Box_1.Box();
        box.read(memory);
        scene.tree = SharedTree_1.SharedTree.readFromMemory(memory, shapes);
        scene.tree.box = box;
        return scene;
    }
}
exports.SharedScene = SharedScene;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Box_1 = __webpack_require__(5);
const Node_1 = __webpack_require__(42);
const Hit_1 = __webpack_require__(3);
class Tree {
    constructor(box, root) {
        this.box = box;
        this.root = root;
    }
    static newTree(shapes, box = null) {
        console.time("Building k-d tree (" + shapes.length + " shapes)... ");
        box = box ? box : Box_1.Box.boxForShapes(shapes);
        var node = Node_1.Node.newNode(shapes);
        node.split(0);
        console.timeEnd("Building k-d tree (" + shapes.length + " shapes)... ");
        return new Tree(box, node);
    }
    intersect(r) {
        var t = this.box.intersect(r);
        if (t.max < t.min || t.max <= 0) {
            return Hit_1.NoHit;
        }
        return this.root.intersect(r, t.min, t.max);
    }
}
exports.Tree = Tree;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class HitInfo {
    constructor(shape, position, normal, ray, color, material, inside) {
        this.shape = shape;
        this.position = position;
        this.normal = normal;
        this.ray = ray;
        this.color = color;
        this.material = material;
        this.inside = inside;
    }
}
exports.HitInfo = HitInfo;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Material_1 = __webpack_require__(0);
const Material_2 = __webpack_require__(0);
class LightMaterial extends Material_1.Material {
    constructor(color, emittance, attenuation) {
        super(color, null, null, null, 1, emittance, attenuation, 1, 0, 0, false);
        this.type = Material_2.MaterialType.EMISSIVE;
    }
}
exports.LightMaterial = LightMaterial;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Box_1 = __webpack_require__(5);
const Hit_1 = __webpack_require__(3);
const SharedNode_1 = __webpack_require__(30);
const ByteArrayBase_1 = __webpack_require__(20);
const SharedNode_2 = __webpack_require__(30);
class SharedTree {
    constructor(box, root) {
        this.box = box;
        this.root = root;
    }
    static newTree(shapes, box = null) {
        console.time("Building k-d tree (" + shapes.length + " shapes)... ");
        box = box ? box : Box_1.Box.boxForShapes(shapes);
        var node = SharedNode_1.SharedNode.newNode(shapes);
        node.split(0);
        console.timeEnd("Building k-d tree (" + shapes.length + " shapes)... ");
        return new SharedTree(box, node);
    }
    intersect(r) {
        var t = this.box.intersect(r);
        if (t.max < t.min || t.max <= 0) {
            return Hit_1.NoHit;
        }
        return this.root.intersect(r, t.min, t.max);
    }
    static fromJson(tree, mesh) {
        var box = Box_1.Box.fromJson(tree.box);
        var node = SharedNode_1.SharedNode.fromJson(tree.root);
        node.mesh = mesh;
        return new SharedTree(box, node);
    }
    static readFromMemory(memory, shapes) {
        var node = new SharedNode_1.SharedNode();
        node.shapes = shapes;
        node.readRoot(memory);
        return new SharedTree(null, node);
    }
    static buildAndWrite(memory, shapes) {
        var startPosition = memory.position;
        var endPosition;
        memory.position += ByteArrayBase_1.ByteArrayBase.SIZE_OF_UINT32;
        var node = SharedNode_1.SharedNode.newNode(shapes, memory);
        memory.writeUnsignedInt(SharedNode_2.NodeMarker.ROOT);
        node.split(0);
        endPosition = memory.position;
        memory.position = startPosition;
        memory.writeUnsignedInt(endPosition - startPosition);
        memory.position = endPosition;
        return memory.position;
    }
}
exports.SharedTree = SharedTree;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Axis_1 = __webpack_require__(14);
const Hit_1 = __webpack_require__(3);
const MapUtils_1 = __webpack_require__(7);
const MapUtils_2 = __webpack_require__(7);
const MathUtils_1 = __webpack_require__(15);
const ByteArrayBase_1 = __webpack_require__(20);
const DirectMemory_1 = __webpack_require__(13);
var NodeMarker;
(function (NodeMarker) {
    NodeMarker[NodeMarker["ROOT"] = 1118481] = "ROOT";
    NodeMarker[NodeMarker["LEFT"] = 15597585] = "LEFT";
    NodeMarker[NodeMarker["RIGHT"] = 1114350] = "RIGHT";
    NodeMarker[NodeMarker["LEAF"] = 15597806] = "LEAF";
    NodeMarker[NodeMarker["EON"] = 14737632] = "EON";
    NodeMarker[NodeMarker["NULL"] = 15658734] = "NULL";
})(NodeMarker = exports.NodeMarker || (exports.NodeMarker = {}));
class SharedNode {
    constructor(axis = null, point = null, shapes = null, shapeIndices = null, _left = null, _right = null) {
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
    get left() {
        if (!this._left) {
            this.readChild(this.memory, NodeMarker.LEFT);
        }
        return this._left;
    }
    set left(value) {
        this._left = value;
    }
    get right() {
        if (!this._right) {
            this.readChild(this.memory, NodeMarker.RIGHT);
        }
        return this._right;
    }
    set right(value) {
        this._right = value;
    }
    readRoot(memory) {
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
    }
    read(memory) {
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
    }
    readChild(memory, marker) {
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
    }
    static newNode(shapes, memory) {
        var node = new SharedNode(Axis_1.Axis.AxisNone, 0, shapes, [], null, null);
        node.memory = memory;
        return node;
    }
    static fromJson(node) {
        return new SharedNode(node.axis, node.point, null, node.shapeIndices, node.left, node.right);
    }
    intersect(r, tmin, tmax) {
        var node = this;
        var tsplit;
        var leftFirst;
        switch (node.axis) {
            case Axis_1.Axis.AxisNone:
                return this.intersectShapes(node, r);
            case Axis_1.Axis.AxisX:
                tsplit = (node.point - r.origin.x) / r.direction.x;
                leftFirst = (r.origin.x < node.point) || (r.origin.x == node.point && r.direction.x <= 0);
                break;
            case Axis_1.Axis.AxisY:
                tsplit = (node.point - r.origin.y) / r.direction.y;
                leftFirst = (r.origin.y < node.point) || (r.origin.y == node.point && r.direction.y <= 0);
                break;
            case Axis_1.Axis.AxisZ:
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
    }
    intersectNode(node, r, tmin, tmax) {
        var tsplit;
        var leftFirst;
        switch (node.axis) {
            case Axis_1.Axis.AxisNone:
                return this.intersectShapes(node, r);
            case Axis_1.Axis.AxisX:
                tsplit = (node.point - r.origin.x) / r.direction.x;
                leftFirst = (r.origin.x < node.point) || (r.origin.x == node.point && r.direction.x <= 0);
                break;
            case Axis_1.Axis.AxisY:
                tsplit = (node.point - r.origin.y) / r.direction.y;
                leftFirst = (r.origin.y < node.point) || (r.origin.y == node.point && r.direction.y <= 0);
                break;
            case Axis_1.Axis.AxisZ:
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
    }
    intersectShapes(node, r) {
        var hit = Hit_1.NoHit;
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
    }
    partitionScore(axis, point) {
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
    }
    partition(size, axis, point) {
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
    }
    split(depth) {
        var node = this;
        if (node.shapes.length < 8) {
            var self = this;
            this.memory.position -= DirectMemory_1.DirectMemory.SIZE_OF_UINT32;
            this.memory.writeUnsignedInt(NodeMarker.LEAF);
            this.memory.writeByte(Axis_1.Axis.AxisNone);
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
        var mx = MathUtils_1.MathUtils.median(xs);
        var my = MathUtils_1.MathUtils.median(ys);
        var mz = MathUtils_1.MathUtils.median(zs);
        var best = Math.round(node.shapes.length * 0.85);
        var bestAxis = Axis_1.Axis.AxisNone;
        var bestPoint = 0.0;
        var sx = node.partitionScore(Axis_1.Axis.AxisX, mx);
        if (sx < best) {
            best = sx;
            bestAxis = Axis_1.Axis.AxisX;
            bestPoint = mx;
        }
        var sy = node.partitionScore(Axis_1.Axis.AxisY, my);
        if (sy < best) {
            best = sy;
            bestAxis = Axis_1.Axis.AxisY;
            bestPoint = my;
        }
        var sz = node.partitionScore(Axis_1.Axis.AxisZ, mz);
        if (sz < best) {
            best = sz;
            bestAxis = Axis_1.Axis.AxisZ;
            bestPoint = mz;
        }
        if (bestAxis == Axis_1.Axis.AxisNone) {
            var shapes = node.shapes;
            var shapeIndices = [];
            let self = this;
            if (this.memory) {
                this.memory.position -= DirectMemory_1.DirectMemory.SIZE_OF_UINT32;
                this.memory.writeUnsignedInt(NodeMarker.LEAF);
                this.memory.writeByte(bestAxis);
                this.memory.writeFloat(bestPoint);
                this.memory.writeUnsignedInt(shapes.length);
            }
            shapes.forEach(function (shape) {
                shapeIndices.push(shape.index);
                if (self.memory) {
                    self.memory.writeUnsignedInt(shape.index);
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
            var leftStartPosition = this.memory.position + (2 * ByteArrayBase_1.ByteArrayBase.SIZE_OF_UINT32);
            this.memory.writeUnsignedInt(leftStartPosition);
            var rightLengthPosition = this.memory.position;
            this.memory.position += ByteArrayBase_1.ByteArrayBase.SIZE_OF_UINT32;
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
    }
}
SharedNode.map = [];
exports.SharedNode = SharedNode;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Thread_1 = __webpack_require__(50);
class ThreadPool {
    static get maxThreads() {
        return navigator["hardwareConcurrency"] - 4 || 2;
    }
    ;
    static getThreads() {
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
    }
}
exports.ThreadPool = ThreadPool;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class TraceJob {
    constructor(param, extra = {}) {
        this.param = param;
        this.extra = extra;
        this.runCount = 0;
        this.id = param.id;
        this.finished = false;
    }
    get lifeCount() {
        return this._lifeCount;
    }
    get time() {
        return this._time;
    }
    start(thread, onComplete) {
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
    }
    getTraceParam() {
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
    }
}
TraceJob.INIT = "INIT";
TraceJob.INITED = "INITED";
TraceJob.TRACE = "TRACE";
TraceJob.TRACED = "TRACED";
TraceJob.TERMINATE = "TERMINATE";
TraceJob.LOCKED = "LOCKED";
exports.TraceJob = TraceJob;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const ThreadPool_1 = __webpack_require__(31);
class TraceJobManager {
    constructor() {
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
    get initialized() {
        return this._initialized;
    }
    get isAllLocked() {
        for (var i = 0; i < this.totalThreads; i++) {
            if (this.flags[3 + i] !== 3 && this.flags[3 + i] !== 0) {
                return false;
            }
        }
        return true;
    }
    get finished() {
        return this._finished;
    }
    get pixels() {
        return this.pixelMemory;
    }
    configure(param, scene) {
        console.log("configure");
        this.width = param.width;
        this.height = param.height;
        console.log("Checkpoint #1");
        try {
            this.sceneMemory = scene.getMemory();
        }
        catch (e) {
            console.log(e);
        }
        console.log("Checkpoint #2");
        this.flags = new Uint8Array(this.sceneMemory.data.buffer, 0, 3 + ThreadPool_1.ThreadPool.maxThreads);
        TraceJobManager.flags = this.flags;
        this.pixelMemory = new Uint8Array(new SharedArrayBuffer(this.width * this.height * 3));
        this.sampleMemory = new Float32Array(new SharedArrayBuffer(4 * this.width * this.height * 3));
        console.log("Checkpoint #3");
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
    }
    add(job) {
        this.queue.push(job);
        this.referenceQueue.push(job);
    }
    init(callback) {
        console.log("Initializing threads...");
        console.time("init");
        this.threads = ThreadPool_1.ThreadPool.getThreads();
        console.log("Checkpoint #4");
        this.totalThreads = this.threads.length;
        this.lockCount = this.threads.length;
        this.initNext(callback);
        console.log("Checkpoint #5");
    }
    initNext(callback) {
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
    }
    onThreadLocked() {
        this.lockCount++;
        if (this.isAllLocked && this.deferredStart) {
            this.deferredStart = false;
            this.clear();
            this.restart();
        }
        console.log("lockCount:" + this.lockCount);
    }
    lockAllThreads() {
        for (var i = 0; i < this.threads.length; i++) {
            var thread = this.threads[i];
            if (thread.isTracing) {
                this.flags[3 + i] = 2;
            }
            else {
                this.flags[3 + i] = 0;
            }
        }
    }
    stop() {
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
    }
    clear() {
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
    }
    restart() {
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
    }
    get isAllThreadsFree() {
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
    }
    start() {
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
    }
    processQueue(job, thread) {
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
            if (this.updateIndicator) {
                this.updateIndicator(job.param);
            }
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
    }
    initDeferredQueue() {
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
    }
}
exports.TraceJobManager = TraceJobManager;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TraceJobManager_1 = __webpack_require__(33);
const TraceJob_1 = __webpack_require__(32);
class SmartBucketRenderer {
    constructor() {
        this.bucketSize = 64 / 2;
        this.traceManager = new TraceJobManager_1.TraceJobManager();
    }
    get initialized() {
        return this.traceManager.initialized;
    }
    get iterations() {
        return this.traceManager.iterations;
    }
    updateCameraSamples(newValue) {
        this.traceManager.queue.forEach(function (job) {
            job.extra.cameraSamples = newValue;
        });
    }
    updateHitSamples(newValue) {
        this.traceManager.queue.forEach(function (job) {
            job.extra.hitSamples = newValue;
        });
    }
    updateCamera(newValue) {
        this.traceManager.stop();
        this.traceManager.clear();
        this.traceManager.referenceQueue.forEach(function (job) {
            job.extra.camera = newValue;
        });
        this.traceManager.restart();
    }
    render(scene, camera, width, height, cameraSamples, hitSamples, bounces, iterations = 1, blockIterations = 1, onUpdate, updateIndicator, onInit) {
        if (!this.traceManager) {
            this.traceManager = new TraceJobManager_1.TraceJobManager();
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
                this.traceManager.add(new TraceJob_1.TraceJob({
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
        this.traceManager.updateIndicator = updateIndicator;
        this.traceManager.init(onInit);
        return this.traceManager.pixels;
    }
}
SmartBucketRenderer.DEBUG = false;
SmartBucketRenderer.interval = 0;
exports.SmartBucketRenderer = SmartBucketRenderer;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const CanvasDisplay_1 = __webpack_require__(23);
const SmartBucketRenderer_1 = __webpack_require__(34);
class GIRenderBase extends CanvasDisplay_1.CanvasDisplay {
    constructor(i_width, i_height, container) {
        super(i_width, i_height, container);
        this.renderer = new SmartBucketRenderer_1.SmartBucketRenderer();
    }
    updateCameraSamples(newValue) {
        if (this.cameraSamples != newValue) {
            this.cameraSamples = newValue;
            this.renderer.updateCameraSamples(newValue);
        }
    }
    updateHitSamples(newValue) {
        if (this.hitSamples != newValue) {
            this.hitSamples = newValue;
            this.renderer.updateHitSamples(newValue);
        }
    }
    updateCamera(newValue) {
        this.camera.updateFromArray(newValue.eye, newValue.lookAt, newValue.up, newValue.fov, newValue.focus, newValue.aperture);
        this.renderer.updateCamera(this.camera.toJSON());
    }
    updateCameraMatrix(matrix) {
        this.camera.u.setFromArray(matrix, 0);
        this.camera.v.setFromArray(matrix, 4);
        this.camera.w.setFromArray(matrix, 8);
        this.renderer.updateCamera(this.camera.toJSON());
    }
    toggleTrace(newValue) {
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
    }
    render(onInit) {
        console.info("+ Render settings");
        console.info("      Resolution          :   " + this.i_width + "x" + this.i_height);
        console.info("      CameraSamples       :   " + this.cameraSamples);
        console.info("      HitSamples          :   " + this.hitSamples);
        console.info("      Bounces             :   " + this.bounces);
        console.info("      Iterations          :   " + this.iterations);
        console.info("      Block-Iterations    :   " + this.blockIterations);
        var self = this;
        this.pixels = this.renderer.render(this.scene, this.camera, this.i_width, this.i_height, this.cameraSamples, this.hitSamples, this.bounces, this.iterations, this.blockIterations, onUpdate, updateIndicator, onInit);
        function onUpdate(rect) {
            self.updatePixelsRect(rect, self.pixels);
        }
        function updateIndicator(rect) {
            self.updateIndicator(rect);
        }
    }
}
exports.GIRenderBase = GIRenderBase;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(37));
__export(__webpack_require__(22));
__export(__webpack_require__(23));
__export(__webpack_require__(38));
__export(__webpack_require__(35));
__export(__webpack_require__(51));
__export(__webpack_require__(52));


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class XRayClient {
}
exports.XRayClient = XRayClient;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __webpack_require__(2);
const Camera_1 = __webpack_require__(24);
const SharedScene_1 = __webpack_require__(25);
const Vector3_1 = __webpack_require__(1);
const SmartBucketRenderer_1 = __webpack_require__(34);
class HeadlessRenderBase {
    constructor(i_width, i_height, outmemory) {
        this.i_width = i_width;
        this.i_height = i_height;
        this.outmemory = outmemory;
        this.data = new Uint8Array(i_width * i_height * 4);
        this.scene = new SharedScene_1.SharedScene(Color_1.Color.hexColor(0x262626));
        this.camera = Camera_1.Camera.lookAt(new Vector3_1.Vector3(0, 0, 0), new Vector3_1.Vector3(0, 0, 0), new Vector3_1.Vector3(0, 1, 0), 45);
        this.cameraSamples = -1;
        this.hitSamples = 1;
        this.bounces = 4;
        this.iterations = 1000000;
        this.blockIterations = 1;
        this.renderer = new SmartBucketRenderer_1.SmartBucketRenderer();
    }
    updateCameraSamples(newValue) {
        if (this.cameraSamples != newValue) {
            this.cameraSamples = newValue;
            this.renderer.updateCameraSamples(newValue);
        }
    }
    updateHitSamples(newValue) {
        if (this.hitSamples != newValue) {
            this.hitSamples = newValue;
            this.renderer.updateHitSamples(newValue);
        }
    }
    updateCamera(newValue) {
        this.camera.updateFromArray(newValue.eye, newValue.lookAt, newValue.up, newValue.fov, newValue.focus, newValue.aperture);
        this.renderer.updateCamera(this.camera.toJSON());
    }
    updateCameraMatrix(matrix) {
        this.camera.u.setFromArray(matrix, 0);
        this.camera.v.setFromArray(matrix, 4);
        this.camera.w.setFromArray(matrix, 8);
        this.renderer.updateCamera(this.camera.toJSON());
    }
    toggleTrace(newValue) {
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
    }
    render(onInit, onUpdate) {
        console.info("+ Render settings");
        console.info("      Resolution          :   " + this.i_width + "x" + this.i_height);
        console.info("      CameraSamples       :   " + this.cameraSamples);
        console.info("      HitSamples          :   " + this.hitSamples);
        console.info("      Bounces             :   " + this.bounces);
        console.info("      Iterations          :   " + this.iterations);
        console.info("      Block-Iterations    :   " + this.blockIterations);
        var self = this;
        this.pixels = this.renderer.render(this.scene, this.camera, this.i_width, this.i_height, this.cameraSamples, this.hitSamples, this.bounces, this.iterations, this.blockIterations, _onUpdate, onInit);
        function _onUpdate(rect) {
            if (onUpdate) {
                onUpdate(rect, self.pixels);
            }
        }
    }
    setResolution(width, height) {
        this.i_width = width;
        this.i_height = height;
        this.data = new Uint8Array(width * height * 4);
    }
    updatePixels(pixels) {
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
    }
}
exports.HeadlessRenderBase = HeadlessRenderBase;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class MemoryUtils {
    static readUint16(memory, offset, littleEndian = false) {
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
    }
    static writeUint16(memory, offset, value, littleEndian = false) {
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
    }
    static readInt16(memory, offset, littleEndian = false) {
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
    }
    static writeInt16(memory, offset, value, littleEndian = false) {
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
    }
    static readInt32(memory, offset, littleEndian = false) {
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
    }
    static writeInt32(memory, offset, value, littleEndian = false) {
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
    }
    static readUint32(memory, offset, littleEndian = false) {
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
    }
    static writeUint32(memory, offset, value, littleEndian = false) {
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
    }
    static readFloat32(memory, offset, littleEndian = false) {
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
    }
    static writeFloat32(memory, offset, value, littleEndian = false) {
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
    }
    static readFloat64(memory, offset, littleEndian = false) {
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
    }
    static writeFloat64(memory, offset, value, littleEndian = false) {
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
    }
}
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
exports.MemoryUtils = MemoryUtils;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class UTF8 {
    constructor() {
        this.EOF_byte = -1;
        this.EOF_code_point = -1;
    }
    static encode(str) {
        if (str) {
            if (!UTF8.instance) {
                UTF8.instance = new UTF8();
            }
            return UTF8.instance.encode(str);
        }
        return null;
    }
    static decode(data) {
        if (data) {
            if (!UTF8.instance) {
                UTF8.instance = new UTF8();
            }
            return UTF8.instance.decode(data);
        }
        return null;
    }
    encode(str) {
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
    }
    decode(data) {
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
    }
    encoderError(code_point) {
        throw 'EncodingError! The code point ' + code_point + ' could not be encoded.';
    }
    decoderError(fatal, opt_code_point) {
        if (fatal) {
            throw 'DecodingError';
        }
        return opt_code_point || 0xFFFD;
    }
    inRange(a, min, max) {
        return min <= a && a <= max;
    }
    div(n, d) {
        return Math.floor(n / d);
    }
    stringToCodePoints(string) {
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
    }
}
exports.UTF8 = UTF8;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = __webpack_require__(2);
const Tree_1 = __webpack_require__(26);
const MapUtils_1 = __webpack_require__(7);
const Vector3_1 = __webpack_require__(1);
const Ray_1 = __webpack_require__(8);
const Shape_1 = __webpack_require__(6);
const Cube_1 = __webpack_require__(16);
const Sphere_1 = __webpack_require__(18);
const Mesh_1 = __webpack_require__(19);
const TransformedShape_1 = __webpack_require__(21);
const Triangle_1 = __webpack_require__(11);
class Scene {
    constructor(color = new Color_1.Color(), shapes = [], lights = [], tree = null, rays = 0) {
        this.color = color;
        this.shapes = shapes;
        this.lights = lights;
        this.tree = tree;
        this.rays = rays;
        this.shared = false;
    }
    get estimatedMemory() {
        var size = Color_1.Color.SIZE + 1;
        this.shapes.forEach(function (shape) {
            size += shape.memorySize;
        });
        return size;
    }
    static fromJson(scene) {
        var _scene = new Scene(Color_1.Color.fromJson(scene.color));
        scene.shapes.forEach(function (shape) {
            switch (shape.type) {
                case Shape_1.ShapeType.CUBE:
                    _scene.add(Cube_1.Cube.fromJson(shape));
                    break;
                case Shape_1.ShapeType.SPHERE:
                    _scene.add(Sphere_1.Sphere.fromJson(shape));
                    break;
                case Shape_1.ShapeType.MESH:
                    _scene.add(Mesh_1.Mesh.fromJson(shape));
                    break;
                case Shape_1.ShapeType.TRANSFORMED_SHAPE:
                    _scene.add(TransformedShape_1.TransformedShape.fromJson(shape));
                    break;
                case Shape_1.ShapeType.TRIANGLE:
                    _scene.add(Triangle_1.Triangle.fromJson(shape));
                    break;
            }
        });
        return _scene;
    }
    compile() {
        this.shapes.forEach(function (shape) {
            shape.compile();
        });
        if (this.tree == null) {
            this.tree = Tree_1.Tree.newTree(this.shapes);
        }
        return this;
    }
    add(shape) {
        this.shapes = MapUtils_1.append(this.shapes, shape);
        shape.index = this.shapes.length - 1;
        var mat = shape.getMaterial(new Vector3_1.Vector3());
        if (mat && mat.emittance > 0) {
            this.lights = MapUtils_1.append(this.lights, shape);
        }
    }
    rayCount() {
        return this.rays;
    }
    intersect(r) {
        this.rays++;
        return this.tree.intersect(r);
    }
    shadow(r, light, max) {
        var hit = this.intersect(r);
        return hit.shape != light && hit.T < max;
    }
    directLight(n) {
        if (this.lights.length == 0) {
            return new Color_1.Color();
        }
        var color = new Color_1.Color();
        var self = this;
        var i = 0;
        var light;
        for (; i < this.lights.length; i++) {
            light = this.lights[i];
            var p = light.getRandomPoint();
            var d = p.sub(n.origin);
            var lr = new Ray_1.Ray(n.origin, d.normalize());
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
    }
    sample(r, emission, samples, depth) {
        if (depth < 0) {
            return new Color_1.Color(0, 0, 0);
        }
        var hit = this.intersect(r);
        if (!hit.ok()) {
            return this.color;
        }
        var info = hit.getInfo(r);
        var result = new Color_1.Color();
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
    }
}
Scene.interval = 0;
exports.Scene = Scene;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Axis_1 = __webpack_require__(14);
const Hit_1 = __webpack_require__(3);
const MapUtils_1 = __webpack_require__(7);
const MapUtils_2 = __webpack_require__(7);
const MathUtils_1 = __webpack_require__(15);
class Node {
    constructor(axis, point, shapes, left, right) {
        this.axis = axis;
        this.point = point;
        this.shapes = shapes;
        this.left = left;
        this.right = right;
        this.index = Node.map.push(this) - 1;
    }
    static newNode(shapes) {
        return new Node(Axis_1.Axis.AxisNone, 0, shapes, null, null);
    }
    intersect(r, tmin, tmax) {
        var node = this;
        var tsplit;
        var leftFirst;
        switch (node.axis) {
            case Axis_1.Axis.AxisNone:
                return node.intersectShapes(r);
            case Axis_1.Axis.AxisX:
                tsplit = (node.point - r.origin.x) / r.direction.x;
                leftFirst = (r.origin.x < node.point) || (r.origin.x == node.point && r.direction.x <= 0);
                break;
            case Axis_1.Axis.AxisY:
                tsplit = (node.point - r.origin.y) / r.direction.y;
                leftFirst = (r.origin.y < node.point) || (r.origin.y == node.point && r.direction.y <= 0);
                break;
            case Axis_1.Axis.AxisZ:
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
    }
    intersectShapes(r) {
        var node = this;
        var hit = Hit_1.NoHit;
        node.shapes.forEach(function (shape) {
            var h = shape.intersect(r);
            if (h.T < hit.T) {
                hit = h;
            }
        });
        return hit;
    }
    partitionScore(axis, point) {
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
    }
    partition(size, axis, point) {
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
    }
    split(depth) {
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
        var mx = MathUtils_1.MathUtils.median(xs);
        var my = MathUtils_1.MathUtils.median(ys);
        var mz = MathUtils_1.MathUtils.median(zs);
        var best = Math.round(node.shapes.length * 0.85);
        var bestAxis = Axis_1.Axis.AxisNone;
        var bestPoint = 0.0;
        var sx = node.partitionScore(Axis_1.Axis.AxisX, mx);
        if (sx < best) {
            best = sx;
            bestAxis = Axis_1.Axis.AxisX;
            bestPoint = mx;
        }
        var sy = node.partitionScore(Axis_1.Axis.AxisY, my);
        if (sy < best) {
            best = sy;
            bestAxis = Axis_1.Axis.AxisY;
            bestPoint = my;
        }
        var sz = node.partitionScore(Axis_1.Axis.AxisZ, mz);
        if (sz < best) {
            best = sz;
            bestAxis = Axis_1.Axis.AxisZ;
            bestPoint = mz;
        }
        if (bestAxis == Axis_1.Axis.AxisNone) {
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
    }
}
Node.map = [];
exports.Node = Node;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DataCache_1 = __webpack_require__(44);
class ImageLoader {
    constructor() {
    }
    load(url, onLoad, onProgress, onError) {
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
    }
}
ImageLoader.crossOrigin = "*";
exports.ImageLoader = ImageLoader;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class DataCache {
    static getItem(url) {
        return DataCache.cache.get(url);
    }
    static add(url, item) {
        DataCache.cache.set(url, item);
        return item;
    }
}
DataCache.cache = new Map();
exports.DataCache = DataCache;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Material_1 = __webpack_require__(0);
const Attenuation_1 = __webpack_require__(4);
const Material_2 = __webpack_require__(0);
class DiffuseMaterial extends Material_1.Material {
    constructor(color) {
        super(color, null, null, null, 1, 0, Attenuation_1.NoAttenuation, 1, 0, 0, false);
        this.type = Material_2.MaterialType.DIFFUSE;
    }
}
exports.DiffuseMaterial = DiffuseMaterial;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Material_1 = __webpack_require__(0);
const Attenuation_1 = __webpack_require__(4);
const Material_2 = __webpack_require__(0);
class SpecularMaterial extends Material_1.Material {
    constructor(color, index) {
        super(color, null, null, null, 1, 0, Attenuation_1.NoAttenuation, index, 0, 0, false);
        this.type = Material_2.MaterialType.SPECULAR;
    }
}
exports.SpecularMaterial = SpecularMaterial;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Material_1 = __webpack_require__(0);
const Color_1 = __webpack_require__(2);
const Attenuation_1 = __webpack_require__(4);
const Material_2 = __webpack_require__(0);
class ClearMaterial extends Material_1.Material {
    constructor(index, gloss) {
        super(new Color_1.Color(), null, null, null, 1, 0, Attenuation_1.NoAttenuation, index, gloss, 0, true);
        this.type = Material_2.MaterialType.CLEAR;
    }
}
exports.ClearMaterial = ClearMaterial;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Material_1 = __webpack_require__(0);
const Attenuation_1 = __webpack_require__(4);
const Material_2 = __webpack_require__(0);
class GlossyMaterial extends Material_1.Material {
    constructor(color, index, gloss) {
        super(color, null, null, null, 1, 0, Attenuation_1.NoAttenuation, index, gloss, 0, false);
        this.type = Material_2.MaterialType.GLOSSY;
    }
}
exports.GlossyMaterial = GlossyMaterial;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const DirectMemory_1 = __webpack_require__(13);
class Pointer {
    constructor(reference) {
        this.reference = reference;
        if (!Pointer.heap) {
            Pointer.init();
        }
        this.beginLocation = Pointer.offset;
        this.currentLocation = Pointer.offset;
        Pointer.offset = reference.write(Pointer.memory);
    }
    static init() {
        if (Pointer.initialized) {
            return;
        }
        var maxMemory = 64 * 1024 * 1024;
        Pointer.heap = new Uint8Array(new SharedArrayBuffer(maxMemory));
        Pointer.memory = new DirectMemory_1.DirectMemory(Pointer.heap.buffer);
        Pointer.initialized = true;
        return Pointer.memory;
    }
    read() {
        Pointer.offset = this.reference.read(Pointer.memory);
        return this.reference;
    }
}
exports.Pointer = Pointer;
function sizeof(ptr) {
    return ptr.memorySize;
}
exports.sizeof = sizeof;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const TraceJob_1 = __webpack_require__(32);
const TraceJobManager_1 = __webpack_require__(33);
class Thread {
    constructor(name, id) {
        this.id = id;
        console.log("Checkpoint #4.1");
        try {
            this.instance = new Worker(Thread.workerUrl);
        }
        catch (e) {
            console.log(e);
        }
        this.instance.onmessage = this.onMessageReceived.bind(this);
    }
    get isTracing() {
        return this._isTracing;
    }
    onMessageReceived(event) {
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
    }
    init(param, transferable, onInit) {
        console.log("Initializing thread " + this.id);
        this.onInitComplete = onInit;
        param.command = TraceJob_1.TraceJob.INIT;
        param.id = this.id;
        this.send(param, transferable);
    }
    trace(param, onComplete) {
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
    }
    send(data, buffers) {
        this.instance.postMessage(data, buffers);
    }
    terminate() {
    }
}
Thread.workerUrl = "../workers/trace-worker-bootstrap.js";
exports.Thread = Thread;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ThreeJSView {
    constructor(width, height, container, appContainer) {
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
        this.controls.addEventListener('change', () => {
            this.render();
            if (this.onCameraChange) {
                this.onCameraChange(this.camera);
            }
        });
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
exports.ThreeJSView = ThreeJSView;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const GIRenderBase_1 = __webpack_require__(35);
const Color_1 = __webpack_require__(2);
const Camera_1 = __webpack_require__(24);
const SharedScene_1 = __webpack_require__(25);
const Cube_1 = __webpack_require__(16);
const Vector3_1 = __webpack_require__(1);
const Sphere_1 = __webpack_require__(18);
const LightMaterial_1 = __webpack_require__(28);
const ThreeObjects_1 = __webpack_require__(22);
const Mesh_1 = __webpack_require__(19);
const Triangle_1 = __webpack_require__(11);
const Material_1 = __webpack_require__(0);
const TransformedShape_1 = __webpack_require__(21);
const Attenuation_1 = __webpack_require__(4);
const Attenuation_2 = __webpack_require__(4);
const Matrix4_1 = __webpack_require__(12);
const Texture_1 = __webpack_require__(10);
class GIJSView extends GIRenderBase_1.GIRenderBase {
    constructor(width, height, container) {
        super(width, height, container);
        this.width = width;
        this.height = height;
        this.container = container;
        this.identityMatrix = new THREE.Matrix4().identity();
        this.scene = new SharedScene_1.SharedScene(Color_1.Color.hexColor(0x262626));
        this.camera = Camera_1.Camera.lookAt(new Vector3_1.Vector3(0, 0, 0), new Vector3_1.Vector3(0, 0, 0), new Vector3_1.Vector3(0, 1, 0), 45);
        this.cameraSamples = -1;
        this.hitSamples = 1;
        this.bounces = 4;
        this.iterations = 1000000;
        this.blockIterations = 1;
    }
    setThreeJSScene(scene, onInit) {
        this.loadChildren(scene);
        this.render(onInit);
    }
    loadChildren(parent) {
        var child;
        for (var i = 0; i < parent.children.length; i++) {
            child = parent.children[i];
            var obj = this.buildSceneObject(child);
            if (obj) {
                this.scene.add(obj);
            }
            if (obj) {
                if (!(obj.getMaterial(new Vector3_1.Vector3()) instanceof LightMaterial_1.LightMaterial) && child.children.length > 0) {
                    this.loadChildren(child);
                }
            }
            else {
                if (child.children.length > 0) {
                    this.loadChildren(child);
                }
            }
        }
    }
    buildSceneObject(src) {
        switch (src.type) {
            case ThreeObjects_1.ThreeObjects.Mesh:
                var material = GIJSView.getMaterial(src.material);
                var shape = this.buildGeometry(src.geometry, material, src.smooth);
                var matrixWorld = src.matrixWorld;
                if (matrixWorld.equals(this.identityMatrix)) {
                    return shape;
                }
                else {
                    var mat = Matrix4_1.Matrix4.fromTHREEJS(matrixWorld.elements);
                    return TransformedShape_1.TransformedShape.newTransformedShape(shape, mat);
                }
            case ThreeObjects_1.ThreeObjects.PointLight:
                return this.getLight(src);
        }
        return null;
    }
    buildGeometry(geometry, material, smooth = false) {
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
                    var triangle = new Triangle_1.Triangle();
                    triangle.material = material;
                    triangle.v1 = new Vector3_1.Vector3(vertices[face.a].x, vertices[face.a].y, vertices[face.a].z);
                    triangle.v2 = new Vector3_1.Vector3(vertices[face.b].x, vertices[face.b].y, vertices[face.b].z);
                    triangle.v3 = new Vector3_1.Vector3(vertices[face.c].x, vertices[face.c].y, vertices[face.c].z);
                    triangle.n1 = new Vector3_1.Vector3();
                    triangle.n2 = new Vector3_1.Vector3();
                    triangle.n3 = new Vector3_1.Vector3();
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
            if (geometry.attributes["uv"]) {
                var uv = geometry.attributes["uv"].array;
            }
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
                var uvIndex = 0;
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
                    var au = a * 2;
                    var av = (a * 2) + 1;
                    var bu = b * 2;
                    var bv = (b * 2) + 1;
                    var cu = c * 2;
                    var cv = (c * 2) + 1;
                    var triangle = new Triangle_1.Triangle();
                    triangle.material = material;
                    triangle.v1 = new Vector3_1.Vector3(positions[ax], positions[ay], positions[az]);
                    triangle.v2 = new Vector3_1.Vector3(positions[bx], positions[by], positions[bz]);
                    triangle.v3 = new Vector3_1.Vector3(positions[cx], positions[cy], positions[cz]);
                    triangle.n1 = new Vector3_1.Vector3(normals[ax], normals[ay], normals[az]);
                    triangle.n2 = new Vector3_1.Vector3(normals[bx], normals[by], normals[bz]);
                    triangle.n3 = new Vector3_1.Vector3(normals[cx], normals[cy], normals[cz]);
                    if (uv) {
                        triangle.t1 = new Vector3_1.Vector3(uv[au], uv[av], 0);
                        triangle.t2 = new Vector3_1.Vector3(uv[bu], uv[bv], 0);
                        triangle.t3 = new Vector3_1.Vector3(uv[cu], uv[cv], 0);
                    }
                    triangle.fixNormals();
                    triangle.updateBox();
                    triangles.push(triangle);
                    uvIndex += 2;
                }
            }
            else {
                uvIndex = 0;
                for (var i = 0; i < positions.length; i = i + 9) {
                    var triangle = new Triangle_1.Triangle();
                    triangle.material = material;
                    triangle.v1 = new Vector3_1.Vector3(positions[i], positions[i + 1], positions[i + 2]);
                    triangle.v2 = new Vector3_1.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
                    triangle.v3 = new Vector3_1.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
                    triangle.n1 = new Vector3_1.Vector3(normals[i], normals[i + 1], normals[i + 2]);
                    triangle.n2 = new Vector3_1.Vector3(normals[i + 3], normals[i + 4], normals[i + 5]);
                    triangle.n3 = new Vector3_1.Vector3(normals[i + 6], normals[i + 7], normals[i + 8]);
                    if (uv) {
                        triangle.t1 = new Vector3_1.Vector3(uv[uvIndex], uv[uvIndex + 1], 0);
                        triangle.t2 = new Vector3_1.Vector3(uv[uvIndex + 2], uv[uvIndex + 3], 0);
                        triangle.t3 = new Vector3_1.Vector3(uv[uvIndex + 4], uv[uvIndex + 5], 0);
                    }
                    triangle.fixNormals();
                    triangle.updateBox();
                    triangles.push(triangle);
                    uvIndex += 6;
                }
            }
        }
        var mesh = Mesh_1.Mesh.newMesh(triangles);
        if (smooth) {
            mesh.smoothNormals();
        }
        return mesh;
    }
    computeNormals(positions) {
        return new Float32Array(positions.length);
    }
    updateCamera(camera) {
        this.camera.p.setFromJson(camera.position);
        this.camera.m = 1 / Math.tan(camera.fov * Math.PI / 360);
        let e = camera.matrix.elements;
        let x = [-e[0], -e[1], -e[2]];
        let y = [e[4], e[5], e[6]];
        let z = [-e[8], -e[9], -e[10]];
        this.camera.u.setFromArray(x);
        this.camera.v.setFromArray(y);
        this.camera.w.setFromArray(z);
        this.dirty = true;
        if (this.renderer) {
            this.renderer.traceManager.stop();
        }
    }
    static getMaterial(srcMaterial) {
        if (srcMaterial instanceof THREE.MultiMaterial) {
            srcMaterial = srcMaterial.materials[0];
        }
        var material = new Material_1.Material(Color_1.Color.hexColor(srcMaterial.color.getHex()));
        material.ior = srcMaterial.ior ? srcMaterial.ior : 1;
        material.tint = srcMaterial.tint ? srcMaterial.tint : 0;
        material.gloss = srcMaterial.gloss ? srcMaterial.gloss : 0;
        material.emittance = srcMaterial.emittance ? srcMaterial.emittance : 0;
        material.transparent = srcMaterial.transparent;
        material.attenuation = Attenuation_1.Attenuation.fromJson(srcMaterial.attenuation);
        if (srcMaterial.map) {
            if (srcMaterial.map.image && srcMaterial.map.image.length == 0) {
                var image = srcMaterial.map.mipmaps[0];
                material.texture = new Texture_1.Texture();
                material.texture.setImageData(image.width, image.height, image.data);
                material.texture.sourceFile = srcMaterial.map.uuid;
            }
            else if (srcMaterial.map.image) {
                material.texture = new Texture_1.Texture(srcMaterial.map.image);
            }
        }
        if (srcMaterial.normalMap) {
            if (srcMaterial.normalMap.image && srcMaterial.normalMap.image.length == 0) {
                var image = srcMaterial.normalMap.mipmaps[0];
                material.normalTexture = new Texture_1.Texture();
                material.normalTexture.setImageData(image.width, image.height, image.data);
                material.normalTexture.sourceFile = srcMaterial.normalMap.uuid;
            }
            else if (srcMaterial.normalMap.image) {
                material.normalTexture = new Texture_1.Texture(srcMaterial.normalMap.image);
            }
        }
        if (srcMaterial.bumpMap) {
            if (srcMaterial.bumpMap.image && srcMaterial.bumpMap.image.length == 0) {
                var image = srcMaterial.bumpMap.mipmaps[0];
                material.bumpTexture = new Texture_1.Texture();
                material.bumpTexture.setImageData(image.width, image.height, image.data);
                material.bumpTexture.sourceFile = srcMaterial.bumpMap.uuid;
            }
            else if (srcMaterial.bumpMap.image) {
                material.bumpTexture = new Texture_1.Texture(srcMaterial.bumpMap.image);
            }
        }
        return material;
    }
    getLight(src) {
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
        var material = new LightMaterial_1.LightMaterial(Color_1.Color.hexColor(src.color.getHex()), src.intensity, new Attenuation_2.LinearAttenuation(src.distance));
        if (_radius) {
            var shape = Sphere_1.Sphere.newSphere(new Vector3_1.Vector3(src.position.x, src.position.y, src.position.z), _radius, material);
        }
        else {
            shape = Cube_1.Cube.newCube(new Vector3_1.Vector3(-width / 2, src.position.y, -height / 2), new Vector3_1.Vector3(width / 2, src.position.y + 1, height / 2), material);
        }
        return shape;
    }
}
exports.GIJSView = GIJSView;


/***/ })
/******/ ]);
});
//# sourceMappingURL=xray.js.map