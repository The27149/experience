"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryMgr = void 0;
/// <reference lib="dom" />
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**仓库管理员 */
class RepositoryMgr {
    constructor() {
        this.rootPath = null;
        this.repDirName = `repository`;
        this.repFileName = `brain0`;
        //将仓库复制到本地，结束时用本地快照更新仓库
        this.snapShot = null;
    }
    ;
    static get ins() {
        if (!this._ins)
            this._ins = new RepositoryMgr();
        return this._ins;
    }
    /**初始化仓库，true：有内容，false：空仓库 */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                this.rootPath = path_1.default.resolve();
                yield this.createDir();
                let hasFile = this.checkFile();
                if (hasFile) {
                    yield this.readFile();
                }
                resolve(hasFile);
            }));
        });
    }
    /**生成目录 */
    createDir() {
        return new Promise((resolve, reject) => {
            let dir = `${this.rootPath}/${this.repDirName}`;
            let hasDir = fs_1.default.existsSync(dir);
            if (!hasDir) {
                fs_1.default.mkdir(dir, err => {
                    if (!err)
                        resolve();
                    else
                        reject();
                });
            }
            else
                resolve();
        });
    }
    /**检查文件是否存在 */
    checkFile() {
        let file = `${this.rootPath}/${this.repDirName}/${this.repFileName}.json`;
        return fs_1.default.existsSync(file);
    }
    /**将快照写入仓库 */
    writeFile() {
        return new Promise((resolve, reject) => {
            let file = `${this.rootPath}/${this.repDirName}/${this.repFileName}.json`;
            let data = JSON.stringify(this.snapShot);
            fs_1.default.writeFile(file, data, err => {
                if (!err) {
                    console.log(`写入完成！`);
                    resolve();
                }
                else
                    reject();
            });
        });
    }
    /**从仓库拷贝下来 */
    readFile() {
        return new Promise((resolve, reject) => {
            let file = `${this.rootPath}/${this.repDirName}/${this.repFileName}.json`;
            let hasFile = fs_1.default.existsSync(file);
            if (hasFile) {
                fs_1.default.readFile(file, `utf-8`, (err, data) => {
                    if (!err) {
                        this.snapShot = JSON.parse(data);
                        resolve();
                    }
                });
            }
            else
                reject();
        });
    }
}
exports.RepositoryMgr = RepositoryMgr;
RepositoryMgr._ins = null;
