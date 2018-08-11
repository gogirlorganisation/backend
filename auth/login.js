var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
	passport.use('login', new LocalStrategy({
		passReqToCallback: true
	}, function(req, username, password, done) {
		User.findOne({ username: username },
			function(err, user) {
				if(err) {
					return done(err);
				}

				if(!user) {
					return done(null, false, { message: 'The specified user does not exist.' });
				}

				if(!bCrypt.compareSync(password, user.password)) {
					return done(null, false, { message: 'You have entered an incorrect password. Try again.' });
				}

				return done(null, user, { message: 'success' });
			}
		);
	}));
};