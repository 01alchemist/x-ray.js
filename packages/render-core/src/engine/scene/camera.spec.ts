import {Camera} from "./Camera"
import {Vector3} from "../math/Vector3"

test("Camera - new", () => {
    let camera = new Camera();
    expect(camera).toBeDefined();
});

test("Camera - lookAt", () => {
    let eye = new Vector3();
    let look = new Vector3();
    let up = new Vector3();
    let fov = 43;
    let refcamera = Camera.lookAt(eye, look, up, fov);
    let camera = Camera.lookAt(eye, look, up, fov);
    expect(camera).toEqual(refcamera);
});