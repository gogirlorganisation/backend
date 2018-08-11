var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');
var bCrypt = require('bcrypt-nodejs');

var count = 0;

module.exports = function(passport) {
	passport.use('signup', new LocalStrategy({
		passReqToCallback: true
	}, function(req, username, password, done) {
		var signup = function() {
			User.findOne({ username: username }, function(err, user) {
				if(err) {
					return done(err);
				}

				else if(user) {
					return done(null, user, { message: 'Sorry, this username is already taken.' });
				}

				else {
					var newUser = new User();

					newUser.username = username;
					newUser.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
					newUser.email = req.body.email;
					newUser.solvedLevels = {};
					newUser.points = 0;
					newUser.solvedTrainingLevels = {};
					newUser.trainingPoints = 0;

					newUser.save(function(err) {
						if(err) {
							throw err;
						}

						return done(null, newUser, { message: 'success' });
					});
				}
			});
		};

		process.nextTick(signup);
	}));
};