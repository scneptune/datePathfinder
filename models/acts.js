var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Act-base-model

var actsSchema = new Schema({
	locationName: {type: String, default: '', trim: true},
	locationImage: {type: String, default: ''},
	streetAddress: {type: String, default: ''},
	lastModified: {type: Date, default: Date.now, expires: '2d'},
	rating: {type: Number, default: 0},
	user: {type: Schema.Types.ObjectId, ref: 'user'},
	category: {type: String, default: '', trim: true},
	pagelinks: {type: String, default: ''},
	yelpReview: {type: String, default: '', trim: true},
	location: {
		lat: {type: Number, required: true},
		lng: {type: Number, required: true},
	}
});

// actsSchema.statics = {
// 	load: function (id, cb) {
// 		this.findOne({_id: id})
// 		.populate('user', 'email id location')
// 		.exec(cb);
// 	}
// }

return mongoose.model('acts', actsSchema);


