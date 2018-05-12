$('.show-submenu').on('mouseenter', function() {
	$('.submenu').addClass('visible');
});

var stay = false;

$('.show-submenu').on('mouseleave', function() {
	setTimeout(function() {
		if(!stay)
			$('.submenu').removeClass('visible');
	});
});

$('.submenu').on('mouseenter', function() {
	stay = true;
});

$('.submenu').on('mouseleave', function() {
	stay = false;
	$(this).removeClass('visible');
})