
/**逐像素操作应用：
 * 截取自定义形状
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class main extends cc.Component {

    @property(cc.Camera)
    renderCamera: cc.Camera = null;

    @property(cc.SpriteFrame)
    source: cc.SpriteFrame = null;

    @property(cc.Sprite)
    target1: cc.Sprite = null;

    @property(cc.Sprite)
    target2: cc.Sprite = null;


    private width: number = 300;
    private height: number = 300;
    private off: number = 30;
    private r: number = 50;
    private p0: cc.Vec2 = cc.v2(300, 300);

    private renderTexture: cc.RenderTexture = null;

    protected onLoad(): void {
        this.init2();
        //无论相机直接拍摄还是drawTextureAt手动绘制，都要在下一帧获取帧缓冲数据
        setTimeout(() => {
            this.readTexture();
        }, 1000);
    }

    /**
     * 通过设置摄像机配合分组拍摄待处理纹理，然后绑定renderTexture, 
     * 缺点是：会渲染摄像机拍到的整屏图，而且生成的纹理最终是倒置的 需要手动翻转y
     */
    private init() {
        let texture = this.source.getTexture();
        const spf = new cc.SpriteFrame();
        spf.setTexture(texture);
        this.renderCamera.getComponentInChildren(cc.Sprite).spriteFrame = spf;

        let rt = new cc.RenderTexture();
        rt.initWithSize(texture.width, texture.height);
        this.renderCamera.targetTexture = rt;
        this.renderTexture = rt;
    }

    /**使用单张texture自己构造renderTexture 
     * 注意：必须要与一个相机绑定
     * 优点：只处理指定纹理的像素数据，并且纹理y方向不会倒置
    */
    private init2() {
        let texture = this.source.getTexture();
        // texture.packable = false
        let rt = new cc.RenderTexture();
        rt.initWithSize(texture.width, texture.height);
        //@ts-ignore
        rt.drawTextureAt(texture);
        this.renderTexture = rt;
        this.renderCamera.targetTexture = this.renderTexture;
    }

    /**读取 修改像素值 */
    private readTexture() {
        let data = this.renderTexture.readPixels();
        let w = this.renderTexture.width;
        let h = this.renderTexture.height;
        let rowBytes = w * 4;

        for (let x = 0; x < h; x++) {
            for (let y = 0; y < w; y++) {
                let p = cc.v2(y, x);
                let idx = x * rowBytes + y * 4;
                if (data[idx + 3] === 0) {
                    data[idx] = 255;
                    data[idx + 1] = 255;
                    data[idx + 2] = 255;
                    data[idx + 3] = 255;
                }
                if (this.isSelected(p)) {
                    data[idx] = 0;
                    data[idx + 1] = 255;
                    data[idx + 2] = 0;
                    data[idx + 3] = 255;
                }
            }
        }
        this.createTexture(data);
    }

    /**生成修改后的texture */
    private createTexture(data: Uint8Array) {
        let texture = new cc.Texture2D();
        // texture.setFlipY(true)
        texture.initWithData(data, this.renderTexture.getPixelFormat(), this.renderTexture.width, this.renderTexture.height);
        let spf = new cc.SpriteFrame();
        spf.setTexture(texture);
        this.target1.spriteFrame = spf;
    }

    /**是否为自定义选中的区域 */
    private isSelected(p: cc.Vec2): boolean {
        let condition = this.inTop(p) || this.inBottom(p) || this.inRect(p);
        return condition && !this.inLeft(p) && !this.inRight(p);
    }

    private inRect(p: cc.Vec2): boolean {
        let rect = cc.rect(this.p0.x - 0.5 * this.width, this.p0.y - 0.5 * this.height, this.width, this.height);
        return rect.contains(p);
    }

    private inTop(p: cc.Vec2): boolean {
        let circle = new Circle(this.p0.x, this.p0.y + 0.5 * this.height + this.off, this.r);
        return circle.contains(p);
    }

    private inBottom(p: cc.Vec2): boolean {
        let circle = new Circle(this.p0.x, this.p0.y - 0.5 * this.height - this.off, this.r);
        return circle.contains(p);
    }

    private inLeft(p: cc.Vec2): boolean {
        let circle = new Circle(this.p0.x - 0.5 * this.width + this.off, this.p0.y, this.r);
        return circle.contains(p);
    }

    private inRight(p: cc.Vec2): boolean {
        let circle = new Circle(this.p0.x + 0.5 * this.width - this.off, this.p0.y, this.r);
        return circle.contains(p);
    }



}

/**构造圆 */
class Circle {
    constructor(x: number, y: number, r: number) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.p0.x = x;
        this.p0.y = y;
    }

    private x: number = 0;
    private y: number = 0;
    private r: number = 0;
    private p0: cc.Vec2 = cc.v2();

    public contains(p: cc.Vec2): boolean {
        let distance = p.sub(this.p0).len();
        return distance <= this.r;
    }
}
