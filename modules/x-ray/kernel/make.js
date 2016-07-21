// combine kernel modules and compile

let fs = require("fs");
let turbo = require("../../../node_modules/turbo.js/lib/compiler.js");
let compiler = new turbo();
let modules = [
    "src/global.pjs",
    "src/structures.pjs",
    "src/mem_op.pjs",
    "src/Color.pjs",
    "src/Texture.pjs",
    "src/Material.pjs",
    "src/Shape.pjs",
    "src/Triangle.pjs",
    "src/Object3D.pjs",
    "src/BufferGeometry.pjs",
    "src/Mesh.pjs",
    "src/Scene.pjs",
];
var source = "";
modules.forEach((file) => {
    var content = fs.readFileSync(file);
    source += content + "\n";
});

fs.writeFileSync("kernel-all.pjs", source);

console.log(compiler.compile(["kernel-all.pjs"]));

