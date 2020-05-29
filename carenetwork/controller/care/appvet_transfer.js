var helper = require("../helper");

// var mongoose = require('mongoose');
// var db = require('../../../mongoose/connection');
var DocumentPackage = require('../../../models/documentPackage');
var CareApplicant = require('../../models/care/careApplicant');

module.exports.view_transfer_page = view_transfer_page;
module.exports.transfer_appvet = transfer_appvet;

async function view_transfer_page(req, res) {
  helper.authenticate_view_page(req, res, 
    async (context) => {
      var search_option = req.query.search_option,
        search_value = req.query.search_value;

      if (search_option && search_value) {
        var query;
        if (search_option == "first_name") {
          query = DocumentPackage.find({ "application.name.first": search_value});
        } else if (search_option == "last_name") {
          query = DocumentPackage.find({ "application.name.last": search_value});
        } else if (search_option == "reference") {
          query = DocumentPackage.find({ "app_name": search_value});
        } else {
          query = undefined;
        }

        if (query) {
          var apps = await query.lean().exec();
          for (var i=0; i<apps.length; i++) {
            apps[i].updated = apps[i].updated.toLocaleString();
            apps[i].created = apps[i].created.toLocaleString();
          }
        }
        context.applicants = apps;
      }

      res.render("care/transfer_appvet", context);
    },
    ["CARE_MANAGER", "PROJECT_MANAGEMENT"]
  );
}

async function transfer_appvet(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      var app_id = req.body.applicant_id;
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

          var data = {
            "application_status": "appvet_transferred",
            "first_name": app.application.name.first,
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

          res.status(200).send();
        }
        
      } catch(err) {
        console.log(err);
        res.status(500).send();
      }
    },
    ["CARE_MANAGER", "PROJECT_MANAGEMENT"]
  );
}