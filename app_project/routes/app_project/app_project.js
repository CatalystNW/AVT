var express = require('express');
var router = express.Router();

var document_controller       = require('../../controller/app_project/document_controller.js'),
    assessment_controller       = require('../../controller/app_project/assessment_controller.js'),
    project_controller          = require('../../controller/app_project/project_controller.js'),
    project_transfer_controller = require('../../controller/app_project/project_transfer_controller.js'),
    workitem_controller         = require('../../controller/app_project/workitem_controller.js'),
    materialsitem_controller    = require('../../controller/app_project/materialsitem_controller.js'),
    project_note_controller     = require('../../controller/app_project/project_note_controller.js'),
    partner_controller          = require('../../controller/app_project/partner_controller.js'),
    development_controller          = require('../../controller/app_project/development_controller.js');

router.use('/site_assessments', require("./site_assessments.js"));

router.route('/application/:application_id')
  .get(assessment_controller.get_application_data_api);

router.patch('/document/:application_id/status', document_controller.editDocumentStatus);
router.get('/application/:application_id/workitems', workitem_controller.getWorkitemsByAppId);
router.post('/workitems', workitem_controller.create_workitem);
router.route('/workitems/:workitem_id')
  .patch(workitem_controller.edit_workitem)
  .delete(workitem_controller.delete_workitem);

router.post('/materialsitem', materialsitem_controller.create_materialsitem);
router.delete('/materialsitem/:id', materialsitem_controller.delete_materialsitem);
router.patch('/materialsitem/:id', materialsitem_controller.edit_materialsitem);

router.get('/project_transfer/:assessment_id', project_transfer_controller.view_project_transfer);
router.post('/project_transfer/:assessment_id', project_transfer_controller.transfer_project);
router.get('/project_transfer', project_transfer_controller.view_project_transfers);

router.get('/view_projects', project_controller.view_projects);
router.get('/projects/assignable_users', project_controller.get_task_assignable_users);
router.get('/projects', project_controller.get_projects);
router.get('/projects/:project_id', project_controller.get_project);
router.patch('/projects/:project_id', project_controller.edit_project);

router.get('/view_projects/:project_id', project_controller.view_project);

router.get('/projects/:project_id/plan_checklist', project_controller.get_plan_checklist);
router.get('/projects/:project_id/wrapup_checklist', project_controller.get_wrapup_checklist);

router.post('/checklist/:checklist_id', project_controller.create_checklist_item);
router.delete('/checklist/:checklist_id', project_controller.delete_checklist_item);
router.patch('/checklist/:checklist_id', project_controller.edit_checklist);

router.get('/projects/:project_id/workitems', project_controller.get_work_items);

router.get('/projects/:project_id/notes', project_note_controller.get_project_notes);
router.post('/projects/:project_id/notes', project_note_controller.create_project_note);
router.delete('/projects/:project_id/notes/:note_id', project_note_controller.delete_project_note);
router.patch('/projects/:project_id/notes/:note_id', project_note_controller.edit_project_note);

router.patch('/projects/:project_id/partners', project_controller.set_partners);

router.delete('/partners/:partner_id', partner_controller.delete_partner);
router.patch('/partners/:partner_id', partner_controller.edit_partner);
router.get('/partners', partner_controller.get_all_partners);
router.post('/partners', partner_controller.create_partner);


router.get('/projects/paf_form/:project_id', project_controller.view_paf_page);
router.get('/projects/handleit_form/:project_id', project_controller.view_handleit_form);

// Temporarily delete projects & assessments for testing/development
router.delete('/projects', development_controller.delete_all_projects);
router.get('/delete_manager', development_controller.view_delete_manager);
router.delete('/delete_manager', development_controller.manage_deletion);

module.exports = router;