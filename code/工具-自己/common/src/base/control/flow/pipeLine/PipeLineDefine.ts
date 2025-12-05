

/**管线接口 */
export interface IPipeLine {
    shareContext: any;
    next(): void;
}

/**通用管线-单任务接口 */
export interface IPipeLineTask {
    init(pipLine: IPipeLine): void;
    begin(context): void;
    done(): void;
}

/**管线状态 */
export enum EPipeLineState {
    Idle,
    Running,
    // Fail,
}

