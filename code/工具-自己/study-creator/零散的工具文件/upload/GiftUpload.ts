import { Sprite, _decorator } from 'cc';
import { ZLog } from '../../../../base/scripts/log/ZLog';
import { EventManager } from '../../../../base/scripts/event/EventManager';
import LobbyEventNames from '../../../commom/LobbyEventNames';
import TipsManager from '../../../../base/scripts/ui/TipsManager';
import { langMgr } from '../../../../base/scripts/language/LanguageManager';
import BasicProtoWsClient from '../../../protoJs/wss/Basic/BasicProtoWsClient';
import { ComUtils } from '../../../../base/scripts/utils/ComUtils';
const { ccclass } = _decorator;

@ccclass('GiftUpload')
export abstract class GiftUpload {

    constructor() {
        this.addEvent();
    }

    /**用于预览的图片sprite */
    public previewSprite: Sprite = null;

    /**上传完成后的远程地址 */
    public remoteUrl: string = ``;


    protected addEvent() {
    }

    protected removeEvent() {
    }

    /**销毁上传实例 */
    public destroy() {
        this.previewSprite = null;
        this.removeEvent();
    }

    /**重置上传模块 */
    public reset() {
        if (this.previewSprite) this.previewSprite.spriteFrame = null;
        this.remoteUrl = ``;
    }

    /**选择照片 */
    public abstract choose(): void;

    /**显示图片 */
    // protected abstract preview(): void

    private lastBuffer: ArrayBuffer = null;
    /**上传 */
    public upLoad(buffer: ArrayBuffer, name: string, type: string) {
        if (!buffer) return;
        // ZLog.logc(`上传大小(k)：`, buffer.byteLength / 1024);
        if (buffer.byteLength > 2097152) {
            TipsManager.getInstance().showToast(langMgr.getDstStr(`Share_TIP_onlysupportthepngandjpga`));
            EventManager.getInstance().raiseEvent(LobbyEventNames.c2c_common_loading_hide);
            return
        }
        this.lastBuffer = buffer;
        BasicProtoWsClient.getInstance().UploadImage2(new appProto.open_proto.client.v1.basic.UploadImageReq(), {
            successCb: (data: appProto.open_proto.client.v1.basic.UploadImageResp, header) => {
                if (header.code > 0) {
                    this.onUpLoadFail();
                    ZLog.warn("upLoad UploadImage2 fail");
                } else {
                    ZLog.logc(`UploadImage2成功`, data.accessUrl, data.uploadUrl);
                    this.remoteUrl = data.accessUrl
                    let uploadUrl = data.uploadUrl;
                    const xhr = new XMLHttpRequest();
                    xhr.open('PUT', uploadUrl, true);
                    xhr.setRequestHeader('Content-Type', 'application/octet-stream');
                    xhr.onreadystatechange = (...args) => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            this.onUpLoadSuccess();
                        }
                    };
                    xhr.onerror = this.onUpLoadFail.bind(this);
                    xhr.ontimeout = this.onUpLoadFail.bind(this);
                    xhr.send(buffer);
                }
            }, failCb: this.onUpLoadFail.bind(this), timeoutCb: this.onUpLoadFail.bind(this)
        });
    }

    /**成功回调 */
    protected onUpLoadSuccess() {
        ZLog.logc(`上传成功：`);
        EventManager.getInstance().raiseEvent(LobbyEventNames.c2c_common_loading_hide);
        TipsManager.getInstance().showToast(langMgr.getDstStr(`New_youa_ploadsuccessful`));
        this.preview();
        this.lastBuffer = null;
    }

    /**失败回调 */
    protected onUpLoadFail() {
        this.remoteUrl = ``;
        this.lastBuffer = null;
        this.previewSprite.spriteFrame = null;
        EventManager.getInstance().raiseEvent(LobbyEventNames.c2c_common_loading_hide);
    }

    protected preview() {
        if (this.lastBuffer) {
            ComUtils.base64ToTexture(ComUtils.arraryBuffer2Base64Img("png", this.lastBuffer), this.previewSprite);
            // this.previewSprite.spriteFrame = ComUtils.arraryBuffer2Base64Img();
        }
    }

    /**加载图片资源 */
    private loadImg(url: string) {
        assetManager.downloader[`_downloadArrayBuffer`](url, {}, (err, res: ArrayBuffer) => {
            if (err) {
                ZLog.error(`load picture err`, err);
            } else {
                // 使用 ImageAsset 创建 Texture2D
                const texture = new Texture2D();
                const img = new Image();
                const imageAsset = new ImageAsset(img);

                if (!sys.isNative) {
                    // 创建一个 HTML ImageElement 来加载 Blob 数据
                    const blob = new Blob([res], { type: 'image/*' }); // 确保正确的图片 MIME 类型
                    url = URL.createObjectURL(blob);
                }
                img.onload = () => {
                    // web方案： 将 ArrayBuffer 转换为 Blob 
                    texture.image = imageAsset;
                    this.imgTexture = texture;
                    this.isImgLoaded = true;
                    this.showImg(this.imgSp);
                    if (!sys.isNative) {
                        // 释放临时的 Blob URL
                        URL.revokeObjectURL(url);
                    }
                };
                img.src = url;

            }
        });
    }




    //统一用webview方案没走通，先用原生平台处理的方案
    // private webview: WebView = null;
    // public createWebview() {
    //     let webview = new WebView();
    //     this.webview = webview;
    //     webview.url = `https://www.baidu.com`;
    //     // webview.node = CoreGlobal.getRootNode();
    //     // webview.node.on(WebView.EventType.LOADED, this.onWebLoaded, this);
    //     this.onWebLoaded();
    // }

    // private onWebLoaded() {
    //     ZLog.logc(`webview加载完成`);
    //     this.webview.evaluateJS(
    //         "const input = document.createElement(`input`);" +
    //         "console.log(`input-----------`, input)" +
    //         "input.type = `file`;" +
    //         "input.accept = `image/*`;" +
    //         "input.addEventListener(`change`, (changeEvent: Event) => {" +
    //         "            ZLog.logc(`选择文件结果：`, changeEvent, changeEvent.target);" +
    //         "            const file = (changeEvent.target as HTMLInputElement).files[0];" +
    //         "            if (file) {" +
    //         "                this.file = file;" +
    //         "                let reader = new FileReader();" +
    //         "                reader.onload = (readerEvent: Event) => {" +
    //         "                    let res = (readerEvent.target as FileReader).result as ArrayBuffer;" +
    //         "                    ZLog.logc(`读取文件结果：`, res);" +
    //         "                    this.upLoad(res);" +
    //         "                }" +
    //         "                reader.readAsArrayBuffer(file);" +
    //         "            }" +
    //         "})" +
    //         "input.click();"
    //     );
    // }

}


