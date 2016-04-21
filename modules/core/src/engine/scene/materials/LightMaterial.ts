import {Material} from "./Material";
import {Color} from "../../math/Color";
import {Attenuation} from "./Attenuation";
import {MaterialType} from "./Material";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export class LightMaterial extends Material{

    type:MaterialType = MaterialType.EMISSIVE;

    constructor(color:Color, emittance:number, attenuation:Attenuation){
        super(color, null, null, null, 1, emittance, attenuation, 1, 0, 0, false);
    }
}
