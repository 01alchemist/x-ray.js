"use strict";
/**
 * Created by Nidin Vinayakan on 6/13/2016.
 */
var WORKER_ENV = false;
if (typeof importScripts === 'function') {
    var window = this;
    WORKER_ENV = true;
}
// var Atomics:any = window["Atomics"];
// var SharedArrayBuffer:any = window["SharedArrayBuffer"];
// if (typeof "Atomics" == "undefined") {
//     window["Atomics"] = {
//         load: function () {
//             throw "No Atomics";
//         },
//         store: function () {
//             throw "No Atomics";
//         },
//         add: function () {
//             throw "No Atomics";
//         },
//         sub: function () {
//             throw "No Atomics";
//         },
//         and: function () {
//             throw "No Atomics";
//         },
//         or: function () {
//             throw "No Atomics";
//         },
//         xor: function () {
//             throw "No Atomics";
//         },
//         compareExchange: function () {
//             throw "No Atomics";
//         }
//     };
// }
function MemoryError(msg) {
    this.message = msg;
}
MemoryError.prototype = new Error("Memory Error");
var RuntimeConstructor = (function () {
    function RuntimeConstructor() {
        this.NULL = 0;
        this.int8 = { SIZE: 1, ALIGN: 1, NAME: "int8" };
        this.uint8 = { SIZE: 1, ALIGN: 1, NAME: "uint8" };
        this.int16 = { SIZE: 2, ALIGN: 2, NAME: "int16" };
        this.uint16 = { SIZE: 2, ALIGN: 2, NAME: "uint16" };
        this.int32 = { SIZE: 4, ALIGN: 4, NAME: "int32" };
        this.uint32 = { SIZE: 4, ALIGN: 4, NAME: "uint32" };
        this.float32 = { SIZE: 4, ALIGN: 4, NAME: "float32" };
        this.float64 = { SIZE: 8, ALIGN: 8, NAME: "float64" };
        this.int32x4 = { SIZE: 16, ALIGN: 16, NAME: "int32x4" };
        this.float32x4 = { SIZE: 16, ALIGN: 16, NAME: "float32x4" };
        this.float64x2 = { SIZE: 16, ALIGN: 16, NAME: "float64x2" };
        this._mem_int8 = null;
        this._mem_uint8 = null;
        this._mem_int16 = null;
        this._mem_uint16 = null;
        this._mem_int32 = null;
        this._mem_uint32 = null;
        this._mem_float32 = null;
        this._mem_float64 = null;
        this.freeList = [];
        this.totalFreeMemory = 0;
        this._now = (typeof 'performance' != 'undefined' && typeof performance.now == 'function' ?
            performance.now.bind(performance) :
            Date.now.bind(Date));
        // Map of class type IDs to type objects.
        this._idToType = {};
    }
    /*
     * Initialize the local Turbo instance.
     *
     * "buffer" can be an ArrayBuffer or SharedArrayBuffer.  In the
     * latter case, all workers must pass the same buffer during
     * initialization.
     *
     * The buffer must be zero-initialized before being passed to
     * init().  Turbo assumes ownership of the buffer, client code
     * should not access it directly after using it to initialize
     * the heap.
     *
     * "start" must be a valid offset within the buffer, it is the
     * first byte that may be used.
     *
     * "limit" must be a valid offset within the buffer, limit-1 is
     * the last byte that may be used.
     *
     * "initialize" must be true in exactly one agent and that call
     * must return before any agent can call any other methods on
     * their local Turbo objects.  Normally, you would allocate your
     * memory in the main thread, call Turbo.init(buffer, true) in
     * the main thread, and then distribute the buffer to workers.
     */
    RuntimeConstructor.prototype.init = function (buffer, start, limit, initialize) {
        if (arguments.length < 3) {
            throw new Error("Required arguments: buffer, start, limit");
        }
        if ((start | 0) != start || (limit | 0) != limit) {
            throw new Error("Invalid bounds: " + start + " " + limit);
        }
        start = (start + 7) & ~7;
        limit = (limit & ~7);
        if (start < 0 || limit <= start || limit > buffer.byteLength) {
            throw new Error("Invalid bounds: " + start + " " + limit);
        }
        var len = (limit - start);
        if (len < 16) {
            throw new Error("The memory is too small even for metadata");
        }
        if (buffer instanceof ArrayBuffer) {
            this.alloc = alloc_ab;
        }
        else if (buffer instanceof SharedArrayBuffer) {
            this.alloc = alloc_sab;
        }
        else {
            throw new Error("Turbo can be initialized only on SharedArrayBuffer or ArrayBuffer");
        }
        this._mem_int8 = new Int8Array(buffer, start, len);
        this._mem_uint8 = new Uint8Array(buffer, start, len);
        this._mem_int16 = new Int16Array(buffer, start, len / 2);
        this._mem_uint16 = new Uint16Array(buffer, start, len / 2);
        this._mem_int32 = new Int32Array(buffer, start, len / 4);
        this._mem_uint32 = new Uint32Array(buffer, start, len / 4);
        this._mem_float32 = new Float32Array(buffer, start, len / 4);
        this._mem_float64 = new Float64Array(buffer, start, len / 8);
        if (initialize) {
            this._mem_int32[2] = len;
            if (buffer instanceof ArrayBuffer) {
                this._mem_int32[1] = 16;
            }
            else if (buffer instanceof SharedArrayBuffer) {
                Atomics.store(this._mem_int32, 1, 16);
            }
        }
    };
    /*
     * Given a nonnegative size in bytes and a nonnegative
     * power-of-two alignment, allocate and zero-initialize an object
     * of the necessary size (or larger) and required alignment, and
     * return its address.
     *
     * Return NULL if no memory is available.
     */
    RuntimeConstructor.prototype.alloc = function (nbytes, alignment) {
        // Overridden during initialization.
        throw new Error("Not initialized");
    };
    /*
     * Ditto, but throw if no memory is available.
     *
     * Interesting possibility is to avoid this function
     * and instead move the test into each initInstance().
     */
    RuntimeConstructor.prototype.allocOrThrow = function (nbytes, alignment) {
        var p = this.alloc(nbytes, alignment);
        if (p == 0)
            throw new MemoryError("Out of memory");
        return p;
    };
    /*
     * Given a pointer returned from alloc or calloc, free the memory.
     * p may be NULL in which case the call does nothing.
     */
    RuntimeConstructor.prototype.free = function (p) {
        // Drop it on the floor, for now
        // In the future: figure out the size from the header or other info,
        // add to free list, etc etc.
        var type = this._idToType[this._mem_int32[p >> 2]];
        this.totalFreeMemory += type.SIZE;
        this.freeList.push({ ptr: p, size: type.SIZE });
    };
    /*
     * Given an pointer to a class instance, return its type object.
     * Return null if no type object is found.
     */
    RuntimeConstructor.prototype.identify = function (p) {
        if (p == 0)
            return null;
        if (this._idToType.hasOwnProperty(this._mem_int32[p >> 2]))
            return this._idToType[this._mem_int32[p >> 2]];
        return null;
    };
    RuntimeConstructor.prototype._badType = function (self) {
        var t = this.identify(self);
        return new Error("Observed type: " + (t ? t.NAME : "*invalid*") + ", address=" + self);
    };
    // Synchronic layout is 8 bytes (2 x int32) of metadata followed by
    // the type-specific payload.  The two int32 words are the number
    // of waiters and the wait word (generation count).
    //
    // In the following:
    //
    // self is the base address for the Synchronic.
    // mem is the array to use for the value
    // idx is the index in mem of the value: (p+8)>>log2(mem.BYTES_PER_ELEMENT)
    //
    // _synchronicLoad is just Atomics.load, expand it in-line.
    RuntimeConstructor.prototype._synchronicStore = function (self, mem, idx, value) {
        Atomics.store(mem, idx, value);
        this._notify(self);
        return value;
    };
    RuntimeConstructor.prototype._synchronicCompareExchange = function (self, mem, idx, oldval, newval) {
        var v = Atomics.compareExchange(mem, idx, oldval, newval);
        if (v == oldval)
            this._notify(self);
        return v;
    };
    RuntimeConstructor.prototype._synchronicAdd = function (self, mem, idx, value) {
        var v = Atomics.add(mem, idx, value);
        this._notify(self);
        return v;
    };
    RuntimeConstructor.prototype._synchronicSub = function (self, mem, idx, value) {
        var v = Atomics.sub(mem, idx, value);
        this._notify(self);
        return v;
    };
    RuntimeConstructor.prototype._synchronicAnd = function (self, mem, idx, value) {
        var v = Atomics.and(mem, idx, value);
        this._notify(self);
        return v;
    };
    RuntimeConstructor.prototype._synchronicOr = function (self, mem, idx, value) {
        var v = Atomics.or(mem, idx, value);
        this._notify(self);
        return v;
    };
    RuntimeConstructor.prototype._synchronicXor = function (self, mem, idx, value) {
        var v = Atomics.xor(mem, idx, value);
        this._notify(self);
        return v;
    };
    RuntimeConstructor.prototype._synchronicLoadWhenNotEqual = function (self, mem, idx, value) {
        for (;;) {
            var tag = Atomics.load(this._mem_int32, (self + 4) >> 2);
            var v = Atomics.load(mem, idx);
            if (v !== value)
                break;
            this._waitForUpdate(self, tag, Number.POSITIVE_INFINITY);
        }
        return v;
    };
    RuntimeConstructor.prototype._synchronicLoadWhenEqual = function (self, mem, idx, value) {
        for (;;) {
            var tag = Atomics.load(this._mem_int32, (self + 4) >> 2);
            var v = Atomics.load(mem, idx);
            if (v === value)
                break;
            this._waitForUpdate(self, tag, Number.POSITIVE_INFINITY);
        }
        return v;
    };
    RuntimeConstructor.prototype._synchronicExpectUpdate = function (self, mem, idx, value, timeout) {
        var now = this._now();
        var limit = now + timeout;
        for (;;) {
            var tag = Atomics.load(this._mem_int32, (self + 4) >> 2);
            var v = Atomics.load(mem, idx);
            if (v !== value || now >= limit)
                break;
            this._waitForUpdate(self, tag, limit - now);
            now = this._now();
        }
    };
    RuntimeConstructor.prototype._waitForUpdate = function (self, tag, timeout) {
        // Spin for a short time before going into the futexWait.
        //
        // Hard to know what a good count should be - it is machine
        // dependent, for sure, and "typical" applications should
        // influence the choice.  If the count is high without
        // hindering an eventual drop into futexWait then it will just
        // decrease performance.  If the count is low it is pointless.
        // (This is why Synchronic really wants a native implementation.)
        //
        // Data points from a 2.6GHz i7 MacBook Pro:
        //
        // - the simple send-integer benchmark (test-sendint.html),
        //   which is the very simplest case we can really imagine,
        //   gets noisy timings with an iteration count below 4000
        //
        // - the simple send-object benchmark (test-sendmsg.html)
        //   gets a boost when the count is at least 10000
        //
        // 10000 is perhaps 5us (CPI=1, naive) and seems like a
        // reasonable cutoff, for now - but note, it is reasonable FOR
        // THIS SYSTEM ONLY, which is a big flaw.
        //
        // The better fix might well be to add some kind of spin/nanosleep
        // functionality to futexWait, see https://bugzil.la/1134973.
        // That functionality can be platform-dependent and even
        // adaptive, with JIT support.
        var i = 10000;
        do {
            // May want this to be a relaxed load, though on x86 it won't matter.
            if (Atomics.load(this._mem_int32, (self + 4) >> 2) != tag)
                return;
        } while (--i > 0);
        Atomics.add(this._mem_int32, self >> 2, 1);
        Atomics.futexWait(this._mem_int32, (self + 4) >> 2, tag, timeout);
        Atomics.sub(this._mem_int32, self >> 2, 1);
    };
    RuntimeConstructor.prototype._notify = function (self) {
        Atomics.add(this._mem_int32, (self + 4) >> 2, 1);
        // Would it be appropriate & better to wake n waiters, where n
        // is the number loaded in the load()?  I almost think so,
        // since our futexes are fair.
        if (Atomics.load(this._mem_int32, self >> 2) > 0)
            Atomics.futexWake(this._mem_int32, (self + 4) >> 2, Number.POSITIVE_INFINITY);
    };
    return RuntimeConstructor;
}());
exports.RuntimeConstructor = RuntimeConstructor;
exports.turbo = {
    Runtime: new RuntimeConstructor(),
    IsWorker: WORKER_ENV,
    init: function (MB) {
        var RAW_MEMORY = new SharedArrayBuffer(MB * 1024 * 1024);
        exports.unsafe.RAW_MEMORY = RAW_MEMORY;
        this.Runtime.init(RAW_MEMORY, 0, RAW_MEMORY.byteLength, true);
    },
    getMemoryUsage: function () {
        var top = Atomics.load(this.Runtime._mem_int32, 1);
        top -= this.Runtime.totalFreeMemory;
        var usage = top / (1024 * 1024);
        var mb = Math.round(usage);
        return (mb == 0 ? usage : mb) + "MB";
    }
};
exports.unsafe = {
    RAW_MEMORY: null
};
window["turbo"] = exports.turbo;
window["unsafe"] = exports.unsafe;
// For allocators: Do not round up nbytes, for now.  References to
// fields within structures can be to odd addresses and there's no
// particular reason that an object can't be allocated on an odd
// address.  (Later, with a header or similar info, it will be
// different.)
// Note, actual zero-initialization is not currently necessary
// since the buffer must be zero-initialized by the client code
// and this is a simple bump allocator.
function alloc_sab(nbytes, alignment) {
    var _this = this;
    if (this.totalFreeMemory > nbytes) {
        this.freeList.forEach(function (freeMem, index) {
            if (freeMem.size == nbytes) {
                _this.freeList.splice(index, 1);
                return freeMem.ptr;
            }
        });
    }
    do {
        var p = Atomics.load(this._mem_int32, 1);
        var q = (p + (alignment - 1)) & ~(alignment - 1);
        var top = q + nbytes;
        if (top >= this._mem_int32[2])
            return 0;
    } while (Atomics.compareExchange(this._mem_int32, 1, p, top) != p);
    return q;
}
function alloc_ab(nbytes, alignment) {
    var p = this._mem_int32[1];
    p = (p + (alignment - 1)) & ~(alignment - 1);
    var top = p + nbytes;
    if (top >= this._mem_int32[2])
        return 0;
    this._mem_int32[1] = top;
    return p;
}
