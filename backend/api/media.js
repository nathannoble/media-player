const express = require('express')
const media = express.Router();
const fs = require('fs');

media.get('/', function (req, res) {
    res.send('You are calling media');
});

media.get('/:title', function(req,res){
	var filename = './media/' + req.params.title; 
	fs.exists(filename,function(exists){
		if(exists)
		{
			var rstream = fs.createReadStream(filename);
			rstream.pipe(res);
		}
		else
		{
			res.send("File not found");
			res.end();
		}
	
	});
});

module.exports = media;