const express = require('express')
var _ = require('lodash');
const v1 = express.Router();
const apiVersion = 1

// Get static list of songs
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data/songs.json', "utf8"))

v1.get('/', function (req, res) {
    res.send('You are calling Version 1 API');
});

// Get list of songs
v1.get('/songs', function (req, res) {
    res.header("Api-Version", apiVersion);
    res.json(data.songs);
});

// Get list of songs by artist
v1.get('/artists/:artistId/songs', function (req, res) {
    const id = req.params.artistId
    const results = _.filter(data.songs, function(o) { return o.artistId == id; });
    res.header("Api-Version", apiVersion);
    res.json(results);
});

// Get list of songs by genre
v1.get('/genre/:genre/songs', function (req, res) {
    const genre = req.params.genre
    const results = _.filter(data.songs, function(o) { return o.genre == genre; });
    res.header("Api-Version", apiVersion);
    res.json(results);
});

module.exports = v1;