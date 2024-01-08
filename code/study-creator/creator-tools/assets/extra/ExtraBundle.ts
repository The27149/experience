

const { ccclass, property } = cc._decorator;


/**额外的工具包 bundle优先级为10 */
@ccclass
export default class ExtraBundle {
    private constructor() { }
    private static _ins: ExtraBundle = null;
    public static get ins(): ExtraBundle {
        if (!this._ins) this._ins = new ExtraBundle();
        return this._ins;
    }

    private bundleName: string = `extraBundle`;
    private bundle: cc.AssetManager.Bundle = null;

    /**工具包初始化 */
    public init() {
        return new Promise<void>((resolve, reject) => {
            let isInited = !!cc.assetManager.getBundle(this.bundleName);
            if (isInited) {
                resolve();
                return;
            };
            cc.assetManager.loadBundle(this.bundleName, (err, bundle) => {
                if (!err) {
                    this.bundle = bundle;
                    resolve();
                }
            })
        })
    }

    /**移除工具包 */
    public destroy() {
        if (this.bundle) {
            this.bundle.releaseAll();
            cc.assetManager.removeBundle(this.bundle);
            this.bundle = null;
        }
        ExtraBundle._ins = null;
    }

}
