var express = require('express');
var router = express.Router();

module.exports = function(passport) {
	router.post('/signup', function(req, res, next) {
		passport.authenticate('signup', function(err, user, info) {
			if(err) res.send(err);
			else if(info) res.send(info);
			else res.send({ message: 'Unknown error.' })
		})(req, res, next);
	});

	router.post('/login', function(req, res, next) {
		passport.authenticate('login', function(err, user, info) {
			if(err) res.send(err);
			else if(user) {
				req.login(user, function(err) {
					if(err) res.send(err);
					else if(info) res.send(info);
					else res.send({ message: 'Unknown error.' });
				})
			}
			else res.send({ message: 'The specified user does not exist.' });
		})(req, res, next);
	});

	router.all('/logout', function(req, res, next) {
		req.logout();

		res.redirect('/');
	});

	return router;
};
