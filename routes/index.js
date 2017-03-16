/**
 * This is a simple example of how to use an express router.
 * Renders route: /
 */
var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var api = require('../controllers/api');
var DocumentPackage = require('../models/documentPackage');
var HighlightPackage = require('../models/highlightPackage');
var VettingNotePackage = require('../models/vettingNotePackage');
var api = require('../controllers/api');
var User = require('../models/userPackage');
var config = require('../config');

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

// Helper query functions

//Need ObjectID to search by ObjectID
var ObjectId = require('mongodb').ObjectID;
module.exports = function(passport) {

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
	
	var payload = {};
	payload.title = 'Quick link usage examples';
	payload.body = '';
	payload.user_email = res.locals.email;
	payload.user_role = res.locals.role;
	payload.user = res.locals.user;
    /*res.render('index', {
        title: 'Quick link usage examples',
        body: '',
        user: false, // TODO: Add user (or not) here
        // this would change it from the default layout, layout.hbs to b3-layout.hbs
        // res.locals.layout = 'b3-layout';
		
    });*/
	res.render('index', payload);
});

return router
}
//module.exports = router;
function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()) {
			console.log("In isloggedin");
			console.log(req.body);
			console.log(req.user._id);
			var userID = req.user._id.toString();

			console.log("userID");
			console.log(userID);
			var ObjectId = require('mongodb').ObjectID;
			Promise.props({
				user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
			})
			.then(function (results) {
				console.log(results);

					if (!results) {
						//res.redirect('/user/logout');
						next();
					}
					else {
							
							//format user data to send to front end
							res.locals.email = results.user.contact_info.user_email;
							res.locals.role = results.user.user_role;
							res.locals.user = results.user._id;

							return next();
						
					}



			})

		.catch(function(err) {
                console.error(err);
        })
         .catch(next);
		}
		else {
			console.log("no user id");
			next();
		}
}