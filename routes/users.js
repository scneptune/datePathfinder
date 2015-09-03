var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Acts = require('../models/acts');
var actMatrix = require('../models/actmatrix');

router.param('id', function (req, res, next, id) {
	console.log('found an id', id);
	req.idVal = id;
	next();
})

router.get('/:id', function (req, res, next) {
	var randomIndexValue = Math.floor((Math.random() * 2) + 1);

 	User.getWithPromise({_id: req.idVal}).then(function (user) {
 			res.send(user);
 	}).catch(console.log).done();

});

router.post('/create', function (req, res, next) {
	var newUser = {
		address: req.session.address,
		city: req.session.city,
		location: req.session.location,
		preferences: {
			act1: req.body.actI_activity,
			act2: {price: req.body.actII_spending,
				distance: req.body.actII_distance,
				food: req.body.actII_restaurant_type
				},
			act3: req.body.actIII_finale
		}
	};
	createdUser = new User(newUser);

	createdUser.save(function (err) {
		if (err) res.send(err);
		res.send('created a new user bruv.');
	});

	// {: parseFloat(req.body.spending)}
	// var user = new User()
});

/* GET users listing. */
router.get('/', function(req, res, next) {
   User.find(function(err, user) {
   	if (err) throw err;
  	res.send(user);
   });
});

module.exports = router;
