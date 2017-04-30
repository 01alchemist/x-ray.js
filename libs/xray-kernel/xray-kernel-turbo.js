var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var MemoryObject = (function () {
    function MemoryObject(p) {
        this._pointer = (p | 0);
    }
    Object.defineProperty(MemoryObject.prototype, "pointer", {
        get: function () { return this._pointer; },
        enumerable: true,
        configurable: true
    });
    ;
    return MemoryObject;
}());
var XRAY;
(function (XRAY) {
    var height = 600;
    var width = 800;
    var shadows = true;
    var reflection = true;
    var reflection_depth = 2;
    var antialias = false;
    var debug = false;
    var INF = 1e9;
    var EPS = 1e-9;
    var SENTINEL = 1e32;
    function xy(x, y) {
        return { x: x, y: y };
    }
    function xyz(x, y, z) {
        return { x: x, y: y, z: z };
    }
    function xyzw(x, y, z, w) {
        return { x: x, y: y, z: z, W: w };
    }
    function F3(a, b, c) {
        return { A: a, b: b, C: c };
    }
    function rgb(r, g, b) {
        return { r: r, g: g, b: b };
    }
    function ray(origin, direction) {
        return { Origin: origin, Direction: direction };
    }
    function free(ptr) {
        unsafe.free(ptr);
    }
    (function (Axis) {
        Axis[Axis["AxisNone"] = 0] = "AxisNone";
        Axis[Axis["AxisX"] = 1] = "AxisX";
        Axis[Axis["AxisY"] = 2] = "AxisY";
        Axis[Axis["AxisZ"] = 3] = "AxisZ";
    })(XRAY.Axis || (XRAY.Axis = {}));
    var Axis = XRAY.Axis;
    var Color = (function (_super) {
        __extends(Color, _super);
        function Color(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Color, "BASE", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Color.init = function (SELF, color) {
            if (color === void 0) { color = { r: 0, g: 0, b: 0 }; }
            unsafe._mem_f64[(SELF + 8) >> 3] = (color.r);
            unsafe._mem_f64[(SELF + 16) >> 3] = (color.g);
            unsafe._mem_f64[(SELF + 24) >> 3] = (color.b);
            return SELF;
        };
        Color.Init_mem = function (SELF, r, g, b) {
            if (r === void 0) { r = 0; }
            if (g === void 0) { g = 0; }
            if (b === void 0) { b = 0; }
            unsafe._mem_f64[(SELF + 8) >> 3] = r;
            unsafe._mem_f64[(SELF + 16) >> 3] = g;
            unsafe._mem_f64[(SELF + 24) >> 3] = b;
            return SELF;
        };
        Color.NewColor = function (color, g, b) {
            if (g === void 0) { g = 0; }
            if (b === void 0) { b = 0; }
            var ptr = Color.initInstance(unsafe.alloc(32, 8));
            if (typeof color === "object") {
                return Color.init(ptr, color);
            }
            else {
                return Color.Init_mem(ptr, color, g, b);
            }
        };
        Color.HexColor = function (hex, c) {
            var r = ((hex >> 16) & 255) / 255;
            var g = ((hex >> 8) & 255) / 255;
            var b = (hex & 255) / 255;
            var ptr = c ? c : Color.initInstance(unsafe.alloc(32, 8));
            return Color.Pow_mem(Color.Init_mem(ptr, r, g, b), 2.2);
        };
        Color.Kelvin = function (K) {
            var red;
            var green;
            var blue;
            if (K >= 6600) {
                var a = 351.97690566805693;
                var b = 0.114206453784165;
                var c = -40.25366309332127;
                var x = K / 100 - 55;
                red = a + b * x + c * Math.log(x);
            }
            else {
                red = 255;
            }
            if (K >= 6600) {
                a = 325.4494125711974;
                b = 0.07943456536662342;
                c = -28.0852963507957;
                x = K / 100 - 50;
                green = a + b * x + c * Math.log(x);
            }
            else if (K >= 1000) {
                a = -155.25485562709179;
                b = -0.44596950469579133;
                c = 104.49216199393888;
                x = K / 100 - 2;
                green = a + b * x + c * Math.log(x);
            }
            else {
                green = 0;
            }
            if (K >= 6600) {
                blue = 255;
            }
            else if (K >= 2000) {
                a = -254.76935184120902;
                b = 0.8274096064007395;
                c = 115.67994401066147;
                x = K / 100 - 10;
                blue = a + b * x + c * Math.log(x);
            }
            else {
                blue = 0;
            }
            red = Math.min(1, red / 255);
            green = Math.min(1, green / 255);
            blue = Math.min(1, blue / 255);
            var ptr = Color.initInstance(unsafe.alloc(32, 8));
            return Color.Init_mem(ptr, red, green, blue);
        };
        Color.FloatRGBA = function (SELF) {
            return {
                r: unsafe._mem_f64[(SELF + 8) >> 3],
                g: unsafe._mem_f64[(SELF + 16) >> 3],
                b: unsafe._mem_f64[(SELF + 24) >> 3],
                a: 1.0
            };
        };
        Color.RGB = function (SELF) {
            var _d = new Uint8ClampedArray([
                unsafe._mem_f64[(SELF + 8) >> 3] * 255,
                unsafe._mem_f64[(SELF + 16) >> 3] * 255,
                unsafe._mem_f64[(SELF + 24) >> 3] * 255
            ]);
            return rgb(_d[0], _d[1], _d[2]);
        };
        Color.RGBA = function (SELF) {
            var _d = new Uint8ClampedArray([
                unsafe._mem_f64[(SELF + 8) >> 3] * 255,
                unsafe._mem_f64[(SELF + 16) >> 3] * 255,
                unsafe._mem_f64[(SELF + 24) >> 3] * 255
            ]);
            return {
                r: _d[0],
                g: _d[1],
                b: _d[2],
                a: 255
            };
        };
        Color.RGBA64 = function (SELF) {
            return {
                r: Math.round(Math.max(0, Math.min(65535, unsafe._mem_f64[(SELF + 8) >> 3] * 65535))),
                g: Math.round(Math.max(0, Math.min(65535, unsafe._mem_f64[(SELF + 16) >> 3] * 65535))),
                b: Math.round(Math.max(0, Math.min(65535, unsafe._mem_f64[(SELF + 24) >> 3] * 65535))),
                a: 65535
            };
        };
        Color.Add = function (a, b) { return rgb(a.r + b.r, a.g + b.g, a.b + b.b); };
        Color.Add2 = function (a, b) { return new Color3(a.r + b.r, a.g + b.g, a.b + b.b); };
        Color.Add_mem = function (a, b, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] + unsafe._mem_f64[(b + 8) >> 3];
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] + unsafe._mem_f64[(b + 16) >> 3];
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] + unsafe._mem_f64[(b + 24) >> 3];
                return c;
            }
            else {
                var ptr = Color.initInstance(unsafe.alloc(32, 8));
                return Color.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] + unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3] + unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3] + unsafe._mem_f64[(b + 24) >> 3]);
            }
        };
        Color.Add_21 = function (a, b, c) {
            c = c ? c : new Color3();
            c.r = a.r + unsafe._mem_f64[(b + 8) >> 3];
            c.g = a.g + unsafe._mem_f64[(b + 16) >> 3];
            c.b = a.b + unsafe._mem_f64[(b + 24) >> 3];
            return c;
        };
        Color.Sub = function (a, b) { return rgb(a.r - b.r, a.g - b.g, a.b - b.b); };
        Color.Sub_mem = function (a, b, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3];
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3];
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3];
                return c;
            }
            else {
                var ptr = Color.initInstance(unsafe.alloc(32, 8));
                return Color.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3]);
            }
        };
        Color.Sub_mem2 = function (a, b, c) {
            c = c ? c : new Color3();
            c.r = unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3];
            c.g = unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3];
            c.b = unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3];
            return c;
        };
        Color.Sub_21 = function (a, b, c) {
            c = c ? c : new Color3();
            c.r = a.r - unsafe._mem_f64[(b + 8) >> 3];
            c.g = a.g - unsafe._mem_f64[(b + 16) >> 3];
            c.b = a.b - unsafe._mem_f64[(b + 24) >> 3];
            return c;
        };
        Color.Mul = function (a, b) { return rgb(a.r * b.r, a.g * b.g, a.b * b.b); };
        Color.Mul2 = function (a, b) {
            return new Color3(unsafe._mem_f64[(a + 8) >> 3] * b.r, unsafe._mem_f64[(a + 16) >> 3] * b.g, unsafe._mem_f64[(a + 24) >> 3] * b.b);
        };
        Color.Mul_mem = function (a, b, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3];
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3];
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3];
                return c;
            }
            else {
                var ptr = Color.initInstance(unsafe.alloc(32, 8));
                return Color.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3]);
            }
        };
        Color.MulScalar = function (a, f) { return rgb(a.r * f, a.g * f, a.b * f); };
        Color.MulScalar2 = function (a, f) {
            return new Color3(unsafe._mem_f64[(a + 8) >> 3] * f, unsafe._mem_f64[(a + 16) >> 3] * f, unsafe._mem_f64[(a + 24) >> 3] * f);
        };
        Color.MulScalar_mem = function (a, f, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] * f;
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] * f;
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] * f;
                return c;
            }
            else {
                var ptr = Color.initInstance(unsafe.alloc(32, 8));
                return Color.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] * f, unsafe._mem_f64[(a + 16) >> 3] * f, unsafe._mem_f64[(a + 24) >> 3] * f);
            }
        };
        Color.DivScalar = function (a, f) { return rgb(a.r / f, a.g / f, a.b / f); };
        Color.DivScalar_mem = function (a, f, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] / f;
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] / f;
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] / f;
                return c;
            }
            else {
                var ptr = Color.initInstance(unsafe.alloc(32, 8));
                return Color.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] / f, unsafe._mem_f64[(a + 16) >> 3] / f, unsafe._mem_f64[(a + 24) >> 3] / f);
            }
        };
        Color.Min = function (a, b) { return rgb(Math.min(a.r, b.r), Math.min(a.g, b.g), Math.min(a.b, b.b)); };
        Color.Min_mem = function (a, b, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = Math.min(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(b + 8) >> 3]);
                unsafe._mem_f64[(c + 16) >> 3] = Math.min(unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(b + 16) >> 3]);
                unsafe._mem_f64[(c + 24) >> 3] = Math.min(unsafe._mem_f64[(a + 24) >> 3], unsafe._mem_f64[(b + 24) >> 3]);
                return c;
            }
            else {
                var ptr = Color.initInstance(unsafe.alloc(32, 8));
                return Color.Init_mem(ptr, Math.min(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(b + 8) >> 3]), Math.min(unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(b + 16) >> 3]), Math.min(unsafe._mem_f64[(a + 24) >> 3], unsafe._mem_f64[(b + 24) >> 3]));
            }
        };
        Color.Max = function (a, b) { return rgb(Math.max(a.r, b.r), Math.max(a.g, b.g), Math.max(a.b, b.b)); };
        Color.Max_mem = function (a, b, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = Math.max(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(b + 8) >> 3]);
                unsafe._mem_f64[(c + 16) >> 3] = Math.max(unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(b + 16) >> 3]);
                unsafe._mem_f64[(c + 24) >> 3] = Math.max(unsafe._mem_f64[(a + 24) >> 3], unsafe._mem_f64[(b + 24) >> 3]);
                return c;
            }
            else {
                var ptr = Color.initInstance(unsafe.alloc(32, 8));
                return Color.Init_mem(ptr, Math.max(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(b + 8) >> 3]), Math.max(unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(b + 16) >> 3]), Math.max(unsafe._mem_f64[(a + 24) >> 3], unsafe._mem_f64[(b + 24) >> 3]));
            }
        };
        Color.MinComponent = function (a) { return Math.min(Math.min(a.r, a.g), a.b); };
        Color.MinComponent_mem = function (a) {
            return Math.min(Math.min(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3]), unsafe._mem_f64[(a + 24) >> 3]);
        };
        Color.MaxComponent = function (a) { return Math.max(Math.max(a.r, a.g), a.b); };
        Color.MaxComponent_mem = function (a) {
            return Math.max(Math.max(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3]), unsafe._mem_f64[(a + 24) >> 3]);
        };
        Color.Pow = function (a, f) { return rgb(Math.pow(a.r, f), Math.pow(a.g, f), Math.pow(a.b, f)); };
        Color.Pow_mem = function (a, f, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = Math.pow(unsafe._mem_f64[(a + 8) >> 3], f);
                unsafe._mem_f64[(c + 16) >> 3] = Math.pow(unsafe._mem_f64[(a + 16) >> 3], f);
                unsafe._mem_f64[(c + 24) >> 3] = Math.pow(unsafe._mem_f64[(a + 24) >> 3], f);
                return c;
            }
            else {
                var ptr = Color.initInstance(unsafe.alloc(32, 8));
                return Color.Init_mem(ptr, Math.pow(unsafe._mem_f64[(a + 8) >> 3], f), Math.pow(unsafe._mem_f64[(a + 16) >> 3], f), Math.pow(unsafe._mem_f64[(a + 24) >> 3], f));
            }
        };
        Color.Mix = function (a, b, pct) {
            var _a = Color.MulScalar(a, 1 - pct);
            var _b = Color.MulScalar(b, pct);
            return rgb(_a.r + _b.r, _a.g + _b.g, _a.b + _b.b);
        };
        Color.Mix_mem = function (a, b, pct, c) {
            var _a = Color.MulScalar_mem(a, 1 - pct);
            var _b = Color.MulScalar_mem(b, pct);
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[((_a) + 8) >> 3] + unsafe._mem_f64[((_b) + 8) >> 3];
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[((_a) + 16) >> 3] + unsafe._mem_f64[((_b) + 16) >> 3];
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[((_a) + 24) >> 3] + unsafe._mem_f64[((_b) + 24) >> 3];
                return c;
            }
            else {
                var ptr = Color.initInstance(unsafe.alloc(32, 8));
                return Color.Init_mem(ptr, unsafe._mem_f64[((_a) + 8) >> 3] + unsafe._mem_f64[((_b) + 8) >> 3], unsafe._mem_f64[((_a) + 16) >> 3] + unsafe._mem_f64[((_b) + 16) >> 3], unsafe._mem_f64[((_a) + 24) >> 3] + unsafe._mem_f64[((_b) + 24) >> 3]);
            }
        };
        Color.IsEqual = function (a, b) {
            return unsafe._mem_f64[(a + 8) >> 3] === unsafe._mem_f64[(b + 8) >> 3] && unsafe._mem_f64[(a + 16) >> 3] === unsafe._mem_f64[(b + 16) >> 3] && unsafe._mem_f64[(a + 24) >> 3] === unsafe._mem_f64[(b + 24) >> 3];
        };
        Color.IsBlack = function (a) {
            return Color.IsEqual(a, Color.BLACK);
        };
        Color.IsWhite = function (a) {
            return Color.IsEqual(a, Color.WHITE);
        };
        Color.Set = function (SELF, r, g, b) {
            unsafe._mem_f64[(SELF + 8) >> 3] = r;
            unsafe._mem_f64[(SELF + 16) >> 3] = g;
            unsafe._mem_f64[(SELF + 24) >> 3] = b;
            return SELF;
        };
        Color.Clone = function (SELF, c) {
            var ptr = c ? c : Color.initInstance(unsafe.alloc(32, 8));
            return Color.Init_mem(ptr, unsafe._mem_f64[(SELF + 8) >> 3], unsafe._mem_f64[(SELF + 16) >> 3], unsafe._mem_f64[(SELF + 24) >> 3]);
        };
        Object.defineProperty(Color, "BLACK", {
            get: function () {
                return Color.HexColor(0x000000);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Color, "WHITE", {
            get: function () {
                return Color.HexColor(0xFFFFFF);
            },
            enumerable: true,
            configurable: true
        });
        Color.Random = function () {
            var ptr = Color.initInstance(unsafe.alloc(32, 8));
            return Color.Init_mem(ptr, Math.random(), Math.random(), Math.random());
        };
        Color.random = function () {
            return rgb(Math.random(), Math.random(), Math.random());
        };
        Color.RandomBrightColor = function () {
            var i = Math.round(Math.random() * Color.BrightColors.length);
            return Color.BrightColors[i];
        };
        Color.RandomRGBAColor = function () {
            var i = Math.round(Math.random() * Color.RGBAColors.length);
            return Color.RGBAColors[i];
        };
        Color.toColor3 = function (SELF) {
            return new Color3(unsafe._mem_f64[(SELF + 8) >> 3], unsafe._mem_f64[(SELF + 16) >> 3], unsafe._mem_f64[(SELF + 24) >> 3]);
        };
        Color.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 194603; return SELF; };
        return Color;
    }(MemoryObject));
    Color.NAME = "Color";
    Color.SIZE = 32;
    Color.ALIGN = 8;
    Color.CLSID = 194603;
    Color.BrightColors = [
        Color.HexColor(0xFF00FF),
        Color.HexColor(0x84FF00),
        Color.HexColor(0xFF0084),
        Color.HexColor(0x00FFFF),
        Color.HexColor(0x00FF84),
        Color.HexColor(0xDD40FF),
        Color.HexColor(0xFFFF00)
    ];
    Color.RGBAColors = [
        Color.HexColor(0xFF0000),
        Color.HexColor(0x00FF00),
        Color.HexColor(0x0000FF),
        Color.HexColor(0xFFFFFF)
    ];
    XRAY.Color = Color;
    unsafe._idToType[194603] = Color;
    var Vector = (function (_super) {
        __extends(Vector, _super);
        function Vector(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Vector, "BASE", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Vector.init = function (SELF, vector) {
            if (vector === void 0) { vector = { x: 0, y: 0, z: 0 }; }
            unsafe._mem_f64[(SELF + 8) >> 3] = (vector.x);
            unsafe._mem_f64[(SELF + 16) >> 3] = (vector.y);
            unsafe._mem_f64[(SELF + 24) >> 3] = (vector.z);
            return SELF;
        };
        Vector.Init_mem = function (SELF, x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            unsafe._mem_f64[(SELF + 8) >> 3] = x;
            unsafe._mem_f64[(SELF + 16) >> 3] = y;
            unsafe._mem_f64[(SELF + 24) >> 3] = z;
            return SELF;
        };
        Vector.NewVector = function (vector, y, z) {
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            var ptr = Vector.initInstance(unsafe.alloc(32, 8));
            if (typeof vector === "object") {
                return Vector.init(ptr, vector);
            }
            else {
                return Vector.Init_mem(ptr, vector, y, z);
            }
        };
        Vector.ToJSON = function (SELF) {
            return {
                x: unsafe._mem_f64[(SELF + 8) >> 3],
                y: unsafe._mem_f64[(SELF + 16) >> 3],
                z: unsafe._mem_f64[(SELF + 24) >> 3]
            };
        };
        Vector.XYZ = function (a) {
            return xyz(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3]);
        };
        Vector.RandomUnitVector = function () {
            var ptr = Vector.initInstance(unsafe.alloc(32, 8));
            var x = Math.random() * 2 - 1;
            var y = Math.random() * 2 - 1;
            var z = Math.random() * 2 - 1;
            while (x * x + y * y + z * z > 1) {
                x = Math.random() * 2 - 1;
                y = Math.random() * 2 - 1;
                z = Math.random() * 2 - 1;
            }
            return Vector.Normalize_mem(Vector.Init_mem(ptr, x, y, z));
        };
        Vector.Length = function (a) {
            return Math.sqrt((a.x * a.x) + (a.y * a.y) + (a.z * a.z));
        };
        Vector.Length_mem = function (a) {
            return Math.sqrt(unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(a + 8) >> 3] + unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(a + 16) >> 3] + unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(a + 24) >> 3]);
        };
        Vector.LengthN = function (a, n) {
            if (n == 2) {
                return Vector.Length(a);
            }
            a = Vector.Abs(a);
            return Math.pow(Math.pow(a.x, n) + Math.pow(a.y, n) + Math.pow(a.z, n), 1 / n);
        };
        Vector.LengthN_mem = function (a, n) {
            if (n == 2) {
                return Vector.Length_mem(a);
            }
            a = Vector.Abs_mem(a);
            return Math.pow(Math.pow(unsafe._mem_f64[(a + 8) >> 3], n) + Math.pow(unsafe._mem_f64[(a + 16) >> 3], n) + Math.pow(unsafe._mem_f64[(a + 24) >> 3], n), 1 / n);
        };
        Vector.Dot = function (a, b) {
            return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
        };
        Vector.Dot_mem = function (a, b) {
            return (unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3]) + (unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3]) + (unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3]);
        };
        Vector.Cross = function (a, b) {
            var x = (a.y * b.z) - (a.z * b.y);
            var y = (a.z * b.x) - (a.x * b.z);
            var z = (a.x * b.y) - (a.y * b.x);
            return xyz(x, y, z);
        };
        Vector.Cross_mem = function (a, b, c) {
            var x = (unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 24) >> 3]) - (unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 16) >> 3]);
            var y = (unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 8) >> 3]) - (unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 24) >> 3]);
            var z = (unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 16) >> 3]) - (unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 8) >> 3]);
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = x;
                unsafe._mem_f64[(c + 16) >> 3] = y;
                unsafe._mem_f64[(c + 24) >> 3] = z;
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, x, y, z);
            }
        };
        Vector.Normalize = function (a) {
            var d = Vector.Length(a);
            return xyz(a.x / d, a.y / d, a.z / d);
        };
        Vector.Normalize_mem = function (a, c) {
            var d = Vector.Length_mem(a);
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] / d;
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] / d;
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] / d;
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] / d, unsafe._mem_f64[(a + 16) >> 3] / d, unsafe._mem_f64[(a + 24) >> 3] / d);
            }
        };
        Vector.Negate = function (a) {
            return xyz(-a.x, -a.y, -a.z);
        };
        Vector.Negate_mem = function (a, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = -unsafe._mem_f64[(a + 8) >> 3];
                unsafe._mem_f64[(c + 16) >> 3] = -unsafe._mem_f64[(a + 16) >> 3];
                unsafe._mem_f64[(c + 24) >> 3] = -unsafe._mem_f64[(a + 24) >> 3];
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, -unsafe._mem_f64[(a + 8) >> 3], -unsafe._mem_f64[(a + 16) >> 3], -unsafe._mem_f64[(a + 24) >> 3]);
            }
        };
        Vector.Abs = function (a) {
            return xyz(Math.abs(a.x), Math.abs(a.y), Math.abs(a.z));
        };
        Vector.Abs_mem = function (a, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = Math.abs(unsafe._mem_f64[(a + 8) >> 3]);
                unsafe._mem_f64[(c + 16) >> 3] = Math.abs(unsafe._mem_f64[(a + 16) >> 3]);
                unsafe._mem_f64[(c + 24) >> 3] = Math.abs(unsafe._mem_f64[(a + 24) >> 3]);
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, Math.abs(unsafe._mem_f64[(a + 8) >> 3]), Math.abs(unsafe._mem_f64[(a + 16) >> 3]), Math.abs(unsafe._mem_f64[(a + 24) >> 3]));
            }
        };
        Vector.Add = function (a, b) { return xyz(a.x + b.x, a.y + b.y, a.z + b.z); };
        Vector.Add_mem = function (a, b, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] + unsafe._mem_f64[(b + 8) >> 3];
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] + unsafe._mem_f64[(b + 16) >> 3];
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] + unsafe._mem_f64[(b + 24) >> 3];
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] + unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3] + unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3] + unsafe._mem_f64[(b + 24) >> 3]);
            }
        };
        Vector.Add_12 = function (a, b) {
            return new Vector3(unsafe._mem_f64[(a + 8) >> 3] + b.x, unsafe._mem_f64[(a + 16) >> 3] + b.y, unsafe._mem_f64[(a + 24) >> 3] + b.z);
        };
        Vector.Sub_12 = function (a, b) {
            return new Vector3(unsafe._mem_f64[(a + 8) >> 3] - b.x, unsafe._mem_f64[(a + 16) >> 3] - b.y, unsafe._mem_f64[(a + 24) >> 3] - b.z);
        };
        Vector.Sub_21 = function (a, b) {
            return new Vector3(a.x - unsafe._mem_f64[(b + 8) >> 3], a.y - unsafe._mem_f64[(b + 16) >> 3], a.z - unsafe._mem_f64[(b + 24) >> 3]);
        };
        Vector.Sub_mem = function (a, b, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3];
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3];
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3];
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3]);
            }
        };
        Vector.Sub_mem_2 = function (a, b) {
            return new Vector3(unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3]);
        };
        Vector.Mul = function (a, b) { return xyz(a.x * b.x, a.y * b.y, a.z * b.z); };
        Vector.Mul_mem = function (a, b, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3];
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3];
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3];
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3]);
            }
        };
        Vector.Div_12 = function (a, b) {
            return new Vector3(unsafe._mem_f64[(a + 8) >> 3] / b.x, unsafe._mem_f64[(a + 16) >> 3] / b.y, unsafe._mem_f64[(a + 24) >> 3] / b.z);
        };
        Vector.Div_mem = function (a, b, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] / unsafe._mem_f64[(b + 8) >> 3];
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] / unsafe._mem_f64[(b + 16) >> 3];
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] / unsafe._mem_f64[(b + 24) >> 3];
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] / unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3] / unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3] / unsafe._mem_f64[(b + 24) >> 3]);
            }
        };
        Vector.Mod = function (a, b) {
            var x = a.x - b.x * Math.floor(a.x / b.x);
            var y = a.y - b.y * Math.floor(a.y / b.y);
            var z = a.z - b.z * Math.floor(a.z / b.z);
            return xyz(x, y, z);
        };
        Vector.Mod_mem = function (a, b, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3] * Math.floor(unsafe._mem_f64[(a + 8) >> 3] / unsafe._mem_f64[(b + 8) >> 3]);
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3] * Math.floor(unsafe._mem_f64[(a + 16) >> 3] / unsafe._mem_f64[(b + 16) >> 3]);
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3] * Math.floor(unsafe._mem_f64[(a + 24) >> 3] / unsafe._mem_f64[(b + 24) >> 3]);
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3] * Math.floor(unsafe._mem_f64[(a + 8) >> 3] / unsafe._mem_f64[(b + 8) >> 3]), unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3] * Math.floor(unsafe._mem_f64[(a + 16) >> 3] / unsafe._mem_f64[(b + 16) >> 3]), unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3] * Math.floor(unsafe._mem_f64[(a + 24) >> 3] / unsafe._mem_f64[(b + 24) >> 3]));
            }
        };
        Vector.AddScalar = function (a, f) { return xyz(a.x + f, a.y + f, a.z + f); };
        Vector.AddScalar_mem = function (a, f, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] + f;
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] + f;
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] + f;
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] + f, unsafe._mem_f64[(a + 16) >> 3] + f, unsafe._mem_f64[(a + 24) >> 3] + f);
            }
        };
        Vector.SubScalar = function (a, f) { return xyz(a.x - f, a.y - f, a.z - f); };
        Vector.SubScalar_mem = function (a, f, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] - f;
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] - f;
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] - f;
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] - f, unsafe._mem_f64[(a + 16) >> 3] - f, unsafe._mem_f64[(a + 24) >> 3] - f);
            }
        };
        Vector.MulScalar = function (a, f) { return xyz(a.x * f, a.y * f, a.z * f); };
        Vector.MulScalar_mem = function (a, f, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] * f;
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] * f;
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] * f;
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] * f, unsafe._mem_f64[(a + 16) >> 3] * f, unsafe._mem_f64[(a + 24) >> 3] * f);
            }
        };
        Vector.DivScalar = function (a, f) { return xyz(a.x / f, a.y / f, a.z / f); };
        Vector.DivScalar_mem = function (a, f, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] / f;
                unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] / f;
                unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] / f;
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] / f, unsafe._mem_f64[(a + 16) >> 3] / f, unsafe._mem_f64[(a + 24) >> 3] / f);
            }
        };
        Vector.Min = function (a, b) { return xyz(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z)); };
        Vector.Min_mem = function (a, b, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = Math.min(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(b + 8) >> 3]);
                unsafe._mem_f64[(c + 16) >> 3] = Math.min(unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(b + 16) >> 3]);
                unsafe._mem_f64[(c + 24) >> 3] = Math.min(unsafe._mem_f64[(a + 24) >> 3], unsafe._mem_f64[(b + 24) >> 3]);
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, Math.min(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(b + 8) >> 3]), Math.min(unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(b + 16) >> 3]), Math.min(unsafe._mem_f64[(a + 24) >> 3], unsafe._mem_f64[(b + 24) >> 3]));
            }
        };
        Vector.Max = function (a, b) { return xyz(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z)); };
        Vector.Max_mem = function (a, b, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = Math.max(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(b + 8) >> 3]);
                unsafe._mem_f64[(c + 16) >> 3] = Math.max(unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(b + 16) >> 3]);
                unsafe._mem_f64[(c + 24) >> 3] = Math.max(unsafe._mem_f64[(a + 24) >> 3], unsafe._mem_f64[(b + 24) >> 3]);
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, Math.max(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(b + 8) >> 3]), Math.max(unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(b + 16) >> 3]), Math.max(unsafe._mem_f64[(a + 24) >> 3], unsafe._mem_f64[(b + 24) >> 3]));
            }
        };
        Vector.MinAxis = function (a) {
            var x = Math.abs(a.x);
            var y = Math.abs(a.y);
            var z = Math.abs(a.z);
            if (x <= y && x <= z) {
                return xyz(1, 0, 0);
            }
            else if (y <= x && y <= z) {
                return xyz(0, 1, 0);
            }
            return xyz(0, 0, 1);
        };
        Vector.MinAxis_mem = function (a, c) {
            var x = Math.abs(unsafe._mem_f64[(a + 8) >> 3]);
            var y = Math.abs(unsafe._mem_f64[(a + 16) >> 3]);
            var z = Math.abs(unsafe._mem_f64[(a + 24) >> 3]);
            if (x <= y && x <= z) {
                x = 1;
                y = 0;
                z = 0;
            }
            else if (y <= x && y <= z) {
                x = 0;
                y = 1;
                z = 0;
            }
            else {
                x = 0;
                y = 0;
                z = 1;
            }
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = x;
                unsafe._mem_f64[(c + 16) >> 3] = y;
                unsafe._mem_f64[(c + 24) >> 3] = z;
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, x, y, z);
            }
        };
        Vector.MinComponent = function (a) { return Math.min(Math.min(a.x, a.y), a.z); };
        Vector.MinComponent_mem = function (a) {
            return Math.min(Math.min(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3]), unsafe._mem_f64[(a + 24) >> 3]);
        };
        Vector.MaxComponent = function (a) { return Math.max(Math.max(a.x, a.y), a.z); };
        Vector.MaxComponent_mem = function (a) {
            return Math.max(Math.max(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3]), unsafe._mem_f64[(a + 24) >> 3]);
        };
        Vector.Reflect = function (a, b) {
            return Vector.Sub(b, Vector.MulScalar(a, 2 * Vector.Dot(a, b)));
        };
        Vector.Reflect_mem = function (a, b, c) {
            c = c ? c : Vector.initInstance(unsafe.alloc(32, 8));
            return Vector.Sub_mem(b, Vector.MulScalar_mem(a, 2 * Vector.Dot_mem(a, b), c), c);
        };
        Vector.Refract = function (a, b, n1, n2) {
            var nr = n1 / n2;
            var cosI = -Vector.Dot(a, b);
            var sinT2 = nr * nr * (1 - cosI * cosI);
            if (sinT2 > 1) {
                return xyz(0, 0, 0);
            }
            var cosT = Math.sqrt(1 - sinT2);
            return Vector.Add(Vector.MulScalar(b, nr), Vector.MulScalar(a, nr * cosI - cosT));
        };
        Vector.Refract_mem = function (a, b, n1, n2, c) {
            var nr = n1 / n2;
            var cosI = -Vector.Dot_mem(a, b);
            var sinT2 = nr * nr * (1 - cosI * cosI);
            if (sinT2 > 1) {
                return Vector.Init_mem(Vector.initInstance(unsafe.alloc(32, 8)));
            }
            var cosT = Math.sqrt(1 - sinT2);
            c = c ? c : Vector.initInstance(unsafe.alloc(32, 8));
            return Vector.Add_mem(Vector.MulScalar_mem(b, nr), Vector.MulScalar_mem(a, nr * cosI - cosT, c), c);
        };
        Vector.Reflectance = function (a, b, n1, n2) {
            var nr = n1 / n2;
            var cosI = -Vector.Dot(a, b);
            var sinT2 = nr * nr * (1 - cosI * cosI);
            if (sinT2 > 1) {
                return 1;
            }
            var cosT = Math.sqrt(1 - sinT2);
            var rOrth = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
            var rPar = (n2 * cosI - n1 * cosT) / (n2 * cosI + n1 * cosT);
            return (rOrth * rOrth + rPar * rPar) / 2;
        };
        Vector.Reflectance_mem = function (a, b, n1, n2) {
            var nr = n1 / n2;
            var cosI = -Vector.Dot_mem(a, b);
            var sinT2 = nr * nr * (1 - cosI * cosI);
            if (sinT2 > 1) {
                return 1;
            }
            var cosT = Math.sqrt(1 - sinT2);
            var rOrth = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
            var rPar = (n2 * cosI - n1 * cosT) / (n2 * cosI + n1 * cosT);
            return (rOrth * rOrth + rPar * rPar) / 2;
        };
        Vector.Pow = function (a, f) { return xyz(Math.pow(a.x, f), Math.pow(a.y, f), Math.pow(a.z, f)); };
        Vector.Pow_mem = function (a, f, c) {
            if (c) {
                unsafe._mem_f64[(c + 8) >> 3] = Math.pow(unsafe._mem_f64[(a + 8) >> 3], f);
                unsafe._mem_f64[(c + 16) >> 3] = Math.pow(unsafe._mem_f64[(a + 16) >> 3], f);
                unsafe._mem_f64[(c + 24) >> 3] = Math.pow(unsafe._mem_f64[(a + 24) >> 3], f);
                return c;
            }
            else {
                var ptr = Vector.initInstance(unsafe.alloc(32, 8));
                return Vector.Init_mem(ptr, Math.pow(unsafe._mem_f64[(a + 8) >> 3], f), Math.pow(unsafe._mem_f64[(a + 16) >> 3], f), Math.pow(unsafe._mem_f64[(a + 24) >> 3], f));
            }
        };
        Vector.IsEqual = function (a, b) {
            return unsafe._mem_f64[(a + 8) >> 3] === unsafe._mem_f64[(b + 8) >> 3] && unsafe._mem_f64[(a + 16) >> 3] === unsafe._mem_f64[(b + 16) >> 3] && unsafe._mem_f64[(a + 24) >> 3] === unsafe._mem_f64[(b + 24) >> 3];
        };
        Vector.IsZero = function (a) {
            return unsafe._mem_f64[(a + 8) >> 3] === 0 && unsafe._mem_f64[(a + 16) >> 3] === 0 && unsafe._mem_f64[(a + 24) >> 3] === 0;
        };
        Vector.Set = function (SELF, x, y, z) {
            unsafe._mem_f64[(SELF + 8) >> 3] = x;
            unsafe._mem_f64[(SELF + 16) >> 3] = y;
            unsafe._mem_f64[(SELF + 24) >> 3] = z;
            return SELF;
        };
        Vector.SetFromJSON = function (SELF, d) {
            unsafe._mem_f64[(SELF + 8) >> 3] = (d.x);
            unsafe._mem_f64[(SELF + 16) >> 3] = (d.y);
            unsafe._mem_f64[(SELF + 24) >> 3] = (d.z);
            return SELF;
        };
        Vector.SetFromArray = function (SELF, d) {
            unsafe._mem_f64[(SELF + 8) >> 3] = (d[0]);
            unsafe._mem_f64[(SELF + 16) >> 3] = (d[1]);
            unsafe._mem_f64[(SELF + 24) >> 3] = (d[2]);
            return SELF;
        };
        Vector.Copy = function (SELF, a) {
            return Vector.Set(SELF, unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3]);
        };
        Vector.Clone = function (SELF, c) {
            var ptr = c ? c : Vector.initInstance(unsafe.alloc(32, 8));
            return Vector.Init_mem(ptr, unsafe._mem_f64[(SELF + 8) >> 3], unsafe._mem_f64[(SELF + 16) >> 3], unsafe._mem_f64[(SELF + 24) >> 3]);
        };
        Vector.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 1266219; return SELF; };
        return Vector;
    }(MemoryObject));
    Vector.NAME = "Vector";
    Vector.SIZE = 32;
    Vector.ALIGN = 8;
    Vector.CLSID = 1266219;
    Vector.ZERO = Vector.NewVector({ x: 0, y: 0, y: 0 });
    Vector.ONE = Vector.NewVector({ x: 1, y: 1, y: 1 });
    Vector.NegativeONE = Vector.NewVector({ x: -1, y: -1, y: -1 });
    XRAY.Vector = Vector;
    unsafe._idToType[1266219] = Vector;
    var Utils = (function () {
        function Utils() {
        }
        Utils.Radians = function (degrees) {
            return degrees * Math.PI / 180;
        };
        Utils.Degrees = function (radians) {
            return radians * 180 / Math.PI;
        };
        Utils.Cone = function (direction, theta, u, v) {
            if (theta < EPS) {
                return direction;
            }
            theta = theta * (1 - (2 * Math.acos(u) / Math.PI));
            var m1 = Math.sin(theta);
            var m2 = Math.cos(theta);
            var a = v * 2 * Math.PI;
            var q = Vector3.RandomUnitVector();
            var s = direction.cross(q);
            var t = direction.cross(s);
            var d = new Vector3();
            d = d.add(s.mulScalar(m1 * Math.cos(a)));
            d = d.add(t.mulScalar(m1 * Math.sin(a)));
            d = d.add(direction.mulScalar(m2));
            d = d.normalize();
            return d;
        };
        Utils.LoadImage = function (path) {
            return null;
        };
        Utils.SavePNG = function (path, im) {
            return null;
        };
        Utils.Median = function (items) {
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
        Utils.DurationString = function (t) {
            var d = new Date();
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(t);
            return d.toLocaleTimeString();
        };
        Utils.NumberString = function (x) {
            var suffixes = ["", "k", "M", "g"];
            suffixes.forEach(function (suffix) {
                if (x < 1000) {
                    return x + suffix;
                }
                x /= 1000;
            });
            return x + "T";
        };
        Utils.ParseFloats = function (items) {
            var result = [];
            items.forEach(function (item) {
                result.push(parseFloat(item));
            });
            return result;
        };
        Utils.ParseInts = function (items) {
            var result = [];
            items.forEach(function (item) {
                result.push(parseInt(item));
            });
            return result;
        };
        Utils.Fract = function (x) {
            return x - Math.floor(x);
        };
        Utils.FractAddOne = function (x) {
            var f1 = x - Math.floor(x);
            return f1 - Math.floor(f1 + 1);
        };
        Utils.Modf = function (f) {
            var int = Math.floor(f);
            var frac = f - int;
            return { int: int, frac: frac };
        };
        Utils.Clamp = function (x, lo, hi) {
            if (x < lo) {
                return lo;
            }
            if (x > hi) {
                return hi;
            }
            return x;
        };
        Utils.ClampInt = function (x, lo, hi) {
            if (x < lo) {
                return lo;
            }
            if (x > hi) {
                return hi;
            }
            return x;
        };
        Utils.append = function (slice) {
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
        };
        Utils.sortAscending = function (slice) {
            slice.sort(function (a, b) {
                return a - b;
            });
        };
        Utils.sortDescending = function (slice) {
            slice.sort(function (a, b) {
                return b - a;
            });
        };
        return Utils;
    }());
    XRAY.Utils = Utils;
    var Box = (function (_super) {
        __extends(Box, _super);
        function Box(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Box, "BASE", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Box.init = function (SELF, min, max) {
            if (min === void 0) { min = xyz(0, 0, 0); }
            if (max === void 0) { max = xyz(0, 0, 0); }
            unsafe._mem_i32[(SELF + 4) >> 2] = (Vector.NewVector(min));
            unsafe._mem_i32[(SELF + 8) >> 2] = (Vector.NewVector(max));
            return SELF;
        };
        Box.Init_mem = function (SELF, min, max) {
            unsafe._mem_i32[(SELF + 4) >> 2] = min;
            unsafe._mem_i32[(SELF + 8) >> 2] = max;
            return SELF;
        };
        Box.NewBox = function (min, max) {
            var SELF = Box.initInstance(unsafe.alloc(12, 4));
            unsafe._mem_i32[(SELF + 4) >> 2] = (min ? min : Vector.NewVector());
            unsafe._mem_i32[(SELF + 8) >> 2] = (max ? max : Vector.NewVector());
            return SELF;
        };
        Box.ToJSON = function (SELF) {
            return {
                min: Vector.ToJSON(unsafe._mem_i32[(SELF + 4) >> 2]),
                max: Vector.ToJSON(unsafe._mem_i32[(SELF + 8) >> 2])
            };
        };
        Box.BoxForShapes = function (shapes, numShapes) {
            if (numShapes == 0) {
                return Box.NewBox();
            }
            var box = Box.NewBox();
            for (var i = 0; i < numShapes; i++) {
                var shape = unsafe._mem_i32[(shapes + 4 + (4 * i)) >> 2];
                box = Box.Extend(box, Shape.BoundingBox(shape));
            }
            return box;
        };
        Box.Anchor_mem = function (SELF, anchor, c) {
            var size = Box.Size_mem(SELF);
            var tmp = Vector.Mul_mem(size, anchor);
            free(size);
            if (c) {
                free(tmp);
            }
            else {
                c = tmp;
            }
            return Vector.Add_mem(unsafe._mem_i32[(SELF + 4) >> 2], c, c);
        };
        Box.Anchor = function (SELF, anchor) {
            var size = Box.Size(SELF);
            return Vector.Add_12(unsafe._mem_i32[(SELF + 4) >> 2], size.mul(anchor));
        };
        Box.Center_mem = function (SELF) {
            var anchor = Vector.NewVector(0.5, 0.5, 0.5);
            return Box.Anchor(SELF, anchor, anchor);
        };
        Box.Center = function (SELF) {
            var anchor = new Vector3(0.5, 0.5, 0.5);
            return Box.Anchor(SELF, anchor);
        };
        Box.OuterRadius = function (SELF) {
            var center = Box.Center(SELF);
            return Vector.Sub_12(unsafe._mem_i32[(SELF + 4) >> 2], center).length();
        };
        Box.InnerRadius = function (SELF) {
            var center = Box.Center(SELF);
            return Vector.Sub_21(center, unsafe._mem_i32[(SELF + 4) >> 2]).maxComponent();
        };
        Box.Size_mem = function (SELF) {
            return Vector.Sub_mem(unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 4) >> 2]);
        };
        Box.Size = function (SELF) {
            return Vector.Sub_mem_2(unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 4) >> 2]);
        };
        Box.Extend = function (SELF, b) {
            var min = unsafe._mem_i32[(SELF + 4) >> 2];
            var max = unsafe._mem_i32[(SELF + 8) >> 2];
            var bmin = unsafe._mem_i32[(b + 4) >> 2];
            var bmax = unsafe._mem_i32[(b + 8) >> 2];
            return Box.Init_mem(SELF, Vector.Min_mem(min, bmin, min), Vector.Max_mem(max, bmax, max));
        };
        Box.Contains = function (SELF, b) {
            var a_min = unsafe._mem_i32[(SELF + 4) >> 2];
            var a_max = unsafe._mem_i32[(SELF + 8) >> 2];
            return unsafe._mem_f64[((a_min) + 8) >> 3] <= unsafe._mem_f64[(b + 8) >> 3] && unsafe._mem_f64[((a_max) + 8) >> 3] >= unsafe._mem_f64[(b + 8) >> 3] &&
                unsafe._mem_f64[((a_min) + 16) >> 3] <= unsafe._mem_f64[(b + 16) >> 3] && unsafe._mem_f64[((a_max) + 16) >> 3] >= unsafe._mem_f64[(b + 16) >> 3] &&
                unsafe._mem_f64[((a_min) + 24) >> 3] <= unsafe._mem_f64[(b + 24) >> 3] && unsafe._mem_f64[((a_max) + 24) >> 3] >= unsafe._mem_f64[(b + 24) >> 3];
        };
        Box.Intersects = function (a, b) {
            var a_min = unsafe._mem_i32[(a + 4) >> 2];
            var a_max = unsafe._mem_i32[(a + 8) >> 2];
            var b_min = unsafe._mem_i32[(b + 4) >> 2];
            var b_max = unsafe._mem_i32[(b + 8) >> 2];
            return !(unsafe._mem_f64[((a_min) + 8) >> 3] > unsafe._mem_f64[((b_max) + 8) >> 3] || unsafe._mem_f64[((a_max) + 8) >> 3] < unsafe._mem_f64[((b_min) + 8) >> 3] || unsafe._mem_f64[((a_min) + 16) >> 3] > unsafe._mem_f64[((b_max) + 16) >> 3] ||
                unsafe._mem_f64[((a_max) + 16) >> 3] < unsafe._mem_f64[((b_min) + 16) >> 3] || unsafe._mem_f64[((a_min) + 24) >> 3] > unsafe._mem_f64[((b_max) + 24) >> 3] || unsafe._mem_f64[((a_max) + 24) >> 3] < unsafe._mem_f64[((b_min) + 24) >> 3]);
        };
        Box.Intersect = function (SELF, r) {
            var min = unsafe._mem_i32[(SELF + 4) >> 2];
            var max = unsafe._mem_i32[(SELF + 8) >> 2];
            var x1 = (unsafe._mem_f64[(min + 8) >> 3] - r.origin.x) / r.direction.x;
            var y1 = (unsafe._mem_f64[(min + 16) >> 3] - r.origin.y) / r.direction.y;
            var z1 = (unsafe._mem_f64[(min + 24) >> 3] - r.origin.z) / r.direction.z;
            var x2 = (unsafe._mem_f64[(max + 8) >> 3] - r.origin.x) / r.direction.x;
            var y2 = (unsafe._mem_f64[(max + 16) >> 3] - r.origin.y) / r.direction.y;
            var z2 = (unsafe._mem_f64[(max + 24) >> 3] - r.origin.z) / r.direction.z;
            var tmp;
            if (x1 > x2) {
                tmp = x1;
                x1 = x2;
                x2 = tmp;
            }
            if (y1 > y2) {
                tmp = y1;
                y1 = y2;
                y2 = tmp;
            }
            if (z1 > z2) {
                tmp = z1;
                z1 = z2;
                z2 = tmp;
            }
            return {
                tmin: Math.max(Math.max(x1, y1), z1),
                tmax: Math.min(Math.min(x2, y2), z2)
            };
        };
        Box.Partition = function (SELF, axis, point) {
            var min = unsafe._mem_i32[(SELF + 4) >> 2];
            var max = unsafe._mem_i32[(SELF + 8) >> 2];
            var left;
            var right;
            switch (axis) {
                case Axis.AxisX:
                    left = unsafe._mem_f64[(min + 8) >> 3] <= point;
                    right = unsafe._mem_f64[(max + 8) >> 3] >= point;
                    break;
                case Axis.AxisY:
                    left = unsafe._mem_f64[(min + 16) >> 3] <= point;
                    right = unsafe._mem_f64[(max + 16) >> 3] >= point;
                    break;
                case Axis.AxisZ:
                    left = unsafe._mem_f64[(min + 24) >> 3] <= point;
                    right = unsafe._mem_f64[(max + 24) >> 3] >= point;
                    break;
            }
            return {
                left: left,
                right: right
            };
        };
        Box.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 1841; return SELF; };
        return Box;
    }(MemoryObject));
    Box.NAME = "Box";
    Box.SIZE = 12;
    Box.ALIGN = 4;
    Box.CLSID = 1841;
    XRAY.Box = Box;
    unsafe._idToType[1841] = Box;
    var Matrix = (function (_super) {
        __extends(Matrix, _super);
        function Matrix(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Matrix, "BASE", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Matrix.init = function (SELF, x00, x01, x02, x03, x10, x11, x12, x13, x20, x21, x22, x23, x30, x31, x32, x33) {
            if (SELF === void 0) { SELF = 0; }
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
            unsafe._mem_f64[(SELF + 8) >> 3] = x00;
            unsafe._mem_f64[(SELF + 16) >> 3] = x01;
            unsafe._mem_f64[(SELF + 24) >> 3] = x02;
            unsafe._mem_f64[(SELF + 32) >> 3] = x03;
            unsafe._mem_f64[(SELF + 40) >> 3] = x10;
            unsafe._mem_f64[(SELF + 48) >> 3] = x11;
            unsafe._mem_f64[(SELF + 56) >> 3] = x12;
            unsafe._mem_f64[(SELF + 64) >> 3] = x13;
            unsafe._mem_f64[(SELF + 72) >> 3] = x20;
            unsafe._mem_f64[(SELF + 80) >> 3] = x21;
            unsafe._mem_f64[(SELF + 88) >> 3] = x22;
            unsafe._mem_f64[(SELF + 96) >> 3] = x23;
            unsafe._mem_f64[(SELF + 104) >> 3] = x30;
            unsafe._mem_f64[(SELF + 112) >> 3] = x31;
            unsafe._mem_f64[(SELF + 120) >> 3] = x32;
            unsafe._mem_f64[(SELF + 128) >> 3] = x33;
            return SELF;
        };
        Matrix.NewMatrix = function (x00, x01, x02, x03, x10, x11, x12, x13, x20, x21, x22, x23, x30, x31, x32, x33) {
            var ptr = Matrix.initInstance(unsafe.alloc(136, 8));
            return Matrix.init(ptr, x00, x01, x02, x03, x10, x11, x12, x13, x20, x21, x22, x23, x30, x31, x32, x33);
        };
        Matrix.fromTHREEJS = function (e) {
            return Matrix.NewMatrix(e[0], e[4], e[8], e[12], e[1], e[5], e[9], e[13], e[2], e[6], e[10], e[14], e[3], e[7], e[11], e[15]);
        };
        Matrix.DATA = function (SELF) {
            return [
                unsafe._mem_f64[(SELF + 8) >> 3], unsafe._mem_f64[(SELF + 16) >> 3], unsafe._mem_f64[(SELF + 24) >> 3], unsafe._mem_f64[(SELF + 32) >> 3],
                unsafe._mem_f64[(SELF + 40) >> 3], unsafe._mem_f64[(SELF + 48) >> 3], unsafe._mem_f64[(SELF + 56) >> 3], unsafe._mem_f64[(SELF + 64) >> 3],
                unsafe._mem_f64[(SELF + 72) >> 3], unsafe._mem_f64[(SELF + 80) >> 3], unsafe._mem_f64[(SELF + 88) >> 3], unsafe._mem_f64[(SELF + 96) >> 3],
                unsafe._mem_f64[(SELF + 104) >> 3], unsafe._mem_f64[(SELF + 112) >> 3], unsafe._mem_f64[(SELF + 120) >> 3], unsafe._mem_f64[(SELF + 128) >> 3]
            ];
        };
        Matrix.Identity = function (c) {
            var ptr = c ? c : Matrix.initInstance(unsafe.alloc(136, 8));
            return Matrix.init(ptr, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        };
        Matrix.IsEqual = function (a, b) {
            return unsafe._mem_f64[(a + 8) >> 3] == unsafe._mem_f64[(b + 8) >> 3] && unsafe._mem_f64[(a + 16) >> 3] == unsafe._mem_f64[(b + 16) >> 3] && unsafe._mem_f64[(a + 24) >> 3] == unsafe._mem_f64[(b + 24) >> 3] && unsafe._mem_f64[(a + 32) >> 3] == unsafe._mem_f64[(b + 32) >> 3] && unsafe._mem_f64[(a + 40) >> 3] == unsafe._mem_f64[(b + 40) >> 3] && unsafe._mem_f64[(a + 48) >> 3] == unsafe._mem_f64[(b + 48) >> 3] && unsafe._mem_f64[(a + 56) >> 3] == unsafe._mem_f64[(b + 56) >> 3] && unsafe._mem_f64[(a + 64) >> 3] == unsafe._mem_f64[(b + 64) >> 3] && unsafe._mem_f64[(a + 72) >> 3] == unsafe._mem_f64[(b + 72) >> 3] && unsafe._mem_f64[(a + 80) >> 3] == unsafe._mem_f64[(b + 80) >> 3] && unsafe._mem_f64[(a + 88) >> 3] == unsafe._mem_f64[(b + 88) >> 3] && unsafe._mem_f64[(a + 96) >> 3] == unsafe._mem_f64[(b + 96) >> 3] && unsafe._mem_f64[(a + 104) >> 3] == unsafe._mem_f64[(b + 104) >> 3] && unsafe._mem_f64[(a + 112) >> 3] == unsafe._mem_f64[(b + 112) >> 3] && unsafe._mem_f64[(a + 120) >> 3] == unsafe._mem_f64[(b + 120) >> 3] && unsafe._mem_f64[(a + 128) >> 3] == unsafe._mem_f64[(b + 128) >> 3];
        };
        Matrix.IsIdentity = function (a) {
            return unsafe._mem_f64[(a + 8) >> 3] == 1 && unsafe._mem_f64[(a + 16) >> 3] == 0 && unsafe._mem_f64[(a + 24) >> 3] == 0 && unsafe._mem_f64[(a + 32) >> 3] == 0 && unsafe._mem_f64[(a + 40) >> 3] == 0 && unsafe._mem_f64[(a + 48) >> 3] == 1 && unsafe._mem_f64[(a + 56) >> 3] == 0 && unsafe._mem_f64[(a + 64) >> 3] == 0 && unsafe._mem_f64[(a + 72) >> 3] == 0 && unsafe._mem_f64[(a + 80) >> 3] == 0 && unsafe._mem_f64[(a + 88) >> 3] == 1 && unsafe._mem_f64[(a + 96) >> 3] == 0 && unsafe._mem_f64[(a + 104) >> 3] == 0 && unsafe._mem_f64[(a + 112) >> 3] == 0 && unsafe._mem_f64[(a + 120) >> 3] == 0 && unsafe._mem_f64[(a + 128) >> 3] == 1;
        };
        Matrix.TranslateUnitMatrix = function (v, c) {
            var ptr = c ? c : Matrix.initInstance(unsafe.alloc(136, 8));
            return Matrix.init(ptr, 1, 0, 0, unsafe._mem_f64[(v + 8) >> 3], 0, 1, 0, unsafe._mem_f64[(v + 16) >> 3], 0, 0, 1, unsafe._mem_f64[(v + 24) >> 3], 0, 0, 0, 1);
        };
        Matrix.ScaleUnitMatrix = function (v, c) {
            var ptr = c ? c : Matrix.initInstance(unsafe.alloc(136, 8));
            return Matrix.init(ptr, unsafe._mem_f64[(v + 8) >> 3], 0, 0, 0, 0, unsafe._mem_f64[(v + 16) >> 3], 0, 0, 0, 0, unsafe._mem_f64[(v + 24) >> 3], 0, 0, 0, 0, 1);
        };
        Matrix.RotateUnitMatrix = function (v, a, _c) {
            v = Vector.Normalize_mem(v);
            var s = Math.sin(a);
            var c = Math.cos(a);
            var m = 1 - c;
            var ptr = _c ? _c : Matrix.initInstance(unsafe.alloc(136, 8));
            return Matrix.init(ptr, m * unsafe._mem_f64[(v + 8) >> 3] * unsafe._mem_f64[(v + 8) >> 3] + c, m * unsafe._mem_f64[(v + 8) >> 3] * unsafe._mem_f64[(v + 16) >> 3] + unsafe._mem_f64[(v + 24) >> 3] * s, m * unsafe._mem_f64[(v + 24) >> 3] * unsafe._mem_f64[(v + 8) >> 3] - unsafe._mem_f64[(v + 16) >> 3] * s, 0, m * unsafe._mem_f64[(v + 8) >> 3] * unsafe._mem_f64[(v + 16) >> 3] - unsafe._mem_f64[(v + 24) >> 3] * s, m * unsafe._mem_f64[(v + 16) >> 3] * unsafe._mem_f64[(v + 16) >> 3] + c, m * unsafe._mem_f64[(v + 16) >> 3] * unsafe._mem_f64[(v + 24) >> 3] + unsafe._mem_f64[(v + 8) >> 3] * s, 0, m * unsafe._mem_f64[(v + 24) >> 3] * unsafe._mem_f64[(v + 8) >> 3] + unsafe._mem_f64[(v + 16) >> 3] * s, m * unsafe._mem_f64[(v + 16) >> 3] * unsafe._mem_f64[(v + 24) >> 3] - unsafe._mem_f64[(v + 8) >> 3] * s, m * unsafe._mem_f64[(v + 24) >> 3] * unsafe._mem_f64[(v + 24) >> 3] + c, 0, 0, 0, 0, 1);
        };
        Matrix.FrustumUnitMatrix = function (l, r, b, t, n, f, c) {
            var t1 = 2 * n;
            var t2 = r - l;
            var t3 = t - b;
            var t4 = f - n;
            var ptr = c ? c : Matrix.initInstance(unsafe.alloc(136, 8));
            return Matrix.init(ptr, t1 / t2, 0, (r + l) / t2, 0, 0, t1 / t3, (t + b) / t3, 0, 0, 0, (-f - n) / t4, (-t1 * f) / t4, 0, 0, -1, 0);
        };
        Matrix.OrthographicUnitMatrix = function (l, r, b, t, n, f, c) {
            var ptr = c ? c : Matrix.initInstance(unsafe.alloc(136, 8));
            return Matrix.init(ptr, 2 / (r - l), 0, 0, -(r + l) / (r - l), 0, 2 / (t - b), 0, -(t + b) / (t - b), 0, 0, -2 / (f - n), -(f + n) / (f - n), 0, 0, 0, 1);
        };
        Matrix.PerspectiveUnitMatrix = function (fovy, aspect, near, far, c) {
            var ymax = near * Math.tan(fovy * Math.PI / 360);
            var xmax = ymax * aspect;
            return Matrix.Frustum(-xmax, xmax, -ymax, ymax, near, far, c);
        };
        Matrix.LookAtMatrix = function (eye, center, up, c) {
            up = Vector.Normalize_mem(up);
            var f = Vector.Normalize_mem(Vector.Sub_mem(center, eye));
            var s = Vector.Normalize_mem(Vector.Cross_mem(f, up));
            var u = Vector.Cross_mem(s, f);
            var ptr = c ? c : Matrix.initInstance(unsafe.alloc(136, 8));
            Matrix.init(ptr, unsafe._mem_f64[(s + 8) >> 3], unsafe._mem_f64[(u + 8) >> 3], unsafe._mem_f64[(f + 8) >> 3], 0, unsafe._mem_f64[(s + 16) >> 3], unsafe._mem_f64[(u + 16) >> 3], unsafe._mem_f64[(f + 16) >> 3], 0, unsafe._mem_f64[(s + 24) >> 3], unsafe._mem_f64[(u + 24) >> 3], unsafe._mem_f64[(f + 24) >> 3], 0, 0, 0, 0, 1);
            return Matrix.Translate(Matrix.Inverse(Matrix.Transpose(ptr, ptr), ptr), eye, ptr);
        };
        Matrix.Translate = function (m, v, c) {
            return Matrix.Mul(m, Matrix.TranslateUnitMatrix(v), c);
        };
        Matrix.Scale = function (m, v, c) {
            return Matrix.Mul(m, Matrix.ScaleUnitMatrix(v), c);
        };
        Matrix.Rotate = function (m, v, a, c) {
            return Matrix.Mul(m, Matrix.RotateUnitMatrix(v, a), c);
        };
        Matrix.Frustum = function (m, l, r, b, t, n, f, c) {
            return Matrix.Mul(m, Matrix.FrustumUnitMatrix(l, r, b, t, n, f, c), c);
        };
        Matrix.Orthographic = function (m, l, r, b, t, n, f, c) {
            return Matrix.Mul(m, Matrix.OrthographicUnitMatrix(l, r, b, t, n, f, c), c);
        };
        Matrix.Perspective = function (m, fovy, aspect, near, far, c) {
            return Matrix.Mul(m, Matrix.PerspectiveUnitMatrix(fovy, aspect, near, far, c), c);
        };
        Matrix.Mul = function (a, b, m) {
            m = m ? m : Matrix.initInstance(unsafe.alloc(136, 8));
            unsafe._mem_f64[(m + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 40) >> 3] + unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 72) >> 3] + unsafe._mem_f64[(a + 32) >> 3] * unsafe._mem_f64[(b + 104) >> 3];
            unsafe._mem_f64[(m + 40) >> 3] = unsafe._mem_f64[(a + 40) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 48) >> 3] * unsafe._mem_f64[(b + 40) >> 3] + unsafe._mem_f64[(a + 56) >> 3] * unsafe._mem_f64[(b + 72) >> 3] + unsafe._mem_f64[(a + 64) >> 3] * unsafe._mem_f64[(b + 104) >> 3];
            unsafe._mem_f64[(m + 72) >> 3] = unsafe._mem_f64[(a + 72) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 80) >> 3] * unsafe._mem_f64[(b + 40) >> 3] + unsafe._mem_f64[(a + 88) >> 3] * unsafe._mem_f64[(b + 72) >> 3] + unsafe._mem_f64[(a + 96) >> 3] * unsafe._mem_f64[(b + 104) >> 3];
            unsafe._mem_f64[(m + 104) >> 3] = unsafe._mem_f64[(a + 104) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 112) >> 3] * unsafe._mem_f64[(b + 40) >> 3] + unsafe._mem_f64[(a + 120) >> 3] * unsafe._mem_f64[(b + 72) >> 3] + unsafe._mem_f64[(a + 128) >> 3] * unsafe._mem_f64[(b + 104) >> 3];
            unsafe._mem_f64[(m + 16) >> 3] = unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 48) >> 3] + unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 80) >> 3] + unsafe._mem_f64[(a + 32) >> 3] * unsafe._mem_f64[(b + 112) >> 3];
            unsafe._mem_f64[(m + 48) >> 3] = unsafe._mem_f64[(a + 40) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 48) >> 3] * unsafe._mem_f64[(b + 48) >> 3] + unsafe._mem_f64[(a + 56) >> 3] * unsafe._mem_f64[(b + 80) >> 3] + unsafe._mem_f64[(a + 64) >> 3] * unsafe._mem_f64[(b + 112) >> 3];
            unsafe._mem_f64[(m + 80) >> 3] = unsafe._mem_f64[(a + 72) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 80) >> 3] * unsafe._mem_f64[(b + 48) >> 3] + unsafe._mem_f64[(a + 88) >> 3] * unsafe._mem_f64[(b + 80) >> 3] + unsafe._mem_f64[(a + 96) >> 3] * unsafe._mem_f64[(b + 112) >> 3];
            unsafe._mem_f64[(m + 112) >> 3] = unsafe._mem_f64[(a + 104) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 112) >> 3] * unsafe._mem_f64[(b + 48) >> 3] + unsafe._mem_f64[(a + 120) >> 3] * unsafe._mem_f64[(b + 80) >> 3] + unsafe._mem_f64[(a + 128) >> 3] * unsafe._mem_f64[(b + 112) >> 3];
            unsafe._mem_f64[(m + 24) >> 3] = unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 24) >> 3] + unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 56) >> 3] + unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 88) >> 3] + unsafe._mem_f64[(a + 32) >> 3] * unsafe._mem_f64[(b + 120) >> 3];
            unsafe._mem_f64[(m + 56) >> 3] = unsafe._mem_f64[(a + 40) >> 3] * unsafe._mem_f64[(b + 24) >> 3] + unsafe._mem_f64[(a + 48) >> 3] * unsafe._mem_f64[(b + 56) >> 3] + unsafe._mem_f64[(a + 56) >> 3] * unsafe._mem_f64[(b + 88) >> 3] + unsafe._mem_f64[(a + 64) >> 3] * unsafe._mem_f64[(b + 120) >> 3];
            unsafe._mem_f64[(m + 88) >> 3] = unsafe._mem_f64[(a + 72) >> 3] * unsafe._mem_f64[(b + 24) >> 3] + unsafe._mem_f64[(a + 80) >> 3] * unsafe._mem_f64[(b + 56) >> 3] + unsafe._mem_f64[(a + 88) >> 3] * unsafe._mem_f64[(b + 88) >> 3] + unsafe._mem_f64[(a + 96) >> 3] * unsafe._mem_f64[(b + 120) >> 3];
            unsafe._mem_f64[(m + 120) >> 3] = unsafe._mem_f64[(a + 104) >> 3] * unsafe._mem_f64[(b + 24) >> 3] + unsafe._mem_f64[(a + 112) >> 3] * unsafe._mem_f64[(b + 56) >> 3] + unsafe._mem_f64[(a + 120) >> 3] * unsafe._mem_f64[(b + 88) >> 3] + unsafe._mem_f64[(a + 128) >> 3] * unsafe._mem_f64[(b + 120) >> 3];
            unsafe._mem_f64[(m + 32) >> 3] = unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 32) >> 3] + unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 64) >> 3] + unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 96) >> 3] + unsafe._mem_f64[(a + 32) >> 3] * unsafe._mem_f64[(b + 128) >> 3];
            unsafe._mem_f64[(m + 64) >> 3] = unsafe._mem_f64[(a + 40) >> 3] * unsafe._mem_f64[(b + 32) >> 3] + unsafe._mem_f64[(a + 48) >> 3] * unsafe._mem_f64[(b + 64) >> 3] + unsafe._mem_f64[(a + 56) >> 3] * unsafe._mem_f64[(b + 96) >> 3] + unsafe._mem_f64[(a + 64) >> 3] * unsafe._mem_f64[(b + 128) >> 3];
            unsafe._mem_f64[(m + 96) >> 3] = unsafe._mem_f64[(a + 72) >> 3] * unsafe._mem_f64[(b + 32) >> 3] + unsafe._mem_f64[(a + 80) >> 3] * unsafe._mem_f64[(b + 64) >> 3] + unsafe._mem_f64[(a + 88) >> 3] * unsafe._mem_f64[(b + 96) >> 3] + unsafe._mem_f64[(a + 96) >> 3] * unsafe._mem_f64[(b + 128) >> 3];
            unsafe._mem_f64[(m + 128) >> 3] = unsafe._mem_f64[(a + 104) >> 3] * unsafe._mem_f64[(b + 32) >> 3] + unsafe._mem_f64[(a + 112) >> 3] * unsafe._mem_f64[(b + 64) >> 3] + unsafe._mem_f64[(a + 120) >> 3] * unsafe._mem_f64[(b + 96) >> 3] + unsafe._mem_f64[(a + 128) >> 3] * unsafe._mem_f64[(b + 128) >> 3];
            return m;
        };
        Matrix.MulPosition = function (a, b, c) {
            var x = unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3] + unsafe._mem_f64[(a + 32) >> 3];
            var y = unsafe._mem_f64[(a + 40) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 48) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 56) >> 3] * unsafe._mem_f64[(b + 24) >> 3] + unsafe._mem_f64[(a + 64) >> 3];
            var z = unsafe._mem_f64[(a + 72) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 80) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 88) >> 3] * unsafe._mem_f64[(b + 24) >> 3] + unsafe._mem_f64[(a + 96) >> 3];
            var ptr = c ? c : Vector.initInstance(unsafe.alloc(32, 8))();
            return Vector.Init_mem(ptr, x, y, z);
        };
        Matrix.MulPosition_vec3 = function (a, b) {
            var x = unsafe._mem_f64[(a + 8) >> 3] * b.x + unsafe._mem_f64[(a + 16) >> 3] * b.y + unsafe._mem_f64[(a + 24) >> 3] * b.z + unsafe._mem_f64[(a + 32) >> 3];
            var y = unsafe._mem_f64[(a + 40) >> 3] * b.x + unsafe._mem_f64[(a + 48) >> 3] * b.y + unsafe._mem_f64[(a + 56) >> 3] * b.z + unsafe._mem_f64[(a + 64) >> 3];
            var z = unsafe._mem_f64[(a + 72) >> 3] * b.x + unsafe._mem_f64[(a + 80) >> 3] * b.y + unsafe._mem_f64[(a + 88) >> 3] * b.z + unsafe._mem_f64[(a + 96) >> 3];
            return new Vector3(x, y, z);
        };
        Matrix.MulDirection = function (a, b, c) {
            var x = unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3];
            var y = unsafe._mem_f64[(a + 40) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 48) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 56) >> 3] * unsafe._mem_f64[(b + 24) >> 3];
            var z = unsafe._mem_f64[(a + 72) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 80) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 88) >> 3] * unsafe._mem_f64[(b + 24) >> 3];
            var ptr = c ? c : Vector.initInstance(unsafe.alloc(32, 8));
            return Vector.Normalize_mem(Vector.Init_mem(ptr, x, y, z));
        };
        Matrix.MulDirection_vec3 = function (a, b) {
            var x = unsafe._mem_f64[(a + 8) >> 3] * b.x + unsafe._mem_f64[(a + 16) >> 3] * b.y + unsafe._mem_f64[(a + 24) >> 3] * b.z;
            var y = unsafe._mem_f64[(a + 40) >> 3] * b.x + unsafe._mem_f64[(a + 48) >> 3] * b.y + unsafe._mem_f64[(a + 56) >> 3] * b.z;
            var z = unsafe._mem_f64[(a + 72) >> 3] * b.x + unsafe._mem_f64[(a + 80) >> 3] * b.y + unsafe._mem_f64[(a + 88) >> 3] * b.z;
            return new Vector3(x, y, z).normalize();
        };
        Matrix.MulRay = function (a, ray) {
            var origin = Matrix.MulPosition_vec3(a, ray.origin);
            var direction = Matrix.MulDirection_vec3(a, ray.direction);
            return new Ray(origin, direction);
        };
        Matrix.MulBox = function (a, box, c) {
            var min = unsafe._mem_i32[(box + 4) >> 2];
            var max = unsafe._mem_i32[(box + 8) >> 2];
            var r = Vector.Init_mem(Vector.initInstance(unsafe.alloc(32, 8)), unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 40) >> 3], unsafe._mem_f64[(a + 72) >> 3]);
            var u = Vector.Init_mem(Vector.initInstance(unsafe.alloc(32, 8)), unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(a + 48) >> 3], unsafe._mem_f64[(a + 80) >> 3]);
            var b = Vector.Init_mem(Vector.initInstance(unsafe.alloc(32, 8)), unsafe._mem_f64[(a + 24) >> 3], unsafe._mem_f64[(a + 56) >> 3], unsafe._mem_f64[(a + 88) >> 3]);
            var t = Vector.Init_mem(Vector.initInstance(unsafe.alloc(32, 8)), unsafe._mem_f64[(a + 32) >> 3], unsafe._mem_f64[(a + 64) >> 3], unsafe._mem_f64[(a + 96) >> 3]);
            var xa = Vector.MulScalar_mem(r, unsafe._mem_f64[(min + 8) >> 3]);
            var xb = Vector.MulScalar_mem(r, unsafe._mem_f64[(max + 8) >> 3]);
            var ya = Vector.MulScalar_mem(u, unsafe._mem_f64[(min + 16) >> 3]);
            var yb = Vector.MulScalar_mem(u, unsafe._mem_f64[(max + 16) >> 3]);
            var za = Vector.MulScalar_mem(b, unsafe._mem_f64[(min + 24) >> 3]);
            var zb = Vector.MulScalar_mem(b, unsafe._mem_f64[(max + 24) >> 3]);
            xa = Vector.Min_mem(xa, xb, r);
            xb = Vector.Max_mem(xa, xb, u);
            ya = Vector.Min_mem(ya, yb, b);
            yb = Vector.Max_mem(ya, yb);
            za = Vector.Min_mem(za, zb);
            zb = Vector.Max_mem(za, zb);
            min = Vector.Add_mem(Vector.Add_mem(Vector.Add_mem(xa, ya), za), t);
            max = Vector.Add_mem(Vector.Add_mem(Vector.Add_mem(xb, yb), zb), t);
            var ptr = c ? c : Box.initInstance(unsafe.alloc(12, 4));
            return Box.Init_mem(ptr, min, max);
        };
        Matrix.Transpose = function (a, c) {
            var ptr = c ? c : Matrix.initInstance(unsafe.alloc(136, 8));
            return Matrix.init(ptr, unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 40) >> 3], unsafe._mem_f64[(a + 72) >> 3], unsafe._mem_f64[(a + 104) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(a + 48) >> 3], unsafe._mem_f64[(a + 80) >> 3], unsafe._mem_f64[(a + 112) >> 3], unsafe._mem_f64[(a + 24) >> 3], unsafe._mem_f64[(a + 56) >> 3], unsafe._mem_f64[(a + 88) >> 3], unsafe._mem_f64[(a + 120) >> 3], unsafe._mem_f64[(a + 32) >> 3], unsafe._mem_f64[(a + 64) >> 3], unsafe._mem_f64[(a + 96) >> 3], unsafe._mem_f64[(a + 128) >> 3]);
        };
        Matrix.Determinant = function (SELF) {
            return (unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] +
                unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] +
                unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] -
                unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] -
                unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] -
                unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] +
                unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] +
                unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] +
                unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] -
                unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] -
                unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] -
                unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3]);
        };
        Matrix.Inverse = function (SELF, c) {
            var m = c ? c : Matrix.initInstance(unsafe.alloc(136, 8));
            var d = Matrix.Determinant(SELF);
            unsafe._mem_f64[(m + 8) >> 3] = (unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] + unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3]) / d;
            unsafe._mem_f64[(m + 16) >> 3] = (unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3]) / d;
            unsafe._mem_f64[(m + 24) >> 3] = (unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3]) / d;
            unsafe._mem_f64[(m + 32) >> 3] = (unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] + unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3]) / d;
            unsafe._mem_f64[(m + 40) >> 3] = (unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] - unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3]) / d;
            unsafe._mem_f64[(m + 48) >> 3] = (unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3]) / d;
            unsafe._mem_f64[(m + 56) >> 3] = (unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3]) / d;
            unsafe._mem_f64[(m + 64) >> 3] = (unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3]) / d;
            unsafe._mem_f64[(m + 72) >> 3] = (unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] + unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] + unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3]) / d;
            unsafe._mem_f64[(m + 80) >> 3] = (unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3]) / d;
            unsafe._mem_f64[(m + 88) >> 3] = (unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 128) >> 3]) / d;
            unsafe._mem_f64[(m + 96) >> 3] = (unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 64) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 96) >> 3]) / d;
            unsafe._mem_f64[(m + 104) >> 3] = (unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3]) / d;
            unsafe._mem_f64[(m + 112) >> 3] = (unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] + unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3]) / d;
            unsafe._mem_f64[(m + 120) >> 3] = (unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 120) >> 3]) / d;
            unsafe._mem_f64[(m + 128) >> 3] = (unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 72) >> 3] + unsafe._mem_f64[(SELF + 24) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 56) >> 3] * unsafe._mem_f64[(SELF + 80) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 40) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3] * unsafe._mem_f64[(SELF + 48) >> 3] * unsafe._mem_f64[(SELF + 88) >> 3]) / d;
            return m;
        };
        Matrix.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 2093537; return SELF; };
        return Matrix;
    }(MemoryObject));
    Matrix.NAME = "Matrix";
    Matrix.SIZE = 136;
    Matrix.ALIGN = 8;
    Matrix.CLSID = 2093537;
    XRAY.Matrix = Matrix;
    unsafe._idToType[2093537] = Matrix;
    var Image = (function (_super) {
        __extends(Image, _super);
        function Image(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Image, "BASE", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Image.init = function (SELF, width, height, depth) {
            if (depth === void 0) { depth = 8; }
            unsafe._mem_i32[(SELF + 4) >> 2] = width;
            unsafe._mem_i32[(SELF + 8) >> 2] = height;
            unsafe._mem_u8[(SELF + 12) >> 0] = depth;
            var len = width * height * 4;
            var pixels = unsafe.alloc(4 + (1 * len), 1);
            unsafe._mem_i32[pixels >> 2] = len;
            unsafe._mem_i32[(SELF + 16) >> 2] = pixels;
            return SELF;
        };
        Image.At = function (SELF, x, y) {
            var i = (y * (unsafe._mem_i32[(SELF + 4) >> 2] * 4)) + (x * 4);
            unsafe._mem_u8[((unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (1 * i)) >> 0];
        };
        Image.setRaw = function (SELF, data) {
            for (var i = 0; i < data.length; i++) {
                unsafe._mem_u8[((unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (1 * i)) >> 0] = (data[i]);
            }
        };
        Image.setRGBA = function (SELF, x, y, c) {
            var i = (y * (unsafe._mem_i32[(SELF + 4) >> 2] * 4)) + (x * 4);
            unsafe._mem_u8[((unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (1 * i)) >> 0] = (c.r * 255);
            unsafe._mem_u8[((unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (1 * (i + 1))) >> 0] = (c.g * 255);
            unsafe._mem_u8[((unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (1 * (i + 2))) >> 0] = (c.b * 255);
            unsafe._mem_u8[((unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (1 * (i + 3))) >> 0] = (c.a * 255);
        };
        Image.NewRGBA = function (width, height) {
            var ptr = Image.initInstance(unsafe.alloc(20, 4));
            Image.init(ptr, width, height, 8);
            return ptr;
        };
        Image.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 150430; return SELF; };
        return Image;
    }(MemoryObject));
    Image.NAME = "Image";
    Image.SIZE = 20;
    Image.ALIGN = 4;
    Image.CLSID = 150430;
    XRAY.Image = Image;
    unsafe._idToType[150430] = Image;
    var Texture = (function (_super) {
        __extends(Texture, _super);
        function Texture(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Texture, "BASE", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Texture.init = function (SELF, width, height, data) {
            unsafe._mem_i32[(SELF + 4) >> 2] = width;
            unsafe._mem_i32[(SELF + 8) >> 2] = height;
            unsafe._mem_i32[(SELF + 12) >> 2] = data;
            return SELF;
        };
        Texture.GetTexture = function (path) {
            var texture = Texture.textures[path];
            if (texture) {
                return texture;
            }
            texture = Texture.LoadTexture(path);
            if (texture) {
                Texture.textures[path] = texture;
                return texture;
            }
            return null;
        };
        Texture.LoadTexture = function (path) {
            console.log("Loading IMG: " + path);
            var im = Utils.LoadImage(path);
            return Texture.NewTexture(im);
        };
        Texture.NewTexture = function (imgData, width, height) {
            var data = unsafe.alloc(4 + (4 * (width * height)), 4);
            unsafe._mem_i32[data >> 2] = (width * height);
            for (var y = 0; y < height; y++) {
                for (var x = 0; x < width; x++) {
                    var i = (y * (width * 4)) + (x * 4);
                    var index = y * width + x;
                    var c = Color.NewColor(imgData[i] / 255, imgData[i + 1] / 255, imgData[i + 2] / 255);
                    unsafe._mem_i32[(data + 4 + (4 * index)) >> 2] = (Color.Pow_mem(c, 2.2, c));
                }
            }
            var ptr = Texture.initInstance(unsafe.alloc(16, 4));
            return Texture.init(ptr, width, height, data);
        };
        Texture.Pow = function (t, a) {
            var data = unsafe._mem_i32[(t + 12) >> 2];
            var len = Texture.DataLength(t);
            for (var i = 0; i < len; i++) {
                var d = unsafe._mem_i32[(data + 4 + (4 * i)) >> 2];
                Color.Pow_mem(d, a, d);
            }
            return t;
        };
        Texture.MulScalar = function (t, a) {
            var data = unsafe._mem_i32[(t + 12) >> 2];
            var len = Texture.DataLength(t);
            for (var i = 0; i < len; i++) {
                var d = unsafe._mem_i32[(data + 4 + (4 * i)) >> 2];
                Color.MulScalar_mem(d, a, d);
            }
            return t;
        };
        Texture.bilinearSample = function (t, u, v) {
            var Width = unsafe._mem_i32[(t + 4) >> 2];
            var Height = unsafe._mem_i32[(t + 8) >> 2];
            var data = unsafe._mem_i32[(t + 12) >> 2];
            var w = Width - 1;
            var h = Height - 1;
            var _ = Utils.Modf(u * w);
            var _x = _.int;
            var x = _.frac;
            _ = Utils.Modf(v * h);
            var _y = _.int;
            var y = _.frac;
            var x0 = _x;
            var y0 = _y;
            var x1 = x0 + 1;
            var y1 = y0 + 1;
            var c00 = unsafe._mem_i32[(data + 4 + (4 * (y0 * Width + x0))) >> 2];
            var c01 = unsafe._mem_i32[(data + 4 + (4 * (y1 * Width + x0))) >> 2];
            var c10 = unsafe._mem_i32[(data + 4 + (4 * (y0 * Width + x1))) >> 2];
            var c11 = unsafe._mem_i32[(data + 4 + (4 * (y1 * Width + x1))) >> 2];
            var c = new Color3();
            c = c.add(Color.MulScalar2(c00, (1 - x) * (1 - y)));
            c = c.add(Color.MulScalar2(c10, x * (1 - y)));
            c = c.add(Color.MulScalar2(c01, (1 - x) * y));
            c = c.add(Color.MulScalar2(c11, x * y));
            return c;
        };
        Texture.Sample = function (t, u, v) {
            u = Utils.Fract(Utils.Fract(u) + 1);
            v = Utils.Fract(Utils.Fract(v) + 1);
            return Texture.bilinearSample(t, u, 1 - v);
        };
        Texture.SimpleSample = function (t, u, v) {
            var Width = unsafe._mem_i32[(t + 4) >> 2];
            var Height = unsafe._mem_i32[(t + 8) >> 2];
            var data = unsafe._mem_i32[(t + 12) >> 2];
            u = Utils.Fract(Utils.Fract(u) + 1);
            v = Utils.Fract(Utils.Fract(v) + 1);
            v = 1 - v;
            var x = Math.round(u * Width);
            var y = Math.round(v * Height);
            var c = Color.toColor3(unsafe._mem_i32[(data + 4 + (4 * (y * Width + x))) >> 2]);
            return c;
        };
        Texture.NormalSample = function (t, u, v, c) {
            var c = Texture.Sample(t, u, v);
            return new Vector3(unsafe._mem_f64[(c + 8) >> 3] * 2 - 1, unsafe._mem_f64[(c + 16) >> 3] * 2 - 1, unsafe._mem_f64[(c + 24) >> 3] * 2 - 1).normalize();
        };
        Texture.BumpSample = function (t, u, v, c) {
            var Width = unsafe._mem_i32[(t + 4) >> 2];
            var Height = unsafe._mem_i32[(t + 8) >> 2];
            var data = unsafe._mem_i32[(t + 12) >> 2];
            u = Utils.FractAddOne(u);
            v = Utils.FractAddOne(v);
            v = 1 - v;
            var x = parseInt(u * Width);
            var y = parseInt(v * Height);
            var x1 = Utils.ClampInt(x - 1, 0, Width - 1);
            var x2 = Utils.ClampInt(x + 1, 0, Width - 1);
            var y1 = Utils.ClampInt(y - 1, 0, Height - 1);
            var y2 = Utils.ClampInt(y + 1, 0, Height - 1);
            var cx = Color.Sub_mem2(unsafe._mem_i32[(data + 4 + (4 * (y * Width + x1))) >> 2], unsafe._mem_i32[(data + 4 + (4 * (y * Width + x2))) >> 2]);
            var cy = Color.Sub_mem2(unsafe._mem_i32[(data + 4 + (4 * (y1 * Width + x))) >> 2], unsafe._mem_i32[(data + 4 + (4 * (y2 * Width + x))) >> 2]);
            return new Vector3(cx.r, cy.r, 0);
        };
        Texture.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 10502342; return SELF; };
        return Texture;
    }(MemoryObject));
    Texture.NAME = "Texture";
    Texture.SIZE = 16;
    Texture.ALIGN = 4;
    Texture.CLSID = 10502342;
    Texture.textures = [];
    XRAY.Texture = Texture;
    unsafe._idToType[10502342] = Texture;
    var Material = (function (_super) {
        __extends(Material, _super);
        function Material(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Material, "BASE", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Material.init = function (SELF, Color, Texture, NormalTexture, BumpTexture, GlossTexture, BumpMultiplier, Emittance, Index, Gloss, Tint, Reflectivity, Transparent) {
            unsafe._mem_i32[(SELF + 4) >> 2] = Color;
            unsafe._mem_i32[(SELF + 8) >> 2] = Texture;
            unsafe._mem_i32[(SELF + 12) >> 2] = NormalTexture;
            unsafe._mem_i32[(SELF + 16) >> 2] = BumpTexture;
            unsafe._mem_i32[(SELF + 20) >> 2] = GlossTexture;
            unsafe._mem_f64[(SELF + 24) >> 3] = BumpMultiplier;
            unsafe._mem_f64[(SELF + 32) >> 3] = Emittance;
            unsafe._mem_f64[(SELF + 40) >> 3] = Index;
            unsafe._mem_f64[(SELF + 48) >> 3] = Gloss;
            unsafe._mem_f64[(SELF + 56) >> 3] = Tint;
            unsafe._mem_f64[(SELF + 64) >> 3] = Reflectivity;
            unsafe._mem_u8[(SELF + 72) >> 0] = Transparent;
            return SELF;
        };
        Material.IsLight = function (SELF) {
            return unsafe._mem_f64[(SELF + 32) >> 3] > 0;
        };
        Material.Clone = function (SELF, c) {
            var ptr = c ? c : Material.initInstance(unsafe.alloc(73, 8));
            return Material.init(ptr, Color.Clone(unsafe._mem_i32[(SELF + 4) >> 2]), unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 12) >> 2], unsafe._mem_i32[(SELF + 16) >> 2], unsafe._mem_i32[(SELF + 20) >> 2], unsafe._mem_f64[(SELF + 24) >> 3], unsafe._mem_f64[(SELF + 32) >> 3], unsafe._mem_f64[(SELF + 40) >> 3], unsafe._mem_f64[(SELF + 48) >> 3], unsafe._mem_f64[(SELF + 56) >> 3], unsafe._mem_f64[(SELF + 64) >> 3], unsafe._mem_u8[(SELF + 72) >> 0]);
        };
        Material.ToJSON = function (SELF) {
            return {
                ptr: SELF,
                color: Color.RGBA(unsafe._mem_i32[(SELF + 4) >> 2]),
                texture: unsafe._mem_i32[(SELF + 8) >> 2],
                normalTexture: unsafe._mem_i32[(SELF + 12) >> 2],
                bumpTexture: unsafe._mem_i32[(SELF + 16) >> 2],
                glossTexture: unsafe._mem_i32[(SELF + 20) >> 2],
                bumpMultiplier: unsafe._mem_f64[(SELF + 24) >> 3],
                emittance: unsafe._mem_f64[(SELF + 32) >> 3],
                index: unsafe._mem_f64[(SELF + 40) >> 3],
                gloss: unsafe._mem_f64[(SELF + 48) >> 3],
                tint: unsafe._mem_f64[(SELF + 56) >> 3],
                reflectivity: unsafe._mem_f64[(SELF + 64) >> 3],
                transparent: unsafe._mem_u8[(SELF + 72) >> 0]
            };
        };
        Material.setEmittance = function (SELF, Emittance) {
            unsafe._mem_f64[(SELF + 32) >> 3] = Emittance;
        };
        Material.setIndex = function (SELF, Index) {
            unsafe._mem_f64[(SELF + 40) >> 3] = Index;
        };
        Material.setGloss = function (SELF, Gloss) {
            unsafe._mem_f64[(SELF + 48) >> 3] = Gloss;
        };
        Material.setTint = function (SELF, Tint) {
            unsafe._mem_f64[(SELF + 56) >> 3] = Tint;
        };
        Material.setReflectivity = function (SELF, Reflectivity) {
            unsafe._mem_f64[(SELF + 64) >> 3] = Reflectivity;
        };
        Material.setTransparent = function (SELF, Transparent) {
            unsafe._mem_u8[(SELF + 72) >> 0] = Transparent;
        };
        Material.setTexture = function (SELF, Texture) {
            unsafe._mem_i32[(SELF + 8) >> 2] = Texture;
        };
        Material.setNormalTexture = function (SELF, NormalTexture) {
            unsafe._mem_i32[(SELF + 12) >> 2] = NormalTexture;
        };
        Material.setBumpTexture = function (SELF, BumpTexture) {
            unsafe._mem_i32[(SELF + 16) >> 2] = BumpTexture;
        };
        Material.setBumpMultiplier = function (SELF, BumpMultiplier) {
            unsafe._mem_f64[(SELF + 24) >> 3] = BumpMultiplier;
        };
        Material.setGlossTexture = function (SELF, GlossTexture) {
            unsafe._mem_i32[(SELF + 20) >> 2] = GlossTexture;
        };
        Material.DiffuseMaterial = function (color) {
            var ptr = Material.initInstance(unsafe.alloc(73, 8));
            return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, 1, 0, 0, -1, false);
        };
        Material.SpecularMaterial = function (color, index) {
            var ptr = Material.initInstance(unsafe.alloc(73, 8));
            return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, index, 0, 0, -1, false);
        };
        Material.GlossyMaterial = function (color, index, gloss) {
            var ptr = Material.initInstance(unsafe.alloc(73, 8));
            return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, index, gloss, 0, -1, false);
        };
        Material.ClearMaterial = function (index, gloss) {
            var ptr = Material.initInstance(unsafe.alloc(73, 8));
            return Material.init(ptr, Color.BLACK, 0, 0, 0, 0, 1, 0, index, gloss, 0, -1, true);
        };
        Material.TransparentMaterial = function (color, index, gloss, tint) {
            var ptr = Material.initInstance(unsafe.alloc(73, 8));
            return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, index, gloss, tint, -1, true);
        };
        Material.MetallicMaterial = function (color, gloss, tint) {
            var ptr = Material.initInstance(unsafe.alloc(73, 8));
            return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, 1, gloss, tint, -1, false);
        };
        Material.LightMaterial = function (color, emittance) {
            var ptr = Material.initInstance(unsafe.alloc(73, 8));
            return Material.init(ptr, color, 0, 0, 0, 0, 1, emittance, 1, 0, 0, -1, false);
        };
        Material.MaterialAt = function (shape, point) {
            var material = Shape.MaterialAt(shape, point);
            var uv = Shape.UV(shape, point);
            if (unsafe._mem_i32[(material + 8) >> 2]) {
                Color.init(unsafe._mem_i32[(material + 4) >> 2], Texture.Sample(unsafe._mem_i32[(material + 8) >> 2], uv.x, uv.y));
            }
            if (unsafe._mem_i32[(material + 20) >> 2]) {
                var c = Texture.Sample(unsafe._mem_i32[(material + 20) >> 2], uv.x, uv.y);
                unsafe._mem_f64[(material + 48) >> 3] = (c.r + c.g + c.b) / 3;
            }
            return material;
        };
        Material.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 167722613; return SELF; };
        return Material;
    }(MemoryObject));
    Material.NAME = "Material";
    Material.SIZE = 73;
    Material.ALIGN = 8;
    Material.CLSID = 167722613;
    XRAY.Material = Material;
    unsafe._idToType[167722613] = Material;
    var Ray = (function () {
        function Ray(origin, direction) {
            this.origin = origin;
            this.direction = direction;
        }
        Ray.prototype.position = function (t) {
            return this.origin.add(this.direction.mulScalar(t));
        };
        Ray.prototype.reflect = function (i) {
            return new Ray(this.origin, this.direction.reflect(i.direction));
        };
        Ray.prototype.refract = function (i, n1, n2) {
            return new Ray(this.origin, this.direction.refract(i.direction, n1, n2));
        };
        Ray.prototype.reflectance = function (i, n1, n2) {
            return this.direction.reflectance(i.direction, n1, n2);
        };
        Ray.prototype.weightedBounce = function (u, v) {
            var m1 = Math.sqrt(u);
            var m2 = Math.sqrt(1 - u);
            var a = v * 2 * Math.PI;
            var q = new Vector3(u - 0.5, v - 0.5, u + v - 1);
            var s = this.direction.cross(q.normalize());
            var t = this.direction.cross(s);
            var d = new Vector3();
            d = d.add(s.mulScalar(m1 * Math.cos(a)));
            d = d.add(t.mulScalar(m1 * Math.sin(a)));
            d = d.add(this.direction.mulScalar(m2));
            return new Ray(this.origin, d);
        };
        Ray.prototype.coneBounce = function (theta, u, v, c) {
            return new Ray(this.origin, Utils.Cone(this.direction, theta, u, v));
        };
        Ray.prototype.bounce2 = function (info, p, u, v) {
            var n = info.Ray;
            F;
            var material = info.Material;
            var n1 = 1.0;
            var n2 = unsafe._mem_f64[(material + 40) >> 3];
            var gloss = unsafe._mem_f64[(material + 48) >> 3];
            var transparent = unsafe._mem_u8[(material + 72) >> 0];
            if (info.Inside) {
                var _n1 = n1;
                n1 = n2;
                n2 = _n1;
            }
            if (p < n.reflectance(this, n1, n2)) {
                var reflected = n.reflect(this);
                var ray = reflected.coneBounce(gloss, u, v);
                return { ray: ray, reflected: true };
            }
            else if (transparent) {
                var refracted = n.Refract(this, n1, n2);
                var ray = refracted.coneBounce(gloss, u, v);
                return { ray: ray, reflected: true };
            }
            else {
                var ray = n.weightedBounce(u, v);
                return { ray: ray, reflected: false };
            }
        };
        Ray.prototype.bounce = function (info, u, v, bounceType) {
            var n = info.Ray;
            var material = info.Material;
            var n1 = 1.0;
            var n2 = unsafe._mem_f64[(material + 40) >> 3];
            if (info.Inside) {
                var tmp = n1;
                n1 = n2;
                n2 = tmp;
            }
            var p;
            if (unsafe._mem_f64[(material + 64) >> 3] >= 0) {
                p = unsafe._mem_f64[(material + 64) >> 3];
            }
            else {
                p = n.reflectance(this, n1, n2);
            }
            var reflect;
            switch (bounceType) {
                case BounceType.Any:
                    reflect = Math.random() < p;
                    break;
                case BounceType.Diffuse:
                    reflect = false;
                    break;
                case BounceType.Specular:
                    reflect = true;
                    break;
            }
            if (reflect) {
                var reflected = n.reflect(this);
                return { ray: reflected.coneBounce(unsafe._mem_f64[(material + 48) >> 3], u, v), reflected: true, coefficient: p };
            }
            else if (unsafe._mem_u8[(material + 72) >> 0]) {
                var refracted = n.refract(this, n1, n2);
                refracted.origin = refracted.origin.add(refracted.direction.mulScalar(1e-4));
                return { ray: refracted.coneBounce(unsafe._mem_f64[(material + 48) >> 3], u, v), reflected: true, coefficient: 1 - p };
            }
            else {
                return { ray: n.weightedBounce(u, v), reflected: false, coefficient: 1 - p };
            }
        };
        return Ray;
    }());
    XRAY.Ray = Ray;
    (function (ShapeType) {
        ShapeType[ShapeType["UNKNOWN"] = 0] = "UNKNOWN";
        ShapeType[ShapeType["PLANE"] = 1] = "PLANE";
        ShapeType[ShapeType["CUBE"] = 2] = "CUBE";
        ShapeType[ShapeType["SPHERE"] = 3] = "SPHERE";
        ShapeType[ShapeType["TRIANGLE"] = 4] = "TRIANGLE";
        ShapeType[ShapeType["MESH"] = 5] = "MESH";
        ShapeType[ShapeType["Volume"] = 6] = "Volume";
        ShapeType[ShapeType["SDFShape"] = 7] = "SDFShape";
    })(XRAY.ShapeType || (XRAY.ShapeType = {}));
    var ShapeType = XRAY.ShapeType;
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Shape, "BASE", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Shape.init = function (SELF, id) {
            unsafe._mem_u32[(SELF + 4) >> 2] = id;
            return SELF;
        };
        Shape.Type_impl = function (SELF) {
            throw ShapeType.UNKNOWN;
        };
        Shape.ToJSON_impl = function (SELF) {
            throw "Pure: Shape.ToJSON()";
        };
        Shape.Compile_impl = function (SELF, c) {
            throw "Pure: Shape.Compile()";
        };
        Shape.BoundingBox_impl = function (SELF, c) {
            throw "Pure: Shape.BoundingBox()";
        };
        Shape.Intersect_impl = function (SELF, ray, c) {
            throw "Pure: Shape.Intersect()";
        };
        Shape.UV_impl = function (SELF, p, c) {
            throw "Pure: Shape.UV()";
        };
        Shape.NormalAt_impl = function (SELF, p, c) {
            throw "Pure: Shape.NormalAt()";
        };
        Shape.MaterialAt_impl = function (SELF, p, c) {
            throw "Pure: Shape.MaterialAt()";
        };
        Shape.Type = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 255446:
                    return Shape.Type_impl(SELF);
                case 124486674:
                    return TransformedShape.Type_impl(SELF);
                case 48824165:
                    return Cube.Type_impl(SELF);
                case 171432461:
                    return Sphere.Type_impl(SELF);
                case 232773086:
                    return Triangle.Type_impl(SELF);
                case 48819938:
                    return Mesh.Type_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Shape.ToJSON = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 255446:
                    return Shape.ToJSON_impl(SELF);
                case 124486674:
                    return TransformedShape.ToJSON_impl(SELF);
                case 48824165:
                    return Cube.ToJSON_impl(SELF);
                case 171432461:
                    return Sphere.ToJSON_impl(SELF);
                case 232773086:
                    return Triangle.ToJSON_impl(SELF);
                case 48819938:
                    return Mesh.ToJSON_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Shape.Compile = function (SELF, c) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 255446:
                    return Shape.Compile_impl(SELF, c);
                case 124486674:
                    return TransformedShape.Compile_impl(SELF, c);
                case 48824165:
                    return Cube.Compile_impl(SELF, c);
                case 171432461:
                    return Sphere.Compile_impl(SELF, c);
                case 232773086:
                    return Triangle.Compile_impl(SELF, c);
                case 48819938:
                    return Mesh.Compile_impl(SELF, c);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Shape.BoundingBox = function (SELF, c) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 255446:
                    return Shape.BoundingBox_impl(SELF, c);
                case 124486674:
                    return TransformedShape.BoundingBox_impl(SELF, c);
                case 48824165:
                    return Cube.BoundingBox_impl(SELF, c);
                case 171432461:
                    return Sphere.BoundingBox_impl(SELF, c);
                case 232773086:
                    return Triangle.BoundingBox_impl(SELF, c);
                case 48819938:
                    return Mesh.BoundingBox_impl(SELF, c);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Shape.Intersect = function (SELF, ray, c) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 255446:
                    return Shape.Intersect_impl(SELF, ray, c);
                case 124486674:
                    return TransformedShape.Intersect_impl(SELF, ray, c);
                case 48824165:
                    return Cube.Intersect_impl(SELF, ray, c);
                case 171432461:
                    return Sphere.Intersect_impl(SELF, ray, c);
                case 232773086:
                    return Triangle.Intersect_impl(SELF, ray, c);
                case 48819938:
                    return Mesh.Intersect_impl(SELF, ray, c);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Shape.UV = function (SELF, p, c) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 255446:
                    return Shape.UV_impl(SELF, p, c);
                case 124486674:
                    return TransformedShape.UV_impl(SELF, p, c);
                case 48824165:
                    return Cube.UV_impl(SELF, p, c);
                case 171432461:
                    return Sphere.UV_impl(SELF, p, c);
                case 232773086:
                    return Triangle.UV_impl(SELF, p, c);
                case 48819938:
                    return Mesh.UV_impl(SELF, p, c);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Shape.NormalAt = function (SELF, p, c) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 255446:
                    return Shape.NormalAt_impl(SELF, p, c);
                case 124486674:
                    return TransformedShape.NormalAt_impl(SELF, p, c);
                case 48824165:
                    return Cube.NormalAt_impl(SELF, p, c);
                case 171432461:
                    return Sphere.NormalAt_impl(SELF, p, c);
                case 232773086:
                    return Triangle.NormalAt_impl(SELF, p, c);
                case 48819938:
                    return Mesh.NormalAt_impl(SELF, p, c);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Shape.MaterialAt = function (SELF, p, c) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 255446:
                    return Shape.MaterialAt_impl(SELF, p, c);
                case 124486674:
                    return TransformedShape.MaterialAt_impl(SELF, p, c);
                case 48824165:
                    return Cube.MaterialAt_impl(SELF, p, c);
                case 171432461:
                    return Sphere.MaterialAt_impl(SELF, p, c);
                case 232773086:
                    return Triangle.MaterialAt_impl(SELF, p, c);
                case 48819938:
                    return Mesh.MaterialAt_impl(SELF, p, c);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Shape.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 255446; return SELF; };
        return Shape;
    }(MemoryObject));
    Shape.NAME = "Shape";
    Shape.SIZE = 8;
    Shape.ALIGN = 4;
    Shape.CLSID = 255446;
    XRAY.Shape = Shape;
    unsafe._idToType[255446] = Shape;
    var TransformedShape = (function (_super) {
        __extends(TransformedShape, _super);
        function TransformedShape(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(TransformedShape, "BASE", {
            get: function () {
                return Shape;
            },
            enumerable: true,
            configurable: true
        });
        TransformedShape.init = function (SELF, shape, matrix) {
            unsafe._mem_i32[(SELF + 12) >> 2] = shape;
            unsafe._mem_i32[(SELF + 16) >> 2] = matrix;
            unsafe._mem_i32[(SELF + 20) >> 2] = (Matrix.Inverse(matrix));
            unsafe._mem_i32[(SELF + 24) >> 2] = (Matrix.Transpose(unsafe._mem_i32[(SELF + 20) >> 2]));
            return SELF;
        };
        TransformedShape.NewTransformedShape = function (s, m) {
            return TransformedShape.init(TransformedShape.initInstance(unsafe.alloc(28, 4)), s, m);
        };
        TransformedShape.BoundingBox_impl = function (SELF) {
            if (!unsafe._mem_i32[(SELF + 8) >> 2]) {
                unsafe._mem_i32[(SELF + 8) >> 2] = (Matrix.MulBox(unsafe._mem_i32[(SELF + 16) >> 2], Shape.BoundingBox(unsafe._mem_i32[(SELF + 12) >> 2])));
            }
            return unsafe._mem_i32[(SELF + 8) >> 2];
        };
        TransformedShape.Intersect_impl = function (SELF, r) {
            var invMat = unsafe._mem_i32[(SELF + 20) >> 2];
            var shapeRay = Matrix.MulRay(invMat, r);
            var hit = Shape.Intersect(unsafe._mem_i32[(SELF + 12) >> 2], shapeRay);
            if (!hit.Ok()) {
                return hit;
            }
            var transMat = unsafe._mem_i32[(SELF + 24) >> 2];
            var shape = hit.Shape;
            var shapePosition = shapeRay.position(hit.T);
            var shapeNormal = Shape.NormalAt(shape, shapePosition);
            var position = Matrix.MulPosition_vec3(unsafe._mem_i32[(SELF + 16) >> 2], shapePosition);
            var normal = Matrix.MulDirection_vec3(transMat, shapeNormal);
            var material = Material.MaterialAt(shape, shapePosition);
            var inside = false;
            if (shapeNormal.dot(shapeRay.direction) > 0) {
                normal = normal.negate();
                inside = true;
            }
            var ray = new Ray(position, normal);
            var info = new HitInfo(shape, position, normal, ray, material, inside);
            hit.T = position.sub(r.origin).length();
            hit.HitInfo = info;
            return hit;
        };
        TransformedShape.Type_impl = function (SELF) {
            return Shape.Type(unsafe._mem_i32[(SELF + 12) >> 2]);
        };
        TransformedShape.ToJSON_impl = function (SELF) {
            var json = Shape.ToJSON(unsafe._mem_i32[(SELF + 12) >> 2]);
            json.box = Box.ToJSON(TransformedShape.BoundingBox(SELF));
            return json;
        };
        TransformedShape.Compile_impl = function (SELF, c) {
            return Shape.Compile(unsafe._mem_i32[(SELF + 12) >> 2], c);
        };
        TransformedShape.UV_impl = function (SELF, p, c) {
            return Shape.UV(unsafe._mem_i32[(SELF + 12) >> 2], p, c);
        };
        TransformedShape.NormalAt_impl = function (SELF, p, c) {
            return Shape.NormalAt(unsafe._mem_i32[(SELF + 12) >> 2], p, c);
        };
        TransformedShape.MaterialAt_impl = function (SELF, p, c) {
            return Shape.MaterialAt(unsafe._mem_i32[(SELF + 12) >> 2], p, c);
        };
        TransformedShape.BoundingBox = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 124486674:
                    return TransformedShape.BoundingBox_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        TransformedShape.Intersect = function (SELF, r) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 124486674:
                    return TransformedShape.Intersect_impl(SELF, r);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        TransformedShape.Type = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 124486674:
                    return TransformedShape.Type_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        TransformedShape.ToJSON = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 124486674:
                    return TransformedShape.ToJSON_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        TransformedShape.Compile = function (SELF, c) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 124486674:
                    return TransformedShape.Compile_impl(SELF, c);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        TransformedShape.UV = function (SELF, p, c) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 124486674:
                    return TransformedShape.UV_impl(SELF, p, c);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        TransformedShape.NormalAt = function (SELF, p, c) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 124486674:
                    return TransformedShape.NormalAt_impl(SELF, p, c);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        TransformedShape.MaterialAt = function (SELF, p, c) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 124486674:
                    return TransformedShape.MaterialAt_impl(SELF, p, c);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        TransformedShape.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 124486674; return SELF; };
        return TransformedShape;
    }(Shape));
    TransformedShape.NAME = "TransformedShape";
    TransformedShape.SIZE = 28;
    TransformedShape.ALIGN = 4;
    TransformedShape.CLSID = 124486674;
    XRAY.TransformedShape = TransformedShape;
    unsafe._idToType[124486674] = TransformedShape;
    var Cube = (function (_super) {
        __extends(Cube, _super);
        function Cube(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Cube, "BASE", {
            get: function () {
                return Shape;
            },
            enumerable: true,
            configurable: true
        });
        Cube.init = function (SELF, min, max, material, box) {
            unsafe._mem_i32[(SELF + 8) >> 2] = min;
            unsafe._mem_i32[(SELF + 12) >> 2] = max;
            unsafe._mem_i32[(SELF + 16) >> 2] = material;
            unsafe._mem_i32[(SELF + 20) >> 2] = box;
            return SELF;
        };
        Cube.NewCube = function (min, max, material) {
            var box = Box.Init_mem(Box.initInstance(unsafe.alloc(12, 4)), min, max);
            return Cube.init(Cube.initInstance(unsafe.alloc(24, 4)), min, max, material, box);
        };
        Cube.Type_impl = function (SELF) {
            throw ShapeType.CUBE;
        };
        Cube.ToJSON_impl = function (SELF) {
            return {
                min: Vector.ToJSON(unsafe._mem_i32[(SELF + 8) >> 2]),
                max: Vector.ToJSON(unsafe._mem_i32[(SELF + 12) >> 2]),
                material: Material.ToJSON(unsafe._mem_i32[(SELF + 16) >> 2]),
                box: Box.ToJSON(unsafe._mem_i32[(SELF + 20) >> 2]),
            };
        };
        Cube.Compile_impl = function (SELF) {
        };
        Cube.BoundingBox_impl = function (SELF) {
            return unsafe._mem_i32[(SELF + 20) >> 2];
        };
        Cube.Intersect_impl = function (SELF, r) {
            var min = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
            var max = new Vector3().read(unsafe._mem_i32[(SELF + 12) >> 2]);
            var n = min.sub(r.origin).div(r.direction);
            var f = max.sub(r.origin).div(r.direction);
            var _n = n.min(f);
            var _f = n.max(f);
            var t0 = Math.max(Math.max(_n.x, _n.y), _n.z);
            var t1 = Math.min(Math.min(_f.x, _f.y), _f.z);
            min = null;
            max = null;
            if (t0 > 0 && t0 < t1) {
                return new Hit(SELF, t0, null);
            }
            return Hit.NoHit;
        };
        Cube.UV_impl = function (SELF, p) {
            var min = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
            var max = new Vector3().read(unsafe._mem_i32[(SELF + 12) >> 2]);
            var uv = p.sub(min).div(max.sub(min));
            min = null;
            max = null;
            return new Vector3(uv.x, uv.z, 0);
        };
        Cube.MaterialAt_impl = function (SELF, p) {
            return unsafe._mem_i32[(SELF + 16) >> 2];
        };
        Cube.NormalAt_impl = function (SELF, p) {
            var min = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
            var max = new Vector3().read(unsafe._mem_i32[(SELF + 12) >> 2]);
            if (p.x < min.x + EPS) {
                return new Vector3(-1, 0, 0);
            }
            else if (p.x > max.x - EPS) {
                return new Vector3(1, 0, 0);
            }
            else if (p.y < min.y + EPS) {
                return new Vector3(0, -1, 0);
            }
            else if (p.y > max.y - EPS) {
                return new Vector3(0, 1, 0);
            }
            else if (p.z < min.z + EPS) {
                return new Vector3(0, 0, -1);
            }
            else if (p.z > max.z - EPS) {
                return new Vector3(0, 0, 1);
            }
            min = null;
            max = null;
            return new Vector3(0, 1, 0);
        };
        Cube.Mesh = function (SELF) {
            var a = unsafe._mem_i32[(SELF + 8) >> 2];
            var b = unsafe._mem_i32[(SELF + 12) >> 2];
            var z = Vector.NewVector();
            var m = unsafe._mem_i32[(SELF + 16) >> 2];
            var v000 = Vector.NewVector(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3]);
            var v001 = Vector.NewVector(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(b + 24) >> 3]);
            var v010 = Vector.NewVector(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3]);
            var v011 = Vector.NewVector(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(b + 24) >> 3]);
            var v100 = Vector.NewVector(unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3]);
            var v101 = Vector.NewVector(unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(b + 24) >> 3]);
            var v110 = Vector.NewVector(unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3]);
            var v111 = Vector.NewVector(unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(b + 24) >> 3]);
            var triangles = [
                Triangle.NewTriangle(v000, v100, v110, z, z, z, m),
                Triangle.NewTriangle(v000, v110, v010, z, z, z, m),
                Triangle.NewTriangle(v001, v101, v111, z, z, z, m),
                Triangle.NewTriangle(v001, v111, v011, z, z, z, m),
                Triangle.NewTriangle(v000, v100, v101, z, z, z, m),
                Triangle.NewTriangle(v000, v101, v001, z, z, z, m),
                Triangle.NewTriangle(v010, v110, v111, z, z, z, m),
                Triangle.NewTriangle(v010, v111, v011, z, z, z, m),
                Triangle.NewTriangle(v000, v010, v011, z, z, z, m),
                Triangle.NewTriangle(v000, v011, v001, z, z, z, m),
                Triangle.NewTriangle(v100, v110, v111, z, z, z, m),
                Triangle.NewTriangle(v100, v111, v101, z, z, z, m)
            ];
            return Mesh.NewMesh(Triangle.Pack(triangles));
        };
        Cube.Type = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48824165:
                    return Cube.Type_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Cube.ToJSON = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48824165:
                    return Cube.ToJSON_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Cube.Compile = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48824165:
                    return Cube.Compile_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Cube.BoundingBox = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48824165:
                    return Cube.BoundingBox_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Cube.Intersect = function (SELF, r) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48824165:
                    return Cube.Intersect_impl(SELF, r);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Cube.UV = function (SELF, p) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48824165:
                    return Cube.UV_impl(SELF, p);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Cube.MaterialAt = function (SELF, p) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48824165:
                    return Cube.MaterialAt_impl(SELF, p);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Cube.NormalAt = function (SELF, p) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48824165:
                    return Cube.NormalAt_impl(SELF, p);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Cube.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 48824165; return SELF; };
        return Cube;
    }(Shape));
    Cube.NAME = "Cube";
    Cube.SIZE = 24;
    Cube.ALIGN = 4;
    Cube.CLSID = 48824165;
    XRAY.Cube = Cube;
    unsafe._idToType[48824165] = Cube;
    var Sphere = (function (_super) {
        __extends(Sphere, _super);
        function Sphere(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Sphere, "BASE", {
            get: function () {
                return Shape;
            },
            enumerable: true,
            configurable: true
        });
        Sphere.init = function (SELF, center, radius, material, box) {
            unsafe._mem_i32[(SELF + 8) >> 2] = center;
            unsafe._mem_f64[(SELF + 16) >> 3] = radius;
            unsafe._mem_i32[(SELF + 24) >> 2] = material;
            unsafe._mem_i32[(SELF + 28) >> 2] = box;
            return SELF;
        };
        Sphere.NewSphere = function (center, radius, material) {
            var min = Vector.initInstance(unsafe.alloc(32, 8));
            var max = Vector.initInstance(unsafe.alloc(32, 8));
            Vector.Init_mem(min, unsafe._mem_f64[(center + 8) >> 3] - radius, unsafe._mem_f64[(center + 16) >> 3] - radius, unsafe._mem_f64[(center + 24) >> 3] - radius);
            Vector.Init_mem(max, unsafe._mem_f64[(center + 8) >> 3] + radius, unsafe._mem_f64[(center + 16) >> 3] + radius, unsafe._mem_f64[(center + 24) >> 3] + radius);
            var box = Box.initInstance(unsafe.alloc(12, 4));
            Box.Init_mem(box, min, max);
            var ptr = Sphere.initInstance(unsafe.alloc(32, 8));
            return Sphere.init(ptr, center, radius, material, box);
        };
        Sphere.Type_impl = function (SELF) {
            return ShapeType.SPHERE;
        };
        Sphere.ToJSON_impl = function (SELF) {
            return {
                center: Vector.ToJSON(unsafe._mem_i32[(SELF + 8) >> 2]),
                radius: unsafe._mem_f64[(SELF + 16) >> 3],
                material: Material.ToJSON(unsafe._mem_i32[(SELF + 24) >> 2]),
                box: Box.ToJSON(unsafe._mem_i32[(SELF + 28) >> 2]),
            };
        };
        Sphere.Compile_impl = function (SELF) {
        };
        Sphere.BoundingBox_impl = function (SELF) {
            return unsafe._mem_i32[(SELF + 28) >> 2];
        };
        Sphere.Intersect_impl = function (SELF, r) {
            var center = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
            var to = r.origin.sub(center);
            var b = to.dot(r.direction);
            var c = to.dot(to) - unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 16) >> 3];
            var d = b * b - c;
            center = null;
            if (d > 0) {
                d = Math.sqrt(d);
                var t1 = -b - d;
                if (t1 > EPS) {
                    return new Hit(SELF, t1, null);
                }
                var t2 = -b + d;
                if (t2 > EPS) {
                    return new Hit(SELF, t2, null);
                }
            }
            return Hit.NoHit;
        };
        Sphere.UV_impl = function (SELF, p) {
            var center = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
            p = p.sub(center);
            u = Math.atan2(p.z, p.x);
            v = Math.atan2(p.y, new Vector3(p.x, 0, p.z).length());
            u = 1 - (u + Math.PI) / (2 * Math.PI);
            v = (v + Math.PI / 2) / Math.PI;
            center = null;
            return new Vector3(u, v, 0);
        };
        Sphere.MaterialAt_impl = function (SELF, _p) {
            return unsafe._mem_i32[(SELF + 24) >> 2];
        };
        Sphere.NormalAt_impl = function (SELF, p) {
            var center = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
            var p = p.sub(center).normalize();
            center = null;
            return p;
        };
        Sphere.Type = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 171432461:
                    return Sphere.Type_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Sphere.ToJSON = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 171432461:
                    return Sphere.ToJSON_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Sphere.Compile = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 171432461:
                    return Sphere.Compile_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Sphere.BoundingBox = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 171432461:
                    return Sphere.BoundingBox_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Sphere.Intersect = function (SELF, r) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 171432461:
                    return Sphere.Intersect_impl(SELF, r);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Sphere.UV = function (SELF, p) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 171432461:
                    return Sphere.UV_impl(SELF, p);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Sphere.MaterialAt = function (SELF, _p) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 171432461:
                    return Sphere.MaterialAt_impl(SELF, _p);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Sphere.NormalAt = function (SELF, p) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 171432461:
                    return Sphere.NormalAt_impl(SELF, p);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Sphere.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 171432461; return SELF; };
        return Sphere;
    }(Shape));
    Sphere.NAME = "Sphere";
    Sphere.SIZE = 32;
    Sphere.ALIGN = 8;
    Sphere.CLSID = 171432461;
    XRAY.Sphere = Sphere;
    unsafe._idToType[171432461] = Sphere;
    var Triangle = (function (_super) {
        __extends(Triangle, _super);
        function Triangle(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Triangle, "BASE", {
            get: function () {
                return Shape;
            },
            enumerable: true,
            configurable: true
        });
        Triangle.init = function (SELF, v1, v2, v3, n1, n2, n3, t1, t2, t3, material) {
            if (v1 === void 0) { v1 = -1; }
            if (v2 === void 0) { v2 = -1; }
            if (v3 === void 0) { v3 = -1; }
            if (n1 === void 0) { n1 = -1; }
            if (n2 === void 0) { n2 = -1; }
            if (n3 === void 0) { n3 = -1; }
            if (t1 === void 0) { t1 = -1; }
            if (t2 === void 0) { t2 = -1; }
            if (t3 === void 0) { t3 = -1; }
            if (material === void 0) { material = -1; }
            unsafe._mem_i32[(SELF + 8) >> 2] = v1;
            unsafe._mem_i32[(SELF + 12) >> 2] = v2;
            unsafe._mem_i32[(SELF + 16) >> 2] = v3;
            unsafe._mem_i32[(SELF + 20) >> 2] = n1;
            unsafe._mem_i32[(SELF + 24) >> 2] = n2;
            unsafe._mem_i32[(SELF + 28) >> 2] = n3;
            unsafe._mem_i32[(SELF + 32) >> 2] = t1;
            unsafe._mem_i32[(SELF + 36) >> 2] = t2;
            unsafe._mem_i32[(SELF + 40) >> 2] = t3;
            unsafe._mem_i32[(SELF + 44) >> 2] = material;
            return SELF;
        };
        Triangle.NewTriangle = function (v1, v2, v3, t1, t2, t3, material) {
            var SELF = Triangle.initInstance(unsafe.alloc(53, 4));
            unsafe._mem_i32[(SELF + 8) >> 2] = v1;
            unsafe._mem_i32[(SELF + 12) >> 2] = v2;
            unsafe._mem_i32[(SELF + 16) >> 2] = v3;
            unsafe._mem_i32[(SELF + 32) >> 2] = t1;
            unsafe._mem_i32[(SELF + 36) >> 2] = t2;
            unsafe._mem_i32[(SELF + 40) >> 2] = t3;
            unsafe._mem_i32[(SELF + 44) >> 2] = material;
            return SELF;
        };
        Triangle.Pack = function (triangles) {
            var packed = unsafe.alloc(4 + (4 * (triangles.length)), 4);
            unsafe._mem_i32[packed >> 2] = (triangles.length);
            triangles.forEach(function (triangle, i) {
                unsafe._mem_i32[(packed + 4 + (4 * i)) >> 2] = triangle;
            });
            return packed;
        };
        Triangle.Copy = function (a, b) {
            unsafe._mem_i32[(b + 8) >> 2] = Vector.Clone(unsafe._mem_i32[(a + 8) >> 2]);
            unsafe._mem_i32[(b + 12) >> 2] = Vector.Clone(unsafe._mem_i32[(a + 12) >> 2]);
            unsafe._mem_i32[(b + 16) >> 2] = Vector.Clone(unsafe._mem_i32[(a + 16) >> 2]);
            unsafe._mem_i32[(b + 20) >> 2] = Vector.Clone(unsafe._mem_i32[(a + 20) >> 2]);
            unsafe._mem_i32[(b + 24) >> 2] = Vector.Clone(unsafe._mem_i32[(a + 24) >> 2]);
            unsafe._mem_i32[(b + 28) >> 2] = Vector.Clone(unsafe._mem_i32[(a + 28) >> 2]);
            unsafe._mem_i32[(b + 32) >> 2] = Vector.Clone(unsafe._mem_i32[(a + 32) >> 2]);
            unsafe._mem_i32[(b + 36) >> 2] = Vector.Clone(unsafe._mem_i32[(a + 36) >> 2]);
            unsafe._mem_i32[(b + 40) >> 2] = Vector.Clone(unsafe._mem_i32[(a + 40) >> 2]);
            unsafe._mem_i32[(b + 44) >> 2] = Material.Clone(unsafe._mem_i32[(a + 44) >> 2]);
            return b;
        };
        Triangle.Type_impl = function (SELF) {
            return ShapeType.TRIANGLE;
        };
        Triangle.ToJSON_impl = function (SELF) {
            return {
                vertex: {
                    v1: Vector.ToJSON(unsafe._mem_i32[(SELF + 8) >> 2]),
                    v2: Vector.ToJSON(unsafe._mem_i32[(SELF + 12) >> 2]),
                    v3: Vector.ToJSON(unsafe._mem_i32[(SELF + 16) >> 2])
                },
                normal: {
                    n1: Vector.ToJSON(unsafe._mem_i32[(SELF + 20) >> 2]),
                    n2: Vector.ToJSON(unsafe._mem_i32[(SELF + 24) >> 2]),
                    n3: Vector.ToJSON(unsafe._mem_i32[(SELF + 28) >> 2])
                },
                uv: {
                    t1: Vector.ToJSON(unsafe._mem_i32[(SELF + 32) >> 2]),
                    t2: Vector.ToJSON(unsafe._mem_i32[(SELF + 36) >> 2]),
                    t3: Vector.ToJSON(unsafe._mem_i32[(SELF + 40) >> 2])
                },
                material: Material.ToJSON(unsafe._mem_i32[(SELF + 44) >> 2]),
                box: Box.ToJSON(unsafe._mem_i32[(SELF + 48) >> 2]),
            };
        };
        Triangle.Compile_impl = function (SELF) {
        };
        Triangle.BoundingBox_impl = function (SELF, c) {
            if (unsafe._mem_u8[(SELF + 52) >> 0]) {
                return unsafe._mem_i32[(SELF + 48) >> 2];
            }
            else {
                var min = Vector.Min_mem(Vector.Min_mem(unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 12) >> 2]), unsafe._mem_i32[(SELF + 16) >> 2]);
                var max = Vector.Max_mem(Vector.Max_mem(unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 12) >> 2]), unsafe._mem_i32[(SELF + 16) >> 2]);
                unsafe._mem_i32[(SELF + 48) >> 2] = (c ? c : Box.initInstance(unsafe.alloc(12, 4)));
                unsafe._mem_u8[(SELF + 52) >> 0] = 1;
            }
            return Box.Init_mem(unsafe._mem_i32[(SELF + 48) >> 2], min, max);
        };
        Triangle.Intersect_impl = function (SELF, r) {
            var e1x = unsafe._mem_f64[((unsafe._mem_i32[(SELF + 12) >> 2]) + 8) >> 3] - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 8) >> 3];
            var e1y = unsafe._mem_f64[((unsafe._mem_i32[(SELF + 12) >> 2]) + 16) >> 3] - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 16) >> 3];
            var e1z = unsafe._mem_f64[((unsafe._mem_i32[(SELF + 12) >> 2]) + 24) >> 3] - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 24) >> 3];
            var e2x = unsafe._mem_f64[((unsafe._mem_i32[(SELF + 16) >> 2]) + 8) >> 3] - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 8) >> 3];
            var e2y = unsafe._mem_f64[((unsafe._mem_i32[(SELF + 16) >> 2]) + 16) >> 3] - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 16) >> 3];
            var e2z = unsafe._mem_f64[((unsafe._mem_i32[(SELF + 16) >> 2]) + 24) >> 3] - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 24) >> 3];
            var px = r.direction.y * e2z - r.direction.z * e2y;
            var py = r.direction.z * e2x - r.direction.x * e2z;
            var pz = r.direction.x * e2y - r.direction.y * e2x;
            var det = e1x * px + e1y * py + e1z * pz;
            if (det > -EPS && det < EPS) {
                return Hit.NoHit;
            }
            var inv = 1 / det;
            var tx = r.origin.x - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 8) >> 3];
            var ty = r.origin.y - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 16) >> 3];
            var tz = r.origin.z - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 24) >> 3];
            var u = (tx * px + ty * py + tz * pz) * inv;
            if (u < 0 || u > 1) {
                return Hit.NoHit;
            }
            var qx = ty * e1z - tz * e1y;
            var qy = tz * e1x - tx * e1z;
            var qz = tx * e1y - ty * e1x;
            var v = (r.direction.x * qx + r.direction.y * qy + r.direction.z * qz) * inv;
            if (v < 0 || u + v > 1) {
                return Hit.NoHit;
            }
            var d = (e2x * qx + e2y * qy + e2z * qz) * inv;
            if (d < EPS) {
                return Hit.NoHit;
            }
            return new Hit(SELF, d, null);
        };
        Triangle.UV_impl = function (SELF, p) {
            var T1 = new Vector3().read(unsafe._mem_i32[(SELF + 32) >> 2]);
            var T2 = new Vector3().read(unsafe._mem_i32[(SELF + 36) >> 2]);
            var T3 = new Vector3().read(unsafe._mem_i32[(SELF + 40) >> 2]);
            var uvw = Triangle.Barycentric(SELF, p);
            var n = new Vector3();
            n = n.add(T1.mulScalar(uvw.u));
            n = n.add(T2.mulScalar(uvw.v));
            n = n.add(T3.mulScalar(uvw.w));
            n.z = 0;
            return n;
        };
        Triangle.MaterialAt_impl = function (SELF, p) {
            return unsafe._mem_i32[(SELF + 44) >> 2];
        };
        Triangle.NormalAt_impl = function (SELF, p) {
            var V1 = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
            var V2 = new Vector3().read(unsafe._mem_i32[(SELF + 12) >> 2]);
            var V3 = new Vector3().read(unsafe._mem_i32[(SELF + 16) >> 2]);
            var n1 = new Vector3().read(unsafe._mem_i32[(SELF + 20) >> 2]);
            var n2 = new Vector3().read(unsafe._mem_i32[(SELF + 24) >> 2]);
            var n3 = new Vector3().read(unsafe._mem_i32[(SELF + 28) >> 2]);
            var T1 = new Vector3().read(unsafe._mem_i32[(SELF + 32) >> 2]);
            var T2 = new Vector3().read(unsafe._mem_i32[(SELF + 36) >> 2]);
            var T3 = new Vector3().read(unsafe._mem_i32[(SELF + 40) >> 2]);
            var uvw = Triangle.Barycentric(SELF, p);
            var n = new Vector3();
            n = n.add(n1.mulScalar(uvw.u));
            n = n.add(n2.mulScalar(uvw.v));
            n = n.add(n3.mulScalar(uvw.w));
            if (unsafe._mem_i32[((unsafe._mem_i32[(SELF + 44) >> 2]) + 12) >> 2]) {
                var b = new Vector3();
                b = b.add(T1.mulScalar(uvw.u));
                b = b.add(T2.mulScalar(uvw.v));
                b = b.add(T3.mulScalar(uvw.w));
                var ns = Texture.NormalSample(unsafe._mem_i32[((unsafe._mem_i32[(SELF + 44) >> 2]) + 12) >> 2], b.x, b.y);
                var dv1 = V2.sub(V1);
                var dv2 = V3.sub(V1);
                var dt1 = T2.sub(T1);
                var dt2 = T3.sub(T1);
                var T = dv1.mulScalar(dt2.y).sub(dv2.mulScalar(dt1.y)).normalize();
                var b = dv2.mulScalar(dt1.x).sub(dv1.mulScalar(dt2.x)).normalize();
                var N = T.cross(b);
                var matrix = new Matrix4(T.x, b.x, N.x, 0, T.y, b.y, N.y, 0, T.z, b.z, N.z, 0, 0, 0, 0, 1);
                n = matrix.mulDirection(ns);
            }
            if (unsafe._mem_i32[((unsafe._mem_i32[(SELF + 44) >> 2]) + 16) >> 2]) {
                var b = new Vector3();
                b = b.add(T1.mulScalar(uvw.u));
                b = b.add(T2.mulScalar(uvw.v));
                b = b.add(T3.mulScalar(uvw.w));
                var bump = Texture.BumpSample(unsafe._mem_i32[((unsafe._mem_i32[(SELF + 44) >> 2]) + 16) >> 2], b.x, b.y);
                var dv1 = V2.sub(V1);
                var dv2 = V3.sub(V1);
                var dt1 = T2.sub(T1);
                var dt2 = T3.sub(T1);
                var tangent = dv1.mulScalar(dt2.y).sub(dv2.mulScalar(dt1.y)).normalize();
                var bitangent = dv2.mulScalar(dt1.x).sub(dv1.mulScalar(dt2.x)).normalize();
                n = n.add(tangent.mulScalar(bump.x * unsafe._mem_f64[((unsafe._mem_i32[(SELF + 44) >> 2]) + 24) >> 3]));
                n = n.add(bitangent.mulScalar(bump.y * unsafe._mem_f64[((unsafe._mem_i32[(SELF + 44) >> 2]) + 24) >> 3]));
            }
            n = n.normalize();
            return n;
        };
        Triangle.Area = function (SELF) {
            var e1 = Vector.Sub_mem(unsafe._mem_i32[(SELF + 12) >> 2], unsafe._mem_i32[(SELF + 8) >> 2]);
            var e2 = Vector.Sub_mem(unsafe._mem_i32[(SELF + 16) >> 2], unsafe._mem_i32[(SELF + 8) >> 2]);
            var n = Vector.Cross_mem(e1, e2);
            return Vector.Length_mem(n) / 2;
        };
        Triangle.Barycentric = function (SELF, p) {
            var _V1 = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
            var _V2 = new Vector3().read(unsafe._mem_i32[(SELF + 12) >> 2]);
            var _V3 = new Vector3().read(unsafe._mem_i32[(SELF + 16) >> 2]);
            var v0 = _V2.sub(_V1);
            var v1 = _V3.sub(_V1);
            var v2 = p.sub(_V1);
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
        Triangle.UpdateBox = function (SELF) {
            var min = Vector.Min_mem(Vector.Min_mem(unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 12) >> 2]), unsafe._mem_i32[(SELF + 16) >> 2]);
            var max = Vector.Max_mem(Vector.Max_mem(unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 12) >> 2]), unsafe._mem_i32[(SELF + 16) >> 2]);
            unsafe._mem_i32[(SELF + 48) >> 2] = (Box.initInstance(unsafe.alloc(12, 4)));
            unsafe._mem_u8[(SELF + 52) >> 0] = 1;
            return Box.Init_mem(unsafe._mem_i32[(SELF + 48) >> 2], min, max);
        };
        Triangle.FixNormals = function (SELF) {
            var e1 = Vector.Sub_mem(unsafe._mem_i32[(SELF + 12) >> 2], unsafe._mem_i32[(SELF + 8) >> 2]);
            var e2 = Vector.Sub_mem(unsafe._mem_i32[(SELF + 16) >> 2], unsafe._mem_i32[(SELF + 8) >> 2]);
            var n = Vector.Normalize_mem(Vector.Cross_mem(e1, e2));
            if (Vector.IsZero(unsafe._mem_i32[(SELF + 20) >> 2])) {
                Vector.Copy(unsafe._mem_i32[(SELF + 20) >> 2], n);
            }
            if (Vector.IsZero(unsafe._mem_i32[(SELF + 24) >> 2])) {
                Vector.Copy(unsafe._mem_i32[(SELF + 24) >> 2], n);
            }
            if (Vector.IsZero(unsafe._mem_i32[(SELF + 28) >> 2])) {
                Vector.Copy(unsafe._mem_i32[(SELF + 28) >> 2], n);
            }
            free(e1);
            free(e2);
            free(n);
        };
        Triangle.Type = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 232773086:
                    return Triangle.Type_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Triangle.ToJSON = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 232773086:
                    return Triangle.ToJSON_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Triangle.Compile = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 232773086:
                    return Triangle.Compile_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Triangle.BoundingBox = function (SELF, c) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 232773086:
                    return Triangle.BoundingBox_impl(SELF, c);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Triangle.Intersect = function (SELF, r) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 232773086:
                    return Triangle.Intersect_impl(SELF, r);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Triangle.UV = function (SELF, p) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 232773086:
                    return Triangle.UV_impl(SELF, p);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Triangle.MaterialAt = function (SELF, p) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 232773086:
                    return Triangle.MaterialAt_impl(SELF, p);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Triangle.NormalAt = function (SELF, p) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 232773086:
                    return Triangle.NormalAt_impl(SELF, p);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Triangle.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 232773086; return SELF; };
        return Triangle;
    }(Shape));
    Triangle.NAME = "Triangle";
    Triangle.SIZE = 53;
    Triangle.ALIGN = 4;
    Triangle.CLSID = 232773086;
    XRAY.Triangle = Triangle;
    unsafe._idToType[232773086] = Triangle;
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Mesh, "BASE", {
            get: function () {
                return Shape;
            },
            enumerable: true,
            configurable: true
        });
        Mesh.init = function (SELF, triangles, material) {
            console.log("numTriangles:" + unsafe._mem_i32[triangles >> 2]);
            unsafe._mem_i32[(SELF + 8) >> 2] = triangles;
            unsafe._mem_i32[(SELF + 12) >> 2] = material;
            unsafe._mem_i32[(SELF + 16) >> 2] = 0;
            unsafe._mem_i32[(SELF + 20) >> 2] = 0;
            return SELF;
        };
        Mesh.NewMesh = function (triangles, material) {
            var ptr = Mesh.initInstance(unsafe.alloc(24, 4));
            return Mesh.init(ptr, triangles, material);
        };
        Mesh.dirty = function (SELF) {
            unsafe._mem_i32[(SELF + 16) >> 2] = null;
            unsafe._mem_i32[(SELF + 20) >> 2] = null;
        };
        Mesh.prototype.Copy = function (SELF) {
            var numTriangles = unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2];
            var triangles = unsafe.alloc(4 + (4 * numTriangles), 4);
            unsafe._mem_i32[triangles >> 2] = numTriangles;
            for (var i = 0; i < numTriangles; i++) {
                var t = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)) >> 2];
                var a = Triangle.initInstance(unsafe.alloc(53, 4));
                Triangle.Copy(t, a);
                unsafe._mem_i32[(triangles + 4 + (4 * i)) >> 2] = a;
            }
            return Mesh.NewMesh(triangles);
        };
        Mesh.Type_impl = function (SELF) {
            return ShapeType.MESH;
        };
        Mesh.ToJSON_impl = function (SELF) {
            return {
                numTriangles: unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2],
                box: Box.ToJSON(Mesh.BoundingBox(SELF)),
                tree: unsafe._mem_i32[(SELF + 20) >> 2]
            };
        };
        Mesh.Compile_impl = function (SELF) {
            if (!unsafe._mem_i32[(SELF + 20) >> 2]) {
                unsafe._mem_i32[(SELF + 20) >> 2] = (Tree.NewTree(unsafe._mem_i32[(SELF + 8) >> 2]));
            }
            return unsafe._mem_i32[(SELF + 20) >> 2];
        };
        Mesh.Add = function (SELF, mesh) {
            Mesh.dirty(SELF);
        };
        Mesh.BoundingBox_impl = function (SELF) {
            if (!unsafe._mem_i32[(SELF + 16) >> 2]) {
                var t = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * 0)) >> 2];
                var min = Vector.Clone(unsafe._mem_i32[(t + 8) >> 2]);
                var max = Vector.Clone(unsafe._mem_i32[(t + 8) >> 2]);
                var NumTriangles = unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2];
                for (var i = 1; i < NumTriangles; i++) {
                    t = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)) >> 2];
                    Vector.Min_mem(Vector.Min_mem(Vector.Min_mem(min, unsafe._mem_i32[(t + 8) >> 2], min), unsafe._mem_i32[(t + 12) >> 2], min), unsafe._mem_i32[(t + 16) >> 2], min);
                    Vector.Max_mem(Vector.Max_mem(Vector.Max_mem(max, unsafe._mem_i32[(t + 8) >> 2], max), unsafe._mem_i32[(t + 12) >> 2], max), unsafe._mem_i32[(t + 16) >> 2], max);
                }
                var ptr = Box.initInstance(unsafe.alloc(12, 4));
                unsafe._mem_i32[(SELF + 16) >> 2] = (Box.Init_mem(ptr, min, max));
            }
            return unsafe._mem_i32[(SELF + 16) >> 2];
        };
        Mesh.Intersect_impl = function (SELF, r) {
            return Tree.Intersect(unsafe._mem_i32[(SELF + 20) >> 2], r);
        };
        Mesh.UV_impl = function (SELF, p) {
            return null;
        };
        Mesh.MaterialAt_impl = function (SELF, p) {
            return unsafe._mem_i32[(SELF + 12) >> 2];
        };
        Mesh.NormalAt_impl = function (SELF, p) {
            return null;
        };
        Mesh._SmoothNormalsThreshold = function (SELF, normal, normals, threshold) {
            var result = Vector.NewVector();
            for (var i = 0; i < normals.length; i++) {
                var x = normals[i];
                if (Vector.Dot_mem(x, normal) >= threshold) {
                    Vector.Add_mem(result, x, result);
                }
            }
            return Vector.Normalize_mem(result);
        };
        Mesh.SmoothNormalsThreshold = function (SELF, radians) {
            var threshold = Math.cos(radians);
            var lookup = [];
            var NumTriangles = unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2];
            for (var i = 0; i < NumTriangles; i++) {
                var t = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)) >> 2];
                lookup[unsafe._mem_i32[(t + 8) >> 2]] = Utils.append(lookup[unsafe._mem_i32[(t + 8) >> 2]], unsafe._mem_i32[(t + 20) >> 2]);
                lookup[unsafe._mem_i32[(t + 12) >> 2]] = Utils.append(lookup[unsafe._mem_i32[(t + 12) >> 2]], unsafe._mem_i32[(t + 24) >> 2]);
                lookup[unsafe._mem_i32[(t + 16) >> 2]] = Utils.append(lookup[unsafe._mem_i32[(t + 16) >> 2]], unsafe._mem_i32[(t + 28) >> 2]);
            }
            for (var i = 0; i < NumTriangles; i++) {
                var t = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)) >> 2];
                unsafe._mem_i32[(t + 20) >> 2] = Mesh._SmoothNormalsThreshold(SELF, unsafe._mem_i32[(t + 20) >> 2], lookup[unsafe._mem_i32[(t + 8) >> 2]], threshold);
                unsafe._mem_i32[(t + 24) >> 2] = Mesh._SmoothNormalsThreshold(SELF, unsafe._mem_i32[(t + 24) >> 2], lookup[unsafe._mem_i32[(t + 12) >> 2]], threshold);
                unsafe._mem_i32[(t + 28) >> 2] = Mesh._SmoothNormalsThreshold(SELF, unsafe._mem_i32[(t + 28) >> 2], lookup[unsafe._mem_i32[(t + 16) >> 2]], threshold);
            }
        };
        Mesh.SmoothNormals = function (SELF) {
            var lookup = [];
            var NumTriangles = unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2];
            for (var i = 0; i < NumTriangles; i++) {
                var t = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)) >> 2];
                Vector.Add_mem(lookup[unsafe._mem_i32[(t + 8) >> 2]], unsafe._mem_i32[(t + 20) >> 2], lookup[unsafe._mem_i32[(t + 8) >> 2]]);
                Vector.Add_mem(lookup[unsafe._mem_i32[(t + 12) >> 2]], unsafe._mem_i32[(t + 24) >> 2], lookup[unsafe._mem_i32[(t + 12) >> 2]]);
                Vector.Add_mem(lookup[unsafe._mem_i32[(t + 16) >> 2]], unsafe._mem_i32[(t + 28) >> 2], lookup[unsafe._mem_i32[(t + 16) >> 2]]);
            }
            for (var i = 0; i < lookup.length; i++) {
                Vector.Normalize_mem(lookup[i], lookup[i]);
            }
            for (var i = 0; i < NumTriangles; i++) {
                var t = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)) >> 2];
                unsafe._mem_i32[(t + 20) >> 2] = lookup[unsafe._mem_i32[(t + 8) >> 2]];
                unsafe._mem_i32[(t + 24) >> 2] = lookup[unsafe._mem_i32[(t + 12) >> 2]];
                unsafe._mem_i32[(t + 28) >> 2] = lookup[unsafe._mem_i32[(t + 16) >> 2]];
            }
        };
        Mesh.UnitCube = function (SELF) {
            Mesh.FitInside(SELF, Box.NewBox(Vector.NewVector(), Vector.NewVector(1, 1, 1)), Vector.NewVector());
            Mesh.MoveTo(SELF, Vector.NewVector(), Vector.NewVector(0.5, 0.5, 0.5));
        };
        Mesh.MoveTo = function (SELF, position, anchor) {
            var matrix = Matrix.TranslateUnitMatrix(Vector.Sub_mem(position, Box.Anchor_mem(Mesh.BoundingBox(SELF), anchor)));
            return Matrix.Transform(SELF, matrix);
        };
        Mesh.FitInside = function (SELF, box, anchor) {
            var bsize = Box.Size_mem(box);
            var mbox = Mesh.BoundingBox(SELF);
            var mbsize = Box.Size_mem(mbox);
            var scale = Vector.MinComponent_mem(Vector.Div_mem(bsize, mbsize));
            var extra = Vector.MulScalar_mem(Vector.Sub_mem(bsize, mbsize), scale);
            var matrix = Matrix.Identity();
            Matrix.Translate(matrix, Vector.Negate_mem(unsafe._mem_i32[(mbox + 4) >> 2]), matrix);
            Matrix.Scale(matrix, Vector.NewVector(scale, scale, scale), matrix);
            Matrix.Translate(matrix, Vector.Add_mem(unsafe._mem_i32[(mbox + 4) >> 2], Vector.Mul_mem(extra, anchor)));
            Mesh.Transform(SELF, matrix);
        };
        Mesh.Transform = function (SELF, matrix) {
            var NumTriangles = unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2];
            for (var i = 0; i < NumTriangles; i++) {
                var t = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)) >> 2];
                unsafe._mem_i32[(t + 8) >> 2] = Matrix.MulPosition(matrix, unsafe._mem_i32[(t + 8) >> 2]);
                unsafe._mem_i32[(t + 12) >> 2] = Matrix.MulPosition(matrix, unsafe._mem_i32[(t + 12) >> 2]);
                unsafe._mem_i32[(t + 16) >> 2] = Matrix.MulPosition(matrix, unsafe._mem_i32[(t + 16) >> 2]);
                unsafe._mem_i32[(t + 20) >> 2] = Matrix.MulDirection(matrix, unsafe._mem_i32[(t + 20) >> 2]);
                unsafe._mem_i32[(t + 24) >> 2] = Matrix.MulDirection(matrix, unsafe._mem_i32[(t + 24) >> 2]);
                unsafe._mem_i32[(t + 28) >> 2] = Matrix.MulDirection(matrix, unsafe._mem_i32[(t + 28) >> 2]);
            }
            Mesh.dirty(SELF);
        };
        Mesh.SetMaterial = function (material) {
            var NumTriangles = unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2];
            for (var i = 0; i < NumTriangles; i++) {
                var t = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)) >> 2];
                unsafe._mem_i32[(t + 44) >> 2] = material;
            }
        };
        Mesh.SaveSTL = function (SELF, path) {
        };
        Mesh.Type = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48819938:
                    return Mesh.Type_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Mesh.ToJSON = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48819938:
                    return Mesh.ToJSON_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Mesh.Compile = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48819938:
                    return Mesh.Compile_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Mesh.BoundingBox = function (SELF) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48819938:
                    return Mesh.BoundingBox_impl(SELF);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Mesh.Intersect = function (SELF, r) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48819938:
                    return Mesh.Intersect_impl(SELF, r);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Mesh.UV = function (SELF, p) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48819938:
                    return Mesh.UV_impl(SELF, p);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Mesh.MaterialAt = function (SELF, p) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48819938:
                    return Mesh.MaterialAt_impl(SELF, p);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Mesh.NormalAt = function (SELF, p) {
            switch (unsafe._mem_i32[SELF >> 2]) {
                case 48819938:
                    return Mesh.NormalAt_impl(SELF, p);
                default:
                    throw unsafe._badType(SELF);
            }
        };
        Mesh.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 48819938; return SELF; };
        return Mesh;
    }(Shape));
    Mesh.NAME = "Mesh";
    Mesh.SIZE = 24;
    Mesh.ALIGN = 4;
    Mesh.CLSID = 48819938;
    XRAY.Mesh = Mesh;
    unsafe._idToType[48819938] = Mesh;
    var Node = (function (_super) {
        __extends(Node, _super);
        function Node(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Node, "BASE", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Node.init = function (SELF, axis, point, shapes, numShapes, left, right) {
            unsafe._mem_u8[(SELF + 4) >> 0] = axis;
            unsafe._mem_f64[(SELF + 8) >> 3] = point;
            unsafe._mem_i32[(SELF + 16) >> 2] = shapes;
            unsafe._mem_i32[(SELF + 20) >> 2] = numShapes;
            unsafe._mem_i32[(SELF + 24) >> 2] = left;
            unsafe._mem_i32[(SELF + 28) >> 2] = right;
            return SELF;
        };
        Node.NewNode = function (shapes, numShapes) {
            var ptr = Node.initInstance(unsafe.alloc(32, 8));
            return Node.init(ptr, Axis.AxisNone, 0, shapes, numShapes, null, null);
        };
        Node.ToJSON = function (SELF) {
            return {
                axis: Axis[unsafe._mem_u8[(SELF + 4) >> 0]],
                point: unsafe._mem_f64[(SELF + 8) >> 3],
                numShapes: unsafe._mem_i32[(SELF + 20) >> 2],
                left: unsafe._mem_i32[(SELF + 24) >> 2],
                right: unsafe._mem_i32[(SELF + 28) >> 2]
            };
        };
        Node.Intersect = function (SELF, r, tmin, tmax) {
            var tsplit;
            var leftFirst;
            switch (unsafe._mem_u8[(SELF + 4) >> 0]) {
                case Axis.AxisNone:
                    return Node.IntersectShapes(SELF, r);
                case Axis.AxisX:
                    tsplit = (unsafe._mem_f64[(SELF + 8) >> 3] - r.origin.x) / r.direction.x;
                    leftFirst = (r.origin.x < unsafe._mem_f64[(SELF + 8) >> 3]) || (r.origin.x == unsafe._mem_f64[(SELF + 8) >> 3] && r.direction.x <= 0);
                    break;
                case Axis.AxisY:
                    tsplit = (unsafe._mem_f64[(SELF + 8) >> 3] - r.origin.y) / r.direction.y;
                    leftFirst = (r.origin.y < unsafe._mem_f64[(SELF + 8) >> 3]) || (r.origin.y == unsafe._mem_f64[(SELF + 8) >> 3] && r.direction.y <= 0);
                    break;
                case Axis.AxisZ:
                    tsplit = (unsafe._mem_f64[(SELF + 8) >> 3] - r.origin.z) / r.direction.z;
                    leftFirst = (r.origin.z < unsafe._mem_f64[(SELF + 8) >> 3]) || (r.origin.z == unsafe._mem_f64[(SELF + 8) >> 3] && r.direction.z <= 0);
                    break;
            }
            var first;
            var second;
            if (leftFirst) {
                first = unsafe._mem_i32[(SELF + 24) >> 2];
                second = unsafe._mem_i32[(SELF + 28) >> 2];
            }
            else {
                first = unsafe._mem_i32[(SELF + 28) >> 2];
                second = unsafe._mem_i32[(SELF + 24) >> 2];
            }
            if (tsplit > tmax || tsplit <= 0) {
                return Node.Intersect(first, r, tmin, tmax);
            }
            else if (tsplit < tmin) {
                return Node.Intersect(second, r, tmin, tmax);
            }
            else {
                var h1 = Node.Intersect(first, r, tmin, tsplit);
                if (h1.T <= tsplit) {
                    return h1;
                }
                var h2 = Node.Intersect(second, r, tsplit, Math.min(tmax, h1.T));
                if (h1.T <= h2.T) {
                    return h1;
                }
                else {
                    return h2;
                }
            }
        };
        Node.IntersectShapes = function (SELF, r) {
            var hit = Hit.NoHit;
            for (var i = 0; i < unsafe._mem_i32[(SELF + 20) >> 2]; i++) {
                var shape = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (4 * i)) >> 2];
                var h = Shape.Intersect(shape, r);
                if (h.T < hit.T) {
                    hit = h;
                }
            }
            return hit;
        };
        Node.PartitionScore = function (SELF, axis, point) {
            var left = 0;
            var right = 0;
            for (var i = 0; i < unsafe._mem_i32[(SELF + 20) >> 2]; i++) {
                var shape = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (4 * i)) >> 2];
                var box = Shape.BoundingBox(shape);
                var lr = Box.Partition(box, axis, point);
                if (lr.left) {
                    left++;
                }
                if (lr.right) {
                    right++;
                }
            }
            if (left >= right) {
                return left;
            }
            else {
                return right;
            }
        };
        Node.Partition = function (SELF, size, axis, point) {
            var left = [];
            var right = [];
            for (var i = 0; i < unsafe._mem_i32[(SELF + 20) >> 2]; i++) {
                var shape = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (4 * i)) >> 2];
                var box = Shape.BoundingBox(shape);
                var lr = Box.Partition(box, axis, point);
                if (lr.left) {
                    left.push(shape);
                }
                if (lr.right) {
                    right.push(shape);
                }
            }
            var left_ptr = unsafe.alloc(4 + (4 * (left.length)), 4);
            unsafe._mem_i32[left_ptr >> 2] = (left.length);
            var right_ptr = unsafe.alloc(4 + (4 * (right.length)), 4);
            unsafe._mem_i32[right_ptr >> 2] = (right.length);
            left.forEach(function (item, index) {
                unsafe._mem_i32[((left_ptr) + 4 + (4 * index)) >> 2] = item;
            });
            right.forEach(function (item, index) {
                unsafe._mem_i32[((right_ptr) + 4 + (4 * index)) >> 2] = item;
            });
            return {
                left: left_ptr, numLeft: left.length,
                right: right_ptr, numRight: right.length
            };
        };
        Node.Split = function (SELF, depth) {
            if (unsafe._mem_i32[(SELF + 20) >> 2] < 8) {
                return;
            }
            var size = unsafe._mem_i32[(SELF + 20) >> 2] * 2;
            var _xs = new Float64Array(size);
            var _ys = new Float64Array(size);
            var _zs = new Float64Array(size);
            var count = 0;
            for (var i = 0; i < unsafe._mem_i32[(SELF + 20) >> 2]; i++) {
                var shape = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (4 * i)) >> 2];
                var box = Triangle.BoundingBox(shape);
                _xs[count] = unsafe._mem_f64[((unsafe._mem_i32[(box + 4) >> 2]) + 8) >> 3];
                _ys[count] = unsafe._mem_f64[((unsafe._mem_i32[(box + 4) >> 2]) + 16) >> 3];
                _zs[count] = unsafe._mem_f64[((unsafe._mem_i32[(box + 4) >> 2]) + 24) >> 3];
                count++;
                _xs[count] = unsafe._mem_f64[((unsafe._mem_i32[(box + 8) >> 2]) + 8) >> 3];
                _ys[count] = unsafe._mem_f64[((unsafe._mem_i32[(box + 8) >> 2]) + 16) >> 3];
                _zs[count] = unsafe._mem_f64[((unsafe._mem_i32[(box + 8) >> 2]) + 24) >> 3];
                count++;
            }
            _xs.sort();
            _ys.sort();
            _zs.sort();
            var mx = Utils.Median(_xs);
            var my = Utils.Median(_ys);
            var mz = Utils.Median(_zs);
            var best = Math.round(unsafe._mem_i32[(SELF + 20) >> 2] * 0.85);
            var bestAxis = Axis.AxisNone;
            var bestPoint = 0.0;
            var sx = Node.PartitionScore(SELF, Axis.AxisX, mx);
            if (sx < best) {
                best = sx;
                bestAxis = Axis.AxisX;
                bestPoint = mx;
            }
            var sy = Node.PartitionScore(SELF, Axis.AxisY, my);
            if (sy < best) {
                best = sy;
                bestAxis = Axis.AxisY;
                bestPoint = my;
            }
            var sz = Node.PartitionScore(SELF, Axis.AxisZ, mz);
            if (sz < best) {
                best = sz;
                bestAxis = Axis.AxisZ;
                bestPoint = mz;
            }
            if (bestAxis == Axis.AxisNone) {
                return;
            }
            var lr = Node.Partition(SELF, best, bestAxis, bestPoint);
            unsafe._mem_u8[(SELF + 4) >> 0] = bestAxis;
            unsafe._mem_f64[(SELF + 8) >> 3] = bestPoint;
            unsafe._mem_i32[(SELF + 24) >> 2] = (Node.NewNode(lr.left, lr.numLeft));
            unsafe._mem_i32[(SELF + 28) >> 2] = (Node.NewNode(lr.right, lr.numRight));
            Node.Split(unsafe._mem_i32[(SELF + 24) >> 2], depth + 1);
            Node.Split(unsafe._mem_i32[(SELF + 28) >> 2], depth + 1);
            unsafe._mem_i32[(SELF + 16) >> 2] = 0;
        };
        Node.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 20726; return SELF; };
        return Node;
    }(MemoryObject));
    Node.NAME = "Node";
    Node.SIZE = 32;
    Node.ALIGN = 8;
    Node.CLSID = 20726;
    XRAY.Node = Node;
    unsafe._idToType[20726] = Node;
    var Tree = (function (_super) {
        __extends(Tree, _super);
        function Tree(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Tree, "BASE", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Tree.init = function (SELF, box, root) {
            unsafe._mem_i32[(SELF + 4) >> 2] = box;
            unsafe._mem_i32[(SELF + 8) >> 2] = root;
            return SELF;
        };
        Tree.NewTree = function (shapes) {
            var numShapes = unsafe._mem_i32[shapes >> 2];
            console.log("Building k-d tree (" + numShapes + " shapes)... ");
            var box = Box.BoxForShapes(shapes, numShapes);
            var node = Node.NewNode(shapes, numShapes);
            Node.Split(node, 0);
            var ptr = Tree.initInstance(unsafe.alloc(12, 4));
            return Tree.init(ptr, box, node);
        };
        Tree.Intersect = function (tree, r) {
            var hit = Box.Intersect(unsafe._mem_i32[(tree + 4) >> 2], r);
            if (hit.tmax < hit.tmin || hit.tmax <= 0) {
                return Hit.NoHit;
            }
            return Node.Intersect(unsafe._mem_i32[(tree + 8) >> 2], r, hit.tmin, hit.tmax);
        };
        Tree.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 27694; return SELF; };
        return Tree;
    }(MemoryObject));
    Tree.NAME = "Tree";
    Tree.SIZE = 12;
    Tree.ALIGN = 4;
    Tree.CLSID = 27694;
    XRAY.Tree = Tree;
    unsafe._idToType[27694] = Tree;
    var Hit = (function () {
        function Hit(Shape, T, HitInfo) {
            if (HitInfo === void 0) { HitInfo = null; }
            this.Shape = Shape;
            this.T = T;
            this.HitInfo = HitInfo;
        }
        Hit.prototype.Ok = function () {
            return this.T < Number.POSITIVE_INFINITY;
        };
        Hit.prototype.Info = function (r) {
            if (this.HitInfo != null) {
                return this.HitInfo;
            }
            var shape = this.Shape;
            var position = r.position(this.T);
            var normal = Shape.NormalAt(this.Shape, position);
            var material = Material.MaterialAt(shape, position);
            var inside = false;
            if (normal.dot(r.direction) > 0) {
                normal = normal.negate();
                inside = true;
                switch (Shape.Type(shape)) {
                    case ShapeType.Volume:
                    case ShapeType.SDFShape:
                        inside = false;
                        break;
                }
            }
            var ray = new Ray(position, normal);
            return new HitInfo(shape, position, normal, ray, material, inside);
        };
        return Hit;
    }());
    Hit.NoHit = new Hit(null, Number.POSITIVE_INFINITY, null);
    XRAY.Hit = Hit;
    var HitInfo = (function () {
        function HitInfo(Shape, Position, Normal, Ray, Material, Inside) {
            this.Shape = Shape;
            this.Position = Position;
            this.Normal = Normal;
            this.Ray = Ray;
            this.Material = Material;
            this.Inside = Inside;
        }
        return HitInfo;
    }());
    XRAY.HitInfo = HitInfo;
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Camera, "BASE", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Camera.init = function (SELF, p, u, v, w, m, focalDistance, apertureRadius) {
            if (focalDistance === void 0) { focalDistance = 0; }
            if (apertureRadius === void 0) { apertureRadius = 0; }
            unsafe._mem_i32[(SELF + 4) >> 2] = p;
            unsafe._mem_i32[(SELF + 8) >> 2] = u;
            unsafe._mem_i32[(SELF + 12) >> 2] = v;
            unsafe._mem_i32[(SELF + 16) >> 2] = w;
            unsafe._mem_f64[(SELF + 24) >> 3] = m;
            unsafe._mem_f64[(SELF + 32) >> 3] = focalDistance;
            unsafe._mem_f64[(SELF + 40) >> 3] = apertureRadius;
            return SELF;
        };
        Camera.NewCamera = function (p, u, v, w, m, focalDistance, apertureRadius) {
            var ptr = Camera.initInstance(unsafe.alloc(48, 8));
            p = p ? p : Vector.NewVector();
            u = u ? u : Vector.NewVector();
            v = v ? v : Vector.NewVector();
            w = w ? w : Vector.NewVector();
            m = m ? m : Vector.NewVector();
            return Camera.init(ptr, p, u, v, w, m, focalDistance, apertureRadius);
        };
        Camera.ToJSON = function (SELF) {
            return {
                p: Vector.XYZ(unsafe._mem_i32[(SELF + 4) >> 2]),
                u: Vector.XYZ(unsafe._mem_i32[(SELF + 8) >> 2]),
                v: Vector.XYZ(unsafe._mem_i32[(SELF + 12) >> 2]),
                w: Vector.XYZ(unsafe._mem_i32[(SELF + 16) >> 2]),
                m: unsafe._mem_f64[(SELF + 24) >> 3],
                focalDistance: unsafe._mem_f64[(SELF + 32) >> 3],
                apertureRadius: unsafe._mem_f64[(SELF + 40) >> 3]
            };
        };
        Camera.SetFromJSON = function (SELF, data) {
            Vector.SetFromJSON(unsafe._mem_i32[(SELF + 4) >> 2], data.p);
            Vector.SetFromJSON(unsafe._mem_i32[(SELF + 8) >> 2], data.u);
            Vector.SetFromJSON(unsafe._mem_i32[(SELF + 12) >> 2], data.v);
            Vector.SetFromJSON(unsafe._mem_i32[(SELF + 16) >> 2], data.w);
            if (typeof data.m === "number")
                unsafe._mem_f64[(SELF + 24) >> 3] = (data.m);
            if (typeof data.focalDistance === "number")
                unsafe._mem_f64[(SELF + 32) >> 3] = (data.focalDistance);
            if (typeof data.apertureRadius === "number")
                unsafe._mem_f64[(SELF + 40) >> 3] = (data.apertureRadius);
        };
        Camera.LookAt = function (eye, center, up, fovy, c) {
            c = c ? c : Camera.initInstance(unsafe.alloc(48, 8));
            Camera.init(c);
            unsafe._mem_i32[(c + 4) >> 2] = eye;
            var w = Vector.Normalize_mem(Vector.Sub_mem(center, eye));
            unsafe._mem_i32[(c + 16) >> 2] = w;
            var u = Vector.Normalize_mem(Vector.Cross_mem(up, w));
            unsafe._mem_i32[(c + 8) >> 2] = u;
            unsafe._mem_i32[(c + 12) >> 2] = Vector.Normalize_mem(Vector.Cross_mem(w, u));
            unsafe._mem_f64[(c + 24) >> 3] = 1 / Math.tan(fovy * Math.PI / 360);
            return c;
        };
        Camera.SetFocus = function (c, focalPoint, apertureRadius) {
            unsafe._mem_f64[(c + 32) >> 3] = Vector.Length_mem(Vector.Sub_mem(focalPoint, unsafe._mem_i32[(c + 4) >> 2]));
            unsafe._mem_f64[(c + 40) >> 3] = apertureRadius;
        };
        Camera.CastRay = function (c, x, y, w, h, u, v) {
            var aspect = w / h;
            var px = ((x + u - 0.5) / (w - 1)) * 2 - 1;
            var py = ((y + v - 0.5) / (h - 1)) * 2 - 1;
            var cu = new Vector3().read(unsafe._mem_i32[(c + 8) >> 2]);
            var cv = new Vector3().read(unsafe._mem_i32[(c + 12) >> 2]);
            var cp = new Vector3().read(unsafe._mem_i32[(c + 4) >> 2]);
            var cw = new Vector3().read(unsafe._mem_i32[(c + 16) >> 2]);
            var d = new Vector3();
            d = d.add(cu.mulScalar(-px * aspect));
            d = d.add(cv.mulScalar(-py));
            d = d.add(cw.mulScalar(unsafe._mem_f64[(c + 24) >> 3]));
            d = d.normalize();
            if (unsafe._mem_f64[(c + 40) >> 3] > 0) {
                var focalPoint = cp.add(d.mulScalar(unsafe._mem_f64[(c + 32) >> 3]));
                var angle = Math.random() * 2 * Math.PI;
                var radius = Math.random() * unsafe._mem_f64[(c + 40) >> 3];
                cp = cp.add(cu.mulScalar(Math.cos(angle) * radius));
                cp = cp.add(cv.mulScalar(Math.sin(angle) * radius));
                d = focalPoint.sub(cp).normalize();
            }
            return new Ray(cp, d);
        };
        Camera.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 1632962; return SELF; };
        return Camera;
    }(MemoryObject));
    Camera.NAME = "Camera";
    Camera.SIZE = 48;
    Camera.ALIGN = 8;
    Camera.CLSID = 1632962;
    XRAY.Camera = Camera;
    unsafe._idToType[1632962] = Camera;
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene(p) {
            return _super.call(this, p) || this;
        }
        Object.defineProperty(Scene, "BASE", {
            get: function () {
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Scene.init = function (SELF, color) {
            unsafe._mem_i32[(SELF + 4) >> 2] = color;
            unsafe._mem_i32[(SELF + 8) >> 2] = 0;
            unsafe._mem_f64[(SELF + 16) >> 3] = 0;
            unsafe._mem_i32[(SELF + 44) >> 2] = 0;
            return SELF;
        };
        Scene.NewScene = function (color) {
            var ptr = Scene.initInstance(unsafe.alloc(48, 8));
            return Scene.init(ptr, Color.HexColor(color));
        };
        Scene.Compile = function (SELF) {
            for (var i = 0; i < unsafe._mem_i32[(SELF + 28) >> 2]; i++) {
                var shape = unsafe._mem_i32[((unsafe._mem_i32[(SELF + 24) >> 2]) + 4 + (4 * i)) >> 2];
                Shape.Compile(shape);
            }
            if (!unsafe._mem_i32[(SELF + 40) >> 2]) {
                unsafe._mem_i32[(SELF + 40) >> 2] = (Tree.NewTree(unsafe._mem_i32[(SELF + 24) >> 2]));
            }
            return unsafe._mem_i32[(SELF + 40) >> 2];
        };
        Scene.RayCount = function (SELF) {
            return unsafe._mem_i32[(SELF + 44) >> 2];
        };
        Scene.Intersect = function (SELF, r) {
            unsafe._mem_i32[(SELF + 44) >> 2] = (unsafe._mem_i32[(SELF + 44) >> 2] + 1);
            return Tree.Intersect(unsafe._mem_i32[(SELF + 40) >> 2], r);
        };
        Scene.Sample = function (SELF, r, emission, samples, depth) {
            if (depth > this.MaxBounces) {
                return new Color3();
            }
            var hit = Scene.Intersect(SELF, r);
            if (!hit.Ok()) {
                return new Color3(0, 0, 0);
            }
            var info = hit.Info(r);
            var result = new Color3();
            var material = info.Material;
            var color = Color.toColor3(unsafe._mem_i32[(material + 4) >> 2]);
            var tint = unsafe._mem_f64[(material + 56) >> 3];
            if (emission) {
                var emittance = unsafe._mem_f64[(material + 32) >> 3];
                if (emittance > 0) {
                    var __f = unsafe._mem_f64[(material + 32) >> 3] * samples;
                    var tmp = color.mulScalar(__f);
                    result = result.add(tmp);
                }
            }
            var n = Math.round(Math.sqrt(samples));
            for (var u = 0; u < n; u++) {
                for (var v = 0; v < n; v++) {
                    var p = Math.random();
                    var fu = (u + Math.random()) / n;
                    var fv = (v + Math.random()) / n;
                    var bounce = r.bounce2(info, p, fu, fv);
                    var indirect = Scene.Sample(SELF, bounce.ray, bounce.reflected, 1, depth + 1);
                    if (bounce.reflected) {
                        var tinted = indirect.mix(color.mul(indirect), tint);
                        result = result.add(tinted);
                    }
                    else {
                        var direct = Scene.DirectLight(info.ray);
                        result = result.add(color.mul(direct.add(indirect)));
                    }
                }
            }
            return result.divScalar(n * n);
        };
        Scene.Shadow = function (SELF, r, light, max) {
            var hit = Scene.Intersect(SELF, r);
            return hit.shape != light && hit.T < max;
        };
        Scene.DirectLight = function (SELF, n) {
            var nLights = unsafe._mem_i32[(SELF + 36) >> 2] | 0;
            if (nLights == 0) {
                return new Color3();
            }
            var color = new Color3();
            var self = this;
            var i = 0;
            var lights = unsafe._mem_i32[(SELF + 32) >> 2];
            for (; i < nLights; i++) {
                var light = unsafe._mem_i32[(lights + 4 + (4 * i)) >> 2];
                var p = Vector3.RandomUnitVector();
                var d = p.sub(n.origin);
                var lr = new Ray(n.origin, d.normalize());
                var diffuse = lr.direction.dot(n.direction);
                if (diffuse <= 0) {
                    continue;
                }
                var distance = d.length();
                if (Scene.Shadow(lr, light, distance)) {
                    continue;
                }
                var material = Material.MaterialAt(light, p);
                var m = unsafe._mem_f64[(material + 32) >> 3] * diffuse;
                color = color.add(Color.MulScalar2(unsafe._mem_i32[(material + 4) >> 2], m));
            }
            return color.divScalar(this.lights.length);
        };
        Scene.initInstance = function (SELF) { unsafe._mem_i32[SELF >> 2] = 237222; return SELF; };
        return Scene;
    }(MemoryObject));
    Scene.NAME = "Scene";
    Scene.SIZE = 48;
    Scene.ALIGN = 8;
    Scene.CLSID = 237222;
    XRAY.Scene = Scene;
    unsafe._idToType[237222] = Scene;
    var MasterScene = (function () {
        function MasterScene(color) {
            this.color = color;
            this.scenePtr = Scene.NewScene(color);
            this.shapes = [];
            this.lights = [];
        }
        MasterScene.prototype.setClearColor = function (color) {
            Color.HexColor(color, unsafe._mem_i32[((this.scenePtr) + 4) >> 2]);
        };
        MasterScene.prototype.Clear = function () {
            this.scenePtr = Scene.NewScene(this.color);
            unsafe._mem_i32[((this.scenePtr) + 40) >> 2] = 0;
            this.shapes = [];
            this.lights = [];
        };
        MasterScene.prototype.AddDebugScene = function () {
            var wall = Material.GlossyMaterial(Color.HexColor(0xFCFAE1), 1.5, Utils.Radians(10));
            this.Add(Cube.NewCube(Vector.NewVector(-10, -1, -10), Vector.NewVector(-2, 10, 10), wall));
            this.Add(Cube.NewCube(Vector.NewVector(-10, -1, -10), Vector.NewVector(10, 0, 10), wall));
        };
        MasterScene.prototype.AddDefaultLights = function () {
            var light = Material.LightMaterial(Color.WHITE, 50);
            this.Add(Sphere.NewSphere(Vector.NewVector(0, 8, 0), 0.5, light));
        };
        MasterScene.prototype.Add = function (shape) {
            this.shapes.push(shape);
            if (unsafe._mem_f64[((Shape.MaterialAt(shape, Vector.ZERO)) + 32) >> 3] > 0) {
                this.lights.push(shape);
            }
        };
        MasterScene.prototype.Commit = function () {
            unsafe._mem_i32[((this.scenePtr) + 28) >> 2] = this.shapes.length;
            var shapeList = unsafe.alloc(4 + (4 * (this.shapes.length)), 4);
            unsafe._mem_i32[shapeList >> 2] = (this.shapes.length);
            unsafe._mem_i32[((this.scenePtr) + 24) >> 2] = shapeList;
            unsafe._mem_i32[((this.scenePtr) + 36) >> 2] = this.lights.length;
            var lightList = unsafe.alloc(4 + (4 * (this.lights.length)), 4);
            unsafe._mem_i32[lightList >> 2] = (this.lights.length);
            unsafe._mem_i32[((this.scenePtr) + 32) >> 2] = lightList;
            this.shapes.forEach(function (shape, index) {
                unsafe._mem_i32[(shapeList + 4 + (4 * index)) >> 2] = shape;
            });
            this.lights.forEach(function (shape, index) {
                unsafe._mem_i32[(lightList + 4 + (4 * index)) >> 2] = shape;
            });
        };
        return MasterScene;
    }());
    XRAY.MasterScene = MasterScene;
    var BufferGeometry = (function () {
        function BufferGeometry() {
        }
        BufferGeometry.NewBufferGeometry = function (obj, scene) {
            BufferGeometry.loadChildren(obj, scene);
        };
        BufferGeometry.loadChildren = function (parent, scene) {
            var child;
            for (var i = 0; i < parent.children.length; i++) {
                child = parent.children[i];
                if (child.children.length > 0) {
                    this.loadChildren(child, scene);
                }
                else {
                    scene.Add(this.buildSceneObject(child));
                }
            }
        };
        BufferGeometry.buildSceneObject = function (src) {
            var color = src.material.color || { r: 0, g: 0, b: 0 };
            var mat = Material.DiffuseMaterial(Color.NewColor(color.r, color.g, color.b));
            return this.buildGeometry(src.geometry, mat, src.smooth);
        };
        BufferGeometry.buildGeometry = function (geometry, material, smooth) {
            if (smooth === void 0) { smooth = false; }
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
                        var t = Triangle.initInstance(unsafe.alloc(53, 4));
                        unsafe._mem_i32[(t + 44) >> 2] = material;
                        unsafe._mem_i32[(t + 8) >> 2] = Vector.NewVector(vertices[face.a].x, vertices[face.a].y, vertices[face.a].z);
                        unsafe._mem_i32[(t + 12) >> 2] = Vector.NewVector(vertices[face.b].x, vertices[face.b].y, vertices[face.b].z);
                        unsafe._mem_i32[(t + 16) >> 2] = Vector.NewVector(vertices[face.c].x, vertices[face.c].y, vertices[face.c].z);
                        unsafe._mem_i32[(t + 20) >> 2] = Vector.NewVector();
                        unsafe._mem_i32[(t + 24) >> 2] = Vector.NewVector();
                        unsafe._mem_i32[(t + 28) >> 2] = Vector.NewVector();
                        Triangle.FixNormals(t);
                        triangles.push(t);
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
                        var a = void 0;
                        var b = void 0;
                        var c = void 0;
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
                        var t_1 = Triangle.initInstance(unsafe.alloc(53, 4));
                        unsafe._mem_i32[(t_1 + 44) >> 2] = material;
                        unsafe._mem_i32[(t_1 + 8) >> 2] = Vector.NewVector(positions[ax], positions[ay], positions[az]);
                        unsafe._mem_i32[(t_1 + 12) >> 2] = Vector.NewVector(positions[bx], positions[by], positions[bz]);
                        unsafe._mem_i32[(t_1 + 16) >> 2] = Vector.NewVector(positions[cx], positions[cy], positions[cz]);
                        unsafe._mem_i32[(t_1 + 20) >> 2] = Vector.NewVector(normals[ax], normals[ay], normals[az]);
                        unsafe._mem_i32[(t_1 + 24) >> 2] = Vector.NewVector(normals[bx], normals[by], normals[bz]);
                        unsafe._mem_i32[(t_1 + 28) >> 2] = Vector.NewVector(normals[cx], normals[cy], normals[cz]);
                        if (uv) {
                            unsafe._mem_i32[(t_1 + 32) >> 2] = Vector.NewVector(uv[au], uv[av], 0);
                            unsafe._mem_i32[(t_1 + 36) >> 2] = Vector.NewVector(uv[bu], uv[bv], 0);
                            unsafe._mem_i32[(t_1 + 40) >> 2] = Vector.NewVector(uv[cu], uv[cv], 0);
                        }
                        Triangle.FixNormals(t_1);
                        triangles.push(t_1);
                        uvIndex += 2;
                    }
                }
                else {
                    uvIndex = 0;
                    for (var i_1 = 0; i_1 < positions.length; i_1 = i_1 + 9) {
                        var t_2 = Triangle.initInstance(unsafe.alloc(53, 4));
                        unsafe._mem_i32[(t_2 + 44) >> 2] = material;
                        unsafe._mem_i32[(t_2 + 8) >> 2] = Vector.NewVector(positions[i_1], positions[i_1 + 1], positions[i_1 + 2]);
                        unsafe._mem_i32[(t_2 + 12) >> 2] = Vector.NewVector(positions[i_1 + 3], positions[i_1 + 4], positions[i_1 + 5]);
                        unsafe._mem_i32[(t_2 + 16) >> 2] = Vector.NewVector(positions[i_1 + 6], positions[i_1 + 7], positions[i_1 + 8]);
                        unsafe._mem_i32[(t_2 + 20) >> 2] = Vector.NewVector(normals[i_1], normals[i_1 + 1], normals[i_1 + 2]);
                        unsafe._mem_i32[(t_2 + 24) >> 2] = Vector.NewVector(normals[i_1 + 3], normals[i_1 + 4], normals[i_1 + 5]);
                        unsafe._mem_i32[(t_2 + 28) >> 2] = Vector.NewVector(normals[i_1 + 6], normals[i_1 + 7], normals[i_1 + 8]);
                        if (uv) {
                            unsafe._mem_i32[(t_2 + 32) >> 2] = Vector.NewVector(uv[uvIndex], uv[uvIndex + 1], 0);
                            unsafe._mem_i32[(t_2 + 36) >> 2] = Vector.NewVector(uv[uvIndex + 2], uv[uvIndex + 3], 0);
                            unsafe._mem_i32[(t_2 + 40) >> 2] = Vector.NewVector(uv[uvIndex + 4], uv[uvIndex + 5], 0);
                        }
                        Triangle.FixNormals(t_2);
                        triangles.push(t_2);
                        uvIndex += 6;
                    }
                }
            }
            var meshRef = Mesh.NewMesh(Triangle.Pack(triangles));
            return meshRef;
        };
        BufferGeometry.computeNormals = function (positions) {
            return new Float32Array(positions.length);
        };
        return BufferGeometry;
    }());
    BufferGeometry.identityMatrix = new THREE.Matrix4().identity();
    XRAY.BufferGeometry = BufferGeometry;
    (function (LightMode) {
        LightMode[LightMode["LightModeRandom"] = 0] = "LightModeRandom";
        LightMode[LightMode["LightModeAll"] = 1] = "LightModeAll";
    })(XRAY.LightMode || (XRAY.LightMode = {}));
    var LightMode = XRAY.LightMode;
    (function (SpecularMode) {
        SpecularMode[SpecularMode["SpecularModeNaive"] = 0] = "SpecularModeNaive";
        SpecularMode[SpecularMode["SpecularModeFirst"] = 1] = "SpecularModeFirst";
        SpecularMode[SpecularMode["SpecularModeAll"] = 2] = "SpecularModeAll";
    })(XRAY.SpecularMode || (XRAY.SpecularMode = {}));
    var SpecularMode = XRAY.SpecularMode;
    (function (BounceType) {
        BounceType[BounceType["BounceTypeAny"] = 0] = "BounceTypeAny";
        BounceType[BounceType["BounceTypeDiffuse"] = 1] = "BounceTypeDiffuse";
        BounceType[BounceType["BounceTypeSpecular"] = 2] = "BounceTypeSpecular";
    })(XRAY.BounceType || (XRAY.BounceType = {}));
    var BounceType = XRAY.BounceType;
    function NewSampler(firstHitSamples, maxBounces) {
        return new DefaultSampler(firstHitSamples, maxBounces, true, true, LightMode.LightModeRandom, SpecularMode.SpecularModeNaive);
    }
    XRAY.NewSampler = NewSampler;
    function NewDirectSampler() {
        return new DefaultSampler(1, 0, true, false, LightMode.LightModeAll, SpecularMode.SpecularModeAll);
    }
    XRAY.NewDirectSampler = NewDirectSampler;
    var Sampler = (function () {
        function Sampler() {
        }
        Sampler.Sample = function (sampler, scene, ray) {
            return sampler.sample(scene, ray, true, sampler.FirstHitSamples, 0);
        };
        return Sampler;
    }());
    XRAY.Sampler = Sampler;
    var DefaultSampler = (function () {
        function DefaultSampler(FirstHitSamples, MaxBounces, DirectLighting, SoftShadows, LightMode, SpecularMode) {
            this.FirstHitSamples = FirstHitSamples;
            this.MaxBounces = MaxBounces;
            this.DirectLighting = DirectLighting;
            this.SoftShadows = SoftShadows;
            this.LightMode = LightMode;
            this.SpecularMode = SpecularMode;
        }
        DefaultSampler.prototype.sample = function (scene, ray, emission, samples, depth) {
            if (depth > this.MaxBounces) {
                return new Color3();
            }
            var hit = Scene.Intersect(scene, ray);
            if (!hit.Ok()) {
                return this.sampleEnvironment(scene, ray);
            }
            var info = hit.Info(ray);
            var material = info.Material;
            var result = new Color3();
            if (unsafe._mem_f64[(material + 32) >> 3] > 0) {
                if (this.DirectLighting && !emission) {
                    return result;
                }
                var __f = unsafe._mem_f64[(material + 32) >> 3] * samples;
                var tmp = Color.MulScalar2(unsafe._mem_i32[(material + 4) >> 2], __f);
                result = result.add(tmp);
            }
            var n = Math.sqrt(samples);
            var ma;
            var mb;
            if (this.SpecularMode == SpecularMode.SpecularModeAll || (depth == 0 && this.SpecularMode == SpecularMode.SpecularModeFirst)) {
                ma = BounceType.BounceTypeDiffuse;
                mb = BounceType.BounceTypeSpecular;
            }
            else {
                ma = BounceType.BounceTypeAny;
                mb = BounceType.BounceTypeAny;
            }
            for (var u = 0; u < n; u++) {
                for (var v = 0; v < n; v++) {
                    for (var mode = ma; mode <= mb; mode++) {
                        var fu = (u + Math.random()) / n;
                        var fv = (v + Math.random()) / n;
                        var bounce = ray.bounce(info, fu, fv, mode);
                        if (mode == BounceType.BounceTypeAny) {
                            bounce.coefficient = 1;
                        }
                        if (bounce.coefficient > 0 && bounce.reflected) {
                            var indirect = this.sample(scene, bounce.ray, bounce.reflected, 1, depth + 1);
                            var xindirect = Color.Mul2(unsafe._mem_i32[(material + 4) >> 2], indirect);
                            var tinted = indirect.mix(xindirect, unsafe._mem_f64[(material + 56) >> 3]);
                            result = result.add(tinted.mulScalar(bounce.coefficient));
                        }
                        if (bounce.coefficient > 0 && !bounce.reflected) {
                            var indirect = this.sample(scene, bounce.ray, bounce.reflected, 1, depth + 1);
                            var direct = new Color3();
                            if (this.DirectLighting) {
                                direct = this.sampleLights(scene, info.Ray);
                            }
                            result = result.add(Color.Mul2(unsafe._mem_i32[(material + 4) >> 2], direct.add(indirect)).mulScalar(bounce.coefficient));
                        }
                    }
                }
            }
            return result.divScalar(n * n);
        };
        DefaultSampler.prototype.sampleEnvironment = function (scene, ray) {
            if (unsafe._mem_i32[(scene + 8) >> 2]) {
                var d = ray.direction;
                var u = Math.atan2(d.z, d.x) + unsafe._mem_f64[(scene + 16) >> 3];
                var v = Math.atan2(d.y, new Vector3(d.x, 0, d.z).length());
                u = (u + Math.PI) / (2 * Math.PI);
                v = (v + Math.PI / 2) / Math.PI;
                return Texture.Sample(unsafe._mem_i32[(scene + 8) >> 2], u, v);
            }
            return new Color3().read(unsafe._mem_i32[(scene + 4) >> 2]);
        };
        DefaultSampler.prototype.sampleLights = function (scene, n) {
            var nLights = unsafe._mem_i32[(scene + 36) >> 2];
            if (nLights == 0) {
                return new Color3();
            }
            var lights = unsafe._mem_i32[(scene + 32) >> 2];
            if (this.LightMode == LightMode.LightModeAll) {
                var result = new Color3();
                for (var i = 0; i < nLights; i++) {
                    var light = unsafe._mem_i32[(lights + 4 + (4 * i)) >> 2];
                    result.add(this.sampleLight(scene, n, light));
                }
                return result;
            }
            else {
                var rndLight = Math.round(Math.random() * (nLights - 1));
                var light = unsafe._mem_i32[((unsafe._mem_i32[(scene + 32) >> 2]) + 4 + (4 * rndLight)) >> 2];
                var lightColor = this.sampleLight(scene, n, light);
                return lightColor.mulScalar(nLights);
            }
        };
        DefaultSampler.prototype.sampleLight = function (scene, n, light) {
            var center;
            var radius;
            switch (Shape.Type(light)) {
                case ShapeType.SPHERE:
                    radius = unsafe._mem_f64[(light + 16) >> 3];
                    center = new Vector3().read(unsafe._mem_i32[(light + 8) >> 2]);
                    break;
                default:
                    var box = Shape.BoundingBox(light);
                    radius = Box.OuterRadius(box);
                    center = Box.Center(box);
                    break;
            }
            var point = center.clone();
            if (this.SoftShadows) {
                var x = void 0;
                var y = void 0;
                while (true) {
                    x = Math.random() * 2 - 1;
                    y = Math.random() * 2 - 1;
                    if (x * x + y * y <= 1) {
                        var l = center.sub(n.origin).normalize();
                        var u = l.cross(Vector3.RandomUnitVector()).normalize();
                        var v = l.cross(u);
                        point = new Vector3();
                        point = point.add(u.mulScalar(x * radius));
                        point = point.add(v.mulScalar(y * radius));
                        point = point.add(center);
                        break;
                    }
                }
            }
            var ray = new Ray(n.origin, point.sub(n.origin).normalize());
            var diffuse = ray.direction.dot(n.direction);
            if (diffuse <= 0) {
                return new Color3();
            }
            var hit = Scene.Intersect(scene, ray);
            if (!hit.Ok()) {
                return new Color3();
            }
            var material = Material.MaterialAt(hit.Shape, point);
            var emittance = unsafe._mem_f64[(material + 32) >> 3];
            if (emittance == 0) {
                return new Color3();
            }
            var hyp = center.sub(n.origin).length();
            var opp = radius;
            var theta = Math.asin(opp / hyp);
            var adj = opp / Math.tan(theta);
            var d = Math.cos(theta) * adj;
            var r = Math.sin(theta) * adj;
            var coverage = (r * r) / (d * d);
            if (hyp < opp) {
                coverage = 1;
            }
            coverage = Math.min(coverage, 1);
            var m = emittance * diffuse * coverage;
            return Color.MulScalar2(unsafe._mem_i32[(material + 4) >> 2], m);
        };
        return DefaultSampler;
    }());
    XRAY.DefaultSampler = DefaultSampler;
    var Vector3 = (function () {
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Vector3.prototype.read = function (memory) {
            this.x = unsafe._mem_f64[(memory + 8) >> 3];
            this.y = unsafe._mem_f64[(memory + 16) >> 3];
            this.z = unsafe._mem_f64[(memory + 24) >> 3];
            return this;
        };
        Vector3.prototype.write = function (memory) {
            unsafe._mem_f64[(memory + 8) >> 3] = this.x;
            unsafe._mem_f64[(memory + 16) >> 3] = this.y;
            unsafe._mem_f64[(memory + 24) >> 3] = this.z;
            return memory;
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
        Vector3.prototype.maxComponent = function () {
            return Math.max(Math.max(this.x, this.y), this.z);
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
        Vector3.prototype.negate = function () {
            return new Vector3(-this.x, -this.y, -this.z);
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
        Vector3.prototype.clone = function () {
            return new Vector3(this.x, this.y, this.z);
        };
        Vector3.RandomUnitVector = function () {
            var x = Math.random() * 2 - 1;
            var y = Math.random() * 2 - 1;
            var z = Math.random() * 2 - 1;
            while (x * x + y * y + z * z > 1) {
                x = Math.random() * 2 - 1;
                y = Math.random() * 2 - 1;
                z = Math.random() * 2 - 1;
            }
            return new Vector3(x, y, z);
        };
        return Vector3;
    }());
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
    XRAY.Vector3 = Vector3;
    var Color3 = (function () {
        function Color3(r, g, b) {
            if (r === void 0) { r = 0; }
            if (g === void 0) { g = 0; }
            if (b === void 0) { b = 0; }
            this.r = r;
            this.g = g;
            this.b = b;
        }
        Color3.prototype.read = function (memory) {
            this.r = unsafe._mem_f64[(memory + 8) >> 3];
            this.g = unsafe._mem_f64[(memory + 16) >> 3];
            this.b = unsafe._mem_f64[(memory + 24) >> 3];
            return this;
        };
        Color3.prototype.write = function (memory) {
            unsafe._mem_f64[(memory + 8) >> 3] = this.r;
            unsafe._mem_f64[(memory + 16) >> 3] = this.g;
            unsafe._mem_f64[(memory + 24) >> 3] = this.b;
            return memory;
        };
        Color3.fromJson = function (color) {
            if (color) {
                return new Color3(color.r, color.g, color.b);
            }
            else {
                return null;
            }
        };
        Color3.hexColor = function (hex) {
            var red = ((hex >> 16) & 255) / 255;
            var green = ((hex >> 8) & 255) / 255;
            var blue = (hex & 255) / 255;
            return new Color3(red, green, blue).pow(2.2);
        };
        Color3.newColor = function (c) {
            return new Color3(c.r / 65535, c.g / 65535, c.b / 65535);
        };
        Color3.prototype.RGBA = function () {
            var a = this;
            var _c = new Uint8Array(3);
            _c[0] = Math.max(0, Math.min(255, a.r * 255));
            _c[1] = Math.max(0, Math.min(255, a.g * 255));
            _c[2] = Math.max(0, Math.min(255, a.b * 255));
            return { r: _c[0], g: _c[1], b: _c[2], a: 255 };
        };
        Color3.prototype.isBlack = function () {
            return this.r === 0 && this.g === 0 && this.b === 0;
        };
        Color3.prototype.isWhite = function () {
            return this.r === 1 && this.g === 1 && this.b === 1;
        };
        Color3.prototype.add = function (b) {
            return new Color3(this.r + b.r, this.g + b.g, this.b + b.b);
        };
        Color3.prototype.sub = function (b) {
            return new Color3(this.r - b.r, this.g - b.g, this.b - b.b);
        };
        Color3.prototype.mul = function (b) {
            return new Color3(this.r * b.r, this.g * b.g, this.b * b.b);
        };
        Color3.prototype.mulScalar = function (b) {
            return new Color3(this.r * b, this.g * b, this.b * b);
        };
        Color3.prototype.divScalar = function (b) {
            return new Color3(this.r / b, this.g / b, this.b / b);
        };
        Color3.prototype.min = function (b) {
            return new Color3(Math.min(this.r, b.r), Math.min(this.g, b.g), Math.min(this.b, b.b));
        };
        Color3.prototype.max = function (b) {
            return new Color3(Math.max(this.r, b.r), Math.max(this.g, b.g), Math.max(this.b, b.b));
        };
        Color3.prototype.pow = function (b) {
            return new Color3(Math.pow(this.r, b), Math.pow(this.g, b), Math.pow(this.b, b));
        };
        Color3.prototype.mix = function (b, pct) {
            var a = this.mulScalar(1 - pct);
            b = b.mulScalar(pct);
            return a.add(b);
        };
        Color3.prototype.set = function (r, g, b) {
            this.r = r;
            this.g = g;
            this.b = b;
            return this;
        };
        Color3.prototype.clone = function () {
            return new Color3(this.r, this.g, this.b);
        };
        Color3.random = function () {
            return new Color3(Math.random(), Math.random(), Math.random());
        };
        Color3.randomBrightColor = function () {
            var i = Math.round(Math.random() * Color3.brightColors.length);
            return Color3.brightColors[i];
        };
        return Color3;
    }());
    Color3.brightColors = [
        Color3.hexColor(0xFF00FF),
        Color3.hexColor(0x84FF00),
        Color3.hexColor(0xFF0084),
        Color3.hexColor(0x00FFFF),
        Color3.hexColor(0x00FF84),
        Color3.hexColor(0xDD40FF),
        Color3.hexColor(0xFFFF00)
    ];
    XRAY.Color3 = Color3;
    var Matrix4 = (function () {
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
        Matrix4.fromTHREEJS = function (e) {
            return new Matrix4(e[0], e[4], e[8], e[12], e[1], e[5], e[9], e[13], e[2], e[6], e[10], e[14], e[3], e[7], e[11], e[15]);
        };
        Object.defineProperty(Matrix4.prototype, "DATA", {
            get: function () {
                return [
                    this.x00, this.x01, this.x02, this.x03,
                    this.x10, this.x11, this.x12, this.x13,
                    this.x20, this.x21, this.x22, this.x23,
                    this.x30, this.x31, this.x32, this.x33
                ];
            },
            enumerable: true,
            configurable: true
        });
        Matrix4.Identity = function () {
            return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        };
        Matrix4.IsEqual = function (a, b) {
            return a.x00 == b.x00 && a.x01 == b.x01 && a.x02 == b.x02 && a.x03 == b.x03 &&
                a.x10 == b.x10 && a.x11 == b.x11 && a.x12 == b.x12 && a.x13 == b.x13 &&
                a.x20 == b.x20 && a.x21 == b.x21 && a.x22 == b.x22 && a.x23 == b.x23 &&
                a.x30 == b.x30 && a.x31 == b.x31 && a.x32 == b.x32 && a.x33 == b.x33;
        };
        Matrix4.prototype.isIdentity = function () {
            return this.x00 == 1 && this.x01 == 0 && this.x02 == 0 && this.x03 == 0 &&
                this.x10 == 0 && this.x11 == 1 && this.x12 == 0 && this.x13 == 0 &&
                this.x20 == 0 && this.x21 == 0 && this.x22 == 1 && this.x23 == 0 &&
                this.x30 == 0 && this.x31 == 0 && this.x32 == 0 && this.x33 == 1;
        };
        Matrix4.TranslateUnitMatrix4 = function (v) {
            return new Matrix4(1, 0, 0, v.x, 0, 1, 0, v.y, 0, 0, 1, v.z, 0, 0, 0, 1);
        };
        Matrix4.ScaleUnitMatrix4 = function (v) {
            return new Matrix4(v.x, 0, 0, 0, 0, v.y, 0, 0, 0, 0, v.z, 0, 0, 0, 0, 1);
        };
        Matrix4.RotateUnitMatrix4 = function (v, a, _c) {
            v = v.normalize();
            var s = Math.sin(a);
            var c = Math.cos(a);
            var m = 1 - c;
            return new Matrix4(m * v.x * v.x + c, m * v.x * v.y + v.z * s, m * v.z * v.x - v.y * s, 0, m * v.x * v.y - v.z * s, m * v.y * v.y + c, m * v.y * v.z + v.x * s, 0, m * v.z * v.x + v.y * s, m * v.y * v.z - v.x * s, m * v.z * v.z + c, 0, 0, 0, 0, 1);
        };
        Matrix4.FrustumUnitMatrix4 = function (l, r, b, t, n, f, c) {
            var t1 = 2 * n;
            var t2 = r - l;
            var t3 = t - b;
            var t4 = f - n;
            return new Matrix4(t1 / t2, 0, (r + l) / t2, 0, 0, t1 / t3, (t + b) / t3, 0, 0, 0, (-f - n) / t4, (-t1 * f) / t4, 0, 0, -1, 0);
        };
        Matrix4.OrthographicUnitMatrix4 = function (l, r, b, t, n, f, c) {
            return new Matrix4(2 / (r - l), 0, 0, -(r + l) / (r - l), 0, 2 / (t - b), 0, -(t + b) / (t - b), 0, 0, -2 / (f - n), -(f + n) / (f - n), 0, 0, 0, 1);
        };
        Matrix4.PerspectiveUnitMatrix4 = function (fovy, aspect, near, far, c) {
            var ymax = near * Math.tan(fovy * Math.PI / 360);
            var xmax = ymax * aspect;
            return Matrix4.Frustum(-xmax, xmax, -ymax, ymax, near, far, c);
        };
        Matrix4.LookAtMatrix4 = function (eye, center, up, c) {
            up = up.normalize();
            var f = center.sub(eye).normalize();
            var s = f.cross(up).normalize();
            var u = s.cross(f);
            return new Matrix4(unsafe._mem_f64[(s + 8) >> 3], unsafe._mem_f64[(u + 8) >> 3], unsafe._mem_f64[(f + 8) >> 3], 0, unsafe._mem_f64[(s + 16) >> 3], unsafe._mem_f64[(u + 16) >> 3], unsafe._mem_f64[(f + 16) >> 3], 0, unsafe._mem_f64[(s + 24) >> 3], unsafe._mem_f64[(u + 24) >> 3], unsafe._mem_f64[(f + 24) >> 3], 0, 0, 0, 0, 1).Transpose().inverse().Translate(eye);
        };
        Matrix4.Translate = function (m, v, c) {
            return Matrix4.Mul(m, Matrix4.TranslateUnitMatrix4(v), c);
        };
        Matrix4.Scale = function (m, v, c) {
            return Matrix4.Mul(m, Matrix4.ScaleUnitMatrix4(v), c);
        };
        Matrix4.Rotate = function (m, v, a, c) {
            return Matrix4.Mul(m, Matrix4.RotateUnitMatrix4(v, a), c);
        };
        Matrix4.Frustum = function (m, l, r, b, t, n, f, c) {
            return Matrix4.Mul(m, Matrix4.FrustumUnitMatrix4(l, r, b, t, n, f, c), c);
        };
        Matrix4.Orthographic = function (m, l, r, b, t, n, f, c) {
            return Matrix4.Mul(m, Matrix4.OrthographicUnitMatrix4(l, r, b, t, n, f, c), c);
        };
        Matrix4.Perspective = function (m, fovy, aspect, near, far, c) {
            return Matrix4.Mul(m, Matrix4.PerspectiveUnitMatrix4(fovy, aspect, near, far, c), c);
        };
        Matrix4.prototype.mul = function (b) {
            m = new Matrix4();
            m.x00 = this.x00 * b.x00 + this.x01 * b.x10 + this.x02 * b.x20 + this.x03 * b.x30;
            m.x10 = this.x10 * b.x00 + this.x11 * b.x10 + this.x12 * b.x20 + this.x13 * b.x30;
            m.x20 = this.x20 * b.x00 + this.x21 * b.x10 + this.x22 * b.x20 + this.x23 * b.x30;
            m.x30 = this.x30 * b.x00 + this.x31 * b.x10 + this.x32 * b.x20 + this.x33 * b.x30;
            m.x01 = this.x00 * b.x01 + this.x01 * b.x11 + this.x02 * b.x21 + this.x03 * b.x31;
            m.x11 = this.x10 * b.x01 + this.x11 * b.x11 + this.x12 * b.x21 + this.x13 * b.x31;
            m.x21 = this.x20 * b.x01 + this.x21 * b.x11 + this.x22 * b.x21 + this.x23 * b.x31;
            m.x31 = this.x30 * b.x01 + this.x31 * b.x11 + this.x32 * b.x21 + this.x33 * b.x31;
            m.x02 = this.x00 * b.x02 + this.x01 * b.x12 + this.x02 * b.x22 + this.x03 * b.x32;
            m.x12 = this.x10 * b.x02 + this.x11 * b.x12 + this.x12 * b.x22 + this.x13 * b.x32;
            m.x22 = this.x20 * b.x02 + this.x21 * b.x12 + this.x22 * b.x22 + this.x23 * b.x32;
            m.x32 = this.x30 * b.x02 + this.x31 * b.x12 + this.x32 * b.x22 + this.x33 * b.x32;
            m.x03 = this.x00 * b.x03 + this.x01 * b.x13 + this.x02 * b.x23 + this.x03 * b.x33;
            m.x13 = this.x10 * b.x03 + this.x11 * b.x13 + this.x12 * b.x23 + this.x13 * b.x33;
            m.x23 = this.x20 * b.x03 + this.x21 * b.x13 + this.x22 * b.x23 + this.x23 * b.x33;
            m.x33 = this.x30 * b.x03 + this.x31 * b.x13 + this.x32 * b.x23 + this.x33 * b.x33;
            return m;
        };
        Matrix4.prototype.mulPosition = function (b) {
            var x = this.x00 * b.x + this.x01 * b.y + this.x02 * b.z + this.x03;
            var y = this.x10 * b.x + this.x11 * b.y + this.x12 * b.z + this.x13;
            var z = this.x20 * b.x + this.x21 * b.y + this.x22 * b.z + this.x23;
            return new Vector3(x, y, z);
        };
        Matrix4.prototype.mulDirection = function (b) {
            var x = this.x00 * b.x + this.x01 * b.y + this.x02 * b.z;
            var y = this.x10 * b.x + this.x11 * b.y + this.x12 * b.z;
            var z = this.x20 * b.x + this.x21 * b.y + this.x22 * b.z;
            return new Vector3(x, y, z);
        };
        Matrix4.MulRay = function (a, ray) {
            throw "Not implemented";
            var origin = Matrix4.MulPosition_vec3(a, ray.origin);
            var direction = Matrix4.MulDirection_vec3(a, ray.direction);
            return new Ray(origin, direction);
        };
        Matrix4.MulBox = function (a, box, c) {
            throw "Not implemented";
            var min = unsafe._mem_i32[(box + 4) >> 2];
            var max = unsafe._mem_i32[(box + 8) >> 2];
            var r = new Vector3(this.x00, this.x10, this.x20);
            var u = new Vector3(this.x01, this.x11, this.x21);
            var b = new Vector3(this.x02, this.x12, this.x22);
            var t = new Vector3(this.x03, this.x13, this.x23);
            var xa = r.mulScalar(unsafe._mem_f64[(min + 8) >> 3]);
            var xb = r.mulScalar(unsafe._mem_f64[(max + 8) >> 3]);
            var ya = u.mulScalar(unsafe._mem_f64[(min + 16) >> 3]);
            var yb = u.mulScalar(unsafe._mem_f64[(max + 16) >> 3]);
            var za = b.mulScalar(unsafe._mem_f64[(min + 24) >> 3]);
            var zb = b.mulScalar(unsafe._mem_f64[(max + 24) >> 3]);
            xa = xa.min(xb);
            xb = xa.max(xb);
            ya = ya.min(yb);
            yb = ya.max(yb);
            za = za.min(zb);
            zb = za.max(zb);
            min = xa.add(ya).add(za).add(t);
            max = xb.add(yb).add(zb).add(t);
            var ptr = c ? c : Box.initInstance(unsafe.alloc(12, 4));
            return Box.Init_mem(ptr, min, max);
        };
        Matrix4.prototype.transpose = function () {
            return new Matrix4(this.x00, this.x10, this.x20, this.x30, this.x01, this.x11, this.x21, this.x31, this.x02, this.x12, this.x22, this.x32, this.x03, this.x13, this.x23, this.x33);
        };
        Matrix4.prototype.determinant = function () {
            return (this.x00 * this.x11 * this.x22 * this.x33 - this.x00 * this.x11 * this.x23 * this.x32 +
                this.x00 * this.x12 * this.x23 * this.x31 - this.x00 * this.x12 * this.x21 * this.x33 +
                this.x00 * this.x13 * this.x21 * this.x32 - this.x00 * this.x13 * this.x22 * this.x31 -
                this.x01 * this.x12 * this.x23 * this.x30 + this.x01 * this.x12 * this.x20 * this.x33 -
                this.x01 * this.x13 * this.x20 * this.x32 + this.x01 * this.x13 * this.x22 * this.x30 -
                this.x01 * this.x10 * this.x22 * this.x33 + this.x01 * this.x10 * this.x23 * this.x32 +
                this.x02 * this.x13 * this.x20 * this.x31 - this.x02 * this.x13 * this.x21 * this.x30 +
                this.x02 * this.x10 * this.x21 * this.x33 - this.x02 * this.x10 * this.x23 * this.x31 +
                this.x02 * this.x11 * this.x23 * this.x30 - this.x02 * this.x11 * this.x20 * this.x33 -
                this.x03 * this.x10 * this.x21 * this.x32 + this.x03 * this.x10 * this.x22 * this.x31 -
                this.x03 * this.x11 * this.x22 * this.x30 + this.x03 * this.x11 * this.x20 * this.x32 -
                this.x03 * this.x12 * this.x20 * this.x31 + this.x03 * this.x12 * this.x21 * this.x30);
        };
        Matrix4.prototype.inverse = function () {
            var m = new Matrix4();
            var d = this.determinant();
            m.x00 = (this.x12 * this.x23 * this.x31 - this.x13 * this.x22 * this.x31 + this.x13 * this.x21 * this.x32 - this.x11 * this.x23 * this.x32 - this.x12 * this.x21 * this.x33 + this.x11 * this.x22 * this.x33) / d;
            m.x01 = (this.x03 * this.x22 * this.x31 - this.x02 * this.x23 * this.x31 - this.x03 * this.x21 * this.x32 + this.x01 * this.x23 * this.x32 + this.x02 * this.x21 * this.x33 - this.x01 * this.x22 * this.x33) / d;
            m.x02 = (this.x02 * this.x13 * this.x31 - this.x03 * this.x12 * this.x31 + this.x03 * this.x11 * this.x32 - this.x01 * this.x13 * this.x32 - this.x02 * this.x11 * this.x33 + this.x01 * this.x12 * this.x33) / d;
            m.x03 = (this.x03 * this.x12 * this.x21 - this.x02 * this.x13 * this.x21 - this.x03 * this.x11 * this.x22 + this.x01 * this.x13 * this.x22 + this.x02 * this.x11 * this.x23 - this.x01 * this.x12 * this.x23) / d;
            m.x10 = (this.x13 * this.x22 * this.x30 - this.x12 * this.x23 * this.x30 - this.x13 * this.x20 * this.x32 + this.x10 * this.x23 * this.x32 + this.x12 * this.x20 * this.x33 - this.x10 * this.x22 * this.x33) / d;
            m.x11 = (this.x02 * this.x23 * this.x30 - this.x03 * this.x22 * this.x30 + this.x03 * this.x20 * this.x32 - this.x00 * this.x23 * this.x32 - this.x02 * this.x20 * this.x33 + this.x00 * this.x22 * this.x33) / d;
            m.x12 = (this.x03 * this.x12 * this.x30 - this.x02 * this.x13 * this.x30 - this.x03 * this.x10 * this.x32 + this.x00 * this.x13 * this.x32 + this.x02 * this.x10 * this.x33 - this.x00 * this.x12 * this.x33) / d;
            m.x13 = (this.x02 * this.x13 * this.x20 - this.x03 * this.x12 * this.x20 + this.x03 * this.x10 * this.x22 - this.x00 * this.x13 * this.x22 - this.x02 * this.x10 * this.x23 + this.x00 * this.x12 * this.x23) / d;
            m.x20 = (this.x11 * this.x23 * this.x30 - this.x13 * this.x21 * this.x30 + this.x13 * this.x20 * this.x31 - this.x10 * this.x23 * this.x31 - this.x11 * this.x20 * this.x33 + this.x10 * this.x21 * this.x33) / d;
            m.x21 = (this.x03 * this.x21 * this.x30 - this.x01 * this.x23 * this.x30 - this.x03 * this.x20 * this.x31 + this.x00 * this.x23 * this.x31 + this.x01 * this.x20 * this.x33 - this.x00 * this.x21 * this.x33) / d;
            m.x22 = (this.x01 * this.x13 * this.x30 - this.x03 * this.x11 * this.x30 + this.x03 * this.x10 * this.x31 - this.x00 * this.x13 * this.x31 - this.x01 * this.x10 * this.x33 + this.x00 * this.x11 * this.x33) / d;
            m.x23 = (this.x03 * this.x11 * this.x20 - this.x01 * this.x13 * this.x20 - this.x03 * this.x10 * this.x21 + this.x00 * this.x13 * this.x21 + this.x01 * this.x10 * this.x23 - this.x00 * this.x11 * this.x23) / d;
            m.x30 = (this.x12 * this.x21 * this.x30 - this.x11 * this.x22 * this.x30 - this.x12 * this.x20 * this.x31 + this.x10 * this.x22 * this.x31 + this.x11 * this.x20 * this.x32 - this.x10 * this.x21 * this.x32) / d;
            m.x31 = (this.x01 * this.x22 * this.x30 - this.x02 * this.x21 * this.x30 + this.x02 * this.x20 * this.x31 - this.x00 * this.x22 * this.x31 - this.x01 * this.x20 * this.x32 + this.x00 * this.x21 * this.x32) / d;
            m.x32 = (this.x02 * this.x11 * this.x30 - this.x01 * this.x12 * this.x30 - this.x02 * this.x10 * this.x31 + this.x00 * this.x12 * this.x31 + this.x01 * this.x10 * this.x32 - this.x00 * this.x11 * this.x32) / d;
            m.x33 = (this.x01 * this.x12 * this.x20 - this.x02 * this.x11 * this.x20 + this.x02 * this.x10 * this.x21 - this.x00 * this.x12 * this.x21 - this.x01 * this.x10 * this.x22 + this.x00 * this.x11 * this.x22) / d;
            return m;
        };
        return Matrix4;
    }());
    XRAY.Matrix4 = Matrix4;
})(XRAY || (XRAY = {}));
//# sourceMappingURL=xray-kernel-turbo.js.map