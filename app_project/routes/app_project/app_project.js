var express = require('express');
var router = express.Router();

var assessment_controller = require('../../controller/app_project/assessment_controller.js'),
    project_controller = require('../../controller/app_project/project_controller.js');

router.get('/projects_page', assessment_controller.view_projects_page);

router.get('/view_site_assessments', assessment_controller.view_site_assessments);

router.get('/view_site_assessments/:application_id', assessment_controller.view_site_assessment);

router.route('/application/:application_id')
  .get(assessment_controller.get_application_data_api);

router.get('/delete_manager', assessment_controller.view_delete_manager);
router.delete('/delete_manager', assessment_controller.manage_deletion);

router.route('/site_assessment/:application_id')
  .get(assessment_controller.get_site_assessment)
  .patch(assessment_controller.edit_site_assessment);

router.route('/site_assessment/:assessment_id/costsitems')
  .post(assessment_controller.create_costsitem);
router.route('/costsitems/:costsitem_id')
  .delete(assessment_controller.delete_costsitem)
  .patch(assessment_controller.edit_costsitem);

router.post('/workitems', assessment_controller.create_workitem);
router.route('/workitems/:workitem_id')
  .patch(assessment_controller.edit_workitem)
  .delete(assessment_controller.delete_workitem);

router.post('/materialsitem', assessment_controller.create_materialsitem);
router.delete('/materialsitem/:id', assessment_controller.delete_materialsitem);
router.patch('/materialsitem/:id', assessment_controller.edit_materialsitem);

router.get('/project_transfer/:assessment_id', project_controller.view_project_transfer);
router.get('/project_transfer', project_controller.view_project_transfers);

module.exports = router;