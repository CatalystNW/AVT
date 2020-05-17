
// var mongoose = require('mongoose');
// var db = require('../../../mongoose/connection');
var CareApplicant = require('../../models/care/careApplicant');
var CareContact = require('../../models/care/careContact');

// Check that all required data was provided using fields obj
// into body of request
function check_care_application(req_body) {
  for (field in fields_map) {
    if (fields_map[field]["required"]) {
      if (req_body[field] == undefined || req_body[field].length <= 0){
        console.log("missing");
        console.log(field);
        return false;
      }
    }
  }
  return true;
}

function transform_app_with_services_data(applicant) {
  applicant.createdAt = applicant.createdAt.toLocaleString();
  applicant.updatedAt = applicant.updatedAt.toLocaleString();
  applicant.self = "./view_application/" + applicant._id;
  applicant.add_services_url = "./add_service/" + applicant._id;

  for (var j=0; j<applicant.services.length; j++) {
    transform_serviceData(applicant.services[j])
  }
}

function transform_serviceData(service) {
  service.createdAt = service.createdAt.toLocaleString();
  service.updatedAt = service.updatedAt.toLocaleString();
  service.service_date = service.service_date.toLocaleString();
}

module.exports.check_care_application = check_care_application;
module.exports.create_care_applicant = create_care_applicant;
module.exports.get_applicant = get_applicant;
module.exports.update_application = update_application;
module.exports.get_applications = get_applications;
module.exports.get_application_by_id = get_application_by_id;

async function get_applications(req, res) {
  if (req.query.show_complete == "false")
    var query = CareApplicant.find({application_status: {$ne : "complete"}});
  else
    var query = CareApplicant.find({});

  apps = await query.populate('services').lean().exec();
  for (var i=0; i<apps.length;i++) {
    // Sort by services_by service_date
    transform_app_with_services_data(apps[i]);

  }
  res.status(200).json(apps);
};

async function get_application_by_id(req, res) {
  var app_id = req.params.application_id;
  var app = await CareApplicant.findById(app_id).populate("services").lean().exec();
  transform_app_with_services_data(app);
  return res.status(200).json(app);
}

async function get_applicant(application_id) {
  var applicant = await CareApplicant.findById(application_id)
    .lean().exec();
  // var contact_ids = applicant.application.contacts;

  // var contacts = await CareContact.find().
  //   .lean().exec();
  
  // applicant.application.contacts = contacts;
  return applicant;
}

async function update_application(req, res) {
  var application_id = req.params.application_id;

  var field, value, old_value, field_obj, o, 
    update_status = false;

  var careApplicant = await CareApplicant.findById(application_id).exec();

  for (field in fields_map) {
    value = req.body[field];
    field_obj = fields_map[field];

    if (value == undefined)
      continue;

    o = careApplicant;
    
    // Split path string into array. Used for navigation
    path_arr = field_obj.path.split("/");
    for (i=0; i< path_arr.length; i++) {
      if (i == path_arr.length - 1) {
        // Update if the values differ
        if (value != o[path_arr[i]]) {
          o[path_arr[i]] = value;
          update_status = true
        }
      }
      else
        o = o[path_arr[i]];
    }
  }
  if (update_status) {
    var result = await careApplicant.save();
    // get back app thru query with populated services obj
    var app = await CareApplicant.findById(application_id).populate("services")
        .lean().exec();
    transform_app_with_services_data(app);
    res.status(200).json(app);
  } else
    res.status(500).end();
}

async function create_care_applicant(req_body) {
  var field;

  var careApplicant = new CareApplicant();
      // careContact = new CareContact();

  var path_arr, i, value, field_obj;

  var year = (new Date()).getFullYear();

  var prev_apps = await CareApplicant.find({ createdAt: { $gte: year, } }).sort({"createdAt": "descending"}).exec();

  // Get prev reference & increment it
  var ref_num;
  if (prev_apps.length > 0) {
    var prev_reference = prev_apps[0].reference;
    var re = /\w+\-\d+\-(\d+)/;
    var result = re.exec(prev_reference);
    ref_num = parseInt(result[1]) + 1;
  } else {
    ref_num = 1;
  }

  careApplicant.reference = `CARE-${year}-${ref_num}`;

  for (field in fields_map) {
    field_obj = fields_map[field];
    
    value = req_body[field];

    if (value == undefined || value.length <= 0)
      continue;

    // Split path string into array. Used for navigation
    path_arr = field_obj.path.split("/");

    var o;
    // if (field_obj.schema == "careApplicant")
      o = careApplicant;
    // else
    //   o = careContact
    
    // Navigate through model objects thru path array
    for (i=0; i< path_arr.length; i++) {
      if (i == path_arr.length - 1)
        o[path_arr[i]] = value;
      else
        o = o[path_arr[i]];
    }
  }
  // Add IDs of each other

  await careApplicant.save();
  return true
}

// Map for names of the HTML inputs, required for db, 
// schema name, & path for schema variable
// Used to check that the forms has these fields
var fields_map = {
  application_status: { // This has a default value
    required: false,
    schema: "careApplicant",
    path: "application_status"
  },
  first_name: {
    required: true,
    schema: "careApplicant",
    path: "application/first_name"
  },
  middle_name: {
    required: false,
    schema: "careApplicant",
    path: "application/middle_name"
  },
  last_name: {
    required: true,
    schema: "careApplicant",
    path: "application/last_name"
  },
  email: {
    required: false,
    schema: "careApplicant",
    path: "application/email"
  },
  phone: {
    required: true,
    schema: "careApplicant",
    path: "application/phone"
  },
  dob: {
    required: true,
    schema: "careApplicant",
    path: "application/dob"
  },
  marital_status: {
    required: true,
    schema: "careApplicant",
    path: "application/marital_status"
  },
  line_1: {
    required: true,
    schema: "careApplicant",
    path: "application/address/line_1"
  },
  line_2: {
    required: false,
    schema: "careApplicant",
    path: "application/address/line_2"
  },
  city: {
    required: true,
    schema: "careApplicant",
    path: "application/address/city"
  },
  state: {
    required: true,
    schema: "careApplicant",
    path: "application/address/state"
  },
  zip: {
    required: true,
    schema: "careApplicant",
    path: "application/address/zip"
  },
  health_issues: {
    required: false,
    schema: "careApplicant",
    path: "application/health_issues"
  },
  help_request: {
    required: true,
    schema: "careApplicant",
    path: "application/help_request"
  },
  home_occupants: {
    required: false,
    schema: "careApplicant",
    path: "application/home_occupants"
  },
  refer_text: {
    required: false,
    schema: "careApplicant",
    path: "application/refer_text"
  },
  signature: {
    required: true,
    schema: "careApplicant",
    path: "application/signature"
  },
  signature_date: {
    required: true,
    schema: "careApplicant",
    path: "application/signature_date"
  },
  contact_name: {
    required: true,
    schema: "careApplicant",
    path: "application/contact_name"
  },
  contact_relationship: {
    required: true,
    schema: "careApplicant",
    path: "application/contact_relationship"
  },
  contact_phone: {
    required: true,
    schema: "careApplicant",
    path: "application/contact_phone"
  },
  contact_email: {
    required: false,
    schema: "careApplicant",
    path: "application/contact_email"
  },
};