var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BearSchema   = new Schema({
	tile: String,
	notes: String,
	due: Date

});

module.exports = mongoose.model('Todo', BearSchema);