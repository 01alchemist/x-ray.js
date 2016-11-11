System.register(["./Vector3", "./Constants"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Vector3_1, Constants_1;
    var Ray;
    return {
        setters:[
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            },
            function (Constants_1_1) {
                Constants_1 = Constants_1_1;
            }],
        execute: function() {
            Ray = (function () {
                function Ray(origin, direction) {
                    if (origin === void 0) { origin = new Vector3_1.Vector3(); }
                    if (direction === void 0) { direction = new Vector3_1.Vector3(); }
                    this.origin = origin;
                    this.direction = direction;
                    this.data = new Float32Array([
                        origin.x, origin.y, origin.z,
                        direction.x, direction.y, direction.z
                    ]);
                }
                Ray.prototype.position = function (t) {
                    return this.origin.add(this.direction.mulScalar(t));
                };
                Ray.prototype.reflect = function (i) {
                    return new Ray(this.origin, this.direction.reflect(i.direction));
                };
                Ray.prototype.Refract = function (i, n1, n2) {
                    return new Ray(this.origin, this.direction.refract(i.direction, n1, n2));
                };
                Ray.prototype.reflectance = function (i, n1, n2) {
                    return this.direction.reflectance(i.direction, n1, n2);
                };
                Ray.prototype.weightedBounce = function (u, v) {
                    var m1 = Math.sqrt(u);
                    var m2 = Math.sqrt(1 - u);
                    var a = v * 2 * Math.PI;
                    var q = new Vector3_1.Vector3(u - 0.5, v - 0.5, u + v - 1);
                    var s = this.direction.cross(q.normalize());
                    var t = this.direction.cross(s);
                    var d = new Vector3_1.Vector3();
                    d = d.add(s.mulScalar(m1 * Math.cos(a)));
                    d = d.add(t.mulScalar(m1 * Math.sin(a)));
                    d = d.add(this.direction.mulScalar(m2));
                    return new Ray(this.origin, d);
                };
                Ray.prototype.coneBounce = function (theta, u, v) {
                    if (theta < Constants_1.EPS) {
                        return this;
                    }
                    theta = theta * (1 - (2 * Math.acos(u) / Math.PI));
                    var m1 = Math.sin(theta);
                    var m2 = Math.cos(theta);
                    var a = v * 2 * Math.PI;
                    var s = this.direction.cross(this.direction.minAxis());
                    var t = this.direction.cross(s);
                    var d = new Vector3_1.Vector3();
                    d = d.add(s.mulScalar(m1 * Math.cos(a)));
                    d = d.add(t.mulScalar(m1 * Math.sin(a)));
                    d = d.add(this.direction.mulScalar(m2));
                    return new Ray(this.origin, d);
                };
                Ray.prototype.bounce = function (info, p, u, v) {
                    var n = info.ray;
                    var n1 = 1.0;
                    var n2 = info.material.ior;
                    if (info.inside) {
                        var _n1 = n1;
                        n1 = n2;
                        n2 = _n1;
                    }
                    if (p < n.reflectance(this, n1, n2)) {
                        var reflected = n.reflect(this);
                        var ray = reflected.coneBounce(info.material.gloss, u, v);
                        return { ray: ray, reflected: true };
                    }
                    else if (info.material.transparent) {
                        var refracted = n.Refract(this, n1, n2);
                        var ray = refracted.coneBounce(info.material.gloss, u, v);
                        return { ray: ray, reflected: true };
                    }
                    else {
                        var ray = n.weightedBounce(u, v);
                        return { ray: ray, reflected: false };
                    }
                };
                Ray.prototype.toString = function () {
                    return "Ray:" + this.origin.toString() + " -> " + this.direction.toString();
                };
                return Ray;
            }());
            exports_1("Ray", Ray);
        }
    }
});
//# sourceMappingURL=Ray.js.map