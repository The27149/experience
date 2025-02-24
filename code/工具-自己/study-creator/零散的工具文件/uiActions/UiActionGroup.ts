import { _decorator, director } from 'cc';
import { IUiActionUnit } from './common/UiActionDefine';
const { ccclass } = _decorator;

/** 动作组， 用于管理一组动作 由多个批次依次执行组成*/
@ccclass('UiActionGroup')
export class UiActionGroup {

    private group: IUiActionUnit[][] = [];

    private _isPlaying: boolean = false;
    private _curIndex: number = 0;
    public isAsyncPlay: boolean = false;

    /**本组动作播放结束回调 （对外） */
    public onGroupComplete: () => void;
    /**是否自动销毁 */
    public isAutoDestroy: boolean = false;

    /** 添加新批次 （由单个/多个/数组动作单元组成）*/
    public addNewBatchAt(index: number = 0, ...units: (IUiActionUnit | IUiActionUnit[])[]) {
        const flattenedUnits = units.reduce((last: any[], cur) => last.concat(Array.isArray(cur) ? cur : [cur]), []);
        this.group.splice(index, 0, flattenedUnits);
    }

    /** 从最后面添加新批次  （由单个/多个/数组动作单元组成）*/
    public pushNewBatch(...units: (IUiActionUnit | IUiActionUnit[])[]) {
        this.addNewBatchAt(this.group.length, ...units);
    }

    /** 添加动作单元到指定批次 （单个/多个/数组）*/
    public addUnitsToBatch(index: number, isForce: boolean = false, ...units: (IUiActionUnit | IUiActionUnit[])[]) {
        let batch = this.group[index];
        if (!batch) {
            if (!isForce) return;
            batch = [];
            this.group[index] = batch;
        }
        const flattenedUnits = units.reduce((last: any[], cur) => last.concat(Array.isArray(cur) ? cur : [cur]), []);
        batch.push(...flattenedUnits);
    }

    /**播放本组动作 （依次播放多个批次）
     * @param index 从第几个批次开始播放 默认从第一个批次开始
     */
    public play(index: number = 0) {
        if (this.isAsyncPlay) {
            let scheduler = director.getScheduler();
            scheduler.schedule(() => { this._play() }, scheduler, 0, 0, 0.016);
        } else {
            this._play(index);
        }
    }

    /**播放本组动作 （依次播放多个批次）
     * @param index 从第几个批次开始播放 默认从第一个批次开始
     */
    private _play(index: number = 0) {
        if (this._isPlaying) return;
        this._isPlaying = true;
        this._curIndex = index;
        this._playBatch();
    }

    /**播放当前批次动作（同时播放） */
    private _playBatch() {
        let batch: IUiActionUnit[] = this.group[this._curIndex];
        if (!batch) return;
        batch.forEach((unit, index) => {
            unit.play(() => {
                if (index === batch.length - 1) {
                    this._onBatchComplete();
                }
            });
        })
    }

    /** 动作批次播放结束 */
    private _onBatchComplete() {
        if (this._curIndex < this.group.length - 1) {
            this._curIndex++;
            this._playBatch();
        } else {
            this._onGroupComplete();
        }
    }

    /** 动作组播放结束 */
    private _onGroupComplete() {
        if (this.isAutoDestroy) this.destroy();
        else {
            this._isPlaying = false;
            this._curIndex = 0;
        }
        if (this.onGroupComplete) {
            this.onGroupComplete();
        }
    }

    /**销毁 */
    public destroy() {
        this._onBatchComplete = null;
        this.onGroupComplete = null;
        this.group.length = 0;
        this._isPlaying = false;
        this._curIndex = 0;
    }



    // /** 动作批次列表 */
    // private batchList: UiActionBatch[] = [];

    // private _isPlaying: boolean = false;
    // private _curIndex: number = 0;
    // private _onBatchComplete: () => void;
    // public onComplete: () => void;

    // constructor() {
    //     this._onBatchComplete = () => {
    //         if (this._curIndex < this.batchList.length) {
    //             this._curIndex++;
    //             this._play();
    //         } else {
    //             this._onComplete();
    //         }
    //     };
    // }

    // /** 添加批次 */
    // public addBatch(...batches: UiActionBatch[]) {
    //     this.batchList.push(...batches);
    // }

    // /** 移除批次 */
    // public removeBatch(...batches: UiActionBatch[]) {
    //     for (let i = this.batchList.length - 1; i >= 0; i--) {
    //         if (batches.includes(this.batchList[i])) {
    //             this.batchList.splice(i, 1);
    //         }
    //     }
    // }

    // /**播放本组动作
    //  * @param index 从第几个批次开始播放 默认从第一个批次开始
    //  */
    // public play(index: number = 0) {
    //     if (this._isPlaying) return;
    //     this._isPlaying = true;
    //     this._curIndex = index;
    //     this._play();
    // }

    // /**实际播放当前批次 */
    // private _play() {
    //     let batch: UiActionBatch = this.batchList[this._curIndex];
    //     if (!batch) return;
    //     batch.play(this._onBatchComplete);
    // }

    // /**播放结束 */
    // private _onComplete() {
    //     this._isPlaying = false;
    //     this._curIndex = 0;
    //     if (this.onComplete) {
    //         this.onComplete();
    //     }
    //     this.destroy();
    // }

    // /**销毁 */
    // public destroy() {
    //     this._onBatchComplete = null;
    //     this.onComplete = null;
    //     this.batchList.length = 0;
    //     this._isPlaying = false;
    //     this._curIndex = 0;
    // }
}


