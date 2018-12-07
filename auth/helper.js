var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var User = require('./models/User');
var keys = require('./keys');

//var transport = nodemailer.createTransport(keys.email.login, keys.email.defaults);

var genResetToken = function(username, callback) {
	if(!username) {
		callback(false);
		return;
	}

	User.findOne({ username: username }, function(err, user) {
		if(err || !user) {
			callback(false);
			return;
		}

		var token = (1000 + Math.floor(Math.random() * 8999)).toString();
		console.log(token);

		user.passwordResetToken = token;
		user.passwordResetTime = Date.now() + (24 * 60 * 60 * 1000); // one day

		user.save(function(err) {

			if(err) callback(false);

			else {
				callback(true); return;
			}

			/*else {
				transport.sendMail({
					to: user.email,
					subject: 'The Girl Code',
					text: token + ' is your password reset token.'
				}, function(err) {
					if(err) {
						console.log(err);
						callback(false);
					}

					else callback(true);
				});
			}*/
		});
	});
};

var changePassword = function(username, token, password, callback) {
	if(!username || !token || !password) {
		callback(false);
		return;
	}

	User.findOne({ username: username, passwordResetToken: token }, function(err, user) {
		if(err || !user) {
			callback(false);
			return;
		}

		if(user.passwordResetTime < Date.now()) {
			callback('expired');
			return;
		}

		user.password = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);

		user.save(function(err) {
			if(err) callback(false);

			else callback('success');
		});
	});
};

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
	setAsAlsetUser: setAsAlsetUser,
	genResetToken: genResetToken,
	changePassword: changePassword
};