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
//mongoose.connect('mongodb://localhost:27017/restfulapi'); // connect to our database
mongoose.connect('mongodb://project2:project2@ds053130.mongolab.com:53130/todo'); // connect to our database

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('yay!');
});

var Todo = require('../Bears/models/bear');

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

// on routes that end in /todos
// -----------------------------------------------------------------------
router.route('/todos')

	// create a todo (accessed at POST http://localhost:8080/api/todos)
	.post(function(req, res) {
		console.log('in post');
		
		var todo = new Todo(); // create a new instance of the todo model
		todo.name = req.body.name; // set the todo's title (comes from the request)

		// save the Todo and check for errors
		console.log('new todo');
		todo.save(function(err) {
			if (err)
				//console.log(err);
				res.send(err);
			
			res.json({ message: 'Todo created!' });
		});
	})

	// get all the todos (accessed at GET http://localhost:8080/api/todos)
	.get(function(req, res) {
		Todo.find(function(err, todos) {
			if (err)
				res.send(err);

			res.json(todos);
		});
	});

// // on routes that end in /todos/:todo_id
// // -------------------------------------------------------------------

router.route('/todos/:todo_id')

	// get the to with that id (accessed at http://localhost:8080/api/todos/:todo_id)
	.get(function(req,res) {
		Todo.findById(req.params.todo_id, function(err, todo) {
			if (err)
				res.send(err);
			res.json(todo);
		});
	})

	// update the todo with this id (accessed at PUT http://localhost:8080/api/todos/:todo_id)
	.put(function(req, res) {

		// use our todo model to find the todo we want.
		Todo.findById(req.params.todo_id, function(err, todo) {

			if(err)
				res.send(err);

			todo.name = req.body.name; // update the todos info

			// save the todo
			todo.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Todo updated!' });
			});
		});
	})

	// delete the todo with this id (accessed at DELETE http://localhost:8080/api/todos/:todo_id)
	.delete(function(req, res) {
		Todo.remove({
			_id: req.params.todo_id
		}, function(err, todo) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

// on routes that end in /todos/:name
// -------------------------------------------------------------------
router.route('/todos/search/:name')
	
	.get(function(req, res){
		console.log('in get');
		var name = req.params.name;
		Todo.find({name: {"$in" : [name]}}, function(err, todos) {
			if (err)
				res.send(err);
			console.log("Sending todo back");
			res.json(todos);
		//todo
		Todo.count({ name: name }, function(err, count) {
			if (err)
				res.send(err);
			
			console.log('There is %d todo(s) named '+name, count);
		});
	});
	// http://localhost:8080/api/todos/537671662dc45be83d000001

// REGISTER OUR ROUTES------------------------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//START THE SERVER
// ========================================================================
app.listen(port);
console.log('Magic happens on port' + port);
