import { _decorator, Component, Label, Toggle } from 'cc';
const { ccclass, property, requireComponent } = _decorator;

import SoundManager from '../../../base/scripts/sound/SoundManager';
import DynamicNav from "./DynamicNav";
@ccclass('DynamicNavItem')
export default class DynamicNavItem extends Component {


    @property(Toggle)
    toggle: Toggle | null = null;

    @property(Label)
    normalNameLabel: Label = null;

    /**总导航 */
    protected nav: DynamicNav = null;

    /**自定义的导航列表数据 */
    public data: any = null;

    /**下标 从0开始 */
    protected idx: number = 0;

    /**初始化 */
    public init(idx: number, data: any, nav: DynamicNav) {
        this.idx = idx;
        this.data = data;
        this.nav = nav;
        this.toggle.isChecked = false;
        this.initView(data);
        this.toggle.node.on(`click`, this._onToggle, this);
    }

    /**手动选中
     * @param isExeLogic 是否执行切换逻辑
     * @param isForce 是否强制执行逻辑
     */
    public check(isExeLogic: boolean = true, isForce: boolean = false) {
        this.toggle.isChecked = true;
        this.nav.selectedItem = this;
        if (isExeLogic) this.onToggle(false, isForce);
        this.nav.lastItem = this;
    }

    /**点击事件，切换导航 */
    protected _onToggle(t: Toggle) {
        SoundManager.getInstance().playBtnSound();
        this.nav.selectedItem = this;
        this.onToggle(true);
        this.nav.lastItem = this;
    }

    /**切换导航 （可扩写添加自己的切换业务） */
    protected onToggle(isUIClicked: boolean, isForce: boolean = false): void {
        if ((this.nav.lastItem === this) && !isForce) return;
        let handle = this.nav.getProps().toggleHandle;
        handle && handle.func.call(handle.target, this.idx, this.data, isUIClicked);
    };

    /**初始化item ui (子类可以自定义渲染)*/
    protected initView(data: any): void {
        //一般情况下直接显示名称就完了
        if (data?.name && this.normalNameLabel) {
            this.normalNameLabel.string = data.name;
        }
    };
}


