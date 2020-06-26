var express = require('express');
var router = express.Router();

var helper = require("../../controller/helper");
var application_controller = require('../../controller/care/application.js');
var service_controller = require('../../controller/care/service.js');
var appnote_controller = require('../../controller/care/appnote.js');
var appvett_transfer_controller = require('../../controller/care/appvet_transfer.js');

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

/** Applications Pages */
router.get('/application_form', application_controller.view_application_form);
router.get('/view_applications', application_controller.view_applications_page);

/* Service View Pages */

router.get('/view_service/:service_id', service_controller.view_service);
router.get('/services/:service_id/notes', service_controller.get_notes);
router.get('/view_services', service_controller.view_services);

// REST API : GET /applications
router.route('/applications')
    .get(application_controller.get_applications)
    .post(application_controller.post_application);

router.route('/applications/:application_id')
  .get(application_controller.get_applicant_data_api)
  .put(application_controller.update_application);

// Application Notes for the Applications
router.get('/appnote/:application_id', appnote_controller.get_appnotes);
router.post('/appnote', appnote_controller.post_appnote);
router.put('/appnote/:appnote_id', appnote_controller.edit_appnote);

/** Services */

// GET Service API
router.route('/services')
    .get(service_controller.get_services_api)
    .post(service_controller.post_service);

router.route('/services/:service_id')
  .get(service_controller.get_service_api)
  .patch(service_controller.update_service);

router.post('/services/:service_id/notes', service_controller.post_note);

/* AppVett Transfer */
router.get('/view_appvet_transfer', appvett_transfer_controller.view_transfer_page);

router.post('/transfer_appvets', appvett_transfer_controller.transfer_appvets);

module.exports = router;