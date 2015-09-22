// actMatrix
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

var tagSchema = new Schema({
	filter_title: {type: String, lowercase: true, trim: true},
	lastModified: {type: Date, default: Date.now}
});

var actMatrix = new Schema({
	category: {type: String, lowercase: true, required: true},
	desc: {type: String},
	filterTags: [tagSchema],
});

actMatrix.pre('find', function (){
	this.startTime = Date.now();
});

actMatrix.post('find', function (result) {
	//query logic execution time logging
	console.log('running the find took '+ (Date.now() - this.startTime) + ' ms');
});

actMatrix.statics.randomSubTag = function (categoryName, callback) {
	this.findOne({category: categoryName}).populate('filterTags').exec(function (err, resultCat) {
		if (err) return callback(err);
		var randomIndex = Math.floor(Math.random() * resultCat.filterTags.length);
		return callback(null, resultCat.filterTags[randomIndex]);
	}.bind(this));
};


actMatrix.statics.getCategory = function(user) {
		var deffered = Q.defer();
		this.findOne({id: _uid}).populate('filterTags').exec(
			function (err, actMatrix) {
			if (err) {
				deffered.reject(new Error(error));
			}
			deffered.resolve(tags);
			});

		return deferred.promise;

};


module.exports = { tagSchema: mongoose.model('tagSchema', tagSchema),
					category: mongoose.model('actMatrix', actMatrix) };