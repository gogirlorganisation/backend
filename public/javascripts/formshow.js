const loadForm = false;

function getFormURL(username, level) {
	username = encodeURIComponent(username);
	level = encodeURIComponent(level);
	return 'https://docs.google.com/forms/d/e/1FAIpQLSdZbEPIjXLdP-CBmSY_t-uR31MCQLp3Tf7IwFbak717FP0o9Q/viewform?usp=pp_url&entry.1864978506=' + username + '&entry.68643216=' + level;
}

$('a.next-link').on('click', function(e) {
	if(loadForm) {
		e.preventDefault();
		var link = $(this);
		window.open(getFormURL(username, level), '_blank');
		setTimeout(function() {
			location.href = link.attr('href');
		}, 1000);
	}
});
