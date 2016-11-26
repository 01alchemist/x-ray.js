System.register(["./Material", "../../math/Color", "./Texture", "./Attenuation", "./DiffuseMaterial", "./SpecularMaterial", "./ClearMaterial", "./GlossyMaterial", "./LightMaterial"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Material_1, Material_2, Color_1, Texture_1, Attenuation_1, DiffuseMaterial_1, SpecularMaterial_1, ClearMaterial_1, GlossyMaterial_1, LightMaterial_1;
    var MaterialUtils;
    return {
        setters:[
            function (Material_1_1) {
                Material_1 = Material_1_1;
                Material_2 = Material_1_1;
            },
            function (Color_1_1) {
                Color_1 = Color_1_1;
            },
            function (Texture_1_1) {
                Texture_1 = Texture_1_1;
            },
            function (Attenuation_1_1) {
                Attenuation_1 = Attenuation_1_1;
            },
            function (DiffuseMaterial_1_1) {
                DiffuseMaterial_1 = DiffuseMaterial_1_1;
            },
            function (SpecularMaterial_1_1) {
                SpecularMaterial_1 = SpecularMaterial_1_1;
            },
            function (ClearMaterial_1_1) {
                ClearMaterial_1 = ClearMaterial_1_1;
            },
            function (GlossyMaterial_1_1) {
                GlossyMaterial_1 = GlossyMaterial_1_1;
            },
            function (LightMaterial_1_1) {
                LightMaterial_1 = LightMaterial_1_1;
            }],
        execute: function() {
            MaterialUtils = (function () {
                function MaterialUtils() {
                }
                MaterialUtils.fromJson = function (material) {
                    if (!material)
                        return null;
                    switch (material.type) {
                        case Material_2.MaterialType.GENERIC:
                            return new Material_1.Material(Color_1.Color.fromJson(material.color), Texture_1.Texture.fromJson(material.texture), Texture_1.Texture.fromJson(material.normalTexture), Texture_1.Texture.fromJson(material.bumpTexture), material.bumpMultiplier, material.emittance, Attenuation_1.Attenuation.fromJson(material.attenuation), material.index, material.gloss, material.tint, material.transparent);
                        case Material_2.MaterialType.DIFFUSE:
                            return new DiffuseMaterial_1.DiffuseMaterial(Color_1.Color.fromJson(material.color));
                        case Material_2.MaterialType.SPECULAR:
                            return new SpecularMaterial_1.SpecularMaterial(Color_1.Color.fromJson(material.color), material.index);
                        case Material_2.MaterialType.CLEAR:
                            return new ClearMaterial_1.ClearMaterial(material.index, material.gloss);
                        case Material_2.MaterialType.GLOSSY:
                            return new GlossyMaterial_1.GlossyMaterial(Color_1.Color.fromJson(material.color), material.index, material.gloss);
                        case Material_2.MaterialType.EMISSIVE:
                            return new LightMaterial_1.LightMaterial(Color_1.Color.fromJson(material.color), material.emittance, Attenuation_1.Attenuation.fromJson(material.attenuation));
                    }
                };
                MaterialUtils.debug = true;
                return MaterialUtils;
            }());
            exports_1("MaterialUtils", MaterialUtils);
        }
    }
});
//# sourceMappingURL=MaterialUtils.js.map