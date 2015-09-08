 var env = require('node-env-file');
 	//call in our secret env
 	env(__dirname + '/../.env');
var request = require('request'),
	Date = require('./dateFormatter'),
	querystring = require('querystring'),
	LatLong = require('./LatLong');

var todaysDate = new Date();


eventChildProcess = spawn('node', ['libs/eventChildFetch.js', 'child'],
	{stdio: ['pipe', 'pipe', 'pipe']});

	stream = new JSONStream(process.stdout, process.stdin);
	stream.on('json', fetchEvent;

function fetchEvent(requestStream) {

if (requestStream.searchType == 'movie') {

	function supplementaryMovieData(movieTitle) {
			return request.get({
				url: 'http://www.omdbapi.com/',
				qs: {
					t: movieTitle,
					y: todaysDate.getFullYear(),
					r: 'json'
				},
				encoding: 'utf8',
				gzip: true
			}, function (err, resp, body) {
				if (err) return process.stderr.write('Unable to pull a poster for a movie');
				return JSON.parse(body);
			});
	};
	function geocodeFirstTheatre (theaterName) {
		return request.get({
			url: "https://maps.googleapis.com/maps/api/geocode/json",
			qs: {
				address: theaterName,
				region: 'us',
				key: process.env.GOOGLEAPI_KEY
			}
		});
	}

	return request.get(
	{
		url: 'http://data.tmsapi.com/v1.1/movies/showings',
		qs: {
			startDate: todaysDate.format('Y-m-d'),
			lat: requestStream.location.lat,
			lng: requestStream.location.lng,
			units: 'mi',
			api_key: process.env.ONCONNECT_GRACENOTE_KEY,
			numDays: 1
		},
		headers:{
			"Accept-Encoding": "gzip, deflate, sdch"
		},
		encoding: 'utf8',
		gzip: true
	}, function (err, resp, body) {
		if (!err && resp.statusCode == 200) {
			respObject = JSON.parse(body);
			var movieListLen = respObject.length;
			var randomMovieIndex = Math.floor((Math.random() * movieListLen) + 1);
			var supplementary = supplementaryMovieData(respObject[randomMovieIndex].title.trim());
			respObject[randomMovieIndex].urlPoster = supplementary.Poster;
			//overwrite the existing run time because the format is dumb and doesn't help anyone.
			respObject[randomMovieIndex].runTime = supplementary.Runtime;
			respObject[randomMovieIndex].aggregateScore = supplementary.Metascore;
			return stream.write(respObject[randomMovieIndex]);
		} else {
			return eventCallback(err);
		}
	});



	} else if (requestStream.searchType="event") {
	//Set the metro area which our location resides in
	var metroAreaResults, currentCityMetro;
		request.get({
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