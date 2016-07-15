"use strict";
var http = require("http");
var express = require("express");

var app = express();

var options = require("./opts_"+process.argv[2]+".json");

app.use(require("../")(options).converter);
// simply reply with path.
app.get("*",function(req,res){
	res.status(200).json({
		"url" :  req.url,
		"originalUrl" : req.originalUrl,
		"path" : req.path,
		"trueUrl" : req.trueUrl,
		"host" : req.headers.host
	})
});


var server = http.createServer(app);
server.listen(9876,function(){
	console.log("Listening on port 9876");
});