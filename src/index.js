const express = require('express');
const port = 8000;
const path = '/api/'

const app = express();

app.get(path, (req, res) => {
    res.send('Hello world');
})

app.listen(port, () => {
    console.log('server is listening now.');
} )