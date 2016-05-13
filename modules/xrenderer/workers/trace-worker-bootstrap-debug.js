importScripts(
    "../../../node_modules/systemjs/dist/system.src.js"
);

System.config({
    packages: {
        "../": {
            format: 'register',
            defaultExtension: 'js'
        }
    }
});
System.import('TraceWorkerDebug').then(function(module){
    //console.log(module);
}, console.error.bind(console));