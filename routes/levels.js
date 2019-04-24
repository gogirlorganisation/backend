var express = require('express');
var router = express.Router();
var User = require('../auth/models/User');
var levelHelper = require('./levelHelper');
var answers = require('./answers');

router.get('/:level', function(req, res) {
	if(req.isAuthenticated()) {

		if(answers[req.params.level]) {
			var nextLevel = (parseInt(req.params.level) + 1).toString();
			if(parseInt(req.params.level) > 0)
				var prevLevel = (parseInt(req.params.level) - 1).toString();
			else
				var prevLevel = '';
			var defaultValue = answers[req.params.level].defaultValue || '# Code here!\n';
			res.render(answers[req.params.level].type, {
				user: req.user.username,
				nextLevel: nextLevel,
				prevLevel: prevLevel,
				currentLevel: req.params.level,
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
			levelHelper.checkCorrect(req.params.level, req.body.answer, function(isCorrect) {
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

					/*if(req.user.alsetUser) {
						var params = {
							user: req.user.username,
							level: req.params.level,
							date: Date.now(),
							correct: isCorrect
						};

						if(answers[req.params.level].type == 'compiler')
							params.answer = req.body.answer;

						levelHelper.sendToAlset(params);
					}*/
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
