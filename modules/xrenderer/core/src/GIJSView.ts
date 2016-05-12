import {GIRenderBase} from "./GIRenderBase";
import {OBJLoader} from "./engine/data/OBJLoader";
import {SpecularMaterial} from "./engine/scene/materials/SpecularMaterial";
import {Color} from "./engine/math/Color";
import {Camera} from "./engine/scene/Camera";
import {SharedScene} from "./engine/scene/SharedScene";
import {Cube} from "./engine/scene/shapes/Cube";
import {Vector3} from "./engine/math/Vector3";
import {DiffuseMaterial} from "./engine/scene/materials/DiffuseMaterial";
import {Sphere} from "./engine/scene/shapes/Sphere";
import {LightMaterial} from "./engine/scene/materials/LightMaterial";
import {NoAttenuation} from "./engine/scene/materials/Attenuation";
import {Shape} from "./engine/scene/shapes/Shape";
import {ThreeObjects} from "./ThreeObjects";
import {Mesh} from "./engine/scene/shapes/Mesh";
import {Triangle} from "./engine/scene/shapes/Triangle";
import {Material} from "./engine/scene/materials/Material";
import {TransformedShape} from "./engine/scene/shapes/TransformedShape";
import {TransparentMaterial} from "./engine/scene/materials/TransparentMaterial";
import {Attenuation} from "./engine/scene/materials/Attenuation";
import {LinearAttenuation} from "./engine/scene/materials/Attenuation";
import {TMatrix4} from "./engine/math/TMatrix4";
import {MathUtils} from "./engine/utils/MathUtils";
import {Matrix4} from "./engine/math/Matrix4";

/**
 * Created by Nidin Vinayakan on 27-02-2016.
 */

export class GIJSView extends GIRenderBase {

    constructor(public width:number, public height:number, public container?:HTMLElement) {
        super(width, height, container);

        this.scene = new SharedScene(Color.hexColor(0x262626));

        //default ground
        //this.scene.add(Cube.newCube(new Vector3(-100, -1, -100), new Vector3(100, 0, 100), new DiffuseMaterial(new Color(1, 1, 1))));
        //lights
        //this.scene.add(Sphere.newSphere(new Vector3(0, 50, 0), 1, new LightMaterial(Color.hexColor(0xffeedd), 1, NoAttenuation)));
        //this.scene.add(Sphere.newSphere(new Vector3(0, 50, 0), 1, new LightMaterial(Color.hexColor(0xffeedd), 1, NoAttenuation)));
        //this.scene.add(Sphere.newSphere(new Vector3(0, 600, 0), 200, new LightMaterial(Color.hexColor(0xffeedd), 10, NoAttenuation)));

        this.camera = Camera.lookAt(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(0, 1, 0), 45);

        this.cameraSamples = -1;
        this.hitSamples = 1;
        this.bounces = 4;
        this.iterations = 1000000;
        this.blockIterations = 1;
    }

    setThreeJSScene(scene, onInit?:Function) {
        this.loadChildren(scene);
        this.render(onInit);
    }

    private loadChildren(parent) {
        var child;
        for (var i:number = 0; i < parent.children.length; i++) {
            child = parent.children[i];

            var obj:Shape = this.buildSceneObject(child);
            if (obj) {
                this.scene.add(obj);
            }
            if (obj) {
                if (!(obj.getMaterial(new Vector3()) instanceof LightMaterial) && child.children.length > 0) {
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

    private buildSceneObject(src):Shape {

        switch (src.type) {
            case ThreeObjects.Mesh:
                var material = GIJSView.getMaterial(src.material);
                var shape:Shape = this.buildGeometry(src.geometry, material);

                var matrixWorld = src.matrixWorld;

                if (matrixWorld.equals(this.identityMatrix)) {
                    return shape;
                } else {
                    var mat:Matrix4 = Matrix4.fromTHREEJS(matrixWorld.elements);
                    return TransformedShape.newTransformedShape(shape, mat);
                }

            case ThreeObjects.PointLight:
                return this.getLight(src);

        }

        return null;
    }

    private buildGeometry(geometry:THREE.BufferGeometry|any, material:Material):Shape {

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

                    var triangle = new Triangle();
                    triangle.material = material;
                    triangle.v1 = new Vector3(positions[ax], positions[ay], positions[az]);
                    triangle.v2 = new Vector3(positions[bx], positions[by], positions[bz]);
                    triangle.v3 = new Vector3(positions[cx], positions[cy], positions[cz]);

                    /*if (triCount % 2 !== 0) {
                     triangle.n3 = new Vector3(normals[ax], normals[ay], normals[az]);
                     triangle.n2 = new Vector3(normals[bx], normals[by], normals[bz]);
                     triangle.n1 = new Vector3(normals[cx], normals[cy], normals[cz]);
                     } else {
                     triangle.n1 = new Vector3(normals[ax], normals[ay], normals[az]);
                     triangle.n2 = new Vector3(normals[bx], normals[by], normals[bz]);
                     triangle.n3 = new Vector3(normals[cx], normals[cy], normals[cz]);
                     }*/

                    triangle.n1 = new Vector3(normals[ax], normals[ay], normals[az]);
                    triangle.n2 = new Vector3(normals[bx], normals[by], normals[bz]);
                    triangle.n3 = new Vector3(normals[cx], normals[cy], normals[cz]);

                    triangle.fixNormals();
                    triangle.updateBox();
                    triangles.push(triangle);
                }

            } else {
                for (var i = 0; i < positions.length; i = i + 9) {
                    var triangle = new Triangle();
                    triangle.material = material;
                    triangle.v1 = new Vector3(positions[i], positions[i + 1], positions[i + 2]);
                    triangle.v2 = new Vector3(positions[i + 3], positions[i + 4], positions[i + 5]);
                    triangle.v3 = new Vector3(positions[i + 6], positions[i + 7], positions[i + 8]);
                    triangle.n1 = new Vector3(normals[i], normals[i + 1], normals[i + 2]);
                    triangle.n2 = new Vector3(normals[i + 3], normals[i + 4], normals[i + 5]);
                    triangle.n3 = new Vector3(normals[i + 6], normals[i + 7], normals[i + 8]);
                    triangle.fixNormals();
                    triangle.updateBox();
                    triangles.push(triangle);
                }
            }
        }

        var mesh:Mesh = Mesh.newMesh(triangles);
        //mesh.smoothNormals();
        return mesh;
    }

    computeNormals(positions:Float32Array):Float32Array {
        return new Float32Array(positions.length);
    }

    updateCamera(camera:THREE.PerspectiveCamera) {
        //console.log(JSON.stringify(this.camera.toJSON()));
        this.camera.p.setFromJson(camera.position);
        this.camera.m = 1 / Math.tan(camera.fov * Math.PI / 360);
        let e = camera.matrix.elements;
        let x = [-e[0], -e[1], -e[2]];
        let y = [e[4], e[5], e[6]];
        let z = [-e[8], -e[9], -e[10]];

        this.camera.u.setFromArray(x);
        this.camera.v.setFromArray(y);
        this.camera.w.setFromArray(z);
        //console.log(JSON.stringify(this.camera.toJSON()));
        this.dirty = true;
        if (this.renderer) {
            this.renderer.traceManager.stop();
        }
    }

    private static getMaterial(srcMaterial:any):Material {
        //var material:Material = new DiffuseMaterial(Color.hexColor(srcMaterial.color.getHex()));
        var material:Material = new Material(Color.hexColor(srcMaterial.color.getHex()));
        material.ior = srcMaterial.ior ? srcMaterial.ior : 1;
        material.tint = srcMaterial.tint ? srcMaterial.tint : 0;
        material.gloss = srcMaterial.gloss ? srcMaterial.gloss : 0;
        material.emittance = srcMaterial.emittance ? srcMaterial.emittance : 0;
        material.transparent = srcMaterial.transparent;
        material.attenuation = Attenuation.fromJson(srcMaterial.attenuation);
        return material;
    }

    private getLight(src:any):Shape {
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
    }
}
