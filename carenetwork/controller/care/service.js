var CareService = require('../../models/care/careService');
var CareApplicant = require('../../models/care/careApplicant');
var UserPackage = require('../../../models/userPackage');
var CareServiceNote = require('../../models/care/careservicenote');

var helper = require("../helper");

async function get_services(applicant_id) {
  var result = await CareService.find({applicant: applicant_id}).lean().exec();
  return result;
}

// Get Service Data only
async function get_service(service_id) {
  var result = await CareService.findById(service_id).populate("applicant").exec();
  return result;
}

async function get_service_data(service_id) {
  var service = await CareService.findById(service_id).populate("applicant")
    .lean().exec();
  service.service_date = service.service_date.toLocaleString();
  service.applicant.application.dob = service.applicant.application.dob.toLocaleDateString();
  return service;
}

exports.post_service = async function(req, res) {
  var applicant_id = req.body.applicant_id;

  var service = new CareService();
  service.applicant = applicant_id;
  service.volunteer = req.body.volunteer;
  service.service_date = req.body.service_date;
  service.description = req.body.description;
  await service.save();

  var applicant = await CareApplicant.findById(applicant_id).exec();
  applicant.services.push(service._id);
  await applicant.save();

  var serviceObj = {
    applicant: service.applicant,
    volunteer: service.volunteer,
    service_date: service.service_date.toLocaleString(),
    description: service.description,
    status: service.status,
  }
  res.status(201).json(serviceObj);
}


async function create_service(applicant_id, data) {
  var service = new CareService();
  service.applicant = applicant_id;
  service.volunteer = data.volunteer;
  service.service_date = data.service_date;
  service.description = data.description;
  await service.save();

  var applicant = await CareApplicant.findById(applicant_id).exec();
  applicant.services.push(service._id);
  await applicant.save();

  return true;
}

exports.view_services = function(req, res) {
  helper.create_user_context(req).then(
    async (context) => {
      // if (req.user) {
        // var user_id = req.user._id;
        var services = await CareService.find({}).populate("applicant").lean().exec();

        for (var i=0; i<services.length; i++) {
          services[i].view_service_url = "/carenetwork/view_service/" + services[i]._id;
        }
        context.services = services;
      // }
      res.render("care/view_services.hbs", context);
    }
  );
};

exports.view_service = function(req, res) {
  helper.create_user_context(req).then(
    async (context) => {
      var service_id = req.params.service_id;

      var service = await get_service_data(service_id);
      context.service = service;

      var address = service.applicant.application.address;

      // get Google Maps link
      var google_url = "https://www.google.com/maps/embed/v1/place?key=AIzaSyD2CmgnSECdg_g-aFgp95NUBv2QUEidDvs&q=";
      google_url += `${address.line_1} ${address.line_2}, `;
      google_url += `${address.city}, ${address.state}, ${address.zip}`;

      google_url = google_url.replace(/ /g, '+');

      context.google_map_url = google_url;

      context.service_id = service_id;

      res.render("care/service_page.hbs", context);
    }
  );
};

exports.post_note = async function(req, res) {
  var service_id = req.body.service_id;
  
  var service = await CareService.findById(service_id).populate("notes").exec();

  var serviceNote = new CareServiceNote();
  serviceNote.note = req.body.note;
  serviceNote.service = service_id;

  await serviceNote.save();

  service.notes.push(serviceNote._id);

  await service.save();

  var s = {
    note: serviceNote.note,
    createdAt: serviceNote.createdAt.toLocaleString(),
    updatedAt: serviceNote.updatedAt.toLocaleString(),
    service: serviceNote.service,
  }
  
  res.status(201).json(s);
};

exports.get_notes = async function(req, res) {
  var service_id = req.params.service_id;
  
  var service = await CareService.findById(service_id).populate("notes").lean().exec();

  var note;
  for (var i=0; i<service.notes.length; i++) {
    note = service.notes[i];
    note.createdAt = note.createdAt.toLocaleString();
    note.updatedAt = note.updatedAt.toLocaleString();
  }

  res.status(200).json(service.notes);
};

exports.update_service = async function(req, res) {
  var service_id = req.params.service_id,
      note = req.body.note,
      status = req.body.status;

  var service = await CareService.findById(service_id).exec();
  
  if (note != undefined && service.note != note) {
    service.note = note;
  }
  if (status != undefined && status != service.status) {
    service.status = status;
  }
  await service.save();
  res.status(200).json(service.get_obj());
}

module.exports.get_services = get_services;
module.exports.create_service = create_service;
module.exports.get_service = get_service;