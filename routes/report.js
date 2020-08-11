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
    //Get Route for the Reports module that will query for all upcoming projects 
    router.get('/', isLoggedIn, api.getUpcomingProjects, function(req, res, next){
            
        // create object 'payload' to return the results of the getUpcomingProjectsAPICall
        let myPayload = {};
        
        myPayload.upComing = res.locals.upComing;
        myPayload.upComing.map(formatStatusUpComing)
        var context = {"payload": myPayload};
        context.user = req.user._id;
        context.user_email = res.locals.email;
        context.user_role = res.locals.role;
        context.user_roles = res.locals.user_roles;
        res.render('projectsumreport', context); 
    })
    
    //Route for ajax call by Search Tab on the Report Module
    router.get('/search', isLoggedIn, api.Search, function(req,res,next){
        //Change the format of the returned status to be the correct format
        res.locals.results.map(formatStatusUpSearch)
        res.send(res.locals.results)      
    })

    //Route for ajax call by the endReport Tab
    router.get('/endReport', isLoggedIn, api.getPartnerProjectCount, api.getProjEndReport, function(req,res, next){
        let payload = {}
        //Populating the object with responses from the API with project counts for partners
        //and general partner information
        payload.projCount = res.locals.results
        payload.projTable = res.locals.projecttable

        //Calculating totals for costs and total_volunteers
        let total_cost = 0
        payload.projTable.forEach(item => {
            total_cost += item.cost === "N/A" || item.cost === "No Assessment"? 0 : item.cost})
        let total_volunteers = 0
        payload.projTable.forEach(item => {
            total_volunteers += item.volunteers === "N/A" || item.volunteers === "No Assessment" ? 0 : item.volunteers})
        payload.total_cost = total_cost
        payload.total_volunteers = total_volunteers

        //Sending the result to the page
        res.send(payload)
    })

    router.get('/upComingExport', api.getUpcomingProjects, function(req, res, next){
        let myPayload = {};

        myPayload.upComing = res.locals.upComing;
        var context = {"payload": myPayload};
        context.user = req.user._id;
        context.user_email = res.locals.email;
        context.user_role = res.locals.role;
        context.user_roles = res.locals.user_roles;
        res.render('upComingExport', context)
    })
    
    return router;
};

//MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM//
//Checks whether the current user is a project management vetting agent
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
        
                    if(results.user.user_role == "PROJECT_MANAGEMENT") {
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
        case 'handle':
            status = "Handle-It To Be Assigned";
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
