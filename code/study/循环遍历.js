//遍历比较

//普通for循环 效率最高
for()

//遍历自身属性    不管是否可枚举
Object.getOwnPropertyNames();

//遍历可枚举属性    包括原型链上的
for (let item in Object){}

//遍历自身可枚举
Object.keys()

//遍历数组
for(let item of Object){}

//对原数组每个都进行一个操作 不可中断
[].forEach()
//不改变原数组 返回新数组 不可中断
[].map()