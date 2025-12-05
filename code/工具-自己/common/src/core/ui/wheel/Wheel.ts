import { _decorator, Component, Node, v3 } from 'cc';
import BaseEventName from '../../../base/scripts/common/BaseEventName';
import { EventManager } from '../../../base/scripts/event/EventManager';
import { WheelConfig } from './WheelConfig';
const { ccclass, property } = _decorator;

/**自己实现转盘 */
@ccclass('Wheel')
export class Wheel extends Component {

    @property(Node)
    turnNode: Node = null;


    /**一些中间向量 */
    private tempV3: any = {
        turnNodeRotation: v3(),
    };
    /**基础配置 */
    private config: WheelConfig = null;
    /**角加速度 */
    private a: number = 0;
    /**角速度 单位：欧拉角/s*/
    private speed: number = 0;
    /**转动开关 单位：欧拉角/s/s*/
    private isTurnOn: boolean = false;
    private startTime: number = 0;
    private offTime: number = 0;
    //减速阶段的初始状态
    private stage3State: { v0: number, t: number } = { v0: 0, t: 0 }
    private aList: number[] = [];
    private targetAngle: number = 0;
    private stage: number = -1;

    private _rotation: number = 0;
    private get rotation(): number {
        return this._rotation;
    }
    private set rotation(val: number) {
        if (this._rotation === val) return;
        this._rotation = val;
        this.tempV3.turnNodeRotation.z = val;
        this.turnNode.setRotationFromEuler(this.tempV3.turnNodeRotation);
    }


    protected onLoad(): void {
        this.addEvent();

        const cfg = new WheelConfig();
        this.init(cfg);
        this.turnOn(180)
        setInterval(() => {
            this.turnOn(30)
        }, 8000);
    }

    protected onDestroy(): void {
        this.removeEvent();
    }

    private addEvent() {
        EventManager.on(BaseEventName.mess_common_app_hide_show, this.onPageShowHide, this);
    }

    private removeEvent() {
        EventManager.off(BaseEventName.mess_common_app_hide_show, this.onPageShowHide, this);
    }

    private onPageShowHide(mess, isShow: boolean) {
        if (!isShow) return;
        if (!this.isTurnOn) return;
        this.offTime = Date.now() / 1000 - this.startTime;
    }

    /**初始化转盘 */
    public init(config: WheelConfig) {
        this.config = config;
        const { speedMax, timeList, direction } = config;
        this.aList[0] = speedMax / timeList[0] * direction;
        this.aList[1] = 0;
        this.aList[2] = -speedMax / timeList[2] * direction;
    }

    /**开始旋转 */
    public turnOn(targetAngle: number) {
        if (!this.config) return;
        this.startTime = Date.now() / 1000;
        this.offTime = 0;
        this.a = 0;
        this.speed = 0;
        this.targetAngle = targetAngle;
        this.stage = 0;
        if (this.config.isStartAtAngle0) this.rotation = 0;
        this.isTurnOn = true;
    }

    protected update(dt: number): void {
        if (!this.isTurnOn) return;
        this.offTime += dt;
        let stage = this.getStage();
        this.checkStage(stage);
        if (stage == 3) {
            let t = this.stage3State.t += dt;
            this.rotation = this.stage3State.v0 * t + 0.5 * this.a * t * t;
        } else {
            this.speed += this.a * dt;
            let dAngle = this.speed * dt;
            this.rotation += dAngle;
        }
    }

    private getStage() {
        const offTime = this.offTime;
        const list = this.config.timeList;
        if (offTime < list[0]) return 1;
        else if (offTime < list[0] + list[1]) return 2;
        else if (offTime < list[0] + list[1] + list[2]) return 3;
        else return -1;
    }

    private turnOverCall() {
        this.isTurnOn = false;
        // console.log(`----结束角度：`, this.rotation);

    }

    /**阶段变化检查 */
    private checkStage(stage: number) {
        if (this.stage == stage) return;
        this.stage = stage;
        if (stage < 0) {
            this.turnOverCall();
            return;
        }
        this.a = this.aList[stage - 1];
        if (stage === 3) {
            this.stage3State.t = 0;
            let v0 = this.stage3State.v0 = this.speed;
            let t = this.config.timeList[2];
            let oldAngle = v0 * t + 0.5 * this.a * t * t;
            let standAngle = this.rotation % 360;
            if (standAngle < 0) standAngle += 360;
            let angleOff = this.targetAngle - standAngle;
            if (this.config.direction > 0) {
                if (angleOff < 0) angleOff = 360 - angleOff;
            } else {
                if (angleOff > 0) angleOff = angleOff - 360;
            }
            let angleAll = oldAngle + angleOff;
            this.a = -(v0 ** 2) / (2 * angleAll);
        }
    }

}



