var express = require('express');
var router = express.Router();
var User = require('../auth/models/User');
var levelHelper = require('./levelHelper');
var answers = require('./trainingLevels');

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
			levelHelper.checkTrainingCorrect(req.params.level, req.body.answer, function(isCorrect) {
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
