import { _decorator, Component, Enum, size, Sprite, UITransform } from 'cc';
const { ccclass, property } = _decorator;
enum LimitMode {
    /**无限制 */
    none = 0,//无限制
    widthLimit = 1 << 0,//等比限制宽
    heightLimit = 1 << 1, //等比限制高
    sizeLimitAuto = 1 << 2,//同时限制宽和高（等比）
    sizeLimitForce = 1 << 3,//同时限制宽和高（可能变形）
}

/**限制sprite的尺寸*/
@ccclass('SpriteSizeLimit')
export class SpriteSizeLimit extends Component {
    @property({ type: Enum(LimitMode), tooltip: `sprite节点尺寸限制模式` })
    Mode: LimitMode = LimitMode.none;

    @property({ visible() { return Boolean(this.Mode & 0b1101) }, tooltip: `最大宽度` })
    widthMax: number = 0;

    @property({ visible() { return Boolean(this.Mode & 0b1110) }, tooltip: `最大高度` })
    heightMax: number = 0;

    protected onLoad(): void {
        this.node.on(Sprite.EventType.SPRITE_FRAME_CHANGED, this.onChangeFrame, this);
        let sp = this.node.getComponent(Sprite) || this.node.addComponent(Sprite);
        sp.sizeMode = Sprite.SizeMode.CUSTOM;
        this.adaptSize();
    }

    private onChangeFrame() {
        this.adaptSize();
    }

    public adaptSize() {
        let spf = this.node.getComponent(Sprite)?.spriteFrame;
        if (!spf) return;
        let wFrame = spf.width, hFrame = spf.height, rFrame = spf.width / spf.height;
        let rw = this.widthMax / wFrame, rh = this.heightMax / hFrame;
        let width = wFrame, height = hFrame;
        switch (this.Mode) {
            case LimitMode.widthLimit:
                if (wFrame > this.widthMax) {
                    width = this.widthMax;
                    height = hFrame * rw;
                }
                break;
            case LimitMode.heightLimit:
                if (hFrame > this.heightMax) {
                    height = this.heightMax;
                    width = wFrame * rh;
                }
                break;
            case LimitMode.sizeLimitAuto:
                let rMax = this.widthMax / this.heightMax;
                if (rFrame > rMax) {
                    if (wFrame > this.widthMax) {
                        width = this.widthMax;
                        height = hFrame * rw;
                    }
                } else {
                    if (hFrame > this.heightMax) {
                        height = this.heightMax;
                        width = wFrame * rh;
                    }
                }
                break;
            case LimitMode.sizeLimitForce:
                if (wFrame > this.widthMax) width = this.widthMax;
                if (hFrame > this.heightMax) height = this.heightMax;
                break;
            default:
                width = wFrame;
                height = hFrame;
                break;
        }
        this.node.getComponent(UITransform).setContentSize(size(width, height));
    }
}


