#!/usr/bin/env node
// Method to make yelp Requests.
"use strict";
var child = require('child_process');
var exec = child.exec, //not used, yet
	spawn = child.spawn;
var JSONStream = require('pixl-json-stream');
var mongoChildProcess, yelpProcess, stream, dbActPrepare;

var ioStream = {stdio: ['pipe', 'pipe', 'pipe']};
var sampleSearch = {
					location: {lat: 34.052234, lng: -118.243685},
					filterType: 'newamerican'
				};

module.exports = function (inputObj, yelpChildCallback) {
	if (inputObj == null)  {
		return yelpChildCallback('Missing query params to request Yelp results');
	}
	yelpProcess = spawn('node', ['controllers/yelpChildFetch.js', 'child'], ioStream);
	stream = new JSONStream(yelpProcess.stdout, yelpProcess.stdin);
	stream.on('json', yelpCallback);
	stream.write(inputObj);

	// Listen for any errors:
	yelpProcess.stderr.on('data', function (data) {
	    yelpChildCallback('There was an error inside Yelp Child Process: ' + data);
	    return yelpProcess.kill();
	});

	yelpProcess.stdout.on('end', function () {
		return yelpProcess.kill();
	});

	function yelpCallback (yelpResult) {
		if (yelpResult.noresults) {
			console.log(yelpResult);
			//do something here to go back and refetch this category with a different term
			yelpChildCallback('category is not present');
		} else {
		dbActPrepare = {
			locationName: yelpResult.name,
			locationImage: yelpResult.image_url,
			streetAddress: yelpResult.location.display_address.join(', '),
			lastModified: Date.now(),
			rating: yelpResult.rating,
			category: inputObj.filterType,
			pagelink: yelpResult.url,
			locationDescription: yelpResult.snippet_text,
			location: {
				lat: yelpResult.location.coordinate.latitude,
				lng: yelpResult.location.coordinate.longitude
			}
		};
			yelpChildCallback(null, dbActPrepare);
		}
		return yelpProcess.kill();
	};


}



