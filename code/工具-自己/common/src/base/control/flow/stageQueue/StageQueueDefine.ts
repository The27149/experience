/**阶段队列接口 */
export interface IStageQueue {
    shareContext: any;
    next(context, curIndex: number): void;
}

/**阶段队列-单任务接口 */
export interface IStageQueueTask {
    init(stageQueue: IStageQueue, index: number): void;
    begin(context): void;
    done(context): void;
    hasCache(): boolean;
}


