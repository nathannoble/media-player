const express = require('express')
const v2 = express.Router();
const apiVersion = 2

v2.get('/', function (req, res) {
    res.header("Api-Version", apiVersion);
    res.send('You are calling Version 2 API');
});

v2.get('/songs', function (req, res) {
    res.header("Api-Version", apiVersion);
    res.send('Listing Version 2 Songs');
});

module.exports = v2;