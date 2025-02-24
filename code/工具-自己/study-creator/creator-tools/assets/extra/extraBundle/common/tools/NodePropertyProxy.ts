import { Node, Tween, UIOpacity, UITransform, Vec3, _decorator, tween } from 'cc';
const { ccclass, property } = _decorator;

/**节点属性代理， 方便tween动画统一修改节点属性, 具体属性根据需要添加 */
@ccclass('NodePropertyProxy')
export class NodePropertyProxy {
    /** 创建节点属性代理
     * @param node 目标节点
     * @returns 节点属性代理
     */
    public static create(node: Node): NodePropertyProxy {
        const key = `nodePropertyProxy`;
        let proxy = node[key];
        if (!proxy) {
            proxy = new NodePropertyProxy(node);
            node.attr({ [key]: proxy });
        }
        return proxy;
    }

    constructor(node: Node) {
        this.node = node;
        let uiComp = node.getComponent(UITransform) || node.addComponent(UITransform);
        let oldOnDestroy = uiComp.onDestroy.bind(uiComp);
        uiComp.onDestroy = () => {
            this.twList.forEach(tw => tw.stop());
            this.twList.length = 0;
            oldOnDestroy && oldOnDestroy();
        }
    }
    private node: Node = null;
    private twList: Tween[] = [];

    /**生成绑定的缓动 
     * 建议通过本方法创建tw，保证当节点销毁时，tw会自动移除*/
    public creatTw(): Tween {
        let tw = tween(this);
        this.twList.push(tw);
        return tw;
    }


    //宽
    public get width(): number {
        if (!this.node.isValid) return;
        return this.node.getComponent(UITransform).width;
    }
    public set width(val: number) {
        if (!this.node.isValid) return;
        this.node.getComponent(UITransform).width = val;
    }

    //高
    public get height(): number {
        if (!this.node.isValid) return;
        return this.node.getComponent(UITransform).height;
    }
    public set height(val: number) {
        if (!this.node.isValid) return;
        this.node.getComponent(UITransform).height = val;
    }

    //位置
    public get position(): Vec3 {
        if (!this.node.isValid) return;
        return this.node.position.clone();//防止取到原来的只读向量，后续想修改却改不了
    }
    public set position(pos: Vec3) {
        if (!this.node.isValid) return;
        this.node.position = pos;
    }

    //缩放
    public get scale(): Vec3 {
        if (!this.node.isValid) return;
        return this.node.scale;
    }
    public set scale(scale: Vec3) {
        if (!this.node.isValid) return;
        this.node.scale = scale;
    }

    //透明度
    public get opacity(): number {
        if (!this.node.isValid) return;
        let comp = this.node.getComponent(UIOpacity);
        if (!comp) return 0;
        return comp.opacity;
    }
    public set opacity(val: number) {
        if (!this.node.isValid) return;
        let comp = this.node.getComponent(UIOpacity);
        if (!comp) return;
        comp.opacity = val;
    }

}



