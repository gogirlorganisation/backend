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

$('form.submit input, form.submit textarea').each(function() {
	if(!$(this).attr('placeholder')) {
		$(this).attr('placeholder', 'Type an answer...');
	}
	if($(this).is('textarea'))
		$(this).attr('autocomplete', 'nope');
	else
		$(this).attr('autocomplete', 'off');

	$(this).on('keypress', function() {
		$(this).removeClass('correct').removeClass('incorrect');
	});
});

$('form.submit').on('submit', function(e) {
	e.preventDefault();

	var answers = [];

	$('form.submit input, form.submit textarea').each(function() {
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

			if(data.correct) {
				for(var i = 0; i < data.correct.length; i++) {
					if(data.correct[i]) {
						$(`[name="q${ i + 1 }"]`).removeClass('incorrect').addClass('correct');
					}

					else {
						$(`[name="q${ i + 1 }"]`).removeClass('correct').addClass('incorrect');
					}
				}
			}
		},
		error: function(xhr, err) {
			alert('see console for error');
			console.log(err);     
		}
	});
});

function escapeHTML(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function out(text) {
	$('.stdout').html($('.stdout').text() + escapeHTML(text));
	$('.stdout')[0].scrollTop = $('.stdout')[0].scrollHeight;
}

var socket = io.connect('/', { 'sync disconnect on unload': true });

var prefile = prefile || 'blank';

socket.emit('cmdline', prefile);

$('.stdout').html('');
$('.stderr').html('');

socket.on('stdout', function(data) {
	out(data);
});

socket.on('stderr', function(data) {
	console.log(data);
	out(data);
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
	out(data + '\n');
	socket.emit('cmdline', prefile);
});

$(document).ready(function () {
	var MastStory = function () {
		$('[id^="p"]').each(function() {
			$(this).addClass('hidden');
		});
		$('[id^="w"]').on('click', function() {
			var n = $(this).attr('id').replace('w', '');
			$('#p' + n).toggleClass('hidden');
		});
	};
	MastStory();

	if($('form.submit input[type="text"]').length == 0) {
		$('.eve-container').remove();
		$('form.submit').submit();
		$('form.submit').find('input[type="submit"], button').remove();
	}
});