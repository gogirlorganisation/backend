var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('./models/User');
var bCrypt = require('bcrypt-nodejs');

var callbackURL = 'http://localhost:3000/users/google/callback';

if(process.env.NODE_ENV === 'production')
	callbackURL = 'http://learn.thegirlcode.co/users/google/callback';

module.exports = function(passport) {
	passport.use('google', new GoogleStrategy({
		clientID: '***REMOVED***',
		clientSecret: '***REMOVED***',
		callbackURL: callbackURL
	}, function(accessToken, refreshToken, profile, done) {
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
				newUser.solvedLevels = 0;

				newUser.save(function(err) {
					if(err) throw err;

					return done(null, newUser, { message: 'success' });
				});
			}
		})
	}))
};