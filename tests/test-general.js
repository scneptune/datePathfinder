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


describe('It should connect to a page', function () {
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

	it('run yelpFetch and see if the result has the distance attribute', function (done) {
		var yelpFetch = require('../libs/yelpDriver');
		var cb = sinon.spy();
		yelpFetch.getAll({
					location: {lat: 34.052234, lng: -118.243685},
					filterType: 'newamerican'
				}, cb)
			expect(cb).to.have.property("distance");
			done();
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
	// 			done('sucessful');
	// 		}
	// 	});

	// });

	it('gets a 200 response on load the index', function () {
		var app = require('../app.js');
		var agent = request.agent(app);
		agent.get('/').expect(200);
	});
});