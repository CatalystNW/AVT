var express = require('express');
var router = express.Router();

var CareApplicant = require('../../models/care/careApplicant');
var CareService = require('../../models/care/careService');
// var CareContact = require('../../models/care/careContact');

var helper = require("../../controller/helper");
var application_controller = require('../../controller/care/application.js');
var service_controller = require('../../controller/care/service.js');
var appnote_controller = require('../../controller/care/appnote.js');

// router.get('/', helper.isLoggedIn, function(req, res) {
router.get('/', function(req, res) {
  helper.create_user_context(req).then(
    (context) => {
      res.render("care/index", context);
    }
  );
});

// View Page for Applicant Data
router.get('/view_application/:application_id',  function(req, res){
  helper.create_user_context(req).then(
    async (context) => {
      var application_id = req.params.application_id
      context.application_id = application_id;
      // Ajax To Application API used to retrieve application
      // var application = await application_controller.get_applicant(application_id);
      res.render("care/application_page", context);
    }
  );
});

// Edit Applicant Data
router.post('/view_application/:application_id', async function(req, res) {
  var application_id = req.params.application_id;
  await application_controller.update_application(application_id, req.body);
  res.status(200).end();
});

router.get('/application/:application_id', function(req, res){
  helper.create_user_context(req).then(
    async (context) => {
      var application_id = req.params.application_id
      context.application_id = application_id;
      var application = await application_controller.get_applicant(application_id);
      res.status(200).json(application);
    }
  );
});

router.get('/application', function(req, res){
  helper.create_user_context(req).then(
    (context) => {
      res.render("care/application_form", context);
    }
  );
});

router.get('/view_applications', function(req, res){
  helper.create_user_context(req).then(
    (context) => {
      context.applicants = [];
      var app_obj;
      CareApplicant.find({}, function(err, applicants) {
        applicants.forEach(function(applicant) {
          app_obj = {};
          app_obj.id = applicant._id
          app_obj.application_link = "./view_application/" + applicant._id;
          app_obj.services_link = "./view_services/" + applicant._id;
          context.applicants.push(app_obj);
        });
        
        res.render("care/applications", context);
      });
    }
  );
});

router.post('/application', async function(req, res) {
  if (application_controller.check_care_application(req.body)) {
      await application_controller.create_care_applicant(req.body)
      res.status(201).end(); // OK creation
  } else
    res.status(404).end(); // Missing fields
});

// Services Page
router.get('/view_services/:applicant_id', function(req, res) {
  helper.create_user_context(req).then(
    async (context) => {
      var applicant_id = req.params.applicant_id
      context.applicant_id = applicant_id;

      context.services = await service_controller.get_services(applicant_id);
      for (var i=0;i < context.services.length; i++) {
        context.services[i].update_service_url = "/carenetwork/update_service/" + context.services[i]._id;
        context.services[i].view_service_url = "/carenetwork/view_service/" + context.services[i]._id;
      }
      
      context.add_service_url ="/carenetwork/add_service/" + applicant_id;
      res.render("care/services_page.hbs", context);
    }
  );
});

// Add Service Page
router.get('/add_service/:applicant_id', function(req, res) {
  helper.create_user_context(req).then(
    async (context) => {
      var applicant_id = req.params.applicant_id;
      context.applicant_id = applicant_id;

      // Get Users
      context.workers = await service_controller.get_workers();

      res.render("care/add_service.hbs", context);
    }
  );
});

router.post('/add_service/:applicant_id', function(req, res) {
  helper.create_user_context(req).then(
    async (context) => {
      var applicant_id = req.params.applicant_id;
      await service_controller.create_service(applicant_id, req.body);
      // res.status(200).end();
      res.redirect('/carenetwork/view_services/' + req.params.applicant_id);
    });
});

// Update Service Page
router.get('/update_service/:service_id', function(req, res) {
  helper.create_user_context(req).then(
    async (context) => {
      var service_id = req.params.service_id;

      // Get Users
      context.workers = await service_controller.get_workers();

      context.update_page = true;
      context.service_id = service_id;

      res.render("care/add_service.hbs", context);
    }
  );
});

// GET Service API
router.get('/service/:service_id', async function(req, res) {
   // Get Services
   var service_id = req.params.service_id;
   service = await service_controller.get_service(service_id);
   res.status(200).json(service);
});


// Update Service. Redirects back to view_servicse
router.post('/update_service/:service_id', async function(req, res) {
  // Get Services
  var service_id = req.params.service_id;

  var req_body = req.body;
  
  var service = await CareService.findById(service_id).exec();

  service.note = req_body.note;
  service.case_worker = req_body.case_worker;
  service.service_date = req_body.service_date;
  service.save();

  res.redirect('/carenetwork/view_services/' + service.applicant);
});

router.get('/view_service/:service_id', async function(req, res) {
  helper.create_user_context(req).then(
    async (context) => {
      var service_id = req.params.service_id;

      context.service = await service_controller.get_service(service_id);

      console.log(context);

      var applicant_id = context.service.applicant;

      var applicant = await application_controller.get_applicant(applicant_id);

      console.log(applicant);
      context.application = applicant.application;
      var address = applicant.application.address;

      // get Google Maps link
      var google_url = "https://www.google.com/maps/search/?api=1&query=";
      google_url += `${address.line_1} ${address.line_2}, `;
      google_url += `${address.city}, ${address.state}, ${address.zip}`;

      google_url = google_url.replace(/ /g, '+');
      console.log(google_url);
      context.google_map_url = google_url;


      context.service_id = service_id;

      res.render("care/service_page.hbs", context);
    }
  );
});

// Services Page
router.get('/view_services', function(req, res) {
  helper.create_user_context(req).then(
    async (context) => {
      // if (req.user) {
        // var user_id = req.user._id;
        var services = await service_controller.get_services_by_user();

        for (var i=0; i<services.length; i++) {
          services[i].view_service_url = "/carenetwork/view_service/" + services[i]._id;
        }

        context.services = services;
      // }
      
      res.render("care/view_services.hbs", context);
    }
  );
});

router.get('/appnote/:application_id', appnote_controller.get_appnotes);

router.post('/appnote', appnote_controller.post_appnote);

module.exports = router;