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
			answer: $('form.compiler textarea').val()
		},
		success: function(data) {
			$('form.compiler button').prop('disabled', false);
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
			$('form.compiler button').prop('disabled', false);
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
	$('.stdout').html($('.stdout').html() + escapeHTML(text));
}

function err(text) {
	$('.stdout').html($('.stdout').html() + '<em>' + escapeHTML(text) + '</em>');
}

$('form.compiler button.submit').on('click', function(e) {
	e.preventDefault();

	$('form.compiler button').prop('disabled', true);

	$('form.submit').submit();
});

$('form.compiler button.run').on('click', function(e) {
	e.preventDefault();

	$('form.compiler button').prop('disabled', true);

	var socket = io.connect('/', { 'sync disconnect on unload': true });

	$('.stdout').html('');

	socket.emit('code', $('form.compiler').find('textarea').val());

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
		$('form.compiler button').prop('disabled', false);
	});
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
});