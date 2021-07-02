// Used for process.env.DISABLE_CONSOLE_LOGGINGS & DEBUG_DEVELOPMENT_MODE
require('dotenv').config();

//routes the new user registration and handles post routes to the API
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var api = require('../controllers/api');

var User = require('../models/userPackage');

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

module.exports = function (passport) {
	router.route('/register')
		.get(isAdmin, api.getUserRoles, function (req, res) {
			var payload = {};
			payload.user = req.user._id;
			payload.user_email = res.locals.email;
			payload.user_role = res.locals.role;
			
			payload.roles = res.locals.results.roles;
			payload.rolesString = JSON.stringify(res.locals.results.roles);


			res.render('newuserform', payload);
		})
		.post(isLoggedInPost, api.postUser, function (req, res) {
			console.log("In post request");
			res.json(res.locals);
		})

	router.get('/userSuccess', function (req, res) {
		res.render('/');
	});

	router.route('/userList')
		.get(isAdmin, api.getUsers, function (req, res) {
			var payload = {};
			payload.users = res.locals.results.users;
			payload.user = req.user._id;
			payload.user_email = res.locals.email;
			payload.user_role = res.locals.role;
			
			
			
			console.log("payload");
			console.log(payload);
			console.log(payload.user_roles_display)
			res.render('userlist', payload)

		});


	router.route('/editUser')
		.get(isLoggedIn, function (req, res) {

			var payload = {};

			payload = res.locals.results;
			payload.user_email = res.locals.email;
			payload.user_role = res.locals.role;
			res.render('useredit', payload);



		})
		.post(isLoggedInPost, api.updateUser, function (req, res) {
			console.log("in update user route");
			//TODO: compare req.user_id to pk - confirm requesting user = user to be updated
			res.json(res.locals);
		})

	router.route('/editUser/:id')
		.get(isAdmin, api.findUser, function (req, res) {
			var payload = {};
			payload = res.locals.results;
			console.log(payload);
			//payload.user = req.user._id;
			payload.user_email = res.locals.email;
			payload.user_role = res.locals.role;
			payload.user_roles= res.locals.user_roles
      payload.user.assign_tasks = payload.user.assign_tasks || false;
			console.log("payload");
			console.log(payload);
			res.render('adminuseredit', payload);

		})
		.post(isAdmin, api.updateUser, function (req, res) {
			res.json(res.locals);
		})


			
		router.route('/editUserRoles').post(isAdmin, api.updateUserRoles, function (req, res) {
			res.json(res.locals);
		})

	router.route('/changePassword')
		.post(isLoggedIn, api.updatePassword, function (req, res) {
			console.log("in change pass route");
			if (res.locals.status != '200') {
				res.status(500).send("Could not update password");
			}
			else {
				res.json(res.locals);
			}
		});

	router.route('/login')
		.get(async function (req, res) {
			// Autologin with admin account if in process.env.DEBUG_DEVELOPMENT_MODE = yes
			if (process.env.DEBUG_DEVELOPMENT_MODE === "yes") {
				const user = await User.findOne({}).or([{user_role: "ADMIN"}, {user_roles: "ADMIN"}]);
				if (user) {
					req.login(user, function(err) {
						res.redirect("/");
						return;
					});
				} else {
					res.render('userloginform');
				}
			// Default way of logging in
			} else {
				res.render('userloginform');
			}
		})
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/user/login',
			failureFlash: true
		})
		);

	router.get('/logout', function (req, res) {
		req.logout();
		// DEBUG_DEVELOPMENT_MODE: prevent autologin when redirect to '/login'
		if (process.env.DEBUG_DEVELOPMENT_MODE === "yes") {
			res.redirect('/');
		} else {
			res.redirect('/user/login');
		}
	});

	//route catches invalid post requests.
	router.use('*', function route2(req, res, next) {
		if (res.locals.status == '406') {
			console.log("in error function");
			//do something to gracefully exit
			res.status(406).send("Current password not correct");

		}
	});

	return router;
	//module.exports = router;
}
//check to see if user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		var userID = req.user._id.toString();

		var ObjectId = require('mongodb').ObjectID;
		Promise.props({
			user: User.findOne({ '_id': ObjectId(userID) }).lean().execAsync()
		})
			.then(function (results) {
				if (!results) {
					res.redirect('/user/logout');
				}
				else {
					if (results.user.user_status == "ACTIVE") {
            res.locals.assign_tasks = results.user.assign_tasks;

						//format user data to send to front end
						results.user.salt = "";
						results.user.hash = "";
						if (results.user.contact_info.user_dob.dob_date != null) {
							var dobYear = results.user.contact_info.user_dob.dob_date.getFullYear();
							//get month and day with padding since they are 0 indexed
							var dobDay = ("00" + results.user.contact_info.user_dob.dob_date.getDate()).slice(-2);
							var dobMon = ("00" + (results.user.contact_info.user_dob.dob_date.getMonth() + 1)).slice(-2);
							results.user.contact_info.user_dob.dob_date = dobYear + "-" + dobMon + "-" + dobDay;
						}
            res.locals.assign_tasks = results.user.assign_tasks;
						res.locals.results = results;
						res.locals.email = results.user.contact_info.user_email;
						res.locals.role = results.user.user_role;
						res.locals.user_roles = results.user.user_roles;
						return next();

					}

					else {
						console.log("user is not active");
						res.redirect('/user/logout');
					}
				}



			})

			.catch(function (err) {
				console.error(err);
			})
			.catch(next);
	}
	else {
		console.log("no user id");
		res.redirect('/user/login');
	}
}

function isAdmin(req, res, next) {
	if (req.isAuthenticated()) {

		var userID = req.user._id.toString();
		var ObjectId = require('mongodb').ObjectID;
		Promise.props({
			user: User.findOne({ '_id': ObjectId(userID) }).lean().execAsync()
		})
			.then(function (results) {
				if (!results) {
					res.redirect('/user/logout');
				}
				else {
					if (results.user.user_status == "ACTIVE") {
            res.locals.assign_tasks = results.user.assign_tasks;

						if(results.user.user_role==="ADMIN" || (results.user.user_roles !== undefined && results.user.user_roles.indexOf('ADMIN') > -1 )){
						res.locals.email = results.user.contact_info.user_email;
							res.locals.role = results.user.user_role;
							res.locals.user_roles = results.user.user_roles;
							return next();

						}

						else {
							console.log("user is not admin");
							res.redirect('/user/logout');
						}
					}
					else {
						//user not active
						console.log("user not active");
						res.redirect('/user/logout');
					}
				}



			})

			.catch(function (err) {
				console.error(err);
			})
			.catch(next);
	}
	else {
		console.log("no user id");
		res.redirect('/user/login');
	}
}
//post request authenticator.  Checks if user is an admin
function isLoggedInPost(req, res, next) {
	if (req.isAuthenticated()) {
		var userID = req.user._id.toString();

		var ObjectId = require('mongodb').ObjectID;

		Promise.props({
			user: User.findOne({ '_id': ObjectId(userID) }).lean().execAsync()
		})
			.then(function (results) {
				if (!results) {
					//user not found in db.  Route to error handler
					res.locals.status = 406;
					return next('route');
				}
				else {

					if (results.user.user_status == "ACTIVE") {
						if(results.user.user_role==="ADMIN" || (results.user.user_roles !== undefined && results.user.user_roles.indexOf('ADMIN') > -1 ))
						{
								res.locals.email = results.user.contact_info.user_email;
							res.locals.role = results.user.user_role;
							res.locals.user_roles = results.user.user_roles;
							return next();
						}
						else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('admin') >-1)
                        {
							res.locals.email = results.user.contact_info.user_email;
							res.locals.role = results.user.user_role;
							res.locals.user_roles = results.user.user_roles;
                            return next();
                        }
						else {
							//user is not a vetting agent or admin, route to error handler
							res.locals.status = 406;
							return next('route');
						}
					}
					else {
						//user is not a vetting agent or admin, route to error handler
						res.locals.status = 406;
						return next('route');
					}
				}



			})

			.catch(function (err) {
				console.error(err);
			})
			.catch(next);
	}
	else {
		//user is not logged in
		console.log("no user id");
		res.locals.status = 406;
		return next('route');
	}
}


