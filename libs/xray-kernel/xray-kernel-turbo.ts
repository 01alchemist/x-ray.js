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

namespace xray {
// Generated from C:\Users\nidin\workspace\x-ray-kernel\src\kernel\turbo\xray-kernel-turbo.tts by turbo.js 1.0.0; github.com/01alchemist/turbo.js

//Turbo module
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
    return {X: x, Y: y};
}
function xyz(x:number, y:number, z:number) {
    return {X: x, Y: y, Z: z};
}
function xyzw(x:number, y:number, z:number, w:number) {
    return {X: x, Y: y, Z: z, W: w};
}
function F3(a:number, b:number, c:number) {
    return {A: a, B: b, C: c};
}
function rgb(r:number, g:number, b:number) {
    return {R: r, G: g, B: b};
}
function ray(origin:number, direction:number) {
    return {Origin: origin, Direction: direction};
}
function free(ptr){
    turbo.Runtime.free(ptr);
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
    R:number,
    G:number,
    B:number,
    A:number
};
type RGB = {
    R:number,
    G:number,
    B:number
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

    static init(SELF:number, color = {R:0,G:0,B:0}):number {
		 turbo.Runtime._mem_float64[(SELF + 8) >> 3] = (color.R); 
		 turbo.Runtime._mem_float64[(SELF + 16) >> 3] = (color.G); 
		 turbo.Runtime._mem_float64[(SELF + 24) >> 3] = (color.B); 
		return SELF;
	}

    static Init_mem(SELF:number, R:number = 0,G:number = 0,B:number = 0):number {
		 turbo.Runtime._mem_float64[(SELF + 8) >> 3] = R; 
		 turbo.Runtime._mem_float64[(SELF + 16) >> 3] = G; 
		 turbo.Runtime._mem_float64[(SELF + 24) >> 3] = B; 
		return SELF;
	}

    static NewColor(color?,G:number = 0,B:number = 0):number {
        let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
        if(typeof color === "object"){
            return Color.init(ptr, color);
        }else{
            return Color.Init_mem(ptr, color, G, B);
        }
    }
    
	static HexColor(hex:number):number {
		let R = ((hex >> 16) & 255 ) / 255;
		let G = ((hex >> 8) & 255) / 255;
		let B = (hex & 255) / 255;
        let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
		return Color.Pow_mem(Color.Init_mem(ptr, R, G, B), 2.2);
	}

    static Kelvin(K:number):number {
        var red:number;
        var green:number;
        var blue:number;
        // red
        if(K >= 6600){
            var A = 351.97690566805693;
            var B = 0.114206453784165;
            var c = -40.25366309332127;
            var x = K/100 - 55;
            red = A + B*x + c*Math.log(x)
        } else {
            red = 255;
        }
        // green
        if(K >= 6600){
            A = 325.4494125711974;
            B = 0.07943456536662342;
            c = -28.0852963507957;
            x = K/100 - 50;
            green = A + B*x + c*Math.log(x)
        } else if (K >= 1000) {
            A = -155.25485562709179;
            B = -0.44596950469579133;
            c = 104.49216199393888;
            x = K/100 - 2;
            green = A + B*x + c*Math.log(x)
        } else {
            green = 0
        }
        // blue
        if (K >= 6600) {
            blue = 255
        } else if (K >= 2000) {
            A = -254.76935184120902;
            B = 0.8274096064007395;
            c = 115.67994401066147;
            x = K/100 - 10;
            blue = A + B*x + c*Math.log(x)
        } else {
            blue = 0
        }
        red = Math.min(1, red/255);
        green = Math.min(1, green/255);
        blue = Math.min(1, blue/255);
        let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
        return Color.Init_mem(ptr, red, green, blue);
    }

    static FloatRGBA(SELF:number):RGBA {
        return {
            R: turbo.Runtime._mem_float64[(SELF + 8) >> 3],
            G: turbo.Runtime._mem_float64[(SELF + 16) >> 3],
            B: turbo.Runtime._mem_float64[(SELF + 24) >> 3],
            A: 1.0
        };
    }

    static RGB(SELF:number):RGB {
        let _d:Uint8ClampedArray = new Uint8ClampedArray([
            turbo.Runtime._mem_float64[(SELF + 8) >> 3] * 255,
            turbo.Runtime._mem_float64[(SELF + 16) >> 3] * 255,
            turbo.Runtime._mem_float64[(SELF + 24) >> 3] * 255
        ]);
        return rgb(_d[0], _d[1], _d[2]);
    }

    static RGBA(SELF:number):RGBA {
        let _d:Uint8ClampedArray = new Uint8ClampedArray([
            turbo.Runtime._mem_float64[(SELF + 8) >> 3] * 255,
            turbo.Runtime._mem_float64[(SELF + 16) >> 3] * 255,
            turbo.Runtime._mem_float64[(SELF + 24) >> 3] * 255
        ]);
        return {
            R: _d[0],
            G: _d[1],
            B: _d[2],
            A: 255
        };
    }

    static RGBA64(SELF:number):RGBA {
        return {
            R: Math.round(Math.max(0, Math.min(65535, turbo.Runtime._mem_float64[(SELF + 8) >> 3] * 65535))),
            G: Math.round(Math.max(0, Math.min(65535, turbo.Runtime._mem_float64[(SELF + 16) >> 3] * 65535))),
            B: Math.round(Math.max(0, Math.min(65535, turbo.Runtime._mem_float64[(SELF + 24) >> 3] * 65535))),
            A: 65535
        };
    }
    
    static Add(A:RGBA, B:RGBA):RGB { return rgb(A.R + B.R, A.G + B.G, A.B + B.B); }

    /**
     *
     * @param A Color 1
     * @param B Color 2
     * @param C result Color
     * @returns {number}
     * @constructor
     */
    static Add_mem(A:number, B:number, C?:number):number {
        if(C){
            turbo.Runtime._mem_float64[(C + 8) >> 3] = turbo.Runtime._mem_float64[(A + 8) >> 3] + turbo.Runtime._mem_float64[(B + 8) >> 3];
            turbo.Runtime._mem_float64[(C + 16) >> 3] = turbo.Runtime._mem_float64[(A + 16) >> 3] + turbo.Runtime._mem_float64[(B + 16) >> 3];
            turbo.Runtime._mem_float64[(C + 24) >> 3] = turbo.Runtime._mem_float64[(A + 24) >> 3] + turbo.Runtime._mem_float64[(B + 24) >> 3];
            return C;
        }else{
            let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Color.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(A + 8) >> 3] + turbo.Runtime._mem_float64[(B + 8) >> 3],
                turbo.Runtime._mem_float64[(A + 16) >> 3] + turbo.Runtime._mem_float64[(B + 16) >> 3],
                turbo.Runtime._mem_float64[(A + 24) >> 3] + turbo.Runtime._mem_float64[(B + 24) >> 3]
            );
        }
    }

    static Sub(A:RGBA, B:RGBA):RGB { return rgb(A.R - B.R, A.G - B.G, A.B - B.B); }
    static Sub_mem(A:number, B:number, C?:number):number {
        if(C){
            turbo.Runtime._mem_float64[(C + 8) >> 3] = turbo.Runtime._mem_float64[(A + 8) >> 3] - turbo.Runtime._mem_float64[(B + 8) >> 3];
            turbo.Runtime._mem_float64[(C + 16) >> 3] = turbo.Runtime._mem_float64[(A + 16) >> 3] - turbo.Runtime._mem_float64[(B + 16) >> 3];
            turbo.Runtime._mem_float64[(C + 24) >> 3] = turbo.Runtime._mem_float64[(A + 24) >> 3] - turbo.Runtime._mem_float64[(B + 24) >> 3];
            return C;
        }else{
            let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Color.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(A + 8) >> 3] - turbo.Runtime._mem_float64[(B + 8) >> 3],
                turbo.Runtime._mem_float64[(A + 16) >> 3] - turbo.Runtime._mem_float64[(B + 16) >> 3],
                turbo.Runtime._mem_float64[(A + 24) >> 3] - turbo.Runtime._mem_float64[(B + 24) >> 3]
            );
        }
    }
    
    static Mul(A:RGBA, B:Color3):RGB { return rgb(A.R * B.R, A.G * B.G, A.B * B.B); }
    static Mul2(A:number, B:Color3):Color3 {
        return new Color3(
            turbo.Runtime._mem_float64[(A + 8) >> 3] * B.R,
            turbo.Runtime._mem_float64[(A + 16) >> 3] * B.G,
            turbo.Runtime._mem_float64[(A + 24) >> 3] * B.B
        );
    }
    static Mul_mem(A:number, B:number, C?:number):number {
        if(C){
            turbo.Runtime._mem_float64[(C + 8) >> 3] = turbo.Runtime._mem_float64[(A + 8) >> 3] * turbo.Runtime._mem_float64[(B + 8) >> 3];
            turbo.Runtime._mem_float64[(C + 16) >> 3] = turbo.Runtime._mem_float64[(A + 16) >> 3] * turbo.Runtime._mem_float64[(B + 16) >> 3];
            turbo.Runtime._mem_float64[(C + 24) >> 3] = turbo.Runtime._mem_float64[(A + 24) >> 3] * turbo.Runtime._mem_float64[(B + 24) >> 3];
            return C;
        }else{
            let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Color.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(A + 8) >> 3] * turbo.Runtime._mem_float64[(B + 8) >> 3],
                turbo.Runtime._mem_float64[(A + 16) >> 3] * turbo.Runtime._mem_float64[(B + 16) >> 3],
                turbo.Runtime._mem_float64[(A + 24) >> 3] * turbo.Runtime._mem_float64[(B + 24) >> 3]
            );
        }
    }

    static MulScalar(A:RGBA, f:number):RGB { return rgb(A.R * f, A.G * f, A.B * f); }
    static MulScalar2(A:number, f:number):Color3 {
        return new Color3(
            turbo.Runtime._mem_float64[(A + 8) >> 3] * f,
            turbo.Runtime._mem_float64[(A + 16) >> 3] * f,
            turbo.Runtime._mem_float64[(A + 24) >> 3] * f
        );
    }
    static MulScalar_mem(A:number, f:number, C?:number):number {
        if(C){
            turbo.Runtime._mem_float64[(C + 8) >> 3] = turbo.Runtime._mem_float64[(A + 8) >> 3] * f;
            turbo.Runtime._mem_float64[(C + 16) >> 3] = turbo.Runtime._mem_float64[(A + 16) >> 3] * f;
            turbo.Runtime._mem_float64[(C + 24) >> 3] = turbo.Runtime._mem_float64[(A + 24) >> 3] * f;
            return C;
        }else{
            let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Color.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(A + 8) >> 3] * f,
                turbo.Runtime._mem_float64[(A + 16) >> 3] * f,
                turbo.Runtime._mem_float64[(A + 24) >> 3] * f
            );
        }
    }

    static DivScalar(A:RGBA, f:number):RGB { return rgb(A.R / f, A.G / f, A.B / f); }
    static DivScalar_mem(A:number, f:number, C?:number):number {
        if(C){
            turbo.Runtime._mem_float64[(C + 8) >> 3] = turbo.Runtime._mem_float64[(A + 8) >> 3] / f;
            turbo.Runtime._mem_float64[(C + 16) >> 3] = turbo.Runtime._mem_float64[(A + 16) >> 3] / f;
            turbo.Runtime._mem_float64[(C + 24) >> 3] = turbo.Runtime._mem_float64[(A + 24) >> 3] / f;
            return C;
        }else{
            let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Color.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(A + 8) >> 3] / f,
                turbo.Runtime._mem_float64[(A + 16) >> 3] / f,
                turbo.Runtime._mem_float64[(A + 24) >> 3] / f
            );
        }
    }

    static Min(A:RGBA, B:RGBA):RGB { return rgb( Math.min(A.R , B.R), Math.min(A.G , B.G), Math.min(A.B , B.B) ); }
    static Min_mem(A:number, B:number, C?:number):number {
        if(C){
            turbo.Runtime._mem_float64[(C + 8) >> 3] = Math.min(turbo.Runtime._mem_float64[(A + 8) >> 3] , turbo.Runtime._mem_float64[(B + 8) >> 3]);
            turbo.Runtime._mem_float64[(C + 16) >> 3] = Math.min(turbo.Runtime._mem_float64[(A + 16) >> 3] , turbo.Runtime._mem_float64[(B + 16) >> 3]);
            turbo.Runtime._mem_float64[(C + 24) >> 3] = Math.min(turbo.Runtime._mem_float64[(A + 24) >> 3] , turbo.Runtime._mem_float64[(B + 24) >> 3]);
            return C;
        }else{
            let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Color.Init_mem(
                ptr,
                Math.min(turbo.Runtime._mem_float64[(A + 8) >> 3] , turbo.Runtime._mem_float64[(B + 8) >> 3]),
                Math.min(turbo.Runtime._mem_float64[(A + 16) >> 3] , turbo.Runtime._mem_float64[(B + 16) >> 3]),
                Math.min(turbo.Runtime._mem_float64[(A + 24) >> 3] , turbo.Runtime._mem_float64[(B + 24) >> 3])
            );
        }
    }

    static Max(A:RGBA, B:RGBA):RGB {return rgb( Math.max(A.R , B.R), Math.max(A.G , B.G), Math.max(A.B , B.B) );}
    static Max_mem(A:number, B:number, C?:number):number {
        if(C){
            turbo.Runtime._mem_float64[(C + 8) >> 3] = Math.max(turbo.Runtime._mem_float64[(A + 8) >> 3] , turbo.Runtime._mem_float64[(B + 8) >> 3]);
            turbo.Runtime._mem_float64[(C + 16) >> 3] = Math.max(turbo.Runtime._mem_float64[(A + 16) >> 3] , turbo.Runtime._mem_float64[(B + 16) >> 3]);
            turbo.Runtime._mem_float64[(C + 24) >> 3] = Math.max(turbo.Runtime._mem_float64[(A + 24) >> 3] , turbo.Runtime._mem_float64[(B + 24) >> 3]);
            return C;
        }else{
            let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Color.Init_mem(
                ptr,
                Math.max(turbo.Runtime._mem_float64[(A + 8) >> 3] , turbo.Runtime._mem_float64[(B + 8) >> 3]),
                Math.max(turbo.Runtime._mem_float64[(A + 16) >> 3] , turbo.Runtime._mem_float64[(B + 16) >> 3]),
                Math.max(turbo.Runtime._mem_float64[(A + 24) >> 3] , turbo.Runtime._mem_float64[(B + 24) >> 3])
            );
        }
    }

    static MinComponent(A:RGBA):number {return Math.min(Math.min(A.R, A.G), A.B)}
    static MinComponent_mem(A:number) {
        return Math.min( Math.min(turbo.Runtime._mem_float64[(A + 8) >> 3], turbo.Runtime._mem_float64[(A + 16) >> 3]), turbo.Runtime._mem_float64[(A + 24) >> 3] );
    }

    static MaxComponent(A:RGBA):number { return Math.max(Math.max(A.R, A.G), A.B) }
    static MaxComponent_mem(A:number):number {
        return Math.max( Math.max(turbo.Runtime._mem_float64[(A + 8) >> 3], turbo.Runtime._mem_float64[(A + 16) >> 3]), turbo.Runtime._mem_float64[(A + 24) >> 3] );
    }

    static Pow(A:RGBA, f:number):RGB {return rgb( Math.pow(A.R, f), Math.pow(A.G, f), Math.pow(A.B, f) );}
    static Pow_mem(A:number, f:number, C?:number):number {
        if(C){
            turbo.Runtime._mem_float64[(C + 8) >> 3] = Math.pow(turbo.Runtime._mem_float64[(A + 8) >> 3] , f);
            turbo.Runtime._mem_float64[(C + 16) >> 3] = Math.pow(turbo.Runtime._mem_float64[(A + 16) >> 3] , f);
            turbo.Runtime._mem_float64[(C + 24) >> 3] = Math.pow(turbo.Runtime._mem_float64[(A + 24) >> 3] , f);
            return C;
        }else{
            let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Color.Init_mem(
                ptr,
                Math.pow(turbo.Runtime._mem_float64[(A + 8) >> 3] , f),
                Math.pow(turbo.Runtime._mem_float64[(A + 16) >> 3] , f),
                Math.pow(turbo.Runtime._mem_float64[(A + 24) >> 3] , f)
            );
        }
    }

    static Mix(A:RGBA, B:RGBA, pct:number):RGB {
        let _a = Color.MulScalar(A, 1 - pct);
        let _b = Color.MulScalar(B, pct);
        return rgb(_a.R + _b.R, _a.G + _b.G, _a.B + _b.B);
    }
    static Mix_mem(A:number, B:number, pct:number, C?:number):number {

        let _a:number = Color.MulScalar_mem(A, 1 - pct);
        let _b:number = Color.MulScalar_mem(B, pct);

        if(C){
            turbo.Runtime._mem_float64[(C + 8) >> 3] = turbo.Runtime._mem_float64[((_a) + 8) >> 3] + turbo.Runtime._mem_float64[((_b) + 8) >> 3];
            turbo.Runtime._mem_float64[(C + 16) >> 3] = turbo.Runtime._mem_float64[((_a) + 16) >> 3] + turbo.Runtime._mem_float64[((_b) + 16) >> 3];
            turbo.Runtime._mem_float64[(C + 24) >> 3] = turbo.Runtime._mem_float64[((_a) + 24) >> 3] + turbo.Runtime._mem_float64[((_b) + 24) >> 3];
            return C;
        }else{
            let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Color.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[((_a) + 8) >> 3] + turbo.Runtime._mem_float64[((_b) + 8) >> 3],
                turbo.Runtime._mem_float64[((_a) + 16) >> 3] + turbo.Runtime._mem_float64[((_b) + 16) >> 3],
                turbo.Runtime._mem_float64[((_a) + 24) >> 3] + turbo.Runtime._mem_float64[((_b) + 24) >> 3]
            );
        }
    }

    static IsEqual(A:number, B:number):boolean{
        return turbo.Runtime._mem_float64[(A + 8) >> 3] === turbo.Runtime._mem_float64[(B + 8) >> 3] && turbo.Runtime._mem_float64[(A + 16) >> 3] === turbo.Runtime._mem_float64[(B + 16) >> 3] && turbo.Runtime._mem_float64[(A + 24) >> 3] === turbo.Runtime._mem_float64[(B + 24) >> 3];
    }

    static IsBlack(A:number):boolean{
        return Color.IsEqual(A, Color.BLACK);
    }

    static IsWhite(A:number):boolean{
        return Color.IsEqual(A, Color.WHITE);
    }
    static Set(SELF:number, R:number, G:number, B:number) {
         turbo.Runtime._mem_float64[(SELF + 8) >> 3] = R; 
         turbo.Runtime._mem_float64[(SELF + 16) >> 3] = G; 
         turbo.Runtime._mem_float64[(SELF + 24) >> 3] = B; 
        return SELF;
    }

    static Clone(SELF:number, c?:number):number {
        let ptr:number = c?c:Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
        return Color.Init_mem(ptr, turbo.Runtime._mem_float64[(SELF + 8) >> 3], turbo.Runtime._mem_float64[(SELF + 16) >> 3], turbo.Runtime._mem_float64[(SELF + 24) >> 3]);
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
        let ptr:number = Color.initInstance(turbo.Runtime.allocOrThrow(32,8));
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
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=194603; return SELF; }
}
turbo.Runtime._idToType[194603] = Color;



type XYZ = {
    X:number,
    Y:number,
    Z:number
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

    static init(SELF:number, vector = {X:0,Y:0,Z:0}):number {
		 turbo.Runtime._mem_float64[(SELF + 8) >> 3] = (vector.X); 
		 turbo.Runtime._mem_float64[(SELF + 16) >> 3] = (vector.Y); 
		 turbo.Runtime._mem_float64[(SELF + 24) >> 3] = (vector.Z); 
		return SELF;
	}

    static Init_mem(SELF:number, X:number = 0,Y:number = 0,Z:number = 0):number {
		 turbo.Runtime._mem_float64[(SELF + 8) >> 3] = X; 
		 turbo.Runtime._mem_float64[(SELF + 16) >> 3] = Y; 
		 turbo.Runtime._mem_float64[(SELF + 24) >> 3] = Z; 
		return SELF;
	}

    static NewVector(vector?,Y:number=0,Z:number=0):number {
        let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
        if(typeof vector === "object"){
            return Vector.init(ptr, vector);
        }else{
            return Vector.Init_mem(ptr, vector, Y, Z);
        }
    }

    static ToJSON(SELF){
        return {
            X:turbo.Runtime._mem_float64[(SELF + 8) >> 3],
            Y:turbo.Runtime._mem_float64[(SELF + 16) >> 3],
            Z:turbo.Runtime._mem_float64[(SELF + 24) >> 3]
        };
    }

    static XYZ(a:number):XYZ {
        return xyz(turbo.Runtime._mem_float64[(a + 8) >> 3], turbo.Runtime._mem_float64[(a + 16) >> 3], turbo.Runtime._mem_float64[(a + 24) >> 3]);
    }

    static RandomUnitVector():number {
        let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));

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
        return Math.sqrt((a.X * a.X) + (a.Y * a.Y) + (a.Z * a.Z));
    }

    static Length_mem(a:number):number {
        return Math.sqrt(turbo.Runtime._mem_float64[(a + 8) >> 3] * turbo.Runtime._mem_float64[(a + 8) >> 3] + turbo.Runtime._mem_float64[(a + 16) >> 3] * turbo.Runtime._mem_float64[(a + 16) >> 3] + turbo.Runtime._mem_float64[(a + 24) >> 3] * turbo.Runtime._mem_float64[(a + 24) >> 3]);
    }

    static LengthN(a:XYZ, n:number):number {
        if (n == 2) {
            return Vector.Length(a);
        }
        a = Vector.Abs(a);
        return Math.pow(
            Math.pow(a.X, n) + Math.pow(a.Y, n) + Math.pow(a.Z, n),
            1/n
        );
    }

    static LengthN_mem(a:number, n:number):number {
        if (n == 2) {
            return Vector.Length_mem(a);
        }
        a = Vector.Abs_mem(a);
        return Math.pow(
            Math.pow(turbo.Runtime._mem_float64[(a + 8) >> 3], n) + Math.pow(turbo.Runtime._mem_float64[(a + 16) >> 3], n) + Math.pow(turbo.Runtime._mem_float64[(a + 24) >> 3], n),
            1/n
        );
    }

    static Dot(a:XYZ, B:XYZ):number {
        return (a.X * B.X) + (a.Y * B.Y) + (a.Z * B.Z);
    }

    static Dot_mem(a:number, B:number):number {
        return (turbo.Runtime._mem_float64[(a + 8) >> 3] * turbo.Runtime._mem_float64[(B + 8) >> 3]) + (turbo.Runtime._mem_float64[(a + 16) >> 3] * turbo.Runtime._mem_float64[(B + 16) >> 3]) + (turbo.Runtime._mem_float64[(a + 24) >> 3] * turbo.Runtime._mem_float64[(B + 24) >> 3]);
    }

    static Cross(a:XYZ, B:XYZ):XYZ {
        let x:number = (a.Y * B.Z) - (a.Z * B.Y);
        let y:number = (a.Z * B.X) - (a.X * B.Z);
        let z:number = (a.X * B.Y) - (a.Y * B.X);
        return xyz(x, y, z);
    }

    static Cross_mem(a:number, B:number, c?:number):number {
        let x:number = (turbo.Runtime._mem_float64[(a + 16) >> 3] * turbo.Runtime._mem_float64[(B + 24) >> 3]) - (turbo.Runtime._mem_float64[(a + 24) >> 3] * turbo.Runtime._mem_float64[(B + 16) >> 3]);
        let y:number = (turbo.Runtime._mem_float64[(a + 24) >> 3] * turbo.Runtime._mem_float64[(B + 8) >> 3]) - (turbo.Runtime._mem_float64[(a + 8) >> 3] * turbo.Runtime._mem_float64[(B + 24) >> 3]);
        let z:number = (turbo.Runtime._mem_float64[(a + 8) >> 3] * turbo.Runtime._mem_float64[(B + 16) >> 3]) - (turbo.Runtime._mem_float64[(a + 16) >> 3] * turbo.Runtime._mem_float64[(B + 8) >> 3]);

        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = x;
            turbo.Runtime._mem_float64[(c + 16) >> 3] = y;
            turbo.Runtime._mem_float64[(c + 24) >> 3] = z;
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(ptr, x, y, z);
        }
    }

    static Normalize(a:XYZ):XYZ {
        let d:number = Vector.Length(a);
        return xyz(a.X / d, a.Y / d, a.Z / d);
    }

    static Normalize_mem(a:number, c?:number):number {
        let d:number = Vector.Length_mem(a);
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] / d;
            turbo.Runtime._mem_float64[(c + 16) >> 3] = turbo.Runtime._mem_float64[(a + 16) >> 3] / d;
            turbo.Runtime._mem_float64[(c + 24) >> 3] = turbo.Runtime._mem_float64[(a + 24) >> 3] / d;
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(ptr, turbo.Runtime._mem_float64[(a + 8) >> 3] / d, turbo.Runtime._mem_float64[(a + 16) >> 3] / d, turbo.Runtime._mem_float64[(a + 24) >> 3] / d);
        }
    }

    static Negate(a:XYZ):XYZ {
        return xyz(-a.X, -a.Y, -a.Z);
    }

    static Negate_mem(a:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = -turbo.Runtime._mem_float64[(a + 8) >> 3];
            turbo.Runtime._mem_float64[(c + 16) >> 3] = -turbo.Runtime._mem_float64[(a + 16) >> 3];
            turbo.Runtime._mem_float64[(c + 24) >> 3] = -turbo.Runtime._mem_float64[(a + 24) >> 3];
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                -turbo.Runtime._mem_float64[(a + 8) >> 3],
                -turbo.Runtime._mem_float64[(a + 16) >> 3],
                -turbo.Runtime._mem_float64[(a + 24) >> 3]
            );
        }
    }

    static Abs(a:XYZ):XYZ {
        return xyz(Math.abs(a.X), Math.abs(a.Y), Math.abs(a.Z));
    }

    static Abs_mem(a:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = Math.abs(turbo.Runtime._mem_float64[(a + 8) >> 3]);
            turbo.Runtime._mem_float64[(c + 16) >> 3] = Math.abs(turbo.Runtime._mem_float64[(a + 16) >> 3]);
            turbo.Runtime._mem_float64[(c + 24) >> 3] = Math.abs(turbo.Runtime._mem_float64[(a + 24) >> 3]);
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                Math.abs(turbo.Runtime._mem_float64[(a + 8) >> 3]),
                Math.abs(turbo.Runtime._mem_float64[(a + 16) >> 3]),
                Math.abs(turbo.Runtime._mem_float64[(a + 24) >> 3])
            );
        }
    }
    static Add(a:XYZ, b:XYZ):XYZ { return xyz(a.X + b.X, a.Y + b.Y, a.Z + b.Z); }

    static Add_mem(a:number, b:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] + turbo.Runtime._mem_float64[(b + 8) >> 3];
            turbo.Runtime._mem_float64[(c + 16) >> 3] = turbo.Runtime._mem_float64[(a + 16) >> 3] + turbo.Runtime._mem_float64[(b + 16) >> 3];
            turbo.Runtime._mem_float64[(c + 24) >> 3] = turbo.Runtime._mem_float64[(a + 24) >> 3] + turbo.Runtime._mem_float64[(b + 24) >> 3];
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(a + 8) >> 3] + turbo.Runtime._mem_float64[(b + 8) >> 3],
                turbo.Runtime._mem_float64[(a + 16) >> 3] + turbo.Runtime._mem_float64[(b + 16) >> 3],
                turbo.Runtime._mem_float64[(a + 24) >> 3] + turbo.Runtime._mem_float64[(b + 24) >> 3]
            );
        }
    }

    static Sub_12(a:number, b:Vector3):Vector3 {
        return new Vector3(turbo.Runtime._mem_float64[(a + 8) >> 3] - b.x, turbo.Runtime._mem_float64[(a + 16) >> 3] - b.y, turbo.Runtime._mem_float64[(a + 24) >> 3] - b.z);
    }

    static Sub_21(a:number, b:Vector3):Vector3 {
        return new Vector3(a.x - turbo.Runtime._mem_float64[(b + 8) >> 3], a.y - turbo.Runtime._mem_float64[(b + 16) >> 3], a.z - turbo.Runtime._mem_float64[(b + 24) >> 3]);
    }
    static Sub_mem(a:number, b:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] - turbo.Runtime._mem_float64[(b + 8) >> 3];
            turbo.Runtime._mem_float64[(c + 16) >> 3] = turbo.Runtime._mem_float64[(a + 16) >> 3] - turbo.Runtime._mem_float64[(b + 16) >> 3];
            turbo.Runtime._mem_float64[(c + 24) >> 3] = turbo.Runtime._mem_float64[(a + 24) >> 3] - turbo.Runtime._mem_float64[(b + 24) >> 3];
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(a + 8) >> 3] - turbo.Runtime._mem_float64[(b + 8) >> 3],
                turbo.Runtime._mem_float64[(a + 16) >> 3] - turbo.Runtime._mem_float64[(b + 16) >> 3],
                turbo.Runtime._mem_float64[(a + 24) >> 3] - turbo.Runtime._mem_float64[(b + 24) >> 3]
            );
        }
    }
    static Sub_mem_2(a:number, b:number):Vector3 {
        return new Vector3(turbo.Runtime._mem_float64[(a + 8) >> 3] - turbo.Runtime._mem_float64[(b + 8) >> 3], turbo.Runtime._mem_float64[(a + 16) >> 3] - turbo.Runtime._mem_float64[(b + 16) >> 3], turbo.Runtime._mem_float64[(a + 24) >> 3] - turbo.Runtime._mem_float64[(b + 24) >> 3]);
    }

    static Mul(a:XYZ, b:XYZ):XYZ { return xyz(a.X * b.X, a.Y * b.Y, a.Z * b.Z); }
    static Mul_mem(a:number, b:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] * turbo.Runtime._mem_float64[(b + 8) >> 3];
            turbo.Runtime._mem_float64[(c + 16) >> 3] = turbo.Runtime._mem_float64[(a + 16) >> 3] * turbo.Runtime._mem_float64[(b + 16) >> 3];
            turbo.Runtime._mem_float64[(c + 24) >> 3] = turbo.Runtime._mem_float64[(a + 24) >> 3] * turbo.Runtime._mem_float64[(b + 24) >> 3];
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(a + 8) >> 3] * turbo.Runtime._mem_float64[(b + 8) >> 3],
                turbo.Runtime._mem_float64[(a + 16) >> 3] * turbo.Runtime._mem_float64[(b + 16) >> 3],
                turbo.Runtime._mem_float64[(a + 24) >> 3] * turbo.Runtime._mem_float64[(b + 24) >> 3]
            );
        }
    }

    static Div_12(a:number, b:Vector3):Vector3 {
        return new Vector3(turbo.Runtime._mem_float64[(a + 8) >> 3] / b.X, turbo.Runtime._mem_float64[(a + 16) >> 3] / b.Y, turbo.Runtime._mem_float64[(a + 24) >> 3] / b.Z);
    }

    static Div_mem(a:number, b:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] / turbo.Runtime._mem_float64[(b + 8) >> 3];
            turbo.Runtime._mem_float64[(c + 16) >> 3] = turbo.Runtime._mem_float64[(a + 16) >> 3] / turbo.Runtime._mem_float64[(b + 16) >> 3];
            turbo.Runtime._mem_float64[(c + 24) >> 3] = turbo.Runtime._mem_float64[(a + 24) >> 3] / turbo.Runtime._mem_float64[(b + 24) >> 3];
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(a + 8) >> 3] / turbo.Runtime._mem_float64[(b + 8) >> 3],
                turbo.Runtime._mem_float64[(a + 16) >> 3] / turbo.Runtime._mem_float64[(b + 16) >> 3],
                turbo.Runtime._mem_float64[(a + 24) >> 3] / turbo.Runtime._mem_float64[(b + 24) >> 3]
            );
        }
    }

    static Mod(a:XYZ, b:XYZ):XYZ {
        // as implemented in GLSL
        let x = a.X - b.X * Math.floor(a.X/b.X);
        let y = a.Y - b.Y * Math.floor(a.Y/b.Y);
        let z = a.Z - b.Z * Math.floor(a.Z/b.Z);
        return xyz(x, y, z);
    }

    static Mod_mem(a:number, b:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] - turbo.Runtime._mem_float64[(b + 8) >> 3] * Math.floor(turbo.Runtime._mem_float64[(a + 8) >> 3]/turbo.Runtime._mem_float64[(b + 8) >> 3]);
            turbo.Runtime._mem_float64[(c + 16) >> 3] = turbo.Runtime._mem_float64[(a + 16) >> 3] - turbo.Runtime._mem_float64[(b + 16) >> 3] * Math.floor(turbo.Runtime._mem_float64[(a + 16) >> 3]/turbo.Runtime._mem_float64[(b + 16) >> 3]);
            turbo.Runtime._mem_float64[(c + 24) >> 3] = turbo.Runtime._mem_float64[(a + 24) >> 3] - turbo.Runtime._mem_float64[(b + 24) >> 3] * Math.floor(turbo.Runtime._mem_float64[(a + 24) >> 3]/turbo.Runtime._mem_float64[(b + 24) >> 3]);
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(a + 8) >> 3] - turbo.Runtime._mem_float64[(b + 8) >> 3] * Math.floor(turbo.Runtime._mem_float64[(a + 8) >> 3]/turbo.Runtime._mem_float64[(b + 8) >> 3]),
                turbo.Runtime._mem_float64[(a + 16) >> 3] - turbo.Runtime._mem_float64[(b + 16) >> 3] * Math.floor(turbo.Runtime._mem_float64[(a + 16) >> 3]/turbo.Runtime._mem_float64[(b + 16) >> 3]),
                turbo.Runtime._mem_float64[(a + 24) >> 3] - turbo.Runtime._mem_float64[(b + 24) >> 3] * Math.floor(turbo.Runtime._mem_float64[(a + 24) >> 3]/turbo.Runtime._mem_float64[(b + 24) >> 3])
            );
        }
    }

    static AddScalar(a:XYZ, f:number):XYZ { return xyz(a.X + f, a.Y + f, a.Z + f); }

    static AddScalar_mem(a:number, f:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] + f;
            turbo.Runtime._mem_float64[(c + 16) >> 3] = turbo.Runtime._mem_float64[(a + 16) >> 3] + f;
            turbo.Runtime._mem_float64[(c + 24) >> 3] = turbo.Runtime._mem_float64[(a + 24) >> 3] + f;
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(a + 8) >> 3] + f,
                turbo.Runtime._mem_float64[(a + 16) >> 3] + f,
                turbo.Runtime._mem_float64[(a + 24) >> 3] + f
            );
        }
    }

    static SubScalar(a:XYZ, f:number):XYZ { return xyz(a.X - f, a.Y - f, a.Z - f); }

    static SubScalar_mem(a:number, f:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] - f;
            turbo.Runtime._mem_float64[(c + 16) >> 3] = turbo.Runtime._mem_float64[(a + 16) >> 3] - f;
            turbo.Runtime._mem_float64[(c + 24) >> 3] = turbo.Runtime._mem_float64[(a + 24) >> 3] - f;
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(a + 8) >> 3] - f,
                turbo.Runtime._mem_float64[(a + 16) >> 3] - f,
                turbo.Runtime._mem_float64[(a + 24) >> 3] - f
            );
        }
    }

    static MulScalar(a:XYZ, f:number):XYZ { return xyz(a.X * f, a.Y * f, a.Z * f); }
    static MulScalar_mem(a:number, f:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] * f;
            turbo.Runtime._mem_float64[(c + 16) >> 3] = turbo.Runtime._mem_float64[(a + 16) >> 3] * f;
            turbo.Runtime._mem_float64[(c + 24) >> 3] = turbo.Runtime._mem_float64[(a + 24) >> 3] * f;
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(a + 8) >> 3] * f,
                turbo.Runtime._mem_float64[(a + 16) >> 3] * f,
                turbo.Runtime._mem_float64[(a + 24) >> 3] * f
            );
        }
    }

    static DivScalar(a:XYZ, f:number):XYZ { return xyz(a.X / f, a.Y / f, a.Z / f); }
    static DivScalar_mem(a:number, f:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] / f;
            turbo.Runtime._mem_float64[(c + 16) >> 3] = turbo.Runtime._mem_float64[(a + 16) >> 3] / f;
            turbo.Runtime._mem_float64[(c + 24) >> 3] = turbo.Runtime._mem_float64[(a + 24) >> 3] / f;
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                turbo.Runtime._mem_float64[(a + 8) >> 3] / f,
                turbo.Runtime._mem_float64[(a + 16) >> 3] / f,
                turbo.Runtime._mem_float64[(a + 24) >> 3] / f
            );
        }
    }

    static Min(a:XYZ, b:XYZ):XYZ { return xyz( Math.min(a.X , b.X), Math.min(a.Y , b.Y), Math.min(a.Z , b.Z) ); }
    static Min_mem(a:number, b:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = Math.min(turbo.Runtime._mem_float64[(a + 8) >> 3] , turbo.Runtime._mem_float64[(b + 8) >> 3]);
            turbo.Runtime._mem_float64[(c + 16) >> 3] = Math.min(turbo.Runtime._mem_float64[(a + 16) >> 3] , turbo.Runtime._mem_float64[(b + 16) >> 3]);
            turbo.Runtime._mem_float64[(c + 24) >> 3] = Math.min(turbo.Runtime._mem_float64[(a + 24) >> 3] , turbo.Runtime._mem_float64[(b + 24) >> 3]);
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                Math.min(turbo.Runtime._mem_float64[(a + 8) >> 3] , turbo.Runtime._mem_float64[(b + 8) >> 3]),
                Math.min(turbo.Runtime._mem_float64[(a + 16) >> 3] , turbo.Runtime._mem_float64[(b + 16) >> 3]),
                Math.min(turbo.Runtime._mem_float64[(a + 24) >> 3] , turbo.Runtime._mem_float64[(b + 24) >> 3])
            );
        }
    }

    static Max(a:XYZ, b:XYZ):XYZ {return xyz( Math.max(a.X , b.X), Math.max(a.Y , b.Y), Math.max(a.Z , b.Z) );}
    static Max_mem(a:number, b:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = Math.max(turbo.Runtime._mem_float64[(a + 8) >> 3] , turbo.Runtime._mem_float64[(b + 8) >> 3]);
            turbo.Runtime._mem_float64[(c + 16) >> 3] = Math.max(turbo.Runtime._mem_float64[(a + 16) >> 3] , turbo.Runtime._mem_float64[(b + 16) >> 3]);
            turbo.Runtime._mem_float64[(c + 24) >> 3] = Math.max(turbo.Runtime._mem_float64[(a + 24) >> 3] , turbo.Runtime._mem_float64[(b + 24) >> 3]);
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                Math.max(turbo.Runtime._mem_float64[(a + 8) >> 3] , turbo.Runtime._mem_float64[(b + 8) >> 3]),
                Math.max(turbo.Runtime._mem_float64[(a + 16) >> 3] , turbo.Runtime._mem_float64[(b + 16) >> 3]),
                Math.max(turbo.Runtime._mem_float64[(a + 24) >> 3] , turbo.Runtime._mem_float64[(b + 24) >> 3])
            );
        }
    }

    static MinAxis(a:XYZ):XYZ {
        let x:number = Math.abs(a.X);
        let y:number = Math.abs(a.Y);
        let z:number = Math.abs(a.Z);

        if(x <= y && x <= z) {
            return xyz(1, 0, 0);
        }else if(y <= x && y <= z){
            return xyz(0, 1, 0);
        }
        return xyz(0, 0, 1);
    }

    static MinAxis_mem(a:number, c?:number):number {
        let x:number = Math.abs(turbo.Runtime._mem_float64[(a + 8) >> 3]);
        let y:number = Math.abs(turbo.Runtime._mem_float64[(a + 16) >> 3]);
        let z:number = Math.abs(turbo.Runtime._mem_float64[(a + 24) >> 3]);

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
            turbo.Runtime._mem_float64[(c + 8) >> 3] = x;
            turbo.Runtime._mem_float64[(c + 16) >> 3] = y;
            turbo.Runtime._mem_float64[(c + 24) >> 3] = z;
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(ptr, x,y,z);
        }
    }

    static MinComponent(a:XYZ):number {return Math.min(Math.min(a.X, a.Y), a.Z)}
    static MinComponent_mem(a:number) {
        return Math.min( Math.min(turbo.Runtime._mem_float64[(a + 8) >> 3], turbo.Runtime._mem_float64[(a + 16) >> 3]), turbo.Runtime._mem_float64[(a + 24) >> 3] );
    }

    static MaxComponent(a:XYZ):number { return Math.max(Math.max(a.X, a.Y), a.Z) }
    static MaxComponent_mem(a:number):number {
        return Math.max( Math.max(turbo.Runtime._mem_float64[(a + 8) >> 3], turbo.Runtime._mem_float64[(a + 16) >> 3]), turbo.Runtime._mem_float64[(a + 24) >> 3] );
    }

    static Reflect(a:XYZ, b:XYZ):XYZ {
        return Vector.Sub(b, Vector.MulScalar(a, 2 * Vector.Dot(a,b)));
    }

    static Reflect_mem(a:number, b:number, c?:number):number {
        c = c? c: Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
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
            return Vector.Init_mem(Vector.initInstance(turbo.Runtime.allocOrThrow(32,8)));
        }
        let cosT:number = Math.sqrt(1 - sinT2);
        c = c? c: Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
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
    // X X X X X X X X X X X X X X X X
    //--------------------------------


    static Pow(a:XYZ, f:number):XYZ {return xyz( Math.pow(a.X, f), Math.pow(a.Y, f), Math.pow(a.Z, f) );}
    static Pow_mem(a:number, f:number, c?:number):number {
        if(c){
            turbo.Runtime._mem_float64[(c + 8) >> 3] = Math.pow(turbo.Runtime._mem_float64[(a + 8) >> 3] , f);
            turbo.Runtime._mem_float64[(c + 16) >> 3] = Math.pow(turbo.Runtime._mem_float64[(a + 16) >> 3] , f);
            turbo.Runtime._mem_float64[(c + 24) >> 3] = Math.pow(turbo.Runtime._mem_float64[(a + 24) >> 3] , f);
            return c;
        }else{
            let ptr:number = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
            return Vector.Init_mem(
                ptr,
                Math.pow(turbo.Runtime._mem_float64[(a + 8) >> 3] , f),
                Math.pow(turbo.Runtime._mem_float64[(a + 16) >> 3] , f),
                Math.pow(turbo.Runtime._mem_float64[(a + 24) >> 3] , f)
            );
        }
    }

    static IsEqual(a:number, b:number):boolean{
        return turbo.Runtime._mem_float64[(a + 8) >> 3] === turbo.Runtime._mem_float64[(b + 8) >> 3] && turbo.Runtime._mem_float64[(a + 16) >> 3] === turbo.Runtime._mem_float64[(b + 16) >> 3] && turbo.Runtime._mem_float64[(a + 24) >> 3] === turbo.Runtime._mem_float64[(b + 24) >> 3];
    }

    static ZERO:number = Vector.NewVector({X:0,Y:0,Y:0});
    static ONE:number = Vector.NewVector({X:1,Y:1,Y:1});
    static NegativeONE:number = Vector.NewVector({X:-1,Y:-1,Y:-1});

    static IsZero(a:number):boolean{
        return turbo.Runtime._mem_float64[(a + 8) >> 3] === 0 && turbo.Runtime._mem_float64[(a + 16) >> 3] === 0 && turbo.Runtime._mem_float64[(a + 24) >> 3] === 0;
    }

    static Set(SELF:number, X:number, Y:number, Z:number) {
         turbo.Runtime._mem_float64[(SELF + 8) >> 3] = X; 
         turbo.Runtime._mem_float64[(SELF + 16) >> 3] = Y; 
         turbo.Runtime._mem_float64[(SELF + 24) >> 3] = Z; 
        return SELF;
    }

    static SetFromJSON(SELF:number, d) {
         turbo.Runtime._mem_float64[(SELF + 8) >> 3] = (d.x); 
         turbo.Runtime._mem_float64[(SELF + 16) >> 3] = (d.y); 
         turbo.Runtime._mem_float64[(SELF + 24) >> 3] = (d.z); 
        return SELF;
    }

    static SetFromArray(SELF:number, d:number[]) {
         turbo.Runtime._mem_float64[(SELF + 8) >> 3] = (d[0]); 
         turbo.Runtime._mem_float64[(SELF + 16) >> 3] = (d[1]); 
         turbo.Runtime._mem_float64[(SELF + 24) >> 3] = (d[2]); 
        return SELF;
    }

    static Copy(SELF:number, a:number):number {
        return Vector.Set(SELF, turbo.Runtime._mem_float64[(a + 8) >> 3], turbo.Runtime._mem_float64[(a + 16) >> 3], turbo.Runtime._mem_float64[(a + 24) >> 3]);
    }

    static Clone(SELF:number, c?:number):number {
        let ptr:number = c?c:Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
        return Vector.Init_mem(ptr, turbo.Runtime._mem_float64[(SELF + 8) >> 3], turbo.Runtime._mem_float64[(SELF + 16) >> 3], turbo.Runtime._mem_float64[(SELF + 24) >> 3]);
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=1266219; return SELF; }
}
turbo.Runtime._idToType[1266219] = Vector;


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
        let suffixes = ["", "k", "M", "G"];

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
         turbo.Runtime._mem_int32[(SELF + 4) >> 2] = (Vector.NewVector(min)); 
         turbo.Runtime._mem_int32[(SELF + 8) >> 2] = (Vector.NewVector(max)); 
        return SELF;
	}

    static Init_mem(SELF, min:number, max:number){
         turbo.Runtime._mem_int32[(SELF + 4) >> 2] = min; 
         turbo.Runtime._mem_int32[(SELF + 8) >> 2] = max; 
        return SELF;
	}

    static NewBox(min?:number, max?:number){
        let SELF = Box.initInstance(turbo.Runtime.allocOrThrow(12,4));
         turbo.Runtime._mem_int32[(SELF + 4) >> 2] = (min?min:Vector.NewVector()); 
         turbo.Runtime._mem_int32[(SELF + 8) >> 2] = (max?max:Vector.NewVector()); 
        return SELF;
	}

    static ToJSON(SELF){
        return {
            min:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 4) >> 2]),
            max:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 8) >> 2])
        };
	}

	static BoxForShapes(shapes:number, numShapes:number):number{
		if(numShapes == 0) {
			return Box.NewBox();
		}
		// let box = Shape.BoundingBox(turbo.Runtime._mem_int32[(  shapes + 4 + (4 * 0)  ) >> 2]);
		let box = Box.NewBox();

		for(let i:number = 0; i < numShapes; i++){
			let shape:number = turbo.Runtime._mem_int32[(  shapes + 4 + (4 * i)  ) >> 2];
			box = Box.Extend(box, Shape.BoundingBox(shape));
		}
		return box;
	}

	static BoxForTriangles(shapes:number, numShapes:number):number {
        if(numShapes == 0) {
            return Box.NewBox();
        }
        let box = Triangle.BoundingBox(turbo.Runtime._mem_int32[(  shapes + 4 + (4 * 0)  ) >> 2]);

        for(let i:number = 0; i < numShapes; i++){
            let shape:number = turbo.Runtime._mem_int32[(  shapes + 4 + (4 * i)  ) >> 2];
            box = Box.Extend(box, Triangle.BoundingBox(shape));
        }
        return box
	}

	static Anchor(SELF, anchor:number, c?:number):number {
        let size = Box.Size(SELF);
        let tmp = Vector.Mul_mem(size, anchor);
        free(size);
        if(c){
            free(tmp);
        }else{
            c = tmp;
        }
		return Vector.Add_mem(turbo.Runtime._mem_int32[(SELF + 4) >> 2], c, c);
    }

	static Center(SELF):number {
        let anchor = Vector.NewVector(0.5, 0.5, 0.5);
		return Box.Anchor(SELF, anchor, anchor);
	}

	static OuterRadius(SELF):number {
        let center = Box.Center(SELF);
        let tmp = Vector.Sub_mem(turbo.Runtime._mem_int32[(SELF + 4) >> 2], center);
		let len = Vector.Length_mem(tmp);
        free(center);
        free(tmp);
        return len;
	}

	static InnerRadius(SELF):number {
        let center = Box.Center(SELF);
        let tmp = Vector.Sub_mem(center, turbo.Runtime._mem_int32[(SELF + 4) >> 2]);
		let result = Vector.MaxComponent_mem(tmp);
        free(tmp);
        return result;
    }

	static Size(SELF):number {
		return Vector.Sub_mem(turbo.Runtime._mem_int32[(SELF + 8) >> 2], turbo.Runtime._mem_int32[(SELF + 4) >> 2]);
	}

	static Extend(SELF, b:number):number{
        //let ptr:number = Box.initInstance(turbo.Runtime.allocOrThrow(12,4));
		let min = turbo.Runtime._mem_int32[(SELF + 4) >> 2];
		let max = turbo.Runtime._mem_int32[(SELF + 8) >> 2];
		let bmin = turbo.Runtime._mem_int32[(b + 4) >> 2];
		let bmax = turbo.Runtime._mem_int32[(b + 8) >> 2];
		return Box.Init_mem(SELF, Vector.Min_mem(min, bmin, min), Vector.Max_mem(max, bmax, max));
	}

	static Contains(SELF , b:number):boolean{

        let a_min = turbo.Runtime._mem_int32[(SELF + 4) >> 2];
        let a_max = turbo.Runtime._mem_int32[(SELF + 8) >> 2];

		return turbo.Runtime._mem_float64[((a_min) + 8) >> 3] <= turbo.Runtime._mem_float64[(b + 8) >> 3] && turbo.Runtime._mem_float64[((a_max) + 8) >> 3] >= turbo.Runtime._mem_float64[(b + 8) >> 3] &&
			turbo.Runtime._mem_float64[((a_min) + 16) >> 3] <= turbo.Runtime._mem_float64[(b + 16) >> 3] && turbo.Runtime._mem_float64[((a_max) + 16) >> 3] >= turbo.Runtime._mem_float64[(b + 16) >> 3] &&
			turbo.Runtime._mem_float64[((a_min) + 24) >> 3] <= turbo.Runtime._mem_float64[(b + 24) >> 3] && turbo.Runtime._mem_float64[((a_max) + 24) >> 3] >= turbo.Runtime._mem_float64[(b + 24) >> 3];
	}

	static Intersects(a:number, b:number):boolean {
        let a_min = turbo.Runtime._mem_int32[(a + 4) >> 2];
        let a_max = turbo.Runtime._mem_int32[(a + 8) >> 2];
        let b_min = turbo.Runtime._mem_int32[(b + 4) >> 2];
        let b_max = turbo.Runtime._mem_int32[(b + 8) >> 2];

		return !(turbo.Runtime._mem_float64[((a_min) + 8) >> 3] > turbo.Runtime._mem_float64[((b_max) + 8) >> 3] || turbo.Runtime._mem_float64[((a_max) + 8) >> 3] < turbo.Runtime._mem_float64[((b_min) + 8) >> 3] || turbo.Runtime._mem_float64[((a_min) + 16) >> 3] > turbo.Runtime._mem_float64[((b_max) + 16) >> 3] ||
		turbo.Runtime._mem_float64[((a_max) + 16) >> 3] < turbo.Runtime._mem_float64[((b_min) + 16) >> 3] || turbo.Runtime._mem_float64[((a_min) + 24) >> 3] > turbo.Runtime._mem_float64[((b_max) + 24) >> 3] || turbo.Runtime._mem_float64[((a_max) + 24) >> 3] < turbo.Runtime._mem_float64[((b_min) + 24) >> 3]);
	}

	static Intersect(SELF, r:Ray):{tmax:number, tmin:number} {

        let min = turbo.Runtime._mem_int32[(SELF + 4) >> 2];
        let max = turbo.Runtime._mem_int32[(SELF + 8) >> 2];

        // x1 := (b.Min.X - r.Origin.X) / r.Direction.X
        // y1 := (b.Min.Y - r.Origin.Y) / r.Direction.Y
        // z1 := (b.Min.Z - r.Origin.Z) / r.Direction.Z
        // x2 := (b.Max.X - r.Origin.X) / r.Direction.X
        // y2 := (b.Max.Y - r.Origin.Y) / r.Direction.Y
        // z2 := (b.Max.Z - r.Origin.Z) / r.Direction.Z

		let x1 = (turbo.Runtime._mem_float64[(min + 8) >> 3] - r.origin.x) / r.direction.x;
        let y1 = (turbo.Runtime._mem_float64[(min + 16) >> 3] - r.origin.y) / r.direction.y;
        let z1 = (turbo.Runtime._mem_float64[(min + 24) >> 3] - r.origin.z) / r.direction.z;
        let x2 = (turbo.Runtime._mem_float64[(max + 8) >> 3] - r.origin.x) / r.direction.x;
        let y2 = (turbo.Runtime._mem_float64[(max + 16) >> 3] - r.origin.y) / r.direction.y;
        let z2 = (turbo.Runtime._mem_float64[(max + 24) >> 3] - r.origin.z) / r.direction.z;
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

        /*
        * 	 x1 := (b.Min.X - r.Origin.X) / r.Direction.X
             y1 := (b.Min.Y - r.Origin.Y) / r.Direction.Y
             z1 := (b.Min.Z - r.Origin.Z) / r.Direction.Z
             x2 := (b.Max.X - r.Origin.X) / r.Direction.X
             y2 := (b.Max.Y - r.Origin.Y) / r.Direction.Y
             z2 := (b.Max.Z - r.Origin.Z) / r.Direction.Z

             if x1 > x2 {
             x1, x2 = x2, x1
             }
             if y1 > y2 {
             y1, y2 = y2, y1
             }
             if z1 > z2 {
             z1, z2 = z2, z1
             }
             t1 := math.Max(math.Max(x1, y1), z1)
             t2 := math.Min(math.Min(x2, y2), z2)
             return t1, t2
        *
        **/

	}

	static Partition(SELF, axis:Axis, point:number): {left:boolean, right:boolean} {
        let min = turbo.Runtime._mem_int32[(SELF + 4) >> 2];
        let max = turbo.Runtime._mem_int32[(SELF + 8) >> 2];
        let left;
        let right;
		switch (axis) {
			case Axis.AxisX:
				left = turbo.Runtime._mem_float64[(min + 8) >> 3] <= point;
				right = turbo.Runtime._mem_float64[(max + 8) >> 3] >= point;
                break;
			case Axis.AxisY:
				left = turbo.Runtime._mem_float64[(min + 16) >> 3] <= point;
				right = turbo.Runtime._mem_float64[(max + 16) >> 3] >= point;
                break;
            case Axis.AxisZ:
				left = turbo.Runtime._mem_float64[(min + 24) >> 3] <= point;
				right = turbo.Runtime._mem_float64[(max + 24) >> 3] >= point;// EPIC Bug :D it was min and got weird triangle intersection
                break;
		}
		return {
            left :left,
            right:right
        };
	}
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=1841; return SELF; }
}
turbo.Runtime._idToType[1841] = Box;



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
         turbo.Runtime._mem_float64[(SELF + 8) >> 3] = x00; 
         turbo.Runtime._mem_float64[(SELF + 16) >> 3] = x01; 
         turbo.Runtime._mem_float64[(SELF + 24) >> 3] = x02; 
         turbo.Runtime._mem_float64[(SELF + 32) >> 3] = x03; 
         turbo.Runtime._mem_float64[(SELF + 40) >> 3] = x10; 
         turbo.Runtime._mem_float64[(SELF + 48) >> 3] = x11; 
         turbo.Runtime._mem_float64[(SELF + 56) >> 3] = x12; 
         turbo.Runtime._mem_float64[(SELF + 64) >> 3] = x13; 
         turbo.Runtime._mem_float64[(SELF + 72) >> 3] = x20; 
         turbo.Runtime._mem_float64[(SELF + 80) >> 3] = x21; 
         turbo.Runtime._mem_float64[(SELF + 88) >> 3] = x22; 
         turbo.Runtime._mem_float64[(SELF + 96) >> 3] = x23; 
         turbo.Runtime._mem_float64[(SELF + 104) >> 3] = x30; 
         turbo.Runtime._mem_float64[(SELF + 112) >> 3] = x31; 
         turbo.Runtime._mem_float64[(SELF + 120) >> 3] = x32; 
         turbo.Runtime._mem_float64[(SELF + 128) >> 3] = x33; 
        return SELF;
    }

    static NewMatrix(x00?:number, x01?:number, x02?:number, x03?:number, x10?:number, x11?:number, x12?:number, x13?:number, x20?:number, x21?:number, x22?:number, x23?:number, x30?:number, x31?:number, x32?:number, x33?:number):number {
        let ptr:number = Matrix.initInstance(turbo.Runtime.allocOrThrow(136,8));
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
            turbo.Runtime._mem_float64[(SELF + 8) >> 3], turbo.Runtime._mem_float64[(SELF + 16) >> 3], turbo.Runtime._mem_float64[(SELF + 24) >> 3], turbo.Runtime._mem_float64[(SELF + 32) >> 3],
            turbo.Runtime._mem_float64[(SELF + 40) >> 3], turbo.Runtime._mem_float64[(SELF + 48) >> 3], turbo.Runtime._mem_float64[(SELF + 56) >> 3], turbo.Runtime._mem_float64[(SELF + 64) >> 3],
            turbo.Runtime._mem_float64[(SELF + 72) >> 3], turbo.Runtime._mem_float64[(SELF + 80) >> 3], turbo.Runtime._mem_float64[(SELF + 88) >> 3], turbo.Runtime._mem_float64[(SELF + 96) >> 3],
            turbo.Runtime._mem_float64[(SELF + 104) >> 3], turbo.Runtime._mem_float64[(SELF + 112) >> 3], turbo.Runtime._mem_float64[(SELF + 120) >> 3], turbo.Runtime._mem_float64[(SELF + 128) >> 3]
        ]
    }

    static Identity(c?:number):number {
        let ptr:number = c?c:Matrix.initInstance(turbo.Runtime.allocOrThrow(136,8));
        return Matrix.init(ptr,
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }

    static IsEqual(a:number, b:number):boolean {
        return turbo.Runtime._mem_float64[(a + 8) >> 3] == turbo.Runtime._mem_float64[(b + 8) >> 3] && turbo.Runtime._mem_float64[(a + 16) >> 3] == turbo.Runtime._mem_float64[(b + 16) >> 3] && turbo.Runtime._mem_float64[(a + 24) >> 3] == turbo.Runtime._mem_float64[(b + 24) >> 3] && turbo.Runtime._mem_float64[(a + 32) >> 3] == turbo.Runtime._mem_float64[(b + 32) >> 3] && turbo.Runtime._mem_float64[(a + 40) >> 3] == turbo.Runtime._mem_float64[(b + 40) >> 3] && turbo.Runtime._mem_float64[(a + 48) >> 3] == turbo.Runtime._mem_float64[(b + 48) >> 3] && turbo.Runtime._mem_float64[(a + 56) >> 3] == turbo.Runtime._mem_float64[(b + 56) >> 3] && turbo.Runtime._mem_float64[(a + 64) >> 3] == turbo.Runtime._mem_float64[(b + 64) >> 3] && turbo.Runtime._mem_float64[(a + 72) >> 3] == turbo.Runtime._mem_float64[(b + 72) >> 3] && turbo.Runtime._mem_float64[(a + 80) >> 3] == turbo.Runtime._mem_float64[(b + 80) >> 3] && turbo.Runtime._mem_float64[(a + 88) >> 3] == turbo.Runtime._mem_float64[(b + 88) >> 3] && turbo.Runtime._mem_float64[(a + 96) >> 3] == turbo.Runtime._mem_float64[(b + 96) >> 3] && turbo.Runtime._mem_float64[(a + 104) >> 3] == turbo.Runtime._mem_float64[(b + 104) >> 3] && turbo.Runtime._mem_float64[(a + 112) >> 3] == turbo.Runtime._mem_float64[(b + 112) >> 3] && turbo.Runtime._mem_float64[(a + 120) >> 3] == turbo.Runtime._mem_float64[(b + 120) >> 3] && turbo.Runtime._mem_float64[(a + 128) >> 3] == turbo.Runtime._mem_float64[(b + 128) >> 3];
    }

    static IsIdentity(a:number):boolean {
        return turbo.Runtime._mem_float64[(a + 8) >> 3] == 1 && turbo.Runtime._mem_float64[(a + 16) >> 3] == 0 && turbo.Runtime._mem_float64[(a + 24) >> 3] == 0 && turbo.Runtime._mem_float64[(a + 32) >> 3] == 0 && turbo.Runtime._mem_float64[(a + 40) >> 3] == 0 && turbo.Runtime._mem_float64[(a + 48) >> 3] == 1 && turbo.Runtime._mem_float64[(a + 56) >> 3] == 0 && turbo.Runtime._mem_float64[(a + 64) >> 3] == 0 && turbo.Runtime._mem_float64[(a + 72) >> 3] == 0 && turbo.Runtime._mem_float64[(a + 80) >> 3] == 0 && turbo.Runtime._mem_float64[(a + 88) >> 3] == 1 && turbo.Runtime._mem_float64[(a + 96) >> 3] == 0 && turbo.Runtime._mem_float64[(a + 104) >> 3] == 0 && turbo.Runtime._mem_float64[(a + 112) >> 3] == 0 && turbo.Runtime._mem_float64[(a + 120) >> 3] == 0 && turbo.Runtime._mem_float64[(a + 128) >> 3] == 1;
    }

    static TranslateUnitMatrix(v:number, c?:number):number{
        let ptr:number = c?c:Matrix.initInstance(turbo.Runtime.allocOrThrow(136,8));
        return Matrix.init(ptr,
            1, 0, 0, turbo.Runtime._mem_float64[(v + 8) >> 3],
            0, 1, 0, turbo.Runtime._mem_float64[(v + 16) >> 3],
            0, 0, 1, turbo.Runtime._mem_float64[(v + 24) >> 3],
            0, 0, 0, 1
        )
    }

    static ScaleUnitMatrix(v:number, c?:number):number{
        let ptr:number = c?c:Matrix.initInstance(turbo.Runtime.allocOrThrow(136,8));
        return Matrix.init(ptr,
            turbo.Runtime._mem_float64[(v + 8) >> 3], 0, 0, 0,
            0, turbo.Runtime._mem_float64[(v + 16) >> 3], 0, 0,
            0, 0, turbo.Runtime._mem_float64[(v + 24) >> 3], 0,
            0, 0, 0, 1
        )
    }

    static RotateUnitMatrix(v:number, a:number, _c?:number):number{

        v = Vector.Normalize_mem(v);
        let s:number = Math.sin(a);
        let c:number = Math.cos(a);
        let m:number = 1 - c;

        let ptr:number = _c?_c:Matrix.initInstance(turbo.Runtime.allocOrThrow(136,8));
        return Matrix.init(ptr,
            m*turbo.Runtime._mem_float64[(v + 8) >> 3] * turbo.Runtime._mem_float64[(v + 8) >> 3] + c, m * turbo.Runtime._mem_float64[(v + 8) >> 3] * turbo.Runtime._mem_float64[(v + 16) >> 3] + turbo.Runtime._mem_float64[(v + 24) >> 3] * s, m * turbo.Runtime._mem_float64[(v + 24) >> 3] * turbo.Runtime._mem_float64[(v + 8) >> 3] - turbo.Runtime._mem_float64[(v + 16) >> 3] * s, 0,
            m*turbo.Runtime._mem_float64[(v + 8) >> 3] * turbo.Runtime._mem_float64[(v + 16) >> 3] - turbo.Runtime._mem_float64[(v + 24) >> 3] * s, m*turbo.Runtime._mem_float64[(v + 16) >> 3] * turbo.Runtime._mem_float64[(v + 16) >> 3] + c, m*turbo.Runtime._mem_float64[(v + 16) >> 3] * turbo.Runtime._mem_float64[(v + 24) >> 3] + turbo.Runtime._mem_float64[(v + 8) >> 3] * s, 0,
            m*turbo.Runtime._mem_float64[(v + 24) >> 3] * turbo.Runtime._mem_float64[(v + 8) >> 3] + turbo.Runtime._mem_float64[(v + 16) >> 3] * s, m*turbo.Runtime._mem_float64[(v + 16) >> 3] * turbo.Runtime._mem_float64[(v + 24) >> 3] - turbo.Runtime._mem_float64[(v + 8) >> 3] * s, m*turbo.Runtime._mem_float64[(v + 24) >> 3] * turbo.Runtime._mem_float64[(v + 24) >> 3] + c, 0,
            0, 0, 0, 1
        )
    }

    static FrustumUnitMatrix(l:number, r:number, b:number, t:number, n:number, f:number, c?:number):number{

        let t1:number = 2 * n;
        let t2:number = r - l;
        let t3:number = t - b;
        let t4:number = f - n;

        let ptr:number = c?c:Matrix.initInstance(turbo.Runtime.allocOrThrow(136,8));
        return Matrix.init(ptr,
            t1 / t2, 0, (r + l) / t2, 0,
            0, t1 / t3, (t + b) / t3, 0,
            0, 0, (-f - n) / t4, (-t1 * f) / t4,
            0, 0, -1, 0
        )
    }

    static OrthographicUnitMatrix(l:number, r:number, b:number, t:number, n:number, f:number, c?:number):number{

        let ptr:number = c?c:Matrix.initInstance(turbo.Runtime.allocOrThrow(136,8));
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

        let ptr:number = c?c:Matrix.initInstance(turbo.Runtime.allocOrThrow(136,8));
        Matrix.init(ptr,
            turbo.Runtime._mem_float64[(s + 8) >> 3], turbo.Runtime._mem_float64[(u + 8) >> 3], turbo.Runtime._mem_float64[(f + 8) >> 3], 0,
            turbo.Runtime._mem_float64[(s + 16) >> 3], turbo.Runtime._mem_float64[(u + 16) >> 3], turbo.Runtime._mem_float64[(f + 16) >> 3], 0,
            turbo.Runtime._mem_float64[(s + 24) >> 3], turbo.Runtime._mem_float64[(u + 24) >> 3], turbo.Runtime._mem_float64[(f + 24) >> 3], 0,
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
        m = m?m:Matrix.initInstance(turbo.Runtime.allocOrThrow(136,8));
        turbo.Runtime._mem_float64[(m + 8) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] * turbo.Runtime._mem_float64[(b + 8) >> 3] + turbo.Runtime._mem_float64[(a + 16) >> 3] * turbo.Runtime._mem_float64[(b + 40) >> 3] + turbo.Runtime._mem_float64[(a + 24) >> 3] * turbo.Runtime._mem_float64[(b + 72) >> 3] + turbo.Runtime._mem_float64[(a + 32) >> 3] * turbo.Runtime._mem_float64[(b + 104) >> 3];
        turbo.Runtime._mem_float64[(m + 40) >> 3] = turbo.Runtime._mem_float64[(a + 40) >> 3] * turbo.Runtime._mem_float64[(b + 8) >> 3] + turbo.Runtime._mem_float64[(a + 48) >> 3] * turbo.Runtime._mem_float64[(b + 40) >> 3] + turbo.Runtime._mem_float64[(a + 56) >> 3] * turbo.Runtime._mem_float64[(b + 72) >> 3] + turbo.Runtime._mem_float64[(a + 64) >> 3] * turbo.Runtime._mem_float64[(b + 104) >> 3];
        turbo.Runtime._mem_float64[(m + 72) >> 3] = turbo.Runtime._mem_float64[(a + 72) >> 3] * turbo.Runtime._mem_float64[(b + 8) >> 3] + turbo.Runtime._mem_float64[(a + 80) >> 3] * turbo.Runtime._mem_float64[(b + 40) >> 3] + turbo.Runtime._mem_float64[(a + 88) >> 3] * turbo.Runtime._mem_float64[(b + 72) >> 3] + turbo.Runtime._mem_float64[(a + 96) >> 3] * turbo.Runtime._mem_float64[(b + 104) >> 3];
        turbo.Runtime._mem_float64[(m + 104) >> 3] = turbo.Runtime._mem_float64[(a + 104) >> 3] * turbo.Runtime._mem_float64[(b + 8) >> 3] + turbo.Runtime._mem_float64[(a + 112) >> 3] * turbo.Runtime._mem_float64[(b + 40) >> 3] + turbo.Runtime._mem_float64[(a + 120) >> 3] * turbo.Runtime._mem_float64[(b + 72) >> 3] + turbo.Runtime._mem_float64[(a + 128) >> 3] * turbo.Runtime._mem_float64[(b + 104) >> 3];
        turbo.Runtime._mem_float64[(m + 16) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] * turbo.Runtime._mem_float64[(b + 16) >> 3] + turbo.Runtime._mem_float64[(a + 16) >> 3] * turbo.Runtime._mem_float64[(b + 48) >> 3] + turbo.Runtime._mem_float64[(a + 24) >> 3] * turbo.Runtime._mem_float64[(b + 80) >> 3] + turbo.Runtime._mem_float64[(a + 32) >> 3] * turbo.Runtime._mem_float64[(b + 112) >> 3];
        turbo.Runtime._mem_float64[(m + 48) >> 3] = turbo.Runtime._mem_float64[(a + 40) >> 3] * turbo.Runtime._mem_float64[(b + 16) >> 3] + turbo.Runtime._mem_float64[(a + 48) >> 3] * turbo.Runtime._mem_float64[(b + 48) >> 3] + turbo.Runtime._mem_float64[(a + 56) >> 3] * turbo.Runtime._mem_float64[(b + 80) >> 3] + turbo.Runtime._mem_float64[(a + 64) >> 3] * turbo.Runtime._mem_float64[(b + 112) >> 3];
        turbo.Runtime._mem_float64[(m + 80) >> 3] = turbo.Runtime._mem_float64[(a + 72) >> 3] * turbo.Runtime._mem_float64[(b + 16) >> 3] + turbo.Runtime._mem_float64[(a + 80) >> 3] * turbo.Runtime._mem_float64[(b + 48) >> 3] + turbo.Runtime._mem_float64[(a + 88) >> 3] * turbo.Runtime._mem_float64[(b + 80) >> 3] + turbo.Runtime._mem_float64[(a + 96) >> 3] * turbo.Runtime._mem_float64[(b + 112) >> 3];
        turbo.Runtime._mem_float64[(m + 112) >> 3] = turbo.Runtime._mem_float64[(a + 104) >> 3] * turbo.Runtime._mem_float64[(b + 16) >> 3] + turbo.Runtime._mem_float64[(a + 112) >> 3] * turbo.Runtime._mem_float64[(b + 48) >> 3] + turbo.Runtime._mem_float64[(a + 120) >> 3] * turbo.Runtime._mem_float64[(b + 80) >> 3] + turbo.Runtime._mem_float64[(a + 128) >> 3] * turbo.Runtime._mem_float64[(b + 112) >> 3];
        turbo.Runtime._mem_float64[(m + 24) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] * turbo.Runtime._mem_float64[(b + 24) >> 3] + turbo.Runtime._mem_float64[(a + 16) >> 3] * turbo.Runtime._mem_float64[(b + 56) >> 3] + turbo.Runtime._mem_float64[(a + 24) >> 3] * turbo.Runtime._mem_float64[(b + 88) >> 3] + turbo.Runtime._mem_float64[(a + 32) >> 3] * turbo.Runtime._mem_float64[(b + 120) >> 3];
        turbo.Runtime._mem_float64[(m + 56) >> 3] = turbo.Runtime._mem_float64[(a + 40) >> 3] * turbo.Runtime._mem_float64[(b + 24) >> 3] + turbo.Runtime._mem_float64[(a + 48) >> 3] * turbo.Runtime._mem_float64[(b + 56) >> 3] + turbo.Runtime._mem_float64[(a + 56) >> 3] * turbo.Runtime._mem_float64[(b + 88) >> 3] + turbo.Runtime._mem_float64[(a + 64) >> 3] * turbo.Runtime._mem_float64[(b + 120) >> 3];
        turbo.Runtime._mem_float64[(m + 88) >> 3] = turbo.Runtime._mem_float64[(a + 72) >> 3] * turbo.Runtime._mem_float64[(b + 24) >> 3] + turbo.Runtime._mem_float64[(a + 80) >> 3] * turbo.Runtime._mem_float64[(b + 56) >> 3] + turbo.Runtime._mem_float64[(a + 88) >> 3] * turbo.Runtime._mem_float64[(b + 88) >> 3] + turbo.Runtime._mem_float64[(a + 96) >> 3] * turbo.Runtime._mem_float64[(b + 120) >> 3];
        turbo.Runtime._mem_float64[(m + 120) >> 3] = turbo.Runtime._mem_float64[(a + 104) >> 3] * turbo.Runtime._mem_float64[(b + 24) >> 3] + turbo.Runtime._mem_float64[(a + 112) >> 3] * turbo.Runtime._mem_float64[(b + 56) >> 3] + turbo.Runtime._mem_float64[(a + 120) >> 3] * turbo.Runtime._mem_float64[(b + 88) >> 3] + turbo.Runtime._mem_float64[(a + 128) >> 3] * turbo.Runtime._mem_float64[(b + 120) >> 3];
        turbo.Runtime._mem_float64[(m + 32) >> 3] = turbo.Runtime._mem_float64[(a + 8) >> 3] * turbo.Runtime._mem_float64[(b + 32) >> 3] + turbo.Runtime._mem_float64[(a + 16) >> 3] * turbo.Runtime._mem_float64[(b + 64) >> 3] + turbo.Runtime._mem_float64[(a + 24) >> 3] * turbo.Runtime._mem_float64[(b + 96) >> 3] + turbo.Runtime._mem_float64[(a + 32) >> 3] * turbo.Runtime._mem_float64[(b + 128) >> 3];
        turbo.Runtime._mem_float64[(m + 64) >> 3] = turbo.Runtime._mem_float64[(a + 40) >> 3] * turbo.Runtime._mem_float64[(b + 32) >> 3] + turbo.Runtime._mem_float64[(a + 48) >> 3] * turbo.Runtime._mem_float64[(b + 64) >> 3] + turbo.Runtime._mem_float64[(a + 56) >> 3] * turbo.Runtime._mem_float64[(b + 96) >> 3] + turbo.Runtime._mem_float64[(a + 64) >> 3] * turbo.Runtime._mem_float64[(b + 128) >> 3];
        turbo.Runtime._mem_float64[(m + 96) >> 3] = turbo.Runtime._mem_float64[(a + 72) >> 3] * turbo.Runtime._mem_float64[(b + 32) >> 3] + turbo.Runtime._mem_float64[(a + 80) >> 3] * turbo.Runtime._mem_float64[(b + 64) >> 3] + turbo.Runtime._mem_float64[(a + 88) >> 3] * turbo.Runtime._mem_float64[(b + 96) >> 3] + turbo.Runtime._mem_float64[(a + 96) >> 3] * turbo.Runtime._mem_float64[(b + 128) >> 3];
        turbo.Runtime._mem_float64[(m + 128) >> 3] = turbo.Runtime._mem_float64[(a + 104) >> 3] * turbo.Runtime._mem_float64[(b + 32) >> 3] + turbo.Runtime._mem_float64[(a + 112) >> 3] * turbo.Runtime._mem_float64[(b + 64) >> 3] + turbo.Runtime._mem_float64[(a + 120) >> 3] * turbo.Runtime._mem_float64[(b + 96) >> 3] + turbo.Runtime._mem_float64[(a + 128) >> 3] * turbo.Runtime._mem_float64[(b + 128) >> 3];
        return m;
    }

    static MulPosition(a:number, b:number, c?:number):number {
        let x:number = turbo.Runtime._mem_float64[(a + 8) >> 3] * turbo.Runtime._mem_float64[(b + 8) >> 3] + turbo.Runtime._mem_float64[(a + 16) >> 3] * turbo.Runtime._mem_float64[(b + 16) >> 3] + turbo.Runtime._mem_float64[(a + 24) >> 3] * turbo.Runtime._mem_float64[(b + 24) >> 3] + turbo.Runtime._mem_float64[(a + 32) >> 3];
        let y:number = turbo.Runtime._mem_float64[(a + 40) >> 3] * turbo.Runtime._mem_float64[(b + 8) >> 3] + turbo.Runtime._mem_float64[(a + 48) >> 3] * turbo.Runtime._mem_float64[(b + 16) >> 3] + turbo.Runtime._mem_float64[(a + 56) >> 3] * turbo.Runtime._mem_float64[(b + 24) >> 3] + turbo.Runtime._mem_float64[(a + 64) >> 3];
        let z:number = turbo.Runtime._mem_float64[(a + 72) >> 3] * turbo.Runtime._mem_float64[(b + 8) >> 3] + turbo.Runtime._mem_float64[(a + 80) >> 3] * turbo.Runtime._mem_float64[(b + 16) >> 3] + turbo.Runtime._mem_float64[(a + 88) >> 3] * turbo.Runtime._mem_float64[(b + 24) >> 3] + turbo.Runtime._mem_float64[(a + 96) >> 3];
        let ptr:number = c?c:Vector.initInstance(turbo.Runtime.allocOrThrow(32,8))();
        return Vector.Init_mem(ptr, x, y, z);
    }

    static MulPosition_vec3(a:number, b:Vector3):Vector3 {
        let x:number = turbo.Runtime._mem_float64[(a + 8) >> 3] * b.x + turbo.Runtime._mem_float64[(a + 16) >> 3] * b.y + turbo.Runtime._mem_float64[(a + 24) >> 3] * b.z + turbo.Runtime._mem_float64[(a + 32) >> 3];
        let y:number = turbo.Runtime._mem_float64[(a + 40) >> 3] * b.x + turbo.Runtime._mem_float64[(a + 48) >> 3] * b.y + turbo.Runtime._mem_float64[(a + 56) >> 3] * b.z + turbo.Runtime._mem_float64[(a + 64) >> 3];
        let z:number = turbo.Runtime._mem_float64[(a + 72) >> 3] * b.x + turbo.Runtime._mem_float64[(a + 80) >> 3] * b.y + turbo.Runtime._mem_float64[(a + 88) >> 3] * b.z + turbo.Runtime._mem_float64[(a + 96) >> 3];
        return new Vector3(x, y, z);
    }

    static MulDirection(a:number, b:number, c?:number):number {
        let x:number = turbo.Runtime._mem_float64[(a + 8) >> 3] * turbo.Runtime._mem_float64[(b + 8) >> 3] + turbo.Runtime._mem_float64[(a + 16) >> 3] * turbo.Runtime._mem_float64[(b + 16) >> 3] + turbo.Runtime._mem_float64[(a + 24) >> 3] * turbo.Runtime._mem_float64[(b + 24) >> 3];
        let y:number = turbo.Runtime._mem_float64[(a + 40) >> 3] * turbo.Runtime._mem_float64[(b + 8) >> 3] + turbo.Runtime._mem_float64[(a + 48) >> 3] * turbo.Runtime._mem_float64[(b + 16) >> 3] + turbo.Runtime._mem_float64[(a + 56) >> 3] * turbo.Runtime._mem_float64[(b + 24) >> 3];
        let z:number = turbo.Runtime._mem_float64[(a + 72) >> 3] * turbo.Runtime._mem_float64[(b + 8) >> 3] + turbo.Runtime._mem_float64[(a + 80) >> 3] * turbo.Runtime._mem_float64[(b + 16) >> 3] + turbo.Runtime._mem_float64[(a + 88) >> 3] * turbo.Runtime._mem_float64[(b + 24) >> 3];
        let ptr:number = c?c:Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
        return Vector.Normalize_mem(Vector.Init_mem(ptr, x, y, z));
    }

    static MulDirection_vec3(a:number, b:Vector3):Vector3 {
        let x:number = turbo.Runtime._mem_float64[(a + 8) >> 3] * b.x + turbo.Runtime._mem_float64[(a + 16) >> 3] * b.y + turbo.Runtime._mem_float64[(a + 24) >> 3] * b.z;
        let y:number = turbo.Runtime._mem_float64[(a + 40) >> 3] * b.x + turbo.Runtime._mem_float64[(a + 48) >> 3] * b.y + turbo.Runtime._mem_float64[(a + 56) >> 3] * b.z;
        let z:number = turbo.Runtime._mem_float64[(a + 72) >> 3] * b.x + turbo.Runtime._mem_float64[(a + 80) >> 3] * b.y + turbo.Runtime._mem_float64[(a + 88) >> 3] * b.z;
        return new Vector3(x, y, z);
    }

    static MulRay(a:number, ray:Ray):Ray {
        let origin:Vector3 = Matrix.MulPosition_vec3(a, ray.origin);
        let direction:Vector3 = Matrix.MulDirection_vec3(a, ray.direction);
        return new Ray(origin, direction);
    }

    static  MulBox(a:number, box:number, c?:number):number {
        let min:number = turbo.Runtime._mem_int32[(box + 4) >> 2];
        let max:number = turbo.Runtime._mem_int32[(box + 8) >> 2];
        // http://dev.theomader.com/transform-bounding-boxes/
        let r:number = Vector.Init_mem(Vector.initInstance(turbo.Runtime.allocOrThrow(32,8)), turbo.Runtime._mem_float64[(a + 8) >> 3], turbo.Runtime._mem_float64[(a + 40) >> 3], turbo.Runtime._mem_float64[(a + 72) >> 3]);
        let u:number = Vector.Init_mem(Vector.initInstance(turbo.Runtime.allocOrThrow(32,8)), turbo.Runtime._mem_float64[(a + 16) >> 3], turbo.Runtime._mem_float64[(a + 48) >> 3], turbo.Runtime._mem_float64[(a + 80) >> 3]);
        let b:number = Vector.Init_mem(Vector.initInstance(turbo.Runtime.allocOrThrow(32,8)), turbo.Runtime._mem_float64[(a + 24) >> 3], turbo.Runtime._mem_float64[(a + 56) >> 3], turbo.Runtime._mem_float64[(a + 88) >> 3]);
        let t:number = Vector.Init_mem(Vector.initInstance(turbo.Runtime.allocOrThrow(32,8)), turbo.Runtime._mem_float64[(a + 32) >> 3], turbo.Runtime._mem_float64[(a + 64) >> 3], turbo.Runtime._mem_float64[(a + 96) >> 3]);
        let xa:number = Vector.MulScalar_mem(r, turbo.Runtime._mem_float64[(min + 8) >> 3]);
        let xb:number = Vector.MulScalar_mem(r, turbo.Runtime._mem_float64[(max + 8) >> 3]);
        let ya:number = Vector.MulScalar_mem(u, turbo.Runtime._mem_float64[(min + 16) >> 3]);
        let yb:number = Vector.MulScalar_mem(u, turbo.Runtime._mem_float64[(max + 16) >> 3]);
        let za:number = Vector.MulScalar_mem(b, turbo.Runtime._mem_float64[(min + 24) >> 3]);
        let zb:number = Vector.MulScalar_mem(b, turbo.Runtime._mem_float64[(max + 24) >> 3]);
        xa = Vector.Min_mem(xa, xb, r);
        xb = Vector.Max_mem(xa, xb, u);
        ya = Vector.Min_mem(ya, yb, b);
        yb = Vector.Max_mem(ya, yb);
        za = Vector.Min_mem(za, zb);
        zb = Vector.Max_mem(za, zb);
        min = Vector.Add_mem(Vector.Add_mem(Vector.Add_mem(xa, ya), za),t);
        max = Vector.Add_mem(Vector.Add_mem(Vector.Add_mem(xb, yb), zb),t);
        let ptr = c?c:Box.initInstance(turbo.Runtime.allocOrThrow(12,4));
        return Box.Init_mem(ptr, min, max);
    }

    static Transpose(a:number, c?:number):number {
        let ptr = c?c:Matrix.initInstance(turbo.Runtime.allocOrThrow(136,8));
        return Matrix.init(ptr,
            turbo.Runtime._mem_float64[(a + 8) >> 3], turbo.Runtime._mem_float64[(a + 40) >> 3], turbo.Runtime._mem_float64[(a + 72) >> 3], turbo.Runtime._mem_float64[(a + 104) >> 3],
            turbo.Runtime._mem_float64[(a + 16) >> 3], turbo.Runtime._mem_float64[(a + 48) >> 3], turbo.Runtime._mem_float64[(a + 80) >> 3], turbo.Runtime._mem_float64[(a + 112) >> 3],
            turbo.Runtime._mem_float64[(a + 24) >> 3], turbo.Runtime._mem_float64[(a + 56) >> 3], turbo.Runtime._mem_float64[(a + 88) >> 3], turbo.Runtime._mem_float64[(a + 120) >> 3],
            turbo.Runtime._mem_float64[(a + 32) >> 3], turbo.Runtime._mem_float64[(a + 64) >> 3], turbo.Runtime._mem_float64[(a + 96) >> 3], turbo.Runtime._mem_float64[(a + 128) >> 3]
        );
    }

    static Determinant(SELF:number):number {
        return (turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] - turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] +
        turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] - turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] +
        turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] - turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] -
        turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] + turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] -
        turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] + turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] -
        turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] + turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] +
        turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] - turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] +
        turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] - turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] +
        turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] -
        turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] + turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] -
        turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] + turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] -
        turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] + turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3])
    }

    static Inverse(SELF:number, c?:number):number {
        let m:number = c?c:Matrix.initInstance(turbo.Runtime.allocOrThrow(136,8));
        let d:number = Matrix.Determinant(SELF);
        turbo.Runtime._mem_float64[(m + 8) >> 3] = (turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] - turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] + turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] - turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] - turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] + turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 16) >> 3] = (turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] - turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] - turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] + turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] + turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] - turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 24) >> 3] = (turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] - turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] + turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] - turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] - turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] + turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 32) >> 3] = (turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3] - turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3] - turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3] + turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3] + turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3] - turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 40) >> 3] = (turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] + turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] + turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] - turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 48) >> 3] = (turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] + turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] - turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] - turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] + turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 56) >> 3] = (turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] + turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] + turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] - turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 64) >> 3] = (turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3] - turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3] + turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3] - turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3] - turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3] + turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 72) >> 3] = (turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] + turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] - turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] - turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] + turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 80) >> 3] = (turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] + turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] + turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] - turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 88) >> 3] = (turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] + turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] - turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] - turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3] + turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 128) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 96) >> 3] = (turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3] - turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3] - turbo.Runtime._mem_float64[(SELF + 32) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3] + turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 64) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3] + turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3] - turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 96) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 104) >> 3] = (turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] + turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] + turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] - turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 112) >> 3] = (turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] + turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] - turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] - turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] + turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 120) >> 3] = (turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 104) >> 3] - turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] + turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 112) >> 3] + turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3] - turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 120) >> 3]) / d
        turbo.Runtime._mem_float64[(m + 128) >> 3] = (turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3] - turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 72) >> 3] + turbo.Runtime._mem_float64[(SELF + 24) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3] - turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 56) >> 3]*turbo.Runtime._mem_float64[(SELF + 80) >> 3] - turbo.Runtime._mem_float64[(SELF + 16) >> 3]*turbo.Runtime._mem_float64[(SELF + 40) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3] + turbo.Runtime._mem_float64[(SELF + 8) >> 3]*turbo.Runtime._mem_float64[(SELF + 48) >> 3]*turbo.Runtime._mem_float64[(SELF + 88) >> 3]) / d
        return m
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=2093537; return SELF; }
}
turbo.Runtime._idToType[2093537] = Matrix;

export class Texture extends MemoryObject{
   static NAME:string = "Texture";
   static SIZE:number = 20;
   static ALIGN:number = 4;
   static CLSID:number = 10502342;

   static get BASE():string{
       return null
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, width:number, height:number, data:number){
         turbo.Runtime._mem_int32[(SELF + 4) >> 2] = width; 
         turbo.Runtime._mem_int32[(SELF + 8) >> 2] = height; 
         turbo.Runtime._mem_int32[(SELF + 16) >> 2] = data; 
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

    static NewTexture(im:number /*Image*/):number /*Texture*/{
        let size:number = turbo.Runtime._mem_int32[((Image.Bounds(im)) + 8) >> 2];
        let data:number = turbo.Runtime.allocOrThrow( 4 + ( 4 * (turbo.Runtime._mem_float64[(size + 8) >> 3] * turbo.Runtime._mem_float64[(size + 16) >> 3]) ), 4 ) /*Array*/;
        turbo.Runtime._mem_int32[number >> 2] = (turbo.Runtime._mem_float64[(size + 8) >> 3] * turbo.Runtime._mem_float64[(size + 16) >> 3]);
        for (let y:number = 0; y < turbo.Runtime._mem_float64[(size + 16) >> 3]; y++) {
            for (let x:number = 0; x < turbo.Runtime._mem_float64[(size + 8) >> 3]; x++) {
                let index = y * turbo.Runtime._mem_float64[(size + 8) >> 3] + x;
                turbo.Runtime._mem_int32[(  data + 4 + (4 * index)  ) >> 2] = (Color.Pow(Image.At(im, x, y), 2.2));
            }
        }
        let ptr:number = Texture.initInstance(turbo.Runtime.allocOrThrow(20,4));
        return Texture.init(ptr, turbo.Runtime._mem_float64[(size + 8) >> 3], turbo.Runtime._mem_float64[(size + 16) >> 3], data);
    }

    Pow(t:number, a:number):number {
        let data:number = turbo.Runtime._mem_int32[(t + 16) >> 2];
        let len:number = turbo.Runtime._mem_int32[(t + 12) >> 2];

        for (let i:number = 0; i < len; i++) {
            let d = turbo.Runtime._mem_int32[(  data + 4 + (4 * i)  ) >> 2];
            Color.Pow_mem(d, a, d);
        }
        return t;
    }

    static MulScalar(t:number, a:number):number{
        let data:number = turbo.Runtime._mem_int32[(t + 16) >> 2];
        let len:number = turbo.Runtime._mem_int32[(t + 12) >> 2];

        for (let i:number = 0; i < len; i++) {
            let d = turbo.Runtime._mem_int32[(  data + 4 + (4 * i)  ) >> 2];
            Color.MulScalar_mem(d, a, d);
        }
        return t;
    }

    static bilinearSample(t:number, u:number, v:number):number{
        let Width:number = turbo.Runtime._mem_int32[(t + 4) >> 2];
        let Height:number = turbo.Runtime._mem_int32[(t + 8) >> 2];
        let data:number = turbo.Runtime._mem_int32[(t + 16) >> 2];

        let w:number = Width - 1;
        let h:number = Height - 1;
        
        let _ = Utils.Modf(u * w);
        
        let X = _.int;
        let x = _.frac;
        _ = Utils.Modf(v * h);
        let Y = _.int;
        let y = _.frac;

        let x0:number = parseInt(X);
        let y0:number = parseInt(Y);
        let x1:number = x0 + 1;
        let y1:number = y0 + 1;
        let c00:number = turbo.Runtime._mem_int32[(  data + 4 + (4 * (y0 * Width + x0))  ) >> 2];
        let c01:number = turbo.Runtime._mem_int32[(  data + 4 + (4 * (y1 * Width + x0))  ) >> 2];
        let c10:number = turbo.Runtime._mem_int32[(  data + 4 + (4 * (y0 * Width + x1))  ) >> 2];
        let c11:number = turbo.Runtime._mem_int32[(  data + 4 + (4 * (y1 * Width + x1))  ) >> 2];
        let c:number = Color.BLACK;
        c = Color.Add_mem(c, Color.MulScalar_mem(c00, (1 - x) * (1 - y)));
        c = Color.Add_mem(c, Color.MulScalar_mem(c10, x * (1 - y)));
        c = Color.Add_mem(c, Color.MulScalar_mem(c01, (1 - x) * y));
        c = Color.Add_mem(c, Color.MulScalar_mem(c11, x * y));
        return c;
    }


    static Sample(t:number, u:number, v:number):number {
        u = Utils.FractAddOne(u);
        v = Utils.FractAddOne(v);
        return Texture.bilinearSample(t, u, 1-v);
    }

    static NormalSample(t:number, u:number, v:number, c?:number):Vector3 {
        let c = Texture.Sample(t, u, v);
        return new Vector3(turbo.Runtime._mem_float64[(c + 8) >> 3] * 2 - 1, turbo.Runtime._mem_float64[(c + 16) >> 3] * 2 - 1, turbo.Runtime._mem_float64[(c + 24) >> 3] * 2 - 1).normalize();
    }

    static BumpSample(t:number, u:number, v:number, c?:number):Vector3 {
        let Width:number = turbo.Runtime._mem_int32[(t + 4) >> 2];
        let Height:number = turbo.Runtime._mem_int32[(t + 8) >> 2];
        let data:number = turbo.Runtime._mem_int32[(t + 16) >> 2];
        u = Utils.FractAddOne(u);
        v = Utils.FractAddOne(v);
        v = 1 - v;
        let x:number = parseInt(u * Width);
        let y:number = parseInt(v * Height);
        let x1 = Utils.ClampInt(x-1, 0, Width-1);
        let x2 = Utils.ClampInt(x+1, 0, Width-1);
        let y1 = Utils.ClampInt(y-1, 0, Height-1);
        let y2 = Utils.ClampInt(y+1, 0, Height-1);
        let cx = Color.Sub_mem(turbo.Runtime._mem_int32[(  data + 4 + (4 * (y * Width + x1))  ) >> 2], turbo.Runtime._mem_int32[(  data + 4 + (4 * (y * Width + x2))  ) >> 2]);
        let cy = Color.Sub_mem(turbo.Runtime._mem_int32[(  data + 4 + (4 * (y1 * Width + x))  ) >> 2], turbo.Runtime._mem_int32[(  data + 4 + (4 * (y2 * Width + x))  ) >> 2]);
        return new Vector3(turbo.Runtime._mem_float64[(cx + 8) >> 3], turbo.Runtime._mem_float64[(cy + 8) >> 3], 0);
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=10502342; return SELF; }
}
turbo.Runtime._idToType[10502342] = Texture;


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
         turbo.Runtime._mem_int32[(SELF + 4) >> 2] = Color; 
         turbo.Runtime._mem_int32[(SELF + 8) >> 2] = Texture; 
         turbo.Runtime._mem_int32[(SELF + 12) >> 2] = NormalTexture; 
         turbo.Runtime._mem_int32[(SELF + 16) >> 2] = BumpTexture; 
         turbo.Runtime._mem_int32[(SELF + 20) >> 2] = GlossTexture; 
         turbo.Runtime._mem_float64[(SELF + 24) >> 3] = BumpMultiplier; 
         turbo.Runtime._mem_float64[(SELF + 32) >> 3] = Emittance; 
         turbo.Runtime._mem_float64[(SELF + 40) >> 3] = Index; 
         turbo.Runtime._mem_float64[(SELF + 48) >> 3] = Gloss; 
         turbo.Runtime._mem_float64[(SELF + 56) >> 3] = Tint; 
         turbo.Runtime._mem_float64[(SELF + 64) >> 3] = Reflectivity; 
         turbo.Runtime._mem_uint8[(SELF + 72) >> 0] = Transparent; 
        return SELF;
    }
    static IsLight(SELF):boolean {
        return turbo.Runtime._mem_float64[(SELF + 32) >> 3] > 0;
    }
    static Clone(SELF, c?:number):number {
        let ptr:number = c?c:Material.initInstance(turbo.Runtime.allocOrThrow(73,8));
        return Material.init(ptr,
            Color.Clone(turbo.Runtime._mem_int32[(SELF + 4) >> 2]),
            turbo.Runtime._mem_int32[(SELF + 8) >> 2],
            turbo.Runtime._mem_int32[(SELF + 12) >> 2],
            turbo.Runtime._mem_int32[(SELF + 16) >> 2],
            turbo.Runtime._mem_int32[(SELF + 20) >> 2],
            turbo.Runtime._mem_float64[(SELF + 24) >> 3],
            turbo.Runtime._mem_float64[(SELF + 32) >> 3],
            turbo.Runtime._mem_float64[(SELF + 40) >> 3],
            turbo.Runtime._mem_float64[(SELF + 48) >> 3],
            turbo.Runtime._mem_float64[(SELF + 56) >> 3],
            turbo.Runtime._mem_float64[(SELF + 64) >> 3],
            turbo.Runtime._mem_uint8[(SELF + 72) >> 0]
        );
    }
    static ToJSON(SELF){
        return {
            ptr:SELF,
            color:Color.RGBA(turbo.Runtime._mem_int32[(SELF + 4) >> 2]),
            texture:turbo.Runtime._mem_int32[(SELF + 8) >> 2],
            normalTexture:turbo.Runtime._mem_int32[(SELF + 12) >> 2],
            bumpTexture:turbo.Runtime._mem_int32[(SELF + 16) >> 2],
            glossTexture:turbo.Runtime._mem_int32[(SELF + 20) >> 2],
            bumpMultiplier:turbo.Runtime._mem_float64[(SELF + 24) >> 3],
            emittance:turbo.Runtime._mem_float64[(SELF + 32) >> 3],
            index:turbo.Runtime._mem_float64[(SELF + 40) >> 3],
            gloss:turbo.Runtime._mem_float64[(SELF + 48) >> 3],
            tint:turbo.Runtime._mem_float64[(SELF + 56) >> 3],
            reflectivity:turbo.Runtime._mem_float64[(SELF + 64) >> 3],
            transparent:turbo.Runtime._mem_uint8[(SELF + 72) >> 0]
        }
    }
    static set(SELF, Color, Texture, NormalTexture, BumpTexture, GlossTexture, BumpMultiplier, Emittance, Index, Gloss, Tint, Reflectivity, Transparent){
         turbo.Runtime._mem_int32[(SELF + 4) >> 2] = Color; 
         turbo.Runtime._mem_int32[(SELF + 8) >> 2] = Texture; 
         turbo.Runtime._mem_int32[(SELF + 12) >> 2] = NormalTexture; 
         turbo.Runtime._mem_int32[(SELF + 16) >> 2] = BumpTexture; 
         turbo.Runtime._mem_int32[(SELF + 20) >> 2] = GlossTexture; 
         turbo.Runtime._mem_float64[(SELF + 24) >> 3] = BumpMultiplier; 
         turbo.Runtime._mem_float64[(SELF + 32) >> 3] = Emittance; 
         turbo.Runtime._mem_float64[(SELF + 40) >> 3] = Index; 
         turbo.Runtime._mem_float64[(SELF + 48) >> 3] = Gloss; 
         turbo.Runtime._mem_float64[(SELF + 56) >> 3] = Tint; 
         turbo.Runtime._mem_float64[(SELF + 64) >> 3] = Reflectivity; 
         turbo.Runtime._mem_uint8[(SELF + 72) >> 0] = Transparent; 
        return SELF;
    }
    static DiffuseMaterial(color:number):number{
        let ptr:number = Material.initInstance(turbo.Runtime.allocOrThrow(73,8));
        return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, 1, 0, 0, -1, false);
    }

    static SpecularMaterial(color:number, index:number):number{
        let ptr:number = Material.initInstance(turbo.Runtime.allocOrThrow(73,8));
        return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, index, 0, 0, -1, false);
    }

    static GlossyMaterial(color:number, index:number, gloss:number):number{
        let ptr:number = Material.initInstance(turbo.Runtime.allocOrThrow(73,8));
        return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, index, gloss, 0, -1, false);
    }

    static ClearMaterial(index:number, gloss:number):number{
        let ptr:number = Material.initInstance(turbo.Runtime.allocOrThrow(73,8));
        return Material.init(ptr, Color.BLACK, 0, 0, 0, 0, 1, 0, index, gloss, 0, -1, true);
    }

    static TransparentMaterial(color:number, index:number, gloss:number, tint:number):number{
        let ptr:number = Material.initInstance(turbo.Runtime.allocOrThrow(73,8));
        return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, index, gloss, tint, -1, true);
    }

    static MetallicMaterial(color:number, gloss:number, tint:number):number{
        let ptr:number = Material.initInstance(turbo.Runtime.allocOrThrow(73,8));
        return Material.init(ptr, color, 0, 0, 0, 0, 1, 0, 1, gloss, tint, -1, false);
    }

    static LightMaterial(color:number, emittance:number):number{
        let ptr:number = Material.initInstance(turbo.Runtime.allocOrThrow(73,8));
        return Material.init(ptr, color, 0, 0, 0, 0, 1, emittance, 1, 0, 0, -1, false);
    }

    static MaterialAt(shape:number, point:Vector3):number{
        let material:number = Shape.MaterialAt(shape, point);
        // let uv:Vector3 = Shape.UV(shape, point);
        // if (turbo.Runtime._mem_int32[(material + 8) >> 2]) {
        //     turbo.Runtime._mem_int32[(material + 4) >> 2] = Texture.Sample(turbo.Runtime._mem_int32[(material + 8) >> 2], uv.x, uv.y);
        // }
        // if (turbo.Runtime._mem_int32[(material + 20) >> 2]) {
        //     let c:number = Texture.Sample(turbo.Runtime._mem_int32[(material + 20) >> 2], uv.x, uv.y);
        //     turbo.Runtime._mem_float64[(material + 48) >> 3] = (turbo.Runtime._mem_float64[(c + 8) >> 3] + turbo.Runtime._mem_float64[(c + 16) >> 3] + turbo.Runtime._mem_float64[(c + 24) >> 3]) / 3;
        // }
        return material;
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=167722613; return SELF; }
}
turbo.Runtime._idToType[167722613] = Material;

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

    bounce(info:HitInfo, u:number, v:number, bounceType:BounceType):{ray:Ray, reflected:boolean, coefficient:number} {
        let n:Ray = info.Ray;
        let material = info.Material;
        let n1 = 1.0;
        let n2 = turbo.Runtime._mem_float64[(material + 40) >> 3];

        if(info.Inside){
            let tmp = n1;
            n1 = n2;
            n2 = tmp;
        }

        let p:number;

        if(turbo.Runtime._mem_float64[(material + 64) >> 3] >= 0) {
            p = turbo.Runtime._mem_float64[(material + 64) >> 3];
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
            return { ray: reflected.coneBounce(turbo.Runtime._mem_float64[(material + 48) >> 3], u, v), reflected:true, coefficient:p };
        } else if (turbo.Runtime._mem_uint8[(material + 72) >> 0]) {
            let refracted:Ray = n.refract(this, n1, n2);
            refracted.origin = refracted.origin.add(refracted.direction.mulScalar(1e-4));
            return { ray: refracted.coneBounce(turbo.Runtime._mem_float64[(material + 48) >> 3], u, v), reflected: true, coefficient: 1 - p };
        } else {
            return { ray: n.weightedBounce(u, v), reflected: false, coefficient: 1 - p };
        }
    }
}

interface Hit{
    Shape:number;
}
interface Ray{

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
         turbo.Runtime._mem_uint32[(SELF + 4) >> 2] = id; 
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
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
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
              throw turbo.Runtime._badType(SELF);
        }
    }
    static ToJSON(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
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
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Compile(SELF , c) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
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
              throw turbo.Runtime._badType(SELF);
        }
    }
    static BoundingBox(SELF , c) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
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
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Intersect(SELF , ray,c) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
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
              throw turbo.Runtime._badType(SELF);
        }
    }
    static UV(SELF , p,c) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
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
              throw turbo.Runtime._badType(SELF);
        }
    }
    static NormalAt(SELF , p,c) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
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
              throw turbo.Runtime._badType(SELF);
        }
    }
    static MaterialAt(SELF , p,c) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
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
              throw turbo.Runtime._badType(SELF);
        }
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=255446; return SELF; }
}
turbo.Runtime._idToType[255446] = Shape;

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
         turbo.Runtime._mem_int32[(SELF + 12) >> 2] = shape; 
		 turbo.Runtime._mem_int32[(SELF + 16) >> 2] = matrix; 
		 turbo.Runtime._mem_int32[(SELF + 20) >> 2] = (Matrix.Inverse(matrix)); 
		 turbo.Runtime._mem_int32[(SELF + 24) >> 2] = (Matrix.Transpose(turbo.Runtime._mem_int32[(SELF + 20) >> 2])); 
		return SELF;
	}

	static NewTransformedShape(s:number, m:number):number {
		return TransformedShape.init(TransformedShape.initInstance(turbo.Runtime.allocOrThrow(28,4)), s, m);
	}
    static BoundingBox_impl(SELF) {
        if(!turbo.Runtime._mem_int32[(SELF + 8) >> 2]){
             turbo.Runtime._mem_int32[(SELF + 8) >> 2] = (Matrix.MulBox(turbo.Runtime._mem_int32[(SELF + 16) >> 2], Shape.BoundingBox(turbo.Runtime._mem_int32[(SELF + 12) >> 2]))); 
        }
        return turbo.Runtime._mem_int32[(SELF + 8) >> 2];
	}
    static Intersect_impl(SELF, r:Ray):Hit {

        let invMat = turbo.Runtime._mem_int32[(SELF + 20) >> 2];
		let shapeRay:Ray = Matrix.MulRay(invMat, r);
		let hit = Shape.Intersect(turbo.Runtime._mem_int32[(SELF + 12) >> 2], shapeRay);
		if (!hit.Ok()) {
			return hit;
		}
        let transMat = turbo.Runtime._mem_int32[(SELF + 24) >> 2];
		let shape:number = hit.Shape;
		let shapePosition:Vector3 = shapeRay.position(hit.T);
		let shapeNormal:Vector3 = Shape.NormalAt(shape, shapePosition);
		let position:Vector3 = Matrix.MulPosition_vec3(turbo.Runtime._mem_int32[(SELF + 16) >> 2], shapePosition);
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
        return Shape.Type(turbo.Runtime._mem_int32[(SELF + 12) >> 2]);
    }
    static ToJSON_impl(SELF){
        return Shape.ToJSON(turbo.Runtime._mem_int32[(SELF + 12) >> 2]);
    }
    static Compile_impl(SELF, c?:number){
        return Shape.Compile(turbo.Runtime._mem_int32[(SELF + 12) >> 2], c);
    }
    static UV_impl(SELF:number, p:Vector3, c?:number):number{
        return Shape.UV(turbo.Runtime._mem_int32[(SELF + 12) >> 2], p, c);
    }
    static NormalAt_impl(SELF:number, p:Vector3, c?:number):number{
        return Shape.NormalAt(turbo.Runtime._mem_int32[(SELF + 12) >> 2], p, c);
    }
    static MaterialAt_impl(SELF:number, p:Vector3, c?:number):number{
        return Shape.MaterialAt(turbo.Runtime._mem_int32[(SELF + 12) >> 2], p, c);
    }
    static BoundingBox(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 124486674:
                return TransformedShape.BoundingBox_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Intersect(SELF , r) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 124486674:
                return TransformedShape.Intersect_impl(SELF , r);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Type(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 124486674:
                return TransformedShape.Type_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static ToJSON(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 124486674:
                return TransformedShape.ToJSON_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Compile(SELF , c) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 124486674:
                return TransformedShape.Compile_impl(SELF , c);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static UV(SELF , p,c) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 124486674:
                return TransformedShape.UV_impl(SELF , p,c);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static NormalAt(SELF , p,c) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 124486674:
                return TransformedShape.NormalAt_impl(SELF , p,c);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static MaterialAt(SELF , p,c) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 124486674:
                return TransformedShape.MaterialAt_impl(SELF , p,c);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=124486674; return SELF; }
}
turbo.Runtime._idToType[124486674] = TransformedShape;

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
         turbo.Runtime._mem_int32[(SELF + 8) >> 2] = min; 
         turbo.Runtime._mem_int32[(SELF + 12) >> 2] = max; 
         turbo.Runtime._mem_int32[(SELF + 16) >> 2] = material; 
         turbo.Runtime._mem_int32[(SELF + 20) >> 2] = box; 
        return SELF;
    }
    static NewCube(min, max, material):number {
        let box = Box.Init_mem(Box.initInstance(turbo.Runtime.allocOrThrow(12,4)), min, max);
        return Cube.init(Cube.initInstance(turbo.Runtime.allocOrThrow(24,4)), min, max, material, box);
    }
    static Type_impl(SELF:number){
        throw ShapeType.CUBE;
    }
    static ToJSON_impl(SELF){
        return {
            min:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 8) >> 2]),
            max:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 12) >> 2]),
            material:Material.ToJSON(turbo.Runtime._mem_int32[(SELF + 16) >> 2]),
            box:Box.ToJSON(turbo.Runtime._mem_int32[(SELF + 20) >> 2]),
        }
    }
    static Compile_impl(SELF){
    }
    static BoundingBox_impl(SELF):number {
        return turbo.Runtime._mem_int32[(SELF + 20) >> 2];
    }
    static Intersect_impl(SELF, r:Ray):Hit {
        let min = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
        let max = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 12) >> 2]);

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
        let min = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
        let max = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 12) >> 2]);
        let uv = p.sub(min).div(max.sub(min));
        min = null;
        max = null;
        return new Vector3(uv.x, uv.z, 0);
    }
    static MaterialAt_impl(SELF, p:Vector3):number {
        return turbo.Runtime._mem_int32[(SELF + 16) >> 2];
    }
    static NormalAt_impl(SELF, p:Vector3):Vector3 {

        let min = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
        let max = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 12) >> 2]);

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
        let a = turbo.Runtime._mem_int32[(SELF + 8) >> 2];
        let b = turbo.Runtime._mem_int32[(SELF + 12) >> 2];
        let z = Vector.NewVector();
        let m = turbo.Runtime._mem_int32[(SELF + 16) >> 2];
        let v000 = Vector.NewVector(turbo.Runtime._mem_float64[(a + 8) >> 3], turbo.Runtime._mem_float64[(a + 16) >> 3], turbo.Runtime._mem_float64[(a + 24) >> 3]);
        let v001 = Vector.NewVector(turbo.Runtime._mem_float64[(a + 8) >> 3], turbo.Runtime._mem_float64[(a + 16) >> 3], turbo.Runtime._mem_float64[(b + 24) >> 3]);
        let v010 = Vector.NewVector(turbo.Runtime._mem_float64[(a + 8) >> 3], turbo.Runtime._mem_float64[(b + 16) >> 3], turbo.Runtime._mem_float64[(a + 24) >> 3]);
        let v011 = Vector.NewVector(turbo.Runtime._mem_float64[(a + 8) >> 3], turbo.Runtime._mem_float64[(b + 16) >> 3], turbo.Runtime._mem_float64[(b + 24) >> 3]);
        let v100 = Vector.NewVector(turbo.Runtime._mem_float64[(b + 8) >> 3], turbo.Runtime._mem_float64[(a + 16) >> 3], turbo.Runtime._mem_float64[(a + 24) >> 3]);
        let v101 = Vector.NewVector(turbo.Runtime._mem_float64[(b + 8) >> 3], turbo.Runtime._mem_float64[(a + 16) >> 3], turbo.Runtime._mem_float64[(b + 24) >> 3]);
        let v110 = Vector.NewVector(turbo.Runtime._mem_float64[(b + 8) >> 3], turbo.Runtime._mem_float64[(b + 16) >> 3], turbo.Runtime._mem_float64[(a + 24) >> 3]);
        let v111 = Vector.NewVector(turbo.Runtime._mem_float64[(b + 8) >> 3], turbo.Runtime._mem_float64[(b + 16) >> 3], turbo.Runtime._mem_float64[(b + 24) >> 3]);
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
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48824165:
                return Cube.Type_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static ToJSON(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48824165:
                return Cube.ToJSON_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Compile(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48824165:
                return Cube.Compile_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static BoundingBox(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48824165:
                return Cube.BoundingBox_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Intersect(SELF , r) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48824165:
                return Cube.Intersect_impl(SELF , r);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static UV(SELF , p) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48824165:
                return Cube.UV_impl(SELF , p);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static MaterialAt(SELF , p) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48824165:
                return Cube.MaterialAt_impl(SELF , p);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static NormalAt(SELF , p) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48824165:
                return Cube.NormalAt_impl(SELF , p);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=48824165; return SELF; }
}
turbo.Runtime._idToType[48824165] = Cube;


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
		 turbo.Runtime._mem_int32[(SELF + 8) >> 2] = center; 
		 turbo.Runtime._mem_float64[(SELF + 16) >> 3] = radius; 
		 turbo.Runtime._mem_int32[(SELF + 24) >> 2] = material; 
		 turbo.Runtime._mem_int32[(SELF + 28) >> 2] = box; 
		return SELF;
	}

	static NewSphere(center:number, radius:number, material:number):number {
		let min = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
		let max = Vector.initInstance(turbo.Runtime.allocOrThrow(32,8));
		Vector.Init_mem(min, turbo.Runtime._mem_float64[(center + 8) >> 3] - radius, turbo.Runtime._mem_float64[(center + 16) >> 3] - radius, turbo.Runtime._mem_float64[(center + 24) >> 3] - radius);
		Vector.Init_mem(max, turbo.Runtime._mem_float64[(center + 8) >> 3] + radius, turbo.Runtime._mem_float64[(center + 16) >> 3] + radius, turbo.Runtime._mem_float64[(center + 24) >> 3] + radius);
		let box = Box.initInstance(turbo.Runtime.allocOrThrow(12,4));
		Box.Init_mem(box , min, max);
		let ptr:number = Sphere.initInstance(turbo.Runtime.allocOrThrow(32,8));
		return Sphere.init(ptr, center, radius, material, box);
	}
    static Type_impl(SELF){
		return ShapeType.SPHERE;
	}
    static ToJSON_impl(SELF){
		return {
			center:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 8) >> 2]),
			radius:turbo.Runtime._mem_float64[(SELF + 16) >> 3],
			material:Material.ToJSON(turbo.Runtime._mem_int32[(SELF + 24) >> 2]),
			box:Box.ToJSON(turbo.Runtime._mem_int32[(SELF + 28) >> 2]),
		}
	}
    static Compile_impl(SELF) {
	}
    static BoundingBox_impl(SELF):number {
		return turbo.Runtime._mem_int32[(SELF + 28) >> 2];
	}
    static Intersect_impl(SELF, r:Ray):Hit {

        let center:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
		let to:Vector3 = r.origin.sub(center);
		let b:number = to.dot(r.direction);
		let c:number = to.dot(to) - turbo.Runtime._mem_float64[(SELF + 16) >> 3] * turbo.Runtime._mem_float64[(SELF + 16) >> 3];
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
        let center:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
        p = p.sub(center);
        u = Math.atan2(p.z, p.x);
        v = Math.atan2(p.y, new Vector3(p.x, 0, p.z).length());
        u = 1 - (u + Math.PI) / (2 * Math.PI);
        v = (v + Math.PI/2) / Math.PI;
        center = null;
        return new Vector3(u, v, 0);
	}
    static MaterialAt_impl(SELF, _p:Vector3):number {
		return turbo.Runtime._mem_int32[(SELF + 24) >> 2];
	}
    static NormalAt_impl(SELF, p:Vector3):Vector3 {
        let center:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
        let p = p.sub(center).normalize();
        center = null;
        return p;
	}
    static Type(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 171432461:
                return Sphere.Type_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static ToJSON(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 171432461:
                return Sphere.ToJSON_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Compile(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 171432461:
                return Sphere.Compile_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static BoundingBox(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 171432461:
                return Sphere.BoundingBox_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Intersect(SELF , r) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 171432461:
                return Sphere.Intersect_impl(SELF , r);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static UV(SELF , p) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 171432461:
                return Sphere.UV_impl(SELF , p);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static MaterialAt(SELF , _p) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 171432461:
                return Sphere.MaterialAt_impl(SELF , _p);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static NormalAt(SELF , p) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 171432461:
                return Sphere.NormalAt_impl(SELF , p);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=171432461; return SELF; }
}
turbo.Runtime._idToType[171432461] = Sphere;

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
         turbo.Runtime._mem_int32[(SELF + 8) >> 2] = v1; 
         turbo.Runtime._mem_int32[(SELF + 12) >> 2] = v2; 
         turbo.Runtime._mem_int32[(SELF + 16) >> 2] = v3; 
         turbo.Runtime._mem_int32[(SELF + 20) >> 2] = n1; 
         turbo.Runtime._mem_int32[(SELF + 24) >> 2] = n2; 
         turbo.Runtime._mem_int32[(SELF + 28) >> 2] = n3; 
         turbo.Runtime._mem_int32[(SELF + 32) >> 2] = t1; 
         turbo.Runtime._mem_int32[(SELF + 36) >> 2] = t2; 
         turbo.Runtime._mem_int32[(SELF + 40) >> 2] = t3; 
         turbo.Runtime._mem_int32[(SELF + 44) >> 2] = material; 
		return SELF;
	}

	static NewTriangle(v1:number, v2:number, v3:number, t1:number, t2:number, t3:number, material:number):number {
		let SELF = Triangle.initInstance(turbo.Runtime.allocOrThrow(53,4));
		 turbo.Runtime._mem_int32[(SELF + 8) >> 2] = v1; 
		 turbo.Runtime._mem_int32[(SELF + 12) >> 2] = v2; 
		 turbo.Runtime._mem_int32[(SELF + 16) >> 2] = v3; 
		 turbo.Runtime._mem_int32[(SELF + 32) >> 2] = t1; 
		 turbo.Runtime._mem_int32[(SELF + 36) >> 2] = t2; 
		 turbo.Runtime._mem_int32[(SELF + 40) >> 2] = t3; 
		 turbo.Runtime._mem_int32[(SELF + 44) >> 2] = material; 
		//Triangle.FixNormals(SELF );
		return SELF;
	}

    static Pack(triangles:number[]):number {
        let packed = turbo.Runtime.allocOrThrow( 4 + ( 4 * (triangles.length) ), 4 ) /*Array*/;
        turbo.Runtime._mem_int32[packed >> 2] = (triangles.length);
        triangles.forEach((triangle, i) =>{
            turbo.Runtime._mem_int32[(  packed + 4 + (4 * i)  ) >> 2] = triangle;
        });
        return packed;
    }

    static Copy(a:number, b:number):number{
        turbo.Runtime._mem_int32[(b + 8) >> 2] = Vector.Clone(turbo.Runtime._mem_int32[(a + 8) >> 2]);
        turbo.Runtime._mem_int32[(b + 12) >> 2] = Vector.Clone(turbo.Runtime._mem_int32[(a + 12) >> 2]);
        turbo.Runtime._mem_int32[(b + 16) >> 2] = Vector.Clone(turbo.Runtime._mem_int32[(a + 16) >> 2]);
        turbo.Runtime._mem_int32[(b + 20) >> 2] = Vector.Clone(turbo.Runtime._mem_int32[(a + 20) >> 2]);
        turbo.Runtime._mem_int32[(b + 24) >> 2] = Vector.Clone(turbo.Runtime._mem_int32[(a + 24) >> 2]);
        turbo.Runtime._mem_int32[(b + 28) >> 2] = Vector.Clone(turbo.Runtime._mem_int32[(a + 28) >> 2]);
        turbo.Runtime._mem_int32[(b + 32) >> 2] = Vector.Clone(turbo.Runtime._mem_int32[(a + 32) >> 2]);
        turbo.Runtime._mem_int32[(b + 36) >> 2] = Vector.Clone(turbo.Runtime._mem_int32[(a + 36) >> 2]);
        turbo.Runtime._mem_int32[(b + 40) >> 2] = Vector.Clone(turbo.Runtime._mem_int32[(a + 40) >> 2]);
        turbo.Runtime._mem_int32[(b + 44) >> 2] = Material.Clone(turbo.Runtime._mem_int32[(a + 44) >> 2]);
        return b;
    }

    // static Vertices(SELF){
	// 	return {
     //        V1:turbo.Runtime._mem_int32[(SELF + 8) >> 2],
     //        V2:turbo.Runtime._mem_int32[(SELF + 12) >> 2],
     //        V3:turbo.Runtime._mem_int32[(SELF + 16) >> 2]
     //    }
	// }
    static Type_impl(SELF:number){
        return ShapeType.TRIANGLE;
    }
    static ToJSON_impl(SELF){
		return {
			vertex:{
				v1:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 8) >> 2]),
				v2:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 12) >> 2]),
				v3:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 16) >> 2])
			},
			normal:{
				n1:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 20) >> 2]),
				n2:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 24) >> 2]),
				n3:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 28) >> 2])
			},
			uv:{
				t1:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 32) >> 2]),
				t2:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 36) >> 2]),
				t3:Vector.ToJSON(turbo.Runtime._mem_int32[(SELF + 40) >> 2])
			},
			material:Material.ToJSON(turbo.Runtime._mem_int32[(SELF + 44) >> 2]),
			box:Box.ToJSON(turbo.Runtime._mem_int32[(SELF + 48) >> 2]),
		}
	}
    static Compile_impl(SELF) {
	}
    static BoundingBox_impl(SELF, c?:number):number{
        if(turbo.Runtime._mem_uint8[(SELF + 52) >> 0]){
            return turbo.Runtime._mem_int32[(SELF + 48) >> 2];
        }else {
            var min = Vector.Min_mem(Vector.Min_mem(turbo.Runtime._mem_int32[(SELF + 8) >> 2], turbo.Runtime._mem_int32[(SELF + 12) >> 2]), turbo.Runtime._mem_int32[(SELF + 16) >> 2]);
            var max = Vector.Max_mem(Vector.Max_mem(turbo.Runtime._mem_int32[(SELF + 8) >> 2], turbo.Runtime._mem_int32[(SELF + 12) >> 2]), turbo.Runtime._mem_int32[(SELF + 16) >> 2]);
             turbo.Runtime._mem_int32[(SELF + 48) >> 2] = (c?c:Box.initInstance(turbo.Runtime.allocOrThrow(12,4))); 
             turbo.Runtime._mem_uint8[(SELF + 52) >> 0] = 1; 
        }
		return Box.Init_mem(turbo.Runtime._mem_int32[(SELF + 48) >> 2], min, max);
	}
    /*Intersect(SELF, r:Ray):Hit {
        //Möller–Trumbore intersection algorithm
        let V1 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
        let V2 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 12) >> 2]);
        let V3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 16) >> 2]);

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

		let e1x = turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 12) >> 2]) + 8) >> 3] - turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 8) >> 3];
        let e1y = turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 12) >> 2]) + 16) >> 3] - turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 16) >> 3];
        let e1z = turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 12) >> 2]) + 24) >> 3] - turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 24) >> 3];
        let e2x = turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 16) >> 2]) + 8) >> 3] - turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 8) >> 3];
        let e2y = turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 16) >> 2]) + 16) >> 3] - turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 16) >> 3];
        let e2z = turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 16) >> 2]) + 24) >> 3] - turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 24) >> 3];
        let px = r.direction.y * e2z - r.direction.z * e2y;
        let py = r.direction.z * e2x - r.direction.x * e2z;
        let pz = r.direction.x * e2y - r.direction.y * e2x;
		let det = e1x * px + e1y * py + e1z * pz;
		if (det > -EPS && det < EPS) {
			return Hit.NoHit;
		}
		let inv = 1 / det;
        let tx = r.origin.x - turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 8) >> 3];
        let ty = r.origin.y - turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 16) >> 3];
        let tz = r.origin.z - turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 24) >> 3];
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

        let T1:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 32) >> 2]);
        let T2:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 36) >> 2]);
        let T3:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 40) >> 2]);

        let uvw = Triangle.Barycentric(SELF, p);
        let n = new Vector3();
        n = n.add(T1.mulScalar(uvw.u));
        n = n.add(T2.mulScalar(uvw.v));
        n = n.add(T3.mulScalar(uvw.w));
        n.z = 0;
		return n
	}
    static MaterialAt_impl(SELF, p:Vector3):Vector3 {
		return turbo.Runtime._mem_int32[(SELF + 44) >> 2];
	}
    static NormalAt_impl(SELF, p:Vector3):Vector3 {

        // let V1:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
        // let V2:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 12) >> 2]);
        // let V3:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 16) >> 2]);

        let n1:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 20) >> 2]);
        let n2:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 24) >> 2]);
        let n3:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 28) >> 2]);

        // let T1:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 32) >> 2]);
        // let T2:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 36) >> 2]);
        // let T3:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 40) >> 2]);

		let uvw = Triangle.Barycentric(SELF, p);
		let n = new Vector3();
        n = n.add(n1.mulScalar(uvw.u));
        n = n.add(n2.mulScalar(uvw.v));
        n = n.add(n3.mulScalar(uvw.w));

		/*if (turbo.Runtime._mem_int32[((turbo.Runtime._mem_int32[(SELF + 44) >> 2]) + 12) >> 2]) {
			let b = new Vector3();
            b = b.add(T1.mulScalar(uvw.u));
            b = b.add(T2.mulScalar(uvw.v));
            b = b.add(T3.mulScalar(uvw.w));
			let ns:Vector3 = Texture.NormalSample(turbo.Runtime._mem_int32[((turbo.Runtime._mem_int32[(SELF + 44) >> 2]) + 12) >> 2], b.x, b.y);
			let dv1 = V2.sub(V1);
            let dv2 = V3.sub(V1);
            let dt1 = T2.sub(T1);
            let dt2 = T3.sub(T1);

			let T = dv1.mulScalar(dt2.y).sub(dv2.mulScalar(dt1.y)).normalize();
			let B = dv2.mulScalar(dt1.x).sub(dv1.mulScalar(dt2.x)).normalize();
            let N = T.cross(B);
			let matrix = Matrix.initInstance(turbo.Runtime.allocOrThrow(136,8));
			Matrix.init(matrix,
					T.x, B.x, N.x, 0,
					T.y, B.y, N.y, 0,
					T.z, B.z, N.z, 0,
					0, 0, 0, 1);
			n = Matrix.MulDirection2(matrix, ns);
		}
		if (turbo.Runtime._mem_int32[((turbo.Runtime._mem_int32[(SELF + 44) >> 2]) + 16) >> 2]) {
			let b = new Vector3();
            b = b.add(T1.mulScalar(uvw.u));
            b = b.add(T2.mulScalar(uvw.v));
            b = b.add(T3.mulScalar(uvw.w));
			let bump = Texture.BumpSample(turbo.Runtime._mem_int32[((turbo.Runtime._mem_int32[(SELF + 44) >> 2]) + 16) >> 2], b.x, b.y);
            let dv1 = V2.sub(V1);
            let dv2 = V3.sub(V1);
            let dt1 = T2.sub(T1);
            let dt2 = T3.sub(T1);
			let tangent = dv1.mulScalar(dt2.y).sub(dv2.mulScalar(dt1.y)).normalize();
			let bitangent = dv2.mulScalar(dt1.x).sub(dv1.mulScalar(dt2.x)).normalize();
			n = n.add(tangent.mulScalar(bump.x * turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 44) >> 2]) + 24) >> 3]));
			n = n.add(bitangent.mulScalar(bump.y * turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(SELF + 44) >> 2]) + 24) >> 3]));
		}*/
		n = n.normalize();
		return n;
	}

	static Area(SELF):number {
		let e1 = Vector.Sub_mem(turbo.Runtime._mem_int32[(SELF + 12) >> 2], turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
		let e2 = Vector.Sub_mem(turbo.Runtime._mem_int32[(SELF + 16) >> 2], turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
		let n = Vector.Cross_mem(e1, e2);
		return Vector.Length_mem(n) / 2;
	}

	static Barycentric(SELF, p:Vector3):{u:number, v:number, w:number} {
        let V1:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
        let V2:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 12) >> 2]);
        let V3:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(SELF + 16) >> 2]);
        let v0 = V2.sub(V1);
        let V1 = V3.sub(V1);
        let V2 = p.sub(V1);
		let d00 = v0.dot(v0);
		let d01 = v0.dot(V1);
		let d11 = V1.dot(V1);
		let d20 = V2.dot(v0);
		let d21 = V2.dot(V1);
		let d = d00*d11 - d01*d01;
		let v = (d11*d20 - d01*d21) / d;
		let w = (d00*d21 - d01*d20) / d;
		let u = 1 - v - w;
		return {u:u,v:v,w:w};
	}

    static UpdateBox(SELF) {
        var min = Vector.Min_mem(Vector.Min_mem(turbo.Runtime._mem_int32[(SELF + 8) >> 2], turbo.Runtime._mem_int32[(SELF + 12) >> 2]), turbo.Runtime._mem_int32[(SELF + 16) >> 2]);
        var max = Vector.Max_mem(Vector.Max_mem(turbo.Runtime._mem_int32[(SELF + 8) >> 2], turbo.Runtime._mem_int32[(SELF + 12) >> 2]), turbo.Runtime._mem_int32[(SELF + 16) >> 2]);
         turbo.Runtime._mem_int32[(SELF + 48) >> 2] = (Box.initInstance(turbo.Runtime.allocOrThrow(12,4))); 
         turbo.Runtime._mem_uint8[(SELF + 52) >> 0] = 1; 
        return Box.Init_mem(turbo.Runtime._mem_int32[(SELF + 48) >> 2], min, max);
    }

	static FixNormals(SELF) {
		let e1 = Vector.Sub_mem(turbo.Runtime._mem_int32[(SELF + 12) >> 2], turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
		let e2 = Vector.Sub_mem(turbo.Runtime._mem_int32[(SELF + 16) >> 2], turbo.Runtime._mem_int32[(SELF + 8) >> 2]);
		let n = Vector.Normalize_mem(Vector.Cross_mem(e1, e2));

        if(Vector.IsZero(turbo.Runtime._mem_int32[(SELF + 20) >> 2])) {
            Vector.Copy(turbo.Runtime._mem_int32[(SELF + 20) >> 2], n);
        }
        if(Vector.IsZero(turbo.Runtime._mem_int32[(SELF + 24) >> 2])) {
            Vector.Copy(turbo.Runtime._mem_int32[(SELF + 24) >> 2], n);
        }
        if(Vector.IsZero(turbo.Runtime._mem_int32[(SELF + 28) >> 2])) {
            Vector.Copy(turbo.Runtime._mem_int32[(SELF + 28) >> 2], n);
        }
        free(e1);
        free(e2);
        free(n);
	}
    static Type(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 232773086:
                return Triangle.Type_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static ToJSON(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 232773086:
                return Triangle.ToJSON_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Compile(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 232773086:
                return Triangle.Compile_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static BoundingBox(SELF , c) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 232773086:
                return Triangle.BoundingBox_impl(SELF , c);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Intersect(SELF , r) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 232773086:
                return Triangle.Intersect_impl(SELF , r);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static UV(SELF , p) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 232773086:
                return Triangle.UV_impl(SELF , p);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static MaterialAt(SELF , p) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 232773086:
                return Triangle.MaterialAt_impl(SELF , p);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static NormalAt(SELF , p) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 232773086:
                return Triangle.NormalAt_impl(SELF , p);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=232773086; return SELF; }
}
turbo.Runtime._idToType[232773086] = Triangle;


export class Mesh extends Shape{
   static NAME:string = "Mesh";
   static SIZE:number = 20;
   static ALIGN:number = 4;
   static CLSID:number = 48819938;

   static get BASE():string{
       return Shape
   }

   constructor(p:number){
       super(p);
   }

    static init(SELF, triangles:number){
        console.log(`numTriangles:${turbo.Runtime._mem_int32[triangles >> 2]}`);
         turbo.Runtime._mem_int32[(SELF + 8) >> 2] = triangles; 
         turbo.Runtime._mem_int32[(SELF + 12) >> 2] = 0; 
         turbo.Runtime._mem_int32[(SELF + 16) >> 2] = 0; 
        return SELF;
	}
	static NewMesh(triangles:number):number{
		let ptr:number = Mesh.initInstance(turbo.Runtime.allocOrThrow(20,4));
		return Mesh.init(ptr, triangles);
	}

	static dirty(SELF) {
		 turbo.Runtime._mem_int32[(SELF + 12) >> 2] = null; 
		 turbo.Runtime._mem_int32[(SELF + 16) >> 2] = null; 
	}

	Copy(SELF):number {
		let numTriangles:number = turbo.Runtime._mem_int32[(turbo.Runtime._mem_int32[(SELF + 8) >> 2]) >> 2];
		let triangles = turbo.Runtime.allocOrThrow( 4 + ( 4 * numTriangles ), 4 ) /*Array*/;
        turbo.Runtime._mem_int32[triangles >> 2] = numTriangles;
		for (let i=0; i < numTriangles;i++) {
			let t = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
			let a = Triangle.initInstance(turbo.Runtime.allocOrThrow(53,4));
			Triangle.Copy(t, a);
			turbo.Runtime._mem_int32[(  triangles + 4 + (4 * i)  ) >> 2] = a;
		}
		return Mesh.NewMesh(triangles);
	}
    static Type_impl(SELF:number){
        throw ShapeType.MESH;
    }
    static ToJSON_impl(SELF){
        return {
            numTriangles:turbo.Runtime._mem_int32[(turbo.Runtime._mem_int32[(SELF + 8) >> 2]) >> 2],
            box:Box.ToJSON(turbo.Runtime._mem_int32[(SELF + 12) >> 2]),
            tree:turbo.Runtime._mem_int32[(SELF + 16) >> 2]
        }
    }
    static Compile_impl(SELF) {
		if (!turbo.Runtime._mem_int32[(SELF + 16) >> 2]) {
			 turbo.Runtime._mem_int32[(SELF + 16) >> 2] = (Tree.NewTree(turbo.Runtime._mem_int32[(SELF + 8) >> 2])); 
		}
        return turbo.Runtime._mem_int32[(SELF + 16) >> 2];
	}

	static Add(SELF, mesh:Mesh) {
        //TODO: Implement
        Mesh.dirty(SELF);
	}
    static BoundingBox_impl(SELF):number {
		if (!turbo.Runtime._mem_int32[(SELF + 12) >> 2]) {

            let t = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 4 + (4 * 0)  ) >> 2];
			let min = Vector.Clone(turbo.Runtime._mem_int32[(t + 8) >> 2]);
			let max = Vector.Clone(min);
            let NumTriangles = turbo.Runtime._mem_int32[(turbo.Runtime._mem_int32[(SELF + 8) >> 2]) >> 2];
			for (let i=1;i < NumTriangles;i++) {
				Vector.Min_mem(Vector.Min_mem(Vector.Min_mem(min, t.V1, min), t.V2, min), t.V3, min);
				Vector.Max_mem(Vector.Max_mem(Vector.Max_mem(max, t.V1, max), t.V2, max), t.V3, max);
			}
            let ptr:number = Box.initInstance(turbo.Runtime.allocOrThrow(12,4));
			 turbo.Runtime._mem_int32[(SELF + 12) >> 2] = (Box.Init_mem(ptr, min, max)); 
		}
		return turbo.Runtime._mem_int32[(SELF + 12) >> 2];
	}
    static Intersect_impl(SELF, r:number):Hit {
		return Tree.Intersect(turbo.Runtime._mem_int32[(SELF + 16) >> 2], r);
	}
    static UV_impl(SELF, p:number):number {
		return null; // not implemented
	}
    static MaterialAt_impl(SELF, p:number):number {
		return null; // not implemented
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
		let NumTriangles = turbo.Runtime._mem_int32[(turbo.Runtime._mem_int32[(SELF + 8) >> 2]) >> 2];
		for (let i=0; i < NumTriangles; i++) {
            let t:number = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
			lookup[turbo.Runtime._mem_int32[(t + 8) >> 2]] = Utils.append(lookup[turbo.Runtime._mem_int32[(t + 8) >> 2]], turbo.Runtime._mem_int32[(t + 20) >> 2]);
			lookup[turbo.Runtime._mem_int32[(t + 12) >> 2]] = Utils.append(lookup[turbo.Runtime._mem_int32[(t + 12) >> 2]], turbo.Runtime._mem_int32[(t + 24) >> 2]);
			lookup[turbo.Runtime._mem_int32[(t + 16) >> 2]] = Utils.append(lookup[turbo.Runtime._mem_int32[(t + 16) >> 2]], turbo.Runtime._mem_int32[(t + 28) >> 2]);
		}
        for (let i=0; i < NumTriangles; i++) {
            let t:number = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
			turbo.Runtime._mem_int32[(t + 20) >> 2] = Mesh._SmoothNormalsThreshold(SELF, turbo.Runtime._mem_int32[(t + 20) >> 2], lookup[turbo.Runtime._mem_int32[(t + 8) >> 2]], threshold);
			turbo.Runtime._mem_int32[(t + 24) >> 2] = Mesh._SmoothNormalsThreshold(SELF, turbo.Runtime._mem_int32[(t + 24) >> 2], lookup[turbo.Runtime._mem_int32[(t + 12) >> 2]], threshold);
			turbo.Runtime._mem_int32[(t + 28) >> 2] = Mesh._SmoothNormalsThreshold(SELF, turbo.Runtime._mem_int32[(t + 28) >> 2], lookup[turbo.Runtime._mem_int32[(t + 16) >> 2]], threshold);
		}
	}

	static SmoothNormals(SELF) {
		let lookup:number[] = [];
		let NumTriangles = turbo.Runtime._mem_int32[(turbo.Runtime._mem_int32[(SELF + 8) >> 2]) >> 2];
        for (let i=0; i < NumTriangles; i++) {
            let t:number = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
			Vector.Add_mem(lookup[turbo.Runtime._mem_int32[(t + 8) >> 2]], turbo.Runtime._mem_int32[(t + 20) >> 2], lookup[turbo.Runtime._mem_int32[(t + 8) >> 2]]);
			Vector.Add_mem(lookup[turbo.Runtime._mem_int32[(t + 12) >> 2]], turbo.Runtime._mem_int32[(t + 24) >> 2], lookup[turbo.Runtime._mem_int32[(t + 12) >> 2]]);
			Vector.Add_mem(lookup[turbo.Runtime._mem_int32[(t + 16) >> 2]], turbo.Runtime._mem_int32[(t + 28) >> 2], lookup[turbo.Runtime._mem_int32[(t + 16) >> 2]]);
		}
		for (let i=0;i < lookup.length;i++) {
			 Vector.Normalize_mem(lookup[i], lookup[i]);
		}
        for (let i=0; i < NumTriangles; i++) {
            let t:number = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
            turbo.Runtime._mem_int32[(t + 20) >> 2] = lookup[turbo.Runtime._mem_int32[(t + 8) >> 2]];
			turbo.Runtime._mem_int32[(t + 24) >> 2] = lookup[turbo.Runtime._mem_int32[(t + 12) >> 2]];
			turbo.Runtime._mem_int32[(t + 28) >> 2] = lookup[turbo.Runtime._mem_int32[(t + 16) >> 2]];
		}
	}

	static UnitCube(SELF) {
		Mesh.FitInside(SELF, Box.NewBox(Vector.NewVector(), Vector.NewVector(1, 1, 1)), Vector.NewVector());
        Mesh.MoveTo(SELF, Vector.NewVector(), Vector.NewVector(0.5, 0.5, 0.5));
	}

	static MoveTo(SELF, position:number, anchor:number):number {
		let matrix = Matrix.TranslateUnitMatrix(Vector.Sub_mem(position, Box.Anchor(Mesh.BoundingBox(SELF), anchor)) );
		return Matrix.Transform(SELF, matrix);
	}

	static FitInside(SELF, box:number, anchor:number) {
        let bsize:number = Box.Size(box);
        let mbox:number = Mesh.BoundingBox(SELF);
        let mbsize:number = Box.Size(mbox);
		let scale:number = Vector.MinComponent_mem(Vector.Div_mem(bsize, mbsize));
		let extra:number = Vector.MulScalar_mem(Vector.Sub_mem(bsize, mbsize), scale);
		let matrix:number = Matrix.Identity();
		Matrix.Translate(matrix, Vector.Negate_mem(turbo.Runtime._mem_int32[(mbox + 4) >> 2]), matrix);
		Matrix.Scale(matrix, Vector.NewVector(scale, scale, scale), matrix);
		Matrix.Translate(matrix, Vector.Add_mem(turbo.Runtime._mem_int32[(mbox + 4) >> 2], Vector.Mul_mem(extra, anchor)));
		Mesh.Transform(SELF, matrix);
	}

	static Transform(SELF, matrix:number) {
		let NumTriangles = turbo.Runtime._mem_int32[(turbo.Runtime._mem_int32[(SELF + 8) >> 2]) >> 2];
        for (let i=0; i < NumTriangles; i++) {
            let t:number = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
			turbo.Runtime._mem_int32[(t + 8) >> 2] = Matrix.MulPosition(matrix, turbo.Runtime._mem_int32[(t + 8) >> 2]);
			turbo.Runtime._mem_int32[(t + 12) >> 2] = Matrix.MulPosition(matrix, turbo.Runtime._mem_int32[(t + 12) >> 2]);
			turbo.Runtime._mem_int32[(t + 16) >> 2] = Matrix.MulPosition(matrix, turbo.Runtime._mem_int32[(t + 16) >> 2]);
			turbo.Runtime._mem_int32[(t + 20) >> 2] = Matrix.MulDirection(matrix, turbo.Runtime._mem_int32[(t + 20) >> 2]);
			turbo.Runtime._mem_int32[(t + 24) >> 2] = Matrix.MulDirection(matrix, turbo.Runtime._mem_int32[(t + 24) >> 2]);
			turbo.Runtime._mem_int32[(t + 28) >> 2] = Matrix.MulDirection(matrix, turbo.Runtime._mem_int32[(t + 28) >> 2]);
		}
		Mesh.dirty(SELF);
	}

	static SetMaterial(material:number) {
		let NumTriangles = turbo.Runtime._mem_int32[(turbo.Runtime._mem_int32[(SELF + 8) >> 2]) >> 2];
        for (let i=0; i < NumTriangles; i++) {
            let t:number = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 8) >> 2]) + 4 + (4 * i)  ) >> 2];
			turbo.Runtime._mem_int32[(t + 44) >> 2] = material;
		}
	}

	static SaveSTL(SELF, path:number):boolean {
		//return STL.SaveSTL(path, SELF)
        //TODO: Implement
	}
    static Type(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48819938:
                return Mesh.Type_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static ToJSON(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48819938:
                return Mesh.ToJSON_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Compile(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48819938:
                return Mesh.Compile_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static BoundingBox(SELF ) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48819938:
                return Mesh.BoundingBox_impl(SELF );
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static Intersect(SELF , r) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48819938:
                return Mesh.Intersect_impl(SELF , r);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static UV(SELF , p) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48819938:
                return Mesh.UV_impl(SELF , p);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static MaterialAt(SELF , p) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48819938:
                return Mesh.MaterialAt_impl(SELF , p);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static NormalAt(SELF , p) {
        switch (turbo.Runtime._mem_int32[SELF>>2]) {
            case 48819938:
                return Mesh.NormalAt_impl(SELF , p);
            default:
              throw turbo.Runtime._badType(SELF);
        }
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=48819938; return SELF; }
}
turbo.Runtime._idToType[48819938] = Mesh;

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
         turbo.Runtime._mem_uint8[(SELF + 4) >> 0] = axis; 
         turbo.Runtime._mem_float64[(SELF + 8) >> 3] = point; 
         turbo.Runtime._mem_int32[(SELF + 16) >> 2] = shapes; 
         turbo.Runtime._mem_int32[(SELF + 20) >> 2] = numShapes; 
         turbo.Runtime._mem_int32[(SELF + 24) >> 2] = left; 
         turbo.Runtime._mem_int32[(SELF + 28) >> 2] = right; 
        return SELF;
    }

    static NewNode(shapes:number, numShapes:number):number {
        let ptr:number = Node.initInstance(turbo.Runtime.allocOrThrow(32,8));
        return Node.init(ptr, Axis.AxisNone, 0, shapes, numShapes, null, null);
    }

    static ToJSON(SELF){
        return{
            axis:Axis[turbo.Runtime._mem_uint8[(SELF + 4) >> 0]],
            point:turbo.Runtime._mem_float64[(SELF + 8) >> 3],
            numShapes:turbo.Runtime._mem_int32[(SELF + 20) >> 2],
            left:turbo.Runtime._mem_int32[(SELF + 24) >> 2],
            right:turbo.Runtime._mem_int32[(SELF + 28) >> 2]
        }
    }

    static Intersect(SELF, r:Ray, tmin:number, tmax:number):Hit {
        let tsplit:number;
        let leftFirst:boolean;

        switch (turbo.Runtime._mem_uint8[(SELF + 4) >> 0]) {
            case Axis.AxisNone:
                return Node.IntersectShapes(SELF, r);
            case Axis.AxisX:
                tsplit = (turbo.Runtime._mem_float64[(SELF + 8) >> 3] - r.origin.x) / r.direction.x;
                leftFirst = (r.origin.x < turbo.Runtime._mem_float64[(SELF + 8) >> 3]) || (r.origin.x == turbo.Runtime._mem_float64[(SELF + 8) >> 3] && r.direction.x <= 0);
                break;
            case Axis.AxisY:
                tsplit = (turbo.Runtime._mem_float64[(SELF + 8) >> 3] - r.origin.y) / r.direction.y;
                leftFirst = (r.origin.y < turbo.Runtime._mem_float64[(SELF + 8) >> 3]) || (r.origin.y == turbo.Runtime._mem_float64[(SELF + 8) >> 3] && r.direction.y <= 0);
                break;
            case Axis.AxisZ:
                tsplit = (turbo.Runtime._mem_float64[(SELF + 8) >> 3] - r.origin.z) / r.direction.z;
                leftFirst = (r.origin.z < turbo.Runtime._mem_float64[(SELF + 8) >> 3]) || (r.origin.z == turbo.Runtime._mem_float64[(SELF + 8) >> 3] && r.direction.z <= 0);
                break;
        }

        let first:number;
        let second:number;

        if (leftFirst) {
            first = turbo.Runtime._mem_int32[(SELF + 24) >> 2];
            second = turbo.Runtime._mem_int32[(SELF + 28) >> 2];
        } else {
            first = turbo.Runtime._mem_int32[(SELF + 28) >> 2];
            second = turbo.Runtime._mem_int32[(SELF + 24) >> 2];
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
        for(let i=0;i < turbo.Runtime._mem_int32[(SELF + 20) >> 2];i++) {
            let shape:number  = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 16) >> 2]) + 4 + (4 * i)  ) >> 2];
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
        for(let i=0;i < turbo.Runtime._mem_int32[(SELF + 20) >> 2];i++) {
            let shape:number  = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 16) >> 2]) + 4 + (4 * i)  ) >> 2];
            // let box = Shape.BoundingBox(shape);
            let box = turbo.Runtime._mem_int32[(shape + 48) >> 2];
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
        for(let i=0;i < turbo.Runtime._mem_int32[(SELF + 20) >> 2];i++) {
            let shape:number  = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 16) >> 2]) + 4 + (4 * i)  ) >> 2];
            let box = Shape.BoundingBox(shape);
            let lr = Box.Partition(box, axis, point);
            if (lr.left) {
                left.push(shape);
            }
            if (lr.right) {
                right.push(shape);
            }
        }

        let left_ptr = turbo.Runtime.allocOrThrow( 4 + ( 4 * (left.length) ), 4 ) /*Array*/;
        turbo.Runtime._mem_int32[left_ptr >> 2] = (left.length);
        let right_ptr = turbo.Runtime.allocOrThrow( 4 + ( 4 * (right.length) ), 4 ) /*Array*/;
        turbo.Runtime._mem_int32[right_ptr >> 2] = (right.length);

        left.forEach((item, index) => {
           turbo.Runtime._mem_int32[(  (left_ptr) + 4 + (4 * index)  ) >> 2] = item;
        });

        right.forEach((item, index) => {
           turbo.Runtime._mem_int32[(  (right_ptr) + 4 + (4 * index)  ) >> 2] = item;
        });

        return {
            left:left_ptr, numLeft:left.length,
            right:right_ptr, numRight: right.length
        };
    }

    static Split(SELF, depth:number) {
        if ( turbo.Runtime._mem_int32[(SELF + 20) >> 2] < 8) {
            return;
        }

        let size:number = turbo.Runtime._mem_int32[(SELF + 20) >> 2] * 2;

        let _xs = new Float64Array(size);
        let _ys = new Float64Array(size);
        let _zs = new Float64Array(size);

        let count = 0;
        for(let i=0;i < turbo.Runtime._mem_int32[(SELF + 20) >> 2];i++) {
            let shape:number  = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 16) >> 2]) + 4 + (4 * i)  ) >> 2];
            // let box = Shape.BoundingBox(shape);
            let box = turbo.Runtime._mem_int32[(shape + 48) >> 2];

            _xs[count] = turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(box + 4) >> 2]) + 8) >> 3];
            _ys[count] = turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(box + 4) >> 2]) + 16) >> 3];
            _zs[count] = turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(box + 4) >> 2]) + 24) >> 3];
            count++;

            _xs[count] = turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(box + 8) >> 2]) + 8) >> 3];
            _ys[count] = turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(box + 8) >> 2]) + 16) >> 3];
            _zs[count] = turbo.Runtime._mem_float64[((turbo.Runtime._mem_int32[(box + 8) >> 2]) + 24) >> 3];
            count++;
        }

        _xs.sort();
        _ys.sort();
        _zs.sort();

        let mx = Utils.Median(_xs);
        let my = Utils.Median(_ys);
        let mz = Utils.Median(_zs);
        let best = Math.round(turbo.Runtime._mem_int32[(SELF + 20) >> 2] * 0.85);
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
         turbo.Runtime._mem_uint8[(SELF + 4) >> 0] = bestAxis; 
         turbo.Runtime._mem_float64[(SELF + 8) >> 3] = bestPoint; 
         turbo.Runtime._mem_int32[(SELF + 24) >> 2] = (Node.NewNode(lr.left, lr.numLeft)); 
         turbo.Runtime._mem_int32[(SELF + 28) >> 2] = (Node.NewNode(lr.right, lr.numRight)); 
        Node.Split(turbo.Runtime._mem_int32[(SELF + 24) >> 2], depth + 1);
        Node.Split(turbo.Runtime._mem_int32[(SELF + 28) >> 2], depth + 1);
         turbo.Runtime._mem_int32[(SELF + 16) >> 2] = 0;  // only needed at leaf nodes
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=20726; return SELF; }
}
turbo.Runtime._idToType[20726] = Node;

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
         turbo.Runtime._mem_int32[(SELF + 4) >> 2] = box; 
         turbo.Runtime._mem_int32[(SELF + 8) >> 2] = root; 
        return SELF;
    }

    static NewTree(shapes:number):number {
        let numShapes = turbo.Runtime._mem_int32[shapes >> 2];
        console.log(`Building k-d tree (${numShapes} shapes)... `);
        // console.time("Tree:BuildingBox");
        let box = Box.BoxForShapes(shapes, numShapes);
        // console.timeEnd("Tree:BuildingBox");
        let node = Node.NewNode(shapes, numShapes);
        // console.time("Node:Split");
        Node.Split(node, 0);
        // console.timeEnd("Node:Split");
        let ptr:number = Tree.initInstance(turbo.Runtime.allocOrThrow(12,4));
        return Tree.init(ptr, box, node);
    }

    static Intersect(tree:number, r:number):Hit {
        let hit = Box.Intersect(turbo.Runtime._mem_int32[(tree + 4) >> 2], r);
        if (hit.tmax < hit.tmin || hit.tmax <= 0) {
            return Hit.NoHit;
        }
        return Node.Intersect(turbo.Runtime._mem_int32[(tree + 8) >> 2], r, hit.tmin, hit.tmax);
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=27694; return SELF; }
}
turbo.Runtime._idToType[27694] = Tree;



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
         turbo.Runtime._mem_int32[(SELF + 4) >> 2] = p; 
         turbo.Runtime._mem_int32[(SELF + 8) >> 2] = u; 
         turbo.Runtime._mem_int32[(SELF + 12) >> 2] = v; 
         turbo.Runtime._mem_int32[(SELF + 16) >> 2] = w; 
         turbo.Runtime._mem_float64[(SELF + 24) >> 3] = m; 
         turbo.Runtime._mem_float64[(SELF + 32) >> 3] = focalDistance; 
         turbo.Runtime._mem_float64[(SELF + 40) >> 3] = apertureRadius; 
        return SELF;
    }

    static cache;

    static NewCamera(p:number, u?:number, v?:number, w?:number, m?:number, focalDistance?:number, apertureRadius?:number){
        let ptr:number = Camera.initInstance(turbo.Runtime.allocOrThrow(48,8));
        p = p?p:Vector.NewVector();
        u = u?u:Vector.NewVector();
        v = v?v:Vector.NewVector();
        w = w?w:Vector.NewVector();
        m = m?m:Vector.NewVector();
        return Camera.init(ptr, p, u, v, w, m, focalDistance, apertureRadius);
    }

    static ToJSON(SELF){
        return {
            p:Vector.XYZ(turbo.Runtime._mem_int32[(SELF + 4) >> 2]),
            u:Vector.XYZ(turbo.Runtime._mem_int32[(SELF + 8) >> 2]),
            v:Vector.XYZ(turbo.Runtime._mem_int32[(SELF + 12) >> 2]),
            w:Vector.XYZ(turbo.Runtime._mem_int32[(SELF + 16) >> 2]),
            m:turbo.Runtime._mem_float64[(SELF + 24) >> 3],
            focalDistance:turbo.Runtime._mem_float64[(SELF + 32) >> 3],
            apertureRadius:turbo.Runtime._mem_float64[(SELF + 40) >> 3]
        };
    }

    static SetFromJSON(SELF, data){
        Vector.SetFromJSON(turbo.Runtime._mem_int32[(SELF + 4) >> 2], data.p);
        Vector.SetFromJSON(turbo.Runtime._mem_int32[(SELF + 8) >> 2], data.u);
        Vector.SetFromJSON(turbo.Runtime._mem_int32[(SELF + 12) >> 2], data.v);
        Vector.SetFromJSON(turbo.Runtime._mem_int32[(SELF + 16) >> 2], data.w);

        if(typeof data.m === "number")
             turbo.Runtime._mem_float64[(SELF + 24) >> 3] = (data.m); 
        if(typeof data.focalDistance === "number")
             turbo.Runtime._mem_float64[(SELF + 32) >> 3] = (data.focalDistance); 
        if(typeof data.apertureRadius === "number")
             turbo.Runtime._mem_float64[(SELF + 40) >> 3] = (data.apertureRadius); 
    }

    static LookAt(eye, center, up, fovy:number, c?:number):number {
        c = c?c:Camera.initInstance(turbo.Runtime.allocOrThrow(48,8));
        Camera.init(c);
        turbo.Runtime._mem_int32[(c + 4) >> 2] = eye;
        let w:number = Vector.Normalize_mem(Vector.Sub_mem(center, eye));
        turbo.Runtime._mem_int32[(c + 16) >> 2] = w;
        let u:number = Vector.Normalize_mem(Vector.Cross_mem(up, w));
        turbo.Runtime._mem_int32[(c + 8) >> 2] = u;
        turbo.Runtime._mem_int32[(c + 12) >> 2] = Vector.Normalize_mem(Vector.Cross_mem(w, u));
        turbo.Runtime._mem_float64[(c + 24) >> 3] = 1 / Math.tan(fovy*Math.PI/360);
        return c;
    }

    static SetFocus(c:number, focalPoint:number, apertureRadius:number) {
        turbo.Runtime._mem_float64[(c + 32) >> 3] = Vector.Length_mem(Vector.Sub_mem(focalPoint, turbo.Runtime._mem_int32[(c + 4) >> 2]));
        turbo.Runtime._mem_float64[(c + 40) >> 3] = apertureRadius;
    }

    /* cached camera */
    /*static CastRay(c, x:number, y:number, w:number, h:number, u:number, v:number):number {

        if(!Camera.cache){
            Camera.cache = {
                apertureRadius: turbo.Runtime._mem_float64[(c + 40) >> 3],
                focalDistance: turbo.Runtime._mem_float64[(c + 32) >> 3],
                u: new Vector3().read(turbo.Runtime._mem_int32[(c + 8) >> 2]),
                v: new Vector3().read(turbo.Runtime._mem_int32[(c + 12) >> 2]),
                p: new Vector3().read(turbo.Runtime._mem_int32[(c + 4) >> 2]),
                w: new Vector3().read(turbo.Runtime._mem_int32[(c + 16) >> 2]),
                m: turbo.Runtime._mem_float64[(c + 24) >> 3]
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

        let cu:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(c + 8) >> 2]);
        let cv:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(c + 12) >> 2]);
        let cp:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(c + 4) >> 2]);
        let cw:Vector3 = new Vector3().read(turbo.Runtime._mem_int32[(c + 16) >> 2]);

        let d = new Vector3();
        d = d.add(cu.mulScalar(-px * aspect));
        d = d.add(cv.mulScalar(-py));
        d = d.add(cw.mulScalar(turbo.Runtime._mem_float64[(c + 24) >> 3]));
        d = d.normalize();

        if (turbo.Runtime._mem_float64[(c + 40) >> 3] > 0) {
            let focalPoint = cp.add(d.mulScalar(turbo.Runtime._mem_float64[(c + 32) >> 3]));
            let angle = Math.random() * 2 * Math.PI;
            let radius = Math.random() * turbo.Runtime._mem_float64[(c + 40) >> 3];

            cp = cp.add(cu.mulScalar(Math.cos(angle) * radius));
            cp = cp.add(cv.mulScalar(Math.sin(angle) * radius));
            d = focalPoint.sub(cp).normalize();
        }
        return new Ray(cp, d);
    }
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=1632962; return SELF; }
}
turbo.Runtime._idToType[1632962] = Camera;

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
         turbo.Runtime._mem_int32[(SELF + 4) >> 2] = color; 
         turbo.Runtime._mem_int32[(SELF + 8) >> 2] = 0; 
         turbo.Runtime._mem_float64[(SELF + 16) >> 3] = 0; 
         turbo.Runtime._mem_int32[(SELF + 44) >> 2] = 0; 
		return SELF;
	}

    static NewScene(color:number){
        let ptr = Scene.initInstance(turbo.Runtime.allocOrThrow(48,8));
        return Scene.init(ptr, Color.HexColor(color));
    }

	static Compile(SELF) {
		for (let i=0; i < turbo.Runtime._mem_int32[(SELF + 28) >> 2];i++) {
			let shape = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(SELF + 24) >> 2]) + 4 + (4 * i)  ) >> 2];
			Shape.Compile(shape);
		}
		if (!turbo.Runtime._mem_int32[(SELF + 40) >> 2]) {
			 turbo.Runtime._mem_int32[(SELF + 40) >> 2] = (Tree.NewTree(turbo.Runtime._mem_int32[(SELF + 24) >> 2])); 
		}
		return turbo.Runtime._mem_int32[(SELF + 40) >> 2];
	}

	static RayCount(SELF):number {
		// return Atomics.load(turbo.Runtime._mem_int32, turbo.Runtime._mem_int32[(SELF + 44) >> 2]);
        return turbo.Runtime._mem_int32[(SELF + 44) >> 2];
	}

	static Intersect(SELF, r:number):Hit {
		// Atomics.add(turbo.Runtime._mem_int32, turbo.Runtime._mem_int32[(SELF + 44) >> 2], 1);
         turbo.Runtime._mem_int32[(SELF + 44) >> 2] = (turbo.Runtime._mem_int32[(SELF + 44) >> 2] + 1); 
		return Tree.Intersect(turbo.Runtime._mem_int32[(SELF + 40) >> 2], r);
	}
    static initInstance(SELF) { turbo.Runtime._mem_int32[SELF>>2]=237222; return SELF; }
}
turbo.Runtime._idToType[237222] = Scene;


export class MasterScene{

	shapes:IShape[];
	lights:IShape[];
	scenePtr:number;

	static defaultMaterial;

	constructor(color){
		this.scenePtr = Scene.NewScene(color);
        this.shapes = [];
        this.lights = [];

		// MasterScene.defaultMaterial = Material.GlossyMaterial(Color.HexColor(0xFF0000), 1.5, Utils.Radians(30));
        // MasterScene.defaultMaterial = Material.LightMaterial(Color.HexColor(0x00FF00), 5);
		MasterScene.defaultMaterial = Material.DiffuseMaterial(Color.HexColor(0xFF0000));

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

		if (turbo.Runtime._mem_float64[((Shape.MaterialAt(shape, Vector.ZERO)) + 32) >> 3] > 0) {
			this.lights.push(shape);
		}
	}
	Commit(){
		turbo.Runtime._mem_int32[((this.scenePtr) + 28) >> 2] = this.shapes.length;
		let shapeList = turbo.Runtime.allocOrThrow( 4 + ( 4 * (this.shapes.length) ), 4 ) /*Array*/;
        turbo.Runtime._mem_int32[shapeList >> 2] = (this.shapes.length);
        turbo.Runtime._mem_int32[((this.scenePtr) + 24) >> 2] = shapeList;
		turbo.Runtime._mem_int32[((this.scenePtr) + 36) >> 2] = this.lights.length;
		let lightList = turbo.Runtime.allocOrThrow( 4 + ( 4 * (this.lights.length) ), 4 ) /*Array*/;
        turbo.Runtime._mem_int32[lightList >> 2] = (this.lights.length);
        turbo.Runtime._mem_int32[((this.scenePtr) + 32) >> 2] = lightList;

		this.shapes.forEach((shape, index) => {
            turbo.Runtime._mem_int32[(  shapeList + 4 + (4 * index)  ) >> 2] = shape;
		});

		this.lights.forEach((shape, index) => {
            turbo.Runtime._mem_int32[(  lightList + 4 + (4 * index)  ) >> 2] = shape;
		});

        Scene.Compile(this.scenePtr);
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
                    var t:number = Triangle.initInstance(turbo.Runtime.allocOrThrow(53,4));

                    turbo.Runtime._mem_int32[(t + 44) >> 2] = material;
                    turbo.Runtime._mem_int32[(t + 8) >> 2] = Vector.NewVector(vertices[face.a].x, vertices[face.a].y, vertices[face.a].z);
                    turbo.Runtime._mem_int32[(t + 12) >> 2] = Vector.NewVector(vertices[face.b].x, vertices[face.b].y, vertices[face.b].z);
                    turbo.Runtime._mem_int32[(t + 16) >> 2] = Vector.NewVector(vertices[face.c].x, vertices[face.c].y, vertices[face.c].z);
                    turbo.Runtime._mem_int32[(t + 20) >> 2] = Vector.NewVector();
                    turbo.Runtime._mem_int32[(t + 24) >> 2] = Vector.NewVector();
                    turbo.Runtime._mem_int32[(t + 28) >> 2] = Vector.NewVector();

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

                    let t = Triangle.initInstance(turbo.Runtime.allocOrThrow(53,4));
                    turbo.Runtime._mem_int32[(t + 44) >> 2] = material;
                    turbo.Runtime._mem_int32[(t + 8) >> 2] = Vector.NewVector(positions[ax], positions[ay], positions[az]);
                    turbo.Runtime._mem_int32[(t + 12) >> 2] = Vector.NewVector(positions[bx], positions[by], positions[bz]);
                    turbo.Runtime._mem_int32[(t + 16) >> 2] = Vector.NewVector(positions[cx], positions[cy], positions[cz]);

                    turbo.Runtime._mem_int32[(t + 20) >> 2] = Vector.NewVector(normals[ax], normals[ay], normals[az]);
                    turbo.Runtime._mem_int32[(t + 24) >> 2] = Vector.NewVector(normals[bx], normals[by], normals[bz]);
                    turbo.Runtime._mem_int32[(t + 28) >> 2] = Vector.NewVector(normals[cx], normals[cy], normals[cz]);

                    if(uv){
                        turbo.Runtime._mem_int32[(t + 32) >> 2] = Vector.NewVector(uv[au], uv[av], 0);
                        turbo.Runtime._mem_int32[(t + 36) >> 2] = Vector.NewVector(uv[bu], uv[bv], 0);
                        turbo.Runtime._mem_int32[(t + 40) >> 2] = Vector.NewVector(uv[cu], uv[cv], 0);
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
                    // let t = Triangle.initInstance(turbo.Runtime.allocOrThrow(53,4));
                    // turbo.Runtime._mem_int32[(t + 44) >> 2] = material;
                    // turbo.Runtime._mem_int32[(t + 8) >> 2] = Vector.NewVector(positions[ax], positions[ay], positions[az]);
                    // turbo.Runtime._mem_int32[(t + 12) >> 2] = Vector.NewVector(positions[bx], positions[by], positions[bz]);
                    // turbo.Runtime._mem_int32[(t + 16) >> 2] = Vector.NewVector(positions[cx], positions[cy], positions[cz]);
                    //
                    // turbo.Runtime._mem_int32[(t + 20) >> 2] = Vector.NewVector(normals[ax], normals[ay], normals[az]);
                    // turbo.Runtime._mem_int32[(t + 24) >> 2] = Vector.NewVector(normals[bx], normals[by], normals[bz]);
                    // turbo.Runtime._mem_int32[(t + 28) >> 2] = Vector.NewVector(normals[cx], normals[cy], normals[cz]);
                    //
                    // if(uv){
                    //     turbo.Runtime._mem_int32[(t + 32) >> 2] = Vector.NewVector(uv[au], uv[av], 0);
                    //     turbo.Runtime._mem_int32[(t + 36) >> 2] = Vector.NewVector(uv[bu], uv[bv], 0);
                    //     turbo.Runtime._mem_int32[(t + 40) >> 2] = Vector.NewVector(uv[cu], uv[cv], 0);
                    // }

                    let t = Triangle.initInstance(turbo.Runtime.allocOrThrow(53,4));
                    turbo.Runtime._mem_int32[(t + 44) >> 2] = material;

                    turbo.Runtime._mem_int32[(t + 8) >> 2] = Vector.NewVector(positions[i], positions[i + 1], positions[i + 2]);
                    turbo.Runtime._mem_int32[(t + 12) >> 2] = Vector.NewVector(positions[i + 3], positions[i + 4], positions[i + 5]);
                    turbo.Runtime._mem_int32[(t + 16) >> 2] = Vector.NewVector(positions[i + 6], positions[i + 7], positions[i + 8]);

                    turbo.Runtime._mem_int32[(t + 20) >> 2] = Vector.NewVector(normals[i], normals[i + 1], normals[i + 2]);
                    turbo.Runtime._mem_int32[(t + 24) >> 2] = Vector.NewVector(normals[i + 3], normals[i + 4], normals[i + 5]);
                    turbo.Runtime._mem_int32[(t + 28) >> 2] = Vector.NewVector(normals[i + 6], normals[i + 7], normals[i + 8]);

                    if(uv){
                        turbo.Runtime._mem_int32[(t + 32) >> 2] = Vector.NewVector(uv[uvIndex], uv[uvIndex + 1], 0);
                        turbo.Runtime._mem_int32[(t + 36) >> 2] = Vector.NewVector(uv[uvIndex + 2], uv[uvIndex + 3], 0);
                        turbo.Runtime._mem_int32[(t + 40) >> 2] = Vector.NewVector(uv[uvIndex + 4], uv[uvIndex + 5], 0);
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
        if (turbo.Runtime._mem_float64[(material + 32) >> 3] > 0) {
            if (this.DirectLighting && !emission) {
                return result;
            }
            let __f = turbo.Runtime._mem_float64[(material + 32) >> 3] * samples;
            let tmp = Color.MulScalar2(turbo.Runtime._mem_int32[(material + 4) >> 2], __f);
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
                        let xindirect:Color3 = Color.Mul2(turbo.Runtime._mem_int32[(material + 4) >> 2], indirect);
                        let tinted:Color3 = indirect.mix(xindirect, turbo.Runtime._mem_float64[(material + 56) >> 3]);
                        result = result.add(tinted.mulScalar(bounce.coefficient));
                    }
                    if (bounce.coefficient > 0 && !bounce.reflected) {
                        // diffuse
                        let indirect:Color3 = this.sample(scene, bounce.ray, bounce.reflected, 1, depth+1);
                        let direct:Color3 = new Color3();
                        if (this.DirectLighting) {
                            direct = this.sampleLights(scene, info.Ray);
                        }
                        result = result.add(Color.Mul2(turbo.Runtime._mem_int32[(material + 4) >> 2], direct.add(indirect)).mulScalar(bounce.coefficient));
                    }
                }
            }
        }
        return result.divScalar(n * n);
    }

    sampleEnvironment(scene:number, ray:Ray):Color3{
        if (turbo.Runtime._mem_int32[(scene + 8) >> 2]) {
            let d:Vector3 = ray.direction;
            let u:number = Math.atan2(d.z, d.x) + turbo.Runtime._mem_float64[(scene + 16) >> 3];
            let v:number = Math.atan2(d.y, new Vector3(d.x, 0, d.z).length());
            u = (u + Math.PI) / (2 * Math.PI);
            v = (v + Math.PI/2) / Math.PI;
            return Texture.Sample(turbo.Runtime._mem_int32[(scene + 8) >> 2], u, v);
        }
        return new Color3().read(turbo.Runtime._mem_int32[(scene + 4) >> 2]);
    }

    sampleLights(scene:number, n:Ray):Color3 {
        let nLights = turbo.Runtime._mem_int32[(scene + 36) >> 2];
        if (nLights == 0) {
            return new Color3();
        }

        let shapes = turbo.Runtime._mem_int32[(scene + 24) >> 2];

        if (this.LightMode == LightMode.LightModeAll) {
            var result:Color3 =  new Color3();
            for (let i=0; i < nLights;i++) {
                let light = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(scene + 32) >> 2]) + 4 + (4 * i)  ) >> 2];
                //let light = turbo.Runtime._mem_int32[(  shapes + 4 + (4 * lightIndex)  ) >> 2];
                result.add(this.sampleLight(scene, n, light));
            }
            return result;
        } else {
            // pick a random light
            let rndLight:number = Math.round(Math.random() * (nLights - 1));
            let light = turbo.Runtime._mem_int32[(  (turbo.Runtime._mem_int32[(scene + 32) >> 2]) + 4 + (4 * rndLight)  ) >> 2];
            let lightColor = this.sampleLight(scene, n, light);
            return lightColor.mulScalar(nLights);
        }
    }

    sampleLight(scene:number, n:Ray, light:number):Color3 {
        // get bounding sphere center and radius
        var center:number;
        var radius:number;

        switch(Shape.Type(light)){
            case ShapeType.SPHERE:
                radius = turbo.Runtime._mem_float64[(light + 16) >> 3];
                center = turbo.Runtime._mem_int32[(light + 8) >> 2];
                break;

            default:
                // get bounding sphere from bounding box
                let box = Shape.BoundingBox(light);
                radius = Box.OuterRadius(box);
                center = Box.Center(box);
                break;
        }

        let _center  = new Vector3().read(center);
        free(center);

        // get random point in disk
        let point:Vector3 = _center;
        if (this.SoftShadows) {

            let x;
            let y;

            while(true){

                x = Math.random() * 2 - 1;
                y = Math.random() * 2 - 1;

                if(x*x+y*y <= 1) {

                    let l = _center.sub(n.origin).normalize();
                    let u = l.cross(Vector3.RandomUnitVector()).normalize();
                    let v = l.cross(u);
                    point = new Vector3();
                    point = point.add(u.mulScalar(x * radius));
                    point = point.add(v.mulScalar(y * radius));
                    point = point.add(_center);
                    break;
                }

            }
        }

        // construct ray toward light point
        let ray = new Ray(n.origin, point.sub(n.origin));

        // get cosine term
        let diffuse = ray.direction.dot(n.direction);
        if (diffuse <= 0) {
            return new Color3();
        }

        // check for light visibility
        let hit = Scene.Intersect(scene, ray);
        if (!hit.Ok() || hit.Shape != light) {
            return new Color3();
        }

        // compute solid angle (hemisphere coverage)
        let hyp = _center.sub(n.origin).length();
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

        // get material properties from light
        let material = Material.MaterialAt(light, point);

        // combine factors
        let m = turbo.Runtime._mem_float64[(material + 32) >> 3] * diffuse * coverage;
        return Color.MulScalar2(turbo.Runtime._mem_int32[(material + 4) >> 2], m);
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
        this.x = turbo.Runtime._mem_float64[(memory + 8) >> 3];
        this.y = turbo.Runtime._mem_float64[(memory + 16) >> 3];
        this.z = turbo.Runtime._mem_float64[(memory + 24) >> 3];
        return this;
    }

    write(memory:number):number {
        turbo.Runtime._mem_float64[(memory + 8) >> 3] = this.x;
        turbo.Runtime._mem_float64[(memory + 16) >> 3] = this.y;
        turbo.Runtime._mem_float64[(memory + 24) >> 3] = this.z;
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
        return Math.min(Math.min(this.x, this.y), this.z)
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
    R:number,
    G:number,
    B:number,
    a:number
}
export class Color3 {

    constructor(public R:number = 0,
                public G:number = 0,
                public B:number = 0) {
    }

    read(memory:number):Color3 {
        this.R = turbo.Runtime._mem_float64[(memory + 8) >> 3];
        this.G = turbo.Runtime._mem_float64[(memory + 16) >> 3];
        this.B = turbo.Runtime._mem_float64[(memory + 24) >> 3];
        return this;
    }

    write(memory:number):number {
        turbo.Runtime._mem_float64[(memory + 8) >> 3] = this.R;
        turbo.Runtime._mem_float64[(memory + 16) >> 3] = this.G;
        turbo.Runtime._mem_float64[(memory + 24) >> 3] = this.B;
        return memory;
    }

    static fromJson(color:Color3):Color3 {
        if (color) {
            return new Color3(
                color.R,
                color.G,
                color.B
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
        return new Color3(c.R / 65535, c.G / 65535, c.B / 65535);
    }

    RGBA():RGBA {
        let a:Color3 = this;
        let _c:Uint8Array = new Uint8Array(3);
        _c[0] = Math.max(0, Math.min(255, a.R * 255));
        _c[1] = Math.max(0, Math.min(255, a.G * 255));
        _c[2] = Math.max(0, Math.min(255, a.B * 255));
        return {R: _c[0], G: _c[1], B: _c[2], a: 255};
    }

    isBlack():boolean {
        return this.R === 0 && this.G === 0 && this.B === 0;
    }

    isWhite():boolean {
        return this.R === 1 && this.G === 1 && this.B === 1;
    }

    add(B:Color3):Color3 {
        return new Color3(this.R + B.R, this.G + B.G, this.B + B.B);
    }

    sub(B:Color3):Color3 {
        return new Color3(this.R - B.R, this.G - B.G, this.B - B.B);
    }

    mul(B:Color3):Color3 {
        return new Color3(this.R * B.R, this.G * B.G, this.B * B.B);
    }

    mulScalar(B:number):Color3 {
        return new Color3(this.R * B, this.G * B, this.B * B)
    }

    divScalar(B:number):Color3 {
        return new Color3(this.R / B, this.G / B, this.B / B);
    }

    min(B:Color3):Color3 {
        return new Color3(Math.min(this.R, B.R), Math.min(this.G, B.G), Math.min(this.B, B.B));
    }

    max(B:Color3):Color3 {
        return new Color3(Math.max(this.R, B.R), Math.max(this.G, B.G), Math.max(this.B, B.B));
    }

    pow(B:number):Color3 {
        return new Color3(Math.pow(this.R, B), Math.pow(this.G, B), Math.pow(this.B, B));
    }

    mix(B:Color3, pct:number):Color3 {
        let a = this.mulScalar(1 - pct);
        B = B.mulScalar(pct);
        return a.add(B);
    }

    set(R:number, G:number, B:number):Color3 {
        this.R = R;
        this.G = G;
        this.B = B;
        return this;
    }

    clone():Color3 {
        return new Color3(
            this.R,
            this.G,
            this.B
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




}
