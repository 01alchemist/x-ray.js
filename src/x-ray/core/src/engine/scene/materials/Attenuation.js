System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Attenuation, NoAttenuation, LinearAttenuation, QuadraticAttenuation;
    return {
        setters:[],
        execute: function() {
            Attenuation = (function () {
                function Attenuation(constant, linear, quadratic) {
                    if (constant === void 0) { constant = 1; }
                    if (linear === void 0) { linear = 0; }
                    if (quadratic === void 0) { quadratic = 0; }
                    this.constant = constant;
                    this.linear = linear;
                    this.quadratic = quadratic;
                }
                Attenuation.fromJson = function (attenuation) {
                    if (!attenuation) {
                        return NoAttenuation;
                    }
                    else {
                        return new Attenuation(attenuation.constant, attenuation.linear, attenuation.quadratic);
                    }
                };
                Attenuation.prototype.compute = function (d) {
                    return 1 / (this.constant + this.linear * d + this.quadratic * d * d);
                };
                Attenuation.prototype.set = function (attenation) {
                    this.constant = attenation.constant;
                    this.linear = attenation.linear;
                    this.quadratic = attenation.quadratic;
                    return this;
                };
                Attenuation.prototype.clone = function () {
                    return new Attenuation(this.constant, this.linear, this.quadratic);
                };
                Attenuation.prototype.directWrite = function (mem, offset) {
                    mem[offset++] = this.constant;
                    mem[offset++] = this.linear;
                    mem[offset++] = this.quadratic;
                    return offset;
                };
                Attenuation.prototype.directRead = function (mem, offset) {
                    this.constant = mem[offset++];
                    this.linear = mem[offset++];
                    this.quadratic = mem[offset++];
                    return offset;
                };
                Attenuation.prototype.read = function (memory) {
                    this.constant = memory.readFloat();
                    this.linear = memory.readFloat();
                    this.quadratic = memory.readFloat();
                    return memory.position;
                };
                Attenuation.prototype.write = function (memory) {
                    memory.writeFloat(this.constant);
                    memory.writeFloat(this.linear);
                    memory.writeFloat(this.quadratic);
                    return memory.position;
                };
                Attenuation.SIZE = 3;
                return Attenuation;
            }());
            exports_1("Attenuation", Attenuation);
            exports_1("NoAttenuation", NoAttenuation = new Attenuation(1, 0, 0));
            LinearAttenuation = (function (_super) {
                __extends(LinearAttenuation, _super);
                function LinearAttenuation(value) {
                    _super.call(this, 1, value, 0);
                }
                return LinearAttenuation;
            }(Attenuation));
            exports_1("LinearAttenuation", LinearAttenuation);
            QuadraticAttenuation = (function (_super) {
                __extends(QuadraticAttenuation, _super);
                function QuadraticAttenuation(value) {
                    _super.call(this, 1, 0, value);
                }
                return QuadraticAttenuation;
            }(Attenuation));
            exports_1("QuadraticAttenuation", QuadraticAttenuation);
        }
    }
});
//# sourceMappingURL=Attenuation.js.map