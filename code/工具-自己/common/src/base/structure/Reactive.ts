

interface Render {
    (): void;
    deps?: Set<Set<Render>>;
    wrap?: () => void;
}

/**响应式系统 */
export class Reactive {
    static activeRender: Render | null = null;

    static registerRenders(...fns: Render[]) {
        for (const fn of fns) {
            const wrap = () => {
                Reactive.cleanup(fn); // 清除旧依赖
                Reactive.activeRender = fn;
                fn(); // 立刻执行一次，收集依赖
                Reactive.activeRender = null;
            }
            fn.deps = new Set(); // 保存依赖集合
            fn.wrap = wrap;
            wrap(); // 立即执行一次，收集依赖
        }
    }

    /**清除旧依赖 */
    static cleanup(fn: Render) {
        if (!fn.deps) return;
        fn.deps.forEach(dep => dep.delete(fn));// 从每个依赖集合中移除该函数
        fn.deps.clear(); // 清空依赖集合
    }

    constructor() {
        this.raw = this;
        //用代理对象替换原始对象
        return this.createProxy(this);
    }

    public destroy() {
        //清理原始对象的属性，不要清理代理对象，否则会触发trigger
        this.raw.targetMap = null;
        this.raw.taskQueue.clear();
        this.raw.taskQueue = null;
    }

    /**保留原始对象 */
    public raw: this = null;

    /**创建代理对象 */
    public createProxy<T extends object>(obj: T): T {
        const self = this;
        return new Proxy(obj, {
            get(target, key, receiver) {
                self.track(target, key); // 收集依赖
                return Reflect.get(target, key, receiver);
            },
            set(target, key, value, receiver) {
                if (Reflect.get(target, key, receiver) === value) return true;
                const result = Reflect.set(target, key, value, receiver);
                self.trigger(target, key); // 触发更新
                return result;
            }
        });
    }

    // 保存依赖关系：target -> key -> Set<函数>
    private targetMap = new WeakMap<object, Map<string | symbol, Set<Render>>>();

    /**收集依赖 */
    private track(target: object, key: string | symbol) {
        const render = Reactive.activeRender;
        if (!render) return;

        let depsMap = this.targetMap.get(target);
        if (!depsMap) {
            depsMap = new Map();
            this.targetMap.set(target, depsMap);
        }

        let deps = depsMap.get(key);
        if (!deps) {
            deps = new Set();
            depsMap.set(key, deps);
        }
        deps.add(render);
        //反向标记 将来好清理旧依赖
        if (render.deps) {
            render.deps.add(deps);
        }
    }

    /**触发更新 */
    private trigger(target: object, key: string | symbol) {
        const depsMap = this.targetMap.get(target);
        if (!depsMap) return;

        const deps = depsMap.get(key);
        if (!deps) return;

        deps.forEach(render => {
            const fn = render.wrap || render;
            this.addTask(fn);
        });
    }

    // 微任务队列
    private taskQueue = new Set<Render>();
    private isFlushing = false;

    /**添加任务到微任务队列 */
    private addTask(render: Render) {
        this.taskQueue.add(render);
        if (!this.isFlushing) {
            this.isFlushing = true;
            //不能用微任务,可能重复渲染，要用raf
            // Promise.resolve().then(() => {
            // })
            requestAnimationFrame(() => {
                this.taskQueue.forEach(render => render());
                this.taskQueue.clear();
                this.isFlushing = false;
            })
        }
    }

}


