import { EPipeLineState, IPipeLine, IPipeLineTask } from "./PipeLineDefine";


/**任务管线 */
export class PipeLine<TContext = any, TShareCtx = any> implements IPipeLine {

    private _stages: IPipeLineTask[] = [];
    private _state: EPipeLineState = EPipeLineState.Idle;
    private _curTask: IPipeLineTask = null;
    private _curIndex: number = 0;
    private _shareContext: TShareCtx = null;
    //运行上下文（每次运行时独立）
    private _context: TContext = null;
    //结束回调
    private _finishCallback: (context: TContext) => void = null;

    /**共享上下文 (所有实例每次运行共享)*/
    public get shareContext(): TShareCtx {
        return this._shareContext;
    }
    /**当前管线状态 */
    public get state(): EPipeLineState {
        return this._state;
    }
    /**是否空闲 */
    public get IsIdle(): boolean {
        return this._state == EPipeLineState.Idle;
    }

    constructor(shareCtx: TShareCtx = null) {
        this._shareContext = shareCtx;
        this.build();
    }

    /**添加任务 */
    public use(Task: new () => IPipeLineTask): PipeLine {
        const task = new Task();
        task.init(this);
        this._stages.push(task);
        return this;
    }

    /**设置结束回调 */
    public setFinishCallback(callback: (context: TContext) => void) {
        this._finishCallback = callback;
        return this;
    }

    /**子管线自定义固定流程 (使用use) */
    protected build() { }

    /**销毁 */
    public destroy() {
        this._state = EPipeLineState.Idle;
        this._stages.length = 0;
        this._curTask = null;
        this._shareContext = null;
        this._context = null;
        this._finishCallback = null;
    }

    /**启动 */
    public run(context: TContext): boolean {
        if (this._state != EPipeLineState.Idle) {
            console.error("pipeLine is running...");
            return false;
        }
        this._curIndex = 0;
        this._curTask = this._stages[this._curIndex];
        if (!this._curTask) return false;
        this._state = EPipeLineState.Running;
        this._context = context;
        this._curTask.begin(this._context);
        return true;
    }

    /**执行下个任务 （仅系统调用，外部禁止调用）*/
    public next() {
        this._curIndex++;
        if (this._curIndex >= this._stages.length) {
            this._finish();
            return;
        }
        const nextTask = this._stages[this._curIndex];
        // console.log(`>>>>>>>>>>>>pipeLine = ${js.getClassName(this)}, nextTask: index = ${this._curIndex},taskName = ${js.getClassName(task)}`,)
        if (nextTask) {
            this._curTask = nextTask;
            nextTask.begin(this._context);
        }
    }

    /**流程结束 */
    private _finish() {
        this.onFinish();
        if (this._finishCallback) this._finishCallback(this._context);
        this._state = EPipeLineState.Idle;
        this._curTask = null;
        this._curIndex = 0;
        this._context = null;
    }

    /**自定义结束 */
    protected onFinish() { }


}


