// server.js

// Base Setup
// ========================================================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose   = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/restfulapi'); // connect to our database
mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database

//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function callback () {
  //console.log('yay!');
//});

var Bear = require('../Restful_API/models/bear');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080; // set our port

// Routes for our API
// ========================================================================
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api) 
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!'});
});

// more routes for our API will happen here
// on routes that end in /bears
// -----------------------------------------------------------------------
router.route('/bears')

	// create a bear (accessed at POST http://localhost:8080/api/bears)
	.post(function(req, res) {
		console.log('in post');
		
		var bear = new Bear(); // create a new instance of the Bear model
		bear.name = req.body.name; // set the bears name (comes from the request)

		// save the bear and check for errors
		bear.save(function(err) {
			if (err)
				res.send(err);
			
			res.json({ message: 'Bear created!' });
		});
	});

// REGISTER OUR ROUTES------------------------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//START THE SERVER
// ========================================================================
app.listen(port);
console.log('Magic happens on port' + port);
