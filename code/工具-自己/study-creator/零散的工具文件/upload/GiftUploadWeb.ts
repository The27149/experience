import { ImageAsset, SpriteFrame, Texture2D, _decorator } from 'cc';
import { GiftUpload } from './GiftUpload';
import { ZLog } from '../../../../base/scripts/log/ZLog';
import { EventManager } from '../../../../base/scripts/event/EventManager';
import LobbyEventNames from '../../../commom/LobbyEventNames';
const { ccclass, property } = _decorator;

/**上传功能的 web实现 */
@ccclass('GiftUploadWeb')
export class GiftUploadWeb extends GiftUpload {

    /**选中的文件 */
    private file: File = null;

    /**销毁上传实例 */
    public destroy() {
        super.destroy();
        this.file = null;
    }

    /**选择照片 */
    public choose() {
        const input = document.createElement(`input`);
        input.type = `file`;
        input.accept = `image/*`;
        input.addEventListener(`change`, (changeEvent: Event) => {
            ZLog.logc(`选择文件结果：`, changeEvent, changeEvent.target);
            const file = (changeEvent.target as HTMLInputElement).files[0];
            if (file) {
                this.file = file;
                let reader = new FileReader();
                reader.onload = (readerEvent: Event) => {
                    let res = (readerEvent.target as FileReader).result as ArrayBuffer;
                    ZLog.logc(`读取文件结果：`, res);
                    this.upLoad(res, file.name, file.type);
                    EventManager.getInstance().raiseEvent(LobbyEventNames.c2c_common_loading_show);
                }
                reader.readAsArrayBuffer(file);
            }
        })
        input.click();
    }

    /**通过blob显示图片 */
    protected preview() {
        if (!this.file || !this.previewSprite) return;
        const url = URL.createObjectURL(this.file);
        const img = new Image();
        img.src = url;
        img.onload = () => {
            URL.revokeObjectURL(url);
            let texture = new Texture2D();
            texture.image = new ImageAsset(img);
            let spf = new SpriteFrame();
            spf.texture = texture;
            this.previewSprite.spriteFrame = spf;
        }
    }



}


