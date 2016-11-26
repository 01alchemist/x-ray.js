System.register(["../../math/Color", "./Texture", "./Attenuation"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Color_1, Texture_1, Attenuation_1, Attenuation_2;
    var MaterialType, Material;
    return {
        setters:[
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (Texture_1_1) {
                Texture_1 = Texture_1_1;
            },
            function (Attenuation_1_1) {
                Attenuation_1 = Attenuation_1_1;
                Attenuation_2 = Attenuation_1_1;
            }],
        execute: function() {
            (function (MaterialType) {
                MaterialType[MaterialType["GENERIC"] = 0] = "GENERIC";
                MaterialType[MaterialType["DIFFUSE"] = 1] = "DIFFUSE";
                MaterialType[MaterialType["SPECULAR"] = 2] = "SPECULAR";
                MaterialType[MaterialType["CLEAR"] = 3] = "CLEAR";
                MaterialType[MaterialType["GLOSSY"] = 4] = "GLOSSY";
                MaterialType[MaterialType["EMISSIVE"] = 5] = "EMISSIVE";
            })(MaterialType || (MaterialType = {}));
            exports_1("MaterialType", MaterialType);
            Material = (function () {
                function Material(color, texture, normalTexture, bumpTexture, bumpMultiplier, emittance, attenuation, ior, gloss, tint, transparent) {
                    if (color === void 0) { color = new Color_1.Color(); }
                    if (attenuation === void 0) { attenuation = Attenuation_2.NoAttenuation; }
                    this.color = color;
                    this.texture = texture;
                    this.normalTexture = normalTexture;
                    this.bumpTexture = bumpTexture;
                    this.bumpMultiplier = bumpMultiplier;
                    this.emittance = emittance;
                    this.attenuation = attenuation;
                    this.ior = ior;
                    this.gloss = gloss;
                    this.tint = tint;
                    this.transparent = transparent;
                    this.type = MaterialType.GENERIC;
                    this.index = Material.map.push(this) - 1;
                }
                Material.prototype.clone = function () {
                    var material = new Material(this.color.clone(), this.texture, this.normalTexture, this.bumpTexture, this.bumpMultiplier, this.emittance, this.attenuation.clone(), this.ior, this.gloss, this.tint, this.transparent);
                    material.type = this.type;
                    return material;
                };
                Material.prototype.directRead = function (memory, offset) {
                    offset = this.color.directRead(memory, offset);
                    this.bumpMultiplier = memory[offset++];
                    this.emittance = memory[offset++];
                    offset = this.attenuation.directRead(memory, offset);
                    this.ior = memory[offset++];
                    this.gloss = memory[offset++];
                    this.tint = memory[offset++];
                    this.transparent = memory[offset++] == 1;
                    return offset;
                };
                Material.prototype.directWrite = function (memory, offset) {
                    offset = this.color.directWrite(memory, offset);
                    memory[offset++] = this.bumpMultiplier;
                    memory[offset++] = this.emittance;
                    offset = this.attenuation.directWrite(memory, offset);
                    memory[offset++] = this.ior;
                    memory[offset++] = this.gloss;
                    memory[offset++] = this.tint;
                    memory[offset++] = this.transparent ? 1 : 0;
                    return offset;
                };
                Material.prototype.read = function (memory) {
                    this.color.read(memory);
                    this.bumpMultiplier = memory.readFloat();
                    this.emittance = memory.readFloat();
                    this.attenuation.read(memory);
                    this.ior = memory.readFloat();
                    this.gloss = memory.readFloat();
                    this.tint = memory.readFloat();
                    this.transparent = memory.readBoolean();
                    var hasTexture = memory.readBoolean();
                    if (hasTexture) {
                        this.texture = Texture_1.Texture.getTexture(memory.readUTF());
                    }
                    var hasNormalTexture = memory.readBoolean();
                    if (hasNormalTexture) {
                        this.normalTexture = Texture_1.Texture.getTexture(memory.readUTF());
                    }
                    return memory.position;
                };
                Material.prototype.write = function (memory) {
                    this.color.write(memory);
                    memory.writeFloat(this.bumpMultiplier);
                    memory.writeFloat(this.emittance);
                    this.attenuation.write(memory);
                    memory.writeFloat(this.ior);
                    memory.writeFloat(this.gloss);
                    memory.writeFloat(this.tint);
                    memory.writeBoolean(this.transparent);
                    if (this.texture) {
                        memory.writeBoolean(true);
                        memory.writeUTF(this.texture.sourceFile);
                    }
                    else {
                        memory.writeBoolean(false);
                    }
                    if (this.normalTexture) {
                        memory.writeBoolean(true);
                        memory.writeUTF(this.normalTexture.sourceFile);
                    }
                    else {
                        memory.writeBoolean(false);
                    }
                    return memory.position;
                };
                Object.defineProperty(Material, "estimatedMemory", {
                    get: function () {
                        return Material.SIZE * Material.map.length + 1;
                    },
                    enumerable: true,
                    configurable: true
                });
                ;
                Material.directWrite = function (memory, offset) {
                    memory[offset++] = Material.map.length;
                    Material.map.forEach(function (material) {
                        offset = material.directWrite(memory, offset);
                    });
                    return offset;
                };
                Material.directRestore = function (memory, offset) {
                    if (offset === void 0) { offset = 0; }
                    var numMaterials = memory[offset++];
                    for (var i = 0; i < numMaterials; i++) {
                        offset = new Material().directRead(memory, offset);
                    }
                    return offset;
                };
                Material.write = function (memory) {
                    memory.writeUnsignedInt(Material.map.length);
                    Material.map.forEach(function (material) {
                        material.write(memory);
                    });
                    return memory.position;
                };
                Material.restore = function (memory) {
                    var numMaterials = memory.readUnsignedInt();
                    for (var i = 0; i < numMaterials; i++) {
                        new Material().read(memory);
                    }
                    return memory.position;
                };
                Material.SIZE = Color_1.Color.SIZE + Attenuation_1.Attenuation.SIZE + 6;
                Material.map = [];
                return Material;
            }());
            exports_1("Material", Material);
        }
    }
});
//# sourceMappingURL=Material.js.map