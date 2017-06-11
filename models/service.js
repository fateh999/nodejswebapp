var mongoose = require('mongoose');

// Service Schema
var serviceSchema = mongoose.Schema({
	name: {
		type: String
	},
	email:{
		type: String,
	},
	serviceName: {
		type: String
	},
	serviceDesc: {
		type: String
	},
	price: {
		type: Number
	}
});

var Service = module.exports = mongoose.model('Service', serviceSchema)

module.exports.createService = function(newService, callback){
    	newService.save(callback);
}

