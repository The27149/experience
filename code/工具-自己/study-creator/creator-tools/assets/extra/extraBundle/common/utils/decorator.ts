/**
 * 属性装饰器
 * 只能修改一次有效值
 */
export function SetOnlyOnce(target: any, propKey: string) {
    let key = `onceSet_${propKey}`;
    target[key] = null;
    Object.defineProperty(target, propKey, {
        get() {
            return target[key];
        },
        set(v: any) {
            if (target[key] === null || target[key] === undefined) {
                target[key] = v;
            } else {
                throw new Error(`this property "${propKey}" is Set value only once!`);
            }
        },
        enumerable: true,
        configurable: false
    })

}