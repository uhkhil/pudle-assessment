const express = require('express');
const mongo = require('./utils/mongo');
const healthServices = require('./healthServices')
const locationServices = require('./locationServices')

const port = 8000;
const path = '/api/'

const app = express();

healthServices.monitor(5000);

mongo.connect();

app.get(path, (req, res) => {
    res.send('Hello world');
})

app.get(path + 'fetchHealth', async (req, res) => {
    const result = await healthServices.fetchHealth(req.query)
    res.json(result);
})

app.get(path + 'addLocation', async (req, res) => {
    const result = await locationServices.addLocation(req.query)
    res.json(result)
})

app.get(path + 'fetchLocations', async (req, res) => {
    const result = await locationServices.fetchLocations(req.query)
    res.json(result)
})

app.get(path + 'fetchGeoLocations', async (req, res) => {
    const result = await locationServices.fetchGeoLocations(req.query)
    res.json(result)
})


app.listen(port, () => {
    console.log('server is listening now.');
})