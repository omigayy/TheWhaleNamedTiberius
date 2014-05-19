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
	})

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	.get(function(req, res) {
		Bear.find(function(err, bears) {
			if (err)
				res.send(err);

			res.json(bears);
		});
	});

// // on routes that end in /bears/:bear_id
// // -------------------------------------------------------------------

router.route('/bears/:bear_id')

	// get the bear with that id (accessed at http://localhost:8080/api/bears/:bear_id)
	.get(function(req,res) {
		Bear.findById(req.params.bear_id, function(err, bear) {
			if (err)
				res.send(err);
			res.json(bear);
		});
	})

	// update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
	.put(function(req, res) {

		// use our bear model to find the bear we want.
		Bear.findById(req.params.bear_id, function(err, bear) {

			if(err)
				res.send(err);

			bear.name = req.body.name; // update the bears info

			// save the bear
			bear.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Bear updated!' });
			});
		});
	})

	// delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
	.delete(function(req, res) {
		Bear.remove({
			_id: req.params.bear_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// on routes that end in /bears/:name
// -------------------------------------------------------------------
router.route('/bears/search/:name')
	
	.get(function(req, res){
		console.log('in get');
		var name = req.params.name;
		Bear.find({name: name}, function(err, bears) {
			if (err)
				res.send(err);
			res.json(bears);
		});
		// bear.find({name: /+name+/i}, 'name', function(err, bears) {
		// 	if (err)
		// 		res.send(err);
		// 	res.json(bears);
		// });
	});
	// http://localhost:8080/api/bears/537671662dc45be83d000001

// REGISTER OUR ROUTES------------------------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//START THE SERVER
// ========================================================================
app.listen(port);
console.log('Magic happens on port' + port);
