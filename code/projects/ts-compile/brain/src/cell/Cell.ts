
/**定义单个胞体 */
export class Cell {
    private id: number = 0;
    private fire: number = 0;
    private outList: Cell[] = [];

    public getFire() {
        console.log(this.fire);
    }
}

