import { _decorator, Node } from 'cc';
import { EUiActionPreset, IUiActionParams, IUiActionUnit } from './UiActionDefine';
import { UiAction } from './UiAction';
const { ccclass } = _decorator;

/** 动作组单元，动作组的组成部分 */
@ccclass('UiActionNode')
export class UiActionNode implements IUiActionUnit {

    constructor(target: Node, actionType: EUiActionPreset, actionParams?: Partial<IUiActionParams>) {
        this.target = target;
        this.actionType = actionType;
        this.actionParams = actionParams;
    }

    /** 动作对象 */
    target: Node;
    /** 动作类型 */
    actionType: EUiActionPreset;
    /** 动作参数 */
    actionParams?: Partial<IUiActionParams>;

    /** 播放动作 */
    public play(onComplete?: () => void): void {
        UiAction.play(this.target, this.actionType, onComplete, this.actionParams);
    };

    /** 播放反向动作 */
    public playReverse(onComplete?: () => void): void {
        UiAction.playReverse(this.target, this.actionType, onComplete, this.actionParams);
    }


}


