/**
 * Created by Nidin Vinayakan on 26/2/2016.
 */
export class ThreeJSView {

    public camera:THREE.PerspectiveCamera;
    public scene:THREE.Scene;
    public renderer:THREE.WebGLRenderer;
    public controls:any;

    public onCameraChange:Function;

    constructor(public width:number, public height:number, public container:HTMLElement, public appContainer:HTMLElement) {

        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 20000);
        this.camera.up = new THREE.Vector3(0, 1, 0);
        this.camera.position.y = 10;
        this.camera.position.z = 10;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        // scene
        this.scene = new THREE.Scene();
        this.scene.position.x = 0;
        this.scene.position.y = 0;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        this.controls = new THREE["EditorControls"](this.camera, this.appContainer);
        this.controls.addEventListener('change', () => {
            this.render();
            if (this.onCameraChange) {
                this.onCameraChange(this.camera);
            }
        });
        //this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}