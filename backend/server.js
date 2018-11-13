const express = require('express')
var app = module.exports = express();
const port = 5000

// Support CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api/v1', require('./api/v1'));
app.use('/api/v2', require('./api/v2'));
app.use('/media', require('./api/media'));
// ..other routes here

app.get('/', function (req, res) {
    res.send('Welcome to the Media Backend Service!')
});

if (!module.parent) {
    app.listen(port, () => console.log(`Media Backend listening on port ${port}!`))
}