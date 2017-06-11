 var express = require('express');
 var router = express.Router();

 var Service = require('../models/service');

 // Get Homepage
 router.get('/',function(req,res){
 	res.render('index');
 });

 // Get Services Page
  router.get('/services', function(req,res){
 	res.render('services');
 });

 // Get Dashboard Page
  router.get('/dashboard', ensureAuthentication, function(req,res){
 	
  Service.find(function (err, service) {  
    if (err) {
        // Note that this error doesn't mean nothing was found,
        // it means the database had an error while searching, hence the 500 status
        //res.status(500).send(err)
        res.render('dashboard')
    } else {
        // send the list of all people
        //res.send(service);
        console.log(service);
        res.render('dashboard',{result:service});
    }
}); 

  
 });


  // Check for Login
  function ensureAuthentication(req, res, next){
  	if(req.isAuthenticated()){
  		return next();
  	}else{
  		req.flash('error_msg','You are not logged in');
  		res.redirect('/users/login');
  	}
  }

  // Add Services
 router.post('/dashboard',ensureAuthentication, function(req,res){
  var name = req.body.name;
  var email = req.body.email;
  var serviceName = req.body.serviceName;
  var serviceDesc = req.body.serviceDesc;
  var price = req.body.price;

  // Validation

  req.checkBody('serviceName','Service Name is required').notEmpty();
  req.checkBody('serviceDesc','Service Description is required').notEmpty();
  req.checkBody('price','Price is required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.render('dashboard',{
      errors: errors
    });
  }else{ 
    var newService = new Service({
      name: name,
      email: email,
      serviceName: serviceName,
      serviceDesc: serviceDesc,
      price: price
    });

    Service.createService(newService, function(err,service){
          req.flash('success_msg', 'Service Added Successfully');
          //res.redirect('/users/login');
          res.redirect('/dashboard');
          console.log(service);   
    });    
  }
 }); 


  module.exports = router;