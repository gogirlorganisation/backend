var User = require('./models/User');
var login = require('./login');
var signup = require('./signup');
var google = require('./google');
var facebook = require('./facebook');

// todo: add condition for production

// db url
var server_uri = 'mongodb://mongo:27017/thegirlcode';

// express session key
var secret_key = 'tellmeoladyshallicomeshalliringthebell';

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	login(passport);
	signup(passport);
	google(passport);
	facebook(passport);

	return {
		url: server_uri,
		key: secret_key
	};
};
