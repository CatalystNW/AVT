const SiteAssessment  = require("../../models/app_project/SiteAssessment"),
      WorkItem        = require("../../models/app_project/WorkItem"),
      MaterialsItem   = require("../../models/app_project/MaterialsItem"),
      AppProject      = require("../../models/app_project/AppProject"),
      PlanChecklist   = require("../../models/app_project/AppProjectPlanChecklist"),
      WrapupChecklist = require("../../models/app_project/ProjectWrapupChecklist");

const authHelper = require("./AuthHelper");

module.exports.delete_all_projects = delete_all_projects;
module.exports.view_delete_manager = view_delete_manager;
module.exports.manage_deletion = manage_deletion;

async function delete_all_projects(req, res) {
  var projects = await AppProject.find({})
      .populate({path: "workItems", model: "WorkItem",
        populate: {path: "materialsItems", model: "MaterialsItem"}});
  for (var project of projects) {
    for (var workItem of project.workItems) {
      await MaterialsItem.deleteMany({workItem: workItem._id});
    }
    await WorkItem.deleteMany({appProject: project._id});
  }
  await AppProject.deleteMany({});
  await PlanChecklist.deleteMany({});
  await WrapupChecklist.deleteMany({});
  res.status(200).end();
}

async function view_delete_manager(req, res) {
  const context = await authHelper.getUserContext(req, res);
  res.render("app_project/delete_manager", context);
}

async function manage_deletion(req, res) {
  var command = req.query.command;

  if (command == "delete_all_assessments") {
    await WorkItem.deleteMany({});
    await SiteAssessment.deleteMany({});
    await MaterialsItem.deleteMany({});
    res.status(200).json({});
  }
}