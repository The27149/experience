
let log = (...params) => {
    console.log(`%c///////////////`, `color: orange`, ...params);
};
setTimeout(() => {
    log(2, 222)
}, 1);
(async () => {
    let fn = function () {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                log(3);
                resolve(null);
            }, 0);
        })
    };
    await fn()

})()
log(4)

