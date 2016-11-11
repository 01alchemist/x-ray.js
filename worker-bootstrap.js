importScripts(
    "node_modules/systemjs/dist/system.src.js",
    /*"build/gi-three.js",*/
    "libs/threejs/three.js"
);

System.config({
    packages: {
        "src": {
            format: 'register',
            defaultExtension: 'js'
        }
    }
});
System.import('modules/x-ray/workers/TraceWorker').then(null, console.error.bind(console));