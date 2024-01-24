import { Brain } from "./brain/Brain";
import { RepositoryMgr } from "./repository/RepositoryMgr";
(async () => {
    let hasFile = await RepositoryMgr.ins.init();
    console.log(hasFile);
    if (!hasFile) {
        let brain = new Brain();
    }
})();
