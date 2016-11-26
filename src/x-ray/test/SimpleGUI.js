System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SimpleGUI;
    return {
        setters:[],
        execute: function() {
            SimpleGUI = (function () {
                function SimpleGUI() {
                    var _this = this;
                    this.i_width = 640;
                    this.i_height = 480;
                    console.info("GUI initialized");
                    this.appContainer = document.getElementById("appContainer");
                    if (this.appContainer) {
                        this.init();
                    }
                    else {
                        window.onload = function () {
                            _this.appContainer = document.getElementById("appContainer");
                            _this.init.call(_this);
                        };
                    }
                }
                SimpleGUI.prototype.toggleTrace = function (value) { };
                SimpleGUI.prototype.onCameraChange = function (value) { };
                SimpleGUI.prototype.init = function () {
                    document.body.style.margin = "0px";
                    this.appContainer = document.getElementById("appContainer");
                    this.giOutput = document.getElementById("giOutput");
                    this.webglOutput = document.getElementById("webglOutput");
                    this.controlGui = document.getElementById("control-gui");
                    if (!this.appContainer) {
                        this.appContainer = document.createElement("div");
                        this.appContainer.setAttribute("id", "appContainer");
                        document.body.appendChild(this.appContainer);
                    }
                    this.appContainer.style.background = "#161616";
                    this.appContainer.style.fontFamily = "Courier New";
                    this.appContainer.style.color = "#7F8184";
                    this.appContainer.style.width = "100%";
                    this.appContainer.style.height = "100%";
                    this.appContainer.style.position = "absolute";
                    this.outputContainer = document.createElement("div");
                    this.outputContainer.style.position = "absolute";
                    this.appContainer.appendChild(this.outputContainer);
                    if (!this.webglOutput) {
                        this.webglOutput = document.createElement("div");
                        this.webglOutput.setAttribute("id", "webglOutput");
                        this.outputContainer.appendChild(this.webglOutput);
                    }
                    if (!this.giOutput) {
                        this.giOutput = document.createElement("div");
                        this.giOutput.setAttribute("id", "giOutput");
                        this.outputContainer.appendChild(this.giOutput);
                    }
                    if (!this.controlGui) {
                        this.controlGui = document.createElement("div");
                        this.controlGui.setAttribute("id", "controlGui");
                        document.body.appendChild(this.controlGui);
                    }
                    this.webglOutput.style.width = this.i_width + "px";
                    this.webglOutput.style.height = this.i_height + "px";
                    this.webglOutput.style.backgroundColor = "#585858";
                    this.webglOutput.style.position = "absolute";
                    this.giOutput.style.width = this.i_width + "px";
                    this.giOutput.style.height = this.i_height + "px";
                    this.giOutput.style.backgroundColor = "#3C3C3C";
                    this.giOutput.style.position = "absolute";
                    this.giOutput.style.display = "none";
                    this.resize();
                    new UIL.Title({
                        target: this.controlGui,
                        name: 'Global illumination for ThreeJS by 01Alchemist',
                        id: "v1.0",
                        size: 450,
                        pos: { left: '10px', top: '10px' },
                        simple: false
                    });
                    if (!window["SharedArrayBuffer"]) {
                        this.webglOutput.style.display = "none";
                        this.giOutput.style.display = "none";
                        var msg = "Oops! Your browser does not supported. Start chrome with --enable-blink-feature=SharedArrayBuffer or use Firefox Nightly";
                        new UIL.Title({
                            target: this.controlGui,
                            name: msg,
                            id: "!",
                            size: "900",
                            pos: { left: '10px', top: '50px' },
                            titleColor: "#ff0000",
                            fontColor: "#ff0000",
                            simple: false
                        });
                        new UIL.Button({
                            target: this.controlGui,
                            callback: gotoDownloadPage,
                            name: 'Download Firefox Nightly',
                            size: 200,
                            pos: { left: '10px', top: '100px' },
                            simple: true
                        });
                        function gotoDownloadPage() {
                            location.href = "https://nightly.mozilla.org";
                        }
                        this.giCapable = false;
                        throw "Oops! Your browser does not supported. If you want to try this app go and get Firefox Nightly 46 https://nightly.mozilla.org";
                    }
                    else {
                        this.info = new UIL.Title({
                            target: this.controlGui,
                            name: 'Info:',
                            id: "!",
                            size: 400,
                            pos: { left: '10px', bottom: '10px' },
                            simple: false
                        });
                        this.giCapable = true;
                        this.initGIControls();
                    }
                    window.onresize = this.resize.bind(this);
                    if (this.onInit) {
                        this.onInit();
                    }
                };
                SimpleGUI.prototype.resize = function () {
                    this.outputContainer.style.left = (window.innerWidth - this.i_width) / 2 + "px";
                    this.outputContainer.style.top = (window.innerHeight - (this.i_height)) / 2 + "px";
                };
                SimpleGUI.prototype.toggleGI = function (newValue) {
                    if (newValue) {
                        this.giOutput.style.display = "block";
                    }
                    else {
                        this.giOutput.style.display = "none";
                    }
                };
                SimpleGUI.prototype.initGIControls = function () {
                    var ui = new UIL.Gui({
                        target: this.controlGui,
                        css: 'top:10px; right:10px;',
                        Tpercent: 50,
                        size: 250,
                        left: 200
                    });
                    ui.add('title', { name: 'Options', id: "v1.0", titleColor: '#D4B87B', fontColor: "#D4B87B" });
                    this._gi = ui.add('bool', { name: 'GI View', value: false, callback: this.toggleGI.bind(this), height: 30 });
                    this._tracing = ui.add('bool', {
                        name: 'Ray Trace',
                        value: false,
                        callback: this.toggleTrace.bind(this),
                        height: 30
                    });
                    function callback(data) {
                        console.log(data);
                    }
                };
                return SimpleGUI;
            }());
            exports_1("SimpleGUI", SimpleGUI);
        }
    }
});
//# sourceMappingURL=SimpleGUI.js.map