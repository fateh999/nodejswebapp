 var express = require('express');
 var router = express.Router();
 var passport = require('passport');
 var LocalStrategy = require('passport-local').Strategy;

 var User = require('../models/user');

 // Register Form
 router.get('/register', function(req,res){
 	res.render('register');
 });

  // Login Form
 router.get('/login', function(req,res){
 	res.render('login');
 });

 // Register User
 router.post('/register', function(req,res){
 	var name = req.body.name;
 	var email = req.body.email;
 	var pass = req.body.pass;

 	// Validation
 	req.checkBody('name','Name is required').notEmpty();
 	req.checkBody('email','Email is required').notEmpty();
 	req.checkBody('pass','Password is required').notEmpty();
 	req.checkBody('email','Email is required').isEmail();
 	req.checkBody('pass', '8 to 20 characters required').len(8, 20);

 	var errors = req.validationErrors();

 	if(errors){
 		res.render('register',{
 			errors: errors
 		});
 	}else{ 
 		var newUser = new User({
 			name: name,
 			email: email,
 			password: pass
 		});

 		User.createUser(newUser, function(err,user){
 			if(err) {
 				  req.flash('error_msg', 'Your email is already registered');
			    res.redirect('/users/register');
 				//throw err;
 			}else{
     			req.flash('success_msg', 'You are registered and can now login');
    			res.redirect('/users/login');
     			console.log(user);
 		       }
 		}); 		
 	}
 });


// Login
passport.use(new LocalStrategy(
	{
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		}
   		else{
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   }); 
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


 router.post('/login',
  passport.authenticate('local',{successRedirect:'/dashboard',failureRedirect:'/users/login',failureFlash:true}),
  function(req, res) {
    res.redirect('/');
  });

// Logout
 router.get('/logout', function(req, res){
 	req.logout(); 
 	req.flash('success_msg', 'You are logged out');
 	res.redirect('/users/login')
 });

// Services


 module.exports = router;