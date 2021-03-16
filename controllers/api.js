// Used for process.env.DISABLE_CONSOLE_LOGGINGS
require('dotenv').config();

/**
 * Most important note on this page. Currently this API function as middleware for an Express router.
 * Currently all functions are MIDDLEWARE in the Express app
 *      Middleware Docs:  https://expressjs.com/en/guide/using-middleware.html
 *      Inspiration:      https://medium.com/@jeffandersen/building-a-node-js-rest-api-with-express-46b0901f29b6#.6ttj8e6rs
 *                        https://medium.com/@jeffandersen/building-a-node-js-rest-api-with-express-part-two-9152661bf47#.4ofcnx1fv
 *
 * A more normal express function might look like this:
 *      router.get('/index', function(req, res) { ...do the magic }
 *
 * To use this API as middleware simply tacj the function between the route ('/index') and the function().
 *      router.get('/status', api.getDocumentByStatus, function(req, res) { ...do the magic }
 *
 * In this example getDocumentByStatus returns a JSON object
 *
 * They keep req, res, err, and next intact as they are passed around the route
 * It is best practice to store new variable in res.local.<your variable>
 */

/**
 * Import node modules and node exports
 * mongoose             - schemas, templates, queries
 * db                   - connection to the database server
 * DocumentPackage      - schema and model for DocumentPackage CRUD
 * HighlightPackage     - schema and model for HighlightPackage CRUD
 * VettingNotePackage   - schema and model for VettingNotePackage CRUD
 * bluebird             - converts mongoose API calls to ES6 promises
 *
 * Import any other required modules
 */

var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var DocumentPackage = require('../models/documentPackage');
var HighlightPackage = require('../models/highlightPackage');
var ProjectNotePackage = require('../models/projectNotePackage.js');
var VettingNotePackage = require('../models/vettingNotePackage');
var AssessmentPackage = require('../models/assessmentPackage.js');
var PlanningPackage = require('../models/planningPackage.js');
var ProjectPlanPackage = require('../models/projectPlanPackage.js');
var WorkItemPackage = require('../models/workItemPackage');
var UserPackage = require('../models/userPackage');
var RolePackage = require('../models/rolePackage');
var ProjectWrapUpPackage = require('../models/projectWrapUpPackage.js');
var ProjectSummaryPackage = require('../models/projectSummaryPackage.js');
var PartnerPackage = require('../models/partnerPackage.js');
var LeadtimeDefaults = require('../models/leadtimeDefaults.js');

var FinancialPackage = require('../models/finPackage');
var crypto = require('crypto');
var bluebird = require('bluebird');
var Promise = require('bluebird'); // Import promise engine
const { match } = require('assert');
mongoose.Promise = require('bluebird'); // Tell mongoose to use bluebird
Promise.promisifyAll(mongoose); // Convert all of mongoose to promises with bluebird
var ObjectId = require('mongodb').ObjectId;
module.exports = {
    /**
     * Description: retrieve all Document Packages from the database
     * Type: GET
     * Params: none
     * Address: api.getAllDocuments
     * Returns: results[array of Document Packages]
     */
    getAllDocuments: function (req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log what we are calling to the console
            console.log('[ API ] getAllDocuments :: Call invoked');
        }

        // Create an object to be filled with promises. The object will look like:
        // .then(function (<name of object here>) {...})
        // If the name is results, use results.DocumentPackage[index].<what you need>
        // Obviously it will be an array of DocumentPackages in this example
        Promise.props({
            application: DocumentPackage.find().lean().execAsync(),
            count: DocumentPackage.find().count().execAsync()
        })
            .then(function (results) {
                // Save the results into res.locals
                res.locals.results = results;

                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    for (var i = 0, len = results.count; i < len; i++) {
                        console.log('[ API ] getAllDocuments :: Found document package with _id: ' + results.application[i]._id);
                    }
                    console.log('[ API ] getAllDocuments :: Document package count:', results.count);
                }

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },

    /**
     * Description: retrieve a DocumentPackage from the database by _id
     * Type: GET
     * Params: _id of Document Package
     * Address: api.getDocumentById
     * Returns: results object (mimics documentPackage.js)
     */
    getDocumentById: function (req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the api call we make along with the _id used by it
            console.log('[ API ] getDocumentById :: Call invoked with id: ' + req.params.id);
        }
		
        // Use results.DocumentPackage.<whatever you need> to access the information
        Promise.props({
            document: DocumentPackage.findById(req.params.id).lean().execAsync()
			/*document: DocumentPackage.aggregate(
				[
				{$match: { _id : mongoose.Types.ObjectId(req.params.id)}},
					{ $redact: {
						$cond: {
							if: { $eq: [ "$level", 5 ] },
							then: "$$PRUNE",
							else: "$$DESCEND"
						}
					}}
					
				]
			).execAsync()*/
			
        })
            .then(function(results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log("results");
                    
                    
                    console.log(results);
                    if (!results) {
                        console.log('[ API ] getDocumentById :: Documents package found: FALSE');
                    }
                    else {
                        console.log('[ API ] getDocumentById :: Documents package found: TRUE');
                    }
                }

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

	//site assessment get docs for view
	getDocumentStatusSite: function (req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the api call we make along with the _id used by it
            console.log('[ API ] getDocumentStatusSite :: ');
        }
		
        // Use results.DocumentPackage.<whatever you need> to access the information
        Promise.props({
            //document: DocumentPackage.findById(req.params.id).lean().execAsync()
			site: DocumentPackage.aggregate(
				[
				{$match: { status: "assess"}},
					{ $redact: {
						$cond: {
							if: { $eq: [ "$level", 5 ] },
							then: "$$PRUNE",
							else: "$$DESCEND"
						}
					}}
					
				]
			).execAsync(),
			
			complete: DocumentPackage.aggregate(
				[
				{$match: { status: "assessComp" }},
					{ $redact: {
						$cond: {
							if: { $eq: [ "$level", 5 ] },
							then: "$$PRUNE",
							else: "$$DESCEND"
						}
					}}
					
				]
			).execAsync()
        })
            .then(function(results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log("results");
                    
                    console.log(results);
                    if (!results) {
                        console.log('[ API ] getDocumentStatusSite :: Documents package found: FALSE');
                    }
                    else {
                        console.log('[ API ] getDocumentStatusSite :: Documents package found: TRUE');
                    }
                }

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

	
	
	//site assessment get docs for view
	getDocumentSite: function (req, res, next) {
    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
        // Log the api call we make along with the _id used by it
        console.log('[ API ] getDocumentSite :: Call invoked with id: ' + req.params.id);
    }
    res.locals.docId = req.params.id;
		// Use results.DocumentPackage.<whatever you need> to access the information
    Promise.props({
      //document: DocumentPackage.findById(req.params.id).lean().execAsync()
			doc: DocumentPackage.aggregate([
				{$match: { _id : mongoose.Types.ObjectId(req.params.id)}},
				{ $redact: {
					$cond: {
						if: { $eq: [ "$level", 5 ] },
						then: "$$PRUNE",
						else: "$$DESCEND"
					}
				}}
			]).execAsync(),
			work: WorkItemPackage.find({applicationId: ObjectId(req.params.id)}).lean().execAsync(),
      assessment: AssessmentPackage.find({ applicationId: ObjectId(req.params.id) }).lean().execAsync(),
      projectNotes: ProjectNotePackage.find({applicationId: ObjectId(req.params.id)}).lean().execAsync(),
    }).then(function(results) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("results\n", results);
            if (!results) {
                console.log('[ API ] getDocumentStatusSite :: Documents package found: FALSE');
            }
            else {
                console.log('[ API ] getDocumentStatusSite :: Documents package found: TRUE');    
            }
        }
			res.locals.results = results;
      next();

    }).catch(function(err) {
      console.error(err);
    }).catch(next);
  },
//site assessment get docs for view
getDocumentPlanning: function (req, res, next) {
    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
        // Log the api call we make along with the _id used by it
        console.log('[ API ] getDocumentSite :: Call invoked with id: ' + req.params.id);
    }
		// Use results.DocumentPackage.<whatever you need> to access the information
    Promise.props({
      //document: DocumentPackage.findById(req.params.id).lean().execAsync()
			doc: DocumentPackage.aggregate([
				{$match: { _id : mongoose.Types.ObjectId(req.params.id)}},
				{ $redact: {
					$cond: {
						if: { $eq: [ "$level", 5 ] },
						then: "$$PRUNE",
						else: "$$DESCEND"
					}
				}}
			]).execAsync(),
			work: WorkItemPackage.find({applicationId: ObjectId(req.params.id)}).lean().execAsync(),
      planning: PlanningPackage.find({ applicationId: ObjectId(req.params.id) }).lean().execAsync()

    }).then(function(results) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
			console.log("results\n", results);
            if (!results) {
                console.log('[ API ] getDocumentStatusSite :: Documents package found: FALSE');
            }
            else {
                console.log('[ API ] getDocumentStatusSite :: Documents package found: TRUE');
            }
        }
        res.locals.results = results;
      next();

    }).catch(function(err) {
      console.error(err);
    }).catch(next);
  },
	getUsers: function(req, res, next) {
		 Promise.props({
            users: UserPackage.find().lean().execAsync()
        })
            .then(function(results) {
                if (!results) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('No users found');
                    }
                }
                else {
					for(var x=0; x<results.users.length; x++) {
						results.users[x].salt = "";
                        results.users[x].hash = "";
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log(results.users[x]);
                        }
                        results.users[x].user_roles_display="";
                        if (results.users[x].user_roles === undefined || results.users[x].user_roles.length===0 ) {
                            results.users[x].user_roles_display += results.users[x].user_role + " | ";
                        }
                        else {
                            for (var i = 0; i < results.users[x].user_roles.length; i++) {
                                results.users[x].user_roles_display += results.users[x].user_roles[i] + " | ";
                            }
                        }
					}
				}

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },
	
	getUserRoles: function(req, res, next) {
		 Promise.props({
            roles: RolePackage.find().lean().execAsync()
        })
            .then(function(results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    if (!results) {
                        console.log('No roles found');
                    }
                    else {
                        console.log('roles found');
                    }
                }

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

	findUser: function (req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the api call we make along with the _id used by it
            console.log('[ API ] finduser :: Call invoked with id:');
            console.log(req.params.id);
        }
		//req.body.id = ObjectId("588d02d4cc6b36283886be18");
        // Use results.DocumentPackage.<whatever you need> to access the information
        Promise.props({
            user: UserPackage.findById(req.params.id).lean().execAsync()
        })
            .then(function(results) {
                if (!results ) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] findUser :: user package found: FALSE');
                    }
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] findUser :: user package found: TRUE'); }
					results.user.hash = "";
					results.user.salt = "";
					if(results.user.contact_info.user_dob.dob_date != null) {
						var dobYear = results.user.contact_info.user_dob.dob_date.getFullYear();
						//get month and day with padding since they are 0 indexed
						var dobDay = ( "00" + results.user.contact_info.user_dob.dob_date.getDate()).slice(-2);
						var dobMon = ("00" + (results.user.contact_info.user_dob.dob_date.getMonth()+1)).slice(-2);
                        results.user.contact_info.user_dob.dob_date = dobYear + "-" + dobMon + "-" + dobDay;
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log("after change");
                            console.log(results.user);
                        }
					}
                }

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },


    /**
     * Description: retrieve all Document Packages from the database and group by status code
     * Type: GET
     * Params: 
     * Address: api.getDocumentByStatus
     * Returns: results.statuscode[array of Document Packages]
     * Notes: statuscode is defined as any property of Promise.props (ex: new, phone, assess)
     */
    getDocumentByStatus: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the api call made to the console
            console.log('[ API ] getDocumentByStatus :: Call invoked');
        }
		var currentTime = new Date();
		var year = currentTime.getFullYear();
        // Access the returned items as results.<status code>[array index].<what you need>
        // Example: results.visit[3].address.line_1 = a string
        Promise.props({
            new: DocumentPackage.find({status: "new"}).sort({'updated':-1}).lean().execAsync(),
            phone: DocumentPackage.find({status: "phone"}).lean().execAsync(),
            documents: DocumentPackage.find({status: "documents"}).lean().execAsync(),
            discuss: DocumentPackage.find({status: "discuss"}).lean().execAsync(),
            assess: DocumentPackage.find({status: "assess"}).lean().execAsync(),
			assessComp: DocumentPackage.find({status: "assessComp"}).lean().execAsync(),
            withdrawn: DocumentPackage.find({status: "withdrawn"}).lean().execAsync(),
            withdrawnooa: DocumentPackage.find({ status: "withdrawnooa" }).lean().execAsync(),
            approval: DocumentPackage.find({status: "approval"}).lean().execAsync(),
            handle: DocumentPackage.find({status: "handle"}).lean().execAsync(),
            // declined: DocumentPackage.find({status: "declined", app_year : year}).lean().execAsync(),
            // project: DocumentPackage.find({status: "project", app_year : year}).lean().execAsync(),
            // handleToBeAssigned: DocumentPackage.find({status: "handleToBeAssigned", app_year : year}).lean().execAsync(),
            // handleAssigned: DocumentPackage.find({status: "handleAssigned", app_year : year}).lean().execAsync(),
            // handleCompleted: DocumentPackage.find({status: "handleCompleted", app_year : year}).lean().execAsync(),
            // projectUpcoming: DocumentPackage.find({status: "projectUpcoming", app_year : year}).lean().execAsync(),
            // projectInProgress: DocumentPackage.find({status: "projectInProgress", app_year : year}).lean().execAsync(),
            // projectGoBacks: DocumentPackage.find({status: "projectGoBacks", app_year : year}).lean().execAsync(),
            // projectCompleted: DocumentPackage.find({status: "projectCompleted", app_year : year}).lean().execAsync()

            declined: DocumentPackage.find({status: "declined"}).lean().execAsync(),
            project: DocumentPackage.find({status: "project"}).lean().execAsync(),
            handleToBeAssigned: DocumentPackage.find({status: "handleToBeAssigned"}).lean().execAsync(),
            handleAssigned: DocumentPackage.find({status: "handleAssigned"}).lean().execAsync(),
            handleCompleted: DocumentPackage.find({status: "handleCompleted"}).lean().execAsync(),
            projectUpcoming: DocumentPackage.find({status: "projectUpcoming"}).lean().execAsync(),
            projectInProgress: DocumentPackage.find({status: "projectInProgress"}).lean().execAsync(),
            projectGoBacks: DocumentPackage.find({status: "projectGoBacks"}).lean().execAsync(),
            projectCompleted: DocumentPackage.find({status: "projectCompleted"}).lean().execAsync(),

            waitlist: DocumentPackage.find({ status: "waitlist" }).lean().execAsync(),
            transferred: DocumentPackage.find({ status: "transferred" }).lean().execAsync()
        })
            .then(function (results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    if (!results) {
                        console.log('[ API ] getDocumentByStatus :: Documents package found: FALSE');
                    }
                    else {
                        console.log('[ API ] getDocumentByStatus :: Documents package found: TRUE');
                    }
                }
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

    getApplicationEndReport: function(req, res, next){
        let queryObject = {}
        let appDateObject = {}
        if(req.query.appFromSum)appDateObject["$gte"] = new Date(req.query.appFromSum)
        if(req.query.appToSum) {
            let date = new Date(req.query.appToSum)
            date.setDate(date.getDate() + 1)
            appDateObject["$lt"] = date
        }
        if(Object.keys(appDateObject).length !== 0 && appDateObject.constructor === Object){
            queryObject["signature.client_date"] = appDateObject
        }
        DocumentPackage.aggregate([
            {$match: queryObject},
            {$lookup: {from: "assessmentpackages", localField: "_id",
                            foreignField: "applicationId", as: "assessment"}},
            {$unwind: {path: "$assessment",
                                preserveNullAndEmptyArrays: true}},
            {$lookup: {from: "workitempackages", localField: "_id",
                            foreignField: "applicationId", as: "workItemDoc"}},
            {$project: {
                "assessment.estimates" : 1,
                "signature.client_date": 1,
                "application.name": 1,
                "application.address": 1,
                "project": 1,
                "status": 1,
                "workItemDoc": 1,      
            }},
            {$sort: {"signature.client_date": 1} }
        ]).then(result => {
            res.locals.results = result
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log(result)
            }
            next()
        })
    },

    getProjEndReport: function(req, res, next){
        let queryObject = {}
        
        
        let projStartObject = {}
        if(req.query.projFromSum) projStartObject["$gte"] = new Date(req.query.projFromSum)
        if(req.query.projToSum){
            let date = new Date(req.query.projToSum)
            date.setDate(date.getDate() + 1)
            projStartObject["$lt"] = date
        }
        if(Object.keys(projStartObject).length !== 0 && projStartObject.constructor === Object){
            queryObject["project.project_start"] = projStartObject
        }
        queryObject["project"] = {$exists: true}
        queryObject["project.status"] = {$in: ['projectCompleted', 'handleCompleted', 'projectGoBacks']}
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log(queryObject)
        }
        DocumentPackage.aggregate([
            {$match: queryObject},
            {$lookup: {from: "workitempackages", localField: "_id",
                            foreignField: "applicationId", as: "workItemDoc"}},
            {$addFields: {
                stringID: { $toString: "$_id" }
            }},
            {$lookup: {
                from: "projectsummarypackages",
                localField: "stringID",
                foreignField: "projectId",
                as: "partners"
            }},
            {$unwind: 
                {path: "$partners",
                preserveNullAndEmptyArrays: true,
            }},
            { $addFields:
                {
                   "partnerIdsObjectId":
                      { $map:
                         {
                            input: "$partners.assocPartners",
                            as: "ourPartners",
                            in: { $toObjectId:"$$ourPartners" }
                         }
                      }
                 }
            },
            {$lookup: {from: "partnerpackages", localField: "partnerIdsObjectId",
                            foreignField: "_id", as: "partnerPack"}},
            {$project: {
                "partnerPack": 1,
                "signature.client_date": 1,
                "application.name": 1,
                "application.address": 1,
                "project": 1,
                "workItemDoc": 1,   
                "stringID": 1,  
            }},
            {$addFields:
                {
                    //If the start date is null, set as furthest date possible in results
                    //for sorting purposes
                    "endDate": {
                        "$ifNull": ["$project.project_end", new Date(864000000000000)]
                    }
                }
            },
            {$sort: {"endDate": 1} }
        ]).then( result => {
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log(result)
            }
            res.locals.projecttable = result
            next()
        })
    },
        
    Search: function(req, res, next){
        let queryObject = {}
        let leaderQueries = []
        if(req.query.crew_chief) leaderQueries.push({"project.crew_chief": {$regex: req.query.crew_chief, $options: 'i'}})
        if(req.query.project_advocate) leaderQueries.push({"project.project_advocate": {$regex: req.query.project_advocate, $options: 'i'}})
        if(req.query.site_host) leaderQueries.push({"project.site_host": {$regex: req.query.site_host, $options: 'i'}})
        if(req.query.numVol){
            let numberVolObject = {}
            if(req.query.numberVol_range != 'undefined') {
                numberVolObject[req.query.numberVol_range == "greater" ? "$gte" : "$lte"] = parseInt(req.query.numVol)
            }
            else {
                numberVolObject["$eq"] = parseInt(req.query.numVol)
            }
            queryObject["assessment.estimates.volunteers_needed"] = numberVolObject
        }   
        if(req.query.totCost){
            let totCostObject = {}
            if(req.query.totCost_range != 'undefined') {
                totCostObject[req.query.totCost_range == "greater" ? "$gte" : "$lte"] = parseInt(req.query.totCost)
            }
            else {
                totCostObject["$eq"] = parseInt(req.query.totCost)
            }
            queryObject["assessment.estimates.total_cost"] = totCostObject
        }

        //A situation could occur where two fields could be searched for with the OR operator (firstName/preferredName and leaders)
        //In this case, the docs suggest nesting inside an explicit AND operation https://docs.mongodb.com/manual/reference/operator/query/and/#op._S_and
        //The if statement handles the case where this could potentially happen and crafts query accordingly
        if(req.query.firstName && leaderQueries.length && req.query.leader_and_or === 'or') {
            queryObject["$and"] = []
            if (req.query.firstName) {
                let fNameSearchObj = {'$or': [{"application.name.first": {$regex: req.query.firstName, $options: 'i'}}, 
                {"application.name.preferred": {$regex: req.query.firstName, $options: 'i'}}]}
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(queryObject['$and'])
                }
                queryObject["$and"].push(fNameSearchObj)
            }
            if (leaderQueries.length) {
                leaderSearchObj = {}
                leaderSearchObj['$or'] = leaderQueries
                queryObject["$and"].push(leaderSearchObj)
            }
        }
        //In call other cases, craft query normally
        else {
            if(leaderQueries.length) queryObject["$" + req.query.leader_and_or] = leaderQueries
            if(req.query.firstName) {
                queryObject["$or"] = [{"application.name.first": {$regex: req.query.firstName, $options: 'i'}}, 
                    {"application.name.preferred": {$regex: req.query.firstName, $options: 'i'}}]
            }
        }
        
        if(req.query.lastName) queryObject["application.name.last"] = {$regex: req.query.lastName, $options: 'i'}
        if(req.query.city) queryObject["application.address.city"] = {$regex: req.query.city, $options: 'i'}
        if(req.query.zip) queryObject["application.address.zip"] = req.query.zip
        let appDateObject = {}
        if(req.query.appFromDate)appDateObject["$gte"] = new Date(req.query.appFromDate)
        if(req.query.appToDate){
                let date = new Date(req.query.appToDate)
                date.setDate(date.getDate() + 1)
                appDateObject["$lt"] = date
        }
        if(Object.keys(appDateObject).length !== 0 && appDateObject.constructor === Object){
            queryObject["signature.client_date"] = appDateObject
        }

        let projStartObject = {}
        if(req.query.projStartFrom) projStartObject["$gte"] = new Date(req.query.projStartFrom)
        if(req.query.projStartTo) {
            let date = new Date(req.query.projStartTo)
            date.setDate(date.getDate() + 1)
            projStartObject["$lt"] = date
        }
        if(Object.keys(projStartObject).length !== 0 && projStartObject.constructor === Object){
            queryObject["project.project_start"] = projStartObject
        }
        let projEndObject = {}
        if(req.query.projEndFrom) projEndObject["$gte"] = new Date(req.query.projEndFrom)
        if(req.query.projEndTo){
            let date = new Date(req.query.projEndTo)
            date.setDate(date.getDate() + 1)
            projEndObject["$lt"] = date
        }
        if(Object.keys(projEndObject).length !== 0 && projEndObject.constructor === Object){
            queryObject["project.project_end"] = projEndObject
        }
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log(queryObject)
        }
        DocumentPackage.aggregate(
            [
                {$lookup: {
                    from: "assessmentpackages",
                    localField: "_id",
                    foreignField: "applicationId",
                    as: "assessment"
                }},
               {$unwind: 
                    {path: "$assessment",
                    preserveNullAndEmptyArrays: true}},
                {$match: queryObject}
            ])
        .then( result => {
            res.locals.results = result
            next()
        })
        .catch(err => {
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log(err)
            }
            next()
        })
    },

    getPartnerProjectCount: function(req, res, next){
        let queryObject = {}
        let appDateObject = {}
        if(req.query.appFromSum)appDateObject["$gte"] = new Date(req.query.appFromSum)
        if(req.query.appToSum){
            let date = new Date(req.query.appToSum)
            date.setDate(date.getDate() + 1)
            appDateObject["$lt"] = date
        }
        if(Object.keys(appDateObject).length !== 0 && appDateObject.constructor === Object){
            queryObject["signature.client_date"] = appDateObject
        }

        let projStartObject = {}
        if(req.query.projFromSum) projStartObject["$gte"] = new Date(req.query.projFromSum)
        if(req.query.projToSum){
            let date = new Date(req.query.projToSum)
            date.setDate(date.getDate() + 1)
            projStartObject["$lt"] = date
        }
        if(Object.keys(projStartObject).length !== 0 && projStartObject.constructor === Object){
            queryObject["project.project_start"] = projStartObject
        }
        queryObject["project.status"] = {$in: ['projectCompleted', 'handleCompleted', 'projectGoBacks']}
        Promise.props({
            partnerIds: PartnerPackage.find({},{"org_name": 1}).sort({"org_name": 1}).lean().execAsync(),
            targetedYearIds: DocumentPackage.find(
                queryObject, 
                            {"_id": 1}).lean().execAsync()
        })
        .then(result => {
            let sumIdsArr = result.targetedYearIds.map(item => {return item._id.toString()})
            return Promise.all(result.partnerIds.map(async item => {
                item.projCount = await ProjectSummaryPackage.count({"assocPartners": item._id.toString(), "projectId" : sumIdsArr})
                return item
            }))
        })
        .then(result => {
            res.locals.results = result
            next()
        })  
    },

    getUpcomingProjects: function(req, res, next){
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("Getting upcoming projects from API")
        }
        DocumentPackage.aggregate([
            //match the documents that match the listed status
            {$match :
                {"$or" : [{"status": "approval"}, {"status": "waitlist"},
                            {"status": "assessComp", "project.status": { $ne : "project"}},
                        {"project.status": "project", "status": { $ne: "declined"}},
                        {"project.status": "handle"}, {"project.status": "projectInProgress"}]
                }
            },
            //join the assessment and workitem packages
            {$lookup: {from: "assessmentpackages", localField: "_id",
                        foreignField: "applicationId", as: "assessmentDoc"}},
            {$lookup: {from: "workitempackages", localField: "_id",
                        foreignField: "applicationId", as: "workItemDoc"}},
            {$addFields:
                {
                    //If the start date is null, set as furthest date possible in results
                    //for sorting purposes
                    "startDate": {
                        "$ifNull": ["$project.project_start", new Date(864000000000000)]
                    }
                }
            },
            {$sort: {"startDate": 1} }
        ])
        .then((results) => {
            res.locals.upComing = results
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log(results)
            }
            //res.locals.upComing = results.upComing
            let ids = results.map(a => a._id.toString())
            return ProjectSummaryPackage.aggregate([
                {$match : {"projectId": {"$in": ids}}},
                { $addFields:
                    {
                        "partnerIdsObjectId":
                          { $map:
                            {
                                input: "$assocPartners",
                                as: "ourPartners",
                                in: { $toObjectId:"$$ourPartners" }
                            }
                        }
                    }
                },
                {$lookup: {from: "partnerpackages", localField: "partnerIdsObjectId",
                foreignField: "_id", as: "partners"}}
            ]).execAsync()
        }).then((results) => {
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log(results)
                console.log(res.locals.upComing)
            }
            for(let i=0; i< res.locals.upComing.length; i++) {
                let match = (results.find((itmInner) => itmInner.projectId === res.locals.upComing[i]._id.toString()))
                res.locals.upComing[i].partners = match ? match.partners : []
            }
            next()
        }).catch((err) => {
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log(err)
            }
            next()
        })
    },

    /**
     * Description: retrieve all Project Packages from the database and group by status code
     * Type: GET
     * Params: none
     * Address: api.getProjectsByStatus
     * Returns: results.statuscode[array of Document Packages]
     * Notes: statuscode is defined as any property of Promise.props (ex: new, phone, assess)
     */
    getProjectsByStatus: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the api call made to the console
            console.log('[ API ] getProjectsByStatus :: Call invoked');
        }
        var currentTime = new Date();
        var year = currentTime.getFullYear();
        // Access the returned items as results.<status code>[array index].<what you need>
        // Example: results.visit[3].address.line_1 = a string


        Promise.props({

            //handle: DocumentPackage.find({status: "handle", app_year: year}).lean().execAsync(),
            //project: DocumentPackage.find({status: "project", app_year : year}).lean().execAsync(),
            

            updatedHandle: DocumentPackage.update(
                // Condition
                {
                    status: "handle" ,
                    // app_year : year,
                    project:  { $exists: false } ,
                
                },
                // Updates
                {
                    // $set: {"project.status": "handle"},
                    $set: {"project": {status: "handle"}},
                },
                // Options
                {
                    multi: true
                }

                // Callback if needed
                // { }
            ).execAsync(),

            updatedProject: DocumentPackage.update(
                // Condition
                {
                    status: "project" ,
                    // app_year : year,
                    project:  { $exists: false } ,
                
                },
                // Updates
                {
                    // $set: {"project.status": "project"},
                    $set: {"project": {status: "project"}},
                },
                // Options
                {
                    multi: true
                }

                // Callback if needed
                // { }
            ).execAsync()

        }).then(function (firstRes) {
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log("New handle-its since last refresh: " + firstRes.updatedHandle );
                console.log("New projects since last refresh: " + firstRes.updatedProject );
            }
            // for (var i=0; i < firstRes.handle.length; i++) {
            //     if ((typeof firstRes.handle[i].project.status === 'undefined') && (firstRes.handle[i].status == "handle" || firstRes.handle[i].status == "project")){
            //         DocumentPackage.find({project: {status: "handleAssigned"}}).lean().execAsync();
            //     }
            // }

            // for (var j=0; j < firstRes.project.length; j++) {
            //     if ((typeof firstRes.project[j].project.status === 'undefined') && (firstRes.project[j].status == "project")) {
            //         DocumentPackage.find({project: {status: "handleAssigned"}}).lean().execAsync();
            //     }
            // }            

                    Promise.props({
                        // approval: DocumentPackage.find({status: "approval"}).lean().execAsync(),
                        
                        // handle: DocumentPackage.find({status: "handle", app_year : year}).lean().execAsync(),
                        // project: DocumentPackage.find({status: "project", app_year : year}).lean().execAsync(),

                        handle: DocumentPackage.find({"project.status": "handle"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        project: DocumentPackage.find({"project.status": "project"}).sort({ "project.project_start": 1 }).lean().execAsync(),

                        handleToBeAssigned: DocumentPackage.find({"project.status": "handleToBeAssigned"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        projectUpcoming: DocumentPackage.find({"project.status": "projectUpcoming"}).sort({ "application.name.last": 1 }).lean().execAsync(),
                        
                        handleAssigned: DocumentPackage.find({"project.status": "handleAssigned"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        projectInProgress: DocumentPackage.find({"project.status": "projectInProgress"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        projectGoBacks: DocumentPackage.find({"project.status": "projectGoBacks"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        projectCompleted: DocumentPackage.find({"project.status": "projectCompleted"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        handleCompleted: DocumentPackage.find({"project.status": "handleCompleted"}).sort({ "project.project_start": 1 }).lean().execAsync(),
                        nostatus: DocumentPackage.find({"project.status": "nostatus"}).sort({ "project.project_start": 1 }).lean().execAsync(),

                        completed: DocumentPackage.find({
                                "$or":  [
                                            {"project.status": "projectCompleted"}, 
                                            {"project.status": "handleCompleted"}
                                        ]
                        }).sort({ "project.project_start": 1 }).lean().execAsync()


                    })
                        .then(function (results) {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log(results.projectUpcoming)
                                if (!results) {
                                    console.log('[ API ] getProjectsByStatus :: Project Summary package found: FALSE');
                                }
                                else {
                                    console.log('[ API ] getProjectsByStatus :: Project Summary package found: TRUE');
                                }
                            }


                            if (results) {

                                if (results.handle) {
                                    var obj = results.handle;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.handle = obj;    
                                    });                                    
                                }
                                if (results.project) {
                                    var obj = results.project;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.project = obj;    
                                    });                                    
                                }
                                if (results.handleToBeAssigned) {
                                    var obj = results.handleToBeAssigned;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.handleToBeAssigned = obj;    
                                    });                                    
                                }
                                if (results.projectUpcoming) {
                                    var obj = results.projectUpcoming;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.projectUpcoming = obj;    
                                    });                                    
                                }
                                if (results.handleAssigned) {
                                    var obj = results.handleAssigned;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.handleAssigned = obj;    
                                    });                                    
                                }
                                if (results.projectInProgress) {
                                    var obj = results.projectInProgress;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.projectInProgress = obj;    
                                    });                                    
                                }
                                if (results.projectGoBacks) {
                                    var obj = results.projectGoBacks;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.projectGoBacks = obj;    
                                    });                                    
                                }
                                if (results.projectCompleted) {
                                    var obj = results.projectCompleted;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.projectCompleted = obj;    
                                    });                                    
                                }
                                if (results.handleCompleted) {
                                    var obj = results.handleCompleted;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.handleCompleted = obj;    
                                    });                                    
                                }
                                if (results.nostatus) {
                                    var obj = results.nostatus;
                                    obj.forEach(function(v, i) {
                                        if (v.project.project_start == null) {//test to see if the id is 3
                                            obj.push(obj[i]);//push the object to the last position
                                            obj.splice(i, 1);//remove the object from the current position
                                        }
                                        results.nostatus = obj;    
                                    });                                    
                                }
                            }
                            

                            res.locals.results = results;
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log("API :: Results: " + JSON.stringify(results));
                            }

                            // If we are at this line all promises have executed and returned
                            // Call next() to pass all of this glorious data to the next express router
                            next();
                        })
                        .catch(function(err) {
                            console.error(err);
                        })
                        .catch(next);


                })
    },



  // Fetch only status: "project" documents for this year.
  getProjectDocuments: function(req, res, next) {
    var currentYear = new Date().getFullYear();
    Promise.props({
      projects: DocumentPackage.find({ status: "project", app_year: currentYear }).lean().execAsync()

    }).then(function (results) {
      res.locals.projects = results.projects;

    }).catch(function (err) {
    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
      console.log(err);
    }
      next();
    })
  },
	
	getDocsByYear: function(req, res, next) {
		console.log('[ API ] getDocumentByStatus :: Call invoked');
		
		var year = req.body.year;
        if (req.body.doc_status == "project") {
        Promise.props({
            
            project: DocumentPackage.find({status: "project", app_year : year}).lean().execAsync()
        })
            .then(function (results) {
                if (!results) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] getDocumentByStatus :: Documents package found: FALSE');
                    }
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] getDocumentByStatus :: Documents package found: TRUE');
                    }
					for(var x=0; x<results.project.length; x++) {
						var updateYear = results.project[x].updated.getFullYear();
						//get month and day with padding since they are 0 indexed
						var updateDay = ( "00" + results.project[x].updated.getDate()).slice(-2);
						var updateMon = ("00" + (results.project[x].updated.getMonth()+1)).slice(-2);
						results.project[x].updated = updateYear + "/" + updateMon + "/" + updateDay;
						
						var sigYear = results.project[x].signature.client_date.getFullYear();
						//get month and day with padding since they are 0 indexed
						var sigDay = ( "00" + results.project[x].signature.client_date.getDate()).slice(-2);
						var sigMon = ("00" + (results.project[x].signature.client_date.getMonth()+1)).slice(-2);
						results.project[x].signature.client_date = sigYear + "/" + sigMon + "/" + sigDay;
						
						results.project[x].status = "Approved Project";
					}
					
                }
                res.locals.results = results;
				res.locals.status = 200;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
		}
		else if(req.body.doc_status == "unapproved") {
			
			var year = req.body.year;
			Promise.props({
            
            unapproved: DocumentPackage.find( {
				$and: [
				{app_year : year},
                    { $or: [{ status: "withdrawn" }, { status: "withdrawnooa" }, {status : "declined"}]}
				]
				
			}).lean().execAsync()
			})
            .then(function (results) {
                if (!results) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] getDocumentByStatus :: Documents package found: FALSE');
                    }
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] getDocumentByStatus :: Documents package found: TRUE');
                    }
					
					for(var x=0; x<results.unapproved.length; x++) {
						var updateYear = results.unapproved[x].updated.getFullYear();
						//get month and day with padding since they are 0 indexed
						var updateDay = ( "00" + results.unapproved[x].updated.getDate()).slice(-2);
						var updateMon = ("00" + (results.unapproved[x].updated.getMonth()+1)).slice(-2);
						results.unapproved[x].updated = updateYear + "/" + updateMon + "/" + updateDay;
						
						var sigYear = results.unapproved[x].signature.client_date.getFullYear();
						//get month and day with padding since they are 0 indexed
						var sigDay = ( "00" + results.unapproved[x].signature.client_date.getDate()).slice(-2);
						var sigMon = ("00" + (results.unapproved[x].signature.client_date.getMonth()+1)).slice(-2);
						results.unapproved[x].signature.client_date = sigYear + "/" + sigMon + "/" + sigDay;
						
						//results.unapproved[x].status = "Unapproved Project";
					}
					
                }
                res.locals.results = results;
				res.locals.status = 200;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
			
		}
    },
	

    /**
     * Description: add a Document Package to the database
     * Type: POST
     * Params: none
     * Address: api.postDocument
     * Returns: HTML 200 status code
     */
    postDocument: function(req, res, next) {
        // Data will be submitted using req.body
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] postDocument :: Call invoked');
            console.log(req.body);
        }
		//var app_name;
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log(req.body);
        }
		
		//var currentTime = new Date();
		//var year = req.body.signature.client_date.getFullYear();
        var year = new Date().getFullYear();

		Promise.props({
			docInSys: DocumentPackage.count({app_year : year}).lean().execAsync()
		})
		.then(function (results) {
                if (!results) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] count failed');
                    }
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] count sucuess');
                        console.log(results);
                    }
					var count = results.docInSys;
					count++;
					
					
                    var app_name = "A" + year.toString() + "-" + count.toString();
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log(app_name);
                    }
					// Normally we would create a new mongoose object to be instantiated
					// var doc = new DocumentPackage();
					// And then add data to it
					// doc.status = 'a string here';
					// doc.application.name.first = 'name here'

					// Instead we will do it in one line
					var doc = new DocumentPackage(req.body);

					// Create a corresponding highlight package
					var highlight = new HighlightPackage();

					// Make each reference the others ObectId
					// TODO: Add support for work items and site assessment
					doc.highlightPackage = highlight._id;
					doc.app_name = app_name;
                    doc.app_year = year;
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log(doc.app_name);
                    }
					highlight.documentPackage = doc._id;

					var finance = new FinancialPackage();
					finance.appID = doc._id;
					//finance.name.first = req.body.application.name.first;
					//console.log("fin first");
					//console.log(finance.name.first);
					//finance.name.last = req.body.application.name.last;
					var name = req.body.application.name.first + " " + req.body.application.name.last;
					finance.name = name;

					// Save the document package to the database with a callback to handle flow control
					doc.saveAsync(function (err, doc, numAffected) {
						if (err) {
							console.error(err);
						}
						else {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log('[ API ] postDocument :: Document created with _id: ' + doc._id);
                            }
						}
					});

					// Save the highlight package to the database with a callback to handle flow control
					highlight.saveAsync(function (err, highlight, numAffected) {
						if (err) {
							console.error(err);
						}
						else {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log('[ API ] postDocument :: highlightPackage created with _id: ' + highlight._id);
                                console.log('[ API ] postDocument :: highlightPackage references document package _id: ' + highlight.reference);
                            }
							//res.send( { status : 200 } );
						}
					});


					finance.saveAsync(function (err, highlight, numAffected) {
						if (err) {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.error(err);
                            }
						}
						else {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log('[ API ] postDocument :: finPackage created with _id: ' + finance._id);
                                console.log('[ API ] postDocument :: highlightPackage references document package _id: ' + finance.appID);
                            }
							//res.send( { status : 200 } );
						}
					});

					for (var i=0; i<req.body.count; i++) {
						var family = new FinancialPackage();
						family.appID = doc._id;
						family.name = req.body.application.other_residents.name[i];

						family.saveAsync(function (err, highlight, numAffected) {
							if (err) {
								console.error(err);
							}
							else {
                                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                    console.log('[ API ] postDocument :: finPackage created with _id: ' + finance._id);
                                    console.log('[ API ] postDocument :: finPackage references document package _id: ' + finance.appID);
                                }
								//res.send( { status : 200 } );
							}
						});
						
					}
					res.send( { status : 200 } );

				}



            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);

    },

    /**
     * Description: update a name:value pair in a Document Package
     * Type: PUT
     * Params: _id, name, value
     * Address: api.putUpdateDocument
     * Returns: results as modified Document Package
     */
    putUpdateDocument: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc

        // Log the _id, name, and value that are passed to the function
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] putUpdateDocument :: Call invoked with _id: ' + req.params.id
                + ' | key: ' + req.body.name + ' | value: ' + req.body.value);
        }
		var updates = {};
		var id;
		if(res.locals.role == "SITE") {
			if(req.body.name == "notes.site_summary") {
			     updates['notes.site_summary'] = req.body.value;
			}
			else if(req.body.name == "status") {
                if (req.body.value && ((req.body.value == "project") || (req.body.value == "handle"))) {
                    updates['project.status']= req.body.value;
                }
				updates['status'] = req.body.value;
			}
			id = req.body.id;
		}
        else if (req.body.name == "status") {
            if (req.body.value && ((req.body.value == "project") || (req.body.value == "handle"))) {
                updates['project.status']= req.body.value;
            }
            updates['status'] = req.body.value;

            if(req.params.id != null) {
                id = req.params.id;
            }
            else {
                id = req.body.id;
            }
        }
        // else if (req.body.name == "drive_url") {
        //         console.log("[ API ] putUpdateDocument :: Save Google drive URL Called");
                
        //         if (req.body.value) {
        //             var inStatus = { drive_url: req.body.value };
        //             updates.drive = inStatus;
        //         }
        //        // updates['status'] = req.body.value;

        //         if(req.params.id != null) {
        //             id = req.params.id;
        //         }
        //         else {
        //             id = req.body.id;
        //         }
        // }
		else {
		
			if(req.params.id != null) {
				id = req.params.id;
			}
			else {
				id = req.body.id;
			}
			// Build the name:value pairs to be updated
			// Since there is only one name and one value, we can use the method below
			
			updates[req.body.name] = req.body.value;
			// Record Update time
			//filters
		}
        var conditions = {};
        conditions['_id'] = mongoose.Types.ObjectId(id);
        updates['updated'] = Date.now();
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("Search Filter:");
            console.log(conditions);
            console.log("Update:");
            console.log(updates);
        }      

        Promise.props({
            doc: DocumentPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                // TODO: Confirm true/false is correct
                if (results) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] putUpdateDocument :: Documents package found: TRUE');
                    }
                }
                else {
                    console.log('[ API ] putUpdateDocument :: Documents package found: FALSE');
                }
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },



    


    putUpdateProject: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc

        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the _id, name, and value that are passed to the function
            console.log('[ API ] putUpdateProject :: Call invoked with _id: ' + req.params.id
                + ' | key: ' + req.body.name + ' | value: ' + req.body.value);
            console.log(req.body.name + ' + ' + req.body.value);
        }
        var updates = {};
        var id;
        // if(res.locals.role == "SITE") {
        //     if(req.body.name == "notes.site_summary") {
        //         updates['notes.site_summary'] = req.body.value;
        //     }
        //     id = req.body.id;
        // }
        if(req.body.name == "status") {

            if (req.body.value == 'projWithdrawn') {

                updates =   {   "status":"withdrawn",
                                "project.status":req.body.value 
                            };
            } else if (req.body.value == 'projDeclined') {

                updates =   { 
                                "status":"declined",
                                "project.status":req.body.value 
                            };
            } else {
                updates = {"project.status":req.body.value };
            }

            //updates = {project: {"status": req.body.value}};
        }
        else if (req.body.name == "crew_chief") {
                updates = {"project.crew_chief":req.body.value };
        }
        else if (req.body.name == "project_advocate") {
                updates = {"project.project_advocate":req.body.value };
        }
        else if (req.body.name == "site_host") {
                updates = {"project.site_host":req.body.value };
        }

        else if (req.body.name == "actual_volunteer_count") {
                updates = {"project.actual_volunteer_count":req.body.value };
        }

        else if (req.body.name == "actual_cost") {
            updates = {"project.actual_cost":req.body.value };
        }   
        else if (req.body.name == "actual_labor_count") {
                updates = {"project.actual_labor_count":req.body.value };
        } else if (req.body.name == "project.project_start") {
                updates = {"project.project_start":req.body.value };
        } else if (req.body.name == "project.project_end") {
                updates = {"project.project_end":req.body.value };
        } else if (req.body.name == "drive_url") {
                updates = {"drive.drive_url":req.body.value };
        } else if (req.body.name == "vetting_drive_url") {
                updates = { "drive.vetting_drive_url": req.body.value };
        }   


        // else {
        
        //     if(req.params.id != null) {
        //         id = req.params.id;
        //     }
        //     else {
        //         id = req.body.id;
        //     }
        //     // Build the name:value pairs to be updated
        //     // Since there is only one name and one value, we can use the method below
            
        //     updates[req.body.name] = req.body.value;
        //     // Record Update time
        //     //filters
        // }

        // if(req.params.id != null) {
        //         id = req.params.id;
        //     }
        // else {
        //         id = req.body.id || null;
        //     }
        var conditions = {};
        conditions['_id'] = req.params.id || mongoose.Types.ObjectId(id);
        updates['updated'] = Date.now();
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("Search Filter:");
            console.log(conditions);
            console.log("Update:");
            console.log(updates);
        }

        Promise.props({
            project: DocumentPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    //upsert: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                // TODO: Confirm true/false is correct
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    if (results) {
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log('[ API ] putUpdateProject :: Project Doc found: TRUE');
                        }
                    }
                    else {
                        console.log('[ API ] putUpdateProject :: Project Doc found: FALSE, Created new one!');
                    }
                }
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },



    putUpdateWork: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the _id, name, and value that are passed to the function
            console.log('[ API ] putUpdateWork :: Call invoked with _id: ' + req.params.id
                + ' | key: ' + req.body.name + ' | value: ' + req.body.value);
            console.log(req.body.name + ' + ' + req.body.value);
        }
        var updates = {};
        var id;
 
     
        if (req.body.name == "isHandle") {
            if (req.body.value == true) {
                updates = { "isHandle": true };
            } else {
                updates = { "isHandle": false };
            }
        }

        var conditions = {};
        conditions['_id'] = req.params.id || mongoose.Types.ObjectId(id);
        updates['updated'] = Date.now();
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("Search Filter:");
            console.log(conditions);
            console.log("Update:");
        
            console.log(updates);
        }

        // Promise.props({
        //     project: DocumentPackage.findOneAndUpdate(
        //         // Condition
        //         conditions,
        //         // Updates
        //         {
        //             // $set: {name: value}
        //             $set: updates
        //         },
        //         // Options
        //         {
        //             // new - defaults to false, returns the modified document when true, or the original when false
        //             new: true,
        //             //upsert: true
        //         }
        //         // Callback if needed
        //         // { }
        //     ).execAsync()
        // })

        Promise.props({
        item: WorkItemPackage.findOneAndUpdate(
            // Condition
               conditions,
               // Updates
               {
                   $set: updates
               },
               // Options
               {
                   // new - defaults to false, returns the modified document when true, or the original when false
                   new: true,
                   // runValidators - defaults to false, make sure the data fits the model before applying the update
                   runValidators: true
               }
                   ).execAsync()
        })

            .then(function (results) {
                // TODO: Confirm true/false is correct
                if (results) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] putUpdateWork :: found: TRUE');
                    }
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] putUpdateWork :: found: FALSE, Created new one!');
                    }
                }
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },


	postUser: function(req, res, next) {
        // Data will be submitted using req.body
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] postUser :: Call invoked');
            console.log(req.body);
        }
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log(req.body);
        }

        //create new mongoose object
        var doc = new UserPackage(req.body);
		doc.setPassword(req.body.password);






        // Save the user package to the database with a callback to handle flow control
        doc.saveAsync(function (err, doc, numAffected) {
            if (err) {
                console.error(err);
            } else {
                console.log('[ API ] postUser :: User Created with ID: ' + doc._id);
				res.send( { status : 200 } );
            }
        });
        
    },

	updateUser: function(req, res, next) {
        // When executed this will apply updates to a user and return the MODIFIED user
        // Log the _id, name, and value that are passed to the function

        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Note that the _id will actually come in with the key "pk"... Sorry, it's an x-editable thing - DM
            console.log('[ API ] updateUser :: Call invoked with _id: ' + req.body.pk
            + ' | key: ' + req.body.name + ' | value: ' + req.body.value);
            //console.log(req.body.name + ' + ' + req.body.value);
        //console.log("in req body");
            console.log(req.body)
        }
		//res.locals.status = 200;
		//next();
        // Build the name:value pairs to be updated
        // Since there is only one name and one value, we can use the method below

		if(req.body.name == "password") {
			var conditions = {};
			var updates = {};
			conditions['_id'] = req.body.pk;
			
			var salt = crypto.randomBytes(16).toString('hex');
			var hash = crypto.pbkdf2Sync(req.body.value, salt, 1000, 64, 'sha512').toString('hex');
			
			updates.salt = salt;
            updates.hash = hash;
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log("changing password");
                console.log("Search Filter:");
                console.log(conditions);
                console.log("Update:");
                console.log(updates);
            }
			Promise.props({
				user: UserPackage.findOneAndUpdate(
					// Condition
					conditions,
					// Updates
					{
						 $set: updates

					},
					// Options
					{
						// new - defaults to false, returns the modified document when true, or the original when false
						new: true,
						// runValidators - defaults to false, make sure the data fits the model before applying the update
						runValidators: true
					}
					// Callback if needed
					// { }
				).execAsync()
			})
				.then(function (results) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log(results);
                    }
					// TODO: Confirm true/false is correct
					if (results) {
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log('[ API ] updateUser :: Documents package found: TRUE');
                        }
					}
					else {
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log('[ API ] updateUser :: Documents package found: FALSE');
                        }
					}
					res.locals.results = results;
					//sending a status of 200 for now
					res.locals.status = '200';

					// If we are at this line all promises have executed and returned
					// Call next() to pass all of this glorious data to the next express router
					next();
				})
				.catch(function (err) {
					console.error(err);
				})
				.catch(next);
		}
			
		else {

				var updates = {};
				updates[req.body.name] = req.body.value;


				// Record Update time
				//filters
				var conditions = {};
				conditions['_id'] = req.body.pk;
				
                updates['updated'] = Date.now();
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(updates);
                    console.log("Search Filter:");
                    console.log(conditions);
                    console.log("Update:");
                }

				Promise.props({
					user: UserPackage.findOneAndUpdate(
						// Condition
						conditions,
						// Updates
						{
							// $set: {name: value}
							$set: updates
						},
						// Options
						{
							// new - defaults to false, returns the modified document when true, or the original when false
							new: true,
							// runValidators - defaults to false, make sure the data fits the model before applying the update
							runValidators: true
						}
						// Callback if needed
						// { }
					).execAsync()
				})
					.then(function (results) {
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log(results);
                        }
						// TODO: Confirm true/false is correct
						if (results) {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log('[ API ] updateUser :: Documents package found: TRUE');
                            }
						}
						else {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log('[ API ] updateUser :: Documents package found: FALSE');
                            }
						}
						res.locals.results = results;
						//sending a status of 200 for now
						res.locals.status = '200';

						// If we are at this line all promises have executed and returned
						// Call next() to pass all of this glorious data to the next express router
						next();
					})
					.catch(function (err) {
						console.error(err);
					})
					.catch(next);
		}
    },

    updateUserRoles: function(req, res, next) {
        // When executed this will apply updates to a user and return the MODIFIED user
        // Log the _id, name, and value that are passed to the function

        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] updateUserRoles :: Call invoked with _id: ' + req.body.pk
            + ' | key: ' + req.body.name + ' | value: ' + req.body.value);
            //console.log(req.body.name + ' + ' + req.body.value);
        //console.log("in req body");
            console.log(req.body)
        }
		//res.locals.status = 200;
		//next();
        // Build the name:value pairs to be updated
        // Since there is only one name and one value, we can use the method below

		
			
		        var updates = {};
				//updates[req.body.name] = req.body.value;
               
                var user_roles = JSON.parse(req.body.user_roles);
                
              
				// Record Update time
				//filters
				var conditions = {};
                conditions['_id'] = req.body.Id;
                updates['user_roles'] = user_roles;
                updates['updated'] = Date.now();
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(user_roles);
                    console.log(req.body['user_roles']);
                    console.log("Search Filter:");
                    console.log(conditions);
                    console.log("Update:");
                    console.log(updates);
                }
				Promise.props({
					user: UserPackage.findOneAndUpdate(
						// Condition
						conditions,
						// Updates
						{
							// $set: {name: value}
							$set: updates
						},
						// Options
						{
							// new - defaults to false, returns the modified document when true, or the original when false
							new: true,
							// runValidators - defaults to false, make sure the data fits the model before applying the update
							runValidators: true
						}
						// Callback if needed
						// { }
					).execAsync()
				})
					.then(function (results) {
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log(results);
                        }
						// TODO: Confirm true/false is correct
						if (results) {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log('[ API ] updateUser :: Documents package found: TRUE');
                            }
						}
                        else 
                        {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log('[ API ] updateUser :: Documents package found: FALSE');
                            }
						}
						res.locals.results = results;
						//sending a status of 200 for now
						res.locals.status = '200';

						// If we are at this line all promises have executed and returned
						// Call next() to pass all of this glorious data to the next express router
						next();
					})
					.catch(function (err) {
						console.error(err);
					})
					.catch(next);
		
    },


	updatePassword: function(req, res, next) {
        // When executed this will apply updates to a user and return the MODIFIED user
        // Log the _id, name, and value that are passed to the function

        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Note that the _id will actually come in with the key "pk"... Sorry, it's an x-editable thing - DM
            console.log('[ API ] updatePassword :: Call invoked with _id: ' + req.body.pk
            + ' | oldPass : ' + req.body.oldPass + ' | newPass: ' + req.body.newPass);

            console.log("in req body");
            console.log(req.body)
        }
	   var passCorrect = true;
	   var hash;
	   var salt;
	   var newhash;
		//res.locals.status = 200;
		//next();
        Promise.props({
				user: UserPackage.findById(req.body.pk).lean().execAsync()
			})
            .then(function(results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(results);
                }
                if (!results) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] findUser :: user package found: FALSE');
                    }
					res.locals.status = 500;
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] findUser :: user package found: TRUE');
                    }
					hash = crypto.pbkdf2Sync(req.body.oldPass, results.user.salt, 1000, 64, 'sha512').toString('hex');
					if(hash != req.user.hash) {
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log("pass not correct");
                        }
						res.locals.status = 500;
						next();
						passCorrect = false;

					}
					else {
						salt = results.user.salt;
					}
				}
			})
			.then(function(results) {
						if(passCorrect == false) {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log("pass was wrong");
                            }
							res.locals.status = 500;
							next();
						}
						else {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log("salt in 2nd then");
                                console.log(salt);
                            }

						var conditions = {};
						var updates = {};
                        conditions['_id'] = req.body.pk;
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log("Search Filter:");
                                console.log(conditions);
                                console.log("Update:");
                            }
						var newsalt = crypto.randomBytes(16).toString('hex');
						var newhash = crypto.pbkdf2Sync(req.body.newPass, newsalt, 1000, 64, 'sha512').toString('hex');
						
						updates.salt = newsalt;
                        updates.hash = newhash;
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log(updates);
                        }
						Promise.props({
							userChange: UserPackage.findOneAndUpdate(
								// Condition
								conditions,
								// Updates
								{
									 $set: updates

								},
								// Options
								{
									// new - defaults to false, returns the modified document when true, or the original when false
									new: true,
									// runValidators - defaults to false, make sure the data fits the model before applying the update
									runValidators: true
								}
								// Callback if needed
								// { }
							).execAsync()
						})
							.then(function (results) {
                                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                    console.log(results);
                                }
                                // TODO: Confirm true/false is correct
                                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                    if (results) {
                                        console.log('[ API ] updatepass :: Documents package found: TRUE');
                                    }
                                    else {
                                        console.log('[ API ] updatepass :: Documents package found: FALSE');
                                    }
                                }
								res.locals.results = results;
								//sending a status of 200 for now
								res.locals.status = '200';

								// If we are at this line all promises have executed and returned
								// Call next() to pass all of this glorious data to the next express router
								//next();
							})
							.catch(function (err) {
								console.error(err);
							})
							//.catch(next);

					/*if(results.user.validPassword(req.body.oldPass)) {
						console.log("valid password");
						results.user.setPassword(req.body.newPass)
						res.locals.status = 200;
					}
					else {
						//invalid password
						res.locals.status = 500;
					}*/


				res.locals.status = 200;
                res.locals.results = results;
                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
						}
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);



    },



	//create user roles on initial site deployment
	createRoles: function(req, res, next) {
		var vet = new RolePackage();
		vet.role_name = "VET";
		vet.role_display = "Vetting Agent";

		var site = new RolePackage();
		site.role_name = "SITE";
		site.role_display = "Site Agent";

		var admin = new RolePackage();
		admin.role_name = "ADMIN";
        admin.role_display = "Admin";
        
        var projectmanger = new RolePackage();
		projectmanger.role_name = "PROJECT_MANAGEMENT";
		projectmanger.role_display = "Project Management";

		vet.saveAsync(function (err, doc, numAffected) {
            if (err) {
                console.error(err);
            }
            else {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] role vet created');
                }
				//res.send( { status : 200 } );
            }
        });


		site.saveAsync(function (err, doc, numAffected) {
            if (err) {
                console.error(err);
            }
            else {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] role site created');
                }
				//res.send( { status : 200 } );
            }
        });

		admin.saveAsync(function (err, doc, numAffected) {
            if (err) {
                console.error(err);
            }
            else if (numAffected == 1) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] role admin created');
                }
				next();
            }
        });
	},

	updateService: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc

        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the _id, name, and value that are passed to the function
            console.log('[ API ] updateService :: Call invoked with _id: ' + req.body.appId
                + ' | key: ' + req.body.name + ' | value: ' + req.body.value);
            console.log(req.body.name + ' + ' + req.body.value);
        }

        // Build the name:value pairs to be updated
        // Since there is only one name and one value, we can use the method below
        var updates = {};
		updates.service_area = req.body.value;

		//if out of service area, change status to "on hold, pending discussion"
		if(req.body.value == false) {
			updates.status = "discuss";
		}

		// Record Update time
        //filters
        var conditions = {};
        conditions['_id'] = req.body.appId;
        updates['updated'] = Date.now();
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("Search Filter:");
            console.log(conditions);
            console.log("Update:");
            
            console.log(updates);
        }

        Promise.props({
            doc: DocumentPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(results);
                }
                // TODO: Confirm true/false is correct
                if (results) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] putUpdateDocument :: Documents package found: TRUE');
                    }
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] putUpdateDocument :: Documents package found: FALSE');
                    }
                }
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },


    //post create Partner       //next
    createPartner: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] createPartner :: Call invoked');
            console.log(req.body);
        }
        var item = new PartnerPackage(req.body);

        item.saveAsync(function (err, note, numAffected) {
            if (err) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log ('[ API ] :: createPartner error.');
                    console.error(err);
                }
            } else {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log("saved!");
                    console.log('[ API ] createPartner :: New Partner created with _id: ' + item._id);
                    console.log(item);
                }
                //send note ID so it can be referenced without page refresh
                //res.send( { status : 200, _id: item._id } );
                res.locals.status = '200';
            }
            next();
        });
    },

    //post delete Partner           //next
    deletePartner: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] deletePartner :: Call invoked: req.body: ');
            console.log(req.body);
        }
        Promise.props({
            note: PartnerPackage.remove(
                {
                    _id: req.body._id
                }
            ).execAsync()
        })
        .then(function (results) {
            if (results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] deletePartner :: Partner found: TRUE');
                }
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';
            }
            else {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] deletePartner :: Partner found: FALSE');
                }
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },

    putUpdatePartner: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc

        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the _id, name, and value that are passed to the function
            console.log('[ API ] putUpdatePartner :: Call invoked with _id: ' + req.params.id
                + ' | key: ' + req.body.name + ' | value: ' + req.body.value);
            console.log(req.body.name + ' + ' + req.body.value);
        }

   
        var conditions = {};
        conditions['_id'] = req.params.id;

        var updates = {};
        updates[req.body.name] = req.body.value;

        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("Search Filter:");
            console.log(conditions);
            console.log("Update:");
            console.log(updates);
        }


        Promise.props({
            project: PartnerPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    //upsert: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                // TODO: Confirm true/false is correct
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    if (results) {
                        console.log('[ API ] putUpdatePartner :: Partner found: TRUE');
                    }
                    else {
                        console.log('[ API ] putUpdatePartner :: Cannot update - This Partner ID does not exist');
                    }
                }
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },



    //post get all Partners
    getPartner: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] getPartner :: Call invoked: req.body: ');
            console.log(req.body);
        }
        Promise.props({
            partner: PartnerPackage.find().execAsync(),
            count: PartnerPackage.count().execAsync()
        })
        .then(function (results) {
            if (results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] getPartner :: Partner(s) found: TRUE');
                }
                res.locals.results = results;
                res.locals.status = '200';
            }
            else {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] getPartner :: Partner(s) found: FALSE');
                }
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },

    //post - GET (Retrieve) partners and leaders associated to that project
    getSummaryPartners: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            //console.log(req.body);
            //var projectId =  ObjectId(req.params.id) ||req.params.id || req.body.projectId;                    
            console.log('[ API ] getSummaryPartners :: Call invoked');
        }

        //res.locals.docId = projectId;

        // var projectId = String(req.body.projectId);
        var resArray = [];

        Promise.props({
            allPartners: PartnerPackage.find().sort({ "org_name": 1 }).execAsync(),
            pCount: PartnerPackage.count().execAsync(),
            assocPartners: ProjectSummaryPackage.find({ projectId: { $exists: true } }).execAsync()
        })
        .then(function (assocRes) {
            
            if (assocRes) {
            var allPartners = assocRes.allPartners;                             //Array of Objects

            var unAssocArray = assocRes.allPartners;  
            var uIDs = [];

            var asso = assocRes.assocPartners.length;
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log("RR1", asso);
            }

              var assocPartners;
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] getSummaryPartners :: item(s) found: TRUE');

                    console.log("Partner Associations Result: " + assocPartners);
                }
                var m; 
                var allCnt;
                var aCnt;
                var k;
            for (k = 0; k < asso; k++) {
                assocPartners = assocRes.assocPartners[k].assocPartners || null;   
              if (assocPartners) {  
                for (aCnt = 0; aCnt < assocPartners.length; aCnt++) {
                    for (allCnt=0; allCnt < allPartners.length; allCnt++) {    
                        if (allPartners[allCnt]._id == assocPartners[aCnt]) {
                                m = assocRes.assocPartners[k].projectId;
                                if (resArray[m]) {
                                    resArray[m].push(allPartners[allCnt].org_name);
                                } else {
                                    resArray[m] = [];
                                    resArray[m].push(allPartners[allCnt].org_name);
                                }
                                //break;

                        } 
                        else if (allCnt + 1 == allPartners.length) {
                            uIDs.push(assocPartners[aCnt]);
                        }
                    }
                }
              }
            }
                    // var filtered = unAssocArray.filter(customFilter);

                    // function customFilter(eachObj) {
                    //     var isFound = false;
                    //     for (var aCnt = 0; aCnt < assocPartners.length; aCnt++) {
                    //         if (eachObj._id == assocPartners[aCnt]) {
                    //             isFound = true; 
                    //         } 
                    //     }
                    //     return (! isFound);
                    // }


            var sendRes =   { 
                                pAll:   allPartners, 
                                // aCount: assocRes.pCount, 
                                pAssoc: resArray,
                                // aIDs:   assocPartners,
                               // uAssoc: filtered,
                             //   projectId: projectId
                                // uCount: filtered.length,
                                // uIDs:   uIDs
                            };
            req.partnerTime = sendRes;
            res.locals.results.part = sendRes;
            // req.partnerTime = sendRes;
            res.locals.status = '200';
            } else {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] getProjPartnersLeaders :: item(s) found: FALSE');
                }
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },
    //post - GET (Retrieve) partners and leaders associated to that project
    // Partners are saved (& used) in res.locals.results.part as the search result.
    getProjPartnersLeaders: function(req, res, next) {
        //console.log(req.body);
        
        var projectId =  ObjectId(req.params.id) ||req.params.id || req.body.projectId;  
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {                  
            console.log('[ API ] getProjPartnersLeaders :: Call invoked for: ' + projectId);
        }

        res.locals.docId = projectId;

        // var projectId = String(req.body.projectId);
        var resArray = [];
        //var unAssocArray = [];

        Promise.props({
            allPartners: PartnerPackage.find().sort({ "org_name": 1 }).execAsync(),
            pCount: PartnerPackage.count().execAsync(),
            assocPartners: ProjectSummaryPackage.find({"projectId": projectId }).execAsync()
            // assocPartners: ProjectSummaryPackage.findAllAndUpdate(
            //                 {"projectId": projectId },
            //                 { $setOnInsert: {"projectId": projectId } }, 
            //                 { returnOriginal: false,
            //                           upsert: true   }
            // ).execAsync()
        })
        .then(function (assocRes) {
            
            var allPartners = assocRes.allPartners;                             //Array of Objects

            var unAssocArray = assocRes.allPartners;  
            var uIDs = [];

            if (! assocRes.assocPartners[0]) {

                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] getProjPartner createPartner :: Call invoked');
                }
                // console.log(req.body);

                // var empty = [];
                // var newBody = {    "projectId": projectId 
                //               };

                var item = new ProjectSummaryPackage({"projectId": projectId });

                item.saveAsync(function (err, note, numAffected) {
                    if (err) {
                        console.error(err);
                    }
                    else  {
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log('[ API ] getProjPartner createPartner :: New Partner created with _id: ' + item._id);
                            console.log(item);
                        }

                        var newSendRes =   { 
                                            pAll:   allPartners, 
                                            pAssoc: {},
                                            uAssoc: allPartners,
                                            projectId: projectId
                                        };

                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log("\nCREATED Blank Document-Partner Association ----->\n");
                            console.log(newSendRes);
                        }

                        if (res.locals.results === undefined) {
                            res.locals.results = {};
                        }

                        res.locals.results.part = newSendRes;
                        req.partnerTime = newSendRes;
                        res.locals.status = '200';
                        next();
                    }
                });
            } 
            else if (assocRes) {
              var assocPartners = assocRes.assocPartners[0].assocPartners || null;        //An array of IDS
              if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log('[ API ] getProjPartnersLeaders :: item(s) found: TRUE');

                console.log("Partner Associations Result: " + assocPartners);
              }
                
                for (var aCnt = 0; aCnt < assocPartners.length; aCnt++) {
                    for (var allCnt=0; allCnt < allPartners.length; allCnt++) {    
                        if (allPartners[allCnt]._id == assocPartners[aCnt]) {
                                resArray.push(allPartners[allCnt]);
                                //break;

                        } 
                        else if (allCnt + 1 == allPartners.length) {
                            uIDs.push(assocPartners[aCnt]);
                        }
                    }
                }

                    var filtered = unAssocArray.filter(customFilter);

                    function customFilter(eachObj) {
                        var isFound = false;
                        for (var aCnt = 0; aCnt < assocPartners.length; aCnt++) {
                            if (eachObj._id == assocPartners[aCnt]) {
                                isFound = true; 
                            } 
                        }
                        return (! isFound);
                    }
                if (resArray.length > 0) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log(resArray.length);
                    }
                }
                //res.locals.results = results;
                // res.locals.results = { ans: JSON.stringify(resArray) };
                // res.locals.results = assocRes.allPartners;

                var sendRes =   { 
                                    pAll:   allPartners, 
                                    // aCount: assocRes.pCount, 
                                    pAssoc: resArray,
                                    // aIDs:   assocPartners,
                                    uAssoc: filtered,
                                    projectId: projectId
                                    // uCount: filtered.length,
                                    // uIDs:   uIDs
                                };
                if (res.locals.results === undefined) {
                    res.locals.results = {};
                }
                req.partnerTime = sendRes;
                res.locals.results.part = sendRes;
                // req.partnerTime = sendRes;
                res.locals.status = '200';
                next();
            } else {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] getProjPartnersLeaders :: item(s) found: FALSE');
                }
                next();
            }
        })
        .catch(function (err) {
            console.error(err);
        });
    },
    //post - SET (Store) partners and leaders associated to that project
    setProjPartnersLeaders: function(req, res, next) {
        
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("**Setting Doc-Partner Association with body: **");
            console.log(req.body);
        }

        //console.log(req.body);
        var projectId = req.body.projectId || res.locals.docId;       
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] setProjPartnersLeaders :: Call invoked for: ' + projectId);
        }
        // var item = new ProjectSummaryPackage(req.body);

        Promise.props({
            updateStatus:   ProjectSummaryPackage.update(
                                {"projectId": projectId },           //Query
                                {  $set: {
                                            "assocPartners": req.body.assocArray
                                          }
                                },   
                                { 
                                    upsert: true,
                                    new: true
                                }
                            ).execAsync()
        })
        .then(function (thisRes) {
            if (thisRes) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] setProjPartnersLeaders :: item UPDATED: TRUE');
                    console.log(thisRes.updateStatus);
                }

            res.locals.results = thisRes;
            res.locals.status = '200';
            } else {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] setProjPartnersLeaders :: item UPDATED: FALSE');
                }
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },


    /**
     * Description: add a vetting note to the database
     * Type: POST
     * Params: none
     * Address: api.postVettingNote
     * Returns: _id of newly created Vetting Note
     */
    postVettingNote: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] postVettingNote :: call invoked');
            console.log(req.body);
        }
		var userID = req.body.user.toString();
		Promise.props({
            user: UserPackage.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
        })
            .then(function(results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(results);
                }
                if (!results) {
                    console.log('[ API ] postVettingNote :: User package found: FALSE');
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] postVettingNote :: User package found: TRUE');
                    }
					var note = new VettingNotePackage(req.body);
                    var firstName = results.user.contact_info.user_name.user_first;
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('first name');
                        console.log(firstName);
                    }
                    note.vetAgent = results.user.contact_info.user_name.user_first + " " + results.user.contact_info.user_name.user_last;
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log(note.vetAgent);
                    }

					note.saveAsync(function (err, note) {
						if (note && note._id) {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log('[ API ] postVettingNote :: Note created with _id: ' + note._id);
                            }
							//send note ID so it can be referenced without page refresh
							res.send( { status : 200, noteId: note._id, vetAgent: note.vetAgent } );
						} else {
                            console.error(err);
                            res.send( { status : 500, message: 'Error: Cannot create note. Please retry...' } );
						}
					})
				}
			})
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);


    },

    postProjectNote: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] postProjectNote :: call invoked');
            console.log(req.body);
        }
		var userID = req.body.user.toString();
		Promise.props({
            user: UserPackage.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
        })
            .then(function(results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(results);
                }
                if (!results) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] postProjectNote :: User package found: FALSE');
                    }
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] postProjectNote :: User package found: TRUE');
                    }
					var note = new ProjectNotePackage(req.body);
                    var firstName = results.user.contact_info.user_name.user_first;
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('first name');
                        console.log(firstName);
                    }
                    note.projectPlanner = results.user.contact_info.user_name.user_first + " " + results.user.contact_info.user_name.user_last;
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log(note.projectPlanner);
                    }

					note.saveAsync(function (err, note, numAffected) {
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log({ err });
                            console.log({ note });
                            console.log({ numAffected });
                        }
						if (note && note._id) {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log('[ API ] postVettingNote :: Note created with _id: ' + note._id);
                            }
							//send note ID so it can be referenced without page refresh
							res.send( { status : 200, noteId: note._id, projectPlanner: note.projectPlanner } );
						} else {
                            console.error(err);
                            res.send( { status : 500, message: 'Could not save note. Please try again...'} );
						}
					})
				}
			})
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);


    },

	//post new work item
	addWorkItem: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] addWorkItem :: Call invoked');
            console.log(req.body);
        }
        var item = new WorkItemPackage(req.body);

        item.saveAsync(function (err, note, numAffected) {
            if (err) {
                console.error(err);
            } else {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log("saved!");
                    console.log('[ API ] add Work Item :: Note created with _id: ' + item._id);
                }
                //send note ID so it can be referenced without page refresh
                res.send( { status : 200, itemId: item._id } );
            }
        });

    },


    /**
     * Description: remove a vetting note from the database
     * Type: POST
     * Params: _id of Vetting Note
     * Address: api.removeVettingNote
     * Returns: confirmation of delete
     */
    removeVettingNote: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] removeVettingNote :: Call invoked');
            //console.log(req.locals.status);
        }
        Promise.props({
            note: VettingNotePackage.remove(
                {
                    _id: req.body.noteId
                }
            ).execAsync()
        })
        .then(function (results) {
            if (results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] removeVettingNote :: Note found: TRUE');
                }
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';
            }
            else {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] removeVettingNote :: Note found: FALSE');
                }
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },

    /**
     * Description: remove a vetting note from the database
     * Type: POST
     * Params: _id of Vetting Note
     * Address: api.removeVettingNote
     * Returns: confirmation of delete
     */
    removeProjectNote: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] removeProjectNote :: Call invoked');
            //console.log(req.locals.status);
        }
        Promise.props({
            note: ProjectNotePackage.remove(
                {
                    _id: req.body.noteId
                }
            ).execAsync()
        })
        .then(function (results) {
            if (results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] removeProjectNote :: Note found: TRUE');
                }
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';
            }
            else {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] removeProjectNote :: Note found: FALSE');
                }
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },

	//delete work item
	deleteWorkItem: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] deleteWorkItem :: Call invoked');
            console.log(req.body)
        }
        Promise.props({
            note: WorkItemPackage.remove(
                {
                    _id: req.body.itemId
                }
            ).execAsync()
        })
        .then(function (results) {
            if (results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] deleteWorkItem :: Note found: TRUE');
                }
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';
            }
            else {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log('[ API ] removeVettingNote :: Note found: FALSE');
                }
            }
            next();
        })
        .catch(function (err) {
            console.error(err);
        });
    },
    /**
     * Description: update or edit a Vetting Note
     * Type: POST
     * Params: _id, name, value
     * Address: api.updateVettingNote
     * Returns: results as an updated Vetting Note
     */
    updateVettingNote: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the _id, name, and value that are passed to the function
            console.log('[ API ] updateVettingNote :: Call invoked with note _id: ' + req.body.id
                + ' | description: ' + req.body.description);
        }

        var updates = {};
        updates.description = req.body.description;

        //filters
        var conditions = {};
        conditions['_id'] = req.body.id;
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("Search Filter:");
            console.log(conditions);
            console.log("Update:");
            console.log(updates);
        }

        Promise.props({
            note: VettingNotePackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(results);
                }
                if (results.note != null) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] updateVettingNote :: Note found: TRUE');
                    }
                    res.locals.status = '200';
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] updateVettingNote :: Note found: FALSE');
                    }
                    res.locals.status = '500';
                }
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },

    updateProjectNote: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the _id, name, and value that are passed to the function
            console.log('[ API ] updateProjectNote :: Call invoked with note _id: ' + req.body.id
                + ' | description: ' + req.body.description);
        }

        var updates = {};
        updates.description = req.body.description;

        //filters
        var conditions = {};
        conditions['_id'] = req.body.id;
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("Search Filter:");
            console.log(conditions);
            console.log("Update:");
            console.log(updates);
        }

        Promise.props({
            note: ProjectNotePackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(results);
                }
                if (results.note != null) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] updateProjectNote :: Note found: TRUE');
                    }
                    res.locals.status = '200';
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] updateProjectNote :: Note found: FALSE');
                    }
                    res.locals.status = '500';
                }
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },



	updateWorkItem: function(req, res, next) {
        // Log the _id, name, and value that are passed to the function
        //console.log('[ API ] WorkItem :: Call invoked with item _id: ' + req.body.id
       //     + ' | description: ' + req.body.description);
       if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("role in old function");
            console.log(res.locals.role);
            console.log("role in new function")
            console.log(res.locals.user_roles.indexOf('PROJECT_MANAGEMENT') !== -1);
            console.log(res.locals.user_roles == 'PROJECT_MANAGEMENT');
            console.log("all locals");
            console.log(res.locals);
       }
		//res.locals.status = 200;
		//next();
        var updates = {};
		//TODO: add name??
		updates.description = req.body.description;
		if(req.body.name != null) {
			updates.name = req.body.name;
		}
		updates.cost = req.body.cost;
		updates.updated = Date.now();
 
        if(req.body.siteComments != null) {
            updates.siteComments = req.body.siteComments;
        }
        if(req.body.vettingComments != null) {
            updates.vettingComments = req.body.vettingComments;
        }
        if(req.body.projectComments != null)
        {
            updates.projectComments = req.body.projectComments;
        }

        if(res.locals.role === undefined || res.locals.role==='')
        {
            if(req.body.siteComments != null) {
                updates.siteComments = req.body.siteComments;
            }
        }
       // else
       // {
		if(res.locals.user_roles.indexOf("ADMIN") !== -1) {
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log("Yes, User has an ADMIN Role");
            }
			if(req.body.siteComments != null) {
				updates.siteComments = req.body.siteComments;
			}
			if(req.body.vettingComments != null) {
				updates.vettingComments = req.body.vettingComments;
            }
            if(req.body.projectComments != null)
            {
                updates.projectComments = req.body.projectComments;
            }
		}
        // else if(res.locals.role == "ADMIN") {
        //     if(req.body.siteComments != null) {
        //         updates.siteComments = req.body.siteComments;
        //     }
        //     if(req.body.vettingComments != null) {
        //         updates.vettingComments = req.body.vettingComments;
        //     }
        //     if(req.body.projectComments != null)
        //     {
        //         updates.projectComments = req.body.projectComments;
        //     }
        // }
        if(res.locals.user_roles.indexOf("PROJECT_MANAGEMENT") !== -1) {
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log("Yes, User has a PROJECT_MANAGEMENT Role");
            }
            if(req.body.projectComments != null) {
                updates.projectComments = req.body.projectComments;
            }
        }
        else if(res.locals.role == "PROJECT_MANAGEMENT") {
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log("Yes, User has a PROJECT_MANAGEMENT (older) Role");
            }
            if(req.body.projectComments != null) {
                updates.projectComments = req.body.projectComments;
            }
           
        }
		if(res.locals.user_roles.indexOf("SITE") !== -1) {
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log("Yes, User has a SITE Role");
            }
            if(req.body.siteComments != null) {
				updates.siteComments = req.body.siteComments;
			}

            // if(req.body.projectComments != null)
            // {
            //     updates.projectComments = req.body.projectComments;
            // }
		}
        if(res.locals.user_roles.indexOf("VET") !== -1) {
            if(req.body.vettingComments != null) {
                updates.vettingComments = req.body.vettingComments;
            }
        }

        else {
			if(req.body.vettingComments != null) {
                updates.vettingComments = req.body.vettingComments;
                
            }
           
        }
        
        if(req.body.siteComments != null) {
            updates.siteComments = req.body.siteComments;
        }
  // }
        //filters
        var conditions = {};
        conditions['_id'] = req.body.id;
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("Search Filter:");
            console.log(conditions);
            console.log("Update:");
            console.log(updates);
        }

        Promise.props({
            item: WorkItemPackage.findOneAndUpdate(
			 // Condition
                conditions,
                // Updates
                {
					$set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(results);
                }
                if (results.item != null) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] updateWorkItem :: Note found: TRUE');
                    }
                    res.locals.status = '200';
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] updateWorkItem :: Note found: FALSE');
                    }
                    res.locals.status = '500';
                }
                res.locals.results = results;
				  // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })

            .catch(next);



	},


  // Create / Update Assessment Checklist record
  saveAssessmentDocument: function(req, res, next) {
    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
        console.log('saving assessment')
    }

    Promise.props({
      assessment: AssessmentPackage.findOneAndUpdate(
          { applicationId: req.body.applicationId },
          { $set: req.body },
          { new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
          }
      ).execAsync()
    }).then(function (results) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log(results);
        }
      if (results.assessment !== null) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] saveAssessmentDocument :: Assessment found: TRUE');
        }
        res.locals.status = '200';
      } else {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] saveAssessmentDocument :: Assessment found: FALSE');
        }
        res.locals.status = '500';
      }
      res.locals.results = results

      next();

    }).catch(function (err) {
      console.error(err)
      
    }).catch(next);
  },

  // Create / Update Project Plan record
  saveProjectPlanDocument: function(req, res, next) {
    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
        console.log('saving project plan');
        console.log(req.body);
    }
    Promise.props({
      projectPlan: ProjectPlanPackage.findOneAndUpdate(
        { applicationId: req.body.applicationId },
        { $set: req.body },
        { new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      ).execAsync()
    }).then(function (results) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log(results);
        }
      if (results.projectPlan !== null) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] saveProjectPlanDocument :: Assessment found: TRUE');
        }
        res.locals.status = '200';
      } else {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] saveProjectPlanDocument :: Assessment found: FALSE');
        }
        res.locals.status = '500';
      }
      res.locals.results = results

      next();

    }).catch(function (err) {
      console.error(err)
      
    }).catch(next);
  },

  // Save Custom Checklist Note
  saveCustomChecklist: function(req, res, next) {
    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
        console.log('saving custom checklist note');
        console.log(req.body);
    }

    var n = req.body.name || "custom";
    var upName = n + ".note";
    var updates = {};
    //updates[n] = {"note": req.body.value};
    //var q = {};

    var bVal = "";

    if (req.body.value !== 'Empty') {
        bVal = req.body.value;
    } 

    updates[upName] = bVal;
    //const key = `${n}.newProp`;
    //updates[n].note = req.body.value;
    //console.log(updates);

    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
        console.log("Saving Custom Checklist: ", upName, "value: ", req.body.value);
    }
    //var applId = req.body.applicationId || 
    //req.body.applicationId = 

    Promise.props({
      plan: ProjectPlanPackage.findOneAndUpdate(
        { applicationId: req.params.id },
        { $set: updates },
        { new: true,
          upsert: true,
          runValidators: false,
          setDefaultsOnInsert: false
        }
      ).execAsync()
    }).then(function (results) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("Returned results: ");
            console.log(results);
        }
      if (results.plan !== null) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] saveCustomChecklist :: TRUE');
        }
        res.locals.status = '200';
      } else {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] saveCustomChecklist :: FALSE');
        }
        res.locals.status = '500';
      }
      res.locals.results = results

      next();

    }).catch(function (err) {
      console.error(err)
      
    }).catch(next);
  },



	//update financial package
	updateFinance: function(req, res, next) {
        // When executed this will apply updates to a doc and return the MODIFIED doc

        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the _id, name, and value that are passed to the function
            console.log('[ API ] updateFinance :: Call invoked with _id: ');
            console.log(req.body);
        }
		var userID;
		var name1;
		var name2;
		var value;

		Object.keys(req.body).forEach(function(prop) {
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log("in looop");
                console.log(prop);
                console.log(req.body[prop]);
            }
			userID = prop;
			Object.keys(req.body[prop]).forEach(function(data) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log("in second loop");
                    //console.log(req.body[prop]);
                    console.log(data);
                }
                name1 = data;
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(name1);
                    console.log((req.body[prop])[data]);
                }
				Object.keys((req.body[prop])[data]).forEach(function(bool) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log("third loop");
                        console.log(bool);
                    }
                    name2 = bool;
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log(((req.body[prop])[data])[bool]);
                    }
					value = ((req.body[prop])[data])[bool];
				});
			});
		});

        // Build the name:value pairs to be updated

        var updates = {};
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("data built: ");
            console.log(userID);
            //console.log(name).toString();
        }
		if (name2 != "note") {
		var name = name1.toString() + "." + name2.toString();
		}
		else {
			name = name1;
        }
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
		    console.log(name);
		
            console.log(value);
        }


		updates[name] = value;



		// Record Update
        //filters
        var conditions = {};
        conditions['_id'] = mongoose.Types.ObjectId(userID);
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("Search Filter:");
            console.log(conditions);
            console.log("Update:");
        }


        Promise.props({
            fin: FinancialPackage.findOneAndUpdate(
			 // Condition
                conditions,
                // Updates
                {
					$set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(results);
                }

                if (results) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] updateFinance :: Fin package found: TRUE');
                    }
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] updateFinance :: Fin package found: FALSE');
                    }
                }
                res.locals.results = results;
                //sending a status of 200 for now
                res.locals.status = '200';
				next();
			})
            .catch(function (err) {
                console.error(err);
            })

            .catch(next);

    },
    /**
     * Description: retrieve a Highlight Package from the database by id
     * Type: GET
     * Params: _id
     * Address: api.getHighlightsById
     * Returns: results as a Highlight Package
     */
    getHighlightsById: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] getHighlightsById :: Call invoked with highlight package _id: ' + req.params.id);
        }
        Promise.props({
            highlight: HighlightPackage.findById(req.params.id).lean().execAsync()
        })
            .then(function(results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    if (!results) {
                        console.log('[ API ] getHighlightsById :: Highlight package found: FALSE');
                    }
                    else {
                        console.log('[ API ] getHighlightsById :: Highlight package found: TRUE');
                    }
                }

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

    /**
     * Description: invert a boolean value in a Highlight Package
     * Type: GET
     * Params: _id
     * Address: api.toggleHighlight
     * Returns: results as updated Highlight Package
     */
    toggleHighlight: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
        console.log('[ API ] toggleHighlight :: Call invoked with highlightPackage _id: %s | name: %s | value: %s',
            req.params.id, req.body.name, req.body.value);
        }
        // Confirm a JSON {key:value} pair was sent
        if (req.accepts('application/json')) {
            var fetchDocument = Promise.props({
                highlight: HighlightPackage.findById(req.params.id).lean().execAsync()
            })
                .then(function (results) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        if (!results) {
                            console.log('[ API ] toggleHighlight :: Highlight package found: FALSE');
                        }
                        else {
                            console.log('[ API ] toggleHighlight :: Highlight package found: TRUE');
                        }
                    }

                    // Build the name:value pairs to be updated
                    // Since there is only one name and one value, we can use the method below
                    var updates = {};
                    // updates[req.body.name] = req.body.value;

                    var str = req.body.name;
                    var str_split = str.split('.');
                    var length = str_split.length;

                    if (length == 1) {
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log(results.highlight[ str_split[0] ]);
                        }
                        if (results.highlight[str_split[0]] === true) {
                            updates[req.body.name] = false;
                        }
                        if (results.highlight[str_split[0]] === false) {
                            updates[req.body.name] = true;
                        }
                    }
                    if (length == 2) {
                        if (results.highlight[ str_split[0] ][ str_split[1] ] === true) {
                            updates[req.body.name] = false;
                        }
                        if (results.highlight[ str_split[0] ][ str_split[1] ] === false) {
                            updates[req.body.name] = true;
                        }
                    }

                    // Record Update time
                    updates['updated'] = Date.now();
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log("[ API ] toggleHighlight :: Items to update: ", updates);
                    }

                    // Build variables and attach to the returned query results
                    results.id = req.params.id;
                    results.name = req.body.name;
                    // results.value = req.body.value;
                    results.updates = updates;

                    return results;
                })
                .catch(function (err) {
                    console.error(err);
                })
                .catch(next);

            fetchDocument.then(function(results) {
                Promise.props({
                    highlight: HighlightPackage.findOneAndUpdate(
                        // Condition
                        {_id: results.id},
                        // Updates
                        {
                            $set: results.updates
                        },
                        // Options
                        {
                            // new - defaults to false, returns the modified document when true, or the original when false
                            new: true,
                            // runValidators - defaults to false, make sure the data fits the model before applying the update
                            runValidators: true
                        }
                    ).execAsync()

                })
                    .then(function(results){
                        if (!results) {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log('[ API ] toggleHighlight :: Highlight package updated: FALSE');
                            }

                        }
                        else {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log('[ API ] toggleHighlight :: Highlight package updated: TRUE');
                            }
                            res.locals.results = results;
                            //sending a status of 200 for now
                            res.locals.status = '200';
                        }
                        next();
                    })
                    .catch(function (err) {
                        console.error(err);
                    })
                    .catch(next);
            })
        }
    },

    /**
     * Description: update a name:value pair in an array in a Document Package
     * Type: PUT
     * Params: _id, name, value, index
     * Address: api.putUpdateArray
     * Returns: results as modified Document Package
     */
    putUpdateArray: function(req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the _id, name, and value that are passed to the function
            console.log('[ API ] putUpdateArray :: Call invoked with _id: ' + req.params.id
                + ' | key: ' + req.body.name + ' | value: ' + req.body.value + ' | current value: ' + req.body.pk);
        }
        //the $ holds the index of the element
		if(req.body.name == "application.other_residents.name") {
            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                console.log("updating name");
            }
			if(req.body.pk == "") {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log("currently empty");
                }
			}
		}
        var updateField = req.body.name + ".$";
        var updates = {};
        updates[updateField] = req.body.value;
        // Record Update time
        updates['updated'] = Date.now();
        //filters
        var conditions = {};
        conditions['_id'] = req.params.id;
        conditions[req.body.name] = req.body.pk;
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log("Search Filter:");
            console.log(conditions);
            console.log("Update:");
            console.log(updates);
        }

        Promise.props({
            doc: DocumentPackage.findOneAndUpdate(
                // Condition
                conditions,
                // Updates
                {
                    // $set: {name: value}
                    $set: updates
                },
                // Options
                {
                    // new - defaults to false, returns the modified document when true, or the original when false
                    new: true,
                    // runValidators - defaults to false, make sure the data fits the model before applying the update
                    runValidators: true
                }
                // Callback if needed
                // { }
            ).execAsync()
        })
            .then(function (results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log(results);
                }
                if (results.doc != null) {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] putUpdateArray :: Documents package found: TRUE');
                    }
					if(req.body.name == "application.other_residents.name") {
                        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                            console.log("updating name");
                        }
						var finance = new FinancialPackage();
						if(req.body.pk == "") {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log("currently empty");
                            }
							finance.appID = req.params.id;
							finance.name = req.body.value;
							finance.saveAsync(function (err, highlight, numAffected) {
								if (err) {
									console.error(err);
								}
								else {
                                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                        console.log('[ API ] postDocument :: finPackage created with _id: ' + finance._id);
                                        console.log('[ API ] postDocument :: finPackage references document package _id: ' + finance.appID);
                                    }
									//res.send( { status : 200 } );
								}
							});

						}
						else {
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log("changing name");
                            }
							if(req.body.value == ""){
                                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                    console.log("remove package");
                                }
								Promise.props({
								fin: FinancialPackage.remove(
									{
										appID: req.params.id,
										name: req.body.pk

									}
								).execAsync()
							})
							.then(function (results) {
								if (results) {
                                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                        console.log('[ API ] deleteFinancial :: Note found: TRUE');
                                    }
									//res.locals.results = results;
									//sending a status of 200 for now
									//res.locals.status = '200';
								}
								else {
                                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                        console.log('[ API ] deleteFinancial :: Note found: FALSE');
                                    }
								}
								//next();
							})
							.catch(function (err) {
								console.error(err);
							});

							}
							else {
							var finUpdates = {};
							finUpdates['name'] = req.body.value;
							// Record Update time
							//updates['updated'] = Date.now();
							//filters
							var finConditions = {};
							finConditions['appID'] = req.params.id;
                            finConditions['name'] = req.body.pk;
                            if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                                console.log("Search Filter:");
                                console.log(finConditions);
                                console.log("Update:");
                                console.log(finUpdates);
                            }

							Promise.props({
								fin: FinancialPackage.findOneAndUpdate(
									// Condition
									finConditions,
									// Updates
									{
										// $set: {name: value}
										$set: finUpdates
									},
									// Options
									{
										// new - defaults to false, returns the modified document when true, or the original when false
										new: true,
										// runValidators - defaults to false, make sure the data fits the model before applying the update
										runValidators: true
									}
									// Callback if needed
									// { }
								).execAsync()
							})
							 .then(function (results) {
                                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {

									console.log(results);

									if (results) {
										console.log('[ API ] updateFinance :: Fin package found: TRUE');
									}
									else {
										console.log('[ API ] updateFinance :: Fin package found: FALSE');
                                    }
                                }

								})
								.catch(function (err) {
									console.error(err);
								})

								.catch(next);
							}

						}
					}
					res.locals.results = results;
                    res.locals.status = '200';
                }
                else {
                    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                        console.log('[ API ] putUpdateArray :: Documents package found: FALSE');
                    }
                    res.locals.status = '500';
                }
                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function (err) {
                console.error(err);
            })
            .catch(next);
    },

    //Project Summary  get docs for view
    getDocProjectSummaryStatus: function (req, res, next) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            // Log the api call we make along with the _id used by it
            console.log('[ API ] getDocProjectSummaryStatus :: ');
        }
        
        // Use results.ProjectSummaryPackage.<whatever you need> to access the information
        Promise.props({
            //document: ProjectSummaryPackage.findById(req.params.id).lean().execAsync()
            handleToBeAssigned: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "handleToBeAssigned"}},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),
            
            handleAssigned: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "handleAssigned" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),
            
            complete: ProjectSummaryPackage.aggregate(          //Depleted, not being used
                [
                {$match: { status: "handleCompleted" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),

            handleCompleted: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "handleAssigned" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),
            
            projectUpcoming: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "projectUpcoming" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),
            
            projectInProgress: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "projectInProgress" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),

            projectGoBacks: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "projectGoBacks" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync(),

            projectCompleted: ProjectSummaryPackage.aggregate(
                [
                {$match: { status: "projectCompleted" }},
                    { $redact: {
                        $cond: {
                            if: { $eq: [ "$level", 5 ] },
                            then: "$$PRUNE",
                            else: "$$DESCEND"
                        }
                    }}
                    
                ]
            ).execAsync()
        })
            .then(function(results) {
                if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
                    console.log("results");
                    
                    
                    console.log(results);
                    if (!results) {
                        console.log('[ API ] getDocProjectSummaryStatus :: Project Summary package found: FALSE');
                    }
                    else {
                        console.log('[ API ] getDocProjectSummaryStatus :: Project Summary found: TRUE');

                    }
                }

                res.locals.results = results;

                // If we are at this line all promises have executed and returned
                // Call next() to pass all of this glorious data to the next express router
                next();
            })
            .catch(function(err) {
                console.error(err);
            })
            .catch(next);
    },

      // Create / Update Assessment Checklist record
  saveProjectSummaryStatus: function(req, res, next) {
    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
        console.log('Saving Project Summary Status for: ' + req.body.applicationId);
    }

    Promise.props({
      assessment: AssessmentPackage.findOneAndUpdate(
          { applicationId: req.body.applicationId },
          { $set: req.body },
          { new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
          }
      ).execAsync()
    }).then(function (results) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log(results);
        }
      if (results.assessment !== null) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] saveProjectSummaryStatus :: Project found: TRUE');
        }
        res.locals.status = '200';
      } else {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] saveProjectSummaryStatus :: Project found: FALSE');
        }
        res.locals.status = '500';
      }
      res.locals.results = results

      next();

    }).catch(function (err) {
      console.error(err)
      
    }).catch(next);

    
  },

  // Find all users that may be assigned tasks.
  getAssignableUsers: function (req, res, next) {
    Promise.props({
      assignableUsers: UserPackage.find({ assign_tasks: true }).execAsync()

    }).then(function (results) {
      res.locals.assignableUsers = results.assignableUsers;
      next();

    }).catch(next);
  },

  // Find the wrap-up document for a project.
  getWrapUpDoc: function (req, res, next) {
    Promise.props({
      wrapUp: ProjectWrapUpPackage.find({ applicationId: ObjectId(req.params.id) }).execAsync()

    }).then(function (results) {
      if (results.wrapUp.length <= 0) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('Req Params [getWrapUpDoc] ', req.params);
        }
        // Create new wrapUp and set that as new wrapUp.
        ProjectWrapUpPackage.create(
          ProjectWrapUpPackage.empty( ObjectId(req.params.id) ),
          function(err, wrapUp) {
            if (err) {
              next(err)
            } else {
              res.locals.wrapUp = wrapUp
              next()
            }
          })
      } else {
        // Just set the existing wrapUp
        res.locals.wrapUp = results.wrapUp[0]
        next();
      }

    }).catch(next);
  },

  // Create / Update Project WrapUp record
  saveProjectWrapUp: function(req, res, next) {
    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
        console.log('Saving Project Summary Status for: ' + req.body.applicationId);
    }

    Promise.props({
      projectWrapUp: ProjectWrapUpPackage.findOneAndUpdate(
        { applicationId: req.body.applicationId },
        { $set: req.body },
        { new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      ).execAsync()
    }).then(function (results) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log(results);
        }
      if (results.projectWrapUp !== null) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] saveProjectWrapUp :: Project found: TRUE');
        }
        res.locals.status = '200';
      } else {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] saveProjectWrapUp :: Project found: FALSE');
        }
        res.locals.status = '500';
      }
      res.locals.results = results

      next();

    }).catch(function (err) {
      console.error(err)
      
    }).catch(next);
  },

  // Find the project plan document for a project.
  getProjectPlanDoc: function (req, res, next) {
    Promise.props({
      plan: ProjectPlanPackage.find({ applicationId: ObjectId(req.params.id) }).execAsync()

    }).then(function (results) {
      if (results.plan.length <= 0) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('Req Params [getProjectPlanDoc] ', req.params);
        }
        // Create new ProjectPlan and set that as new ProjectPlan.
        ProjectPlanPackage.create(
          ProjectPlanPackage.empty( ObjectId(req.params.id) ),
          function(err, plan) {
            if (err) {
              next(err)
            } else {
              res.locals.plan = plan
              next()
            }
          })
      } else {
        // Just set the existing ProjectPlan
        res.locals.plan = results.plan[0]
        next();
      }
    }).catch(next);
  },

  // Create / Update Project Plan record
  saveProjectPlan: function(req, res, next) {
    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
        console.log('Saving Project Plan Status for: ' + req.body.applicationId);
        console.log(req.body);
    }
    Promise.props({
      plan: ProjectPlanPackage.findOneAndUpdate(
        { applicationId: req.body.applicationId },
        { $set: req.body },
        { new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true
        }
      ).execAsync()
    }).then(function (results) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log(results);
        }
      if (results.plan !== null) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] saveProjectPlan :: Project found: TRUE');
        }
        res.locals.status = '200';
      } else {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('[ API ] saveProjectPlan :: Project found: FALSE');
        }
        res.locals.status = '500';
      }
      res.locals.results = results

      next();

    }).catch(function (err) {
      console.error(err)
      
    }).catch(next);
  },

  getLeadtimeDefaults: function (req, res, next) {
    LeadtimeDefaults.findOne(null, function(err, lt) {
      if (typeof lt === 'object' && lt !== null) {
        res.locals.leadtime = lt
        next()

      } else {
        LeadtimeDefaults.findOneAndUpdate({}, {}, {
          'new': true,
          upsert: true,
          setDefaultsOnInsert: true
        }, function (err, lt) {
          res.locals.leadtime = lt
          next()
        })
      }
    })
  },

  setLeadtimeDefaults: function (req, res, next) {
    if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
        console.log('Finding with criteria: ', req.body)
    }
    LeadtimeDefaults.findOneAndUpdate({}, { $set: req.body }, {
      'new': true,
      upsert: true,
      setDefaultsOnInsert: true
    }, function (err, lt) {
        if (process.env.DISABLE_CONSOLE_LOGGINGS !== "yes") {
            console.log('Lead time updated: ', lt)
        }
        res.locals.leadtime = lt
      next()
    })
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
/*
getCompletedProjectsByYear: function(req, res, next) {

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
            res.locals.results.completedProjects = completedProjects;
            next(); 
        }
    }) 
    .catch(function(err){ console.err(err);})
    .catch(next);
}
*/
};
