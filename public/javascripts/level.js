$('form').on('submit', function(e) {
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