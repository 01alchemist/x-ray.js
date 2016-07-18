// Generated from D:/workspace/x-ray/modules/x-ray/kernel/rt-kernel.pts by Parallel.js 1.0.0; github.com/01alchemist/parallel-js

namespace kernel{

const height = 600;
const width = 800;
const RAW_MEMORY = new ArrayBuffer(height*width*4 + 65536);
ll.Runtime.init(RAW_MEMORY, 0, RAW_MEMORY.byteLength, true);

const shadows = true;		// Compute object shadows
const reflection = true;	// Compute object reflections
const reflection_depth = 2;
const antialias = false; // true;		// Antialias the image (expensive but pretty)

const debug = false;		// Progress printout, may confuse the consumer

const SENTINEL = 1e32;
const EPS = 0.00001;

function DL3(x, y, z) { return {x:x, y:y, z:z}; }

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

function Vec3() {}
Vec3.NAME = "Vec3";
Vec3.SIZE = 24;
Vec3.ALIGN = 8;
Vec3._get_impl = function (SELF){
        return DL3(ll.Runtime._mem_float64[(SELF + 0) >> 3], ll.Runtime._mem_float64[(SELF + 8) >> 3], ll.Runtime._mem_float64[(SELF + 16) >> 3]);
    }
Vec3._set_impl = function (SELF, v) {
  ll.Runtime._mem_float64[(SELF + 0) >> 3] = (v.x);
  ll.Runtime._mem_float64[(SELF + 8) >> 3] = (v.y);
  ll.Runtime._mem_float64[(SELF + 16) >> 3] = (v.z);
}

// Avoid intermediate DL3 objects

function subvref(a, b) { return DL3(a.x-ll.Runtime._mem_float64[(b + 0) >> 3], a.y-ll.Runtime._mem_float64[(b + 8) >> 3], a.z-ll.Runtime._mem_float64[(b + 16) >> 3]); }
function subrefref(a, b) { return DL3(ll.Runtime._mem_float64[(a + 0) >> 3]-ll.Runtime._mem_float64[(b + 0) >> 3], ll.Runtime._mem_float64[(a + 8) >> 3]-ll.Runtime._mem_float64[(b + 8) >> 3], ll.Runtime._mem_float64[(a + 16) >> 3]-ll.Runtime._mem_float64[(b + 16) >> 3]); }
function mulrefi(a, c) { return DL3(ll.Runtime._mem_float64[(a + 0) >> 3]*c, ll.Runtime._mem_float64[(a + 8) >> 3]*c, ll.Runtime._mem_float64[(a + 16) >> 3]*c); }

function Material() {}
Material.NAME = "Material";
Material.SIZE = 88;
Material.ALIGN = 8;
Material._get_impl = function (SELF) {
  var v = new Material;
  v.diffuse = Vec3._get_impl((SELF + 0));
  v.specular = Vec3._get_impl((SELF + 24));
  v.shininess = ll.Runtime._mem_float64[(SELF + 48) >> 3];
  v.ambient = Vec3._get_impl((SELF + 56));
  v.mirror = ll.Runtime._mem_float64[(SELF + 80) >> 3];
  return v;
}
Material._set_impl = function (SELF, v) {
  Vec3._set_impl((SELF + 0), (v.diffuse));
  Vec3._set_impl((SELF + 24), (v.specular));
  ll.Runtime._mem_float64[(SELF + 48) >> 3] = (v.shininess);
  Vec3._set_impl((SELF + 56), (v.ambient));
  ll.Runtime._mem_float64[(SELF + 80) >> 3] = (v.mirror);
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
Surface.SIZE = 96;
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
    default:
      throw ll.Runtime._badType(SELF);
  }
}
Surface.initInstance = function(SELF) { ll.Runtime._mem_int32[SELF>>2]=12421246; return SELF; }
ll.Runtime._idToType[12421246] = Surface;

function Scene(p) { this._pointer = (p|0); }
Scene.prototype = new Surface;
Scene.NAME = "Scene";
Scene.SIZE = 104;
Scene.ALIGN = 8;
Scene.CLSID = 31908292;
Object.defineProperty(Scene, 'BASE', {get: function () { return Surface; }});
Scene.init = function (SELF, objects) {
        var len = objects.length;
         ll.Runtime._mem_int32[(SELF + 96) >> 2] = len; 
        var objs = ll.Runtime.allocOrThrow(4 * len, 4);
        for ( var i=0 ; i < len ; i++ )
            ll.Runtime._mem_int32[(objs+4*i) >> 2] = (objects[i]);
         ll.Runtime._mem_int32[(SELF + 100) >> 2] = objs; 
        return SELF;
    }
Scene.intersect_impl = function (SELF, eye, ray, min, max) {
        var min_obj = ll.Runtime.NULL;
        var min_dist = SENTINEL;

        var objs = ll.Runtime._mem_int32[(SELF + 100) >> 2];
        for ( var idx=0, limit=ll.Runtime._mem_int32[(SELF + 96) >> 2] ; idx < limit ; idx++ ) {
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

function Object3D(p) { this._pointer = (p|0); }
Object.defineProperty(Object3D.prototype, 'pointer', { get: function () { return this._pointer } });
Object3D.NAME = "Object3D";
Object3D.SIZE = 4;
Object3D.ALIGN = 4;
Object3D.CLSID = 163336955;
Object.defineProperty(Object3D, 'BASE', {get: function () { return null; }});
Object3D.initInstance = function(SELF) { ll.Runtime._mem_int32[SELF>>2]=163336955; return SELF; }
ll.Runtime._idToType[163336955] = Object3D;

function kernel(p) { this._pointer = (p|0); }
Object.defineProperty(kernel.prototype, 'pointer', { get: function () { return this._pointer } });
kernel.NAME = "kernel";
kernel.SIZE = 4;
kernel.ALIGN = 4;
kernel.CLSID = 769813;
Object.defineProperty(kernel, 'BASE', {get: function () { return null; }});
kernel.initInstance = function(SELF) { ll.Runtime._mem_int32[SELF>>2]=769813; return SELF; }
ll.Runtime._idToType[769813] = kernel;
}
    
    