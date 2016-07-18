/**
 * Created by Nidin Vinayakan on 08-05-2016.
 */
var System = require('systemjs');
var os = require('os');
var fs = require('fs');
var PNG = require("pngjs").PNG;
fork = require('child_process').fork;
Worker = {};

var numCpus = os.cpus().length;

navigator = {
    hardwareConcurrency: numCpus
};

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
        'x-ray': "../modules/x-ray/bundle"
    }
});
System.import('Example').then(function (module) {
    new module.Example();
}, console.error.bind(console));