
importScripts(
    "../../../node_modules/systemjs/dist/system.src.js"
);
exports = self.exports ? self.exports : {};
importScripts('../../../libs/xray-kernel/turbo-runtime.js', '../../../node_modules/three/build/three.js');
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