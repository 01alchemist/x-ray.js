import {Material} from "./Material";
import {Color} from "../../math/Color";
import {NoAttenuation} from "./Attenuation";
import {MaterialType} from "./Material";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export class GlossyMaterial extends Material{

    type:MaterialType = MaterialType.GLOSSY;

    constructor(color:Color, index:number, gloss:number){
        super(color, null, null, null, 1, 0, NoAttenuation, index, gloss, 0, false);
    }
}
