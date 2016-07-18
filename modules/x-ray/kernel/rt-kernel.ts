// Generated from modules/x-ray/kernel/rt-kernel.pts by Parallel.js 1.0.0; github.com/01alchemist/parallel-js

import {Vector3} from "../core/src/engine/math/Vector3";
namespace kernel{

    import Face3 = THREE.Face3;
    const height = 600;
    const width = 800;
    const RAW_MEMORY = new SharedArrayBuffer(height*width*4 + 65536);
    ll.Runtime.init(RAW_MEMORY, 0, RAW_MEMORY.byteLength, true);

    const shadows = true;		// Compute object shadows
    const reflection = true;	// Compute object reflections
    const reflection_depth = 2;
    const antialias = false; // true;		// Antialias the image (expensive but pretty)

    const debug = false;		// Progress printout, may confuse the consumer

    const SENTINEL = 1e32;
    const EPS = 0.00001;

    function DL2(x, y) { return {x:x, y:y}; }
    function DL3(x, y, z) { return {x:x, y:y, z:z}; }
    function DL4(x, y, z, w) { return {x:x, y:y, z:z, w:w}; }
    function F3(a, b, c) { return {a:a, b:b, c:c}; }
    function RGB(r, g, b) { return {r:r, g:g, b:b}; }

    let black = DL3(0,0,0);

    function add(a, b) { return DL3(a.x+b.x, a.y+b.y, a.z+b.z); }
    function addi(a, c) { return DL3(a.x+c, a.y+c, a.z+c); }
    function sub(a, b) { return DL3(a.x-b.x, a.y-b.y, a.z-b.z); }
    function subi(a, c) { return DL3(a.x-c, a.y-c, a.z-c); }
    function muli(a, c) { return DL3(a.x*c, a.y*c, a.z*c); }
    function divi(a, c) { return DL3(a.x/c, a.y/c, a.z/c); }
    function neg(a) { return DL3(-a.x, -a.y, -a.z); }
    function length(a) { return Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z); }
    function normalize(a) { var d = length(a); return DL3(a.x/d, a.y/d, a.z/d); }
    function cross(a, b) { return DL3(a.y*b.z - a.z*b.y, a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x); }
    function dot(a, b) { return a.x*b.x + a.y*b.y + a.z*b.z; }
    function fract(f) { return f - Math.floor(f); }
    function fract_add1(f) {
        let f1 = f - Math.floor(f);
        return f1 - Math.floor(f1 + 1);
    }
    function clampInt(x:number, lo:number, hi:number):number {
        if (x < lo) {return lo;}
        if (x > hi) {return hi;}
        return x;
    }

function Vector2() {}
Vector2.NAME = "Vector2";
Vector2.SIZE = 8;
Vector2.ALIGN = 4;
Vector2._get_impl = function (SELF){
            return DL2(ll.Runtime._mem_float32[(SELF + 0) >> 2], ll.Runtime._mem_float32[(SELF + 4) >> 2]);
        }
Vector2._set_impl = function (SELF, v) {
  ll.Runtime._mem_float32[(SELF + 0) >> 2] = (v.x);
  ll.Runtime._mem_float32[(SELF + 4) >> 2] = (v.y);
}

function Vector3() {}
Vector3.NAME = "Vector3";
Vector3.SIZE = 12;
Vector3.ALIGN = 4;
Vector3._get_impl = function (SELF){
            return DL3(ll.Runtime._mem_float32[(SELF + 0) >> 2], ll.Runtime._mem_float32[(SELF + 4) >> 2], ll.Runtime._mem_float32[(SELF + 8) >> 2]);
        }
Vector3._set_impl = function (SELF, v) {
  ll.Runtime._mem_float32[(SELF + 0) >> 2] = (v.x);
  ll.Runtime._mem_float32[(SELF + 4) >> 2] = (v.y);
  ll.Runtime._mem_float32[(SELF + 8) >> 2] = (v.z);
}

function Face3() {}
Face3.NAME = "Face3";
Face3.SIZE = 12;
Face3.ALIGN = 4;
Face3._get_impl = function (SELF){
            return F3(ll.Runtime._mem_int32[(SELF + 0) >> 2], ll.Runtime._mem_int32[(SELF + 4) >> 2], ll.Runtime._mem_int32[(SELF + 8) >> 2]);
        }
Face3._set_impl = function (SELF, v) {
  ll.Runtime._mem_int32[(SELF + 0) >> 2] = (v.a);
  ll.Runtime._mem_int32[(SELF + 4) >> 2] = (v.b);
  ll.Runtime._mem_int32[(SELF + 8) >> 2] = (v.c);
}

function Box() {}
Box.NAME = "Box";
Box.SIZE = 24;
Box.ALIGN = 4;
Box._get_impl = function (SELF) {
  var v = new Box;
  v.min = Vector3._get_impl((SELF + 0));
  v.max = Vector3._get_impl((SELF + 12));
  return v;
}
Box._set_impl = function (SELF, v) {
  Vector3._set_impl((SELF + 0), (v.min));
  Vector3._set_impl((SELF + 12), (v.max));
}

    // Avoid intermediate DL3 objects

    function subvref(a, b) { return DL3(a.x-ll.Runtime._mem_float32[(b + 0) >> 2], a.y-ll.Runtime._mem_float32[(b + 4) >> 2], a.z-ll.Runtime._mem_float32[(b + 8) >> 2]); }
    function subrefref(a, b) { return DL3(ll.Runtime._mem_float32[(a + 0) >> 2]-ll.Runtime._mem_float32[(b + 0) >> 2], ll.Runtime._mem_float32[(a + 4) >> 2]-ll.Runtime._mem_float32[(b + 4) >> 2], ll.Runtime._mem_float32[(a + 8) >> 2]-ll.Runtime._mem_float32[(b + 8) >> 2]); }
    function mulrefi(a, c) { return DL3(ll.Runtime._mem_float32[(a + 0) >> 2]*c, ll.Runtime._mem_float32[(a + 4) >> 2]*c, ll.Runtime._mem_float32[(a + 8) >> 2]*c); }

    /* Texture Domain */

function Color(p) { this._pointer = (p|0); }
Object.defineProperty(Color.prototype, 'pointer', { get: function () { return this._pointer } });
Color.NAME = "Color";
Color.SIZE = 16;
Color.ALIGN = 4;
Color.CLSID = 194603;
Object.defineProperty(Color, 'BASE', {get: function () { return null; }});
Color.init = function (SELF, color){
             ll.Runtime._mem_float32[(SELF + 4) >> 2] = (color.r); 
             ll.Runtime._mem_float32[(SELF + 8) >> 2] = (color.g); 
             ll.Runtime._mem_float32[(SELF + 12) >> 2] = (color.b); 
            return SELF;
        }

        @method Color.fromJson = function(SELF, color) {
            if (color) {
                return Color.init(SELF, color);
            } else {
                return null;
            }
        };

        @method Color.hexColor = function(SELF, hex:number):number {
            var red = ((hex >> 16) & 255 ) / 255;
            var green = ((hex >> 8) & 255) / 255;
            var blue = (hex & 255) / 255;
            return Color.pow(Color.init(SELF, RGB(red, green, blue)), 2.2);
        };

        @method Color.newColor = function(SELF, c:RGBA):number {
            return Color.init(SELF, RGB(c.r / 65535, c.g / 65535, c.b / 65535));
        };

        @method Color.RGBA = function(SELF:number):RGBA {
            let _c:Uint8Array = new Uint8Array(3);
            _c[0] = Math.max(0, Math.min(255, ll.Runtime._mem_float32[(SELF + 4) >> 2] * 255));
            _c[1] = Math.max(0, Math.min(255, ll.Runtime._mem_float32[(SELF + 8) >> 2] * 255));
            _c[2] = Math.max(0, Math.min(255, ll.Runtime._mem_float32[(SELF + 12) >> 2] * 255));
            return {r: _c[0], g: _c[1], b: _c[2], a: 255};
        };

        @method Color.isBlack = function(SELF:number):boolean {
            return ll.Runtime._mem_float32[(SELF + 4) >> 2] === 0 && ll.Runtime._mem_float32[(SELF + 8) >> 2] === 0 && ll.Runtime._mem_float32[(SELF + 12) >> 2] === 0;
        };

        @method Color.isWhite = function(SELF:number):boolean {
            return ll.Runtime._mem_float32[(SELF + 4) >> 2] === 1 && ll.Runtime._mem_float32[(SELF + 8) >> 2] === 1 && ll.Runtime._mem_float32[(SELF + 12) >> 2] === 1;
        };

        Color.add = function(a:Color, b:Color){return RGB(a.r + b.r, a.g + b.g, a.b + b.b);};
        @method Color.add_mem = function(a:number, b:number){
            return RGB(ll.Runtime._mem_float32[(a + 4) >> 2] + ll.Runtime._mem_float32[(b + 4) >> 2], ll.Runtime._mem_float32[(a + 8) >> 2] + ll.Runtime._mem_float32[(b + 8) >> 2], ll.Runtime._mem_float32[(a + 12) >> 2] + ll.Runtime._mem_float32[(b + 12) >> 2]);
        };

        Color.sub = function(a:Color, b:Color){return RGB(a.r - b.r, a.g - b.g, a.b - b.b);};
        @method Color.sub_mem = function(a:number, b:number){
            return RGB(ll.Runtime._mem_float32[(a + 4) >> 2] - ll.Runtime._mem_float32[(b + 4) >> 2], ll.Runtime._mem_float32[(a + 8) >> 2] - ll.Runtime._mem_float32[(b + 8) >> 2], ll.Runtime._mem_float32[(a + 12) >> 2] - ll.Runtime._mem_float32[(b + 12) >> 2]);
        };

        Color.mul = function(a:Color, b:Color){return RGB(a.r * b.r, a.g * b.g, a.b * b.b);};
        @method Color.mul_mem = function(a:number, b:number) {
            return RGB(ll.Runtime._mem_float32[(a + 4) >> 2] * ll.Runtime._mem_float32[(b + 4) >> 2], ll.Runtime._mem_float32[(a + 8) >> 2] * ll.Runtime._mem_float32[(b + 8) >> 2], ll.Runtime._mem_float32[(a + 12) >> 2] * ll.Runtime._mem_float32[(b + 12) >> 2]);
        };

        Color.mulScalar = function(a:Color, f:number){return RGB(a.r * f, a.g * f, a.b * f);};
        @method Color.mulScalar_mem = function(a:number, f:number) {
            return RGB(ll.Runtime._mem_float32[(a + 4) >> 2] * f, ll.Runtime._mem_float32[(a + 8) >> 2] * f, ll.Runtime._mem_float32[(a + 12) >> 2] * f);
        };

        Color.divScalar = function(a:Color, f:number){return RGB(a.r / f, a.g / f, a.b / f);};
        @method Color.divScalar_mem = function(a:number, f:number) {
            return RGB(ll.Runtime._mem_float32[(a + 4) >> 2] / f, ll.Runtime._mem_float32[(a + 8) >> 2] / f, ll.Runtime._mem_float32[(a + 12) >> 2] / f);
        };

        Color.min = function(a:Color, b:Color) {return RGB( Math.min(a.r , b.r), Math.min(a.g , b.g), Math.min(a.b , b.b) );};
        @method Color.min_mem = function(a:number, b:number) {
            return RGB( Math.min(ll.Runtime._mem_float32[(a + 4) >> 2] , ll.Runtime._mem_float32[(b + 4) >> 2]), Math.min(ll.Runtime._mem_float32[(a + 8) >> 2] , ll.Runtime._mem_float32[(b + 8) >> 2]), Math.min(ll.Runtime._mem_float32[(a + 12) >> 2] , ll.Runtime._mem_float32[(b + 12) >> 2]) );
        };

        Color.max = function(a:Color, b:Color){return RGB( Math.max(a.r , b.r), Math.max(a.g , b.g), Math.max(a.b , b.b) );};
        @method Color.max_mem = function(a:number, b:number){
            return RGB( Math.max(ll.Runtime._mem_float32[(a + 4) >> 2] , ll.Runtime._mem_float32[(b + 4) >> 2]), Math.max(ll.Runtime._mem_float32[(a + 8) >> 2] , ll.Runtime._mem_float32[(b + 8) >> 2]), Math.max(ll.Runtime._mem_float32[(a + 12) >> 2] , ll.Runtime._mem_float32[(b + 12) >> 2]) );
        };

        Color.pow = function(a:Color, f:number) {return RGB( Math.pow(a.r, f), Math.pow(a.g, f), Math.pow(a.b, f) );};
        @method Color.pow_mem = function(a:number, f:number) {
            return RGB( Math.pow(ll.Runtime._mem_float32[(a + 4) >> 2], f), Math.pow(ll.Runtime._mem_float32[(a + 8) >> 2], f), Math.pow(ll.Runtime._mem_float32[(a + 12) >> 2], f) );
        };

        Color.mix = function(a:Color, b:Color, pct:number) {
            let _a = Color.mulScalar(a, 1 - pct);
            let _b = Color.mulScalar(b, pct);
            return RGB(_a.r + _b.r, _a.g + _b.g, _a.b + _b.b);
        };
        @method Color.mix_mem = function(a:number, b:number, pct:number) {
            let _a = Color.mulScalar_mem(a, 1 - pct);
            let _b = Color.mulScalar_mem(b, pct);
            return RGB(_a.r + _b.r, _a.g + _b.g, _a.b + _b.b);
        };
Color.set = function (SELF, r:number, g:number, b:number) {
             ll.Runtime._mem_float32[(SELF + 4) >> 2] = r; 
             ll.Runtime._mem_float32[(SELF + 8) >> 2] = g; 
             ll.Runtime._mem_float32[(SELF + 12) >> 2] = b; 
            return SELF;
        }
Color.clone = function (SELF):number {
            return Color.init(SELF, RGB(ll.Runtime._mem_float32[(SELF + 4) >> 2], ll.Runtime._mem_float32[(SELF + 8) >> 2], ll.Runtime._mem_float32[(SELF + 12) >> 2]));
        }

        Color.brightColors = [
            Color.hexColor(0xFF00FF),
            Color.hexColor(0x84FF00),
            Color.hexColor(0xFF0084),
            Color.hexColor(0x00FFFF),
            Color.hexColor(0x00FF84),
            Color.hexColor(0xDD40FF),
            Color.hexColor(0xFFFF00)
        ];

        Color.random = function():Color {
            return new Color(Math.random(), Math.random(), Math.random());
        };

        Color.randomBrightColor = function():Color {
            var i:number = Math.round(Math.random() * Color.brightColors.length);
            return Color.brightColors[i];
        };
Color.initInstance = function(SELF) { ll.Runtime._mem_int32[SELF>>2]=194603; return SELF; }
ll.Runtime._idToType[194603] = Color;

function Texture(p) { this._pointer = (p|0); }
Object.defineProperty(Texture.prototype, 'pointer', { get: function () { return this._pointer } });
Texture.NAME = "Texture";
Texture.SIZE = 16;
Texture.ALIGN = 4;
Texture.CLSID = 10502342;
Object.defineProperty(Texture, 'BASE', {get: function () { return null; }});
Texture.init = function (SELF, height, width, color) {
             ll.Runtime._mem_int32[(SELF + 8) >> 2] = height; 
             ll.Runtime._mem_int32[(SELF + 12) >> 2] = width; 
            var data = ll.Runtime.allocOrThrow(4 * (height * width), 4);
            //var c = (255<<24)|((255*color.z)<<16)|((255*color.y)<<8)|(255*color.x)

            if(!color){
                color = black;
            }

            if(color instanceof Float32Array){
                for ( var i=0, l=width*height ; i < l ; i += 3) {
                    ll.Runtime._mem_int32[(data+4*i) >> 2] = (Color.init( RGB(color[i], color[i+1], color[i+2]) ));
                }
            }else{
                for ( var i=0, l=width*height ; i < l ; i++ ) {
                    ll.Runtime._mem_int32[(data+4*i) >> 2] = (Color.init(color));
                }
            }

             ll.Runtime._mem_int32[(SELF + 4) >> 2] = data; 
            return SELF;
        }

        // For debugging only
Texture.ref = function (SELF, y, x) {
            return ll.Runtime._mem_int32[((ll.Runtime._mem_int32[(SELF + 4) >> 2])+4*((ll.Runtime._mem_int32[(SELF + 8) >> 2]-y)*ll.Runtime._mem_int32[(SELF + 12) >> 2]+x)) >> 2];
        }

        //
Texture.bilinearSample = function (SELF, u:number, v:number):Color {
            let w = ll.Runtime._mem_int32[(SELF + 12) >> 2] - 1;
            let h = ll.Runtime._mem_int32[(SELF + 8) >> 2] - 1;
            let f = u * w;
            let X = Math.floor(f);
            let x = f - X;
            f = v * h;
            let Y = Math.floor(f);
            let y = f - Y;

            let x0 = X;
            let y0 = Y;
            let x1 = x0 + 1;
            let y1 = y0 + 1;
            let i00:number = y0 * ll.Runtime._mem_int32[(SELF + 12) >> 2] + x0;
            let i01:number = y1 * ll.Runtime._mem_int32[(SELF + 12) >> 2] + x0;
            let i10:number = y0 * ll.Runtime._mem_int32[(SELF + 12) >> 2] + x1;
            let i11:number = y1 * ll.Runtime._mem_int32[(SELF + 12) >> 2] + x1;

            let len:number = Texture.data.length(SELF);

            i00 = i00 >= len ? len - 1 : i00;
            i01 = i01 >= len ? len - 1 : i01;
            i10 = i10 >= len ? len - 1 : i10;
            i11 = i11 >= len ? len - 1 : i11;

            let c00 = ll.Runtime._mem_int32[((ll.Runtime._mem_int32[(SELF + 4) >> 2])+4*i00) >> 2];
            let c01 = ll.Runtime._mem_int32[((ll.Runtime._mem_int32[(SELF + 4) >> 2])+4*i01) >> 2];
            let c10 = ll.Runtime._mem_int32[((ll.Runtime._mem_int32[(SELF + 4) >> 2])+4*i10) >> 2];
            let c11 = ll.Runtime._mem_int32[((ll.Runtime._mem_int32[(SELF + 4) >> 2])+4*i11) >> 2];
            let c = DL3();
            c = add(c, mulrefi(c00, (1 - x) * (1 - y)));
            c = add(c, mulrefi(c10, x * (1 - y)));
            c = add(c, mulrefi(c01, (1 - x) * y));
            c = add(c, mulrefi(c11, x * y));

            //if (c.isBlack()) {
                //console.log(c00, c01, c10, c11);
            //}

            return c;
        }
Texture.sample = function (SELF, u:number, v:number):Vector3 {
            // u = fract(fract(u) + 1);
            u = fract_add1(u);
            // v = fract(fract(v) + 1);
            v = fract_add1(v);
            return Texture.bilinearSample(SELF, u, 1 - v);
        }
Texture.normalSample = function (SELF, u:number, v:number):Vector3 {
            let c = Texture.sample(SELF, u, v);
            return normalize(DL3(c.x * 2 - 1, c.y * 2 - 1, c.z * 2 - 1));
        }
Texture.bumpSample = function (SELF, u:number, v:number):Vector3 {
            u = fract_add1(u);
            v = fract_add1(v);
            v = 1 - v;
            let w = ll.Runtime._mem_int32[(SELF + 12) >> 2];
            let h = ll.Runtime._mem_int32[(SELF + 8) >> 2];
            let x:number = Math.round(u * w);
            let y:number = Math.round(v * h);
            let x1:number = clampInt(x - 1, 0, w - 1);
            let x2:number = clampInt(x + 1, 0, w - 1);
            let y1:number = clampInt(y - 1, 0, h - 1);
            let y2:number = clampInt(y + 1, 0, h - 1);
            let cx = subrefref(ll.Runtime._mem_int32[((ll.Runtime._mem_int32[(SELF + 4) >> 2])+4*(y * w + x1)) >> 2], ll.Runtime._mem_int32[((ll.Runtime._mem_int32[(SELF + 4) >> 2])+4*(y * w + x2)) >> 2]);
            let cy = subrefref(ll.Runtime._mem_int32[((ll.Runtime._mem_int32[(SELF + 4) >> 2])+4*(y1 * w + x)) >> 2], ll.Runtime._mem_int32[((ll.Runtime._mem_int32[(SELF + 4) >> 2])+4*(y2 * w + x)) >> 2]);
            return DL3(cx.x, cy.x, 0);
        }
        // Not a hot function
Texture.setColor = function (SELF, y, x, v) {
            ll.Runtime._mem_int32[((ll.Runtime._mem_int32[(SELF + 4) >> 2])+4*((ll.Runtime._mem_int32[(SELF + 8) >> 2]-y-1)*ll.Runtime._mem_int32[(SELF + 12) >> 2]+x)) >> 2] = ((255<<24)|((255*v.z)<<16)|((255*v.y)<<8)|(255*v.x));
        }
Texture.initInstance = function(SELF) { ll.Runtime._mem_int32[SELF>>2]=10502342; return SELF; }
ll.Runtime._idToType[10502342] = Texture;

function Material() {}
Material.NAME = "Material";
Material.SIZE = 56;
Material.ALIGN = 8;
Material._get_impl = function (SELF) {
  var v = new Material;
  v.diffuse = Vector3._get_impl((SELF + 0));
  v.specular = Vector3._get_impl((SELF + 12));
  v.shininess = ll.Runtime._mem_float64[(SELF + 24) >> 3];
  v.ambient = Vector3._get_impl((SELF + 32));
  v.mirror = ll.Runtime._mem_float64[(SELF + 48) >> 3];
  return v;
}
Material._set_impl = function (SELF, v) {
  Vector3._set_impl((SELF + 0), (v.diffuse));
  Vector3._set_impl((SELF + 12), (v.specular));
  ll.Runtime._mem_float64[(SELF + 24) >> 3] = (v.shininess);
  Vector3._set_impl((SELF + 32), (v.ambient));
  ll.Runtime._mem_float64[(SELF + 48) >> 3] = (v.mirror);
}

    function makeMaterial(diffuse, specular, shininess, ambient, mirror) {
        var v = new Material;
        v.diffuse = diffuse;
        v.specular = specular;
        v.shininess = shininess;
        v.ambient = ambient;
        v.mirror = mirror;
        return v;
    }

function Surface(p) { this._pointer = (p|0); }
Object.defineProperty(Surface.prototype, 'pointer', { get: function () { return this._pointer } });
Surface.NAME = "Surface";
Surface.SIZE = 64;
Surface.ALIGN = 8;
Surface.CLSID = 12421246;
Object.defineProperty(Surface, 'BASE', {get: function () { return null; }});
Surface.init = function (SELF, material) {
             Material._set_impl((SELF + 8), material); 
            return SELF;
        }
Surface.intersect_impl = function (SELF, eye, ray, min, max) {
            throw "Pure: Surface.intersect"
        }
Surface.normal_impl = function (SELF, p) {
            throw "Pure: Surface.normal"
        }
Surface.intersect = function (SELF , eye,ray,min,max) {
  switch (ll.Runtime._mem_int32[SELF>>2]) {
    case 12421246:
      return Surface.intersect_impl(SELF , eye,ray,min,max);
    case 217195274:
      return Triangle.intersect_impl(SELF , eye,ray,min,max);
    case 31908292:
      return Scene.intersect_impl(SELF , eye,ray,min,max);
    default:
      throw ll.Runtime._badType(SELF);
  }
}
Surface.normal = function (SELF , p) {
  switch (ll.Runtime._mem_int32[SELF>>2]) {
    case 12421246:
    case 31908292:
      return Surface.normal_impl(SELF , p);
    case 217195274:
      return Triangle.normal_impl(SELF , p);
    default:
      throw ll.Runtime._badType(SELF);
  }
}
Surface.initInstance = function(SELF) { ll.Runtime._mem_int32[SELF>>2]=12421246; return SELF; }
ll.Runtime._idToType[12421246] = Surface;

function Triangle(p) { this._pointer = (p|0); }
Triangle.prototype = new Surface;
Triangle.NAME = "Triangle";
Triangle.SIZE = 172;
Triangle.ALIGN = 8;
Triangle.CLSID = 217195274;
Object.defineProperty(Triangle, 'BASE', {get: function () { return Surface; }});
Triangle.init = function (SELF, material, v1, v2, v3) {
            Surface.init(SELF, material)
             Vector3._set_impl((SELF + 64), v1); 
             Vector3._set_impl((SELF + 76), v2); 
             Vector3._set_impl((SELF + 88), v3); 
            return SELF;
        }
Triangle.intersect_impl = function (SELF, eye, ray, min, max) {
            // TODO: observe that values that do not depend on g, h, and i can be precomputed
            // and stored with the triangle (for a given eye position), at some (possibly significant)
            // space cost.  Notably the numerator of "t" is invariant, as are many factors of the
            // numerator of "gamma".
            var a = ll.Runtime._mem_float32[(SELF + 64) >> 2] - ll.Runtime._mem_float32[(SELF + 76) >> 2];
            var b = ll.Runtime._mem_float32[(SELF + 68) >> 2] - ll.Runtime._mem_float32[(SELF + 80) >> 2];
            var c = ll.Runtime._mem_float32[(SELF + 72) >> 2] - ll.Runtime._mem_float32[(SELF + 84) >> 2];
            var d = ll.Runtime._mem_float32[(SELF + 64) >> 2] - ll.Runtime._mem_float32[(SELF + 88) >> 2];
            var e = ll.Runtime._mem_float32[(SELF + 68) >> 2] - ll.Runtime._mem_float32[(SELF + 92) >> 2];
            var f = ll.Runtime._mem_float32[(SELF + 72) >> 2] - ll.Runtime._mem_float32[(SELF + 96) >> 2];
            var g = ray.x;
            var h = ray.y;
            var i = ray.z;
            var j = ll.Runtime._mem_float32[(SELF + 64) >> 2] - eye.x;
            var k = ll.Runtime._mem_float32[(SELF + 68) >> 2] - eye.y;
            var l = ll.Runtime._mem_float32[(SELF + 72) >> 2] - eye.z;
            var M = a*(e*i - h*f) + b*(g*f - d*i) + c*(d*h - e*g);
            var t = -((f*(a*k - j*b) + e*(j*c - a*l) + d*(b*l - k*c))/M);
            if (t < min || t > max)
                return {obj:NULL,dist:0};
            var gamma = (i*(a*k - j*b) + h*(j*c - a*l) + g*(b*l - k*c))/M;
            if (gamma < 0 || gamma > 1.0)
                return {obj:NULL,dist:0};
            var beta = (j*(e*i - h*f) + k*(g*f - d*i) + l*(d*h - e*g))/M;
            if (beta < 0.0 || beta > 1.0 - gamma)
                return {obj:NULL,dist:0};
            return {obj:SELF, dist:t};
        }
Triangle.normal_impl = function (SELF, p) {
            // TODO: Observe that the normal is invariant and can be stored with the triangle
            return normalize(cross(subrefref((SELF + 76), (SELF + 64)), subrefref((SELF + 88), (SELF + 64))));
        }
Triangle.intersect = function (SELF , eye,ray,min,max) {
  switch (ll.Runtime._mem_int32[SELF>>2]) {
    case 217195274:
      return Triangle.intersect_impl(SELF , eye,ray,min,max);
    default:
      throw ll.Runtime._badType(SELF);
  }
}
Triangle.normal = function (SELF , p) {
  switch (ll.Runtime._mem_int32[SELF>>2]) {
    case 217195274:
      return Triangle.normal_impl(SELF , p);
    default:
      throw ll.Runtime._badType(SELF);
  }
}
Triangle.initInstance = function(SELF) { ll.Runtime._mem_int32[SELF>>2]=217195274; return SELF; }
ll.Runtime._idToType[217195274] = Triangle;
    /* Primitives End */

function Object3D(p) { this._pointer = (p|0); }
Object.defineProperty(Object3D.prototype, 'pointer', { get: function () { return this._pointer } });
Object3D.NAME = "Object3D";
Object3D.SIZE = 8;
Object3D.ALIGN = 4;
Object3D.CLSID = 163336955;
Object.defineProperty(Object3D, 'BASE', {get: function () { return null; }});
Object3D.initInstance = function(SELF) { ll.Runtime._mem_int32[SELF>>2]=163336955; return SELF; }
ll.Runtime._idToType[163336955] = Object3D;

function BufferGeometry(p) { this._pointer = (p|0); }
Object.defineProperty(BufferGeometry.prototype, 'pointer', { get: function () { return this._pointer } });
BufferGeometry.NAME = "BufferGeometry";
BufferGeometry.SIZE = 20;
BufferGeometry.ALIGN = 4;
BufferGeometry.CLSID = 195949499;
Object.defineProperty(BufferGeometry, 'BASE', {get: function () { return null; }});
BufferGeometry.initInstance = function(SELF) { ll.Runtime._mem_int32[SELF>>2]=195949499; return SELF; }
ll.Runtime._idToType[195949499] = BufferGeometry;
    
function Mesh(p) { this._pointer = (p|0); }
Mesh.prototype = new Object3D;
Mesh.NAME = "Mesh";
Mesh.SIZE = 12;
Mesh.ALIGN = 4;
Mesh.CLSID = 159255331;
Object.defineProperty(Mesh, 'BASE', {get: function () { return Object3D; }});
Mesh.initInstance = function(SELF) { ll.Runtime._mem_int32[SELF>>2]=159255331; return SELF; }
ll.Runtime._idToType[159255331] = Mesh;

function Scene(p) { this._pointer = (p|0); }
Scene.prototype = new Surface;
Scene.NAME = "Scene";
Scene.SIZE = 72;
Scene.ALIGN = 8;
Scene.CLSID = 31908292;
Object.defineProperty(Scene, 'BASE', {get: function () { return Surface; }});
Scene.init = function (SELF, objects) {
            var len = objects.length;
             ll.Runtime._mem_int32[(SELF + 64) >> 2] = len; 
            var objs = ll.Runtime.allocOrThrow(4 * len, 4);
            for ( var i=0 ; i < len ; i++ )
                ll.Runtime._mem_int32[(objs+4*i) >> 2] = (objects[i]);
             ll.Runtime._mem_int32[(SELF + 68) >> 2] = objs; 
            return SELF;
        }
Scene.intersect_impl = function (SELF, eye, ray, min, max) {
            var min_obj = ll.Runtime.NULL;
            var min_dist = SENTINEL;

            var objs = ll.Runtime._mem_int32[(SELF + 68) >> 2];
            for ( var idx=0, limit=ll.Runtime._mem_int32[(SELF + 64) >> 2] ; idx < limit ; idx++ ) {
                var surf = ll.Runtime._mem_int32[(objs+4*idx) >> 2];
                var tmp = Surface.intersect(surf, eye, ray, min, max);
                var obj = tmp.obj;
                var dist = tmp.dist;
                if (obj)
                    if (dist >= min && dist < max)
                        if (dist < min_dist) {
                            min_obj = obj;
                            min_dist = dist;
                        }
            }
            return {obj:min_obj, dist:min_dist};
        }
Scene.intersect = function (SELF , eye,ray,min,max) {
  switch (ll.Runtime._mem_int32[SELF>>2]) {
    case 31908292:
      return Scene.intersect_impl(SELF , eye,ray,min,max);
    default:
      throw ll.Runtime._badType(SELF);
  }
}
Scene.normal = function (SELF , p) {
  switch (ll.Runtime._mem_int32[SELF>>2]) {
    default:
      return Surface.normal_impl(SELF , p);
  }
}
Scene.initInstance = function(SELF) { ll.Runtime._mem_int32[SELF>>2]=31908292; return SELF; }
ll.Runtime._idToType[31908292] = Scene;

}
    
    