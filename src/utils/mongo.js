const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const constants = require('../constants')

const url = constants.MONGO_URL;
const dbName = constants.MONGO_DB;
let client;

module.exports = {
    connect: () => {
        MongoClient.connect(url, function (err, mongoClient) {
            assert.equal(null, err);
            console.log("Connected successfully to server");
            client = mongoClient;
        });
    },
    db: () => client.db(dbName),
    close: () => client.close()
}