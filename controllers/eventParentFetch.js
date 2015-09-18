var child = require('child_process');
var exec = child.exec, //not used, yet
	spawn = child.spawn;
var JSONStream = require('pixl-json-stream'),
	Date = require('../libs/dateFormatter'),
	stream, dbActPrepare;

var ioStream = {stdio: ['pipe', 'pipe', 'pipe']};

module.exports = {
	processPid: null,
	fetchEvent: function (inputParams, eventCallback) {

		if (inputParams == null) return eventCallback('Missing query object!');

		eventChildProcess = spawn('node', ['controllers/eventChildFetch.js', 'child'], ioStream);
		stream = new JSONStream(eventChildProcess.stdout, eventChildProcess.stdin);

		this.processPid = eventChildProcess.pid;
		stream.write(inputParams);
		stream.on('json', eventReturn);

		eventChildProcess.stderr.on('data', function (data) {
			eventCallback('There was an error inside Event Child Process: ' + data);
		    // return eventChildProcess.kill();
		});

		//utility function to do a php-style htmlspecialchars.
		function escapeHtml(text) {
				  var map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
				  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
		};

		function eventReturn (streamObj) {
			if (streamObj.hasOwnProperty('error')){
				return eventCallback("There was an error inside the event child process: " + streamObj.error), eventChildProcess.kill();
			}
			var dbPrepare;

			if (inputParams.filterType == 'movie') {

				function movieTheatreDescription(streamObject) {
					longDec = "<h4 class='actors'>Starring: " + streamObject.topCast.join(', ') +
					"| Directed By:" + streamObject.directors.join(', ') + "</h4>"+
					"<p class='moviedesc'>" + streamObject.longDescription + "<p>" +
					"<span class='movieaddt'>Runtime: " + streamObject.runTime +
					". Release:" + streamObject.releaseYear + "</span>" +
					"<span class='moviegenre'>"+ streamObject.genres.join(' , ') + "<span>" +
					"<h4>Playing at: </h4>";
					theaterDesc = "<ul>";
					for (var theater in streamObject.showtimes) {
						theaterDesc += "<li>";
						theaterDesc += "<h5><strong>" + streamObject.showtimes[theater].name + "</strong></h5>";
						var playTime = new Date(streamObject.showtimes[theater].dateTime);
						theaterDesc += "<p>Playing at " + playTime.format('g:i a') + "</p>";
						if (streamObject.showtimes[theater].hasOwnProperty('ticketURI')) {
							theaterDesc += "<p>Lucky for you this theater at this showtime has <a alt='Fandango Ticking for "+ streamObject.title +
							"' href='" + streamObject.showtimes[theater].ticketURI + "'> online ticket ordering </a></p>";
						}
						theaterDesc += "</li>";
					}
					theaterDesc += "</ul>";
					return longDec + theaterDesc;
				}

				dbPrepare = {
					locationName: streamObj.title,
					locationDescription: movieTheatreDescription(streamObj),
					locationImage: '',
					streetAddress: streamObj.showtimes[0].address,
					lastModified: Date.now(),
					rating: streamObj.qualityRating.value,
					category: inputParams.filterType,
					pagelink: streamObj.officialUrl,
					location: streamObj.showtimes[0].location
				}

				return eventCallback(null, dbPrepare), eventChildProcess.kill();

			} else if (inputParams.filterType == 'event') {
				// console.log(streamObj);

				function concertDescription (streamObj) {
					var innerDesc = "";
					innerDesc += "<p>We selected <strong>" + streamObj.displayName+ "</strong> for you. <br />";
					innerDesc += "This artist(s) show starts at " + formatShowDate(streamObj.start) + "</p>";
					innerDesc += "<p class='purchase-cta'> Lucky for you, you can purchase tickets at <a href='" + streamObj.uri +
					"' alt='See tickets from SongKick for " + escapeHtml(streamObj.displayName) +"'> from SongKick </a>. <p>";
					innerDesc += "<span>" + streamObj.venue.displayName +
					" also has some other shows listed around this date, <a alt='SongKick\'s venue page for "+
					escapeHtml(streamObj.venue.displayName) +"' href='"+ streamObj.venue.uri +"'>check out their calendar at SongKick</a>";
					return innerDesc;
				};

				function formatShowDate (timeObj) {
						if (timeObj.datetime) {
						var regexpattern = '^(?:\d{4}-\d{2}-\d{2})??(?:T(?:\d{2}:\d{2}:\d{2}))??([\+\-]\d{4})$',
							dateTimeStr = timeObj.datetime;

							dateTimeStr.replace(regexpattern, '');
							var showTime = new Date(dateTimeStr);
							return showTime.format('g\\:i A \\o\\n l F \\t\\h\\e jS');
						} else {
							var showTime = new Date(timeObj.date);
							return showTime.format('l F jS \\.') + ' Please check the showtime below.';
						}
				}

				dbPrepare = {
					locationName: streamObj.displayName,
					locationDescription: concertDescription(streamObj),
					locationImage: '',
					streetAddress: streamObj.venue.displayName,
					lastModified: Date.now(),
					rating: streamObj.popularity,
					category: inputParams.filterType,
					pagelink: streamObj.uri,
					location: { lat: parseFloat(streamObj.venue.lat), lng: parseFloat(streamObj.venue.lng) }
				};

				return eventCallback(null, dbPrepare);

			}
		}
	}
};
