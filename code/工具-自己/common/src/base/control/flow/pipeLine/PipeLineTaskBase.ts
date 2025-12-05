import { PipeLine } from "./PipeLine";
import { IPipeLine, IPipeLineTask } from "./PipeLineDefine";


/**管线任务基类 任务完成时需要手动调用done() */
export abstract class PipeLineTaskBase<TContext = any, TShareCtx = any> implements IPipeLineTask {

    private _pipeLine: IPipeLine = null;
    private _shareContext: TShareCtx = null;
    private _context: TContext = null;
    /**是否跳过当前任务 */
    protected isSkip: boolean = false;

    /**保存对管线的引用 */
    protected get pipeLine(): IPipeLine {
        return this._pipeLine;
    }
    /**共享上下文 */
    protected get shareContext(): TShareCtx {
        return this._shareContext;
    }
    /**运行上下文 */
    protected get context(): TContext {
        return this._context;
    }

    init(pipLine: PipeLine): void {
        this._pipeLine = pipLine;
        this._shareContext = pipLine.shareContext;
    }

    /**任务开始 */
    public begin(context: TContext): void {
        this.isSkip = false;
        this._context = context;
        this.preExecute();
        if (this.isSkip) {
            this.done();
        } else {
            this.execute();
        }
    };

    /**预处理任务（正式执行前 处理isSkip等） */
    protected preExecute(): void { }

    /**执行任务 */
    protected abstract execute(): void;

    /**任务完成 */
    done(): void {
        this._context = null;
        this._pipeLine.next();
    }

}


