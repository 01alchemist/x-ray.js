/**
 * Created by Nidin Vinayakan on 08-05-2016.
 */
var System = require('systemjs');

System.config({
    packages: {
        "./": {
            format: 'register',
            defaultExtension: 'js'
        },
        'xrenderer': {
            main:"xrenderer",
            format: 'register',
            defaultExtension: 'js'
        }
    },
    map: {
        'xrenderer': "../modules/xrenderer/bundle"
    }
});
System.import('example-node/Example').then(function (module) {
    new module.Example();
}, console.error.bind(console));