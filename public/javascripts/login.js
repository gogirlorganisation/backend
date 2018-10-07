$('form').on('submit', function(e) {
	e.preventDefault();

	$.ajax({
		url: $(this).attr('action'),
		type: $(this).attr('method'),
		data: $(this).serialize(),
		success: function(data) {
			if(data.message == 'success')
				location.href = '/dashboard';
			else alert(data.message);
		},
		error: function(xhr, err) {
			console.log(err);     
		}
	});
});

$('.an-input').each(function(){
    $(this).on('blur', function(){
        if($(this).val().trim() != "") {
            $(this).addClass('hasvalue');
        }
        else {
            $(this).removeClass('hasvalue');
        }
    })    
});