import { IStageQueue, IStageQueueTask } from "./StageQueueDefine";

/**阶段队列 子任务 */
export abstract class StageQueueTaskBase<TContext = any, TShareCtx = any> implements IStageQueueTask {

    private _index: number = 0;
    private _stageQueue: IStageQueue = null;
    private _shareContext: TShareCtx = null;
    private _contextCache: Set<TContext> = new Set();
    /**本阶段最高并发 */
    private readonly _maxConcurrency: number = 1;
    /**当前并发 */
    private _concurrency: number = 0;

    /**索引 */
    public get index(): number {
        return this._index;
    }

    /**共享上下文 */
    protected get shareContext(): TShareCtx {
        return this._shareContext;
    }

    init(stageQueue: IStageQueue, index: number): void {
        this._stageQueue = stageQueue;
        this._index = index;
        this._shareContext = stageQueue.shareContext;
    }

    /**开始 */
    begin(context: TContext): void {
        //无论是否立即执行，统一先缓存
        this._contextCache.add(context);
        const canProcess = this._concurrency < this._maxConcurrency;
        if (canProcess) {
            this._concurrency++;
            this.execute(context);
        }
    }

    /**执行任务 */
    protected abstract execute(context: TContext): void;

    done(context: TContext): void {
        this._contextCache.delete(context);
        this._concurrency--;
        this._stageQueue.next(context, this.index);
        if (this.hasCache()) {
            const context = this._contextCache.values().next().value;
            this.execute(context);
        }
    }

    /**当前阶段是否还有缓存数据 */
    public hasCache(): boolean {
        return this._contextCache.size > 0;
    }
}


