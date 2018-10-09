var express = require('express');
var router = express.Router();
var User = require('../auth/models/User');
var levelHelper = require('./levelHelper');

/*

compiler answer format: array, consisting of objects, each comprising a test case.
Testcase consists of input string (stdin) and expected output (stdout).
Every print() statement is followed by a newline (\n).
Every input() to the program is followed by a newline as well.

cmdline answer format: array of strings, answers[i] is the answer to textbox q_i_.

*/

var answers = {
	0: {
		type: 'cmdline',
		answers: []
	},
	1: {
		type: 'cmdline',
		answers: ['test123', 'test234']
	},
	2: {
		type: 'compiler',
		answers: [
			{
				stdin: '',
				stdout: '155 Main St, Delhi 84101, INDIA\n'
			}
		],
	},
	3: {
		type: 'compiler',
		answers: [
			{
				stdin: '',
				stdout: 'Float\nInteger\nString\nFloat\nString\n'
			}
		],
	},
	4: {
		type: 'compiler',
		answers: [
			{
				stdin: 'Kevin',
				stdout: 'Welcome to the bakery,\nKevin\n'
			},
			{
				stdin: 'Jake Peralta',
				stdout: 'Welcome to the bakery,\nJake Peralta\n'
			}
		],
	},
	5: {
		type: 'compiler',
		answers: [
			{
				stdin: '',
				stdout: '112.5\n'
			}
		],
	},
	6: {
		type: 'compiler',
		answers: [
			{
				stdin: 'Japnit',
				stdout: 'Welcome to the bakery Japnit! What would you like to order today?\n'
			},
			{
				stdin: 'Dhimant',
				stdout: 'Welcome to the bakery Dhimant! What would you like to order today?\n'
			}
		],
	},
	7: {
		type: 'compiler',
		answers: [
			{
				stdin: '',
				stdout: 'True\nFalse\nTrue\n'
			}
		],
	},
	8: {
		type: 'compiler',
		answers: [
			{
				stdin: '42',
				stdout: 'Here is a free toffee! Have a nice day!\n'
			},
			{
				stdin: '43',
				stdout: 'Have a nice day!\n'
			}
		],
	},
	9: {
		type: 'compiler',
		answers: [
			{
				stdin: '11',
				stdout: 'Eve is free at 11\n'
			},
			{
				type: 'compiler',
				stdin: '23',
				stdout: 'Eve is free at 23\n'
			},
			{
				stdin: '14',
				stdout: 'Eve is not free at 14\n'
			}
		],
	},
	10: {
		type: 'compiler',
		answers: [
			{
				stdin: '',
				stdout: 'Flour\n'
			}
		],
	},
	11: {
		type: 'compiler',
		answers: [
			{
				stdin: '',
				stdout: '96\n'
			}
		],
	},
	12: {
		type: 'compiler',
		answers: [
			{
				stdin: '',
				stdout: 'Dark Chocolate\nVanilla Cupcakes\n'
			}
		],
	},
	13: {
		type: 'compiler',
		answers: [
			{
				stdin: '',
				stdout: 'not prime\n'
			}
		],
	}
};

router.get('/:level', function(req, res) {
	if(req.isAuthenticated()) {

		if(answers[req.params.level]) {
			var nextLevel = parseInt(req.params.level) + 1;
			res.render(answers[req.params.level].type, {
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
				if(isCorrect.indexOf(false) < 0) {
					var win = function() { 
						res.send({ message: 'win', correct: isCorrect });

						if(req.user.alsetUser) {
							var params = {
								user: req.user.username,
								level: req.params.level,
								date: Date.now(),
								correct: isCorrect
							};

							if(answers[req.params.level].type == 'compiler')
								params.answer = req.body.answer;

							levelHelper.sendToAlset(params);
						}
					};

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
					res.send({ message: 'lose', correct: isCorrect });

					if(req.user.alsetUser) {
						var params = {
							user: req.user.username,
							level: req.params.level,
							date: Date.now(),
							correct: isCorrect
						};

						if(answers[req.params.level].type == 'compiler')
							params.answer = req.body.answer;

						levelHelper.sendToAlset(params);
					}
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
