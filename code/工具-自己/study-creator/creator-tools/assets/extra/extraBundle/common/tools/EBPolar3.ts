

const { ccclass, property } = cc._decorator;
/**三维极坐标 左手系*/
@ccclass
export default class EBPolar3 {

    /**直角坐标转极坐标 */
    static vecToPolar(vec: cc.Vec3, out?: EBPolar3): EBPolar3 {
        let polar = out || new EBPolar3();
        polar.r = vec.len();
        polar.cita = Math.asin(vec.y / polar.r);
        const temp = polar.r * Math.cos(polar.cita);
        polar.alfa = Math.acos(vec.x / temp);
        if (vec.z < 0) polar.alfa *= -1;
        return polar;
    }

    /**极坐标转直角坐标 */
    static polarToVec(polar: EBPolar3, out?: cc.Vec3): cc.Vec3 {
        let vec = out || cc.v3();
        vec.y = polar.r * Math.sin(polar.cita);
        const temp = polar.r * Math.cos(polar.cita);
        vec.x = temp * Math.cos(polar.alfa);
        vec.z = temp * Math.sin(polar.alfa);
        return vec;
    }


    constructor(r: number = 1, alfa: number = 0, cita: number = 0) {
        this.r = r;
        this.alfa = alfa;
        this.cita = cita;
    }

    /**半径 */
    public r: number = 1;

    /** x-z角 (-pi~pi)*/
    public alfa: number = 0;

    /**xz-y角 (-pi/2~pi/2) */
    public cita: number = 0;

    /**由直接坐标转化而来 */
    public fromVec3(input: cc.Vec3): EBPolar3 {
        EBPolar3.vecToPolar(input, this);
        return this;
    }

    public toVec3(out?: cc.Vec3): cc.Vec3 {
        return EBPolar3.polarToVec(this, out);
    }
}
