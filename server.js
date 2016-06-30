var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');


var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {}

io.on('connection', function(socket) {
	console.log('user connected via socket.io');

	//get room and user name
	socket.on('joinRoom', function(data) {
		console.log('data: ' + data.name +', '+data.room);
		clientInfo[socket.id] = data 
		socket.join(data.room);
		socket.broadcast.to(data.room).emit('message', {
			name: 'System',
			text: data.name + " joined the room",
			ts: moment().valueOf()
		});
	});

	//get message
	socket.on('message', function(message) {
		console.log('Message received: ' + message.text);
		message.ts = moment().valueOf();
		io.to(clientInfo[socket.id].room).emit('message', message);
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