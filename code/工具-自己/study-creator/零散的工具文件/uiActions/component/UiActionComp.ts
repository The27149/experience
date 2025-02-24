import { _decorator, Component, Enum, Node } from 'cc';
import { EUiActionGroupUnitType, EUiActionNodeListPlayType, EUiActionPreset, IUiActionUnit } from '../common/UiActionDefine';
import { UiActionNode } from '../common/UiActionNode';
import { UiActionNodeList } from '../common/UiActionNodeList';
import { UiActionGroup } from '../UiActionGroup';
const { ccclass, property } = _decorator;

/** UI动作单元组件 */
@ccclass('UiActionUnitComp')
export class UiActionUnitComp {

    @property({
        type: Enum(EUiActionGroupUnitType),
        tooltip: '动作单元类型'
    })
    unitType: EUiActionGroupUnitType = EUiActionGroupUnitType.Single;

    @property({
        type: Node,
        visible() { return this.unitType === EUiActionGroupUnitType.Single },
        tooltip: '动作节点'
    })
    targetNode: Node = null;

    @property({
        visible() { return this.unitType === EUiActionGroupUnitType.List },
        tooltip: '是否为列表容器'
    })
    isContainer: boolean = false;

    @property({
        type: Node,
        visible() { return this.unitType === EUiActionGroupUnitType.List && this.isContainer },
        tooltip: '列表容器节点'
    })
    targetContainer: Node = null;

    @property({
        type: [Node],
        visible() { return this.unitType === EUiActionGroupUnitType.List && !this.isContainer },
        tooltip: '动作节点列表'
    })
    targetList: Node[] = [];

    @property({
        type: Enum(EUiActionNodeListPlayType),
        visible() { return this.unitType === EUiActionGroupUnitType.List },
        tooltip: '动作节点列表播放方式'
    })
    playType: EUiActionNodeListPlayType = EUiActionNodeListPlayType.Sequence;

    @property({
        type: Enum(EUiActionPreset),
        tooltip: '预设动作'
    })
    actiontype: EUiActionPreset = EUiActionPreset.None;


    /**动作单元 */
    public acionUnit: IUiActionUnit = null;

    /**生成动作单元 */
    public createUnit(): IUiActionUnit {
        let unit: UiActionNode | UiActionNodeList = null;
        if (this.unitType === EUiActionGroupUnitType.Single) {
            unit = new UiActionNode(this.targetNode, this.actiontype);
        } else if (this.unitType === EUiActionGroupUnitType.List) {
            let list = this.isContainer ? this.targetContainer.children : this.targetList;
            unit = new UiActionNodeList(list, this.actiontype, this.playType);
        }
        this.acionUnit = unit;
        return unit;
    }

}

@ccclass('UiActionBatchComp')
export class UiActionBatchComp {
    @property({
        type: [UiActionUnitComp],
        tooltip: `动作单元列表`
    })
    unitCompList: UiActionUnitComp[] = [];
}

/** UI动作组组件 */
@ccclass('UiActionGroupComp')
export class UiActionGroupComp extends Component {
    @property({
        tooltip: '是否自动开始'
    })
    isAutoPlay: boolean = true;

    @property({
        tooltip: '是否异步播放'
    })
    isAsyncPlay: boolean = false;

    @property({
        type: [UiActionBatchComp],
        tooltip: '动作批次列表'
    })
    batchCompList: UiActionBatchComp[] = [];

    /** 动作组 */
    public actionGroup: UiActionGroup = null;

    private init() {
        let group = new UiActionGroup();
        for (let i = 0; i < this.batchCompList.length; i++) {
            let batchComp = this.batchCompList[i];
            let batch: IUiActionUnit[] = [];
            batchComp.unitCompList.forEach(comp => {
                let unit = comp.createUnit();
                batch.push(unit);
            })
            group.pushNewBatch(batch);
        }
        this.actionGroup = group;

    }

    protected start(): void {
        this.init();
        if (!this.actionGroup) return;
        if (!this.isAutoPlay) return;
        this.actionGroup.isAsyncPlay = this.isAsyncPlay;
        this.actionGroup.play();
    }
}


