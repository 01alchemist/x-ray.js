// combine kernel modules and compile

let fs = require("fs");
let path = require("path");
let turbo = require("../../../node_modules/turbo.js/lib/compiler.js");
let compiler = new turbo();
let modules = [
    "./src/global.tts",
    "./src/structures.tts",
    "./src/mem_op.tts",
    "./src/Color.tts",
    "./src/Texture.tts",
    "./src/Material.tts",
    "./src/Shape.tts",
    "./src/Triangle.tts",
    "./src/Object3D.tts",
    "./src/BufferGeometry.tts",
    "./src/Mesh.tts",
    "./src/Scene.tts",
];
var source = "namespace kernel {\n\n";
modules.forEach((file) => {
    var content = fs.readFileSync(path.resolve(__dirname, file));
    source += content + "\n\n";
});
source += "}";

fs.writeFileSync(path.resolve(__dirname, "rt-kernel.tts"), source);

compiler.compile([path.resolve(__dirname, "rt-kernel.tts")]);

fs.unlinkSync(path.resolve(__dirname, "rt-kernel.tts"));

