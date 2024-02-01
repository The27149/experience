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
Object.defineProperty(exports, "__esModule", { value: true });
const Brain_1 = require("./brain/Brain");
const MainClock_1 = require("./clock/MainClock");
const RepositoryMgr_1 = require("./repository/RepositoryMgr");
(() => __awaiter(void 0, void 0, void 0, function* () {
    let hasFile = yield RepositoryMgr_1.RepositoryMgr.ins.init();
    console.log(hasFile);
    if (!hasFile) {
        let brain = new Brain_1.Brain();
    }
    MainClock_1.MainClock.ins;
}))();
