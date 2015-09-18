//database Driver
var async = require('async'),
	YelpParent = require('./yelpParentFetch'),
	EventParent = require('./eventParentFetch');

var aggregateCalls = function (userInput, rootCallback) {
	if (userInput == null) return rootCallback("missing userInput");
	return async.parallel([
	function (interiorCallback) {
		return YelpParent.fetchYelp(userInput.act1, function (err, result) {
			console.log('finished first act', YelpParent.processPid);
				return interiorCallback(err, result);
		});
	},
	function (interiorCallback2) {
		return YelpParent.fetchYelp(userInput.act2, function (err, result) {
			console.log('finished second act', YelpParent.processPid);
				return interiorCallback2(err, result);
		});
	},
	function (interiorCallback3) {
		return EventParent.fetchEvent(userInput.act3, function (err, result) {
			console.log('finsihed third act', EventParent.processPid);
			return interiorCallback3(err, result);
		});
	}], function (errs, successMsg) {
	if (errs){
		console.error(errs);
		return rootCallback(errs);
		///requeryField(this, ) //worry about this in a minute, let's just make multiple save requests
	} else {
		// console.log(JSON.stringify(successMsg, null, 2));
		return rootCallback(null, successMsg);
	}
});

};

exports = module.exports = aggregateCalls;
