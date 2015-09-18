#!/usr/bin/env node
process.stdin.resume();
process.stdout.setEncoding('utf8');
process.stdin.setEncoding('utf8');
process.stderr.setEncoding('utf8');

 var env = require('node-env-file');
 	//call in our secret env
 	env(__dirname + '/../.env');
var Date = require('../libs/dateFormatter'),
	songKick = require('../libs/songkickdriver'),
	graceNote = require('../libs/gracenotedriver'),
	JSONStream = require('pixl-json-stream');

	var todaysDate = new Date(),
		stream = new JSONStream(process.stdin, process.stdout);

return stream.on('json', function (requestStream) {

	if (requestStream.filterType == 'movie') {
		return graceNote.getMovieTimes({location: requestStream.location}, function (err, finalMovieObj) {
			if (!err) {
				return stream.write(finalMovieObj), process.exit();
			} else {
				return stream.write({error: err}), process.exit();
			}
		});

	} else if (requestStream.filterType == "event") {
		return songKick.getEventResult(requestStream, function (err, finalEventCalendar) {
			// process.stderr.write(JSON.stringify(finalEventCalendar));
			var selectRandomTopIndex;

			if (!err) {
				selectRandomTopIndex = limitResultTopRandom(finalEventCalendar);
				return stream.write(finalEventCalendar.event[selectRandomTopIndex]), process.exit();
			} else {
				return stream.write({error: err}), process.exit();
			}
		});
	}

	function limitResultTopRandom(resultsObj) {
		if (resultsObj.event.length) {
			var halfTopList = Math.ceil((resultsObj.event.length - 1) / 2);
			return Math.floor((Math.random() * halfTopList) + 1);
		}
	};
});