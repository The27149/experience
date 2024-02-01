
import { EBModule, EBNodeFactory } from "../../common/Export";
import ShopData from "./ShopData";
import ShopItem from "./ShopItem";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Shop extends EBModule {
    @property(cc.Prefab)
    shopItemPre: cc.Prefab = null;

    @property(cc.Node)
    shopItemContainer: cc.Node = null;

    @property(cc.Button)
    closeBtn: cc.Button = null;

    private itemFactory: EBNodeFactory = null;
    private shopItemList: ShopItem[] = [];

    protected onLoad(): void {
        this.itemFactory = new EBNodeFactory(this.shopItemPre);
        this.closeBtn.node.on(`click`, this.onClose, this);
    }

    private onClose() {
        // Module.get(SoundMgr).playBtnSound();
        this.node.destroy();
    }

    protected onEnable(): void {
        this.initUI();
    }

    private initUI() {
        this.shopItemContainer.removeAllChildren();
        let list = ShopData.ins.getAllProps();
        for (let i = 0; i < list.length; i++) {
            let data = list[i];
            let node = this.itemFactory.get();
            node.parent = this.shopItemContainer;
            let item = node.getComponent(ShopItem);
            item.init(data, this);
            this.shopItemList.push(item);
        }

    }

    public unPickAll() {
        for (let item of this.shopItemList) {
            item.setPick(false);
        }
    }

}
