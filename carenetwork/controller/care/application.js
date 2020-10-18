var helper = require("../helper");

var CareApplicant = require('../../models/care/careApplicant');

module.exports.view_application_form = view_application_form;
module.exports.view_applications_page = view_applications_page;

module.exports.post_application = post_application;
module.exports.get_applicant_data_api = get_applicant_data_api;
module.exports.update_application = update_application;
module.exports.get_applications = get_applications;

async function view_application_form(req, res) {
  var context = await helper.create_care_context(req, res);

  res.render("care/application_form", context);
}

async function view_applications_page(req, res) {
  helper.authenticate_view_page(req, res, 
    (context) => {
      res.render("care/applications", context);
    });
}

async function get_applicant_data_api(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      var application_id = req.params.application_id
      context.application_id = application_id;
      var application = await CareApplicant.findById(application_id).lean().exec();
      res.status(200).json(application);
    }
  );
}

async function post_application(req, res) {
  var context = await helper.create_care_context(req, res);
  if (CareApplicant.check_care_application(req.body)) { // check that all requried fields are present
    await CareApplicant.create_app(req.body); // Creates only defined properties

    if (context.care_manager) { // Will redirect to applications page
      res.status(201).json({"care_manager_status": true});
    } else {
      res.status(201).end(); // will redirect to catalystnw.org
    }
  } else {
    res.status(404).end(); // Missing fields  
  }
}

async function get_applications(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      if (req.query.show_do_not_contact == "false")
        var query = CareApplicant.find({application_status: {$ne : "do_not_contact"}});
      else
        var query = CareApplicant.find({});

      var apps = await query.populate('services').lean().exec();
      for (var i=0; i<apps.length;i++) {
        // Sort by services_by service_date
        transform_app_with_services_data(apps[i]);
      }
      res.status(200).json(apps);
    }    
  );
};

// gets the application data and sends as JSON. Uss req.params.application_id
async function get_applicant_data_api(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      var application_id = req.params.application_id
      context.application_id = application_id;
      var application = await CareApplicant.findById(application_id)
        .populate("services").lean().exec();
      transform_app_with_services_data(application);
      res.status(200).json(application);
    }
  );
}

// Updates application by id (req.params.application_id) and the data from req.body
async function update_application(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      var application_id = req.params.application_id;

      var field, value, field_obj, o, 
        update_status = false;

      var careApplicant = await CareApplicant.findById(application_id).exec();

      var fields_map = CareApplicant.get_fields_map();

      for (field in fields_map) {
        value = req.body[field];
        field_obj = fields_map[field];

        if (value == undefined || value.length == 0)
          continue;

        o = careApplicant;
        
        // Split path string into array. Used for navigation
        var path_arr = field_obj.path.split("/");
        // Only update those with changed fields & set update_status
        for (var i=0; i< path_arr.length; i++) {
          if (i == path_arr.length - 1) { // end of the navigation array
            // Update if the values differ
            if (value != o[path_arr[i]]) {
              o[path_arr[i]] = value;
              update_status = true
            }
          }
          else { // Continue navigating through the data object
            o = o[path_arr[i]];
          }
        }
      }
      if (update_status) { //update status is flagged only if value was changed
        await careApplicant.save();
      }
      // get back app thru query with populated services obj
      var app = await CareApplicant.findById(application_id).populate("services")
          .lean().exec();
      transform_app_with_services_data(app);
      res.status(200).json(app);
    }  
  );
}

/** Internal functions. Might export to Applicant as static methods instead */

function transform_app_with_services_data(applicant) {
  applicant.createdAt = applicant.createdAt.toLocaleString();
  applicant.updatedAt = applicant.updatedAt.toLocaleString();
  applicant.self = "./view_application/" + applicant._id;
  applicant.add_services_url = "./add_service/" + applicant._id;
  
  var service;
  for (var i=0; i<applicant.services.length; i++) {
    service = applicant.services[i];
    service.createdAt = service.createdAt.toLocaleString();
    service.updatedAt = service.updatedAt.toLocaleString();
    service.service_date = service.service_date.toLocaleString();
  }
}