import { FlowIn } from "./FlowIn";
import { FlowOut } from "./FlowOut";

/**功能组件 实现具体功能  */
export class Comp {
    private flowIn: FlowIn = null;
    private flowOut: FlowOut = null;
    constructor() {
        this.flowIn = new FlowIn();
        this.flowIn = new FlowOut();
    }
}