var FacebookStrategy = require('passport-facebook');
var User = require('./models/User');
var bCrypt = require('bcrypt-nodejs');
var keys = require('./keys');

var callbackURL = 'https://localhost/users/facebook/callback';

if(process.env.NODE_ENV === 'production')
	callbackURL = 'https://learn.thegirlcode.co/users/facebook/callback';

module.exports = function(passport) {
	passport.use('facebook', new FacebookStrategy({
		clientID: keys.facebookID,
		clientSecret: keys.facebookSecret,
		callbackURL: callbackURL,
		profileFields: ['id', 'emails', 'name']
	}, function(accessToken, refreshToken, profile, done) {
		if(!profile.emails || !profile.emails[0] || !profile.emails[0].value)
			return done(null, false, { message: 'Your Facebook ID is not associated with an email account. Please use another way to sign in.' });
		var email = profile.emails[0].value;
		User.findOne({
			email: email
		}, function(err, user) {
			if(err) throw err;

			else if(user) {
				return done(null, user, { message: 'success' });
			}

			else {
				var newUser = new User();

				newUser.username = email;
				newUser.email = email;
				newUser.points = 0;
				newUser.trainingPoints = 0;
				newUser.solvedLevels = {};
				newUser.solvedTrainingLevels = {};

				newUser.save(function(err) {
					if(err) throw err;

					return done(null, newUser, { message: 'success' });
				});
			}
		});
	}))
};