var express = require('express');
var router = express.Router();
var login = require('../auth/helper');

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
			else res.send({ message: info.message });
		})(req, res, next);
	});

	router.all('/logout', function(req, res, next) {
		req.logout();

		res.redirect('/');
	});

	router.get('/google', passport.authenticate('google', {
		scope: ['email']
	}));

	router.get('/google/callback', passport.authenticate('google', {
		failureRedirect: '/login'
	}), function(req, res) {
		res.redirect('/dashboard');
	});

	router.get('/facebook', passport.authenticate('facebook', {
		scope: ['email']
	}));

	router.get('/facebook/callback', passport.authenticate('facebook', {
		failureRedirect: '/login?login=false'
	}), function(req, res) {
		res.redirect('/dashboard');
	});

	router.get('/new', function(req, res) {
		if(req.user && req.user.username === req.user.email) {
			res.render('newuser');
		}
		else {
			res.redirect('/')
		}
	});

	router.post('/new', function(req, res) {
		if(req.user && req.user.username === req.user.email) {
			if(req.body.username) {
				login.setUsername(req.user.username, req.body.username, function(err) {
					res.send({
						message: err || 'success'
					});
				});
			}

			else {
				res.redirect('/users/new');
			}
		}

		else {
			res.redirect('/');
		}
	});

	return router;
};
