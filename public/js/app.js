var name = getQueryVariable('name') || 'Anonymous';
var room = getQueryVariable('room');

console.log(name + ' entered room ' + room);

var socket = io();


socket.on('connect', function() {
	console.log('connected to socket io server');
});

socket.on('message', function(message) {
	var momentTs = moment.utc(message.ts);;
	var $messages = jQuery('.messages');
	console.log('new message');
	console.log(message.text);

	$messages.append('<p><string>' + message.name + ' ' + momentTs.local().format('h:mm a') + '</strong></p>');
	$messages.append('<p>' + message.text + '</p>');
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