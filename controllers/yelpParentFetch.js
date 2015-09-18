#!/usr/bin/env node
// Method to make yelp Requests.
"use strict";
var child = require('child_process');
var exec = child.exec, //not used, yet
	spawn = child.spawn;
var JSONStream = require('pixl-json-stream');
var yelpProcess, stream, dbPrepare;

var ioStream = {stdio: ['pipe', 'pipe', 'pipe']};

/**
* A yelp process to query the API with the provided inputObj.
* @param {Object} inputObj - An object with searchType used for filtering on yelp, and the location object which has lat and lng coordinates.
* @param {function} yelpChildCallback - a function which passes the dbPrepared Obj back up to the element above this module or sends the errors.
*/
module.exports = {
	processPid: null,
	fetchYelp: function (inputObj, yelpChildCallback) {
		if (inputObj == null)  {
			return yelpChildCallback('Missing query params to request Yelp results');
		}

		yelpProcess = spawn('node', ['controllers/yelpChildFetch.js', 'child'], ioStream);
		stream = new JSONStream(yelpProcess.stdout, yelpProcess.stdin);
		this.processPid = yelpProcess.pid;
		stream.write(inputObj);

		stream.on('json', yelpCallback);


		// Listen for any errors:
		yelpProcess.stderr.on('data', function (data) {
		    yelpChildCallback('There was an error inside Yelp Child Process: ' + data);
		    return yelpProcess.kill();
		});

		yelpProcess.stdout.on('end', function () {
			// return yelpProcess.kill();
		});

		function yelpCallback (yelpResult) {
			if (yelpResult.noresults) {
				//do something here to go back and refetch this category with a different term
				return yelpChildCallback('category is not present'), yelpProcess.kill();
			} else if (yelpResult.error) {
				return yelpChildCallback('error inside the child' + yelpResult.error), yelpProcess.kill();
			} else {
				dbPrepare = {
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

				return yelpChildCallback(null, dbPrepare);
			}
		};

	}
};



