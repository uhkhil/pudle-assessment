const os = require('os');
const mongo = require('./utils/mongo');
const constants = require('./constants');

const normalize = number => parseFloat(number.toFixed(2))

const monitor = (interval) => setInterval(() => {
    const status = checkStatus();
    if (status) {
        storeStatus(status)
    }
}, interval);

function checkStatus() {
    try {
        const totalMem = os.totalmem()
        const freeMem = os.freemem()
        const memoryPercent = normalize(freeMem / totalMem * 100)
        const cpus = os.cpus();
        let totalCpu = 0;
        for (var i = 0, len = cpus.length; i < len; i++) {
            var cpu = cpus[i], total = 0;
            for (var type in cpu.times) {
                total += cpu.times[type];
            }
            const idlePercent = (cpu.times.idle) / total * 100
            const busyPercent = 100 - idlePercent
            totalCpu += busyPercent;
        }
        const CpuPercent = normalize(totalCpu / cpus.length)
        const obj = {
            memoryPercent,
            CpuPercent
        };
        return obj;
    } catch (error) {
        console.warn('Error while checking system status', error.toString())
        return false;
    }
}

async function storeStatus(status) {
    try {
        const result = await mongo.db().collection(constants.MONGO_COLLECTION.HEALTH)
            .insertOne({
                createdAt: new Date(),
                ...status
            })
        return true;
    } catch (error) {
        return false;
    }
}

const fetchHealth = async (query) => {
    const response = {}

    // Validation
    try {
        const { from, to } = query;
        const timeQuery = {
            $and: [
                {
                    'createdAt': {
                        $gte: new Date(from)
                    }
                },
                {
                    'createdAt': {
                        $lte: new Date(to)
                    }
                }
            ]
        }
        const mongoQuery = mongo.db().collection(constants.MONGO_COLLECTION.HEALTH)
            .find(timeQuery)

        const result = await mongoQuery.toArray()
        const count = await mongoQuery.count()
        response.status = true;
        response.data = result;
        response.meta = {
            count
        }
    } catch (error) {
        response.status = false;
        response.message = error.toString()
    }
    return response;
}

module.exports = {
    monitor,
    fetchHealth
}