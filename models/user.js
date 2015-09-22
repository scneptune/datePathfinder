var mongoose = require('mongoose');
// var yelpDriver = require('./yelpdriver');
var Schema = mongoose.Schema;
var Q = require('q');
//user-base-model

var UserSchema = new Schema({
	email: {type: String, default: '', trim: true, lowercase: true},
	partnerEmail: {type: String, default: '', trim: true, lowercase: true},
	location: {
		lat: {type: Number, required: true},
		lng: {type: Number, required: true}
	},
	preferences: {
		act1: {type: Schema.Types.ObjectId, ref: 'actMatrix'},
		act2: {type: Schema.Types.ObjectId, ref: 'actMatrix'},
		act3: {type: Schema.Types.ObjectId, ref: 'actMatrix'}
	},
	address: {type: String, default: '', trim: true},
	lastModified: {type: Date, default: Date.now},
	city: {type: String, default: '', trim: true},
	acts: [{type: Schema.Types.ObjectId, ref: 'acts'}]
});

UserSchema.pre('save', function (next){
	var now = new Date();
	this.lastModified = now;
	next();
});

UserSchema.statics.getWithPromise = function (objSearch) {
	 var deferred = Q.defer();
	 this.find(objSearch).populate('acts').exec(function (error, user) {
	 	if (error) {
	 		deferred.reject(new Error(error));
	 	} else {
	 		deferred.resolve(user);
	 	}
	 });

	 return deferred.promise;
};
var User = mongoose.model('User', UserSchema)
module.exports = User;

