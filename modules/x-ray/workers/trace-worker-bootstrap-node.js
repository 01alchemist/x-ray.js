/*importScripts(
    "../../../node_modules/systemjs/dist/system.src.js",
    "../bundle/x-ray"
);*/

var System = require('systemjs');

System.config({
    packages: {
        "../modules/x-ray/workers": {
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
// System.import('../modules/x-ray/workers/TraceWorker.js').then(function(module){
System.import('TraceWorker').then(function(module){
    //console.log(module);
}, console.error.bind(console));