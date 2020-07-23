var helper = require("../helper");

// var mongoose = require('mongoose');
// var db = require('../../../mongoose/connection');
var DocumentPackage = require('../../../models/documentPackage');
var CareApplicant = require('../../models/care/careApplicant');

module.exports.view_transfer_page = view_transfer_page;
module.exports.transfer_appvets = transfer_appvets;

async function view_transfer_page(req, res) {
  helper.authenticate_view_page(req, res, 
    async (context) => {
      var search_option = req.query.search_option,
          search_value = req.query.search_value,
          start_date = req.query.start_date,
          end_date = req.query.end_date;

      // If search query paramters are provided, search and populate page with results
      var query;
      if (search_option && search_value) {
        if (search_option == "first_name") {
          query = DocumentPackage.find({ 
            "$or": [
              {"application.name.first": { $regex: search_value, $options: 'i'}},
              {"application.name.preferred": { $regex: search_value, $options: 'i'}},
            ]
          });
        } else if (search_option == "last_name") {
          query = DocumentPackage.find({ 
            "application.name.last": { $regex: search_value, $options: 'i'}});
        } else if (search_option == "reference") {
          query = DocumentPackage.find({ "app_name": search_value});
        } else {
          query = undefined;
        } 
        
      } else if (search_option == "app_date_range" && (start_date || end_date)) {
        var start, end;
        // Use locale time as the cutoff
        if (start_date) {
          start = get_utc_date(start_date);
        }
        if (end_date) {
          end = get_utc_date(end_date);
        }

        if (end) { // extend by a 1 since we'll use less than in query for date
          end = end.setDate(end.getDate() + 1);
        }

        if (start && end) {
          query = DocumentPackage.find({ "created": {
            "$gte": start,
            "$lt": end
          }});
        } else if (start_date) {
          query = DocumentPackage.find({ "created": {
            "$gte": start,
          }});
        } else {
          query = DocumentPackage.find({ "created": {
            "$lt": end
          }});
        }
      }

      if (query) {
        var apps = await query.lean().exec();
        for (var i=0; i<apps.length; i++) {
          apps[i].updated = apps[i].updated.toLocaleString();
          apps[i].created = apps[i].created.toLocaleString();
        }
        context.applicants = apps;
      }

      res.render("care/transfer_appvet", context);
    },
    ["CARE_MANAGER", "PROJECT_MANAGEMENT"]
  );
}

async function transfer_appvets(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      try {
        var app_ids = req.body.app_ids;
        if (app_ids && Array.isArray(app_ids)) {
          for (var i=0; i<app_ids.length; i++) {
            await transfer_appvet(app_ids[i]);
          }
        }

        res.status(200).send();
      } catch(err) {
        console.log(err);
        res.status(500).send();
      }
    },
    ["CARE_MANAGER", "PROJECT_MANAGEMENT"]
  );
}

/** Internal Functions */

function get_utc_date(date_string) {
  var date = new Date(date_string);
  var utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

  return new Date(utc);
}

function create_debug_context() { // testing purposes
  return {
    carenetwork: true,
    user_roles: ["CARE_MANAGER", "PROJECT_MAANGEMENT"],
  }
}

async function transfer_appvet(app_id) {
  try {
    var app = await DocumentPackage.findById(app_id).exec()
    if (app.care_network_transferred) { // Already Transferred
      res.status(400).send();
    } else {
      var marital_status;
      switch(app.application.marital.status) {
        case "Single":
          marital_status = "single"; break;
        case "Married": 
          marital_status = "married"; break;
        case "Widowed": 
          marital_status = "widow"; break;
        default:
          marital_status = "single";
      }

      var other_residents = app.application.other_residents;
      var others_text = "";
      for (var i=0; i< other_residents.count; i++) {
        others_text += `Name: ${other_residents.name[i]} / Age: ${other_residents.age[i]} / Relationship ${other_residents.relationship[i]}\n`;
      }

      // Map DocumentPackage (key in data) to the property names in CareApplicant
      var data = {
        "application_status": "appvet_transferred",
        "first_name": app.application.name.first,
        "preferred_name": app.application.name.preferred,
        "last_name": app.application.name.last,
        "middle_name": app.application.name.middle,

        "dob": app.application.dob.date,

        "marital_status": marital_status,

        "phone": app.application.phone.preferred,
        "other_phone": app.application.phone.other,
        "email": app.application.email,

        "line_1": app.application.address.line_1,
        "line_2": app.application.address.line_2,
        "city": app.application.address.city,
        "zip": app.application.address.zip,
        "state": app.application.address.state,

        "contact_name": app.application.emergency_contact.name,
        "contact_relationship": app.application.emergency_contact.relationship,
        "contact_phone": app.application.emergency_contact.phone,
        "contact_email": app.application.emergency_contact.email,

        "refer_text": app.application.heard_about,
        "health_issues": app.application.special_circumstances.note,

        "application_status": "appvet_transferred",

        "appvet_id": app._id,

        "home_occupants": others_text,
      };

      var care_app = await CareApplicant.create_app(data);

      app.care_network_transferred = true;
      app.care_network_transfer = care_app._id;

      await app.save();

      return true;
    }
    
  } catch(err) {
    return false;
  }
}