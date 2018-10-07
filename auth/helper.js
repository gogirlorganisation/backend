var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/User');
var bCrypt = require('bcrypt-nodejs');

var setUsername = function(oldUsername, newUsername, done) {
	User.findOne({ username: newUsername }, function(err, user) {
		if(err) throw err;

		else if(user) {
			done('Sorry, this username already exists.');
		}

		else {
			User.findOne({ username: oldUsername }, function(err, user) {
				if(err) throw err;

				else if(user) {
					user.username = newUsername;

					user.save(function(err) {
						if(err) throw err;

						done();
					})
				}

				else {
					done('no such user');
				}
			});
		}
	});
};

var setAsAlsetUser = function(username, done) {
	User.findOne({ username: username }, function(err, user) {
		if(err) done(err);

		else if(user) {
			user.alsetUser = true;

			user.save(function(err) {
				if(err) done(err);

				done('success');
			})
		}

		else {
			done('no such user');
		}
	})
}

module.exports = {
	setUsername: setUsername,
	setAsAlsetUser: setAsAlsetUser
};