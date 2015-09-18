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
  	var yelpFetch;

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
	    yelpFetch = require('../libs/yelpdriver');
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
		return require('../controllers/yelpParentFetch').fetchYelp(null, function (err, success) {
			expect(err).not.to.be.null;
			expect(err).to.equal('Missing query params to request Yelp results');
			expect(success).to.be.undefined;
			done();
		});
	})

	it('will run the yelpFetch Command inside of the yelpChildCommand as called by the yelpParent command', function (done) {
		return require('../controllers/yelpParentFetch').fetchYelp({
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
		return yelpFetch.getAll({
					location: {lat: 39.192618, lng: -94.937325},
					filterType: 'chinese',
					distance: 1000
				}, function (err, output){
					expect(err).to.be.null;
					expect(output.total).to.be.equal(0);
					done();
				});
	});

	it('is able to make google api place request', function (done) {
		var placesDriver = require('../libs/placesdriver');
		return placesDriver.getPlace({
			name: "Los Angeles Public Library Downtown",
			location: {lat: 34.052234, lng: -118.243685}
		}, function (err, output) {
			expect(err).to.be.null;
			//address for the LA public library
			expect(output.address).to.be.equal('630 W 5th St, Los Angeles, CA 90071, United States');
			done();
		});
	});

	// hit api limit;
	// it('is able to connect to the gracenote API and pull a list of movies.', function (done) {
	// 	var graceNote = require('../libs/gracenoteDriver');
	// 	var queryObj = {
	// 		date: '2015-09-07',
	// 		location: {lat: 34.052234, lng: -118.243685}
	// 	}
	// 	graceNote.getMovieTimes(queryObj, function (err, result) {
	// 		expect(err).to.be.null;
	// 		expect(result).to.be.an('object');
	// 		expect(result).to.include.keys('title');
	// 		expect(result.showtimes).to.have.length;
	// 		expect(result.showtimes[0]).to.include.keys('location');
	// 		// console.log(result);
	// 		done();
	// 	});
	// });

	//ARGGGHHH I hit my api limit rate.
	// it('is able to utilize the eventParentFetch to input the location and set events to movies.', function (done){
	// 	var sampleInput = {
	// 		filterType: 'movie',
	// 		location: {
	// 			lat: 34.052234,
	// 			lng: -118.243685
	// 		}
	// 	};
	// 	require('../controllers/eventParentFetch')(sampleInput, function (err, result) {
	// 		if (err) return console.log(err);
	// 		console.log(result);
	// 		expect(err).to.be.null;
	// 		done();
	// 	})
	// });

	it('test the sorting of popularity of the events results', function (){
		var songKick = require('../libs/songkickdriver.js');
		var sampleResults = {
			event : [
			{popularity: 0.0654},{popularity: 0.25},{popularity: 9.65},
			{popularity: 0.0544},{popularity: 0.3678},{popularity: 0.3675}
			]
		};
		var finalSortedArr = songKick.sortPopularEvent(sampleResults);
		expect(finalSortedArr).to.have.length;
		expect(finalSortedArr[0].popularity).to.equal(9.65);
		expect(finalSortedArr[5].popularity).to.equal(0.0544);
	});

	it('test our ability to make a request on the metro Area', function (done) {
		var songKick = require('../libs/songkickdriver.js');
		var metroAreaId = 2846; //seattle metro area
		return songKick.getEventCalendar(metroAreaId, function (err, successData) {
			expect(err).to.be.null;
			expect(successData.event).to.have.length;
			expect(successData.event).to.be.an('array');
			return done();
		});
	});


	it('is able to make a request to songkick, make an additional request with a metro id and then give us a list of events', function (done) {
		var songKick = require('../libs/songkickdriver.js');
		// sample location object
		var inputParams = {
			location: {
				lat: 47.6097,
				lng: -122.3331
			}
		};
		return songKick.getEventResult(inputParams, function (err, successData) {
			expect(err).to.be.null;
			if (err) return console.error(err);
			expect(successData.event).to.have.length;
			expect(successData.event[0]).to.include.keys('displayName');
			expect(successData.event[0]).to.include.keys('venue');
			return done();
		})
	});

	it('will run the getEventResults Command inside of the eventChildCommand as called by the eventParent command.', function (done) {
		return require('../controllers/eventParentFetch').fetchEvent({
			filterType: 'event',
			location: {	lat: 30.2500, lng: -97.7500 }
		}, function (err, success) {
			expect(err).to.be.null;
			if (err) return console.error(err);
			expect(success.pagelink).to.be.a('string');
			expect(success.rating).to.be.a('number');
			return done();
		});
	});

	it('do zoos exist in san diego?? ', function (done) {
		return require('../controllers/yelpParentFetch').fetchYelp({
					location: {
						lat: 32.842674,
						lng: -117.257767
					},
					filterType: 'zoos'
				}, function (err, success) {
					expect(err).to.be.null;
					expect(success).to.exist;
					expect(success).to.be.an('object');
					expect(success.category).to.equal('zoos');
					done();
				});
	});


	it('will run and receive all the results for all the drivers above.', function (done) {
		var dbResults = require('../controllers/aggregateDrivers');
		var userInfo = {
			act1: {
				filterType: 'zoos',
				location: {
					lat: 32.842674,
					lng: -117.257767,
				}
			},
			act2: {
				filterType: 'mexican',
				location: {
					lat: 32.842674,
					lng: -117.257767,
				}
			},
			act3: {
				filterType: 'event',
				location: {
					lat: 32.842674,
					lng: -117.257767,
				}
			}
		}
		dbResults(userInfo, function (err, finalResults) {
			expect(err).to.be.null;
			// console.log(finalResults);
			expect(finalResults).to.be.an('array');
			expect(finalResults.length).to.be.equal(3);
			expect(finalResults[0].category).to.be.equal('zoos');
			return done();
		});

	});


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


	//This driver isn't used, it's too slow for our purposes.
	// it('is able to make a request to the omdb and return a combined result', function (done) {
	// 	var omdbDriver = require('../libs/omdbdriver');
	// 	// omdbDriver.currentMovie = {};
	// 	expect(omdbDriver.currentMovie).to.be.empty;
	// 	return omdbDriver.getMovie({
	// 				t: 'Star Wars',
	// 				y: 1977,
	// 				r: 'json'
	// 			}, function (err, successObj) {
	// 				expect(err).to.be.null;
	// 				expect(omdbDriver.currentMovie).to.have.length;
	// 				expect(omdbDriver.currentMovie).to.include.keys('urlPoster');
	// 				done();
	// 			});
	// });

});