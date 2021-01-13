var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment  = require("../../models/app_project/SiteAssessment"),
    WorkItem        = require("../../models/app_project/WorkItem"),
    MaterialsItem   = require("../../models/app_project/MaterialsItem"),
    AppProject      = require("../../models/app_project/AppProject");

module.exports.get_projects = get_projects;
module.exports.view_projects = view_projects;

// module.exports.view_project_transfers = view_project_transfers;
// module.exports.view_project_transfer = view_project_transfer;

// async function view_project_transfers(req, res) {
//   var assessments = await SiteAssessment.find({status: "complete",})
//                       .populate("documentPackage");
//   console.log(assessments);
//   res.render("app_project/project_transfers", {assessments: assessments,});
// }

// async function view_project_transfer(req, res) {
//   // var assessment = await SiteAssessment.findById(req.params.assessment_id)
//   //     .populate("documentPackage")
//   //     .populate({path: "workItems", model: "WorkItem", populate: {path: "materialsItems", model: "MaterialsItem"}});
//   res.render("app_project/project_transfer", {assessment_id: req.params.assessment_id,});
// }

async function get_projects(req, res) {
  var projects = await AppProject.find({})
    .populate({path: "workItems", model: "WorkItem",
        populate: {path: "materialsItems", model: "MaterialsItem"}});
  res.status(200).json(projects);
}

async function view_projects(req, res) {
  res.render("app_project/view_projects", {});
}