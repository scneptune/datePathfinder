//omdbdriver
 var env = require('node-env-file');
 	//call in our secret env
 	env(__dirname + '/../.env');
var request = require('request'),
	querystring = require('querystring');
var matchedMovie;

module.exports = {
	currentMovie: {},
	getMovie: function (movieQuery, movieCallback) {
		if (movieQuery == null) return movieCallback('Missing Query Params');
		var self = this;
		var matchedMovie;
		return request.get({
				url: "http://www.omdbapi.com/",
				qs: movieQuery,
				headers:{
					"Accept-Encoding": "gzip, deflate, sdch"
				},
				encoding: 'utf8',
				gzip: true
			}, function (err, resp, body) {
				if (err) {return movieCallback(err);
				} else if (!self.currentMovie) {
					return movieCallback('currentMovie Not set!');
				} else {
					var matchedMovie = JSON.parse(body);
					if (!matchedMovie.Response) return movieCallback(matchedMovie.Error);
					self.currentMovie.urlPoster = matchedMovie.Poster;
					self.currentMovie.runTime = matchedMovie.Runtime;
					self.currentMovie.aggregateScore = matchedMovie.Metascore;
					console.log(self.currentMovie);
					return movieCallback(null, self.currentMovie);
				}
			});
	}
};