/// <reference lib="dom" />
import fs from 'fs'
import path, { resolve } from 'path'
/**仓库管理员 */
export class RepositoryMgr {
    private constructor() { };
    private static _ins: RepositoryMgr = null;
    public static get ins(): RepositoryMgr {
        if (!this._ins) this._ins = new RepositoryMgr();
        return this._ins;
    }

    private rootPath = null;
    private repDirName = `repository`;
    private repFileName = `brain0`;

    //将仓库复制到本地，结束时用本地快照更新仓库
    private snapShot: any = null;

    /**初始化仓库，true：有内容，false：空仓库 */
    public async init() {
        return new Promise<boolean>(async (resolve) => {
            this.rootPath = path.resolve();
            await this.createDir();
            let hasFile = this.checkFile();
            if (hasFile) {
                await this.readFile();
            }
            resolve(hasFile);
        })
    }

    /**生成目录 */
    private createDir() {
        return new Promise<void>((resolve, reject) => {
            let dir = `${this.rootPath}/${this.repDirName}`;
            let hasDir = fs.existsSync(dir);
            if (!hasDir) {
                fs.mkdir(dir, err => {
                    if (!err) resolve()
                    else reject();
                })
            } else resolve();
        });
    }

    /**检查文件是否存在 */
    private checkFile() {
        let file = `${this.rootPath}/${this.repDirName}/${this.repFileName}.json`;
        return fs.existsSync(file);
    }

    /**将快照写入仓库 */
    private writeFile() {
        return new Promise<void>((resolve, reject) => {
            let file = `${this.rootPath}/${this.repDirName}/${this.repFileName}.json`;
            let data = JSON.stringify(this.snapShot);
            fs.writeFile(file, data, err => {
                if (!err) {
                    console.log(`写入完成！`);
                    resolve();
                } else reject();
            })
        });
    }

    /**从仓库拷贝下来 */
    public readFile() {
        return new Promise<void>((resolve, reject) => {
            let file = `${this.rootPath}/${this.repDirName}/${this.repFileName}.json`;
            let hasFile = fs.existsSync(file);
            if (hasFile) {
                fs.readFile(file, `utf-8`, (err, data) => {
                    if (!err) {
                        this.snapShot = JSON.parse(data);
                        resolve();
                    }
                })
            } else reject();
        })
    }


}