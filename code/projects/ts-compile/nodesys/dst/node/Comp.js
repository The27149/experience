"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comp = void 0;
const FlowIn_1 = require("./FlowIn");
const FlowOut_1 = require("./FlowOut");
/**功能组件 实现具体功能  */
class Comp {
    constructor() {
        this.flowIn = null;
        this.flowOut = null;
        this.flowIn = new FlowIn_1.FlowIn();
        this.flowIn = new FlowOut_1.FlowOut();
    }
}
exports.Comp = Comp;
