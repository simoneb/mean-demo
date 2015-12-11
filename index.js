var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var bodyParser = require('body-parser');

var mongoUrl = 'mongodb://admin:admin@ds027505.mongolab.com:27505/mongo-course';

var app = express();

app.use(express.static('./public'));

app.use(bodyParser.json());

app.get('/todo', function(req, res, next) {
  var cursor = app.locals.db.collection('todo').find();
  
  cursor.toArray(function(err, todos) {
	  if(err) return next(err);
	  res.send(todos);
  });
});

app.post('/todo', function(req, res, next) {
	app.locals.db.collection('todo')
		.insert({ 
			completed: false, 
			text: req.body.text,
			createdDate: new Date()
		}, function(err, inserted){
			if(err) return next(err);
			res.status(201).send(inserted);
		});
});

app.put('/todo/:id', function(req, res, next) {
	app.locals.db.collection('todo')
		.update({ _id: new ObjectID(req.params.id)  },
				{ $set: { completed: req.body.completed } }, 
				function(err) { 
					if(err) return next(err);
					res.sendStatus(204);
				});
});

app.delete('/todo/:id', function(req, res, next) {
	app.locals.db.collection('todo')
		.remove({ _id: new ObjectID(req.params.id) }, 
				function(err) {
					if(err) return next(err);
					res.sendStatus(204);
				});
});

MongoClient.connect(mongoUrl, function(err, db) {
	if(err) throw err;
	
	app.locals.db = db;
	
	var server = app.listen(3000, function() {
	  console.log('siamo partiti sulla porta', 
			   server.address().port);
	});
	
});