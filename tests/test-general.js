/**
* Using chai/mocha to do tests, a little bit easier to abstract out the BDD flow than jasmine
* @author scneptune
* @since v.0.0.0
**/
'use strict';

var chai = require('chai'),
	expect = chai.expect,
	assert = chai.assert;
	chai.config.includeStack = true;
	var sinon = require('sinon');
	var sinonChai = require("sinon-chai");
	chai.should();
	chai.use(sinonChai);

//libs for mockingexit

var express = require('express'),
	request = require('supertest'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	strawman = require('strawman'),
	mongoSession = require('connect-mongo')(session),
	fs = require('fs');
var http = require('http');
var https = require('https');

var MongoClient = require('mongodb').MongoClient;


describe('Basic module testing function', function () {
	var db;
  	var StoreStub;

	beforeEach(function() {
	    db = strawman({
	      collection: { argumentNames: ['collection'], chain: true },
	      ensureIndex: { argumentNames: ['index', 'options', 'callback'] },
	      findOne: { argumentNames: ['query', 'callback'] },
	      remove: { argumentNames: ['query', 'callback'] },
	      update: { argumentNames: ['query', 'update', 'options', 'callback' ] }
	    });

	    MongoClient.connect = function(uri, options, callback) {
	      process.nextTick(function() { callback(null, db); });
	    };

	    StoreStub = function() {};
	    StoreStub.prototype = { connectMongoDB: 1 };
  	});

	it('connects up to the mongo database', function () {
		var mongoUrl = 'mongodb://localhost:27017/dateapp';
		MongoClient.connect(mongoUrl, function (err, db) {
			should.equal(null, err);
			console.log('Made a valid connection to the mongo database');
			db.close();
		});

	});

	it('run yelpFetch and see if the results have length and the results to contain a businesses key', function (done) {
		var yelpFetch = require('../libs/yelpDriver');
		yelpFetch.getAll({
					location: {lat: 34.052234, lng: -118.243685},
					filterType: 'newamerican'
				}, output);
		function output (err, data) {
			// expect(data).to.be
			expect(data).to.include.keys('businesses');
			expect(data.businesses).to.have.length;
			done();
		}

	});

	it('will throw an error when running the parent Yelp process without the query params.', function (done) {
		return require('../libs/yelpParentFetch')(null, function (err, success) {
			expect(err).not.to.be.null;
			expect(err).to.equal('Missing query params to request Yelp results');
			expect(success).to.be.undefined;
			done();
		});
	})

	it('will run the yelpFetch Command inside of the yelpChildCommand as called by the yelpParent command', function (done) {
		return require('../libs/yelpParentFetch')({
					location: {lat: 34.052234, lng: -118.243685},
					filterType: 'newamerican'
				}, function (err, success) {
					expect(err).to.be.null;
					expect(success).to.exist;
					expect(success).to.be.an('object');
					done();
				});
	});

	it('is able to determine when a experience does not exist in the area nearby', function (done) {
		var yelpFetch = require('../libs/yelpDriver');
		return yelpFetch.getAll({
					location: {lat: 39.192618, lng: -94.937325},
					filterType: 'chinese',
					distance: 4000
				}, function (err, output){
					expect(err).to.be.null;
					expect(output.total).to.be.equal(0);

					done();
				});
	})

	it('gets a 200 response on load the index', function () {
		var app = require('../app.js');
		var agent = request.agent(app);
		agent.get('/').expect(200);
	});
	// it('soon as you arrive on the first page, your session id is set', function (done) {
	// 	var app = express();
	// 	//note must have a local mongo instance for this to run.
	// 	var SessionStore = mongoSession({ session: {Store: StoreStub}});
	// 	var session = new SessionStore({ collection: 'users'});

	// 	app.use(cookieParser());
	// 	app.use(session({secret: "test", store: store}));
	// 	app.get('/', function (req, res) {
	// 		req.session.test = true;
	// 		res.end();
	// 	});

	// 	var agent = request.agent(app);
	// 	agent.get('/').expect(200, function (res, done) {
	// 		if (res.session) {
	//			expect(req.session.test).to.be.true;
	// 			done('sucessful');
	// 		}
	// 	});

	// });

});