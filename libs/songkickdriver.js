//songkickdriver
 var env = require('node-env-file');
 	//call in our secret env
 	env(__dirname + '/../.env');
var request = require('request');

module.exports = {
		getEventCalendar: function (metroAreaId, eventListReturnCallback) {
			//make another request with the metroAreaId .
			return	request.get({
						url: 'http://api.songkick.com/api/3.0/metro_areas/' + metroAreaId + '/calendar.json',
						qs: {apikey: process.env.SONGKICK_KEY},
						encoding: 'utf8',
						gzip: true
					}, function (err, resp, body) {
						if (err) return eventListReturnCallback(err);
						//drill down and get the events array as part of the song kick results.
						resultCalendar = JSON.parse(body).resultsPage.results;
						return eventListReturnCallback(null, resultCalendar);
					});
		},
		sortPopularEvent: function (resultsObj) {
			return resultsObj.event.sort(function (objA, objB) {
				var apop = objA.popularity;
				var bpop = objB.popularity;
				if (apop > bpop) return -1;
				if (apop < bpop) return 1;
				return 0;
			});
		},
		getEventResult: function (inputParams, eventReturnCallback) {
		var metroAreaResults, currentCityMetro, self = this;
		if (!inputParams.hasOwnProperty('location')) return eventReturnCallback('Missing Input location.');
		//Set the metro area which our location resides in
			return request.get({
				url: 'http://api.songkick.com/api/3.0/search/locations.json',
				qs: {
					location: 'geo:' + inputParams.location.lat+',' +inputParams.location.lng,
					apikey:process.env.SONGKICK_KEY
				},
				encoding: 'utf8',
				gzip: true
			}, function (err, resp, body) {
				if (err) return eventReturnCallback(err);
				metroAreaResults = JSON.parse(body);
				if (metroAreaResults.resultsPage.results.location.length == 0) return eventReturnCallback('No events found near location');
				// select the first location from the metroArea list because it will be closest proximity to our events.
				currentCityMetro = metroAreaResults.resultsPage.results.location[0];
					//ok now we've found our metroarea id, now lets request the calendar.
					self.getEventCalendar(currentCityMetro.metroArea.id, function (err, eventResults) {
						if (err) return eventReturnCallback(err);
						eventResults.event = self.sortPopularEvent(eventResults);
						return eventReturnCallback(null, eventResults);
					});
			});
		}
};