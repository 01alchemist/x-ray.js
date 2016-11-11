importScripts(
    "../../../node_modules/systemjs/dist/system.src.js",
    "../bundle/x-ray.js"
);

System.config({
    packages: {
        "./": {
            format: 'register',
            defaultExtension: 'js'
        },
        'xrenderer': {
            main: "xrenderer",
            format: 'register',
            defaultExtension: 'js'
        }
    },
    map: {
        'xrenderer': "../bundle/"
    }
});
System.import('TraceWorker').then(function(module){
    //console.log(module);
}, console.error.bind(console));