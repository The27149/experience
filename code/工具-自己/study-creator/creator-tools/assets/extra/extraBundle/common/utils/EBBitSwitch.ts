
/**二进制状态开关 */
export default class EBBitSwitch<T extends number> {

    /**传入枚举长度初始化开关(枚举从0开始递增) */
    constructor(len: number) {
        this.state = 0;
        for (let i = 0; i < len; i++) {
            this.standard.push(1 << i);
        }
    }

    /**标准状态 */
    private standard: number[] = [];
    /**当前状态 */
    private state: number = 0;

    /**打开状态 */
    public open(...ids: T[]) {
        ids.forEach(id => {
            this.state |= this.standard[id];
        })
    }

    /**打开全部状态 */
    public openAll() {
        this.state = 2 ** this.standard.length - 1;
    }

    /**关闭状态 */
    public close(...ids: T[]) {
        ids.forEach(id => {
            if (this.check(id)) this.toggle(id);
        })
    }

    /**关闭全部 */
    public closeAll() {
        this.state = 0;
    }

    /**切换状态 */
    public toggle(id: T) {
        this.state ^= this.standard[id];
    }

    /**检查状态 返回true:打开；close:关闭 */
    public check(id: T): boolean {
        let res = this.state & this.standard[id];
        return !!res;
    }

    /**获取当前状态 */
    public getState(): number {
        return this.state;
    }

}
