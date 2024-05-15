"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
/**逻辑节点 组织，管理各个功能组件 本身不实现具体功能 */
class Node {
    constructor() {
        this.name = ``;
        this.val = 0;
        this.flowIn = [];
        this.flowOut = [];
        this.comps = [];
    }
}
exports.Node = Node;
