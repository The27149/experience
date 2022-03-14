class Pool{
    private pool: any[] = [];

    public get size(){
        return this.pool.length;
    }

    public get(): any{
        return this.pool.shift();
    }

    public put(item: any){
        this.pool.push(item);
    }
}


/**
 * 自定义位移动画
 */
export default class Move{
    private static movePool: Pool = new Pool();

    /**
     * 获取一个运动实例
     */
    public static getInstance(): Move{
        if(this.movePool.size > 0) return this.movePool.get();
        return new Move();
    }

    /**
     * 回收一个运动实例
     */
    private static putInstance(item: Move){
        this.movePool.put(item);
    }


    private target: cc.Node = null;
    private container: cc.Node = null;
    private startNode: cc.Node = null;
    private endNode: cc.Node = null;
    //运动时间 ms
    private duration: number = 1000;

    //最新调用的动画
    private animation: number = 0;
    private startTime: number = 0;
    private endTime: number = 0;

    private startPos: cc.Vec2 = null;
    private endPos: cc.Vec2 = null;


    private p0: cc.Vec2 = cc.v2(0, 0);      //起点
    private p1: cc.Vec2 = cc.v2(0, 0);      //相对终点
    private c1: cc.Vec2 = undefined;             //控制点1
    private c2: cc.Vec2 = undefined;             //控制点2

    private isFirstFrame: boolean = true;

    private setPos: Function = null; 
    public onComplete(): void{};
    
    constructor() {
        this.init();    
    }

    init(){
        game.EventManager.getInstance().addEventListener(game.Const.mess_windowResize, this.onResize, this);
    }

    private onResize(){
        this.updateAllPosition();
    }

    public setParams(target: cc.Node, startNode: cc.Node, endNode: cc.Node, duration: number, c1?: cc.Vec2, c2?: cc.Vec2): Move{
        this.target = target;
        this.container = target.parent;
        this.startNode = startNode;
        this.endNode = endNode;
        this.duration = duration;
        this.c1 = c1;
        this.c2 = c2;
        return this;
    }

    public run(onComplete?): void{
        //未被计算位置时第一帧隐藏
        this.target.active = false;
        this.isFirstFrame = true;
        this.startTime = Date.now();
        this.endTime = this.startTime + this.duration;
        this.updateAllPosition();
        this.setPos = this.c1 ? this.c2 ? this.setPosByBezier3.bind(this) : this.setPosByBezier2.bind(this) : this.setPosByLine.bind(this);
        requestAnimationFrame(this.loop.bind(this));
        this.onComplete = onComplete;
    }

    /**
     * 停止这个动作
     * @param DoComplete 
     */
    public stop(DoComplete: boolean = true): void{
        cancelAnimationFrame(this.animation);
        Move.putInstance(this);
        if(DoComplete && this.onComplete) this.onComplete();
    }

    /**
     * 更新起始点位置
     */
    public updateAllPosition(): void{
        if(!this.startNode) return;
        this.startPos = this.startNode.convertToWorldSpaceAR(cc.v2(0, 0)),
        this.endPos = this.endNode.convertToWorldSpaceAR(cc.v2(0, 0));
        this.startPos = this.container.convertToNodeSpaceAR(this.startPos);
        this.endPos = this.container.convertToNodeSpaceAR(this.endPos);
        this.p1 = this.endPos.sub(this.startPos);
    }

    

    private loop(time: number): void{
        let now = Date.now();
        if(now > this.endTime){
            this.stop();
            return;
        }
        if(this.isFirstFrame){
            this.isFirstFrame = false;
            this.target.active = true;
        } 
        let t = (now - this.startTime) / this.duration;
        this.setPos(t);
        this.animation = requestAnimationFrame(this.loop.bind(this));
    }


    //一次曲线（直线）计算位置
    private setPosByLine(t: number): void{
        let a = 1 - t;
        let tempX = a * this.p0.x + t * this.p1.x,
            tempY = a * this.p0.y + t * this.p1.y;
        this.target.x = this.startPos.x + tempX;
        this.target.y = this.endPos.y + tempY;
    } 
    
    //二次曲线计算位置
    private setPosByBezier2(t: number): void{
        let a = (1 - t) ** 2,
            b = 2 * t * (1 - t),
            c = t ** 2;
        let tempX = a * this.p0.x + b * this.c1.x + c * this.p1.x,
            tempY = a * this.p0.y + b * this.c1.y + c * this.p1.y;
        this.target.x = this.startPos.x + tempX;
        this.target.y = this.startPos.y + tempY;
    }

    //三次曲线计算位置
    private setPosByBezier3(t: number): void{
        let a = (1 - t) ** 3,
            b = 3 * t * (1 - t) ** 2,
            c = 3 * (1 - t) * t ** 2,
            d = t ** 3;
        let tempX = a * this.p0.x + b * this.c1.x + c * this.c2.x + d * this.p1.x,
            tempY = a * this.p0.y + b * this.c1.y + c * this.c2.y + d * this.p1.y;
        this.target.x = this.startPos.x + tempX;
        this.target.y = this.startPos.y + tempY;
    } 

}
