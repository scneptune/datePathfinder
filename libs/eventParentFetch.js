var child = require('child_process');
var exec = child.exec, //not used, yet
	spawn = child.spawn;
var JSONStream = require('pixl-json-stream'), stream, dbActPrepare;

var ioStream = {stdio: ['pipe', 'pipe', 'pipe']};
module.exports = function (inputParams, eventCallback) {

	if (inputParams == null) return eventCallback('Missing query object!');

	eventChildProcess = spawn('node', ['libs/eventChildFetch.js', 'child'], ioStream);
	stream = new JSONStream(eventChildProcess.stdout, eventChildProcess.stdin);
	stream.on('json', eventReturn);
	stream.write(inputParams);

	eventChildProcess.stderr.on('data', function (data) {
		 eventCallback('There was an error inside Event Child Process: ' + data);
	    return eventChildProcess.kill();
	}

	var requestStream = {
		searchType: 'movie',
		location: {
			lat: 34.052234,
			lng: -118.243685
		}
	}

	function eventReturn (streamObj) {
		var dbPrepare;
		console.log(streamObj);
		if (inputParams == 'movie') {
			function compileDescription(streamObject) {
				longDec = "<h4 class='actors'>Starring: " + streamObj.topCast.join(', ') +
				"| Directed By:" + streamObj.directors.join(', ') + "</h4>"+
				"<p class='moviedesc'>" + stream.Obj.longDescription + "<p>" +
				"<span class='movieaddt'>Runtime: " + streamObj.runTime +
				". Release:" + streamObj.releaseYear + "</span>" +
				"<span class='moviegenre'>"+ streamObj.genres.join(' , ') + "<span>" +
				for (var theater in streamObj.showtimes) {
					if (theater)
				}
				"";
			}

			dbPrepare = {
				locationName: streamObj.title,
				locationDescription: streamObj.snippet_text,
				locationImage: streamObj.urlPoster,
				streetAddress: '',
				lastModified: Date.now(),
				rating: streamObj.aggregateScore,
				category: requestStream.searchType,
				pagelink: streamObj.url,
				location: inputParams.location
			}
		} else if (inputParams == 'event') {

		}
	}


}
