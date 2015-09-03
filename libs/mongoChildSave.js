process.stdin.resume();
process.stdout.setEncoding('utf8');
process.stdin.setEncoding('utf8');

var env = require('node-env-file');
 	//call in our secret env
 	env(__dirname + '/../.env');
var	JSONStream = require('pixl-json-stream');
var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');

stream = new JSONStream(process.stdin, process.stdout);

	MongoClient.connect(process.env.MONGO_ADDRESS, function (err, db) {
		if (err) return console.log(err);
			assert.equal(null, err);
  			console.log("Connected correctly to server");
  			connectedJSON();
  			// If the Node process ends, close the Mongoose connection
			process.on('SIGINT', db.close).on('SIGTERM', db.close);
			db.close();
	});

connectedJSON = function () {
	stream.on('json', function (streamObj) {
		console.log(streamObj);
		// reMarshallObj = JSON.parse(streamObj);
		// console.log(reMarshallObj);
	});
};


