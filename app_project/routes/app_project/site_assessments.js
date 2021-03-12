// site_assessments.js - Route module for site_assessment

var express = require('express');
var router = express.Router();

var assessment_controller = require('../../controller/app_project/assessment_controller.js');

router.get('/transferred', assessment_controller.getTransferredAssessments);
router.get('/to_transfer', assessment_controller.getToTransferAssessments);
router.get('/applications', assessment_controller.getApplicationsInAssessment);

router.route('/:assessment_id')
  .get(assessment_controller.get_site_assessment)
  .patch(assessment_controller.edit_site_assessment);
router.patch('/:assessment_id/partners', assessment_controller.set_partners);

router.get('/paf_form/:assessment_id', assessment_controller.get_paf_page);
router.get('/handleit_form/:assessment_id', assessment_controller.get_handleit_form);

// router.get('/application/:application_id', assessment_controller.getSiteAssessmentByAppId);

module.exports = router;