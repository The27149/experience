import { _decorator, tween, Node } from 'cc';
import { EUiActionNodeListPlayType, EUiActionPreset, IUiActionNodeListParams, IUiActionParams, IUiActionUnit } from './UiActionDefine';
import { UiAction } from './UiAction';
const { ccclass } = _decorator;

/**定义一系列节点执行相同动作 */
@ccclass('UiActionNodeList')
export class UiActionNodeList implements IUiActionUnit {
    /** 动作列表的默认参数配置 */
    private static readonly DEFAULT_PARAMS: IUiActionNodeListParams = {
        /** 顺序模式播放延迟 */
        sequenceDelay: 0.1,
    };

    constructor(target: Node[], actionType: EUiActionPreset, playType: EUiActionNodeListPlayType = EUiActionNodeListPlayType.Sequence, actionListParams?: IUiActionNodeListParams) {
        this.target.length = 0;
        this.target.push(...target);
        this.actionType = actionType;
        this.nodeListPlayType = playType;
        this.actionListParams = { ...UiActionNodeList.DEFAULT_PARAMS, ...actionListParams };
        this.actionParams = this.actionListParams?.params;
    }

    /** 动作对象 */
    target: Node[] = [];
    /** 动作类型 */
    actionType: EUiActionPreset;
    /** 动作参数 */
    actionParams?: Partial<IUiActionParams>;

    /** 动作列表参数 */
    actionListParams?: Partial<IUiActionNodeListParams>;
    /** 动作列表播放类型 */
    nodeListPlayType: EUiActionNodeListPlayType = EUiActionNodeListPlayType.Sequence;

    /** 添加节点 */
    public addNode(...nodes: Node[]) {
        this.target.push(...nodes);
    }

    /** 移除节点 */
    public removeNode(...nodeList: Node[]) {
        for (let i = this.target.length - 1; i >= 0; i--) {
            if (nodeList.includes(this.target[i])) {
                this.target.splice(i, 1);
            }
        }
    }

    /** 获取节点列表 */
    public getList(): Node[] {
        return this.target;
    }

    /** 执行动作列表
     * @param type 动作列表播放类型
     * @param onComplete 完成时的回调函数
     * @param params 动作列表参数
     */
    public play(onComplete?: () => void): void {

        const len = this.target.length;
        if (this.nodeListPlayType == EUiActionNodeListPlayType.Parallel) {
            let completedCount = 0;
            for (const node of this.target) {
                UiAction.play(node, this.actionType, () => {
                    if (++completedCount === len && onComplete) onComplete();
                }, this.actionParams);
            }
        } else {
            const delay = this.actionListParams.sequenceDelay;
            this.target.forEach((node, index) => {
                tween(this)
                    .delay(index * delay)
                    .call(() => {
                        UiAction.play(node, this.actionType, () => {
                            if (index === len - 1 && onComplete) onComplete();
                        }, this.actionParams);
                    })
                    .start();
            });
        }
    }
}


