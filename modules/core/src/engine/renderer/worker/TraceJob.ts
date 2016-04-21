import {TraceWorker} from "./TraceWorker";
import {Thread} from "./Thread";
import {ByteArrayBase} from "../../../pointer/ByteArrayBase";

export class TraceJob {

    public finished:boolean;
    public runCount:number = 0;

    private id:number;
    private _time:number;
    private _lifeCount:number;

    public get lifeCount():number {
        return this._lifeCount;
    }

    public get time():number {
        return this._time;
    }

    constructor(public param:any, public extra:any = {}) {
        this.id = param.id;
        this.finished = false;
    }

    start(thread:Thread, onComplete:Function) {

        this._time = performance.now();
        var self = this;
        var _param = this.getTraceParam();
        thread.trace(_param, function (thread:Thread) {
            self._time = performance.now() - self._time;
            self._lifeCount = Math.round(self._time / 10);

            if (onComplete) {
                onComplete(self, thread);
            }
        });

        this.runCount++;
    }

    getTraceParam() {

        var _param = {init_iterations: 0};
        var extraCount = 0;
        for (key in this.extra) {
            if (this.extra.hasOwnProperty(key)) {
                _param[key] = this.extra[key];
                delete this.extra[key];
                extraCount++;
            }
        }
        if (extraCount > 0) {
            for (var key in this.param) {
                if (this.param.hasOwnProperty(key)) {
                    _param[key] = this.param[key];
                }
            }
        } else {
            _param = this.param;
        }

        _param.init_iterations = (this.runCount * this.param.blockIterations) - (this.runCount > 0 ? (this.param.blockIterations - 1) : 0);
        return _param;
    }
}
