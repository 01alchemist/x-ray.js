import {Material} from "./Material";
import {Color} from "../../math/Color";
import {NoAttenuation} from "./Attenuation";
import {MaterialType} from "./Material";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export class ClearMaterial extends Material{

    type:MaterialType = MaterialType.CLEAR;

    constructor(index:number, gloss:number){
        super(new Color(), null, null, null, 1, 0, NoAttenuation, index, gloss, 0, true);
    }
}
