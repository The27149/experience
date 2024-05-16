//业务无关的接口

/**基础数据流出 */
export interface IFlowOut {

}

/**基础数据流入 */
export interface IFlowIn {
    insert(target: IFlowOut): void;
}

