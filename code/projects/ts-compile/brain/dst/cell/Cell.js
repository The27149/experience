"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
/**定义单个胞体 */
class Cell {
    constructor() {
        this.id = 0;
        this.fire = 0;
        this.outList = [];
    }
    getFire() {
        console.log(this.fire);
    }
}
exports.Cell = Cell;
