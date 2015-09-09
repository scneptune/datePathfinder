//omdbdriver
 var env = require('node-env-file');
 	//call in our secret env
 	env(__dirname + '/../.env');
var request = require('request'),
	objectAssign = require('object-assign'),
	querystring = require('querystring'),
	async = require('async'),
	Date = require('./dateFormatter');
	gPlaces = require('./placesdriver');
var matchedMovie;

module.exports = {
	todaysDate: new Date(),
	getMovieTimes: function (movieQuery, movieCallback) {
		if (movieQuery == null) return movieCallback('Missing Query Params');
		var self = this;
		var matchedMovie;

		function mapShowtimes(iterTheatre, showtimesCallback) {

			//TODO: refactor on that ish for child processes, to offload the strain on the main thread.
			return gPlaces.getPlace({
					name: iterTheatre.theatre.name,
					location: movieQuery.location
				}, function (err, theatreObj) {
					if (err) return showCallback(err);
					var combinedTheatre = objectAssign(theatreObj, iterTheatre);
					return showtimesCallback(null, combinedTheatre);
				});
		};

		return request.get({
				url: "http://data.tmsapi.com/v1.1/movies/showings",
				qs: {
					startDate: self.todaysDate.format('Y-m-d'),
					lat: movieQuery.location.lat,
					lng: movieQuery.location.lng,
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
				if (err) {
					return movieCallback(err);
				} else if (!err && resp.statusCode == 200) {
					var matchedMovie = JSON.parse(body);
					var movieListLen = matchedMovie.length;
					var randomMovieIndex = Math.floor((Math.random() * movieListLen) + 1);
					var selectedMovie = matchedMovie[randomMovieIndex];
					async.map(selectedMovie.showtimes, mapShowtimes, function (err, data) {
						selectedMovie.showtimes = data;
						return movieCallback(null, selectedMovie);
					});

				} else {
					return movieCallback(JSON.parse(body));
				}
			});
	}
};