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
		answers: ['8', '40', '3', '42', '2.0', '1.75', '1.75', '8.0', '9', '4.0', '2', '1', '0', '1', '2.2']
	},
	2: {
		type: 'cmdline',
		answers: ['45']
	},
	3: {
		type: 'cmdline',
		answers: ['integer', 'float', 'integer', 'float', 'integer', 'integer']
	},
	4: {
		type: 'cmdline',
		answers: ['49504'],
	},
	5: {
		type: 'compiler',
		answers: [
			{
				stdin: '',
				stdout: '7\nHello World!'
			}
		],
	},
	6: {
		type: 'cmdline',
		answers: [],
	},
	7: {
		type: 'compiler',
		defaultValue: 
'# this is a comment, everything in this line is ignored after this.\n\
\n\
bolts = 10\n\
screws = 2000.0\n\
heatSinks = 15\n\
metalSheets = 1000.23\n\
pens = 45\n\
thisIsASentence = "hello world"\n\
\n\
# print the value and then the type of all the items assigned above\n\
# keep that this is automated checking, so you need to print in the \n\
# specific order as given above.\n\
# Write code below this line:\n',
		answers: [
			{
				stdin: '',
				stdout: '10\n2000.0\n15\n1000.23\n45\nhello world'
			}
		],
	},
	8: {
		type: 'cmdline',
		answers: [
			'HelloHelloHello',
			'HelloHelloHelloHelloHello',
			'HelloWorld!HelloWorld!HelloWorld!HelloWorld!HelloWorld!',
			'lol',
			'4 / 2',
			'???',
			'Truth is always best',
			'Truth is best',
			'Truth is best'
		],
	},
	9: {
		type: 'cmdline',
		answers: [],
	},
	10: {
		type: 'compiler',
		answers: [
			{
				stdin: 'ada@aeproject.co',
				stdout: 'ada'
			},
			{
				stdin: 'japnit@aeproject.co',
				stdout: 'japnit'
			},
			{
				stdin: 'webmaster@aeproject.co',
				stdout: 'webmaster'
			}
		],
	},
	11: {
		type: 'compiler',
		answers: [],
	},
	12: {
		type: 'compiler',
		defaultValue:
'#edit code from here:\n\
def multiply(a,b):\n\
  return(a*b)\n\
\n\
def divide():\n\
\n\
def remainder():\n\
\n\
def addition():\n\
\n\
def subtraction():\n\
\n\n\n\n\
#don’t edit code below this\n\
num1 = int(input())\n\
num2 = int(input())\n\
print(multiply(num1, num2))\n\
print(divide(num1, num2))\n\
print(remainder(num1, num2))\n\
print(addition(num1, num2))\n\
print(subtraction(num1, num2))',
		answers: [
			{
				stdin: '30\n20\n',
				stdout: '600\n1.5\n10\n50\n10'
			},
			{
				stdin: '5000\n20\n',
				stdout: '100000\n250.0\n0\n5020\n4980'
			}
		],
	},
	13: {
		type: 'cmdline',
		answers: [],
	},
	14: {
		type: 'cmdline',
		answers: []
	},
	15: {
		type: 'compiler',
		answers: [
			{
				stdin: '\n',
				stdout: 'what company do you prefer from Apple, Samsung and Google? If you don’t like any, press enter.\nYou get no phone. :/'
			},
			{
				stdin: 'Google\n',
				stdout: 'what company do you prefer from Apple, Samsung and Google? If you don’t like any, press enter.\nYou get a Google Pixel'
			},
			{
				stdin: 'Samsung\n',
				stdout: 'what company do you prefer from Apple, Samsung and Google? If you don’t like any, press enter.\nYou get a Galaxy S8'
			},
			{
				stdin: 'Apple',
				stdout: 'what company do you prefer from Apple, Samsung and Google? If you don’t like any, press enter.\nYou get an iPhone'
			}
		]
	},
	16: {
		type: 'compiler',
		answers: [
			{
				stdin: '352500\n11\n',
				stdout: '5'
			},
			{
				stdin: '2965000\n42\n',
				stdout: '42'
			},
			{
				stdin: '4864500\n30\n',
				stdout: '30'
			}
		],
		defaultValue:
'surplusMoney = input()\n\
emptyDesks = input()\n\
salaryOfProgrammer = 70500\n\n\n\
#write code from here:\n\n\n'
	},
	17: {
		type: 'cmdline',
		answers: []
	},
	18: {
		type: 'cmdline',
		answers: []
	}
};

router.get('/:level', function(req, res) {
	if(req.isAuthenticated()) {

		if(answers[req.params.level]) {
			var nextLevel = parseInt(req.params.level) + 1;
			var defaultValue = answers[req.params.level].defaultValue || '# Code here!\n';
			res.render(answers[req.params.level].type, {
				user: req.user.username,
				nextLevel: nextLevel,
				partials: {
					levelText: 'levels/' + req.params.level
				},
				defaultValue: defaultValue
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
