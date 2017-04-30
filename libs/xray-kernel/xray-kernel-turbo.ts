//turbo.js bundle
declare var turbo:{
    Runtime:any
};

class MemoryObject {

   private _pointer:number;

   get pointer():number { return this._pointer; };

   constructor(p:number){
       this._pointer = (p | 0);
   }
}

namespace XRAY {
// Generated from C:\Users\nidin\workspace\x-ray-kernel\src\kernel\turbo\xray-kernel-turbo.tts by turbo.js 1.0.0; github.com/01alchemist/turbo.js

//Turbo module
///<reference path="./src/declaration.d.ts" />
type float32 = number;
type float64 = number;

const height:number = 600;
const width:number = 800;

const shadows:boolean = true;		// Compute object shadows
const reflection:boolean = true;	// Compute object reflections
const reflection_depth:number = 2;
const antialias:boolean = false; // true;		// Antialias the image (expensive but pretty)

const debug:boolean = false;		// Progress printout, may confuse the consumer

const INF:number = 1e9;
const EPS:number = 1e-9;
const SENTINEL:number = 1e32;

function xy(x:number, y:number) {
    return {x: x, y: y};
}
function xyz(x:number, y:number, z:number) {
    return {x: x, y: y, z: z};
}
function xyzw(x:number, y:number, z:number, w:number) {
    return {x: x, y: y, z: z, W: w};
}
function F3(a:number, b:number, c:number) {
    return {A: a, b: b, C: c};
}
function rgb(r:number, g:number, b:number) {
    return {r: r, g: g, b: b};
}
function ray(origin:number, direction:number) {
    return {Origin: origin, Direction: direction};
}
function free(ptr){
    unsafe.free(ptr);
}
// const black = DL3(0,0,0);

// function add(a, b) { return DL3(a.x+b.x, a.y+b.y, a.z+b.z); }
// function addi(a, c) { return DL3(a.x+c, a.y+c, a.z+c); }
// function sub(a, b) { return DL3(a.x-b.x, a.y-b.y, a.z-b.z); }
// function subi(a, c) { return DL3(a.x-c, a.y-c, a.z-c); }
// function muli(a, c) { return DL3(a.x*c, a.y*c, a.z*c); }
// function divi(a, c) { return DL3(a.x/c, a.y/c, a.z/c); }
// function neg(a) { return DL3(-a.x, -a.y, -a.z); }
// function length(a) { return Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z); }
// function normalize(a) { var d = length(a); return DL3(a.x/d, a.y/d, a.z/d); }
// function cross(a, b) { return DL3(a.y*b.z - a.z*b.y, a.z*b.x - a.x*b.z, a.x*b.y - a.y*b.x); }
// function dot(a, b) { return a.x*b.x + a.y*b.y + a.z*b.z; }

/*
function fract(f) {
    return f - Math.floor(f);
}
function fract_add1(f) {
    let f1 = f - Math.floor(f);
    return f1 - Math.floor(f1 + 1);
}
function clampInt(x, lo, hi) {
    if (x < lo) {
        return lo;
    }
    if (x > hi) {
        return hi;
    }
    return x;
}
function len(ptr, T) {

}*/


export enum Axis{
    AxisNone,
    AxisX,
    AxisY,
    AxisZ,
}

type RGBA  = {
    r:number,
    g:number,
    b:number,
    a:number
};
type RGB = {
    r:number,
    g:number,
    b:number
};

export class Color extends MemoryObject{
   static NAME:string = "Color";
   static SIZE:number = 32;
   static ALIGN:number = 8;
   static CLSID:number = 194603;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF:number, color = {r:0,g:0,b:0}):number {
		 unsafe._mem_f64[(SELF + 8) >> 3] = (color.r); 
		 unsafe._mem_f64[(SELF + 16) >> 3] = (color.g); 
		 unsafe._mem_f64[(SELF + 24) >> 3] = (color.b); 
		return SELF;
	}

    static Init_mem(SELF:number, r:number = 0,g:number = 0,b:number = 0):number {
		 unsafe._mem_f64[(SELF + 8) >> 3] = r; 
		 unsafe._mem_f64[(SELF + 16) >> 3] = g; 
		 unsafe._mem_f64[(SELF + 24) >> 3] = b; 
		return SELF;
	}

    static NewColor(color?,g:number = 0,b:number = 0):number {
        let ptr:number = Color.initInstance(unsafe.alloc(32,8));
        if(typeof color === "object"){
            return Color.init(ptr, color);
        }else{
            return Color.Init_mem(ptr, color, g, b);
        }
    }
    
	static HexColor(hex:number, c?):number {
		let r = ((hex >> 16) & 255 ) / 255;
		let g = ((hex >> 8) & 255) / 255;
		let b = (hex & 255) / 255;
        let ptr:number = c?c:Color.initInstance(unsafe.alloc(32,8));
		return Color.Pow_mem(Color.Init_mem(ptr, r, g, b), 2.2);
	}

    static Kelvin(K:number):number {
        var red:number;
        var green:number;
        var blue:number;
        // red
        if(K >= 6600){
            var a = 351.97690566805693;
            var b = 0.114206453784165;
            var c = -40.25366309332127;
            var x = K/100 - 55;
            red = a + b*x + c*Math.log(x)
        } else {
            red = 255;
        }
        // green
        if(K >= 6600){
            a = 325.4494125711974;
            b = 0.07943456536662342;
            c = -28.0852963507957;
            x = K/100 - 50;
            green = a + b*x + c*Math.log(x)
        } else if (K >= 1000) {
            a = -155.25485562709179;
            b = -0.44596950469579133;
            c = 104.49216199393888;
            x = K/100 - 2;
            green = a + b*x + c*Math.log(x)
        } else {
            green = 0
        }
        // blue
        if (K >= 6600) {
            blue = 255
        } else if (K >= 2000) {
            a = -254.76935184120902;
            b = 0.8274096064007395;
            c = 115.67994401066147;
            x = K/100 - 10;
            blue = a + b*x + c*Math.log(x)
        } else {
            blue = 0
        }
        red = Math.min(1, red/255);
        green = Math.min(1, green/255);
        blue = Math.min(1, blue/255);
        let ptr:number = Color.initInstance(unsafe.alloc(32,8));
        return Color.Init_mem(ptr, red, green, blue);
    }

    static FloatRGBA(SELF:number):RGBA {
        return {
            r: unsafe._mem_f64[(SELF + 8) >> 3],
            g: unsafe._mem_f64[(SELF + 16) >> 3],
            b: unsafe._mem_f64[(SELF + 24) >> 3],
            a: 1.0
        };
    }

    static RGB(SELF:number):RGB {
        let _d:Uint8ClampedArray = new Uint8ClampedArray([
            unsafe._mem_f64[(SELF + 8) >> 3] * 255,
            unsafe._mem_f64[(SELF + 16) >> 3] * 255,
            unsafe._mem_f64[(SELF + 24) >> 3] * 255
        ]);
        return rgb(_d[0], _d[1], _d[2]);
    }

    static RGBA(SELF:number):RGBA {
        let _d:Uint8ClampedArray = new Uint8ClampedArray([
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
    }

    static RGBA64(SELF:number):RGBA {
        return {
            r: Math.round(Math.max(0, Math.min(65535, unsafe._mem_f64[(SELF + 8) >> 3] * 65535))),
            g: Math.round(Math.max(0, Math.min(65535, unsafe._mem_f64[(SELF + 16) >> 3] * 65535))),
            b: Math.round(Math.max(0, Math.min(65535, unsafe._mem_f64[(SELF + 24) >> 3] * 65535))),
            a: 65535
        };
    }
    
    static Add(a:RGBA, b:RGBA):RGB { return rgb(a.r + b.r, a.g + b.g, a.b + b.b); }
    static Add2(a:RGBA, b:RGBA):RGB { return new Color3(a.r + b.r, a.g + b.g, a.b + b.b); }

    /**
     *
     * @param a Color 1
     * @param b Color 2
     * @param c result Color
     * @returns {number}
     * @constructor
     */
    static Add_mem(a:number, b:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] + unsafe._mem_f64[(b + 8) >> 3];
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] + unsafe._mem_f64[(b + 16) >> 3];
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] + unsafe._mem_f64[(b + 24) >> 3];
            return c;
        }else{
            let ptr:number = Color.initInstance(unsafe.alloc(32,8));
            return Color.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] + unsafe._mem_f64[(b + 8) >> 3],
                unsafe._mem_f64[(a + 16) >> 3] + unsafe._mem_f64[(b + 16) >> 3],
                unsafe._mem_f64[(a + 24) >> 3] + unsafe._mem_f64[(b + 24) >> 3]
            );
        }
    }
    static Add_21(a:Color3, b:number, c?:Color3):Color3 {
        c = c?c:new Color3();
        c.r = a.r + unsafe._mem_f64[(b + 8) >> 3];
        c.g = a.g + unsafe._mem_f64[(b + 16) >> 3];
        c.b = a.b + unsafe._mem_f64[(b + 24) >> 3];
        return c;
    }

    static Sub(a:RGBA, b:RGBA):RGB { return rgb(a.r - b.r, a.g - b.g, a.b - b.b); }
    static Sub_mem(a:number, b:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3];
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3];
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3];
            return c;
        }else{
            let ptr:number = Color.initInstance(unsafe.alloc(32,8));
            return Color.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3],
                unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3],
                unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3]
            );
        }
    }
    static Sub_mem2(a:number, b:number, c?:Color3):Color3 {
        c = c?c:new Color3();
        c.r = unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3];
        c.g = unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3];
        c.b = unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3];
        return c;
    }
    static Sub_21(a:Color3, b:number, c?:Color3):Color3 {
        c = c?c:new Color3();
        c.r = a.r - unsafe._mem_f64[(b + 8) >> 3];
        c.g = a.g - unsafe._mem_f64[(b + 16) >> 3];
        c.b = a.b - unsafe._mem_f64[(b + 24) >> 3];
        return c;
    }
    
    static Mul(a:RGBA, b:Color3):RGB { return rgb(a.r * b.r, a.g * b.g, a.b * b.b); }
    static Mul2(a:number, b:Color3):Color3 {
        return new Color3(
            unsafe._mem_f64[(a + 8) >> 3] * b.r,
            unsafe._mem_f64[(a + 16) >> 3] * b.g,
            unsafe._mem_f64[(a + 24) >> 3] * b.b
        );
    }
    static Mul_mem(a:number, b:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3];
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3];
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3];
            return c;
        }else{
            let ptr:number = Color.initInstance(unsafe.alloc(32,8));
            return Color.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3],
                unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3],
                unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3]
            );
        }
    }

    static MulScalar(a:RGBA, f:number):RGB { return rgb(a.r * f, a.g * f, a.b * f); }
    static MulScalar2(a:number, f:number):Color3 {
        return new Color3(
            unsafe._mem_f64[(a + 8) >> 3] * f,
            unsafe._mem_f64[(a + 16) >> 3] * f,
            unsafe._mem_f64[(a + 24) >> 3] * f
        );
    }
    static MulScalar_mem(a:number, f:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] * f;
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] * f;
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] * f;
            return c;
        }else{
            let ptr:number = Color.initInstance(unsafe.alloc(32,8));
            return Color.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] * f,
                unsafe._mem_f64[(a + 16) >> 3] * f,
                unsafe._mem_f64[(a + 24) >> 3] * f
            );
        }
    }

    static DivScalar(a:RGBA, f:number):RGB { return rgb(a.r / f, a.g / f, a.b / f); }
    static DivScalar_mem(a:number, f:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] / f;
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] / f;
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] / f;
            return c;
        }else{
            let ptr:number = Color.initInstance(unsafe.alloc(32,8));
            return Color.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] / f,
                unsafe._mem_f64[(a + 16) >> 3] / f,
                unsafe._mem_f64[(a + 24) >> 3] / f
            );
        }
    }

    static Min(a:RGBA, b:RGBA):RGB { return rgb( Math.min(a.r , b.r), Math.min(a.g , b.g), Math.min(a.b , b.b) ); }
    static Min_mem(a:number, b:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = Math.min(unsafe._mem_f64[(a + 8) >> 3] , unsafe._mem_f64[(b + 8) >> 3]);
            unsafe._mem_f64[(c + 16) >> 3] = Math.min(unsafe._mem_f64[(a + 16) >> 3] , unsafe._mem_f64[(b + 16) >> 3]);
            unsafe._mem_f64[(c + 24) >> 3] = Math.min(unsafe._mem_f64[(a + 24) >> 3] , unsafe._mem_f64[(b + 24) >> 3]);
            return c;
        }else{
            let ptr:number = Color.initInstance(unsafe.alloc(32,8));
            return Color.Init_mem(
                ptr,
                Math.min(unsafe._mem_f64[(a + 8) >> 3] , unsafe._mem_f64[(b + 8) >> 3]),
                Math.min(unsafe._mem_f64[(a + 16) >> 3] , unsafe._mem_f64[(b + 16) >> 3]),
                Math.min(unsafe._mem_f64[(a + 24) >> 3] , unsafe._mem_f64[(b + 24) >> 3])
            );
        }
    }

    static Max(a:RGBA, b:RGBA):RGB {return rgb( Math.max(a.r , b.r), Math.max(a.g , b.g), Math.max(a.b , b.b) );}
    static Max_mem(a:number, b:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = Math.max(unsafe._mem_f64[(a + 8) >> 3] , unsafe._mem_f64[(b + 8) >> 3]);
            unsafe._mem_f64[(c + 16) >> 3] = Math.max(unsafe._mem_f64[(a + 16) >> 3] , unsafe._mem_f64[(b + 16) >> 3]);
            unsafe._mem_f64[(c + 24) >> 3] = Math.max(unsafe._mem_f64[(a + 24) >> 3] , unsafe._mem_f64[(b + 24) >> 3]);
            return c;
        }else{
            let ptr:number = Color.initInstance(unsafe.alloc(32,8));
            return Color.Init_mem(
                ptr,
                Math.max(unsafe._mem_f64[(a + 8) >> 3] , unsafe._mem_f64[(b + 8) >> 3]),
                Math.max(unsafe._mem_f64[(a + 16) >> 3] , unsafe._mem_f64[(b + 16) >> 3]),
                Math.max(unsafe._mem_f64[(a + 24) >> 3] , unsafe._mem_f64[(b + 24) >> 3])
            );
        }
    }

    static MinComponent(a:RGBA):number {return Math.min(Math.min(a.r, a.g), a.b)}
    static MinComponent_mem(a:number) {
        return Math.min( Math.min(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3]), unsafe._mem_f64[(a + 24) >> 3] );
    }

    static MaxComponent(a:RGBA):number { return Math.max(Math.max(a.r, a.g), a.b) }
    static MaxComponent_mem(a:number):number {
        return Math.max( Math.max(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3]), unsafe._mem_f64[(a + 24) >> 3] );
    }

    static Pow(a:RGBA, f:number):RGB {return rgb( Math.pow(a.r, f), Math.pow(a.g, f), Math.pow(a.b, f) );}
    static Pow_mem(a:number, f:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = Math.pow(unsafe._mem_f64[(a + 8) >> 3] , f);
            unsafe._mem_f64[(c + 16) >> 3] = Math.pow(unsafe._mem_f64[(a + 16) >> 3] , f);
            unsafe._mem_f64[(c + 24) >> 3] = Math.pow(unsafe._mem_f64[(a + 24) >> 3] , f);
            return c;
        }else{
            let ptr:number = Color.initInstance(unsafe.alloc(32,8));
            return Color.Init_mem(
                ptr,
                Math.pow(unsafe._mem_f64[(a + 8) >> 3] , f),
                Math.pow(unsafe._mem_f64[(a + 16) >> 3] , f),
                Math.pow(unsafe._mem_f64[(a + 24) >> 3] , f)
            );
        }
    }

    static Mix(a:RGBA, b:RGBA, pct:number):RGB {
        let _a = Color.MulScalar(a, 1 - pct);
        let _b = Color.MulScalar(b, pct);
        return rgb(_a.r + _b.r, _a.g + _b.g, _a.b + _b.b);
    }
    static Mix_mem(a:number, b:number, pct:number, c?:number):number {

        let _a:number = Color.MulScalar_mem(a, 1 - pct);
        let _b:number = Color.MulScalar_mem(b, pct);

        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[((_a) + 8) >> 3] + unsafe._mem_f64[((_b) + 8) >> 3];
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[((_a) + 16) >> 3] + unsafe._mem_f64[((_b) + 16) >> 3];
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[((_a) + 24) >> 3] + unsafe._mem_f64[((_b) + 24) >> 3];
            return c;
        }else{
            let ptr:number = Color.initInstance(unsafe.alloc(32,8));
            return Color.Init_mem(
                ptr,
                unsafe._mem_f64[((_a) + 8) >> 3] + unsafe._mem_f64[((_b) + 8) >> 3],
                unsafe._mem_f64[((_a) + 16) >> 3] + unsafe._mem_f64[((_b) + 16) >> 3],
                unsafe._mem_f64[((_a) + 24) >> 3] + unsafe._mem_f64[((_b) + 24) >> 3]
            );
        }
    }

    static IsEqual(a:number, b:number):boolean{
        return unsafe._mem_f64[(a + 8) >> 3] === unsafe._mem_f64[(b + 8) >> 3] && unsafe._mem_f64[(a + 16) >> 3] === unsafe._mem_f64[(b + 16) >> 3] && unsafe._mem_f64[(a + 24) >> 3] === unsafe._mem_f64[(b + 24) >> 3];
    }

    static IsBlack(a:number):boolean{
        return Color.IsEqual(a, Color.BLACK);
    }

    static IsWhite(a:number):boolean{
        return Color.IsEqual(a, Color.WHITE);
    }
    static Set(SELF:number, r:number, g:number, b:number) {
         unsafe._mem_f64[(SELF + 8) >> 3] = r; 
         unsafe._mem_f64[(SELF + 16) >> 3] = g; 
         unsafe._mem_f64[(SELF + 24) >> 3] = b; 
        return SELF;
    }

    static Clone(SELF:number, c?:number):number {
        let ptr:number = c?c:Color.initInstance(unsafe.alloc(32,8));
        return Color.Init_mem(ptr, unsafe._mem_f64[(SELF + 8) >> 3], unsafe._mem_f64[(SELF + 16) >> 3], unsafe._mem_f64[(SELF + 24) >> 3]);
    }

    static get BLACK():number{
        return Color.HexColor(0x000000);
    }
    static get WHITE():number {
        return Color.HexColor(0xFFFFFF);
    }

    static BrightColors = [
        Color.HexColor(0xFF00FF),
        Color.HexColor(0x84FF00),
        Color.HexColor(0xFF0084),
        Color.HexColor(0x00FFFF),
        Color.HexColor(0x00FF84),
        Color.HexColor(0xDD40FF),
        Color.HexColor(0xFFFF00)
    ];

    static RGBAColors = [
        Color.HexColor(0xFF0000),
        Color.HexColor(0x00FF00),
        Color.HexColor(0x0000FF),
        Color.HexColor(0xFFFFFF)
    ];

    static Random():number {
        let ptr:number = Color.initInstance(unsafe.alloc(32,8));
        return Color.Init_mem(ptr, Math.random(), Math.random(), Math.random());
    }

    static random():RGB {
        return rgb(Math.random(), Math.random(), Math.random());
    }

    static RandomBrightColor():number {
        var i:number = Math.round(Math.random() * Color.BrightColors.length);
        return Color.BrightColors[i];
    }

    static RandomRGBAColor():number {
        var i:number = Math.round(Math.random() * Color.RGBAColors.length);
        return Color.RGBAColors[i];
    }

    static toColor3(SELF){
        return new Color3(unsafe._mem_f64[(SELF + 8) >> 3], unsafe._mem_f64[(SELF + 16) >> 3], unsafe._mem_f64[(SELF + 24) >> 3]);
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=194603; return SELF; }
}
unsafe._idToType[194603] = Color;



export type XYZ = {
    x:number,
    y:number,
    z:number
};

export class Vector extends MemoryObject{
   static NAME:string = "Vector";
   static SIZE:number = 32;
   static ALIGN:number = 8;
   static CLSID:number = 1266219;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF:number, vector = {x:0,y:0,z:0}):number {
		 unsafe._mem_f64[(SELF + 8) >> 3] = (vector.x); 
		 unsafe._mem_f64[(SELF + 16) >> 3] = (vector.y); 
		 unsafe._mem_f64[(SELF + 24) >> 3] = (vector.z); 
		return SELF;
	}

    static Init_mem(SELF:number, x:number = 0,y:number = 0,z:number = 0):number {
		 unsafe._mem_f64[(SELF + 8) >> 3] = x; 
		 unsafe._mem_f64[(SELF + 16) >> 3] = y; 
		 unsafe._mem_f64[(SELF + 24) >> 3] = z; 
		return SELF;
	}

    static NewVector(vector?,y:number=0,z:number=0):number {
        let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
        if(typeof vector === "object"){
            return Vector.init(ptr, vector);
        }else{
            return Vector.Init_mem(ptr, vector, y, z);
        }
    }

    static ToJSON(SELF){
        return {
            x:unsafe._mem_f64[(SELF + 8) >> 3],
            y:unsafe._mem_f64[(SELF + 16) >> 3],
            z:unsafe._mem_f64[(SELF + 24) >> 3]
        };
    }

    static XYZ(a:number):XYZ {
        return xyz(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3]);
    }

    static RandomUnitVector():number {
        let ptr:number = Vector.initInstance(unsafe.alloc(32,8));

        let x = Math.random() * 2 - 1;
        let y = Math.random() * 2 - 1;
        let z = Math.random() * 2 - 1;

        while(x*x+y*y+z*z > 1){
            x = Math.random() * 2 - 1;
            y = Math.random() * 2 - 1;
            z = Math.random() * 2 - 1;
        }
        return Vector.Normalize_mem(Vector.Init_mem(ptr, x, y, z));
    }

    static Length(a:XYZ):number {
        return Math.sqrt((a.x * a.x) + (a.y * a.y) + (a.z * a.z));
    }

    static Length_mem(a:number):number {
        return Math.sqrt(unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(a + 8) >> 3] + unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(a + 16) >> 3] + unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(a + 24) >> 3]);
    }

    static LengthN(a:XYZ, n:number):number {
        if (n == 2) {
            return Vector.Length(a);
        }
        a = Vector.Abs(a);
        return Math.pow(
            Math.pow(a.x, n) + Math.pow(a.y, n) + Math.pow(a.z, n),
            1/n
        );
    }

    static LengthN_mem(a:number, n:number):number {
        if (n == 2) {
            return Vector.Length_mem(a);
        }
        a = Vector.Abs_mem(a);
        return Math.pow(
            Math.pow(unsafe._mem_f64[(a + 8) >> 3], n) + Math.pow(unsafe._mem_f64[(a + 16) >> 3], n) + Math.pow(unsafe._mem_f64[(a + 24) >> 3], n),
            1/n
        );
    }

    static Dot(a:XYZ, b:XYZ):number {
        return (a.x * b.x) + (a.y * b.y) + (a.z * b.z);
    }

    static Dot_mem(a:number, b:number):number {
        return (unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3]) + (unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3]) + (unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3]);
    }

    static Cross(a:XYZ, b:XYZ):XYZ {
        let x:number = (a.y * b.z) - (a.z * b.y);
        let y:number = (a.z * b.x) - (a.x * b.z);
        let z:number = (a.x * b.y) - (a.y * b.x);
        return xyz(x, y, z);
    }

    static Cross_mem(a:number, b:number, c?:number):number {
        let x:number = (unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 24) >> 3]) - (unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 16) >> 3]);
        let y:number = (unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 8) >> 3]) - (unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 24) >> 3]);
        let z:number = (unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 16) >> 3]) - (unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 8) >> 3]);

        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = x;
            unsafe._mem_f64[(c + 16) >> 3] = y;
            unsafe._mem_f64[(c + 24) >> 3] = z;
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(ptr, x, y, z);
        }
    }

    static Normalize(a:XYZ):XYZ {
        let d:number = Vector.Length(a);
        return xyz(a.x / d, a.y / d, a.z / d);
    }

    static Normalize_mem(a:number, c?:number):number {
        let d:number = Vector.Length_mem(a);
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] / d;
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] / d;
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] / d;
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(ptr, unsafe._mem_f64[(a + 8) >> 3] / d, unsafe._mem_f64[(a + 16) >> 3] / d, unsafe._mem_f64[(a + 24) >> 3] / d);
        }
    }

    static Negate(a:XYZ):XYZ {
        return xyz(-a.x, -a.y, -a.z);
    }

    static Negate_mem(a:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = -unsafe._mem_f64[(a + 8) >> 3];
            unsafe._mem_f64[(c + 16) >> 3] = -unsafe._mem_f64[(a + 16) >> 3];
            unsafe._mem_f64[(c + 24) >> 3] = -unsafe._mem_f64[(a + 24) >> 3];
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                -unsafe._mem_f64[(a + 8) >> 3],
                -unsafe._mem_f64[(a + 16) >> 3],
                -unsafe._mem_f64[(a + 24) >> 3]
            );
        }
    }

    static Abs(a:XYZ):XYZ {
        return xyz(Math.abs(a.x), Math.abs(a.y), Math.abs(a.z));
    }

    static Abs_mem(a:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = Math.abs(unsafe._mem_f64[(a + 8) >> 3]);
            unsafe._mem_f64[(c + 16) >> 3] = Math.abs(unsafe._mem_f64[(a + 16) >> 3]);
            unsafe._mem_f64[(c + 24) >> 3] = Math.abs(unsafe._mem_f64[(a + 24) >> 3]);
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                Math.abs(unsafe._mem_f64[(a + 8) >> 3]),
                Math.abs(unsafe._mem_f64[(a + 16) >> 3]),
                Math.abs(unsafe._mem_f64[(a + 24) >> 3])
            );
        }
    }
    static Add(a:XYZ, b:XYZ):XYZ { return xyz(a.x + b.x, a.y + b.y, a.z + b.z); }

    static Add_mem(a:number, b:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] + unsafe._mem_f64[(b + 8) >> 3];
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] + unsafe._mem_f64[(b + 16) >> 3];
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] + unsafe._mem_f64[(b + 24) >> 3];
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] + unsafe._mem_f64[(b + 8) >> 3],
                unsafe._mem_f64[(a + 16) >> 3] + unsafe._mem_f64[(b + 16) >> 3],
                unsafe._mem_f64[(a + 24) >> 3] + unsafe._mem_f64[(b + 24) >> 3]
            );
        }
    }

    static Add_12(a:number, b:Vector3):Vector3 {
        return new Vector3(unsafe._mem_f64[(a + 8) >> 3] + b.x, unsafe._mem_f64[(a + 16) >> 3] + b.y, unsafe._mem_f64[(a + 24) >> 3] + b.z);
    }

    static Sub_12(a:number, b:Vector3):Vector3 {
        return new Vector3(unsafe._mem_f64[(a + 8) >> 3] - b.x, unsafe._mem_f64[(a + 16) >> 3] - b.y, unsafe._mem_f64[(a + 24) >> 3] - b.z);
    }

    static Sub_21(a:number, b:Vector3):Vector3 {
        return new Vector3(a.x - unsafe._mem_f64[(b + 8) >> 3], a.y - unsafe._mem_f64[(b + 16) >> 3], a.z - unsafe._mem_f64[(b + 24) >> 3]);
    }
    static Sub_mem(a:number, b:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3];
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3];
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3];
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3],
                unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3],
                unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3]
            );
        }
    }
    static Sub_mem_2(a:number, b:number):Vector3 {
        return new Vector3(unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3]);
    }

    static Mul(a:XYZ, b:XYZ):XYZ { return xyz(a.x * b.x, a.y * b.y, a.z * b.z); }
    static Mul_mem(a:number, b:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3];
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3];
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3];
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3],
                unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3],
                unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3]
            );
        }
    }

    static Div_12(a:number, b:Vector3):Vector3 {
        return new Vector3(unsafe._mem_f64[(a + 8) >> 3] / b.x, unsafe._mem_f64[(a + 16) >> 3] / b.y, unsafe._mem_f64[(a + 24) >> 3] / b.z);
    }

    static Div_mem(a:number, b:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] / unsafe._mem_f64[(b + 8) >> 3];
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] / unsafe._mem_f64[(b + 16) >> 3];
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] / unsafe._mem_f64[(b + 24) >> 3];
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] / unsafe._mem_f64[(b + 8) >> 3],
                unsafe._mem_f64[(a + 16) >> 3] / unsafe._mem_f64[(b + 16) >> 3],
                unsafe._mem_f64[(a + 24) >> 3] / unsafe._mem_f64[(b + 24) >> 3]
            );
        }
    }

    static Mod(a:XYZ, b:XYZ):XYZ {
        // as implemented in GLSL
        let x = a.x - b.x * Math.floor(a.x/b.x);
        let y = a.y - b.y * Math.floor(a.y/b.y);
        let z = a.z - b.z * Math.floor(a.z/b.z);
        return xyz(x, y, z);
    }

    static Mod_mem(a:number, b:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3] * Math.floor(unsafe._mem_f64[(a + 8) >> 3]/unsafe._mem_f64[(b + 8) >> 3]);
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3] * Math.floor(unsafe._mem_f64[(a + 16) >> 3]/unsafe._mem_f64[(b + 16) >> 3]);
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3] * Math.floor(unsafe._mem_f64[(a + 24) >> 3]/unsafe._mem_f64[(b + 24) >> 3]);
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] - unsafe._mem_f64[(b + 8) >> 3] * Math.floor(unsafe._mem_f64[(a + 8) >> 3]/unsafe._mem_f64[(b + 8) >> 3]),
                unsafe._mem_f64[(a + 16) >> 3] - unsafe._mem_f64[(b + 16) >> 3] * Math.floor(unsafe._mem_f64[(a + 16) >> 3]/unsafe._mem_f64[(b + 16) >> 3]),
                unsafe._mem_f64[(a + 24) >> 3] - unsafe._mem_f64[(b + 24) >> 3] * Math.floor(unsafe._mem_f64[(a + 24) >> 3]/unsafe._mem_f64[(b + 24) >> 3])
            );
        }
    }

    static AddScalar(a:XYZ, f:number):XYZ { return xyz(a.x + f, a.y + f, a.z + f); }

    static AddScalar_mem(a:number, f:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] + f;
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] + f;
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] + f;
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] + f,
                unsafe._mem_f64[(a + 16) >> 3] + f,
                unsafe._mem_f64[(a + 24) >> 3] + f
            );
        }
    }

    static SubScalar(a:XYZ, f:number):XYZ { return xyz(a.x - f, a.y - f, a.z - f); }

    static SubScalar_mem(a:number, f:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] - f;
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] - f;
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] - f;
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] - f,
                unsafe._mem_f64[(a + 16) >> 3] - f,
                unsafe._mem_f64[(a + 24) >> 3] - f
            );
        }
    }

    static MulScalar(a:XYZ, f:number):XYZ { return xyz(a.x * f, a.y * f, a.z * f); }
    static MulScalar_mem(a:number, f:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] * f;
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] * f;
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] * f;
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] * f,
                unsafe._mem_f64[(a + 16) >> 3] * f,
                unsafe._mem_f64[(a + 24) >> 3] * f
            );
        }
    }

    static DivScalar(a:XYZ, f:number):XYZ { return xyz(a.x / f, a.y / f, a.z / f); }
    static DivScalar_mem(a:number, f:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = unsafe._mem_f64[(a + 8) >> 3] / f;
            unsafe._mem_f64[(c + 16) >> 3] = unsafe._mem_f64[(a + 16) >> 3] / f;
            unsafe._mem_f64[(c + 24) >> 3] = unsafe._mem_f64[(a + 24) >> 3] / f;
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                unsafe._mem_f64[(a + 8) >> 3] / f,
                unsafe._mem_f64[(a + 16) >> 3] / f,
                unsafe._mem_f64[(a + 24) >> 3] / f
            );
        }
    }

    static Min(a:XYZ, b:XYZ):XYZ { return xyz( Math.min(a.x , b.x), Math.min(a.y , b.y), Math.min(a.z , b.z) ); }
    static Min_mem(a:number, b:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = Math.min(unsafe._mem_f64[(a + 8) >> 3] , unsafe._mem_f64[(b + 8) >> 3]);
            unsafe._mem_f64[(c + 16) >> 3] = Math.min(unsafe._mem_f64[(a + 16) >> 3] , unsafe._mem_f64[(b + 16) >> 3]);
            unsafe._mem_f64[(c + 24) >> 3] = Math.min(unsafe._mem_f64[(a + 24) >> 3] , unsafe._mem_f64[(b + 24) >> 3]);
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                Math.min(unsafe._mem_f64[(a + 8) >> 3] , unsafe._mem_f64[(b + 8) >> 3]),
                Math.min(unsafe._mem_f64[(a + 16) >> 3] , unsafe._mem_f64[(b + 16) >> 3]),
                Math.min(unsafe._mem_f64[(a + 24) >> 3] , unsafe._mem_f64[(b + 24) >> 3])
            );
        }
    }

    static Max(a:XYZ, b:XYZ):XYZ {return xyz( Math.max(a.x , b.x), Math.max(a.y , b.y), Math.max(a.z , b.z) );}
    static Max_mem(a:number, b:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = Math.max(unsafe._mem_f64[(a + 8) >> 3] , unsafe._mem_f64[(b + 8) >> 3]);
            unsafe._mem_f64[(c + 16) >> 3] = Math.max(unsafe._mem_f64[(a + 16) >> 3] , unsafe._mem_f64[(b + 16) >> 3]);
            unsafe._mem_f64[(c + 24) >> 3] = Math.max(unsafe._mem_f64[(a + 24) >> 3] , unsafe._mem_f64[(b + 24) >> 3]);
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                Math.max(unsafe._mem_f64[(a + 8) >> 3] , unsafe._mem_f64[(b + 8) >> 3]),
                Math.max(unsafe._mem_f64[(a + 16) >> 3] , unsafe._mem_f64[(b + 16) >> 3]),
                Math.max(unsafe._mem_f64[(a + 24) >> 3] , unsafe._mem_f64[(b + 24) >> 3])
            );
        }
    }

    static MinAxis(a:XYZ):XYZ {
        let x:number = Math.abs(a.x);
        let y:number = Math.abs(a.y);
        let z:number = Math.abs(a.z);

        if(x <= y && x <= z) {
            return xyz(1, 0, 0);
        }else if(y <= x && y <= z){
            return xyz(0, 1, 0);
        }
        return xyz(0, 0, 1);
    }

    static MinAxis_mem(a:number, c?:number):number {
        let x:number = Math.abs(unsafe._mem_f64[(a + 8) >> 3]);
        let y:number = Math.abs(unsafe._mem_f64[(a + 16) >> 3]);
        let z:number = Math.abs(unsafe._mem_f64[(a + 24) >> 3]);

        if(x <= y && x <= z) {
            x = 1;
            y = 0;
            z = 0;
        }else if(y <= x && y <= z){
            x = 0;
            y = 1;
            z = 0;
        }else{
            x = 0;
            y = 0;
            z = 1;
        }

        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = x;
            unsafe._mem_f64[(c + 16) >> 3] = y;
            unsafe._mem_f64[(c + 24) >> 3] = z;
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(ptr, x,y,z);
        }
    }

    static MinComponent(a:XYZ):number {return Math.min(Math.min(a.x, a.y), a.z)}
    static MinComponent_mem(a:number) {
        return Math.min( Math.min(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3]), unsafe._mem_f64[(a + 24) >> 3] );
    }

    static MaxComponent(a:XYZ):number { return Math.max(Math.max(a.x, a.y), a.z) }
    static MaxComponent_mem(a:number):number {
        return Math.max( Math.max(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3]), unsafe._mem_f64[(a + 24) >> 3] );
    }

    static Reflect(a:XYZ, b:XYZ):XYZ {
        return Vector.Sub(b, Vector.MulScalar(a, 2 * Vector.Dot(a,b)));
    }

    static Reflect_mem(a:number, b:number, c?:number):number {
        c = c? c: Vector.initInstance(unsafe.alloc(32,8));
        return Vector.Sub_mem(b, Vector.MulScalar_mem(a, 2 * Vector.Dot_mem(a,b), c), c);
    }

    static Refract(a:XYZ, b:XYZ, n1:number, n2:number):XYZ {
        let nr:number = n1 / n2;
        let cosI:number = -Vector.Dot(a, b);
        let sinT2:number = nr * nr * (1 - cosI * cosI);
        if (sinT2 > 1) {
            return xyz(0,0,0);
        }
        let cosT:number = Math.sqrt(1 - sinT2);
        return Vector.Add(Vector.MulScalar(b, nr), Vector.MulScalar(a, nr * cosI - cosT));
    }

    static Refract_mem(a:number, b:number, n1:number, n2:number, c?:number):number {
        let nr:number = n1 / n2;
        let cosI:number = -Vector.Dot_mem(a, b);
        let sinT2:number = nr * nr * (1 - cosI * cosI);
        if (sinT2 > 1) {
            return Vector.Init_mem(Vector.initInstance(unsafe.alloc(32,8)));
        }
        let cosT:number = Math.sqrt(1 - sinT2);
        c = c? c: Vector.initInstance(unsafe.alloc(32,8));
        return Vector.Add_mem(Vector.MulScalar_mem(b, nr), Vector.MulScalar_mem(a, nr * cosI - cosT, c), c);
    }

    static Reflectance(a:XYZ, b:XYZ, n1:number, n2:number):number {
        let nr:number = n1 / n2;
        let cosI:number = -Vector.Dot(a, b);
        let sinT2:number = nr * nr * (1 - cosI * cosI);
        if (sinT2 > 1) {
            return 1;
        }
        let cosT:number = Math.sqrt(1 - sinT2);
        let rOrth:number = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
        let rPar:number = (n2 * cosI - n1 * cosT) / (n2 * cosI + n1 * cosT);
        return (rOrth * rOrth + rPar * rPar) / 2;
    }

    static Reflectance_mem(a:number, b:number, n1:number, n2:number):number {
        let nr:number = n1 / n2;
        let cosI:number = -Vector.Dot_mem(a, b);
        let sinT2:number = nr * nr * (1 - cosI * cosI);
        if (sinT2 > 1) {
            return 1;
        }
        let cosT:number = Math.sqrt(1 - sinT2);
        let rOrth:number = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
        let rPar:number = (n2 * cosI - n1 * cosT) / (n2 * cosI + n1 * cosT);
        return (rOrth * rOrth + rPar * rPar) / 2;
    }


    //--------------------------------
    // x x x x x x x x x x x x x x x x
    //--------------------------------


    static Pow(a:XYZ, f:number):XYZ {return xyz( Math.pow(a.x, f), Math.pow(a.y, f), Math.pow(a.z, f) );}
    static Pow_mem(a:number, f:number, c?:number):number {
        if(c){
            unsafe._mem_f64[(c + 8) >> 3] = Math.pow(unsafe._mem_f64[(a + 8) >> 3] , f);
            unsafe._mem_f64[(c + 16) >> 3] = Math.pow(unsafe._mem_f64[(a + 16) >> 3] , f);
            unsafe._mem_f64[(c + 24) >> 3] = Math.pow(unsafe._mem_f64[(a + 24) >> 3] , f);
            return c;
        }else{
            let ptr:number = Vector.initInstance(unsafe.alloc(32,8));
            return Vector.Init_mem(
                ptr,
                Math.pow(unsafe._mem_f64[(a + 8) >> 3] , f),
                Math.pow(unsafe._mem_f64[(a + 16) >> 3] , f),
                Math.pow(unsafe._mem_f64[(a + 24) >> 3] , f)
            );
        }
    }

    static IsEqual(a:number, b:number):boolean{
        return unsafe._mem_f64[(a + 8) >> 3] === unsafe._mem_f64[(b + 8) >> 3] && unsafe._mem_f64[(a + 16) >> 3] === unsafe._mem_f64[(b + 16) >> 3] && unsafe._mem_f64[(a + 24) >> 3] === unsafe._mem_f64[(b + 24) >> 3];
    }

    static ZERO:number = Vector.NewVector({x:0,y:0,y:0});
    static ONE:number = Vector.NewVector({x:1,y:1,y:1});
    static NegativeONE:number = Vector.NewVector({x:-1,y:-1,y:-1});

    static IsZero(a:number):boolean{
        return unsafe._mem_f64[(a + 8) >> 3] === 0 && unsafe._mem_f64[(a + 16) >> 3] === 0 && unsafe._mem_f64[(a + 24) >> 3] === 0;
    }

    static Set(SELF:number, x:number, y:number, z:number) {
         unsafe._mem_f64[(SELF + 8) >> 3] = x; 
         unsafe._mem_f64[(SELF + 16) >> 3] = y; 
         unsafe._mem_f64[(SELF + 24) >> 3] = z; 
        return SELF;
    }

    static SetFromJSON(SELF:number, d) {
         unsafe._mem_f64[(SELF + 8) >> 3] = (d.x); 
         unsafe._mem_f64[(SELF + 16) >> 3] = (d.y); 
         unsafe._mem_f64[(SELF + 24) >> 3] = (d.z); 
        return SELF;
    }

    static SetFromArray(SELF:number, d:number[]) {
         unsafe._mem_f64[(SELF + 8) >> 3] = (d[0]); 
         unsafe._mem_f64[(SELF + 16) >> 3] = (d[1]); 
         unsafe._mem_f64[(SELF + 24) >> 3] = (d[2]); 
        return SELF;
    }

    static Copy(SELF:number, a:number):number {
        return Vector.Set(SELF, unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3]);
    }

    static Clone(SELF:number, c?:number):number {
        let ptr:number = c?c:Vector.initInstance(unsafe.alloc(32,8));
        return Vector.Init_mem(ptr, unsafe._mem_f64[(SELF + 8) >> 3], unsafe._mem_f64[(SELF + 16) >> 3], unsafe._mem_f64[(SELF + 24) >> 3]);
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=1266219; return SELF; }
}
unsafe._idToType[1266219] = Vector;


export class Utils {

    static Radians(degrees:number):number {
        return degrees * Math.PI / 180
    }

    static Degrees(radians:number):number {
        return radians * 180 / Math.PI
    }

    static Cone(direction:Vector3, theta:number, u:number, v:number):Vector3{
        if (theta < EPS) {
            return direction;
        }
        theta = theta * (1 - (2 * Math.acos(u) / Math.PI));
        let m1 = Math.sin(theta);
        let m2 = Math.cos(theta);
        let a = v * 2 * Math.PI;
        let q = Vector3.RandomUnitVector();
        let s = direction.cross(q);
        let t = direction.cross(s);
        let d = new Vector3();
        d = d.add(s.mulScalar(m1 * Math.cos(a)));
        d = d.add(t.mulScalar(m1 * Math.sin(a)));
        d = d.add(direction.mulScalar(m2));
        d = d.normalize();
        return d;
    }
    
    static LoadImage(path:string):number /*Image*/ {
        //TODO: load image using img tag and canvas
        return null;
    }

    static SavePNG(path:string, im:number /*Image*/):boolean {
        //TODO: save using file
        return null;
    }

    static Median(items:number[]):number {
        let n = items.length;
        if (n == 0) {
            return 0;
        } else if (n % 2 == 1) {
            return items[n / 2];
        } else {
            let a = items[n / 2 - 1];
            let b = items[n / 2];
            return (a + b) / 2;
        }
    }

    static DurationString(t:number/*milliseconds*/):string {
        let d:Date = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(t);
        return d.toLocaleTimeString();
    }

    static NumberString(x:number):string {
        let suffixes = ["", "k", "M", "g"];

        suffixes.forEach((suffix) => {
            if (x < 1000) {
                return x + suffix;
            }
            x /= 1000
        });

        return x + "T";
    }

    static ParseFloats(items:string[]):number[] {
        let result:number[] = [];

        items.forEach((item) => {
            result.push(parseFloat(item));
        });
        return result;
    }

    static ParseInts(items:string[]):number[] {
        let result:number[] = [];

        items.forEach((item) => {
            result.push(parseInt(item));
        });
        return result;
    }

    static Fract(x:number):number {
        return x - Math.floor(x);
    }

    static FractAddOne(x:number):number {
        let f1 = x - Math.floor(x);
        return f1 - Math.floor(f1 + 1);
    }

    static  Modf(f):{int:number,frac:number} {
        var int = Math.floor(f);
        var frac = f - int;
        return {int: int, frac: frac};
    }

    static Clamp(x:number, lo:number, hi:number):number {
        if (x < lo) {
            return lo;
        }
        if (x > hi) {
            return hi;
        }
        return x;
    }

    static ClampInt(x:number, lo:number, hi:number):number {
        if (x < lo) {
            return lo;
        }
        if (x > hi) {
            return hi;
        }
        return x;
    }

    static append(slice:Array<any>, ...elements):Array<any>{
        if (slice == undefined) {
            return elements;
        } else {
            slice.push.apply(slice, elements);
        }
        return slice;
    }

    static sortAscending(slice) {
        slice.sort(function (a, b) {
            return a - b;
        });
    }

    static sortDescending(slice) {
        slice.sort(function (a, b) {
            return b - a;
        });
    }
}

export class Box extends MemoryObject{
   static NAME:string = "Box";
   static SIZE:number = 12;
   static ALIGN:number = 4;
   static CLSID:number = 1841;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, min:XYZ = xyz(0,0,0), max:XYZ= xyz(0,0,0)){
         unsafe._mem_i32[(SELF + 4) >> 2] = (Vector.NewVector(min)); 
         unsafe._mem_i32[(SELF + 8) >> 2] = (Vector.NewVector(max)); 
        return SELF;
	}

    static Init_mem(SELF, min:number, max:number){
         unsafe._mem_i32[(SELF + 4) >> 2] = min; 
         unsafe._mem_i32[(SELF + 8) >> 2] = max; 
        return SELF;
	}

    static NewBox(min?:number, max?:number){
        let SELF = Box.initInstance(unsafe.alloc(12,4));
         unsafe._mem_i32[(SELF + 4) >> 2] = (min?min:Vector.NewVector()); 
         unsafe._mem_i32[(SELF + 8) >> 2] = (max?max:Vector.NewVector()); 
        return SELF;
	}

    static ToJSON(SELF){
        return {
            min:Vector.ToJSON(unsafe._mem_i32[(SELF + 4) >> 2]),
            max:Vector.ToJSON(unsafe._mem_i32[(SELF + 8) >> 2])
        };
	}

	static BoxForShapes(shapes:number, numShapes:number):number{
		if(numShapes == 0) {
			return Box.NewBox();
		}
		// let box = Shape.BoundingBox(unsafe._mem_i32[(  shapes + 4 + (4 * 0)  ) >> 2]);
		let box = Box.NewBox();

		for(let i:number = 0; i < numShapes; i++){
			let shape:number = unsafe._mem_i32[(  shapes + 4 + (4 * i)  ) >> 2];
			box = Box.Extend(box, Shape.BoundingBox(shape));
		}
		return box;
	}

	// static BoxForTriangles(shapes:number, numShapes:number):number {
     //    if(numShapes == 0) {
     //        return Box.NewBox();
     //    }
     //    let box = Triangle.BoundingBox(unsafe._mem_i32[(  shapes + 4 + (4 * 0)  ) >> 2]);
    //
     //    for(let i:number = 0; i < numShapes; i++){
     //        let shape:number = unsafe._mem_i32[(  shapes + 4 + (4 * i)  ) >> 2];
     //        box = Box.Extend(box, Triangle.BoundingBox(shape));
     //    }
     //    return box
	// }

	static Anchor_mem(SELF, anchor:number, c?:number):number {
        let size = Box.Size_mem(SELF);
        let tmp = Vector.Mul_mem(size, anchor);
        free(size);
        if(c){
            free(tmp);
        }else{
            c = tmp;
        }
		return Vector.Add_mem(unsafe._mem_i32[(SELF + 4) >> 2], c, c);
    }
	static Anchor(SELF, anchor:Vector3):number {
        let size:Vector3 = Box.Size(SELF);
		return Vector.Add_12(unsafe._mem_i32[(SELF + 4) >> 2], size.mul(anchor));
    }

	static Center_mem(SELF):number {
        let anchor = Vector.NewVector(0.5, 0.5, 0.5);
		return Box.Anchor(SELF, anchor, anchor);
	}
	static Center(SELF):Vector3 {
        let anchor = new Vector3(0.5, 0.5, 0.5);
		return Box.Anchor(SELF, anchor);
	}

	static OuterRadius(SELF):number {
        let center:Vector3 = Box.Center(SELF);
        return Vector.Sub_12(unsafe._mem_i32[(SELF + 4) >> 2], center).length();
	}

	static InnerRadius(SELF):number {
        let center = Box.Center(SELF);
        return Vector.Sub_21(center, unsafe._mem_i32[(SELF + 4) >> 2]).maxComponent();
    }

	static Size_mem(SELF):number {
		return Vector.Sub_mem(unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 4) >> 2]);
	}
	static Size(SELF):Vector3 {
		return Vector.Sub_mem_2(unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 4) >> 2]);
	}

	static Extend(SELF, b:number):number{
        //let ptr:number = Box.initInstance(unsafe.alloc(12,4));
		let min = unsafe._mem_i32[(SELF + 4) >> 2];
		let max = unsafe._mem_i32[(SELF + 8) >> 2];
		let bmin = unsafe._mem_i32[(b + 4) >> 2];
		let bmax = unsafe._mem_i32[(b + 8) >> 2];
		return Box.Init_mem(SELF, Vector.Min_mem(min, bmin, min), Vector.Max_mem(max, bmax, max));
	}

	static Contains(SELF , b:number):boolean{

        let a_min = unsafe._mem_i32[(SELF + 4) >> 2];
        let a_max = unsafe._mem_i32[(SELF + 8) >> 2];

		return unsafe._mem_f64[((a_min) + 8) >> 3] <= unsafe._mem_f64[(b + 8) >> 3] && unsafe._mem_f64[((a_max) + 8) >> 3] >= unsafe._mem_f64[(b + 8) >> 3] &&
			unsafe._mem_f64[((a_min) + 16) >> 3] <= unsafe._mem_f64[(b + 16) >> 3] && unsafe._mem_f64[((a_max) + 16) >> 3] >= unsafe._mem_f64[(b + 16) >> 3] &&
			unsafe._mem_f64[((a_min) + 24) >> 3] <= unsafe._mem_f64[(b + 24) >> 3] && unsafe._mem_f64[((a_max) + 24) >> 3] >= unsafe._mem_f64[(b + 24) >> 3];
	}

	static Intersects(a:number, b:number):boolean {
        let a_min = unsafe._mem_i32[(a + 4) >> 2];
        let a_max = unsafe._mem_i32[(a + 8) >> 2];
        let b_min = unsafe._mem_i32[(b + 4) >> 2];
        let b_max = unsafe._mem_i32[(b + 8) >> 2];

		return !(unsafe._mem_f64[((a_min) + 8) >> 3] > unsafe._mem_f64[((b_max) + 8) >> 3] || unsafe._mem_f64[((a_max) + 8) >> 3] < unsafe._mem_f64[((b_min) + 8) >> 3] || unsafe._mem_f64[((a_min) + 16) >> 3] > unsafe._mem_f64[((b_max) + 16) >> 3] ||
		unsafe._mem_f64[((a_max) + 16) >> 3] < unsafe._mem_f64[((b_min) + 16) >> 3] || unsafe._mem_f64[((a_min) + 24) >> 3] > unsafe._mem_f64[((b_max) + 24) >> 3] || unsafe._mem_f64[((a_max) + 24) >> 3] < unsafe._mem_f64[((b_min) + 24) >> 3]);
	}

	static Intersect(SELF, r:Ray):{tmax:number, tmin:number} {

        let min = unsafe._mem_i32[(SELF + 4) >> 2];
        let max = unsafe._mem_i32[(SELF + 8) >> 2];

        // x1 := (b.Min.x - r.Origin.x) / r.Direction.x
        // y1 := (b.Min.y - r.Origin.y) / r.Direction.y
        // z1 := (b.Min.z - r.Origin.z) / r.Direction.z
        // x2 := (b.Max.x - r.Origin.x) / r.Direction.x
        // y2 := (b.Max.y - r.Origin.y) / r.Direction.y
        // z2 := (b.Max.z - r.Origin.z) / r.Direction.z

		let x1 = (unsafe._mem_f64[(min + 8) >> 3] - r.origin.x) / r.direction.x;
        let y1 = (unsafe._mem_f64[(min + 16) >> 3] - r.origin.y) / r.direction.y;
        let z1 = (unsafe._mem_f64[(min + 24) >> 3] - r.origin.z) / r.direction.z;
        let x2 = (unsafe._mem_f64[(max + 8) >> 3] - r.origin.x) / r.direction.x;
        let y2 = (unsafe._mem_f64[(max + 16) >> 3] - r.origin.y) / r.direction.y;
        let z2 = (unsafe._mem_f64[(max + 24) >> 3] - r.origin.z) / r.direction.z;
        let tmp;

		if (x1 > x2) {
            tmp = x1;
			x1 = x2;
            x2 = tmp;
		}
		if (y1 > y2) {
			tmp = y1;
			y1 = y2;
            y2 = tmp
		}
		if (z1 > z2) {
            tmp = z1;
            z1 = z2;
            z2 = tmp
		}
		return {
            tmin: Math.max(Math.max(x1, y1), z1),
		    tmax: Math.min(Math.min(x2, y2), z2)
        };
	}

	static Partition(SELF, axis:Axis, point:number): {left:boolean, right:boolean} {
        let min = unsafe._mem_i32[(SELF + 4) >> 2];
        let max = unsafe._mem_i32[(SELF + 8) >> 2];
        let left;
        let right;
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
				right = unsafe._mem_f64[(max + 24) >> 3] >= point;// EPIC Bug :D it was min and got weird triangle intersection
                break;
		}
		return {
            left :left,
            right:right
        };
	}
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=1841; return SELF; }
}
unsafe._idToType[1841] = Box;



export class Matrix extends MemoryObject{
   static NAME:string = "Matrix";
   static SIZE:number = 136;
   static ALIGN:number = 8;
   static CLSID:number = 2093537;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF:number=0, x00:number=0, x01:number=0, x02:number=0, x03:number=0, x10:number=0, x11:number=0, x12:number=0, x13:number=0, x20:number=0, x21:number=0, x22:number=0, x23:number=0, x30:number=0, x31:number=0, x32:number=0, x33:number=0) {
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
    }

    static NewMatrix(x00?:number, x01?:number, x02?:number, x03?:number, x10?:number, x11?:number, x12?:number, x13?:number, x20?:number, x21?:number, x22?:number, x23?:number, x30?:number, x31?:number, x32?:number, x33?:number):number {
        let ptr:number = Matrix.initInstance(unsafe.alloc(136,8));
        return Matrix.init(ptr,
            x00, x01, x02, x03,
            x10, x11, x12, x13,
            x20, x21, x22, x23,
            x30, x31, x32, x33
        )
    }

    static fromTHREEJS(e:number[]):number {

        return Matrix.NewMatrix(
            e[0], e[4], e[8], e[12],
            e[1], e[5], e[9], e[13],
            e[2], e[6], e[10], e[14],
            e[3], e[7], e[11], e[15]
        );
    }

    static DATA(SELF:number) {
        return [
            unsafe._mem_f64[(SELF + 8) >> 3], unsafe._mem_f64[(SELF + 16) >> 3], unsafe._mem_f64[(SELF + 24) >> 3], unsafe._mem_f64[(SELF + 32) >> 3],
            unsafe._mem_f64[(SELF + 40) >> 3], unsafe._mem_f64[(SELF + 48) >> 3], unsafe._mem_f64[(SELF + 56) >> 3], unsafe._mem_f64[(SELF + 64) >> 3],
            unsafe._mem_f64[(SELF + 72) >> 3], unsafe._mem_f64[(SELF + 80) >> 3], unsafe._mem_f64[(SELF + 88) >> 3], unsafe._mem_f64[(SELF + 96) >> 3],
            unsafe._mem_f64[(SELF + 104) >> 3], unsafe._mem_f64[(SELF + 112) >> 3], unsafe._mem_f64[(SELF + 120) >> 3], unsafe._mem_f64[(SELF + 128) >> 3]
        ]
    }

    static Identity(c?:number):number {
        let ptr:number = c?c:Matrix.initInstance(unsafe.alloc(136,8));
        return Matrix.init(ptr,
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }

    static IsEqual(a:number, b:number):boolean {
        return unsafe._mem_f64[(a + 8) >> 3] == unsafe._mem_f64[(b + 8) >> 3] && unsafe._mem_f64[(a + 16) >> 3] == unsafe._mem_f64[(b + 16) >> 3] && unsafe._mem_f64[(a + 24) >> 3] == unsafe._mem_f64[(b + 24) >> 3] && unsafe._mem_f64[(a + 32) >> 3] == unsafe._mem_f64[(b + 32) >> 3] && unsafe._mem_f64[(a + 40) >> 3] == unsafe._mem_f64[(b + 40) >> 3] && unsafe._mem_f64[(a + 48) >> 3] == unsafe._mem_f64[(b + 48) >> 3] && unsafe._mem_f64[(a + 56) >> 3] == unsafe._mem_f64[(b + 56) >> 3] && unsafe._mem_f64[(a + 64) >> 3] == unsafe._mem_f64[(b + 64) >> 3] && unsafe._mem_f64[(a + 72) >> 3] == unsafe._mem_f64[(b + 72) >> 3] && unsafe._mem_f64[(a + 80) >> 3] == unsafe._mem_f64[(b + 80) >> 3] && unsafe._mem_f64[(a + 88) >> 3] == unsafe._mem_f64[(b + 88) >> 3] && unsafe._mem_f64[(a + 96) >> 3] == unsafe._mem_f64[(b + 96) >> 3] && unsafe._mem_f64[(a + 104) >> 3] == unsafe._mem_f64[(b + 104) >> 3] && unsafe._mem_f64[(a + 112) >> 3] == unsafe._mem_f64[(b + 112) >> 3] && unsafe._mem_f64[(a + 120) >> 3] == unsafe._mem_f64[(b + 120) >> 3] && unsafe._mem_f64[(a + 128) >> 3] == unsafe._mem_f64[(b + 128) >> 3];
    }

    static IsIdentity(a:number):boolean {
        return unsafe._mem_f64[(a + 8) >> 3] == 1 && unsafe._mem_f64[(a + 16) >> 3] == 0 && unsafe._mem_f64[(a + 24) >> 3] == 0 && unsafe._mem_f64[(a + 32) >> 3] == 0 && unsafe._mem_f64[(a + 40) >> 3] == 0 && unsafe._mem_f64[(a + 48) >> 3] == 1 && unsafe._mem_f64[(a + 56) >> 3] == 0 && unsafe._mem_f64[(a + 64) >> 3] == 0 && unsafe._mem_f64[(a + 72) >> 3] == 0 && unsafe._mem_f64[(a + 80) >> 3] == 0 && unsafe._mem_f64[(a + 88) >> 3] == 1 && unsafe._mem_f64[(a + 96) >> 3] == 0 && unsafe._mem_f64[(a + 104) >> 3] == 0 && unsafe._mem_f64[(a + 112) >> 3] == 0 && unsafe._mem_f64[(a + 120) >> 3] == 0 && unsafe._mem_f64[(a + 128) >> 3] == 1;
    }

    static TranslateUnitMatrix(v:number, c?:number):number{
        let ptr:number = c?c:Matrix.initInstance(unsafe.alloc(136,8));
        return Matrix.init(ptr,
            1, 0, 0, unsafe._mem_f64[(v + 8) >> 3],
            0, 1, 0, unsafe._mem_f64[(v + 16) >> 3],
            0, 0, 1, unsafe._mem_f64[(v + 24) >> 3],
            0, 0, 0, 1
        )
    }

    static ScaleUnitMatrix(v:number, c?:number):number{
        let ptr:number = c?c:Matrix.initInstance(unsafe.alloc(136,8));
        return Matrix.init(ptr,
            unsafe._mem_f64[(v + 8) >> 3], 0, 0, 0,
            0, unsafe._mem_f64[(v + 16) >> 3], 0, 0,
            0, 0, unsafe._mem_f64[(v + 24) >> 3], 0,
            0, 0, 0, 1
        )
    }

    static RotateUnitMatrix(v:number, a:number, _c?:number):number{

        v = Vector.Normalize_mem(v);
        let s:number = Math.sin(a);
        let c:number = Math.cos(a);
        let m:number = 1 - c;

        let ptr:number = _c?_c:Matrix.initInstance(unsafe.alloc(136,8));
        return Matrix.init(ptr,
            m*unsafe._mem_f64[(v + 8) >> 3] * unsafe._mem_f64[(v + 8) >> 3] + c, m * unsafe._mem_f64[(v + 8) >> 3] * unsafe._mem_f64[(v + 16) >> 3] + unsafe._mem_f64[(v + 24) >> 3] * s, m * unsafe._mem_f64[(v + 24) >> 3] * unsafe._mem_f64[(v + 8) >> 3] - unsafe._mem_f64[(v + 16) >> 3] * s, 0,
            m*unsafe._mem_f64[(v + 8) >> 3] * unsafe._mem_f64[(v + 16) >> 3] - unsafe._mem_f64[(v + 24) >> 3] * s, m*unsafe._mem_f64[(v + 16) >> 3] * unsafe._mem_f64[(v + 16) >> 3] + c, m*unsafe._mem_f64[(v + 16) >> 3] * unsafe._mem_f64[(v + 24) >> 3] + unsafe._mem_f64[(v + 8) >> 3] * s, 0,
            m*unsafe._mem_f64[(v + 24) >> 3] * unsafe._mem_f64[(v + 8) >> 3] + unsafe._mem_f64[(v + 16) >> 3] * s, m*unsafe._mem_f64[(v + 16) >> 3] * unsafe._mem_f64[(v + 24) >> 3] - unsafe._mem_f64[(v + 8) >> 3] * s, m*unsafe._mem_f64[(v + 24) >> 3] * unsafe._mem_f64[(v + 24) >> 3] + c, 0,
            0, 0, 0, 1
        )
    }

    static FrustumUnitMatrix(l:number, r:number, b:number, t:number, n:number, f:number, c?:number):number{

        let t1:number = 2 * n;
        let t2:number = r - l;
        let t3:number = t - b;
        let t4:number = f - n;

        let ptr:number = c?c:Matrix.initInstance(unsafe.alloc(136,8));
        return Matrix.init(ptr,
            t1 / t2, 0, (r + l) / t2, 0,
            0, t1 / t3, (t + b) / t3, 0,
            0, 0, (-f - n) / t4, (-t1 * f) / t4,
            0, 0, -1, 0
        )
    }

    static OrthographicUnitMatrix(l:number, r:number, b:number, t:number, n:number, f:number, c?:number):number{

        let ptr:number = c?c:Matrix.initInstance(unsafe.alloc(136,8));
        return Matrix.init(ptr,
            2 / (r - l), 0, 0, -(r + l) / (r - l),
            0, 2 / (t - b), 0, -(t + b) / (t - b),
            0, 0, -2 / (f - n), -(f + n) / (f - n),
            0, 0, 0, 1
        )
    }

    static PerspectiveUnitMatrix(fovy:number, aspect:number, near:number, far:number, c?:number):number {
        let ymax:number = near * Math.tan(fovy * Math.PI/360);
        let xmax:number = ymax * aspect;
        return Matrix.Frustum(-xmax, xmax, -ymax, ymax, near, far, c);
    }

    static LookAtMatrix(eye:number, center:number, up:number, c?:number):number{
        up = Vector.Normalize_mem(up);
        let f:number = Vector.Normalize_mem(Vector.Sub_mem(center, eye));
        let s:number = Vector.Normalize_mem(Vector.Cross_mem(f, up));
        let u:number = Vector.Cross_mem(s,f);

        let ptr:number = c?c:Matrix.initInstance(unsafe.alloc(136,8));
        Matrix.init(ptr,
            unsafe._mem_f64[(s + 8) >> 3], unsafe._mem_f64[(u + 8) >> 3], unsafe._mem_f64[(f + 8) >> 3], 0,
            unsafe._mem_f64[(s + 16) >> 3], unsafe._mem_f64[(u + 16) >> 3], unsafe._mem_f64[(f + 16) >> 3], 0,
            unsafe._mem_f64[(s + 24) >> 3], unsafe._mem_f64[(u + 24) >> 3], unsafe._mem_f64[(f + 24) >> 3], 0,
            0, 0, 0, 1
        );
        return Matrix.Translate(Matrix.Inverse(Matrix.Transpose(ptr, ptr), ptr), eye, ptr);
    }
    
    static Translate(m:number, v:number, c?:number):number {
        return Matrix.Mul(m, Matrix.TranslateUnitMatrix(v), c);
    }

    static Scale(m:number, v:number, c?:number):number{
        return Matrix.Mul(m, Matrix.ScaleUnitMatrix(v), c);
    }

    static Rotate(m:number, v:number, a:number, c?:number):number {
        return Matrix.Mul(m, Matrix.RotateUnitMatrix(v, a), c);
    }

    static Frustum(m:number, l:number, r:number, b:number, t:number, n:number, f:number, c?:number):number {
        return Matrix.Mul(m, Matrix.FrustumUnitMatrix(l, r, b, t, n, f, c), c);
    }

    static Orthographic(m:number, l:number, r:number, b:number, t:number, n:number, f:number, c?:number):number {
        return Matrix.Mul(m, Matrix.OrthographicUnitMatrix(l, r, b, t, n, f, c), c);
    }

    static Perspective(m:number, fovy:number, aspect:number, near:number, far:number, c?:number):number {
        return Matrix.Mul(m, Matrix.PerspectiveUnitMatrix(fovy, aspect, near, far, c), c);
    }

    static Mul(a:number, b:number, m?:number):number{
        m = m?m:Matrix.initInstance(unsafe.alloc(136,8));
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
    }

    static MulPosition(a:number, b:number, c?:number):number {
        let x:number = unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3] + unsafe._mem_f64[(a + 32) >> 3];
        let y:number = unsafe._mem_f64[(a + 40) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 48) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 56) >> 3] * unsafe._mem_f64[(b + 24) >> 3] + unsafe._mem_f64[(a + 64) >> 3];
        let z:number = unsafe._mem_f64[(a + 72) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 80) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 88) >> 3] * unsafe._mem_f64[(b + 24) >> 3] + unsafe._mem_f64[(a + 96) >> 3];
        let ptr:number = c?c:Vector.initInstance(unsafe.alloc(32,8))();
        return Vector.Init_mem(ptr, x, y, z);
    }

    static MulPosition_vec3(a:number, b:Vector3):Vector3 {
        let x:number = unsafe._mem_f64[(a + 8) >> 3] * b.x + unsafe._mem_f64[(a + 16) >> 3] * b.y + unsafe._mem_f64[(a + 24) >> 3] * b.z + unsafe._mem_f64[(a + 32) >> 3];
        let y:number = unsafe._mem_f64[(a + 40) >> 3] * b.x + unsafe._mem_f64[(a + 48) >> 3] * b.y + unsafe._mem_f64[(a + 56) >> 3] * b.z + unsafe._mem_f64[(a + 64) >> 3];
        let z:number = unsafe._mem_f64[(a + 72) >> 3] * b.x + unsafe._mem_f64[(a + 80) >> 3] * b.y + unsafe._mem_f64[(a + 88) >> 3] * b.z + unsafe._mem_f64[(a + 96) >> 3];
        return new Vector3(x, y, z);
    }

    static MulDirection(a:number, b:number, c?:number):number {
        let x:number = unsafe._mem_f64[(a + 8) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 16) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 24) >> 3] * unsafe._mem_f64[(b + 24) >> 3];
        let y:number = unsafe._mem_f64[(a + 40) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 48) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 56) >> 3] * unsafe._mem_f64[(b + 24) >> 3];
        let z:number = unsafe._mem_f64[(a + 72) >> 3] * unsafe._mem_f64[(b + 8) >> 3] + unsafe._mem_f64[(a + 80) >> 3] * unsafe._mem_f64[(b + 16) >> 3] + unsafe._mem_f64[(a + 88) >> 3] * unsafe._mem_f64[(b + 24) >> 3];
        let ptr:number = c?c:Vector.initInstance(unsafe.alloc(32,8));
        return Vector.Normalize_mem(Vector.Init_mem(ptr, x, y, z));
    }

    static MulDirection_vec3(a:number, b:Vector3):Vector3 {
        let x:number = unsafe._mem_f64[(a + 8) >> 3] * b.x + unsafe._mem_f64[(a + 16) >> 3] * b.y + unsafe._mem_f64[(a + 24) >> 3] * b.z;
        let y:number = unsafe._mem_f64[(a + 40) >> 3] * b.x + unsafe._mem_f64[(a + 48) >> 3] * b.y + unsafe._mem_f64[(a + 56) >> 3] * b.z;
        let z:number = unsafe._mem_f64[(a + 72) >> 3] * b.x + unsafe._mem_f64[(a + 80) >> 3] * b.y + unsafe._mem_f64[(a + 88) >> 3] * b.z;
        return new Vector3(x, y, z).normalize();
    }

    static MulRay(a:number, ray:Ray):Ray {
        let origin:Vector3 = Matrix.MulPosition_vec3(a, ray.origin);
        let direction:Vector3 = Matrix.MulDirection_vec3(a, ray.direction);
        return new Ray(origin, direction);
    }

    static  MulBox(a:number, box:number, c?:number):number {
        let min:number = unsafe._mem_i32[(box + 4) >> 2];
        let max:number = unsafe._mem_i32[(box + 8) >> 2];
        // http://dev.theomader.com/transform-bounding-boxes/
        let r:number = Vector.Init_mem(Vector.initInstance(unsafe.alloc(32,8)), unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 40) >> 3], unsafe._mem_f64[(a + 72) >> 3]);
        let u:number = Vector.Init_mem(Vector.initInstance(unsafe.alloc(32,8)), unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(a + 48) >> 3], unsafe._mem_f64[(a + 80) >> 3]);
        let b:number = Vector.Init_mem(Vector.initInstance(unsafe.alloc(32,8)), unsafe._mem_f64[(a + 24) >> 3], unsafe._mem_f64[(a + 56) >> 3], unsafe._mem_f64[(a + 88) >> 3]);
        let t:number = Vector.Init_mem(Vector.initInstance(unsafe.alloc(32,8)), unsafe._mem_f64[(a + 32) >> 3], unsafe._mem_f64[(a + 64) >> 3], unsafe._mem_f64[(a + 96) >> 3]);
        let xa:number = Vector.MulScalar_mem(r, unsafe._mem_f64[(min + 8) >> 3]);
        let xb:number = Vector.MulScalar_mem(r, unsafe._mem_f64[(max + 8) >> 3]);
        let ya:number = Vector.MulScalar_mem(u, unsafe._mem_f64[(min + 16) >> 3]);
        let yb:number = Vector.MulScalar_mem(u, unsafe._mem_f64[(max + 16) >> 3]);
        let za:number = Vector.MulScalar_mem(b, unsafe._mem_f64[(min + 24) >> 3]);
        let zb:number = Vector.MulScalar_mem(b, unsafe._mem_f64[(max + 24) >> 3]);
        xa = Vector.Min_mem(xa, xb, r);
        xb = Vector.Max_mem(xa, xb, u);
        ya = Vector.Min_mem(ya, yb, b);
        yb = Vector.Max_mem(ya, yb);
        za = Vector.Min_mem(za, zb);
        zb = Vector.Max_mem(za, zb);
        min = Vector.Add_mem(Vector.Add_mem(Vector.Add_mem(xa, ya), za),t);
        max = Vector.Add_mem(Vector.Add_mem(Vector.Add_mem(xb, yb), zb),t);
        let ptr = c?c:Box.initInstance(unsafe.alloc(12,4));
        return Box.Init_mem(ptr, min, max);
    }

    static Transpose(a:number, c?:number):number {
        let ptr = c?c:Matrix.initInstance(unsafe.alloc(136,8));
        return Matrix.init(ptr,
            unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 40) >> 3], unsafe._mem_f64[(a + 72) >> 3], unsafe._mem_f64[(a + 104) >> 3],
            unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(a + 48) >> 3], unsafe._mem_f64[(a + 80) >> 3], unsafe._mem_f64[(a + 112) >> 3],
            unsafe._mem_f64[(a + 24) >> 3], unsafe._mem_f64[(a + 56) >> 3], unsafe._mem_f64[(a + 88) >> 3], unsafe._mem_f64[(a + 120) >> 3],
            unsafe._mem_f64[(a + 32) >> 3], unsafe._mem_f64[(a + 64) >> 3], unsafe._mem_f64[(a + 96) >> 3], unsafe._mem_f64[(a + 128) >> 3]
        );
    }

    static Determinant(SELF:number):number {
        return (unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] +
        unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] +
        unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] -
        unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] -
        unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] -
        unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] +
        unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] +
        unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] +
        unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] -
        unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] -
        unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] -
        unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3])
    }

    static Inverse(SELF:number, c?:number):number {
        let m:number = c?c:Matrix.initInstance(unsafe.alloc(136,8));
        let d:number = Matrix.Determinant(SELF);
        unsafe._mem_f64[(m + 8) >> 3] = (unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] + unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3]) / d
        unsafe._mem_f64[(m + 16) >> 3] = (unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3]) / d
        unsafe._mem_f64[(m + 24) >> 3] = (unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3]) / d
        unsafe._mem_f64[(m + 32) >> 3] = (unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3] + unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]) / d
        unsafe._mem_f64[(m + 40) >> 3] = (unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] - unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3]) / d
        unsafe._mem_f64[(m + 48) >> 3] = (unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3]) / d
        unsafe._mem_f64[(m + 56) >> 3] = (unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3]) / d
        unsafe._mem_f64[(m + 64) >> 3] = (unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]) / d
        unsafe._mem_f64[(m + 72) >> 3] = (unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] + unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] + unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3]) / d
        unsafe._mem_f64[(m + 80) >> 3] = (unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3]) / d
        unsafe._mem_f64[(m + 88) >> 3] = (unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] + unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 128) >> 3]) / d
        unsafe._mem_f64[(m + 96) >> 3] = (unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3] - unsafe._mem_f64[(SELF + 32) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 64) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 96) >> 3]) / d
        unsafe._mem_f64[(m + 104) >> 3] = (unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3]) / d
        unsafe._mem_f64[(m + 112) >> 3] = (unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] + unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3]) / d
        unsafe._mem_f64[(m + 120) >> 3] = (unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 104) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 112) >> 3] + unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 120) >> 3]) / d
        unsafe._mem_f64[(m + 128) >> 3] = (unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3] - unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 72) >> 3] + unsafe._mem_f64[(SELF + 24) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3] - unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 56) >> 3]*unsafe._mem_f64[(SELF + 80) >> 3] - unsafe._mem_f64[(SELF + 16) >> 3]*unsafe._mem_f64[(SELF + 40) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3] + unsafe._mem_f64[(SELF + 8) >> 3]*unsafe._mem_f64[(SELF + 48) >> 3]*unsafe._mem_f64[(SELF + 88) >> 3]) / d
        return m
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=2093537; return SELF; }
}
unsafe._idToType[2093537] = Matrix;

export class Image extends MemoryObject{
   static NAME:string = "Image";
   static SIZE:number = 20;
   static ALIGN:number = 4;
   static CLSID:number = 150430;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, width:number, height:number, depth:number = 8) {

         unsafe._mem_i32[(SELF + 4) >> 2] = width; 
         unsafe._mem_i32[(SELF + 8) >> 2] = height; 
         unsafe._mem_u8[(SELF + 12) >> 0] = depth; 
        let len = width * height * 4;
        let pixels = unsafe.alloc( 4 + ( 1 * len ), 1 ) /*Array*/;
        unsafe._mem_i32[pixels >> 2] = len;
         unsafe._mem_i32[(SELF + 16) >> 2] = pixels; 
        return SELF;
    }

    static At(SELF, x, y){
        let i = (y * (unsafe._mem_i32[(SELF + 4) >> 2] * 4)) + (x * 4);
        unsafe._mem_u8[(  (unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (1 * i)  ) >> 0];

    }

    static setRaw(SELF, data){

        for(let i=0;i < data.length;i++){
            unsafe._mem_u8[(  (unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (1 * i)  ) >> 0] = (data[i]);
        }

    }


    static setRGBA(SELF, x, y, c){
        let i = (y * (unsafe._mem_i32[(SELF + 4) >> 2] * 4)) + (x * 4);
        unsafe._mem_u8[(  (unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (1 * i)  ) >> 0] = (c.r * 255);
        unsafe._mem_u8[(  (unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (1 * (i + 1))  ) >> 0] = (c.g * 255);
        unsafe._mem_u8[(  (unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (1 * (i + 2))  ) >> 0] = (c.b * 255);
        unsafe._mem_u8[(  (unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (1 * (i + 3))  ) >> 0] = (c.a * 255);
    }

    static NewRGBA(width:number, height:number) {
        let ptr = Image.initInstance(unsafe.alloc(20,4));
        Image.init(ptr, width, height, 8);
        return ptr;
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=150430; return SELF; }
}
unsafe._idToType[150430] = Image;

export class Texture extends MemoryObject{
   static NAME:string = "Texture";
   static SIZE:number = 16;
   static ALIGN:number = 4;
   static CLSID:number = 10502342;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, width:number, height:number, data:number){
         unsafe._mem_i32[(SELF + 4) >> 2] = width; 
         unsafe._mem_i32[(SELF + 8) >> 2] = height; 
         unsafe._mem_i32[(SELF + 12) >> 2] = data; 
        return SELF;
    }

    static textures:any = [];

    static GetTexture(path:string):number {

        let texture = Texture.textures[path];
        if(texture) {
            return texture;
        }
        texture = Texture.LoadTexture(path);
        if(texture){
            Texture.textures[path] = texture;
            return texture
        }
        return null;
    }

    static LoadTexture(path:string):number {
        console.log("Loading IMG: "+ path);
        let im = Utils.LoadImage(path);
        return Texture.NewTexture(im);
    }

    static NewTexture(imgData:Uint8Array, width:number, height:number):number /*Texture*/{

        let data = unsafe.alloc( 4 + ( 4 * (width * height) ), 4 ) /*Array*/;
        unsafe._mem_i32[data >> 2] = (width * height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let i = (y * (width * 4)) + (x * 4);
                let index = y * width + x;
                let c = Color.NewColor(imgData[i]/255, imgData[i+1]/255, imgData[i+2]/255);
                unsafe._mem_i32[(  data + 4 + (4 * index)  ) >> 2] = (Color.Pow_mem(c, 2.2, c));
            }
        }
        let ptr = Texture.initInstance(unsafe.alloc(16,4));
        return Texture.init(ptr, width, height, data);
    }

    static Pow(t:number, a:number):number {
        let data:number = unsafe._mem_i32[(t + 12) >> 2];
        let len:number = Texture.DataLength(t);

        for (let i:number = 0; i < len; i++) {
            let d = unsafe._mem_i32[(  data + 4 + (4 * i)  ) >> 2];
            Color.Pow_mem(d, a, d);
        }
        return t;
    }

    static MulScalar(t:number, a:number):number{
        let data:number = unsafe._mem_i32[(t + 12) >> 2];
        let len:number = Texture.DataLength(t);

        for (let i:number = 0; i < len; i++) {
            let d = unsafe._mem_i32[(  data + 4 + (4 * i)  ) >> 2];
            Color.MulScalar_mem(d, a, d);
        }
        return t;
    }

    static bilinearSample(t:number, u:number, v:number):Color3{
        let Width:number = unsafe._mem_i32[(t + 4) >> 2];
        let Height:number = unsafe._mem_i32[(t + 8) >> 2];
        let data:number = unsafe._mem_i32[(t + 12) >> 2];

        let w:number = Width - 1;
        let h:number = Height - 1;
        
        let _ = Utils.Modf(u * w);
        
        let _x = _.int;
        let x = _.frac;
        _ = Utils.Modf(v * h);
        let _y = _.int;
        let y = _.frac;

        let x0:number = _x;
        let y0:number = _y;
        let x1:number = x0 + 1;
        let y1:number = y0 + 1;
        let c00:number = unsafe._mem_i32[(  data + 4 + (4 * (y0 * Width + x0))  ) >> 2];
        let c01:number = unsafe._mem_i32[(  data + 4 + (4 * (y1 * Width + x0))  ) >> 2];
        let c10:number = unsafe._mem_i32[(  data + 4 + (4 * (y0 * Width + x1))  ) >> 2];
        let c11:number = unsafe._mem_i32[(  data + 4 + (4 * (y1 * Width + x1))  ) >> 2];
        let c:Color3 = new Color3();
        c = c.add(Color.MulScalar2(c00, (1 - x) * (1 - y)));
        c = c.add(Color.MulScalar2(c10, x * (1 - y)));
        c = c.add(Color.MulScalar2(c01, (1 - x) * y));
        c = c.add(Color.MulScalar2(c11, x * y));
        return c;
    }

    static Sample(t:number, u:number, v:number):Color3 {
        u = Utils.Fract(Utils.Fract(u) + 1);
        v = Utils.Fract(Utils.Fract(v) + 1);
        return Texture.bilinearSample(t, u, 1-v);
    }

    static SimpleSample(t:number, u:number, v:number):Color3 {
        let Width:number = unsafe._mem_i32[(t + 4) >> 2];
        let Height:number = unsafe._mem_i32[(t + 8) >> 2];
        let data:number = unsafe._mem_i32[(t + 12) >> 2];

        u = Utils.Fract(Utils.Fract(u) + 1);
        v = Utils.Fract(Utils.Fract(v) + 1);
        v = 1 - v;
        let x = Math.round(u * Width);
        let y = Math.round(v * Height);
        let c = Color.toColor3(unsafe._mem_i32[(  data + 4 + (4 * (y * Width + x))  ) >> 2]);
        return c;
    }

    static NormalSample(t:number, u:number, v:number, c?:number):Vector3 {
        let c = Texture.Sample(t, u, v);
        return new Vector3(unsafe._mem_f64[(c + 8) >> 3] * 2 - 1, unsafe._mem_f64[(c + 16) >> 3] * 2 - 1, unsafe._mem_f64[(c + 24) >> 3] * 2 - 1).normalize();
    }

    static BumpSample(t:number, u:number, v:number, c?:number):Vector3 {
        let Width:number = unsafe._mem_i32[(t + 4) >> 2];
        let Height:number = unsafe._mem_i32[(t + 8) >> 2];
        let data:number = unsafe._mem_i32[(t + 12) >> 2];
        u = Utils.FractAddOne(u);
        v = Utils.FractAddOne(v);
        v = 1 - v;
        let x:number = parseInt(u * Width);
        let y:number = parseInt(v * Height);
        let x1 = Utils.ClampInt(x-1, 0, Width-1);
        let x2 = Utils.ClampInt(x+1, 0, Width-1);
        let y1 = Utils.ClampInt(y-1, 0, Height-1);
        let y2 = Utils.ClampInt(y+1, 0, Height-1);
        let cx = Color.Sub_mem2(unsafe._mem_i32[(  data + 4 + (4 * (y * Width + x1))  ) >> 2], unsafe._mem_i32[(  data + 4 + (4 * (y * Width + x2))  ) >> 2]);
        let cy = Color.Sub_mem2(unsafe._mem_i32[(  data + 4 + (4 * (y1 * Width + x))  ) >> 2], unsafe._mem_i32[(  data + 4 + (4 * (y2 * Width + x))  ) >> 2]);
        return new Vector3(cx.r, cy.r, 0);
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=10502342; return SELF; }
}
unsafe._idToType[10502342] = Texture;


export class Material extends MemoryObject{
   static NAME:string = "Material";
   static SIZE:number = 73;
   static ALIGN:number = 8;
   static CLSID:number = 167722613;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, Color, Texture, NormalTexture, BumpTexture, GlossTexture, BumpMultiplier, Emittance, Index, Gloss, Tint, Reflectivity, Transparent){
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
    }
    static IsLight(SELF):boolean {
        return unsafe._mem_f64[(SELF + 32) >> 3] > 0;
    }
    static Clone(SELF, c?:number):number {
        let ptr:number = c?c:Material.initInstance(unsafe.alloc(73,8));
        return Material.init(ptr,
            Color.Clone(unsafe._mem_i32[(SELF + 4) >> 2]),
            unsafe._mem_i32[(SELF + 8) >> 2],
            unsafe._mem_i32[(SELF + 12) >> 2],
            unsafe._mem_i32[(SELF + 16) >> 2],
            unsafe._mem_i32[(SELF + 20) >> 2],
            unsafe._mem_f64[(SELF + 24) >> 3],
            unsafe._mem_f64[(SELF + 32) >> 3],
            unsafe._mem_f64[(SELF + 40) >> 3],
            unsafe._mem_f64[(SELF + 48) >> 3],
            unsafe._mem_f64[(SELF + 56) >> 3],
            unsafe._mem_f64[(SELF + 64) >> 3],
            unsafe._mem_u8[(SELF + 72) >> 0]
        );
    }
    static ToJSON(SELF){
        return {
            ptr:SELF,
            color:Color.RGBA(unsafe._mem_i32[(SELF + 4) >> 2]),
            texture:unsafe._mem_i32[(SELF + 8) >> 2],
            normalTexture:unsafe._mem_i32[(SELF + 12) >> 2],
            bumpTexture:unsafe._mem_i32[(SELF + 16) >> 2],
            glossTexture:unsafe._mem_i32[(SELF + 20) >> 2],
            bumpMultiplier:unsafe._mem_f64[(SELF + 24) >> 3],
            emittance:unsafe._mem_f64[(SELF + 32) >> 3],
            index:unsafe._mem_f64[(SELF + 40) >> 3],
            gloss:unsafe._mem_f64[(SELF + 48) >> 3],
            tint:unsafe._mem_f64[(SELF + 56) >> 3],
            reflectivity:unsafe._mem_f64[(SELF + 64) >> 3],
            transparent:unsafe._mem_u8[(SELF + 72) >> 0]
        }
    }

    static setEmittance(SELF, Emittance) {
         unsafe._mem_f64[(SELF + 32) >> 3] = Emittance; 
    }

    static setIndex(SELF, Index) {
         unsafe._mem_f64[(SELF + 40) >> 3] = Index; 
    }

    static setGloss(SELF, Gloss) {
         unsafe._mem_f64[(SELF + 48) >> 3] = Gloss; 
    }

    static setTint(SELF, Tint) {
         unsafe._mem_f64[(SELF + 56) >> 3] = Tint; 
    }

    static setReflectivity(SELF, Reflectivity) {
         unsafe._mem_f64[(SELF + 64) >> 3] = Reflectivity; 
    }

    static setTransparent(SELF, Transparent) {
         unsafe._mem_u8[(SELF + 72) >> 0] = Transparent; 
    }

    static setTexture(SELF, Texture) {
         unsafe._mem_i32[(SELF + 8) >> 2] = Texture; 
    }

    static setNormalTexture(SELF, NormalTexture) {
         unsafe._mem_i32[(SELF + 12) >> 2] = NormalTexture; 
    }

    static setBumpTexture(SELF, BumpTexture) {
         unsafe._mem_i32[(SELF + 16) >> 2] = BumpTexture; 
    }

    static setBumpMultiplier(SELF, BumpMultiplier) {
         unsafe._mem_f64[(SELF + 24) >> 3] = BumpMultiplier; 
    }

    static setGlossTexture(SELF, GlossTexture) {
         unsafe._mem_i32[(SELF + 20) >> 2] = GlossTexture; 
    }

    static DiffuseMaterial(color:number):number{
        let ptr:number = Material.initInstance(unsafe.alloc(73,8));
        return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, 1, 0, 0, -1, false);
    }

    static SpecularMaterial(color:number, index:number):number{
        let ptr:number = Material.initInstance(unsafe.alloc(73,8));
        return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, index, 0, 0, -1, false);
    }

    static GlossyMaterial(color:number, index:number, gloss:number):number{
        let ptr:number = Material.initInstance(unsafe.alloc(73,8));
        return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, index, gloss, 0, -1, false);
    }

    static ClearMaterial(index:number, gloss:number):number{
        let ptr:number = Material.initInstance(unsafe.alloc(73,8));
        return Material.init(ptr, Color.BLACK, 0, 0, 0, 0, 1, 0, index, gloss, 0, -1, true);
    }

    static TransparentMaterial(color:number, index:number, gloss:number, tint:number):number{
        let ptr:number = Material.initInstance(unsafe.alloc(73,8));
        return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, index, gloss, tint, -1, true);
    }

    static MetallicMaterial(color:number, gloss:number, tint:number):number{
        let ptr:number = Material.initInstance(unsafe.alloc(73,8));
        return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, 1, gloss, tint, -1, false);
    }

    static LightMaterial(color:number, emittance:number):number{
        let ptr:number = Material.initInstance(unsafe.alloc(73,8));
        return Material.init(ptr, color, 0, 0, 0, 0, 1, emittance, 1, 0, 0, -1, false);
    }

    static MaterialAt(shape:number, point:Vector3):number{
        let material:number = Shape.MaterialAt(shape, point);
        let uv:Vector3 = Shape.UV(shape, point);
        if (unsafe._mem_i32[(material + 8) >> 2]) {
            Color.init(unsafe._mem_i32[(material + 4) >> 2], Texture.Sample(unsafe._mem_i32[(material + 8) >> 2], uv.x, uv.y));
        }
        if (unsafe._mem_i32[(material + 20) >> 2]) {
            let c:Color3 = Texture.Sample(unsafe._mem_i32[(material + 20) >> 2], uv.x, uv.y);
            unsafe._mem_f64[(material + 48) >> 3] = (c.r + c.g + c.b) / 3;
        }
        return material;
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=167722613; return SELF; }
}
unsafe._idToType[167722613] = Material;

export class Ray{

	constructor(public origin:Vector3, public direction:Vector3){
	}

	position(t:number):Vector3{
        return this.origin.add(this.direction.mulScalar(t));
	}

    reflect(i:Ray):Ray {
        return new Ray(this.origin, this.direction.reflect(i.direction));
    }

    refract(i:Ray, n1:number, n2:number):Ray {
        return new Ray(this.origin, this.direction.refract(i.direction, n1, n2));
    }

    reflectance(i:Ray, n1:number, n2:number):number {
        return this.direction.reflectance(i.direction, n1, n2);
    }

    weightedBounce(u, v:number):Ray {
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
    }

    coneBounce(theta:number, u:number, v:number, c?:number):Ray{
        return new Ray(this.origin, Utils.Cone(this.direction, theta, u, v));
    }


    bounce2(info:HitInfo, p:number, u:number, v:number):{ray:Ray,reflected:boolean} {
        var n:Ray = info.Ray;F
        let material = info.Material;
        let n1 = 1.0;
        let n2 = unsafe._mem_f64[(material + 40) >> 3];
        let gloss = unsafe._mem_f64[(material + 48) >> 3];
        let transparent = unsafe._mem_u8[(material + 72) >> 0];

        if (info.Inside) {
            var _n1 = n1;
            n1 = n2;
            n2 = _n1;
        }
        if (p < n.reflectance(this, n1, n2)) {
            var reflected:Ray = n.reflect(this);
            var ray:Ray = reflected.coneBounce(gloss, u, v);
            return {ray: ray, reflected: true};
        } else if (transparent) {
            var refracted = n.Refract(this, n1, n2);
            var ray = refracted.coneBounce(gloss, u, v);
            return {ray: ray, reflected: true};
        } else {
            var ray:Ray = n.weightedBounce(u, v);
            return {ray: ray, reflected: false};
        }
    }

    bounce(info:HitInfo, u:number, v:number, bounceType:BounceType):{ray:Ray, reflected:boolean, coefficient:number} {
        let n:Ray = info.Ray;
        let material = info.Material;
        let n1 = 1.0;
        let n2 = unsafe._mem_f64[(material + 40) >> 3];

        if(info.Inside){
            let tmp = n1;
            n1 = n2;
            n2 = tmp;
        }

        let p:number;

        if(unsafe._mem_f64[(material + 64) >> 3] >= 0) {
            p = unsafe._mem_f64[(material + 64) >> 3];
        }else{
            p = n.reflectance(this, n1, n2);
        }

        let reflect:boolean;

        switch (bounceType){
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
        if(reflect) {
            let reflected:Ray = n.reflect(this);
            return { ray: reflected.coneBounce(unsafe._mem_f64[(material + 48) >> 3], u, v), reflected:true, coefficient:p };
        } else if (unsafe._mem_u8[(material + 72) >> 0]) {
            let refracted:Ray = n.refract(this, n1, n2);
            refracted.origin = refracted.origin.add(refracted.direction.mulScalar(1e-4));
            return { ray: refracted.coneBounce(unsafe._mem_f64[(material + 48) >> 3], u, v), reflected: true, coefficient: 1 - p };
        } else {
            return { ray: n.weightedBounce(u, v), reflected: false, coefficient: 1 - p };
        }
    }
}

export interface Hit{
    Shape:number;
}
export interface Ray{

}

export enum ShapeType{
	UNKNOWN,
	PLANE,
	CUBE,
	SPHERE,
	TRIANGLE,
	MESH,
    Volume,
    SDFShape
}

export class Shape extends MemoryObject{
   static NAME:string = "Shape";
   static SIZE:number = 8;
   static ALIGN:number = 4;
   static CLSID:number = 255446;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF:number, id):number{
         unsafe._mem_u32[(SELF + 4) >> 2] = id; 
		return SELF;
	}
    static Type_impl(SELF:number){
		throw ShapeType.UNKNOWN;
	}
    static ToJSON_impl(SELF:number){
		throw "Pure: Shape.ToJSON()";
	}
    static Compile_impl(SELF:number, c?:number){
		throw "Pure: Shape.Compile()";
	}
    static BoundingBox_impl(SELF:number, c?:number):number{
		throw "Pure: Shape.BoundingBox()";
	}
    static Intersect_impl(SELF:number, ray:Ray, c?:number):Hit{
		throw "Pure: Shape.Intersect()";
	}
    static UV_impl(SELF:number, p:Vector3, c?:number):number{
		throw "Pure: Shape.UV()";
	}
    static NormalAt_impl(SELF:number, p:Vector3, c?:number):number{
		throw "Pure: Shape.NormalAt()";
	}
    static MaterialAt_impl(SELF:number, p:Vector3, c?:number):number{
		throw "Pure: Shape.MaterialAt()";
	}
    static Type(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 255446:
                return Shape.Type_impl(SELF );
            case 124486674:
                return TransformedShape.Type_impl(SELF );
            case 48824165:
                return Cube.Type_impl(SELF );
            case 171432461:
                return Sphere.Type_impl(SELF );
            case 232773086:
                return Triangle.Type_impl(SELF );
            case 48819938:
                return Mesh.Type_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static ToJSON(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 255446:
                return Shape.ToJSON_impl(SELF );
            case 124486674:
                return TransformedShape.ToJSON_impl(SELF );
            case 48824165:
                return Cube.ToJSON_impl(SELF );
            case 171432461:
                return Sphere.ToJSON_impl(SELF );
            case 232773086:
                return Triangle.ToJSON_impl(SELF );
            case 48819938:
                return Mesh.ToJSON_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Compile(SELF , c) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 255446:
                return Shape.Compile_impl(SELF , c);
            case 124486674:
                return TransformedShape.Compile_impl(SELF , c);
            case 48824165:
                return Cube.Compile_impl(SELF , c);
            case 171432461:
                return Sphere.Compile_impl(SELF , c);
            case 232773086:
                return Triangle.Compile_impl(SELF , c);
            case 48819938:
                return Mesh.Compile_impl(SELF , c);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static BoundingBox(SELF , c) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 255446:
                return Shape.BoundingBox_impl(SELF , c);
            case 124486674:
                return TransformedShape.BoundingBox_impl(SELF , c);
            case 48824165:
                return Cube.BoundingBox_impl(SELF , c);
            case 171432461:
                return Sphere.BoundingBox_impl(SELF , c);
            case 232773086:
                return Triangle.BoundingBox_impl(SELF , c);
            case 48819938:
                return Mesh.BoundingBox_impl(SELF , c);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Intersect(SELF , ray,c) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 255446:
                return Shape.Intersect_impl(SELF , ray,c);
            case 124486674:
                return TransformedShape.Intersect_impl(SELF , ray,c);
            case 48824165:
                return Cube.Intersect_impl(SELF , ray,c);
            case 171432461:
                return Sphere.Intersect_impl(SELF , ray,c);
            case 232773086:
                return Triangle.Intersect_impl(SELF , ray,c);
            case 48819938:
                return Mesh.Intersect_impl(SELF , ray,c);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static UV(SELF , p,c) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 255446:
                return Shape.UV_impl(SELF , p,c);
            case 124486674:
                return TransformedShape.UV_impl(SELF , p,c);
            case 48824165:
                return Cube.UV_impl(SELF , p,c);
            case 171432461:
                return Sphere.UV_impl(SELF , p,c);
            case 232773086:
                return Triangle.UV_impl(SELF , p,c);
            case 48819938:
                return Mesh.UV_impl(SELF , p,c);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static NormalAt(SELF , p,c) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 255446:
                return Shape.NormalAt_impl(SELF , p,c);
            case 124486674:
                return TransformedShape.NormalAt_impl(SELF , p,c);
            case 48824165:
                return Cube.NormalAt_impl(SELF , p,c);
            case 171432461:
                return Sphere.NormalAt_impl(SELF , p,c);
            case 232773086:
                return Triangle.NormalAt_impl(SELF , p,c);
            case 48819938:
                return Mesh.NormalAt_impl(SELF , p,c);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static MaterialAt(SELF , p,c) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 255446:
                return Shape.MaterialAt_impl(SELF , p,c);
            case 124486674:
                return TransformedShape.MaterialAt_impl(SELF , p,c);
            case 48824165:
                return Cube.MaterialAt_impl(SELF , p,c);
            case 171432461:
                return Sphere.MaterialAt_impl(SELF , p,c);
            case 232773086:
                return Triangle.MaterialAt_impl(SELF , p,c);
            case 48819938:
                return Mesh.MaterialAt_impl(SELF , p,c);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=255446; return SELF; }
}
unsafe._idToType[255446] = Shape;

export class TransformedShape extends Shape{
   static NAME:string = "TransformedShape";
   static SIZE:number = 28;
   static ALIGN:number = 4;
   static CLSID:number = 124486674;

   static get BASE():string{
       return Shape
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, shape:number, matrix){
         unsafe._mem_i32[(SELF + 12) >> 2] = shape; 
		 unsafe._mem_i32[(SELF + 16) >> 2] = matrix; 
		 unsafe._mem_i32[(SELF + 20) >> 2] = (Matrix.Inverse(matrix)); 
		 unsafe._mem_i32[(SELF + 24) >> 2] = (Matrix.Transpose(unsafe._mem_i32[(SELF + 20) >> 2])); 
		return SELF;
	}

	static NewTransformedShape(s:number, m:number):number {
		return TransformedShape.init(TransformedShape.initInstance(unsafe.alloc(28,4)), s, m);
	}
    static BoundingBox_impl(SELF) {
        if(!unsafe._mem_i32[(SELF + 8) >> 2]){
             unsafe._mem_i32[(SELF + 8) >> 2] = (Matrix.MulBox(unsafe._mem_i32[(SELF + 16) >> 2], Shape.BoundingBox(unsafe._mem_i32[(SELF + 12) >> 2]))); 
        }
        return unsafe._mem_i32[(SELF + 8) >> 2];
	}
    static Intersect_impl(SELF, r:Ray):Hit {

        let invMat = unsafe._mem_i32[(SELF + 20) >> 2];
		let shapeRay:Ray = Matrix.MulRay(invMat, r);
		let hit = Shape.Intersect(unsafe._mem_i32[(SELF + 12) >> 2], shapeRay);
		if (!hit.Ok()) {
			return hit;
		}
        let transMat = unsafe._mem_i32[(SELF + 24) >> 2];
		let shape:number = hit.Shape;
		let shapePosition:Vector3 = shapeRay.position(hit.T);
		let shapeNormal:Vector3 = Shape.NormalAt(shape, shapePosition);
		let position:Vector3 = Matrix.MulPosition_vec3(unsafe._mem_i32[(SELF + 16) >> 2], shapePosition);
		let normal:Vector3 = Matrix.MulDirection_vec3(transMat, shapeNormal);
		let material = Material.MaterialAt(shape, shapePosition);
		let inside = false;
		if (shapeNormal.dot(shapeRay.direction) > 0) {
            normal = normal.negate();
			inside = true;
		}
		let ray:number = new Ray(position, normal);
		let info = new HitInfo(shape, position, normal, ray, material, inside);
		hit.T = position.sub(r.origin).length();
		hit.HitInfo = info;
		return hit;
	}
    static Type_impl(SELF){
        return Shape.Type(unsafe._mem_i32[(SELF + 12) >> 2]);
    }
    static ToJSON_impl(SELF){
    	let json = Shape.ToJSON(unsafe._mem_i32[(SELF + 12) >> 2]);
        json.box = Box.ToJSON(TransformedShape.BoundingBox(SELF));
        return json;
    }
    static Compile_impl(SELF, c?:number){
        return Shape.Compile(unsafe._mem_i32[(SELF + 12) >> 2], c);
    }
    static UV_impl(SELF:number, p:Vector3, c?:number):number{
        return Shape.UV(unsafe._mem_i32[(SELF + 12) >> 2], p, c);
    }
    static NormalAt_impl(SELF:number, p:Vector3, c?:number):number{
        return Shape.NormalAt(unsafe._mem_i32[(SELF + 12) >> 2], p, c);
    }
    static MaterialAt_impl(SELF:number, p:Vector3, c?:number):number{
        return Shape.MaterialAt(unsafe._mem_i32[(SELF + 12) >> 2], p, c);
    }
    static BoundingBox(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 124486674:
                return TransformedShape.BoundingBox_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Intersect(SELF , r) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 124486674:
                return TransformedShape.Intersect_impl(SELF , r);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Type(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 124486674:
                return TransformedShape.Type_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static ToJSON(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 124486674:
                return TransformedShape.ToJSON_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Compile(SELF , c) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 124486674:
                return TransformedShape.Compile_impl(SELF , c);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static UV(SELF , p,c) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 124486674:
                return TransformedShape.UV_impl(SELF , p,c);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static NormalAt(SELF , p,c) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 124486674:
                return TransformedShape.NormalAt_impl(SELF , p,c);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static MaterialAt(SELF , p,c) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 124486674:
                return TransformedShape.MaterialAt_impl(SELF , p,c);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=124486674; return SELF; }
}
unsafe._idToType[124486674] = TransformedShape;

export class Cube extends Shape{
   static NAME:string = "Cube";
   static SIZE:number = 24;
   static ALIGN:number = 4;
   static CLSID:number = 48824165;

   static get BASE():string{
       return Shape
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, min, max, material, box){
         unsafe._mem_i32[(SELF + 8) >> 2] = min; 
         unsafe._mem_i32[(SELF + 12) >> 2] = max; 
         unsafe._mem_i32[(SELF + 16) >> 2] = material; 
         unsafe._mem_i32[(SELF + 20) >> 2] = box; 
        return SELF;
    }
    static NewCube(min, max, material):number {
        let box = Box.Init_mem(Box.initInstance(unsafe.alloc(12,4)), min, max);
        return Cube.init(Cube.initInstance(unsafe.alloc(24,4)), min, max, material, box);
    }
    static Type_impl(SELF:number){
        throw ShapeType.CUBE;
    }
    static ToJSON_impl(SELF){
        return {
            min:Vector.ToJSON(unsafe._mem_i32[(SELF + 8) >> 2]),
            max:Vector.ToJSON(unsafe._mem_i32[(SELF + 12) >> 2]),
            material:Material.ToJSON(unsafe._mem_i32[(SELF + 16) >> 2]),
            box:Box.ToJSON(unsafe._mem_i32[(SELF + 20) >> 2]),
        }
    }
    static Compile_impl(SELF){
    }
    static BoundingBox_impl(SELF):number {
        return unsafe._mem_i32[(SELF + 20) >> 2];
    }
    static Intersect_impl(SELF, r:Ray):Hit {
        let min = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
        let max = new Vector3().read(unsafe._mem_i32[(SELF + 12) >> 2]);

        let n:Vector3 = min.sub(r.origin).div(r.direction);
        let f:Vector3 = max.sub(r.origin).div(r.direction);
        let _n = n.min(f);
        let _f = n.max(f);
        let t0 = Math.max(Math.max(_n.x, _n.y), _n.z);
        let t1 = Math.min(Math.min(_f.x, _f.y), _f.z);
        min = null;
        max = null;
        if (t0 > 0 && t0 < t1) {
            return new Hit(SELF, t0, null)
        }
        return Hit.NoHit;
    }
    static UV_impl(SELF, p:Vector3):Vector3 {
        let min = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
        let max = new Vector3().read(unsafe._mem_i32[(SELF + 12) >> 2]);
        let uv = p.sub(min).div(max.sub(min));
        min = null;
        max = null;
        return new Vector3(uv.x, uv.z, 0);
    }
    static MaterialAt_impl(SELF, p:Vector3):number {
        return unsafe._mem_i32[(SELF + 16) >> 2];
    }
    static NormalAt_impl(SELF, p:Vector3):Vector3 {

        let min = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
        let max = new Vector3().read(unsafe._mem_i32[(SELF + 12) >> 2]);

        if(p.x < min.x + EPS){
            return new Vector3(-1, 0, 0);
        }else if(p.x > max.x - EPS){
            return new Vector3(1, 0, 0);
        }else if (p.y < min.y + EPS){
            return new Vector3(0, -1, 0)
        }else if(p.y > max.y - EPS){
            return new Vector3(0, 1, 0);
        }else if(p.z < min.z + EPS){
            return new Vector3(0, 0, -1);
        }else if(p.z > max.z - EPS){
            return new Vector3(0, 0, 1);
        }
        min = null;
        max = null;
        return new Vector3(0, 1, 0);
    }

    static Mesh(SELF):number {
        let a = unsafe._mem_i32[(SELF + 8) >> 2];
        let b = unsafe._mem_i32[(SELF + 12) >> 2];
        let z = Vector.NewVector();
        let m = unsafe._mem_i32[(SELF + 16) >> 2];
        let v000 = Vector.NewVector(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3]);
        let v001 = Vector.NewVector(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(b + 24) >> 3]);
        let v010 = Vector.NewVector(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3]);
        let v011 = Vector.NewVector(unsafe._mem_f64[(a + 8) >> 3], unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(b + 24) >> 3]);
        let v100 = Vector.NewVector(unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3]);
        let v101 = Vector.NewVector(unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(a + 16) >> 3], unsafe._mem_f64[(b + 24) >> 3]);
        let v110 = Vector.NewVector(unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(a + 24) >> 3]);
        let v111 = Vector.NewVector(unsafe._mem_f64[(b + 8) >> 3], unsafe._mem_f64[(b + 16) >> 3], unsafe._mem_f64[(b + 24) >> 3]);
        let triangles = [
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
    }
    static Type(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48824165:
                return Cube.Type_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static ToJSON(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48824165:
                return Cube.ToJSON_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Compile(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48824165:
                return Cube.Compile_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static BoundingBox(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48824165:
                return Cube.BoundingBox_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Intersect(SELF , r) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48824165:
                return Cube.Intersect_impl(SELF , r);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static UV(SELF , p) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48824165:
                return Cube.UV_impl(SELF , p);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static MaterialAt(SELF , p) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48824165:
                return Cube.MaterialAt_impl(SELF , p);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static NormalAt(SELF , p) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48824165:
                return Cube.NormalAt_impl(SELF , p);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=48824165; return SELF; }
}
unsafe._idToType[48824165] = Cube;


export class Sphere extends Shape{
   static NAME:string = "Sphere";
   static SIZE:number = 32;
   static ALIGN:number = 8;
   static CLSID:number = 171432461;

   static get BASE():string{
       return Shape
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, center:number, radius:number, material:number, box:number):number{
		 unsafe._mem_i32[(SELF + 8) >> 2] = center; 
		 unsafe._mem_f64[(SELF + 16) >> 3] = radius; 
		 unsafe._mem_i32[(SELF + 24) >> 2] = material; 
		 unsafe._mem_i32[(SELF + 28) >> 2] = box; 
		return SELF;
	}

	static NewSphere(center:number, radius:number, material:number):number {
		let min = Vector.initInstance(unsafe.alloc(32,8));
		let max = Vector.initInstance(unsafe.alloc(32,8));
		Vector.Init_mem(min, unsafe._mem_f64[(center + 8) >> 3] - radius, unsafe._mem_f64[(center + 16) >> 3] - radius, unsafe._mem_f64[(center + 24) >> 3] - radius);
		Vector.Init_mem(max, unsafe._mem_f64[(center + 8) >> 3] + radius, unsafe._mem_f64[(center + 16) >> 3] + radius, unsafe._mem_f64[(center + 24) >> 3] + radius);
		let box = Box.initInstance(unsafe.alloc(12,4));
		Box.Init_mem(box , min, max);
		let ptr:number = Sphere.initInstance(unsafe.alloc(32,8));
		return Sphere.init(ptr, center, radius, material, box);
	}
    static Type_impl(SELF){
		return ShapeType.SPHERE;
	}
    static ToJSON_impl(SELF){
		return {
			center:Vector.ToJSON(unsafe._mem_i32[(SELF + 8) >> 2]),
			radius:unsafe._mem_f64[(SELF + 16) >> 3],
			material:Material.ToJSON(unsafe._mem_i32[(SELF + 24) >> 2]),
			box:Box.ToJSON(unsafe._mem_i32[(SELF + 28) >> 2]),
		}
	}
    static Compile_impl(SELF) {
	}
    static BoundingBox_impl(SELF):number {
		return unsafe._mem_i32[(SELF + 28) >> 2];
	}
    static Intersect_impl(SELF, r:Ray):Hit {

        let center:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
		let to:Vector3 = r.origin.sub(center);
		let b:number = to.dot(r.direction);
		let c:number = to.dot(to) - unsafe._mem_f64[(SELF + 16) >> 3] * unsafe._mem_f64[(SELF + 16) >> 3];
		let d = b * b - c;
        center = null;
		if (d > 0) {
			d = Math.sqrt(d);
			let t1 = -b - d;
			if (t1 > EPS) {
				return new Hit(SELF, t1, null)
			}
			let t2 = -b + d;
			if (t2 > EPS) {
				return new Hit(SELF, t2, null);
			}
		}
		return Hit.NoHit;
	}
    static UV_impl(SELF, p:Vector3):Vector3 {
        let center:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
        p = p.sub(center);
        u = Math.atan2(p.z, p.x);
        v = Math.atan2(p.y, new Vector3(p.x, 0, p.z).length());
        u = 1 - (u + Math.PI) / (2 * Math.PI);
        v = (v + Math.PI/2) / Math.PI;
        center = null;
        return new Vector3(u, v, 0);
	}
    static MaterialAt_impl(SELF, _p:Vector3):number {
		return unsafe._mem_i32[(SELF + 24) >> 2];
	}
    static NormalAt_impl(SELF, p:Vector3):Vector3 {
        let center:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
        let p = p.sub(center).normalize();
        center = null;
        return p;
	}
    static Type(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 171432461:
                return Sphere.Type_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static ToJSON(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 171432461:
                return Sphere.ToJSON_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Compile(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 171432461:
                return Sphere.Compile_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static BoundingBox(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 171432461:
                return Sphere.BoundingBox_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Intersect(SELF , r) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 171432461:
                return Sphere.Intersect_impl(SELF , r);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static UV(SELF , p) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 171432461:
                return Sphere.UV_impl(SELF , p);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static MaterialAt(SELF , _p) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 171432461:
                return Sphere.MaterialAt_impl(SELF , _p);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static NormalAt(SELF , p) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 171432461:
                return Sphere.NormalAt_impl(SELF , p);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=171432461; return SELF; }
}
unsafe._idToType[171432461] = Sphere;

export class Triangle extends Shape{
   static NAME:string = "Triangle";
   static SIZE:number = 53;
   static ALIGN:number = 4;
   static CLSID:number = 232773086;

   static get BASE():string{
       return Shape
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, v1:number=-1, v2:number=-1, v3:number=-1, n1:number=-1, n2:number=-1, n3:number=-1, t1:number=-1, t2:number=-1, t3:number=-1, material:number=-1){
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
	}

	static NewTriangle(v1:number, v2:number, v3:number, t1:number, t2:number, t3:number, material:number):number {
		let SELF = Triangle.initInstance(unsafe.alloc(53,4));
		 unsafe._mem_i32[(SELF + 8) >> 2] = v1; 
		 unsafe._mem_i32[(SELF + 12) >> 2] = v2; 
		 unsafe._mem_i32[(SELF + 16) >> 2] = v3; 
		 unsafe._mem_i32[(SELF + 32) >> 2] = t1; 
		 unsafe._mem_i32[(SELF + 36) >> 2] = t2; 
		 unsafe._mem_i32[(SELF + 40) >> 2] = t3; 
		 unsafe._mem_i32[(SELF + 44) >> 2] = material; 
		//Triangle.FixNormals(SELF );
		return SELF;
	}

    static Pack(triangles:number[]):number {
        let packed = unsafe.alloc( 4 + ( 4 * (triangles.length) ), 4 ) /*Array*/;
        unsafe._mem_i32[packed >> 2] = (triangles.length);
        triangles.forEach((triangle, i) =>{
            unsafe._mem_i32[(  packed + 4 + (4 * i)  ) >> 2] = triangle;
        });
        return packed;
    }

    static Copy(a:number, b:number):number{
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
    }

    // static Vertices(SELF){
	// 	return {
     //        V1:unsafe._mem_i32[(SELF + 8) >> 2],
     //        V2:unsafe._mem_i32[(SELF + 12) >> 2],
     //        V3:unsafe._mem_i32[(SELF + 16) >> 2]
     //    }
	// }
    static Type_impl(SELF:number){
        return ShapeType.TRIANGLE;
    }
    static ToJSON_impl(SELF){
		return {
			vertex:{
				v1:Vector.ToJSON(unsafe._mem_i32[(SELF + 8) >> 2]),
				v2:Vector.ToJSON(unsafe._mem_i32[(SELF + 12) >> 2]),
				v3:Vector.ToJSON(unsafe._mem_i32[(SELF + 16) >> 2])
			},
			normal:{
				n1:Vector.ToJSON(unsafe._mem_i32[(SELF + 20) >> 2]),
				n2:Vector.ToJSON(unsafe._mem_i32[(SELF + 24) >> 2]),
				n3:Vector.ToJSON(unsafe._mem_i32[(SELF + 28) >> 2])
			},
			uv:{
				t1:Vector.ToJSON(unsafe._mem_i32[(SELF + 32) >> 2]),
				t2:Vector.ToJSON(unsafe._mem_i32[(SELF + 36) >> 2]),
				t3:Vector.ToJSON(unsafe._mem_i32[(SELF + 40) >> 2])
			},
			material:Material.ToJSON(unsafe._mem_i32[(SELF + 44) >> 2]),
			box:Box.ToJSON(unsafe._mem_i32[(SELF + 48) >> 2]),
		}
	}
    static Compile_impl(SELF) {
	}
    static BoundingBox_impl(SELF, c?:number):number{
        if(unsafe._mem_u8[(SELF + 52) >> 0]){
            return unsafe._mem_i32[(SELF + 48) >> 2];
        }else {
            var min = Vector.Min_mem(Vector.Min_mem(unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 12) >> 2]), unsafe._mem_i32[(SELF + 16) >> 2]);
            var max = Vector.Max_mem(Vector.Max_mem(unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 12) >> 2]), unsafe._mem_i32[(SELF + 16) >> 2]);
             unsafe._mem_i32[(SELF + 48) >> 2] = (c?c:Box.initInstance(unsafe.alloc(12,4))); 
             unsafe._mem_u8[(SELF + 52) >> 0] = 1; 
        }
		return Box.Init_mem(unsafe._mem_i32[(SELF + 48) >> 2], min, max);
	}
    /*Intersect(SELF, r:Ray):Hit {
        //Möller–Trumbore intersection algorithm
        let V1 = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
        let V2 = new Vector3().read(unsafe._mem_i32[(SELF + 12) >> 2]);
        let V3 = new Vector3().read(unsafe._mem_i32[(SELF + 16) >> 2]);

        //Edge1
        var e1:Vector3 = V2.sub(V1);

        //Edge2
        var e2:Vector3 = V3.sub(V1);

        //Begin calculating determinant - also used to calculate u parameter
        var p:Vector3 = r.direction.cross(e2);
        var det:number = e1.dot(p);
        //NOT CULLING
        if (det > -EPS && det < EPS) {
            return Hit.NoHit;
        }
        var inv:number = 1 / det;

        //calculate distance from V1 to ray origin
        var t:Vector3 = r.origin.sub(V1);

        //Calculate u parameter and test bound
        var u:number = t.dot(p) * inv;
        //The intersection lies outside of the triangle
        if (u < 0 || u > 1) {
            return Hit.NoHit;
        }

        //Prepare to test v parameter
        var q:Vector3 = t.cross(e1);

        //Calculate V parameter and test bound
        var v:number = r.direction.dot(q) * inv;
        //The intersection lies outside of the triangle
        if (v < 0 || u + v > 1) {
            return Hit.NoHit;
        }

        var d:number = e2.dot(q) * inv;
        if (d < EPS) {
            return Hit.NoHit
        }

        //ray intersection
        return new Hit(SELF, d);
    }*/
    static Intersect_impl(SELF, r:Ray):Hit {

		let e1x = unsafe._mem_f64[((unsafe._mem_i32[(SELF + 12) >> 2]) + 8) >> 3] - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 8) >> 3];
        let e1y = unsafe._mem_f64[((unsafe._mem_i32[(SELF + 12) >> 2]) + 16) >> 3] - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 16) >> 3];
        let e1z = unsafe._mem_f64[((unsafe._mem_i32[(SELF + 12) >> 2]) + 24) >> 3] - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 24) >> 3];
        let e2x = unsafe._mem_f64[((unsafe._mem_i32[(SELF + 16) >> 2]) + 8) >> 3] - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 8) >> 3];
        let e2y = unsafe._mem_f64[((unsafe._mem_i32[(SELF + 16) >> 2]) + 16) >> 3] - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 16) >> 3];
        let e2z = unsafe._mem_f64[((unsafe._mem_i32[(SELF + 16) >> 2]) + 24) >> 3] - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 24) >> 3];
        let px = r.direction.y * e2z - r.direction.z * e2y;
        let py = r.direction.z * e2x - r.direction.x * e2z;
        let pz = r.direction.x * e2y - r.direction.y * e2x;
		let det = e1x * px + e1y * py + e1z * pz;
		if (det > -EPS && det < EPS) {
			return Hit.NoHit;
		}
		let inv = 1 / det;
        let tx = r.origin.x - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 8) >> 3];
        let ty = r.origin.y - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 16) >> 3];
        let tz = r.origin.z - unsafe._mem_f64[((unsafe._mem_i32[(SELF + 8) >> 2]) + 24) >> 3];
        let u = (tx * px + ty * py + tz * pz) * inv;
		if (u < 0 || u > 1) {
			return Hit.NoHit;
		}
        let qx = ty * e1z - tz * e1y;
        let qy = tz * e1x - tx * e1z;
        let qz = tx * e1y - ty * e1x;
        let v = (r.direction.x * qx + r.direction.y * qy + r.direction.z * qz) * inv;
		if (v < 0 || u+v > 1) {
			return Hit.NoHit;
		}
        let d = (e2x*qx + e2y*qy + e2z*qz) * inv;
		if (d < EPS) {
			return Hit.NoHit;
		}
		return new Hit(SELF, d, null);
	}
    static UV_impl(SELF, p:Vector3):Vector3 {

        let T1:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 32) >> 2]);
        let T2:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 36) >> 2]);
        let T3:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 40) >> 2]);

        let uvw = Triangle.Barycentric(SELF, p);
        let n = new Vector3();
        n = n.add(T1.mulScalar(uvw.u));
        n = n.add(T2.mulScalar(uvw.v));
        n = n.add(T3.mulScalar(uvw.w));
        n.z = 0;
		return n
	}
    static MaterialAt_impl(SELF, p:Vector3):Vector3 {
		return unsafe._mem_i32[(SELF + 44) >> 2];
	}
    static NormalAt_impl(SELF, p:Vector3):Vector3 {

        let V1:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
        let V2:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 12) >> 2]);
        let V3:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 16) >> 2]);

        let n1:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 20) >> 2]);
        let n2:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 24) >> 2]);
        let n3:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 28) >> 2]);

        let T1:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 32) >> 2]);
        let T2:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 36) >> 2]);
        let T3:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 40) >> 2]);

		let uvw = Triangle.Barycentric(SELF, p);
		let n = new Vector3();
        n = n.add(n1.mulScalar(uvw.u));
        n = n.add(n2.mulScalar(uvw.v));
        n = n.add(n3.mulScalar(uvw.w));

		if (unsafe._mem_i32[((unsafe._mem_i32[(SELF + 44) >> 2]) + 12) >> 2]) {
			let b = new Vector3();
            b = b.add(T1.mulScalar(uvw.u));
            b = b.add(T2.mulScalar(uvw.v));
            b = b.add(T3.mulScalar(uvw.w));
			let ns:Vector3 = Texture.NormalSample(unsafe._mem_i32[((unsafe._mem_i32[(SELF + 44) >> 2]) + 12) >> 2], b.x, b.y);
			let dv1 = V2.sub(V1);
            let dv2 = V3.sub(V1);
            let dt1 = T2.sub(T1);
            let dt2 = T3.sub(T1);

			let T = dv1.mulScalar(dt2.y).sub(dv2.mulScalar(dt1.y)).normalize();
			let b = dv2.mulScalar(dt1.x).sub(dv1.mulScalar(dt2.x)).normalize();
            let N = T.cross(b);
			let matrix = new Matrix4(
					T.x, b.x, N.x, 0,
					T.y, b.y, N.y, 0,
					T.z, b.z, N.z, 0,
					0, 0, 0, 1);
			n = matrix.mulDirection(ns);
		}
		if (unsafe._mem_i32[((unsafe._mem_i32[(SELF + 44) >> 2]) + 16) >> 2]) {
			let b = new Vector3();
            b = b.add(T1.mulScalar(uvw.u));
            b = b.add(T2.mulScalar(uvw.v));
            b = b.add(T3.mulScalar(uvw.w));
			let bump = Texture.BumpSample(unsafe._mem_i32[((unsafe._mem_i32[(SELF + 44) >> 2]) + 16) >> 2], b.x, b.y);
            let dv1 = V2.sub(V1);
            let dv2 = V3.sub(V1);
            let dt1 = T2.sub(T1);
            let dt2 = T3.sub(T1);
			let tangent = dv1.mulScalar(dt2.y).sub(dv2.mulScalar(dt1.y)).normalize();
			let bitangent = dv2.mulScalar(dt1.x).sub(dv1.mulScalar(dt2.x)).normalize();
			n = n.add(tangent.mulScalar(bump.x * unsafe._mem_f64[((unsafe._mem_i32[(SELF + 44) >> 2]) + 24) >> 3]));
			n = n.add(bitangent.mulScalar(bump.y * unsafe._mem_f64[((unsafe._mem_i32[(SELF + 44) >> 2]) + 24) >> 3]));
		}
		n = n.normalize();
		return n;
	}

	static Area(SELF):number {
		let e1 = Vector.Sub_mem(unsafe._mem_i32[(SELF + 12) >> 2], unsafe._mem_i32[(SELF + 8) >> 2]);
		let e2 = Vector.Sub_mem(unsafe._mem_i32[(SELF + 16) >> 2], unsafe._mem_i32[(SELF + 8) >> 2]);
		let n = Vector.Cross_mem(e1, e2);
		return Vector.Length_mem(n) / 2;
	}

	static Barycentric(SELF, p:Vector3):{u:number, v:number, w:number} {
        let _V1:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 8) >> 2]);
        let _V2:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 12) >> 2]);
        let _V3:Vector3 = new Vector3().read(unsafe._mem_i32[(SELF + 16) >> 2]);

        let v0 = _V2.sub(_V1);
        let v1 = _V3.sub(_V1);
        let v2 = p.sub(_V1);

		let d00 = v0.dot(v0);
		let d01 = v0.dot(v1);
		let d11 = v1.dot(v1);
		let d20 = v2.dot(v0);
		let d21 = v2.dot(v1);
		let d = d00*d11 - d01*d01;
		let v = (d11*d20 - d01*d21) / d;
		let w = (d00*d21 - d01*d20) / d;
		let u = 1 - v - w;
		return {u:u,v:v,w:w};
	}

    static UpdateBox(SELF) {
        var min = Vector.Min_mem(Vector.Min_mem(unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 12) >> 2]), unsafe._mem_i32[(SELF + 16) >> 2]);
        var max = Vector.Max_mem(Vector.Max_mem(unsafe._mem_i32[(SELF + 8) >> 2], unsafe._mem_i32[(SELF + 12) >> 2]), unsafe._mem_i32[(SELF + 16) >> 2]);
         unsafe._mem_i32[(SELF + 48) >> 2] = (Box.initInstance(unsafe.alloc(12,4))); 
         unsafe._mem_u8[(SELF + 52) >> 0] = 1; 
        return Box.Init_mem(unsafe._mem_i32[(SELF + 48) >> 2], min, max);
    }

	static FixNormals(SELF) {
		let e1 = Vector.Sub_mem(unsafe._mem_i32[(SELF + 12) >> 2], unsafe._mem_i32[(SELF + 8) >> 2]);
		let e2 = Vector.Sub_mem(unsafe._mem_i32[(SELF + 16) >> 2], unsafe._mem_i32[(SELF + 8) >> 2]);
		let n = Vector.Normalize_mem(Vector.Cross_mem(e1, e2));

        if(Vector.IsZero(unsafe._mem_i32[(SELF + 20) >> 2])) {
            Vector.Copy(unsafe._mem_i32[(SELF + 20) >> 2], n);
        }
        if(Vector.IsZero(unsafe._mem_i32[(SELF + 24) >> 2])) {
            Vector.Copy(unsafe._mem_i32[(SELF + 24) >> 2], n);
        }
        if(Vector.IsZero(unsafe._mem_i32[(SELF + 28) >> 2])) {
            Vector.Copy(unsafe._mem_i32[(SELF + 28) >> 2], n);
        }
        free(e1);
        free(e2);
        free(n);
	}
    static Type(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 232773086:
                return Triangle.Type_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static ToJSON(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 232773086:
                return Triangle.ToJSON_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Compile(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 232773086:
                return Triangle.Compile_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static BoundingBox(SELF , c) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 232773086:
                return Triangle.BoundingBox_impl(SELF , c);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Intersect(SELF , r) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 232773086:
                return Triangle.Intersect_impl(SELF , r);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static UV(SELF , p) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 232773086:
                return Triangle.UV_impl(SELF , p);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static MaterialAt(SELF , p) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 232773086:
                return Triangle.MaterialAt_impl(SELF , p);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static NormalAt(SELF , p) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 232773086:
                return Triangle.NormalAt_impl(SELF , p);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=232773086; return SELF; }
}
unsafe._idToType[232773086] = Triangle;


export class Mesh extends Shape{
   static NAME:string = "Mesh";
   static SIZE:number = 24;
   static ALIGN:number = 4;
   static CLSID:number = 48819938;

   static get BASE():string{
       return Shape
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, triangles:number, material:number){
        console.log(`numTriangles:${unsafe._mem_i32[triangles >> 2]}`);
         unsafe._mem_i32[(SELF + 8) >> 2] = triangles; 
         unsafe._mem_i32[(SELF + 12) >> 2] = material; 
         unsafe._mem_i32[(SELF + 16) >> 2] = 0; 
         unsafe._mem_i32[(SELF + 20) >> 2] = 0; 
        return SELF;
	}
	static NewMesh(triangles:number, material:number):number{
		let ptr:number = Mesh.initInstance(unsafe.alloc(24,4));
		return Mesh.init(ptr, triangles, material);
	}

	static dirty(SELF) {
		 unsafe._mem_i32[(SELF + 16) >> 2] = null; 
		 unsafe._mem_i32[(SELF + 20) >> 2] = null; 
	}

	Copy(SELF):number {
		let numTriangles:number = unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2];
		let triangles = unsafe.alloc( 4 + ( 4 * numTriangles ), 4 ) /*Array*/;
        unsafe._mem_i32[triangles >> 2] = numTriangles;
		for (let i=0; i < numTriangles;i++) {
			let t = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
			let a = Triangle.initInstance(unsafe.alloc(53,4));
			Triangle.Copy(t, a);
			unsafe._mem_i32[(  triangles + 4 + (4 * i)  ) >> 2] = a;
		}
		return Mesh.NewMesh(triangles);
	}
    static Type_impl(SELF:number){
        return ShapeType.MESH;
    }
    static ToJSON_impl(SELF){
        return {
            numTriangles:unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2],
            box:Box.ToJSON(Mesh.BoundingBox(SELF)),
            tree:unsafe._mem_i32[(SELF + 20) >> 2]
        }
    }
    static Compile_impl(SELF) {
		if (!unsafe._mem_i32[(SELF + 20) >> 2]) {
			 unsafe._mem_i32[(SELF + 20) >> 2] = (Tree.NewTree(unsafe._mem_i32[(SELF + 8) >> 2])); 
		}
        return unsafe._mem_i32[(SELF + 20) >> 2];
	}

	static Add(SELF, mesh:Mesh) {
        //TODO: Implement
        Mesh.dirty(SELF);
	}
    static BoundingBox_impl(SELF):number {
		if (!unsafe._mem_i32[(SELF + 16) >> 2]) {

			let t = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * 0)  ) >> 2];
			let min = Vector.Clone(unsafe._mem_i32[(t + 8) >> 2]);
			let max = Vector.Clone(unsafe._mem_i32[(t + 8) >> 2]);
			let NumTriangles = unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2];
			for (let i=1;i < NumTriangles;i++) {
				t = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
				Vector.Min_mem(Vector.Min_mem(Vector.Min_mem(min, unsafe._mem_i32[(t + 8) >> 2], min), unsafe._mem_i32[(t + 12) >> 2], min), unsafe._mem_i32[(t + 16) >> 2], min);
				Vector.Max_mem(Vector.Max_mem(Vector.Max_mem(max, unsafe._mem_i32[(t + 8) >> 2], max), unsafe._mem_i32[(t + 12) >> 2], max), unsafe._mem_i32[(t + 16) >> 2], max);
			}
			let ptr:number = Box.initInstance(unsafe.alloc(12,4));
			 unsafe._mem_i32[(SELF + 16) >> 2] = (Box.Init_mem(ptr, min, max)); 
		}
		return unsafe._mem_i32[(SELF + 16) >> 2];
	}
    static Intersect_impl(SELF, r:number):Hit {
		return Tree.Intersect(unsafe._mem_i32[(SELF + 20) >> 2], r);
	}
    static UV_impl(SELF, p:number):number {
		return null; // not implemented
	}
    static MaterialAt_impl(SELF, p:number):number {
		return unsafe._mem_i32[(SELF + 12) >> 2]; // not implemented
	}
    static NormalAt_impl(SELF, p:number):number {
		return null; // not implemented
	}

	static _SmoothNormalsThreshold(SELF, normal:number, normals:number[], threshold:number):number {
		let result = Vector.NewVector();
		for (let i=0;i < normals.length; i++) {
            let x:number = normals[i];
			if (Vector.Dot_mem(x, normal) >= threshold) {
				Vector.Add_mem(result, x, result);
			}
		}
		return Vector.Normalize_mem(result);
	}

	static SmoothNormalsThreshold(SELF, radians:number) {
		let threshold:number = Math.cos(radians);
		let lookup:number[] = [];
		let NumTriangles = unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2];
		for (let i=0; i < NumTriangles; i++) {
            let t:number = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
			lookup[unsafe._mem_i32[(t + 8) >> 2]] = Utils.append(lookup[unsafe._mem_i32[(t + 8) >> 2]], unsafe._mem_i32[(t + 20) >> 2]);
			lookup[unsafe._mem_i32[(t + 12) >> 2]] = Utils.append(lookup[unsafe._mem_i32[(t + 12) >> 2]], unsafe._mem_i32[(t + 24) >> 2]);
			lookup[unsafe._mem_i32[(t + 16) >> 2]] = Utils.append(lookup[unsafe._mem_i32[(t + 16) >> 2]], unsafe._mem_i32[(t + 28) >> 2]);
		}
        for (let i=0; i < NumTriangles; i++) {
            let t:number = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
			unsafe._mem_i32[(t + 20) >> 2] = Mesh._SmoothNormalsThreshold(SELF, unsafe._mem_i32[(t + 20) >> 2], lookup[unsafe._mem_i32[(t + 8) >> 2]], threshold);
			unsafe._mem_i32[(t + 24) >> 2] = Mesh._SmoothNormalsThreshold(SELF, unsafe._mem_i32[(t + 24) >> 2], lookup[unsafe._mem_i32[(t + 12) >> 2]], threshold);
			unsafe._mem_i32[(t + 28) >> 2] = Mesh._SmoothNormalsThreshold(SELF, unsafe._mem_i32[(t + 28) >> 2], lookup[unsafe._mem_i32[(t + 16) >> 2]], threshold);
		}
	}

	static SmoothNormals(SELF) {
		let lookup:number[] = [];
		let NumTriangles = unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2];
        for (let i=0; i < NumTriangles; i++) {
            let t:number = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
			Vector.Add_mem(lookup[unsafe._mem_i32[(t + 8) >> 2]], unsafe._mem_i32[(t + 20) >> 2], lookup[unsafe._mem_i32[(t + 8) >> 2]]);
			Vector.Add_mem(lookup[unsafe._mem_i32[(t + 12) >> 2]], unsafe._mem_i32[(t + 24) >> 2], lookup[unsafe._mem_i32[(t + 12) >> 2]]);
			Vector.Add_mem(lookup[unsafe._mem_i32[(t + 16) >> 2]], unsafe._mem_i32[(t + 28) >> 2], lookup[unsafe._mem_i32[(t + 16) >> 2]]);
		}
		for (let i=0;i < lookup.length;i++) {
			 Vector.Normalize_mem(lookup[i], lookup[i]);
		}
        for (let i=0; i < NumTriangles; i++) {
            let t:number = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
            unsafe._mem_i32[(t + 20) >> 2] = lookup[unsafe._mem_i32[(t + 8) >> 2]];
			unsafe._mem_i32[(t + 24) >> 2] = lookup[unsafe._mem_i32[(t + 12) >> 2]];
			unsafe._mem_i32[(t + 28) >> 2] = lookup[unsafe._mem_i32[(t + 16) >> 2]];
		}
	}

	static UnitCube(SELF) {
		Mesh.FitInside(SELF, Box.NewBox(Vector.NewVector(), Vector.NewVector(1, 1, 1)), Vector.NewVector());
        Mesh.MoveTo(SELF, Vector.NewVector(), Vector.NewVector(0.5, 0.5, 0.5));
	}

	static MoveTo(SELF, position:number, anchor:number):number {
		let matrix = Matrix.TranslateUnitMatrix(Vector.Sub_mem(position, Box.Anchor_mem(Mesh.BoundingBox(SELF), anchor)) );
		return Matrix.Transform(SELF, matrix);
	}

	static FitInside(SELF, box:number, anchor:number) {
        let bsize:number = Box.Size_mem(box);
        let mbox:number = Mesh.BoundingBox(SELF);
        let mbsize:number = Box.Size_mem(mbox);
		let scale:number = Vector.MinComponent_mem(Vector.Div_mem(bsize, mbsize));
		let extra:number = Vector.MulScalar_mem(Vector.Sub_mem(bsize, mbsize), scale);
		let matrix:number = Matrix.Identity();
		Matrix.Translate(matrix, Vector.Negate_mem(unsafe._mem_i32[(mbox + 4) >> 2]), matrix);
		Matrix.Scale(matrix, Vector.NewVector(scale, scale, scale), matrix);
		Matrix.Translate(matrix, Vector.Add_mem(unsafe._mem_i32[(mbox + 4) >> 2], Vector.Mul_mem(extra, anchor)));
		Mesh.Transform(SELF, matrix);
	}

	static Transform(SELF, matrix:number) {
		let NumTriangles = unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2];
        for (let i=0; i < NumTriangles; i++) {
            let t:number = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
			unsafe._mem_i32[(t + 8) >> 2] = Matrix.MulPosition(matrix, unsafe._mem_i32[(t + 8) >> 2]);
			unsafe._mem_i32[(t + 12) >> 2] = Matrix.MulPosition(matrix, unsafe._mem_i32[(t + 12) >> 2]);
			unsafe._mem_i32[(t + 16) >> 2] = Matrix.MulPosition(matrix, unsafe._mem_i32[(t + 16) >> 2]);
			unsafe._mem_i32[(t + 20) >> 2] = Matrix.MulDirection(matrix, unsafe._mem_i32[(t + 20) >> 2]);
			unsafe._mem_i32[(t + 24) >> 2] = Matrix.MulDirection(matrix, unsafe._mem_i32[(t + 24) >> 2]);
			unsafe._mem_i32[(t + 28) >> 2] = Matrix.MulDirection(matrix, unsafe._mem_i32[(t + 28) >> 2]);
		}
		Mesh.dirty(SELF);
	}

	static SetMaterial(material:number) {
		let NumTriangles = unsafe._mem_i32[(unsafe._mem_i32[(SELF + 8) >> 2]) >> 2];
        for (let i=0; i < NumTriangles; i++) {
            let t:number = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
			unsafe._mem_i32[(t + 44) >> 2] = material;
		}
	}

	static SaveSTL(SELF, path:number):boolean {
		//return STL.SaveSTL(path, SELF)
        //TODO: Implement
	}
    static Type(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48819938:
                return Mesh.Type_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static ToJSON(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48819938:
                return Mesh.ToJSON_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Compile(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48819938:
                return Mesh.Compile_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static BoundingBox(SELF ) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48819938:
                return Mesh.BoundingBox_impl(SELF );
            default:
              throw unsafe._badType(SELF);
        }
    }
    static Intersect(SELF , r) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48819938:
                return Mesh.Intersect_impl(SELF , r);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static UV(SELF , p) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48819938:
                return Mesh.UV_impl(SELF , p);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static MaterialAt(SELF , p) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48819938:
                return Mesh.MaterialAt_impl(SELF , p);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static NormalAt(SELF , p) {
        switch (unsafe._mem_i32[SELF>>2]) {
            case 48819938:
                return Mesh.NormalAt_impl(SELF , p);
            default:
              throw unsafe._badType(SELF);
        }
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=48819938; return SELF; }
}
unsafe._idToType[48819938] = Mesh;

export class Node extends MemoryObject{
   static NAME:string = "Node";
   static SIZE:number = 32;
   static ALIGN:number = 8;
   static CLSID:number = 20726;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, axis:number, point:number, shapes:number, numShapes:number, left:number, right:number):number{
         unsafe._mem_u8[(SELF + 4) >> 0] = axis; 
         unsafe._mem_f64[(SELF + 8) >> 3] = point; 
         unsafe._mem_i32[(SELF + 16) >> 2] = shapes; 
         unsafe._mem_i32[(SELF + 20) >> 2] = numShapes; 
         unsafe._mem_i32[(SELF + 24) >> 2] = left; 
         unsafe._mem_i32[(SELF + 28) >> 2] = right; 
        return SELF;
    }

    static NewNode(shapes:number, numShapes:number):number {
        let ptr:number = Node.initInstance(unsafe.alloc(32,8));
        return Node.init(ptr, Axis.AxisNone, 0, shapes, numShapes, null, null);
    }

    static ToJSON(SELF){
        return{
            axis:Axis[unsafe._mem_u8[(SELF + 4) >> 0]],
            point:unsafe._mem_f64[(SELF + 8) >> 3],
            numShapes:unsafe._mem_i32[(SELF + 20) >> 2],
            left:unsafe._mem_i32[(SELF + 24) >> 2],
            right:unsafe._mem_i32[(SELF + 28) >> 2]
        }
    }

    static Intersect(SELF, r:Ray, tmin:number, tmax:number):Hit {
        let tsplit:number;
        let leftFirst:boolean;

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

        let first:number;
        let second:number;

        if (leftFirst) {
            first = unsafe._mem_i32[(SELF + 24) >> 2];
            second = unsafe._mem_i32[(SELF + 28) >> 2];
        } else {
            first = unsafe._mem_i32[(SELF + 28) >> 2];
            second = unsafe._mem_i32[(SELF + 24) >> 2];
        }

        if (tsplit > tmax || tsplit <= 0) {
            return Node.Intersect(first, r, tmin, tmax);
        } else if (tsplit < tmin) {
            return Node.Intersect(second, r, tmin, tmax);
        } else {
            let h1 = Node.Intersect(first, r, tmin, tsplit);
            if (h1.T <= tsplit) {
                return h1;
            }
            let h2 = Node.Intersect(second, r, tsplit, Math.min(tmax, h1.T));
            if (h1.T <= h2.T) {
                return h1;
            } else {
                return h2;
            }
        }
    }

    static IntersectShapes(SELF, r:Ray):Hit{
        let hit = Hit.NoHit;
        for(let i=0;i < unsafe._mem_i32[(SELF + 20) >> 2];i++) {
            let shape:number  = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (4 * i)  ) >> 2];
            let h:Hit = Shape.Intersect(shape, r);
            if (h.T < hit.T) {
                hit = h;
            }
        }
        return hit;
    }

    static PartitionScore(SELF, axis:Axis, point:number):number {
        let left = 0;
        let right = 0;
        for(let i=0;i < unsafe._mem_i32[(SELF + 20) >> 2];i++) {
            let shape:number  = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (4 * i)  ) >> 2];
            let box = Shape.BoundingBox(shape);
            // let box = unsafe._mem_i32[(shape + 48) >> 2];
            let lr = Box.Partition(box, axis, point);
            if (lr.left) {
                left++
            }
            if (lr.right) {
                right++
            }
        }
        if (left >= right) {
            return left;
        } else {
            return right;
        }
    }

    static Partition(SELF, size:number, axis:Axis, point:number):{left:number, numLeft:number, right:number, numRight:number} {/*Shape[]*/
        let left = [];
        let right = [];
        for(let i=0;i < unsafe._mem_i32[(SELF + 20) >> 2];i++) {
            let shape:number  = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (4 * i)  ) >> 2];
            let box = Shape.BoundingBox(shape);
            let lr = Box.Partition(box, axis, point);
            if (lr.left) {
                left.push(shape);
            }
            if (lr.right) {
                right.push(shape);
            }
        }

        let left_ptr = unsafe.alloc( 4 + ( 4 * (left.length) ), 4 ) /*Array*/;
        unsafe._mem_i32[left_ptr >> 2] = (left.length);
        let right_ptr = unsafe.alloc( 4 + ( 4 * (right.length) ), 4 ) /*Array*/;
        unsafe._mem_i32[right_ptr >> 2] = (right.length);

        left.forEach((item, index) => {
           unsafe._mem_i32[(  (left_ptr) + 4 + (4 * index)  ) >> 2] = item;
        });

        right.forEach((item, index) => {
           unsafe._mem_i32[(  (right_ptr) + 4 + (4 * index)  ) >> 2] = item;
        });

        return {
            left:left_ptr, numLeft:left.length,
            right:right_ptr, numRight: right.length
        };
    }

    static Split(SELF, depth:number) {
        if ( unsafe._mem_i32[(SELF + 20) >> 2] < 8) {
            return;
        }

        let size:number = unsafe._mem_i32[(SELF + 20) >> 2] * 2;

        let _xs = new Float64Array(size);
        let _ys = new Float64Array(size);
        let _zs = new Float64Array(size);

        let count = 0;
        for(let i=0;i < unsafe._mem_i32[(SELF + 20) >> 2];i++) {
            let shape:number  = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 16) >> 2]) + 4 + (4 * i)  ) >> 2];
            // let box = Shape.BoundingBox(shape);
            let box = Triangle.BoundingBox(shape);

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

        let mx = Utils.Median(_xs);
        let my = Utils.Median(_ys);
        let mz = Utils.Median(_zs);
        let best = Math.round(unsafe._mem_i32[(SELF + 20) >> 2] * 0.85);
        let bestAxis = Axis.AxisNone;
        let bestPoint = 0.0;

        let sx = Node.PartitionScore(SELF, Axis.AxisX, mx);

        if (sx < best) {
            best = sx;
            bestAxis = Axis.AxisX;
            bestPoint = mx;
        }

        let sy = Node.PartitionScore(SELF, Axis.AxisY, my);
        if (sy < best) {
            best = sy;
            bestAxis = Axis.AxisY;
            bestPoint = my;
        }
        let sz = Node.PartitionScore(SELF, Axis.AxisZ, mz);
        if (sz < best) {
            best = sz;
            bestAxis = Axis.AxisZ;
            bestPoint = mz;
        }
        if (bestAxis == Axis.AxisNone) {
            return;
        }
        let lr = Node.Partition(SELF, best, bestAxis, bestPoint);
         unsafe._mem_u8[(SELF + 4) >> 0] = bestAxis; 
         unsafe._mem_f64[(SELF + 8) >> 3] = bestPoint; 
         unsafe._mem_i32[(SELF + 24) >> 2] = (Node.NewNode(lr.left, lr.numLeft)); 
         unsafe._mem_i32[(SELF + 28) >> 2] = (Node.NewNode(lr.right, lr.numRight)); 
        Node.Split(unsafe._mem_i32[(SELF + 24) >> 2], depth + 1);
        Node.Split(unsafe._mem_i32[(SELF + 28) >> 2], depth + 1);
         unsafe._mem_i32[(SELF + 16) >> 2] = 0;  // only needed at leaf nodes
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=20726; return SELF; }
}
unsafe._idToType[20726] = Node;

export class Tree extends MemoryObject{
   static NAME:string = "Tree";
   static SIZE:number = 12;
   static ALIGN:number = 4;
   static CLSID:number = 27694;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, box:number, root:number):number{
         unsafe._mem_i32[(SELF + 4) >> 2] = box; 
         unsafe._mem_i32[(SELF + 8) >> 2] = root; 
        return SELF;
    }

    static NewTree(shapes:number):number {
        let numShapes = unsafe._mem_i32[shapes >> 2];
        console.log(`Building k-d tree (${numShapes} shapes)... `);
        // console.time("Tree:BuildingBox");
        let box = Box.BoxForShapes(shapes, numShapes);
        // console.timeEnd("Tree:BuildingBox");
        let node = Node.NewNode(shapes, numShapes);
        // console.time("Node:Split");
        Node.Split(node, 0);
        // console.timeEnd("Node:Split");
        let ptr:number = Tree.initInstance(unsafe.alloc(12,4));
        return Tree.init(ptr, box, node);
    }

    static Intersect(tree:number, r:number):Hit {
        let hit = Box.Intersect(unsafe._mem_i32[(tree + 4) >> 2], r);
        if (hit.tmax < hit.tmin || hit.tmax <= 0) {
            return Hit.NoHit;
        }
        return Node.Intersect(unsafe._mem_i32[(tree + 8) >> 2], r, hit.tmin, hit.tmax);
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=27694; return SELF; }
}
unsafe._idToType[27694] = Tree;



export class Hit{

	static NoHit:Hit = new Hit(null, Number.POSITIVE_INFINITY, null);

	constructor(public Shape:number, public T:number, public HitInfo:HitInfo=null){

	}

	Ok():boolean{
		return this.T < Number.POSITIVE_INFINITY;
	}

	Info(r:Ray){
		if(this.HitInfo != null){
			return this.HitInfo;
		}

		let shape:number = this.Shape;
		let position:Vector3 = r.position(this.T);
		let normal:Vector3 = Shape.NormalAt(this.Shape, position);
		let material:number = Material.MaterialAt(shape, position);
		let inside:boolean = false;

		if(normal.dot(r.direction) > 0){
			normal = normal.negate();
			inside = true;
			switch (Shape.Type(shape)) {
				case ShapeType.Volume:
				case ShapeType.SDFShape:
					inside = false;
					break;
			}
		}

		let ray = new Ray(position, normal);
		return new HitInfo(shape, position, normal, ray, material, inside);
	}
}

export class HitInfo{

	constructor(public Shape:number,
				public Position:Vector3,
                public Normal:Vector3,
                public Ray:Ray,
                public Material:number,
                public Inside:boolean){

	}
}

export class Camera extends MemoryObject{
   static NAME:string = "Camera";
   static SIZE:number = 48;
   static ALIGN:number = 8;
   static CLSID:number = 1632962;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, p:number, u:number, v:number, w:number, m:number, focalDistance:number=0, apertureRadius:number=0){
         unsafe._mem_i32[(SELF + 4) >> 2] = p; 
         unsafe._mem_i32[(SELF + 8) >> 2] = u; 
         unsafe._mem_i32[(SELF + 12) >> 2] = v; 
         unsafe._mem_i32[(SELF + 16) >> 2] = w; 
         unsafe._mem_f64[(SELF + 24) >> 3] = m; 
         unsafe._mem_f64[(SELF + 32) >> 3] = focalDistance; 
         unsafe._mem_f64[(SELF + 40) >> 3] = apertureRadius; 
        return SELF;
    }

    static cache;

    static NewCamera(p:number, u?:number, v?:number, w?:number, m?:number, focalDistance?:number, apertureRadius?:number){
        let ptr:number = Camera.initInstance(unsafe.alloc(48,8));
        p = p?p:Vector.NewVector();
        u = u?u:Vector.NewVector();
        v = v?v:Vector.NewVector();
        w = w?w:Vector.NewVector();
        m = m?m:Vector.NewVector();
        return Camera.init(ptr, p, u, v, w, m, focalDistance, apertureRadius);
    }

    static ToJSON(SELF){
        return {
            p:Vector.XYZ(unsafe._mem_i32[(SELF + 4) >> 2]),
            u:Vector.XYZ(unsafe._mem_i32[(SELF + 8) >> 2]),
            v:Vector.XYZ(unsafe._mem_i32[(SELF + 12) >> 2]),
            w:Vector.XYZ(unsafe._mem_i32[(SELF + 16) >> 2]),
            m:unsafe._mem_f64[(SELF + 24) >> 3],
            focalDistance:unsafe._mem_f64[(SELF + 32) >> 3],
            apertureRadius:unsafe._mem_f64[(SELF + 40) >> 3]
        };
    }

    static SetFromJSON(SELF, data){
        Vector.SetFromJSON(unsafe._mem_i32[(SELF + 4) >> 2], data.p);
        Vector.SetFromJSON(unsafe._mem_i32[(SELF + 8) >> 2], data.u);
        Vector.SetFromJSON(unsafe._mem_i32[(SELF + 12) >> 2], data.v);
        Vector.SetFromJSON(unsafe._mem_i32[(SELF + 16) >> 2], data.w);

        if(typeof data.m === "number")
             unsafe._mem_f64[(SELF + 24) >> 3] = (data.m); 
        if(typeof data.focalDistance === "number")
             unsafe._mem_f64[(SELF + 32) >> 3] = (data.focalDistance); 
        if(typeof data.apertureRadius === "number")
             unsafe._mem_f64[(SELF + 40) >> 3] = (data.apertureRadius); 
    }

    static LookAt(eye, center, up, fovy:number, c?:number):number {
        c = c?c:Camera.initInstance(unsafe.alloc(48,8));
        Camera.init(c);
        unsafe._mem_i32[(c + 4) >> 2] = eye;
        let w:number = Vector.Normalize_mem(Vector.Sub_mem(center, eye));
        unsafe._mem_i32[(c + 16) >> 2] = w;
        let u:number = Vector.Normalize_mem(Vector.Cross_mem(up, w));
        unsafe._mem_i32[(c + 8) >> 2] = u;
        unsafe._mem_i32[(c + 12) >> 2] = Vector.Normalize_mem(Vector.Cross_mem(w, u));
        unsafe._mem_f64[(c + 24) >> 3] = 1 / Math.tan(fovy*Math.PI/360);
        return c;
    }

    static SetFocus(c:number, focalPoint:number, apertureRadius:number) {
        unsafe._mem_f64[(c + 32) >> 3] = Vector.Length_mem(Vector.Sub_mem(focalPoint, unsafe._mem_i32[(c + 4) >> 2]));
        unsafe._mem_f64[(c + 40) >> 3] = apertureRadius;
    }

    /* cached camera */
    /*static CastRay(c, x:number, y:number, w:number, h:number, u:number, v:number):number {

        if(!Camera.cache){
            Camera.cache = {
                apertureRadius: unsafe._mem_f64[(c + 40) >> 3],
                focalDistance: unsafe._mem_f64[(c + 32) >> 3],
                u: new Vector3().read(unsafe._mem_i32[(c + 8) >> 2]),
                v: new Vector3().read(unsafe._mem_i32[(c + 12) >> 2]),
                p: new Vector3().read(unsafe._mem_i32[(c + 4) >> 2]),
                w: new Vector3().read(unsafe._mem_i32[(c + 16) >> 2]),
                m: unsafe._mem_f64[(c + 24) >> 3]
            }
        }
        c = Camera.cache;

        let aspect = w / h;
        let px = ((x+u-0.5)/(w-1))*2 - 1;
        let py = ((y+v-0.5)/(h-1))*2 - 1;



        let d = new Vector3();
        d = d.add(c.u.mulScalar(-px * aspect));
        d = d.add(c.v.mulScalar(-py));
        d = d.add(c.w.mulScalar(c.m));
        d = d.normalize();
        let p = c.p.clone();
        if (c.apertureRadius > 0) {
            let focalPoint = c.p.add(d.mulScalar(c.focalDistance));
            let angle = Math.random() * 2 * Math.PI;
            let radius = Math.random() * c.apertureRadius;

            p = p.add(c.u.mulScalar(Math.cos(angle) * radius));
            p = p.add(c.v.mulScalar(Math.sin(angle) * radius));
            d = focalPoint.sub(p).normalize();
        }
        return new Ray(p, d);
    }*/

    static CastRay(c:number, x:number, y:number, w:number, h:number, u:number, v:number):number {
        let aspect = w / h;
        let px = ((x+u-0.5)/(w-1))*2 - 1;
        let py = ((y+v-0.5)/(h-1))*2 - 1;

        let cu:Vector3 = new Vector3().read(unsafe._mem_i32[(c + 8) >> 2]);
        let cv:Vector3 = new Vector3().read(unsafe._mem_i32[(c + 12) >> 2]);
        let cp:Vector3 = new Vector3().read(unsafe._mem_i32[(c + 4) >> 2]);
        let cw:Vector3 = new Vector3().read(unsafe._mem_i32[(c + 16) >> 2]);

        let d = new Vector3();
        d = d.add(cu.mulScalar(-px * aspect));
        d = d.add(cv.mulScalar(-py));
        d = d.add(cw.mulScalar(unsafe._mem_f64[(c + 24) >> 3]));
        d = d.normalize();

        if (unsafe._mem_f64[(c + 40) >> 3] > 0) {
            let focalPoint = cp.add(d.mulScalar(unsafe._mem_f64[(c + 32) >> 3]));
            let angle = Math.random() * 2 * Math.PI;
            let radius = Math.random() * unsafe._mem_f64[(c + 40) >> 3];

            cp = cp.add(cu.mulScalar(Math.cos(angle) * radius));
            cp = cp.add(cv.mulScalar(Math.sin(angle) * radius));
            d = focalPoint.sub(cp).normalize();
        }
        return new Ray(cp, d);
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=1632962; return SELF; }
}
unsafe._idToType[1632962] = Camera;

export class Scene extends MemoryObject{
   static NAME:string = "Scene";
   static SIZE:number = 48;
   static ALIGN:number = 8;
   static CLSID:number = 237222;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, color){
         unsafe._mem_i32[(SELF + 4) >> 2] = color; 
         unsafe._mem_i32[(SELF + 8) >> 2] = 0; 
         unsafe._mem_f64[(SELF + 16) >> 3] = 0; 
         unsafe._mem_i32[(SELF + 44) >> 2] = 0; 
		return SELF;
	}

    static NewScene(color:number){
        let ptr = Scene.initInstance(unsafe.alloc(48,8));
        return Scene.init(ptr, Color.HexColor(color));
    }

	static Compile(SELF) {
		for (let i=0; i < unsafe._mem_i32[(SELF + 28) >> 2];i++) {
			let shape = unsafe._mem_i32[(  (unsafe._mem_i32[(SELF + 24) >> 2]) + 4 + (4 * i)  ) >> 2];
			Shape.Compile(shape);
		}
		if (!unsafe._mem_i32[(SELF + 40) >> 2]) {
			 unsafe._mem_i32[(SELF + 40) >> 2] = (Tree.NewTree(unsafe._mem_i32[(SELF + 24) >> 2])); 
		}
		return unsafe._mem_i32[(SELF + 40) >> 2];
	}

	static RayCount(SELF):number {
		// return Atomics.load(turbo.Runtime._mem_int32, unsafe._mem_i32[(SELF + 44) >> 2]);
        return unsafe._mem_i32[(SELF + 44) >> 2];
	}

	static Intersect(SELF, r:number):Hit {
		// Atomics.add(turbo.Runtime._mem_int32, unsafe._mem_i32[(SELF + 44) >> 2], 1);
         unsafe._mem_i32[(SELF + 44) >> 2] = (unsafe._mem_i32[(SELF + 44) >> 2] + 1); 
		return Tree.Intersect(unsafe._mem_i32[(SELF + 40) >> 2], r);
	}

	static Sample(SELF, r:Ray, emission:boolean, samples:number, depth:number):Color3 {
        if (depth > this.MaxBounces) {
            return new Color3();
        }
        var hit = Scene.Intersect(SELF, r);
        if (!hit.Ok()) {
            return new Color3(0,0,0);
        }
        var info = hit.Info(r);
        var result:Color3 = new Color3();
        let material = info.Material
        let color:Color3 = Color.toColor3(unsafe._mem_i32[(material + 4) >> 2]);
        let tint = unsafe._mem_f64[(material + 56) >> 3];
        if (emission) {
            var emittance = unsafe._mem_f64[(material + 32) >> 3];
            if (emittance > 0) {
                let __f = unsafe._mem_f64[(material + 32) >> 3] * samples;
				let tmp = color.mulScalar(__f);
				result = result.add(tmp);
            }
        }
        var n:number = Math.round(Math.sqrt(samples));
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
                } else {
                    var direct = Scene.DirectLight(info.ray);
                    result = result.add(color.mul(direct.add(indirect)));
                }
            }
        }
        return result.divScalar(n * n);
    }

	static Shadow(SELF, r:Ray, light:Shape, max:number):boolean {
        var hit = Scene.Intersect(SELF, r);
        return hit.shape != light && hit.T < max;
    }

    static DirectLight(SELF, n:Ray):Color3 {
        let nLights = unsafe._mem_i32[(SELF + 36) >> 2] | 0;
        if (nLights == 0) {
            return new Color3();
        }
        var color = new Color3();
        var self = this;

        var i:number = 0;
        let lights = unsafe._mem_i32[(SELF + 32) >> 2];

        for (; i < nLights; i++) {
            let light = unsafe._mem_i32[(  lights + 4 + (4 * i)  ) >> 2];
            var p = Vector3.RandomUnitVector()
            var d = p.sub(n.origin);
            var lr = new Ray(n.origin, d.normalize());
            var diffuse = lr.direction.dot(n.direction);
            if (diffuse <= 0) {
                continue
            }
            var distance = d.length();
            if (Scene.Shadow(lr, light, distance)) {
                continue;
            }
            let material = Material.MaterialAt(light, p);
            //var emittance = material.emittance;
            //var attenuation = 1;//material.attenuation.compute(distance);
            //color = color.add(light.getColor(p).mulScalar(diffuse * emittance * attenuation));
            let m = unsafe._mem_f64[(material + 32) >> 3] * diffuse;
            color = color.add(Color.MulScalar2(unsafe._mem_i32[(material + 4) >> 2], m));
        }

        /*this.lights.forEach(function (light:Shape) {
         var p = light.getRandomPoint();
         var d = p.sub(n.origin);
         var lr = new Ray(n.origin, d.normalize());
         var diffuse = lr.direction.dot(n.direction);
         if (diffuse <= 0) {
         return
         }
         var distance = d.length();
         if (self.shadow(lr, light, distance)) {
         return;
         }
         var material = light.getMaterial(p);
         var emittance = material.emittance;
         var attenuation = material.attenuation.compute(distance);
         color = color.add(light.getColor(p).mulScalar(diffuse * emittance * attenuation));
         });*/

        return color.divScalar(this.lights.length);
    }
    static initInstance(SELF) { unsafe._mem_i32[SELF>>2]=237222; return SELF; }
}
unsafe._idToType[237222] = Scene;


export class MasterScene{

	color;
	shapes:IShape[];
	lights:IShape[];
	scenePtr:number;

	static defaultMaterial;

	constructor(color){
		this.color = color;
		this.scenePtr = Scene.NewScene(color);
        this.shapes = [];
        this.lights = [];

		// MasterScene.defaultMaterial = Material.GlossyMaterial(Color.HexColor(0xFF0000), 1.5, Utils.Radians(30));
        // MasterScene.defaultMaterial = Material.LightMaterial(Color.HexColor(0x00FF00), 5);
		//MasterScene.defaultMaterial = Material.DiffuseMaterial(Color.HexColor(0xFF0000));

	}
	setClearColor(color) {
		Color.HexColor(color, unsafe._mem_i32[((this.scenePtr) + 4) >> 2]);
    }
	Clear(){
		this.scenePtr = Scene.NewScene(this.color);
		unsafe._mem_i32[((this.scenePtr) + 40) >> 2] = 0;
        this.shapes = [];
        this.lights = [];
	}
    AddDebugScene(){
        let wall = Material.GlossyMaterial(Color.HexColor(0xFCFAE1), 1.5, Utils.Radians(10));
        this.Add(Cube.NewCube(Vector.NewVector(-10, -1, -10), Vector.NewVector(-2, 10, 10), wall));
        this.Add(Cube.NewCube(Vector.NewVector(-10, -1, -10), Vector.NewVector(10, 0, 10), wall));
    }
	AddDefaultLights() {
		let light = Material.LightMaterial(Color.WHITE, 50);
        this.Add(Sphere.NewSphere(Vector.NewVector(0, 8, 0), 0.5, light));
	}
	Add(shape) {
		this.shapes.push(shape);

		if (unsafe._mem_f64[((Shape.MaterialAt(shape, Vector.ZERO)) + 32) >> 3] > 0) {
			this.lights.push(shape);
		}
	}
	Commit(){
		unsafe._mem_i32[((this.scenePtr) + 28) >> 2] = this.shapes.length;
		let shapeList = unsafe.alloc( 4 + ( 4 * (this.shapes.length) ), 4 ) /*Array*/;
        unsafe._mem_i32[shapeList >> 2] = (this.shapes.length);
        unsafe._mem_i32[((this.scenePtr) + 24) >> 2] = shapeList;
		unsafe._mem_i32[((this.scenePtr) + 36) >> 2] = this.lights.length;
		let lightList = unsafe.alloc( 4 + ( 4 * (this.lights.length) ), 4 ) /*Array*/;
        unsafe._mem_i32[lightList >> 2] = (this.lights.length);
        unsafe._mem_i32[((this.scenePtr) + 32) >> 2] = lightList;

		this.shapes.forEach((shape, index) => {
            unsafe._mem_i32[(  shapeList + 4 + (4 * index)  ) >> 2] = shape;
		});

		this.lights.forEach((shape, index) => {
            unsafe._mem_i32[(  lightList + 4 + (4 * index)  ) >> 2] = shape;
		});

        // Scene.Compile(this.scenePtr);
	}
}

export class BufferGeometry {

    static defaultMaterial;

    constructor(){
    }

    static NewBufferGeometry(obj, scene:MasterScene){
        BufferGeometry.loadChildren(obj, scene);
    }

    static loadChildren(parent, scene) {
        var child;
        for (var i:number = 0; i < parent.children.length; i++) {
            child = parent.children[i];

            if (child.children.length > 0) {
                this.loadChildren(child, scene);
            }else{
                scene.Add(this.buildSceneObject(child));
            }
        }
    }

    static identityMatrix = new THREE.Matrix4().identity();

    static buildSceneObject(src) {

        /*switch (src.type) {
            case ThreeObjects.Mesh:
                var material = GIJSView.getMaterial(src.material);
                var shape:Shape = this.buildGeometry(src.geometry, material, src.smooth);

                var matrixWorld = src.matrixWorld;

                if (matrixWorld.equals(this.identityMatrix)) {
                    return shape;
                } else {
                    var mat:Matrix4 = Matrix4.fromTHREEJS(matrixWorld.elements);
                    return TransformedShape.newTransformedShape(shape, mat);
                }

            case ThreeObjects.PointLight:
                return this.getLight(src);

        }*/
        // return null;
        let color = src.material.color || {r:0,g:0,b:0};
        let mat = Material.DiffuseMaterial(Color.NewColor(color.r, color.g, color.b));
        return this.buildGeometry(src.geometry, mat, src.smooth);
    }

    static buildGeometry(geometry:THREE.BufferGeometry|any, material:number, smooth:boolean=false):number {

        if (geometry["_bufferGeometry"]) {
            geometry = geometry["_bufferGeometry"];
        }

        var triangles:number[] = [];

        if (!geometry.attributes) {

            var vertices = geometry.vertices;
            var faces = geometry.faces;
            if (vertices && faces) {
                for (var i = 0; i < faces.length; i++) {
                    var face = faces[i];
                    var t:number = Triangle.initInstance(unsafe.alloc(53,4));

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
            } else {
                return null;
            }

        } else {

            var positions:Float32Array = geometry.attributes["position"].array;
            if(geometry.attributes["uv"]){
                var uv:Float32Array = geometry.attributes["uv"].array;
            }

            var normals:Float32Array;
            if (geometry.attributes["normal"]) {
                normals = geometry.attributes["normal"].array;
            } else {
                normals = this.computeNormals(positions);
            }
            var triCount:number = 0;
            var indexAttribute = geometry.getIndex();

            if (indexAttribute) {

                var indices = indexAttribute.array;
                var uvIndex:number = 0;

                for (var i = 0; i < indices.length; i = i + 3) {

                    triCount++;

                    let a;
                    let b;
                    let c;

                    a = indices[i];
                    b = indices[i + 1];
                    c = indices[i + 2];

                    if (triCount % 2 !== 0) {
                        a = indices[i];
                        b = indices[i + 1];
                        c = indices[i + 2];
                    } else {
                        c = indices[i];
                        b = indices[i + 1];
                        a = indices[i + 2];
                    }

                    //[....,ax,ay,az, bx,by,bz, cx,xy,xz,....]
                    let ax = a * 3;
                    let ay = (a * 3) + 1;
                    let az = (a * 3) + 2;

                    let bx = b * 3;
                    let by = (b * 3) + 1;
                    let bz = (b * 3) + 2;

                    let cx = c * 3;
                    let cy = (c * 3) + 1;
                    let cz = (c * 3) + 2;

                    let au = a * 2;
                    let av = (a * 2) + 1;

                    let bu = b * 2;
                    let bv = (b * 2) + 1;

                    let cu = c * 2;
                    let cv = (c * 2) + 1;

                    let t = Triangle.initInstance(unsafe.alloc(53,4));
                    unsafe._mem_i32[(t + 44) >> 2] = material;
                    unsafe._mem_i32[(t + 8) >> 2] = Vector.NewVector(positions[ax], positions[ay], positions[az]);
                    unsafe._mem_i32[(t + 12) >> 2] = Vector.NewVector(positions[bx], positions[by], positions[bz]);
                    unsafe._mem_i32[(t + 16) >> 2] = Vector.NewVector(positions[cx], positions[cy], positions[cz]);

                    unsafe._mem_i32[(t + 20) >> 2] = Vector.NewVector(normals[ax], normals[ay], normals[az]);
                    unsafe._mem_i32[(t + 24) >> 2] = Vector.NewVector(normals[bx], normals[by], normals[bz]);
                    unsafe._mem_i32[(t + 28) >> 2] = Vector.NewVector(normals[cx], normals[cy], normals[cz]);

                    if(uv){
                        unsafe._mem_i32[(t + 32) >> 2] = Vector.NewVector(uv[au], uv[av], 0);
                        unsafe._mem_i32[(t + 36) >> 2] = Vector.NewVector(uv[bu], uv[bv], 0);
                        unsafe._mem_i32[(t + 40) >> 2] = Vector.NewVector(uv[cu], uv[cv], 0);
                    }

                    Triangle.FixNormals(t);
                    triangles.push(t);
                    uvIndex += 2;
                }

            } else {
                uvIndex = 0;
                for (let i = 0; i < positions.length; i = i + 9) {

                    // triCount++;
                    //
                    // let ax,ay,az;
                    // let bx,by,bz;
                    // let cx,cy,cz;
                    //
                    // let au,av;
                    // let bu,bv;
                    // let cu,cv;
                    //
                    // if (triCount % 2 !== 0) {
                    //     ax = i;
                    //     ay = i + 1;
                    //     az = i + 2;
                    //
                    //     bx = i + 3;
                    //     by = i + 4;
                    //     bz = i + 5;
                    //
                    //     cx = i + 6;
                    //     cy = i + 7;
                    //     cz = i + 8;
                    //
                    //     au = uvIndex;
                    //     av = uvIndex + 1;
                    //
                    //     bu = uvIndex + 2;
                    //     bv = uvIndex + 3;
                    //
                    //     cu = uvIndex + 4;
                    //     cv = uvIndex + 5;
                    // } else {
                    //     ax = i + 8;
                    //     ay = i + 7;
                    //     az = i + 6;
                    //
                    //     bx = i + 5;
                    //     by = i + 4;
                    //     bz = i + 3;
                    //
                    //     cx = i + 2;
                    //     cy = i + 1;
                    //     cz = i;
                    //
                    //     au = uvIndex + 5;
                    //     av = uvIndex + 4;
                    //
                    //     bu = uvIndex + 3;
                    //     bv = uvIndex + 2;
                    //
                    //     cu = uvIndex + 1;
                    //     cv = uvIndex;
                    // }
                    //
                    // //[....,ax,ay,az, bx,by,bz, cx,xy,xz,....]
                    //
                    //
                    // let t = Triangle.initInstance(unsafe.alloc(53,4));
                    // unsafe._mem_i32[(t + 44) >> 2] = material;
                    // unsafe._mem_i32[(t + 8) >> 2] = Vector.NewVector(positions[ax], positions[ay], positions[az]);
                    // unsafe._mem_i32[(t + 12) >> 2] = Vector.NewVector(positions[bx], positions[by], positions[bz]);
                    // unsafe._mem_i32[(t + 16) >> 2] = Vector.NewVector(positions[cx], positions[cy], positions[cz]);
                    //
                    // unsafe._mem_i32[(t + 20) >> 2] = Vector.NewVector(normals[ax], normals[ay], normals[az]);
                    // unsafe._mem_i32[(t + 24) >> 2] = Vector.NewVector(normals[bx], normals[by], normals[bz]);
                    // unsafe._mem_i32[(t + 28) >> 2] = Vector.NewVector(normals[cx], normals[cy], normals[cz]);
                    //
                    // if(uv){
                    //     unsafe._mem_i32[(t + 32) >> 2] = Vector.NewVector(uv[au], uv[av], 0);
                    //     unsafe._mem_i32[(t + 36) >> 2] = Vector.NewVector(uv[bu], uv[bv], 0);
                    //     unsafe._mem_i32[(t + 40) >> 2] = Vector.NewVector(uv[cu], uv[cv], 0);
                    // }

                    let t = Triangle.initInstance(unsafe.alloc(53,4));
                    unsafe._mem_i32[(t + 44) >> 2] = material;

                    unsafe._mem_i32[(t + 8) >> 2] = Vector.NewVector(positions[i], positions[i + 1], positions[i + 2]);
                    unsafe._mem_i32[(t + 12) >> 2] = Vector.NewVector(positions[i + 3], positions[i + 4], positions[i + 5]);
                    unsafe._mem_i32[(t + 16) >> 2] = Vector.NewVector(positions[i + 6], positions[i + 7], positions[i + 8]);

                    unsafe._mem_i32[(t + 20) >> 2] = Vector.NewVector(normals[i], normals[i + 1], normals[i + 2]);
                    unsafe._mem_i32[(t + 24) >> 2] = Vector.NewVector(normals[i + 3], normals[i + 4], normals[i + 5]);
                    unsafe._mem_i32[(t + 28) >> 2] = Vector.NewVector(normals[i + 6], normals[i + 7], normals[i + 8]);

                    if(uv){
                        unsafe._mem_i32[(t + 32) >> 2] = Vector.NewVector(uv[uvIndex], uv[uvIndex + 1], 0);
                        unsafe._mem_i32[(t + 36) >> 2] = Vector.NewVector(uv[uvIndex + 2], uv[uvIndex + 3], 0);
                        unsafe._mem_i32[(t + 40) >> 2] = Vector.NewVector(uv[uvIndex + 4], uv[uvIndex + 5], 0);
                    }

                    Triangle.FixNormals(t);
                    triangles.push(t);
                    uvIndex += 6;
                }
            }
        }

        let meshRef = Mesh.NewMesh(Triangle.Pack(triangles));
        // Mesh.SmoothNormals(meshRef);
        return meshRef;
        // if(smooth){
        //     mesh.smoothNormals();
        // }
        // return mesh;
    }

    static computeNormals(positions:Float32Array):Float32Array {
        return new Float32Array(positions.length);
    }

}

export enum LightMode{
    LightModeRandom,
    LightModeAll
}
export enum SpecularMode{
    SpecularModeNaive,
    SpecularModeFirst,
    SpecularModeAll
}

export enum BounceType{
    BounceTypeAny,
    BounceTypeDiffuse,
    BounceTypeSpecular
}

interface Sampler{
	Sample(scene:number, ray:Ray):Color3
}

export function NewSampler(firstHitSamples, maxBounces){
	return new DefaultSampler(firstHitSamples, maxBounces, true, true, LightMode.LightModeRandom, SpecularMode.SpecularModeNaive);
}

export function NewDirectSampler():DefaultSampler {
	return new DefaultSampler(1, 0, true, false, LightMode.LightModeAll, SpecularMode.SpecularModeAll);
}

export class Sampler {

    static Sample(sampler:DefaultSampler, scene:number, ray:Ray):Color3 {
        return sampler.sample(scene, ray, true, sampler.FirstHitSamples, 0)
    }
}
export class DefaultSampler {

    constructor(
        public FirstHitSamples:number,
        public MaxBounces:number,
        public DirectLighting:boolean,
        public SoftShadows:boolean,
        public LightMode:LightMode,
        public SpecularMode:SpecularMode) {

    }

    sample(scene:number, ray:Ray, emission:boolean, samples:number, depth:number):Color3 {
        if (depth > this.MaxBounces) {
            return new Color3();
        }
        let hit:Hit = Scene.Intersect(scene, ray);
        if (!hit.Ok()) {
            return this.sampleEnvironment(scene, ray);
        }
        let info = hit.Info(ray);
        let material = info.Material;
        let result:Color3 = new Color3();
        if (unsafe._mem_f64[(material + 32) >> 3] > 0) {
            if (this.DirectLighting && !emission) {
                return result;
            }
            let __f = unsafe._mem_f64[(material + 32) >> 3] * samples;
            let tmp = Color.MulScalar2(unsafe._mem_i32[(material + 4) >> 2], __f);
            result = result.add(tmp);
        }
        let n:number = Math.sqrt(samples);
        let ma:BounceType;
        let mb:BounceType;

        if (this.SpecularMode == SpecularMode.SpecularModeAll || (depth == 0 && this.SpecularMode == SpecularMode.SpecularModeFirst)) {
            ma = BounceType.BounceTypeDiffuse;
            mb = BounceType.BounceTypeSpecular;
        } else {
            ma = BounceType.BounceTypeAny;
            mb = BounceType.BounceTypeAny;
        }

        for (let u = 0; u < n; u++) {
            for (let v = 0; v < n; v++) {
                for (let mode = ma; mode <= mb; mode++) {
                    let fu = (u + Math.random()) / n;
                    let fv = (v + Math.random()) / n;
                    let bounce = ray.bounce(info, fu, fv, mode);
                    if (mode == BounceType.BounceTypeAny) {
                        bounce.coefficient = 1
                    }
                    if (bounce.coefficient > 0 && bounce.reflected) {
                        // specular
                        let indirect:Color3 = this.sample(scene, bounce.ray, bounce.reflected, 1, depth+1);
                        let xindirect:Color3 = Color.Mul2(unsafe._mem_i32[(material + 4) >> 2], indirect);
                        let tinted:Color3 = indirect.mix(xindirect, unsafe._mem_f64[(material + 56) >> 3]);
                        result = result.add(tinted.mulScalar(bounce.coefficient));
                    }
                    if (bounce.coefficient > 0 && !bounce.reflected) {
                        // diffuse
                        let indirect:Color3 = this.sample(scene, bounce.ray, bounce.reflected, 1, depth+1);
                        let direct:Color3 = new Color3();
                        if (this.DirectLighting) {
                            direct = this.sampleLights(scene, info.Ray);
                        }
                        result = result.add(Color.Mul2(unsafe._mem_i32[(material + 4) >> 2], direct.add(indirect)).mulScalar(bounce.coefficient));
                    }
                }
            }
        }
        return result.divScalar(n * n);
    }

    sampleEnvironment(scene:number, ray:Ray):Color3{
        if (unsafe._mem_i32[(scene + 8) >> 2]) {
            let d:Vector3 = ray.direction;
            let u:number = Math.atan2(d.z, d.x) + unsafe._mem_f64[(scene + 16) >> 3];
            let v:number = Math.atan2(d.y, new Vector3(d.x, 0, d.z).length());
            u = (u + Math.PI) / (2 * Math.PI);
            v = (v + Math.PI/2) / Math.PI;
            return Texture.Sample(unsafe._mem_i32[(scene + 8) >> 2], u, v);
        }
        return new Color3().read(unsafe._mem_i32[(scene + 4) >> 2]);
    }

    sampleLights(scene:number, n:Ray):Color3 {
        let nLights = unsafe._mem_i32[(scene + 36) >> 2];
        if (nLights == 0) {
            return new Color3();
        }

        let lights = unsafe._mem_i32[(scene + 32) >> 2];

        if (this.LightMode == LightMode.LightModeAll) {
            var result:Color3 =  new Color3();
            for (let i=0; i < nLights;i++) {
                let light = unsafe._mem_i32[(  lights + 4 + (4 * i)  ) >> 2];
                result.add(this.sampleLight(scene, n, light));
            }
            return result;
        } else {
            // pick a random light
            let rndLight:number = Math.round(Math.random() * (nLights - 1));
            let light = unsafe._mem_i32[(  (unsafe._mem_i32[(scene + 32) >> 2]) + 4 + (4 * rndLight)  ) >> 2];
            let lightColor = this.sampleLight(scene, n, light);
            return lightColor.mulScalar(nLights);
        }
    }

    sampleLight(scene:number, n:Ray, light:number):Color3 {
        // get bounding sphere center and radius
        var center:Vector3;
        var radius:number;

        switch(Shape.Type(light)){
            case ShapeType.SPHERE:
                radius = unsafe._mem_f64[(light + 16) >> 3];
                center = new Vector3().read(unsafe._mem_i32[(light + 8) >> 2]);
                break;

            default:
                // get bounding sphere from bounding box
                let box = Shape.BoundingBox(light);
                radius = Box.OuterRadius(box);
                center = Box.Center(box);
                break;
        }

        // get random point in disk
        let point:Vector3 = center.clone();
        if (this.SoftShadows) {

            let x;
            let y;

            while(true){

                x = Math.random() * 2 - 1;
                y = Math.random() * 2 - 1;

                if(x*x+y*y <= 1) {

                    let l = center.sub(n.origin).normalize();
                    let u = l.cross(Vector3.RandomUnitVector()).normalize();
                    let v = l.cross(u);
                    point = new Vector3();
                    point = point.add(u.mulScalar(x * radius));
                    point = point.add(v.mulScalar(y * radius));
                    point = point.add(center);
                    break;
                }

            }
        }

        // construct ray toward light point
        let ray = new Ray(n.origin, point.sub(n.origin).normalize());

        // get cosine term
        let diffuse = ray.direction.dot(n.direction);
        if (diffuse <= 0) {
            return new Color3();
        }

        // check for light visibility
        let hit = Scene.Intersect(scene, ray);

        if (!hit.Ok()) {
            return new Color3();
        }

        // get material properties from light
        let material = Material.MaterialAt(hit.Shape, point);
        let emittance = unsafe._mem_f64[(material + 32) >> 3];

        if(emittance == 0){
            return new Color3();
        }

        // compute solid angle (hemisphere coverage)
        let hyp = center.sub(n.origin).length();
        let opp = radius;
        let theta = Math.asin(opp / hyp);
        let adj = opp / Math.tan(theta);
        let d = Math.cos(theta) * adj;
        let r = Math.sin(theta) * adj;
        let coverage = (r * r) / (d * d);

        // TODO: fix issue where hyp < opp (point inside sphere)
        if (hyp < opp) {
            coverage = 1
        }
        coverage = Math.min(coverage, 1);

        // combine factors
        let m = emittance * diffuse * coverage;
        return Color.MulScalar2(unsafe._mem_i32[(material + 4) >> 2], m);
    }

}


/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */

export class Vector3 {

    static SIMD = {
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

            var lvMult = SIMD.Float32x4.mul( lvTemp1, lvTemp2 ); // (y1*z2), (z1*x2), (x1*y2), (x1*x2)

            lvTemp1 = SIMD.Float32x4.shuffle( a, a, 2, 0, 1, 0 );
            lvTemp2 = SIMD.Float32x4.shuffle( b, b, 1, 2, 0, 0 );

            var lvMult2 = SIMD.Float32x4.mul( lvTemp1, lvTemp2 ); // (z1*y2), (x1*z2), (y1*x2), (x1*x2)

            return SIMD.Float32x4.sub(lvMult, lvMult2);

            /*var result = SIMD.Float32x4.sub(
                SIMD.Float32x4.mul(b, SIMD.Float32x4.shuffle(a, a, 3, 0, 2, 1)),
                SIMD.Float32x4.mul(a, SIMD.Float32x4.shuffle(b, b, 3, 0, 2, 1))
            );
            return SIMD.Float32x4.shuffle(result, result, 3, 0, 2, 1);*/
        }
    };

    constructor(public x:number = 0, public y:number = 0, public z:number = 0) {
    }

    read(memory:number):Vector3 {
        this.x = unsafe._mem_f64[(memory + 8) >> 3];
        this.y = unsafe._mem_f64[(memory + 16) >> 3];
        this.z = unsafe._mem_f64[(memory + 24) >> 3];
        return this;
    }

    write(memory:number):number {
        unsafe._mem_f64[(memory + 8) >> 3] = this.x;
        unsafe._mem_f64[(memory + 16) >> 3] = this.y;
        unsafe._mem_f64[(memory + 24) >> 3] = this.z;
        return memory;
    }

    static fromJson(v:Vector3):Vector3 {
        if (v) {
            return new Vector3(v.x, v.y, v.z);
        } else {
            return null;
        }
    }

    setFromArray(a, offset:number = 0) {
        this.x = a[offset];
        this.y = a[offset + 1];
        this.z = a[offset + 2];
    }

    setFromJson(a):void {
        this.x = a.x;
        this.y = a.y;
        this.z = a.z;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    dot(b:Vector3) {
        return this.x * b.x + this.y * b.y + this.z * b.z
    }

    // SIMD_dot(_b) {
    //     var _a = SIMD.Float32x4.load(this.data, 0);
    //     return Vector3.SIMD.dot(_a, _b);
    // }

    cross(b:Vector3):Vector3 {
        let x = this.y * b.z - this.z * b.y;
        let y = this.z * b.x - this.x * b.z;
        let z = this.x * b.y - this.y * b.x;
        return new Vector3(x, y, z);
    }

    // SIMD_cross(_b) {
    //     var _a = SIMD.Float32x4.load(this.data, 0);
    //     return Vector3.SIMD.cross(_a, _b);
    // }

    normalize():Vector3 {
        let d = this.length();
        return new Vector3(this.x / d, this.y / d, this.z / d);
    }

    add(b:Vector3):Vector3 {
        return new Vector3(this.x + b.x, this.y + b.y, this.z + b.z);
    }

    sub(b:Vector3):Vector3 {
        return new Vector3(this.x - b.x, this.y - b.y, this.z - b.z);
    }

    // SIMD_sub(_b) {
    //     var _a = SIMD.Float32x4.load(this.data, 0);
    //     return SIMD.Float32x4.sub(_a, _b);
    // }

    mul(b:Vector3):Vector3 {
        return new Vector3(this.x * b.x, this.y * b.y, this.z * b.z);
    }

    div(b:Vector3):Vector3 {
        return new Vector3(this.x / b.x, this.y / b.y, this.z / b.z);
    }

    mulScalar(b):Vector3 {
        return new Vector3(this.x * b, this.y * b, this.z * b);
    }

    divScalar(b):Vector3 {
        return new Vector3(this.x / b, this.y / b, this.z / b);
    }

    min(b:Vector3):Vector3 {
        return new Vector3(Math.min(this.x, b.x), Math.min(this.y, b.y), Math.min(this.z, b.z));
    }

    max(b:Vector3):Vector3 {
        return new Vector3(Math.max(this.x, b.x), Math.max(this.y, b.y), Math.max(this.z, b.z));
    }

    minAxis():Vector3 {
        let x = Math.abs(this.x);
        let y = Math.abs(this.y);
        let z = Math.abs(this.z);
        if (x <= y && x <= z) {
            return new Vector3(1, 0, 0);
        } else if (y <= x && y <= z) {
            return new Vector3(0, 1, 0);
        }
        return new Vector3(0, 0, 1);
    }

    minComponent() {
        return Math.min(Math.min(this.x, this.y), this.z);
    }

    maxComponent() {
        return Math.max(Math.max(this.x, this.y), this.z);
    }

    reflect(i:Vector3):Vector3 {
        return i.sub(this.mulScalar(2 * this.dot(i)))
    }

    refract(i:Vector3, n1, n2):Vector3 {
        let nr = n1 / n2;
        let cosI = -this.dot(i);
        let sinT2 = nr * nr * (1 - cosI * cosI);
        if (sinT2 > 1) {
            return new Vector3();
        }
        let cosT = Math.sqrt(1 - sinT2);
        return i.mulScalar(nr).add(this.mulScalar(nr * cosI - cosT));
    }

    reflectance(i:Vector3, n1, n2) {
        let nr = n1 / n2;
        let cosI = -this.dot(i);
        let sinT2 = nr * nr * (1 - cosI * cosI);
        if (sinT2 > 1) {
            return 1
        }
        let cosT = Math.sqrt(1 - sinT2);
        let rOrth = (n1 * cosI - n2 * cosT) / (n1 * cosI + n2 * cosT);
        let rPar = (n2 * cosI - n1 * cosT) / (n2 * cosI + n1 * cosT);
        return (rOrth * rOrth + rPar * rPar) / 2;
    }

    negate():Vector3{
        return new Vector3(-this.x,-this.y,-this.z);
    }

    toString():string {
        return "(" + this.x + "," + this.y + "," + this.z + ")";
    }

    equals(v:Vector3):Boolean {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    isZero():Boolean {
        return this.x == 0 && this.y == 0 && this.z == 0;
    }
    clone():Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }
    static RandomUnitVector():Vector3 {
        let x = Math.random() * 2 - 1;
        let y = Math.random() * 2 - 1;
        let z = Math.random() * 2 - 1;

        while(x*x+y*y+z*z > 1){
            x = Math.random() * 2 - 1;
            y = Math.random() * 2 - 1;
            z = Math.random() * 2 - 1;
        }
        return new Vector3(x, y, z);
    }
}

/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */

export interface RGBA {
    r:number,
    g:number,
    b:number,
    a:number
}
export class Color3 {

    constructor(public r:number = 0,
                public g:number = 0,
                public b:number = 0) {
    }

    read(memory:number):Color3 {
        this.r = unsafe._mem_f64[(memory + 8) >> 3];
        this.g = unsafe._mem_f64[(memory + 16) >> 3];
        this.b = unsafe._mem_f64[(memory + 24) >> 3];
        return this;
    }

    write(memory:number):number {
        unsafe._mem_f64[(memory + 8) >> 3] = this.r;
        unsafe._mem_f64[(memory + 16) >> 3] = this.g;
        unsafe._mem_f64[(memory + 24) >> 3] = this.b;
        return memory;
    }

    static fromJson(color:Color3):Color3 {
        if (color) {
            return new Color3(
                color.r,
                color.g,
                color.b
            );
        } else {
            return null;
        }
    }

    static hexColor(hex:number):Color3 {
        var red = ((hex >> 16) & 255 ) / 255;
        var green = ((hex >> 8) & 255) / 255;
        var blue = (hex & 255) / 255;
        return new Color3(red, green, blue).pow(2.2);
    }

    static newColor(c:RGBA):Color3 {
        return new Color3(c.r / 65535, c.g / 65535, c.b / 65535);
    }

    RGBA():RGBA {
        let a:Color3 = this;
        let _c:Uint8Array = new Uint8Array(3);
        _c[0] = Math.max(0, Math.min(255, a.r * 255));
        _c[1] = Math.max(0, Math.min(255, a.g * 255));
        _c[2] = Math.max(0, Math.min(255, a.b * 255));
        return {r: _c[0], g: _c[1], b: _c[2], a: 255};
    }

    isBlack():boolean {
        return this.r === 0 && this.g === 0 && this.b === 0;
    }

    isWhite():boolean {
        return this.r === 1 && this.g === 1 && this.b === 1;
    }

    add(b:Color3):Color3 {
        return new Color3(this.r + b.r, this.g + b.g, this.b + b.b);
    }

    sub(b:Color3):Color3 {
        return new Color3(this.r - b.r, this.g - b.g, this.b - b.b);
    }

    mul(b:Color3):Color3 {
        return new Color3(this.r * b.r, this.g * b.g, this.b * b.b);
    }

    mulScalar(b:number):Color3 {
        return new Color3(this.r * b, this.g * b, this.b * b)
    }

    divScalar(b:number):Color3 {
        return new Color3(this.r / b, this.g / b, this.b / b);
    }

    min(b:Color3):Color3 {
        return new Color3(Math.min(this.r, b.r), Math.min(this.g, b.g), Math.min(this.b, b.b));
    }

    max(b:Color3):Color3 {
        return new Color3(Math.max(this.r, b.r), Math.max(this.g, b.g), Math.max(this.b, b.b));
    }

    pow(b:number):Color3 {
        return new Color3(Math.pow(this.r, b), Math.pow(this.g, b), Math.pow(this.b, b));
    }

    mix(b:Color3, pct:number):Color3 {
        let a = this.mulScalar(1 - pct);
        b = b.mulScalar(pct);
        return a.add(b);
    }

    set(r:number, g:number, b:number):Color3 {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    }

    clone():Color3 {
        return new Color3(
            this.r,
            this.g,
            this.b
        );
    }

    static brightColors = [
        Color3.hexColor(0xFF00FF),
        Color3.hexColor(0x84FF00),
        Color3.hexColor(0xFF0084),
        Color3.hexColor(0x00FFFF),
        Color3.hexColor(0x00FF84),
        Color3.hexColor(0xDD40FF),
        Color3.hexColor(0xFFFF00)
    ];

    static random():Color3 {
        return new Color3(Math.random(), Math.random(), Math.random());
    }

    static randomBrightColor():Color3 {
        var i:number = Math.round(Math.random() * Color3.brightColors.length);
        return Color3.brightColors[i];
    }
}


export class Matrix4{

    x00:float64
    x01:float64
    x02:float64
    x03:float64

    x10:float64
    x11:float64
    x12:float64
    x13:float64

    x20:float64
    x21:float64
    x22:float64
    x23:float64

    x30:float64
    x31:float64
    x32:float64
    x33:float64

    constructor(x00:number=0, x01:number=0, x02:number=0, x03:number=0,
                x10:number=0, x11:number=0, x12:number=0, x13:number=0,
                x20:number=0, x21:number=0, x22:number=0, x23:number=0,
                x30:number=0, x31:number=0, x32:number=0, x33:number=0) {
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

    static fromTHREEJS(e:number[]):Matrix4 {
        return new Matrix4(
            e[0], e[4], e[8], e[12],
            e[1], e[5], e[9], e[13],
            e[2], e[6], e[10], e[14],
            e[3], e[7], e[11], e[15]
        );
    }

    get DATA():number[] {
        return [
            this.x00, this.x01, this.x02, this.x03,
            this.x10, this.x11, this.x12, this.x13,
            this.x20, this.x21, this.x22, this.x23,
            this.x30, this.x31, this.x32, this.x33
        ]
    }

    static Identity():Matrix4 {
        return new Matrix4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }

    static IsEqual(a:number, b:number):boolean {
        return a.x00 == b.x00 && a.x01 == b.x01 && a.x02 == b.x02 && a.x03 == b.x03 &&
            a.x10 == b.x10 && a.x11 == b.x11 && a.x12 == b.x12 && a.x13 == b.x13 &&
            a.x20 == b.x20 && a.x21 == b.x21 && a.x22 == b.x22 && a.x23 == b.x23 &&
            a.x30 == b.x30 && a.x31 == b.x31 && a.x32 == b.x32 && a.x33 == b.x33;
    }

    isIdentity():boolean {
        return this.x00 == 1 && this.x01 == 0 && this.x02 == 0 && this.x03 == 0 &&
            this.x10 == 0 && this.x11 == 1 && this.x12 == 0 && this.x13 == 0 &&
            this.x20 == 0 && this.x21 == 0 && this.x22 == 1 && this.x23 == 0 &&
            this.x30 == 0 && this.x31 == 0 && this.x32 == 0 && this.x33 == 1;
    }

    static TranslateUnitMatrix4(v:Vector3):Matrix4{
        return new Matrix4(
            1, 0, 0, v.x,
            0, 1, 0, v.y,
            0, 0, 1, v.z,
            0, 0, 0, 1
        )
    }

    static ScaleUnitMatrix4(v:Vector3):Matrix4{
        return new Matrix4(
            v.x, 0, 0, 0,
            0, v.y, 0, 0,
            0, 0, v.z, 0,
            0, 0, 0, 1
        )
    }

    static RotateUnitMatrix4(v:Vector3, a:number, _c?:number):Matrix4{

        v = v.normalize();
        let s:number = Math.sin(a);
        let c:number = Math.cos(a);
        let m:number = 1 - c;

        return new Matrix4(
            m*v.x * v.x + c, m * v.x * v.y + v.z * s, m * v.z * v.x - v.y * s, 0,
            m*v.x * v.y - v.z * s, m*v.y * v.y + c, m*v.y * v.z + v.x * s, 0,
            m*v.z * v.x + v.y * s, m*v.y * v.z - v.x * s, m*v.z * v.z + c, 0,
            0, 0, 0, 1
        )
    }

    static FrustumUnitMatrix4(l:number, r:number, b:number, t:number, n:number, f:number, c?:number):Matrix4{

        let t1:number = 2 * n;
        let t2:number = r - l;
        let t3:number = t - b;
        let t4:number = f - n;

        return new Matrix4(
            t1 / t2, 0, (r + l) / t2, 0,
            0, t1 / t3, (t + b) / t3, 0,
            0, 0, (-f - n) / t4, (-t1 * f) / t4,
            0, 0, -1, 0
        )
    }

    static OrthographicUnitMatrix4(l:number, r:number, b:number, t:number, n:number, f:number, c?:number):Matrix4{

        return new Matrix4(
            2 / (r - l), 0, 0, -(r + l) / (r - l),
            0, 2 / (t - b), 0, -(t + b) / (t - b),
            0, 0, -2 / (f - n), -(f + n) / (f - n),
            0, 0, 0, 1
        )
    }

    static PerspectiveUnitMatrix4(fovy:number, aspect:number, near:number, far:number, c?:number):Matrix4 {
        let ymax:number = near * Math.tan(fovy * Math.PI/360);
        let xmax:number = ymax * aspect;
        return Matrix4.Frustum(-xmax, xmax, -ymax, ymax, near, far, c);
    }

    static LookAtMatrix4(eye:number, center:number, up:number, c?:number):Matrix4{
        up = up.normalize();
        let f:Vector3 = center.sub(eye).normalize();
        let s:Vector3 = f.cross(up).normalize();
        let u:Vector3 = s.cross(f);

        return new Matrix4(
            unsafe._mem_f64[(s + 8) >> 3], unsafe._mem_f64[(u + 8) >> 3], unsafe._mem_f64[(f + 8) >> 3], 0,
            unsafe._mem_f64[(s + 16) >> 3], unsafe._mem_f64[(u + 16) >> 3], unsafe._mem_f64[(f + 16) >> 3], 0,
            unsafe._mem_f64[(s + 24) >> 3], unsafe._mem_f64[(u + 24) >> 3], unsafe._mem_f64[(f + 24) >> 3], 0,
            0, 0, 0, 1
        ).Transpose().inverse().Translate(eye);
    }
    
    static Translate(m:number, v:Vector3, c?:number):Matrix4 {
        return Matrix4.Mul(m, Matrix4.TranslateUnitMatrix4(v), c);
    }

    static Scale(m:number, v:Vector3, c?:number):Matrix4{
        return Matrix4.Mul(m, Matrix4.ScaleUnitMatrix4(v), c);
    }

    static Rotate(m:number, v:Vector3, a:number, c?:number):Matrix4 {
        return Matrix4.Mul(m, Matrix4.RotateUnitMatrix4(v, a), c);
    }

    static Frustum(m:number, l:number, r:number, b:number, t:number, n:number, f:number, c?:number):Matrix4 {
        return Matrix4.Mul(m, Matrix4.FrustumUnitMatrix4(l, r, b, t, n, f, c), c);
    }

    static Orthographic(m:number, l:number, r:number, b:number, t:number, n:number, f:number, c?:number):Matrix4 {
        return Matrix4.Mul(m, Matrix4.OrthographicUnitMatrix4(l, r, b, t, n, f, c), c);
    }

    static Perspective(m:number, fovy:number, aspect:number, near:number, far:number, c?:number):Matrix4 {
        return Matrix4.Mul(m, Matrix4.PerspectiveUnitMatrix4(fovy, aspect, near, far, c), c);
    }

    mul(b:Matrix4):Matrix4{
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
    }

    mulPosition(b:Vector3):Matrix4 {
        let x:number = this.x00 * b.x + this.x01 * b.y + this.x02 * b.z + this.x03;
        let y:number = this.x10 * b.x + this.x11 * b.y + this.x12 * b.z + this.x13;
        let z:number = this.x20 * b.x + this.x21 * b.y + this.x22 * b.z + this.x23;
        return new Vector3(x, y, z);
    }

    mulDirection(b:Vector):Vector3 {
        let x:number = this.x00 * b.x + this.x01 * b.y + this.x02 * b.z;
        let y:number = this.x10 * b.x + this.x11 * b.y + this.x12 * b.z;
        let z:number = this.x20 * b.x + this.x21 * b.y + this.x22 * b.z;
        return new Vector3(x, y, z);
    }

    static MulRay(a:number, ray:Ray):Ray {
        throw "Not implemented";
        let origin:Vector3 = Matrix4.MulPosition_vec3(a, ray.origin);
        let direction:Vector3 = Matrix4.MulDirection_vec3(a, ray.direction);
        return new Ray(origin, direction);
    }

    static  MulBox(a:number, box:number, c?:number):Matrix4 {
        throw "Not implemented";
        let min:number = unsafe._mem_i32[(box + 4) >> 2];
        let max:number = unsafe._mem_i32[(box + 8) >> 2];
        // http://dev.theomader.com/transform-bounding-boxes/
        let r:Vector3 = new Vector3(this.x00, this.x10, this.x20);
        let u:Vector3 = new Vector3(this.x01, this.x11, this.x21);
        let b:Vector3 = new Vector3(this.x02, this.x12, this.x22);
        let t:Vector3 = new Vector3(this.x03, this.x13, this.x23);
        let xa:Vector3 = r.mulScalar(unsafe._mem_f64[(min + 8) >> 3]);
        let xb:Vector3 = r.mulScalar(unsafe._mem_f64[(max + 8) >> 3]);
        let ya:Vector3 = u.mulScalar(unsafe._mem_f64[(min + 16) >> 3]);
        let yb:Vector3 = u.mulScalar(unsafe._mem_f64[(max + 16) >> 3]);
        let za:Vector3 = b.mulScalar(unsafe._mem_f64[(min + 24) >> 3]);
        let zb:Vector3 = b.mulScalar(unsafe._mem_f64[(max + 24) >> 3]);
        xa = xa.min(xb);
        xb = xa.max(xb);
        ya = ya.min(yb);
        yb = ya.max(yb);
        za = za.min(zb);
        zb = za.max(zb);
        min = xa.add(ya).add(za).add(t);
        max = xb.add(yb).add(zb).add(t);
        let ptr = c?c:Box.initInstance(unsafe.alloc(12,4));
        return Box.Init_mem(ptr, min, max);
    }

    transpose():Matrix4 {
        return new Matrix4(
            this.x00, this.x10, this.x20, this.x30,
            this.x01, this.x11, this.x21, this.x31,
            this.x02, this.x12, this.x22, this.x32,
            this.x03, this.x13, this.x23, this.x33
        );
    }

    determinant():number {
        return (this.x00*this.x11*this.x22*this.x33 - this.x00*this.x11*this.x23*this.x32 +
        this.x00*this.x12*this.x23*this.x31 - this.x00*this.x12*this.x21*this.x33 +
        this.x00*this.x13*this.x21*this.x32 - this.x00*this.x13*this.x22*this.x31 -
        this.x01*this.x12*this.x23*this.x30 + this.x01*this.x12*this.x20*this.x33 -
        this.x01*this.x13*this.x20*this.x32 + this.x01*this.x13*this.x22*this.x30 -
        this.x01*this.x10*this.x22*this.x33 + this.x01*this.x10*this.x23*this.x32 +
        this.x02*this.x13*this.x20*this.x31 - this.x02*this.x13*this.x21*this.x30 +
        this.x02*this.x10*this.x21*this.x33 - this.x02*this.x10*this.x23*this.x31 +
        this.x02*this.x11*this.x23*this.x30 - this.x02*this.x11*this.x20*this.x33 -
        this.x03*this.x10*this.x21*this.x32 + this.x03*this.x10*this.x22*this.x31 -
        this.x03*this.x11*this.x22*this.x30 + this.x03*this.x11*this.x20*this.x32 -
        this.x03*this.x12*this.x20*this.x31 + this.x03*this.x12*this.x21*this.x30)
    }

    inverse():Matrix4 {
        let m:number = new Matrix4();
        let d:number = this.determinant();
        m.x00 = (this.x12*this.x23*this.x31 - this.x13*this.x22*this.x31 + this.x13*this.x21*this.x32 - this.x11*this.x23*this.x32 - this.x12*this.x21*this.x33 + this.x11*this.x22*this.x33) / d
        m.x01 = (this.x03*this.x22*this.x31 - this.x02*this.x23*this.x31 - this.x03*this.x21*this.x32 + this.x01*this.x23*this.x32 + this.x02*this.x21*this.x33 - this.x01*this.x22*this.x33) / d
        m.x02 = (this.x02*this.x13*this.x31 - this.x03*this.x12*this.x31 + this.x03*this.x11*this.x32 - this.x01*this.x13*this.x32 - this.x02*this.x11*this.x33 + this.x01*this.x12*this.x33) / d
        m.x03 = (this.x03*this.x12*this.x21 - this.x02*this.x13*this.x21 - this.x03*this.x11*this.x22 + this.x01*this.x13*this.x22 + this.x02*this.x11*this.x23 - this.x01*this.x12*this.x23) / d
        m.x10 = (this.x13*this.x22*this.x30 - this.x12*this.x23*this.x30 - this.x13*this.x20*this.x32 + this.x10*this.x23*this.x32 + this.x12*this.x20*this.x33 - this.x10*this.x22*this.x33) / d
        m.x11 = (this.x02*this.x23*this.x30 - this.x03*this.x22*this.x30 + this.x03*this.x20*this.x32 - this.x00*this.x23*this.x32 - this.x02*this.x20*this.x33 + this.x00*this.x22*this.x33) / d
        m.x12 = (this.x03*this.x12*this.x30 - this.x02*this.x13*this.x30 - this.x03*this.x10*this.x32 + this.x00*this.x13*this.x32 + this.x02*this.x10*this.x33 - this.x00*this.x12*this.x33) / d
        m.x13 = (this.x02*this.x13*this.x20 - this.x03*this.x12*this.x20 + this.x03*this.x10*this.x22 - this.x00*this.x13*this.x22 - this.x02*this.x10*this.x23 + this.x00*this.x12*this.x23) / d
        m.x20 = (this.x11*this.x23*this.x30 - this.x13*this.x21*this.x30 + this.x13*this.x20*this.x31 - this.x10*this.x23*this.x31 - this.x11*this.x20*this.x33 + this.x10*this.x21*this.x33) / d
        m.x21 = (this.x03*this.x21*this.x30 - this.x01*this.x23*this.x30 - this.x03*this.x20*this.x31 + this.x00*this.x23*this.x31 + this.x01*this.x20*this.x33 - this.x00*this.x21*this.x33) / d
        m.x22 = (this.x01*this.x13*this.x30 - this.x03*this.x11*this.x30 + this.x03*this.x10*this.x31 - this.x00*this.x13*this.x31 - this.x01*this.x10*this.x33 + this.x00*this.x11*this.x33) / d
        m.x23 = (this.x03*this.x11*this.x20 - this.x01*this.x13*this.x20 - this.x03*this.x10*this.x21 + this.x00*this.x13*this.x21 + this.x01*this.x10*this.x23 - this.x00*this.x11*this.x23) / d
        m.x30 = (this.x12*this.x21*this.x30 - this.x11*this.x22*this.x30 - this.x12*this.x20*this.x31 + this.x10*this.x22*this.x31 + this.x11*this.x20*this.x32 - this.x10*this.x21*this.x32) / d
        m.x31 = (this.x01*this.x22*this.x30 - this.x02*this.x21*this.x30 + this.x02*this.x20*this.x31 - this.x00*this.x22*this.x31 - this.x01*this.x20*this.x32 + this.x00*this.x21*this.x32) / d
        m.x32 = (this.x02*this.x11*this.x30 - this.x01*this.x12*this.x30 - this.x02*this.x10*this.x31 + this.x00*this.x12*this.x31 + this.x01*this.x10*this.x32 - this.x00*this.x11*this.x32) / d
        m.x33 = (this.x01*this.x12*this.x20 - this.x02*this.x11*this.x20 + this.x02*this.x10*this.x21 - this.x00*this.x12*this.x21 - this.x01*this.x10*this.x22 + this.x00*this.x11*this.x22) / d
        return m;
    }
}



}
