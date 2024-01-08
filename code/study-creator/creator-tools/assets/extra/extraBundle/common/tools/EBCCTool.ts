

const { ccclass, property } = cc._decorator;

/**依赖cocos creator的工具 */
@ccclass
export default class EBCCTool {
    /**
     * 动态显示图片
     * @param target 
     * @param path 
     * @param call 
     */
    static dynamicSprite(target: cc.Node | cc.Sprite, path: string, call?: Function, bundleName: string = `resources`) {
        if (target instanceof cc.Node) target = target.getComponent(cc.Sprite) || target.addComponent(cc.Sprite);
        let bundle = bundleName === `resources` ? cc.resources : cc.assetManager.getBundle(bundleName);
        if (!bundle) return;
        bundle.load(path, cc.SpriteFrame, (err: Error, frame: cc.SpriteFrame) => {
            if (!err) {
                (target as cc.Sprite).spriteFrame = frame;
                call && call(frame);
            } else {
                console.log('加载图片错误', path, err);
            }
        })
    }

    /**动态加载预制 */
    static dynamicPrefab(path: string, bundleName: string = `resources`): Promise<cc.Prefab> {
        return new Promise((resolve, reject) => {
            let bundle = bundleName === `resources` ? cc.resources : cc.assetManager.getBundle(bundleName);
            if (!bundle) reject(`not find bundle:${bundleName}`);
            bundle.load(path, cc.Prefab, (err, pre: cc.Prefab) => {
                if (!err) {
                    resolve(pre);
                } else {
                    console.log(`加载预制错误`, path, err);
                    reject(err);
                }
            })
        })
    }

}
