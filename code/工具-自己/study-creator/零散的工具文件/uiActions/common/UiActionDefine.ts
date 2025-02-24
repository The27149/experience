

import { Node } from "cc";


////////////////////////////////////////单体动作 开始 ////////////////////////////////////////
/**预设单个动作模式 */
export enum EUiActionPreset {
    /**无动作 */
    None,
    /**弹出显示 - 缩放+透明度 */
    PopShow,
    /**弹出消失 - 缩放+透明度 */
    PopHide,
    /**从左划入 */
    SlideInLeft,
    /**从右划入 */
    SlideInRight,
    /**从上划入 */
    SlideInTop,
    /**从下划入 */
    SlideInBottom,
    /**向左划出 */
    SlideOutLeft,
    /**向右划出 */
    SlideOutRight,
    /**向上划出 */
    SlideOutTop,
    /**向下划出 */
    SlideOutBottom,
    /**淡入 */
    FadeIn,
    /**淡出 */
    FadeOut,
    /**缩放进入 */
    ScaleIn,
    /**缩放退出 */
    ScaleOut,
    /**旋转进入 */
    RotateIn,
    /**旋转退出 */
    RotateOut,
}

/**UI动作参数接口 (主要是一些固定参数)*/
export interface IUiActionParams {
    /** UI滑动偏移距离 */
    slideOffset?: number;
    /** 弹出显示时的初始缩放值 */
    popShowInitScale?: number;
    /** 弹出显示时的过度缩放值 */
    popShowOverScale?: number;
    /** 弹出隐藏时的过度缩放值 */
    popHideOverScale?: number;
    /** 弹出隐藏时的最终缩放值 */
    popHideEndScale?: number;
    /** 正常缩放值 */
    normalScale?: number;
    /** 零缩放值 */
    zeroScale?: number;
    /** 完全不透明的透明度值 */
    fullOpacity?: number;
    /** 完全透明的透明度值 */
    zeroOpacity?: number;
    /** 动画持续时间（秒） */
    duration?: {
        /** 弹出动画第一阶段时间 */
        popFirst?: number;
        /** 弹出动画第二阶段时间 */
        popSecond?: number;
        /** 滑动动画时间 */
        slide?: number;
        /** 淡入淡出动画时间 */
        fade?: number;
        /** 缩放动画时间 */
        scale?: number;
        /** 旋转动画时间 */
        rotate?: number;
    };
    /** 缓动类型 */
    easing?: {
        /** 弹出动画缓动 */
        pop?: (t: number) => number;
        /** 滑动动画缓动 */
        slide?: (t: number) => number;
        /** 淡入淡出动画缓动 */
        fade?: (t: number) => number;
        /** 缩放动画缓动 */
        scale?: (t: number) => number;
        /** 旋转动画缓动 */
        rotate?: (t: number) => number;
    };
    /** 旋转角度 */
    rotateAngle?: {
        /** 进入时的旋转角度 */
        in?: number;
        /** 退出时的旋转角度 */
        out?: number;
    };
}
////////////////////////////////////////单体动作 结束 ////////////////////////////////////////
////////////////////////////////////////列表动作 开始 ////////////////////////////////////////

/**列表动作播放类型枚举 */
export enum EUiActionNodeListPlayType {
    /**顺序播放 */
    Sequence,
    /**同时播放 */
    Parallel
}

/**相同UI列表动作参数接口 (主要是一些固定参数) */
export interface IUiActionNodeListParams {
    /** 顺序模式播放延迟 */
    sequenceDelay?: number;
    /** 单个动作播放参数 */
    params?: Partial<IUiActionParams>;
}
////////////////////////////////////////列表动作 结束 ////////////////////////////////////////
////////////////////////////////////////动作组 开始 ////////////////////////////////////////

/**动作单元的类型 */
export enum EUiActionGroupUnitType {
    /**单个动作 */
    Single,
    /**列表动作 */
    List
}

/**动作组目标 */
export type TActionUnitTarget = Node | Node[];

/**动作组 动作单元 */
export interface IUiActionUnit {
    /** 动作对象 */
    target: TActionUnitTarget;
    /** 动作类型 */
    actionType: EUiActionPreset;
    /** 动作参数 */
    actionParams?: Partial<IUiActionParams>;
    /** 播放动作 */
    play(onComplete?: () => void): void;
}

/**定义几种固定动作组模式 */
export enum EUiActionGroupMode {
    /** 同时播放 滑入*/
    In_ParallelSlide,
    /** 同时播放 滑出*/
    Out_ParallelSlide,
    /** 左右滑入 上滑入 */
    In_LeftRightSlide_TopSlide,

}


////////////////////////////////////////动作组 结束 ////////////////////////////////////////





