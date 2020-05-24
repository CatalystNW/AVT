var CareService = require('../../models/care/careService');
var CareApplicant = require('../../models/care/careApplicant');
var UserPackage = require('../../../models/userPackage');
var CareServiceNote = require('../../models/care/careservicenote');

var helper = require("../helper");

async function get_service_data(service_id) {
  var service = await CareService.findById(service_id).populate("applicant")
    .lean().exec();
  service.service_date = service.service_date.toLocaleString();
  service.applicant.application.dob = service.applicant.application.dob.toLocaleDateString();
  return service;
}

module.exports.post_service = post_service;
module.exports.update_service = update_service;
module.exports.view_services = view_services;
module.exports.get_service_api = get_service_api;
module.exports.get_services_api = get_services_api;
module.exports.view_service = view_service;
module.exports.post_note = post_note;
module.exports.get_notes = get_notes;



async function post_service(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      var applicant_id = req.body.applicant_id;

      var service = new CareService();
      service.applicant = applicant_id;
      service.volunteer = req.body.volunteer;
      service.service_date = req.body.service_date;
      service.description = req.body.description;
      if (req.body.status)
        service.status = req.body.status;
      await service.save();

      var applicant = await CareApplicant.findById(applicant_id).exec();
      applicant.services.push(service._id);
      await applicant.save();

      res.status(201).json(service.get_obj());
    }
    
  );
}

async function update_service(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      var service_id = req.params.service_id,
          status = req.body.status,
          volunteer = req.body.volunteer,
          service_date = req.body.service_date,
          description = req.body.description;;

      var service = await CareService.findById(service_id).exec();
      if (status != undefined && status != service.status) {
        service.status = status;
      }
      if (volunteer != undefined) {
        service.volunteer = volunteer;
      }
      if (service_date != undefined) {
        service.service_date = service_date;
      }
      if (description != undefined) {
        service.description = description;
      }
      await service.save();
      res.status(200).json(service.get_obj());
    }
    
  );

  
}

function view_services(req, res) {
  helper.authenticate_view_page(req, res, 
    async (context) => {
      var services = await CareService.find({}).populate("applicant").lean().exec();

      for (var i=0; i<services.length; i++) {
        services[i].view_service_url = "/carenetwork/view_service/" + services[i]._id;
        services[i].service_date = services[i].service_date.toLocaleString();
      }
      context.services = services;
      res.render("care/view_services.hbs", context);
    });
};

async function get_service_api(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      // Get Services
      var service_id = req.params.service_id;
      service = await get_service_data(service_id);
      res.status(200).json(service);
    }
    
  );
     
}

async function get_services_api(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      if (req.query.show_complete == "false") {
        var query = CareService.find({status: {$ne: "complete"}});
      } else {
        var query = CareService.find({});
      }
      services = await query.populate("applicant").lean().exec();
      for (var i=0; i<services.length; i++) {
        services[i].service_date = services[i].service_date.toLocaleString();
        services[i].createdAt = services[i].createdAt.toLocaleString();
      }
      res.status(200).json(services);
    }
    
  );

};

function view_service(req, res) {
  helper.authenticate_view_page(req, res, 
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
    });
};

async function post_note(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
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
    }
  );

  
};

async function get_notes(req, res) {
  helper.authenticate_api(req, res,
    async (context) => {
      var service_id = req.params.service_id;
  
      var service = await CareService.findById(service_id).populate("notes").lean().exec();

      var note;
      for (var i=0; i<service.notes.length; i++) {
        note = service.notes[i];
        note.createdAt = note.createdAt.toLocaleString();
        note.updatedAt = note.updatedAt.toLocaleString();
      }

      res.status(200).json(service.notes);
    }
  );
  
};