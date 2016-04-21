import {Shape} from "../scene/shapes/Shape";
import {INF} from "./Constants";
import {HitInfo} from "./HitInfo";
import {Ray} from "./Ray";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export class Hit{


    constructor(public shape:Shape, public T:number, public info?:HitInfo){

    }
    ok():boolean{
        return this.T < INF;
    }
    getInfo(ray:Ray):HitInfo{
        if(this.info){
            return this.info;
        }
        let shape = this.shape;
        let position = ray.position(this.T);
        let normal = shape.getNormal(position);
        let color = shape.getColor(position);
        let material = shape.getMaterial(position);
        let inside = false;
        if(normal.dot(ray.direction) > 0){
            normal = normal.mulScalar(-1);
            inside = true;
        }
        ray = new Ray(position, normal);
        this.info = new HitInfo(shape, position, normal, ray, color, material, inside);
        return this.info;
    }
}
export var NoHit:Hit = new Hit(null, INF);