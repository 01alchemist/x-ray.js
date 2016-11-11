System.register(["../scene/shapes/Mesh", "../math/Vector3", "../scene/shapes/Triangle", "../utils/MapUtils", "../math/Color"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Mesh_1, Vector3_1, Triangle_1, MapUtils_1, Color_1;
    var OBJLoader;
    return {
        setters:[
            function (Mesh_1_1) {
                Mesh_1 = Mesh_1_1;
            },
            function (Vector3_1_1) {
                Vector3_1 = Vector3_1_1;
            },
            function (Triangle_1_1) {
                Triangle_1 = Triangle_1_1;
            },
            function (MapUtils_1_1) {
                MapUtils_1 = MapUtils_1_1;
            },
            function (Color_1_1) {
                Color_1 = Color_1_1;
            }],
        execute: function() {
            OBJLoader = (function () {
                function OBJLoader() {
                    this.hasMaterials = false;
                    this.materialsLoaded = false;
                    this.materialsLoading = false;
                    this.pendingCallback = null;
                }
                OBJLoader.prototype.load = function (url, onLoad) {
                    console.log("Loading OBJ:" + url);
                    this.basePath = url.substring(0, url.lastIndexOf("/"));
                    var self = this;
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.onload = function () {
                        self.lastMesh = self.loadOBJ(xhr.response);
                        if (onLoad) {
                            if (self.hasMaterials && self.materialsLoaded) {
                                onLoad(self.lastMesh);
                            }
                            else if (!self.hasMaterials) {
                                onLoad(self.lastMesh);
                            }
                            else {
                                self.pendingCallback = onLoad;
                            }
                        }
                    };
                    xhr.send(null);
                    return null;
                };
                OBJLoader.parseIndex = function (value, length) {
                    var n = parseInt(value);
                    if (n < 0) {
                        n += length;
                    }
                    return n;
                };
                OBJLoader.parseLine = function (line) {
                    try {
                        var result = line.match(/^(\S+)\s(.*)/);
                        if (result) {
                            var _str = result.slice(1);
                        }
                        else {
                            return null;
                        }
                    }
                    catch (e) {
                        console.log("Error in line:", line, e);
                        return null;
                    }
                    if (!_str) {
                        return null;
                    }
                    else {
                        return {
                            keyword: _str[0],
                            value: _str[1].split(/ {1,}/)
                        };
                    }
                };
                OBJLoader.parseFloats = function (fs) {
                    var floats = [];
                    fs.forEach(function (f) {
                        floats.push(parseFloat(f));
                    });
                    return floats;
                };
                OBJLoader.prototype.loadOBJ = function (data) {
                    this.hasMaterials = false;
                    this.materialsLoaded = false;
                    this.materialsLoading = false;
                    var vs = [null];
                    var vts = [null];
                    var vns = [null];
                    var triangles;
                    this.materials = new Map();
                    var material = this.parentMaterial;
                    var lines = data.split("\n");
                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i].trim();
                        if (line.length == 0) {
                            continue;
                        }
                        var item = OBJLoader.parseLine(line);
                        if (item) {
                            var f = void 0;
                            var v = void 0;
                            switch (item.keyword) {
                                case "mtllib":
                                    this.hasMaterials = true;
                                    this.materialsLoaded = false;
                                    this.loadMTL(item.value[0]);
                                    break;
                                case "usemtl":
                                    material = this.getMaterial(item.value[0]);
                                    break;
                                case "v":
                                    f = OBJLoader.parseFloats(item.value);
                                    v = new Vector3_1.Vector3(f[0], f[1], f[2]);
                                    vs = MapUtils_1.append(vs, v);
                                    break;
                                case "vt":
                                    f = OBJLoader.parseFloats(item.value);
                                    v = new Vector3_1.Vector3(f[0], f[1], 0);
                                    vts = MapUtils_1.append(vts, v);
                                    break;
                                case "vn":
                                    f = OBJLoader.parseFloats(item.value);
                                    v = new Vector3_1.Vector3(f[0], f[1], f[2]);
                                    vns = MapUtils_1.append(vns, v);
                                    break;
                                case "f":
                                    var fvs = [];
                                    var fvts = [];
                                    var fvns = [];
                                    item.value.forEach(function (str, i) {
                                        var vertex = str.split(/\/\/{1,}/);
                                        fvs[i] = OBJLoader.parseIndex(vertex[0], vs.length);
                                        fvts[i] = OBJLoader.parseIndex(vertex[1], vts.length);
                                        fvns[i] = OBJLoader.parseIndex(vertex[2], vns.length);
                                    });
                                    for (var i_1 = 1; i_1 < fvs.length - 1; i_1++) {
                                        var i1 = 0;
                                        var i2 = i_1;
                                        var i3 = i_1 + 1;
                                        var t = new Triangle_1.Triangle();
                                        t.material = material;
                                        t.v1 = vs[fvs[i1]];
                                        t.v2 = vs[fvs[i2]];
                                        t.v3 = vs[fvs[i3]];
                                        t.t1 = vts[fvts[i1]];
                                        t.t2 = vts[fvts[i2]];
                                        t.t3 = vts[fvts[i3]];
                                        t.n1 = vns[fvns[i1]];
                                        t.n2 = vns[fvns[i2]];
                                        t.n3 = vns[fvns[i3]];
                                        t.updateBox();
                                        t.fixNormals();
                                        triangles = MapUtils_1.append(triangles, t);
                                    }
                                    break;
                            }
                        }
                    }
                    return Mesh_1.Mesh.newMesh(triangles);
                };
                OBJLoader.prototype.getMaterial = function (index) {
                    if (this.materials[index] == undefined) {
                        var material = this.parentMaterial.clone();
                        this.materials[index] = material;
                        return material;
                    }
                    else {
                        return this.materials[index];
                    }
                };
                OBJLoader.prototype.loadMTL = function (url) {
                    if (this.materialsLoaded || this.materialsLoading) {
                        return;
                    }
                    this.materialsLoading = true;
                    url = this.basePath == "" ? url : this.basePath + "/" + url;
                    console.log("Loading MTL:" + url);
                    var self = this;
                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', url, true);
                    xhr.onload = function () {
                        var lines = xhr.response.split("\n");
                        for (var i = 0; i < lines.length; i++) {
                            var line = lines[i].trim();
                            if (line.length == 0) {
                                continue;
                            }
                            var item = OBJLoader.parseLine(line);
                            if (item) {
                                var material;
                                switch (item.keyword) {
                                    case "newmtl":
                                        material = self.materials[item.value[0]];
                                        material = material ? material : self.parentMaterial.clone();
                                        self.materials[item.value[0]] = material;
                                        break;
                                    case "Kd":
                                        var c = OBJLoader.parseFloats(item.value);
                                        material.color = new Color_1.Color(c[0], c[1], c[2]);
                                        break;
                                    case "map_Kd":
                                        break;
                                }
                            }
                        }
                        self.materialsLoaded = true;
                        if (self.pendingCallback) {
                            self.pendingCallback(self.lastMesh);
                            self.pendingCallback = null;
                        }
                    };
                    xhr.send(null);
                    return null;
                };
                return OBJLoader;
            }());
            exports_1("OBJLoader", OBJLoader);
        }
    }
});
//# sourceMappingURL=OBJLoader.js.map