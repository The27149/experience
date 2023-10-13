//Object静态方法

Object.defineProperty(obj, attr, attr描述对象);

Object.getOwnPropertyNames();	//返回自身属性 不管是否是可遍历

Object.getOwnPropertyDescriptor();

Object.assign(obj, {a: 1}, {b: 2});		//让obj有a  b属性  assign:指派 分配

Object.create('原型对象');

Object.getPrototypeOf();

Object.setPrototypeOf();

Object.is(a, b); 	//连NaN都可以相等

Object.keys();

Object.values();

Object.entries(); 	//返回key value组成的二维数组
