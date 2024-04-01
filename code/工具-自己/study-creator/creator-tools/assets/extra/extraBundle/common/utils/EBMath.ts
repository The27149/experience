/**数学方法 */
export class EBMath {
    /**欧拉角转弧度 */
    static eulerToRad(e: number): number {
        return Math.PI * e / 180;
    }

    /**弧度角转欧拉 */
    static radToEuler(r: number): number {
        return r * 180 / Math.PI;
    }

}
