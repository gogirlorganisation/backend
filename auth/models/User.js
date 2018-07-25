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
	solvedLevels: Object
});

schema.plugin(findOrCreate);

module.exports = mongoose.model('User', schema);