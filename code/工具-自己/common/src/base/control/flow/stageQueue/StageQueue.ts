import { IStageQueueTask } from "./StageQueueDefine";

/**阶段队列 （一般只需要一个实例）*/
export class StageQueue<TContext = any, TShareCtx = any> {
    private _stages: IStageQueueTask[] = [];
    private _shareContext: TShareCtx = null;
    //结束回调
    private _finishCallback: (context: TContext) => void = null;

    /**共享上下文 （对所有运行全局共享）*/
    public get shareContext(): TShareCtx {
        return this._shareContext;
    }

    constructor(shareCtx: TShareCtx = null) {
        this._shareContext = shareCtx;
        this.build();
    }

    /** 插入一个阶段，默认插最后面 */
    public use(Stage: new () => IStageQueueTask, index?: number): this {
        index = index ?? this._stages.length;
        const stage = new Stage();
        stage.init(this, index);
        this._stages[index] = stage;
        return this;
    }

    /**设置结束回调 */
    public setFinishCallback(callback: (context: TContext) => void) {
        this._finishCallback = callback;
        return this;
    }

    /**子类自定义固定流程 （使用add）*/
    protected build() { }

    /**销毁 */
    public destroy() {
        this._stages.length = 0;
        this._shareContext = null;
        this._finishCallback = null;
    }

    /**开始处理数据 */
    public run(context: TContext): void {
        if (this._stages.length == 0) return;
        const task = this._stages[0];
        task.begin(context);
    }

    /**执行下个任务 */
    public next(context: TContext, curIndex: number) {
        const nextIndex = curIndex + 1;
        if (nextIndex >= this._stages.length) {
            this._finish(context);
            const isAllFinish = !this._stages.some(stage => stage.hasCache());
            if (isAllFinish) this.onAllFinish();
        } else {
            const nextTask = this._stages[nextIndex];
            nextTask.begin(context);
        }
    }

    /**单条数据流程结束 */
    private _finish(context: TContext) {
        this.onFinish(context);
        if (this._finishCallback) this._finishCallback(context);
    }

    /**自定义结束 */
    protected onFinish(context: TContext) { }

    /**全部数据处理结束 */
    protected onAllFinish() { }

}


