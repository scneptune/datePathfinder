#!/usr/bin/env node
//release the kraken!!
process.stdin.resume();
process.stdout.setEncoding('utf8');
process.stdin.setEncoding('utf8');
process.stderr.setEncoding('utf8');

var JSONStream = require('pixl-json-stream'),
	yelpChild = require('../libs/yelpdriver');

var stream = new JSONStream(process.stdin, process.stdout);

stream.on('json', function (queryParam) {
		yelpChild.getAll(queryParam, function (err, output) {
			if (err) {
				//give us back the error from inside the yelpDriver
				return process.stderr.write(err);
			} else if (output.total > 0 && output.businesses.length) {
				var finalBusiness = randomResult(output.businesses);
				//port this data back to the stream handler which inturn sends this back to the parent process.
				stream.write(finalBusiness);
			} else if (output.total == 0) {
				stream.write({noresults : true})
			} else {
				//final default which is an error because we never got a response with a wellformed json object
				process.stderr.write(err);
			}

			//run this function to make sure we don't pull a closed business result to save it.
			function randomResult(businessList) {
				var selectedBusiness;
				do {
					var randomIndex;
					randomIndex = (Math.floor(Math.random() * businessList.length) + 1);
					selectedBusiness = businessList[randomIndex];
				} while (selectedBusiness.is_closed);
				return selectedBusiness;
			}
	});
});

