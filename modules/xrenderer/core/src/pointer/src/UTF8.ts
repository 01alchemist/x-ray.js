export class UTF8{


    static instance:UTF8;

    static encode(str:string):Uint8Array{
        if(str){
            if(!UTF8.instance){
                UTF8.instance = new UTF8();
            }
            return UTF8.instance.encode(str);
        }
        return null;
    }

    static decode(data:Uint8Array):string{
        if(data){
            if(!UTF8.instance){
                UTF8.instance = new UTF8();
            }
            return UTF8.instance.decode(data);
        }
        return null;
    }

    constructor(){

    }

    /**
     * UTF-8 Encoding/Decoding
     */
    public encode(str:string):Uint8Array {
        var pos:number = 0;
        var codePoints = this.stringToCodePoints(str);
        var outputBytes = [];

        while (codePoints.length > pos) {
            var code_point:number = codePoints[pos++];

            if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                this.encoderError(code_point);
            }
            else if (this.inRange(code_point, 0x0000, 0x007f)) {
                outputBytes.push(code_point);
            } else {
                var count, offset;
                if (this.inRange(code_point, 0x0080, 0x07FF)) {
                    count = 1;
                    offset = 0xC0;
                } else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                    count = 2;
                    offset = 0xE0;
                } else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                    count = 3;
                    offset = 0xF0;
                }

                outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);

                while (count > 0) {
                    var temp = this.div(code_point, Math.pow(64, count - 1));
                    outputBytes.push(0x80 + (temp % 64));
                    count -= 1;
                }
            }
        }
        return new Uint8Array(outputBytes);
    }

    public decode(data:Uint8Array):string {
        var fatal:boolean = false;
        var pos:number = 0;
        var result:string = "";
        var code_point:number;
        var utf8_code_point = 0;
        var utf8_bytes_needed = 0;
        var utf8_bytes_seen = 0;
        var utf8_lower_boundary = 0;

        while (data.length > pos) {

            var _byte = data[pos++];

            if (_byte === this.EOF_byte) {
                if (utf8_bytes_needed !== 0) {
                    code_point = this.decoderError(fatal);
                } else {
                    code_point = this.EOF_code_point;
                }
            } else {

                if (utf8_bytes_needed === 0) {
                    if (this.inRange(_byte, 0x00, 0x7F)) {
                        code_point = _byte;
                    } else {
                        if (this.inRange(_byte, 0xC2, 0xDF)) {
                            utf8_bytes_needed = 1;
                            utf8_lower_boundary = 0x80;
                            utf8_code_point = _byte - 0xC0;
                        } else if (this.inRange(_byte, 0xE0, 0xEF)) {
                            utf8_bytes_needed = 2;
                            utf8_lower_boundary = 0x800;
                            utf8_code_point = _byte - 0xE0;
                        } else if (this.inRange(_byte, 0xF0, 0xF4)) {
                            utf8_bytes_needed = 3;
                            utf8_lower_boundary = 0x10000;
                            utf8_code_point = _byte - 0xF0;
                        } else {
                            this.decoderError(fatal);
                        }
                        utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                        code_point = null;
                    }
                } else if (!this.inRange(_byte, 0x80, 0xBF)) {
                    utf8_code_point = 0;
                    utf8_bytes_needed = 0;
                    utf8_bytes_seen = 0;
                    utf8_lower_boundary = 0;
                    pos--;
                    code_point = this.decoderError(fatal, _byte);
                } else {

                    utf8_bytes_seen += 1;
                    utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);

                    if (utf8_bytes_seen !== utf8_bytes_needed) {
                        code_point = null;
                    } else {

                        var cp = utf8_code_point;
                        var lower_boundary = utf8_lower_boundary;
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                            code_point = cp;
                        } else {
                            code_point = this.decoderError(fatal, _byte);
                        }
                    }

                }
            }
            //Decode string
            if (code_point !== null && code_point !== this.EOF_code_point) {
                if (code_point <= 0xFFFF) {
                    if (code_point > 0)result += String.fromCharCode(code_point);
                } else {
                    code_point -= 0x10000;
                    result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                    result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                }
            }
        }
        return result;
    }

    private encoderError(code_point) {
        throw 'EncodingError! The code point ' + code_point + ' could not be encoded.';
    }

    private decoderError(fatal, opt_code_point?):number {
        if (fatal) {
            throw 'DecodingError';
        }
        return opt_code_point || 0xFFFD;
    }

    private EOF_byte:number = -1;
    private EOF_code_point:number = -1;

    private inRange(a, min, max) {
        return min <= a && a <= max;
    }

    private div(n, d) {
        return Math.floor(n / d);
    }

    private stringToCodePoints(string) {
        /** @type {Array.<number>} */
        var cps = [];
        // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
        var i = 0, n = string.length;
        while (i < string.length) {
            var c = string.charCodeAt(i);
            if (!this.inRange(c, 0xD800, 0xDFFF)) {
                cps.push(c);
            } else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                cps.push(0xFFFD);
            } else { // (inRange(c, 0xD800, 0xDBFF))
                if (i === n - 1) {
                    cps.push(0xFFFD);
                } else {
                    var d = string.charCodeAt(i + 1);
                    if (this.inRange(d, 0xDC00, 0xDFFF)) {
                        var a = c & 0x3FF;
                        var b = d & 0x3FF;
                        i += 1;
                        cps.push(0x10000 + (a << 10) + b);
                    } else {
                        cps.push(0xFFFD);
                    }
                }
            }
            i += 1;
        }
        return cps;
    }

}