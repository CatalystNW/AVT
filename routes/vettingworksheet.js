var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var DocumentPackage = require('../models/documentPackage');
var highlightPackage = require('../models/highlightPackage');
var VettingNotePackage = require('../models/vettingNotePackage');
var WorkItemPackage = require('../models/workItemPackage');
var fs = require('fs');

var FinPackage = require('../models/finPackage');

var api = require('../controllers/api');
var User = require('../models/userPackage');

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

// Helper query functions

//Need ObjectID to search by ObjectID
var ObjectId = require('mongodb').ObjectID;
module.exports = function(passport) {
/* Route to specific application by Object ID */
	router.get('/:id', isLoggedIn, function(req, res) {
    //Checking what's in params
    console.log("Vetting Worksheet for " + ObjectId(req.params.id));
    /* search by _id. */
    Promise.props({
        doc: DocumentPackage.findOne({_id: ObjectId(req.params.id)}).lean().execAsync(),
        vettingNotes: VettingNotePackage.find({applicationId: ObjectId(req.params.id)}).lean().execAsync(),

        finances: FinPackage.find({appID: ObjectId(req.params.id)}).sort([['_id', 1]]).lean().execAsync(),
    		highlight: highlightPackage.findOne({"documentPackage": ObjectId(req.params.id)}).lean().execAsync(),
	      //finances: FinPackage.findOne({appID: ObjectId(req.params.id)}).lean().execAsync()
    }).then(function(result) {
			//format birth date for display
			if(result.doc.application.dob.date != null) {
				var dobYear = result.doc.application.dob.date.getFullYear();
				//get month and day with padding since they are 0 indexed
				var dobDay = ( "00" + result.doc.application.dob.date.getDate()).slice(-2);
				var dobMon = ("00" + (result.doc.application.dob.date.getMonth()+1)).slice(-2);

				result.doc.application.dob.date = dobYear + "-" + dobMon + "-" + dobDay;
			}

			if(result.doc.service_area == null) {
				result.service = false;
			}
			else {
				result.service = true;
			}

			// format vetting notes dates
			if(result.vettingNotes.length != 0) {
				result.vettingNotes.forEach(function(note, index){
						var Year = note.date.getFullYear();
						//get month and day with padding since they are 0 indexed
						var Day = ( "00" + note.date.getDate()).slice(-2);
						var Mon = ("00" + (note.date.getMonth()+1)).slice(-2);
						result.vettingNotes[index].date = Mon + "/" + Day + "/" + Year;
				});
			}

			res.locals.layout = 'b3-layout';
			// @RESTORE AFTER DEVELOPMENT
			// result.user = req.user._id;
			result.title = "Vetting Worksheet";

			res.render('b3-worksheet-view', result);
		}).catch(function(err) {
			console.error(err);
		});
});

router
.get('/exportPAF/:id', isLoggedIn, api.getDocumentSite, api.getProjPartnersLeaders,
	 api.getAssignableUsers, api.getWrapUpDoc, api.getProjectPlanDoc,
	 api.getLeadtimeDefaults,
	 function(req, res, next) {
	   //Checking what's in params
	   //console.log("Rendering application " + ObjectId(req.params.id));

		 console.log("rendering test application");
	   var payload = {};

		 payload.doc = res.locals.results.doc[0];
		 payload.work = res.locals.results.work;
		 payload.user = req.user._id;
		 payload.user_email = res.locals.email;
			 payload.user_role = res.locals.role;
			 payload.user_roles = res.locals.user_roles;
		 payload.projectNotes = res.locals.results.projectNotes;
	   payload.assignableUsers = res.locals.assignableUsers;
	   payload.wrapUp = res.locals.wrapUp ? res.locals.wrapUp : ProjectWrapUpPackage.empty(req.params.id);
		 payload.part = res.locals.results.part||req.partnerTime;			//Data for Partners Tab Partial
	   payload.plan = res.locals.plan || ProjectPlanPackage.empty(req.params.id)
	   payload.leadtime = res.locals.leadtime;
		 payload.partDocId = res.locals.results.doc[0]._id;
		 console.log("results");
	   console.log(payload);
	   
		 // res.render('siteassessmenttool', payload);
		 res.render('exportPAF', payload);

	 });

router
.get('/exportHandle/:id', isLoggedIn, api.getDocumentSite, api.getProjPartnersLeaders,
	api.getAssignableUsers, api.getWrapUpDoc, api.getProjectPlanDoc,
	api.getLeadtimeDefaults,
	function(req, res, next) {
	//Checking what's in params
	//console.log("Rendering application " + ObjectId(req.params.id));

		console.log("rendering test application");
	var payload = {};

		payload.doc = res.locals.results.doc[0];
		payload.work = res.locals.results.work;
		payload.user = req.user._id;
		payload.user_email = res.locals.email;
			payload.user_role = res.locals.role;
			payload.user_roles = res.locals.user_roles;
		payload.projectNotes = res.locals.results.projectNotes;
	payload.assignableUsers = res.locals.assignableUsers;
	payload.wrapUp = res.locals.wrapUp ? res.locals.wrapUp : ProjectWrapUpPackage.empty(req.params.id);
		payload.part = res.locals.results.part||req.partnerTime;			//Data for Partners Tab Partial
	payload.plan = res.locals.plan || ProjectPlanPackage.empty(req.params.id)
	payload.leadtime = res.locals.leadtime;
		payload.partDocId = res.locals.results.doc[0]._id;
		console.log("results");
	console.log(payload);
	
		// res.render('siteassessmenttool', payload);
		res.render('exportPAF', payload);

	});


	router
	.get('/exportPDF/:id', isLoggedIn, api.getDocumentSite, api.getProjPartnersLeaders,
		api.getAssignableUsers, api.getWrapUpDoc, api.getProjectPlanDoc,
		api.getLeadtimeDefaults,
		function(req, res, next) {
		//Checking what's in params
		//console.log("Rendering application " + ObjectId(req.params.id));
	
			console.log("Export to PDF Called");
		var payload = {};
	
			payload.doc = res.locals.results.doc[0];
			payload.work = res.locals.results.work;
			payload.user = req.user._id;
			payload.user_email = res.locals.email;
				payload.user_role = res.locals.role;
				payload.user_roles = res.locals.user_roles;
			payload.projectNotes = res.locals.results.projectNotes;
		payload.assignableUsers = res.locals.assignableUsers;
		payload.wrapUp = res.locals.wrapUp ? res.locals.wrapUp : ProjectWrapUpPackage.empty(req.params.id);
			payload.part = res.locals.results.part||req.partnerTime;			//Data for Partners Tab Partial
		payload.plan = res.locals.plan || ProjectPlanPackage.empty(req.params.id)
		payload.leadtime = res.locals.leadtime;
			payload.partDocId = res.locals.results.doc[0]._id;
			console.log("results - export as PDF");
		console.log(payload);
		
			// res.render('siteassessmenttool', payload);
			res.render('exportPDF', payload);
	
		});
// //Insert CSV export route here
// router.post('/csvExport', isLoggedInPost, function(req, res){


//   var applicationID = req.body.application;
//   var firstname = req.body.firstname;
//   var lastname = req.body.lastname;
//   var query =  "{'applicationId' : ObjectId("+"'"+applicationID+"'"+")}";
//   var filename = lastname + '-' + firstname + '-' + applicationID;
// 	const execFile = require('child_process').execFile;
// 	const exec = require('child_process').exec;
// 	const mongoexport_child = execFile('mongoexport', ['-d', 'catalyst',
// 	'-c', 'workitempackages', '--type=csv', '--fields', 'name,description,cost,vettingComments', '-q', query, '-o', 'public/exports/'+filename+'-'+'VettingView'+'.csv', '--port', config.mongo.port],
// 	function(error, stdout, stderr) {
// 		if(error){
// 			console.error('stderr', stderr);
// 			throw error;
// 		}
// 		else{
// 			console.log('stdout', stdout);
// 		}
// 	});

// 	mongoexport_child.on('exit', function(code,signal){

// 		const rename_child = exec('cd public/exports; var="Work Item,Description,Cost,Vetting Comments"; sed -i "1s/.*/$var/" ' + "'" + filename + '-' + 'VettingView' + '.csv' + "'",
// 			function(error, stdout, stderr){
// 					if(error){
// 						console.error('stderr', stderr);
// 						throw error;
// 					}
// 					else{
// 						console.log('stdout', stdout);
// 					}
// 		})

//     rename_child.on('exit', function(code,signal){
//       const export_notes = execFile('mongoexport', ['-d', 'catalyst', '-c', 'notes', '--type=csv', '--fields', 'vetAgent,description', '-q', query, '-o', 'public/exports/'+filename+'-'+'notes'+'.csv', '--port', config.mongo.port],
//       function(error,stdout,stderr){
//         if(error){
//           console.error('stderr', stderr);
//           throw error;
//         }
//         else{
//           console.log('stdout', stdout);
//         }
//       });

//       export_notes.on('exit', function(code, signal){
//         const edit_notes_header = exec('cd public/exports; var="Vetting Agent,Description"; sed -i "1s/.*/$var/" ' + "'" + filename + '-' + 'notes' + '.csv'  + "'" + ';cat ' + filename + '-' + 'VettingView' + '.csv' + ' ' + filename + '-'+'notes' + '.csv' + ' > ' + filename + '-' + 'VettingWorksheet' + '.csv',
//         function(error, stdout, stderr){
//           if(error){
//             console.error('stderr', stderr);
//           }
//           else{
//             console.log('stdout', stdout);
//           }
//         });
//         edit_notes_header.on('exit', function(code,signal){

//           if(fs.existsSync('public/exports/'+filename+'-VettingView'+'.csv') && fs.existsSync('public/exports/'+filename+'-notes'+'.csv')){

//             fs.unlinkSync('public/exports/'+filename+'-VettingView'+'.csv');
//             fs.unlinkSync('public/exports/'+filename+'-notes'+'.csv');

//           }


//       		if(code !== 0){
//       			res.status(500).send("Export failed: Code 500");
//       			debugger
//       		}
//       		else{
//       			res.status(200).send({status: 'success'});



//       		}
//       	});
//       });
//     });
// 	});
// });

router.post('/csvExport', isLoggedInPost, function(req, res){
	console.log("** MONGOEXPORT CALLED FROM vettingworksheet.js **");
});

router.get('/file/:name', function(req, res, next){
	console.log("** MONGOEXPORT CALLED FROM vettingworksheet.js **");
// var fileName = req.params.name;
// 	var options = {
// 		root: './public/exports',
// 		dotfiles: 'deny',
// 		headers: {
// 			'x-sent': true,
// 			'Content-Disposition':'attachment;filename=' + fileName
// 		}
// 	};


// 	res.sendFile(fileName, options, function(err){
// 		if(err){
// 			next(err);
// 		}
// 		else{
// 			console.log('Sent:', fileName);
// 		}
// 	});


});



router.route('/servicearea')
    .post(isLoggedInPost, api.updateService, function(req, res) {
	if(res.locals.status != '200'){
        res.status(500).send("Could not update field");
    }
    else{
        res.json(res.locals);
    }
	});


router.route('/additem')
	.post(isLoggedInPost, api.addWorkItem, function(req, res) {
	if(res.locals.status != '200'){
        res.status(500).send("Could not add field");
    }
    else{
        res.json(res.locals);
    }
	});

router.route('/deleteitem')
	.post(isLoggedInPost, api.deleteWorkItem, function(req, res) {
	if(res.locals.status != '200'){
        res.status(500).send("Could not delete field");
    }
    else{
        res.json(res.locals);
    }
	});

router.route('/updateitem')
	.post(isLoggedInPost, api.updateWorkItem, function(req, res) {
	if(res.locals.status != '200'){
        res.status(500).send("Could not update field");
    }
    else{
        res.json(res.locals);
    }
	});

router.route('/finacialForm')
	.post(isLoggedInPost, api.updateFinance, function(req, res) {
		if(res.locals.status != 200) {
			res.status(500).send("could not update field");
		}
		else {
			res.json(res.locals);
		}
	});

router.route('/displayYear')
	.post(isLoggedInPost, api.getDocsByYear, function(req, res) {
		if(res.locals.status != 200) {
			res.status(500).send("could not update field");
		}
		else {
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

return router;
}

//check if user is admin or vetting agent
function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()) {
			var userID = req.user._id.toString();
			var ObjectId = require('mongodb').ObjectID;
			//var authenticated = false;
			Promise.props({
				user: User.findOne({'_id' : ObjectId(userID)}).lean().execAsync()
			})
			.then(function (results) {
					if (!results) {
						res.redirect('/user/login');
					}
				else {
          res.locals.assign_tasks = results.user.assign_tasks;
					if(results.user.user_role == "VET" || results.user.user_role == "ADMIN") {
							
							res.locals.role = results.user.user_role;
							res.locals.user_roles = results.user.user_roles;
							return next();

						}
						else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('VET') >-1)
						{
							res.locals.role = results.user.user_role;
							res.locals.user_roles = results.user.user_roles;
							return next();
						}
						else {
							console.log("user is not vet");
							res.redirect('/user/login');
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
							res.locals.role = results.user.user_role;
							res.locals.user_roles = results.user.user_roles;
							return next();

						}
						else if (results.user.user_roles !== undefined && results.user.user_roles.indexOf('VET') >-1)
						{
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
