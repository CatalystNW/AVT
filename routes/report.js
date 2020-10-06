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
        //console.log('--------------WHAT FOLLOWS ARE THE RESULTS OF OUR QUERY----------')
        //console.log(context)
        //console.log('---------------END 3-------------------------------------')
        res.render('projectsumreport', context); 
    })
    
    //Route for ajax call by Search Tab on the Report Module
    router.get('/search', isLoggedIn, api.Search, function(req,res,next){
        //Change the format of the returned status to be the correct format
        res.locals.results.map(formatStatusUpSearch)
        res.send(res.locals.results)      
    })

    //Route for ajax call by the endReport Tab
    router.get('/endReportProj', isLoggedIn, api.getPartnerProjectCount, api.getProjEndReport, function(req,res, next){
        let payload = {}
        //Populating the object with responses from the API with project counts for partners
        //and general partner information
        payload.projCount = res.locals.results
        payload.projTable = res.locals.projecttable

        //Calculating totals for costs and total_volunteers
        let numberHandle = 0
        let numberProj = 0
        let total_cost = 0
        let total_volunteers = 0
        let total_labor_count = 0
        payload.projTable.forEach(item => {
            if (!('project' in item)){
                item.project = {}
            }
            let project = item.project
            item.project.site_host = 'site_host' in project && project.site_host ? project.site_host : 'N/A'
            item.project.crew_chief = 'crew_chief' in project && project.crew_chief ? project.crew_chief : 'N/A'
            item.project.project_advocate = 'project_advocate' in project && project.project_advocate ? project.project_advocate : 'N/A'
            item.project.project_start = 'project_start' in project ? formatDate(project.project_start) : 'N/A'
            
            let volunteer_addition = 0
            if (!('actual_volunteer_count' in project) || !(project.actual_volunteer_count)){
                item.project.actual_volunteer_count = 'N/A'
            }
            else {
                let volunteers = project.actual_volunteer_count
                volunteer_addition += isNaN(volunteers) ? 0 : parseInt(volunteers)
            }
            total_volunteers += volunteer_addition

            let cost_addition = 0
            if (!('actual_cost' in project) || !(project.actual_cost)){
                item.project.actual_cost = 'N/A'
            }
            else {
                let cost = project.actual_cost.replace('$', '')
                cost_addition = isNaN(cost) ? 0 : parseInt(cost)
            }
            total_cost += cost_addition

            let labor_addition = 0
            if (!('actual_labor_count' in project) || !(project.actual_labor_count)){
                item.project.actual_labor_count = 'N/A'
            }
            else {
                let labor = project.actual_labor_count
                labor_addition = isNaN(labor) ? 0 : parseInt(labor)
            }
            total_labor_count += labor_addition

            if (item.project.status.includes('handle')){
                numberHandle += 1
            }
            else {
                numberProj += 1
            }
        })  
        payload.total_cost = total_cost
        payload.total_volunteers = total_volunteers
        payload.total_labor_count = total_labor_count
        payload.numberHandle = numberHandle
        payload.numberProj = numberProj
        console.log(payload.total_labor_count)

        //Sending the result to the page
        res.send(payload)
    })

    router.get('/endReportApp', isLoggedIn, api.getApplicationEndReport, function(req,res, next){
        let payload = {}
        //Populating the object with responses from the API with project counts for partners
        //and general partner information
        payload.projTable = res.locals.results
        //Calculating totals for costs and total_volunteers
        let total_cost = 0
        let total_volunteers = 0
        payload.projTable.forEach(item => {
            if (('assessment' in item) && ('estimates' in item.assessment)){
                let cost = item.assessment.estimates.total_cost
                let volunteers = item.assessment.estimates.volunteers_needed 
                total_cost += !isNaN(cost) ? cost : 0
                total_volunteers += !isNaN(volunteers) ? volunteers : 0
            }
            else {
                item.assessment = {};
                item.assessment.estimates = {}
            }
            if (!('project' in item)){
                item.project = {}
            }
            let project = item.project
            item.project.site_host = 'site_host' in project && project.site_host ? project.site_host : 'N/A'
            item.project.crew_chief = 'crew_chief' in project && project.crew_chief ? project.crew_chief : 'N/A'
            item.project.project_advocate = 'project_advocate' in project && project.project_advocate ? project.project_advocate : 'N/A'
            item.signature.client_date = formatDate(item.signature.client_date) 
        })
        console.log('does it get here')
        payload.total_cost = total_cost
        payload.total_volunteers = total_volunteers

        //Sending the result to the page
        console.log(payload)
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
    
    router.get('/endReportAppExport', api.getApplicationEndReport, function(req, res, next){
        let myPayload = {};

        myPayload.results = res.locals.results;
        var context = {"payload": myPayload};
        context.user = req.user._id;
        context.user_email = res.locals.email;
        context.user_role = res.locals.role;
        context.user_roles = res.locals.user_roles;
        res.render('appEndReportExport', context)
    })

    router.get('/endReportProjExport', api.getProjEndReport, function(req, res, next){
        let myPayload = {};
        myPayload.projecttable = res.locals.projecttable;
        var context = {"payload": myPayload};

        context.user = req.user._id;
        context.user_email = res.locals.email;
        context.user_role = res.locals.role;
        context.user_roles = res.locals.user_roles;
        res.render('projEndReportExport', context)
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

function formatDate(element)
{
	var Year = element.getFullYear();
    //get month and day with padding since they are 0 indexed
    var Day = ( "00" + element.getDate()).slice(-2);
    var Mon = ("00" + (element.getMonth()+1)).slice(-2);
	return Mon + "/" + Day + "/" + Year;
}

//Formats the status of the results from the Upcoming projects query 
function formatStatusUpComing(element) {
    var status;
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
    console.log(element.application.name.first, element.status)
    switch (element.status){
        case 'assessComp':
            status =  'Site Assessment - Complete';
            break;
        case 'approval':
            status =  'Approval Process';  
            break;
        case 'waitlist':
            status =  'Waitlist';
            break;
        case 'phone':
            status =  'Phone Screen';
            break;
        case 'project':
            status =  'Converted to Project';
            break;
        case 'handle':
            status =  "Handle-It";
            break;
        case 'declined':
            status =  "Declined";
            break;
        case 'withdrawn':
            status =  "Withdrawn";
            break;
        case 'documents':
            status =  "Documents Needed";
            break;
        case 'withdrawnooa':
            status =  "Out of Area";
            break;
        case 'discuss':
            status =  "Dicussion Phase";
            break;
        case 'assess': 
            status =  "Site Assessment - Pending";
            break;
        case 'new': 
            status =  "New Document";
            break;
        default: 
            status =  "Error"
            break;
    }
    console.log(element.application.name.first, element.status)
    element.status = status;
    return element;
}
