

var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get("/public", function(req, res){
	res.sendFile('uebg1.html', { root: path.join(__dirname, './public') });
} );

app.get("/time", function(req, res){
	res.header('content-type', 'text/plain');
	res.sendFile('index.html', {root: path.join(__dirname, './routes')});
});

// Route anlegen
app.get(/.*/, function(req, res) {

	res.send('<!DOCTYPE html>' +
			'<html lang="de">' +
			'<head><meta charset="utf-8"></head>' +
			'<body><h1>Hello World!</h1></body>' +
			'</html>'
	);
});


var server = app.listen(2000, function() {
	console.log('helloworld app is ready and listening at http://localhost:2000');
});