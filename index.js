var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var mongoUrl = 'mongodb://admin:admin@ds027505.mongolab.com:27505/mongo-course';

var app = require('./app');

MongoClient.connect(mongoUrl, function(err, db) {
	if(err) throw err;
	
	app.locals.db = db;
	
	var server = app.listen(3000, function() {
	  console.log('siamo partiti sulla porta', 
			   server.address().port);
	});
});