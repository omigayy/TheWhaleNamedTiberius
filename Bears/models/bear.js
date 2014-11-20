var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

<<<<<<< HEAD
var TodoSchema   = new Schema({
	name: String

});

module.exports = mongoose.model('Todo', TodoSchema);
=======
var BearSchema   = new Schema({
	name: String
});

module.exports = mongoose.model('Bear', BearSchema);
>>>>>>> dd0a6cff2e3d1acd002db103b850c689720c1bdb
