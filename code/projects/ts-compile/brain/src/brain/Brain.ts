import { Cell } from "../cell/Cell";
import { BrainConfig } from "./BrainConfig";
import { IConnect } from "./interface";

export class Brain {
    private cfg = BrainConfig;
    private inLayer: Cell[] = [];
    private midLayer: Cell[] = [];
    private outLayer: IConnect[] = [];
    constructor() {
        // this.init();
    }

    private init() {
        for (let i = 0, li = this.cfg.inCount; i < li; i++) {
            let cell = new Cell();
            this.inLayer.push(cell);
        }
        for (let j = 0, lj = this.cfg.midCount; j < lj; j++) {
            let cell = new Cell();
            this.midLayer.push(cell);
        }
        for (let k = 0, lk = this.cfg.outCount; k < lk; k++) {
            let cell = new Cell();
            this.outLayer.push();
        }
    }

    public input() {

    }

    public output() {
        console.log(`产生一条输出：`,);
    }
}