import {TraceWorker} from "./TraceWorker";
/**
 * Created by Nidin on 4/1/2016.
 */
export class Thread {

    instance:Worker;

    onTraceComplete:Function;
    onInitComplete:Function;
    onPixelsLocked:Function;

    initialized:boolean;
    isTracing:boolean;

    constructor(name:string, public id:number) {

        //console.log("Thread:"+name);

        this.instance = new Worker("../workers/trace-worker-bootstrap.js");

        var self = this;

        this.instance.onmessage = function (event) {
            if (event.data == TraceWorker.INITED) {
                self.initialized = true;
                self.isTracing = false;
                if (self.onInitComplete) {
                    self.onInitComplete(self);
                }
            }
            if (event.data == TraceWorker.TRACED) {
                self.isTracing = false;
                if (self.onTraceComplete) {
                    self.onTraceComplete(self);
                }
            }
            if (event.data == TraceWorker.LOCKED) {
                self.isTracing = false;
                if (self.onPixelsLocked) {
                    self.onPixelsLocked(self);
                }
            }
        }
    }

    init(param:any, transferable:any[], onInit:Function) {
        this.onInitComplete = onInit;
        param.command = TraceWorker.INIT;
        param.id = this.id;
        this.send(param, transferable);
    }

    trace(param:any, onComplete:Function):void {
        this.onTraceComplete = onComplete;
        this.isTracing = true;
        param.command = TraceWorker.TRACE;
        this.send(param);
    }
    send(data:any, buffers?):void {
        this.instance.postMessage(data, buffers);
    }

    terminate():void {
        //this.onTraceComplete = null;
        this.isTracing = false;
        //this.send(TraceWorker.TERMINATE);
    }
}