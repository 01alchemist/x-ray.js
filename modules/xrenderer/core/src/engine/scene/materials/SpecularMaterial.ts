import {Material} from "./Material";
import {Color} from "../../math/Color";
import {NoAttenuation} from "./Attenuation";
import {MaterialType} from "./Material";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export class SpecularMaterial extends Material{

    type:MaterialType = MaterialType.SPECULAR;

    constructor(color:Color, index:number){
        super(color, null, null, null, 1, 0, NoAttenuation, index, 0, 0, false);
    }
}
