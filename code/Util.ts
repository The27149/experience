export class Utils {

    ///////////////////////////////////数组方法扩展 start//////////////////////////////////////////////////////////////////
    /**n个数组去重 */
    static noRepeatOfArrays(...arrs: never[][]): any[] {
        let list = [];
        arrs.forEach(arr => { list = list.concat(arr) })
        return [...new Set(list)];
    }

    /**提取n个数组中重复的部分 */
    static getRepeatOfArrays(...arrs: any[][]): any[] {
        let list = arrs[0].filter(item => {
            let tag = true;
            for (let i = 1; i < arrs.length; i++) {
                tag = arrs[i].includes(item);
                if (!tag) break;
            }
            return tag;
        })
        return list;
    }
    ///////////////////////////////////数组方法扩展 over//////////////////////////////////////////////////////////////////
}