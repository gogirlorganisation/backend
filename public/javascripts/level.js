var Person = function() {
	var sad = $('.sad-eve'),
		happy = $('.happy-eve');

	this.happy = function() {
		sad.addClass('hidden');
		happy.removeClass('hidden');
	};

	this.sad = function() {
		sad.removeClass('hidden');
		happy.addClass('hidden');
	};

	this.say = function(str) {
		var x = $('<div>');
		x.html(str);
		x.addClass('bubble');
		x.insertBefore('.happy-eve');
		setTimeout(function() {
			x.fadeOut(300, function() {
				x.remove();
			});
		}, 5500);
		$('.question').animate({
			scrollTop: happy.offset.top
		}, 400);
	}
};

var Eve = new Person();

$('form.submit').on('submit', function(e) {
	e.preventDefault();

	$.ajax({
		url: location.href,
		type: $(this).attr('method'),
		data: {
			answer: $('.stdout').text()
		},
		success: function(data) {
			if(data.message == 'win') {
				Eve.say('correct answer!');
				//Eve.happy();
			}
			else if(data.message == 'lose') {
				Eve.say('incorrect answer!');
				/*Eve.sad();
				setTimeout(function() {
					Eve.happy();
				}, 5000);*/
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
		console.log(data);
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
		$('form.submit').submit();
	});
});