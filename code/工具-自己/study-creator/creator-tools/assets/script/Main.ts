import ExtraBundle from "../extra/ExtraBundle";
import { EBEventMgr } from "../extra/extraBundle/common/Export";



const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    onLoad() {
        this.init();
    }

    private async init() {
        await ExtraBundle.ins.init();

        EBEventMgr.ins.addEvent(`testEvent`, (p1, p2) => {
            console.log(`getEvent: testEvent`, p1, p2);
        }, this);
        EBEventMgr.ins.raiseEvent(`testEvent`, 234, 567, 789);
    }

}
