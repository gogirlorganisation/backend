var bar = $('.progress');

var points = Number(bar.attr('data-points')),
	max = Number(bar.attr('data-max'));

bar.css('width', (100*points/max) + '%');