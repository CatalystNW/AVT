var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../mongoose/connection');
var DocumentPackage = require('../models/documentPackage');
var HighlightPackage = require('../models/highlightPackage');
var VettingNotePackage = require('../models/vettingNotePackage');
var api = require('../controllers/api');
var User = require('../models/userPackage');
var fs = require('fs');

var Promise = require('bluebird'); // Import promise engine
mongoose.Promise = require('bluebird'); // Tell mongoose we are using the Bluebird promise library
Promise.promisifyAll(mongoose); // Convert mongoose API to always return promises using Bluebird's promisifyAll

// Helper query functions

//Need ObjectID to search by ObjectID
var ObjectId = require('mongodb').ObjectID;

module.exports = function(passport) {
/**
 * This Router handles GET Requests for viewing the vetting home page and specific application pages
 *
 * It also handles the POST requests for adding/updating vetting notes
 *
 * Status codes from models/DocumentPackage.js
     Codes needed are:
     Code - description
     new - new document package, has yet to be reviewed
     phone - document package has been seen, internal agent needs to contact client and verify document package information
     documents - additional documents are needed from the client before document package can proceed
     discuss - internal discussion needs to take place to determine if the document package is approved, denied, handle-it, or other
     visit - a member of catalyst must visit the property to determine the extent of repairs needed
     approval - awaiting the green light to go ahead as a project
     handle - the document package is forwarded to the handle-it team to be completed
     declined - the document package was declined for various reasons
     project - the project has been approved and the document package will be converted to a project package
 **/

// router.post('/csvExport', isLoggedInPost, function(req, res){
// 	var applicationID = req.body.application;
// 	var firstname = req.body.firstname;
// 	var lastname = req.body.lastname;
// 	var query =  "{'_id' : ObjectId("+"'"+applicationID+"'"+")}";
// 	var filename = lastname + '-' + firstname + '-' + applicationID;
// 	const execFile = require('child_process').execFile;
// 	const exec = require('child_process').exec;
// 	const mongoexport_child = execFile('mongoexport', ['-d', 'catalyst',
// 	'-c', 'documentpackages', '-q', query, '-o', 'public/exports/'+filename+'.json', '--port', config.mongo.port],
// 	function(error, stdout, stderr) {
// 		if(error){
// 			console.error('stderr', stderr);
// 			throw error;
// 		}
// 		else{
// 			console.log('stdout', stdout);
// 		}
// 	});


// 	var columns = [
// 	  ["_id.$oid", "Object ID"],
// 		["app_year", "Application Year"],
// 	  ["app_name", "Application ID"],
// 	  ["highlightPackage.$oid", "Highlight Package OID"],
// 	  ["status", "Status"],
// 	  ["signature.client_terms", "Signed?"],
// 	  ["signature.client_sig", "Client Signature"],
// 	  ["signature.client_date.$date", "Signature Date"],
// 	  ["recruitment.fbo_help", "Involved with Faith Based Organization"],
// 	  ["recruitment.fbo_name", "FBO Name"],
// 	  ["property.home_type", "Property Type"],
// 	  ["property.ownership_length", "Length of Property Ownership"],
// 	  ["property.year_constructed", "Year Constructed"],
// 	  ["property.requested_repairs", "Requested Repairs"],
// 	  ["property.associates_can_contribute.value", "Associates can contribute?"],
//     ["property.associates_can_contribute.description", "Associate Labor Contribution"],
// 	  ["property.client_can_contribute.value", "Client can contribute?"],
// 	  ["property.client_can_contribute.description", "Amount Client can contribute"],
// 	  ["finance.requested_other_help.value", "Requested other help?"],
// 	  ["finance.associates_can_contribute.value", "Associates can contribute?"],
// 	  ["finance.associates_can_contribute.description", "Associate Financial Contribution"],
// 	  ["finance.client_can_contribute.value", "Client can contribute?"],
// 	  ["finance.client_can_contribute.amount", "Amount Client can contribute"],
//     ["finance.client_can_contribute.description", "Client Financial Contribution"],
// 	  ["finance.assets.value.0", "Asset Value"],
// 	  ["finance.assets.value.1", "Asset Value"],
// 	  ["finance.assets.value.2", "Asset Value"],
// 	  ["finance.assets.value.3", "Asset Value"],
// 	  ["finance.assets.value.4", "Asset Value"],
// 	  ["finance.assets.name.0", "Asset Name"],
// 	  ["finance.assets.name.1", "Asset Name"],
// 	  ["finance.assets.name.2", "Asset Name"],
// 	  ["finance.assets.name.3", "Asset Name"],
// 	  ["finance.assets.name.4", "Asset Name"],
// 	  ["finance.income.amount", "Income"],
// 	  ["finance.mortgage.payment", "Mortgage Payment"],
// 	  ["finance.mortgage.up_to_date", "Up to Date?"],
// 	  ["application.owns_home", "Client Own Home"],
// 	  ["application.email", "Client Email"],
// 	  ["application.veteran", "Veteran?"],
// 	  ["application.language", "Language Spoken"],
// 	  ["application.heard_about", "How did you hear about us?"],
// 	  ["application.special_circumstances.note", "Special Circumstances"],
// 	  ["application.other_residents.relationship.0", "Other Resident"],
// 	  ["application.other_residents.relationship.1", "Other Resident"],
// 	  ["application.other_residents.relationship.2", "Other Resident"],
// 	  ["application.other_residents.relationship.3", "Other Resident"],
// 	  ["application.other_residents.relationship.4", "Other Resident"],
// 	  ["application.other_residents.relationship.5", "Other Resident"],
// 	  ["application.other_residents.relationship.6", "Other Resident"],
// 	  ["application.other_residents.relationship.7", "Other Resident"],
// 	  ["application.other_residents.age.0", "Other Resident Age"],
// 	  ["application.other_residents.age.1", "Other Resident Age"],
// 	  ["application.other_residents.age.2", "Other Resident Age"],
// 	  ["application.other_residents.age.3", "Other Resident Age"],
// 	  ["application.other_residents.age.4", "Other Resident Age"],
// 	  ["application.other_residents.age.5", "Other Resident Age"],
// 	  ["application.other_residents.age.6", "Other Resident Age"],
// 	  ["application.other_residents.age.7", "Other Resident Age"],
// 	  ["application.other_residents.name.0", "Other Resident Name"],
// 	  ["application.other_residents.name.1", "Other Resident Name"],
// 	  ["application.other_residents.name.2", "Other Resident Name"],
// 	  ["application.other_residents.name.3", "Other Resident Name"],
// 	  ["application.other_residents.name.4", "Other Resident Name"],
// 	  ["application.other_residents.name.5", "Other Resident Name"],
// 	  ["application.other_residents.name.6", "Other Resident Name"],
// 	  ["application.other_residents.name.7", "Other Resident Name"],
// 	  ["application.emergency_contact.name", "Emergency Contact Name"],
// 	  ["application.emergency_contact.relationship", "Emergency Contact Relationship"],
// 	  ["application.emergency_contact.phone", "Emergency Contact Phone"],
// 	  ["application.address.line_1", "Address Line 1"],
// 	  ["application.address.line_2", "Address Line 2"],
// 	  ["application.address.city", "City"],
// 	  ["application.address.state", "State"],
// 	  ["application.address.zip", "Zip"],
// 	  ["application.phone.preferred", "Preferred Phone"],
// 	  ["application.phone.other", "Other Phone"],
// 	  ["application.marital.status", "Marital Status"],
// 	  ["application.marital.spouse", "Spouse name"],
// 	  ["application.driver_license.number", "Driver's License Number"],
// 	  ["application.dob.date.$date", "DOB"],
// 	  ["application.name.first", "First"],
// 	  ["application.name.middle", "Middle"],
// 	  ["application.name.last", "Last"],
// 	  ["application.name.preferred", "Preferred Name"],
// 	  ["advocate.is_advocate", "Is Advocate"],
// 	  ["advocate.individual", "Is Individual"],
// 	  ["advocate.npo", "Is NPO"],
// 	  ["advocate.gov", "Is Government Agency"],
// 	  ["advocate.name", "Advocate Name"],
// 	  ["advocate.phone", "Advocate Phone"],
// 	  ["advocate.relationship", "Advocate Relationship"],
// 	  ["advocate.organization_name", "Advocate Organization Name"],
// 	  ["updated.$date", "Updated on"],
// 	  ["service_area", "In Service Area"],
// 		["notes.vet_summary", "Vetting Summary"],
// 		["finance.total_income.value", "Total Income Value"],
// 		["notes.site_summary", "Site Summary"],
// 		["created.$date", "Date Created"]
// 	]


// 	mongoexport_child.on('exit', function(code, signal){

// 		fs.readFile('public/exports/'+filename+'.json', 'utf8', function(err, data){
// 			if(err) throw err;
// 			var doc = JSON.parse(data);

//       if(fs.existsSync('public/exports/'+filename+'.csv')){

//         fs.unlinkSync('public/exports/'+filename+'.csv');

//       }

// 			//This function "unwraps" the JSON.

// 			ObjectValues = function(v, k){

// 					if(typeof v == 'object'){
// 						for(var kp in v){
// 							if(Object.hasOwnProperty.call(v, kp)){
// 								ObjectValues(v[kp], k != undefined ? k + '.' + kp : kp);
// 							}
// 						}
// 					}
// 					else{
// 						//Iterate through JSON, find match with "columns" array. Rename.
// 						for(iter = 0; iter < columns.length; iter++){
// 							if(columns[iter][0] == k){
// 								k = columns[iter][1];
// 							}
// 						}
// 						var data = k + "," + '"' + v + '"' + "\n";
// 						//console.log(data);
// 						//Write the data to file.
// 						if(!k.includes("level") && !k.includes("__v")){
// 							fs.appendFileSync('public/exports/'+filename+'.csv', data, 'utf8', function(err){
// 								if(err){
// 									return console.error(err);
// 								}
// 							});
// 						}
// 					}
// 			}

// 			ObjectValues(doc);

// 			//Delete JSON once you're done with it.

//       if(fs.existsSync('public/exports/'+filename+'.json')){

//         fs.unlinkSync('public/exports/'+filename+'.json');

//       }


// 		});

// 		if(code !== 0){
// 			res.status(500).send("Export failed: Code 500");
// 			debugger
// 		}
// 		else{
// 			res.status(200).send({status: 'success'});
// 		}

// 	});


// })

// router.get('/file/:name', function(req, res, next){
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


// });

router.post('/csvExport', isLoggedInPost, function(req, res){
	console.log("** MONGOEXPORT CALLED FROM projectsummary.js **");
});

router.get('/', isLoggedIn, api.getProjectsByStatus, api.getSummaryPartners, function(req, res, next) {

    var payload = {};
    payload.part = res.locals.results.part||req.partnerTime;	

    console.log("RR0", payload.part);
    //console.log(payload.part);
   // console.log("RR1" + payload.part.pAssoc["5bf483e823ffa1cde60da1cb"]);


	if (res.locals.results.handle[0] == null) {
        console.log('[ API ] getProjectsByStatus: Unable to find Document Packages with status: \'handle\'');
    } else {
        res.locals.results.handle.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                 
                           element.parts = payload.part.pAssoc[element._id].join("; ");            
                        }
            element = formatElement(element);
		});
    }
    payload.handle = res.locals.results.handle;

    //separate bucket for approved applications
	if (res.locals.results.project[0] == null) {
        console.log('[ API ] getProjectsByStatus: Unable to find Document Packages with status: \'project\'');
    } else {
        res.locals.results.project.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                            
                           if (payload.part.pAssoc[element._id]) {                 
                               element.parts = payload.part.pAssoc[element._id].join("; ");             
                            }             
                        }
            element = formatElement(element);
		});
    }
    payload.project = res.locals.results.project;

    //Storing handle + project output that was sorted by project.date by DB call
	payload.completed = []; 			
    payload.handleToBeAssigned = [];
    payload.handleAssigned = [];
    payload.handleCompleted = [];
    payload.projectUpcoming = [];
    payload.projectInProgress = [];
    payload.projectGoBacks = [];
    payload.projectCompleted = []; 

    payload.handle = [];
    payload.project = []; 
    payload.nostatus = [];  //add unapproved here


	if (res.locals.results.handleToBeAssigned[0] == null) {
        // console.log('[ API ] getProjectsByStatus: No Project Packages whose current status: \'handleToBeAssigned\'');
    } else {
    	//console.log('[ API ] getProjectsByStatus: [' + res.locals.results.handleToBeAssigned.length + '] whose current status: \'handleToBeAssigned\'')
        res.locals.results.handleToBeAssigned.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                 
                           element.parts = payload.part.pAssoc[element._id].join("; ");             
                        }
            element = formatElement(element);
            payload.handleToBeAssigned.push(element);
        });
    }

	if (res.locals.results.handle[0] == null) {
        // console.log('[ API ] getProjectsByStatus: No Project Packages whose current status: \'handleToBeAssigned\'');
    } else {
    	console.log('[ API ] getProjectsByStatus: [' + res.locals.results.handle.length + '] whose current status: \'handle\'')
        res.locals.results.handle.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                 
                           element.parts = payload.part.pAssoc[element._id].join("; ");             
                        }
            element = formatDate(element);
            payload.handle.push(element);
        });
    }

	if (res.locals.results.project[0] == null) {
        // console.log('[ API ] getProjectsByStatus: No Project Packages whose current status: \'handleToBeAssigned\'');
    } else {
    	console.log('[ API ] getProjectsByStatus: [' + res.locals.results.project.length + '] whose current status: \'project\'')
        res.locals.results.project.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                 
                           element.parts = payload.part.pAssoc[element._id].join("; ");             
                        }
            element = formatDate(element);
            payload.project.push(element);
        });
    }

    // TODO: Result should be sorted by project.date already in the request DB call.
   	if (res.locals.results.completed[0] == null) {
        // console.log('[ API ] getProjectsByStatus: No Project Packages whose current status: \'completed\'');
    } else {
    	console.log('[ API ] getProjectsByStatus: [' + res.locals.results.completed.length + '] whose current status: \'completed (both handle-its and projects)\'')
        res.locals.results.completed.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                 
                           element.parts = payload.part.pAssoc[element._id].join("; ");             
                        }
            element = formatElement(element);
            payload.completed.push(element);
        });
    }

	if (res.locals.results.handleAssigned[0] == null) {
        //console.log('[ API ] getProjectsByStatus: No Project Packages whose current status: \'handleAssigned\'');
    } else {
    	console.log('[ API ] getProjectsByStatus: [' + res.locals.results.handleAssigned.length + '] No Project Packages whose current status: \'handleAssigned\'');
        res.locals.results.handleAssigned.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                 
                           element.parts = payload.part.pAssoc[element._id].join("; ");             
                        }
            element = formatElement(element);
            payload.handleAssigned.push(element);
        });
    }

	if (res.locals.results.handleCompleted[0] == null) {
        console.log('[ API ] getProjectsByStatus: No Project Packages whose current status: \'handleCompleted\'');
    } else {
        res.locals.results.handleCompleted.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                 
                           element.parts = payload.part.pAssoc[element._id].join("; ");             
                        }
            element = formatElement(element);
            payload.handleCompleted.push(element);
        });
    }

	if (res.locals.results.projectUpcoming[0] == null) {
        console.log('[ API ] getProjectsByStatus: No Project Packages whose current status: \'projectUpcoming\'');
    } else {
        res.locals.results.projectUpcoming.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                 
                           element.parts = payload.part.pAssoc[element._id].join("; ");             
                        }
            element = formatElement(element);
            payload.projectUpcoming.push(element);
        });
    }

	if (res.locals.results.projectInProgress[0] == null) {
        console.log('[ API ] getProjectsByStatus: No Project Packages whose current status: \'projectInProgress\'');
    } else {
        res.locals.results.projectInProgress.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                 
                           element.parts = payload.part.pAssoc[element._id].join("; ");             
                        }
            element = formatElement(element);
            payload.projectInProgress.push(element);
        });
    }

	if (res.locals.results.projectGoBacks[0] == null) {
        console.log('[ API ] getProjectsByStatus: No Project Packages whose current status: \'projectGoBacks\'');
    } else {
        res.locals.results.projectGoBacks.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                 
                           element.parts = payload.part.pAssoc[element._id].join("; ");             
                        }
            element = formatElement(element);
            payload.projectGoBacks.push(element);
        });
    }

	if (res.locals.results.projectCompleted[0] == null) {
        console.log('[ API ] getProjectsByStatus: No Project Packages whose current status: \'projectCompleted\'');
    } else {
        res.locals.results.projectCompleted.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                 
                           element.parts = payload.part.pAssoc[element._id].join("; ");             
                        }
            element = formatElement(element);
            payload.projectCompleted.push(element);
        });
    }

	if (res.locals.results.nostatus[0] == null) {
        console.log('[ API ] getProjectsByStatus: No Project Packages whose current status: \'nostatus\'');
    } else {
        res.locals.results.nostatus.forEach(function (element) {
                       if (payload.part.pAssoc[element._id]) {                 
                           element.parts = payload.part.pAssoc[element._id].join("; ");             
                        }
            element = formatElement(element);
            payload.nostatus.push(element);
        });
    }

	var currentYear = new Date().getFullYear();
	payload.year = [];
	var singleYear = {};

	for(var x=currentYear; x>=2007; x--) {
		singleYear = {"yearValue" : x};
		payload.year.push(singleYear);

	}

	payload.user = req.user._id;
	payload.user_email = res.locals.email;
	payload.user_role = res.locals.role;
	payload.user_roles = res.locals.user_roles;


	res.render('projectsummary', payload);
});

/**
 * Route for adding notes
**/
router.post('/addNote', isLoggedInPost, api.postVettingNote, function(req, res, next) {
    if(res.locals.status != '200'){
        res.status(500).send("Could not add note");
    }
    else{
        res.status(200).send({ status: 'success' });
    }
});

/**
 * Route for deleting notes
 **/
router.post('/delNote', isLoggedInPost, api.removeVettingNote, function deleteNote(req, res, next) {
    if(res.locals.status != '200'){
        res.status(500).send("Could not delete note");
    }
    else{
        res.status(200).send({ status: '200'});
    }
});

/**
 * Route for updating notes
 **/
router.post('/updateNote', isLoggedInPost, api.updateVettingNote, function(req, res, next) {
    if(res.locals.status != '200'){
        res.status(500).send("Could not update note");
    }
    else{
        res.status(200).send({ status: '200'});
    }
});


/* Route to specific application by DocumentPackage Object ID */
router.get('/:id', isLoggedIn, function(req, res, next) {
    //Checking what's in params
    console.log("Rendering application " + ObjectId(req.params.id));

    /* search by _id. */
    Promise.props({
        highlight: HighlightPackage.findOne({ 'documentPackage' : ObjectId(req.params.id)}).lean().execAsync(),
        doc: DocumentPackage.findOne({_id: ObjectId(req.params.id)}).lean().execAsync(),
        vettingNotes: VettingNotePackage.find({applicationId: ObjectId(req.params.id)}).lean().execAsync()
    })
    .then(function(results) {
        // format birth date for display
        if (results.doc.application.dob.date != null) {
            var dobYear = results.doc.application.dob.date.getFullYear();
            //get month and day with padding since they are 0 indexed
            var dobDay = ( "00" + results.doc.application.dob.date.getDate()).slice(-2);
            var dobMon = ("00" + (results.doc.application.dob.date.getMonth()+1)).slice(-2);
            results.doc.application.dob.date = dobYear + "-" + dobMon + "-" + dobDay;
        }
        // format vetting notes dates
        if(results.vettingNotes.length != 0)
        {
            results.vettingNotes.forEach(function(note, index){
                var Year = note.date.getFullYear();
                //get month and day with padding since they are 0 indexed
                var Day = ( "00" + note.date.getDate()).slice(-2);
                var Mon = ("00" + (note.date.getMonth()+1)).slice(-2);
                results.vettingNotes[index].date = Mon + "/" + Day + "/" + Year;
            });
        }

        res.locals.layout = 'b3-layout';        // Change default from layout.hbs to b3-layout.hbs
        results.title = "Application View";     //Page <title> in header
		results.user = req.user._id;

        res.render('b3-view', results);
    })
    .catch(function(err) {
        console.error(err);
    });

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

	// if (element.updated) {
	// 	var Year = element.updated.getFullYear();
	//     //get month and day with padding since they are 0 indexed
	//     var Day = ( "00" + element.updated.getDate()).slice(-2);
	//     var Mon = ("00" + (element.updated.getMonth()+1)).slice(-2);
	//     element.updated = Mon + "/" + Day + "/" + Year;
 // 	}
	
	// //signature date (application date)
	// if(element.signature && element.signature.client_date != "") {
	// var appDate = new Date(element.signature.client_date);
	// var appYear = appDate.getFullYear();
	// var appDay = ("00" + appDate.getDate()).slice(-2);
	// var appMon = ("00" + (appDate.getMonth()+1)).slice(-2);
	// element.signature.client_date = appMon + "/" + appDay + "/" + appYear;

	// }

	if(element.project && element.project.project_start && element.project.project_start != "") {
	var appDate = new Date(element.project.project_start);
	var appYear = appDate.getFullYear();
	var appDay = ("00" + appDate.getDate()).slice(-2);
	var appMon = ("00" + (appDate.getMonth()+1)).slice(-2);
	element.project.project_start = appMon + "/" + appDay + "/" + appYear;
    element.project.project_start_full_date = appYear + "/" + appMon + "/" + appDay;
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
        case 'waitlist':
			status = 'On Waitlist';
			break;
        default:
            status = element.status;
    }

    element.status = status;
    return element;
}

//module.exports = router;
return router;
}

//check to see if user is logged in and a vetting agent or an admin
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
