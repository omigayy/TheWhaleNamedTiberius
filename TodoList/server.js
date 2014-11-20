// server.js

// Base Setup
// ========================================================================

// call the packages we need
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname, 'views'));

// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');

var mongoose   = require('mongoose');
mongoose.connect('mongodb://project2:project2@ds053130.mongolab.com:53130/todo'); // connect to our database

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('yay!');
});

var Task = require('../TodoList/models/todo');


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080; // set our port

// Routes for our API
// ========================================================================
var router = express.Router();
// app.use(express.staticProvider(__dirname+'/'));

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
})

// test route to make sure everything is working (accessed at GET http://localhost:8080/api) 
router.get('/', function(req, res) {

	res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// on routes that end in /items
// -----------------------------------------------------------------------
router.route('/items')

	// create a to-do item (accessed at POST http://localhost:8080/api/items)
	.post(function(req, res) {
		console.log('in post');
		
		var task = new Task(); // create a new instance of the Task model
		task.todo = req.body.todo; // set what to do (comes from the request)
		task.when = req.body.when; // set when to do it
		task.instructions = req.body.instructions; //set any extra instuctions
		task.tag = req.body.tag; // set a tag/keyword for searching

		// save the item and check for errors
		console.log('new to-do item');
		task.save(function(err) {
			if (err)
				//console.log(err);
				res.send(err);
			
			res.json({ message: 'To-do item created!' });
		});
	})

	// get all the items (accessed at GET http://localhost:8080/api/items)
	.get(function(req, res) {
		Task.find(function(err, tasks) {
			if (err)
				res.send(err);

			res.json(tasks);
		});
	});

// // on routes that end in /items/:item_id
// // -------------------------------------------------------------------

router.route('/items/:item_id')

	// get the item with that id (accessed at http://localhost:8080/api/items/:item_id)
	.get(function(req,res) {
		Task.findById(req.params.item_id, function(err, task) {
			if (err)
				res.send(err);
			res.json(task);
		});
	})

	// update the item with this id (accessed at PUT http://localhost:8080/api/items/:item_id)
	.put(function(req, res) {

		// use our task model to find the item we want.
		Task.findById(req.params.item_id, function(err, task) {

			if(err)
				res.send(err);

			task.todo = req.body.todo; // update the items todo field
			task.when = req.body.when; // update when the item is due
			task.instructions = req.body.instructions; // update the 
			task.tag = req.body.tag; // update tag/keyword for searching

			// save the item
			task.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Item updated!' });
			});
		});
	})

	// delete the tag with this id (accessed at DELETE http://localhost:8080/api/items/:items_id)
	.delete(function(req, res) {
		Task.remove({
			_id: req.params.item_id
		}, function(err, task) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// on routes that end in /tasks/:name
// -------------------------------------------------------------------
router.route('/items/search/:tag')
	
	.get(function(req, res){
		console.log('in get');
		var tag = req.params.tag;
		Task.find({tag: {"$in" : [tag]}}, function(err, tasks) {
			if (err)
				res.send(err);

			console.log("Sending item back");
			res.json(tasks);
		});

		Task.count({ tag: tag }, function(err, count) {

			if (err)
				res.send(err);
			
			console.log('There are %d items(s) with the tag "' + tag + '"', count);
		});
	});
	// http://localhost:8080/api/items/537671662dc45be83d000001

// REGISTER OUR ROUTES------------------------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//START THE SERVER
// ========================================================================
app.listen(port);
console.log('Magic happens on port' + port);
