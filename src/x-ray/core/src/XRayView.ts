import {XRayRenderBase} from "./XRayRenderBase";
import {Color} from "./engine/math/Color";
import {SharedScene} from "./engine/scene/SharedScene";
import {Cube} from "./engine/scene/shapes/Cube";
import {ThreeObjects} from "./ThreeObjects";
import {TMatrix4} from "./engine/math/TMatrix4";
import {MathUtils} from "./engine/utils/MathUtils";

var xColor = xray.Color;
var xVec3 = xray.Vector;
var xMat = xray.Material;
var xCamera = xray.Camera;
var xShape = xray.Shape;
var xTriangle = xray.Triangle;
var xMesh = xray.Mesh;
var xSphere = xray.Sphere;
var xCube = xray.Cube;
var xMasterScene = xray.MasterScene;
/**
 * Created by Nidin Vinayakan on 27-02-2016.
 */

export class XRayView extends XRayRenderBase {

    constructor(public width:number, public height:number, public container?:HTMLElement) {
        super(width, height, container);

        this.scene = new xMasterScene(0x262626);
        // this.scene.AddDefaultLights();

        //default ground
        //this.scene.add(Cube.newCube(new Vector3(-100, -1, -100), new Vector3(100, 0, 100), new DiffuseMaterial(new Color(1, 1, 1))));
        //lights
        //this.scene.add(Sphere.newSphere(new Vector3(0, 50, 0), 1, new LightMaterial(Color.hexColor(0xffeedd), 1, NoAttenuation)));
        //this.scene.add(Sphere.newSphere(new Vector3(0, 50, 0), 1, new LightMaterial(Color.hexColor(0xffeedd), 1, NoAttenuation)));
        //this.scene.add(Sphere.newSphere(new Vector3(0, 600, 0), 200, new LightMaterial(Color.hexColor(0xffeedd), 10, NoAttenuation)));

        this.camera = xCamera.LookAt(xVec3.NewVector(0, 0, 0), xVec3.NewVector(0, 0, 0), xVec3.NewVector(0, 0, 1), 45);

        this.cameraSamples = -1;
        this.hitSamples = 1;
        this.bounces = 4;
        this.iterations = 1000000;
        this.blockIterations = 1;
    }

    setThreeJSScene(scene, onInit?:Function) {
        this.loadChildren(scene);
        console.time("Scene builder");
        // this.scene.AddDefaultLights();
        // this.scene.AddDebugScene();
        this.scene.Commit();
        console.timeEnd("Scene builder");
        this.render(onInit);
    }

    private loadChildren(parent) {
        var child;
        for (var i:number = 0; i < parent.children.length; i++) {
            child = parent.children[i];

            var obj:number = this.buildSceneObject(child);
            if (obj) {
                this.scene.Add(obj);
            }
            if (obj) {
                if (!(xMat.IsLight(xShape.MaterialAt(obj, xVec3.NewVector()))) && child.children.length > 0) {
                    this.loadChildren(child);
                }
            } else {
                if (child.children.length > 0) {
                    this.loadChildren(child);
                }
            }
        }
    }

    identityMatrix = new THREE.Matrix4().identity();

    private buildSceneObject(src):number {

        switch (src.type) {
            case ThreeObjects.Mesh:
                var material = XRayView.getTurboMaterial(src.material);
                var shape:number = this.buildTurboGeometry(src.geometry, material, src.smooth);

                var matrixWorld = src.matrixWorld;

                if (matrixWorld.equals(this.identityMatrix)) {
                    return shape;
                } else {
                    var mat = xray.Matrix.fromTHREEJS(matrixWorld.elements);
                    return xray.TransformedShape.NewTransformedShape(shape, mat);
                }

            case ThreeObjects.PointLight:
                return this.getTurboLight(src);

        }

        return null;
    }
    private buildTurboGeometry(geometry, material, smooth):number {
        if (geometry["_bufferGeometry"]) {
            geometry = geometry["_bufferGeometry"];
        }

        var triangles:number[] = [];
        // var triangles;

        if (!geometry.attributes) {

            var vertices = geometry.vertices;
            var faces = geometry.faces;
            if (vertices && faces) {
                // triangles = turbo.Runtime.allocOrThrow( 4 + ( 4 * (faces.length) ), 4 ) /*Array*/;
                // turbo.Runtime._mem_int32[triangles >> 2] = (faces.length);
                for (var i = 0; i < faces.length; i++) {
                    var face = faces[i];
                    var t:number = xTriangle.initInstance(turbo.Runtime.allocOrThrow(53,4));

                    turbo.Runtime._mem_int32[(t + 44) >> 2] = material;
                    turbo.Runtime._mem_int32[(t + 8) >> 2] = xVec3.NewVector(vertices[face.a].x, vertices[face.a].y, vertices[face.a].z);
                    turbo.Runtime._mem_int32[(t + 12) >> 2] = xVec3.NewVector(vertices[face.b].x, vertices[face.b].y, vertices[face.b].z);
                    turbo.Runtime._mem_int32[(t + 16) >> 2] = xVec3.NewVector(vertices[face.c].x, vertices[face.c].y, vertices[face.c].z);
                    turbo.Runtime._mem_int32[(t + 20) >> 2] = xVec3.NewVector();
                    turbo.Runtime._mem_int32[(t + 24) >> 2] = xVec3.NewVector();
                    turbo.Runtime._mem_int32[(t + 28) >> 2] = xVec3.NewVector();

                    // triangle.updateBox();
                    // triangle.fixNormals();
                    triangles.push(t);
                    // turbo.Runtime._mem_int32[(  triangles + 4 + (4 * i)  ) >> 2] = t;
                }
            } else {
                return null;
            }

        } else {

            var positions:Float32Array = geometry.attributes["position"].array;
            if(geometry.attributes["uv"]){
                var uv:Float32Array = geometry.attributes["uv"].array;
            }

            var normals:Float32Array;
            if (geometry.attributes["normal"]) {
                normals = geometry.attributes["normal"].array;
            } else {
                normals = this.computeNormals(positions);
            }
            var triCount:number = 0;
            var indexAttribute = geometry.getIndex();

            if (indexAttribute) {

                var indices = indexAttribute.array;
                var uvIndex:number = 0;
                // triangles = turbo.Runtime.allocOrThrow( 4 + ( 4 * (indices.length) ), 4 ) /*Array*/;
                // turbo.Runtime._mem_int32[triangles >> 2] = (indices.length);

                for (var i = 0; i < indices.length; i = i + 3) {

                    triCount++;

                    let a;
                    let b;
                    let c;

                    a = indices[i];
                    b = indices[i + 1];
                    c = indices[i + 2];

                    if (triCount % 2 !== 0) {
                        a = indices[i];
                        b = indices[i + 1];
                        c = indices[i + 2];
                    } else {
                        c = indices[i];
                        b = indices[i + 1];
                        a = indices[i + 2];
                    }

                    //[....,ax,ay,az, bx,by,bz, cx,xy,xz,....]
                    let ax = a * 3;
                    let ay = (a * 3) + 1;
                    let az = (a * 3) + 2;

                    let bx = b * 3;
                    let by = (b * 3) + 1;
                    let bz = (b * 3) + 2;

                    let cx = c * 3;
                    let cy = (c * 3) + 1;
                    let cz = (c * 3) + 2;

                    let au = a * 2;
                    let av = (a * 2) + 1;

                    let bu = b * 2;
                    let bv = (b * 2) + 1;

                    let cu = c * 2;
                    let cv = (c * 2) + 1;

                    let t = xTriangle.initInstance(turbo.Runtime.allocOrThrow(53,4));
                    turbo.Runtime._mem_int32[(t + 44) >> 2] = material;
                    turbo.Runtime._mem_int32[(t + 8) >> 2] = xVec3.NewVector(positions[ax], positions[ay], positions[az]);
                    turbo.Runtime._mem_int32[(t + 12) >> 2] = xVec3.NewVector(positions[bx], positions[by], positions[bz]);
                    turbo.Runtime._mem_int32[(t + 16) >> 2] = xVec3.NewVector(positions[cx], positions[cy], positions[cz]);

                    turbo.Runtime._mem_int32[(t + 20) >> 2] = xVec3.NewVector(normals[ax], normals[ay], normals[az]);
                    turbo.Runtime._mem_int32[(t + 24) >> 2] = xVec3.NewVector(normals[bx], normals[by], normals[bz]);
                    turbo.Runtime._mem_int32[(t + 28) >> 2] = xVec3.NewVector(normals[cx], normals[cy], normals[cz]);

                    if(uv){
                        turbo.Runtime._mem_int32[(t + 32) >> 2] = xVec3.NewVector(uv[au], uv[av], 0);
                        turbo.Runtime._mem_int32[(t + 36) >> 2] = xVec3.NewVector(uv[bu], uv[bv], 0);
                        turbo.Runtime._mem_int32[(t + 40) >> 2] = xVec3.NewVector(uv[cu], uv[cv], 0);
                    }

                    // triangle.fixNormals();
                    // triangle.updateBox();
                    triangles.push(t);
                    // turbo.Runtime._mem_int32[(  triangles + 4 + (4 * i)  ) >> 2] = t;
                    uvIndex += 2;
                }

            } else {
                uvIndex = 0;
                // triangles = turbo.Runtime.allocOrThrow( 4 + ( 4 * (positions.length) ), 4 ) /*Array*/;
                // turbo.Runtime._mem_int32[triangles >> 2] = (positions.length);
                for (let i = 0; i < positions.length; i = i + 9) {

                    let t = xTriangle.initInstance(turbo.Runtime.allocOrThrow(53,4));
                    turbo.Runtime._mem_int32[(t + 44) >> 2] = material;

                    turbo.Runtime._mem_int32[(t + 8) >> 2] = xVec3.NewVector(positions[i], positions[i + 1], positions[i + 2]);
                    turbo.Runtime._mem_int32[(t + 12) >> 2] = xVec3.NewVector(positions[i + 3], positions[i + 4], positions[i + 5]);
                    turbo.Runtime._mem_int32[(t + 16) >> 2] = xVec3.NewVector(positions[i + 6], positions[i + 7], positions[i + 8]);

                    turbo.Runtime._mem_int32[(t + 20) >> 2] = xVec3.NewVector(normals[i], normals[i + 1], normals[i + 2]);
                    turbo.Runtime._mem_int32[(t + 24) >> 2] = xVec3.NewVector(normals[i + 3], normals[i + 4], normals[i + 5]);
                    turbo.Runtime._mem_int32[(t + 28) >> 2] = xVec3.NewVector(normals[i + 6], normals[i + 7], normals[i + 8]);

                    if(uv){
                        turbo.Runtime._mem_int32[(t + 32) >> 2] = xVec3.NewVector(uv[uvIndex], uv[uvIndex + 1], 0);
                        turbo.Runtime._mem_int32[(t + 36) >> 2] = xVec3.NewVector(uv[uvIndex + 2], uv[uvIndex + 3], 0);
                        turbo.Runtime._mem_int32[(t + 40) >> 2] = xVec3.NewVector(uv[uvIndex + 4], uv[uvIndex + 5], 0);
                    }

                    //xTriangle.UpdateBox(t);
                    xTriangle.FixNormals(t);
                    // triangle.fixNormals();
                    // triangle.updateBox();
                    triangles.push(t);
                    // turbo.Runtime._mem_int32[(  triangles + 4 + (4 * i)  ) >> 2] = t;
                    uvIndex += 6;
                }
            }
        }
        let meshRef:number = xMesh.NewMesh(xTriangle.Pack(triangles));
        // Mesh.SmoothNormals(meshRef);
        return meshRef;
    }
    /*private buildGeometry(geometry:THREE.BufferGeometry|any, material:Material, smooth:boolean=false):Shape {

        if (geometry["_bufferGeometry"]) {
            geometry = geometry["_bufferGeometry"];
        }

        var triangles:Triangle[] = [];

        if (!geometry.attributes) {

            var vertices = geometry.vertices;
            var faces = geometry.faces;
            if (vertices && faces) {
                for (var i = 0; i < faces.length; i++) {
                    var face = faces[i];

                    var triangle = new Triangle();
                    triangle.material = material;
                    triangle.v1 = new Vector3(vertices[face.a].x, vertices[face.a].y, vertices[face.a].z);
                    triangle.v2 = new Vector3(vertices[face.b].x, vertices[face.b].y, vertices[face.b].z);
                    triangle.v3 = new Vector3(vertices[face.c].x, vertices[face.c].y, vertices[face.c].z);
                    triangle.n1 = new Vector3();
                    triangle.n2 = new Vector3();
                    triangle.n3 = new Vector3();
                    triangle.updateBox();
                    triangle.fixNormals();
                    triangles.push(triangle);
                }
            } else {
                return null;
            }

        } else {

            var positions:Float32Array = geometry.attributes["position"].array;
            if(geometry.attributes["uv"]){
                var uv:Float32Array = geometry.attributes["uv"].array;
            }

            var normals:Float32Array;
            if (geometry.attributes["normal"]) {
                normals = geometry.attributes["normal"].array;
            } else {
                normals = this.computeNormals(positions);
            }
            var triCount:number = 0;
            var indexAttribute = geometry.getIndex();

            if (indexAttribute) {

                var indices = indexAttribute.array;
                var uvIndex:number = 0;
                for (var i = 0; i < indices.length; i = i + 3) {

                    triCount++;

                    var a;
                    var b;
                    var c;

                    a = indices[i];
                    b = indices[i + 1];
                    c = indices[i + 2];

                    if (triCount % 2 !== 0) {
                        a = indices[i];
                        b = indices[i + 1];
                        c = indices[i + 2];
                    } else {
                        c = indices[i];
                        b = indices[i + 1];
                        a = indices[i + 2];
                    }

                    //[....,ax,ay,az, bx,by,bz, cx,xy,xz,....]
                    var ax = a * 3;
                    var ay = (a * 3) + 1;
                    var az = (a * 3) + 2;

                    var bx = b * 3;
                    var by = (b * 3) + 1;
                    var bz = (b * 3) + 2;

                    var cx = c * 3;
                    var cy = (c * 3) + 1;
                    var cz = (c * 3) + 2;

                    var au = a * 2;
                    var av = (a * 2) + 1;

                    var bu = b * 2;
                    var bv = (b * 2) + 1;

                    var cu = c * 2;
                    var cv = (c * 2) + 1;

                    var triangle = new Triangle();
                    triangle.material = material;
                    triangle.v1 = new Vector3(positions[ax], positions[ay], positions[az]);
                    triangle.v2 = new Vector3(positions[bx], positions[by], positions[bz]);
                    triangle.v3 = new Vector3(positions[cx], positions[cy], positions[cz]);

                    triangle.n1 = new Vector3(normals[ax], normals[ay], normals[az]);
                    triangle.n2 = new Vector3(normals[bx], normals[by], normals[bz]);
                    triangle.n3 = new Vector3(normals[cx], normals[cy], normals[cz]);

                    if(uv){
                        triangle.t1 = new Vector3(uv[au], uv[av], 0);
                        triangle.t2 = new Vector3(uv[bu], uv[bv], 0);
                        triangle.t3 = new Vector3(uv[cu], uv[cv], 0);
                    }

                    triangle.fixNormals();
                    triangle.updateBox();
                    triangles.push(triangle);
                    uvIndex += 2;
                }

            } else {
                uvIndex = 0;
                for (var i = 0; i < positions.length; i = i + 9) {
                    var triangle = new Triangle();
                    triangle.material = material;
                    triangle.v1 = new Vector3(positions[i], positions[i + 1], positions[i + 2]);
                    triangle.v2 = new Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
                    triangle.v3 = new Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
                    triangle.n1 = new Vector3(normals[i], normals[i + 1], normals[i + 2]);
                    triangle.n2 = new Vector3(normals[i + 3], normals[i + 4], normals[i + 5]);
                    triangle.n3 = new Vector3(normals[i + 6], normals[i + 7], normals[i + 8]);

                    if(uv){
                        triangle.t1 = new Vector3(uv[uvIndex], uv[uvIndex + 1], 0);
                        triangle.t2 = new Vector3(uv[uvIndex + 2], uv[uvIndex + 3], 0);
                        triangle.t3 = new Vector3(uv[uvIndex + 4], uv[uvIndex + 5], 0);
                    }

                    triangle.fixNormals();
                    triangle.updateBox();
                    triangles.push(triangle);
                    uvIndex += 6;
                }
            }
        }

        var mesh:Mesh = Mesh.newMesh(triangles);
        if(smooth){
            mesh.smoothNormals();
        }
        return mesh;
    }*/

    computeNormals(positions:Float32Array):Float32Array {
        return new Float32Array(positions.length);
    }

    updateCamera(camera:THREE.PerspectiveCamera) {
        let e = camera.matrix.elements;
        let x = {x:-e[0], y:-e[1], z:-e[2]};
        let y = {x:e[4], y:e[5], z:e[6]};
        let z = {x:-e[8], y:-e[9], z:-e[10]};

        xray.Camera.SetFromJSON(this.camera, {
            p:camera.position,
            u:x,
            v:y,
            w:z,
            m:1 / Math.tan(camera.fov * Math.PI / 360)
        });

        //console.log(JSON.stringify(this.camera.toJSON()));
        this.dirty = true;
        if (this.renderer) {
            this.renderer.traceManager.stop();
        }
    }

    private static getTurboMaterial(srcMaterial:any):number {
        if(srcMaterial instanceof THREE.MultiMaterial){
            srcMaterial = srcMaterial.materials[0];
        }

        var material:number = xMat.DiffuseMaterial(xray.Color.HexColor(srcMaterial.color.getHex()));
        // var material:number = xMat.SpecularMaterial(xray.Color.HexColor(srcMaterial.color.getHex()), xray.Utils.Radians(15));
        return material;
    }
    /*private static getMaterial(srcMaterial:any):Material {
        //var material:Material = new DiffuseMaterial(Color.hexColor(srcMaterial.color.getHex()));

        if(srcMaterial instanceof THREE.MultiMaterial){
            srcMaterial = srcMaterial.materials[0];
        }

        var material:Material = new Material(Color.hexColor(srcMaterial.color.getHex()));
        material.ior = srcMaterial.ior ? srcMaterial.ior : 1;
        material.tint = srcMaterial.tint ? srcMaterial.tint : 0;
        material.gloss = srcMaterial.gloss ? srcMaterial.gloss : 0;
        material.emittance = srcMaterial.emittance ? srcMaterial.emittance : 0;
        material.transparent = srcMaterial.transparent;
        material.attenuation = Attenuation.fromJson(srcMaterial.attenuation);

        if (srcMaterial.map) {
            if(srcMaterial.map.image && srcMaterial.map.image.length == 0){
                var image = srcMaterial.map.mipmaps[0];
                material.texture = new Texture();
                material.texture.setImageData(image.width, image.height, image.data);
                material.texture.sourceFile = srcMaterial.map.uuid;
            }else if(srcMaterial.map.image){
                material.texture = new Texture(srcMaterial.map.image);
            }
        }
        if (srcMaterial.normalMap) {
            if(srcMaterial.normalMap.image && srcMaterial.normalMap.image.length == 0){
                var image = srcMaterial.normalMap.mipmaps[0];
                material.normalTexture = new Texture();
                material.normalTexture.setImageData(image.width, image.height, image.data);
                material.normalTexture.sourceFile = srcMaterial.normalMap.uuid;
            }else if(srcMaterial.normalMap.image){
                material.normalTexture = new Texture(srcMaterial.normalMap.image);
            }
        }
        if (srcMaterial.bumpMap) {
            if(srcMaterial.bumpMap.image && srcMaterial.bumpMap.image.length == 0){
                var image = srcMaterial.bumpMap.mipmaps[0];
                material.bumpTexture = new Texture();
                material.bumpTexture.setImageData(image.width, image.height, image.data);
                material.bumpTexture.sourceFile = srcMaterial.bumpMap.uuid;
            }else if(srcMaterial.bumpMap.image){
                material.bumpTexture = new Texture(srcMaterial.bumpMap.image);
            }
        }
        return material;
    }*/

    private getTurboLight(src:any):number {
        if (src.children.length > 0) {
            var lightGeometry = src.children[0].geometry;
            if (lightGeometry instanceof THREE.SphereGeometry) {
                var _radius = lightGeometry.parameters.radius;
            } else if (lightGeometry instanceof THREE.PlaneGeometry) {
                var width = lightGeometry.parameters.width;
                var height = lightGeometry.parameters.height;
            }
            // _radius = lightGeometry.boundingSphere.radius;
        }
        console.log(`intensity:${src.intensity}`);
        var material:number = xMat.LightMaterial(xColor.HexColor(src.color.getHex()), src.intensity * 10);
        if (_radius) {
            // var shape = xSphere.NewSphere(xVec3.NewVector(src.position.x, src.position.y, src.position.z), _radius, material);
            var shape = xSphere.NewSphere(xVec3.NewVector(), _radius, material);
        } else {
            shape = xCube.NewCube(
                // new Vector3(src.position.x - width / 2, src.position.y, src.position.z - height / 2),
                // new Vector3(src.position.x + width / 2, src.position.y, src.position.z + height / 2),
                xVec3.NewVector(-width / 2, src.position.y, -height / 2),
                xVec3.NewVector(width / 2, src.position.y + 1, height / 2),
                material);
        }
        // return shape;
        // var mat:Matrix = Matrix4.fromTHREEJS(src.matrix.elements);
        // return TransformedShape.newTransformedShape(sphere, mat);
        if (src.matrix.equals(this.identityMatrix)) {
            return shape;
        } else {
            var mat = xray.Matrix.fromTHREEJS(src.matrix.elements);
            return xray.TransformedShape.NewTransformedShape(shape, mat);
        }
    }

    /*private getLight(src:any):Shape {
        if (src.children.length > 0) {
            var lightGeometry = src.children[0].geometry;
            if (lightGeometry instanceof THREE.SphereGeometry) {
                var _radius = lightGeometry.parameters.radius;
            } else if (lightGeometry instanceof THREE.PlaneGeometry) {
                var width = lightGeometry.parameters.width;
                var height = lightGeometry.parameters.height;
            }
            // _radius = lightGeometry.boundingSphere.radius;
        }
        var material = new LightMaterial(Color.hexColor(src.color.getHex()), src.intensity, new LinearAttenuation(src.distance));
        if (_radius) {
            var shape = Sphere.newSphere(new Vector3(src.position.x, src.position.y, src.position.z), _radius, material);
        } else {
            shape = Cube.newCube(
                // new Vector3(src.position.x - width / 2, src.position.y, src.position.z - height / 2),
                // new Vector3(src.position.x + width / 2, src.position.y, src.position.z + height / 2),
                new Vector3(-width / 2, src.position.y, -height / 2),
                new Vector3(width / 2, src.position.y + 1, height / 2),
                material);
        }
        return shape;
        //var mat:Matrix4 = Matrix4.fromTHREEJS(src.matrix.elements);
        //return TransformedShape.newTransformedShape(sphere, mat);
    }*/
}
