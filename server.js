var PORT = process.env.PORT || 3000;
var express = require('express');
var moment = require('moment');


var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var clientInfo = {}

//sends current users 
function sendCurrentUsers(socket) {
	var info = clientInfo[socket.id];
	var users = [];

	if (typeof info === 'undefined'){
		return;
	}

	Object.keys(clientInfo).forEach(function(socketId){
		var userInfo = clientInfo[socketId];

		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});

	socket.emit('message', {
		name: 'System',
		text: 'Current users: ' + users.join(', '),
		ts: moment().valueOf()
	});
}

io.on('connection', function(socket) {
	console.log('user connected via socket.io');

	//disconnect from chat
	socket.on('disconnect', function() {
		var userData = clientInfo[socket.id];
		console.log(' disconnect' + userData);
		if (typeof userData !== 'undefined') {
			socket.leave(userData.room);
			io.to(userData.room).emit('message', {
				name: 'System',
				text: userData.name + ' has left!',
				ts: moment().valueOf()
			});
			delete clientInfo[socket.id];
		}
	});

	//get room and user name
	socket.on('joinRoom', function(data) {
		console.log('data: ' + data.name + ', ' + data.room);
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

		if (message.text === '@currentUsers') {
			sendCurrentUsers(socket);
		} else {
			message.ts = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message);
		}
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