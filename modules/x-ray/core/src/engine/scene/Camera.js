System.register(["../math/Vector3", "../math/Ray"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Vector3_1, Ray_1;
    var Camera;
    return {
        setters:[
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            },
            function (Ray_1_1) {
                Ray_1 = Ray_1_1;
            }],
        execute: function() {
            Camera = (function () {
                function Camera(p, u, v, w, m, focalDistance, apertureRadius) {
                    this.p = p;
                    this.u = u;
                    this.v = v;
                    this.w = w;
                    this.m = m;
                    this.focalDistance = focalDistance;
                    this.apertureRadius = apertureRadius;
                }
                Camera.fromJson = function (camera) {
                    return new Camera(Vector3_1.Vector3.fromJson(camera.p), Vector3_1.Vector3.fromJson(camera.u), Vector3_1.Vector3.fromJson(camera.v), Vector3_1.Vector3.fromJson(camera.w), camera.m, camera.focalDistance, camera.apertureRadius);
                };
                Camera.lookAt = function (eye, look, up, fovy) {
                    var c = new Camera();
                    c.p = eye;
                    c.w = look.sub(eye).normalize();
                    c.u = up.cross(c.w).normalize();
                    c.v = c.w.cross(c.u).normalize();
                    c.m = 1 / Math.tan(fovy * Math.PI / 360);
                    return c;
                };
                Camera.prototype.updateFromArray = function (eye, look, up, fovy, focus, aperture) {
                    eye = new Vector3_1.Vector3(eye[0], eye[1], eye[2]);
                    look = new Vector3_1.Vector3(look[0], look[1], look[2]);
                    up = new Vector3_1.Vector3(up[0], up[1], up[2]);
                    var c = this;
                    c.p = eye;
                    c.w = look.sub(eye).normalize();
                    c.u = up.cross(c.w).normalize();
                    c.v = c.w.cross(c.u).normalize();
                    c.m = 1 / Math.tan(fovy * Math.PI / 360);
                    c.focalDistance = focus < 0 ? null : focus;
                    c.apertureRadius = aperture < 0 ? null : aperture;
                };
                Camera.prototype.updateFromJson = function (prop) {
                    this.p.setFromJson(prop.p);
                    this.w.setFromJson(prop.w);
                    this.u.setFromJson(prop.u);
                    this.v.setFromJson(prop.v);
                    this.m = prop.m;
                    if (prop.focalDistance && prop.apertureRadius) {
                        this.focalDistance = prop.focalDistance;
                        this.apertureRadius = prop.apertureRadius;
                    }
                };
                Camera.prototype.setFocus = function (focalPoint, apertureRadius) {
                    this.focalDistance = focalPoint.sub(this.p).length();
                    this.apertureRadius = apertureRadius;
                };
                Camera.prototype.castRay = function (x, y, w, h, u, v) {
                    var c = this;
                    var aspect = w / h;
                    var px = ((x + u - 0.5) / (w - 1)) * 2 - 1;
                    var py = ((y + v - 0.5) / (h - 1)) * 2 - 1;
                    var d = new Vector3_1.Vector3();
                    d = d.add(c.u.mulScalar(-px * aspect));
                    d = d.add(c.v.mulScalar(-py));
                    d = d.add(c.w.mulScalar(c.m));
                    d = d.normalize();
                    var p = c.p;
                    if (c.apertureRadius > 0) {
                        var focalPoint = c.p.add(d.mulScalar(c.focalDistance));
                        var angle = Math.random() * 2 * Math.PI;
                        var radius = Math.random() * c.apertureRadius;
                        p = p.add(c.u.mulScalar(Math.cos(angle) * radius));
                        p = p.add(c.v.mulScalar(Math.sin(angle) * radius));
                        d = focalPoint.sub(p).normalize();
                    }
                    return new Ray_1.Ray(p, d);
                };
                Camera.prototype.toJSON = function () {
                    return {
                        p: this.p,
                        w: this.w,
                        u: this.u,
                        v: this.v,
                        m: this.m,
                        focalDistance: this.focalDistance,
                        apertureRadius: this.apertureRadius
                    };
                };
                Camera.debug = true;
                return Camera;
            }());
            exports_1("Camera", Camera);
        }
    }
});
//# sourceMappingURL=Camera.js.map