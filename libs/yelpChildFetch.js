#!/usr/bin/env node
//release the kraken!!
process.stdin.resume();
process.stdout.setEncoding('utf8');
process.stdin.setEncoding('utf8');
process.stderr.setEncoding('utf8');

var JSONStream = require('pixl-json-stream'),
	yelpChild = require('./yelpdriver'),
	Q = require('q');

var stream = new JSONStream(process.stdin, process.stdout);
//run a random here to get a variety of results back.
var randomIndex = (Math.floor(Math.random() * 10) + 1);

stream.on('json', function (queryParam) {
		yelpChild.getAll(queryParam, function (output) {
			if (output.hasOwnProperty('businesses')) {
				//port this data back to the stream handler which inturn sends this back to the parent process.
				var stringedOutput = output.businesses[randomIndex];
				stream.write(stringedOutput);
			} else {
				var stringOut = output;
				stream.write(stringOut);
			}

	});
});

