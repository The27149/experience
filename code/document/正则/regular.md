# 变量匹配替换
1. 正则匹配整段字符 可以用（）配合 $，替换部分字符；
2. 1的应用：cocos组件中匹配函数：(\w+)(?<!onLoad|start|update|notify|function)\(([\w|:|\s|\d|.||,|\[|\]]*)\)\s*\r*\{
替换：$1$test($2){  
3. \w 匹配符合js变量名称的字符，即字母数字下划线；
4. vscode中，删除批量的console,所有的打印都有test标志串，可用这个正则然后全部替换：  ^.*(test).*$\n

# 参考站点
1. https://web.suda.edu.cn/hejun/chapter8/python_8_3.html#
