var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');


var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));




io.on('connection', function(socket) {
	console.log('user connected via socket.io');

	socket.on('message', function(message) {
		console.log('Message received: ' + message.text);
		message.ts = moment().valueOf();
		io.emit('message', message);
	})

	socket.emit('message', {
		name: "System",
		text: "Welcome to chat app",
		ts: moment().valueOf()
	});
});

http.listen(PORT, function() {
	console.log('server started!');
});