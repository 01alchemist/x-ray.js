import {Material} from "./Material";
import {MaterialType} from "./Material";
import {Color} from "../../math/Color";
import {Texture} from "./Texture";
import {Attenuation} from "./Attenuation";
import {DiffuseMaterial} from "./DiffuseMaterial";
import {SpecularMaterial} from "./SpecularMaterial";
import {ClearMaterial} from "./ClearMaterial";
import {GlossyMaterial} from "./GlossyMaterial";
import {LightMaterial} from "./LightMaterial";
import {LinearAttenuation} from "./Attenuation";
/**
 * Created by Nidin Vinayakan on 12-01-2016.
 */
export class MaterialUtils {

    static fromJson(material:Material):Material {
        if (!material)return null;

        switch (material.type) {
            case MaterialType.GENERIC:
                return new Material(
                    Color.fromJson(material.color),
                    Texture.fromJson(material.texture),
                    Texture.fromJson(material.normalTexture),
                    Texture.fromJson(material.bumpTexture),
                    material.bumpMultiplier,
                    material.emittance,
                    Attenuation.fromJson(material.attenuation),
                    material.index,
                    material.gloss,
                    material.tint,
                    material.transparent
                );

            case MaterialType.DIFFUSE:
                return new DiffuseMaterial(
                    Color.fromJson(material.color)
                );

            case MaterialType.SPECULAR:
                return new SpecularMaterial(
                    Color.fromJson(material.color),
                    material.index
                );

            case MaterialType.CLEAR:
                return new ClearMaterial(
                    material.index,
                    material.gloss
                );

            case MaterialType.GLOSSY:
                return new GlossyMaterial(
                    Color.fromJson(material.color),
                    material.index,
                    material.gloss
                );

            case MaterialType.EMISSIVE:
                return new LightMaterial(
                    Color.fromJson(material.color),
                    material.emittance,
                    Attenuation.fromJson(material.attenuation)
                );
        }
    }

    static debug:boolean = true;
}
