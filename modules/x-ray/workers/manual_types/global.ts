declare function fetch(url:string, opt:any);
declare function postMessage(arg:any);
interface Atomics{
    futexWait(ta, index:number, value:number, timeOut:number);
    futexWake(ta, index:number, count:number);
    store(ta, index:number, value:number, timeOut:number);
    load(ta, index:number, value:number, timeOut:number);
}
interface SharedArrayBuffer {
    /**
     * Read-only. The length of the ArrayBuffer (in bytes).
     */
    byteLength: number;

    /**
     * Returns a section of an ArrayBuffer.
     */
    slice(begin:number, end?:number): ArrayBuffer;
}
interface SharedArrayBufferConstructor extends ArrayBufferConstructor{

}
declare var SharedArrayBuffer:SharedArrayBufferConstructor;


/* Some ES6 features */

// Type definitions for es6-promise
// Project: https://github.com/jakearchibald/ES6-Promise
// Definitions by: François de Campredon <https://github.com/fdecampredon/>, vvakame <https://github.com/vvakame>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface Thenable<T> {
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
    catch<U>(onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
}

declare class Promise<T> implements Thenable<T> {
    /**
     * If you call resolve in the body of the callback passed to the constructor,
     * your promise is fulfilled with result object passed to resolve.
     * If you call reject your promise is rejected with the object passed to reject.
     * For consistency and debugging (eg stack traces), obj should be an instanceof Error.
     * Any errors thrown in the constructor callback will be implicitly passed to reject().
     */
    constructor(callback: (resolve : (value?: T | Thenable<T>) => void, reject: (error?: any) => void) => void);

    /**
     * onFulfilled is called when/if "promise" resolves. onRejected is called when/if "promise" rejects.
     * Both are optional, if either/both are omitted the next onFulfilled/onRejected in the chain is called.
     * Both callbacks have a single parameter , the fulfillment value or rejection reason.
     * "then" returns a new promise equivalent to the value you return from onFulfilled/onRejected after being passed through Promise.resolve.
     * If an error is thrown in the callback, the returned promise rejects with that error.
     *
     * @param onFulfilled called when/if "promise" resolves
     * @param onRejected called when/if "promise" rejects
     */
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Promise<U>;

    /**
     * Sugar for promise.then(undefined, onRejected)
     *
     * @param onRejected called when/if "promise" rejects
     */
    catch<U>(onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
}

declare module Promise {
    /**
     * Make a new promise from the thenable.
     * A thenable is promise-like in as far as it has a "then" method.
     */
    function resolve<T>(value?: T | Thenable<T>): Promise<T>;

    /**
     * Make a promise that rejects to obj. For consistency and debugging (eg stack traces), obj should be an instanceof Error
     */
    function reject(error: any): Promise<any>;
    function reject<T>(error: T): Promise<T>;

    /**
     * Make a promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
     * the array passed to all can be a mixture of promise-like objects and other objects.
     * The fulfillment value is an array (in order) of fulfillment values. The rejection value is the first rejection value.
     */
    function all<T>(promises: (T | Thenable<T>)[]): Promise<T[]>;

    /**
     * Make a Promise that fulfills when any item fulfills, and rejects if any item rejects.
     */
    function race<T>(promises: (T | Thenable<T>)[]): Promise<T>;
}

declare module 'es6-promise' {
    var foo: typeof Promise; // Temp variable to reference Promise in local context
    module rsvp {
        export var Promise: typeof foo;
    }
    export = rsvp;
}

interface Symbol {
    /** Returns a string representation of an object. */
    toString(): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): Object;

    [Symbol.toStringTag]: string;
}
interface SymbolConstructor {
    /**
     * A reference to the prototype.
     */
    prototype: Symbol;

    /**
     * Returns a new unique Symbol value.
     * @param  description Description of the new Symbol object.
     */
    (description?: string|number): symbol;

    /**
     * Returns a Symbol object from the global symbol registry matching the given key if found.
     * Otherwise, returns a new symbol with this key.
     * @param key key to search for.
     */
    for(key: string): symbol;

    /**
     * Returns a key from the global symbol registry matching the given Symbol if found.
     * Otherwise, returns a undefined.
     * @param sym Symbol to find the key for.
     */
    keyFor(sym: symbol): string;

    // Well-known Symbols

    /**
     * A method that determines if a constructor object recognizes an object as one of the
     * constructor’s instances. Called by the semantics of the instanceof operator.
     */
    hasInstance: symbol;

    /**
     * A Boolean value that if true indicates that an object should flatten to its array elements
     * by Array.prototype.concat.
     */
    isConcatSpreadable: symbol;

    /**
     * A method that returns the default iterator for an object. Called by the semantics of the
     * for-of statement.
     */
    iterator: symbol;

    /**
     * A regular expression method that matches the regular expression against a string. Called
     * by the String.prototype.match method.
     */
    match: symbol;

    /**
     * A regular expression method that replaces matched substrings of a string. Called by the
     * String.prototype.replace method.
     */
    replace: symbol;

    /**
     * A regular expression method that returns the index within a string that matches the
     * regular expression. Called by the String.prototype.search method.
     */
    search: symbol;

    /**
     * A function valued property that is the constructor function that is used to create
     * derived objects.
     */
    species: symbol;

    /**
     * A regular expression method that splits a string at the indices that match the regular
     * expression. Called by the String.prototype.split method.
     */
    split: symbol;

    /**
     * A method that converts an object to a corresponding primitive value.
     * Called by the ToPrimitive abstract operation.
     */
    toPrimitive: symbol;

    /**
     * A String value that is used in the creation of the default string description of an object.
     * Called by the built-in method Object.prototype.toString.
     */
    toStringTag: symbol;

    /**
     * An Object whose own property names are property names that are excluded from the 'with'
     * environment bindings of the associated objects.
     */
    unscopables: symbol;
}
declare var Symbol: SymbolConstructor;
interface IteratorResult<T> {
    done: boolean;
    value?: T;
}

interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}

interface Iterable<T> {
    [Symbol.iterator](): Iterator<T>;
}

interface IterableIterator<T> extends Iterator<T> {
    [Symbol.iterator](): IterableIterator<T>;
}
interface Map<K, V> {
    clear(): void;
    delete(key: K): boolean;
    entries(): IterableIterator<[K, V]>;
    forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    set(key: K, value?: V): Map<K, V>;
    size: number;
    values(): IterableIterator<V>;
    [Symbol.iterator]():IterableIterator<[K,V]>;
    [Symbol.toStringTag]: string;
}

interface MapConstructor {
    new (): Map<any, any>;
    new <K, V>(): Map<K, V>;
    new <K, V>(iterable: Iterable<[K, V]>): Map<K, V>;
    prototype: Map<any, any>;
}
declare var Map: MapConstructor;