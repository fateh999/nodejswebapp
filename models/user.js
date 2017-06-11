var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var userSchema = mongoose.Schema({
	name: {
		type: String
	},
	email:{
		type: String,
		unique: true,
	},
	password: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', userSchema)

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password , salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {email: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(password,hash, callback){
	bcrypt.compare(password, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
});
}


