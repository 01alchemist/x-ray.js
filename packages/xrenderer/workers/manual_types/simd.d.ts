// Type definitions for SIMD.js v0.9.1
// Project: http://tc39.github.io/ecmascript_simd/
// Definitions by: ConquestArrow <https://github.com/ConquestArrow>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/*!
License Notices:

Some API documents by Mozilla Contributors[^1] are licensed under CC BY-SA 2.5 [^2].

[^1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SIMD
[^2]: http://creativecommons.org/licenses/by-sa/2.5/
*/

declare namespace SIMD{
	/**
	 * 128-bits divided into 4 lanes storing single precision floating point values.
	 */
	interface Float32x4{
		constructor: Float32x4Constructor;
		valueOf(): Float32x4;
		toLocaleString(): string;
		toString(): string;
		/**
		 * The initial value of the @@toStringTag property is the String value "SIMD.Float32x4".
		 */
		[Symbol.toStringTag]: string;
		[Symbol.toPrimitive](hint: "string"): string;
		[Symbol.toPrimitive](hint: "number"): number;
		[Symbol.toPrimitive](hint: "default"): Float32x4;
		[Symbol.toPrimitive](hint: string): any;
	}
	interface Float32x4Constructor{
		/**
		 * SIMD.Float32x4 constructor
		 * @param s0 A 32bit float specifying the value of the lane. 
		 * @param s1 A 32bit float specifying the value of the lane. 
		 * @param s2 A 32bit float specifying the value of the lane. 
		 * @param s3 A 32bit float specifying the value of the lane. 
		 * @return SIMD.Float32x4 object 
		 */
		(s0?: number, s1?: number, s2?: number, s3?: number): Float32x4;

		prototype: Float32x4;
		/**
		 * Returns the value of the given lane.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane An index number for which lane to extract.
		 * @return The value of the extracted lane.
		 */
		extractLane(simd: SIMD.Float32x4, lane: number): number;
		/**
		 * Returns a new instance with the lane values swizzled.
		 * @param a 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 */
		swizzle(a: SIMD.Float32x4, l1: number, l2: number, l3: number, l4: number): SIMD.Float32x4;
		/**
		 * Returns a new instance with the lane values shuffled.
		 * @param a 
		 * @param b 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 */
		shuffle(a: SIMD.Float32x4, b: SIMD.Float32x4, l1: number, l2: number, l3: number, l4: number): SIMD.Float32x4;
		/**
		 * Returns a new instance if the parameter is a valid SIMD data type and the same as Float32x4. Throws a TypeError otherwise.
		 * @param a 
		 */
		check(a: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * Creates a new SIMD.Float32x4 data type with all lanes set to a given value.
		 * @param n 
		 */
		splat(n: number): SIMD.Float32x4;
		/**
		 * Returns a new instance with the given lane value replaced.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane 
		 * @param value A new value to be used for the lane.
		 * @return A new SIMD data type with the given lane value replaced.
		 */
		replaceLane(simd: SIMD.Float32x4, lane: number, value: number): SIMD.Float32x4;
		/**
		 * Returns a new instance with the lane values being a mix of the lanes depending on the selector mask.
		 * @param selector the selector mask.
		 * @param a If the selector mask lane is `true`, pick the corresponding lane value from here.
		 * @param b If the selector mask lane is `false`, pick the corresponding lane value from here.

		 */
		select(selector: SIMD.Bool32x4, a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		equal(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		notEqual(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThan(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThanOrEqual(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThan(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThanOrEqual(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		add(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		sub(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		mul(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		div(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 */
		neg(a: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 */
		abs(a: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		min(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		max(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		minNum(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		maxNum(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		reciprocalApproximation(a: SIMD.Float32x4, b: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 */
		reciprocalSqrtApproximation(a: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * 
		 * @param a 
		 */
		sqrt(a: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * Returns a new instance with all lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Float32x4;
		/**
		 * Returns a new instance with 1 lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load1(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Float32x4;
		/**
		 * Returns a new instance with 2 lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load2(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Float32x4;
		/**
		 * Returns a new instance with 3 lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load3(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Float32x4;
		/**
		 * Store all values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * Store 1 values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store1(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * Store 2 values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store2(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * Store 3 values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store3(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Float32x4): SIMD.Float32x4;
		/**
		 * Creates a new SIMD data type with a float conversion from a Int32x4.
		 * @param value An Int32x4 SIMD type to convert from.
		 */
		fromInt32x4(value: SIMD.Int32x4): SIMD.Float32x4;
		/**
		 * Creates a new SIMD data type with a float conversion from a Uint32x4.
		 * @param value An Uint32x4 SIMD type to convert from.
		 */
		fromUint32x4(value: SIMD.Uint32x4): SIMD.Float32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int32x4.
		 * @param value A Int32x4 SIMD type to convert from (bitwise).
		 */
		fromInt32x4Bits(value: SIMD.Int32x4): SIMD.Float32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int16x8.
		 * @param value A Int16x8 SIMD type to convert from (bitwise).
		 */
		fromInt16x8Bits(value: SIMD.Int16x8): SIMD.Float32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int8x16.
		 * @param value A Int8x16 SIMD type to convert from (bitwise).
		 */
		fromInt8x16Bits(value: SIMD.Int8x16): SIMD.Float32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint32x4.
		 * @param value A Uint32x4 SIMD type to convert from (bitwise).
		 */
		fromUint32x4Bits(value: SIMD.Uint32x4): SIMD.Float32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint16x8.
		 * @param value A Uint16x8 SIMD type to convert from (bitwise).
		 */
		fromUint16x8Bits(value: SIMD.Uint16x8): SIMD.Float32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint8x16.
		 * @param value A Uint8x16 SIMD type to convert from (bitwise).
		 */
		fromUint8x16Bits(value: SIMD.Uint8x16): SIMD.Float32x4;
	}
	var Float32x4: Float32x4Constructor;
	/**
	 * 128-bits divided into 4 lanes storing 32-bit signed integer values.
	 */
	interface Int32x4{
		constructor: Int32x4Constructor;
		valueOf(): Int32x4;
		toLocaleString(): string;
		toString(): string;
		/**
		 * The initial value of the @@toStringTag property is the String value "SIMD.Int32x4".
		 */
		[Symbol.toStringTag]: string;
		[Symbol.toPrimitive](hint: "string"): string;
		[Symbol.toPrimitive](hint: "number"): number;
		[Symbol.toPrimitive](hint: "default"): Int32x4;
		[Symbol.toPrimitive](hint: string): any;
	}
	interface Int32x4Constructor{
		/**
		 * SIMD.Int32x4 constructor
		 * @param s0 A 32bit int specifying the value of the lane. 
		 * @param s1 A 32bit int specifying the value of the lane. 
		 * @param s2 A 32bit int specifying the value of the lane. 
		 * @param s3 A 32bit int specifying the value of the lane. 
		 * @return SIMD.Int32x4 object 
		 */
		(s0?: number, s1?: number, s2?: number, s3?: number): Int32x4;

		prototype: Int32x4;
		/**
		 * Returns the value of the given lane.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane An index number for which lane to extract.
		 * @return The value of the extracted lane.
		 */
		extractLane(simd: SIMD.Int32x4, lane: number): number;
		/**
		 * Returns a new instance with the lane values swizzled.
		 * @param a 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 */
		swizzle(a: SIMD.Int32x4, l1: number, l2: number, l3: number, l4: number): SIMD.Int32x4;
		/**
		 * Returns a new instance with the lane values shuffled.
		 * @param a 
		 * @param b 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 */
		shuffle(a: SIMD.Int32x4, b: SIMD.Int32x4, l1: number, l2: number, l3: number, l4: number): SIMD.Int32x4;
		/**
		 * Returns a new instance if the parameter is a valid SIMD data type and the same as Int32x4. Throws a TypeError otherwise.
		 * @param a 
		 */
		check(a: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * Creates a new SIMD.Int32x4 data type with all lanes set to a given value.
		 * @param n 
		 */
		splat(n: number): SIMD.Int32x4;
		/**
		 * Returns a new instance with the given lane value replaced.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane 
		 * @param value A new value to be used for the lane.
		 * @return A new SIMD data type with the given lane value replaced.
		 */
		replaceLane(simd: SIMD.Int32x4, lane: number, value: number): SIMD.Int32x4;
		/**
		 * Returns a new instance with the lane values being a mix of the lanes depending on the selector mask.
		 * @param selector the selector mask.
		 * @param a If the selector mask lane is `true`, pick the corresponding lane value from here.
		 * @param b If the selector mask lane is `false`, pick the corresponding lane value from here.

		 */
		select(selector: SIMD.Bool32x4, a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		equal(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		notEqual(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThan(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThanOrEqual(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThan(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThanOrEqual(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		and(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		or(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		xor(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		not(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		add(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		sub(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		mul(a: SIMD.Int32x4, b: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * 
		 * @param a 
		 */
		neg(a: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * Returns a new instance with the lane values shifted left by a given bit count (`a << bits`).
		 * @param a An instance of a SIMD type.
		 * @param bits Bit count to shift by.
		 * @return A new corresponding SIMD data type with the lane values shifted left by a given bit count (`a << bits`).
		 */
		shiftLeftByScalar(a: SIMD.Int32x4, bits: number): SIMD.Int32x4;
		/**
		 * Returns a new instance with the lane values shifted right by a given bit count (`a >> bits` or `a >>> bits`).
		 * @param a An instance of a SIMD type.
		 * @param bits Bit count to shift by.
		 * @return A new corresponding SIMD data type with the lane values shifted right by a given bit count (`a >> bits` or `a >>> bits`).
		 */
		shiftRightByScalar(a: SIMD.Int32x4, bits: number): SIMD.Int32x4;
		/**
		 * Returns a new instance with all lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Int32x4;
		/**
		 * Returns a new instance with 1 lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load1(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Int32x4;
		/**
		 * Returns a new instance with 2 lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load2(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Int32x4;
		/**
		 * Returns a new instance with 3 lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load3(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Int32x4;
		/**
		 * Store all values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * Store 1 values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store1(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * Store 2 values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store2(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * Store 3 values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store3(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Int32x4): SIMD.Int32x4;
		/**
		 * Creates a new SIMD data type with a float conversion from a Float32x4.
		 * @param value An Float32x4 SIMD type to convert from.
		 */
		fromFloat32x4(value: SIMD.Float32x4): SIMD.Int32x4;
		/**
		 * Creates a new SIMD data type with a float conversion from a Uint32x4.
		 * @param value An Uint32x4 SIMD type to convert from.
		 */
		fromUint32x4(value: SIMD.Uint32x4): SIMD.Int32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Float32x4.
		 * @param value A Float32x4 SIMD type to convert from (bitwise).
		 */
		fromFloat32x4Bits(value: SIMD.Float32x4): SIMD.Int32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int16x8.
		 * @param value A Int16x8 SIMD type to convert from (bitwise).
		 */
		fromInt16x8Bits(value: SIMD.Int16x8): SIMD.Int32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int8x16.
		 * @param value A Int8x16 SIMD type to convert from (bitwise).
		 */
		fromInt8x16Bits(value: SIMD.Int8x16): SIMD.Int32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint32x4.
		 * @param value A Uint32x4 SIMD type to convert from (bitwise).
		 */
		fromUint32x4Bits(value: SIMD.Uint32x4): SIMD.Int32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint16x8.
		 * @param value A Uint16x8 SIMD type to convert from (bitwise).
		 */
		fromUint16x8Bits(value: SIMD.Uint16x8): SIMD.Int32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint8x16.
		 * @param value A Uint8x16 SIMD type to convert from (bitwise).
		 */
		fromUint8x16Bits(value: SIMD.Uint8x16): SIMD.Int32x4;
	}
	var Int32x4: Int32x4Constructor;
	/**
	 * 128-bits divided into 8 lanes storing 16-bit signed integer values.
	 */
	interface Int16x8{
		constructor: Int16x8Constructor;
		valueOf(): Int16x8;
		toLocaleString(): string;
		toString(): string;
		/**
		 * The initial value of the @@toStringTag property is the String value "SIMD.Int16x8".
		 */
		[Symbol.toStringTag]: string;
		[Symbol.toPrimitive](hint: "string"): string;
		[Symbol.toPrimitive](hint: "number"): number;
		[Symbol.toPrimitive](hint: "default"): Int16x8;
		[Symbol.toPrimitive](hint: string): any;
	}
	interface Int16x8Constructor{
		/**
		 * SIMD.Int16x8 constructor
		 * @param s0 A 16bit int specifying the value of the lane. 
		 * @param s1 A 16bit int specifying the value of the lane. 
		 * @param s2 A 16bit int specifying the value of the lane. 
		 * @param s3 A 16bit int specifying the value of the lane. 
		 * @param s4 A 16bit int specifying the value of the lane. 
		 * @param s5 A 16bit int specifying the value of the lane. 
		 * @param s6 A 16bit int specifying the value of the lane. 
		 * @param s7 A 16bit int specifying the value of the lane. 
		 * @return SIMD.Int16x8 object 
		 */
		(s0?: number, s1?: number, s2?: number, s3?: number, s4?: number, s5?: number, s6?: number, s7?: number): Int16x8;

		prototype: Int16x8;
		/**
		 * Returns the value of the given lane.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane An index number for which lane to extract.
		 * @return The value of the extracted lane.
		 */
		extractLane(simd: SIMD.Int16x8, lane: number): number;
		/**
		 * Returns a new instance with the lane values swizzled.
		 * @param a 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 * @param l5 
		 * @param l6 
		 * @param l7 
		 * @param l8 
		 */
		swizzle(a: SIMD.Int16x8, l1: number, l2: number, l3: number, l4: number, l5: number, l6: number, l7: number, l8: number): SIMD.Int16x8;
		/**
		 * Returns a new instance with the lane values shuffled.
		 * @param a 
		 * @param b 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 * @param l5 
		 * @param l6 
		 * @param l7 
		 * @param l8 
		 */
		shuffle(a: SIMD.Int16x8, b: SIMD.Int16x8, l1: number, l2: number, l3: number, l4: number, l5: number, l6: number, l7: number, l8: number): SIMD.Int16x8;
		/**
		 * Returns a new instance if the parameter is a valid SIMD data type and the same as Int16x8. Throws a TypeError otherwise.
		 * @param a 
		 */
		check(a: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * Creates a new SIMD.Int16x8 data type with all lanes set to a given value.
		 * @param n 
		 */
		splat(n: number): SIMD.Int16x8;
		/**
		 * Returns a new instance with the given lane value replaced.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane 
		 * @param value A new value to be used for the lane.
		 * @return A new SIMD data type with the given lane value replaced.
		 */
		replaceLane(simd: SIMD.Int16x8, lane: number, value: number): SIMD.Int16x8;
		/**
		 * Returns a new instance with the lane values being a mix of the lanes depending on the selector mask.
		 * @param selector the selector mask.
		 * @param a If the selector mask lane is `true`, pick the corresponding lane value from here.
		 * @param b If the selector mask lane is `false`, pick the corresponding lane value from here.

		 */
		select(selector: SIMD.Bool16x8, a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		equal(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		notEqual(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThan(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThanOrEqual(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThan(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThanOrEqual(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		and(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		or(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		xor(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		not(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		add(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		sub(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		mul(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * 
		 * @param a 
		 */
		neg(a: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * Returns a new instance with the lane values shifted left by a given bit count (`a << bits`).
		 * @param a An instance of a SIMD type.
		 * @param bits Bit count to shift by.
		 * @return A new corresponding SIMD data type with the lane values shifted left by a given bit count (`a << bits`).
		 */
		shiftLeftByScalar(a: SIMD.Int16x8, bits: number): SIMD.Int16x8;
		/**
		 * Returns a new instance with the lane values shifted right by a given bit count (`a >> bits` or `a >>> bits`).
		 * @param a An instance of a SIMD type.
		 * @param bits Bit count to shift by.
		 * @return A new corresponding SIMD data type with the lane values shifted right by a given bit count (`a >> bits` or `a >>> bits`).
		 */
		shiftRightByScalar(a: SIMD.Int16x8, bits: number): SIMD.Int16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		addSaturate(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		subSaturate(a: SIMD.Int16x8, b: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * Returns a new instance with all lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Int16x8;
		/**
		 * Store all values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Int16x8): SIMD.Int16x8;
		/**
		 * Creates a new SIMD data type with a float conversion from a Uint16x8.
		 * @param value An Uint16x8 SIMD type to convert from.
		 */
		fromUint16x8(value: SIMD.Uint16x8): SIMD.Int16x8;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Float32x4.
		 * @param value A Float32x4 SIMD type to convert from (bitwise).
		 */
		fromFloat32x4Bits(value: SIMD.Float32x4): SIMD.Int16x8;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int32x4.
		 * @param value A Int32x4 SIMD type to convert from (bitwise).
		 */
		fromInt32x4Bits(value: SIMD.Int32x4): SIMD.Int16x8;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int8x16.
		 * @param value A Int8x16 SIMD type to convert from (bitwise).
		 */
		fromInt8x16Bits(value: SIMD.Int8x16): SIMD.Int16x8;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint32x4.
		 * @param value A Uint32x4 SIMD type to convert from (bitwise).
		 */
		fromUint32x4Bits(value: SIMD.Uint32x4): SIMD.Int16x8;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint16x8.
		 * @param value A Uint16x8 SIMD type to convert from (bitwise).
		 */
		fromUint16x8Bits(value: SIMD.Uint16x8): SIMD.Int16x8;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint8x16.
		 * @param value A Uint8x16 SIMD type to convert from (bitwise).
		 */
		fromUint8x16Bits(value: SIMD.Uint8x16): SIMD.Int16x8;
	}
	var Int16x8: Int16x8Constructor;
	/**
	 * 128-bits divided into 16 lanes storing 8-bit signed integer values.
	 */
	interface Int8x16{
		constructor: Int8x16Constructor;
		valueOf(): Int8x16;
		toLocaleString(): string;
		toString(): string;
		/**
		 * The initial value of the @@toStringTag property is the String value "SIMD.Int8x16".
		 */
		[Symbol.toStringTag]: string;
		[Symbol.toPrimitive](hint: "string"): string;
		[Symbol.toPrimitive](hint: "number"): number;
		[Symbol.toPrimitive](hint: "default"): Int8x16;
		[Symbol.toPrimitive](hint: string): any;
	}
	interface Int8x16Constructor{
		/**
		 * SIMD.Int8x16 constructor
		 * @param s0 A 8bit int specifying the value of the lane. 
		 * @param s1 A 8bit int specifying the value of the lane. 
		 * @param s2 A 8bit int specifying the value of the lane. 
		 * @param s3 A 8bit int specifying the value of the lane. 
		 * @param s4 A 8bit int specifying the value of the lane. 
		 * @param s5 A 8bit int specifying the value of the lane. 
		 * @param s6 A 8bit int specifying the value of the lane. 
		 * @param s7 A 8bit int specifying the value of the lane. 
		 * @param s8 A 8bit int specifying the value of the lane. 
		 * @param s9 A 8bit int specifying the value of the lane. 
		 * @param s10 A 8bit int specifying the value of the lane. 
		 * @param s11 A 8bit int specifying the value of the lane. 
		 * @param s12 A 8bit int specifying the value of the lane. 
		 * @param s13 A 8bit int specifying the value of the lane. 
		 * @param s14 A 8bit int specifying the value of the lane. 
		 * @param s15 A 8bit int specifying the value of the lane. 
		 * @return SIMD.Int8x16 object 
		 */
		(s0?: number, s1?: number, s2?: number, s3?: number, s4?: number, s5?: number, s6?: number, s7?: number, s8?: number, s9?: number, s10?: number, s11?: number, s12?: number, s13?: number, s14?: number, s15?: number): Int8x16;

		prototype: Int8x16;
		/**
		 * Returns the value of the given lane.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane An index number for which lane to extract.
		 * @return The value of the extracted lane.
		 */
		extractLane(simd: SIMD.Int8x16, lane: number): number;
		/**
		 * Returns a new instance with the lane values swizzled.
		 * @param a 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 * @param l5 
		 * @param l6 
		 * @param l7 
		 * @param l8 
		 * @param l9 
		 * @param l10 
		 * @param l11 
		 * @param l12 
		 * @param l13 
		 * @param l14 
		 * @param l15 
		 * @param l16 
		 */
		swizzle(a: SIMD.Int8x16, l1: number, l2: number, l3: number, l4: number, l5: number, l6: number, l7: number, l8: number, l9: number, l10: number, l11: number, l12: number, l13: number, l14: number, l15: number, l16: number): SIMD.Int8x16;
		/**
		 * Returns a new instance with the lane values shuffled.
		 * @param a 
		 * @param b 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 * @param l5 
		 * @param l6 
		 * @param l7 
		 * @param l8 
		 * @param l9 
		 * @param l10 
		 * @param l11 
		 * @param l12 
		 * @param l13 
		 * @param l14 
		 * @param l15 
		 * @param l16 
		 */
		shuffle(a: SIMD.Int8x16, b: SIMD.Int8x16, l1: number, l2: number, l3: number, l4: number, l5: number, l6: number, l7: number, l8: number, l9: number, l10: number, l11: number, l12: number, l13: number, l14: number, l15: number, l16: number): SIMD.Int8x16;
		/**
		 * Returns a new instance if the parameter is a valid SIMD data type and the same as Int8x16. Throws a TypeError otherwise.
		 * @param a 
		 */
		check(a: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * Creates a new SIMD.Int8x16 data type with all lanes set to a given value.
		 * @param n 
		 */
		splat(n: number): SIMD.Int8x16;
		/**
		 * Returns a new instance with the given lane value replaced.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane 
		 * @param value A new value to be used for the lane.
		 * @return A new SIMD data type with the given lane value replaced.
		 */
		replaceLane(simd: SIMD.Int8x16, lane: number, value: number): SIMD.Int8x16;
		/**
		 * Returns a new instance with the lane values being a mix of the lanes depending on the selector mask.
		 * @param selector the selector mask.
		 * @param a If the selector mask lane is `true`, pick the corresponding lane value from here.
		 * @param b If the selector mask lane is `false`, pick the corresponding lane value from here.

		 */
		select(selector: SIMD.Bool8x16, a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		equal(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		notEqual(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThan(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThanOrEqual(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThan(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThanOrEqual(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		and(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		or(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		xor(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		not(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		add(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		sub(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		mul(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * 
		 * @param a 
		 */
		neg(a: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * Returns a new instance with the lane values shifted left by a given bit count (`a << bits`).
		 * @param a An instance of a SIMD type.
		 * @param bits Bit count to shift by.
		 * @return A new corresponding SIMD data type with the lane values shifted left by a given bit count (`a << bits`).
		 */
		shiftLeftByScalar(a: SIMD.Int8x16, bits: number): SIMD.Int8x16;
		/**
		 * Returns a new instance with the lane values shifted right by a given bit count (`a >> bits` or `a >>> bits`).
		 * @param a An instance of a SIMD type.
		 * @param bits Bit count to shift by.
		 * @return A new corresponding SIMD data type with the lane values shifted right by a given bit count (`a >> bits` or `a >>> bits`).
		 */
		shiftRightByScalar(a: SIMD.Int8x16, bits: number): SIMD.Int8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		addSaturate(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		subSaturate(a: SIMD.Int8x16, b: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * Returns a new instance with all lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Int8x16;
		/**
		 * Store all values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Int8x16): SIMD.Int8x16;
		/**
		 * Creates a new SIMD data type with a float conversion from a Uint8x16.
		 * @param value An Uint8x16 SIMD type to convert from.
		 */
		fromUint8x16(value: SIMD.Uint8x16): SIMD.Int8x16;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Float32x4.
		 * @param value A Float32x4 SIMD type to convert from (bitwise).
		 */
		fromFloat32x4Bits(value: SIMD.Float32x4): SIMD.Int8x16;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int32x4.
		 * @param value A Int32x4 SIMD type to convert from (bitwise).
		 */
		fromInt32x4Bits(value: SIMD.Int32x4): SIMD.Int8x16;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int16x8.
		 * @param value A Int16x8 SIMD type to convert from (bitwise).
		 */
		fromInt16x8Bits(value: SIMD.Int16x8): SIMD.Int8x16;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint32x4.
		 * @param value A Uint32x4 SIMD type to convert from (bitwise).
		 */
		fromUint32x4Bits(value: SIMD.Uint32x4): SIMD.Int8x16;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint16x8.
		 * @param value A Uint16x8 SIMD type to convert from (bitwise).
		 */
		fromUint16x8Bits(value: SIMD.Uint16x8): SIMD.Int8x16;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint8x16.
		 * @param value A Uint8x16 SIMD type to convert from (bitwise).
		 */
		fromUint8x16Bits(value: SIMD.Uint8x16): SIMD.Int8x16;
	}
	var Int8x16: Int8x16Constructor;
	/**
	 * 128-bits divided into 4 lanes storing 32-bit unsigned integer values.
	 */
	interface Uint32x4{
		constructor: Uint32x4Constructor;
		valueOf(): Uint32x4;
		toLocaleString(): string;
		toString(): string;
		/**
		 * The initial value of the @@toStringTag property is the String value "SIMD.Uint32x4".
		 */
		[Symbol.toStringTag]: string;
		[Symbol.toPrimitive](hint: "string"): string;
		[Symbol.toPrimitive](hint: "number"): number;
		[Symbol.toPrimitive](hint: "default"): Uint32x4;
		[Symbol.toPrimitive](hint: string): any;
	}
	interface Uint32x4Constructor{
		/**
		 * SIMD.Uint32x4 constructor
		 * @param s0 A 32bit uint specifying the value of the lane. 
		 * @param s1 A 32bit uint specifying the value of the lane. 
		 * @param s2 A 32bit uint specifying the value of the lane. 
		 * @param s3 A 32bit uint specifying the value of the lane. 
		 * @return SIMD.Uint32x4 object 
		 */
		(s0?: number, s1?: number, s2?: number, s3?: number): Uint32x4;

		prototype: Uint32x4;
		/**
		 * Returns the value of the given lane.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane An index number for which lane to extract.
		 * @return The value of the extracted lane.
		 */
		extractLane(simd: SIMD.Uint32x4, lane: number): number;
		/**
		 * Returns a new instance with the lane values swizzled.
		 * @param a 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 */
		swizzle(a: SIMD.Uint32x4, l1: number, l2: number, l3: number, l4: number): SIMD.Uint32x4;
		/**
		 * Returns a new instance with the lane values shuffled.
		 * @param a 
		 * @param b 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 */
		shuffle(a: SIMD.Uint32x4, b: SIMD.Uint32x4, l1: number, l2: number, l3: number, l4: number): SIMD.Uint32x4;
		/**
		 * Returns a new instance if the parameter is a valid SIMD data type and the same as Uint32x4. Throws a TypeError otherwise.
		 * @param a 
		 */
		check(a: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * Creates a new SIMD.Uint32x4 data type with all lanes set to a given value.
		 * @param n 
		 */
		splat(n: number): SIMD.Uint32x4;
		/**
		 * Returns a new instance with the given lane value replaced.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane 
		 * @param value A new value to be used for the lane.
		 * @return A new SIMD data type with the given lane value replaced.
		 */
		replaceLane(simd: SIMD.Uint32x4, lane: number, value: number): SIMD.Uint32x4;
		/**
		 * Returns a new instance with the lane values being a mix of the lanes depending on the selector mask.
		 * @param selector the selector mask.
		 * @param a If the selector mask lane is `true`, pick the corresponding lane value from here.
		 * @param b If the selector mask lane is `false`, pick the corresponding lane value from here.

		 */
		select(selector: SIMD.Bool32x4, a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		equal(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		notEqual(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThan(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThanOrEqual(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThan(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThanOrEqual(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		and(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		or(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		xor(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		not(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		add(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		sub(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		mul(a: SIMD.Uint32x4, b: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * Returns a new instance with the lane values shifted left by a given bit count (`a << bits`).
		 * @param a An instance of a SIMD type.
		 * @param bits Bit count to shift by.
		 * @return A new corresponding SIMD data type with the lane values shifted left by a given bit count (`a << bits`).
		 */
		shiftLeftByScalar(a: SIMD.Uint32x4, bits: number): SIMD.Uint32x4;
		/**
		 * Returns a new instance with the lane values shifted right by a given bit count (`a >> bits` or `a >>> bits`).
		 * @param a An instance of a SIMD type.
		 * @param bits Bit count to shift by.
		 * @return A new corresponding SIMD data type with the lane values shifted right by a given bit count (`a >> bits` or `a >>> bits`).
		 */
		shiftRightByScalar(a: SIMD.Uint32x4, bits: number): SIMD.Uint32x4;
		/**
		 * Returns a new instance with all lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Uint32x4;
		/**
		 * Returns a new instance with 1 lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load1(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Uint32x4;
		/**
		 * Returns a new instance with 2 lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load2(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Uint32x4;
		/**
		 * Returns a new instance with 3 lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load3(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Uint32x4;
		/**
		 * Store all values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * Store 1 values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store1(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * Store 2 values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store2(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * Store 3 values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store3(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Uint32x4): SIMD.Uint32x4;
		/**
		 * Creates a new SIMD data type with a float conversion from a Float32x4.
		 * @param value An Float32x4 SIMD type to convert from.
		 */
		fromFloat32x4(value: SIMD.Float32x4): SIMD.Uint32x4;
		/**
		 * Creates a new SIMD data type with a float conversion from a Int32x4.
		 * @param value An Int32x4 SIMD type to convert from.
		 */
		fromInt32x4(value: SIMD.Int32x4): SIMD.Uint32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Float32x4.
		 * @param value A Float32x4 SIMD type to convert from (bitwise).
		 */
		fromFloat32x4Bits(value: SIMD.Float32x4): SIMD.Uint32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int32x4.
		 * @param value A Int32x4 SIMD type to convert from (bitwise).
		 */
		fromInt32x4Bits(value: SIMD.Int32x4): SIMD.Uint32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int16x8.
		 * @param value A Int16x8 SIMD type to convert from (bitwise).
		 */
		fromInt16x8Bits(value: SIMD.Int16x8): SIMD.Uint32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int8x16.
		 * @param value A Int8x16 SIMD type to convert from (bitwise).
		 */
		fromInt8x16Bits(value: SIMD.Int8x16): SIMD.Uint32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint16x8.
		 * @param value A Uint16x8 SIMD type to convert from (bitwise).
		 */
		fromUint16x8Bits(value: SIMD.Uint16x8): SIMD.Uint32x4;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint8x16.
		 * @param value A Uint8x16 SIMD type to convert from (bitwise).
		 */
		fromUint8x16Bits(value: SIMD.Uint8x16): SIMD.Uint32x4;
	}
	var Uint32x4: Uint32x4Constructor;
	/**
	 * 128-bits divided into 8 lanes storing 16-bit unsigned integer values.
	 */
	interface Uint16x8{
		constructor: Uint16x8Constructor;
		valueOf(): Uint16x8;
		toLocaleString(): string;
		toString(): string;
		/**
		 * The initial value of the @@toStringTag property is the String value "SIMD.Uint16x8".
		 */
		[Symbol.toStringTag]: string;
		[Symbol.toPrimitive](hint: "string"): string;
		[Symbol.toPrimitive](hint: "number"): number;
		[Symbol.toPrimitive](hint: "default"): Uint16x8;
		[Symbol.toPrimitive](hint: string): any;
	}
	interface Uint16x8Constructor{
		/**
		 * SIMD.Uint16x8 constructor
		 * @param s0 A 16bit uint specifying the value of the lane. 
		 * @param s1 A 16bit uint specifying the value of the lane. 
		 * @param s2 A 16bit uint specifying the value of the lane. 
		 * @param s3 A 16bit uint specifying the value of the lane. 
		 * @param s4 A 16bit uint specifying the value of the lane. 
		 * @param s5 A 16bit uint specifying the value of the lane. 
		 * @param s6 A 16bit uint specifying the value of the lane. 
		 * @param s7 A 16bit uint specifying the value of the lane. 
		 * @return SIMD.Uint16x8 object 
		 */
		(s0?: number, s1?: number, s2?: number, s3?: number, s4?: number, s5?: number, s6?: number, s7?: number): Uint16x8;

		prototype: Uint16x8;
		/**
		 * Returns the value of the given lane.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane An index number for which lane to extract.
		 * @return The value of the extracted lane.
		 */
		extractLane(simd: SIMD.Uint16x8, lane: number): number;
		/**
		 * Returns a new instance with the lane values swizzled.
		 * @param a 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 * @param l5 
		 * @param l6 
		 * @param l7 
		 * @param l8 
		 */
		swizzle(a: SIMD.Uint16x8, l1: number, l2: number, l3: number, l4: number, l5: number, l6: number, l7: number, l8: number): SIMD.Uint16x8;
		/**
		 * Returns a new instance with the lane values shuffled.
		 * @param a 
		 * @param b 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 * @param l5 
		 * @param l6 
		 * @param l7 
		 * @param l8 
		 */
		shuffle(a: SIMD.Uint16x8, b: SIMD.Uint16x8, l1: number, l2: number, l3: number, l4: number, l5: number, l6: number, l7: number, l8: number): SIMD.Uint16x8;
		/**
		 * Returns a new instance if the parameter is a valid SIMD data type and the same as Uint16x8. Throws a TypeError otherwise.
		 * @param a 
		 */
		check(a: SIMD.Uint16x8): SIMD.Uint16x8;
		/**
		 * Creates a new SIMD.Uint16x8 data type with all lanes set to a given value.
		 * @param n 
		 */
		splat(n: number): SIMD.Uint16x8;
		/**
		 * Returns a new instance with the given lane value replaced.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane 
		 * @param value A new value to be used for the lane.
		 * @return A new SIMD data type with the given lane value replaced.
		 */
		replaceLane(simd: SIMD.Uint16x8, lane: number, value: number): SIMD.Uint16x8;
		/**
		 * Returns a new instance with the lane values being a mix of the lanes depending on the selector mask.
		 * @param selector the selector mask.
		 * @param a If the selector mask lane is `true`, pick the corresponding lane value from here.
		 * @param b If the selector mask lane is `false`, pick the corresponding lane value from here.

		 */
		select(selector: SIMD.Bool16x8, a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Uint16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		equal(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		notEqual(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThan(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThanOrEqual(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThan(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThanOrEqual(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		and(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Uint16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		or(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Uint16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		xor(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Uint16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		not(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Uint16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		add(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Uint16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		sub(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Uint16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		mul(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Uint16x8;
		/**
		 * Returns a new instance with the lane values shifted left by a given bit count (`a << bits`).
		 * @param a An instance of a SIMD type.
		 * @param bits Bit count to shift by.
		 * @return A new corresponding SIMD data type with the lane values shifted left by a given bit count (`a << bits`).
		 */
		shiftLeftByScalar(a: SIMD.Uint16x8, bits: number): SIMD.Uint16x8;
		/**
		 * Returns a new instance with the lane values shifted right by a given bit count (`a >> bits` or `a >>> bits`).
		 * @param a An instance of a SIMD type.
		 * @param bits Bit count to shift by.
		 * @return A new corresponding SIMD data type with the lane values shifted right by a given bit count (`a >> bits` or `a >>> bits`).
		 */
		shiftRightByScalar(a: SIMD.Uint16x8, bits: number): SIMD.Uint16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		addSaturate(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Uint16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		subSaturate(a: SIMD.Uint16x8, b: SIMD.Uint16x8): SIMD.Uint16x8;
		/**
		 * Returns a new instance with all lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Uint16x8;
		/**
		 * Store all values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Uint16x8): SIMD.Uint16x8;
		/**
		 * Creates a new SIMD data type with a float conversion from a Int16x8.
		 * @param value An Int16x8 SIMD type to convert from.
		 */
		fromInt16x8(value: SIMD.Int16x8): SIMD.Uint16x8;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Float32x4.
		 * @param value A Float32x4 SIMD type to convert from (bitwise).
		 */
		fromFloat32x4Bits(value: SIMD.Float32x4): SIMD.Uint16x8;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int32x4.
		 * @param value A Int32x4 SIMD type to convert from (bitwise).
		 */
		fromInt32x4Bits(value: SIMD.Int32x4): SIMD.Uint16x8;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int16x8.
		 * @param value A Int16x8 SIMD type to convert from (bitwise).
		 */
		fromInt16x8Bits(value: SIMD.Int16x8): SIMD.Uint16x8;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int8x16.
		 * @param value A Int8x16 SIMD type to convert from (bitwise).
		 */
		fromInt8x16Bits(value: SIMD.Int8x16): SIMD.Uint16x8;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint32x4.
		 * @param value A Uint32x4 SIMD type to convert from (bitwise).
		 */
		fromUint32x4Bits(value: SIMD.Uint32x4): SIMD.Uint16x8;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint8x16.
		 * @param value A Uint8x16 SIMD type to convert from (bitwise).
		 */
		fromUint8x16Bits(value: SIMD.Uint8x16): SIMD.Uint16x8;
	}
	var Uint16x8: Uint16x8Constructor;
	/**
	 * 128-bits divided into 16 lanes storing 8-bit unsigned integer values.
	 */
	interface Uint8x16{
		constructor: Uint8x16Constructor;
		valueOf(): Uint8x16;
		toLocaleString(): string;
		toString(): string;
		/**
		 * The initial value of the @@toStringTag property is the String value "SIMD.Uint8x16".
		 */
		[Symbol.toStringTag]: string;
		[Symbol.toPrimitive](hint: "string"): string;
		[Symbol.toPrimitive](hint: "number"): number;
		[Symbol.toPrimitive](hint: "default"): Uint8x16;
		[Symbol.toPrimitive](hint: string): any;
	}
	interface Uint8x16Constructor{
		/**
		 * SIMD.Uint8x16 constructor
		 * @param s0 A 8bit uint specifying the value of the lane. 
		 * @param s1 A 8bit uint specifying the value of the lane. 
		 * @param s2 A 8bit uint specifying the value of the lane. 
		 * @param s3 A 8bit uint specifying the value of the lane. 
		 * @param s4 A 8bit uint specifying the value of the lane. 
		 * @param s5 A 8bit uint specifying the value of the lane. 
		 * @param s6 A 8bit uint specifying the value of the lane. 
		 * @param s7 A 8bit uint specifying the value of the lane. 
		 * @param s8 A 8bit uint specifying the value of the lane. 
		 * @param s9 A 8bit uint specifying the value of the lane. 
		 * @param s10 A 8bit uint specifying the value of the lane. 
		 * @param s11 A 8bit uint specifying the value of the lane. 
		 * @param s12 A 8bit uint specifying the value of the lane. 
		 * @param s13 A 8bit uint specifying the value of the lane. 
		 * @param s14 A 8bit uint specifying the value of the lane. 
		 * @param s15 A 8bit uint specifying the value of the lane. 
		 * @return SIMD.Uint8x16 object 
		 */
		(s0?: number, s1?: number, s2?: number, s3?: number, s4?: number, s5?: number, s6?: number, s7?: number, s8?: number, s9?: number, s10?: number, s11?: number, s12?: number, s13?: number, s14?: number, s15?: number): Uint8x16;

		prototype: Uint8x16;
		/**
		 * Returns the value of the given lane.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane An index number for which lane to extract.
		 * @return The value of the extracted lane.
		 */
		extractLane(simd: SIMD.Uint8x16, lane: number): number;
		/**
		 * Returns a new instance with the lane values swizzled.
		 * @param a 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 * @param l5 
		 * @param l6 
		 * @param l7 
		 * @param l8 
		 * @param l9 
		 * @param l10 
		 * @param l11 
		 * @param l12 
		 * @param l13 
		 * @param l14 
		 * @param l15 
		 * @param l16 
		 */
		swizzle(a: SIMD.Uint8x16, l1: number, l2: number, l3: number, l4: number, l5: number, l6: number, l7: number, l8: number, l9: number, l10: number, l11: number, l12: number, l13: number, l14: number, l15: number, l16: number): SIMD.Uint8x16;
		/**
		 * Returns a new instance with the lane values shuffled.
		 * @param a 
		 * @param b 
		 * @param l1 
		 * @param l2 
		 * @param l3 
		 * @param l4 
		 * @param l5 
		 * @param l6 
		 * @param l7 
		 * @param l8 
		 * @param l9 
		 * @param l10 
		 * @param l11 
		 * @param l12 
		 * @param l13 
		 * @param l14 
		 * @param l15 
		 * @param l16 
		 */
		shuffle(a: SIMD.Uint8x16, b: SIMD.Uint8x16, l1: number, l2: number, l3: number, l4: number, l5: number, l6: number, l7: number, l8: number, l9: number, l10: number, l11: number, l12: number, l13: number, l14: number, l15: number, l16: number): SIMD.Uint8x16;
		/**
		 * Returns a new instance if the parameter is a valid SIMD data type and the same as Uint8x16. Throws a TypeError otherwise.
		 * @param a 
		 */
		check(a: SIMD.Uint8x16): SIMD.Uint8x16;
		/**
		 * Creates a new SIMD.Uint8x16 data type with all lanes set to a given value.
		 * @param n 
		 */
		splat(n: number): SIMD.Uint8x16;
		/**
		 * Returns a new instance with the given lane value replaced.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane 
		 * @param value A new value to be used for the lane.
		 * @return A new SIMD data type with the given lane value replaced.
		 */
		replaceLane(simd: SIMD.Uint8x16, lane: number, value: number): SIMD.Uint8x16;
		/**
		 * Returns a new instance with the lane values being a mix of the lanes depending on the selector mask.
		 * @param selector the selector mask.
		 * @param a If the selector mask lane is `true`, pick the corresponding lane value from here.
		 * @param b If the selector mask lane is `false`, pick the corresponding lane value from here.

		 */
		select(selector: SIMD.Bool8x16, a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Uint8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		equal(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		notEqual(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThan(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		lessThanOrEqual(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThan(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		greaterThanOrEqual(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		and(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Uint8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		or(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Uint8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		xor(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Uint8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		not(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Uint8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		add(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Uint8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		sub(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Uint8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		mul(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Uint8x16;
		/**
		 * Returns a new instance with the lane values shifted left by a given bit count (`a << bits`).
		 * @param a An instance of a SIMD type.
		 * @param bits Bit count to shift by.
		 * @return A new corresponding SIMD data type with the lane values shifted left by a given bit count (`a << bits`).
		 */
		shiftLeftByScalar(a: SIMD.Uint8x16, bits: number): SIMD.Uint8x16;
		/**
		 * Returns a new instance with the lane values shifted right by a given bit count (`a >> bits` or `a >>> bits`).
		 * @param a An instance of a SIMD type.
		 * @param bits Bit count to shift by.
		 * @return A new corresponding SIMD data type with the lane values shifted right by a given bit count (`a >> bits` or `a >>> bits`).
		 */
		shiftRightByScalar(a: SIMD.Uint8x16, bits: number): SIMD.Uint8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		addSaturate(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Uint8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		subSaturate(a: SIMD.Uint8x16, b: SIMD.Uint8x16): SIMD.Uint8x16;
		/**
		 * Returns a new instance with all lane values loaded from a typed array.
		 * @param tarray An instance of a typed array. 
		 * @param index A number for the index from where to start loading in the typed array.
		 */
		load(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number): SIMD.Uint8x16;
		/**
		 * Store all values of a SIMD data type into a typed array.
		 * @param tarray An instance of a typed array.
		 * @param index A number for the index from where to start storing in the typed array.
		 * @param value An instance of a SIMD data type to store into the typed array.
		 * @return The value that has been stored (a SIMD data type).
		 */
		store(tarray: Uint8Array| Uint8ClampedArray| Int16Array| Uint16Array| Int32Array| Uint32Array| Float32Array| Float64Array, index: number, value: SIMD.Uint8x16): SIMD.Uint8x16;
		/**
		 * Creates a new SIMD data type with a float conversion from a Int8x16.
		 * @param value An Int8x16 SIMD type to convert from.
		 */
		fromInt8x16(value: SIMD.Int8x16): SIMD.Uint8x16;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Float32x4.
		 * @param value A Float32x4 SIMD type to convert from (bitwise).
		 */
		fromFloat32x4Bits(value: SIMD.Float32x4): SIMD.Uint8x16;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int32x4.
		 * @param value A Int32x4 SIMD type to convert from (bitwise).
		 */
		fromInt32x4Bits(value: SIMD.Int32x4): SIMD.Uint8x16;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int16x8.
		 * @param value A Int16x8 SIMD type to convert from (bitwise).
		 */
		fromInt16x8Bits(value: SIMD.Int16x8): SIMD.Uint8x16;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Int8x16.
		 * @param value A Int8x16 SIMD type to convert from (bitwise).
		 */
		fromInt8x16Bits(value: SIMD.Int8x16): SIMD.Uint8x16;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint32x4.
		 * @param value A Uint32x4 SIMD type to convert from (bitwise).
		 */
		fromUint32x4Bits(value: SIMD.Uint32x4): SIMD.Uint8x16;
		/**
		 * Creates a new SIMD data type with a bit-wise copy from a Uint16x8.
		 * @param value A Uint16x8 SIMD type to convert from (bitwise).
		 */
		fromUint16x8Bits(value: SIMD.Uint16x8): SIMD.Uint8x16;
	}
	var Uint8x16: Uint8x16Constructor;
	/**
	 * A SIMD type representing 4 boolean values, as an intermediate value in manipulating 128-bit vectors.
	 */
	interface Bool32x4{
		constructor: Bool32x4Constructor;
		valueOf(): Bool32x4;
		toLocaleString(): string;
		toString(): string;
		/**
		 * The initial value of the @@toStringTag property is the String value "SIMD.Bool32x4".
		 */
		[Symbol.toStringTag]: string;
		[Symbol.toPrimitive](hint: "string"): string;
		[Symbol.toPrimitive](hint: "number"): number;
		[Symbol.toPrimitive](hint: "default"): Bool32x4;
		[Symbol.toPrimitive](hint: string): any;
	}
	interface Bool32x4Constructor{
		/**
		 * SIMD.Bool32x4 constructor
		 * @param s0 A 32bit bool specifying the value of the lane. 
		 * @param s1 A 32bit bool specifying the value of the lane. 
		 * @param s2 A 32bit bool specifying the value of the lane. 
		 * @param s3 A 32bit bool specifying the value of the lane. 
		 * @return SIMD.Bool32x4 object 
		 */
		(s0?: boolean, s1?: boolean, s2?: boolean, s3?: boolean): Bool32x4;

		prototype: Bool32x4;
		/**
		 * Returns the value of the given lane.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane An index number for which lane to extract.
		 * @return The value of the extracted lane.
		 */
		extractLane(simd: SIMD.Bool32x4, lane: number): boolean;
		/**
		 * Returns a new instance if the parameter is a valid SIMD data type and the same as Bool32x4. Throws a TypeError otherwise.
		 * @param a 
		 */
		check(a: SIMD.Bool32x4): SIMD.Bool32x4;
		/**
		 * Creates a new SIMD.Bool32x4 data type with all lanes set to a given value.
		 * @param n 
		 */
		splat(n: boolean): SIMD.Bool32x4;
		/**
		 * Returns a new instance with the given lane value replaced.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane 
		 * @param value A new value to be used for the lane.
		 * @return A new SIMD data type with the given lane value replaced.
		 */
		replaceLane(simd: SIMD.Bool32x4, lane: number, value: boolean): SIMD.Bool32x4;
		/**
		 * If all lane values are `true`, return `true`.
		 * @param a 
		 */
		allTrue(a: SIMD.Bool32x4): boolean;
		/**
		 * If any lane values are `true`, return `true`.
		 * @param a 
		 */
		anyTrue(a: SIMD.Bool32x4): boolean;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		and(a: SIMD.Bool32x4, b: SIMD.Bool32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		or(a: SIMD.Bool32x4, b: SIMD.Bool32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		xor(a: SIMD.Bool32x4, b: SIMD.Bool32x4): SIMD.Bool32x4;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		not(a: SIMD.Bool32x4, b: SIMD.Bool32x4): SIMD.Bool32x4;
	}
	var Bool32x4: Bool32x4Constructor;
	/**
	 * A SIMD type representing 16 boolean values, as an intermediate value in manipulating 128-bit vectors
	 */
	interface Bool16x8{
		constructor: Bool16x8Constructor;
		valueOf(): Bool16x8;
		toLocaleString(): string;
		toString(): string;
		/**
		 * The initial value of the @@toStringTag property is the String value "SIMD.Bool16x8".
		 */
		[Symbol.toStringTag]: string;
		[Symbol.toPrimitive](hint: "string"): string;
		[Symbol.toPrimitive](hint: "number"): number;
		[Symbol.toPrimitive](hint: "default"): Bool16x8;
		[Symbol.toPrimitive](hint: string): any;
	}
	interface Bool16x8Constructor{
		/**
		 * SIMD.Bool16x8 constructor
		 * @param s0 A 16bit bool specifying the value of the lane. 
		 * @param s1 A 16bit bool specifying the value of the lane. 
		 * @param s2 A 16bit bool specifying the value of the lane. 
		 * @param s3 A 16bit bool specifying the value of the lane. 
		 * @param s4 A 16bit bool specifying the value of the lane. 
		 * @param s5 A 16bit bool specifying the value of the lane. 
		 * @param s6 A 16bit bool specifying the value of the lane. 
		 * @param s7 A 16bit bool specifying the value of the lane. 
		 * @return SIMD.Bool16x8 object 
		 */
		(s0?: boolean, s1?: boolean, s2?: boolean, s3?: boolean, s4?: boolean, s5?: boolean, s6?: boolean, s7?: boolean): Bool16x8;

		prototype: Bool16x8;
		/**
		 * Returns the value of the given lane.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane An index number for which lane to extract.
		 * @return The value of the extracted lane.
		 */
		extractLane(simd: SIMD.Bool16x8, lane: number): boolean;
		/**
		 * Returns a new instance if the parameter is a valid SIMD data type and the same as Bool16x8. Throws a TypeError otherwise.
		 * @param a 
		 */
		check(a: SIMD.Bool16x8): SIMD.Bool16x8;
		/**
		 * Creates a new SIMD.Bool16x8 data type with all lanes set to a given value.
		 * @param n 
		 */
		splat(n: boolean): SIMD.Bool16x8;
		/**
		 * Returns a new instance with the given lane value replaced.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane 
		 * @param value A new value to be used for the lane.
		 * @return A new SIMD data type with the given lane value replaced.
		 */
		replaceLane(simd: SIMD.Bool16x8, lane: number, value: boolean): SIMD.Bool16x8;
		/**
		 * If all lane values are `true`, return `true`.
		 * @param a 
		 */
		allTrue(a: SIMD.Bool16x8): boolean;
		/**
		 * If any lane values are `true`, return `true`.
		 * @param a 
		 */
		anyTrue(a: SIMD.Bool16x8): boolean;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		and(a: SIMD.Bool16x8, b: SIMD.Bool16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		or(a: SIMD.Bool16x8, b: SIMD.Bool16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		xor(a: SIMD.Bool16x8, b: SIMD.Bool16x8): SIMD.Bool16x8;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		not(a: SIMD.Bool16x8, b: SIMD.Bool16x8): SIMD.Bool16x8;
	}
	var Bool16x8: Bool16x8Constructor;
	/**
	 * A SIMD type representing 8 boolean values, as an intermediate value in manipulating 128-bit vectors
	 */
	interface Bool8x16{
		constructor: Bool8x16Constructor;
		valueOf(): Bool8x16;
		toLocaleString(): string;
		toString(): string;
		/**
		 * The initial value of the @@toStringTag property is the String value "SIMD.Bool8x16".
		 */
		[Symbol.toStringTag]: string;
		[Symbol.toPrimitive](hint: "string"): string;
		[Symbol.toPrimitive](hint: "number"): number;
		[Symbol.toPrimitive](hint: "default"): Bool8x16;
		[Symbol.toPrimitive](hint: string): any;
	}
	interface Bool8x16Constructor{
		/**
		 * SIMD.Bool8x16 constructor
		 * @param s0 A 8bit bool specifying the value of the lane. 
		 * @param s1 A 8bit bool specifying the value of the lane. 
		 * @param s2 A 8bit bool specifying the value of the lane. 
		 * @param s3 A 8bit bool specifying the value of the lane. 
		 * @param s4 A 8bit bool specifying the value of the lane. 
		 * @param s5 A 8bit bool specifying the value of the lane. 
		 * @param s6 A 8bit bool specifying the value of the lane. 
		 * @param s7 A 8bit bool specifying the value of the lane. 
		 * @param s8 A 8bit bool specifying the value of the lane. 
		 * @param s9 A 8bit bool specifying the value of the lane. 
		 * @param s10 A 8bit bool specifying the value of the lane. 
		 * @param s11 A 8bit bool specifying the value of the lane. 
		 * @param s12 A 8bit bool specifying the value of the lane. 
		 * @param s13 A 8bit bool specifying the value of the lane. 
		 * @param s14 A 8bit bool specifying the value of the lane. 
		 * @param s15 A 8bit bool specifying the value of the lane. 
		 * @return SIMD.Bool8x16 object 
		 */
		(s0?: boolean, s1?: boolean, s2?: boolean, s3?: boolean, s4?: boolean, s5?: boolean, s6?: boolean, s7?: boolean, s8?: boolean, s9?: boolean, s10?: boolean, s11?: boolean, s12?: boolean, s13?: boolean, s14?: boolean, s15?: boolean): Bool8x16;

		prototype: Bool8x16;
		/**
		 * Returns the value of the given lane.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane An index number for which lane to extract.
		 * @return The value of the extracted lane.
		 */
		extractLane(simd: SIMD.Bool8x16, lane: number): boolean;
		/**
		 * Returns a new instance if the parameter is a valid SIMD data type and the same as Bool8x16. Throws a TypeError otherwise.
		 * @param a 
		 */
		check(a: SIMD.Bool8x16): SIMD.Bool8x16;
		/**
		 * Creates a new SIMD.Bool8x16 data type with all lanes set to a given value.
		 * @param n 
		 */
		splat(n: boolean): SIMD.Bool8x16;
		/**
		 * Returns a new instance with the given lane value replaced.
		 * @param simd An instance of a corresponding SIMD type.
		 * @param lane 
		 * @param value A new value to be used for the lane.
		 * @return A new SIMD data type with the given lane value replaced.
		 */
		replaceLane(simd: SIMD.Bool8x16, lane: number, value: boolean): SIMD.Bool8x16;
		/**
		 * If all lane values are `true`, return `true`.
		 * @param a 
		 */
		allTrue(a: SIMD.Bool8x16): boolean;
		/**
		 * If any lane values are `true`, return `true`.
		 * @param a 
		 */
		anyTrue(a: SIMD.Bool8x16): boolean;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		and(a: SIMD.Bool8x16, b: SIMD.Bool8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		or(a: SIMD.Bool8x16, b: SIMD.Bool8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		xor(a: SIMD.Bool8x16, b: SIMD.Bool8x16): SIMD.Bool8x16;
		/**
		 * 
		 * @param a 
		 * @param b 
		 */
		not(a: SIMD.Bool8x16, b: SIMD.Bool8x16): SIMD.Bool8x16;
	}
	var Bool8x16: Bool8x16Constructor;
}
