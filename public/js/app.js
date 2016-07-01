var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

console.log(name + ' entered room ' + room);

var socket = io();

jQuery("#roomName").text(room);


socket.on('connect', function() {
	console.log('connected to socket io server');


	socket.emit('joinRoom', {
		name: name,
		room: room
	});
});

socket.on('message', function(message) {
	var momentTs = moment.utc(message.ts);;
	var $messages = jQuery('.messages');
	var $message = jQuery('<li class="list-group-item"></li>');
	console.log('new message');
	console.log(message.text);

	$message.append('<p><string>' + message.name + ' ' + momentTs.local().format('h:mm a') + '</strong></p>');
	$message.append('<p>' + message.text + '</p>');

	$messages.append($message);
});


//handle submiting of new message

var $form = jQuery("#message-form");
$form.on('submit', function(event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	var ts;

	socket.emit('message', {
		name: name,
		text: $message.val(),
		ts: Date.now()
	});

	$message.val('');
});