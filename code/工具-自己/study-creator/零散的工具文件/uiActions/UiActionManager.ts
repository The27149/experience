import { _decorator, Node } from 'cc';
import { IUiActionUnit, EUiActionGroupUnitType, EUiActionPreset } from './common/UiActionDefine';
import { UiActionNode } from './common/UiActionNode';
import { UiActionNodeList } from './common/UiActionNodeList';
import { UiActionGroup } from './UiActionGroup';
const { ccclass } = _decorator;
/**ui动作管理器 */
@ccclass('UiActionManager')
export class UiActionManager {
    private static _ins: UiActionManager = null;

    public static get ins(): UiActionManager {
        if (!this._ins) {
            this._ins = new UiActionManager();
        }
        return this._ins;
    }

    private constructor() {
        // 私有构造函数，防止外部直接实例化
    }

    /**生成动作单元 */
    public createUnit(unitType: EUiActionGroupUnitType, target: Node | Node[], actionType: EUiActionPreset): IUiActionUnit {
        let unit: UiActionNode | UiActionNodeList = null;
        if (unitType === EUiActionGroupUnitType.Single) {
            let node = target as Node;
            unit = new UiActionNode(node, actionType);
        } else if (unitType === EUiActionGroupUnitType.List) {
            let nodeList = target as Node[];
            unit = new UiActionNodeList(nodeList, actionType);
        }
        return unit;
    }

    /**生成动作组 */
    private createGroup(): UiActionGroup {
        let group = new UiActionGroup();
        return group;
    }



}






