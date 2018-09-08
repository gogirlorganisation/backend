function out(text) {
	$('.stdout').html($('.stdout').text() + text);
}

function err(text) {
	$('.stderr').html($('.stderr').text() + text);
}

var socket = io.connect('/');

socket.emit('cmdline');

$('.stdout').html('');
$('.stderr').html('');

socket.on('stdout', function(data) {
	out(data);
});

socket.on('stderr', function(data) {
	console.log(data);
	err(data);
});

$('.stdin').on('keypress', function(e) {
	if(e.keyCode == 13) {
		e.preventDefault();
		var input = $('.stdin').val();
		socket.emit('stdin', input);
		$('.stdin').val('');
	}
});

socket.on('end', function(data) {
	err(data);
	socket.emit('cmdline');
});