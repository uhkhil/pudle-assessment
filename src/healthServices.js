const os = require('os');

const monitor = () => setInterval(() => {
    checkStatus()
}, 1000);

function checkStatus() {
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const percentMem = (freeMem / totalMem * 100).toFixed(2)
    console.log('TCL: checkStatus -> percentMem', percentMem);
    const percentCpu = (12.12).toFixed(2);
    console.log('TCL: checkStatus -> percentCpu', percentCpu);

    // TODO: Figure out how to fetch the cpu percentage
    // for (var i = 0, len = cpus.length; i < len; i++) {
    //     console.log("CPU %s:", i);
    //     var cpu = cpus[i], total = 0;

    //     for (var type in cpu.times) {
    //         total += cpu.times[type];
    //     }

    //     for (type in cpu.times) {
    //         console.log("\t", type, Math.round(100 * cpu.times[type] / total));
    //     }
    // }
}

module.exports = {
    checkStatus,
    monitor
}