const express = require('express');
const mongo = require('./utils/mongo');
const healthServices = require('./healthServices')
const locationServices = require('./locationServices')

const port = 8000;
const path = '/api/'

const app = express();

healthServices.monitor();

mongo.connect();

app.get(path, (req, res) => {
    res.send('Hello world');
})

app.get(path + 'addLocation', async (req, res) => {
console.log('TCL: req', req);
    const result = await locationServices.addLocation(req.query)
    console.log('TCL: result', result);
    res.json(result)
})

app.get(path + 'fetchLocations', async (req, res) => {
console.log('TCL: req', req);
    const result = await locationServices.fetchLocations(req.query)
    console.log('TCL: result', result);
    res.json(result)
})


app.listen(port, () => {
    console.log('server is listening now.');
})