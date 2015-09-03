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