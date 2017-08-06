/*importScripts(
    "../../../node_modules/systemjs/dist/system.src.js",
    "../bundle/xrenderer.js"
);*/

var System = require('systemjs');

System.config({
    packages: {
        "../modules/xrenderer/workers": {
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
// System.import('../modules/xrenderer/workers/TraceWorker.js').then(function(module){
System.import('TraceWorker').then(function(module){
    //console.log(module);
}, console.error.bind(console));