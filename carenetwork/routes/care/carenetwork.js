var express = require('express');
var router = express.Router();

var CareApplicant = require('../../models/care/careApplicant');
var CareService = require('../../models/care/careService');
// var CareContact = require('../../models/care/careContact');

var helper = require("../../controller/helper");
var application_controller = require('../../controller/care/application.js');
var service_controller = require('../../controller/care/service.js');
var appnote_controller = require('../../controller/care/appnote.js');

// Welcome Page
// router.get('/', helper.isLoggedIn, function(req, res) {
router.get('/', async function(req, res) {
  var context = await helper.create_care_context(req, res);
  res.render("care/index", context);
});

router.get('/unauthorized', async function(req, res) {
  var context = await helper.create_care_context(req, res);
  res.render("care/unauthorized", context);
});

/** Applications / Applicants */
router.get('/application_form', application_controller.view_application_form);

router.get('/view_applications', application_controller.view_applications_page);

router.put('/applications/:application_id', application_controller.update_application);

router.get('/application/:application_id', application_controller.get_applicant_data_api);

// REST API : GET /applications
router.get('/applications', application_controller.get_applications);

router.get('/applications/:application_id', 
    application_controller.get_application_by_id);

router.post('/application', application_controller.post_application);

// Application Notes for the Applications
router.get('/appnote/:application_id', appnote_controller.get_appnotes);

router.post('/appnote', appnote_controller.post_appnote);


/** Services */

// GET Service API
router.get('/services/:service_id', service_controller.get_service_api);

router.get('/services', service_controller.get_services_api);

router.post('/services', service_controller.post_service);

router.patch('/services/:service_id', service_controller.update_service);

router.post('/services/:service_id/notes', service_controller.post_note);

/* Service View Pages */

router.get('/view_service/:service_id', service_controller.view_service);

router.get('/services/:service_id/notes', service_controller.get_notes);

router.get('/view_services', service_controller.view_services);

module.exports = router;