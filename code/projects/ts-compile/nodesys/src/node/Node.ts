/**逻辑节点 组织，管理各个功能组件 本身不实现具体功能 */
export class Node {
    private name: string = ``;
    private val: number = 0;
    private flowIn: any[] = [];
    private flowOut: any[] = [];
    private comps: any[] = [];

    constructor() {

    }
}
