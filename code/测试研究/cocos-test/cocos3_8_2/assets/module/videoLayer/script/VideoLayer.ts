import { _decorator, Camera, Component, instantiate, RenderTexture, sp, Sprite, SpriteFrame, Texture2D, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('videoLayer')
export class VideoLayer extends Component {

    @property(Camera)
    videoCamera: Camera = null;

    @property(Sprite)
    targetSprite: Sprite = null;


    private renderTexture: RenderTexture = null;


    start() {
        let renderTexture = new RenderTexture();
        const design = view.getDesignResolutionSize();
        const param = {
            width: design.width,
            height: design.height
        }
        renderTexture.initialize(param);
        this.videoCamera.targetTexture = renderTexture;
        this.renderTexture = renderTexture;


        let spf = new SpriteFrame();
        spf.texture = this.renderTexture;
        this.targetSprite.spriteFrame = spf;


    }



}


