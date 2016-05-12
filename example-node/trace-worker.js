var System = require('systemjs');

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
        'xrenderer': "../modules/xrenderer/bundle/"
    }
});
// System.import('../modules/xrenderer/workers/TraceWorker.js').then(function(module){
System.import('./TraceWorker').then(function(module){
    //console.log(module);
}, console.error.bind(console));