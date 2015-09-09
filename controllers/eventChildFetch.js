 var env = require('node-env-file');
 	//call in our secret env
 	env(__dirname + '/../.env');
var request = require('request'),
	Date = require('../libs/dateFormatter'),
	querystring = require('querystring'),
	objectAssign = require('object-assign'),
	JSONStream = require('pixl-json-stream');
var graceNote = require('../libs/gracenotedriver'),
	stream, todaysDate;

	todaysDate = new Date();
	stream = new JSONStream(process.stdout, process.stdin);
	stream.on('json', fetchEvent);

function fetchEvent(requestStream) {
	console.log(requestStream, 'object after passed to child event');
if (requestStream.searchType == 'movie') {
	return graceNote.getMovieTimes({location: requestStream.location}, function (err, finalMovieObj) {
		if (!err) {
		return stream.write(selectedMovie);
		} else {
			stream.write({error: err});
		}
	});

} else if (requestStream.searchType == "event") {
	//Set the metro area which our location resides in
	var metroAreaResults, currentCityMetro;
		return request.get({
			url: 'http://api.songkick.com/api/3.0/search/locations.json',
			qs: {
				location: 'geo:' + requestStream.location.lat+',' +requestStream.location.lng,
				apikey:process.env.SONGKICK_KEY
			},
			encoding: 'utf8',
			gzip: true
		}, function (err, resp, body) {
			if (err) return process.stderr.write(err);
			metroAreaResults = JSON.parse(body);
				if (metroAreaResults.resultsPage.results.location.length == 0) return process.stderr.write('No events found near location');
				// select the first location from the metroArea list because it will be closest proximity to our events.
				currentCityMetro = metroAreaResults.resultsPage.results.location[0];
					//ok now we've found our metroarea id, now lets request the calendar.
					console.log(currentCityMetro.metroArea.id);
					//make another request.
					getEventCalendar(currentCityMetro.metroArea.id);
		});

		function getEventCalendar(theatreId) {
			return	request.get({
						url: 'http://api.songkick.com/api/3.0/metro_areas/' + theatreId + '/calendar.json',
						qs: {apikey: process.env.SONGKICK_KEY},
						encoding: 'utf8',
						gzip: true
					}, function (err, resp, body) {
						if (err) return process.stderr.write(err);
						resultCalendar = JSON.parse(body).resultsPage.results.event;

						console.log(resultCalendar);
					})
		}
	}
};