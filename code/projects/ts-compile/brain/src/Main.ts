import { Brain } from "./brain/Brain";
import { MainClock } from "./clock/MainClock";
import { RepositoryMgr } from "./repository/RepositoryMgr";
(async () => {
    let hasFile = await RepositoryMgr.ins.init();
    console.log(hasFile);
    if (!hasFile) {
        let brain = new Brain();
    }
    MainClock.ins
})();
