$('form').on('submit', function(e) {
	e.preventDefault();

	$.ajax({
		url: $(this).attr('action'),
		type: $(this).attr('method'),
		data: $(this).serialize(),
		success: function(data) {
			if(data.message == 'success')
				location.href = '/secret';
			else alert(data.message);
		},
		error: function(xhr, err) {
			alert('see console for error');
			console.log(err);     
		}
	});
});