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
			stdout: 'Hello World\n'
		}
	],
	2: [
		{
			stdin: '',
			stdout: '155 Main St, Delhi 84101, INDIA\n'
		}
	],
	3: [
		{
			stdin: '',
			stdout: 'Float\nInteger\nString\nFloat\nString\n'
		}
	],
	4: [
		{
			stdin: 'Kevin',
			stdout: 'Welcome to the bakery,\nKevin\n'
		},
		{
			stdin: 'Jake Peralta',
			stdout: 'Welcome to the bakery,\nJake Peralta\n'
		}
	],
	5: [
		{
			stdin: '',
			stdout: '112.5\n'
		}
	],
	6: [
		{
			stdin: 'Japnit',
			stdout: 'Welcome to the bakery Japnit! What would you like to order today?\n'
		},
		{
			stdin: 'Dhimant',
			stdout: 'Welcome to the bakery Dhimant! What would you like to order today?\n'
		}
	],
	7: [
		{
			stdin: '',
			stdout: 'True\nFalse\nTrue\n'
		}
	],
	8: [
		{
			stdin: '42',
			stdout: 'Here is a free toffee! Have a nice day!\n'
		},
		{
			stdin: '43',
			stdout: 'Have a nice day!\n'
		}
	],
	9: [
		{
			stdin: '11',
			stdout: 'Eve is free at 11\n'
		},
		{
			stdin: '23',
			stdout: 'Eve is free at 23\n'
		},
		{
			stdin: '14',
			stdout: 'Eve is not free at 14\n'
		}
	],
	10: [
		{
			stdin: '',
			stdout: 'Flour\n'
		}
	],
	11: [
		{
			stdin: '',
			stdout: '96\n'
		}
	],
	12: [
		{
			stdin: '',
			stdout: 'Dark Chocolate\nVanilla Cupcakes\n'
		}
	],
	13: [
		{
			stdin: '',
			stdout: 'not prime\n'
		}
	],
};

router.get('/cmdtest', function(req, res) {
	if(req.isAuthenticated()) {
		res.render('cmdline');
	}
	else {
		res.redirect('/login');
	}
})

router.get('/:level', function(req, res) {
	if(req.isAuthenticated()) {

		if(answers[req.params.level]) {
			var nextLevel = parseInt(req.params.level) + 1;
			res.render('level', {
				user: req.user.username,
				nextLevel: nextLevel,
				partials: {
					levelText: 'levels/' + req.params.level
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
							var solvedLevels = user.solvedLevels || {};

							// check if user has already solved this level before
							if(!solvedLevels[req.params.level]) {
								solvedLevels[req.params.level] = true;
								var score = 0;

								// calculate score based on previously solved levels
								for(var level in solvedLevels) {
									if(solvedLevels[level] == true) score += (100/(Object.keys(answers).length));
								}

								User.findByIdAndUpdate(req.user._id, { points: score, solvedLevels: solvedLevels }, function(err, user) {
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
