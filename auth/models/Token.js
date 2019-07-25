var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate');

var schema = new Schema({
	id: String,
	token: String,
	entityName: String
});

schema.plugin(findOrCreate);

module.exports = mongoose.model('Token', schema);