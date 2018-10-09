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

	var answers = [];

	$('form.submit input').each(function() {
		if($(this).attr('name') && $(this).attr('name')[0] == 'q') {
			var n = $(this).attr('name').substr(1);

			answers[parseInt(n)-1] = $(this).val();
		}
	});

	$.ajax({
		url: location.href,
		type: $(this).attr('method'),
		data: {
			answer: answers.join(',')
		},
		success: function(data) {
			if(data.message == 'win') {
				Eve.say('Correct answer,<br>well done!');
				//Eve.happy();
			}
			else if(data.message == 'lose') {
				Eve.say('Incorrect answer,<br>try again!');
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

