declare module "core/src/pointer/src/ByteArrayBase" {
    export class ByteArrayBase {
        static BIG_ENDIAN: string;
        static LITTLE_ENDIAN: string;
        static SIZE_OF_BOOLEAN: number;
        static SIZE_OF_INT8: number;
        static SIZE_OF_INT16: number;
        static SIZE_OF_INT32: number;
        static SIZE_OF_INT64: number;
        static SIZE_OF_UINT8: number;
        static SIZE_OF_UINT16: number;
        static SIZE_OF_UINT32: number;
        static SIZE_OF_UINT64: number;
        static SIZE_OF_FLOAT32: number;
        static SIZE_OF_FLOAT64: number;
        private BUFFER_EXT_SIZE;
        array: Uint8Array;
        data: DataView;
        private _position;
        write_position: number;
        endian: string;
        constructor(buffer?: ArrayBuffer, offset?: number, length?: number);
        buffer: ArrayBuffer;
        dataView: DataView;
        phyPosition: number;
        bufferOffset: number;
        position: number;
        length: number;
        bytesAvailable: number;
        clear(): void;
        getArray(): Uint8Array;
        setArray(array: Uint8Array): void;
        setBuffer(buffer: ArrayBuffer, offset?: number, length?: number): void;
        readBoolean(): boolean;
        readByte(): number;
        readBytes(_bytes?: ByteArrayBase, offset?: number, length?: number, createNewBuffer?: boolean): ByteArrayBase;
        readDouble(): number;
        readFloat(): number;
        readInt(): number;
        readMultiByte(length: number, charSet?: string): string;
        readShort(): number;
        readUnsignedByte(): number;
        readUnsignedInt(): number;
        readVariableSizedUnsignedInt(): number;
        readU16VX(): number;
        readUnsignedShort(): number;
        readUTF(): string;
        readUTFBytes(length: number): string;
        readStandardString(length: number): string;
        readStringTillNull(keepEvenByte?: boolean): string;
        writeBoolean(value: boolean): void;
        writeByte(value: number): void;
        writeUnsignedByte(value: number): void;
        writeBytes(_bytes: ByteArrayBase, offset?: number, length?: number): void;
        writeDouble(value: number): void;
        writeFloat(value: number): void;
        writeInt(value: number): void;
        writeMultiByte(value: string, charSet: string): void;
        writeShort(value: number): void;
        writeUnsignedShort(value: number): void;
        writeUnsignedInt(value: number): void;
        writeUTF(value: string): void;
        writeUTFBytes(value: string): void;
        toString(): string;
        writeUint8Array(_bytes: Uint8Array): void;
        writeUint16Array(_bytes: Uint16Array): void;
        writeUint32Array(_bytes: Uint32Array): void;
        writeInt8Array(_bytes: Int8Array): void;
        writeInt16Array(_bytes: Int16Array): void;
        writeInt32Array(_bytes: Int32Array): void;
        writeFloat32Array(_bytes: Float32Array): void;
        writeFloat64Array(_bytes: Float64Array): void;
        readUint8Array(length: number, createNewBuffer?: boolean): Uint8Array;
        readUint16Array(length: number, createNewBuffer?: boolean): Uint16Array;
        readUint32Array(length: number, createNewBuffer?: boolean): Uint32Array;
        readInt8Array(length: number, createNewBuffer?: boolean): Int8Array;
        readInt16Array(length: number, createNewBuffer?: boolean): Int16Array;
        readInt32Array(length: number, createNewBuffer?: boolean): Int32Array;
        readFloat32Array(length: number, createNewBuffer?: boolean): Float32Array;
        readFloat64Array(length: number, createNewBuffer?: boolean): Float64Array;
        validate(len: number): boolean;
        private validateBuffer(len);
        private encodeUTF8(str);
        private decodeUTF8(data);
        private encoderError(code_point);
        private decoderError(fatal, opt_code_point?);
        private EOF_byte;
        private EOF_code_point;
        private inRange(a, min, max);
        private div(n, d);
        private stringToCodePoints(string);
    }
}
declare module "core/src/pointer/src/MemoryUtils" {
    export class MemoryUtils {
        static i8: Int8Array;
        static ui16: Uint16Array;
        static ui32: Uint32Array;
        static i32: Int32Array;
        static i16: Int16Array;
        static f32: Float32Array;
        static f64: Float64Array;
        static ui32mem: Uint8Array;
        static ui16mem: Uint8Array;
        static i32mem: Uint8Array;
        static i16mem: Uint8Array;
        static f32mem: Uint8Array;
        static f64mem: Uint8Array;
        static readUint16(memory: Uint8Array, offset: number, littleEndian?: boolean): number;
        static writeUint16(memory: Uint8Array, offset: number, value: number, littleEndian?: boolean): number;
        static readInt16(memory: Uint8Array, offset: number, littleEndian?: boolean): number;
        static writeInt16(memory: Uint8Array, offset: number, value: number, littleEndian?: boolean): number;
        static readInt32(memory: Uint8Array, offset: number, littleEndian?: boolean): number;
        static writeInt32(memory: Uint8Array, offset: number, value: number, littleEndian?: boolean): number;
        static readUint32(memory: Uint8Array, offset: number, littleEndian?: boolean): number;
        static writeUint32(memory: Uint8Array, offset: number, value: number, littleEndian?: boolean): number;
        static readFloat32(memory: Uint8Array, offset: number, littleEndian?: boolean): number;
        static writeFloat32(memory: Uint8Array, offset: number, value: number, littleEndian?: boolean): number;
        static readFloat64(memory: Uint8Array, offset: number, littleEndian?: boolean): number;
        static writeFloat64(memory: Uint8Array, offset: number, value: number, littleEndian?: boolean): number;
    }
}
declare module "core/src/pointer/src/UTF8" {
    export class UTF8 {
        static instance: UTF8;
        static encode(str: string): Uint8Array;
        static decode(data: Uint8Array): string;
        constructor();
        encode(str: string): Uint8Array;
        decode(data: Uint8Array): string;
        private encoderError(code_point);
        private decoderError(fatal, opt_code_point?);
        private EOF_byte;
        private EOF_code_point;
        private inRange(a, min, max);
        private div(n, d);
        private stringToCodePoints(string);
    }
}
declare module "core/src/pointer/src/DirectMemory" {
    export class DirectMemory {
        buffer: ArrayBuffer;
        private offset;
        static BIG_ENDIAN: string;
        static LITTLE_ENDIAN: string;
        static MIN_FLOAT32_VALUE: number;
        static SIZE_OF_BOOLEAN: number;
        static SIZE_OF_INT8: number;
        static SIZE_OF_INT16: number;
        static SIZE_OF_INT32: number;
        static SIZE_OF_INT64: number;
        static SIZE_OF_UINT8: number;
        static SIZE_OF_UINT16: number;
        static SIZE_OF_UINT32: number;
        static SIZE_OF_UINT64: number;
        static SIZE_OF_FLOAT32: number;
        static SIZE_OF_FLOAT64: number;
        private BUFFER_EXT_SIZE;
        data: Uint8Array;
        private _position;
        write_position: number;
        endian: string;
        constructor(buffer?: ArrayBuffer, offset?: number, length?: number);
        phyPosition: number;
        bufferOffset: number;
        position: number;
        length: number;
        bytesAvailable: number;
        clear(): void;
        setBuffer(buffer: ArrayBuffer, offset?: number, length?: number): void;
        readBoolean(): boolean;
        readByte(): number;
        readBytes(_bytes?: DirectMemory, offset?: number, length?: number, createNewBuffer?: boolean): DirectMemory;
        readDouble(): number;
        readFloat(): number;
        readInt(): number;
        readMultiByte(length: number, charSet?: string): string;
        readShort(): number;
        readUnsignedByte(): number;
        readUnsignedInt(): number;
        readVariableSizedUnsignedInt(): number;
        readU16VX(): number;
        readUnsignedShort(): number;
        readUTF(): string;
        readUTFBytes(length: number): string;
        readStandardString(length: number): string;
        readStringTillNull(keepEvenByte?: boolean): string;
        writeBoolean(value: boolean): void;
        writeByte(value: number): void;
        writeUnsignedByte(value: number): void;
        writeBytes(_bytes: DirectMemory, offset?: number, length?: number): void;
        writeDouble(value: number): void;
        writeFloat(value: number): void;
        writeInt(value: number): void;
        writeMultiByte(value: string, charSet: string): void;
        writeShort(value: number): void;
        writeUnsignedShort(value: number): void;
        writeUnsignedInt(value: number): void;
        writeUTF(value: string): void;
        writeUTFBytes(value: string): void;
        toString(): string;
        writeUint8Array(_bytes: Uint8Array): void;
        writeUint16Array(_bytes: Uint16Array): void;
        writeUint32Array(_bytes: Uint32Array): void;
        writeInt8Array(_bytes: Int8Array): void;
        writeInt16Array(_bytes: Int16Array): void;
        writeInt32Array(_bytes: Int32Array): void;
        writeFloat32Array(_bytes: Float32Array): void;
        writeFloat64Array(_bytes: Float64Array): void;
        readUint8Array(length: number, createNewBuffer?: boolean): Uint8Array;
        readUint16Array(length: number, createNewBuffer?: boolean): Uint16Array;
        readUint32Array(length: number, createNewBuffer?: boolean): Uint32Array;
        readInt8Array(length: number, createNewBuffer?: boolean): Int8Array;
        readInt16Array(length: number, createNewBuffer?: boolean): Int16Array;
        readInt32Array(length: number, createNewBuffer?: boolean): Int32Array;
        readFloat32Array(length: number, createNewBuffer?: boolean): Float32Array;
        readFloat64Array(length: number, createNewBuffer?: boolean): Float64Array;
        validate(len: number): boolean;
        private validateBuffer(len);
    }
}
declare module "core/src/pointer/src/IPointer" {
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export interface IPointer {
        memorySize: number;
        write(memory: ByteArrayBase | DirectMemory): number;
        directWrite(memory: Uint8Array, offset: number): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        directRead(memory: Uint8Array, offset: number): number;
    }
}
declare module "core/src/pointer/src/Pointer" {
    import { IPointer } from "core/src/pointer/src/IPointer";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export class Pointer {
        private reference;
        static offset: number;
        static heap: Uint8Array;
        static memory: DirectMemory;
        static initialized: boolean;
        static init(): DirectMemory;
        private beginLocation;
        private currentLocation;
        constructor(reference: IPointer);
        read(): IPointer;
    }
    export function sizeof(ptr: IPointer): number;
}
declare module "core/src/pointer/pointer" {
    export * from "core/src/pointer/src/ByteArrayBase";
    export * from "core/src/pointer/src/DirectMemory";
    export * from "core/src/pointer/src/MemoryUtils";
    export * from "core/src/pointer/src/UTF8";
    export * from "core/src/pointer/src/IPointer";
    export * from "core/src/pointer/src/Pointer";
}
declare module "core/src/engine/data/DataCache" {
    export class DataCache {
        private static cache;
        static getItem(url: string): any;
        static add(url: string, item: any): any;
    }
}
declare module "core/src/engine/data/ImageLoader" {
    export class ImageLoader {
        static crossOrigin: string;
        constructor();
        load(url: string, onLoad: Function, onProgress: Function, onError: Function): HTMLImageElement;
    }
}
declare module "core/src/engine/math/Vector3" {
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export class Vector3 {
        x: number;
        y: number;
        z: number;
        static SIZE: number;
        static NullVector: Vector3;
        memorySize: number;
        constructor(x?: number, y?: number, z?: number);
        static fromJson(v: Vector3): Vector3;
        setFromArray(a: any, offset?: number): void;
        setFromJson(a: any): void;
        length(): number;
        dot(b: Vector3): number;
        cross(b: Vector3): Vector3;
        normalize(): Vector3;
        add(b: Vector3): Vector3;
        sub(b: Vector3): Vector3;
        mul(b: Vector3): Vector3;
        div(b: Vector3): Vector3;
        mulScalar(b: any): Vector3;
        divScalar(b: any): Vector3;
        min(b: Vector3): Vector3;
        max(b: Vector3): Vector3;
        minAxis(): Vector3;
        minComponent(): number;
        reflect(i: Vector3): Vector3;
        refract(i: Vector3, n1: any, n2: any): Vector3;
        reflectance(i: Vector3, n1: any, n2: any): number;
        toString(): string;
        equals(v: Vector3): Boolean;
        isZero(): Boolean;
        directWrite(memory: Float32Array, offset: number): number;
        directRead(memory: Float32Array, offset: number): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        write(memory: ByteArrayBase | DirectMemory): number;
        isNullVector(): boolean;
    }
}
declare module "core/src/engine/math/Color" {
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export interface RGBA {
        r: number;
        g: number;
        b: number;
        a: number;
    }
    export class Color {
        r: number;
        g: number;
        b: number;
        static SIZE: number;
        constructor(r?: number, g?: number, b?: number);
        directWrite(mem: Float32Array, offset: number): number;
        directRead(mem: Float32Array, offset: number): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        write(memory: ByteArrayBase | DirectMemory): number;
        static fromJson(color: Color): Color;
        static hexColor(hex: number): Color;
        static newColor(c: RGBA): Color;
        RGBA(): RGBA;
        add(b: Color): Color;
        sub(b: Color): Color;
        mul(b: Color): Color;
        mulScalar(b: number): Color;
        divScalar(b: number): Color;
        min(b: Color): Color;
        max(b: Color): Color;
        pow(b: number): Color;
        mix(b: Color, pct: number): Color;
        set(r: number, g: number, b: number): Color;
        clone(): Color;
    }
}
declare module "core/src/engine/math/Constants" {
    export const INF: number;
    export const EPS: number;
    export const shift: number;
    export const uvnan: number;
    export const uvinf: number;
    export const uvneginf: number;
    export const mask: number;
    export const bias: number;
}
declare module "core/src/engine/utils/MathUtils" {
    export class MathUtils {
        static radians(degrees: number): number;
        static degrees(radians: number): number;
        static median(items: number[]): number;
        static fract(x: number): number;
        static Modf(f: any): {
            int: number;
            frac: number;
        };
        static clampInt(x: number, lo: number, hi: number): number;
    }
}
declare module "core/src/engine/scene/materials/Texture" {
    import { Color } from "core/src/engine/math/Color";
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { ImageLoader } from "core/src/engine/data/ImageLoader";
    export class Texture extends ImageLoader {
        static map: Map<string, Texture>;
        static getTexture(url: any): Texture;
        static fromJson(texture: Texture): Texture;
        private static ctx;
        sourceFile: string;
        loaded: boolean;
        width: number;
        height: number;
        image: HTMLImageElement;
        data: Color[];
        pixels: number[] | Uint8ClampedArray;
        constructor(url?: string);
        sample(u: number, v: number): Color;
        normalSample(u: number, v: number): Vector3;
        bumpSample(u: number, v: number): Vector3;
        load(url: string, onLoad?: Function, onProgress?: Function, onError?: Function): HTMLImageElement;
    }
}
declare module "core/src/engine/scene/materials/Attenuation" {
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export class Attenuation {
        constant: number;
        linear: number;
        quadratic: number;
        static SIZE: number;
        constructor(constant?: number, linear?: number, quadratic?: number);
        static fromJson(attenuation: Attenuation): Attenuation;
        compute(d: number): number;
        set(attenation: Attenuation): Attenuation;
        clone(): Attenuation;
        directWrite(mem: Float32Array, offset: number): number;
        directRead(mem: Float32Array, offset: number): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        write(memory: ByteArrayBase | DirectMemory): number;
    }
    export const NoAttenuation: Attenuation;
    export class LinearAttenuation extends Attenuation {
        constructor(value: number);
    }
    export class QuadraticAttenuation extends Attenuation {
        constructor(value: number);
    }
}
declare module "core/src/engine/scene/materials/Material" {
    import { Color } from "core/src/engine/math/Color";
    import { Texture } from "core/src/engine/scene/materials/Texture";
    import { Attenuation } from "core/src/engine/scene/materials/Attenuation";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export enum MaterialType {
        GENERIC = 0,
        DIFFUSE = 1,
        SPECULAR = 2,
        CLEAR = 3,
        GLOSSY = 4,
        EMISSIVE = 5,
    }
    export class Material {
        color: Color;
        texture: Texture;
        normalTexture: Texture;
        bumpTexture: Texture;
        bumpMultiplier: number;
        emittance: number;
        attenuation: Attenuation;
        ior: number;
        gloss: number;
        tint: number;
        transparent: boolean;
        static SIZE: number;
        static map: Array<Material>;
        type: MaterialType;
        index: number;
        constructor(color?: Color, texture?: Texture, normalTexture?: Texture, bumpTexture?: Texture, bumpMultiplier?: number, emittance?: number, attenuation?: Attenuation, ior?: number, gloss?: number, tint?: number, transparent?: boolean);
        clone(): Material;
        directRead(memory: Float32Array, offset: number): number;
        directWrite(memory: Float32Array, offset: number): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        write(memory: ByteArrayBase | DirectMemory): number;
        static estimatedMemory: number;
        static directWrite(memory: Float32Array, offset: number): number;
        static directRestore(memory: Float32Array, offset?: number): number;
        static write(memory: ByteArrayBase | DirectMemory): number;
        static restore(memory: ByteArrayBase | DirectMemory): number;
    }
}
declare module "core/src/engine/scene/Axis" {
    export enum Axis {
        AxisNone = 0,
        AxisX = 1,
        AxisY = 2,
        AxisZ = 3,
    }
}
declare module "core/src/engine/math/Ray" {
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { HitInfo } from "core/src/engine/math/HitInfo";
    export class Ray {
        origin: Vector3;
        direction: Vector3;
        data: Float32Array;
        constructor(origin?: Vector3, direction?: Vector3);
        position(t: number): Vector3;
        reflect(i: Ray): Ray;
        Refract(i: Ray, n1: number, n2: number): Ray;
        reflectance(i: Ray, n1: number, n2: number): number;
        weightedBounce(u: any, v: number): Ray;
        coneBounce(theta: any, u: any, v: number): Ray;
        bounce(info: HitInfo, p: number, u: number, v: number): {
            ray: Ray;
            reflected: boolean;
        };
        toString(): string;
    }
}
declare module "core/src/engine/math/HitInfo" {
    import { Ray } from "core/src/engine/math/Ray";
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { Color } from "core/src/engine/math/Color";
    import { Material } from "core/src/engine/scene/materials/Material";
    export class HitInfo {
        shape: Shape;
        position: Vector3;
        normal: Vector3;
        ray: Ray;
        color: Color;
        material: Material;
        inside: boolean;
        constructor(shape: Shape, position: Vector3, normal: Vector3, ray: Ray, color: Color, material: Material, inside: boolean);
    }
}
declare module "core/src/engine/math/Hit" {
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { HitInfo } from "core/src/engine/math/HitInfo";
    import { Ray } from "core/src/engine/math/Ray";
    export class Hit {
        shape: Shape;
        T: number;
        info: HitInfo;
        constructor(shape: Shape, T: number, info?: HitInfo);
        ok(): boolean;
        getInfo(ray: Ray): HitInfo;
    }
    export var NoHit: Hit;
}
declare module "core/src/engine/scene/materials/DiffuseMaterial" {
    import { Material } from "core/src/engine/scene/materials/Material";
    import { Color } from "core/src/engine/math/Color";
    import { MaterialType } from "core/src/engine/scene/materials/Material";
    export class DiffuseMaterial extends Material {
        type: MaterialType;
        constructor(color: Color);
    }
}
declare module "core/src/engine/scene/materials/SpecularMaterial" {
    import { Material } from "core/src/engine/scene/materials/Material";
    import { Color } from "core/src/engine/math/Color";
    import { MaterialType } from "core/src/engine/scene/materials/Material";
    export class SpecularMaterial extends Material {
        type: MaterialType;
        constructor(color: Color, index: number);
    }
}
declare module "core/src/engine/scene/materials/ClearMaterial" {
    import { Material } from "core/src/engine/scene/materials/Material";
    import { MaterialType } from "core/src/engine/scene/materials/Material";
    export class ClearMaterial extends Material {
        type: MaterialType;
        constructor(index: number, gloss: number);
    }
}
declare module "core/src/engine/scene/materials/GlossyMaterial" {
    import { Material } from "core/src/engine/scene/materials/Material";
    import { Color } from "core/src/engine/math/Color";
    import { MaterialType } from "core/src/engine/scene/materials/Material";
    export class GlossyMaterial extends Material {
        type: MaterialType;
        constructor(color: Color, index: number, gloss: number);
    }
}
declare module "core/src/engine/scene/materials/LightMaterial" {
    import { Material } from "core/src/engine/scene/materials/Material";
    import { Color } from "core/src/engine/math/Color";
    import { Attenuation } from "core/src/engine/scene/materials/Attenuation";
    import { MaterialType } from "core/src/engine/scene/materials/Material";
    export class LightMaterial extends Material {
        type: MaterialType;
        constructor(color: Color, emittance: number, attenuation: Attenuation);
    }
}
declare module "core/src/engine/scene/materials/MaterialUtils" {
    import { Material } from "core/src/engine/scene/materials/Material";
    export class MaterialUtils {
        static fromJson(material: Material): Material;
        static debug: boolean;
    }
}
declare module "core/src/engine/scene/shapes/Cube" {
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { Material } from "core/src/engine/scene/materials/Material";
    import { Box } from "core/src/engine/scene/shapes/Box";
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { Ray } from "core/src/engine/math/Ray";
    import { Color } from "core/src/engine/math/Color";
    import { Hit } from "core/src/engine/math/Hit";
    import { ShapeType } from "core/src/engine/scene/shapes/Shape";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export class Cube implements Shape {
        min: Vector3;
        max: Vector3;
        material: Material;
        box: Box;
        type: ShapeType;
        memorySize: number;
        index: number;
        constructor(min?: Vector3, max?: Vector3, material?: Material, box?: Box);
        write(memory: ByteArrayBase | DirectMemory): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        directWrite(memory: Float32Array, offset: number): number;
        directRead(memory: Float32Array, offset: number): number;
        static fromJson(shape: Cube): Cube;
        static newCube(min: Vector3, max: Vector3, material: Material): Shape;
        compile(): void;
        intersect(r: Ray): Hit;
        getColor(p: Vector3): Color;
        getMaterial(p: Vector3): Material;
        getNormal(p: Vector3): Vector3;
        getRandomPoint(): Vector3;
    }
}
declare module "core/src/engine/scene/shapes/Sphere" {
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { Material } from "core/src/engine/scene/materials/Material";
    import { Box } from "core/src/engine/scene/shapes/Box";
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { Ray } from "core/src/engine/math/Ray";
    import { Hit } from "core/src/engine/math/Hit";
    import { Color } from "core/src/engine/math/Color";
    import { ShapeType } from "core/src/engine/scene/shapes/Shape";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export class Sphere implements Shape {
        center: Vector3;
        radius: number;
        material: Material;
        box: Box;
        type: ShapeType;
        memorySize: number;
        index: number;
        constructor(center?: Vector3, radius?: number, material?: Material, box?: Box);
        directRead(memory: Float32Array, offset: number): number;
        directWrite(memory: Float32Array, offset: number): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        write(memory: ByteArrayBase | DirectMemory): number;
        static fromJson(sphere: Sphere): Sphere;
        static newSphere(center: Vector3, radius: number, material: Material): Shape;
        compile(): void;
        intersect(r: Ray): Hit;
        getColor(p: Vector3): Color;
        getMaterial(p: Vector3): Material;
        getNormal(p: Vector3): Vector3;
        getRandomPoint(): Vector3;
    }
}
declare module "core/src/engine/math/Matrix4" {
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { Box } from "core/src/engine/scene/shapes/Box";
    import { Ray } from "core/src/engine/math/Ray";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export class Matrix4 {
        x00: number;
        x01: number;
        x02: number;
        x03: number;
        x10: number;
        x11: number;
        x12: number;
        x13: number;
        x20: number;
        x21: number;
        x22: number;
        x23: number;
        x30: number;
        x31: number;
        x32: number;
        x33: number;
        static SIZE: number;
        m: Float32Array;
        constructor(x00?: number, x01?: number, x02?: number, x03?: number, x10?: number, x11?: number, x12?: number, x13?: number, x20?: number, x21?: number, x22?: number, x23?: number, x30?: number, x31?: number, x32?: number, x33?: number);
        directRead(memory: Float32Array, offset: number): number;
        directWrite(memory: Float32Array, offset: number): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        write(memory: ByteArrayBase | DirectMemory): number;
        static fromJson(m: Matrix4): Matrix4;
        static fromTHREEJS(e: number[]): Matrix4;
        static identity(): Matrix4;
        static translate(v: Vector3): Matrix4;
        static scale(v: Vector3): Matrix4;
        static rotate(v: Vector3, a: number): Matrix4;
        static frustum(l: number, r: number, b: number, t: number, n: number, f: number): Matrix4;
        static orthographic(l: number, r: number, b: number, t: number, n: number, f: number): Matrix4;
        static perspective(fov: number, aspect: number, near: number, far: number): Matrix4;
        static LookAtMatrix(eye: Vector3, center: Vector3, up: Vector3, fovy: number): Matrix4;
        translate(v: Vector3): Matrix4;
        scale(v: Vector3): Matrix4;
        rotate(v: Vector3, a: number): Matrix4;
        frustum(l: number, r: number, b: number, t: number, n: number, f: number): Matrix4;
        orthographic(l: number, r: number, b: number, t: number, n: number, f: number): Matrix4;
        perspective(fov: any, aspect: any, near: any, far: number): Matrix4;
        mul(b: Matrix4): Matrix4;
        mulPosition(b: Vector3): Vector3;
        mulDirection(b: Vector3): Vector3;
        mulRay(b: Ray): Ray;
        mulBox(box: Box): Box;
        transpose(): Matrix4;
        determinant(): number;
        inverse(): Matrix4;
    }
}
declare module "core/src/engine/scene/shapes/TransformedShape" {
    import { Box } from "core/src/engine/scene/shapes/Box";
    import { Hit } from "core/src/engine/math/Hit";
    import { Ray } from "core/src/engine/math/Ray";
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { Material } from "core/src/engine/scene/materials/Material";
    import { Color } from "core/src/engine/math/Color";
    import { Shape, ShapeType } from "core/src/engine/scene/shapes/Shape";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    import { Matrix4 } from "core/src/engine/math/Matrix4";
    export class TransformedShape implements Shape {
        shape: Shape;
        matrix: Matrix4;
        inverse: Matrix4;
        normalMatrix: THREE.Matrix3;
        type: ShapeType;
        index: number;
        memorySize: number;
        constructor(shape?: Shape, matrix?: Matrix4, inverse?: Matrix4, normalMatrix?: THREE.Matrix3);
        directRead(memory: Float32Array, offset: number): number;
        directWrite(memory: Float32Array, offset: number): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        write(memory: ByteArrayBase | DirectMemory): number;
        static fromJson(transformedShape: TransformedShape): TransformedShape;
        static newTransformedShape(s: Shape, m: Matrix4): Shape;
        box: Box;
        compile(): void;
        intersect(r: Ray): Hit;
        getColor(p: Vector3): Color;
        getMaterial(p: Vector3): Material;
        getNormal(p: Vector3): Vector3;
        getRandomPoint(): Vector3;
    }
}
declare module "core/src/engine/scene/shapes/Shape" {
    import { Box } from "core/src/engine/scene/shapes/Box";
    import { Hit } from "core/src/engine/math/Hit";
    import { Color } from "core/src/engine/math/Color";
    import { Material } from "core/src/engine/scene/materials/Material";
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { Ray } from "core/src/engine/math/Ray";
    import { IPointer } from "core/src/pointer/src/IPointer";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export enum ShapeType {
        TRIANGLE = 0,
        CUBE = 1,
        SPHERE = 2,
        MESH = 3,
        TRANSFORMED_SHAPE = 4,
    }
    export interface Shape extends IPointer {
        index: number;
        type: ShapeType;
        box: Box;
        compile(): any;
        intersect(r: Ray): Hit;
        getColor(p: Vector3): Color;
        getMaterial(p: Vector3): Material;
        getNormal(p: Vector3): Vector3;
        getRandomPoint(): Vector3;
        directWrite(memory: Uint8Array, offset: number): number;
    }
    export function ShapesfromJson(shapes: Shape[]): Shape[];
    export function ShapefromJson(shape: Shape): Shape;
    export function directRestoreShape(memory: Float32Array, offset: number, container: Shape[]): number;
    export function restoreShape(memory: ByteArrayBase | DirectMemory, container: Shape[]): number;
}
declare module "core/src/engine/scene/shapes/Box" {
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { Axis } from "core/src/engine/scene/Axis";
    import { Triangle } from "core/src/engine/scene/shapes/Triangle";
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { Ray } from "core/src/engine/math/Ray";
    import { IPointer } from "core/src/pointer/src/IPointer";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export class Box implements IPointer {
        min: Vector3;
        max: Vector3;
        static SIZE: number;
        memorySize: number;
        constructor(min?: Vector3, max?: Vector3);
        directWrite(memory: Float32Array, offset: number): number;
        directRead(memory: Float32Array, offset: number): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        write(memory: ByteArrayBase | DirectMemory): number;
        static fromJson(box: Box): Box;
        static boxForShapes(shapes: Array<Shape>): Box;
        static boxForTriangles(shapes: Array<Triangle>): Box;
        anchor(anchor: Vector3): Vector3;
        center(): Vector3;
        size(): Vector3;
        extend(b: Box): Box;
        intersect(r: Ray): any;
        partition(axis: Axis, point: number): {
            left: boolean;
            right: boolean;
        };
        toString(): string;
    }
}
declare module "core/src/engine/scene/shapes/Triangle" {
    import { Material } from "core/src/engine/scene/materials/Material";
    import { Box } from "core/src/engine/scene/shapes/Box";
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { Ray } from "core/src/engine/math/Ray";
    import { Hit } from "core/src/engine/math/Hit";
    import { Color } from "core/src/engine/math/Color";
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { ShapeType } from "core/src/engine/scene/shapes/Shape";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export class Triangle implements Shape {
        material: Material;
        box: Box;
        v1: Vector3;
        v2: Vector3;
        v3: Vector3;
        n1: Vector3;
        n2: Vector3;
        n3: Vector3;
        t1: Vector3;
        t2: Vector3;
        t3: Vector3;
        static SIZE: number;
        type: ShapeType;
        memorySize: number;
        index: number;
        private data;
        constructor(material?: Material, box?: Box, v1?: Vector3, v2?: Vector3, v3?: Vector3, n1?: Vector3, n2?: Vector3, n3?: Vector3, t1?: Vector3, t2?: Vector3, t3?: Vector3);
        directRead(memory: Float32Array, offset: number): number;
        directWrite(memory: Float32Array, offset: number): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        write(memory: ByteArrayBase | DirectMemory): number;
        static fromJson(triangles: Triangle | Triangle[]): Triangle | Triangle[];
        static newTriangle(v1: Vector3, v2: Vector3, v3: Vector3, t1: Vector3, t2: Vector3, t3: Vector3, material: Material): Triangle;
        compile(): void;
        vertices: Vector3[];
        intersect(r: Ray): Hit;
        getColor(p: Vector3): Color;
        getMaterial(p: Vector3): Material;
        getNormal(p: Vector3): Vector3;
        getRandomPoint(): Vector3;
        area(): number;
        baryCentric(p: Vector3): {
            u: number;
            v: number;
            w: number;
        };
        updateBox(): void;
        fixNormals(): void;
    }
}
declare module "core/src/engine/utils/MapUtils" {
    export function append(slice: Array<any>, ...elements: any[]): Array<any>;
    export function sortAscending(slice: any): void;
    export function sortDescending(slice: any): void;
}
declare module "core/src/engine/scene/tree/Node" {
    import { Axis } from "core/src/engine/scene/Axis";
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { Ray } from "core/src/engine/math/Ray";
    import { Hit } from "core/src/engine/math/Hit";
    export class Node {
        axis: Axis;
        point: number;
        shapes: Shape[];
        left: Node;
        right: Node;
        static map: Array<Node>;
        index: number;
        constructor(axis: Axis, point: number, shapes: Shape[], left: Node, right: Node);
        static newNode(shapes: Shape[]): Node;
        intersect(r: Ray, tmin: number, tmax: number): Hit;
        intersectShapes(r: Ray): Hit;
        partitionScore(axis: Axis, point: number): number;
        partition(size: number, axis: Axis, point: number): {
            left: Shape[];
            right: Shape[];
        };
        split(depth: number): void;
    }
}
declare module "core/src/engine/scene/tree/Tree" {
    import { Box } from "core/src/engine/scene/shapes/Box";
    import { Node } from "core/src/engine/scene/tree/Node";
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { Hit } from "core/src/engine/math/Hit";
    import { Ray } from "core/src/engine/math/Ray";
    export class Tree {
        box: Box;
        root: Node;
        constructor(box: Box, root: Node);
        static newTree(shapes: Shape[], box?: Box): Tree;
        intersect(r: Ray): Hit;
    }
}
declare module "core/src/engine/scene/tree/SharedNode" {
    import { Axis } from "core/src/engine/scene/Axis";
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { Ray } from "core/src/engine/math/Ray";
    import { Hit } from "core/src/engine/math/Hit";
    import { Mesh } from "core/src/engine/scene/shapes/Mesh";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export enum NodeMarker {
        ROOT = 1118481,
        LEFT = 15597585,
        RIGHT = 1114350,
        LEAF = 15597806,
        EON = 14737632,
        NULL = 15658734,
    }
    export class SharedNode {
        axis: Axis;
        point: number;
        shapes: Shape[];
        shapeIndices: number[];
        private _left;
        private _right;
        static map: Array<SharedNode>;
        index: number;
        marker: NodeMarker;
        mesh: Mesh;
        size: number;
        treeLength: number;
        memory: ByteArrayBase | DirectMemory;
        thisPtr: number;
        leftPtr: number;
        rightPtr: number;
        resolved: boolean;
        constructor(axis?: Axis, point?: number, shapes?: Shape[], shapeIndices?: number[], _left?: SharedNode, _right?: SharedNode);
        left: SharedNode;
        right: SharedNode;
        readRoot(memory: ByteArrayBase | DirectMemory): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        readChild(memory: ByteArrayBase | DirectMemory, marker: NodeMarker): number;
        static newNode(shapes: Shape[], memory?: ByteArrayBase | DirectMemory): SharedNode;
        static fromJson(node: SharedNode): SharedNode;
        intersect(r: Ray, tmin: number, tmax: number): Hit;
        intersectNode(node: SharedNode, r: Ray, tmin: number, tmax: number): Hit;
        intersectShapes(node: SharedNode, r: Ray): Hit;
        partitionScore(axis: Axis, point: number): number;
        partition(size: number, axis: Axis, point: number): {
            left: Shape[];
            right: Shape[];
        };
        split(depth: number): boolean;
    }
}
declare module "core/src/engine/scene/tree/SharedTree" {
    import { Box } from "core/src/engine/scene/shapes/Box";
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { Hit } from "core/src/engine/math/Hit";
    import { Ray } from "core/src/engine/math/Ray";
    import { SharedNode } from "core/src/engine/scene/tree/SharedNode";
    import { Mesh } from "core/src/engine/scene/shapes/Mesh";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export class SharedTree {
        box: Box;
        root: SharedNode;
        constructor(box: Box, root: SharedNode);
        static newTree(shapes: Shape[], box?: Box): SharedTree;
        intersect(r: Ray): Hit;
        static fromJson(tree: SharedTree, mesh: Mesh): SharedTree;
        static readFromMemory(memory: ByteArrayBase | DirectMemory, shapes: Shape[]): SharedTree;
        static buildAndWrite(memory: ByteArrayBase | DirectMemory, shapes: Shape[]): number;
    }
}
declare module "core/src/engine/scene/shapes/Mesh" {
    import { Triangle } from "core/src/engine/scene/shapes/Triangle";
    import { Matrix4 } from "core/src/engine/math/Matrix4";
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { Hit } from "core/src/engine/math/Hit";
    import { Ray } from "core/src/engine/math/Ray";
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { Color } from "core/src/engine/math/Color";
    import { Material } from "core/src/engine/scene/materials/Material";
    import { Tree } from "core/src/engine/scene/tree/Tree";
    import { Box } from "core/src/engine/scene/shapes/Box";
    import { ShapeType } from "core/src/engine/scene/shapes/Shape";
    import { SharedTree } from "core/src/engine/scene/tree/SharedTree";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export class Mesh implements Shape {
        box: Box;
        triangles: Triangle[];
        tree: Tree | SharedTree;
        type: ShapeType;
        index: number;
        material: Material;
        memorySize: number;
        constructor(box?: Box, triangles?: Triangle[], tree?: Tree | SharedTree);
        directRead(memory: Float32Array, offset: number): number;
        directWrite(memory: Float32Array, offset: number): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        write(memory: ByteArrayBase | DirectMemory): number;
        static fromJson(mesh: Mesh): Mesh;
        static newMesh(triangles: Triangle[]): Mesh;
        compile(): void;
        static inter: number;
        intersect(r: Ray): Hit;
        getColor(p: Vector3): Color;
        getMaterial(p: Vector3): Material;
        getNormal(p: Vector3): Vector3;
        getRandomPoint(): Vector3;
        updateBox(): void;
        private _smoothNormalsThreshold(normal, normals, threshold);
        smoothNormalsThreshold(radians: number): void;
        smoothNormals(): void;
        moveTo(position: Vector3, anchor: Vector3): void;
        fitInside(box: Box, anchor: Vector3): void;
        transform(matrix: Matrix4): void;
    }
}
declare module "core/src/engine/data/OBJLoader" {
    import { Mesh } from "core/src/engine/scene/shapes/Mesh";
    import { Material } from "core/src/engine/scene/materials/Material";
    export class OBJLoader {
        parentMaterial: Material;
        lastMesh: Mesh;
        materials: Map<string, Material>;
        private hasMaterials;
        private materialsLoaded;
        private materialsLoading;
        private pendingCallback;
        private basePath;
        constructor();
        load(url: string, onLoad: Function): Mesh;
        static parseIndex(value: string, length: number): number;
        static parseLine(line: string): {
            keyword: string;
            value: string[];
        };
        static parseFloats(fs: string[]): number[];
        loadOBJ(data: string): Mesh;
        getMaterial(index: string): Material;
        loadMTL(url: string): any;
    }
}
declare module "core/src/engine/math/TMatrix4" {
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { Box } from "core/src/engine/scene/shapes/Box";
    import { Ray } from "core/src/engine/math/Ray";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export class TMatrix4 {
        static SIZE: number;
        tm: THREE.Matrix4;
        x00: number;
        x01: number;
        x02: number;
        x03: number;
        x10: number;
        x11: number;
        x12: number;
        x13: number;
        x20: number;
        x21: number;
        x22: number;
        x23: number;
        x30: number;
        x31: number;
        x32: number;
        x33: number;
        constructor(x00?: any, x01?: number, x02?: number, x03?: number, x10?: number, x11?: number, x12?: number, x13?: number, x20?: number, x21?: number, x22?: number, x23?: number, x30?: number, x31?: number, x32?: number, x33?: number);
        directRead(memory: Float32Array, offset: number): number;
        directWrite(memory: Float32Array, offset: number): number;
        read(memory: ByteArrayBase | DirectMemory): number;
        write(memory: ByteArrayBase | DirectMemory): number;
        static fromJson(m: TMatrix4): TMatrix4;
        static identity(): TMatrix4;
        static translate(v: Vector3): TMatrix4;
        static scale(v: Vector3): TMatrix4;
        static rotate(v: Vector3, a: number): TMatrix4;
        static frustum(l: number, r: number, b: number, t: number, n: number, f: number): TMatrix4;
        static orthographic(l: number, r: number, b: number, t: number, n: number, f: number): TMatrix4;
        static perspective(fov: number, aspect: number, near: number, far: number): TMatrix4;
        translate(v: Vector3): TMatrix4;
        scale(v: Vector3): TMatrix4;
        rotate(v: Vector3, a: number): TMatrix4;
        frustum(l: number, r: number, b: number, t: number, n: number, f: number): TMatrix4;
        orthographic(l: number, r: number, b: number, t: number, n: number, f: number): TMatrix4;
        perspective(fov: any, aspect: any, near: any, far: number): TMatrix4;
        mul(b: TMatrix4): TMatrix4;
        mulPosition(b: Vector3): Vector3;
        mulDirection(b: Vector3): Vector3;
        mulRay(b: Ray): Ray;
        mulBox(b: Box): Box;
        transpose(): TMatrix4;
        determinant(): number;
        inverse(): TMatrix4;
    }
}
declare module "core/src/engine/renderer/worker/TraceJob" {
    import { Thread } from "core/src/engine/renderer/worker/Thread";
    export class TraceJob {
        param: any;
        extra: any;
        static INIT: string;
        static INITED: string;
        static TRACE: string;
        static TRACED: string;
        static TERMINATE: string;
        static LOCKED: string;
        finished: boolean;
        runCount: number;
        private id;
        private _time;
        private _lifeCount;
        lifeCount: number;
        time: number;
        constructor(param: any, extra?: any);
        start(thread: Thread, onComplete: Function): void;
        getTraceParam(): {
            init_iterations: number;
        };
    }
}
declare module "core/src/engine/renderer/worker/ThreadPool" {
    import { Thread } from "core/src/engine/renderer/worker/Thread";
    export class ThreadPool {
        static maxThreads: number;
        private static pool;
        static getThreads(): Thread[];
    }
}
declare module "core/src/engine/scene/Scene" {
    import { Color } from "core/src/engine/math/Color";
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { Tree } from "core/src/engine/scene/tree/Tree";
    import { Ray } from "core/src/engine/math/Ray";
    import { Hit } from "core/src/engine/math/Hit";
    import { SharedTree } from "core/src/engine/scene/tree/SharedTree";
    export class Scene {
        color: Color;
        shapes: Shape[];
        lights: Shape[];
        tree: Tree | SharedTree;
        rays: number;
        estimatedMemory: number;
        shared: boolean;
        constructor(color?: Color, shapes?: Shape[], lights?: Shape[], tree?: Tree | SharedTree, rays?: number);
        static fromJson(scene: Scene): Scene;
        compile(): Scene;
        add(shape: Shape): void;
        rayCount(): number;
        intersect(r: Ray): Hit;
        shadow(r: Ray, light: Shape, max: number): boolean;
        directLight(n: Ray): Color;
        static interval: number;
        sample(r: Ray, emission: boolean, samples: number, depth: number): Color;
    }
}
declare module "core/src/engine/scene/SharedScene" {
    import { Tree } from "core/src/engine/scene/tree/Tree";
    import { Color } from "core/src/engine/math/Color";
    import { Shape } from "core/src/engine/scene/shapes/Shape";
    import { Scene } from "core/src/engine/scene/Scene";
    import { SharedTree } from "core/src/engine/scene/tree/SharedTree";
    import { ByteArrayBase } from "core/src/pointer/src/ByteArrayBase";
    import { DirectMemory } from "core/src/pointer/src/DirectMemory";
    export class SharedScene extends Scene {
        sharedTreeMap: SharedTree[];
        constructor(color?: Color, shapes?: Shape[], lights?: Shape[], tree?: Tree | SharedTree, rays?: number);
        getMemory(): DirectMemory;
        static getScene(memory: ByteArrayBase | DirectMemory): SharedScene;
    }
}
declare module "core/src/engine/renderer/worker/TraceJobManager" {
    import { TraceJob } from "core/src/engine/renderer/worker/TraceJob";
    import { SharedScene } from "core/src/engine/scene/SharedScene";
    export class TraceJobManager {
        referenceQueue: TraceJob[];
        queue: TraceJob[];
        deferredQueue: TraceJob[];
        iterations: number;
        updatePixels: Function;
        static flags: Uint8Array;
        private width;
        private height;
        private pixelMemory;
        private sampleMemory;
        private sceneMemory;
        private flags;
        private traceParameters;
        private threads;
        private initCount;
        maxLoop: number;
        private currentLoop;
        private totalThreads;
        private _initialized;
        private _finished;
        private _await;
        private deferredStart;
        private stopped;
        private lockCount;
        initialized: boolean;
        isAllLocked: boolean;
        finished: boolean;
        pixels: Uint8Array;
        constructor();
        configure(param: any, scene: SharedScene): void;
        add(job: TraceJob): void;
        init(callback?: any): void;
        private initNext(callback);
        private onThreadLocked();
        private lockAllThreads();
        stop(): void;
        clear(): void;
        private resetTimerId;
        restart(): void;
        isAllThreadsFree: boolean;
        start(): void;
        private processQueue(job, thread);
        private initDeferredQueue();
    }
}
declare module "core/src/engine/renderer/worker/Thread" {
    export class Thread {
        id: number;
        static workerUrl: string;
        instance: Worker;
        onTraceComplete: Function;
        onInitComplete: Function;
        onThreadLocked: Function;
        initialized: boolean;
        private _isTracing;
        isTracing: boolean;
        constructor(name: string, id: number);
        onMessageReceived(event: any): void;
        init(param: any, transferable: any[], onInit: Function): void;
        trace(param: any, onComplete: Function): void;
        send(data: any, buffers?: any): void;
        terminate(): void;
    }
}
declare module "core/src/engine/scene/Camera" {
    import { Vector3 } from "core/src/engine/math/Vector3";
    import { Ray } from "core/src/engine/math/Ray";
    export class Camera {
        p: Vector3;
        u: Vector3;
        v: Vector3;
        w: Vector3;
        m: number;
        focalDistance: number;
        apertureRadius: number;
        constructor(p?: Vector3, u?: Vector3, v?: Vector3, w?: Vector3, m?: number, focalDistance?: number, apertureRadius?: number);
        static fromJson(camera: Camera): Camera;
        static lookAt(eye: any, look: any, up: Vector3, fovy: number): Camera;
        updateFromArray(eye: any, look: any, up: any, fovy: number, focus?: number, aperture?: number): void;
        updateFromJson(prop: any): void;
        setFocus(focalPoint: Vector3, apertureRadius: number): void;
        static debug: boolean;
        castRay(x: number, y: number, w: number, h: number, u: number, v: number): Ray;
        toJSON(): {
            p: Vector3;
            w: Vector3;
            u: Vector3;
            v: Vector3;
            m: number;
            focalDistance: number;
            apertureRadius: number;
        };
    }
}
declare module "core/src/engine/renderer/LiteBucketRenderer" {
    import { Camera } from "core/src/engine/scene/Camera";
    import { TraceJobManager } from "core/src/engine/renderer/worker/TraceJobManager";
    import { SharedScene } from "core/src/engine/scene/SharedScene";
    export class LiteBucketRenderer {
        static DEBUG: boolean;
        traceManager: TraceJobManager;
        initialized: boolean;
        bucketSize: number;
        constructor();
        static interval: number;
        iterations: number;
        render(scene: SharedScene, camera: Camera, width: number, height: number, cameraSamples: number, hitSamples: number, bounces: number, iterations: number, onUpdate: Function): Uint8ClampedArray;
    }
}
declare module "core/src/engine/renderer/SmartBucketRenderer" {
    import { Camera } from "core/src/engine/scene/Camera";
    import { TraceJobManager } from "core/src/engine/renderer/worker/TraceJobManager";
    import { SharedScene } from "core/src/engine/scene/SharedScene";
    export class SmartBucketRenderer {
        static DEBUG: boolean;
        traceManager: TraceJobManager;
        initialized: boolean;
        bucketSize: number;
        constructor();
        static interval: number;
        iterations: number;
        updateCameraSamples(newValue: number): void;
        updateHitSamples(newValue: number): void;
        updateCamera(newValue: any): void;
        render(scene: SharedScene, camera: Camera, width: number, height: number, cameraSamples: number, hitSamples: number, bounces: number, iterations: number, blockIterations: number, onUpdate: Function, onInit?: Function): Uint8ClampedArray;
    }
}
declare module "core/src/engine/scene/materials/TransparentMaterial" {
    import { Material } from "core/src/engine/scene/materials/Material";
    import { Color } from "core/src/engine/math/Color";
    export class TransparentMaterial extends Material {
        constructor(color: Color, index?: number, gloss?: number, tint?: number);
    }
}
declare module "core/src/engine/engine" {
    export * from "core/src/engine/data/DataCache";
    export * from "core/src/engine/data/ImageLoader";
    export * from "core/src/engine/data/OBJLoader";
    export * from "core/src/engine/math/Color";
    export * from "core/src/engine/math/Constants";
    export * from "core/src/engine/math/Hit";
    export * from "core/src/engine/math/HitInfo";
    export * from "core/src/engine/math/Matrix4";
    export * from "core/src/engine/math/TMatrix4";
    export * from "core/src/engine/math/Ray";
    export * from "core/src/engine/math/Vector3";
    export * from "core/src/engine/renderer/worker/Thread";
    export * from "core/src/engine/renderer/worker/ThreadPool";
    export * from "core/src/engine/renderer/worker/TraceJobManager";
    export * from "core/src/engine/renderer/worker/TraceJob";
    export * from "core/src/engine/renderer/LiteBucketRenderer";
    export * from "core/src/engine/renderer/SmartBucketRenderer";
    export * from "core/src/engine/scene/Axis";
    export * from "core/src/engine/scene/Camera";
    export * from "core/src/engine/scene/Scene";
    export * from "core/src/engine/scene/SharedScene";
    export * from "core/src/engine/scene/materials/Attenuation";
    export * from "core/src/engine/scene/materials/Material";
    export * from "core/src/engine/scene/materials/DiffuseMaterial";
    export * from "core/src/engine/scene/materials/GlossyMaterial";
    export * from "core/src/engine/scene/materials/ClearMaterial";
    export * from "core/src/engine/scene/materials/LightMaterial";
    export * from "core/src/engine/scene/materials/MaterialUtils";
    export * from "core/src/engine/scene/materials/SpecularMaterial";
    export * from "core/src/engine/scene/materials/Texture";
    export * from "core/src/engine/scene/materials/TransparentMaterial";
    export * from "core/src/engine/scene/shapes/Box";
    export * from "core/src/engine/scene/shapes/Shape";
    export * from "core/src/engine/scene/shapes/Cube";
    export * from "core/src/engine/scene/shapes/Mesh";
    export * from "core/src/engine/scene/shapes/Sphere";
    export * from "core/src/engine/scene/shapes/TransformedShape";
    export * from "core/src/engine/scene/shapes/Triangle";
    export * from "core/src/engine/scene/tree/Node";
    export * from "core/src/engine/scene/tree/SharedNode";
    export * from "core/src/engine/scene/tree/Tree";
    export * from "core/src/engine/scene/tree/SharedTree";
    export * from "core/src/engine/utils/MapUtils";
    export * from "core/src/engine/utils/MathUtils";
}
declare module "core/src/ThreeObjects" {
    export class ThreeObjects {
        static PointLight: string;
        static Mesh: string;
        static Group: string;
    }
}
declare module "core/src/ThreeJSView" {
    export class ThreeJSView {
        width: number;
        height: number;
        container: HTMLElement;
        appContainer: HTMLElement;
        camera: THREE.PerspectiveCamera;
        scene: THREE.Scene;
        renderer: THREE.WebGLRenderer;
        controls: any;
        onCameraChange: Function;
        onMouseDown: Function;
        onMouseUp: Function;
        constructor(width: number, height: number, container: HTMLElement, appContainer: HTMLElement);
        animate(): void;
        render(): void;
    }
}
declare module "core/src/CanvasDisplay" {
    export abstract class CanvasDisplay {
        i_width: number;
        i_height: number;
        container: HTMLElement;
        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;
        imageData: ImageData;
        data: Uint8ClampedArray | number[];
        constructor(i_width?: number, i_height?: number, container?: HTMLElement);
        attachDom(dom: HTMLElement): void;
        onWindowResize(): void;
        setResolution(width: number, height: number): void;
        updatePixels(pixels: Uint8ClampedArray): void;
        updatePixelsRect(rect: any, pixels: Uint8ClampedArray): void;
    }
}
declare module "core/src/GIRenderBase" {
    import { CanvasDisplay } from "core/src/CanvasDisplay";
    import { SmartBucketRenderer } from "core/src/engine/renderer/SmartBucketRenderer";
    import { Camera } from "core/src/engine/scene/Camera";
    import { SharedScene } from "core/src/engine/scene/SharedScene";
    export abstract class GIRenderBase extends CanvasDisplay {
        protected renderer: SmartBucketRenderer;
        protected pixels: Uint8ClampedArray;
        scene: SharedScene;
        protected camera: Camera;
        cameraSamples: number;
        hitSamples: number;
        bounces: number;
        iterations: number;
        blockIterations: number;
        dirty: boolean;
        constructor(i_width?: number, i_height?: number, container?: HTMLElement);
        updateCameraSamples(newValue: number): void;
        updateHitSamples(newValue: number): void;
        updateCamera(newValue: any): void;
        updateCameraMatrix(matrix: number[]): void;
        toggleTrace(newValue: boolean): void;
        render(onInit?: Function): void;
    }
}
declare module "core/src/GIJSView" {
    import { GIRenderBase } from "core/src/GIRenderBase";
    export class GIJSView extends GIRenderBase {
        width: number;
        height: number;
        container: HTMLElement;
        constructor(width: number, height: number, container?: HTMLElement);
        setThreeJSScene(scene: any, onInit?: Function): void;
        private loadChildren(parent);
        identityMatrix: THREE.Matrix4;
        private buildSceneObject(src);
        private buildGeometry(geometry, material);
        computeNormals(positions: Float32Array): Float32Array;
        updateCamera(camera: THREE.PerspectiveCamera): void;
        private static getMaterial(srcMaterial);
        private getLight(src);
    }
}
declare module "core/core" {
    export * from "core/src/pointer/pointer";
    export * from "core/src/engine/engine";
    export * from "core/src/ThreeObjects";
    export * from "core/src/ThreeJSView";
    export * from "core/src/CanvasDisplay";
    export * from "core/src/GIRenderBase";
    export * from "core/src/GIJSView";
}
declare module "xrenderer" {
    export * from "core/core";
}
declare module "core/src/three/GIThree" {
    export class GIThree {
        scene: any;
        constructor(scene: any);
    }
}
declare module "core/src/utils/NetworkUtils" {
    export class NetworkUtils {
        static baseUrl: string;
    }
}
declare function fetch(url: string, opt: any): any;
declare function postMessage(arg: any): any;
interface Atomics {
    futexWait(ta: any, index: number, value: number, timeOut: number): any;
    futexWake(ta: any, index: number, count: number): any;
    store(ta: any, index: number, value: number, timeOut: number): any;
    load(ta: any, index: number, value: number, timeOut: number): any;
}
interface SharedArrayBuffer {
    byteLength: number;
    slice(begin: number, end?: number): ArrayBuffer;
}
interface SharedArrayBufferConstructor extends ArrayBufferConstructor {
}
declare var SharedArrayBuffer: SharedArrayBufferConstructor;
interface Thenable<T> {
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
    catch<U>(onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
}
declare class Promise<T> implements Thenable<T> {
    constructor(callback: (resolve: (value?: T | Thenable<T>) => void, reject: (error?: any) => void) => void);
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Promise<U>;
    catch<U>(onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
}
declare module Promise {
    function resolve<T>(value?: T | Thenable<T>): Promise<T>;
    function reject(error: any): Promise<any>;
    function reject<T>(error: T): Promise<T>;
    function all<T>(promises: (T | Thenable<T>)[]): Promise<T[]>;
    function race<T>(promises: (T | Thenable<T>)[]): Promise<T>;
}
declare module 'es6-promise' {
    var foo: typeof Promise;
    module rsvp {
        var Promise: typeof foo;
    }
    export = rsvp;
}
interface Symbol {
    toString(): string;
    valueOf(): Object;
    [Symbol.toStringTag]: string;
}
interface SymbolConstructor {
    prototype: Symbol;
    (description?: string | number): symbol;
    for(key: string): symbol;
    keyFor(sym: symbol): string;
    hasInstance: symbol;
    isConcatSpreadable: symbol;
    iterator: symbol;
    match: symbol;
    replace: symbol;
    search: symbol;
    species: symbol;
    split: symbol;
    toPrimitive: symbol;
    toStringTag: symbol;
    unscopables: symbol;
}
declare var Symbol: SymbolConstructor;
interface IteratorResult<T> {
    done: boolean;
    value?: T;
}
interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}
interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
}
interface IterableIterator<T> extends Iterator<T> {
    [Symbol.iterator](): IterableIterator<T>;
}
interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    entries(): IterableIterator<[K, V]>;
    forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    set(key: K, value?: V): Map<K, V>;
    size: number;
    values(): IterableIterator<V>;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    [Symbol.toStringTag]: string;
}
interface MapConstructor {
    new (): Map<any, any>;
    new <K, V>(): Map<K, V>;
    new <K, V>(iterable: Iterable<[K, V]>): Map<K, V>;
    prototype: Map<any, any>;
}
declare var Map: MapConstructor;
