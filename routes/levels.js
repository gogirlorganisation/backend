var express = require('express');
var router = express.Router();
var User = require('../auth/models/User');

var answers = {
	1: '42',
	2: 'thequickbrownfox'
};

function checkCorrect(level, answer) {
	return answers[level] === answer;
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

router.post('/:level', function(req, res) {
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