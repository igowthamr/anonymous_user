// Module dependencies.
var express = require('express');
var routes = require('./routes');
var path = require('path');

var app = express();

var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');


var MongoClient = require('mongodb').MongoClient;
var db;
var url = 'mongodb://127.0.0.1:27017/xyz';
var collection = 'users';


MongoClient.connect(url, function(err, database) {
	if (err) throw err;
		db = database;
        console.log("Connected to db!");
        db.createCollection(collection, function(err, res) {
        if (err) throw err;
        console.log("Collection created!");
        //db.close();
  });
});



app.use(function(req, res, next) {
    req.db = db;
	next();
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: 'uwotm8'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(multer());

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

// routes
app.get('/', routes.createUser);
app.get('/details', routes.getUser);

app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
