// Used for process.env.DISABLE_CONSOLE_LOGGINGS
require('dotenv').config();

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var DocumentPackage = require('../models/documentPackage');
var AssessmentPackage = require('../models/assessmentPackage.js');

var api = require('../controllers/api');
var User = require('../models/userPackage');

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll


//Need ObjectID to search by ObjectID
var ObjectId = require('mongodb').ObjectID;

module.exports = function(passport) {
router.get('/', isLoggedIn, api.getDocumentStatusSite, function(req, res, next) {

	//separate applications in res.locals.results based on status of
	//assessemnt pending or assessment complete
	var payload = {};
	if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
		console.log(res.locals.results);
	}
	if(res.locals.results.site[0] == null) {
		if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
			console.log('[ ROUTER ] /site :: Unable to find Document Packages with status: \'assess\'');
		}
	}
	else {
		res.locals.results.site.forEach(function (element) {
            element = formatElement(element);
        });
	}

	payload.site = res.locals.results.site;

	if(res.locals.results.complete[0] == null) {
		if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
			console.log('[ ROUTER ] /site :: Unable to find Document Packages with status: \'assess\'');
		}
	}
	else {
		res.locals.results.complete.forEach(function (element) {
            element = formatElement(element);
        });
	}

	payload.complete = res.locals.results.complete;
	payload.user = req.user._id;
	payload.user_email = res.locals.email;
	payload.user_role = res.locals.role;
	payload.user_roles = res.locals.user_roles;

	if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
		console.log("payload");
		console.log(payload);
	}
	
	res.render('siteassessment', payload);
});

router.get('/:id', isLoggedIn, api.getDocumentSite, api.getProjPartnersLeaders, function(req, res, next) {
	if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
    //Checking what's in params
    //console.log("Rendering application " + ObjectId(req.params.id));
		//TEST
		console.log("rendering test application");
	}
    var payload = {}
	payload.doc = res.locals.results.doc[0];
	payload.work = res.locals.results.work;
	payload.user = req.user._id;
	payload.user_email = res.locals.email;
	payload.user_role = res.locals.role;
	payload.user_roles = res.locals.user_roles;
  if (res.locals.results.assessment && res.locals.results.assessment.length > 0) {
		if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
			console.log("Found assessment: ", res.locals.results.assessment);
		}
    payload.assessment = res.locals.results.assessment;
  } else {
		payload.assessment = [AssessmentPackage.empty];
		if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
			console.log("No assessment found. Using empty: ", payload.assessment);
		}
  }

	payload.part = res.locals.results.part||req.partnerTime;			//Data for Partners Tab Partial


	if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
		console.log("results");
		console.log(payload);
	}
 
	res.render('siteassessmenttool', payload);


});



//same as vetting route.  Shouldn't be issues with logic as is
router.route('/additem')
	.post(isLoggedInPost, api.addWorkItem, function(req, res) {
	if(res.locals.status != '200'){
        res.status(500).send("Could not add work item");
    }
    else{
        res.json(res.locals);
    }
	});

//added logic to api.updateWorkItem to handle site agent. 
//needs role from 'isLoggedInPost' route	
router.route('/updateitem')
	.post(isLoggedInPost, api.updateWorkItem, function(req, res) {
	if(res.locals.status != '200'){
        res.status(500).send("Could not update work item");
    }
    else{
        res.json(res.locals);
    }
	});

router.route('/updatesummary')
	.post(isLoggedInPost, api.putUpdateDocument, function(req, res) {
	if(res.locals.status != '200'){
        res.status(500).send("Could not update work item");
    }
    else{
        res.json(res.locals);
    }
	});	

  // Handle saving the assessment checklist.
router.route('/assessment')
	    .post(isLoggedInPost, api.saveAssessmentDocument, function (req, res) {
				if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
					console.log('from /site/assessment')
					console.log(res.locals)
				}
        if (res.locals.status !== '200') {
          res.status(500).send("Could not update assessment document");
        } else {
          res.json(res.locals.results);
        }
      });


//route catches invalid post requests.
router.use('*', function route2(req, res, next) {
	if(res.locals.status == '406'){
		if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
			console.log("in error function");
		}
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
        case 'assess':
            status = 'Site Assessment - Pending';
            break;
		case 'assessComp':
			status = 'Site Assessment - Complete';
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
			if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
				console.log(req.user._id);
			}
			var userID = req.user._id.toString();

			if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
				console.log("userID");
				console.log(userID);
			}
			var ObjectId = require('mongodb').ObjectID;
			Promise.props({
				user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
			})
			.then(function (results) {
				if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
					console.log(results);
				}

					if (!results) {
						res.redirect('/user/logout');
					}
					else {
						if(results.user.user_status == "ACTIVE") {
              res.locals.assign_tasks = results.user.assign_tasks;
              
							if(results.user.user_role == "VET" || results.user.user_role == "ADMIN" || results.user.user_role == "SITE") {
								res.locals.email = results.user.contact_info.user_email;
								res.locals.role = results.user.user_role;
								res.locals.user_roles = results.user.user_roles;
								return next();

							}
							else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('SITE') >-1)
						{
							res.locals.email = results.user.contact_info.user_email;								
							res.locals.role = results.user.user_role;
							res.locals.user_roles = results.user.user_roles;
							return next();
						}

							else {
								if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
									console.log("user is not required role");
								}
								res.redirect('/user/logout');
							}
						}
						else {
							if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
								//user not active
								console.log("user not active");
							}
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
			if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
				console.log("no user id");
			}
			res.redirect('/user/login');
		}
}

//post request authenticator.  Checks if user is an admin or vetting or site agent
function isLoggedInPost(req, res, next) {
		if(req.isAuthenticated()) {
			if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
				console.log(req.user._id);
			}
			var userID = req.user._id.toString();

			var ObjectId = require('mongodb').ObjectID;

			Promise.props({
				user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
			})
			.then(function (results) {
				if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
					console.log(results);
				}

					if (!results) {
						//user not found in db.  Route to error handler
						res.locals.status = 406;
						return next('route');
					}
					else {
						if(results.user.user_status == "ACTIVE") {							
							if(results.user.user_role == "VET" || results.user.user_role == "ADMIN" || results.user.user_role == "SITE" || results.user.user_role=="PROJECT_MANAGEMENT") {
								res.locals.email = results.user.contact_info.user_email;
								res.locals.role = results.user.user_role;
								if (results.user.user_roles) {
									res.locals.user_roles = results.user.user_roles;
								}
								return next();

							}
							else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('SITE') >-1)
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
			if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
				//user is not logged in
				console.log("no user id");
			}
			res.locals.status = 406;
			return next('route');
		}
}
