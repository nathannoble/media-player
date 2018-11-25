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


/////////////
// Web Socket
//////////////
var playingNowData = [];


const io = require('socket.io')()
io.on('connection', function (socket) {
    console.log("connected! " + socket.id);

    io.emit('welcome', socket.id)

    socket.on('play', function (data) {
        addToPlayingData(data)
        io.emit("playing", playingNowData)
    })

    socket.on('pause', function (data) {
        removeFromPlayingData(data.userId)
        io.emit("playing", playingNowData)
    })

    socket.on('disconnect', function () {
        removeFromPlayingData(socket.id)
    })

})

const wsPort = 8080
io.listen(wsPort)
console.log(`Socket listening on port ${wsPort}!`);


function addToPlayingData(data){
    console.log("Adding media with ID : " + data.id)

    // Add to playing data 
    playingNowData.push(data)
    showNowplaying()
}

function removeFromPlayingData(userId){
    console.log("Removing: " + userId)

    // Remove based on userId
    playingNowData = playingNowData.filter(d => d.userId !== userId)
    showNowplaying()
}

function showNowplaying(){
    console.log("Now playing:")
    console.log(playingNowData)
}
