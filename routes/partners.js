var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var DocumentPackage = require('../models/documentPackage');
var AssessmentPackage = require('../models/planningPackage.js');
var PartnerPackage = require('../models/partnerPackage');

var api = require('../controllers/api');
var User = require('../models/userPackage');

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

//Need ObjectID to search by ObjectID
var ObjectId = require('mongodb').ObjectID;

module.exports = function(passport) {

router.get('/', isLoggedInMultiRoles, api.getProjPartnersLeaders, function(req, res, next) {
	if(! res.locals.results) {
		console.log('[ ROUTER ] /partners :: Unable to find any Partners in database');
	}
	//results.partner = res.locals.results.pAll;
	//results.pAssoc = res.locals.results.pAssoc;
	//results.pCount = res.locals.results.pCount;

	// res.render('partners', results);
	res.json(res.locals.results);
});



//isLoggedInPost, 
router.route('/getPartnerAssoc', isLoggedInMultiRoles)									// FOR getProjPartnersLeaders
	.post(api.getProjPartnersLeaders, function(req, res) {

	console.log("\n/partners/getPartnerAssoc POST TRIGGERED...\nreq:\n" + req);
	if(res.locals.status != '200'){
        res.status(500).send("Could not get partner Associations");
    }
    else{
    	console.log("res: " + res);
        res.json(res.locals);
    }
});


router.route('/createPartnerAssoc', isLoggedInMultiRoles)
	.post(api.setProjPartnersLeaders, function(req, res) {
	
	console.log("\n/partners/createPartnerAssoc POST TRIGGERED...\nreq:\n" + req);
	if(res.locals.status != '200'){
        res.status(500).send("Could not create partner Associations");
    }
    else {
    	console.log("res: " + res);
        res.json(res.locals);
    }
});


//Create Partners  
router.route('/createPartner')
	.post(api.createPartner, function(req, res) {
	
	console.log("\n/partners/createPartner POST TRIGGERED...\nreq:\n" + req);
	if(res.locals.status != '200'){
        res.status(500).send("Could not create partner");
    }
    else {
    	console.log("res: " + res);
        //res.json(res.locals);
        res.status(200).end();
    }
});


router.route('/deletePartner')
	.post(api.deletePartner, function(req, res) {

	console.log("\n/partners/deletePartner AFTER POST TRIGGERED...\nreq:\n" + req);
	if(res.locals.status != '200'){
        res.status(500).send("Could not remove Partner");
    }
    else {
        res.json(res.locals);
    }
});

router.route('/getPartner')
	.post(api.getPartner, function(req, res) {

	console.log("\n/partners/getPartner AFTER POST TRIGGERED...\nreq:\n" + req);
	if(res.locals.status != '200'){
        res.status(500).send("Could not get partners");
    }
    else{
    	console.log(res);
        res.json(res.locals);
    }
});


	
//route catches invalid post requests.
router.use('*', function route2(req, res, next) {
	if(res.locals.status == '406'){
		console.log("in error function");
        res.status(406).send("Could not update note");
		res.render('/user/login');
    }
});

function formatElement(element) {
    formatStatus(element);
    formatDate(element);
    return element;
}

/**
 * Takes the VERY long date in the DB and makes it into a nicer format
 * @param element (the document package)
 * @returns: The document package with formatted date
 */
function formatDate(element)
{
	var Year = element.updated.getFullYear();
    //get month and day with padding since they are 0 indexed
    var Day = ( "00" + element.updated.getDate()).slice(-2);
    var Mon = ("00" + (element.updated.getMonth()+1)).slice(-2);
		element.updated = Mon + "/" + Day + "/" + Year;
		element.updated_full_date = Year + "/" + Mon + "/" + Day;

	if(element.signature && element.signature.client_date != "") {
	var appYear = element.signature.client_date.getFullYear();
	var appDay = ("00" + element.signature.client_date.getDate()).slice(-2);
	var appMon = ("00" + (element.signature.client_date.getMonth()+1)).slice(-2);
	element.signature.client_date = appMon + "/" + appDay + "/" + Year;
	element.signature.client_full_date = Year + "/" + appMon + "/" + appDay;
	}
    return element;
}

/**
 * Takes the status string from the DB and makes it more detailed for the front end
 * @param element (the document package)
 * @returns: The document package with wordier status
 */
function formatStatus(element) {
    var status;

    switch (element.status){
        case 'new':
            status = 'NEW';
            break;
        case 'phone':
            status = 'Phone Call Needed';
            break;
        case 'handle':
            status = 'Handle-It';
            break;
        case 'documents':
            status = 'Awaiting Documents';
            break;
        case 'discuss':
            status = 'On Hold - Pending Discussion';
            break;
        case 'assess':
            status = 'Site Assessment - Pending';
            break;
		case 'assessComp':
			status = 'Site Assessment - Complete';
			break;
        case 'approval':
            status = 'Approval Process';
            break;
        case 'declined':
            status = 'Declined';
			break;
		case 'withdrawnooa':
			status = 'Withdrawn - Out of Service Area';
			break;
        case 'withdrawn':
            status = 'Withdrawn';
            break;
        case 'project':
            status ='Approved Project';
            break;
		case 'handleToBeAssigned':
			status = 'Handle - To Be Assigned';
			break;
        case 'handleAssigned':
            status = 'Handle - Pending';
            break;
		case 'handleCompleted':
			status = 'Handle - Completed';
			break;
		case 'projectUpcoming':
			status = 'Project - Upcoming';
			break;
        case 'projectInProgress':
            status = 'Project - In Progress';
            break;
		case 'projectGoBacks':
			status = 'Project - Go Backs';
			break;
		case 'projectCompleted':
			status = 'Project - Completed';
			break;
        default:
            status = element.status;
    }

    element.status = status;
    return element;
}



return router;
}

//check to see if user is logged in and a vetting agent or site or an admin
function isLoggedIn(req, res, next) {

		if(req.isAuthenticated()) {
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
						res.redirect('/user/logout');
					}
					else {
						if(results.user.user_status == "ACTIVE") {
              res.locals.assign_tasks = results.user.assign_tasks;
              
							if(results.user.user_role == "VET" || results.user.user_role == "ADMIN" || results.user.user_role == "SITE") {
								res.locals.email = results.user.contact_info.user_email;
								res.locals.role = results.user.user_role;
								return next();

							}
							else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('PROJECT_MANAGEMENT') >-1)
							{
								res.locals.role = results.user.user_role;
								res.locals.user_roles = results.user.user_roles;
								return next();
							}

							else {
								console.log("user is not required role");
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

		.catch(function(err) {
                console.error(err);
        })
         .catch(next);
		}
		else {
			console.log("no user id");
			res.redirect('/user/login');
		}
}

//check to see if user is logged in (*NEW* - supports multiple roles) 
function isLoggedInMultiRoles(req, res, next) {

		if(req.isAuthenticated()) {
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
						res.redirect('/user/logout');
					}
					else {
						if(results.user.user_status == "ACTIVE") {
              res.locals.assign_tasks = results.user.assign_tasks;
              
							if(results.user.user_roles.indexOf("ADMIN") !== -1 || results.user.user_roles.indexOf("PROJECT_MANAGEMENT") !== -1 || results.user.user_roles.indexOf("VET") !== -1 || results.user.user_roles.indexOf("SITE") !== -1) {
								res.locals.email = results.user.contact_info.user_email;
								res.locals.role = results.user.user_role;
								res.locals.user_roles = results.user.user_roles;
								return next();

							}
							else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('PROJECT_MANAGEMENT') >-1)
							{
								res.locals.role = results.user.user_role;
								res.locals.user_roles = results.user.user_roles;
								return next();
							}

							else {
								console.log("user is not required role");
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

		.catch(function(err) {
                console.error(err);
        })
         .catch(next);
		}
		else {
			console.log("no user id");
			res.redirect('/user/login');
		}
}

//post request authenticator.  Checks if user is an admin or vetting or site agent
function isLoggedInPost(req, res, next) {
		if(req.isAuthenticated()) {
			console.log(req.user._id);
			var userID = req.user._id.toString();

			var ObjectId = require('mongodb').ObjectID;

			Promise.props({
				user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
			})
			.then(function (results) {
				console.log(results);

					if (!results) {
						//user not found in db.  Route to error handler
						res.locals.status = 406;
						return next('route');
					}
					else {
						if(results.user.user_status == "ACTIVE") {
							if(results.user.user_roles.indexOf("ADMIN") !== -1 || results.user.user_roles.indexOf("PROJECT_MANAGEMENT") !== -1 || results.user.user_roles.indexOf("VET") !== -1 || results.user.user_roles.indexOf("SITE") !== -1) {
								res.locals.email = results.user.contact_info.user_email;
								res.locals.role = results.user.user_role;
								res.locals.user_roles = results.user.user_roles;
								return next();

							}
							else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('PROJECT_MANAGEMENT') >-1)
							{
								res.locals.role = results.user.user_role;
								res.locals.user_roles = results.user.user_roles;
								return next();
							}

						}
						else {
							//user is not active
							res.locals.status = 406;
							return next('route');
						}
					}

			})

		.catch(function(err) {
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

//post request authenticator.  (*NEW* - Supports Multiple roles)
function isLoggedInPostMultiRoles(req, res, next) {
		if(req.isAuthenticated()) {
			console.log(req.user._id);
			var userID = req.user._id.toString();

			var ObjectId = require('mongodb').ObjectID;

			Promise.props({
				user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
			})
			.then(function (results) {
				console.log(results);

					if (!results) {
						//user not found in db.  Route to error handler
						res.locals.status = 406;
						return next('route');
					}
					else {
						if(results.user.user_status == "ACTIVE") {
							//if(results.user.user_roles == "ADMIN" || results.user.user_roles == "PROJECT_MANAGEMENT" || results.user.user_roles == "VET" || results.user.user_roles == "SITE") {
								res.locals.email = results.user.contact_info.user_email;
								res.locals.role = results.user.user_role;
								res.locals.user_roles = results.user.user_roles;
								return next();

							//}
							// else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('PROJECT_MANAGEMENT') >-1)
							// {
							// 	res.locals.role = results.user.user_role;
							// 	res.locals.user_roles = results.user.user_roles;
							// 	return next();
							// }

						}
						else {
							//user is not active
							res.locals.status = 406;
							return next('route');
						}
					}

			})

		.catch(function(err) {
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
