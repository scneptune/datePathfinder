var express = require('express');
var router = express.Router();
var actMatrix = require('../models/actmatrix');

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

router.get('/tagedit', function (req, res, next) {
	res.render('tageditor', {title: 'DatePathfinder - Secret Sauce...'});
})

router.post('/set_acts', function (req, res, next) {
	// actMatrix.category;
	tempArr = [];
		for(item in req.body.filterTags) {
			tempArr.push({filter_title: req.body.filterTags[item]});
	}
	var Category = new actMatrix.category({
		desc: req.body.desc,
		category: req.body.category,
		filterTags: tempArr
	});
	// Category.filterTags.
	// Category.filterTags
	Category.save(function (err) {
		if (err) res.send(err);
			res.redirect(301, '/tagedit');
		});

});

router.get('/get_acts', function (req, res, next) {
	actMatrix.category.find(function(err, catergory) {
   	if (err) throw err;
  	res.send(catergory);
   	});
});

// router.post('/interests', function (req, res, next) {
// 	req.session;
// 	console.error(req.body);
// 	res.redirect(301, '/');
// });

// router.get('/');


module.exports = router;
