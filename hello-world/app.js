// Evan Chessman
// app.js

var express = require('express');
var app = express();

app.get('hello.txt', function(req, res) {
	res.send('Hello World');
});

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.send(500, 'Something broke!');
});

var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app.use(bodyParser());
app.use(methodOverride());
app.use(app.router);

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// app.use(function(err, req, res, next){
//    logic
// });

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}

