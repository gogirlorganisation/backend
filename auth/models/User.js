var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var schema = new Schema({
	id: String,
	username: String,
	displayName: String,
	password: String,
	email: String,
	points: Number,
	trainingPoints: Number,
	solvedLevels: Object,
	solvedTrainingLevels: Object,
	alsetUser: Boolean,
	passwordResetToken: String,
	passwordResetTime: Number
});

schema.plugin(findOrCreate);

module.exports = mongoose.model('User', schema);