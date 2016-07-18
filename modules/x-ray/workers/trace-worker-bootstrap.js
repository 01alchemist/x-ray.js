importScripts(
    "../../../node_modules/systemjs/dist/system.src.js",
    "../bundle/x-ray"
);

System.config({
    packages: {
        "./": {
            format: 'register',
            defaultExtension: 'js'
        },
        'x-ray': {
            main: "x-ray",
            format: 'register',
            defaultExtension: 'js'
        }
    },
    map: {
        'x-ray': "../bundle/"
    }
});
System.import('TraceWorker').then(function(module){
    //console.log(module);
}, console.error.bind(console));