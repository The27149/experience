


const { ccclass, property } = cc._decorator;

/**
 * 可以全局访问的单例节点组件
 */
@ccclass
export default class EBModule extends cc.Component {
    private static map: Map<string, any> = new Map();
    /**获取模块 */
    public static get<T extends EBModule>(cls: { prototype: T }): T | null {
        let name = cc.js.getClassName(cls);
        let m = EBModule.map.get(name);
        if (!m) console.error(`要获取的模块:${name}应继承EBModule类`);
        return m
    }

    protected constructor() {
        super();
        let name = cc.js.getClassName(this);
        EBModule.map.set(name, this);
    }

    protected resetInEditor(): void {
        Editor.log(`reset!!!!!!!!!!!!!!!!!!!!!!!`);
    }


}
