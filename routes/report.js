var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../mongoose/connection');

var api = require('../controllers/api'); // INCLUDE API functionality
var User = require('../models/userPackage');
var DocumentPackage = require('../models/documentPackage')
var ProjectWrapUpPackages = require('../models/projectWrapUpPackage'); // GLEN added this line

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

var ObjectId = require('mongodb').ObjectID;

module.exports = function(passport){
    router.get('/', isLoggedIn, api.getUpcomingProjects, function(req, res, next){
        
    // create object 'payload' to return
    let myPayload = {};
    console.log(res.locals)
    myPayload.upComing = res.locals.upComing;
    myPayload.upComing.map(formatStatusUpComing)
    myPayload.assessComp = res.locals.assessComp;
    myPayload.assessComp.map(formatStatusUpComing)
    myPayload.approval = res.locals.approval
    myPayload.approval.map(formatStatusUpComing)
    myPayload.waitlist = res.locals.waitlist
    myPayload.waitlist.map(formatStatusUpComing)
    //console.log(myPayload)

    //console.log(payload.applicationsForYear)
    //console.log(payload.approval);
    res.render('projectsumreport', {"payload":myPayload}); 
    })
    
    router.get('/search', api.Search, function(req,res,next){
        console.log(res.locals)
        res.locals.results.map(formatStatusUpSearch)
        res.send(res.locals.results)      
    })

    router.get('/endReport', api.getPartnerProjectCount, getCompletedProjectsByYear, getApplicationsByYear, api.getProjEndReport, function(req,res, next){
        let payload = {}
        payload.completedProjects = res.locals.completedYearAndQuantity;
        payload.applicationsForYear = res.locals.applications;
        payload.projCount = res.locals.results
        payload.projTable = res.locals.projecttable
        let total_cost = 0
        payload.projTable.forEach(item => {total_cost += item.cost === "N/A" ? 0 : item.cost})
        let total_volunteers = 0
        payload.projTable.forEach(item => {total_volunteers += item.volunteers === "N/A" ? 0 : item.volunteers})
        payload.total_cost = total_cost
        payload.total_volunteers = total_volunteers
        console.log(payload.projTable)
        res.send(payload)
    })

    router.get('/exportPDF/upComing')
    return router;
};


/* *****************************************************************
Aggregation function.

Dependencies:
Must use projectWrapUpPackage.js model (collection)

Returns:
Object. Every project completed by year, and the nummber of projects
completed.

Notes:
    should actually just find a specific year and the number of 
    projects completed for that year.

********************************************************************/
function getCompletedProjectsByYear (req, res, next) {

    console.log('getCompletedProjectsByYear starting');
      
    Promise.props({

        // GET # OF PROJECTS COMPLETED FOR EVERY YEAR -- needs
        completedProjects: ProjectWrapUpPackages.aggregate([{
            $match: {
                "signup_sheet_office.complete": true
            }
            },{
            $group: {
                _id: {
                    $year: { 
                        date: "$signup_sheet_office.completed_on"
                    }
                },
                "total_projects": {$push: { $year: { date: "$signup_sheet_office.completed_on" } } }
            } 
            }, {
            $project: {
                _id: 0,
                year: {$arrayElemAt: ["$total_projects", 0] },
                projectsCompleted: {$size: "$total_projects"}
            }
        }]).execAsync()
        
    })
    .then(function(results) {

        if(!results){
            console.log('report.js ERROR: total projects aggregation failure!');
        }
        else {
            console.log('report.js total projects aggregation passed.');
            res.locals.completedYearAndQuantity = results.completedProjects;
            next(); 
        }
    }) 
    .catch(function(err){ console.log(err);})
    .catch(next);

}



function getApplicationsByYear(req, res, next){
    console.log("Performing get Applications!")

    Promise.props({

        // GET # OF PROJECTS COMPLETED FOR EVERY YEAR -- needs
        applications: DocumentPackage.find({"app_year": 2020}).count().execAsync()
        
    })
    .then(function(results) {

        if(!results){
            console.log('report.js ERROR: total projects aggregation failure!');
        }
        else {
            console.log('report.js total projects aggregation passed.');
            res.locals.applications = results.applications;
            next(); 
        }
    }) 
    .catch(function(err){ console.log(err);})
    .catch(next);
}
//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
function isLoggedIn(req, res, next) {

    if(req.isAuthenticated()) {
        var userID = req.user._id.toString();
        var ObjectId = require('mongodb').ObjectID;
        Promise.props({
            user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
        })
        .then(function (results) {
            if (!results) {
                res.redirect('/user/logout');
            }
            else {
                if(results.user.user_status == "ACTIVE") {
                    res.locals.assign_tasks = results.user.assign_tasks;
        
                    if(results.user.user_role == "VET" || results.user.user_role == "ADMIN") {
                        res.locals.email = results.user.contact_info.user_email;
                        res.locals.role = results.user.user_role;
                        res.locals.user_roles = results.user.user_roles;
                        return next();

                    }
                    else if(results.user.user_roles !== undefined  && results.user.user_roles.indexOf('PROJECT_MANAGEMENT') > -1) {
                        res.locals.email = results.user.contact_info.user_email;
                        res.locals.role = results.user.user_role;
                        res.locals.user_roles = results.user.user_roles;
                        return next();

                    }

                    else {
                        
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
        .catch(function(err) {console.error(err);
        })
        .catch(next);
    }
    else {
        console.log("no user id");
        res.redirect('/user/login');
    }
}


//COPIED FROM: projectsummary.js (/route/)
//post request authenticator.  Checks if user is an admin or vetting agent
function isLoggedInPost(req, res, next) {
    if(req.isAuthenticated()) {
        var userID = req.user._id.toString();
        var ObjectId = require('mongodb').ObjectID;

        Promise.props({
            user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
        })
        .then(function (results) {
                if (!results) {
                    //user not found in db.  Route to error handler
                    res.locals.status = 406;
                    return next('route');
                }
                else {

                    if(results.user.user_role == "VET" || results.user.user_role == "ADMIN") {
                        return next();

                    }
                    else if (results.user.user_roles !== undefined && (results.user.user_roles.indexOf('VET') >-1|| results.user.user_roles.indexOf('PROJECT_MANAGEMENT') >-1))
                    {
                        
                        return next();
                    }
                    else {
                        //user is not a vetting agent or admin, route to error handler
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

//Formats the status of the results from the Upcoming projects query 
function formatStatusUpComing(element) {
    var status;
    console.log(element.status)
    switch (element.status){
        case 'assess':
            status = 'Site Assessment - Pending';
            break;
		case 'assessComp':
			status = 'Site Assessment - Complete';
            break;
        case 'approval':
            status = 'Approval Process';
            break;   
        case 'waitlist':
            status = 'Waitlist';
            break; 
        case 'project':
            status = 'Project - Upcoming';
            break; 
        default:
            status = element.status;
    }

    element.status = status;
    return element;
}

//Formats the results from our search results
function formatStatusUpSearch(element) {
    var status;
    console.log(element.status)
    switch (element.status){
        case 'assess':
            status = 'Site Assessment - Pending';
            break;
		case 'assessComp':
			status = 'Site Assessment - Complete';
            break;
        case 'approval':
            status = 'Approval Process';
            break;   
        case 'waitlist':
            status = 'Waitlist';
            break; 
        case 'project':
            status = 'Approved Project';
            break; 
        case 'handle':
            status = "Handle-It";
            break;
        default:
            status = element.status;
    }

    element.status = status;
    return element;
}
