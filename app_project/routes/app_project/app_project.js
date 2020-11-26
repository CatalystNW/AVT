var express = require('express');
var router = express.Router();

var projects_controller = require('../../controller/app_project/projects_controller.js');

router.get('/projects_page', projects_controller.view_projects_page);

module.exports = router;