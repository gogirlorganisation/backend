var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	res.redirect('/login');
})

router.get('/login', function(req, res) {
	if(!req.isAuthenticated()) {
		var error = (req.query.login == 'false') ? 'This account is not associated with an email address. Try signing up manually instead.' : '';
		res.render('login', {
			error: error
		});
	}
	else {
		res.redirect('/dashboard');
	}
});

router.get('/signup', function(req, res) {
	if(!req.isAuthenticated()) {
		res.render('signup');
	}
	else {
		res.redirect('/dashboard');
	}
});

router.get('/dashboard', function(req, res) {
	if(req.isAuthenticated()) {
		if(req.user.email === req.user.username) {
			// first login, have them set a username
			res.redirect('/users/new');
		}

		else {
			var levels = Object.keys(req.user.solvedLevels || {});

			var i = 0;

			// find first level which isn't on the solved list
			while(i <= levels.length && parseInt(levels[i-1]) === i) i++;

			res.render('dash', {
				user: req.user.displayName || req.user.username,
				points: Math.floor(req.user.points),
				nextLevel: i,
				levels: levels
			});
		}
	} else {
		res.redirect('/');
	}
});

router.get('/training', function(req, res) {
	if(req.isAuthenticated()) {
		if(req.user.email === req.user.username) {
			// first login, have them set a username
			res.redirect('/users/new');
		}

		else {
			var levels = Object.keys(req.user.solvedTrainingLevels || {});

			var i = 1;

			// find first level which isn't on the solved list
			while(i <= levels.length && parseInt(levels[i-1]) === i) i++;

			res.render('training', {
				user: req.user.displayName || req.user.username,
				points: Math.floor(req.user.trainingPoints) || 0,
				nextLevel: i || 1
			});
		}
	} else {
		res.redirect('/');
	}
});

module.exports = router;
