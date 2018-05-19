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
		var correct = 'Welcome to the bakery, ';
		//                                                 vv    matches any string input
		var expr = new RegExp(regEscape(rough(correct)) + '.*\.', 'g');
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
		var expr = new RegExp(regEscape(rough(prev)) + '.*\.' + rough(next), 'g');
		return expr.test(rough(str));
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
	if(req.isAuthenticated()) {
		if(checkCorrect(req.params.level, req.body.answer)) {

			var win = function() { res.send({ message: 'win' }) };

			User.findById(req.user._id, function(err, user) {
				if(err) res.send(err);
				else {
					var solvedLevels = user.solvedLevels || {};

					// check if user has already solved this level before
					if(!solvedLevels[req.params.level]) {
						solvedLevels[req.params.level] = true;
						var score = 0;

						// calculate score based on previously solved levels
						for(var level in solvedLevels) {
							if(solvedLevels[level] == true) score += 10;
						}

						User.findByIdAndUpdate(req.user._id, { points: score, solvedLevels: solvedLevels }, function(err, user) {
							if(err) res.send(err);
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
});

module.exports = router;