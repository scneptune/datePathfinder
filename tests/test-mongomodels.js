'use strict';
//mongo specific
var env = require('node-env-file');
 	//call in our secret env
 	env(__dirname + '/../.env');

var chai = require('chai'),
	expect = chai.expect,
	assert = chai.assert;
	chai.config.includeStack = true;
	var sinon = require('sinon');
	var sinonChai = require("sinon-chai");
	chai.should();
	chai.use(sinonChai);

var ActMatrices, Users, Acts;
var mongoose = require('mongoose');
var clearDB = require('mocha-mongoose')(process.env.MONGO_ADDRESSTEST, {noClear: true});


describe('Mongo/Mongoose related functionality', function () {
	before(function (done) {
		if (mongoose.connection.db) {
			return done();
		} else {
		mongoose.connect(process.env.MONGO_ADDRESSTEST, function (err) {
			if (err) return console.error(err);
			ActMatrices = require('../models/actmatrix').category;
			Users = require('../models/user');
			Acts = require('../models/acts');
			return done();
		});
		}
	});

	after(function (done) {
		mongoose.connection.close(function () { return done(); });
	});

	it('write an Act Matrix to the database', function (done) {

		var actCreated = ActMatrices.create({
			category: "testcategory",
			desc: "THIS IS A TEST MATRIX",
			filterTags: [{filter_title: 'zoos'}, {filter_title: 'mexican'}, {filter_title: 'mexican'}]
		}, function (err, success) {
			// console.log(mongoose);
			if (!err) {
				expect(success.category).to.be.equal('testcategory');
				expect(success.filterTags.length).to.be.equal(3);
				done();
			} else {
				console.error(err);
				done();
			}

		});
	});


	it('we can find an act matrix by category', function (done) {
		ActMatrices.findOne({category: 'testcategory'}, function (err, item) {
			if (err) return console.error(err);
			expect(err).to.not.exist;
			expect(item.desc).to.be.equal('THIS IS A TEST MATRIX');
			expect(item.filterTags.length).to.be.equal(3);
			done();
		})
	});

	it('we can get a random subtag under a specific actmatrix', function (done) {
		ActMatrices.randomSubTag('testcategory', function (err, categoryTag){
			if (err) return console.error(err);
			expect(err).to.not.exist;
			expect(categoryTag.id).to.exist;
			expect(categoryTag.filter_title).to.be.a('string');
			done();
		});
	});

	it('will clear our database of ActMatrices using the elliotf/mocha-mongoose method', function (done) {
		ActMatrices.count(function(err, count) {
			expect(err).to.not.exist;
			expect(count).to.equal(1);
			clearDB(function (err) {
				if (err) return console.error(err);
				expect(err).to.not.exist;

				ActMatrices.find({}, function (err, items) {
					expect(err).to.not.exist;
					expect(items.length).to.equal(0);
					return done();
				});
			});

		});

	});

	// it('create three categories for testing', function (done){
	// 	var sampleCategory1 = {category: 'adventure', desc: 'something dangerous',
	// 	filterTags: [{filter_title: 'horsebackriding'}, {filter_title: 'mountainbiking'}, {filter_title: ''}]};
	// 	var sampleCategory2 = sampleCategory1;
	// 	sampleCategory2.category = 'ethnic';
	// 	sampleCategory2.filterTags = [{filter_title: 'korean'},{filter_title: 'mideastern'}, {filter_title: 'carribean'}]
	// 	ActMatrices.create(sampleCategory)
	// 	done();
	// });

	// it('able to create a sample user and save that user', function (done) {

	// 	var userOptions = {
	// 		city:"Echo Park",
	// 		lastModified:  Date.now(),
	// 		address:"985 West Kensington Road",
	// 		preferences:{
	// 		   act1: {},
	// 		   act2: {},
	// 		   act3: {}
	// 		},
	// 		location: {
	// 		   lat:34.0739427,
	// 		   lng:-118.25646280000001
	// 		},
	// 		acts: [],
	// 		partnerEmail: "mahtabahan@gmail.com",
	// 		email: "rmalcome@gmail.com"
	// 	};

	// 	Users.create(userOptions, function (err, success) {
	// 		if (err) return console.error(err);
	// 		expect(err).to.not.exist;

	// 		Users.findOne({city: "Echo Park"}, function (err, user){
	// 			if (err) return console.error(err);
	// 			expect(err).to.not.exist;

	// 			expect(user.address).to.be.deep.equal(success.address);
	// 			done();
	// 		});
	// 	});

	// });



});

