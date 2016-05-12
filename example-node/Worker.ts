/**
 * Created by Nidin Vinayakan on 11/5/2016.
 */
export class Worker {

    private thread;
    public onmessage:Function;

    constructor(url:string) {
        this.thread = fork(url);

        this.thread.on('message', function (args) {
            return typeof this.onmessage === 'function' ? this.onmessage({
                data: args
            }) : void 8;
        });

        console.log(this);
    }

    postMessage(data, transferables) {
        this.thread.send(data);
    }

    terminate() {
        this.thread.destroy();
    }

    addEventListener(event, cb) {
        if (event === 'message') {
            return this.onmessage = cb;
        } else {
            return this.thread.on(event, cb);
        }
    }

    dispatchEvent(event) {
        return this.thread.send(event);
    }
}