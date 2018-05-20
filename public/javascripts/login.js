$('form').on('submit', function(e) {
	e.preventDefault();

	$.ajax({
		url: $(this).attr('action'),
		type: $(this).attr('method'),
		data: $(this).serialize(),
		success: function(data) {
			if(data.message == 'success')
				location.href = '/dashboard';
			else alert('Invalid details - try again.');
		},
		error: function(xhr, err) {
			console.log(err);     
		}
	});
});