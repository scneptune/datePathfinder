//placesdriver
 var env = require('node-env-file');
 	//call in our secret env
 	env(__dirname + '/../.env');
var request = require('request'),
	querystring = require('querystring');


module.exports = {
	getPlace: function (locationQuery, googleCallback) {
		if (locationQuery == null) return googleCallback('Missing Query Params');
		return request.get({
				url: "https://maps.googleapis.com/maps/api/place/textsearch/json",
				qs: {
					query: locationQuery.name,
					location: [locationQuery.location.lat, locationQuery.location.lng],
					radius: 1500, //future work could also agument this when the request is made
					key: process.env.GOOGLEAPI_KEY,
				},
				headers:{
					"Accept-Encoding": "gzip, deflate, sdch"
				},
				encoding: 'utf8',
				gzip: true
			}, function (err, resp, body) {
				if (err) return googleCallback(err);
				firstResult = JSON.parse(body).results[0];
				return googleCallback(null, {
					address: firstResult.formatted_address,
					location: firstResult.geometry.location
				});
			});
	}
};