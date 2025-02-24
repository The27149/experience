import { _decorator, assetManager, SpriteFrame, Texture2D } from 'cc';
import { GiftUpload } from './GiftUpload';
import { EventManager } from '../../../../base/scripts/event/EventManager';
import LobbyEventNames from '../../../commom/LobbyEventNames';
import PlatformAPI from '../../../../start/scripts/PlatformAPI';
import { ZLog } from '../../../../base/scripts/log/ZLog';
import BaseEventName from '../../../../base/scripts/common/BaseEventName';
import { NetManager } from '../../../../base/scripts/network/NetManager';
const { ccclass, property } = _decorator;

/**上传功能的 app实现 */
@ccclass('GiftUploadApp')
export class GiftUploadApp extends GiftUpload {

    /**原生传过来的数据格式 */
    private photo: { url, name, type } = null;

    private uploadSuccess: boolean = false;
    private loadImageRes: any = null;

    /**销毁上传实例 */
    public destroy() {
        super.destroy();
        this.photo = null;
        this.loadImageRes = null;
        this.uploadSuccess = false;
    }

    protected addEvent() {
        super.addEvent();
        EventManager.getInstance().addEventListener(LobbyEventNames.third2c_getPhotos_resp, this.onGetPhotoResp, this);
        EventManager.getInstance().addEventListener(BaseEventName.mess_base_websocket_connet_success, this.reconectUpload, this);
    }

    protected removeEvent() {
        super.removeEvent();
        EventManager.getInstance().removeEventListener(LobbyEventNames.third2c_getPhotos_resp, this.onGetPhotoResp, this);
        EventManager.getInstance().removeEventListener(BaseEventName.mess_base_websocket_connet_success, this.reconectUpload, this);
    }

    public choose(url?: string): void {
        PlatformAPI.getInstance().getPhotos();
        // this.createWebview();
    }

    /** 选择照片完成时*/
    private onGetPhotoResp(e: string, arg) {
        ZLog.logc(`读取照片完成后参数：`, arg);

        let photo = JSON.parse(arg)[0];
        //后缀名小写
        let url: string = photo.url;
        let arr = url.split(`.`);
        arr[arr.length - 1].toLowerCase();
        url = arr.join(`.`);
        photo.url = url;
        this.photo = photo;
        this.uploadSuccess = false;
        EventManager.getInstance().raiseEvent(LobbyEventNames.c2c_common_loading_show);
        assetManager.downloader[`_downloadArrayBuffer`](url, {}, (err, res: ArrayBuffer) => {
            if (err) {
                ZLog.logc(`_downloadArrayBuffer加载失败：`, err);
            } else {
                ZLog.logc(`_downloadArrayBuffer加载成功：`, res.constructor.name);
                this.loadImageRes = res;

                if (NetManager.getInstance().socketIsWorking()) {
                    ZLog.logc("net normal to upload image");
                    this.upLoad(res, photo.name, photo.type);
                    this.uploadSuccess = true;
                } else {
                    ZLog.logc("net error not to upload image");
                }
            }
        });
    }

    private reconectUpload() {
        if (this.loadImageRes && !this.uploadSuccess) {
            ZLog.logc("net reconnet success to upload iamge");
            this.upLoad(this.loadImageRes, this.photo.name, this.photo.type);
            this.uploadSuccess = true;
        }
    }

    /**预览 */
    protected preview(): void {
        assetManager.loadRemote(this.photo.url, (err, res) => {
            if (err) {
                ZLog.logc(`加载预览失败：`, err);
            } else {
                ZLog.logc(`加载预览成功：`, res);
                let texture = new Texture2D();
                texture.image = res;
                let spf = new SpriteFrame();
                spf.texture = texture;
                this.previewSprite.spriteFrame = spf;
            }
        })
    }

}


