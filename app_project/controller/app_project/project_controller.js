var DocumentPackage = require("../../../models/documentPackage"),
    SiteAssessment = require("../../models/app_project/SiteAssessment"),
    WorkItem = require("../../models/app_project/WorkItem"),
    MaterialsItem = require("../../models/app_project/MaterialsItem"),
    CostsItem = require("../../models/app_project/CostsItem");

module.exports.view_project_assessment_transfer = view_project_assessment_transfer;

async function view_project_assessment_transfer(req, res) {
  var assessments = await SiteAssessment.find({status: "complete",})
                      .populate("documentPackage");
  console.log(assessments);
  res.render("app_project/project_transfer", {assessments: assessments,});
}