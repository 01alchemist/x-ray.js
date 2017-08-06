import {Material} from "./Material";
import {Color} from "../../math/Color";
import {NoAttenuation} from "./Attenuation";
import {MaterialType} from "./Material";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export class DiffuseMaterial extends Material{

    type:MaterialType = MaterialType.DIFFUSE;

    constructor(color:Color){
        super(color, null, null, null, 1, 0, NoAttenuation, 1, 0, 0, false);
    }
}
