
/**二维向量 */
export default class Vector2 {
    /**由一个或两个点构建 */
    constructor(x: number = 0, y: number = 0, x0?: number, y0?: number) {
        if (arguments.length > 2) {
            y0 = y0 || 0;
            this.x = x - x0;
            this.y = y - y0;
        } else {
            this.x = x;
            this.y = y;
        }
    }
    public x: number = 0;
    public y: number = 0;

    /**加法
     * @param out 输出向量 
     */
    add(v: Vector2, out?: Vector2): Vector2 {
        out = out || this;
        out.x = this.x + v.x;
        out.y = this.y + v.y;
        return out;
    };

    sub(v: Vector2, out?: Vector2): Vector2 {
        out = out || this;
        out.x = this.x - v.x;
        out.y = this.y - v.y;
        return out;
    };

    multi(n: number, out?: Vector2): Vector2 {
        out = out || this;
        out.x = this.x * n;
        out.y = this.y * n;
        return out;
    };

    dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    };

    /**返回z轴坐标值 */
    cross(v: Vector2, out?: Vector2): number {
        return this.x * v.y - v.x * this.y;
    };


}
