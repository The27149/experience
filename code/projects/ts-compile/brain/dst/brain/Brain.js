"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brain = void 0;
const Cell_1 = require("../cell/Cell");
const BrainConfig_1 = require("./BrainConfig");
class Brain {
    constructor() {
        this.cfg = BrainConfig_1.BrainConfig;
        this.inLayer = [];
        this.midLayer = [];
        this.outLayer = [];
        // this.init();
    }
    init() {
        for (let i = 0, li = this.cfg.inCount; i < li; i++) {
            let cell = new Cell_1.Cell();
            this.inLayer.push(cell);
        }
        for (let j = 0, lj = this.cfg.midCount; j < lj; j++) {
            let cell = new Cell_1.Cell();
            this.midLayer.push(cell);
        }
        for (let k = 0, lk = this.cfg.outCount; k < lk; k++) {
            let cell = new Cell_1.Cell();
            this.outLayer.push();
        }
    }
    input() {
    }
    output() {
        console.log(`产生一条输出：`);
    }
}
exports.Brain = Brain;
