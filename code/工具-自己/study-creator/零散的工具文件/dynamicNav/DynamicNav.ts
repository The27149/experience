import { Prefab, Toggle, ToggleContainer, _decorator, color, instantiate } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

import ToggleLabelCrl from "../../../base/scripts/common/ToggleLabelCrl";
import DynamicNavItem from './DynamicNavItem';
import { ColorType } from '../../commom/CoreConst';
/**动态生成导航栏 */
@ccclass("DynamicNavProps")
export class DynamicNavProps {
    @property({ type: ToggleContainer, tooltip: `导航栏toggle容器` })
    toggleContainer: ToggleContainer | null = null;
    @property({ type: Prefab, tooltip: `导航栏item预制` })
    itemPre: Prefab | null = null;
    /**导航栏数据 */
    dataList: any[] = [];
    /**绑定一个切换导航的回调（参数1：item下标（从0开始），参数2： 自定义的数据结构体） */
    toggleHandle?: { func, target } = null;
    /**预留其他数据或属性 */
    extraProp?: any = null;
}

@ccclass('DynamicNav')
export default class DynamicNav {
    /**需要初始化的属性 */
    private props: DynamicNavProps = null;
    /**执行回调时当前选中的item */
    public selectedItem: DynamicNavItem = null;
    /**上次选中的item */
    public lastItem: DynamicNavItem = null; s

    /**
     * 初始化导航栏
     * @param props 导航栏属性
     * @param defaultIdx 初始化时选中的下标，默认为0， -1：仅初始化但不执行切换逻辑
     * @param isAddLabelCtrl 是否添加toggleLabelCtrl 组件，默认添加
     */
    public init(props: DynamicNavProps, defaultIdx: number = 0, isAddLabelCtrl: boolean = true) {
        this.props = props;
        let { toggleContainer, itemPre, dataList } = props;
        toggleContainer.node.removeAllChildren();
        for (let i = 0; i < dataList.length; i++) {
            let data = dataList[i];
            let node = instantiate(itemPre);
            node.parent = toggleContainer.node;
            let navItem = node.getComponent(DynamicNavItem);
            navItem.init(i, data, this);
        }
        if (isAddLabelCtrl) this.addLabelCtrl();
        if (defaultIdx >= 0) this.toggleTo(defaultIdx);
    }

    /**切换到任意选项 */
    public toggleTo(idx: number) {
        let { toggleContainer } = this.props;
        toggleContainer.node.children[idx]?.getComponent(DynamicNavItem).check(true, true);
    }

    /**添加文字变色组件 */
    public addLabelCtrl() {
        let labelCtrl = this.props.toggleContainer.node.getComponent(ToggleLabelCrl) || this.props.toggleContainer.node.addComponent(ToggleLabelCrl);
        labelCtrl.checkEvent();
        let tempEventHander = new Toggle.EventHandler();
        tempEventHander.target = this.props.toggleContainer.node;
        tempEventHander.component = 'ToggleLabelCrl';
        tempEventHander.handler = "checkEvent";
        this.props.toggleContainer.checkEvents.push(tempEventHander);
    }

    /**重新设置label更新的颜色 */
    public updateToggleCtrlColor(selectColorHex: string = ColorType().rgb21.toHEX(), normalColorHex: string = ColorType().rgb12.toHEX()) {
        let labelCtrl = this.props.toggleContainer.node.getComponent(ToggleLabelCrl);
        if (!labelCtrl) return;
        labelCtrl.selectColor = color().fromHEX(selectColorHex);
        labelCtrl.normalColor = color().fromHEX(normalColorHex);
    }

    /**获取属性 */
    public getProps(): DynamicNavProps {
        return this.props;
    }
}
