import { Node } from "cc";
import { ICallBack } from "../../../base/scripts/const/BaseInterface";

/**转盘配置参数 */
export class WheelConfig {
    /**旋转方向 -1:顺时针，1:逆时针 */
    direction: number;
    /**分区数量 */
    zoneNumber: number;
    /**旋转时间分段,固定配齐三阶段 [加速，匀速，减速] 单位：s */
    timeList: number[];
    /**最高速度（匀速阶段） 单位：欧拉角/s */
    speedMax: number;
    /**是否对齐分区中心 */
    isAlignZoneCenter: boolean;
    /**旋转前是否先角度归零 */
    isStartAtAngle0: boolean;

    constructor() {
        this.direction = 1;
        this.zoneNumber = 6;
        this.timeList = [1, 2, 3];
        this.speedMax = 720;
        this.isAlignZoneCenter = true;
        this.isStartAtAngle0 = true;
    }
}

/**tween类型的转盘配置参数 */
export class WheelTweenConfig {
    /**旋转节点 */
    turnNode: Node
    /**旋转方向 -1:顺时针，1:逆时针 */
    direction?: number;
    /**旋转时间 */
    timeList?: number[];
    /**旋转圈数 */
    circleList?: number[];
    /**分区数量 */
    zoneNumber?: number;
    /**是否对齐分区中心 */
    isAlignZoneCenter?: boolean;
    /**旋转前是否先角度归零 */
    isStartAtAngle0?: boolean;
    /**完成时回调 参数1：最终分区(逆时针从1开始)，参数2：最终角度, 参数3：当前配置 */
    callBack?: ICallBack;

    constructor() {
        this.turnNode = null;
        this.direction = 1;
        this.timeList = [1, 2, 2];
        this.circleList = [2, 8, 2];
        this.zoneNumber = 6;
        this.isAlignZoneCenter = true;
        this.isStartAtAngle0 = true;
        this.callBack = null;
    }
}

