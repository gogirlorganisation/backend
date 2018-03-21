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
					return done(null, false, { message: 'no_user' });
				}

				if(!bCrypt.compareSync(password, user.password)) {
					return done(null, false, { message: 'invalid_password' });
				}

				return done(null, user, { message: 'success' });
			}
		);
	}));
};