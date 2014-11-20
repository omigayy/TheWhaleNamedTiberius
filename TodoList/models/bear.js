var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var TaskSchema   = new Schema({
	todo: String,
	when: String,
	instructions: String,
	tag: String
});

module.exports = mongoose.model('Task', TaskSchema);

