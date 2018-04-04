$('form.submit').on('submit', function(e) {
	e.preventDefault();

	$.ajax({
		url: location.href,
		type: $(this).attr('method'),
		data: $(this).serialize(),
		success: function(data) {
			if(data.message == 'win') {
				alert('correct answer!');
				location.href = '/dashboard';
			}
			else if(data.message == 'lose') {
				alert('incorrect answer!');
			}
			else if(data.message == 'logout') {
				alert('please log in again');
				location.href = '/login';
			}
			else alert(data.message);
		},
		error: function(xhr, err) {
			alert('see console for error');
			console.log(err);     
		}
	});
});

function out(text) {
	$('.stdout').html($('.stdout').text() + text);
}

function err(text) {
	$('.stderr').html($('.stderr').text() + text);
}

$('form.compiler').on('submit', function(e) {
	e.preventDefault();

	var socket = io.connect('/');

	$('.stdout').html('');
	$('.stderr').html('');

	socket.emit('code', $(this).find('textarea').val());

	socket.on('stdout', function(data) {
		out(data);
	});

	socket.on('stderr', function(data) {
		err(data);
	});

	$('.stdin').on('keypress', function(e) {
		if(e.keyCode == 13) {
			e.preventDefault();
			var input = $('.stdin').val();
			socket.emit('stdin', input);
			out(input + '\n');
			$('.stdin').val('');
		}
	});

	socket.on('end', function(data) {
		err(data);
		$('.stdin').off('keypress');
		socket.disconnect();
	});
});