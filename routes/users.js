var express = require('express');
var router = express.Router();
var auth = require('../auth/helper');

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

	router.get('/setalsetuser', function(req, res) {
		auth.setAsAlsetUser(req.user.username, function(result) {
			var message = '';

			if(result === 'success') {
				message = 'You have been successfully set as an ALSET user.';
			}

			else {
				message = 'There was a problem with setting you as an ALSET user:\n\n' + result;
			}

			res.redirect('/dashboard?message=' + encodeURIComponent(message));
		});
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
				auth.setUsername(req.user.username, req.body.username, function(err) {
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

	router.get('/password/reset', function(req, res) {
		res.render('pwreset', {
			status: req.query.status || ''
		});
	});

	router.post('/password/reset', function(req, res) {
		var username = req.body.username;

		if(!username) {
			res.redirect('/users/password/reset?status=blank');
			return;
		}

		auth.genResetToken(username, function(success) {
			if(success) {
				res.redirect('/users/password/change?username=' + username);
			}

			else {
				res.redirect('/users/password/reset?status=fail');
			}
		});
	});

	router.get('/password/change', function(req, res) {
		res.render('pwchange', {
			username: req.query.username,
			status: req.query.status || ''
		});
	});

	router.post('/password/change', function(req, res) {
		var username = req.body.username,
			token = req.body.token,
			password = req.body.password;

		if(!username) {
			res.redirect('/users/password/reset');
			return;
		}

		if(!password || !token) {
			res.redirect('/users/password/change?status=blank&username=' + username);
			return;
		}

		auth.changePassword(username, token, password, function(status) {
			if(status == 'success') {
				res.redirect('/login?reset=success');
			}

			else if(status == 'expired') {
				res.redirect('/users/password/reset?status=expired');
			}

			else {
				res.redirect('/users/password/change?status=fail');
			}
		});
	});

	return router;
};
