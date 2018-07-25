var GoogleStrategy = require('passport-google-oauth20').Strategy;
var User = require('./models/User');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
	passport.use('google', new GoogleStrategy({
		clientID: '263339810522-30u8oe75vteqmq50kmmj2rqbcerf6aok.apps.googleusercontent.com',
		clientSecret: 'wxunTktEBjLN9aYk1nZg-W3Q',
		callbackURL: 'http://localhost:3000/users/google/callback'
	}, function(accessToken, refreshToken, profile, done) {
		var email = profile.emails[0].value;
		User.findOne({
			email: email
		}, function(err, user) {
			console.log('============IN GOOGLE AUTHENTICATION');
			if(err) throw err;

			else if(user) {
				console.log('===========FOUND USER');
				console.log(user);
				return done(null, user, { message: 'success' });
			}

			else {
				var newUser = new User();

				newUser.username = email;
				newUser.email = email;
				newUser.displayName = profile.displayName;
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