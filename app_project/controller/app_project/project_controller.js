var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment  = require("../../models/app_project/SiteAssessment"),
    WorkItem        = require("../../models/app_project/WorkItem"),
    MaterialsItem   = require("../../models/app_project/MaterialsItem"),
    AppProject      = require("../../models/app_project/AppProject");

module.exports.get_projects = get_projects;
module.exports.view_projects = view_projects;
module.exports.delete_all_projects = delete_all_projects;

async function get_projects(req, res) {
  var projects = await AppProject.find({})
    // .populate({path: "workItems", model: "WorkItem",
    //     populate: {path: "materialsItems", model: "MaterialsItem"}});
  res.status(200).json(projects);
}

async function view_projects(req, res) {
  res.render("app_project/view_projects", {});
}

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
  res.status(200).end();
}