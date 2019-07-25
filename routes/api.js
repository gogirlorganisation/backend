var express = require('express');
var router = express.Router();
var User = require('../auth/models/User');
var Token = require('../auth/models/Token');
var answers = require('./answers');

router.use(function(req, res, next) {
	var token = req.get('authorization');
	if(!token) res.status(401).send({
		status: 'err',
		data: 'Unauthenticated request.'
	});

	else Token.findOne({ token: token }, function(err, result) {
		if(err) {
			res.status(500).send({
				status: 'err',
				data: 'Could not authenticate token'
			});
		}

		else if(!result) res.status(401).send({
			status: 'err',
			data: 'Invalid token.'
		});

		else {
			req.entity = result.entityName || 'Anonymous';
			next();
		}
	});
});

router.get('/users', function(req, res, next) {
	User.find(
		{ alsetUser: true },
		{ password: false, passwordResetToken: false, passwordResetTime: false },
		function(err, users) {
			if(err) {
				res.status(500).send({
					status: 'err',
					user: req.entity,
					data: 'Could not get a list of users'
				});
			}

			else res.send({
				status: 'ok',
				user: req.entity,
				data: users
			});
		}
	)
});

router.get('/levels', function(req, res, next) {
	var levelNames = Object.keys(answers);
	var levels = [];

	var baseURL = req.get('host');

	for(var i = 0; i < levelNames.length; i++) {
		levels[i] = {
			playLevelUrl: baseURL + '/levels/' + levelNames[i],
			levelName: 'Level ' + levelNames[i],
			order: i+1
		}
	}

	res.send({
		status: 'ok',
		user: req.entity,
		data: levels
	});
});

module.exports = router;