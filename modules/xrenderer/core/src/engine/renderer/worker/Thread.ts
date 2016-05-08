import {TraceJob} from "./TraceJob";
import {TraceJobManager} from "./TraceJobManager";
/**
 * Created by Nidin on 4/1/2016.
 */
export class Thread {

    static workerUrl:string = "../workers/trace-worker-bootstrap.js";

    instance:Worker;

    onTraceComplete:Function;
    onInitComplete:Function;
    onThreadLocked:Function;

    initialized:boolean;
    private _isTracing:boolean;
    get isTracing():boolean {
        return this._isTracing;
    }

    constructor(name:string, public id:number) {

        //console.log("Thread:"+name);

        this.instance = new Worker(Thread.workerUrl);
        this.instance.onmessage = this.onMessageReceived.bind(this);
    }

    onMessageReceived(event) {
        if (event.data == TraceJob.INITED) {
            this.initialized = true;
            this._isTracing = false;
            if (this.onInitComplete) {
                this.onInitComplete(this);
            }
        }
        if (event.data == TraceJob.TRACED) {
            this._isTracing = false;
            TraceJobManager.flags[3 + this.id] = 0;
            if (this.onTraceComplete) {
                this.onTraceComplete(this);
            }
        }
        if (event.data == TraceJob.LOCKED) {
            this._isTracing = false;
            TraceJobManager.flags[3 + this.id] = 3;
            if (this.onThreadLocked) {
                this.onThreadLocked(this);
            }
        }
    }

    init(param:any, transferable:any[], onInit:Function) {
        console.log("Initializing thread " + this.id);
        this.onInitComplete = onInit;
        param.command = TraceJob.INIT;
        param.id = this.id;
        this.send(param, transferable);
    }

    trace(param:any, onComplete:Function):void {
        if(TraceJobManager.flags[3 + this.id] == 2) {
            this._isTracing = false;
            TraceJobManager.flags[3 + this.id] = 3;
            if (this.onThreadLocked) {
                this.onThreadLocked(this);
            }
        }
        else {
            this._isTracing = true;
            TraceJobManager.flags[3 + this.id] = 1;
            this.onTraceComplete = onComplete;
            param.command = TraceJob.TRACE;
            this.send(param);
        }
    }

    send(data:any, buffers?):void {
        this.instance.postMessage(data, buffers);
    }

    terminate():void {
        //this.onTraceComplete = null;
        //this.send(TraceJob.TERMINATE);
    }
}