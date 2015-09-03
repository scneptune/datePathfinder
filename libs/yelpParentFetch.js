#!/usr/bin/env node
// Method to make yelp Requests.
"use strict";
var child = require('child_process');
var exec = child.exec,
	spawn = child.spawn;
var JSONStream = require('pixl-json-stream');

var childProcess = spawn('node', ['libs/yelpChildFetch.js', 'child'],
	{stdio: ['pipe', 'pipe', 'pipe']}
);

var stream = new JSONStream(childProcess.stdout, childProcess.stdin);

stream.on('json', function (data) {
	console.log(data);
});

var sampleSearch = {
					location: {lat: 34.052234, lng: -118.243685},
					filterType: 'newamerican'
				};

stream.write(sampleSearch);

// Listen for any errors:
childProcess.stderr.on('data', function (data) {
    console.log('There was an error: ' + data);
});

// childProcess.stdout.on('end', function (err) {
// 	childProcess.kill();
// })