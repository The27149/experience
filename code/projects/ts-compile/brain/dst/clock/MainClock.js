"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainClock = void 0;
/**主时钟 进入主函数后自动开启计时 记录时间线*/
class MainClock {
    constructor() {
        /**计时间隔 s */
        this.pieceTime = 0.05;
        this.clock = null;
        this.queue = [];
        /**当前时间 */
        this.time = 0;
    }
    ;
    static get ins() {
        if (!this._ins)
            this._ins = new MainClock();
        this._ins.init();
        return this._ins;
    }
    init() {
        this.runByInterval();
    }
    /**计时方式：requestAnimaiton*/
    runByRequestAnimation() { }
    /**计时方式：setInterval */
    runByInterval() {
        global.clearInterval(this.clock);
        const gap = this.pieceTime * 1000;
        this.time = 0;
        this.clock = global.setInterval(this.callback.bind(this), gap);
    }
    callback() {
        this.time += this.pieceTime;
        global.wor;
    }
    getTime() {
        return this.time;
    }
    schedule(fn, delay, target) {
        // let cb: IClockCall = {
        // }
    }
}
exports.MainClock = MainClock;
MainClock._ins = null;
