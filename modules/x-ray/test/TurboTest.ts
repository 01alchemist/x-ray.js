///<reference path="../kernel/rt-kernel.d.ts" />
import {SimpleGUI} from "./SimpleGUI";
// import {ThreeJSView, GIJSView, MathUtils, Thread} from "x-ray";
import Matrix3 = THREE.Matrix3;
import Scene = kernel.Scene;
import {ThreeJSView} from "../core/src/ThreeJSView";
import {GIJSView} from "../core/src/GIJSView";
import {Thread} from "../core/src/engine/renderer/worker/Thread";
import {MathUtils} from "../core/src/engine/utils/MathUtils";
import {Color} from "../core/src/engine/math/Color";
/**
 * Created by Nidin Vinayakan on 27-02-2016.
 */
export class TurboTest extends SimpleGUI {

    private threeJSView:ThreeJSView;
    private giJSView:GIJSView;

    constructor() {
        super();

        Thread.workerUrl = "../workers/trace-worker-bootstrap-debug.js";

        this.i_width = 2560 / 4;
        this.i_height = 1440 / 4;
    }

    onInit() {

        var scene = new Scene(0);

    }
}
