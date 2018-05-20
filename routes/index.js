var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.render('index');
});

router.get('/workshops', function(req, res) {
	res.render('workshops');
});

router.get('/about', function(req, res) {
	res.render('about');
});

router.get('/course', function(req, res) {
	res.render('course');
});

router.get('/login', function(req, res) {
	res.render('login');
});

router.get('/signup', function(req, res) {
	res.render('signup');
});

router.get('/dashboard', function(req, res) {
	if(req.isAuthenticated()) {
		var levels = req.user.solvedLevels;

		var nextLevel = Object.keys(levels).length + 1;

		res.render('dash', {
			user: req.user.username,
			points: Math.floor(req.user.points),
			nextLevel: nextLevel
		});
	} else {
		res.redirect('/');
	}
});

module.exports = router;
