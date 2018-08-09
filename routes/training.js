var express = require('express');
var router = express.Router();
var User = require('../auth/models/User');
var levelHelper = require('./levelHelper');

/*

Answer format: array, consisting of objects, each comprising a test case.
Testcase consists of input string (stdin) and expected output (stdout).
Every print() statement is followed by a newline (\n).
Every input() to the program is followed by a newline as well.

*/

var answers = {
	1: [
		{
			stdin: '',
			stdout: '0 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181\n'
		}
	],
	2: [
		{
			stdin: 'coding',
			stdout: 'No, it\'s not a palindrome!\n'
		},
		{
			stdin: 'madam',
			stdout: 'Yes, it\'s a palindrome!\n'
		}
	],
	3: [
		{
			stdin: '150',
			stdout: '16'
		}
	],
	4: [
		{
			stdin: 'Kevin',
			stdout: 'What\'s your name?\nWelcome to the bakery,\nKevin\n'
		},
		{
			stdin: 'Jake Peralta',
			stdout: 'What\'s your name?\nWelcome to the bakery,\nJake Peralta\n'
		}
	],
	5: [
		{
			stdin: '',
			stdout: '112.5\n'
		}
	],
};

router.get('/:level', function(req, res) {
	if(req.isAuthenticated()) {

		if(answers[req.params.level]) {
			var nextLevel = parseInt(req.params.level) + 1;
			res.render('train', {
				user: req.user.username,
				nextLevel: nextLevel,
				partials: {
					levelText: 'training/' + req.params.level
				}
			});
		}
		else {
			res.redirect('/dashboard');
		}
	} else {
		res.redirect('/login');
	}
});

router.post('/:level', function(req, res, next) {
	try {
		if(req.isAuthenticated()) {
			levelHelper.checkCorrect(answers, req.params.level, req.body.answer, function(isCorrect) {
				if(isCorrect) {
					var win = function() { res.send({ message: 'win' }) };

					var dealWith = function(err) {
						console.error(err);
						res.send(err);
					}

					User.findById(req.user._id, function(err, user) {
						if(err) {
							console.error(err);
							res.send(err);
						}
						else {
							var solvedTrainingLevels = user.solvedTrainingLevels || {};

							// check if user has already solved this level before
							if(!solvedTrainingLevels[req.params.level]) {
								solvedTrainingLevels[req.params.level] = true;
								var score = 0;

								// calculate score based on previously solved levels
								for(var level in solvedTrainingLevels) {
									if(solvedTrainingLevels[level] == true) score += (100/(Object.keys(answers).length));
								}

								User.findByIdAndUpdate(req.user._id, { trainingPoints: score, solvedTrainingLevels: solvedTrainingLevels }, function(err, user) {
									if(err) {
										console.error(err);
										res.send(err);
									}
									else    win();
								});
							}
							else win();
						}
					});
				}
				else {
					res.send({ message: 'lose' });
				}
			});
		} else {
			res.send({ message: 'logout' });
		}
	} catch(e) {
		console.error(e);
		res.send({ message: 'error' });
	}
});

module.exports = router;
