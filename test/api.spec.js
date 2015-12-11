var app = require('../app');
var supertest = require('supertest');
var MongoClient = require('mongodb').MongoClient;
var expect = require('chai').expect;

describe('api tests', function() {
	var request;
	
	before(function(done) {
		MongoClient.connect('mongodb://localhost:27017/todos-test', function(err, db) {
			if(err) return done(err);
			
			app.locals.db = db;
			request = supertest(app);
			done();
		});
	});
	
	beforeEach(function(done) {
		app.locals.db.collection('todo').remove(done);
	});

	it('should retrieve an empty array of todos', function(done) {
		request.get('/todo').expect(200, [], done);
	});
	
	it('should create a new todo', function(done) {
		request.post('/todo')
			.send({ text: 'whatever' })
			.expect(201, done);
	});
	
	it('should retrieve one todo when one exists', function(done) {
		request.post('/todo')
			.send({ text: 'whatever' })
			.end(function(err) {
				if(err) return done(err);
				
				request.get('/todo')
					.expect(200)
					.end(function(err, res) {
						if(err) return done(err);
						
						expect(res.body).to.be.an.array;
						expect(res.body.length).to.equal(1);
						expect(res.body[0].text).to.equal('whatever');
						done();
					});
			});
	});

});