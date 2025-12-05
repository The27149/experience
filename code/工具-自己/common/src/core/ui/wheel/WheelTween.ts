import { easing, Node, randomRangeInt, Tween, tween } from 'cc';
import { WheelTweenConfig } from './WheelConfig';



/**tween实现转盘 */
export class WheelTween {

    /**旋转节点 */
    private turnNode: Node = null;
    /**基础配置 */
    private config: WheelTweenConfig = null;

    /**目标角度 */
    private targetAngle: number = 0;
    /**目标分区 */
    private targetZone: number = 1;

    private isTurning: boolean = false;

    constructor(config: WheelTweenConfig) {
        this.config = config;
        this.turnNode = config.turnNode;
        this.isTurning = false;
    }

    /**开始旋转 指定角度:逆时针0~360 */
    public turn(targetAngle: number) {
        if (!this.config || !this.turnNode) return;
        if (this.isTurning) return;
        const { direction, isStartAtAngle0, timeList, circleList, isAlignZoneCenter, zoneNumber } = this.config;
        const unitAngle = 360 / zoneNumber;
        if (isAlignZoneCenter && (targetAngle % unitAngle) != 0) {
            targetAngle = Math.round(targetAngle / unitAngle) * unitAngle;
        }
        this.targetAngle = targetAngle;
        this.targetZone = Math.round(targetAngle / unitAngle) + 1;

        let startAngle = isStartAtAngle0 ? 0 : this.turnNode.angle % 360;
        let endAngle = circleList[2] * 360 * direction + targetAngle;
        this.isTurning = true;
        Tween.stopAllByTarget(this.turnNode);
        tween(this.turnNode)
            .set({ angle: startAngle })
            .by(timeList[0], { angle: circleList[0] * 360 * direction }, { easing: easing.circIn })
            .set({ angle: startAngle })
            .by(timeList[1], { angle: circleList[1] * 360 * direction })
            .set({ angle: startAngle })
            .to(timeList[2], { angle: endAngle }, { easing: easing.circOut })
            .set({ angle: endAngle })
            .call(() => {
                this.isTurning = false;
                this.turnOverCall();
            })
            .start();
    }

    /**开始旋转 指定分区编号 从1开始
     * @param zoneIdx 分区编号 （定义：0度 == 1号分区中心,逆时针递增）
     * @param hasRandomOff 是否需要随机偏移中心，默认false
     */
    public turnToZone(zoneIdx: number, hasRandomOff: boolean = false) {
        if (!this.config) return;
        if (this.isTurning) return;
        const { zoneNumber, isAlignZoneCenter, direction } = this.config;
        const unitAngle = 360 / zoneNumber;
        let targetAngle = unitAngle * (zoneIdx - 1);
        if (hasRandomOff) {
            if (isAlignZoneCenter) this.config.isAlignZoneCenter = !hasRandomOff;
            let offAngle = randomRangeInt(-unitAngle / 2 + 1, unitAngle / 2);
            targetAngle += offAngle;
        }
        this.turn(targetAngle);
    }

    /**完成回调 */
    private turnOverCall() {
        let cb = this.config.callBack;
        if (!cb) return;
        cb.fn.call(cb.target, this.targetZone, this.targetAngle, this.config);
    }



}



