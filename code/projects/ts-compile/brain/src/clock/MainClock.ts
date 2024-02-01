interface IClockCall {
    fn: Function,
    time: number,
    target: any,
    repeat: number
}


/**主时钟 进入主函数后自动开启计时 记录时间线*/
export class MainClock {
    private constructor() { };
    private static _ins: MainClock = null;
    public static get ins(): MainClock {
        if (!this._ins) this._ins = new MainClock();
        this._ins.init();
        return this._ins;
    }

    /**计时间隔 s */
    private pieceTime: number = 0.05;
    private clock: NodeJS.Timeout = null;
    private queue: IClockCall[] = [];

    /**当前时间 */
    private time: number = 0;


    private init() {
        this.runByInterval();
    }

    /**计时方式：requestAnimaiton*/
    private runByRequestAnimation() { }

    /**计时方式：setInterval */
    private runByInterval() {
        global.clearInterval(this.clock);
        const gap = this.pieceTime * 1000;
        this.time = 0;
        this.clock = global.setInterval(this.callback.bind(this), gap);
    }

    private callback() {
        this.time += this.pieceTime;
        global.wor
    }

    public getTime() {
        return this.time;
    }

    public schedule(fn: Function, delay: number, target: any) {
        // let cb: IClockCall = {

        // }
    }

}