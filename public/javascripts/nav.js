function find(x) {
	return document.querySelector(x);
}

find('header.navbar .hamburger').addEventListener('click', function(e) {
	find('header.navbar .hamburger').classList.toggle('close');
	find('header.navbar nav').classList.toggle('close');
});