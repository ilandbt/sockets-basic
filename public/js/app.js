var socket = io();


socket.on('connect', function() {
	console.log('connected to socket io server');
});

socket.on('message', function(message) {
	var momentTs = moment.utc(message.ts);;

	console.log('new message');
	console.log(message.text);

	jQuery('.messages').append('<p><string>' + momentTs.local().format('h:mm a') + '</strong>: ' + message.text + '</p>');
});


//handle submiting of new message

var $form = jQuery("#message-form");
$form.on('submit', function(event) {
	event.preventDefault();

	var $message = $form.find('input[name=message]');
	var ts;

	socket.emit('message', {
		text: $message.val(),
		ts: Date.now()
	});

	$message.val('');
});