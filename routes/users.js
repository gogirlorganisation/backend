var express = require('express');
var router = express.Router();

module.exports = function(passport) {
	router.post('/signup', function(req, res, next) {
		passport.authenticate('signup', function(err, user, info) {
			if(err) res.send(err);
			else if(info) res.send(info);
			else res.send({ message: 'idk' })
		})(req, res, next);
	});

	router.post('/login', function(req, res, next) {
		passport.authenticate('login', function(err, user, info) {
			if(err) res.send(err);
			else if(user) {
				req.login(user, function(err) {
					if(err) res.send(err);
					else if(info) res.send(info);
					else res.send({ message: 'idk' });
				})
			}
			else res.send({ message: 'no_user' });
		})(req, res, next);
	});

	/*router.post('/login', passport.authenticate('login', {
		successRedirect: '/users/check',
		failureRedirect: '/users/check'
	}));*/

	router.all('/check', function(req, res, next) {
		if(req.user) {
			res.send(req.user.username);
		} else {
			res.send('null');
		}
	});

	router.all('/logout', function(req, res, next) {
		req.logout();

		res.redirect('/');
	});

	return router;
};
