#!/usr/bin/env node
//release the kraken!!
process.stdin.resume();
process.stdout.setEncoding('utf8');
process.stdin.setEncoding('utf8');
process.stderr.setEncoding('utf8');

var JSONStream = require('pixl-json-stream'),
	yelpDriver = require('../libs/yelpdriver');

var stream = new JSONStream(process.stdin, process.stdout);

return stream.on('json', function (queryParam) {
	// return stream.write({error: queryParam});
		return yelpDriver.getAll(queryParam, function (err, output) {
			if (err) {
				//give us back the error from inside the yelpDriver
				return stream.write({error: err}), process.exit();
			} else if (output.total > 0 && output.businesses.length) {
				var finalBusiness = randomResult(output.businesses);

				//port this data back to the stream handler which inturn sends this back to the parent process.
				return stream.write(finalBusiness), process.exit();
			} else if (output.total == 0) {
				return stream.write({noresults : true, output: JSON.stringify(output, null, 3)}), process.exit();
			} else {
				//final default which is an error because we never got a response with a wellformed json object
				return stream.write({error: output}), process.exit();
			}

			//run this function to make sure we don't pull a closed business result to save it.
			function randomResult(businessList) {
					if (businessList.length <= 0) {
						return {noresults : true, output: 'no open results'};
					} else {

						var randomIndex = (Math.floor(Math.random() * businessList.length));
						// process.stderr.write(JSON.stringify(businessList[randomIndex], null, 2) + ' inside child yelp');
						var selectedBusiness = businessList[randomIndex];

						if (selectedBusiness.hasOwnProperty('is_closed') && selectedBusiness.is_closed == true) {
							var reducedArray = businessList.slice(randomIndex, 1);
							return randomResult(reducedArray);
						} else {
							return selectedBusiness;
						}
					}
			}
	});
});

