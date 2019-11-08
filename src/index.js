const express = require('express');
const path = require('path');

const mongo = require('./utils/mongo');
const healthServices = require('./healthServices')
const locationServices = require('./locationServices')

const port = 8000;
const apiPath = '/api/'

const app = express();

healthServices.monitor(5000);

mongo.connect();

app.get(apiPath, (req, res) => {
    res.send('Hello world');
})

app.get(apiPath + 'fetchHealth', async (req, res) => {
    const result = await healthServices.fetchHealth(req.query)
    res.json(result);
})

app.get(apiPath + 'addLocation', async (req, res) => {
    const result = await locationServices.addLocation(req.query)
    res.json(result)
})

app.get(apiPath + 'fetchLocations', async (req, res) => {
    const result = await locationServices.fetchLocations(req.query)
    res.json(result)
})

app.get(apiPath + 'fetchGeoLocations', async (req, res) => {
    const result = await locationServices.fetchGeoLocations(req.query)
    res.json(result)
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(process.env.PORT || port, () => {
    console.log('server is listening now.');
})