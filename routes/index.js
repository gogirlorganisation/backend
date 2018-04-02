var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('index');
});

router.get('/login', function(req, res) {
	res.render('login');
});

router.get('/signup', function(req, res) {
	res.render('signup');
});

router.get('/dashboard', function(req, res) {
	if(req.isAuthenticated()) {
		res.render('dash', {
			user: req.user.username,
			points: req.user.points
		});
	} else {
		res.redirect('/');
	}
});

module.exports = router;
