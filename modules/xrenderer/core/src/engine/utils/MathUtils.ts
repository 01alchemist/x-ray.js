import {shift} from "../math/Constants";
import {mask} from "../math/Constants";
import {bias} from "../math/Constants";
/**
 * Created by Nidin Vinayakan on 10-01-2016.
 */
export class MathUtils {

    static radians(degrees:number):number {
        return degrees * Math.PI / 180
    }

    static degrees(radians:number):number {
        return radians * 180 / Math.PI
    }

    static median(items:number[]):number {
        let n = items.length;
        if (n == 0) {
            return 0;
        } else if (n % 2 == 1) {
            return items[n / 2]
        } else {
            var a = items[n / 2 - 1];
            var b = items[n / 2];
            return (a + b) / 2;
        }
    }

    static fract(x:number):number {
        let n = MathUtils.Modf(x);
        return n.frac;
    }

    static Modf(f):{int:number,frac:number} {
        if (f < 1) {
            if (f < 0) {
                let n = MathUtils.Modf(-f);
                return {int: -n.int, frac: -n.frac};
            }
            return {int: 0, frac: f};
        }

        var x:number = f;
        var e:number = (x >> shift) & mask - bias;

        // Keep the top 12+e bits, the integer part; clear the rest.
        if (e < 64 - 12) {
            x &= 1 << (64 - 12 - e) - 1;
            x ^= x;
        }
        var int = x;
        var frac = f - int;
        return {int: int, frac: frac};
    }

    static clampInt(x:number, lo:number, hi:number):number {
        if (x < lo) {
            return lo;
        }
        if (x > hi) {
            return hi;
        }
        return x;
    }
}
