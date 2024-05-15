var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let log = (...params) => {
    console.log(`%c///////////////`, `color: orange`, ...params);
};
setTimeout(() => {
    log(2, 222);
}, 1);
(() => __awaiter(this, void 0, void 0, function* () {
    let fn = function () {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                log(3);
                resolve(null);
            }, 0);
        });
    };
    yield fn();
}))();
log(4);
