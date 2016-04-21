import {Color} from "../../math/Color";
import {Texture} from "./Texture";
import {Attenuation} from "./Attenuation";
import {NoAttenuation} from "./Attenuation";
import {ByteArrayBase} from "../../../pointer/ByteArrayBase";
import {DirectMemory} from "../../../pointer/DirectMemory";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export enum MaterialType{
    GENERIC,
    DIFFUSE,
    SPECULAR,
    CLEAR,
    GLOSSY,
    EMISSIVE
}
export class Material {

    static SIZE:number = Color.SIZE + Attenuation.SIZE + 6;
    static map:Array<Material> = [];

    type:MaterialType = MaterialType.GENERIC;
    index:number;

    /**
     *
     * @param color
     * @param texture
     * @param normalTexture
     * @param bumpTexture
     * @param bumpMultiplier
     * @param emittance
     * @param attenuation
     * @param ior -> refractive index
     * @param gloss -> reflection cone angle in radians
     * @param tint -> specular and refractive tinting
     * @param transparent
     */
    constructor(public color:Color = new Color(),
                public texture?:Texture,
                public normalTexture?:Texture,
                public bumpTexture?:Texture,
                public bumpMultiplier?:number,
                public emittance?:number,
                public attenuation:Attenuation=NoAttenuation,
                public ior?:number,
                public gloss?:number,
                public tint?:number,
                public transparent?:boolean) {
        this.index = Material.map.push(this) - 1;
    }

    clone():Material {
        var material = new Material(
            this.color.clone(),
            this.texture,
            this.normalTexture,
            this.bumpTexture,
            this.bumpMultiplier,
            this.emittance,
            this.attenuation.clone(),
            this.ior,
            this.gloss,
            this.tint,
            this.transparent
        );
        material.type = this.type;
        return material;
    }

    directRead(memory:Float32Array, offset:number):number {
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

    directWrite(memory:Float32Array, offset:number):number {
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

    read(memory:ByteArrayBase|DirectMemory):number {
        this.color.read(memory);
        this.bumpMultiplier = memory.readFloat();
        this.emittance = memory.readFloat();
        this.attenuation.read(memory);
        this.ior = memory.readFloat();
        this.gloss = memory.readFloat();
        this.tint = memory.readFloat();
        this.transparent = memory.readBoolean();
        return memory.position;
    }

    write(memory:ByteArrayBase|DirectMemory):number {
        this.color.write(memory);
        memory.writeFloat(this.bumpMultiplier);
        memory.writeFloat(this.emittance);
        this.attenuation.write(memory);
        memory.writeFloat(this.ior);
        memory.writeFloat(this.gloss);
        memory.writeFloat(this.tint);
        memory.writeBoolean(this.transparent);
        return memory.position;
    }

    /* static stuff */
    static get estimatedMemory():number {
        return Material.SIZE * Material.map.length + 1;
    };

    static directWrite(memory:Float32Array, offset:number):number {
        memory[offset++] = Material.map.length;
        Material.map.forEach(function (material:Material) {
            offset = material.directWrite(memory, offset);
        });
        return offset;
    }

    static directRestore(memory:Float32Array, offset:number = 0):number {
        var numMaterials:number = memory[offset++];
        for (var i = 0; i < numMaterials; i++) {
            offset = new Material().directRead(memory, offset);
        }
        //console.info(numMaterials+" Materials restored");
        return offset;
    }


    static write(memory:ByteArrayBase|DirectMemory):number {
        memory.writeUnsignedInt(Material.map.length);
        Material.map.forEach(function (material:Material) {
            material.write(memory);
        });
        return memory.position;
    }


    static restore(memory:ByteArrayBase|DirectMemory):number {
        var numMaterials:number = memory.readUnsignedInt();
        for (var i = 0; i < numMaterials; i++) {
            new Material().read(memory);
        }
        //console.info(numMaterials+" Materials restored");
        return memory.position;
    }
}
