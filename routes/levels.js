var express = require('express');
var router = express.Router();
var User = require('../auth/models/User');

function rough(str) {
	return str.trim().toLowerCase().replace(/[^a-z0-9.]/g, '');
}

function regEscape(str) {
	return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
}

var answers = {
	1: function(str) {
		var correct = 'Hello World!';
		return rough(str) === rough(correct);
	},
	2: function(str) {
		var correct = 'Eve\'s Family Bakery, 155 Main St, Bihar 84101, INDIA';
		return rough(str) === rough(correct);
	},
	3: function(str) {
		var correct = 'Float\nInteger\nString\nFloat\nString';
		return rough(str) === rough(correct);
	},
	4: function(str) {
		var prev = 'Welcome to the bakery, ';
		var next = '';
		//                                              vv    matches any string input
		var expr = new RegExp(regEscape(rough(prev)) + '.*\.' + regEscape(rough(next)), 'g');
		return expr.test(rough(str));
	},
	5: function(str) {
		var correct = '112.5';
		// rough function removes decimal point
		return str.trim() === correct.trim() || str.trim() === ('$' + correct.trim());
	},
	6: function(str) {
		var prev = 'Welcome to the bakery ';
		var next = 'What would you like to order today?';
		//                                              vv    matches any string input
		var expr = new RegExp(regEscape(rough(prev)) + '.*\.' + regEscape(rough(next)), 'g');
		return expr.test(rough(str));
	},
	7: function(str) {
		var correct = 'True\nFalse\nTrue';
		// rough function removes decimal point
		return str.trim() === correct.trim();
	},
	8: function(str) {
		var prev = '';
		var next = 'Here is a free toffee! Have a nice day!';
		//                                              vv    matches any string input
		var expr = new RegExp(regEscape(rough(prev)) + '.*\.' + regEscape(rough(next)), 'g');
		return expr.test(rough(str));
	},
	9: function(str) {
		var correct = 'Eve is not free at 13';
		return rough(str) === rough(correct);
	},
	10: function(str) {
		var correct = 'Flour';
		return rough(str) === rough(correct);
	},
	11: function(str) {
		var correct = 'not prime';
		return rough(str) === rough(correct);
	},
	12: function(str) {
		var correct = 'butter biscuits';
		return rough(str) === rough(correct);
	},
};

function checkCorrect(level, answer) {
	console.log('Input start' + answer + 'Input end');
	if(!answers[level]) return false;
	return answers[level](answer);
}

router.get('/:level', function(req, res) {
	if(req.isAuthenticated()) {
		res.render('level' + req.params.level, {
			user: req.user.username
		});
	} else {
		res.redirect('/');
	}
});

router.post('/:level', function(req, res, next) {
	try {
		if(req.isAuthenticated()) {
			if(checkCorrect(req.params.level, req.body.answer)) {

				var win = function() { res.send({ message: 'win' }) };

				var dealWith = function(err) {
					console.log(err);
					res.send(err);
				}

				User.findById(req.user._id, function(err, user) {
					if(err) {
						console.log(err);
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
									console.log(err);
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
		} else {
			res.send({ message: 'logout' });
		}
	} catch(e) {
		console.log(e);
		res.send({ message: 'error' });
	}
});

module.exports = router;
