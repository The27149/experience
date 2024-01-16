
(function () {
    let Encryption = function (key) {
        this.key = createKey(key);
        this.tagIdx = 0;

        //生成密钥
        function createKey(key) {
            let str = ``;
            key = key.trim();
            for (let i = 0; i < key.length; i++) {
                str += key.charCodeAt(i).toString(2);
            }
            return str;
        }

        function to16(v) {
            let str = v.toString(16);
            if (str.length === 1) str = `0${str}`;
            return str;
        }

        let t = Encryption.prototype;
        //截取密钥的一段用于加密
        t.getTag = function () {
            let str = this.key + this.key;
            let tag = str.slice(this.tagIdx, this.tagIdx + 8);
            this.tagIdx += 8;
            if (this.tagIdx >= this.key.length) this.tagIdx -= this.key.length;
            return Number(`0b${tag}`);
        }
        //加密为unicode字符
        t.encode = function (text) {
            this.tagIdx = 0;
            let str = ``;
            for (let i = 0; i < text.length; i++) {
                let tag = this.getTag();
                let code = text.charCodeAt(i) ^ tag;
                str += String.fromCharCode(code);
            }
            return str;
        }

        //加密为16进制字符
        t.encodeHex = function (text) {
            this.tagIdx = 0;
            let str = ``;
            let buffer = new ArrayBuffer(text.length << 1);
            let arr16 = new Uint16Array(buffer);
            let arr8 = new Uint8Array(buffer);
            for (let i = 0; i < text.length; i++) {
                let tag = this.getTag();
                let code = text.charCodeAt(i) ^ tag;
                arr16[i] = code;
                str += to16(arr8[i * 2]);
                str += to16(arr8[i * 2 + 1]);
            }
            return str;
        }

        //解密unicode字符
        t.decode = function (text) {
            return this.encode(text);
        }

        //解密16进制字符
        t.decodeHex = function (text) {
            this.tagIdx = 0;
            let str = ``;
            let buffer = new ArrayBuffer(text.length >> 1);
            let arr16 = new Uint16Array(buffer);
            let arr8 = new Uint8Array(buffer);
            for (let i = 0; i < text.length; i += 2) {
                let s1 = text[i] || ``,
                    s2 = text[i + 1] || ``;
                arr8[i >> 1] = Number(`0x${s1}${s2}`);
                if (i % 4 === 2) {
                    let tag = this.getTag();
                    let code = arr16[i >> 2] ^ tag;
                    str += String.fromCharCode(code);
                }
            }
            return str;
        }

    }

    window.Encryption = Encryption;
})();

// let teststr = ``;
// let testlen = 1000;
// for (let i = 0; i < testlen; i++) {
//     teststr += `我的天阿`;
// }

// let tool = new Encryption(`中文密码长度更高`);
// console.time(`encode`)
// let mi = tool.encode(teststr);
// console.timeEnd(`encode`);
// console.time(`解密`);
// let ming = tool.decode(mi);
// console.timeEnd(`解密`);
// console.time(`打印`)
// console.log(mi);
// console.log(ming);
// console.timeEnd(`打印`)



