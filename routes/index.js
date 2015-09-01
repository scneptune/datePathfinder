var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'DatePathfinder', session: req.sessionID });
});

router.get('/*/start', function (req, res, next) {
	res.render('start', {
			title: 'DatePathfinder - Prologue',
			session: req.session
		});
});

router.post('/start', function (req, res, next) {
	req.session.address = req.body.address;
	req.session.city = req.body.city;
	req.session.location = {
		"lat" : parseFloat(req.body.lat),
		"lng" : parseFloat(req.body.long),
	};
	req.session.save(function (err) {
		req.session;
	});
	res.redirect(301, '/'+ req.sessionID + '/interests');
});

router.get('/*/interests', function (req, res, next) {
	res.render('interests', {title: ' DatePathfinder - Interests'});
});



module.exports = router;
