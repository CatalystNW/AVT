var express = require('express');
var router = express.Router();

var projects_controller = require('../../controller/app_project/projects_controller.js');

router.get('/projects_page', projects_controller.view_projects_page);

router.get('/view_site_assessments', projects_controller.view_site_assessments);

router.get('/view_site_assessments/:application_id', projects_controller.view_site_assessment);

router.route('/application/:application_id')
  .get(projects_controller.get_application_data_api);

router.get('/delete_manager', projects_controller.view_delete_manager);
router.delete('/delete_manager', projects_controller.manage_deletion);

router.get('/site_assessment/:application_id', projects_controller.get_site_assessment);

router.post('/workitems', projects_controller.create_workitem);
router.patch('/workitems', projects_controller.edit_workitem);

router.post('/materialsitem', projects_controller.create_materialsitem);
router.delete('/materialsitem/:id', projects_controller.delete_materialsitem);
router.patch('/materialsitem/:id', projects_controller.edit_materialsitem);

module.exports = router;