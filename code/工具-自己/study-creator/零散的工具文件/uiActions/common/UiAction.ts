import { _decorator, v3, Node, Tween, easing } from 'cc';
import { EUiActionPreset } from './UiActionDefine';
import { IUiActionParams } from './UiActionDefine';
import { NodePropertyProxy } from 'db://assets/base/scripts/common/NodePropertyProxy';

const { ccclass } = _decorator;
/**定义预设的一些单体动画 */
@ccclass('UiAction')
export class UiAction {

    /** UI动作的默认参数配置 */
    private static readonly DEFAULT_PARAMS: IUiActionParams = {
        /** UI滑动偏移距离 */
        slideOffset: 250,
        /** 弹出显示时的初始缩放值 */
        popShowInitScale: 0.5,
        /** 弹出显示时的过度缩放值 */
        popShowOverScale: 1.2,
        /** 弹出隐藏时的过度缩放值 */
        popHideOverScale: 1.2,
        /** 弹出隐藏时的最终缩放值 */
        popHideEndScale: 0.5,
        /** 正常缩放值 */
        normalScale: 1,
        /** 零缩放值 */
        zeroScale: 0,
        /** 完全不透明的透明度值 */
        fullOpacity: 255,
        /** 完全透明的透明度值 */
        zeroOpacity: 0,
        /** 动画持续时间配置 */
        duration: {
            /** 弹出动画第一阶段时间 */
            popFirst: 0.2,
            /** 弹出动画第二阶段时间 */
            popSecond: 0.1,
            /** 滑动动画时间 */
            slide: 0.5,
            /** 淡入淡出动画时间 */
            fade: 0.3,
            /** 缩放动画时间 */
            scale: 0.3,
            /** 旋转动画时间 */
            rotate: 0.3
        },
        /** 动画缓动效果配置 */
        easing: {
            pop: easing.bounceOut,    // 弹出动画使用弹性缓动
            slide: easing.backOut,     // 滑动动画使用回弹缓动
            fade: easing.sineOut,      // 淡入淡出使用正弦缓动
            scale: easing.backOut,     // 缩放动画使用回弹缓动
            rotate: easing.quadOut     // 旋转动画使用二次方缓动
        },
        /** 旋转角度配置 */
        rotateAngle: {
            /** 进入时的旋转角度 */
            in: 360,
            /** 退出时的旋转角度 */
            out: -360
        }
    };

    /** 播放动画
     * @param target 目标节点
     * @param presetType 动画类型
     * @param onComplete 动画完成回调
     * @param params 动画参数
     */
    public static play(target: Node, presetType: EUiActionPreset, onComplete?: () => void, params?: Partial<IUiActionParams>) {
        const mergedParams = { ...this.DEFAULT_PARAMS, ...params };
        let proxy = NodePropertyProxy.create(target);
        Tween.stopAllByTarget(proxy);
        let tween: Tween<NodePropertyProxy> = null;
        switch (presetType) {
            case EUiActionPreset.PopShow:
                tween = this.popShow(proxy, mergedParams);
                break;
            case EUiActionPreset.PopHide:
                tween = this.popHide(proxy, mergedParams);
                break;
            case EUiActionPreset.SlideInLeft:
                tween = this.slideInLeft(proxy, mergedParams);
                break;
            case EUiActionPreset.SlideInRight:
                tween = this.slideInRight(proxy, mergedParams);
                break;
            case EUiActionPreset.SlideInTop:
                tween = this.slideInTop(proxy, mergedParams);
                break;
            case EUiActionPreset.SlideInBottom:
                tween = this.slideInBottom(proxy, mergedParams);
                break;
            case EUiActionPreset.SlideOutLeft:
                tween = this.slideOutLeft(proxy, mergedParams);
                break;
            case EUiActionPreset.SlideOutRight:
                tween = this.slideOutRight(proxy, mergedParams);
                break;
            case EUiActionPreset.SlideOutTop:
                tween = this.slideOutTop(proxy, mergedParams);
                break;
            case EUiActionPreset.SlideOutBottom:
                tween = this.slideOutBottom(proxy, mergedParams);
                break;
            case EUiActionPreset.FadeIn:
                tween = this.fadeIn(proxy, mergedParams);
                break;
            case EUiActionPreset.FadeOut:
                tween = this.fadeOut(proxy, mergedParams);
                break;
            case EUiActionPreset.ScaleIn:
                tween = this.scaleIn(proxy, mergedParams);
                break;
            case EUiActionPreset.ScaleOut:
                tween = this.scaleOut(proxy, mergedParams);
                break;
            case EUiActionPreset.RotateIn:
                tween = this.rotateIn(proxy, mergedParams);
                break;
            case EUiActionPreset.RotateOut:
                tween = this.rotateOut(proxy, mergedParams);
                break;
        }
        if (tween && onComplete) tween.call(onComplete);
        tween.start();
    }

    /** 播放反向动作 */
    public static playReverse(target: Node, presetType: EUiActionPreset, onComplete?: () => void, params?: Partial<IUiActionParams>): void {
        const reverseAction = UiAction.getReverseAction(presetType);
        UiAction.play(target, reverseAction, onComplete, params);
    }

    /** 获取反向动作 */
    private static getReverseAction(action: EUiActionPreset): EUiActionPreset {
        switch (action) {
            case EUiActionPreset.PopShow:
                return EUiActionPreset.PopHide;
            case EUiActionPreset.PopHide:
                return EUiActionPreset.PopShow;
            case EUiActionPreset.SlideInLeft:
                return EUiActionPreset.SlideOutLeft;
            case EUiActionPreset.SlideOutLeft:
                return EUiActionPreset.SlideInLeft;
            case EUiActionPreset.SlideInRight:
                return EUiActionPreset.SlideOutRight;
            case EUiActionPreset.SlideOutRight:
                return EUiActionPreset.SlideInRight;
            case EUiActionPreset.SlideInTop:
                return EUiActionPreset.SlideOutTop;
            case EUiActionPreset.SlideOutTop:
                return EUiActionPreset.SlideInTop;
            case EUiActionPreset.SlideInBottom:
                return EUiActionPreset.SlideOutBottom;
            case EUiActionPreset.SlideOutBottom:
                return EUiActionPreset.SlideInBottom;
            case EUiActionPreset.FadeIn:
                return EUiActionPreset.FadeOut;
            case EUiActionPreset.FadeOut:
                return EUiActionPreset.FadeIn;
            case EUiActionPreset.ScaleIn:
                return EUiActionPreset.ScaleOut;
            case EUiActionPreset.ScaleOut:
                return EUiActionPreset.ScaleIn;
            case EUiActionPreset.RotateIn:
                return EUiActionPreset.RotateOut;
            case EUiActionPreset.RotateOut:
                return EUiActionPreset.RotateIn;
            default:
                return EUiActionPreset.None;
        }
    }

    /**弹出显示效果 */
    private static popShow(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        proxy.scale = v3(params.popShowInitScale, params.popShowInitScale, params.popShowInitScale);
        proxy.opacity = params.zeroOpacity;
        return proxy.creatTw()
            .to(params.duration.popFirst, {
                scale: v3(params.popShowOverScale, params.popShowOverScale, params.popShowOverScale),
                opacity: params.fullOpacity
            })
            .to(params.duration.popSecond, {
                scale: v3(params.normalScale, params.normalScale, params.normalScale)
            }, { easing: params.easing.pop });
    }

    /**弹出消失效果 */
    private static popHide(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        return proxy.creatTw()
            .to(params.duration.popFirst, {
                scale: v3(params.popHideOverScale, params.popHideOverScale, params.popHideOverScale),
            })
            .to(params.duration.popSecond, {
                scale: v3(params.popHideEndScale, params.popHideEndScale, params.popHideEndScale),
                opacity: params.zeroOpacity
            }, { easing: params.easing.pop });
    }

    /**从左划入 */
    private static slideInLeft(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        const originalPos = proxy.position;
        proxy.position = v3(originalPos.x - params.slideOffset, originalPos.y, originalPos.z);
        proxy.opacity = params.zeroOpacity;
        return proxy.creatTw()
            .to(params.duration.slide, {
                position: originalPos,
                opacity: params.fullOpacity
            }, { easing: params.easing.slide });
    }

    /**从右划入 */
    private static slideInRight(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        const originalPos = proxy.position;
        proxy.position = v3(originalPos.x + params.slideOffset, originalPos.y, originalPos.z);
        proxy.opacity = params.zeroOpacity;
        return proxy.creatTw()
            .to(params.duration.slide, {
                position: originalPos,
                opacity: params.fullOpacity
            }, { easing: params.easing.slide });
    }

    /**从上划入 */
    private static slideInTop(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        const originalPos = proxy.position;
        proxy.position = v3(originalPos.x, originalPos.y + params.slideOffset, originalPos.z);
        proxy.opacity = params.zeroOpacity;
        return proxy.creatTw()
            .to(params.duration.slide, {
                position: originalPos,
                opacity: params.fullOpacity
            }, { easing: params.easing.slide });
    }

    /**从下划入 */
    private static slideInBottom(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        const originalPos = proxy.position;
        proxy.position = v3(originalPos.x, originalPos.y - params.slideOffset, originalPos.z);
        proxy.opacity = params.zeroOpacity;
        return proxy.creatTw()
            .to(params.duration.slide, {
                position: originalPos,
                opacity: params.fullOpacity
            }, { easing: params.easing.slide });
    }

    /**向左划出 */
    private static slideOutLeft(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        const originalPos = proxy.position;
        return proxy.creatTw()
            .to(params.duration.slide, {
                position: v3(originalPos.x - params.slideOffset, originalPos.y, originalPos.z),
                opacity: params.zeroOpacity
            }, { easing: params.easing.slide });
    }

    /**向右划出 */
    private static slideOutRight(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        const originalPos = proxy.position;
        return proxy.creatTw()
            .to(params.duration.slide, {
                position: v3(originalPos.x + params.slideOffset, originalPos.y, originalPos.z),
                opacity: params.zeroOpacity
            }, { easing: params.easing.slide });
    }

    /**向上划出 */
    private static slideOutTop(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        const originalPos = proxy.position;
        return proxy.creatTw()
            .to(params.duration.slide, {
                position: v3(originalPos.x, originalPos.y + params.slideOffset, originalPos.z),
                opacity: params.zeroOpacity
            }, { easing: params.easing.slide });
    }

    /**向下划出 */
    private static slideOutBottom(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        const originalPos = proxy.position;
        return proxy.creatTw()
            .to(params.duration.slide, {
                position: v3(originalPos.x, originalPos.y - params.slideOffset, originalPos.z),
                opacity: params.zeroOpacity
            }, { easing: params.easing.slide });
    }

    /**淡入效果 */
    private static fadeIn(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        proxy.opacity = params.zeroOpacity;
        return proxy.creatTw()
            .to(params.duration.fade, {
                opacity: params.fullOpacity
            }, { easing: params.easing.fade });
    }

    /**淡出效果 */
    private static fadeOut(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        return proxy.creatTw()
            .to(params.duration.fade, {
                opacity: params.zeroOpacity
            }, { easing: params.easing.fade });
    }

    /**缩放进入 */
    private static scaleIn(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        proxy.scale = v3(params.zeroScale, params.zeroScale, params.zeroScale);
        return proxy.creatTw()
            .to(params.duration.scale, {
                scale: v3(params.normalScale, params.normalScale, params.normalScale)
            }, { easing: params.easing.scale });
    }

    /**缩放退出 */
    private static scaleOut(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        return proxy.creatTw()
            .to(params.duration.scale, {
                scale: v3(params.zeroScale, params.zeroScale, params.zeroScale)
            }, { easing: params.easing.scale });
    }

    /**旋转进入 */
    private static rotateIn(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        proxy.opacity = params.zeroOpacity;
        proxy.scale = v3(params.zeroScale, params.zeroScale, params.zeroScale);
        return proxy.creatTw()
            .to(params.duration.rotate, {
                opacity: params.fullOpacity,
                scale: v3(params.normalScale, params.normalScale, params.normalScale),
                angle: params.rotateAngle.in
            }, { easing: params.easing.rotate });
    }

    /**旋转退出 */
    private static rotateOut(proxy: NodePropertyProxy, params: IUiActionParams): Tween<NodePropertyProxy> {
        return proxy.creatTw()
            .to(params.duration.rotate, {
                opacity: params.zeroOpacity,
                scale: v3(params.zeroScale, params.zeroScale, params.zeroScale),
                angle: params.rotateAngle.out
            }, { easing: params.easing.rotate });
    }
}