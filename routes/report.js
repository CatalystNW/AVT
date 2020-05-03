var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../mongoose/connection');

var api = require('../controllers/api'); // INCLUDE API functionality
var User = require('../models/userPackage');
var ProjectWrapUpPackages = require('../models/projectWrapUpPackage'); // GLEN added this line

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

var ObjectId = require('mongodb').ObjectID;

module.exports = function(passport){
    router.get('/', isLoggedIn, getCompletedProjectsByYear, function(req, res){
        
    // create object 'payload' to return
    var payload = {};
    payload.completedProjects = res.locals.results;
    res.render('reporting', payload);
    // 
    return router;
}

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
function getCompletedProjectsByYear(req, res, next) {

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
                "# projects completed": {$size: "$total_projects"}
            }
        }]).execAsync()
        
    })
    .then(function(results) {

        if(!results){
            console.log('report.js ERROR: total projects aggregation failure!');
        }
        else {
            console.log('report.js total projects aggregation passed.');
            results.completedYearAndQuantity = completedProjects;
            next(); 
        }
    }) 
    .catch(function(err){ console.err(err);})
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
